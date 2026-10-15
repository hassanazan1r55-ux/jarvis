(()=>{
'use strict';

/* ================================================================
   EDIT YOUR DETAILS HERE. Anything left empty ('') is hidden from
   the page, so no placeholder text ever shows up for visitors.
   ================================================================ */
const CONFIG={
  name:'Azan',
  email:'',          // e.g. 'you@gmail.com'. Powers the mail link and the contact form
  formEndpoint:'',   // optional: a Formspree URL, sends messages without opening a mail app
  social:{
    github:'https://github.com/hassanazan1r55-ux',
    instagram:''     // e.g. 'https://instagram.com/yourname'
  },
  projects:{         // link for each project card; empty = shows "Coming soon"
    aria:'projects/aria/',
    snake:'',
    anime:'',
    roadmap:'',
    site:'https://github.com/hassanazan1r55-ux/jarvis'
  }
};

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};

/* ---------- footer year ---------- */
$('#yr').textContent=new Date().getFullYear();

/* ---------- theme ---------- */
const THEMES=['cyan','green','amber','violet'];
const THEME_RGB={cyan:'56,232,255',green:'80,255,150',amber:'255,176,64',violet:'184,144,255'};
let particleRGB=THEME_RGB.cyan;
function setTheme(t,save){
  if(!THEMES.includes(t))return false;
  document.documentElement.dataset.theme=t;
  particleRGB=THEME_RGB[t];
  $$('[data-set-theme]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.setTheme===t));
  if(save)store.set('theme',t);
  return true;
}
setTheme(THEMES.includes(store.get('theme'))?store.get('theme'):'cyan');
$$('[data-set-theme]').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.setTheme,true)));

/* ---------- mobile menu ---------- */
const burger=$('#burger'),menu=$('#menu');
burger.addEventListener('click',()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger.setAttribute('aria-expanded',false)}));

/* ---------- scroll progress + active nav link ---------- */
const prog=$('#progress');
let ticking=false;
addEventListener('scroll',()=>{
  if(ticking)return;ticking=true;
  requestAnimationFrame(()=>{
    const h=document.documentElement;
    prog.style.transform='scaleX('+(h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight))+')';
    ticking=false;
  });
},{passive:true});
const navLinks=$$('#menu a');
const spy=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return;
  navLinks.forEach(a=>a.classList.toggle('act',a.getAttribute('href')==='#'+en.target.id&&!a.classList.contains('cta')));
}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(s=>spy.observe(s));

/* ---------- typing effect ---------- */
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

/* ---------- skill bars + counters (animate when scrolled into view) ---------- */
const countUp=e=>{
  const to=+e.dataset.count;let n=0;const step=Math.max(1,Math.ceil(to/60));
  if(reduce){e.textContent=to;return}
  const iv=setInterval(()=>{n=Math.min(to,n+step);e.textContent=n;if(n>=to)clearInterval(iv)},22);
};
const io=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return;
  io.unobserve(en.target);
  const b=en.target.querySelector('.bar u');if(b)b.style.width=b.dataset.w+'%';
  const c=en.target.querySelector('[data-count]');if(c)countUp(c);
}),{threshold:.3});
$$('.skill,.stats div').forEach(e=>io.observe(e));

/* ---------- projects: links from CONFIG + filters ---------- */
$$('.card').forEach(card=>{
  const link=card.querySelector('[data-link]'),url=CONFIG.projects[card.dataset.key];
  if(url){
    link.href=url;
    link.setAttribute('aria-label',link.textContent+': '+card.querySelector('h3').textContent);
    if(/^https?:/.test(url)){link.target='_blank';link.rel='noopener'}
  }else{
    const s=document.createElement('span');
    s.className='more soon';s.textContent='Coming soon';
    link.replaceWith(s);
  }
});
const filterBtns=$$('#filters button');
filterBtns.forEach(b=>b.addEventListener('click',()=>{
  filterBtns.forEach(x=>{const on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
  let shown=0;
  $$('.card').forEach(c=>{const ok=b.dataset.filter==='all'||c.dataset.cat===b.dataset.filter;c.hidden=!ok;if(ok)shown++});
  $('#empty').hidden=shown>0;
}));

/* card tilt (mouse only) */
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce){
  $$('.card').forEach(c=>{
    c.addEventListener('pointermove',e=>{
      const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.setProperty('--ry',(x*7).toFixed(2)+'deg');c.style.setProperty('--rx',(-y*7).toFixed(2)+'deg');
    });
    c.addEventListener('pointerleave',()=>{c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')});
  });
}

/* ---------- contact: only show what is actually configured ---------- */
const linksEl=$('#links');
function addLink(label,href,ext){
  const li=document.createElement('li'),a=document.createElement('a');
  a.textContent=label;a.href=href;if(ext){a.target='_blank';a.rel='noopener'}
  li.appendChild(a);linksEl.appendChild(li);
}
if(CONFIG.email)addLink('✉ '+CONFIG.email,'mailto:'+CONFIG.email,false);
if(CONFIG.social.github)addLink('⌥ '+CONFIG.social.github.replace(/^https?:\/\//,''),CONFIG.social.github,true);
if(CONFIG.social.instagram)addLink('◎ '+CONFIG.social.instagram.replace(/^https?:\/\//,''),CONFIG.social.instagram,true);

const form=$('#form'),note=$('#note');
if(!CONFIG.email&&!CONFIG.formEndpoint){
  form.hidden=true;$('.contact').classList.add('solo');
}
form.addEventListener('submit',async e=>{
  e.preventDefault();
  const n=$('#fn').value.trim(),m=$('#fm').value.trim();
  note.classList.remove('err');
  if(!n||!m){note.classList.add('err');note.textContent='Add your name and a message first.';return}
  if(CONFIG.formEndpoint){
    note.textContent='Sending...';
    try{
      const r=await fetch(CONFIG.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({name:n,message:m})});
      if(!r.ok)throw new Error(r.status);
      form.reset();note.textContent='Message sent. I will reply soon.';
    }catch(err){note.classList.add('err');note.textContent='Could not send. Please try again or use the links.'}
    return;
  }
  location.href='mailto:'+CONFIG.email+'?subject='+encodeURIComponent('Message from '+n)+'&body='+encodeURIComponent(m);
  note.textContent='Opening your mail app...';
});

/* ---------- terminal ---------- */
const out=$('#termOut'),tin=$('#termInput'),tform=$('#termForm');
const history=[];let hi=0;
function say(text,cls){
  const p=document.createElement('p');if(cls)p.className=cls;p.textContent=text;out.appendChild(p);out.scrollTop=out.scrollHeight;return p;
}
function sayLinks(items){
  items.forEach(([label,href,ext])=>{
    const p=document.createElement('p'),a=document.createElement('a');
    a.textContent=label;a.href=href;if(ext){a.target='_blank';a.rel='noopener'}
    p.appendChild(a);out.appendChild(p);
  });
  out.scrollTop=out.scrollHeight;
}
const COMMANDS={
  help(){
    say('Commands:');
    say('  whoami     who I am\n  skills     what I work with\n  projects   things I have built\n  now        what I am learning\n  contact    how to reach me\n  theme X    cyan, green, amber or violet\n  clear      wipe the screen');
  },
  whoami(){say('Azan. Student developer who likes clean interfaces, games and low-level code.')},
  skills(){
    say('HTML/CSS        90%\nJavaScript      80%\nGame/UI design  75%\nGit/GitHub      70%\nC language      65%\nCybersecurity   40%');
  },
  projects(){
    $$('.card').forEach(c=>say('• '+c.querySelector('h3').textContent));
    say('Scroll down to open them.','dim');
  },
  now(){say('Mastering C, building logic, and working towards cybersecurity. Small progress every day.')},
  contact(){
    const l=[];
    if(CONFIG.email)l.push([CONFIG.email,'mailto:'+CONFIG.email,false]);
    if(CONFIG.social.github)l.push([CONFIG.social.github.replace(/^https?:\/\//,''),CONFIG.social.github,true]);
    if(CONFIG.social.instagram)l.push([CONFIG.social.instagram.replace(/^https?:\/\//,''),CONFIG.social.instagram,true]);
    if(l.length)sayLinks(l);else say('No contact details are set up yet.','dim');
  },
  theme(arg){
    if(!arg){say('Usage: theme '+THEMES.join(' | '),'dim');return}
    if(setTheme(arg,true))say('Theme set to '+arg+'.','ok');
    else say('Unknown theme "'+arg+'". Try: '+THEMES.join(', ')+'.','dim');
  },
  clear(){out.textContent=''},
  sudo(){say('Permission denied. Nice try.','dim')}
};
function run(raw){
  const line=raw.trim();if(!line)return;
  history.push(line);hi=history.length;
  say(line,'cmd');
  const [name,...rest]=line.split(/\s+/),fn=COMMANDS[name.toLowerCase()];
  if(fn&&Object.prototype.hasOwnProperty.call(COMMANDS,name.toLowerCase()))fn(rest[0]&&rest[0].toLowerCase());
  else say('command not found: '+name+'. Type help.','dim');
}
tform.addEventListener('submit',e=>{e.preventDefault();run(tin.value);tin.value=''});
tin.addEventListener('keydown',e=>{
  if(e.key==='ArrowUp'&&history.length){e.preventDefault();hi=Math.max(0,hi-1);tin.value=history[hi]||''}
  else if(e.key==='ArrowDown'&&history.length){e.preventDefault();hi=Math.min(history.length,hi+1);tin.value=history[hi]||''}
});
$$('#chips button').forEach(b=>b.addEventListener('click',()=>run(b.dataset.cmd)));
/* press "/" anywhere to jump into the terminal */
addEventListener('keydown',e=>{
  if(e.key==='/'&&!/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)){
    e.preventDefault();$('#home').scrollIntoView();tin.focus({preventScroll:true});
  }
});
/* boot sequence: the one page-load moment */
(function boot(){
  const lines=[['ARIA neural interface online.','ok'],['Hello, visitor. Type help or tap a command below.','dim']];
  if(reduce){lines.forEach(l=>say(l[0],l[1]));return}
  lines.forEach((l,i)=>setTimeout(()=>say(l[0],l[1]),500+i*700));
  setTimeout(()=>run('whoami'),2100);
})();

/* ---------- particle network background ---------- */
const cv=$('#bg'),cx=cv.getContext('2d');let W,H,P=[];
const mouse={x:-999,y:-999};
addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY},{passive:true});
addEventListener('pointerleave',()=>{mouse.x=mouse.y=-999});
function size(){
  const d=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);
  const n=Math.min(90,Math.round(W*H/20000));
  P=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:-(.1+Math.random()*.3),r:.6+Math.random()*1.4,a:.25+Math.random()*.55}));
}
size();addEventListener('resize',size);
function frame(){
  requestAnimationFrame(frame);if(document.hidden)return;
  cx.clearRect(0,0,W,H);
  for(const p of P){
    p.x+=p.vx;p.y+=p.vy;
    if(p.y<-4){p.y=H+4;p.x=Math.random()*W}
    if(p.x<-4)p.x=W+4;else if(p.x>W+4)p.x=-4;
    const dx=p.x-mouse.x,dy=p.y-mouse.y,d2=dx*dx+dy*dy;
    if(d2<14000&&d2>1){const f=.6/Math.sqrt(d2);p.x+=dx*f*.4;p.y+=dy*f*.4}
    cx.fillStyle='rgba('+particleRGB+','+(p.a*.7).toFixed(2)+')';
    cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill();
  }
  cx.lineWidth=.6;
  for(let i=0;i<P.length;i++){
    for(let j=i+1;j<P.length;j++){
      const a=P[i],b=P[j],dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy;
      if(d2<9000){cx.strokeStyle='rgba('+particleRGB+','+((1-d2/9000)*.22).toFixed(3)+')';cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}
    }
  }
}
if(!reduce)frame();
})();
