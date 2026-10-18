'use client';

import {ArrowIcon,TravelIcon} from './Icons';
import Image from 'next/image';
import {useRef,useState} from 'react';
import type {KeyboardEvent} from 'react';
import {whatsappLink} from '../lib/booking.mjs';
import {config} from '../lib/config.mjs';

const tabs=[
 {id:'airport',title:'BLR Kempegowda Airport Taxis & Transfers',icon:'plane'},
 {id:'city',title:'Bengaluru City Sightseeing & Tourist Places',icon:'city'}
] as const;

const packages=[
 {title:'Kempegowda BLR Airport Drop',tag:'AIRPORT DROP',description:'Doorstep pickup from your home, hotel or office in Bengaluru, with airport expressway routing planned around your flight check-in.',points:['Fixed upfront fare with toll clarity','Luggage assistance included','Sedan, Innova Crysta or Ertiga'],request:'an airport drop from Bengaluru to BLR Kempegowda Airport'},
 {title:'Kempegowda BLR Airport Pickup',tag:'AIRPORT PICKUP',description:'A chauffeur with a name sign greets you at Terminal 1 or Terminal 2 (Garden Terminal). Share your flight details for arrival tracking and an onward ride to your home or hotel.',points:['Flight arrival tracking and delay coordination','Clean AC car at the agreed arrival point','Direct drop to home or hotel'],request:'an airport pickup from BLR Kempegowda Airport'},
 {title:'Airport Directly to Outstation Tours',tag:'BEYOND THE CITY',description:'Continue your journey from BLR Airport to Mysore, Coorg, Ooty, Chikmagaluru or Wayanad with a route planned around your trip.',points:['Direct bypass routing where suitable','Drivers with hill and ghat experience','Discuss luggage space and family travel needs'],request:'a direct airport-to-outstation trip from BLR Kempegowda Airport'},
 {title:'Full Day Bangalore Airport + City Sightseeing',tag:'MAKE A DAY OF IT',description:'Turn a layover or a day in Bengaluru into a city escape. Plan your favourite stops and a return transfer around your next flight.',points:['Luggage stays in your vehicle during the tour','Customised temple, palace and café stops','Timed return for your departure terminal'],request:'an airport pickup with Bengaluru city sightseeing and a return airport drop'}
];

const destinations=[
 {name:'Nandi Hills',tag:'DIRECT SUNRISE ROUTE',estimate:'Approx. 35 km · 45 mins'},
 {name:'Mysore',tag:'NICE / EXPRESSWAY',estimate:'Approx. 180 km · 3 hours'},
 {name:'Coorg',tag:'HILL COFFEE RETREAT',estimate:'Approx. 290 km · 5.5 hours'},
 {name:'Chikmagaluru',tag:'HASSAN HIGHWAY',estimate:''},
 {name:'Ooty',tag:'A COOLER CHANGE OF PACE',estimate:''},
 {name:'Wayanad',tag:'GREEN ROADS AHEAD',estimate:''}
];

function enquiry(request:string){
 return whatsappLink(`Hello ${config.businessName}! I would like to enquire about ${request}. Please confirm availability, a suitable vehicle, the complete fare including tolls and parking, and pickup arrangements.`);
}

function Checklist({items}:{items:string[]}){
 return <ul className="airport-checklist">{items.map(item=><li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>;
}

export default function AirportTravel(){
 const [active,setActive]=useState(0);
 const tabRefs=useRef<(HTMLButtonElement|null)[]>([]);
 function handleTabKey(event:KeyboardEvent<HTMLButtonElement>,index:number){
  let next=index;
  if(event.key==='ArrowRight'||event.key==='ArrowLeft')next=(index+1)%tabs.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=tabs.length-1;
  else return;
  event.preventDefault();setActive(next);tabRefs.current[next]?.focus();
 }
 return <section className="section airport-section" id="airport-city" aria-labelledby="airport-city-heading">
  <div className="container">
   <div className="section-heading airport-heading"><div><span className="eyebrow">BENGALURU / ARRIVE. EXPLORE. GO FURTHER.</span><h2 id="airport-city-heading">Airport transfers &<br/><em>Bengaluru sightseeing.</em></h2></div><p>From your airport arrival to a day in the Garden City, plan a ride around the places you want to be.</p></div>
   <div className="airport-tabs" role="tablist" aria-label="Airport transfers and city sightseeing">{tabs.map((tab,index)=><button key={tab.id} ref={element=>{tabRefs.current[index]=element}} id={`travel-tab-${tab.id}`} type="button" role="tab" aria-selected={active===index} aria-controls={`travel-panel-${tab.id}`} tabIndex={active===index?0:-1} onClick={()=>setActive(index)} onKeyDown={event=>handleTabKey(event,index)}><span aria-hidden="true"><TravelIcon kind={tab.icon}/></span><span>{tab.title}</span><span className="airport-tab-arrow" aria-hidden="true"><ArrowIcon direction="up-right"/></span></button>)}</div>
   <div id="travel-panel-airport" role="tabpanel" aria-labelledby="travel-tab-airport" hidden={active!==0} tabIndex={0}>
    <div className="airport-feature-grid">
     <article className="airport-feature-card"><div className="airport-visual"><span className="airport-badge">24/7 AVAILABLE · T1 & T2</span><span className="airport-flight-mark" aria-hidden="true"><TravelIcon kind="plane"/></span><div className="airport-visual-label"><small>KEMPEGOWDA INTERNATIONAL AIRPORT · BLR</small><h3>Your arrival.<br/>Your next journey.</h3></div><Image src="/assets/vehicle-crysta.webp" alt="Representative Toyota Innova Crysta for airport transfer enquiries" width={900} height={580} sizes="(max-width:850px) 90vw, 45vw"/></div><div className="airport-feature-copy"><span className="eyebrow">KIA DEVANAHALLI · BENGALURU</span><h3>BLR Kempegowda Airport Transfers & Outstation Taxis</h3><p>24/7 airport pickup and drop for Terminal 1 and Terminal 2 (Garden Terminal), plus direct airport-to-outstation tours. Share your flight details and let’s plan your onward journey.</p><div className="airport-feature-actions"><a className="airport-text-link" href="#airport-packages">Explore options <span aria-hidden="true"><ArrowIcon direction="right"/></span></a><a className="button button-gold" href={enquiry('a BLR airport transfer')} target="_blank" rel="noopener noreferrer">{"Book ride "}<ArrowIcon direction="up-right"/></a></div></div></article>
     <article className="airport-assurance"><span className="eyebrow">A SMOOTHER START</span><h3>Punctual, stress-free airport cabs across Bengaluru.</h3><p>Avoid taxi queues and plan ahead with our airport cab service, flight arrival coordination, clean AC sedans and Innova Crystas. Choose the right ride for your flight, luggage and onward plans.</p><Checklist items={['Live flight arrival tracking','T1 & T2 arrival curb meet & greet','Sedans, Innova Crysta & group vehicles','Direct outstation transfer connectivity']}/><div className="airport-assurance-actions"><a className="button button-green" href={enquiry('an airport cab in Bengaluru')} target="_blank" rel="noopener noreferrer">{"Book Airport Cab on WhatsApp "}<ArrowIcon direction="up-right"/></a><a className="airport-call" href={`tel:+${config.whatsappNumber}`}>Call Airport Desk <span aria-hidden="true"><ArrowIcon direction="up-right"/></span></a></div></article>
    </div>
   </div>
   <div id="travel-panel-city" role="tabpanel" aria-labelledby="travel-tab-city" hidden={active!==1} tabIndex={0}>
    <div className="airport-feature-grid"><article className="airport-feature-card"><div className="city-travel-visual"><Image src="/assets/about-road-journey.png" alt="Scenic road journey illustration" width={1200} height={800} sizes="(max-width:850px) 90vw, 45vw"/><span className="airport-badge">CITY ESCAPES</span><div><small>BENGALURU · YOUR DAY, YOUR WAY</small><h3>See a little more.<br/>Stay a little longer.</h3></div></div><div className="airport-feature-copy"><span className="eyebrow">THE GARDEN CITY</span><h3>Bengaluru City Sightseeing & Tourist Places</h3><p>Build a day around gardens, heritage, temples and your favourite food stops. Start from your hotel, home or the airport.</p><a className="button button-gold" href={enquiry('a customised Bengaluru city sightseeing trip')} target="_blank" rel="noopener noreferrer">{"Plan a city ride "}<ArrowIcon direction="up-right"/></a></div></article><article className="airport-assurance"><span className="eyebrow">A DAY WORTH TAKING</span><h3>Your Bengaluru itinerary. At your own pace.</h3><p>Tell us the places you would like to visit. We’ll discuss the route, timings and vehicle before you book.</p><Checklist items={['Lalbagh & Cubbon Park','Bangalore Palace & heritage stops','Temple visits, cafés & local favourites','Airport pickup and return on request']}/><p className="airport-small-note">Entry tickets, opening hours and access are confirmed separately when planning your visit.</p><a className="button button-green" href={enquiry('a Bengaluru city sightseeing itinerary')} target="_blank" rel="noopener noreferrer">{"Discuss my sightseeing plan "}<ArrowIcon direction="up-right"/></a></article></div>
   </div>
   <div className="airport-packages" id="airport-packages"><div className="airport-subheading"><span className="eyebrow">CHOOSE YOUR AIRPORT JOURNEY</span><h3>A pickup. A drop.<br/><em>Or a whole new adventure.</em></h3></div><div className="airport-package-grid">{packages.map(item=><article className="airport-package-card" key={item.title}><span className="airport-package-tag">{item.tag}</span><h4>{item.title}</h4><p>{item.description}</p><Checklist items={item.points}/><a className="airport-quote-link" href={enquiry(item.request)} target="_blank" rel="noopener noreferrer">Check Tariff & Book <span aria-hidden="true"><ArrowIcon direction="right"/></span></a></article>)}</div></div>
   <div className="airport-outstation" aria-labelledby="airport-outstation-heading"><div className="airport-outstation-intro"><span className="eyebrow">DIRECT AIRPORT CONNECTIONS</span><h3 id="airport-outstation-heading">Direct outstation cabs from<br/>BLR Kempegowda Airport.</h3><p>Land in Bengaluru and continue to the hills, heritage cities or coffee country. Share your destination and we’ll help plan your onward journey.</p></div><div className="airport-route-grid">{destinations.map(destination=><a className="airport-route-card" key={destination.name} href={enquiry(`a direct taxi from BLR Airport to ${destination.name}`)} target="_blank" rel="noopener noreferrer"><span>{destination.tag}</span><h4>BLR Airport <span aria-hidden="true"><ArrowIcon direction="right"/></span> {destination.name}</h4><p>{destination.estimate||'Plan your pickup, route & travel time'}</p><strong>Reserve Taxi <span aria-hidden="true"><ArrowIcon direction="up-right"/></span></strong></a>)}</div><p className="airport-route-note">Distances and journey times are approximate and depend on the route, traffic and final stop. Vehicle availability, fare, tolls, parking, waiting policy and pickup arrangements are confirmed on WhatsApp before booking.</p></div>
  </div>
 </section>;
}
