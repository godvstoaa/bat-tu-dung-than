// ============================================================================
//  通根透干 + 旺相休囚死 — SỨC MẠNH THẬT CỦA DỤNG THẦN / SAO
//  "Dụng Thần tôi có 'thật' không (có gốc có lộ) hay chỉ hư phù?" — nền tảng luận lực.
//  * 通根 (thông căn): hành CÓ NGẦM trong tàng can địa chi → có "gốc". Gốc mạnh/yếu
//    theo vị trí: 本气(chính, 0.6) > 中气(0.3) > 余气(0.1). Không căn = vô根基.
//  * 透干 (thấu cán): hành CÓ LỘ ở thiên can → "hiện ra", phát huy ra ngoài.
//  * 4 tình trạng: 有力(căn+lộ, thật mạnh) / 虚浮(lộ nhưng không căn, hư) /
//    藏而不透(căn nhưng ẩn, tiềm tàng đợi lưu niên thấu mới phát) / 虚(không căn không lộ).
//  * 旺相休囚死: hành đương lệnh(旺) > được lệnh sinh(相) > sinh lệnh(休) > khắc lệnh(囚) > bị lệnh khắc(死).
//  Ý nghĩa cốt lõi: Dụng 通根透干 + vượng/tướng → Dụng THẬT, tự tốt; Dụng 虚浮/藏/死 → Dụng YẾU,
//    cần BÙ (phương/màu/ nghề/hợp tác) + đợi LƯU NIÊN thấu (can cùng hành Dụng) mới phát.
//  Khác chart.js (đếm tỉ lệ + đắc lệnh): module này = CHẤT LƯỢNG gốc+lộ của từng hành.
//  Nguồn: 滴天髓 通根篇, 子平真诠 透干会局, 渊海子平 五行旺相休囚.
// ============================================================================
import { GAN, HIDDEN, HIDDEN_WEIGHT, WX_VI } from './constants.js';

const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };
const PILLAR_VI = { year: 'Niên', month: 'Nguyệt', day: 'Nhật', time: 'Thời' };
const WU_TAI_VI = { 旺: 'Vượng', 相: 'Tướng', 休: 'Hưu', 囚: 'Tù', 死: 'Tử' };
const WU_TAI_NOTE = { 旺: 'đương lệnh — HUYỀN THẬT, mạnh nhất mùa', 相: 'lệnh sinh — được mùa nâng, mạnh thứ nhì', 休: 'sinh lệnh — nghỉ, trung bình', 囚: 'khắc lệnh — bị giam, yếu', 死: 'lệnh khắc — bị khắc chết, yếu nhất' };

/** 五行旺相休囚死 của hành e khi令 = m. */
export function wuTai(e, m) {
  if (e === m) return '旺';
  if (SHENG[m] === e) return '相';
  if (SHENG[e] === m) return '休';
  if (KE[e] === m) return '囚';
  if (KE[m] === e) return '死';
  return '?';
}

/** 通根 của 1 hành: tổng căn + danh sách (theo tàng can, weight theo vị trí). */
export function tongGen(chart, wx) {
  const roots = [];
  let total = 0;
  for (const k of ['year', 'month', 'day', 'time']) {
    const zhi = chart.pillars[k].zhi;
    const hidden = HIDDEN[zhi];
    hidden.forEach((stem, idx) => {
      if (GAN[stem].wx === wx) {
        const w = HIDDEN_WEIGHT[hidden.length][idx];
        total += w;
        roots.push({ pillar: k, vi: PILLAR_VI[k], zhi, stem, weight: w, pos: idx === 0 ? '本气' : idx === hidden.length - 1 ? '余气' : '中气' });
      }
    });
  }
  return { total: +total.toFixed(2), roots };
}

/** 透干 của 1 hành: các thiên can cùng hành. */
export function touGan(chart, wx) {
  const gans = [];
  for (const k of ['year', 'month', 'day', 'time']) {
    const p = chart.pillars[k];
    if (GAN[p.gan].wx === wx) gans.push({ pillar: k, vi: PILLAR_VI[k], gan: p.gan, ganGod: p.ganGod });
  }
  return gans;
}

/** Sức mạnh thật của 1 hành (4 tình trạng + mùa). */
export function elementPower(chart, wx, monthMainWx) {
  const root = tongGen(chart, wx);
  const reveal = touGan(chart, wx);
  const season = wuTai(wx, monthMainWx);
  let verdict, verdictVi;
  if (root.total > 0 && reveal.length > 0) { verdict = '有力'; verdictVi = 'CĂN + LỘ → Dụng thật, có lực, tự phát huy tốt.'; }
  else if (root.total === 0 && reveal.length > 0) { verdict = '虚浮'; verdictVi = 'LỘ nhưng KHÔNG căn → hư phù, phát không bền, dễ "có sao mà không linh".'; }
  else if (root.total > 0 && reveal.length === 0) { verdict = '藏而不透'; verdictVi = 'CĂN nhưng KHÔNG lộ → tiềm tàng/ẩn, đợi LƯU NIÊN thấu (can cùng hành) mới phát huy.'; }
  else { verdict = '虚'; verdictVi = 'KHÔNG căn KHÔNG lộ → yếu/vắng, rất cần bù ngoài (phương/màu/nghề/hợp tác).'; }
  return { wx, wxVi: WX_VI[wx], root, reveal, season, seasonVi: WU_TAI_VI[season], seasonNote: WU_TAI_NOTE[season], verdict, verdictVi };
}

/**
 * Phân tích通根透干 cho lá số: trọng tâm DỤNG THẦN + Nhật Chủ.
 * @returns {{ dung, dm, summary, whenReveal:[can] }}
 */
export function analyzeTongGen(R) {
  const monthMainWx = R.strength?.monthMainWx
    || (R.chart?.monthZhi ? GAN[HIDDEN[R.chart.monthZhi][0]].wx : undefined);
  const dung = elementPower(R.chart, R.yong.primary, monthMainWx);
  const dm = elementPower(R.chart, R.chart.dayMaster.wx, monthMainWx);
  // can cùng hành Dụng → lưu niên thấu sẽ kích hoạt
  const dungWx = R.yong.primary;
  const revealGans = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'].filter((g) => GAN[g].wx === dungWx);

  const summary = `Dụng ${WX_VI[R.yong.primary]}: ${dung.verdict} — ${dung.verdictVi}` +
    (dung.root.total > 0 ? ` Căn: ${dung.root.roots.map((r) => `${r.vi}(${r.zhi}=${r.stem},${r.pos},${r.weight})`).join(', ')}.` : ' Không thông căn.') +
    (dung.reveal.length ? ` Lộ: ${dung.reveal.map((r) => `${r.vi}(${r.gan})`).join(', ')}.` : ' Không thấu cán.') +
    ` Mùa: ${dung.seasonVi} (${dung.seasonNote}).` +
    (dung.verdict === '藏而不透' ? ` ⇒ đợi LƯU NIÊN can ${revealGans.join('/')} thấu ra mới phát Dụng.` : '') +
    (dung.verdict === '虚浮' || dung.verdict === '虚' ? ` ⇒ Dụng YẾU: cần bù mạnh qua hướng/màu/nghề thuộc ${WX_VI[dungWx]} + hợp tác người bổ Dụng.` : '') +
    ` Nhật Chủ ${WX_VI[R.chart.dayMaster.wx]}: ${dm.verdict} (${dm.seasonVi}).`;

  return { dung, dm, summary, whenReveal: revealGans };
}

export { WU_TAI_VI, WU_TAI_NOTE };
