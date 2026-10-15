(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* footer year */
$('#yr').textContent=new Date().getFullYear();

/* mobile menu */
const burger=$('#burger'),menu=$('#menu');
burger.addEventListener('click',()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger.setAttribute('aria-expanded',false)}));

/* typing effect */
const words=['clean websites','browser games','cool interfaces','secure code'];
const el=$('#typed');let wi=0,ci=0,del=false;
function type(){
  const w=words[wi];
  if(reduce){el.textContent=w;return}
  el.textContent=w.slice(0,ci);
  if(!del&&ci<w.length){ci++;setTimeout(type,90)}
  else if(!del){del=true;setTimeout(type,1400)}
  else if(ci>0){ci--;setTimeout(type,45)}
  else{del=false;wi=(wi+1)%words.length;setTimeout(type,300)}
}
type();

/* reveal on scroll + skill bars + counters */
$$('.sec .st,.about p,.stats div,.skill,.card,.contact>*').forEach(e=>e.classList.add('rv'));
const countUp=e=>{
  const to=+e.dataset.count;let n=0;const step=Math.max(1,Math.ceil(to/60));
  const iv=setInterval(()=>{n=Math.min(to,n+step);e.textContent=n;if(n>=to)clearInterval(iv)},22);
};
const io=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return;
  const t=en.target;t.classList.add('in');io.unobserve(t);
  const b=t.querySelector&&t.querySelector('.bar u');if(b)b.style.width=b.dataset.w+'%';
  const c=t.querySelector&&t.querySelector('[data-count]');if(c)countUp(c);
}),{threshold:.15});
$$('.rv').forEach(e=>io.observe(e));

/* contact form (frontend only: opens the visitor's mail app) */
$('#form').addEventListener('submit',e=>{
  e.preventDefault();
  const n=$('#fn').value.trim(),m=$('#fm').value.trim(),note=$('#note');
  if(!n||!m){note.textContent='Please fill in both fields.';return}
  const to='yourmail@example.com';
  location.href='mailto:'+to+'?subject='+encodeURIComponent('Message from '+n)+'&body='+encodeURIComponent(m);
  note.textContent='Opening your mail app...';
});

/* particle background */
const cv=$('#bg'),cx=cv.getContext('2d');let W,H,P=[];
function size(){
  const d=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);
  P=Array.from({length:Math.round(W*H/22000)},()=>({x:Math.random()*W,y:Math.random()*H,v:.1+Math.random()*.35,r:.5+Math.random()*1.4,a:.2+Math.random()*.6}));
}
size();addEventListener('resize',size);
function frame(){
  requestAnimationFrame(frame);if(document.hidden)return;
  cx.clearRect(0,0,W,H);
  for(const p of P){p.y-=p.v;if(p.y<-4){p.y=H+4;p.x=Math.random()*W}cx.fillStyle='rgba(56,232,255,'+(p.a*.7).toFixed(2)+')';cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill()}
}
if(!reduce)frame();
})();
