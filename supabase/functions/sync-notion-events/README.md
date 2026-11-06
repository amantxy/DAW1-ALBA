# Integración Notion → Supabase

La Edge Function `sync-notion-events` importa la base **Eventos · Cuenta atrás DAW** de Notion en la tabla **Calendario eventos** de Supabase.

## Mapeo de propiedades

| Notion | Supabase |
| --- | --- |
| ID de página | `agenda_id` (UUID, identificador de origen) |
| Evento | `titulo` |
| Asignatura | `asignatura` |
| Fecha | `fecha` |
| Tipo (Examen/Entrega) | `tipo` (examen/entrega) |
| Fuente | `fuente` (si existe esa columna) |

Las propiedades `Temario` y `Minutos al día` permanecen en Notion porque no existen como columnas en el esquema Supabase confirmado. La hora queda NULL porque la base de Notion usa fechas y no contiene una propiedad de hora independiente.

## Preparación de Notion

1. Crea una integración interna en Notion y copia su token en un gestor de secretos; no lo publiques.
2. Comparte la base **Eventos · Cuenta atrás DAW** con esa integración.
3. Usa el ID de su data source: `26730b05-0176-457d-b58e-5040547ca00b`.

## Preparación de Supabase

Antes de desplegar, verifica que la tabla `Calendario eventos` contiene `agenda_id` (UUID), `tipo`, `asignatura`, `titulo`, `fecha` y `hora`. Comprueba también que `agenda_id` no contiene duplicados y crea una restricción UNIQUE si todavía no existe. Si no existe `fuente`, no se incluye en el upsert hasta añadirla conscientemente.

Configura estos secrets en Supabase Edge Functions:

- `NOTION_API_KEY`: token de la integración interna de Notion.
- `NOTION_DATA_SOURCE_ID`: `26730b05-0176-457d-b58e-5040547ca00b`.
- `SYNC_SECRET`: secreto aleatorio largo para proteger el endpoint.
- `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`: valores del proyecto, mantenidos exclusivamente en el entorno de servidor.

Despliega con:

```sh
supabase functions deploy sync-notion-events --no-verify-jwt
```

Llama al endpoint mediante POST con la cabecera `x-sync-secret`. No se ejecuta automáticamente al desplegar.

## Seguridad y comportamiento

- El token de Notion y la service role key solo viven en secrets del servidor.
- El endpoint exige `x-sync-secret`; no expone las credenciales.
- La sincronización hace upsert por `agenda_id`; no borra eventos en Supabase.
- Los registros de Notion sin título, fecha, asignatura o tipo válido se omiten.
- La sincronización todavía no está desplegada ni ejecutada. Antes de activarla hay que verificar el esquema real de Supabase y configurar los secrets.
