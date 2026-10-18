'use client';
import {ArrowIcon} from './Icons';
import Link from 'next/link';
import Image from 'next/image';
import {useEffect,useRef,useState} from 'react';
import {whatsappLink} from '../lib/booking.mjs';
const links=[['index','/','Home'],['fleet','/fleet/','Our Fleet'],['services','/services/','Services'],['tours','/tours/','Tour Ideas'],['about','/about/','About Us'],['contact','/contact/','Contact']];
export default function Header({page}:{page:string}){
 const [open,setOpen]=useState(false),[scrolled,setScrolled]=useState(false);
 const nav=useRef<HTMLElement>(null),toggle=useRef<HTMLButtonElement>(null);
 useEffect(()=>{const scroll=()=>setScrolled(scrollY>24);scroll();window.addEventListener('scroll',scroll,{passive:true});return()=>window.removeEventListener('scroll',scroll)},[]);
 useEffect(()=>{
  if(!open)return;
  const oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  const focusable=()=>[toggle.current,...Array.from(nav.current?.querySelectorAll<HTMLAnchorElement>('a')||[])].filter(Boolean) as HTMLElement[];
  nav.current?.querySelector('a')?.focus();
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);toggle.current?.focus()}if(e.key==='Tab'){const all=focusable(),index=all.indexOf(document.activeElement as HTMLElement);if(e.shiftKey&&index<=0){e.preventDefault();all.at(-1)?.focus()}else if(!e.shiftKey&&index===all.length-1){e.preventDefault();all[0]?.focus()}}};
  const resize=()=>{if(innerWidth>850)setOpen(false)};
  document.addEventListener('keydown',key);window.addEventListener('resize',resize);
  return()=>{document.body.style.overflow=oldOverflow;document.removeEventListener('keydown',key);window.removeEventListener('resize',resize)};
 },[open]);
 return <div className="site-header-shell" data-scrolled={scrolled}>
  <a className="skip-link" href="#main">Skip to content</a>
  <div className="topbar"><div className="container"><span>rahulgowda2429@gmail.com</span><p>EXPLORE. EXPERIENCE. TOGETHER.</p><a href={whatsappLink()} target="_blank" rel="noopener noreferrer">{"WhatsApp · +91 78928 35142 "}<ArrowIcon direction="up-right"/></a></div></div>
  <header className="header"><div className="container header-inner">
   <Link className="brand" href="/" aria-label="RS Tours and Travels home"><Image src="/assets/rs-logo-clear.png" width={1445} height={1089} sizes="170px" unoptimized alt="RS Tours & Travels" priority/></Link>
   {open&&<button type="button" className="nav-backdrop" aria-label="Close menu backdrop" tabIndex={-1} onClick={()=>setOpen(false)}/>}
   <nav ref={nav} id="main-nav" className={`main-nav ${open?'open':''}`} aria-label="Main navigation">{links.map(([key,href,title])=><Link key={key} href={href} onClick={()=>setOpen(false)} aria-current={key===page?'page':undefined} className={key===page?'active':''}>{title}<span className="nav-arrow" aria-hidden="true"><ArrowIcon direction="up-right"/></span></Link>)}<span className="mobile-nav-signature">Let’s make your next trip a story.</span></nav>
   <div className="header-actions"><Link href="/contact/#booking" data-magnetic className="button button-green header-enquire">{"Plan a trip "}<ArrowIcon direction="up-right"/></Link><button ref={toggle} type="button" className="menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="main-nav" onClick={()=>setOpen(v=>!v)}><span/><span/><span/></button></div>
  </div></header>
 </div>;
}
