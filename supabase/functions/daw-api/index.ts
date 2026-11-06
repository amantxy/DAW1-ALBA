// DAW1-ALBA · API de calendario
// Ejecutar como Supabase Edge Function: supabase/functions/daw-api/index.ts
// La función usa el JWT del usuario y la clave anon; RLS sigue aplicándose.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

function validDate(value: string | null) {
  return value === null || /^\d{4}-\d{2}-\d{2}$/.test(value);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return response({ error: "Método no permitido" }, 405);

  const url = new URL(req.url);
  const parts = url.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  // Supabase añade /functions/v1/daw-api al path; el último segmento es la ruta.
  const route = parts.slice(parts.lastIndexOf("daw-api") + 1);

  if (route.length === 1 && route[0] === "health") {
    return response({ ok: true, service: "daw-api", version: 1 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const authorization = req.headers.get("Authorization");
  if (!supabaseUrl || !anonKey) return response({ error: "Configuración del servidor incompleta" }, 500);
  if (!authorization?.startsWith("Bearer ")) return response({ error: "Autenticación requerida" }, 401);

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return response({ error: "Sesión no válida" }, 401);

  if (route.length === 1 && route[0] === "events") {
    const tipo = url.searchParams.get("tipo");
    const asignatura = url.searchParams.get("asignatura");
    const desde = url.searchParams.get("desde");
    const hasta = url.searchParams.get("hasta");
    const limitRaw = Number(url.searchParams.get("limit") ?? "100");
    const offsetRaw = Number(url.searchParams.get("offset") ?? "0");

    if (tipo && !["examen", "entrega"].includes(tipo)) return response({ error: "tipo debe ser examen o entrega" }, 400);
    if (!validDate(desde) || !validDate(hasta)) return response({ error: "Las fechas deben tener formato AAAA-MM-DD" }, 400);
    if (!Number.isInteger(limitRaw) || limitRaw < 1 || limitRaw > 200) return response({ error: "limit debe estar entre 1 y 200" }, 400);
    if (!Number.isInteger(offsetRaw) || offsetRaw < 0) return response({ error: "offset debe ser un entero no negativo" }, 400);

    let query = supabase
      .from("Calendario eventos")
      .select("id,created_at,agenda_id,tipo,asignatura,titulo,fecha,hora", { count: "exact" })
      .order("fecha", { ascending: true })
      .order("hora", { ascending: true })
      .range(offsetRaw, offsetRaw + limitRaw - 1);

    if (tipo) query = query.eq("tipo", tipo);
    if (asignatura) query = query.eq("asignatura", asignatura);
    if (desde) query = query.gte("fecha", desde);
    if (hasta) query = query.lte("fecha", hasta);

    const { data, error, count } = await query;
    if (error) return response({ error: "No se pudieron consultar los eventos", detail: error.message }, 400);
    return response({ data: data ?? [], pagination: { total: count ?? 0, limit: limitRaw, offset: offsetRaw } });
  }

  if (route.length === 2 && route[0] === "events" && /^\d+$/.test(route[1])) {
    const { data, error } = await supabase
      .from("Calendario eventos")
      .select("id,created_at,agenda_id,tipo,asignatura,titulo,fecha,hora")
      .eq("id", Number(route[1]))
      .maybeSingle();
    if (error) return response({ error: "No se pudo consultar el evento", detail: error.message }, 400);
    if (!data) return response({ error: "Evento no encontrado" }, 404);
    return response({ data });
  }

  return response({ error: "Ruta no encontrada", routes: ["GET /health", "GET /events", "GET /events/:id"] }, 404);
});
