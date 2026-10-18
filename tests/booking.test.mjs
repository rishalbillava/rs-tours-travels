import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMessage,whatsappLink,enquiryDefaults,todayInIndia,filterFleet,normalizeIndex,contactUrl} from '../lib/booking.mjs';
import {fleet} from '../lib/fleet.mjs';
test('booking keeps user details and optional trip information in a WhatsApp draft',()=>{
 const message=buildMessage({mode:'Tour enquiry',name:' Rahul ',pickup:' Bengaluru ',destination:' Coorg ',vehicle:'Toyota Innova Crysta',date:'2026-11-02',travellers:'5',service:'Outstation',returnDate:'2026-11-05',time:'08:30',notes:' Two bags & a wheelchair '});
 const url=new URL(whatsappLink(message));assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/917892835142');assert.equal(url.searchParams.get('text'),message);
 for(const text of ['Name: Rahul','Pickup: Bengaluru','Destination: Coorg','Preferred vehicle: Toyota Innova Crysta','2 November 2026','5 November 2026','08:30','Two bags & a wheelchair','Please confirm availability'])assert.ok(message.includes(text));
});
test('flexible dates and unknown vehicles do not invent availability',()=>{
 const m=buildMessage({mode:'Vehicle rental',name:'A',pickup:'B',destination:'C',date:'',vehicle:'',travellers:'2',service:'Outstation',notes:''});assert.match(m,/Flexible \/ to be confirmed/);assert.match(m,/Please suggest a suitable vehicle/);assert.ok(!m.includes('Return date:'));
});
test('fleet deep links round-trip all eight models and validate query inputs',()=>{
 for(const v of fleet){const url=new URL(contactUrl({vehicle:v.name}),'https://example.com');assert.equal(url.hash,'#booking');assert.equal(enquiryDefaults(url.search).vehicle,v.name)}
 const invalid=enquiryDefaults('?vehicle=unknown&service=unknown&mode=bad&destination='+encodeURIComponent('<script>& Bengaluru'));
 assert.equal(invalid.vehicle,'');assert.equal(invalid.service,'Outstation');assert.equal(invalid.mode,'Vehicle rental');assert.equal(invalid.destination,'<script>& Bengaluru');
 const tour=enquiryDefaults('?mode=Tour+enquiry&service=Pilgrimage&destination=Tirupati');assert.equal(tour.mode,'Tour enquiry');assert.equal(tour.extra,true);assert.equal(tour.destination,'Tirupati');
});
test('fleet filtering and carousel wrapping include every vehicle',()=>{assert.equal(filterFleet('sedan').length,3);assert.equal(filterFleet('mpv').length,3);assert.equal(filterFleet('group').length,2);assert.equal(filterFleet('invalid').length,8);assert.equal(normalizeIndex(-1),7);assert.equal(normalizeIndex(8),0)});
test('date minimum uses India calendar day across UTC midnight',()=>{assert.equal(todayInIndia(new Date('2026-10-17T20:00:00Z')),'2026-10-18');assert.equal(todayInIndia(new Date('2026-10-17T17:00:00Z')),'2026-10-17')});
