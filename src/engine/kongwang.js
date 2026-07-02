// ============================================================================
//  KHÔNG VONG 空亡 (旬空) — hai Địa Chi KHÔNG CÓ trong旬 của Nhật Trụ
//  "空则不实" — cung/sao ngồi trên chi không vong → hiệu ứng trì hoãn,
//  phiệt, hoặc không hiện; đến khi bị 流年/大运 冲空/合空/填实 mới phát.
//  Nguồn: 六十甲子旬空表 (verified).
// ============================================================================
import { ZHI, ZHI_ORDER } from './constants.js';
import { tenGod } from './core.js';

// 6 旬 → 2 chi không vong
const XUN_KONG = {
  甲子: ['戌', '亥'],  // 甲子旬 (1-10): 戌亥 không
  甲戌: ['申', '酉'],  // 甲戌旬 (11-20): 申酉 không
  甲申: ['午', '未'],  // 甲申旬 (21-30): 午未 không
  甲午: ['辰', '巳'],  // 甲午旬 (31-40): 辰巳 không
  甲辰: ['寅', '卯'],  // 甲辰旬 (41-50): 寅卯 không
  甲寅: ['子', '丑'],  // 甲寅旬 (51-60): 子丑 không
};
// [loop 1246] 空亡口诀 (六甲旬空, mnemonic). Nguồn: XUN_KONG verified (kongwang tests) + 《三命通会》.
//   «Không vong» = 2 địa chi KHÔNG CÓ trong 60甲子旬 của nhật can chi → «treo/phiệt», tạm không active,
//   vận đáo thì thực. Chủ: hữu dực nan phi, hữu chí nan triển, ngẫu nhiên/bất định.
export const KONGWANG_KOUJUE = '甲子旬中空戌亥，甲戌旬中空申酉，甲申旬中空午未，甲午旬中空辰巳，甲辰旬中空寅卯，甲寅旬中空子丑。';
export const KONGWANG_INFO = 'Không vong (旬空) — 2 địa chi vắng trong 60甲子旬 của nhật trụ; «treo/phiệt» tạm không phát huy, «hữu dực nan phi, hữu chí nan triển»; đợi vận/sơn đến thì «đ출 không» mới thực. Hung thần nhập không không tác họa, cát thần nhập không không tác phúc.';

// Tìm旬首 của một干支
const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
function xunOf(gan, zhi) {
  const gi = GAN.indexOf(gan), zi = ZHI_ORDER.indexOf(zhi);
  if (gi < 0 || zi < 0) return '甲子';
  for (let k = 0; k < 60; k++) {
    if (GAN[k % 10] === gan && ZHI_ORDER[k % 12] === zhi) {
      const xunIdx = Math.floor(k / 10);
      return ['甲子', '甲戌', '甲申', '甲午', '甲辰', '甲寅'][xunIdx];
    }
  }
  return '甲子';
}

const PALACE_VI = {
  year: 'Trụ Năm (cung tổ thượng / sớm đời)',
  month: 'Trụ Tháng (cung cha mẹ / huynh đệ)',
  day: 'Trụ Ngày (cung phối ngẫu / bản thân)',
  time: 'Trụ Giờ (cung tử nữ / vãn niên)',
};

/**
 * Phân tích không vong cho một lá số.
 * @returns {{ kong:[2 chi], xun, affected:[{pos, zhi, god, palace, note }], note }}
 */
export function analyzeKongwang(chart) {
  const dayGan = chart.dayGan;
  const dayGanZhi = chart.pillars.day.gan + chart.pillars.day.zhi;
  const xun = xunOf(chart.pillars.day.gan, chart.pillars.day.zhi);
  const kong = XUN_KONG[xun] || ['戌', '亥'];

  const affected = [];
  for (const key of ['year', 'month', 'day', 'time']) {
    const zhi = chart.pillars[key].zhi;
    if (kong.includes(zhi)) {
      const god = key === 'day' ? 'Nhật Chủ' : chart.pillars[key].ganGod;
      let note = '';
      if (key === 'year') note = 'Cung tổ thượng không → tuổi thơ biến động, sớm tự lập; cha mẹ tổ giúp ít.';
      else if (key === 'month') note = 'Cung cha mẹ/huynh đệ không → duyên gia đạo hơi mỏng, anh em xa.';
      else if (key === 'day') note = 'Cung phối ngẫu (Nhật Chi) không → hôn nhân trì hoãn, cần bị 冲/填 thực mới thành;';
      else if (key === 'time') note = 'Cung tử nữ không → duyên con muộn; khi lưu niên/đại vận tới chi đó = "xuất không" → sự kiện phát.';
      affected.push({ pos: key, zhi, god: god, palace: PALACE_VI[key], note, isDay: key === 'day' });
    }
  }

  // Tìm các lưu niên/đại vận sắp tới có chi = kong chi → "xuất không"
  const tips = [];
  if (affected.length) {
    tips.push(`Chi không vong = ${kong.join(', ')}. Khi 大运/流年 mang chi này (hoặc 冲 chi này) → "xuất không" / "thực không" → sự việc BỊ TREO bấy giờ mới phát tác.`);
  }

  return {
    xun, kong, affected,
    note: affected.length
      ? `${affected.length} trụ rơi không vong: ${affected.map((a) => a.pos).join(', ')}. 空亡 = "treo" (phiệt), không phải mất — đợi vận đến mới thực.`
      : 'Không trụ nào rơi không vong — lá số không bị treo.',
    tips,
  };
}

export { XUN_KONG, xunOf };
