'use client';
import {useMotion} from './MotionProvider';
export default function MotionControl(){
 const {paused,reduced,ready,toggleMotion}=useMotion();
 return <button type="button" className="animation-control" role="switch" aria-label="Website animations" aria-checked={!paused} disabled={!ready||reduced} title={reduced?'Following your device’s Reduce Motion setting':paused?'Turn website animations on':'Turn website animations off'} onClick={toggleMotion}><span className="animation-status" aria-hidden="true"/>{reduced?'Reduced motion':paused?'Animations off':'Animations on'}</button>;
}
