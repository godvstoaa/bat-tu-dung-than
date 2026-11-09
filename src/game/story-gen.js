// ============================================================================
//  STORY GENERATOR CHO KHÁCH PROCEDURAL (docs/npc-ai/08-npc-procedural-story-
//  generator.md §8.4 — chủ sở hữu chữ ký; docs/GAME-NPC-AI-THIET-KE-DAY-DU.md
//  G0 mục 15.5c) — makeStory(seed, R, slot, pid, npc?, year?) biến dữ kiện CÓ
//  THẬT của lá số khách thành 3 câu chuyện riêng: intro / ask / thanks.
//
//  Luật bất di (mục 08 §8.6):
//  • Story là HÀM THUẦN của hạt: cùng (seed, slot, pid) + cùng R ⇒ nguyên văn
//    cùng chuyện. Hiệu lực hạt = seed ⊕ slot ⊕ pid (storySeed — §8.4.1 ghi pid
//    «chỉ dùng để đổi hạt khi cần»): cùng seed nhưng pid khác / slot khác ⇒
//    chuyện khác (khách mỗi khe mỗi người một chuyện — main.js:56, §8.7 T2).
//  • Mọi quyết định chỉ rút từ rng(hashSeed) kiểu npc.js:5-13 + dữ kiện R/npc.
//    KHÔNG gọi AI (AI ở tầng khác — K2), KHÔNG mạng, KHÔNG DOM, KHÔNG state.
//    Năm là tham số truyền vào; mặc định năm máy đúng khuôn npc.js:41.
//  • Dữ kiện trước giọng sau (T5): khí hậu đo analyzeHanNuan (khuôn halls.js:58),
//    cách cục đọc R.pattern (cùng trục halls.js:246,254 — mở lọc cho bại cách
//    CÓ HẬU, bảng §8.4.1 dòng 12; bằng chứng khoảng trống thuộc mục 09), hợp/
//    khắc đọc R.hhRating (hợp đồng nơi gọi — halls.js:156,171), nghiệm năm đọc
//    analyzeLiunianDeep (khuôn npc-deep.js:42) qua TONE_OF của map-rating.js.
//  • Hoàn cảnh NHẸ only (T6): đổi việc / chuyển nhà / mua nhà / mất ngủ — cấm
//    chết / bệnh thật / tai nạn / ly hôn. Khách không nói chữ Hán (V6 — cách
//    thần dịch Hán Việt), không nhắc tiền / Ngọc / VIP.
//  • Không đổi cấu trúc án: cảm ơn 3 mức GIỮ NGUYÊN ngưỡng case-ui.js:236
//    (sân) + HALL_THANKS case-ui.js:472 làm mức nền sảnh, chỉ NỐI THÊM đúng
//    1 câu recall theo nghiệm R — cùng bậc «Năm nay» để khách không tự mâu
//    thuẫn. UI nối chuỗi theo mức điểm; module chỉ giao chuỗi, không đụng DOM.
//
//  Khuôn gu-gongan.js / namhan.js / kinh-tu.js — thuần, không DOM.
//  Test: scripts/test-story-gen.mjs (same-seed · tách pid/slot · gắn cách cục ·
//  R null fallback · fuzz 100 hạt không ném lỗi).
// ============================================================================
import { hashSeed, rng, makeNpc } from './npc.js';
import { analyzeHanNuan } from '../engine/han-nuan.js';
import { analyzeLiunianDeep } from '../engine/liunian-pro.js';
import { TONE_OF } from './map-rating.js';

// --- Bảng hoàn cảnh × sảnh (§8.4.1) — hằng số, KHÔNG có hoàn cảnh nặng ----------
const HAN_NUAN_FILES = {
  '寒': { tag: 'DH-han-khat-nuoc', why: 'mua nhà cho mẹ già, nhà cũ mùa đông lạnh thấu' },
  '暖': { tag: 'DH-noan-can-lua', why: 'chuyển vào phòng hướng Tây, mùa nóng ngợp thở' },
  '湿': { tag: 'DH-thap-can-kho', why: 'nhà trọ thấp, chăn màn ẩm cả tuần' },
};
const TOPIC_FILES = {
  career: [['CD-doi-viec', 'xưởng đổi ca đầu năm, muốn chuyển công ty'],
           ['CD-be-tac', 'việc treo ba tháng, xin chuyển tổ']],
  wealth: [['CD-mo-rong', 'tiệm {{job}} muốn mở thêm quầy'],
           ['CD-mua-nha', 'để dành năm năm mua căn nhà cũ']],
  love: [['CD-cuoi', 'hai nhà chốt cưới vào cuối năm']],
  study: [['CD-thi', 'thi chứng chỉ đầu xuân']],
  move: [['CD-don-nha', 'hợp đồng thuê hết cuối quý']],
};
const FALLBACK_FILE = { tag: 'CD-chung', why: 'một chuyện thường ngày cần quyết' };

// Cách thần Hán → Hán Việt (khách không nói chữ Hán — V6; bảng cùng nguồn halls.js:239)
const GOD_VI = { '正官': 'Chính Quan', '七殺': 'Thất Sát', '正財': 'Chính Tài', '偏財': 'Thiên Tài', '正印': 'Chính Ấn', '偏印': 'Thiên Ấn', '食神': 'Thực Thần', '傷官': 'Thương Quan' };

// Câu mở theo khe sân (mỗi khe một cảnh chờ) + cặp Hợp Hôn (A nói trước, B nói sau)
const SLOT_OPEN = {
  an0: 'Sáng sớm đã ra sân xếp hàng chờ thầy, ',
  an1: 'Đứng chờ qua lượt khách trước ở sân, ',
  an2: 'Tan việc mới kịp ghé, đứng cuối hàng sân, ',
  'hophon-A': 'Khách thứ nhất trong cặp — ',
  'hophon-B': 'Khách thứ hai trong cặp — ',
};
// Câu kết mở án theo sảnh (thay intro tĩnh halls.js:87 v.v. — cặp AFTER §8.4.4)
const TAIL_OF = {
  dieuhau: 'Nghe nói «lá số lạnh cần lửa, nóng cần nước», nên sang nhờ thầy xem lá số mình thuộc khí hậu nào.',
  tuvi: 'Nghe nói lá số Tử Vi đọc rõ tính tình đường công danh, nên nhờ thầy an sao xem Mệnh.',
  tuongphap: 'Nghe nói thầy xem tượng tài quan là biết mình hợp làm công hay buôn bán, nên sang hỏi.',
  cachcuc: 'Nghe quán luận rằng cách cục định đường đi, nên mang lá số sang nhờ thầy xét cách thành hay bại.',
  hophon: 'Cả quán hôm nay cùng xem cặp này — hai nhà đang chờ lời thầy.',
  trach: 'Nghe nói việc lớn phải chọn ngày mới yên, nên sang nhờ thầy tính giúp ngày lành.',
  duongtrach: 'Nghe nói cửa hợp hướng, giường hợp chỗ thì nhà ở yên, nên sang nhờ thầy đo lại.',
};

// Chọn phần tử theo hạt — khuôn pick của npc.js:14
const pickBy = (r, arr) => arr[Math.floor(r() * arr.length)];

/** Hiệu lực hạt = seed ⊕ slot ⊕ pid (§8.4.1: pid «chỉ dùng để đổi hạt khi cần»). */
export function storySeed(seed, slot = '', pid = '') {
  return hashSeed(`${seed}|slot:${slot}|pid:${pid}`);
}

/** BƯỚC (i): chọn tệp hoàn cảnh theo bảng × sảnh — điều kiện ĐO TỪ R, không bịa.
 *  Mỗi nhánh tự null-safe: R null/lạ → tệp trung tính của sảnh đó, không văng. */
function pickScenario(r, R, slot, npc) {
  if (slot === 'dieuhau') {
    let hn = null;
    if (R != null) { try { hn = analyzeHanNuan(R); } catch { hn = null; } } // lá số lạ → coi như cân bằng
    if (hn && HAN_NUAN_FILES[hn.temperature]) return { ...HAN_NUAN_FILES[hn.temperature] }; // halls.js:69
    if (hn && HAN_NUAN_FILES[hn.humidity]) return { ...HAN_NUAN_FILES[hn.humidity] };       // halls.js:72
    return { tag: 'DH-can-bang', why: 'khí hậu lá số tương đối cân' };                      // hn.needs rỗng / R null
  }
  if (slot === 'cachcuc') {
    // MỞ LỌC cho bại cách CÓ HẬU (bảng §8.4.1 dòng 12): đọc R.pattern trực tiếp —
    // cùng trục halls.js:246,254. Bằng chứng khoảng trống của bộ lọc ≤20 hạt hiện
    // tại là CHỦ SỞ HỮU của mục 09 — đối chiếu mục 09, không nhắc lại ở đây.
    const P = R?.pattern;
    const vi = P?.vi || 'chưa rõ tên cách';
    const godVi = GOD_VI[P?.geShen?.god] || '';
    return P?.type === 'normal'
      ? { tag: 'CC-cach-thuong', why: `vừa ổn định việc, lá số thành cách ${vi}${godVi ? ` (${godVi} làm cách thần)` : ''}, muốn biết đi đường nào` }
      : { tag: 'CC-bai-cach-co-hau', why: `mất việc hồi đầu năm, cách ${vi} tuy chưa thành mà có hậu, đi làm lại chậm mà chắc` };
  }
  if (slot === 'hophon-A' || slot === 'hophon-B') {
    const rating = R?.hhRating; // hợp đồng nơi gọi — builder đã có hh sẵn (halls.js:156,171)
    if (rating === 'Hợp' || rating === 'Đại hợp') return { tag: 'HH-hop', why: 'hai nhà hẹn nhau xem ngày cưới' };
    if (rating === 'Khắc') return { tag: 'HH-khac', why: 'mới về chung nhà, hay cãi chuyện nhỏ' };
    return { tag: 'HH-trung', why: 'hai người đang tìm nhịp sống chung' }; // 'Trung'/thiếu → trung tính
  }
  if (slot === 'trach') return { tag: 'TR-viec-lon', why: '{{job}} sắp có việc lớn cần chọn ngày' };
  if (slot === 'duongtrach') {
    // 3 mẫu gốc dz-case.js:27-31 giữ nguyên chỗ thay {deg}; tệp «vì sao» chọn theo hạt
    const dt = pickBy(r, ['DT-mua-cho-ai', 'DT-ai-mat-ngu']);
    return dt === 'DT-ai-mat-ngu'
      ? { tag: dt, why: 'chính khách đang mất ngủ' }
      : { tag: dt, why: 'nhà mua cho mẹ già ở quê' };
  }
  // Sân an0-2 · tuvi · tuongphap: tệp bám chủ đề mẫu hỏi (npc.topic — npc.js:58)
  const set = TOPIC_FILES[npc?.topic];
  if (!set) return { ...FALLBACK_FILE };
  const [tag, why] = pickBy(r, set);
  return { tag, why };
}

/** BƯỚC (iii)-phụ: 1 câu nghiệm R — cùng bậc «Năm nay» (TONE_OF npc-deep.js:24-28) để khách không tự mâu thuẫn. */
function recallLine(R, year) {
  let tone = 'binh';
  if (R != null) {
    try { tone = TONE_OF[analyzeLiunianDeep(R, year).rating] || 'binh'; } catch { tone = 'binh'; }
  }
  return {
    thuan: 'Năm nay của tôi đang thuận, chuyện này tới nước phải đẩy.',
    binh: 'Năm nay bình thường, tôi làm chậm mà chắc.',
    giu: 'Năm nay nên thủ, chuyện này tôi sẽ từ từ mà xem.',
  }[tone];
}

/**
 * makeStory — 4 bước (§8.4.2), hàm thuần của (seed, R, slot, pid, npc, year).
 * @param seed  hạt giống ĐÚNG như nơi gọi đã dùng cho makeNpc
 *              (sân: `${d}:${i}:${pid}` — main.js:56; dh/zw/mp/cc/hh/zheri/dz — bảng §8.1.1)
 * @param R     lá số khách ĐÃ TÍNH (npcR — halls.js:26); null/undefined → fallback an toàn
 * @param slot  mã sảnh/khe: 'an0'|'an1'|'an2'|'dieuhau'|'tuvi'|'tuongphap'|'cachcuc'
 *              |'hophon-A'|'hophon-B'|'trach'|'duongtrach'
 * @param pid   định danh người chơi (main.js:55) — đổi pid ⇒ đổi chuyện (§8.7 T2)
 * @param npc?  mặc định makeNpc(seed, year) — cùng hạt nên cùng khách (npc.js:41)
 * @param year? năm dương lịch (khuôn makeNpc — npc.js:41)
 * @returns {{ storyId, intro, ask, thanks: { top, mid, low, recall }, tags }}
 *          storyId: hash hiệu lực hạt (seed ⊕ slot ⊕ pid) — mảnh ghép bộ nhớ §8.5
 *          intro  : câu dẫn mở án (thay intro tĩnh của halls.js)
 *          ask    : câu khách hỏi = mẫu gốc npc.question + mẩu «vì sao»
 *          thanks : 3 mức GIỮ (case-ui.js:236/472 làm nền) + recall theo nghiệm R
 *          tags   : nhãn tệp hoàn cảnh đã chọn (phục vụ bộ nhớ §8.5 — chỉ tên tệp)
 */
export function makeStory(seed, R, slot, pid, npc, year) {
  const y = year ?? new Date().getFullYear(); // tham số truyền vào là chính; mặc định theo khuôn npc.js:41
  const n = npc ?? makeNpc(String(seed), y);  // cùng hạt nên cùng khách — không sinh nhân vật mới
  const h = storySeed(seed, slot, pid);
  const r = rng(h); // duy nhất nguồn ngẫu nhiên — npc.js:5-13

  // (i) tệp hoàn cảnh — điều kiện đo từ R
  const sc = pickScenario(r, R, slot, n);

  // (ii) ghép tên + nghề + danh xưng — npc.call đã gắn honorific (npc.js:33-38,57-58);
  //      tên nghề chỉ xuất hiện chỗ hợp lý xã hội (bảng QUESTIONS đã lọc tuổi npc.js:52)
  const call = n.call || n.fullName || 'Khách lạ';
  const job = n.job || 'việc riêng';
  const why = sc.why.split('{{job}}').join(job);

  // (iii) 3 câu riêng; thanks 3 mức GIỮ + recall theo nghiệm R
  const group = slot === 'hophon-A' || slot === 'hophon-B' ? 'hophon' : slot;
  const intro = `${SLOT_OPEN[slot] || ''}${call} — ${job} — ${why}. ${TAIL_OF[group] || 'Nghe nói lá số nói được chuyện ấy, nên sang nhờ thầy xem.'}`;
  const ask = sc.tag.startsWith('HH-')
    ? (n.question || 'Hai chúng tôi có hợp nhau không, về chung nhà nên lưu ý gì?') // hợp hôn giữ mẫu gốc (halls.js:174)
    : `${why}. ${n.question || 'Chuyện này năm nào thuận, nên quyết lúc nào?'}`;     // mẫu gốc npc.js:58 + mẩu «vì sao»
  const thanks = {
    top: group === 'hophon'
      ? (sc.tag === 'HH-hop'
          ? 'Về nhà cứ giữ nhịp này, hai lá số bổ nhau đấy. Cảm ơn thầy!' // nhánh Hợp — cặp AFTER §8.4.4
          : 'Hai đứa về sẽ nói chuyện với nhau kỹ hơn. Cảm ơn thầy!')     // mức NỀN GIỮ — case-ui.js:472
      : 'Thầy luận rõ ràng quá, cảm ơn thầy!',                           // mức GIỮ — case-ui.js:236
    mid: 'Cảm ơn, tôi hiểu thêm được nhiều.',                             // GIỮ — case-ui.js:236
    low: 'Cảm ơn, để tôi ngẫm thêm.',                                     // GIỮ — case-ui.js:236
    recall: recallLine(R, y),                                             // 1 câu nghiệm — cùng bậc npc-deep.js:24-28
  };

  // (iv) storyId = hash hiệu lực hạt — npc.js:5-9
  return { storyId: h, intro, ask, thanks, tags: [sc.tag] };
}
