// ============================================================================
//  VIỆC LÀM THEO MỆNH (thuần JS) — hệ số Dụng / Hỷ / Kỵ thần lên thu nhập, hao Tỉnh, tay nghề, rủi ro.
//  P1: việc vặt GÁNH NƯỚC ở Sơn Môn (hành Thủy, chấm trên máy — việc vặt không cần chỗ làm).
//  P2: 5 nghề đợt 1 (mỗi hành một nghề) + bậc tay nghề + chỗ làm có hạn + ca làm; MÁY CHỦ chấm lương
//  (guild-core.js chạy trong worker/guild.js). Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §3.3, §4–§5.
// ============================================================================

/** quan hệ hành nghề với mệnh: 'dung' | 'hy' | 'ky' | 'thuong' */
export function relation(jobWx, yong) {
  if (!yong || !jobWx) return 'thuong';
  if (jobWx === yong.primary) return 'dung';
  if (jobWx === yong.accent) return 'hy';
  if (jobWx === yong.ji) return 'ky';
  return 'thuong';
}
export const REL = {
  dung: { name: 'Dụng thần', pay: 2.0, wake: 1, xp: 1, risk: 0, perfCap: 1.5, note: 'Nghề hợp Dụng thần — thu nhập gấp đôi, hay gặp may.' },
  hy: { name: 'Hỷ thần', pay: 1.3, wake: 0.7, xp: 1.6, risk: 0, perfCap: 1.5, note: 'Nghề hợp Hỷ thần — ít mệt, lên tay nghề nhanh.' },
  thuong: { name: 'Bình thường', pay: 1, wake: 1, xp: 1, risk: 0, perfCap: 1.5, note: 'Nghề bình thường với mệnh của bạn.' },
  ky: { name: 'Kỵ thần', pay: 0.5, wake: 2, xp: 0.5, risk: 0.07, perfCap: 0.6, note: 'Nghề phạm Kỵ thần — mệt gấp đôi, dễ gặp rủi ro, khó khá lên.' },
};
/** giờ hoàng đạo hợp nghề ×1,15 / giờ thường ×1 (main.js biết giờ hoàng đạo của ngày từ todayInfo) */
export const HOUR_LUCK = 1.15;

export const JOBS = {
  ganhnuoc: {
    id: 'ganhnuoc', name: 'Gánh nước', wx: '水', base: 0.36, wakeCost: 0.17, xp: 1,
    desc: 'Múc nước ở giếng ngoài Sơn Môn, gánh về quầy cơm. Đi đều chân thì nước không sánh — chạy là đổ.',
  },
};

/** rủi ro mỗi việc (đặc tả §4.3): 1% + Kỵ 7% + Tỉnh < 20 thêm 5% */
export function riskOf(rel, L) { return 0.01 + REL[rel].risk + (L && L.wake < 20 ? 0.05 : 0); }

/**
 * Tính kết quả một việc. perf 0,3–1,5 (đã chấm), ctx: { yong, lucky (giờ hoàng đạo), workMod (life.mods.work), rand }
 * Trả { pay, wake, xp, rel, mishap: null | 'nga' | 'hong' | 'phat' }
 */
export function settle(job, perf, ctx = {}) {
  const rel = relation(job.wx, ctx.yong), R = REL[rel], rand = ctx.rand || Math.random;
  const p = Math.max(0.3, Math.min(R.perfCap, perf * (ctx.workMod ?? 1)));
  let mishap = null;
  if (rand() < riskOf(rel, ctx.life)) { const r = rand(); mishap = r < 0.4 ? 'nga' : r < 0.8 ? 'hong' : 'phat'; }
  const pay = mishap ? 0 : job.base * p * R.pay * (ctx.lucky ? HOUR_LUCK : 1);
  return { pay, wake: job.wakeCost * R.wake, xp: mishap ? 0 : job.xp * R.xp * p, rel, perf: p, mishap };
}

// --- gánh nước: chấm điểm theo thời gian gánh (so với đi bộ đều) và số lần chạy làm sánh nước
/** perf = 1,0 khi gánh đúng nhịp đi bộ; nhanh hơn (đi tắt) tới 1,2; chậm thì giảm; mỗi giây chạy làm sánh 8% */
export function waterPerf(dist, secs, runSecs, walkSpeed) {
  const expect = dist / (walkSpeed * 0.8);
  const time = Math.max(0.3, Math.min(1.2, expect / Math.max(1, secs) * 1.05));
  const spill = Math.max(0, 1 - runSecs * 0.08);
  return Math.max(0.3, time * spill);
}

// ============================================================================
//  P2 — NGHỀ ĐỢT 1, BẬC TAY NGHỀ, CHỖ LÀM, CA LÀM (thuần — client hiển thị, máy chủ chấm)
// ============================================================================
/** ngũ hành tương sinh: X sinh SINH[X] */
export const SINH = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };

/**
 * 5 nghề đợt 1 (§4.2). base = văn / việc ở hiệu suất 1,0, Học việc ×0,8, mệnh bình thường:
 * 2 ca × 8 việc ≈ 80–85 văn (đúng «bẫy thu nhập» §3.2). wake / full = Tỉnh / No hao mỗi việc (trước hệ số mệnh).
 * minSec = thời gian tối thiểu một việc (máy chủ chặn nhanh hơn). Phu tính theo quãng đường.
 */
export const WORK = {
  bep: { id: 'bep', name: 'Đầu bếp tửu lâu', wx: '火', shop: 'tuu', base: 6.5, wake: 2.5, full: 2, minSec: 20, game: 'fire', icon: '🍳', verb: 'Đứng bếp', desc: 'Canh lửa lò theo phiếu món: quạt cho lửa lên, buông cho lửa hạ, giữ kim nhiệt trong vùng xanh.' },
  phu: { id: 'phu', name: 'Phu dịch trạm', wx: '水', shop: 'dichtram', base: 7.5, wake: 3, full: 3, minSec: 0, game: 'deliver', icon: '📦', verb: 'Nhận hàng', desc: 'Nhận kiện hàng, áp sang dịch trạm kế bên theo đường vành. Đang áp hàng thì không cưỡi ngựa trạm, không ngự kiếm.' },
  boc: { id: 'boc', name: 'Bốc thuốc', wx: '木', shop: 'duoc', base: 6, wake: 2, full: 1.5, minSec: 14, game: 'herbs', icon: '🌿', verb: 'Bốc thang thuốc', desc: 'Đọc toa của lang trung, nhớ vị thuốc rồi bốc đúng ngăn tủ. Bốc nhầm thì trừ điểm.' },
  mo: { id: 'mo', name: 'Thợ mỏ', wx: '金', shop: null, place: 'mine', base: 6.5, wake: 3.5, full: 3, minSec: 8, game: 'ore', icon: '⛏', verb: 'Đào quặng', desc: 'Xuống Mỏ Dân Sự Khoáng Sơn bằng xe goòng ở Lò Rèn. Gõ búa đúng nhịp để tách quặng; mạch nào cạn thì chờ mạch hồi.' },
  gom: { id: 'gom', name: 'Thợ gốm', wx: '土', shop: 'gom', base: 6.5, wake: 2.5, full: 2, minSec: 16, game: 'wheel', icon: '🏺', verb: 'Ngồi bàn xoay', desc: 'Vuốt đất trên bàn xoay: chạm đúng lúc vạch chạy qua tâm, vòng sau tâm hẹp dần.' },

  // --- P7: nghề ở các loại tiệm còn lại (mỗi loại tiệm một nghề; mini-game dùng lại 4 trò có chủ đề riêng) ---
  den: { id: 'den', name: 'Thợ đèn lồng', wx: '火', shop: 'den', base: 6.5, wake: 2, full: 1.5, minSec: 14, game: 'herbs', icon: '🏮', verb: 'Dán đèn', desc: 'Nhớ mẫu hoa văn của đơn đặt rồi dán đúng ô giấy lụa.', theme: { label: 'MẪU HOA VĂN', unit: 'Đã dán', items: [['Mẫu đơn', '火'], ['Hạc bay', '金'], ['Song long', '木'], ['Phượng hoàng', '火'], ['Sen hồng', '水'], ['Cá chép', '水'], ['Mây cuộn', '土'], ['Hồi văn', '土'], ['Trúc xanh', '木'], ['Cúc vàng', '金'], ['Thọ tự', '土'], ['Phúc tự', '火'], ['Lan rừng', '木'], ['Sóng nước', '水'], ['Bát quái', '金'], ['Đèn kéo quân', '火']], hint: 'Nhớ 4 hoa văn của đơn (hiện 4 giây), rồi chạm đúng 4 ô giấy. Dán nhầm bị trừ điểm.' } },
  huong: { id: 'huong', name: 'Thợ hương', wx: '火', shop: 'huong', base: 6.5, wake: 2, full: 1.5, minSec: 16, game: 'fire', icon: '🪔', verb: 'Trộn hương', desc: 'Trộn bột trầm, quế, đàn theo tỉ lệ — giữ kim tỉ lệ trong vùng xanh của từng mẻ.', theme: { items: ['Trầm hương mẻ sớm', 'Hương quế cúng rằm', 'Đàn hương thượng hạng', 'Hương vòng Sơn Môn', 'Nhang trầm Kỳ Nam'], hint: 'Giữ nút để rắc thêm bột trầm, buông để bột lắng. Giữ kim tỉ lệ trong vùng xanh của từng mẻ hương.', button: 'Giữ để rắc bột' } },
  tra: { id: 'tra', name: 'Pha trà trà lâu', wx: '水', shop: 'tralau', base: 6, wake: 1.5, full: 1, minSec: 16, game: 'fire', icon: '🍵', verb: 'Pha trà', desc: 'Canh nhiệt nước sôi cho từng loại trà — trà xanh nước nhẹ, trà ô long nước già.', theme: { items: ['Long Tỉnh sớm xuân', 'Thiết Quan Âm', 'Phổ Nhĩ lâu năm', 'Bạch Mẫu Đơn', 'Trà sen Tây Hồ'], hint: 'Giữ để thêm lửa, buông để nước nguội. Giữ kim nhiệt trong vùng xanh của từng ấm trà.', button: 'Giữ để thêm lửa' } },
  cantra: { id: 'cantra', name: 'Cân trà Trà Trang', wx: '水', shop: 'tratrang', base: 6, wake: 2, full: 1.5, minSec: 10, game: 'ore', icon: '⚖', verb: 'Cân trà', desc: 'Cân trà gói cho khách: dừng quả cân đúng vạch lạng, không thừa không thiếu.', theme: { title: '⚖ Cân trà · Trà Trang', hint: 'Kim cân chạy lên xuống. Chạm khi kim rơi đúng vạch vàng (đúng lạng khách gọi). 3 gói một lượt.', button: 'Chốt cân' } },
  may: { id: 'may', name: 'Thợ may', wx: '木', shop: 'may', base: 6.5, wake: 2, full: 1.5, minSec: 16, game: 'wheel', icon: '🧵', verb: 'Cắt may', desc: 'Cắt vải theo đường phấn — kéo đi qua vạch thì chạm, đường cắt hẹp dần ở đường viền.', theme: { title: '🧵 Cắt vải · Thợ may', hint: 'Chạm khi lưỡi kéo đi qua đường phấn sáng. 6 nhát, đường viền hẹp dần — càng sát phấn áo càng vừa.', button: 'Cắt' } },
  vuon: { id: 'vuon', name: 'Người làm vườn', wx: '木', shop: 'hoavien', base: 6, wake: 2, full: 2, minSec: 12, game: 'herbs', icon: '🌸', verb: 'Chăm vườn', desc: 'Đọc lịch tỉa của chủ vườn, nhớ 4 cây cần tỉa hôm nay rồi tỉa đúng cây.', theme: { label: 'LỊCH TỈA HÔM NAY', unit: 'Đã tỉa', items: [['Tùng la hán', '木'], ['Mai chiếu thủy', '木'], ['Đào phai', '火'], ['Lan hồ điệp', '木'], ['Cúc đại đóa', '金'], ['Sen đá', '土'], ['Trúc phú quý', '木'], ['Hồng nhung', '火'], ['Sung cảnh', '土'], ['Si đa', '土'], ['Thủy tiên', '水'], ['Nguyệt quế', '金'], ['Ngọc lan', '金'], ['Bèo tấm', '水'], ['Mẫu đơn', '火'], ['Linh sam', '水']], hint: 'Nhớ 4 cây cần tỉa (hiện 4 giây), rồi chạm đúng 4 cây trong vườn. Tỉa nhầm cây quý bị trừ điểm.' } },
  moc: { id: 'moc', name: 'Thợ mộc', wx: '木', shop: 'moc', base: 6.5, wake: 2.5, full: 2, minSec: 16, game: 'wheel', icon: '🪚', verb: 'Cưa bào', desc: 'Cưa theo đường mực: lưỡi cưa qua vạch thì chạm, mộng càng khít càng được giá.', theme: { title: '🪚 Cưa theo mực · Thợ mộc', hint: 'Chạm khi lưỡi cưa đi qua đường mực. 6 nhát, mộng hẹp dần — sát mực thì mộng khít.', button: 'Cưa' } },
  chep: { id: 'chep', name: 'Chép sách Thư Họa Các', wx: '木', shop: 'thuhoa', base: 6, wake: 2, full: 1, minSec: 14, game: 'herbs', icon: '🖌', verb: 'Chép sách', desc: 'Nhìn bản mẫu, nhớ 4 chữ rồi viết đúng ô trên giấy dó.', theme: { label: 'BẢN MẪU', unit: 'Đã chép', items: [['天 Thiên', '金'], ['地 Địa', '土'], ['人 Nhân', '木'], ['和 Hòa', '土'], ['德 Đức', '火'], ['道 Đạo', '水'], ['福 Phúc', '火'], ['壽 Thọ', '土'], ['仁 Nhân', '木'], ['義 Nghĩa', '金'], ['禮 Lễ', '火'], ['智 Trí', '水'], ['信 Tín', '土'], ['心 Tâm', '火'], ['靜 Tĩnh', '水'], ['命 Mệnh', '金']], hint: 'Nhớ 4 chữ trong bản mẫu (hiện 4 giây), rồi viết đúng 4 ô. Viết sai chữ bị trừ điểm.' } },
  ren: { id: 'ren', name: 'Thợ rèn', wx: '金', shop: 'loren', base: 7, wake: 3, full: 2.5, minSec: 10, game: 'ore', icon: '🔨', verb: 'Rèn sắt', desc: 'Nện búa khi thanh sắt đỏ đúng độ — rèn cuốc, dao mổ, móng ngựa cho cả thành.', theme: { title: '🔨 Nện búa · Thợ rèn', hint: 'Lực búa chạy lên xuống. Nện khi kim rơi vào vạch vàng (sắt đỏ đúng độ). 3 nhát thành một món.', button: 'Nện búa' } },
  moigioi: { id: 'moigioi', name: 'Môi giới nhà đất', wx: '土', shop: 'namon', base: 6.5, wake: 2, full: 1, minSec: 14, game: 'herbs', icon: '📜', verb: 'Dẫn khách xem nhà', desc: 'Nhớ yêu cầu của khách (4 điều) rồi chọn đúng 4 căn hợp ý trong sổ địa ốc.', theme: { label: 'KHÁCH CẦN', unit: 'Đã chọn', items: [['Hướng Nam', '火'], ['Gần chợ', '金'], ['Sân rộng', '土'], ['Có giếng', '水'], ['Gần kênh', '水'], ['Hai tầng', '土'], ['Vườn cây', '木'], ['Gần trường', '木'], ['Phố yên tĩnh', '水'], ['Mặt tiền', '金'], ['Giá mềm', '土'], ['Gần đền', '火'], ['Tường cao', '金'], ['Lối xe ngựa', '火'], ['Hướng Đông', '木'], ['Có hồ cá', '水']], hint: 'Nhớ 4 điều khách cần (hiện 4 giây), rồi chọn đúng 4 căn thỏa điều ấy. Chọn sai khách phật ý.' } },
  phongthuy: { id: 'phongthuy', name: 'Thầy phong thủy (phụ việc)', wx: '土', shop: 'phongthuy', base: 7, wake: 2, full: 1, minSec: 12, game: 'ore', icon: '🧭', verb: 'Xem hướng', desc: 'Cầm la bàn đo hướng cho nhà khách: dừng kim đúng cung cát.', theme: { title: '🧭 La bàn · Thầy phong thủy', hint: 'Kim la bàn dao động. Chạm khi kim rơi đúng vạch vàng (cung cát của nhà). 3 hướng một lượt.', button: 'Chốt hướng' } },
  // --- P7 (tiếp): 15 nghề làm ngoài tiệm — nơi làm ở jobzones.js (không giữ chỗ, giới hạn theo ca / ngày) ---
  kephat: { id: 'kephat', name: 'Kép hát gánh hát', wx: '火', shop: null, zone: true, base: 7, wake: 2.5, full: 2, minSec: 16, game: 'wheel', icon: '🎭', verb: 'Lên sân khấu', desc: 'Hát theo nhịp phách ở Ca Đài cung Đoài — gõ đúng nhịp trống, khán giả thưởng.', theme: { title: '🎭 Nhịp phách · Ca Đài', hint: 'Chạm khi phách gõ qua vạch sáng. 6 câu hát, nhịp nhanh dần — đúng nhịp thì khán giả vỗ tay.', button: 'Gõ phách' } },
  lodan: { id: 'lodan', name: 'Giữ lò luyện đan', wx: '火', shop: null, zone: true, base: 7, wake: 3, full: 2, minSec: 18, game: 'fire', icon: '⚗', verb: 'Giữ lửa lò', desc: 'Canh lửa văn / lửa võ cho Cửu Chuyển Đan Lô theo từng giai đoạn luyện đan.', theme: { items: ['Hồi Khí Đan · lửa văn', 'Tẩy Tủy Đan · lửa võ', 'Ngưng Thần Đan · lửa văn', 'Trúc Cơ Đan · lửa võ', 'Thanh Tâm Đan · lửa văn'], hint: 'Giữ để thổi lửa, buông cho lửa lắng. Giữ kim nhiệt đúng vùng xanh của từng giai đoạn — lệch thì đan cháy.', button: 'Giữ để thổi lửa' } },
  phaohoa: { id: 'phaohoa', name: 'Pháo hoa lễ hội', wx: '火', shop: null, zone: true, base: 7, wake: 2, full: 1.5, minSec: 10, game: 'ore', icon: '🎆', verb: 'Bắn pháo hoa', desc: 'Chỉ có ca vào đêm rằm (18–23 giờ): châm ngòi đúng nhịp nhạc hội ở phố chợ Cảnh Môn.', theme: { title: '🎆 Châm ngòi · Hội rằm', hint: 'Kim nhịp chạy lên xuống. Châm ngòi khi kim rơi vào vạch vàng — đúng nhịp nhạc thì pháo nở đẹp.', button: 'Châm ngòi' } },
  laido: { id: 'laido', name: 'Lái đò · thuyền hoa', wx: '水', shop: null, zone: true, base: 7, wake: 2.5, full: 2, minSec: 16, game: 'fire', icon: '🛶', verb: 'Chèo đò', desc: 'Đón khách ở bến hào / bến kênh, chèo theo luồng nước — giữ mũi thuyền giữa luồng.', theme: { items: ['Bến Cảnh Môn → cầu Ly', 'Hào Hưu Môn → Khảm Thủy', 'Kênh Tốn → cầu Phong', 'Kênh Khảm → Hậu Sơn', 'Hào Đông → bến Chấn'], hint: 'Giữ để chèo mạnh, buông để thả trôi. Giữ mũi thuyền trong luồng xanh của từng chặng.', button: 'Giữ để chèo' } },
  nguphu: { id: 'nguphu', name: 'Ngư phủ', wx: '水', shop: null, zone: true, base: 6.5, wake: 2.5, full: 2.5, minSec: 12, game: 'ore', icon: '🎣', verb: 'Thả lưới', desc: 'Thả lưới thuê cho các bến sông Huyền Hà và hồ Cùng Thông theo con nước.', theme: { title: '🎣 Thả lưới · Bến sông', hint: 'Phao chạy lên xuống theo con nước. Kéo lưới khi phao rơi vào vạch vàng (luồng cá). 3 mẻ một lượt.', button: 'Kéo lưới' } },
  buonmuoi: { id: 'buonmuoi', name: 'Buôn muối · xuất nhập', wx: '水', shop: null, zone: true, base: 7, wake: 2, full: 1, minSec: 14, game: 'herbs', icon: '🧂', verb: 'Lên đơn hàng', desc: 'Đọc bảng giá Diêm Thị cung Đoài, nhớ 4 mặt hàng đang rẻ rồi gom đúng hàng.', theme: { label: 'BẢNG GIÁ ĐANG RẺ', unit: 'Đã gom', items: [['Muối bể', '水'], ['Muối mỏ', '土'], ['Nước mắm', '水'], ['Cá khô', '水'], ['Tương', '土'], ['Gạo', '土'], ['Vải bông', '木'], ['Chè búp', '木'], ['Gốm Khôn', '土'], ['Sắt thỏi', '金'], ['Đồng thỏi', '金'], ['Hương trầm', '火'], ['Đèn dầu', '火'], ['Thuốc bắc', '木'], ['Lụa Đoài', '金'], ['Rượu nếp', '水']], hint: 'Nhớ 4 mặt hàng đang rẻ (hiện 4 giây), rồi gom đúng 4 kiện. Gom nhầm hàng đắt thì lỗ.' } },
  hamruou: { id: 'hamruou', name: 'Ủ rượu hầm tửu lâu', wx: '水', shop: null, zone: true, base: 6.5, wake: 2, full: 1.5, minSec: 16, game: 'fire', icon: '🍶', verb: 'Ủ rượu', desc: 'Giữ nhiệt hầm ủ cho từng mẻ rượu trong mọi Tửu Lâu (không cần giữ chỗ).', theme: { items: ['Rượu nếp cái hoa vàng', 'Rượu sen Tây Hồ', 'Hoàng tửu ba năm', 'Rượu ngô men lá', 'Bồ đào tửu Tây Vực'], hint: 'Giữ để ủ ấm, buông để hầm mát. Giữ kim nhiệt trong vùng xanh của từng chum.', button: 'Giữ để ủ ấm' } },
  tieuphu: { id: 'tieuphu', name: 'Tiều phu', wx: '木', shop: null, zone: true, base: 7, wake: 3.5, full: 3, minSec: 14, game: 'wheel', icon: '🪓', verb: 'Đốn củi', desc: 'Vào rừng ngoài thành (Nam Hoang, Đông Lĩnh) đốn cây già được phép — vung rìu đúng vết.', theme: { title: '🪓 Đốn củi · Rừng ngoài thành', hint: 'Chạm khi lưỡi rìu đi qua vết đẽo sáng. 6 nhát, vết hẹp dần — trúng vết thì cây đổ đúng hướng.', button: 'Vung rìu' } },
  kimhoan: { id: 'kimhoan', name: 'Thợ kim hoàn', wx: '金', shop: null, zone: true, base: 7, wake: 2, full: 1, minSec: 16, game: 'herbs', icon: '💍', verb: 'Khảm ngọc', desc: 'Nhớ mẫu khảm của đơn đặt rồi gắn đúng viên ngọc vào ổ ở Kim Hoàn Phố cung Càn.', theme: { label: 'MẪU KHẢM', unit: 'Đã khảm', items: [['Hồng ngọc', '火'], ['Lục bảo', '木'], ['Lam ngọc', '水'], ['Bạch ngọc', '金'], ['Hoàng ngọc', '土'], ['Mã não', '火'], ['Phỉ thúy', '木'], ['Trân châu', '水'], ['Thạch anh', '金'], ['Hổ phách', '土'], ['San hô', '火'], ['Ngọc bích', '木'], ['Kim cương', '金'], ['Mắt mèo', '土'], ['Thủy tinh', '水'], ['Ngọc trai đen', '水']], hint: 'Nhớ 4 viên trong mẫu khảm (hiện 4 giây), rồi gắn đúng 4 ổ. Gắn nhầm phải tháo lại, trừ điểm.' } },
  thungan: { id: 'thungan', name: 'Thu ngân Tiền Trang', wx: '金', shop: null, zone: true, base: 7, wake: 2, full: 1, minSec: 14, game: 'herbs', icon: '🪙', verb: 'Kiểm bạc', desc: 'Ngồi quầy Tiền Trang (Dịch Trạm, Nha Môn Địa Ốc): nhớ 4 dấu triện thật rồi loại bạc giả.', theme: { label: 'DẤU TRIỆN THẬT', unit: 'Đã kiểm', items: [['Triện Càn Nguyên', '金'], ['Triện Khôn Điền', '土'], ['Triện Ly Hỏa', '火'], ['Triện Khảm Thủy', '水'], ['Triện Chấn Lôi', '木'], ['Triện Tốn Phong', '木'], ['Triện Cấn Sơn', '土'], ['Triện Đoài Trạch', '金'], ['Ấn Huyền Thành', '金'], ['Ấn Thương hội', '土'], ['Ấn Dịch trạm', '水'], ['Ấn Nha Môn', '火'], ['Dấu Kim Hoàn', '金'], ['Dấu Tiền Trang', '金'], ['Dấu Diêm Thị', '水'], ['Dấu Ngân khố', '土']], hint: 'Nhớ 4 dấu triện thật (hiện 4 giây), rồi chọn đúng 4 nén bạc mang dấu ấy. Nhận nhầm bạc giả thì đền.' } },
  baotieu: { id: 'baotieu', name: 'Bảo tiêu · hộ vệ', wx: '金', shop: null, zone: true, base: 7, wake: 3.5, full: 3, minSec: 10, game: 'ore', icon: '🛡', verb: 'Áp tiêu', desc: 'Hộ tống xe hàng ở 8 cổng Ngoại Thành — đỡ đòn cướp đường đúng lúc.', theme: { title: '🛡 Đỡ đòn · Áp tiêu', hint: 'Lực đỡ chạy lên xuống. Vung binh khí khi kim rơi vào vạch vàng (sơ hở của cướp). 3 hiệp một chuyến.', button: 'Vung binh khí' } },
  nhadich: { id: 'nhadich', name: 'Nha dịch · cai ngục', wx: '金', shop: null, zone: true, base: 7, wake: 3, full: 2, minSec: 14, game: 'herbs', icon: '🏮', verb: 'Tuần phố', desc: 'Nhận lệnh ở Nha Môn: nhớ mặt 4 kẻ bị truy nã rồi nhận diện đúng trong đám đông.', theme: { label: 'BẢNG TRUY NÃ', unit: 'Đã bắt', items: [['Sẹo má trái', '金'], ['Râu quai nón', '木'], ['Mắt lé', '水'], ['Tóc bạc sớm', '金'], ['Thẹo trán', '火'], ['Môi sứt', '土'], ['Mũi khoằm', '金'], ['Tai vểnh', '木'], ['Nốt ruồi cằm', '土'], ['Lông mày rậm', '木'], ['Răng vàng', '金'], ['Chân thọt', '土'], ['Tay chín ngón', '火'], ['Đầu trọc', '水'], ['Hình xăm rồng', '火'], ['Giọng khàn', '水']], hint: 'Nhớ 4 đặc điểm kẻ truy nã (hiện 4 giây), rồi chỉ đúng 4 người. Bắt nhầm người lương thiện bị phạt.' } },
  thoxay: { id: 'thoxay', name: 'Thợ xây · tu bổ', wx: '土', shop: null, zone: true, base: 7, wake: 3.5, full: 3, minSec: 14, game: 'wheel', icon: '🧱', verb: 'Xây tường', desc: 'Tu bổ cổng Trung Thành — đặt gạch theo dây dọi, mạch vữa đều.', theme: { title: '🧱 Đặt gạch · Công trường', hint: 'Chạm khi viên gạch đi qua dây dọi sáng. 6 hàng, mạch hẹp dần — thẳng dây thì tường vững.', button: 'Đặt gạch' } },
  nongphu: { id: 'nongphu', name: 'Nông phu linh điền', wx: '土', shop: null, zone: true, base: 6.5, wake: 3, full: 3, minSec: 14, game: 'wheel', icon: '🌾', verb: 'Cày gieo', desc: 'Làm thuê ở linh điền Khôn cung: cày luống, gieo hạt đúng hàng.', theme: { title: '🌾 Cày luống · Linh điền', hint: 'Chạm khi lưỡi cày đi qua vạch luống. 6 luống, luống hẹp dần — thẳng luống thì lúa tốt.', button: 'Cày' } },
  thoda: { id: 'thoda', name: 'Thợ đá khắc bia', wx: '土', shop: null, zone: true, base: 7, wake: 3, full: 2, minSec: 16, game: 'wheel', icon: '🪨', verb: 'Khắc bia', desc: 'Khắc chữ lên bia đá ở Trấn Sơn Bảo Tháp cung Cấn — đục theo nét mực.', theme: { title: '🪨 Khắc bia · Trấn Sơn', hint: 'Chạm khi mũi đục đi qua nét mực. 6 nét, nét mảnh dần — đục trúng nét thì chữ sắc.', button: 'Đục' } },
};
/** loại tiệm → nghề tuyển; Lò Rèn không tuyển (đợt 1) nhưng có xe goòng xuống mỏ dân sự */
export const JOB_OF_SHOP = { tuu: 'bep', dichtram: 'phu', duoc: 'boc', gom: 'gom', den: 'den', huong: 'huong', tralau: 'tra', tratrang: 'cantra', may: 'may', hoavien: 'vuon', moc: 'moc', thuhoa: 'chep', loren: 'ren', namon: 'moigioi', phongthuy: 'phongthuy' };
export const MINE_SHOP = 'loren';

/** bậc tay nghề (§4.7) — Quản sự cần uy tín ≥ 60 và không phải nghề Kỵ; nghề Kỵ dừng ở Thợ */
export const RANKS = [
  { id: 0, name: 'Học việc', skill: 0, pay: 0.8 },
  { id: 1, name: 'Thợ', skill: 100, pay: 1.0 },
  { id: 2, name: 'Thợ cả', skill: 400, pay: 1.25 },
  { id: 3, name: 'Quản sự', skill: 1200, pay: 1.5, rep: 60 },
];
export function rankOf(skill = 0, rep = 50, rel = 'thuong') {
  let r = 0;
  for (const R of RANKS) if (skill >= R.skill && (!R.rep || rep >= R.rep)) r = R.id;
  return rel === 'ky' ? Math.min(r, 1) : r;
}
/** số chỗ mỗi tiệm theo bậc [Học việc, Thợ, Thợ cả, Quản sự] (§5.1) */
export const SEATS = { tuu: [3, 3, 1, 1], dichtram: [2, 3, 1, 1], duoc: [2, 2, 1, 1], gom: [2, 2, 1, 0], den: [2, 2, 1, 0], huong: [2, 2, 1, 0], tralau: [2, 2, 1, 1], tratrang: [2, 2, 1, 0], may: [2, 2, 1, 1], hoavien: [2, 2, 1, 0], moc: [2, 2, 1, 1], thuhoa: [2, 2, 1, 0], loren: [2, 2, 1, 1], namon: [1, 2, 1, 1], phongthuy: [1, 1, 1, 1] };

/** luật ca (§5.2) */
export const SHIFT = {
  tasks: 8,                  // tối đa 8 việc một ca
  ms: 30 * 60000,            // ca dài tối đa 30 phút
  minFull: 4,                // tan ca trước giờ với < 4 việc = bỏ ca
  quitPay: 0.5, quitRep: -5, // bỏ ca: nhận 50%, uy tín −5
  doneRep: 1,                // ca trọn: uy tín +1
  perDay: 3,                 // tối đa 3 ca mỗi ngày (giờ Việt Nam)
  holdMs: 3 * 86400000,      // giữ chỗ 3 ngày, gia hạn được khi vẫn đi làm đều
  idleMs: 24 * 3600000,      // quá 24 giờ không vào ca → mất chỗ
  idleRep: -3,
  maxTaskMs: 10 * 60000,     // một việc quá 10 phút thì bỏ, giao việc mới
  phuSpeed: 12,              // m/s — nhanh nhất có thể (chạy + Tốc Hành Tán); nhanh hơn = gian
};

/** điểm mini-game 0–1 → hiệu suất 0,3–1,5 (§4.5) */
export const perfOf = (score) => 0.3 + 1.2 * Math.max(0, Math.min(1, Number(score) || 0));
/** cung (hành của phường đặt tiệm) trùng hoặc sinh hành nghề → +10% (§4.1) */
export const palaceBonus = (guaWx, jobWx) => (guaWx && (guaWx === jobWx || SINH[guaWx] === jobWx) ? 1.1 : 1);
/** rủi ro mỗi việc (§4.3): 1% + Kỵ 7% + Tỉnh < 20 thêm 5% + đang bệnh 5% */
export const riskP = (rel, f = {}) => 0.01 + REL[rel].risk + (f.wakeLow ? 0.05 : 0) + (f.sick ? 0.05 : 0);

/**
 * Tiền một việc (§3.3): base × hiệu suất × hệ số mệnh × hệ số bậc × cung × (bệnh 0,7).
 * Dụng thần ở bậc Thợ cả trở lên ×2,5. Chuỗi 5 việc tốt +0,1 hiệu suất; Tỉnh < 30 −0,2. Kỵ thần trần hiệu suất 0,6.
 */
export function taskPay(job, score, o = {}) {
  const rel = o.rel || 'thuong', R = REL[rel], rank = o.rank | 0;
  let perf = perfOf(score) + ((o.chain | 0) >= 5 ? 0.1 : 0) - (o.wakeLow30 ? 0.2 : 0);
  perf = Math.max(0.3, Math.min(R.perfCap, perf));
  const relPay = rel === 'dung' && rank >= 2 ? 2.5 : R.pay;
  const pay = job.base * perf * relPay * RANKS[rank].pay * (o.palace || 1) * (o.sick ? 0.7 : 1);
  return { perf, pay, xp: R.xp * perf };
}

/** nhịp quá đều (độ lệch chuẩn thời gian 6 việc gần nhất < 0,12 giây) → nghi treo máy / bot (§4.5) */
export function botLike(durs) {
  const d = (durs || []).slice(-6);
  if (d.length < 6) return false;
  const m = d.reduce((a, b) => a + b, 0) / d.length;
  const sd = Math.sqrt(d.reduce((a, b) => a + (b - m) ** 2, 0) / d.length);
  return sd < 120;
}
/** điểm «đẹp quá»: ≥ 8 trong 10 việc gần nhất tuyệt đối → nghi sửa điểm, kẹp 0,85 (§9) */
export const tooPerfect = (scores) => (scores || []).slice(-10).filter((s) => s >= 0.99).length >= 8;
/** ngày theo giờ Việt Nam (UTC+7) — đếm số ca mỗi ngày trên máy chủ */
export const vnDay = (now = Date.now()) => new Date(now + 7 * 3600000).toISOString().slice(0, 10);
