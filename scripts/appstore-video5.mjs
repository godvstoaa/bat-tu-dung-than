// App Preview v5 — browser-driven, captures the EXCITING moments IN the record window.
// setup = navigate to ready state (trimmed out); action = trigger reveal/stream/scroll while recording.
//
// LETTERBOX FIX: Playwright recordVideo records CSS pixels. With viewport 430×932 +
// recordVideo size 1290×2796 the content is letterboxed top-left into gray.
// Solution: record live clips at viewport size (430×932), then ffmpeg-scale to 1290×2796.
import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CLIPS = path.resolve('appstore-shots/clips5');
const OUT = path.resolve('appstore-shots/app-preview-6.7.mp4');
fs.rmSync(CLIPS, { recursive: true, force: true });
fs.mkdirSync(CLIPS, { recursive: true });
const APP = 'https://battu.god8.shop';
const FONTS = "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Noto+Serif+TC:wght@700&display=swap');";
// Mobile profile for correct layout; recordVideo size MUST equal CSS viewport (no letterbox).
const IPHONE = {
  ...devices['iPhone 14 Pro Max'],
  viewport: { width: 430, height: 932 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: 'vi-VN',
};
const LIVE_VP = { width: 430, height: 932 }; // record size = CSS viewport
const FINAL_VP = { width: 1290, height: 2796 }; // App Store 6.7"
const browser = await chromium.launch();

// Gold pill callout — sit BELOW status/safe area, above app header content.
// top:72px clears the app's thin top chrome without covering the bagua/title.
const OV = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Noto+Serif+TC:wght@700&display=swap');
#ld-ov{position:fixed;left:0;right:0;top:72px;z-index:2147483647;text-align:center;pointer-events:none;opacity:0;animation:ldin .7s cubic-bezier(.2,.7,.2,1) .3s forwards}
#ld-ov .pill{display:inline-block;padding:7px 18px;border:1px solid rgba(216,166,74,.6);border-radius:999px;background:rgba(10,8,16,.72);font-family:'Cormorant Garamond','Noto Serif TC',Georgia,serif;font-weight:700;font-size:13px;letter-spacing:.16em;color:#f3d987;text-transform:uppercase;text-shadow:0 2px 8px #000;box-shadow:0 6px 20px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,224,150,.2)}
@keyframes ldin{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}
`;

async function ov(page, text) {
  await page.addStyleTag({ content: OV });
  await page.evaluate((t) => {
    const prev = document.getElementById('ld-ov');
    if (prev) prev.remove();
    const o = document.createElement('div');
    o.id = 'ld-ov';
    const p = document.createElement('span');
    p.className = 'pill';
    p.textContent = t;
    o.appendChild(p);
    document.body.appendChild(o);
  }, text);
}

// NO forceDark — app is already dark; !important bg broke layout/backgrounds.

async function scroll(page, dy, durMs) {
  try {
    await page.evaluate(async (a) => {
      const [dy, dur] = a;
      const maxY = Math.max(
        0,
        (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight - 8,
      );
      const y0 = window.scrollY;
      const y1 = Math.min(maxY, Math.max(0, y0 + dy));
      if (Math.abs(y1 - y0) < 15) return;
      const s = performance.now();
      return new Promise((r) => {
        const step = (t) => {
          const p = Math.min((t - s) / dur, 1);
          const e = 0.5 - Math.cos(p * Math.PI) / 2;
          window.scrollTo(0, y0 + (y1 - y0) * e);
          if (p < 1) requestAnimationFrame(step);
          else r();
        };
        requestAnimationFrame(step);
      });
    }, [dy, durMs]);
  } catch (e) {}
}

async function scrollToY(page, y, durMs = 1200) {
  try {
    await page.evaluate(async (a) => {
      const [target, dur] = a;
      const maxY = Math.max(
        0,
        (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight - 8,
      );
      const y0 = window.scrollY;
      const y1 = Math.min(maxY, Math.max(0, target));
      if (Math.abs(y1 - y0) < 8) return;
      const s = performance.now();
      return new Promise((r) => {
        const step = (t) => {
          const p = Math.min((t - s) / dur, 1);
          const e = 0.5 - Math.cos(p * Math.PI) / 2;
          window.scrollTo(0, y0 + (y1 - y0) * e);
          if (p < 1) requestAnimationFrame(step);
          else r();
        };
        requestAnimationFrame(step);
      });
    }, [y, durMs]);
  } catch (e) {}
}

async function clickText(page, re, timeout = 6000) {
  const el = await page.evaluateHandle((r) => {
    const rx = new RegExp(r, 'i');
    const all = [...document.querySelectorAll('button,a,[role=button],div,span')];
    return (
      all.find((e) => {
        const t = (e.textContent || '').trim();
        return t && t.length < 60 && rx.test(t) && e.offsetParent !== null;
      }) || null
    );
  }, re);
  const ok = el.asElement ? el.asElement() : null;
  if (ok) {
    await ok.click({ timeout }).catch(() => {});
    return true;
  }
  return false;
}

async function fillBirth(page) {
  try {
    const di = await page.$('input[type=date], #date');
    if (di) await di.fill('1990-01-15').catch(() => {});
    const ti = await page.$('input[type=time], #time');
    if (ti) await ti.fill('12:00').catch(() => {});
    // Prefer explicit NAM gender control
    await page.evaluate(() => {
      const all = [...document.querySelectorAll('button,a,[role=button],div,span,label')];
      const el = all.find((e) => {
        const t = (e.textContent || '').trim();
        return /^nam$/i.test(t) && e.offsetParent !== null;
      });
      if (el) el.click();
    });
  } catch (e) {}
}

async function runCalculate(page) {
  // Prefer the primary submit button
  const clicked = await page.evaluate(() => {
    const btn =
      document.querySelector('button.btn-primary') ||
      [...document.querySelectorAll('button')].find((b) =>
        /^luận giải$/i.test((b.textContent || '').trim()),
      );
    if (btn && btn.offsetParent !== null) {
      btn.click();
      return true;
    }
    return false;
  });
  if (!clicked) await clickText(page, '^luận giải$|luận giải');
}

async function openAi(page) {
  // AI popup is opened by #ai-fab (✨ Giải Mệnh)
  const opened = await page.evaluate(() => {
    const fab = document.getElementById('ai-fab');
    if (fab) {
      fab.classList.remove('hidden');
      fab.click();
      return 'fab';
    }
    return null;
  });
  if (!opened) await clickText(page, 'giải mệnh|✨');
  await sleep(900);
  // Wait for popup + input
  try {
    await page.waitForSelector('#ai-popup:not(.hidden) #question, #question', { timeout: 4000 });
  } catch (e) {}
}

async function openLibrary(page) {
  // Prefer in-app library section (not SEO /kinh/index.html stub)
  // 1) click nav "Thư viện Huyền học"
  await page.evaluate(() => {
    const all = [...document.querySelectorAll('a,button,[role=button],div,span')];
    const el = all.find((e) => {
      const t = (e.textContent || '').replace(/\s+/g, ' ').trim();
      return /thư viện huyền học|thư viện 1523|📚 thư viện/i.test(t) && t.length < 80 && e.offsetParent;
    });
    if (el) el.scrollIntoView({ block: 'center' });
    if (el) el.click();
  });
  await sleep(1200);
  // 2) dismiss consent if present
  await page.evaluate(() => {
    const all = [...document.querySelectorAll('button,a,[role=button],div,span')];
    const el = all.find((e) => {
      const t = (e.textContent || '').replace(/\s+/g, ' ').trim();
      return /tôi đã hiểu|mở thư viện/i.test(t) && t.length < 80 && e.offsetParent;
    });
    if (el) el.click();
  });
  await sleep(1800);
  // 3) ensure we have list content; fallback SEO only if empty
  const ok = await page.evaluate(() => {
    const text = (document.body.innerText || '');
    return text.length > 400 && /thư viện|kinh|đạo tạng|道/i.test(text);
  });
  if (!ok) {
    await page.goto(APP + '/kinh/index.html', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await sleep(2000);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// LIVE clip: setup (trimmed) + action (recorded = the exciting motion)
// Records at CSS viewport (430×932) — no letterbox. Scaled later.
async function live(name, recordSec, { setup, action, overlay, resetScroll = true }) {
  const ctx = await browser.newContext({
    ...IPHONE,
    recordVideo: { dir: CLIPS, size: LIVE_VP },
  });
  const page = await ctx.newPage();
  try {
    await page.goto(APP, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2600);
    if (setup) {
      try {
        await setup(page);
      } catch (e) {
        console.log('  setup fail', name, e.message);
      }
    }
    await page.waitForTimeout(800);
    if (resetScroll) await page.evaluate(() => window.scrollTo(0, 0));
    if (overlay) await ov(page, overlay);
    await Promise.all([action(page), page.waitForTimeout(recordSec * 1000)]);
  } catch (e) {
    console.log('  scene err', name, e.message);
  }
  const v = page.video();
  await ctx.close();
  const p = await v.path();
  fs.renameSync(p, path.join(CLIPS, name + '.webm'));
  console.log('clip', name);
}

const GRAIN =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .9 0 0 0 0 .78 0 0 0 0 .45 0 0 0 .6 0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='.5'/></svg>";

async function html(name, dur, body, extra) {
  // Intro/outro rendered at FULL App Store resolution (no mobile browser involved)
  const ctx = await browser.newContext({
    viewport: FINAL_VP,
    deviceScaleFactor: 1,
    recordVideo: { dir: CLIPS, size: FINAL_VP },
  });
  const page = await ctx.newPage();
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}*{margin:0;padding:0;box-sizing:border-box}html,body{width:1290px;height:2796px;overflow:hidden}body{font-family:'Be Vietnam Pro',sans-serif;background:radial-gradient(900px 560px at 50% 42%,rgba(216,166,74,.26),transparent 60%),radial-gradient(760px 520px at 50% 100%,rgba(128,26,26,.18),transparent 70%),linear-gradient(180deg,#0c0a14,#08070e);display:flex;align-items:center;justify-content:center;position:relative}body::before{content:"";position:fixed;inset:0;z-index:5;pointer-events:none;opacity:.06;mix-blend-mode:overlay;background-image:url("${GRAIN}");background-size:200px}${extra || ''}</style></head><body>${body}</body></html>`,
    { waitUntil: 'networkidle' },
  );
  try {
    await page.evaluate(() => document.fonts.ready);
  } catch (e) {}
  await page.waitForTimeout(dur * 1000);
  const v = page.video();
  await ctx.close();
  const p = await v.path();
  fs.renameSync(p, path.join(CLIPS, name + '.webm'));
  console.log('clip', name);
}

const INTRO =
  '<div style="position:relative;z-index:2;text-align:center"><div style="font-family:Noto Serif TC,serif;font-weight:700;font-size:230px;letter-spacing:.18em;margin-left:.18em;background:linear-gradient(158deg,#fdf3c0,#f3d987 26%,#d8a64a 48%,#b8862f 62%,#f4d985 82%,#9a7322);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 4px 14px rgba(0,0,0,.55);animation:z 3.5s cubic-bezier(.2,.7,.2,1)">旅燈</div><div style="margin-top:36px;font-family:Cormorant Garamond,serif;font-weight:600;font-size:108px;letter-spacing:.34em;text-transform:uppercase;background:linear-gradient(135deg,#f3d987,#b8862f 55%,#f3d987);-webkit-background-clip:text;background-clip:text;color:transparent;padding-left:.34em;animation:u 3.5s cubic-bezier(.2,.7,.2,1) .15s both">Lữ Đăng</div><div style="margin:60px auto 0;width:150px;height:1px;background:linear-gradient(90deg,transparent,#c69736,transparent);animation:u 3.5s ease .4s both"></div><div style="margin-top:40px;font-family:Cormorant Garamond,serif;font-style:italic;font-size:52px;color:#ecd9a8;animation:u 3.5s ease .6s both">Đèn soi đường lữ khách</div></div>';
const OUTRO =
  '<div style="position:relative;z-index:2;text-align:center"><div style="font-family:Noto Serif TC,serif;font-weight:700;font-size:150px;letter-spacing:.16em;margin-left:.16em;background:linear-gradient(158deg,#fdf3c0,#d8a64a 50%,#9a7322);-webkit-background-clip:text;background-clip:text;color:transparent;animation:u 3.5s ease both">旅燈</div><div style="margin-top:26px;font-family:Cormorant Garamond,serif;font-weight:600;font-size:72px;letter-spacing:.3em;text-transform:uppercase;background:linear-gradient(135deg,#f3d987,#b8862f);-webkit-background-clip:text;background-clip:text;color:transparent;padding-left:.3em;animation:u 3.5s ease .15s both">Lữ Đăng</div><div style="margin:50px auto 36px;width:140px;height:1px;background:linear-gradient(90deg,transparent,#9a7322,transparent)"></div><div style="display:inline-block;padding:22px 56px;border-radius:999px;border:1px solid rgba(216,166,74,.55);background:linear-gradient(180deg,rgba(216,166,74,.16),rgba(216,166,74,.04));font-family:Cormorant Garamond,serif;font-weight:600;font-size:44px;color:#f3d987;animation:u 3.5s ease .35s both">Tải về · khám phá mệnh lý</div><div style="margin-top:34px;font-family:Be Vietnam Pro,sans-serif;font-size:26px;letter-spacing:.3em;text-transform:uppercase;color:#9c7f4a;animation:u 3.5s ease .5s both">Bát Tự · Mệnh Lý Cổ Pháp</div></div>';
const KEY =
  '@keyframes u{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes z{from{opacity:0;transform:scale(.86)}to{opacity:1;transform:scale(1)}}';

// ── Scenes ──────────────────────────────────────────────────────────

// Intro
await html('b0-intro', 3.2, INTRO, KEY);

// Scene 1 — home: elegant scroll revealing form (stay within content)
await live('b1-home', 3.8, {
  overlay: 'Khám phá Dụng Thần',
  setup: async () => {},
  action: async (p) => {
    await sleep(400);
    await scroll(p, 380, 3000); // clamp-safe; form is near top
  },
});

// Scene 2 — Tứ Trụ: trigger calculate IN record → capture reveal
await live('b2-tutru', 5.2, {
  overlay: 'Tứ Trụ · 四柱',
  setup: async (p) => {
    await fillBirth(p);
  },
  action: async (p) => {
    await sleep(300);
    await runCalculate(p);
    // Wait until pillars exist (result rendered)
    try {
      await p.waitForSelector('.tuzu-col, .wx-foil-card', { timeout: 8000 });
    } catch (e) {}
    await sleep(900);
    // Scroll to tứ trụ pillars / summary (clamp-safe)
    const y = await p.evaluate(() => {
      const el =
        document.querySelector('.tuzu-col') ||
        document.querySelector('#result') ||
        document.querySelector('.wx-foil-card');
      if (el) {
        const r = el.getBoundingClientRect();
        return Math.max(0, window.scrollY + r.top - 120);
      }
      return 700;
    });
    await scrollToY(p, y, 1400);
    await sleep(600);
    await scroll(p, 280, 900);
  },
});

// Scene 3 — Dụng Thần: result shown, pan into ngũ hành / Dụng cards
await live('b3-dungthan', 4.0, {
  overlay: 'Dụng Thần · 用神',
  resetScroll: false, // keep scroll where setup left it
  setup: async (p) => {
    await fillBirth(p);
    await runCalculate(p);
    await sleep(3800);
    // Land on ngũ hành / Dụng foil cards region
    const y = await p.evaluate(() => {
      const el =
        document.querySelector('.wx-foil-card.is-dung') ||
        document.querySelector('.wx-foil-card') ||
        document.querySelector('.tuzu-col');
      if (el) {
        const r = el.getBoundingClientRect();
        return Math.max(0, window.scrollY + r.top - 180);
      }
      return 900;
    });
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
  },
  action: async (p) => {
    await sleep(300);
    await scroll(p, 420, 3400);
  },
});

// Scene 4 — AI: open #ai-fab popup, type question, watch stream
await live('b4-ai', 5.5, {
  overlay: 'AI luận giải',
  setup: async (p) => {
    await fillBirth(p);
    await runCalculate(p);
    await sleep(3200);
    await openAi(p);
    await sleep(600);
  },
  action: async (p) => {
    await sleep(350);
    // Type into #question (AI popup), NOT birth-name
    const q = await p.$('#question');
    if (q) {
      await q.click().catch(() => {});
      await q.fill('');
      await q.type('Sự nghiệp của tôi năm nay ra sao?', { delay: 55 });
      await sleep(200);
      const ask = await p.$('#ask-btn');
      if (ask) await ask.click().catch(() => {});
      else await p.keyboard.press('Enter');
    } else {
      // fallback: suggest chip
      await p.evaluate(() => {
        const chip = document.querySelector('.suggest-chip');
        if (chip) chip.click();
      });
    }
    await sleep(3800); // streaming response
  },
});

// Scene 5 — Library: fully open in-app library (consent → list), then scroll list
await live('b5-library', 4.5, {
  overlay: '1523 kinh điển',
  resetScroll: false,
  setup: async (p) => {
    await fillBirth(p);
    await runCalculate(p);
    await sleep(2800);
    await openLibrary(p);
    // Force consent open if still visible
    for (let i = 0; i < 3; i++) {
      const clicked = await p.evaluate(() => {
        const all = [...document.querySelectorAll('button,a,[role=button]')];
        const el = all.find((e) => {
          const t = (e.textContent || '').replace(/\s+/g, ' ').trim();
          return /tôi đã hiểu|mở thư viện/i.test(t) && t.length < 90 && e.offsetParent;
        });
        if (el) {
          el.scrollIntoView({ block: 'center' });
          el.click();
          return true;
        }
        return false;
      });
      if (clicked) await sleep(1500);
      else break;
    }
    // Land at top of library content
    await p.evaluate(() => {
      const el =
        [...document.querySelectorAll('h2,h3,div,section,button')].find((e) =>
          /thư viện huyền học|kinh điển|đạo tạng|道藏/i.test((e.textContent || '').slice(0, 40)),
        ) || null;
      if (el) el.scrollIntoView({ block: 'start' });
    });
    await sleep(600);
  },
  action: async (p) => {
    await sleep(350);
    // If consent still there, click it live
    await p.evaluate(() => {
      const el = [...document.querySelectorAll('button,a')].find((e) =>
        /tôi đã hiểu|mở thư viện/i.test((e.textContent || '').trim()),
      );
      if (el && el.offsetParent) el.click();
    });
    await sleep(800);
    await scroll(p, 560, 3000);
  },
});

// Outro
await html('b6-outro', 3.2, OUTRO, '@keyframes u{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}');

await browser.close();
console.log('CLIPS5 DONE');
console.log(fs.readdirSync(CLIPS).join('\n'));

// ── Stitch: scale live clips → 1290×2796, concat, ≤30s H.264 +faststart ──
function ff(cmd) {
  console.log('ff>', cmd.slice(0, 160) + (cmd.length > 160 ? '…' : ''));
  execSync(cmd, { stdio: 'inherit', shell: true });
}

const order = ['b0-intro', 'b1-home', 'b2-tutru', 'b3-dungthan', 'b4-ai', 'b5-library', 'b6-outro'];
// Trim head of each live webm: setup happens before action but webm includes full session.
// We only recorded action window inside live(), so full webm IS the action (setup is before video? No —
// Playwright records from page creation. Setup IS in the webm!
//
// live() flow: goto + wait + setup + wait + overlay + action (recordSec)
// The WHOLE thing is recorded. We must trim the lead-in (setup).
//
// Timings inside live():
//   goto wait 2600 + setup (variable) + 800 + action recordSec
// We can't easily know setup duration. Better approach: mark a t0 via evaluate after setup
// OR trim by taking the LAST recordSec seconds of each live clip.
//
// Taking last N seconds is robust for "action at the end".

const leadTrim = {
  // For each live clip, keep only the last `keep` seconds (action window)
  'b1-home': 3.8,
  'b2-tutru': 5.2,
  'b3-dungthan': 4.0,
  'b4-ai': 5.5,
  'b5-library': 4.5,
};
// intro/outro are pure html recordings of exact duration — keep full

const scaled = [];
for (const name of order) {
  const src = path.join(CLIPS, name + '.webm');
  const dst = path.join(CLIPS, name + '.mp4');
  if (!fs.existsSync(src)) {
    console.log('MISSING', src);
    continue;
  }
  const keep = leadTrim[name];
  if (keep) {
    // Scale to final res + take last `keep` seconds
    // -sseof seeks from end
    ff(
      `ffmpeg -y -sseof -${keep} -i "${src}" -vf "scale=${FINAL_VP.width}:${FINAL_VP.height}:flags=lanczos,fps=30,setsar=1" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 -an -t ${keep} "${dst}"`,
    );
  } else {
    // intro/outro already 1290×2796
    ff(
      `ffmpeg -y -i "${src}" -vf "scale=${FINAL_VP.width}:${FINAL_VP.height}:flags=lanczos,fps=30,setsar=1" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 -an "${dst}"`,
    );
  }
  scaled.push(dst);
}

// Concat list
const listPath = path.join(CLIPS, 'concat.txt');
fs.writeFileSync(listPath, scaled.map((f) => `file '${f.replace(/\\/g, '/')}'`).join('\n'));
const plain = path.resolve('appstore-shots/app-preview-6.7.plain.mp4');
ff(
  `ffmpeg -y -f concat -safe 0 -i "${listPath}" -c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart -an "${plain}"`,
);

// Hard cap ≤30s (App Store limit)
ff(
  `ffmpeg -y -i "${plain}" -t 30 -c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart -an "${OUT}"`,
);

const probe = execSync(
  `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration,codec_name -of csv=p=0 "${OUT}"`,
  { encoding: 'utf8' },
).trim();
console.log('FINAL', OUT);
console.log('PROBE', probe);
console.log('SIZE', (fs.statSync(OUT).size / 1024 / 1024).toFixed(2), 'MB');
