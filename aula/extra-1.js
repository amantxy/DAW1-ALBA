/* Lecciones ampliadas: Lenguajes de marcas y Programación (basadas en el material de la web) */
(function () {
  var A = window.AGREGA;
  var CSSBASE = '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  h1 { color: navy; }\n  .destacado { background: gold; }\n  #unico { color: crimson; }\n</style>\n</head>\n<body>\n<h1>Hola CSS</h1>\n<p class="destacado">Párrafo con clase</p>\n<p id="unico">Párrafo con id</p>\n</body>\n</html>';

  /* ---------- Lenguajes de marcas ---------- */
  A('marcas', {
    t: 'Cómo funciona Internet: IP, DNS y HTTP',
    h: '<p><b>Internet</b> es una red de redes. La <b>web (WWW)</b> es solo uno de sus servicios: Internet también lleva correo, videollamadas o juegos.</p><p>Cada equipo tiene una <b>dirección IP</b> (por ejemplo 192.168.1.10) y una <b>máscara de red</b> que indica qué parte de la dirección identifica la red. El <b>router</b> une redes distintas y decide por dónde viaja cada paquete; el <b>DHCP</b> reparte direcciones IP de forma automática.</p><p>Como las IP son difíciles de recordar, el <b>DNS</b> traduce un nombre (ejemplo.es) a su IP. Con la IP, el navegador pide la página con <b>HTTP</b>: envía una <b>petición</b> y el servidor devuelve una <b>respuesta</b> (con un código como 200 si todo va bien o 404 si no existe). <b>HTTPS</b> es lo mismo, pero cifrado.</p><p>Por debajo, la capa de <b>transporte</b> (TCP) trocea los datos en paquetes y comprueba que lleguen; antes de enviar, cliente y servidor hacen un <i>handshake</i> (saludo inicial).</p>',
    ref: { href: '../lenguajes-de-marcas/teoria-1-2-internet.html', text: 'Unidad 1.2 · Cómo funciona Internet' },
    quiz: [
      { q: '¿Qué hace el DNS?', o: ['Reparte direcciones IP', 'Traduce un nombre de dominio a una dirección IP', 'Cifra la conexión', 'Une redes distintas'], a: 1, e: 'El DNS es la «agenda» de Internet: convierte ejemplo.es en su IP.' },
      { q: '¿Qué protocolo se usa para pedir páginas web?', o: ['DHCP', 'SMTP', 'HTTP', 'DNS'], a: 2, e: 'HTTP (o HTTPS, cifrado) es el protocolo de la capa de aplicación para la web.' },
      { q: '¿Qué significa un código de respuesta 404?', o: ['Todo correcto', 'No se encuentra el recurso', 'Error del servidor', 'Acceso prohibido'], a: 1, e: '200 es correcto, 404 significa que el recurso pedido no existe.' },
      { q: 'La web y Internet son lo mismo.', o: ['Verdadero', 'Falso: la web es un servicio que usa Internet'], a: 1, e: 'Internet es la red; la web es uno de los servicios que viajan por ella.' }
    ]
  }, { t: 'Une cada término de red', tipo: 'parejas', data: {
    intro: 'Relaciona cada concepto con su función.',
    pares: [['IP', 'Dirección de un equipo en la red'], ['DNS', 'Traduce nombres de dominio a direcciones IP'], ['DHCP', 'Reparte direcciones IP automáticamente'], ['Router', 'Une redes distintas y encamina paquetes'], ['HTTP', 'Protocolo para pedir páginas web'], ['TCP', 'Trocea los datos y comprueba que lleguen']] } });

  A('marcas', {
    t: 'CSS: reglas, selectores y cascada',
    h: '<p><b>CSS</b> define cómo se ve una página; HTML dice qué es cada cosa. Una hoja de estilos es una lista de <b>reglas</b>: un <b>selector</b> (a qué elementos se aplica) y un bloque con pares <code>propiedad: valor;</code>.</p><p>Hay tres formas de incluir CSS: <b>en línea</b> (atributo <code>style</code>), <b>interna</b> (bloque <code>&lt;style&gt;</code> en el <code>head</code>) y <b>externa</b> (archivo <code>.css</code> enlazado con <code>&lt;link rel="stylesheet"&gt;</code>), que es la recomendada.</p><p>Selectores básicos: <code>*</code> (todo), <code>p</code> (elemento), <code>.clase</code>, <code>#id</code> y <code>h1, h2</code> (varios a la vez). Si dos reglas chocan, gana según la <b>cascada</b>: primero el origen (el estilo en línea gana), luego la <b>especificidad</b> (<code>#id</code> &gt; <code>.clase</code> &gt; elemento) y, si empatan, la que aparece más tarde. Los comentarios van entre <code>/* */</code>.</p>',
    code: CSSBASE, try: 'html',
    ref: { href: '../lenguajes-de-marcas/teoria-3-css.html', text: 'Unidad 3 · CSS' },
    quiz: [
      { q: '¿Cuál es la forma recomendada de añadir CSS?', o: ['Atributo style en cada etiqueta', 'Bloque style en el head', 'Archivo .css enlazado con link', 'Dentro del body'], a: 2, e: 'Un archivo externo se reutiliza en varias páginas y el navegador lo guarda en caché.' },
      { q: 'Un párrafo tiene regla de elemento (p), de clase (.aviso) y de id (#principal) con distinto color. ¿Cuál gana?', o: ['La de elemento', 'La de clase', 'La de id', 'La que se escribió primero'], a: 2, e: 'Especificidad: #id pesa más que .clase, y esta más que el elemento.' },
      { q: '¿Cómo se escribe un comentario en CSS?', o: ['// comentario', '<!-- comentario -->', '/* comentario */', '# comentario'], a: 2, e: 'En CSS solo se usa /* ... */.' }
    ]
  }, { t: 'Escribe tus primeros estilos', tipo: 'escribe', data: {
    lang: 'html', intro: 'Añade CSS dentro de <style> para cumplir los requisitos. La vista previa se actualiza sola.',
    start: '<style>\n\n</style>\n<h1>Hola</h1>\n<p class="destacado">Texto destacado</p>\n<p id="unico">Texto único</p>',
    checks: [
      { d: 'Una regla para h1 con la propiedad color', f: function (doc, t) { return /h1\s*\{[^}]*\bcolor\s*:/i.test(t); } },
      { d: 'Una regla de clase .destacado con background-color o background', f: function (doc, t) { return /\.destacado\s*\{[^}]*\bbackground(-color)?\s*:/i.test(t); } },
      { d: 'Una regla con el selector de id #unico', f: function (doc, t) { return /#unico\s*\{[^}]+\}/i.test(t); } },
      { d: 'Al menos un comentario CSS /* ... */', f: function (doc, t) { return /\/\*[\s\S]*?\*\//.test(t); } }
    ],
    sol: '<style>\n/* estilos de la página */\nh1 { color: navy; }\n.destacado { background-color: gold; }\n#unico { color: crimson; }\n</style>\n<h1>Hola</h1>\n<p class="destacado">Texto destacado</p>\n<p id="unico">Texto único</p>' } });

  A('marcas', {
    t: 'CSS: color, texto y modelo de cajas',
    h: '<p>El <b>color</b> se puede escribir con un nombre (<code>navy</code>), en hexadecimal (<code>#1F4E79</code>), con <code>rgb(31,78,121)</code> o con <code>hsl(210,60%,30%)</code>. <code>color</code> cambia el texto y <code>background-color</code> el fondo.</p><p>Todo elemento es una <b>caja</b> con cuatro capas, de dentro a fuera: <b>contenido</b>, <b>padding</b> (espacio interior), <b>border</b> (borde) y <b>margin</b> (espacio exterior). Un borde necesita <code>border-style</code> para verse: <code>border: 2px solid navy;</code> (grosor, estilo, color). Con <code>box-sizing: border-box</code> el ancho incluye padding y borde.</p><p>Para el texto: <code>text-align</code> (alineación), <code>text-decoration</code>, <code>text-transform</code>, <code>font-family</code> y <code>font-size</code>.</p>',
    code: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .tarjeta {\n    width: 220px;\n    padding: 16px;\n    margin: 20px;\n    border: 3px solid #1F4E79;\n    border-radius: 12px;\n    background-color: #eef4fb;\n    text-align: center;\n  }\n</style>\n</head>\n<body>\n<div class="tarjeta"><h2>Mi tarjeta</h2><p>Probando el modelo de cajas.</p></div>\n</body>\n</html>', try: 'html',
    ref: { href: '../lenguajes-de-marcas/teoria-3-css.html', text: 'Unidad 3 · CSS' },
    quiz: [
      { q: '¿Qué capa de la caja separa el elemento de sus vecinos, por fuera del borde?', o: ['padding', 'margin', 'content', 'outline'], a: 1, e: 'El margin es el espacio exterior; el padding es el interior.' },
      { q: '¿Por qué no se ve un borde que solo tiene border-width y border-color?', o: ['Porque falta border-style', 'Porque falta margin', 'Porque falta padding', 'Sí se ve'], a: 0, e: 'Sin border-style (solid, dashed…) el borde no se dibuja.' },
      { q: '¿Cuál de estas es una notación de color válida?', o: ['color: #1F4E79;', 'color: 20px;', 'color: 1F4E79;', 'color: rgb(31 78);'], a: 0, e: 'El hexadecimal necesita la almohadilla #. 20px es una medida, no un color.' }
    ]
  }, { t: 'Completa la regla de la tarjeta', tipo: 'hueco', data: {
    intro: 'Elige la propiedad CSS que corresponde a cada comentario.',
    code: '.tarjeta {\n  [[0]]: 2px solid navy;   /* borde */\n  [[1]]: 16px;            /* espacio interior */\n  [[2]]: 20px;            /* espacio exterior */\n  [[3]]: center;          /* alineación del texto */\n  [[4]]: #eef4fb;         /* color de fondo */\n}',
    huecos: [{ o: ['outline-width', 'border', 'margin'], a: 1 }, { o: ['margin', 'padding', 'border'], a: 1 }, { o: ['padding', 'margin', 'width'], a: 1 }, { o: ['text-align', 'align', 'font-style'], a: 0 }, { o: ['color', 'background-color', 'border-color'], a: 1 }] } });

  A('marcas', {
    t: 'CSS: display y posicionamiento',
    h: '<p>La propiedad <code>display</code> decide cómo se comporta un elemento: <b>block</b> (ocupa toda la línea y empieza en una nueva), <b>inline</b> (fluye con el texto y no admite ancho ni alto) e <b>inline-block</b> (en línea pero con ancho y alto). Con <b>none</b> el elemento desaparece y no ocupa sitio; <code>visibility: hidden</code> lo oculta pero conserva el hueco.</p><p>El <b>posicionamiento</b> con <code>position</code>:</p><ul><li><b>static</b>: normal, por defecto.</li><li><b>relative</b>: se desplaza respecto a su sitio original.</li><li><b>absolute</b>: se coloca respecto al antecesor posicionado más cercano.</li><li><b>fixed</b>: se queda fijo en la ventana al hacer scroll.</li><li><b>sticky</b>: normal hasta que llega a un punto y entonces se queda pegado.</li></ul><p><code>top</code>, <code>right</code>, <code>bottom</code> y <code>left</code> indican el desplazamiento y <code>z-index</code> qué elemento queda por encima. Con <code>max-width</code> el diseño se adapta a pantallas pequeñas.</p>',
    code: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  nav { position: sticky; top: 0; background: navy; color: white; padding: 8px; }\n  .caja { display: inline-block; width: 90px; height: 60px; background: gold; margin: 4px; }\n  #fijo { position: fixed; bottom: 8px; right: 8px; background: crimson; color: white; padding: 6px; }\n</style>\n</head>\n<body>\n<nav>Menú pegajoso</nav>\n<div class="caja">1</div><div class="caja">2</div><div class="caja">3</div>\n<p style="height:400px">Haz scroll para ver el menú pegado.</p>\n<div id="fijo">Fijo</div>\n</body>\n</html>', try: 'html',
    ref: { href: '../lenguajes-de-marcas/teoria-3-css.html', text: 'Unidad 3 · CSS' },
    quiz: [
      { q: '¿Qué valor de position deja un elemento fijo en la ventana aunque hagas scroll?', o: ['relative', 'absolute', 'fixed', 'static'], a: 2, e: 'fixed se coloca respecto a la ventana y no se mueve con el scroll.' },
      { q: '¿Qué diferencia hay entre display: none y visibility: hidden?', o: ['Ninguna', 'none quita el elemento y su hueco; hidden lo oculta pero conserva el hueco', 'hidden quita el hueco', 'none solo oculta el texto'], a: 1, e: 'display: none elimina la caja del diseño; visibility: hidden solo la hace invisible.' },
      { q: '¿Qué hace z-index?', o: ['Cambia el tamaño', 'Decide qué elemento queda por encima de otro', 'Cambia el color', 'Alinea el texto'], a: 1, e: 'Un z-index mayor queda por delante.' }
    ]
  }, { t: 'Une cada valor de position', tipo: 'parejas', data: {
    intro: 'Relaciona cada valor con su comportamiento.',
    pares: [['static', 'Posición normal, sin desplazamiento'], ['relative', 'Se mueve respecto a su sitio original'], ['absolute', 'Se coloca respecto al antecesor posicionado'], ['fixed', 'Se queda fijo en la ventana'], ['sticky', 'Normal hasta un punto y luego se pega'], ['z-index', 'Decide qué elemento queda por encima']] } });

  A('marcas', {
    t: 'HTML: bloque, en línea y rutas',
    h: '<p>Los elementos HTML son de <b>bloque</b> (empiezan en línea nueva y ocupan todo el ancho: <code>div</code>, <code>p</code>, <code>h1</code>, <code>ul</code>, <code>table</code>) o <b>en línea</b> (fluyen dentro del texto: <code>span</code>, <code>a</code>, <code>img</code>, <code>strong</code>, <code>em</code>). <code>div</code> y <code>span</code> son contenedores genéricos sin significado propio, útiles para aplicar clases y estilos.</p><p>Las <b>rutas</b> indican dónde está un archivo. Una ruta <b>absoluta</b> es una URL completa (<code>https://ejemplo.es/img/logo.png</code>) o parte de la raíz del sitio; una <b>relativa</b> parte de la carpeta actual: <code>img/logo.png</code> (entra en una carpeta), <code>../logo.png</code> (sube un nivel) o <code>./logo.png</code> (aquí).</p><p>Imágenes: <code>&lt;img src alt&gt;</code>. Con <code>&lt;picture&gt;</code> puedes dar versiones distintas según la pantalla, y el <b>favicon</b> es el icono de la pestaña (<code>&lt;link rel="icon"&gt;</code>).</p>',
    code: '<!DOCTYPE html>\n<html>\n<body>\n<div>\n  <p>Un párrafo es de bloque y\n  <span style="color:crimson">este span</span> va en línea.</p>\n  <a href="https://www.ejemplo.es">Enlace absoluto</a>\n  <a href="paginas/contacto.html">Ruta relativa</a>\n</div>\n</body>\n</html>', try: 'html',
    ref: { href: '../lenguajes-de-marcas/teoria-2-html.html', text: 'Unidad 2 · HTML' },
    quiz: [
      { q: '¿Cuál de estos elementos es en línea?', o: ['div', 'p', 'span', 'table'], a: 2, e: 'span, a, img, strong y em fluyen dentro del texto.' },
      { q: 'Estás en /web/paginas/ y quieres enlazar /web/img/logo.png. ¿Qué ruta relativa usas?', o: ['img/logo.png', '../img/logo.png', '/paginas/img/logo.png', 'logo.png'], a: 1, e: '.. sube un nivel (a /web/) y desde ahí entras en img.' },
      { q: '¿Para qué sirve el atributo alt de una imagen?', o: ['Cambiar su tamaño', 'Dar un texto alternativo si no carga y para lectores de pantalla', 'Enlazarla', 'Redondearla'], a: 1, e: 'alt describe la imagen y es clave para la accesibilidad.' }
    ]
  }, { t: 'Bloque o en línea', tipo: 'clasifica', data: {
    intro: '¿Cómo se comporta cada etiqueta por defecto?',
    cats: ['Bloque', 'En línea'],
    items: [['<div>', 0], ['<p>', 0], ['<h1>', 0], ['<ul>', 0], ['<table>', 0], ['<span>', 1], ['<a>', 1], ['<img>', 1], ['<strong>', 1], ['<em>', 1]] } });

  /* ---------- Programación ---------- */
  A('prog', {
    t: 'Entrada de datos con Scanner',
    h: '<p>Para que un programa lea lo que escribe el usuario se usa la clase <code>Scanner</code>. Primero se importa (<code>import java.util.Scanner;</code>) y se crea con <code>new Scanner(System.in)</code>. Después, según el tipo de dato: <code>nextLine()</code> lee una línea de texto, <code>nextInt()</code> un entero, <code>nextDouble()</code> un decimal y <code>nextBoolean()</code> un true/false. Al terminar se cierra con <code>close()</code>.</p><p>Para <b>escribir</b>: <code>System.out.println()</code> añade salto de línea y <code>System.out.print()</code> no. Con <code>+</code> se concatena texto y variables.</p><p>Un programa típico sigue el modelo <b>Entrada → Proceso → Salida</b>: lee datos, calcula y muestra el resultado.</p>',
    code: 'import java.util.Scanner;\n\npublic class Saludo {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.print("Nombre: ");\n        String nombre = sc.nextLine();\n        System.out.print("Edad: ");\n        int edad = sc.nextInt();\n        System.out.println("Hola " + nombre + ", el año que viene tendrás " + (edad + 1));\n        sc.close();\n    }\n}',
    ref: { href: '../programacion/1-PROGRAMACION.html', text: 'Apuntes de Programación' },
    quiz: [
      { q: '¿Qué método lee un número entero?', o: ['nextLine()', 'nextInt()', 'nextDouble()', 'read()'], a: 1, e: 'nextInt() lee un entero; nextDouble() un decimal; nextLine() una línea de texto.' },
      { q: '¿Qué hace System.out.print() frente a println()?', o: ['Escribe sin saltar de línea', 'Lee del teclado', 'Escribe en rojo', 'Es igual'], a: 0, e: 'println() añade un salto de línea al final; print() no.' },
      { q: '¿Qué línea hay que poner antes de la clase para usar Scanner?', o: ['import java.util.Scanner;', 'include Scanner;', 'using Scanner;', 'package Scanner;'], a: 0, e: 'Scanner está en el paquete java.util y hay que importarlo.' }
    ]
  }, { t: 'Completa el programa con Scanner', tipo: 'hueco', data: {
    intro: 'Rellena los huecos para leer un nombre y una edad.',
    code: '[[0]] java.util.Scanner;\n\npublic class Datos {\n    public static void main(String[] args) {\n        Scanner sc = new [[1]](System.in);\n        String nombre = sc.[[2]]();\n        int edad = sc.[[3]]();\n        System.out.println(nombre + " " + edad);\n    }\n}',
    huecos: [{ o: ['include', 'import', 'package'], a: 1 }, { o: ['Scanner', 'Reader', 'Input'], a: 0 }, { o: ['nextInt', 'nextLine', 'readText'], a: 1 }, { o: ['nextLine', 'nextInt', 'nextText'], a: 1 }] } });

  A('prog', {
    t: 'Condicionales múltiples: else if y switch',
    h: '<p>Cuando hay varias alternativas se encadenan condiciones con <code>else if</code>. Se evalúan en orden y solo se ejecuta el primer bloque cuya condición sea verdadera; el <code>else</code> final recoge el resto.</p><p>Si comparas <b>una misma variable</b> con valores concretos, <code>switch</code> es más claro. Cada <code>case</code> acaba con <code>break</code> (si lo olvidas, el programa «se cae» al siguiente caso) y <code>default</code> recoge los demás valores. Java moderno permite la flecha <code>-&gt;</code> sin <code>break</code>.</p><p>El <b>operador ternario</b> es un if-else en una línea: <code>condición ? valorSiTrue : valorSiFalse</code>.</p>',
    code: 'int dia = 3;\nswitch (dia) {\n    case 1:\n        System.out.println("Lunes");\n        break;\n    case 2:\n        System.out.println("Martes");\n        break;\n    case 3:\n        System.out.println("Miércoles");\n        break;\n    default:\n        System.out.println("Otro día");\n}\n\nint nota = 7;\nString res = nota >= 5 ? "Aprobado" : "Suspenso";',
    ref: { href: '../programacion/1-PROGRAMACION.html', text: 'Apuntes de Programación' },
    quiz: [
      { q: '¿Qué pasa si olvidas break en un case de un switch clásico?', o: ['Da error de compilación', 'Se ejecutan también los casos siguientes', 'No pasa nada', 'El switch se repite'], a: 1, e: 'Sin break el programa continúa con el siguiente case («fall through»).' },
      { q: '¿Qué valor tiene res? int n = 3; String res = n > 5 ? "A" : "B";', o: ['"A"', '"B"', 'true', 'Error'], a: 1, e: '3 > 5 es falso, así que el ternario devuelve el segundo valor.' },
      { q: 'En una escala if / else if / else, ¿cuántos bloques se ejecutan como máximo?', o: ['Todos los verdaderos', 'Uno', 'Dos', 'Ninguno'], a: 1, e: 'Se ejecuta solo el primero cuya condición se cumple.' }
    ]
  }, { t: 'Predice la salida del switch', tipo: 'preguntas', data: { qs: [
    { q: '¿Qué escribe?', code: 'int x = 2;\nswitch (x) {\n    case 1: System.out.println("A"); break;\n    case 2: System.out.println("B"); break;\n    default: System.out.println("C");\n}', o: ['A', 'B', 'C', 'BC'], a: 1, e: 'x vale 2: entra en case 2, escribe B y break sale del switch.' },
    { q: '¿Qué escribe? (¡falta un break!)', code: 'int x = 1;\nswitch (x) {\n    case 1: System.out.println("A");\n    case 2: System.out.println("B"); break;\n    default: System.out.println("C");\n}', o: ['A', 'AB', 'ABC', 'B'], a: 1, e: 'Entra en case 1, escribe A y, sin break, sigue al case 2 y escribe B.' },
    { q: '¿Qué valor tiene r?', code: 'int edad = 17;\nString r = edad >= 18 ? "Mayor" : "Menor";', o: ['Mayor', 'Menor', '17', 'Error'], a: 1, e: '17 >= 18 es falso.' }
  ] } });

  A('prog', {
    t: 'Métodos (funciones) en Java',
    h: '<p>Un <b>método</b> es un bloque de código con nombre que se puede llamar muchas veces. Su estructura: <code>modificadores tipoDeRetorno nombre(parámetros) { ... }</code>. Si no devuelve nada, el tipo es <code>void</code>; si devuelve un valor, se usa <code>return</code>.</p><p>Según sus parámetros y retorno hay cuatro tipos: sin parámetros y sin retorno, con parámetros y sin retorno, sin parámetros y con retorno, y con ambos. Los métodos <code>static</code> se llaman sin crear un objeto, y la <b>sobrecarga</b> permite varios métodos con el mismo nombre y distintos parámetros.</p><p>Ventajas: evitas repetir código, el programa se lee mejor y es más fácil de probar.</p>',
    code: 'public class Ejemplo {\n    static void saludar() {\n        System.out.println("Hola");\n    }\n\n    static int sumar(int a, int b) {\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        saludar();\n        int r = sumar(3, 4);\n        System.out.println(r); // 7\n    }\n}',
    ref: { href: '../programacion/1-PROGRAMACION.html', text: 'Apuntes de Programación · UT 3' },
    quiz: [
      { q: '¿Qué tipo de retorno tiene un método que no devuelve nada?', o: ['null', 'void', 'int', 'empty'], a: 1, e: 'void significa «sin valor de retorno».' },
      { q: '¿Qué hace return en un método?', o: ['Repite el método', 'Devuelve un valor y termina el método', 'Imprime en pantalla', 'Importa una clase'], a: 1, e: 'return entrega el resultado a quien llamó al método.' },
      { q: '¿Qué es la sobrecarga de métodos?', o: ['Un método muy largo', 'Varios métodos con el mismo nombre y distintos parámetros', 'Un método recursivo', 'Un error'], a: 1, e: 'El compilador elige el método según los argumentos que le pases.' }
    ]
  }, { t: 'Clasifica los métodos', tipo: 'clasifica', data: {
    intro: '¿De qué tipo es cada método según sus parámetros y su retorno?',
    cats: ['Sin parámetros, sin retorno', 'Con parámetros, sin retorno', 'Sin parámetros, con retorno', 'Con parámetros, con retorno'],
    items: [['static void saludar()', 0], ['static void mostrarMenu()', 0], ['static void escribir(String texto)', 1], ['static void repetir(int veces)', 1], ['static int numeroAleatorio()', 2], ['static double pi()', 2], ['static int sumar(int a, int b)', 3], ['static boolean esPar(int n)', 3]] } });

  A('prog', {
    t: 'Ámbito de variables y paso de argumentos',
    h: '<p>El <b>ámbito</b> de una variable es la parte del programa donde existe: una variable declarada dentro de un método o de un bloque <code>{ }</code> solo se puede usar ahí. Si intentas usarla fuera, el compilador da error.</p><p>En Java los argumentos se pasan <b>por valor</b>: el método recibe una <i>copia</i>. Si cambias un parámetro de tipo primitivo dentro del método, la variable original no se modifica.</p><p>Una <b>constante</b> se declara con <code>final</code> (por convención en MAYÚSCULAS). La <b>recursividad</b> es un método que se llama a sí mismo; necesita siempre un <b>caso base</b> que lo detenga.</p>',
    code: 'public class Ambito {\n    static void duplicar(int n) {\n        n = n * 2;\n        System.out.println("Dentro: " + n);\n    }\n\n    public static void main(String[] args) {\n        int x = 5;\n        duplicar(x);\n        System.out.println("Fuera: " + x);\n    }\n}',
    ref: { href: '../programacion/1-PROGRAMACION.html', text: 'Apuntes de Programación · UT 3' },
    quiz: [
      { q: '¿Qué significa que Java pasa los argumentos por valor?', o: ['El método recibe una copia', 'El método modifica la variable original', 'Solo funciona con texto', 'No se pueden pasar argumentos'], a: 0, e: 'Cambiar el parámetro dentro del método no cambia la variable de fuera (en primitivos).' },
      { q: '¿Qué necesita todo método recursivo para no repetirse infinitamente?', o: ['Un caso base', 'La palabra static', 'Un parámetro String', 'Un switch'], a: 0, e: 'El caso base es la condición en la que el método deja de llamarse.' },
      { q: 'Una variable declarada dentro de un bucle for, ¿se puede usar después del bucle?', o: ['Sí', 'No, su ámbito es el bloque del bucle'], a: 1, e: 'Solo existe dentro de las llaves donde se declaró.' }
    ]
  }, { t: 'Predice el valor', tipo: 'preguntas', data: { qs: [
    { q: '¿Qué escribe "Fuera"?', code: 'static void duplicar(int n) { n = n * 2; }\n\nint x = 5;\nduplicar(x);\nSystem.out.println("Fuera: " + x);', o: ['Fuera: 10', 'Fuera: 5', 'Fuera: 0', 'Error'], a: 1, e: 'Se pasa una copia: x sigue valiendo 5.' },
    { q: '¿Qué devuelve factorial(3)?', code: 'static int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}', o: ['3', '6', '9', '1'], a: 1, e: '3 · 2 · 1 = 6. El caso base es n <= 1.' },
    { q: '¿Qué ocurre al compilar esto?', code: 'for (int i = 0; i < 3; i++) {\n    int doble = i * 2;\n}\nSystem.out.println(doble);', o: ['Escribe 4', 'Escribe 0', 'Error: doble no existe fuera del bucle', 'Escribe 6'], a: 2, e: 'doble solo existe dentro del bloque del for.' }
  ] } });
})();
