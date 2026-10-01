(function(w){
var T=w.THREE;if(!T){return}
var cache={},views=[],started=0;
function ld(k,b){var u=b+'images/cut/'+k;if(cache[u])return cache[u];
return cache[u]=new Promise(function(res,rej){var L=new T.TextureLoader();L.load(u+'.webp',function(tex){tex.encoding=T.sRGBEncoding;tex.anisotropy=4;L.load(u+'_d.png',function(dep){res({tex:tex,dep:dep,w:tex.image.width,h:tex.image.height})},undefined,function(){res({tex:tex,w:tex.image.width,h:tex.image.height})})},undefined,rej)})}
function relief(o){var a=o.w/o.h,H=3.4,W=H*a;if(W>3.9){W=3.9;H=W/a}
var m=new T.MeshStandardMaterial({map:o.tex,emissive:0xffffff,emissiveMap:o.tex,emissiveIntensity:.55,roughness:1,metalness:0,transparent:true,alphaTest:.05,displacementMap:o.dep||null,displacementScale:o.dep?.5:0});
var me=new T.Mesh(new T.PlaneGeometry(W,H,110,110),m);me.userData={W:W,H:H,o:0,x:0};m.opacity=0;return me}
function shadow(){var c=document.createElement('canvas');c.width=256;c.height=64;var x=c.getContext('2d'),g=x.createRadialGradient(128,32,2,128,32,128);g.addColorStop(0,'rgba(0,0,0,.4)');g.addColorStop(1,'rgba(0,0,0,0)');x.translate(128,32);x.scale(1,.25);x.translate(-128,-32);x.fillStyle=g;x.fillRect(0,-120,256,320);
var s=new T.Mesh(new T.PlaneGeometry(4.2,1.05),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false}));return s}
function setup(box){var R;try{R=new T.WebGLRenderer({alpha:true,antialias:true})}catch(e){return null}
R.setPixelRatio(Math.min(devicePixelRatio||1,2));R.outputEncoding=T.sRGBEncoding;var cv=R.domElement;cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;touch-action:pan-y;cursor:grab;display:block';box.appendChild(cv);
var S=new T.Scene(),C=new T.PerspectiveCamera(30,1,.1,50);C.position.set(0,.25,8.3);C.lookAt(0,-.05,0);
S.add(new T.AmbientLight(0xffffff,.45));var dl=new T.DirectionalLight(0xffffff,.6);dl.position.set(3,4,7);S.add(dl);
function size(){var r=box.getBoundingClientRect();if(!r.width||!r.height)return;R.setSize(r.width,r.height,false);C.aspect=r.width/r.height;C.updateProjectionMatrix()}
size();if(w.ResizeObserver)new ResizeObserver(size).observe(box);else addEventListener('resize',size);
return {R:R,S:S,C:C,cv:cv,size:size}}
function viewer(box,keys,o){o=o||{};var b=o.base||'',E=setup(box);if(!E)return null;
var grp=new T.Group(),sh=shadow();E.S.add(grp);E.S.add(sh);var items=[],want=0,cur=-1,ry=0,rx=0,uy=0,ux=0,drag=0,lx=0,ly=0,vis=true;
function apply(){items.forEach(function(m,i){if(!m)return;var on=i===want;m.userData.o=on?1:0;m.userData.x=on?0:(i<want?-3.6:3.6)});
if(items[want]){sh.position.set(0,-items[want].userData.H/2+.02,-.15);box.classList.add('ok')}}
keys.forEach(function(k,i){ld(k,b).then(function(d){var m=relief(d);m.userData.x=3.6;m.position.x=3.6;items[i]=m;grp.add(m);apply()}).catch(function(){})});
function show(i){want=Math.max(0,Math.min(keys.length-1,i));apply()}
var cv=E.cv;cv.addEventListener('pointerdown',function(e){drag=1;lx=e.clientX;ly=e.clientY;cv.style.cursor='grabbing';try{cv.setPointerCapture(e.pointerId)}catch(x){}});
cv.addEventListener('pointermove',function(e){if(drag){uy=Math.max(-.85,Math.min(.85,uy+(e.clientX-lx)*.009));ux=Math.max(-.2,Math.min(.2,ux+(e.clientY-ly)*.003));lx=e.clientX;ly=e.clientY}else if(e.pointerType==='mouse'){var r=cv.getBoundingClientRect();uy=((e.clientX-r.left)/r.width-.5)*.9;ux=((e.clientY-r.top)/r.height-.5)*.16}});
function up(){drag=0;cv.style.cursor='grab'}cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
if(w.IntersectionObserver)new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(box);
views.push(function(t){if(!vis)return;var sc=o.scroll?scrollY*.0012:0;ry+=((Math.sin(t*.55)*.2+uy+sc)-ry)*.07;rx+=(ux-rx)*.07;
items.forEach(function(m){if(!m)return;var u=m.userData,p=m.material;p.opacity+=(u.o-p.opacity)*(u.o?.09:.2);m.position.x+=(u.x-m.position.x)*.09;m.visible=p.opacity>.02;m.rotation.y=ry;m.rotation.x=rx;m.position.y=Math.sin(t*1.1)*.05});
sh.material.opacity=1;E.R.render(E.S,E.C)});run();return {show:show}}
function run(){if(started)return;started=1;(function f(){requestAnimationFrame(f);var t=performance.now()/1000;views.forEach(function(v){v(t)})})()}
function intro(el,key,onShow,onEnd){var box=el.querySelector('.istage'),E=setup(box);if(!E){onEnd();return}E.C.position.z=9.6;
ld(key,'').then(function(d){var a=d.w/d.h,cols=9,rows=Math.max(6,Math.round(cols/a)),H=3.4,W=H*a;if(W>3.9){W=3.9;H=W/a}
var cv=document.createElement('canvas'),cw=cv.width=cols*12,ch=cv.height=rows*12,x=cv.getContext('2d');x.drawImage(d.tex.image,0,0,cw,ch);var px=x.getImageData(0,0,cw,ch).data,tiles=[],tw=W/cols,th=H/rows;
for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){var has=0;for(var yy=r*12;yy<r*12+12&&!has;yy++)for(var xx=c*12;xx<c*12+12;xx++)if(px[(yy*cw+xx)*4+3]>6){has=1;break}if(!has)continue;
var g=new T.PlaneGeometry(tw+.004,th+.004),u0=c/cols,u1=(c+1)/cols,v0=1-(r+1)/rows,v1=1-r/rows;g.attributes.uv.array.set([u0,v1,u1,v1,u0,v0,u1,v0]);
var m=new T.Mesh(g,new T.MeshBasicMaterial({map:d.tex,transparent:true,alphaTest:.03,side:T.DoubleSide})),ang=Math.random()*6.28,rad=7+Math.random()*7;
m.userData={fx:-W/2+tw*(c+.5),fy:H/2-th*(r+.5),sx:Math.cos(ang)*rad,sy:(Math.random()-.5)*10,sz:-4+Math.random()*10,rx:(Math.random()-.5)*12,ry:(Math.random()-.5)*12,rz:(Math.random()-.5)*12,dl:Math.random()*1.5};E.S.add(m);tiles.push(m)}
var rel=relief(d);rel.visible=false;E.S.add(rel);var t0=performance.now(),shown=0,ended=0;
(function f(){if(ended)return;requestAnimationFrame(f);var t=(performance.now()-t0)/1000;
tiles.forEach(function(m){var u=m.userData,k=Math.min(Math.max((t-u.dl)/1.7,0),1),e=1-Math.pow(1-k,3),i=1-e;m.position.set(u.fx+u.sx*i,u.fy+u.sy*i,u.sz*i);m.rotation.set(u.rx*i,u.ry*i,u.rz*i)});
if(t>3.4){tiles.forEach(function(m){m.visible=false});rel.visible=true;rel.material.opacity=1;rel.rotation.y=Math.sin((t-3.4)*1.4)*.35;rel.position.y=Math.sin(t*1.5)*.04}
if(t>3.2&&!shown){shown=1;onShow()}if(t>5.6){ended=1;onEnd()}
E.R.render(E.S,E.C)})()}).catch(function(){onEnd()})}
w.YAD3D={viewer:viewer,intro:intro}})(window);
