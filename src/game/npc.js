// Sinh khách NPC theo hạt giống (ngày · khe · người chơi). Nhẹ — không kéo engine/kb.
// Dùng ở sân (vẽ 3 khách chờ) và ở cases.js (dựng án).

// --- ngẫu nhiên có hạt giống (cùng ngày + cùng khách → cùng án)
export function hashSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h;
}
export function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
function shuffle(r, arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// --- khách NPC
const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Phan', 'Trịnh'];
const TEN_NAM = ['Minh', 'Hùng', 'Tuấn', 'Dũng', 'Quang', 'Hải', 'Sơn', 'Long', 'Phúc', 'Khôi', 'Nam', 'Bảo', 'Trung', 'Đức', 'Thành'];
const TEN_NU = ['Lan', 'Mai', 'Hương', 'Thảo', 'Ngọc', 'Linh', 'Hà', 'Trang', 'Yến', 'Vy', 'An', 'Thu', 'Hạnh', 'Nhung', 'Quỳnh'];
const ROBES = ['木', '火', '土', '金', '水'];

const QUESTIONS = [
  { topic: 'career', age: [22, 55], jobs: ['nhân viên văn phòng', 'kỹ sư phần mềm', 'giáo viên', 'kế toán'], q: 'Tôi đang tính đổi việc. Những năm tới năm nào thuận nhất để chuyển?' },
  { topic: 'career', age: [28, 60], jobs: ['trưởng nhóm bán hàng', 'quản lý xưởng', 'cán bộ'], q: 'Công việc dạo này bế tắc. Tôi nên tiến hay nên giữ, và năm nào dễ thăng tiến?' },
  { topic: 'wealth', age: [25, 75], jobs: ['chủ tiệm ăn', 'buôn bán online', 'thợ may'], q: 'Tôi muốn mở rộng việc buôn bán. Năm nào nên bỏ vốn?' },
  { topic: 'wealth', age: [25, 60], jobs: ['công nhân', 'tài xế', 'nhân viên ngân hàng'], q: 'Tôi để dành được ít tiền, định mua nhà. Năm nào nên quyết?' },
  { topic: 'love', age: [20, 42], jobs: ['dược sĩ', 'thiết kế đồ hoạ', 'y tá'], q: 'Tôi muốn biết mấy năm tới năm nào thuận cho chuyện cưới hỏi.' },
  { topic: 'study', age: [18, 30], jobs: ['sinh viên', 'học viên cao học'], q: 'Tôi chuẩn bị thi lớn. Nên tập trung vào điều gì và năm nào thuận học hành?' },
  { topic: 'move', age: [25, 80], jobs: ['nội trợ', 'thợ điện', 'hướng dẫn viên'], q: 'Gia đình tính chuyển nhà. Năm nào hợp để dọn đi?' },
];

function honorific(age, gender) {
  if (age < 25) return 'Bạn';
  if (age < 45) return gender === 'nam' ? 'Anh' : 'Chị';
  if (age < 62) return gender === 'nam' ? 'Chú' : 'Cô';
  return gender === 'nam' ? 'Bác' : 'Bà';
}

// Một khách cho (ngày, khe, người chơi). year: năm hiện tại (để tính tuổi + lưu niên).
export function makeNpc(key, year = new Date().getFullYear()) {
  const r = rng(hashSeed(key));
  const gender = r() < 0.5 ? 'nam' : 'nữ';
  const by = year - (18 + Math.floor(r() * 55));
  const bm = 1 + Math.floor(r() * 12);
  const dim = new Date(by, bm, 0).getDate();
  const bd = 1 + Math.floor(r() * dim);
  const bh = Math.floor(r() * 24);
  const bmin = Math.floor(r() * 4) * 15;
  // câu hỏi + nghề hợp tuổi (không có bà 66 tuổi đi thi cao học)
  const ageNow = year - by;
  const Q = pick(r, QUESTIONS.filter((x) => ageNow >= x.age[0] && ageNow <= x.age[1]));
  const ten = pick(r, gender === 'nam' ? TEN_NAM : TEN_NU);
  const age = year - by;
  return {
    key, gender, year: by, month: bm, day: bd, hour: bh, minute: bmin, age,
    fullName: `${pick(r, HO)} ${ten}`, call: `${honorific(age, gender)} ${ten}`,
    job: pick(r, Q.jobs), topic: Q.topic, question: Q.q, robe: pick(r, ROBES),
  };
}
