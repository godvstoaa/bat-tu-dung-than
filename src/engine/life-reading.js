// ============================================================================
//  NHÂN SINH TỔNG LUẬN 人生总论 — LIFE READING SYNTHESIS
//  Tổng hợp 20+ module thành 1 bản luận mệnh hoàn chỉnh.
//  Như một thầy tử bình đọc lá số cuối cùng → chốt 1 bản.
//  Nguồn: tổng hợp từ các module.
// ============================================================================
import { WX_VI, TEN_GOD_VI, GAN } from './constants.js';
import { DITIANSUI } from './kb.js';

/**
 * Tổng hợp toàn bộ phân tích thành 1 bản luận mệnh.
 * @param {object} R - kết quả analyze()
 * @returns {{ sections:[{title, content[]}], oneSentence, grade }}
 */
export function lifeReading(R) {
  const { chart, yong, pattern, strength, synthesis } = R;
  const dm = chart.dayMaster;
  const dt = DITIANSUI[dm.gan];
  const s = [];

  // 1. BẢN MỆNH CỐT LÕI
  s.push({
    title: '🌟 Bản mệnh cốt lõi',
    content: [
      `Nhật Chủ **${dm.gan} ${dm.vi}** (hành ${WX_VI[dm.wx]}) — ${dt.vi}.`,
      dt.nature,
      `Vượng suy: **${strength.level}** (phù ${(strength.ratio * 100).toFixed(0)}%, ${strength.deLenh ? 'đắc lệnh' : 'thất lệnh'}).`,
      `Cách cục: **${pattern.vi}** (${pattern.shunNi}).`,
      `Dụng – Hỷ – Kỵ – Thù: **${WX_VI[yong.primary]} · ${WX_VI[yong.xi]} · ${WX_VI[yong.ji]} · ${WX_VI[yong.chou]}**. Phép: ${yong.method.join(' + ')}.`,
    ],
  });

  // 2. TỔNG LUẬN MỆNH CỤC
  if (synthesis?.gradeVi) {
    s.push({
      title: '🏆 Tổng luận mệnh',
      content: [
        `Đẳng cấp: **${synthesis.gradeVi}** (điểm ${synthesis.score}/100).`,
        `Xu hướng: ${synthesis.fortuneVi}.`,
        synthesis.factors?.slice(0, 3).map(f => `• ${f}`).join(' '),
      ],
    });
  }

  // 3. SỰ NGHIỆP & TÀI LỘC
  const favCareer = [...new Set([yong.primary, yong.xi].filter(Boolean))];
  s.push({
    title: '💼 Sự nghiệp & Tài lộc',
    content: [
      `Cách cục ${pattern.vi} → ${pattern.note?.slice(0, 80) || ''}`,
      `Ngành hợp Dụng Thần (${favCareer.map(w => WX_VI[w]).join('/')}): ${favCareer.map(w => careerByWx(w)).join('; ')}.`,
      strength.strong
        ? 'Thân vượng → đủ sức gánh Quan-Tài, hợp quản lý/kinh doanh/lãnh đạo.'
        : 'Thân nhược → nên chọn nơi ổn định, có quý nhân dìu dắt, tích lũy rồi tiến.',
    ],
  });

  // 4. VẬN HẠN (đại vận)
  const bestDy = (R.dayun || []).reduce((a, b) => b.score > (a?.score || -99) ? b : a, null);
  const worstDy = (R.dayun || []).reduce((a, b) => b.score < (a?.score || 99) ? b : a, null);
  s.push({
    title: '⏰ Vận hạn & thời điểm',
    content: [
      `Đại vận TỐT NHẤT: ${bestDy?.ganZhi || '?'} [${bestDy?.startAge || '?'}-${(bestDy?.startAge || 0) + 9}t:${bestDy?.rating || '?'}] — giai đoạn vàng.`,
      `Đại vận XẤU NHẤT: ${worstDy?.ganZhi || '?'} [${worstDy?.startAge || '?'}-${(worstDy?.startAge || 0) + 9}t:${worstDy?.rating || '?'}] — cần cẩn thận.`,
      `Dụng Thần ${WX_VI[yong.primary]} là thước đo: vận nào mang hành này thì hanh thông.`,
      `Lưu niên: xem mục "Luận vận năm" cho từng năm cụ thể (6 trường phái).`,
    ],
  });

  // 5. TÌNH DUYÊN & GIA ĐẠO
  const isMale = chart.input.gender === 'nam';
  const spouseWx = isMale ? ({木:'土',火:'金',土:'水',金:'木',水:'火'})[dm.wx] : ({木:'金',火:'水',土:'木',金:'火',水:'土'})[dm.wx];
  const spouseFav = yong.primary === spouseWx || yong.xi === spouseWx;
  s.push({
    title: '💕 Tình duyên & Gia đạo',
    content: [
      `Sao phối ngẫu (${isMale ? 'Tài/vợ' : 'Quan/chồng'}) = hành ${WX_VI[spouseWx]} → ${spouseFav ? '✓ trùng Dụng Thần → hôn nhân mang phúc' : '⚠ không trùng Dụng → cần chọn người bổ Dụng'}.`,
      `Cung phối ngẫu (Nhật Chi ${chart.pillars.day.zhi}): ${R.interactions?.chong?.some(c => c.a === chart.pillars.day.zhi || c.b === chart.pillars.day.zhi) ? '⚠ bị xung → biến động' : '✓ yên ổn'}.`,
      isMale
        ? 'Nam: gặp sao vợ (Chính Tài) thấu lưu niên → dễ gặp/vợ. Năm Thiên Tài = duyên bất ngờ.'
        : 'Nữ: gặp sao chồng (Chính Quan) thấu → gặp chồng. Thương Quan năm = cẩn thận khẩu thiệp.',
    ],
  });

  // 6. SỨC KHOẺ
  const weakest = Object.entries(R.wx?.score || {}).sort((a, b) => a[1] - b[1])[0];
  const strongest = Object.entries(R.wx?.score || {}).sort((a, b) => b[1] - a[1])[0];
  s.push({
    title: '🏥 Sức khoẻ',
    content: [
      `Hành yếu nhất: ${WX_VI[weakest?.[0]]} (${((weakest?.[1] / (R.wx?.total || 1)) * 100).toFixed(0)}%) → ${organByWx(weakest?.[0])} cần chú ý.`,
      `Hành vượng nhất: ${WX_VI[strongest?.[0]]} (${((strongest?.[1] / (R.wx?.total || 1)) * 100).toFixed(0)}%) → thái quá dễ tổn ${organByWx(oppositeWx(strongest?.[0]))}.`,
      `Dưỡng: bổ hành Dụng ${WX_VI[yong.primary]} (vị ${flavorByWx(yong.primary)}, thực phẩm ${foodsByWx(yong.primary).slice(0, 30)}).`,
    ],
  });

  // 7. CẢI VẬN
  s.push({
    title: '🔑 Cải vận (tóm tắt)',
    content: [
      `Phương vị: hướng ${dirByWx(yong.primary)}.`,
      `Màu: ${colorByWx(yong.primary)}.`,
      `Số: ${numsByWx(yong.primary)}.`,
      `Nghề: ${careerByWx(yong.primary).slice(0, 40)}.`,
      `Trà: ${teaByWx(yong.primary)}.`,
      `Tinh dầu: ${aromaByWx(yong.primary)}.`,
      `Trang sức: ${crystalByWx(yong.primary)}.`,
      `**Trên hết: TÍCH ÂM ĐỨC (《了凡四训》)** — pháp cốt lõi thật sự nghịch thiên.`,
    ],
  });

  // One sentence
  const oneSentence = `${dm.gan} ${dm.vi} (${WX_VI[dm.wx]}) · ${pattern.vi} · Dụng ${WX_VI[yong.primary]} · ${synthesis?.gradeVi || '—'} (${synthesis?.score || '?'}đ) · vận tốt ${bestDy?.startAge || '?'}-${(bestDy?.startAge || 0) + 9}t · dưỡng ${WX_Vi(yong.primary)}`;

  return { sections: s, oneSentence, grade: synthesis?.gradeVi || '?' };
}

// --- Helpers ---
function careerByWx(w) { return {木:'giáo dục,mộc,nông',火:'ẩm thực,quảng cáo,tech',土:'BĐS,xây,bảo hiểm',金:'tài chính,kim loại,luật',水:'thương mại,logistics,du lịch'}[w] || ''; }
function organByWx(w) { return {木:'Gan-Mật',火:'Tim',土:'Tỳ-Vị',金:'Phổi',水:'Thận'}[w] || ''; }
function oppositeWx(w) { return {木:'土',火:'金',土:'水',金:'木',水:'火'}[w] || ''; }
function flavorByWx(w) { return {木:'chua',火:'đắng',土:'ngọt',金:'cay',水:'mặn'}[w] || ''; }
function foodsByWx(w) { return {木:'rau xanh,chanh,trà xanh',火:'đắng,cà chua,trà đỏ',土:'khoai,gạo,táo,ngọt',金:'gừng,hành,thịt trắng,lê',水:'cá,hải sản,đậu đen'}[w] || ''; }
function dirByWx(w) { return {木:'Đông/ĐN',火:'Nam',土:'ĐN/TB/TN',金:'Tây/TB',水:'Bắc'}[w] || ''; }
function colorByWx(w) { return {木:'xanh lá',火:'đỏ/hồng',土:'vàng/nâu',金:'trắng/bạc',水:'đen/navy'}[w] || ''; }
function numsByWx(w) { return {木:'3,8',火:'2,7',土:'5,0',金:'4,9',水:'1,6'}[w] || ''; }
function teaByWx(w) { return {木:'trà xanh (Long Tỉnh)',火:'hồng trà',土:'ô long (Thiết Quan Âm)',金:'bạch trà',水:'Pu-erh'}[w] || ''; }
function aromaByWx(w) { return {木:'bạc hà,oải hương',火:'trầm hương,hoa hồng',土:'cam ngọt,quế',金:'bạch đàn,thông',水:'nhục quế,vetiver'}[w] || ''; }
function crystalByWx(w) { return {木:'ngọc cẩm thạch,aventurine',火:'thạch anh hồng,garnet',土:'citrine,hổ phách',金:'thạch anh trắng,diamond',水:'obsidian,aquamarine'}[w] || ''; }
function WX_Vi(w) { return WX_VI[w] || w; }
