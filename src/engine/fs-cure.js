// ============================================================================
//  PHONG THỦY HÓA SÁT 风水化煞 — FENG SHUI CURE ENCYCLOPEDIA
//  "Nhà tôi bị X — hóa giải thế nào?" — 20 loại sát + cách hóa giải.
//  Genuinely missing: app có FS tích cực (may mắn) nhưng KHÔNG có FS sửa lỗi.
//  Nguồn: 阳宅大全 化煞篇, 八宅明镜 辟煞.
// ============================================================================

const SHA_LIST = [
  {
    id: 'luchong', zh: '路冲', vi: '路冲 (đường thẳng chiếu cửa)',
    desc: 'Đường/phố chạy thẳng tắp vào cửa nhà → khí hung xông thẳng, dễ bệnh/tai nạn/phá tài.',
    severity: 'hung',
    symptoms: ['sức khoẻ giảm', 'tai nạn xe', 'phá tài', 'cãi vã gia đình'],
    cures: [
      'Đặt bình phong/cây xanh trước cửa (che khí xung)',
      'Treo gương Bát Quái lồi trên cửa (phản khí)',
      'Đặt thạch anh trắng/đen 2 bên cửa (áp khí)',
      'Trồng hàng rào cây xanh (hóa giải đồng thời)',
    ],
  },
  {
    id: 'jianjiao', zh: '尖角煞', vi: '尖角煞 (góc nhọn chiếu)',
    desc: 'Góc nhọn từ nhà đối diện/cây/tòa nhà chiếu vào cửa sổ/cửa chính → tạo "tiễn" khí.',
    severity: 'hung',
    symptoms: ['đau đầu', 'căng thẳng', 'thiếu tập trung', 'bệnh lâu ngày'],
    cures: [
      'Treo rèm cửa dày (che góc)',
      'Đặt cây xanh cao ở cửa sổ bị chiếu',
      'Treo gương Bát Quái (phản hồi)',
      'Đặt thạch anh trắng trên bệ cửa sổ',
    ],
  },
  {
    id: 'tianzhan', zh: '天斩煞', vi: '天斩煞 (khe hở 2 tòa nhà)',
    desc: 'Khe hở hẹp giữa 2 tòa nhà cao chiếu thẳng vào nhà → "đao khí" cực mạnh.',
    severity: 'hung',
    symptoms: ['bệnh nặng', 'phá tài lớn', 'tai nạn'],
    cures: [
      'Treo gương Bát Quái lồi to',
      'Đặt铜 đương (chuông đồng) trước cửa',
      'Trồng cây xanh dày',
      'Nếu nặng → chuyển phòng/kéo rèm',
    ],
  },
  {
    id: 'bigiao', zh: '壁煞', vi: '壁煞 (tường ép)',
    desc: 'Tòa nhà/tường quá gần ép vào cửa sổ → thiếu khí, bí bách.',
    severity: 'slight-hung',
    symptoms: ['tức ngực', 'áp lực tâm lý', 'khó thở'],
    cures: ['Kéo rèm nhẹ', 'Đặt gương phản quang trong phòng', 'Bật đèn sáng thường xuyên'],
  },
  {
    id: 'fangong', zh: '反弓', vi: '反弓 (đường/sông cong cưa)',
    desc: 'Đường/sông cong vòng ra ngoài như lưỡi dao cưa vào nhà.',
    severity: 'hung',
    symptoms: ['phá tài', 'ly hôn', 'tai nạn'],
    cures: ['Trồng cây xanh dày phía bị cưa', 'Gương Bát Quái', 'Đá thạch anh lớn'],
  },
  {
    id: 'yaodai', zh: '玉带', vi: '玉带环腰 (đường/sông ôm — CÁT)',
    desc: 'Đường/sông cong vòng vào ôm lấy nhà → như "đai ngọc" → đại cát!',
    severity: 'cat',
    symptoms: ['tài lộc tốt', 'quý nhân giúp', 'sức khoẻ ổn'],
    cures: ['Không cần hóa giải — đây là ĐỊA CÁT', 'Tận dụng: mở cửa chính phía trong vòng cong'],
  },
  {
    id: 'hengliang', zh: '横梁压顶', vi: '横梁压顶 (xà ngang压 đầu)',
    desc: 'Xà nhà/đà ngang nằm trên giường/bàn/th Sofa → áp lực.',
    severity: 'slight-hung',
    symptoms: ['đau đầu', 'áp lực', 'khó ngủ', 'sức khoẻ giảm'],
    cures: [
      'Di chuyển giường/bàn ra khỏi xà',
      'Làm trần giả che xà',
      'Treo ống trúc/treven 2 đầu xà (hóa giải)',
      'Nếu không di chuyển → treo khăn/hình trang trí trên xà',
    ],
  },
  {
    id: 'jingzi', zh: '镜子对床', vi: '镜子对床 (gương đối giường)',
    desc: 'Gương đối diện giường ngủ → phản quang phá giấc ngủ, dễ gặp "áp lực âm".',
    severity: 'slight-hung',
    symptoms: ['mất ngủ', 'ác mộng', 'sức khoẻ giảm', 'cãi vã'],
    cures: ['Xoay gương ra hướng khác', 'Che gương vào ban đêm', 'Thay bằng gương tủ kéo ra được'],
  },
  {
    id: 'kaimenjianding', zh: '开门见厅', vi: '开门见厅 (mở cửa thấy thẳng trong)',
    desc: 'Mở cửa chính thấy thẳng vào phòng khách/sofa/giường → khí thoát, không tụ.',
    severity: 'slight-hung',
    symptoms: ['phá tài', 'không giữ được tiền', 'thiếu riêng tư'],
    cures: ['Đặt bình phong/tủ thấp chắn giữa cửa và trong', 'Trồng cây xanh chắn', 'Treo rèm dài'],
  },
  {
    id: 'kaimenjiandao', zh: '开门见灶', vi: '开门见灶 (mở cửa thấy bếp)',
    desc: 'Mở cửa chính thấy thẳng vào bếp lò → "hỏa khí xung" → cãi vã/phá tài.',
    severity: 'hung',
    symptoms: ['cãi vã gia đình', 'tiêu tiền nhanh', 'nóng tính'],
    cures: ['Đặt bình phong chắn giữa cửa và bếp', 'Trồng cây xanh', 'Giữ cửa bếp đóng'],
  },
  {
    id: 'kaimenjianjing', zh: '开门见厕', vi: '开门见厕 (mở cửa thấy vệ sinh)',
    desc: 'Mở cửa chính thấy thẳng vào nhà vệ sinh → uế khí xông, hung nhất.',
    severity: 'hung',
    symptoms: ['sức khoẻ kém', 'phá tài', 'khó nâng cấp'],
    cures: ['Đặt bình phong chắn', 'Giữ cửa vệ sinh đóng LUÔN', 'Đặt cây xanh + muối đá hút ẩm khí', 'Thắp hương trầm定 kỳ'],
  },
  {
    id: 'chishen', zh: '穿心煞', vi: '穿心煞 (đường ống/话穿 giữa nhà)',
    desc: 'Đường ống nước/khung dầm/nha chạy ngang giữa nhà → "xuyên tâm".',
    severity: 'hung',
    symptoms: ['bệnh tim', 'chia ly', 'tai nạn'],
    cures: ['Bọc ống bằng vật liệu tường/trang trí', 'Đặt cây 5 lá dưới ống', 'Treo thiết/đồng tiền cổ'],
  },
  {
    id: 'dengzhu', zh: '灯柱煞', vi: '灯柱/cột điện đối cửa',
    desc: 'Cột đèn/cột điện đối diện cửa chính → như gai đâm.',
    severity: 'slight-hung',
    symptoms: ['sức khoẻ giảm', 'tai nạn nhẹ'],
    cures: ['Treo gương Bát Quái', 'Đặt cây xanh 2 bên cửa'],
  },
  {
    id: 'guashu', zh: '挂树煞', vi: 'Gỗ/cành cây che cửa',
    desc: 'Cành cây/gỗ mục che cửa sổ/cửa chính → âm khí.',
    severity: 'slight-hung',
    symptoms: ['trầm cảm', 'sức khoẻ giảm'],
    cures: ['Cắt tỉa cành', 'Di chuyển cây'],
  },
  {
    id: 'caise', zh: '色彩煞', vi: 'Màu sắc không hợp Dụng Thần',
    desc: 'Tường/nội thất toàn màu Kỵ Thần → ám khí thái quá.',
    severity: 'slight-hung',
    symptoms: ['bức bối', 'dễ cáu', 'sức khoẻ giảm'],
    cures: ['Đổi màu nền sang màu Dụng Thần', 'Thêm accent màu Dụng', 'Đèn ấm màu Dụng'],
  },
];

/**
 * Tìm hóa giải theo từ khóa mô tả vấn đề.
 * @param {string} keyword — mô tả (vd "đường chiếu", "gương", "xà", "bếp")
 * @returns {[{id, zh, vi, desc, severity, symptoms, cures}]}
 */
export function findCure(keyword) {
  const kw = (keyword || '').toLowerCase();
  if (!kw) return SHA_LIST;
  return SHA_LIST.filter(s =>
    s.vi.toLowerCase().includes(kw) ||
    s.desc.toLowerCase().includes(kw) ||
    s.symptoms.some(sym => sym.toLowerCase().includes(kw)) ||
    s.id.includes(kw)
  );
}

/**
 * Lấy danh sách sát + cure theo Dụng Thần (vật phẩm hóa giải theo hành).
 */
export function cureByElement(R) {
  const dungWx = R.yong.primary;
  const kyWx = R.yong.ji;
  const cureMaterials = {
    木: 'cây xanh, gỗ trúc, sợi tự nhiên',
    火: 'đèn đỏ/cam, nến, vật nhọn đỏ',
    土: 'đá/sỏi, gốm, pha lê vàng, đất nung',
    金: 'chuông đồng, gương Bát Quái, đồng tiền cổ, kim loại',
    水: 'bể cá, phong thủy luân nước, thủy tinh',
  };
  return {
    dungMaterial: cureMaterials[dungWx],
    dungWx,
    generalCures: [
      `Vật phẩm Dụng Thần (${dungWx}): ${cureMaterials[dungWx]} — dùng để hóa giải mọi loại sát.`,
      `Gương Bát Quái: treo trên cửa chính khi bị 外煞 (ngoài nhà).`,
      `Cây xanh: trồng che khi bị 路冲/尖角/反弓.`,
      `Đá/crystal: đặt 2 bên cửa khi bị 穿心/灯柱.`,
      `Nước (phong thủy luân): đặt trong nhà khi cần lưu thông khí.`,
    ],
    allSha: SHA_LIST,
  };
}

export { SHA_LIST };
