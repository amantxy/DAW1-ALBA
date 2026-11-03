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
