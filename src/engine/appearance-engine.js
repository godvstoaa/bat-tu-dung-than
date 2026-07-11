// appearance-engine.js — DIỆN MẠO BÁT TỰ (thập can thể tượng + thời gian biến đổi)
// Nguồn: 古法 (十干体象 + 五行相貌 + 大运影响 + 金水相逢/木火通明 kinh điển).
// KEY: diện mạo KHÔNG cố định — thay đổi theo ĐẠI VẬN/LƯU NIÊN. Engine tính BASE + CURRENT.

// 10 can → thể tượng diện mạo (CỐ ĐIỂN — từ 十干体象 + 八字看相貌)
const GAN_APPEARANCE = {
  '甲': { vi: 'Giáp Mộc', xiang: 'cây đại thụ', height: 'cao', build: 'mỏng, thẳng, vai rộng', face: 'mặt dài, xương hàm rõ', skin: 'xanh/vàng ngả xanh', hair: 'tóc dày, cứng, đen', eyes: 'mắt sâu, có thần', feature: 'thẳng thắn, uy nghi, dáng vóc lớn' },
  '乙': { vi: 'Ất Mộc', xiang: 'cỏ/đường leo', height: 'trung bình', build: 'thanh mảnh, dẻo dai', face: 'mặt oval/thanh tú', skin: 'trắng ngả xanh', hair: 'tóc mềm, mượt', eyes: 'mắt dài, dịu', feature: 'duyên dáng, mềm mại, lông mày đẹp' },
  '丙': { vi: 'Bính Hỏa', xiang: 'mặt trời', height: 'trung bình/trên', build: 'tròn, đầy đặn', face: 'mặt tròn/trái tim, gò má cao', skin: 'đỏ/hồng, ấm', hair: 'tóc dày, có thể xoăn', eyes: 'mắt to, sáng, lấp lánh', feature: 'rạng rỡ, nhiệt tình, khó giấu' },
  '丁': { vi: 'Đinh Hỏa', xiang: 'ngọn đèn/sao', height: 'nhỏ/trung', build: 'thanh tú, nhỏ', face: 'trán rộng, miệng đẹp, mặt thanh', skin: 'trắng, mịn', hair: 'tóc mềm, thẳng', eyes: 'mắt sáng nhưng dịu, có trực giác', feature: 'tinh tế, thanh lịch, ấm áp' },
  '戊': { vi: 'Mậu Thổ', xiang: 'tường thành', height: 'cao/trên', build: 'chắc, to, rộng', face: 'mặt vuông, hàm to, mũi to', skin: 'ngăm/vàng đậm', hair: 'tóc thô, dày', eyes: 'mắt to, trầm', feature: 'vạm vỡ, uy nghi, dáng vóc lớn' },
  '己': { vi: 'Kỷ Thổ', xiang: 'đất ruộng', height: 'trung bình', build: 'đầy đặn, tròn', face: 'mặt tròn, mũi đầy, môi dày', skin: 'ngăm nhưng mềm', hair: 'tóc dày, đen', eyes: 'mắt tròn, hiền', feature: 'đầy đặn, phúc hậu, dễ gần' },
  '庚': { vi: 'Canh Kim', xiang: 'vũ khí/kim loại', height: 'cao', build: 'mỏng, gân guốc', face: 'gương cạnh rõ, gò má cao, mũi sống cao', skin: 'trắng, khô', hair: 'tóc cứng, thẳng', eyes: 'mắt sắc, có ánh kim', feature: 'sắc sảo, góc cạnh, nam tính' },
  '辛': { vi: 'Tân Kim', xiang: 'trang sức', height: 'nhỏ/trung', build: 'thanh tú, nhỏ', face: 'mặt oval, lông mày đẹp, ngũ quan tinh tế', skin: 'trắng mịn, mỏng', hair: 'tóc mềm, mượt', eyes: 'mắt sáng, duyên', feature: 'thanh tú, đẹp, tinh tế, nữ tính' },
  '壬': { vi: 'Nhâm Thủy', xiang: 'sông lớn/biển', height: 'cao/trên', build: 'đầy đặn, to', face: 'mặt tròn/to, mắt to', skin: 'đen/ngăm ẩm', hair: 'tóc dày, đen, dày', eyes: 'mắt to, sâu, linh hoạt', feature: 'to lớn, uy nghi, khí chất mạnh' },
  '癸': { vi: 'Quý Thủy', xiang: 'mưa/sương', height: 'nhỏ/trung', build: 'nhỏ, mềm, tròn', face: 'mặt tròn nhỏ, môi đầy, má phúng phính', skin: 'trắng ẩm, mịn', hair: 'tóc mềm, mượt, đen', eyes: 'mắt sáng,long lanh, ướt', feature: 'nhỏ nhắn, duyên, thanh tú' },
};

// ngũ hành 旺 → diện mạo modifier
const WX_APPEARANCE_MOD = {
  '木': { tooMuch: 'gầy, cao quá, xương lộ, tóc khô', tooLittle: 'thấp, yếu, tóc thưa', balanced: 'thanh tú, cân đối' },
  '火': { tooMuch: 'đỏ mặt, mụn, tóc khô/xoăn, mắt充血', tooLittle: 'nhợt nhạt, thiếu sức sống, mắt vô thần', balanced: 'sáng, ấm, rạng rỡ' },
  '土': { tooMuch: 'thick, nặng, da sạm, mụn đầu đen', tooLittle: 'gầy, da khô, xương lộ', balanced: 'chắc, đầy đặn, phúc hậu' },
  '金': { tooMuch: 'sắc quá, gò má cao, da khô/bong', tooLittle: 'mềm, thiếu sắc, da xỉn', balanced: 'sắc sảo, góc cạnh vừa phải' },
  '水': { tooMuch: 'béo, sưng, da dầu, mắt phù', tooLittle: 'khô, nhăn, thiếu độ ẩm', balanced: 'mịn, ẩm, dẻo dai' },
};

// 大运 ngũ hành → thay đổi diện mạo theo THỜI GIAN
const DAYUN_APPEARANCE = {
  '木': 'Mộc vận: tóc mọc nhanh/dày, xu hướng cao/gầy, lông mày rậm, vận may thay đổi nhanh.',
  '火': 'Hỏa vận: mắt sáng, da hồng/đỏ, nhiệt huyết hiện ra, dễ mụn nếu quá vượng.',
  '土': 'Thổ vận: tăng cân, cơ thể chắc, da sạm hơn, mặt tròn/full hơn.',
  '金': 'Kim vận: gương mặt sắc nét hơn, da trắng, tóc cứng/cắt ngắn hợp, góc cạnh rõ.',
  '水': 'Thủy vận: da ẩm mịn, dáng mềm mại, mắt long lanh, tăng cân nhẹ, tóc đen bóng.',
};

// nhan sắc kinh điển combinations
const BEAUTY_COMBOS = {
  jinShui: { name: 'Kim Thủy phùng', condition: 'Kim + Thủy đều vượng', effect: 'CỰC ĐẸP — da trắng + ẩm = nhan sắc xuất chúng.' },
  muHuo: { name: 'Mộc Hỏa thông minh', condition: 'Mộc + Hỏa đều vượng', effect: 'Sáng + duyên — đẹp rạng rỡ, khí chất văn nhã.' },
  muJin: { name: 'Mộc bị Kim điêu', condition: 'Mộc vượng + Kim chế', effect: 'Đẹp sắc sảo — như gỗ được điêu khắc.' },
  liuhe: { name: 'Lục hợp', condition: 'địa chi có lục hợp', effect: 'Dáng vẻ珠 lệ — tính thiện, nhan sắc đẹp.' },
  muJinBing: { name: 'Mộc Kim + Bính hỏa', condition: 'Mộc + Kim + Bính hỏa', effect: 'Tần phi tương — cực kỳ đẹp.' },
};

const ganOf = (g) => ({甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'})[g] || '?';

// === assessAppearance — TÍNH diện mạo (BASE + CURRENT theo thời gian) ===
export function assessAppearance(chart, R) {
  const c = chart?.chart ? chart.chart : chart;
  const dmGan = c?.dayMaster?.gan || '';
  const base = GAN_APPEARANCE[dmGan];
  if (!base) return { note: 'không tính được' };

  // element balance
  const wx = R?.wx?.pct || {};
  const wxSorted = Object.entries(wx).sort(([,a],[,b]) => b - a);
  const dominant = wxSorted[0]?.[0] || ganOf(dmGan);
  const weakest = wxSorted[wxSorted.length - 1]?.[0] || '';

  // beauty combos detection
  const beauty = [];
  const hasJin = (wx['金'] || 0) >= 25;
  const hasShui = (wx['水'] || 0) >= 25;
  const hasMoc = (wx['木'] || 0) >= 25;
  const hasHoa = (wx['火'] || 0) >= 25;
  if (hasJin && hasShui) beauty.push(BEAUTY_COMBOS.jinShui);
  if (hasMoc && hasHoa) beauty.push(BEAUTY_COMBOS.muHuo);
  if (hasMoc && hasJin) beauty.push(BEAUTY_COMBOS.muJin);

  // current 大运
  const dayun = (R?.dayun || []);
  const age = new Date().getFullYear() - (c?.input?.year || 1990);
  let curDayun = dayun[0];
  for (const d of dayun) { if ((d.startAge || 0) <= age) curDayun = d; }
  const curDayunWx = curDayun?.ganWx || curDayun?.zhiWx || '';
  const dayunEffect = DAYUN_APPEARANCE[curDayunWx] || '';

  // dominant modifier
  const domPct = wx[dominant] || 0;
  let modType = 'balanced';
  if (domPct >= 40) modType = 'tooMuch';
  else if (domPct <= 15) modType = 'tooLittle';
  const mod = WX_APPEARANCE_MOD[dominant]?.[modType] || '';

  return {
    dayMaster: dmGan,
    base: base,
    elementBalance: { dominant, dominantPct: domPct, weakest, modType, modifier: mod },
    beauty: beauty.map(b => `${b.name} (${b.condition}): ${b.effect}`),
    currentDayun: { ganzhi: curDayun?.ganZhi || '?', wx: curDayunWx, effect: dayunEffect },
    verdict: buildVerdict(base, mod, modType, beauty, curDayunWx, dayunEffect),
  };
}

function buildVerdict(base, mod, modType, beauty, dayunWx, dayunEffect) {
  let v = `DIỆN MẠO CƠ BẢN (nhật chủ ${base.vi} = ${base.xiang}): ${base.feature}. `;
  v += `Chi tiết: chiều cao ${base.height}, thể hình ${base.build}, mặt ${base.face}, da ${base.skin}, tóc ${base.hair}, mắt ${base.eyes}. `;
  if (mod) v += `Hành chủ đạo ${modType === 'tooMuch' ? 'QUÁ MẠNH' : modType === 'tooLittle' ? 'QUÁ YẾU' : 'cân bằng'}: ${mod}. `;
  if (beauty.length) v += `NHAN SẮC: ${beauty.map(b=>b.name).join(' + ')} → ${beauty[0].effect} `;
  if (dayunEffect) v += `\nHIỆN TẠI (đại vận ${dayunWx}): ${dayunEffect}`;
  v += `\n⚠ DIỆN MẠO THAY ĐỔI THEO ĐẠI VẬN — đây là BASE + hiện tại, không cố định.`;
  return v;
}
