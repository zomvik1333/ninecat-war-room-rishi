# Nine Cat War Room, Registered Nurse edition

A private site for one team in a Yahoo head to head 9 cat league. It reads your league from Yahoo, then tells you who to pick up, who to drop, what your week looks like and which trades help you.

This copy is set up for Registered Nurse, team 5, in the Ball Lovers league (Yahoo league 82878). Vikas built the app for his own team and made this copy so you can run it yourself. It comes loaded with the league as of Nov 11 2026, so it works the first time you open it.

Every number is a model estimate. The site never touches Yahoo. You make every move yourself.

## What you need

* A GitHub account
* A Vercel account, the free plan is enough
* A computer with Node.js 18 or later and Git
* Chrome, signed in to Yahoo Fantasy

## Set it up, about 20 minutes

1. Make your own copy. On this repo's GitHub page press Fork. You now have the code under your own account.
2. Get it on your computer. `git clone https://github.com/YOUR-NAME/ninecat-war-room-rishi.git` then `cd ninecat-war-room-rishi`
3. Make the site. On vercel.com press Add New, Project, pick your fork and press Deploy. No build settings are needed. Vercel gives you an address like `https://something.vercel.app`.
4. Set your password. The site is locked until you do this.
   * Run `node scan/make-hash.js`, type the password you want and press Enter
   * Copy the long line it prints
   * In Vercel open your project, Settings, Environment Variables, add `SITE_PASS_HASH` with that line as the value, for Production
   * In Vercel open Deployments and Redeploy the latest one
5. Tell the scripts where your site is. Run `node scan/setup.js https://something.vercel.app` with your real address, then `git add -A`, `git commit -m "my site address"`, `git push`.
6. Link the folder to Vercel so you can deploy from it. Run `npm i -g vercel`, then `vercel link` and pick your project.
7. Open your site, type your password, and go to Pickups and trades.

## Keep it current

The site only knows what the last scan told it. Scan once a day, best after the night's games are final. Yahoo is only ever read. The scanner opens pages you can already see and never clicks anything.

### By hand, about 5 minutes

1. In Chrome open `https://basketball.fantasysports.yahoo.com/nba/82878/5` while signed in.
2. Press F12 and open the Console tab.
3. Open `scan/yahoo-scan.js` in a text editor, copy all of it, paste it into the console and press Enter.
4. Paste this line and press Enter. It takes about a minute and copies the result to your clipboard.
   `await NCWSCAN.run({limit:9000000}); copy(window.__ncw.lines.join(' ~\n')+' ~'); NCWSCAN.status()`
5. Make a folder named `scan_raw` in the project, paste the clipboard into a new text file there, for example `scan_raw/2026-11-12.txt`, and save it. Git ignores that folder.
6. In the project folder run these one at a time.
   * `node scan/ingest.js --snapshot scan_raw/2026-11-12.txt` It must print scan saved. If it lists bad lines, copy the result again and retry
   * `node scan/fetch-news.js`
   * `node scan/fetch-depth.js`
   * `node scan/fetch-games.js`
   * `node scan/check-deploy.js` It must print deploy ok
   * `vercel deploy --prod --yes`
   * `node scan/check-live.js` It should print LIVE OK
7. On Mondays also run `node scan/fetch-sched.js` and `node scan/fetch-ages.js` before the deploy.

### With Claude

If you use the Claude desktop app with the Chrome extension, Claude can do the whole scan for you. Open `scan/CLAUDE-PROMPT.md`, fill in the two folder paths at the top and paste it into a chat. Ask it to run every night if you want.

## Make it yours

* Your plan. `data/plan.json` says which cats you lock, build and punt. The starting plan was worked out from your roster on Nov 11, locks FG%, AST and BLK, build pool REB, STL and TO, punt PTS. Change the roles there, or try other plans on the Season plan panel of the site
* Your rules. In the same file, never is never traded or dropped, hold is not traded until a date, keep is never suggested as a drop, and ask sets a price a trade must meet. tiers lets you mark players trade only, floating or droppable. All of it starts empty
* Your notes on other managers. The site can load a private notes file so trades are ranked by what each manager values. `notes-example.json` shows the shape. Keep your real file outside this folder, it must never be pushed to GitHub. Load it on the site under Your private manager notes. It stays in your browser only
* A manager marked `"deal":"fair"` in your notes gets a full search of every deal shape on his page under By manager

## What is in here

* `index.html`, `moves.js` the site. Pickups and trades is the page you will use in season
* `data/` the league data the site reads. Scans rewrite it
* `scan/` the scanner and the scripts that turn a scan into data
* `middleware.ts` the password gate
* `api/` and `draft-room.html` live draft tools from before the season. They need Yahoo API keys and are not needed now

## Good to know

* Trades are judged three ways, your gain by your plan, how the deal looks on the box score, and whether the league would call it fair, the room number. 100 is even, 94 to 106 is fair
* Josh Lloyd's ranks in `data/josh_live.json` are as of Nov 11 2026. They only move if you update that file, the site works without doing so
* A deploy only ever needs the files in `data/`. If `check-deploy.js` says a file outside data changed, commit and push your code change first
* If the site says the password is not set up yet, step 4 was missed or the redeploy did not happen
