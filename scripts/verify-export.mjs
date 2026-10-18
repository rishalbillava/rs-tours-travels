import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import sharp from 'sharp';
const routes=['','fleet','services','tours','about','contact'];
let references=0;
for(const route of routes){
 const location=`https://rs.test/${route?route+'/':''}`;
 const html=await readFile(path.join('out',route,'index.html'),'utf8');
 const document=new JSDOM(html,{url:location}).window.document;
 assert.equal(document.querySelectorAll('h1').length,1,`${route}: one page heading`);
 assert.ok(document.querySelector('main#main'),`${route}: accessible main target`);
 assert.ok(document.body.textContent.includes('78928'),`${route}: business contact`);
 for(const element of document.querySelectorAll('a[href],img[src],link[rel="stylesheet"],script[src]')){
  const raw=element.getAttribute('href')||element.getAttribute('src');
  const url=new URL(raw,location);
  if(url.hostname==='wa.me')assert.equal(url.pathname,'/917892835142','All WhatsApp actions use the owner’s number');
  if(url.origin!=='https://rs.test')continue;
  if(raw.startsWith('#')){assert.ok(document.getElementById(url.hash.slice(1)),`Missing anchor ${route}: ${raw}`);continue}
  const target=decodeURIComponent(url.pathname),file=path.join('out',target.endsWith('/')?target+'index.html':target);
  assert.ok((await stat(file)).isFile(),`Missing export file: ${file}`);references++;
 }
 for(const image of document.querySelectorAll('img[srcset]')){
  for(const candidate of image.getAttribute('srcset').split(',')){
   const src=candidate.trim().split(/\s+/)[0];if(src.startsWith('/'))assert.ok((await stat(path.join('out',src))).isFile(),`Missing image variant: ${src}`);
  }
 }
}
const {channels}=await sharp('public/assets/rs-logo-clear.png').metadata();
const stats=await sharp('public/assets/rs-logo-clear.png').stats();
assert.equal(channels,4,'Preserved logo has alpha');assert.equal(stats.isOpaque,false,'Logo background stays transparent');
console.log(`Verified ${routes.length} routes, ${references} local references, responsive image variants, WhatsApp destinations and transparent logo.`);
