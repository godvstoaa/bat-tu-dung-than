// ============================================================================
//  cite.js — mọi câu diễn giải phải neo một mục corpus (title + locator)
// ============================================================================
import { loadIndex } from './corpus.js';

const CLASSICS = {
  yuanhai: ['渊海子平', '淵海子平'],
  ziping: ['子平真诠', '子平真詮', '子平真诠评注'],
  qiongtong: ['穷通宝鉴', '窮通寶鑑'],
  ditiansui: ['滴天髓', '滴天髓阐微', '滴天髓闡微'],
  sanming: ['三命通会', '三命通會'],
};

let _items = null;

export async function readyCite() {
  if (_items) return _items;
  const idx = await loadIndex();
  _items = idx.items || [];
  return _items;
}

export function findClassic(names) {
  const keys = (names || []).map((n) => String(n).replace(/\s/g, ''));
  if (!_items || !keys.length) return null;
  const scored = [];
  for (const it of _items) {
    const han = it.name_han || '';
    const id = it.id || '';
    const sid = it.sid || '';
    let n = 0;
    for (const k of keys) {
      if (han === k) n += 8;
      else if (han.includes(k)) n += 5;
      if (id.includes(k) || sid.includes(k)) n += 4;
    }
    if (n) scored.push({ it, n });
  }
  scored.sort((a, b) => b.n - a.n);
  return scored[0]?.it || null;
}

export function locator(it) {
  if (!it) return '';
  if (it.dz) return /DZ|道藏|#/i.test(it.dz) ? it.dz : `DZ#${it.dz}`;
  if (it.bu) return `${it.bu} · ${it.sid}`;
  return it.sid || it.id || '';
}

export function citeLine(text, classicKey) {
  const names = CLASSICS[classicKey] || [classicKey];
  const it = findClassic(names);
  if (!it) return null;
  return {
    text,
    title: it.name_han || names[0],
    titleVi: it.name_vi || '',
    locator: locator(it),
    sid: it.sid,
  };
}

export function citedOnly(rows) {
  return rows.filter(Boolean);
}
