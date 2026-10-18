import test from 'node:test';
import assert from 'node:assert/strict';
import {createTextEntrance} from '../lib/text-motion.mjs';

function fixture(){
 const calls=[],observers=[];
 const element={querySelectorAll:()=>Array.from({length:3},()=>({animate:(frames,options)=>{
  const animation={cancelled:false,onfinish:null,cancel(){this.cancelled=true}};
  calls.push({frames,options,animation});return animation;
 }}))};
 class Observer{
  constructor(callback){this.callback=callback;this.disconnected=false;observers.push(this)}
  observe(){}
  disconnect(){this.disconnected=true}
  enter(){this.callback([{isIntersecting:true}])}
 }
 return {calls,observers,entrance:createTextEntrance(element,{Observer,heading:true})};
}

test('pausing a running entrance restores text and resuming does not replay it',()=>{
 const {entrance,calls,observers}=fixture();
 entrance.setEnabled(true);observers[0].enter();
 assert.equal(calls.length,3);
 entrance.setEnabled(false);
 assert.ok(calls.every(({animation})=>animation.cancelled));
 entrance.setEnabled(true);
 assert.equal(calls.length,3);
 assert.equal(observers.length,1);
 // The entrance moves words without making already-visible text disappear.
 assert.ok(calls.every(({frames})=>frames.every(frame=>frame.opacity===undefined)));
});

test('pausing before scroll entry defers the first animation until motion resumes',()=>{
 const {entrance,calls,observers}=fixture();
 entrance.setEnabled(true);entrance.setEnabled(false);observers[0].enter();
 assert.equal(calls.length,0);
 assert.ok(observers[0].disconnected);
 entrance.setEnabled(true);observers[1].enter();
 assert.equal(calls.length,3);
 entrance.stop();assert.ok(calls.every(({animation})=>animation.cancelled));
});

test('completed entrances release animation effects and ignore repeated viewport events',()=>{
 const {entrance,calls,observers}=fixture();
 entrance.setEnabled(true);observers[0].enter();
 for(const {animation} of calls)animation.onfinish();
 assert.ok(calls.every(({animation})=>animation.cancelled&&animation.onfinish===null));
 observers[0].enter();assert.equal(calls.length,3);
});

test('text remains available when animation or observer APIs are absent',()=>{
 const entrance=createTextEntrance({querySelectorAll:()=>[{}]},{Observer:null});
 assert.doesNotThrow(()=>{entrance.setEnabled(true);entrance.stop()});
});
