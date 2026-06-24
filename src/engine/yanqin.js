// ============================================================================
//  演禽 — 28 TÚ HÀNH TINH (二十八宿禽星) + BẢN MỆNH HÀM
//  "Tôi mang 'con vật tinh' nào (本命禽)? Hôm nay禽 nào, hợp/khắc gì?"
//  * Mỗi Tú (宿) gắn 1 HÀM (禽 = con vật tinh): 角木蛟, 亢金龙, ... 轸水蚓 — 28 con.
//    Người sinh ngày thuộc Tú nào → mang BẢN MỆNH HÀM đó (như con giáp nhưng 28-fold).
//  * Mỗi禽 mang 1 thất diệu (七曜: 木/金/土/日/月/火/水) → có ngũ hành →
//    HÀM NGÀY (日禽) sinh/khắc/trùng BẢN MỆNH HÀM → định cát/hung ngày đó với mình.
//  * 演禽 cũng dùng择日: ngày 日禽 thuận bản mệnh = cát, nghịch = hung.
//  Khác ershibaxiu (28 túc cát hung toạ độ): module này = HÀM (con vật) +
//    tính cách + bản mệnh + quan hệ sinh khắc. Nguồn: 禽星易见, 演禽正传, 演禽赋.
// ============================================================================
import { Solar } from 'lunar-javascript';

// 28禽: 宿 → {禽, 七曜, động vật, tính cách, vận thế}
export const QIN_28 = {
  // Đông - Thanh Long (Mộc chính)
  角: { qin: '角木蛟', animal: 'Giao (giao long)', wx: '木', vi: 'Giác', nature: 'cương trực, khởi đầu, sáng tạo — mầm mống lãnh đạo, nghề mở đường' },
  亢: { qin: '亢金龙', animal: 'Long (rồng)', wx: '金', vi: 'Cang', nature: 'phúc duyên thâm hậu, ổn kiện, cao quý — cát tướng phú quý' },
  氐: { qin: '氐土貉', animal: 'Hác (lửng)', wx: '土', vi: 'Đê', nature: 'căn cơ稳固, tụ tài, hàm xúc — giữ của, tích luỹ' },
  房: { qin: '房日兔', animal: 'Thố (thỏ)', wx: '日', vi: 'Phòng', nature: 'hoá hiểm vi bình, ôn hoà thông minh — cát bình an' },
  心: { qin: '心月狐', animal: 'Hồ (cáo)', wx: '月', vi: 'Tâm', nature: 'trí tuệ chính nghĩa, kiên nghị, mưu lược — bậc trí' },
  尾: { qin: '尾火虎', animal: 'Hổ', wx: '火', vi: 'Vĩ', nature: 'uy mãnh, dũng cảm, lãnh tụ — tướng tài, uy' },
  箕: { qin: '箕水豹', animal: 'Báo', wx: '水', vi: 'Cơ', nature: 'linh động, ẩn nhẫn, sứ giả gió — linh hoạt, xuất hành' },
  // Bắc - Huyền Vũ
  斗: { qin: '斗木獬', animal: 'Giải (giải trạch)', wx: '木', vi: 'Đẩu', nature: 'chủ trì công đạo, chính trực (giải trạch xúc tà) — tư pháp, đoàn chính' },
  牛: { qin: '牛金牛', animal: 'Ngưu (trâu)', wx: '金', vi: 'Ngưu', nature: 'cần lao, ổn trọng, phú — phú quý do cần kiệm' },
  女: { qin: '女土蝠', animal: 'Phúc (dơi)', wx: '土', vi: 'Nữ', nature: 'phúc khí (phúc=phúc), ẩn — phúc đức tiềm ẩn' },
  虚: { qin: '虚日鼠', animal: 'Thử (chuột)', wx: '日', vi: 'Hư', nature: 'cơ linh, đa lự, hư — trí lớn, hay lo nghĩ' },
  危: { qin: '危月燕', animal: 'Yến', wx: '月', vi: 'Nguy', nature: 'minh tiệp, tìm cơ trong nguy — cơ hội, cẩn trọng' },
  室: { qin: '室火猪', animal: 'Trư (lợn)', wx: '火', vi: 'Thất', nature: 'phú túc, hậu đạo — phúc hậu, no đủ' },
  壁: { qin: '壁水貐', animal: 'Dữ (dã thú)', wx: '水', vi: 'Bích', nature: 'thủ hộ, văn chương — học vấn, trấn giữ' },
  // Tây - Bạch Hổ
  奎: { qin: '奎木狼', animal: 'Lang (sói)', wx: '木', vi: 'Khuê', nature: 'âm trứ, mưu thâm, chủ văn chương — văn tài, trầm ổn' },
  娄: { qin: '娄金狗', animal: 'Cẩu (chó)', wx: '金', vi: 'Lâu', nature: 'trung thành, thủ hộ, dũng — nghĩa khí, trung tín' },
  胃: { qin: '胃土雉', animal: 'Trĩ (trĩ)', wx: '土', vi: 'Vị', nature: 'hoa lệ, thu tàng — tụ tài, kiêu duyên' },
  昴: { qin: '昴日鸡', animal: 'Kê (gà)', wx: '日', vi: 'Mão', nature: 'hùng kiện, thủ thời, cần — cần mẫn, hùng tráng' },
  毕: { qin: '毕月乌', animal: 'Ô (quạ)', wx: '月', vi: 'Tất', nature: 'thông tuệ, dự cảnh — trí, biết trước' },
  觜: { qin: '觜火猴', animal: 'Hầu (khỉ)', wx: '火', vi: 'Chu', nature: 'cơ linh, đa mưu — linh trí, mưu kế' }, // [cycle 49] 觜=火 (28-曜 tuần tự: 觜火猴), cũ '木' sai cả ngũ hành quan hệ
  参: { qin: '参水猿', animal: 'Viên (vượn)', wx: '水', vi: 'Sâm', nature: 'minh tiệp, bắt chước — khéo léo, học nhanh' },
  // Nam - Chu Tước
  井: { qin: '井木犴', animal: 'Hạn (chó hoả/liêm)', wx: '木', vi: 'Tỉnh', nature: 'liêm chính, thủ pháp, thủ hộ — đoàn chính, giữ luật' },
  鬼: { qin: '鬼金羊', animal: 'Dương (cừu)', wx: '金', vi: 'Quỷ', nature: 'nhu thuận, đa lự, thần bí — mềm mỏng, nhạy' },
  柳: { qin: '柳土獐', animal: 'Chương (hươu)', wx: '土', vi: 'Liễu', nature: 'linh hoạt, y phụ — thích nghi, biết dựa' },
  星: { qin: '星日马', animal: 'Mã (ngựa)', wx: '日', vi: 'Tinh', nature: 'bôn phóng, dịch mã, trình骋 — dịch mã, hành động' },
  张: { qin: '张月鹿', animal: 'Lộc (hươu sao)', wx: '月', vi: 'Trương', nature: 'tường thuỵ, ôn nhã — cát tường, văn nhã' },
  翼: { qin: '翼火蛇', animal: 'Xà (rắn)', wx: '火', vi: 'Dực', nature: 'trí tuệ, linh hoạt, dục — trí, đa kế' },
  轸: { qin: '轸水蚓', animal: 'Ẩn (giun đất)', wx: '水', vi: 'Chẩn', nature: 'ẩn nhẫn, chuyên nghiên, xa chẩn — kiên nhẫn, đào sâu' },
};

// 七曜 → ngũ hành (日→Hoả-dương, 月→Thủy-âm)
const YAO_WX = { 木: '木', 金: '金', 土: '土', 火: '火', 水: '水', 日: '火', 月: '水' };
const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };

/** Lấy 禽 của 1 ngày (dương lịch). */
export function dayQin(year, month, day) {
  const s = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const l = s.getLunar();
  const xiu = l.getXiu();
  const q = QIN_28[xiu] || { qin: xiu, animal: '?', wx: l.getZheng(), vi: xiu, nature: '' };
  return { solar: s.toYmd(), xiu, zheng: l.getZheng(), animal: l.getAnimal(), ...q, wx: YAO_WX[q.wx] || q.wx };
}

/**
 * Bản mệnh禽 (theo ngày sinh) + quan hệ với hôm nay.
 * @param {object} R — analyze()
 */
export function analyzeYanQin(R) {
  const inp = R.chart.input;
  const bm = dayQin(inp.year, inp.month, inp.day);
  const now = new Date();
  const today = dayQin(now.getFullYear(), now.getMonth() + 1, now.getDate());

  // quan hệ hôm nay vs bản mệnh (theo ngũ hành 禽)
  let rel, relVi;
  const bw = bm.wx, tw = today.wx;
  if (bw === tw) { rel = 'tong'; relVi = 'đồng hành (Tỷ) — thuận, cùng tần'; }
  else if (SHENG[tw] === bw) { rel = 'sheng'; relVi = 'HÀM NGÀY SINH bản mệnh (Ấn) — cát, được nâng'; }
  else if (SHENG[bw] === tw) { rel = 'xie'; relVi = 'bản mệnh sinh HÀM NGÀY (Thực) — hao nhẹ nhưng chủ động'; }
  else if (KE[tw] === bw) { rel = 'ke'; relVi = 'HÀM NGÀY KHẮC bản mệnh (Quan) — áp lực, cẩn trọng'; }
  else if (KE[bw] === tw) { rel = 'cai'; relVi = 'bản mệnh khắc HÀM NGÀY (Tài) — nắm chủ động, mệt chút nhưng có lời'; }
  else { rel = '?'; relVi = 'trung tính'; }

  const summary = `Bản mệnh HÀM (ngày sinh ${bm.solar}): ${bm.qin} (${bm.animal}, ${bm.vi}, ${bm.wx}) — ${bm.nature}. ` +
    `Hôm nay ${today.solar}: ${today.qin} (${today.animal}, ${today.wx}). Quan hệ: ${relVi}. ` +
    (rel === 'sheng' || rel === 'tong' ? '→ ngày THUẬN bản mệnh, nên làm việc chính.' : rel === 'ke' ? '→ ngày nghịch bản mệnh, cẩn trọng việc lớn.' : '→ ngày trung bình.') +
    ` 演禽择日: ưu tiên HÀM NGÀY sinh/trùng bản mệnh (Ấn/Tỷ) để khai trương/cưới/ký kết; tránh khắc (Quan).`;

  return { benMing: bm, today, rel, relVi, summary };
}

export { YAO_WX };
