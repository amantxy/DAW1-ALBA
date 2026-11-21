/* Retos del modo gaming: uno por lección (clave "<asignatura>-<n>") y un jefe por asignatura.
   tipo: orden | parejas | hueco | error | clasifica | escribe | binario | preguntas
   Para añadir un reto nuevo, copia uno del mismo tipo y cambia los datos. */
(function () {
  function tiene(doc, sel) { return !!(doc && doc.querySelector(sel)); }
  function cuenta(doc, sel) { return doc ? doc.querySelectorAll(sel).length : 0; }

  var R = {};

  /* ===== Lenguajes de marcas ===== */
  R['marcas-1'] = { t: 'Une cada concepto con su definición', tipo: 'parejas', data: {
    intro: 'Pulsa un concepto de la izquierda y después su definición de la derecha.',
    pares: [
      ['Cliente', 'El navegador, que pide las páginas'],
      ['Servidor', 'El equipo que responde con el documento'],
      ['HTTP', 'Protocolo con el que se comunican navegador y servidor'],
      ['URL', 'Dirección de un recurso en la web'],
      ['HTML', 'Lenguaje de marcas para describir páginas web'],
      ['XML', 'Lenguaje de marcas para describir datos con etiquetas propias']
    ] } };

  R['marcas-2'] = { t: 'Monta el esqueleto de una página', tipo: 'orden', data: {
    intro: 'Ordena las líneas para formar un documento HTML correcto, de arriba abajo.', codigo: true,
    items: ['<!DOCTYPE html>', '<html>', '<head>', '<title>Mi web</title>', '</head>', '<body>', '<p>Hola</p>', '</body>', '</html>']
  } };

  R['marcas-3'] = { t: 'Escribe tu primera página', tipo: 'escribe', data: {
    lang: 'html', intro: 'Escribe HTML que cumpla todos los requisitos. La vista previa se actualiza sola.',
    start: '',
    checks: [
      { d: 'Un título <h1> con texto', f: function (doc) { var h = doc && doc.querySelector('h1'); return !!(h && h.textContent.trim()); } },
      { d: 'Un párrafo <p> con una parte en <strong>', f: function (doc) { return tiene(doc, 'p strong'); } },
      { d: 'Un enlace <a> cuyo href empiece por https://', f: function (doc) { return tiene(doc, 'a[href^="https://"]'); } },
      { d: 'Una imagen <img> con src y un alt que no esté vacío', f: function (doc) { var i = doc && doc.querySelector('img[src]'); return !!(i && (i.getAttribute('alt') || '').trim()); } }
    ],
    sol: '<h1>Mi página</h1>\n<p>Esto es <strong>importante</strong>.</p>\n<a href="https://www.ejemplo.es">Ejemplo</a>\n<img src="foto.jpg" alt="Una foto">' } };

  R['marcas-4'] = { t: 'Construye una lista y una tabla', tipo: 'escribe', data: {
    lang: 'html', intro: 'Crea una lista numerada y una tabla con cabecera.',
    start: '',
    checks: [
      { d: 'Una lista numerada <ol> con al menos 3 <li>', f: function (doc) { return cuenta(doc, 'ol > li') >= 3; } },
      { d: 'Una <table> con al menos una celda de cabecera <th>', f: function (doc) { return tiene(doc, 'table th'); } },
      { d: 'Al menos 2 filas <tr> con celdas <td>', f: function (doc) { var n = 0; [].forEach.call(doc ? doc.querySelectorAll('tr') : [], function (tr) { if (tr.querySelector('td')) n++; }); return n >= 2; } }
    ],
    sol: '<ol>\n<li>Uno</li>\n<li>Dos</li>\n<li>Tres</li>\n</ol>\n<table>\n<tr><th>Nombre</th><th>Edad</th></tr>\n<tr><td>Ana</td><td>17</td></tr>\n<tr><td>Luis</td><td>19</td></tr>\n</table>' } };

  R['marcas-5'] = { t: 'Diseña un formulario', tipo: 'escribe', data: {
    lang: 'html', intro: 'Escribe un formulario de contacto completo.',
    start: '',
    checks: [
      { d: 'Un <form>', f: function (doc) { return tiene(doc, 'form'); } },
      { d: 'Un <label for="..."> enlazado a un <input type="email"> con ese mismo id', f: function (doc) { var l = doc && doc.querySelector('label[for]'); if (!l) return false; var i = doc.getElementById(l.getAttribute('for')); return !!(i && (i.getAttribute('type') || '').toLowerCase() === 'email'); } },
      { d: 'Un <select> con al menos 2 <option>', f: function (doc) { return cuenta(doc, 'select option') >= 2; } },
      { d: 'Un <button>', f: function (doc) { return tiene(doc, 'button'); } }
    ],
    sol: '<form>\n<label for="correo">Correo</label>\n<input type="email" id="correo">\n<select>\n<option>Duda</option>\n<option>Sugerencia</option>\n</select>\n<button>Enviar</button>\n</form>' } };

  R['marcas-6'] = { t: 'Caza los errores del XML', tipo: 'error', data: {
    intro: 'Este XML no está bien formado: hay 3 líneas con errores. Márcalas y comprueba.',
    lines: ['<?xml version="1.0" encoding="UTF-8"?>', '<biblioteca>', '  <libro id=1>', '    <titulo>Cien años de soledad</Titulo>', '    <autor>García Márquez</autor>', '  </libro>', '  <libro id="2">', '    <titulo>El Quijote</titulo>', '    <autor>Cervantes', '  </libro>', '</biblioteca>'],
    bugs: [2, 3, 8] } };

  /* ===== Programación ===== */
  R['prog-1'] = { t: 'Completa el programa', tipo: 'hueco', data: {
    intro: 'Elige la palabra que falta en cada hueco para que el programa compile.',
    code: 'public [[0]] Hola {\n    public static [[1]] main(String[] args) {\n        System.out.[[2]]("Hola, mundo");\n    }\n}',
    huecos: [{ o: ['static', 'class', 'void'], a: 1 }, { o: ['int', 'class', 'void'], a: 2 }, { o: ['echo', 'write', 'println'], a: 2 }] } };

  R['prog-2'] = { t: '¿De qué tipo es cada valor?', tipo: 'clasifica', data: {
    intro: 'Elige el tipo de dato de Java que corresponde a cada valor.',
    cats: ['int', 'double', 'boolean', 'String', 'char'],
    items: [['42', 0], ['-7', 0], ['3.14', 1], ['0.5', 1], ['true', 2], ['false', 2], ['"Hola"', 3], ['"Java"', 3], ["'A'", 4], ["'z'", 4]] } };

  R['prog-3'] = { t: 'Predice la salida', tipo: 'preguntas', data: { qs: [
    { q: '¿Qué escribe este programa?', code: 'int a = 7;\nint b = 2;\nSystem.out.println(a / b);', o: ['3', '3.5', '4', '2'], a: 0, e: 'Con dos int, la división es entera: se descartan los decimales.' },
    { q: '¿Qué escribe este programa?', code: 'int x = 10;\nif (x > 5 && x < 8) {\n    System.out.println("A");\n} else {\n    System.out.println("B");\n}', o: ['A', 'B', 'AB', 'Nada'], a: 1, e: 'x > 5 es true, pero x < 8 es false. Con && deben cumplirse las dos, así que entra el else.' },
    { q: '¿Qué escribe este programa?', code: 'System.out.println(17 % 5);', o: ['3', '2', '3.4', '12'], a: 1, e: 'El % da el resto de la división: 17 = 5 · 3 + 2.' }
  ] } };

  R['prog-4'] = { t: 'Predice la salida de los bucles', tipo: 'preguntas', data: { qs: [
    { q: '¿Qué escribe este bucle?', code: 'for (int i = 1; i <= 3; i++) {\n    System.out.print(i + " ");\n}', o: ['1 2 3', '0 1 2', '1 2 3 4', '3 2 1'], a: 0, e: 'i empieza en 1 y el bucle se repite mientras i <= 3.' },
    { q: '¿Qué valor tiene n al terminar?', code: 'int n = 0;\nwhile (n < 3) {\n    n++;\n}\nSystem.out.println(n);', o: ['2', '3', '4', '0'], a: 1, e: 'n sube de 0 a 3. Cuando vale 3, la condición n < 3 deja de cumplirse.' },
    { q: '¿Qué escribe este programa?', code: 'int s = 0;\nfor (int i = 1; i <= 4; i++) {\n    s = s + i;\n}\nSystem.out.println(s);', o: ['4', '6', '10', '24'], a: 2, e: 's acumula 1 + 2 + 3 + 4 = 10.' }
  ] } };

  /* ===== Entornos de desarrollo ===== */
  R['entornos-1'] = { t: 'Ordena el ciclo de vida del software', tipo: 'orden', data: {
    intro: 'Ordena las fases desde que el cliente pide el programa hasta que se usa.',
    items: ['Análisis: qué necesita el cliente', 'Diseño: cómo se va a construir', 'Codificación: escribir el programa', 'Pruebas: buscar errores', 'Implantación y mantenimiento'] } };

  R['entornos-2'] = { t: 'Elige la figura del diagrama de flujo', tipo: 'clasifica', data: {
    intro: '¿Con qué figura dibujarías cada paso?',
    cats: ['Óvalo', 'Paralelogramo', 'Rectángulo', 'Rombo'],
    items: [['Inicio', 0], ['Fin', 0], ['Leer la edad', 1], ['Escribir "Bienvenido"', 1], ['total = precio * 2', 2], ['contador = 0', 2], ['¿edad >= 18?', 3], ['¿Quedan alumnos por revisar?', 3]] } };

  R['entornos-3'] = { t: 'Aplica las normas de Java', tipo: 'clasifica', data: {
    intro: '¿Qué convención de nombres sigue cada identificador?',
    cats: ['Clase (PascalCase)', 'Variable o método (camelCase)', 'Constante (MAYÚSCULAS)'],
    items: [['CuentaBancaria', 0], ['Alumno', 0], ['ListaDeCompra', 0], ['edadAlumno', 1], ['calcularTotal', 1], ['precioFinal', 1], ['MAX_ALUMNOS', 2], ['IVA_GENERAL', 2]] } };

  R['entornos-4'] = { t: 'Conoce tus herramientas', tipo: 'parejas', data: {
    intro: 'Une cada herramienta con lo que hace.',
    pares: [
      ['IDE', 'Reúne editor, compilador y depurador en un programa'],
      ['Editor', 'Escribe el código con colores y autocompletado'],
      ['Compilador', 'Traduce todo el programa antes de ejecutarlo'],
      ['Intérprete', 'Traduce y ejecuta línea a línea'],
      ['Depurador', 'Ejecuta paso a paso y muestra las variables'],
      ['Eclipse', 'Ejemplo de IDE para Java']
    ] } };

  /* ===== Sistemas informáticos ===== */
  R['sistemas-1'] = { t: 'Clasifica los periféricos', tipo: 'clasifica', data: {
    intro: '¿Es un periférico de entrada, de salida o de entrada y salida?',
    cats: ['Entrada', 'Salida', 'Entrada y salida'],
    items: [['Teclado', 0], ['Ratón', 0], ['Micrófono', 0], ['Monitor', 1], ['Impresora', 1], ['Altavoces', 1], ['Pantalla táctil', 2]] } };

  R['sistemas-2'] = { t: 'Conversión relámpago a binario', tipo: 'binario', data: {
    intro: 'Resuelve 5 conversiones seguidas entre decimal y binario. Cada fallo cuesta una vida.', total: 5 } };

  R['sistemas-3'] = { t: 'Las piezas del sistema operativo', tipo: 'parejas', data: {
    intro: 'Une cada término con su significado.',
    pares: [
      ['Kernel', 'Núcleo, la parte central del sistema operativo'],
      ['Driver', 'Controlador que permite usar un dispositivo'],
      ['Proceso', 'Programa en ejecución que usa la CPU'],
      ['Interfaz', 'Forma de comunicarse con el sistema: gráfica o por comandos'],
      ['Linux', 'Sistema operativo de código abierto'],
      ['Android', 'Sistema operativo de muchos móviles']
    ] } };

  R['sistemas-4'] = { t: 'Maneja la terminal', tipo: 'hueco', data: {
    intro: 'Completa los comandos de Linux para crear un proyecto web.',
    code: '# crear una carpeta llamada web\n[[0]] web\n# entrar en la carpeta\n[[1]] web\n# crear un archivo vacío llamado index.html\n[[2]] index.html\n# ver qué hay dentro\n[[3]]',
    huecos: [{ o: ['touch', 'rm', 'mkdir'], a: 2 }, { o: ['ls', 'cd', 'pwd'], a: 1 }, { o: ['cp', 'touch', 'mkdir'], a: 1 }, { o: ['mv', 'cd', 'ls'], a: 2 }] } };

  /* ===== Bases de datos ===== */
  R['bd-1'] = { t: 'Ventajas e inconvenientes de un SGBD', tipo: 'clasifica', data: {
    intro: 'Implantar una base de datos tiene pros y contras. Clasifica cada punto.',
    cats: ['Ventaja', 'Inconveniente'],
    items: [['Menos redundancia', 0], ['Coherencia: todos usan la misma fuente', 0], ['Mejor disponibilidad de los datos', 0], ['Acceso rápido a la información', 0], ['Hardware y software costosos', 1], ['Hace falta personal muy especializado', 1], ['Implantación laboriosa', 1], ['La rentabilidad no se nota a corto plazo', 1]] } };

  R['bd-2'] = { t: 'Niveles y funciones del SGBD', tipo: 'parejas', data: {
    intro: 'Une cada concepto con su descripción.',
    pares: [
      ['Esquema físico', 'Cómo se guardan realmente los datos en la máquina'],
      ['Esquema conceptual', 'El plano general de los datos y sus relaciones'],
      ['Esquema externo', 'Las vistas: lo que ve cada usuario'],
      ['SGBD', 'Intermediario entre los usuarios y los datos'],
      ['LDD', 'Lenguaje que define la estructura'],
      ['LMD', 'Lenguaje para buscar, añadir, modificar y borrar']
    ] } };

  R['bd-3'] = { t: 'Las 4 fases del diseño', tipo: 'orden', data: {
    intro: 'Ordena las fases del diseño de una base de datos.',
    items: ['Recolección y análisis de requisitos', 'Diseño conceptual (modelo entidad-relación)', 'Diseño lógico-relacional (normalización)', 'Diseño físico (crear la base en el SGBD)'] } };

  R['bd-4'] = { t: 'Tipos de atributos', tipo: 'clasifica', data: {
    intro: '¿Qué tipo de atributo es cada ejemplo?',
    cats: ['Identificador', 'Derivado', 'Multivaluado', 'Compuesto'],
    items: [['DNI del alumno', 0], ['Matrícula del coche', 0], ['Edad (se calcula con la fecha de nacimiento)', 1], ['Antigüedad (años desde el alta)', 1], ['Teléfonos de un cliente', 2], ['Idiomas que habla un empleado', 2], ['Dirección (calle, número y ciudad)', 3], ['Nombre completo (nombre y apellidos)', 3]] } };

  R['bd-5'] = { t: 'Cardinalidad de las relaciones', tipo: 'clasifica', data: {
    intro: '¿Qué cardinalidad total tiene cada relación?',
    cats: ['1:1', '1:N', 'N:M'],
    items: [['Una persona tiene un único DNI y cada DNI es de una sola persona', 0], ['Un coche tiene una matrícula y cada matrícula es de un coche', 0], ['Un cliente hace muchos pedidos, pero cada pedido es de un solo cliente', 1], ['Un departamento tiene muchos empleados, y cada empleado está en un departamento', 1], ['Un alumno cursa varias asignaturas y cada asignatura tiene varios alumnos', 2], ['Un autor escribe varios libros y un libro puede tener varios autores', 2]] } };

  R['bd-6'] = { t: 'Claves e integridad referencial', tipo: 'parejas', data: {
    intro: 'Une cada término con su significado.',
    pares: [
      ['Clave candidata', 'Identifica cada fila de forma única'],
      ['Clave primaria (#)', 'La candidata elegida; no admite nulos'],
      ['Clave alternativa', 'Candidata que no se eligió como primaria'],
      ['Clave ajena (-)', 'Coincide con la clave primaria de otra tabla'],
      ['RESTRICT', 'Solo borra si ninguna otra tabla la referencia'],
      ['CASCADE', 'Borra también las filas que la referencian'],
      ['SET NULL', 'Las claves ajenas que la referencian pasan a nulo']
    ] } };

  R['bd-7'] = { t: 'Pasa del modelo E-R a tablas', tipo: 'hueco', data: {
    intro: 'Usa tu notación: # es clave primaria y - es clave ajena. Completa las tablas.',
    code: '-- Relación 1:N entre CLIENTE y PEDIDO\nCLIENTE(#id_cliente, nombre)\nPEDIDO(#id_pedido, fecha, [[0]])\n\n-- Relación N:M entre ALUMNO y ASIGNATURA\nALUMNO(#id_alumno, nombre)\nASIGNATURA(#id_asignatura, titulo)\nCURSA([[1]], nota)',
    huecos: [{ o: ['#id_cliente', '-id_pedido', '-id_cliente'], a: 2 }, { o: ['#id_alumno, id_asignatura', '-id_alumno', '#(-id_alumno, -id_asignatura)'], a: 2 }] } };

  R['bd-8'] = { t: 'Primera forma normal', tipo: 'clasifica', data: {
    intro: '¿Cumple o no cumple la 1FN?',
    cats: ['Cumple 1FN', 'No cumple 1FN'],
    items: [['Cada celda tiene un solo valor', 0], ['Columnas teléfono1, teléfono2 y teléfono3', 1], ['Un cliente con dos teléfonos ocupa dos filas en una tabla aparte', 0], ['Una celda con el texto «Ana, Luis, Marta»', 1], ['Hay dos filas completamente idénticas', 1], ['Cada fila es distinta de todas las demás', 0]] } };

  R['bd-9'] = { t: 'Diagnostica la normalización', tipo: 'clasifica', data: {
    intro: 'Mira la clave y de qué depende cada dato. ¿Qué forma normal incumple?',
    cats: ['Incumple 2FN', 'Incumple 3FN', 'Cumple'],
    items: [['Clave (DNI, CodCurso); NombreAlumno depende solo del DNI', 0], ['Clave (IdPedido, IdProducto); NombreProducto depende solo de IdProducto', 0], ['Clave DNI; NombreProvincia depende de CodProvincia', 1], ['Clave IdEmpleado; NombreDepartamento depende de CodDepartamento', 1], ['Clave IdAlumno; Nombre y Fecha dependen solo de IdAlumno', 2], ['Clave (IdAlumno, IdAsignatura); Nota depende de ambos', 2]] } };

  var TABLA = 'alumnos\nnombre | edad\nAna    | 17\nLuis   | 19\nMarta  | 21\nPedro  | 16\n\n';
  R['bd-10'] = { t: 'Predice el resultado de la consulta', tipo: 'preguntas', data: { qs: [
    { q: '¿Qué nombres devuelve esta consulta?', code: TABLA + 'SELECT nombre FROM alumnos WHERE edad >= 18;', o: ['Ana y Pedro', 'Luis y Marta', 'Solo Marta', 'Los cuatro'], a: 1, e: 'WHERE filtra: solo cumplen edad >= 18 Luis (19) y Marta (21).' },
    { q: '¿Cuál es la primera fila que devuelve?', code: TABLA + 'SELECT * FROM alumnos ORDER BY edad;', o: ['Ana', 'Marta', 'Pedro', 'Luis'], a: 2, e: 'ORDER BY edad ordena de menor a mayor, y el menor es Pedro (16).' },
    { q: '¿Qué ocurre al ejecutar esto?', code: TABLA + 'UPDATE alumnos SET edad = 18;', o: ['Solo cambia la primera fila', 'Los cuatro alumnos pasan a tener 18', 'Da un error por falta de WHERE', 'No cambia nada'], a: 1, e: 'Sin WHERE, UPDATE modifica todas las filas. Es un error muy típico.' }
  ] } };

  /* ===== Empresa e iniciativa emprendedora ===== */
  R['tsp-1'] = { t: 'Entorno general o específico', tipo: 'clasifica', data: {
    intro: '¿Afecta a todas las empresas (general) o a las de un sector (específico)?',
    cats: ['Entorno general', 'Entorno específico'],
    items: [['Una subida de impuestos', 0], ['La inflación', 0], ['Una nueva tecnología como la inteligencia artificial', 0], ['Cambios en las costumbres de la sociedad', 0], ['Los clientes de la empresa', 1], ['Los proveedores', 1], ['Los competidores del sector', 1]] } };

  R['tsp-2'] = { t: 'Formas jurídicas', tipo: 'parejas', data: {
    intro: 'Une cada forma jurídica con su característica.',
    pares: [
      ['Autónomo', 'Una persona que responde con todos sus bienes'],
      ['Sociedad Limitada', 'Los socios solo responden con lo aportado'],
      ['Sociedad Anónima', 'Capital en acciones, con mínimo de 60.000 €'],
      ['Cooperativa', 'Un socio, un voto'],
      ['Responsabilidad ilimitada', 'Se responde con los bienes personales'],
      ['Capital mínimo de una SL desde 2022', '1 €']
    ] } };

  R['tsp-3'] = { t: 'Haz un análisis DAFO', tipo: 'clasifica', data: {
    intro: 'Clasifica cada situación de un negocio nuevo.',
    cats: ['Debilidad', 'Fortaleza', 'Amenaza', 'Oportunidad'],
    items: [['Equipo con poca experiencia', 0], ['Poco dinero para publicidad', 0], ['Producto muy innovador', 1], ['Buena ubicación del local', 1], ['Llega un competidor grande al mercado', 2], ['Suben los precios de las materias primas', 2], ['Crece la demanda de este tipo de producto', 3], ['Aparece una ayuda pública para emprendedores', 3]] } };

  /* ===== Inglés ===== */
  R['ingles-1'] = { t: 'Construye la frase', tipo: 'orden', data: {
    intro: 'Ordena las palabras para presentarte en el trabajo.',
    items: ['I', 'work', 'as', 'a', 'junior', 'developer', 'at', 'TechSoft'] } };

  R['ingles-2'] = { t: 'IT vocabulary', tipo: 'parejas', data: {
    intro: 'Une cada palabra en inglés con su significado.',
    pares: [['bug', 'error en un programa'], ['to debug', 'corregir errores'], ['database', 'base de datos'], ['server', 'servidor'], ['cloud', 'nube'], ['to upload', 'subir un archivo']] } };

  R['ingles-3'] = { t: 'Ordena el correo profesional', tipo: 'orden', data: {
    intro: 'Ordena las partes de este correo de arriba abajo.',
    items: ['Subject: Meeting on Friday', 'Dear Mr. Smith,', 'Thank you for your email.', 'Could we meet at 10:00 on Friday?', 'I look forward to hearing from you.', 'Kind regards, Alba'] } };

  window.RETOS = R;
  /* Añade una lección nueva al final de una asignatura, con su reto (opcional) */
  window.AGREGA = function (sid, lec, reto) {
    var s = window.DATA.filter(function (x) { return x.id === sid; })[0];
    if (!s) return;
    s.lessons.push(lec);
    if (reto) R[sid + '-' + s.lessons.length] = reto;
  };
  window.JEFES = {
    marcas: 'El Guardián de las Etiquetas', prog: 'El Compilador Furioso', entornos: 'El Bug Supremo', sistemas: 'El Kernel Oscuro',
    bd: 'La Tabla Redundante', tsp: 'El Competidor Implacable', despliegue: 'El Servidor Caído', ingles: 'The Grammar Dragon'
  };
})();
