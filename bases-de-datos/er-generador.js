/* Genera ejercicios de modelo E-R al azar, con enunciado y solución modelo, por niveles.
   Cardinalidad [A,B]: cada valor va junto a su entidad, como en clase. */
window.ER_GEN=(function(){
"use strict";
function E(n,pl,g,a,x){return Object.assign({n:n,pl:pl,g:g,a:a},x||{})}
function R(a,b,n,vab,vba,c,at){return{a:a,b:b,n:n,vab:vab,vba:vba,c:c,at:at||[]}}
var NM=[["(0,n)","(1,n)"],["(1,n)","(1,n)"],["(0,n)","(0,n)"]];
var D=[
{t:"una tienda en línea",ent:[E("Cliente","clientes","m",["DNI|NIF","Nombre","Email|Correo"],{multi:"Teléfono"}),E("Pedido","pedidos","m",["Número","Fecha"],{der:"Total"}),E("Producto","productos","m",["Referencia","Nombre","Precio"]),E("Categoría","categorías","f",["Código","Nombre"])],
 rel:[R(0,1,"Hace","hace","es de",[["(1,1)","(0,n)"],["(1,1)","(1,n)"]]),R(1,2,"Contiene","contiene","aparece en",[["(0,n)","(1,n)"]],["Cantidad"]),R(2,3,"Pertenece","pertenece a","agrupa",[["(0,n)","(1,1)"],["(1,n)","(1,1)"]])]},
{t:"una biblioteca",ent:[E("Socio","socios","m",["Número","Nombre"],{multi:"Teléfono"}),E("Libro","libros","m",["ISBN","Título"]),E("Editorial","editoriales","f",["CIF","Nombre"]),E("Autor","autores","m",["Código","Nombre"])],
 rel:[R(0,1,"Presta","tiene en préstamo","se presta a",[["(0,n)","(0,n)"]],["Fecha"]),R(1,2,"Publica","es publicado por","publica",[["(1,n)","(1,1)"],["(0,n)","(1,1)"]]),R(1,3,"Escribe","es escrito por","escribe",[["(1,n)","(1,n)"]])]},
{t:"un hospital",ent:[E("Médico","médicos","m",["Número de colegiado|Colegiado","Nombre"]),E("Paciente","pacientes","m",["DNI|NIF","Nombre","Fecha de nacimiento|FechaNac|Nacimiento"],{der:"Edad",multi:"Teléfono"}),E("Especialidad","especialidades","f",["Código","Nombre"]),E("Medicamento","medicamentos","m",["Código","Nombre"])],
 rel:[R(0,1,"Atiende","atiende a","es atendido por",[["(1,n)","(0,n)"]],["Fecha"]),R(0,2,"Tiene","tiene","es de",[["(1,n)","(1,1)"]]),R(1,3,"Toma","toma","es tomado por",[["(0,n)","(0,n)"]],["Dosis"])],
 ter:{n:"Receta",idx:[0,1,3],c:["(1,1)","(1,n)","(1,n)"],txt:"Un médico receta medicamentos a pacientes: cada paciente recibe cada medicamento de un solo médico, un médico puede recetarlo a varios pacientes y a un paciente le pueden recetar varios medicamentos. Dibuja una única relación que una las tres entidades."}},
{t:"un instituto",ent:[E("Alumno","alumnos","m",["Expediente","Nombre"],{multi:"Teléfono"}),E("Asignatura","asignaturas","f",["Código","Nombre"]),E("Profesor","profesores","m",["NIF|DNI","Nombre"]),E("Departamento","departamentos","m",["Código","Nombre"]),E("Examen","exámenes","m",["Código","Fecha"])],
 rel:[R(0,1,"Cursa","cursa","es cursada por",[["(1,n)","(1,n)"]],["Nota"]),R(2,1,"Imparte","imparte","es impartida por",[["(1,1)","(1,n)"],["(1,1)","(0,n)"]]),R(2,3,"Trabaja","trabaja en","tiene",[["(1,n)","(1,1)"]])],
 ter:{n:"Examina",idx:[2,0,4],c:["(1,1)","(1,n)","(1,n)"],txt:"Un profesor examina a alumnos de exámenes: cada alumno hace cada examen con un solo profesor, un profesor puede examinar a varios alumnos y un alumno puede hacer varios exámenes. Dibuja una única relación que una las tres entidades."}},
{t:"una cadena de cines",ent:[E("Cine","cines","m",["CIF","Nombre"]),E("Sala","salas","f",["Número","Aforo"]),E("Película","películas","f",["Código","Título"]),E("Director","directores","m",["Código","Nombre"])],
 rel:[R(0,1,"Tiene","tiene","está en",[["(1,1)","(1,n)"]]),R(1,2,"Proyecta","proyecta","se proyecta en",[["(0,n)","(0,n)"]],["Fecha"]),R(2,3,"Dirige","es dirigida por","dirige",[["(1,n)","(1,1)"]])],deb:{i:1,de:0,r:0,pk:"Número"}},
{t:"una liga de fútbol",ent:[E("Equipo","equipos","m",["Nombre","Ciudad"]),E("Jugador","jugadores","m",["DNI|NIF","Nombre"],{der:"Edad"}),E("Entrenador","entrenadores","m",["DNI|NIF","Nombre"]),E("Estadio","estadios","m",["Código","Aforo"])],
 rel:[R(0,1,"Tiene","tiene en plantilla a","juega en",[["(1,1)","(1,n)"]]),R(0,2,"Dirige","es dirigido por","dirige",[["(1,1)","(1,1)"]]),R(0,3,"Juega","juega como local en","es la sede de",[["(1,n)","(1,1)"]])]},
{t:"una cadena de hoteles",ent:[E("Hotel","hoteles","m",["CIF","Nombre"]),E("Habitación","habitaciones","f",["Número","Precio"]),E("Cliente","clientes","m",["DNI|NIF","Nombre"],{multi:"Teléfono"}),E("Ciudad","ciudades","f",["Código","Nombre"])],
 rel:[R(0,1,"Tiene","tiene","está en",[["(1,1)","(1,n)"]]),R(2,1,"Reserva","reserva","es reservada por",[["(0,n)","(0,n)"]],["Fecha"]),R(0,3,"Situado","está situado en","tiene",[["(0,n)","(1,1)"],["(1,n)","(1,1)"]])],deb:{i:1,de:0,r:0,pk:"Número"}},
{t:"una empresa",ent:[E("Departamento","departamentos","m",["Código","Nombre"]),E("Empleado","empleados","m",["NIF|DNI","Nombre"],{multi:"Teléfono"}),E("Proyecto","proyectos","m",["Código","Título"]),E("Hijo","hijos","m",["Nombre","Fecha de nacimiento|FechaNac|Nacimiento"])],
 rel:[R(0,1,"Trabaja","tiene","trabaja en",[["(1,1)","(1,n)"]]),R(1,2,"Participa","participa en","tiene",[["(0,n)","(1,n)"],["(1,n)","(1,n)"]],["Horas"]),R(1,3,"Tiene","tiene","es hijo de",[["(1,1)","(0,n)"]])],deb:{i:3,de:1,r:2,pk:"Nombre"},
 ref:{i:1,n:"Es jefe de",c:["(0,1)","(0,n)"],txt:"Un empleado puede ser jefe de varios empleados o de ninguno, y cada empleado tiene como mucho un jefe."},
 jer:{sup:1,subs:[E("Técnico","técnicos","m",["Especialidad"]),E("Comercial","comerciales","m",["Comisión"])],txt:"Hay dos tipos de empleado: técnicos, de los que guardamos la especialidad, y comerciales, de los que guardamos la comisión. Represéntalos con una jerarquía (triángulo)."}},
{t:"un taller mecánico",ent:[E("Cliente","clientes","m",["DNI|NIF","Nombre"],{multi:"Teléfono"}),E("Vehículo","vehículos","m",["Matrícula","Modelo"]),E("Reparación","reparaciones","f",["Número","Fecha"],{der:"Importe"}),E("Mecánico","mecánicos","m",["DNI|NIF","Nombre"])],
 rel:[R(0,1,"Posee","tiene","es de",[["(1,1)","(1,n)"],["(1,1)","(0,n)"]]),R(1,2,"Recibe","recibe","se hace a",[["(1,1)","(0,n)"]]),R(3,2,"Realiza","realiza","es realizada por",[["(1,n)","(0,n)"]],["Horas"])]},
{t:"una clínica veterinaria",ent:[E("Dueño","dueños","m",["DNI|NIF","Nombre"],{multi:"Teléfono"}),E("Mascota","mascotas","f",["Chip","Nombre","Fecha de nacimiento|FechaNac|Nacimiento"],{der:"Edad"}),E("Veterinario","veterinarios","m",["Número de colegiado|Colegiado","Nombre"]),E("Vacuna","vacunas","f",["Código","Nombre"])],
 rel:[R(0,1,"Tiene","tiene","es de",[["(1,1)","(1,n)"]]),R(2,1,"Atiende","atiende a","es atendida por",[["(1,n)","(0,n)"]],["Fecha"]),R(1,3,"Recibe","recibe","se pone a",[["(0,n)","(0,n)"]],["Fecha"])]},
{t:"una aerolínea",ent:[E("Avión","aviones","m",["Matrícula","Modelo"]),E("Vuelo","vuelos","m",["Código","Fecha"]),E("Pasajero","pasajeros","m",["Pasaporte","Nombre"]),E("Piloto","pilotos","m",["Licencia","Nombre"])],
 rel:[R(0,1,"Realiza","realiza","se hace con",[["(1,1)","(0,n)"]]),R(2,1,"Viaja","viaja en","lleva a",[["(0,n)","(0,n)"]],["Asiento"]),R(3,1,"Pilota","pilota","es pilotado por",[["(1,n)","(0,n)"]])]},
{t:"un gimnasio",ent:[E("Socio","socios","m",["DNI|NIF","Nombre"],{multi:"Teléfono"}),E("Clase","clases","f",["Código","Nombre"]),E("Monitor","monitores","m",["DNI|NIF","Nombre"]),E("Sala","salas","f",["Número","Aforo"])],
 rel:[R(0,1,"Asiste","asiste a","tiene como alumno a",[["(0,n)","(0,n)"]],["Fecha"]),R(2,1,"Imparte","imparte","es impartida por",[["(1,1)","(1,n)"],["(1,1)","(0,n)"]]),R(1,3,"Usa","se da en","acoge",[["(0,n)","(1,1)"]])]}
];
function az(L){return L[Math.floor(Math.random()*L.length)]}
function mezcla(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function base(s){return s.split("|")[0]}
function minus(s){return /^[A-ZÁÉÍÓÚ]{2,}$/.test(s)?s:s.charAt(0).toLowerCase()+s.slice(1)}
function art(e){return e.g==="f"?"una":"un"}
function cada(e){return"cada "+minus(e.n)}
function cuant(c,e){var f=e.g==="f",n=minus(e.n),p=e.pl;switch(c){case"(1,1)":return art(e)+" "+n;case"(0,1)":return"como mucho "+art(e)+" "+n;case"(1,n)":return(f?"una o varias ":"uno o varios ")+p;default:return(f?"varias ":"varios ")+p+(f?" o ninguna":" o ninguno")}}
function may(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function fraseAtr(e,pk,attrs){var ps=attrs.map(function(a){return"su "+minus(base(a))+(a===pk?" (lo identifica)":"")});var u=ps.length>1?ps.slice(0,-1).join(", ")+" y "+ps[ps.length-1]:ps[0];return"De "+cada(e)+" guardamos "+u+"."}
function esNM(r,c){return c[0].slice(-2)==="n)"&&c[1].slice(-2)==="n)"}
function colocar(ents,con){var pos={},ocup={},cola=[0];pos[0]=[0,0];ocup["0,0"]=1;function libre(x,y){return!ocup[x+","+y]}while(cola.length){var i=cola.shift(),p=pos[i],h=con.filter(function(c){return c[0]===i||c[1]===i}).map(function(c){return c[0]===i?c[1]:c[0]}).filter(function(j){return pos[j]===undefined});h.forEach(function(j){var op=[[p[0]+1,p[1]],[p[0],p[1]+1],[p[0]+1,p[1]+1],[p[0]+2,p[1]]],q=op.filter(function(o){return libre(o[0],o[1])})[0];pos[j]=q;ocup[q[0]+","+q[1]]=1;cola.push(j)})}ents.forEach(function(_,i){if(!pos[i]){var y=2;while(!libre(0,y))y++;pos[i]=[0,y];ocup["0,"+y]=1}});return pos}
function nuevo(niv){var dom,sel=[],rels=[],tries=0,extra=null;
 while(tries++<200){dom=az(D);rels=[];extra=null;
  if(niv==="F"){var cand=dom.rel.filter(function(r){return!r.at.length&&!esNM(r,r.c[0])&&(!dom.deb||dom.deb.i!==r.a&&dom.deb.i!==r.b)});if(!cand.length)continue;rels=[az(cand)];break}
  var n=niv==="M"?2:3,rs=mezcla(dom.rel).filter(function(r){return!(dom.deb&&niv==="M"&&(dom.deb.i===r.a||dom.deb.i===r.b))});
  if(niv==="M"){var nm=rs.filter(function(r){return r.at.length});if(!nm.length)continue;rels=[az(nm)];var ot=rs.filter(function(r){return r!==rels[0]&&(r.a===rels[0].a||r.b===rels[0].b||r.a===rels[0].b||r.b===rels[0].a)});if(!ot.length)continue;rels.push(az(ot));break}
  var ops=[];if(dom.deb)ops.push("deb");if(dom.ref)ops.push("ref");if(dom.jer)ops.push("jer");if(dom.ter)ops.push("ter");if(!ops.length)continue;extra=az(ops);rels=dom.rel.slice();break}
 var usados={};rels.forEach(function(r){usados[r.a]=1;usados[r.b]=1});if(extra==="ref")usados[dom.ref.i]=1;if(extra==="jer")usados[dom.jer.sup]=1;if(extra==="ter")dom.ter.idx.forEach(function(i){usados[i]=1});
 var idx=Object.keys(usados).map(Number).sort(function(a,b){return a-b}),map={};idx.forEach(function(v,i){map[v]=i});
 var extraM=niv!=="F"&&Math.random()<.7,ents=[],frases=[];
 idx.forEach(function(v){var e=dom.ent[v],at=e.a.slice(),o={n:e.n,a:at.slice(),pk:[e.a[0]]};if(extra==="deb"&&dom.deb.i===v){o.deb=1;o.pk=[e.a.filter(function(x){return base(x)===dom.deb.pk})[0]]}
  var ax=at.slice();if(extraM&&e.multi){o.a.push(e.multi);o.multi=[e.multi]}if(extraM&&e.der){o.a.push(e.der);o.der=[e.der]}ents.push(o);
  var fr=fraseAtr(e,o.deb?null:o.pk[0],at);if(o.multi)fr=fr.slice(0,-1)+". También sus "+minus(e.multi)+"s, porque puede tener varios.";if(o.der)fr=fr.slice(0,-1)+". "+{Edad:"La edad",Total:"El total",Importe:"El importe"}[e.der]+" se calcula a partir de otros datos, así que es derivado.";frases.push(fr)});
 var R2=[],con=[];rels.forEach(function(r){var c=az(r.c);R2.push({n:r.n,con:[[dom.ent[r.a].n,c[0]],[dom.ent[r.b].n,c[1]]],a:r.at.slice()});con.push([map[r.a],map[r.b]]);var A=dom.ent[r.a],B=dom.ent[r.b];var s=may(cada(A))+" "+r.vab+" "+cuant(c[1],B)+", y "+cada(B)+" "+r.vba+" "+cuant(c[0],A)+".";if(r.at.length)s+=" De esa relación hay que guardar "+{Fecha:"la fecha",Cantidad:"la cantidad",Nota:"la nota",Dosis:"la dosis",Horas:"las horas",Asiento:"el asiento"}[r.at[0]]+".";frases.push(s)});
 var ej={id:"azar",niv:niv,azar:1,tit:may(dom.t),ent:ents,rel:R2};
 if(extra==="deb"){var dd=dom.deb,hj=dom.ent[dd.i],pa=dom.ent[dd.de];frases.push(may(art(hj))+" "+minus(hj.n)+" no tiene sentido sin "+(pa.g==="f"?"su ":"su ")+minus(pa.n)+", así que es una entidad débil. Dentro de cada "+minus(pa.n)+" se distingue por su "+minus(dd.pk)+".")}
 if(extra==="ref"){var ri=dom.ref,en=dom.ent[ri.i];ej.rel.push({n:ri.n,con:[[en.n,ri.c[0]],[en.n,ri.c[1]]],a:[]});frases.push(ri.txt)}
 if(extra==="ter"){var t=dom.ter;ej.rel.push({n:t.n,con:t.idx.map(function(v,i){return[dom.ent[v].n,t.c[i]]}),a:[]});t.idx.slice(1).forEach(function(v){con.push([map[t.idx[0]],map[v]])});frases.push(t.txt)}
 if(extra==="jer"){var j=dom.jer,sup=dom.ent[j.sup];ej.jer=[{sup:sup.n,subs:j.subs.map(function(s){return s.n})}];j.subs.forEach(function(s){ents.push({n:s.n,a:s.a.slice()});con.push([map[j.sup],ents.length-1])});frases.push(j.txt)}
 var pos=colocar(ents,con);ents.forEach(function(e,i){e.p=pos[i]});
 ej.enun="Vamos a diseñar la base de datos de "+dom.t+". "+frases.join(" ");return ej}
return{nuevo:nuevo}})();
