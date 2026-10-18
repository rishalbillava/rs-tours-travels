import {RoadJourney,PhotoGallery} from '../components/HomeAdditions';
import CustomerStories from '../components/CustomerStories';
import AirportTravel from '../components/AirportTravel';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {Section1,Section2,Section3,Section4,Section5,Section6,Section7,Section8,Section9,Section10} from '../components/Sections';
export const metadata = {title:"Car Rentals & Travel Enquiries"};
export default function Page(){return <><Header page="index"/><main id="main"><Section1 /><Section2 /><Section3 /><Section4 /><RoadJourney/><Section5 /><Section6 /><AirportTravel/><Section7 /><Section8 /><CustomerStories/><PhotoGallery/><Section9 /><Section10 /></main><Footer/></>;}
