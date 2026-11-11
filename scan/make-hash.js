#!/usr/bin/env node
/* Nine Cat War Room, password hash. The site never stores your password, only this hash of it.
   Use. node scan/make-hash.js   then type the password you want and press Enter.
   Copy the 64 character line it prints into Vercel as the environment variable SITE_PASS_HASH, then redeploy.
   Nothing is saved or sent anywhere. Pick a password you do not use for anything else. */
const crypto=require('crypto'), readline=require('readline');
const rl=readline.createInterface({input:process.stdin,output:process.stdout});
rl.question('Password for your site, then Enter. ',pw=>{ rl.close(); pw=String(pw||''); if(pw.length<6){ console.log('Use at least 6 characters. Nothing made.'); process.exitCode=1; return; }
  console.log('\nSITE_PASS_HASH value, copy this whole line into Vercel\n'+crypto.createHash('sha256').update('ncw-gate-v1:'+pw).digest('hex')); });
