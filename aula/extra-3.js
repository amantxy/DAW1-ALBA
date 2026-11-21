/* Lecciones ampliadas: Entornos de Desarrollo y Bases de Datos (apuntes de abrilcode, CC BY-SA 4.0, F. Valdeón) */
(function () {
  var A = window.AGREGA;
  var EN = function (u, t) { return { href: 'https://entornos.abrilcode.com/doku.php?id=' + u, text: t }; };
  var BD = function (u, t) { return { href: 'https://bbdd.abrilcode.com/doku.php?id=' + u, text: t }; };

  /* ================= ENTORNOS DE DESARROLLO ================= */
  A('entornos', {
    t: 'Herramientas: IDE, depuración y control de versiones (Git)',
    h: '<p>Un <b>IDE</b> (entorno de desarrollo integrado, como Eclipse o IntelliJ) reúne editor, compilador, depurador y gestión de proyectos. El <b>depurador</b> permite ejecutar paso a paso: <b>breakpoint</b> (punto de ruptura donde se detiene), <b>step into</b> (entrar en el método), <b>step over</b> (pasar al siguiente paso) y <b>step return</b> (salir del método), y ver el valor de las variables (<i>watch</i>).</p><p>El <b>control de versiones</b> guarda la historia del proyecto y permite colaborar. <b>Git</b> es distribuido: cada copia tiene todo el historial. Flujo básico: <code>git init</code>, <code>git add</code> (prepara cambios, <i>staging</i>), <code>git commit -m "mensaje"</code> (guarda una versión), <code>git status</code>, <code>git log</code>, <code>git branch</code> / <code>git checkout</code> (ramas), <code>git merge</code> (fusionar), <code>git clone</code>, <code>git pull</code> (traer) y <code>git push</code> (subir al repositorio remoto, p. ej. GitHub).</p>',
    ref: EN('apuntes:herramientas', 'Herramientas de desarrollo (abrilcode)'),
    quiz: [
      { q: '¿Qué hace un breakpoint?', o: ['Borra una variable', 'Detiene la ejecución en una línea para inspeccionar', 'Compila el código', 'Sube el código a GitHub'], a: 1, e: 'Permite examinar variables paso a paso.' },
      { q: '¿Qué comando guarda una versión en el historial local?', o: ['git push', 'git commit', 'git clone', 'git add'], a: 1, e: 'add prepara los cambios y commit los guarda.' },
      { q: '¿Qué hace git push?', o: ['Descarga cambios', 'Sube los commits al repositorio remoto', 'Crea una rama', 'Deshace un commit'], a: 1, e: 'pull es el inverso: trae cambios.' },
      { q: 'Git es un sistema de control de versiones…', o: ['Centralizado únicamente', 'Distribuido', 'Sin historial', 'Solo para Java'], a: 1, e: 'Cada clon contiene todo el historial.' }
    ]
  }, { t: 'Une comando Git y función', tipo: 'parejas', data: {
    intro: 'Relaciona cada comando con lo que hace.',
    pares: [['git init', 'Crea un repositorio nuevo'], ['git add', 'Prepara cambios para el commit'], ['git commit', 'Guarda una versión'], ['git push', 'Sube al repositorio remoto'], ['git pull', 'Trae cambios del remoto'], ['git branch', 'Gestiona ramas']] } });

  A('entornos', {
    t: 'Refactorización y malos olores del código',
    h: '<p><b>Refactorizar</b> es mejorar la estructura interna del código <b>sin cambiar su comportamiento</b>. Se hace para que sea más legible, mantenible y fácil de ampliar. Antes de refactorizar conviene tener <b>pruebas</b> que confirmen que todo sigue funcionando.</p><p>Los <b>malos olores</b> (<i>bad smells</i>) son señales de que algo conviene mejorar: <b>código duplicado</b>, <b>métodos demasiado largos</b>, <b>clases enormes</b>, <b>demasiados parámetros</b>, <b>nombres poco claros</b>, <b>números mágicos</b> (constantes sin nombre) y comentarios que explican código confuso.</p><p>Técnicas habituales: <b>renombrar</b> variables y métodos, <b>extraer método</b>, <b>extraer constante</b>, <b>mover método</b> a la clase adecuada y <b>eliminar código muerto</b>. Los IDE (Eclipse: <i>Refactor</i>) lo automatizan.</p>',
    ref: EN('apuntes:refactorizacion', 'Refactorización (abrilcode)'),
    quiz: [
      { q: 'Refactorizar consiste en…', o: ['Añadir funcionalidades', 'Mejorar la estructura sin cambiar el comportamiento', 'Borrar el proyecto', 'Traducir el código'], a: 1, e: 'El resultado externo debe ser idéntico.' },
      { q: '¿Cuál es un mal olor típico?', o: ['Nombres claros', 'Código duplicado', 'Pruebas automáticas', 'Métodos cortos'], a: 1, e: 'Duplicar código multiplica los errores.' },
      { q: 'Convertir 3.1416 repetido en una constante PI es…', o: ['Extraer constante', 'Compilar', 'Depurar', 'Un error'], a: 0, e: 'Evita los números mágicos.' }
    ]
  }, { t: 'Detecta el mal olor', tipo: 'clasifica', data: {
    intro: '¿Es un mal olor o una buena práctica?',
    cats: ['Mal olor', 'Buena práctica'],
    items: [['Método de 300 líneas', 0], ['Mismo bloque copiado 5 veces', 0], ['Variable llamada x1', 0], ['Constante MAX_INTENTOS', 1], ['Método con una sola responsabilidad', 1], ['Nombres descriptivos', 1]] } });

  A('entornos', {
    t: 'Pruebas de software: JUnit y TDD',
    h: '<p>Las <b>pruebas</b> verifican que el software cumple lo esperado. Tipos: <b>unitarias</b> (una clase o método), de <b>integración</b> (varias partes juntas), de <b>sistema</b>, de <b>aceptación</b> (las valida el cliente) y de <b>regresión</b> (comprueban que lo nuevo no rompe lo antiguo). Enfoques: <b>caja negra</b> (solo entradas y salidas) y <b>caja blanca</b> (se conoce el código interno).</p><p><b>JUnit</b> es el framework de pruebas unitarias de Java. Se marca cada prueba con <code>@Test</code> y se comprueba con <code>assertEquals(esperado, obtenido)</code>, <code>assertTrue</code>, <code>assertNull</code>… Con <code>@BeforeEach</code> se prepara lo común.</p><pre>@Test\nvoid sumaDosNumeros() {\n    assertEquals(5, Calculadora.suma(2, 3));\n}</pre><p><b>TDD</b> (desarrollo guiado por pruebas): 1) escribe una prueba que falla (rojo), 2) escribe el código mínimo para pasarla (verde), 3) refactoriza.</p>',
    ref: EN('apuntes:pruebas', 'Pruebas de software (abrilcode)'),
    quiz: [
      { q: '¿Qué anotación marca un método de prueba en JUnit?', o: ['@Main', '@Test', '@Run', '@Check'], a: 1, e: '@Test indica que el método es una prueba.' },
      { q: 'En TDD, el primer paso es…', o: ['Escribir todo el código', 'Escribir una prueba que falle', 'Refactorizar', 'Subir a producción'], a: 1, e: 'Rojo → verde → refactorizar.' },
      { q: 'Las pruebas de regresión comprueban…', o: ['Que lo nuevo no rompe lo que ya funcionaba', 'La velocidad de la red', 'El diseño gráfico', 'La licencia'], a: 0, e: 'Se repiten tras cada cambio.' },
      { q: 'Caja negra significa que…', o: ['Se ve el código interno', 'Solo se prueban entradas y salidas', 'No se prueba nada', 'Se prueba el hardware'], a: 1, e: 'En caja blanca sí se conoce el código.' }
    ]
  }, { t: 'Completa la prueba JUnit', tipo: 'hueco', data: {
    intro: 'Completa el test de una calculadora.',
    code: '[[0]]\nvoid restaDosNumeros() {\n    [[1]](2, Calculadora.resta(5, 3));\n}',
    huecos: [{ o: ['@Test', '@Before', '@Main'], a: 0 }, { o: ['assertEquals', 'System.out.println', 'return'], a: 0 }] } });

  A('entornos', {
    t: 'UML: diagramas de clases y de casos de uso',
    h: '<p><b>UML</b> (Lenguaje Unificado de Modelado) es un lenguaje gráfico para modelar software. Hay diagramas <b>estructurales</b> (clases, objetos, componentes) y de <b>comportamiento</b> (casos de uso, secuencia, actividad, estados).</p><p><b>Diagrama de clases:</b> cada clase es una caja con tres zonas: <b>nombre</b>, <b>atributos</b> y <b>métodos</b>. Visibilidad: <code>+</code> público, <code>-</code> privado, <code>#</code> protegido. Relaciones: <b>asociación</b> (línea), <b>herencia</b> (flecha con triángulo vacío hacia la clase padre), <b>agregación</b> (rombo vacío: «tiene un», las partes pueden existir solas), <b>composición</b> (rombo lleno: las partes mueren con el todo) y <b>dependencia</b> (flecha discontinua). Se indica la <b>multiplicidad</b> (1, 0..1, 1..*, *).</p><p><b>Diagrama de casos de uso:</b> muestra qué hace el sistema desde el punto de vista del usuario: <b>actores</b> (monigotes), <b>casos de uso</b> (óvalos) y el límite del sistema. Relaciones <i>include</i> (siempre incluye) y <i>extend</i> (opcional).</p>',
    ref: EN('apuntes:diagramas', 'Diagramas UML (abrilcode)'),
    quiz: [
      { q: 'En UML, el símbolo "-" delante de un atributo significa…', o: ['Público', 'Privado', 'Protegido', 'Estático'], a: 1, e: '+ público, - privado, # protegido.' },
      { q: '¿Qué relación indica que las partes mueren con el todo?', o: ['Agregación', 'Composición', 'Herencia', 'Dependencia'], a: 1, e: 'Rombo lleno.' },
      { q: 'Los actores aparecen en el diagrama de…', o: ['Clases', 'Casos de uso', 'Estados', 'Componentes'], a: 1, e: 'Representan a quienes interactúan con el sistema.' },
      { q: 'La herencia se dibuja con…', o: ['Rombo lleno', 'Flecha con triángulo vacío hacia el padre', 'Línea punteada', 'Un óvalo'], a: 1, e: 'Apunta de la subclase a la superclase.' }
    ]
  }, { t: 'Une símbolo y significado', tipo: 'parejas', data: {
    intro: 'Relaciona cada elemento UML.',
    pares: [['+', 'Visibilidad pública'], ['-', 'Visibilidad privada'], ['#', 'Visibilidad protegida'], ['Rombo lleno', 'Composición'], ['Triángulo vacío', 'Herencia'], ['Óvalo', 'Caso de uso']] } });

  A('entornos', {
    t: 'Gestión de proyectos: cascada, Scrum y XP',
    h: '<p>Un <b>modelo de ciclo de vida</b> organiza las fases del desarrollo: análisis, diseño, codificación, pruebas, implantación y mantenimiento. El <b>modelo en cascada</b> es secuencial (cada fase termina antes de la siguiente): sencillo pero rígido. El <b>modelo en espiral</b> y el <b>incremental</b> repiten ciclos con entregas parciales y gestión de riesgos.</p><p>Las <b>metodologías ágiles</b> priorizan personas, software funcionando, colaboración con el cliente y respuesta al cambio. <b>Scrum</b> trabaja en <b>sprints</b> (iteraciones de 1 a 4 semanas) con tres roles: <b>Product Owner</b> (define prioridades), <b>Scrum Master</b> (facilita el proceso) y <b>equipo de desarrollo</b>. Artefactos: <i>product backlog</i> y <i>sprint backlog</i>. Reuniones: planificación, <b>daily</b> (diaria, 15 min), revisión y retrospectiva.</p><p><b>XP (Programación extrema):</b> pruebas continuas, <b>programación en parejas</b>, integración continua, refactorización y entregas pequeñas y frecuentes.</p>',
    ref: EN('apuntes:proyectos', 'Gestión de proyectos (abrilcode)'),
    quiz: [
      { q: '¿Cuánto dura un sprint en Scrum?', o: ['Entre 1 y 4 semanas', 'Un año', 'Una hora', 'Hasta terminar el proyecto'], a: 0, e: 'Es una iteración corta con entrega.' },
      { q: '¿Quién define las prioridades del producto?', o: ['Scrum Master', 'Product Owner', 'El tester', 'El cliente final siempre'], a: 1, e: 'Gestiona el product backlog.' },
      { q: 'El modelo en cascada se caracteriza por…', o: ['Fases secuenciales sin volver atrás', 'Entregas diarias', 'Programar en parejas', 'No tener análisis'], a: 0, e: 'Es rígido ante los cambios.' },
      { q: 'Programación en parejas es una práctica de…', o: ['Cascada', 'XP', 'UML', 'Git'], a: 1, e: 'Un piloto escribe y un copiloto revisa.' }
    ]
  }, { t: 'Ágil o tradicional', tipo: 'clasifica', data: {
    intro: '¿A qué enfoque pertenece cada práctica?',
    cats: ['Cascada (tradicional)', 'Ágil'],
    items: [['Fases secuenciales cerradas', 0], ['Documentación exhaustiva antes de programar', 0], ['Sprints', 1], ['Daily de 15 minutos', 1], ['Programación en parejas', 1], ['Entregas pequeñas y frecuentes', 1]] } });

  /* ================= BASES DE DATOS ================= */
  A('bd', {
    t: 'Modelo entidad-relación: entidades, atributos y relaciones',
    h: '<p>El <b>modelo entidad-relación (E-R)</b> es el esquema conceptual previo a crear la base de datos. Elementos:</p><ul><li><b>Entidad:</b> objeto o concepto del que guardamos datos (Alumno, Curso). Se dibuja como rectángulo.</li><li><b>Atributo:</b> propiedad de una entidad (nombre, DNI). El <b>identificador</b> (clave) es el atributo que distingue cada ocurrencia y se subraya.</li><li><b>Relación:</b> asociación entre entidades (un Alumno <i>se matricula</i> en un Curso). Se dibuja como rombo.</li></ul><p><b>Cardinalidad:</b> cuántas ocurrencias se relacionan: <b>1:1</b>, <b>1:N</b> y <b>N:M</b>. Se indica con pares (mínimo, máximo), por ejemplo (0,N) o (1,1). El <b>grado</b> es el número de entidades que participa (binaria = 2, ternaria = 3, reflexiva = una entidad consigo misma).</p><p>Un atributo puede ser <b>simple</b> o <b>compuesto</b> (dirección = calle + número), <b>monovaluado</b> o <b>multivaluado</b> (varios teléfonos) y <b>derivado</b> (la edad se calcula a partir de la fecha de nacimiento). Una <b>entidad débil</b> depende de otra para identificarse.</p><p>Se recomienda empezar por un diagrama sencillo y comprobarlo (¿falta algún dato? ¿hay redundancia?). </p>',
    ref: BD('bloque2:diseno#modelo_entidad_relacion', 'Bloque 2 · Diseño: modelo E-R (abrilcode)'),
    quiz: [
      { q: 'En un diagrama E-R, una relación se dibuja como…', o: ['Rectángulo', 'Rombo', 'Óvalo', 'Círculo'], a: 1, e: 'Entidades = rectángulos; atributos = óvalos.' },
      { q: 'Un alumno puede estar en muchos cursos y un curso tiene muchos alumnos. Es…', o: ['1:1', '1:N', 'N:M', '0:0'], a: 2, e: 'Muchos a muchos.' },
      { q: 'Un atributo "edad" calculado desde la fecha de nacimiento es…', o: ['Compuesto', 'Derivado', 'Multivaluado', 'Clave'], a: 1, e: 'Se puede obtener de otro dato.' },
      { q: 'El identificador de una entidad…', o: ['Puede repetirse', 'Distingue cada ocurrencia', 'Es siempre el nombre', 'Es opcional'], a: 1, e: 'Se subraya en el diagrama.' }
    ]
  }, { t: 'Une cada concepto E-R', tipo: 'parejas', data: {
    intro: 'Relaciona cada elemento con su significado.',
    pares: [['Entidad', 'Objeto del que guardamos datos'], ['Atributo', 'Propiedad de una entidad'], ['Relación', 'Asociación entre entidades'], ['Cardinalidad', 'Cuántas ocurrencias se relacionan'], ['Entidad débil', 'Depende de otra para identificarse'], ['Atributo multivaluado', 'Puede tener varios valores']] } });

  A('bd', {
    t: 'Claves: natural frente a subrogada, y E-R reflexivas',
    h: '<p>Una <b>clave candidata</b> es un atributo (o conjunto) que identifica cada fila y es mínimo. La <b>clave primaria</b> es la candidata elegida. Una <b>clave natural</b> usa datos reales (DNI, matrícula); una <b>clave subrogada</b> es un identificador artificial sin significado (un número autoincremental <code>id</code>).</p><p>La subrogada es estable (no cambia nunca), ocupa poco y simplifica las claves foráneas; la natural puede cambiar, repetirse por error o ser larga. Es habitual usar una subrogada y proteger la natural con una restricción <code>UNIQUE</code>.</p><p>Una <b>relación reflexiva</b> (unaria) relaciona una entidad consigo misma: Empleado <i>es jefe de</i> Empleado. Se resuelve añadiendo a la tabla una <b>clave foránea hacia su propia clave primaria</b> (por ejemplo, <code>id_jefe</code>), que puede ser NULL para quien no tiene jefe.</p><p>La <b>jerarquía de herencia</b> (generalización/especialización) se pasa al modelo relacional dejando una tabla para el supertipo y otras para los subtipos con la misma clave, o una sola tabla con un atributo que indique el tipo.</p>',
    ref: BD('bloque2:diseno', 'Bloque 2 · Claves, herencia y reflexivas (abrilcode)'),
    quiz: [
      { q: 'Una clave subrogada es…', o: ['El DNI', 'Un identificador artificial sin significado', 'Una clave foránea', 'Un índice de texto'], a: 1, e: 'Suele ser un número autoincremental.' },
      { q: 'Una relación reflexiva en el modelo relacional se resuelve con…', o: ['Una tabla vacía', 'Una clave foránea a la misma tabla', 'Borrando la relación', 'Un atributo multivaluado'], a: 1, e: 'Ejemplo: empleado.id_jefe → empleado.id.' },
      { q: '¿Qué ventaja tiene la clave subrogada?', o: ['Es estable y no cambia', 'Tiene significado real', 'Evita todas las restricciones', 'Siempre es texto'], a: 0, e: 'Los datos reales pueden cambiar o corregirse.' }
    ]
  }, { t: 'Natural o subrogada', tipo: 'clasifica', data: {
    intro: '¿Qué tipo de clave es cada una?',
    cats: ['Natural', 'Subrogada'],
    items: [['DNI', 0], ['Matrícula del coche', 0], ['ISBN del libro', 0], ['id autoincremental', 1], ['UUID generado', 1], ['Número de fila interno', 1]] } });

  A('bd', {
    t: 'Del modelo E-R al relacional: reglas de transformación',
    h: '<p>Para pasar el esquema E-R al <b>modelo relacional</b> se aplican reglas:</p><ol><li><b>Entidad → tabla.</b> Sus atributos son columnas y el identificador, la clave primaria.</li><li><b>Relación 1:N →</b> la clave primaria del lado «1» pasa como <b>clave foránea</b> a la tabla del lado «N».</li><li><b>Relación N:M →</b> se crea una <b>tabla intermedia</b> con las claves de ambas entidades (juntas forman la clave primaria) y los atributos de la relación.</li><li><b>Relación 1:1 →</b> se pone la clave foránea en cualquiera de las dos tablas (mejor en la de participación obligatoria) o se fusionan en una.</li><li><b>Atributo multivaluado →</b> tabla aparte con la clave de la entidad.</li><li><b>Entidad débil →</b> su clave primaria incluye la clave de la entidad fuerte.</li></ol><p>Ejemplo N:M: Alumno(<u>id_alumno</u>, nombre), Curso(<u>id_curso</u>, titulo) → Matricula(<u>id_alumno</u>, <u>id_curso</u>, nota).</p>',
    ref: BD('bloque2:diseno', 'Bloque 2 · Reglas E-R → relacional (abrilcode)'),
    quiz: [
      { q: 'Una relación N:M se convierte en…', o: ['Una clave foránea', 'Una tabla intermedia con las dos claves', 'Un atributo', 'Nada'], a: 1, e: 'La clave primaria suele ser la unión de ambas claves.' },
      { q: 'En una relación 1:N, la clave foránea va en la tabla del lado…', o: ['1', 'N', 'Ninguna', 'En ambas'], a: 1, e: 'Cada fila de N apunta a su «1».' },
      { q: 'Un atributo multivaluado (varios teléfonos) se pasa a…', o: ['Una columna con comas', 'Una tabla aparte', 'Se elimina', 'Una vista'], a: 1, e: 'Cada valor es una fila de la nueva tabla.' }
    ]
  }, { t: 'Aplica la regla', tipo: 'clasifica', data: {
    intro: '¿Cómo se transforma cada caso?',
    cats: ['Clave foránea', 'Tabla intermedia', 'Tabla aparte'],
    items: [['Departamento 1:N Empleado', 0], ['Cliente 1:N Pedido', 0], ['Alumno N:M Curso', 1], ['Autor N:M Libro', 1], ['Varios teléfonos por persona', 2], ['Varios emails por usuario', 2]] } });

  A('bd', {
    t: 'MySQL: crear bases de datos y tablas (DDL)',
    h: '<p>El <b>DDL</b> (lenguaje de definición de datos) crea y modifica la estructura: <code>CREATE</code>, <code>ALTER</code>, <code>DROP</code>.</p><pre>CREATE DATABASE tienda;\nUSE tienda;\n\nCREATE TABLE cliente (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  nombre VARCHAR(50) NOT NULL,\n  email VARCHAR(80) UNIQUE,\n  alta DATE DEFAULT (CURRENT_DATE)\n);\n\nCREATE TABLE pedido (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  id_cliente INT NOT NULL,\n  total DECIMAL(8,2) CHECK (total >= 0),\n  FOREIGN KEY (id_cliente) REFERENCES cliente(id)\n    ON DELETE CASCADE ON UPDATE CASCADE\n);</pre><p><b>Tipos habituales:</b> <code>INT</code>, <code>DECIMAL(p,s)</code>, <code>VARCHAR(n)</code>, <code>CHAR(n)</code>, <code>TEXT</code>, <code>DATE</code>, <code>DATETIME</code>, <code>BOOLEAN</code>. <b>Restricciones:</b> <code>PRIMARY KEY</code>, <code>FOREIGN KEY</code>, <code>NOT NULL</code>, <code>UNIQUE</code>, <code>DEFAULT</code>, <code>CHECK</code>. Con <code>ON DELETE CASCADE</code> al borrar un cliente se borran sus pedidos.</p><p><b>Modificar:</b> <code>ALTER TABLE cliente ADD telefono VARCHAR(15);</code> · <b>Borrar:</b> <code>DROP TABLE pedido;</code> · <b>Privilegios:</b> <code>GRANT</code> / <code>REVOKE</code>.</p>',
    ref: BD('bloque3:tratamiento', 'Bloque 3 · MySQL y SQL (abrilcode)'),
    quiz: [
      { q: '¿Qué restricción impide valores repetidos pero permite NULL?', o: ['PRIMARY KEY', 'UNIQUE', 'CHECK', 'DEFAULT'], a: 1, e: 'La clave primaria además es NOT NULL.' },
      { q: '¿Qué hace ON DELETE CASCADE?', o: ['Impide borrar', 'Borra también las filas hijas', 'Pone NULL', 'Duplica filas'], a: 1, e: 'Mantiene la integridad referencial.' },
      { q: '¿Qué tipo elegirías para un precio con 2 decimales?', o: ['INT', 'DECIMAL(8,2)', 'DATE', 'CHAR(2)'], a: 1, e: 'DECIMAL evita errores de redondeo.' },
      { q: '¿Con qué sentencia se añade una columna a una tabla existente?', o: ['UPDATE', 'ALTER TABLE', 'INSERT', 'GRANT'], a: 1, e: 'ALTER TABLE … ADD columna tipo;' }
    ]
  }, { t: 'Completa el CREATE TABLE', tipo: 'hueco', data: {
    intro: 'Elige la palabra que falta.',
    code: 'CREATE TABLE producto (\n  id INT AUTO_INCREMENT [[0]],\n  nombre VARCHAR(40) [[1]],\n  precio [[2]](8,2)\n);',
    huecos: [{ o: ['PRIMARY KEY', 'UNIQUE', 'CHECK'], a: 0 }, { o: ['NOT NULL', 'FOREIGN', 'AUTO'], a: 0 }, { o: ['DECIMAL', 'DATE', 'TEXT'], a: 0 }] } });
})();
