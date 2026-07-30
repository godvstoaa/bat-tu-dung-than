// Cinematic App Preview v3 — Ken Burns on verified real screenshots + gold-foil callouts.
// Reliable: no live navigation, no letterbox. Content = dark real UI (from appstore-shots/raw).
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const CLIPS = path.resolve('appstore-shots/clips3');
fs.rmSync(CLIPS, { recursive: true, force: true });
fs.mkdirSync(CLIPS, { recursive: true });
const RAW = path.resolve('appstore-shots/raw');
const VP = { width: 1290, height: 2796 };
const FONTS = "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Be+Vietnam+Pro:wght@400;600&family=Noto+Serif+TC:wght@700&display=swap');";
const GRAIN = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .9 0 0 0 0 .78 0 0 0 0 .45 0 0 0 .6 0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='.5'/></svg>";

const browser = await chromium.launch();

const SCENES = [
  { img: '01-home.png',              text: 'Khám phá Dụng Thần', kb: 'in',  origin: 'center 30%' },
  { img: '03-loading-or-result.png', text: 'Tứ Trụ · 四柱',       kb: 'in',  origin: 'center 25%' },
  { img: '04-ai-chat.png',           text: 'AI luận giải',        kb: 'out', origin: 'center 40%' },
  { img: '05-library.png',           text: '1523 kinh điển',      kb: 'in',  origin: 'center 50%' },
  { img: '06-detail.png',            text: 'Cải mệnh · 逆天改命', kb: 'out', origin: 'center 35%' },
];

function sceneHtml(imgB64, text, kb, origin, dur) {
  const anim = kb === 'in'
    ? `from{transform:scale(1.0)} to{transform:scale(1.14)}`
    : `from{transform:scale(1.14)} to{transform:scale(1.0)}`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}html,body{width:1290px;height:2796px;overflow:hidden}
body{background:#0a0913;position:relative}
.bg{position:fixed;inset:0;background:url('data:image/png;base64,${imgB64}') center/cover no-repeat;transform-origin:${origin};animation:kb ${dur}s linear both;will-change:transform}
@keyframes kb{${anim}}
.vig{position:fixed;inset:0;z-index:3;pointer-events:none;background:radial-gradient(120% 80% at 50% 40%,transparent 55%,rgba(8,7,14,.55) 100%)}
.grain{position:fixed;inset:0;z-index:4;pointer-events:none;opacity:.05;mix-blend-mode:overlay;background-image:url("${GRAIN}");background-size:200px}
.cw{position:fixed;left:0;right:0;top:84px;z-index:6;text-align:center;pointer-events:none;opacity:0;animation:cin .8s cubic-bezier(.2,.7,.2,1) .35s forwards}
.pill{display:inline-block;padding:15px 40px;border:1px solid rgba(216,166,74,.6);border-radius:999px;background:rgba(10,8,16,.62);font-family:'Cormorant Garamond','Noto Serif TC',Georgia,serif;font-weight:700;font-size:33px;letter-spacing:.22em;color:#f3d987;text-transform:uppercase;text-shadow:0 2px 10px #000;box-shadow:0 10px 34px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,224,150,.22)}
@keyframes cin{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
</style></head><body>
  <div class="bg"></div>
  <div class="vig"></div>
  <div class="grain"></div>
  <div class="cw"><span class="pill">${text}</span></div>
</body></html>`;
}

function introOutroHtml(kind) {
  if (kind === 'intro') {
    return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}*{margin:0;padding:0;box-sizing:border-box}html,body{width:1290px;height:2796px;overflow:hidden}
    body{background:radial-gradient(900px 560px at 50% 42%,rgba(216,166,74,.26),transparent 60%),radial-gradient(760px 520px at 50% 100%,rgba(128,26,26,.18),transparent 70%),linear-gradient(180deg,#0c0a14,#08070e);display:flex;align-items:center;justify-content:center;position:relative}
    body::before{content:"";position:fixed;inset:0;z-index:5;pointer-events:none;opacity:.06;mix-blend-mode:overlay;background-image:url("${GRAIN}");background-size:200px}
    .s{position:relative;z-index:2;text-align:center}
    .han{font-family:'Noto Serif TC',serif;font-weight:700;font-size:230px;letter-spacing:.18em;margin-left:.18em;background:linear-gradient(158deg,#fdf3c0,#f3d987 26%,#d8a64a 48%,#b8862f 62%,#f4d985 82%,#9a7322);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 4px 14px rgba(0,0,0,.55);animation:z 3.5s cubic-bezier(.2,.7,.2,1)}
    .nm{margin-top:36px;font-family:'Cormorant Garamond',serif;font-weight:600;font-size:108px;letter-spacing:.34em;text-transform:uppercase;background:linear-gradient(135deg,#f3d987,#b8862f 55%,#f3d987);-webkit-background-clip:text;background-clip:text;color:transparent;padding-left:.34em;animation:u 3.5s cubic-bezier(.2,.7,.2,1) .15s both}
    .rl{margin:60px auto 0;width:150px;height:1px;background:linear-gradient(90deg,transparent,#c69736,transparent);animation:u 3.5s ease .4s both}
    .tg{margin-top:40px;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:52px;color:#ecd9a8;animation:u 3.5s ease .6s both}
    @keyframes u{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes z{from{opacity:0;transform:scale(.86)}to{opacity:1;transform:scale(1)}}
    </style></head><body><div class="s"><div class="han">旅燈</div><div class="nm">Lữ Đăng</div><div class="rl"></div><div class="tg">Đèn soi đường lữ khách</div></div></body></html>`;
  }
  // outro
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}*{margin:0;padding:0;box-sizing:border-box}html,body{width:1290px;height:2796px;overflow:hidden}
  body{background:radial-gradient(900px 560px at 50% 42%,rgba(216,166,74,.26),transparent 60%),radial-gradient(760px 520px at 50% 100%,rgba(128,26,26,.18),transparent 70%),linear-gradient(180deg,#0c0a14,#08070e);display:flex;align-items:center;justify-content:center;position:relative}
  body::before{content:"";position:fixed;inset:0;z-index:5;pointer-events:none;opacity:.06;mix-blend-mode:overlay;background-image:url("${GRAIN}");background-size:200px}
  .s{position:relative;z-index:2;text-align:center}
  .han{font-family:'Noto Serif TC',serif;font-weight:700;font-size:150px;letter-spacing:.16em;margin-left:.16em;background:linear-gradient(158deg,#fdf3c0,#d8a64a 50%,#9a7322);-webkit-background-clip:text;background-clip:text;color:transparent;animation:u 3.5s ease both}
  .nm{margin-top:26px;font-family:'Cormorant Garamond',serif;font-weight:600;font-size:72px;letter-spacing:.3em;text-transform:uppercase;background:linear-gradient(135deg,#f3d987,#b8862f);-webkit-background-clip:text;background-clip:text;color:transparent;padding-left:.3em;animation:u 3.5s ease .15s both}
  .rl{margin:50px auto 36px;width:140px;height:1px;background:linear-gradient(90deg,transparent,#9a7322,transparent)}
  .cta{display:inline-block;padding:22px 56px;border-radius:999px;border:1px solid rgba(216,166,74,.55);background:linear-gradient(180deg,rgba(216,166,74,.16),rgba(216,166,74,.04));font-family:'Cormorant Garamond',serif;font-weight:600;font-size:44px;color:#f3d987;animation:u 3.5s ease .35s both}
  .sub2{margin-top:34px;font-family:'Be Vietnam Pro',sans-serif;font-size:26px;letter-spacing:.3em;text-transform:uppercase;color:#9c7f4a;animation:u 3.5s ease .5s both}
  @keyframes u{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  </style></head><body><div class="s"><div class="han">旅燈</div><div class="nm">Lữ Đăng</div><div class="rl"></div><div class="cta">Tải về · khám phá mệnh lý</div><div class="sub2">Bát Tự · Mệnh Lý Cổ Pháp</div></div></body></html>`;
}

async function rec(name, dur, html) {
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 1, recordVideo: { dir: CLIPS, size: VP } });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  try { await page.evaluate(() => document.fonts.ready); } catch {}
  await page.waitForTimeout(dur * 1000);
  const v = page.video(); await ctx.close(); const p = await v.path();
  const dst = path.join(CLIPS, name + '.webm'); fs.renameSync(p, dst);
  console.log('clip', name, dur + 's');
}

const DUR = 4.6;
await rec('s0-intro', 3.6, introOutroHtml('intro'));
for (let i = 0; i < SCENES.length; i++) {
  const s = SCENES[i];
  const imgPath = path.join(RAW, s.img);
  if (!fs.existsSync(imgPath)) { console.log('MISSING', s.img); continue; }
  const b64 = fs.readFileSync(imgPath).toString('base64');
  await rec('s' + (i + 1), DUR, sceneHtml(b64, s.text, s.kb, s.origin, DUR));
}
await rec('s6-outro', 3.6, introOutroHtml('outro'));
await browser.close();
console.log('CLIPS3 DONE');
console.log(fs.readdirSync(CLIPS).join('\n'));
