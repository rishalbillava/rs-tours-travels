'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {useMotion} from './MotionProvider';
export default function CardEffects(){
 const pathname=usePathname();const {paused,light}=useMotion();
 useEffect(()=>{
  if(paused||light)return;const media=matchMedia('(hover:hover) and (pointer:fine)');let frame=0;let active,rect;
  const clear=()=>{cancelAnimationFrame(frame);if(active){['--tilt-x','--tilt-y','--shine-x','--shine-y'].forEach(k=>active.style.removeProperty(k));active=null}};
  const move=e=>{if(!media.matches||e.pointerType==='touch')return;const card=e.target.closest('.vehicle-card,.service-card');if(!card){clear();return}if(active!==card){clear();active=card;rect=card.getBoundingClientRect()}const x=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));const y=Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height));cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{card.style.setProperty('--tilt-x',`${(.5-y)*5}deg`);card.style.setProperty('--tilt-y',`${(x-.5)*6}deg`);card.style.setProperty('--shine-x',`${x*100}%`);card.style.setProperty('--shine-y',`${y*100}%`)})};
  document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',clear);window.addEventListener('scroll',clear,{passive:true});window.addEventListener('resize',clear);return()=>{document.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',clear);window.removeEventListener('scroll',clear);window.removeEventListener('resize',clear);clear()};
 },[paused,light,pathname]);return null;
}
