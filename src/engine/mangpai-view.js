// ============================================================================
//  盲派象法 (Mang Phái Tượng Pháp) — Blind School PERSPECTIVE view.
//
//  ⚠ Đây là GÓC NHÌN BỔ SUNG — KHÔNG thay thế Tử Bình (子平 用神/格局).
//     UI/label: "Góc nhìn 盲派 — bổ sung cho Tử Bình".
//     Khác hẳn mangpai.js (lens "bí truyền leak" — làm công/tài quan/
//    宾 chủ + điểm số). File này triển khai tập con TẤT ĐỊNH (deterministic)
//     của 盲派象法 có thể tự động hoá:
//
//     1. 宾主定位 (Host–Guest Positioning):
//        日柱 = 主 (Host/Self) — những gì MÌNH CÓ/ GIỮ.
//        Năm/Tháng/Giờ = 宾 (Guest/Others) — những gì TỚI VỚI MÌNH.
//        (Lưu ý: mangpai.js gộp Ngày+Giờ làm 主; ở đây theo đúng口诀
//         "日为主" — chỉ Trụ Ngày mới là 主, ba trụ kia là 宾.)
//
//     2. 禄当财看 (Lu as Wealth):
//        禄 (Lộc = Địa Chi cùng hành + cùng âm/dương với Nhật Can) đại diện
//        cho "tài thật" trong 盲派.  Có Lộc + vượng → nền tảng tài vững.
//        Không Lộc → tài phải kiếm bằng đường khác (khó hơn).
//
//     3. 合财口诀 (Combination–Wealth classical mnemonics):
//        "身旺财旺合财发大财", "身弱财旺合财为穷人",
//        "官印相生主贵", "伤官见官为祸" (đối chiếu biểu thức tất định).
//
//     4. 做功 (Deed/Capacity — đếm công cụ 刑沖合害):
//        刑沖合害 = "công cụ" lá số dùng để "làm việc". Nhiều = động, ít = tĩnh.
//        Dần Thân Tỵ Hợi (tứ sinh) nặng = luôn biến động/dịch chuyển.
//
//  Nguồn: 盲派金口诀, 禄命诀, 合财口诀 (đã công khai).
//  Mọi quy tắc trong file này là TẤT ĐỊNH (deterministic) — cùng R luôn ra
//  cùng kết quả, không có yếu tố ngẫu nhiên.
// ============================================================================
import { GAN, ZHI, KE, SHENG_BY, TEN_GOD_VI, TEN_GOD_GROUP } from './constants.js';
import { tenGod } from './core.js';

// ---- Bảng 禄 (Lộc) của 10 Thiên Can — Địa Chi "đồng hành" của Nhật Can ----
// 盲派/古法: 甲禄寅, 乙禄卯, 丙禄巳, 丁禄午, 戊禄巳, 己禄午,
//           庚禄申, 辛禄酉, 壬禄亥, 癸禄子  (tức Lâm Quan vị của Nhật Can).
const LU = {
  甲: '寅', 乙: '卯', 丙: '巳', 丁: '午', 戊: '巳',
  己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子',
};

// Thiên can ngũ hợp (một chiều để tra "nhật can hợp ai")
const GAN_HE_OF = {
  甲: '己', 己: '甲', 乙: '庚', 庚: '乙', 丙: '辛', 辛: '丙',
  丁: '壬', 壬: '丁', 戊: '癸', 癸: '戊',
};

// Dần Thân Tỵ Hợi = tứ sinh (四生/四馬) — chủ sự dịch chuyển, biến động.
const FOUR_BIRTH = ['寅', '申', '巳', '亥'];

// Vị trí trụ theo tiếng Việt (cho narration)
const POS_VI = { year: 'Năm', month: 'Tháng', day: 'Ngày', time: 'Giờ' };
const POS_ROLE = { year: '宾 (khách — gia đình/xã hội)', month: '宾 (khách — cha mẹ/công việc)', day: '主 (chủ — BẢN THÂN)', time: '宾 (khách muộn — con cái/dự án vãn niên)' };
const ORDER = ['year', 'month', 'day', 'time'];

// Gom thập thần (can + tàng) theo trụ, kèm vị trí chủ/khách
function pillarStars(chart) {
  const dm = chart.dayGan;
  return ORDER.map((pos) => {
    const p = chart.pillars[pos];
    const stars = [];
    // Thiên can (trọng số 1.0); trụ ngày = 日主 → Tỷ Kiên
    const gg = pos === 'day' ? '比肩' : p.ganGod;
    if (gg) stars.push({ god: gg, vi: TEN_GOD_VI[gg] || gg, w: 1.0, layer: 'can' });
    // Tàng can bản khí (trọng số 0.5 — chỉ bản khí cho gọn)
    const main = p.hidden[0];
    if (main && main.god) stars.push({ god: main.god, vi: TEN_GOD_VI[main.god] || main.god, w: 0.5, layer: 'tàng' });
    return { pos, gan: p.gan, zhi: p.zhi, isHost: pos === 'day', stars };
  });
}

// Đếm "sức" một nhóm thập thần (ti/yin/shi/cai/guan) ở 主 vs 宾
function groupWeight(pillars, group) {
  let host = 0, guest = 0;
  for (const pl of pillars) {
    for (const s of pl.stars) {
      if (TEN_GOD_GROUP[s.god] !== group) continue;
      if (pl.isHost) host += s.w; else guest += s.w;
    }
  }
  return { host, guest, total: host + guest };
}

/**
 * Phân tích 盲派象法 — góc nhìn bổ sung cho Tử Bình.
 * @param {object} R - kết quả từ analyze() (cần R.chart, R.strength, R.interactions).
 * @returns {{
 *   hostGuest: object, luAnalysis: object, deeds: object,
 *   classicalRules: Array, summary: string[], label: string
 * }}
 */
export function analyzeMangpaiView(R) {
  const chart = R.chart;
  const ix = R.interactions;
  const dmGan = chart.dayGan;
  const dmWx = chart.dayMaster.wx;
  const isStrong = !!R.strength.strong;

  const pillars = pillarStars(chart);
  const summary = [];

  // ========================================================================
  //  1. 宾主定位 (HOST–GUEST POSITIONING)
  //     主 = Trụ Ngày; 宾 = Năm/Tháng/Giờ.
  //     Tra vị trí các nhóm: Tài (cai) / Quan (guan) / Ấn (yin) / Thực (shi).
  // ========================================================================
  const groups = {
    财: groupWeight(pillars, 'cai'),
    官: groupWeight(pillars, 'guan'),
    印: groupWeight(pillars, 'yin'),
    食: groupWeight(pillars, 'shi'),
  };
  const groupVi = { 财: 'Tài Tinh', 官: 'Quan/Sát', 印: 'Ấn Tinh', 食: 'Thực Thương' };

  // Narration ý nghĩa vị trí cho từng nhóm sao chính
  const posMeaning = (g) => {
    const { host, guest } = groups[g];
    const viName = groupVi[g];
    // Phân rã: khách chia Năm(early/gia đình) / Tháng(sự nghiệp) / Giờ(muộn)
    const byGuestPos = (pos) => {
      const pl = pillars.find((p) => p.pos === pos);
      return pl.stars
        .filter((s) => TEN_GOD_GROUP[s.god] === TEN_GOD_GROUP_REV[g])
        .reduce((a, s) => a + s.w, 0);
    };
    const inYear = byGuestPos('year'), inMonth = byGuestPos('month'), inTime = byGuestPos('time');
    if (g === '财') {
      if (host >= 0.5) return `${viName} tọa 主 (Trụ Ngày) → TIỀN MÌNH KIẾM/GIỮ được, tự thân gây dựng.`;
      if (inYear >= 0.5) return `${viName} ở 宾 (Trụ Năm) → tiền từ GIA ĐÌNH/cha mẹ/tổ nghiệp.`;
      if (inMonth >= 0.5) return `${viName} ở 宾 (Trụ Tháng) → tiền từ NGƯỜI KHÁC/công việc/đối tác.`;
      if (inTime >= 0.5) return `${viName} ở 宾 (Trụ Giờ) → tiền MUỘN — từ con cái/dự án vãn niên.`;
      return `${viName} KHÔNG hiện rõ → tài phải tự tích lũy dần, ít "đối tượng" tới tay.`;
    }
    if (g === '官') {
      if (host >= 0.5) return `Quan/Sát tọa 主 (Trụ Ngày) → QUYỀN/SỰ NGHIỆP tự nắm, tự gây dựng địa vị.`;
      if (inMonth >= 0.5) return `Quan/Sát ở 宾 (Trụ Tháng) → sự nghiệp đến từ SƠN ĐỒNG/công việc người khác giao.`;
      if (inYear >= 0.5) return `Quan/Sát ở 宾 (Trụ Năm) → quyền từ GIA ĐÌNH/danh tiếng tổ tiên.`;
      if (inTime >= 0.5) return `Quan/Sát ở 宾 (Trụ Giờ) → quyền/danh MUỘN, từ con cái/dự án muộn.`;
      return `Quan/Sát KHÔNG hiện rõ → địa vị tự vun đắp, ít bệ đỡ bên ngoài.`;
    }
    if (g === '印') {
      if (host >= 0.5) return `Ấn tọa 主 (Trụ Ngày) → HỌC VẤN/NGUỒN LỰC của chính mình, tự học tự dưỡng.`;
      if (inYear + inMonth >= 0.5) return `Ấn ở 宾 (Năm/Tháng) → học vấn/sự bảo vệ từ CHA MẸ/thầy cô/người lớn.`;
      if (inTime >= 0.5) return `Ấn ở 宾 (Trụ Giờ) → học/sự giúp đỡ MUỘN, hoặc từ con cái.`;
      return `Ấn không rõ → tự lập sớm, ít dựa dẫm nguồn lực ngoài.`;
    }
    // 食
    if (host >= 0.5) return `Thực Thương tọa 主 → TÀI HOA/KHẨU TÀI là của mình, tự sáng tạo.`;
    if (inMonth + inTime >= 0.5) return `Thực Thương ở 宾 → tài hoa bộc lộ qua CÔNG VIỆC/dự án ngoài.`;
    return `Thực Thương không rõ → ít hướng sáng tạo/khẩu tài bộc lộ.`;
  };

  const hostGuest = {
    scheme: '主 = Trụ Ngày (bản thân); 宾 = Trụ Năm/Tháng/Giờ (người khác/hoàn cảnh).',
    groups: {},
  };
  for (const g of ['财', '官', '印', '食']) {
    hostGuest.groups[g] = {
      vi: groupVi[g],
      weightHost: +groups[g].host.toFixed(2),
      weightGuest: +groups[g].guest.toFixed(2),
      sitsAt: groups[g].host >= groups[g].guest && groups[g].host > 0 ? '主 (host)' : (groups[g].guest > 0 ? '宾 (guest)' : 'không rõ'),
      reading: posMeaning(g),
    };
    summary.push(`【宾主 · ${groupVi[g]}】${posMeaning(g)}`);
  }

  // ========================================================================
  //  2. 禄当财看 (LU AS WEALTH)
  // ========================================================================
  const luZhi = LU[dmGan];
  const luPresent = ORDER.some((pos) => chart.pillars[pos].zhi === luZhi);
  const luPos = ORDER.find((pos) => chart.pillars[pos].zhi === luZhi) || null;
  // Lộc mạnh = chi Lộc xuất hiện + cùng mùa/vượng (đơn giản hoá: hiện + thân vượng)
  const luStrong = luPresent && isStrong;

  let luReading;
  if (luPresent) {
    const isHost = luPos === 'day';
    luReading = isHost
      ? `Lộc (${luZhi}/${ZHI[luZhi].vi}) tọa 主 (Trụ Ngày) → "tài thật" trong tay, nền móng tài LƯỢNG vững nhất.`
      : `Lộc (${luZhi}/${ZHI[luZhi].vi}) ở 宾 (Trụ ${POS_VI[luPos]}) → tài thật CÓ nhưng phải kéo/tiến về phía mình mới giữ được.`;
    if (luStrong) luReading += ` Lộc + thân vượng → giữ được tài, nền móng phúc đức.`;
    else luReading += ` Lộc hiện nhưng thân nhược → có của cũng dễ hao, cần trợ thân.`;
  } else {
    luReading = `Lộc (${luZhi}/${ZHI[luZhi].vi}) KHÔNG xuất hiện trong tứ trụ → 盲派 gọi là "vô Lộc", tài phải kiếm bằng 做功 (hợp tác/kết nối) hoặc đường Thực Thương, khó hơn người có Lộc.`;
  }
  summary.push(`【禄当财看】${luReading}`);

  const luAnalysis = {
    dayGan: dmGan, luZhi, luZhiVi: ZHI[luZhi].vi,
    present: luPresent, position: luPos, positionVi: luPos ? POS_VI[luPos] : null,
    isHost: luPos === 'day', strong: luStrong,
    reading: luReading,
  };

  // ========================================================================
  //  3. 合财口诀 (CLASSICAL MNEMONIC RULES)
  //     Mỗi口诀 = điều kiện tất định → matched (true/false) + giải thích.
  // ========================================================================
  const cai = groups['财'];
  const guan = groups['官'];
  const yin = groups['印'];
  const shi = groups['食'];

  // 合 tài: nhật can hợp một can mang hành Tài, HOẶC có chi hợp/sao tài bị "kéo".
  const heCaiViaGan = (() => {
    const target = GAN_HE_OF[dmGan];
    if (!target) return null;
    const pos = ORDER.find((p) => chart.pillars[p].gan === target);
    if (!pos) return null;
    const rel = tenGod(dmGan, target);
    return TEN_GOD_GROUP[rel] === 'cai' ? { pos, target, rel } : null;
  })();
  const hasChiHeTouchingCai = (ix.zhiHe || []).some((h) =>
    ORDER.some((pos) => {
      const zhi = chart.pillars[pos].zhi;
      const god = chart.pillars[pos].hidden[0]?.god;
      return (zhi === h.a || zhi === h.b) && TEN_GOD_GROUP[god || ''] === 'cai';
    })
  );
  const heCai = !!(heCaiViaGan || hasChiHeTouchingCai);

  // Tài vượng = tổng trọng số Tài >= 1.0 (can hoặc tàng bản khí)
  const caiWang = cai.total >= 1.0;
  const guanWang = guan.total >= 1.0;

  // Thương quan kiến quan: có cả Thương Quan (傷官) và Chính Quan/Thất Sát (正官/七殺) trong tứ trụ
  const hasShang = ORDER.some((pos) => {
    const p = chart.pillars[pos];
    return p.ganGod === '傷官' || p.hidden.some((h) => h.god === '傷官');
  });
  const hasGuanStar = ORDER.some((pos) => {
    const p = chart.pillars[pos];
    const g = pos === 'day' ? null : p.ganGod;
    return g === '正官' || g === '七殺' || p.hidden.some((h) => h.god === '正官' || h.god === '七殺');
  });
  const shangJianGuan = hasShang && hasGuanStar;

  // Quan Ấn tương sinh: có cả Quan và Ấn (Ấn sinh thân, Quan sinh Ấn)
  const guanYinXiangSheng = guanWang && yin.total >= 1.0;

  const classicalRules = [
    {
      id: 'shenWangCaiWangHeCai',
      mnemonic: '身旺财旺合财发大财',
      vi: 'Thân vượng + Tài vượng + hợp Tài → phát đại tài',
      matched: isStrong && caiWang && heCai,
      detail: `Thân ${isStrong ? 'vượng ✓' : 'nhược ✗'} · Tài ${caiWang ? 'vượng ✓' : 'nhược ✗'} (${cai.total.toFixed(1)}) · Hợp Tài ${heCai ? '✓' : '✗'}.`,
      verdict: isStrong && caiWang && heCai
        ? 'CỚ ĐẠI PHÁT — thân khỏe giữ được tài, lại hợp được tài → kiếm lớn được.'
        : null,
    },
    {
      id: 'shenRuoCaiWangHeCai',
      mnemonic: '身弱财旺合财为穷人',
      vi: 'Thân nhược + Tài vượng + hợp Tài → nghèo (giữ tiền không được)',
      matched: !isStrong && caiWang && heCai,
      detail: `Thân ${isStrong ? 'vượng' : 'nhược ✗'} · Tài ${caiWang ? 'vượng ✗ (quá tải)' : 'nhược'} (${cai.total.toFixed(1)}) · Hợp Tài ${heCai ? '✓' : '✗'}.`,
      verdict: (!isStrong && caiWang && heCai)
        ? 'TÀI ĐA THÂN NHƯỢC — tiền tới nhưng không giữ được; 盲派 coi là nghèo (phải trợ thân Tỷ/Ấn trước).'
        : null,
    },
    {
      id: 'guanYinXiangSheng',
      mnemonic: '官印相生主贵',
      vi: 'Quan Ấn tương sinh → chủ quý (danh vọng/địa vị)',
      matched: guanYinXiangSheng,
      detail: `Quan ${guanWang ? 'vượng ✓' : 'nhược ✗'} (${guan.total.toFixed(1)}) · Ấn ${yin.total >= 1.0 ? 'có ✓' : 'thiếu ✗'} (${yin.total.toFixed(1)}).`,
      verdict: guanYinXiangSheng
        ? 'CÓ ĐỊA VỊ — Quan sinh Ấn, Ấn sinh thân → danh vọng đến qua học vấn/chức vụ, hướng QUÝ.'
        : null,
    },
    {
      id: 'shangGuanJianGuan',
      mnemonic: '伤官见官为祸',
      vi: 'Thương Quan kiến Quan → họa (口诀 盲派/子 平 đều dùng)',
      matched: shangJianGuan,
      detail: `Có Thương Quan ${hasShang ? '✓' : '✗'} · Có sao Quan ${hasGuanStar ? '✓' : '✗'}.`,
      verdict: shangJianGuan
        ? '⚠ THƯƠNG QUAN KIẾN QUAN — dễ thị phi/đụng cấp trên/pháp lý; 盲派 khuyên chế Thương (dùng Ấn) hoặc hóa (dùng Tài).'
        : null,
    },
  ];

  for (const r of classicalRules) {
    if (r.matched && r.verdict) summary.push(`【口诀 · ${r.mnemonic}】${r.verdict}`);
  }

  // ========================================================================
  //  4. 做功 (DEED/CAPACITY — 刑沖合害 inventory)
  // ========================================================================
  const nHe = (ix.zhiHe?.length || 0) + (ix.ganHe?.length || 0) + (ix.sanHe?.length || 0) + (ix.sanHui?.length || 0);
  const nChong = ix.chong?.length || 0;
  const nXing = ix.xing?.length || 0;
  const nHai = ix.hai?.length || 0;
  const totalTools = nHe + nChong + nXing + nHai;

  // Tứ sinh (Dần Thân Tỵ Hợi) nặng → biến động/dịch chuyển
  const zhis = ORDER.map((p) => chart.pillars[p].zhi);
  const birthCount = zhis.filter((z) => FOUR_BIRTH.includes(z)).length;

  let dynamism, dynamismVi;
  if (totalTools >= 4) { dynamism = 'high'; dynamismVi = 'ĐỘNG CAO — đời nhiều biến, chủ động, 做功 mạnh (nhiều công cụ).'; }
  else if (totalTools >= 2) { dynamism = 'medium'; dynamismVi = 'ĐỘNG VỪA — đời có biến nhưng kiểm soát được, 做功 vừa.'; }
  else { dynamism = 'low'; dynamismVi = 'ĐỘNG THẤP — đời tĩnh/ổn, 做 công ít → phú quý phải đi đường tích lũy/hợp tác.'; }

  let birthReading = birthCount >= 2
    ? `Tứ sinh (Dần/Thân/Tỵ/Hợi) xuất hiện ${birthCount} chi → chủ DỊCH CHUYỂN/đổi chỗ/đi xa, đời ít tĩnh.`
    : birthCount === 1
      ? `Tứ sinh xuất hiện 1 chi → có yếu tố dịch chuyển vừa.`
      : `Không có tứ sinh → đời tương đối ổn định, ít buôn dạ lê.`;

  summary.push(`【做功】${dynamismVi}`);
  if (birthCount >= 1) summary.push(`【四马】${birthReading}`);

  const deeds = {
    counts: { he: nHe, chong: nChong, xing: nXing, hai: nHai, total: totalTools },
    fourBirthCount: birthCount,
    fourBirthReading: birthReading,
    dynamism, dynamismVi,
    // 做功 hiệu năng (mangpai-style note ngắn): hợp > xung > hình > hại
    efficiencyNote: nHe > 0
      ? `Có hợp (${nHe}) → 做功 HIỆU NĂNG CAO (hợp = công lớn), cơ hội tới qua quan hệ/kết nối.`
      : nChong > 0
        ? `Chỉ có xung (${nChong}) → 做功 bằng xung (hiệu năng thấp), phải biến động mới được.`
        : totalTools > 0
          ? `Chỉ có hình/hại → 做 công yếu, phú quý chậm, cần dùng "hợp tác" (hợp nhân tạo).`
          : `Tứ trụ gần như không có 刑沖合害 → 做 công tự nhiên thấp; 盲派 khuyên TẠO HỢP (kết nối/hùn hạp) để tăng công.`,
  };

  // ========================================================================
  //  TỔNG KẾT — góc nhìn 盲派象法 (đặt nhãn RÕ là bổ sung)
  // ========================================================================
  const matchedRules = classicalRules.filter((r) => r.matched).map((r) => r.mnemonic);
  summary.push(
    `※ Đây là GÓC NHÌN 盲派象 pháp (bổ sung cho Tử Bình) — ` +
    `chủ yếu dựa vào: ${[hostGuest.groups['财'].sitsAt === '主 (host)' ? 'Tài tọa chủ' : null, luPresent ? 'có Lộc' : 'vô Lộc', totalTools >= 2 ? 'làm công động' : 'làm công tĩnh'].filter(Boolean).join(', ')}` +
    (matchedRules.length ? `; khớp口诀: ${matchedRules.join(', ')}.` : '.'),
  );

  return {
    label: 'Góc nhìn 盲派象法 — bổ sung cho Tử Bình',
    dayGan: dmGan, dayWx: dmWx, isStrong,
    hostGuest, luAnalysis, deeds, classicalRules,
    summary,
  };
}

// Bảng đảo TEN_GOD_GROUP (group → không cần, nhưng posMeaning dùng ký hiệu nhóm Hán)
const TEN_GOD_GROUP_REV = { 财: 'cai', 官: 'guan', 印: 'yin', 食: 'shi' };
