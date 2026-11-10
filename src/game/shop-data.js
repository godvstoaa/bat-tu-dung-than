// ============================================================================
//  Dữ liệu thuần dùng chung giữa interior-build.js (3D) và shop-ui.js (bảng) — dịch vụ và động từ
//  của đồ dùng trong nhà riêng.
// ============================================================================
export const SVC = {
  khaosat: { name: 'Bàn thầy địa lý', verb: 'Mời thầy xem nhà' },
  tindon: { name: 'Bàn gọi rượu', verb: 'Gọi rượu nghe chuyện (20 đồng)' },
  tientrang: { name: 'Quầy Tiền Trang', verb: 'Gửi · rút tiền Tiền Trang' },
  thuoc: { name: 'Quầy thang thuốc', verb: 'Bốc thang thuốc chữa bệnh nhẹ' },
  yquan: { name: 'Y Quán', verb: 'Vào Y Quán — thầy thuốc bắt mạch' },
  thuyetthu: { name: 'Đài thuyết thư', verb: 'Nghe thuyết thư' },
  uongtra: { name: 'Bàn trà', verb: 'Ngồi uống trà' },
  thuengua: { name: 'Quầy thuê ngựa', verb: 'Thuê ngựa đi nhanh' },
  diaoc: { name: 'Sổ địa ốc', verb: 'Xem nhà rao bán' },
  may: { name: 'Quầy may', verb: 'Xem trang phục, phụ kiện' },
  // Phần II (P8–P13)
  cho: { name: 'Chợ ký gửi · Thương hội', verb: 'Ký gửi, mua bán, lò mổ, xay xát' },
  ruong: { name: 'Ruộng & chuồng', verb: 'Thuê thửa ruộng, chuồng nuôi' },
  matbang: { name: 'Mặt bằng thương mại', verb: 'Thuê quầy, quán, tửu lâu' },
  hotich: { name: 'Hộ tịch', verb: 'Cầu hôn, hôn thư, ly hôn' },
  bep: { name: 'Bếp thuê', verb: 'Vào bếp nấu món' },
  beptruong: { name: 'Bếp trưởng', verb: 'Thưa chuyện bếp trưởng, xin làm đồ đệ' },
  thaymenh: { name: 'Thầy mệnh lý', verb: 'Mời thầy xem quẻ · hành nghề' },
};
export const svcInfo = (id) => SVC[id] || { name: id, verb: id };
export const USE_VERB = { teatable: 'Pha trà', desk: 'Ngồi án thư viết chữ', altar: 'Thắp hương bàn thờ', bed: 'Nghỉ tại đây', books: 'Đọc sách', light: 'Thắp / tắt đèn', plant: 'Tưới cây', fish: 'Cho cá ăn', compass: 'Xem phong thủy căn nhà' };
