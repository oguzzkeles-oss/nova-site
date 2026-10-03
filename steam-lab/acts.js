/* NOVA ECE STEAM Lab — 23 etkinlik. Sahneler 600×360 SVG. */
const V='viewBox="0 0 600 360"';
const IM=(n,x,y,w,h,ex='')=>n==='atac'?`<g transform="translate(${x},${y}) scale(${w/80},${h/80})" ${ex}>${CLIP}</g>`:`<image href="img/${n}.webp" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" ${ex}/>`;
const CLIP='<path d="M28 66 V20 a12 12 0 0 1 24 0 V58 a8 8 0 0 1 -16 0 V26" fill="none" stroke="#64748B" stroke-width="5" stroke-linecap="round"/>';
const CLIP_URL='data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">${CLIP}</svg>`);
const thumb=k=>k==='atac'?CLIP_URL:`img/${k}.webp`;
function magnetSVG(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M8 8 h14 v26 a10 10 0 0 0 20 0 v-26 h14 v26 a24 24 0 0 1 -48 0z" fill="#BE123C"/><rect x="8" y="2" width="14" height="10" fill="#CBD5E1"/><rect x="42" y="2" width="14" height="10" fill="#CBD5E1"/></g>`}
const SKY=`<rect width="600" height="360" fill="var(--stage-sky)"/>`;
const GROUND=(y=290)=>`<rect y="${y}" width="600" height="${360-y}" fill="var(--stage-ground)"/>`;
const SUN=(x,y,r=34)=>`<g transform="translate(${x},${y})"><g stroke="#F59E0B" stroke-width="5" stroke-linecap="round">${[0,45,90,135,180,225,270,315].map(a=>{const c=Math.cos(a*Math.PI/180),s=Math.sin(a*Math.PI/180);return `<line x1="${c*(r+8)}" y1="${s*(r+8)}" x2="${c*(r+20)}" y2="${s*(r+20)}"/>`}).join('')}</g><circle r="${r}" fill="#FBBF24"/><circle cx="-10" cy="-5" r="3.5" fill="#B45309"/><circle cx="10" cy="-5" r="3.5" fill="#B45309"/><path d="M-11 8 Q0 17 11 8" stroke="#B45309" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
function wIcon(k,s=40){const sv=b=>`<svg viewBox="0 0 40 40" width="${s}" height="${s}" aria-hidden="true">${b}</svg>`;const cl='<path d="M11 28a7 7 0 0 1 1-14 9 9 0 0 1 17 2 6 6 0 0 1 0 12z" fill="#CBD5E1" stroke="#64748B" stroke-width="1.5"/>';
 return [sv('<circle cx="20" cy="20" r="9" fill="#FBBF24"/><g stroke="#F59E0B" stroke-width="3" stroke-linecap="round"><path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.5 3.5M28.5 28.5 32 32M8 32l3.5-3.5M28.5 11.5 32 8"/></g>'),sv(cl),sv(cl+'<path d="M14 31l-2 5M21 31l-2 5M28 31l-2 5" stroke="#0369A1" stroke-width="2.5" stroke-linecap="round"/>'),
  sv(cl+'<g fill="#38BDF8"><circle cx="13" cy="34" r="2"/><circle cx="21" cy="36" r="2"/><circle cx="29" cy="34" r="2"/></g>'),sv('<path d="M4 14h22a5 5 0 1 0-5-5M4 22h28a5 5 0 1 1-5 5M4 30h14" fill="none" stroke="#6366F1" stroke-width="3" stroke-linecap="round"/>')][k]}
function tween(dur,fn){return new Promise(r=>{const t0=performance.now();const f=now=>{const p=Math.min(1,(now-t0)/dur);fn(p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2);if(p<1)requestAnimationFrame(f);else r()};requestAnimationFrame(f)})}
/* ---------- ortak panel parçaları ---------- */
function ask(pnl,q,opts,{voice,img,cls=''}={}){return new Promise(res=>{const c=document.createElement('div');c.className='card '+cls;
 c.innerHTML=`${q?`<p class="q">${esc(q)}</p>`:''}<div class="opts">${opts.map((o,i)=>`<button class="opt" data-i="${i}">${o.img?`<img src="${o.img}" alt="">`:''}${o.svg||''}${esc(o.t||o)}</button>`).join('')}</div>`;pnl.appendChild(c);
 c.scrollIntoView({block:'nearest',behavior:'smooth'});if(voice&&pnl.isConnected)speak(voice,q,img);
 c.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{c.querySelectorAll('.opt').forEach(x=>{x.disabled=true;x.setAttribute('aria-pressed',x===b)});sfx('click',.4);res({i:+b.dataset.i,card:c,btn:b})})})}
function mark(r,ok){r.btn.classList.add(ok?'good':'badx')}
function fbk(pnl,ok,text){const d=document.createElement('div');d.className='fb '+(ok?'ok':'no');d.textContent=text;pnl.appendChild(d);d.scrollIntoView({block:'nearest',behavior:'smooth'});return d}
function el(html){const d=document.createElement('div');d.innerHTML=html;return d.firstElementChild}
function btn(pnl,label,cls='pri'){return new Promise(r=>{const w=el(`<div class="btns"><button class="btn ${cls}">${label}</button></div>`);pnl.appendChild(w);const b=w.querySelector('button');b.onclick=()=>{w.remove();r()}})}
async function intro(id,g){await speak(id+'-intro',A(id).intro,hostOf(id));return alive(g)}
/* ===================== BİLİM ===================== */
/* tahmin et → dene → sınıflandır (batar, mıknatıs, emme) */
async function sortAct(id,truth,draw,anim){const {g}=frame(id);const a=A(id),u=U(),keys=Object.keys(a.items);const st=$('#stage'),pnl=$('#pnl');
 st.innerHTML=`<svg ${V} id="sv">${draw()}</svg>`;
 pnl.innerHTML=`<div class="tray"><div><b>${a.opts[0]}</b><span id="t0"></span></div><div><b>${a.opts[1]}</b><span id="t1"></span></div></div>`;
 await speak(id+'-intro',a.intro,hostOf(id));let right=0;
 for(const k of keys){if(!alive(g))return;const it=el(`<div class="card"><div class="btns"><img src="${thumb(k)}" alt="" style="width:64px;height:64px;object-fit:contain"><p class="q" style="margin:0">${esc(a.items[k])}: ${u.predict}</p></div></div>`);pnl.appendChild(it);
  const r=await ask(it,'',a.opts.map((o,i)=>({t:o})),{cls:'flat'});
  /* 1) çocuğun tahmini seslendirilir, bitince 2) deney oynar, 3) sonuç anında söylenir */
  await speak(id+'-o'+r.i,a.opts[r.i],hostOf(id));if(!alive(g))return;
  const tv=truth[k];await anim(k,tv,g);if(!alive(g))return;const ok=r.i===tv;if(ok)right++;mark(r,ok);verdict(ok);
  fbk(it,ok,`${ok?u.right:u.diff+':'} ${a.items[k]} ${a.res[tv]}.`);
  $('#t'+tv).insertAdjacentHTML('beforeend',`<span class="it ${ok?'':'miss'}"><img src="${thumb(k)}" alt="">${esc(a.items[k])}</span>`);
  await speak(`${id}-r-${k}`,`${a.items[k]} ${a.res[tv]}!`,hostOf(id));await sleep(350)}
 if(!alive(g))return;fbk(pnl,right>=4,u.score(right,keys.length));await whyCard(pnl,id,right>=5?3:right>=3?2:1,g)}
function word(k){try{const x=new Audio(`ses/${lang}/${k}.mp3`);x.volume=.9;x.play().catch(()=>{})}catch(e){}}
const ACTS={};
ACTS.batar=()=>{let fl=0,sk=0;
 sortAct('batar',{apple:1,tas:0,yaprak:1,'bozuk-para':0,top:1,kasik:0},
 ()=>`<image href="img/bg-batar.webp" x="0" y="0" width="600" height="360" preserveAspectRatio="xMidYMid slice"/><g id="items"></g><ellipse id="rip" cx="0" cy="150" rx="0" ry="0" fill="none" stroke="#fff" stroke-width="3"/>`,
 async(k,tv,g)=>{const s=k==='kasik'?90:66;const x=tv?100+fl*140:110+sk*140;if(tv)fl++;else sk++;
  const ySurf=150-s*.6,yEnd=tv?150-s*.55:322-s*.92;
  const G=document.createElementNS('http://www.w3.org/2000/svg','g');G.innerHTML=IM(k,0,0,s,s);G.setAttribute('transform',`translate(${x},10)`);$('#items').appendChild(G);
  /* düşüş: suya değene kadar hızlanır */
  await tween(520,p=>G.setAttribute('transform',`translate(${x},${10+(ySurf-10)*p*p})`));if(!alive(g))return;
  /* suya değdiği an: şap sesi + halka */
  sfx('drip',.8);const R=$('#rip');R.setAttribute('cx',x+s/2);tween(600,p=>{R.setAttribute('rx',10+60*p);R.setAttribute('ry',3+8*p);R.style.opacity=1-p});
  if(tv){await tween(700,p=>G.setAttribute('transform',`translate(${x},${ySurf+(Math.sin(p*Math.PI)*14)+(yEnd-ySurf)*p})`));G.firstElementChild.style.animation='jig 2.4s ease-in-out infinite'}
  else{await tween(1400,p=>G.setAttribute('transform',`translate(${x+Math.sin(p*9)*6*(1-p)},${ySurf+(yEnd-ySurf)*(1-Math.pow(1-p,2))})`));sfx('step',.5)}})};
ACTS.miknatis=()=>{let pulled=0;
 sortAct('miknatis',{atac:0,kasik:0,yaprak:1,makas:0,kagit:1,'oyuncak-ayi':1},
 ()=>`${SKY}<rect y="290" width="600" height="70" fill="#E2E8F0"/><rect x="0" y="282" width="600" height="10" fill="#94A3B8"/><g id="mag" style="transition:transform .9s cubic-bezier(.3,.1,.3,1);transform:translate(70px,170px)">${magnetSVG(0,0,1.6)}</g><g id="items"></g>`,
 async(k,tv,g)=>{const s=k==='oyuncak-ayi'?110:90;const G=document.createElementNS('http://www.w3.org/2000/svg','g');G.innerHTML=IM(k,0,0,s,s);G.style.cssText=`transform:translate(420px,${285-s}px);transition:transform .7s ease-in`;$('#items').innerHTML='';$('#items').appendChild(G);
  await sleep(350);$('#mag').style.transform='translate(250px,170px)';await sleep(950);
  if(tv===0){G.style.transform=`translate(${310}px,${200}px)`;await sleep(650);sfx('pop',.8);await sleep(250);$('#mag').style.transform='translate(70px,170px)';G.style.transition='transform .9s cubic-bezier(.3,.1,.3,1)';G.style.transform='translate(130px,200px)';await sleep(1000)}
  else{sfx('boing',.3);await sleep(500);$('#mag').style.transform='translate(70px,170px)';await sleep(900)}})};
ACTS.emme=()=>{
 sortAct('emme',{havlu:0,poset:1,kagit:0,yaprak:1,atki:0,eldiven:0},
 ()=>`${SKY}<rect y="290" width="600" height="70" fill="#E2E8F0"/><rect x="0" y="282" width="600" height="10" fill="#94A3B8"/><g transform="translate(300,20)"><rect x="-10" y="0" width="20" height="60" rx="6" fill="#CBD5E1" stroke="#64748B" stroke-width="2"/><rect x="-14" y="-14" width="28" height="18" rx="7" fill="#BE123C"/><path d="M-4 60 L0 72 L4 60z" fill="#64748B"/></g><g id="items"></g><circle id="drop" cx="300" cy="96" r="0" fill="#0369A1"/>`,
 async(k,tv,g)=>{const it=$('#items');it.innerHTML=`<g>${IM(k,190,170,220,120)}</g><ellipse id="wet" cx="300" cy="232" rx="0" ry="0" fill="#0369A1" opacity=".38"/>`;
  const d=$('#drop');d.setAttribute('cy',96);d.setAttribute('r',11);d.style.opacity=1;await sleep(300);
  await tween(700,p=>d.setAttribute('cy',96+p*p*(206-96)));sfx('drip',.8);
  if(tv===0){await tween(900,p=>{d.setAttribute('r',11*(1-p));$('#wet').setAttribute('rx',46*p);$('#wet').setAttribute('ry',22*p)})}
  else{await tween(500,p=>{d.setAttribute('r',11+3*p)});d.style.animation='wob .6s 2'}
  await sleep(600)})};
ACTS.golge=async()=>{const {g}=frame('golge');const a=A('golge'),u=U(),pnl=$('#pnl');
 $('#stage').innerHTML=`<svg ${V}>${SKY}${GROUND(290)}<g id="sun"></g><polygon id="sh" fill="#0F172A" opacity=".28"/>${IM('kutuk',255,215,90,80)}<text id="tl" x="20" y="36" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="22" fill="var(--ink)"></text></svg>`;
 const setT=t=>{const sx=300-260*Math.cos(Math.PI*t),sy=275-215*Math.sin(Math.PI*t);$('#sun').innerHTML=SUN(sx,sy,26);const L=70*(1/Math.max(.22,Math.sin(Math.PI*t))-1)+14;const dir=sx<300?1:-1;
  $('#sh').setAttribute('points',`${300-dir*35},292 ${300+dir*35},292 ${300+dir*(35+L)},300 ${300-dir*25+dir*L*.2},302`)};
 setT(.13);await intro('golge',g);const T3=[.13,.5,.87],ans=[0,1,0];let right=0;
 for(let i=0;i<3;i++){if(!alive(g))return;$('#tl').textContent=a.times[i];const r=await ask(pnl,a.q[i],a.opts,{voice:'golge-q'+i,img:hostOf('golge')});
  const from=i?T3[i-1]:.02;await tween(1600,p=>setT(from+(T3[i]-from)*p));const ok=r.i===ans[i];if(ok)right++;mark(r,ok);verdict(ok);fbk(r.card,ok,ok?u.right:u.diff);await sleep(600)}
 if(!alive(g))return;const fr=el(`<div class="card"><p class="q">${a.free}</p><input type="range" min="2" max="98" value="87" id="sl" aria-label="${a.free}" style="width:100%"></div>`);pnl.appendChild(fr);$('#sl').oninput=e=>{setT(e.target.value/100);$('#tl').textContent=''};
 await whyCard(pnl,'golge',right===3?3:right===2?2:1,g)};
ACTS.buz=async()=>{const {g}=frame('buz');const a=A('buz'),u=U(),pnl=$('#pnl');
 const cube=(i,s)=>`<rect x="${100+i*200-s/2}" y="${262-s}" width="${s}" height="${s}" rx="${s/6}" fill="#E0F2FE" stroke="#38BDF8" stroke-width="3" opacity=".95"/>`;
 const panels=`<rect width="200" height="360" fill="#FEF3C7"/>${SUN(100,70,28)}<rect x="200" width="200" height="360" fill="#DCFCE7"/><rect x="292" y="120" width="16" height="150" fill="#92400E"/><circle cx="300" cy="105" r="62" fill="#16A34A"/><rect x="400" width="200" height="360" fill="#E2E8F0"/><rect x="430" y="40" width="140" height="290" rx="14" fill="#F8FAFC" stroke="#64748B" stroke-width="4"/><line x1="440" y1="140" x2="560" y2="140" stroke="#64748B" stroke-width="3"/><text x="500" y="100" text-anchor="middle" font-size="34">❄️</text>`;
 const draw=(p=0)=>{const R=[1,.5,.08];$('#buzs').innerHTML=[0,1,2].map(i=>{const s=Math.max(0,60*(1-R[i]*p*1.05));return `<ellipse cx="${100+i*200}" cy="268" rx="${10+R[i]*p*60}" ry="${3+R[i]*p*9}" fill="#38BDF8" opacity=".5"/>${s>2?cube(i,s):''}`}).join('');$('#clk').textContent=`⏱ ${Math.round(p*30)} ${lang==='tr'?'dk':'min'}`};
 $('#stage').innerHTML=`<svg ${V}>${panels}<g>${[0,1,2].map(i=>`<ellipse cx="${100+i*200}" cy="270" rx="70" ry="12" fill="#fff" stroke="#CBD5E1" stroke-width="2"/>`).join('')}</g><g id="buzs"></g><text x="300" y="340" text-anchor="middle" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="24" fill="#0F172A" id="clk"></text></svg>`;draw(0);
 await intro('buz',g);const r1=await ask(pnl,a.q[0],a.opts,{voice:'buz-q0',img:hostOf('buz')});if(!alive(g))return;const r2=await ask(pnl,a.q[1],a.opts,{voice:'buz-q1',img:hostOf('buz')});
 await btn(pnl,lang==='tr'?'⏱ Zaman geçsin':'⏱ Let time pass');sfx('whoosh',.4);await tween(4200,p=>draw(p));if(!alive(g))return;
 const o1=r1.i===0,o2=r2.i===2;mark(r1,o1);mark(r2,o2);verdict(o1&&o2);fbk(pnl,o1&&o2,`${o1?'✓':'✗'} ${a.opts[0]} · ${o2?'✓':'✗'} ${a.opts[2]}`);await whyCard(pnl,'buz',o1&&o2?3:o1||o2?2:1,g)};
/* fasulye: tohum, kök, filiz, 2 yaprak, 4 yaprak, uzun fide */
function plant(x,base,stage,cm){if(stage<=0)return `<ellipse cx="${x}" cy="${base-6}" rx="9" ry="6" fill="#92400E"/>`;const h=Math.max(4,cm*11);let s=`<ellipse cx="${x}" cy="${base-4}" rx="9" ry="6" fill="#92400E"/><path d="M${x} ${base} q-6 18 -2 30 M${x} ${base} q8 14 4 26" stroke="#FDE68A" stroke-width="2.5" fill="none"/>`;
 if(stage>=2)s+=`<path d="M${x} ${base-4} V${base-h}" stroke="#16A34A" stroke-width="5" stroke-linecap="round"/>`;
 const leaf=(y,dir,sz)=>`<ellipse cx="${x+dir*sz}" cy="${y}" rx="${sz}" ry="${sz*.45}" fill="#22C55E" transform="rotate(${dir*-20} ${x+dir*sz} ${y})"/>`;
 if(stage>=3)s+=leaf(base-h,-1,16)+leaf(base-h,1,16);if(stage>=4)s+=leaf(base-h*.55,-1,13)+leaf(base-h*.55,1,13);if(stage>=5)s+=leaf(base-h*.8,1,11);return s}
ACTS.fasulye=async()=>{const {g}=frame('fasulye');const a=A('fasulye'),u=U(),pnl=$('#pnl');const P=[[0,0],[1,0],[2,2],[3,4],[3,6],[4,9],[5,12]];
 let day=1,watered=false;const hist=[0];
 const pot=x=>`<path d="M${x-62} 250 h124 l-14 92 h-96z" fill="#C2410C"/><rect x="${x-68}" y="240" width="136" height="16" rx="5" fill="#9A3412"/><rect x="${x-60}" y="244" width="120" height="10" fill="#78350F"/>`;
 const draw=()=>{const [s,c]=P[day-1];$('#stage').innerHTML=`<svg ${V}>${SKY}<rect y="300" width="600" height="60" fill="#E2E8F0"/>${SUN(540,60,24)}${pot(170)}${pot(430)}${plant(170,248,s,c)}${plant(430,248,day>=5?0:0,0)}${day>=5?`<path d="M392 250 l12 3 l-6 4 l10 2" stroke="#78350F" stroke-width="2" fill="none"/>`:''}
  <g font-family="Inter,sans-serif" font-size="11" fill="#475569"><rect x="290" y="94" width="20" height="154" fill="#FDE68A" stroke="#B45309"/>${Array.from({length:15},(_,i)=>`<line x1="290" x2="${i%5?298:304}" y1="${248-i*11}" y2="${248-i*11}" stroke="#B45309"/>${i%5===0?`<text x="314" y="${252-i*11}">${i}</text>`:''}`).join('')}</g>
  <text x="170" y="40" text-anchor="middle" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="18" fill="var(--ink)">💧 ${a.pots[0]}</text><text x="430" y="40" text-anchor="middle" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="18" fill="var(--ink)">${a.pots[1]}</text>
  <text x="300" y="350" text-anchor="middle" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="22" fill="#0F172A">${a.day(day)} · ${c} ${a.cm}</text></svg>`};
 draw();await intro('fasulye',g);const r=await ask(pnl,a.q[0],a.opts,{voice:'fasulye-q0',img:hostOf('fasulye')});if(!alive(g))return;
 const ctl=el(`<div class="card"><div class="btns"><button class="btn ghost" id="fw">💧 ${a.water}</button><button class="btn pri" id="fn">${a.nextDay} ▶</button></div><div id="fch" class="num" style="display:flex;gap:6px;align-items:flex-end;height:90px"></div><p class="muted" id="fmsg" style="margin:0;font-size:14px"></p></div>`);pnl.appendChild(ctl);
 const chart=()=>{$('#fch').innerHTML=hist.map((c,i)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11px"><span>${c}</span><i style="display:block;width:100%;height:${4+c*5}px;background:linear-gradient(#22C55E,#047857);border-radius:4px 4px 0 0"></i><span>${i+1}</span></div>`).join('')};chart();
 await new Promise(res=>{$('#fw').onclick=()=>{if(watered)return;watered=true;sfx('drip',.7);$('#fmsg').textContent='💧';};
  $('#fn').onclick=()=>{if(!watered){$('#fmsg').textContent=a.needWater;sfx('wrong',.3);return}watered=false;day++;hist.push(P[day-1][1]);draw();chart();sfx('twinkle',.4);$('#fmsg').textContent='';if(day>=7){$('#fw').disabled=true;$('#fn').disabled=true;res()}}});
 if(!alive(g))return;const ok=r.i===0;mark(r,ok);verdict(ok);fbk(pnl,ok,ok?u.right:u.diff);
 /* gerçek günlük */
 if(!store.diary.length)store.diary=Array.from({length:7},()=>({s:-1,cm:0}));
 const dc=el(`<div class="card"><h3>📓 ${a.diary}</h3><p class="muted" style="margin:0;font-size:14px">${a.diaryHelp}</p><div class="diary" id="dy"></div></div>`);pnl.appendChild(dc);
 const dd=()=>{$('#dy').innerHTML=store.diary.map((d,i)=>`<div><b>${a.day(i+1)}</b><select data-d="${i}" aria-label="${a.day(i+1)}"><option value="-1">—</option>${a.stages.map((s,k)=>`<option value="${k}" ${d.s===k?'selected':''}>${s}</option>`).join('')}</select><span class="mini"><button data-m="${i}" aria-label="-">−</button><b class="num">${d.cm}</b><button data-p="${i}" aria-label="+">+</button></span><span>${a.cm}</span></div>`).join('');
  $$('#dy select').forEach(s=>s.onchange=()=>{store.diary[+s.dataset.d].s=+s.value;save()});$$('[data-m]').forEach(b=>b.onclick=()=>{const d=store.diary[+b.dataset.m];d.cm=Math.max(0,d.cm-1);save();dd()});$$('[data-p]').forEach(b=>b.onclick=()=>{const d=store.diary[+b.dataset.p];d.cm=Math.min(40,d.cm+1);save();dd()})};dd();
 await whyCard(pnl,'fasulye',ok?3:2,g)};
ACTS.ses=async()=>{const {g}=frame('ses');const a=A('ses'),u=U(),pnl=$('#pnl');
 const rice=Array.from({length:16},(_,i)=>[150+((i*37)%120),126+((i*13)%10)]);
 $('#stage').innerHTML=`<svg ${V}>${SKY}<rect y="300" width="600" height="60" fill="#E2E8F0"/>${IM('davul',95,110,230,200)}<g id="rice">${rice.map(([x,y])=>`<ellipse cx="${x+15}" cy="${y}" rx="5" ry="2.6" fill="#FFF7ED" stroke="#B45309" stroke-width="1"/>`).join('')}</g>
  <g transform="translate(380,120)"><rect width="190" height="150" rx="16" fill="#FDE68A" stroke="#B45309" stroke-width="4"/><ellipse cx="95" cy="75" rx="40" ry="40" fill="#78350F"/><line id="b0" x1="20" y1="50" x2="170" y2="50" stroke="#BE123C" stroke-width="3"/><line id="b1" x1="20" y1="100" x2="170" y2="100" stroke="#6D28D9" stroke-width="10"/></g></svg>`;
 const jump=async amp=>{sfx('drum',amp>20?1:.35);const R=$('#rice');await tween(600,p=>R.setAttribute('transform',`translate(0,${-amp*Math.sin(p*Math.PI)})`))};
 const pluck=async i=>{tone(i?196:660,.8);const b=$('#b'+i),y=i?100:50;await tween(800,p=>{const o=(1-p)*7*Math.sin(p*(i?40:90));b.setAttribute('y1',y+o);b.setAttribute('y2',y-o)})};
 await intro('ses',g);let right=0;
 let r=await ask(pnl,a.q[0],a.opts[0],{voice:'ses-q0',img:hostOf('ses')});if(!alive(g))return;await btn(r.card,'🥁 '+a.hit[1]);await jump(36);let ok=r.i===0;right+=ok;mark(r,ok);verdict(ok);fbk(r.card,ok,ok?u.right:u.diff);
 r=await ask(pnl,a.q[1],a.opts[1],{voice:'ses-q1',img:hostOf('ses')});if(!alive(g))return;
 await new Promise(res=>{const w=el(`<div class="btns"><button class="btn ghost sm" id="h0">${a.hit[0]}</button><button class="btn ghost sm" id="h1">${a.hit[1]}</button></div>`);r.card.appendChild(w);const tried=new Set();
  ['h0','h1'].forEach((k,i)=>$('#'+k).onclick=async()=>{await jump(i?44:8);tried.add(i);if(tried.size===2){w.remove();res()}})});
 ok=r.i===1;right+=ok;mark(r,ok);verdict(ok);fbk(r.card,ok,ok?u.right:u.diff);
 r=await ask(pnl,a.q[2],a.opts[2],{voice:'ses-q2',img:hostOf('ses')});if(!alive(g))return;
 await new Promise(res=>{const w=el(`<div class="btns"><button class="btn ghost sm" id="p0">${a.pluck}: ${a.thin}</button><button class="btn ghost sm" id="p1">${a.pluck}: ${a.thick}</button></div>`);r.card.appendChild(w);const tried=new Set();
  ['p0','p1'].forEach((k,i)=>$('#'+k).onclick=async()=>{await pluck(i);tried.add(i);if(tried.size===2){w.remove();res()}})});
 ok=r.i===0;right+=ok;mark(r,ok);verdict(ok);fbk(r.card,ok,ok?u.right:u.diff);await whyCard(pnl,'ses',right===3?3:right===2?2:1,g)};
ACTS.hava=async()=>{const {g}=frame('hava');const a=A('hava'),u=U(),pnl=$('#pnl');const today=new Date().toISOString().slice(0,10);
 const yd=new Date(Date.now()-864e5).toISOString().slice(0,10);let cur=store.hava[today]||{k:-1,f:-1,p:-1};
 const scene=()=>{const k=cur.k;$('#stage').innerHTML=`<svg ${V}><rect width="600" height="360" fill="${k===2?'#94A3B8':k===3?'#E2E8F0':k===1?'#CBD5E1':'var(--stage-sky)'}"/>${GROUND(280)}${k===0||k<0?SUN(470,90,34):''}${k>=1&&k<=3?`<g transform="translate(330,40) scale(5)">${wIcon(1,40).replace(/<\/?svg[^>]*>/g,'')}</g>`:''}
  ${k===2?`<g stroke="#0369A1" stroke-width="3">${Array.from({length:24},(_,i)=>`<line x1="${30+i*24}" y1="${150+(i%3)*30}" x2="${22+i*24}" y2="${170+(i%3)*30}"/>`).join('')}</g>`:''}${k===3?`<g fill="#fff">${Array.from({length:30},(_,i)=>`<circle cx="${20+(i*41)%580}" cy="${140+(i*23)%130}" r="4"/>`).join('')}</g>`:''}
  ${k===4?`<g fill="none" stroke="#6366F1" stroke-width="4" stroke-linecap="round"><path d="M40 110h300a26 26 0 1 0-26-26M40 160h380a26 26 0 1 1-26 26M40 210h200"/></g>`:''}${IM('piti',40,170,150,100)}</svg>`};scene();
 await intro('hava',g);if(!alive(g))return;
 const prev=store.hava[yd];if(prev&&prev.p>=0&&cur.k>=0)fbk(pnl,prev.p===cur.k,a.yest(a.kinds[prev.p],a.kinds[cur.k]));
 const c=el(`<div class="card"><p class="q">${a.today}</p><div class="opts" id="hk">${a.kinds.map((k,i)=>`<button class="opt" data-k="${i}" aria-pressed="${cur.k===i}">${wIcon(i,34)}${k}</button>`).join('')}</div>
  <div class="chips" id="hf">${a.feel.map((f,i)=>`<button class="chip" data-f="${i}" aria-pressed="${cur.f===i}">${['🔥','🌤','🧊'][i]} ${f}</button>`).join('')}</div>
  <p class="q">${a.tomorrow}</p><div class="opts" id="hp">${a.kinds.map((k,i)=>`<button class="opt" data-p="${i}" aria-pressed="${cur.p===i}">${wIcon(i,28)}${k}</button>`).join('')}</div>
  <div class="btns"><button class="btn pri" id="hs">✓ ${lang==='tr'?'Kaydet':'Save'}</button><span id="hm" class="muted"></span></div></div>`);pnl.appendChild(c);
 $$('#hk [data-k]').forEach(b=>b.onclick=()=>{cur.k=+b.dataset.k;$$('#hk [data-k]').forEach(x=>x.setAttribute('aria-pressed',x===b));scene();sfx('pop',.4);if(prev&&prev.p>=0)$('#hm').textContent=a.yest(a.kinds[prev.p],a.kinds[cur.k])});
 $$('#hf [data-f]').forEach(b=>b.onclick=()=>{cur.f=+b.dataset.f;$$('#hf [data-f]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
 $$('#hp [data-p]').forEach(b=>b.onclick=()=>{cur.p=+b.dataset.p;$$('#hp [data-p]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
 const graph=el(`<div class="card"><h3>${a.count}</h3><div id="hg"></div></div>`);pnl.appendChild(graph);
 const drawG=()=>{const cnt=[0,0,0,0,0];const days=Object.keys(store.hava).sort().slice(-14);days.forEach(d=>{const k=store.hava[d].k;if(k>=0)cnt[k]++});
  $('#hg').innerHTML=`<div style="display:flex;gap:4px;flex-wrap:wrap">${days.map(d=>`<span title="${d}">${wIcon(store.hava[d].k,26)}</span>`).join('')||'<span class="muted">—</span>'}</div><div style="display:flex;gap:10px;align-items:flex-end;height:110px;margin-top:8px">${cnt.map((n,i)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px"><b class="num">${n}</b><i style="display:block;width:100%;height:${6+n*14}px;background:var(--aurora);border-radius:6px 6px 0 0"></i>${wIcon(i,24)}</div>`).join('')}</div><p class="muted num" style="margin:4px 0 0;font-size:13px">${days.length} ${a.days}</p>`};drawG();
 $('#hs').onclick=async()=>{if(cur.k<0){speak('sec',T().c.sec);return}store.hava[today]={...cur};save();drawG();sfx('success',.5);$('#hm').textContent=a.saved;await whyCard(pnl,'hava',3,g)}};
/* ===================== MÜHENDİSLİK ===================== */
function designPanel(pnl,groups,sel,onChange,extra=''){const c=el(`<div class="card">${groups.map(([key,label,opts,costs])=>`<div class="grp"><span>${label}</span><div class="chips">${opts.map((o,i)=>`<button class="chip" data-g="${key}" data-i="${i}" aria-pressed="${sel[key]===i}">${esc(o)}${costs?` <small>${costs[i]}🪙</small>`:''}</button>`).join('')}</div></div>`).join('')}${extra}<div class="btns"><button class="btn pri" id="dt" disabled>🔧 ${U().test}</button><span class="muted num" id="dtries"></span></div></div>`);pnl.appendChild(c);
 c.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{sel[b.dataset.g]=+b.dataset.i;c.querySelectorAll(`[data-g="${b.dataset.g}"]`).forEach(x=>x.setAttribute('aria-pressed',x===b));sfx('click',.3);onChange()});return c}
async function engLoop(id,g,pnl,sel,testFn){let tries=0;const u=U();
 return new Promise(res=>{$('#dt').disabled=false;$('#dt').onclick=async()=>{if($('#dt').disabled)return;$('#dt').disabled=true;tries++;$('#dtries').textContent=u.tries(tries);$$('.fb').forEach(x=>x.remove());
  speak('test',T().c.test,hostOf(id));const r=await testFn();if(!alive(g))return;
  if(r.ok){sfx('success',.6);fbk(pnl,true,A(id).h[r.key||'ok']);speak(`${id}-h-${r.key||'ok'}`,A(id).h[r.key||'ok'],hostOf(id));res({tries,r})}
  else{sfx('wrong',.4);fbk(pnl,false,A(id).h[r.key]);await speak(`${id}-h-${r.key}`,A(id).h[r.key],hostOf(id));$('#dt').disabled=false}}})}
ACTS.kopru=async()=>{const {g}=frame('kopru');const a=A('kopru'),u=U(),pnl=$('#pnl');const sel={mat:0,shape:0,leg:0};
 const STR={mat:[1,2,4],shape:[0,2,3],leg:[0,2]},COST={mat:[1,2,4],shape:[0,1,2],leg:[0,1]},MC=['#F8FAFC','#D6A76C','#92400E'];
 const cost=()=>COST.mat[sel.mat]+COST.shape[sel.shape]+COST.leg[sel.leg],str=()=>STR.mat[sel.mat]+STR.shape[sel.shape]+STR.leg[sel.leg];
 const bridge=(sag=0)=>{const c=MC[sel.mat];let s=`<path d="M170 222 Q300 ${222+sag} 430 222" stroke="${c}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M170 222 Q300 ${222+sag} 430 222" stroke="#0F172A" stroke-opacity=".35" stroke-width="2" fill="none"/>`;
  if(sel.shape===1)s+=`<path d="M176 234 Q300 ${300+sag} 424 234" stroke="${c}" stroke-width="10" fill="none"/>${[210,250,300,350,390].map(x=>`<line x1="${x}" y1="${226+sag*(1-Math.abs(x-300)/130)}" x2="${x}" y2="${236+(64)*(1-Math.pow((x-300)/124,2))+sag*.5}" stroke="${c}" stroke-width="5"/>`).join('')}`;
  if(sel.shape===2)s+=`<path d="M170 222 L${[203,236,268,300,333,366,398,430].map((x,i)=>`${x} ${i%2?222+sag*(1-Math.abs(x-300)/130):180+sag*(1-Math.abs(x-300)/130)}`).join(' L')}" stroke="${c}" stroke-width="5" fill="none"/><line x1="203" y1="${180}" x2="398" y2="180" stroke="${c}" stroke-width="5" transform="translate(0,${sag*.7})"/>`;
  if(sel.leg)s+=`<rect x="292" y="${228+sag}" width="16" height="${125-sag}" fill="${c}" stroke="#0F172A" stroke-opacity=".3"/>`;return s};
 const draw=(sag=0)=>{$('#br').innerHTML=bridge(sag);$('#cost').textContent=`${u.cost}: ${cost()} / 6 🪙`};
 $('#stage').innerHTML=`<svg ${V}>${SKY}<rect y="240" width="600" height="120" fill="#38BDF8"/><path d="M0 262 q30-8 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" stroke="#0369A1" stroke-width="3" fill="none"/><path d="M0 220 H172 V360 H0z" fill="#86EFAC"/><path d="M428 220 H600 V360 H428z" fill="#86EFAC"/><rect y="350" width="600" height="10" fill="#0369A1"/><g id="br"></g><g id="tos" style="transform:translate(50px,150px)">${IM('tosbi',0,0,110,76)}</g><circle id="spl" cx="300" cy="250" r="0" fill="#fff" opacity=".8"/><text id="cost" x="20" y="36" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="20" fill="#0F172A"></text></svg>`;
 designPanel(pnl,[['mat',a.g.mat,a.mat,COST.mat],['shape',a.g.shape,a.shape,COST.shape],['leg',a.g.leg,a.leg,COST.leg]],sel,()=>draw());draw();await intro('kopru',g);
 const tos=$('#tos');const move=async(x0,y0,x1,y1,ms)=>tween(ms,p=>tos.style.transform=`translate(${x0+(x1-x0)*p}px,${y0+(y1-y0)*p}px)`);
 const {tries}=await engLoop('kopru',g,pnl,sel,async()=>{if(cost()>6)return {ok:false,key:'budget'};const s=str();
  await move(50,150,245,146,1300);if(s>=5){await tween(500,p=>draw(6*p));await move(245,146,470,150,1300);return {ok:true}}
  await tween(600,p=>{draw(60*p);tos.style.transform=`translate(245px,${146+60*p}px)`});sfx('drip',.8);await tween(500,p=>{$('#spl').setAttribute('r',40*p);$('#spl').style.opacity=1-p});
  await sleep(500);draw(0);tos.style.transform='translate(50px,150px)';return {ok:false,key:'weak'}});
 await whyCard(pnl,'kopru',tries<=1?3:tries<=3?2:1,g)};
ACTS.kule=async()=>{const {g}=frame('kule');const a=A('kule'),u=U(),pnl=$('#pnl');const W=[170,116,66,116],C=['#4F46E5','#F59E0B','#047857','#BE123C'];let stack=[],round=0;const TGT=[5,6];
 const blockSVG=(t,i,ex='')=>{const w=W[t],y=310-(i+1)*40,x=300-w/2;return t===3?`<polygon points="${x},${y+40} ${x+w},${y+40} 300,${y}" fill="${C[t]}" ${ex}/>`:`<rect x="${x}" y="${y}" width="${w}" height="40" rx="6" fill="${C[t]}" stroke="#0F172A" stroke-opacity=".25" ${ex}/>`};
 const draw=()=>{$('#tw').innerHTML=stack.map((t,i)=>`<g data-l="${i}">${blockSVG(t,i)}</g>`).join('');$('#lvl').textContent=`${stack.length} / ${TGT[round]}`;$('#wind').style.display=round?'':'none'};
 $('#stage').innerHTML=`<svg ${V}>${SKY}${GROUND(310)}<g id="wind" fill="none" stroke="#6366F1" stroke-width="4" stroke-linecap="round" opacity=".7"><path d="M20 120h90a16 16 0 1 0-16-16M20 160h120M20 200h80a16 16 0 1 1-16 16"/></g><g id="tw"></g><text id="lvl" x="580" y="36" text-anchor="end" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="22" fill="#0F172A"></text></svg>`;
 const ctl=el(`<div class="card"><div class="chips" id="kr">${a.r.map((r,i)=>`<span class="chip" aria-pressed="${i===0}">${r}</span>`).join('')}</div><div class="opts">${a.blocks.map((b,i)=>`<button class="opt" data-b="${i}"><svg width="40" height="26" viewBox="0 0 40 26">${i===3?`<polygon points="2,24 38,24 20,2" fill="${C[i]}"/>`:`<rect x="${20-W[i]/9}" y="4" width="${W[i]/4.5}" height="18" rx="3" fill="${C[i]}"/>`}</svg>${b}</button>`).join('')}</div>
  <div class="btns"><button class="btn ghost sm" id="kun">↶ ${a.undo}</button><button class="btn ghost sm" id="kcl">↺ ${u.reset}</button><button class="btn pri" id="dt" disabled>🔧 ${u.test}</button><span class="muted num" id="dtries"></span></div></div>`);pnl.appendChild(ctl);
 $$('[data-b]').forEach(b=>b.onclick=()=>{if(stack.length>=8)return;stack.push(+b.dataset.b);sfx('pop',.4);draw()});$('#kun').onclick=()=>{stack.pop();draw()};$('#kcl').onclick=()=>{stack=[];draw()};
 draw();await intro('kule',g);let total=0;
 for(round=0;round<2;round++){draw();$$('#kr .chip').forEach((c,i)=>c.setAttribute('aria-pressed',i===round));if(round){stack=[];draw();speak('',a.r[1],hostOf('kule'))}
  const {tries}=await engLoop('kule',g,pnl,{},async()=>{let fail=-1,key='';for(let i=1;i<stack.length;i++){if(stack[i-1]===3){fail=i;key='roof';break}if(stack[i]!==3&&W[stack[i]]>W[stack[i-1]]){fail=i;key="wide";break}}
   if(fail<0&&stack.length<TGT[round])return {ok:false,key:'short'};if(fail<0&&round===1&&stack[0]!==0){fail=0;key='windy'}
   const tw=$('#tw');tw.style.transformOrigin='300px 310px';tw.style.animation='wob .5s 2';await sleep(1000);tw.style.animation='';
   if(fail<0)return {ok:true};$$('#tw [data-l]').forEach(G=>{if(+G.dataset.l>=fail){G.style.transition='transform 1s ease-in';G.style.transformOrigin='300px 300px';G.style.transform=`translate(${160+20*+G.dataset.l}px,${(+G.dataset.l-fail+1)*40}px) rotate(70deg)`}});sfx('boing',.5);await sleep(1300);draw();return {ok:false,key}});
  total+=tries;if(!alive(g))return;await sleep(900)}
 await whyCard(pnl,'kule',total<=2?3:total<=5?2:1,g)};
ACTS.semsiye=async()=>{const {g}=frame('semsiye');const a=A('semsiye'),u=U(),pnl=$('#pnl');const sel={cover:0,stick:0,shape:0};const CC=['#F8FAFC','#38BDF8','#FB7185'];
 const umb=(bend=0,torn=false,pud=false)=>{const c=CC[sel.cover];const top=sel.shape?`M180 150 Q300 40 420 150 Z`:`M180 140 Q300 110 420 140 L420 150 L180 150 Z`;
  return `<g transform="rotate(${bend} 300 300)"><path d="${top}" fill="${c}" stroke="#0F172A" stroke-opacity=".4" stroke-width="3"/>${sel.cover===2?`<g fill="#fff" opacity=".6">${[220,260,300,340,380].map(x=>`<circle cx="${x}" cy="${sel.shape?120:138}" r="5"/>`).join('')}</g>`:''}${torn?`<path d="M230 150 l10 -18 l8 18 M330 150 l6 -22 l10 22" fill="var(--stage-sky)" stroke="#0F172A" stroke-opacity=".4"/>`:''}${pud?`<ellipse cx="300" cy="118" rx="70" ry="9" fill="#0369A1" opacity=".55"/>`:''}
   <line x1="300" y1="${sel.shape?60:120}" x2="300" y2="300" stroke="${sel.stick?'#92400E':'#F472B6'}" stroke-width="${sel.stick?9:5}" ${sel.stick?'':'stroke-dasharray="8 6"'} stroke-linecap="round"/></g>`};
 const draw=(o={})=>{$('#um').innerHTML=umb(o.bend||0,o.torn,o.pud);$('#dk').setAttribute('href',`img/${o.wet?'kirpi-wet':'kirpi-happy'}.webp`)};
 $('#stage').innerHTML=`<svg ${V}>${SKY}${GROUND(300)}<image id="dk" href="img/kirpi-happy.webp" x="235" y="190" width="130" height="115"/><g id="um"></g><g id="rn" opacity="0" stroke="#0369A1" stroke-width="3" stroke-linecap="round">${Array.from({length:40},(_,i)=>`<line x1="${(i*53)%600}" y1="${(i*37)%300-40}" x2="${(i*53)%600-6}" y2="${(i*37)%300-22}"/>`).join('')}</g></svg>`;
 designPanel(pnl,[['cover',a.g.cover,a.cover],['stick',a.g.stick,a.stick],['shape',a.g.shape,a.shape]],sel,()=>draw());draw();await intro('semsiye',g);
 const rain=async ms=>{const R=$('#rn');R.style.opacity=1;sfx('drip',.5);await tween(ms,p=>R.setAttribute('transform',`translate(${-20*((p*8)%1)},${60*((p*8)%1)})`));R.style.opacity=0};
 const {tries,r}=await engLoop('semsiye',g,pnl,sel,async()=>{await rain(1800);
  if(sel.cover===0){draw({torn:true,wet:true});return {ok:false,key:'paper'}}if(sel.stick===0){for(let k=0;k<3;k++){draw({bend:k*9});await sleep(150)}draw({bend:25,wet:true});return {ok:false,key:'straw'}}
  if(sel.cover===2){draw({wet:true});return {ok:false,key:'cloth'}}if(sel.shape===0){draw({pud:true});return {ok:false,key:'flat'}}draw();return {ok:true}});
 await whyCard(pnl,'semsiye',tries<=2?3:tries<=4?2:1,g)};
ACTS.rampa=async()=>{const {g}=frame('rampa');const a=A('rampa'),u=U(),pnl=$('#pnl');const sel={h:0,s:0};const TG=[4,9,3],D=[[1,2,3],[2,4,6],[3,6,9]],SC=['#BE123C','#B45309','#7DD3FC'];let round=0;const X=k=>160+k*42;
 const draw=(bx,by,rot=0)=>{const h=(sel.h+1)*45;$('#rp').innerHTML=`${Array.from({length:sel.h+1},(_,i)=>`<rect x="20" y="${300-(i+1)*45}" width="44" height="45" fill="#FDE68A" stroke="#B45309" stroke-width="2"/>`).join('')}<polygon points="20,${300-h} 160,300 20,300" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/><line x1="20" y1="${300-h}" x2="160" y2="300" stroke="${SC[sel.s]}" stroke-width="9" ${sel.s===0?'stroke-dasharray="4 3"':''}/>`;
  $('#bk').setAttribute('x',X(TG[round])-28);$('#ball').setAttribute('transform',`translate(${bx??30},${by??(300-h-34)}) rotate(${rot} 17 17)`)};
 $('#stage').innerHTML=`<svg ${V}>${SKY}<rect y="300" width="600" height="60" fill="#E2E8F0"/><g id="rp"></g><g font-family="Inter,sans-serif" font-size="13" fill="#475569" text-anchor="middle">${Array.from({length:10},(_,i)=>`<line x1="${X(i+1)}" x2="${X(i+1)}" y1="300" y2="310" stroke="#64748B" stroke-width="2"/><text x="${X(i+1)}" y="328">${i+1}</text>`).join('')}</g><image id="bk" href="img/basket.webp" x="0" y="252" width="56" height="52"/><g id="ball">${IM('top',0,0,34,34)}</g><text id="rd" x="580" y="36" text-anchor="end" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="20" fill="#0F172A"></text></svg>`;
 designPanel(pnl,[['h',a.g.h,a.hs],['s',a.g.s,a.ss]],sel,()=>draw());draw();await intro('rampa',g);let total=0;
 for(round=0;round<3;round++){$('#rd').textContent=a.round(round+1)+' / 3';draw();
  const {tries}=await engLoop('rampa',g,pnl,sel,async()=>{const h=(sel.h+1)*45,d=D[sel.s][sel.h];sfx('whoosh',.4);
   await tween(700,p=>draw(30+p*(140-30),300-h-34+p*(h),p*200));await tween(300+d*160,p=>draw(140+p*(X(d)-17-140),266,200+p*d*60));
   if(d===TG[round])return {ok:true};await sleep(500);draw();return {ok:false,key:d<TG[round]?'short':'long'}});total+=tries;if(!alive(g))return;await sleep(900)}
 await whyCard(pnl,'rampa',total<=4?3:total<=7?2:1,g)};
ACTS.kaldirac=async()=>{const {g}=frame('kaldirac');const a=A('kaldirac'),u=U(),pnl=$('#pnl');const R=[{W:2,F:1,f:3,mv:'f'},{W:3,F:1,f:3,mv:'f'},{W:6,F:1,f:2,mv:'F'}];let round=0,st;const PX=u=>90+70*u;
 const draw=(ang=0)=>{const fx=PX(st.f),sz=50+st.W*10;$('#lv').innerHTML=`<polygon points="${fx},232 ${fx-26},292 ${fx+26},292" fill="#475569"/><g style="transform-origin:${fx}px 228px;transform:rotate(${ang}deg);transition:transform .9s cubic-bezier(.3,.1,.3,1.2)" id="pl"><rect x="80" y="220" width="440" height="16" rx="6" fill="#B45309"/>${IM('tas',92,220-sz*.8,sz,sz*.8)}${Array.from({length:st.F},(_,i)=>IM('zipzip',470-i*34,130,60,92)).join('')}</g>
  <g font-family="Inter,sans-serif" font-size="12" fill="#475569" text-anchor="middle">${[1,2,3,4,5].map(k=>`<circle cx="${PX(k)}" cy="304" r="${k===st.f?7:4}" fill="${k===st.f?'#4F46E5':'#94A3B8'}"/>`).join('')}</g>`};
 $('#stage').innerHTML=`<svg ${V}>${SKY}${GROUND(296)}<g id="lv"></g><text id="rd" x="580" y="36" text-anchor="end" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="20" fill="#0F172A"></text></svg>`;
 const ctl=el(`<div class="card"><p class="q" id="kq"></p><div id="kc"></div><div class="btns"><button class="btn pri" id="dt" disabled>⬇ ${a.push}</button><span class="muted num" id="dtries"></span></div></div>`);pnl.appendChild(ctl);
 st={...R[0]};draw();await intro('kaldirac',g);let total=0;
 for(round=0;round<3;round++){st={...R[round]};draw();$('#rd').textContent=`${round+1} / 3`;$('#kq').textContent=a.q[round];speak('kaldirac-q'+round,a.q[round],hostOf('kaldirac'));
  $('#kc').innerHTML=st.mv==='f'?`<div class="grp"><span>${a.fulcrum}</span><input type="range" min="1" max="5" step="1" value="${st.f}" id="kf" aria-label="${a.fulcrum}" style="width:100%"></div>`:`<div class="grp"><span>${a.bunnies}</span><span class="stepper"><button id="bm">−</button><b id="bn">${st.F}</b><button id="bp">+</button></span></div>`;
  if(st.mv==='f')$('#kf').oninput=e=>{st.f=+e.target.value;draw()};else{$('#bm').onclick=()=>{st.F=Math.max(1,st.F-1);$('#bn').textContent=st.F;draw()};$('#bp').onclick=()=>{st.F=Math.min(4,st.F+1);$('#bn').textContent=st.F;draw()}}
  const {tries}=await engLoop('kaldirac',g,pnl,{},async()=>{const ok=st.F*(6-st.f)>=st.W*st.f;$('#pl').style.transform=`rotate(${ok?-14:3}deg)`;sfx(ok?'boing':'wrong',.5);await sleep(1300);if(ok)return {ok:true};$('#pl').style.transform='rotate(0deg)';await sleep(600);return {ok:false,key:'fail'}});
  total+=tries;if(!alive(g))return;await sleep(900)}
 await whyCard(pnl,'kaldirac',total<=4?3:total<=7?2:1,g)};
/* ===================== MATEMATİK ===================== */
function numpad(pnl,max=10){return new Promise(r=>{const w=el(`<div class="numpad">${Array.from({length:max},(_,i)=>`<button data-n="${i+1}">${i+1}</button>`).join('')}</div>`);pnl.appendChild(w);w.querySelectorAll('button').forEach(b=>b.onclick=()=>{w.querySelectorAll('button').forEach(x=>x.disabled=true);b.style.borderColor='var(--accent)';r({n:+b.dataset.n,w,b})})})}
ACTS.ayak=async()=>{const {g}=frame('ayak');const a=A('ayak'),u=U(),pnl=$('#pnl');
 $('#stage').innerHTML=`<svg ${V}>${SKY}${GROUND(240)}<rect x="120" y="150" width="360" height="62" rx="28" fill="#92400E"/><rect x="120" y="150" width="360" height="14" rx="7" fill="#B45309"/><ellipse cx="470" cy="181" rx="16" ry="30" fill="#D97706"/><ellipse cx="470" cy="181" rx="9" ry="18" fill="none" stroke="#92400E" stroke-width="2"/><line x1="120" y1="230" x2="120" y2="300" stroke="#0F172A" stroke-dasharray="4 4"/><line x1="480" y1="230" x2="480" y2="300" stroke="#0F172A" stroke-dasharray="4 4"/><g id="ft"></g></svg>`;
 const FOOT={d:[60,'#92400E'],z:[120,'#F9A8D4'],b:[40,'#4F46E5']};
 const fp=(t,i)=>{const [w,c]=FOOT[t],x=120+i*w;return t==='b'?`<rect x="${x+2}" y="262" width="${w-4}" height="34" rx="4" fill="${c}" stroke="#312E81"/>`:`<ellipse cx="${x+w*.45}" cy="280" rx="${w*.42}" ry="${t==='z'?16:13}" fill="${c}" stroke="#0F172A" stroke-opacity=".3"/>${[0,1,2].map(k=>`<circle cx="${x+w*.88}" cy="${270+k*10}" r="${t==='z'?6:4}" fill="${c}"/>`).join('')}`};
 await intro('ayak',g);let right=0;
 const measure=async(t,qi,ans)=>{const [w]=FOOT[t];let n=0;$('#ft').innerHTML='';const c=el(`<div class="card"><p class="q">${a.q[qi]}</p><div class="btns"><button class="btn ghost" id="fa">${t==='b'?'🟦 '+a.placeB:'👣 '+a.place}</button><b class="num" id="fc">0</b></div></div>`);pnl.appendChild(c);speak('ayak-q'+qi,a.q[qi],hostOf('ayak'));
  await new Promise(res=>{$('#fa').onclick=()=>{if(120+(n+1)*w>480.5){return}$('#ft').insertAdjacentHTML('beforeend',fp(t,n));n++;$('#fc').textContent=n;sfx('step',.5);if(120+(n+1)*w>480.5){$('#fa').disabled=true;res()}}});
  const r=await numpad(c,10);const ok=r.n===ans;right+=ok;r.b.classList.add(ok?'good':'badx');verdict(ok);fbk(c,ok,ok?u.right:`${u.actual}: ${ans}`);$('#fa').id='';$('#fc').id='';await sleep(700)};
 await measure('d',0,6);if(!alive(g))return;await measure('z',1,3);if(!alive(g))return;
 const r=await ask(pnl,a.q[2],a.why2,{voice:'ayak-q2',img:hostOf('ayak')});const ok=r.i===0;right+=ok;mark(r,ok);verdict(ok);fbk(r.card,ok,ok?u.right:u.diff);
 await measure('b',3,9);if(!alive(g))return;await whyCard(pnl,'ayak',right>=4?3:right>=2?2:1,g)};
ACTS.terazi=async()=>{const {g}=frame('terazi');const a=A('terazi'),u=U(),pnl=$('#pnl');const WT={karpuz:8,uzum:1,'oyuncak-ayi':1,tas:4,kitap:3,apple:2};let L=null,Rr=null,ang=0;
 const draw=()=>{const c=Math.cos(ang),s=Math.sin(ang),lx=300-170*c,ly=110-170*s,rx=300+170*c,ry=110+170*s;
  const pan=(x,y,it)=>`<line x1="${x}" y1="${y}" x2="${x-48}" y2="${y+80}" stroke="#64748B" stroke-width="2"/><line x1="${x}" y1="${y}" x2="${x+48}" y2="${y+80}" stroke="#64748B" stroke-width="2"/><path d="M${x-60} ${y+80} Q${x} ${y+112} ${x+60} ${y+80}z" fill="#F59E0B" stroke="#B45309" stroke-width="3"/>${it?IM(it,x-45,y+8,90,78):''}`;
  $('#sc').innerHTML=`<rect x="290" y="110" width="20" height="200" fill="#475569"/><rect x="230" y="300" width="140" height="18" rx="8" fill="#334155"/><line x1="${lx}" y1="${ly}" x2="${rx}" y2="${ry}" stroke="#334155" stroke-width="10" stroke-linecap="round"/><circle cx="300" cy="110" r="10" fill="#F59E0B"/>${pan(lx,ly,L)}${pan(rx,ry,Rr)}`};
 $('#stage').innerHTML=`<svg ${V}>${SKY}<rect y="318" width="600" height="42" fill="#E2E8F0"/><g id="sc"></g></svg>`;draw();await intro('terazi',g);let right=0;
 const weigh=async(l,r)=>{L=l;Rr=r;const t=WT[l]>WT[r]?-.18:WT[l]<WT[r]?.18:0;const a0=ang;sfx('pop',.4);await tween(1100,p=>{ang=a0+(t-a0)*p;draw()})};
 const P=[['karpuz','uzum'],['oyuncak-ayi','tas'],['kitap','apple']];
 for(let i=0;i<3;i++){if(!alive(g))return;L=Rr=null;ang=0;draw();const [x,y]=P[i];const r=await ask(pnl,a.q[i],[{t:a.items[x],img:`img/${x}.webp`},{t:a.items[y],img:`img/${y}.webp`}],{voice:'terazi-q'+i,img:hostOf('terazi')});
  await weigh(x,y);const hv=WT[x]>WT[y]?0:1;const ok=r.i===hv;right+=ok;mark(r,ok);verdict(ok);fbk(r.card,ok,ok?u.right:u.diff);await sleep(700)}
 const T3=['tas','kitap','oyuncak-ayi'];const r=await ask(pnl,a.q[3],T3.map(k=>({t:a.items[k],img:`img/${k}.webp`})),{voice:'terazi-q3',img:hostOf('terazi')});if(!alive(g))return;
 L=Rr=null;ang=0;await weigh('tas','kitap');const ok=r.i===0;right+=ok;mark(r,ok);verdict(ok);fbk(r.card,ok,ok?u.right:u.diff);await whyCard(pnl,'terazi',right>=4?3:right>=2?2:1,g)};
ACTS.grafik=async()=>{const {g}=frame('grafik');const a=A('grafik'),u=U(),pnl=$('#pnl');const H=A('hava').kinds;const DATA=[0,1,0,2,0,1,3,0,2,1],TRUE=[4,3,2,1];let bars=[0,0,0,0];
 const chart=(vals,title='')=>{$('#stage').innerHTML=`<svg ${V}><rect width="600" height="360" fill="var(--panel)"/><g font-family="Inter,sans-serif" font-size="14" fill="#64748B">${[0,1,2,3,4,5,6].map(k=>`<line x1="70" x2="570" y1="${300-k*40}" y2="${300-k*40}" stroke="#E2E8F0"/><text x="56" y="${305-k*40}" text-anchor="end">${k}</text>`).join('')}</g>
  ${vals.map((v,i)=>`<rect x="${100+i*120}" y="${300-v*40}" width="70" height="${v*40}" rx="6" fill="url(#ag)"/><g transform="translate(${115+i*120},310)">${wIcon(i,40).replace('<svg','<svg x="0" y="0"')}</g>`).join('')}
  <defs><linearGradient id="ag" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#4338CA"/><stop offset=".55" stop-color="#6366F1"/><stop offset="1" stop-color="#38BDF8"/></linearGradient></defs><text x="70" y="30" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="18" fill="var(--ink)">${title}</text></svg>`};
 chart(bars,a.t);await intro('grafik',g);if(!alive(g))return;
 const c=el(`<div class="card"><div style="display:flex;gap:4px;flex-wrap:wrap">${DATA.map(k=>wIcon(k,30)).join('')}</div><p class="q">${a.q[0]}</p>${[0,1,2,3].map(i=>`<div class="btns">${wIcon(i,30)}<span style="min-width:82px">${H[i]}</span><span class="stepper"><button data-m="${i}">−</button><b id="gv${i}">0</b><button data-p="${i}">+</button></span></div>`).join('')}<div class="btns"><button class="btn pri" id="gc">✓ ${u.check}</button></div></div>`);pnl.appendChild(c);speak('grafik-q0',a.q[0],hostOf('grafik'));
 const upd=()=>{bars.forEach((v,i)=>$('#gv'+i).textContent=v);chart(bars,a.t)};$$('[data-m]').forEach(b=>b.onclick=()=>{const i=+b.dataset.m;bars[i]=Math.max(0,bars[i]-1);upd()});$$('[data-p]').forEach(b=>b.onclick=()=>{const i=+b.dataset.p;bars[i]=Math.min(6,bars[i]+1);sfx('pop',.3);upd()});
 let tries=0;await new Promise(res=>{$('#gc').onclick=()=>{tries++;const ok=bars.every((v,i)=>v===TRUE[i]);$$('.fb').forEach(x=>x.remove());if(ok){verdict(true);fbk(c,true,u.right);$('#gc').disabled=true;res()}else{sfx('wrong',.4);fbk(c,false,T().c.yanlis);speak('yanlis',T().c.yanlis)}}});
 let right=0;let r=await ask(pnl,a.q[1],H.slice(0,4).map((t,i)=>({t,svg:wIcon(i,26)})),{voice:'grafik-q1',img:hostOf('grafik')});let ok=r.i===0;right+=ok;mark(r,ok);verdict(ok);fbk(r.card,ok,ok?u.right:u.diff);
 r=await ask(pnl,a.q[2],[{t:H[2],svg:wIcon(2,26)},{t:H[1],svg:wIcon(1,26)}],{voice:'grafik-q2',img:hostOf('grafik')});ok=r.i===1;right+=ok;mark(r,ok);verdict(ok);fbk(r.card,ok,ok?u.right:u.diff);
 const days=Object.values(store.hava).filter(d=>d.k>=0);if(days.length){const w=el(`<div class="btns"><button class="btn ghost sm">📊 ${a.own}</button></div>`);pnl.appendChild(w);w.querySelector('button').onclick=()=>{const cnt=[0,0,0,0];days.forEach(d=>{if(d.k<4)cnt[d.k]++});chart(cnt,a.own)}}
 await whyCard(pnl,'grafik',tries<=1&&right===2?3:right>=1?2:1,g)};
ACTS.simetri=async()=>{const {g}=frame('simetri');const a=A('simetri'),u=U(),pnl=$('#pnl');const COL=['#4F46E5','#F59E0B','#BE123C','#047857'];
 const PAT=[["aa..","abb.","abba",".bba","..aa","...a"],[".cc.","cddc","cddc",".cc.","..b.",".bb."],["d..a","dd.a",".dda","..d.",".cc.","cc.."]];let pc=0,right=[],totalT=0;
 const st=$('#stage');st.style.cssText='background:var(--panel);display:grid;place-items:center;padding:12px;aspect-ratio:auto';
 await intro('simetri',g);
 for(let k=0;k<3;k++){if(!alive(g))return;const P=PAT[k];right=Array.from({length:6},()=>Array(4).fill('.'));
  const draw=()=>{st.innerHTML=`<div style="width:100%"><p class="eyebrow" style="text-align:center">${a.round(k+1)} / 3</p><div class="sym" id="sym">${P.map((row,r)=>[...row].map((ch,c)=>`<button class="lk" tabindex="-1" style="background:${ch==='.'?'var(--panel)':COL['abcd'.indexOf(ch)]}" aria-hidden="true"></button>`).join('')+(r===0?'<span class="body"></span>':'')+right[r].map((ch,c)=>`<button data-r="${r}" data-c="${c}" style="background:${ch==='.'?'var(--panel)':COL['abcd'.indexOf(ch)]}" aria-label="${r+1}-${c+1}"></button>`).join('')).join('')}</div></div>`;
   $$('#sym [data-r]').forEach(b=>b.onclick=()=>{const r=+b.dataset.r,c=+b.dataset.c;right[r][c]=right[r][c]===pc?'.':pc;sfx('pop',.3);draw()})};
  draw();const c=el(`<div class="card"><p class="q">${a.q[0]}</p><div class="btns">${COL.map((cl,i)=>`<button class="swatch" data-s="${i}" style="background:${cl}" aria-pressed="${i===0}" aria-label="${i+1}"></button>`).join('')}</div><div class="btns"><button class="btn pri" id="sc">✓ ${u.check}</button></div></div>`);pnl.innerHTML='';pnl.appendChild(c);pc='a';
  if(k===0)speak('simetri-q0',a.q[0],hostOf('simetri'));
  $$('[data-s]').forEach(b=>b.onclick=()=>{pc='abcd'[+b.dataset.s];$$('[data-s]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
  await new Promise(res=>{$('#sc').onclick=()=>{totalT++;const ok=P.every((row,r)=>[...row].every((ch,cc)=>right[r][3-cc]===ch));$$('.fb').forEach(x=>x.remove());
   if(ok){verdict(true);fbk(c,true,u.right);$('#sc').disabled=true;setTimeout(res,900)}else{sfx('wrong',.4);fbk(c,false,T().c.yanlis);$$('#sym [data-r]').forEach(b=>{const r=+b.dataset.r,cc=+b.dataset.c;if(right[r][cc]!==P[r][3-cc])b.style.outline='3px dashed var(--bad)'})}}})}
 if(!alive(g))return;await whyCard(pnl,'simetri',totalT<=3?3:totalT<=6?2:1,g)};
ACTS.pizza=async()=>{const {g}=frame('pizza');const a=A('pizza'),u=U(),pnl=$('#pnl');const FR=[['kirpi-happy','tosbi-happy'],['kirpi-happy','tosbi-happy','piti','zipzip-jump'],['kirpi-happy','tosbi-happy','piti']];const FC=['#4F46E5','#047857','#BE123C','#B45309'];let n=0;
 const wedge=(i,nn,fill)=>{const a0=-Math.PI/2+i*2*Math.PI/nn,a1=a0+2*Math.PI/nn,r=118;return `<path d="M300 160 L${300+r*Math.cos(a0)} ${160+r*Math.sin(a0)} A${r} ${r} 0 ${nn===1?1:0} 1 ${300+r*Math.cos(a1)} ${160+r*Math.sin(a1)}Z" fill="${fill}" stroke="#B45309" stroke-width="3"/>`};
 const draw=(fr,owner=[],cnt=[])=>{$('#stage').innerHTML=`<svg ${V}>${SKY}<rect y="290" width="600" height="70" fill="#E2E8F0"/><circle cx="300" cy="160" r="128" fill="#F59E0B"/>${n?Array.from({length:n},(_,i)=>wedge(i,n,owner[i]!=null?(owner[i]<0?'#CBD5E1':FC[owner[i]]+'AA'):'#FDE68A')).join(''):'<circle cx="300" cy="160" r="118" fill="#FDE68A"/>'}
  ${[[260,110],[340,130],[290,200],[230,170],[360,190],[320,80]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9" fill="#BE123C"/>`).join('')}
  ${fr.map((f,i)=>{const x=60+i*(480/(fr.length-1||1));return `${IM(f,x-40,262,80,80)}<circle cx="${x+34}" cy="270" r="15" fill="${FC[i]}"/><text x="${x+34}" y="276" text-anchor="middle" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="16" fill="#fff">${cnt[i]??0}</text>`}).join('')}</svg>`};
 n=0;draw(FR[0]);await intro('pizza',g);let tot=0;
 for(let k=0;k<3;k++){if(!alive(g))return;n=0;const fr=FR[k];draw(fr);const c=el(`<div class="card"><p class="q">${a.q[k]}</p><div class="grp"><span>${a.cut}</span><div class="chips">${[2,3,4,6,8].map(v=>`<button class="chip" data-v="${v}">${v}</button>`).join('')}</div></div><div class="btns"><button class="btn pri" id="ps" disabled>🍕 ${a.share}</button></div></div>`);pnl.appendChild(c);speak('pizza-q'+k,a.q[k],hostOf('pizza'));c.scrollIntoView({block:'nearest',behavior:'smooth'});
  c.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{n=+b.dataset.v;c.querySelectorAll('[data-v]').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#ps').disabled=false;sfx('click',.3);draw(fr)});
  await new Promise(res=>{$('#ps').onclick=async()=>{$('#ps').disabled=true;tot++;$$('.fb').forEach(x=>x.remove());const f=fr.length,owner=[],cnt=Array(f).fill(0);const full=Math.floor(n/f)*f;
   for(let i=0;i<n;i++){owner[i]=i<full?i%f:-1;if(i<full)cnt[i%f]++;draw(fr,owner,cnt);sfx('pop',.3);await sleep(260)}
   if(n%f===0){verdict(true);const gcd=(x,y)=>y?gcd(y,x%y):x;const e=n/f,d=gcd(e,n);fbk(c,true,`${a.each(a.frac[k])}${n!==f?` ${e}/${n} = ${e/d}/${n/d}`:''}`);c.querySelectorAll('[data-v]').forEach(x=>x.disabled=true);setTimeout(res,900)}
   else{sfx('wrong',.4);fbk(c,false,a.unfair);$('#ps').disabled=false}}});$('#ps').id=''}
 if(!alive(g))return;await whyCard(pnl,'pizza',tot<=3?3:tot<=5?2:1,g)};
ACTS.carpma=async()=>{const {g}=frame('carpma');const a=A('carpma'),u=U(),pnl=$('#pnl');const RD=[{n:3,k:4,tot:12,ch:[7,10,12,16]},{n:2,k:5,tot:10,ch:[7,10,12,25]},{n:3,k:4,tot:12,fixK:1,ch:[2,3,4,12],askN:1}];let N=1,K=1;
 const draw=(nb=0)=>{$('#stage').innerHTML=`<svg ${V}>${SKY}<rect y="290" width="600" height="70" fill="#E2E8F0"/>${Array.from({length:nb},(_,i)=>{const x=40+i*(520/Math.max(nb,4));return `${IM('basket',x,190,110,104)}${Array.from({length:K},(_,j)=>IM('havuc',x+12+(j%3)*28,150+Math.floor(j/3)*-26,44,26,`transform="rotate(${-60+(j%3)*20} ${x+34+(j%3)*28} ${163+Math.floor(j/3)*-26})"`)).join('')}`}).join('')}<text x="580" y="36" text-anchor="end" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="22" fill="#0F172A">${nb?`${nb} × ${K} = ${nb*K}`:''}</text></svg>`};
 draw();await intro('carpma',g);let right=0,tries=0;
 for(let k=0;k<3;k++){if(!alive(g))return;const R=RD[k];N=1;K=R.fixK?R.k:1;draw();const tr=lang==='tr';
  const c=el(`<div class="card"><p class="q">${a.q[k]}</p><pre class="code" id="cc"></pre><div class="btns"><span class="grp"><span>${a.baskets}</span><span class="stepper"><button id="nm">−</button><b id="nv">${N}</b><button id="np">+</button></span></span><span class="grp"><span>${a.per}</span><span class="stepper"><button id="km" ${R.fixK?'disabled':''}>−</button><b id="kv">${K}</b><button id="kp" ${R.fixK?'disabled':''}>+</button></span></span></div><div class="btns"><button class="btn pri" id="cr">▶ ${a.run}</button></div></div>`);pnl.appendChild(c);speak('carpma-q'+k,a.q[k],hostOf('carpma'));c.scrollIntoView({block:'nearest',behavior:'smooth'});
  const code=()=>{$('#cc').innerHTML=`<span class="k">${tr?'tekrarla':'repeat'}</span>(<span class="n">${N}</span>) {\n  ${tr?'sepeteKoy':'putInBasket'}(<span class="n">${K}</span>)\n}\n<span class="c">// ${N} × ${K} = ${N*K}</span>`};code();
  $('#nm').onclick=()=>{N=Math.max(1,N-1);$('#nv').textContent=N;code()};$('#np').onclick=()=>{N=Math.min(6,N+1);$('#nv').textContent=N;code()};$('#km').onclick=()=>{K=Math.max(1,K-1);$('#kv').textContent=K;code()};$('#kp').onclick=()=>{K=Math.min(6,K+1);$('#kv').textContent=K;code()};
  await new Promise(res=>{$('#cr').onclick=async()=>{tries++;$$('.fb').forEach(x=>x.remove());for(let i=1;i<=N;i++){draw(i);sfx('pop',.4);await sleep(380)}
   const okSet=R.askN?N*K===R.tot:(N===R.n&&K===R.k);if(okSet){$('#cr').disabled=true;res()}else{sfx('wrong',.4);fbk(c,false,T().c.yanlis);speak('yanlis',T().c.yanlis)}}});
  const q=R.askN?a.howMany:a.total;const r=await ask(c,q,R.ch.map(String));const ans=R.askN?R.n:R.tot;const ok=R.ch[r.i]===ans;right+=ok;mark(r,ok);verdict(ok);fbk(r.card,ok,ok?u.right:`${u.actual}: ${ans}`);
  ['cc','nm','np','km','kp','nv','kv','cr'].forEach(i=>{const e=$('#'+i);if(e){e.removeAttribute('id');if(e.tagName==='BUTTON')e.disabled=true}});await sleep(700)}
 if(!alive(g))return;await whyCard(pnl,'carpma',right===3&&tries<=4?3:right>=2?2:1,g)};
/* ===================== TEKNOLOJİ & SANAT ===================== */
ACTS.kapi=async()=>{const {g}=frame('kapi');const a=A('kapi'),u=U(),pnl=$('#pnl');let sc=0,sel={s:-1,x:-1};
 const scene=(o={})=>{let s=SKY;if(sc===0)s+=`<rect y="290" width="600" height="70" fill="#CBD5E1"/><rect x="250" y="60" width="330" height="230" fill="#E0E7FF" stroke="#4338CA" stroke-width="4"/><text x="415" y="50" text-anchor="middle" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="24" fill="#312E81">MARKET</text><rect x="${330-(o.open||0)*70}" y="120" width="85" height="170" fill="#BAE6FD" stroke="#0369A1" stroke-width="3" opacity=".9"/><rect x="${415+(o.open||0)*70}" y="120" width="85" height="170" fill="#BAE6FD" stroke="#0369A1" stroke-width="3" opacity=".9"/><circle cx="415" cy="108" r="7" fill="${o.sense?'#F59E0B':'#94A3B8'}"/>${IM('ela',o.ex??30,150,90,150)}`;
  if(sc===1)s+=`<rect width="600" height="360" fill="#F1F5F9"/><rect y="290" width="600" height="70" fill="#CBD5E1"/><rect x="60" y="60" width="150" height="120" fill="${o.dark?'#1E293B':'#BAE6FD'}" stroke="#64748B" stroke-width="5"/>${o.on?'<circle cx="400" cy="170" r="130" fill="#FDE68A" opacity=".45"/>':''}${IM('lamba',300,80,200,220)}<rect width="600" height="360" fill="#0F172A" opacity="${o.dark?(o.on?.35:.7):0}"/>`;
  if(sc===2)s+=`<rect y="290" width="600" height="70" fill="#E2E8F0"/>${IM(o.wilt?'flower-off':'potFlower',200,70,200,230)}<rect x="232" y="180" width="136" height="20" fill="${o.dry?'#D6A76C':'#78350F'}" opacity=".85"/><g transform="translate(400,40)"><rect width="120" height="24" rx="8" fill="#94A3B8"/><rect x="10" y="24" width="14" height="40" fill="#64748B"/></g>${o.water?`<g fill="#0369A1">${[0,1,2,3].map(i=>`<circle cx="${417-i*40}" cy="${110+i*18}" r="6"/>`).join('')}</g>`:''}`;
  $('#stage').innerHTML=`<svg ${V}>${s}</svg>`};
 scene({});await intro('kapi',g);let tot=0;
 for(sc=0;sc<3;sc++){if(!alive(g))return;sel={s:-1,x:-1};scene({dry:sc===2});const tr=lang==='tr';
  const c=el(`<div class="card"><p class="eyebrow" style="margin:0">${a.sc[sc]}</p><p class="q">${a.q[sc]}</p><div class="grp"><span>${a.if}</span><div class="chips">${a.sens.map((t,i)=>`<button class="chip" data-s="${i}">${t}</button>`).join('')}</div></div><div class="grp"><span>${a.then}</span><div class="chips">${a.acts.map((t,i)=>`<button class="chip" data-x="${i}">${t}</button>`).join('')}</div></div><pre class="code" id="kc"></pre><div class="btns"><button class="btn pri" id="dt" disabled>🔧 ${u.test}</button><span class="muted num" id="dtries"></span></div></div>`);pnl.appendChild(c);speak('kapi-q'+sc,a.q[sc],hostOf('kapi'));c.scrollIntoView({block:'nearest',behavior:'smooth'});
  const SN=tr?['yaklaşanVar','karanlık','toprakKuru','sesVar']:['someoneNear','isDark','soilDry','soundHeard'],AN=tr?['kapıyıAç','lambayıYak','suVer','müzikÇal']:['openDoor','lightOn','waterPlant','playMusic'];
  const code=()=>{$('#kc').innerHTML=`<span class="k">${tr?'eğer':'if'}</span> (${sel.s<0?'…':SN[sel.s]}) {\n  ${sel.x<0?'…':AN[sel.x]}()\n}`};code();
  c.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{sel.s=+b.dataset.s;c.querySelectorAll('[data-s]').forEach(x=>x.setAttribute('aria-pressed',x===b));code()});c.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{sel.x=+b.dataset.x;c.querySelectorAll('[data-x]').forEach(x=>x.setAttribute('aria-pressed',x===b));code()});
  const {tries}=await engLoop('kapi',g,c,sel,async()=>{if(sel.s<0||sel.x<0){return {ok:false,key:'bad'}}const ok=sel.s===sc&&sel.x===sc;
   if(sc===0){await tween(1300,p=>scene({ex:30+p*170,sense:p>.6,open:ok&&p>.65?Math.min(1,(p-.65)*4):0}));if(ok){await tween(800,p=>scene({ex:200+p*170,open:1,sense:1}))}else{sfx('boing',.4)}}
   if(sc===1){await tween(900,p=>scene({dark:p>.3}));await sleep(300);scene({dark:true,on:ok})}
   if(sc===2){scene({dry:true});await sleep(700);if(ok){scene({dry:true,water:true});sfx('drip',.6);await sleep(800);scene({})}else scene({dry:true,wilt:true})}
   await sleep(400);if(!ok){$$('.fb').forEach(x=>x.remove());await sleep(200);scene({dry:sc===2})}return ok?{ok:true}:{ok:false,key:'bad'}});
  $('#kc').removeAttribute('id');$('#dt').removeAttribute('id');$('#dtries').removeAttribute('id');c.querySelectorAll('.chip').forEach(x=>x.disabled=true);tot+=tries;await sleep(800)}
 if(!alive(g))return;await whyCard(pnl,'kapi',tot<=4?3:tot<=7?2:1,g)};
ACTS.robot=async()=>{const {g}=frame('robot');const a=A('robot'),u=U(),pnl=$('#pnl');const TK=[{grip:0,j:1,x:225,y:258,obj:'top'},{grip:1,j:1,x:235,y:266,obj:'atac'},{grip:2,j:2,x:300,y:252,obj:'sand'},{grip:0,j:3,x:330,y:112,obj:'oyuncak-ayi'}];let t=0;const sel={grip:0,joint:0};const SEG=112,SX=120,SY=232;
 const gripper=(x,y,ang,kind)=>`<g transform="translate(${x},${y}) rotate(${ang*180/Math.PI})">${kind===0?'<path d="M0 0 L16 -12 M0 0 L16 12" stroke="#0F172A" stroke-width="6" stroke-linecap="round"/>':kind===1?`<g transform="rotate(-90) translate(-14,-4) scale(.45)">${magnetSVG(0,0,1)}</g>`:'<path d="M0 -10 Q22 -14 22 4 Q12 16 0 10z" fill="#64748B"/>'}</g>`;
 const objSVG=(o,x,y)=>o==='sand'?`<path d="M${x-30} ${y+12} Q${x} ${y-24} ${x+30} ${y+12}z" fill="#FCD34D"/>`:o==='atac'?IM('atac',x-20,y-24,40,40)+IM('atac',x+4,y-20,32,32):IM(o,x-28,y-30,56,56);
 const draw=(p=0,carry=false,reachOK=true)=>{const T=TK[t],j=sel.joint+1,L=j*SEG,dx=T.x-SX,dy=T.y-SY,d=Math.hypot(dx,dy),ang=Math.atan2(dy,dx);const len=Math.min(L,d)*p+ (1-p)*40;const ex=SX+Math.cos(ang*p-Math.PI/2*(1-p))*len,ey=SY+Math.sin(ang*p-Math.PI/2*(1-p))*len;
  const pts=[[SX,SY]];for(let i=1;i<=j;i++){const f=i/j;pts.push([SX+(ex-SX)*f+(i<j?Math.sin(ang)*18:0),SY+(ey-SY)*f-(i<j?Math.cos(ang)*18:0)])}
  $('#stage').innerHTML=`<svg ${V}>${SKY}<rect y="270" width="600" height="90" fill="#E2E8F0"/><rect x="0" y="262" width="600" height="10" fill="#94A3B8"/>${t===3?'<rect x="270" y="130" width="160" height="12" fill="#92400E"/><rect x="420" y="130" width="12" height="132" fill="#92400E"/>':''}${t===2?`<rect x="450" y="200" width="70" height="62" rx="6" fill="#BE123C"/>${carry==='done'?'<path d="M455 205 Q485 180 515 205z" fill="#FCD34D"/>':''}`:''}
   <rect x="${SX-40}" y="${SY}" width="80" height="30" rx="8" fill="#312E81"/>${carry?'':objSVG(T.obj,T.x,T.y)}<polyline points="${pts.map(q=>q.join(',')).join(' ')}" fill="none" stroke="#4F46E5" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>${pts.map(q=>`<circle cx="${q[0]}" cy="${q[1]}" r="10" fill="#F59E0B"/>`).join('')}${gripper(ex,ey,ang*p,sel.grip)}${carry===true?objSVG(T.obj,ex+10,ey):''}<rect x="470" y="300" width="110" height="40" rx="8" fill="#CBD5E1"/>${carry==='done'&&t!==2?objSVG(T.obj,525,300):''}</svg>`};
 draw();await intro('robot',g);let tot=0;
 const dc=designPanel(pnl,[['grip',a.g.grip,a.grip],['joint',a.g.joint,a.joint]],sel,()=>draw());dc.insertAdjacentHTML('afterbegin','<p class="q" id="rq"></p>');
 for(t=0;t<4;t++){if(!alive(g))return;draw();$('#rq').textContent=a.q[t];speak('robot-q'+t,a.q[t],hostOf('robot'));
  const {tries}=await engLoop('robot',g,pnl,sel,async()=>{const T=TK[t],reach=sel.joint+1>=T.j;await tween(1000,p=>draw(p));
   if(!reach){sfx('boing',.4);await sleep(400);draw();return {ok:false,key:'reach'}}if(sel.grip!==T.grip){sfx('wrong',.4);await sleep(400);draw();return {ok:false,key:'grip'}}
   draw(1,true);sfx('pop',.5);await sleep(600);draw(1,'done');return {ok:true}});tot+=tries;if(!alive(g))return;await sleep(900);$$('.fb').forEach(x=>x.remove())}
 pnl.appendChild(el(`<div class="card"><h3>🧱 ${a.dough}</h3><p style="margin:0">${a.doughText}</p></div>`));await whyCard(pnl,'robot',tot<=6?3:tot<=9?2:1,g)};
ACTS.desen=async()=>{const {g}=frame('desen',{stage:false});const a=A('desen'),u=U(),pnl=$('#pnl');let M=4,col='#4F46E5',size=6,strokes=0;
 pnl.innerHTML=`<div class="act"><div><canvas class="draw" id="cv" width="720" height="720" aria-label="${a.t}"></canvas></div><div class="pnl"><div class="card"><div class="grp"><span>${a.mirrors}</span><div class="chips">${[2,4,6,8].map(m=>`<button class="chip" data-m="${m}" aria-pressed="${m===M}">${m}</button>`).join('')}</div></div>
  <div class="grp"><span>${lang==='tr'?'Renk':'Colour'}</span><div class="btns">${['#4F46E5','#F59E0B','#BE123C','#047857','#38BDF8','#8B5CF6','#0F172A'].map(c=>`<button class="swatch" data-c="${c}" style="background:${c}" aria-pressed="${c===col}" aria-label="${c}"></button>`).join('')}</div></div>
  <div class="grp"><span>${a.size}</span><div class="chips">${[3,6,12].map(s=>`<button class="chip" data-z="${s}" aria-pressed="${s===size}">${'●'.repeat(s/3>2?3:s/3)}</button>`).join('')}</div></div>
  <div class="btns"><button class="btn ghost sm" id="dcl">↺ ${a.clear}</button><button class="btn pri sm" id="dfin" disabled>✓ ${u.done}</button></div></div><div id="wslot"></div></div></div>`;
 const cv=$('#cv'),ctx=cv.getContext('2d');const guides=()=>{ctx.save();ctx.strokeStyle='#E2E8F0';ctx.lineWidth=2;ctx.setLineDash([8,8]);for(let i=0;i<M;i++){const t=i*Math.PI/M;ctx.beginPath();ctx.moveTo(360-Math.cos(t)*360,360-Math.sin(t)*360);ctx.lineTo(360+Math.cos(t)*360,360+Math.sin(t)*360);ctx.stroke()}ctx.restore()};
 const clear=()=>{ctx.fillStyle='#fff';ctx.fillRect(0,0,720,720);guides()};clear();
 let last=null;const pt=e=>{const r=cv.getBoundingClientRect();return [(e.clientX-r.left)/r.width*720-360,(e.clientY-r.top)/r.height*720-360]};
 const seg=(p,q)=>{ctx.strokeStyle=col;ctx.lineWidth=size;ctx.lineCap='round';const n=M/2;for(let k=0;k<n;k++){const t=k*2*Math.PI/n;for(const s of [1,-1]){ctx.save();ctx.translate(360,360);ctx.rotate(t);ctx.scale(1,s);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();ctx.restore()}}};
 cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);last=pt(e);seg(last,[last[0]+.1,last[1]])};cv.onpointermove=e=>{if(!last)return;const p=pt(e);seg(last,p);last=p};cv.onpointerup=cv.onpointercancel=()=>{if(last){strokes++;if(strokes>=1)$('#dfin').disabled=false}last=null};
 $$('[data-m]').forEach(b=>b.onclick=()=>{M=+b.dataset.m;$$('[data-m]').forEach(x=>x.setAttribute('aria-pressed',x===b));clear()});$$('[data-c]').forEach(b=>b.onclick=()=>{col=b.dataset.c;$$('[data-c]').forEach(x=>x.setAttribute('aria-pressed',x===b))});$$('[data-z]').forEach(b=>b.onclick=()=>{size=+b.dataset.z;$$('[data-z]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
 $('#dcl').onclick=clear;speak('desen-intro',a.intro,hostOf('desen'));$('#dfin').onclick=async()=>{$('#dfin').disabled=true;await whyCard($('#wslot'),'desen',3,g)}};
ACTS.guvenlik=async()=>{const {g}=frame('guvenlik');const a=A('guvenlik'),u=U(),pnl=$('#pnl');let mist=0;
 const scene=p=>{let s=`<rect width="600" height="360" fill="#EEF2FF"/><rect y="290" width="600" height="70" fill="#C7D2FE"/>`;
  if(p===0||p===1||p===3)s+=`${IM('piti',60,120,200,130)}<g transform="translate(300,70)"><rect width="250" height="180" rx="18" fill="#0F172A"/><rect x="12" y="12" width="226" height="156" rx="10" fill="#E0F2FE"/>${p===0?IM('tosbi-happy',70,40,110,80):''}${p===1?`<rect x="24" y="30" width="200" height="70" rx="12" fill="#fff" stroke="#BE123C" stroke-width="3"/><text x="40" y="60" font-family="Inter,sans-serif" font-weight="700" font-size="17" fill="#0F172A">${lang==='tr'?'Adın ne? Nerede':'Your name? Where'}</text><text x="40" y="84" font-family="Inter,sans-serif" font-weight="700" font-size="17" fill="#0F172A">${lang==='tr'?'oturuyorsun?':'do you live?'} ❓</text>`:''}${p===3?`<rect x="40" y="50" width="170" height="60" rx="30" fill="#F59E0B"/><text x="125" y="88" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="800" font-size="20" fill="#fff">${lang==='tr'?'BEDAVA ALTIN!':'FREE GOLD!'}</text>`:''}</g>`;
  if(p===2)s+=`${IM('anne',320,40,150,260)}${IM('piti',90,150,180,120)}${IM('tablet',220,210,110,80)}`;
  if(p===4)s+=`${IM('piti-sad',60,110,220,140)}${IM('tablet',300,170,140,100)}${IM('saat',460,40,100,120)}`;
  if(p===5)s+=`${IM('piti',30,140,170,110)}<g transform="translate(220,30)"><rect width="350" height="250" rx="18" fill="#fff" stroke="#4F46E5" stroke-width="4"/>${[0,1,2,3].map(i=>`<circle cx="30" cy="${48+i*52}" r="13" fill="${['#BE123C','#F59E0B','#047857','#4F46E5'][i]}"/><text x="56" y="${54+i*52}" font-family="Inter,sans-serif" font-weight="700" font-size="17" fill="#0F172A">${(lang==='tr'?['Bilgi verme','Emin değilsen sor','Ekrana mola ver','Nazik ol']:['Do not share info','Not sure? Ask','Take screen breaks','Be kind'])[i]}</text>`).join('')}</g>`;
  $('#stage').innerHTML=`<svg ${V}>${s}</svg>`};
 scene(0);await intro('guvenlik',g);
 for(let p=0;p<a.pages.length;p++){if(!alive(g))return;scene(p);pnl.innerHTML=`<div class="card"><span class="muted num">${p+1} / ${a.pages.length}</span><p class="q" style="font-weight:600">${esc(a.pages[p])}</p></div>`;await speak('g-p'+p,a.pages[p],'piti');if(!alive(g))return;
  if(a.choice[p]){const ch=a.choice[p];let done=false;while(!done){const r=await ask(pnl,lang==='tr'?'Pıtı ne yapmalı?':'What should Pıtı do?',ch);if(!alive(g))return;word(`g-c${p}-${r.i}`);await sleep(900);
    if(r.i===1){mark(r,true);verdict(true);fbk(r.card,true,a.good);await speak('g-good',a.good);done=true}else{mist++;mark(r,false);sfx('wrong',.4);fbk(r.card,false,a.bad);await speak('g-bad',a.bad);r.card.remove()}}}
  if(p<a.pages.length-1)await btn(pnl,`${u.next} ▶`)}
 if(!alive(g))return;await whyCard(pnl,'guvenlik',mist===0?3:mist<=2?2:1,g)};
/* ---------- giriş ---------- */
function openAct(id){if(!ACTS[id])return home();ACTS[id]()}
texts();
(()=>{const h=(location.hash||'').slice(1);if(h&&ACTS[h]){openAct(h)}else{home();$('#say').textContent=T().c.app;$('#say').dataset.key='app'}})();
window.addEventListener('hashchange',()=>{const h=(location.hash||'').slice(1);if(ACTS[h])openAct(h)});
