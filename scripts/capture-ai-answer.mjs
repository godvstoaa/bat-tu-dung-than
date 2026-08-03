/**
 * Actively open AI chat, ask a truth-telling question, wait for full answer, screenshot.
 * Output: public/review-shots/06-ai-answer.png + 03-ai-chat.png (mobile)
 */
import { chromium, devices } from 'playwright';
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT = resolve('public/review-shots');
const TMP = resolve('_tmp/mobile-capture');
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const APP = process.env.APP_URL || 'https://battu.god8.shop';
const CHART = `${APP}/?dob=1990-06-15&time=10:00&g=nam`;
const QUESTION =
  'Năm nay (2026) có xấu không? Nói thẳng theo lá số của tôi — Dụng Thần, đại vận, lưu niên. Đừng an ủi generic. Nếu hung thì nói hung + lý do + cách xử.';

function pngInfo(p) {
  const b = readFileSync(p);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), kb: Math.round(b.length / 1024) };
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: devices['iPhone 14 Pro'].userAgent,
});
const page = await ctx.newPage();
page.setDefaultTimeout(20000);

console.log('1) Open chart URL…');
await page.goto(CHART, { waitUntil: 'domcontentloaded', timeout: 90000 });
await sleep(2500);

// Ensure analysis
const luan = page.locator('#birth-form button[type="submit"], button:has-text("Luận giải")').first();
if (await luan.isVisible().catch(() => false)) {
  const t = await luan.innerText().catch(() => '');
  if (!/Đang/.test(t)) {
    console.log('2) Click Luận giải…');
    await luan.click();
  }
}

// Wait for result
for (let i = 0; i < 60; i++) {
  const ready = await page.evaluate(() => {
    const t = document.body.innerText || '';
    return /Tóm tắt\s*&\s*Cốt lõi/.test(t) && t.length > 4000 && !/Đang luận giải/.test(t);
  });
  if (ready) {
    console.log('   analysis ready at t+', i);
    break;
  }
  await sleep(500);
}
await sleep(1500);

// Open AI popup via fab
console.log('3) Open AI FAB…');
const fab = page.locator('#ai-fab');
await fab.waitFor({ state: 'visible', timeout: 15000 });
await fab.click();
await sleep(1200);

// Ensure popup visible
const popup = page.locator('#ai-popup');
await popup.waitFor({ state: 'visible', timeout: 10000 });
// Remove hidden class if stuck
await page.evaluate(() => {
  const p = document.getElementById('ai-popup');
  if (p) p.classList.remove('hidden');
});
await sleep(500);

// Prefer truth-telling style
await page.evaluate(() => {
  const bar = document.getElementById('ai-style');
  if (!bar) return;
  const btn = bar.querySelector('[data-style="chuyen-gia"]') || bar.querySelector('[data-style="can-bang"]');
  if (btn) btn.click();
});

// Clear prior chat if button works
const clearBtn = page.locator('#ai-chat-clear');
if (await clearBtn.isVisible().catch(() => false)) {
  await clearBtn.click().catch(() => {});
  await sleep(400);
}

// Snapshot empty/open panel
await page.locator('#ai-popup').screenshot({ path: resolve(TMP, 'ai-panel-open.png') });
console.log('   panel open shot');

// Type question into #question (must be inside popup)
console.log('4) Ask:', QUESTION.slice(0, 60) + '…');
const input = page.locator('#question');
await input.waitFor({ state: 'visible', timeout: 10000 });
await input.click({ force: true });
await input.fill('');
await input.fill(QUESTION);
await sleep(300);

// Click Hỏi
const askBtn = page.locator('#ask-btn');
await askBtn.click();
console.log('5) Waiting for answer stream…');

// Wait until not "Đang luân giải" / streaming finishes
// ask-btn becomes "Dừng" while busy then back to "Hỏi"
let answerText = '';
let lastLen = 0;
let stable = 0;
for (let i = 0; i < 90; i++) {
  await sleep(1000);
  const state = await page.evaluate(() => {
    const log = document.getElementById('chat-log');
    const btn = document.getElementById('ask-btn');
    const msgs = log ? Array.from(log.querySelectorAll('.msg, .chat-msg, [class*="msg"]')) : [];
    // collect assistant messages
    const allText = log ? log.innerText || '' : '';
    const streaming = !!(log && log.querySelector('.streaming'));
    const btnLabel = btn ? btn.textContent || '' : '';
    return {
      allText,
      len: allText.length,
      streaming,
      btnLabel,
      msgCount: msgs.length,
    };
  });

  if (i % 5 === 0 || state.len !== lastLen) {
    console.log(`   t+${i}s len=${state.len} streaming=${state.streaming} btn="${state.btnLabel}" msgs=${state.msgCount}`);
  }

  // mid-stream screenshots for safety
  if (i === 8 || i === 15) {
    await page.locator('#ai-popup').screenshot({ path: resolve(TMP, `ai-stream-t${i}.png`) });
  }

  if (state.len > lastLen) {
    lastLen = state.len;
    stable = 0;
  } else if (state.len > 200 && !state.streaming && !/Dừng|⏹/.test(state.btnLabel)) {
    stable++;
  }

  // success: substantial answer and not streaming
  if (state.len > 400 && !state.streaming && !/Dừng|⏹/.test(state.btnLabel) && stable >= 2) {
    answerText = state.allText;
    console.log('6) Answer settled, len=', state.len);
    break;
  }

  // still "Đang luân giải…" alone — keep waiting
  if (i === 89) {
    answerText = state.allText;
    console.log('6) Timeout — capture whatever we have, len=', state.len);
  }
}

// Scroll chat to show answer top
await page.evaluate(() => {
  const log = document.getElementById('chat-log');
  if (log) log.scrollTop = 0;
});
await sleep(400);

// Full popup shot
const shotPath = resolve(TMP, 'ai-answer-final.png');
await page.locator('#ai-popup').screenshot({ path: shotPath });
console.log('7) Popup screenshot', pngInfo(shotPath));

// Also full phone viewport with popup open
await page.screenshot({ path: resolve(TMP, 'ai-answer-viewport.png'), animations: 'disabled' });
console.log('   viewport', pngInfo(resolve(TMP, 'ai-answer-viewport.png')));

// Scroll mid-answer if long
await page.evaluate(() => {
  const log = document.getElementById('chat-log');
  if (log) log.scrollTop = Math.min(400, log.scrollHeight);
});
await sleep(300);
await page.locator('#ai-popup').screenshot({ path: resolve(TMP, 'ai-answer-mid.png') });

// Extract answer for report
const report = await page.evaluate(() => {
  const log = document.getElementById('chat-log');
  return {
    text: (log && log.innerText) || '',
    htmlLen: log ? log.innerHTML.length : 0,
  };
});
writeFileSync(resolve(TMP, 'ai-answer-text.txt'), report.text, 'utf8');
console.log('--- answer preview ---');
console.log(report.text.slice(0, 600));
console.log('--- end preview ---');

// Promote best to review-shots
// Prefer popup crop if it has content; else viewport
const candidates = [
  resolve(TMP, 'ai-answer-final.png'),
  resolve(TMP, 'ai-answer-mid.png'),
  resolve(TMP, 'ai-answer-viewport.png'),
  resolve(TMP, 'ai-stream-t15.png'),
  resolve(TMP, 'ai-stream-t8.png'),
];
let best = null;
for (const c of candidates) {
  try {
    const info = pngInfo(c);
    if (info.kb < 20) continue;
    if (!best || info.kb > best.kb) best = { c, ...info };
  } catch {
    /* skip */
  }
}

if (!best || report.text.length < 150) {
  console.error('FAIL: no substantial AI answer captured. textLen=', report.text.length);
  await browser.close();
  process.exit(1);
}

// Use viewport for evidence (shows phone chrome + chart behind) if answer visible
// Prefer full viewport with open chat for Apple review context
const viewport = resolve(TMP, 'ai-answer-viewport.png');
const finalSrc = pngInfo(viewport).kb > 40 ? viewport : best.c;
copyFileSync(finalSrc, resolve(OUT, '06-ai-answer.png'));
// Also update 03 if panel-only is weaker
copyFileSync(finalSrc, resolve(OUT, '03-ai-chat.png'));
console.log('PROMOTE 06-ai-answer.png + 03-ai-chat.png <-', finalSrc, pngInfo(finalSrc));

// Save popup-only as bonus
copyFileSync(shotPath, resolve(OUT, '06b-ai-popup-only.png'));

await browser.close();
console.log('DONE. Answer chars:', report.text.length);
