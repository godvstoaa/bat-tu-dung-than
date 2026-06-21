// ============================================================================
//  韋千里 BÁT BỘ PHÁN ĐOÁN (千里命稿 · 评断篇) — khung HK/民国 chuẩn
//  Nguồn: 韋千里《千里命稿》(1935) — chương "评断", bậc thầy HK/民国 ("南袁北韦").
//  Tám bước: 看强弱 → 定格局 → 取用神 → 论喜忌 → 查岁运 → 推六亲 → 评性情 → 断事业.
//  Danh ngôn: "命以用神得力为上… 日主格局犹人之躯体，用神犹人之灵魂。"
//  Tham chiếu: https://www.quanxue.cn/qt_mingxiang/qianlimg/qianlimg19.html
// ============================================================================
import { WX_VI, GAN, ZHI } from './constants.js';
import { analyzeLiunianDeep } from './liunian-pro.js';
import { DITIANSUI } from './kb.js';

const wxVi = (w) => WX_VI[w];
const hanviet = (gz) => gz.split('').map((c) => (GAN[c]?.vi || ZHI[c]?.vi || c)).join(' ');

export const QIANLI_QUOTE = '「命以用神得力为上，用神不得力为下，无用神为更下。日主格局犹人之躯体，用神犹人之灵魂，灵魂与躯体岂可须臾相离。」— 韋千里《千里命稿》';

/**
 * Bát bộ phán đoán theo 韋千里. Trả { steps: [{n,name,text}], yongSoul, source }.
 */
export function qianliEightSteps(R) {
  const { chart, strength, pattern, yong, dayun, liunian } = R;
  const dm = chart.dayMaster;
  const curYear = (liunian && liunian[0]) ? liunian[0].year : new Date().getFullYear();

  const steps = [];
  // 1. 看强弱
  steps.push({ n: 1, name: '看强弱 (Xem vượng suy)', text:
    `Nhật Chủ ${dm.gan} ${dm.vi} hành ${wxVi(dm.wx)}, ${strength.deLenh ? 'ĐẮC LỆNH' : 'thất lệnh'} tại nguyệt chi ${chart.monthZhi}; tỉ lệ phù trợ thân ${(strength.ratio * 100).toFixed(0)}% → ${strength.level}. Đây là nền, quyết định vượng/nhược để chọn cách bổ.` });

  // 2. 定格局
  steps.push({ n: 2, name: '定格局 (Định cách cục)', text:
    `Cách cục: ${pattern.vi} (${pattern.name}) — ${pattern.note}` });

  // 3. 取用神 (灵魂)
  steps.push({ n: 3, name: '取用神 (Lấy Dụng Thần — L-INH HỒN)', text:
    `Dụng Thần: ${wxVi(yong.primary)} (${yong.primary})${yong.secondary ? ', phụ ' + wxVi(yong.secondary) : ''}. Lấy bằng ${yong.method.join(' + ')}. ${QIANLI_QUOTE}` });

  // 4. 论喜忌
  steps.push({ n: 4, name: '论喜忌 (Luận Hỷ/Kỵ)', text:
    `Hỷ ${wxVi(yong.xi)} (sinh Dụng), Kỵ ${wxVi(yong.ji)} (khắc Dụng), Thù ${wxVi(yong.chou)} (sinh Kỵ). Hành Hỷ/Kỵ gặp trong đại vận/lưu niên định cát hung.` });

  // 5. 查岁运
  let dyCat = (dayun || []).filter((d) => d.score > 0).slice(0, 2).map((d) => `${hanviet(d.ganZhi)}[${d.startAge}t:${d.rating}]`).join(', ');
  let lyNow = '';
  try { const d = analyzeLiunianDeep(R, curYear); lyNow = `Lưu niên ${curYear} ${d.ganZhi}: ${d.rating} (${d.score}/100) — ${d.schools.filter((s) => s.d < 0).slice(0, 2).map((s) => s.note.slice(0, 40)).join('; ')}.`; } catch (e) {}
  steps.push({ n: 5, name: '查岁运 (Xem đại vận/lưu niên)', text:
    `Đại vận CÁT gần: ${dyCat || '(đang xấu, cần chờ vận Dụng)'}. ${lyNow}` });

  // 6. 推六亲
  const lq = R.liuqin || [];
  steps.push({ n: 6, name: '推六亲 (Đẩy lục thân)', text:
    lq.length ? lq.map((r) => `${r.relVi}: ${r.verdict.slice(0, 50)}`).join(' | ') : '(không tính được)' });

  // 7. 评性情
  const dt = DITIANSUI[dm.gan];
  steps.push({ n: 7, name: '评性情 (Bình tính tình)', text:
    `${dm.gan} ${dm.vi}: ${dt ? dt.nature.slice(0, 70) : ''} Vượng suy ${strength.strong ? '(vượng → thiên cương)' : '(nhược → thiên nhu)'}; ${R.synthesis?.combos?.length ? 'tổ hợp ' + R.synthesis.combos.map((c) => c.vi).join(',') + ' ảnh hưởng tính.' : ''}` });

  // 8. 断事业
  steps.push({ n: 8, name: '断事业 (Đoán sự nghiệp)', text:
    `Cách ${pattern.vi}; nên theo ngành hành Dụng ${wxVi(yong.primary)}; ${strength.strong ? 'thân vượng đủ gánh Quan–Tài, hợp quản lý/kinh doanh' : 'thân nhược nên chọn nơi ổn định, có quý nhân'}. Tổng luận: ${R.synthesis.gradeVi} (${R.synthesis.score}/100) — ${R.synthesis.fortuneVi}.` });

  // Mức "用神得力" (linh hồn có lực không)
  const yongForce = (R.wx.score[yong.primary] || 0) / (R.wx.total || 1);
  const soul = yongForce >= 0.15 ? 'Dụng Thần ĐẮC LỰC (mệnh có gốc, Thượng)' : yongForce >= 0.08 ? 'Dụng Thần hơi yếu (Trung)' : 'Dụng Thần VÔ LỰC (Hạ — cần đại vận補)';

  return { steps, soul, source: '韋千里《千里命稿·评断篇》(1935) — HK/民国 chính thống, "南袁北韦"' };
}
