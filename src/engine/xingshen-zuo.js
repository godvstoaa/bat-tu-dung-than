// ============================================================================
//  THẬP THẦN TỌA CHI 十神坐支 — "sao ngồi trên sao nào" → ý tượng biểu hiện
//  Can hiển (sao surface) ngồi trên chi → chi's tàng chính can = sao "tọa".
//  Mỗi cặp surface × tọa → ý nghĩa khác nhau (vd 官坐印 = sự nghiệp nhờ học vấn).
//  Nguồn: 子平真詮, 滴天髓, 十神组合论.
// ============================================================================
import { TEN_GOD_VI } from './constants.js';

// Gọi tắt nhóm sao
const G = {
  正官: '官', 七殺: '杀', 正財: '财', 偏財: '财', 正印: '印', 偏印: '枭',
  食神: '食', 傷官: '伤', 比肩: '比', 劫財: '劫',
};

// Các cặp surface × tọa → ý nghĩa (25 cặp quan trọng nhất)
const COMBO_MEANING = {
  // 官 ngồi
  '官印': '官坐印 — sự nghiệp được học vấn/đại nhân nâng đỡ → 仕途亨通, danh vọng.',
  '官财': '官坐财 — tài lộc nuôi sự nghiệp → 名利双收, sự nghiệp phát.',
  '官杀': '官坐杀 — chính quan + thất sát lẫn lộn → sự nghiệp phức tạp, dễ hoang mang.',
  '官伤': '官坐伤 — THƯƠNG QUAN KIẾN QUAN → khẩu thiệp, thị phi, nữ 克 phu, cần Ấn chế.',
  '官食': '官坐食 — tài năng phục vụ sự nghiệp → văn tài kiêm bị.',
  '官比': '官坐比 — bằng hữu vào sự nghiệp → hợp tác, cạnh tranh.',
  '官劫': '官坐劫 — tranh giành chức vị → cần cẩn thận nhân sự.',
  '官官': '官坐官 — thuần túy quan tinh → sự nghiệp ổn định, quy củ.',
  '官枭': '官坐枭 — quý nhân nhưng lập dị → sự nghiệp phi chính thống.',
  // 杀 ngồi
  '杀印': '杀坐印 — SÁT ẤN TƯƠNG SINH → hóa sát vi quyền, thượng đẳng cách.',
  '杀财': '杀坐财 — tài đảng sát → sát càng mạnh, cẩn thận tài lộc gây rủi ro.',
  '杀食': '杀坐食 — THỰC CHẾ SÁT → dùng trí tuệ chế ngự áp lực, mưu lược.',
  '杀伤': '杀坐伤 — thương quan chế sát → phản kháng áp lực, dám phá.',
  '杀杀': '杀坐杀 — sát khí trùng điệp → áp lực rất lớn, cần chế.',
  '杀比': '杀坐比 — bằng hữu chia áp lực → hợp tác chống khó.',
  // 财 ngồi
  '财食': '财坐食 — THỰC THẦN SINH TÀI → dùng tài hoa kiếm tiền, thịnh vượng.',
  '财伤': '财坐伤 — thương quan sinh tài → khẩu tài/sáng tạo kiếm tiền, quyết tiến.',
  '财官': '财坐官 — tài nuôi quan → danh lợi song toàn.',
  '财杀': '财坐杀 — tài đảng sát → vì tiền tăng áp lực/rủi ro.',
  '财印': '财坐印 — TÀI PHÁ ẤN → tài lộc phá học vấn/bảo vệ, cần cân bằng.',
  '财比': '财坐比 — TỶ KIẾP ĐOẠT TÀI → bạn bè/anh em tranh giành tiền bạc.',
  '财劫': '财坐劫 — KIẾP TÀI ĐOẠT → hao tiền lớn, cẩn thận đầu tư/cho vay.',
  '财财': '财坐财 — thuần túy tài tinh → tài lộc nhiều.',
  // 印 ngồi
  '印官': '印坐官 — QUAN ẤN TƯƠNG SINH → quý nhân sự nghiệp, ấm no.',
  '印杀': '印坐杀 — hóa sát sinh thân → áp lực thành động lực.',
  '印财': '印坐财 — tài phá ấn → vì tiền hao tổn học vấn/bảo vệ.',
  '印枭': '印坐枭 — chính + thiên ấn lẫn lộn → học vấn phức tạp.',
  '印食': '印坐食 — ấn bảo vệ thực thần → ấm no, có phúc.',
  '印伤': '印坐伤 — ẤN CHẾ THƯƠNG → hóa hung vi cát, kỷ luật.',
  '印比': '印坐比 — ấn sinh tỷ kiếp → ấm no cho bằng hữu.',
  // 食 ngồi
  '食财': '食坐财 — thực sinh tài → tài hoa sinh tiền, tốt.',
  '食官': '食坐官 — thực hộ quan → tài năng bảo vệ sự nghiệp.',
  '食杀': '食坐杀 — THỰC CHẾ SÁT → mưu lược, dùng trí ngự áp lực.',
  '食枭': '食坐枭 — KIÊU ĐOẠT THỰC → hung: tài năng bị đoạt, tài lộc đứt.',
  '食印': '食坐印 — ấn bảo vệ thực → phúc lộc.',
  '食食': '食坐食 — thuần thực thần → tài hoa dồi dào.',
  // 伤 ngồi
  '伤财': '伤坐财 — THƯƠNG QUAN SINH TÀI → khẩu tài/sáng tạo kiếm tiền.',
  '伤官': '伤坐官 — THƯƠNG QUAN KIẾN QUAN → hung! khẩu thiệp, thị phi.',
  '伤印': '伤坐印 — THƯƠNG QUAN PHỐI ẤN → hóa hung vi cát, kỷ luật.',
  '伤杀': '伤坐杀 — thương quan chế sát → dám chống áp lực.',
  '伤食': '伤坐食 — thực thương đều tiết → sáng tạo mạnh nhưng hao thân.',
  // 比 ngồi
  '比财': '比坐财 — tỷ kiếp cạnh tranh tài lộc → dễ hao tiền.',
  '比官': '比坐官 — bằng hữu vào sự nghiệp → hợp tác/quan hệ.',
  '比劫': '比坐劫 — tỷ kiếp trùng → cạnh tranh mạnh, độc lập.',
  '比印': '比坐印 — ấn sinh tỷ → được bảo vệ, ấm no.',
  // 劫 ngồi
  '劫财': '劫坐财 — KIẾP TÀI ĐOẠT → hao tiền lớn, rủi ro tài chính.',
  '劫官': '劫坐官 — kiếp tài gặp quan → cạnh tranh chức vị, dễ thị phi.',
  '劫杀': '劫坐杀 — dám liều, ương ngạnh.',
};

/**
 * @returns {{ items:[{pillar, pillarVi, surfaceGod, surfaceVi, sitOnGod, sitOnVi, combo, meaning}] }}
 */
export function xingshenZuo(chart) {
  const items = [];
  // [cycle 52] thêm Trụ Ngày (日柱 = bản mệnh) — trước đây bỏ sót, mất tổ hợp 十神坐支 quan trọng nhất
  const labels = { year: 'Trụ Năm', month: 'Trụ Tháng', day: 'Trụ Ngày', time: 'Trụ Giờ' };
  for (const key of ['year', 'month', 'day', 'time']) {
    const p = chart.pillars[key];
    const surfaceGod = p.ganGod; // 十神 của can hiển
    const sitOnGod = p.hidden[0]?.god || ''; // 十神 của tàng chính can (chi's main hidden)
    const sG = G[surfaceGod] || '';
    const oG = G[sitOnGod] || '';
    const combo = sG + oG;
    const meaning = COMBO_MEANING[combo] || `${TEN_GOD_VI[surfaceGod] || surfaceGod} ngồi trên ${TEN_GOD_VI[sitOnGod] || sitOnGod} (chi ${p.zhi}).`;
    items.push({
      pillar: key, pillarVi: labels[key],
      surfaceGod, surfaceVi: TEN_GOD_VI[surfaceGod] || surfaceGod,
      sitOnGod, sitOnVi: TEN_GOD_VI[sitOnGod] || sitOnGod,
      zhi: p.zhi, combo, meaning,
    });
  }
  return { items };
}

export { G, COMBO_MEANING };
