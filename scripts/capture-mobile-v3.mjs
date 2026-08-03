import { chromium, devices } from 'playwright';
import { readFileSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
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

async function shot(name) {
  const path = resolve('_tmp/mobile-capture', `${name}.png`);
  await page.screenshot({ path, animations: 'disabled' });
  const b = readFileSync(path);
  console.log(name, Math.round(b.length / 1024) + 'KB', b.readUInt32BE(16) + 'x' + b.readUInt32BE(20));
  return path;
}

await page.goto('https://battu.god8.shop/?dob=1990-06-15&time=10:00&g=nam', {
  waitUntil: 'domcontentloaded',
  timeout: 90000,
});
await sleep(2000);
const btn = page.locator('button:has-text("Luận giải")').first();
if (await btn.isVisible().catch(() => false)) {
  const t = await btn.innerText();
  if (!/Đang/.test(t)) await btn.click();
}
for (let i = 0; i < 50; i++) {
  const ok = await page.evaluate(() => /Tóm tắt & Cốt lõi/.test(document.body.innerText || ''));
  if (ok) break;
  await sleep(400);
}
await sleep(1500);

// ---- pillars: find Niên/Nguyệt/Nhật/Thời ----
const pillarHit = await page.evaluate(() => {
  const markers = ['Niên trụ', 'Nguyệt trụ', 'Nhật trụ', 'Thời trụ', 'Trụ Năm', 'Trụ Ngày', '四柱排盘', 'Bảng tứ trụ', 'Thiên can'];
  const all = Array.from(document.querySelectorAll('h2,h3,h4,.card-title,.grp,th,td,div,span,button'));
  for (const m of markers) {
    const el = all.find((e) => {
      const t = (e.textContent || '').replace(/\s+/g, ' ').trim();
      return t.includes(m) && t.length < 60 && e.offsetParent !== null;
    });
    if (el) {
      el.scrollIntoView({ block: 'center' });
      return m;
    }
  }
  // fallback: search body for 庚/辛 day master near grid
  const body = document.body.innerText || '';
  return { fail: true, hasCanChi: /Can Chi|Thiên can|Địa chi/.test(body), snippet: body.match(/.{0,20}(trụ|Trụ|柱).{0,20}/g)?.slice(0, 8) };
});
console.log('pillarHit', pillarHit);
await sleep(700);
await shot('v3-pillars');

// also try scrolling progressively looking for 4-column pillar UI
for (const y of [600, 1200, 1800, 2400, 3000]) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await sleep(300);
}
// find element with 4 short Chinese stems
const p2 = await page.evaluate(() => {
  const cards = Array.from(document.querySelectorAll('div,section,table'));
  for (const c of cards) {
    const t = c.innerText || '';
    if ((t.match(/[甲乙丙丁戊己庚辛壬癸]/g) || []).length >= 4 && t.length < 400) {
      c.scrollIntoView({ block: 'center' });
      return t.slice(0, 120);
    }
  }
  return null;
});
console.log('pillar grid', p2);
await sleep(500);
await shot('v3-pillars-b');

// ---- feng shui ----
await page.evaluate(() => {
  const el = Array.from(document.querySelectorAll('h2,h3,.card-title,.grp,button,a,[role="tab"]')).find((e) =>
    /Phong thủy|Phong Thủy/.test((e.textContent || '').trim()) && (e.textContent || '').length < 40,
  );
  if (el) {
    el.scrollIntoView({ block: 'start' });
    try {
      el.click();
    } catch {
      /* ignore */
    }
  }
});
await sleep(1500);
await shot('v3-fengshui');

// ---- library ----
await page.evaluate(() => {
  const el = Array.from(document.querySelectorAll('h2,h3,.card-title,.grp')).find((e) => /Thư viện Huyền học/.test(e.textContent || ''));
  if (el) el.scrollIntoView({ block: 'start' });
});
await sleep(1000);
const gate = page.locator('button:has-text("Tôi đã hiểu")');
if ((await gate.count()) && (await gate.first().isVisible().catch(() => false))) {
  console.log('clicking gate');
  await gate.first().click();
  await sleep(2000);
}
await shot('v3-library-inapp');
await page.evaluate(() => window.scrollBy(0, 400));
await sleep(500);
await shot('v3-library-inapp-b');

// ---- AI ----
const fab = page.locator('button:has-text("Nghịch Thiên")').first();
if (await fab.isVisible().catch(() => false)) {
  await fab.click();
  await sleep(2500);
  await shot('v3-ai-open');
  const inputs = page.locator('textarea, input[type="text"]');
  const n = await inputs.count();
  console.log('inputs', n);
  for (let i = 0; i < n; i++) {
    const el = inputs.nth(i);
    if (await el.isVisible().catch(() => false)) {
      await el.click({ force: true });
      await el.fill('Năm nay xấu không? Nói thẳng theo lá số, đừng an ủi generic.');
      console.log('filled input', i);
      break;
    }
  }
  await sleep(400);
  const send = page.locator('button:has-text("Hỏi")').first();
  if (await send.isVisible().catch(() => false)) {
    await send.click();
    console.log('AI sent');
    for (let i = 0; i < 30; i++) {
      await sleep(1000);
      if (i % 5 === 0) console.log('wait', i);
    }
  }
  await shot('v3-ai-answer');
}

await browser.close();
console.log('v3 done');
