type JourneyElements={
 root:HTMLElement;track:HTMLElement;map:HTMLElement;path:SVGPathElement;
 car:SVGGElement;progressPath:SVGPathElement;onMilestone:(index:number)=>void;
};
const clamp=(value:number)=>Math.max(0,Math.min(1,value));

// One small transform per scroll frame. Works with native touch scrolling and
// does not depend on GSAP, Lenis, device memory or the desktop effects setting.
export function attachJourneyScroll({root,track,map,path,car,progressPath,onMilestone}:JourneyElements){
 if(typeof path.getTotalLength!=='function')return()=>{};
 const length=path.getTotalLength();
 if(!length)return()=>{};
 const points=Array.from({length:121},(_,i)=>path.getPointAtLength(length*i/120));
 const mobile=matchMedia('(max-width:650px)');
 let frame=0,visible=true,disposed=false,lastProgress=-1,lastMilestone=-1;
 progressPath.setAttribute('stroke-dasharray',String(length));

 const paint=(progress:number)=>{
  if(Math.abs(progress-lastProgress)<.0001)return;
  lastProgress=progress;
  const position=progress*120,index=Math.min(119,Math.floor(position)),fraction=position-index;
  const a=points[index],b=points[index+1];
  const x=a.x+(b.x-a.x)*fraction,y=a.y+(b.y-a.y)*fraction;
  const angle=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI+90;
  car.setAttribute('transform',`translate(${x} ${y}) rotate(${angle})`);
  progressPath.setAttribute('stroke-dashoffset',String(length*(1-progress)));
  root.style.setProperty('--journey-progress',String(progress));
  const milestone=Math.min(2,Math.floor(progress*3));
  if(milestone!==lastMilestone){lastMilestone=milestone;onMilestone(milestone)}
 };
 const update=()=>{
  frame=0;if(disposed||!visible||document.hidden)return;
  const mapRect=map.getBoundingClientRect();
  if(mobile.matches){
   const trackRect=track.getBoundingClientRect();
   const stickyTop=parseFloat(getComputedStyle(map).top)||116;
   // The extra track space lets the car complete its route while the map stays
   // in view, rather than finishing before the mobile visitor sees it.
   const distance=Math.max(1,trackRect.height-mapRect.height);
   paint(clamp((stickyTop-trackRect.top)/distance));
  }else{
   const viewport=window.innerHeight;
   paint(clamp((viewport*.82-mapRect.top)/(mapRect.height+viewport*.42)));
  }
 };
 const schedule=()=>{if(!disposed&&visible&&!frame&&!document.hidden)frame=requestAnimationFrame(update)};
 const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
  visible=entries.some(entry=>entry.isIntersecting);
  if(visible)schedule();else{cancelAnimationFrame(frame);frame=0}
 },{rootMargin:'100px'}):null;
 observer?.observe(track);
 const resize=typeof ResizeObserver==='function'?new ResizeObserver(schedule):null;
 resize?.observe(track);resize?.observe(map);
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 window.visualViewport?.addEventListener('resize',schedule);
 mobile.addEventListener('change',schedule);
 document.addEventListener('visibilitychange',schedule);
 schedule();
 return()=>{
  disposed=true;cancelAnimationFrame(frame);observer?.disconnect();resize?.disconnect();
  window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);
  window.visualViewport?.removeEventListener('resize',schedule);mobile.removeEventListener('change',schedule);
  document.removeEventListener('visibilitychange',schedule);
 };
}
