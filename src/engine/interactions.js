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

// [loop 334] 天干冲 (4 cặp Thất Sát: 甲庚/乙辛/丙壬/丁癸) — can khắc cương mãnh. 戊己 (Thổ) không có đối xung.
//   Khi 2 trụ的天干 thành cặp này → «天干七杀»: xung đột cương quyết giữa 2 lãnh vực trụ đó.
export const GAN_CHONG = { 甲:'庚', 庚:'甲', 乙:'辛', 辛:'乙', 丙:'壬', 壬:'丙', 丁:'癸', 癸:'丁' };

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
// [loop 748 ELEVATION] LỤC XUNG 六冲 — 6 cặp ảnh hưởng LĨNH VỰC khác nhau (trước đây chỉ
//   {a,b} không name/meaning). Nguồn: 渊海子平 «六冲论».
export const CHONG_MEANING = {
  '子午': { name: 'Thủy hỏa tương chiến', vi: 'Xung thủy hỏa', domain: 'tâm huyết/thần kinh', meaning: 'Bắc-Nam (tý âm cực ↔ ngọ dương cực): thủy hỏa giao chiến → tâm huyết/thần kinh, dễ xúc động bốc đồng; sự nghiệp bắc-nam biến động.' },
  '丑未': { name: 'Trọng thổ tương xung', vi: 'Xung trọng thổ', domain: 'dời đổi/điền sản', meaning: '2 chi thổ xung → hay đi lại/dời đổi, gia đạo-điền sản biến động, dễ thay đổi chỗ ở.' },
  '寅申': { name: 'Dịch mã tương xung', vi: 'Xung dịch mã', domain: 'di chuyển/sứ mệnh', meaning: 'Mộc-Kim (dần-thân) = «nhân mã»: di chuyển xa, sự nghiệp thay đổi, dễ bôn ba/tai nạn xe cộ.' },
  '卯酉': { name: 'Đào hoa tương xung', vi: 'Xung đào hoa', domain: 'nam nữ/hôn nhân', meaning: 'Mộc-Kim (mão-dậu) = «đào hoa tán»: nam nữ/hôn nhân biến động, phối ngẫu duyên mỏng, đào hoa tán.' },
  '辰戌': { name: 'Thiên la địa võng', vi: 'Xung la võng', domain: 'tài sản/tranh chấp', meaning: '2 chi thổ (thìn-tuất) = «thiên la địa võng»: tranh chấp tài sản/sức lực, dời nhà, dễ phá tài.' },
  '巳亥': { name: 'Thiên môn địa hộ', vi: 'Xung thiên môn', domain: 'công việc/giao tế', meaning: 'Hỏa-Thủy (tị-hợi) = «thiên môn địa hộ»: thay đổi công việc, giao tế rộng, dễ khẩu phi/tiểu nhân.' },
};
const _CHONG_LOOKUP = (() => {
  const m = {};
  for (const [pair, info] of Object.entries(CHONG_MEANING)) { m[pair] = info; m[pair[1] + pair[0]] = info; }
  return m;
})();

// ---- TAM HÌNH (三刑) + TỰ HÌNH ----
// [cycle 47 sửa NHÃN] Vô lễ: 子↔卯 ; Vô ân(无恩): 寅→巳→申→寅 ; Thế thế(恃势): 丑→戌→未→丑 ; Tự hình: 辰辰/午午/酉酉/亥亥
//   (trước đây 2 nhãn Vô ân/Thế thế bị HOÁN cho nhau — sai thuật ngữ cổ trên mọi luận hình)
export const ZHI_XING_PAIRS = [
  { pair: ['子', '卯'], name: 'Vô lễ chi hình', vi: 'Hình vô lễ' },
  { pair: ['寅', '巳'], name: 'Vô ân chi hình', vi: 'Hình vô ân' },
  { pair: ['巳', '申'], name: 'Vô ân chi hình', vi: 'Hình vô ân' },
  { pair: ['寅', '申'], name: 'Vô ân chi hình', vi: 'Hình vô ân' },
  { pair: ['丑', '戌'], name: 'Thế thế chi hình', vi: 'Hình thế thế' },
  { pair: ['戌', '未'], name: 'Thế thế chi hình', vi: 'Hình thế thế' },
  { pair: ['丑', '未'], name: 'Thế thế chi hình', vi: 'Hình thế thế' },
];
export const ZHI_XING_SELF = ['辰', '午', '酉', '亥'];
// [loop 746 ELEVATION] Ý nghĩa cụ thể mỗi loại tam hình (cổ pháp — trước đây chỉ show nhãn,
//   không giải thích hậu quả → user/AI không biết «vô ân» khác gì «tự hình»).
export const XING_MEANING = {
  'Vô ân chi hình': '«恩将仇报»: dễ quên ơn/phản bội ân nhân, khẩu thiệt quan phi, dễ tai nạn xe cộ. Đủ 3 chi 寅巳申 đồng hiện = «pháp hình» NẶNG nhất (quan tụng, họa đến thân).',
  'Thế thế chi hình': '«恃势»: Ỷ thế lực hiếp người, huynh đệ bất hòa, kiêu ngạo sinh thù, dễ cãi vã tranh giành nội bộ/gia đạo.',
  'Vô lễ chi hình': '«无礼»: Vô lễ với trưởng bối, lộng quyền, vấn đề luân lý/hôn nhân — đặc biệt Nguyệt-Nhật phạm = khắc cha mẹ/bậc trên.',
  'Tự hình': '«自刑»: Tự trừng phạt, hoài nghi/khó tha thứ bản thân, trầm cảm, dễ tự hủy; nội xung đột kéo dài (đặc biệt trụ lặp).',
};

// ---- LỤC HẠI (六害/穿) ----
export const ZHI_HAI = ['子未', '丑午', '寅巳', '卯辰', '申亥', '酉戌'];
export const ZHI_HAI_MAP = (() => {
  const m = {};
  for (const p of ZHI_HAI) { m[p] = true; m[p[1] + p[0]] = true; }
  return m;
})();
// [loop 747 ELEVATION] LỤC HẠI 六害 — 6 cặp đều có tên cổ + hậu quả khác nhau (trước đây
//   detectInteractions chỉ push {a,b} KHÔNG có name/meaning → brief/UI không giải thích).
//   Nguồn: 三命通会 «六害相穿».
export const HAI_MEANING = {
  '子未': { name: 'Thế gia tương hại', vi: 'Hại thế gia', meaning: '«势家»: khí cực đụng (tý âm cực ↔ vị dương cực) → cốt nhục tương hại, lục thân duyên bạc (đặc biệt mẹ-con/cha-con).' },
  '丑午': { name: 'Quan quỷ tương hại', vi: 'Hại quan quỷ', meaning: '«官鬼»: Sửu kim khố ↔ Ngọ hỏa vượng (hỏa khắc kim) → sự nghiệp tiểu nhân, khẩu phi, dễ oan ức.' },
  '寅巳': { name: 'Vô ân tương hại', vi: 'Hại vô ân', meaning: 'Đa nghi, ân oán lẫn lộn, khẩu thiệt; dễ bị người giúp quay ra gây khó (liên quan 寅巳 hình).' },
  '卯辰': { name: 'Đồng bào tương hại', vi: 'Hại đồng bào', meaning: 'Huynh đệ/bạn bè tương tranh, dễ đụng chấn người ngang hàng; cục bộ bất hòa.' },
  '申亥': { name: 'Tranh tiến tương hại', vi: 'Hại tranh tiến', meaning: '«争进»: Lục thân/giao tế khẩu phi, tranh giành cơ hội, tiểu nhân ngầm.' },
  '酉戌': { name: 'Đố kỵ tương hại', vi: 'Hại đố kỵ', meaning: '«嫉妒»: Phụ nữ/đệ huynh bất lợi; nữ mệnh dễ hình khắc phối ngẫu, khẩu thiệt đố kỵ.' },
};
const _HAI_LOOKUP = (() => {
  const m = {};
  for (const [pair, info] of Object.entries(HAI_MEANING)) { m[pair] = info; m[pair[1] + pair[0]] = info; }
  return m;
})();

// ============================================================================
//  HÀM PHÁT HIỆN TƯƠNG TÁC TRONG LÁ SỐ
//  Quét tất cả cặp Địa Chi & cặp Thiên Can giữa 4 trụ (Năm/Tháng/Ngày/Giờ).
// ============================================================================
import { GAN, ZHI } from './constants.js';

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

  // [loop 334] Thiên Can xung (4 cặp Thất Sát) — «天干七杀»: xung đột cương quyết giữa 2 trụ.
  const ganChong = [];
  for (const [a, b, i, j] of pairs(gans)) {
    if (GAN_CHONG[a] === b) ganChong.push({ a, b, at: `${POS_LABEL[i]}–${POS_LABEL[j]}` });
  }

  // --- Lục hợp nhị chi ---
  // [loop 752 ELEVATION] 合化 vs 合绊 — cổ pháp phân biệt: hợp ĐỦ điều kiện → «合 hóa» (2 chi
  //   hòa vào hành hóa → đổi ngũ hành cục); KHÔNG đủ → «合绊» (2 chi DÍNH nhau, giảm lực độc lập,
  //   kéo/kìm nhau). Điều kiện chính «得时»: tháng chi bản khí == hành hóa; hoặc «化神 có根»
  //   (hành hóa xuất hiện ở trụ khác). Trước đây chỉ note hành hóa, không phân loại.
  const _monthWx = ZHI[pillars.month.zhi] && ZHI[pillars.month.zhi].wx;
  const zhiHe = [];
  for (const [a, b, i, j] of pairs(zhis)) {
    const hua = ZHI_LIUHE_MAP[a + b];
    if (!hua) continue;
    const _genCount = zhis.filter((z, idx) => idx !== i && idx !== j && ZHI[z] && ZHI[z].wx === hua).length;
    const _deShi = _monthWx === hua;
    const _huaReal = _deShi || _genCount >= 1;
    zhiHe.push({
      a, b, hua, heType: _huaReal ? '合化' : '合绊',
      huaNote: _huaReal
        ? `«合化» — 2 chi HÒA VÀO hành ${hua} (${_deShi ? 'đắc lệnh tháng' : 'hóa thần có根'}) → ĐỔI ngũ hành cục (coi 2 chi = hành ${hua})`
        : `«合绊» — 2 chi DÍNH nhau (không đắc lệnh) → giảm lực độc lập, kéo/kìm nhau (KHÔNG hóa)`,
      at: `${POS_LABEL[i]}–${POS_LABEL[j]}`,
    });
  }

  // --- Tam hợp / Tam hội (cần đủ 3 chi) ---
  const zset = new Set(zhis);
  const sanHe = ZHI_SANHE.filter((s) => s.branches.every((b) => zset.has(b)))
    .map((s) => ({ ...s, present: s.branches }));
  const sanHui = ZHI_SANHUI.filter((s) => s.branches.every((b) => zset.has(b)))
    .map((s) => ({ ...s, present: s.branches }));
  // [loop 29] BÁN HỢP (半合) — 2/3 chi của 1 cục (vd 申子, 子辰 = bán thủy cục). Cổ pháp công nhận
  //   bán hợp lực yếu hơn toàn cục nhưng vẫn là tương tác thật. Comment cũ hứa nhưng chưa implement.
  // [loop 749 ELEVATION] phân loại STRENGTH bán hợp (cổ pháp — 滴天髓): branches[0]=长生, [1]=帝旺,
  //   [2]=墓. 生+旺 (thiếu 墓) = mạnh nhất; 旺+墓 (thiếu 生) = trung; 生+墓 (thiếu 旺) = «拱» YẾU nhất
  //   (2 biên ôm khoảng trống, cần lưu niên/đại vận tới chi 帝旺 thiếu mới «hoá» thành cục).
  const _BAN_RANK = { '生旺': { type: 'Sinh vượng bán hợp', strength: 'mạnh', note: 'sinh+vượng đủ → lực mạnh nhất, gần thành cục' }, '旺墓': { type: 'Vượng mộ bán hợp', strength: 'trung', note: 'vượng+mộ → trung bình, sinh khí thiếu' }, '生墓': { type: 'Củng hợp (拱)', strength: 'yếu', note: '2 biên «củng» khoảng trống — YẾU nhất, cần lưu niên/đại vận tới chi 帝旺 thiếu mới hoá cục' } };
  const banHe = [];
  for (const s of ZHI_SANHE) {
    if (s.branches.every((b) => zset.has(b))) continue; // đã là toàn cục
    const present = s.branches.filter((b) => zset.has(b));
    if (present.length === 2) {
      const missing = s.branches.find((b) => !zset.has(b));
      // positions: 0=长生, 1=帝旺, 2=墓. present positions sorted.
      const ppos = s.branches.map((b, i) => zset.has(b) ? i : -1).filter((i) => i >= 0).sort();
      const key = ppos.includes(0) && ppos.includes(1) ? '生旺' : ppos.includes(1) && ppos.includes(2) ? '旺墓' : '生墓';
      const rank = _BAN_RANK[key];
      banHe.push({ wx: s.wx, name: 'Bán ' + s.name, present, missing, banType: rank.type, strength: rank.strength, banNote: rank.note, missingRole: key === '生旺' ? '墓 (kho)' : key === '旺墓' ? '长生 (sinh)' : '帝旺 (vượng — lõi)', at: present.map((b) => POS_LABEL[zhis.indexOf(b)]).filter(Boolean).join('–') });
    }
  }

  // --- Lục xung ---
  const chong = [];
  for (const [a, b, i, j] of pairs(zhis))
    if (ZHI_CHONG_MAP[a + b]) {
      const info = _CHONG_LOOKUP[a + b] || {};
      chong.push({ a, b, name: info.name, vi: info.vi, domain: info.domain, meaning: info.meaning, at: `${POS_LABEL[i]}–${POS_LABEL[j]}` });
    }

  // --- Tam hình (gồm tự hình) ---
  const xing = [];
  for (const [a, b, i, j] of pairs(zhis)) {
    const hit = ZHI_XING_PAIRS.find((p) =>
      (p.pair[0] === a && p.pair[1] === b) || (p.pair[0] === b && p.pair[1] === a));
    if (hit) xing.push({ a, b, name: hit.name, vi: hit.vi, meaning: XING_MEANING[hit.name], at: `${POS_LABEL[i]}–${POS_LABEL[j]}` });
  }
  // [loop 746] Vô ân chi hình «pháp hình»: đủ 3 chi 寅巳申 đồng hiện = NẶNG nhất (quan tụng).
  const _zset = new Set(zhis);
  if (['寅', '巳', '申'].every((z) => _zset.has(z))) {
    xing.push({ a: '寅巳申', b: '(đủ 3)', name: 'Vô ân chi hình (pháp hình)', vi: 'Pháp hình', meaning: XING_MEANING['Vô ân chi hình'], at: 'Tam hình trọn bộ', heavy: true });
  }
  // Tự hình: cùng một chi xuất hiện ≥2 lần
  const zCount = {};
  zhis.forEach((z, idx) => { (zCount[z] = zCount[z] || []).push(idx); });
  for (const [z, idxs] of Object.entries(zCount)) {
    if (idxs.length >= 2 && ZHI_XING_SELF.includes(z)) {
      xing.push({ a: z, b: z, name: 'Tự hình', vi: 'Hình tự', meaning: XING_MEANING['Tự hình'], at: idxs.map((i) => POS_LABEL[i]).join('–') });
    }
  }

  // --- Lục hại ---
  const hai = [];
  for (const [a, b, i, j] of pairs(zhis))
    if (ZHI_HAI_MAP[a + b]) {
      const info = _HAI_LOOKUP[a + b] || {};
      hai.push({ a, b, name: info.name, vi: info.vi, meaning: info.meaning, at: `${POS_LABEL[i]}–${POS_LABEL[j]}` });
    }

  // --- Tổng hợp narration ---
  const parts = [];
  if (sanHui.length) parts.push(`Tam hội ${sanHui.map((s) => s.name + '(' + s.branches.join('') + '→' + s.wx + ')').join(', ')}`);
  if (sanHe.length) parts.push(`Tam hợp ${sanHe.map((s) => s.name + '(' + s.branches.join('') + '→' + s.wx + ')').join(', ')}`);
  if (banHe.length) parts.push(`Bán hợp ${banHe.map((s) => s.present.join('') + '(thiếu ' + s.missing + '→' + s.wx + ')').join(', ')}`);
  if (ganHe.length) parts.push(`Can hợp ${ganHe.map((g) => g.a + g.b + '→' + g.hua).join(', ')}`);
  if (ganChong.length) parts.push(`Can xung (Thất Sát) ${ganChong.map((g) => g.a + '↔' + g.b).join(', ')}`);
  if (zhiHe.length) parts.push(`Chi lục hợp ${zhiHe.map((g) => g.a + g.b + '→' + g.hua).join(', ')}`);
  if (chong.length) parts.push(`Xung ${chong.map((c) => c.a + '↔' + c.b).join(', ')}`);
  if (xing.length) parts.push(`Hình ${xing.map((c) => c.a + (c.a === c.b ? '' : '–' + c.b)).join(', ')}`);
  if (hai.length) parts.push(`Hại ${hai.map((c) => c.a + '–' + c.b).join(', ')}`);

  return { ganHe, ganChong, zhiHe, sanHe, banHe, sanHui, chong, xing, hai, summary: parts.join(' · ') || 'Tứ trụ tương đối yên tĩnh, không có xung hợp rõ rệt.' };
}
