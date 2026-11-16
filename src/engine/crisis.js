// ============================================================================
//  CỔNG KHỦNG HOẢNG — chạy TRƯỚC mọi lời gọi AI, trên máy người chơi (kể cả iOS, kể cả khi AI tắt).
//  Luật: docs/npc-ai/11-khung-hoang-crisis.md §11.2–11.5; bảng tín hiệu: docs/gdd/06-npc-ai/06-01 §11.1;
//  quy tắc làm: docs/GAME-SUA-LOI-MANIFEST.md §2.1. Bộ thiết kế: docs/game/40-AN-TOAN-PHAP-LY.md §40.4.
//  Mô-đun thuần: không import, không gọi mạng. Dùng chung cho askAI (app + 13 thầy bói game),
//  khung hỏi thầy bói, khung trò chuyện NPC và máy chủ /api/npc/chat (lớp chặn thứ hai).
//  Mức A (khẩn — ý định tự hại / bạo hành đang xảy ra) và C (y tế cấp) CHẶN lượt; mức B (đáng lo) không chặn,
//  AI vẫn trả lời kèm lời dặn (theo đề xuất 06-01 §11.1). Sai dương tính được chấp nhận (an toàn hơn).
// ============================================================================

/** Bỏ dấu tiếng Việt, chữ thường, gộp khoảng trắng. */
export function foldVi(s) {
  return String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().replace(/\s+/g, ' ').trim();
}

// Mẫu viết bằng chữ ĐÃ BỎ DẤU, khớp trên chuỗi đã bỏ dấu.
// «muốn chết» đi sau các từ phóng đại đời thường («đói muốn chết», «cười muốn chết») thì bỏ qua.
const HYPERBOLE = '(?<!(?:doi|no|nong|lanh|cuoi|suong|ngon|met|buon ngu|ngai|ghen|thom|dep|vui|so|hoi hop|thich|nho|them) )';
const A_FOLDED = [
  `${HYPERBOLE}muon chet\\b`,
  'tu sat\\b', 'tu van\\b', 'ket lieu (doi|ban than|chinh minh|minh|cuoc song)',
  'khong muon song', 'chang muon song', 'khong con muon song', 'het muon song',
  'nhay (cau|lau) (tu|cho chet|chet)', 'uong thuoc (ngu|chuot) (cho chet|tu|de chet|het)',
  'cat (tay|co tay) (tu|cho chet|de chet)', 'rach co tay',
  'song (de )?lam gi( nua)?\\b', 'khong dang (duoc )?song', 'chet (cho xong|quach|di cho roi)',
  'tu (lam )?hai ban than', 'tu lam dau ban than', 'tu hanh ha ban than',
  'bi .{0,24}(danh|de doa|doa|hanh ha).{0,40}(giet|chet)', '(de doa|doa) giet (toi|em|con|minh|tao)',
  '(danh|dap|bop co) (con|em|toi|minh|tao)\\b.{0,40}(giet|chet)', '(bao|doa|noi|doi) (la )?(se )?giet (con|em|toi|minh|tao)',
  'ket lieu\\b', 'muon bien mat', 'bien mat (khoi|luon|cho xong)',
  // đi theo người đã mất (bộ thử đỏ 06-13 C05): ở lại / xuống âm phủ với người thân
  '(o lai|xuong|di|o) (phong do|am phu|suoi vang|duoi suoi|ben kia)( voi| theo| cung)? ?(bo|me|cha|ong|ba|chong|vo|con|anh|chi|em)?',
  'di theo (bo|me|cha|ong|ba|chong|vo|anh|chi|em)\\b.{0,20}(da mat|qua doi|da chet|o duoi|roi)',
  'kill (myself|me)', 'suicid', 'want to die', 'end my life', 'self.?harm',
];
// Mức B — đáng lo, không có ý định cụ thể (theo đề xuất docs/gdd/06-npc-ai/06-01 §11.1 và cột «Mức» của
// bộ thử đỏ 06-13): KHÔNG chặn lượt; AI vẫn trả lời nhưng nhận lời dặn «không luận lá số, ưu tiên lắng nghe,
// nhắc tìm người thật», và dưới câu trả lời hiện dải «Cần nói chuyện với ai đó?».
const B_FOLDED = [
  'met moi qua', 'met moi lam', 'khong ai can (minh|con|toi|em|tao)', 'do bo di', '(minh|con|toi|em|tao) (that )?vo dung',
  'mat ngu (nhieu|ca|may) (tuan|thang)', 'tram cam', 'chet cung duoc', 'chet cung chang sao',
  'khong muon (co gang|di len|tiep tuc|thu|lam gi) (nua|het)', 'mat (bo|me|cha|ong|ba|chong|vo|con|anh|chi|em)( toi| con| em| minh)? (tuan|thang|hom|ngay|nam) (truoc|qua|ngoai)',
  '(buon|chan nan|co don|tuyet vong) (qua|lam|that)', 'tuyet vong', 'bi bat nat',
];
// Mẫu CÓ DẤU — chỉ áp khi câu có gõ dấu (tránh «từ từ» → «tu tu»).
const A_ACCENTED = ['tự tử', 'tự tữ', 'tự vẩn', 'nhảy cầu', 'nhảy lầu', 'cắt tay', 'uống thuốc ngủ', 'uống thuốc chuột'];
// Mẫu KHÔNG DẤU dễ trùng từ thường — chỉ áp khi cả câu không có dấu.
const A_PLAIN = ['tu tu\\b', 'tu tu (di|cho xong|thoi|roi)', 'nhay cau\\b', 'nhay lau\\b', 'cat tay\\b', 'uong thuoc ngu\\b', 'uong thuoc chuot\\b'];
const C_FOLDED = ['dau (that )?nguc', 'kho tho', 'co giat', 'chay mau (nhieu|khong ngung|khong cam)', 'ngat( xiu| di|$|[ .,!?])(?!ngay)', 'bat tinh'];

const re = (list) => list.map((p) => new RegExp(p));
const RA = re(A_FOLDED), RA_PLAIN = re(A_PLAIN), RC = re(C_FOLDED), RB = re(B_FOLDED);

/** Câu có gõ dấu tiếng Việt không? */
const hasDiacritics = (s) => /[À-ɏḀ-ỿ]/.test(String(s));

/** Mức CHẶN lượt (A hoặc C) — các cổng dùng hàm này. Mức B không chặn. */
export function crisisBlock(text) {
  const l = crisisCheck(text);
  return l === 'A' || l === 'C' ? l : null;
}

/** Lời dặn thêm cho mô hình khi câu ở mức B (một hằng chuỗi, không đổi theo persona). */
export const CRISIS_B_NOTE = '⚠ NGƯỜI CHƠI CÓ DẤU HIỆU KIỆT SỨC: không luận lá số, không nói về hạn hay số phận; ưu tiên lắng nghe, hỏi han nhẹ nhàng, nhắc họ tìm người thân hoặc chuyên gia. Trả lời ngắn, ấm áp, không giảng giải.';
/** Dải nhỏ hiện dưới câu trả lời khi câu ở mức B. */
export const CRISIS_B_STRIP = 'Cần nói chuyện với ai đó? Hãy kể với một người thân, bạn bè hoặc thầy cô. Nếu đang nguy hiểm: gọi 115.';

/** Phân loại một câu người chơi gõ. Trả 'A' | 'C' | 'B' | null. A thắng C, C thắng B. */
export function crisisCheck(text) {
  const raw = String(text ?? '').slice(0, 2000);
  if (!raw.trim()) return null;
  const low = raw.normalize('NFC').toLowerCase().replace(/\s+/g, ' ');
  const f = foldVi(raw);
  const accented = hasDiacritics(raw);
  if (RA.some((r) => r.test(f))) return 'A';
  if (accented ? A_ACCENTED.some((w) => low.includes(w)) : RA_PLAIN.some((r) => r.test(f))) return 'A';
  if (RC.some((r) => r.test(f))) return 'C';
  if (RB.some((r) => r.test(f))) return 'B';
  return null;
}

// ---- Văn bản cố định (một chỗ duy nhất trong mã; không qua AI, không đổi theo persona).
//      Số điện thoại: chỉ 115, 113, 111 — xác minh lại trước mỗi lần phát hành (sách mục 11 §11.4).
export const CRISIS_PHONES_VERIFIED_AT = '2026-11-16 (theo danh sách số khẩn cấp quốc gia; 111 cần xác minh giờ hoạt động)';
export const CRISIS_BLOCK_A = [
  'Trò chơi dừng ở đây một chút, vì điều bạn vừa viết quan trọng hơn trò chơi.',
  '',
  '• Gọi 115 nếu có nguy hiểm đến tính mạng ngay lúc này.',
  '• Số gọi được ngay tại Việt Nam:',
  '  – 115: cấp cứu y tế — gọi cả khi chưa chắc.',
  '  – 113: công an — khi có người đang làm hại bạn.',
  '  – 111: tổng đài bảo vệ trẻ em — người dưới 18 tuổi gọi 111 trước.',
  '• Nói với một người thật ở gần — người thân, bạn bè, thầy cô — ngay hôm nay.',
  '• Bạn không phải một mình. Khi nào sẵn sàng, trò chơi vẫn ở đây.',
].join('\n');
export const CRISIS_BLOCK_C = 'Gọi 115 hoặc tới cơ sở y tế gần nhất ngay.';
export const CRISIS_BUTTONS = ['Nói với người bên cạnh trước', 'Quay lại trò chơi'];

const GENERIC_LINE = 'Trò chơi dừng ở đây một chút; chuyện bạn vừa nói cần một người thật ở bên bạn ngay.';
const LEAVE_ROLE = {
  thay_tubinh: 'Con ơi, thầy gác bút; điều con vừa viết quan trọng hơn mọi lá số trên bàn này.',
  dan_dinh: 'Con ơi, thầy tắt lò; chuyện con nói phải có người thật ở bên con ngay.',
  phuong_si: 'Người lạ ơi, kẻ này dừng đùa; chuyện này cần một người thật ở bên người lạ ngay.',
};

/** Câu rời vai (đúng một câu) + khối hỗ trợ cho mức đã phát hiện. personaId tuỳ chọn. */
export function crisisReply(level, personaId = null) {
  const id = typeof personaId === 'string' ? personaId : personaId?.id;
  return { level, line: LEAVE_ROLE[id] || GENERIC_LINE, block: level === 'C' ? CRISIS_BLOCK_C : CRISIS_BLOCK_A };
}

/** Văn bản thuần (rời vai + khối) — cho askAI và máy chủ. */
export function crisisText(level, personaId = null) {
  const r = crisisReply(level, personaId);
  return `${r.line}\n\n${r.block}`;
}

// ---- Cờ phiên 30 phút (§11.8): bật thì các nơi phát bark trêu đùa / phản diện im lặng. Chỉ lưu trên máy.
export const CRISIS_FLAG_MS = 30 * 60 * 1000;
const FLAG_KEY = 'hq:crisis';
const store = () => { try { return globalThis.localStorage || null; } catch (_) { return null; } };
export function setCrisisFlag(level, now = Date.now()) {
  try { store()?.setItem(FLAG_KEY, JSON.stringify({ level, at: now })); } catch (_) { /* chế độ riêng tư */ }
}
export function crisisActive(now = Date.now()) {
  try { const v = JSON.parse(store()?.getItem(FLAG_KEY) || 'null'); return !!v && now - v.at < CRISIS_FLAG_MS; } catch (_) { return false; }
}
