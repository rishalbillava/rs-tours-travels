import {describe,it,expect,vi} from 'vitest';
import {fireEvent,render,screen,waitFor,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../../components/Header';
import Booking from '../../components/Booking';
import Gallery from '../../components/Gallery';
import VehicleViewer from '../../components/VehicleViewer';
import Fleet from '../../components/Fleet';
import MotionProvider from '../../components/MotionProvider';
import MotionControl from '../../components/MotionControl';
import {fleet} from '../../lib/fleet.mjs';
import {photoMode} from '../../lib/vehicle-photos';

describe('mobile navigation',()=>{
 it('opens, traps focus, closes with Escape and restores body scrolling',async()=>{
  const user=userEvent.setup();render(<Header page="index"/>);
  const toggle=screen.getByRole('button',{name:'Open navigation'});
  await user.click(toggle);expect(toggle).toHaveAttribute('aria-expanded','true');expect(document.body.style.overflow).toBe('hidden');
  const nav=screen.getByRole('navigation',{name:'Main navigation'});expect(within(nav).getByRole('link',{name:'Home'})).toHaveFocus();
  within(nav).getByRole('link',{name:'Contact'}).focus();await user.tab();expect(toggle).toHaveFocus();
  await user.keyboard('{Escape}');expect(toggle).toHaveAttribute('aria-expanded','false');expect(document.body.style.overflow).toBe('');expect(toggle).toHaveFocus();
 });
 it('closes when a destination is selected',async()=>{
  const user=userEvent.setup();render(<Header page="index"/>);await user.click(screen.getByRole('button',{name:'Open navigation'}));
  const link=within(screen.getByRole('navigation')).getByRole('link',{name:'Our Fleet'});link.addEventListener('click',e=>e.preventDefault());await user.click(link);
  expect(screen.getByRole('button',{name:'Open navigation'})).toHaveAttribute('aria-expanded','false');expect(link).toHaveAttribute('href','/fleet/');
 });
});

describe('real photographic viewer',()=>{
 it('does not claim a single photo is a 360 view',()=>{
  render(<VehicleViewer vehicle={fleet[0]}/>);expect(screen.getByText('VEHICLE PHOTOGRAPH')).toBeInTheDocument();expect(screen.queryByText(/360°/)).not.toBeInTheDocument();expect(screen.queryByRole('button',{name:'Next vehicle angle'})).not.toBeInTheDocument();
  expect(photoMode({frames:['one.jpg'],fullTurn:true})).toBe('photo');
 });
 it('browses a partial photo set with controls and keyboard without a full-turn claim',async()=>{
  const user=userEvent.setup();render(<VehicleViewer vehicle={fleet[0]} sequence={{frames:['/one.jpg','/two.jpg','/three.jpg'],fullTurn:false}}/>);
  await user.click(screen.getByRole('button',{name:'Next vehicle angle'}));expect(screen.getByRole('img')).toHaveAttribute('src','/two.jpg');
  fireEvent.keyDown(screen.getByRole('group'),{key:'ArrowLeft'});expect(screen.getByRole('img')).toHaveAttribute('src','/one.jpg');
  expect(screen.getByText('VEHICLE PHOTO GALLERY')).toBeInTheDocument();
 });
 it('supports drag, swipe and wraparound for a verified 12-frame sequence',()=>{
  const frames=Array.from({length:12},(_,i)=>`/frame-${i}.jpg`);render(<VehicleViewer vehicle={fleet[0]} sequence={{frames,fullTurn:true}}/>);
  const stage=screen.getByRole('group');expect(screen.getByText('360° PHOTOGRAPHY')).toBeInTheDocument();
  fireEvent.pointerDown(stage,{clientX:100,clientY:100,pointerId:1,pointerType:'mouse'});fireEvent.pointerMove(stage,{clientX:76,clientY:101,pointerId:1,pointerType:'mouse'});fireEvent.pointerUp(stage,{pointerId:1});
  expect(screen.getByRole('img')).toHaveAttribute('src','/frame-2.jpg');
  fireEvent.pointerDown(stage,{clientX:100,clientY:100,pointerId:2,pointerType:'touch'});fireEvent.pointerMove(stage,{clientX:136,clientY:100,pointerId:2,pointerType:'touch'});fireEvent.pointerUp(stage,{pointerId:2});
  expect(screen.getByRole('img')).toHaveAttribute('src','/frame-11.jpg');
  fireEvent.keyDown(stage,{key:'ArrowRight'});expect(screen.getByRole('img')).toHaveAttribute('src','/frame-0.jpg');
 });
 it('lets vertical touch movement scroll without changing the photograph',()=>{
  render(<VehicleViewer vehicle={fleet[0]} sequence={{frames:['/a.jpg','/b.jpg'],fullTurn:false}}/>);const stage=screen.getByRole('group');fireEvent.pointerDown(stage,{clientX:100,clientY:100,pointerId:1});fireEvent.pointerMove(stage,{clientX:90,clientY:200,pointerId:1});expect(screen.getByRole('img')).toHaveAttribute('src','/a.jpg');
 });
});

describe('booking enquiry',()=>{
 async function fillRequired(){const user=userEvent.setup();await user.type(screen.getByLabelText('Your name'),'Rahul Gowda');await user.type(screen.getByLabelText('Mobile number'),'+91 9876543210');await user.type(screen.getByLabelText('Pickup location'),'Bengaluru');await user.type(screen.getByLabelText('Destination'),'Coorg');return user}
 it('validates customer mobile number before opening WhatsApp',async()=>{
  const open=vi.spyOn(window,'open').mockReturnValue(null);render(<Booking/>);const user=await fillRequired();await user.clear(screen.getByLabelText('Mobile number'));await user.type(screen.getByLabelText('Mobile number'),'123');await user.click(screen.getByRole('button',{name:/Send enquiry/}));expect(open).not.toHaveBeenCalled();expect(screen.getByLabelText('Mobile number')).toBeInvalid();
 });
 it('rejects a return date before departure',async()=>{
  const open=vi.spyOn(window,'open').mockReturnValue(null);render(<Booking/>);const user=await fillRequired();fireEvent.change(screen.getByLabelText('Travel date'),{target:{value:'2099-11-05'}});fireEvent.change(screen.getByLabelText('Return date'),{target:{value:'2099-11-04'}});await user.click(screen.getByRole('button',{name:/Send enquiry/}));expect(open).not.toHaveBeenCalled();expect(screen.getByLabelText('Return date')).toBeInvalid();expect(document.querySelector('details')).toHaveAttribute('open');
 });
 it('opens a complete encoded enquiry at the correct number without confirming a booking',async()=>{
  const open=vi.spyOn(window,'open').mockReturnValue(null);render(<Booking/>);const user=await fillRequired();
  await user.selectOptions(screen.getByLabelText('Preferred vehicle'),'Toyota Innova Crysta');fireEvent.change(screen.getByLabelText('Travel date'),{target:{value:'2099-11-05'}});fireEvent.change(screen.getByLabelText('Return date'),{target:{value:'2099-11-07'}});await user.clear(screen.getByLabelText('Travellers'));await user.type(screen.getByLabelText('Travellers'),'5');fireEvent.change(screen.getByLabelText('Trip type'),{target:{value:'Family / group trip'}});fireEvent.change(screen.getByLabelText('Special requests'),{target:{value:'2 bags & child seat please'}});
  await user.click(screen.getByRole('button',{name:/Send enquiry/}));expect(open).toHaveBeenCalledTimes(1);const url=new URL(String(open.mock.calls[0][0]));expect(url.origin+url.pathname).toBe('https://wa.me/917892835142');
  const message=url.searchParams.get('text')!;for(const field of ['Rahul Gowda','Mobile: +91 9876543210','Pickup: Bengaluru','Destination: Coorg','Toyota Innova Crysta','5 November 2099','7 November 2099','Travellers: 5','Family / group trip','2 bags & child seat please'])expect(message).toContain(field);
  expect(screen.getByRole('dialog',{name:'Your enquiry is ready.'})).toHaveAttribute('open');expect(screen.getByText(/not a confirmed booking/)).toBeInTheDocument();expect(screen.getByRole('link',{name:'Open WhatsApp'})).toHaveAttribute('href',url.href);
  await user.click(screen.getByRole('button',{name:'Close enquiry preview'}));expect(document.querySelector('#enquiry-result')).not.toHaveAttribute('open');
 });
});

describe('fleet and gallery',()=>{
 it('filters the collection and opens vehicle details with a preserved booking link',async()=>{
  const user=userEvent.setup();render(<MotionProvider><Fleet/></MotionProvider>);expect(screen.getAllByRole('article')).toHaveLength(8);await user.click(screen.getByRole('button',{name:'Group travellers · 2'}));await waitFor(()=>expect(screen.getAllByRole('article')).toHaveLength(2));
  expect(screen.getByRole('heading',{name:'Force Urbania'})).toBeInTheDocument();await user.click(screen.getAllByRole('button',{name:/View details/})[0]);await waitFor(()=>expect(screen.getByRole('dialog')).toHaveAttribute('open'));
  expect(screen.getByRole('link',{name:/Plan a trip with this vehicle/}).getAttribute('href')).toContain('vehicle=Force+Urbania');await user.click(screen.getByRole('button',{name:'Close vehicle details'}));expect(document.querySelector('.vehicle-dialog')).not.toHaveAttribute('open');
 });
 it('opens a fullscreen image, changes photographs, and closes the viewer',async()=>{
  const user=userEvent.setup();render(<Gallery/>);await user.click(screen.getByRole('button',{name:'View fullscreen: Toyota Innova Crysta'}));const dialog=screen.getByRole('dialog',{name:'Fullscreen photo viewer'});expect(dialog).toHaveAttribute('open');expect(within(dialog).getByRole('img')).toHaveAttribute('alt','Toyota Innova Crysta');
  await user.click(within(dialog).getByRole('button',{name:'Next photo'}));expect(within(dialog).getByRole('img')).toHaveAttribute('alt','Maruti Suzuki Ciaz');fireEvent.keyDown(dialog,{key:'ArrowLeft'});expect(within(dialog).getByRole('img')).toHaveAttribute('alt','Toyota Innova Crysta');await user.click(within(dialog).getByRole('button',{name:'Close fullscreen photo'}));expect(dialog).not.toHaveAttribute('open');expect(screen.getByText(/Current images are representative fleet photographs/)).toBeInTheDocument();
 });
});

describe('motion preferences',()=>{
 it('provides a persistent pause control',async()=>{
  const user=userEvent.setup();render(<MotionProvider><MotionControl/></MotionProvider>);await user.click(await screen.findByRole('switch',{name:'Website animations'}));expect(document.documentElement).toHaveClass('motion-paused');expect(localStorage.getItem('rs-motion-paused')).toBe('true');expect(screen.getByText('Animations off')).toBeInTheDocument();await user.click(screen.getByRole('switch',{name:'Website animations'}));expect(document.documentElement).not.toHaveClass('motion-paused');
 });
 it('honours reduced motion at device level',async()=>{
  vi.mocked(window.matchMedia).mockImplementation(query=>({matches:query.includes('prefers-reduced-motion'),media:query,addEventListener:vi.fn(),removeEventListener:vi.fn()} as any));render(<MotionProvider><MotionControl/></MotionProvider>);expect(await screen.findByRole('switch',{name:'Website animations'})).toBeDisabled();expect(document.documentElement).toHaveClass('motion-paused');
 });
});
