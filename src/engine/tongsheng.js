// ============================================================================
//  HOÀNG LỊ 黄历 (通胜) — MỖI NGÀY 宜/忌
//  Tính cho 1 ngày: trực 建除十二神 + hoàng/hắc đạo + 宜/忌 theo trực +
//  đại hung (四绝/四离/岁破/月破) + xung thai tuế. Nguồn: 通胜, 协纪辨方, 百度百科.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { ZHI } from './constants.js';

const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
const OFFICERS = ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'];
const OFFICER_VI = { 建:'Kiến', 除:'Trừ', 满:'Mãn', 平:'Bình', 定:'Định', 执:'Chấp', 破:'Phá', 危:'Nguy', 成:'Thành', 收:'Thu', 开:'Khai', 闭:'Bế' }; // exported line below (loop 1103 reuse)
// 黄道(吉)/黑道(凶) theo 口诀 "建满平收黑, 除危定执黄, 成开皆可用, 破闭不可当"
const OFFICER_ROAD = { 建: 'black', 满: 'black', 平: 'black', 收: 'black', 破: 'black', 闭: 'black', 除: 'yellow', 危: 'yellow', 定: 'yellow', 执: 'yellow', 成: 'yellow', 开: 'yellow' };

// 12 trực → 宜/忌 (theo 通胜/百度百科 + research)
const OFFICER_YIJI = {
  建: { yi: ['出行', '开市', '立券', '交易', '纳财', '赴任', '会亲友'], ji: ['开仓', '掘井', '乘船'] },
  除: { yi: ['疗病', '嫁娶', '祈福', '祭祀', '出行', '除服'], ji: ['求功名', '上任'] },
  满: { yi: ['祭祀', '祈福', '修仓', '补垣', '塞穴'], ji: ['嫁娶', '安葬', '赴任', '求医'] },
  平: { yi: ['修造', '动土', '治水', '平整'], ji: ['嫁娶', '求嗣', '祈福', '开渠'] },
  定: { yi: ['签约', '交易', '定亲', '纳采', '冠笄', '入学', '出行', '入宅'], ji: ['诉讼', '打官司'] },
  执: { yi: ['捕捉', '狩猎', '签约', '进货'], ji: ['开市', '出行', '移徙', '开仓'] },
  破: { yi: ['破屋', '求医疗病', '拆除'], ji: ['嫁娶', '开市', '签约', '出行', '入宅', '安葬'] },
  危: { yi: ['安床', '祭祀', '祈福', '登高'], ji: ['诉讼', '冒险'] },
  成: { yi: ['嫁娶', '开市', '入学', '赴任', '签约', '交易', '出行', '祈福', '求嗣', '入宅'], ji: ['诉讼'] },
  收: { yi: ['嫁娶', '纳财', '收获', '纳畜', '捕捉'], ji: ['出行', '安葬', '开市'] },
  开: { yi: ['开市', '入学', '赴任', '出行', '嫁娶', '动土', '上梁', '求嗣'], ji: ['安葬', '下葬'] },
  闭: { yi: ['筑堤', '塞穴', '安葬', '筑墙'], ji: ['开市', '出行', '嫁娶', '求医', '动土', '开仓'] },
};

/**
 * Hoàng lịch một ngày.
 * @returns {{ solar, lunar, dayGanZhi, officer, officerVi, road, yi, ji, bigBad, chongYear, chongMonth, advice }}
 */
export function tongshengDay(year, month, day, userZhi) {
  const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = solar.getLunar();
  const dZhi = lunar.getDayZhi(), mZhi = lunar.getMonthZhi(), yZhi = lunar.getYearZhi();
  const oIdx = ((ZHI_ORDER.indexOf(dZhi) - ZHI_ORDER.indexOf(mZhi)) + 12) % 12;
  const officer = OFFICERS[oIdx];
  const yiji = OFFICER_YIJI[officer];

  // Đại hung: 四绝 (trước四立), 四离 (trước二分二至)
  let bigBad = null;
  const silLis = ['立春', '立夏', '立秋', '立冬']; // 四立 → 前一天 = 四绝
  const fenZhi = ['春分', '夏至', '秋分', '冬至']; // 二分二至 → 前一天 = 四离
  const jqt = lunar.getJieQiTable ? lunar.getJieQiTable() : {};
  const next = solar.next(1);
  const matchJq = (names) => names.some((n) => { const s = jqt[n]; return s && s.getYear() === next.getYear() && s.getMonth() === next.getMonth() && s.getDay() === next.getDay(); });
  if (matchJq(silLis)) bigBad = '四绝 (Tứ Tuyệt — trước四立, đại hung)';
  else if (matchJq(fenZhi)) bigBad = '四离 (Tứ Ly — trước分至, đại hung)';

  // 岁破 (day chi xung year chi 太岁), 月破 (day chi xung month chi)
  if (CHONG[yZhi] === dZhi) bigBad = '岁破 (Tuế Phá — xung Thái Tuế, đại hung, chư sự bất nghi)';
  if (CHONG[mZhi] === dZhi) bigBad = (bigBad ? bigBad + ' + ' : '') + '月破 (Nguyệt Phá)';

  // Xung tuổi cá nhân
  const chongYear = userZhi ? (CHONG[dZhi] === userZhi) : false;

  // [loop 65 sửa] road/hoàng-hắc đạo ưu tiên THIÊN THẦN (12 青龙/明堂/...) thay vì
  //   OFFICER_ROAD (建除 folk mnemonic — thường mâu thuẫn天神). 天神 đã tính ở line 75.
  const tsYi = lunar.getDayYi ? (lunar.getDayYi() || []) : [];
  const tsJi = lunar.getDayJi ? (lunar.getDayJi() || []) : [];
  const tianShen = lunar.getDayTianShen ? lunar.getDayTianShen() : '';
  const caiShenDir = lunar.getDayPositionCaiDesc ? lunar.getDayPositionCaiDesc() : '';
  const xiShenDir = lunar.getDayPositionXiDesc ? lunar.getDayPositionXiDesc() : '';
  const HUANG_TIANSHEN = ['青龙','明堂','金匮','天德','玉堂','司命'];
  const tianShenRoad = HUANG_TIANSHEN.includes(tianShen) ? 'yellow' : (tianShen ? 'black' : '');
  const road = tianShenRoad || OFFICER_ROAD[officer]; // ưu tiên 天神, fallback officer

  let advice;
  if (bigBad) advice = `⚠ ${bigBad} — ĐẠI HUNG, “chư sự bất nghi”: tránh việc lớn (cưới/khai trương/dọn nhà/động thổ/ký kết).`;
  else if (road === 'yellow') advice = `Trực ${OFFICER_VI[officer]} · 天神 ${tianShen} (HOÀNG ĐẠO) — nền cát; làm các việc trong “宜” thuận.`;
  else advice = `Trực ${OFFICER_VI[officer]} · 天神 ${tianShen} (HẮC ĐẠO) — nên hạn chế việc lớn; chỉ làm việc trong “宜”.`;
  if (chongYear) advice += ` ⚠ Ngày xung tuổi bạn (${ZHI[userZhi]?.vi || userZhi}) — cá nhân càng cẩn trọng.`;

  return {
    solar: solar.toYmd(), lunar: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    dayGanZhi: lunar.getDayGan() + dZhi, officer, officerVi: OFFICER_VI[officer],
    road, yi: yiji.yi, ji: yiji.ji, bigBad, chongYear,
    tsYi, tsJi, tianShen, tianShenRoad, caiShenDir, xiShenDir,
    advice,
  };
}

export { OFFICERS, OFFICER_VI, OFFICER_YIJI };
