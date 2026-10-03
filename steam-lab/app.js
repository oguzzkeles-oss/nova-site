/* NOVA ECE STEAM Lab — kabuk: gezinme, ses, kayıt, öğretmen paneli, masal bağlantıları */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const ON_SITE=/(^|\.)novaece\.com$/.test(location.hostname),IN_APP=location.protocol==='capacitor:'||(location.hostname==='localhost'&&!location.port);
const LINK=(path,art)=>ON_SITE?path:IN_APP?'https://novaece.com'+path:art;
const CODE_URL=LINK('/code/','https://claude.ai/artifact/9u9YWTYWet7qxi1dHovFt8');
let lang='tr',view='home',curArea=null,curAct=null,gen=0;
let store={done:{},log:[],hava:{},diary:[],pre:[]};
try{const s=JSON.parse(localStorage.getItem('novaSteam')||'{}');Object.assign(store,s);lang=s.lang||'tr'}catch(e){}
const save=()=>{try{localStorage.setItem('novaSteam',JSON.stringify({...store,lang}))}catch(e){}};
const T=()=>TX[lang],U=()=>TX[lang].ui,A=id=>TX[lang].a[id];
const areaOf=id=>AREAS.find(a=>a.acts.includes(id));
const HOSTIMG={piti:'piti',zip:'zipzip-jump',tosbi:'tosbi-happy',diken:'kirpi-happy'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* ---------- ses ---------- */
let voice=null;const sfxCache={};
function speak(key,text,img){$('#say').textContent=text;$('#say').dataset.key=key||'';if(img)$('#say-img').src=`img/${img}.webp`;if(voice){voice.pause();voice=null}
 if(!key)return Promise.resolve();return new Promise(res=>{try{voice=new Audio(`ses/${lang}/${key}.mp3`);const v=voice;v.onended=()=>res();v.onerror=()=>res();v.play().catch(()=>res());setTimeout(res,20000)}catch(e){res()}})}
function sfx(n,vol=.6){try{const a=(sfxCache[n]||(sfxCache[n]=new Audio(`sfx/${n}.mp3`))).cloneNode();a.volume=vol;a.play().catch(()=>{})}catch(e){}}
let actx=null;function tone(freq,dur=.6,vol=.25,type='triangle'){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,actx.currentTime);g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+dur);o.connect(g).connect(actx.destination);o.start();o.stop(actx.currentTime+dur)}catch(e){}}
/* ---------- görünüm ---------- */
function setTitle(t){$('#title').textContent=t}
function show(v){view=v;gen++;$('#back').hidden=v==='home';$('#ov').hidden=true;if(voice){voice.pause();voice=null}window.scrollTo(0,0)}
function texts(){$('#l-tr').setAttribute('aria-pressed',lang==='tr');$('#l-en').setAttribute('aria-pressed',lang==='en');document.documentElement.lang=lang;$('#back').setAttribute('aria-label',U().back);$('#rep').setAttribute('aria-label',U().listen)}
const ICO={teacher:'<svg viewBox="0 0 24 24"><rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M9 16.5V14.5M12 16.5V11.5M15 16.5V8.5"/></svg>',
 story:'<svg viewBox="0 0 24 24"><path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/></svg>',
 code:'<svg viewBox="0 0 24 24"><path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15"/></svg>'};
const AREA_C={sci:['--sci','--sci-bg','S'],eng:['--eng','--eng-bg','E'],math:['--math','--math-bg','M'],tech:['--tech','--tech-bg','T · A']};
function home(){show('home');setTitle(U().lab);const u=U();
 $('#view').innerHTML=`<div class="areas">${AREAS.map(a=>{const [c,cb,L]=AREA_C[a.id];const d=a.acts.filter(x=>store.done[x]).length;
  return `<button class="acard" data-area="${a.id}" style="--c:var(${c});--cb:var(${cb})"><span class="pic"><img src="img/${a.img}.webp" alt=""></span><span style="min-width:0;display:flex;flex-direction:column"><span class="letter">${L}</span><h2>${u.areas[a.id][0]}</h2><p>${u.areas[a.id][1]}</p><span class="dots" aria-label="${u.areaDone(d,a.acts.length)}">${a.acts.map(x=>`<i class="${store.done[x]?'on':''}"></i>`).join('')}</span></span></button>`}).join('')}</div>
 <p class="eyebrow" style="margin-top:20px">${lang==='tr'?'Öğretmen ve aile':'Teachers and families'}</p>
 <div class="tools" style="margin-top:10px">
  <button class="tcard" id="go-teacher"><span class="ti">${ICO.teacher}</span><span><b>${u.teacher}</b><span>${u.teacherSub}</span></span></button>
  <button class="tcard" id="go-stories"><span class="ti">${ICO.story}</span><span><b>${u.storyLink}</b><span>${u.storyLinkSub(STORY_LINKS.length)}</span></span></button>
  <a class="tcard" href="${CODE_URL}" target="_blank" rel="noopener"><span class="ti">${ICO.code}</span><span><b>NOVA ECE Code</b><span>${lang==='tr'?'Oyunla kodlama: 4 dünya, 24 bölüm':'Coding through play: 4 worlds, 24 levels'}</span></span></a></div>`;
 $$('[data-area]').forEach(b=>b.onclick=()=>area(b.dataset.area));$('#go-teacher').onclick=teacher;$('#go-stories').onclick=stories}
function actIcon(id){if(id==='pizza')return `<svg class="ico" viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" fill="#F59E0B"/><circle cx="32" cy="32" r="22" fill="#FDE68A"/><path d="M32 32 L32 5 M32 32 L55 45 M32 32 L9 45" stroke="#B45309" stroke-width="2.5"/><circle cx="24" cy="24" r="4" fill="#BE123C"/><circle cx="40" cy="28" r="4" fill="#BE123C"/><circle cx="32" cy="44" r="4" fill="#BE123C"/></svg>`;
 if(id==='miknatis')return `<svg class="ico" viewBox="0 0 64 64">${magnetSVG(8,6,1)}</svg>`;return `<img src="img/${ACT_IMG[id]}.webp" alt="">`}
function area(id){show('area');curArea=id;const a=AREAS.find(x=>x.id===id),u=U();setTitle(u.areas[id][0]);
 $('#view').innerHTML=`<div class="acts">${a.acts.map(x=>{const s=store.done[x];return `<button class="xcard" data-act="${x}">${actIcon(x)}<h3>${A(x).t}</h3><p>${A(x).d}</p>${s?`<span class="st" aria-label="${s.stars}/3">${'★'.repeat(s.stars)}</span>`:''}</button>`}).join('')}</div>`;
 $$('[data-act]').forEach(b=>b.onclick=()=>openAct(b.dataset.act));speak('',u.areas[id][1],HOSTIMG[a.host])}
$('#back').onclick=()=>{if(view==='act')area(areaOf(curAct).id);else home()};
/* ---------- etkinlik çerçevesi ---------- */
function frame(id,{stage=true}={}){const a=areaOf(id);curAct=id;show('act');setTitle(A(id).t);
 $('#view').innerHTML=stage?`<div class="act"><div class="stage" id="stage"></div><div class="pnl" id="pnl"></div></div>`:`<div class="pnl" id="pnl"></div>`;
 return {host:HOSTIMG[a.host],g:gen}}
const alive=g=>g===gen;
function hostOf(id){return HOSTIMG[areaOf(id).host]}
/* tahmin geri bildirimi */
function verdict(ok){sfx(ok?'success':'boing',.5);return ok}
/* tamamlama */
function complete(id,stars=3,{skipWhy=false}={}){const prev=store.done[id];store.done[id]={stars:Math.max(stars,prev?prev.stars:0),date:new Date().toISOString().slice(0,10),n:(prev?prev.n:0)+1};
 store.log.push({id,t:new Date().toISOString().slice(0,16).replace('T',' '),stars});if(store.log.length>400)store.log=store.log.slice(-400);save();
 const a=A(id),u=U(),host=hostOf(id),ar=areaOf(id),i=ar.acts.indexOf(id),nx=ar.acts[i+1];
 $('#modal').innerHTML=`<img class="h" src="img/${host}.webp" alt=""><h2>${lang==='tr'?'Aferin!':'Well done!'}</h2><div class="stars" aria-label="${stars}/3">${[0,1,2].map(k=>`<span class="${k<stars?'on':''}">★</span>`).join('')}</div>
  <div class="why"><b>${u.why}</b> ${esc(a.why)}</div><div class="home"><b>${u.youCan}:</b> ${esc(a.home)}</div>
  <div class="btns" style="justify-content:center"><button class="btn ghost" id="m-again">↺ ${u.again}</button>${nx?`<button class="btn pri" id="m-next">${A(nx).t} ▶</button>`:`<button class="btn pri" id="m-area">${u.areas[ar.id][0]}</button>`}</div>`;
 $('#ov').hidden=false;speak('bravo',T().c.bravo,host);
 $('#m-again').onclick=()=>openAct(id);if(nx)$('#m-next').onclick=()=>openAct(nx);else $('#m-area').onclick=()=>area(ar.id)}
/* neden kartı + bitir düğmesi */
async function whyCard(pnl,id,stars,g){if(!pnl.isConnected||(g!=null&&!alive(g)))return;const u=U();const d=document.createElement('div');d.className='card';d.innerHTML=`<div class="why"><b>${u.why}</b> ${esc(A(id).why)}</div><div class="btns"><button class="btn pri" id="fin">${u.done} ✓</button></div>`;pnl.appendChild(d);d.scrollIntoView({block:'nearest',behavior:'smooth'});
 $('#fin').onclick=()=>complete(id,stars);await speak(id+'-why',A(id).why,hostOf(id))}
/* ---------- öğretmen paneli ---------- */
let resetArm=false;
function teacher(){show('teacher');const t=T().teacher,u=U();setTitle(t.title);resetArm=false;
 const L=['S','T','E','A','M'],LN=lang==='tr'?{S:'Bilim',T:'Teknoloji',E:'Mühendislik',A:'Sanat',M:'Matematik'}:{S:'Science',T:'Technology',E:'Engineering',A:'Art',M:'Maths'};
 const all=AREAS.flatMap(a=>a.acts);
 const boxes=L.map(l=>{const xs=all.filter(x=>STEAM_TAGS[x].includes(l)),d=xs.filter(x=>store.done[x]).length;return `<div class="sbox"><span class="L">${l}</span><b>${LN[l]}</b><div class="bar"><i style="width:${xs.length?d/xs.length*100:0}%"></i></div><span class="num muted">${d} / ${xs.length} ${t.acts}</span></div>`}).join('');
 const rows=all.map(x=>`<tr><td><b>${A(x).t}</b></td><td>${[...STEAM_TAGS[x]].map(l=>`<span class="tag">${l}</span>`).join('')}</td><td>${KAZ[x].map(k=>`<span class="tag" title="${esc(t.kazNames[k])}">K${k}</span>`).join('')}</td><td>${store.done[x]?`✓ ${'★'.repeat(store.done[x].stars)} <span class="muted num">${store.done[x].date}</span>`:t.notyet}</td></tr>`).join('');
 const legend=Object.entries(t.kazNames).map(([k,v])=>`<span class="tag">K${k}</span> ${esc(v)}`).join(' · ');
 $('#view').innerHTML=`<div class="pnl">
 <p class="eyebrow">${t.prog}</p><div class="steam">${boxes}</div>
 <p class="eyebrow">${t.kaz}</p><div class="tbl"><table><thead><tr>${t.col.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>
 <p class="muted" style="font-size:13.5px;margin:0">${legend}</p><p class="muted" style="font-size:13px;margin:0">${t.kazNote}</p>
 <p class="eyebrow">${t.pre}</p><div class="card"><p class="muted" style="margin:0;font-size:14px">${t.preNote}</p>
  <div class="btns"><label>${t.code} <input type="text" id="pc" maxlength="16" placeholder="Ç01"></label><span class="chips" id="pp">${t.phases.map((p,i)=>`<button class="chip" data-ph="${i}" aria-pressed="${i===0}">${p}</button>`).join('')}</span><button class="btn pri sm" id="pstart">${t.begin}</button></div>
  <div id="pform"></div>
  <h3>${t.records}</h3><div id="precs"></div></div>
 <div class="card"><h3>${t.design}</h3><p style="margin:0;font-size:14.5px">${t.designText}</p></div>
 <p class="eyebrow">${t.usage}</p><div class="card"><div id="ulog"></div></div>
 <div class="btns"><button class="btn ghost sm" id="treset">${t.reset}</button><span class="muted" id="tmsg"></span></div></div>`;
 let phase=0;$$('[data-ph]').forEach(b=>b.onclick=()=>{phase=+b.dataset.ph;$$('[data-ph]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
 $('#pstart').onclick=()=>preForm(($('#pc').value||'').trim()||'—',phase);
 drawRecords();drawUsage();
 $('#treset').onclick=()=>{if(!resetArm){resetArm=true;$('#tmsg').textContent=t.resetq;return}store={done:{},log:[],hava:{},diary:[],pre:[]};save();teacher();$('#tmsg').textContent=t.resetok};
 speak('',lang==='tr'?'Öğretmen paneli: STEAM alanlarında ilerleme, kazanımlar ve ön/son test.':'Teacher panel: progress across STEAM areas, learning goals and pre/post test.','kirpi-happy')}
const FACE=i=>`<svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="32" fill="${['#FECDD3','#FDE68A','#BBF7D0'][i]}" stroke="${['#BE123C','#B45309','#047857'][i]}" stroke-width="3"/><circle cx="25" cy="30" r="4" fill="#0F172A"/><circle cx="47" cy="30" r="4" fill="#0F172A"/>${['<path d="M23 52 Q36 40 49 52" stroke="#0F172A" stroke-width="4" fill="none" stroke-linecap="round"/>','<path d="M24 48 H48" stroke="#0F172A" stroke-width="4" stroke-linecap="round"/>','<path d="M22 44 Q36 58 50 44" stroke="#0F172A" stroke-width="4" fill="none" stroke-linecap="round"/>'][i]}</svg>`;
function preForm(code,phase){const t=T().teacher;const ans=[];let i=0;const box=$('#pform');
 const step=()=>{if(i>=t.items.length){const rec={code,phase:t.phases[phase],ph:phase,date:new Date().toISOString().slice(0,10),answers:ans.slice(),total:ans.reduce((a,b)=>a+b,0)};store.pre.push(rec);save();box.innerHTML=`<div class="fb ok">${t.finish} ${t.total}: ${rec.total} / ${t.items.length*3}</div>`;drawRecords();return}
  box.innerHTML=`<div class="card" style="background:var(--soft)"><span class="muted num">${i+1} / ${t.items.length}</span><p class="q" style="margin:0">${esc(t.items[i])} <button class="chip" id="prep">🔊</button></p><div class="faces">${[0,1,2].map(k=>`<button class="face" data-a="${k}">${FACE(k)}${t.answers[k]}</button>`).join('')}</div></div>`;
  speak('pre-'+i,t.items[i],'kirpi-happy');$('#prep').onclick=()=>speak('pre-'+i,t.items[i]);
  $$('[data-a]').forEach(b=>b.onclick=()=>{ans.push(+b.dataset.a+1);sfx('pop',.4);i++;step()})};
 step()}
function csvPre(){const t=T().teacher;const h=['kod','asama','tarih',...t.items.map((_,i)=>'m'+(i+1)),'toplam'];return [h.join(','),...store.pre.map(r=>[r.code,r.ph===0?'on':'son',r.date,...r.answers,r.total].join(','))].join('\n')}
function drawRecords(){const t=T().teacher;const el=$('#precs');if(!el)return;if(!store.pre.length){el.innerHTML=`<p class="muted" style="margin:0">${t.none}</p>`;return}
 el.innerHTML=`<div class="tbl"><table><thead><tr><th>${t.code}</th><th>${t.phase}</th><th>📅</th><th>${t.total}</th><th></th></tr></thead><tbody>${store.pre.map((r,i)=>`<tr><td>${esc(r.code)}</td><td>${t.phases[r.ph]}</td><td class="num">${r.date}</td><td class="num">${r.total} / 30</td><td><button class="chip" data-del="${i}">${t.del}</button></td></tr>`).join('')}</tbody></table></div>
 <textarea id="csv" readonly>${esc(csvPre())}</textarea><div class="btns"><button class="btn ghost sm" id="copy">${t.copy}</button><span class="muted" id="cmsg"></span></div>`;
 $$('[data-del]').forEach(b=>b.onclick=()=>{store.pre.splice(+b.dataset.del,1);save();drawRecords()});
 $('#copy').onclick=()=>{const tx=$('#csv').value;navigator.clipboard.writeText(tx).then(()=>$('#cmsg').textContent=t.copied).catch(()=>{$('#csv').select();$('#cmsg').textContent=t.copyFail})}}
function drawUsage(){const t=T().teacher,el=$('#ulog');if(!store.log.length){el.innerHTML=`<p class="muted" style="margin:0">${t.none}</p>`;return}
 el.innerHTML=`<div class="tbl"><table><tbody>${store.log.slice(-30).reverse().map(l=>`<tr><td class="num">${l.t}</td><td>${A(l.id).t}</td><td>${'★'.repeat(l.stars)}</td></tr>`).join('')}</tbody></table></div>`}
/* ---------- masal bağlantıları ---------- */
function stories(){show('stories');const s=T().story;setTitle(s.title);
 $('#view').innerHTML=`<p class="muted" style="margin:0 0 12px">${s.sub}</p><div class="storyl">${STORY_LINKS.map(([no,tr,en,id])=>`<div class="sl"><span class="no">${lang==='tr'?'MASAL':'STORY'} ${no}</span><h3>${esc(lang==='tr'?tr:en)}</h3><div class="to">→ ${id==='pizza'||id==='miknatis'?'':`<img src="img/${ACT_IMG[id]}.webp" alt="">`}${A(id).t}</div><p><b>${s.home}:</b> ${esc(A(id).home)}</p><div class="btns"><button class="btn ghost sm" data-open="${id}">${s.open} ▶</button></div></div>`).join('')}</div>`;
 $$('[data-open]').forEach(b=>b.onclick=()=>openAct(b.dataset.open));speak('',s.sub,'kirpi-happy')}
/* ---------- dil ---------- */
function setLang(l){lang=l;save();texts();if(view==='home')home();else if(view==='area')area(curArea);else if(view==='teacher')teacher();else if(view==='stories')stories();else if(view==='act')openAct(curAct)}
$('#l-tr').onclick=()=>setLang('tr');$('#l-en').onclick=()=>setLang('en');
$('#rep').onclick=()=>{const k=$('#say').dataset.key;if(k)speak(k,$('#say').textContent)};
