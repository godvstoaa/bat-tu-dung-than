// Branded title card for App Preview video — Imperial Lacquer Foil.
import { chromium } from 'playwright';
import fs from 'fs';

const FONTS = '@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Be+Vietnam+Pro:wght@400;500&family=Noto+Serif+TC:wght@600;700&display=swap");';
const GRAIN = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.9  0 0 0 0 0.78  0 0 0 0 0.45  0 0 0 0.6 0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.5'/></svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1290px;height:2796px}
body{
  font-family:'Be Vietnam Pro',sans-serif;color:#f5ecd6;
  background:
    radial-gradient(820px 520px at 50% 42%, rgba(216,166,74,.26), transparent 60%),
    radial-gradient(700px 480px at 50% 100%, rgba(128,26,26,.16), transparent 70%),
    linear-gradient(180deg,#0c0a14,#08070e);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
}
body::before{content:"";position:fixed;inset:0;z-index:5;pointer-events:none;opacity:.06;mix-blend-mode:overlay;background-image:url("${GRAIN}");background-size:200px 200px}
.stage{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center}
.han{font-family:'Noto Serif TC',serif;font-weight:700;font-size:210px;letter-spacing:.18em;line-height:1;
  background:linear-gradient(158deg,#fdf3c0,#f3d987 26%,#d8a64a 48%,#b8862f 62%,#f4d985 82%,#9a7322);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  text-shadow:0 4px 14px rgba(0,0,0,.55);margin-left:.18em}
.name{margin-top:34px;font-family:'Cormorant Garamond',serif;font-weight:600;font-size:104px;letter-spacing:.34em;text-transform:uppercase;
  background:linear-gradient(135deg,#f3d987,#b8862f 55%,#f3d987);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 3px 10px rgba(0,0,0,.5);padding-left:.34em}
.rule{margin:54px 0 40px;width:150px;height:1px;background:linear-gradient(90deg,transparent,#c69736,transparent)}
.tag{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500;font-size:50px;color:#ecd9a8;letter-spacing:.03em}
.sub{margin-top:60px;font-family:'Be Vietnam Pro',sans-serif;font-size:30px;letter-spacing:.34em;text-transform:uppercase;color:#9c7f4a}
.dotrow{margin-top:30px;display:flex;gap:14px}
.dotrow span{width:7px;height:7px;border-radius:50%;background:radial-gradient(circle,#f3d987,#9a7322)}
</style></head><body>
  <div class="stage">
    <div class="han">旅燈</div>
    <div class="name">Lữ Đăng</div>
    <div class="rule"></div>
    <div class="tag">Đèn soi đường lữ khách</div>
    <div class="sub">Bát Tự · Mệnh Lý Cổ Pháp</div>
    <div class="dotrow"><span></span><span></span><span></span></div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1290, height: 2796 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
try { await page.evaluate(() => document.fonts.ready); } catch {}
await page.waitForTimeout(600);
await page.screenshot({ path: 'appstore-shots/titlecard.png', clip: { x: 0, y: 0, width: 1290, height: 2796 } });
await browser.close();
console.log('titlecard → appstore-shots/titlecard.png');
