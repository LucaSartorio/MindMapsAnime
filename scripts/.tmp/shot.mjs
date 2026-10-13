import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(()=>chromium.launch());
const p = await b.newPage({ viewport: { width: +(process.env.W??1400), height: 400 }, deviceScaleFactor: 1 });
await p.goto('file://'+process.env.OUT);
await p.screenshot({ path: process.env.PNG, fullPage: true });
await b.close();
