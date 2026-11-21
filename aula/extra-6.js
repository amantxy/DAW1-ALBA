/* COMPLEMENTOS de Programación: temas que no están en los apuntes de abrilcode que has pasado.
   Fuente: API de Java (documentación de Oracle / tutorial oficial). Todo el código ha sido compilado y ejecutado. */
(function () {
  var A = window.AGREGA;
  var NOTA = '<p class="note"><b>Complemento aparte:</b> este tema no está en los apuntes de abrilcode. Está escrito con la API oficial de Java y el código se ha compilado y probado.</p>';
  var OR = function (u, t) { return { href: 'https://docs.oracle.com/javase/' + u, text: t }; };

  A('prog', {
    t: '[Complemento] Ficheros de texto con java.nio.file',
    h: NOTA + '<p>Para trabajar con ficheros, <code>Path</code> representa una ruta (<code>Paths.get("datos.txt")</code>) y la clase <code>Files</code> tiene los métodos para leer, escribir y comprobar. Casi todos lanzan <code>IOException</code> (comprobada), así que van en <code>try/catch</code> o con <code>throws</code>.</p><pre>Path ruta = Paths.get("datos.txt");\n\n// Escribir líneas (crea el fichero o lo sobrescribe)\nFiles.write(ruta, Arrays.asList("uno", "dos"), StandardCharsets.UTF_8);\n\n// Leer todas las líneas\nList&lt;String&gt; lineas = Files.readAllLines(ruta, StandardCharsets.UTF_8);\n\n// Añadir al final, línea a línea\ntry (BufferedWriter bw = Files.newBufferedWriter(ruta, StandardCharsets.UTF_8,\n        StandardOpenOption.APPEND)) {\n    bw.write("tres");\n    bw.newLine();\n}\n\n// Leer línea a línea\ntry (BufferedReader br = Files.newBufferedReader(ruta, StandardCharsets.UTF_8)) {\n    String linea;\n    while ((linea = br.readLine()) != null) System.out.println(linea);\n}</pre><p><code>Files.exists(ruta)</code> comprueba si existe. <code>try-with-resources</code> cierra el fichero solo. Otras opciones clásicas: <code>Scanner(new File("x.txt"))</code> con <code>hasNextLine()</code>/<code>nextLine()</code>, y <code>PrintWriter(new FileWriter("x.txt", true))</code> (el <code>true</code> indica «añadir»). Los ficheros de texto se leen y escriben con <i>caracteres</i>; para binarios se usan flujos de bytes (<code>InputStream</code>/<code>OutputStream</code>).</p>',
    ref: OR('tutorial/essential/io/fileio.html', 'Tutorial oficial de Oracle · File I/O'),
    quiz: [
      { q: '¿Qué excepción obligan a tratar la mayoría de métodos de Files?', o: ['NullPointerException', 'IOException', 'ArithmeticException', 'NumberFormatException'], a: 1, e: 'IOException es una excepción comprobada.' },
      { q: '¿Qué devuelve Files.readAllLines(ruta, UTF_8)?', o: ['Un String', 'Una List<String> con las líneas', 'Un array de bytes', 'Un Scanner'], a: 1, e: 'Cada elemento de la lista es una línea.' },
      { q: '¿Qué opción abre el fichero para añadir al final?', o: ['StandardOpenOption.APPEND', 'StandardOpenOption.READ', 'StandardOpenOption.DELETE', 'StandardOpenOption.NEW'], a: 0, e: 'Sin APPEND, el contenido se sobrescribe.' },
      { q: '¿Para qué sirve try-with-resources con un BufferedReader?', o: ['Para compilar más rápido', 'Para cerrar el fichero automáticamente', 'Para cifrarlo', 'Para evitar la excepción'], a: 1, e: 'Cierra el recurso al salir del bloque.' }
    ]
  }, { t: 'Une clase o método y su uso', tipo: 'parejas', data: {
    intro: 'Relaciona cada elemento con su función.',
    pares: [['Paths.get("x.txt")', 'Crea una ruta (Path)'], ['Files.readAllLines', 'Lee todas las líneas de un fichero'], ['Files.exists', 'Comprueba si existe'], ['BufferedReader.readLine()', 'Lee una línea (null al terminar)'], ['StandardOpenOption.APPEND', 'Escribir al final'], ['Scanner.hasNextLine()', 'Indica si quedan líneas']] } });

  A('prog', {
    t: '[Complemento] Fechas y horas: java.time',
    h: NOTA + '<p>El paquete <code>java.time</code> (desde Java 8) es el recomendado. Sus clases son <b>inmutables</b>: cada operación devuelve un objeto nuevo.</p><ul><li><code>LocalDate</code>: solo fecha. <code>LocalTime</code>: solo hora. <code>LocalDateTime</code>: fecha y hora (sin zona).</li><li>Crear: <code>LocalDate.of(2026, Month.NOVEMBER, 21)</code>, <code>LocalDate.now()</code>, <code>LocalDate.parse("2026-01-31")</code> (formato ISO).</li></ul><pre>LocalDate d = LocalDate.of(2026, Month.NOVEMBER, 21);\nd.plusDays(10);            // 2026-12-01\nd.getDayOfWeek();          // SATURDAY\nd.isLeapYear();            // false\nLocalDate.parse("2026-01-31").plusMonths(1);   // 2026-02-28 (ajusta al último día)\n\nChronoUnit.DAYS.between(d, LocalDate.of(2026, 12, 25));   // 34\nPeriod.between(LocalDate.of(2000, 1, 15), d);               // P26Y10M6D\nd.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));      // 21/11/2026</pre><p>Se comparan con <code>isBefore</code>, <code>isAfter</code> y <code>equals</code> (no con <code>==</code>). <code>Period</code> mide diferencias en años, meses y días; <code>Duration</code>, en horas, minutos y segundos. El patrón <code>MM</code> es el mes y <code>mm</code> los minutos.</p>',
    ref: OR('tutorial/datetime/iso/date.html', 'Tutorial oficial de Oracle · Date and Time'),
    quiz: [
      { q: '¿Qué clase guarda solo una fecha, sin hora?', o: ['LocalDate', 'LocalTime', 'Duration', 'Instant'], a: 0, e: 'LocalDateTime guarda fecha y hora.' },
      { q: 'LocalDate d = LocalDate.of(2026, 11, 21); d.plusDays(10) devuelve…', o: ['2026-12-01', '2026-11-31', '2026-12-10', '2027-01-01'], a: 0, e: 'Noviembre tiene 30 días: 21 + 10 = 1 de diciembre.' },
      { q: 'LocalDate.parse("2026-01-31").plusMonths(1) es…', o: ['2026-02-31', '2026-02-28', '2026-03-03', 'Lanza excepción'], a: 1, e: 'Ajusta al último día válido del mes.' },
      { q: '¿Por qué d.plusDays(5); sin guardar el resultado no cambia d?', o: ['Es un error del compilador', 'Porque las clases de java.time son inmutables', 'Porque falta import', 'Porque d es static'], a: 1, e: 'Hay que hacer d = d.plusDays(5).' }
    ]
  }, { t: 'Predice el resultado', tipo: 'preguntas', data: { qs: [
    { q: '¿Qué escribe?', code: 'LocalDate d = LocalDate.of(2026, 11, 21);\nSystem.out.println(d.getDayOfWeek());', o: ['FRIDAY', 'SATURDAY', 'SUNDAY', 'MONDAY'], a: 1, e: 'El 21 de noviembre de 2026 es sábado.' },
    { q: '¿Qué escribe?', code: 'LocalDate d = LocalDate.of(2026, 11, 21);\nSystem.out.println(\n  ChronoUnit.DAYS.between(d, LocalDate.of(2026, 12, 25)));', o: ['24', '34', '44', '35'], a: 1, e: 'Del 21 al 30 de noviembre hay 9 días y del 30 de noviembre al 25 de diciembre, 25: 9 + 25 = 34.' },
    { q: '¿Qué escribe?', code: 'LocalDate d = LocalDate.of(2026, 11, 21);\nSystem.out.println(\n  d.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));', o: ['2026-11-21', '21/11/2026', '11/21/2026', '21-nov-2026'], a: 1, e: 'dd = día, MM = mes, yyyy = año.' }
  ] } });

  A('prog', {
    t: '[Complemento] Interfaces gráficas con Swing y eventos',
    h: NOTA + '<p><b>Swing</b> es la biblioteca gráfica estándar de Java (<code>javax.swing</code>). Componentes: <code>JFrame</code> (ventana), <code>JPanel</code> (contenedor), <code>JLabel</code> (texto), <code>JButton</code> (botón), <code>JTextField</code> (campo de texto). Los <b>gestores de disposición</b> (<i>layout managers</i>) colocan los componentes: <code>BorderLayout</code> (norte, sur, este, oeste, centro), <code>FlowLayout</code> (en fila), <code>GridLayout</code> (cuadrícula).</p><pre>SwingUtilities.invokeLater(() -&gt; {\n    JFrame f = new JFrame("Ejemplo");\n    f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);\n    JLabel lbl = new JLabel("0", SwingConstants.CENTER);\n    JButton btn = new JButton("Sumar");\n    int[] n = {0};\n    btn.addActionListener(e -&gt; lbl.setText(String.valueOf(++n[0])));\n    f.add(lbl, BorderLayout.CENTER);\n    f.add(btn, BorderLayout.SOUTH);\n    f.setSize(250, 120);\n    f.setVisible(true);\n});</pre><p><b>Eventos:</b> el componente genera un <code>ActionEvent</code> y se ejecuta <code>actionPerformed(ActionEvent e)</code> de los <code>ActionListener</code> registrados con <code>addActionListener</code>. Con <code>e.getSource()</code> sabes qué componente lo disparó. <code>invokeLater</code> crea la interfaz en el hilo de eventos de Swing (EDT), porque Swing no es seguro entre hilos. <code>JOptionPane.showMessageDialog</code> muestra un cuadro de diálogo sencillo.</p>',
    ref: OR('tutorial/uiswing/events/actionlistener.html', 'Tutorial oficial de Oracle · ActionListener'),
    quiz: [
      { q: '¿Qué componente representa la ventana principal?', o: ['JPanel', 'JFrame', 'JLabel', 'JButton'], a: 1, e: 'JPanel es un contenedor que se añade a la ventana.' },
      { q: '¿Qué método se ejecuta al pulsar un botón con ActionListener?', o: ['onClick', 'actionPerformed', 'handle', 'run'], a: 1, e: 'Es el único método de la interfaz.' },
      { q: '¿Cómo se registra un listener en un botón?', o: ['btn.addActionListener(...)', 'btn.listen(...)', 'btn.onAction(...)', 'new ActionListener(btn)'], a: 0, e: 'Se registra con addActionListener.' },
      { q: '¿Qué layout divide la ventana en norte, sur, este, oeste y centro?', o: ['FlowLayout', 'GridLayout', 'BorderLayout', 'BoxLayout'], a: 2, e: 'BorderLayout es el layout por defecto de JFrame.' }
    ]
  }, { t: 'Une componente y función', tipo: 'parejas', data: {
    intro: 'Relaciona cada elemento de Swing con su función.',
    pares: [['JFrame', 'Ventana principal'], ['JPanel', 'Contenedor de componentes'], ['JLabel', 'Muestra texto'], ['JButton', 'Botón que se pulsa'], ['ActionListener', 'Responde a una acción del usuario'], ['BorderLayout', 'Norte, sur, este, oeste y centro']] } });

  A('prog', {
    t: '[Complemento] Patrón MVC: modelo, vista y controlador',
    h: NOTA + '<p><b>MVC</b> (Modelo-Vista-Controlador) separa una aplicación en tres partes para que cada una cambie sin romper las demás:</p><ul><li><b>Modelo:</b> los datos y la lógica de negocio. No sabe nada de la interfaz.</li><li><b>Vista:</b> lo que ve el usuario (por ejemplo, un <code>JFrame</code>). Muestra datos y recoge acciones.</li><li><b>Controlador:</b> recibe las acciones de la vista, actualiza el modelo y refresca la vista.</li></ul><pre>class Modelo { private int n; int get() { return n; } void inc() { n++; } }\n\nclass Vista extends JFrame {\n    JLabel lbl = new JLabel("0", SwingConstants.CENTER);\n    JButton btn = new JButton("Sumar");\n    // ... añade lbl y btn a la ventana\n}\n\nclass Controlador {\n    Controlador(Modelo m, Vista v) {\n        v.btn.addActionListener(e -&gt; {\n            m.inc();\n            v.lbl.setText(String.valueOf(m.get()));\n        });\n    }\n}</pre><p><b>Ventajas:</b> código más ordenado, la lógica se puede probar sin interfaz y se puede cambiar la vista (Swing, web…) sin tocar el modelo. Relación con las <b>3 capas</b>: el modelo corresponde a negocio y datos; la vista, a presentación.</p>',
    ref: null,
    quiz: [
      { q: '¿Qué parte de MVC contiene los datos y la lógica de negocio?', o: ['Vista', 'Controlador', 'Modelo', 'Ninguna'], a: 2, e: 'El modelo no depende de la interfaz.' },
      { q: 'El controlador…', o: ['Dibuja la interfaz', 'Recibe las acciones, actualiza el modelo y refresca la vista', 'Guarda los datos en disco siempre', 'Es lo mismo que la vista'], a: 1, e: 'Es el intermediario entre vista y modelo.' },
      { q: 'Una ventaja de MVC es…', o: ['Menos clases', 'Poder cambiar la vista sin tocar el modelo', 'Que no hacen falta pruebas', 'Que desaparece la lógica'], a: 1, e: 'Separa responsabilidades.' }
    ]
  }, { t: '¿Modelo, vista o controlador?', tipo: 'clasifica', data: {
    intro: '¿A qué parte de MVC pertenece cada elemento?',
    cats: ['Modelo', 'Vista', 'Controlador'],
    items: [['Clase Cliente con sus datos', 0], ['Cálculo del total del pedido', 0], ['JFrame con botones', 1], ['JLabel que muestra el resultado', 1], ['ActionListener del botón Guardar', 2], ['Clase que conecta vista y modelo', 2]] } });

  A('prog', {
    t: '[Complemento] Cuadros de diálogo: JOptionPane y JDialog',
    h: NOTA + '<p>Un <b>cuadro de diálogo</b> es una ventana secundaria para informar o pedir un dato. <code>JOptionPane</code> trae diálogos listos con métodos estáticos:</p><pre>JOptionPane.showMessageDialog(null, "Hola");                 // informa\nint op = JOptionPane.showConfirmDialog(null, "¿Seguro?",\n        "Confirmar", JOptionPane.YES_NO_OPTION);               // devuelve YES_OPTION o NO_OPTION\nString nombre = JOptionPane.showInputDialog("Nombre");       // devuelve el texto (null si se cancela)</pre><p><code>JDialog</code> permite crear tu propio diálogo: <code>new JDialog(ventanaPadre, "Título", true)</code>. El tercer parámetro indica si es <b>modal</b>: un diálogo modal bloquea la ventana padre hasta que se cierra. Después se le añaden componentes, se fija el tamaño con <code>setSize</code> y se muestra con <code>setVisible(true)</code>.</p>',
    ref: OR('tutorial/uiswing/components/dialog.html', 'Tutorial oficial de Oracle · How to Make Dialogs'),
    quiz: [
      { q: '¿Qué método de JOptionPane pide un texto al usuario?', o: ['showMessageDialog', 'showInputDialog', 'showConfirmDialog', 'showTextDialog'], a: 1, e: 'Devuelve el texto escrito, o null si se cancela.' },
      { q: 'Un diálogo modal…', o: ['Se cierra solo', 'Bloquea la ventana padre hasta que se cierra', 'Es siempre invisible', 'Solo sirve para errores'], a: 1, e: 'El tercer parámetro de new JDialog(padre, título, modal).' },
      { q: '¿Qué devuelve showConfirmDialog con YES_NO_OPTION si se pulsa «Sí»?', o: ['JOptionPane.YES_OPTION', 'true', '"Sí"', 'null'], a: 0, e: 'Es un int que se compara con JOptionPane.YES_OPTION.' }
    ]
  }, { t: 'Une método y uso', tipo: 'parejas', data: {
    intro: 'Relaciona cada método con su función.',
    pares: [['showMessageDialog', 'Muestra un mensaje'], ['showConfirmDialog', 'Pregunta Sí/No'], ['showInputDialog', 'Pide un texto'], ['new JDialog(p, t, true)', 'Crea un diálogo modal'], ['setVisible(true)', 'Muestra la ventana']] } });

  A('prog', {
    t: '[Complemento] Serialización de objetos',
    h: NOTA + '<p><b>Serializar</b> es convertir un objeto en una secuencia de bytes para guardarlo en un fichero o enviarlo por red; <b>deserializar</b> es reconstruirlo. La clase debe implementar la interfaz marcadora <code>Serializable</code> (no tiene métodos). Se recomienda declarar <code>serialVersionUID</code>.</p><pre>class Persona implements Serializable {\n    private static final long serialVersionUID = 1L;\n    String nombre;\n    int edad;\n    transient String clave = "secreta";   // NO se guarda\n}\n\ntry (ObjectOutputStream o = new ObjectOutputStream(new FileOutputStream("p.dat"))) {\n    o.writeObject(new Persona("Ana", 30));\n}\ntry (ObjectInputStream i = new ObjectInputStream(new FileInputStream("p.dat"))) {\n    Persona p = (Persona) i.readObject();   // clave vale null\n}</pre><p>Los campos <code>transient</code> no se serializan (al recuperar el objeto valen <code>null</code>, 0 o false) y los <code>static</code> tampoco. <code>readObject()</code> devuelve <code>Object</code>, así que hay que hacer un <i>cast</i>, y puede lanzar <code>ClassNotFoundException</code> además de <code>IOException</code>.</p>',
    ref: OR('8/docs/api/java/io/Serializable.html', 'API oficial de Java · java.io.Serializable'),
    quiz: [
      { q: '¿Qué interfaz debe implementar una clase para poder serializarse?', o: ['Comparable', 'Serializable', 'Cloneable', 'Runnable'], a: 1, e: 'Es una interfaz marcadora, sin métodos.' },
      { q: '¿Qué ocurre con un campo transient al serializar?', o: ['Se guarda cifrado', 'No se guarda', 'Se guarda dos veces', 'Provoca error'], a: 1, e: 'Al leer el objeto, el campo toma el valor por defecto (null, 0 o false).' },
      { q: '¿Qué clase escribe un objeto en un flujo de bytes?', o: ['ObjectOutputStream', 'Scanner', 'PrintWriter', 'BufferedReader'], a: 0, e: 'Con writeObject. Para leer se usa ObjectInputStream.readObject.' },
      { q: '¿Qué devuelve readObject()?', o: ['El tipo exacto', 'Un Object que hay que convertir con cast', 'Un String', 'Un int'], a: 1, e: 'Por eso se escribe (Persona) i.readObject().' }
    ]
  }, { t: 'Se guarda o no se guarda', tipo: 'clasifica', data: {
    intro: '¿Se serializa este campo?',
    cats: ['Se guarda', 'No se guarda'],
    items: [['private String nombre', 0], ['int edad', 0], ['private double saldo', 0], ['transient String clave', 1], ['static int contador', 1], ['transient int sesion', 1]] } });

  A('prog', {
    t: '[Complemento] Documentación con JavaDoc',
    h: NOTA + '<p><b>JavaDoc</b> genera documentación HTML a partir de comentarios especiales que empiezan por <code>/**</code> y se colocan justo antes de la clase, el método o el atributo.</p><pre>/**\n * Suma dos enteros.\n * @param a primer sumando\n * @param b segundo sumando\n * @return la suma\n */\nstatic int suma(int a, int b) { return a + b; }</pre><p>Etiquetas habituales: <code>@param</code> (un parámetro), <code>@return</code> (qué devuelve), <code>@throws</code> (excepción que puede lanzar), <code>@author</code> y <code>@version</code> (en clases) y <code>@see</code> (referencia). Con la herramienta <code>javadoc</code> se genera la web (por ejemplo, <code>javadoc -d doc MiClase.java</code>) y Eclipse lo hace con <i>Project → Generate Javadoc</i>. Los comentarios normales son <code>//</code> (línea) y <code>/* … */</code> (bloque): estos no generan documentación.</p>',
    ref: { href: 'https://docs.oracle.com/en/java/javase/17/javadoc/javadoc.html', text: 'Documentación oficial · herramienta javadoc (JDK 17)' },
    quiz: [
      { q: '¿Con qué empieza un comentario JavaDoc?', o: ['//', '/*', '/**', '#'], a: 2, e: 'Se coloca justo antes de la clase, método o atributo.' },
      { q: '¿Qué etiqueta describe el valor que devuelve un método?', o: ['@param', '@return', '@see', '@author'], a: 1, e: '@param describe un parámetro.' },
      { q: '¿Qué herramienta genera la documentación HTML?', o: ['javac', 'java', 'javadoc', 'jar'], a: 2, e: 'Por ejemplo: javadoc -d doc MiClase.java.' }
    ]
  }, { t: 'Une etiqueta y función', tipo: 'parejas', data: {
    intro: 'Relaciona cada etiqueta JavaDoc.',
    pares: [['@param', 'Describe un parámetro'], ['@return', 'Describe el valor devuelto'], ['@throws', 'Indica una excepción posible'], ['@author', 'Autor de la clase'], ['@see', 'Referencia a otro elemento']] } });
})();
