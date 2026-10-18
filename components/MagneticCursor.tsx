'use client';
import {useEffect,useRef} from 'react';
export default function MagneticCursor(){
 const ring=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  let frame=0,active:HTMLElement|null=null;
  const reset=()=>{active?.style.removeProperty('translate');active=null};
  const leave=()=>{cancelAnimationFrame(frame);reset();ring.current?.classList.remove('visible')};
  const move=(event:PointerEvent)=>{
   if(event.pointerType==='touch')return;
   const target=event.target as HTMLElement;
   cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
    const el=ring.current;if(!el)return;el.style.transform=`translate3d(${event.clientX}px,${event.clientY}px,0)`;el.classList.add('visible');el.classList.toggle('interactive',Boolean(target.closest('a,button,summary')));
    const magnetic=target.closest<HTMLElement>('[data-magnetic]');if(active!==magnetic)reset();
    if(magnetic){active=magnetic;const r=magnetic.getBoundingClientRect();magnetic.style.translate=`${Math.max(-5,Math.min(5,(event.clientX-r.left-r.width/2)*.1))}px ${Math.max(-4,Math.min(4,(event.clientY-r.top-r.height/2)*.1))}px`}
   });
  };
  document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',leave);window.addEventListener('blur',leave);
  return()=>{document.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);window.removeEventListener('blur',leave);leave()};
 },[]);
 return <div ref={ring} className="cursor-ring" aria-hidden="true"><span/></div>;
}
