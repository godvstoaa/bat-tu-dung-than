// Strict mobile capture for App Review — waits for analysis, scrolls to real sections.
import { chromium, devices } from 'playwright';
import { mkdirSync, copyFileSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TMP = resolve(ROOT, '_tmp/mobile-capture');
const OUT = resolve(ROOT, 'public/review-shots');
mkdirSync(TMP, { recursive: true });
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const APP = process.env.APP_URL || 'https://battu.god8.shop';

function pngInfo(p) {
  const b = readFileSync(p);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), kb: Math.round(b.length / 1024) };
}

async function shot(page, name) {
  const path = resolve(TMP, `${name}.png`);
  await page.screenshot({ path, animations: 'disabled' });
  const i = pngInfo(path);
  console.log(`  ✓ ${name} ${i.w}x${i.h} ${i.kb}KB`);
  return path;
}

async function ensureAnalysis(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await sleep(2000);
  const luan = page.locator('button:has-text("Luận giải")').first();
  if (await luan.isVisible().catch(() => false)) {
    const label = await luan.innerText().catch(() => '');
    if (!/Đang/.test(label)) {
      await luan.click();
      console.log('  clicked Luận giải');
    }
  }
  // Wait until result sections exist and loading finishes
  for (let i = 0; i < 60; i++) {
    const state = await page.evaluate(() => {
      const t = document.body.innerText || '';
      return {
        loading: /Đang luận giải/.test(t),
        tomtat: /Tóm tắt\s*&\s*Cốt lõi|Tóm tắt & Cốt lõi/.test(t),
        cachcuc: /Cách Cục|Cách cục|DỤNG THẦN|Dụng Thần ·/.test(t),
        len: t.length,
      };
    });
    if (!state.loading && (state.tomtat || state.cachcuc) && state.len > 3000) {
      console.log('  analysis ready, bodyLen=', state.len);
      return true;
    }
    await sleep(500);
  }
  console.log('  WARN: analysis may be incomplete');
  return false;
}

async function scrollToMatch(page, patterns) {
  const hit = await page.evaluate((pats) => {
    const re = pats.map((p) => new RegExp(p, 'i'));
    const nodes = Array.from(
      document.querySelectorAll('h1,h2,h3,h4,.card-title,.grp,.section-title,button,[role="tab"],.tab,.seg-btn,a,div,span'),
    );
    for (const re1 of re) {
      const el = nodes.find((e) => {
        const t = (e.textContent || '').replace(/\s+/g, ' ').trim();
        return re1.test(t) && t.length < 100 && e.offsetParent !== null;
      });
      if (el) {
        el.scrollIntoView({ block: 'start', behavior: 'instant' });
        try {
          el.click();
        } catch {
          /* ignore */
        }
        return (el.textContent || '').trim().slice(0, 60);
      }
    }
    return null;
  }, patterns);
  await sleep(900);
  return hit;
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: devices['iPhone 14 Pro'].userAgent,
});
await ctx.addInitScript(() => {
  try {
    localStorage.setItem('bazi-library-optin', '1');
  } catch {
    /* ignore */
  }
});
const page = await ctx.newPage();

// ========== WATER chart ==========
console.log('=== WATER 1990-06-15 ===');
await ensureAnalysis(page, `${APP}/?dob=1990-06-15&time=10:00&g=nam`);

// 01 overview cards
let hit = await scrollToMatch(page, ['Tóm tắt & Cốt lõi', 'Tóm tắt']);
console.log('  scroll', hit);
await sleep(500);
await shot(page, 'v2-01-tom-tat');

// pillars / four pillars section
hit = await scrollToMatch(page, ['Tứ Trụ', 'Lá số tứ trụ', 'Bảng tứ trụ', '四柱']);
console.log('  pillars', hit);
await shot(page, 'v2-07-pillars');

// pattern dung than
hit = await scrollToMatch(page, ['Cách Cục', 'Vượng Suy', 'Dụng Thần']);
console.log('  pattern', hit);
await shot(page, 'v2-08-pattern');

// elements
hit = await scrollToMatch(page, ['Ngũ Hành', 'Cân bằng ngũ hành', '五行']);
console.log('  elements', hit);
await shot(page, 'v2-09-elements');

// today tab
hit = await scrollToMatch(page, ['^Hôm Nay$', 'Hôm Nay', 'Vận Hôm Nay']);
console.log('  today', hit);
await sleep(700);
await shot(page, 'v2-10-today');

// future
hit = await scrollToMatch(page, ['Năm nay & Tương lai', 'Năm nay', 'Đại Vận']);
console.log('  future', hit);
await sleep(700);
await shot(page, 'v2-11-future');

// feng shui
hit = await scrollToMatch(page, ['Phong thủy', 'Phong Thủy', '太岁|Thái Tuế']);
console.log('  fengshui', hit);
await sleep(700);
await shot(page, 'v2-12-fengshui');

// divination
hit = await scrollToMatch(page, ['Bói toán', 'Mai Hoa', 'công cụ tương tác']);
console.log('  divination', hit);
await sleep(700);
await shot(page, 'v2-13-divination');

// library (opt-in pre-set)
hit = await scrollToMatch(page, ['Thư viện Huyền học', 'Thư viện']);
console.log('  library', hit);
await sleep(1000);
// if gate still shows, click
const gate = page.locator('button:has-text("Tôi đã hiểu")');
if ((await gate.count()) && (await gate.first().isVisible().catch(() => false))) {
  console.log('  clicking library opt-in gate');
  await gate.first().click();
  await sleep(1500);
}
await shot(page, 'v2-14-library-inapp');
// second shot after small scroll inside library
await page.evaluate(() => window.scrollBy(0, 300));
await sleep(400);
await shot(page, 'v2-14b-library-list');

// AI open + ask hard question (principles: truth-telling)
console.log('=== AI ===');
const fab = page.locator('button:has-text("Nghịch Thiên")').first();
if (await fab.isVisible().catch(() => false)) {
  await fab.click();
  await sleep(2000);
  await shot(page, 'v2-03-ai-panel');
  const input = page
    .locator('textarea:visible, input[placeholder*="Hỏi"]:visible, input[placeholder*="lá số"]:visible, input[placeholder*="Năm"]:visible')
    .first();
  if (await input.isVisible().catch(() => false)) {
    await input.click();
    await input.fill('Năm nay có xấu không? Nói thẳng theo lá số của tôi, đừng an ủi generic.');
    await sleep(300);
    const send = page.locator('button:has-text("Hỏi"), button:has-text("Gửi")').first();
    if (await send.isVisible().catch(() => false)) {
      await send.click();
      console.log('  AI question sent, waiting...');
      for (let i = 0; i < 35; i++) {
        await sleep(1000);
        const len = await page.evaluate(() => (document.body.innerText || '').length);
        if (i % 5 === 0) console.log('   t+', i, 'len', len);
        // stop when answer grew significantly
        if (i > 8 && len > 6000) break;
      }
      await sleep(1500);
      await shot(page, 'v2-06-ai-answer');
    }
  }
}

// theme water — result header area with accent
await page.keyboard.press('Escape').catch(() => {});
await scrollToMatch(page, ['Tóm tắt & Cốt lõi', 'Tóm tắt']);
await sleep(400);
await shot(page, 'v2-04-theme-water');

// ========== WOOD chart ==========
console.log('=== WOOD-ish 1988-03-20 ===');
await ensureAnalysis(page, `${APP}/?dob=1988-03-20&time=08:00&g=nam`);
await scrollToMatch(page, ['Tóm tắt & Cốt lõi', 'Tóm tắt']);
await sleep(500);
await shot(page, 'v2-05-theme-wood');
await scrollToMatch(page, ['Cách Cục', 'Dụng Thần']);
await sleep(500);
await shot(page, 'v2-05b-wood-pattern');

// ========== Web corpus mobile ==========
console.log('=== WEB LIBRARY ===');
await page.goto(`${APP}/kinh/index.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await sleep(1200);
await shot(page, 'v2-02-library-web');
await page.goto(`${APP}/kinh/dao-duc-kinh.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await sleep(800);
await shot(page, 'v2-02b-dao-duc');

await browser.close();

// Promote with quality gate
const promote = {
  '01-bazi-chart.png': ['v2-01-tom-tat.png', 'm-01b-tom-tat.png'],
  '02-library.png': ['v2-02-library-web.png', 'm-02-library-web-index.png'],
  '02b-dao-duc-kinh.png': ['v2-02b-dao-duc.png', 'm-02b-dao-duc-kinh.png'],
  '03-ai-chat.png': ['v2-03-ai-panel.png', 'm-03-ai-panel.png'],
  '04-theme-water.png': ['v2-04-theme-water.png', 'v2-01-tom-tat.png'],
  '05-theme-wood.png': ['v2-05-theme-wood.png', 'v2-05b-wood-pattern.png'],
  '06-ai-answer.png': ['v2-06-ai-answer.png', 'v2-03-ai-panel.png'],
  '07-pillars.png': ['v2-07-pillars.png'],
  '08-pattern-dungthan.png': ['v2-08-pattern.png', 'm-11-future.png'],
  '10-today.png': ['v2-10-today.png', 'm-10-today.png'],
  '11-future.png': ['v2-11-future.png', 'm-11-future.png'],
  '12-fengshui.png': ['v2-12-fengshui.png'],
  '13-divination.png': ['v2-13-divination.png', 'm-13-divination.png'],
  '14-library-inapp.png': ['v2-14-library-inapp.png', 'v2-14b-library-list.png', 'm-14b-library-open.png'],
  '15-deep-rules.png': ['v2-11-future.png', 'm-11-future.png'],
  '16-wood-pattern.png': ['v2-05b-wood-pattern.png'],
};

const report = [];
for (const [dest, candidates] of Object.entries(promote)) {
  let best = null;
  for (const c of candidates) {
    const from = resolve(TMP, c);
    try {
      const info = pngInfo(from);
      if (info.kb < 30) continue; // blank
      if (!best || info.kb > best.kb) best = { from, ...info, c };
    } catch {
      /* missing */
    }
  }
  if (best) {
    copyFileSync(best.from, resolve(OUT, dest));
    report.push({ dest, src: best.c, kb: best.kb, w: best.w, h: best.h, ok: best.kb > 40 && best.h > best.w });
    console.log(`PROMOTE ${dest} <- ${best.c} (${best.kb}KB)`);
  } else {
    report.push({ dest, ok: false });
    console.log(`FAIL ${dest}`);
  }
}
writeFileSync(resolve(TMP, 'report-v2.json'), JSON.stringify(report, null, 2));
console.log('DONE v2');
