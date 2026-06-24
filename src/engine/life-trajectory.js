// ============================================================================
//  QUỸ TÍCH CUỘC ĐỜI (一生运程 / 人生轨迹) — tổng hợp toàn bộ cung đường mệnh
//  Dệt các nguyên liệu đã tính (四柱限运 + 大运 + 用喜忌仇 + 身强弱 + 总论) thành
//  MỘT dòng thời gian mạch lạc: 4 giai đoạn đời + từng đại vận (thập kỷ) + các
//  cửa sổ cưới/con/sự nghiệp/tài/sức khoẻ + các điểm rẽ Cát/Hung.
//  Deterministic. Không đoán sự kiện — chỉ ra XU HƯỚNG + CỬA SỔ vận (theo cổ pháp).
//  Nguồn: 大运流年论 (zhuanlan.zhihu) · 滴天髓 限运说 · 人生最关键三步大运.
// ============================================================================
import { GAN, WX_VI, TEN_GOD_VI, SHENG, KE, SHENG_BY, KE_BY } from './constants.js';
import { analyzePillarAges } from './pillar-age.js';
import { isFuyin, isFanyin } from './fuyin.js'; // [loop 28] landmark 大运×natal pillar

// ---- Nhóm Thập Thần (ti/yin/shi/cai/guan) ----
function godGroup(god) {
  switch (god) {
    case '比肩': case '劫財': return 'ti';
    case '正印': case '偏印': return 'yin';
    case '食神': case '傷官': return 'shi';
    case '正財': case '偏財': return 'cai';
    case '正官': case '七殺': return 'guan';
    default: return '';
  }
}

// ---- Chủ đề từng nhóm Thập Thần (theo Cát vì Dụng / Hung vì Kỵ) ----
const THEME = {
  guan: {
    name: 'Sự nghiệp · Quyền uy · Danh vọng',
    cat: 'thăng tiến, có quý nhân đề bạt, địa vị nâng lên; nam thêm danh vọng, nữ thêm duyên chồng tốt',
    hung: 'áp lực công việc, thị phi, vướng luật pháp/quan chức; cần khiêm nhường, giữ mình',
  },
  cai: {
    name: 'Tài lộc · Kinh doanh · Vợ (nam)',
    cat: 'tài lộc đến, cơ hội kinh doanh/đầu tư; nam thêm duyên vợ/tình cảm',
    hung: 'hao tài, đầu tư dễ lỗ, vì tiền sinh sự; thân nhược thì "tài đa thân nhược" mệt mỏi',
  },
  yin: {
    name: 'Học vấn · Quý nhân · Nhà cửa · Mẹ',
    cat: 'học hành/bằng cấp thuận, quý nhân phù, mua nhà/đất, ổn định; được mẹ/gia đình hỗ trợ',
    hung: 'bảo thủ, bị ràng buộc, dễ ỷ lại; kiêu ấn đoạt thực thì tài năng bị kìm',
  },
  shi: {
    name: 'Tài hoa · Sáng tạo · Khởi nghiệp · Con (nữ)',
    cat: 'tài năng bộc lộ, ý tưởng sinh lời, khởi nghiệp thuận; nữ thêm duyên con',
    hung: 'khẩu thị phi, phản nghịch, "thương quan kiến quan" — cẩn thận hôn nhân/công việc biến động',
  },
  ti: {
    name: 'Cạnh tranh · Hợp tác · Bạn bè · Huynh đệ',
    cat: 'được bạn bè/đồng nghiệp giúp, hợp tác có lợi (khi thân nhược cần trợ)',
    hung: 'cạnh tranh gay gắt, dễ phá tài/hao tiền vì người khác; nam cẩn thận ngoại tình/tranh giành',
  },
};

const CLASH = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };

// Chủ đề headline cho 1 đại vận + flavour Cát/Hung theo Dụng-Kỵ
function decadeTheme(R, dy) {
  const { yong, strength } = R;
  const favSet = new Set([yong.primary, yong.xi].filter(Boolean));
  const kySet = new Set([yong.ji, yong.chou]);
  const strong = strength.strong;

  const ganG = godGroup(dy.ganGod);
  const zhiG = godGroup(dy.zhiGod);
  const ganFav = favSet.has(dy.ganWx), zhiFav = favSet.has(dy.zhiWx);
  const ganKy = kySet.has(dy.ganWx), zhiKy = kySet.has(dy.zhiWx);

  // headline group: ưu tiên nhóm mang Dụng/Hỷ; không thì lấy nhóm can
  const headG = ganFav ? ganG : (zhiFav ? zhiG : ganG);
  const t = THEME[headG] || THEME[ganG] || THEME.guan;
  const isMale = R.chart.input.gender === 'nam';
  const themeName = themeNameOf(headG, isMale);

  const isCat = dy.rating === 'Cát' || dy.rating === 'Hơi thuận';
  const isHung = dy.rating === 'Hung' || dy.rating === 'Hơi nghịch';
  const anyFav = ganFav || zhiFav;
  const anyKy = ganKy || zhiKy;

  // flavour: Dụng → narr Cát; Kỵ → narr Hung; trung tính → narr Cát (nhẹ)
  const flavour = anyFav ? 'cat' : (anyKy ? 'hung' : 'cat');
  let line = cleanGender(t[flavour], isMale);

  // tinh chỉnh đặc thù nhóm theo thân cường/nhược
  if (headG === 'cai' && !strong && anyFav) line = 'tài đến nhưng thân nhược — cần tiết chế, đừng vội đầu tư lớn; "tài đa thân nhược" dễ mệt';
  if (headG === 'ti' && strong && anyKy) line = 'tỷ kiếp trùng điệp — cạnh tranh/phá tài, hao tiền vì bạn bè/người thân';

  // [loop 28 sửa] golden & caution phải LOẠI NHAU — trước đây thập niên có can=Dụng + chi=Kỵ bị
  //   flag CẢ 2 (đỉnh vận + dè chừng) tự mâu thuẫn. golden chỉ khi KHÔNG có Kỵ; caution khi không golden.
  const golden = isCat && anyFav && !anyKy;
  const caution = !golden && (isHung || anyKy);

  return {
    headG, themeName, flavour, line,
    golden, caution,
    ganGodVi: TEN_GOD_VI[dy.ganGod] || dy.ganGod,
    zhiGodVi: TEN_GOD_VI[dy.zhiGod] || dy.zhiGod,
  };
}

// Tên chủ đề gender-aware (cai=Vợ chỉ nam; guan=Chồng chỉ nữ; shi=Con chỉ nữ)
function themeNameOf(g, isMale) {
  return ({
    cai: isMale ? 'Tài lộc · Kinh doanh · Vợ' : 'Tài lộc · Kinh doanh',
    guan: isMale ? 'Sự nghiệp · Quyền uy · Danh vọng' : 'Sự nghiệp · Quyền uy · Chồng',
    shi: isMale ? 'Tài hoa · Sáng tạo · Khởi nghiệp' : 'Tài hoa · Sáng tạo · Khởi nghiệp · Con',
    yin: 'Học vấn · Quý nhân · Nhà cửa · Mẹ',
    ti: 'Cạnh tranh · Hợp tác · Bạn bè',
  })[g] || '—';
}
// Bỏ mệnh đề giới tính không phù hợp ("nam thêm…" / "nữ thêm…") trong câu luận
function cleanGender(line, isMale) {
  let l = String(line || '');
  if (!isMale) l = l.replace(/[;，]\s*nam thêm[^;，.]*/g, '').replace(/^\s*nam thêm[^;，.]*/g, '');
  if (isMale) l = l.replace(/[;，]\s*nữ thêm[^;，.]*/g, '').replace(/^\s*nữ thêm[^;，.]*/g, '');
  return l.replace(/^[\s;，]+/, '').trim();
}

// Các cửa sổ cuộc đời: hôn nhân / con / sự nghiệp / tài / sức khoẻ
function buildKeyWindows(R, decades) {
  const isMale = R.chart.input.gender === 'nam';
  const spouseGods = isMale ? ['正財', '偏財'] : ['正官', '七殺'];
  const childGods = isMale ? ['七殺', '正官'] : ['食神', '傷官'];
  const careerGods = ['正官', '七殺'];
  const wealthGods = ['正財', '偏財'];
  const dayZhi = R.chart.pillars.day.zhi;

  const win = { marriage: [], children: [], career: [], wealth: [], health: [] };
  for (const dec of decades) {
    const dy = dec.dy;
    const godsHere = [dy.ganGod, dy.zhiGod];
    const isCat = dy.rating === 'Cát' || dy.rating === 'Hơi thuận';
    const isHung = dy.rating === 'Hung' || dy.rating === 'Hơi nghịch';
    const ages = `${dy.startAge}–${dy.startAge + 9}t`;
    if (spouseGods.some((g) => godsHere.includes(g)) && isCat && dy.startAge >= 18 && dy.startAge <= 45) win.marriage.push({ ages, ganZhi: dy.ganZhi, reason: `đại vận mang ${TEN_GOD_VI[godsHere.find((g) => spouseGods.includes(g))]} (sao phối ngẫu) + Cát` });
    if (childGods.some((g) => godsHere.includes(g)) && isCat && dy.startAge >= 22 && dy.startAge <= 45) win.children.push({ ages, ganZhi: dy.ganZhi, reason: `đại vận mang ${TEN_GOD_VI[godsHere.find((g) => childGods.includes(g))]} (sao con) + Cát` });
    if (careerGods.some((g) => godsHere.includes(g)) && isCat) win.career.push({ ages, ganZhi: dy.ganZhi, reason: `đại vận mang ${TEN_GOD_VI[godsHere.find((g) => careerGods.includes(g))]} (sao sự nghiệp) + Cát` });
    if (wealthGods.some((g) => godsHere.includes(g)) && isCat) win.wealth.push({ ages, ganZhi: dy.ganZhi, reason: `đại vận mang ${TEN_GOD_VI[godsHere.find((g) => wealthGods.includes(g))]} (sao tài) + Cát` });
    // sức khoẻ: xung nhật chi / that sát hoặc kiếp tài ở vãn niên / đại vận Hung mạnh
    const clashDay = CLASH[dy.zhi] === dayZhi || CLASH[dayZhi] === dy.zhi;
    const oldAge = dy.startAge >= 50;
    const fierce = godsHere.some((g) => ['七殺', '劫財'].includes(g));
    if (clashDay || (oldAge && fierce) || (isHung && dy.score <= -2)) win.health.push({ ages, ganZhi: dy.ganZhi, reason: clashDay ? `đại vận xung Nhật Chi (${dayZhi}↔${dy.zhi})` : (oldAge && fierce ? `vãn niên gặp Thất Sát/Kiếp Tài` : `đại vận Hung (${dy.rating})`) });
  }
  return win;
}

/**
 * @param R kết quả analyze() (đã có dayun, yong, strength, synthesis, chart)
 * @returns {{ foundation, stages, decades, keyWindows, turningPoints, rectifyNote, summary }}
 */
export function buildLifeTrajectory(R) {
  const dayuns = R.dayun || [];
  const decades = dayuns.map((dy) => {
    const th = decadeTheme(R, dy);
    return {
      dy,
      startAge: dy.startAge,
      ages: `${dy.startAge}–${dy.startAge + 9}t`,
      ganZhi: dy.ganZhi,
      rating: dy.rating,
      ...th,
      narrative: `${dy.startAge}–${dy.startAge + 9} tuổi · ${dy.ganZhi} · can ${th.ganGodVi}, chi ${th.zhiGodVi} → ${th.themeName}: ${th.line}.`,
    };
  });

  const stages = analyzePillarAges(R); // 4 giai đoạn (年/月/日/时)
  const keyWindows = buildKeyWindows(R, decades);

  // Điểm rẽ: 2 đại vận Cát nhất (golden) + 2 Hung nhất (caution)
  const golden = decades.filter((d) => d.golden).sort((a, b) => b.dy.score - a.dy.score).slice(0, 2);
  const caution = decades.filter((d) => d.caution).sort((a, b) => a.dy.score - b.dy.score).slice(0, 2);
  // [loop 28] LANDMARK: 大运 伏吟/反吟 1 trụ nguyên cục → thập kỷ biến cố lớn (cổ法 «反吟伏吟
  //   泪淋淋»). Đặc biệt nhật trụ = bản thân/phối ngẫu. isFuyin/isFanyin đã verify (loop 19).
  const pillarKeys = ['year', 'month', 'day', 'time'];
  const pillarVi = { year: 'Niên', month: 'Nguyệt', day: 'Nhật', time: 'Thời' };
  const landmarks = [];
  for (const d of decades) {
    if (!d.ganZhi || d.ganZhi.length < 2) continue;
    const dyP = { gan: d.ganZhi[0], zhi: d.ganZhi[1] };
    for (const k of pillarKeys) {
      const np = R.chart.pillars[k];
      if (!np || !np.gan) continue;
      const natal = { gan: np.gan, zhi: np.zhi };
      if (isFuyin(dyP, natal)) landmarks.push({ kind: 'fuyin', ages: d.ages, ganZhi: d.ganZhi, pillar: pillarVi[k], reason: `伏吟 ${pillarVi[k]} (đại vận trùng ${np.gan}${np.zhi}) — ${k === 'day' ? 'BIẾN CỐ BẢN THÂN/PHỐI NGẪU' : 'đình trệ/lặp'} ${pillarVi[k].toLowerCase()}` });
      else if (isFanyin(dyP, natal)) landmarks.push({ kind: 'fanyin', ages: d.ages, ganZhi: d.ganZhi, pillar: pillarVi[k], reason: `⚡反吟 ${pillarVi[k]} (đại vận thiên khắc địa xung ${np.gan}${np.zhi}) — ${k === 'day' ? 'BIẾN ĐỘNG LỚN bản thân/phối ngẫu' : 'động loạn'} ${pillarVi[k].toLowerCase()}` });
    }
  }
  const turningPoints = [
    ...golden.map((d) => ({ kind: 'golden', ages: d.ages, ganZhi: d.ganZhi, reason: d.line })),
    ...caution.map((d) => ({ kind: 'caution', ages: d.ages, ganZhi: d.ganZhi, reason: d.line })),
    ...landmarks,
  ];

  const synth = R.synthesis || {};
  const foundation = {
    dmVi: R.chart.dayMaster.vi,
    dmWx: WX_VI[R.chart.dayMaster.wx],
    strength: R.strength.level,
    yong: WX_VI[R.yong.primary],
    yongXi: WX_VI[R.yong.xi],
    grade: synth.gradeVi || '',
    gradeZh: synth.grade || '',
    score: synth.score,
  };

  // Lưu ý hiệu chỉnh: trụ Giờ = vãn niên + con cái → nhạy với giờ sinh
  const rectifyNote = 'Vãn niên (Trụ Giờ) và cửa sổ con cái phụ thuộc trụ Giờ — nếu chưa rõ giờ, hãy dùng "Nghiệm chứng gia tộc → hiệu chỉnh giờ" để nền móng vững hơn trước khi đọc quỹ tích.';

  // Tóm tắt cung đường
  const bestDecade = golden[0];
  const worstDecade = caution[0];
  const summaryParts = [
    `Nhật Chủ ${foundation.dmVi} (${foundation.dmWx}), ${foundation.strength}. Dụng Thần ${foundation.yong} (Hỷ ${foundation.yongXi}). Cấp mệnh ${foundation.grade || '—'}${foundation.score != null ? ` (${foundation.score}/100)` : ''}.`,
    bestDecade ? `Đỉnh vận: ${bestDecade.ages} (${bestDecade.ganZhi}) — ${bestDecade.themeName}, ${bestDecade.line}.` : '',
    worstDecade ? `Giai đoạn cần dè chừng: ${worstDecade.ages} (${worstDecade.ganZhi}) — ${worstDecade.line}.` : '',
    'Quỹ tích mang tính tham khảo vận thế — xu hướng + cửa sổ thời vận theo cổ pháp, không phải sự kiện tất định. Nỗ lực & đức hành vẫn là quyết định.',
  ].filter(Boolean);

  return { foundation, stages, decades, keyWindows, turningPoints, rectifyNote, summary: summaryParts.join(' ') };
}
