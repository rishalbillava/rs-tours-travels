'use client';
import {useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {enquiryDefaults} from '../lib/booking.mjs';
export default function QuerySync({kind,onChange}){
 const params=useSearchParams();const search=params.toString();
 useEffect(()=>{if(kind==='booking')onChange(enquiryDefaults(search));else{const value=new URLSearchParams(search).get('category');onChange(['sedan','mpv','group'].includes(value)?value:'all')}},[kind,search,onChange]);return null;
}
