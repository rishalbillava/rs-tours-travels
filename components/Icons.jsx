export function WhatsAppIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 11.6a8.8 8.8 0 0 1-13.2 7.6L3 20.5l1.3-4.4A8.8 8.8 0 1 1 20.8 11.6Z"></path><path d="M8.1 7.6c-.7 2.8 3.3 6.9 6.1 6.2l1.2-1.4-2-1.2-.9.8-2.4-2.4.8-.9-1.2-2Z"></path></svg>;}
export function ArrowIcon({direction='right',className=''}){
 const rotation={right:0,down:90,left:180,up:270,'up-right':-45,'down-right':45,'down-left':135,'up-left':225}[direction]||0;
 return <svg className={`ui-arrow ${className}`} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><g transform={`rotate(${rotation} 12 12)`}><path d="M5 12h14m-6-6 6 6-6 6"/></g></svg>;
}

export function TravelIcon({kind,className=''}){
 const paths={plane:'m22 2-7 20-4-9-9-4 20-7Zm0 0L11 13',city:'M3 21h18M5 21V9h6v12m0-15h8v15M7 12h2m-2 4h2m4-7h4m-4 4h4m-4 4h4',phone:'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z',calendar:'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 11 3 3 5-5',chat:'M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l1.9-5.4A8.5 8.5 0 1 1 21 11.5Z'};
 return <svg className={`travel-icon ${className}`} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[kind]||paths.chat}/></svg>;
}
