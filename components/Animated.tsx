'use client';
import {Children,cloneElement,createElement,isValidElement,useEffect,useMemo,useRef} from 'react';
import type {ReactNode,ReactElement,HTMLAttributes,ElementType} from 'react';
import {useMotion} from './MotionProvider';
import {createTextEntrance} from '../lib/text-motion.mjs';
type Props=HTMLAttributes<HTMLElement>&{as?:ElementType;mode?:'words'|'letters';children:ReactNode};
function plainText(nodes:ReactNode):string{return Children.toArray(nodes).map(n=>typeof n==='string'||typeof n==='number'?String(n):isValidElement<{children?:ReactNode}>(n)?plainText(n.props.children):'').join(' ')}
export default function Animated({as:Tag='span',mode='words',className='',children,...props}:Props){
 const ref=useRef<HTMLElement>(null),entrance=useRef<ReturnType<typeof createTextEntrance>|null>(null);
 const {paused,ready,light}=useMotion();const heading=typeof Tag==='string'&&/^h[123]$/.test(Tag);
 const content=useMemo(()=>{
  const split=(nodes:ReactNode):ReactNode=>Children.map(nodes,child=>{
   if(typeof child==='string'||typeof child==='number')return <span className="text-run">{String(child).split(/(\s+)/).map((part,i)=>/^\s*$/.test(part)?part:<span key={i} className="text-word" data-motion-unit={mode==='words'?'':undefined}>{mode==='letters'?Array.from(part).map((char,j)=><span className="text-char" data-motion-unit="" key={j}>{char}</span>):part}</span>)}</span>;
   if(isValidElement<{children?:ReactNode}>(child)&&typeof child.type==='string'&&!['svg','input','select','textarea','br'].includes(child.type))return cloneElement(child as ReactElement<{children:ReactNode}>,{},split(child.props.children));
   return child;
  });return split(children);
 },[children,mode]);
 useEffect(()=>{if(!ready||!ref.current)return;entrance.current??=createTextEntrance(ref.current,{heading,letters:mode==='letters',light});entrance.current.setEnabled(!paused);return()=>entrance.current?.stop()},[ready,paused,heading,mode,light]);
 return createElement(Tag,{...props,ref,className:`${className} text-animated ${heading?'text-heading':'text-body'}`,...(mode==='letters'?{'aria-label':plainText(children)}:{})},mode==='letters'?<span aria-hidden="true">{content}</span>:content);
}
