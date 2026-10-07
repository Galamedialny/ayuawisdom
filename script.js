const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('#nav');toggle?.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('open',!expanded)});document.addEventListener('keydown',e=>{if(e.key==='Escape'){toggle?.setAttribute('aria-expanded','false');nav?.classList.remove('open')}});
const whatsapp=document.createElement('a');
whatsapp.className='whatsapp-card';
whatsapp.href='https://wa.me/421908702337?text='+encodeURIComponent('Dobrý deň, Dominika, mám záujem o konzultáciu v AYUAWISDOM.');
whatsapp.target='_blank';
whatsapp.rel='noopener noreferrer';
whatsapp.setAttribute('aria-label','Napísať Dominike Baranikovej cez WhatsApp');
whatsapp.innerHTML='<span class="whatsapp-avatar"><img src="/assets/dominika-portrait.jpeg" alt="" width="1158" height="1544"><span class="whatsapp-badge" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.3A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 7.5c0 4.4 4.1 8.3 8.3 8.3l1-2.3-2.6-1.1-1 1a8 8 0 0 1-3.5-3.5l1-1L10 6.5Z"/></svg></span></span><span class="whatsapp-copy"><strong>Napíšte mi na WhatsApp</strong><small>Dominika Baraniková · AYUAWISDOM</small></span>';
document.body.appendChild(whatsapp);

/* Analytics: load only after explicit consent. */
(()=>{
  const id='G-WFYCMTRBX8',key='ayuawisdom-analytics-consent-v1';
  let allowed=false,loaded=false;
  const read=()=>{try{return localStorage.getItem(key)}catch{return null}};
  const panel=document.createElement('section');
  panel.className='analytics-consent';
  panel.setAttribute('aria-label','Nastavenie analytických cookies');
  panel.innerHTML='<strong>Pomôžete nám zlepšovať web?</strong><p>Po vašom súhlase používame Google Analytics na meranie návštevnosti a kliknutí na kontakty. Analytické cookies sú dobrovoľné.</p><div><button type="button" data-consent="yes">Prijať analytiku</button><button type="button" data-consent="no">Odmietnuť</button></div>';
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
