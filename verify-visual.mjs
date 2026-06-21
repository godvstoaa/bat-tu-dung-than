// Verify trực quan + console (taste-skill). Tự chạy: node verify-visual.mjs
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const PORT = 4178;
const SHOTS = 'verify-shots';
await mkdir(SHOTS, { recursive: true });

// ---- khởi dev server (giống `npm run dev`) ----
const server = await createServer({
  server: { port: PORT, host: '127.0.0.1' },
  logLevel: 'warn',
});
await server.listen();
const BASE = server.resolvedUrls.local[0];
console.log('dev server:', BASE);

const consoleMsgs = [];
const pageErrors = [];
const browser = await chromium.launch();
const mkPage = async (opts = {}) => {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
    ...opts,
  });
  const page = await ctx.newPage();
  page.on('console', (m) => consoleMsgs.push({ type: m.type(), text: m.text() }));
  page.on('pageerror', (e) => pageErrors.push(e.message));
  return { ctx, page };
};

// ---- 1. load ban đầu ----
const { ctx: c1, page: p1 } = await mkPage();
await p1.goto(BASE, { waitUntil: 'networkidle' });
await p1.waitForSelector('#result.reveal-run', { timeout: 10000 });
await p1.waitForSelector('.wx-fill', { timeout: 10000 });
await p1.waitForTimeout(1300); // chờ stagger + bar fill chạy xong
await p1.screenshot({ path: `${SHOTS}/00-hero.png` }); // viewport đầu trang — hero bát quái
await p1.screenshot({ path: `${SHOTS}/01-initial-full.png`, fullPage: true });

const widths = await p1.$$eval('.wx-fill', (els) => els.map((e) => e.getBoundingClientRect().width));
const anyFilled = widths.length > 0 && widths.some((w) => w > 5);
const hasReveal = (await p1.locator('#result.reveal-run').count()) > 0;

// ---- 2. hover 1 card ----
await p1.locator('#result > .card').first().hover();
await p1.waitForTimeout(450);
await p1.screenshot({ path: `${SHOTS}/02-card-hover.png` });

// ---- 3. bấm "Luận giải" lại → entrance phải phát lại ----
await p1.locator('#date').fill('1990-06-15');
await p1.locator('#time').fill('14:30');
await p1.locator('button.btn-primary[type=submit]').click();
await p1.waitForTimeout(140); // giữa stagger → đo opacity chứng minh entrance đang phát lại
const opacities = await p1.$$eval('#result > .card', (els) => els.map((e) => +getComputedStyle(e).opacity));
await p1.screenshot({ path: `${SHOTS}/07-replay-mid-stagger.png` });
await p1.waitForTimeout(1000);
await p1.screenshot({ path: `${SHOTS}/03-rerun-after-submit.png`, fullPage: true });

// ---- 4. mở modal cài đặt AI ----
await p1.locator('#ai-settings-btn').click();
await p1.waitForSelector('#ai-modal:not(.hidden)', { timeout: 5000 });
await p1.waitForTimeout(650);
await p1.screenshot({ path: `${SHOTS}/04-ai-modal.png` });
await p1.locator('#cfg-cancel').click();
await c1.close();

// ---- 5. prefers-reduced-motion ----
const { ctx: c5, page: p5 } = await mkPage({ reducedMotion: 'reduce' });
await p5.goto(BASE, { waitUntil: 'networkidle' });
await p5.waitForSelector('#result.reveal-run', { timeout: 10000 });
await p5.waitForTimeout(700);
await p5.screenshot({ path: `${SHOTS}/05-reduced-motion.png`, fullPage: true });
await c5.close();

// ---- 6. mobile 390x844 ----
const { ctx: c6, page: p6 } = await mkPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await p6.goto(BASE, { waitUntil: 'networkidle' });
await p6.waitForSelector('#result.reveal-run', { timeout: 10000 });
await p6.waitForTimeout(1300);
await p6.screenshot({ path: `${SHOTS}/06-mobile.png`, fullPage: true });
await c6.close();

await browser.close();
await server.close();

// ---- report ----
const errors = consoleMsgs.filter((m) => m.type === 'error');
const warnings = consoleMsgs.filter((m) => m.type === 'warning');
console.log('\n================ VISUAL VERIFY REPORT ================');
console.log('reveal-run gắn trên #result :', hasReveal ? 'YES' : 'NO');
console.log('bar Ngũ Hành render        :', widths.length, '| có bar fill (w>5px):', anyFilled ? 'YES' : 'NO');
console.log('replay opacity @140ms      :', opacities.map((o) => o.toFixed(2)).join(' '), '| đang stagger (có opacity<1):', opacities.some((o) => o < 0.99) ? 'YES' : 'NO');
console.log('width bar cao nhất (px)    :', widths.length ? Math.round(Math.max(...widths)) : 0);
console.log('console errors             :', errors.length);
errors.slice(0, 10).forEach((e) => console.log('   ERR:', e.text));
console.log('console warnings           :', warnings.length);
warnings.slice(0, 10).forEach((w) => console.log('   WARN:', w.text));
console.log('pageerror (uncaught throw) :', pageErrors.length);
pageErrors.slice(0, 10).forEach((e) => console.log('   PAGEERR:', e));
console.log('screenshots -> ./' + SHOTS + '/ (01..06)');
console.log('======================================================');
process.exit(0);
