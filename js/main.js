(()=>{
'use strict';

const CONFIG={
  email:'hassanazan1r55@gmail.com'
};

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

/* footer year */
$('#yr').textContent=new Date().getFullYear();

/* start the hero sequence once fonts are ready (never wait more than 1s) */
let started=false;
const start=()=>{if(started)return;started=true;requestAnimationFrame(()=>root.classList.add('ready'))};
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(start);setTimeout(start,1000)}else start();

/* mobile menu */
const burger=$('#burger'),menu=$('#menu');
const closeMenu=()=>{menu.classList.remove('open');burger.setAttribute('aria-expanded','false')};
burger.addEventListener('click',()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',String(o))});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

/* nav state, scroll progress, hide on scroll down */
const nav=$('#nav'),prog=$('#progress');
let lastY=0,ticking=false;
function onScroll(){
  const y=scrollY,h=root.scrollHeight-root.clientHeight;
  prog.style.transform='scaleX('+(h>0?y/h:0)+')';
  nav.classList.toggle('scrolled',y>20);
  nav.classList.toggle('hide',y>lastY+4&&y>400&&!menu.classList.contains('open'));
  if(y<lastY-4||y<=400)nav.classList.remove('hide');
  lastY=y;ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
onScroll();

/* active nav link */
const links=$$('#menu a:not(.cta)');
const spy=new IntersectionObserver(es=>es.forEach(en=>{
  if(en.isIntersecting)links.forEach(a=>a.classList.toggle('act',a.getAttribute('href')==='#'+en.target.id));
}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(s=>spy.observe(s));

/* scroll reveal with a small stagger inside each group */
const reveal=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return;
  const el=en.target,sib=[...el.parentElement.children].filter(c=>c.hasAttribute('data-reveal'));
  const i=Math.max(0,sib.indexOf(el));
  el.style.transitionDelay=reduce?'0s':(i*0.12)+'s';
  el.classList.add('in');reveal.unobserve(el);
  setTimeout(()=>{el.style.transitionDelay=''},1400+i*120);
}),{threshold:.15,rootMargin:'0px 0px -6% 0px'});
$$('[data-reveal]').forEach(e=>reveal.observe(e));

/* cursor spotlight (mouse only) */
if(fine&&!reduce){
  const spot=$('#spot');let px=innerWidth/2,py=innerHeight*.3,raf=0;
  addEventListener('pointermove',e=>{
    px=e.clientX;py=e.clientY;
    if(!raf)raf=requestAnimationFrame(()=>{raf=0;spot.style.setProperty('--mx',px+'px');spot.style.setProperty('--my',py+'px')});
  },{passive:true});

  /* hero art parallax */
  const art=$('#art');
  addEventListener('pointermove',e=>{
    const x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);
    art.style.setProperty('--px',(x*-28).toFixed(1)+'px');art.style.setProperty('--py',(y*-28).toFixed(1)+'px');
  },{passive:true});

  /* card glow + tilt */
  $$('.card').forEach(c=>{
    c.addEventListener('pointermove',e=>{
      const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      c.style.setProperty('--mx',(x*100)+'%');c.style.setProperty('--my',(y*100)+'%');
      c.style.setProperty('--ry',((x-.5)*6).toFixed(2)+'deg');c.style.setProperty('--rx',((.5-y)*6).toFixed(2)+'deg');
    });
    c.addEventListener('pointerleave',()=>{c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')});
  });

  /* magnetic buttons */
  $$('[data-magnet]').forEach(b=>{
    b.addEventListener('pointermove',e=>{
      const r=b.getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2);
      b.style.transform='translate('+(x*.25).toFixed(1)+'px,'+(y*.35).toFixed(1)+'px)';
    });
    b.addEventListener('pointerleave',()=>{b.style.transition='transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .3s,background .3s,border-color .3s';b.style.transform='';setTimeout(()=>{b.style.transition=''},500)});
  });
}

/* contact form: opens the visitor's mail app with the message filled in */
const form=$('#form'),note=$('#note');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const n=$('#fn').value.trim(),m=$('#fm').value.trim();
  note.classList.remove('err');
  if(!n||!m){note.classList.add('err');note.textContent='Please add your name and a message.';return}
  location.href='mailto:'+CONFIG.email+'?subject='+encodeURIComponent('Message from '+n)+'&body='+encodeURIComponent(m);
  note.textContent='Opening your mail app...';
});
})();
