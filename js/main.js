(()=>{
'use strict';

const CONFIG={
  email:'hassanazan1r55@gmail.com',
  githubUsername:'hassanazan1r55-ux',
  githubProfile:'https://github.com/hassanazan1r55-ux',
  formspreeEndpoint:'[FILL_FORMSPREE_URL]',
  resumePath:'assets/resume.pdf',
  repoCacheKey:'portfolio-public-repos-v1',
  repoCacheMaxAgeMs:30*60*1000,
  introSessionKey:'portfolio-intro-seen-v1',
  siteUrl:'https://jarvis-delta-gray.vercel.app/',
  milestones:[
    {date:'[FILL_DATE_1]',title:'[SAMPLE — replace with a real milestone]',description:'[FILL_MILESTONE_1: what you built or learned, and what changed because of it.]'},
    {date:'[FILL_DATE_2]',title:'[SAMPLE — replace with a real milestone]',description:'[FILL_MILESTONE_2: a concrete project, concept, or problem you worked through.]'},
    {date:'[FILL_DATE_3]',title:'[SAMPLE — replace with a real milestone]',description:'[FILL_MILESTONE_3: what you learned and what you plan to practise next.]'}
  ]
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

/* Contact form: validate, submit to Formspree when configured, otherwise use mailto. */
const form=$('#form'),note=$('#note'),sendButton=$('#send-message');
const setFormMessage=(message,error=false)=>{note.textContent=message;note.classList.toggle('err',error)};
form.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  const name=$('#fn').value.trim(),email=$('#femail').value.trim(),subject=$('#fsubject').value.trim(),message=$('#fm').value.trim();
  if($('#website').value.trim())return;
  if(!name||!email||!subject||!message){setFormMessage('Please complete every field.',true);return}
  const endpoint=CONFIG.formspreeEndpoint;
  if(endpoint&&!endpoint.includes('[FILL_')&&/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(endpoint)){
    sendButton.disabled=true;sendButton.setAttribute('aria-busy','true');sendButton.querySelector('.button-label').textContent='Sending…';setFormMessage('Sending your message…');
    try{
      const response=await fetch(endpoint,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify({name,email,subject,message,_subject:subject})});
      if(!response.ok)throw new Error('Form submission failed');
      form.reset();setFormMessage('Message sent successfully. Thank you for reaching out.');
    }catch(error){setFormMessage('The form could not send your message. You can use the email link below instead.',true)}
    finally{sendButton.disabled=false;sendButton.removeAttribute('aria-busy');sendButton.querySelector('.button-label').textContent='Send message'}
  }else{
    const body='Name: '+name+'\nEmail: '+email+'\n\n'+message;
    setFormMessage('Form service is not configured. Opening your mail app instead.');
    location.href='mailto:'+CONFIG.email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  }
});

/* Theme preference: saved choice wins; otherwise follow the operating system. */
const themeToggle=$('#theme-toggle');
function applyTheme(theme,save=true){
  const next=theme==='light'?'light':'dark';
  root.dataset.theme=next;root.style.colorScheme=next;
  if(save){try{localStorage.setItem('portfolio-theme',next)}catch(error){}}
  themeToggle.setAttribute('aria-label',next==='dark'?'Switch to light theme':'Switch to dark theme');
  themeToggle.setAttribute('aria-pressed',String(next==='light'));
  $('#theme-icon').textContent=next==='dark'?'Light':'Dark';
  const meta=$('#theme-color-meta');if(meta)meta.content=next==='dark'?'#05080f':'#f4f8fc';
}
themeToggle.addEventListener('click',()=>applyTheme(root.dataset.theme==='dark'?'light':'dark'));
const systemTheme=matchMedia('(prefers-color-scheme: light)');
systemTheme.addEventListener?.('change',e=>{let saved=null;try{saved=localStorage.getItem('portfolio-theme')}catch(error){}if(!saved)applyTheme(e.matches?'light':'dark',false)});
applyTheme(root.dataset.theme|| (systemTheme.matches?'light':'dark'),false);

/* GitHub projects: keep static cards visible as a reliable fallback. */
const repoHost=$('#github-projects'),repoStatus=$('#github-status');
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateLabel=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?'Date unavailable':new Intl.DateTimeFormat('en',{year:'numeric',month:'short',day:'numeric'}).format(d)};
function renderRepos(repos){
  if(!Array.isArray(repos)||!repos.length)return false;
  const fragment=document.createDocumentFragment();
  repos.forEach(repo=>{
    const article=document.createElement('article');article.className='card repo-card';article.setAttribute('data-reveal','');
    const language=repo.language||'Not specified';
    article.innerHTML='<div class="meta"><span>GitHub repository</span><span>'+escapeHTML(language)+'</span></div><h3>'+escapeHTML(repo.name)+'</h3><p>'+escapeHTML(repo.description||'No description has been added yet.')+'</p><div class="repo-meta"><span>Updated '+escapeHTML(dateLabel(repo.updated_at))+'</span></div><a class="more" href="'+escapeHTML(repo.html_url)+'" target="_blank" rel="noopener noreferrer">View repository <b aria-hidden="true">→</b></a>';
    fragment.appendChild(article);
  });
  repoHost.appendChild(fragment);
  repoHost.setAttribute('aria-busy','false');
  repoStatus.textContent='Public repositories from GitHub · '+repos.length+' shown';
  repoHost.querySelectorAll('[data-reveal]').forEach(el=>{if(reduce)el.classList.add('in');else reveal.observe(el)});
  return true;
}
async function loadRepos(){
  const cacheRead=()=>{try{const c=JSON.parse(sessionStorage.getItem(CONFIG.repoCacheKey)||'null');return c&&Date.now()-c.time<CONFIG.repoCacheMaxAgeMs&&Array.isArray(c.repos)?c.repos:null}catch(error){return null}};
  const cacheWrite=repos=>{try{sessionStorage.setItem(CONFIG.repoCacheKey,JSON.stringify({time:Date.now(),repos}))}catch(error){}};
  const cached=cacheRead();if(cached&&renderRepos(cached))return;
  try{
    const response=await fetch('https://api.github.com/users/'+encodeURIComponent(CONFIG.githubUsername)+'/repos?per_page=100&sort=updated&type=owner',{headers:{Accept:'application/vnd.github+json'},cache:'no-store'});
    if(!response.ok)throw new Error('GitHub API returned '+response.status);
    const data=await response.json();
    const repos=data.filter(r=>!r.fork&&!r.archived).sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at)).slice(0,12);
    if(!repos.length)throw new Error('No public repositories returned');
    cacheWrite(repos);renderRepos(repos);
  }catch(error){
    repoHost.setAttribute('aria-busy','false');
    repoStatus.textContent='Live repositories are temporarily unavailable. Featured projects remain available above.';
  }
}
loadRepos();

/* Resume link: avoid a broken download if the optional PDF has not been added. */
const resumeLink=$('#resume-link'),resumeNote=$('#resume-note');
resumeLink.addEventListener('click',async e=>{
  if(location.protocol==='file:'){resumeNote.textContent='Add your PDF at assets/resume.pdf before using this link.';e.preventDefault();return}
  e.preventDefault();
  try{const response=await fetch(CONFIG.resumePath,{method:'HEAD',cache:'no-store'});if(!response.ok)throw new Error('Missing resume');location.href=CONFIG.resumePath}
  catch(error){resumeNote.textContent='Resume PDF not added yet. Place your file at assets/resume.pdf.'}
});

/* Command palette: searchable, fully keyboard-operable command list. */
const palette=$('#command-palette'),backdrop=$('#palette-backdrop'),paletteInput=$('#palette-input'),results=$('#palette-results');
const commands=[
  {label:'Go to Home',hint:'Section',run:()=>location.hash='home'},
  {label:'Go to Skills',hint:'Section',run:()=>location.hash='skills'},
  {label:'Go to Projects',hint:'Section',run:()=>location.hash='projects'},
  {label:'Go to Resume',hint:'Section',run:()=>location.hash='resume'},
  {label:'Go to Learning log',hint:'Section',run:()=>location.hash='learning'},
  {label:'Go to Contact',hint:'Section',run:()=>location.hash='contact'},
  {label:'Go to About',hint:'Section',run:()=>location.hash='about'},
  {label:'Open ARIA live project',hint:'Project',run:()=>location.href='projects/aria/'},
  {label:'Read ARIA case study',hint:'Project',run:()=>location.href='projects/aria/case-study.html'},
  {label:'Open email',hint:'Contact',run:()=>location.href='mailto:'+CONFIG.email},
  {label:'Open GitHub profile',hint:'External link',run:()=>window.open(CONFIG.githubProfile,'_blank','noopener,noreferrer')},
  {label:'Toggle colour theme',hint:'Appearance',run:()=>applyTheme(root.dataset.theme==='dark'?'light':'dark')}
];
let activeCommand=0,previousFocus=null;
function drawCommands(query=''){
  const q=query.trim().toLowerCase(),filtered=commands.filter(c=>(c.label+' '+c.hint).toLowerCase().includes(q));
  activeCommand=Math.min(activeCommand,Math.max(0,filtered.length-1));
  results.innerHTML='';
  filtered.forEach((command,index)=>{const b=document.createElement('button');b.type='button';b.className='palette-option'+(index===activeCommand?' active':'');b.setAttribute('role','option');b.setAttribute('aria-selected',String(index===activeCommand));b.innerHTML='<span>'+escapeHTML(command.label)+'</span><small>'+escapeHTML(command.hint)+'</small>';b.addEventListener('click',()=>runCommand(command));b.addEventListener('mousemove',()=>{activeCommand=index;drawCommands(paletteInput.value)});results.appendChild(b)});
  if(!filtered.length){const empty=document.createElement('p');empty.className='palette-empty';empty.textContent='No matching commands.';results.appendChild(empty)}
  return filtered;
}
function openPalette(){
  previousFocus=document.activeElement;palette.hidden=false;backdrop.hidden=false;paletteInput.value='';activeCommand=0;drawCommands();paletteInput.focus();
}
function closePalette(){palette.hidden=true;backdrop.hidden=true;if(previousFocus&&previousFocus.focus)previousFocus.focus()}
function runCommand(command){closePalette();command.run()}
$('#palette-open').addEventListener('click',openPalette);
backdrop.addEventListener('click',closePalette);
paletteInput.addEventListener('input',()=>{activeCommand=0;drawCommands(paletteInput.value)});
paletteInput.addEventListener('keydown',e=>{
  const filtered=commands.filter(c=>(c.label+' '+c.hint).toLowerCase().includes(paletteInput.value.trim().toLowerCase()));
  if(e.key==='ArrowDown'){e.preventDefault();activeCommand=(activeCommand+1)%Math.max(filtered.length,1);drawCommands(paletteInput.value)}
  else if(e.key==='ArrowUp'){e.preventDefault();activeCommand=(activeCommand-1+Math.max(filtered.length,1))%Math.max(filtered.length,1);drawCommands(paletteInput.value)}
  else if(e.key==='Enter'){e.preventDefault();if(filtered[activeCommand])runCommand(filtered[activeCommand])}
  else if(e.key==='Escape'){e.preventDefault();closePalette()}
});
addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(palette.hidden)openPalette();else closePalette()}
  if(e.key==='Escape'&&!palette.hidden)closePalette();
});

/* Intro loader: under 1.2s, skip via button, click, or keyboard; once per session. */
const loader=$('#intro-loader');
if(loader){
  let seen=false;try{seen=sessionStorage.getItem(CONFIG.introSessionKey)==='1'}catch(error){}
  if(seen||reduce){loader.classList.add('loader-done');loader.hidden=true}
  else{
    const dismiss=()=>{loader.classList.add('loader-done');setTimeout(()=>{loader.hidden=true},250);try{sessionStorage.setItem(CONFIG.introSessionKey,'1')}catch(error){}};
    loader.addEventListener('click',dismiss);loader.addEventListener('keydown',e=>{if(e.key==='Escape'||e.key==='Enter'||e.key===' '){e.preventDefault();dismiss()}});
    setTimeout(dismiss,850);
  }
}

/* Footer year already populated above. Keep external links safe and motion reduced. */
})();
