/* Lecciones ampliadas: Bases de Datos (fundamentos, SQL, programación, objeto-relacional).
   Resumen propio basado en los apuntes de abrilcode (CC BY-SA 4.0, F. Valdeón). */
(function () {
  var A = window.AGREGA;
  var BD = function (u, t) { return { href: 'https://bbdd.abrilcode.com/doku.php?id=' + u, text: t }; };

  A('bd', {
    t: 'Fundamentos: SGBD, ACID y tipos de bases de datos',
    h: '<p>Un <b>fichero</b> es un conjunto de registros con estructura homogénea. Una <b>base de datos</b> es un conjunto de ficheros interrelacionados gestionado por un <b>SGBD</b> (Sistema Gestor de Bases de Datos), que añade una capa de abstracción y se ocupa de la consistencia, la disponibilidad y el espacio. El motor tiene un <b>administrador de almacenamiento</b>, un <b>procesador de consultas</b> (elige el <i>plan de ejecución</i>) y un <b>gestor de transacciones</b>.</p><p><b>Funciones del SGBD:</b> organizar la BD, controlar el acceso (usuarios y privilegios), evitar la <b>redundancia</b> (datos duplicados) y la <b>inconsistencia</b> (copias con valores distintos), gestionar el acceso concurrente y las copias de seguridad.</p><p><b>Propiedades ACID</b> de las transacciones: <b>A</b>tomicidad (se hace entera o no se hace), <b>C</b>onsistencia (no viola las reglas de integridad), <b>A</b>islamiento (las transacciones concurrentes no se estorban) y <b>D</b>urabilidad (lo confirmado persiste). Ejemplo: una transferencia bancaria nunca puede hacer solo la mitad.</p><p><b>Tipos según el modelo:</b> <b>relacional</b> (tablas; MySQL, Oracle), <b>XML</b> (jerárquico), <b>orientado a objetos</b>, <b>objeto-relacional</b> (PostgreSQL) y <b>NoSQL</b> (MongoDB, Cassandra: escalabilidad horizontal, sin JOIN y normalmente sin ACID). Según tamaño: ligera (SQLite), ofimática (Access) y de alto rendimiento. Pueden ser <b>centralizadas</b> o <b>distribuidas</b>.</p>',
    ref: BD('bloque1:fundamentos', 'Bloque 1 · Fundamentos de bases de datos (abrilcode)'),
    quiz: [
      { q: 'En ACID, la "A" significa…', o: ['Acceso', 'Atomicidad', 'Almacenamiento', 'Auditoría'], a: 1, e: 'La operación se realiza completa o no se realiza.' },
      { q: '¿Qué es la inconsistencia?', o: ['Duplicar un dato', 'Que las copias duplicadas tengan valores distintos', 'Borrar una tabla', 'Perder la conexión'], a: 1, e: 'La redundancia es duplicar; la inconsistencia, que no coincidan.' },
      { q: 'La característica principal de NoSQL es…', o: ['Usar JOIN', 'La escalabilidad horizontal', 'Garantizar siempre ACID', 'Usar solo tablas'], a: 1, e: 'Añadir nodos mantiene el rendimiento.' },
      { q: 'SQLite es una base de datos…', o: ['Ligera', 'Distribuida', 'NoSQL', 'Orientada a objetos'], a: 0, e: 'Sin instalación; se usa, por ejemplo, en Android.' }
    ]
  }, { t: 'Une cada propiedad ACID', tipo: 'parejas', data: {
    intro: 'Relaciona cada propiedad con su significado.',
    pares: [['Atomicidad', 'Se hace entera o no se hace'], ['Consistencia', 'No viola las reglas de integridad'], ['Aislamiento', 'Las transacciones concurrentes son independientes'], ['Durabilidad', 'Lo confirmado persiste ante fallos']] } });

  A('bd', {
    t: 'SQL: INSERT, UPDATE, DELETE y SELECT',
    h: '<p>El <b>DML</b> manipula los datos: <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> y <code>SELECT</code>.</p><pre>INSERT INTO usuarios (dni, nombre) VALUES (\'123A\', \'Ana\'), (\'456B\', \'Luis\');\nUPDATE pistas SET precio = precio * 1.10 WHERE tipo = \'tenis\';\nDELETE FROM pistas WHERE id = 10;</pre><p>⚠ Sin <code>WHERE</code>, <code>UPDATE</code> y <code>DELETE</code> afectan a <b>todas</b> las filas.</p><p>Orden de un <b>SELECT</b>: <code>SELECT</code> columnas · <code>FROM</code> tablas · <code>WHERE</code> · <code>GROUP BY</code> · <code>HAVING</code> · <code>ORDER BY</code> · <code>LIMIT</code>.</p><pre>SELECT DISTINCT nombre, apellidos\nFROM usuarios\nWHERE ciudad = \'Zaragoza\' AND descuento BETWEEN 0.1 AND 0.2\nORDER BY apellidos ASC\nLIMIT 5;</pre><p><b>Operadores:</b> <code>= &lt; &gt; &lt;= &gt;= &lt;&gt;</code>, <code>AND OR NOT</code>, <code>LIKE</code> (<code>%</code> cualquier cadena, <code>_</code> un carácter), <code>IN</code>, <code>BETWEEN</code> (incluye los límites) e <code>IS NULL</code> (nunca con <code>=</code>).</p><p><b>Transacciones:</b> <code>START TRANSACTION</code> … <code>COMMIT</code> (confirma) o <code>ROLLBACK</code> (deshace).</p>',
    ref: BD('bloque3:tratamiento', 'Bloque 3 · Tratamiento de datos (abrilcode)'),
    quiz: [
      { q: '¿Qué pasa con DELETE FROM pistas; (sin WHERE)?', o: ['Nada', 'Borra todas las filas', 'Da error', 'Borra la tabla'], a: 1, e: 'La tabla queda vacía pero sigue existiendo.' },
      { q: 'Para comprobar si un campo es nulo se usa…', o: ['= NULL', 'IS NULL', 'LIKE NULL', '== NULL'], a: 1, e: 'Con = nunca funciona con NULL.' },
      { q: 'LIKE \'A%\' devuelve los valores que…', o: ['Terminan en A', 'Empiezan por A', 'Contienen solo A', 'Tienen una letra'], a: 1, e: '% sustituye cualquier secuencia de caracteres.' },
      { q: '¿Qué hace ROLLBACK?', o: ['Confirma los cambios', 'Deshace los cambios de la transacción', 'Borra la base', 'Crea una vista'], a: 1, e: 'COMMIT confirma.' }
    ]
  }, { t: 'Ordena las cláusulas del SELECT', tipo: 'orden', data: {
    intro: 'Ordena las cláusulas como se escriben en una consulta.',
    items: ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT'] } });

  A('bd', {
    t: 'SQL: agregación, GROUP BY y HAVING',
    h: '<p>Las <b>funciones de agregación</b> resumen un conjunto de filas: <code>COUNT</code> (cuenta filas o valores no nulos), <code>SUM</code>, <code>AVG</code> (media), <code>MIN</code> y <code>MAX</code>. Excepto <code>COUNT</code> (que da 0), si no hay datos devuelven <code>NULL</code>.</p><pre>SELECT COUNT(*) AS total, AVG(precio) AS media\nFROM pistas\nWHERE id_polideportivo = 23;</pre><p><b>GROUP BY</b> agrupa las filas con el mismo valor para aplicar la función a cada grupo. <b>HAVING</b> filtra <i>grupos</i> ya formados; <b>WHERE</b> filtra <i>filas</i> antes de agrupar. En el SELECT, junto a una función de agregación solo puede ir la columna por la que se agrupa.</p><pre>SELECT ciudad, COUNT(*) AS cantidad\nFROM polideportivos\nGROUP BY ciudad\nHAVING COUNT(*) &gt; 2;</pre>',
    ref: BD('bloque3:tratamiento', 'Bloque 3 · Agregación y agrupación (abrilcode)'),
    quiz: [
      { q: '¿Qué filtra HAVING?', o: ['Filas antes de agrupar', 'Grupos ya formados', 'Tablas', 'Columnas'], a: 1, e: 'WHERE filtra filas; HAVING filtra grupos.' },
      { q: '¿Qué devuelve COUNT(*) si la tabla no tiene filas?', o: ['NULL', '0', 'Error', '1'], a: 1, e: 'COUNT es la excepción: devuelve 0.' },
      { q: '¿Qué función calcula la media?', o: ['SUM', 'MEAN', 'AVG', 'MID'], a: 2, e: 'AVG = average.' }
    ]
  }, { t: 'WHERE o HAVING', tipo: 'clasifica', data: {
    intro: '¿Qué cláusula usarías para cada condición?',
    cats: ['WHERE (filas)', 'HAVING (grupos)'],
    items: [['precio > 20', 0], ['ciudad = \'Madrid\'', 0], ['COUNT(*) > 2', 1], ['AVG(nota) >= 5', 1], ['SUM(total) > 1000', 1], ['fecha >= \'2026-01-01\'', 0]] } });

  A('bd', {
    t: 'SQL: JOIN, subconsultas y vistas',
    h: '<p>Un <b>JOIN</b> combina tablas. <b>INNER JOIN</b> devuelve solo las filas con correspondencia en ambas; <b>LEFT OUTER JOIN</b> devuelve todas las de la izquierda y pone <code>NULL</code> si no hay correspondencia (el orden importa); <code>RIGHT</code> es lo inverso.</p><pre>SELECT PP.nombre, P.codigo\nFROM polideportivos PP\nINNER JOIN pistas P ON PP.id = P.id_polideportivo;\n\n-- pistas con sus reservas (también las que tienen 0)\nSELECT P.codigo, COUNT(R.id) AS reservas\nFROM pistas P LEFT OUTER JOIN reservas R ON P.id = R.id_pista\nGROUP BY P.id, P.codigo;</pre><p>Una <b>subconsulta</b> es una consulta dentro de otra (en <code>WHERE</code> con <code>=</code>, <code>&gt;</code>, <code>IN</code>, <code>NOT IN</code> o en <code>FROM</code>):</p><pre>SELECT codigo FROM pistas\nWHERE precio &gt; (SELECT AVG(precio) FROM pistas);</pre><p>Una <b>vista</b> (<code>CREATE VIEW nombre AS SELECT …</code>) es una consulta guardada con nombre: no almacena datos, se recalcula cada vez y siempre está actualizada. Operaciones de conjuntos: <code>UNION</code> (sin repetidos) e <code>INTERSECT</code>.</p>',
    ref: BD('bloque3:tratamiento', 'Bloque 3 · JOIN, subconsultas y vistas (abrilcode)'),
    quiz: [
      { q: '¿Qué devuelve un LEFT JOIN?', o: ['Solo coincidencias', 'Todas las filas de la izquierda (con NULL si no hay pareja)', 'Todas las de la derecha', 'Nada'], a: 1, e: 'Sirve para contar también lo que tiene 0.' },
      { q: 'Una vista…', o: ['Guarda una copia de los datos', 'Es una consulta guardada que se recalcula al usarla', 'Es una tabla física', 'Solo sirve para borrar'], a: 1, e: 'Simplifica consultas complejas.' },
      { q: '¿Qué operador de conjuntos une dos resultados sin repetidos?', o: ['INTERSECT', 'UNION', 'JOIN', 'MINUS'], a: 1, e: 'INTERSECT muestra los comunes.' },
      { q: 'INNER JOIN devuelve…', o: ['Solo filas con correspondencia en ambas tablas', 'Todas las filas', 'Solo la tabla izquierda', 'Solo NULL'], a: 0, e: 'Las filas sin pareja se descartan.' }
    ]
  }, { t: 'Completa la consulta', tipo: 'hueco', data: {
    intro: 'Lista cada cliente con su número de pedidos (también los que tienen 0).',
    code: 'SELECT c.nombre, COUNT(p.id) AS pedidos\nFROM cliente c\n[[0]] pedido p ON c.id = p.id_cliente\n[[1]] c.id, c.nombre;',
    huecos: [{ o: ['LEFT JOIN', 'INNER JOIN', 'UNION'], a: 0 }, { o: ['GROUP BY', 'ORDER BY', 'HAVING'], a: 0 }] } });

  A('bd', {
    t: 'Programación en MySQL: variables, control de flujo y rutinas',
    h: '<p><b>Variables:</b> <code>DECLARE n INT DEFAULT 0;</code>, <code>SET n = 5;</code> o <code>SELECT campo INTO n FROM …</code> (la consulta debe devolver una sola fila).</p><p><b>Control de flujo:</b> <code>IF … THEN … ELSEIF … ELSE … END IF</code>, <code>CASE</code>, y bucles <code>WHILE … DO … END WHILE</code>, <code>REPEAT … UNTIL … END REPEAT</code> (se ejecuta al menos una vez) y <code>LOOP</code> (sin condición: se sale con <code>LEAVE etiqueta</code>). <code>ITERATE</code> vuelve al inicio del bucle. MySQL no tiene <code>FOR</code>.</p><pre>DELIMITER |\nCREATE PROCEDURE ver_pistas()\nBEGIN\n    SELECT * FROM pistas;\nEND |\nDELIMITER ;\n\nCALL ver_pistas();</pre><p>Un <b>procedimiento</b> se ejecuta con <code>CALL</code>; una <b>función</b> (<code>CREATE FUNCTION … RETURNS tipo</code>) devuelve un valor y se usa dentro de consultas. Se borran con <code>DROP PROCEDURE</code> / <code>DROP FUNCTION</code>. <code>DELIMITER</code> cambia el terminador para poder escribir <code>;</code> dentro de la rutina. <code>LAST_INSERT_ID()</code> devuelve el último AUTO_INCREMENT generado.</p><p><b>Ventajas:</b> reutilización, seguridad y menos tráfico de red. <b>Inconveniente:</b> lenguaje limitado y difícil de mantener.</p>',
    ref: BD('bloque4:programacion', 'Bloque 4 · Programación de BD (abrilcode)'),
    quiz: [
      { q: '¿Cómo se ejecuta un procedimiento almacenado?', o: ['RUN', 'CALL', 'EXEC SELECT', 'START'], a: 1, e: 'CALL nombre(...).' },
      { q: '¿Qué bucle de MySQL se ejecuta siempre al menos una vez?', o: ['WHILE', 'REPEAT', 'FOR', 'IF'], a: 1, e: 'REPEAT comprueba la condición al final.' },
      { q: '¿Para qué sirve DELIMITER?', o: ['Para borrar', 'Para cambiar el terminador y poder usar ; dentro de la rutina', 'Para crear vistas', 'Para conectar'], a: 1, e: 'Se vuelve a poner ; al terminar.' },
      { q: '¿Qué diferencia a una función de un procedimiento?', o: ['La función devuelve un valor y se usa en consultas', 'No hay diferencia', 'El procedimiento no existe', 'La función no tiene parámetros'], a: 0, e: 'RETURNS tipo.' }
    ]
  }, { t: 'Procedimiento, función o bucle', tipo: 'clasifica', data: {
    intro: 'Clasifica cada elemento.',
    cats: ['Estructura de control', 'Rutina almacenada'],
    items: [['WHILE … DO', 0], ['REPEAT … UNTIL', 0], ['IF … ELSEIF', 0], ['CREATE PROCEDURE', 1], ['CREATE FUNCTION', 1], ['CALL nombre()', 1]] } });

  A('bd', {
    t: 'Triggers y transacciones en MySQL',
    h: '<p>Por defecto <code>AUTOCOMMIT</code> está activado: cada escritura se confirma sola. Con <code>START TRANSACTION</code> se agrupan operaciones y se termina con <code>COMMIT</code> o <code>ROLLBACK</code>. Solo funcionan en tablas transaccionales (<b>InnoDB</b>). Un manejador <code>DECLARE EXIT HANDLER FOR SQLEXCEPTION</code> puede hacer <code>ROLLBACK</code> ante un error.</p><p>Un <b>trigger</b> (disparador) es una rutina que se ejecuta sola ante un <code>INSERT</code>, <code>UPDATE</code> o <code>DELETE</code>:</p><pre>CREATE TRIGGER comprobar_nota\nBEFORE INSERT ON examenes\nFOR EACH ROW\nBEGIN\n    IF NEW.nota &gt; 10 THEN\n        SET NEW.nota = 10;\n    END IF;\nEND;</pre><ul><li><b>BEFORE:</b> antes de la operación; permite modificar <code>NEW</code>. <b>AFTER:</b> solo si la operación terminó bien.</li><li><code>NEW</code> = fila nueva (INSERT y UPDATE); <code>OLD</code> = fila anterior (UPDATE y DELETE, solo lectura).</li><li>Si el trigger falla, se cancela la operación que lo disparó.</li><li>Usos: campos calculados y <b>auditoría</b>. Gestión: <code>SHOW TRIGGERS;</code> y <code>DROP TRIGGER</code>.</li></ul>',
    ref: BD('bloque4:programacion', 'Bloque 4 · Triggers y transacciones (abrilcode)'),
    quiz: [
      { q: '¿Qué contiene OLD en un trigger de DELETE?', o: ['La fila nueva', 'La fila que se va a borrar', 'Nada', 'Todas las filas'], a: 1, e: 'OLD es la fila anterior (solo lectura).' },
      { q: '¿En qué trigger se puede modificar NEW con SET?', o: ['AFTER', 'BEFORE', 'Ninguno', 'Solo en DELETE'], a: 1, e: 'Los BEFORE pueden corregir los valores antes de guardarlos.' },
      { q: '¿Qué motor soporta transacciones en MySQL?', o: ['MyISAM', 'InnoDB', 'CSV', 'Memory'], a: 1, e: 'Las transacciones solo afectan a tablas transaccionales.' },
      { q: 'Si falla un trigger…', o: ['Se ignora', 'Se cancela la operación que lo disparó', 'Se reinicia el servidor', 'Se borra la tabla'], a: 1, e: 'Por eso sirve para impedir valores no deseados.' }
    ]
  }, { t: 'Completa el trigger', tipo: 'hueco', data: {
    intro: 'Evita que una nota supere 10.',
    code: 'CREATE TRIGGER limitar_nota\n[[0]] INSERT ON examenes\nFOR EACH [[1]]\nBEGIN\n    IF [[2]].nota > 10 THEN SET NEW.nota = 10; END IF;\nEND;',
    huecos: [{ o: ['BEFORE', 'AFTER', 'DURING'], a: 0 }, { o: ['ROW', 'TABLE', 'DATABASE'], a: 0 }, { o: ['NEW', 'OLD', 'THIS'], a: 0 }] } });

  A('bd', {
    t: 'Objeto-relacional con PostgreSQL',
    h: '<p>Una base <b>objeto-relacional</b> amplía el modelo relacional con ideas de la programación orientada a objetos. El ejemplo es <b>PostgreSQL</b> (consola <code>psql</code>, gráfico <i>pgAdmin</i>, usuario por defecto <code>postgres</code>; <code>\\list</code> lista bases y <code>\\dt</code> tablas).</p><p><b>Tipos:</b> <code>TEXT</code> (sin longitud máxima), <code>NUMERIC</code> (precisión, dinero), <code>SERIAL</code> (autonumérico), <b>arrays</b> (<code>TEXT[]</code>, índices desde 1, para atributos multivaluados), <b>tipos compuestos</b> (<code>CREATE TYPE direccion AS (calle TEXT, cp TEXT)</code>, se accede con <code>(direccion).cp</code>) y <b>enumerados</b> (<code>CREATE TYPE … AS ENUM (…)</code>).</p><p><b>Herencia:</b> <code>CREATE TABLE hija (…) INHERITS (padre)</code>; un SELECT sobre el padre incluye las filas de las hijas (<code>ONLY</code> las excluye). <b>Limitación importante:</b> las claves primarias, <code>UNIQUE</code> y claves ajenas <b>no se heredan</b>.</p><p><b>Programación:</b> funciones en SQL o en <b>PL/pgSQL</b> (variables, IF, LOOP, FOR); los <b>procedimientos</b> (desde PostgreSQL 11) se llaman con <code>CALL</code> y sí pueden hacer <code>COMMIT</code>/<code>ROLLBACK</code>. Los triggers llaman a una <i>trigger function</i> y pueden ser por fila o por sentencia.</p>',
    ref: BD('bloque5:objeto-relacionales', 'Bloque 5 · Objeto-relacionales (abrilcode)'),
    quiz: [
      { q: '¿Qué palabra declara la herencia entre tablas en PostgreSQL?', o: ['EXTENDS', 'INHERITS', 'DERIVES', 'PARENT'], a: 1, e: 'La hija incorpora las columnas de la padre.' },
      { q: '¿Qué NO se hereda entre tablas en PostgreSQL?', o: ['Las columnas', 'Claves primarias, UNIQUE y claves ajenas', 'Los nombres de columna', 'Los tipos'], a: 1, e: 'Hay que repetirlas en cada tabla.' },
      { q: 'TEXT[] sirve para…', o: ['Un texto largo', 'Atributos multivaluados (array)', 'Una clave', 'Una vista'], a: 1, e: 'Por ejemplo, varios teléfonos.' },
      { q: '¿Qué comando de psql lista las tablas?', o: ['\\list', '\\dt', '\\connect', 'SHOW TABLES'], a: 1, e: '\\list muestra las bases de datos.' }
    ]
  }, { t: 'MySQL o PostgreSQL', tipo: 'clasifica', data: {
    intro: '¿Dónde se usa cada elemento?',
    cats: ['MySQL / MariaDB', 'PostgreSQL'],
    items: [['AUTO_INCREMENT', 0], ['DELIMITER |', 0], ['SERIAL', 1], ['INHERITS', 1], ['PL/pgSQL', 1], ['CREATE TYPE … AS ENUM', 1]] } });
})();
