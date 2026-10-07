const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('#nav');toggle?.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('open',!expanded)});document.addEventListener('keydown',e=>{if(e.key==='Escape'){toggle?.setAttribute('aria-expanded','false');nav?.classList.remove('open')}});
const whatsapp=document.createElement('a');
whatsapp.className='whatsapp-card';
whatsapp.href='https://wa.me/421908702337?text='+encodeURIComponent('Dobrý deň, Dominika, mám záujem o konzultáciu v AYUAWISDOM.');
whatsapp.target='_blank';
whatsapp.rel='noopener noreferrer';
whatsapp.setAttribute('aria-label','Napísať Dominike Baranikovej cez WhatsApp');
whatsapp.innerHTML='<span class="whatsapp-avatar"><img src="/assets/dominika-portrait.jpeg" alt="" width="1158" height="1544"><span class="whatsapp-badge" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.3A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 7.5c0 4.4 4.1 8.3 8.3 8.3l1-2.3-2.6-1.1-1 1a8 8 0 0 1-3.5-3.5l1-1L10 6.5Z"/></svg></span></span><span class="whatsapp-copy"><strong>Napíšte mi na WhatsApp</strong><small>Dominika Baraniková · AYUAWISDOM</small></span>';
document.body.appendChild(whatsapp);
