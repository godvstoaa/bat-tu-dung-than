// ============================================================================
//  NGŨ ÂM LIỆU PHÁP 五音疗法 — MUSIC THERAPY BY ELEMENT
//  五音 (宫商角徵羽) → ngũ hành → tạng phủ. Dụng Thần → âm phù hợp.
//  "Nghe nhạc gì? Tấu cụ nào? Khi nào?" theo Bát Tự.
//  Nguồn: 黄帝内经 五音疗疾, 礼记 乐记.
// ============================================================================
import { WX_VI } from './constants.js';

// 五音 → ngũ hành → tạng phủ
const FIVE_TONES = {
  角: { vi: 'Giác (jué)', wx: '木', organ: 'Gan–Mật', freq: 'E (Mi)', color: 'xanh', emotion: 'nóng giận → hóa giải bằng Giác (lành)', instruments: 'đàn tranh, sáo trúc, guitar acoustic, violin', genre: 'nhạc dân gian, nhạc tự nhiên (tiếng chim, gió cây)', key: 'E major / E minor', effect: 'sơ can, giải uất, thư giãn thần kinh, làm dịu cơn giận' },
  徵: { vi: 'Trủy (zhǐ)', wx: '火', organ: 'Tim–Ruột non', freq: 'A (La)', color: 'đỏ', emotion: 'vui vẻ → duy trì bằng Trủy', instruments: 'đàn tỳ bà, đàn nguyệt, trumpet, synthesizer', genre: 'nhạc vui, pop, dance, hội hè', key: 'A major', effect: 'thông tâm, bồi dương, hưng phấn, tăng nhiệt huyết' },
  宫: { vi: 'Cung (gōng)', wx: '土', organ: 'Tỳ–Vị', freq: 'C (Đô)', color: 'vàng', emotion: 'lo nghĩ → hóa giải bằng Cung', instruments: 'đàn cổ cầm, piano, cello, organ, trống', genre: 'nhạc thiền, nhạc cổ điển, baroque, nhạc thiền Phật', key: 'C major', effect: 'bổ tỳ, dưỡng vị, an thần, ổn định tiêu hóa' },
  商: { vi: 'Thương (shāng)', wx: '金', organ: 'Phổi–Đại tràng', freq: 'D (Rê)', color: 'trắng', emotion: 'buồn → hóa giải bằng Thương', instruments: 'sáo gỗ, clarinet, trumpet, chuông đồng, steel drum', genre: 'nhạc nhẹ, ballad, nhạc thiền chuông', key: 'D major / D minor', effect: 'tuyên phế, thanh nhiệt, hạ khí, mạnh phổi' },
  羽: { vi: 'Vũ (yǔ)', wx: '水', organ: 'Thận–Bàng quang', freq: 'F (Fa)', color: 'đen', emotion: 'sợ hãi → hóa giải bằng Vũ', instruments: 'đàn tam thập lục, harp, nước (nước chảy), bass', genre: 'nhạc môi trường nước, nhạc thiền sâu, ambient', key: 'F minor', effect: 'bổ thận, tĩnh tâm, nuôi tủy, sâu lắng' },
};

const TONE_ORDER = ['宫', '商', '角', '徵', '羽']; // C D E A F (thứ tự ngũ âm)

// Nhạc gợi ý theo mục đích
const PURPOSE_MUSIC = {
  sleep: { vi: 'Ngủ', need: 'an thần, tĩnh', tone: '宫', alt: '羽' },
  study: { vi: 'Học/thi', need: 'tập trung, minh mẫn', tone: '商', alt: '宫' },
  workout: { vi: 'Vận động', need: 'hưng phấn, năng lượng', tone: '徵', alt: '角' },
  relax: { vi: 'Thư giãn', need: 'giải uất, dịu', tone: '角', alt: '宫' },
  sad: { vi: 'Buồn', need: 'hóa giải bi ai', tone: '商', alt: '徵' },
  angry: { vi: 'Nóng giận', need: 'sơ can, dịu', tone: '角', alt: '羽' },
  anxious: { vi: 'Lo âu', need: 'ổn định tỳ, an', tone: '宫', alt: '羽' },
  fearful: { vi: 'Sợ hãi', need: 'bổ thận, dũng', tone: '羽', alt: '商' },
};

/**
 * @returns {{ dungTone, dungToneInfo, xiTone, kyTone, purposeMap,
 *            playlist, dailySchedule, advice }}
 */
export function musicTherapy(R) {
  const dungWx = R.yong.primary;
  const xiWx = R.yong.xi;
  const kyWx = R.yong.ji;

  // Tìm tone theo ngũ hành
  const findTone = (wx) => Object.entries(FIVE_TONES).find(([k, v]) => v.wx === wx);
  const [dungTone, dungInfo] = findTone(dungWx) || ['宫', FIVE_TONES['宫']];
  const [xiTone, xiInfo] = findTone(xiWx) || ['商', FIVE_TONES['商']];
  const [kyTone, kyInfo] = findTone(kyWx) || ['角', FIVE_TONES['角']];

  // Playlist theo mục đích
  const playlist = Object.entries(PURPOSE_MUSIC).map(([key, p]) => {
    const tone = FIVE_TONES[p.tone];
    // Override: nếu mục đích cần Dụng tone → ưu tiên
    const useTone = key === 'relax' || key === 'angry' ? dungTone : p.tone;
    const useInfo = FIVE_TONES[useTone];
    return {
      purpose: p.vi, need: p.need,
      tone: useTone, toneVi: useInfo.vi, wx: useInfo.wx, wxVi: WX_VI[useInfo.wx],
      instruments: useInfo.instruments, genre: useInfo.genre, key: useInfo.key,
      effect: useInfo.effect,
    };
  });

  // Lịch nghe nhạc theo giờ
  const dailySchedule = [
    { time: '5-7h (Mão — Mộc)', activity: 'tập/giãn cơ', tone: '角', effect: 'sơ can, khởi đầu ngày' },
    { time: '7-11h (Thìn-Tỵ — Thổ/Hỏa)', activity: 'làm việc/học', tone: '商', effect: 'minh mẫn, tập trung' },
    { time: '11-13h (Ngọ — Hỏa)', activity: 'nghỉ trưa', tone: dungTone, effect: 'bổ Dụng Thần, phục hồi' },
    { time: '15-19h (Thân-Dậu — Kim)', activity: 'vận động/xả', tone: '徵', effect: 'hưng phấn nhẹ, vui' },
    { time: '21-23h (Hải — Thủy)', activity: 'chuẩn bị ngủ', tone: '羽', effect: 'tĩnh tâm, bổ thận' },
    { time: '23-1h (Tý — Thủy)', activity: 'ngủ sâu', tone: '宫', effect: 'an thần, dưỡng tỳ (nền giấc ngủ)' },
  ];

  const advice = `Âm Dụng Thần: ${dungInfo.vi} (${dungTone}, hành ${WX_VI[dungWx]}, ${dungInfo.organ}). ` +
    `Nghe: ${dungInfo.genre}. Tấu cụ: ${dungInfo.instruments}. Key: ${dungInfo.key}. ` +
    `Hiệu quả: ${dungInfo.effect}. ` +
    `Tránh: ${kyInfo.vi} (${kyTone}, ${WX_VI[kyWx]}) — tổn nếu nghe nhiều. ` +
    `Nghe Dụng tone vào trưa (11-13h) và tối (21-23h) 15-20 phút.`;

  return {
    dungTone, dungToneInfo: dungInfo,
    xiTone, xiToneInfo: xiInfo,
    kyTone, kyToneInfo: kyInfo,
    playlist, dailySchedule, advice,
    allTones: FIVE_TONES,
  };
}

export { FIVE_TONES, PURPOSE_MUSIC };
