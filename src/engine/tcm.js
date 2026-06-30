// ============================================================================
//  ĐÔNG Y / Y HỌC CỔ TRUYỀN 中医 — Ngũ hành ↔ Tạng phủ ↔ Khí vượng suy ↔ Dược lý
//  [loop 1021] Nguồn: «Hoàng Đế Nội Kinh» (素问·阴阳应象大论 / 金匮真言论 / 至真要大论).
//    Mỗi ngũ hành ↔ 1 tạng (脏) + 1 phủ (腑) + ngũ vị/ngũ sắc/ngũ chí/ngũ quan/ngũ thể.
//    Khí vượng (mạnh) → tạng THỰC (ứ/dư); khí suy (yếu) → tạng HƯ (thiếu) → dễ bệnh.
//    Dược lý: ngũ vị/ngũ sắc nhập tạng (酸→肝, 苦→心, 甘→脾, 辛→肺, 咸→肾) + thực疗.
//  Tích hợp BaZi: từ ngũ hành vượng suy của lá số → đoán tạng yếu/mạnh + lời khuyên đông y.
// ============================================================================
import { GAN, ZHI } from './constants.js';

// ---- Ngũ hành ↔ Tạng phủ + thuộc tính (Hoàng Đế Nội Kinh) ----
export const WUX_ZANG = {
  木: {
    zang: '肝 (Gan)', fu: '胆 (Mật)', wei: '酸 (chua)', se: '青 (xanh)', zhi: '怒 (giận)', guan: '目 (mắt)', ti: '筋 (gân)', season: 'Xuân (mùa xuân)',
    xu: ['肝血虚 — mắt mờ/choáng váng, móng mềm, kinh nguyệt ít, hay co giật cơ/mỏi cổ vai gáy',
         '肝阴虚 — mắt khô, hoa mắt, khô họng, nóng trong'],
    shi: ['肝火旺 — hay cáu gắt, mặt mắt đỏ, đau đầu, mất ngủ, miệng đắng, tai ù',
          '肝阳上亢 — chóng mặt căng đầu, cao huyết áp, bứt rứt'],
    disease: 'gan/mật, đau đầu, cao HA, mắt, kinh nguyệt, căng thẳng, cơ cổ vai gáy',
    nourish: 'Bổ gan huyết: gan động vật, rau xanh (rau ngót, rau má), atiso, táo đỏ, kỷ tử;養 huyết + sơ uất.',
  },
  火: {
    zang: '心 (Tim)', fu: '小肠 (Tiểu trường)', wei: '苦 (đắng)', se: '赤 (đỏ)', zhi: '喜 (vui)', guan: '舌 (lưỡi)', ti: '脉 (mạch)', season: 'Hạ (mùa hè)',
    xu: ['心气虚 — hồi hộp, thở hụt, mệt mỏi, hay vã mồ hôi, mất ngủ',
         '心血虚 — hồi hộp trống ngực, choáng, mất ngủ hay mơ,面色 nhợt nhạt'],
    shi: ['心火旺 — lở miệng/lưỡi, mất ngủ bồn chồn, tiểu vàng đỏ, mặt đỏ'],
    disease: 'tim/hồi hộp, mất ngủ, tâm thần, lưỡi/miệng, huyết áp',
    nourish: 'Dưỡng tâm an thần: sen tâm (liên tử tâm), táo đỏ, long nhãn, bột sen, chè hạt sen; thanh tâm hoả.',
  },
  土: {
    zang: '脾 (Tỳ)', fu: '胃 (Vị)', wei: '甘 (ngọt)', se: '黄 (vàng)', zhi: '思 (lo nghĩ)', guan: '口 (miệng)', ti: '肉 (cơ/thịt)', season: 'Trường hạ (cuối hạ)',
    xu: ['脾气虚 — mệt mỏi, chán ăn, đầy bụng, phân lỏng, nói yếu',
         '脾阳虚 — bụng lạnh đau, phân lỏng, lạnh tay chân, phù nhẹ'],
    shi: ['脾胃湿热 — đầy bụng, đắng miệng, phân dính/ôleo, mụn trứng cá',
          '湿困脾 — nặng người, buồn ngủ, chán ăn, phù'],
    disease: 'tiêu hoá/dạ dày, mệt mỏi, phù, đường huyết, cơ thể nặng nề',
    nourish: 'Kiện tỳ vị: khoai lang, gạo tẻ/yến mạch, táo đỏ, hạt ý dĩ (misc/ý dĩ), gừng; tránh sinh lạnh.',
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
    nourish: 'Bổ thận tinh: đậu đen, vừng đen, dâu tây/tằm, hạt óc chó,枸杞 (kỷ tử), sơn dược (củ mài), hà thủ ô; thuỷ tương sinh (kim sinh thuỷ: pohong phổi cũng bổ thận).',
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
    keywords: ['thủ dâm', 'thủ đâm', 'thủ dam', 'di tinh', 'mộng tinh', 'liệt dương', 'sớm xuất', 'sớm', 'yếu sinh lý', 'thận yếu', '肾', 'khoa nam', 'phòng sự', 'sex', 'đêm xuất', 'cuồng dâm', ' xuất tinh'],
    title: '肾 Tinh hao tổn (THẬN HƯ) — do phòng sự/thủ dâm quá độ',
    summary: 'Theo đông y, 肾 (thuỷ) là «tiên thiên chi bản (先天之本)» — gốc tinh khiết, chủ TÀNG TINH (cất giữ tinh). Thủ dâm/phòng sự quá độ → hao 肾 tinh → THẬN HƯ. Tinh hao kéo theo: thuỷ suy → Mộc (can) mất nuôi (can huyết hư) → hoả vượng → hệ quả toàn thân.',
    yin: '肾 ÂM HƯ (hay gặp nếu ra tinh nhiều + thức khuya/nóng): thắt lưng/đầu gối mỏi, choáng tai ù, mất ngủ nhiều mơ, nóng trong bốc hoả, đổ mồ hôi trộm ban đêm, di tinh/sớm xuất, khô miệng, gò má đỏ, lưỡi đỏ ít rêu.',
    yang: '肾 DƯƠNG HƯ (kèm sợ lạnh/mệt): thắt lưng/đầu gối LẠNH đau, sợ lạnh tay chân, liệt dương/cương kém, tiểu đêm nhiều, hay đi ngoài lỏng sáng sớm, mệt mỏi, tóc rụng/răng long sớm.',
    advice: '① TIẾT DỤC BẢO TINH — tần suất vừa phải (tuỳ tuổi/khí lực); tránh lúc mệt/đói/say/ốm. ② Bổ thận tinh: đậu đen, vừng đen, dâu tằm, hạt óc chó, kỷ tử, sơn dược (củ mài), hà thủ ô, hạt sen. ÂM HƯ → thiên thanh - bổ âm: lục vị địa hoàng hoàn; DƯƠNG HƯ → ôn bổ: kim quỹ địa hoàng hoàn / nhục quế/phụ tử (theo thầy thuốc). ③ Ngủ sớm (trước 23h) — can đởm giải độc + thận phục hồi. ④ Tránh thức khuya, rượu, cay nóng, lo âu («tinh hoá khí, khí hoá thần» — tinh thần tĩnh thì tinh tự đầy).',
    related: '肾 → thuỷ → sinh Mộc (can) + khắc Hoả (tim): tinh hao kéo theo can huyết hư (mờ mắt, bứt rứt) + tim hư (hồi hộp, mất ngủ).',
  },
  {
    id: 'liver_fire',
    keywords: ['cáu gắt', 'nóng nảy', 'giận', 'đau đầu', 'mắt đỏ', 'miệng đắng', 'cao huyết áp', '肝火', 'stress', 'áp lực', 'ức chế', 'bứt rứt'],
    title: 'Can hoả vượng / Can dương thượng cương (GIẬN DUỘNG)',
    summary: 'Can (mộc) chủ sớ tiết, tính điều đạt. Lo âu/ức chế/cáu gắt → khí uất kết → hoả hoá → can hoả vượng / can dương cương. Can dương cương là cao huyết áp thường gặp.',
    symptoms: 'hay cáu gắt, bứt rứt, mặt mắt đỏ, đau đầu (đỉnh/2 bên), hoa mắt chóng mặt, tai ù, miệng đắng, mất ngủ, kinh nguyệt rối, cổ vai gáy mỏi.',
    advice: '① SƠ CAN UẤT — bình can hoả: trà cúc hoa (hoa cúc), diệp hạ châu (chó đẻ răng cưa), atiso, nhân trần, bồ công anh. ② Giảm cay nóng/rượu/thức khuya. ③ Vận động nhẹ / hít thở — «can chủ gân, chủ điều đạt», đi bộ phát tán uất kết. ④ Bớt tức giận — «nộ thương can».',
  },
  {
    id: 'spleen_xu',
    keywords: ['mệt mỏi', 'chán ăn', 'đầy bụng', 'phân lỏng', 'đại tiện lỏng', 'bụng lạnh', 'suy dinh dưỡng', 'tiêu hoá kém', '脾虚', 'đầy hơi', 'phù nhẹ'],
    title: 'Tỳ vị hư (TIÊU HOÁ KÉM)',
    summary: 'Tỳ (thổ) chủ vận hoá + thăng thanh. Ăn sinh lạnh/quá no/lo nghĩ nhiều → thương tỳ → tỳ khí/dương hư → vận hoá kém.',
    symptoms: 'mệt mỏi hay buồn ngủ, chán ăn, đầy bụng, đại tiện lỏng/nhão, nói yếu, hay phù nhẹ, sức yếu, nghĩ nhiều hay lo.',
    advice: '① KIỆN TỲ: ý dĩ, sơn dược (củ mài), sen hạt, táo đỏ, khoai lang, gạo tẻ/yến mạch, đậu đỏ. ② Tránh sinh lạnh, ngọt béo, quá no. ③ Gừng ấm tỳ vị. ④ Tỳ sợ «ứ» (lo nghĩ nhiều) — bớt suy nghĩ quá mức.',
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
    susceptible, dietAdvice, lifestyle,
    note: 'Đông-yProfile suy luận TỪ ngũ hành vượng suy → tạng hư/thực (không thay thế chẩn đoán y khoa). «Hoàng Đế Nội Kinh»: cần kết hợp thực tế + vị bác sĩ đông y.',
  };
}

/**
 * Trả lời câu hỏi sức khoẻ đông y — khớp từ khoá với CONDITION_KB, cá nhân hoá theo lá số.
 * @param {string} q — câu hỏi người dùng
 * @param {object} R — (tuỳ chọn) lá số để cá nhân hoá (thuỷ = thận mạnh/yếu?)
 */
export function answerHealth(q, R) {
  const ql = (q || '').toLowerCase();
  const hit = CONDITION_KB.find((c) => c.keywords.some((k) => ql.includes(k.toLowerCase())));
  if (!hit) return { ok: false, matched: false, reply: 'Tôi chưa có cơ sở tri thức đông-y cụ thể cho câu này. Hãy hỏi về: thận hư/thủ dâm/sinh lý, can hoả/stress/đau đầu, tỳ vị/tiêu hoá — hoặc xem phân tích sức khoẻ theo ngũ hành của lá số.' };
  let reply = `【${hit.title}】\n${hit.summary}\n`;
  if (hit.yin) reply += `\n• ${hit.yin}\n`;
  if (hit.yang) reply += `• ${hit.yang}\n`;
  if (hit.symptoms) reply += `\nTriệu chứng: ${hit.symptoms}\n`;
  if (hit.advice) reply += `\nLời khuyên: ${hit.advice}\n`;
  if (hit.related) reply += `\nLiên quan ngũ hành: ${hit.related}\n`;
  // cá nhân hoá: lá số thuỷ (thận) yếu/mạnh?
  let personal = '';
  if (R && R.wx && R.wx.pct) {
    const wp = R.wx.pct['水'];
    if (hit.id === 'kidney_jing' && wp != null) {
      const avg = Object.values(R.wx.pct).reduce((a, b) => a + b, 0) / 5;
      personal = `\n Bản LA SỐ: ngũ hành Thủy (肾) chiếm ${(+wp.toFixed(1))}% ${wp < avg ? '— YẾU: thận vốn thiên hư, càng dễ tổn thương khi hao tinh, cần tiết dục + bổ nhiều hơn.' : '— khá:vẫn cần tiết độ nhưng phục hồi nhanh hơn.'}`;
    }
  }
  return { ok: true, matched: true, id: hit.id, title: hit.title, reply: reply + personal };
}
