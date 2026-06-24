// ============================================================================
//  HÔN NHÂN SÂU — phân tích chuyên sâu hôn nhân/tình duyên
//  Kết hợp: 夫妻宫 (日支) + 配偶星 + 红鸾天喜 + 桃花 + 十神组合
//  Nguồn: 知乎合婚专栏, 天机爻Wiki, 百度百科 红鸾天喜.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI, SHENG, KE, KE_BY } from './constants.js';
import { tenGod } from './core.js';

// 红鸾天喜 — tra theo年支
const HONGLUAN = { 子:'卯', 丑:'寅', 寅:'丑', 卯:'子', 辰:'亥', 巳:'戌', 午:'酉', 未:'申', 申:'未', 酉:'午', 戌:'巳', 亥:'辰' };
const TIANXI = { 子:'酉', 丑:'申', 寅:'未', 卯:'午', 辰:'巳', 巳:'辰', 午:'卯', 未:'寅', 申:'丑', 酉:'子', 戌:'亥', 亥:'戌' };

// 夫妻宫 (日支) 十神 luận
const SPOUSE_PALACE = {
  '正財': 'Chính Tài tọa cung phu thê → vợ/chồng có trách nhiệm, ổn định, gia đạo vững (đắc vị = tốt)',
  '偏財': 'Thiên Tài tọa cung → bạn đời phóng khoáng, giao tế rộng; biến động nếu kỵ',
  '正官': 'Chính Quan tọa cung → bạn đời đoàng hoàng, có địa vị (nữ mệnh đắc vị = tốt)',
  '七殺': 'Thất Sát tọa cung → bạn đời mạnh mẽ, áp lực; cần chế mới yên',
  '正印': 'Chính Ấn tọa cung → bạn đời bao dung, chăm sóc; ấm no',
  '偏印': 'Thiên Ấn tọa cung → bạn đời lập dị, trực giác; cần hiểu nhau',
  '食神': 'Thực Thần tọa cung → bạn đời tài hoa, hoà thuận, hưởng phúc',
  '傷官': 'Thương Quan tọa cung → bạn đời sáng tạo nhưng dễ cãi vã; cần ấn chế',
  '比肩': 'Tỷ Kiên tọa cung → bạn đời độc lập, ngang hàng; dễ tranh giành',
  '劫財': 'Kiếp Tài tọa cung → bạn đời mạo hiểm; hôn nhân biến động',
};

/**
 * Phân tích hôn nhân sâu.
 * @param {object} R - analyze result
 * @returns {{ paragraphs, summary, marriageScore, timing }}
 */
export function analyzeMarriageDeep(R) {
  const chart = R.chart;
  const isMale = chart.input.gender === 'nam';
  const dm = chart.dayMaster;
  const dmWx = dm.wx;
  const yong = R.yong;
  const dayZhi = chart.pillars.day.zhi;
  const dayZhiGod = chart.pillars.day.hidden[0].god;
  const dayZhiGodVi = TEN_GOD_VI[dayZhiGod] || dayZhiGod;

  // Sao phối ngẫu
  const spouseWx = isMale ? KE[dmWx] : KE_BY[dmWx];
  const spouseStarVi = isMale ? 'Tài (vợ)' : 'Quan Sát (chồng)';
  const spouseIsFav = [yong.primary, yong.xi].includes(spouseWx);
  const spouseIsKy = [yong.ji, yong.chou].includes(spouseWx);

  // 红鸾天喜
  const yearZhi = chart.pillars.year.zhi;
  const hongLuanZhi = HONGLUAN[yearZhi];
  const tianXiZhi = TIANXI[yearZhi];
  const allZhi = ['year','month','day','time'].map(k => chart.pillars[k].zhi);
  const hasHongLuan = allZhi.includes(hongLuanZhi);
  const hasTianXi = allZhi.includes(tianXiZhi);

  // Cung phu thê bị xung?
  const interactions = R.interactions;
  const dayChong = interactions.chong.some(c => c.a === dayZhi || c.b === dayZhi);
  const dayXing = interactions.xing.some(x => x.a === dayZhi || x.b === dayZhi);
  const dayHe = interactions.zhiHe.some(h => h.a === dayZhi || h.b === dayZhi);

  // Tính sao phối ngẫu số lượng
  const gods = {};
  for (const key of ['year','month','time']) {
    const g = chart.pillars[key].ganGod;
    if (g && g !== '日主') gods[g] = (gods[g]||0)+1;
  }
  for (const key of ['year','month','day','time']) {
    const m = chart.pillars[key].hidden?.[0];
    if (!m || !m.god) continue;
    gods[m.god] = (gods[m.god]||0)+0.5;
  }
  const spouseGodKey = isMale ? ['正財','偏財'] : ['正官','七殺'];
  const spouseCount = spouseGodKey.reduce((s,g) => s+(gods[g]||0), 0);

  // Chấm điểm hôn nhân
  let score = 50;
  const factors = [];

  // 1. Sao phối ngẫu = Dụng/Hỷ → tốt
  if (spouseIsFav) { score += 15; factors.push('Sao phối ngẫu = DỤNG/HỶ → bạn đời mang lại may mắn, bổ mệnh (+15)'); }
  else if (spouseIsKy) { score -= 12; factors.push('Sao phối ngẫu = KỴ/THÙ → hôn nhân có thể mang trở ngại (−12)'); }

  // 2. Cung phu thê đắc vị
  const palaceNote = SPOUSE_PALACE[dayZhiGod];
  if (['正財','正官','正印','食神'].includes(dayZhiGod)) { score += 8; factors.push('Cung phu thê đắc vị (' + dayZhiGodVi + ') → ổn định (+8)'); }
  else if (['七殺','傷官','劫財'].includes(dayZhiGod)) { score -= 8; factors.push('Cung phu thê thất vị (' + dayZhiGodVi + ') → biến động (−8)'); }

  // 3. Cung bị xung/hình
  if (dayChong) { score -= 12; factors.push('Cung phu thê (日支 ' + dayZhi + ') BỊ XUNG → hôn nhân biến động, kết hôn muộn tốt (−12)'); }
  if (dayXing) { score -= 6; factors.push('Cung phu thê bị HÌNH → bất hòa (−6)'); }
  if (dayHe) { score += 6; factors.push('Cung phu thê được HỢP → hoà thuận (+6)'); }

  // 4. Sao phối ngẫu số lượng
  if (spouseCount >= 2) { score += 5; factors.push('Sao phối ngẫu vượng (' + spouseCount + ') → duyên nhiều, dễ kết hôn (+5)'); }
  else if (spouseCount < 0.5) { score -= 8; factors.push('Sao phối ngẫu khuyết/mờ → duyên muộn, cần nỗ lực (−8)'); }

  // 5. 红鸾天喜
  if (hasHongLuan) { score += 8; factors.push('有红鸾星 @' + hongLuanZhi + ' → duyên tốt, dễ gặp người ưng (+8)'); }
  if (hasTianXi) { score += 5; factors.push('有天喜星 @' + tianXiZhi + ' →喜事, gặp dữ hóa lành (+5)'); }

  score = Math.max(15, Math.min(95, Math.round(score)));

  // Thời điểm kết hôn tốt
  const goodYears = (R.liunian || []).filter(l => l.score >= 1 && [yong.primary, yong.xi].includes(GAN[l.gan].wx)).map(l => l.year);

  // Tóm tắt
  const summary = score >= 65 ? 'Hôn nhân THUẬN — nên tiến tới, bạn đời giúp ích.'
    : score >= 45 ? 'Hôn nhân BÌNH — cần nỗ lực vun đắp.'
    : 'Hôn nhân BẤT LỢI — kết hôn muộn, chọn người bao dung, cần hóa giải.';

  const paragraphs = [
    'Sao phối ngẫu: ' + spouseStarVi + ' (hành ' + WX_VI[spouseWx] + ') — ' + (spouseIsFav ? '★ DỤNG/HỶ' : spouseIsKy ? 'KỴ/THÙ' : 'trung tính') + '. Số lượng: ' + spouseCount + '.',
    'Cung phu thê (日支 ' + dayZhi + '): ' + dayZhiGodVi + ' — ' + palaceNote,
    dayChong ? '⚠ Cung phu thê BỊ XUNG (' + dayZhi + ') → hôn nhân dễ biến động; kết hôn muộn tốt hơn.' : 'Cung phu thê không bị xung → ổn định.',
    (hasHongLuan || hasTianXi) ? '红鸾天喜: ' + (hasHongLuan ? '红鸾@' + hongLuanZhi : '') + (hasTianXi ? ' 天喜@' + tianXiZhi : '') + ' → duyên tốt, dễ gặp người ý.' : 'Không có红鸾天喜 trong tứ trụ → duyên đến từ nỗ lực.',
    ...factors.map(f => '• ' + f),
    'Thời điểm cưới tốt: ' + (goodYears.length ? goodYears.slice(0,5).join(', ') : 'chờ đại vận/lưu niên mang hành ' + WX_VI[yong.primary] + '/' + WX_VI[yong.xi]),
    summary,
  ];

  return { score, summary, paragraphs, marriageScore: score, goodYears, spouseStarVi, dayZhiGodVi, palaceNote, dayChong, hasHongLuan, hasTianXi };
}

export { HONGLUAN, TIANXI, SPOUSE_PALACE };
