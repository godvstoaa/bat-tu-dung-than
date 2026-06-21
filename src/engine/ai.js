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

Dinh dang: 3-5 doan ngan. Mo = chot luan. Giua = giai thich don gian. Cuoi = 2-3 hanh dong cu the. NOI BANG TIENG VIET DON GIAN, DE HIEU, THUC CHIEN.`;
// ===========================================================================
//  3. HÀM HỎI ĐÁP CHÍNH
// ===========================================================================
/**
 * Hỏi AI. Trả về Promise<{ source, text }>.
 *  - source 'ai': LLM đã trả lời
 *  - source 'local': fallback NLG cục bộ (do chưa cấu hình hoặc lỗi)
 */
export async function askAI(question, R, cfg, { onToken } = {}) {
  cfg = cfg || getConfig();
  const localFallback = (note) => {
    const block = composeAnswer(question, R);
    const text = `${block.lead}\n\n${block.paragraphs.map((p) => '• ' + p).join('\n')}${note ? '\n\n' + note : ''}`;
    return { source: 'local', text };
  };

  if (!isAIReady(cfg)) {
    return localFallback('Đang dùng bộ luân giải cục bộ. Cấu hình API AI trong ⚙ Cài đặt để nhận phân tích chuyên sâu hơn.');
  }

  const brief = buildChartBrief(R);
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'system', content: brief },
    { role: 'user', content: question },
  ];

  try {
    const endpoint = cfg.endpoint.replace(/\/$/, '');
    const url = endpoint.endsWith('/chat/completions') ? endpoint : endpoint + '/chat/completions';

    if (onToken) {
      // Streaming
      const text = await streamChat(url, cfg, messages, onToken);
      return { source: 'ai', text };
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}),
      },
      body: JSON.stringify({ model: cfg.model, messages, temperature: 0.6, stream: false }),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || '';
    if (!text) throw new Error('Phản hồi rỗng');
    return { source: 'ai', text };
  } catch (e) {
    const isCors = /Failed to fetch|NetworkError|Load failed/i.test(e.message);
    const hint = isCors
      ? `Không gọi được AI — CORS: trình duyệt chặn gọi ${cfg.endpoint}. Mở ⚙ chọn preset "★ PROXY DEV" (khi npm run dev) hoặc dùng backend.`
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

// ---- Streaming (SSE) qua fetch + ReadableStream ----
async function streamChat(url, cfg, messages, onToken) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}),
    },
    body: JSON.stringify({ model: cfg.model, messages, temperature: 0.6, stream: true }),
  });
  if (!res.ok || !res.body) throw new Error('HTTP ' + res.status);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '', full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      const s = line.trim();
      if (!s.startsWith('data:')) continue;
      const payload = s.slice(5).trim();
      if (payload === '[DONE]') return full;
      try {
        const json = JSON.parse(payload);
        const delta = json?.choices?.[0]?.delta?.content || '';
        if (delta) { full += delta; onToken(delta, full); }
      } catch (e) { /* bỏ qua dòng không hợp lệ */ }
    }
  }
  return full;
}
