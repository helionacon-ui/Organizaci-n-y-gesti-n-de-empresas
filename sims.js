/* Figuras interactivas de Organización y Gestión de Empresas. Vanilla JS + canvas. */
(function(){
const C = {};
function paleta(el){const cs=getComputedStyle(el);const v=n=>cs.getPropertyValue(n).trim();
  C.bg=v('--surface')||'#fff';C.grid=v('--line')||'#d5dcd9';C.text=v('--fg')||'#16211d';C.muted=v('--muted')||'#56635e';
  C.a=v('--tc')||v('--accent')||'#b4232f';C.b=v('--warn')||'#b8730c';C.c=v('--c6')||'#2c8a52';C.d=v('--c5')||'#c43d63';C.e=v('--c4')||'#b8730c';C.f=v('--c2')||'#3a63c4';}
const F=n=>Number.isInteger(n)?String(n):(Math.abs(n)<1e-9?'0':n.toFixed(2).replace('.',','));

function build(el, spec){
  el.classList.add('sim-box');paleta(el);
  const ctrls=document.createElement('div'); ctrls.className='ctrl sim-ctrls';
  const cv=document.createElement('canvas'); cv.width=spec.w||640; cv.height=spec.h||360; cv.className='sim-cv';
  const out=document.createElement('div'); out.className='readout sim-out';
  el.append(ctrls,cv,out);
  const st={};
  (spec.sliders||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=`${s.l}: ${F(s.v)} ${s.u||''}`;
    const inp=document.createElement('input');inp.type='range';inp.min=s.min;inp.max=s.max;inp.step=s.step||0.01;inp.value=s.v;
    inp.oninput=()=>{st[s.k]=parseFloat(inp.value);sp.textContent=`${s.l}: ${F(st[s.k])} ${s.u||''}`;draw();};lab.append(sp,inp);ctrls.append(lab);});
  (spec.selects||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=s.l;
    const sel=document.createElement('select');s.opts.forEach(o=>{const op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(o[0]===s.v)op.selected=true;sel.append(op);});
    sel.onchange=()=>{st[s.k]=sel.value;draw();};lab.append(sp,sel);ctrls.append(lab);});
  const g=cv.getContext('2d');
  const api={st,cv,g,out,W:cv.width,H:cv.height,
    clear(){paleta(el);g.fillStyle=C.bg;g.fillRect(0,0,cv.width,cv.height);},
    txt(s,x,y,col,sz,al){g.fillStyle=col||C.text;g.font=(sz||13)+'px system-ui';g.textAlign=al||'left';g.fillText(s,x,y);},
    arrow(x1,y1,x2,y2,col,wd){g.strokeStyle=g.fillStyle=col;g.lineWidth=wd||2.5;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();const a=Math.atan2(y2-y1,x2-x1),L=10;g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-L*Math.cos(a-0.4),y2-L*Math.sin(a-0.4));g.lineTo(x2-L*Math.cos(a+0.4),y2-L*Math.sin(a+0.4));g.closePath();g.fill();},
    line(x1,y1,x2,y2,col,wd,dash){g.strokeStyle=col;g.lineWidth=wd||1.5;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);},
    circ(x,y,r,col,fill){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=col;g.fill();}else{g.strokeStyle=col;g.lineWidth=2;g.stroke();}},
    html(h){out.innerHTML=h;},
    // sistema de ejes cartesiano
    axes(cx,cy,u,xmin,xmax,ymin,ymax){for(let i=Math.ceil(xmin);i<=xmax;i++)api.line(cx+i*u,cy-ymax*u,cx+i*u,cy-ymin*u,C.grid,1);for(let j=Math.ceil(ymin);j<=ymax;j++)api.line(cx+xmin*u,cy-j*u,cx+xmax*u,cy-j*u,C.grid,1);api.line(cx+xmin*u,cy,cx+xmax*u,cy,C.muted,1.5);api.line(cx,cy-ymax*u,cx,cy-ymin*u,C.muted,1.5);}
  };
  function draw(){spec.draw(api);}
  draw(); return api;
}
const SIMS={};

/* ---- Organización y Gestión de Empresas: figuras interactivas ---- */
const NQ=x=>{const r=Math.round(x*1000)/1000;return (Math.abs(r-Math.round(r))<1e-9?String(Math.round(r)):r.toFixed(3).replace(/0+$/,'')).replace('.',',');};
const N0=x=>(Math.abs(x)<0.5?0:x).toFixed(0);
const N1=x=>(Math.abs(x)<5e-2?0:x).toFixed(1).replace('.',',');
const N2=x=>(Math.abs(x)<5e-3?0:x).toFixed(2).replace('.',',');
const N3=x=>(Math.abs(x)<5e-4?0:x).toFixed(3).replace('.',',');
const EUR=x=>N0(x).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' €';
const ticks=(max,n)=>{const raw=max/n,p=Math.pow(10,Math.floor(Math.log10(raw))),c=[1,2,2.5,5,10].find(k=>k*p>=raw)*p;const o=[];for(let v=c;v<=max*1.0001;v+=c)o.push(v);return o;};
const Rbox=(a,x,y,w,h,col,fill)=>{if(fill){a.g.fillStyle=col;a.g.globalAlpha=0.14;a.g.fillRect(x,y,w,h);a.g.globalAlpha=1;}
  a.g.strokeStyle=col;a.g.lineWidth=2;a.g.strokeRect(x,y,w,h);};
const curve=(a,pts,col,wd,dash)=>{a.g.strokeStyle=col;a.g.lineWidth=wd||2;a.g.setLineDash(dash||[]);a.g.beginPath();
  pts.forEach((p,i)=>i?a.g.lineTo(p[0],p[1]):a.g.moveTo(p[0],p[1]));a.g.stroke();a.g.setLineDash([]);};
const normcdf=z=>0.5*(1+erf(z/Math.SQRT2));
function erf(x){const s=x<0?-1:1;x=Math.abs(x);
  const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
  const t=1/(1+p*x);const y=1-((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);return s*y;}

/* T1 · Punto muerto y comparación de alternativas */
SIMS.puntomuerto=el=>build(el,{w:680,h:248,
 sliders:[{k:'p',v:30,min:5,max:80,step:1,l:'Precio de venta',u:'€/ud'},
  {k:'cv',v:18,min:1,max:60,step:1,l:'Coste variable unitario',u:'€/ud'},
  {k:'CF',v:120,min:10,max:400,step:5,l:'Costes fijos',u:'miles €'},
  {k:'Q',v:15,min:1,max:40,step:0.5,l:'Producción prevista',u:'miles ud'}],
 draw(a){a.clear();const s=a.st;
  const CF=s.CF*1000, Q=s.Q*1000;
  const m=s.p-s.cv;
  const Qpm=m>0?CF/m:Infinity;
  const B=Q*m-CF;
  const ox=52,oy=186,W=330,H=152;
  const Qmax=Math.max(Qpm*1.5,Q*1.2,1000);
  const ymax=Math.max(s.p*Qmax,CF+s.cv*Qmax)*1.05;
  const X=q=>ox+q/Qmax*W, Y=v=>oy-v/ymax*H;
  a.line(ox,oy,ox+W+10,oy,C.muted,1.5);a.line(ox,oy-H-8,ox,oy+6,C.muted,1.5);
  ticks(ymax,4).forEach(v=>{a.line(ox,Y(v),ox+W,Y(v),C.grid,1);a.txt(N0(v/1000)+'k',ox-6,Y(v)+4,C.muted,10,'right');});
  // ingresos y costes
  curve(a,[[X(0),Y(0)],[X(Qmax),Y(s.p*Qmax)]],C.c,2.5);
  curve(a,[[X(0),Y(CF)],[X(Qmax),Y(CF+s.cv*Qmax)]],C.b,2.5);
  a.line(ox,Y(CF),ox+W,Y(CF),C.muted,1,[4,3]);
  a.txt('ingresos',X(Qmax*0.62),Y(s.p*Qmax*0.62)-8,C.c,11,'center');
  a.txt('costes totales',X(Qmax*0.82),Y(CF+s.cv*Qmax*0.82)+16,C.b,11,'center');
  a.txt('CF',ox+4,Y(CF)-6,C.muted,10);
  if(isFinite(Qpm)&&Qpm<Qmax){
    a.circ(X(Qpm),Y(s.p*Qpm),5,C.a,true);
    a.line(X(Qpm),oy,X(Qpm),Y(s.p*Qpm),C.a,1.2,[3,3]);
    a.txt('punto muerto',X(Qpm)-8,Y(s.p*Qpm)+16,C.a,11,'right');
    // zonas
    a.g.fillStyle=C.b;a.g.globalAlpha=.07;a.g.fillRect(ox,oy-H,X(Qpm)-ox,H);a.g.globalAlpha=1;
    a.g.fillStyle=C.c;a.g.globalAlpha=.07;a.g.fillRect(X(Qpm),oy-H,ox+W-X(Qpm),H);a.g.globalAlpha=1;
    a.txt('pérdidas',(ox+X(Qpm))/2,oy-H+16,C.b,11,'center');
    a.txt('beneficio',(X(Qpm)+ox+W)/2,oy-H+16,C.c,11,'center');}
  if(Q<Qmax){a.line(X(Q),oy-H,X(Q),oy,C.f,1.5,[4,3]);a.txt('Q prevista',X(Q),oy+32,C.f,10,'center');}
  a.txt('unidades (miles)',ox+W/2,oy+46,C.muted,10,'center');
  for(let i=0;i<=4;i++)a.txt(N0(Qmax*i/4/1000),X(Qmax*i/4),oy+16,C.muted,10,'center');
  // panel
  const bx=420,by=30;
  a.txt('Margen de contribución',bx,by,C.muted,12);
  a.txt('p − cv = '+NQ(m)+' €/ud',bx,by+22,C.f,14);
  a.txt('Punto muerto',bx,by+52,C.muted,12);
  a.txt(isFinite(Qpm)?N0(Qpm)+' unidades':'no se alcanza nunca',bx,by+74,C.a,15);
  if(isFinite(Qpm))a.txt('= '+EUR(Qpm*s.p)+' de ventas',bx,by+96,C.muted,12);
  a.txt('Con '+NQ(s.Q)+' mil unidades:',bx,by+126,C.text,12);
  a.txt('Beneficio = '+EUR(B),bx,by+150,B>=0?C.c:C.b,15);
  a.txt('Margen sobre ventas = '+N1(100*B/(Q*s.p))+' %',bx,by+174,C.muted,11.5);
  a.html(`Con un precio de ${NQ(s.p)} €/ud y un coste variable de ${NQ(s.cv)} €/ud, el <b>margen de contribución</b> es de ${NQ(m)} €/ud.<br>
  El <b>punto muerto</b> está en <b>${isFinite(Qpm)?N0(Qpm)+' unidades':'infinito: el margen no es positivo'}</b>${isFinite(Qpm)?' ('+EUR(Qpm*s.p)+' de ventas)':''}, y con ${NQ(s.Q)} mil unidades el beneficio es de <b>${EUR(B)}</b>.<br>
  ${B>=0?'La producción prevista está <b>por encima</b> del punto muerto: cada unidad adicional aporta '+NQ(m)+' € de beneficio.':'La producción prevista está <b>por debajo</b> del punto muerto: la empresa pierde dinero.'}
  <span class="hint">Sube los costes fijos y baja el variable (lo que ocurre al automatizar): el punto muerto sube, pero el beneficio con volumen alto crece mucho más deprisa. Ése es el compromiso entre riesgo y rentabilidad de toda decisión de inversión en capacidad.</span>`);}});

/* T2 · Cinco fuerzas y DAFO */
SIMS.entorno=el=>build(el,{w:680,h:268,
 sliders:[{k:'cli',v:5,min:1,max:5,step:1,l:'Poder de los clientes',u:'/5'},
  {k:'prov',v:4,min:1,max:5,step:1,l:'Poder de los proveedores',u:'/5'},
  {k:'ent',v:4,min:1,max:5,step:1,l:'Amenaza de nuevos entrantes',u:'/5'},
  {k:'sus',v:2,min:1,max:5,step:1,l:'Amenaza de sustitutivos',u:'/5'},
  {k:'riv',v:4,min:1,max:5,step:1,l:'Rivalidad entre competidores',u:'/5'}],
 draw(a){a.clear();const s=a.st;
  const F=[['Clientes',s.cli],['Proveedores',s.prov],['Nuevos entrantes',s.ent],['Sustitutivos',s.sus],['Rivalidad',s.riv]];
  const media=F.reduce((x,f)=>x+f[1],0)/5;
  // diagrama de las 5 fuerzas
  const cx=176,cy=132,R=92;
  const pos=[[0,-1],[0,1],[-1,-0.25],[1,-0.25],[0,0]];
  F.forEach((f,i)=>{
    const col=f[1]>=4?C.b:(f[1]>=3?C.e:C.c);
    const w=104,h=40;
    const x=cx+pos[i][0]*R*1.25-w/2, y=cy+pos[i][1]*R*0.92-h/2;
    Rbox(a,x,y,w,h,col,true);
    a.txt(f[0],x+w/2,y+17,col,11,'center');
    a.txt('●'.repeat(f[1])+'○'.repeat(5-f[1]),x+w/2,y+33,col,10,'center');});
  // barras
  const bx=350,by=46;
  a.txt('Intensidad de cada fuerza',bx,by-14,C.text,12);
  F.forEach((f,i)=>{const y=by+i*26;
    a.txt(f[0],bx,y+10,C.muted,11.5);
    const col=f[1]>=4?C.b:(f[1]>=3?C.e:C.c);
    a.g.fillStyle=col;a.g.globalAlpha=.3;a.g.fillRect(bx+130,y,f[1]/5*140,14);a.g.globalAlpha=1;
    a.g.strokeStyle=col;a.g.lineWidth=1;a.g.strokeRect(bx+130,y,140,14);
    a.txt(String(f[1]),bx+278,y+11,col,11);});
  const atr = media<=2.4?'ALTO':(media<=3.4?'MEDIO':'BAJO');
  a.txt('Media = '+N1(media)+'/5',bx,by+150,C.muted,12.5);
  a.txt('Atractivo del sector: '+atr,bx,by+176,atr==='BAJO'?C.b:(atr==='MEDIO'?C.e:C.c),15);
  const peor=F.slice().sort((x,y)=>y[1]-x[1])[0];
  a.txt('Fuerza dominante: '+peor[0],bx,by+200,C.a,12.5);
  a.html(`Intensidad media de las cinco fuerzas: <b>${N1(media)}/5</b> ⇒ atractivo del sector <b>${atr}</b>.<br>
  La fuerza dominante es <b>${peor[0].toLowerCase()}</b> (${peor[1]}/5): es ahí donde se escapa el margen y donde debe centrarse la estrategia.<br>
  ${media>3.4?'Con fuerzas tan intensas, el sector es poco rentable aunque crezca: el valor se lo llevan clientes, proveedores o la propia competencia en precios.':'El sector ofrece margen: hay espacio para obtener rentabilidad por encima de la media.'}
  <span class="hint">Las cinco fuerzas no se suman mecánicamente: una sola fuerza muy intensa (por ejemplo, tres clientes que concentran el 85 % de las ventas) puede hacer inviable un sector por lo demás atractivo.</span>`);}});

/* T3 · Toma de decisiones en incertidumbre */
SIMS.decision=el=>build(el,{w:680,h:214,
 sliders:[{k:'a1',v:-40,min:-100,max:100,step:5,l:'A · demanda baja',u:'k€'},
  {k:'a2',v:60,min:-100,max:200,step:5,l:'A · demanda media',u:'k€'},
  {k:'a3',v:150,min:-100,max:250,step:5,l:'A · demanda alta',u:'k€'},
  {k:'p1',v:0.3,min:0,max:1,step:0.05,l:'Probabilidad de demanda baja',u:''},
  {k:'p2',v:0.5,min:0,max:1,step:0.05,l:'Probabilidad de demanda media',u:''}],
 draw(a){a.clear();const s=a.st;
  const M=[['A',[s.a1,s.a2,s.a3]],['B',[20,50,70]],['C',[30,30,30]]];
  let p1=s.p1,p2=s.p2,p3=Math.max(0,1-p1-p2);
  const sum=p1+p2+p3; p1/=sum;p2/=sum;p3/=sum;
  const P=[p1,p2,p3];
  // matriz
  const ox=44,oy=56,cw=78,rh=30;
  ['','Baja','Media','Alta'].forEach((h,j)=>a.txt(h,ox+j*cw+(j?cw/2:0),oy-10,C.muted,11.5,j?'center':'left'));
  M.forEach((m,i)=>{const y=oy+i*rh;
    a.txt(m[0],ox,y+18,C.text,13);
    m[1].forEach((v,j)=>{
      const col=v<0?C.b:C.text;
      a.txt(NQ(v),ox+(j+1)*cw+cw/2,y+18,col,12.5,'center');});});
  a.txt('Probabilidad',ox,oy+3*rh+20,C.muted,11);
  P.forEach((p,j)=>a.txt(N2(p),ox+(j+1)*cw+cw/2,oy+3*rh+20,C.f,11.5,'center'));
  // criterios
  const res={};
  M.forEach(m=>{const v=m[1];
    res[m[0]]={lap:(v[0]+v[1]+v[2])/3, wald:Math.min(...v), opt:Math.max(...v),
      esp:v[0]*P[0]+v[1]*P[1]+v[2]*P[2]};});
  // savage
  const best=[0,1,2].map(j=>Math.max(...M.map(m=>m[1][j])));
  M.forEach(m=>{res[m[0]].sav=Math.max(...[0,1,2].map(j=>best[j]-m[1][j]));});
  const gana=(k,min)=>{let b=null;M.forEach(m=>{const v=res[m[0]][k];if(b===null||(min?v<res[b][k]:v>res[b][k]))b=m[0];});return b;};
  const crit=[['Laplace (media)','lap',false],['Wald (pesimista)','wald',false],['Optimista (maximax)','opt',false],['Savage (arrepentimiento)','sav',true],['Valor esperado','esp',false]];
  const bx=356,by=46;
  a.txt('Criterio',bx,by-14,C.muted,11.5);
  a.txt('A',bx+172,by-14,C.muted,11.5,'center');
  a.txt('B',bx+214,by-14,C.muted,11.5,'center');
  a.txt('C',bx+256,by-14,C.muted,11.5,'center');
  a.txt('elige',bx+292,by-14,C.muted,11.5,'center');
  crit.forEach((c,i)=>{const y=by+i*28, g=gana(c[1],c[2]);
    a.txt(c[0],bx,y+12,C.text,11);
    ['A','B','C'].forEach((k,j)=>{
      const v=res[k][c[1]];
      a.txt(N1(v),bx+172+j*42,y+12,k===g?C.a:C.muted,11.5,'center');});
    a.txt(g,bx+292,y+12,C.a,13,'center');});
  const votos={A:0,B:0,C:0};
  crit.forEach(c=>votos[gana(c[1],c[2])]++);
  const final=Object.keys(votos).sort((x,y)=>votos[y]-votos[x])[0];
  a.txt('Alternativa más votada: '+final+' ('+votos[final]+'/5)',bx,by+150,C.c,13);
  a.html(`Valores esperados: A = <b>${N1(res.A.esp)}</b>, B = ${N1(res.B.esp)}, C = ${N1(res.C.esp)} (miles de euros).<br>
  La alternativa <b>${final}</b> gana en ${votos[final]} de los 5 criterios. El criterio de <b>Wald</b> elige <b>${gana('wald',false)}</b>, porque sólo mira el peor escenario.<br>
  Savage elige <b>${gana('sav',true)}</b>: la opción cuyo máximo arrepentimiento es menor.
  <span class="hint">Los criterios no sustituyen a la decisión. Wald es el criterio de quien <b>no puede permitirse</b> el peor caso; el valor esperado, el de quien repetirá la decisión muchas veces. Un valor esperado alto con una pérdida posible inasumible no es una buena decisión.</span>`);}});

/* T4 · Productividad */
SIMS.productividad=el=>build(el,{w:680,h:242,
 sliders:[{k:'Q',v:1200,min:200,max:3000,step:50,l:'Unidades producidas',u:'ud'},
  {k:'p',v:45,min:10,max:120,step:1,l:'Precio de venta',u:'€/ud'},
  {k:'h',v:480,min:100,max:1200,step:20,l:'Horas de mano de obra',u:'h'},
  {k:'cmo',v:18,min:8,max:40,step:0.5,l:'Coste de la mano de obra',u:'€/h'},
  {k:'cmat',v:12,min:2,max:60,step:1,l:'Coste de material',u:'€/ud'},
  {k:'ce',v:2800,min:0,max:12000,step:100,l:'Coste de energía',u:'€'}],
 draw(a){a.clear();const s=a.st;
  const VP=s.Q*s.p, CMO=s.h*s.cmo, CMAT=s.Q*s.cmat, CT=CMO+CMAT+s.ce;
  const PG=VP/CT, PMO=s.Q/s.h;
  // barras de coste
  const ox=52,base=172,BW=74;
  const partes=[['Mano de obra',CMO,C.f],['Materiales',CMAT,C.e],['Energía',s.ce,C.b]];
  const esc=120/Math.max(VP,CT);
  a.txt('Valor de la producción frente a coste de los factores',ox,30,C.text,12);
  a.g.fillStyle=C.c;a.g.globalAlpha=.3;a.g.fillRect(ox,base-VP*esc,BW,VP*esc);a.g.globalAlpha=1;
  a.g.strokeStyle=C.c;a.g.lineWidth=2;a.g.strokeRect(ox,base-VP*esc,BW,VP*esc);
  a.txt(EUR(VP),ox+BW/2,base-VP*esc-8,C.c,11.5,'center');
  a.txt('producción',ox+BW/2,base+18,C.c,11,'center');
  let yy=base;
  partes.forEach(p=>{const hh=p[1]*esc;
    a.g.fillStyle=p[2];a.g.globalAlpha=.3;a.g.fillRect(ox+120,yy-hh,BW,hh);a.g.globalAlpha=1;
    a.g.strokeStyle=p[2];a.g.lineWidth=1.5;a.g.strokeRect(ox+120,yy-hh,BW,hh);
    if(hh>16)a.txt(N0(100*p[1]/CT)+' %',ox+120+BW/2,yy-hh/2+4,p[2],10.5,'center');
    yy-=hh;});
  a.txt(EUR(CT),ox+120+BW/2,base-CT*esc-8,C.b,11.5,'center');
  a.txt('factores',ox+120+BW/2,base+18,C.b,11,'center');
  a.line(ox-8,base,ox+230,base,C.muted,1.5);
  partes.forEach((p,i)=>{a.line(ox+224,44+i*18,ox+240,44+i*18,p[2],3);a.txt(p[0],ox+246,48+i*18,p[2],10.5);});
  // panel
  const bx=380,by=44;
  a.txt('Productividad de la mano de obra',bx,by,C.muted,12);
  a.txt(N2(PMO)+' ud/h',bx,by+24,C.f,15);
  a.txt('Productividad global',bx,by+56,C.muted,12);
  a.txt(N3(PG),bx,by+82,C.a,20);
  a.txt('€ producidos por cada € invertido',bx,by+102,C.muted,11);
  a.txt('Valor de la producción: '+EUR(VP),bx,by+134,C.c,12);
  a.txt('Coste total de factores: '+EUR(CT),bx,by+156,C.b,12);
  a.txt('Beneficio = '+EUR(VP-CT),bx,by+182,VP>CT?C.c:C.b,13.5);
  a.html(`Produciendo ${NQ(s.Q)} unidades: <b>productividad de la mano de obra ${N2(PMO)} ud/h</b> y <b>productividad global ${N3(PG)}</b> (${N3(PG)} € de producción por cada euro invertido en factores).<br>
  Reparto del coste: mano de obra ${N0(100*CMO/CT)} %, materiales ${N0(100*CMAT/CT)} % y energía ${N0(100*s.ce/CT)} %.<br>
  ${PG>1?'El margen es del <b>'+N1(100*(VP-CT)/VP)+' %</b> sobre el valor de la producción.':'<b>La productividad global es menor que 1</b>: la empresa destruye valor, los factores cuestan más de lo que produce.'}
  <span class="hint">Sube sólo la producción dejando los demás controles fijos: la productividad mejora menos de lo que parece, porque el coste de materiales <b>sube con ella</b>. Sólo se diluyen los costes que no crecen con el volumen.</span>`);}});

/* T5 · VAN, TIR y payback */
SIMS.inversion=el=>build(el,{w:680,h:238,
 sliders:[{k:'I',v:50,min:10,max:200,step:5,l:'Inversión inicial',u:'k€'},
  {k:'Q1',v:15,min:0,max:80,step:1,l:'Flujo año 1',u:'k€'},
  {k:'Q2',v:18,min:0,max:80,step:1,l:'Flujo año 2',u:'k€'},
  {k:'Q3',v:20,min:0,max:80,step:1,l:'Flujo año 3',u:'k€'},
  {k:'Q4',v:16,min:0,max:80,step:1,l:'Flujo año 4',u:'k€'},
  {k:'k',v:8,min:0,max:25,step:0.5,l:'Tasa de descuento',u:'%'}],
 draw(a){a.clear();const s=a.st;
  const I=s.I*1000, Q=[s.Q1,s.Q2,s.Q3,s.Q4].map(v=>v*1000), k=s.k/100;
  const van=r=>-I+Q.reduce((x,q,i)=>x+q/Math.pow(1+r,i+1),0);
  const VAN=van(k);
  let lo=-0.95,hi=5,TIR=null;
  if(van(lo)*van(hi)<0){for(let i=0;i<200;i++){const m=(lo+hi)/2;if(van(lo)*van(m)<=0)hi=m;else lo=m;}TIR=(lo+hi)/2;}
  let ac=0,pb=null;
  for(let i=0;i<4;i++){if(ac+Q[i]>=I){pb=i+(I-ac)/Q[i];break;}ac+=Q[i];}
  // flujos
  const ox=50,cy=128,BW=52,gap=16;
  const mx=Math.max(I,...Q);
  const esc=72/mx;
  a.line(ox-8,cy,ox+5*(BW+gap),cy,C.muted,1.5);
  const bar=(i,v,col,lab)=>{const x=ox+i*(BW+gap), h=Math.abs(v)*esc;
    const y=v>=0?cy-h:cy;
    a.g.fillStyle=col;a.g.globalAlpha=.3;a.g.fillRect(x,y,BW,h);a.g.globalAlpha=1;
    a.g.strokeStyle=col;a.g.lineWidth=1.8;a.g.strokeRect(x,y,BW,h);
    a.txt(lab,x+BW/2,v>=0?y-7:y+h+16,col,11,'center');
    a.txt(String(i),x+BW/2,cy+(v>=0?16:h+30),C.muted,10,'center');};
  bar(0,-I,C.b,'−'+N0(I/1000)+'k');
  Q.forEach((q,i)=>bar(i+1,q,C.c,N0(q/1000)+'k'));
  a.txt('flujos de caja por año (k€)',ox,34,C.text,12);
  // panel
  const bx=392,by=34;
  a.txt('Tasa de descuento k = '+NQ(s.k)+' %',bx,by,C.muted,12);
  a.txt('VAN = '+EUR(VAN),bx,by+30,VAN>=0?C.c:C.b,18);
  a.txt(VAN>=0?'✓ se acepta (VAN > 0)':'✗ se rechaza (VAN < 0)',bx,by+54,VAN>=0?C.c:C.b,12.5);
  a.txt('TIR = '+(TIR!==null?N2(TIR*100)+' %':'no existe'),bx,by+86,TIR!==null&&TIR>k?C.c:C.b,15);
  if(TIR!==null)a.txt(TIR>k?'✓ TIR > k: rentable':'✗ TIR < k: no rentable',bx,by+108,TIR>k?C.c:C.b,12);
  a.txt('Plazo de recuperación',bx,by+140,C.muted,12);
  a.txt(pb!==null?N2(pb)+' años':'no se recupera',bx,by+164,pb!==null?C.f:C.b,15);
  a.txt('Suma sin descontar: '+EUR(Q.reduce((x,y)=>x+y,0)),bx,by+192,C.muted,11.5);
  a.html(`Inversión de ${EUR(I)} con flujos de ${Q.map(q=>N0(q/1000)+'k').join(', ')} € y tasa del ${NQ(s.k)} %:<br>
  <b>VAN = ${EUR(VAN)}</b> ⇒ ${VAN>=0?'el proyecto <b>se acepta</b>':'el proyecto <b>se rechaza</b>'} · <b>TIR = ${TIR!==null?N2(TIR*100)+' %':'no existe'}</b> · <b>payback = ${pb!==null?N2(pb)+' años':'no se recupera'}</b>.<br>
  ${TIR!==null?'El margen entre la TIR y la tasa de descuento es de <b>'+N2((TIR-k)*100)+' puntos</b>: es lo que puede subir el coste del capital antes de que el proyecto deje de interesar.':''}
  <span class="hint">Sube la tasa de descuento y observa cómo cae el VAN: el valor en el que se hace cero es exactamente la TIR. Fíjate también en que el payback no cambia con la tasa, porque ignora el valor del dinero en el tiempo: por eso es el criterio más débil de los tres.</span>`);}});

/* T5 extra · Localización por factores ponderados */
SIMS.localizacion=el=>build(el,{w:680,h:250,
 sliders:[{k:'w1',v:30,min:0,max:60,step:5,l:'Peso: coste de mano de obra',u:'%'},
  {k:'w2',v:25,min:0,max:60,step:5,l:'Peso: proximidad al mercado',u:'%'},
  {k:'w3',v:20,min:0,max:60,step:5,l:'Peso: transporte',u:'%'},
  {k:'w4',v:15,min:0,max:60,step:5,l:'Peso: mano de obra cualificada',u:'%'},
  {k:'w5',v:10,min:0,max:60,step:5,l:'Peso: incentivos fiscales',u:'%'}],
 draw(a){a.clear();const s=a.st;
  const W=[s.w1,s.w2,s.w3,s.w4,s.w5]; const S=W.reduce((x,y)=>x+y,0)||1;
  const w=W.map(v=>v/S);
  const fac=['Coste mano de obra','Proximidad al mercado','Transporte','M. o. cualificada','Incentivos fiscales'];
  const loc={A:[8,7,9,6,7],B:[6,9,7,8,8],C:[9,6,6,9,6]};
  const punt={}; Object.keys(loc).forEach(k=>punt[k]=loc[k].reduce((x,v,i)=>x+v*w[i],0));
  const ganador=Object.keys(punt).sort((x,y)=>punt[y]-punt[x])[0];
  // tabla
  const ox=42,oy=52,cw=54;
  a.txt('Factor',ox,oy-12,C.muted,11.5);
  a.txt('peso',ox+190,oy-12,C.muted,11.5,'center');
  ['A','B','C'].forEach((k,j)=>a.txt(k,ox+248+j*cw,oy-12,C.text,12.5,'center'));
  fac.forEach((f,i)=>{const y=oy+i*26;
    a.txt(f,ox,y+12,C.muted,11.5);
    a.txt(N2(w[i]),ox+190,y+12,C.f,11.5,'center');
    ['A','B','C'].forEach((k,j)=>a.txt(String(loc[k][i]),ox+248+j*cw,y+12,k===ganador?C.a:C.muted,12,'center'));});
  const y2=oy+5*26+6;
  a.line(ox,y2,ox+248+2*cw+20,y2,C.grid,1);
  a.txt('Puntuación ponderada',ox,y2+22,C.text,12.5);
  ['A','B','C'].forEach((k,j)=>a.txt(N2(punt[k]),ox+248+j*cw,y2+22,k===ganador?C.a:C.muted,14,'center'));
  if(Math.abs(S-100)>0.1)a.txt('(los pesos suman '+N0(S)+' % y se han normalizado)',ox,y2+44,C.b,11);
  // barras
  const bx=430,by=60;
  a.txt('Resultado',bx,by-16,C.text,12.5);
  ['A','B','C'].forEach((k,i)=>{const y=by+i*34;
    const col=k===ganador?C.a:C.muted;
    a.txt('Localización '+k,bx,y+11,col,12);
    a.g.fillStyle=col;a.g.globalAlpha=.3;a.g.fillRect(bx+100,y,punt[k]/10*120,16);a.g.globalAlpha=1;
    a.g.strokeStyle=col;a.g.lineWidth=1;a.g.strokeRect(bx+100,y,120,16);
    a.txt(N2(punt[k]),bx+226,y+13,col,12);});
  const ord=Object.keys(punt).sort((x,y)=>punt[y]-punt[x]);
  const dif=punt[ord[0]]-punt[ord[1]];
  a.txt('Gana '+ganador+' por '+N2(dif)+' puntos',bx,by+124,C.a,14);
  a.txt(dif<0.3?'⚠ diferencia muy pequeña:':'decisión razonablemente clara',bx,by+148,dif<0.3?C.b:C.c,12);
  if(dif<0.3)a.txt('la decisión no es robusta',bx,by+168,C.b,12);
  a.html(`Con los pesos actuales, las puntuaciones son <b>A = ${N2(punt.A)}</b>, <b>B = ${N2(punt.B)}</b> y <b>C = ${N2(punt.C)}</b>: gana <b>${ganador}</b> por ${N2(dif)} puntos.<br>
  ${dif<0.3?'La diferencia es <b>muy pequeña</b>: un cambio modesto en los pesos cambiaría el resultado. En un examen conviene señalarlo y hacer un análisis de sensibilidad.':'La diferencia es suficiente para considerar la decisión estable frente a pequeños cambios en los pesos.'}
  <span class="hint">Mueve el peso del coste de mano de obra: con mucho peso gana C, con poco gana B. Ésa es la lección del método: el resultado depende tanto de los pesos como de las puntuaciones, y los pesos los elige quien decide.</span>`);}});

/* T6 · Pedido óptimo (EOQ) */
SIMS.eoq=el=>build(el,{w:680,h:262,
 sliders:[{k:'D',v:12000,min:500,max:60000,step:500,l:'Demanda anual',u:'ud'},
  {k:'S',v:60,min:5,max:500,step:5,l:'Coste de lanzamiento',u:'€/pedido'},
  {k:'H',v:3,min:0.2,max:20,step:0.2,l:'Coste de posesión',u:'€/ud·año'},
  {k:'L',v:10,min:1,max:60,step:1,l:'Plazo de entrega',u:'días'},
  {k:'SS',v:100,min:0,max:800,step:25,l:'Stock de seguridad',u:'ud'}],
 draw(a){a.clear();const s=a.st;
  const Q=Math.sqrt(2*s.D*s.S/s.H);
  const N=s.D/Q, T=365/N;
  const CL=s.D/Q*s.S, CP=Q/2*s.H, CT=CL+CP;
  const d=s.D/365, PP=d*s.L+s.SS;
  // curva de costes
  const ox=50,oy=192,W=290,H=140;
  const Qmax=Q*2.6;
  const ymax=(s.D/(Qmax*0.12)*s.S);
  const ym=Math.min(ymax, CT*3);
  const X=q=>ox+q/Qmax*W, Y=c=>oy-Math.min(c,ym)/ym*H;
  a.line(ox,oy,ox+W+10,oy,C.muted,1.5);a.line(ox,oy-H-8,ox,oy+6,C.muted,1.5);
  const pl=[],pp=[],pt=[];
  for(let i=1;i<=240;i++){const q=Qmax*i/240;
    pl.push([X(q),Y(s.D/q*s.S)]);pp.push([X(q),Y(q/2*s.H)]);pt.push([X(q),Y(s.D/q*s.S+q/2*s.H)]);}
  curve(a,pl,C.f,1.8,[5,4]);curve(a,pp,C.e,1.8,[5,4]);curve(a,pt,C.a,2.5);
  a.circ(X(Q),Y(CT),5,C.a,true);
  a.line(X(Q),oy,X(Q),Y(CT),C.a,1.2,[3,3]);
  a.txt('Q* = '+N0(Q),X(Q)+8,Y(CT)-10,C.a,11.5);
  a.txt('lanzamiento',ox+W-4,Y(s.D/Qmax*s.S)-6,C.f,10,'right');
  a.txt('posesión',ox+W-4,Y(Qmax/2*s.H)+14,C.e,10,'right');
  a.txt('coste total',ox+6,Y(ym*0.92),C.a,11);
  a.txt('tamaño del pedido',ox+W/2,oy+32,C.muted,10,'center');
  for(let i=1;i<=4;i++)a.txt(N0(Qmax*i/4),X(Qmax*i/4),oy+16,C.muted,10,'center');
  // panel
  const bx=382,by=42;
  a.txt('Q* = √(2DS/H)',bx,by,C.muted,12);
  a.txt(N0(Q)+' unidades',bx,by+26,C.a,18);
  a.txt(N2(N)+' pedidos al año  ·  uno cada '+N1(T)+' días',bx,by+52,C.muted,12);
  a.txt('Coste de lanzamiento: '+EUR(CL),bx,by+82,C.f,12.5);
  a.txt('Coste de posesión: '+EUR(CP),bx,by+104,C.e,12.5);
  a.txt('Coste total: '+EUR(CT),bx,by+128,C.a,14);
  a.txt(Math.abs(CL-CP)<1?'✓ en el óptimo ambos costes se igualan':'',bx,by+150,C.c,11.5);
  a.txt('Demanda diaria = '+N1(d)+' ud',bx,by+180,C.muted,12);
  a.txt('Punto de pedido = '+N0(PP)+' ud',bx,by+204,C.f,14);
  a.html(`Con D = ${NQ(s.D)} ud/año, S = ${NQ(s.S)} €/pedido y H = ${NQ(s.H)} €/ud·año: <b>Q* = ${N0(Q)} unidades</b>, es decir ${N2(N)} pedidos al año (uno cada ${N1(T)} días).<br>
  El coste total de gestión es de <b>${EUR(CT)}</b>, repartido en ${EUR(CL)} de lanzamiento y ${EUR(CP)} de posesión: <b>exactamente iguales</b>, que es la propiedad del óptimo.<br>
  El <b>punto de pedido</b> está en ${N0(PP)} unidades (${N1(d*s.L)} de consumo durante el plazo de entrega más ${NQ(s.SS)} de stock de seguridad).
  <span class="hint">Fíjate en lo <b>plana</b> que es la curva de coste total cerca del óptimo: pedir un 20 % más o menos encarece menos del 2 %. Por eso en la práctica se redondea al múltiplo de palé o de camión sin problema.</span>`);}});

/* T7 · Control estadístico y capacidad */
SIMS.spc=el=>build(el,{w:680,h:270,
 sliders:[{k:'mu',v:10.05,min:9.6,max:10.4,step:0.01,l:'Media del proceso',u:'mm'},
  {k:'sg',v:0.1,min:0.02,max:0.3,step:0.005,l:'Desviación típica',u:'mm'},
  {k:'nom',v:10,min:9.8,max:10.2,step:0.05,l:'Valor nominal',u:'mm'},
  {k:'tol',v:0.4,min:0.05,max:0.8,step:0.05,l:'Tolerancia ±',u:'mm'}],
 draw(a){a.clear();const s=a.st;
  const LIE=s.nom-s.tol, LSE=s.nom+s.tol;
  const Cp=(LSE-LIE)/(6*s.sg);
  const Cpk=Math.min((LSE-s.mu),(s.mu-LIE))/(3*s.sg);
  const ppm=1e6*(1-(normcdf((LSE-s.mu)/s.sg)-normcdf((LIE-s.mu)/s.sg)));
  const ox=48,oy=190,W=330,H=132;
  const xmin=Math.min(LIE,s.mu-4*s.sg)-0.05, xmax=Math.max(LSE,s.mu+4*s.sg)+0.05;
  const X=x=>ox+(x-xmin)/(xmax-xmin)*W;
  const f=x=>Math.exp(-0.5*Math.pow((x-s.mu)/s.sg,2));
  const Y=v=>oy-v*H;
  a.line(ox,oy,ox+W+8,oy,C.muted,1.5);
  // zona fuera de especificacion
  a.g.fillStyle=C.b;a.g.globalAlpha=.08;
  a.g.fillRect(ox,oy-H-6,X(LIE)-ox,H+6);a.g.fillRect(X(LSE),oy-H-6,ox+W-X(LSE),H+6);a.g.globalAlpha=1;
  const pts=[];for(let i=0;i<=300;i++){const x=xmin+(xmax-xmin)*i/300;pts.push([X(x),Y(f(x))]);}
  curve(a,pts,C.a,2.5);
  [[LIE,'LIE'],[LSE,'LSE']].forEach(([v,t])=>{a.line(X(v),oy-H-6,X(v),oy,C.b,2);
    a.txt(t+' '+N2(v),X(v),oy-H-12,C.b,11,'center');});
  a.line(X(s.mu),oy-H,X(s.mu),oy,C.f,1.5,[4,3]);
  a.txt('μ = '+N3(s.mu),X(s.mu)+6,oy-H+12,C.f,11);
  a.line(X(s.nom),oy,X(s.nom),oy+8,C.c,2);
  a.txt('nominal',X(s.nom),oy+22,C.c,10,'center');
  // +-3 sigma
  a.line(X(s.mu-3*s.sg),oy-5,X(s.mu+3*s.sg),oy-5,C.muted,2);
  a.txt('6σ = '+N3(6*s.sg)+' mm',X(s.mu),oy+36,C.muted,10,'center');
  // panel
  const bx=406,by=34;
  a.txt('Especificación: '+N2(s.nom)+' ± '+NQ(s.tol)+' mm',bx,by,C.muted,12);
  a.txt('Cp = (LSE−LIE)/6σ',bx,by+30,C.muted,11.5);
  a.txt(N3(Cp),bx+150,by+30,Cp>=1.33?C.c:(Cp>=1?C.e:C.b),15);
  a.txt('Cpk = mín(...)/3σ',bx,by+58,C.muted,11.5);
  a.txt(N3(Cpk),bx+150,by+58,Cpk>=1.33?C.c:(Cpk>=1?C.e:C.b),15);
  const diag = Cpk<1? 'NO CAPAZ' : (Cpk<1.33? 'marginalmente capaz':'CAPAZ');
  a.txt(diag,bx,by+88,Cpk>=1.33?C.c:(Cpk>=1?C.e:C.b),16);
  const desc=Math.abs(s.mu-(LIE+LSE)/2);
  a.txt('Descentrado: '+N3(desc)+' mm',bx,by+116,desc>0.02?C.b:C.c,12.5);
  a.txt(Cp-Cpk>0.1?'→ el problema es el CENTRADO':(Cp<1.33?'→ el problema es la VARIABILIDAD':'→ proceso correcto'),bx,by+138,C.a,12);
  a.txt('Defectuosas ≈ '+(ppm>1?N0(ppm):N2(ppm))+' ppm',bx,by+170,ppm>1000?C.b:C.c,13);
  a.txt('('+N3(ppm/10000)+' % fuera de tolerancia)',bx,by+190,C.muted,11);
  a.html(`Proceso con μ = ${N3(s.mu)} mm y σ = ${N3(s.sg)} mm frente a una especificación de ${N2(s.nom)} ± ${NQ(s.tol)} mm:<br>
  <b>Cp = ${N3(Cp)}</b> (anchura) y <b>Cpk = ${N3(Cpk)}</b> (anchura y centrado) ⇒ proceso <b>${diag}</b>, con unas <b>${ppm>1?N0(ppm):N2(ppm)} piezas defectuosas por millón</b>.<br>
  ${Cp-Cpk>0.1?'Como Cp &gt; Cpk, el proceso está <b>descentrado</b> '+N3(desc)+' mm: basta ajustar la máquina, que es la corrección más barata.':(Cp<1.33?'El proceso está centrado pero tiene <b>demasiada variabilidad</b>: hay que actuar sobre el proceso o la máquina, que es mucho más caro.':'El proceso está centrado y con variabilidad suficiente.')}
  <span class="hint">Cpk nunca puede superar a Cp. Mueve la media dejando σ fija y verás cómo Cpk cae mientras Cp no cambia: ésa es exactamente la diferencia entre los dos índices.</span>`);}});

/* T8 · PERT: camino crítico */
SIMS.pert=el=>build(el,{w:680,h:282,
 sliders:[{k:'dA',v:4,min:1,max:12,step:0.5,l:'Duración de A',u:'sem'},
  {k:'dB',v:6,min:1,max:12,step:0.5,l:'Duración de B',u:'sem'},
  {k:'dC',v:3,min:1,max:12,step:0.5,l:'Duración de C (tras A)',u:'sem'},
  {k:'dD',v:7,min:1,max:14,step:0.5,l:'Duración de D (tras A)',u:'sem'},
  {k:'dE',v:3,min:1,max:12,step:0.5,l:'Duración de E (tras B y C)',u:'sem'},
  {k:'dF',v:5,min:1,max:14,step:0.5,l:'Duración de F (tras D y E)',u:'sem'}],
 draw(a){a.clear();const s=a.st;
  const act={A:{t:s.dA,pre:[]},B:{t:s.dB,pre:[]},C:{t:s.dC,pre:['A']},D:{t:s.dD,pre:['A']},E:{t:s.dE,pre:['B','C']},F:{t:s.dF,pre:['D','E']}};
  const ord=['A','B','C','D','E','F'];
  ord.forEach(k=>{act[k].ES=Math.max(0,...act[k].pre.map(p=>act[p].EF));act[k].EF=act[k].ES+act[k].t;});
  const T=Math.max(...ord.map(k=>act[k].EF));
  [...ord].reverse().forEach(k=>{const suc=ord.filter(j=>act[j].pre.indexOf(k)>=0);
    act[k].LF=suc.length?Math.min(...suc.map(j=>act[j].LS)):T;act[k].LS=act[k].LF-act[k].t;});
  ord.forEach(k=>act[k].H=act[k].LS-act[k].ES);
  const crit=ord.filter(k=>Math.abs(act[k].H)<1e-9);
  // red
  const pos={A:[100,76],B:[100,166],C:[220,60],D:[220,124],E:[220,190],F:[330,132]};
  const flechas=[['A','C'],['A','D'],['B','E'],['C','E'],['D','F'],['E','F']];
  flechas.forEach(([u,v])=>{const c=(act[u].H<1e-9&&act[v].H<1e-9)?C.a:C.grid;
    a.arrow(pos[u][0]+30,pos[u][1],pos[v][0]-30,pos[v][1],c,c===C.a?2.2:1.4);});
  ord.forEach(k=>{const [x,y]=pos[k], c=act[k].H<1e-9?C.a:C.muted;
    a.g.fillStyle=c;a.g.globalAlpha=.15;a.g.beginPath();a.g.arc(x,y,27,0,Math.PI*2);a.g.fill();a.g.globalAlpha=1;
    a.circ(x,y,27,c,false);
    a.txt(k,x,y-2,c,15,'center');
    a.txt(NQ(act[k].t),x,y+14,c,11,'center');});
  a.txt('Red del proyecto (en rojo, el camino crítico)',46,28,C.text,12);
  a.txt('inicio',56,120,C.muted,10);a.txt('fin',330,176,C.muted,10,'center');
  // tabla
  const bx=412,by=42;
  a.txt('Act.',bx,by,C.muted,11);
  ['ES','EF','LS','LF','H'].forEach((h,j)=>a.txt(h,bx+44+j*40,by,C.muted,11,'center'));
  ord.forEach((k,i)=>{const y=by+20+i*22, c=act[k].H<1e-9?C.a:C.muted;
    a.txt(k,bx,y,c,12);
    [act[k].ES,act[k].EF,act[k].LS,act[k].LF,act[k].H].forEach((v,j)=>
      a.txt(NQ(v),bx+44+j*40,y,j===4&&act[k].H<1e-9?C.a:c,11.5,'center'));});
  a.txt('Duración del proyecto: '+NQ(T)+' semanas',bx,by+168,C.a,14);
  a.txt('Camino crítico: '+crit.join(' → '),bx,by+192,C.a,13);
  const holg=ord.filter(k=>act[k].H>1e-9);
  a.txt(holg.length?'Con holgura: '+holg.map(k=>k+' ('+NQ(act[k].H)+')').join(', '):'todas las actividades son críticas',bx,by+216,C.muted,11.5);
  a.html(`La duración del proyecto es de <b>${NQ(T)} semanas</b> y el camino crítico es <b>${crit.join(' → ')}</b>.<br>
  ${holg.length?'Tienen holgura: '+holg.map(k=>'<b>'+k+'</b> ('+NQ(act[k].H)+' sem)').join(', ')+'. Retrasarlas dentro de su holgura no afecta al proyecto.':'<b>Todas</b> las actividades son críticas: cualquier retraso alarga el proyecto.'}<br>
  Para acortar el proyecto hay que actuar sobre <b>${crit.join(', ')}</b>: acelerar cualquier otra actividad cuesta dinero y no sirve de nada.
  <span class="hint">Reduce la duración de una actividad crítica y observa cómo, a partir de cierto punto, <b>el camino crítico cambia</b>. Por eso en el método de compresión (crashing) hay que recalcularlo después de cada paso.</span>`);}});

/* Extra · Pareto y clasificación ABC */
SIMS.pareto=el=>build(el,{w:680,h:242,
 sliders:[{k:'n',v:10,min:5,max:14,step:1,l:'Número de causas',u:''},
  {k:'conc',v:1.6,min:0.3,max:3,step:0.1,l:'Concentración',u:''}],
 draw(a){a.clear();const s=a.st;
  const n=Math.round(s.n);
  const val=[];for(let i=0;i<n;i++)val.push(100*Math.pow(n-i,s.conc));
  const tot=val.reduce((x,y)=>x+y,0);
  const pct=val.map(v=>100*v/tot);
  const acum=[];let ac=0;pct.forEach(p=>{ac+=p;acum.push(ac);});
  const ox=52,oy=192,W=330,H=146;
  const bw=W/n*0.72;
  a.line(ox,oy,ox+W+10,oy,C.muted,1.5);a.line(ox,oy-H-8,ox,oy+6,C.muted,1.5);
  [25,50,75,100].forEach(v=>{a.line(ox,oy-v/100*H,ox+W,oy-v/100*H,C.grid,1);
    a.txt(v+' %',ox-6,oy-v/100*H+4,C.muted,10,'right');});
  // clase ABC
  let clase=[];
  acum.forEach((v,i)=>clase.push(v<=80?'A':(v<=95?'B':'C')));
  const colc={A:C.b,B:C.e,C:C.c};
  pct.forEach((p,i)=>{const x=ox+(i+0.14)*W/n, h=p/100*H;
    a.g.fillStyle=colc[clase[i]];a.g.globalAlpha=.35;a.g.fillRect(x,oy-h,bw,h);a.g.globalAlpha=1;
    a.g.strokeStyle=colc[clase[i]];a.g.lineWidth=1.3;a.g.strokeRect(x,oy-h,bw,h);
    a.txt(String.fromCharCode(65+i),x+bw/2,oy+16,C.muted,10,'center');});
  curve(a,acum.map((v,i)=>[ox+(i+0.14)*W/n+bw/2,oy-v/100*H]),C.a,2.2);
  acum.forEach((v,i)=>a.circ(ox+(i+0.14)*W/n+bw/2,oy-v/100*H,3,C.a,true));
  a.line(ox,oy-0.8*H,ox+W,oy-0.8*H,C.a,1.2,[5,4]);
  a.txt('80 %',ox+W+4,oy-0.8*H+4,C.a,10);
  a.txt('% acumulado',ox+4,oy-H-12,C.muted,11);
  // panel
  const nA=clase.filter(c=>c==='A').length, nB=clase.filter(c=>c==='B').length, nC=clase.filter(c=>c==='C').length;
  const vA=acum[nA-1]||0, vB=(acum[nA+nB-1]||0)-vA;
  const bx=420,by=46;
  a.txt('Clasificación ABC',bx,by,C.text,13);
  [['A',nA,vA,'control riguroso'],['B',nB,vB,'control normal'],['C',nC,100-vA-vB,'control sencillo']].forEach((c,i)=>{
    const y=by+30+i*42;
    a.txt('Clase '+c[0],bx,y,colc[c[0]],13);
    a.txt(N0(100*c[1]/n)+' % de las referencias',bx+70,y,C.muted,11.5);
    a.txt(N1(c[2])+' % del valor',bx+70,y+16,colc[c[0]],12);
    a.txt(c[3],bx,y+16,C.muted,10.5);});
  a.txt('Las '+nA+' primeras causas explican el '+N1(vA)+' %',bx,by+166,C.a,12.5);
  a.html(`Con esta distribución, las <b>${nA} primeras causas</b> (${N0(100*nA/n)} % del total) explican el <b>${N1(vA)} %</b> del valor: son la <b>clase A</b>, donde hay que concentrar el control.<br>
  La clase B reúne ${nB} referencias y el ${N1(vB)} % del valor, y la clase C, ${nC} referencias con sólo el ${N1(100-vA-vB)} %.<br>
  <b>Principio de Pareto:</b> pocas causas vitales frente a muchas triviales. Vale igual para defectos de calidad, referencias de almacén o clientes.
  <span class="hint">Baja la concentración hasta 0,3: la distribución se aplana y el principio de Pareto deja de cumplirse. Comprobarlo con los datos reales es el primer paso antes de aplicar la clasificación.</span>`);}});

document.querySelectorAll("[data-sim]").forEach(function(el){var k=el.getAttribute("data-sim");if(SIMS[k]){try{SIMS[k](el);}catch(e){console.error("sim "+k,e);}}else console.warn("sim no encontrada: "+k);});
})();
