// ============================================================================
//  PHONG THUỶ LINH THẦN THUỶ PHÁP 零神水法 — KÍCH HOẠT NƯỚC HÀNG NĂM
//  "Hướng nào năm nay nên đặt NƯỚC để催 tài/duyên, hướng nào kỵ nước?"
//  * Bổ sung cho annual-taboo (kỵ = tránh) → water-activation (cát = LÀM).
//  * Hệ thống: 玄空零正 (Linh-Thần chính tà).
//    - Vận đương lệnh (运 star) nhập trung cung; sao rơi phương ĐỐI vạn vận = 零神.
//    - Vận 9 (离/Hoả = Nam): 正神 = Nam, 零神 = Bắc (khái niệm).
//    - Đặt NƯỚC ĐỘNG (đài phun/hồ cá) tại phương 零神 → kích tài.
//    - Đặt NƯỚC TĨNH (ly nước) tại phương 一白 → kích đào hoa/duyên.
//  * Biến thiên hàng năm: lưu niên phi tinh quyết định phương thực tế.
//    Dùng yearFlyingStar(year) từ ./xuankong.js.
//  Nguồn: 沈氏玄空学, 玄空秘旨, 蒋大鸿 zero-positive 正零龙水诀 — tổng hợp.
// ============================================================================

import { yearFlyingStar, determineYun, STAR } from './xuankong.js';
import { SANSHA, DIR_OF, sanshaDirection } from './sansha.js'; // [loop 30] sanshaDirection → sector tam sát đơn
import { Solar } from 'lunar-javascript';

// ---- Ánh xạ ngũ hành sao → loại nước nên đặt ----
// Nước (Thủy) sinh Mộc, khắc Hỏa, bị Thổ khắc, tiết Kim.
// Cát tinh (tài/duyên/khánh) → NƯỚC ĐỘNG để kéo khí; đào hoa → NƯỚC TĨNH.
// Hung tinh Thổ (2/5) → MUỐI nước (kim tuyền) để HOÁ/TIÊU (tạo thuỷ tiết thổ + kim khắc).
const WATER_TYPE = {
  1: { kind: 'still', vi: 'nước tĩnh (ly/chén nước sạch)', zh: '静水', why: '一白 Thuỷ vốn là sao đào hoa — nước tĩnh dưỡng khí, kích nhân duyên/tình duyên/trí tuệ' },
  8: { kind: 'moving', vi: 'nước động (đài phun / hồ cá / thác nước nhỏ)', zh: '动水', why: '八白 Thổ là tài tinh đương vượng — nước động催財, sinh khí lưu thông' },
  9: { kind: 'moving', vi: 'nước động nhẹ (đài phun nhỏ / bình phun sương)', zh: '动水', why: '九紫 Hoả đương lệnh đại cát — thuỷ kích hỷ khánh/danh vọng (thuỷ hoả ký tế)' },
  6: { kind: 'moving', vi: 'nước động (phun/hồ cá)', zh: '动水', why: '六白 Kim quyền quý — nước động kéo quý nhân/quyền lực' },
  4: { kind: 'still', vi: 'nước tĩnh (ly nước + bút/sách gần)', zh: '静水', why: '四绿 Văn Xương — nước tĩnh phối hợp kích học vấn/thi cử' },
};

// ---- Hung tinh: KỴ đặt nước (trừ 5 hoàng dùng muối hoá) ----
const AVOID_REASON = {
  2: { reason: 'Nhị Hắc 病符 (Thổ bệnh) — đặt nước sẽ PHONG THỔ = tăng bệnh tật/thương tổn. Tránh nước động/tĩnh.', remedy: null },
  5: { reason: 'Ngũ Hoàng 大煞 (đại hung Thổ) — tuyệt đối KHÔNG đặt nước động/tĩnh (phong sát họa). Dùng MUỐI nước (kim tuyền/đồng tiền trong nước) để TIÊU HOÁ, không phải kích hoạt.', remedy: 'salt' },
  3: { reason: 'Tam Bích 祿存 (Mộc thị phi) — nước sinh Mộc = tăng khẩu thiệt/tranh cãi/thị phi. Tránh nước.', remedy: null },
  7: { reason: 'Thất Xích 破軍 (Kim hao tổn) — nước tiết Kim = hao tài/hình thương. Hạn chế nước.', remedy: null },
};

// ---- Vận → phương 正神 / 零神 (khái niệm cố định theo vận) ----
// 正神 = phương tự-nhiên của sao vận (theo hậu thiên bát quái ngũ hành cung).
// 零神 = phương ĐỐI (đối xứng qua trung cung) = nơi đặt nước Thuỷ vượng.
// Hậu thiên: 1坎=Bắc, 9离=Nam, 3震=Đông, 7đ兑=Tây, 4tốn=ĐN, 2khôn=TN, 6càn=TB, 8cấn=ĐB.
// "正神 phương" = cung có ngũ hành của vận star; "零神" = đối cung.
// Vận 9 (Hoả/Nam): 正神=Nam, 零神=Bắc. Vận 1 (Thuỷ/Bắc): 正神=Bắc, 零神=Nam.
const YUN_ZHENG_LING = {
  1: { zheng: 'Chính Bắc', ling: 'Chính Nam' },   // Thuỷ ↔ Hoả
  2: { zheng: 'Tây Nam', ling: 'Đông Bắc' },       // Thổ (khôn) ↔ (cấn)
  3: { zheng: 'Chính Đông', ling: 'Chính Tây' },   // Mộc ↔ Kim
  4: { zheng: 'Đông Nam', ling: 'Tây Bắc' },        // Mộc (tốn) ↔ Kim (càn)
  5: { zheng: 'Trung cung', ling: 'Trung cung' },   // Thổ trung — ngoại lệ, không dùng trực tiếp
  6: { zheng: 'Tây Bắc', ling: 'Đông Nam' },        // Kim ↔ Mộc
  7: { zheng: 'Chính Tây', ling: 'Chính Đông' },   // Kim ↔ Mộc
  8: { zheng: 'Đông Bắc', ling: 'Tây Nam' },        // Thổ (cấn) ↔ (khôn)
  9: { zheng: 'Chính Nam', ling: 'Chính Bắc' },     // Hoả ↔ Thuỷ
};

function findDir(pan, star) {
  const p = pan.find((x) => x.star === star);
  return p ? p.palace : null;
}

/**
 * Thuỷ pháp kích hoạt cho một năm — gợi ý đặt nước theo lưu niên phi tinh.
 *
 * @param {number} year — năm dương lịch
 * @returns {{
 *   year, yun, yunInfo,
 *   primaryWealth:    { dir, star, action, waterType, note } | null,  // 零神 thuỷ = tài chủ lực
 *   romanceWater:     { dir, star, action, waterType, note } | null,  // 一白 thuỷ = đào hoa/duyên
 *   stabilityWater:   { dir, star, action, waterType, note } | null,  // 八白 thuỷ = tài ổn định/điền sản
 *   celebrationWater: { dir, star, action, waterType, note } | null,  // 九紫 thuỷ = hỷ khánh/danh vọng
 *   authorityWater:   { dir, star, action, waterType, note } | null,  // 六白 thuỷ = quý nhân/quyền (nếu có)
 *   avoidWater:   [{ dir, star, reason, remedy }],                    // hướng KỴ nước
 *   saltCleanse:  { dir, star, note } | null,                          // phương 5黄 dùng muối để tiêu hoá
 *   summary
 * }}
 */
export function waterActivation(year) {
  const curYear = year || new Date().getFullYear();
  const { yun } = determineYun(curYear);
  const yfs = yearFlyingStar(curYear);
  const pan = yfs.pan;
  const yunZL = YUN_ZHENG_LING[yun];

  // ---- 零神 phương (khái niệm của vận) + kiểm sao rơi phương đó trong năm ----
  // Quy tắc HK: đặt nước ĐỘNG ở 零神 phương. Nếu 零神 phương năm đó rơi cát tinh → cực tốt;
  // nếu rơi hung tinh thì vẫn là 零 thần nhưng phải cẩn thận (ưu tiên nước tĩnh/nhẹ).
  const lingDir = yunZL.ling;
  const lingPalace = pan.find((p) => p.palace === lingDir);
  const lingStar = lingPalace ? lingPalace.star : null;
  const lingBase = lingPalace ? lingPalace.base : null;

  let primaryWealth = null;
  if (lingDir !== 'Trung cung' && lingStar != null) {
    const isCat = lingBase === 'cát' || lingBase === 'đại cát';
    const wt = WATER_TYPE[lingStar];
    primaryWealth = {
      dir: lingDir,
      star: lingStar,
      starName: lingPalace ? lingPalace.name : STAR[lingStar].name,
      action: isCat
        ? `Đặt ${wt ? wt.vi : 'nước động'} hướng ${lingDir} (零神 phương vận ${yun} + ${lingPalace.name}) → kích tài chính lực năm ${curYear}.`
        : `零神 phương vận ${yun} = ${lingDir}, nhưng năm ${curYear} rơi ${lingPalace.name} (${lingBase}). Nước nhẹ/tĩnh, không dùng nước động mạnh — kết hợp hóa giải hung tinh trước.`,
      waterType: wt ? wt.kind : (isCat ? 'moving' : 'still'),
      waterTypeVi: wt ? wt.vi : (isCat ? 'nước động' : 'nước tĩnh nhẹ'),
      note: `运 ${yun} (正神=${yunZL.zheng}, 零神=${yunZL.ling}). Nước ở 零神 = thuỷ vượng → sinh tài. Lưu niên ${lingPalace ? lingPalace.name : '-'} quyết định cường độ.`,
    };
  }

  // ---- Các cát tinh rơi cung bát quía (trung cung không đặt được) ----
  const makeCat = (star, label) => {
    const dir = findDir(pan, star);
    if (!dir || dir === 'Trung cung') {
      return { dir: null, star, starName: STAR[star].name, action: `${STAR[star].name} năm ${curYear} ở Trung cung — không có hướng đặt, dùng trung cung (trung tâm nhà) nếu muốn kích nhẹ.`, waterType: null, waterTypeVi: null, note: `${STAR[star].name} (${STAR[star].vi}) nhập trung cung ${curYear}.` };
    }
    const wt = WATER_TYPE[star];
    return {
      dir,
      star,
      starName: STAR[star].name,
      action: `${label}: Đặt ${wt.vi} hướng ${dir} (nơi ${STAR[star].name} rơi năm ${curYear}) — ${wt.why}.`,
      waterType: wt.kind,
      waterTypeVi: wt.vi,
      note: `${STAR[star].han} (${STAR[star].name}, ${STAR[star].wx}) ở ${dir}. ${STAR[star].vi}.`,
    };
  };

  const romanceWater = makeCat(1, 'Kích đào hoa/duyên');
  const stabilityWater = makeCat(8, 'Kích tài ổn định/điền sản');
  const celebrationWater = makeCat(9, 'Kích hỷ khánh/danh vọng');
  const authorityWater = makeCat(6, 'Kích quý nhân/quyền lực');

  // ---- Hung tinh: KỴ nước + 5 hoàng dùng muối ----
  const avoidWater = [];
  let saltCleanse = null;
  for (const s of [2, 5, 3, 7]) {
    const dir = findDir(pan, s);
    if (!dir || dir === 'Trung cung') {
      // hung tinh ở trung cung: không tạo avoidWater (không có hướng) nhưng vẫn ghi nhận
      continue;
    }
    const info = AVOID_REASON[s];
    avoidWater.push({ dir, star: s, starName: STAR[s].name, reason: info.reason, remedy: info.remedy });
    if (s === 5) {
      saltCleanse = {
        dir,
        star: 5,
        starName: STAR[5].name,
        note: `Ngũ Hoàng ở ${dir} năm ${curYear}. Dùng nước muối (muối thô + đồng tiền cũ trong ly nước) đặt hướng ${dir} để TIÊU HOÁ 5 hoàng (kim khắc thổ + thuỷ tiết) — đây là hóa giải, KHÔNG phải kích hoạt. Đổi nước + muối định kỳ.`,
      };
    }
  }

  // ---- Summary ----
  const catDirs = [primaryWealth, romanceWater, stabilityWater, celebrationWater, authorityWater]
    .filter((x) => x && x.dir);
  // [loop 30 sửa] 三煞 = 1 SECTOR chính phương (Bắc/Nam/Đông/Tây), KHÔ phải 3 hướng/chi riêng lẻ.
  //   Trước đây map mỗi chi qua DIR_OF → phình thành 3 hướng (vd 午年 ra Tây Bắc/Bắc/Đông Bắc) →
  //   false positive. Dùng sanshaDirection().mainDir (sector đơn, khớp sansha.js annual).
  const normDir = (d) => (d || '').replace(/^Chính /, '');
  const sanshaMain = sanshaDirection(curYear).mainDir; // 'Bắc'/'Nam'/... (sector đơn)
  const sanshaConflicts = normDir(sanshaMain);
  // [loop 30] dedup theo (dir+star) + gom conflict
  const conflictCats = Object.values(Object.fromEntries(
    catDirs.filter((x) => normDir(x.dir) === sanshaConflicts).map((x) => [normDir(x.dir) + '|' + x.starName, x])
  ));
  const sanshaConflict = { mainDir: sanshaMain, branches: SANSHA[Solar.fromYmdHms(curYear, 6, 15, 12, 0, 0).getLunar().getYearZhi()] || [], conflict: conflictCats.map((x) => ({ dir: x.dir, star: x.starName })) };
  // [loop 30] 零神 (primaryWealth) trùng 三煞 → KHÔ emit "★ đặt nước" + "⚠ đừng đặt" cùng hướng.
  const primaryWealthBlocked = primaryWealth && normDir(primaryWealth.dir) === sanshaConflicts;
  const summaryParts = [`Năm ${curYear} (运 ${yun}, 正神=${yunZL.zheng}/零神=${yunZL.ling}):`];
  if (primaryWealth && primaryWealth.dir && !primaryWealthBlocked) summaryParts.push(`★ TÀI CHỦ LỰC: ${primaryWealth.waterTypeVi} hướng ${primaryWealth.dir} (零神).`);
  const otherCats = catDirs.filter((x) => x !== primaryWealth && x.dir && normDir(x.dir) !== sanshaConflicts);
  if (otherCats.length) summaryParts.push(`Kích khác: ${otherCats.map((x) => `${x.starName}→${x.dir}`).join(', ')}.`);
  if (primaryWealthBlocked) summaryParts.push(`⚠ 零神(${primaryWealth.dir}) NĂM ${curYear} TRÙNG TAM SÁT (${sanshaMain}) → KHÔNG đặt nước催 tài hướng này (三煞 kỵ động thuỷ). Chờ năm khác hoặc dùng hướng cát không phạm tam sát.`);
  else if (conflictCats.length) summaryParts.push(`⚠ XUNG ĐỘT 三煞: ${conflictCats.map((x) => `${x.starName}(${x.dir})`).join(', ')} trùng phương tam sát ${sanshaMain} năm ${curYear} → KHÔNG đặt nước hướng này.`);
  if (avoidWater.length) summaryParts.push(`KỴ nước: ${avoidWater.map((x) => `${x.starName}(${x.dir})`).join(', ')}.`);
  if (saltCleanse) summaryParts.push(`Muối tiêu hoá: ${saltCleanse.dir} (5黄).`);
  const summary = summaryParts.join(' ');

  return {
    year: curYear,
    yun,
    yunInfo: { zheng: yunZL.zheng, ling: yunZL.ling, currentStar: STAR[yun] },
    primaryWealth,
    romanceWater,
    stabilityWater,
    celebrationWater,
    authorityWater,
    avoidWater,
    saltCleanse,
    sanshaConflict,
    summary,
  };
}

/**
 * Dạng rút gọn (dùng cho UI thumbnail / overview nhiều năm).
 * @returns {{ year, primaryWealthDir, catDirs:[], avoidDirs:[], saltDir }}
 */
export function waterActivationBrief(year) {
  const r = waterActivation(year);
  const catDirs = [r.romanceWater, r.stabilityWater, r.celebrationWater, r.authorityWater]
    .filter((x) => x && x.dir)
    .map((x) => ({ dir: x.dir, star: x.star, name: x.starName, kind: x.waterType }));
  return {
    year: r.year,
    primaryWealthDir: r.primaryWealth ? r.primaryWealth.dir : null,
    primaryWealthStar: r.primaryWealth ? r.primaryWealth.star : null,
    catDirs,
    avoidDirs: r.avoidWater.map((x) => ({ dir: x.dir, star: x.star, name: x.starName })),
    saltDir: r.saltCleanse ? r.saltCleanse.dir : null,
    summary: r.summary,
  };
}
