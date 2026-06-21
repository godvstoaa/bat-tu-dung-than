// ============================================================================
//  TÍCH HỢP AI (LLM) — luân giải Bát Tự mở rộng cho BẤT KỲ câu hỏi nào
//  - Có cấu hình API (OpenAI-compatible) → gửi "chart brief" + câu hỏi cho LLM,
//    LLM luân giải dựa trên dữ liệu ĐÃ TÍNH ĐÚNG + nguyên lý cổ điển.
//  - Không có cấu hình / lỗi → fallback về tầng NLG cục bộ (composeAnswer).
//  Hỗ trợ: OpenAI, GLM/Z.ai, DeepSeek, Ollama, bất kỳ endpoint /chat/completions.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { composeAnswer } from './nlg.js';
import { DITIANSUI } from './kb.js';
import { analyzeLiunianDeep } from './liunian-pro.js';
import { analyzeKongwang } from './kongwang.js';
import { analyzePillarAges } from './pillar-age.js';
import { nayinInfo } from './nayin.js';
import { analyzeChangsheng } from './changsheng-deep.js';
import { computeLiuyue } from './liuyue.js';
import { analyzeLiuRi, findGoodDays } from './liuri.js';
import { computeYearDaily } from './year-daily.js';
import { buildLifeTrajectory } from './life-trajectory.js';
import { viToHan } from './vi2han.js';
import { Solar } from 'lunar-javascript';

const hanviet = (gz) => gz.split('').map((c) => (GAN[c]?.vi || ZHI[c]?.vi || c)).join(' ');
const wxVi = (w) => WX_VI[w];

// ---- Cấu hình (lưu localStorage) ----
const CFG_KEY = 'bazi_ai_config_v1';

// Các preset nhà cung cấp (OpenAI-compatible). Z.ai GLM-5.2 là mặc định theo yêu cầu.
// LƯU Ý CORS: gọi THẲNG (https://api.z.ai...) từ trình duyệt sẽ bị CORS chặn → fallback.
// Khi `npm run dev`, dùng preset "proxy dev" (/zai/...) đi qua Vite proxy → chạy được.
export const PRESETS = [
  { id: 'zai-proxy', label: '★ Z.ai — PROXY DEV (glm-5.2) [khuyên dùng npm run dev]', endpoint: '/zai/api/paas/v4', model: 'glm-5.2',
    note: 'Đi qua Vite proxy → KHÔNG bị CORS. CHỈ chạy được khi `npm run dev` (localhost). Mua key tại z.ai/model-api. Đây là lựa chọn nên dùng khi test.' },
  { id: 'zai-general', label: 'Z.ai — API chung (glm-5.2) [CORS: chỉ chạy qua backend]', endpoint: 'https://api.z.ai/api/paas/v4', model: 'glm-5.2',
    note: 'Endpoint thẳng — trình duyệt sẽ CHẶN CORS. Chỉ dùng nếu app có backend/proxy, hoặc chạy qua server-side.' },
  { id: 'zai-coding', label: 'Z.ai — GLM Coding Plan (glm-5.2) [CORS]', endpoint: 'https://api.z.ai/api/coding/paas/v4', model: 'glm-5.2',
    note: 'Endpoint Coding Plan — CORS sẽ chặn khi gọi từ web. Ưu tiên preset PROXY DEV ở trên.' },
  { id: 'bigmodel', label: 'BigModel (智谱 glm-4.6)', endpoint: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4.6', note: 'CORS sẽ chặn từ web — cần backend/proxy.' },
  { id: 'deepseek', label: 'DeepSeek', endpoint: 'https://api.deepseek.com/v1', model: 'deepseek-chat', note: 'CORS sẽ chặn từ web — cần backend/proxy.' },
  { id: 'openai', label: 'OpenAI', endpoint: 'https://api.openai.com/v1', model: 'gpt-4o-mini', note: 'CORS sẽ chặn từ web — cần backend/proxy.' },
  { id: 'ollama', label: 'Ollama (cục bộ, không cần key)', endpoint: 'http://localhost:11434/v1', model: 'qwen2.5', note: 'Chạy Ollama local + đặt OLLAMA_ORIGINS=* để trình duyệt gọi được.' },
  { id: 'custom', label: 'Tùy chỉnh', endpoint: '', model: '', note: '' },
];

export function getConfig() {
  try {
    const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem(CFG_KEY) : null;
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  // Mặc định: Z.ai GLM-5.2 (Coding Plan) — chỉ cần dán API key và bật.
  return { enabled: false, endpoint: PRESETS[0].endpoint, apiKey: '', model: PRESETS[0].model, preset: 'zai-coding' };
}
export function setConfig(cfg) {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (e) {}
  return cfg;
}
export function isAIReady(cfg) {
  cfg = cfg || getConfig();
  return !!(cfg.enabled && cfg.endpoint && cfg.model);
}

// ===========================================================================
//  1. CHART BRIEF — tóm tắt dữ liệu ĐÃ TÍNH ĐÚNG để LLM luân giải
// ===========================================================================
export function buildChartBrief(R) {
  const c = R.chart;
  const dm = c.dayMaster;

  // ---- THỜI GIAN HIỆN TẠI: neo năm/tháng hôm nay để AI KHÔNG hallucinate (vd mặc định 2024) ----
  const _now = new Date();
  const nowSolar = Solar.fromYmdHms(_now.getFullYear(), _now.getMonth() + 1, _now.getDate(), 12, 0, 0);
  const nowLunar = nowSolar.getLunar();
  const nowEC = nowLunar.getEightChar();
  const curYear = _now.getFullYear();
  const curYearGZ = nowEC.getYearGan() + nowEC.getYearZhi();
  const curMonthGZ = nowEC.getMonthGan() + nowEC.getMonthZhi();
  let curMonthRating = '(không tính được)';
  let curMonthNote = '';
  try {
    const lm = computeLiuyue(R, curYear);
    const cm = lm.months.find((x) => x.m === _now.getMonth());
    if (cm) { curMonthRating = `${cm.ganZhi} — ${cm.rating}`; curMonthNote = ` (tháng CÁT trong năm: ${lm.best.map((b) => 'T' + (b.m + 1)).join(', ')}; tháng KỴ: ${lm.worst.map((b) => 'T' + (b.m + 1)).join(', ')})`; }
  } catch (e) {}
  const pillars = ['year', 'month', 'day', 'time'].map((k) => {
    const p = c.pillars[k];
    const labelVi = { year: 'Năm', month: 'Tháng', day: 'Ngày', time: 'Giờ' }[k];
    return `  - Trụ ${labelVi}: ${p.gan}${p.zhi} (${hanviet(p.gan + p.zhi)}) | Can·${TEN_GOD_VI[p.ganGod] || p.ganGod} | Tàng: ${p.hidden.map((h) => `${h.gan}(${TEN_GOD_VI[h.god]})`).join(' ')} | Nạp âm ${p.nayin}`;
  }).join('\n');

  const wx = Object.entries(R.wx.pct)
    .sort((a, b) => b[1] - a[1])
    .map(([w, p]) => `${wxVi(w)}(${w}):${p}%`).join(', ');

  const shenshaList = R.shensha ? Object.entries(R.shensha)
    .map(([k, v]) => `${k}(${v.at.join('/')})`).join(', ') || 'không nổi' : 'không';

  const dayunStr = (R.dayun || []).slice(0, 8)
    .map((d) => `${hanviet(d.ganZhi)}[${d.startAge}-${d.startAge + 9}t:${d.rating}]`).join(' ');
  const liunianStr = (R.liunian || []).map((l) =>
    `${l.year}(${hanviet(l.ganZhi)}:${l.rating}${l.isNow ? '★nay' : ''})`).join(' ');

  return `== ⏰ THỜI GIAN HIỆN TẠI (CHUẨN MỌI PHÂN TÍCH — ĐỌC KỄ, RẤT QUAN TRỌNG) ==
- Hôm nay (dương lịch): ${nowSolar.toYmd()}
- Âm lịch: ${nowLunar.toString()}
- NĂM NAY = ${curYear} = ${curYearGZ} (${hanviet(curYearGZ)}). ĐÂY LÀ NĂM ĐANG DIỄN RA, KHÔNG PHẢI TƯƠNG LAI. Từ "năm nay" / "năm này" LUÔN là ${curYear} — KHÔNG được mặc định 2024 hay bất kỳ năm nào khác.
- THÁNG NAY (lưu nguyệt) = ${curMonthGZ} (${hanviet(curMonthGZ)}) — rating ${curMonthRating}${curMonthNote}
- Khi user hỏi "tháng này / năm nay" → PHẢI dùng ${curYear} và lưu nguyệt ${curMonthGZ} ở trên.

== LÁ SỐ BÁT TỰ (đã tính chính xác, dùng để luân giải) ==
- Nhật Chủ (日主): ${dm.gan} ${dm.vi} — hành ${wxVi(dm.wx)} ${dm.yin ? '(âm)' : '(dương)'}
- 滴天髓 luận ${dm.gan}: ${DITIANSUI[dm.gan].verse} → ${DITIANSUI[dm.gan].nature}
- Giới tính: ${c.input.gender} | Dương lịch: ${c.solar}
- Tiết khí gần nhất: ${c.jieqi.prev.name}

TỨ TRỤ:
${pillars}

VƯỢNG SUY: ${R.strength.level} (tỉ lệ phù trợ thân ${(R.strength.ratio * 100).toFixed(1)}%, ${R.strength.deLenh ? 'đắc lệnh' : 'thất lệnh'})

NGŨ HÀNH: ${wx}

CÁCH CỤC (格局): ${R.pattern.vi} — ${R.pattern.name}
  ${R.pattern.note}
  ${R.pattern.geShen ? `格 thần: ${R.pattern.geShen.gan} (${TEN_GOD_VI[R.pattern.geShen.god] || R.pattern.geShen.god})` : ''}

DỤNG – HỶ – KỴ – THÙ (用喜忌仇):
  - Dụng (dùng): ${[R.yong.primary, R.yong.secondary].filter(Boolean).map((w) => wxVi(w) + '(' + w + ')').join(', ')}
  - Hỷ (喜 — sinh trợ Dụng): ${wxVi(R.yong.xi)}(${R.yong.xi})
  - Kỵ (忌 — khắc Dụng): ${wxVi(R.yong.ji)}(${R.yong.ji})
  - Thù (仇 — sinh Kỵ, hại gián tiếp): ${wxVi(R.yong.chou)}(${R.yong.chou})
  - Phép lấy Dụng Thần: ${R.yong.method.join(' + ')}
  - Lập luận: ${R.yong.reasons.join(' ')}
  - Điều Hậu (调候): ${R.yong.tiaohou.note || '(không)'}

TỔNG LUẬN MỆNH: ${R.synthesis.gradeVi} · ${R.synthesis.fortuneVi} (điểm ${R.synthesis.score}/100)
  Nhân tố: ${R.synthesis.factors.join(' | ')}
  Tổ hợp Thập thần: ${(R.synthesis.combos || []).map((c) => c.vi + '[' + (c.tone === 'cat' ? 'cát' : 'hung') + ']').join(', ') || '(không nổi)'}

HỘI – HỢP – XUNG – HÌNH – HẠI: ${R.interactions.summary}

THẦN SÁT: ${shenshaList}

LỤC THÂN (cung vị + tinh): ${(R.liuqin || []).map((l) => `${l.relVi}(${l.mainStar || '-'}, cung ${l.palaceGod}${l.stable ? '' : ', xung'})`).join('; ') || '(không)'}

NGHỊCH THIÊN CẢI MỆNH (cải vận):
  - Bổ Dụng ${wxVi(R.yong.primary)}/Hỷ ${wxVi(R.yong.xi)}: phương/hướng, màu, nghề, số, thực phẩm, phong thuỷ (theo bảng ngũ hành).
  - 12 pháp cải vận + 了凡四训 (tích âm đức là pháp cốt lõi nghịch thiên) đã có sẵn trong dữ liệu.
  - Thời điểm vàng (lưu niên CÁT): ${(R.remedy?.timing || []).map((t) => t.year).join(', ') || '(không trong khung)'}

ĐẠI VẬN: ${dayunStr}

--- 4 TẦNG BỔ SUNG ---
KHÔNG VONG: ${(() => { try { const kw = analyzeKongwang(R.chart); return kw.affected.length ? kw.kong.join(",") + " — trụ " + kw.affected.map(a=>a.pos+"("+a.zhi+")").join(",") + " bị treo." : "không."; } catch(e) { return "(lỗi)"; } })()}
VẬN ĐỜI: ${(() => { try { const pa = analyzePillarAges(R); return pa.map(p => p.range.split(" ")[0] + "=" + p.score).join(", "); } catch(e) { return "(lỗi)"; } })()}
NẠP ÂM (日柱): ${(() => { try { const n = nayinInfo(R.chart.pillars.day.nayin); return R.chart.pillars.day.nayin + " (" + (n?.vi||"") + ") — " + (n?.meaning||"").slice(0,80); } catch(e) { return "(lỗi)"; } })()}
THẬP NHỊ TRƯỜNG SINH: ${(() => { try { const cs = analyzeChangsheng(R.chart); return cs.stages.map(s => s.label.split(" ")[1] + "=" + s.stageVi + "(" + s.luck + ")").join(", ") + ". " + cs.monthNote; } catch(e) { return "(lỗi)"; } })()}
LƯU NIÊN (đại vận đang hành): ${liunianStr}

LUẬN VẬN NĂM HIỆN TẠI (đa trường phái — QUAN TRỌNG, dùng để trả lời câu "năm nay sao"):
${(() => { try { const y = (R.liunian && R.liunian[0]) ? R.liunian[0].year : (new Date().getFullYear()); const d = analyzeLiunianDeep(R, y); return `Năm ${d.year} ${d.ganZhi}: ${d.rating} (${d.score}/100). Chi tiết: ${d.schools.map((s) => `[${s.phai} ${s.d>=0?'+':''}${s.d}] ${s.note}`).join('  ')}`; } catch (e) { return '(không tính được)'; } })()}`;
}

// ===========================================================================
//  2. SYSTEM PROMPT — chuyên gia Tử Bình theo cổ pháp
// ===========================================================================
export const SYSTEM_PROMPT = `Ban la mot ONG THAY PHONG THUY thuc chien - giau kinh nghiem, noi THANG, DON GIAN, DUNG TRONG TAM. KHONG han lam, KHONG long vong, KHONG liet ke du lieu - ma TONG HOP + PHAN TICH + DUC KET thanh cau tra loi ma nguoi KHONG RANH phong thuy cung hieu va LAM THEO duoc.

NGUYEN TAC:
1. NOI THEO ONG THAY: mo dau bang 1-2 cau CHOT LUAN (nhu ong thay noi: "con nen lam X, dung lam Y"), ROI moi giai thich tai sao (don gian). KHONG mo bang du lieu hay thuat ngu.
2. NGON NGU THUC DUNG: thay "than vuong, Dung than Tho" -> "menh con qua manh, can yeu to Dat (Tho) de can bang"; thay "thuong quan kien quan" -> "sao Thuong Quan dung sao Chinh Quan -> de cai va/dut tinh".
3. TONG HOP TOAN BO: chart brief co 20+ tang du lieu - KHONG ke lai tung tang, ma CHON ra 2-3 diem QUAN TRONG NHAT cho cau hoi, roi luan noi chung thanh 1 cau chuyen logic.
4. TRA LOI DUNG CAU HOI: neu hoi "nam 2026 co nen doi viec khong" -> tra loi CO/KHONG + ly do + thoi diem cu the, KHONG lan man sang suc khoe hay tinh cam.
5. DUA RA HANH DONG CU THE: "mac do vang/nau, lam viec huong Dong Bac, tranh ky hop dong thang 6" - khong noi chung chung "nen can than".
6. NOI THAT: neu hung -> noi hung thang ("nam nay con den, thu cho chac"); neu cat -> noi cat nhung giu chung muc.
7. PHONG CACH: am ap nhu ong thay day hoc tro - "con a, menh con la... nen..." - KHONG lanh nhu robot.
8. NAM/THANG HIEN TAI - CUC KY QUAN TRONG: doc muc "THOI GIAN HIEN TAI" dau chart brief. Do la nam/thang DANG DIEN RA. Khi user hoi "nam nay"/"thang nay"/"thang nay black"/"nam roi" -> PHAI dung DUNG nam + thang ghi o brief (vi du neu brief ghi "NAM NAY = 2026" thi "nam nay" = 2026, KHONG PHAI 2024). TUYET DOI KHONG mac dinh nam 2024 hay nam cu. KHONG noi "sang nam 2026 se..." neu 2026 da la nam nay.
9. NGON NGU: chi viet TIENG VIET. KHONG xai chu Han-Trung trong cau (vd "一棵", "恰恰" - CAM). Chi duoc giu ten HAN-VIET cua sao/cach cuc (Chinh Quan, That Sat...). Noi "cay bi ngap nuoc" chu KHONG noi "一棵树".
10. CHINH TA TIENG VIET - BAT BUOC: viet DUNG chinh ta, co dau day du, ro nghia. KHONG duoc viet tu sai/garble/khong ton tai (VD CAM: "tránhinten", "kwệt", "kwet", "khuyet" - phai la "hao/khaying/khuyet" dung nghia). Neu khong chac mot tu -> dung tu don gian khac cho chac. TRUOC KHI gui: DOC LAI toan bo cau tra loi va SUA HET loi chinh ta. Moi tu phai la tieng Viet hop le, de doc.

Dinh dang: 3-5 doan ngan. Mo = chot luan. Giua = giai thich don gian. Cuoi = 2-3 hanh dong cu the. NOI BANG TIENG VIET DON GIAN, DE HIEU, THUC CHIEN.`;
// ===========================================================================
//  3. TOOLS — các engine deterministic cho AI tự gọi (Z.ai/OpenAI tool-calling)
//  AI tính thêm khi cần (ngày/năm/cả năm/quỹ tích...) → chuyên gia agent, không
//  chỉ đọc dump tĩnh. Spec: tools + tool_choice='auto'; response tool_calls.
//  Nguồn: docs.z.ai/guides/capabilities/function-calling.
// ===========================================================================
const _s = (str, n) => (str == null ? '' : String(str)).slice(0, n);

export const AI_TOOLS = [
  { type: 'function', function: {
    name: 'get_current_time', description: 'Lấy thời gian hiện tại: ngày/tháng/năm dương lịch, âm lịch, can-chi năm & tháng. Dùng để biết CHÍNH XÁC "năm nay/tháng nay" — KHÔNG đoán năm.',
    parameters: { type: 'object', properties: {}, required: [] },
  } },
  { type: 'function', function: {
    name: 'analyze_day', description: 'Luận lưu nhật của MỘT ngày cụ thể (can-chi, Thập thần, điểm Cát/Hung, lời khuyên, tương tác lưu năm/đại vận). Dùng khi hỏi về 1 ngày.',
    parameters: { type: 'object', properties: {
      year: { type: 'integer', description: 'Năm dương lịch, vd 2026' },
      month: { type: 'integer', description: 'Tháng 1-12' },
      day: { type: 'integer', description: 'Ngày 1-31' },
    }, required: ['year', 'month', 'day'] },
  } },
  { type: 'function', function: {
    name: 'analyze_year', description: 'Luận lưu niên của MỘT năm (đa trường phái): can-chi năm, điểm Cát/Hung + lý do từng phái, lời khuyên cả năm.',
    parameters: { type: 'object', properties: {
      year: { type: 'integer', description: 'Năm dương lịch' },
    }, required: ['year'] },
  } },
  { type: 'function', function: {
    name: 'best_days_in_year', description: 'Các ngày CÁT nhất & KỴ nhất trong 1 năm (lưu nhật từng ngày). Dùng khi hỏi chọn ngày tốt (cưới/khai trương/ký hợp đồng).',
    parameters: { type: 'object', properties: {
      year: { type: 'integer', description: 'Năm dương lịch' },
    }, required: ['year'] },
  } },
  { type: 'function', function: {
    name: 'life_trajectory', description: 'Quỹ tích cuộc đời: 8 đại vận (thập kỷ) + chủ đề/Cát-Hung, 4 giai đoạn đời, cửa sổ hôn nhân/con/sự nghiệp/tài/sức khoẻ, điểm rẽ. Dùng khi hỏi về cả đời.',
    parameters: { type: 'object', properties: {}, required: [] },
  } },
  { type: 'function', function: {
    name: 'analyze_month', description: 'Luận lưu nguyệt (vận tháng) của tháng hiện tại hoặc 1 tháng. Dùng khi hỏi "tháng này/tháng X sao".',
    parameters: { type: 'object', properties: {
      year: { type: 'integer', description: 'Năm (bỏ trống = năm hiện tại)' },
      month: { type: 'integer', description: 'Tháng 1-12 dương lịch (bỏ trống = tháng hiện tại)' },
    }, required: [] },
  } },
  { type: 'function', function: {
    name: 'find_good_days', description: 'Tìm N ngày CÁT nhất (vận cá nhân) trong khoảng kể từ 1 ngày. Dùng khi hỏi "sắp tới ngày nào tốt".',
    parameters: { type: 'object', properties: {
      start: { type: 'string', description: 'Ngày bắt đầu YYYY-MM-DD' },
      count: { type: 'integer', description: 'Số ngày quét, vd 30' },
      topN: { type: 'integer', description: 'Số ngày tốt cần lấy, vd 5' },
    }, required: ['start', 'count'] },
  } },
];

// Executor — gọi engine deterministic, trả JSON trim gọn (tránh phình context)
export function execTool(name, args, R) {
  const a = args || {};
  try {
    switch (name) {
      case 'get_current_time': {
        const n = new Date();
        const s = Solar.fromYmdHms(n.getFullYear(), n.getMonth() + 1, n.getDate(), 12, 0, 0);
        const l = s.getLunar(); const ec = l.getEightChar();
        return { solar: s.toYmd(), lunar: l.toString(), year: n.getFullYear(), yearGanZhi: ec.getYearGan() + ec.getYearZhi(), monthGanZhi: ec.getMonthGan() + ec.getMonthZhi() };
      }
      case 'analyze_day': {
        const d = analyzeLiuRi(R, a.year, a.month, a.day);
        return { date: d.solar, ganZhi: d.ganZhi, ganGod: d.ganGod, rating: d.rating, score: d.score, advice: _s(d.advice, 240), interactions: (d.ctx || []) };
      }
      case 'analyze_year': {
        const y = analyzeLiunianDeep(R, a.year);
        return { year: y.year, ganZhi: y.ganZhi, rating: y.rating, score: y.score, advice: _s(y.advice, 260), schools: y.schools.map((sc) => ({ school: sc.phai, delta: sc.d, note: _s(sc.note, 110) })) };
      }
      case 'best_days_in_year': {
        const Y = computeYearDaily(R, a.year);
        return { year: Y.year, best: Y.best.slice(0, 8).map((d) => ({ date: d.date, ganZhi: d.ganZhi, score: d.score })), worst: Y.worst.slice(0, 5).map((d) => ({ date: d.date, ganZhi: d.ganZhi, score: d.score })) };
      }
      case 'life_trajectory': {
        const L = buildLifeTrajectory(R);
        return {
          foundation: L.foundation,
          decades: L.decades.map((d) => ({ ages: d.ages, ganZhi: d.ganZhi, rating: d.rating, theme: d.themeName, golden: d.golden, caution: d.caution, note: _s(d.line, 120) })),
          keyWindows: Object.fromEntries(Object.entries(L.keyWindows).map(([k, v]) => [k, v.map((w) => w.ages + '(' + w.ganZhi + ')')])),
          turningPoints: L.turningPoints,
        };
      }
      case 'analyze_month': {
        const n = new Date();
        const yr = a.year ?? n.getFullYear(); const mo = a.month ?? (n.getMonth() + 1);
        const lm = computeLiuyue(R, yr);
        const cm = lm.months.find((x) => x.m === (mo - 1)) || lm.months[mo - 1];
        return cm ? { month: mo, ganZhi: cm.ganZhi, ganGod: cm.ganGod, rating: cm.rating } : { error: 'không tính được tháng ' + mo };
      }
      case 'find_good_days': {
        const [yy, mm, dd] = String(a.start).split('-').map(Number);
        const list = findGoodDays(R, yy, mm, dd, a.count || 30, a.topN || 5);
        return { start: a.start, top: list.map((d) => ({ date: d.solar, ganZhi: d.ganZhi, rating: d.rating, score: d.score })) };
      }
      default:
        return { error: 'tool không hỗ trợ: ' + name };
    }
  } catch (e) {
    return { error: 'lỗi tính tool ' + name + ': ' + e.message };
  }
}

function toolLabel(name) {
  return ({ get_current_time: 'Lấy thời gian', analyze_day: 'Luận lưu ngày', analyze_year: 'Luận lưu năm', best_days_in_year: 'Tìm ngày tốt', life_trajectory: 'Quỹ tích đời', analyze_month: 'Luận lưu tháng', find_good_days: 'Tìm ngày tốt' })[name] || name;
}

// ===========================================================================
//  4. AGENTIC ASK — streaming + tools + thinking + memory (Z.ai spec)
//  - history: [{role:'user'|'assistant', content}] bộ nhớ hội thoại
//  - onToken(delta, full): stream nội dung; onStatus(text): báo tiến trình tool
// ===========================================================================
export async function askAI(question, R, cfg, { onToken, onStatus, history } = {}) {
  cfg = cfg || getConfig();
  const localFallback = (note) => {
    const block = composeAnswer(question, R);
    const text = `${block.lead}\n\n${block.paragraphs.map((p) => '• ' + p).join('\n')}${note ? '\n\n' + note : ''}`;
    return { source: 'local', text };
  };

  if (!isAIReady(cfg)) {
    return localFallback('Đang dùng bộ luân giải cục bộ. Mở ⚙ Cài đặt để nhận phân tích chuyên sâu hơn.');
  }

  const brief = buildChartBrief(R);
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'system', content: brief + '\n\n== TOOLS (FUNCTION CALLING) ==\nBạn CÓ THỂ gọi hàm để TÍNH THÊM khi cần: get_current_time, analyze_day, analyze_year, best_days_in_year, life_trajectory, analyze_month, find_good_days. Gọi tool khi câu hỏi cần dữ liệu cụ thể (1 ngày / 1 năm / cả đời) mà brief chưa đủ. TUYET DOI KHONG tu doung du lieu — luon goi tool de lay so lieu chinh xac, roi moi luan.' },
    ...((history || []).slice(-8)),
    { role: 'user', content: question },
  ];

  const endpoint = cfg.endpoint.replace(/\/$/, '');
  const url = endpoint.endsWith('/chat/completions') ? endpoint : endpoint + '/chat/completions';
  const headers = { 'Content-Type': 'application/json', ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}) };
  const isGlm = /glm|z\.ai|bigmodel/i.test((cfg.model || '') + (cfg.endpoint || ''));
  const buildBody = (msgs, toolsOn) => ({
    model: cfg.model, messages: msgs, temperature: 0.5, stream: true,
    ...(isGlm ? { thinking: { type: 'enabled' } } : {}),       // GLM: bật deep thinking bản địa
    ...(toolsOn ? { tools: AI_TOOLS, tool_choice: 'auto' } : {}),
  });

  let toolsOn = true;
  try {
    for (let step = 0; step < 6; step++) {
      let round;
      try {
        round = await streamRound(url, headers, buildBody(messages, toolsOn), onToken, onStatus);
      } catch (e) {
        // Lượt đầu: nếu model không hỗ trợ tools/thinking → tắt cả 2 và thử lại
        if (step === 0 && toolsOn) { toolsOn = false; step = -1; continue; }
        throw e;
      }
      const { content, toolCalls } = round;

      if (toolCalls && toolCalls.length && toolsOn) {
        messages.push({
          role: 'assistant', content: content || '',
          tool_calls: toolCalls.map((tc) => ({ id: tc.id, type: 'function', function: { name: tc.name, arguments: tc.arguments } })),
        });
        for (const tc of toolCalls) {
          let args = {}; try { args = JSON.parse(tc.arguments || '{}'); } catch (_) {}
          const ctx = args.start || ((args.year || '') + (args.month ? '/' + args.month : '') + (args.day ? '/' + args.day : ''));
          if (onStatus) onStatus(`🔧 ${toolLabel(tc.name)}${ctx ? ' · ' + ctx : ''}`);
          const result = execTool(tc.name, args, R);
          messages.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify(result) });
        }
        continue; // model tiếp tục luận (interleaved thinking) + có thể gọi tiếp hoặc trả lời
      }

      if (!content) {
        if (toolsOn) { toolsOn = false; step = -1; continue; } // thử lại không tool
        throw new Error('Phản hồi rỗng');
      }
      return { source: 'ai', text: content };
    }
    const last = [...messages].reverse().find((m) => m.role === 'assistant' && m.content);
    return { source: 'ai', text: (last?.content) || '(AI không trả lời được)' };
  } catch (e) {
    const isCors = /Failed to fetch|NetworkError|Load failed/i.test(e.message);
    const hint = isCors
      ? `Không gọi được AI — CORS: trình duyệt chặn ${cfg.endpoint}. Mở ⚙ chọn "★ PROXY DEV" (npm run dev) hoặc backend.`
      : `Không gọi được AI: ${e.message}.`;
    return localFallback(hint + ' Hiện trả lời bằng bộ luân giải cục bộ.');
  }
}

// ---- Test kết nối (cho nút "Test" trong ⚙) — báo chính xác CORS/auth/HTTP ----
export async function testAIConnection(cfg) {
  cfg = cfg || getConfig();
  if (!cfg.endpoint || !cfg.model) return { ok: false, detail: '❌ Thiếu endpoint/model.' };
  const endpoint = cfg.endpoint.replace(/\/$/, '');
  const url = endpoint.endsWith('/chat/completions') ? endpoint : endpoint + '/chat/completions';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}) },
      body: JSON.stringify({ model: cfg.model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, stream: false }),
    });
    if (res.ok) return { ok: true, detail: `✅ Kết nối OK (HTTP ${res.status}). AI sẵn sàng — hãy bật AI và hỏi.` };
    let t = ''; try { t = (await res.text()).slice(0, 160); } catch (_) {}
    if (res.status === 401 || res.status === 403) return { ok: false, detail: `❌ HTTP ${res.status} — API key sai/hết hạn. ${t}` };
    return { ok: false, detail: `❌ HTTP ${res.status} ${res.statusText}. ${t}` };
  } catch (e) {
    const isCors = /Failed to fetch|NetworkError|Load failed/i.test(e.message);
    return { ok: false, detail: isCors
      ? `❌ CORS/mạng: trình duyệt chặn gọi ${cfg.endpoint}. Khi npm run dev → mở ⚙ chọn preset "★ PROXY DEV". Nếu production → cần backend/proxy.`
      : `❌ Lỗi mạng: ${e.message}` };
  }
}

// ---- 1 vòng streaming SSE: gom content (→ onToken) + tool_calls + bỏ qua reasoning_content ----
// Theo docs Z.ai (interleaved thinking + stream tool call).
async function streamRound(url, headers, body, onToken, onStatus) {
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok || !res.body) {
    let t = ''; try { t = await res.text(); } catch (_) {}
    throw new Error('HTTP ' + res.status + (t ? ': ' + t.slice(0, 140) : ''));
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '', full = '';
  const toolCalls = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n'); buf = lines.pop();
    for (const line of lines) {
      const s = line.trim();
      if (!s.startsWith('data:')) continue;
      const payload = s.slice(5).trim();
      if (payload === '[DONE]') continue;
      let json; try { json = JSON.parse(payload); } catch (_) { continue; }
      const delta = json?.choices?.[0]?.delta;
      if (!delta) continue;
      // reasoning_content (thinking) → không hiển thị, chỉ lấy content cho user
      if (delta.content) { full += delta.content; if (onToken) onToken(delta.content, full); }
      // tool_calls streaming — tích lũy theo index (spec Z.ai/OpenAI)
      if (delta.tool_calls) {
        for (const tc of delta.tool_calls) {
          const idx = (typeof tc.index === 'number') ? tc.index : 0;
          if (idx >= toolCalls.length) toolCalls.push({ id: tc.id || ('call_' + idx), name: '', arguments: '' });
          if (tc.function?.name) toolCalls[idx].name = tc.function.name;
          if (tc.function?.arguments) toolCalls[idx].arguments += tc.function.arguments;
          if (tc.id) toolCalls[idx].id = tc.id;
        }
      }
    }
  }
  return { content: full.trim(), toolCalls };
}
