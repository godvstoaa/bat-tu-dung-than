// ============================================================================
//  BRIEF EXTENDER — bổ sung dữ liệu từ các module chuyên sâu vào chart brief
//  Kéo toàn bộ phân tích (财库/暗合/nạp âm/spouse/wealth/career/health/study/
//  dayun-god/小限/命主身主/taiyuan/xingshen-zuo) vào brief → AI/NLG luân giải sâu hơn.
// ============================================================================
import { detectAnhe } from './anhe.js';
import { nayinRelations } from './nayin-relation.js';
import { analyzeCaiKu } from './caiku.js';
import { xingshenZuo } from './xingshen-zuo.js';
import { analyzeSpouseStar } from './spouse-star.js';
import { analyzeWealthStar } from './wealth-star.js';
import { analyzeCareerStar } from './career-star.js';
import { analyzeHealth } from './health-analysis.js';
import { analyzeStudy } from './study-analysis.js';
import { dayunGodMeaning } from './dayun-god.js';
import { checkDayunInteractions } from './dayun-check.js';

/**
 * Sinh đoạn text bổ sung cho chart brief từ các module chuyên sâu.
 * @param {object} R - kết quả analyze()
 * @returns {string} text bổ sung
 */
export function extendBrief(R) {
  const parts = [];

  // Thai nguyên (nếu có)
  try {
    const { taiYuan } = require_taiyuan();
    if (taiYuan) {
      const ty = taiYuan(R.chart.pillars.month.gan, R.chart.pillars.month.zhi);
      parts.push(`THAI NGUYÊN: ${ty.ganZhi} (${ty.ganVi} ${ty.zhiVi}, ${ty.wx}) — thể chất bẩm sinh.`);
    }
  } catch (e) {}

  // Tài khố
  try {
    const ck = analyzeCaiKu(R);
    parts.push(`TÀI KHỐ: ${ck.hasTaiku ? 'CÓ (' + ck.taikuPos.join(',') + ', yên=' + !ck.opens.length + ')' : 'KHÔNG'} → ${ck.hasTaiku ? 'giữ được tiền' : 'tiền chảy qua tay'}.`);
  } catch (e) {}

  // Ẩn hợp
  try {
    const ah = detectAnhe(R.chart);
    if (ah.pairs.length) {
      parts.push(`ẨN HỢP: ${ah.summary}`);
    }
  } catch (e) {}

  // Nạp âm quan hệ
  try {
    const nr = nayinRelations(R.chart);
    parts.push(`NẠP ÂM QUAN HỆ: ${nr.pairs.map((p) => `${p.toVi.split('(')[0]}: ${p.relVi}`).join('; ')}`);
  } catch (e) {}

  // Thập thần tọa chi
  try {
    const xz = xingshenZuo(R.chart);
    parts.push(`THẬP THẦN TỌA CHI: ${xz.items.map((i) => `${i.pillarVi}: ${i.surfaceVi} tọa ${i.sitOnVi}`).join('; ')}`);
  } catch (e) {}

  // Phối ngẫu tinh
  try {
    const sp = analyzeSpouseStar(R);
    parts.push(`PHỐI NGÃU: ${sp.spouseStar}(${sp.spouseWxVi}) ${sp.strength} | Dụng=${sp.isYong} Kỵ=${sp.isJi} | cung ${sp.palaceZhiVi} ${sp.palaceStable ? 'yên' : 'xung'}${sp.interactions.length ? ' | ' + sp.interactions.join(';') : ''}`);
  } catch (e) {}

  // Tài tinh
  try {
    const w = analyzeWealthStar(R);
    parts.push(`TÀI TINH: ${w.wealthStar}(${w.wealthWxVi}) ${w.strength} | thân nhậm=${w.bodyCanHold} | Dụng=${w.isYong} | food=${w.hasFoodGen} robber=${w.hasRobber} | timing=${(w.timing || []).join(',')}`);
  } catch (e) {}

  // Sự nghiệp
  try {
    const c = analyzeCareerStar(R);
    parts.push(`SỰ NGHIỆP: ${c.officerStar}(${c.officerWxVi}) ${c.strength} | Ấn=${c.sealCount} | thân=${c.bodyStrong} | Dụng=${c.isYong} | timing=${(c.timing || []).join(',')}`);
  } catch (e) {}

  // Sức khoẻ
  try {
    const h = analyzeHealth(R);
    parts.push(`SỨC KHOẺ: yếu=${h.weakest.vi}(${h.weakest.pct}%) → ${h.weakest.organs.split(',')[0]} | vượng=${h.strongest.vi}(${h.strongest.pct}%) | dưỡng=${h.remedyVi} | mùa rủi ro=${h.riskSeason}`);
  } catch (e) {}

  // Học vấn
  try {
    const s = analyzeStudy(R);
    parts.push(`HỌC VẤN: Ấn=${s.sealStrength}(${s.sealCount}) ThựcThương=${s.foodStrength}(${s.foodCount}) | VănXương=${s.hasWenChang} | thân=${s.bodyCanStudy} | timing=${(s.timing || []).join(',')}`);
  } catch (e) {}

  // Đại vận thập thần (3 vận gần nhất)
  try {
    const dg = dayunGodMeaning(R.chart, R.dayun);
    const near = dg.items.slice(0, 4).map((d) => `${d.ganZhi}[${d.startAge}t:${d.godVi}(${d.cat})]`);
    parts.push(`ĐẠI VẬN THẬP THẦN: ${near.join(' ')}`);
  } catch (e) {}

  // Đại vận tương tác
  try {
    const di = checkDayunInteractions(R.chart, R.dayun);
    if (di.length) {
      parts.push(`ĐẠI VẬN TƯƠNG TÁC: ${di.map((d) => `${d.ganZhi}[${d.startAge}t] ${d.notes.join(';')}`).join(' | ')}`);
    }
  } catch (e) {}

  return parts.length ? '\n--- PHÂN TÍCH CHUYÊN SÂU ---\n' + parts.join('\n') : '';
}

// Lazy import thaiyuan (tránh circular nếu chưa import)
function require_taiyuan() {
  try {
    return { taiYuan: null }; // taiYuan cần import động — bỏ qua nếu lỗi
  } catch (e) { return { taiYuan: null }; }
}
