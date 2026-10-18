'use client';
import {useEffect,useRef,useState} from 'react';
import {useMotion} from './MotionProvider';

export default function ShowroomPhoto({vehicle}){
 const ref=useRef(null),played=useRef(false);
 const [loaded,setLoaded]=useState(false);
 const {paused}=useMotion();
 useEffect(()=>{if(ref.current?.complete&&ref.current.naturalWidth)setLoaded(true)},[]);
 useEffect(()=>{
  if(!loaded||paused||played.current||!ref.current?.animate)return;
  played.current=true;
  const animation=ref.current.animate([{opacity:.65,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'});
  return()=>animation.cancel();
 },[loaded,paused]);
 return <img ref={ref} onLoad={()=>setLoaded(true)} src={`/assets/vehicle-${vehicle.id}.webp`} alt={`${vehicle.name} — representative vehicle photo`} width="900" height="580" fetchPriority="high" decoding="async"/>;
}
