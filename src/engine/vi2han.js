// ============================================================================
//  ĐỔI TÊN VIỆT NAM (Quốc Ngữ) → HÁN TỰ + KANGXI NÉT
//  Người Việt không biết chữ Hán → module này tự đổi "Nguyễn Văn An" → [阮,文,安]
//  + số nét康熙 → đưa vào name.js tính 五格.
//  Bảng tra: họ phổ biến (15) + chữ tên đệm/given phổ biến (~80).
// ============================================================================
const SURNAME_VI = {
  nguyễn: { han: '阮', strokes: 12 },
  trần: { han: '陳', strokes: 16 }, chen: { han: '陳', strokes: 16 },
  lê: { han: '黎', strokes: 15 },
  phạm: { han: '范', strokes: 11 },
  hoàng: { han: '黃', strokes: 12 }, huỳnh: { han: '黃', strokes: 12 },
  phan: { han: '潘', strokes: 16 },
  vũ: { han: '武', strokes: 8 }, võ: { han: '武', strokes: 8 },
  đăng: { han: '鄧', strokes: 19 },
  ngô: { han: '吳', strokes: 7 },
  dương: { han: '楊', strokes: 13 },
  đinh: { han: '丁', strokes: 2 },
  trịnh: { han: '鄭', strokes: 19 },
  tạ: { han: '謝', strokes: 17 },
  lâm: { han: '林', strokes: 8 },
  cao: { han: '高', strokes: 10 },
  bùi: { han: '裴', strokes: 14 },
  hồ: { han: '胡', strokes: 9 },
  đỗ: { han: '杜', strokes: 7 },
  đoan: { han: '端', strokes: 14 }, // [loop 1036] họ Đoan
  // [loop 1037] +họ phổ biến hơn (康熙 verified): Lý/Lương/Tô/Đàm/Chung/Chu
  lý: { han: '李', strokes: 7 }, lương: { han: '梁', strokes: 11 }, tô: { han: '蘇', strokes: 22 },
  đàm: { han: '譚', strokes: 19 }, chung: { han: '鍾', strokes: 17 }, chu: { han: '朱', strokes: 6 },
};

// Chữ tên đệm/given phổ biến (Việt → Hán Tự + Kangxi)
const NAME_VI = {
  // Tên đệm
  văn: { han: '文', strokes: 4 }, thị: { han: '氏', strokes: 4 }, minh: { han: '明', strokes: 8 },
  đức: { han: '德', strokes: 15 }, hữu: { han: '有', strokes: 6 }, thanh: { han: '清', strokes: 12 },
  quang: { han: '光', strokes: 6 }, hoàng: { han: '皇', strokes: 9 }, quốc: { han: '國', strokes: 11 },
  ngọc: { han: '玉', strokes: 5 }, bảo: { han: '寶', strokes: 20 }, gia: { han: '嘉', strokes: 14 },
  tú: { han: '秀', strokes: 7 }, thu: { han: '秋', strokes: 9 }, xuân: { han: '春', strokes: 9 },
  hà: { han: '河', strokes: 9 }, hải: { han: '海', strokes: 11 }, phương: { han: '方', strokes: 4 },
  // Given names (nam)
  an: { han: '安', strokes: 6 }, anh: { han: '英', strokes: 11 }, bình: { han: '平', strokes: 5 },
  cường: { han: '強', strokes: 11 }, dũng: { han: '勇', strokes: 9 }, dương: { han: '陽', strokes: 17 },
  phong: { han: '風', strokes: 9 }, quang: { han: '光', strokes: 6 }, quân: { han: '君', strokes: 7 }, huy: { han: '輝', strokes: 15 },
  sơn: { han: '山', strokes: 3 }, thắng: { han: '勝', strokes: 12 }, tiến: { han: '進', strokes: 14 },
  trường: { han: '長', strokes: 8 }, tuấn: { han: '俊', strokes: 9 },
  vinh: { han: '榮', strokes: 14 }, long: { han: '龍', strokes: 16 }, nam: { han: '南', strokes: 9 },
  hùng: { han: '雄', strokes: 12 }, khai: { han: '開', strokes: 12 }, thành: { han: '成', strokes: 7 },
  // Given names (nữ)
  chang: { han: '嫦', strokes: 14 }, dao: { han: '瑤', strokes: 15 }, dung: { han: '容', strokes: 10 },
  gam: { han: '澄', strokes: 15 }, hương: { han: '香', strokes: 9 }, hường: { han: '紅', strokes: 9 },
  kiều: { han: '嬌', strokes: 15 }, lan: { han: '蘭', strokes: 23 }, linh: { han: '玲', strokes: 10, alt: [{ han: '鈴', strokes: 13 }] },
 loan: { han: '鸞', strokes: 30 }, mai: { han: '梅', strokes: 11 }, my: { han: '眉', strokes: 9 },
  nga: { han: '娥', strokes: 10 }, ngân: { han: '銀', strokes: 14 }, nhung: { han: '絨', strokes: 12 },
  nhi: { han: '兒', strokes: 8 }, hoa: { han: '花', strokes: 10 }, hân: { han: '欣', strokes: 8 },
  khánh: { han: '慶', strokes: 15 }, kim: { han: '金', strokes: 8 }, ly: { han: '璃', strokes: 15 },
  mi: { han: '眉', strokes: 9 }, nguyệt: { han: '月', strokes: 4 },
  oanh: { han: '鶯', strokes: 21 }, phúc: { han: '福', strokes: 14 },
  tram: { han: '簪', strokes: 18 }, trang: { han: '莊', strokes: 13, alt: [{ han: '妝', strokes: 7 }] }, vi: { han: '薇', strokes: 19 },
  vy: { han: '微', strokes: 13 }, yến: { han: '燕', strokes: 16 }, thư: { han: '書', strokes: 10 },
  thảo: { han: '草', strokes: 12 }, uyên: { han: '淵', strokes: 12 }, châu: { han: '珠', strokes: 11 },
  diệu: { han: '妙', strokes: 7 }, hằng: { han: '姮', strokes: 9 }, thùy: { han: '隨', strokes: 17 },
  như: { han: '如', strokes: 6 }, tín: { han: '信', strokes: 9 },
  hiếu: { han: '孝', strokes: 7 }, phát: { han: '發', strokes: 12 }, phú: { han: '富', strokes: 12 },
  hiển: { han: '顯', strokes: 23 }, trí: { han: '智', strokes: 12 }, kiên: { han: '堅', strokes: 11 },
  chính: { han: '正', strokes: 5 }, trung: { han: '忠', strokes: 8 }, nghĩa: { han: '義', strokes: 13 },
  lạc: { han: '樂', strokes: 15 }, tùng: { han: '松', strokes: 8 }, wiel: { han: '偉', strokes: 11 },
  // [loop 666] tên user (Quân 君, Nhật 日 — 康熙 nét)
  quân: { han: '君', strokes: 7 }, quan: { han: '君', strokes: 7 }, nhật: { han: '日', strokes: 4 },
  việt: { han: '越', strokes: 12 }, hà: { han: '河', strokes: 9, alt: [{ han: '霞', strokes: 17 }] },
  vĩ: { han: '偉', strokes: 11 }, hào: { han: '豪', strokes: 14 }, khang: { han: '康', strokes: 11 },
  thiện: { han: '善', strokes: 12 }, nhẫn: { han: '忍', strokes: 7 }, đan: { han: '丹', strokes: 4 },
  tình: { han: '情', strokes: 11 }, tâm: { han: '心', strokes: 4 }, thủy: { han: '水', strokes: 4 },
  // [loop 1047] +10 chữ tên phổ biến (康熙 confident): Bách/Cao/Chí/Đăng/Định/Đồng/Khắc/Khoa/Tài/Vũ
  bách: { han: '柏', strokes: 9 }, cao: { han: '高', strokes: 10 }, chí: { han: '志', strokes: 7 },
  đăng: { han: '登', strokes: 12 }, định: { han: '定', strokes: 8 }, đồng: { han: '同', strokes: 6 },
  khắc: { han: '克', strokes: 7 }, khoa: { han: '科', strokes: 9 }, tài: { han: '才', strokes: 4 },
  vũ: { han: '武', strokes: 8 },
  // [loop 1035] bổ sung 8 chữ tên phổ biến còn thiếu (康熙 nét verified): Quỳnh/Phượng/Quyên/Nhiên/Lam/Khôi/Ninh/Thuần
  quỳnh: { han: '瓊', strokes: 20 }, phượng: { han: '鳳', strokes: 14 }, quyên: { han: '娟', strokes: 10 },
  nhiên: { han: '然', strokes: 12 }, lam: { han: '藍', strokes: 20 }, khôi: { han: '魁', strokes: 14 },
  ninh: { han: '寧', strokes: 14 }, thuần: { han: '純', strokes: 10 },
  // [loop 1036] +20 chữ tên phổ biến (康熙 verified): Bích/Cát/Cúc/Diệp/Đoan/Hạnh/Hồng/Huệ/Khuê/Liên/Nguyên/Nhã/Quế/Sen/Thơ/Tiết/Trinh/Tường/Tuyết/Viên
  bích: { han: '碧', strokes: 14 }, cát: { han: '吉', strokes: 6 }, cúc: { han: '菊', strokes: 14 },
  diệp: { han: '葉', strokes: 15 }, đoan: { han: '端', strokes: 14 }, hạnh: { han: '幸', strokes: 8 },
  hồng: { han: '紅', strokes: 9 }, huệ: { han: '惠', strokes: 12 }, khuê: { han: '圭', strokes: 6 },
  liên: { han: '蓮', strokes: 17 }, nguyên: { han: '元', strokes: 4 }, nhã: { han: '雅', strokes: 12 },
  quế: { han: '桂', strokes: 10 }, sen: { han: '蓮', strokes: 17 }, thơ: { han: '詩', strokes: 13 },
  tiết: { han: '節', strokes: 15 }, trinh: { han: '貞', strokes: 9 }, tường: { han: '祥', strokes: 11 },
  tuyết: { han: '雪', strokes: 11 }, viên: { han: '圓', strokes: 13 },
  // [loop 1048] +7 chữ tên phổ biến (康熙): Danh/Giang/Lực/Nghị/Tân/Vương/Điền
  danh: { han: '名', strokes: 6 }, giang: { han: '江', strokes: 7 }, lực: { han: '力', strokes: 2 },
  nghị: { han: '議', strokes: 20 }, tân: { han: '辛', strokes: 7 }, vương: { han: '王', strokes: 4 },
  điền: { han: '田', strokes: 5 },
};

/**
 * Đổi tên tiếng Việt → Hán Tự + nét.
 * @param {string} viName - tên tiếng Việt không dấu, vd "nguyen van an"
 * @returns {{ chars: [{ vi, han, strokes }], ok, missing }}
 */
function stripDiacritics(str) { return str.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g,'d').replace(/Đ/g,'D'); }
// Normalize table keys (strip diacritics)
const _SUR = {}; for (const [k,v] of Object.entries(SURNAME_VI)) _SUR[stripDiacritics(k)] = v;
const _NAME = {}; for (const [k,v] of Object.entries(NAME_VI)) _NAME[stripDiacritics(k)] = v;

export function viToHan(viName) {
  // stripDiacritics từng từ để tra đúng key (dict đã strip dấu): "Nguyễn"→"nguyen"
  const parts = viName.toLowerCase().trim().split(/\s+/).map(stripDiacritics);
  const chars = [];
  const missing = [];

  // First word = surname (nếu chỉ 1 từ và không phải họ → fallback _NAME cho given name đơn lẻ)
  if (parts.length > 0) {
    const s = parts.length === 1 ? (_SUR[parts[0]] || _NAME[parts[0]]) : _SUR[parts[0]];
    if (s) chars.push({ vi: parts[0], han: s.han, strokes: s.strokes });
    else missing.push(parts[0]);
  }
  // Rest = given/middle names
  for (let i = 1; i < parts.length; i++) {
    const n = _NAME[parts[i]];
    if (n) chars.push({ vi: parts[i], han: n.han, strokes: n.strokes });
    else missing.push(parts[i]);
  }

  return {
    chars,
    hanString: chars.map((c) => c.han).join(''),
    strokes: chars.map((c) => c.strokes),
    ok: missing.length === 0,
    missing,
    hint: missing.length
      ? `Chưa có bảng tra cho: ${missing.join(', ')}. Bạn có thể tra thủ công康熙nét rồi nhập vào ô "Ghi đè nét" ở mục Học Tên.`
      : 'Đã đổi xong — có thể phân tích 五格.',
  };
}

export { SURNAME_VI, NAME_VI };
