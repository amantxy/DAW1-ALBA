# API DAW1-ALBA

Edge Function de lectura para consultar los eventos de la tabla `Calendario eventos` de Supabase.

## Rutas

- `GET /functions/v1/daw-api/health` — comprobación básica del servicio.
- `GET /functions/v1/daw-api/events` — lista eventos ordenados por fecha y hora.
- `GET /functions/v1/daw-api/events/:id` — consulta un evento por su ID.

### Filtros de `events`

| Parámetro | Uso |
| --- | --- |
| `tipo` | `examen` o `entrega` |
| `asignatura` | Identificador de asignatura, por ejemplo `bases-de-datos` |
| `desde` | Fecha inicial inclusiva, `AAAA-MM-DD` |
| `hasta` | Fecha final inclusiva, `AAAA-MM-DD` |
| `limit` | 1–200; por defecto 100 |
| `offset` | Desplazamiento; por defecto 0 |

Todas las rutas salvo `health` requieren un JWT de Supabase en `Authorization: Bearer <access_token>`. La función utiliza la clave anon del proyecto y el JWT del usuario, por lo que las políticas RLS de la tabla siguen aplicándose. No necesita ni expone una clave service_role.

## Despliegue manual (cuando se decida)

1. Instala Supabase CLI e inicia sesión.
2. Desde la raíz del repositorio, enlaza el proyecto `ooagxaekxswwrhpsxpjd`.
3. Despliega: `supabase functions deploy daw-api`.
4. Configura el cliente para enviar el access token de la sesión en cada petición.

La función no se despliega automáticamente al subir el código a GitHub. Antes del despliegue hay que confirmar que las políticas RLS de `Calendario eventos` permiten al usuario autenticado leer los eventos previstos.

## Esquema esperado

La función utiliza exclusivamente estas columnas confirmadas: `id`, `created_at`, `agenda_id`, `tipo`, `asignatura`, `titulo`, `fecha` y `hora`.
