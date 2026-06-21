// ============================================================================
//  BỘ LUẬN GIẢI NHẤT QUÁN
//  Mọi câu trả lời được suy ra TẤT ĐỊNH từ kết quả động cơ (Dụng/Kỵ Thần,
//  Thập Thần, Ngũ Hành). Cùng một lá số + cùng câu hỏi ⇒ cùng câu trả lời.
// ============================================================================
import { WX_VI, GAN, ZHI, SHENG, KE, KE_BY, SHENG_BY, TEN_GOD_VI } from './constants.js';
import { DITIANSUI } from './kb.js';

// ---- Tra cứu thuộc tính theo Ngũ Hành ----
export const WX_INFO = {
  木: { mau: 'xanh lá, xanh ngọc', huong: 'Đông & Đông Nam', so: '3, 8',
        nghe: 'giáo dục, xuất bản, gỗ – nội thất, dược – đông y, thời trang vải sợi, nông – lâm nghiệp',
        tang: 'Gan – Mật, hệ thần kinh, mắt, gân cốt' },
  火: { mau: 'đỏ, hồng, tím, cam', huong: 'Nam',  so: '2, 7',
        nghe: 'năng lượng – điện, điện tử, ẩm thực, quảng cáo – truyền thông, giải trí, mỹ phẩm',
        tang: 'Tim – Ruột non, huyết mạch, mắt' },
  土: { mau: 'vàng, nâu đất, be', huong: 'trung cung, Đông Bắc & Tây Nam', so: '5, 0',
        nghe: 'bất động sản, xây dựng, nông nghiệp, bảo hiểm, gốm sứ, tư vấn – quản lý',
        tang: 'Tỳ – Vị, hệ tiêu hóa, cơ nhục' },
  金: { mau: 'trắng, xám, ánh kim', huong: 'Tây & Tây Bắc', so: '4, 9',
        nghe: 'tài chính – ngân hàng, cơ khí – kim loại, công nghệ, luật, quân – cảnh, trang sức',
        tang: 'Phổi – Đại tràng, hệ hô hấp, da lông' },
  水: { mau: 'đen, xanh nước biển', huong: 'Bắc', so: '1, 6',
        nghe: 'thương mại, vận tải – logistics, du lịch, truyền thông, thủy sản, xuất nhập khẩu',
        tang: 'Thận – Bàng quang, hệ sinh dục – tiết niệu, xương tủy' },
};

// ---- Tính cách Nhật Chủ theo Thiên Can ----
export const DM_PROFILE = {
  甲: 'Giáp Mộc như đại thụ — chính trực, có chí tiến thủ, giàu tinh thần lãnh đạo và trách nhiệm, nhưng đôi khi cứng nhắc, khó uốn.',
  乙: 'Ất Mộc như hoa cỏ dây leo — mềm dẻo, khéo léo, thích nghi tốt, giỏi giao tế; song dễ phụ thuộc, thiếu quyết đoán.',
  丙: 'Bính Hỏa như mặt trời — nhiệt thành, hào sảng, quang minh, lan tỏa năng lượng; nhược điểm là nóng vội, phô trương.',
  丁: 'Đinh Hỏa như ngọn đèn — ấm áp, tinh tế, giàu trực giác và chiều sâu nội tâm; dễ đa cảm, hay lo nghĩ.',
  戊: 'Mậu Thổ như núi cao — vững vàng, bao dung, đáng tin cậy, có sức chịu đựng; đôi khi bảo thủ, chậm đổi thay.',
  己: 'Kỷ Thổ như đất ruộng — ôn hòa, cần mẫn, bao dung nuôi dưỡng, thực tế; song hay đa nghi, giữ kẽ.',
  庚: 'Canh Kim như kim loại thô — cương nghị, quả cảm, trọng nghĩa khí, hành động dứt khoát; dễ cứng rắn, hiếu thắng.',
  辛: 'Tân Kim như châu ngọc — thanh tú, cầu toàn, nhạy bén thẩm mỹ, tự trọng cao; nhược điểm là nhạy cảm, dễ tổn thương.',
  壬: 'Nhâm Thủy như sông biển — thông tuệ, phóng khoáng, giàu mưu lược và tầm nhìn; đôi khi phóng túng, thiếu kiên định.',
  癸: 'Quý Thủy như mưa móc — kín đáo, nhu thuận, nhẫn nại, trí tưởng tượng phong phú; dễ ưu tư, hay che giấu cảm xúc.',
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const hanviet = (gz) => gz.split('').map((c) => (GAN[c]?.vi || ZHI[c]?.vi || c)).join(' ');
export const wxVi = (w) => WX_VI[w];

// Đếm Thập Thần xuất hiện (cả thiên can lẫn tàng can chính)
function countGods(chart) {
  const c = {};
  for (const key of ['year', 'month', 'time']) {
    const p = chart.pillars[key];
    c[p.ganGod] = (c[p.ganGod] || 0) + 1;
  }
  for (const key of ['year', 'month', 'day', 'time']) {
    const main = chart.pillars[key].hidden[0];
    c[main.god] = (c[main.god] || 0) + 0.5;
  }
  return c;
}

function favText(yong) {
  const f = [yong.primary, yong.secondary].filter(Boolean);
  const uniq = [...new Set(f)];
  return uniq.map((w) => `${wxVi(w)} (${w})`).join(' & ');
}
function avoidText(yong) {
  return [...new Set(yong.avoid)].map((w) => `${wxVi(w)} (${w})`).join(' & ');
}

// ---- Bộ sinh câu trả lời theo từng lĩnh vực ----
// Mỗi hàm nhận {chart, wx, strength, yong, dayun} → trả {title, paragraphs[]}

function general(R) {
  const { chart, strength, yong, wx } = R;
  const dm = chart.dayMaster;
  const weakest = Object.entries(wx.score).sort((a, b) => a[1] - b[1])[0][0];
  const strongest = Object.entries(wx.score).sort((a, b) => b[1] - a[1])[0][0];
  const dt = DITIANSUI[dm.gan];
  return {
    title: 'Tổng quan mệnh cục',
    paragraphs: [
      `<span class="verse">「${dt.verse}」</span><i>— 滴天髓 luận ${dm.gan} ${dm.vi}</i>`,
      `<b>Bản chất ${dm.gan} ${dm.vi}:</b> ${dt.nature}`,
      `Xét toàn cục, mệnh ở trạng thái “${strength.level}” (phù trợ thân ${(strength.ratio * 100).toFixed(1)}%, ${strength.deLenh ? 'đắc lệnh' : 'thất lệnh'} tại nguyệt chi ${chart.monthZhi}; cách cục <b>${R.pattern.vi}</b>). Ngũ hành vượng nhất ${wxVi(strongest)}, suy nhất ${wxVi(weakest)}.`,
      `Trục cốt lõi — <b>用喜忌仇</b>: Dụng ${favText(yong)}; Hỷ ${wxVi(yong.xi)} (sinh trợ Dụng); Kỵ ${wxVi(yong.ji)} (khắc Dụng, tránh); Thù ${wxVi(yong.chou)} (sinh Kỵ, hại gián tiếp). ${yong.tiaohou.note}`,
      `Định hướng khai vận: thiên về màu ${WX_INFO[yong.primary].mau}; phương ${WX_INFO[yong.primary].huong}; con số ${WX_INFO[yong.primary].so}; nghề ${WX_INFO[yong.primary].nghe.split('，')[0]}. ${dt.need}.`,
    ],
  };
}

function career(R) {
  const { chart, strength, yong } = R;
  const gods = countGods(chart);
  const guan = (gods['正官'] || 0) + (gods['七殺'] || 0);
  const officerWx = yong.relations.officerWx;
  const lines = [];
  lines.push(`Công danh – sự nghiệp lấy Quan Sát (hành ${wxVi(officerWx)}) làm sao chủ. Trong mệnh ${guan >= 1.5 ? 'Quan Sát hiện rõ' : guan > 0 ? 'Quan Sát có nhưng mỏng' : 'Quan Sát ẩn tàng/khuyết'}.`);
  if (strength.strong) {
    lines.push(`Do thân vượng, bạn đủ sức “gánh” Quan và Tài, thích hợp con đường có cạnh tranh, chịu trách nhiệm lớn, làm chủ hoặc giữ vị trí quản lý. Quan Sát và Tài chính là nơi dụng võ.`);
  } else {
    lines.push(`Do thân nhược, không nên ôm đồm chức vụ vượt sức; nên dựa vào quý nhân/Ấn tinh, tích lũy năng lực rồi mới tiến. Hợp môi trường ổn định, có người dìu dắt.`);
  }
  lines.push(`Ngành nghề hợp DỤNG THẦN (${favText(yong)}): ${[...new Set([yong.primary, yong.secondary].filter(Boolean))].map((w) => WX_INFO[w].nghe).join('; ')}.`);
  lines.push(`Nên chọn công ty/văn phòng ở phương ${WX_INFO[yong.primary].huong}; bàn làm việc hướng về phương này giúp tăng trợ lực.`);
  return { title: 'Sự nghiệp & công danh', paragraphs: lines };
}

function wealth(R) {
  const { chart, strength, yong } = R;
  const gods = countGods(chart);
  const cai = (gods['正財'] || 0) + (gods['偏財'] || 0);
  const wealthWx = yong.relations.wealthWx;
  const caiIsFav = yong.primary === wealthWx || yong.secondary === wealthWx;
  const lines = [];
  lines.push(`Tài lộc lấy Tài tinh (hành ${wxVi(wealthWx)}) làm sao chủ. Mệnh ${cai >= 1.5 ? 'Tài tinh vượng, cơ hội tiền bạc dồi dào' : cai > 0 ? 'Tài tinh ở mức vừa phải' : 'Tài tinh mỏng/ẩn, tiền tới cần chủ động tìm'}.`);
  if (strength.strong) {
    lines.push(`Thân vượng đủ sức “nhậm tài” — càng làm càng giữ được của, hợp kinh doanh, đầu tư chủ động. Tài và Quan đều là hướng phát.`);
  } else {
    lines.push(`Thân nhược mà gặp Tài vượng dễ thành “tài đa thân nhược” (tiền qua tay khó giữ). Trước hết phải trợ thân bằng Tỷ Kiếp/Ấn, nên hùn hạp có cộng sự, tránh ôm nợ – đòn bẩy lớn.`);
  }
  if (caiIsFav) {
    lines.push(`Đáng mừng: Tài tinh chính là Dụng Thần ⇒ chủ động cầu tài rất hiệu nghiệm, tài vận sáng sủa.`);
  } else if (yong.avoid.includes(wealthWx)) {
    lines.push(`Lưu ý: Tài tinh đang nằm trong Kỵ Thần ⇒ không nên tham lam liều lĩnh; giữ tiền qua kênh thuộc Dụng Thần ${favText(yong)} mới bền.`);
  }
  lines.push(`Kênh tích tài/đầu tư nên thiên về lĩnh vực hành ${favText(yong)}; màu sắc ví – tài khoản hợp: ${WX_INFO[yong.primary].mau}.`);
  return { title: 'Tài lộc & tiền bạc', paragraphs: lines };
}

function love(R) {
  const { chart, strength, yong } = R;
  const isMale = chart.input.gender === 'nam';
  const spouseWx = isMale ? KE[chart.dayMaster.wx] : KE_BY[chart.dayMaster.wx];
  const spouseStar = isMale ? 'Tài tinh (vợ)' : 'Quan Sát (chồng)';
  const dayZhiGod = chart.pillars.day.hidden[0].god;
  const spouseIsFav = yong.primary === spouseWx || yong.secondary === spouseWx;
  const spouseIsAvoid = yong.avoid.includes(spouseWx);
  const lines = [];
  lines.push(`Với ${isMale ? 'nam mệnh' : 'nữ mệnh'}, sao hôn nhân là ${spouseStar} thuộc hành ${wxVi(spouseWx)}. Cung phối ngẫu (Nhật Chi) là ${chart.pillars.day.zhi} (${ZHI[chart.pillars.day.zhi].vi}), tàng ${TEN_GOD_VI[dayZhiGod] || dayZhiGod}.`);
  if (spouseIsFav) {
    lines.push(`Sao phối ngẫu trùng Dụng Thần ⇒ hôn nhân là trợ lực, bạn đời thường mang lại may mắn, nên kết hôn để vượng vận.`);
  } else if (spouseIsAvoid) {
    lines.push(`Sao phối ngẫu rơi vào Kỵ Thần ⇒ tình duyên cần chọn lọc kỹ, dễ có thử thách; nên kết hôn muộn một chút và ưu tiên người có mệnh bổ trợ Dụng Thần cho mình.`);
  } else {
    lines.push(`Sao phối ngẫu trung tính ⇒ hôn nhân thuận theo nỗ lực vun đắp của hai bên.`);
  }
  lines.push(strength.strong
    ? `Thân vượng nên chủ động trong quan hệ; hợp người đối tác có cá tính nhu hòa, biết tiết chế cái tôi của bạn.`
    : `Thân nhược nên tìm bạn đời chững chạc, biết nâng đỡ; tránh người áp đảo khiến bạn thêm hao tổn.`);
  lines.push(`Người hợp tuổi thường mang hành ${favText(yong)}; hẹn hò/cưới hỏi ưu tiên phương ${WX_INFO[yong.primary].huong}.`);
  return { title: 'Tình cảm & hôn nhân', paragraphs: lines };
}

function health(R) {
  const { wx, yong, chart } = R;
  const entries = Object.entries(wx.pct).sort((a, b) => a[1] - b[1]);
  const weak = entries[0];
  const strong = entries[entries.length - 1];
  const lines = [];
  lines.push(`Sức khỏe nhìn theo cân bằng Ngũ Hành. Hành yếu nhất là ${wxVi(weak[0])} (${weak[1]}%) — cần lưu ý ${WX_INFO[weak[0]].tang}.`);
  lines.push(`Hành vượng nhất là ${wxVi(strong[0])} (${strong[1]}%) — khi thái quá dễ ảnh hưởng tạng phủ bị nó khắc (${wxVi(KE[strong[0]])}: ${WX_INFO[KE[strong[0]]].tang}). Nên chủ động điều hòa.`);
  lines.push(`Bồi bổ theo DỤNG THẦN ${favText(yong)}: tăng cường yếu tố ${WX_INFO[yong.primary].mau.split(',')[0]} trong ăn uống – sinh hoạt, vận động ở phương ${WX_INFO[yong.primary].huong} vào sáng sớm để dưỡng khí.`);
  lines.push(`Mùa/khí ứng với Nhật Chủ ${chart.dayMaster.gan}: giữ điều độ hàn – nhiệt, tránh để hành Kỵ Thần ${avoidText(yong)} lấn át gây mất cân bằng.`);
  return { title: 'Sức khỏe & dưỡng sinh', paragraphs: lines };
}

function study(R) {
  const { chart, yong, strength } = R;
  const gods = countGods(chart);
  const an = (gods['正印'] || 0) + (gods['偏印'] || 0);
  const thucthuong = (gods['食神'] || 0) + (gods['傷官'] || 0);
  const lines = [];
  lines.push(`Học vấn xem Ấn tinh (sao học hành, bằng cấp, tư duy tiếp thu) và Thực Thương (sao tài hoa, sáng tạo, biểu đạt).`);
  lines.push(an >= 1.5
    ? `Ấn tinh vượng ⇒ tư chất ham học, trí nhớ tốt, hợp con đường học thuật – bằng cấp – nghiên cứu.`
    : `Ấn tinh mỏng ⇒ nên rèn tính kiên trì khi học bài bản; học qua trải nghiệm thực tế sẽ vào nhanh hơn lý thuyết suông.`);
  lines.push(thucthuong >= 1.5
    ? `Thực Thương vượng ⇒ giàu sáng tạo, khéo diễn đạt, hợp nghệ thuật, kỹ năng, khởi nghiệp ý tưởng.`
    : `Thực Thương ít ⇒ thế mạnh nằm ở sự chỉn chu, kỷ luật hơn là phá cách.`);
  lines.push(`Hướng phát triển trí tuệ tốt nhất gắn với Dụng Thần ${favText(yong)}; góc học tập đặt ở phương ${WX_INFO[yong.primary].huong}, dùng vật phẩm màu ${WX_INFO[yong.primary].mau} hỗ trợ tập trung.`);
  lines.push(strength.strong
    ? `Thân vượng: hợp thi cử cạnh tranh, môi trường áp lực cao.`
    : `Thân nhược: nên học theo lộ trình chia nhỏ, có thầy/người đồng hành kèm cặp.`);
  return { title: 'Học vấn & trí tuệ', paragraphs: lines };
}

function luck(R) {
  const { dayun, yong } = R;
  const lines = [];
  if (!dayun.length) {
    lines.push('Không tính được Đại Vận cho lá số này.');
    return { title: 'Đại Vận & thời điểm', paragraphs: lines };
  }
  const good = dayun.filter((d) => d.score > 0);
  const bad = dayun.filter((d) => d.score < 0);
  lines.push(`Dụng Thần ${favText(yong)} là thước đo: vận nào mang hành Dụng Thần thì hanh thông, vận mang Kỵ Thần ${avoidText(yong)} thì nên thủ.`);
  if (good.length) lines.push('Các Đại Vận CÁT (nên tiến thủ, đầu tư, lập nghiệp): ' + good.map((d) => `${hanviet(d.ganZhi)} [${d.startAge}–${d.startAge + 9} tuổi]`).join('; ') + '.');
  if (bad.length) lines.push('Các Đại Vận cần THẬN TRỌNG (giữ ổn định, tránh mạo hiểm lớn): ' + bad.map((d) => `${hanviet(d.ganZhi)} [${d.startAge}–${d.startAge + 9} tuổi]`).join('; ') + '.');
  lines.push('Trong mọi giai đoạn, chủ động bổ sung yếu tố Dụng Thần (màu sắc, phương vị, ngành nghề) sẽ giúp “đón vận tốt, giảm vận xấu”.');
  return { title: 'Đại Vận & thời điểm', paragraphs: lines };
}

export const TOPICS = [
  { id: 'general', label: 'Tổng quan mệnh', fn: general },
  { id: 'career', label: 'Sự nghiệp', fn: career },
  { id: 'wealth', label: 'Tài lộc', fn: wealth },
  { id: 'love', label: 'Tình duyên', fn: love },
  { id: 'health', label: 'Sức khỏe', fn: health },
  { id: 'study', label: 'Học vấn', fn: study },
  { id: 'luck', label: 'Đại Vận', fn: luck },
];

export function answer(topicId, R) {
  const t = TOPICS.find((x) => x.id === topicId) || TOPICS[0];
  return t.fn(R);
}

// Định tuyến câu hỏi tự do → chủ đề (từ khóa tiếng Việt)
const KEYWORDS = {
  career: ['sự nghiệp', 'công việc', 'công danh', 'thăng tiến', 'nghề', 'làm ăn', 'kinh doanh', 'chức'],
  wealth: ['tài', 'tiền', 'của cải', 'giàu', 'lộc', 'đầu tư', 'tài chính', 'phát tài'],
  love: ['tình', 'duyên', 'hôn nhân', 'vợ', 'chồng', 'người yêu', 'kết hôn', 'cưới', 'gia đạo'],
  health: ['sức khỏe', 'bệnh', 'ốm', 'tạng', 'dưỡng sinh', 'thể chất'],
  study: ['học', 'thi', 'bằng cấp', 'trí tuệ', 'kiến thức', 'sáng tạo'],
  luck: ['vận', 'đại vận', 'thời điểm', 'năm nào', 'tuổi', 'lúc nào', 'tương lai'],
};
export function routeQuestion(text) {
  const t = (text || '').toLowerCase();
  let best = 'general', bestHits = 0;
  for (const [id, kws] of Object.entries(KEYWORDS)) {
    const hits = kws.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0);
    if (hits > bestHits) { bestHits = hits; best = id; }
  }
  return best;
}
