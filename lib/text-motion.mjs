// A single entrance per mounted block. Cancelling always restores readable text.
export function createTextEntrance(element, {heading=false, letters=false, light=false, Observer=globalThis.IntersectionObserver}={}) {
 let played=false, enabled=false, observer=null;
 const animations=new Set();
 const stop=()=>{
  enabled=false;
  observer?.disconnect();observer=null;
  for(const animation of animations){animation.onfinish=null;animation.cancel()}
  animations.clear();
 };
 const play=()=>{
  if(!enabled||played)return;
  played=true;observer?.disconnect();observer=null;
  element.querySelectorAll('[data-motion-unit]').forEach((word,index)=>{
   if(typeof word.animate!=='function')return;
   const animation=word.animate([
    {transform:`translateY(${heading?'.35':'.2'}em)`},
    {transform:'translateY(0)'}
   ],{duration:light?400:heading?700:450,delay:Math.min(index,letters?36:10)*(letters?12:heading?35:20),easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
   animations.add(animation);
   animation.onfinish=()=>{animation.onfinish=null;animation.cancel();animations.delete(animation)};
  });
 };
 return {
  setEnabled(value){
   stop();enabled=value;
   if(!enabled||played)return;
   if(typeof Observer!=='function'){play();return}
   observer=new Observer(entries=>{if(entries.some(entry=>entry.isIntersecting))play()},{threshold:0.08,rootMargin:'0px 0px 24px 0px'});
   observer.observe(element);
  },
  stop
 };
}
