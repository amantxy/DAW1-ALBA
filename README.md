# DAW 1 · ALBA

Material de estudio de DAW 1. Una carpeta por asignatura y, dentro de cada una, sus HTML.

**[Abrir la página de inicio](https://amantxy.github.io/DAW1-ALBA/)**

## Asignaturas

### [Programación](programacion/README.md)

- [1-PROGRAMACION.html](https://amantxy.github.io/DAW1-ALBA/programacion/1-PROGRAMACION.html) · Apuntes por temas (UT 1, 2 y 3), ejercicios, libro, flashcards y práctica interactiva

### [Lenguaje de Marcas](lenguajes-de-marcas/README.md)

- [1-LDM-HTML-Teoriaypractica.html](https://amantxy.github.io/DAW1-ALBA/lenguajes-de-marcas/1-LDM-HTML-Teoriaypractica.html) · HTML teoría y práctica: plan de 6 días, flashcards, test y ejercicios para el examen del 9 de noviembre

### [Bases de Datos](bases-de-datos/README.md)

- [Tema 1: Fundamentos](https://amantxy.github.io/DAW1-ALBA/bases-de-datos/tema-1.html) · Teoría con sus imágenes
- [Tema 2: Diseño conceptual y lógico](https://amantxy.github.io/DAW1-ALBA/bases-de-datos/tema-2.html) · Teoría con sus imágenes
- [Tema 3: Modelo Relacional](https://amantxy.github.io/DAW1-ALBA/bases-de-datos/tema-3.html) · Teoría con sus imágenes
- [Ponte a prueba](https://amantxy.github.io/DAW1-ALBA/bases-de-datos/ponte-a-prueba.html) · 100 preguntas tipo test por tema, por niveles, en tests de 40

### [Sistemas Informáticos](sistemas-informaticos/README.md)

- [Temario, guía de Ubuntu Server y Ponte a prueba](https://amantxy.github.io/DAW1-ALBA/sistemas-informaticos/index.html)

### [Transformación del Sistema Productivo](transformacion/README.md)

- [Temario de las UT1, UT2 y UT3](https://amantxy.github.io/DAW1-ALBA/transformacion/index.html) · Teoría, actividades y exámenes

### [Entornos de Desarrollo](entornos-de-desarrollo/README.md)

Aún sin contenido.

### [Inglés Profesional](ingles-profesional/README.md)

- [Temario de 10 unidades](https://amantxy.github.io/DAW1-ALBA/ingles-profesional/index.html) · Vocabulario, lectura, gramática, speaking, writing y ejercicios

## Estructura

| Asignatura | Carpeta | HTML |
| --- | --- | --- |
| Programación | `programacion/` | `1-PROGRAMACION.html` |
| Lenguaje de Marcas | `lenguajes-de-marcas/` | `1-LDM-HTML-Teoriaypractica.html` |
| Bases de Datos | `bases-de-datos/` | `tema-1.html` |
| Sistemas Informáticos | `sistemas-informaticos/` | `ut1-hardware.html` … `ut10-windows-red.html`, `ubuntu-server-virtualbox.html`, `ponte-a-prueba.html` |
| Transformación del Sistema Productivo | `transformacion/` | `ut1.html`, `ut2.html`, `ut3.html` |
| Entornos de Desarrollo | `entornos-de-desarrollo/` | `desarrollo-software.html` |
| Inglés Profesional | `ingles-profesional/` | `unidad-01.html` a `unidad-10.html` |

## Mis documentos

`docs.html` guarda los documentos en Supabase, en una carpeta privada a la que solo se accede con tu cuenta. `progreso.js` guarda también en tu cuenta el progreso de las páginas de estudio.

1. Ejecuta `supabase/esquema.sql` en el SQL Editor de Supabase.
2. Crea tu usuario en Authentication > Users y desactiva los registros nuevos en los ajustes de Authentication.
3. La URL del proyecto y la clave publishable van en `supabase-config.js`. Nunca pongas ahí la clave secret.

## Acceso con aprobación

Todas las páginas cargan `acceso.js`, que oculta el contenido hasta que entra una cuenta **aprobada**.

- **Entrar:** nick (o correo) y contraseña. Internamente el nick es `nick@acceso.invalid`; no se envía ningún correo.
- **Solicitar acceso:** nick, quién eres y contraseña. La función `solicitar-acceso` crea la cuenta como *pendiente*.
- **Panel `admin.html` («Accesos» en la portada):** solo la administradora. Aprueba, rechaza, quita acceso y pone una contraseña nueva a otra persona (función `admin-clave`).
- **Mi cuenta:** cada persona cambia su propia contraseña.
- Las contraseñas nunca se guardan en el repositorio; las gestiona Supabase Auth.
- Es un muro de acceso en el navegador, no una caja fuerte: las páginas siguen en un repositorio público.
