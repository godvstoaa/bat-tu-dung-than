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
import { GAN, ZHI, HIDDEN, SHENG, KE, KE_BY, SHENG_BY, SANHE_HUAQI, SANHUI_HUAQI } from './constants.js';
import { tenGod, godGroup } from './core.js';
import { computeSiling } from './chart.js'; // [假从 band] cycle ESM an toàn — chỉ dùng runtime trong detectSpecial

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
  // hóa khí cách (Thiên Can Ngũ Hợp HÓA)
  化土格: 'Hóa Thổ cách (Giáp Kỷ hợp hóa)',
  化金格: 'Hóa Kim cách (Ất Canh hợp hóa)',
  化水格: 'Hóa Thủy cách (Bính Tân hợp hóa)',
  化木格: 'Hóa Mộc cách (Đinh Nhâm hợp hóa)',
  化火格: 'Hóa Hỏa cách (Mậu Quý hợp hóa)',
};

// ---- Ưu tiên Dụng/Thích/Kỵ của từng cách (theo nhóm Thập Thần) ----
//   nhóm: ti(Tỷ Kiếp) yin(Ấn) shi(Thực Thương) cai(Tài) guan(Quan Sát)
export const PATTERN_PREF = {
  正官格: { shun: true, yong: ['guan'], xi: ['cai', 'yin'], ji: ['shi'], note: 'Chính Quan là sao cát tôn quý, thuận dụng — lấy Tài sinh quan, Ấn hộ quan; tối kỵ Thương Quan phá quan, Thất Sát hỗn tạp, hình xung.' },
  七殺格: { shun: false, yong: ['shi', 'yin'], xi: ['shi'], ji: ['cai'], note: 'Thất Sát cương mãnh, nghịch dụng — cần Thực Thần chế sát hoặc Ấn hóa sát; kỵ Tài đảng sát làm sát thêm hung.' },
  正財格: { shun: true, yong: ['cai'], xi: ['shi', 'guan'], ji: ['ti'], note: 'Chính Tài là lương thực, thuận dụng — lấy Thực Thương sinh tài, Quan tinh hộ tài; kỵ Tỷ Kiếp đoạt tài.' },
  偏財格: { shun: true, yong: ['cai'], xi: ['shi', 'guan'], ji: ['ti'], note: 'Thiên Tài (Tài lớn), thuận dụng như Chính Tài — lấy Thực Thương sinh tài, Quan hộ tài; kỵ Tỷ Kiếp tranh giành.' },
  正印格: { shun: true, yong: ['yin'], xi: ['guan'], ji: ['cai'], note: 'Chính Ấn chủ quyền lộc, thuận dụng — lấy Quan Sát sinh Ấn; tối kỵ Tài tinh phá Ấn.' },
  偏印格: { shun: false, yong: ['cai'], xi: ['cai'], ji: ['ti'], note: 'Kiêu Thần (Thiên Ấn), nghịch dụng — 子平真诠: cần Tài chế ngự Kiêu (phòng «kiêu thần đoạt thực»). [loop 73 sửa] kỵ = Tỷ Kiếp đẵm Tài (làm suy yếu khí chế Kiêu), KHÔNG phải kỵ Thực — Thực là BẢO VẬT được Tài bảo vệ (Hỷ), «đắc tài chế kiêu, thực thần đắc bảo».' },
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

// ---- 化氣格 (Thiên Can Ngũ Hợp HÓA KHÍ) — pref tính ĐỘNG theo quan hệ Nhật Chủ ↔ Hóa Thần ----
//   Nhóm thập thần (ti/yin/shi/cai/guan) luôn TỎNG ĐỐI với NHẬT CHỦ, mà CÙNG tên cách
//   «化土格» sinh được từ CẢ HAI can của cặp hợp (甲 hoặc 己) — cùng một chữ nhóm ↔ hành
//   KHÁC nhau theo can ngày. Nên pref CHỐT ĐỒNG phải dựng Runtime theo dmWx thật
//   (buildHuaqiPref — gọi trong detectSpecial); bản ghi tĩnh dưới đây chỉ là fallback.
//     yong = nhóm CỦA HÓA THẦN + nhóm HÀNH SINH hóa thần (nuôi hóa — 化神得生);
//     ji   = nhóm HÀNH KHẮC hóa thần (克化神 → phá hóa) + Tỷ Kiếp (trợ thân → nhật chủ
//            hồi hoàn, «化见本气比劫则不化») — TRỪ khi Hóa Thần chính là bản hành nhật chủ
//            (己 hợp 甲 / 庚 hợp 乙): 比劫 = chính hóa thần, trợ nó là THUẬN hóa.
const HUA_QI_HE = { 甲: '土', 己: '土', 乙: '金', 庚: '金', 丙: '水', 辛: '水', 丁: '木', 壬: '木', 戊: '火', 癸: '火' };
const HUA_WX_VI = { 土: 'Thổ', 金: 'Kim', 木: 'Mộc', 水: 'Thủy', 火: 'Hỏa' };
function buildHuaqiPref(dmWx, huaWx) {
  const grpHua = relGroup(dmWx, huaWx);           // nhóm của Hóa Thần
  const grpGen = relGroup(dmWx, SHENG_BY[huaWx]); // nhóm hành sinh Hóa Thần
  const grpKe = relGroup(dmWx, KE_BY[huaWx]);     // nhóm hành khắc Hóa Thần
  const yong = [grpHua, grpGen];
  const ji = (grpHua === 'ti' || grpKe === 'ti') ? [grpKe] : [grpKe, 'ti'];
  return {
    special: 'huaqi', wx: huaWx,
    yong, xi: [...yong], ji,
    note: `Hóa ${HUA_WX_VI[huaWx]} — Nhật Chủ ngũ hợp HÓA thành ${huaWx}, bỏ bản chất cũ theo hóa thần: lấy nhóm ${yong.join('/')} (hóa thần + hành sinh hóa); kỵ nhóm ${ji.join('/')} (khắc hóa thần phá hóa / Tỷ Kiếp giúp thân hồi hoàn).`,
  };
}
for (const [dg, huaWx] of Object.entries(HUA_QI_HE)) {
  PATTERN_PREF[`化${huaWx}格`] = buildHuaqiPref(GAN[dg].wx, huaWx);
}

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
    // [化气] special.pref đã dựng đúng hướng theo can ngày thật — ưu tiên hơn bản tĩnh
    const pref = special.pref || PATTERN_PREF[special.name];
    return {
      type: 'special',
      name: special.name,
      vi: PATTERN_VI[special.name] || special.name,
      geShen: special.geShen || null,
      shunNi: special.shunNi || 'thuận thế',
      ...(special.congGia !== undefined ? { congGia: special.congGia } : {}),
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
    // [loop 20 sửa] Dương Nhận (羊刃) cổ pháp CHỈ cho DƯƠNG can (甲丙戊庚壬 — 子平真詮/渊海).
    //   Âm can không có chân nhận (YANG_REN[乙丁己辛癸] trỏ về 辰戌丑未 thổ là tục-pha sau này) →
    //   Âm can nguyệt lệnh tỷ kiếp = Nguyệt Kiếp cách (đa số phái).
    else if (monthZhi === YANG_REN[dg] && !GAN[dg].yin) name = '羊刃格';
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

  const CHONG_MAP = { 子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳' };

  // -- HÓA KHÍ cách (天干五合化气) — [三命通会 化气十段锦 / 滴天髓 化象] --
  //   Điều kiện NGHIÊM NGẶT (sai 1 → KHÔNG hóa, trở về chính cách/tòng cách):
  //   (1) NHẬT CAN + can KỀ CẠNH (Tháng hoặc Giờ — KHÔNG tính Năm, xa quá không hợp) lập ngũ hợp;
  //   (2) HÓA THẦN có lực: đắc nguyệt lệnh (bản khí nguyệt chi, hoặc 司令 nếu có ngày thật)
  //       HOẶC thấu can (can khác ngoài 2 can hợp) + CÓ GỐC (bản/trung khí tại chi nào);
  //   (3) KHÔNG PHÁ HÓA: không can khác khắc Hóa Thần thấu can (克化神 → hóa tan);
  //   (4) NHẬT CHỦ gần như vô gốc: còn BẢN KHÍ gốc (bất luận chi nào) → 「有根不化」;
  //       chỉ còn trung/dư khí → HÓA ĐƯỢC nhưng 假化 (congGia — hóa chưa thuần).
  {
    const HUA_GE = { 土: '化土格', 金: '化金格', 木: '化木格', 水: '化水格', 火: '化火格' };
    const branches = ['year', 'month', 'day', 'time'];
    const dmWxEff = dmWx || (GAN[chart.dayGan] && GAN[chart.dayGan].wx); // _ff (selftest) chỉ có dayMaster.gan
    // (4) góc nhật chủ — quét MỘT LẦN (điều kiện này độc lập cặp hợp)
    let dmRootPos = -1; // -1 = vô gốc hiệu lực
    for (const zk of branches) {
      const hid2 = HIDDEN[chart.pillars[zk].zhi] || [];
      const idx = hid2.findIndex((hg) => GAN[hg] && GAN[hg].wx === dmWxEff);
      if (idx >= 0 && (dmRootPos < 0 || idx < dmRootPos)) dmRootPos = idx;
    }
    if (dmRootPos !== 0) { // còn bản khí gốc → 「日主有根不化」— bỏ qua toàn bộ 化气
      for (const k of ['month', 'time']) {
        const pK = chart.pillars[k];
        if (!pK || !pK.gan || pK.gan === chart.dayGan) continue;
        // HUA_QI_HE khóa theo TỪNG can (mỗi can chỉ hợp duy nhất 1 đối tác, cùng hóa):
        // can kề có hóa + nhật can có hóa + hai can KHÁC nhau ⟺ hai can là đối tác ngũ hợp
        const huaWx = HUA_QI_HE[pK.gan];
        if (!huaWx || huaWx !== HUA_QI_HE[chart.dayGan]) continue;
        // 争合 / 妒合 BẤT HÓA (三命通会): nhật can bị ≥2 đối tác cùng cặp hợp tranh giành
        //   (vd 癸 nhật gặp 戊 tháng VÀ 戌 giờ) — thế hợp bị chia, tất không hóa.
        const partnerCount = branches.filter((pk) => pk !== 'day').filter((pk) => {
          const g = chart.pillars[pk].gan;
          return g !== chart.dayGan && HUA_QI_HE[g] === huaWx;
        }).length;
        if (partnerCount > 1) continue;
        const inHe = new Set([chart.dayGan, pK.gan]);
        // (3) phá hóa — can khác khắc hóa thần
        const poHua = branches.some((pk) => {
          const g = chart.pillars[pk].gan;
          return !inHe.has(g) && GAN[g].wx && KE[GAN[g].wx] === huaWx;
        });
        if (poHua) continue;
        // (2a) đắc lệnh: bản khí nguyệt chi (fallback 司令 khi có ngày sinh thật)
        let cmdWx = HIDDEN[monthZhi] && GAN[HIDDEN[monthZhi][0]] ? GAN[HIDDEN[monthZhi][0]].wx : null;
        try {
          const sil = computeSiling(chart);
          if (sil && sil.wx) cmdWx = sil.wx;
        } catch (_) {}
        // (2b) hoặc thấu can (ngoài 2 can hợp) + có gốc bản/trung khí — đường này KÉM
        //   chắc bằng đắc lệnh nên đòi nhật chủ VÔ GỐC TUYỆT ĐỐI (cả dư khí cũng không)
        const touGan = branches.some((pk) => {
          if (pk === 'day') return false;
          const g = chart.pillars[pk].gan;
          return !inHe.has(g) && GAN[g].wx === huaWx;
        });
        const huaRoot = branches.some((zk) => {
          const hid2 = HIDDEN[chart.pillars[zk].zhi] || [];
          return hid2.slice(0, 2).some((hg) => GAN[hg] && GAN[hg].wx === huaWx);
        });
        if (!(cmdWx === huaWx || (touGan && huaRoot && dmRootPos === -1))) continue;
        // Đủ điều kiện → thành Hóa khí cách (ưu tiên trên Tòng: hóa là chuyển chất, sâu hơn theo thế)
        const res = { kind: 'huaqi', name: HUA_GE[huaWx], geShen: { wx: huaWx }, shunNi: 'thuận dụng' };
        res.pref = buildHuaqiPref(dmWxEff, huaWx); // pref ĐÚNG HƯỚNG theo can ngày thật (xem chú thích trên buildHuaqiPref)
        res.congGia = dmRootPos >= 1; // còn trung/dư khí căn → 假化
        if (res.congGia) {
          res.note = 'Nhật chủ chỉ còn trung/dư khí căn → 假化 (hóa chưa thuần) — vận gặp bản khí gốc hoặc khắc hóa thần = hồi hoàn, biến động lớn.';
        }
        return res;
      }
    }
  }

  // -- TỒNG cách (Nhật Chủ theo thế) — [chuẩn 滴天髓 从象 + corpus 2026-08] --
  //   Tiêu chí CỐT LÕI = HIỆU LỰC GỐC (root effectiveness), không phải % thô:
  //   gốc VÔ HIỆU nếu: (a) chỉ 余气 (pos ≥ 2 — quá mỏng), (b) chi gốc bị XUNG bởi trụ khác
  //   (gốc bị thương), (c) chi gốc bị kéo vào tam hợp hóa hành KHÁC (gốc bị hóa mất).
  //   Vô gốc hiệu lực + nhóm ngoài áp đảo (≥45%) → 从. Còn trợ nhẹ (Ấn/比 hidden/rò rỉ)
  //   → 假从 (theo thế CÓ ĐIỀU KIỆN — vận gặp trợ = biến động). 印/比当令 hoặc 透干 → KHÔNG từ.
  {
    const groups = { cai: 0, guan: 0, shi: 0 };
    for (const [w, s] of Object.entries(wx.score)) {
      const rel = relGroup(dmWx, w);
      if (groups[rel] !== undefined) groups[rel] += s;
    }
    const dom = Object.entries(groups).sort((a, b) => b[1] - a[1])[0];
    const help = (wx.score[dmWx] + wx.score[SHENG_BY[dmWx]]) / total;
    const domRatio = dom[1] / total;

    // 1. HIỆU LỰC GỐC Nhật Chủ: duyệt 4 chi — gốc 本气/trung khí CHƯA bị vô hiệu mới tính
    let dmEffectiveRoot = false;
    const pillars = chart.pillars;
    const branchKeys = ['year', 'month', 'day', 'time'];
    for (const zk of branchKeys) {
      const zhi = pillars[zk].zhi;
      const hid = HIDDEN[zhi] || [];
      const pos = hid.indexOf(chart.dayGan) >= 0 ? hid.indexOf(chart.dayGan) : -1;
      if (pos < 0 || pos > 1) continue; // 余气 (pos 2) → không đủ làm gốc
      // gốc bị XUNG?
      const clashed = branchKeys.some((ok) => ok !== zk && CHONG_MAP[zhi] === pillars[ok].zhi);
      // gốc bị TAM HÓA (chi thuộc tam hợp, 化神 ≠ dmWx)?
      const inSanhe = Object.entries(SANHE_HUAQI || {}).find(([keys, hua]) => keys.split('').includes(zhi) && hua !== dmWx);
      if (!clashed && !inSanhe) { dmEffectiveRoot = true; break; }
    }

    // 2. Ấn/比當令 hoặc 透干 → tháng/trời nuôi thân → KHÔNG từ (trừ 真从 band vô trợ)
    // [FIX — corpus/cháu case] Ấn CÓ GỐC hiệu lực (bản khí/trung khí tại chi chưa xung/hóa)
    //   → 印 có lực sinh thân → KHÔNG từ (vd cháu 辛金: 印 己 bản khí tại 月支丑 → 从儿 SAI)
    let yinEffectiveRoot = false;
    for (const zk of branchKeys) {
      const zhiY = pillars[zk].zhi;
      const hidY = HIDDEN[zhiY] || [];
      let posY = -1; for (let pi = 0; pi < Math.min(hidY.length, 2); pi++) { const wY = GAN[hidY[pi]] ? GAN[hidY[pi]].wx : null; if (wY === SHENG_BY[dmWx]) { posY = pi; break; } }
      if (posY < 0 || posY > 1) continue;
      const clashedY = branchKeys.some((ok) => ok !== zk && CHONG_MAP[zhiY] === pillars[ok].zhi);
      const inSanheY = Object.entries(SANHE_HUAQI || {}).find(([keys, hua]) => keys.split('').includes(zhiY) && hua !== SHENG_BY[dmWx]);
      if (!clashedY && !inSanheY) { yinEffectiveRoot = true; break; }
    }
    let helperTou = false;
    for (const zk of ['year', 'month', 'time']) {
      const gwx = GAN[pillars[zk].gan] ? GAN[pillars[zk].gan].wx : null;
      if (gwx === dmWx || gwx === SHENG_BY[dmWx]) { helperTou = true; break; }
    }
    let silBlocked = false;
    try {
      const sil = computeSiling(chart);
      if (sil && (sil.wx === dmWx || sil.wx === SHENG_BY[dmWx])) silBlocked = true;
    } catch (_) {}

    // 3. Nhóm ngoài áp đảo + vô gốc hiệu lực → 从 (theo thế)
    if (domRatio > 0.45 && help <= 0.40 && !dmEffectiveRoot && !yinEffectiveRoot && !helperTou && !silBlocked) { // [cap] help > 40% = 母多子病 (Ấn chủ đạo) — không phải 从
      const congGia = help > 0.12 || strength.ratio >= 0.25; // còn dấu vết trợ → 假从
      const map = { cai: '從財格', guan: '從殺格', shi: '從兒格' };
      const res = { kind: 'cong', name: map[dom[0]], geShen: { wx: dominantWx(dmWx, dom[0]) } };
      if (congGia) {
        res.congGia = true;
        res.note = 'Nhật Chủ vô gốc hiệu lực (gốc 余气/bị xung/bị hóa) nhưng còn dấu vết trợ → 假从 — vận gặp trợ = biến động lớn.';
      }
      return res;
    }
  }

  // -- CHUYÊN VƯỢNG / TÒNG VƯỢNG (Nhật Chủ cực vượng, một hành áp đảo) --
  if (strength.ratio > 0.58) { // [cập nhật] 0.70→0.58: 从旺 cổ pháp chấp nhận dm áp đảo không cần 三合 (vd 丙午×3 炎上)
    const dmScore = wx.score[dmWx] / total;
    // Chuyên vượng: cần tam hợp/tam hội行 Nhật Chủ + không có quan sát khắc
    const sanHui = (interactions.sanHui || []).some((s) => s.wx === dmWx);
    const sanHe = (interactions.sanHe || []).some((s) => s.wx === dmWx);
    const hasOfficer = hasOfficerStem(chart, dmWx);
    if ((sanHui || sanHe || dmScore > 0.55) && !hasOfficer) { // [cập nhật] đ Chi phá cách khi dm áp đảo trần trụi (≈55%) — không bắt buộc 三合
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
