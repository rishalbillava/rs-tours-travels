'use client';
import type {ImageLoaderProps} from 'next/image';
const widths=[320,640,960,1440,1920];
export default function imageLoader({src,width}:ImageLoaderProps){
 if(!/^\/assets\/[^/]+\.(png|jpe?g|webp)$/i.test(src))return src;
 const size=widths.find(value=>value>=width)||1920;
 const stem=src.split('/').pop()!.replace(/\.[^.]+$/,'');
 return `/assets/optimized/${stem}-${size}.webp`;
}
