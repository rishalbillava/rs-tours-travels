'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {fleet} from '../lib/fleet.mjs';
import {normalizeIndex} from '../lib/booking.mjs';
import {useMotion} from './MotionProvider';
import ShowroomView from './ShowroomView';
export default function Showroom(){
 const [current,setCurrent]=useState(7);const sceneRef=useRef(null),stackRef=useRef(null),frameRef=useRef(0);const {paused}=useMotion();
 const onLeave=useCallback(()=>{cancelAnimationFrame(frameRef.current);frameRef.current=0;stackRef.current?.style.removeProperty('--scene-rx');stackRef.current?.style.removeProperty('--scene-ry')},[]);
 useEffect(()=>{if(paused)onLeave();return onLeave},[paused,onLeave]);
 const onMove=e=>{
  if(paused||e.pointerType==='touch'||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  const r=sceneRef.current.getBoundingClientRect();
  const x=Math.max(-.5,Math.min(.5,(e.clientX-r.left)/r.width-.5));
  const y=Math.max(-.5,Math.min(.5,(e.clientY-r.top)/r.height-.5));
  cancelAnimationFrame(frameRef.current);
  frameRef.current=requestAnimationFrame(()=>{stackRef.current?.style.setProperty('--scene-rx',`${6-y*6}deg`);stackRef.current?.style.setProperty('--scene-ry',`${-13+x*8}deg`)});
 };
 const change=delta=>setCurrent(i=>normalizeIndex(i+delta));
 const onKeyDown=e=>{if(!e.target.closest('.showroom-nav'))return;if(e.key==='ArrowLeft'){e.preventDefault();change(-1)}if(e.key==='ArrowRight'){e.preventDefault();change(1)}};
 return <ShowroomView {...{current,setCurrent,sceneRef,stackRef,onMove,onLeave,onKeyDown,change}} vehicle={fleet[current]}/>;
}
