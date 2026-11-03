// ============================================================================
//  SẢNH NGHỀ (docs/GAME-NOI-DUNG-THEO-APP.md) — mỗi sảnh dựng án dạng KHAI BÁO từ engine app:
//    Điều Hậu (han-nuan + Cùng Thông Bảo Giám) · Thư Viện (Trích Thiên Tủy, Ngũ Ngôn Độc Bộ, Tích Thiện Thiên)
//    Hợp Hôn (hehun) · Tử Vi (ziwei) · Tượng Pháp (Manh phái) · Cách Cục (pattern).
//  Án = { id, npc, R, intro, steps:[{ key, title, prompt, kind, options:[[v, nhãn]], answer, order?, explain, ref? }], ask }
//  kind: 'one' (chọn 1) · 'many' (chọn nhiều, chấm Jaccard) · 'grid9' (la bàn 9 cung).
//  order: thang thứ tự cho 'one' → chọn kề đáp án được 40%.
//  Thuần logic (không DOM) — test: scripts/test-game-halls.mjs. UI chung: case-ui.js › hallCaseBody.
// ============================================================================
import { analyze } from '../engine/chart.js';
import { analyzeHanNuan } from '../engine/han-nuan.js';
import { computeHehun } from '../engine/hehun.js';
import { computeZiwei } from '../engine/ziwei.js';
import { analyzeMangpai } from '../engine/mangpai.js';
import { GAN, ZHI, WX_VI } from '../engine/constants.js';
import { DITIANSUI, DITIANSUI_TONGLUN, WUYAN_DUBU, JISHAN_PIAN, DITIANSUI_MAXIMS, QIONGTONG_TIAOHOU } from '../engine/kb.js';
import { hashSeed, rng, makeNpc } from './npc.js';
import { tiaohouQuote } from './cases.js';

const WX = ['木', '火', '土', '金', '水'];
const SEASON_OF = { 寅: 0, 卯: 0, 辰: 0, 巳: 1, 午: 1, 未: 1, 申: 2, 酉: 2, 戌: 2, 亥: 3, 子: 3, 丑: 3 };
const ZHIS = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const shuffle = (r, a) => { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
const wxOpts = () => WX.map((w) => [w, `${w} ${WX_VI[w]}`]);
const pillarsOf = (R) => { const P = R.chart.pillars; return { year: P.year.gan + P.year.zhi, month: P.month.gan + P.month.zhi, day: P.day.gan + P.day.zhi, time: P.time.gan + P.time.zhi }; };
const npcR = (npc, year) => analyze(npc.year, npc.month, npc.day, npc.hour, npc.minute, npc.gender, year);

// Chấm một bước theo bộ luật chung
export function gradeStep(step, ans) {
  if (step.kind === 'many') {
    const W = new Set([].concat(step.answer)), G = new Set([].concat(ans || []));
    if (!W.size && !G.size) return 1;
    const inter = [...G].filter((x) => W.has(x)).length;
    return inter / new Set([...W, ...G]).size;
  }
  if (ans === step.answer) return 1;
  if (step.order) {
    const a = step.order.indexOf(ans), b = step.order.indexOf(step.answer);
    if (a >= 0 && b >= 0 && Math.abs(a - b) === 1) return 0.4;
  }
  return 0;
}
export const totalOf = (cs, results) => cs.steps.reduce((t, s) => t + (results[s.key] ?? 0), 0) / cs.steps.length;

// ---------------------------------------------------------------------------
// 1. ĐIỀU HẬU — hàn/noãn, táo/thấp, hành cần bù, câu Cùng Thông Bảo Giám
// ---------------------------------------------------------------------------
export function buildDieuHau(key, today = new Date()) {
  const year = today.getFullYear();
  // ưu tiên khách có lá số lệch khí hậu (bài học rõ), vẫn để ~1/4 khách cân bằng
  const r0 = rng(hashSeed(`dh:${key}`));
  const wantSkew = r0() < 0.75;
  let npc, R, hn;
  for (let i = 0; i < 12; i++) {
    npc = makeNpc(`dh:${key}:${i}`, year); R = npcR(npc, year); hn = analyzeHanNuan(R);
    if (!wantSkew || hn.needs.length) break;
  }
  const dm = R.chart.pillars.day.gan;
  const mz = R.chart.monthZhi;
  const q = tiaohouQuote(dm, mz);
  const r = rng(hashSeed(`dh:${key}:q`));
  const others = shuffle(r, Object.entries(QIONGTONG_TIAOHOU).filter(([k]) => k !== `${dm}${(q?.month || mz)}月` && k[0] === dm && SEASON_OF[k[1]] !== SEASON_OF[q?.month || mz])).slice(0, 3).map(([, v]) => v);
  const needWx = [...new Set(hn.needs.map((n) => n.wx))];
  const steps = [
    { key: 'nhiet', title: 'Trục hàn – noãn', kind: 'one', prompt: `Sinh tháng ${mz} (${ZHI[mz].vi}). Tính cả can chi lộ tàng: lá số này lạnh hay nóng?`,
      options: [['寒', 'Hàn (lạnh)'], ['平', 'Ôn hoà'], ['暖', 'Noãn (nóng)']], order: ['寒', '平', '暖'], answer: hn.temperature,
      explain: `Điểm nhiệt ${hn.tempScore} (nền tháng ${hn.monthBase.temp}) → ${hn.tempVi}. Ngưỡng ±1,5.` },
    { key: 'am', title: 'Trục táo – thấp', kind: 'one', prompt: 'Còn độ ẩm: khô hay ướt?',
      options: [['燥', 'Táo (khô)'], ['平', 'Cân'], ['湿', 'Thấp (ẩm)']], order: ['燥', '平', '湿'], answer: hn.humidity,
      explain: `Điểm ẩm ${hn.humidScore} (nền tháng ${hn.monthBase.humid}) → ${hn.humidVi}. Ngưỡng ±1,2. Mậu, Mùi, Tuất làm khô; Kỷ, Thìn, Sửu làm ẩm.` },
    { key: 'bu', title: 'Hành cần bù', kind: 'many', prompt: 'Cần bù hành nào để điều hậu? (không chọn gì nếu khí hậu đã cân)',
      options: wxOpts(), answer: needWx,
      explain: hn.needs.length ? hn.needs.map((n) => `${n.vi}: ${n.why}`).join(' · ') : 'Hàn–noãn–táo–thấp tương đối cân → không cần ép điều hậu.' },
  ];
  if (q) {
    const opts = shuffle(r, [q.text, ...others]);
    steps.push({ key: 'sach', title: 'Tra Cùng Thông Bảo Giám', kind: 'one', prompt: `Nhật chủ ${dm} (${GAN[dm].vi}) sinh tháng ${q.month}${q.season ? ' (cùng mùa)' : ''}: sách dạy câu nào?`,
      options: opts.map((t, i) => [String(i), t]), answer: String(opts.indexOf(q.text)), explain: `Cùng Thông Bảo Giám, ${dm}${q.month}月: ${q.text}` });
  }
  return {
    id: 'dieuhau', npc, R, pillars: pillarsOf(R), steps,
    intro: `${npc.call} hay nghe nói «lá số lạnh cần lửa, nóng cần nước» và nhờ xem lá số mình thuộc khí hậu nào.`,
    ask: 'Lá số tôi hàn hay noãn, táo hay thấp? Nên điều hậu bằng hành gì, sinh hoạt thế nào cho hợp?',
  };
}

// ---------------------------------------------------------------------------
// 2. THƯ VIỆN — đối chiếu nguyên văn ↔ nghĩa (5 câu/ngày)
// ---------------------------------------------------------------------------
export function quoteBank() {
  const out = [];
  for (const [k, v] of Object.entries(DITIANSUI)) if (v?.verse && v?.vi) out.push({ han: v.verse, vi: v.vi, book: `Trích Thiên Tủy · ${k}` });
  for (const [k, v] of Object.entries(DITIANSUI_TONGLUN)) if (v?.verse && v?.vi) out.push({ han: v.verse, vi: v.vi, book: `Trích Thiên Tủy · ${k}` });
  for (const [k, v] of Object.entries(WUYAN_DUBU)) if (v?.verse && v?.vi) out.push({ han: v.verse, vi: v.vi, book: `Ngũ Ngôn Độc Bộ · ${k}` });
  for (const [k, v] of Object.entries(JISHAN_PIAN)) if (v?.verse && v?.apply) out.push({ han: v.verse, vi: v.apply, book: `Tích Thiện Thiên · ${k}` });
  for (const m of DITIANSUI_MAXIMS || []) {
    const i = m.indexOf('—'); if (i < 0) continue;
    out.push({ han: m.slice(0, i).replace(/[「」\s]/g, ''), vi: m.slice(i + 1).trim(), book: 'Cổ quyết' });
  }
  return out.filter((q) => q.han && q.vi);
}
export function buildThuVien(key) {
  const bank = quoteBank();
  const r = rng(hashSeed(`tv:${key}`));
  // chia đều theo sách: 2 Trích Thiên Tủy · 1 Ngũ Ngôn Độc Bộ · 1 Tích Thiện Thiên · 1 Cổ quyết
  const from = (pre, k) => shuffle(r, bank.filter((q) => q.book.startsWith(pre))).slice(0, k);
  const pick = shuffle(r, [...from('Trích Thiên Tủy', 2), ...from('Ngũ Ngôn Độc Bộ', 1), ...from('Tích Thiện Thiên', 1), ...from('Cổ quyết', 1)]);
  const steps = pick.map((q, i) => {
    const wrong = shuffle(r, bank.filter((x) => x.vi !== q.vi)).slice(0, 3).map((x) => x.vi);
    const opts = shuffle(r, [q.vi, ...wrong]);
    return { key: `c${i}`, title: `Câu ${i + 1} · ${q.book.split(' · ')[0]}`, kind: 'one', prompt: `<span class="hq-han">${q.han}</span>`,
      options: opts.map((t, j) => [String(j), t]), answer: String(opts.indexOf(q.vi)), explain: `${q.book}: ${q.han} — ${q.vi}` };
  });
  return { id: 'thuvien', npc: null, steps, intro: 'Tầng thư hôm nay: đọc nguyên văn, chọn đúng nghĩa.', ask: null };
}

// ---------------------------------------------------------------------------
// 3. HỢP HÔN — án chung: mọi người trong ngày cùng một cặp (khoá theo ngày)
// ---------------------------------------------------------------------------
const tagIn = (factors, needle, rules, dflt) => {
  const f = factors.filter((x) => x.includes(needle)).join(' ');
  for (const [re, tag] of rules) if (re.test(f)) return tag;
  return dflt;
};
export function hehunTags(hh) {
  const F = hh.factors;
  const cung = [];
  const fz = F.filter((x) => x.includes('Nhật Chi')).join(' ');
  if (/Hợp/.test(fz)) cung.push('hop');
  if (/Xung/.test(fz)) cung.push('xung');
  if (/Hại/.test(fz)) cung.push('hai');
  if (/Hình/.test(fz)) cung.push('hinh');
  return {
    cung: cung.length ? cung : ['binh'],
    can: tagIn(F, 'Nhật Can', [[/ngũ hợp/, 'hop'], [/tương khắc/, 'khac'], [/tương sinh/, 'sinh'], [/đồng hành/, 'dong']], 'binh'),
    bo: tagIn(F, 'Ngũ Hành', [[/tương bổ/, 'hai'], [/ít bổ sung/, 'it']], F.some((x) => x.includes('Bổ một chiều')) ? 'mot' : F.some((x) => x.includes('Cùng Dụng Thần')) ? 'cung' : 'it'),
  };
}
export function buildHopHon(dayKey, today = new Date()) {
  const year = today.getFullYear();
  const r = rng(hashSeed(`hh:${dayKey}`));
  const a0 = makeNpc(`hh:${dayKey}:a`, year);
  const b0 = makeNpc(`hh:${dayKey}:b`, year);
  // cặp nam–nữ, tuổi gần nhau (chênh 0–6), cùng tuổi lập gia đình
  const ay = year - (24 + Math.floor(r() * 12));
  const A = { ...a0, gender: 'nam', year: ay, age: year - ay, call: `Anh ${a0.fullName.split(' ').pop()}` };
  const by = ay + Math.floor(r() * 7) - 2;
  const B = { ...b0, gender: 'nữ', year: by, age: year - by, call: `Chị ${b0.fullName.split(' ').pop()}` };
  A.day = Math.min(A.day, 28); B.day = Math.min(B.day, 28);
  const RA = npcR(A, year), RB = npcR(B, year);
  const hh = computeHehun(RA, RB);
  const T = hehunTags(hh);
  const pa = pillarsOf(RA), pb = pillarsOf(RB);
  const pick = (re) => hh.factors.filter((x) => re.test(x)).join(' ') || '—';
  return {
    id: 'hophon', npc: A, partner: B, R: RA, pillars: pa, partnerPillars: pb, hh,
    intro: `Án chung hôm nay: cả quán cùng nhận cặp ${A.call} (${A.year}) và ${B.call} (${B.year}). Giải xong vào Giao lưu bàn với nhau.`,
    steps: [
      { key: 'cung', title: 'Cung phu thê (nhật chi)', kind: 'many', prompt: `Nhật chi ${A.call}: <b>${pa.day[1]}</b> ${ZHI[pa.day[1]].vi} · ${B.call}: <b>${pb.day[1]}</b> ${ZHI[pb.day[1]].vi}. Quan hệ hai chi?`,
        options: [['hop', 'Hợp (lục/tam hợp)'], ['xung', 'Xung'], ['hinh', 'Hình'], ['hai', 'Hại'], ['binh', 'Bình thường']], answer: T.cung, explain: pick(/Nhật Chi/) },
      { key: 'can', title: 'Nhật can hai người', kind: 'one', prompt: `Nhật can: <b>${pa.day[0]}</b> ${GAN[pa.day[0]].vi} · <b>${pb.day[0]}</b> ${GAN[pb.day[0]].vi}.`,
        options: [['hop', 'Ngũ hợp'], ['sinh', 'Tương sinh'], ['khac', 'Tương khắc'], ['dong', 'Đồng hành'], ['binh', 'Không đáng kể']], answer: T.can, explain: pick(/Nhật Can/) },
      { key: 'bo', title: 'Ngũ hành bổ nhau', kind: 'one', prompt: `Dụng thần ${A.call}: ${WX_VI[RA.yong.primary]} · ${B.call}: ${WX_VI[RB.yong.primary]}. Hai lá số bổ cho nhau thế nào?`,
        options: [['hai', 'Bổ hai chiều'], ['mot', 'Bổ một chiều'], ['it', 'Ít bổ nhau'], ['cung', 'Cùng thiếu một hành']], answer: T.bo, explain: pick(/Ngũ Hành|Bổ một chiều|Cùng Dụng Thần|Tổn dụng|Dụng Thần hai bên/) },
      { key: 'ket', title: 'Kết luận', kind: 'one', prompt: 'Tổng hợp mọi yếu tố (cả tuổi, nạp âm, mệnh quái, sao phối ngẫu): cặp này ở mức nào?',
        options: [['Khắc', 'Khắc'], ['Trung', 'Trung'], ['Hợp', 'Hợp'], ['Đại hợp', 'Đại hợp']], order: ['Khắc', 'Trung', 'Hợp', 'Đại hợp'], answer: hh.rating,
        explain: `${hh.score} điểm → ${hh.rating}. ${hh.verdict}` },
    ],
    ask: `Tôi (${A.call}, sinh ${A.year}) và ${B.call} (sinh ${B.year}, ngày ${B.day}/${B.month} lúc ${B.hour}h) có hợp nhau không? Nên lưu ý gì khi về chung nhà?`,
  };
}

// ---------------------------------------------------------------------------
// 4. TỬ VI — an Mệnh cung, Ngũ hành cục, chính tinh thủ Mệnh
// ---------------------------------------------------------------------------
export const ZW_MAIN = { 紫微: 'Tử Vi', 天机: 'Thiên Cơ', 太阳: 'Thái Dương', 武曲: 'Vũ Khúc', 天同: 'Thiên Đồng', 廉贞: 'Liêm Trinh', 天府: 'Thiên Phủ', 太阴: 'Thái Âm', 贪狼: 'Tham Lang', 巨门: 'Cự Môn', 天相: 'Thiên Tướng', 天梁: 'Thiên Lương', 七杀: 'Thất Sát', 破军: 'Phá Quân' };
export function buildTuVi(key, today = new Date()) {
  const year = today.getFullYear();
  const npc = makeNpc(`zw:${key}`, year);
  const Z = computeZiwei(npc.year, npc.month, npc.day, npc.hour, npc.minute, npc.gender);
  const ming = Z.palaces.find((p) => p.isMing);
  const stars = (ming.stars || []).filter((s) => ZW_MAIN[s]);
  const b = Z.birth;
  return {
    id: 'tuvi', npc, R: npcR(npc, year), Z,
    intro: `Âm lịch: tháng ${b.lunarMonth}, ngày ${b.lunarDay}, giờ ${b.timeZhi} (${ZHI[b.timeZhi].vi}), năm can ${b.yearGan} (${GAN[b.yearGan].vi}).`,
    steps: [
      { key: 'menh', title: 'An Mệnh cung', kind: 'one', prompt: 'Từ cung Dần khởi tháng Giêng đếm thuận tới tháng sinh, rồi khởi giờ Tý đếm nghịch tới giờ sinh: Mệnh ở cung nào?',
        options: ZHIS.map((z) => [z, `${z} ${ZHI[z].vi}`]), answer: ming.zhi, explain: `Mệnh cung ${Z.mingGong} (${ZHI[ming.zhi].vi}), Thân cung ${Z.shenGong}.` },
      { key: 'cuc', title: 'Ngũ hành cục', kind: 'one', prompt: `Mệnh cung can chi ${Z.mingGong}: lấy nạp âm ra cục nào?`,
        options: [['2', 'Thủy nhị cục'], ['3', 'Mộc tam cục'], ['4', 'Kim tứ cục'], ['5', 'Thổ ngũ cục'], ['6', 'Hỏa lục cục']], answer: String(Z.ju), explain: `${Z.mingGong} → ${Z.juVi}.` },
      { key: 'tinh', title: 'Chính tinh thủ Mệnh', kind: 'many', prompt: 'Chính tinh nào đóng cung Mệnh? (không chọn gì nếu Mệnh vô chính diệu)',
        options: Object.entries(ZW_MAIN), answer: stars,
        explain: stars.length ? `Mệnh có ${stars.map((s) => `${s} ${ZW_MAIN[s]}`).join(', ')}.` : 'Mệnh vô chính diệu — mượn sao cung Thiên Di đối diện.' },
    ],
    ask: 'Thầy xem lá số Tử Vi của tôi: Mệnh, Thân, chính tinh thủ Mệnh nói gì về tính cách và đường công danh?',
  };
}

// ---------------------------------------------------------------------------
// 5. TƯỢNG PHÁP (Manh phái) — Tài tinh, Quan tinh, Phú hay Quý, tầng thứ
// ---------------------------------------------------------------------------
export function buildTuongPhap(key, today = new Date()) {
  const year = today.getFullYear();
  const npc = makeNpc(`mp:${key}`, year);
  const R = npcR(npc, year);
  const M = analyzeMangpai(R);
  const dm = R.chart.pillars.day.gan;
  const fg = /^PHÚ/.test(M.fuguui) ? 'phu' : /^QUÝ/.test(M.fuguui) ? 'quy' : 'can';
  const LV = ['Cách thường', 'Cách trung', 'Cách trung thượng', 'Cách cao'];
  const lv = LV.find((x) => M.level.startsWith(x + ' ')) || LV[0];
  return {
    id: 'tuongphap', npc, R, pillars: pillarsOf(R),
    intro: 'Manh phái xem «tượng»: tài quan nằm đâu, chủ vị (ngày, giờ) hay tân vị (năm, tháng), mệnh làm được «công» gì.',
    steps: [
      { key: 'cai', title: 'Tài tinh', kind: 'one', prompt: `Nhật chủ ${dm} (${GAN[dm].vi}, ${WX_VI[GAN[dm].wx]}). Tài tinh là hành nào?`, options: wxOpts(), answer: M.caiWx, explain: `Ta khắc là Tài → ${WX_VI[M.caiWx]}.` },
      { key: 'quan', title: 'Quan tinh', kind: 'one', prompt: 'Quan Sát (khắc ta) là hành nào?', options: wxOpts(), answer: M.guanWx, explain: `Khắc ta là Quan Sát → ${WX_VI[M.guanWx]}.` },
      { key: 'fg', title: 'Phú hay Quý', kind: 'one', prompt: 'Đếm tài và quan tọa chủ vị: mệnh nghiêng Phú (tài) hay Quý (quan)?',
        options: [['phu', 'Phú — tài chủ đạo'], ['can', 'Cân bằng'], ['quy', 'Quý — quan chủ đạo']], order: ['phu', 'can', 'quy'], answer: fg, explain: M.fuguui },
      { key: 'tang', title: 'Tầng thứ (làm công)', kind: 'one', prompt: 'Mệnh làm được «công» tới đâu?',
        options: LV.map((x) => [x, x]), order: LV, answer: lv, explain: `${M.level} (${M.score} điểm). ${M.notes.slice(0, 2).join(' ')}` },
    ],
    ask: 'Theo Manh phái, tài và quan của tôi nằm ở đâu, tôi hợp làm công hay tự kinh doanh?',
  };
}

// ---------------------------------------------------------------------------
// 6. CÁCH CỤC (Tử Bình Phong) — cách thần, thuận/nghịch, hỷ dụng, kỵ thần
// ---------------------------------------------------------------------------
export const GE_GODS = ['正官', '七殺', '正財', '偏財', '正印', '偏印', '食神', '傷官'];
const GOD_VI = { 正官: 'Chính Quan', 七殺: 'Thất Sát', 正財: 'Chính Tài', 偏財: 'Thiên Tài', 正印: 'Chính Ấn', 偏印: 'Thiên Ấn', 食神: 'Thực Thần', 傷官: 'Thương Quan' };
const GROUP_VI = { guan: 'Quan Sát', cai: 'Tài', yin: 'Ấn', shi: 'Thực Thương', ti: 'Tỷ Kiếp' };
export function buildCachCuc(key, today = new Date()) {
  const year = today.getFullYear();
  let npc, R;
  for (let i = 0; i < 20; i++) {
    npc = makeNpc(`cc:${key}:${i}`, year); R = npcR(npc, year);
    if (R.pattern?.type === 'normal' && GE_GODS.includes(R.pattern.geShen?.god) && R.pattern.pref) break;
  }
  const P = R.pattern;
  return {
    id: 'cachcuc', npc, R, pillars: pillarsOf(R),
    intro: 'Tử Bình Chân Thuyên: lấy nguyệt lệnh định cách, thuận thì dưỡng, nghịch thì chế.',
    steps: [
      { key: 'than', title: 'Cách thần', kind: 'one', prompt: `Tháng ${R.chart.pillars.month.gan}${R.chart.monthZhi}: thần nào trong nguyệt lệnh thấu ra làm cách?`,
        options: GE_GODS.map((g) => [g, `${g} ${GOD_VI[g]}`]), answer: P.geShen.god, explain: `${P.vi} — cách thần ${P.geShen.gan} (${P.geShen.god}), ${P.geShen.source}.` },
      { key: 'thuan', title: 'Thuận hay nghịch dụng', kind: 'one', prompt: 'Cách thần này thuận dụng (cát thần, dưỡng nó) hay nghịch dụng (hung thần, chế nó)?',
        options: [['thuận dụng', 'Thuận dụng'], ['nghịch dụng', 'Nghịch dụng']], answer: P.shunNi, explain: P.note },
      { key: 'yong', title: 'Tương thần (dụng)', kind: 'many', prompt: 'Lấy nhóm thần nào làm dụng để thành cách?',
        options: Object.entries(GROUP_VI), answer: P.pref.yong, explain: `Dụng: ${P.pref.yong.map((g) => GROUP_VI[g]).join(', ')} · hỷ: ${(P.pref.xi || []).map((g) => GROUP_VI[g]).join(', ') || '—'}.` },
      { key: 'ky', title: 'Kỵ thần phá cách', kind: 'one', prompt: 'Nhóm thần nào phá cách này nhất?',
        options: Object.entries(GROUP_VI), answer: P.pref.ji[0], explain: `Kỵ: ${P.pref.ji.map((g) => GROUP_VI[g]).join(', ')}.` },
    ],
    ask: `Lá số tôi là ${P.vi}. Thầy xem cách này thành hay bại, có cứu ứng không, nên đi đường nào?`,
  };
}

export const HALL_BUILD = { dieuhau: buildDieuHau, thuvien: buildThuVien, hophon: buildHopHon, tuvi: buildTuVi, tuongphap: buildTuongPhap, cachcuc: buildCachCuc };
