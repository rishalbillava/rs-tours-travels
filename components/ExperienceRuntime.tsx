'use client';
import dynamic from 'next/dynamic';
import {useEffect,useRef} from 'react';
import {useMotion} from './MotionProvider';
const ScrollEffects=dynamic(()=>import('./ScrollEffects'),{ssr:false});
const MagneticCursor=dynamic(()=>import('./MagneticCursor'),{ssr:false});
export default function ExperienceRuntime(){
 const {ready,paused,light,finePointer}=useMotion(),progress=useRef<HTMLDivElement>(null);
 useEffect(()=>{let frame=0;const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.current?.style.setProperty('transform',`scaleX(${max>0?scrollY/max:0})`)})};update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}},[]);
 return <><div ref={progress} className="scroll-progress" aria-hidden="true"/>{ready&&!paused&&!light&&<ScrollEffects/>}{ready&&!paused&&!light&&finePointer&&<MagneticCursor/>}</>;
}
