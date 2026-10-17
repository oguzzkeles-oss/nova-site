/* Balanced local instrument samples; three-voice headroom also works on iOS. */
(function(root){
 const names=['drum','bell','xylo'],buffers=new Map(),active=new Map(),fallback=new Map();
 const gains={drum:.95,bell:.65,xylo:.65};
 let context=null,ready=null,epoch=0;
 function stop(){
  epoch++;
  for(const source of active.values()){try{source.stop()}catch(e){}}
  active.clear();
  for(const audio of fallback.values()){audio.pause();audio.currentTime=0}
 }
 function prepare(){
  const AudioContext=root.AudioContext||root.webkitAudioContext;
  if(!AudioContext)return Promise.resolve(false);
  if(!context)context=new AudioContext();
  if(context.state==='suspended')context.resume().catch(()=>{});
  if(!ready)ready=Promise.all(names.map(async name=>{
   const response=await fetch(`sfx/${name}-clear.mp3`);
   if(!response.ok)throw new Error('Instrument unavailable: '+name);
   buffers.set(name,await context.decodeAudioData(await response.arrayBuffer()));
  })).then(()=>true).catch(()=>{ready=null;return false});
  return ready;
 }
 async function play(name){
  if(!names.includes(name))return;
  const token=epoch,usable=await prepare();
  if(token!==epoch)return;
  if(usable&&context.state==='running'){
   const previous=active.get(name);if(previous){try{previous.stop()}catch(e){}}
   const source=context.createBufferSource(),gain=context.createGain();
   source.buffer=buffers.get(name);
   // Measured sample peaks × these gains sum to less than 0.95.
   gain.gain.value=gains[name];source.connect(gain);gain.connect(context.destination);
   source.onended=()=>{source.disconnect();gain.disconnect();if(active.get(name)===source)active.delete(name)};
   active.set(name,source);source.start();
  }else{
   const audio=fallback.get(name)||new Audio(`sfx/${name}-clear.mp3`);
   fallback.set(name,audio);audio.pause();audio.currentTime=0;audio.volume=gains[name];
   audio.play().catch(()=>{});
  }
 }
 root.NovaRhythmAudio={has:name=>names.includes(name),prepare,play,stop};
})(window);
