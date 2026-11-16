#!/usr/bin/env node
// ============================================================================
//  SINH PHỤ LỤC BỘ THIẾT KẾ GAME TỪ MÃ NGUỒN  →  docs/game/phu-luc/A1…A7
//  (docs/GAME-THIET-KE-MANIFEST.md §2.3: bảng số liệu chỉ có MỘT nguồn là mã; tài liệu
//   không chép tay bảng số, chỉ dẫn về các phụ lục này.)
//    node scripts/docs-game-gen.mjs           ghi 7 tệp phụ lục
//    node scripts/docs-game-gen.mjs --check   không ghi; thoát mã 1 nếu phụ lục đã cũ so với mã
//  Thuần Node: không cần máy chủ, không cần trình duyệt. Chỉ ĐỌC mã game.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = 'docs/game/phu-luc';
const CHECK = process.argv.includes('--check');
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const ls = (p) => fs.readdirSync(path.join(ROOT, p)).sort();
const G = (f) => import(pathToFileURL(path.join(ROOT, 'src/game', f)).href);
const head = (title) => `<!-- TỆP SINH TỰ ĐỘNG bởi scripts/docs-game-gen.mjs — KHÔNG SỬA TAY. Sinh lại: node scripts/docs-game-gen.mjs -->\n# ${title}\n\n> Sinh từ mã nguồn. Khi một con số ở chương khác lệch với tệp này thì **tệp này (tức là mã đang chạy) thắng** và chương kia phải sửa.\n\n`;

// ---------- dựng bảng markdown ----------
const esc = (s) => String(s).replace(/\|/g, '¦').replace(/\r?\n/g, ' ').replace(/</g, '&lt;');
const cell = (v, n = 90) => {
  if (v == null) return '';
  if (typeof v === 'function') return 'ƒ';
  if (v instanceof Set) v = [...v];
  if (v instanceof RegExp) v = String(v);
  let s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  if (s.length > n) s = s.slice(0, n) + '…';
  return esc(s);
};
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Set) && !(v instanceof Map) && !(v instanceof RegExp);
const toRows = (c) => {
  if (c instanceof Map) c = Object.fromEntries(c);
  const inner = (v) => (Array.isArray(v) ? Object.fromEntries(v.map((x, i) => ['c' + i, x])) : null);
  if (Array.isArray(c)) return c.map((v, i) => (isObj(v) ? v : inner(v) ? { '#': i + 1, ...inner(v) } : { '#': i + 1, 'giá trị': v }));
  return Object.entries(c).map(([k, v]) => (isObj(v) ? { khoá: k, ...v } : { khoá: k, 'giá trị': v }));
};
const table = (coll, { cols, max = 130, n = 90 } = {}) => {
  const rows = toRows(coll);
  if (!rows.length) return '_(rỗng)_\n';
  const keys = cols ?? [...new Set(rows.flatMap((r) => Object.keys(r)))].slice(0, 13);
  const out = ['| ' + keys.join(' | ') + ' |', '|' + keys.map(() => '---').join('|') + '|'];
  for (const r of rows.slice(0, max)) out.push('| ' + keys.map((k) => cell(r[k], n)).join(' | ') + ' |');
  if (rows.length > max) out.push(`\n_… còn ${rows.length - max} dòng (xem mã)._`);
  return out.join('\n') + '\n';
};
const kv = (pairs, n = 200) => {
  const out = ['| hằng số | giá trị |', '|---|---|'];
  for (const [k, v] of pairs) out.push(`| \`${k}\` | ${cell(v, n)} |`);
  return out.join('\n') + '\n';
};

// Một mô-đun → hằng số vô hướng (bảng 2 cột) + mỗi bảng dữ liệu một bảng markdown.
async function modSection(file, { skip = [], only, cols = {}, max = {}, force = {} } = {}) {
  let m;
  try { m = await G(file); } catch (e) { return `### \`${file}\`\n\n_(không nạp được trong Node: ${esc(String(e.message).slice(0, 90))})_\n\n`; }
  const names = (only ?? Object.keys(m)).filter((k) => !skip.includes(k) && typeof m[k] !== 'function' && m[k] !== undefined);
  const scal = [], tabs = [];
  for (const k of names) {
    const v = m[k];
    const rowsOfObj = (Array.isArray(v) && v.length > 0 && v.every(isObj)) || (isObj(v) && Object.keys(v).length > 0 && Object.values(v).every(isObj));
    const flatMap = isObj(v) && Object.keys(v).length > 3 && !Object.values(v).some(isObj);
    (rowsOfObj || flatMap || force[k] ? tabs : scal).push(k);
  }
  let s = `### \`${file}\`\n\n`;
  if (scal.length) s += kv(scal.map((k) => [k, m[k]])) + '\n';
  for (const k of tabs) {
    const v = m[k];
    const len = Array.isArray(v) ? v.length : Object.keys(v).length;
    s += `**\`${k}\`** (${len})\n\n` + table(v, { cols: cols[k], max: max[k] ?? 130, n: force[k]?.n ?? 90 }) + '\n';
  }
  return s;
}

// ---------- A1 · bản đồ mã ----------
const CH = [
  [/^(main|mount|perf|gen|gen\.worker|assets|collide|obstacles|render3d|render|world3d|terrain-mesh|lights|models|textures|ground-tex|grass|trees|forest|lotus|water3d|archkit|archkit-style|interior-build|fx-foliage)\.js$/, '30', 'Client/3D'],
  [/^(characters|accessories|effects)\.js$/, '11', 'Client/3D'],
  [/^(markup|map-ui|places-ui|audio|haptics)\.js$|^game\.css$/, '22', 'Client/UI'],
  [/^(net|protocol|account|account-ui|auth-core)\.js$/, '31', 'Backend + Client'],
  [/^(terrain|world|court|sect|batquai|batquai3d|cityblocks|cityblocks3d|citylayout|city4|citylook|cityident3d|citydress3d|innerfill|streets|landmarks|roads|canals|waterways|bridges|river3d|heaven|heaven3d|rooms|roomgrid|homes|shops|spawn|season|mansions|mansion3d|estate-layout|lifeplaces|lifeplaces3d|jobplaces|jobplaces3d|incense3d|interior)\.js$/, '10', 'Thiết kế game + Client/3D'],
  [/^(state|progress|cosmetics|wardrobe-ui|tutorial|features)\.js$/, '11', 'Thiết kế game + Client/UI'],
  [/^(stations|cases|case-ui|halls|dz-case|zheri-case|que-ui|gu-gongan|namhan|kinh-tu|vanmenh|vanmenh-ui|thaitue|master-ui|fortune-npc|fortune-ui|temples|divination|map-rating|npc-deep)\.js$/, '12', 'Thiết kế game + Nội dung'],
  [/^(coins|life|life-ui|illness)\.js$/, '13', 'Thiết kế game'],
  [/^(jobs|work|work-games|guild-core|jobzones|fatequest)\.js$/, '14', 'Thiết kế game + Backend'],
  [/^(estate|estate-core|home-edit|homefs|vehicles|items|shop-ui|shop-data)\.js$/, '15', 'Thiết kế game + Backend'],
  [/^(motion|movement|water|boats|boats3d|boat-ui|flight|flight-poses)\.js$/, '16', 'Thiết kế game + Client/3D'],
  [/^(econ-core|econ-data|econ-client|econ-ui|inventory|production|market|cuisine|venue)\.js$/, '17', 'Thiết kế game + Backend'],
  [/^(huyenhoc|realm|luanhoi|amduc)\.js$/, '18', 'Thiết kế game'],
  [/^(law|law-ui|raze|prison|prison3d)\.js$/, '19', 'Thiết kế game'],
  [/^(civil)\.js$/, '20', 'Thiết kế game + Backend'],
  [/^(npc|npc-personas|persona-data|bark-pool|story-gen|citizens|npc-chat-core|npc-chat-ui|names|crisis-ui|ai-model)\.js$/, '21', 'AI/NPC + Nội dung'],
];
const WCH = { 'index.js': ['31', 'Backend'], 'quan-room.js': ['31', 'Backend'], 'accounts.js': ['31', 'Backend'], 'auth.js': ['31', 'Backend'], 'estate.js': ['31', 'Backend'], 'guild.js': ['31', 'Backend'], 'economy.js': ['31', 'Backend'], 'npc-chat.js': ['21', 'AI/NPC + Backend'], 'llm.js': ['21', 'AI/NPC + Backend'], 'admin.js': ['32', 'Vận hành'] };
const CH_NAME = { 10: 'Thế giới', 11: 'Mệnh và nhân vật', 12: 'Bói toán và nội dung', 13: 'Đời sống', 14: 'Việc làm', 15: 'Nhà ở và phương tiện', 16: 'Di chuyển', 17: 'Sản xuất, ẩm thực, kinh doanh', 18: 'Huyền học, tu luyện, luân hồi', 19: 'Luật và hình phạt', 20: 'Xã hội', 21: 'NPC và AI', 22: 'Giao diện, điều khiển', 30: 'Kỹ thuật client', 31: 'Máy chủ, mạng, dữ liệu', 32: 'Kiểm thử, triển khai' };
const chOf = (f) => { for (const [re, ch, dept] of CH) if (re.test(f)) return [ch, dept]; return ['??', '??']; };
const headerOf = (src) => {
  const out = [];
  for (const l of src.split('\n').slice(0, 16)) {
    const m = l.match(/^\s*(?:\/\/+|\/\*+|\*)\s?(.*)$/);
    if (!m) { if (out.length) break; continue; }
    const t = m[1].replace(/={3,}/g, '').replace(/\*\/\s*$/, '').trim();
    if (t) out.push(t);
    if (out.join(' ').length > 190) break;
  }
  return out.join(' ').replace(/\s+/g, ' ').slice(0, 190);
};
const exportsOf = (src) => [...src.matchAll(/export\s+(?:async\s+)?(?:function\*?|const|let|class)\s+([A-Za-z0-9_$]+)/g)].map((x) => x[1]);
const testFiles = () => ls('scripts').filter((f) => /^test-.*\.mjs$/.test(f));
const testsByModule = () => {
  const map = {};
  for (const t of testFiles()) {
    const src = rd('scripts/' + t);
    for (const x of new Set([...src.matchAll(/(game|worker)\/([a-z0-9.-]+?\.js)/g)].map((y) => y[1] + '/' + y[2]))) (map[x] ??= []).push(t.replace(/^test-|\.mjs$/g, ''));
  }
  return map;
};

function a1() {
  const tests = testsByModule();
  const rows = [], perCh = {};
  let total = 0, unassigned = 0;
  for (const f of ls('src/game').filter((x) => /\.(js|css)$/.test(x))) {
    const src = rd('src/game/' + f); const n = src.split('\n').length; total += n;
    const [ch, dept] = chOf(f); if (ch === '??') unassigned++;
    (perCh[ch] ??= { tệp: 0, dòng: 0 }).tệp++; perCh[ch].dòng += n;
    const ex = exportsOf(src);
    const eng = [...new Set([...src.matchAll(/from\s+['"]\.\.\/engine\/([a-z0-9-]+)/g)].map((x) => x[1]))];
    rows.push({ tệp: '`' + f + '`', dòng: n, chương: ch, 'bộ phận': dept, 'vai trò (đầu tệp)': headerOf(src), 'export': ex.length + (ex.length ? ': ' + ex.slice(0, 6).join(', ') + (ex.length > 6 ? ', …' : '') : ''), 'engine app': eng.join(', '), test: (tests['game/' + f] ?? []).join(', ') });
  }
  const wrows = [];
  for (const f of ls('worker').filter((x) => x.endsWith('.js'))) {
    const src = rd('worker/' + f); const [ch, dept] = WCH[f] ?? ['??', '??']; if (ch === '??') unassigned++;
    wrows.push({ tệp: '`worker/' + f + '`', dòng: src.split('\n').length, chương: ch, 'bộ phận': dept, 'vai trò (đầu tệp)': headerOf(src), test: (tests['worker/' + f] ?? []).join(', ') });
  }
  const sum = Object.entries(perCh).sort().map(([ch, v]) => ({ chương: ch, tên: CH_NAME[ch] ?? '', 'số tệp': v.tệp, 'số dòng': v.dòng }));
  return head('A1 · Bản đồ mã: mô-đun → chương → bộ phận → test')
    + `Tổng: **${rows.length} tệp game, ${total} dòng**; **${wrows.length} tệp máy chủ**. Chưa gán chương: **${unassigned}**.\n\n`
    + '## A1.1 Theo chương\n\n' + table(sum) + '\n'
    + '## A1.2 Mô-đun game `src/game/`\n\nCột «test» lấy tự động: bộ test nào có nhắc tới tệp đó. Ô trống nghĩa là chưa có bộ test thuần nào đụng tới mô-đun.\n\n' + table(rows, { max: 400, n: 200 }) + '\n'
    + '## A1.3 Máy chủ `worker/`\n\n' + table(wrows, { n: 220 }) + '\n';
}

// ---------- A2 · kiểm thử ----------
function a2() {
  const pkg = JSON.parse(rd('package.json'));
  const rows = testFiles().map((f) => {
    const src = rd('scripts/' + f);
    const inS = Object.entries(pkg.scripts).filter(([, v]) => v.includes('scripts/' + f)).map(([k]) => '`' + k + '`').join(', ');
    const mods = [...new Set([...src.matchAll(/(?:game|worker)\/([a-z0-9.-]+?)\.js/g)].map((y) => y[1]))];
    return { tệp: '`scripts/' + f + '`', dòng: src.split('\n').length, 'trong lệnh npm': inS || '**không**', 'cần máy chủ dev': /dev:mmo|8788|localhost|127\.0\.0\.1/.test(src) ? 'có' : '', 'phạm vi (đầu tệp)': headerOf(src), 'mô-đun được nhắc': mods.slice(0, 8).join(', ') + (mods.length > 8 ? ', …' : '') };
  });
  const missing = [];
  for (const [k, v] of Object.entries(pkg.scripts)) for (const m of v.matchAll(/scripts\/([a-z0-9.-]+\.mjs)/g)) if (!fs.existsSync(path.join(ROOT, 'scripts', m[1]))) missing.push({ 'lệnh npm': '`' + k + '`', 'tệp bị gọi nhưng không tồn tại': '`scripts/' + m[1] + '`' });
  const orphan = rows.filter((r) => r['trong lệnh npm'] === '**không**').length;
  return head('A2 · Kiểm thử: danh sách bộ test')
    + `Tổng **${rows.length}** bộ test. **${orphan}** bộ không nằm trong lệnh npm nào. Lệnh npm trỏ tệp không tồn tại: **${missing.length}**.\n\n`
    + (missing.length ? '## A2.1 Lệnh npm đang gãy\n\n' + table(missing) + '\n' : '')
    + '## A2.2 Bộ test\n\n' + table(rows, { max: 200, n: 170 }) + '\n'
    + '## A2.3 Lệnh npm\n\n' + table(Object.entries(pkg.scripts).map(([k, v]) => ({ lệnh: '`npm run ' + k + '`', 'chạy gì': v })), { n: 260 }) + '\n';
}

// ---------- A3 · số liệu hệ thống ----------
const A3 = [
  ['11 · Mệnh và nhân vật', [['progress.js'], ['state.js'], ['cosmetics.js', { skip: ['ITEM'] }], ['tutorial.js'], ['spawn.js'], ['features.js', { skip: ['TEXT'] }]]],
  ['12 · Bói toán và nội dung', [['fortune-npc.js'], ['temples.js'], ['homes.js'], ['map-rating.js'], ['divination.js'], ['cases.js', { only: ['STEP_ORDER', 'STEP_TITLE', 'STEP_WEIGHTS', 'SKILL_VI', 'COOP_STEP_POINTS'] }], ['dz-case.js', { only: ['DZ_STEPS', 'DZ_TITLE'] }], ['zheri-case.js', { only: ['ZHERI_STEPS', 'ZHERI_TITLE', 'JOB_VI'] }], ['vanmenh.js'], ['namhan.js']]],
  ['13 · Đời sống: tiền và sinh tồn', [['coins.js'], ['life.js'], ['illness.js'], ['lifeplaces.js']]],
  ['14 · Việc làm', [['jobs.js'], ['guild-core.js', { skip: ['ORE_NODES'] }], ['fatequest.js'], ['work-games.js']]],
  ['15 · Nhà ở, vật phẩm, phương tiện', [['estate-core.js', { skip: ['LISTING_TIERS', 'LISTING_ROOMS', 'STREET_TIERS'] }], ['estate-layout.js'], ['items.js', { skip: ['ITEM', 'SHOP_TYPES'] }], ['rooms.js', { only: ['SHOP_TYPES', 'TEMPLE_NB'] }], ['shop-data.js'], ['vehicles.js'], ['roomgrid.js']]],
  ['16 · Di chuyển', [['motion.js'], ['movement.js'], ['flight.js'], ['flight-poses.js'], ['boats.js', { skip: ['TYPE_BY_IDX'] }], ['water.js']]],
  ['17 · Sản xuất, ẩm thực, kinh doanh', [['econ-data.js', { skip: ['RECIPE_BY'] }], ['inventory.js'], ['market.js'], ['production.js'], ['cuisine.js'], ['econ-core.js']]],
  ['18 · Huyền học, tu luyện, luân hồi', [['huyenhoc.js'], ['amduc.js'], ['realm.js', { skip: ['PHAP_BY'] }], ['luanhoi.js']]],
  ['19 · Luật và hình phạt', [['law.js', { force: { ARTICLES: { n: 460 } } }], ['prison.js', { skip: ['ORES'] }]]],
  ['20 · Xã hội', [['civil.js']]],
  ['21 · NPC và AI', [['npc-chat-core.js']]],
];
async function a3() {
  let s = head('A3 · Số liệu hệ thống (hằng số và bảng dữ liệu của các mô-đun thuần)');
  s += 'Mỗi mục là một mô-đun: bảng hai cột cho hằng số, rồi mỗi bảng dữ liệu một bảng. Ô dài bị cắt bằng «…»; cần đủ thì mở mã.\n\n';
  for (const [title, mods] of A3) {
    s += `## ${title}\n\n`;
    for (const [f, o] of mods) s += await modSection(f, o);
    if (title.startsWith('11')) { const p = await G('progress.js'); s += '**Phúc Khí tích lũy cần cho từng cấp** (`progress.xpFor`)\n\n' + table([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50].map((lv) => ({ cấp: lv, 'Phúc Khí tích lũy': p.xpFor(lv) }))) + '\n'; }
    if (title.startsWith('14')) { try { const z = await G('jobzones.js'); s += '**Khu làm việc ngoài tiệm** (`jobzones.zones()`)\n\n' + table(z.zones(), { max: 80 }) + '\n'; } catch (e) { s += `_(jobzones: ${esc(e.message)})_\n\n`; } }
    if (title.startsWith('21')) {
      try {
        const p = await G('persona-data.js'), b = await G('bark-pool.js');
        s += '### `persona-data.js`\n\n**`PERSONAS`** (' + p.PERSONAS.length + ')\n\n' + table(p.PERSONAS.map((x) => ({ id: x.id, tên: x.name, aiEnabled: x.aiEnabled, runtime: x.runtime === false ? 'false (khoá)' : '', 'xưng hô': x.danhXung, 'số bark': (x.barkPool ?? []).length })), { n: 120 }) + '\n';
        s += '### `bark-pool.js`\n\n**`BARK_POOLS`** — số câu mỗi nhóm\n\n' + table(Object.fromEntries(Object.entries(b.BARK_POOLS).map(([k, v]) => [k, Array.isArray(v) ? v.length : Object.keys(v).length]))) + '\n';
        const q = await G('batquai.js');
        s += '### `batquai.js › CITIZENS` — dân Nội Thành theo cung\n\n' + table(Object.fromEntries(Object.entries(q.CITIZENS).map(([k, v]) => [k, v.length]))) + '\n';
      } catch (e) { s += `_(persona: ${esc(e.message)})_\n\n`; }
    }
  }
  return s;
}

// ---------- A4 · giao thức, route, hạ tầng ----------
async function a4() {
  const uniq = (a) => [...new Set(a)].sort();
  const room = rd('worker/quan-room.js');
  const c2s = uniq([...room.matchAll(/case '([a-z_0-9]+)'/g)].map((x) => x[1]));
  const srcs = ls('worker').filter((f) => f.endsWith('.js')).map((f) => rd('worker/' + f)).concat(['guild-core.js', 'econ-core.js', 'estate-core.js'].map((f) => rd('src/game/' + f)));
  const s2c = uniq(srcs.flatMap((s) => [...s.matchAll(/\bt: '([a-z_0-9]+)'/g)].map((x) => x[1])));
  const proto = rd('src/game/protocol.js');
  const ec = (proto.match(/EC_OP = \/\^\(([^)]+)\)\$\//) ?? [, ''])[1].split('|').filter(Boolean);
  const routes = [];
  for (const f of ls('worker').filter((x) => x.endsWith('.js'))) for (const r of uniq([...rd('worker/' + f).matchAll(/'(\/(?:api|ws|zai|admin)[a-zA-Z0-9/_-]*)'/g)].map((x) => x[1]))) routes.push({ route: '`' + r + '`', 'xuất hiện trong': '`worker/' + f + '`' });
  const wr = rd('wrangler.jsonc');
  const dos = [...wr.matchAll(/"name":\s*"([A-Z_]+)",\s*"class_name":\s*"(\w+)"/g)].map((x) => ({ binding: x[1], lớp: x[2] }));
  const migs = [...wr.matchAll(/"tag":\s*"([a-z0-9-]+)",\s*"new_sqlite_classes":\s*\["(\w+)"\]/g)].map((x) => ({ 'thẻ migration': x[1], lớp: x[2] }));
  const group = (list, pref) => list.filter((x) => x.startsWith(pref));
  let s = head('A4 · Giao thức mạng, route HTTP, hạ tầng máy chủ');
  s += '## A4.1 Gói WebSocket\n\n';
  s += `**Client → máy chủ** (${c2s.length} loại, lấy từ các nhánh \`case\` của \`worker/quan-room.js\`)\n\n\`${c2s.join('` · `')}\`\n\n`;
  s += `**Máy chủ → client** (${s2c.length} loại, lấy từ mọi \`t: '…'\` trong \`worker/\` và các lõi dùng chung)\n\n\`${s2c.join('` · `')}\`\n\n`;
  s += `**Thao tác kinh tế** — gói \`ec {op, a}\`, tên thao tác phải khớp \`protocol.EC_OP\` (${ec.length} thao tác)\n\n`;
  s += table([['ví và kho', ['me', 'deposit', 'withdraw', 'set_tc', 'cellar_in', 'cellar_out', 'ice', 'drop']], ['Thương hội `th_`', group(ec, 'th_')], ['chợ ký gửi `mk_`', group(ec, 'mk_')], ['sản xuất', ['plot_rent', 'plot_extend', 'plant', 'water', 'fert', 'harvest', 'butcher', 'mill', 'compost', 'fish']], ['bếp', ['cook', 'eat', 'chef_greet', 'chef_join']], ['mặt bằng `vn_`', group(ec, 'vn_')], ['hộ tịch `cv_`', group(ec, 'cv_')], ['thầy mệnh lý `dv_`', group(ec, 'dv_')]].map(([nhóm, ops]) => ({ nhóm, 'thao tác': ops.filter((o) => ec.includes(o)).join(', ') })), { n: 300 }) + '\n';
  s += '## A4.2 Hằng số giao thức\n\n' + (await modSection('protocol.js')).replace(/^### .*\n\n/, '') + '\n';
  s += '## A4.3 Hằng số tài khoản\n\n' + (await modSection('auth-core.js')).replace(/^### .*\n\n/, '') + '\n';
  s += '## A4.4 Route HTTP\n\n' + table(routes, { max: 200 }) + '\n';
  s += '## A4.5 Durable Object và migration (`wrangler.jsonc`)\n\n' + table(dos) + '\n' + table(migs) + '\n';
  return s;
}

// ---------- A5 · địa điểm ----------
async function a5() {
  let s = head('A5 · Thế giới: hằng số bố cục và danh sách địa điểm');
  const tryc = async (label, fn) => { try { return [label, await fn()]; } catch (e) { return [label, 'lỗi: ' + String(e.message).slice(0, 70)]; } };
  const by = (list, f) => { const o = {}; for (const x of list) { const k = f(x) ?? 'khác'; o[k] = (o[k] || 0) + 1; } return { tổng: list.length, ...o }; };
  const counts = [
    await tryc('nhà trong thành — `city4.allHouses()`', async () => by((await G('city4.js')).allHouses(), (h) => h.kind ?? h.type ?? h.use)),
    await tryc('cửa hàng — `shops.cityShops()`', async () => by((await G('shops.js')).cityShops(), (x) => x.type)),
    await tryc('cửa vào được — `homes.enterables()`', async () => by((await G('homes.js')).enterables(), (x) => x.kind)),
    await tryc('cầu trong thành — `bridges.cityBridges()`', async () => (await G('bridges.js')).cityBridges().length),
    await tryc('nhà rao bán — `estate-core.LISTING_COUNT`', async () => (await G('estate-core.js')).LISTING_COUNT),
  ];
  s += '## A5.1 Số lượng đếm từ bộ sinh\n\n' + kv(counts, 700) + '\n';
  const mods = [['terrain.js', { skip: ['RIVER'] }], ['citylayout.js'], ['batquai.js', { skip: ['CITIZENS'] }], ['citylook.js'], ['cityblocks.js'], ['court.js'], ['world.js', { skip: ['PROPS'], max: { STATIONS: 200 } }], ['heaven.js'], ['waterways.js', { skip: ['RIVER_CTRL'] }], ['canals.js', { skip: ['EXT_IN', 'EXT_OUT', 'EXT_PATHS', 'LINK'] }], ['bridges.js'], ['prison.js', { skip: ['ORES'] }], ['jobplaces.js', { skip: ['ORE_NODES'] }], ['mansions.js'], ['streets.js'], ['season.js']];
  s += '## A5.2 Theo mô-đun\n\n';
  for (const [f, o] of mods) s += await modSection(f, o);
  return s;
}

// ---------- A6 · tài sản 3D ----------
function a6() {
  const files = ls('public/models').filter((f) => f.endsWith('.glb'));
  const suf = {}, pre = {};
  for (const f of files) {
    const m = f.match(/\.(hd|mid|far|lod|lod1|lod2|vc|vc2|bk)\.glb$/); const k = m ? '.' + m[1] : '(bản gốc)';
    const size = fs.statSync(path.join(ROOT, 'public/models', f)).size;
    (suf[k] ??= { 'số tệp': 0, MB: 0 })['số tệp']++; suf[k].MB += size;
    if (!m) { const p = (f.match(/^([a-z]+)_/) ?? [, f.replace(/\.glb$/, '')])[1]; (pre[p] ??= { 'số model': 0, 'ví dụ': [] })['số model']++; if (pre[p]['ví dụ'].length < 4) pre[p]['ví dụ'].push(f.replace(/\.glb$/, '')); }
  }
  for (const v of Object.values(suf)) v.MB = Math.round(v.MB / 1048576 * 10) / 10;
  const total = Object.values(suf).reduce((a, v) => a + v.MB, 0);
  return head('A6 · Tài sản 3D trong `public/models/`')
    + `Tổng **${files.length} tệp GLB**, khoảng **${Math.round(total)} MB**.\n\n`
    + '## A6.1 Theo hậu tố bậc\n\n' + table(Object.fromEntries(Object.entries(suf).sort())) + '\n'
    + '## A6.2 Theo tiền tố id (chỉ đếm bản gốc)\n\n' + table(Object.fromEntries(Object.entries(pre).sort((a, b) => b[1]['số model'] - a[1]['số model'])), { n: 160 }) + '\n';
}

// ---------- A7 · điều khiển, HUD, lưu trữ ----------
function a7() {
  const main = rd('src/game/main.js');
  const keys = {};
  main.split('\n').forEach((l) => { for (const m of l.matchAll(/e\.code === '(\w+)'|e\.key === '(\w+)'/g)) { const k = m[1] ?? m[2]; (keys[k] ??= []).push(l.trim().slice(0, 150)); } });
  const ids = [...new Set([...rd('src/game/markup.js').matchAll(/id="(hq-[a-z0-9-]+)"/g)].map((x) => x[1]))].sort();
  const store = {};
  for (const f of ls('src/game').filter((x) => x.endsWith('.js'))) for (const m of rd('src/game/' + f).matchAll(/['"`]((?:huyenquan|hq)[:_][a-zA-Z0-9:_.-]+)/g)) (store[m[1]] ??= new Set()).add(f);
  return head('A7 · Phím, phần tử HUD, khoá lưu trên máy')
    + '## A7.1 Phím bàn phím có trong `main.js`\n\nBảng này chỉ chứng minh phím **có** trong mã; ý nghĩa từng phím xem chương 22.\n\n' + table(Object.entries(keys).sort().map(([k, v]) => ({ phím: '`' + k + '`', 'số chỗ dùng': v.length, 'dòng mã đầu tiên': '`' + v[0] + '`' })), { n: 170 }) + '\n'
    + `## A7.2 Phần tử HUD trong \`markup.js\` (${ids.length})\n\n\`${ids.join('` · `')}\`\n\n`
    + '## A7.3 Khoá `localStorage`\n\n' + table(Object.entries(store).sort().map(([k, v]) => ({ khoá: '`' + k + '`', 'mô-đun dùng': [...v].sort().join(', ') })), { n: 200 }) + '\n';
}

// ---------- chạy ----------
const files = {
  'A1-ban-do-ma.md': a1(),
  'A2-kiem-thu.md': a2(),
  'A3-so-lieu.md': await a3(),
  'A4-giao-thuc.md': await a4(),
  'A5-dia-diem.md': await a5(),
  'A6-tai-san-3d.md': a6(),
  'A7-dieu-khien-luu-tru.md': a7(),
};
let stale = 0;
for (const [name, body] of Object.entries(files)) {
  const p = path.join(ROOT, OUT, name);
  const cur = fs.existsSync(p) ? fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n') : null;
  if (CHECK) { if (cur !== body) { stale++; console.log('CŨ: ' + OUT + '/' + name); } continue; }
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, body);
  console.log(`ghi ${OUT}/${name} — ${body.split('\n').length} dòng`);
}
if (CHECK) console.log(stale ? `${stale} phụ lục đã cũ so với mã — chạy: node scripts/docs-game-gen.mjs` : 'Phụ lục khớp mã.');
process.exit(CHECK && stale ? 1 : 0);
