-- Mis documentos · DAW 1 ALBA
-- Pega todo esto en Supabase > SQL Editor y pulsa Run.
-- Se puede ejecutar más de una vez sin perder datos.

-- 1. Tabla con los datos de cada documento
create table if not exists public.documentos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  asignatura text not null,
  unidad     text not null,
  titulo     text not null,
  nombre     text not null,
  tipo       text not null check (tipo in ('pdf', 'img', 'docx', 'md', 'txt', 'html', 'video')),
  ruta       text not null unique,
  tamano     bigint not null default 0,
  creado     timestamptz not null default now()
);

create index if not exists documentos_user_id_idx on public.documentos (user_id);

-- 2. Cada persona solo puede ver y tocar sus propias filas
alter table public.documentos enable row level security;

revoke all on public.documentos from anon;
grant select, insert, delete on public.documentos to authenticated;

drop policy if exists "documentos propios" on public.documentos;
create policy "documentos propios" on public.documentos
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 3. Carpeta privada para los archivos (máximo 50 MB por archivo)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documentos', 'documentos', false, 52428800,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png', 'image/jpeg', 'image/gif', 'image/webp',
    'text/markdown', 'text/plain', 'text/html',
    'video/mp4'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 4. Cada persona solo puede usar la subcarpeta con su propio id
drop policy if exists "archivos propios: ver" on storage.objects;
create policy "archivos propios: ver" on storage.objects
  for select to authenticated
  using (bucket_id = 'documentos' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "archivos propios: subir" on storage.objects;
create policy "archivos propios: subir" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documentos' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "archivos propios: borrar" on storage.objects;
create policy "archivos propios: borrar" on storage.objects
  for delete to authenticated
  using (bucket_id = 'documentos' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- 5. Progreso de estudio de cada página (tarjetas, tests y ejercicios)
create table if not exists public.progreso (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  pagina     text not null,
  datos      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, pagina)
);

create or replace function public.progreso_fecha()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end $$;

revoke all on function public.progreso_fecha() from public, anon, authenticated;

drop trigger if exists progreso_fecha on public.progreso;
create trigger progreso_fecha before insert or update on public.progreso
  for each row execute function public.progreso_fecha();

alter table public.progreso enable row level security;

revoke all on public.progreso from anon;
grant select, insert, update on public.progreso to authenticated;

drop policy if exists "progreso propio" on public.progreso;
create policy "progreso propio" on public.progreso
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 6. Contenido privado de la web, solo legible por su propietaria
create table if not exists public.contenido_privado (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  clave   text not null,
  html    text not null,
  primary key (user_id, clave)
);

alter table public.contenido_privado enable row level security;

revoke all on public.contenido_privado from anon;
grant select on public.contenido_privado to authenticated;

drop policy if exists "contenido propio" on public.contenido_privado;
create policy "contenido propio" on public.contenido_privado
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- 7. Acceso por aprobación (nick + contraseña). Las cuentas nuevas nacen "pendiente".
create schema if not exists privado;
grant usage on schema privado to authenticated;

create table if not exists public.perfiles (
  user_id   uuid primary key references auth.users (id) on delete cascade,
  nick      text unique check (nick ~ '^[a-z0-9_.-]{3,20}$'),
  estado    text not null default 'pendiente' check (estado in ('pendiente','aprobado','rechazado')),
  es_admin  boolean not null default false,
  mensaje   text check (char_length(mensaje) <= 200),
  creado    timestamptz not null default now(),
  decidido  timestamptz
);
alter table public.perfiles enable row level security;

create or replace function privado.es_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.perfiles p where p.user_id = (select auth.uid()) and p.es_admin and p.estado = 'aprobado')
$$;
create or replace function privado.es_aprobada() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.perfiles p where p.user_id = (select auth.uid()) and p.estado = 'aprobado')
$$;
revoke all on function privado.es_admin(), privado.es_aprobada() from public, anon;
grant execute on function privado.es_admin(), privado.es_aprobada() to authenticated;

create or replace function privado.perfil_nuevo() returns trigger
language plpgsql security definer set search_path = '' as $$
begin insert into public.perfiles (user_id) values (new.id) on conflict do nothing; return new; end $$;
revoke all on function privado.perfil_nuevo() from public, anon;
drop trigger if exists perfil_nuevo on auth.users;
create trigger perfil_nuevo after insert on auth.users for each row execute function privado.perfil_nuevo();

create or replace function privado.perfil_decide() returns trigger
language plpgsql set search_path = '' as $$
begin if new.estado is distinct from old.estado then new.decidido := now(); end if; return new; end $$;
drop trigger if exists perfil_decide on public.perfiles;
create trigger perfil_decide before update on public.perfiles for each row execute function privado.perfil_decide();

revoke all on public.perfiles from anon, authenticated;
grant select on public.perfiles to authenticated;
grant update (estado) on public.perfiles to authenticated;
drop policy if exists "perfil propio o admin ve" on public.perfiles;
create policy "perfil propio o admin ve" on public.perfiles for select to authenticated
  using ((select auth.uid()) = user_id or (select privado.es_admin()));
drop policy if exists "solo admin decide" on public.perfiles;
create policy "solo admin decide" on public.perfiles for update to authenticated
  using ((select privado.es_admin()))
  with check ((select privado.es_admin()) and not (user_id = (select auth.uid())));

-- La administradora: tu cuenta (cambia el correo por el tuyo)
-- insert into public.perfiles (user_id, estado, es_admin) select id, 'aprobado', true from auth.users where email = 'TU_CORREO'
--   on conflict (user_id) do update set estado = 'aprobado', es_admin = true;

-- Agenda: la ven las cuentas aprobadas y solo la administradora escribe
revoke all on public.agenda from anon;
alter policy "agenda visible para todos" on public.agenda to authenticated using ((select privado.es_aprobada()));
alter policy "agenda solo la duena inserta" on public.agenda to authenticated with check ((select privado.es_admin()));
alter policy "agenda solo la duena cambia" on public.agenda to authenticated using ((select privado.es_admin())) with check ((select privado.es_admin()));
alter policy "agenda solo la duena borra" on public.agenda to authenticated using ((select privado.es_admin()));
