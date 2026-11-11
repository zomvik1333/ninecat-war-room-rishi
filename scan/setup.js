#!/usr/bin/env node
/* Nine Cat War Room, one time setup. Writes your own site address into the two files that need it.
   Use. node scan/setup.js https://your-site.vercel.app
   It changes scan/yahoo-scan.js and scan/check-live.js and nothing else. Commit and push after it runs. */
const fs=require('fs'), path=require('path');
const url=(process.argv[2]||'').trim().replace(/\/+$/,'');
if(!/^https:\/\/[a-z0-9.-]+$/i.test(url)){ console.log('Give your site address, like this. node scan/setup.js https://your-site.vercel.app'); process.exit(1); }
let n=0;
['yahoo-scan.js','check-live.js'].forEach(f=>{ const p=path.join(__dirname,f); const s=fs.readFileSync(p,'utf8'); const t=s.replace(/const SITE='https:\/\/[^']*'/,"const SITE='"+url+"'"); if(t===s && s.indexOf("const SITE='"+url+"'")<0){ console.log('Could not find the site line in scan/'+f+'. Nothing written there.'); return; } fs.writeFileSync(p,t); n++; });
console.log(n===2?'site set to '+url+' in scan/yahoo-scan.js and scan/check-live.js. Now commit and push.':'setup NOT finished, see the lines above.');
if(n!==2) process.exitCode=1;
