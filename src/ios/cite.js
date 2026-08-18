// ============================================================================
//  cite.js — chỉ hiện câu khi tìm được đoạn THẬT trong 5 kinh ưu tiên
//  Không dán câu soạn sẵn lên bìa sách.
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
  deep_application: 'summary',
  use: 'summary',
  logic_thesis: 'reasoning',
  logic_chain: 'reasoning',
  logic_practice: 'reasoning',
  logic_compare: 'reasoning',
};

const TEXT_FIELDS = [
  'deep_passages', 'han_text', 'deep_essence', 'full_vn', 'meaning',
  'logic_thesis', 'logic_chain', 'logic_practice', 'logic_compare',
  'deep_application', 'use',
];

const THEME_NEEDLES = {
  reciprocity: ['十神', '日干', '日主', '财官', '印食', 'Nhật', 'thập thần', 'Tài', 'Quan', 'Ấn', '日干为主'],
  palace: ['月令', '四柱', '提纲', 'nguyệt lệnh', 'tứ trụ', '专用日干'],
  stem: ['冲', '合', '地支', '天干', '六合', '三合', 'xung', 'hợp'],
  nayin: ['纳音', 'nạp âm', '六十甲子'],
  balance: ['五行', '五气', 'ngũ hành', '中和'],
  timing: ['大运', 'Đại Vận', 'lưu niên', '起运'],
  hour: ['时', '四柱', 'giờ', 'ngày', '三元', '专用日干'],
};

let _books = null;

function locator(it) {
  if (!it) return '';
  if (it.dz) return /DZ|道藏|#/i.test(it.dz) ? it.dz : `DZ#${it.dz}`;
  if (it.bu) return `${it.bu} · ${it.sid}`;
  return it.sid || it.id || '';
}

function splitPassages(text) {
  return String(text || '')
    .split(/[｜|\n]/)
    .flatMap((p) => p.split(/(?<=[。．.!?])\s*/))
    .map((s) => s.trim())
    .filter((s) => s.length >= 16 && s.toLowerCase() !== 'null');
}

function harvest(entry, meta) {
  const rows = [];
  for (const field of TEXT_FIELDS) {
    const raw = String(entry[field] || '').trim();
    if (raw.length < 16) continue;
    const parts = field === 'deep_passages' || field === 'han_text'
      ? splitPassages(raw)
      : splitPassages(raw);
    for (const passage of parts) {
      rows.push({
        sid: meta.sid,
        title: meta.name_han,
        titleVi: meta.name_vi || '',
        locator: locator(meta),
        field,
        panel: FIELD_PANEL[field] || 'summary',
        passage,
      });
    }
  }
  return rows;
}

export async function readyCite() {
  if (_books) return _books;
  const idx = await loadIndex();
  const items = idx.items || [];
  const books = [];
  for (const sid of PREFERRED_SIDS) {
    const meta = items.find((it) => it.sid === sid || it.id === sid);
    if (!meta) continue;
    const entry = await loadEntry(sid);
    books.push({ meta, entry, passages: harvest(entry, meta) });
  }
  _books = books;
  return _books;
}

export function themeOf(msg) {
  const s = String(msg || '');
  if (/Nạp âm|nạp âm|纳音/i.test(s)) return 'nayin';
  if (/đại vận|Đại Vận|大运/i.test(s)) return 'timing';
  if (/Chi năm|Nhật Chi|ngũ hợp|Xung|Lục Hợp|Tam Hợp/i.test(s)) return 'stem';
  if (/Cung |Trụ Năm|Trụ Tháng|Trụ Ngày|Trụ Giờ|宫/i.test(s)) return 'palace';
  if (/Ngũ Hành|gia tộc|Dụng chủ thể/i.test(s)) return 'balance';
  if (/giờ|时辰|时柱/i.test(s)) return 'hour';
  if (/Nhật Chủ|vai trò|hành /i.test(s)) return 'reciprocity';
  return 'reciprocity';
}

function scorePassage(passage, needles) {
  const hay = passage.passage;
  let n = 0;
  for (const k of needles) {
    if (hay.includes(k)) n += k.length >= 4 ? 4 : 2;
  }
  if (passage.field === 'deep_passages' || passage.field === 'han_text') n += 3;
  if (passage.field === 'deep_essence') n += 2;
  return n;
}

export function locatePassage(theme) {
  if (!_books) return null;
  const needles = THEME_NEEDLES[theme] || THEME_NEEDLES.reciprocity;
  let best = null;
  let bestN = 0;
  for (const book of _books) {
    for (const p of book.passages) {
      const n = scorePassage(p, needles);
      if (n > bestN) {
        bestN = n;
        best = p;
      }
    }
  }
  if (!best || bestN < 2) return null;
  return best;
}

export function citeLedger(msg) {
  const hit = locatePassage(themeOf(msg));
  if (!hit) return null;
  return {
    text: msg,
    quote: hit.passage,
    title: hit.title,
    titleVi: hit.titleVi,
    locator: hit.locator,
    sid: hit.sid,
    field: hit.field,
    panel: hit.panel,
  };
}

export function citeTheme(theme, fallbackText) {
  const hit = locatePassage(theme);
  if (!hit) return null;
  return {
    text: fallbackText || hit.passage,
    quote: hit.passage,
    title: hit.title,
    titleVi: hit.titleVi,
    locator: hit.locator,
    sid: hit.sid,
    field: hit.field,
    panel: hit.panel,
  };
}

export function citedOnly(rows) {
  return (rows || []).filter(Boolean);
}
