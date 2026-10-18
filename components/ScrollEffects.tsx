'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {useMotion} from './MotionProvider';
export default function ScrollEffects(){
 const pathname=usePathname(),{finePointer}=useMotion();
 useEffect(()=>{
  let disposed=false,cleanup=()=>{};
  Promise.all([import('gsap'),import('gsap/ScrollTrigger'),finePointer?import('lenis'):Promise.resolve(null)]).then(([{gsap},{ScrollTrigger},lenisModule])=>{
   if(disposed)return;gsap.registerPlugin(ScrollTrigger);
   const lenis=lenisModule?new lenisModule.default({lerp:.09,smoothWheel:true,syncTouch:false,anchors:true,prevent:node=>document.body.style.overflow==='hidden'||Boolean(node.closest('dialog,[data-lenis-prevent]'))}):null;
   const tick=(time:number)=>{if(!document.hidden)lenis?.raf(time*1000)};
   if(lenis){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(tick)}
   const context=gsap.context(()=>{
    gsap.utils.toArray<HTMLElement>('[data-reveal],.service-card,.tour-card,.process-grid article').forEach(el=>{
     gsap.fromTo(el,{y:24,opacity:.75},{y:0,opacity:1,duration:.75,ease:'power2.out',clearProps:'transform,opacity',scrollTrigger:{trigger:el,start:'top 94%',once:true}});
    });
    if(finePointer)gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(el=>gsap.fromTo(el,{y:0},{y:-(Number(el.dataset.parallax)||20),ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.8}}));
   });
   cleanup=()=>{context.revert();gsap.ticker.remove(tick);lenis?.destroy()};
  }).catch(()=>{});
  return()=>{disposed=true;cleanup()};
 },[pathname,finePointer]);return null;
}
