'use client';
import {useEffect,useRef,useState} from 'react';
import {useMotion} from './MotionProvider';
const statistics=[{value:500,label:'Happy Customers'},{value:4,label:'Years of Experience'},{value:1000,label:'Completed Trips'}];
export default function BusinessStats(){
 const root=useRef<HTMLDivElement>(null),played=useRef(false);const [progress,setProgress]=useState(1);const {paused,ready}=useMotion();
 useEffect(()=>{
  if(!ready||paused||played.current||!root.current)return;
  let frame=0;const observer=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting))return;observer.disconnect();played.current=true;const start=performance.now();setProgress(0);const tick=(time:number)=>{const p=Math.min(1,(time-start)/1400);setProgress(1-Math.pow(1-p,3));if(p<1)frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)},{threshold:.35});observer.observe(root.current);
  return()=>{observer.disconnect();cancelAnimationFrame(frame);setProgress(1)};
 },[ready,paused]);
 return <div ref={root} className="business-stats" aria-label="500 plus happy customers, 4 plus years of experience, 1000 plus completed trips">{statistics.map(({value,label})=><div className="business-stat" key={label}><strong aria-hidden="true">{Math.round(value*progress).toLocaleString('en-IN')}<sup>+</sup></strong><span>{label}</span></div>)}</div>;
}
