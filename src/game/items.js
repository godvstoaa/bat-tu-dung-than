// ============================================================================
//  VẬT PHẨM THÀNH BÁT QUÁI — danh mục hàng của các cửa hàng (thuần JS, test Node đọc trực tiếp).
//  kind: 'decor' (bài trí trong nhà — có hành, khung chiếm đất, có thể có chức năng `use`)
//        'use'   (đồ dùng một lần: hương, trà, thức ăn cá, đan dược)
//  Giá: khai báo theo Phúc Khí cũ { phuc } → quy ra tiền kim loại { xu } lúc nạp (P18, coins.normPrice); { ngoc } (Ngọc — hàng quý).
//  Túi đồ: state.home.inv { id: số lượng }.
//  model: GLB (public/models/<id>.glb), co theo bề ngang foot[0] · proc: mã dựng thủ tục (interior-build.js).
// ============================================================================
import { wardrobe } from './cosmetics.js';
import { normPrice, fmt as fmtCoin } from './coins.js';
import { walletXu, spendXu, gainXu } from './life.js';

export const WX_NAME = { 木: 'Mộc', 火: 'Hỏa', 土: 'Thổ', 金: 'Kim', 水: 'Thủy' };

// Loại cửa hàng: tên gốc, mặt tiền (model), chủ đề, nhóm hàng bày bán, dịch vụ
export const SHOP_TYPES = {
  moc: { name: 'Mộc Nghệ Phường', facade: 'bq_carpentry', owner: 'Thợ Mộc', look: 'npc_villager', wall: '#c9b48e', floor: 'wood', sells: ['moc'] },
  gom: { name: 'Lò Gốm', facade: 'bq_pottery', owner: 'Thợ Gốm', look: 'npc_villager', wall: '#d8c9ae', floor: 'stone', sells: ['gom'] },
  den: { name: 'Đèn Lồng Phường', facade: 'bq_lantern_shop', owner: 'Bà Đèn', look: 'hero_f', wall: '#b8452c', floor: 'wood', sells: ['den'] },
  thuhoa: { name: 'Thư Họa Các', facade: 'bq_bookstore', owner: 'Họa Sư', look: 'master', wall: '#e3dccb', floor: 'wood', sells: ['thuhoa'] },
  hoavien: { name: 'Hoa Viên', facade: 'bq_moongate', owner: 'Người Làm Vườn', look: 'npc_villager', wall: '#cfd8bf', floor: 'stone', sells: ['hoavien'] },
  phongthuy: { name: 'Phong Thủy Đường', facade: 'bq_drum_tower', owner: 'Thầy Địa Lý', look: 'master', wall: '#4a3a2a', floor: 'stone', sells: ['phongthuy'], svc: ['khaosat', 'thaymenh'] },
  huong: { name: 'Hương Phường', facade: 'bq_incense', owner: 'Chủ Hương', look: 'npc_merchant', wall: '#8a2a1c', floor: 'wood', sells: ['huong'] },
  tratrang: { name: 'Trà Trang', facade: 'bq_teashop', owner: 'Chủ Trà Trang', look: 'hero_f', wall: '#d6ccb2', floor: 'wood', sells: ['tra'] },
  duoc: { name: 'Dược Phòng', facade: 'bq_apothecary', owner: 'Lang Trung', look: 'master', wall: '#c9b993', floor: 'wood', sells: ['duoc'], svc: ['thuoc', 'yquan'] }, // P3: thang thuốc (bệnh nhẹ) + Y Quán gian sau (bắt mạch)
  loren: { name: 'Lò Rèn', facade: 'bq_forge', owner: 'Thợ Rèn', look: 'hero_m', wall: '#5a4a3e', floor: 'stone', sells: ['loren'] },
  tuu: { name: 'Tửu Lâu', facade: 'bq_tavern', owner: 'Chưởng Quầy', look: 'npc_merchant', wall: '#c9b993', floor: 'wood', sells: [], svc: ['tindon', 'bep', 'beptruong'] },
  tralau: { name: 'Trà Lâu', facade: 'bq_teahouse', owner: 'Trà Sư', look: 'master', wall: '#d6ccb2', floor: 'wood', sells: [], svc: ['thuyetthu', 'uongtra'] },
  dichtram: { name: 'Dịch Trạm', facade: 'bq_inn', owner: 'Trạm Trưởng', look: 'hero_m', wall: '#c9b48e', floor: 'stone', sells: [], svc: ['thuengua', 'tientrang', 'cho'] }, // dịch trạm kiêm Tiền Trang (gửi tiền, ngân phiếu đi các cổng)
  namon: { name: 'Nha Môn Địa Ốc', facade: 'bq_yamen', owner: 'Quan Địa Ốc', look: 'master', wall: '#8a2a1c', floor: 'stone', sells: [], svc: ['diaoc', 'tientrang', 'ruong', 'matbang', 'hotich'] },
};

const D = (id, name, cat, wx, price, foot, extra = {}) => ({ id, name, cat, wx, price, foot, kind: 'decor', place: 'floor', h: 1, ...extra });
const U = (id, name, cat, price, extra = {}) => ({ id, name, cat, price, kind: 'use', ...extra });

export const ITEMS = [
  // --- Mộc Nghệ Phường: đồ gỗ (Mộc)
  D('ghe_tanh', 'Ghế Thái Sư', 'moc', '木', { phuc: 40 }, [0.8, 0.8], { model: 'pr_chair', h: 1.15, desc: 'Ghế gỗ trắc tựa cao, chỗ ngồi của chủ nhà.' }),
  D('ghe_son', 'Ghế Sơn Son', 'moc', '火', { phuc: 55 }, [0.8, 0.8], { model: 'pr_chair_red', h: 1.05, desc: 'Ghế bành sơn son thếp vàng.' }),
  D('ban_tron', 'Bàn Tròn Chạm Hoa', 'moc', '木', { phuc: 90 }, [1.8, 1.8], { model: 'pr_table_round', h: 0.85, desc: 'Bàn tròn ăn cơm cả nhà, chạm hoa mẫu đơn.' }),
  D('ban_tra', 'Bàn Trà Thấp', 'moc', '木', { phuc: 70 }, [1.2, 1.2], { model: 'pr_table_long', h: 0.5, use: 'teatable', desc: 'Pha trà ngay tại nhà (cần lá trà).' }),
  D('an_thu', 'Án Thư', 'moc', '木', { phuc: 85 }, [2.2, 0.8], { model: 'scholar_desk', h: 0.9, use: 'desk', desc: 'Bàn viết của người đọc sách. Đặt lưng tựa tường, nhìn ra cửa thì tốt.' }),
  D('ban_tho', 'Bàn Thờ Gia Tiên', 'moc', '火', { phuc: 160 }, [2.0, 0.7], { model: 'pr_table_ming', h: 1.1, use: 'altar', desc: 'Thắp hương mỗi ngày (cần hương). Nên tựa vách sau.' }),
  D('giuong', 'Giường Lục Trụ', 'moc', '木', { phuc: 220 }, [2.2, 2.2], { model: 'pr_bed', h: 2.4, use: 'bed', desc: 'Nghỉ ở đây thì lần sau vào game thức dậy tại nhà.' }),
  D('tu_cham', 'Tủ Chạm Sơn Mài', 'moc', '金', { phuc: 130 }, [1.2, 0.65], { model: 'pr_cabinet', h: 1.9, desc: 'Tủ sơn mài khảm hoa.' }),
  D('tu_hoa', 'Tủ Hoa Điểu', 'moc', '木', { phuc: 150 }, [1.2, 0.9], { model: 'pr_cabinet2', h: 1.9, desc: 'Tủ vẽ hoa điểu, hợp phòng khách.' }),
  D('ke_sach', 'Kệ Sách', 'moc', '木', { phuc: 120 }, [1.4, 0.6], { model: 'lib_bookshelf', h: 2.6, use: 'books', desc: 'Mỗi ngày đọc một đoạn cổ văn.' }),
  D('binh_phong', 'Bình Phong Cổ', 'moc', '木', { phuc: 110 }, [2.4, 0.35], { model: 'pr_screen_antique', h: 1.9, desc: 'Che chắn khí xung từ cửa thẳng vào nhà.' }),
  D('binh_phong_hoa', 'Bình Phong Xuân Hoa', 'moc', '木', { ngoc: 30 }, [2.4, 0.75], { model: 'pr_screen_blossom', h: 1.9, rare: true, desc: 'Bình phong vẽ hoa xuân — hàng quý.' }),
  // --- Lò Gốm (Thổ)
  D('binh_minh', 'Bình Hoa Lam Minh', 'gom', '土', { phuc: 45 }, [0.6, 0.6], { model: 'pr_vase_ming', h: 1.2, desc: 'Bình men lam vẽ rồng mây.' }),
  D('chum_su', 'Chum Sứ Nhân Vật', 'gom', '土', { phuc: 60 }, [0.7, 0.7], { model: 'pr_jar_porcelain', h: 1.0, desc: 'Chum sứ vẽ tích cổ.' }),
  D('binh_ngoc', 'Bình Men Ngọc', 'gom', '水', { phuc: 50 }, [0.5, 0.5], { model: 'pr_vase_celadon', h: 0.9, desc: 'Men ngọc xanh như nước hồ thu.' }),
  D('am_chen', 'Bộ Ấm Chén Khay Tròn', 'gom', '土', { phuc: 35 }, [0.7, 0.7], { model: 'pr_teaset', h: 0.35, desc: 'Đặt cạnh bàn trà cho đủ lễ.' }),
  D('chum_nuoc', 'Chum Nước Sân Nhà', 'gom', '水', { phuc: 40 }, [0.9, 0.9], { proc: 'jar', h: 0.9, desc: 'Chum đựng nước mưa — tụ thủy.' }),
  // --- Đèn Lồng Phường (Hỏa)
  D('den_long_do', 'Đèn Lồng Đỏ', 'den', '火', { phuc: 25 }, [0.6, 0.6], { proc: 'lantern_stand', h: 1.8, use: 'light', color: '#c8341f', desc: 'Đèn đứng thắp sáng một góc nhà.' }),
  D('den_long_vang', 'Đèn Lồng Vàng', 'den', '火', { phuc: 30 }, [0.6, 0.6], { proc: 'lantern_stand', h: 1.8, use: 'light', color: '#e2a531', desc: 'Ánh vàng ấm, hợp phương Nam.' }),
  D('den_da', 'Đèn Đá', 'den', '土', { phuc: 65 }, [0.7, 0.6], { model: 'pr_stonelantern', h: 1.4, use: 'light', color: '#ffcf8a', desc: 'Thạch đăng — đèn đá sân vườn.' }),
  D('den_cung', 'Cung Đăng Lục Giác', 'den', '火', { ngoc: 25 }, [0.6, 0.6], { proc: 'lantern_stand', h: 2.1, use: 'light', color: '#ffd27a', rare: true, desc: 'Đèn cung đình sáu cạnh — hàng quý.' }),
  // --- Thư Họa Các (treo tường)
  D('tranh_son_thuy', 'Tranh Sơn Thủy', 'thuhoa', '水', { phuc: 60 }, [1.6, 0.1], { proc: 'painting', place: 'wall', h: 1.1, art: 'sonthuy', desc: 'Núi xa nước gần — treo vách sau tốt cho tựa sơn.' }),
  D('tranh_mai', 'Tranh Mai Lan', 'thuhoa', '木', { phuc: 55 }, [1.0, 0.1], { proc: 'painting', place: 'wall', h: 1.6, art: 'mai', desc: 'Tranh thủy mặc cành mai.' }),
  D('hoanh_phi', 'Hoành Phi «Phúc Mãn Đường»', 'thuhoa', '金', { phuc: 80 }, [2.0, 0.1], { proc: 'plaque', place: 'wall', h: 0.5, text: 'PHÚC MÃN ĐƯỜNG', desc: 'Biển gỗ chữ vàng — treo trên bàn thờ.' }),
  D('cau_doi', 'Câu Đối Gỗ', 'thuhoa', '木', { phuc: 70 }, [1.6, 0.1], { proc: 'couplet', place: 'wall', h: 2.0, desc: 'Cặp câu đối khắc gỗ (chọn câu khi treo).' }),
  D('chu_phuc', 'Chữ «Phúc» Thư Pháp', 'thuhoa', '火', { phuc: 35 }, [0.8, 0.1], { proc: 'calli', place: 'wall', h: 0.8, text: 'PHÚC', desc: 'Một chữ Phúc viết tay.' }),
  // --- Hoa Viên (Mộc / Thủy)
  D('bonsai', 'Chậu Tùng Bonsai', 'hoavien', '木', { phuc: 50 }, [0.8, 0.8], { model: 'lib_bonsai', h: 1.0, use: 'plant', desc: 'Tưới mỗi ngày, cây lớn dần.' }),
  D('chau_truc', 'Chậu Trúc Phú Quý', 'hoavien', '木', { phuc: 35 }, [0.6, 0.6], { proc: 'bamboo', h: 1.6, use: 'plant', desc: 'Trúc xanh — hợp phương Đông.' }),
  D('chau_lan', 'Chậu Lan', 'hoavien', '木', { phuc: 30 }, [0.5, 0.5], { proc: 'orchid', h: 0.7, use: 'plant', desc: 'Lan thanh nhã.' }),
  D('be_ca', 'Bể Cá Cảnh', 'hoavien', '水', { phuc: 140 }, [1.0, 1.0], { model: 'pr_fishbowl', h: 0.9, use: 'fish', desc: 'Cho cá ăn mỗi ngày. Đặt phương Bắc / Đông / Đông Nam thì vượng.' }),
  // --- Phong Thủy Đường (Kim / Thổ)
  D('ty_huu', 'Tỳ Hưu Ngọc', 'phongthuy', '金', { phuc: 120 }, [0.5, 0.85], { model: 'pr_pixiu', h: 0.8, desc: 'Giữ của — quay đầu ra cửa.' }),
  D('thiem_thu', 'Thiềm Thừ Ngậm Tiền', 'phongthuy', '金', { phuc: 100 }, [0.6, 0.75], { model: 'pr_toad', h: 0.5, desc: 'Cóc ba chân chiêu tài.' }),
  D('la_ban', 'Giá La Bàn', 'phongthuy', '土', { phuc: 150 }, [1.0, 1.0], { model: 'luopan_stand', h: 1.2, use: 'compass', desc: 'Xem phong thủy căn nhà bất cứ lúc nào.' }),
  D('chuong_gio', 'Chuông Gió Đồng', 'phongthuy', '金', { phuc: 45 }, [0.4, 0.4], { proc: 'chime', h: 1.9, desc: 'Hóa giải khí xấu, nghe vui tai.' }),
  D('cau_thach_anh', 'Cầu Thạch Anh', 'phongthuy', '土', { phuc: 75 }, [0.5, 0.5], { proc: 'crystal', h: 0.7, desc: 'Tụ khí — đặt giữa nhà.' }),
  D('ky_lan', 'Sư Tử Đá Trấn Trạch', 'phongthuy', '土', { ngoc: 40 }, [1.0, 1.0], { model: 'bq_lion', h: 1.0, rare: true, desc: 'Trấn trạch — hàng quý.' }),
  // --- Hương Phường
  D('tuong_lao_quan', 'Tượng Thái Thượng Lão Quân', 'huong', '土', { ngoc: 60 }, [1.0, 0.8], { model: 'deity_daode', h: 1.6, rare: true, desc: 'Đặt cạnh bàn thờ — hàng quý.' }),
  D('lu_dong', 'Lư Đồng Ba Chân', 'huong', '金', { phuc: 70 }, [0.8, 0.8], { model: 'cauldron', h: 0.9, desc: 'Lư hương đồng đặt trước bàn thờ.' }),
  U('huong_thuong', 'Hương Thường (bó)', 'huong', { phuc: 3 }, { use: 'incense', tier: 1, desc: 'Thắp ở bàn thờ trong nhà: +5 Phúc Khí/ngày.' }),
  U('huong_tram', 'Trầm Hương', 'huong', { phuc: 10 }, { use: 'incense', tier: 2, desc: 'Thắp ở bàn thờ: +8 Phúc Khí/ngày.' }),
  U('huong_kynam', 'Kỳ Nam Hương', 'huong', { ngoc: 3 }, { use: 'incense', tier: 3, desc: 'Thắp ở bàn thờ: +12 Phúc Khí/ngày.' }),
  // --- Trà Trang
  U('tra_longtinh', 'Trà Long Tỉnh', 'tra', { phuc: 6 }, { use: 'tea', color: '#9fb35a', desc: 'Pha ở bàn trà trong nhà hoặc Trà Thất: nước xanh cốm.' }),
  U('tra_thietquanam', 'Trà Thiết Quan Âm', 'tra', { phuc: 8 }, { use: 'tea', color: '#c7a24a', desc: 'Nước vàng óng, hương lan.' }),
  U('tra_phonhi', 'Trà Phổ Nhĩ', 'tra', { phuc: 10 }, { use: 'tea', color: '#6a2e1a', desc: 'Nước nâu đỏ, đậm đà.' }),
  U('tra_bach', 'Bạch Trà', 'tra', { phuc: 12 }, { use: 'tea', color: '#e6d6a2', desc: 'Nước vàng nhạt, thanh tao.' }),
  // --- Dược Phòng
  U('tochanh', 'Tốc Hành Tán', 'duoc', { phuc: 15 }, { use: 'buff_speed', mins: 10, desc: 'Đi nhanh gấp 1,6 lần trong 10 phút.' }),
  U('thanhtam', 'Thanh Tâm Đan', 'duoc', { phuc: 25 }, { use: 'buff_case', desc: 'Phúc Khí từ giải án hôm nay +25% (mỗi ngày dùng một viên).' }),
  U('thucan_ca', 'Thức Ăn Cá', 'duoc', { phuc: 2 }, { use: 'fishfood', desc: 'Cho cá trong bể ăn.' }),
  // --- Lò Rèn (Kim)
  D('kiem_treo', 'Kiếm Treo Tường', 'loren', '金', { phuc: 90 }, [1.4, 0.1], { proc: 'sword', place: 'wall', h: 0.4, desc: 'Thanh kiếm thép rèn, treo trấn trạch.' }),
  D('gia_binh_khi', 'Giá Binh Khí', 'loren', '金', { phuc: 110 }, [1.8, 0.6], { model: 'bq_weapon_rack', h: 1.8, desc: 'Giá bày đao kiếm thương.' }),
];
// P18: giá Phúc Khí cũ → tiền kim loại (xu) theo nhóm (đồ dùng × 4 đồng, đồ bài trí × 12 đồng — coins.PHUC_RATE); Ngọc giữ
for (const it of ITEMS) it.price = normPrice(it.price, it.kind === 'decor' ? 'decor' : 'use');
export const ITEM = Object.fromEntries(ITEMS.map((it) => [it.id, it]));
export const itemsOfShop = (type) => ITEMS.filter((it) => (SHOP_TYPES[type]?.sells || []).includes(it.cat));

// Câu đối chọn sẵn (không cho gõ tự do)
export const COUPLETS = [
  ['Phúc như Đông Hải', 'Thọ tỷ Nam Sơn'],
  ['Thiên tăng tuế nguyệt', 'Nhân tăng thọ'],
  ['Gia hòa vạn sự hưng', 'Nhân an bách phúc lai'],
  ['Sơn thanh thủy tú', 'Nhân kiệt địa linh'],
  ['Tích thiện chi gia', 'Tất hữu dư khánh'],
  ['Trúc báo bình an', 'Mai khai phú quý'],
  ['Xuân an hạ thái', 'Thu thịnh đông vinh'],
  ['Thư hương truyền thế', 'Đức trạch lưu phương'],
];

// --- túi đồ
export function homeState(s) {
  if (!s.home || typeof s.home !== 'object') s.home = {};
  const h = s.home;
  h.inv = h.inv && typeof h.inv === 'object' ? h.inv : {};
  for (const k of Object.keys(h.inv)) if (!ITEM[k] || !(h.inv[k] > 0)) delete h.inv[k];
  h.own = h.own && typeof h.own === 'object' && Number.isInteger(h.own.h) ? h.own : null;
  if (h.own) { h.own.items = Array.isArray(h.own.items) ? h.own.items.filter((x) => ITEM[x.i]) : []; h.own.couplet = h.own.couplet | 0; }
  h.buffs = h.buffs && typeof h.buffs === 'object' ? h.buffs : {};
  h.plants = h.plants && typeof h.plants === 'object' ? h.plants : {};
  h.spawn = h.spawn === 'home' ? 'home' : null;
  return h;
}
export const invCount = (s, id) => homeState(s).inv[id] || 0;
/** tổng số món decor của id đang có (trong túi + đã bài trí) */
export function ownedTotal(s, id) {
  const h = homeState(s);
  return (h.inv[id] || 0) + (h.own ? h.own.items.filter((x) => x.i === id).length : 0);
}

/** Mua n món: { ok, reason } — trừ tiền (xu, ví life.js) hoặc Ngọc, cho vào túi */
export function buyItem(s, id, n = 1) {
  const it = ITEM[id];
  if (!it) return { ok: false, reason: 'Không có món này.' };
  n = Math.max(1, Math.min(20, n | 0));
  const w = wardrobe(s), h = homeState(s);
  const cost = { xu: (it.price.xu || 0) * n, ngoc: (it.price.ngoc || 0) * n };
  if (cost.xu && walletXu(s) < cost.xu) return { ok: false, reason: `Không đủ tiền (cần ${fmtCoin(cost.xu)}).` };
  if (cost.ngoc && w.ngoc < cost.ngoc) return { ok: false, reason: `Thiếu Ngọc (cần ${cost.ngoc}).` };
  if (it.kind === 'decor' && ownedTotal(s, id) + n > 12) return { ok: false, reason: 'Mỗi món chỉ giữ tối đa 12 chiếc.' };
  if (cost.xu) spendXu(s, cost.xu); w.ngoc -= cost.ngoc;
  h.inv[id] = (h.inv[id] || 0) + n;
  return { ok: true };
}
/** giá bán lại: một nửa, làm tròn xuống tới đồng (luôn < giá mua) */
export const sellPrice = (it) => ({ xu: Math.floor((it.price.xu || 0) / 200) * 100, ngoc: Math.floor((it.price.ngoc || 0) / 2) });
export function sellItem(s, id) {
  const it = ITEM[id], h = homeState(s);
  if (!it || !(h.inv[id] > 0)) return { ok: false, reason: 'Không có trong túi.' };
  const p = sellPrice(it), w = wardrobe(s);
  h.inv[id]--; if (!h.inv[id]) delete h.inv[id];
  if (p.xu) gainXu(s, p.xu); w.ngoc += p.ngoc;
  return { ok: true, got: p };
}
export function consume(s, id) {
  const h = homeState(s);
  if (!(h.inv[id] > 0)) return false;
  h.inv[id]--; if (!h.inv[id]) delete h.inv[id];
  return true;
}
/** món đầu tiên trong túi có use = u (ưu tiên hạng cao) */
export function firstUsable(s, u) {
  const h = homeState(s);
  return ITEMS.filter((it) => it.use === u && it.kind === 'use' && h.inv[it.id] > 0).sort((a, b) => (b.tier || 0) - (a.tier || 0))[0] || null;
}

// --- hàng hiếm theo ngày: mỗi cửa hàng một món quý (Ngọc) xoay vòng theo ngày
function hash(str) { let h = 2166136261; for (const c of String(str)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
export function dailyRare(shopType, shopIdx, dateStr) {
  const pool = ITEMS.filter((it) => it.rare);
  const own = pool.filter((it) => (SHOP_TYPES[shopType]?.sells || []).includes(it.cat));
  const list = own.length ? own : [];
  if (!list.length) return null;
  return list[hash(`${dateStr}|${shopType}|${shopIdx}`) % list.length];
}
/** giảm giá ngày: một món thường của tiệm giảm 20% theo ngày (tiền) */
export function dailyDeal(shopType, shopIdx, dateStr) {
  const list = itemsOfShop(shopType).filter((it) => it.price.xu && !it.rare);
  if (!list.length) return null;
  const it = list[hash(`deal|${dateStr}|${shopType}|${shopIdx}`) % list.length];
  return { id: it.id, xu: Math.max(100, Math.round((it.price.xu * 0.8) / 100) * 100) };
}
export function buyDeal(s, deal) {
  const it = ITEM[deal.id];
  if (walletXu(s) < deal.xu) return { ok: false, reason: `Không đủ tiền (cần ${fmtCoin(deal.xu)}).` };
  if (it.kind === 'decor' && ownedTotal(s, it.id) + 1 > 12) return { ok: false, reason: 'Mỗi món chỉ giữ tối đa 12 chiếc.' };
  const h = homeState(s); spendXu(s, deal.xu); h.inv[it.id] = (h.inv[it.id] || 0) + 1;
  return { ok: true };
}

// --- đan dược
export function activeBuff(s, key, now = Date.now()) { const b = homeState(s).buffs[key]; return b && b.until > now ? b : null; }
export function useBuff(s, id, now = Date.now(), dateStr = '') {
  const it = ITEM[id], h = homeState(s);
  if (!it || !(h.inv[id] > 0)) return { ok: false, reason: 'Không có trong túi.' };
  if (it.use === 'buff_speed') { consume(s, id); const cur = activeBuff(s, 'speed', now); h.buffs.speed = { until: (cur ? cur.until : now) + it.mins * 60000 }; return { ok: true, msg: `Thân nhẹ như yến — đi nhanh ${it.mins} phút.` }; }
  if (it.use === 'buff_case') {
    if (h.buffs.case?.date === dateStr) return { ok: false, reason: 'Hôm nay đã dùng rồi.' };
    consume(s, id); h.buffs.case = { date: dateStr }; return { ok: true, msg: 'Tâm sáng như gương — giải án hôm nay được thêm 25% Phúc Khí.' };
  }
  return { ok: false, reason: 'Món này không dùng trực tiếp.' };
}
export const caseBuff = (s, dateStr) => (homeState(s).buffs.case?.date === dateStr ? 0.25 : 0);
