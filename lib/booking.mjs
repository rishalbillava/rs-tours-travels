import {config} from './config.mjs';
import {fleet} from './fleet.mjs';
export const services=['Outstation','Airport transfer','Local / city travel','Family / group trip','Pilgrimage','Corporate / event travel','Something else'];
export function todayInIndia(now=new Date()) {
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const part=type=>parts.find(p=>p.type===type).value;
 return `${part('year')}-${part('month')}-${part('day')}`;
}
export function displayDate(value){return value?new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'long',year:'numeric'}).format(new Date(`${value}T12:00:00`)):'Flexible / to be confirmed';}
export function buildMessage(data){
 const lines=[`Hello ${config.businessName}! I would like to enquire about a trip.`,'',`Enquiry: ${data.mode}`,`Name: ${data.name.trim()}`,`Pickup: ${data.pickup.trim()}`,`Destination: ${data.destination.trim()}`,`Preferred vehicle: ${data.vehicle||'Please suggest a suitable vehicle'}`,`Travel date: ${displayDate(data.date)}`,`Travellers: ${data.travellers}`,`Trip type: ${data.service}`];
 if(data.mobile?.trim())lines.splice(4,0,`Mobile: ${data.mobile.trim()}`);
 if(data.returnDate)lines.push(`Return date: ${displayDate(data.returnDate)}`);
 if(data.time)lines.push(`Preferred pickup time: ${data.time}`);
 if(data.notes?.trim())lines.push(`Special requests: ${data.notes.trim()}`);
 lines.push('','Please confirm availability, seating / luggage capacity and the complete fare, including any applicable charges.');
 return lines.join('\n');
}
export function whatsappLink(message='Hello RS Tours & Travels! I would like to enquire about a trip.'){
 return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
export function contactUrl(params={}){return '/contact/?'+new URLSearchParams(params)+'#booking';}
export function enquiryDefaults(search){
 const p=new URLSearchParams(search);
 return {vehicle:fleet.some(v=>v.name===p.get('vehicle'))?p.get('vehicle'):'',destination:(p.get('destination')||'').slice(0,150),service:services.includes(p.get('service'))?p.get('service'):services[0],mode:p.get('mode')==='Tour enquiry'?'Tour enquiry':'Vehicle rental',extra:p.has('service')};
}
export function filterFleet(category){return ['sedan','mpv','group'].includes(category)?fleet.filter(v=>v.category===category):fleet;}
export function normalizeIndex(index,count=fleet.length){return ((index%count)+count)%count;}
