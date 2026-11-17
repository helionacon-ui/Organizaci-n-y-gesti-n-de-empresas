/* Organización y Gestión de Empresas: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;

/* T1 punto muerto */
var CF=20000,cv=30;
M.reg('oge-t1',M.curva({title:'La empresa: umbral de rentabilidad',H:560,dur:18,p:[40,90],ax:{xr:[0,2100],yr:[0,100000],xt:[500,1000,1500,2000],yt:[20000,40000,60000,80000,100000],xd:0,yf:function(v){return nf(v/1000,0)+' k€';},xl:'unidades',yl:'€'},h:300,
 curvas:[{f:function(q){return CF+cv*q;},c:'g',fija:true},{f:function(q,p){return p*q;},c:'f'}],
 extra:function(D,A,p){D.line(A.X(0),A.Y(CF),A.X(2100),A.Y(CF),C.mut,1,[4,4]);D.text('costes fijos',A.X(2050),A.Y(CF)+16,{s:14,c:C.mut,a:'right'});var q0=CF/(p-cv);if(q0<2100){D.dot(A.X(q0),A.Y(p*q0),7,C.hl);D.line(A.X(q0),A.Y(0),A.X(q0),A.Y(p*q0),C.hl,1.4,[4,3]);}
  D.text('ingresos',A.X(1300),A.Y(Math.min(p*1300,98000))-10,{s:15,c:C.f});D.text('costes totales',A.X(2050),A.Y(CF+cv*2050)+18,{s:15,c:C.g,a:'right'});},
 read:function(p){return ['precio = '+nf(p,0)+' €    coste variable = 30 €/u    CF = 20 000 €','punto muerto: Q* = CF/(p − c_{v}) = '+nf(CF/(p-cv),0)+' unidades'];},
 caps:[[6,'Los costes totales son fijos (alquiler, sueldos de estructura) más variables, proporcionales a lo que se produce.'],[12,'El punto muerto o umbral de rentabilidad es la cantidad en la que los ingresos igualan a los costes: <i>Q* = CF/(p − c<sub>v</sub>)</i>.'],[99,'Por debajo de Q* hay pérdidas y por encima beneficios. Subir el precio aumenta el margen por unidad y baja el umbral.']]}));

/* T2 las cinco fuerzas de Porter */
M.reg('oge-t2',M.base({title:'El entorno específico: las cinco fuerzas de Porter',H:560,dur:16,caps:[[5,'El atractivo de un sector depende de cinco fuerzas. En el centro, la rivalidad entre los competidores actuales.'],[10,'Alrededor: amenaza de nuevos entrantes y de productos sustitutivos, y poder negociador de proveedores y de clientes.'],[99,'Cuanto más fuertes son las fuerzas, menos rentable es el sector. La estrategia busca una posición donde pesen menos.']]},
 function(D,t){var cx=W/2,cy=280,F=[['Nuevos entrantes',cx,110,0,1],['Proveedores',cx-200,cy,1,0],['Clientes',cx+200,cy,-1,0],['Sustitutivos',cx,450,0,-1]];
  var a0=ease(seg(t,0.5,2));D.rect(cx-90,cy-34,180,68,C.m,RG(C.m,.15*a0),2.4);D.text('Rivalidad',cx,cy-4,{s:19,a:'center',c:C.m,bold:true,al:a0});D.text('entre competidores',cx,cy+18,{s:14,a:'center',c:C.m,al:a0});
  F.forEach(function(f,i){var a=ease(seg(t,2+i*2.2,3.2+i*2.2));if(a<=0)return;var w=150,h=50,x=f[1],y=f[2];D.rect(x-w/2,y-h/2,w,h,C.f,RG(C.f,.12*a),1.8);D.text(f[0],x,y+5,{s:15,a:'center',c:C.f,al:a});
   var ex=cx-f[3]*92,ey=cy-f[4]*38,sx=x+f[3]*(w/2+4),sy=y+f[4]*(h/2+4);if(f[4]===0){sx=x+f[3]*(w/2+4);sy=y;}else{sx=x;sy=y+f[4]*(h/2+4);}var px=lerp(sx,ex,a),py=lerp(sy,ey,a);D.arrow(sx,sy,px,py,C.hl,2.6);});
  var k=Math.min(3,Math.floor(seg(t,2,11)*4));D.text(['¿es fácil entrar?','¿pocos proveedores clave?','¿clientes concentrados?','¿hay alternativas?'][k],W/2,520,{s:18,a:'center',c:C.mut,it:true});}));

/* T3 ciclo de gestión */
M.reg('oge-t3',M.base({title:'Las funciones de la gestión: un ciclo',H:560,dur:16,caps:[[4,'<b>Planificar</b>: fijar objetivos y decidir cómo alcanzarlos.'],[8,'<b>Organizar</b>: repartir tareas, recursos y autoridad. <b>Dirigir</b>: motivar, coordinar y comunicar.'],[99,'<b>Controlar</b>: medir resultados, compararlos con lo planificado y corregir. Esa corrección alimenta la siguiente planificación.']]},
 function(D,t){var cx=W/2,cy=280,R=150,N=['Planificar','Organizar','Dirigir','Controlar'],k=Math.floor((t%16)/4),ph=(t%4)/4;
  D.ring(cx,cy,R,C.grid,2);for(var i=0;i<4;i++){var a=-Math.PI/2+i*Math.PI/2,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a),on=i===k;
   D.dot(x,y,on?46:40,on?RG(C.y,.25):RG(C.f,.12));D.ring(x,y,on?46:40,on?C.y:C.f,on?3:1.6);D.text(N[i],x,y+6,{s:16,a:'center',c:on?C.y:C.f,bold:on});
   var a2=a+Math.PI/4;D.head(cx+R*Math.cos(a2),cy+R*Math.sin(a2),a2+Math.PI/2,C.mut,12);}
  var aa=-Math.PI/2+(k+0.2+0.6*ph)*Math.PI/2;D.dot(cx+R*Math.cos(aa),cy+R*Math.sin(aa),7,C.m);D.text('objetivos → resultados',cx,cy+6,{s:15,a:'center',c:C.mut,it:true});}));

/* T4 función de producción */
function Q4(L){return 6*L*L-L*L*L/3;}
M.reg('oge-t4',M.traza({title:'Función de producción y rendimientos decrecientes',H:560,dur:16,x0:0.2,x1:12,tangent:true,ax:{xr:[0,12.6],yr:[0,320],xt:[3,6,9,12],yt:[100,200,300],xd:0,yd:0,xl:'L (trabajadores)',yl:'Q'},h:300,f:Q4,
 extra:function(D,A){D.line(A.X(6),A.Y(0),A.X(6),A.Y(Q4(6)),C.mut,1,[3,4]);D.text('máximo PMg',A.X(6)+6,A.Y(Q4(6))+20,{s:13,c:C.mut});},
 read:function(L){var pm=12*L-L*L;return ['L = '+nf(L,1)+'    Q = '+nf(Q4(L),0),'PMg = dQ/dL = '+nf(pm,1)+'    PMe = Q/L = '+nf(Q4(L)/L,1)+'    productividad = Q/L'];},
 caps:[[5,'Al añadir trabajadores con el resto de factores fijos, al principio cada uno aporta más que el anterior (la pendiente crece).'],[10,'A partir de cierto punto el producto marginal empieza a bajar: es la ley de rendimientos decrecientes.'],[99,'La productividad media del trabajo es Q/L. Cuando el marginal cae por debajo de la media, la media también empieza a bajar.']]}));

/* T5 equilibrado de una línea */
var TK=[['A',4],['B',3],['C',5],['D',2],['E',6],['F',3],['G',4],['H',2]],CT=9;
var ST=(function(){var s=[[]],sum=0;TK.forEach(function(k){if(sum+k[1]>CT){s.push([]);sum=0;}s[s.length-1].push(k);sum+=k[1];});return s;})();
M.reg('oge-t5',M.base({title:'Diseño del sistema productivo: equilibrar una línea',H:560,dur:18,caps:[[6,'Las tareas de montaje se reparten entre estaciones en orden de precedencia sin superar el tiempo de ciclo c (el ritmo de salida).'],[12,'Cada estación acumula tareas hasta que la siguiente ya no cabe; entonces se abre una nueva estación.'],[99,'Eficiencia = Σ tiempos / (n · c). El hueco entre cada barra y la línea de ciclo es tiempo ocioso.']]},
 function(D,t){var A=U.axes(D,{xr:[0,ST.length+0.4],yr:[0,11],xt:[],yt:[3,6,9],yd:0,xl:'estaciones',yl:'t (min)'},{x:80,y:96,w:480,h:300,grid:true}),n=Math.floor(seg(t,1,13)*TK.length+0.001),done=0,bw=(A.X(1)-A.X(0))*0.6;
  D.line(A.X(0),A.Y(CT),A.X(ST.length+0.4),A.Y(CT),C.bad,2,[6,4]);D.text('c = '+CT+' min',A.X(ST.length+0.35),A.Y(CT)-8,{s:15,c:C.bad,a:'right'});
  ST.forEach(function(s,i){var y=0;s.forEach(function(k){if(done>=n)return;done++;var x=A.X(i+0.5)-bw/2;D.rect(x,A.Y(y+k[1]),bw,A.Y(y)-A.Y(y+k[1]),C.m,RG(C.f,.25),1.6);D.text(k[0]+' ('+k[1]+')',x+bw/2,A.Y(y+k[1]/2)+5,{s:14,a:'center',c:C.w});y+=k[1];});D.text('Est. '+(i+1),A.X(i+0.5),A.Y(0)+20,{s:14,a:'center',c:C.mut});});
  var sum=TK.reduce(function(a,k){return a+k[1];},0);U.readout(D,['Σ t = '+sum+' min    n = '+ST.length+' estaciones','eficiencia = '+sum+'/('+ST.length+'·'+CT+') = '+nf(sum/(ST.length*CT)*100,1)+' %'],468);}));

/* T6 lote económico */
var Dd=12000,S6=50,H6=2,Qs=Math.sqrt(2*Dd*S6/H6);
M.reg('oge-t6',M.base({title:'Gestión de stocks: el lote económico (EOQ)',H:580,dur:18,caps:[[6,'Pedir lotes grandes reduce el número de pedidos al año (coste de emisión) pero sube el stock medio (coste de mantenimiento).'],[12,'El coste total <i>D·S/Q + H·Q/2</i> tiene un mínimo justo donde los dos costes se igualan.'],[99,'Ese mínimo es el lote económico <i>Q* = √(2DS/H)</i>. Abajo se ve el diente de sierra del stock para el lote actual.']]},
 function(D,t){var Q=lerp(300,2400,U.pp(t,18)),A=U.axes(D,{xr:[0,2600],yr:[0,2600],xt:[500,1000,1500,2000,2500],yt:[1000,2000],xd:0,yd:0,xl:'Q',yl:'€/año'},{x:80,y:90,w:480,h:220,grid:true});
  U.plotf(D,A,function(q){return q<100?NaN:Dd*S6/q;},C.f,1.6,0.8);U.plotf(D,A,function(q){return H6*q/2;},C.g,1.6,0.8);U.plotf(D,A,function(q){return q<200?NaN:Dd*S6/q+H6*q/2;},C.m,2.8);
  D.line(A.X(Qs),A.Y(0),A.X(Qs),A.Y(2600),C.hl,1.2,[4,4]);D.text('Q* = '+nf(Qs,0),A.X(Qs)+6,A.Y(2450),{s:14,c:C.hl});D.dot(A.X(Q),A.Y(Dd*S6/Q+H6*Q/2),7,C.m);
  var B=U.axes(D,{xr:[0,12],yr:[0,2600],xt:[3,6,9,12],yt:[],xd:0,xl:'meses',yl:'stock'},{x:80,y:370,w:480,h:80}),p=[],per=Q/Dd*12;for(var m=0;m<=12;m+=0.02){var r=(m%per)/per;p.push([B.X(m),B.Y(Q*(1-r))]);}D.path(p,C.f,1.8);
  U.readout(D,['Q = '+nf(Q,0)+' u    pedidos/año = '+nf(Dd/Q,1)+'    coste = '+nf(Dd*S6/Q+H6*Q/2,0)+' €/año'],530);}));

/* T7 gráfico de control */
var rs=7;function rnd(){rs=(rs*16807)%2147483647;return rs/2147483647;}function gs(){var u=0;for(var i=0;i<6;i++)u+=rnd();return (u-3)*Math.sqrt(2);}
var PTS=[];for(var i7=0;i7<25;i7++)PTS.push(i7===18?3.4:clamp(gs()*0.9,-2.6,2.6));
M.reg('oge-t7',M.base({title:'Gestión de la calidad: gráfico de control',H:560,dur:18,caps:[[6,'Cada punto es la media de una muestra tomada del proceso. La línea central es la media del proceso bajo control.'],[12,'Los límites de control están a ±3σ: si el proceso solo tiene variabilidad aleatoria, casi ningún punto (0,27 %) cae fuera.'],[99,'Un punto fuera de límites indica una causa asignable (desgaste, cambio de material…): hay que parar, buscarla y corregirla.']]},
 function(D,t){var n=Math.floor(seg(t,1,15)*25),A=U.axes(D,{xr:[0,26],yr:[-4,4],xt:[5,10,15,20,25],yt:[-3,3],xd:0,yf:function(v){return v>0?'LCS':'LCI';},xl:'muestra',yl:''},{x:80,y:96,w:480,h:300,grid:false});
  D.line(A.X(0),A.Y(3),A.X(26),A.Y(3),C.bad,1.8,[6,4]);D.line(A.X(0),A.Y(-3),A.X(26),A.Y(-3),C.bad,1.8,[6,4]);D.line(A.X(0),A.Y(0),A.X(26),A.Y(0),C.ok,1.6);D.text('LC',A.X(0)-9,A.Y(0)+4,{s:13,a:'right',c:C.ok});
  var p=[];for(var i=0;i<n;i++)p.push([A.X(i+1),A.Y(PTS[i])]);D.path(p,C.f,1.4,null,0.7);p.forEach(function(q,i){var out=Math.abs(PTS[i])>3;D.dot(q[0],q[1],out?8:5,out?C.bad:C.m);if(out)D.ring(q[0],q[1],14,C.bad,2);});
  U.readout(D,[n>18?'muestra 19 fuera de control: buscar la causa asignable':'proceso bajo control ('+n+' muestras)'],468);}));

/* T8 PERT / CPM */
var NO=[[1,90,280],[2,240,160],[3,240,400],[4,400,400],[5,550,280]],AC=[['A',1,2,3],['B',1,3,4],['C',2,4,2],['D',3,4,5],['E',4,5,3],['F',2,5,6]],ET={1:0,2:3,3:4,4:9,5:12},CRIT={B:1,D:1,E:1};
M.reg('oge-t8',M.base({title:'Gestión de proyectos: PERT y camino crítico',H:560,dur:18,caps:[[6,'Cada flecha es una actividad con su duración. En cada nudo se calcula el tiempo más temprano: el máximo de los caminos que llegan.'],[12,'En el nudo 4 llegan A–C (3 + 2 = 5) y B–D (4 + 5 = 9): manda el más largo, 9.'],[99,'El camino crítico B–D–E (12 días) no tiene holgura: cualquier retraso en él retrasa todo el proyecto. A, C y F tienen margen.']]},
 function(D,t){var show=Math.floor(seg(t,1,10)*5),crit=t>11;function P(k){return NO[k-1];}
  AC.forEach(function(a){var p=P(a[1]),q=P(a[2]),ang=Math.atan2(q[2]-p[2],q[1]-p[1]),r=26,x1=p[1]+r*Math.cos(ang),y1=p[2]+r*Math.sin(ang),x2=q[1]-r*Math.cos(ang),y2=q[2]-r*Math.sin(ang),c=crit&&CRIT[a[0]]?C.bad:C.f;D.arrow(x1,y1,x2,y2,c,crit&&CRIT[a[0]]?3.6:2);
   D.text(a[0]+' ('+a[3]+')',(x1+x2)/2+(a[0]==='F'?0:0),(y1+y2)/2-10,{s:16,a:'center',c:c,bold:crit&&CRIT[a[0]]});});
  NO.forEach(function(n,i){D.dot(n[1],n[2],26,RG(C.m,.12));D.ring(n[1],n[2],26,C.m,2);D.text(n[0]+'',n[1],n[2]+6,{s:18,a:'center',c:C.m,bold:true});if(i<show)D.text('t = '+ET[n[0]],n[1],n[2]+(n[2]>300?50:-36),{s:16,a:'center',c:C.hl,bold:true});});
  U.readout(D,[crit?'camino crítico: B → D → E   duración = 12 días':'calculando tiempos más tempranos…'],505);}));
})();
