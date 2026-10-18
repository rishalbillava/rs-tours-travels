import Link from 'next/link';
import {TravelIcon} from './Icons';
import {config} from '../lib/config.mjs';
import {whatsappLink} from '../lib/booking.mjs';

export default function MobileBookingBar(){
 return <nav className="mobile-booking-bar" aria-label="Quick booking"><a href={`tel:+${config.whatsappNumber}`}><TravelIcon kind="phone"/> Call</a><Link href="/contact/#booking"><TravelIcon kind="calendar"/> Book Ride</Link><a href={whatsappLink()} target="_blank" rel="noopener noreferrer"><TravelIcon kind="chat"/> WhatsApp</a></nav>;
}
