// ============================================================================
//  NPC-AI G0 · BARK-POOL — MỘT NGUỒN dữ liệu bark của quán (docs/npc-ai/
//  15-lo-trinh-tich-hop.md §15.5b; khuôn hàm mục 05 §05.3; nguyên tắc một
//  nguồn mục 04). Thuần JS, không DOM, không state, không mạng. Bark ≤ 90 ký
//  tự (luật 9 — mục 04 §4.2), không bark doạ, không bark chê lá số xấu của
//  người chơi, không chữ Hán trần trong bong bóng (luật 10 — trùng bộ lọc V6).
//  KHÔNG tự hiển thị — consumer (stations.js, render3d.js, npc-personas.js)
//  gọi pickBark; module chỉ là dữ liệu + hàm chọn không state: cùng id + cùng
//  seed → cùng bark.
//
//  Không gian tên (mục 04 §4.3):
//  • 20 persona canon: key đúng id bảng §4.3 (BARK-<id> theo mục 07) — dữ liệu
//    DẪN CHIẾU từ persona-data.js (một nguồn, audit F2), không còn bản copy.
//  • Nhóm khách procedural AI-light: `khach_dieuhau`, `khach_cachcuc` —
//    TIỀN TỐ `khach_` tách namespace khỏi 20 persona và khỏi id sảnh gốc
//    `dieuhau`/`cachcuc`; khách nhóm này KHÔNG có PERSONA object (giọng theo
//    khuôn khách procedural mục 08/09).
//  • Pool TRẠM (audit F1 — dời nguyên văn từ stations.js STATION_BARKS):
//    `xam`, `que`, `huong`, `tra`, `sen`, `la_ban`, `lich` — mỗi câu giữ chú
//    thích chỗ sách (mục 05) như lúc nằm ở stations.js.
// ============================================================================
import { PERSONAS } from './persona-data.js';

// ---- 20 persona canon — MỘT NGUỒN DỮ LIỆU (audit F2) ------------------------
// Dẫn chiếu thẳng barkPool của từng PERSONA object (mục 04 §4.1.1) thay vì copy
// (bản copy từng lệch đúng 1 chữ: «Sám là tờ bày» ở đây vs «tỏ bày» ở
// persona-data). persona-data.js thuần dữ liệu, KHÔNG import bark-pool → không
// vòng import. Pool persona ≥ 8 câu đã bảo đảm bởi schema persona-data.
const PERSONA_POOLS = Object.fromEntries(PERSONAS.map((p) => [p.id, p.barkPool]));

const POOLS = {
  ...PERSONA_POOLS,

  // ---- Nhóm khách procedural AI-light (mục 04 §4.3 chú thích; mục 14) -----
  // Key `khach_*` tách namespace: KHÔNG trùng 20 persona, KHÔNG trùng id sảnh
  // gốc `dieuhau`/`cachcuc`. Khách nhóm này không có PERSONA object — bark viết
  // theo giọng khách hỏi việc của sảnh (chuỗi thật halls.js:86-89 / :250-260).
  khach_dieuhau: [
    'Nghe nói lá số lạnh cần lửa, nóng cần nước.',
    'Không biết lá số tôi hàn hay noãn, táo hay thấp.',
    'Nên điều hậu bằng hành gì cho hợp nhỉ?',
    'Sinh hoạt thế nào cho hợp khí hậu của mình?',
    'Người ta bảo ở này xem được điều hậu.',
  ],
  khach_cachcuc: [
    'Nguyệt lệnh định cách, thuận thì dưỡng, nghịch thì chế.',
    'Không biết cách của tôi thành hay bại.',
    'Cách này có cứu ứng không nhỉ?',
    'Thuận dụng hay nghịch dụng đây?',
    'Nên đi đường nào cho cách này?',
  ],

  // ---- Pool TRẠM (audit F1 — một nguồn theo docs/npc-ai/05 §05.3 + 04) -----
  // Dời NGUYÊN VĂN từ stations.js STATION_BARKS (G2b tạm đặt ở đó chờ mở khóa;
  // câu/số câu/khi hiện không đổi — chỉ chỗ nằm). Trạm câm khi pool thiếu →
  // pickBark trả null (§05.3), KHÔNG bịa giọng.
  // Ống Xăm — Hoàng Đại Tiên (§05.6, 5 câu; mọi luật keo 3 lần giữ nguyên)
  xam: [
    'Ống xăm rung lên trước mặt khách — Hoàng Đại Tiên đang nghe.', // §05.6 câu 1
    'Giữ một điều muốn hỏi thôi. Quẻ hỏi nhiều thì lòng càng rối.', // §05.6 câu 2 — kế thừa stations.js:303
    'Lắc đã tay; keo thuận thì thẻ mới về tay khách.',               // §05.6 câu 3
    'Keo chối là thần nói thật: hôm nay chưa đủ duyên.',             // §05.6 câu 4 — kế thừa stations.js:368
    'Mai quay lại — ống xăm vẫn đứng đây chờ khách.',                // §05.6 câu 5 — kế thừa stations.js:301-302
  ],
  // Thầy Giải Quẻ — dẫn vào 5 phép (§05.5: que_maihoa · que_liuhao · que_xlr ·
  // que_jk · que_xam, mỗi phép 2 câu — gộp 1 pool; bark theo TỪNG phép
  // nằm ở tab que-ui.js, chờ thợ que-ui wire tiếp)
  que: [
    'Thời điểm khách hỏi chính là con số — tâm thành thì quẻ linh.',      // que_maihoa 1
    'Mai Hoa lấy giờ và số hôm nay, không cần khách nhớ can chi.',        // que_maihoa 2
    'Lắc quẻ cho đúng tay, hào động nói việc sắp tới.',                   // que_liuhao 1
    'Một việc một quẻ — hỏi lác đác thì hào cũng lúng túng.',              // que_liuhao 2
    'Việc người, thời gian, phương hướng — Lục Nhâm trả đủ ba.',          // que_xlr 1
    'Năm tháng nó hiện ra ngay trong bàn, khách đừng đoán hộ.',            // que_xlr 2
    'Câu hỏi ngắn, quyết định nhanh — Kim Khẩu lấy lời thật làm mồi.',    // que_jk 1
    'Khách nói thẳng việc, quẻ mới thẳng việc.',                          // que_jk 2
    'Xăm của Hoàng Đại Tiên, quẻ của thầy đọc.',                          // que_xam 1
    'Lên quỳ trước điện, lắc ống tới khi thẻ rơi.',                       // que_xam 2 — dẫn đúng que-ui.js:283
  ],
  // Lư Hương — Vân Cốc chủ giọng (§05.8, 4 câu mẫu G1; pool CALM_LINES của
  // names.js GIỮ NGUYÊN làm nền câu tĩnh tâm lúc nhang cháy)
  huong: [
    'Con ngồi đi. Nhang cháy hết bảy ngày, con đã đi qua một tuần.', // §05.8 câu 1
    'Hạt nhang tàn hết cũng chưa bằng một hơi thở đủ.',              // §05.8 câu 2
    'Việc lớn làm chậm, việc nhỏ làm xong — vậy là một ngày đẹp.',   // §05.8 câu 3
    'Con không cần tin mệnh. Con chỉ cần thở đủ ba phút.',           // §05.8 câu 4
  ],
  // Trà Thất — người rót vô hình giới thiệu đúng 4 loại trà thật (§05.9;
  // S.TEAS state.js — không nhắc Phúc Khí/khoá 🔒 bằng lời NPC)
  tra: [
    'Trà sen tĩnh, trà lài dịu, ô long ấm, shan tuyết mát — chọn theo ngày của mình.', // §05.9
  ],
  // Hồ Sen — giữ luật riêng tư (§05.9; không hứa «đèn chung MMO» chưa có)
  sen: [
    'Điều ước chỉ thuộc về khách — hồ không đọc, chỉ đưa đi xa.', // §05.9
  ],
  // La Bàn Đài (§05.14, 2 câu — chỉ đọc hướng, không phán vận)
  la_ban: [
    'Quay kim cho đúng nhà mình — hướng hợp hiện lên ngay trước mắt.',
    'Hướng là thứ đổi được: kê giường, đặt bàn — chọn hướng trước, việc sau.',
  ],
  // Bảng Lịch Ngày (§05.14, 2 câu — chỉ nói hôm nay, không chọn thay khách)
  lich: [
    'Hôm nay khắc sẵn trên bảng — việc lớn chọn ngày, việc nhỏ khỏi chọn.',
    'Lịch chỉ nói thời tiết thời gian; quyết định vẫn ở khách.',
  ],
};

/**
 * Chọn bark từ pool — KHÔNG state, KHÔNG tự hiển thị (mục 05 §05.3 khuôn).
 * Múi chọn: hash `poolKey + '|' + seed` (seed thường là dayKey `${todayStr}:${pid}`
 * khuôn stations.js) — cùng id + cùng seed → cùng bark, mai tự đổi.
 * MỘT công thức chọn cho cả persona lẫn trạm (audit F2): personaBark của
 * npc-personas.js delegate về đây, không còn công thức rng riêng.
 *
 * @param {string} id   key pool — id 20 persona, `khach_dieuhau`/`khach_cachcuc`,
 *                      hoặc id pool trạm (xam, que, huong, tra, sen, la_ban, lich)
 * @param {string|number} seed hạt giống ngày/khe/pid của điểm phát bark
 * @param {Object} [_ctx] giữ chỗ cho ngữ cảnh consumer (điều kiện giờ/thời tiết
 *                        nằm phía caller) — module không đọc state game
 * @returns {string|null} bark; pool không có → null — trạm câm như hôm nay,
 *                        KHÔNG bịa giọng (mục 05 §05.3)
 */
export function pickBark(id, seed = '', _ctx = undefined) {
  const pool = POOLS[id];
  if (!pool || pool.length === 0) return null;
  let h = 7;
  for (const ch of String(id + '|' + seed)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
}

/** Toàn bộ pool (chỉ dùng cho test/đối chiếu — không phải của consumer game). */
export const BARK_POOLS = POOLS;

// ---------------------------------------------------------------------------
// Pool trạm DỘNG — NGUỒN KÉP TẠM, TODO G3 (audit F1)
// ---------------------------------------------------------------------------
// vanbia/thaitue: câu bark GHÉP TỪ DỮ LIỆU RUNTIME (số cổng đại vận, can chi
// Thái Tuế, phương vị) nên KHÔNG phải chuỗi tĩnh — không đưa vào POOLS/pickBark
// (khuôn §05.3 là pool tĩnh; câu «Làm nhà… tránh phương ${T.direction}…» nếu để
// nguyên văn trong POOLS còn vượt luật 90 ký tự ở dạng template). Bản dưới là
// CHÉP NGUYÊN VĂN template đang chạy ở vanmenh.js:70-90 (vanBiaBark) và
// thaitue.js:56-83 (thaiTueBark) — 2 file khoá đợt này nên chưa đổi sang
// bark-pool được. Khi 2 file mở khoá (G3): chuẩn hoá về một nguồn (pool hàm
// hoặc chọn tại chỗ), XOA hằng pool cục bộ ở 2 file đó và XOA nguồn kép này.
// TỚI KHI ĐÓ: sửa câu ở một nơi thì sửa cả nơi kia.
// ---------------------------------------------------------------------------
export const DYNAMIC_STATION_POOLS = Object.freeze({
  // vanbia — vanmenh.js:74-81: câu 1 có 2 biến thể (đang có cổng đang đi / chỉ
  // kể số cổng), câu 2 khử tất định
  vanbia: [
    'Bia khắc sẵn ${V.gates.length} cổng — cổng ${ten} là chặng khách đang đi.',
    'Bia khắc sẵn ${V.gates.length} cổng — mỗi cổng một thập kỷ.',
    'Cổng chỉ khắc chặng — mười năm nào đi tới đâu là việc của khách.',
  ],
  // thaitue — thaitue.js:73-78: tuyên vị tướng quân trị năm / phương kiêng dân gian
  thaitue: [
    'Năm ${gzVi} — Thái Tuế năm nay là vị tướng thứ ${T.index}/60, cai phương ${T.direction}.',
    'Làm nhà làm nền năm nay, tránh phương ${T.direction} — kiêng dân gian, không phải lệnh cấm.',
  ],
});
