'use client';
import dynamic from 'next/dynamic';
const Journey=dynamic(()=>import('./Journey'),{loading:()=> <div className="journey-loading"/>});
const Gallery=dynamic(()=>import('./Gallery'),{loading:()=> <div className="gallery-loading"/>});
export function RoadJourney(){return <Journey/>}
export function PhotoGallery(){return <Gallery/>}
