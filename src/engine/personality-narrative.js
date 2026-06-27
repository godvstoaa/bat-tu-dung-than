// ============================================================================
//  TƯỜNG THUẬT BẢN MỆNH (personality narrative) — "Bạn là ai?" (natal prose)
//  Song song phase-narrative (loop 472: temporal «đang ở đâu»); đây là NATAL
//  «bản chất是谁». May xuyên Nhật Chủ + 五德 + Dụng Thần + 格局 + 总论 → 1 story.
//  Nguồn: 渊海子平 日主论命, 滴天髓 性情, 五德论.
// ============================================================================
import { WX_VI, TEN_GOD_VI } from './constants.js';
import { getPersonalityProfile } from './personality-profile.js';
import { analyzeFiveVirtues } from './five-aspects.js';
import { dominantGod } from './dominant-god.js';
import { tenGod } from './core.js';

/**
 * @returns {{ title, paragraphs[] }}
 */
export function personalityNarrative(R) {
  const dm = R.chart?.dayMaster;
  const dayGan = R.chart?.dayGan;
  const yong = R.yong || {};
  const pattern = R.pattern || {};
  const syn = R.synthesis || {};
  const paras = [];
  if (!dm) return { title: 'Tường thuật bản mệnh', paragraphs: ['Chưa có dữ liệu.'] };

  // --- P1: BẢN CHẤT (Nhật Chủ + personality profile) ---
  let prof = null;
  try { prof = getPersonalityProfile(R); } catch (e) {}
  const dmVi = dm.vi || WX_VI[dm.wx];
  const temper = prof?.profile?.temperament;
  const identLine = `Bạn là người <b>${dm.gan} ${dmVi}</b> (Nhật Chủ hành ${WX_VI[dm.wx]})${temper ? ' — ' + temper : ''}.`;
  paras.push(identLine);

  // --- P2: ĐỨC + ƯU/NHƯỢC (五德 + cultivation) ---
  try {
    const fv = analyzeFiveVirtues(R);
    if (fv?.virtue) {
      paras.push(`Đức chính của bạn là <b>${fv.virtue}</b> — ${fv.desc || ''}. Mạnh: ${(fv.strong || '').slice(0, 50)}. Điểm cần tu dưỡng: ${(fv.cultivation || '').slice(0, 60)}.`);
    }
  } catch (e) {}

  // --- P3: THẾ LỰC NỘI TẠI (dominant god — sao thập thần chủ đạo + thuận/nghịch Dụng) ---
  try {
    const dg = dominantGod(R);
    const top = dg?.ranked?.[0];
    if (top) {
      const trait = { 'Tỷ Kiên':'độc lập, tự chủ, cạnh tranh', 'Kiếp Tài':'quyết đoán, mạo hiểm, tranh giành', 'Chính Quan':'kỷ luật, trách nhiệm, danh chính', 'Thất Sát':'quyết liệt, dũng cảm, biến động', 'Chính Tài':'thực tế, tiết chế, tài chính', 'Thiên Tài':'kinh doanh, đầu cơ, duyên ngoài', 'Chính Ấn':'sâu sắc, học thuật, bao dung', 'Thiên Ấn':'độc đáo, chuyên môn, lý luận', 'Thực Thần':'an nhàn, sáng tạo, khẩu phúc', 'Thương Quan':'biểu đạt, phản trào, tài năng' }[top.godVi] || '';
      // [loop 489] favor relation: khuynh hướng tự nhiên thuận Dụng (đi đúng hướng) hay nghịch (trái, cần khắc phục)
      paras.push(`Thế lực nội tại chi phối mạnh nhất: <b>${top.godVi}</b> (thập thần chủ đạo)${trait ? ' — «' + trait + '»' : ''}.${dg.favorVi ? ' ' + dg.favorVi : ''}`);
    }
  } catch (e) {}

  // --- P4: ĐỊNH HƯỚNG ĐỜI (Dụng Thần + 格局 — «bạn nên đi về đâu») ---
  const dungVi = WX_VI[yong.primary];
  const dungLine = yong.primary
    ? `Định hướng cốt lõi: Dụng Thần <b>${dungVi}</b> (${yong.primary}) — đây là «chìa khoá» mở vận cho bạn. ${yong.method?.length ? 'Chọn theo ' + yong.method.join(', ').toLowerCase() + '.' : ''} Theo đuổi ngành/hướng/màu hành ${dungVi}; tránh hành ${WX_VI[yong.ji] || yong.ji} (Kỵ).`
    : 'Định hướng theo ngũ hành cân bằng mệnh.';
  const gejuLine = pattern.vi ? ` Cách cục ${pattern.vi} ${pattern.shunNi || ''} — ${pattern.note ? (pattern.note).slice(0, 60) : ''}` : '';
  paras.push(dungLine + gejuLine);

  // --- P5: TỔNG QUAN MỆNH (synthesis grade + fortune) ---
  if (syn.gradeVi) {
    paras.push(`Tổng quan mệnh: ${syn.gradeVi} (${syn.score || '?'}/100), xu hướng ${syn.fortuneVi || ''}. ${syn.score >= 55 ? 'Nền mệnh khá — nên chủ động tiến thủ theo Dụng Thần.' : syn.score >= 41 ? 'Nền mệnh trung bình — cần nỗ lực + đúng thời (đại vận/lưu niên cát) để vươn.' : 'Nền mệnh nhiều thử thách — dựa Dụng Thần + tích đức (《了凡》) để cải mệnh.'}`);
  }
  paras.push(`Nhớ: tính cách (Natal) là «bản chất», vận (đại vận/lưu niên) là «thời». Bản chất tốt + đón đúng thời = phát; bản chất +「tu dưỡng đức»(《了凡四训》) vẫn là cái quyết định cuối.`);

  return { title: 'Tường Thuật Bản Mệnh', paragraphs: paras };
}
