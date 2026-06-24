// ============================================================================
//  NGHỊCH THIÊN CẢI MỆNH (逆天改命) — Động cơ cải vận học thuật
//  Nguyên lý: Dụng Thần là chìa khoá → mọi pháp hậu thiên đều "bổ Dụng / Hỷ,
//  khắc Kỵ/Thù". Đồng thời theo 了凡四训, DUY NHẤT thật sự nghịch thiên được là
//  TÍCH ÂM ĐỨC (积阴德) — cải quá, tích thiện, khiêm đức. Kết hợp AI để cá biệt.
//  Nguồn: 窮通寶鑑 (dụng thần) + 了凡四训 (cải mệnh) + 滴天髓 (vận).
// ============================================================================
import { WX_VI, GAN } from './constants.js';

// ---- BẢNG CẢI VẬN NGŨ HÀNH (mở rộng từ WX_INFO) ----
export const WX_REMEDY = {
  木: {
    direction: 'Đông, Đông Nam', house: 'tọa Đông hướng Tây / tọa Đông Nam hướng Tây Bắc',
    color: 'xanh lá, xanh ngọc, xanh mint', career: 'giáo dục, xuất bản, thư viện, mộc – nội thất, dược – đông y, nông – lâm – hoa viên, thời trang vải sợi, từ thiện',
    food: 'rau xanh, đậu, ngũ cốc, chanh, trà xanh, vị chua tự nhiên', material: 'gỗ, tre, mây, giấy, sợi, bông',
    number: '1, 3, 8', organ: 'gan – mật – gân cốt',
    animal: 'mèo, thỏ (Dần/Mão)', season: 'xuân',
  },
  火: {
    direction: 'Nam', house: 'tọa Nam hướng Bắc',
    color: 'đỏ, hồng, tím, cam', career: 'năng lượng – điện, điện tử, ẩm thực, quảng cáo – truyền thông, giải trí, mỹ phẩm, ánh sáng, in ấn',
    food: 'vị đắng, ớt, cà chua, thịtle đỏ, trà đỏ, cà phê', material: 'đèn, nến, điện tử, nhựa, lụa đỏ',
    number: '2, 7', organ: 'tim – ruột non – huyết',
    animal: 'ngựa, rắn (Ngọ/Tỵ)', season: 'hạ',
  },
  土: {
    direction: 'trung cung, Đông Bắc, Tây Nam', house: 'tọa Đông Bắc hướng Tây Nam / tọa Tây Nam hướng Đông Bắc',
    color: 'vàng, nâu đất, be, camel', career: 'bất động sản, xây dựng, nông nghiệp, bảo hiểm, gốm sứ, tư vấn – quản lý, kho bãi, tài nguyên',
    food: 'vị ngọt, khoai lang, củ, ngũ vị, gạo, đậu phụng', material: 'gốm, đá, đất, pha lê, sành',
    number: '5, 0', organ: 'tỳ – vị – cơ nhục',
    animal: 'chó, trâu, dê, rồng (Thìn/Sửu/Mùi/Tuất)', season: 'quý (chuyển mùa)',
  },
  金: {
    direction: 'Tây, Tây Bắc', house: 'tọa Tây hướng Đông / tọa Tây Bắc hướng Đông Nam',
    color: 'trắng, xám, ánh kim, bạc', career: 'tài chính – ngân hàng, cơ khí – kim loại, công nghệ, luật, quân – cảnh, trang sức, ô tô, y khoa (phẫu thuật)',
    food: 'vị cay, hành tỏi, gừng, thịt trắng, gia cầm', material: 'kim loại, vàng bạc, đồng thép, đồng hồ',
    number: '4, 9', organ: 'phổi – đại tràng – da',
    animal: 'gà, khỉ (Dậu/Thân)', season: 'thu',
  },
  水: {
    direction: 'Bắc', house: 'tọa Bắc hướng Nam',
    color: 'đen, xanh nước biển đậm, xanh navy', career: 'thương mại, vận tải – logistics, du lịch, truyền thông, thủy sản, xuất nhập khẩu, tài chính lưu thông, ngoại giao',
    food: 'vị mặn, cá, hải sản, rong biển, đậu đen, nước', material: 'nước, thủy tinh, kính, ngọc trai',
    number: '1, 6', organ: 'thận – bàng quang – tủy',
    animal: 'chuột, heo (Tý/Hợi)', season: 'đông',
  },
};

// ---- 了凡四训 (Liaofan) — khung cải mệnh đích thực ----
export const LIAOFAN = {
  principle: '《了凡四训》 chủ trương: "mệnh do ta lập, phúc do ta cầu" — số mệnh KHÔNG bất biến. Bốn bước: 立命之学 (biết mệnh) → 改过之法 (sửa lỗi) → 积善之方 (tích thiện) → 谦德之效 (khiêm đức).',
  coreMethod: 'Tích Âm Đức (积阴德) — hành thiện không đồ báo — là PHÁP DUY NHẤT thật sự "nghịch thiên cải mệnh". Mệnh lý (Dụng Thần, phương vị, màu sắc…) chỉ là "thuận vận", giúp đón vận tốt giảm vận xấu; còn cải cốt lõi số mệnh phải bằng đức hạnh.',
  quote: '「有志於功名者，必得功名；有志於富貴者，必得富貴。人之有志，如樹之有根，立定此志，須念念謙虛，塵塵方便，自然感動天地，而造福由我。」— 了凡四训 · 谦德之效',
};

// ---- Pháp hóa giải tổ hợp hung cụ thể ----
export const SPECIFIC_REMEDY = {
  '傷官見官': 'Có Thương Quan khắc Chính Quan: dùng Ấn (hoá Thương) hoặc Tài (phá Ấn sinh quan) — tránh cãi vã quan quyền, nữ mạng kết hôn muộn, chọn bạn đời bao dung.',
  '梟神奪食': 'Thiên Ấn đoạt Thực Thần: dùng Thiên Tài chế Kiêu (Tài khắc Ấn) — tránh đầu tư mạo hiểm, giữ nguồn thu ổn định, cẩn thận sức khỏe tiêu hóa.',
  '官殺混雜': 'Quan – Sát lẫn lộn: dùng Thực Bán chế Sát hoặc Ấn hoá — giữ sự nghiệp chuyên nhất, tránh đa tình, nữ mạng cẩn thận hôn nhân.',
  '財多身弱': 'Tài nhiều thân nhược: dùng Tỷ Kiếp trợ thân kháng Tài — hợp tác/cộng sự, tránh ôm nợ lớn, tích lũy dần, đừng đầu cơ.',
  '殺攻身': 'Sát công thân: dùng Ấn hoá Sát (thông quan) hoặc Thực chế Sát — tránh ngành nguy hiểm, chú ý an toàn, chọn môi trường có người bảo hộ.',
};

const hanviet = (gz) => gz.split('').map((c) => (GAN[c]?.vi || c)).join(' ');

/**
 * Sinh kế hoạch cải mệnh cá biệt.
 * @returns { plan, byElement{dung,hy}, timing, liaofan, specific }
 */
export function buildRemedy(R) {
  const { yong, liunian, synthesis, chart } = R;
  const dung = yong.primary, hy = yong.xi;
  const rd = WX_REMEDY[dung], rh = WX_REMEDY[hy] || rd;

  // 1. Bổ sung theo Dụng + Hỷ (Ngũ hành pháp)
  const byElement = {
    dung: { wx: dung, ...rd },
    hy: { wx: hy, ...rh },
    summary: `Bổ Dụng ${WX_VI[dung]} là chính, phối Hỷ ${WX_VI[hy]} tăng hiệu.`,
  };

  // 2. Thời điểm vàng — các lưu niên CÁT mang hành Dụng/Hỷ sắp tới
  //   [loop 35 sửa] filter cũ 'score >= 1' cho mọi năm (score clamp tối thiểu 2 = đại hung vẫn qua).
  const catYears = (liunian || []).filter((l) => l.rating === 'Cát' || l.rating === 'Đại cát').map((l) => ({
    year: l.year, gz: l.ganZhi, rating: l.rating, wx: `${GAN[l.gan]?.wx || ''}${l.zhiWx || ''}`,
  }));

  // 3. Hóa giải tổ hợp hung (nếu có)
  const specific = (synthesis?.combos || [])
    .filter((c) => c.tone === 'xiong')
    .map((c) => ({ combo: c.vi, remedy: SPECIFIC_REMEDY[c.name] || 'Dùng Dụng Thần để hoá giải, kết hợp tích đức.' }));

  // 4. 12 pháp cải vận (kết hợp ngũ hành + 了凡四训)
  const twelveLaws = [
    `① Phương vị — sinh sống/làm việc hướng ${rd.direction} (Dụng ${WX_VI[dung]}); phòng ngủ/bàn làm việc mở về hướng này.`,
    `② Sắc thái — mặc/trang trí thiên ${rd.color}; ${rh.color} làm phụ (Hỷ).`,
    `③ Nghề nghiệp — chọn ngành hành ${WX_VI[dung]}: ${rd.career}.`,
    `④ Phong thuỷ cư trú — nhà ${rd.house}; tránh hướng thuộc Kỵ ${WX_VI[yong.ji]}.`,
    `⑤ Số lý — điện thoại, biển số, tầng ưu tiên số ${rd.number} (Dụng).`,
    `⑥ Ẩm thực dưỡng sinh — tăng ${rd.food} (nuôi tạng ${rd.organ}); giảm thực phẩm hành Kỵ ${WX_VI[yong.ji]}.`,
    `⑦ Dụng cụ/trang sức — vật liệu ${rd.material}; đeo/kết hợp hành Dụng.`,
    `⑧ Chọn thời (择日) — việc lớn (lập nghiệp, cưới, mua nhà) làm vào lưu niên CÁT mang hành Dụng/Hỷ (xem thời điểm vàng).`,
    `⑨ Hợp bạn đời/hợp tác — ưu tiên người có mệnh bổ Dụng ${WX_VI[dung]} cho mình (lấy lá số đôi bên so sánh).`,
    `⑩ Tu dưỡng theo tính Nhật Chủ — bù nhược điểm của ${chart.dayMaster.gan} ${chart.dayMaster.vi} (rèn tính kỷ luật/khiêm nhường/kiên định tuỳ can).`,
    `⑪ Tích Âm Đức (积阴德) — PHÁP CỐT LÕI nghịch thiên: hành thiện không đồ báo, giữ nỗ lực sửa lỗi. ${LIAOFAN.coreMethod}`,
    `⑫ Khiêm đức (谦德) — 《了凡四训》: "mãn chiêu tổn, khiêm thụ ích" — khiêm tốn mới nhận được phúc, kiêu ngạo tự tổn.`,
  ];

  return { byElement, timing: catYears, specific, twelveLaws, liaofan: LIAOFAN };
}
