import {writeFileSync} from 'node:fs';
// Keep previously shared .html links working, including selected vehicles and destinations.
for (const route of ['fleet','services','tours','about','contact']) {
 const target=`/${route}/`;
 writeFileSync(`out/${route}.html`,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>RS Tours & Travels</title><link rel="canonical" href="${target}"><script>location.replace(${JSON.stringify(target)}+location.search+location.hash)</script><noscript><meta http-equiv="refresh" content="0;url=${target}"></noscript></head><body><a href="${target}">Continue to RS Tours & Travels</a></body></html>`);
}
