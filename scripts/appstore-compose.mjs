// App Store screenshot composer — Imperial Lacquer Foil identity.
// Renders 6 marketing screenshots (1290x2796) from real UI captures.
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const RAW = path.resolve('appstore-shots/raw');
const OUT = path.resolve('appstore-shots/final');
fs.mkdirSync(OUT, { recursive: true });

const FONTS = '@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Be+Vietnam+Pro:wght@400;500;600&family=Noto+Serif+TC:wght@600;700&display=swap");';

const GRAIN = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.9  0 0 0 0 0.78  0 0 0 0 0.45  0 0 0 0.6 0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.5'/></svg>`;

const SCREENS = [
  { file: '01-home.png',             eyebrow: 'Dụng Thần · 用神',     h1: ['Khám phá', 'Dụng Thần của bạn'], sub: 'Nguyên tố cứu mệnh — riêng bạn mà thôi' },
  { file: '02-form-filled.png',      eyebrow: 'Tứ Trụ · 四柱',         h1: ['Lập lá số', 'Bát Tự chính xác'], sub: 'Cổ pháp Tử Bình · 子平真诠 · 滴天髓' },
  { file: '03-loading-or-result.png',eyebrow: 'Ngũ Hành · 格局',       h1: ['Dụng · Hỷ · Kỵ'],               sub: 'Vượng nhược · cách cục · thập thần · tàng can' },
  { file: '04-ai-chat.png',          eyebrow: 'AI Luận Giải · 問答',   h1: ['Hỏi đáp', 'vận mệnh'],           sub: 'Sự nghiệp · hôn nhân · tài lộc · thời điểm' },
  { file: '05-library.png',          eyebrow: 'Đạo Tạng · 道藏',        h1: ['1523', 'kinh điển'],             sub: 'Thư viện Huyền học lớn nhất Việt Nam' },
  { file: '06-detail.png',           eyebrow: 'Cải Mệnh · 逆天改命',   h1: ['Nghịch Thiên', 'Cải mệnh'],      sub: 'Liễu Phàm Tứ Huấn · 窮通寶鑑 · 調候' },
];

function html({ eyebrow, h1, sub, imgB64 }) {
  const h1html = h1.map(l => `<span class="line">${l}</span>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1290px;height:2796px}
body{
  font-family:'Be Vietnam Pro',sans-serif;color:#f5ecd6;
  background:
    radial-gradient(900px 560px at 50% 5%, rgba(216,166,74,.22), transparent 62%),
    radial-gradient(760px 520px at 50% 99%, rgba(128,26,26,.20), transparent 70%),
    linear-gradient(180deg,#0c0a14 0%,#08070e 60%,#0a0810 100%);
  position:relative;overflow:hidden;
  display:flex;flex-direction:column;align-items:center;
  padding:118px 0 86px;
}
body::before{content:"";position:fixed;inset:0;z-index:5;pointer-events:none;opacity:.06;mix-blend-mode:overlay;background-image:url("${GRAIN}");background-size:200px 200px}
body::after{content:"";position:absolute;left:50%;top:0;transform:translateX(-50%);width:2px;height:100%;background:linear-gradient(180deg,transparent,rgba(216,166,74,.05) 20%,rgba(216,166,74,.05) 80%,transparent);z-index:0}

.stage{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;width:100%;height:100%}

.brandmark{display:flex;align-items:center;gap:22px;margin-bottom:6px}
.brandmark .hang{font-family:'Noto Serif TC',serif;font-weight:700;font-size:46px;letter-spacing:.34em;color:#e9c664;text-shadow:0 2px 8px rgba(0,0,0,.5)}
.brandmark .dot{width:7px;height:7px;border-radius:50%;background:radial-gradient(circle,#f3d987,#9a7322)}
.brandmark .name{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:44px;letter-spacing:.28em;text-transform:uppercase;background:linear-gradient(135deg,#f3d987,#b8862f 60%,#f3d987);-webkit-background-clip:text;background-clip:text;color:transparent}

.eyebrow{margin-top:54px;display:inline-flex;align-items:center;gap:14px;padding:13px 30px;border-radius:999px;border:1px solid rgba(216,166,74,.42);background:linear-gradient(180deg,rgba(216,166,74,.10),rgba(216,166,74,.03));font-family:'Cormorant Garamond','Noto Serif TC',serif;font-weight:600;font-size:27px;letter-spacing:.22em;text-transform:uppercase;color:#e9c664;box-shadow:inset 0 1px 0 rgba(255,224,150,.18)}
.eyebrow::before,.eyebrow::after{content:"";width:26px;height:1px;background:linear-gradient(90deg,transparent,#c69736)}

.headline{margin-top:34px;text-align:center;padding:0 70px;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:96px;line-height:1.0;display:flex;flex-direction:column;gap:2px}
.headline .line{
  background:linear-gradient(158deg,#fdf3c0 0%,#f3d987 24%,#d8a64a 46%,#b8862f 60%,#f4d985 80%,#9a7322 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  text-shadow:0 3px 10px rgba(0,0,0,.55);
  filter:drop-shadow(0 1px 0 rgba(255,240,200,.18));
}

.sub{margin-top:30px;font-family:'Be Vietnam Pro',sans-serif;font-weight:400;font-size:34px;letter-spacing:.02em;color:#e6d6ab;text-align:center;padding:0 110px;max-width:1000px}
.sub.han{font-family:'Noto Serif TC',serif;color:#c69736}

.cardwrap{margin-top:56px;flex:1;display:flex;align-items:center;justify-content:center;width:100%}
/* Double-bezel: outer shell + inner core */
.device{
  position:relative;width:988px;height:2090px;border-radius:74px;padding:13px;
  background:linear-gradient(165deg,#22190d 0%,#120c06 50%,#1d1509 100%);
  border:1px solid rgba(216,166,74,.40);
  box-shadow:
    0 60px 130px rgba(0,0,0,.82),
    0 20px 50px rgba(0,0,0,.55),
    inset 0 1px 0 rgba(255,224,150,.22),
    inset 0 0 0 1px rgba(0,0,0,.5);
}
.device::before{content:"";position:absolute;left:50%;top:30px;transform:translateX(-50%);width:232px;height:64px;background:#000;border-radius:40px;z-index:3;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04)}
.screen{width:100%;height:100%;border-radius:61px;overflow:hidden;background:#0a0913;box-shadow:inset 0 0 0 1px rgba(0,0,0,.7),inset 0 3px 10px rgba(0,0,0,.55)}
.screen img{width:100%;height:100%;display:block;object-fit:cover}

.foot{margin-top:40px;display:flex;flex-direction:column;align-items:center;gap:10px}
.foot .tag{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:30px;color:#b8995f;letter-spacing:.05em}
.foot .line-rule{width:120px;height:1px;background:linear-gradient(90deg,transparent,#9a7322,transparent)}
</style></head><body>
  <div class="stage">
    <div class="brandmark">
      <span class="hang">旅燈</span>
      <span class="dot"></span>
      <span class="name">Lữ Đăng</span>
    </div>
    <div class="eyebrow">${eyebrow}</div>
    <h1 class="headline">${h1html}</h1>
    <div class="sub">${sub}</div>
    <div class="cardwrap">
      <div class="device"><div class="screen"><img src="data:image/png;base64,${imgB64}" alt=""></div></div>
    </div>
    <div class="foot">
      <div class="line-rule"></div>
      <div class="tag">Bát Tự · Mệnh Lý Cổ Pháp</div>
    </div>
  </div>
</body></html>`;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1290, height: 2796 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

for (const s of SCREENS) {
  const rawPath = path.join(RAW, s.file);
  if (!fs.existsSync(rawPath)) { console.log('MISSING', s.file); continue; }
  const b64 = fs.readFileSync(rawPath).toString('base64');
  await page.setContent(html({ eyebrow: s.eyebrow, h1: s.h1, sub: s.sub, imgB64: b64 }), { waitUntil: 'networkidle' });
  try { await page.evaluate(() => document.fonts.ready); } catch {}
  await page.waitForTimeout(600);
  const out = path.join(OUT, s.file);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1290, height: 2796 } });
  console.log('composed →', out);
}
await browser.close();
console.log('DONE → appstore-shots/final/');
