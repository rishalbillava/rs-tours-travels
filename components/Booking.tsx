'use client';
import {Suspense,useEffect,useRef,useState} from 'react';
import type {FormEvent,SyntheticEvent} from 'react';
import {fleet} from '../lib/fleet.mjs';
import {buildMessage,whatsappLink,todayInIndia,enquiryDefaults,services} from '../lib/booking.mjs';
import Animated from './Animated';
import QuerySync from './QuerySync';
import {useBodyScrollLock} from '../lib/use-body-scroll-lock';
import {WhatsAppIcon,ArrowIcon} from './Icons';
export default function Booking({compact=false}){
 const [values,setValues]=useState(()=>enquiryDefaults(''));
 const [today,setToday]=useState('');const [date,setDate]=useState('');
 const [previewOpen,setPreviewOpen]=useState(false);useBodyScrollLock(previewOpen);
 const [message,setMessage]=useState('');const [copyLabel,setCopyLabel]=useState('Copy enquiry');
 const dialog=useRef<HTMLDialogElement>(null),returnField=useRef<HTMLInputElement>(null),extra=useRef<HTMLDetailsElement>(null),messageRef=useRef<HTMLPreElement>(null),copyTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 useEffect(()=>{setToday(todayInIndia());return()=>clearTimeout(copyTimer.current)},[]);
 useEffect(()=>{if(values.extra&&extra.current!)extra.current!.open=true},[values.extra]);
 useEffect(()=>{if(message&&!dialog.current!.open){dialog.current!.showModal();setPreviewOpen(true)}},[message]);
 const change=(key:'mode'|'vehicle'|'destination'|'service',value:string)=>setValues(previous=>({...previous,[key]:value}));
 function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();const form=event.currentTarget;
  for(const name of ['name','pickup','destination']){const field=form.elements.namedItem(name) as HTMLInputElement;field.setCustomValidity(field.value.trim()?'':'Please fill in this field.')}
  const mobile=form.elements.namedItem('mobile') as HTMLInputElement;mobile.setCustomValidity(/^\d{10,15}$/.test(mobile.value.replace(/\D/g,''))?'':'Enter a valid mobile number, including country code if outside India.');
  const invalidDates=date&&returnField.current!.value&&returnField.current!.value<date;
  returnField.current!.setCustomValidity(invalidDates?'The return date must be on or after the travel date.':'');
  if(extra.current!.querySelector(':invalid'))extra.current!.open=true;
  if(!form.reportValidity())return;
  const result=buildMessage(Object.fromEntries(new FormData(form)));
  window.open(whatsappLink(result),'_blank','noopener,noreferrer');
  setMessage(result);setPreviewOpen(true);setCopyLabel('Copy enquiry');
  // A repeated identical enquiry should reopen its existing preview too.
  if(result===message&&!dialog.current!.open)dialog.current!.showModal();
 }
 async function copy(){
  try{await navigator.clipboard.writeText(message);setCopyLabel('Copied ✓');clearTimeout(copyTimer.current);copyTimer.current=setTimeout(()=>setCopyLabel('Copy enquiry'),2000)}
  catch{const range=document.createRange();range.selectNodeContents(messageRef.current!);const selection=getSelection();selection?.removeAllRanges();selection?.addRange(range);setCopyLabel('Select and copy the text above')}
 }
 const clearValidity=(e:SyntheticEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>e.currentTarget.setCustomValidity('');
 return <><Suspense fallback={null}><QuerySync kind="booking" onChange={setValues}/></Suspense><section id="booking" className={'booking-section '+(compact?'compact':'')}><div className="container"><div className="booking-card"><div className="booking-intro"><Animated className="eyebrow">LET’S GET YOU GOING</Animated><Animated as="h2">Book your<br/><em>next journey.</em></Animated><Animated as="p">Tell us a little about your trip.<br/>We’ll take it from there on WhatsApp.</Animated><div className="booking-direct"><WhatsAppIcon/><a href={whatsappLink()} target="_blank" rel="noopener noreferrer">+91 78928 35142</a></div></div><form className="booking-form" id="booking-form" noValidate onSubmit={submit}><div className="booking-tabs" role="group" aria-label="Enquiry type">{['Vehicle rental','Tour enquiry'].map(mode=><button key={mode} type="button" className={values.mode===mode?'active':''} aria-pressed={values.mode===mode} onClick={()=>change('mode',mode)}>{mode==='Vehicle rental'?<ArrowIcon direction="up-right"/>:'◇'} {mode}</button>)}</div><input type="hidden" name="mode" value={values.mode}/><div className="form-grid"><label>Your name<input name="name" id="customer-name" autoComplete="name" placeholder="Full name" maxLength={80} onInput={clearValidity} required/></label><label>Mobile number<input name="mobile" type="tel" autoComplete="tel" inputMode="tel" placeholder="Your contact number" maxLength={20} onInput={clearValidity} required/></label><label>Pickup location<input name="pickup" id="pickup" autoComplete="address-level2" placeholder="City or pickup point" maxLength={150} onInput={clearValidity} required/></label><label>Destination<input name="destination" id="destination" placeholder="Where would you like to go?" maxLength={150} value={values.destination??''} onChange={e=>{change('destination',e.target.value);clearValidity(e)}} required/></label><label>Preferred vehicle<select name="vehicle" id="vehicle" value={values.vehicle??''} onChange={e=>change('vehicle',e.target.value)}><option value="">Help me choose</option>{fleet.map(v=><option key={v.id}>{v.name}</option>)}</select></label><label>Travel date<input type="date" name="date" id="travel-date" min={today} value={date} onChange={e=>{setDate(e.target.value);returnField.current!.setCustomValidity('')}} aria-describedby="flexible-date"/></label><label>Travellers<input type="number" name="travellers" min="1" max="100" defaultValue="2" required inputMode="numeric"/></label></div><Animated as="p" className="date-help" id="flexible-date">Dates not decided? Leave the travel date blank.</Animated><details className="more-details" id="extra-details" ref={extra}><summary>Add return date, trip type or special requests <span>+</span></summary><div className="form-grid"><label>Return date<input type="date" name="returnDate" id="return-date" ref={returnField} min={date||today} onChange={clearValidity}/></label><label>Trip type<select name="service" id="service" value={values.service??''} onChange={e=>change('service',e.target.value)}>{services.map(service=><option key={service}>{service}</option>)}</select></label><label>Pickup time<input name="time" type="time"/></label><label className="full">Special requests<textarea name="notes" rows={2} maxLength={1500} placeholder="Trip duration, luggage, places to visit or anything else…"/></label></div></details><div className="form-actions"><button className="button button-green" data-magnetic type="submit"><WhatsAppIcon/> Send enquiry on WhatsApp <ArrowIcon/></button><Animated as="p">Opens a message to <strong>7892835142</strong>.<br/>You review it in WhatsApp before sending.</Animated></div></form></div></div></section><dialog id="enquiry-result" data-lenis-prevent ref={dialog} onClose={()=>setPreviewOpen(false)} aria-labelledby="enquiry-result-title" onClick={e=>{if(e.target!==e.currentTarget)return;const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.current!.close()}}><button className="dialog-close" type="button" aria-label="Close enquiry preview" onClick={()=>dialog.current!.close()}>×</button><span className="eyebrow">YOUR JOURNEY STARTS HERE</span><h2 id="enquiry-result-title">Your enquiry is ready.</h2><p>If WhatsApp did not open, use the button below. You can review and send your message there.</p><pre id="enquiry-message" ref={messageRef}>{message}</pre><a id="enquiry-link" className="button button-green" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/> Open WhatsApp</a><button className="copy-message" type="button" onClick={copy}>{copyLabel}</button><p className="small-note">This is an enquiry, not a confirmed booking. No payment has been collected.</p></dialog></>;
}
