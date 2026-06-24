// ============================================================================
//  MANG PHÁI 盲派命理 — lens "bí truyền đã leak" (khác tử bình hàn lâm)
//  Bỏ khái niệm dụng thần, trọng: 做功 (tác công) + 财官 + 宾主 + 能量守恒 + 象.
//  Nguồn: 盲派金口诀, 财官诀, 做功效率诀 (đã công khai).
//    - 主位 (host) = Trụ Ngày + Giờ (mình, mình nắm); 宾位 (guest) = Năm + Tháng.
//    - 财官 tập trung ở主位 → phú quý; 分散 ở宾位/bị tỷ kiếp → bình.
//    - 做功效率: tam hợp/lục hợp > xung > hình > hại.
//    - Nhật can hợp tài/quan → chủ động theo đuổi.
// ============================================================================
import { GAN, ZHI, KE, KE_BY } from './constants.js';
import { tenGod } from './core.js';

const ORDER = ['year', 'month', 'day', 'time'];
const POS_VI = { year: 'Năm', month: 'Tháng', day: 'Ngày', time: 'Giờ' };

function ganGodList(chart) {
  return ORDER.map((k) => ({ pos: k, gan: chart.pillars[k].gan, god: chart.pillars[k].ganGod === '日主' ? '比肩' : chart.pillars[k].ganGod, zhi: chart.pillars[k].zhi }));
}

// Thiên can ngũ hợp
const GAN_HE = { 甲: '己', 己: '甲', 乙: '庚', 庚: '乙', 丙: '辛', 辛: '丙', 丁: '壬', 壬: '丁', 戊: '癸', 癸: '戊' };

/**
 * Phân tích 盲派. @returns {{ notes, fuguui, score, verdict, work }}
 */
export function analyzeMangpai(R) {
  const c = R.chart;
  const dmGan = c.dayGan;
  const dmWx = c.dayMaster.wx;
  const caiWx = KE[dmWx];   // hành Tài (ta khắc)
  const guanWx = KE_BY[dmWx]; // hành Quan (khắc ta)
  const list = ganGodList(c);
  const notes = [];

  // Tài/Quan ở 主 (ngày/giờ) hay 宾 (năm/tháng)?
  const isZhu = (pos) => pos === 'day' || pos === 'time';
  const caiHits = list.filter((x) => GAN[x.gan].wx === caiWx);
  const guanHits = list.filter((x) => GAN[x.gan].wx === guanWx);
  const caiInZhu = caiHits.filter((x) => isZhu(x.pos));
  const guanInZhu = guanHits.filter((x) => isZhu(x.pos));

  // 1. 能量守恒 — 财官 tập trung 主位 = phú quý
  const caiZhu = caiInZhu.length, caiBin = caiHits.length - caiZhu;
  const guanZhu = guanInZhu.length, guanBin = guanHits.length - guanZhu;
  let score = 50;
  if (caiZhu > 0) { score += 8 * caiZhu; notes.push(`✓ Tài tinh (${caiWx}) tọa 主位 (${caiInZhu.map((x) => POS_VI[x.pos]).join('/')}) → tài về tay mình, ${caiZhu >= 2 ? 'rất hữu' : 'có phúc'}.`); }
  if (guanZhu > 0) { score += 8 * guanZhu; notes.push(`✓ Quan/Sát (${guanWx}) tọa 主位 (${guanInZhu.map((x) => POS_VI[x.pos]).join('/')}) → quyền/phận sự nắm trong tay.`); }
  if (caiBin > caiZhu) { score -= 5; notes.push(`• Tài tinh phân tán 宾位 (Năm/Tháng) → tài ra ngoài, mình phải争/chiếm mới có.`); }
  if (caiHits.length === 0 && guanHits.length === 0) { score -= 8; notes.push(`• Mệnh ít Tài Quan → 盲派 gọi là "thiếu đối tượng làm công", phú quý thiên về tích lũy chậm.`); }

  // 2. 做功效率 — có hợp/chế/xung 拿 tài quan không?
  const ix = R.interactions;
  const hasHe = ix.zhiHe.length + ix.ganHe.length + ix.sanHe.length;
  const hasChong = ix.chong.length;
  if (hasHe >= 2) { score += 8; notes.push(`✓ Nhiều hợp (${hasHe}) — 做功效率 CAO (lục/tam hợp là công lớn), chủ động lấy được tài quan.`); }
  else if (hasHe > 0) { score += 4; notes.push(`• Có hợp — 做功 vừa, cơ hội tới qua quan hệ.`); }
  if (hasChong >= 2) { score -= 4; notes.push(`• Xung nhiều — 做功 bằng xung (hiệu năng thấp), biến động nhiều mới được.`); }

  // 3. 日干合 tài/quan → chủ động theo đuổi
  const dmHe = GAN_HE[dmGan];
  if (dmHe) {
    const heTarget = list.find((x) => x.gan === dmHe);
    if (heTarget) {
      const tWx = GAN[heTarget.gan].wx;
      const rel = tWx === caiWx ? 'Tài' : tWx === guanWx ? 'Quan' : (tWx === dmWx ? 'Tỷ' : 'sao khác');
      notes.push(`≡ Nhật Can ${dmGan} hợp ${heTarget.gan} (tại Trụ ${POS_VI[heTarget.pos]}) → chủ động "theo đuổi" ${rel}, ${rel === 'Tài' || rel === 'Quan' ? 'cố ý cầu tài/quan — tốt nếu hợp được' : 'hợp vào sao khác (tình/duyên).'}`);
      if (rel === 'Tài' || rel === 'Quan') score += 5;
    }
  }

  // 4. Phú hay Quý (Tài chủ đạo → phú; Quan chủ đạo → quý)
  let fuguui;
  if (caiHits.length > guanHits.length) fuguui = 'PHÚ (Tài chủ đạo — Tài nhiều → hướng phú/kinh doanh)';
  else if (guanHits.length > caiHits.length) fuguui = 'QUÝ (Quan/Sát chủ đạo → hướng quý/quyền/quan)';
  else fuguui = 'Phú Quý cân bằng';

  score = Math.max(20, Math.min(95, Math.round(score)));
  let level;
  if (score >= 78) level = 'Cách cao (làm lớn được)';
  else if (score >= 62) level = 'Cách trung thượng (tiểu chủ/sự nghiệp vững)';
  else if (score >= 45) level = 'Cách trung (cần nỗ lực, làm công/kinh doanh vừa)';
  else level = 'Cách thường (làm ăn bình, dựa vận + cải mệnh)';

  notes.push(`【做功定層次】${level}. ${fuguui}.`);
  notes.push(`Lưu ý 盲派: phú quý = 财官 tập trung主位 + 做功效率 cao; vô cách vẫn có tiền nếu 做功 tốt — nên dù mệnh thấp, cải mệnh = tăng 做功 (hợp tác, kết nối = "hợp" là công lớn).`);

  return { score, level, fuguui, caiWx, guanWx, notes };
}
