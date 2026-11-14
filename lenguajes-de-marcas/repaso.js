/* Test rápido y flashcards por tema, dentro de la portada de Lenguaje de Marcas */
(function(){
const TEST={
 t1:[{q:'¿Qué significa XML?',o:['eXtensible Markup Language','Extra Modern Link','Xtra Markup Language','X Multimedia Language'],a:0,e:'XML son las siglas de eXtensible Markup Language.'},
     {q:'¿Qué hace que un documento XML esté bien formado?',o:['Tener una sola raíz y todas las etiquetas cerradas','Usar solo mayúsculas','Tener estilos CSS','Que el navegador lo muestre'],a:0,e:'Bien formado = una raíz, etiquetas cerradas y bien anidadas.'},
     {q:'¿Qué puerto usa HTTPS por defecto?',o:['80','443','21','25'],a:1,e:'HTTP usa el 80 y HTTPS el 443.'},
     {q:'¿Qué sintaxis es un comentario válido en XML?',o:['// comentario','<!-- comentario -->','/* comentario */','# comentario'],a:1,e:'En XML los comentarios van entre <!-- y -->.'},
     {q:'¿Para qué sirve un espacio de nombres (namespace)?',o:['Para dar estilo a la página','Para evitar confusiones entre etiquetas con el mismo nombre','Para cifrar el documento','Para acelerar la carga'],a:1,e:'Los namespaces distinguen etiquetas de vocabularios distintos.'}],
 t2:[{q:'¿Qué atributo indica el destino de un enlace <a>?',o:['src','href','link','url'],a:1,e:'href indica el destino del enlace.'},
     {q:'¿Qué atributo describe una imagen para lectores de pantalla?',o:['title','alt','name','desc'],a:1,e:'alt es el texto alternativo de la imagen.'},
     {q:'¿Qué etiqueta crea una lista ordenada numerada?',o:['<ul>','<ol>','<li>','<dl>'],a:1,e:'<ol> es lista ordenada; <ul>, desordenada.'},
     {q:'¿Qué declaración va al principio de un documento HTML5?',o:['<html5>','<!DOCTYPE html>','<head>','<meta>'],a:1,e:'<!DOCTYPE html> indica HTML5.'},
     {q:'¿Qué etiqueta semántica agrupa la navegación principal?',o:['<nav>','<div>','<span>','<font>'],a:0,e:'<nav> agrupa los enlaces de navegación.'}],
 t3:[{q:'¿Qué selector tiene más especificidad?',o:['p','.clase','#id','*'],a:2,e:'Un id pesa más que una clase, y una clase más que un elemento.'},
     {q:'¿Qué propiedad controla el espacio interior de una caja?',o:['margin','padding','border','outline'],a:1,e:'padding es el espacio entre el contenido y el borde.'},
     {q:'¿Qué hace box-sizing: border-box?',o:['Quita el borde','El ancho incluye padding y borde','Dibuja un marco','Ajusta la fuente'],a:1,e:'Con border-box el padding y el borde caben dentro del width.'},
     {q:'¿Qué valor centra horizontalmente un bloque con ancho fijo?',o:['margin: 0 auto','padding: auto','text-align: block','float: 0'],a:0,e:'margin: 0 auto reparte el espacio libre a los dos lados.'},
     {q:'¿Qué diferencia hay entre display:none y visibility:hidden?',o:['Ninguna','display:none quita el elemento del diseño; visibility:hidden lo oculta pero deja su espacio','visibility quita el elemento','display conserva el espacio'],a:1,e:'display:none no ocupa espacio; visibility:hidden sí.'}]
};

const FLASH={
 t1:[["¿Qué es XML?","Un lenguaje de marcas extensible: tú defines las etiquetas para describir datos."],["¿Qué significa que un XML esté «bien formado»?","Tiene una sola raíz, todas las etiquetas cerradas y bien anidadas."],["¿Para qué sirve un namespace?","Para distinguir etiquetas con el mismo nombre de vocabularios distintos."],["¿Qué define un DTD o un XML Schema?","La estructura válida del documento: qué elementos y atributos puede tener."],["¿Qué es un comentario en XML?","<!-- texto -->. El analizador lo ignora."],["¿Qué es una dirección IP?","Un identificador numérico de un equipo en una red IP."],["¿Qué hace un servidor DNS?","Traduce nombres de dominio (ejemplo.com) a direcciones IP."],["¿Qué añade HTTPS frente a HTTP?","Cifrado (TLS). Usa el puerto 443 por defecto; HTTP usa el 80."]],
 t2:[["¿Para qué sirve <!DOCTYPE html>?","Indica al navegador que el documento es HTML5."],["¿Cuál es la diferencia entre id y class?","id es único en la página; class puede repetirse en varios elementos."],["¿Para qué sirve <meta charset=\"utf-8\">?","Indica la codificación de caracteres, para que las tildes y la ñ se vean bien."],["¿Qué hace el atributo alt de una imagen?","Ofrece un texto alternativo para lectores de pantalla y si la imagen no carga."],["¿Qué es un elemento de bloque?","Ocupa una línea entera, como <div> o <p>. Un elemento en línea, como <span> o <a>, solo ocupa su contenido."],["¿Qué etiquetas semánticas conoces?","header, nav, main, section, article, footer."],["¿Qué hace target=\"_blank\" en un enlace?","Abre el enlace en una pestaña nueva."],["¿Diferencia entre ruta absoluta y relativa?","La absoluta es la URL completa o desde la raíz; la relativa parte de la carpeta del archivo actual."]],
 t3:[["¿Qué es CSS?","El lenguaje que define el aspecto visual de la página. Separa contenido (HTML) y presentación."],["¿Cómo se escribe una regla CSS?","selector { propiedad: valor; }"],["¿Cuáles son las tres formas de aplicar CSS?","En línea (atributo style), interna (bloque <style>) y externa (archivo .css con <link>). La externa es la recomendada."],["¿Qué decide la cascada?","El origen, después la especificidad y, si empatan, el orden de aparición."],["¿Qué selector tiene más especificidad?","El id (#) pesa más que la clase (.) o el atributo, y estos más que el elemento."],["¿Cuáles son las cuatro capas de una caja?","Contenido, padding, border y margin, de dentro hacia fuera."],["¿Qué hace box-sizing: border-box?","Hace que el width incluya el padding y el borde."],["¿Qué valores tiene position?","static (por defecto), relative, absolute, fixed y sticky."]]
};
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const st=document.createElement('style');
st.textContent='.rp-preg{border:1px solid var(--linea);border-radius:10px;margin:10px 0;padding:8px 12px}.rp-preg label{display:block;padding:4px 0}.rp-card{border:1px solid var(--linea);border-radius:12px;padding:18px;min-height:120px;background:var(--hoja);margin:12px 0}.rp-card .lado{font-size:1.02rem}.rp-card small{color:var(--suave)}.rp-fila{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.rp-fila button{min-height:40px;padding:8px 12px;border-radius:8px;border:1px solid var(--linea);background:var(--cs);color:inherit;cursor:pointer}.rp-fila button.p{background:var(--c);color:#fff;border-color:var(--c)}';
document.head.appendChild(st);
const NOM={t1:'Tema 1 · XML',t2:'Tema 2 · HTML',t3:'Tema 3 · CSS'};
function montar(el,t){
  el.innerHTML=`<details class="fold"><summary><span><b>Test rápido</b><small>5 preguntas al azar · ${NOM[t]}</small></span></summary><div class="in">
    <p class="sub">Marca una opción en cada pregunta y pulsa «Corregir».</p>
    <div data-test></div>
    <div class="rp-fila"><button type="button" data-nuevas>Nuevas preguntas</button><button type="button" class="p" data-ok>Corregir</button></div>
    <p class="pista" data-res></p></div></details>
  <details class="fold"><summary><span><b>Flashcards</b><small>Repasa los conceptos del tema</small></span></summary><div class="in">
    <div class="rp-card" data-card></div>
    <div class="rp-fila"><button type="button" data-prev>Anterior</button><button type="button" data-flip>Dar la vuelta</button><button type="button" data-next>Siguiente</button><button type="button" data-shuffle>Barajar</button></div>
    <p class="sub" data-count></p></div></details>`;
  let preg=[];
  function test(){
    preg=shuffle(TEST[t]).slice(0,5).map(p=>({...p,ops:shuffle(p.o.map((o,i)=>({o,i})))}));
    el.querySelector('[data-test]').innerHTML=preg.map((p,k)=>`<fieldset class="rp-preg"><legend>${k+1}. ${esc(p.q)}</legend>${p.ops.map(x=>`<label><input type="radio" name="rq${t}${k}" value="${x.i}"> ${esc(x.o)}</label>`).join('')}</fieldset>`).join('');
    el.querySelector('[data-res]').textContent='';
  }
  function corregir(){
    let n=0;const notas=[];
    preg.forEach((p,k)=>{const sel=el.querySelector(`input[name="rq${t}${k}"]:checked`);const ok=sel&&Number(sel.value)===p.a;if(ok)n++;notas.push((ok?'✔ ':'✘ ')+esc(p.q)+' — '+esc(p.e))});
    el.querySelector('[data-res]').innerHTML=`<b>${n} de ${preg.length} correctas.</b><br>`+notas.join('<br>');
  }
  el.querySelector('[data-nuevas]').onclick=test;
  el.querySelector('[data-ok]').onclick=corregir;
  test();
  // Flashcards
  let cards=FLASH[t].slice(),i=0,dado=false;
  const card=el.querySelector('[data-card]'),cnt=el.querySelector('[data-count]');
  function pinta(){
    const [f,d]=cards[i];
    card.innerHTML=dado?`<small>Respuesta</small><div class="lado">${esc(d)}</div>`:`<small>Pregunta</small><div class="lado"><b>${esc(f)}</b></div>`;
    cnt.textContent=`Tarjeta ${i+1} de ${cards.length}`;
  }
  el.querySelector('[data-prev]').onclick=()=>{i=(i-1+cards.length)%cards.length;dado=false;pinta()};
  el.querySelector('[data-next]').onclick=()=>{i=(i+1)%cards.length;dado=false;pinta()};
  el.querySelector('[data-flip]').onclick=()=>{dado=!dado;pinta()};
  el.querySelector('[data-shuffle]').onclick=()=>{cards=shuffle(cards);i=0;dado=false;pinta()};
  card.onclick=()=>{dado=!dado;pinta()};
  pinta();
}
document.querySelectorAll('[data-repaso]').forEach(el=>montar(el,el.dataset.repaso));
})();
