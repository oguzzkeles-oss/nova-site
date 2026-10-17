/* Keşif Adası: NOVA characters and original story-led coding routes. */
const MT=pair=>pair[lang==='en'?1:0];
const qStars=m=>store.stars['q-'+m.id]||0;
const difficultyOptions=[
 {id:'easy',label:['Kolay','Easy'],hint:['Oklar ve kısa yollar','Arrows and short paths']},
 {id:'medium',label:['Orta','Medium'],hint:['Döngüler ve koşullar','Loops and conditions']},
 {id:'hard',label:['Zor','Hard'],hint:['Bloklar ve hata çözme','Blocks and debugging']}
];
let difficulty='easy';
try{const saved=localStorage.getItem('novaCodeDifficulty');if(difficultyOptions.some(d=>d.id===saved))difficulty=saved}catch(e){}
const routeM=r=>r.missions.filter(m=>m.difficulty===difficulty);
const selectedRoutes=()=>NovaMissions.map((r,i)=>({r,i})).filter(({r})=>routeM(r).length);
const qDone=r=>routeM(r).filter(m=>qStars(m)>0).length;
function difficultyPicker(){return `<section class="difficulty-section" aria-label="${MT(['Zorluk seçimi','Choose difficulty'])}"><div class="difficulty-label">${MT(['Keşif seviyeni seç','Choose your exploration level'])}</div><div class="difficulty-picker">${difficultyOptions.map(d=>{const routes=NovaMissions.filter(r=>r.missions.some(m=>m.difficulty===d.id)),count=routes.reduce((n,r)=>n+r.missions.filter(m=>m.difficulty===d.id).length,0);return `<button data-difficulty="${d.id}" aria-pressed="${difficulty===d.id}"><strong>${MT(d.label)}</strong><span>${routes.length} ${MT(['rota','trails'])} · ${count} ${MT(['görev','missions'])}</span></button>`}).join('')}</div><p>${MT(difficultyOptions.find(d=>d.id===difficulty).hint)}</p></section>`}

function discoveryTexts(){
 $('#map-up').textContent=MT(['Yukarı','Up']);
 $('#map-down').textContent=MT(['Aşağı','Down']);
 $('#map-left').textContent=MT(['← Sol','← Left']);
 $('#map-right').textContent=MT(['Sağ →','Right →']);
 $('#map-mode').textContent=MT(['Tepeden görünüm','Top view']);
 $('#map-hint').textContent=MT(['Her ok, gösterdiği yönde bir kare ilerletir.','Each arrow moves one square in the direction it points.']);
 $('#board').setAttribute('aria-label',MT(['Tepeden görünüm, beşe beş kareli yön haritası','Top view, five by five direction map']));
 $('#classic-title').textContent=MT(['Serbest keşif · 4 dünya','Free exploration · 4 worlds']);
 $('#t-step').textContent=MT(['Bir adım','One step']);
 $('#t-restart').textContent=MT(['↺ Baştan dene','↺ Try again']);
 $('#back').setAttribute('aria-label',MT(['Geri','Back']));
 $('#rep').setAttribute('aria-label',MT(['Dinle','Listen']));
}
function renderDiscovery(){
 discoveryTexts();const entries=selectedRoutes(),total=entries.reduce((n,{r})=>n+qDone(r),0),missionCount=entries.reduce((n,{r})=>n+routeM(r).length,0);
 const next=entries.find(({r})=>qDone(r)<routeM(r).length);const nextRoute=(next||entries[0]).i;
 $('#discovery-home').innerHTML=`${difficultyPicker()}<section class="island-intro"><div class="island-kicker">${MT(['KÜÇÜK FİKİRLER, BÜYÜK KEŞİFLER','LITTLE IDEAS, BIG DISCOVERIES'])}</div><h1>${MT(['Keşif Adası','Discovery Island'])}</h1><p>${MT(['Dostlarınla düşün, kodunu kur, birlikte keşfet.','Think with your friends, build your code and explore together.'])}</p><div class="island-friends" aria-hidden="true"><img src="img/kirpi-happy.webp" alt=""><img src="img/tosbi-happy.webp" alt=""><img src="img/zipzip-jump.webp" alt=""><img src="img/piti.webp" alt=""></div><div class="island-bottom"><button class="island-cta" data-route="${nextRoute}">${total?MT(['Keşfe devam et','Keep exploring']):MT(['Keşfe başla','Start exploring'])} <span aria-hidden="true">↗</span></button><span class="island-progress"><b>${total}</b> / ${missionCount} ${MT(['görev','missions'])}<span class="island-meter"><i style="width:${total/missionCount*100}%"></i></span></span></div></section>
 <div class="route-heading"><h2>${MT(['Bir dost, yeni bir fikir','A friend, a new idea'])}</h2><span>${entries.length} ${MT(['beceri rotası','skill trails'])}</span></div>
 <div class="island-map">${entries.map(({r,i})=>{const done=qDone(r),missions=routeM(r),count=missions.length;return `<button class="route-card ${r.color} ${done===count?'route-complete':''}" data-route="${i}" aria-label="${MT(r.title)}, ${done}/${count} ${MT(['görev tamam','missions complete'])}"><span class="route-number">${done===count?'✓':String(i+1).padStart(2,'0')}</span><img src="img/${r.img}.webp" alt=""><span class="route-copy"><span class="route-skill">${MT(r.skill)}</span><strong>${MT(r.title)}</strong><span class="route-progress">${missions.map(m=>`<i class="${qStars(m)?'earned':''}" aria-hidden="true"></i>`).join('')}<span>${done}/${count}</span></span></span><span class="route-arrow" aria-hidden="true">↗</span></button>`}).join('')}</div>
 ${total===missionCount?`<div class="island-celebrate">★ ${MT(['Bütün rotaları keşfettin! Şimdi kendi bölümünü tasarla.','You explored every trail! Now design your own level.'])}</div>`:''}
 <div class="island-footnote"><span>✦ ${MT(['Düşün · Kur · Dene','Think · Build · Try'])}</span><span>${MT(['Kendi hızında keşfet','Explore at your own pace'])}</span></div>`;
 $('#discovery-home').onclick=e=>{const choice=e.target.closest('[data-difficulty]');if(choice){difficulty=choice.dataset.difficulty;try{localStorage.setItem('novaCodeDifficulty',difficulty)}catch(e){}renderDiscovery();return}const b=e.target.closest('[data-route]');if(b)openJourney(+b.dataset.route)};
}
function openJourney(index){activeJourney=index;activeMission=null;maker=null;show('journey');renderJourney();}
function renderJourney(){
 const r=NovaMissions[activeJourney],missions=routeM(r);$('#b-title').textContent=MT(r.skill);
 speak('',MT(r.intro),r.img);
 $('#v-journey').innerHTML=`<section class="journey-banner ${r.color}"><img src="img/${r.img}.webp" alt=""><div><span class="island-kicker">${MT(['KEŞİF ROTASI','DISCOVERY TRAIL'])} ${activeJourney+1}</span><h1>${MT(r.title)}</h1><p>${MT(r.intro)}</p></div></section>
 <div class="journey-list">${missions.map((m,i)=>`<button class="mission-card" data-mission="${i}"><span class="mission-num">${qStars(m)?'✓':i+1}</span><span><strong>${MT(m.title)}</strong><span>${MT(m.brief)}</span></span><span class="mission-stars" aria-label="${qStars(m)}/3">${qStars(m)?'★'.repeat(qStars(m)):'↗'}</span></button>`).join('')}</div>
 <aside class="journey-tip"><b>${MT(['Birlikte düşünelim','Think together'])}</b><p>${MT(r.adult)}</p></aside>`;
 $('#v-journey').onclick=e=>{const b=e.target.closest('[data-mission]');if(b)openMission(+b.dataset.mission)};
 $('#back').onclick=goHome;
}
function openMission(index){const m=routeM(NovaMissions[activeJourney])[index];openLevel(m.world,index,false,m);$('#back').onclick=()=>openJourney(activeJourney);}
function renderMissionLevels(){const r=NovaMissions[activeJourney];$('#lvl').innerHTML=routeM(r).map((m,i)=>`<button data-mission-level="${i}" class="${qStars(m)?'done ':''}${m===activeMission?'cur':''}" aria-label="${MT(m.title)}" ${m===activeMission?'aria-current="step"':''}>${i+1}</button>`).join('');$('#lvl').onclick=e=>{const b=e.target.closest('[data-mission-level]');if(b&&!running)openMission(+b.dataset.missionLevel)};}
function speakMission(){
 const m=activeMission;
 // Recorded mission narration is added later from the supplied ElevenLabs manifest.
 // Until then, no synthetic replacement or missing-file audio request is made.
 const key=(window.NovaMissionVoices?.[lang]||{})[m.id]||'';
 speak(key,MT(m.brief),W[m.world].hero.happy);
}
function decorateMission(){
 const el=$('#mission-brief');el.hidden=!activeMission;
 $('#back').onclick=activeMission?()=>openJourney(activeJourney):goHome;
 if(!activeMission)return;
 const m=activeMission;$('#b-title').textContent=MT(m.title);$('#code').hidden=true;
 el.innerHTML=`<div class="mission-breadcrumb"><button id="route-back">← ${MT(['Rotaya dön','Back to trail'])}</button><span>${MT(['DÜŞÜN → KUR → DENE','THINK → BUILD → TRY'])}</span></div><div class="thinking-note"><span aria-hidden="true">✦</span><p><b>${MT(['Önce bir tahmin','Make a prediction'])}</b> ${MT(m.think)}</p></div>`;
 $('#route-back').onclick=()=>openJourney(activeJourney);
}
function winMission(n){
 const m=activeMission,r=NovaMissions[activeJourney],missions=routeM(r),idx=missions.indexOf(m),stars=qStars(m);
 $('#modal').innerHTML=`<img src="img/${W[m.world].hero.happy}.webp" alt=""><h2>${MT(['Birlikte başardık!','We did it together!'])}</h2><p>${MT(m.title)}</p><div class="stars" aria-label="${stars}/3">${[1,2,3].map(i=>`<span class="${i<=stars?'on':''}">★</span>`).join('')}</div><p>${MT(['Planını kurdun, denedin ve hedefe ulaştın.','You made a plan, tested it and reached the goal.'])}</p><div class="actions"><button class="btn ghost sm" id="mission-again">${MT(['Bir daha','Try again'])}</button><button class="btn go sm" id="mission-next">${idx<missions.length-1?MT(['Sonraki görev','Next mission']):MT(['Rotaya dön','Back to trail'])} →</button></div><button class="map-return" id="mission-map">${MT(['Ada haritası','Island map'])}</button>`;
 $('#ov').hidden=false;drawLevels();$('#mission-again').onclick=()=>openMission(idx);$('#mission-next').onclick=()=>idx<missions.length-1?openMission(idx+1):openJourney(activeJourney);$('#mission-map').onclick=goHome;$('#mission-next').focus();
}
function drawDiscoveryTeacher(){
 $('#t-stats').insertAdjacentHTML('afterbegin',selectedRoutes().map(({r})=>{const s=store.stats['quest-'+difficulty+'-'+r.id]||{runs:0,fails:0};return `<div class="tbox"><span class="meta">${MT(r.title)}</span><b>${MT(r.skill)}</b><div class="bar"><i style="width:${qDone(r)/routeM(r).length*100}%"></i></div><span>${qDone(r)} / ${routeM(r).length} ${MT(['görev tamam','missions complete'])}</span><span class="meta">${s.runs} ${MT(['deneme','tries'])} · ${s.fails} ${MT(['yeniden düşünme','revisions'])}</span></div>`}).join(''));
 $('#t-guide').insertAdjacentHTML('afterbegin',`<h3>${MT(['Keşif Adası · birlikte öğrenme','Discovery Island · learning together'])}</h3><p>${MT(['İlk rotada yön kartlarıyla başlayın. Döngü ve blokları çocuk hazır olduğunda keşfedin. Bir adım düğmesiyle programı yavaşça izleyin; önce tahminini, sonra ne gördüğünü sorun. İlerleme kayıtları bu cihazda kalır ve bir gelişim testi değildir.','Start with direction cards on the first trail. Explore loops and blocks when your child is ready. Use One step to follow a program slowly; ask for a prediction, then ask what happened. Progress stays on this device and is not a developmental assessment.'])}</p>`);
}
// The existing progress key is retained so installed users keep their results.
document.body.dataset.view=view;renderDiscovery();
