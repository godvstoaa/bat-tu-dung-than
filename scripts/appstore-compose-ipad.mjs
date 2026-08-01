// iPad 13" marketing screenshots (2064x2752) — App Store requirement for universal app.
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const RAW = path.resolve('appstore-shots/raw');
const OUT = path.resolve('appstore-shots/final-ipad');
fs.mkdirSync(OUT, { recursive: true });
const VP = { width: 2064, height: 2752 };
const FONTS = "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Be+Vietnam+Pro:wght@400;500&family=Noto+Serif+TC:wght@700&display=swap');";
const GRAIN = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .9 0 0 0 0 .78 0 0 0 0 .45 0 0 0 .6 0'/></filter><rect width='220' height='220' filter='url(%23n)' opacity='.5'/></svg>";

const SCENES = [
  { file: '01-home.png',              eyebrow: 'Dụng Thần · 用神',    h1: 'Khám phá Dụng Thần', sub: 'Nguyên tố cứu mệnh — riêng bạn' },
  { file: '03-loading-or-result.png', eyebrow: 'Tứ Trụ · 四柱',        h1: 'Bát Tự chính xác',   sub: 'Cổ pháp Tử Bình · 子平真诠' },
  { file: '04-ai-chat.png',           eyebrow: 'AI Luận Giải · 問答',  h1: 'AI luận giải',       sub: 'Sự nghiệp · hôn nhân · tài lộc' },
  { file: '05-library.png',           eyebrow: 'Đạo Tạng · 道藏',       h1: '1523 kinh điển',     sub: 'Thư viện Huyền học lớn nhất VN' },
  { file: '06-detail.png',            eyebrow: 'Cải Mệnh · 逆天改命',  h1: 'Nghịch Thiên Cải mệnh', sub: 'Liễu Phàm Tứ Huấn' },
  { file: '02-form-filled.png',       eyebrow: 'Phong Thủy · 風水',     h1: 'Phong thủy cổ pháp', sub: 'Hướng nhà · Thái Tuế · Tam Sát' },
];

function html(scene, imgB64) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}html,body{width:2064px;height:2752px}
body{font-family:'Be Vietnam Pro',sans-serif;color:#f5ecd6;
  background:radial-gradient(1100px 700px at 50% 6%,rgba(216,166,74,.22),transparent 62%),radial-gradient(900px 600px at 50% 99%,rgba(128,26,26,.18),transparent 70%),linear-gradient(180deg,#0c0a14,#08070e);
  position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:130px 0 90px}
body::before{content:"";position:fixed;inset:0;z-index:5;pointer-events:none;opacity:.06;mix-blend-mode:overlay;background-image:url("${GRAIN}");background-size:220px}
.s{position:relative;z-index:2;width:100%;display:flex;flex-direction:column;align-items:center}
.brand{display:flex;align-items:center;gap:24px;margin-bottom:30px}
.brand .hang{font-family:'Noto Serif TC',serif;font-weight:700;font-size:54px;letter-spacing:.34em;color:#e9c664}
.brand .nm{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:50px;letter-spacing:.3em;text-transform:uppercase;background:linear-gradient(135deg,#f3d987,#b8862f 60%,#f3d987);-webkit-background-clip:text;background-clip:text;color:transparent;padding-left:.3em}
.ey{display:inline-flex;align-items:center;gap:16px;padding:14px 34px;border-radius:999px;border:1px solid rgba(216,166,74,.42);background:linear-gradient(180deg,rgba(216,166,74,.10),rgba(216,166,74,.03));font-family:'Cormorant Garamond','Noto Serif TC',serif;font-weight:600;font-size:31px;letter-spacing:.22em;text-transform:uppercase;color:#e9c664}
.h1{margin-top:30px;text-align:center;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:118px;line-height:1.0;background:linear-gradient(158deg,#fdf3c0,#f3d987 24%,#d8a64a 46%,#b8862f 60%,#f4d985 80%,#9a7322);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 3px 12px rgba(0,0,0,.55);padding:0 120px}
.sub{margin-top:26px;font-size:40px;color:#e6d6ab;text-align:center;letter-spacing:.02em}
.frame{margin-top:54px;width:1040px;padding:14px;border-radius:74px;background:linear-gradient(165deg,#22190d,#120c06);border:1px solid rgba(216,166,74,.4);box-shadow:0 60px 130px rgba(0,0,0,.82),inset 0 1px 0 rgba(255,224,150,.22)}
.frame .scr{width:100%;height:2100px;border-radius:61px;overflow:hidden;background:#0a0913;box-shadow:inset 0 0 0 1px rgba(0,0,0,.7)}
.frame .scr img{width:100%;height:100%;object-fit:cover;display:block}
.foot{margin-top:auto;display:flex;flex-direction:column;align-items:center;gap:10px}
.foot .tag{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:34px;color:#b8995f}
</style></head><body>
  <div class="s">
    <div class="brand"><span class="hang">旅燈</span><span class="nm">Lữ Đăng</span></div>
    <div class="ey">${scene.eyebrow}</div>
    <div class="h1">${scene.h1}</div>
    <div class="sub">${scene.sub}</div>
    <div class="frame"><div class="scr"><img src="data:image/png;base64,${imgB64}"></div></div>
    <div class="foot"><div class="tag">Bát Tự · Mệnh Lý Cổ Pháp</div></div>
  </div>
</body></html>`;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 1 });
const page = await ctx.newPage();
for (const s of SCENES) {
  const raw = path.join(RAW, s.file);
  if (!fs.existsSync(raw)) { console.log('MISSING', s.file); continue; }
  const b64 = fs.readFileSync(raw).toString('base64');
  await page.setContent(html(s, b64), { waitUntil: 'networkidle' });
  try { await page.evaluate(() => document.fonts.ready); } catch {}
  await page.waitForTimeout(500);
  const out = path.join(OUT, s.file);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: VP.width, height: VP.height } });
  console.log('ipad →', out);
}
await browser.close();
console.log('DONE → appstore-shots/final-ipad/');
