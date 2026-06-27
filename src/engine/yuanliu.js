// ============================================================================
//  源流 (NGUỒN-LƯU) — DÒNG KHÍ NGŨ HÀNH QUA TỨ TRỤ (滴天髓 源流篇)
//  "Khí mệnh chảy từ đâu tới, dừng ở đâu? «源远流长» thì phú quý bền."
//  * 源头 (nguồn): hành vượng nhất = nơi khí PHÁT. Cổ法 «源头水清» — nguồn mạnh & sạch.
//  * 流向 (lưu hướng): theo tương SINH từ nguồn (木→火→土→金→水→木).
//  * 流长/流短: dòng chảy xuyên qua mấy hành có ý nghĩa → «源远流长» (5/5) = mệnh thuận
//    hoà phú quý; «流不远» (1-2) = khí đình trệ, tài khó phát huy.
//  * 归宿 (quy túc = endpoint): hành nơi dòng khí DỪNG → chỉ KHÍA CẠNH thịnh:
//    quy Tài→phú, quy Quan→quyền, quy Ấn→danh, quy Thực/Thương→tài năng, quy Tỷ→tự lực.
//  * 缺/阻塞 (khiếu): hành yếu trong chuỗi sinh = nơi dòng TẮC → cần 大运/流年 bổ.
//  Nguồn: 滴天髓阐微 源流篇 (任铁樵), 渊海子平 五行生克流通.
// ============================================================================
import { WUXING, WX_VI, SHENG, SHENG_BY, KE, KE_BY } from './constants.js';

// Điểm cuối (endpoint) có quan hệ gì với Nhật Chủ → khía cạnh thịnh.
const ASPECT = {
  bijie: { key: 'Tỷ/Kiếp', vi: 'bản thân · đồng minh · cạnh tranh (tự lực, anh em)' },
  shishang: { key: 'Thực/Thương', vi: 'tài năng · sáng tạo · con cái · biểu đạt' },
  yin: { key: 'Ấn', vi: 'học vấn · danh vọng · phù trợ · tri thức' },
  cai: { key: 'Tài', vi: 'tài sản · kinh doanh · vợ/người yêu · vật chất' },
  guan: { key: 'Quan/Sát', vi: 'sự nghiệp · quyền uy · danh vị · khuôn khổ' },
};
function relOf(endpoint, dmWx) {
  if (endpoint === dmWx) return 'bijie';
  if (SHENG[dmWx] === endpoint) return 'shishang';   // Nhật sinh → Thực/Thương
  if (SHENG_BY[dmWx] === endpoint) return 'yin';      // sinh Nhật → Ấn
  if (KE[dmWx] === endpoint) return 'cai';            // Nhật khắc → Tài
  if (KE_BY[dmWx] === endpoint) return 'guan';        // khắc Nhật → Quan/Sát
  return '?';
}

const MEANINGFUL = 0.15; // hành có mặt (có ý nghĩa) khi ≥15% tổng ngũ hành.

/**
 * Phân tích 源流 dòng khí ngũ hành.
 * @param {object} wx — kết quả scoreWuXing ({ score, total })
 * @param {string} dmWx — hành Nhật Chủ (để ánh xạ endpoint → khía cạnh)
 * @returns {{ source, chain, flowLen, gap, endpoint, aspectKey, aspectVi, fullCycle, verdict, note, summary }}
 */
export function analyzeYuanLiu(wx, dmWx) {
  const score = wx.score || {};
  const total = wx.total || (Object.values(score).reduce((a, b) => a + (b || 0), 0) || 1);
  const pct = (w) => (score[w] || 0) / total;

  // 1) 源头 = hành vượng nhất
  const ranked = WUXING.slice().sort((a, b) => (score[b] || 0) - (score[a] || 0));
  const source = ranked[0];

  // 2) Vẽ chuỗi tương sinh từ nguồn (5 bước → khép vòng)
  const chain = [];
  let cur = source;
  for (let i = 0; i < 5; i++) {
    chain.push({ wx: cur, pct: +pct(cur).toFixed(3) });
    cur = SHENG[cur];
  }

  // 3) Chiều dài dòng chảy = mấy hành liên tiếp (từ nguồn) có ý nghĩa
  let flowLen = 0;
  for (const c of chain) {
    if (c.pct >= MEANINGFUL) flowLen++;
    else break;
  }

  // 4) 缺 = hành đầu tiên trong chuỗi quá nhẹ (nơi dòng tắc)
  const gapIdx = chain.findIndex((c) => c.pct < MEANINGFUL);
  const gap = gapIdx >= 0 ? chain[gapIdx].wx : null;

  // 5) 归宿 endpoint = hành cuối trong đoạn chảy ý nghĩa
  const endpoint = flowLen > 0 ? chain[flowLen - 1].wx : source;
  const rel = relOf(endpoint, dmWx);
  const asp = ASPECT[rel] || { key: '?', vi: '?' };

  // 6) Phán
  const fullCycle = flowLen >= 5;
  // [loop 501] gap remedy — hành động cụ thể mở dòng (màu/hướng/ngành cho gap element).
  const GAP_REMEDY = { 木:{màu:'xanh lá',hướng:'Đông',ngành:'giáo dục/nông/gỗ'}, 火:{màu:'đỏ',hướng:'Nam',ngành:'ẩm thực/điện/giải trí'}, 土:{màu:'vàng/nâu',hướng:'Tây Nam/Trung',ngành:'BĐS/xây/nông'}, 金:{màu:'trắng',hướng:'Tây',ngành:'tài chính/kim loại/công nghệ'}, 水:{màu:'đen/xanh đậm',hướng:'Bắc',ngành:'thương mại/logistics/thủy sản'} };
  const gapTip = (g) => { const r = GAP_REMEDY[g]; return r ? ` Mở dòng: bổ ${WX_VI[g]} — màu ${r.màu}, hướng ${r.hướng}, ngành ${r.ngành}.` : ''; };
  let verdict, note;
  if (fullCycle) {
    verdict = '源远流长 (nguồn xa chảy dài)';
    note = `5 hành LƯU THÔNG tuần hoàn («源远流长») — khí mệnh THUẬN HOÀ, ngũ hành tương sinh không tắc → phú quý bền vững, đời ít nghịch, tài năng phát huy trọn vẹn. Dòng từ ${WX_VI[source]} thuận sinh qua đủ 5 hành.`;
  } else if (flowLen >= 3) {
    verdict = `lưu thông tốt (${flowLen}/5 hành)`;
    note = `Dòng khí từ nguồn ${WX_VI[source]} chảy ${flowLen}/5 hành rồi quy về ${asp.key} (${asp.vi}).${gap ? ` Khí đình tại ${WX_VI[gap]} (chỉ ${+(pct(gap) * 100).toFixed(1)}% < 15%) → cần 大运/流 niên bổ ${WX_VI[gap]} dòng mới thông tiếp.${gapTip(gap)}` : ''}`;
  } else if (flowLen === 2) {
    verdict = `lưu thông vừa (${flowLen}/5 hành)`;
    note = `Dòng khí chỉ chảy ${flowLen} hành rồi dừng, quy về ${asp.key} (${asp.vi}). Khí chưa lan tới toàn cục, tài/Dụng cần vận bổ hành ${gap ? WX_VI[gap] : 'thiếu'} mới phát huy.${gap ? gapTip(gap) : ''}`;
  } else {
    verdict = 'khí trệ (nguồn mạnh nhưng dòng tắc)';
    const next = SHENG[source];
    note = `${WX_VI[source]} vượng nhất (${+(pct(source) * 100).toFixed(1)}%) nhưng dòng sinh không chảy xa («源头旺而流不远») → khí ĐÌNH TRỆ, tài năng khó phát huy, dễ ủ. Cần 大运/流 niên có ${WX_VI[next]} (hành ${WX_VI[source]} sinh tới) mở dòng.${gapTip(next)}`;
  }

  const chainVi = chain.map((c) => `${WX_VI[c.wx]}(${(c.pct * 100).toFixed(0)}%)`).join(' → ');
  const summary = `源头 ${WX_VI[source]} → [${chainVi}] | chảy ${flowLen}/5 | quy ${asp.key}. ${verdict}.`;

  return {
    source, chain, flowLen, gap, endpoint, aspectKey: asp.key, aspectVi: asp.vi,
    fullCycle, verdict, note, summary,
  };
}
