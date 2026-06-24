// ============================================================================
//  桃花 分類 — ĐÀO HOA CLASSIFICATION (正/烂/墙内/墙外/倒插/滚浪/桃花煞)
//  "Tình duyên tôi là duyên lành hay duyên hão (烂桃花)?" — chẩn đoán tình duyên cổ pháp.
//  Khác romance-deep/spouse-star (phối ngẫu theo sao): module này = PHÂN LOẠI
//    sao Đào Hoa theo VỊ TRÍ + kết hợp Thập Thần/Dụng → 正桃花 (lành) vs 烂桃花 (hão).
//  Cơ chế (桃花 = 咸池, 三合局):
//    寅午戌→卯 | 申子辰→酉 | 巳酉丑→午 | 亥卯未→子.
//  * 墙内 (năm/tháng): duyên lành, chung thuỷ, vợ chồng ân cần.
//  * 墙外 (giờ): duyên phát triển ra ngoài, dễ ngoại tình.
//  * 倒插 (năm chi = 桃花 của trụ khác): duyên phức tạp, đảo lộn.
//  * 滚浪/桃花刑 (桃花 + 子卯 hình): dễ họa vì sắc, rắc rối tình cảm.
//  * 桃花煞 (桃花 = Kỵ/Thù hoặc đồng trụ với Thương Quan/Thất Sát/Kiếp Tài): duyên hao, buồn.
//  * 红艳煞 (theo can): 甲乙午 丙寅 丁未 戊己辰 庚戌 辛酉 壬子 癸丑 — đào hoa cường liệt, dễ nảy sinh rắc rối.
//  * 官带/财带桃花 (đồng trụ Chính Quan/Chính Tài): duyên mang lại chức/phúc — tốt.
//  Nguồn: 渊海子平 咸池篇, 三命通会 桃花, 知乎 四柱神煞桃花详解.
// ============================================================================
import { ZHI } from './constants.js';

const TAOHUA = { 寅: '卯', 午: '卯', 戌: '卯', 申: '酉', 子: '酉', 辰: '酉', 巳: '午', 酉: '午', 丑: '午', 亥: '子', 卯: '子', 未: '子' };
const HONGYAN = { 甲: '午', 乙: '午', 丙: '寅', 丁: '未', 戊: '辰', 己: '辰', 庚: '戌', 辛: '酉', 壬: '子', 癸: '丑' };
const PILLAR_VI = { year: 'Niên', month: 'Nguyệt', day: 'Nhật', time: 'Thời' };

/**
 * @returns {{ taohuaZhi, positions:[{pillar,vi,ganZhi,ganGod}], hongyan,
 *            flags:[{type,typeVi,tone,note}], verdict, verdictVi, score, summary }}
 */
export function analyzeTaohua(R) {
  const dayZhi = R.chart.pillars.day.zhi;
  const dayGan = R.chart.dayGan;
  const tao = TAOHUA[dayZhi];        // 桃花位 theo Nhật chi
  const dung = new Set([R.yong?.primary, R.yong?.xi].filter(Boolean));
  const jiSet = new Set([R.yong?.ji, R.yong?.chou].filter(Boolean));

  // 1. vị trí 桃花 rơi vào trụ nào
  const positions = [];
  for (const k of ['year', 'month', 'day', 'time']) {
    const p = R.chart.pillars[k];
    if (p.zhi === tao) positions.push({ pillar: k, vi: PILLAR_VI[k], ganZhi: p.gan + p.zhi, ganGod: p.ganGod, zhiWx: ZHI[p.zhi].wx });
  }

  // 2. 红艳煞 (theo can năm + can ngày)
  const hy = HONGYAN[dayGan];
  const hongyanHits = [];
  for (const k of ['year', 'month', 'day', 'time']) {
    if (R.chart.pillars[k].zhi === hy) hongyanHits.push(PILLAR_VI[k]);
  }

  // 3. 倒插桃花 (niên chi = 桃花 của nguyệt/nhật/thời chi)
  let daoCha = false;
  const yearZhi = R.chart.pillars.year.zhi;
  if (['卯', '午', '酉', '子'].includes(yearZhi)) {
    for (const k of ['month', 'day', 'time']) {
      if (TAOHUA[R.chart.pillars[k].zhi] === yearZhi) daoCha = true;
    }
  }

  // 4. 滚浪/桃花刑 (có 桃花 + 子卯 hình: ÍT NHẤT 1 trong 子/卯 phải CHÍNH LÀ vị trí đào hoa)
  //    positions[] được đẩy vào khi p.zhi === tao (đào hoa vị) → vị trí đào hoa = tao
  const allZhi = ['year', 'month', 'day', 'time'].map((k) => R.chart.pillars[k].zhi);
  const gunLang = positions.length > 0
    && (tao === '子' || tao === '卯')
    && allZhi.includes('子') && allZhi.includes('卯');

  // 5. gom flags
  const flags = [];
  let score = 0;
  for (const pos of positions) {
    if (pos.pillar === 'year' || pos.pillar === 'month') { flags.push({ type: '墙内桃花', typeVi: 'Tường Nội', tone: 'cat', note: `${pos.vi} trụ — duyên lành, chung thuỷ, vợ/chồng ân cần (cát).` }); score += 2; }
    if (pos.pillar === 'day') { flags.push({ type: '日支桃花', typeVi: 'Phối Ngẫu Cung', tone: 'mid', note: `${pos.vi} trụ — bạn đời hấp dẫn, phối ngẫu cung mang đào hoa.` }); score += 1; }
    if (pos.pillar === 'time') { flags.push({ type: '墙外桃花', typeVi: 'Tường Ngoại', tone: 'hung', note: `${pos.vi} trụ — duyên phát triển ra NGOÀI, dễ ngoại tình/nhiều người theo (hung, bị xung càng nặng).` }); score -= 2; }
    // 桃花五行 = Dụng/Kỵ?
    if (dung.has(pos.zhiWx)) { flags.push({ type: '桃花带用', typeVi: 'Đào Hoa hợp Dụng', tone: 'cat', note: `Đào hoa hành ${pos.zhiWx} = DỤNG/HỶ → duyên mang lại phúc, tình yêu nâng bạn lên.` }); score += 2; }
    if (jiSet.has(pos.zhiWx)) { flags.push({ type: '桃花煞', typeVi: 'Đào Hoa Sát', tone: 'hung', note: `Đào hoa hành ${pos.zhiWx} = KỴ/THÙ → "tình败神": duyên hao tâm lực, dễ buồn/mất tiền vì tình.` }); score -= 3; }
    // đồng trụ thập thần
    if (pos.ganGod === '正官') { flags.push({ type: '官带桃花', typeVi: 'Quan Đới', tone: 'cat', note: 'Đào hoa đồng trụ Chính Quan → duyên mang lại địa vị/chức vụ (cát).' }); score += 2; }
    if (pos.ganGod === '正財') { flags.push({ type: '财带桃花', typeVi: 'Tài Đới', tone: 'cat', note: 'Đào hoa đồng trụ Chính Tài → duyên mang lại tiền tài (cát).' }); score += 2; }
    if (pos.ganGod === '七殺' || pos.ganGod === '傷官' || pos.ganGod === '劫財') { flags.push({ type: '桃花煞', typeVi: 'Đào Hoa Sat (thập thần)', tone: 'hung', note: `Đào hoa đồng trụ ${pos.ganGod} → duyên dữ, rắc rối, hao tán (hung).` }); score -= 2; }
  }
  if (daoCha) { flags.push({ type: '倒插桃花', typeVi: 'Đảo Trấp', tone: 'hung', note: 'Niên chi là đào hoa đảo ngược → tình duyên phức tạp, dễ đảo lộn thứ tự/họ hàng.' }); score -= 2; }
  if (gunLang) { flags.push({ type: '滚浪桃花', typeVi: 'Cổ Lãng (Đào Hoa Hình)', tone: 'hung', note: 'Đào hoa + Tý-Mão tương hình → họa vì sắc, rắc rối tình cảm liên miên.' }); score -= 3; }
  if (hongyanHits.length) { flags.push({ type: '红艳煞', typeVi: 'Hồng Diễm', tone: 'hung', note: `Hồng Diễm tại ${hongyanHits.join(', ')} trụ — đào hoa cường liệt, hấp dẫn ngược, dễ nảy sinh duyên rắc rối.` }); score -= 1; }

  // 6. verdict
  let verdict, verdictVi;
  if (!positions.length && !hongyanHits.length) { verdict = '无'; verdictVi = 'KHÔNG có đào hoa bẩm sinh — duyên đến theo lưu niên (năm mang Tý/Mão/Ngọ/Dậu), tránh ép tình sớm.'; }
  else if (score >= 2) { verdict = '正桃花'; verdictVi = 'CHÍNH ĐÀO HOA — duyên lành, nên chọn người bổ Dụng, kết hôn năm cát → tình duyên nâng vận.'; }
  else if (score <= -2) { verdict = '烂桃花'; verdictVi = 'LẠN ĐÀO HOA — duyên hão/dữ, dễ buồn-mất tiền vì tình. Cần chọn người bổ Dụng Thần, TRÁNH ngoại tình, kết hôn năm không phạm đào hoa/đào hoa sát.'; }
  else { verdict = '半吉半凶'; verdictVi = 'Đào hoa bán cát bán hung — vừa có duyên lành vừa dễ rắc rối; quan trọng là ĐỊNH HƯỚNG (chọn người bổ Dụng, chung thuỷ).'; }

  const summary = verdictVi + (flags.length ? ` Cụ thể: ${flags.map((f) => `${f.typeVi}(${f.tone === 'cat' ? 'cát' : 'hung'})`).join(', ')}.` : '') +
    (positions.length ? ` Đào hoa (theo Nhật chi ${dayZhi}) = ${tao}, rơi ${positions.map((p) => p.vi).join('/')}.` : '');

  return { taohuaZhi: tao, positions, hongyan: { zhi: hy, hits: hongyanHits }, daoCha, gunLang, flags, verdict, verdictVi, score, summary };
}

export { TAOHUA, HONGYAN };
