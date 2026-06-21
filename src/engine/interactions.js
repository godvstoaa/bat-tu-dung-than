// ============================================================================
//  HÌNH – XUNG – HỘI – HỢP (刑沖會合) — Biến động mệnh cục
//  Dữ liệu chuẩn Tử Bình: Thiên Can hợp hóa, Địa Chi lục hợp / tam hợp /
//  tam hội / lục xung / tam hình / lục hại. Dùng để luận tương tác giữa các trụ.
//  Nguồn: 渊海子平, 滴天髓, 三命通會.
// ============================================================================

// ---- THIÊN CAN NGŨ HỢP (天干五合) + Hóa khí ----
// Hai can kề tiep theo thứ tự giáp-kỷ... hợp và hóa thành một hành.
export const GAN_HE = [
  { pair: ['甲', '己'], hua: '土' },
  { pair: ['乙', '庚'], hua: '金' },
  { pair: ['丙', '辛'], hua: '水' },
  { pair: ['丁', '壬'], hua: '木' },
  { pair: ['戊', '癸'], hua: '火' },
];

// Tra nhanh: cặp can (bất kể thứ tự) → hành hóa khí (nếu có)
export const GAN_HE_MAP = (() => {
  const m = {};
  for (const h of GAN_HE) {
    m[h.pair.join('')] = h.hua;
    m[h.pair.slice().reverse().join('')] = h.hua;
  }
  return m;
})();

// ---- ĐỊA CHI LỤC HỢP (地支六合) + Hóa khí ----
export const ZHI_LIUHE = [
  { pair: ['子', '丑'], hua: '土' },
  { pair: ['寅', '亥'], hua: '木' },
  { pair: ['卯', '戌'], hua: '火' },
  { pair: ['辰', '酉'], hua: '金' },
  { pair: ['巳', '申'], hua: '水' },
  { pair: ['午', '未'], hua: '火' }, // một số phái ghi Hỏa/Thổ
];
export const ZHI_LIUHE_MAP = (() => {
  const m = {};
  for (const h of ZHI_LIUHE) {
    m[h.pair.join('')] = h.hua;
    m[h.pair.slice().reverse().join('')] = h.hua;
  }
  return m;
})();

// ---- ĐỊA CHI TAM HỢP CỤC (地支三合局) ----
// Cục đủ 3 chi mới hóa; thiếu 1 chi gọi là "hợp cục đãm bán".
export const ZHI_SANHE = [
  { branches: ['申', '子', '辰'], wx: '水', name: 'Thủy cục' },
  { branches: ['寅', '午', '戌'], wx: '火', name: 'Hỏa cục' },
  { branches: ['巳', '酉', '丑'], wx: '金', name: 'Kim cục' },
  { branches: ['亥', '卯', '未'], wx: '木', name: 'Mộc cục' },
];

// ---- ĐỊA CHI TAM HỘI PHƯƠNG (地支三會方) ----
// Hội khí của một phương (giống như vậy là khí vượng)
export const ZHI_SANHUI = [
  { branches: ['寅', '卯', '辰'], wx: '木', name: 'Phương Đông' },
  { branches: ['巳', '午', '未'], wx: '火', name: 'Phương Nam' },
  { branches: ['申', '酉', '戌'], wx: '金', name: 'Phương Tây' },
  { branches: ['亥', '子', '丑'], wx: '水', name: 'Phương Bắc' },
];

// ---- LỤC XUNG (六沖) ----
export const ZHI_CHONG = ['子午', '丑未', '寅申', '卯酉', '辰戌', '巳亥'];
export const ZHI_CHONG_MAP = (() => {
  const m = {};
  for (const p of ZHI_CHONG) { m[p] = true; m[p[1] + p[0]] = true; }
  return m;
})();

// ---- TAM HÌNH (三刑) + TỰ HÌNH ----
// Vô lễ: 子↔卯 ; Thế thế: 寅→巳→申→寅 ; Vô ân: 丑→戌→未→丑 ; Tự hình: 辰辰/午午/酉酉/亥亥
export const ZHI_XING_PAIRS = [
  { pair: ['子', '卯'], name: 'Vô lễ chi hình', vi: 'Hình vô lễ' },
  { pair: ['寅', '巳'], name: 'Thế thế chi hình', vi: 'Hình thế thế' },
  { pair: ['巳', '申'], name: 'Thế thế chi hình', vi: 'Hình thế thế' },
  { pair: ['寅', '申'], name: 'Thế thế chi hình', vi: 'Hình thế thế' },
  { pair: ['丑', '戌'], name: 'Vô ân chi hình', vi: 'Hình vô ân' },
  { pair: ['戌', '未'], name: 'Vô ân chi hình', vi: 'Hình vô ân' },
  { pair: ['丑', '未'], name: 'Vô ân chi hình', vi: 'Hình vô ân' },
];
export const ZHI_XING_SELF = ['辰', '午', '酉', '亥'];

// ---- LỤC HẠI (六害/穿) ----
export const ZHI_HAI = ['子未', '丑午', '寅巳', '卯辰', '申亥', '酉戌'];
export const ZHI_HAI_MAP = (() => {
  const m = {};
  for (const p of ZHI_HAI) { m[p] = true; m[p[1] + p[0]] = true; }
  return m;
})();

// ============================================================================
//  HÀM PHÁT HIỆN TƯƠNG TÁC TRONG LÁ SỐ
//  Quét tất cả cặp Địa Chi & cặp Thiên Can giữa 4 trụ (Năm/Tháng/Ngày/Giờ).
// ============================================================================
import { GAN } from './constants.js';

function pairs(arr) {
  const out = [];
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++) out.push([arr[i], arr[j], i, j]);
  return out;
}

const POS_LABEL = { 0: 'Trụ Năm', 1: 'Trụ Tháng', 2: 'Trụ Ngày', 3: 'Trụ Giờ' };

/**
 * Phát hiện toàn bộ tương tác hình-xung-hội-hợp từ 4 trụ.
 * @param {object} pillars - { year, month, day, time } mỗi trụ {gan, zhi, ...}
 * @returns {object} { ganHe, zhiHe, sanHe, sanHui, chong, xing, hai, summary }
 */
export function detectInteractions(pillars) {
  const order = ['year', 'month', 'day', 'time'];
  const gans = order.map((k) => pillars[k].gan);
  const zhis = order.map((k) => pillars[k].zhi);

  // --- Thiên Can ngũ hợp ---
  const ganHe = [];
  for (const [a, b, i, j] of pairs(gans)) {
    const hua = GAN_HE_MAP[a + b];
    if (hua) ganHe.push({ a, b, hua, at: `${POS_LABEL[i]}–${POS_LABEL[j]}` });
  }

  // --- Lục hợp nhị chi ---
  const zhiHe = [];
  for (const [a, b, i, j] of pairs(zhis)) {
    const hua = ZHI_LIUHE_MAP[a + b];
    if (hua) zhiHe.push({ a, b, hua, at: `${POS_LABEL[i]}–${POS_LABEL[j]}` });
  }

  // --- Tam hợp / Tam hội (cần đủ 3 chi) ---
  const zset = new Set(zhis);
  const sanHe = ZHI_SANHE.filter((s) => s.branches.every((b) => zset.has(b)))
    .map((s) => ({ ...s, present: s.branches }));
  const sanHui = ZHI_SANHUI.filter((s) => s.branches.every((b) => zset.has(b)))
    .map((s) => ({ ...s, present: s.branches }));

  // --- Lục xung ---
  const chong = [];
  for (const [a, b, i, j] of pairs(zhis))
    if (ZHI_CHONG_MAP[a + b]) chong.push({ a, b, at: `${POS_LABEL[i]}–${POS_LABEL[j]}` });

  // --- Tam hình (gồm tự hình) ---
  const xing = [];
  for (const [a, b, i, j] of pairs(zhis)) {
    const hit = ZHI_XING_PAIRS.find((p) =>
      (p.pair[0] === a && p.pair[1] === b));
    if (hit) xing.push({ a, b, name: hit.name, vi: hit.vi, at: `${POS_LABEL[i]}–${POS_LABEL[j]}` });
  }
  // Tự hình: cùng một chi xuất hiện ≥2 lần
  const zCount = {};
  zhis.forEach((z, idx) => { (zCount[z] = zCount[z] || []).push(idx); });
  for (const [z, idxs] of Object.entries(zCount)) {
    if (idxs.length >= 2 && ZHI_XING_SELF.includes(z)) {
      xing.push({ a: z, b: z, name: 'Tự hình', vi: 'Hình tự', at: idxs.map((i) => POS_LABEL[i]).join('–') });
    }
  }

  // --- Lục hại ---
  const hai = [];
  for (const [a, b, i, j] of pairs(zhis))
    if (ZHI_HAI_MAP[a + b]) hai.push({ a, b, at: `${POS_LABEL[i]}–${POS_LABEL[j]}` });

  // --- Tổng hợp narration ---
  const parts = [];
  if (sanHui.length) parts.push(`Tam hội ${sanHui.map((s) => s.name + '(' + s.branches.join('') + '→' + s.wx + ')').join(', ')}`);
  if (sanHe.length) parts.push(`Tam hợp ${sanHe.map((s) => s.name + '(' + s.branches.join('') + '→' + s.wx + ')').join(', ')}`);
  if (ganHe.length) parts.push(`Can hợp ${ganHe.map((g) => g.a + g.b + '→' + g.hua).join(', ')}`);
  if (zhiHe.length) parts.push(`Chi lục hợp ${zhiHe.map((g) => g.a + g.b + '→' + g.hua).join(', ')}`);
  if (chong.length) parts.push(`Xung ${chong.map((c) => c.a + '↔' + c.b).join(', ')}`);
  if (xing.length) parts.push(`Hình ${xing.map((c) => c.a + (c.a === c.b ? '' : '–' + c.b)).join(', ')}`);
  if (hai.length) parts.push(`Hại ${hai.map((c) => c.a + '–' + c.b).join(', ')}`);

  return { ganHe, zhiHe, sanHe, sanHui, chong, xing, hai, summary: parts.join(' · ') || 'Tứ trụ tương đối yên tĩnh, không có xung hợp rõ rệt.' };
}
