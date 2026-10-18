'use client';
import {ArrowIcon} from './Icons';
import Link from 'next/link';
import Image from 'next/image';
import {useBodyScrollLock} from '../lib/use-body-scroll-lock';
import dynamic from 'next/dynamic';
import {Suspense,useEffect,useRef,useState} from 'react';
import * as m from 'motion/react-m';
import {AnimatePresence} from 'motion/react';
import QuerySync from './QuerySync';
import {filterFleet,contactUrl,whatsappLink} from '../lib/booking.mjs';
import type {Vehicle} from '../lib/types';
import Animated from './Animated';
import {useMotion} from './MotionProvider';
const VehicleViewer=dynamic(()=>import('./VehicleViewer'),{loading:()=> <div className="viewer-loading">Loading photographs…</div>});
export default function Fleet(){
 const [category,setCategory]=useState('all'),[selected,setSelected]=useState<Vehicle|null>(null);
 const dialog=useRef<HTMLDialogElement>(null);const {paused}=useMotion();
 useBodyScrollLock(selected!==null);
 useEffect(()=>{if(selected&&!dialog.current?.open)dialog.current?.showModal()},[selected]);
 const visible=filterFleet(category);
 return <section className="section fleet-section" id="fleet"><Suspense fallback={null}><QuerySync kind="fleet" onChange={setCategory}/></Suspense><div className="container">
  <div className="section-heading"><div><Animated className="eyebrow">01 / THE COLLECTION</Animated><Animated as="h2">The right ride.<br/><em>For every kind of journey.</em></Animated></div><Animated as="p">From a quick city trip to a getaway with your whole group, explore our eight vehicle options.</Animated></div>
  <div className="fleet-toolbar"><div className="fleet-filters" role="group" aria-label="Filter vehicles">{[['all','All vehicles · 8'],['sedan','Sedans · 3'],['mpv','Family MPVs · 3'],['group','Group travellers · 2']].map(([key,label])=><button key={key} type="button" aria-pressed={key===category} className={`fleet-filter ${key===category?'active':''}`} onClick={()=>setCategory(key)}>{label}</button>)}</div><span className="fleet-count" aria-live="polite">{visible.length} vehicles</span></div>
  <div className="fleet-grid"><AnimatePresence initial={false}>{visible.map((v,index)=><m.article className="vehicle-card" key={v.id} initial={paused?false:{opacity:.7,y:14}} animate={{opacity:1,y:0}} exit={paused?{}:{opacity:0}} transition={{duration:.3,delay:Math.min(index,3)*.035}}>
   <div className="vehicle-image"><span className="vehicle-label">{v.label}</span><Image src={`/assets/vehicle-${v.id}.webp`} alt={`Representative ${v.name} photograph`} width={900} height={580} sizes="(max-width:650px) 90vw, (max-width:1000px) 45vw, 380px"/><span className="vehicle-index" aria-hidden="true">RS / {v.id.toUpperCase()}</span></div>
   <div className="vehicle-info"><span className="eyebrow">{v.label}</span><h3>{v.name}</h3><p>{v.tagline}</p><div className="vehicle-use"><ArrowIcon direction="up-right"/>{" "}{v.use}</div><div className="vehicle-card-actions"><button type="button" className="details-button" onClick={()=>setSelected(v)}>View details <span>＋</span></button><a className="button button-green" href={whatsappLink(`Hello RS Tours & Travels! I am interested in the ${v.name}. Please share availability, seating options and a quote for my trip.`)} target="_blank" rel="noopener noreferrer">{"Enquire now "}<ArrowIcon direction="up-right"/></a></div></div>
  </m.article>)}</AnimatePresence></div>
  <p className="small-note fleet-note">Representative vehicle photos. Confirm the available variant, colour, seating, luggage capacity and complete fare on WhatsApp.</p>
 </div><dialog className="vehicle-dialog" ref={dialog} aria-labelledby="fleet-detail-title" onClose={()=>setSelected(null)} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}} data-lenis-prevent>
  {selected&&<div className="vehicle-dialog-content"><button className="dialog-close" type="button" aria-label="Close vehicle details" onClick={()=>dialog.current?.close()}>×</button><span className="eyebrow">YOUR NEXT RIDE</span><h2 id="fleet-detail-title">{selected.name}</h2><VehicleViewer key={selected.id} vehicle={selected}/><p>{selected.tagline}</p><dl className="vehicle-specs"><div><dt>Category</dt><dd>{selected.label}</dd></div><div><dt>Ideal for</dt><dd>{selected.use}</dd></div><div><dt>Seating & luggage</dt><dd>Confirm your preferred variant with us</dd></div><div><dt>Fare</dt><dd>Personal quote for your route and dates</dd></div></dl><Link className="button button-gold" href={contactUrl({vehicle:selected.name})} onClick={()=>dialog.current?.close()}>{"Plan a trip with this vehicle "}<ArrowIcon direction="up-right"/></Link><p className="small-note">Availability and booking are confirmed by the RS team on WhatsApp.</p></div>}
 </dialog></section>;
}
