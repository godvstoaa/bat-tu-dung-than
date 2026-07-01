// ============================================================================
//  ĐÔNG Y / Y HỌC CỔ TRUYỀN 中医 — Ngũ hành ↔ Tạng phủ ↔ Khí vượng suy ↔ Dược lý
//  [loop 1021] Nguồn: «Hoàng Đế Nội Kinh» (素问·阴阳应象大论 / 金匮真言论 / 至真要大论).
//    Mỗi ngũ hành ↔ 1 tạng (脏) + 1 phủ (腑) + ngũ vị/ngũ sắc/ngũ chí/ngũ quan/ngũ thể.
//    Khí vượng (mạnh) → tạng THỰC (ứ/dư); khí suy (yếu) → tạng HƯ (thiếu) → dễ bệnh.
//    Dược lý: ngũ vị/ngũ sắc nhập tạng (酸→肝, 苦→心, 甘→脾, 辛→肺, 咸→肾) + thực疗.
//  Tích hợp BaZi: từ ngũ hành vượng suy của lá số → đoán tạng yếu/mạnh + lời khuyên đông y.
// ============================================================================
import { GAN, ZHI } from './constants.js';
import { changSheng } from './core.js';
import { STAGE_WEIGHT, STAGE_VI } from './dayun-changsheng.js'; // [loop 1086] decade health arc

// ---- Ngũ hành ↔ Tạng phủ + thuộc tính (Hoàng Đế Nội Kinh) ----
export const WUX_ZANG = {
  木: {
    zang: '肝 (Gan)', fu: '胆 (Mật)', wei: '酸 (chua)', se: '青 (xanh)', zhi: '怒 (giận)', guan: '目 (mắt)', ti: '筋 (gân)', season: 'Xuân (mùa xuân)',
    xu: ['肝血虚 — mắt mờ/choáng váng, móng mềm, kinh nguyệt ít, hay co giật cơ/mỏi cổ vai gáy',
         '肝阴虚 — mắt khô, hoa mắt, khô họng, nóng trong'],
    shi: ['肝火旺 — hay cáu gắt, mặt mắt đỏ, đau đầu, mất ngủ, miệng đắng, tai ù',
          '肝阳上亢 — chóng mặt căng đầu, cao huyết áp, bứt rứt'],
    disease: 'gan/mật, đau đầu, cao HA, mắt, kinh nguyệt, căng thẳng, cơ cổ vai gáy',
    nourish: 'Bổ gan huyết: gan động vật, rau xanh (rau ngót, rau má), atiso, táo đỏ, kỷ tử; dưỡng huyết + sơ uất.',
  },
  火: {
    zang: '心 (Tim)', fu: '小肠 (Tiểu trường)', wei: '苦 (đắng)', se: '赤 (đỏ)', zhi: '喜 (vui)', guan: '舌 (lưỡi)', ti: '脉 (mạch)', season: 'Hạ (mùa hè)',
    xu: ['心气虚 — hồi hộp, thở hụt, mệt mỏi, hay vã mồ hôi, mất ngủ',
         '心血虚 — hồi hộp trống ngực, choáng, mất ngủ hay mơ,mặt nhợt nhạt'],
    shi: ['心火旺 — lở miệng/lưỡi, mất ngủ bồn chồn, tiểu vàng đỏ, mặt đỏ'],
    disease: 'tim/hồi hộp, mất ngủ, tâm thần, lưỡi/miệng, huyết áp',
    nourish: 'Dưỡng tâm an thần: sen tâm (liên tử tâm), táo đỏ, long nhãn, bột sen, chè hạt sen; thanh tâm hoả.',
  },
  土: {
    zang: '脾 (Tỳ)', fu: '胃 (Vị)', wei: '甘 (ngọt)', se: '黄 (vàng)', zhi: '思 (lo nghĩ)', guan: '口 (miệng)', ti: '肉 (cơ/thịt)', season: 'Trường hạ (cuối hạ)',
    xu: ['脾气虚 — mệt mỏi, chán ăn, đầy bụng, phân lỏng, nói yếu',
         '脾阳虚 — bụng lạnh đau, phân lỏng, lạnh tay chân, phù nhẹ'],
    shi: ['脾胃湿热 — đầy bụng, đắng miệng, phân dính/nhớt, mụn trứng cá',
          '湿困脾 — nặng người, buồn ngủ, chán ăn, phù'],
    disease: 'tiêu hoá/dạ dày, mệt mỏi, phù, đường huyết, cơ thể nặng nề',
    nourish: 'Kiện tỳ vị: khoai lang, gạo tẻ/yến mạch, táo đỏ, hạt ý dĩ (ý dĩ), gừng; tránh sinh lạnh.',
  },
  金: {
    zang: '肺 (Phổi)', fu: '大肠 (Đại trường)', wei: '辛 (cay)', se: '白 (trắng)', zhi: '悲 (buồn)', guan: '鼻 (mũi)', ti: '皮 (da)', season: 'Thu (mùa thu)',
    xu: ['肺气虚 — thở hụt, hay cảm, vã mồ hôi, nói/khẽ giọng, mệt',
         '肺阴虚 — khô họng, ho khan ít đờm, đổ mồ hôi trộm'],
    shi: ['肺热 — ho đờm vàng đặc, đau họng, sốt nhẹ, khát',
          '痰湿蕴肺 — ho nhiều đờm trắng, khò khè, tức ngực'],
    disease: 'phổi/hô hấp, da/chân lông, ho, mũi/viêm xoang, đại tiện',
    nourish: 'Nhuận phổi: lê (đường phèn), củ mây, bách hợp, mộc nhĩ trắng, hạnh nhân; tránh khô lạnh.',
  },
  水: {
    zang: '肾 (Thận)', fu: '膀胱 (Bàng quang)', wei: '咸 (mặn)', se: '黑 (đen)', zhi: '恐 (sợ)', guan: '耳 (tai)', ti: '骨 (xương)', season: 'Đông (mùa đông)',
    xu: ['肾阴虚 — thắt lưng/đầu gối mỏi, choáng tai ù, mất ngủ nhiều mơ, nóng trong/bốc hoả, di tinh/sớm xuất, khát khô, gò má đỏ lưỡi',
         '肾阳虚 — thắt lưng/đầu gối lạnh đau, sợ lạnh tay chân, liệt dương, tiểu đêm nhiều, mệt mỏi, hay đi ngoài lỏng, tóc rụng/răng long'],
    shi: ['湿热下注 — tiểu gắt đỏ buốt, đau hạ bộ, đái dắt', '肾实 — phù thũng, đau thắt lưng thực'],
    disease: 'thận/tiết niệu/tiền liệt, thắt lưng, tai ù, tóc/răng, xương, sinh dục/nội tiết',
    nourish: 'Bổ thận tinh: đậu đen, vừng đen, dâu tây/tằm, hạt óc chó,枸杞 (kỷ tử), sơn dược (củ mài), hà thủ ô; thuỷ tương sinh (kim sinh thuỷ: bổ phổi cũng bổ thận).',
  },
};

// ---- Tương sinh/khắc ngũ hành (Hán) ----
const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };   // sinh ta = mẫu tạng (dưỡng tôi)
const KE = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };       // khắc ta = tạng bị khắc

// ---- Dược lý: ngũ vị / ngũ sắc thực phẩm ----
export const DIET = {
  木: { flavor: '酸 (chua)', color: 'xanh — rau xanh, chanh, sấu, giấm', note: 'chua liễm can, quá nhiều thương can.' },
  火: { flavor: '苦 (đắng)', color: 'đỏ — cà chua, đậu đỏ, sen tâm', note: 'đắng thanh nhiệt, tả tâm hoả.' },
  土: { flavor: '甘 (ngọt)', color: 'vàng — khoai, gạo, táo, cà rốt', note: 'ngọt bổ ích, kiện tỳ.' },
  金: { flavor: '辛 (cay)', color: 'trắng — gừng, tỏi, hành, củ cải trắng', note: 'cay phát tán, hành khí.' },
  水: { flavor: '咸 (mặn)', color: 'đen — đậu đen, vừng đen, rong biển, hải sản', note: 'mặn nhuyễn kiên, nhập thận.' },
};

// ---- CƠ SỞ TRI THỨC BỆNH/LỜI KHUYÊN (tra theo từ khoá câu hỏi) ----
export const CONDITION_KB = [
  {
    id: 'kidney_jing',
    keywords: ['thủ dâm', 'thủ đâm', 'thủ dam', 'di tinh', 'mộng tinh', 'liệt dương', 'sớm xuất', 'sớm', 'yếu sinh lý', 'thận yếu', '肾', 'khoa nam', 'phòng sự', 'sex', 'đêm xuất', 'cuồng dâm', ' xuất tinh', 'hay quên', 'trí nhớ kém'],
    title: '肾 Tinh hao tổn (THẬN HƯ) — do phòng sự/thủ dâm quá độ',
    summary: 'Theo đông y, 肾 (thuỷ) là «tiên thiên chi bản (先天之本)» — gốc tinh khiết, chủ TÀNG TINH (cất giữ tinh). Thủ dâm/phòng sự quá độ → hao 肾 tinh → THẬN HƯ. Tinh hao kéo theo: thuỷ suy → Mộc (can) mất nuôi (can huyết hư) → hoả vượng → hệ quả toàn thân.',
    yin: '肾 ÂM HƯ (hay gặp nếu ra tinh nhiều + thức khuya/nóng): thắt lưng/đầu gối mỏi, choáng tai ù, mất ngủ nhiều mơ, nóng trong bốc hoả, đổ mồ hôi trộm ban đêm, di tinh/sớm xuất, khô miệng, gò má đỏ, lưỡi đỏ ít rêu.',
    yang: '肾 DƯƠNG HƯ (kèm sợ lạnh/mệt): thắt lưng/đầu gối LẠNH đau, sợ lạnh tay chân, liệt dương/cương kém, tiểu đêm nhiều, hay đi ngoài lỏng sáng sớm, mệt mỏi, tóc rụng/răng long sớm.',
    advice: '① TIẾT DỤC BẢO TINH — tần suất vừa phải (tuỳ tuổi/khí lực); tránh lúc mệt/đói/say/ốm. ② Bổ thận tinh: đậu đen, vừng đen, dâu tằm, hạt óc chó, kỷ tử, sơn dược (củ mài), hà thủ ô, hạt sen. ÂM HƯ → thiên thanh - bổ âm: lục vị địa hoàng hoàn; DƯƠNG HƯ → ôn bổ: kim quỹ địa hoàng hoàn / nhục quế/phụ tử (theo thầy thuốc). ③ Ngủ sớm (trước 23h) — can đởm giải độc + thận phục hồi. ④ Tránh thức khuya, rượu, cay nóng, lo âu («tinh hoá khí, khí hoá thần» — tinh thần tĩnh thì tinh tự đầy).',
    related: '肾 → thuỷ → sinh Mộc (can) + khắc Hoả (tim): tinh hao kéo theo can huyết hư (mờ mắt, bứt rứt) + tim hư (hồi hộp, mất ngủ).',
  },
  {
    id: 'liver_fire',
    keywords: ['cáu gắt', 'nóng nảy', 'giận', 'đau đầu', 'mắt đỏ', 'miệng đắng', '肝火', 'stress', 'áp lực', 'ức chế'],
    title: 'Can hoả vượng / Can dương thượng cương (GIẬN DUỘNG)',
    summary: 'Can (mộc) chủ sớ tiết, tính điều đạt. Lo âu/ức chế/cáu gắt → khí uất kết → hoả hoá → can hoả vượng / can dương cương. Can dương cương là cao huyết áp thường gặp.',
    yin: '肝火上炎型 (CAN HOẢ THƯỢNG VIÊM): mặt mắt đỏ, đau đầu dữ dội, miệng đắng, bứt rứt, mất ngủ, tiểu vàng — hoả thực bốc lên đầu.',
    yang: '肝阳上亢型 (CAN DƯƠNG THƯỢNG KHÁNG): chóng mặt căng đầu, cao HA, cổ gáy cứng, tai ù, hay giận — dương cương không thể chế.',
    symptoms: 'hay cáu gắt, bứt rứt, mặt mắt đỏ, đau đầu (đỉnh/2 bên), hoa mắt chóng mặt, tai ù, miệng đắng, mất ngủ, kinh nguyệt rối, cổ vai gáy mỏi.',
    advice: '① SƠ CAN UẤT — bình can hoả: trà cúc hoa (hoa cúc), diệp hạ châu (chó đẻ răng cưa), atiso, nhân trần, bồ công anh. ② Giảm cay nóng/rượu/thức khuya. ③ Vận động nhẹ / hít thở — «can chủ gân, chủ điều đạt», đi bộ phát tán uất kết. ④ Bớt tức giận — «nộ thương can».',
  },
  {
    id: 'spleen_xu',
    keywords: ['chán ăn', 'đầy bụng', 'phân lỏng', 'đại tiện lỏng', 'bụng lạnh', 'suy dinh dưỡng', 'tiêu hoá kém', '脾虚', 'đầy hơi', 'phù nhẹ', 'tỳ vị'],
    title: 'Tỳ vị hư (TIÊU HOÁ KÉM)',
    summary: 'Tỳ (thổ) chủ vận hoá + thăng thanh. Ăn sinh lạnh/quá no/lo nghĩ nhiều → thương tỳ → tỳ khí/dương hư → vận hoá kém.',
    yin: '脾气虚型 (TỲ KHÍ HƯ): mệt, chán ăn, đầy bụng, phân lỏng, nói yếu, phù nhẹ — khí không vận hoá.',
    yang: '脾阳虚型 (TỲ DƯƠNG HƯ): bụng lạnh đau, phân lỏng nhiều, sợ lạnh tay chân, mặt nhợt — dương không sưởi.',
    symptoms: 'mệt mỏi hay buồn ngủ, chán ăn, đầy bụng, đại tiện lỏng/nhão, nói yếu, hay phù nhẹ, sức yếu, nghĩ nhiều hay lo.',
    advice: '① KIỆN TỲ: ý dĩ, sơn dược (củ mài), sen hạt, táo đỏ, khoai lang, gạo tẻ/yến mạch, đậu đỏ. ② Tránh sinh lạnh, ngọt béo, quá no. ③ Gừng ấm tỳ vị. ④ Tỳ sợ «ứ» (lo nghĩ nhiều) — bớt suy nghĩ quá mức.',
  },
  {
    id: 'insomnia',
    keywords: ['mất ngủ', 'khó ngủ', 'thức giấc', 'mơ nhiều', 'ngủ không yên', 'trằn trọc', '失眠', 'rối loạn giấc ngủ'],
    title: 'Mất ngủ (心肾不交 / 心血虚 / 肝火)',
    summary: 'Mất ngủ đông-y chia nhiều chứng. Hay gặp: (a) TÂM THẬN GIAO CẢNH («心肾不交») — thận âm hư không nuôi được tâm hoả, hoả vượng trên, không ngủ được + nóng bứt rứt; (b) TÂM HUYẾT HƯ — tim máu kém, hồi hộp, hay mơ, tỉnh giữa đêm; (c) CAN HOẢ — thức vì bứt rứt/cáu gắt.',
    yin: '心肾不交型 (THẬN ÂM HƯ): khó vào giấc, nóng bứt rứt, đổ mồ hôi trộm, thắt lưng mỏi, choáng tai ù, miệng khô — thận âm không quản được tâm hoả.',
    yang: '心脾两虚型 (TÂM TỲ LƯỠNG HƯ): tỉnh giữa đêm, hồi hộp hay mơ, mặt nhợt, mệt, chán ăn, hay quên — tỳ không sinh huyết nuôi tim.',
    symptoms: 'khó vào giấc, tỉnh giữa đêm, mơ nhiều, sáng mệt, kèm (âm hư) nóng/bốc hoả đổ mồ hôi trộm, (huyết hư) choáng hoa mắt mặt nhợt, (can hoả) cáu gắt đau đầu.',
    advice: '① NUÔI TÂM AN THẦN: sen tâm (liên tử tâm), táo đỏ, long nhãn, bột sen, chè hạt sen, bách hợp. ② TÂM-THẬN: giao thái hạp (đậu đen + sen tâm + táo) — giao thận thuỷ + tâm hoả. ③ NGỦ TRƯỚC 23h (tý thời, đởm can phục hồi). ④ Tránh cà phê/è trà đặc/điện thoại đêm. ⑤ «Tâm tĩnh tự nhiên lãnh» — bớt lo nghĩ tối.',
  },
  {
    id: 'hair_loss',
    keywords: ['rụng tóc', 'thưa tóc', 'hói', 'sớm bạc', 'tóc khô', 'tóc yếu', '脱发', 'rụng lông mày'],
    title: 'Rụng tóc / Sớm bạc (肾虚 + 血虚)',
    summary: 'Đông-y: «肾其华在发» (thận hiện vẻ qua tóc) + «发为血之余» (tóc là dư của huyết, can tàng huyết). Tóc rụng/bạc sớm = THẬN TINH KHUY + HUYẾT HƯ (can tỳ sinh huyết kém). Tuổi trẻ rụng nhiều = thường do thức khuya/thủ dâm (hao tinh) + căng thẳng (can uất).',
    yin: '肾精亏虚型 (TINH KHUY): tóc rụng từ từ, khô xơ, sớm bạc, kèm thắt lưng mỏi, tai ù, choáng — thận tinh hao (thức khuya/thủ dâm).',
    yang: '血虚生风型 (HUYẾT HƯ SINH PHONG): tóc rụng nhanh từng mảng, da đầu ngứa, khô, mặt nhợt, móng giòn, hay hoa mắt — huyết không nuôi tóc.',
    symptoms: 'tóc rụng nhiều, khô xơ, sớm bạc, kèm (thận hư) thắt lưng mỏi/choáng tai ù, (huyết hư) mặt nhợt, móng mềm, hoa mắt.',
    advice: '① BỔ THẬN + DƯỠNG HUYẾT: hà thủ ô đỏ (chủ药 rụng tóc/bạc), đậu đen, vừng đen, dâu tằm, kỷ tử, sơn dược, táo đỏ, atiso (sơ can). ② Tránh thức khuya (tinh hoá huyết, can tâm/sinh huyết lúc ngủ). ③ Bớt thủ dâm/lo âu. ④ Gội bồ kết/nhân hạt (ngoài da đầu).',
  },
  {
    id: 'acne_skin',
    keywords: ['mụn', 'mụn trứng cá', 'da xấu', 'nổi mẩn', 'viêm da', '痤疮', 'mụn đầu đen', 'lỗ chân lông'],
    title: 'Mụn / Da xấu (肺 phong phấn + 脾 vị thấp nhiệt + huyết nhiệt)',
    summary: '«肺主皮毛» (phổi chủ da lông) + tỳ vị thấp nhiệt huân lên mặt + huyết nhiệt. Mụn tuổi dậy thì/nam nữ = thấp nhiệt + hoả độc; mụn kèm kinh nguyệt = xung nhâm (can) uất nhiệt.',
    yin: '肺经风热型 (PHỔI PHONG NHIỆT): mụn đỏ sưng viêm, da nhờn, họng khô khát — phong nhiệt từ phổi lên da.',
    yang: '脾胃湿热型 (TỲ VỊ THẤP NHIỆT): mụn mủ trắng đầu đen, da nhờn dính, miệng hôi, phân dính, lưỡi rêu vàng nhờn.',
    symptoms: 'mụn mủ/đầu đen vùng mặt/lưng/ngực, da nhờn, miệng đắng, đại tiện dính/khó, lưỡi vàng dính.',
    advice: '① THANH PHỔ/GIẢI ĐỘC: nhân trần, diệp hạ châu, kim ngân hoa, kê huyết đằng, atiso, bí xanh, mướp đắng. ② GIẢM cay nóng/đường/sữa/dầu mỡ/rượu. ③ Đừng nặn (lây, thâm). ④ Rửa mặt nhẹ, giữ thông thoáng. ⑤ Liên quan kinh nguyệt → sơ can (cúc hoa, diệp hạ châu).',
  },
  {
    id: 'fatigue',
    keywords: ['mệt mỏi', 'hơi thở ngắn', 'thở hụt', 'không có sức', 'lười', 'khí huyết kém', '气虚', 'suy nhược', 'kiệt sức', 'uể oải'],
    title: 'Mệt mỏi / Khí hư (KHÍ HƯ — tỳ/phổi)',
    summary: '«khí làm đỡn» — khí hư thì mỏi. THƯỜNG LÀ TỲ + PHỔI KHÍ HƯ: tỳ là nguồn sinh khí (cốc khí), phổi chủ khí (tâm phế). Ăn ngủ kém/lo nghĩ/ốm lâu → khí hư. Nam thủ dâm nhiều → khí+tinh cùng hao.',
    yin: '脾气虚型 (TỲ KHÍ HƯ): mệt sau ăn, chán ăn, đầy bụng, phân lỏng, mặt vàng nhạt, hay cảm — tỳ không vận hoá.',
    yang: '脾肾阳虚型 (TỲ THẬN DƯƠNG HƯ): mệt lạnh, sợ lạnh tay chân, tiểu đêm, đi ngoài lỏng sáng sớm, thắt lưng lạnh — dương khí không đẩy.',
    symptoms: 'mỏi mệt, lười nói, thở hụt, vã mồ hôi khi động, hay cảm, chán ăn, phân lỏng, tiếng nói yếu.',
    advice: '① BỔ KHÍ: nhân sâm/đảng sâm/hoàng kỳ, táo đỏ, kỉ tử, sơn dược, mật ong, gạo tẻ, thịt nạc. ② Bổ tỳ (nguồn khí) trước khi bổ phổi («bổ kim thổ»). ③ Vận động nhẹ (khí huyết hành) — nhưng đừng quá (khí hư sợ tàn). ④ Ngủ đủ, bớt nói nhiều/lo nghĩ.',
  },
  {
    id: 'cold_limbs',
    keywords: ['tay lạnh', 'chân lạnh', 'tay chân lạnh', 'sợ lạnh', 'run', 'tứ chi lạnh', '阳虚', 'lạnh trong người', 'tê tay chân', 'tê bì chân tay', 'buốt tay chân'],
    title: 'Tay chân lạnh (DƯƠNG HƯ hoặc CAN UẤT TỨ NGHỊCH)',
    summary: 'Hai chứng: (a) DƯƠNG HƯ (thận/tỳ dương hư) — dương khí không sưởi ấm tứ chi, lạnh toàn bộ + sợ lạnh/mệt; (b) «TỨ NGHỊCH» (can khí uất, 4 chi không ấm) — chỉ tay chân lạnh nhưng không sợ lạnh toàn thân, kèm cáu gắt/ức chế (can chủ sớ tiết, uất thì khí trệ).',
    yin: '脾肾阳虚型 (DƯƠNG HƯ): tay chân lạnh + sợ lạnh toàn thân, mệt, tiểu đêm, phân lỏng, mặt nhợt — dương khí không đẩy.',
    yang: '肝气郁结型 (CAN UẤT TỨ NGHỊCH): chỉ tay chân lạnh (không sợ lạnh toàn thân), bứt rứt, cáu gắt, ngực sườn trướng, đau đầu — can khí trệ không đưa nhiệt ra 4 chi.',
    symptoms: '(dương hư) tay chân lạnh + sợ lạnh/mệt/tiểu đêm/đại tiện lỏng; (can uất) chỉ tay chân lạnh + bứt rứt/ngực sườn trướng/đau đầu.',
    advice: 'DƯƠNG HƯ: ① ôn bổ thận dương — nhục quế/phụ tử/kim quỹ (theo thầy thuốc); ăn ấm: gừng/đường đỏ/thịt dê/hạt óc chó/hành tỏi; giữ ấm thắt lưng/chân. CAN UẤT: ② «TỨ NGHỊCH» — sơ can giải uất:柴胡 (sài hồ)/bạch thược/chỉ xác (tứ nghịch tán ý) + đi bộ nhẹ, bớt ức chế.',
  },
  {
    id: 'tinnitus',
    keywords: ['tai ù', 'tai ù a', 'iếc', 'giảm thính lực', 'tai kêu', '耳鸣', 'điếc'],
    title: 'Tai ù / Giảm thính (THẬN HƯ hoặc CAN HOẢ)',
    summary: '«肾开窍于耳» (thận mở khiếu ở tai) + can đởm mạch vòng tai. Tai ù chia: (a) HƯ chứng (thận tinh khuy — hay gặp tuổi già/thủ dâm) — ù a a âm ỉ, kéo dài, kèm choáng/thắt lưng mỏi; (b) THỰC chứng (can hoả/ngũ bạt thấp nhiệt) — ù to bất ngờ, như sóng/bíp, kèm đau đầu/mắt đỏ.',
    yin: '肾精亏虚型 (THẬN TINH KHUY — deficiency): tai ù kéo dài âm ỉ, choáng, thắt lưng đầu gối mỏi, tóc rụng, hay quên — tinh không nuôi tai.',
    yang: '肝火上炎型 (CAN HOẢ — excess): ù to đột ngột, như sóng/bíp, đau đầu, mắt đỏ, cáu gắt, miệng đắng — hoả thực bốc lên.',
    symptoms: '(thận hư) tai ù kéo dài âm ỉ, choáng, thắt lưng đầu gối mỏi, tóc rụng; (can hoả) ù to đột ngột, đau đầu, mắt đỏ, cáu gắt.',
    advice: 'THẬN HƯ: ① bổ thận tinh — lục vị địa hoàng hoàn / thông khí hoàn (quy bản, thục địa, sơn dược, kỷ tử); ăn đen (đậu đen, vừng đen). CAN HOẢ: ② long đởm tả can hoả / cúc hoa + diệp hạ châu; giảm cay nóng/ức chế. Tai ù lâu + nhiều triệu → khám chuyên khoa tai mũi họng.',
  },
  {
    id: 'back_knee',
    keywords: ['đau lưng', 'đau thắt lưng', 'đau đầu gối', 'mỏi lưng', 'thắt lưng mỏi', '腰痛', 'đau cột sống', 'đau khớp', 'viêm khớp', 'khớp đau'],
    title: 'Đau lưng / Đầu gối (THẬN HƯ — «lưng là phủ của thận»)',
    summary: '«腰为肾之府» (thắt lưng là nhà của thận). Đau lưng mỏi (không phải chấn thương) thường = THẬN HƯ: mỏi ê ẩm, mệt thì nặng, nghỉ thì nhẹ. Cột sống/khớp = thận chủ cốt (xương). Đau lưng cấp/nặng = thấp nhiệt/ủ huyết (thực chứng).',
    yin: '肾虚型 (THẬN HƯ — deficiency): thắt lưng/đầu gối mỏi ê ẩm, mệt nặng nghỉ nhẹ, tiểu đêm, tóc rụng, choáng — tinh hư không nuôi cốt.',
    yang: '湿热瘀血型 (THẤP NHIỆT Ủ HUYẾT — excess): đau trương nặng, nhói cố định, tiểu vàng, tê — thấp nhiệt ủ huyết ứ ở kinh lạc.',
    symptoms: '(thận hư) thắt lưng/đầu gối mỏi ê ẩm, mệt/đứng lâu nặng, kèm tiểu đêm/tóc rụng/choáng; ( thấp nhiệt) đau trương nặng + tiểu vàng; (ủ huyết) đau nhói cố định.',
    advice: '① BỔ THẬN tráng cốt: đỗ trọng/tục đoạn/oa nhĩ (theo thầy thuốc); ăn: hà thủ ô, đậu đen, hạt óc chó, sơn dược, canh xương. ② Tránh đứng/ngồi lâu, mang vác nặng. ③ GIỮ ẤM thắt lưng (thận dương sợ lạnh). ④ Vận động nhẹ (bơi, yoga) — «động thì thông».',
  },
  {
    id: 'constipation',
    keywords: ['táo bón', 'đại tiện khó', 'phân khô', 'đi ngoài khó', '便秘', 'đại tiện khô'],
    title: 'Táo bón (ĐẠI TRƯỜNG — tân dịch khuy/nhiệt/khí hư)',
    summary: 'Đại trường chủ truyện hóa (thải phân). Táo bón: (a) TÂN DỊCH KHUY (dịch khô, hay gặp thủ dâm/âm hư/già) — phân khô cứng; (b) NHIỆT MẬT — phân khô + nóng miệng/mặt đỏ; (c) KHÍ HƯ (tỳ/phổi) — có phân nhưng rặn无力, mệt; (d) HÀNG (lạnh) — phân khó, lạnh bụng.',
    yin: '津亏型 (TÂN DỊCH KHUY): phân khô cứng như hạt, khát khô miệng, lưỡi đỏ ít rêu — tân dịch không đủ bôi trơn.',
    yang: '气虚型 (KHÍ HƯ): có ý nhưng rặn无力, sau đi mệt, chán ăn, phân không quá khô — khí không đẩy.',
    symptoms: '(tân khuy) phân khô cứng, khát khô miệng; (nhiệt) mặt đỏ, miệng hôi, tiểu vàng; (khí hư) mệt, rặn yếu, sau đi lại mỏi; (lạnh) bụng lạnh đau.',
    advice: 'TÂN KHUY: ① nhuận tràng — quyết minh tử, hỏa ma nhân, quỷ bản (sinh tân); uống đủ nước ấm, mật ong sáng. NHIỆT: ② thanh nhiệt — khổ qua, mướp đắng, nhân trần, đậu xanh. KHÍ HƯ: ③ bổ khí — đảng sâm/hoàng kỳ, táo đỏ. ④ Ăn chất xơ (rau xanh, khoai lang, ý dĩ, vừng), vận động, đi đại tiện đúng giờ.',
  },
  {
    id: 'sweat',
    keywords: ["đổ mồ hôi","mồ hôi trộm", 'tự hãn', 'vã mồ hôi', 'mồ hôi tay', 'mồ hôi đêm', '盗汗', 'nhiều mồ hôi'],
    title: 'Đổ mồ hôi nhiều (DƯƠNG HƯ tự hãn / ÂM HƯ đạo hãn)',
    summary: '«dương hư tự hãn, âm hư đạo hãn»: (a) TỰ HÃN (ban ngày, động ra) = KHÍ HƯ (phổi vệ bất cố) — vệ khí không khép lỗ chân lông; (b) ĐẠO HÃN (đêm ngủ đổ, tỉnh thì dứt) = ÂM HƯ HOẢ VƯỢNG — âm không giữ dương, dương dư thoát ra ngoài (thường kèm thủ dâm/thức khuya).',
    symptoms: '(tự hãn) ban ngày vã mồ hôi, mệt, sợ gió, dễ cảm; (đạo hãn) đêm đổ mồ hôi ướt áo, tỉnh dứt, kèm nóng bốc hoả, khô miệng, đỏ gò má.',
    advice: 'TỰ HÃN (khí hư): ① bổ khí cố biểu — hoàng kỳ, bạch truật, phòng phong (ngự bình tán ý); táo đỏ, nhân sâm. ĐẠO HÃN (âm hư): ② dưỡng âm thanh nhiệt — sinh địa, mạch môn, đan bì, qui bản (đương quy lục hoàng); đậu đen, sen tâm. ③ Tránh cay nóng/thức khuya. Mồ hôi nhiều kéo dài + sụ cân → khám.',
  },
  {
    id: 'stomach_pain',
    keywords: ['đau dạ dày', 'đau bao tử', 'đau bụng', 'ợ chua', 'ợ hơi', 'đau vùng thượng vị', 'chảy máu dạ dày', 'viêm loét', '胃痛', 'tức bụng trên', 'đau khi đói'],
    title: 'Đau dạ dày / Ợ chua (VỊ — hàn nhiệt uất thực + can phạm vị)',
    summary: 'Vị (thổ) chủ thu nạp. Đau dạ dày: (a) VỊ HÀN (ăn lạnh/sinh) — đau âm ỉ ấm đỡ; (b) VỊ NHIỆT/Ợ CHUA (hoả) — đau rát, ợ chua, khát; (c) CAN KHÍ PHẠM VỊ (căng thẳng) — đau lan sườn, đau khi buồn/cáu; (d) VỊ ÂM HƯ (thủ dâm/rượu lâu) — đau khi đói, khát.',
    yin: '胃寒型 (VỊ HÀN — cold type): đau âm ỉ, ấm đỡ, bụng lạnh, thích ép tay ấm, phân lỏng, lưỡi nhạt rêu trắng.',
    yang: '胃热型 (VỊ NHIỆT — heat type): đau rát bỏng, ợ chua khát, miệng hôi, táo bón, lưỡi đỏ rêu vàng.',
    symptoms: '(hàn) đau ấm đỡ, bụng lạnh; (nhiệt) đau rát ợ chua, khát, lưỡi vàng; (can phạm) đau lan sườn, buồn nôn khi buồn; (âm hư) đau khi đói, ăn vào đỡ.',
    advice: 'HÀN: ① ôn vị — gừng/đường đỏ/quế/bột gạo nếp. NHIỆT/Ợ CHUA: ② tả vị hoả — bối mẫu, hải phiêu sao, nhân trần; giảm cay/chua/cà phê/rượu. CAN PHẠM: ③ sơ can hoà vị — sài hồ, bạch thược, cam thảo. ÂM Hư: ④ dưỡng vị âm — sa sâm, mạch môn, thạch斛. Ăn đúng giờ, nhai kỹ, 7 phần no, tránh đói quá/no quá.',
  },
  {
    id: 'dysmenorrhea',
    keywords: ['đau bụng kinh', 'đau khi hành kinh', 'đau quặn bụng kinh', 'thống kinh', '痛经', 'đau bụng trước kinh', 'đau bụng dưới kinh'],
    title: 'Đau bụng kinh (THỐNG KINH — hàn ngưng/khí uất ủ huyết/khí huyết hư)',
    summary: 'Đông-y chia 3 chứng: (a) HÀN NGƯNG HUYẾT — chịu lạnh/uống lạnh lúc kinh → máu ngưng, đau quặn, nóng đắp đỡ; (b) KHÍ TRỆ HUYẾT Ủ — căng thẳng, can khí uất → đau trước kinh, sườn ngực trướng; (c) KHÍ HUYẾT HƯ — mỏi, máu kinh nhạt ít, đau âm ỉ.',
    yin: '寒凝血脉型 (HÀN NGƯNG): đau quặn từng cơn, nóng đắp đỡ, máu cục sẫm, sợ lạnh bụng — hàn ngưng huyết.',
    yang: '气滞血瘀型 (KHÍ TRỆ Ủ HUYẾT): đau trước kinh, bứt rứt, sườn ngực trướng, máu sẫm cục — can khí uất → ủ huyết.',
    symptoms: '(hàn) đau quặn từng cơn, nóng đắp đỡ, máu cục sẫm; (uất) đau trước kinh, bứt rứt, sườn trướng, cục máu; (hư) đau âm ỉ, mệt, máu nhạt ít.',
    advice: 'HÀN: ① ôn cung tán hàn — gừng đường đỏ/quế/ngải cứu (ai diệp) nấu ấm lúc kinh; đắp nóng bụng dưới. UẤT: ② sơ can hoạt huyết — sài hồ, hương phụ, ích mẫu thảo, bạch thược. HƯ: ③ bổ khí huyết — táo đỏ, kỷ tử, đương quy, long nhãn. CHUNG: tránh lạnh (nước/uống/điều hoà) trước và trong kinh, giữ ấm bụng dưới + chân, nghỉ ngơi.',
  },
  {
    id: 'irregular_period',
    keywords: ['kinh nguyệt không đều', 'kinh sớm', 'kinh muộn', 'thiểu kinh', 'đóng kinh', 'bế kinh', 'rối loạn kinh nguyệt', '月经不调', 'vô kinh', 'kinh ra ít'],
    title: 'Kinh nguyệt không đều (can uất/tỳ hư/thận hư — xung nhâm)',
    summary: 'Kinh nguyệt do XUNG NHÂM + CAN/TỲ/THẬN. (a) CAN UẤT — căng thẳng → kinh lỡ/sớm, sườn trướng; (b) TỲ HƯ — máu ít/nhạt, mệt, sinh hóa vô nguồn; (c) THẬN HƯ — kinh muộn/ít, thắt lưng mỏi (thận là gốc thiên quý).',
    yin: '肝郁型 (CAN UẤT): kinh lỡ/sớm, bứt rứt, ngực sườn trướng, hay tức giận — can khí uất → xung nhâm bất điều.',
    yang: '肾虚型 (THẬN HƯ): kinh muộn/ít, thắt lưng đầu gối mỏi, choáng tai ù, tóc rụng — thận tinh khuy → thiên quý bất túc.',
    symptoms: '(can uất) kinh lỡ/sớm, bứt rứt, ngực sườn trướng; (tỳ hư) máu nhạt ít, mệt, chán ăn; (thận hư) kinh muộn/ít, thắt lưng đầu gối mỏi, choáng.',
    advice: '① điều can-tỳ-thận: đương quy, bạch thược, ích mẫu thảo, táo đỏ, kỷ tử, sơn dược, ý dĩ. CAN UẤT +cúc hoa/diệp hạ châu; TỲ HƯ +khoai lang/táo đỏ; THẬN HƯ +đậu đen/ốc chó. ② Ngủ sớm (can đởm phục hồi). ③ Giữ ấm, tránh lạnh, bớt lo âu. Đóng kinh >3 tháng hoặc rong kinh → khám phụ khoa.',
  },
  {
    id: 'infertility',
    keywords: ['hiếm muộn', 'vô sinh', 'không có thai', 'muốn con', 'khó có con', 'chưa có bầu', '不孕', 'khó thụ thai'],
    title: 'Hiếm muộn / Vô sinh (THẬN + XUNG NHÂM + CAN)',
    summary: 'Đông-y: thận là gốc «thiên quý» (bản chất sinh dục), xung nhâm nuôi bào tử, can chủ điều đạt (rụng trứng). Nam thường THẬN TINH KHUY (tinh yếu/ít), nữ thường THẬN hư (noãn kém/cung lạnh) + CAN UẤT (rụng trứng không đều) + Ủ HUYẾT.',
    symptoms: '(thận hư) thắt lưng mỏi, sợ lạnh, kinh muộn/ít, tay chân lạnh; (can uất) PMS nặng, kinh lỡ, ngực sườn trướng; (ủ huyết) cục máu sẫm, đau bụng kinh.',
    advice: '① BỔ THẬN: nam — đỗ trọng/tục đoạn/ốc chó/đậu đen/hà thủ ô; nữ — thục địa/đương quy/kỷ tử/ngải cứu. ② SƠ CAN (rụng trứng): diệp hạ châu/cúc hoa + giảm stress. ③ ÔN CUNG (cung lạnh): ngải cứu/gừng, giữ ấm bụng dưới. ④ Ngủ sớm, tiết độ, tính ngày rụng trứng. ⑤ Cả 2 vợ chồng — khám hiếm muộn (nội tiết/tinh dịch đồ) nếu >1 năm.',
  },
  {
    id: 'menopause',
    keywords: ['mãn kinh', 'tiền mãn kinh', 'đình kinh', 'triệu chứng mãn kinh', 'bốc hoả tuổi', 'đổ mồ hôi tuổi', '更年期', 'nóng bừng'],
    title: 'Mãn kinh / Tiền mãn kinh (THẬN ÂM HƯ — thiên quý tuyệt)',
    summary: 'Khoảng 45-55 tuổi, THẬN ÂM dần suy, thiên quý (tinh sinh dục) cạn → «âm hư hoả vượng»: bốc hoả/âm đạo khô/kinh rối. Là chuyển giao tự nhiên, không bệnh nếu cân bằng được. Dưỡng thận âm giúp qua giai đoạn êm.',
    yin: '肾阴虚型 (THẬN ÂM HƯ): nóng bừng, đổ mồ hôi trộm, bứt rứt, mất ngủ, âm đạo khô, lưỡi đỏ ít rêu — âm hư hoả vượng.',
    yang: '肾阴阳两虚型 (LƯỠNG HƯ): nóng bừng xen sợ lạnh, mệt, tiểu đêm, thắt lưng lạnh, phù nhẹ — cả âm+dương đều suy.',
    symptoms: 'nóng bừng mặt/cổ, đổ mồ hôi, mất ngủ, bứt rứt/căng thẳng, âm đạo khô, da khô, hay quên, tim trống, kinh rối rồi tắt.',
    advice: '① DƯỠNG THẬN ÂM: thục địa, sơn dược, sơn thù du, mạch môn, quy bản; đậu đen, vừng đen, kỷ tử. ② THANH HƯ HOẢ: cúc hoa, đậu xanh, sen tâm, khổ qua. ③ Giảm cay nóng/rượu/đường. ④ Vận động nhẹ, yoga, ngủ đủ, bớt lo âu. ⑤ Canxi (sữa/đậu/mè) bảo vệ xương (thận chủ cốt). Triệu chứng nặng → khám nội tiết.',
  },
  // [loop 1038] +5 bệnh mãn tính thường gặp
  {
    id: 'xiao_ke',
    keywords: ['tiểu đường', 'đái tháo đường', 'đái nhiều', 'đái ngọt', 'khát nhiều', 'khát nước', 'khát nước nhiều', 'ăn nhiều hay đói', '消渴', 'đường huyết cao', 'huyết đường', 'insulin', 'đường trong máu'],
    title: 'Tiểu đường (TIÊU KHÁT 消渴 — tam tiêu: thượng/trung/hạ tiêu)',
    summary: 'Đông-y gọi TIÊU KHÁT, chia TAM TIÊU: (a) THƯỢNG TIÊU — phổi nhiệt, khát uống nhiều; (b) TRUNG TIÊU — vị nhiệt, ăn nhiều hay đói; (c) HẠ TIÊU — thận hư, tiểu nhiều đục. Bệnh ở PHỔI - VỊ - THẬN (âm hư táo nhiệt).',
    yin: '阴虚燥热型 (ÂM HƯ TÁO NHIỆT — early stage): khát nhiều, miệng khô, người gầy, lưỡi đỏ ít rêu — âm hư sinh táo nhiệt.',
    yang: '气阴两虚型 (KHÍ ÂM LƯỠNG HƯ — late stage): mệt nhiều, tiểu nhiều đục, phù nhẹ, tay chân tê, vết thương khó lành — cả khí + âm đều hư.',
    symptoms: 'khát nhiều/uống nhiều/ăn nhiều/tiểu nhiều («tam đa»), miệng khô, người gầy, mệt, da ngứa, vết thương khó lành.',
    advice: '① Dưỡng âm thanh nhiệt: thiên hoa phấn, mạch môn, ngọc trúc, thạch斛, hoài sơn (sơn dược), kê (millet). ② Hạ tiêu (thận) — ngũ vị tử, sơn thù du, thục địa. ③ Ăn: mướp đắng, khổ qua, bí xanh, yến mạch, đậu đen; GIẢM đường/tinh bột tinh. ④ Vận động đều (đi bộ), kiểm soát cân nặng. ⑤ Theo dõi đường huyết + thuốc y khoa (đông-y bổ trợ, không thay thế insulin).',
  },
  {
    id: 'gout',
    keywords: ['gout', 'thống phong', 'đau khớp ngón chân cái', 'axit uric', 'viêm khớp cấp', '痛风', 'sưng khớp', 'đau khớp dữ dội', 'đau khớp', 'viêm khớp'],
    title: 'Gout / Thống phong (THỐNG PHONG 痛风 — thấp nhiệt tê痹 / đàm trọc ủ huyết)',
    summary: 'Đông-y THỐNG PHONG (thấp nhiệt痹) — đau khớp dữ dội (thường ngón chân cái), sưng đỏ, về đêm nặng. Do thấp nhiệt + đàm trọc ủ huyết ở kinh lạc. Thường kèm TỲ VỊ thấp nhiệt (ăn giàu purin/đồ uống).',
    yin: '湿热蕴结型 (THẤP NHIỆT — acute): đau sưng đỏ nóng dữ dội, khát, tiểu vàng đỏ, lưỡi đỏ rêu vàng nhờn — thấp nhiệt cấp tính bốc lên khớp.',
    yang: '痰瘀阻络型 (ĐÀM Ủ HUYẾT — chronic): đau kéo dài, khớp biến dạng, hạt tophi, cứng khớp sáng, lưỡi tím có điểm ư — đàm trọc ủ huyết mạn tính.',
    symptoms: 'đau khớp dữ dội (thường ngón chân cái), sưng đỏ nóng, về đêm nặng hơn, da bong, hạn chế vận động. Mạn tính: hạt tophi.',
    advice: '① Thanh thấp nhiệt, thông lạc: thổ phục linh, xa tiền tử, hoàng bá, thương nhĩ tử, ý dĩ. ② Giảm purin: tránh nội tạng động vật, hải sản, thịt đỏ, rượu bia, nước hầm đặc. ③ Uống nhiều nước ấm. ④ Ý dĩ + bí xanh + mướp đắng nấu canh. ⑤ Cấp tính → khám y khoa (thuốc hạ axit uric/colchicine); đông-y bổ trợ giảm đau + phòng tái phát.',
  },
  {
    id: 'eczema',
    keywords: ['chàm', 'eczema', 'viêm da cơ địa', 'ngứa da', 'dị ứng da', '湿疹', 'nổi mẩn ngứa', 'da khô ngứa'],
    title: 'Chàm / Eczema (THẤP CHUYỂN 湿疹 — thấp nhiệt + huyết hư phong táo)',
    summary: 'Đông-y THẤP CHUYỂN: (a) CẤP — thấp nhiệt uất ở da (mẩn đỏ, chảy nước, ngứa); (b) MẠN — huyết hư phong táo (da khô, dày, ngứa, bong vảy). Liên quan TỲ (thấp) + CAN (huyết) + PHỔI (bì mao).',
    yin: '湿热浸淫型 (THẤP NHIỆT — acute): mẩn đỏ, mụn nước, chảy dịch vàng, ngứa dữ dội, lưỡi đỏ rêu vàng — thấp nhiệt cấp bốc lên da.',
    yang: '血虚风燥型 (HUYẾT HƯ PHONG TÁO — chronic): da khô dày, vảy, thâm, ngứa về đêm, mặt nhợt — huyết hư không nuôi da.',
    symptoms: '(cấp) mẩn đỏ, mụn nước, chảy dịch, ngứa nhiều; (mạn) da khô dày, vảy, thâm, ngứa về đêm, tái đi tái lại.',
    advice: '① Thanh thấp nhiệt (cấp): khổ sâm, địa phu tử, thổ phục linh, kim ngân hoa, ý dĩ. ② Dưỡng huyết nhuận táo (mạn): đương quy, thục địa, hà thủ ô, kinh giới. ③ Tránh dị ứng (hải sản, gia vị, cỏ, lông); giữ ẩm da. ④ Không gãi (lây/nhiễm). ⑤ Tỳ thấp → giảm đường/sữa/dầu.',
  },
  {
    id: 'fatty_liver',
    keywords: ['gan nhiễm mỡ', 'nhiễm mỡ gan', 'fatty liver', 'men gan cao', '脂肪肝', 'đau tức hạ sườn phải', 'tăng men gan'],
    title: 'Gan nhiễm mỡ (脂肪肝 — can uất tỳ hư + đàm thấp ứ trệ)',
    summary: 'Đông-y: CAN UẤT TỲ HƯ + đàm thấp ư trệ ở can. Ăn nhiều mỡ/đường/đồ uống + ít vận động → tỳ vận hoá kém, đàm thấp sinh, uất ở can. Thường kèm CAN uất (stress) + THẬN hư.',
    yin: '肝郁脾虚型 (CAN UẤT TỲ HƯ): tức hạ sườn, mệt, chán ăn, đầy bụng, hay bứt rứt — can uất + tỳ hư.',
    yang: '痰湿瘀阻型 (ĐÀM THẤP Ủ TRỆ): nặng người, phù, men gan cao, lưỡi rêu nhờn dày — đàm thấp ứ trệ nặng.',
    symptoms: 'mệt mỏi, tức nặng hạ sườn phải, chán ăn, đầy bụng, trào ngược, men gan (ALT/AST) tăng, siêu âm thấy gan sáng (nhiễm mỡ).',
    advice: '① Sơ can kiện tỳ, hoá đàm: sài hồ, ý dĩ, quyết minh tử, sơn tra (tra quả), đan sâm, trạch tả. ② Atiso, chè mát gan, cúc hoa, diệp hạ châu. ③ Giảm mỡ/đường/rượu/tinh bột tinh; tăng rau xanh/cá. ④ Vận động aerobic đều (giảm mỡ gan). ⑤ Giảm cân nếu béo; kiểm soát men gan định kỳ.',
  },
  {
    id: 'prostate_bph',
    keywords: ['tiền liệt tuyến', 'phì đại tiền liệt tuyến', 'tiểu khó', 'tiểu nhát', 'đái dắt', 'bệnh tiền liệt', '前列腺', 'tiểu đêm nhiều nam'],
    title: 'Phì đại tiền liệt tuyến / BPH (THẬN HƯ + thấp nhiệt hạ chú)',
    summary: 'Đông-y thuộc «tinh lỵ»/«lâm trọc»/«u bì»: THẬN KHÍ HƯ (khí hoá kém) + thấp nhiệt hạ chú ở bàng quang. Lớn tuổi → thận dương/khí hư dần, kèm thấp nhiệt (tiểu gắt, đục).',
    symptoms: 'tiểu khó/tiểu nhát, dòng yếu, tiểu đêm nhiều, tiểu xong vẫn còn cảm, đôi khi tiểu buốt/đục, tức nặng hạ bộ.',
    advice: '① Bổ thận khí, hoá thấp thông lâm: sơn dược, sơn thù du, phục linh, xa tiền tử, trạch tả, thỏ ty tử. ② Giảm cay nóng/rượu/thức khuya. ③ Bí xanh, râu ngô, mộc nhĩ nấu canh. ④ Không ngồi lâu, vận động (đi bộ), giữ ấm hạ bộ. ⑤ Tiểu khó nặng/đái máu → khám tiết niệu (loại trừ ung thư tiền liệt tuyến).',
  },
  // [loop 1050] +2 sức khoẻ tâm thần (rất phổ biến hiện đại)
  {
    id: 'anxiety',
    keywords: ['lo âu', 'bứt rứt', 'hoảng hốt', 'rối loạn lo âu', 'anxiety', 'hồi hộp', 'tim đập nhanh', 'panic', 'hoảng sợ', 'khó thở do lo âu'],
    title: 'Lo âu / Hoảng sợ (TÂM-THẬN BẤT GIAO + can uất hoả hoá)',
    summary: 'Lo âu = «TÂM THẬN BẤT GIAO» (thận thuỷ không nuôi được tâm hoả → hoả vượng trên) + can uất hoả hoá (stress → can khí uất → hoả). Tim mất dưỡng → hồi hộp, bứt rứt; thận không giao → mất ngủ, sợ hãi vô cớ.',
    yin: '心胆气虚型 (TÂM ĐỞM KHÍ HƯ — deficiency): hồi hộp, sợ hãi vô cớ, dễ giật mình, mệt mỏi, hay than thở, mặt nhợt — khí hư không nuôi tâm đởm.',
    yang: '肝气郁结化火型 (CAN UẤT HOÁ HOẢ — excess): bứt rứt, cáu gắt, ngực sườn tức, miệng đắng, khó ngủ, đại tiện táo — uất kết hoá hoả.',
    symptoms: 'bứt rứt, lo âu vô cớ, hồi hộp, tim đập nhanh, khó thở (cảm giác nghẹn), mất ngủ, tay chân run, đổ mồ hôi, hoảng sợ đột ngột (panic attack).',
    advice: '① DƯỠNG TÂM-THẬN: giao thái (sen tâm + đậu đen + táo đỏ) — giao thận thuỷ + tâm hoả. ② AN THẦN: toan táo nhân, viễn chí, long nhãn, bách hợp. ③ SƠ CAN: sài hồ, bạch thược, cúc hoa, diệp hạ châu. ④ Thở sâu (4-7-8), thiền/yoga. ⑤ Giảm cà phê/đường/đồ刺激. ⑥ Tập thể dục đều (nội tiết ổn). ⑦ Lo âu nặng/panic → khám tâm lý (CBT + thuốc nếu cần).',
  },
  {
    id: 'depression',
    keywords: ['trầm cảm', 'chán nản', 'mất hứng thú', 'bi quan', 'vô vọng', 'depression', 'buồn bã kéo dài', 'không muốn làm gì', 'mệt mỏi tinh thần'],
    title: 'Trầm cảm / Chán nản (CAN KHÍ UẤT KẾT + TÂM-TỲ LƯỡng HƯ)',
    summary: 'Trầm cảm = CAN KHÍ UẤT KẾT (sơ tiết bất lợi → uất → dần hoả hoặc tư tảo) + TÂM-TỲ LƯỡng HƯ (tâm huyết hư + tỳ khí hư → không sinh huyết → tâm mất dưỡng). Cảm xúc ức chế lâu → khí trệ → huyết ư → «uất».',
    yin: '肝气郁结型 (CAN UẤT): buồn bã, thở dài, ngực sườn tức, mất hứng thú, hay khóc, ăn kém — can khí uất không sơ tiết.',
    yang: '心脾两虚型 (TÂM TỲ HƯ): chán nản, mệt mỏi, mất ngủ hay mơ, mặt nhợt, hay quên, giảm tập trung — khí huyết không nuôi tâm.',
    symptoms: 'chán nản, mất hứng thú, bi quan, mệt mỏi, mất ngủ (hoặc ngủ nhiều), ăn kém, cảm giác vô vọng, hay khóc, giảm tập trung, đôi khi nghĩ tiêu cực.',
    advice: '① SƠ CAN GIẢI UẤT: sài hồ, hương phụ, uất kim, bạch thược, cam thảo (tiêu dao tán ý). ② BỔ TÂM-TỲ: đương quy, long nhãn, táo đỏ, sơn dược, kỷ tử (quy tỳ thang ý). ③ HOẠT HUYẾT: đan sâm, xích thược (chống huyết ư uất kết). ④ Vận động NGOÀI TRỜI (mặt trời, thiên nhiên — tăng serotonin). ⑤ Giao tiếp, chia sẻ, tránh cô lập. ⑥ Ngủ đủ, nhịp sống đều. ⑦ Trầm cảm nặng → khám tâm lý (thuốc + liệu pháp).',
  },
  // [loop 1052] +3 bệnh thường gặp
  {
    id: 'dizziness',
    keywords: ['chóng mặt', 'hoa mắt', 'chóng', 'đầu óc quay', 'vertigo', 'chóng mặt khi đứng', 'မြင်细胞', 'chóng khi đổi tư thế'],
    title: 'Chóng mặt / Hoa mắt (CAN DƯƠNG THƯỢNG KHANG + khí huyết hư + đàm thấp)',
    summary: 'Chóng mặt đông-y: (a) CAN DƯƠNG THƯỢNG KHANG — can khí theo dương đi lên (choáng vênh, căng đầu, HA cao); (b) KHÍ HUYẾT HƯ — não thiếu dưỡng (choáng khi đứng, mệt); (c) ĐÀM THẤP — đàm thấp蒙清 khiếu (choáng nặng, buồn nôn, đờm).',
    yin: '气血两虚型 (KHÍ HUYẾT HƯ): choáng khi đứng dậy, mặt nhợt, mệt, hay hoa mắt, tim đập yếu — khí huyết không lên não.',
    yang: '肝阳上亢型 (CAN DƯƠNG): choáng vênh căng đầu, mắt hoa, bứt rứt, HA cao, tai ù — can dương theo khí lên đầu.',
    symptoms: '(can dương) choáng vênh căng đầu, mắt hoa, HA cao; (khí huyết hư) choáng khi đứng dậy, mặt nhợt, mệt; (đàm thấp) choáng nặng ù tai, buồn nôn, đờm.',
    advice: 'CAN DƯƠNG: ① bình can tiềm dương — thiên ma, câu đằng, thạch quyết minh, ngọc trúc (theo thầy thuốc). KHÍ HUYẾT HƯ: ② bổ khí huyết — đương quy, thục địa, táo đỏ, kỷ tử, đảng sâm. ĐÀM THẤP: ③ hoá đàm — bán hạ, trần bì, phục linh, thiên ma. ④ Tránh đổi tư thế đột ngột, giảm rượu/cay. ⑤ Chóng mặt kéo dài/nặng → khám (loại trừ tiền đình/não).',
  },
  {
    id: 'obesity',
    keywords: ['béo phì', 'thừa cân', 'giảm cân', 'mỡ bụng', 'obesity', 'nặng cân', 'béo', 'tập thể dục giảm cân'],
    title: 'Béo phì / Thừa cân (TỲ HƯ ĐÀM THẤP + khí trệ)',
    summary: 'Đông-y: TỲ HƯ ĐÀM THẤP là gốc — tỳ vận hoá kém → thuỷ thấp ư → đàm thấp tích mỡ. Thường kèm khí hư (mệt, lười vận động → vòng luẩn quẩn). «Dục tri phì nhơn, đa đàm thấp».',
    yin: '脾虚痰湿型 (TỲ HƯ ĐÀM THẤP): béo phù, nặng người, mệt, buồn ngủ, phân lỏng, phù nhẹ — tỳ hư sinh đàm thấp.',
    yang: '胃热湿阻型 (VỊ NHIỆT THẤP TRỆ): béo chắc, ăn nhiều hay đói, miệng khát, táo bón, dễ cáu — vị nhiệt + thấp trệ.',
    symptoms: 'thừa cân, mỡ bụng, nặng người, buồn ngủ, mệt, hay ăn ngọt/béo, đại tiện lỏng/nhớt, phù nhẹ.',
    advice: '① KIỆN TỲ HOÁ ĐÀM: ý dĩ, sơn dược, phục linh, trần bì, trạch tả, sơn tra. ② GIẢM ngọt/béo/tinh bột tinh/đường/sữa. ③ TĂNG rau xanh, đạm nạc, fibre. ④ VẬN ĐỘNG AEROBIC ĐỀU (đi bộ/bơi — 30+ phút/ngày). ⑤ Tránh ăn đêm, nhai kỹ. ⑥ Giấc ngủ đủ (thiếu ngủ → tăng cortisol → béo bụng). ⑦ Có bệnh nền (đường/HA/mỡ máu) → khám + theo dõi.',
  },
  {
    id: 'allergy',
    keywords: ['dị ứng', 'viêm mũi dị ứng', 'ngứa', 'mẩn ngứa', 'nổi mề đay', 'viêm da dị ứng', 'allergy', 'hen sơ'],
    title: 'Dị ứng / Mẫn cảm (PHỔI VỆ BẤT CỐ + đặc bẩm chất)',
    summary: 'Dị ứng = PHỔI VỆ KHÍ BẤT CỐ (phổi chủ bì mao + vệ khí — vệ khí yếu → ngoại tà/dị ứng nguyên xâm nhập dễ). Liên quan THẬN (thận chủ nạp khí, gốc của phổi) + TỲ (sinh hoá vệ khí). Trẻ em hay gặp (vệ khí chưa đầy).',
    symptoms: 'hắt hơi/sổ mũi (viêm mũi dị ứng), ngứa/mẩn (mề đay), hen (khó thở), viêm da, mắt ngứa/nước mắt. Thời tiết/hoa/phấn hoa/graufoods gây.',
    advice: '① CỐ BIỂU BỔ KHÍ: hoàng kỳ, bạch truật, phòng phong (ngự bình tán ý) — tăng sức đề kháng. ② Phổi: bách hợp, mạch môn, kê trứng (phụ). ③ TRÁNH dị ứng nguyên (phấn hoa, lông thú, bụi, hải sản). ④ Tăng sức đề kháng: vận động, ngủ đủ, giảm đường. ⑤ Dị ứng nặng/khó thở → khám (kháng histamine/xịt mũi/épinephrine nếu sốc).',
  },
  // [loop 1054] +2 phổ biến
  {
    id: 'bad_breath',
    keywords: ['hôi miệng', 'khó thở miệng', 'hơi thở hôi', 'miệng hôi', '口臭', 'hôi miêng', 'hôi mồm'],
    title: 'Hôi miệng (VỊ NHIỆT + trùng thấp uất + can hoả)',
    summary: 'Hôi miệng = «VỊ NHIỆT THƯƠNG THỪA» (vị nhiệt bốc lên miệng) HOẶC can hoả (can hoả xông lên) HOẶC thấp nhiệt ở đại trường (táo bón + phân thối). «Vị khai khiếu tại khẩu» — miệng là cửa của vị.',
    symptoms: 'hơi thở hôi (nhất là sáng), miệng đắng/khô, nổi mụn miệng, khát, tiểu vàng, táo bón hoặc phân dính thối, lưỡi vàng.',
    advice: '① THANH VỊ NHIỆT: thạch cao, hoàng liên, thạch斛, sinh địa, cam thảo. ② SƠ CAN (nếu giận/mắt đỏ): cúc hoa, diệp hạ châu. ③ Giảm cay nóng/thịt đỏ/rượu/đường. ④ Đánh răng + nha khoa (loại trừ viêm nha chu/răng sâu). ⑤ Trà xanh, bạc hà, ngò — thơm miệng tự nhiên. ⑥ Táo bón → chữa (phân thối bốc ngược).',
  },
  {
    id: 'hemorrhoids',
    keywords: ['trĩ', 'bệnh trĩ', 'đau rát hậu môn', 'chảy máu hậu môn', 'ẩm hậu môn', 'sa búi trĩ', '痔疮', 'nứt hậu môn', 'trĩ ngoại', 'trĩ nội'],
    title: 'Bệnh trĩ / Sa trĩ (ĐẠI TRƯỜNG THẤP NHIỆT + khí hư hạ hãm + tràng táo)',
    summary: 'Trĩ thuộc «THẤP NHIỆT HẠ CHÚ» ở đại trường + khí hư hạ hãm (sa trĩ) + tràng táo (táo bón gây). «Trĩ giả phương bệnh» — càng lâu càng nặng. Liên quan TỲ (khí hãm) + ĐẠI TRƯỜNG (thấp nhiệt) + GAN (chủ sơ tiết, hậu môn là mở khiếu của đại trường dưới).',
    symptoms: '(nội trĩ) chảy máu tươi khi đi cầu, sa búi (đẩy lên được); (ngoại trĩ) sưng đau cục ở hậu môn, ẩm ngứa; (thập) đau rát, chảy máu.',
    advice: '① THANH thấp nhiệt: hoàng bá, khổ sâm, địa du, hoè hoa (chống chảy máu). ② THĂNG KHÍ (khí hư sa): hoàng kỳ, sài hồ, thăng ma. ③ CHỮA TÁO BÓN (gốc): uống nước ấm, chất xơ (rau, khoai lang, ý dĩ), tránh rặn mạnh. ④ Ngâm hậu môn nước ấm (15 phút) — giảm sưng. ⑤ Tránh ngồi lâu/đứng lâu/cay nóng/rượu. ⑥ Chảy máu nhiều/sa nặng → khám hậu môn – trực tràng (loại trừ ung thư).',
  },
  // [loop 1055] +2 tim mạch phổ biến
  {
    id: 'hypertension',
    keywords: ['cao huyết áp', 'huyết áp cao', 'tăng huyết áp', 'đo huyết áp', 'huyết áp tâm thu', 'huyết áp tâm trương', '高血压'],
    title: 'Cao huyết áp (CAN DƯƠNG THƯỢNG KHANG + đàm thấp ứ + âm hư dương cương)',
    summary: 'Đông-y: CAO HUYẾT ÁP = «CAN DƯƠNG THƯỢNG KHANG» (dương khí bốc lên đầu) + ĐÀM THẤP Ứ TRỆ (mạch máu hẹp) + ÂM HƯ DƯƠNG CƯƠNG (thận âm hư không hàm dương). 3 kiểu: (a) CAN DƯƠNG — căng đầu, mặt đỏ, mắt choáng; (b) ĐÀM THẤP — nặng đầu, phù, choáng; (c) ÂM HƯ — nóng, khô, mất ngủ.',
    yin: '肝阳上亢型 (CAN DƯƠNG): choáng căng đầu, mặt đỏ, mắt hoa, cáu gắt, cổ gáy cứng, HA tăng khi stress — dương bốc lên đầu.',
    yang: '痰湿内阻型 (ĐÀM THẤP): đầu nặng mệt, phù, buồn nôn, lưỡi rêu nhờn, béo — đàm thấp ứ trệ mạch.',
    symptoms: '(can dương) choáng căng đầu, mặt đỏ, mắt hoa, cáu gắt, cổ gáy cứng; (đàm thấp) đầu nặng, mệt, phù, buồn nôn; (âm hư) nóng bừng, đổ mồ hôi trộm, khô miệng, mất ngủ, thắt lưng mỏi.',
    advice: '① BÌNH CAN TIỀM DƯƠNG: thiên ma, câu đằng, thạch quyết minh, ngọc trúc, thảo quyết minh (theo thầy thuốc). ② HOÁ ĐÀM: bán hạ, phục linh, trần bì, biển súng. ③ DƯỠNG ÂM: thục địa, sơn thù du, quy bản (lục vị ý). ④ Giảm MUỐI/mặn (碱	can), giảm mỡ/đường/rượu. ⑤ Quản lý CÂN NẶNG, vận động đều (đi bộ). ⑥ Giảm STRESS — «nộ thương can», «tâm bình khí hoà». ⑦ ĐO HUYẾT ÁP ĐỀU + uống thuốc y khoa đều (không tự ngưng). ⑧ HA > 160/100 hoặc có triệu chứng → khám tim mạch cấp.',
  },
  {
    id: 'high_cholesterol',
    keywords: ['mỡ máu cao', 'cholesterol cao', 'triglyceride', 'lipid máu', 'mỡ máu', 'cholesterol', '低HDLD', '高LDL', 'tăng lipid', 'vữa xơ động mạch'],
    title: 'Mỡ máu cao / Rối loạn lipid (ĐÀM THẤP + tỳ hư + can uất huyết ư)',
    summary: 'Đông-y: «TÂM PHỔ ĐÀM Ứ» — mỡ = đàm thấp do TỲ HƯ vận hoá kém → đàm thấp tích ở mạch máu + CAN UẤT (stress) + HUYẾT Ư (máu ứ → vữa xơ). Liên quan TỲ (sinh đàm) + GAN (khí uất → huyết ư) + THẬN (dương hư → thấp).',
    yin: 'TỲ HƯ ĐÀM TRỌC型 (TỲ HƯ ĐÀM TRỌC): nặng đầu, mệt, phù nhẹ, đầy bụng, phân lỏng — tỷ hư sinh đàm trọc tích mỡ.',
    yang: 'KHÍ TRỆ Ủ HUYẾT型 (KHÍ TRỆ Ủ HUYẾT): ngực tức, đau tức sườn, lưỡi tím, vữa xơ động mạch — khí trệ → huyết ư → tắc mạch.',
    symptoms: 'thường KHÔNG có triệu chứng rõ (phát hiện qua xét nghiệm). Có thể: nặng đầu, mệt, phù nhẹ, đầy bụng, ngực tức, gan to (nhiễm mỡ), da vàng quanh mắt (xanthelasma).',
    advice: '① KIỆN TỲ HOÁ ĐÀM: ý dĩ, sơn dược, phục linh, trần bì, trạch tả, quyết minh tử, sơn tra. ② HOẠT HUYẾT (chống vữa xơ): đan sâm, xích thược, hồng hoa, tỏi (nhiều). ③ Giảm MỠ bão hoà/trans-fat/thịt đỏ/nội tạng/trứng nhiều. ④ TĂNG cá (omega-3), yến mạch, các loại hạt, rau xanh, đậu. ⑤ VẬN ĐỘNG AEROBIC (đi bộ/bơi — 30+ phút). ⑥ Giảm cân nếu béo, ngừng hút thuốc. ⑧ Xét nghiệm lipid định kỳ + thuốc y khoa (statin nếu cần).',
  },
  // [loop 1057] +2 siêu phổ biến (cảm + ho)
  {
    id: 'common_cold',
    keywords: ['cảm', 'cảm lạnh', 'cảm cúm', 'sổ mũi', 'hắt hơi', 'nhức đầu', 'sốt nhẹ', 'ngạt mũi', 'đau họng cảm', '感冒', 'cảm mạo', 'viêm họng'],
    title: 'Cảm / Cảm cúm (PHONG HÀN / PHONG NHIỆT / KHÍ HƯ CẢM MẠO)',
    summary: 'Đông-y chia cảm thành: (a) PHONG HÀN — chịu lạnh/gió → sợ lạnh, sổ mũi nước trong, không đổ mồ hôi, nhức đầu; (b) PHONG NHIỆT — thời tiết nóng/giải cảm nóng → sốt, đau họng, khát, mũi vàng; (c) KHÍ HƯ CẢM — thể yếu hay cảm lại (vệ khí bất cố).',
    symptoms: '(hàn) sợ lạnh, sổ mũi trong, hắt hơi, nhức đầu, không mồ hôi, cơ đau; (nhiệt) sốt, đau họng đỏ, khát, mũi/vàng, tiểu vàng; (khí hư) hay cảm tái đi tái lại, mệt, tự hãn.',
    advice: 'PHONG HÀN: ① khu phong tán hàn — gừng + đường đỏ + quế nước sôi, hành lá, táo; tắm nước ấm, giữ ấm, xông gió. PHONG NHIỆT: ② sơ phong thanh nhiệt — bạc hà, cúc hoa, ké đầu ngựa, liên kiều,板蓝根 (bản lan căn); trà xanh, khổ qua. KHÍ HƯ: ③ bổ vệ khí — hoàng kỳ, bạch truật, phòng phong (ngự bình tán). CHUNG: ④ nghỉ ngơi, uống nước ấm nhiều, tránh gió lạnh/đám đông. ⑤ Số cao/khó thở/nặng → khám (cúm/viêm phổi).',
  },
  {
    id: 'cough',
    keywords: ['ho', 'đau họng', 'khàn tiếng', 'ho khan', 'ho có đờm', 'ho lâu', 'viêm phế quản', '咳嗽', 'ho về đêm', 'ho kiệt', 'thở khò khè', 'khò khè', 'hen suyễn', 'khó thở'],
    title: 'Ho / Viêm phế quản (PHONG HÀN/PHONG NHIỆT/ĐÀM THẤP/ÂM HƯ)',
    summary: 'Ho đông-y: (a) PHONG HÀN — ho khan, ngứa họng, sợ lạnh, đờm trong (初起); (b) PHONG NHIỆT — ho đau họng, khát, đờm vàng đặc; (c) ĐÀM THẤP — ho nhiều đờm trắng dãi, khò khè, tức ngực; (d) ÂM HƯ — ho khan lâu, khô họng, đêm nặng (phổi âm hư).',
    symptoms: '(hàn) ho khan ngứa họng, sợ lạnh, đờm trong; (nhiệt) ho đau họng đỏ, đờm vàng, khát, sốt; (đàm thấp) ho nhiều đờm trắng đặc, khò khè, tức ngực, nặng người; (âm hư) ho khan lâu, khô họng, đổ mồ hôi trộm, đêm nặng.',
    advice: 'PHONG HÀN: ① tân ôn giải biểu — gừng, tần giao, tử uyển, bách bộ. PHONG NHIỆT: ② sơ phong thanh phế — tang diệp, cúc hoa, liên kiều, bạc hà. ĐÀM THẤP: ③ nh vị hoá đàm — bán hạ, trần bì, phục linh, bạch giới tử. ÂM HƯ: ④ nhuận phổi dưỡng âm — sa sâm, mạch môn, bách hợp, ngọc trúc, xuyên bối mẫu. CHUNG: ⑤ Lê đường phèn hấp (nhuận phổi), gừng + mật ong (ho khan); tránh lạnh/cay. ⑥ Ho lâu >2 tuần/ho máu/khó thở → khám phổi.',
  },
  // [loop 1144] +2 conditions common modern users
  {
    id: 'eye_strain',
    keywords: ['mỏi mắt', 'mắt mỏi', 'giảm thị lực', 'mờ mắt', 'mắt mờ', 'cận thị', 'chong chóng', 'khô mắt', 'thị lực', 'thị lực giảm', 'hay chớp', 'mắt nhìn mờ', 'viễn thị', 'loạn thị', 'đau mắt', '眼'],
    title: 'Mỏi mắt / Giảm thị lực (CAN HUYẾT HƯ + THẬN TINH KHUY) — do dùng máy/điện thoại nhiều',
    summary: '«CAN KHAI VIỆT TRÊN MẮT» (肝开窍于目) — mắt do CAN HUYẾT nuôi + THẬN TINH (thuỷ sinh mộc) làm nền. Dùng mắt quá nhiều (màn hình) → hao can huyết + thận tinh → mắt mỏi, khô, mờ, cận. Nặng: can hoả vượng (đau đầu, đỏ mắt, cận tiến triển nhanh).',
    yin: '肝血虚型 (HUYẾT HƯ — deficiency): mắt khô, nhìn mờ, hay chớp, mặt nhợt, móng giòn, kinh ít, choáng — thiếu máu nuôi mắt.',
    yang: '肝火旺型 (HOẢ VƯỢNG — excess): mắt đỏ,充血, đau nhức, nhạy sáng, miệng đắng, bứt rứt, đau đầu — hoả thừa lên mắt.',
    symptoms: 'mắt mỏi/nhức/cát khô, nhìn mờ tạm thời, chảy nước mắt, nhạy sáng, cận tiến triển, đau đầu trán, chất lượng giấc ngủ kém.',
    advice: '① BỔ CAN HUYẾT — cà rốt, gan, đậu đen, kỷ tử, táo đỏ, atiso, cúc hoa (trà cúc hoa kỷ tử = kinh điển). ② BỔ THẬN TINH — dâu tằm, vừng đen, hạt óc chó (thuỷ sinh mộc → nuôi mắt). ③ TRÀ THANH CAN MINH MẮT — cúc hoa (杭菊) + quyết minh tử (sao) + kỷ tử: hãm uống thay nước. ④ QUY TẮC 20-20-20: mỗi 20 phút nhìn xa 20 feet (6m) trong 20 giây. ⑤ NGỦ TRƯỚC 23h (can đởm phục hồi lúc 1-3h sáng). ⑥ Massage huyệt Tinh minh (睛明) + thái dương. ⑦ Cận >6 đi-ốp hoặc tăng nhanh → khám nhãn khoa.',
    related: '肝 (mộc) → mắt; 肾 (thuỷ) → thuỷ sinh mộc (nuôi can → nuôi mắt). Người 木 vượng: dễ can hoả (đỏ mắt, cận nhanh). Người 水 suy: thận tinh kém → nền mắt yếu.',
  },
  {
    id: 'acid_reflux',
    keywords: ['trào ngược', 'ợ chua', 'ợ hơi', 'nóng rát ngực', 'chảy nước bọt', 'đắng miệng sáng', 'viêm thực quản', 'GERD', 'trào ngược dạ dày', 'axit dạ dày', 'nóng rát thượng vị'],
    title: 'Trào ngược dạ dày / GERD (CAN HOẢ PHẠM VỊ + TỲ VẬN HOÁ KÉM)',
    summary: 'Đông-y: «CAN HOẢ PHẠM VỊ» (can hoả xâm phạm vị) — vị thuộc dương (thuộc hoả), nhận được can hoả thêm → vị hoả vượng → nghịch (khí đi lên thay vì xuống) → trào ngược, ợ chua. Kèm TỲ HƯ (vận hoá kém → thấp trệ → đờm). Thường gặp ở người stress + ăn khuya + nằm ngay sau ăn.',
    yin: '肝胃不和型 (CAN VỊ BẤT HOÀ — stress): ợ chua + bứt rứt, đau tức sườn phải, miệng đắng, dễ cáu — can khí uất phạm vị.',
    yang: '脾胃湿热型 (TỲ VỊ THẤP NHIỆT — damp-heat): ợ chua + đầy bụng, dính nhớt, miệng hôi, phân dính, da nhờn mụn — thấp nhiệt tích tỳ vị.',
    symptoms: 'ợ chua/nóng rát sau ức, đầy bụng, đắng miệng sáng sớm, chảy nước bọt đêm, ho khan (trào ngược ymax ẩn), khàn giọng, buồn nôn.',
    advice: '① HOÀ CAN HÀ VỊ — ô tặc cốt (secuaritee), bé Ngư tinh thảo, trần bì, bán hạ, hoàng cầm, chi tử. ② TRÀ HOÀ CAN — cúc hoa + quyết minh tử + atiso (thanh can hoả). ③ TRÁNH: ăn khuya (trước 19h xong), nằm ngay sau ăn (đợi 2h), cay/nóng/chua/thức ăn chiên/rượu/cafein/trà đặc/socola/cà chua. ④ TĂNG: yến mạch, chuối, gạo tẻ, khoai lang (kiện tỳ). ⑤ VẬN ĐỘNG nhẹ sau ăn (đi bộ). ⑥ Giảm stress (can hoả = stress hoá). ⑦ Nâng đầu giường 15cm khi ngủ. ⑧ Trào ngược >2 lần/tuần kéo dài → khám tiêu hoá (PPI内镜 nếu cần).',
    related: '肝 (mộc) khắc 脾/胃 (thổ): can hoả vượng → khắc hại tỳ vị (mộc khắc thổ). Người 木 vượng: dễ can hoả phạm vị. Người 土 suy: tỳ vị vốn yếu → dễ trào.',
  },
  // [loop 1148] +2 conditions common in Vietnamese users
  {
    id: 'thyroid_nodule',
    keywords: ['bướu cổ', 'bướu giáp', 'thyroid', 'giáp trạng', 'nang giáp', 'hạch giáp', 'cổ to', 'u giáp', '甲亢', '甲减', 'nhiễm độc giáp', 'suy giáp'],
    title: 'Bướu cổ / U giáp trạng (CAN KHÍ UẤT KẾT + KHÍ TRỆ ĐÀM NINH)',
    summary: 'Đông-y: bướu cổ = «nhũ nhuyệt» (thyroid). «CAN KHÍ UẤT KẾT → KHÍ TRỆ → ĐÀM NINH» (can khí uất → khí trệ → đàm đọng thành cục). Thường ở phụ nữ (can chủ sớ tiết → stress/lo âu → uất → đàm ninh ở cổ). Nặng: can hoả vượng (nhiễm độc giáp — hồi hộp, run, sụt cân).',
    yin: '肝気鬱結型 (UẤT KẾT — stress): bướu mềm, di động, đau tức cổ ngực sườn, hay thở dài, bứt rứt, kinh lỡ, lưỡi mỏng rêu trắng.',
    yang: '痰凝血瘀型 (ĐÀM NINH — hard nodules): bướu cứng, cố định, bề mặt sần, có thể đau, nghẹn khó, da tối, lưỡi tím có điểm ứ, rêu nhờn.',
    symptoms: 'cổ to/nhô bướu, nuốt vướng, nghẹn họ, hay khàn giọng, hồi hộp/lo âu, mất ngủ, người gầy hoặc béo (thuỷ thủng), rối loạn kinh nguyệt (phụ nữ).',
    advice: '① SƠ CAN GIẢI UẤT — sài hồ, bạch thược, chỉ xác, uất kim, hương phụ. ② HOÁ ĐÀM TIÊU KẾT — bán hạ, phục linh, trần bì, xạ can, hồ hoàng liên, hải tảo, rong biển. ③ HOÀT HUYẾT — đan sâm, xích thược. ④ Hải tảo + rong biển (tối weekly, iod tự nhiên) + hàu (kẽm). ⑤ Tránh: stress (can uất = nguyên nhân chính), thức khuya, rượu. ⑥ Quản lý cảm xúc — «tâm bình khí hoà, can khí sớ tiết». ⑦ Bướu to/nuốt khó/khàn giọng → khám nội tiết (TSH/T3/T4 + siêu âm giáp).',
    related: '肝 (mộc) → khí uất → đàm ninh. Người 木 uất: can khí trệ → dễ bướu. Người 土 suy: tỳ sinh đàm → đàm thêm. Người 水 suy: thận tinh không dưỡng can → can dương cương.',
  },
  {
    id: 'skin_aging',
    keywords: ['lão hóa da', 'nếp nhăn', 'da khô', 'da xỉn màu', 'da chảy xệ', 'thâm nám mới', 'tàn nhang', 'da mỏng', 'chống lão hóa', 'collagen', 'da thiếu đàn hồi', 'da sần'],
    title: 'Lão hóa da / Da khô nhăn (THẬN TINH KHUY + KHÍ HUYẾT BẤT TÚC)',
    summary: 'Đông-y: «NHẬT CHỦ THÂN, THẬN CHỦ CỐT, TỲ CHỦ NHỤC, PHỔI CHỦ BÌ MAO». Da = phổi (kim) + nuôi bởi TỲ HUYẾT + nền THẬN TINH. Lão hóa sớm = thận tinh khuy (thuỷ suy) + tỳ huyết hư (không nuôi da) + phế khí yếu. Nắng/stress/thức khuya → hao tinh → da xỉn/nhăn.',
    yin: '肾精亏型 (TINH KHUY — deficiency): da khô, mỏng, xỉn, nhăn sớm, kèm thắt lưng mỏi, tóc rụng, hay hoa mắt — thận tinh không nuôi.',
    yang: '气血两虚型 (KHÍ HUYẾT LƯỠNG HƯ — double def): mặt nhợt, da xanh, môi nhạt, móng giòn, mệt mỏi, hay choáng — khí huyết không lên da.',
    symptoms: 'da khô, nhăn quanh mắt/miệng, xỉn màu, chảy xệ, thâm nám mới, tàn nhang tăng, da mỏng dễ bầm, thiếu đàn hồi.',
    advice: '① BỔ THẬN TINH — đậu đen, vừng đen, sơn dược, kỷ tử, hà thủ ô. ② BỔ TỲ HUYẾT — táo đỏ, long nhãn, kỳ tử, đương quy, thục địa. ③ DƯỠNG PHẾ (da thuộc phổi) — lê, mộc nhĩ trắng, bách hợp, hạnh nhân. ④ TRÀ CHỐNG LÃO HÓA — kỷ tử + táo đỏ + cúc hoa: hãm uống. ⑤ TĂNG COLLAGEN tự nhiên — chân giò nấu (gelatin), cá (omega-3), đậu nành (isoflavone). ⑥ TRÁNH nắng (UV = hao tinh + da), thức khuya (thận phục hồi ban đêm), đường (glycation → nhăn). ⑦ Massage mặt + châm cứu (bổ khí huyết). ⑧ Da nhăn nhanh/chảy xệ → khám da liễu.',
    related: '肾 (thuỷ) → tinh nuôi nội tiết → da. 肺 (kim) → chủ bì mao. 脾 (thổ) → sinh huyết nuôi da. Người 水 suy: thận tinh khuy → da lão hóa nhanh. Người 金 suy: phế khí yếu → da mỏng/khô.',
  },
  // [loop 1154] +2 conditions common in Vietnamese users
  {
    id: 'anemia',
    keywords: ['thiếu máu', 'máu ít', 'xanh xao', 'mệt mỏi kéo dài', 'chóng mặt khi đứng', 'khí hư', 'huyết hư', 'kinh nguyệt nhiều', 'mặt nhợt', 'mắt mờ do máu kém', 'sức đề', 'huyết sắc tố thấp', 'ferritin thấp', 'sắt thấp', 'chán ăn', '气虚', '血虚'],
    title: 'Thiếu máu / Khí huyết lưỡng hư (TỲ KHÔNG SINH HUYẾT + THẬN TINH KHUY)',
    summary: 'Đông-y: «TỲ VIÊU HẬU THIÊN CHI BẢN, CHỦ VẬN HOÁ → SINH HUYẾT». Máu do TỲ (đất) vận hoá + vật liệu từ THẬN TINH (nước). Khí hư → không sinh được huyết. Huyết hư → khí không chỗ依附 → lưỡng hư. Phụ nữ mất máu (kinh/sinh) + ăn kém → dễ thiếu máu.',
    yin: '脾不生血型 (TỲ HƯ — spleen def): mặt nhợt, mệt, chán ăn, đầy bụng, phân lỏng, nói yếu — tỳ không vận hoá sinh huyết.',
    yang: '肾精亏虚型 (THẬN TINH KHUY — kidney def): choáng tai ù, thắt lưng mỏi, tóc rụng, móng giòn, kinh ít, hay quên — tinh không hoá huyết.',
    symptoms: 'mặt nhợt/xanh xao, môi nhạt, móng trắng giòn, chóng mặt khi đứng, mệt mỏi, hơi thở ngắn, tim đập nhanh, mắt mờ, kinh nguyệt ít/nhiều/không đều, sắt thấp (ferritin/huyết sắc tố).',
    advice: '① BỔ KHÍ SINH HUYẾT — đương quy, thục địa, bạch thược, kỷ tử, táo đỏ, long nhãn, sâm (nhân sâm/đảng sâm), hoàng kỳ. ② THỰC PHẨM GIÀU SẮT — gan, thịt đỏ, rau muống, rau ngót, đậu đen, mồng tơi, lòng đỏ trứng. ③ KẾT HỢP VITAMIN C (cam, chanh, ổi) → tăng hấp thu sắt. ④ TRÁNH: trà/cà phê ngay sau ăn (tanin ức chế sắt), ăn kiêng thiếu protein. ⑤ THANG KINH ĐIỂN: Bát trân thang / Quy tỳ thang / Tứ vật thang. ⑥ Phụ nữ kinh nhiều → điều kinh + bổ huyết (kế tục). ⑦ Huyết sắc tố <90 g/L → khám y khoa (sắt/uống sắt/yếu tố).',
    related: '脾 (thổ) → sinh huyết. 肾 (thuỷ) → tinh → tủy → huyết. Người 土 suy: tỳ không sinh huyết. Người 水 suy: thận tinh kém → tủy kém → huyết kém.',
  },
  {
    id: 'migraine',
    keywords: ['đau nửa đầu', 'đau một bên đầu', 'migraine', 'đau đầu giật', 'đau đầu từng cơn', 'đau đầu_khiển nảy', 'nhạy sáng', 'buồn nôn khi đau đầu', 'đau đầu_before kinh', 'chóng mặt nặng', 'đau đầu_pound', '偏头'],
    title: 'Đau nửa đầu / Migraine (CAN DƯƠNG THƯỢNG KHÁNG + Ứ HUYẾT + PHONG)',
    summary: 'Đông-y: «CAN DƯƠNG THƯỢNG KHÁNG» (can dương lên cao) + «PHONG HOẢ» (gió lửa) → đau giật một bên đầu. Stress/mệt/căng thẳng → can khí uất → can dương cương → phong hoả theo kinh can lên đầu. Nặng: buồn nôn, nhạy sáng/âm thanh. Có type kinh nguyệt (trước kinh → huyết hư → can dương mất chế → đau).',
    yin: '肝陽上亢型 (DƯƠNG CƯƠNG — acute throbbing): đau giật dữ dội, mặt đỏ, mắt充血, bứt rứt, dễ giận, miệng đắng, huyết áp có thể cao, lưỡi đỏ rêu vàng.',
    yang: '瘀血阻絡型 (Ứ HUYẾT — chronic fixed): đau cố định một vị trí, châm chích, kéo dài, da môi tối, có vết bầm, kinh huyết tối có cục, lưỡi tím có điểm ứ.',
    symptoms: 'đau giật/nhói một bên (thường h Thái dương), có «aura» (chớp sáng, mờ tạm), buồn nôn/nôn, nhạy sáng + tiếng ồn, đau tăng khi vận động, có thể liên quan kinh nguyệt.',
    advice: '① BÌNH CAN TIỀM DƯƠNG — thiên ma (gastrodia), câu đằng (uncaria), thạch quyết minh, ngọc trúc, sinh địa. ② HOẠT HUYẾT THÔNG LẠC — đan sâm, xích thược, xuyên khung (川芎 = thần dược đau đầu). ③ TRÀ THANH CAN — cúc hoa (10g) + quyết minh tử (10g) + bạc hà (5g). ④ HUYỆT CHÂM — Thái dương, Phong trì, Hợp cốc, Thái xung. Massage huyệt Thái dương + gáy khi đau. ⑤ TRÁNH: stress (trigger #1), thiếu ngủ, cà phê/rượu/thức ăn mặn/phô mai/chocolate (trigger migraine), nắng gắt, tiếng ồn. ⑥ NHỊP: ngủ đủ (thận phục hồi), giảm screen time. ⑦ Đau >72h / nôn nhiều / liệt / co giật → cấp cứu.',
    related: '肝 (mộc) → can dương thượng kháng. 肾 (thuỷ) → thuỷ bất涵 mộc → can dương cương. Người 木 vượng: dễ can hoả → migraine. Người 水 suy: thận không nuôi can → can dương.',
  },
  // [loop 1160] cervical spondylosis — extremely common in modern screen users
  {
    id: 'cervical_spondylosis',
    keywords: ['đau mỏi vai gáy', 'thoái hóa đốt sống cổ', 'cứng cổ', 'đau cổ vai gáy', 'tê tay do cổ', 'chóng mặt xoay cổ', 'thoái hóa cổ', 'vôi hóa cổ', 'đau gáy', 'mỏi gáy', 'cervical', 'đau bả vai', 'tê ngón tay', 'khó quay cổ', '颈'],
    title: 'Đau mỏi vai gáy / Thoái hóa đốt sống cổ (CAN THẬN BẤT TÚC + KHÍ TRỆ Ứ HUYẾT)',
    summary: 'Đông-y: cổ gáy = vùng KINH CAN + KINH ĐỞM đi qua. «CAN CHỦ CÂN» (gân), «THẬN CHỦ CỐT» (xương). Ngồi máy/điện thoại lâu → khí trệ ở cổ vai gáy → ứ huyết → đau mỏi. Nặng: thoái hóa đốt sống (xương = thận), chèn dây thần kinh → tê tay. Can khí uất + thận tinh khuy → gân xương yếu → thoái hóa.',
    yin: '气滞血瘀型 (KHÍ TRỆ Ứ HUYẾT — stasis): đau nhức từng cơn, cứng cổ buổi sáng, đau tăng khi thời tiết thay đổi, bóp massage đỡ — kinh lạc trệ.',
    yang: '肝肾不足型 (CAN THẬN BẤT TÚC — deficiency): đau mỏi kéo dài, nhức âm ỉ, thẳng lưng mỏi, đầu gối yếu, hay hoa mắt, tóc rụng — tinh huyết không nuôi gân xương.',
    symptoms: 'đau mỏi vai gáy (nhất là sau ngồi lâu), cứng cổ buổi sáng, tê/buốt tay (chèn dây thần kinh), chóng mặt khi quay cổ, đau đầu cổ gáy, khò khè âm thanh (đôi khi), mệt mỏi.',
    advice: '① BỔ CAN THẬN — đậu đen, vừng đen, kỷ tử, sơn dược, hà thủ ô (nuôi gân xương). ② HOÀT HUYẾT THÔNG LẠC — đan sâm, xích thược, xuyên khung, xuyên tục đoạn, cốt toái bổ (bổ xương). ③ TRÀ CAN THẬN — cúc hoa + kỷ tử + đậu đen rang (hãm uống). ④ MASSAGE CỔ GÁY — day huyệt Phong trì (風池), Thiên trụ, Hợp cốc; xoa nóng lòng bàn tay áp cổ. ⑤ VẬN ĐỘNG CỔ — xoay cổ chậm 8-10 lần/chiều, kéo giãn vai gáy mỗi 30 phút ngồi máy. ⑥ TRÁNH: ngồi/nằm sai tư thế, gập cổ xem điện thoại («text neck»), ngủ gối cao. ⑦ CHIẾU ĐÈN ĐỎ (hồng ngoại) hoặc châm cứu vùng cổ gáy. ⑧ Tê tay kéo dài/chóng mặt nặng → khám thần kinh (cervical MRI nếu cần).',
    related: '肝 (mộc) → chủ cân (gân) → cổ gáy. 肾 (thuỷ) → chủ cốt (xương) → đốt sống. Người 木 uất: can khí trệ → đau gáy. Người 水 suy: thận tinh khuy → xương thoái hóa.',
  },
];

/**
 * Phân tích sức khoẻ đông y TỪ ngũ hành vượng suy của lá số.
 * @param {object} R — từ analyze() (cần R.wx.score/pct + R.chart.dayMaster.wx)
 * @returns {{ constitution, weak:[], strong:[], susceptible, dietAdvice, lifestyle, notes }}
 */
export function analyzeHealth(R) {
  if (!R || !R.wx || !R.wx.pct) return { ok: false, error: 'Thiếu ngũ hành' };
  const pct = R.wx.pct;
  const dmWx = R.chart?.dayMaster?.wx;
  // xếp hạng ngũ hành theo % (suy → yếu, vượng → mạnh)
  const ranked = Object.entries(pct).map(([wx, p]) => ({ wx, p })).sort((a, b) => a.p - b.p);
  const weak = ranked.slice(0, 2);       // 2 hành yếu nhất → tạng HƯ
  const strong = ranked.slice(-2).reverse(); // 2 hành mạnh nhất → tạng THỰC/dư

  const weakInfo = weak.map(({ wx, p }) => {
    const z = WUX_ZANG[wx];
    const mother = Object.keys(SHENG).find((k) => SHENG[k] === wx); // mẫu tạng (sinh ta) — bổ mẫu để sinh ta
    return {
      wx, pct: +p.toFixed(1), zang: z.zang,
      type: 'HƯ (yếu)', tone: 'sus',
      syndromes: z.xu, disease: z.disease,
      nourish: z.nourish,
      motherTip: mother ? `Theo «bổ mẫu sinh tử» — bổ ${WUX_ZANG[mother].zang.split(' ')[0]} (${mother}) để sinh ${wx}.` : '',
    };
  });
  const strongInfo = strong.map(({ wx, p }) => {
    const z = WUX_ZANG[wx];
    return {
      wx, pct: +p.toFixed(1), zang: z.zang,
      type: 'THỰC (ứ/dư) hoặc tạng bị nó khắc bị hại',
      syndromes: z.shi, disease: z.disease,
      damage: `Khắc ${KE[wx]} → ${WUX_ZANG[KE[wx]].zang.split(' ')[0]} bị ép (xem ${WUX_ZANG[KE[wx]].xu[0].split(' — ')[0]}).`,
    };
  });

  const susceptible = [...weakInfo.map((w) => w.disease)];
  // [loop 1028] 情志养ổ (五志) — cảm xúc nổi trội (tạng vượng) + nguy cơ cảm xúc tổn tạng.
  //   Cổ法 «nộ thương can, hỉ thương tâm, tư thương tỳ, bi thương phổi, khủng thương thận».
  const ZHI_VI = { 怒: 'giận', 喜: 'vui mừng', 思: 'lo nghĩ', 悲: 'buồn rầu', 恐: 'sợ hãi' };
  const ZHI_DMG = {
    怒: '«nộ thương can» — giận dữ khiến can khí thượng nghịch (đau đầu, mắt đỏ, HA, kinh nguyệt rối).',
    喜: '«hỉ thương tâm» — vui mừng quá mức làm tâm khí hoãn (hồi hộp, mất ngủ, trống ngực).',
    思: '«tư thương tỳ» — lo nghĩ quá làm tỳ khí trệ (chán ăn, đầy bụng, mệt, mất ngủ).',
    悲: '«bi thương phổi» — buồn rầu hao phổi khí (thở hụt, suy nhược, hay cảm).',
    恐: '«khủng thương thận» — sợ hãi hạ thương thận khí (tiểu không tự chủ, hạ nguyên khí, choáng).',
  };
  const domZhi = strong[0] ? WUX_ZANG[strong[0].wx].zhi[0] : ''; // ký tự Hán đầu (怒/喜/思/悲/恐)
  const vulnZhi = weak[0] ? WUX_ZANG[weak[0].wx].zhi[0] : '';
  const emotion = domZhi ? {
    dominant: `${ZHI_VI[domZhi]} (${domZhi}) — do ${WUX_ZANG[strong[0].wx].zang.split(' ')[0]} (${strong[0].wx}) vượng → thiên lệch cảm xúc này.`,
    dominantRisk: ZHI_DMG[domZhi],
    vulnerable: weak[0] ? `${WUX_ZANG[weak[0].wx].zang.split(' ')[0]} (${weak[0].wx}) vốn HƯ → dễ bị «${ZHI_VI[vulnZhi]} (${vulnZhi}) thương» nhất, cần điều tiết.` : '',
    advice: '«情志养ổ»: cảm xúc quá mức tổn tạng tương ứng. Bình tâm, điều tiết — «tâm tĩnh tự nhiên lãnh».',
  } : null;
  const dietAdvice = weak.map(({ wx }) => `${WUX_ZANG[wx].zang.split(' ')[0]} (${wx}, ${wx === dmWx ? 'NHẬT CHỦ' : 'hành suy'}): thiên ${DIET[wx].color}; ${WUX_ZANG[wx].nourish}`);
  const lifestyle = [
    'Ngủ sớm (trước 23h) — can đởm/tam tiêu phục hồi; «dược bổ bất như thực bổ, thực bổ bất như thuỷ bổ, thuỷ bổ bất như nhân bổ».',
    weak.some((w) => w.wx === '水') ? 'Thận (thuỷ) yếu → TIẾT DỤC BẢO TINH, giữ ấm thắt lưng/chân, ăn đen (đậu đen/vừng đen).' : '',
    weak.some((w) => w.wx === '木') ? 'Can (mộc) yếu → bớt tức giận/lo âu («nộ thương can»), rau xanh, ngủ đúng giờ.' : '',
    weak.some((w) => w.wx === '土') ? 'Tỳ (thổ) yếu → tránh sinh lạnh/quá no, ăn ấm, bớt lo nghĩ.' : '',
    strong.some((s) => s.wx === '火') ? 'Hoả (tim) vượng → giảm cay nóng/rượu/thức khuya, thanh nhiệt (đắng).' : '',
  ].filter(Boolean);

  return {
    ok: true,
    constitution: dmWx ? `Nhật chủ ${dmWx} — bản tính liên quan ${WUX_ZANG[dmWx].zang.split(' ')[0]} (${WUX_ZANG[dmWx].zhi}, ${WUX_ZANG[dmWx].season}).` : '',
    weak: weakInfo, strong: strongInfo,
    susceptible, dietAdvice, lifestyle, emotion,
    note: 'Đông-yProfile suy luận TỪ ngũ hành vượng suy → tạng hư/thực (không thay thế chẩn đoán y khoa). «Hoàng Đế Nội Kinh»: cần kết hợp thực tế + vị bác sĩ đông y.',
  };
}

// [loop 1025] CONDITION_WX — ngũ hành/tạng liên quan tới mỗi chứng (để cá nhân hoá theo lá số).
const CONDITION_WX = {
  kidney_jing: ['水'], liver_fire: ['木'], spleen_xu: ['土'],
  insomnia: ['火', '水'], hair_loss: ['水', '木'], acne_skin: ['金', '土'],
  fatigue: ['土', '金'], cold_limbs: ['水', '土'], tinnitus: ['水', '木'],
  back_knee: ['水'], constipation: ['金'], sweat: ['金', '水'],
  stomach_pain: ['土', '木'], dysmenorrhea: ['木', '水'],
  irregular_period: ['木', '土', '水'], infertility: ['水', '木'], menopause: ['水'],
  // [loop 1038] +5 bệnh mãn tính
  xiao_ke: ['土', '水'], gout: ['土'], eczema: ['土', '木'], fatty_liver: ['木', '土'], prostate_bph: ['水', '土'],
  // [loop 1050] +2 tâm thần
  anxiety: ['火', '水', '木'], depression: ['木', '火', '土'],
  // [loop 1052] +3 thường gặp
  dizziness: ['木', '火'], obesity: ['土'], allergy: ['金', '土'],
  // [loop 1054] +2 phổ biến
  bad_breath: ['土', '火'], hemorrhoids: ['金', '土'],
  // [loop 1055] +2 tim mạch
  hypertension: ['木', '火', '水'], high_cholesterol: ['土', '木'],
  // [loop 1057] +2 siêu phổ biến
  common_cold: ['金', '土'], cough: ['金', '土'],
  // [loop 1145] +2 conditions from loop 1144
  eye_strain: ['木', '水'], acid_reflux: ['木', '土'],
  // [loop 1148] +2 conditions
  thyroid_nodule: ['木', '土', '水'], skin_aging: ['水', '土', '金'],
  // [loop 1154] +2 conditions
  anemia: ['土', '水'], migraine: ['木', '火', '水'],
  // [loop 1160] cervical spondylosis
  cervical_spondylosis: ['木', '水'],
};

/**
 * Trả lời câu hỏi sức khoẻ đông y — khớp từ khoá với CONDITION_KB, cá nhân hoá theo lá số.
 * @param {string} q — câu hỏi người dùng
 * @param {object} R — (tuỳ chọn) lá số để cá nhân hoá (thuỷ = thận mạnh/yếu?)
 */
export function answerHealth(q, R) {
  const ql = (q || '').toLowerCase();
  // [loop 1150/1162] relevance-scored match: tổng keyword-length CHÍNH + keyword-count
  //   PHỤ (tiebreak). Vd «đau khớp sưng» → gout (2 keywords: đau khớp + sưng khớp)
  //   thắng back_knee (1 keyword: đau khớp) dù cùng tổng length.
  const _scored = CONDITION_KB.map((c) => {
    let _score = 0, _count = 0;
    for (const k of c.keywords) { if (ql.includes(k.toLowerCase())) { _score += k.length; _count++; } }
    return { c, _score, _count };
  }).filter((x) => x._score > 0).sort((a, b) => b._score - a._score || b._count - a._count);
  const hit = _scored.length ? _scored[0].c : null;
  if (!hit) return { ok: false, matched: false, reply: 'Tôi chưa có cơ sở tri thức đông-y cụ thể cho câu này. Hãy hỏi về: thận hư/thủ dâm/sinh lý, can hoả/stress/đau đầu, tỳ vị/tiêu hoá, mất ngủ/rụng tóc/mụn/kinh nguyệt, mỏi mắt, trào ngược, bướu cổ, lão hóa da, thiếu máu, đau nửa đầu/migraine, ho/khò khè, huyết áp cao, mỡ máu, đau khớp/thắt lưng — hoặc xem phân tích sức khoẻ theo ngũ hành của lá số.' };
  let reply = `【${hit.title}】\n${hit.summary}\n`;
  if (hit.yin) reply += `\n• ${hit.yin}\n`;
  if (hit.yang) reply += `• ${hit.yang}\n`;
  if (hit.symptoms) reply += `\nTriệu chứng: ${hit.symptoms}\n`;
  if (hit.advice) reply += `\nLời khuyên: ${hit.advice}\n`;
  if (hit.related) reply += `\nLiên quan ngũ hành: ${hit.related}\n`;
  // [loop 1025] cá nhân hoá cho MỌI condition — ngũ hành liên quan tới chứng, so vượng suy lá số.
  let personal = '';
  if (R && R.wx && R.wx.pct) {
    const pct = R.wx.pct;
    const avg = Object.values(pct).reduce((a, b) => a + b, 0) / 5;
    const rel = CONDITION_WX[hit.id] || [];
    const notes = rel.map((wx) => {
      const p = pct[wx];
      if (p == null) return '';
      const zang = WUX_ZANG[wx].zang.split(' ')[0];
      const pp = (+p.toFixed(1));
      if (p < avg * 0.8) return `${zang}(${wx}) ${pp}% — YẾU (thiên hư) → dễ mắc/vulnerable, cần bổ ${wx} nhiều hơn`;
      if (p < avg) return `${zang}(${wx}) ${pp}% — hơi yếu → nên phòng + bổ nhẹ`;
      if (p > avg * 1.2) return `${zang}(${wx}) ${pp}% — VƯỢNG (thiên thực) → chứng này ít do hư, nhưng tránh «thực chứng» (vd hoả vượng → tả)`;
      return `${zang}(${wx}) ${pp}% — cân → nguy cơ trung bình`;
    }).filter(Boolean);
    if (notes.length) personal = `\n Bản LA SỐ: ${notes.join('; ')}.`;
  }
  // [loop 1151/1156] expose multi-match info + surface in reply text
  const _otherMatches = _scored.slice(1, 3).map((x) => ({ id: x.c.id, title: x.c.title }));
  let _relatedHint = '';
  if (_scored.length > 1) {
    const _others = _scored.slice(1, 3).map((x) => x.c.title.split(' — ')[0].split('(')[0].trim()).join('; ');
    _relatedHint = `\n\n💡 Có thể bạn cũng quan tâm: ${_others}.`;
  }
  return { ok: true, matched: true, id: hit.id, title: hit.title, reply: reply + personal + _relatedHint, matchedCount: _scored.length, otherMatches: _otherMatches };
}

/**
 * [loop 1027] 四季养ổ (thời tiết dưỡng tạng) — đông-y «春养肝, 夏养心, 秋养肺, 冬养肾»
 *   (Hoàng Đế Nội Kinh «四气调神大论»: «春夏养阳, 秋冬养阴»).
 * @param {string} monthZhi — chi tháng (xác định mùa)
 * @returns {{ season, wx, zang, vi, advice, userTip }}
 */
export function seasonalHealth(monthZhi, R) {
  const SPRING = ['寅', '卯', '辰'], SUMMER = ['巳', '午', '未'], AUTUMN = ['申', '酉', '戌'];
  let season, wx, zang, vi, advice;
  if (SPRING.includes(monthZhi)) { season = 'Xuân'; wx = '木'; zang = '肝'; vi = 'Gan';
    advice = '«Xuân dưỡng can» — can chủ sơ tiết, sinh phát (mộc phồn vượng). Bớt tức giận («nộ thương can»), rau xanh (rau ngót/rau má/atiso), ngủ sớm, vận động nhẹ phát tán sinh khí.'; }
  else if (SUMMER.includes(monthZhi)) { season = 'Hạ'; wx = '火'; zang = '心'; vi = 'Tim';
    advice = '«Hạ dưỡng tâm» — tim chủ hoả, sợ nóng. Thanh nhiệt dưỡng tâm: khổ qua, sen tâm, trà xanh, đậu đỏ; tránh nắng gắt/cay nóng/rượu, ngủ trưa («tý/ngọ giác» dưỡng tâm), giữ tâm tĩnh.'; }
  else if (AUTUMN.includes(monthZhi)) { season = 'Thu'; wx = '金'; zang = '肺'; vi = 'Phổi';
    advice = '«Thu dưỡng phổi» — phổi chủ khí, sợ táo (thu táo). Nhuận phổi: lê đường phèn, bách hợp, mộc nhĩ trắng, hạnh nhân, kỷ tử; tránh khô lạnh, giữ ẩm, ít cay.'; }
  else { season = 'Đông'; wx = '水'; zang = '肾'; vi = 'Thận';
    advice = '«Đông dưỡng thận» — thận chủ tàng tinh, sợ lạnh (thuỷ tương ứng). Ôn bổ: đậu đen, vừng đen, hạt óc chó, hà thủ ô, kỷ tử; giữ ấm thắt lưng/chân, ngủ sớm dậy muộn, tiết dục bảo tinh («đông tàng»).'; }
  // cá nhân hoá: nếu tạng mùa này LÀ tạng yếu của lá số → càng cần dưỡng
  let userTip = '';
  if (R && R.wx && R.wx.pct) {
    const p = R.wx.pct[wx];
    const avg = Object.values(R.wx.pct).reduce((a, b) => a + b, 0) / 5;
    if (p != null && p < avg) userTip = `Lá số của bạn ${zang} (${vi}, ${wx}) vốn thiên HƯ — mùa này ĐÚNG tạng cần dưỡng, nên chú trọng bồi bổ hơn.`;
  }
  return { season, wx, zang, vi, advice, userTip };
}

/**
 * [loop 1084] 十二長生 sinh khí → TCM tạng — liên kết «khí vượng suy» của Nhật Chủ
 *   (theo day-stage 流日) với tạng tương ứng + lời khuyên đông y. Đúng yêu cầu user:
 *   «đông y liên quan ngũ hành, khí vượng suy — người hay [mệt/thủ đâm...] nên ntn».
 *   - stage 旺 (帝旺/臨官/長生/冠帶) → tạng THỰC, khí thịnh → hợp hoạt động, cẩn thận
 *     «vượng cực sinh nội nhiệt», dễ thiên lệch ngũ chí + hội chứng «thực».
 *   - stage suy (衰/病/死/墓/絕) → tạng HƯ → giữ sức, bồi bổ (nourish).
 *   - stage trung chuyển (沐浴/胎/養) → duy trì điều hoà.
 * @param {string} dayGanWx — ngũ hành Nhật Chủ (R.chart.dayMaster.wx)
 * @param {string} stage  — 十二长生 stageVi (lr.dayStage)
 * @param {number} stageW — stage weight (lr.dayStageWeight)
 * @returns {{ tone, headline, advice } | null}
 */
export function stageHealth(dayGanWx, stage, stageW) {
  if (!dayGanWx || !stage) return null;
  const z = WUX_ZANG[dayGanWx];
  if (!z) return null;
  const zang = z.zang;        // '肝 (Gan)'
  const emo = z.zhi;          // '怒 (giận)'
  const _short = (s) => (s ? String(s).split(' — ')[0].split(' ')[0] : '');
  if (stageW > 0) {
    return {
      tone: 'thinh',
      headline: `${zang} khí THỊNH · ${stage}`,
      advice: `Hôm nay ${zang} vượng → năng lượng dồi dào, hợp vận động/việc cần thể lực. Cẩn thận «vượng cực hoá nội nhiệt»: dễ thiên ${emo} + ${_short(z.shi[0])}. Điều tiết cảm xúc, tránh bồi bổ quá/tinh dầu dư.`,
    };
  }
  if (stageW < 0) {
    return {
      tone: 'suy',
      headline: `${zang} khí SUY · ${stage}`,
      advice: `Hôm nay ${zang} suy → giữ sức, ngủ sớm (tránh thức đêm đoạt khí), bồi bổ nhẹ. Dễ ${_short(z.xu[0])}. ${z.nourish}`,
    };
  }
  return {
    tone: 'chuyen',
    headline: `${zang} khí trung chuyển · ${stage}`,
    advice: `Sinh khí đang chuyển — duy trì điều hoà, nuôi dưỡng ${zang} (tránh cực đoan).`,
  };
}

/**
 * [loop 1086] DECADE HEALTH ARC — sức khoẻ dọc cuộc đời theo 十二长生 các đại vận.
 *   Nhật Chủ (tạng cốt lõi) đi qua 12長生 ở mỗi thập niên → sinh khí lên/xuống.
 *   «运逢帝旺如日中天, 运逢墓绝如秋冬»: thập niên 帝旺 = tạng thịnh (đỉnh sức khoẻ),
 *   thập niên 死/墓/绝 = tạng suy (cần dưỡng/tránh quá sức). Dùng stageHealth cho từng decade.
 *   Reuse: dayun stages (chart.js computeDaYun) + stageHealth (loop 1084).
 * @returns {{ items:[{startAge,ganZhi,stage,stageWeight,tone,headline,advice}], current, peak, low } | null}
 */
export function decadeHealthArc(R) {
  const dayGan = R && R.chart && R.chart.dayGan;
  const dmWx = R && R.chart && R.chart.dayMaster && R.chart.dayMaster.wx;
  const dayun = R && R.dayun ? R.dayun : [];
  if (!dayGan || !dmWx || !dayun.length) return null;
  const items = dayun.map((d) => {
    const stage = d.zhi ? changSheng(dayGan, d.zhi) : '';
    const stageW = STAGE_WEIGHT[stage] || 0;
    const stageVi = STAGE_VI[stage] || '';
    const sh = stageHealth(dmWx, stageVi, stageW);
    return { startAge: d.startAge, ganZhi: d.ganZhi, stage: stageVi, stageWeight: stageW, tone: sh ? sh.tone : '', headline: sh ? sh.headline : '', advice: sh ? sh.advice : '' };
  }).filter((it) => it.stage);
  if (!items.length) return null;
  // thập niên hiện tại (theo tuổi)
  const _yr = new Date().getFullYear();
  const birthYr = (R && R.chart && R.chart.input && R.chart.input.year) || (_yr - 30);
  const curAge = _yr - birthYr;
  let curIdx = items.findIndex((it) => curAge >= it.startAge && curAge < it.startAge + 10);
  if (curIdx < 0) { // ngoài khoảng → gần nhất
    let bd = Infinity, bi = -1; items.forEach((it, i) => { const dd = Math.abs(curAge - (it.startAge + 5)); if (dd < bd) { bd = dd; bi = i; } }); curIdx = bi;
  }
  const sorted = [...items].sort((a, b) => b.stageWeight - a.stageWeight);
  return {
    organ: dmWx, // ngũ hành Nhật Chủ → tạng cốt lõi
    items: items.map((it) => ({ startAge: it.startAge, ganZhi: it.ganZhi, stage: it.stage, stageWeight: it.stageWeight, tone: it.tone, headline: it.headline, advice: it.advice.slice(0, 180) })),
    current: curIdx >= 0 ? { ...items[curIdx], idx: curIdx } : null,
    peak: sorted[0] || null,       // thập niên sinh khí ĐỈNH
    low: sorted[sorted.length - 1] || null, // thập niên sinh khí SUY nhất
  };
}


/**
 * [loop 1039] 子午流注 (đồng hồ kinh mạch) — 12 时辰 → 12 kinh mạch khí đỉnh.
 *   Cổ法 «子午流注纳子法»: mỗi 时辰 (2h) có 1 kinh mạch khí huyết đỉnh.
 *   Nguồn: «黄帝内经·灵枢» kinh mạch tuần thứ: 寅肺→卯大肠→辰胃→巳脾→午心→未小肠→申膀胱→酉肾→戌心包→亥三焦→子胆→丑肝.
 * @param {string} hourZhi — chi giờ (子..亥)
 * @returns {{ zhi, hours, meridian, organ, wx, advice }}
 */
export const MERIDIAN_CLOCK = {
  寅: { hours: '3-5h', meridian: '手太阴肺经', organ: 'Phổi (肺)', wx: '金', advice: 'khí phổi đỉnh → tập thở/yoga/khởi động nhẹ; uống nước ấm; tránh thức dậy quá muộn.' },
  卯: { hours: '5-7h', meridian: '手阳明大肠经', organ: 'Đại trường (大肠)', wx: '金', advice: 'đại trường đỉnh → giờ VÀNG đi đại tiện; uống nước ấm; vận động sáng.' },
  辰: { hours: '7-9h', meridian: '足阳明胃经', organ: 'Vị (胃)', wx: '土', advice: 'vị đỉnh → ăn sáng ĐẦY ĐỦ (bữa ăn quan trọng nhất); dinh dưỡng absorption tốt nhất.' },
  巳: { hours: '9-11h', meridian: '足太阴脾经', organ: 'Tỳ (脾)', wx: '土', advice: 'tỳ đỉnh → làm việc/học tập hiệu quả nhất; chuyển hoá năng lượng tốt; tránh ngọt quá.' },
  午: { hours: '11-13h', meridian: '手少阴心经', organ: 'Tim (心)', wx: '火', advice: 'tim đỉnh → ngủ trưa ngắn («tý ngọ giác» dưỡng tâm); tránh vận động mạnh/cáu gắt.' },
  未: { hours: '13-15h', meridian: '手太阳小肠经', organ: 'Tiểu trường (小肠)', wx: '火', advice: 'tiểu trường đỉnh → tiêu hoá trưa; uống nước; tránh ăn quá no trưa.' },
  申: { hours: '15-17h', meridian: '足太阳膀胱经', organ: 'Bàng quang (膀胱)', wx: '水', advice: 'bàng quang đỉnh → uống nước/thải độc; làm việc cần tập trung; vận động OK.' },
  酉: { hours: '17-19h', meridian: '足少阴肾经', organ: 'Thận (肾)', wx: '水', advice: 'THẬN ĐỈNH → giờ VÀNG bổ thận (massage thắt lưng, tập chân, ăn tối nhẹ); tiết dục.' },
  戌: { hours: '19-21h', meridian: '手厥阴心包经', organ: 'Tâm bào (心包)', wx: '火', advice: 'tâm bào đỉnh → thư giãn, giao tiếp, vui vẻ (bảo vệ tim); tránh stress.' },
  亥: { hours: '21-23h', meridian: '手少阳三焦经', organ: 'Tam tiêu (三焦)', wx: '火', advice: 'tam tiêu đỉnh → CHUẨN BỊ NGỦ; cơ thể bắt đầu nghỉ ngơi; tránh ăn/screen.' },
  子: { hours: '23-1h', meridian: '足少阳胆经', organ: 'Đởm (胆)', wx: '木', advice: 'đởm đỉnh → PHẢI NGỦ («tý thời» đởm cập tân sinh; thức → hao đởm, ngày mai mệt, tóc bạc).' },
  丑: { hours: '1-3h', meridian: '足厥阴肝经', organ: 'Can (肝)', wx: '木', advice: 'can đỉnh → GIẤC NGỦ SÂU (can giải độc/giáng huyết lúc này; thức → hao can, mắt mờ, nóng trong).' },
};
export function meridianClock(hourZhi) {
  const m = MERIDIAN_CLOCK[hourZhi];
  if (!m) return null;
  return { zhi: hourZhi, ...m };
}

// ---- [loop 1043] 中医九种体质 (王琦体质学说) — từ ngũ hành vượng suy ----
// Nguồn: «中医体质分类与判定» (王琦, 2009中华中医药学会标准).
const CONSTITUTION_TYPES = {
  pinghe: { id: 'pinghe', vi: 'Phù Hoà (平和质)', tone: 'cat',
    desc: 'Ngũ hành cân bằng — thể chất lý tưởng: ngủ ngon, ăn tốt, tinh thần ổn, ít bệnh.',
    advice: 'Giữ thói quen lành mạnh: ăn uống cân bằng, vận động đều, ngủ đủ. Không cần đặc biệt bổ.' },
  qixu: { id: 'qixu', vi: 'Khí Hư (气虚质)', tone: 'mid',
    desc: 'Tỳ + Phổi khí hư — mệt mỏi, thở hụt, hay vã mồ hôi, nói yếu, dễ cảm.',
    advice: 'Bổ khí: nhân sâm/đảng sâm/hoàng kỳ, táo đỏ, kỷ tử, sơn dược. Vận động nhẹ (khí công/đi bộ). Tránh nói nhiều/lo nghĩ.' },
  yangxu: { id: 'yangxu', vi: 'Dương Hư (阳虚质)', tone: 'mid',
    desc: 'Thận/Spleen dương hư — sợ lạnh, tay chân lạnh, tiểu đêm, phân lỏng.',
    advice: 'Ôn dương: nhục quế, phụ tử (theo thầy thuốc), gừng, hạt óc chó, đậu đen. Giữ ấm, tránh sinh lạnh, ngủ sớm.' },
  yinxu: { id: 'yinxu', vi: 'Âm Hư (阴虚质)', tone: 'hung',
    desc: 'Thận âm hư — nóng trong, bốc hoả, đổ mồ hôi trộm, khô miệng, mất ngủ.',
    advice: 'Dưỡng âm: lục vị địa hoàng, thục địa, mạch môn, đậu đen, sen tâm. Tránh cay nóng/thức khuya/rượu.' },
  tanshi: { id: 'tanshi', vi: 'Đàm Thấp (痰湿质)', tone: 'mid',
    desc: 'Tỳ thấp đàm trọc — nặng người, béo, phù, nhiều đờm, buồn ngủ.',
    advice: 'Kiện tỳ hoá thấp: ý dĩ, sơn dược, trạch tả, trần bì. Giảm ngọt/béo/tinh bột. Vận động mạnh hơn.' },
  shire: { id: 'shire', vi: 'Thấp Nhiệt (湿热质)', tone: 'hung',
    desc: 'Thấp nhiệt uất — mặt nhờn, mụn, miệng đắng, tiểu vàng, phân dính.',
    advice: 'Thanh thấp nhiệt: ý dĩ, khổ qua, đậu xanh, nhân trần, diệp hạ châu. Giảm cay/đường/sữa/rượu.' },
  xueyu: { id: 'xueyu', vi: 'Huyết Ứ (血瘀质)', tone: 'hung',
    desc: 'Huyết ứ trệ — da tối/nám, đau cố định, môi tía, kinh cục.',
    advice: 'Hoạt huyết: đan sâm, xích thược, đào nhân, hồng hoa, sơn tra. Vận động đều (khí huyết hành).' },
  qiyu: { id: 'qiyu', vi: 'Khí Uất (气郁质)', tone: 'mid',
    desc: 'Can khí uất kết — bứt rứt, lo âu, ngực sườn trướng, hay thở dài.',
    advice: 'Sơ can giải uất: sài hồ, hương phụ, cúc hoa, diệp hạ châu. Vận động ngoài trời, giao tiếp, bớt ức chế.' },
  tebin: { id: 'tebin', vi: 'Đặc Bẩm (特禀质)', tone: 'mid',
    desc: 'Phổi vệ bất cố — dễ dị ứng, mẩn ngứa, hen, viêm mũi.',
    advice: 'Cố biểu bổ khí: hoàng kỳ, bạch truật, phòng phong. Tránh dị ứng nguyên. Tăng sức đề kháng.' },
};
/**
 * Phân loại thể chất đông-y TỪ ngũ hành vượng suy (王琦 九种体质).
 * @param {object} R — analyze() result
 * @returns {{ id, vi, tone, desc, advice, weakest, strongest }}
 */
export function bodyConstitution(R) {
  if (!R?.wx?.pct) return null;
  const p = R.wx.pct;
  const avg = Object.values(p).reduce((a, b) => a + b, 0) / 5;
  const entries = Object.entries(p).sort((a, b) => b[1] - a[1]);
  const [maxWx, maxV] = entries[0], [minWx, minV] = entries[entries.length - 1];
  const low = (wx) => p[wx] < avg * 0.85;
  const high = (wx) => p[wx] > avg * 1.15;

  // 1. 平和: tất cả gần cân (max-min < avg*0.45)
  if (maxV - minV < avg * 0.45) return { ...CONSTITUTION_TYPES.pinghe, weakest: minWx, strongest: maxWx };
  // 2. 痰湿: Thổ cao nhất (>avg*1.2)
  if (high('土') && p['土'] >= maxV) {
    // kèm Hoả cao → 湿热
    if (high('火')) return { ...CONSTITUTION_TYPES.shire, weakest: minWx, strongest: maxWx };
    return { ...CONSTITUTION_TYPES.tanshi, weakest: minWx, strongest: maxWx };
  }
  // 3. 气郁: Mộc cao nhất
  if (high('木') && p['木'] >= maxV) return { ...CONSTITUTION_TYPES.qiyu, weakest: minWx, strongest: maxWx };
  // 4. 阳虚: Thủy rất thấp + Thổ thấp
  if (low('水') && p['水'] <= avg * 0.7) {
    if (high('火')) return { ...CONSTITUTION_TYPES.yinxu, weakest: minWx, strongest: maxWx }; // âm hư hoả vượng
    return { ...CONSTITUTION_TYPES.yangxu, weakest: minWx, strongest: maxWx };
  }
  // 5. 气虚: Thổ + Kim đều thấp
  if (low('土') && low('金')) return { ...CONSTITUTION_TYPES.qixu, weakest: minWx, strongest: maxWx };
  // 6. 特禀: Kim thấp nhất
  if (minWx === '金') return { ...CONSTITUTION_TYPES.tebin, weakest: minWx, strongest: maxWx };
  // 7. 血瘀: Mộc thấp (can huyết hư ứ)
  if (low('木')) return { ...CONSTITUTION_TYPES.xueyu, weakest: minWx, strongest: maxWx };
  // 8. 阴虚: Thủy thấp (không phải dương hư)
  if (low('水')) return { ...CONSTITUTION_TYPES.yinxu, weakest: minWx, strongest: maxWx };
  // fallback
  return { ...CONSTITUTION_TYPES.qixu, weakest: minWx, strongest: maxWx };
}
