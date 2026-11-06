// Sincroniza la base de Notion "Eventos · Cuenta atrás DAW" hacia Supabase.
// Secrets requeridos: NOTION_API_KEY, NOTION_DATA_SOURCE_ID, SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY. Ejecutar solo desde un entorno de confianza.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "https://amantxy.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8" },
  });
}
function richText(p: any): string {
  const v = p?.title ?? p?.rich_text ?? [];
  return Array.isArray(v) ? v.map((x: any) => x.plain_text ?? x.text?.content ?? "").join("") : "";
}
function propText(p: any): string {
  return richText(p);
}
function mapPage(page: any) {
  const p = page.properties ?? {};
  const title = richText(p["Evento"]);
  const date = p["Fecha"]?.date?.start ?? null;
  const type = p["Tipo"]?.select?.name?.toLowerCase() ?? "";
  const subject = propText(p["Asignatura"]).trim().toLowerCase();
  if (!title || !date || !["examen", "entrega"].includes(type) || !subject) return null;
  // Supabase "fecha" es DATE; si Notion contiene hora, se conserva solo la fecha.
  return {
    agenda_id: page.id,
    tipo: type,
    asignatura: subject,
    titulo: title,
    fecha: date.slice(0, 10),
    hora: null,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Usa POST" }, 405);

  const expected = Deno.env.get("SYNC_SECRET");
  const supplied = req.headers.get("x-sync-secret");
  if (!expected || !supplied || supplied !== expected) return json({ error: "No autorizado" }, 401);

  const notionKey = Deno.env.get("NOTION_API_KEY");
  const dataSourceId = Deno.env.get("NOTION_DATA_SOURCE_ID");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!notionKey || !dataSourceId || !supabaseUrl || !serviceKey) {
    return json({ error: "Faltan secrets de configuración" }, 500);
  }

  const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  let cursor: string | undefined;
  let pagesRead = 0;
  const rows: any[] = [];

  try {
    do {
      const response = await fetch(`https://api.notion.com/v1/data_sources/${dataSourceId}/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${notionKey}`,
          "Notion-Version": "2025-09-03",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cursor ? { start_cursor: cursor, page_size: 100 } : { page_size: 100 }),
      });
      if (!response.ok) {
        const detail = await response.text();
        return json({ error: "Notion rechazó la consulta", status: response.status, detail }, 502);
      }
      const result = await response.json();
      pagesRead += result.results?.length ?? 0;
      for (const page of result.results ?? []) {
        const row = mapPage(page);
        if (row) rows.push(row);
      }
      cursor = result.has_more ? result.next_cursor : undefined;
    } while (cursor);

    if (rows.length) {
      const { error } = await db.from("Calendario eventos").upsert(rows, { onConflict: "agenda_id" });
      if (error) return json({
        error: "No se pudieron guardar los eventos en Supabase",
        detail: error.message,
        hint: "Comprueba que agenda_id tiene una restricción UNIQUE y que existen las columnas indicadas.",
        pagesRead, validEvents: rows.length,
      }, 500);
    }
    return json({ ok: true, pagesRead, validEvents: rows.length, synced: rows.length, note: "No se borran filas de Supabase; los registros archivados en Notion no provocan borrados." });
  } catch (error) {
    return json({ error: "Error durante la sincronización", detail: String(error) }, 500);
  }
});
