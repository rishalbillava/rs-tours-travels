import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AirportTravel from '../../components/AirportTravel';
import {Section12,Section6,Section8,Section9,Section10} from '../../components/Sections';
export const metadata = {title:"Travel Services"};
export default function Page(){return <><Header page="services"/><main id="main"><Section12 /><Section6 /><AirportTravel/><Section8 /><Section9 /><Section10 /></main><Footer/></>;}
