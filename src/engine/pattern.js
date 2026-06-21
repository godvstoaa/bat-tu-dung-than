// ============================================================================
//  ĐỊNH CÁCH CỤC (格局) theo 子平真詮
//  Nguyên lý: "八字用神, 专求月令" — 格神 (dụng thần định cách) lấy từ Nguyệt Lệnh.
//    1) Nguyệt chi bản khí > trung khí > dư khí; ưu tiên khí nào THẤU CAN.
//    2) Thập thần của 格神 so với Nhật Chủ → tên cách (8 chính cách).
//    3) Nguyệt lệnh là Tỷ/Kiếp → Kiến Lộc / Nguyệt Kiếp / Nguyệt Nhận (gọi chung
//       "nguyệt lệnh vô cách khả thủ", phải lấy Dụng Thần ở chỗ khác).
//    4) Cách ĐẶC BIỆT (ngoại cách): Chuyên Vượng (曲直/炎上/稼穑/从革/润下),
//       Tòng cách (tòng tài/sát/ nhi/ vượng/ cường), Hóa khí.
// ============================================================================
import { GAN, ZHI, HIDDEN, SHENG, KE, KE_BY } from './constants.js';
import { tenGod, godGroup } from './core.js';

// ---- Tên Hán-Việt cho 8 chính cách + biến thể ----
export const PATTERN_VI = {
  正官格: 'Chính Quan cách',
  七殺格: 'Thất Sát cách (Thiên Quan / Thiên Tướng)',
  正財格: 'Chính Tài cách',
  偏財格: 'Thiên Tài cách (Phi Tài)',
  正印格: 'Chính Ấn cách',
  偏印格: 'Thiên Ấn cách (Kiêu Thần)',
  食神格: 'Thực Thần cách',
  傷官格: 'Thương Quan cách',
  建祿格: 'Kiến Lộc cách',
  月劫格: 'Nguyệt Kiếp cách',
  羊刃格: 'Dương Nhận cách (Nguyệt Nhận)',
  // đặc biệt cách
  曲直格: 'Khúc Trực cách (Chuyên Vượng Mộc)',
  炎上格: 'Diêm Thượng cách (Chuyên Vượng Hỏa)',
  稼穡格: 'Giá Sắc cách (Chuyên Vượng Thổ)',
  從革格: 'Tòng Cách cách (Chuyên Vượng Kim)',
  潤下格: 'Nhuận Hạ cách (Chuyên Vượng Thủy)',
  從財格: 'Tòng Tài cách',
  從殺格: 'Tòng Sát cách',
  從兒格: 'Tòng Nhi cách (Tòng Thực Thương)',
  從旺格: 'Tòng Vượng cách',
};

// ---- Ưu tiên Dụng/Thích/Kỵ của từng cách (theo nhóm Thập Thần) ----
//   nhóm: ti(Tỷ Kiếp) yin(Ấn) shi(Thực Thương) cai(Tài) guan(Quan Sát)
export const PATTERN_PREF = {
  正官格: { shun: true, yong: ['guan'], xi: ['cai', 'yin'], ji: ['shi'], note: 'Chính Quan là sao cát tôn quý, thuận dụng — lấy Tài sinh quan, Ấn hộ quan; tối kỵ Thương Quan phá quan, Thất Sát hỗn tạp, hình xung.' },
  七殺格: { shun: false, yong: ['shi', 'yin'], xi: ['shi'], ji: ['cai'], note: 'Thất Sát cương mãnh, nghịch dụng — cần Thực Thần chế sát hoặc Ấn hóa sát; kỵ Tài đảng sát làm sát thêm hung.' },
  正財格: { shun: true, yong: ['cai'], xi: ['shi', 'guan'], ji: ['ti'], note: 'Chính Tài là lương thực, thuận dụng — lấy Thực Thương sinh tài, Quan tinh hộ tài; kỵ Tỷ Kiếp đoạt tài.' },
  偏財格: { shun: true, yong: ['cai'], xi: ['shi', 'guan'], ji: ['ti'], note: 'Thiên Tài (Tài lớn), thuận dụng như Chính Tài — lấy Thực Thương sinh tài, Quan hộ tài; kỵ Tỷ Kiếp tranh giành.' },
  正印格: { shun: true, yong: ['yin'], xi: ['guan'], ji: ['cai'], note: 'Chính Ấn chủ quyền lộc, thuận dụng — lấy Quan Sát sinh Ấn; tối kỵ Tài tinh phá Ấn.' },
  偏印格: { shun: false, yong: ['cai'], xi: ['cai'], ji: ['shi'], note: 'Kiêu Thần (Thiên Ấn), nghịch dụng — cần Thiên Tài chế ngự Kiêu Thần; đặc kỵ Kiêu đoạt Thực (kiêu thần đoạt thực).' },
  食神格: { shun: true, yong: ['shi'], xi: ['cai', 'guan'], ji: ['yin'], note: 'Thực Thần chủ yến ẩm phúc lộc, thuận dụng — lấy Tài đi kèm, Quan tinh hộ vệ; kỵ Thiên Ấn (Kiêu) đoạt thực.' },
  傷官格: { shun: false, yong: ['yin', 'cai'], xi: ['cai', 'yin'], ji: ['guan'], note: 'Thương Quan nghịch dụng — hoặc dùng Ấn chế thương (thương quan phối ấn), hoặc dùng Tài hóa thương (thương quan sinh tài); tối kỵ "thương quan kiến quan" sinh tai họa.' },
  建祿格: { shun: true, yong: ['cai', 'guan'], xi: ['cai', 'guan', 'yin'], ji: ['ti'], note: 'Nguyệt lệnh là Lộc (Tỷ Kiếp), bản thân vốn vượng — Dụng Thần chuyển sang Tài – Quan; kỵ thêm Tỷ Kiếp.' },
  月劫格: { shun: false, yong: ['guan', 'shi'], xi: ['guan'], ji: ['cai'], note: 'Nguyệt lệnh là Kiếp Tài — cần Quan Sát chế ngự hoặc Thực Thương hóa tiết; đơn độc thấy Tài dễ tranh giành.' },
  羊刃格: { shun: false, yong: ['guan', 'shi'], xi: ['guan'], ji: ['cai'], note: 'Dương Nhận sát trọng, nghịch dụng — tất phải Quan Sát chế nhận hoặc Thương Quan hóa tiết; thấy Tài không có vệ thì sinh tai.' },
  // đặc biệt cách
  曲直格: { special: 'zhuanwang', wx: '木', yong: ['shi', 'ti'], xi: ['yin'], ji: ['guan'], note: 'Chuyên Vượng Mộc — thuận thế: lấy Thực Thương tiết tú泄秀, Tỷ Kiếp trợ thế, Ấn sinh phù; ĐẠI KỴ Quan Sát khắc thân (phạm vượng nghịch thế).' },
  炎上格: { special: 'zhuanwang', wx: '火', yong: ['shi', 'ti'], xi: ['yin'], ji: ['guan'], note: 'Chuyên Vượng Hỏa — thuận thế tiết tú; kỵ Quan Sát (Thủy) phạm vượng.' },
  稼穡格: { special: 'zhuanwang', wx: '土', yong: ['shi', 'ti'], xi: ['yin'], ji: ['guan'], note: 'Chuyên Vượng Thổ — thuận thế tiết tú; kỵ Quan Sát (Mộc) phạm vượng.' },
  從革格: { special: 'zhuanwang', wx: '金', yong: ['shi', 'ti'], xi: ['yin'], ji: ['guan'], note: 'Chuyên Vượng Kim — thuận thế tiết tú; kỵ Quan Sát (Hỏa) phạm vượng.' },
  潤下格: { special: 'zhuanwang', wx: '水', yong: ['shi', 'ti'], xi: ['yin'], ji: ['guan'], note: 'Chuyên Vượng Thủy — thuận thế tiết tú; kỵ Quan Sát (Thổ) phạm vượng.' },
  從財格: { special: 'cong', yong: ['cai', 'shi'], xi: ['cai', 'shi', 'guan'], ji: ['ti', 'yin'], note: 'Tòng Tài — Nhật Chủ cực nhược, theo Tài — lấy Tài / Thực Thương sinh tài; kỵ Tỷ Kiếp – Ấn phá thế theo.' },
  從殺格: { special: 'cong', yong: ['guan', 'cai'], xi: ['guan', 'cai'], ji: ['ti', 'yin', 'shi'], note: 'Tòng Sát — theo Quan Sát — lấy Sát / Tài đảng sát; kỵ Thực Thần chế sát, Ấn – Tỷ phá thế.' },
  從兒格: { special: 'cong', yong: ['shi', 'cai'], xi: ['shi', 'cai'], ji: ['yin', 'ti', 'guan'], note: 'Tòng Nhi — theo Thực Thương — lấy Thực Thương / Tài; kỵ Ấn đoạt thực, Tỷ Kiếp, Quan.' },
  從旺格: { special: 'cong', yong: ['ti', 'yin'], xi: ['ti', 'yin'], ji: ['guan', 'cai', 'shi'], note: 'Tòng Vượng — Nhật Chủ cực vượng, theo vượng thế — lấy Tỷ Kiếp / Ấn; kỵ Quan – Tài – Thực Thương phá thế.' },
};

// Lộc & Nhận của Nhật Can (để nhận diện Kiến Lộc / Nguyệt Nhận)
import { LU_SHEN, YANG_REN } from './shensha.js';

/**
 * Quyết định cách cục. Trả về:
 *   { type, name, vi, geShen, shunNi, pref, note, special }
 */
export function computePattern(chart, wx, strength, interactions) {
  const dg = chart.dayGan;
  const dmWx = chart.dayMaster.wx;
  const monthZhi = chart.monthZhi;
  const hidden = HIDDEN[monthZhi]; // [本气, (中气, 余气)]
  const stemsGan = ['year', 'month', 'time'].map((k) => chart.pillars[k].gan); // can Năm/Tháng/Giờ (không tính ngày)

  // === Bước 0: kiểm cách đặc biệt trước (ưu tiên cao khi đạt ngưỡng) ===
  const special = detectSpecial(chart, wx, strength, interactions);
  if (special) {
    const pref = PATTERN_PREF[special.name];
    return {
      type: 'special',
      name: special.name,
      vi: PATTERN_VI[special.name] || special.name,
      geShen: special.geShen || null,
      shunNi: 'thuận thế',
      pref, note: pref.note, special,
    };
  }

  // === Bước 1: tìm 格 thần (khí thấu can theo thứ tự bản > trung > dư) ===
  let geGan = hidden[0];
  let geSource = 'bản khí';
  for (let i = 0; i < hidden.length; i++) {
    if (stemsGan.includes(hidden[i])) { geGan = hidden[i]; geSource = i === 0 ? 'bản khí' : (i === 1 ? 'trung khí' : 'dư khí'); break; }
  }
  const geGod = tenGod(dg, geGan);
  const geGroup = godGroup(geGod);

  // === Bước 2: Nếu nguyệt lệnh là Tỷ Kiếp → Kiến Lộc / Nguyệt Kiếp / Nhận ===
  if (geGroup === 'ti') {
    let name;
    if (monthZhi === LU_SHEN[dg]) name = '建祿格';          // nguyệt lệnh đúng vị trí Lộc
    else if (monthZhi === YANG_REN[dg]) name = '羊刃格';    // đúng vị trí Dương Nhận
    else name = '月劫格';
    const pref = PATTERN_PREF[name];
    return {
      type: 'luyue', name, vi: PATTERN_VI[name],
      geShen: { gan: geGan, god: geGod, wx: GAN[geGan].wx, source: geSource },
      shunNi: pref.shun ? 'thuận dụng' : 'nghịch dụng',
      pref, note: pref.note, special: null,
    };
  }

  // === Bước 3: 8 chính cách — tên cách theo Thập thần của 格 thần ===
  const nameMap = { 正官: '正官格', 七殺: '七殺格', 正財: '正財格', 偏財: '偏財格', 正印: '正印格', 偏印: '偏印格', 食神: '食神格', 傷官: '傷官格' };
  const name = nameMap[geGod] || '正官格';
  const pref = PATTERN_PREF[name];
  return {
    type: 'normal',
    name, vi: PATTERN_VI[name],
    geShen: { gan: geGan, god: geGod, wx: GAN[geGan].wx, source: geSource },
    shunNi: pref.shun ? 'thuận dụng' : 'nghịch dụng',
    pref, note: pref.note, special: null,
  };
}

// ---- Phát hiện cách đặc biệt (Chuyên Vượng / Tòng cách) ----
function detectSpecial(chart, wx, strength, interactions) {
  const dmWx = chart.dayMaster.wx;
  const monthZhi = chart.monthZhi;
  const total = wx.total || 1;

  // -- TỒNG cách (Nhật Chủ cực nhược, theo một hành khác) --
  if (strength.ratio < 0.25) {
    // Đếm nhóm ngoài (Tài/Quan/Thực) xem ai áp đảo
    const groups = { cai: 0, guan: 0, shi: 0 };
    for (const [w, s] of Object.entries(wx.score)) {
      const rel = relGroup(dmWx, w);
      if (groups[rel] !== undefined) groups[rel] += s;
    }
    const dom = Object.entries(groups).sort((a, b) => b[1] - a[1])[0];
    if (dom[1] / total > 0.45) {
      // phải ít/không có Ấn-Tỷ trợ thân
      const help = (wx.score[dmWx] + wx.score[SHENG_BY[dmWx]]) / total;
      if (help < 0.22) {
        const map = { cai: '從財格', guan: '從殺格', shi: '從兒格' };
        return { kind: 'cong', name: map[dom[0]], geShen: { wx: dominantWx(dmWx, dom[0]) } };
      }
    }
  }

  // -- CHUYÊN VƯỢNG / TÒNG VƯỢNG (Nhật Chủ cực vượng, một hành áp đảo) --
  if (strength.ratio > 0.70) {
    const dmScore = wx.score[dmWx] / total;
    // Chuyên vượng: cần tam hợp/tam hội行 Nhật Chủ + không có quan sát khắc
    const sanHui = (interactions.sanHui || []).some((s) => s.wx === dmWx);
    const sanHe = (interactions.sanHe || []).some((s) => s.wx === dmWx);
    const hasOfficer = hasOfficerStem(chart, dmWx);
    if ((sanHui || sanHe) && !hasOfficer && dmScore > 0.40) {
      const zwMap = { 木: '曲直格', 火: '炎上格', 土: '稼穡格', 金: '從革格', 水: '潤下格' };
      return { kind: 'zhuanwang', name: zwMap[dmWx], geShen: { wx: dmWx } };
    }
    // Tòng vượng: chỉ cần thân cực vượng, không thành chuyên vượng nghiêm ngặt
    if (strength.ratio > 0.82) {
      return { kind: 'cong', name: '從旺格', geShen: { wx: dmWx } };
    }
  }

  return null;
}

// Hỗ trợ: nhóm quan hệ + có can/chi hành Quan Sát (khắc Nhật Chủ) không
function relGroup(dmWx, w) {
  if (w === dmWx) return 'ti';
  if (w === KE[dmWx]) return 'cai';
  if (w === KE_BY[dmWx]) return 'guan';
  if (w === SHENG[dmWx]) return 'shi';
  return 'yin';
}
function dominantWx(dmWx, grp) {
  return { cai: KE[dmWx], guan: KE_BY[dmWx], shi: SHENG[dmWx] }[grp];
}
function hasOfficerStem(chart, dmWx) {
  const off = KE_BY[dmWx];
  for (const k of ['year', 'month', 'day', 'time']) {
    if (GAN[chart.pillars[k].gan].wx === off) return true;
    if (ZHI[chart.pillars[k].zhi].wx === off) return true;
  }
  return false;
}
