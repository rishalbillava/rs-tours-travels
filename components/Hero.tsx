'use client';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {useState} from 'react';
import {ArrowIcon} from './Icons';
import {fleet} from '../lib/fleet.mjs';
import {contactUrl} from '../lib/booking.mjs';
import Animated from './Animated';
import {useMotion} from './MotionProvider';
const TheoryScene=dynamic(()=>import('./TheoryScene'),{ssr:false});

export default function Hero(){
 const [index,setIndex]=useState(7);
 const {paused,light}=useMotion();
 const vehicle=fleet[index];
 return <section className="cinematic-hero rs-theory-hero" id="hero-3d">
  <div className="theory-scene" aria-hidden="true"><div className="theory-fallback"/>{!paused&&!light&&<TheoryScene/>}<div className="theory-grain"/><div className="theory-orb"><i/><i/><i/></div></div>
  <div className="container theory-topline"><span><span className="theory-live-dot"/>THE ART OF GOING SOMEWHERE</span><span>INDIA / YOUR NEXT JOURNEY STARTS HERE</span></div>
  <div className="container theory-layout">
   <div className="theory-copy">
    <Animated className="theory-kicker">RS TOURS & TRAVELS <span> / </span> 001 — THE EXPERIENCE</Animated>
    <Animated as="h1" mode="letters">GO <em>BEYOND</em><br/>THE ORDINARY<span className="theory-period">.</span></Animated>
    <Animated as="p" className="theory-description">The best memories are made along the way. Discover India through unforgettable road journeys and a ride that feels right.</Animated>
    <div className="theory-actions"><Link href="/contact/#booking" data-magnetic className="theory-primary">PLAN YOUR JOURNEY <ArrowIcon direction="up-right"/></Link><Link href="/fleet/" className="theory-secondary">EXPLORE THE COLLECTION <ArrowIcon direction="right"/></Link></div>
   </div>
   <div className="theory-car-stage" aria-label="Explore our eight vehicles">
    <div className="theory-arc" aria-hidden="true"/><div className="theory-stage-light" aria-hidden="true"/>
    <div className="theory-car-count"><span>FEATURED VEHICLE</span><span>{String(index+1).padStart(2,'0')} / {String(fleet.length).padStart(2,'0')}</span></div>
    <div className="theory-car-image" key={vehicle.id}><Image src={`/assets/vehicle-${vehicle.id}.webp`} alt={`${vehicle.name} representative vehicle photograph`} width={1000} height={640} priority sizes="(max-width: 800px) 94vw, 57vw"/></div>
    <div className="theory-car-meta"><div><span>THE RS COLLECTION / {vehicle.label.toUpperCase()}</span><strong>{vehicle.name}</strong></div><Link href={contactUrl({vehicle:vehicle.name})} aria-label={`Enquire about ${vehicle.name}`} className="theory-round-arrow"><ArrowIcon direction="up-right"/></Link></div>
    <div className="theory-selector"><button type="button" onClick={()=>setIndex(v=>(v+fleet.length-1)%fleet.length)} aria-label="Previous vehicle"><ArrowIcon direction="left"/></button><div className="theory-selector-dots" role="group" aria-label="Select vehicle">{fleet.map((v,i)=><button key={v.id} type="button" title={v.name} aria-label={`Show ${v.name}`} aria-pressed={i===index} onClick={()=>setIndex(i)}/>)}</div><button type="button" onClick={()=>setIndex(v=>(v+1)%fleet.length)} aria-label="Next vehicle"><ArrowIcon direction="right"/></button></div>
   </div>
  </div>
  <div className="container theory-bottom"><span>01 <i/> EXPLORE YOUR POSSIBILITIES</span><a href="#booking">SCROLL TO DISCOVER <ArrowIcon direction="down"/></a><span>DESIGNED FOR THE JOURNEY, NOT JUST THE DESTINATION</span></div>
 </section>;
}