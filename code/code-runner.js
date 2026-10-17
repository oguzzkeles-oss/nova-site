/* Deterministic execution plan shared by automatic play and single-step play. */
(function(root){
'use strict';
const dirs={right:[1,0],left:[-1,0],up:[0,-1],down:[0,1]};
function trace(level,world,program){
 let x=level.start[0],y=level.start[1],fail=null,lastId=null,operations=0;
 const events=[],got=new Set(),wet=new Set();
 const wall=(a,b)=>level.walls.some(q=>q[0]===a&&q[1]===b);
 const goal=(a,b)=>level.goals.findIndex(q=>q[0]===a&&q[1]===b);
 const emit=(n,kind,extra={})=>events.push({id:n.id,kind,x,y,count:got.size,...extra});
 const move=(n,d)=>{const v=dirs[d];if(!v){fail='bosblok';return}const nx=x+v[0],ny=y+v[1];
  if(nx<0||ny<0||nx>4||ny>4)fail='kenar';else if(wall(nx,ny))fail='tas';
  if(fail){emit(n,'error',{error:fail});return}
  x=nx;y=ny;let collected=-1;const k=goal(x,y);
  if(!world.rain&&k>=0&&!got.has(k)){got.add(k);collected=k}
  emit(n,'move',{direction:d,collected,count:got.size});
  if(level.counter&&got.size>level.exact){fail='fazla';emit(n,'error',{error:fail})}
 };
 function walk(list,depth=0){
  if(depth>6){fail='bosblok';return}
  for(const n of list){if(fail)return;lastId=n.id;if(++operations>160){fail='kisa2';return}
   if(n.t==='mv')move(n,n.d);
   else if(n.t==='rain'){const k=goal(x,y);if(k<0||wet.has(k)){fail='bosa';emit(n,'error',{error:fail})}else{wet.add(k);emit(n,'rain',{watered:k})}}
   else if(n.t==='until'){const v=dirs[n.d];if(!v){fail='bosblok';return}for(let s=0;s<5&&!fail;s++){const a=x+v[0],b=y+v[1];if(a<0||a>4||b<0||b>4||wall(a,b))break;move(n,n.d)}}
   else if(n.t==='loop'){if(!n.body?.length||!Number.isInteger(n.n)||n.n<1||n.n>5){fail='bosblok';return}for(let i=0;i<n.n&&!fail;i++)walk(n.body,depth+1)}
   else if(n.t==='if'){const k=goal(x,y),matches=k>=0&&!wet.has(k);emit(n,'condition',{matches});if(matches)walk(n.body||[],depth+1)}
   else if(n.t==='call'){if(!program.f?.length){fail='bosblok';return}walk(program.f,depth+1)}
   else{fail='bosblok';return}
  }
 }
 if(!program.root.length)fail='bos';else walk(program.root);
 if(!fail){if(world.rain&&wet.size<level.goals.length)fail='kisa2';
  else if(!world.rain&&level.counter){if(got.size!==level.exact)fail='kisa2';else if(x!==level.basket[0]||y!==level.basket[1])fail='sepet'}
  else if(!world.rain&&got.size<level.goals.length)fail=world.id==='w1'?'kisa':'kisa2';}
 return {events,fail,lastId,x,y,collected:[...got],watered:[...wet]};
}
const api={trace};if(typeof module!=='undefined')module.exports=api;root.NovaCodeRunner=api;
})(typeof window==='undefined'?globalThis:window);
