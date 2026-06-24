// ============================================================================
//  CÁCH CỤC THÀNH BẠI CỨU ỨNG 格局成败救应
//  子平真詮 第8章: 用神 thành/bại/cứu/ứng → quyết định mệnh cao thấp.
//  Không chỉ định cách (pattern.js) mà còn đánh giá: CÁCH CÓ THÀNH KHÔNG?
//  Có bị phá không? Có cứu ứng không? Nguồn: 子平真詮 ch.8, 滴天髓.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod } from './core.js';

/**
 * @returns {{ geShen, geGod, isTransparent, cheng, bai, jiuYing, rescueStar,
 *            damageStar, finalStatus, profile, advice }}
 */
export function analyzePatternSuccess(R) {
  const { chart, pattern, wx, interactions, yong } = R;
  const dayGan = chart.dayGan;
  const monthZhi = chart.monthZhi;

  // 1. 格 thần
  const geGan = pattern.geShen?.gan || '';
  const geGod = pattern.geShen?.god || '';
  const geSource = pattern.geShen?.source || '';

  // 2. Thấu can? (格 thần có hiện trên thiên can năm/tháng/giờ)
  const stemsGan = ['year','month','time'].map(k => chart.pillars[k].gan);
  const isTransparent = geGan && stemsGan.includes(geGan);

  // 3. THÀNH: 格 thần được sinh/phụ/hộ
  const cheng = [];
  // Can phù trợ 格 thần (Ấn sinh Quan, Tài sinh Quan, etc.)
  const geGodWx = geGan ? GAN[geGan].wx : '';
  const SHENG = { 木:'火', 火:'土', 土:'金', 金:'水', 水:'木' };
  const KE = { 木:'土', 火:'金', 土:'水', 金:'木', 水:'火' };

  for (const k of ['year','month','time']) {
    const stemGan = chart.pillars[k].gan;
    const stemWx = GAN[stemGan].wx;
    // Sinh 格 thần → phù trợ
    if (geGodWx && SHENG[stemWx] === geGodWx) {
      cheng.push({ type: 'sinh', star: stemGan, starVi: TEN_GOD_VI[tenGod(dayGan, stemGan)] || '',
        note: `${TEN_GOD_VI[tenGod(dayGan, stemGan)] || ''} ${stemGan} sinh 格 thần ${geGan} → cách được phù trợ (thành).` });
    }
    // Đồng hành với 格 thần (tỷ kiếp) → cường hóa
    if (geGodWx && stemWx === geGodWx && stemGan !== geGan) {
      cheng.push({ type: 'dong', star: stemGan, starVi: TEN_GOD_VI[tenGod(dayGan, stemGan)] || '',
        note: `${TEN_GOD_VI[tenGod(dayGan, stemGan)] || ''} ${stemGan} đồng hành với ${geGan} → cách cường hóa.` });
    }
  }

  // 4. BẠI: 格 thần bị 克/phá/hợp đoạt
  const bai = [];
  // Can khắc 格 thần → phá
  for (const k of ['year','month','time']) {
    const stemGan = chart.pillars[k].gan;
    const stemWx = GAN[stemGan].wx;
    if (geGodWx && KE[stemWx] === geGodWx) {
      bai.push({ type: 'ke', star: stemGan, starVi: TEN_GOD_VI[tenGod(dayGan, stemGan)] || '',
        note: `${TEN_GOD_VI[tenGod(dayGan, stemGan)] || ''} ${stemGan} khắc ${geGan} → cách bị phá.` });
    }
  }
  // Chi xung nguyệt chi → phá cách (月令 bị xung = 格 bất ổn)
  if (interactions.chong.some(c => c.a === monthZhi || c.b === monthZhi)) {
    const clash = interactions.chong.find(c => c.a === monthZhi || c.b === monthZhi);
    bai.push({ type: 'xung', note: `Nguyệt chi ${monthZhi} bị xung ${clash.a}↔${clash.b} → nền cách bị chấn động.` });
  }
  // Hợp hóa 格 thần → cách biến
  if (interactions.ganHe.some(g => g.a === geGan || g.b === geGan)) {
    const he = interactions.ganHe.find(g => g.a === geGan || g.b === geGan);
    bai.push({ type: 'he', note: `格 thần ${geGan} bị hợp (${he.a}+${he.b}→${he.hua}) → cách có thể biến.` });
  }

  // 5. CỨU ỨNG: khi cách bị phá, có sao nào CỨU không?
  const jiuYing = [];
  // Nếu cách bị khắc → có can khắc-lại-kẻ-khắc (tức "dược")
  for (const b of bai) {
    if (b.type === 'ke') {
      const attackerWx = GAN[b.star].wx;
      // Ai khắc kẻ phá? → cứu
      const saviorWx = Object.entries(KE).find(([wx, ke]) => ke === attackerWx)?.[0];
      for (const k of ['year','month','time']) {
        const stemGan = chart.pillars[k].gan;
        if (GAN[stemGan].wx === saviorWx && stemGan !== b.star) {
          jiuYing.push({ type: 'ke-savior', star: stemGan, starVi: TEN_GOD_VI[tenGod(dayGan, stemGan)] || '',
            note: `${TEN_GOD_VI[tenGod(dayGan, stemGan)] || ''} ${stemGan} khắc lại ${b.star} (kẻ phá) → CỨU ứng: "bại trung hữu thành".` });
        }
      }
      // Hoặc can hợp kẻ phá → trói
      for (const k of ['year','month','time']) {
        const stemGan = chart.pillars[k].gan;
        const heMap = { 甲:'己',己:'甲',乙:'庚',庚:'乙',丙:'辛',辛:'丙',丁:'壬',壬:'丁',戊:'癸',癸:'戊' };
        if (heMap[b.star] === stemGan) {
          jiuYing.push({ type: 'he-trói', star: stemGan, starVi: TEN_GOD_VI[tenGod(dayGan, stemGan)] || '',
            note: `${TEN_GOD_VI[tenGod(dayGan, stemGan)] || ''} ${stemGan} hợp ${b.star} (kẻ phá) → trói, cách được CỨU.` });
        }
      }
    }
  }

  // 6. Final status
  const chengScore = cheng.length * 2 + (isTransparent ? 2 : 0);
  const baiScore = bai.length * 2;
  const jiuScore = jiuYing.length * 1.5;
  const net = chengScore - baiScore + jiuScore;

  let finalStatus, statusVi;
  if (net >= 4) { finalStatus = 'thanh-trong'; statusVi = 'Cách THANH TRỌNG — thành cách + có phù trợ + không phá → mệnh cao.'; }
  else if (net >= 2) { finalStatus = 'thanh'; statusVi = 'Cách THANH — thành, ít phá → mệnh khá.'; }
  else if (net >= 0) { finalStatus = 'trung'; statusVi = 'Cách TRUNG — có thành có phá nhưng cân → bình thường.'; }
  else if (net >= -2) { finalStatus = 'troc'; statusVi = 'Cách TRỌC — bị phá nhiều, có cứu nhưng chưa đủ → mệnh hơi trọc.'; }
  else { finalStatus = 'bai'; statusVi = 'Cách BẠI — phá nhiều, ít cứu → mệnh trọc/thấp.'; }

  const profile = [
    `格 thần: ${geGan || '?'} (${TEN_GOD_VI[geGod] || geGod || '?'}) — nguồn: ${geSource}.`,
    isTransparent ? `✓ Thấu can (${geGan} hiện trên thiên can) → cách HIỆN LỘC, lực mạnh.` : `Không thấu can → cách ẩn, lực vừa.`,
    cheng.length ? `✓ THÀNH: ${cheng.map(c => c.note).join(' ')}` : 'Không có phù trợ trực tiếp.',
    bai.length ? `⚠ BẠI: ${bai.map(b => b.note).join(' ')}` : 'Không bị phá.',
    jiuYing.length ? `💚 CỨU ỨNG: ${jiuYing.map(j => j.note).join(' ')}` : '',
    `Tổng: ${statusVi}`,
  ].filter(Boolean);

  const advice = net >= 2
    ? 'Cách thành + thanh → nền tốt. Nên phát huy thế mạnh của cách (vd Chính Quan → sự nghiệp quy củ; Thương Quan → sáng tạo).'
    : net >= 0
      ? 'Cách trung bình → cần nỗ lực + cải vận. Dụng Thần vẫn là then chốt.'
      : 'Cách bị phá nhiều → cần "bại trung hữu thành" (cứu ứng) + cải vận mạnh (tích đức + Dụng Thần + đợi vận Dụng).';

  return { geGan, geGod, isTransparent, cheng, bai, jiuYing,
    net, finalStatus, statusVi, profile, advice };
}
