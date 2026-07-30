// App Preview v5 — browser-driven, captures the EXCITING moments IN the record window.
// setup = navigate to ready state (trimmed out); action = trigger reveal/stream/scroll while recording.
import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';

const CLIPS = path.resolve('appstore-shots/clips5');
fs.rmSync(CLIPS, { recursive: true, force: true });
fs.mkdirSync(CLIPS, { recursive: true });
const APP = 'https://battu.god8.shop';
const FONTS = "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Noto+Serif+TC:wght@700&display=swap');";
const IPHONE = { ...devices['iPhone 14 Pro Max'], viewport:{width:430,height:932}, deviceScaleFactor:3, isMobile:true, hasTouch:true, locale:'vi-VN' };
const browser = await chromium.launch();

const OV = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Noto+Serif+TC:wght@700&display=swap');
#ld-ov{position:fixed;left:0;right:0;top:54px;z-index:2147483647;text-align:center;pointer-events:none;opacity:0;animation:ldin .7s cubic-bezier(.2,.7,.2,1) .3s forwards}
#ld-ov .pill{display:inline-block;padding:8px 22px;border:1px solid rgba(216,166,74,.6);border-radius:999px;background:rgba(10,8,16,.66);font-family:'Cormorant Garamond','Noto Serif TC',Georgia,serif;font-weight:700;font-size:15px;letter-spacing:.18em;color:#f3d987;text-transform:uppercase;text-shadow:0 2px 8px #000;box-shadow:0 6px 20px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,224,150,.2)}
@keyframes ldin{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}
`;

async function ov(page, text){ await page.addStyleTag({content:OV}); await page.evaluate((t)=>{const o=document.createElement('div');o.id='ld-ov';const p=document.createElement('span');p.className='pill';p.textContent=t;o.appendChild(p);document.body.appendChild(o);}, text); }
async function dark(page){ try{ await page.addStyleTag({content:'html,body{background:#0a0913 !important;background-color:#0a0913 !important}'}); }catch(e){} }
async function scroll(page, dy, durMs){ try{ await page.evaluate(async(a)=>{const[dy,dur]=a;const maxY=Math.max(0,(document.documentElement.scrollHeight||document.body.scrollHeight)-window.innerHeight-8);const y0=window.scrollY;const y1=Math.min(maxY,Math.max(0,y0+dy));if(Math.abs(y1-y0)<15)return;const s=performance.now();return new Promise(r=>{const step=(t)=>{const p=Math.min((t-s)/dur,1);const e=.5-Math.cos(p*Math.PI)/2;window.scrollTo(0,y0+(y1-y0)*e);if(p<1)requestAnimationFrame(step);else r();};requestAnimationFrame(step);});},[dy,durMs]); }catch(e){} }
async function clickText(page, re, timeout=6000){ const el=await page.evaluateHandle((r)=>{const rx=new RegExp(r,'i');const all=[...document.querySelectorAll('button,a,[role=button],div,span')];return all.find(e=>{const t=(e.textContent||'').trim();return t&&t.length<40&&rx.test(t)&&e.offsetParent!==null;})||null;}, re); const ok=el.asElement?el.asElement():null; if(ok){ await ok.click({timeout}).catch(()=>{}); return true; } return false; }
async function fillBirth(page){ try{ const di=await page.$('input[type=date]'); if(di) await di.fill('1990-01-15').catch(()=>{}); const ti=await page.$('input[type=time]'); if(ti) await ti.fill('12:00').catch(()=>{}); await clickText(page,'^nam$|nam$'); }catch(e){} }
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// LIVE clip: setup (trimmed) + action (recorded = the exciting motion)
async function live(name, recordSec, { setup, action, overlay }) {
  const ctx = await browser.newContext({ ...IPHONE, recordVideo:{ dir: CLIPS, size:{width:1290,height:2796} } });
  const page = await ctx.newPage();
  try {
    await page.goto(APP, { waitUntil:'domcontentloaded', timeout:45000 });
    await page.waitForTimeout(2600);
    await dark(page);
    if (setup) { try { await setup(page); } catch(e){ console.log('  setup fail',name,e.message); } }
    await page.waitForTimeout(1200);
    await dark(page);
    await page.evaluate(() => window.scrollTo(0,0));
    if (overlay) await ov(page, overlay);
    await Promise.all([ action(page), page.waitForTimeout(recordSec*1000) ]);
  } catch(e){ console.log('  scene err',name,e.message); }
  const v = page.video(); await ctx.close(); const p = await v.path();
  fs.renameSync(p, path.join(CLIPS, name+'.webm'));
  console.log('clip', name);
}

const GRAIN = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .9 0 0 0 0 .78 0 0 0 0 .45 0 0 0 .6 0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='.5'/></svg>";
const VP = { width:1290, height:2796 };
async function html(name, dur, body, extra) {
  const ctx = await browser.newContext({ viewport:VP, deviceScaleFactor:1, recordVideo:{dir:CLIPS,size:VP} });
  const page = await ctx.newPage();
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}*{margin:0;padding:0;box-sizing:border-box}html,body{width:1290px;height:2796px;overflow:hidden}body{font-family:'Be Vietnam Pro',sans-serif;background:radial-gradient(900px 560px at 50% 42%,rgba(216,166,74,.26),transparent 60%),radial-gradient(760px 520px at 50% 100%,rgba(128,26,26,.18),transparent 70%),linear-gradient(180deg,#0c0a14,#08070e);display:flex;align-items:center;justify-content:center;position:relative}body::before{content:"";position:fixed;inset:0;z-index:5;pointer-events:none;opacity:.06;mix-blend-mode:overlay;background-image:url("${GRAIN}");background-size:200px}${extra||''}</style></head><body>${body}</body></html>`, { waitUntil:'networkidle' });
  try { await page.evaluate(() => document.fonts.ready); } catch(e){}
  await page.waitForTimeout(dur*1000);
  const v = page.video(); await ctx.close(); const p = await v.path();
  fs.renameSync(p, path.join(CLIPS, name+'.webm'));
  console.log('clip', name);
}

const INTRO = '<div style="position:relative;z-index:2;text-align:center"><div style="font-family:Noto Serif TC,serif;font-weight:700;font-size:230px;letter-spacing:.18em;margin-left:.18em;background:linear-gradient(158deg,#fdf3c0,#f3d987 26%,#d8a64a 48%,#b8862f 62%,#f4d985 82%,#9a7322);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 4px 14px rgba(0,0,0,.55);animation:z 3.5s cubic-bezier(.2,.7,.2,1)">旅燈</div><div style="margin-top:36px;font-family:Cormorant Garamond,serif;font-weight:600;font-size:108px;letter-spacing:.34em;text-transform:uppercase;background:linear-gradient(135deg,#f3d987,#b8862f 55%,#f3d987);-webkit-background-clip:text;background-clip:text;color:transparent;padding-left:.34em;animation:u 3.5s cubic-bezier(.2,.7,.2,1) .15s both">Lữ Đăng</div><div style="margin:60px auto 0;width:150px;height:1px;background:linear-gradient(90deg,transparent,#c69736,transparent);animation:u 3.5s ease .4s both"></div><div style="margin-top:40px;font-family:Cormorant Garamond,serif;font-style:italic;font-size:52px;color:#ecd9a8;animation:u 3.5s ease .6s both">Đèn soi đường lữ khách</div></div>';
const OUTRO = '<div style="position:relative;z-index:2;text-align:center"><div style="font-family:Noto Serif TC,serif;font-weight:700;font-size:150px;letter-spacing:.16em;margin-left:.16em;background:linear-gradient(158deg,#fdf3c0,#d8a64a 50%,#9a7322);-webkit-background-clip:text;background-clip:text;color:transparent;animation:u 3.5s ease both">旅燈</div><div style="margin-top:26px;font-family:Cormorant Garamond,serif;font-weight:600;font-size:72px;letter-spacing:.3em;text-transform:uppercase;background:linear-gradient(135deg,#f3d987,#b8862f);-webkit-background-clip:text;background-clip:text;color:transparent;padding-left:.3em;animation:u 3.5s ease .15s both">Lữ Đăng</div><div style="margin:50px auto 36px;width:140px;height:1px;background:linear-gradient(90deg,transparent,#9a7322,transparent)"></div><div style="display:inline-block;padding:22px 56px;border-radius:999px;border:1px solid rgba(216,166,74,.55);background:linear-gradient(180deg,rgba(216,166,74,.16),rgba(216,166,74,.04));font-family:Cormorant Garamond,serif;font-weight:600;font-size:44px;color:#f3d987;animation:u 3.5s ease .35s both">Tải về · khám phá mệnh lý</div><div style="margin-top:34px;font-family:Be Vietnam Pro,sans-serif;font-size:26px;letter-spacing:.3em;text-transform:uppercase;color:#9c7f4a;animation:u 3.5s ease .5s both">Bát Tự · Mệnh Lý Cổ Pháp</div></div>';
const KEY = '@keyframes u{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes z{from{opacity:0;transform:scale(.86)}to{opacity:1;transform:scale(1)}}';

// Intro
await html('b0-intro', 3.6, INTRO, KEY);

// Scene 1 — home: elegant scroll revealing form
await live('b1-home', 4.2, {
  overlay: 'Khám phá Dụng Thần',
  setup: async (p) => {},
  action: async (p) => { await sleep(300); await scroll(p, 520, 3600); },
});

// Scene 2 — Tứ Trụ: trigger calculate IN record → capture reveal animation
await live('b2-tutru', 5.0, {
  overlay: 'Tứ Trụ · 四柱',
  setup: async (p) => { await fillBirth(p); },     // fill form, DON'T click yet
  action: async (p) => {
    await sleep(300);
    await clickText(p, 'luận|tính|xem|phân tích|giải|bắt đầu');   // trigger → reveal plays NOW
    await sleep(3000);                                            // countUp / pillar-rise / flying-Hán
    await scroll(p, 450, 1500);
  },
});

// Scene 3 — Dụng Thần: result already shown, scroll into 5 hành
await live('b3-dungthan', 4.2, {
  overlay: 'Dụng Thần · 用神',
  setup: async (p) => { await fillBirth(p); await clickText(p,'luận|tính|xem|phân tích|giải|bắt đầu'); await sleep(3600); await p.evaluate(()=>window.scrollTo(0,1100)); },
  action: async (p) => { await sleep(300); await scroll(p, 480, 3600); },
});

// Scene 4 — AI: type question IN record → watch response STREAM
await live('b4-ai', 5.8, {
  overlay: 'AI luận giải',
  setup: async (p) => {
    await fillBirth(p); await clickText(p,'luận|tính|xem|phân tích|giải|bắt đầu'); await sleep(3000);
    await clickText(p,'luận giải|hỏi|ai|chat|trợ lý'); await sleep(1200);
  },
  action: async (p) => {
    await sleep(300);
    const ti = await p.$('textarea,input[type=text]');
    if (ti) { await ti.click().catch(()=>{}); await ti.type('Sự nghiệp của tôi năm nay ra sao?', { delay: 90 }); await p.keyboard.press('Enter'); }
    await sleep(3600);   // streaming response renders word-by-word
  },
});

// Scene 5 — Library: smooth scroll kinh list
await live('b5-library', 4.2, {
  overlay: '1523 kinh điển',
  setup: async (p) => { await p.goto(APP+'/kinh/index.html', { waitUntil:'domcontentloaded' }); await sleep(2600); await dark(p); },
  action: async (p) => { await sleep(300); await scroll(p, 640, 3700); },
});

// Outro
await html('b6-outro', 3.6, OUTRO, '@keyframes u{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}');

await browser.close();
console.log('CLIPS5 DONE');
console.log(fs.readdirSync(CLIPS).join('\n'));
