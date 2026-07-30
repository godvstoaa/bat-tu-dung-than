import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUT_DIR = 'appstore-shots';
const RAW_DIR = path.join(OUT_DIR, 'raw');
const BASE_URL = 'https://battu.god8.shop';

const IPHONE = {
  ...devices['iPhone 14 Pro Max'],
  viewport: { width: 430, height: 932 },
  deviceScaleFactor: 3,
  locale: 'vi-VN',
  isMobile: true,
  hasTouch: true,
};

fs.mkdirSync(RAW_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const shotResults = {};

async function waitQuiet(page, ms = 1200) {
  try {
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  } catch {
    /* ignore */
  }
  await page.waitForTimeout(ms);
}

async function shot(page, name) {
  try {
    console.log(`[shot] capturing ${name}...`);
    await waitQuiet(page, 1200);
    const filePath = path.join(RAW_DIR, `${name}.png`);
    await page.screenshot({ path: filePath, fullPage: false });
    shotResults[name] = true;
    console.log(`[shot] ok → ${filePath}`);
  } catch (err) {
    shotResults[name] = false;
    console.log(`[shot] FAIL ${name}: ${err?.message || err}`);
  }
}

async function logVisibleActions(page, label) {
  try {
    const items = await page.evaluate(() => {
      const els = [
        ...document.querySelectorAll('button, a, [role="button"], input[type="submit"]'),
      ];
      return els
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return (
            r.width > 0 &&
            r.height > 0 &&
            style.visibility !== 'hidden' &&
            style.display !== 'none' &&
            style.opacity !== '0'
          );
        })
        .map((el) => {
          const text = (el.innerText || el.textContent || el.value || el.getAttribute('aria-label') || '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 80);
          return { tag: el.tagName.toLowerCase(), text };
        })
        .filter((x) => x.text);
    });
    console.log(`[nav:${label}] visible actions (${items.length}):`);
    for (const it of items.slice(0, 40)) {
      console.log(`  <${it.tag}> ${it.text}`);
    }
  } catch (err) {
    console.log(`[nav:${label}] could not list actions: ${err?.message || err}`);
  }
}

async function clickByText(page, pattern, label) {
  try {
    const clicked = await page.evaluate((source) => {
      const re = new RegExp(source, 'i');
      const els = [
        ...document.querySelectorAll('button, a, [role="button"], input[type="submit"], label, div, span'),
      ];
      const visible = els.filter((el) => {
        const r = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return (
          r.width > 0 &&
          r.height > 0 &&
          style.visibility !== 'hidden' &&
          style.display !== 'none' &&
          style.opacity !== '0'
        );
      });
      for (const el of visible) {
        const text = (el.innerText || el.textContent || el.value || el.getAttribute('aria-label') || '')
          .replace(/\s+/g, ' ')
          .trim();
        if (text && re.test(text) && text.length < 120) {
          el.click();
          return text.slice(0, 80);
        }
      }
      return null;
    }, pattern.source || String(pattern));

    if (clicked) {
      console.log(`[click:${label}] matched "${clicked}"`);
      await page.waitForTimeout(1500);
      return true;
    }
    console.log(`[click:${label}] no match for ${pattern}`);
    return false;
  } catch (err) {
    console.log(`[click:${label}] error: ${err?.message || err}`);
    return false;
  }
}

async function clickFirstPrimaryButton(page) {
  try {
    const ok = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button, [role="button"], input[type="submit"]')].filter(
        (el) => {
          const r = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return (
            r.width > 0 &&
            r.height > 0 &&
            style.visibility !== 'hidden' &&
            style.display !== 'none'
          );
        },
      );
      if (!buttons.length) return null;
      const primary =
        buttons.find((b) => {
          const cls = (b.className || '').toString().toLowerCase();
          const type = (b.getAttribute('type') || '').toLowerCase();
          return (
            type === 'submit' ||
            cls.includes('primary') ||
            cls.includes('cta') ||
            cls.includes('main') ||
            cls.includes('gold')
          );
        }) || buttons[0];
      const text = (primary.innerText || primary.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      primary.click();
      return text || '(unnamed button)';
    });
    if (ok) {
      console.log(`[click:primary] clicked "${ok}"`);
      await page.waitForTimeout(1500);
      return true;
    }
    console.log('[click:primary] no button found');
    return false;
  } catch (err) {
    console.log(`[click:primary] error: ${err?.message || err}`);
    return false;
  }
}

async function fillSampleBirth(page) {
  try {
    console.log('[form] attempting to fill sample birth data...');

    // Date inputs
    const dateFilled = await page.evaluate(() => {
      const dateInputs = [
        ...document.querySelectorAll('input[type="date"], input[name*="date" i], input[id*="date" i], input[placeholder*="ngày" i], input[placeholder*="sinh" i]'),
      ];
      let n = 0;
      for (const el of dateInputs) {
        try {
          el.focus();
          el.value = '1990-01-15';
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          n++;
        } catch {
          /* ignore */
        }
      }
      return n;
    });
    console.log(`[form] date inputs filled: ${dateFilled}`);

    // Time inputs
    const timeFilled = await page.evaluate(() => {
      const timeInputs = [
        ...document.querySelectorAll('input[type="time"], input[name*="time" i], input[id*="time" i], input[name*="gio" i], input[placeholder*="giờ" i]'),
      ];
      let n = 0;
      for (const el of timeInputs) {
        try {
          el.focus();
          el.value = '12:00';
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          n++;
        } catch {
          /* ignore */
        }
      }
      return n;
    });
    console.log(`[form] time inputs filled: ${timeFilled}`);

    // Generic text/number fields that look like birth-related
    await page.evaluate(() => {
      const fields = [...document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea')];
      for (const el of fields) {
        const hint = `${el.name || ''} ${el.id || ''} ${el.placeholder || ''} ${el.getAttribute('aria-label') || ''}`.toLowerCase();
        try {
          if (el.tagName === 'SELECT') {
            const opts = [...el.options];
            const nam = opts.find((o) => /nam/i.test(o.text) && !/nữ|nu/i.test(o.text));
            if (nam) {
              el.value = nam.value;
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }
            continue;
          }
          if (/year|năm|nam sinh/.test(hint) && !el.value) {
            el.value = '1990';
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          } else if (/month|tháng/.test(hint) && !el.value) {
            el.value = '1';
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          } else if (/day|ngày|ngay/.test(hint) && !/tháng/.test(hint) && !el.value) {
            el.value = '15';
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          } else if (/hour|giờ|gio/.test(hint) && !el.value) {
            el.value = '12';
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          } else if (/minute|phút|phut/.test(hint) && !el.value) {
            el.value = '0';
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          } else if (el.type === 'date' && !el.value) {
            el.value = '1990-01-15';
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          } else if (el.type === 'time' && !el.value) {
            el.value = '12:00';
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } catch {
          /* ignore */
        }
      }
    });

    // Gender: radio / select / button "Nam"
    const genderOk = await page.evaluate(() => {
      // radios
      const radios = [...document.querySelectorAll('input[type="radio"]')];
      for (const r of radios) {
        const label =
          (r.labels && r.labels[0] && r.labels[0].innerText) ||
          r.value ||
          r.getAttribute('aria-label') ||
          '';
        if (/^nam$/i.test(label.trim()) || /^nam$/i.test((r.value || '').trim())) {
          r.click();
          return `radio:${label || r.value}`;
        }
      }
      // select options
      for (const sel of document.querySelectorAll('select')) {
        const opt = [...sel.options].find((o) => /^nam$/i.test(o.text.trim()) || /nam/i.test(o.text));
        if (opt && !/nữ|nu/i.test(opt.text)) {
          sel.value = opt.value;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
          return `select:${opt.text}`;
        }
      }
      // clickable gender pills/buttons
      const els = [...document.querySelectorAll('button, label, [role="button"], span, div')];
      for (const el of els) {
        const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
        if (/^nam$/i.test(text)) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            el.click();
            return `click:${text}`;
          }
        }
      }
      return null;
    });
    console.log(`[form] gender: ${genderOk || 'not found (ok)'}`);

    await page.waitForTimeout(800);
  } catch (err) {
    console.log(`[form] fill error (continuing): ${err?.message || err}`);
  }
}

async function runPrimaryAction(page) {
  const matched = await clickByText(
    page,
    /luận|tính|xem|bắt đầu|phân tích|giải|tạo|tra|khám/i,
    'primary-action',
  );
  if (!matched) {
    await clickFirstPrimaryButton(page);
  }
  await waitQuiet(page, 2500);
}

async function goLibrary(page) {
  await logVisibleActions(page, 'before-library');
  const ok = await clickByText(page, /thư viện|kinh|đạo tạng|1523|kinh điển|sách/i, 'library');
  if (!ok) {
    // try nav links more loosely
    await clickByText(page, /thư|viện|library/i, 'library-loose');
  }
  await waitQuiet(page, 2000);
}

async function goAiChat(page) {
  await logVisibleActions(page, 'before-ai');
  const ok = await clickByText(page, /luận giải|hỏi|ai|chat|trò chuyện|hỏi đáp/i, 'ai-chat');
  if (!ok) {
    await clickByText(page, /luận|giải|chatbot|assistant/i, 'ai-loose');
  }
  await waitQuiet(page, 2000);
}

async function openFirstLibraryItem(page) {
  try {
    const clicked = await page.evaluate(() => {
      const candidates = [
        ...document.querySelectorAll('a, button, [role="listitem"], li, article, .card, [class*="item"], [class*="card"]'),
      ];
      for (const el of candidates) {
        const r = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (r.width < 40 || r.height < 20) continue;
        if (style.visibility === 'hidden' || style.display === 'none') continue;
        // skip pure nav chrome
        const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!text || text.length < 2) continue;
        if (/^(home|trang chủ|back|quay lại)$/i.test(text)) continue;
        // prefer items that look like list entries
        if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.closest('ul, ol, [role="list"]') || text.length > 4) {
          el.click();
          return text.slice(0, 80);
        }
      }
      return null;
    });
    if (clicked) {
      console.log(`[library-detail] opened "${clicked}"`);
      await waitQuiet(page, 2000);
      return true;
    }
    console.log('[library-detail] no list item found');
    return false;
  } catch (err) {
    console.log(`[library-detail] error: ${err?.message || err}`);
    return false;
  }
}

// ── Screenshots flow ──────────────────────────────────────────────
console.log('=== App Store assets: screenshots ===');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  ...IPHONE,
  locale: 'vi-VN',
});
const page = await context.newPage();

try {
  console.log(`[nav] goto ${BASE_URL}`);
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitQuiet(page, 2000);
  await logVisibleActions(page, 'home');
  await shot(page, '01-home');

  await fillSampleBirth(page);
  await shot(page, '02-form-filled');

  await logVisibleActions(page, 'before-primary');
  await runPrimaryAction(page);
  await logVisibleActions(page, 'after-primary');
  await shot(page, '03-loading-or-result');

  // AI chat
  try {
    await goAiChat(page);
  } catch (e) {
    console.log(`[ai] skip: ${e?.message || e}`);
  }
  await shot(page, '04-ai-chat');

  // Library — go home first if needed, then library
  try {
    // Prefer navigating fresh or via nav
    const libOk = await clickByText(page, /thư viện|kinh|đạo tạng|1523/i, 'library-nav');
    if (!libOk) {
      // try home then library
      await clickByText(page, /trang chủ|home|bát tự|luận mệnh/i, 'home-nav');
      await page.waitForTimeout(1500);
      await goLibrary(page);
    } else {
      await waitQuiet(page, 2000);
    }
  } catch (e) {
    console.log(`[library] skip: ${e?.message || e}`);
  }
  await logVisibleActions(page, 'library');
  await shot(page, '05-library');

  try {
    await openFirstLibraryItem(page);
  } catch (e) {
    console.log(`[detail] skip: ${e?.message || e}`);
  }
  await shot(page, '06-detail');
} catch (err) {
  console.log(`[screenshots] unexpected error: ${err?.message || err}`);
} finally {
  await context.close();
}

// ── Preview video flow ────────────────────────────────────────────
console.log('=== App Store assets: preview video ===');
let videoPath = null;
const videoContext = await browser.newContext({
  ...IPHONE,
  locale: 'vi-VN',
  recordVideo: {
    dir: OUT_DIR,
    size: { width: 1290, height: 2796 },
  },
});
const vPage = await videoContext.newPage();

try {
  console.log(`[video] goto ${BASE_URL}`);
  await vPage.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await vPage.waitForTimeout(2500);

  await fillSampleBirth(vPage);
  await vPage.waitForTimeout(2500);

  await runPrimaryAction(vPage);
  await vPage.waitForTimeout(4000);

  // Optional: AI
  try {
    await goAiChat(vPage);
    await vPage.waitForTimeout(2500);
  } catch {
    /* optional */
  }

  // Optional: library
  try {
    await goLibrary(vPage);
    await vPage.waitForTimeout(2500);
    await openFirstLibraryItem(vPage);
    await vPage.waitForTimeout(2500);
  } catch {
    /* optional */
  }

  // Hold final frame
  await vPage.waitForTimeout(2000);
} catch (err) {
  console.log(`[video] flow error (will still save): ${err?.message || err}`);
} finally {
  try {
    const vid = vPage.video();
    await videoContext.close();
    if (vid) {
      videoPath = await vid.path();
      console.log(`[video] saved → ${videoPath}`);
    }
  } catch (err) {
    console.log(`[video] close/path error: ${err?.message || err}`);
  }
}

await browser.close();

// ── Summary ───────────────────────────────────────────────────────
console.log('\n========== SUMMARY ==========');
const names = [
  '01-home',
  '02-form-filled',
  '03-loading-or-result',
  '04-ai-chat',
  '05-library',
  '06-detail',
];
for (const n of names) {
  const ok = shotResults[n];
  const status = ok === true ? 'OK' : ok === false ? 'FAIL' : 'SKIP';
  console.log(`  screenshot ${n}: ${status}`);
}
console.log(`  video: ${videoPath || '(none)'}`);
console.log(`  raw dir: ${path.resolve(RAW_DIR)}`);
console.log('=============================');
