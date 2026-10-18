import './tailwind.css';
import 'lenis/dist/lenis.css';
import './styles.css';
import './premium.css';
import './airport.css';
import type {ReactNode} from 'react';
import ExperienceRuntime from '../components/ExperienceRuntime';
import MotionProvider from '../components/MotionProvider';
import CardEffects from '../components/CardEffects';
export const metadata={title:{default:'RS Tours & Travels',template:'%s | RS Tours & Travels'},description:'Explore eight vehicle options with RS Tours & Travels. Enquire directly on WhatsApp +91 7892835142.',icons:{icon:'/assets/rs-logo-clear.png'}};
export const viewport={themeColor:'#0a1526'};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="en" className="motion-initializing"><body><MotionProvider>{children}<CardEffects/><ExperienceRuntime/></MotionProvider></body></html>;}
