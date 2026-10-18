'use client';
import {ArrowIcon} from './Icons';
import Image from 'next/image';
import {useEffect,useRef,useState} from 'react';
import type {PointerEvent,KeyboardEvent} from 'react';
import type {Vehicle,PhotoSequence} from '../lib/types';
import {vehiclePhotos,photoMode,wrapFrame} from '../lib/vehicle-photos';
import {useMotion} from './MotionProvider';

export default function VehicleViewer({vehicle,sequence=vehiclePhotos[vehicle.id],priority=false}:{vehicle:Vehicle;sequence?:PhotoSequence;priority?:boolean}){
 const [failed,setFailed]=useState(false);
 const photos=!failed&&sequence?.frames.length?sequence.frames:[`/assets/vehicle-${vehicle.id}.webp`];
 const mode=failed?'photo':photoMode(sequence||{frames:[],fullTurn:false});
 const [frame,setFrame]=useState(0),[ready,setReady]=useState(false);
 const stage=useRef<HTMLDivElement>(null),picture=useRef<HTMLImageElement>(null);
 const drag=useRef<{x:number;y:number;frame:number}|null>(null);
 const {paused}=useMotion();
 useEffect(()=>{setFrame(0);setReady(false);setFailed(false)},[vehicle.id]);
 useEffect(()=>{
  if(photos.length<2)return;
  [wrapFrame(frame+1,photos.length),wrapFrame(frame-1,photos.length)].forEach(i=>{const img=new window.Image();img.src=photos[i]});
 },[frame,photos]);
 useEffect(()=>{
  if(!ready||paused||mode==='spin'||!picture.current?.animate)return;
  const animation=picture.current.animate([{opacity:.6,transform:'translateY(8px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});
  return()=>animation.cancel();
 },[ready,paused,vehicle.id,mode]);
 const change=(delta:number)=>setFrame(i=>wrapFrame(i+delta,photos.length));
 const move=(e:PointerEvent<HTMLDivElement>)=>{
  if(!drag.current||photos.length<2)return;
  const dx=e.clientX-drag.current.x,dy=e.clientY-drag.current.y;
  if(Math.abs(dx)<Math.abs(dy))return;
  if(!e.currentTarget.hasPointerCapture?.(e.pointerId))e.currentTarget.setPointerCapture?.(e.pointerId);
  setFrame(wrapFrame(drag.current.frame-Math.round(dx/(mode==='spin'?12:75)),photos.length));
 };
 const key=(e:KeyboardEvent<HTMLDivElement>)=>{if(photos.length<2)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();change(e.key==='ArrowRight'?1:-1)}};
 return <div className={`vehicle-viewer mode-${mode}`}>
  <div className="viewer-top"><span className="eyebrow">{mode==='spin'?'360° PHOTOGRAPHY':mode==='gallery'?'VEHICLE PHOTO GALLERY':'VEHICLE PHOTOGRAPH'}</span><span className="viewer-angle">{mode==='spin'?`${Math.round(frame/photos.length*360)}°`:`${String(frame+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`}</span></div>
  <div ref={stage} className="viewer-stage" tabIndex={photos.length>1?0:undefined} role={photos.length>1?'group':undefined} aria-label={`${vehicle.name} ${mode==='spin'?'360 degree photo viewer':'photograph'}`} onKeyDown={key} onPointerDown={e=>{if(photos.length>1)drag.current={x:e.clientX,y:e.clientY,frame}}} onPointerMove={move} onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null}} onLostPointerCapture={()=>{drag.current=null}}>
   <div className="studio-orbit" aria-hidden="true"/><div className="studio-floor" aria-hidden="true"/>
   <Image ref={picture} src={photos[wrapFrame(frame,photos.length)]} alt={`${vehicle.name}${photos.length>1?` — photo ${frame+1}`:' — representative vehicle photograph'}`} width={1000} height={640} sizes="(max-width: 850px) 92vw, 650px" priority={priority} unoptimized={Boolean(sequence?.frames.length)&&!failed} draggable={false} onLoad={()=>setReady(true)} onError={()=>{setFailed(true);setFrame(0)}}/>
  </div>
  {photos.length>1?<div className="viewer-controls"><button type="button" onClick={()=>change(-1)} aria-label="Previous vehicle angle"><ArrowIcon direction="left"/></button><p>{mode==='spin'?'Drag or swipe to rotate':'Swipe to browse photographs'} <span><ArrowIcon direction="left"/>{" "}<ArrowIcon direction="right"/>{" keys also work"}</span></p><button type="button" onClick={()=>change(1)} aria-label="Next vehicle angle"><ArrowIcon direction="right"/></button></div>:<p className="viewer-caption">Representative photograph · Actual colour and variant may differ.</p>}
  {failed&&<p className="viewer-caption" role="status">Additional photographs could not load. Showing the standard vehicle photograph.</p>}
 </div>;
}
