import '@testing-library/jest-dom/vitest';
import {afterEach,vi} from 'vitest';
import {cleanup} from '@testing-library/react';
import {forwardRef} from 'react';

afterEach(()=>{cleanup();localStorage.clear();document.documentElement.className=''});
vi.mock('next/image',()=>({default:forwardRef<HTMLImageElement,any>(function TestImage({priority,quality,fill,loader,unoptimized,...props},ref){return <img {...props} ref={ref}/>})}));
vi.mock('next/link',()=>({default:forwardRef<HTMLAnchorElement,any>(function TestLink({prefetch,replace,scroll,...props},ref){return <a {...props} ref={ref}/>})}));
vi.mock('next/navigation',()=>({usePathname:()=> '/',useSearchParams:()=>new URLSearchParams(window.location.search)}));
Object.defineProperty(window,'matchMedia',{writable:true,value:vi.fn().mockImplementation(query=>({matches:false,media:query,onchange:null,addListener:vi.fn(),removeListener:vi.fn(),addEventListener:vi.fn(),removeEventListener:vi.fn(),dispatchEvent:vi.fn()}))});
class Observer{observe(){}unobserve(){}disconnect(){}}
vi.stubGlobal('IntersectionObserver',Observer);
Object.defineProperty(HTMLDialogElement.prototype,'showModal',{configurable:true,value:function(){this.open=true}});
Object.defineProperty(HTMLDialogElement.prototype,'close',{configurable:true,value:function(){this.open=false;this.dispatchEvent(new Event('close'))}});
Object.defineProperty(HTMLElement.prototype,'setPointerCapture',{configurable:true,value:vi.fn()});
Object.defineProperty(HTMLElement.prototype,'hasPointerCapture',{configurable:true,value:()=>false});
if(!window.PointerEvent)vi.stubGlobal('PointerEvent',MouseEvent);
