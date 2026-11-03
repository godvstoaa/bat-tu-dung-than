// ============================================================================
//  ÁN TRẠCH NHẬT (sảnh Lịch Đường) — khách cần chọn ngày cho một việc lớn.
//  Đáp án do engine app tính: ../engine/zheri.js (12 trực, Hoàng/Hắc đạo, xung–hại–hình–hợp tuổi).
//  3 bước: lọc ngày xung tuổi → nhận ngày trực Hoàng đạo → chọn ngày tốt nhất.
//  Thuần logic (không DOM) — test: scripts/test-game-zheri.mjs
// ============================================================================
import { Solar } from 'lunar-javascript';
import { evaluateDate } from '../engine/zheri.js';
import { ZHI } from '../engine/constants.js';
import { hashSeed, rng, makeNpc } from './npc.js';

export const ZHERI_STEPS = ['xung', 'truc', 'pick'];
export const ZHERI_TITLE = { xung: 'Lọc ngày xung tuổi', truc: 'Nhận trực Hoàng đạo', pick: 'Chọn ngày' };
export const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
export const OFFICERS = ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'];

// việc → lời khách (theo tuổi hợp lý)
const JOBS = [
  { id: 'marry', age: [20, 45], q: 'Hai đứa tôi định làm lễ cưới trong mấy tuần tới. Nên chọn ngày nào?' },
  { id: 'business', age: [22, 70], q: 'Tôi sắp khai trương cửa hàng. Ngày nào mở cửa cho thuận?' },
  { id: 'move', age: [22, 85], q: 'Nhà mới xong rồi, gia đình muốn dọn về. Ngày nào nhập trạch được?' },
  { id: 'build', age: [28, 80], q: 'Tôi chuẩn bị động thổ làm nhà. Nên khởi công ngày nào?' },
  { id: 'sign', age: [24, 70], q: 'Tôi sắp ký một hợp đồng lớn. Hôm nào ký thì tốt?' },
  { id: 'travel', age: [18, 75], q: 'Tôi sắp đi xa một chuyến dài. Nên lên đường ngày nào?' },
];
export const JOB_VI = { marry: 'cưới hỏi', business: 'khai trương', move: 'nhập trạch', build: 'động thổ', sign: 'ký kết', travel: 'xuất hành' };

const pad = (n) => String(n).padStart(2, '0');

// Chi năm sinh theo Lập Xuân (sinh tháng 1 dương lịch vẫn thuộc năm trước)
export function birthZhi(y, m, d) {
  return Solar.fromYmdHms(y, m, d, 12, 0, 0).getLunar().getYearZhiByLiChun();
}

/**
 * Dựng án cho một khách. key: chuỗi hạt giống (ngày + người chơi); today: Date.
 * Trả { npc, job, zhi, days:[{ ymd, label, lunar, dayGanZhi, monthZhi, ev }], keys }.
 */
export function buildZheriCase(key, today = new Date()) {
  const r = rng(hashSeed(`zheri:${key}`));
  const base = makeNpc(`zheri:${key}`, today.getFullYear());
  const fit = JOBS.filter((j) => base.age >= j.age[0] && base.age <= j.age[1]);
  const job = fit[Math.floor(r() * fit.length)] || JOBS[1];
  const npc = { ...base, question: job.q, topic: job.id };
  const zhi = birthZhi(npc.year, npc.month, npc.day);

  // quét 21 ngày (bắt đầu sau 3 ngày — khách cần thời gian chuẩn bị)
  const start = Solar.fromYmdHms(today.getFullYear(), today.getMonth() + 1, today.getDate(), 12, 0, 0).next(3);
  const pool = [];
  for (let i = 0; i < 21; i++) {
    const s = start.next(i);
    const ev = evaluateDate(s.getYear(), s.getMonth(), s.getDay(), job.id, zhi);
    pool.push({ s, ev });
  }
  // 5 ngày ứng viên: ngày tốt nhất + 1 ngày xung tuổi (nếu có) + 3 ngày ngẫu nhiên khác
  const byScore = [...pool].sort((a, b) => b.ev.score - a.ev.score);
  const picked = new Set([byScore[0]]);
  const clash = pool.filter((p) => p.ev.clashYou);
  if (clash.length) picked.add(clash[Math.floor(r() * clash.length)]);
  const rest = pool.filter((p) => !picked.has(p));
  while (picked.size < 5 && rest.length) picked.add(rest.splice(Math.floor(r() * rest.length), 1)[0]);
  const WD = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const days = [...picked].sort((a, b) => a.ev.solar.localeCompare(b.ev.solar)).map(({ s, ev }) => {
    const lu = s.getLunar();
    return {
      ymd: ev.solar,
      label: `${WD[s.getWeek()]} ${pad(s.getDay())}/${pad(s.getMonth())}`,
      lunar: `${lu.getDay()}/${lu.getMonth() < 0 ? `${-lu.getMonth()} nhuận` : lu.getMonth()} âm`,
      dayGanZhi: ev.dayGanZhi,
      monthZhi: lu.getMonthZhi(),
      ev,
    };
  });
  const top = Math.max(...days.map((d) => d.ev.score));
  return {
    npc, job: job.id, zhi, days,
    keys: {
      xung: days.filter((d) => d.ev.clashYou).map((d) => d.ymd),
      truc: days.filter((d) => d.ev.tone === 'cát').map((d) => d.ymd),
      best: days.filter((d) => d.ev.score === top).map((d) => d.ymd),
    },
  };
}

// Jaccard cho câu chọn nhiều (tập rỗng = «không ngày nào»)
function setScore(want, got) {
  const W = new Set(want), G = new Set(got);
  if (!W.size && !G.size) return 1;
  const inter = [...G].filter((x) => W.has(x)).length;
  return inter / new Set([...W, ...G]).size;
}

const dayName = (cs, ymd) => cs.days.find((d) => d.ymd === ymd)?.label || ymd;

export function gradeZheri(cs, step, ans) {
  const zv = ZHI[cs.zhi].vi;
  if (step === 'xung') {
    const s = setScore(cs.keys.xung, ans);
    const c = CHONG[cs.zhi];
    const msg = cs.keys.xung.length
      ? `Tuổi ${zv} (${cs.zhi}) xung chi ${ZHI[c].vi} (${c}) → ngày ${cs.keys.xung.map((y) => dayName(cs, y)).join(', ')} là ngày ${ZHI[c].vi}, loại ngay.`
      : `Tuổi ${zv} (${cs.zhi}) xung chi ${ZHI[c].vi} (${c}); trong 5 ngày không có ngày ${ZHI[c].vi} nào.`;
    return { score: s, msg };
  }
  if (step === 'truc') {
    const s = setScore(cs.keys.truc, ans);
    const list = cs.days.map((d) => `${d.label}: trực ${d.ev.officerVi} (${d.ev.officer}) — ${d.ev.tone === 'cát' ? 'Hoàng đạo' : 'Hắc đạo'}`).join(' · ');
    return { score: s, msg: `Trực = vị trí chi ngày tính từ chi tháng (cùng chi = Kiến). ${list}.` };
  }
  // pick
  const d = cs.days.find((x) => x.ymd === ans);
  const scores = cs.days.map((x) => x.ev.score);
  const max = Math.max(...scores), min = Math.min(...scores);
  const s = !d ? 0 : cs.keys.best.includes(ans) ? 1 : max === min ? 1 : 0.8 * (d.ev.score - min) / (max - min);
  const best = cs.days.find((x) => cs.keys.best.includes(x.ymd));
  const msg = cs.keys.best.includes(ans)
    ? `${best.label} (${best.dayGanZhi}) là ngày tốt nhất cho việc ${JOB_VI[cs.job]}: ${best.ev.rating}, ${best.ev.score} điểm.`
    : `Ngày bạn chọn: ${d ? `${d.ev.rating}, ${d.ev.score} điểm` : '—'}. Tốt nhất là ${best.label} (${best.dayGanZhi}): ${best.ev.rating}, ${best.ev.score} điểm.`;
  return { score: s, msg, reasons: best.ev.reasons };
}

// Trọng số 3 bước → tổng 0..1
export function zheriTotal(results) {
  const W = { xung: 0.3, truc: 0.3, pick: 0.4 };
  return ZHERI_STEPS.reduce((t, k) => t + W[k] * (results[k]?.score || 0), 0);
}

// Bảng tra 12 trực (hiện trong án): từ chi tháng đếm thuận tới chi ngày
export function officerTable(monthZhi) {
  const ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const m = ORDER.indexOf(monthZhi);
  return OFFICERS.map((o, i) => [o, ORDER[(m + i) % 12]]);
}
