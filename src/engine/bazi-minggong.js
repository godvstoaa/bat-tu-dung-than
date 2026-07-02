// ============================================================================
//  BÁT TỰ MỆNH CUNG 八字命宫 — "TRỤ THỨ 6" (sau tứ trụ + thai nguyên)
//  Khác Tử Vi: Bát Tự dùng mệnh cung như trụ bổ sung để luận thêm.
//  Công thức: 寅起正月順數月生月, 逆數生時 → mệnh cung chi.
//  Nguồn: 韋千里《千里命稿》, 三命通会, 渊海子平.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod } from './core.js';
import { ziShiRoll } from './chart.js'; // [loop 178] 命宫 bẩm sinh dùng cùng 子时换日 八字

const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const YIN_ORDER = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
const WUHU = { 甲:'丙', 己:'丙', 乙:'戊', 庚:'戊', 丙:'庚', 辛:'庚', 丁:'壬', 壬:'壬', 戊:'甲', 癸:'甲' };

/**
 * @returns {{ ganZhi, gan, zhi, ganVi, zhiVi, wx, god, godVi, nayin,
 *            interactionWithDay, strength, meaning }}
 */
// [loop 1248] 命宫 ý nghĩa + 起例 (《三命通会》«命宫» + 知乎).
export const MINGGONG_INFO = {
  meaning: 'Mệnh cung (命宫) = «trụ thứ 5» sau tứ trụ + thai nguyên — chủ khí chất bẩm sinh, tiềm thức, «thần minh cư trú chi xứ». Bổ túc nhật chủ cho bức tranh mệnh.',
  qili: 'Khởi lệ: (tháng sinh - giờ chi) mod 12 → mệnh cung địa chi; thiên can «ngũ hổ đào» từ năm can → dần cung → tiến tới mệnh cung chi.',
  note: 'Mệnh cung xung khắc nhật trụ → nội tâm với bề ngoài bất nhất; mệnh cung đắc dụng → chủ quan phương hướng phát triển.',
};

export function baziMingGong(R) {
  const chart = R.chart;
  // [loop 178] 子时换日 — đồng bộ buildChart: chart.input giữ giờ thật, roll cho tính âm lịch
  const [my, mm, md, mh, mmin] = ziShiRoll(chart.input.year, chart.input.month, chart.input.day, chart.input.hour, chart.input.minute);
  const lunar = Solar.fromYmdHms(my, mm, md, mh, mmin, 0).getLunar();
  // [loop 563 FIX BUG1] tháng nhuận: getMonth() trả ÂM (闰二月=-2) →命宫 SAI. 同 bug ziwei loop 548.
  const _rawM = lunar.getMonth();
  const lm = _rawM > 0 ? _rawM : Math.abs(_rawM) + 1; // nhuận月 = tháng kế (闰二→3)
  const timeZhi = lunar.getTimeZhi();
  const hourOrder = ZHI_ORDER.indexOf(timeZhi) + 1;
  const yearGan = lunar.getYearGan();

  // Mệnh cung chi: YIN_ORDER[(lm - hourOrder) mod 12]
  const mgIdx = ((lm - hourOrder) % 12 + 12) % 12;
  const mgZhi = YIN_ORDER[mgIdx];

  // Mệnh cung can: ngũ hổ遁 từ năm can → 寅 cung can → tiến đến mệnh cung chi
  const yinGan = WUHU[yearGan];
  const yinGanIdx = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'].indexOf(yinGan);
  const yinZhiPos = ZHI_ORDER.indexOf('寅');
  const mgZhiPos = ZHI_ORDER.indexOf(mgZhi);
  const steps = (mgZhiPos - yinZhiPos + 12) % 12;
  const mgGan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'][(yinGanIdx + steps) % 10];

  const dayGan = chart.dayGan;
  const god = tenGod(dayGan, mgGan);
  const wx = GAN[mgGan].wx;

  // Tương tác với nhật trụ
  const dayZhi = chart.pillars.day.zhi;
  const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };
  const GAN_HE = { 甲:'己', 己:'甲', 乙:'庚', 庚:'乙', 丙:'辛', 辛:'丙', 丁:'壬', 壬:'丁', 戊:'癸', 癸:'戊' };
  const ZHI_LIUHE = ['子丑','寅亥','卯戌','辰酉','巳申','午未'];

  let interaction = '';
  if (GAN_HE[mgGan] === dayGan) interaction = `Can hợp với Nhật Can (${mgGan}+${dayGan}) → mệnh cung HỢP nhật chủ → bản mệnh thuận, dễ thành.`;
  else if (CHONG[mgZhi] === dayZhi) interaction = `Chi XUNG Nhật Chi (${mgZhi}↔${dayZhi}) → mệnh cung XUNG cung gốc → bản mệnh phải vượt khó.`;
  else if (ZHI_LIUHE.some((p) => p === mgZhi+dayZhi || p === dayZhi+mgZhi)) interaction = `Chi LỤC HỢP với Nhật Chi (${mgZhi}+${dayZhi}) → nền tảng vững.`;
  else if (mgGan === dayGan) interaction = `Can đồng Nhật Can → mệnh cung cộng hưởng bản mệnh.`;
  else interaction = `Mệnh cung trung tính với nhật trụ — đọc theo thập thần ${TEN_GOD_VI[god] || god}.`;

  // Nạp âm (tra nhanh)
  const nayinPairs = ['金','火','木','土','金','火','水','土','金','木','水','土','火','木','水','金','火','木','土','金','火','水','土','金','木','水','土','火','木','水'];
  let nayinWx = '?';
  for (let i = 0; i < 60; i++) {
    if (['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'][i % 10] === mgGan && ZHI_ORDER[i % 12] === mgZhi) {
      nayinWx = nayinPairs[Math.floor(i / 2)]; break;
    }
  }

  // Đánh giá strength: mệnh cung hành có bổ Dụng Thần không?
  // [loop 563 FIX BUG2] xét cả secondary + avoid[] — trước đây chỉ primary/xi/ji/chou.
  const _y = R.yong || {};
  const isYong = (_y.primary === wx || _y.xi === wx || _y.secondary === wx);
  const isJi = (_y.ji === wx || _y.chou === wx || (_y.avoid || []).includes(wx));

  const meaning = `Mệnh cung ${mgGan}${mgZhi} (${GAN[mgGan].vi} ${ZHI[mgZhi].vi}), thập thần ${TEN_GOD_VI[god] || god}, hành ${WX_VI[wx]}. ` +
    `${interaction} ` +
    `${isYong ? 'Mệnh cung mang hành DỤNG THẦN → bổ mệnh, rất tốt.' : isJi ? 'Mệnh cung mang hành KỴ → tăng áp lực.' : 'Mệnh cung trung tính với Dụng Thần.'} ` +
    `Nạp âm: ${nayinWx}.`;

  return {
    ganZhi: mgGan + mgZhi, gan: mgGan, zhi: mgZhi,
    ganVi: GAN[mgGan].vi, zhiVi: ZHI[mgZhi].vi,
    wx, wxVi: WX_VI[wx],
    god, godVi: TEN_GOD_VI[god] || god,
    nayinWx, interactionWithDay: interaction,
    isYong, isJi, meaning,
  };
}
