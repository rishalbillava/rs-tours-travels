import {describe,it,expect} from 'vitest';
import {render,screen,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AirportTravel from '../../components/AirportTravel';
import MobileBookingBar from '../../components/MobileBookingBar';

describe('airport and city travel',()=>{
 it('supports keyboard tabs and exposes the selected sightseeing panel',async()=>{
  const user=userEvent.setup();
  render(<AirportTravel/>);
  const airport=screen.getByRole('tab',{name:/BLR Kempegowda/});
  const city=screen.getByRole('tab',{name:/Bengaluru City/});
  expect(airport).toHaveAttribute('aria-selected','true');
  airport.focus();await user.keyboard('{ArrowRight}');
  expect(city).toHaveFocus();expect(city).toHaveAttribute('aria-selected','true');
  expect(screen.getByRole('tabpanel')).toHaveAttribute('id','travel-panel-city');
  expect(within(screen.getByRole('tabpanel')).getByText('Lalbagh & Cubbon Park')).toBeVisible();
  await user.keyboard('{Home}');
  expect(airport).toHaveFocus();expect(airport).toHaveAttribute('aria-selected','true');
 });
 it('sends selected destination enquiries to the existing business number',()=>{
  render(<AirportTravel/>);
  const section=screen.getByRole('heading',{name:/Direct outstation cabs/}).closest('.airport-outstation')!;
  const links=within(section as HTMLElement).getAllByRole('link');
  expect(links).toHaveLength(6);
  for(const link of links){
   const url=new URL(link.getAttribute('href')!);
   expect(url.hostname).toBe('wa.me');expect(url.pathname).toBe('/917892835142');
   const destination=link.querySelector('h4')!.textContent!.replace('BLR Airport','').trim();
   expect(url.searchParams.get('text')).toContain(`BLR Airport to ${destination}`);
   expect(link.querySelector('svg')).toBeTruthy();
  }
 });
 it('keeps mobile call, booking and WhatsApp destinations intact',()=>{
  render(<MobileBookingBar/>);
  const nav=screen.getByRole('navigation',{name:'Quick booking'});
  expect(within(nav).getByRole('link',{name:'Call'})).toHaveAttribute('href','tel:+917892835142');
  expect(within(nav).getByRole('link',{name:'Book Ride'})).toHaveAttribute('href','/contact/#booking');
  expect(within(nav).getByRole('link',{name:'WhatsApp'}).getAttribute('href')).toContain('wa.me/917892835142');
 });
});
