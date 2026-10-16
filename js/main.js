(()=>{
'use strict';
const CONFIG={
  email:'hassanazan1r55@gmail.com',
  githubUsername:'hassanazan1r55-ux',
  formspreeEndpoint:'[FILL_FORMSPREE_URL]',
  repoCacheKey:'portfolio-public-repos-v1',
  themeStorageKey:'portfolio-theme',
  loaderStorageKey:'portfolio-loader-seen',
  resumePath:'assets/resume.pdf',
  siteUrl:'https://jarvis-delta-gray.vercel.app/'
};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const safeStore={get(k){try{return sessionStorage.getItem(k)}catch{return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch{}}};
$('#yr').textContent=new Date().getFullYear();

/* Theme is applied in the head before CSS paints; system preference is the default. */
const themeButton=$('#theme-toggle');
function setTheme(theme,persist=true){
  const next=theme==='light'?'light':'dark';root.dataset.theme=next;
  if(persist){try{localStorage.setItem(CONFIG.themeStorageKey,next)}catch{}}
  if(themeButton){themeButton.setAttribute('aria-label',next==='dark'?'Switch to light theme':'Switch to dark theme');themeButton.setAttribute('aria-pressed',String(next==='light'))}
  const meta=$('#theme-color-meta');if(meta)meta.content=next==='light'?'#f5f8fc':'#05080f';
}
themeButton?.addEventListener('click',()=>setTheme(root.dataset.theme==='dark'?'light':'dark'));

/* One short intro per tab session; no timer can hold the page beyond 1.15s. */
const loader=$('#intro-loader');
if(loader){
  if(safeStore.get(CONFIG.loaderStorageKey)||reduce){loader.classList.add('done')}
  else{const finish=()=>{loader.classList.add('done');safeStore.set(CONFIG.loaderStorageKey,'1')};setTimeout(finish,850);loader.addEventListener('click',finish,{once:true});addEventListener('keydown',e=>{if(e.key==='Escape')finish()},{once:true})}
}
/* Existing hero reveal sequence, with a bounded fallback. */
let started=false;const start=()=>{if(started)return;started=true;requestAnimationFrame(()=>root.classList.add('ready'))};
if(document.fonts?.ready){document.fonts.ready.then(start);setTimeout(start,700)}else start();

/* Mobile navigation and current section state. */
const burger=$('#burger'),menu=$('#menu');
const closeMenu=()=>{menu.classList.remove('open');burger?.setAttribute('aria-expanded','false')};
burger?.addEventListener('click',()=>{const open=menu.classList.toggle('open');burger.setAttribute('aria-expanded',String(open))});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
const nav=$('#nav'),prog=$('#progress');let lastY=0,ticking=false;
function onScroll(){const y=scrollY,h=root.scrollHeight-root.clientHeight;if(prog)prog.style.transform='scaleX('+(h>0?y/h:0)+')';nav?.classList.toggle('scrolled',y>20);nav?.classList.toggle('hide',y>lastY+4&&y>400&&!menu?.classList.contains('open'));if(y<lastY-4||y<=400)nav?.classList.remove('hide');lastY=y;ticking=false}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
const navLinks=$$('#menu a:not(.cta)');
if('IntersectionObserver'in window){const spy=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)navLinks.forEach(a=>a.classList.toggle('act',a.getAttribute('href')==='#'+en.target.id))}),{rootMargin:'-45% 0px -50% 0px'});$$('main section[id]').forEach(s=>spy.observe(s));
const reveal=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const el=en.target,siblings=[...el.parentElement.children].filter(c=>c.hasAttribute('data-reveal'));el.style.transitionDelay=reduce?'0s':Math.max(0,siblings.indexOf(el))*.1+'s';el.classList.add('in');reveal.unobserve(el)}),{threshold:.12,rootMargin:'0px 0px -5% 0px'});$$('[data-reveal]').forEach(e=>reveal.observe(e));
}else $$('[data-reveal]').forEach(e=>e.classList.add('in'));

/* Mouse-only effects stay transform/opacity based and are disabled for reduced motion. */
if(fine&&!reduce){
 const spot=$('#spot');let px=innerWidth/2,py=innerHeight*.3,raf=0;
 addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY;if(!raf)raf=requestAnimationFrame(()=>{raf=0;spot?.style.setProperty('--mx',px+'px');spot?.style.setProperty('--my',py+'px')})},{passive:true});
 const art=$('#art');addEventListener('pointermove',e=>{art?.style.setProperty('--px',((e.clientX/innerWidth-.5)*-20).toFixed(1)+'px');art?.style.setProperty('--py',((e.clientY/innerHeight-.5)*-20).toFixed(1)+'px')},{passive:true});
 $$('.card').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%');c.style.setProperty('--ry',((x-.5)*4).toFixed(2)+'deg');c.style.setProperty('--rx',((.5-y)*4).toFixed(2)+'deg')});c.addEventListener('pointerleave',()=>{c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')})});
 $$('[data-magnet]').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.12).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.15).toFixed(1)+'px)'});b.addEventListener('pointerleave',()=>b.style.transform='')});
}

/* Live public repositories. A failure leaves the original static project cards intact. */
const cards=$('#project-cards'),repoStatus=$('#repo-status');
function safeText(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function relativeDate(date){const d=new Date(date);if(Number.isNaN(d.getTime()))return 'Update date unavailable';return 'Updated '+new Intl.DateTimeFormat('en',{dateStyle:'medium'}).format(d)}
function renderRepos(repos){
 const valid=repos.filter(r=>!r.fork).sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at));
 if(!valid.length)return false;
 const staticCards=cards.querySelectorAll('.card:not(.repo-card)');
 valid.forEach(repo=>{
  if(repo.name.toLowerCase()==='jarvis')return;
  const article=document.createElement('article');article.className='card repo-card';article.setAttribute('data-reveal','');article.setAttribute('data-spot','');
  const language=repo.language||'Language not specified';
  article.innerHTML='<div class="meta"><span>GitHub repository</span><span class="language">'+safeText(language)+'</span></div><h3>'+safeText(repo.name)+'</h3><p>'+safeText(repo.description||'No description provided yet.')+'</p><p class="updated">'+safeText(relativeDate(repo.updated_at))+'</p><a class="more" href="'+safeText(repo.html_url)+'" target="_blank" rel="noopener noreferrer">View repository <b aria-hidden="true">→</b></a>';
  cards.appendChild(article);
 });
 if(window.IntersectionObserver)cards.querySelectorAll('.repo-card').forEach(e=>{e.classList.add('in')});
 return true;
}
async function loadRepos(){
 if(!cards)return;
 try{
  const cached=safeStore.get(CONFIG.repoCacheKey);
  if(cached){const parsed=JSON.parse(cached);if(Array.isArray(parsed)&&renderRepos(parsed)){repoStatus.textContent='Public repositories loaded from this session cache.';return}}
  const response=await fetch('https://api.github.com/users/'+encodeURIComponent(CONFIG.githubUsername)+'/repos?sort=updated&per_page=100&type=owner',{headers:{Accept:'application/vnd.github+json'},cache:'no-store'});
  if(!response.ok)throw new Error('GitHub API returned '+response.status);
  const data=await response.json();if(!Array.isArray(data))throw new Error('Unexpected GitHub response');
  const repos=data.filter(r=>!r.fork);safeStore.set(CONFIG.repoCacheKey,JSON.stringify(repos));
  if(renderRepos(repos))repoStatus.textContent='Showing public repositories from GitHub. The original featured projects remain above.';
  else repoStatus.textContent='Your featured projects are shown. No additional public repositories were found.';
 }catch(error){repoStatus.textContent='Live repositories are temporarily unavailable; featured projects are still available above.';console.info('GitHub repository list unavailable; using static cards.',error.message)}
}
loadRepos();

/* Resume is optional: check availability and explain when the file has not been added yet. */
const resumeLink=$('#resume-link'),resumeNote=$('#resume-note');
resumeLink?.addEventListener('click',async e=>{
 try{const r=await fetch(CONFIG.resumePath,{method:'HEAD',cache:'no-store'});if(!r.ok)throw new Error('missing')}
 catch{e.preventDefault();if(resumeNote)resumeNote.textContent='Resume PDF is not uploaded yet. Add your file at assets/resume.pdf, then this link will work.'}
});

/* Contact: Formspree endpoint when configured; mailto fallback when not configured or request fails. */
const form=$('#form'),note=$('#note'),sendButton=$('#send-btn');
form?.addEventListener('submit',async e=>{
 e.preventDefault();if(!form.reportValidity())return;
 const data=new FormData(form),name=String(data.get('name')||'').trim(),email=String(data.get('email')||'').trim(),message=String(data.get('message')||'').trim(),trap=String(data.get('_gotcha')||'').trim();
 note.classList.remove('err');note.textContent='';
 if(trap)return;
 if(!name||!email||!message){note.classList.add('err');note.textContent='Please complete every field.';return}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){note.classList.add('err');note.textContent='Enter a valid email address.';return}
 const endpoint=CONFIG.formspreeEndpoint;
 if(endpoint&&endpoint!=='[FILL_FORMSPREE_URL]'&&/^https:\/\/formspree\.io\/f\//.test(endpoint)){
  sendButton.disabled=true;sendButton.querySelector('.send-label').textContent='Sending…';note.textContent='Sending your message securely…';
  try{const response=await fetch(endpoint,{method:'POST',body:data,headers:{Accept:'application/json'}});if(!response.ok)throw new Error('Form submission failed');form.reset();note.textContent='Message sent successfully. Thank you for reaching out.';return}
  catch{note.classList.add('err');note.textContent='The form could not send your message. Opening your email app as a fallback.'}
  finally{sendButton.disabled=false;sendButton.querySelector('.send-label').textContent='Send message'}
 }else note.textContent='Formspree is not configured yet. Opening your email app instead.';
 const subject='Portfolio message from '+name;
 location.href='mailto:'+CONFIG.email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent('From: '+name+' ('+email+')\n\n'+message);
});

/* Accessible command palette: search, arrow navigation, Enter, Escape and focus return. */
const backdrop=$('#palette-backdrop'),paletteInput=$('#palette-input'),results=$('#palette-results'),paletteTrigger=$('#palette-trigger');
const commands=[
 {label:'Go to Home',detail:'Section',run:()=>location.hash='home'},
 {label:'Go to Skills',detail:'Section',run:()=>location.hash='skills'},
 {label:'Go to Projects',detail:'Section',run:()=>location.hash='projects'},
 {label:'Go to Resume',detail:'Section',run:()=>location.hash='resume'},
 {label:'Go to Learning log',detail:'Section',run:()=>location.hash='learning'},
 {label:'Go to Contact',detail:'Section',run:()=>location.hash='contact'},
 {label:'Go to About',detail:'Section',run:()=>location.hash='about'},
 {label:'Open ARIA case study',detail:'Project',run:()=>location.href='projects/aria/'},
 {label:'Open GitHub profile',detail:'External link',run:()=>window.open('https://github.com/'+CONFIG.githubUsername,'_blank','noopener,noreferrer')},
 {label:'Send an email',detail:'Contact',run:()=>location.href='mailto:'+CONFIG.email},
 {label:'Toggle theme',detail:'Appearance',run:()=>setTheme(root.dataset.theme==='dark'?'light':'dark')}
];
let visibleCommands=[],activeIndex=0,previousFocus=null;
function drawCommands(query=''){
 visibleCommands=commands.filter(c=>(c.label+' '+c.detail).toLowerCase().includes(query.toLowerCase()));activeIndex=Math.min(activeIndex,Math.max(0,visibleCommands.length-1));results.innerHTML='';
 visibleCommands.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='command-item';b.setAttribute('role','option');b.setAttribute('aria-selected',String(i===activeIndex));b.innerHTML='<span>'+safeText(c.label)+'</span><small>'+safeText(c.detail)+'</small>';b.addEventListener('mouseenter',()=>{activeIndex=i;syncActive()});b.addEventListener('click',()=>chooseCommand(i));results.appendChild(b)});
 if(!visibleCommands.length){const p=document.createElement('p');p.className='palette-hint';p.textContent='No matching commands.';results.appendChild(p)}
}
function syncActive(){results.querySelectorAll('.command-item').forEach((b,i)=>b.setAttribute('aria-selected',String(i===activeIndex)));results.querySelectorAll('.command-item')[activeIndex]?.scrollIntoView({block:'nearest'})}
function openPalette(){previousFocus=document.activeElement;backdrop.hidden=false;drawCommands('');paletteInput.value='';paletteInput.focus()}
function closePalette(){backdrop.hidden=true;previousFocus?.focus?.()}
function chooseCommand(i){const c=visibleCommands[i];if(!c)return;closePalette();c.run()}
paletteTrigger?.addEventListener('click',openPalette);paletteInput?.addEventListener('input',()=>{activeIndex=0;drawCommands(paletteInput.value)});
backdrop?.addEventListener('click',e=>{if(e.target===backdrop)closePalette()});
addEventListener('keydown',e=>{
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(backdrop.hidden)openPalette();else closePalette();return}
 if(e.key==='Escape'){closeMenu();if(backdrop&&!backdrop.hidden)closePalette();return}
 if(backdrop?.hidden)return;
 if(e.key==='ArrowDown'){e.preventDefault();activeIndex=Math.min(activeIndex+1,visibleCommands.length-1);syncActive()}
 else if(e.key==='ArrowUp'){e.preventDefault();activeIndex=Math.max(0,activeIndex-1);syncActive()}
 else if(e.key==='Enter'&&document.activeElement===paletteInput){e.preventDefault();chooseCommand(activeIndex)}
});
/* Short page exit transition only for same-origin navigation; never blocks reduced-motion users. */
if(!reduce){document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank'||a.origin!==location.origin||a.hash||a.id==='resume-link'||a.href.startsWith('mailto:')||a.href.startsWith('tel:'))return;const url=new URL(a.href);if(url.pathname===location.pathname||/\\.(pdf|png|jpe?g|svg|webp|zip)$/i.test(url.pathname))return;e.preventDefault();document.body.classList.add('page-leave');setTimeout(()=>location.href=a.href,130)})}
})();