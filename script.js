const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('#nav');toggle?.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('open',!expanded)});document.addEventListener('keydown',e=>{if(e.key==='Escape'){toggle?.setAttribute('aria-expanded','false');nav?.classList.remove('open')}});
const whatsapp=document.createElement('a');
whatsapp.className='whatsapp-card';
whatsapp.href='https://wa.me/421908702337?text='+encodeURIComponent('Dobrý deň, Dominika, mám záujem o konzultáciu v AYUAWISDOM.');
whatsapp.target='_blank';
whatsapp.rel='noopener noreferrer';
whatsapp.setAttribute('aria-label','Napísať Dominike Baranikovej cez WhatsApp');
whatsapp.innerHTML='<span class="whatsapp-avatar"><img src="/assets/dominika-portrait.jpeg" alt="" width="1158" height="1544"><span class="whatsapp-badge" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.3A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 7.5c0 4.4 4.1 8.3 8.3 8.3l1-2.3-2.6-1.1-1 1a8 8 0 0 1-3.5-3.5l1-1L10 6.5Z"/></svg></span></span><span class="whatsapp-copy"><strong>Napíšte mi na WhatsApp</strong><small>Dominika Baraniková · AYUAWISDOM</small></span>';
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
  panel.innerHTML='<strong>Pomôžete nám zlepšovať web?</strong><p>Po vašom súhlase používame Google Analytics na meranie návštevnosti a kliknutí na kontakty a Google Mapy na zobrazenie polohy štúdia. Tieto cookies sú dobrovoľné. <a href="/ochrana-osobnych-udajov/">Ochrana osobných údajov a cookies</a>.</p><div><button type="button" data-consent="yes">Prijať cookies</button><button type="button" data-consent="no">Odmietnuť</button></div>';
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
