// ============================================================================
//  XUẤT TỜ BẢN VẼ TỪNG CÔNG TRÌNH TIÊN PHỦ (docs/TIEN-PHU-KIENTRUC-MANIFEST.md §3): chiếu trực giao từ chính mô hình
//  game (tools/banve.html → src/game/tienphu/arch) ra phối cảnh · mặt đứng chính · mặt đứng bên · mặt bằng cắt 1,5 m ·
//  mặt cắt ngang; ghi kích thước theo tỉ lệ chiếu, thước tỉ lệ, khung tên (nguyên mẫu, số đo, nguồn nghiên cứu).
//    node scripts/banve.mjs [url]   ·   STYLE=trunghoa (mặc định: mọi phong cách có đặc tả)   ·   ID=trunghoa/main,…
//  Ra: docs/tienphu-banve/<NN-phong-cách>/ct-<id>.png + index.html
// ============================================================================
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
const URL_ = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:5180/tools/banve.html';
const DIRS = { trunghoa: '01-trunghoa', nhatban: '02-nhatban', taytang: '03-taytang', gothic: '04-gothic', artdeco: '05-artdeco', tancodien: '06-tancodien', hue: '07-hue', thai: '08-thai', mughal: '09-mughal' };
const STYLE_NAME = { trunghoa: 'Cung Đình Trung Hoa — Cung Vương phủ', nhatban: 'Thành quách Nhật — Himeji / Nijō', taytang: 'Tây Tạng — Potala', gothic: 'Gothic — Beaumaris', artdeco: 'Art Deco — Villa Cavrois', tancodien: 'Tân cổ điển — Versailles', hue: 'Cung đình Huế', thai: 'Thái — Đại Hoàng Cung', mughal: 'Mughal — Taj Mahal' };

const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
await page.goto(URL_); await page.waitForFunction(() => window.banveReady, null, { timeout: 90000 });
let ids = await page.evaluate(() => window.banve.ids());
if (process.env.STYLE) ids = ids.filter((i) => process.env.STYLE.split(',').includes(i.split('/')[0]));
if (process.env.ID) ids = process.env.ID.split(',');
const sheetPage = await browser.newPage({ viewport: { width: 2600, height: 900 } });
const byStyle = {};
const f1 = (v) => (v == null || Number.isNaN(v) ? '—' : (+v).toFixed(1).replace('.', ','));

for (const id of ids) {
  const [style, bid] = id.split('/');
  const V = {};
  for (const v of ['persp', 'front', 'side', 'plan', 'section']) V[v] = await page.evaluate(([id, v]) => window.banve.render(id, v), [id, v]);
  const spec = await page.evaluate((id) => window.banve.spec(id), id), info = V.front.info;
  // lớp kích thước (SVG) cho mặt đứng chính / bên: vạch theo hộp bao + cao độ nền / mép hiên / nóc
  const dims = (R, slotW, horiz) => {
    const s = slotW / R.W, c = R.center, X = (x) => (R.W / 2 + (x - (horiz === 'x' ? c[0] : c[2])) * R.pxPerM) * s, Y = (y) => (R.H / 2 - (y - c[1]) * R.pxPerM) * s;
    const [x0, x1] = horiz === 'x' ? [R.bb.min[0], R.bb.max[0]] : [R.bb.min[2], R.bb.max[2]], yb = Y(0) + 26;
    let o = `<line x1="${X(x0)}" y1="${yb}" x2="${X(x1)}" y2="${yb}" class="d"/><line x1="${X(x0)}" y1="${yb - 8}" x2="${X(x0)}" y2="${yb + 8}" class="d"/><line x1="${X(x1)}" y1="${yb - 8}" x2="${X(x1)}" y2="${yb + 8}" class="d"/><text x="${(X(x0) + X(x1)) / 2}" y="${yb + 20}" class="t">${f1(x1 - x0)} m</text>`;
    const xr = X(x0) - 16, marks = [['±0', 0], ['nền', info.ph], ['mép hiên', info.eave], ['nóc', info.top]].filter(([, v]) => v != null && v > 0.05 || v === 0);
    for (const [lab, v] of marks) o += `<line x1="${xr - 6}" y1="${Y(v)}" x2="${xr + 6}" y2="${Y(v)}" class="d"/><text x="${xr - 10}" y="${Y(v) + 4}" class="tl" text-anchor="end">${lab} +${f1(v)}</text>`;
    o += `<line x1="${xr}" y1="${Y(0)}" x2="${xr}" y2="${Y(info.top)}" class="d"/>`;
    // thước tỉ lệ 10 m
    const L = 10 * R.pxPerM * s; o += `<rect x="12" y="${R.H * s - 22}" width="${L}" height="6" fill="#222"/><rect x="${12 + L / 2}" y="${R.H * s - 22}" width="${L / 2}" height="6" fill="#fff" stroke="#222"/><text x="${12 + L + 6}" y="${R.H * s - 15}" class="tl">10 m · 1:${Math.round(1000 / (R.pxPerM * s * 0.2645))}</text>`;
    return o;
  };
  const img = (R) => R.png;
  const slot = (title, R, w, d = '') => `<div class="slot" style="width:${w}px"><div class="h">${title}</div><div style="position:relative"><img src="${img(R)}" style="width:${w}px;display:block"><svg style="position:absolute;left:0;top:0" width="${w}" height="${(w * R.H) / R.W}">${d}</svg></div></div>`;
  const bays = info.bays ? `${info.bays.length} gian: ${info.bays.map(f1).join(' / ')} m` : info.n ? `${info.n} cạnh` : '—';
  const rows = [
    ['Nguyên mẫu', spec.proto], ['Kích thước chiếm đất', `${f1(info.PW || info.W)} × ${f1(info.PD || info.D)} m`], ['Lưới cột', info.W && info.D && info.bays ? `${f1(info.W)} × ${f1(info.D)} m tim cột · ${bays}` : bays],
    ['Nền', `${f1(info.ph)} m`], ['Cột', info.colH ? `cao ${f1(info.colH)} m${info.colD ? ` · Ø ${f1(info.colD)} m` : ''}` : '—'], ['Mép hiên / nóc', `${f1(info.eave)} / ${f1(info.top)} m`],
    ['Mái', spec.roofText || spec.roofDesc ? (spec.roofText || spec.roofDesc) : style !== 'trunghoa' ? (spec.roof?.label || spec.roof?.type || '—') : spec.roof ? `${({ xieshan: 'yết sơn 歇山', gable: 'ngạnh sơn 硬山', juanpeng: 'quyển bằng 卷棚', goulianda: `câu liên đáp ${spec.roof.n || 2} quyển 勾连搭`, flat: 'mái bằng', hip: 'vũ điện 庑殿' })[spec.roof.type] || spec.roof.type}, ngói ${spec.roof.tile === 'Green' ? 'lưu ly xanh lục' : 'ống xám'}${spec.roof.beasts ? `, ${spec.roof.beasts} linh vật` : ''}` : spec.tiers ? `chóp ${spec.n} cạnh, ${spec.tiers} vành mái` : spec.type === 'tower' ? 'mái hắt từng tầng + chóp bát giác' : 'theo các khối'],
    ['Tam giác', `${(info.tris / 1000).toFixed(0)} nghìn`], ['Căn cứ', spec.src],
  ];
  const html = `<html><head><meta charset="utf-8"><style>
    body{margin:0;background:#efe9da;font:15px 'Segoe UI',sans-serif;color:#1d1a16}.wrap{display:flex;gap:14px;padding:14px}
    .slot{background:#f6f1e4;border:1px solid #b9ae95}.h{font-weight:600;padding:6px 10px;border-bottom:1px solid #d3c9b0;font-size:14px}
    .tb{width:560px;background:#fffdf7;border:2px solid #1d1a16;padding:14px}.tb h1{font-size:24px;margin:0 0 4px}.tb .sub{color:#6b5d44;margin-bottom:10px}
    .tb table{border-collapse:collapse;width:100%}.tb td{border-top:1px solid #ddd2b8;padding:6px 4px;vertical-align:top;font-size:14px}.tb td:first-child{width:150px;color:#6b5d44}
    .d{stroke:#7a1d14;stroke-width:1.4}.t{fill:#7a1d14;font:600 14px sans-serif;text-anchor:middle}.tl{fill:#7a1d14;font:600 12px sans-serif}</style></head><body>
    <div class="wrap"><div style="display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;gap:14px">${slot('PHỐI CẢNH', V.persp, 980)}${slot('MẶT ĐỨNG CHÍNH (hướng Nam)', V.front, 980, dims(V.front, 980, 'x'))}</div>
      <div style="display:flex;gap:14px">${slot('MẶT ĐỨNG BÊN', V.side, 646, dims(V.side, 646, 'z'))}${slot('MẶT BẰNG — cắt ở cao 1,5 m trên nền', V.plan, 646)}${slot('MẶT CẮT NGANG (qua tim gian giữa)', V.section, 646, dims(V.section, 646, 'z'))}</div>
    </div><div class="tb"><h1>${spec.name}</h1><div class="sub">Bản vẽ ${DIRS[style].slice(0, 2)}-${bid} · ${STYLE_NAME[style]}</div>
      <table>${rows.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table>
      <p style="font-size:12px;color:#6b5d44;margin-top:12px">Hình chiếu sinh trực tiếp từ mô hình dựng trong game (cùng một đặc tả: src/game/tienphu/arch/spec-*.js) — bản vẽ và công trình trong game là một.</p></div></div></body></html>`;
  const dir = `docs/tienphu-banve/${DIRS[style]}`; mkdirSync(dir, { recursive: true });
  await sheetPage.setContent(html); await sheetPage.waitForTimeout(150);
  const out = `${dir}/ct-${bid}.png`; await sheetPage.screenshot({ path: out, fullPage: true });
  (byStyle[style] ||= []).push({ bid, name: spec.name, file: `ct-${bid}.png` });
  console.log(id, '→', out, `${(info.tris / 1000).toFixed(0)}k tam giác`);
}
for (const [style, list] of Object.entries(byStyle)) {
  const dir = `docs/tienphu-banve/${DIRS[style]}`;
  writeFileSync(`${dir}/index.html`, `<html><head><meta charset="utf-8"><title>${STYLE_NAME[style]}</title><style>body{font:15px sans-serif;background:#efe9da;margin:20px}img{width:100%;border:1px solid #999;margin:8px 0 28px}</style></head><body><h1>${STYLE_NAME[style]}</h1>${existsSync(`${dir}/00-tong-mat-bang.svg`) ? '<h2>Tổng mặt bằng</h2><img src="00-tong-mat-bang.svg">' : ''}${list.map((x) => `<h2>${x.name}</h2><img src="${x.file}">`).join('')}</body></html>`);
}
console.log(errs.length ? 'LỖI TRANG: ' + [...new Set(errs)].slice(0, 5).join(' | ') : 'không lỗi trang');
await browser.close();
