// ============================================================================
//  THẦN SÁT LƯU NIÊN KÍCH HOẠT 神煞流年激活
//  "Năm nay sao nào TRONG LÁ SỐ của tôi được kích hoạt?"
//  Kiểm lưu niên chi ↔ tàng can kích hoạt thần sát BẢN MỆNH (natal shensha).
//  Nguồn: 三命通会 流年神煞, 渊海子平 应期.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { TAO_HUA, HONG_YAN, YANG_REN, YI_MA, JIANG_XING, HUA_GAI, BRANCH_GROUP } from './shensha.js';
import { TIAN_YI } from './shensha.js';
import { TIAN_DE, YUE_DE, LU_SHEN } from './shensha.js';

const ZHI_ORDER = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

/**
 * Kiểm tất cả thần sát BẢN MỆNH xem năm nào kích hoạt.
 * @returns {{ activations:[{shensha, vi, natalAt, activatedBy, year, effect}] }}
 */
export function checkNatalActivation(R, scanYears = 10) {
  const chart = R.chart;
  const dayGan = chart.dayGan;
  const yearZhi = chart.pillars.year.zhi;
  const dayZhi = chart.pillars.day.zhi;
  const grp = BRANCH_GROUP[yearZhi];
  const grpDay = BRANCH_GROUP[dayZhi];

  // Thu thập thần sát bản mệnh + vị trí
  const natal = [];
  // Đào hoa (theo năm + ngày chi)
  const taoYear = TAO_HUA[grp];
  const taoDay = TAO_HUA[grpDay];
  // Kiểm đào hoa có trong tứ trụ không
  ['year','month','day','time'].forEach(k => {
    if (chart.pillars[k].zhi === taoYear) natal.push({ key: 'taoHua', zh: '桃花', vi: 'Đào Hoa', at: chart.pillars[k].zhi, pillar: k, type: 'branch', trigger: taoYear, effect: 'duyên sắc mạnh, tình cảm biến động' });
    if (chart.pillars[k].zhi === taoDay && taoDay !== taoYear) natal.push({ key: 'taoHuaDay', zh: '桃花(日)', vi: 'Đào Hoa (ngày)', at: chart.pillars[k].zhi, pillar: k, type: 'branch', trigger: taoDay, effect: 'duyên (theo ngày chủ)' });
  });
  // Hồng diễm
  const hongZhi = HONG_YAN[dayGan];
  ['year','month','day','time'].forEach(k => {
    if (chart.pillars[k].zhi === hongZhi) natal.push({ key: 'hongYan', zh: '红艳', vi: 'Hồng Diễm', at: hongZhi, pillar: k, type: 'branch', trigger: hongZhi, effect: 'sắc duyên, đào hoa mạnh' });
  });
  // Dương nhận
  const yrZhi = YANG_REN[dayGan];
  ['year','month','day','time'].forEach(k => {
    if (chart.pillars[k].zhi === yrZhi) natal.push({ key: 'yangRen', zh: '羊刃', vi: 'Dương Nhận', at: yrZhi, pillar: k, type: 'branch', trigger: yrZhi, effect: 'sát khí, dễ tổn thương/rủi ro' });
  });
  // Dịch mã
  const maYear = YI_MA[grp], maDay = YI_MA[grpDay];
  ['year','month','day','time'].forEach(k => {
    const z = chart.pillars[k].zhi;
    if (z === maYear || z === maDay) natal.push({ key: 'yiMa', zh: '驿马', vi: 'Dịch Mã', at: z, pillar: k, type: 'branch', trigger: z, effect: 'di chuyển, thay đổi, cơ hội nước ngoài' });
  });
  // Thiên Ất quý nhân
  const tyBranches = TIAN_YI[dayGan] || [];
  tyBranches.forEach(b => {
    ['year','month','day','time'].forEach(k => {
      if (chart.pillars[k].zhi === b) natal.push({ key: 'tianYi_' + b, zh: '天乙', vi: 'Thiên Ất', at: b, pillar: k, type: 'branch', trigger: b, effect: 'quý nhân phò trợ đắc lực' });
    });
  });
  // Lộc thần
  const luZhi = LU_SHEN[dayGan];
  ['year','month','day','time'].forEach(k => {
    if (chart.pillars[k].zhi === luZhi) natal.push({ key: 'luShen', zh: '禄神', vi: 'Lộc Thần', at: luZhi, pillar: k, type: 'branch', trigger: luZhi, effect: 'tài lộc, lương thực' });
  });
  // Tướng tinh
  const jx = JIANG_XING[grp];
  ['year','month','day','time'].forEach(k => {
    if (chart.pillars[k].zhi === jx) natal.push({ key: 'jiangXing', zh: '将星', vi: 'Tướng Tinh', at: jx, pillar: k, type: 'branch', trigger: jx, effect: 'uy quyền, lãnh đạo' });
  });

  // Quét scanYears: năm nào kích hoạt sao nào?
  const curYear = new Date().getFullYear();
  const activations = [];

  for (let i = 0; i < scanYears; i++) {
    const year = curYear + i;
    const yZhi = Solar.fromYmdHms(year, 6, 15, 12, 0, 0).getLunar().getYearZhi();
    const yGan = Solar.fromYmdHms(year, 6, 15, 12, 0, 0).getLunar().getYearGan();

    for (const star of natal) {
      let triggered = false;
      let reason = '';
      // Chi lưu niên = chi của sao → trực tiếp kích hoạt
      if (star.trigger === yZhi) { triggered = true; reason = `Lưu niên chi ${yZhi} = vị trí ${star.zh}`; }
      // Lục hợp với chi sao
      const LH = { 子:'丑', 丑:'子', 寅:'亥', 亥:'寅', 卯:'戌', 戌:'卯', 辰:'酉', 酉:'辰', 巳:'申', 申:'巳', 午:'未', 未:'午' };
      if (LH[star.trigger] === yZhi) { triggered = true; reason = `Lưu niên chi ${yZhi} lục hợp ${star.trigger}`; }
      // Xung với chi sao
      const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };
      if (CHONG[star.trigger] === yZhi) { triggered = true; reason = `Lưu niên chi ${yZhi} xung ${star.trigger}`; }

      if (triggered) {
        activations.push({
          year, yZhi, shensha: star.zh, shenshaVi: star.vi,
          natalAt: star.at, pillar: star.pillar, reason,
          effect: star.effect,
          activationType: reason.includes('xung') ? 'xung-kích hoạt (biến động)' : reason.includes('hợp') ? 'hợp-kích hoạt (hòa hợp)' : 'trùng-kích hoạt (trực tiếp mạnh)',
        });
      }
    }
  }

  // Group by year
  const byYear = {};
  for (const a of activations) {
    if (!byYear[a.year]) byYear[a.year] = [];
    byYear[a.year].push(a);
  }

  return { natalStars: natal, activations, byYear, totalNatal: natal.length };
}
