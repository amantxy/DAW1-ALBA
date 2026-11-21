/* Lecciones ampliadas: Sistemas Informáticos y Despliegue de Aplicaciones Web.
   Resumen propio a partir de los apuntes de abrilcode (CC BY-SA 4.0, Fernando Valdeón). */
(function () {
  var A = window.AGREGA;
  var SS = function (u, t) { return { href: 'https://ssii.abrilcode.com/doku.php?id=' + u, text: t }; };
  var DE = function (u, t) { return { href: 'https://despliegue.abrilcode.com/doku.php?id=' + u, text: t }; };

  /* ================= SISTEMAS INFORMÁTICOS ================= */
  A('sistemas', {
    t: 'Electricidad, puertas lógicas y numeración',
    h: '<p>Un sistema informático = <b>hardware</b> (parte física) + <b>software</b> (programas) + <b>componente humano</b> (quien lo crea o usa).</p><p><b>Electricidad:</b> el <b>voltaje</b> (tensión) se mide en voltios (V) y la <b>intensidad</b> en amperios (A). Los <b>conductores</b> dejan pasar los electrones, los <b>aislantes</b> no y los <b>semiconductores</b> (silicio) hacen una cosa u otra según las condiciones. La corriente es <b>continua</b> (pilas) o <b>alterna</b> (red doméstica). Los <b>transistores</b> son la base de los chips.</p><p><b>Puertas lógicas:</b> <b>AND</b> da 1 solo si todas las entradas son 1; <b>OR</b> da 0 solo si todas son 0; <b>NOT</b> invierte la entrada.</p><p><b>Numeración:</b> decimal (base 10), binario (base 2), octal (base 8, grupos de 3 bits) y hexadecimal (base 16, dígitos 0-9 y A-F, grupos de 4 bits). 1 byte = 8 bits = 256 combinaciones; cada unidad (KB, MB, GB…) es 1024 veces la anterior. Decimal a binario: divide entre 2 y lee los restos de abajo arriba.</p>',
    ref: SS('unidad1:introduccion', 'Unidad 1 · Fundamentos (abrilcode)'),
    quiz: [
      { q: '¿Cuándo da 1 una puerta AND de dos entradas?', o: ['Si alguna entrada es 1', 'Solo si las dos entradas son 1', 'Si las dos son 0', 'Nunca'], a: 1, e: 'AND exige todas las entradas a 1.' },
      { q: '¿En qué unidad se mide la intensidad?', o: ['Voltios', 'Amperios', 'Hercios', 'Bytes'], a: 1, e: 'Voltios = tensión; amperios = intensidad.' },
      { q: '¿Cuánto vale 1010 en binario?', o: ['8', '10', '12', '5'], a: 1, e: '8 + 0 + 2 + 0 = 10.' },
      { q: '¿Cuántos bits se agrupan para pasar de binario a hexadecimal?', o: ['2', '3', '4', '8'], a: 2, e: 'Cada dígito hexadecimal son 4 bits (octal usa 3).' }
    ]
  }, { t: 'Une cada concepto', tipo: 'parejas', data: {
    intro: 'Relaciona cada término con su significado.',
    pares: [['Voltio (V)', 'Unidad de tensión'], ['Amperio (A)', 'Unidad de intensidad'], ['Semiconductor', 'Material como el silicio'], ['Puerta NOT', 'Invierte la entrada'], ['Byte', '8 bits'], ['Hexadecimal', 'Base 16 (0-9 y A-F)']] } });

  A('sistemas', {
    t: 'Hardware: CPU, memoria y placa base',
    h: '<p>Los ordenadores actuales siguen la <b>arquitectura Von Neumann</b>: CPU, memoria principal, buses y dispositivos de entrada/salida. De mayor a menor potencia: superordenadores, mainframes, workstations y PC.</p><p>La <b>CPU</b> ejecuta las instrucciones; su frecuencia se mide en Hz (hoy GHz). La <b>jerarquía de memoria</b> va de más rápida y pequeña a más lenta y grande: <b>registros → caché (L1, L2, L3) → RAM → almacenamiento secundario</b>. La RAM es <b>volátil</b> (pierde los datos sin corriente); discos, SSD y flash no.</p><p>La <b>placa base</b> conecta todo. Su <b>chipset</b> tiene el <b>puente norte</b> (CPU, RAM y gráficos) y el <b>puente sur</b> (puertos y discos). El <b>socket</b> es donde se pincha el procesador (ZIF o LGA) y la <b>BIOS</b> es el firmware que arranca el equipo.</p><p><b>Almacenamiento:</b> HDD (discos magnéticos, sensibles a golpes) frente a SSD (sin partes móviles, más rápido). Conectores: SATA sustituyó a IDE. PCI-Express es la ranura actual de expansión. Red: RJ-45. Vídeo: VGA (analógico), DVI y HDMI (digitales).</p>',
    ref: SS('unidad2:hardware', 'Unidad 2 · Hardware (abrilcode)'),
    quiz: [
      { q: '¿Cuál es el orden de la jerarquía de memoria, de más rápida a más lenta?', o: ['RAM, caché, registros, disco', 'Registros, caché, RAM, almacenamiento secundario', 'Disco, RAM, caché, registros', 'Caché, registros, disco, RAM'], a: 1, e: 'A más velocidad, más coste y menos capacidad.' },
      { q: '¿Qué memoria es volátil?', o: ['SSD', 'Disco duro', 'RAM', 'Memoria flash'], a: 2, e: 'La RAM pierde su contenido al apagar.' },
      { q: '¿Qué conecta el puente norte?', o: ['USB y discos', 'CPU, memoria y gráficos', 'Solo el teclado', 'La red Wi-Fi'], a: 1, e: 'El puente sur se ocupa de puertos y discos.' },
      { q: '¿Qué es la BIOS?', o: ['Un antivirus', 'Firmware de arranque de la placa base', 'Un tipo de RAM', 'Un sistema de archivos'], a: 1, e: 'Hace el arranque y el autochequeo, independiente del SO.' }
    ]
  }, { t: 'Ordena la memoria', tipo: 'clasifica', data: {
    intro: '¿Es memoria principal o secundaria?',
    cats: ['Principal / interna', 'Secundaria (almacenamiento)'],
    items: [['RAM', 0], ['Caché L1', 0], ['Registros de la CPU', 0], ['Disco duro HDD', 1], ['SSD', 1], ['Pendrive (flash)', 1]] } });

  A('sistemas', {
    t: 'Software, licencias y sistema operativo',
    h: '<p>El software se clasifica en <b>aplicación</b> (tareas del usuario), <b>desarrollo</b> (compiladores, IDE, depuradores) y <b>sistema</b> (sistema operativo, drivers, utilidades).</p><p><b>Licencias:</b> propietarias, libres, semilibres, dominio público y copyleft. El <b>software libre</b> da cuatro libertades: usar, estudiar/adaptar (con acceso al código), distribuir copias y mejorar y publicar las mejoras. <b>Libre no es lo mismo que gratis</b>; el <i>freeware</i> es gratuito pero no necesariamente libre.</p><p>El <b>sistema operativo</b> tiene cinco funciones: interfaz de usuario, administración de recursos, de archivos, de tareas y servicio de soporte. El <b>kernel</b> (núcleo) es la parte que permanece en memoria. Un <b>proceso</b> es un programa en ejecución y puede estar <b>en ejecución, preparado o bloqueado</b>; el <b>planificador</b> reparte el tiempo de CPU. Los <b>drivers</b> estandarizan el acceso a los periféricos.</p><p>Para practicar instalaciones se usan <b>máquinas virtuales</b> (VirtualBox, VMware): aíslan el sistema pero son más lentas que el real. Una <b>imagen ISO</b> es la copia de un sistema de archivos y sirve para crear USB booteables.</p>',
    ref: SS('unidad3:software', 'Unidad 3 · Software (abrilcode)'),
    quiz: [
      { q: '¿Qué tipo de software es un compilador?', o: ['De aplicación', 'De desarrollo', 'De sistema', 'Ofimática'], a: 1, e: 'Compiladores, IDE y depuradores son herramientas de desarrollo.' },
      { q: 'Software libre significa…', o: ['Siempre gratuito', 'Que respeta las cuatro libertades (usar, estudiar, distribuir y mejorar)', 'Sin copyright', 'Solo para Linux'], a: 1, e: 'Libre ≠ gratis: puede venderse.' },
      { q: '¿En qué estados puede estar un proceso?', o: ['Ejecución, preparado y bloqueado', 'Activo y apagado', 'Libre y ocupado', 'Compilado e interpretado'], a: 0, e: 'El SO gestiona las transiciones entre estos tres estados.' },
      { q: '¿Para qué sirven los drivers?', o: ['Para comprimir archivos', 'Para estandarizar el acceso a los periféricos', 'Para crear usuarios', 'Para cifrar discos'], a: 1, e: 'Las aplicaciones no dependen de cada fabricante.' }
    ]
  }, { t: 'Clasifica el software', tipo: 'clasifica', data: {
    intro: '¿De aplicación, de desarrollo o de sistema?',
    cats: ['Aplicación', 'Desarrollo', 'Sistema'],
    items: [['Navegador web', 0], ['Hoja de cálculo', 0], ['Videojuego', 0], ['Compilador de Java', 1], ['Depurador', 1], ['IDE Eclipse', 1], ['Linux (kernel)', 2], ['Driver de la tarjeta gráfica', 2]] } });

  A('sistemas', {
    t: 'Linux: archivos, usuarios y permisos',
    h: '<p>En Linux <b>todo es un fichero</b> y hay un único árbol de directorios con raíz <code>/</code>; los discos se <i>montan</i> en carpetas. Distingue mayúsculas de minúsculas. <code>~</code> es tu HOME, <code>.</code> el directorio actual y <code>..</code> el padre.</p><p><b>Directorios clave:</b> <code>/etc</code> configuración, <code>/home</code> usuarios, <code>/bin</code> y <code>/sbin</code> binarios, <code>/dev</code> dispositivos, <code>/var</code> logs y datos, <code>/tmp</code> temporales, <code>/root</code> HOME del superusuario.</p><p><b>Usuarios:</b> <code>/etc/passwd</code> (usuarios), <code>/etc/group</code> (grupos) y <code>/etc/shadow</code> (contraseñas, solo root). Comandos: <code>adduser</code>, <code>deluser</code>, <code>passwd</code>, <code>sudo</code>, <code>su</code>.</p><p><b>Permisos:</b> <code>ls -l</code> muestra el tipo y tres grupos <code>rwx</code> (propietario, grupo, resto). r=4, w=2, x=1: <code>chmod 750</code> = rwx para el propietario, r-x para el grupo y nada para el resto. <code>chown</code> cambia propietario y <code>chgrp</code> el grupo.</p><p><b>Comandos útiles:</b> <code>ls -la</code>, <code>cd</code>, <code>mkdir -p</code>, <code>cp -r</code>, <code>mv</code>, <code>rm -rf</code> (¡no hay papelera!), <code>grep</code>, <code>find</code>, <code>ps aux</code>, <code>kill -9 PID</code>, <code>apt-get install</code>, redirección <code>&gt;</code> (sobrescribe), <code>&gt;&gt;</code> (añade) y tubería <code>|</code>.</p>',
    ref: SS('unidad4:administracionssoo', 'Unidad 4 · Administración Linux (abrilcode)'),
    quiz: [
      { q: '¿Qué permisos da chmod 754?', o: ['rwx r-x r--', 'rwx rwx r--', 'rw- r-x r--', 'r-x rwx rwx'], a: 0, e: '7 = rwx, 5 = r-x, 4 = r--.' },
      { q: '¿Dónde se guardan las contraseñas cifradas?', o: ['/etc/passwd', '/etc/shadow', '/home', '/var/log'], a: 1, e: '/etc/shadow solo es accesible para root.' },
      { q: '¿Qué hace "ls >> lista.txt"?', o: ['Sobrescribe lista.txt', 'Añade la salida al final de lista.txt', 'Lee lista.txt', 'Borra lista.txt'], a: 1, e: '> sobrescribe y >> añade.' },
      { q: '¿Qué ocurre con "rm -rf carpeta"?', o: ['Va a la papelera', 'Se borra de forma irreversible', 'Solo borra si está vacía', 'Pide permiso a root'], a: 1, e: 'En Linux no hay papelera por línea de comandos.' }
    ]
  }, { t: 'Une comando y función', tipo: 'parejas', data: {
    intro: 'Relaciona cada comando con lo que hace.',
    pares: [['pwd', 'Muestra el directorio actual'], ['mkdir -p', 'Crea carpetas (y las intermedias)'], ['chmod', 'Cambia permisos'], ['chown', 'Cambia el propietario'], ['ps aux', 'Lista los procesos'], ['kill -9', 'Termina un proceso a la fuerza'], ['grep', 'Filtra líneas que contienen un texto']] } });

  A('sistemas', {
    t: 'Redes: MAC, IP, TCP/IP y dispositivos',
    h: '<p>Una <b>red</b> conecta equipos para intercambiar información. Un <b>protocolo</b> es el conjunto de reglas de la comunicación (sintaxis, semántica y sincronización).</p><p><b>Direcciones:</b> la <b>MAC</b> tiene 48 bits, la fija el fabricante y se usa dentro de la red local. La <b>IPv4</b> tiene 32 bits y se usa entre redes. IP privadas: 10.0.0.0/8, 172.16.0.0–172.31.255.255 y 192.168.0.0/16.</p><p><b>Dispositivos:</b> el <b>hub</b> repite los datos por todos los puertos (en desuso); el <b>switch</b> aprende qué MAC hay en cada puerto y envía solo al correcto; el <b>router</b> une redes distintas y enruta según la IP.</p><p><b>Modelo TCP/IP</b> (4 niveles): interfaz de red (Ethernet, ARP), Internet (IP, ICMP), transporte (TCP fiable, UDP ligero) y aplicación (HTTP, DNS, DHCP). Cada nivel añade su cabecera: <b>encapsulamiento</b>. El modelo OSI tiene 7 capas.</p><p><b>ARP</b> averigua la MAC de una IP (request en broadcast, reply de respuesta). <b>ICMP</b> informa de errores: <code>ping</code> usa Echo Request (8) y Echo Reply (0). <b>DNS</b> traduce nombres a IP y <b>DHCP</b> asigna IP, máscara, puerta de enlace y DNS. <b>Wireshark</b> captura y analiza paquetes.</p>',
    ref: SS('unidad5:fundamentosred', 'Unidad 5 · Redes (abrilcode)'),
    quiz: [
      { q: '¿Cuántos bits tiene una dirección MAC?', o: ['32', '48', '64', '128'], a: 1, e: 'MAC 48 bits; IPv4 32 bits.' },
      { q: '¿Qué dispositivo envía los paquetes solo al puerto correcto?', o: ['Hub', 'Switch', 'Cable', 'Repetidor'], a: 1, e: 'El switch aprende las MAC de cada puerto.' },
      { q: '¿Qué protocolo obtiene la MAC a partir de una IP?', o: ['DNS', 'DHCP', 'ARP', 'ICMP'], a: 2, e: 'ARP pregunta por broadcast quién tiene esa IP.' },
      { q: '¿Qué protocolo reparte IP automáticamente?', o: ['DHCP', 'DNS', 'HTTP', 'TCP'], a: 0, e: 'DHCP asigna IP, máscara, puerta de enlace y DNS.' }
    ]
  }, { t: 'Capa de cada protocolo', tipo: 'clasifica', data: {
    intro: '¿En qué nivel del modelo TCP/IP trabaja cada protocolo?',
    cats: ['Interfaz de red', 'Internet', 'Transporte', 'Aplicación'],
    items: [['Ethernet', 0], ['ARP', 0], ['IP', 1], ['ICMP', 1], ['TCP', 2], ['UDP', 2], ['HTTP', 3], ['DNS', 3], ['DHCP', 3]] } });

  A('sistemas', {
    t: 'Direccionamiento IP y máscara de red',
    h: '<p>Una IPv4 son 32 bits en 4 bytes (0.0.0.0 a 255.255.255.255) y se divide en <b>ID de red</b> e <b>ID de host</b>. La <b>máscara</b> dice cuántos bits son de red. Por clases: <b>A</b> 255.0.0.0 (/8), <b>B</b> 255.255.0.0 (/16) y <b>C</b> 255.255.255.0 (/24). La notación <b>CIDR</b> escribe /n con los bits de red.</p><p>El <b>ID de red</b> se calcula con un <b>AND bit a bit</b> entre IP y máscara: 192.168.10.45 con 255.255.255.0 → <b>192.168.10.0</b>. Dos equipos están en la misma red si tienen el mismo ID de red.</p><p>La <b>dirección de red</b> tiene todos los bits de host a 0 y la de <b>broadcast</b> a 1 (por ejemplo, terminada en 255 en clase C): ninguna de las dos se asigna a un equipo. <b>127.0.0.1</b> es el <i>loopback</i> (tu propio equipo).</p><p>Para configurar una tarjeta: <b>IP</b>, <b>máscara</b> y <b>puerta de enlace</b> (la IP del router, en tu misma red), estáticas o por DHCP. Cable <b>directo</b> para dispositivos distintos (PC-switch) y <b>cruzado</b> para iguales (PC-PC, switch-switch). Cisco <b>Packet Tracer</b> sirve para simular redes.</p>',
    ref: SS('unidad6:direccionamientoip', 'Unidad 6 · Direccionamiento IP (abrilcode)'),
    quiz: [
      { q: '¿Cuál es el ID de red de 192.168.10.45 con máscara 255.255.255.0?', o: ['192.168.10.45', '192.168.10.0', '192.168.0.0', '192.168.10.255'], a: 1, e: 'AND bit a bit: el último byte pasa a 0.' },
      { q: '¿Qué máscara equivale a /16?', o: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'], a: 1, e: '16 bits de red = 255.255.0.0.' },
      { q: '¿Cuál NO puede asignarse a un equipo en la red 192.168.1.0/24?', o: ['192.168.1.20', '192.168.1.254', '192.168.1.255', '192.168.1.1'], a: 2, e: '.255 es la dirección de broadcast.' },
      { q: '¿Qué es 127.0.0.1?', o: ['La IP del router', 'La dirección de loopback (tu propio equipo)', 'Una IP pública', 'El servidor DNS'], a: 1, e: 'El rango 127.x.x.x está reservado para loopback.' }
    ]
  }, { t: 'Calcula la red', tipo: 'preguntas', data: { qs: [
    { q: 'IP 10.20.30.40 con máscara 255.0.0.0. ¿ID de red?', o: ['10.0.0.0', '10.20.0.0', '10.20.30.0', '10.20.30.40'], a: 0, e: 'Clase A: solo el primer byte es de red.' },
    { q: 'IP 172.16.5.9 con máscara 255.255.0.0. ¿ID de red?', o: ['172.0.0.0', '172.16.0.0', '172.16.5.0', '172.16.5.9'], a: 1, e: 'Se conservan los dos primeros bytes.' },
    { q: '¿Están PC1 (192.168.1.10/24) y PC2 (192.168.2.10/24) en la misma red?', o: ['Sí', 'No: sus ID de red son 192.168.1.0 y 192.168.2.0', 'Solo si hay un hub', 'Depende del DNS'], a: 1, e: 'Para hablar entre ellos necesitan un router.' },
    { q: 'La puerta de enlace de un equipo 192.168.1.50/24 podría ser…', o: ['192.168.1.1', '192.168.2.1', '10.0.0.1', '8.8.8.8'], a: 0, e: 'Debe estar en su misma red.' }
  ] } });

  /* ================= DESPLIEGUE DE APLICACIONES WEB ================= */
  A('despliegue', {
    t: 'Arquitectura web, DNS y tipos de servidor',
    h: '<p>Una aplicación web sigue el modelo <b>cliente-servidor</b>: el cliente (navegador) pide y el servidor responde. Internet usa <b>TCP/IP</b>: la <b>IP</b> identifica al equipo, el <b>puerto</b> a la aplicación, y los datos se <b>encapsulan</b> capa a capa.</p><p><b>DNS:</b> traduce nombres a IP. Un nombre se lee de derecha a izquierda: <b>TLD</b> (.com, .es) → <b>SLD</b> (organización) → subdominios (www). Resolución: caché y fichero <code>hosts</code> → servidor <b>recursivo</b> → <b>raíz</b> → <b>TLD</b> → <b>autoritativo</b>, que da la IP final. Suele usar UDP y su cabecera mide 12 bytes.</p><p><b>Programación por capas:</b> presentación, negocio y datos. La separación <i>lógica</i> siempre existe; la <i>física</i> depende de la carga. <b>LAMP</b> = Linux + Apache + MySQL + PHP; <b>WISA</b> = Windows + IIS + SQL Server + ASP.NET.</p><p><b>Servidores:</b> FTP (vsFTPd, FileZilla Server), web (Apache, Nginx, IIS), bases de datos (MySQL, MariaDB, PostgreSQL, MongoDB) y de aplicaciones (Tomcat). Una <b>máquina virtual</b> virtualiza el hardware; un <b>contenedor</b> virtualiza el SO y es más ligero.</p>',
    ref: DE('bloque1:arquitectura', 'Bloque 1 · Tecnologías y arquitecturas web (abrilcode)'),
    quiz: [
      { q: '¿Qué servidor DNS conoce la IP final del dominio?', o: ['Recursivo', 'Raíz', 'TLD', 'Autoritativo'], a: 3, e: 'El autoritativo guarda la información real del dominio.' },
      { q: 'LAMP significa…', o: ['Linux, Apache, MySQL, PHP', 'Linux, Access, MongoDB, Python', 'Lenguaje, Apache, MySQL, Perl', 'Windows, Apache, MySQL, PHP'], a: 0, e: 'WISA es la versión de Microsoft.' },
      { q: 'En "www.ejemplo.es", ¿cuál es el TLD?', o: ['www', 'ejemplo', 'es', 'ejemplo.es'], a: 2, e: 'El TLD es el dominio de primer nivel, a la derecha.' },
      { q: 'Diferencia entre máquina virtual y contenedor:', o: ['Son lo mismo', 'La VM virtualiza hardware y el contenedor el sistema operativo', 'El contenedor virtualiza hardware', 'La VM es más ligera'], a: 1, e: 'Por eso los contenedores son más ligeros.' }
    ]
  }, { t: 'Une servidor y ejemplo', tipo: 'parejas', data: {
    intro: 'Relaciona cada tipo de servidor con un ejemplo.',
    pares: [['Servidor web', 'Apache'], ['Servidor FTP', 'vsFTPd'], ['Base de datos relacional', 'MariaDB'], ['Base de datos NoSQL', 'MongoDB'], ['Servidor de aplicaciones', 'Tomcat'], ['Contenedores', 'Docker']] } });

  A('despliegue', {
    t: 'SSH, FTP y cortafuegos UFW',
    h: '<p><b>SSH</b> es el protocolo seguro para administrar un servidor remoto (puerto <b>22</b>; paquete <code>openssh-server</code>; config en <code>/etc/ssh/sshd_config</code>). Conexión: <code>ssh usuario@ip</code> o <code>ssh -p puerto usuario@ip</code>. <b>SFTP</b> y <b>SCP</b> viajan sobre SSH.</p><p><b>FTP</b> usa dos conexiones: <b>control</b> (puerto <b>21</b>) y <b>datos</b>. En modo <b>activo</b> el servidor abre la conexión de datos desde el puerto 20 (los cortafuegos lo bloquean); en modo <b>pasivo</b> el cliente inicia ambas. Los modos de transferencia son <b>binario</b> (imágenes, ejecutables) y <b>ASCII</b> (texto). <b>FTPS</b> es FTP con TLS; <b>SFTP</b> es otra cosa (subsistema de SSH).</p><p><b>vsFTPd</b> se configura en <code>/etc/vsftpd.conf</code>: <code>anonymous_enable=NO</code>, <code>local_enable=YES</code>, <code>write_enable=YES</code>, <code>chroot_local_user=YES</code> (enjaula al usuario en su carpeta).</p><p><b>UFW</b> simplifica iptables: deniega lo entrante por defecto. <b>Permite SSH antes de activarlo</b> o te quedas sin acceso: <code>ufw allow ssh</code>, <code>ufw enable</code>, <code>ufw status verbose</code>.</p><p><b>Cuotas de disco:</b> límite <i>blando</i> (aviso) y <i>duro</i> (bloqueo) por usuario.</p>',
    ref: DE('bloque2:ftp', 'Bloque 2 · FTP, SSH y firewall (abrilcode)'),
    quiz: [
      { q: '¿Qué puerto usa SSH por defecto?', o: ['21', '22', '80', '443'], a: 1, e: 'FTP usa el 21 para control.' },
      { q: 'En FTP modo pasivo…', o: ['El servidor inicia la conexión de datos', 'El cliente inicia las dos conexiones', 'No hay conexión de datos', 'Solo funciona con SSH'], a: 1, e: 'Evita que el cortafuegos del cliente bloquee la conexión entrante.' },
      { q: '¿Qué debes hacer antes de activar UFW en un servidor remoto?', o: ['Nada', 'Permitir SSH', 'Borrar todas las reglas', 'Cerrar el puerto 22'], a: 1, e: 'Si no, te quedas sin acceso remoto.' },
      { q: '¿Cuál es el modo adecuado para transferir una imagen por FTP?', o: ['ASCII', 'Binario', 'Texto', 'Ninguno'], a: 1, e: 'Binario copia byte a byte.' }
    ]
  }, { t: 'Completa la configuración de vsFTPd', tipo: 'hueco', data: {
    intro: 'Elige el valor correcto para cada directiva.',
    code: 'anonymous_enable=[[0]]\nlocal_enable=[[1]]\nwrite_enable=[[2]]\nchroot_local_user=[[3]]',
    huecos: [{ o: ['NO', 'YES'], a: 0 }, { o: ['NO', 'YES'], a: 1 }, { o: ['YES', 'NO'], a: 0 }, { o: ['NO', 'YES'], a: 1 }] } });

  A('despliegue', {
    t: 'HTTP, HTTPS y servidor Apache',
    h: '<p><b>HTTP</b> es cliente-servidor y <b>sin estado</b> (puerto <b>80</b>). Un mensaje tiene línea inicial, cabeceras y cuerpo opcional. La petición lleva verbo (GET, POST…), recurso y versión; la respuesta, un código (200 OK, 404 Not Found). <b>HTTPS</b> usa un certificado y <b>TLS</b> para cifrar (puerto <b>443</b>).</p><p><b>Apache</b> (<code>apt-get install apache2</code>) es gratuito y multiplataforma; <b>IIS</b> es el de Microsoft y <b>nginx</b> también es muy popular. Documentos en <code>/var/www</code>. Estado: <code>systemctl status apache2</code>.</p><p><b>Estructura:</b> <code>apache2.conf</code> (principal), <code>ports.conf</code> (puertos), <code>sites-available/enabled</code> (hosts virtuales), <code>mods-available/enabled</code> y <code>conf-available/enabled</code>. Se activan con <code>a2ensite</code>, <code>a2enmod</code>, <code>a2enconf</code> (y <code>a2dis…</code> para desactivar). Valida con <code>apache2ctl configtest</code>.</p><p><b>Hosts virtuales:</b> varios sitios en un servidor. Directivas: <code>ServerName</code>, <code>ServerAlias</code>, <code>DocumentRoot</code>, <code>ErrorLog</code>. Si ningún nombre coincide, se sirve el primero cargado (orden alfabético). El fichero <b>hosts</b> (<code>/etc/hosts</code>) asocia nombres a IP sin DNS, en el <i>cliente</i>.</p><p><b>Autenticación básica:</b> <code>.htaccess</code> con <code>AuthType Basic</code>, <code>AuthUserFile</code> y <code>Require valid-user</code>; usuarios con <code>htpasswd -c</code>; requiere <code>AllowOverride All</code>. Perfiles UFW: WWW (80), WWW Full (80 y 443), WWW Secure (443).</p>',
    ref: DE('bloque3:web', 'Bloque 3 · Servidores web y bases de datos (abrilcode)'),
    quiz: [
      { q: '¿Qué comando activa un host virtual?', o: ['a2enmod', 'a2ensite', 'a2enconf', 'apache2ctl'], a: 1, e: 'a2enmod es para módulos y a2enconf para configuraciones.' },
      { q: '¿Dónde guarda Apache los documentos por defecto?', o: ['/etc/apache2', '/var/www', '/usr/bin', '/home'], a: 1, e: '/etc/apache2 contiene la configuración.' },
      { q: 'HTTP es un protocolo…', o: ['Con estado', 'Sin estado', 'Solo de correo', 'De transferencia de ficheros'], a: 1, e: 'El servidor no recuerda al cliente entre peticiones.' },
      { q: '¿Qué comprueba la sintaxis de la configuración de Apache?', o: ['apache2ctl configtest', 'a2ensite', 'ufw status', 'htpasswd'], a: 0, e: 'Conviene ejecutarlo antes de reiniciar.' }
    ]
  }, { t: 'Une comando y función', tipo: 'parejas', data: {
    intro: 'Relaciona cada comando de Apache con lo que hace.',
    pares: [['a2ensite', 'Habilita un host virtual'], ['a2dissite', 'Deshabilita un host virtual'], ['a2enmod', 'Habilita un módulo'], ['apache2ctl configtest', 'Valida la sintaxis'], ['htpasswd -c', 'Crea el fichero de contraseñas'], ['ufw allow "WWW Full"', 'Abre los puertos 80 y 443']] } });

  A('despliegue', {
    t: 'PHP, MariaDB y phpMyAdmin',
    h: '<p>Para ejecutar <b>PHP</b> en Apache se instalan <code>php</code>, <code>libapache2-mod-php</code> y <code>php-mysql</code> (conexión a MariaDB/MySQL). Se comprueba con <code>php -v</code> y un script con <code>phpinfo()</code>. Apache corre como el usuario <b>www-data</b>: para que PHP escriba en una carpeta, hazla suya con <code>chown -R www-data:www-data carpeta</code>.</p><p><b>MariaDB</b> es el fork de MySQL que usa Debian (<code>apt-get install mariadb-server</code>). Buenas prácticas: ejecutar <code>mysql_secure_installation</code> (quita anónimos, acceso remoto root y la base <i>test</i>) y crear <b>un usuario por aplicación</b> con permisos solo sobre su base de datos:</p><pre>CREATE USER \'app\'@\'localhost\' IDENTIFIED BY \'clave\';\nGRANT ALL ON basedatos.* TO \'app\'@\'localhost\';</pre><p><b>phpMyAdmin</b> es una aplicación web para administrar MySQL/MariaDB; necesita PHP y extensiones como <code>php-mbstring</code>, <code>php-zip</code> y <code>php-gd</code>. Se configura con <code>config.inc.php</code> (<code>blowfish_secret</code>) y un alias en Apache. Conviene protegerlo con <code>.htaccess</code> + <code>.htpasswd</code>.</p>',
    ref: DE('bloque3:web', 'Bloque 3 · PHP, MariaDB y phpMyAdmin (abrilcode)'),
    quiz: [
      { q: '¿Qué usuario ejecuta Apache en Debian?', o: ['root', 'www-data', 'apache-user', 'mysql'], a: 1, e: 'Debe tener permisos sobre las carpetas donde PHP escribe.' },
      { q: '¿Qué paquete permite a PHP hablar con MariaDB?', o: ['php-xml', 'php-mysql', 'php-gd', 'libapache2-mod-php'], a: 1, e: 'libapache2-mod-php es el módulo que ejecuta PHP en Apache.' },
      { q: 'Buena práctica con bases de datos:', o: ['Usar root en todas las apps', 'Un usuario por aplicación con permisos solo sobre su base', 'Dejar la base test', 'Permitir root remoto'], a: 1, e: 'Mínimo privilegio.' },
      { q: '¿Qué hace mysql_secure_installation?', o: ['Instala phpMyAdmin', 'Endurece la instalación (quita anónimos y la base test)', 'Hace copias de seguridad', 'Crea tablas'], a: 1, e: 'Es el primer paso tras instalar el servidor.' }
    ]
  }, { t: 'Completa la creación de usuario', tipo: 'hueco', data: {
    intro: 'Crea un usuario de aplicación para la base «tienda».',
    code: '[[0]] USER \'tienda\'@\'localhost\' IDENTIFIED BY \'clave\';\n[[1]] ALL ON tienda.* [[2]] \'tienda\'@\'localhost\';',
    huecos: [{ o: ['CREATE', 'INSERT', 'SELECT'], a: 0 }, { o: ['GRANT', 'REVOKE', 'ALTER'], a: 0 }, { o: ['FROM', 'TO', 'ON'], a: 1 }] } });

  A('despliegue', {
    t: 'Docker: imágenes y contenedores',
    h: '<p><b>Docker</b> empaqueta una aplicación con sus dependencias en <b>contenedores</b> aislados: se comporta igual en cualquier máquina. Piezas: el <b>daemon</b> (<code>dockerd</code>, el servicio), el <b>cliente</b> (<code>docker</code>), el <b>registro</b> (Docker Hub) y las <b>imágenes</b> (plantillas de solo lectura) de las que salen los <b>contenedores</b> (instancias en ejecución).</p><p><b>Dockerfile:</b> <code>FROM</code> (imagen base), <code>RUN</code> (comando al <i>construir</i>), <code>COPY</code>, <code>WORKDIR</code>, <code>ENV</code>, <code>EXPOSE</code> y <code>CMD</code> (comando al <i>arrancar</i>). Construir: <code>docker build -t nombre .</code></p><p><b>Comandos:</b> <code>docker pull</code>, <code>docker images</code>, <code>docker run</code>, <code>docker ps -a</code>, <code>docker stop</code>, <code>docker rm</code>, <code>docker rmi</code>, <code>docker logs</code> y <code>docker exec -it contenedor bash</code>. Opciones de <code>run</code>: <code>-d</code> (segundo plano), <code>-it</code> (interactivo), <code>-p host:contenedor</code> (puertos), <code>-v ruta:ruta</code> (volumen), <code>--name</code>, <code>--rm</code>.</p><p><code>EXPOSE</code> no publica el puerto por sí solo: hace falta <code>-p</code>. Para subir una imagen a Docker Hub: <code>docker login</code>, <code>docker tag</code> y <code>docker push usuario/repo:etiqueta</code>.</p>',
    ref: DE('bloque4:docker', 'Bloque 4 · Docker (abrilcode)'),
    quiz: [
      { q: '¿Qué es una imagen Docker?', o: ['Un contenedor en ejecución', 'Una plantilla de solo lectura para crear contenedores', 'Una foto del servidor', 'Un volumen'], a: 1, e: 'De una imagen salen uno o varios contenedores.' },
      { q: '¿Qué hace "docker run -d -p 8080:80 httpd"?', o: ['Borra la imagen', 'Lanza un contenedor en segundo plano y mapea el puerto 8080 del host al 80', 'Construye la imagen', 'Abre una shell'], a: 1, e: '-p va host:contenedor.' },
      { q: 'Instrucción del Dockerfile que se ejecuta al arrancar el contenedor:', o: ['RUN', 'FROM', 'CMD', 'COPY'], a: 2, e: 'RUN se ejecuta durante la construcción.' },
      { q: '¿Qué comando lista todos los contenedores, incluso parados?', o: ['docker images', 'docker ps -a', 'docker list', 'docker rm'], a: 1, e: 'Sin -a solo muestra los que están en marcha.' }
    ]
  }, { t: 'Une comando y función', tipo: 'parejas', data: {
    intro: 'Relaciona cada comando de Docker con lo que hace.',
    pares: [['docker pull', 'Descarga una imagen'], ['docker build -t', 'Construye una imagen desde un Dockerfile'], ['docker ps -a', 'Lista todos los contenedores'], ['docker exec -it', 'Abre una shell en un contenedor en marcha'], ['docker logs', 'Muestra los registros'], ['docker push', 'Sube una imagen a Docker Hub']] } });

  A('despliegue', {
    t: 'Docker Compose: varios servicios a la vez',
    h: '<p><b>Docker Compose</b> define y ejecuta <b>varios contenedores como un único servicio</b> con sus redes y volúmenes, en un fichero <code>docker-compose.yml</code>. Secciones: <code>services</code> (cada servicio con <code>image</code> o <code>build</code>, <code>ports</code>, <code>environment</code>, <code>volumes</code>, <code>networks</code>), <code>networks</code> y <code>volumes</code>.</p><pre>services:\n  db:\n    image: mariadb\n    environment:\n      MARIADB_ROOT_PASSWORD: clave\n    volumes:\n      - datos:/var/lib/mysql\n  www:\n    build: .\n    ports:\n      - "8080:80"\nvolumes:\n  datos:</pre><p>Comandos: <code>docker compose up -d</code> levanta todo en segundo plano y <code>docker compose down</code> lo para y elimina. En Compose v2 se escribe con <b>espacio</b> (<code>docker compose</code>) y el campo <code>version</code> está obsoleto.</p><p>Un <b>volumen</b> conserva los datos aunque se borre el contenedor, y los servicios de la misma red se comunican por el <b>nombre del servicio</b> (por ejemplo, <code>db</code>).</p>',
    ref: DE('bloque4:docker', 'Bloque 4 · Docker Compose (abrilcode)'),
    quiz: [
      { q: '¿Qué comando levanta todos los servicios en segundo plano?', o: ['docker compose start', 'docker compose up -d', 'docker run -d', 'docker compose build'], a: 1, e: 'down los para y elimina.' },
      { q: '¿Para qué sirve un volumen?', o: ['Para subir el volumen del audio', 'Para conservar datos aunque se borre el contenedor', 'Para limitar la CPU', 'Para cifrar'], a: 1, e: 'Se declara en volumes y se monta en el servicio.' },
      { q: '¿Cómo se comunica el servicio www con la base db en la misma red?', o: ['Por el nombre del servicio (db)', 'Por la MAC', 'No pueden', 'Solo por IP pública'], a: 0, e: 'Compose crea una red con resolución de nombres.' },
      { q: 'Fichero de configuración de Compose:', o: ['Dockerfile', 'docker-compose.yml', 'compose.sh', 'daemon.json'], a: 1, e: 'Describe imágenes, puertos, variables, redes y volúmenes.' }
    ]
  }, { t: 'Completa el fichero Compose', tipo: 'hueco', data: {
    intro: 'Elige la clave correcta de docker-compose.yml.',
    code: '[[0]]:\n  web:\n    image: httpd\n    [[1]]:\n      - "8080:80"\n    [[2]]:\n      - ./web:/usr/local/apache2/htdocs',
    huecos: [{ o: ['services', 'containers', 'apps'], a: 0 }, { o: ['ports', 'expose-all', 'open'], a: 0 }, { o: ['volumes', 'files', 'copy'], a: 0 }] } });
})();
