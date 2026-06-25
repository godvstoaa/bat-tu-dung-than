// ============================================================================
//  LUẬN LƯU NIÊN ĐA TRƯỜNG PHÁI (流年综合論)
//  Kết hợp 6 trường phái để phán vận MỘT NĂM cho cá nhân — sửa lỗi "chỉ xem
//  hành Dụng" (thiếu 十神 năm/太岁/神煞 năm/天克地冲) khiến phán ngược thực tế.
//  Phái: (1) 五行用神 (2) 十神 năm (3) 太岁 (4) 流年神煞 (5) 天克地冲 (6) 大运互动
//        (+ 格局喜忌 như tầng thông tin). [cycle 运年组合] 大运互动 từng BỊ BỎ SÓT —
//        nay đã thêm: 大运×流年 十神 tương sinh/khắc + 地支 lục hợp/lục xung + 天干 ngũ hợp.
//  Nguồn: 渊海子平, 三命通会, 滴天髓 (运年组合 = "运为主, 年为辅; 运年生克 định hung cát").
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI, SHENG, KE, TEN_GOD_VI } from './constants.js';
import { tenGod, godGroup } from './core.js';
import { GAN_HE_MAP, ZHI_LIUHE_MAP, ZHI_CHONG_MAP } from './interactions.js';
import { TAO_HUA, HONG_YAN, YANG_REN, YI_MA, BRANCH_GROUP, SHENSHA_INFO } from './shensha.js';
// [loop 19 — elevation] 伏吟/反吟 chuẩn từ module chuyên dụng (4 cặp thất sát, không phải "bất kỳ ngũ hành khắc").
import { isFuyin, isFanyin } from './fuyin.js';

// [loop 19] Nhãn 6 thân theo trụ — cho tầng Phục/Phản ngâm (năm biến cố).
const QIN_VI = { year: 'Niên Trụ (tổ bối)', month: 'Nguyệt Trụ (phụ mẫu/sự nghiệp)', day: 'Nhật Trụ (bản thân/phối ngẫu)', time: 'Thời Trụ (tử tức)' };

const wxVi = (w) => WX_VI[w];
// Hướng (dấu) của một hành đối với Dụng thần: Dụng/Hỷ → +1, Kỵ/Thù → −1, trung → 0.
// Dùng cho 大运互动: "phóng đại" một lực theo chiều Dụng/Kỵ của chính hành đó.
function _yongSign(wx, yong) {
  const fav = new Set([yong.primary, yong.xi].filter(Boolean));
  const avoid = new Set([yong.ji, yong.chou].filter(Boolean));
  if (fav.has(wx)) return 1;
  if (avoid.has(wx)) return -1;
  return 0;
}
// Phóng đại (+) hay át giảm (−) lực năm theo tỷ lệ + hướng Dụng/Kỵ.
//   base = 8 (mạnh vừa, quy ước giống trọng số ngũ hành can).
function _amplifyByYong(wx, yong, ratio) {
  const sign = _yongSign(wx, yong);
  if (sign === 0) return 0;            // trung tính → không cộng/trừ (tránh "phán bừa")
  return Math.round(8 * ratio * sign); // ratio dương = phóng đại, âm = át
}
const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
const HAI = { 子: '未', 未: '子', 丑: '午', 午: '丑', 寅: '巳', 巳: '寅', 卯: '辰', 辰: '卯', 申: '亥', 亥: '申', 酉: '戌', 戌: '酉' };
// Tam hình (pair) + tự hình (辰辰/午午/酉酉/亥亥)
const XING = { 子: '卯', 卯: '子', 寅: '巳', 巳: '申', 申: '寅', 丑: '戌', 戌: '未', 未: '丑', 辰: '辰', 午: '午', 酉: '酉', 亥: '亥' };
// Phá thái tuế
const PO = { 子: '酉', 酉: '子', 丑: '辰', 辰: '丑', 寅: '亥', 亥: '寅', 卯: '午', 午: '卯', 巳: '申', 申: '巳', 戌: '未', 未: '戌' };

// Thập thần năm → hệ số + diễn giải
const GOD_YEAR_EFFECT = {
  比肩: { d: -6, vi: 'Tỷ Kiên năm: cạnh tranh, bạn bè, dễ đoạt tài/hao tiền, chủ tự lập.' },
  劫財: { d: -14, vi: 'Kiếp Tài năm: 破财 lớn, đầu tư thất bại, tranh giành, hôn nhân biến — PHẢI giữ tiền chặt.' },
  食神: { d: +10, vi: 'Thực Thần năm: phúc lộc, tài hoa sinh tài, bình順, có tài nguyên.' },
  傷官: { d: -16, vi: 'Thương Quan năm: 破财, 是非口舌, 变动, 感情波折 (nữ khắc phu, nam khẩu舌), tối kỵ "thương quan kiến quan".' },
  偏財: { d: +5, vi: 'Thiên Tài năm: tài lớn bất ngờ (hoặc phá lớn), biến động tài chính, nam đào hoa.' },
  正財: { d: +6, vi: 'Chính Tài năm: tiến tài đều (thân vượng) / hao tài (thân nhược).' },
  七殺: { d: -13, vi: 'Thất Sát năm: áp lực, tiểu nhân, bệnh, rủi ro, quyền lực nếu có chế — cẩn thận.' },
  正官: { d: +8, vi: 'Chính Quan năm: thăng tiến, danh vọng, quý nhân (kỵ Thương Quan同年 kiến).' },
  偏印: { d: -8, vi: 'Thiên Ấn năm: cô độc, "kiêu đoạt thực" phá tài nguyên, học vấn, biến怪.' },
  正印: { d: +9, vi: 'Chính Ấn năm: quý nhân, học/văn, bất động sản, mẹ, ấm no.' },
};

/**
 * Chấm điểm 1 LƯU NIÊN theo 5 trường phái — HÀM CHUNG. Cả chart.js:computeLiuNian
 * (thẻ "Lưu Niên" / bảng 10 năm) và analyzeLiunianDeep (brief "Luận vận năm") đều gọi
 * hàm này → 2 nơi KHÔNG bao giờ mâu thuẫn. [cycle 44 sửa lỗi] trước đây computeLiuNian
 * chỉ chấm ngũ hành (bỏ qua Thập thần 伤官 −16 + Thái tuế) → báo 2026 "Cát" trong khi
 * deep báo "Hơi kỵ" → AI nhận 2 phán đoán trái ngược ("ba phải").
 * @param {string} [activeDayun]    —干支 đại vận đang hành (vd '己未'), TUỲ CHỌN.
 *        Khi truyền vào, thêm trường phái "大运互动 (运年组合)": 大运×流年 thập thần tương
 *        sinh/khắc + địa chi lục hợp/lục xung + thiên can ngũ hợp. Lớp này CỘNG TRÊN 5 phái
 *        cốt lõi — có thể LẬT phán một năm (傷官 năm trong 印运 → bị chế → bớt hung;
 *        傷官 năm trong 比劫 vận → được sinh → thêm hung). Nguồn 渊海子平/滴天髓.
 * @returns {{ score, rating, schools, ganGod, ganWx, zhiWx }}
 */
export function scoreLiunianYear({ dayGan, dayZhi, yearBirthZhi, yong, yGan, yZhi, activeDayun, natalPillars, kongwang }) {
  const ganGod = tenGod(dayGan, yGan);
  const ganWx = GAN[yGan].wx, zhiWx = ZHI[yZhi].wx;
  const schools = [];
  let score = 50;

  // (1) Ngũ hành / Dụng thần học
  let elementNote = `Can ${yGan}(${wxVi(ganWx)}) + Chi ${yZhi}(${wxVi(zhiWx)}). `;
  const favSet = new Set([yong.primary, yong.xi].filter(Boolean));
  const avoidSet = new Set([yong.ji, yong.chou].filter(Boolean));
  let elD = 0;
  if (favSet.has(ganWx)) { elD += 8; elementNote += `Can hành ${wxVi(ganWx)} là Dụng/Hỷ → thuận. `; }
  if (avoidSet.has(ganWx)) { elD -= 10; elementNote += `Can hành ${wxVi(ganWx)} là Kỵ/Thù → nghịch. `; }
  if (favSet.has(zhiWx)) { elD += 6; elementNote += `Chi hành ${wxVi(zhiWx)} là Dụng/Hỷ → thuận. `; }
  if (avoidSet.has(zhiWx)) { elD -= 8; elementNote += `Chi hành ${wxVi(zhiWx)} là Kỵ/Thù → nghịch. `; }
  score += elD;
  schools.push({ phai: 'Ngũ Hành / Dụng Thần', note: elementNote, d: elD });

  // (2) Thập thần năm
  const gEff = GOD_YEAR_EFFECT[ganGod];
  if (gEff) { score += gEff.d; schools.push({ phai: 'Thập Thần năm', note: `${ganGod} (${ganGod === '傷官' ? 'Thương Quan' : ganGod}): ${gEff.vi}`, d: gEff.d }); }

  // (3) Thái tuế (chi năm vs chi năm sinh + chi ngày)
  const taiSuiNotes = [];
  if (yZhi === yearBirthZhi) { score -= 10; taiSuiNotes.push('值太岁 (tự thái tuế) — năm biến động, dễ惹事.'); }
  if (CHONG[yearBirthZhi] === yZhi) { score -= 16; taiSuiNotes.push('⚡冲太岁 (xung) — Đại biến động, hung, năm "tuổi xung".'); }
  if (XING[yearBirthZhi] === yZhi) { score -= 12; taiSuiNotes.push('刑太岁 — quan phi, thị phi.'); }
  if (PO[yearBirthZhi] === yZhi) { score -= 8; taiSuiNotes.push('破太岁 — phá tài.'); }
  if (HAI[yearBirthZhi] === yZhi) { score -= 8; taiSuiNotes.push('害太岁 — tiểu nhân, hao tốn ngầm.'); }
  // [loop 71 sửa double-count] chỉ tính khi dayZhi ≠ yearBirthZhi: nếu trùng thì 冲太岁
  //   (dòng trên, -16) đã bao hàm cùng 1 xung → không trừ 2 lần (trước đây -16+-14=-30).
  if (CHONG[dayZhi] === yZhi && dayZhi !== yearBirthZhi) { score -= 14; taiSuiNotes.push('⚡日支冲太岁 — tổn bản thân/sức khoẻ, năm "ngày xung".'); }
  if (taiSuiNotes.length) schools.push({ phai: 'Thái Tuế', note: taiSuiNotes.join(' '), d: -1 });

  // (4) Thần sát năm (đào hoa / hồng diễm / dương nhận / dịch mã)
  const grp = BRANCH_GROUP[yearBirthZhi];
  const ssNotes = [];
  if (TAO_HUA[grp] === yZhi || TAO_HUA[BRANCH_GROUP[dayZhi]] === yZhi) { score -= 8; ssNotes.push('🌸 Đào Hoa năm — biến động tình cảm, 桃花劫/桃花破财 (cẩn thận烂桃花 hao tiền hao tình).'); }
  if (HONG_YAN[dayGan] === yZhi) { score -= 6; ssNotes.push('💋 Hồng Diễm năm — sắc duyên mạnh, dễ lệch lạc tình cảm.'); }
  if (YANG_REN[dayGan] === yZhi) { score -= 10; ssNotes.push('⚔️ Dương Nhận năm — sát khí, dễ tổn thương/xa lánh, kỵ đầu tư liều.'); }
  if (YI_MA[grp] === yZhi || YI_MA[BRANCH_GROUP[dayZhi]] === yZhi) { score += 3; ssNotes.push('🐎 Dịch Mã năm — di chuyển/đổi việc (cát nếu Dụng, hao nếu không).'); }
  if (ssNotes.length) schools.push({ phai: 'Lưu Niên Thần Sát', note: ssNotes.join(' '), d: -1 });

  // (5) Thiên khắc địa xung (天干 xung + địa chi xung)
  // [loop 60 sửa] 天克 = GAN_CHONG (4 cặp thất sát), KHÔNG phải tenGod ∈ 4 thần khắc.
  //   Cùng bug fuyin.js (L19) / dayun-check (L59) / dayun-rank (L59): tenGod-based 克 → 384 FP.
  const _GANCHONG = { 甲:'庚', 庚:'甲', 乙:'辛', 辛:'乙', 丙:'壬', 壬:'丙', 丁:'癸', 癸:'丁' };
  const ganClash = _GANCHONG[dayGan] === yGan;
  const zhiClash = CHONG[dayZhi] === yZhi;
  // [loop 71 sửa double-count CAO] mục (3) 日支冲太岁 ĐÃ tính mọi zhiClash (-14 khi dayZhi≠yearBirthZhi).
  //   Trước đây nhánh `else if (zhiClash) -10` → CÙNG sự kiện bị -14 + -10 = -24 (mọi lá số vào
  //   năm chi xung Nhật Chi). Nay BỎ nhánh else if; chỉ giữ 天克地冲 (gan+zi) là combo ĐẠI HUNG
  //   riêng (thêm 天克 + combo amplifier; 地冲 component đã thuộc phái Thái Tuế, không trừ lại).
  if (ganClash && zhiClash) { score -= 18; schools.push({ phai: 'Thiên Khắc Địa Xung', note: '⚡ Thiên xung + Địa xung Nhật Trụ = "thiên khắc địa xung" — năm ĐẠI HUNG, biến loạn lớn (thêm 天克 + combo; 地冲 đã ở Thái Tuế).', d: -18 }); }

  // (6) 大运互动 (运年组合) — TUỲ CHỌN, chỉ khi có activeDayun.
  //   Nguyên lý cổ (渊海子平 ch.论运年, 滴天髓): "运为主, 年为辅". Lực 流年 bị 大运
  //   SINH → phóng đại, bị 大运 KHẮC → suy giảm. Có thể LẬT phán năm (傷官 năm trong 印运
  //   → bị chế → bớt hung; 傷官 năm trong 比劫 vận → được sinh → thêm hung).
  //   Phép tính dùng NGŨ HÀNH của 十神 (tuyệt đối, không nhập nhằng nhóm):
  //     dyWx = hành đại diện cho 十 thần vận ; yWx = hành đại diện 十 thần năm.
  //   Lưu ý: 十 thần của 乙 đối với 己(土)=偏財 → dyWx=土; đối với 丙(火)=傷官 → yWx=火.
  if (activeDayun && activeDayun.length >= 2) {
    const dyGan = activeDayun[0], dyZhi = activeDayun[1];
    const dyGod = tenGod(dayGan, dyGan);
    const dyWx = GAN[dyGan].wx;       // hành của can đại vận = hành đại diện 十 thần vận
    // yWx = hành đại diện 十 thần năm = hành của chính can năm (vd 傷官 năm 丙 → Hỏa)
    const yWx = GAN[yGan].wx;
    const dyNotes = [];
    let dyD = 0;

    // [loop 112 elevate] 岁运并临 (tuế vận tịnh lâm) — 流年 ganZhi TRÙNG ĐỨNG 大运 ganZhi
    //   (exact match, không chỉ đồng hành). «岁运并临, 其力倍增» — lực NHÂN ĐÔI.
    //   Dụng → CÁT mạnh / Kỵ → HUNG mạnh. Sự kiện quan trọng năm đó.
    if (activeDayun === yGan + yZhi) {
      const sign = _yongSign(yWx, yong);
      dyD += 8 * sign; // ±8 (cực mạnh, nhân đôi)
      dyNotes.push(`⚡ 岁运并临 (tuế vận tịnh lâm): 流年 ${yGan}${yZhi} = 大运 ${activeDayun} TRÙNG ĐỨNG → lực NHÂN ĐÔI cực mạnh. ${sign > 0 ? '★ Dụng → CÁT MẠNH (năm đỉnh)' : sign < 0 ? '⚠ Kỵ → HUNG MẠNH (cẩn thận)' : 'trung tính nhưng biến động lớn'}.`);
    }

    // (6a) 十 thần tương sinh/khắc giữa 大运 và 流年 (dùng ngũ hành).
    //   运god 生 年god → 年god được SINH → lực phóng đại (cùng chiều với delta gốc của năm).
    //   运god 克 年god → 年god bị KHẮC → lực suy giảm (ngược chiều delta gốc).
    //   Đồng hành (比) → được đắp vào → phóng đại nhẹ.
    if (SHENG[dyWx] === yWx) {
      // 运 sinh năm: lực năm tăng cường. Hướng phóng đại theo Dụng/Kỵ của chính năm god.
      dyD += _amplifyByYong(yWx, yong, 0.30);
      dyNotes.push(`运 ${TEN_GOD_VI[dyGod]} (${wxVi(dyWx)}) sinh 年 ${TEN_GOD_VI[ganGod]} (${wxVi(yWx)}) → lực ${TEN_GOD_VI[ganGod]} được phóng đại (运年生).`);
    } else if (KE[dyWx] === yWx) {
      // 运 khắc năm: lực năm bị át. Ngược dấu với delta Dụng/Kỵ của năm god.
      dyD += _amplifyByYong(yWx, yong, -0.30);
      dyNotes.push(`运 ${TEN_GOD_VI[dyGod]} (${wxVi(dyWx)}) khắc 年 ${TEN_GOD_VI[ganGod]} (${wxVi(yWx)}) → lực ${TEN_GOD_VI[ganGod]} bị át suy giảm (运克年).`);
    } else if (dyWx === yWx) {
      // Đồng hành: phóng đại nhẹ (cùng chiều Dụng/Kỵ).
      dyD += _amplifyByYong(yWx, yong, 0.20);
      dyNotes.push(`运 ${TEN_GOD_VI[dyGod]} (${wxVi(dyWx)}) đồng hành với 年 ${TEN_GOD_VI[ganGod]} (${wxVi(yWx)}) → đắp thêm lực (伏吟 nhẹ).`);
    } else {
      dyNotes.push(`运 ${TEN_GOD_VI[dyGod]} (${wxVi(dyWx)}) ↔ 年 ${TEN_GOD_VI[ganGod]} (${wxVi(yWx)}): tương quan ngũ hành không trực tiếp sinh/khắc → tương tác nhẹ.`);
    }

    // (6b) 地支 lục hợp / lục xung / phục ngâm giữa 大运 chi và 流年 chi.
    if (ZHI_LIUHE_MAP[dyZhi + yZhi]) {
      const hua = ZHI_LIUHE_MAP[dyZhi + yZhi];
      const fav = new Set([yong.primary, yong.xi].filter(Boolean));
      const avoid = new Set([yong.ji, yong.chou].filter(Boolean));
      if (fav.has(hua)) { dyD += 2; dyNotes.push(`运支 ${dyZhi} hợp 年支 ${yZhi} → hóa ${wxVi(hua)} (Dụng/Hỷ) → thuận, ổn định.`); }
      else if (avoid.has(hua)) { dyD -= 2; dyNotes.push(`运支 ${dyZhi} hợp 年支 ${yZhi} → hóa ${wxVi(hua)} (Kỵ/Thù) → nghịch, trệ.`); }
      else dyNotes.push(`运支 ${dyZhi} hợp 年支 ${yZhi} → hóa ${wxVi(hua)} (trung tính) → hợp cục, ít biến.`); }
    else if (ZHI_CHONG_MAP[dyZhi + yZhi]) { dyD -= 3; dyNotes.push(`⚡运支 ${dyZhi} xung 年支 ${yZhi} (运年 xung) — biến động năm bị đại vận khuếch đại, hung tăng.`); }
    else if (dyZhi === yZhi) { dyD -= 2; dyNotes.push(`运支 ${dyZhi} = 年支 ${yZhi} (伏吟) — trùng phức, chủ buồn/chướng.`); }

    // (6c) 天干 ngũ hợp giữa 大运 can và 流年 can (khi hợp → khả năng hóa khí).
    if (GAN_HE_MAP[dyGan + yGan]) {
      const hua = GAN_HE_MAP[dyGan + yGan];
      const fav = new Set([yong.primary, yong.xi].filter(Boolean));
      const avoid = new Set([yong.ji, yong.chou].filter(Boolean));
      if (fav.has(hua)) { dyD += 2; dyNotes.push(`运干 ${dyGan} hợp 年干 ${yGan} → hóa ${wxVi(hua)} (Dụng/Hỷ) → trợ mệnh.`); }
      else if (avoid.has(hua)) { dyD -= 2; dyNotes.push(`运干 ${dyGan} 合 年干 ${yGan} → hóa ${wxVi(hua)} (Kỵ/Thù) → bất lợi.`); }
      else dyNotes.push(`运干 ${dyGan} 合 年干 ${yGan} → khả năng hóa ${wxVi(hua)} (trung tính) → trệ/kìm.`); }

    score += dyD;
    schools.push({ phai: '大运互动 (运年组合)', note: `[大运 ${activeDayun} ${TEN_GOD_VI[dyGod]}] ${dyNotes.join(' ')}`, d: dyD });
  }

  // [loop 160 ELEVATION] 空亡 出空/冲空 — 流年 chi = void chi → «xuất không»
  if (kongwang?.kong?.length && kongwang.kong.includes(yZhi)) {
    const fav = new Set([yong.primary, yong.xi].filter(Boolean));
    const isFav = fav.has(GAN[yGan]?.wx);
    const delta = isFav ? 8 : -6;
    score += delta;
    schools.push({ phai: '出空 (空亡激活)', note: `⚡ 流年 ${yGan}${yZhi} = chi KHÔNG VONG → «xuất không»: sao bị «treo» trong nguyên cục NĂM NAY BẮT ĐẦU HOẠT ĐỘNG. ${isFav ? '★ Dụng xuất không → CÁT.' : '⚠ Kỵ xuất không → HUNG.'}`, d: delta });
  } else if (kongwang?.kong?.length) {
    for (const kc of kongwang.kong) {
      if (CHONG[kc] === yZhi) {
        score -= 5;
        schools.push({ phai: '冲空 (空亡被冲)', note: `⚡ 流年 ${yGan}${yZhi} 冲 chi không vong ${kc} → «xung không»: sự kiện ĐỘT NGỘT.`, d: -5 });
        break;
      }
    }
  }

  // (7) Phục/Phản Ngâm 流年 × 4 trụ nguyên cục [loop 19 — ALGORITHM ELEVATION]
  //   Cổ quyết (渊海子平 反吟伏吟篇 «反吟伏吟泪淋淋»): năm can-chi TRÙNG hoàn toàn 1 trụ
  //   = 伏吟 (đình trệ/哀泣/lặp); năm THIÊN KHẮC ĐỊA XUNG 1 trụ = 反吟 (động loạn/ly tán).
  //   Đây là 2 kiểu "năm biến cố" mạnh nhất (hôn nhân/ly tán/bệnh/thăng giáng đột ngột).
  //   Trước đây scoreLiunianYear CHỈ bắt 天克地冲 vs NHẬT trụ (mục 5) → bỏ sót 伏吟 + 反吟
  //   vs Nguyệt/Niên/Thời trụ. Nay dùng isFuyin/isFanyin chuẩn (4 cặp thất sát) quét cả 4 trụ.
  //   Lực: 反吟 > 伏吟; tầm trụ 日>月>年/时. Nhật trụ 反吟 đã ở mục (5) → không tính lại.
  //   Hóa giải: năm mang Dụng/Hỷ → hung giảm 60% ("phản cát"/hồi phục).
  if (natalPillars) {
    const yp = { gan: yGan, zhi: yZhi };
    const fy = []; let fdD = 0;
    const W_FUYIN = { day: 7, month: 5, year: 4, time: 4 };     // 伏吟 base (âm)
    const W_FANYIN = { month: 10, year: 8, time: 8 };           // 反吟 base (âm; day ở mục 5)
    const fav = new Set([yong.primary, yong.xi].filter(Boolean));
    const mitig = fav.has(ganWx) || fav.has(zhiWx);            // năm mang Dụng/Hỷ
    const factor = mitig ? 0.4 : 1;
    for (const k of ['day', 'month', 'year', 'time']) {
      const np = natalPillars[k];
      if (!np || !np.gan) continue;
      if (isFuyin(yp, np)) {
        fdD -= W_FUYIN[k] * factor;
        fy.push(`${k === 'day' ? '⚡' : '•'} 伏吟 ${QIN_VI[k]} (năm trùng ${np.gan}${np.zhi})${mitig ? ' → năm mang Dụng/Hỷ nên hung giảm (có thể "phản cát")' : ''}.`);
      } else if (isFanyin(yp, np)) {
        if (k === 'day') continue;                              // mục (5) đã tính 天克地冲 (−18)
        fdD -= W_FANYIN[k] * factor;
        fy.push(`⚡ 反吟 ${QIN_VI[k]} (năm thiên khắc địa xung ${np.gan}${np.zhi})${mitig ? ' → năm mang Dụng/Hỷ nên hung giảm' : ''}.`);
      }
    }
    if (fy.length) { score += fdD; schools.push({ phai: 'Phục/Phản Ngâm (伏吟反吟)', note: fy.join(' '), d: fdD }); }
  }

  score = Math.max(2, Math.min(98, Math.round(score)));
  let rating;
  if (score >= 78) rating = 'Đại cát';
  else if (score >= 62) rating = 'Cát';
  else if (score >= 46) rating = 'Bình';
  else if (score >= 32) rating = 'Hơi kỵ';
  else if (score >= 20) rating = 'Hung';
  else rating = 'Đại hung';

  return { score, rating, schools, ganGod, ganWx, zhiWx };
}

// Lời khuyên năm — [cycle 44 sửa C1] KHÔNG nói "đợi năm mang Hỷ X" khi năm hiện tại
// ĐÃ mang Hỷ X (tự mâu thuẫn). Nếu năm có Dụng/Hỷ nhưng vẫn hung (Thái tuế/xung át),
// nói thẳng "dù có Hỷ nhưng bị át" thay vì "đợi Hỷ".
function buildLiunianAdvice(score, rating, solarYear, yong, ganWx, zhiWx, dayunNote) {
  const favSet = new Set([yong.primary, yong.xi].filter(Boolean));
  const yearHasFav = favSet.has(ganWx) || favSet.has(zhiWx);
  // [运年组合] Khi 大运互动 LẬT phán (đảo dấu) hoặc khuếch đại rõ, thêm 1 câu giải thích
  //   để brief nói rõ TẠI SAO năm này hung/cát khác kỳ vọng (vd 傷官 năm nhưng trong 印运
  //   → bớt hung; 傷官 năm trong 比劫 vận → thêm hung).
  const suffix = dayunNote ? ` 【运年】${dayunNote}` : '';
  if (score >= 62) return `Năm ${solarYear} (${rating}) — nên tiến thủ, nắm cơ hội; vẫn giữ Dụng ${wxVi(yong.primary)}.${suffix}`;
  if (score >= 46) return `Năm ${solarYear} (${rating}) — giữ ổn định, thuận tự nhiên, tránh quyết định lớn nếu chưa rõ.${suffix}`;
  if (yearHasFav) return `Năm ${solarYear} (${rating}) — BẤT LỢI dù năm có mang Dụng ${wxVi(yong.primary)}/Hỷ ${wxVi(yong.xi)} (bị Thái Tuế / xung / Thương Quan lấn át). Thủ không tiến: giữ tiền, tránh đầu tư/liều, bao dung tình cảm, tích đức hoá giải.${suffix}`;
  return `Năm ${solarYear} (${rating}) — NĂM BẤT LỢI. Thủ không tiến: giữ tiền, tránh đầu tư/đi xa/liều, bao dung tình cảm, tích đức hoá giải, đợi năm mang Dụng ${wxVi(yong.primary)}/Hỷ ${wxVi(yong.xi)} sẽ khá hơn.${suffix}`;
}

/**
 * Luận lưu niên đa trường phái cho 1 năm (brief dùng). Wrapper mỏng quanh scoreLiunianYear.
 *
 * [loop 3 — 格局流年喜忌] Hỗ trợ thêm patternYong tùy chọn: khi truyền vào, thêm
 * trường phái thứ 6 "格局喜忌" (CHỈ thêm thông tin, KHÔNG đổi score cốt lõi của
 * scoreLiunianYear — điểm số trong chart R.liunian do adjustLiunianByGeju cộng
 * tầng 格局 LÊN TRÊN, còn analyseLiunianDeep dùng cho brief mô tả 5→6 trường phái).
 * @param {object} R          — kết quả analyze()
 * @param {number} solarYear  — năm dương lịch cần luận
/**
 * [loop 170 extract] 大运 进气退气 phase cho 1 năm trong đại vận đang hành.
 *   Năm 1-3 = 进气 (đang VÀO), 4-7 = 旺气 (đỉnh), 8-10 = 退气 (đang RA).
 *   factor graduated theo khoảng cách tới cửa sổ đỉnh (offset 3-6); áp dụng
 *   DAMPEN TOWARD NEUTRAL ở scoreLiunianYear (xem loop 164).
 * @param {Array} dayunList - R.dayun (mỗi ptử có startYear, ganZhi)
 * @param {number} solarYear - năm dương lịch
 * @returns {{phase:'进气'|'旺气'|'退气', vi:string, factor:number, offset:number, ganZhi:string}|null}
 */
export function computeDayunPhase(dayunList, solarYear) {
  if (!Array.isArray(dayunList)) return null;
  const dy = dayunList.find((d) => d && d.startYear != null && d.startYear <= solarYear && solarYear < d.startYear + 10);
  if (!dy || dy.startYear == null) return null;
  const offset = solarYear - dy.startYear; // 0→9
  const dToPeak = offset < 3 ? 3 - offset : offset > 6 ? offset - 6 : 0; // 0 (đỉnh) .. 3 (viền)
  const factor = +(1 - dToPeak * 0.06).toFixed(2);                       // 1.00 .. 0.82
  const pct = Math.round(factor * 100);
  const gz = dy.ganZhi || '';
  if (offset <= 2) return { phase: '进气', vi: `Đại vận ${gz} năm ${offset + 1}/10 — 进气 (đang VÀO, lực realised ${pct}% đỉnh)`, factor, offset, ganZhi: gz };
  if (offset >= 7) return { phase: '退气', vi: `Đại vận ${gz} năm ${offset + 1}/10 — 退气 (đang RA, lực realised ${pct}% đỉnh)`, factor, offset, ganZhi: gz };
  return { phase: '旺气', vi: `Đại vận ${gz} năm ${offset + 1}/10 — 旺气 (lực tối đa 100%)`, factor: 1.0, offset, ganZhi: gz };
}

export function analyzeLiunianDeep(R, solarYear, patternYong) {
  const c = R.chart;
  const ys = Solar.fromYmdHms(solarYear, 6, 15, 12, 0, 0);
  const yl = ys.getLunar();
  const yGan = yl.getYearGan(), yZhi = yl.getYearZhi();
  // [运年组合] Tìm 大运 đang hành cho solarYear từ R.dayun (match theo startYear).
  //   Khi có, truyền ganZhi làm activeDayun → bật trường phái "大运互动" bên trong
  //   scoreLiunianYear. Tất cả caller của analyzeLiunianDeep (ai/forecast/health/...)
  //   tự được hưởng lớp tương tác này mà không cần sửa.
  let activeDayun = null;
  if (Array.isArray(R.dayun) && R.dayun.length) {
    const dy = R.dayun.find((d) => d && d.startYear != null && d.startYear <= solarYear && solarYear < d.startYear + 10)
      || null;
    if (dy && dy.ganZhi) activeDayun = dy.ganZhi;
  }
  const { score, rating, schools, ganGod, ganWx, zhiWx } = scoreLiunianYear({
    dayGan: c.dayGan, dayZhi: c.pillars.day.zhi, yearBirthZhi: c.pillars.year.zhi, yong: R.yong, yGan, yZhi, activeDayun,
    natalPillars: c.pillars, // [loop 19] bật tầng 伏吟/反吟 vs 4 trụ nguyên cục
    kongwang: R.kongwang, // [loop 160] 空亡 出空/冲空
  });

  // [loop 3] Trường phái thứ 6: 格局喜忌 (thông tin, không đổi score cốt lõi).
  //   Nếu patternYong truyền vào (R.patternQuality.patternYong), tra nhóm thập thần
  //   của năm can xem rơi xi (格局喜) hay ji (格局忌).
  let gejuFavor = null;
  if (patternYong && (patternYong.xi || patternYong.ji)) {
    const xiGroups = new Set((patternYong.xi || []).map((x) => x.group));
    const jiGroups = new Set((patternYong.ji || []).map((x) => x.group));
    const grp = godGroup(ganGod);
    if (grp && xiGroups.has(grp)) {
      gejuFavor = '喜';
      schools.push({ phai: '格局喜忌 (子平真詮)', note: `Năm can ${ganGod} (${grp}) thuộc nhóm 喜 của cách → sinh trợ 格 → 格局喜. Tầng 格局 cộng thêm điểm năm (xem thẻ Lưu Niên).`, d: 0 });
    } else if (grp && jiGroups.has(grp)) {
      gejuFavor = '忌';
      schools.push({ phai: '格局喜忌 (子平真詮)', note: `Năm can ${ganGod} (${grp}) thuộc nhóm 忌 của cách → khắc phá/cản 格 → 格局忌. Tầng 格局 trừ điểm năm (xem thẻ Lưu Niên).`, d: 0 });
    }
  }

  // [运年组合] Trích note ngắn của 大运互动 để ghép vào lời khuyên (chỉ khi đủ nặng:
  //   |d|>=3 hoặc có 合/冲/伏吟). Giúp brief giải thích TẠI SAO năm này hung/cát khác kỳ vọng.
  let dayunAdviceNote = null;
  if (activeDayun) {
    const ds = schools.find((s) => s.phai && s.phai.includes('运年'));
    if (ds && typeof ds.d === 'number') {
      const heavy = Math.abs(ds.d) >= 3 || /合|xung|冲|伏吟|hợp|hóa/.test(ds.note);
      if (heavy) {
        // Lấy vế đầu (sau "]") — phần tương tác cốt lõi, bỏ chi tiết vế 合/冲 nếu dài.
        const core = ds.note.replace(/^\[[^\]]*\]\s*/, '');
        dayunAdviceNote = (ds.d >= 0 ? '大运 trợ/giảm nhẹ lực hung của năm: ' : '大运 khuếch đại lực hung của năm: ') + core.split('。')[0].split('. ')[0];
      }
    }
  }

  const advice = buildLiunianAdvice(score, rating, solarYear, R.yong, ganWx, zhiWx, dayunAdviceNote);

  // [loop 152 ELEVATION] 大运 进气退气 — năm đầu (1-3t) = 进气 (vận đang vào),
  //   năm cuối (8-10t) = 退气 (vận đang ra). Giữa = vượng.
  // [loop 164 ELEVATION] 2 sửa logic:
  //   (1) factor GRADUATED theo khoảng cách tới cửa sổ đỉnh (offset 3-6): năm 1/10
  //       yếu hơn năm 3/10 — trước đây cố định 0.9 cho cả 3 năm đầu & cuối.
  //   (2) áp dụng DAMPEN TOWARD NEUTRAL (50), KHÔNG phải score*factor. Semantics:
  //       进气/退气 = «lực đại vận realised năm nay = factor% đỉnh». Year tốt → bớt tốt
  //       một chút; year XẤU → bớt xấu một chút (kỵ thần chưa/phai tác dụng đầy đủ).
  //       Trước đây score*0.9 luôn KÉO XUỐNG → năm xấu bị PHẠT THÊM (sai hướng).
  // [loop 170] dayunPhase tính qua helper chung (computeDayunPhase) — dùng cho cả
  //   brief AI lẫn UI card. Trước đây inline chỉ ở đây → UI không thấy được phase.
  const dayunPhase = computeDayunPhase(R.dayun, solarYear);

  // [loop 159/164] apply 进气退气 — dampen score TOWARD neutral(50) by factor.
  let finalScore = score;
  let finalRating = rating;
  if (dayunPhase && dayunPhase.factor < 1) {
    finalScore = Math.max(2, Math.min(98, Math.round(50 + (score - 50) * dayunPhase.factor)));
    finalRating = finalScore >= 78 ? 'Đại cát' : finalScore >= 62 ? 'Cát' : finalScore >= 46 ? 'Bình' : finalScore >= 32 ? 'Hơi kỵ' : finalScore >= 20 ? 'Hung' : 'Đại hung';
    schools.push({ phai: '进气退气', d: finalScore - score, note: dayunPhase.vi + ` → điểm co về neut ${Math.round((1 - dayunPhase.factor) * 100)}%` });
  }

  const out = { year: solarYear, ganZhi: yGan + yZhi, ganGod, ganWx, zhiWx, score: finalScore, rating: finalRating, schools, advice };
  if (gejuFavor) out.gejuFavor = gejuFavor;
  if (activeDayun) out.activeDayun = activeDayun; // [运年组合] 大运 đang hành cho năm này
  if (dayunPhase) out.dayunPhase = dayunPhase; // [loop 152] 进气/退气
  return out;
}
