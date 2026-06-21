// ============================================================================
//  TẦNG LUẬN GIẢI LINH HOẠT (Natural Language Generation)
//  Nhận câu hỏi TỰ DO → định danh ý định → soạn câu trả lời cụ thể dựa trên
//  TOÀN BỘ lá số (cách cục, hội hợp, thần sa, dụng thần, đại vận, lưu niên)
//  + Cơ sở tri thức kb.js. Cùng lá số + cùng câu hỏi ⇒ cùng câu trả lời.
// ============================================================================
import { WX_VI, GAN, ZHI, SHENG, KE, KE_BY, TEN_GOD_VI } from './constants.js';
import { analyzeLiunianDeep } from './liunian-pro.js';
import { WX_INFO, DM_PROFILE } from './interpret.js';
import {
  TEN_GOD_DEEP, INTERACTION_MEANING, PATTERN_GUIDE, LIFE_AREA_INDEX, dominantGods, DITIANSUI,
} from './kb.js';

const hanviet = (gz) => gz.split('').map((c) => (GAN[c]?.vi || ZHI[c]?.vi || c)).join(' ');
const wxVi = (w) => WX_VI[w];
const godViShort = (g) => TEN_GOD_VI[g] || g;
const favText = (yong) => [...new Set([yong.primary, yong.secondary].filter(Boolean))].map((w) => `${wxVi(w)} (${w})`).join(' & ');
const avoidText = (yong) => [...new Set(yong.avoid)].map((w) => `${wxVi(w)} (${w})`).join(' & ');

// ---------------------------------------------------------------------------
//  1. ĐỊNH DANH Ý ĐỊNH từ câu hỏi
// ---------------------------------------------------------------------------
const INTENT_KEYWORDS = {
  career: ['sự nghiệp', 'công việc', 'công danh', 'thăng tiến', 'nghề', 'làm ăn', 'kinh doanh', 'chức', 'sếp', 'đi làm', 'nghỉ việc', 'đổi việc', 'thăng chức'],
  wealth: ['tài', 'tiền', 'của cải', 'giàu', 'lộc', 'đầu tư', 'tài chính', 'phát tài', 'làm giàu', 'kiếm tiền', 'kinh tế', 'nợ', 'lãi'],
  love: ['tình', 'duyên', 'hôn nhân', 'vợ', 'chồng', 'người yêu', 'kết hôn', 'cưới', 'gia đạo', 'ly hôn', 'đào hoa', 'phối ngẫu', 'tái hôn'],
  health: ['sức khỏe', 'bệnh', 'ốm', 'tạng', 'dưỡng sinh', 'thể chất', 'thọ', 'tai nạn', 'đau'],
  study: ['học', 'thi', 'bằng cấp', 'trí tuệ', 'kiến thức', 'sáng tạo', 'trường', 'đại học', 'luận văn', 'nghiên cứu'],
  children: ['con', 'con cái', 'sinh con', 'có con', 'quý tử', 'hậu duệ', 'thai'],
  family: ['gia đình', 'cha mẹ', 'anh em', 'ruột thịt', 'thân thuộc', 'mẹ', 'bố', 'cha'],
  travel: ['đi xa', 'xuất khẩu', 'nước ngoài', 'di cư', 'du lịch', 'dịch chuyển', 'định cư', 'xa nhà', 'lao động'],
  power: ['quyền', 'lãnh đạo', 'uy quyền', 'chức quyền', 'ảnh hưởng', 'địa vị', 'quyết định'],
  timing: ['vận', 'đại vận', 'thời điểm', 'năm nào', 'tuổi', 'lúc nào', 'tương lai', 'khi nào', 'tháng', 'năm nay', 'năm sau'],
  personality: ['tính cách', 'bản mệnh', 'con người', 'tướng', 'khí chất', 'bản chất', 'người như thế nào'],
  remedy: ['cải mệnh', 'cải vận', 'làm sao để', 'nên làm gì', 'làm gì', 'cách', 'hóa giải', 'tăng', 'giảm', 'tránh', 'phương pháp', 'khắc phục', 'thay đổi', 'cải thiện', 'khai vận', 'bổ mệnh'],
};

export function detectIntent(question) {
  const t = (question || '').toLowerCase();
  const norm = t.normalize('NFD').replace(/[̀-ͯ]/g, ''); // bỏ dấu để match thoáng
  const years = (question.match(/(19|20)\d{2}/g) || []).map(Number);
  const isTiming = /\b(khi nào|lúc nào|năm nào|tháng nào|năm nay|năm sau|bao giờ)\b/.test(norm) || years.length > 0;
  const isYesNo = /\b(có nên|có được không|nên không|được không|có tốt không|có xấu không|có thể|liệu có)\b/.test(norm);
  const isCompat = /\b(hợp không|hợp nhau|xung khắc|theo không|phù hợp)\b/.test(norm);

  let area = 'general', bestHits = 0;
  for (const [id, kws] of Object.entries(INTENT_KEYWORDS)) {
    let hits = 0;
    for (const k of kws) {
      const kn = k.normalize('NFD').replace(/[̀-ͯ]/g, '');
      // chấm theo độ dài từ khóa: từ càng dài càng cụ thể (tránh "tinh" khớp "tinh cach")
      if (norm.includes(kn)) hits += kn.length;
    }
    if (hits > bestHits) { bestHits = hits; area = id; }
  }
  // confidence: bestHits tổng độ dài từ khoá khớp. <3 = không khớp rõ → câu tự do/khó hiểu
  const confidence = bestHits;
  return { area, years, isTiming, isYesNo, isCompat, confidence, raw: question };
}

// ---------------------------------------------------------------------------
//  2. TIỆN ÍCH tra présence sao / thần sa
// ---------------------------------------------------------------------------
function godScore(chart) {
  const c = {};
  for (const key of ['year', 'month', 'time']) {
    const g = chart.pillars[key].ganGod;
    if (g && g !== '日主') c[g] = (c[g] || 0) + 1;
  }
  for (const key of ['year', 'month', 'day', 'time']) {
    const main = chart.pillars[key].hidden[0];
    c[main.god] = (c[main.god] || 0) + 0.5;
  }
  delete c['日主'];
  return c;
}
const hasShen = (R, key) => !!(R.shensha && R.shensha[key]);

// ---------------------------------------------------------------------------
//  3. CÁC BỘ SOẠN THEO LĨNH VỰC (mỗi hàm → {title, paragraphs})
// ---------------------------------------------------------------------------
function pPersonality(R) {
  const dm = R.chart.dayMaster;
  const top = dominantGods(R.chart, 2);
  const dt = DITIANSUI[dm.gan];
  return {
    title: 'Bản mệnh & tính cách',
    paragraphs: [
      `「${dt.verse}」 — 滴天髓 luận ${dm.gan} ${dm.vi}. ${dt.vi}`,
      `Bản chất sâu: ${dt.nature}`,
      `Thập Thần nổi bật: ${top.map((g) => `${g.vi} (${g.n})`).join(', ')} — ${top.map((g) => TEN_GOD_DEEP[g.god]?.nature).join(' ')}`,
      top[0] && TEN_GOD_DEEP[top[0].god] ? (R.strength.strong ? `Vượng: ${TEN_GOD_DEEP[top[0].god].vuong}` : `Nhược: ${TEN_GOD_DEEP[top[0].god].nhuoc}`) : '',
      `Cách cục ${R.pattern.vi}. Nhu cầu khai vận: ${dt.need}.`,
    ].filter(Boolean),
  };
}

function pCareer(R) {
  const yong = R.yong;
  const gods = godScore(R.chart);
  const guan = (gods['正官'] || 0) + (gods['七殺'] || 0);
  const officerWx = yong.relations.officerWx;
  const favCareer = [...new Set([yong.primary, yong.secondary].filter(Boolean))];
  const lines = [];
  lines.push(`Sự nghiệp lấy Quan – Ấn làm sao chủ. Mệnh bạn Quan Sát ${guan >= 1.5 ? 'hiện rõ, có khí chất lãnh đạo/địa vị' : guan > 0 ? 'có nhưng hơi mỏng' : 'ẩn/khuyết — sự nghiệp tự thân gây dựng nhiều hơn nhờ lộc'}.`);
  lines.push(R.strength.strong
    ? `Thân vượng, đủ sức gánh Quan – Tài, hợp môi trường cạnh tranh, giữ vị trí quản lý hoặc tự làm chủ.`
    : `Thân nhược, nên chọn nơi ổn định, có quý nhân/Ấn dìu dắt, tích lũy rồi mới tiến; tránh ôm đồm quyền cao chức trọng.`);
  if (hasShen(R, 'jiangXing')) lines.push(`🌟 Có Tướng Tinh → tiềm năng lãnh đạo, chỉ huy.`);
  lines.push(`Ngành nghề hợp Dụng Thần (${favText(yong)}): ${favCareer.map((w) => WX_INFO[w].nghe).join('; ')}.`);
  lines.push(`Phương vị tốt cho văn phòng: ${WX_INFO[yong.primary].huong}; bàn làm việc hướng về phương này tăng trợ lực. Màu ${WX_INFO[yong.primary].mau}.`);
  return { title: 'Sự nghiệp & công danh', paragraphs: lines };
}

function pWealth(R) {
  const yong = R.yong;
  const gods = godScore(R.chart);
  const cai = (gods['正財'] || 0) + (gods['偏財'] || 0);
  const wealthWx = yong.relations.wealthWx;
  const isFav = yong.primary === wealthWx || yong.secondary === wealthWx;
  const isAvoid = yong.avoid.includes(wealthWx);
  const lines = [];
  lines.push(`Tài lộc lấy Tài tinh (hành ${wxVi(wealthWx)}) làm chủ. Mệnh ${cai >= 1.5 ? 'Tài vượng, cơ hội tiền bạc nhiều' : cai > 0 ? 'Tài vừa phải' : 'Tài mỏng — phải chủ động tìm'}.`);
  if (R.strength.strong) lines.push(`Thân vượng nhậm được tài — càng làm càng giữ, hợp kinh doanh/đầu tư chủ động.`);
  else lines.push(`Thân nhược gặp Tài vượng dễ "tài đa thân nhược", tiền qua tay khó giữ; nên hùn hạp, cộng sự, tránh đòn bẩy/nợ lớn.`);
  if (isFav) lines.push(`🎉 Tài chính là Dụng Thần → chủ động cầu tài rất hiệu, tài vận sáng.`);
  else if (isAvoid) lines.push(`⚠️ Tài nằm trong Kỵ Thần → đừng tham liều; giữ tiền qua kênh Dụng Thần (${favText(yong)}) mới bền.`);
  lines.push(`Kênh tích tài thiên về lĩnh vực hành ${favText(yong)}; màu ví/tài khoản hợp: ${WX_INFO[yong.primary].mau}.`);
  return { title: 'Tài lộc & tiền bạc', paragraphs: lines };
}

function pLove(R) {
  const { chart, yong } = R;
  const isMale = chart.input.gender === 'nam';
  const spouseWx = isMale ? KE[chart.dayMaster.wx] : KE_BY[chart.dayMaster.wx];
  const spouseStar = isMale ? 'Tài (vợ)' : 'Quan Sát (chồng)';
  const dayZhi = chart.pillars.day.zhi;
  const dayZhiGod = chart.pillars.day.hidden[0].god;
  const isFav = yong.primary === spouseWx || yong.secondary === spouseWx;
  const isAvoid = yong.avoid.includes(spouseWx);
  const lines = [];
  lines.push(`Với ${isMale ? 'nam' : 'nữ'} mệnh, sao hôn nhân là ${spouseStar} (hành ${wxVi(spouseWx)}). Cung phu thê (Nhật Chi) = ${dayZhi} (${ZHI[dayZhi].vi}), tàng ${TEN_GOD_VI[dayZhiGod] || dayZhiGod}.`);
  if (isFav) lines.push(`💕 Sao phối ngẫu = Dụng Thần → hôn nhân là trợ lực lớn, bạn đời mang lại may mắn.`);
  else if (isAvoid) lines.push(` Sao phối ngẫu ∈ Kỵ Thần → duyên cần chọn lọc, dễ thử thách; nên kết hôn muộn, ưu tiên người mệnh bổ trợ Dụng Thần.`);
  else lines.push(`Sao phối ngẫu trung tính → hôn nhân thuận theo sự vun đắp của hai bên.`);
  if (hasShen(R, 'taoHua')) lines.push(`🌸 Có Đào Hoa → duyên sắc tốt, dễ hấp dẫn người khác giới (lợi giao tế, cẩn thận đào hoa lệch).`);
  // xung/hình Nhật chi → biến động gia đạo
  const dayClash = R.interactions.chong.find((c) => c.at.includes('Ngày') || c.a === dayZhi || c.b === dayZhi);
  if (dayClash) lines.push(`⚡ Nhật Chi bị xung (${dayClash.a}↔${dayClash.b}) → gia đạo/hôn nhân dễ biến động, cần bao dung.`);
  lines.push(`Người hợp thường mang hành ${favText(yong)}; phương ${WX_INFO[yong.primary].huong} lợi cho hẹn hò/cưới.`);
  return { title: 'Tình duyên & hôn nhân', paragraphs: lines };
}

function pHealth(R) {
  const entries = Object.entries(R.wx.pct).sort((a, b) => a[1] - b[1]);
  const weak = entries[0], strong = entries[entries.length - 1];
  const lines = [
    `Sức khỏe theo cân bằng Ngũ Hành. Hành yếu nhất ${wxVi(weak[0])} (${weak[1]}%) → lưu ý ${WX_INFO[weak[0]].tang}.`,
    `Hành vượng nhất ${wxVi(strong[0])} (${strong[1]}%) → khi thái quá dễ ảnh hưởng tạng bị khắc (${wxVi(KE[strong[0]])}: ${WX_INFO[KE[strong[0]]].tang}).`,
    `Dưỡng sinh theo Dụng Thần ${favText(R.yong)}: tăng ${WX_INFO[R.yong.primary].mau.split(',')[0]} trong ăn ở, vận động phương ${WX_INFO[R.yong.primary].huong} sáng sớm.`,
    `Tránh để hành Kỵ ${avoidText(R.yong)} lấn át; giữ điều độ hàn – nhiệt.`,
  ];
  return { title: 'Sức khỏe & dưỡng sinh', paragraphs: lines };
}

function pStudy(R) {
  const gods = godScore(R.chart);
  const an = (gods['正印'] || 0) + (gods['偏印'] || 0);
  const shi = (gods['食神'] || 0) + (gods['傷官'] || 0);
  const lines = [
    `Học vấn xem Ấn (bằng cấp/tư duy tiếp thu) & Thực Thương (sáng tạo/diễn đạt).`,
    an >= 1.5 ? `Ấn vượng → ham học, trí nhớ tốt, hợp học thuật/bằng cấp/nghiên cứu.` : `Ấn mỏng → nên rèn kiên trì; học qua thực hành vào nhanh hơn lý thuyết.`,
    shi >= 1.5 ? `Thực Thương vượng → giàu sáng tạo, khéo diễn đạt, hợp nghệ thuật/khởi nghiệp.` : `Thực Thương ít → mạnh ở chỉn chu, kỷ luật hơn phá cách.`,
  ];
  if (hasShen(R, 'wenChang')) lines.push(`🌟 Có Văn Xương → lợi thi cử, tư duy sắc bén.`);
  if (hasShen(R, 'xueTang')) lines.push(`📚 Có Học Đường → tư chất học hỏi tốt.`);
  lines.push(`Góc học phương ${WX_INFO[R.yong.primary].huong}, vật phẩm màu ${WX_INFO[R.yong.primary].mau} hỗ trợ tập trung.`);
  return { title: 'Học vấn & trí tuệ', paragraphs: lines };
}

function pChildren(R) {
  const isMale = R.chart.input.gender === 'nam';
  const gods = godScore(R.chart);
  const childGod = isMale ? ['正官', '七殺'] : ['食神', '傷官'];
  const childWx = isMale ? KE_BY[R.chart.dayMaster.wx] : SHENG[R.chart.dayMaster.wx];
  const cnt = childGod.reduce((s, g) => s + (gods[g] || 0), 0);
  const isFav = R.yong.primary === childWx || R.yong.secondary === childWx;
  const isAvoid = R.yong.avoid.includes(childWx);
  const lines = [
    `Sao con cái: ${isMale ? 'Quan Sát (nam lấy quan sát làm con)' : 'Thực Thương (nữ lấy thực thương làm con)'} — hành ${wxVi(childWx)}. Mệnh ${cnt >= 1.5 ? 'có sao con rõ → duyên con tốt' : cnt > 0 ? 'sao con nhẹ' : 'sao con ẩn → nên chú trọng dưỡng thai theo Dụng Thần'}.`,
    isFav ? `Sao con = Dụng Thần → con cái mang lại phúc, dễ养的.` : isAvoid ? `Sao con ∈ Kỵ → thai nghén nên chọn năm mang Dụng Thần, dưỡng thai theo hành ${favText(R.yong)}.` : `Sao con trung tính.`,
    `Năm sinh con tốt: năm can chi mang hành ${favText(R.yong)} (Dụng Thần) — xem lưu niên dưới đây.`,
  ];
  return { title: 'Con cái', paragraphs: lines };
}

function pTravel(R) {
  const lines = [
    `Di chuyển/xuất khẩu xem Dịch Mã + Tài + Sát. ${hasShen(R, 'yiMa') ? '🌟 Bạn có Dịch Mã → duyên đi xa, đổi chỗ, cơ hội nước ngoài rõ.' : 'Dịch Mã không nổi → sự nghiệp thiên về tĩnh, ít biến động địa lý.'}`,
    R.yong.relations.wealthWx ? `Hành Tấy / Tài liên quan: Tài ở hành ${wxVi(R.yong.relations.wealthWx)}.` : '',
    `Hợp đi hướng phương ${WX_INFO[R.yong.primary].huong} (Dụng Thần) sẽ thuận hơn.`,
  ].filter(Boolean);
  return { title: 'Di chuyển & xuất khẩu', paragraphs: lines };
}

function pPower(R) {
  const lines = [
    `Quyền lực/lãnh đạo xem Quan Sát + Tướng Tinh. ${hasShen(R, 'jiangXing') ? '🌟 Có Tướng Tinh → khí chất chỉ huy.' : ''}`,
    R.strength.strong ? `Thân vượng + có Quan → đủ uy để lãnh đạo.` : `Thân nhược → quyền lực tốt nhất gián tiếp (cố vấn, chuyên gia) hoặc cộng tác với người mạnh.`,
  ].filter(Boolean);
  return { title: 'Quyền lực & lãnh đạo', paragraphs: lines };
}

function pTiming(R, intent) {
  const lines = [];
  const dy = R.dayun || [];
  lines.push(`Thước đo vận hạn là Dụng Thần ${favText(R.yong)} — vận nào mang hành Dụng Thần thì hanh thông, Kỵ Thần ${avoidText(R.yong)} thì nên thủ. (Đa trường phái: thêm Thập thần năm + Thái tuế + Đào hoa/红艳.)`);
  // Nếu câu hỏi có mốc năm cụ thể → dùng phân tích 6 phái (chính xác)
  if (intent.years.length) {
    for (const yr of intent.years) {
      try {
        const d = analyzeLiunianDeep(R, yr);
        const warns = d.schools.filter((s) => s.d < -8).map((s) => s.note.slice(0, 60)).join('; ');
        lines.push(`📅 Năm ${yr} (${d.ganZhi}, can ${godViShort(d.ganGod)}): ${d.rating} (${d.score}/100). ${d.advice}${warns ? ' Lưu ý: ' + warns + '.' : ''}`);
      } catch (e) {
        lines.push(`📅 Năm ${yr}: chưa tính được chi tiết đa phái.`);
      }
    }
  }
  const goodDy = dy.filter((d) => d.score > 0).slice(0, 3);
  const badDy = dy.filter((d) => d.score < 0).slice(0, 2);
  if (goodDy.length) lines.push(`Đại vận CÁT gần nhất: ${goodDy.map((d) => `${hanviet(d.ganZhi)} [${d.startAge}–${d.startAge + 9}t]`).join('; ')} — tiến thủ.`);
  if (badDy.length) lines.push(`Đại vận cần THẬN TRỌNG: ${badDy.map((d) => `${hanviet(d.ganZhi)} [${d.startAge}–${d.startAge + 9}t]`).join('; ')} — giữ ổn định.`);
  return { title: 'Vận hạn & thời điểm', paragraphs: lines };
}

function pRemedy(R, intent) {
  const rm = R.remedy;
  if (!rm || !rm.twelveLaws) return { title: 'Nghịch thiên cải mệnh', paragraphs: ['Chưa tính được.'] };
  const d = rm.byElement.dung;
  return {
    title: 'Nghịch thiên cải mệnh',
    paragraphs: [
      `Nguyên lý: Dụng ${favText(R.yong)} là chìa khoá; mọi pháp hậu thiên đều "bổ Dụng/Hỷ, khắc Kỵ/Thù".`,
      `Cụ thể: hướng ${d.direction}; màu ${d.color}; nghề ${d.career.split('，')[0]}; số ${d.number}; thực phẩm ${d.food.split('，')[0]}; nhà ${d.house}.`,
      (rm.timing || []).length ? `Thời điểm vàng (lưu niên CÁT): ${rm.timing.map((t) => t.year).join(', ')} — nên tiến thủ.` : 'Chọn thời điểm hành Dụng/Hỷ để tiến thủ.',
      `Trên hết, 《了凡四训》 dạy: TÍCH ÂM ĐỨC (积阴德) là pháp DUY NHẤT thật sự nghịch thiên — cải quá, tích thiện, khiêm đức. Mệnh lý chỉ là "thuận vận".`,
      `12 pháp cải vận: ${rm.twelveLaws.join(' ')}`,
    ],
  };
}

function pFreeForm(R, intent) {
  // Composer "bất kỳ câu hỏi" — khi không khớp lĩnh vực cụ thể, dệt câu trả lời
  // theo TOÀN BỘ lá số + bất kỳ từ khoá nào phát hiện được trong câu hỏi.
  const { chart, yong, strength, synthesis } = R;
  const dm = chart.dayMaster;
  const now = (R.liunian || []).find((l) => l.isNow);
  const norm = (intent.raw || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const hit = (arr) => arr.some((k) => norm.includes(k.normalize('NFD').replace(/[̀-ͯ]/g, '')));
  const lines = [];
  lines.push(`Về câu hỏi của bạn, đứng trên lá số ${dm.gan} ${dm.vi} (hành ${wxVi(dm.wx)}, ${strength.level}, cách ${R.pattern.vi}):`);
  // quét nhẹ mọi mảng có mặt trong câu hỏi
  const bits = [];
  if (hit(['tien', 'tai', 'giau', 'loc', 'dau tu', 'kinh doanh', 'no', 'lãi'])) bits.push(`Tài: Dụng ${favText(yong)} — ${yong.relations.wealthWx === yong.primary || yong.relations.wealthWx === yong.xi ? 'Tài là Dụng → chủ động cầu tài hiệu' : 'Tài không phải Dụng → giữ tiền qua kênh Dụng mới bền'}.`);
  if (hit(['cong viec', 'nghe', 'thang tien', 'chuc', 'sep', 'doanh nghiep'])) bits.push(`Sự nghiệp: nên chọn ngành hành Dụng ${favText(yong)}, phương ${WX_INFO[yong.primary].huong}.`);
  if (hit(['tinh', 'duyen', 'vo', 'chong', 'cuoi', 'hoa'])) bits.push(`Tình duyên: ưu tiên người mang hành ${favText(yong)}; ${chart.input.gender === 'nam' ? 'sao vợ=Tài' : 'sao chồng=Quan'}.`);
  if (hit(['khoe', 'benh', 'dau', 'om'])) bits.push(`Sức khoẻ: hành yếu nhất cần lưu ý tạng phủ; dưỡng sinh theo Dụng ${favText(yong)}.`);
  if (hit(['nam', 'van', 'thoi', 'khi', 'tuong lai', 'bay gio', 'hom nay'])) bits.push(`Vận thời điểm: Dụng ${favText(yong)} là thước đo. ${now ? `Năm ${now.year} (${now.rating}, ${now.ganGod} năm).` : ''}`);
  if (bits.length) lines.push(...bits);
  else lines.push(`Trục cốt lõi của mọi vấn đề là Dụng ${favText(yong)} / Hỷ ${wxVi(yong.xi)} (nên tăng) và Kỵ ${wxVi(yong.ji)} / Thù ${wxVi(yong.chou)} (nên tránh).`);
  lines.push(`Tổng luận mệnh ${synthesis.gradeVi} (${synthesis.score}/100). Khai vận: màu ${WX_INFO[yong.primary].mau}; phương ${WX_INFO[yong.primary].huong}; nghề ${WX_INFO[yong.primary].nghe.split('，')[0]}.`);
  lines.push(`${now && now.score < 0 ? `⚠ Đang ở năm ${now.year} bất lợi → thủ giữ, tránh mạo hiểm; đợi lưu niên mang hành Dụng.` : `Nên tiến thủ theo Dụng Thần, đón lưu niên/đại vận cát.`} Để có phân tích tự do chuyên sâu hơn, bật AI trong ⚙ Cài đặt.`);
  return { title: 'Luận theo câu hỏi của bạn', paragraphs: lines };
}

const COMPOSERS = {
  personality: pPersonality, career: pCareer, wealth: pWealth, love: pLove,
  health: pHealth, study: pStudy, children: pChildren, travel: pTravel,
  power: pPower, family: pLove, timing: pTiming, remedy: pRemedy, general: pFreeForm,
};

// ---------------------------------------------------------------------------
//  4. ENTRANCE: soạn câu trả lời cho câu hỏi tự do
// ---------------------------------------------------------------------------
export function composeAnswer(question, R) {
  const intent = detectIntent(question);

  // Câu hỏi TỰ DO / khó hiểu (confidence thấp, không khớp lĩnh vực) → fallback khéo léo
  // Vẫn trả lời được: mở bằng chốt lá số + gợi ý hỏi lại cụ thể (luân giải "bất kỳ câu").
  if (!intent.isTiming && intent.confidence < 3) {
    const dm = R.chart.dayMaster, y = R.yong, s = R.synthesis || {};
    return {
      title: 'Luận theo lá số (câu hỏi mở)',
      lead: `Câu hỏi của tôi chưa rõ thuộc lĩnh vực nào — tôi luân giải chung theo lá số, bạn có thể hỏi cụ thể hơn:`,
      paragraphs: [
        `Chốt lá số: Nhật Chủ ${dm.gan} ${dm.vi} (${R.strength.level}); cách cục ${R.pattern.vi}; Dụng ${favText(y)} / Hỷ ${wxVi(y.xi)} / Kỵ ${wxVi(y.ji)}. Tổng luận: ${s.gradeVi || ''} (${s.score || '?'}/100).`,
        `Tôi có thể luân giải các mảng: <b>sự nghiệp · tài lộc · tình duyên · sức khoẻ · học vấn · con cái · vận năm/tháng/ngày · cải vận · hợp tuổi · chọn ngày · phong thuỷ nhà · tên</b>.`,
        `Thử hỏi vd: "Năm 2026 tôi có nên đổi việc?", "Khi nào phát tài?", "Làm sao cải vận?", "Vợ chồng tôi hợp không?" — hoặc bật AI (⚙ GLM-5.2 Z.ai) để trả lời mở hoàn toàn.`,
      ],
      intent,
    };
  }

  let composer = COMPOSERS[intent.area] || pPersonality;
  // Câu hỏi thời điểm luôn ưu tiên pTiming
  if (intent.isTiming) composer = pTiming;
  const block = composer(R, intent);
  const lead = `Ý bạn hỏi về lĩnh vực « ${block.title} »${intent.years.length ? ` (có mốc năm ${intent.years.join(', ')})` : ''}. Luận theo lá số của bạn:`;
  return { title: block.title, lead, paragraphs: block.paragraphs, intent };
}

// Tóm tắt ngắn các tương tác hội hợp (dùng hiển thị & đưa cho AI)
export function interactionBrief(R) {
  return R.interactions.summary;
}
