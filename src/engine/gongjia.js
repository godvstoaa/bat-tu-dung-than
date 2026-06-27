// ============================================================================
//  拱夹 (GONGJIA — arching/squeezing) — 2 chi cách 2 vị trí «夹» chi giữa (ảo)
//  "Hai trụ chi kẹp 1 chi ẩn → củng cố cung/vẻ đẹp đó" (cổ pháp hiếm, 子平/盲派).
//  vd: 寅+辰 → 拱卯; 亥+丑 → 拱子. Chi ảo = strengthen 行/palace đó.
//  Đặc biệt: 拱禄 (夹 Lộc vị), 拱贵 (夹 Thiên Ất quý nhân) → đại cát.
//  Nguồn: 子平真诠 拱格, 渊海子平 论拱.
// ============================================================================
import { GAN, HIDDEN, WX_VI } from './constants.js';

const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const PILLAR_VI = { year: 'Niên', month: 'Nguyệt', day: 'Nhật', time: 'Thời' };

// 天乙贵 người theo can (classic lookup)
const TIANYI = {
  甲: ['丑', '未'], 乙: ['子', '申'], 丙: ['亥', '酉'], 丁: ['亥', '酉'],
  戊: ['丑', '未'], 己: ['子', '申'], 庚: ['丑', '未'], 辛: ['寅', '午'],
  壬: ['卯', '巳'], 癸: ['卯', '巳'],
};
// 禄 (临官) theo can
const LU = { 甲: '寅', 乙: '卯', 丙: '巳', 丁: '午', 戊: '巳', 己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子' };

/**
 * @returns {{ arches:[{from,to,z1,z2,arched,archedWx,type}], summary }}
 */
export function detectGongjia(R) {
  const pillars = R.chart?.pillars;
  if (!pillars) return { arches: [], summary: '' };
  const dayGan = R.chart.dayGan;
  const keys = ['year', 'month', 'day', 'time'];
  const arches = [];

  // chỉ check cặp TRỤ LIỀN NHAU (year-month, month-day, day-time) — cổ法 拱 chỉ giữa trụ kề
  for (let i = 0; i < keys.length - 1; i++) {
    const z1 = pillars[keys[i]].zhi;
    const z2 = pillars[keys[i + 1]].zhi;
    const idx1 = ZHI_ORDER.indexOf(z1);
    const idx2 = ZHI_ORDER.indexOf(z2);
    if (idx1 < 0 || idx2 < 0) continue; // [loop 560 FIX BUG3] chi undefined/invalid → midIdx rác
    const d = Math.abs(idx1 - idx2);
    let midIdx = -1;
    if (d === 2) midIdx = Math.min(idx1, idx2) + 1;
    else if (d === 10) midIdx = (Math.max(idx1, idx2) + 1) % 12; // wrap (vd 亥+丑 → 子)
    if (midIdx < 0) continue;

    const arched = ZHI_ORDER[midIdx];
    const archedWx = GAN[HIDDEN[arched][0]].wx;
    // phân loại: 拱禄 / 拱贵 / 普通
    let type = '普通拱';
    if (LU[dayGan] === arched) type = '拱禄 (夹 Lộc vị) — ĐẠI CÁT';
    else if ((TIANYI[dayGan] || []).includes(arched)) type = '拱贵 (夹 Thiên Ất quý nhân) — CÁT';
    // có phải Dụng/Hỷ?
    else if (R.yong && (R.yong.primary === archedWx || R.yong.xi === archedWx)) type = '拱 Dụng/Hỷ — thuận';

    arches.push({
      from: PILLAR_VI[keys[i]], to: PILLAR_VI[keys[i + 1]],
      z1, z2, arched, archedWx: WX_VI[archedWx], type,
    });
  }

  const summary = arches.length
    ? arches.map((a) => `${a.from}(${a.z1}) + ${a.to}(${a.z2}) → 拱 ${a.arched}(${a.archedWx}): ${a.type}`).join(' · ')
    : 'Không phát hiện 拱夹 — tứ trụ chi không kẹp chi ẩn.';

  return { arches, summary };
}
