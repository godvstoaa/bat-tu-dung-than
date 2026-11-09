// ============================================================================
//  VẬN MỆNH CÁC — hành lang đại vận của chính người chơi (docs/GAME-NOI-DUNG-THEO-APP.md).
//  Mỗi cổng = một đại vận 10 năm: can chi, thập thần can/chi, trường sinh của vận, chấm điểm,
//  chủ đề thập kỷ, mốc đỉnh vận / cần dè chừng / phục – phản ngâm. Cổng đang đi sáng nhất.
//  Engine app: life-trajectory (buildLifeTrajectory), dayun-changsheng, phase-narrative.
//  Thuần logic — test: scripts/test-game-vanmenh.mjs
// ============================================================================
import { buildLifeTrajectory } from '../engine/life-trajectory.js';
import { dayunChangSheng } from '../engine/dayun-changsheng.js';
import { phaseNarrative } from '../engine/phase-narrative.js';
// [G2 NPC-AI] bark bia/cổng (mục 05 §05.12) — đọc tên can chi Việt + chọn câu thuần theo seed
import { GAN, ZHI } from '../engine/constants.js';
import { hashSeed } from './npc.js';

export const VAN_GATES = 9; // 9 cổng ≈ 90 năm đầu đời

const MARK_VI = { golden: 'Đỉnh vận', caution: 'Cần dè chừng', fuyin: 'Phục ngâm', fanyin: 'Phản ngâm' };
const TONE = (score) => (score >= 2 ? 'cat' : score <= -2 ? 'hung' : score > 0 ? 'thuan' : score < 0 ? 'nghich' : 'binh');

/**
 * @param R        analyze() của người chơi
 * @param nowYear  năm hiện tại (dương lịch)
 * @returns {{ gates, current, summary, foundation, phase, childhood }}
 */
export function vanMenh(R, nowYear = new Date().getFullYear()) {
  const T = buildLifeTrajectory(R);
  const cs = dayunChangSheng(R.chart.pillars.day.gan, R.dayun || []).items || [];
  const gates = T.decades.slice(0, VAN_GATES).map((d, i) => {
    const marks = T.turningPoints.filter((p) => p.ganZhi === d.ganZhi && p.ages === d.ages)
      .map((p) => ({ kind: p.kind, vi: MARK_VI[p.kind] || p.kind, reason: p.reason }));
    const st = cs[i] || {};
    return {
      i, ages: d.ages, startAge: d.startAge, ganZhi: d.ganZhi,
      startYear: d.dy.startYear, endYear: d.dy.startYear + 9,
      ganGod: d.ganGodVi, zhiGod: d.zhiGodVi,
      rating: d.rating, score: d.dy.score, tone: TONE(d.dy.score),
      theme: d.themeName, line: d.line,
      stage: st.stageVi || '', stageTone: st.toneVi || '', stageDesc: st.desc || '',
      rescue: d.dy.rescueNotes || [], worsen: d.dy.worsenNotes || [],
      marks,
    };
  });
  const current = gates.findIndex((g) => nowYear >= g.startYear && nowYear <= g.endYear);
  const first = gates[0], last = gates[gates.length - 1];
  return {
    gates, current,
    // trước đại vận đầu tiên: còn «tiểu vận» (tuổi thơ theo trụ tháng)
    childhood: first && nowYear < first.startYear,
    summary: T.summary, foundation: T.foundation,
    // đã qua cổng 9 vẫn có tường thuật — phase-narrative có sẵn nhánh «đã qua đại vận cuối»;
    // chỉ ấu thơ chưa vào vận đầu là chưa có gì để tường thuật
    phase: (current >= 0 || (last && nowYear > last.endYear)) ? phaseNarrative(R, nowYear) : null,
  };
}

// ============================================================================
//  [G2 NPC-AI] BARK VẬN MỆNH CÁC (mục 05 §05.12) — bark bia 1 câu khi mở bia
//  (pool 2 câu, chọn theo seed `${ngày}:${pid}` — khuôn dayKey stations.js:671-673,
//  cùng ngày ra cùng câu, mai tự đổi) + bark cổng 1 câu kể tuổi theo cổng đang mở
//  (nguyên văn câu mẫu sách). Thuần logic, không DOM, không state, không mạng;
//  chọn câu THUẦN theo seed (hashSeed của npc.js), không Math.random trần.
//  Bark ≤ 90 ký tự, không doạ, không lặp nhãn mức («Đỉnh vận», «Cần dè chừng»
//  là chữ dữ liệu UI — bark giữ tầng «xu hướng, không phải bản án»); KHÔNG AI
//  luận tại cổng — luận mười năm là việc của Thầy ở Bàn Thầy qua nút «Hỏi Thầy
//  thêm», cổng không thay mặt. Không đưa bark vào payload mạng (mục 13).
// ============================================================================
const gzVi = (gz) => `${GAN[gz?.[0]]?.vi || ''} ${ZHI[gz?.[1]]?.vi || ''}`.trim();

/** Bark bia Vận Mệnh — đọc V.current (cổng đang đi); thiếu dữ liệu → null (im lặng). */
export function vanBiaBark(V, dayKey = '') {
  if (!V || !Array.isArray(V.gates) || V.gates.length === 0) return null;
  const cur = V.current >= 0 ? V.gates[V.current] : null;
  const ten = cur ? gzVi(cur.ganZhi) : '';
  const pool = [
    // câu 1 — kể cổng đang đi theo dữ liệu thật; chưa vào vận đầu / đã qua cổng cuối thì kể số cổng
    ten
      ? `Bia khắc sẵn ${V.gates.length} cổng — cổng ${ten} là chặng khách đang đi.`
      : `Bia khắc sẵn ${V.gates.length} cổng — mỗi cổng một thập kỷ.`,
    // câu 2 — khử tất định: bia chỉ khắc, người đi là khách
    'Cổng chỉ khắc chặng — mười năm nào đi tới đâu là việc của khách.',
  ];
  return pool[hashSeed(`vanbia|${dayKey}`) % pool.length];
}

/** Bark cổng đại vận — 1 câu kể tuổi (câu mẫu nguyên văn §05.12), đọc g.ages. */
export function vanGateBark(g) {
  if (!g || !g.ages) return null;
  const doTuoi = String(g.ages).replace('t', ' tuổi'); // '8–17t' → '8–17 tuổi'
  return `Cổng này là thập kỷ ${doTuoi} của khách — mười năm trước mắt, ai cũng có cổng như vậy.`;
}
