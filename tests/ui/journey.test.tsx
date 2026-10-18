import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {act,fireEvent,render,screen} from '@testing-library/react';
import Journey from '../../components/Journey';
import MotionProvider from '../../components/MotionProvider';

describe('journey car on mobile',()=>{
 let top=500,id=0;
 const frames=new Map<number,FrameRequestCallback>();
 const flush=()=>act(()=>{const callbacks=[...frames.values()];frames.clear();callbacks.forEach(fn=>fn(performance.now()))});
 beforeEach(()=>{
  top=500;id=0;frames.clear();
  vi.spyOn(navigator,'hardwareConcurrency','get').mockReturnValue(2);
  vi.spyOn(document,'hidden','get').mockReturnValue(false);
  vi.mocked(window.matchMedia).mockImplementation(query=>({matches:query==='(max-width:650px)',media:query,addEventListener:vi.fn(),removeEventListener:vi.fn()} as any));
  vi.spyOn(window,'requestAnimationFrame').mockImplementation(fn=>{frames.set(++id,fn);return id});
  vi.spyOn(window,'cancelAnimationFrame').mockImplementation(key=>{frames.delete(key)});
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(){
   if(this.classList.contains('journey-track'))return {top,height:820,bottom:top+820,width:350,left:0,right:350,x:0,y:top,toJSON(){}};
   return {top:116,height:400,bottom:516,width:350,left:0,right:350,x:0,y:116,toJSON(){}};
  });
  Object.defineProperty(SVGElement.prototype,'getTotalLength',{configurable:true,value:()=>1000});
  Object.defineProperty(SVGElement.prototype,'getPointAtLength',{configurable:true,value:(distance:number)=>({x:150+distance/10,y:550-distance/2})});
 });
 afterEach(()=>{
  delete (SVGElement.prototype as any).getTotalLength;delete (SVGElement.prototype as any).getPointAtLength;
  frames.clear();
 });
 it('moves through the full route on a lower-resource phone using native scroll',()=>{
  const {container}=render(<MotionProvider><Journey/></MotionProvider>);flush();
  expect(document.documentElement).toHaveClass('motion-light');
  const car=container.querySelector('[data-journey-car]')!,section=container.querySelector('section')!;
  expect(section.style.getPropertyValue('--journey-progress')).toBe('0');
  const start=car.getAttribute('transform');
  top=-94;fireEvent.scroll(window);fireEvent.scroll(window);fireEvent.scroll(window);
  expect(frames.size).toBe(1);flush();
  expect(section.style.getPropertyValue('--journey-progress')).toBe('0.5');
  expect(car.getAttribute('transform')).not.toBe(start);
  expect(screen.getByText('A different perspective')).toBeInTheDocument();
  top=-304;fireEvent.scroll(window);flush();
  expect(section.style.getPropertyValue('--journey-progress')).toBe('1');
  expect(screen.getByText('A memory to keep')).toBeInTheDocument();
 });
 it('explains a saved pause and resumes from the current scroll position',()=>{
  localStorage.setItem('rs-motion-paused','true');top=-94;
  const {container,unmount}=render(<MotionProvider><Journey/></MotionProvider>);
  expect(screen.getByText('Website animations are paused.')).toBeInTheDocument();
  expect(container.querySelector('.journey-track')).toHaveAttribute('data-animated','false');
  fireEvent.click(screen.getByRole('button',{name:'Enable animations'}));flush();
  expect(container.querySelector('.journey-track')).toHaveAttribute('data-animated','true');
  expect(container.querySelector('section')!.style.getPropertyValue('--journey-progress')).toBe('0.5');
  expect(screen.queryByRole('button',{name:'Enable animations'})).not.toBeInTheDocument();
  unmount();fireEvent.scroll(window);expect(frames.size).toBe(0);
 });
 it('keeps the map still when the device requests reduced motion',()=>{
  vi.mocked(window.matchMedia).mockImplementation(query=>({matches:query.includes('max-width')||query.includes('prefers-reduced-motion'),media:query,addEventListener:vi.fn(),removeEventListener:vi.fn()} as any));
  const {container}=render(<MotionProvider><Journey/></MotionProvider>);
  expect(screen.getByText('Motion follows your device’s Reduce Motion setting.')).toBeInTheDocument();
  const car=container.querySelector('[data-journey-car]')!,initial=car.getAttribute('transform');
  top=-304;fireEvent.scroll(window);flush();expect(car.getAttribute('transform')).toBe(initial);
  expect(screen.queryByRole('button',{name:'Enable animations'})).not.toBeInTheDocument();
 });
});
