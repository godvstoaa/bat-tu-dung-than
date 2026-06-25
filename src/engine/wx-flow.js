// ============================================================================
//  NGŨ HÀNH LƯU THÔNG 五行流通 — phân tích dòng chảy ngũ hành trong tứ trụ
//  Ngũ hành có "lưu thông" (sinh liên tục) → mệnh hanh thông; "tắc" (khắc đứt) → trở ngại.
//  Vd: Mộc→Hỏa→Thổ→Kim→Thủy→Mộc =流通 hoàn toàn. Nếu một khâu bị đứt → tắc.
//  Nguồn: 滴天髓 气势篇, 子平真诠 用神流通.
// ============================================================================
import { GAN } from './constants.js';

const SHENG = { 木:'火', 火:'土', 土:'金', 金:'水', 水:'木' };
const KE = { 木:'土', 火:'金', 土:'水', 金:'木', 水:'火' };
const WX_VI = { 木:'Mộc', 火:'Hỏa', 土:'Thổ', 金:'Kim', 水:'Thủy' };

/**
 * Thu thập ngũ hành theo vị trí (trụ) + cường độ.
 */
function collectWx(chart, wx) {
  const arr = [];
  const posLabel = { year: 'Năm', month: 'Tháng', day: 'Ngày', time: 'Giờ' };
  for (const key of ['year', 'month', 'day', 'time']) {
    const p = chart.pillars && chart.pillars[key];
    if (!p || !p.gan || !GAN[p.gan]) continue; // [loop 88] guard missing pillars (robustness)
    const ganWx = GAN[p.gan].wx;
    arr.push({ pos: posLabel[key], type: 'can', wx: ganWx, pts: 1.0 });
    for (const h of (p.hidden || [])) {
      if (!h || !h.gan || !GAN[h.gan]) continue;
      const hwx = GAN[h.gan].wx;
      const hpts = +(p.hidden.indexOf(h) === 0 ? 1.5 : 0.5).toFixed(1);
      arr.push({ pos: posLabel[key], type: 'tàng', wx: hwx, pts: hpts });
    }
  }
  return arr;
}

/**
 * @returns {{ flow, blocks, circulation, profile, advice }}
 */
export function analyzeWxFlow(R) {
  const { chart, wx } = R;
  const all = collectWx(chart, wx);
  const total = wx.total || 1;

  // Nhóm theo ngũ hành + vị trí
  const wxPositions = {};
  for (const a of all) {
    if (!wxPositions[a.wx]) wxPositions[a.wx] = [];
    wxPositions[a.wx].push({ pos: a.pos, type: a.type, pts: a.pts });
  }

  // Kiểm流通: từng cặp sinh A→B, cả A và B đều có trong mệnh?
  const fiveWx = ['木', '火', '土', '金', '水'];
  const flow = [];
  const blocks = [];
  for (const a of fiveWx) {
    const b = SHENG[a]; // A sinh B
    const aPresent = (wx.score[a] || 0) > 0;
    const bPresent = (wx.score[b] || 0) > 0;
    if (aPresent && bPresent) {
      flow.push(`${WX_VI[a]}→${WX_VI[b]}:流通 (${(((wx.score[a] + wx.score[b]) / total) * 100).toFixed(0)}% tổng)`);
    } else if (aPresent && !bPresent) {
      blocks.push(`${WX_VI[a]} sinh nhưng ${WX_VI[b]} KHÔNG CÓ → ${WX_VI[a]} tiết khí vô ích (không ai nhận).`);
    }
  }

  // Đánh giá circulation
  const flowCount = flow.length; // 0-5
  const blockCount = blocks.length;
  let circulation;
  if (flowCount >= 4) circulation = 'Lưu thông TỐT — ngũ hành sinh nối liên tục, mệnh hanh thông, ít tắc nghẽn.';
  else if (flowCount >= 3) circulation = 'Lưu thông KHÁ — phần lớn sinh nối, một vài khâu yếu.';
  else if (flowCount >= 2) circulation = 'Lưu thông TRUNG BÌNH — một số khâu đứt, cần vận補.';
  else circulation = 'Lưu thông KÉM — ngũ hành đứt nhiều, mệnh dễ tắc, cần vận mang hành thiếu.';

  // Đứt đoạn cụ thể (hành bị 克 mạnh không có sinh)
  const profile = [];
  for (const w of fiveWx) {
    const score = (wx.score[w] || 0) / total;
    const mother = fiveWx.find((x) => SHENG[x] === w); // ai sinh w
    const motherScore = mother ? (wx.score[mother] || 0) / total : 0;
    const attacker = fiveWx.find((x) => KE[x] === w); // ai khắc w
    const attackerScore = attacker ? (wx.score[attacker] || 0) / total : 0;

    if (score < 0.08 && attackerScore > 0.2) {
      profile.push(`⚠ ${WX_VI[w]} (${(score * 100).toFixed(0)}%) bị ${WX_VI[attacker]} (${(attackerScore * 100).toFixed(0)}%) khắc mạnh + thiếu ${WX_VI[mother]} sinh → ${WX_VI[w]} NGUY HIỂM. Tạng phủ ${WX_VI[w]} dễ bệnh.`);
    } else if (score > 0.35) {
      profile.push(`${WX_VI[w]} (${(score * 100).toFixed(0)}%) THÁI QUÁ → dễ khắc ${WX_VI[KE[w]]}.`);
    }
  }

  // Advice
  const weakest = Object.entries(wx.score).sort((a, b) => a[1] - b[1])[0];
  const advice = `Dụng Thần ${R.yong.primary} cần được bổ. ${blockCount ? `Đứt ${blockCount} khâu流通: ${blocks.join('; ')}.` : 'Không đứt khâu流通.'} ${profile.length ? profile.join(' ') : 'Ngũ hành tương đối ổn.'}`;

  return { flow, blocks, circulation, profile, advice };
}
