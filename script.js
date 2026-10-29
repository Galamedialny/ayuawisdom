const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('#nav');toggle?.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('open',!expanded)});document.addEventListener('keydown',e=>{if(e.key==='Escape'){toggle?.setAttribute('aria-expanded','false');nav?.classList.remove('open')}});
const whatsapp=document.createElement('a');
whatsapp.className='whatsapp-card';
whatsapp.href='https://wa.me/421908702337?text='+encodeURIComponent('Dobrý deň, Dominika, mám záujem o konzultáciu v AYUAWISDOM.');
whatsapp.target='_blank';
whatsapp.rel='noopener noreferrer';
whatsapp.setAttribute('aria-label','Napísať Dominike Baranikovej cez WhatsApp');
whatsapp.innerHTML='<span class="whatsapp-avatar"><img src="/assets/dominika-avatar.jpg" alt="" width="240" height="240"><span class="whatsapp-badge" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.3A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 7.5c0 4.4 4.1 8.3 8.3 8.3l1-2.3-2.6-1.1-1 1a8 8 0 0 1-3.5-3.5l1-1L10 6.5Z"/></svg></span></span><span class="whatsapp-copy"><strong>Napíšte mi na WhatsApp</strong><small>Dominika Baraniková · AYUAWISDOM</small></span>';
document.body.appendChild(whatsapp);

/* Google mapa v päte – načíta sa iba so súhlasom */
window.ayuaMaps=(()=>{
  const key='ayuawisdom-maps-consent-v1';
  const frames=[...document.querySelectorAll('.footer-map-frame')];
  const placeholders=new Map(frames.map(f=>[f,f.innerHTML]));
  function load(frame){
    if(frame.querySelector('iframe'))return;
    const iframe=document.createElement('iframe');
    iframe.src=frame.dataset.mapSrc;iframe.loading='lazy';
    iframe.referrerPolicy='no-referrer-when-downgrade';
    iframe.title='Mapa – AYUAWISDOM, Duklianskych hrdinov 1009, Vranov nad Topľou';
    iframe.setAttribute('allowfullscreen','');
    frame.innerHTML='';frame.appendChild(iframe);frame.classList.add('is-loaded');
  }
  function unload(frame){if(!frame.querySelector('iframe'))return;frame.innerHTML=placeholders.get(frame);frame.classList.remove('is-loaded');bind(frame)}
  function bind(frame){frame.querySelector('.map-load')?.addEventListener('click',()=>set(true))}
  function set(on){try{localStorage.setItem(key,on?'yes':'no')}catch{}frames.forEach(on?load:unload)}
  frames.forEach(bind);
  let saved=null;try{saved=localStorage.getItem(key)}catch{}
  if(saved==='yes')frames.forEach(load);
  return {set};
})();

/* Analytics: load only after explicit consent. */
(()=>{
  const id='G-WFYCMTRBX8',key='ayuawisdom-analytics-consent-v1';
  let allowed=false,loaded=false;
  const read=()=>{try{return localStorage.getItem(key)}catch{return null}};
  const panel=document.createElement('section');
  panel.className='analytics-consent';
  panel.setAttribute('aria-label','Nastavenie analytických cookies');
  panel.innerHTML='<strong>Pomôžete nám zlepšovať web?</strong><p>Po vašom súhlase používame Google Analytics na meranie návštevnosti a kliknutí na kontakty a Google Mapy na zobrazenie polohy centra. Tieto cookies sú dobrovoľné. <a href="/ochrana-osobnych-udajov/">Ochrana osobných údajov a cookies</a>.</p><div><button type="button" data-consent="yes">Prijať cookies</button><button type="button" data-consent="no">Odmietnuť</button></div>';
  const settings=document.createElement('button');
  settings.type='button';settings.className='analytics-settings';settings.textContent='Nastavenie cookies';
  document.querySelector('footer')?.appendChild(settings);
  document.body.appendChild(panel);
  function start(){
    allowed=true;window['ga-disable-'+id]=false;
    if(loaded)return;loaded=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments)};
    window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    window.gtag('js',new Date());
    window.gtag('config',id,{allow_google_signals:false,allow_ad_personalization_signals:false});
    const tag=document.createElement('script');tag.async=true;
    tag.src='https://www.googletagmanager.com/gtag/js?id='+id;
    document.head.appendChild(tag);
  }
  function choose(value){
    try{localStorage.setItem(key,value)}catch{}
    window.ayuaMaps?.set(value==='yes');
    panel.hidden=true;
    if(value==='yes'){start();return}
    allowed=false;window['ga-disable-'+id]=true;
    document.cookie.split(';').forEach(item=>{
      const name=item.trim().split('=')[0];
      if(!/^_ga(?:_|$)/.test(name))return;
      const domains=['','; domain='+location.hostname,'; domain=.ayuawisdom.sk'];
      domains.forEach(domain=>{document.cookie=name+'=; Max-Age=0; path=/'+domain+'; SameSite=Lax'});
    });
    if(loaded)location.reload();
  }
  panel.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.consent)));
  settings.addEventListener('click',()=>{panel.hidden=false;panel.querySelector('button').focus()});
  const saved=read();panel.hidden=saved==='yes'||saved==='no';
  if(saved==='yes')start();
  document.addEventListener('click',event=>{
    if(!allowed||!window.gtag)return;
    const link=event.target.closest('a[href]');if(!link)return;
    const href=link.getAttribute('href');
    const name=href.startsWith('tel:')?'phone_click':href.startsWith('https://wa.me/')?'whatsapp_click':null;
    if(name)window.gtag('event',name,{contact_method:name==='phone_click'?'phone':'whatsapp',transport_type:'beacon'});
  });
})();

/* Hero slider na úvodnej stránke */
(()=>{
  const root=document.querySelector('.hero-slider');if(!root)return;
  const slides=[...root.querySelectorAll('.slide')],dots=[...root.querySelectorAll('.slider-dot')];
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index=0,timer=null;
  function show(n){
    index=(n+slides.length)%slides.length;
    slides.forEach((slide,k)=>{const on=k===index;slide.classList.toggle('is-active',on);slide.setAttribute('aria-hidden',String(!on));slide.inert=!on});
    dots.forEach((dot,k)=>dot.setAttribute('aria-current',String(k===index)));
  }
  function stop(){clearInterval(timer);timer=null}
  function play(){if(reduce)return;stop();timer=setInterval(()=>show(index+1),7000)}
  root.querySelector('.slider-prev').addEventListener('click',()=>{show(index-1);play()});
  root.querySelector('.slider-next').addEventListener('click',()=>{show(index+1);play()});
  dots.forEach((dot,k)=>dot.addEventListener('click',()=>{show(k);play()}));
  root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',play);
  root.addEventListener('focusin',stop);root.addEventListener('focusout',play);
  let startX=null;
  root.addEventListener('touchstart',e=>{startX=e.touches[0].clientX},{passive:true});
  root.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX;startX=null;if(Math.abs(dx)>50){show(index+(dx<0?1:-1));play()}});
  document.addEventListener('visibilitychange',()=>document.hidden?stop():play());
  show(0);play();
})();

/* Podmenu Procedúry */
document.querySelectorAll('.has-sub').forEach(item=>{
  const btn=item.querySelector('.sub-toggle');
  btn?.addEventListener('click',e=>{e.stopPropagation();const open=!item.classList.contains('open');item.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open))});
  document.addEventListener('click',e=>{if(!item.contains(e.target)){item.classList.remove('open');btn?.setAttribute('aria-expanded','false')}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){item.classList.remove('open');btn?.setAttribute('aria-expanded','false')}});
});

/* FAQ: otvoriť otázku podľa odkazu */
(()=>{const open=()=>{let d=null;try{d=location.hash&&document.querySelector(location.hash)}catch{}if(d&&d.tagName==='DETAILS'){d.open=true;d.scrollIntoView({block:'start'})}};open();window.addEventListener('hashchange',open)})();

/* Landing /unavena/: odoslanie formulára do MailerLite a presmerovanie na poďakovanie */
document.querySelectorAll('form.lm-form').forEach(function(form){
  var btn=form.querySelector('button[type=submit]'),err=form.querySelector('.lm-error'),label=btn?btn.textContent:'';
  function done(){window.location.href=form.getAttribute('data-success')||'/';}
  function fail(msg){if(btn){btn.disabled=false;btn.textContent=label;}if(err){err.textContent=msg;err.hidden=false;}}
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return;}
    if(err)err.hidden=true;
    if(btn){btn.disabled=true;btn.textContent='Odosielam…';}
    var data=new FormData(form);
    /* súhlas sa overuje na webe (povinné pole); doklad súhlasu je potvrdenie e-mailu v MailerLite */
    data.delete('lm-consent');
    fetch(form.action,{method:'POST',body:data}).then(function(r){
      if(r.status===429)return {success:false,busy:true};
      return r.json().catch(function(){return {success:r.ok};});
    }).then(function(j){
      if(j&&j.success)return done();
      var f=(j&&j.errors&&j.errors.fields)||{};
      if(j&&j.busy)return fail('Práve je tu veľa pokusov naraz. Skús to, prosím, o pár minút.');
      if(f.email)return fail('E-mailová adresa vyzerá neplatne. Skontroluj ju, prosím, a skús to znova.');
      fail('Nepodarilo sa odoslať. Skús to znova alebo mi napíš na info@ayuawisdom.sk.');
    }).catch(function(){
      /* ak prehliadač nedovolí prečítať odpoveď, odošleme ešte raz bez nej */
      fetch(form.action,{method:'POST',body:data,mode:'no-cors'}).then(done).catch(function(){
        fail('Nepodarilo sa odoslať. Skontroluj pripojenie alebo mi napíš na info@ayuawisdom.sk.');
      });
    });
  });
});

/* Päta: odber noviniek cez MailerLite (dvojité potvrdenie) */
window.ayuaBindNl=function(form){if(form.dataset.bound)return;form.dataset.bound='1';
  var btn=form.querySelector('button[type=submit]'),msg=form.querySelector('.nl-msg'),label=btn?btn.textContent:'';
  function show(text,ok){if(msg){msg.textContent=text;msg.hidden=false;msg.classList.toggle('is-error',!ok);}}
  function done(){form.querySelectorAll('input,button').forEach(function(el){el.disabled=true});if(btn)btn.textContent='Hotovo';
    show('Ďakujem! Poslala som vám e-mail – kliknite v ňom na potvrdenie odberu.',true);
    try{localStorage.setItem('ayuawisdom-nl-subscribed','1')}catch(e){}
    if(window.gtag)window.gtag('event','newsletter_signup',{form_location:form.closest('.nl-popup')?'popup':'footer'});
    var pop=form.closest('.nl-popup');if(pop)setTimeout(function(){pop.close()},4000);}
  function fail(t){if(btn){btn.disabled=false;btn.textContent=label;}show(t,false);}
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return;}
    if(btn){btn.disabled=true;btn.textContent='Odosielam…';}
    var data=new FormData(form);
    data.set('fields[suhlas_gdpr]','áno, '+new Date().toISOString().slice(0,16).replace('T',' ')+' UTC, päta '+location.pathname);
    fetch(form.action,{method:'POST',body:data}).then(function(r){return r.json().catch(function(){return {success:r.ok};});})
    .then(function(j){if(j&&j.success)return done();fail('E-mailová adresa vyzerá neplatne. Skontrolujte ju, prosím, a skúste to znova.');})
    .catch(function(){fetch(form.action,{method:'POST',body:data,mode:'no-cors'}).then(done).catch(function(){fail('Nepodarilo sa odoslať. Skúste to neskôr alebo napíšte na info@ayuawisdom.sk.');});});
  });
};
document.querySelectorAll('form.nl-form').forEach(window.ayuaBindNl);

/* Vyskakovacie okno s odberom noviniek: raz za 14 dní, po prečítaní časti stránky */
(()=>{
  const src=document.querySelector('.footer-newsletter');
  if(!src||!window.HTMLDialogElement||location.pathname.startsWith('/unavena'))return;
  const KEY='ayuawisdom-nl-popup-v1',DAYS=14;
  const get=k=>{try{return localStorage.getItem(k)}catch{return null}};
  if(get('ayuawisdom-nl-subscribed'))return;
  const last=+get(KEY)||0;if(Date.now()-last<DAYS*864e5)return;
  const dlg=document.createElement('dialog');dlg.className='nl-popup';dlg.setAttribute('data-lenis-prevent','');dlg.setAttribute('aria-labelledby','nl-pop-title');
  dlg.innerHTML='<button type="button" class="nl-close" aria-label="Zavrieť">×</button>'+src.innerHTML.replace(/id="nl-title"/,'id="nl-pop-title"').replace(/(id|for)="nl-consent"/g,'$1="nl-consent-pop"').replace(/ data-bound="1"/g,'');
  dlg.querySelectorAll('img').forEach(i=>i.loading='eager');
  document.body.appendChild(dlg);
  window.ayuaBindNl(dlg.querySelector('form.nl-form'));
  let shown=false;
  const remember=()=>{try{localStorage.setItem(KEY,String(Date.now()))}catch{}};
  const open=()=>{
    if(shown)return;
    const consent=document.querySelector('.analytics-consent');
    if(consent&&!consent.hidden)return; /* najprv nech návštevník vyrieši cookies */
    if(document.activeElement&&document.activeElement.closest('.footer-newsletter'))return;
    shown=true;remember();window.ayuaLenis&&window.ayuaLenis.stop();dlg.showModal();dlg.tabIndex=-1;dlg.focus();dlg.classList.add('is-open');
    window.gtag&&window.gtag('event','newsletter_popup_view');
  };
  const close=()=>dlg.close();
  dlg.querySelector('.nl-close').addEventListener('click',close);
  dlg.addEventListener('click',e=>{if(e.target===dlg)close()});
  dlg.addEventListener('close',()=>{dlg.classList.remove('is-open');window.ayuaLenis&&window.ayuaLenis.start()});
  const onScroll=()=>{const h=document.documentElement;if((scrollY+innerHeight)/h.scrollHeight>0.55)open()};
  window.addEventListener('scroll',onScroll,{passive:true});
  setTimeout(open,45000);
  document.addEventListener('mouseout',e=>{if(!e.relatedTarget&&e.clientY<=0&&scrollY>400)open()});
})();

/* Video v úvode: pri šetriči dát alebo obmedzenom pohybe ostane len náhľad; mimo obrazovky sa pozastaví */
document.querySelectorAll('.proc-video video').forEach(v=>{
  const save=navigator.connection&&navigator.connection.saveData;
  const calm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(save||calm){v.removeAttribute('autoplay');v.pause();v.preload='none';return}
  if('IntersectionObserver' in window){new IntersectionObserver(es=>es.forEach(e=>{e.isIntersecting?v.play().catch(()=>{}):v.pause()}),{threshold:.2}).observe(v)}
});

/* Plynulé posúvanie (Lenis) – iba myš a touchpad, dotyk ostáva prirodzený; vypnuté pri obmedzení animácií */
(()=>{
  if(!window.Lenis||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const lenis=new Lenis({lerp:0.1,wheelMultiplier:1,smoothWheel:true});
  window.ayuaLenis=lenis;
  const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf);
  const offset=()=>-((document.querySelector('header')||{}).offsetHeight||0)-16;
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href^="#"]');
    if(!a||a.classList.contains('skip'))return;
    const id=a.getAttribute('href');if(id.length<2)return;
    let t=null;try{t=document.querySelector(id)}catch{}
    if(!t)return;
    e.preventDefault();lenis.scrollTo(t,{offset:offset()});
    history.pushState(null,'',id);
  });
  /* po načítaní stránky s kotvou (napr. /faq/#otazka-6) dorovnať pod hlavičku */
  if(location.hash){let t=null;try{t=document.querySelector(location.hash)}catch{}if(t)setTimeout(()=>lenis.scrollTo(t,{offset:offset(),immediate:true}),50)}
})();

/* Odkrývanie sekcií pri posúvaní */
(()=>{
  const root=document.documentElement;
  if(!root.classList.contains('js-anim')||!('IntersectionObserver' in window))return;
  const groups=['.service-grid>*','.concept-grid>*','.dosha-grid>*','.terms-grid>*','.pillars>*','.gallery>*','.steps>article','.education-grid>*','.education-steps>*','.faq-teaser-list li','.service-photos>*','.partner-courses li'];
  const singles=['main>section:not(:first-child) .section-heading','main>section:not(:first-child)>h2','main>section:not(:first-child)>.eyebrow','.intro-photo','.faq-teaser-text','.service-detail','.proc-for','.proc-good .proc-split','.prose-band','.contact-photo','.education-partner>div','.ayu-note','.idea-text','.cta>div','.footer-newsletter','.footer-map-frame'];
  const els=new Set();
  groups.forEach(sel=>document.querySelectorAll(sel).forEach(el=>{const i=[...el.parentElement.children].indexOf(el);el.style.setProperty('--d',Math.min(i,6)*0.08+'s');els.add(el)}));
  singles.forEach(sel=>document.querySelectorAll(sel).forEach(el=>els.add(el)));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:0.08});
  els.forEach(el=>{if(el.closest('main>section:first-child')||el.closest('.nl-popup'))return;el.classList.add('reveal');io.observe(el)});
})();
