// Capture mobile (iPhone) evidence screenshots for App Review documentation.
// Usage: node scripts/capture-mobile-evidence.mjs
import { chromium, devices } from 'playwright';
import { mkdirSync, readFileSync, copyFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public/review-shots');
const TMP = resolve(ROOT, '_tmp/mobile-capture');
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const APP = process.env.APP_URL || 'https://battu.god8.shop';
const WATER = `${APP}/?dob=1990-06-15&time=10:00&g=nam`;
const WOOD = `${APP}/?dob=1988-03-20&time=08:00&g=nam`;

function pngInfo(path) {
  const b = readFileSync(path);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), kb: +(b.length / 1024).toFixed(0) };
}

async function shot(page, name, { fullPage = false } = {}) {
  const path = resolve(TMP, `${name}.png`);
  await page.screenshot({ path, fullPage, animations: 'disabled' });
  const info = pngInfo(path);
  console.log(`  ✓ ${name}.png  ${info.w}x${info.h}  ${info.kb}KB`);
  return path;
}

async function waitResult(page) {
  for (let i = 0; i < 50; i++) {
    const ok =
      (await page.locator('text=Tóm tắt').first().isVisible().catch(() => false)) ||
      (await page.locator('text=Cách Cục').first().isVisible().catch(() => false)) ||
      (await page.locator('text=Dụng Thần').first().isVisible().catch(() => false)) ||
      (await page.locator('text=Tứ Trụ').first().isVisible().catch(() => false)) ||
      (await page.locator('text=Lá số').first().isVisible().catch(() => false));
    if (ok) return true;
    await sleep(400);
  }
  return false;
}

async function clickAny(page, texts) {
  for (const t of texts) {
    try {
      const loc = page.getByText(t, { exact: false }).first();
      if (await loc.isVisible({ timeout: 1200 }).catch(() => false)) {
        await loc.scrollIntoViewIfNeeded().catch(() => {});
        await loc.click({ timeout: 2500 });
        await sleep(1100);
        return t;
      }
    } catch {
      /* try next */
    }
  }
  // DOM fallback
  const hit = await page.evaluate((labs) => {
    const all = Array.from(document.querySelectorAll('button, a, h2, h3, .card-title, .grp, .tab, .seg-btn, [role="tab"], span, div'));
    for (const lab of labs) {
      const el = all.find((e) => (e.textContent || '').includes(lab) && e.offsetParent !== null);
      if (el) {
        el.scrollIntoView({ block: 'center' });
        try {
          el.click();
        } catch {
          /* ignore */
        }
        return lab;
      }
    }
    return null;
  }, texts);
  if (hit) await sleep(1100);
  return hit;
}

async function scrollToText(page, texts) {
  const hit = await page.evaluate((labs) => {
    const all = Array.from(document.querySelectorAll('h1,h2,h3,h4,.card-title,.grp,.section-title,button,a,div,span,p'));
    for (const lab of labs) {
      const el = all.find((e) => {
        const t = (e.textContent || '').trim();
        return t.includes(lab) && t.length < 80 && e.offsetParent !== null;
      });
      if (el) {
        el.scrollIntoView({ block: 'start' });
        return lab;
      }
    }
    return null;
  }, texts);
  if (hit) await sleep(700);
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

// Prefill library opt-in keys used by the app
await ctx.addInitScript(() => {
  const keys = [
    'lib_optin_v1',
    'library_optin',
    'LIB_OPTIN',
    'huyen_hoc_optin',
    'libOptIn',
    'bat_tu_lib_optin',
  ];
  for (const k of keys) {
    try {
      localStorage.setItem(k, '1');
    } catch {
      /* ignore */
    }
  }
});

const page = await ctx.newPage();
page.setDefaultTimeout(15000);

console.log('=== 1. Water chart (mobile result) ===');
await page.goto(WATER, { waitUntil: 'domcontentloaded', timeout: 90000 });
await sleep(2800);
const ready = await waitResult(page);
console.log('  result ready:', ready);
await page.keyboard.press('Escape').catch(() => {});
await page.evaluate(() => window.scrollTo(0, 0));
await sleep(500);

// Top of analysis (grid of cards)
await shot(page, 'm-01-bazi-overview');

// Summary / cốt lõi
await clickAny(page, ['Tóm tắt & Cốt lõi', 'Tóm tắt', 'Cốt lõi']);
await sleep(600);
await shot(page, 'm-01b-tom-tat');

// Four pillars
await scrollToText(page, ['Tứ Trụ', 'Lá số tứ trụ', '四柱', 'Can Chi']);
await clickAny(page, ['Tứ Trụ', 'Lá số']);
await sleep(600);
await shot(page, 'm-07-pillars');

// Pattern / Dụng Thần (deep classical engine)
await scrollToText(page, ['Cách Cục', 'Dụng Thần', 'Vượng Suy', '格局']);
await clickAny(page, ['Cách Cục', 'Dụng Thần']);
await sleep(800);
await shot(page, 'm-08-pattern-dungthan');

// Elements
await scrollToText(page, ['Ngũ Hành', '五行', 'Cân bằng ngũ hành']);
await sleep(500);
await shot(page, 'm-09-elements');

// Today
await clickAny(page, ['Hôm Nay', 'Vận Hôm Nay', '今日']);
await sleep(800);
await shot(page, 'm-10-today');

// Future / Đại vận
await clickAny(page, ['Năm nay & Tương lai', 'Năm nay', 'Đại Vận', 'Tương lai']);
await sleep(800);
await shot(page, 'm-11-future');

// Feng shui
await clickAny(page, ['Phong thủy', 'Phong Thủy', '风水']);
await sleep(800);
await shot(page, 'm-12-fengshui');

// Divination
await clickAny(page, ['Bói toán', 'công cụ tương tác', 'Mai Hoa', 'Gieo']);
await sleep(1000);
await shot(page, 'm-13-divination');

// Try run meihua if form visible
try {
  const gieo = page.locator('button:has-text("Gieo theo giờ"), button:has-text("Gieo & luận")').first();
  if (await gieo.isVisible({ timeout: 1500 }).catch(() => false)) {
    await gieo.click();
    await sleep(1500);
    await shot(page, 'm-13b-divination-result');
  }
} catch {
  /* optional */
}

// In-app library
await scrollToText(page, ['Thư viện Huyền học', 'Thư viện', '玄學藏書']);
await clickAny(page, ['Thư viện Huyền học', 'Thư viện']);
await sleep(1000);
await shot(page, 'm-14-library-gate');

const optin = page.locator('button:has-text("Tôi đã hiểu"), button:has-text("mở Thư viện")');
if ((await optin.count()) > 0 && (await optin.first().isVisible().catch(() => false))) {
  await optin.first().click();
  await sleep(1800);
}
await shot(page, 'm-14b-library-open');

// AI assistant
console.log('=== 2. AI chat ===');
const aiSelectors = [
  'button:has-text("Nghịch Thiên")',
  'button:has-text("Cải Mệnh")',
  '#ai-fab',
  '.ai-fab',
  'button.ai-toggle',
];
for (const sel of aiSelectors) {
  const btn = page.locator(sel).first();
  if ((await btn.count()) && (await btn.isVisible().catch(() => false))) {
    try {
      await btn.click({ timeout: 3000 });
      await sleep(2000);
      break;
    } catch {
      /* next */
    }
  }
}
await shot(page, 'm-03-ai-panel');

// Type a question if input exists
try {
  const input = page.locator('textarea, input[type="text"]').filter({ hasText: '' }).last();
  const visibleInput = page.locator('textarea:visible, input[placeholder*="Hỏi"]:visible, input[placeholder*="lá số"]:visible').first();
  if (await visibleInput.isVisible({ timeout: 1500 }).catch(() => false)) {
    await visibleInput.fill('Năm nay có xấu không? Nói thẳng theo lá số, đừng an ủi.');
    await sleep(400);
    const send = page.locator('button:has-text("Hỏi"), button:has-text("Gửi")').first();
    if (await send.isVisible().catch(() => false)) {
      await send.click();
      // wait for streaming answer (up to ~25s)
      for (let i = 0; i < 30; i++) {
        await sleep(1000);
        const long = await page.evaluate(() => {
          const panel = document.querySelector('.ai-panel, .chat, [class*="ai"]') || document.body;
          return (panel.innerText || '').length;
        });
        if (long > 800) break;
      }
      await sleep(1500);
      await shot(page, 'm-06-ai-answer');
    }
  }
} catch (e) {
  console.log('  AI interact skip:', e.message?.slice(0, 80));
}

// Theme water top (after analysis)
await page.keyboard.press('Escape').catch(() => {});
await page.evaluate(() => window.scrollTo(0, 0));
await sleep(400);
await shot(page, 'm-04-theme-water');

console.log('=== 3. Wood chart theme ===');
await page.goto(WOOD, { waitUntil: 'domcontentloaded', timeout: 90000 });
await sleep(3000);
await waitResult(page);
await page.evaluate(() => window.scrollTo(0, 0));
await sleep(600);
await shot(page, 'm-05-theme-wood');
await scrollToText(page, ['Cách Cục', 'Dụng Thần']);
await sleep(600);
await shot(page, 'm-05b-wood-dungthan');

console.log('=== 4. Web corpus (mobile browser) ===');
await page.goto(`${APP}/kinh/index.html`, { waitUntil: 'domcontentloaded', timeout: 90000 });
await sleep(1500);
await shot(page, 'm-02-library-web-index');
await page.goto(`${APP}/kinh/dao-duc-kinh.html`, { waitUntil: 'domcontentloaded', timeout: 90000 });
await sleep(1000);
await shot(page, 'm-02b-dao-duc-kinh');

await browser.close();

// ---- Promote best captures into public/review-shots with stable names ----
const promote = {
  '01-bazi-chart.png': 'm-01-bazi-overview.png',
  '02-library.png': 'm-02-library-web-index.png',
  '02b-dao-duc-kinh.png': 'm-02b-dao-duc-kinh.png',
  '03-ai-chat.png': 'm-03-ai-panel.png',
  '04-theme-water.png': 'm-04-theme-water.png',
  '05-theme-wood.png': 'm-05-theme-wood.png',
  '06-ai-answer.png': 'm-06-ai-answer.png',
  '07-pillars.png': 'm-07-pillars.png',
  '08-pattern-dungthan.png': 'm-08-pattern-dungthan.png',
  '10-today.png': 'm-10-today.png',
  '11-future.png': 'm-11-future.png',
  '12-fengshui.png': 'm-12-fengshui.png',
  '13-divination.png': 'm-13-divination.png',
  '14-library-inapp.png': 'm-14b-library-open.png',
  '14-library-gate.png': 'm-14-library-gate.png',
  '15-dung-than.png': 'm-08-pattern-dungthan.png',
  '16-wood-dungthan.png': 'm-05b-wood-dungthan.png',
  '13b-divination-result.png': 'm-13b-divination-result.png',
};

const report = [];
for (const [dest, src] of Object.entries(promote)) {
  const from = resolve(TMP, src);
  const to = resolve(OUT, dest);
  try {
    copyFileSync(from, to);
    const info = pngInfo(to);
    const ok = info.h > info.w && info.w >= 350 && info.w <= 900 && info.kb > 40;
    report.push({ dest, ...info, ok, note: ok ? 'PASS' : 'WEAK' });
    console.log(`${ok ? 'PROMOTE' : 'WEAK   '} ${dest} <- ${src}  ${info.w}x${info.h} ${info.kb}KB`);
  } catch (e) {
    report.push({ dest, ok: false, note: 'MISSING: ' + src });
    console.log('MISSING', dest, src);
  }
}

// Also keep full capture set under review-shots/mobile/
const MOB = resolve(OUT, 'mobile');
mkdirSync(MOB, { recursive: true });
for (const f of readdirSync(TMP).filter((x) => x.endsWith('.png'))) {
  copyFileSync(resolve(TMP, f), resolve(MOB, f));
}

writeFileSync(resolve(TMP, 'report.json'), JSON.stringify(report, null, 2));
console.log('\nDone. Review _tmp/mobile-capture + public/review-shots');
