'use client';
import {ArrowIcon} from './Icons';
import Link from 'next/link';
import {useState} from 'react';
import Animated from './Animated';
import VehicleViewer from './VehicleViewer';
import {fleet} from '../lib/fleet.mjs';
import {contactUrl} from '../lib/booking.mjs';

export default function Hero(){
 const [index,setIndex]=useState(7),vehicle=fleet[index];
 return <section className="cinematic-hero" id="hero-3d">
  <div className="hero-light hero-light-one" aria-hidden="true"/><div className="hero-light hero-light-two" aria-hidden="true"/>
  <div className="hero-particles" aria-hidden="true">{Array.from({length:8},(_,i)=><i key={i} style={{left:`${8+i*12}%`,top:`${15+(i%4)*19}%`,animationDelay:`${i*-.9}s`}}/>)}</div>
  <div className="container cinematic-layout">
   <div className="cinematic-copy"><Animated className="eyebrow light">RS TOURS & TRAVELS · EXPLORE INDIA</Animated><Animated as="h1" mode="letters">Every journey.<br/>A new<br/><em>perspective.</em></Animated><Animated as="p" className="hero-description">Your favourite people. A road waiting to unfold.<br/>Let’s find the perfect ride for your next story.</Animated><div className="hero-actions"><a href="#booking" data-magnetic className="button button-gold">Plan your journey <span><ArrowIcon direction="up-right"/></span></a><Link href="/fleet/" className="hero-fleet-link">Explore the fleet <span><ArrowIcon direction="up-right"/></span></Link></div><div className="hero-trust"><span><i/>Personal journeys</span><span><i/>Direct WhatsApp support</span></div></div>
   <div className="hero-showcase" data-parallax="18"><div className="showcase-line"><span>THE RS COLLECTION</span><span>{String(index+1).padStart(2,'0')} — 08</span></div><VehicleViewer key={vehicle.id} vehicle={vehicle} priority/><div className="showcase-details"><div><span className="eyebrow">{vehicle.label}</span><Animated as="h2" key={vehicle.id}>{vehicle.name}</Animated></div><Link data-magnetic className="round-link" href={contactUrl({vehicle:vehicle.name})} aria-label={`Enquire about ${vehicle.name}`}><ArrowIcon direction="up-right"/></Link></div><div className="hero-vehicle-picks" role="group" aria-label="Select a featured vehicle">{fleet.map((v,i)=><button type="button" key={v.id} onClick={()=>setIndex(i)} aria-pressed={i===index} aria-label={`Show ${v.name}`}>{v.name.replace('Maruti Suzuki ','').replace('Toyota ','').replace('Force ','').replace('Swift ','')}</button>)}</div></div>
  </div>
  <div className="container hero-foot"><span>NOT JUST A TRIP. <em>IT’S A STORY.</em></span><a href="#fleet">SCROLL TO DISCOVER <span><ArrowIcon direction="down"/></span></a></div>
 </section>;
}
