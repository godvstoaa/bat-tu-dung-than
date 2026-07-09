/**
 * Committed gate: Eastern redesign + Dụng Thần theme wiring.
 * Reads shipped src/style.css, src/main.js, src/bg-particles.js — no mocks.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const css = fs.readFileSync(path.join(ROOT, 'src/style.css'), 'utf8');
const main = fs.readFileSync(path.join(ROOT, 'src/main.js'), 'utf8');
const particles = fs.readFileSync(path.join(ROOT, 'src/bg-particles.js'), 'utf8');
const THEMES = ['木', '火', '土', '金', '水'];

for (const t of THEMES) {
  assert.match(css, new RegExp(`body\\.theme-${t}\\s*\\{`), `missing body.theme-${t}`);
  const m = css.match(new RegExp(`body\\.theme-${t}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'));
  assert.ok(m, `block theme-${t}`);
  assert.match(m[1], /--gold\s*:/, `theme-${t} --gold`);
  assert.match(m[1], /--ink-black\s*:/, `theme-${t} --ink-black`);
  const gold = (m[1].match(/--gold\s*:\s*([^;]+)/) || [])[1] || '';
  assert.ok(!/#4caf50|#ff5252|#2196f3|#ff5722/i.test(gold), `theme-${t} neon gold rejected: ${gold}`);
  assert.ok(css.includes(`body.theme-${t} .bg-glow`), `theme-${t} .bg-glow`);
}

// apply path uses yong primary
assert.match(main, /yong\?\.primary/, 'uses yong.primary');
assert.match(main, /className\.replace\(\/theme-\[\^ \]\+\/g/, 'strips old theme-*');
assert.match(main, /classList\.add\(['"]theme-['"]\s*\+\s*_dungWx\)/, 'adds theme-+primary');

// particles read body theme class
assert.ok(particles.includes('theme-(木|火|土|金|水)'), 'particles readTheme');

// explore panel must not use dark --ink as text
assert.ok(!/wx-exp-mean[^{]*\{[^}]*color:\s*var\(--ink\b/.test(css), 'wx-exp-mean not --ink text');

// foil titles / hard overrides use tokens not fixed Material gold only
assert.match(css, /--gold-pale/, 'token --gold-pale present');
assert.match(css, /--theme-wash-a/, 'theme wash hooks present');

console.log('✓ test-eastern-theme: all gates passed');
