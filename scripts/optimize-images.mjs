import sharp from 'sharp';
import {readdir,mkdir,stat} from 'node:fs/promises';
import path from 'node:path';
const input='public/assets',output=path.join(input,'optimized');
await mkdir(output,{recursive:true});
for(const file of await readdir(input)){
 if(!/\.(png|jpe?g|webp)$/i.test(file))continue;
 const source=path.join(input,file),modified=(await stat(source)).mtimeMs;
 for(const width of [320,640,960,1440,1920]){
  const target=path.join(output,`${file.replace(/\.[^.]+$/,'')}-${width}.webp`);
  if(await stat(target).then(s=>s.mtimeMs>=modified).catch(()=>false))continue;
  await sharp(source).rotate().resize({width,withoutEnlargement:true}).webp({quality:82,alphaQuality:95}).toFile(target);
 }
}
console.log('Responsive local WebP photographs are ready.');
