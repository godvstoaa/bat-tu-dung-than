// ============================================================================
//  KỲ MÔN ĐỘN GIÁP 奇门遁甲 — 时家奇门 (静盘/局盘 + 定局 + 吉格)
//  Hệ "三式" lừng danh, dùng chọn thời điểm/hướng đi (cát hung cục).
//  Scope vòng này: 定局 (节气×元→阳/阴遁N局) + 地盘三奇六仪 + 九星(随六仪)
//  + 八门(定宫) + 八神 + 吉格判定. (时辰动盘天盘飞旋 = bước sau.)
//  Nguồn: 奇门18局定局表, 排盘口诀 (verified).
// ============================================================================
import { Solar } from 'lunar-javascript';

// 24 节气 → 阳/阴遁 + [上元,中元,下元] 局数 (verified from 口诀)
const TERM_JU = {
  // 阳遁 (冬至→芒种)
  冬至: { yy: '阳', ju: [1, 7, 4] }, 小寒: { yy: '阳', ju: [2, 8, 5] }, 大寒: { yy: '阳', ju: [3, 9, 6] },
  立春: { yy: '阳', ju: [8, 5, 2] }, 雨水: { yy: '阳', ju: [9, 6, 3] }, 惊蛰: { yy: '阳', ju: [1, 7, 4] },
  春分: { yy: '阳', ju: [3, 9, 6] }, 清明: { yy: '阳', ju: [4, 1, 7] }, 谷雨: { yy: '阳', ju: [5, 2, 8] },
  立夏: { yy: '阳', ju: [4, 1, 7] }, 小满: { yy: '阳', ju: [5, 2, 8] }, 芒种: { yy: '阳', ju: [6, 3, 9] },
  // 阴遁 (夏至→大雪)
  夏至: { yy: '阴', ju: [9, 3, 6] }, 小暑: { yy: '阴', ju: [8, 2, 5] }, 大暑: { yy: '阴', ju: [7, 1, 4] },
  立秋: { yy: '阴', ju: [2, 5, 8] }, 处暑: { yy: '阴', ju: [1, 4, 7] }, 白露: { yy: '阴', ju: [9, 3, 6] },
  秋分: { yy: '阴', ju: [7, 1, 4] }, 寒露: { yy: '阴', ju: [6, 9, 3] }, 霜降: { yy: '阴', ju: [5, 8, 2] },
  立冬: { yy: '阴', ju: [6, 9, 3] }, 小雪: { yy: '阴', ju: [5, 8, 2] }, 大雪: { yy: '阴', ju: [4, 1, 7] },
};
const YUAN_VI = ['上元', '中元', '下元'];

// 三奇六仪 + 九星本位 (天蓬本坎1 … 天英本离9 — FIXED to洛书宫, không随六仪)
const QIYI = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];
const GONG_STAR = { 1: '天蓬', 2: '天芮', 3: '天冲', 4: '天辅', 5: '天禽', 6: '天心', 7: '天柱', 8: '天任', 9: '天英' };
const STAR_VI = { 天蓬: 'thiên bằng (đại hung)', 天芮: 'thiên nhuệ (bệnh)', 天冲: 'thiên xung (hung)', 天辅: '天phụ (cát, văn)', 天禽: 'thiên cầm (bình/trung)', 天心: 'thiên tâm (đại cát, y)', 天柱: 'thiên trụ (hung)', 天任: 'thiên nhậm (cát)', 天英: 'thiên anh (hỏa, trung)' };

// 八门 định cung (静盘): 休1 生8 伤3 杜4 景9 死2 惊7 开6
const DOOR_AT = { 1: '休', 8: '生', 3: '伤', 4: '杜', 9: '景', 2: '死', 7: '惊', 6: '开' };
const DOOR_VI = { 休: 'Hưu (cát — nghỉ/ngơi)', 生: 'Sinh (đại cát — sinh sôi/tài)', 伤: 'Thương (hung — tổn thương)', 杜: 'Đỗ (bình — ẩn náu)', 景: 'Cảnh (bình — văn/thi)', 死: 'Tử (đại hung)', 惊: 'Kinh (hung — kinh sợ)', 开: 'Khai (đại cát — mở/khai trương)' };
const JI_DOOR = ['开', '休', '生']; // 3吉门

// 宫 ↔ phương vị (洛书)
const GONG_DIR = { 1: 'Bắc (坎)', 2: 'Tây Nam (坤)', 3: 'Đông (震)', 4: 'Đông Nam (巽)', 5: 'Trung cung', 6: 'Tây Bắc (乾)', 7: 'Tây (兑)', 8: 'Đông Bắc (艮)', 9: 'Nam (离)' };

/**
 * Định局 + xếp静盘 cho một dương lịch ngày giờ.
 * @returns {{ term, yuan, yinYang, ju, pan:[{gong,dir,qiyi,star,starVi,door,doorVi,isCat}], gige, advice }}
 */
export function qimenPan(year, month, day, hour = 12) {
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const lunar = solar.getLunar();
  const prev = lunar.getPrevJieQi();
  const term = prev.getName();
  const termStart = prev.getSolar();
  const info = TERM_JU[term] || TERM_JU['冬至'];
  // 元: số ngày từ tiết khí → div 5 (gần đúng, bỏ qua 正授/置闰 tinh tế)
  const ms = (s) => new Date(s.getYear(), s.getMonth() - 1, s.getDay()).getTime();
  const daysSince = Math.floor((ms(solar) - ms(termStart)) / 86400000);
  const yuanIdx = Math.max(0, Math.min(2, Math.floor(daysSince / 5) % 3));
  const yinYang = info.yy;
  const ju = info.ju[yuanIdx];

  // 地盘: 戊起 局宫, 阳 顺 / 阴 逆 (theo宫数 1-9)
  const gongQiyi = {}; // gong -> qiyi
  for (let i = 0; i < 9; i++) {
    const g = yinYang === '阳'
      ? ((ju - 1 + i) % 9) + 1
      : ((ju - 1 - i + 90) % 9) + 1;
    gongQiyi[g] = QIYI[i];
  }
  // xếp 9 cung
  const pan = [];
  for (let g = 1; g <= 9; g++) {
    const qy = gongQiyi[g];
    const star = GONG_STAR[g];
    const door = DOOR_AT[g] || (g === 5 ? '(trung)' : '');
    const isCat = JI_DOOR.includes(door) && ['丁', '丙', '乙'].includes(qy);
    pan.push({ gong: g, dir: GONG_DIR[g], qiyi: qy, star, starVi: STAR_VI[star] || '', door, doorVi: DOOR_VI[door] || '', isCat });
  }
  // 吉格: các cung cát
  const gige = pan.filter((p) => p.isCat).map((p) => `${p.dir} — ${p.door}门 + ${p.qiyi}奇 + ${p.star}`);
  const advice = gige.length
    ? `Hướng CÁT dùng sự (吉门+三奇): ${gige.join(' | ')}. Nên tiến hành việc lớn hướng này.`
    : `Cục không có cung "吉门+三奇" trùng → tránh tiến thủ lớn; chọn cung có 吉门 (开/休/生) tạm.`;
  return { term, yuan: YUAN_VI[yuanIdx], yinYang, ju, pan, gige, advice, note: '局盘静盘 (时辰天盘飞旋 + 置闰 tinh tế = bước cải tiến sau).' };
}

export { TERM_JU, QIYI, GONG_STAR, DOOR_AT, GONG_DIR };

// ---- 旬首 → 六仪 (六甲遁干) ----
const XUN_YI = ['戊', '己', '庚', '辛', '壬', '癸']; // 甲子/甲戌/甲申/甲午/甲辰/甲寅
const XUN_NAME = ['甲子', '甲戌', '甲申', '甲午', '甲辰', '甲寅'];
// 八神 thứ tự
const BASHEN = ['值符', '螣蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天'];
const GONG_DOOR = { 1: '休', 2: '死', 3: '伤', 4: '杜', 6: '开', 7: '惊', 8: '生', 9: '景' };

// 60甲子 → (旬index)
const GAN10 = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI12 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
function seq60(gan, zhi) { const gi = GAN10.indexOf(gan), zi = ZHI12.indexOf(zhi); if (gi < 0 || zi < 0) return -1; let s = 0; for (let k = 0; k < 60; k++) { if (GAN10[k % 10] === gan && ZHI12[k % 12] === zhi) { s = k + 1; break; } } return s; }

/**
 * 动盘: thêm tầng thời-động (旬首→值符/值使 + 值符随时干 + 八神) lên静盘.
 */
export function qimenDongPan(year, month, day, hour) {
  const base = qimenPan(year, month, day, hour || 12);
  const solar = Solar.fromYmdHms(year, month, day, hour || 12, 0, 0);
  const lunar = solar.getLunar();
  const hGan = lunar.getTimeGan(), hZhi = lunar.getTimeZhi();
  const seq = seq60(hGan, hZhi);
  const xunIdx = seq > 0 ? Math.floor((seq - 1) / 10) : 0;
  const xunYi = XUN_YI[xunIdx];
  const xunName = XUN_NAME[xunIdx];
  // 旬首六仪 ở地盘 nào → 值符星 (本位星 of cung) + 值使门
  const xunGong = base.pan.find((p) => p.qiyi === xunYi)?.gong;
  const zhiFuStar = GONG_STAR[xunGong];
  const zhiShiDoor = GONG_DOOR[xunGong];
  // 时干 ở地盘 nào → 值符随时干落 đây
  const tg = (hGan === '甲') ? xunYi : hGan; // 甲 ẩn → dùng 六仪旬首
  const tgGong = base.pan.find((p) => p.qiyi === tg)?.gong;
  // 值使随时支: từ cung 值使 (zhiShi原宫本位) 飞泊 theo 时支序, 阳/阴
  const hZhiIdx = ZHI12.indexOf(hZhi) + 1; // 1..12
  const step = hZhiIdx;
  let zhiShiLanding = zhiShiDoor ? Object.keys(GONG_DOOR).find((g) => GONG_DOOR[g] === zhiShiDoor) : null;
  if (zhiShiLanding) {
    zhiShiLanding = +zhiShiLanding;
    for (let i = 0; i < step; i++) {
      zhiShiLanding = base.yinYang === '阳' ? (zhiShiLanding % 9) + 1 : ((zhiShiLanding - 1 - 1 + 9) % 9) + 1;
    }
  }
  // 直符(神)落 = 值符星天盘落 (随时干) = tgGong
  return {
    ...base,
    dong: {
      hourGanZhi: hGan + hZhi, xunName, xunYi, xunGong,
      zhiFuStar, zhiFuStarVi: STAR_VI[zhiFuStar] || '',
      zhiShiDoor, zhiShiDoorVi: DOOR_VI[zhiShiDoor] || '',
      shiGan: hGan, shiGanGong: tgGong,
      zhiFuLanding: tgGong, // 值符随时干
      zhiShiLanding,
      zhiFuShenLanding: tgGong, // 直符(神)随值符星
      bashen: BASHEN,
    },
  };
}

