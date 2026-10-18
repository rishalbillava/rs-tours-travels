'use client';
import {useEffect,useRef} from 'react';
import {useMotion} from './MotionProvider';
export default function Globe(){const ref=useRef(null),angleRef=useRef(.2);const {paused}=useMotion();useEffect(()=>{
  const canvas = ref.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let width=0,height=0,dpr=1,frame=0,visible=true,lastTime=0,angle=angleRef.current;
  const lines=[];
  for(let lat=-60;lat<=60;lat+=20){
    const a=lat*Math.PI/180;const line=[];
    for(let j=0;j<=96;j++){const b=j/96*Math.PI*2;line.push([Math.cos(a)*Math.cos(b),Math.sin(a),Math.cos(a)*Math.sin(b)]);}
    lines.push(line);
  }
  for(let meridian=0;meridian<10;meridian++){
    const b=meridian/10*Math.PI;
    const line=[];
    for(let j=0;j<=96;j++){const a=j/96*Math.PI*2;line.push([Math.cos(a)*Math.cos(b),Math.sin(a),Math.cos(a)*Math.sin(b)]);}
    lines.push(line);
  }
  function project(p) {
    const cy=Math.cos(angle),sy=Math.sin(angle),cx=Math.cos(.26),sx=Math.sin(.26);
    const x=p[0]*cy+p[2]*sy;
    const z0=p[2]*cy-p[0]*sy;
    const y=p[1]*cx-z0*sx;
    const z=p[1]*sx+z0*cx;
    const perspective=3.4/(3.4-z);
    const radius=Math.min(width,height)*.36;
    return [width*.52+x*radius*perspective,height*.46+y*radius*perspective,z];
  }
  function draw() {
    ctx.clearRect(0,0,width,height);
    ctx.lineWidth=.65;
    for(const line of lines){
      ctx.beginPath();
      for(let i=0;i<line.length;i++){const p=project(line[i]);if(!i)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);}
      ctx.strokeStyle='rgba(199,218,169,.21)';ctx.stroke();
    }
    for(let j=0;j<12;j++){
      const b=j*2.39996+angle*.22;const a=Math.asin(-.85+j/11*1.7);
      const p=project([Math.cos(a)*Math.cos(b),Math.sin(a),Math.cos(a)*Math.sin(b)]);
      const r=1.4+(p[2]+1)*.6;
      ctx.beginPath();ctx.arc(p[0],p[1],r*3.5,0,Math.PI*2);ctx.fillStyle='rgba(238,206,134,.08)';ctx.fill();
      ctx.beginPath();ctx.arc(p[0],p[1],r,0,Math.PI*2);ctx.fillStyle=p[2]>0?'rgba(246,218,158,.86)':'rgba(211,208,154,.25)';ctx.fill();
    }
  }
  function resize() {
    const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;dpr=Math.min(window.devicePixelRatio||1,1.5);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();
  }
  function animate(time) {
    if(paused||!visible||document.hidden){frame=0;return;}
    if(!lastTime)lastTime=time;
    const delta=Math.min(time-lastTime,50);lastTime=time;angle+=delta*.000045;angleRef.current=angle;draw();frame=requestAnimationFrame(animate);
  }
  function syncAnimation() {
    cancelAnimationFrame(frame);frame=0;lastTime=0;
    if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(animate);else draw();
  }

  document.addEventListener('visibilitychange',syncAnimation);
  window.addEventListener('resize',resize,{passive:true});
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncAnimation();},{threshold:.01}) : null;
  observer?.observe(canvas);
  resize();syncAnimation();

return ()=>{cancelAnimationFrame(frame);observer?.disconnect();document.removeEventListener("visibilitychange",syncAnimation);window.removeEventListener("resize",resize)};
},[paused]);return <canvas className="journey-globe" id="journey-globe" ref={ref} aria-hidden="true"/>;}
