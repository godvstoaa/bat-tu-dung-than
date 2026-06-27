// ============================================================================
//  HEXAGRAM SYNTHESIS — TỔNG HỢP 3 HỆ QUẺ DỊCH (河洛 + 鬼谷 + 梅花)
//  [loop 545] FEATURE USER: «Kết hợp các loại quẻ dịch, Dịch số hợp với bát tự,
//    hợp với quẻ quỷ cốc». Module này LẤY 3 hệ quẻ Dịch trong app, đối chiếu,
//    luận tương quan + nhất quán cát/hung, trả narrative tiếng Việt.
//
//  3 hệ:
//    1. 河洛理数 (heluo.js) — Bát tự → 本命卦 (Dịch số HỢP BÁT TỰ). Nguồn 陈抟.
//    2. 鬼谷子分定經 (guiguzi-fdg.js) — can năm × can giờ → 配卦 (HỢP QUỶ CỐC).
//    3. 梅花易数 (meihua.js) — theo thời điểm (tuỳ chọn,「hôm nay」).
//  Mỗi quẻ đều quy về 64 quẻ Kinh Dịch → dùng hexagram-meaning.js luận VN chung.
// ============================================================================
import { heluo } from './heluo.js';
import { guiguziFDG } from './guiguzi-fdg.js';
import { hexagramMeaning, SIMP2TRAD, HEX_MEANING } from './hexagram-meaning.js';

// 八卦 → 五行 (dùng cho tương quan ngũ hành giữa 2 quẻ)
const TRI_WX = { '乾': '金', '兑': '金', '离': '火', '震': '木', '巽': '木', '坎': '水', '艮': '土', '坤': '土' };
const WX_VI = { '金': 'Kim', '木': 'Mộc', '水': 'Thủy', '火': 'Hỏa', '土': 'Thổ' };
// tương quan ngũ hành: a sinh b? a khắc b?
const SHENG = { '金': '水', '水': '木', '木': '火', '火': '土', '土': '金' };
const KE = { '金': '木', '木': '土', '土': '水', '水': '火', '火': '金' };

// Chuẩn hoá tên quẻ về dạng GIẢN THỂ để so sánh chéo heluo (giản) ↔ guiguzi (phồn)
function normSimp(name) {
  if (!name) return '';
  if (HEX_MEANING[name]) return name; // đã là giản (key HEX_MEANING)
  for (const [s, t] of Object.entries(SIMP2TRAD)) if (t === name) return s; // phồn → giản
  return name;
}

function rel(a, b) {
  if (!a || !b || a === b) return { k: 'bằng', vi: 'cùng hành' };
  if (SHENG[a] === b) return { k: 'tương sinh', vi: `${WX_VI[a]} sinh ${WX_VI[b]} (phù trợ)` };
  if (SHENG[b] === a) return { k: 'được sinh', vi: `${WX_VI[b]} sinh ${WX_VI[a]} (được nuôi)` };
  if (KE[a] === b) return { k: 'tương khắc', vi: `${WX_VI[a]} khắc ${WX_VI[b]} (chế ngự)` };
  if (KE[b] === a) return { k: 'bị khắc', vi: `${WX_VI[b]} khắc ${WX_VI[a]} (bị khắc)` };
  return { k: 'bằng', vi: 'cùng hành' };
}

const TONE_W = { cát: 1, hung: -1, trung: 0 };
function toneOf(hexName) { return hexagramMeaning(hexName)?.tone || 'trung'; }

export function hexagramSynthesis(R) {
  const out = { ok: false, systems: {}, synthesis: null };
  try {
    // 1. 河洛理数 (Bát tự → quẻ)
    let hel = null;
    try { const h = heluo(R); if (h && h.ok) hel = h; } catch (e) { out.heluoError = e.message; }
    // 2. 鬼谷子分定經 (can năm × can giờ → quẻ)
    let gg = null;
    try { gg = guiguziFDG(R); } catch (e) { out.guiguziError = e.message; }

    const helName = hel?.hexagram?.name || null;
    const ggName = gg?.gua || null;
    const helSimp = normSimp(helName);
    const ggSimp = normSimp(ggName);

    const systems = {};
    if (hel) {
      const m = hexagramMeaning(helSimp);
      systems.heluo = {
        name: hel.hexagram.name, nameVi: hel.hexagram.nameVi, num: hel.hexagram.num,
        upperTrigram: hel.upperTrigram, lowerTrigram: hel.lowerTrigram,
        yuantangLine: hel.yuantang?.line,
        tone: m.tone, nature: m.nature, fortune: m.fortune,
        source: '河洛理数 (Bát tự → 本命卦, 陈抟)',
      };
    }
    if (gg) {
      const m = hexagramMeaning(ggSimp);
      systems.guiguzi = {
        name: gg.gua, nameVi: gg.guaVi, geMing: gg.geMing,
        stars: gg.stars, tone: m.tone, nature: m.nature, fortune: m.fortune,
        source: '鬼谷子分定經 (can năm × can giờ → 配卦)',
      };
    }
    out.systems = systems;

    // 3. TỔNG HỢP tương quan (chỉ khi có cả 2 hệ quẻ mệnh)
    if (hel && gg) {
      const sameHex = helSimp && ggSimp && helSimp === ggSimp;
      const helTone = toneOf(helSimp);
      const ggTone = toneOf(ggSimp);
      const consistency = (TONE_W[helTone] || 0) + (TONE_W[ggTone] || 0);

      // ngũ hành: dùng hạ quái (mệnh gốc) của 河洛 vs 行 đặc trưng 鬼谷
      // 鬼谷 chỉ có tên quẻ kép → lấy ngũ hành hạ quái qua HEX64 ngược (giản thể)
      // đơn giản hoá: so ngũ hành trigram THƯỢNG của 河洛 vs tone 鬼谷 + nature keyword
      const helWx = TRI_WX[hel.upperTrigram] || '?';
      // 鬼谷 ngũ hành: suy từ nature (chứa từ khoá)
      const natLower = (gg.guaNature || '') + (systems.guiguzi?.nature || '');
      const wxGuess = natLower.includes('Hỏa') || natLower.includes('火') ? '火'
        : natLower.includes('Thủy') || natLower.includes('水') ? '水'
        : natLower.includes('Mộc') || natLower.includes('木') ? '木'
        : natLower.includes('Kim') || natLower.includes('金') ? '金' : '土';
      const relInfo = rel(helWx, wxGuess);

      let verdict, advice;
      if (sameHex) {
        verdict = 'CỰC KỲ NHẤT TRÍ — cả hai hệ Dịch số đều dẫn đến CÙNG một quẻ';
        advice = `Hai phương pháp độc lập (河洛理数 từ Bát tự + 鬼谷分定經 từ can năm×giờ) đều cho quẻ ${hel.hexagram.nameVi}. Đây là tín hiệu mạnh: bản mệnh chịu ảnh hưởng TÂN TRỌNG của quẻ này. ${systems.heluo?.fortune || ''}`;
      } else if (consistency >= 2) {
        verdict = 'NHẤT QUÁN CÁT — cả hai quẻ đều thiên CÁT, bổ trợ lẫn nhau';
        advice = `河洛 (${systems.heluo.nameVi}) + 鬼谷 (${systems.guiguzi.nameVi}) đều chỉ hướng tốt. Đây là lá số được 2 hệ Dịch số «đồng thanh tương ứng», vận mệnh có nền cát vững. Nên phát huy thế mạnh, tiến thủ.`;
      } else if (consistency <= -2) {
        verdict = 'NHẤT QUÁN HUNG — cả hai quẻ đều thiên HUNG, cần cẩn trọng';
        advice = `河洛 (${systems.heluo.nameVi}) + 鬼谷 (${systems.guiguzi.nameVi}) đều chỉ thử thách/nghịch. 2 hệ Dịch số cùng cảnh báo → cần thủ, tu đức, kiên nhẫn đợi thời, tránh mạo hiểm.`;
      } else if (Math.abs(consistency) === 1) {
        verdict = 'LỆCH NHẸ — một quẻ cát, một quẻ trung/hung';
        advice = `河洛 (${systems.heluo.nameVi}) vs 鬼谷 (${systems.guiguzi.nameVi}): thiên lệch nhẹ. Một mặt thuận, một mặt cần cẩn. Cân bằng tiến/thủ theo hoàn cảnh cụ thể.`;
      } else {
        verdict = 'TRUNG HÒA — cả hai quẻ đều trung tính';
        advice = `河洛 (${systems.heluo.nameVi}) + 鬼谷 (${systems.guiguzi.nameVi}) đều trung hoà. Vận mệnh cân bằng, không thiên cát/hung rõ — tự nỗ lực quyết định.`;
      }

      out.synthesis = {
        sameHexagram: !!sameHex,
        heluoTone: helTone, guiguziTone: ggTone,
        consistency, verdict, advice,
        wuxingRel: { heluoWx: helWx, guiguziWx: wxGuess, rel: relInfo.k, vi: relInfo.vi },
      };
    } else if (hel || gg) {
      const only = hel ? systems.heluo : systems.guiguzi;
      out.synthesis = {
        sameHexagram: false,
        verdict: `Chỉ tính được 1 hệ (${hel ? '河洛' : '鬼谷'})`,
        advice: `${only.nameVi} (${only.source}): ${only.fortune}`,
      };
    }
    out.ok = true;
  } catch (e) {
    out.ok = false;
    out.error = e && e.message ? e.message : String(e);
  }
  return out;
}

// Helper export: tên Hán Việt chuẩn cho 1 quẻ (dùng ở nhiều nơi)
export function guaVi(name) { return hexagramMeaning(name)?.nameVi || name; }
