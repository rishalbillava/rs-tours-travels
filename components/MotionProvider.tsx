'use client';
import {createContext,useContext,useEffect,useState,useCallback} from 'react';
import type {ReactNode} from 'react';
import {LazyMotion,MotionConfig} from 'motion/react';
const loadFeatures=()=>import('../lib/motion-features').then(m=>m.default);
const MotionContext=createContext({paused:true,reduced:false,ready:false,light:true,finePointer:false,toggleMotion:()=>{}});
export const useMotion=()=>useContext(MotionContext);
export default function MotionProvider({children}:{children:ReactNode}){
 const [preference,setPreference]=useState(false),[reduced,setReduced]=useState(false),[ready,setReady]=useState(false),[light,setLight]=useState(true),[finePointer,setFinePointer]=useState(false);
 useEffect(()=>{
  try{setPreference(localStorage.getItem('rs-motion-paused')==='true')}catch{}
  const media=matchMedia('(prefers-reduced-motion: reduce)'),pointer=matchMedia('(hover:hover) and (pointer:fine)');
  const device=navigator as Navigator&{deviceMemory?:number;connection?:{saveData?:boolean}};
  const update=()=>{setReduced(media.matches);setFinePointer(pointer.matches);setLight(Boolean(device.connection?.saveData)||(device.deviceMemory||8)<=4||(device.hardwareConcurrency||8)<=4)};
  update();setReady(true);media.addEventListener('change',update);pointer.addEventListener('change',update);
  return()=>{media.removeEventListener('change',update);pointer.removeEventListener('change',update)};
 },[]);
 const paused=!ready||reduced||preference;
 useEffect(()=>{const root=document.documentElement;root.classList.toggle('motion-paused',paused);root.classList.toggle('motion-light',light);if(ready)root.classList.remove('motion-initializing')},[paused,ready,light]);
 useEffect(()=>{const sync=()=>document.documentElement.classList.toggle('motion-background-paused',document.hidden);sync();document.addEventListener('visibilitychange',sync);return()=>document.removeEventListener('visibilitychange',sync)},[]);
 const toggleMotion=useCallback(()=>setPreference(previous=>{const next=!previous;try{localStorage.setItem('rs-motion-paused',String(next))}catch{}return next}),[]);
 return <MotionContext.Provider value={{paused,reduced,ready,light,finePointer,toggleMotion}}><LazyMotion features={loadFeatures} strict><MotionConfig reducedMotion={paused?'always':'user'}>{children}</MotionConfig></LazyMotion></MotionContext.Provider>;
}
