/* Lecciones ampliadas: Programación (Java POO, colecciones, JDBC), TSP e Inglés profesional.
   Programación basada en los apuntes de abrilcode (CC BY-SA 4.0, F. Valdeón). */
(function () {
  var A = window.AGREGA;
  var PR = function (u, t) { return { href: 'https://prog.abrilcode.com/doku.php?id=' + u, text: t }; };

  /* ================= PROGRAMACIÓN ================= */
  A('prog', {
    t: 'Clases y objetos: atributos, constructores y encapsulación',
    h: '<p>Una <b>clase</b> es el molde; un <b>objeto</b> es una instancia creada con <code>new</code>. La clase define <b>atributos</b> (estado) y <b>métodos</b> (comportamiento). Un <b>constructor</b> tiene el nombre de la clase, no devuelve nada e inicializa el objeto. <code>this</code> se refiere al objeto actual.</p><pre>public class Persona {\n    private String nombre;\n    private int edad;\n\n    public Persona(String nombre, int edad) {\n        this.nombre = nombre;\n        this.edad = edad;\n    }\n    public String getNombre() { return nombre; }\n    public void setEdad(int edad) {\n        if (edad &gt;= 0) this.edad = edad;\n    }\n}\n\nPersona p = new Persona("Alba", 30);</pre><p><b>Encapsulación:</b> los atributos se declaran <code>private</code> y se accede a ellos con <b>getters</b> y <b>setters</b>, que pueden validar los datos. Un miembro <code>static</code> pertenece a la clase, no a cada objeto. Los métodos <code>toString()</code> y <code>equals()</code> (heredados de <code>Object</code>) conviene sobrescribirlos.</p>',
    ref: null,
    quiz: [
      { q: '¿Qué palabra crea un objeto?', o: ['class', 'new', 'this', 'static'], a: 1, e: 'Persona p = new Persona(...).' },
      { q: 'Un constructor…', o: ['Devuelve void', 'Tiene el nombre de la clase y no declara tipo de retorno', 'Es siempre static', 'Se llama main'], a: 1, e: 'Inicializa los atributos del objeto.' },
      { q: '¿Por qué los atributos se declaran private?', o: ['Para que ocupen menos', 'Para encapsular y controlar el acceso con getters y setters', 'Es obligatorio', 'Para que sean estáticos'], a: 1, e: 'Permite validar los datos.' },
      { q: '¿A qué se refiere this?', o: ['A la clase padre', 'Al objeto actual', 'A un método estático', 'A main'], a: 1, e: 'Distingue el atributo del parámetro.' }
    ]
  }, { t: 'Completa la clase', tipo: 'hueco', data: {
    intro: 'Completa la clase Coche.',
    code: 'public class Coche {\n    [[0]] String marca;\n\n    public Coche(String marca) {\n        [[1]].marca = marca;\n    }\n}\n\nCoche c = [[2]] Coche("Seat");',
    huecos: [{ o: ['private', 'void', 'import'], a: 0 }, { o: ['this', 'super', 'static'], a: 0 }, { o: ['new', 'class', 'return'], a: 0 }] } });

  A('prog', {
    t: 'Herencia, polimorfismo, clases abstractas e interfaces',
    h: '<p>La <b>herencia</b> (<code>extends</code>) permite que una subclase reutilice los atributos y métodos de su superclase: «es un». Con <code>super(...)</code> se llama al constructor del padre y <code>@Override</code> sobrescribe un método.</p><pre>class Animal { void hablar() { System.out.println("..."); } }\nclass Perro extends Animal {\n    @Override void hablar() { System.out.println("Guau"); }\n}\nAnimal a = new Perro();\na.hablar();   // Guau</pre><p><b>Polimorfismo:</b> una variable del tipo padre puede apuntar a un objeto hijo, y se ejecuta el método del objeto real. Una <b>clase abstracta</b> (<code>abstract</code>) no se puede instanciar y puede tener métodos sin cuerpo. Una <b>interfaz</b> (<code>interface</code>) define un contrato de métodos que la clase cumple con <code>implements</code>; una clase puede implementar varias, pero heredar solo de una. <code>final</code> impide heredar o sobrescribir.</p>',
    ref: null,
    quiz: [
      { q: '¿Qué palabra se usa para heredar?', o: ['implements', 'extends', 'inherits', 'super'], a: 1, e: 'implements es para interfaces.' },
      { q: '¿Qué imprime? Animal a = new Perro(); a.hablar(); (Perro sobrescribe hablar)', o: ['El método de Animal', 'El método de Perro', 'Error', 'Nada'], a: 1, e: 'Polimorfismo: manda el objeto real.' },
      { q: '¿Se puede hacer new de una clase abstracta?', o: ['Sí', 'No', 'Solo con final', 'Solo en main'], a: 1, e: 'Solo se instancian sus subclases concretas.' },
      { q: 'Una clase puede…', o: ['Heredar de dos clases', 'Heredar de una e implementar varias interfaces', 'Solo implementar una', 'No heredar nunca'], a: 1, e: 'Java no tiene herencia múltiple de clases.' }
    ]
  }, { t: 'Clase, abstracta o interfaz', tipo: 'clasifica', data: {
    intro: 'Clasifica cada característica.',
    cats: ['Clase abstracta', 'Interfaz'],
    items: [['Se usa con extends', 0], ['Puede tener atributos de instancia', 0], ['Puede tener constructor', 0], ['Se usa con implements', 1], ['Una clase puede cumplir varias', 1], ['Define un contrato de métodos', 1]] } });

  A('prog', {
    t: 'Excepciones: try, catch, finally y throw',
    h: '<p>Una <b>excepción</b> es un error en tiempo de ejecución que interrumpe el flujo normal. Se gestionan con <code>try</code> / <code>catch</code> / <code>finally</code>:</p><pre>try {\n    int n = Integer.parseInt("abc");\n} catch (NumberFormatException e) {\n    System.out.println("No es un número");\n} finally {\n    System.out.println("Siempre se ejecuta");\n}</pre><p>Tipos: <b>comprobadas</b> (<code>IOException</code>, <code>SQLException</code>): el compilador obliga a capturarlas o declararlas con <code>throws</code>; <b>no comprobadas</b> (<code>RuntimeException</code>: <code>NullPointerException</code>, <code>ArrayIndexOutOfBoundsException</code>, <code>ArithmeticException</code>). Con <code>throw new ...</code> se lanza una excepción y con <code>throws</code> se avisa en la firma del método. Si hay varios <code>catch</code>, va primero el más específico. También puedes crear tus propias excepciones extendiendo <code>Exception</code>.</p>',
    ref: null,
    quiz: [
      { q: '¿Cuándo se ejecuta el bloque finally?', o: ['Solo si hay error', 'Siempre', 'Nunca', 'Solo si no hay error'], a: 1, e: 'Sirve para liberar recursos.' },
      { q: '¿Qué excepción lanza 5/0 con enteros?', o: ['NullPointerException', 'ArithmeticException', 'IOException', 'NumberFormatException'], a: 1, e: 'División entera entre cero.' },
      { q: '¿Qué palabra lanza una excepción?', o: ['throws', 'throw', 'catch', 'try'], a: 1, e: 'throws va en la firma del método.' },
      { q: 'Las excepciones comprobadas…', o: ['No hace falta tratarlas', 'Obligan a capturarlas o declararlas', 'Solo ocurren en main', 'No existen'], a: 1, e: 'Ejemplo: IOException.' }
    ]
  }, { t: 'Predice la salida', tipo: 'preguntas', data: { qs: [
    { q: '¿Qué escribe?', code: 'try {\n    int[] a = new int[2];\n    a[5] = 1;\n    System.out.println("A");\n} catch (Exception e) {\n    System.out.println("B");\n} finally {\n    System.out.println("C");\n}', o: ['A C', 'B C', 'B', 'C'], a: 1, e: 'Falla el acceso a a[5]: escribe B y luego C del finally.' },
    { q: '¿Qué escribe?', code: 'try {\n    System.out.println("1");\n} catch (Exception e) {\n    System.out.println("2");\n} finally {\n    System.out.println("3");\n}', o: ['1 3', '1 2 3', '2 3', '1'], a: 0, e: 'No hay excepción: no entra en catch.' }
  ] } });

  A('prog', {
    t: 'Colecciones: ArrayList, HashMap y recorridos',
    h: '<p>Un <b>array</b> tiene tamaño fijo. Las <b>colecciones</b> (<code>java.util</code>) crecen dinámicamente y usan <b>genéricos</b> (<code>&lt;Tipo&gt;</code>); en lugar de tipos primitivos usan sus <b>wrappers</b> (<code>Integer</code>, <code>Double</code>…).</p><p><b>ArrayList</b> (lista ordenada con duplicados): <code>add</code>, <code>get(i)</code>, <code>set</code>, <code>remove</code>, <code>size()</code>, <code>contains</code>. <b>HashSet</b>: sin duplicados y sin orden. <b>HashMap</b>: pares clave-valor: <code>put</code>, <code>get</code>, <code>containsKey</code>, <code>remove</code>.</p><pre>ArrayList&lt;String&gt; nombres = new ArrayList&lt;&gt;();\nnombres.add("Ana");\nnombres.add("Luis");\nfor (String n : nombres) System.out.println(n);\n\nHashMap&lt;String, Integer&gt; notas = new HashMap&lt;&gt;();\nnotas.put("Ana", 9);\nSystem.out.println(notas.get("Ana"));   // 9</pre><p>Para ordenar se usa <code>Collections.sort(lista)</code> (los elementos implementan <code>Comparable</code>) o un <code>Comparator</code>. El bucle <b>for-each</b> recorre cualquier colección.</p>',
    ref: null,
    quiz: [
      { q: '¿Qué colección NO permite duplicados?', o: ['ArrayList', 'HashSet', 'LinkedList', 'Array'], a: 1, e: 'Un Set no repite elementos.' },
      { q: '¿Cómo se obtiene el nº de elementos de un ArrayList?', o: ['length', 'size()', 'count()', 'len()'], a: 1, e: 'length es de los arrays.' },
      { q: 'HashMap almacena…', o: ['Solo valores', 'Pares clave-valor', 'Solo claves ordenadas', 'Solo texto'], a: 1, e: 'Cada clave es única.' },
      { q: '¿Qué tipo se usa en ArrayList<...> para enteros?', o: ['int', 'Integer', 'number', 'Int'], a: 1, e: 'Los genéricos exigen clases, no primitivos.' }
    ]
  }, { t: 'Une método y función', tipo: 'parejas', data: {
    intro: 'Relaciona cada método con su función.',
    pares: [['add(x)', 'Añade un elemento a la lista'], ['get(i)', 'Devuelve el elemento de la posición i'], ['size()', 'Número de elementos'], ['put(k, v)', 'Guarda un par en un HashMap'], ['containsKey(k)', 'Comprueba si existe la clave'], ['remove(i)', 'Elimina un elemento']] } });

  A('prog', {
    t: 'Acceso a bases de datos con JDBC',
    h: '<p><b>JDBC</b> (Java Database Connectivity) es la API para conectar Java con una base de datos (MySQL, MariaDB…). Hace falta el <b>driver</b> del SGBD en el proyecto. Los pasos son: <b>conectar</b>, <b>crear la sentencia</b>, <b>ejecutarla</b>, <b>recorrer los resultados</b> y <b>cerrar</b>.</p><pre>String url = "jdbc:mysql://localhost:3306/tienda";\ntry (Connection con = DriverManager.getConnection(url, "app", "clave");\n     PreparedStatement ps = con.prepareStatement(\n         "SELECT nombre FROM cliente WHERE id = ?")) {\n    ps.setInt(1, 7);\n    ResultSet rs = ps.executeQuery();\n    while (rs.next()) {\n        System.out.println(rs.getString("nombre"));\n    }\n} catch (SQLException e) {\n    e.printStackTrace();\n}</pre><p><code>executeQuery()</code> es para <code>SELECT</code> (devuelve un <code>ResultSet</code>) y <code>executeUpdate()</code> para <code>INSERT</code>, <code>UPDATE</code> y <code>DELETE</code>. Usa <b><code>PreparedStatement</code></b> con parámetros <code>?</code> en lugar de concatenar texto: evita la <b>inyección SQL</b>. <code>try-with-resources</code> cierra la conexión automáticamente. Las <b>transacciones</b> usan <code>commit()</code> y <code>rollback()</code>.</p>',
    ref: null,
    quiz: [
      { q: '¿Qué método ejecuta un SELECT?', o: ['executeUpdate()', 'executeQuery()', 'run()', 'commit()'], a: 1, e: 'Devuelve un ResultSet.' },
      { q: '¿Por qué usar PreparedStatement?', o: ['Es más corto', 'Evita la inyección SQL', 'No necesita conexión', 'Crea tablas'], a: 1, e: 'Los parámetros ? se tratan como datos, no como código.' },
      { q: '¿Qué clase representa el resultado de una consulta?', o: ['Connection', 'ResultSet', 'Driver', 'Statement'], a: 1, e: 'Se recorre con rs.next().' },
      { q: '¿Qué hace rs.next()?', o: ['Cierra la conexión', 'Avanza a la siguiente fila', 'Borra la fila', 'Vuelve al inicio'], a: 1, e: 'Devuelve false cuando no quedan filas.' }
    ]
  }, { t: 'Ordena el acceso a datos', tipo: 'clasifica', data: {
    intro: '¿Con qué sentencia se ejecuta cada operación?',
    cats: ['executeQuery', 'executeUpdate'],
    items: [['SELECT', 0], ['INSERT', 1], ['UPDATE', 1], ['DELETE', 1]] } });

  /* ================= TSP ================= */
  A('tsp', {
    t: 'Tipos de empresa y formas jurídicas',
    h: '<p>Las empresas se clasifican por su <b>tamaño</b> (micro, pequeña, mediana, grande), <b>sector</b> (primario, secundario, terciario), <b>propiedad del capital</b> (privada, pública, mixta) y <b>forma jurídica</b>.</p><p>Formas jurídicas más habituales: <b>empresario individual (autónomo)</b>: una persona, responsabilidad <i>ilimitada</i> con su patrimonio; <b>Sociedad Limitada (SL)</b>: capital dividido en participaciones, responsabilidad <i>limitada</i> al capital aportado; <b>Sociedad Anónima (SA)</b>: capital en acciones; <b>cooperativa</b>: socios que trabajan en la empresa, un socio un voto; y <b>sociedad civil o comunidad de bienes</b>.</p><p>Al elegir forma jurídica se valora el número de socios, el capital mínimo, la <b>responsabilidad</b>, los trámites y los impuestos.</p>',
    ref: null,
    quiz: [
      { q: '¿Qué responsabilidad tiene un autónomo?', o: ['Limitada al capital', 'Ilimitada con su patrimonio', 'Ninguna', 'Solo la empresa responde'], a: 1, e: 'Responde con todos sus bienes.' },
      { q: 'En una SL, los socios responden…', o: ['Con todo su patrimonio', 'Hasta el capital aportado', 'Nunca', 'Solo con la casa'], a: 1, e: 'Responsabilidad limitada.' },
      { q: 'En una cooperativa, la regla de voto es…', o: ['Según el capital', 'Un socio, un voto', 'Decide el director', 'No se vota'], a: 1, e: 'Funcionamiento democrático.' }
    ]
  }, { t: 'Une forma jurídica y rasgo', tipo: 'parejas', data: {
    intro: 'Relaciona cada forma con su característica.',
    pares: [['Autónomo', 'Responsabilidad ilimitada'], ['Sociedad Limitada', 'Capital en participaciones'], ['Sociedad Anónima', 'Capital en acciones'], ['Cooperativa', 'Un socio, un voto']] } });

  A('tsp', {
    t: 'Idea de negocio, DAFO y plan de empresa',
    h: '<p>Una <b>idea de negocio</b> responde a una necesidad del mercado. Antes de lanzarla se hace un <b>análisis DAFO</b>: <b>Debilidades</b> y <b>Fortalezas</b> (factores <i>internos</i>) y <b>Amenazas</b> y <b>Oportunidades</b> (factores <i>externos</i>).</p><p>El <b>plan de empresa</b> reúne: resumen ejecutivo, descripción del producto, <b>estudio de mercado</b> (clientes, competencia), <b>plan de marketing</b> (las 4 P: producto, precio, distribución —<i>place</i>— y promoción), plan de operaciones, organización y recursos humanos, <b>plan económico-financiero</b> (inversión inicial, costes, ingresos, punto de equilibrio) y forma jurídica.</p><p>El <b>umbral de rentabilidad</b> o punto muerto es el nivel de ventas donde ingresos = costes totales: a partir de ahí hay beneficio.</p>',
    ref: null,
    quiz: [
      { q: '¿Qué factores del DAFO son internos?', o: ['Amenazas y oportunidades', 'Debilidades y fortalezas', 'Todos', 'Ninguno'], a: 1, e: 'Amenazas y oportunidades vienen del entorno.' },
      { q: 'Las 4 P del marketing son…', o: ['Producto, precio, distribución y promoción', 'Personas, planes, pagos y puestos', 'Proyecto, prueba, producción y política', 'Precio, plazo, pago y papel'], a: 0, e: 'Marketing mix.' },
      { q: 'El punto muerto es…', o: ['Cuando hay pérdidas máximas', 'Cuando ingresos = costes totales', 'La inversión inicial', 'El cierre de la empresa'], a: 1, e: 'A partir de él, beneficios.' }
    ]
  }, { t: 'Interno o externo', tipo: 'clasifica', data: {
    intro: '¿A qué parte del DAFO pertenece cada factor?',
    cats: ['Interno (D/F)', 'Externo (A/O)'],
    items: [['Equipo muy formado', 0], ['Poca financiación', 0], ['Nueva competencia', 1], ['Subvenciones públicas', 1], ['Crisis económica', 1], ['Marca conocida', 0]] } });

  /* ================= INGLÉS ================= */
  A('ingles', {
    t: 'Past simple: talking about finished actions',
    h: '<p>Usa el <b>past simple</b> para acciones terminadas en el pasado: <em>I installed the update yesterday. We finished the project last week.</em></p><ul><li><b>Regulares:</b> verbo + <b>-ed</b> (<em>work → worked</em>, <em>deploy → deployed</em>).</li><li><b>Irregulares:</b> <em>write → wrote</em>, <em>go → went</em>, <em>run → ran</em>, <em>build → built</em>, <em>make → made</em>, <em>see → saw</em>.</li><li><b>Negativa:</b> <em>did not (didn\'t)</em> + verbo base: <em>I didn\'t fix the bug.</em></li><li><b>Pregunta:</b> <em>Did</em> + sujeto + verbo base: <em>Did you test the code?</em></li></ul><p>Marcadores: <em>yesterday, last week, two days ago, in 2024</em>.</p>',
    code: null, try: null,
    quiz: [
      { q: 'Which sentence is correct about yesterday?', o: ['I deploy the app yesterday.', 'I deployed the app yesterday.', 'I deploying the app yesterday.', 'I did deployed the app yesterday.'], a: 1, e: 'Yesterday → past simple: deployed.' },
      { q: 'Past of "write":', o: ['writed', 'wrote', 'written', 'wrote-ed'], a: 1, e: 'Irregular: write – wrote.' },
      { q: 'Choose the correct question.', o: ['Did you tested it?', 'Did you test it?', 'Do you tested it?', 'You did test it?'], a: 1, e: 'Did + verbo base.' }
    ]
  }, { t: 'Une presente y pasado', tipo: 'parejas', data: {
    intro: 'Relaciona cada verbo con su pasado.',
    pares: [['write', 'wrote'], ['build', 'built'], ['go', 'went'], ['make', 'made'], ['run', 'ran'], ['see', 'saw']] } });

  A('ingles', {
    t: 'Giving instructions and technical support',
    h: '<p>Para dar instrucciones se usa el <b>imperativo</b> (el verbo base, sin sujeto) y palabras de secuencia: <em>First, open the settings. Then, click "Update". Finally, restart the computer.</em> Negativo: <em>Don\'t turn off the server.</em></p><p><b>Frases de soporte técnico:</b></p><ul><li><em>What seems to be the problem?</em></li><li><em>Have you tried restarting it?</em></li><li><em>Could you send me a screenshot?</em></li><li><em>I\'ll look into it and get back to you.</em></li><li><em>The issue has been fixed.</em></li></ul><p>Conectores útiles: <em>first, next, then, after that, finally</em>. Para cortesía: <em>Could you…? Would you mind…? Please…</em></p>',
    code: null, try: null,
    quiz: [
      { q: 'Which is an instruction?', o: ['You are opening the file.', 'Open the file.', 'Opened the file.', 'To opening the file.'], a: 1, e: 'El imperativo usa el verbo base.' },
      { q: 'What does "I\'ll get back to you" mean?', o: ['Te llamaré luego con una respuesta', 'Vuelvo a casa', 'Te devuelvo el ordenador', 'Me voy'], a: 0, e: 'Promete responder más tarde.' },
      { q: 'Which word ends a sequence of steps?', o: ['First', 'Then', 'Finally', 'Next'], a: 2, e: 'Finally = por último.' }
    ]
  }, { t: 'Ordena las instrucciones', tipo: 'orden', data: {
    intro: 'Ordena los pasos para reiniciar un router.',
    items: ['First, unplug the router.', 'Then, wait for 30 seconds.', 'Next, plug it in again.', 'Finally, check the internet connection.'] } });

  A('ingles', {
    t: 'Meetings and presentations',
    h: '<p>En una <b>reunión</b>: <em>Let\'s get started. The purpose of this meeting is… Could we move on to the next point? Any questions? Let\'s sum up. I\'ll send the minutes.</em></p><p>Para <b>opinar</b>: <em>In my opinion… I think we should… I agree / I disagree. That\'s a good point.</em></p><p>En una <b>presentación</b>: <em>Today I\'m going to talk about… First I\'ll explain… Next, I\'ll show you… To sum up… Thank you for listening. Do you have any questions?</em></p><p>Vocabulario: <b>agenda</b> (orden del día), <b>deadline</b> (fecha límite), <b>schedule</b> (calendario), <b>to attend</b> (asistir), <b>feedback</b> (opinión/retroalimentación), <b>milestone</b> (hito).</p>',
    code: null, try: null,
    quiz: [
      { q: 'What is an "agenda"?', o: ['La lista de temas de la reunión', 'Un ordenador', 'Una fecha límite', 'Un correo'], a: 0, e: 'Es el orden del día.' },
      { q: 'Which phrase opens a presentation?', o: ['Thank you for listening.', 'Today I\'m going to talk about…', 'Let\'s sum up.', 'I disagree.'], a: 1, e: 'Introduce el tema.' },
      { q: '"Deadline" means…', o: ['Fecha límite', 'Reunión', 'Hito', 'Opinión'], a: 0, e: 'La fecha en que debe entregarse el trabajo.' }
    ]
  }, { t: 'Une frase y función', tipo: 'parejas', data: {
    intro: 'Relaciona cada frase con su función.',
    pares: [['Let\'s get started.', 'Abrir la reunión'], ['In my opinion…', 'Dar una opinión'], ['Let\'s sum up.', 'Resumir'], ['Do you have any questions?', 'Abrir turno de preguntas'], ['I\'ll send the minutes.', 'Prometer el acta'], ['That\'s a good point.', 'Mostrar acuerdo']] } });
})();
