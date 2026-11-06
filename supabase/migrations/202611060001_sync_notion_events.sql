-- Ejecutar solo después de comprobar que agenda_id no tiene duplicados.
-- La función de sincronización hace upsert usando esta columna como clave de origen.
select agenda_id, count(*)
from public."Calendario eventos"
where agenda_id is not null
group by agenda_id
having count(*) > 1;

-- Si la consulta anterior no devuelve filas:
create unique index if not exists calendario_eventos_agenda_id_uidx
on public."Calendario eventos" (agenda_id)
where agenda_id is not null;
