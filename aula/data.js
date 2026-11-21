/* Contenido de Aula DAW 1.
   Para añadir una lección: copia un bloque { t, h, code, try, quiz } dentro de "lessons" de la asignatura.
   try: 'html' (editor con vista previa), 'xml' (comprueba si está bien formado) o null.
   widget: 'bin' muestra el conversor decimal/binario. */
window.DATA = [
  {
    id: 'marcas', name: 'Lenguaje de Marcas', short: 'HTML y XML', color: 'marcas',
    intro: 'Cómo funciona Internet, qué es un lenguaje de marcas y cómo se escribe HTML y XML desde cero.',
    lessons: [
      {
        t: 'Internet y los lenguajes de marcas',
        h: `<p>Cuando abres una web, tu <strong>navegador</strong> (el cliente) pide una página a un <strong>servidor</strong> usando el protocolo <strong>HTTP</strong>. El servidor responde con un documento, normalmente escrito en HTML, y el navegador lo dibuja en pantalla.</p>
<p>Una dirección como <code>https://www.ejemplo.es/index.html</code> se llama <strong>URL</strong>: indica el protocolo, el servidor y el archivo que se pide.</p>
<p>Un <strong>lenguaje de marcas</strong> añade <em>etiquetas</em> a un texto para decir qué es cada parte (un título, un párrafo, un dato). No calcula ni toma decisiones, y por eso no es un lenguaje de programación.</p>
<ul><li><strong>HTML</strong>: describe páginas web.</li><li><strong>XML</strong>: describe datos con etiquetas que inventas tú.</li><li><strong>Markdown</strong>: marcas muy simples para escribir texto con formato.</li></ul>`,
        code: `<alumno>
  <nombre>Alba</nombre>
  <curso>DAW 1</curso>
</alumno>`,
        try: 'xml',
        quiz: [
          { q: '¿Qué protocolo usa el navegador para pedir una página al servidor?', o: ['HTTP', 'SQL', 'XML', 'PSeInt'], a: 0, e: 'HTTP es el protocolo de la web: el cliente pide y el servidor responde.' },
          { q: 'Un lenguaje de marcas sirve para...', o: ['Hacer cálculos y bucles', 'Describir la estructura y el contenido de un texto con etiquetas', 'Guardar datos en tablas relacionadas', 'Instalar programas'], a: 1, e: 'Las marcas indican qué es cada parte del documento.' },
          { q: '¿Cuál de estos es un lenguaje de marcas?', o: ['Java', 'SQL', 'XML', 'Linux'], a: 2, e: 'Java es un lenguaje de programación, SQL consulta bases de datos y Linux es un sistema operativo.' }
        ]
      },
      {
        t: 'Estructura de un documento HTML',
        h: `<p>Todo documento HTML tiene la misma base:</p>
<ul><li><code>&lt;!DOCTYPE html&gt;</code>: dice que es HTML5.</li><li><code>&lt;html&gt;</code>: contiene todo el documento.</li><li><code>&lt;head&gt;</code>: información que no se ve en la página, como el título de la pestaña (<code>&lt;title&gt;</code>) y la codificación.</li><li><code>&lt;body&gt;</code>: lo que se ve en la página.</li></ul>
<p>Casi todas las etiquetas se abren y se cierran: <code>&lt;p&gt;</code> abre y <code>&lt;/p&gt;</code> cierra. Lo que hay entre las dos es el contenido del elemento.</p>`,
        code: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mi primera página</title>
</head>
<body>
  <h1>Hola, mundo</h1>
  <p>Esta es mi primera página web.</p>
</body>
</html>`,
        try: 'html',
        quiz: [
          { q: '¿Dónde se escribe el contenido que se ve en la página?', o: ['<head>', '<body>', '<title>', '<meta>'], a: 1, e: 'El <body> contiene lo visible. El <head> guarda información sobre el documento.' },
          { q: '¿Qué etiqueta pone el nombre en la pestaña del navegador?', o: ['<h1>', '<head>', '<title>', '<header>'], a: 2, e: '<title> va dentro de <head>.' },
          { q: '¿Para qué sirve <!DOCTYPE html>?', o: ['Para poner un título', 'Para indicar que el documento es HTML5', 'Para cerrar la página', 'Para enlazar una imagen'], a: 1 }
        ]
      },
      {
        t: 'Texto, enlaces e imágenes',
        h: `<p>Los <strong>títulos</strong> van de <code>&lt;h1&gt;</code> (el más importante) a <code>&lt;h6&gt;</code>. Los párrafos usan <code>&lt;p&gt;</code>. Para destacar texto: <code>&lt;strong&gt;</code> (negrita con importancia) y <code>&lt;em&gt;</code> (cursiva con énfasis).</p>
<p>Un <strong>enlace</strong> usa <code>&lt;a href="dirección"&gt;texto&lt;/a&gt;</code>. Una <strong>imagen</strong> usa <code>&lt;img src="archivo" alt="descripción"&gt;</code>. El atributo <code>alt</code> es el texto que se muestra si la imagen no carga y el que leen los lectores de pantalla.</p>
<p><code>href</code>, <code>src</code> y <code>alt</code> son <strong>atributos</strong>: se escriben dentro de la etiqueta de apertura, con el valor entre comillas.</p>`,
        code: `<h1>Mi blog</h1>
<h2>Primera entrada</h2>
<p>Hoy aprendo <strong>HTML</strong> y me gusta mucho.</p>
<p>Visita <a href="https://developer.mozilla.org/es/">MDN</a> para aprender más.</p>
<img src="foto-que-no-existe.jpg" alt="Una foto de ejemplo">`,
        try: 'html',
        quiz: [
          { q: '¿Qué atributo indica a dónde lleva un enlace?', o: ['src', 'alt', 'href', 'link'], a: 2 },
          { q: '¿Para qué sirve el atributo alt de una imagen?', o: ['Para cambiar su tamaño', 'Para dar un texto alternativo si no carga y para lectores de pantalla', 'Para ponerle un borde', 'Para enlazarla'], a: 1 },
          { q: '¿Cuál es el título más importante?', o: ['<h6>', '<h3>', '<h1>', '<title>'], a: 2, e: 'h1 es el nivel más alto. Normalmente solo hay uno por página.' }
        ]
      },
      {
        t: 'Listas y tablas',
        h: `<p>Hay dos tipos de listas: <code>&lt;ul&gt;</code> (con viñetas) y <code>&lt;ol&gt;</code> (numerada). Cada elemento va en un <code>&lt;li&gt;</code>.</p>
<p>Una <strong>tabla</strong> se construye por filas: <code>&lt;table&gt;</code> contiene filas <code>&lt;tr&gt;</code>, y cada fila contiene celdas <code>&lt;td&gt;</code> o celdas de cabecera <code>&lt;th&gt;</code>.</p>`,
        code: `<ul>
  <li>HTML</li>
  <li>XML</li>
</ul>
<ol>
  <li>Abrir el editor</li>
  <li>Escribir el código</li>
</ol>
<table border="1">
  <tr><th>Asignatura</th><th>Nota</th></tr>
  <tr><td>Lenguaje de Marcas</td><td>8</td></tr>
  <tr><td>Bases de Datos</td><td>7</td></tr>
</table>`,
        try: 'html',
        quiz: [
          { q: '¿Qué etiqueta crea una lista numerada?', o: ['<ul>', '<ol>', '<li>', '<dl>'], a: 1 },
          { q: 'En una tabla, ¿qué etiqueta es una fila?', o: ['<td>', '<th>', '<tr>', '<row>'], a: 2 },
          { q: '¿Qué etiqueta es una celda de cabecera?', o: ['<th>', '<td>', '<tr>', '<head>'], a: 0 }
        ]
      },
      {
        t: 'Formularios',
        h: `<p>Un <strong>formulario</strong> recoge datos del usuario. Se crea con <code>&lt;form&gt;</code> y dentro se ponen los controles:</p>
<ul><li><code>&lt;input type="text"&gt;</code>: texto. Otros tipos: <code>email</code>, <code>password</code>, <code>number</code>, <code>checkbox</code>, <code>radio</code>.</li><li><code>&lt;label&gt;</code>: el nombre del campo. Se enlaza con el control mediante <code>for</code> e <code>id</code>.</li><li><code>&lt;select&gt;</code> con <code>&lt;option&gt;</code>: lista desplegable.</li><li><code>&lt;textarea&gt;</code>: texto largo.</li><li><code>&lt;button&gt;</code>: botón de enviar.</li></ul>`,
        code: `<form>
  <label for="nombre">Nombre</label>
  <input type="text" id="nombre" name="nombre"><br><br>
  <label for="curso">Curso</label>
  <select id="curso" name="curso">
    <option>DAW 1</option>
    <option>DAW 2</option>
  </select><br><br>
  <label><input type="checkbox"> Acepto las condiciones</label><br><br>
  <button type="button">Enviar</button>
</form>`,
        try: 'html',
        quiz: [
          { q: '¿Qué tipo de input oculta lo que escribes?', o: ['text', 'password', 'hidden', 'number'], a: 1 },
          { q: '¿Cómo se enlaza un <label> con su campo?', o: ['for con el id del campo', 'href', 'src', 'class'], a: 0 },
          { q: '¿Qué etiqueta crea una lista desplegable?', o: ['<input>', '<option>', '<select>', '<list>'], a: 2 }
        ]
      },
      {
        t: 'XML: documentos bien formados',
        h: `<p>XML guarda datos con etiquetas que inventas tú. Para que un documento sea <strong>bien formado</strong> debe cumplir estas reglas:</p>
<ul><li>Tiene un <strong>único elemento raíz</strong> que contiene a todos los demás.</li><li>Toda etiqueta que se abre se <strong>cierra</strong>.</li><li>Las etiquetas están bien <strong>anidadas</strong>: la última que abres es la primera que cierras.</li><li>Distingue <strong>mayúsculas y minúsculas</strong>: <code>&lt;a&gt;</code> no es <code>&lt;A&gt;</code>.</li><li>Los valores de los atributos van <strong>entre comillas</strong>.</li></ul>
<p>Prueba abajo: rompe una regla (por ejemplo, quita un cierre) y pulsa Comprobar para ver el error.</p>`,
        code: `<?xml version="1.0" encoding="UTF-8"?>
<biblioteca>
  <libro id="1">
    <titulo>Don Quijote</titulo>
    <autor>Cervantes</autor>
  </libro>
  <libro id="2">
    <titulo>La Celestina</titulo>
    <autor>Fernando de Rojas</autor>
  </libro>
</biblioteca>`,
        try: 'xml',
        quiz: [
          { q: '¿Cuántos elementos raíz puede tener un documento XML bien formado?', o: ['Ninguno', 'Uno', 'Dos', 'Los que quiera'], a: 1 },
          { q: '¿Cuál de estos fragmentos está bien anidado?', o: ['<a><b></a></b>', '<a><b></b></a>', '<a><b></a>', '<a></b></a>'], a: 1 },
          { q: '¿XML distingue entre mayúsculas y minúsculas?', o: ['Sí', 'No', 'Solo en atributos', 'Solo en la raíz'], a: 0 }
        ]
      }
    ]
  },
  {
    id: 'prog', name: 'Programación', short: 'Java desde cero', color: 'prog',
    intro: 'Aprende a programar en Java: primer programa, variables, condiciones y bucles.',
    lessons: [
      {
        t: 'Tu primer programa en Java',
        h: `<p>Un programa es una lista de instrucciones que el ordenador ejecuta en orden. En Java, el código se escribe en un archivo <code>.java</code>, se <strong>compila</strong> (se traduce a un formato que entiende la máquina virtual de Java) y después se <strong>ejecuta</strong>.</p>
<p>Todo programa empieza en el método <code>main</code>. Cada instrucción acaba en <code>;</code> y los bloques van entre llaves <code>{ }</code>. El nombre de la clase debe coincidir con el nombre del archivo: <code>Hola.java</code> contiene <code>class Hola</code>.</p>
<p><code>System.out.println(...)</code> escribe un texto en pantalla y salta de línea.</p>`,
        code: `public class Hola {
    public static void main(String[] args) {
        System.out.println("Hola, mundo");
        System.out.println("Estoy aprendiendo Java");
    }
}`,
        try: null,
        quiz: [
          { q: '¿Cómo se llama el método donde empieza un programa Java?', o: ['start', 'main', 'run', 'init'], a: 1 },
          { q: '¿Con qué carácter acaba normalmente cada instrucción?', o: ['.', ',', ';', ':'], a: 2 },
          { q: 'Si el archivo se llama Hola.java, la clase pública debe llamarse...', o: ['hola', 'Programa', 'Hola', 'Main'], a: 2, e: 'En Java el nombre de la clase pública coincide con el del archivo, respetando mayúsculas.' }
        ]
      },
      {
        t: 'Variables y tipos de datos',
        h: `<p>Una <strong>variable</strong> es un nombre que guarda un valor. En Java hay que decir el tipo al crearla:</p>
<ul><li><code>int</code>: números enteros (<code>7</code>).</li><li><code>double</code>: números con decimales (<code>3.14</code>).</li><li><code>boolean</code>: <code>true</code> o <code>false</code>.</li><li><code>char</code>: un carácter entre comillas simples (<code>'a'</code>).</li><li><code>String</code>: texto entre comillas dobles (<code>"hola"</code>).</li></ul>
<p>Los nombres de variables usan <strong>camelCase</strong> (<code>edadAlumno</code>). Una <strong>constante</strong> se declara con <code>final</code> y su valor no puede cambiar.</p>`,
        code: `public class Variables {
    public static void main(String[] args) {
        int edad = 18;
        double altura = 1.65;
        boolean estudiante = true;
        char inicial = 'A';
        String nombre = "Alba";
        final double IVA = 0.21;

        System.out.println(nombre + " tiene " + edad + " años");
        System.out.println("IVA: " + IVA);
    }
}`,
        try: null,
        quiz: [
          { q: '¿Qué tipo usarías para guardar 3.14?', o: ['int', 'double', 'char', 'boolean'], a: 1 },
          { q: '¿Qué palabra convierte una variable en constante?', o: ['static', 'const', 'final', 'fixed'], a: 2 },
          { q: '¿Cuál es una declaración correcta?', o: ['String nombre = \'Ana\';', 'int edad = "18";', 'String nombre = "Ana";', 'char c = "a";'], a: 2, e: 'String va con comillas dobles; char, con comillas simples.' }
        ]
      },
      {
        t: 'Operadores y condicionales',
        h: `<p>Operadores aritméticos: <code>+ - * / %</code> (el <code>%</code> es el resto de la división). De comparación: <code>== != &lt; &gt; &lt;= &gt;=</code>. Lógicos: <code>&amp;&amp;</code> (y), <code>||</code> (o) y <code>!</code> (no).</p>
<p>Con <code>if</code> el programa decide qué camino seguir según una condición, que siempre es <code>true</code> o <code>false</code>. Se puede añadir <code>else</code> y <code>else if</code>.</p>
<p>Cuidado: <code>=</code> asigna un valor y <code>==</code> compara.</p>`,
        code: `public class Nota {
    public static void main(String[] args) {
        int nota = 7;
        if (nota >= 9) {
            System.out.println("Sobresaliente");
        } else if (nota >= 7) {
            System.out.println("Notable");
        } else if (nota >= 5) {
            System.out.println("Aprobado");
        } else {
            System.out.println("Suspenso");
        }
    }
}`,
        try: null,
        quiz: [
          { q: '¿Qué operador compara si dos valores son iguales?', o: ['=', '==', '!=', '=>'], a: 1 },
          { q: '¿Cuánto vale 17 % 5?', o: ['3', '2', '4', '0'], a: 1, e: '17 entre 5 es 3 y sobran 2.' },
          { q: 'El código del ejemplo, con nota = 7, escribe...', o: ['Sobresaliente', 'Notable', 'Aprobado', 'Suspenso'], a: 1 }
        ]
      },
      {
        t: 'Bucles: repetir instrucciones',
        h: `<p>Un <strong>bucle</strong> repite un bloque mientras se cumpla una condición.</p>
<ul><li><code>while</code>: repite mientras la condición sea verdadera. Se usa cuando no sabes cuántas veces.</li><li><code>for</code>: tiene inicio, condición y paso en una sola línea. Se usa cuando sabes cuántas veces.</li></ul>
<p>Si la condición nunca se vuelve falsa, el bucle es <strong>infinito</strong> y el programa no termina.</p>`,
        code: `public class Bucles {
    public static void main(String[] args) {
        int suma = 0;
        for (int i = 1; i <= 10; i++) {
            suma = suma + i;
        }
        System.out.println("Suma de 1 a 10: " + suma);

        int n = 3;
        while (n > 0) {
            System.out.println("Cuenta atrás: " + n);
            n--;
        }
    }
}`,
        try: null,
        quiz: [
          { q: '¿Qué bucle usarías si sabes exactamente cuántas veces repetir?', o: ['for', 'if', 'switch', 'else'], a: 0 },
          { q: '¿Qué hace i++?', o: ['Resta 1 a i', 'Suma 1 a i', 'Multiplica i por 2', 'Compara i con 1'], a: 1 },
          { q: '¿Qué pasa si la condición de un while nunca es falsa?', o: ['El programa se detiene solo', 'Da un error de compilación', 'El bucle es infinito', 'Se ejecuta una vez'], a: 2 }
        ]
      }
    ]
  },
  {
    id: 'entornos', name: 'Entornos de Desarrollo', short: 'Algoritmos y PSeInt', color: 'entornos',
    intro: 'Ciclo de vida del software, algoritmos, diagramas de flujo con PSeInt y normas de escritura en Java.',
    lessons: [
      {
        t: 'Ciclo de vida del software',
        h: `<p>Hacer software no es solo escribir código. Las fases habituales son:</p>
<ol><li><strong>Análisis</strong>: qué necesita el cliente (requisitos).</li><li><strong>Diseño</strong>: cómo se va a construir.</li><li><strong>Codificación</strong>: escribir el programa.</li><li><strong>Pruebas</strong>: comprobar que funciona y buscar errores.</li><li><strong>Implantación y mantenimiento</strong>: ponerlo en uso y corregir o mejorar después.</li></ol>
<p>En el modelo en <strong>cascada</strong> cada fase empieza cuando acaba la anterior. En los modelos <strong>iterativos</strong> se repiten ciclos cortos y se entregan versiones parciales.</p>`,
        code: null,
        try: null,
        quiz: [
          { q: '¿Qué fase define lo que necesita el cliente?', o: ['Pruebas', 'Análisis', 'Codificación', 'Mantenimiento'], a: 1 },
          { q: 'En el modelo en cascada...', o: ['Las fases se hacen a la vez', 'Cada fase empieza al acabar la anterior', 'No hay pruebas', 'Solo hay una fase'], a: 1 },
          { q: '¿Qué fase busca errores en el programa?', o: ['Diseño', 'Análisis', 'Pruebas', 'Implantación'], a: 2 }
        ]
      },
      {
        t: 'Algoritmos y diagramas de flujo',
        h: `<p>Un <strong>algoritmo</strong> es una secuencia de pasos ordenados, claros y finitos para resolver un problema. Antes de programar se suele dibujar un <strong>diagrama de flujo</strong>, con estas figuras:</p>
<ul><li><strong>Óvalo</strong>: inicio y fin.</li><li><strong>Paralelogramo</strong>: entrada y salida de datos (leer, escribir).</li><li><strong>Rectángulo</strong>: proceso (cálculos, asignaciones).</li><li><strong>Rombo</strong>: decisión (sí o no).</li><li><strong>Flechas</strong>: el orden de los pasos.</li></ul>
<p><strong>PSeInt</strong> es un programa que te deja escribir algoritmos en pseudocódigo, ejecutarlos y generar el diagrama de flujo automáticamente.</p>`,
        code: `Algoritmo MayorDeEdad
    Definir edad Como Entero
    Escribir "¿Qué edad tienes?"
    Leer edad
    Si edad >= 18 Entonces
        Escribir "Eres mayor de edad"
    SiNo
        Escribir "Eres menor de edad"
    FinSi
FinAlgoritmo`,
        try: null,
        quiz: [
          { q: '¿Qué figura representa una decisión?', o: ['Óvalo', 'Rectángulo', 'Rombo', 'Paralelogramo'], a: 2 },
          { q: '¿Qué figura se usa para leer o escribir datos?', o: ['Paralelogramo', 'Rombo', 'Óvalo', 'Círculo'], a: 0 },
          { q: '¿Qué hace PSeInt?', o: ['Compila Java', 'Permite escribir y ejecutar algoritmos en pseudocódigo y ver su diagrama', 'Diseña bases de datos', 'Instala sistemas operativos'], a: 1 }
        ]
      },
      {
        t: 'Normas de escritura en Java',
        h: `<p>Seguir las mismas normas hace que el código sea legible para cualquiera. Las convenciones de Java son:</p>
<ul><li><strong>Clases</strong>: cada palabra empieza en mayúscula (<code>CuentaBancaria</code>). Esto se llama PascalCase.</li><li><strong>Métodos y variables</strong>: empiezan en minúscula y cada palabra nueva en mayúscula (<code>calcularTotal</code>, <code>edadAlumno</code>). Esto se llama camelCase.</li><li><strong>Constantes</strong>: todo en mayúsculas con guiones bajos (<code>MAX_ALUMNOS</code>).</li><li><strong>Paquetes</strong>: todo en minúsculas (<code>com.ejemplo.tienda</code>).</li><li><strong>Sangría</strong> de 4 espacios dentro de cada bloque y una instrucción por línea.</li><li>Nombres con significado: <code>precioFinal</code> mejor que <code>x</code>.</li></ul>`,
        code: `public class CuentaBancaria {
    private static final double COMISION_MAXIMA = 5.0;
    private double saldoActual;

    public double calcularInteres(double porcentaje) {
        return saldoActual * porcentaje / 100;
    }
}`,
        try: null,
        quiz: [
          { q: '¿Cómo se escribe correctamente el nombre de una clase?', o: ['cuentaBancaria', 'cuenta_bancaria', 'CuentaBancaria', 'CUENTABANCARIA'], a: 2 },
          { q: '¿Cómo se escribe una constante?', o: ['maxAlumnos', 'MaxAlumnos', 'MAX_ALUMNOS', 'max-alumnos'], a: 2 },
          { q: '¿Cuál es un buen nombre para una variable con el precio final?', o: ['x', 'precioFinal', 'PRECIO', 'p1'], a: 1 }
        ]
      },
      {
        t: 'Entornos de desarrollo (IDE)',
        h: `<p>Un <strong>IDE</strong> (entorno de desarrollo integrado) reúne en un solo programa todo lo necesario para programar:</p>
<ul><li><strong>Editor</strong> con colores y autocompletado.</li><li><strong>Compilador</strong> o intérprete, que traduce tu código a algo que la máquina ejecuta.</li><li><strong>Depurador</strong> (debugger), para ejecutar paso a paso y ver el valor de las variables.</li><li>Gestión de proyectos y archivos.</li></ul>
<p>Algunos IDE conocidos para Java son Eclipse, IntelliJ IDEA y NetBeans. Un editor de texto como Bloc de notas no tiene nada de esto.</p>
<p>Un <strong>compilador</strong> traduce todo el programa antes de ejecutarlo. Un <strong>intérprete</strong> lo traduce y ejecuta línea a línea.</p>`,
        code: null,
        try: null,
        quiz: [
          { q: '¿Qué permite hacer un depurador?', o: ['Ejecutar el programa paso a paso y ver las variables', 'Dibujar diagramas', 'Instalar Java', 'Crear tablas'], a: 0 },
          { q: 'IDE significa...', o: ['Entorno de desarrollo integrado', 'Internet de datos electrónicos', 'Interfaz de diseño extendida', 'Editor de documentos externos'], a: 0 },
          { q: '¿Cuál es un IDE para Java?', o: ['Eclipse', 'Excel', 'PSeInt', 'Chrome'], a: 0 }
        ]
      }
    ]
  },
  {
    id: 'sistemas', name: 'Sistemas Informáticos', short: 'Hardware y sistemas operativos', color: 'sistemas',
    intro: 'Las partes de un ordenador, cómo se representan los datos en binario y cómo funciona un sistema operativo.',
    lessons: [
      {
        t: 'Hardware: las partes de un ordenador',
        h: `<p>El <strong>hardware</strong> es la parte física. Los componentes principales son:</p>
<ul><li><strong>CPU (procesador)</strong>: ejecuta las instrucciones. Es el cerebro.</li><li><strong>Memoria RAM</strong>: guarda lo que se está usando ahora. Es rápida y se borra al apagar.</li><li><strong>Almacenamiento</strong> (disco duro HDD o SSD): guarda los datos de forma permanente.</li><li><strong>Placa base</strong>: conecta todos los componentes.</li><li><strong>Fuente de alimentación</strong>: da electricidad.</li><li><strong>Periféricos</strong>: de entrada (teclado, ratón), de salida (monitor, impresora) y de entrada/salida (pantalla táctil).</li></ul>
<p>El software es la parte lógica: programas y datos.</p>`,
        code: null,
        try: null,
        quiz: [
          { q: '¿Qué memoria se borra al apagar el ordenador?', o: ['SSD', 'RAM', 'Disco duro', 'USB'], a: 1 },
          { q: '¿Qué componente ejecuta las instrucciones de los programas?', o: ['Placa base', 'Fuente', 'CPU', 'Monitor'], a: 2 },
          { q: 'Un monitor es un periférico de...', o: ['Entrada', 'Salida', 'Almacenamiento', 'Red'], a: 1 }
        ]
      },
      {
        t: 'Sistemas de numeración: binario',
        h: `<p>Los ordenadores solo entienden dos estados, así que guardan todo en <strong>binario</strong>, con ceros y unos. Cada cifra es un <strong>bit</strong>. Ocho bits forman un <strong>byte</strong>.</p>
<p>Cada posición del número binario vale una potencia de 2, de derecha a izquierda: 1, 2, 4, 8, 16, 32, 64, 128. Para pasar de binario a decimal, suma los valores de las posiciones donde hay un 1. Por ejemplo, <code>1011</code> = 8 + 2 + 1 = <strong>11</strong>.</p>
<p>Para pasar de decimal a binario, divide entre 2 repetidamente y apunta los restos, leyéndolos al revés. También se usa el sistema <strong>hexadecimal</strong> (base 16, con dígitos 0-9 y A-F), porque es más corto de escribir.</p>
<p>Usa el conversor para practicar.</p>`,
        code: null,
        widget: 'bin',
        try: null,
        quiz: [
          { q: '¿Cuántos bits tiene un byte?', o: ['4', '8', '16', '10'], a: 1 },
          { q: '¿Cuánto vale 101 en decimal?', o: ['3', '4', '5', '6'], a: 2, e: '4 + 0 + 1 = 5.' },
          { q: '¿Cómo se escribe 6 en binario?', o: ['101', '110', '111', '100'], a: 1, e: '6 = 4 + 2, así que 110.' }
        ]
      },
      {
        t: 'El sistema operativo',
        h: `<p>El <strong>sistema operativo</strong> (SO) es el programa que hace de intermediario entre el hardware y las aplicaciones. Sus funciones principales son:</p>
<ul><li>Gestionar los <strong>procesos</strong> (qué programa usa la CPU y cuándo).</li><li>Gestionar la <strong>memoria</strong>.</li><li>Gestionar los <strong>archivos</strong> y carpetas.</li><li>Gestionar los <strong>dispositivos</strong> mediante controladores (drivers).</li><li>Gestionar <strong>usuarios</strong> y permisos.</li><li>Dar una <strong>interfaz</strong> (gráfica o de comandos).</li></ul>
<p>Ejemplos: Windows, macOS, Linux (de código abierto), Android e iOS. El <strong>núcleo</strong> (kernel) es la parte central del SO.</p>`,
        code: null,
        try: null,
        quiz: [
          { q: '¿Cuál de estos es un sistema operativo de código abierto?', o: ['Windows', 'Linux', 'iOS', 'macOS'], a: 1 },
          { q: 'El SO hace de intermediario entre...', o: ['El usuario y la impresora', 'El hardware y las aplicaciones', 'Dos ordenadores', 'La RAM y el disco únicamente'], a: 1 },
          { q: '¿Cómo se llama la parte central de un SO?', o: ['Shell', 'Driver', 'Kernel', 'Escritorio'], a: 2 }
        ]
      },
      {
        t: 'Comandos básicos de Linux',
        h: `<p>En Linux se puede trabajar escribiendo órdenes en la <strong>terminal</strong>. Los comandos más usados:</p>
<ul><li><code>pwd</code>: muestra en qué carpeta estás.</li><li><code>ls</code>: lista el contenido de la carpeta.</li><li><code>cd carpeta</code>: entra en una carpeta (<code>cd ..</code> sube un nivel).</li><li><code>mkdir nombre</code>: crea una carpeta.</li><li><code>touch archivo</code>: crea un archivo vacío.</li><li><code>cp origen destino</code>: copia. <code>mv origen destino</code>: mueve o renombra.</li><li><code>rm archivo</code>: borra (¡no va a la papelera!).</li><li><code>man comando</code>: muestra la ayuda.</li></ul>`,
        code: `pwd
mkdir practicas
cd practicas
touch notas.txt
ls
cp notas.txt copia.txt
mv copia.txt apuntes.txt
rm notas.txt`,
        try: null,
        quiz: [
          { q: '¿Qué comando muestra la carpeta actual?', o: ['ls', 'cd', 'pwd', 'dir'], a: 2 },
          { q: '¿Qué comando crea una carpeta?', o: ['mkdir', 'touch', 'cp', 'cd'], a: 0 },
          { q: '¿Qué hace cd ..?', o: ['Borra la carpeta', 'Sube a la carpeta anterior', 'Crea una carpeta', 'Lista archivos'], a: 1 }
        ]
      }
    ]
  },
  {
    id: 'bd', name: 'Bases de Datos', short: 'Diseño, modelo relacional y normalización', color: 'bd',
    intro: 'Los 4 temas de tu temario: fundamentos, diseño entidad-relación, modelo relacional y formas normales. Al final, un adelanto de SQL.',
    lessons: [
      {
        t: 'Fichero frente a base de datos',
        ref: { href: '../bases-de-datos/tema-1.html', text: 'Tema 1: Fundamentos' },
        h: `<p>En el método clásico de <strong>ficheros</strong>, la informática estaba orientada a los <em>procesos</em>: cada aplicación tenía sus propios datos, y por eso se guardaban varias veces los mismos datos para distintas aplicaciones.</p>
<p>Las <strong>bases de datos</strong> nacen para solucionarlo y están orientadas a los <em>datos</em>. Una base de datos es un depósito de datos <strong>integrados y compartidos</strong>, con una <strong>redundancia controlada</strong>, que refleja las relaciones del mundo real. Su característica principal es que los datos son <strong>independientes de las aplicaciones</strong> que los usan: quien programa no necesita saber cómo están guardados en el disco.</p>
<p><strong>Ventajas</strong> de implantar un SGBD: acceso rápido, coherencia (todos usan la misma fuente), mejor disponibilidad y menos redundancia perjudicial. <strong>Inconvenientes</strong>: hardware y software costosos, personal muy especializado (el administrador), implantación laboriosa y una rentabilidad que no se nota a corto plazo.</p>`,
        code: null, try: null,
        quiz: [
          { q: '¿Qué problema tenía el método clásico de ficheros?', o: ['Los datos se guardaban varias veces para distintas aplicaciones', 'No se podían guardar números', 'Era demasiado rápido', 'No usaba ordenadores'], a: 0 },
          { q: 'Una base de datos tiene una redundancia...', o: ['Total', 'Controlada', 'Inexistente siempre', 'Obligatoria en cada tabla'], a: 1 },
          { q: '¿Cuál es un inconveniente de implantar un SGBD?', o: ['Acceso lento', 'Incoherencia de los datos', 'Hardware y personal especializado costosos', 'No permite compartir datos'], a: 2 }
        ]
      },
      {
        t: 'Los tres niveles y el SGBD',
        ref: { href: '../bases-de-datos/tema-1.html', text: 'Tema 1: Fundamentos' },
        h: `<p>La arquitectura de una base de datos se divide en <strong>tres niveles de abstracción</strong> (norma ANSI/X3/SPARC):</p>
<ul><li><strong>Esquema físico</strong> (nivel interno): cómo están realmente guardados los datos en la máquina. Lo maneja el administrador.</li><li><strong>Esquema conceptual</strong> (nivel lógico global): el plano general de qué datos existen y cómo se relacionan.</li><li><strong>Esquema externo</strong> (vistas de usuario): lo que ve cada usuario final, solo lo que necesita para su trabajo.</li></ul>
<p>El <strong>SGBD</strong> (Oracle, DB2, SQL Server...) es el conjunto de programas que hace de intermediario entre los usuarios y los datos físicos. Sus objetivos: <strong>independencia</strong> de los datos (física y lógica), <strong>mínima redundancia</strong>, <strong>integridad</strong> (datos verdaderos), <strong>seguridad</strong> (no perderlos) y <strong>privacidad</strong> (acceso solo a quien está autorizado).</p>
<p>Tres funciones: <strong>definición</strong> (lenguaje LDD, crea la estructura), <strong>manipulación</strong> (lenguaje LMD, como SQL: buscar, añadir, modificar y borrar) y <strong>utilización</strong> (copias de seguridad, usuarios, estadísticas).</p>
<p>Los perfiles: <strong>administrador</strong> (diseño físico, copias, permisos), <strong>analistas o diseñadores</strong> (modelo conceptual), <strong>programadores</strong> (aplicaciones) y <strong>usuarios finales</strong>.</p>`,
        code: null, try: null,
        quiz: [
          { q: '¿Qué nivel muestra cómo se guardan realmente los datos en el disco?', o: ['Externo', 'Conceptual', 'Físico (interno)', 'De usuario'], a: 2 },
          { q: 'La independencia lógica significa que...', o: ['Cambiar los discos no afecta a los programas', 'Añadir campos lógicos no rompe las aplicaciones que usan subconjuntos de datos', 'Los datos no necesitan claves', 'Solo el administrador ve los datos'], a: 1 },
          { q: '¿Qué función del SGBD usa un lenguaje como SQL para buscar, añadir, modificar o borrar?', o: ['Definición', 'Manipulación', 'Utilización', 'Privacidad'], a: 1 },
          { q: '¿Quién crea el modelo conceptual a partir de las reglas de negocio?', o: ['El usuario final', 'El administrador', 'Los analistas o diseñadores', 'El programador'], a: 2 }
        ]
      },
      {
        t: 'Las fases del diseño de una base de datos',
        ref: { href: '../bases-de-datos/tema-2.html', text: 'Tema 2: Diseño conceptual y lógico' },
        h: `<p>Diseñar una base de datos se hace en <strong>4 fases</strong>:</p>
<ol><li><strong>Recolección y análisis de requisitos</strong>: junto con el cliente se fijan las restricciones y se hace un primer diagrama con las entidades importantes, sus relaciones y sus atributos. Puede repetirse varias veces en sistemas grandes.</li><li><strong>Diseño conceptual</strong>: se construye el <strong>modelo entidad-relación</strong>.</li><li><strong>Diseño lógico-relacional</strong>: se pasa al <strong>modelo relacional</strong> y se refina aplicando reglas de <strong>normalización</strong>, para eliminar impurezas o errores.</li><li><strong>Diseño físico</strong>: con un lenguaje de definición de datos (DDL), como SQL, se crea la base de datos en un SGBD concreto buscando la mayor eficiencia.</li></ol>
<p>Lo que se busca siempre son bases de datos <strong>escalables</strong> y fáciles de usar, que se adapten a nuevas necesidades sin perder calidad.</p>`,
        code: null, try: null,
        quiz: [
          { q: '¿En qué fase se aplican las reglas de normalización?', o: ['Análisis de requisitos', 'Diseño conceptual', 'Diseño lógico-relacional', 'Diseño físico'], a: 2 },
          { q: '¿Qué modelo se construye en el diseño conceptual?', o: ['Relacional', 'Entidad-relación', 'Físico', 'Orientado a objetos'], a: 1 },
          { q: '¿En qué fase se crea la base de datos con SQL en un SGBD concreto?', o: ['Fase 1', 'Fase 2', 'Fase 3', 'Fase 4 (diseño físico)'], a: 3 }
        ]
      },
      {
        t: 'Entidades y atributos',
        ref: { href: '../bases-de-datos/tema-2.html', text: 'Tema 2: Diseño conceptual y lógico' },
        h: `<p>El <strong>modelo entidad-relación</strong> representa la realidad con <strong>entidades</strong> (objetos que se distinguen de otros por sus características, dibujadas como rectángulo) y <strong>atributos</strong> (esas características, dibujadas como elipse). Es solo un modelo de representación: hay que convertirlo a otro modelo antes de trabajar con él.</p>
<p>Los atributos se clasifican de cuatro maneras:</p>
<ul><li><strong>Funcionalidad</strong>: <em>identificador</em> (distingue cada elemento; si es uno solo, es el <strong>AIP</strong>, principal) o <em>descriptor</em> (caracteriza pero no diferencia). Los posibles AIP son los <strong>candidatos</strong> (AIC); uno es el AIP y el resto son <strong>alternativos</strong> (<strong>AIA</strong>).</li><li><strong>Opcionalidad</strong>: <em>obligatorio</em> (siempre tiene valor) u <em>optativo</em> (puede ser nulo).</li><li><strong>Cardinalidad</strong>: <em>univaluado</em> (un valor) o <em>multivaluado</em> (varios, como los teléfonos).</li><li><strong>Carácter</strong>: <em>simple</em>, <em>derivado</em> (se calcula de otros, como la edad a partir de la fecha de nacimiento) o <em>compuesto</em> (se divide en subpartes, como la dirección en calle, número y localidad).</li></ul>`,
        code: `Tarea: entidad PERSONA con estos atributos
- Dni: obligatorio, univaluado y AIP
- Apellidos: opcional y univaluado
- Teléfono: opcional y multivaluado
- E-mail: obligatorio, multivaluado y AIA`,
        try: null,
        quiz: [
          { q: 'La edad calculada a partir de la fecha de nacimiento es un atributo...', o: ['Compuesto', 'Derivado', 'Multivaluado', 'Alternativo'], a: 1 },
          { q: 'Una persona puede tener varios teléfonos. El atributo teléfono es...', o: ['Univaluado', 'Multivaluado', 'Derivado', 'Obligatorio siempre'], a: 1 },
          { q: 'AIA significa...', o: ['Atributo identificador alternativo', 'Atributo identificador absoluto', 'Atributo individual aislado', 'Atributo identificador adicional'], a: 0 },
          { q: 'La dirección dividida en calle, número y localidad es un atributo...', o: ['Simple', 'Derivado', 'Compuesto', 'Descriptor'], a: 2 }
        ]
      },
      {
        t: 'Relaciones, grado y cardinalidad',
        ref: { href: '../bases-de-datos/tema-2.html', text: 'Tema 2: Diseño conceptual y lógico' },
        h: `<p>Una <strong>relación</strong> es una asociación entre una o más entidades y se dibuja con un <strong>rombo</strong>. Tiene nombre, <strong>grado</strong> (cuántas entidades intervienen) y <strong>tipo de correspondencia</strong>. Puede tener atributos propios: por ejemplo, el año en que un alumno cursa una asignatura.</p>
<p>Conviene plantear siempre relaciones <strong>binarias</strong> (grado 2). Una ternaria se descompone creando una nueva entidad: en vez de relacionar comprador, vendedor y producto, se crea la entidad <em>venta</em> y se relaciona con las tres.</p>
<p><strong>Cardinalidad parcial</strong> (o clase de pertenencia): se escribe con paréntesis, como (0,1) o (1,N). La mínima <strong>0</strong> significa que la relación es optativa y la mínima <strong>1</strong> que es obligatoria.</p>
<p><strong>Cardinalidad total</strong>: se escribe en mayúsculas y con dos puntos, sin paréntesis (1:1, 1:N, N:M), y se obtiene a partir de los <strong>máximos</strong> de las parciales.</p>
<p><strong>Casos especiales</strong>: la relación <strong>reflexiva</strong> se da entre elementos de la misma entidad (un empleado supervisa a otros empleados). Una <strong>entidad débil</strong> no tiene sentido sin otra (si el empleado se va, no se guardan sus hijos) y siempre aparece en relaciones 1:N.</p>`,
        code: null, try: null,
        quiz: [
          { q: 'La cardinalidad total se obtiene a partir de...', o: ['Los mínimos de las parciales', 'Los máximos de las parciales', 'El número de atributos', 'El grado'], a: 1 },
          { q: 'Una cardinalidad parcial con mínima 0 indica que la relación es...', o: ['Obligatoria', 'Optativa', 'Reflexiva', 'Ternaria'], a: 1 },
          { q: 'Un empleado que hace de supervisor de otros empleados es una relación...', o: ['Reflexiva', 'Ternaria', 'Débil', 'Derivada'], a: 0 },
          { q: '¿Cómo se suele evitar una relación ternaria?', o: ['Borrando una entidad', 'Creando una nueva entidad y relacionándola con las tres', 'Usando solo atributos', 'No se puede evitar'], a: 1 }
        ]
      },
      {
        t: 'Claves e integridad referencial',
        ref: { href: '../bases-de-datos/tema-3.html', text: 'Tema 3: Modelo Relacional' },
        h: `<p>En el modelo relacional los datos están en tablas y cada tabla necesita identificar sus filas:</p>
<ul><li><strong>Clave candidata</strong>: atributos que identifican cada fila de forma única.</li><li><strong>Clave primaria</strong> (PK): la candidata que elige el diseñador. No puede tener valores nulos. Es habitual crear un campo <code>id</code> autonumérico. Se marca con <code>#</code>.</li><li><strong>Clave alternativa</strong>: las candidatas que no se eligieron como primaria.</li><li><strong>Clave ajena</strong> (FK): campo cuyos valores coinciden con la clave primaria de otra tabla, y así las relaciona. Se marca con <code>-</code>.</li></ul>
<p>La <strong>integridad referencial</strong> garantiza que dos tablas relacionadas sigan sincronizadas al borrar o modificar. Opciones:</p>
<ul><li><strong>RESTRICT</strong>: solo se borra la fila si ninguna otra tabla la referencia.</li><li><strong>CASCADE</strong>: al borrar o modificar, se borran o modifican también las filas que la referencian.</li><li><strong>SET NULL</strong>: las claves ajenas que la referencian pasan a nulo.</li><li><strong>SET DEFAULT</strong>: pasan a un valor por defecto definido antes.</li></ul>`,
        code: `Trabajo (#codigo, nombre, posicion, salario)
Profesor (#id, dni, nombre, apellidos, departamento)
Asignatura (#id, nombre, n_horas, -id_profesor)`,
        try: null,
        quiz: [
          { q: 'Con ON DELETE CASCADE, si borras el departamento 1...', o: ['No se puede borrar', 'Desaparecen también los empleados de ese departamento', 'Los empleados quedan con valor nulo', 'No pasa nada'], a: 1 },
          { q: '¿Qué es una clave ajena?', o: ['Una clave que no se usa', 'Un campo cuyos valores coinciden con la clave primaria de otra tabla', 'Una contraseña', 'La clave candidata elegida'], a: 1 },
          { q: 'En la notación de tus temas, ¿cómo se marca una clave primaria?', o: ['Con -', 'Con #', 'Con *', 'Con @'], a: 1 },
          { q: '¿Puede una clave primaria tener valores nulos?', o: ['Sí', 'No', 'Solo si es ajena', 'Solo si es compuesta'], a: 1 }
        ]
      },
      {
        t: 'Del modelo E-R al modelo relacional',
        ref: { href: '../bases-de-datos/tema-3.html', text: 'Tema 3: Modelo Relacional' },
        h: `<p>Cada tipo de relación se transforma en tablas con una regla distinta:</p>
<ul><li><strong>N:M</strong>: se crea una <strong>tabla nueva</strong> cuya clave primaria es la concatenación de las claves de las dos entidades, y cada una es además clave ajena. Los atributos de la relación van en esa tabla.</li><li><strong>1:N</strong>: la clave de la entidad con máximo <strong>1</strong> se <strong>propaga</strong> como clave ajena a la entidad con máximo <strong>N</strong>, y la relación desaparece.</li><li><strong>1:1</strong>: depende de las cardinalidades. La forma tradicional necesita que alguna parcial sea (1,1): su clave primaria se propaga a la tabla de la (0,1), donde es clave primaria y ajena a la vez. Otra opción más sencilla es transformarla como una 1:N.</li></ul>`,
        code: `-- N:M: un producto está en varios pedidos y un pedido tiene varios productos
pedidos(#id, descripcion, fecha)
productos(#id, nombre, descripcion, precio_sin_iva, tipo, codigo_producto)
pedido_producto(#(-id_pedido, -id_producto), precio)

-- 1:N: un pedido lo hace un solo cliente, un cliente hace muchos pedidos
pedidos(#id, precio, fecha, -id_cliente)
clientes(#id, nombre, apellidos, direccion, telefono)`,
        try: null,
        quiz: [
          { q: 'En una relación 1:N, ¿dónde se pone la clave ajena?', o: ['En la tabla del lado 1', 'En la tabla del lado N', 'En una tabla nueva', 'En las dos'], a: 1 },
          { q: 'Una relación N:M se transforma en...', o: ['Una clave ajena', 'Un atributo', 'Una tabla nueva con la concatenación de las dos claves', 'Nada, desaparece'], a: 2 },
          { q: 'En el ejemplo, ¿dónde está la clave ajena id_cliente?', o: ['En clientes', 'En pedidos', 'En pedido_producto', 'En productos'], a: 1 }
        ]
      },
      {
        t: 'Normalización: dependencia funcional y 1FN',
        ref: { href: '../bases-de-datos/tema-4.html', text: 'Tema 4: Formas Normales' },
        h: `<p>Un mal diseño provoca <strong>redundancia</strong> (el mismo dato repetido), <strong>inconsistencia</strong> (el mismo dato escrito de dos formas) y desperdicio de espacio. <strong>Normalizar</strong> es partir una tabla en varias más simples para guardar cada dato una sola vez. Con cumplir las tres primeras formas normales (1FN, 2FN y 3FN) hay un nivel suficiente.</p>
<p><strong>Dependencia funcional</strong>: B depende funcionalmente de A (A → B) si a cada valor de A le corresponde un único valor de B. Con un DNI obtienes un único nombre (DNI → Nombre), pero un nombre no identifica a una sola persona.</p>
<p><strong>Primera forma normal (1FN)</strong>: cada celda tiene <strong>un solo valor</strong>, no hay grupos de columnas repetidas (teléfono1, teléfono2...) y no hay filas idénticas. Si un cliente tiene varios teléfonos, se crea una tabla aparte, y un cliente con dos teléfonos ocupa dos filas en ella.</p>`,
        code: `CLIENTES (#id, nombre, apellidos)
TELEFONOS (#id, numero, -id_cliente)`,
        try: null,
        quiz: [
          { q: 'DNI → Nombre significa que...', o: ['El nombre determina el DNI', 'A cada DNI le corresponde un único nombre', 'Hay dos nombres por DNI', 'El DNI es opcional'], a: 1 },
          { q: '¿Cuál de estas tablas incumple la 1FN?', o: ['Una con una celda que guarda varios teléfonos separados por comas', 'Una con clave primaria', 'Una con dos columnas', 'Una con claves ajenas'], a: 0 },
          { q: '¿Qué tres problemas provoca un mal diseño?', o: ['Redundancia, inconsistencia y desperdicio de espacio', 'Lentitud, calor y ruido', 'Claves, tablas y filas', 'Ninguno'], a: 0 }
        ]
      },
      {
        t: 'Normalización: 2FN y 3FN',
        ref: { href: '../bases-de-datos/tema-4.html', text: 'Tema 4: Formas Normales' },
        h: `<p><strong>Segunda forma normal (2FN)</strong>: solo importa cuando la clave primaria es <strong>compuesta</strong>. Una tabla está en 2FN si está en 1FN y todo atributo que no forma parte de la clave depende de la <strong>clave completa</strong>, no de una parte. Si el nombre del alumno depende solo del DNI y la clave es (DNI, CodCurso), hay que separar.</p>
<p><strong>Tercera forma normal (3FN)</strong>: una tabla está en 3FN si está en 2FN y no hay <strong>dependencias transitivas</strong>: ningún atributo que no es clave depende de otro atributo que tampoco es clave. Si el nombre de la provincia depende del código de provincia y no del DNI, se separa en otra tabla.</p>
<p><strong>Truco para recordarlo</strong>: en 1FN cada celda tiene un solo valor; en 2FN cada dato depende de <em>toda</em> la clave; en 3FN cada dato depende <em>solo</em> de la clave, y no de otro dato.</p>`,
        code: `-- 2FN: la clave es (DNI, CodCurso); nombre y apellido dependen solo del DNI
ALUMNOS (#DNI, nombre, apellido)
NOTAS (#(-DNI, -CodCurso), nota)

-- 3FN: la provincia depende del código de provincia, no del DNI
ALUMNOS (#DNI, nombre, -CodProvincia)
PROVINCIAS (#CodProvincia, provincia)`,
        try: null,
        quiz: [
          { q: '¿Cuándo importa la 2FN?', o: ['Cuando la clave primaria es compuesta', 'Cuando no hay claves', 'Cuando hay una sola fila', 'Siempre igual'], a: 0 },
          { q: 'La provincia depende del código de provincia, que no es clave. Eso es una dependencia...', o: ['Parcial', 'Transitiva', 'Total', 'Cardinal'], a: 1 },
          { q: 'En 3FN, cada dato depende...', o: ['De cualquier otro dato', 'Solo de la clave', 'De una parte de la clave', 'De nada'], a: 1 },
          { q: 'Si el teléfono del proveedor depende solo del proveedor y la clave es (Producto, Proveedor), ¿qué norma incumple?', o: ['1FN', '2FN', '3FN', 'Ninguna'], a: 1 }
        ]
      },
      {
        t: 'SQL: consultar y modificar datos (adelanto)',
        h: `<p>Este tema todavía no está en tus 4 temas, pero lo necesitarás en el diseño físico. <strong>SQL</strong> es el lenguaje para trabajar con bases de datos relacionales. Las instrucciones básicas son:</p>
<ul><li><code>SELECT</code>: consultar datos.</li><li><code>INSERT</code>: añadir filas.</li><li><code>UPDATE</code>: modificar filas.</li><li><code>DELETE</code>: borrar filas.</li></ul>
<p>Una consulta tiene este orden: <code>SELECT</code> columnas <code>FROM</code> tabla <code>WHERE</code> condición <code>ORDER BY</code> columna. Usa <code>*</code> para todas las columnas. Importante: en <code>UPDATE</code> y <code>DELETE</code>, sin <code>WHERE</code> se cambian o borran <strong>todas</strong> las filas.</p>`,
        code: `SELECT nombre, edad
FROM alumnos
WHERE edad >= 18
ORDER BY nombre;

INSERT INTO alumnos (nombre, edad) VALUES ('Alba', 18);

UPDATE alumnos SET edad = 19 WHERE nombre = 'Alba';

DELETE FROM alumnos WHERE nombre = 'Alba';`,
        try: null,
        quiz: [
          { q: '¿Qué instrucción SQL consulta datos?', o: ['INSERT', 'SELECT', 'UPDATE', 'DROP'], a: 1 },
          { q: '¿Qué pasa si haces DELETE FROM alumnos; sin WHERE?', o: ['No pasa nada', 'Da un error', 'Se borran todas las filas', 'Se borra una fila'], a: 2 },
          { q: '¿Qué cláusula filtra las filas?', o: ['ORDER BY', 'FROM', 'WHERE', 'INTO'], a: 2 }
        ]
      }
    ]
  },
  {
    id: 'tsp', name: 'Transformación del Sistema Productivo', short: 'Empresa y entorno', color: 'tsp',
    intro: 'La empresa, su entorno, los tipos de empresa y cómo plantear una idea de negocio. Contenido de base: complétalo con el material de tu profesorado.',
    lessons: [
      {
        t: 'La empresa y su entorno',
        h: `<p>Una <strong>empresa</strong> es una organización que combina recursos (personas, dinero, materiales) para producir bienes o servicios y obtener un beneficio.</p>
<p>Su <strong>entorno</strong> son los factores externos que le afectan:</p>
<ul><li><strong>Entorno general</strong>: afecta a todas las empresas. Factores económicos, políticos y legales, sociales, tecnológicos y ambientales (el análisis PESTEL).</li><li><strong>Entorno específico</strong>: afecta a un sector concreto. Clientes, proveedores y competidores.</li></ul>`,
        code: null,
        try: null,
        quiz: [
          { q: 'Clientes, proveedores y competidores forman parte del...', o: ['Entorno general', 'Entorno específico', 'Departamento de personal', 'Capital social'], a: 1 },
          { q: 'Un cambio en la ley fiscal es un factor del entorno...', o: ['General', 'Específico', 'Interno', 'Ninguno'], a: 0 },
          { q: 'Una empresa combina recursos para...', o: ['Solo gastar dinero', 'Producir bienes o servicios', 'Solo contratar personas', 'Evitar la competencia'], a: 1 }
        ]
      },
      {
        t: 'Tipos de empresa y formas jurídicas',
        h: `<p>Según quién sea el dueño, una empresa puede ser <strong>individual</strong> (una persona: el autónomo) o <strong>societaria</strong> (varias personas).</p>
<ul><li><strong>Autónomo</strong>: responde con todos sus bienes personales (responsabilidad ilimitada).</li><li><strong>Sociedad Limitada (SL)</strong>: los socios solo responden con lo que aportaron. Desde 2022 el capital mínimo puede ser de 1 €, con la obligación de reservar parte de los beneficios hasta llegar a 3.000 €.</li><li><strong>Sociedad Anónima (SA)</strong>: capital dividido en acciones; el mínimo es de 60.000 €.</li><li><strong>Cooperativa</strong>: los socios trabajan en ella y deciden de forma democrática, un socio, un voto.</li></ul>`,
        code: null,
        try: null,
        quiz: [
          { q: 'Un autónomo responde con...', o: ['Solo el capital de la empresa', 'Todos sus bienes personales', 'Nada', 'Solo con su coche'], a: 1 },
          { q: 'En una cooperativa, las decisiones se toman...', o: ['Según el dinero aportado', 'Un socio, un voto', 'Por el director', 'Por el Estado'], a: 1 },
          { q: 'En una SL, los socios responden...', o: ['Con todo su patrimonio', 'Solo con lo que aportaron', 'No responden de nada', 'Con el patrimonio del gerente'], a: 1 }
        ]
      },
      {
        t: 'Idea de negocio y plan de empresa',
        h: `<p>Un <strong>plan de empresa</strong> explica en un documento qué negocio se quiere crear y si es viable. Suele incluir:</p>
<ol><li>La <strong>idea</strong> y el producto o servicio.</li><li>El <strong>mercado</strong>: clientes y competencia.</li><li>El <strong>plan de marketing</strong>: precio, promoción, distribución.</li><li>El <strong>plan de producción</strong> y de personas.</li><li>El <strong>plan económico-financiero</strong>: cuánto cuesta empezar y cuánto se espera ganar.</li><li>La <strong>forma jurídica</strong> y los trámites.</li></ol>
<p>El análisis <strong>DAFO</strong> ordena la situación en cuatro cuadros: <strong>D</strong>ebilidades y <strong>F</strong>ortalezas (internas), <strong>A</strong>menazas y <strong>O</strong>portunidades (externas).</p>`,
        code: null,
        try: null,
        quiz: [
          { q: 'En el DAFO, ¿cuáles son factores externos?', o: ['Debilidades y fortalezas', 'Amenazas y oportunidades', 'Debilidades y amenazas', 'Fortalezas y oportunidades'], a: 1 },
          { q: '¿Qué parte del plan calcula cuánto cuesta empezar?', o: ['Plan de marketing', 'Plan económico-financiero', 'Forma jurídica', 'Entorno general'], a: 1 },
          { q: 'Una debilidad en un DAFO es un factor...', o: ['Interno', 'Externo', 'Legal', 'Del mercado'], a: 0 }
        ]
      }
    ]
  },
  {
    id: 'despliegue', name: 'Despliegue de Aplicaciones Web', short: 'Servidores, SSH, Apache y Docker', color: 'despliegue',
    intro: 'Cómo se publica una aplicación web: arquitectura cliente-servidor, DNS, transferencia de archivos (FTP/SSH), servidores web y de bases de datos, y contenedores Docker. Resumen propio basado en los apuntes de abrilcode (CC BY-SA 4.0, F. Valdeón).',
    lessons: []
  },
  {
    id: 'ingles', name: 'Inglés profesional', short: 'Professional English', color: 'ingles',
    intro: 'Presentarte en el trabajo, vocabulario informático y cómo escribir un correo profesional. Contenido de base: complétalo con el temario de tu libro.',
    lessons: [
      {
        t: 'Introducing yourself at work',
        h: `<p>Al presentarte en un contexto profesional usa frases claras y educadas:</p>
<ul><li><em>Hello, my name is Alba. Nice to meet you.</em></li><li><em>I'm a student of Web Application Development.</em></li><li><em>I work as a junior developer at TechSoft.</em></li><li><em>I'm responsible for the website.</em></li><li><em>Could you tell me more about your company?</em></li></ul>
<p>Para hablar de rutinas y de tu puesto usa el <strong>present simple</strong>: <em>I write code every day. She works in a team.</em> Con he, she, it se añade <strong>-s</strong> al verbo.</p>`,
        code: null,
        try: null,
        quiz: [
          { q: 'Choose the correct sentence.', o: ['She work in a team.', 'She works in a team.', 'She working in a team.', 'She are work in a team.'], a: 1 },
          { q: 'What do you say when you meet someone for the first time?', o: ['Nice to meet you.', 'See you later.', 'Good night.', 'Thank you very much.'], a: 0 },
          { q: '"I\'m responsible for the website" means...', o: ['Soy responsable de la web', 'Me gusta la web', 'Visito la web', 'Vendo webs'], a: 0 }
        ]
      },
      {
        t: 'IT vocabulary',
        h: `<p>Vocabulario básico de informática en inglés:</p>
<ul><li><strong>hardware</strong>: componentes físicos. <strong>software</strong>: programas.</li><li><strong>bug</strong>: error en un programa. <strong>to debug</strong>: corregir errores.</li><li><strong>database</strong>: base de datos. <strong>server</strong>: servidor.</li><li><strong>network</strong>: red. <strong>cloud</strong>: nube.</li><li><strong>to download / to upload</strong>: descargar / subir un archivo.</li><li><strong>to update</strong>: actualizar. <strong>to install</strong>: instalar.</li><li><strong>password</strong>: contraseña. <strong>user</strong>: usuario.</li><li><strong>screen</strong>: pantalla. <strong>keyboard</strong>: teclado. <strong>mouse</strong>: ratón.</li></ul>`,
        code: null,
        try: null,
        quiz: [
          { q: 'What is a "bug"?', o: ['Un error en un programa', 'Un tipo de teclado', 'Una red', 'Una base de datos'], a: 0 },
          { q: 'To "upload" a file means...', o: ['Borrarlo', 'Descargarlo', 'Subirlo', 'Imprimirlo'], a: 2 },
          { q: '"Password" in Spanish is...', o: ['Usuario', 'Contraseña', 'Pantalla', 'Servidor'], a: 1 }
        ]
      },
      {
        t: 'Writing a professional email',
        h: `<p>Un correo profesional tiene una estructura fija:</p>
<ol><li><strong>Subject</strong>: corto y claro. <em>Meeting on Friday</em></li><li><strong>Greeting</strong>: <em>Dear Mr. Smith,</em> (formal) o <em>Hi Anna,</em> (más cercano).</li><li><strong>Opening</strong>: <em>I am writing to ask about...</em> / <em>Thank you for your email.</em></li><li><strong>Body</strong>: la información, en frases cortas.</li><li><strong>Closing</strong>: <em>I look forward to hearing from you.</em></li><li><strong>Sign-off</strong>: <em>Best regards,</em> o <em>Kind regards,</em> y tu nombre.</li></ol>`,
        code: `Subject: Question about the project deadline

Dear Mr. Smith,

I am writing to ask about the deadline for the website project.
Could you confirm if it is next Friday?

I look forward to hearing from you.

Kind regards,
Alba`,
        try: null,
        quiz: [
          { q: 'Which is a formal greeting?', o: ['Hey!', 'Dear Mr. Smith,', 'Yo Smith,', 'Hi mate,'], a: 1 },
          { q: 'Which closing is correct for a professional email?', o: ['Kind regards,', 'Bye bye,', 'See ya,', 'Whatever,'], a: 0 },
          { q: '"I am writing to ask about..." is used to...', o: ['Cerrar el correo', 'Abrir el correo explicando el motivo', 'Poner el asunto', 'Firmar'], a: 1 }
        ]
      }
    ]
  }
];
