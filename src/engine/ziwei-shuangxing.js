// ============================================================================
//  紫微 双星组合 — SONG TINH TỬ VI (2 chính tinh đồng cung → ý nghĩa kết hợp)
//  "Mệnh/xxx cung tôi có 2 sao cùng ngồi → ý nghĩa đặc thù nào?" — sâu Tử Vi.
//  * 14 chính tinh có thể 同 cung (đặc biệt 紫微系 + 天府系) → thành "song tinh",
//    ý nghĩa KHÔNG phải cộng gộp mà HÒA TRỘN thành đặc thù mới.
//  * Nổi bật nhất: 紫微 5 song tinh (đế tinh + 1 sao天府系):
//    紫微天府(寅申) | 紫微贪狼(卯酉) | 紫微天相(辰戌) | 紫微七杀(巳亥) | 紫微破军(丑未)
//    + 紫微 độc toạ (子午) = "cô quân".
//  * Phát hiện song tinh = CƠ HỌC chắc chắn (đếm chính tinh trong cung); ý nghĩa
//    紫微-song-tinh được nghiên cứu từ 紫微斗数全书/曲文谈斗数.
//  Nguồn: 紫微斗数全书, 曲文谈斗数 双星系列, StarNum 紫微五大双星.
// ============================================================================
import { STARS_14 } from './ziwei-stars.js';

// 紫微 5 song tinh + độc toạ (đã research)
const ZIWEI_COMBO = {
  '紫微天府': { vi: 'Tử Phủ', palace: 'Dần/Thân', tone: 'cat', nature: 'quyền + lợi, ỔN TRỌNG 守成, phúc hậu, dã tâm lớn — bộ trầm ổn nhất, cần NGOẠI LỰC đẩy mới hành động (thiên "tĩnh").', career: 'quản lý, tài chính, BĐS, hành chính' },
  '紫微贪狼': { vi: 'Tử Tham', palace: 'Mão/Dậu', tone: 'volatile', nature: 'hoàng đế đa tài + ĐÀO HOA/DỤC — "Tử Tham" đào hoa, nghệ thuật, giao tế, dung mạo xuất chúng, thích hưởng thụ (thiên "động").', career: 'giải trí, nghệ thuật, giao thương, sales' },
  '紫微天相': { vi: 'Tử Tướng', palace: 'Thìn/Tuất', tone: 'cat', nature: 'ôn hoà + PHỤ TÁ, "đế vương đới ấn" — rõ phải trái, hợp vai trò quản lý/phụ tá, bộ MỀM MẾN nhất trong 5.', career: 'phụ tá, quản lý, hành chính, cố vấn' },
  '紫微七杀': { vi: 'Tử Sát', palace: 'Tỵ/Hợi', tone: 'volatile', nature: 'TÚC SÁT + QUYẾT ĐOÁN + HÀNH ĐỘNG — quyền uy mạnh, khai phá, dũng cảm (cẩn thận Kình/Linh/Liêm hội).', career: 'quân sự, kinh doanh khai phá, quản trị khủng hoảng' },
  '紫微破军': { vi: 'Tử Phá', palace: 'Sửu/Mùi', tone: 'volatile', nature: 'CÁCH MẠNG + TỰ CHỦ — phá vỡ quy cũ, tự lập, dám tiêu tiền, nhân sinh ĐA BIẾN ĐỘNG nhưng tiềm năng khai sáng lớn.', career: 'khởi nghiệp, sáng tạo đổi mới, đầu tư' },
};
const ZIWEI_ALONE = { vi: 'Tử Vi độc toạ', palace: 'Tý/Ngọ', tone: 'mid', nature: 'đế vương CÔ — quyền nhưng thiếu phụ tá, dễ độc đoán/cô độc, cần phụ tinh (Tả/Hữu/Xương/Khúc) mới thành đại quý.', career: 'lãnh đạo đơn lẻ, chuyên gia' };

const PALACE_SHORT = (vi) => (vi || '').split('(')[0].split(' ')[0];

/** Ý nghĩa song tinh 2 sao (优先紫微-song; còn lại sinh-note). */
function comboMeaning(stars) {
  const has = (s) => stars.includes(s);
  // 紫微 5 song tinh
  if (has('紫微')) {
    const partner = ['天府', '贪狼', '天相', '七杀', '破军'].find((s) => has(s));
    if (partner) {
      const def = ZIWEI_COMBO['紫微' + partner];
      if (def) return { combo: '紫微' + partner, ...def };
    }
    // 紫微 độc toạ (có紫微 nhưng không partner天府系) hoặc紫微+紫微系 khác
    return { combo: '紫微独坐/带', ...ZIWEI_ALONE };
  }
  // song tinh khác: sinh note từ 2 sao
  const pair = stars.filter((s) => STARS_14[s]).slice(0, 2);
  if (pair.length === 2) {
    return {
      combo: pair.join(''),
      vi: pair.map((s) => STARS_14[s].vi).join('+'),
      tone: 'mid',
      nature: `${STARS_14[pair[0]].vi} + ${STARS_14[pair[1]].vi} đồng cung — kết hợp "${STARS_14[pair[0]].nature || ''}" và "${STARS_14[pair[1]].nature || ''}".`,
      career: '(xem tổ hợp cụ thể + tam phương tứ chính)',
    };
  }
  return null;
}

/**
 * Quét mệnh bàn: liệt kê các cung có song tinh + ý nghĩa.
 * @returns {{ shuangXing:[{palace,vi,stars,meaning}], mingCombo, summary }}
 */
export function analyzeShuangXing(zr) {
  const mainStars = new Set(Object.keys(STARS_14));
  const out = [];
  for (const p of zr.palaces) {
    const mains = (p.stars || []).filter((s) => mainStars.has(s));
    if (mains.length >= 2) {
      const meaning = comboMeaning(mains);
      out.push({ palace: p.vi, palaceShort: PALACE_SHORT(p.vi), zhi: p.zhi, stars: mains, isMing: !!p.isMing, meaning });
    }
  }
  const mingCombo = out.find((x) => x.isMing) || null;

  let summary;
  if (!out.length) {
    summary = 'Mệnh bàn KHÔNG có song tinh (mỗi cung 1 chính tinh) — mệnh thuần nhất, sao hiển rõ (không hỗn tạp).';
  } else {
    const parts = out.map((x) => `${x.palaceShort}: ${x.meaning.combo}${x.meaning.tone === 'cat' ? '(cát)' : x.meaning.tone === 'volatile' ? '(biến)' : ''}`);
    summary = `Có ${out.length} cung song tinh: ${parts.join(', ')}. ` +
      (mingCombo ? `Mệnh cung = ${mingCombo.meaning.combo} (${mingCombo.meaning.nature}).` : `Mệnh cung độc toạ (1 sao), song tinh ở cung khác.`);
  }
  return { shuangXing: out, mingCombo, summary };
}

export { ZIWEI_COMBO, ZIWEI_ALONE };
