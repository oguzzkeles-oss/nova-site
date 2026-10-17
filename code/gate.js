/* Ebeveyn kilidi: mobil uygulamada dış bağlantılar, yazıyla verilen sayı rakamla yazılınca açılır. */
(function(){const inApp=location.protocol==='capacitor:'||(location.hostname==='localhost'&&!location.port);if(!inApp)return;
 const W={tr:['','bir','iki','üç','dört','beş','altı','yedi','sekiz','dokuz'],en:['','one','two','three','four','five','six','seven','eight','nine']};
 const TT={tr:['on','yirmi','otuz','kırk','elli','altmış','yetmiş','seksen','doksan'],en:['ten','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']};
 const L=()=>((document.documentElement.lang||'tr').startsWith('en')?'en':'tr');
 const words=(n,l)=>{const t=Math.floor(n/10),o=n%10;return l==='tr'?(TT.tr[t-1]+(o?' '+W.tr[o]:'')):(TT.en[t-1]+(o?'-'+W.en[o]:''))};
 function gate(href){const l=L(),n=21+Math.floor(Math.random()*78),d=document.createElement('div');
  d.style.cssText='position:fixed;inset:0;z-index:99;display:grid;place-items:center;background:rgba(15,23,42,.6);padding:16px';
  d.innerHTML=`<form style="background:#fff;color:#0F172A;border-radius:20px;padding:20px;max-width:340px;width:100%;font:16px Inter,system-ui,sans-serif;display:flex;flex-direction:column;gap:12px"><b style="font:800 20px Manrope,Inter,sans-serif">${l==='tr'?'Yetişkin onayı':'Grown-ups only'}</b><span>${l==='tr'?'Devam etmek için bu sayıyı rakamla yazın:':'To continue, type this number in digits:'} <b>${words(n,l)}</b></span><input inputmode="numeric" autocomplete="off" style="font:700 22px Inter,sans-serif;padding:10px;border:2px solid #E2E8F0;border-radius:12px"><div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" data-x style="padding:10px 16px;border-radius:12px;border:1px solid #E2E8F0;background:#fff">${l==='tr'?'Vazgeç':'Cancel'}</button><button style="padding:10px 16px;border-radius:12px;border:0;background:#4F46E5;color:#fff;font-weight:700">${l==='tr'?'Aç':'Open'}</button></div></form>`;
  document.body.appendChild(d);const f=d.querySelector('form'),i=d.querySelector('input');i.focus();
  d.querySelector('[data-x]').onclick=()=>d.remove();
  f.onsubmit=e=>{e.preventDefault();if(+i.value===n){d.remove();window.open(href,'_blank')}else{i.value='';i.style.borderColor='#BE123C'}}}
 document.addEventListener('click',e=>{const a=e.target.closest('a[href^="http"]');if(!a)return;e.preventDefault();e.stopPropagation();gate(a.href)},true);})();
