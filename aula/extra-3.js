/* Lecciones ampliadas: Entornos de Desarrollo y Bases de Datos (apuntes de abrilcode, CC BY-SA 4.0, F. Valdeón) */
(function () {
  var A = window.AGREGA;
  var EN = function (u, t) { return { href: 'https://entornos.abrilcode.com/doku.php?id=' + u, text: t }; };
  var BD = function (u, t) { return { href: 'https://bbdd.abrilcode.com/doku.php?id=' + u, text: t }; };

  /* ================= ENTORNOS DE DESARROLLO (según los apuntes de abrilcode) ================= */
  A('entornos', {
    t: 'Herramientas: IDE, frameworks y control de versiones (Git)',
    h: '<p>Un <b>IDE</b> integra herramientas para desarrollar: <b>editor</b> (resaltado de sintaxis, autocompletado), <b>compilador/intérprete</b>, <b>depurador</b> (ejecuta instrucción a instrucción y deja examinar variables), <b>asistente GUI</b> (arrastrar componentes) y control de versiones. Un <b>framework</b> es una estructura o patrón para desarrollar aplicaciones (MVC, JUnit, Hibernate, .NET…).</p><p>El <b>control de versiones</b> registra los cambios para recuperar versiones, compararlas o localizar cuándo apareció un error. <b>Centralizado</b> (Subversion): un servidor central; si falla, se pierde el trabajo. <b>Distribuido</b> (Git, Mercurial): cada cliente tiene el repositorio completo, que sirve de copia de seguridad.</p><p><b>Git</b> lo creó Linus Torvalds para el núcleo de Linux. Servidores: GitHub, Bitbucket y GitLab. Cada <i>commit</i> guarda una copia del estado del proyecto en el repositorio local. Estados de un fichero: <b>untracked</b> (sin seguimiento), <b>staged</b> (preparado tras <code>git add</code>), <b>unmodified</b> y <b>modified</b>.</p><p>Comandos: <code>git init</code>, <code>git status</code>, <code>git add .</code>, <code>git commit -m "mensaje"</code>, <code>git push</code>, <code>git pull</code>, <code>git clone url</code> (crea el alias <code>origin</code>), <code>git remote -v</code>, <code>git log --oneline</code>, <code>git checkout</code> (restaurar una versión), <code>git branch develop</code> / <code>git checkout develop</code> / <code>git merge develop</code> (ramas) y <code>git rm -r --cached</code> (dejar de seguir un fichero). El fichero <code>.gitignore</code> lista lo que no se versiona (<code>*.class</code>, <code>bin/</code>). La configuración inicial es <code>git config --global user.name</code> y <code>user.email</code>.</p>',
    ref: EN('apuntes:herramientas', 'Herramientas de desarrollo (abrilcode)'),
    quiz: [
      { q: '¿Qué ocurre en un control de versiones centralizado si falla el servidor?', o: ['Nada, todos tienen copia', 'Se puede perder el trabajo', 'Se pasa a Git', 'Se borra el IDE'], a: 1, e: 'En el distribuido cada cliente conserva el repositorio completo.' },
      { q: '¿Qué estado tiene un fichero tras hacer git add?', o: ['Untracked', 'Staged', 'Unmodified', 'Deleted'], a: 1, e: 'Staged = preparado para confirmar.' },
      { q: '¿Qué hace git clone?', o: ['Crea una rama', 'Copia un repositorio remoto y crea el alias origin', 'Borra el historial', 'Fusiona ramas'], a: 1, e: 'origin es el alias del remoto de origen.' },
      { q: '¿Para qué sirve el fichero .gitignore?', o: ['Para listar ficheros que no se versionan', 'Para guardar contraseñas', 'Para crear ramas', 'Para compilar'], a: 0, e: 'Por ejemplo *.class o bin/.' }
    ]
  }, { t: 'Une comando Git y función', tipo: 'parejas', data: {
    intro: 'Relaciona cada comando con lo que hace.',
    pares: [['git init', 'Crea un repositorio local'], ['git status', 'Muestra el estado de los ficheros'], ['git add .', 'Prepara los cambios (staged)'], ['git commit -m', 'Guarda una versión en el repositorio local'], ['git log --oneline', 'Muestra el historial resumido'], ['git merge', 'Fusiona una rama']] } });

  A('entornos', {
    t: 'Refactorización: definición, malos olores y Eclipse',
    h: '<p><b>Refactorizar</b> es modificar el código <b>sin cambiar su funcionamiento</b> para hacerlo más claro, sencillo y fácil de leer. No se añaden ni quitan funcionalidades ni se corrigen errores en ese paso: si el comportamiento cambia, se han introducido errores. Objetivos: limpiar y dar consistencia, facilitar el mantenimiento, eliminar código muerto, modularizar y facilitar futuras modificaciones.</p><p><b>Bad smells</b> (malos olores): síntomas de problemas de diseño que no impiden funcionar pero dificultan el mantenimiento. <b>Código duplicado</b> (extraerlo a un método), <b>método largo</b> (debe hacer una sola cosa), <b>clase grande</b> (una sola responsabilidad), <b>lista de parámetros extensa</b> (agruparlos en un objeto), <b>cambio divergente</b> (una clase cambia por motivos muy distintos), <b>cirugía a tiros</b> (un cambio obliga a tocar muchas clases), <b>envidia de funcionalidad</b> (un método usa más datos de otra clase que de la suya) y <b>legado rechazado</b> (subclase que apenas usa lo heredado).</p><p><b>En Eclipse</b> (clic derecho → <i>Refactor</i>): <b>Rename</b>, <b>Move</b>, <b>Extract Constant</b>, <b>Extract Local Variable</b>, <b>Convert Local Variable to Field</b>, <b>Extract Method</b>, <b>Change Method Signature</b>, <b>Inline</b>, <b>Extract Interface</b> y <b>Extract Superclass</b>.</p>',
    ref: EN('apuntes:refactorizacion', 'Refactorización (abrilcode)'),
    quiz: [
      { q: 'Refactorizar consiste en…', o: ['Añadir funcionalidades nuevas', 'Mejorar el código sin cambiar su funcionamiento', 'Corregir errores', 'Reescribir el programa en otro lenguaje'], a: 1, e: 'Si cambia el comportamiento, se han introducido errores.' },
      { q: 'Un método usa más datos de otra clase que de la propia. ¿Qué mal olor es?', o: ['Cirugía a tiros', 'Envidia de funcionalidad', 'Legado rechazado', 'Clase grande'], a: 1, e: 'Debería moverse a la clase cuyos datos usa.' },
      { q: 'Un cambio obliga a modificar muchas clases. Es…', o: ['Cirugía a tiros', 'Código duplicado', 'Método largo', 'Legado rechazado'], a: 0, e: 'Es lo contrario del cambio divergente.' },
      { q: '¿Qué opción de Eclipse convierte un literal en una constante?', o: ['Inline', 'Extract Constant', 'Move', 'Rename'], a: 1, e: 'Sustituye todas sus apariciones por la constante.' }
    ]
  }, { t: 'Empareja el mal olor', tipo: 'parejas', data: {
    intro: 'Relaciona cada mal olor con su descripción.',
    pares: [['Código duplicado', 'Se extrae a un método'], ['Método largo', 'Debe hacer una sola cosa'], ['Clase grande', 'Una sola responsabilidad'], ['Lista de parámetros extensa', 'Agrupar datos en un objeto'], ['Cambio divergente', 'Una clase cambia por motivos muy distintos'], ['Legado rechazado', 'Subclase que apenas usa lo heredado']] } });

  A('entornos', {
    t: 'Diseño de pruebas: caja negra, JUnit 5, TDD y mocks',
    h: '<p>Un <b>caso de prueba</b> comprueba que una funcionalidad responde como se espera (por ejemplo, <code>Math.abs(-7)</code> debe devolver 7). <b>Caja negra:</b> evalúa salidas ante entradas, sin mirar el código interno (el <i>qué</i>). <b>Caja blanca:</b> analiza los caminos de ejecución (if/else, bucles).</p><p><b>Por alcance:</b> <b>unitarias</b> (métodos de una clase; JUnit, PHPUnit, NUnit…), de <b>integración</b> (los módulos funcionan juntos, p. ej. con la base de datos) y de <b>usabilidad</b> (usuarios realizan las tareas y se anotan dificultades).</p><p><b>JUnit 5:</b> un método de prueba lleva <code>@Test</code>. Anotaciones: <code>@DisplayName</code>, <code>@Tag</code>, <code>@BeforeEach</code>/<code>@AfterEach</code> (antes/después de cada test), <code>@BeforeAll</code>/<code>@AfterAll</code> (static, una vez por clase) y <code>@Disabled</code>. Aserciones (<code>Assertions</code>): <code>assertTrue</code>, <code>assertFalse</code>, <code>assertEquals</code>, <code>assertNotEquals</code>, <code>assertNull</code>, <code>assertNotNull</code> y <code>assertSame</code> (compara referencias). Se recomienda una aserción por caso, y una prueba afirmativa y otra negativa por requisito. Las <b>fixtures</b> son el código de preparación común.</p><p><b>TDD</b> (dentro de XP) en tres pasos: 1) escribir la prueba del requisito, 2) implementar el mínimo código para que pase, 3) refactorizar sin cambiar el comportamiento. Los <b>objetos mock</b> imitan un tipo real y devuelven valores predefinidos (Mockito, EasyMock, JMock).</p>',
    ref: EN('apuntes:pruebas', 'Diseño de pruebas (abrilcode)'),
    quiz: [
      { q: '¿Qué enfoque ignora el código interno y mira solo entradas y salidas?', o: ['Caja blanca', 'Caja negra', 'Usabilidad', 'Integración'], a: 1, e: 'Se centra en el qué, no en el cómo.' },
      { q: '¿Qué anotación se ejecuta antes de cada test en JUnit 5?', o: ['@BeforeAll', '@BeforeEach', '@Test', '@Disabled'], a: 1, e: '@BeforeAll es static y se ejecuta una vez por clase.' },
      { q: '¿Qué aserción compara referencias y no valores?', o: ['assertEquals', 'assertSame', 'assertTrue', 'assertNull'], a: 1, e: 'assertEquals usa equals() para objetos.' },
      { q: 'Segundo paso del TDD:', o: ['Refactorizar', 'Escribir el mínimo código para que la prueba pase', 'Escribir la documentación', 'Subir a producción'], a: 1, e: 'Primero la prueba, después el código mínimo y por último refactorizar.' },
      { q: '¿Para qué sirve un objeto mock?', o: ['Para compilar', 'Para imitar un tipo real devolviendo valores predefinidos', 'Para cifrar', 'Para crear ramas'], a: 1, e: 'Permite probar operaciones que dependen de otros objetos.' }
    ]
  }, { t: 'Anotación de JUnit y función', tipo: 'parejas', data: {
    intro: 'Relaciona cada anotación con su función.',
    pares: [['@Test', 'Marca un método de prueba'], ['@BeforeEach', 'Se ejecuta antes de cada test'], ['@AfterEach', 'Se ejecuta después de cada test'], ['@BeforeAll', 'Una vez por clase (static)'], ['@Disabled', 'Desactiva un test'], ['@DisplayName', 'Da un nombre descriptivo']] } });

  A('entornos', {
    t: 'UML: casos de uso y diagramas de clases',
    h: '<p><b>UML</b> es un lenguaje de modelado estándar: sirve para diseñar la estructura, el comportamiento y las relaciones de un sistema, no para programar.</p><p><b>Casos de uso:</b> describen la interacción entre un actor y el sistema. Elementos: <b>actores</b> (monigote; personas, dispositivos u otros sistemas), <b>casos de uso</b> (elipses), relaciones y un <b>límite del sistema</b> opcional (rectángulo). Entre casos de uso: <b>inclusión</b> (el inicial exige ejecutar el secundario) y <b>extensión</b> (amplía a otro, parecido a la herencia).</p><p><b>Diagramas de clases:</b> cada clase es una caja con tres secciones: <b>nombre</b>, <b>atributos</b> y <b>métodos</b>. Visibilidad: <code>+</code> público, <code>-</code> privado, <code>#</code> protegido, <code>~</code> por defecto (paquete). Los miembros <b>estáticos</b> (clasificadores) van subrayados.</p><p>Relaciones: <b>herencia</b> (línea con flecha hacia la superclase), <b>asociación</b> (línea con flecha abierta; admite cardinalidad), <b>agregación</b> (rombo vacío: lo contenido puede existir sin el contenedor) y <b>composición</b> (rombo negro: si desaparece el contenedor, desaparece lo contenido). Ejemplo: una Universidad se compone de Departamentos (composición) y un Departamento agrega Profesores (agregación).</p><p>Herramientas: yEd y ArgoUML. La <b>ingeniería inversa</b> obtiene el modelo a partir del código existente (ArgoUML, plugins de Eclipse; MySQL Workbench para bases de datos).</p>',
    ref: EN('apuntes:diagramas', 'Elaboración de diagramas (abrilcode)'),
    quiz: [
      { q: 'En UML, el símbolo # delante de un miembro significa…', o: ['Público', 'Privado', 'Protegido', 'Por defecto'], a: 2, e: '+ público, - privado, # protegido, ~ por defecto.' },
      { q: 'El rombo negro indica…', o: ['Agregación', 'Composición', 'Herencia', 'Extensión'], a: 1, e: 'Si desaparece el contenedor, desaparecen sus partes.' },
      { q: 'Un Departamento agrega Profesores porque…', o: ['Los profesores desaparecen con el departamento', 'Los profesores pueden existir sin el departamento', 'Es herencia', 'Es un caso de uso'], a: 1, e: 'Eso es agregación (rombo vacío).' },
      { q: '¿Qué es la ingeniería inversa?', o: ['Programar sin diseño', 'Obtener un modelo a partir del código existente', 'Borrar código', 'Probar el sistema'], a: 1, e: 'Es el proceso contrario al habitual.' }
    ]
  }, { t: 'Une símbolo y significado', tipo: 'parejas', data: {
    intro: 'Relaciona cada elemento UML.',
    pares: [['+', 'Visibilidad pública'], ['-', 'Visibilidad privada'], ['#', 'Visibilidad protegida'], ['~', 'Visibilidad por defecto (paquete)'], ['Rombo vacío', 'Agregación'], ['Rombo negro', 'Composición'], ['Elipse', 'Caso de uso']] } });

  A('entornos', {
    t: 'Gestión de proyectos: cascada, ágil, Scrum y XP',
    h: '<p><b>Roles:</b> el <b>dueño del producto</b> (cliente y usuario final) indica el <i>qué</i>; el <b>analista de negocio</b> traduce los requisitos en pruebas de aceptación; los <b>desarrolladores</b> deciden el <i>cómo</i>; los <b>arquitectos</b> toman decisiones de diseño y los <b>administradores de sistemas</b> mantienen los servidores.</p><p><b>Cascada:</b> fases en secuencia: análisis, diseño, codificación, pruebas y mantenimiento. Es sencillo, pero los proyectos reales rara vez siguen una secuencia pura, es difícil fijar todos los requisitos al inicio, el cliente no ve nada funcional hasta el final y los errores tardíos son costosos. <b>Iterativo e incremental:</b> repite ciclos sobre pequeños incrementos; permite entregas tempranas y no exige conocer todos los requisitos.</p><p><b>Ágil:</b> nace del Manifiesto Ágil (2001), que valora individuos e interacción, software funcionando, colaboración con el cliente y respuesta al cambio. Iteraciones cortas, equipos pequeños (menos de siete personas) y commits al menos diarios.</p><p><b>Scrum:</b> reunión inicial (Product Backlog), <i>Sprint Planning</i>, <i>Sprint</i> (bloque de tiempo fijo, entre dos y cuatro semanas), <i>Daily Scrum</i> (máximo 10 minutos, de pie), <i>Sprint Review</i> y <i>Sprint Retrospective</i>. Roles: <b>Product Owner</b> (prioridades), <b>Scrum Master</b> (facilita y elimina impedimentos) y <b>Team</b> (5 a 9 personas). <b>Product Backlog</b>: el qué, solo lo modifica el Product Owner. <b>Sprint Backlog</b>: el cómo. <b>Burndown Chart</b>: trabajo pendiente.</p><p><b>XP</b> (Kent Beck): entregas muy frecuentes, revisión continua, <b>programación por parejas</b> (un controlador escribe y un observador revisa), refactorización constante y TDD.</p>',
    ref: EN('apuntes:proyectos', 'Gestión de proyectos software (abrilcode)'),
    quiz: [
      { q: '¿Quién modifica el Product Backlog en Scrum?', o: ['El Scrum Master', 'Solo el Product Owner', 'Todo el equipo', 'El tester'], a: 1, e: 'Es la lista priorizada del qué.' },
      { q: 'Un inconveniente típico del modelo en cascada es…', o: ['Que es demasiado flexible', 'Que el cliente no ve una versión funcional hasta el final', 'Que no tiene fases', 'Que exige Scrum'], a: 1, e: 'Además, los errores tardíos son costosos.' },
      { q: 'La Daily Scrum dura como máximo…', o: ['10 minutos', '2 horas', '1 día', '1 semana'], a: 0, e: 'Es una reunión breve, de pie, sobre el estado de las tareas.' },
      { q: 'En programación por parejas, el que escribe el código es el…', o: ['Observador', 'Controlador', 'Product Owner', 'Scrum Master'], a: 1, e: 'El observador revisa y piensa en la estrategia; se intercambian.' }
    ]
  }, { t: 'Cascada o ágil', tipo: 'clasifica', data: {
    intro: '¿A qué enfoque pertenece cada característica?',
    cats: ['Cascada', 'Ágil'],
    items: [['Fases en secuencia', 0], ['El cliente ve la versión al final', 0], ['Difícil fijar todos los requisitos al inicio', 0], ['Iteraciones cortas', 1], ['Revisión con el cliente tras cada iteración', 1], ['Equipos pequeños y jerarquía horizontal', 1]] } });

  A('entornos', {
    t: 'Eclipse y depuración: atajos, JAR ejecutable y Visual Studio',
    h: '<p><b>Eclipse</b> es un IDE de código abierto escrito en Java. El <b>workspace</b> es el directorio que almacena los proyectos (no es un proyecto; se cambia con <i>File → Switch workspace</i>). Un <b>proyecto</b> contiene <code>src</code> (fuentes .java) y <code>bin</code> (.class). Las <b>plantillas</b> permiten autocompletar (por ejemplo, <code>syso</code> + Ctrl+Espacio). <b>WindowBuilder</b> es el editor visual de interfaces Swing.</p><p><b>Depurador de Eclipse:</b> breakpoints con doble clic (punto azul); <b>F8</b> continúa hasta el siguiente breakpoint; <b>F5</b> entra en el método; <b>F6</b> salta el método (no entra); <b>F7</b> vuelve al método llamador; <b>Ctrl+Shift+I</b> evalúa la expresión seleccionada. Para depurar clases internas de Java hay que configurar el JDK en lugar del JRE.</p><p><b>Visual Studio</b> (plataforma .NET, lenguaje C#): <b>F5</b> inicia la depuración, <b>F11</b> avanza instrucción a instrucción entrando en métodos, <b>F10</b> avanza sin entrar en los métodos y <b>Shift+F11</b> sale del método actual.</p><p><b>JAR:</b> archivo comprimido (un .zip renombrado) que empaqueta clases y recursos. Para usar uno como librería se añade en <i>Build Path → Configure Build Path → Libraries</i>. Un <b>JAR ejecutable</b> se exporta con <i>File → Export → Java → Runnable JAR File</i>, indicando la clase con <code>main</code>, y se ejecuta con <code>java -jar archivo.jar</code>. Para crear un .exe a partir de un JAR existen <b>JSmooth</b> (solo Windows) y <b>Launch4J</b> (multiplataforma).</p>',
    ref: EN('apuntes:herramientas', 'Herramientas de desarrollo: Eclipse y Visual Studio (abrilcode)'),
    quiz: [
      { q: 'En Eclipse, ¿qué tecla hace "step into" (entrar en el método)?', o: ['F5', 'F6', 'F7', 'F8'], a: 0, e: 'F6 salta el método, F7 vuelve al llamador y F8 continúa.' },
      { q: 'En Eclipse, ¿qué tecla continúa hasta el siguiente breakpoint?', o: ['F5', 'F6', 'F7', 'F8'], a: 3, e: 'F8 = continuar.' },
      { q: 'En Visual Studio, ¿qué atajo avanza sin entrar en los métodos?', o: ['F11', 'F10', 'Shift+F11', 'F5'], a: 1, e: 'F11 entra en los métodos y Shift+F11 sale del actual.' },
      { q: '¿Cómo se ejecuta un JAR ejecutable?', o: ['java archivo.jar', 'java -jar archivo.jar', 'javac archivo.jar', 'run archivo.jar'], a: 1, e: 'Se exporta con Runnable JAR File.' },
      { q: 'Un proyecto de Eclipse contiene…', o: ['src (fuentes) y bin (.class)', 'Solo el workspace', 'Solo ficheros .jar', 'Solo tests'], a: 0, e: 'El workspace es el directorio que guarda los proyectos.' }
    ]
  }, { t: 'Atajo y función en el depurador', tipo: 'parejas', data: {
    intro: 'Relaciona cada tecla con su función.',
    pares: [['F5 (Eclipse)', 'Entrar en el método'], ['F6 (Eclipse)', 'Saltar el método'], ['F7 (Eclipse)', 'Volver al método llamador'], ['F8 (Eclipse)', 'Continuar hasta el siguiente breakpoint'], ['F11 (Visual Studio)', 'Paso a paso entrando en métodos'], ['F10 (Visual Studio)', 'Paso a paso sin entrar en métodos']] } });

  A('entornos', {
    t: 'Convenciones de escritura y buenas prácticas en Java',
    h: '<p>Se siguen convenciones porque la mayor parte del coste de un programa está en su <b>mantenimiento</b>.</p><ul><li><b>Fichero:</b> comentarios, <code>package</code>, <code>import</code> (uno por línea, sin <code>*</code>) y una única clase o interfaz con el mismo nombre que el fichero.</li><li><b>Orden en la clase:</b> declaración, variables estáticas, atributos, constructores y métodos.</li><li><b>Nombres:</b> descriptivos, sin tildes ni ñ. Paquetes en minúsculas, clases en <b>UpperCamelCase</b>, métodos y variables en <b>lowerCamelCase</b>, constantes en <b>CONSTANT_CASE</b>.</li><li><b>Variables:</b> una declaración por línea, inicializadas al declararlas y cerca de su uso.</li><li><b>Magic numbers:</b> los literales sin explicación se sustituyen por constantes con nombre.</li><li><b>Formato:</b> llaves siempre (aunque sea una instrucción), una instrucción por línea y un máximo de 100 caracteres por línea.</li></ul><p><b>Buenas prácticas:</b> los <code>String</code> son inmutables, así que concatenar con <code>+</code> en un bucle es costoso: usa <code>StringBuilder</code>. Los objetos se comparan con <code>equals</code>, no con <code>==</code>. Los atributos no deben ser públicos (getters y setters). Cada variable, un único propósito. En un <code>switch</code>, incluye <code>break</code> y <code>default</code>. Evita crear objetos innecesarios.</p>',
    ref: EN('apuntes:refactorizacion', 'Convenciones y buenas prácticas (abrilcode)'),
    quiz: [
      { q: '¿Cómo se escribe el nombre de una clase según la convención?', o: ['lowerCamelCase', 'UpperCamelCase', 'CONSTANT_CASE', 'snake_case'], a: 1, e: 'Ejemplo: CuentaBancaria.' },
      { q: '¿Y el de una constante?', o: ['maxIntentos', 'MaxIntentos', 'MAX_INTENTOS', 'max-intentos'], a: 2, e: 'CONSTANT_CASE.' },
      { q: '¿Qué conviene usar para concatenar muchos textos dentro de un bucle?', o: ['El operador +', 'StringBuilder', 'new String()', '=='], a: 1, e: 'Los String son inmutables y + crea objetos nuevos.' },
      { q: '¿Cómo se comparan dos objetos?', o: ['Con ==', 'Con equals', 'Con =', 'Con compile'], a: 1, e: '== compara referencias.' }
    ]
  }, { t: 'Aplica la convención', tipo: 'clasifica', data: {
    intro: '¿Qué estilo de nombre corresponde a cada elemento?',
    cats: ['UpperCamelCase', 'lowerCamelCase', 'CONSTANT_CASE'],
    items: [['Una clase: CuentaBancaria', 0], ['Una interfaz: Imprimible', 0], ['Un método: calcularTotal', 1], ['Una variable: edadMedia', 1], ['Una constante: IVA_GENERAL', 2], ['Una constante: MAX_INTENTOS', 2]] } });

  /* ================= BASES DE DATOS ================= */
  A('bd', {
    t: 'Modelo entidad-relación: entidades, atributos y cardinalidad',
    h: '<p>El <b>modelo entidad/relación (E-R)</b> es el diseño conceptual previo a crear la base de datos. Elementos:</p><ul><li><b>Entidad:</b> objeto distinguible por sus características (un alumno).</li><li><b>Atributo:</b> característica de una entidad (nombre, número de expediente).</li><li><b>Relación:</b> vínculo entre entidades (el alumno <i>cursa</i> una asignatura). Indica que <i>pueden</i> relacionarse, no que estén obligadas.</li></ul><p><b>Cardinalidad máxima:</b> con cuántas entidades del otro tipo se relaciona como máximo. <b>Cardinalidad mínima</b> (0 o 1): si la relación es obligatoria. Las <b>cardinalidades parciales</b> se escriben (mín,máx), por ejemplo <b>(0,N)</b>. La <b>cardinalidad total</b> sale de los máximos y se escribe <b>1:1</b>, <b>1:N</b>, <b>N:1</b> o <b>N:M</b>.</p><p><b>Relaciones n-arias</b> (ternarias, cuaternarias…): se recomienda descomponerlas en binarias creando una entidad intermedia (por ejemplo, <i>venta</i>). Una relación <b>reflexiva</b> relaciona una entidad consigo misma (empleado supervisa a empleado). La <b>herencia</b> (generalización/especialización) se usa cuando las entidades hijas tienen relaciones o atributos distintos del padre.</p><p><b>Atributos:</b> <b>multivaluados</b> (varios valores: teléfonos), <b>compuestos</b> (divisibles: dirección) y <b>derivados</b> (calculables: la edad a partir de la fecha de nacimiento).</p><p><b>Comprobaciones:</b> entidades en singular y como nombres, relaciones como verbos, evitar ciclos innecesarios, convertir en entidad una relación con muchos atributos y comprobar que las cardinalidades se leen bien.</p>',
    ref: BD('bloque2:diseno#modelo_entidad_relacion', 'Bloque 2 · Diseño: modelo E-R (abrilcode)'),
    quiz: [
      { q: 'Un alumno cursa varias asignaturas y cada asignatura la cursan varios alumnos. La cardinalidad total es…', o: ['1:1', '1:N', 'N:M', 'N:1'], a: 2, e: 'Muchos a muchos.' },
      { q: '¿Cómo se escribe una cardinalidad parcial?', o: ['1:N', '(0,N)', '[0..N]', 'N-M'], a: 1, e: 'Entre paréntesis (mínima,máxima). La total se escribe con dos puntos, como 1:N.' },
      { q: 'La edad calculada a partir de la fecha de nacimiento es un atributo…', o: ['Compuesto', 'Derivado', 'Multivaluado', 'Clave'], a: 1, e: 'Se puede calcular a partir de otro dato.' },
      { q: '¿Qué se recomienda hacer con una relación ternaria?', o: ['Dejarla tal cual', 'Descomponerla en binarias con una entidad intermedia', 'Borrarla', 'Pasarla a atributo'], a: 1, e: 'Por ejemplo, la entidad venta.' },
      { q: 'La cardinalidad mínima indica…', o: ['El máximo de relaciones', 'La obligatoriedad de la relación', 'El tipo de clave', 'El nombre de la tabla'], a: 1, e: 'Suele ser 0 o 1.' }
    ]
  }, { t: 'Une cada concepto E-R', tipo: 'parejas', data: {
    intro: 'Relaciona cada elemento con su significado.',
    pares: [['Entidad', 'Objeto distinguible (un alumno)'], ['Atributo', 'Característica de una entidad'], ['Relación', 'Vínculo entre entidades'], ['Atributo multivaluado', 'Varios valores (teléfonos)'], ['Atributo compuesto', 'Divisible (dirección)'], ['Atributo derivado', 'Calculable (edad)']] } });

  A('bd', {
    t: 'Claves: primaria, candidata, natural y subrogada',
    h: '<p>Una <b>superclave</b> es un conjunto de atributos que identifica de forma única cada fila. Una <b>clave candidata</b> es una superclave <i>mínima</i>. La <b>clave primaria</b> es la candidata elegida y las <b>claves alternativas</b> son las candidatas no elegidas. Una <b>clave ajena (foránea)</b> es una columna que referencia la clave primaria de otra tabla.</p><p>Una <b>clave natural</b> tiene significado real (DNI, matrícula, nº de expediente); requiere que existan campos candidatos, que a veces son compuestos y complican las claves ajenas. Una <b>clave subrogada</b> es una columna autonumérica creada para el diseño (normalmente <code>id</code>): es sencilla, escalable y se puede añadir a cualquier tabla. Los apuntes usan este enfoque, sin afirmar que sea mejor que el natural.</p>',
    ref: BD('bloque2:diseno', 'Bloque 2 · Claves (abrilcode)'),
    quiz: [
      { q: 'Una clave candidata es…', o: ['Cualquier columna', 'Una superclave mínima', 'Una clave ajena', 'Un índice de texto'], a: 1, e: 'La primaria es la candidata elegida.' },
      { q: 'Una clave subrogada es…', o: ['El DNI', 'Una columna autonumérica creada para el diseño', 'Una clave compuesta natural', 'Una vista'], a: 1, e: 'Normalmente se llama id.' },
      { q: 'Una clave ajena…', o: ['Referencia la clave primaria de otra tabla', 'Es siempre autonumérica', 'No puede repetirse', 'Sustituye a la primaria'], a: 0, e: 'Es lo que relaciona las tablas.' },
      { q: 'Las claves alternativas son…', o: ['Las candidatas no elegidas como primaria', 'Las claves ajenas', 'Las subrogadas', 'Las superclaves no mínimas'], a: 0, e: 'Se pueden proteger con UNIQUE.' }
    ]
  }, { t: 'Natural o subrogada', tipo: 'clasifica', data: {
    intro: '¿Qué tipo de clave es cada una?',
    cats: ['Natural', 'Subrogada'],
    items: [['DNI', 0], ['Matrícula del coche', 0], ['Nº de expediente', 0], ['id autonumérico', 1], ['Columna id añadida al diseñar', 1], ['Identificador sin significado real', 1]] } });

  A('bd', {
    t: 'Del modelo E-R al relacional: reglas de transformación',
    h: '<p><b>Entidades y atributos:</b> cada entidad es una tabla. Los atributos simples y derivados pasan a columnas y los compuestos se sustituyen por sus componentes. Un atributo <b>multivaluado</b> genera una tabla nueva con un <code>id</code>, una clave ajena a la tabla origen y el valor.</p><p><b>Relaciones:</b></p><ul><li><b>N:M:</b> tabla nueva cuya clave primaria es la combinación de las claves de ambas entidades (que además son claves ajenas).</li><li><b>1:N:</b> la clave primaria del lado con máximo 1 se propaga como <b>clave ajena</b> al lado N; la relación desaparece.</li><li><b>1:1:</b> tres opciones: clave primaria compartida (solo si una cardinalidad parcial es (1,1)); tratarla como 1:N con clave ajena <code>UNIQUE</code>; o crear una tabla (solo si ambas son (0,1) y hay pocos registros relacionados).</li><li><b>Herencia:</b> se transforma como relaciones 1:1 entre el padre y las hijas. Lo habitual: las hijas usan como clave primaria la de la tabla padre. Alternativa: clave ajena con <code>UNIQUE</code> y <code>NOT NULL</code>.</li><li><b>Reflexivas:</b> N:M genera una tabla con dos claves ajenas a la misma tabla; 1:N añade una clave ajena en la propia tabla; 1:1 se trata como 1:N con <code>UNIQUE</code>.</li></ul><p><b>Atributos de la relación:</b> en 1:N pasan al lado N; en N:M, a la tabla generada.</p>',
    ref: BD('bloque2:diseno', 'Bloque 2 · Transformación E-R → relacional (abrilcode)'),
    quiz: [
      { q: 'Una relación N:M se convierte en…', o: ['Una clave foránea', 'Una tabla nueva con las claves de ambas entidades', 'Un atributo', 'Nada'], a: 1, e: 'La clave primaria es la combinación de ambas claves.' },
      { q: 'En una relación 1:N, la clave ajena va en la tabla del lado…', o: ['1', 'N', 'Ninguna', 'En ambas'], a: 1, e: 'La clave primaria del lado 1 se propaga al lado N.' },
      { q: 'Un atributo multivaluado (varios teléfonos) se transforma en…', o: ['Una columna con comas', 'Una tabla nueva con una clave ajena y el valor', 'Se elimina', 'Una vista'], a: 1, e: 'Cada valor es una fila de la nueva tabla.' },
      { q: 'En la herencia, lo habitual es que las tablas hijas…', o: ['Tengan una clave primaria distinta', 'Usen como clave primaria la de la tabla padre', 'No tengan clave', 'Se fusionen siempre'], a: 1, e: 'Se transforma como relaciones 1:1 entre padre e hijas.' }
    ]
  }, { t: 'Aplica la regla', tipo: 'clasifica', data: {
    intro: '¿Cómo se transforma cada caso?',
    cats: ['Clave ajena', 'Tabla nueva'],
    items: [['Departamento 1:N Empleado', 0], ['Cliente 1:N Pedido', 0], ['Alumno N:M Asignatura', 1], ['Autor N:M Libro', 1], ['Varios teléfonos por persona', 1], ['Empleado supervisa a empleado (1:N)', 0]] } });

  A('bd', {
    t: 'MySQL: crear bases de datos y tablas (DDL)',
    h: '<p class="note"><b>Complemento aparte:</b> este tema no estaba en las páginas de abrilcode que he podido leer. Está escrito con la sintaxis estándar de MySQL 8 (documentación oficial).</p><p>El <b>DDL</b> (lenguaje de definición de datos) crea y modifica la estructura: <code>CREATE</code>, <code>ALTER</code>, <code>DROP</code>.</p><pre>CREATE DATABASE tienda;\nUSE tienda;\n\nCREATE TABLE cliente (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  nombre VARCHAR(50) NOT NULL,\n  email VARCHAR(80) UNIQUE,\n  alta DATE DEFAULT (CURRENT_DATE)\n);\n\nCREATE TABLE pedido (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  id_cliente INT NOT NULL,\n  total DECIMAL(8,2) CHECK (total >= 0),\n  FOREIGN KEY (id_cliente) REFERENCES cliente(id)\n    ON DELETE CASCADE ON UPDATE CASCADE\n);</pre><p><b>Tipos habituales:</b> <code>INT</code>, <code>DECIMAL(p,s)</code>, <code>VARCHAR(n)</code>, <code>CHAR(n)</code>, <code>TEXT</code>, <code>DATE</code>, <code>DATETIME</code>, <code>BOOLEAN</code>. <b>Restricciones:</b> <code>PRIMARY KEY</code>, <code>FOREIGN KEY</code>, <code>NOT NULL</code>, <code>UNIQUE</code>, <code>DEFAULT</code>, <code>CHECK</code>. Con <code>ON DELETE CASCADE</code> al borrar un cliente se borran sus pedidos.</p><p><b>Modificar:</b> <code>ALTER TABLE cliente ADD telefono VARCHAR(15);</code> · <b>Borrar:</b> <code>DROP TABLE pedido;</code> · <b>Privilegios:</b> <code>GRANT</code> / <code>REVOKE</code>.</p>',
    ref: { href: 'https://dev.mysql.com/doc/refman/8.0/en/create-table.html', text: 'Manual oficial de MySQL · CREATE TABLE' },
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
