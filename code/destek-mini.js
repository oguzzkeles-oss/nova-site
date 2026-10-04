/* NOVA ECE Özel Destek (Code ve STEAM Lab için hafif sürüm). Masal/Oyun'daki destek.js ile aynı ayar anahtarı: masal:destek
   (novaece.com'da aynı kökende olduğundan tek yerden açılan ayar dört uygulamada geçerlidir).
   sakin: animasyon ve efekt sesi yok · hatasiz: yanlış sesi yok · yavas: seslendirme %80 hızda (ses perdesi korunur)
   motor: daha büyük düğmeler · buyuk: büyük yazı. Destekleyici materyaldir; terapi yerine geçmez. */
(function(){
  const KEY="masal:destek",K=["sakin","hatasiz","yavas","motor","buyuk"];
  const oku=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch(e){return {}}};
  let A=oku();const ac=k=>!!A[k];
  const en=()=>{const b=document.getElementById("l-en");return !!(b&&b.getAttribute("aria-pressed")==="true")};
  const T={sakin:["Sakin mod","Calm mode","Animasyon ve efekt sesi yok.","No animation or sound effects."],
    hatasiz:["Hatasız öğrenme","Errorless learning","Yanlışta ceza sesi yok.","No error sounds."],
    yavas:["Yavaş anlatım","Slower narration","Seslendirme daha yavaş (ses perdesi korunur).","Narration plays slower (pitch kept)."],
    motor:["Büyük dokunma","Larger touch targets","Düğmeler ve kartlar daha büyük.","Bigger buttons and cards."],
    buyuk:["Büyük yazı","Larger text","Yazılar daha büyük.","Bigger text."]};
  const css=`body.dk-sakin *,body.dk-sakin *::before,body.dk-sakin *::after{animation:none!important;transition:none!important}
body.dk-motor main button,body.dk-motor section button,body.dk-motor [data-add],body.dk-motor [data-w]{min-height:56px;min-width:56px}
body.dk-buyuk{font-size:118%}body.dk-buyuk h1,body.dk-buyuk h2,body.dk-buyuk h3{font-size:115%}
.dk-btn{display:inline-flex;align-items:center;gap:6px;border:1.5px solid rgba(255,255,255,.55);background:rgba(255,255,255,.12);color:inherit;border-radius:999px;padding:6px 12px;font:inherit;font-weight:800;font-size:13px;margin-right:8px;cursor:pointer}
.dk-btn.on{background:#0F766E;border-color:#0F766E;color:#fff}
.dk-btn{white-space:nowrap;flex:none}@media (max-width:520px){.dk-btn .dk-l{display:none}.dk-btn{padding:6px 9px;font-size:16px}}
.dk-panel{position:fixed;inset:0;z-index:2000;background:rgba(15,23,42,.55);display:grid;place-items:center;padding:16px}
.dk-card>*{min-width:0}.dk-card{background:#fff;color:#0F172A;border-radius:22px;padding:20px;max-width:440px;width:100%;max-height:calc(100% - 32px);overflow:auto;display:grid;gap:10px;font-family:Inter,system-ui,sans-serif}
.dk-top{display:flex;justify-content:space-between;align-items:center}.dk-top h3{margin:0;font-size:21px}.dk-top button{border:1.5px solid #E2E8F0;background:#fff;border-radius:12px;padding:6px 12px;font-weight:800}
.dk-not{margin:0;color:#475569;font-size:14px}
.dk-row{display:flex;align-items:center;gap:12px;padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:14px;cursor:pointer;position:relative}
.dk-row span:first-child{flex:1;min-width:0}.dk-row b{display:block;font-size:15.5px}.dk-row i{display:block;font-style:normal;font-size:13px;color:#475569}
.dk-row input{position:absolute;opacity:0;pointer-events:none}
.dk-sw{flex:none;width:52px;height:30px;border-radius:999px;background:#E2E8F0;position:relative}
.dk-sw::after{content:"";position:absolute;left:3px;top:3px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25)}
.dk-row input:checked+.dk-sw{background:#0F766E}.dk-row input:checked+.dk-sw::after{transform:translateX(22px)}
.dk-alt{display:flex;gap:10px;flex-wrap:wrap}.dk-alt button{border:0;border-radius:12px;padding:11px 16px;font-weight:800;background:#F1F5F9}.dk-alt button:first-child{background:#4F46E5;color:#fff}`;
  const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  const uygula=()=>{K.forEach(k=>document.body.classList.toggle("dk-"+k,ac(k)));const b=document.getElementById("dk-btn");if(b){const on=K.some(ac);b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)}};
  const kaydet=()=>{try{localStorage.setItem(KEY,JSON.stringify(A))}catch(e){}uygula()};
  /* efekt sesleri: sakin modda hiç, hatasız öğrenmede 'wrong' yok */
  if(typeof window.sfx==="function"){const s0=window.sfx;window.sfx=function(n){if(ac("sakin")||(ac("hatasiz")&&/wrong|fail|buzz/.test(n)))return;return s0.apply(this,arguments)}}
  /* seslendirme: yavaş anlatımda %80 hız, ses perdesi korunur (yalnız ses/ klasöründeki konuşmalar) */
  const pl=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){try{if(/\/ses\//.test(this.src||"")){const r=ac("yavas")?.8:1;this.playbackRate=r;this.defaultPlaybackRate=r;this.preservesPitch=true;this.webkitPreservesPitch=true}}catch(e){}return pl.apply(this,arguments)};
  const panel=()=>{const E=en(),o=document.createElement("div");o.className="dk-panel";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");
    o.innerHTML=`<div class="dk-card"><div class="dk-top"><h3>🌿 ${E?"Special Support":"Özel Destek"}</h3><button data-dkx aria-label="${E?"Close":"Kapat"}">✕</button></div>
      <p class="dk-not">${E?"Adaptations for children with sensory, attention, language or motor needs. Settings stay on this device.":"Duyusal, dikkat, dil ya da motor gereksinimi olan çocuklar için uyarlamalar. Ayarlar bu cihazda kalır."}</p>
      ${K.map(k=>`<label class="dk-row"><span><b>${T[k][E?1:0]}</b><i>${T[k][E?3:2]}</i></span><input type="checkbox" data-dk="${k}" ${ac(k)?"checked":""}><span class="dk-sw" aria-hidden="true"></span></label>`).join("")}
      <div class="dk-alt"><button data-dkall>${E?"Turn all on":"Hepsini aç"}</button><button data-dkoff>${E?"Turn all off":"Hepsini kapat"}</button></div>
      <p class="dk-not" style="font-size:12.5px">${E?"A supportive learning material; it does not replace therapy or professional assessment.":"Destekleyici bir öğrenme materyalidir; terapinin ya da uzman değerlendirmesinin yerini tutmaz."}</p></div>`;
    document.body.appendChild(o);
    o.addEventListener("change",e=>{const k=e.target.dataset&&e.target.dataset.dk;if(k){A[k]=e.target.checked;kaydet()}});
    o.addEventListener("click",e=>{if(e.target===o||e.target.closest("[data-dkx]")){o.remove();return}
      const all=e.target.closest("[data-dkall]"),off=e.target.closest("[data-dkoff]");if(all||off){K.forEach(k=>A[k]=!!all);kaydet();o.querySelectorAll("[data-dk]").forEach(x=>x.checked=!!all)}})};
  /* ebeveyn onayı: yazıyla verilen iki basamaklı sayıyı rakamla yazmak */
  const onay=f=>{const E=en(),n=23+Math.floor(Math.random()*70),B=["","bir","iki","üç","dört","beş","altı","yedi","sekiz","dokuz"],O=["","on","yirmi","otuz","kırk","elli","altmış","yetmiş","seksen","doksan"],
      BE=["","one","two","three","four","five","six","seven","eight","nine"],OE=["","ten","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"],
      w=E?OE[Math.floor(n/10)]+(n%10?"-"+BE[n%10]:""):(O[Math.floor(n/10)]+" "+B[n%10]).trim(),o=document.createElement("div");o.className="dk-panel";
    o.innerHTML=`<div class="dk-card" style="text-align:center"><h3 style="margin:0">${E?"Grown-ups only":"Ebeveyn onayı"}</h3><p class="dk-not">${E?"Type this number in digits:":"Bu sayıyı rakamla yazın:"}</p><p style="font-size:26px;font-weight:800;margin:0">${w}</p>
      <input inputmode="numeric" style="width:100%;min-width:0;box-sizing:border-box;font-size:24px;text-align:center;padding:10px;border:1.5px solid #E2E8F0;border-radius:12px"><div class="dk-alt" style="justify-content:center"><button data-ok>${E?"Continue":"Devam"}</button><button data-no>${E?"Cancel":"Vazgeç"}</button></div></div>`;
    document.body.appendChild(o);const i=o.querySelector("input");i.focus();
    const dene=()=>{if(+i.value===n){o.remove();f()}else{i.value="";i.style.borderColor="#DC2626"}};
    o.querySelector("[data-ok]").onclick=dene;o.querySelector("[data-no]").onclick=()=>o.remove();i.addEventListener("keydown",e=>{if(e.key==="Enter")dene()})};
  const dugme=()=>{const L=document.querySelector("header .lang");if(!L||document.getElementById("dk-btn"))return;const b=document.createElement("button");b.id="dk-btn";b.className="dk-btn";b.type="button";
    const et=()=>{b.innerHTML=`<span aria-hidden="true">🌿</span><span class="dk-l">${en()?"Special Support":"Özel Destek"}</span>`;b.setAttribute("aria-label",en()?"Special Support":"Özel Destek")};et();L.parentNode.insertBefore(b,L);b.onclick=()=>onay(panel);
    L.addEventListener("click",()=>setTimeout(et,0))};
  addEventListener("storage",e=>{if(e.key===KEY){A=oku();uygula()}});
  dugme();uygula();
})();
