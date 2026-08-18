// ============================================================================
//  cite.js — mỗi trục engine ↔ một đoạn kinh đã kiểm trên máy
//  Không chấm điểm từ khóa. Không citeLine.
// ============================================================================
import { loadIndex, loadEntry } from './corpus.js';

export const PREFERRED_SIDS = [
  'DZ_子平真诠',
  'DZ_渊海子平',
  'DZ_三命通会',
  'DZ_穷通宝鉴',
  'DZ_滴天髓',
];

const FIELD_PANEL = {
  han_text: 'original',
  deep_passages: 'original',
  full_vn: 'translation',
  meaning: 'summary',
  deep_essence: 'summary',
  logic_thesis: 'reasoning',
  logic_chain: 'reasoning',
  logic_practice: 'reasoning',
};

/** Một đoạn đã mở file corpus và xác nhận substring tồn tại. */
const AXIS_PASSAGE = {
  reciprocity: { sid: 'DZ_渊海子平', field: 'deep_passages', quote: '专用日干为主本；三元要成格局，四柱喜见财官。' },
  palace: { sid: 'DZ_渊海子平', field: 'deep_passages', quote: '欲知贵贱，先观月令乃提纲' },
  stem: { sid: 'DZ_渊海子平', field: 'deep_essence', quote: '天干合、地支六合三合冲刑穿' },
  nayin: { sid: 'DZ_三命通会', field: 'deep_passages', quote: '总论纳音，论纳音取象，释六十甲子性质吉凶。' },
  balance: { sid: 'DZ_渊海子平', field: 'deep_passages', quote: '人禀天地，命属阴阳，生居覆载之内，尽在五行之中。' },
  timing: { sid: 'DZ_滴天髓', field: 'full_vn', quote: 'Đại Vận là dòng khí lớn mười năm' },
  hour: { sid: 'DZ_三命通会', field: 'full_vn', quote: 'năm–tháng–ngày (và giờ) hợp thành cục' },
};

const PAIR_AXIS = {
  reciprocity: 'reciprocity',
  palaceForward: 'palace',
  stemBranch: 'stem',
  nayin: 'nayin',
};

let _ready = null;
let _hits = null;

function locator(it) {
  if (!it) return '';
  if (it.dz) return /DZ|道藏|#/i.test(it.dz) ? it.dz : `DZ#${it.dz}`;
  if (it.bu) return `${it.bu} · ${it.sid}`;
  return it.sid || it.id || '';
}

export async function readyCite() {
  if (_ready) return _hits;
  const idx = await loadIndex();
  const items = idx.items || [];
  const hits = {};
  for (const [axis, spec] of Object.entries(AXIS_PASSAGE)) {
    const meta = items.find((it) => it.sid === spec.sid || it.id === spec.sid);
    if (!meta) continue;
    const entry = await loadEntry(spec.sid);
    const raw = String(entry[spec.field] || '');
    if (!raw.includes(spec.quote)) continue;
    hits[axis] = {
      sid: spec.sid,
      title: meta.name_han,
      titleVi: meta.name_vi || '',
      locator: locator(meta),
      field: spec.field,
      panel: FIELD_PANEL[spec.field] || 'summary',
      quote: spec.quote,
    };
  }
  _hits = hits;
  _ready = true;
  return _hits;
}

export function citeTheme(axis, text) {
  const hit = _hits && _hits[axis];
  if (!hit || !text) return null;
  return {
    text,
    quote: hit.quote,
    title: hit.title,
    titleVi: hit.titleVi,
    locator: hit.locator,
    sid: hit.sid,
    field: hit.field,
    panel: hit.panel,
    axis,
  };
}

export function citeLedger(msg, axis) {
  return citeTheme(axis, msg);
}

/** Sổ cái family.js: gắn trục từ cặp / cụm, bỏ câu không có đoạn đã kiểm. */
function pickReason(reasons) {
  return (reasons || []).find((m) => /[✓⚠✗]/.test(m)) || (reasons || [])[0] || '';
}

export function citeFamilyLedger(family) {
  const rows = [];
  for (const p of family.pairs || []) {
    const axes = p.pair?.axes || {};
    for (const [engKey, axis] of Object.entries(PAIR_AXIS)) {
      const reasons = axes[engKey]?.reasons || [];
      for (const msg of reasons) {
        if (!/^[✓⚠✗]/.test(msg)) continue;
        const row = citeTheme(axis, msg);
        if (row) rows.push(row);
      }
    }
  }
  for (const msg of family.familyBalance?.reasons || []) {
    const row = citeTheme('balance', msg);
    if (row) rows.push(row);
  }
  for (const msg of family.timing?.reasons || []) {
    const row = citeTheme('timing', msg);
    if (row) rows.push(row);
  }
  return rows;
}

/** Một hàng / trục — chỉ khi đoạn kinh đã kiểm còn trên máy. */
export function hieuKhaoRows(family) {
  const seen = new Set();
  const rows = [];
  const push = (axis, msg) => {
    if (!msg || seen.has(axis)) return;
    const cite = citeTheme(axis, msg);
    if (!cite) return;
    seen.add(axis);
    rows.push({
      ...cite,
      agree: /✓/.test(msg) && !/⚠|✗/.test(msg),
      engine: msg,
    });
  };
  for (const p of family.pairs || []) {
    const axes = p.pair?.axes || {};
    for (const [engKey, axis] of Object.entries(PAIR_AXIS)) {
      push(axis, pickReason(axes[engKey]?.reasons));
    }
  }
  push('balance', pickReason(family.familyBalance?.reasons));
  push('timing', pickReason(family.timing?.reasons));
  return rows;
}

export function citedOnly(rows) {
  return (rows || []).filter(Boolean);
}
