// ============================================================================
//  ÂM TÀ · TU LUYỆN · TRỪ TÀ — DEDICATED MODULE (module riêng, dễ nâng cấp)
//  ----------------------------------------------------------------------------
//  Tổng hợp + curated MỘT miền nội dung (âm tà quỷ quái + tu luyện + trừ tà) thành
//  một module độc lập, tách khỏi «Thư viện Huyền học» (bách khoa tổng quát). Đây là
//  chỗ để nâng cấp sau này (thêm tài liệu giải mã mới) mà không đụng module khác.
//
//  Nguồn (tái dùng, không duplicate): amta-data (indicators/spiritTypes/remedies/
//  ETHICS) + cultivation-data (tu luyện) + talisman-data (curated 符/chú/nghi thức
//  trừ tà). Module này = lớp curated + meta + helper cho miền «âm tà tu luyện».
//  ----------------------------------------------------------------------------
//  ⚠ ETHICS (inherits amta-data ETHICS): tham chiếu văn hoá-tôn giáo, KHÔNG chẩn
//  đoán «âm tà»/y tế. Opt-in. 符/诀 chỉ cấu trúc; nghi lễ do 受箓 đạo sĩ. Tu luyện
//  thật sự cần sư thừa — KHÔNG tự luyện (nguy).
//  Pure ES module. `node --check`.
// ============================================================================
import { ETHICS, indicators, spiritTypes, remedies } from './amta-data.js';
import { CULTIVATION } from './cultivation-data.js';
import { TALISMANS } from './talisman-data.js';

// Curated subset: 符/chú/nghi thức liên quan trực tiếp trừ tà/收惊/护身/净宅/化煞/解厄/度亡.
const AM_TA_KEYS = ['驅邪', '驅', '收驚', '收妖', '護身', '淨', '鎮宅', '化煞', '解厄', '殺鬼', '伏魔', '安魂', '除煞', '度亡', '除穢'];
const _hit = (e) => {
  const blob = (e.use || '') + ' ' + (e.meaning || '') + ' ' + (e.name_han || '');
  return AM_TA_KEYS.some((k) => blob.includes(k));
};
export const FU_CHU = TALISMANS.filter((e) => ['mantra', 'fu', 'ritual'].includes(e.layer) && _hit(e));

// Domain object — một chỗ duy nhất cho toàn miền «âm tà tu luyện».
export const AMTA_TU_LUYEN = {
  domain: 'am-ta-tu-luyen',
  titleVi: 'Âm Tà · Tu Luyện · Trừ Tà',
  titleZh: '陰邪 · 修煉 · 祛邪',
  ETHICS,
  // âm tà (signal + classification + remedies)
  indicators,        // 11 chỉ báo Bát Tự cổ điển (TƯỢNG, không chẩn đoán)
  spiritTypes,       // phân loại hồn/vong/quỷ yêu
  remedies,          // 7 nhóm biện pháp trừ tà (mô tả, 受箓 đạo sĩ)
  // 符/chú/nghi thức trừ tà (curated)
  fuChu: FU_CHU,
  // tu luyện (công pháp)
  cultivation: CULTIVATION,
  counts: {
    indicators: indicators.length,
    spiritTypes: spiritTypes.length,
    remedies: remedies.length,
    fuChu: FU_CHU.length,
    cultivation: CULTIVATION.length,
  },
};

export function amtaTuLuyenTotal() {
  const c = AMTA_TU_LUYEN.counts;
  return c.indicators + c.spiritTypes + c.remedies + c.fuChu + c.cultivation;
}

// Chart-aware: giữ suggestByAmTa từ talisman-data (đã có) — re-export cho tiện.
export { suggestByAmTa } from './talisman-data.js';
