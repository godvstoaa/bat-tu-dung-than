// ============================================================================
//  LƯU NIÊN DẪN ĐỘNG LỤC THÂN — 流年引动六亲 (Year-to-Event Rule Engine)
//  Nguyên lý: Thập Thần năm (từ trường phái #2 của liunian-pro) + Vượng suy
//  bản mệnh → loại SỰ VIỆC cụ thể (theo 口诀 cổ pháp). Kết hợp 刑冲合害 với
//  Tứ Trụ nguyên cục → quyết định AI/VÙNG nào bị ảnh hưởng.
//
//  Nguồn kinh điển:
//    - 渊海子平 (Yuēhǎi Zǐpíng) — 十神应期 (ứng kỳ thập thần)
//    - 滴天髓 (Dī Tiān Suǐ) — 岁运应事 (tuế vận ứng sự)
//    - 三命通会 (Sān Mìng Tōng Huì) — 流年引动六亲 (lưu niên dẫn động lục thân)
//    - 子平真詮 (Zǐpíng Zhēnyán) —格局 + 用神 kích hoạt
//
//  Luận: "吉神被合则失其吉, 凶神被冲则发其凶" — sao cát bị hợp mất cát, sao
//  hung bị xung phát hung. Mỗi Thập Thần năm đi kèm thân cường/nhược + cờ
//  xung/hợp/hình/hại vs từng trụ → loại sự việc + đối tượng + độ tin cậy.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod, godGroup } from './core.js';

// ---- Lục xung / Lục hại / Lục hình / Lục hợp (TỰ ĐỊNH — deterministic) ----
// Giữ bản đồ nội bộ giống liunian-pro.js để module độc lập, không phụ thuộc
// shape của R.interactions (tránh lệch khi interactions.js thay đổi).
const CHONG = {
  子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅',
  卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳',
};
const HAI = {
  子: '未', 未: '子', 丑: '午', 午: '丑', 寅: '巳', 巳: '寅',
  卯: '辰', 辰: '卯', 申: '亥', 亥: '申', 酉: '戌', 戌: '酉',
};
// Tam hình (đôi) + tự hình (辰辰/午午/酉酉/亥亥)
const XING = {
  子: '卯', 卯: '子', 寅: '巳', 巳: '申', 申: '寅',
  丑: '戌', 戌: '未', 未: '丑',
  辰: '辰', 午: '午', 酉: '酉', 亥: '亥',
};
// Lục hợp (chi ↔ chi)
const LIUHE = {
  子: '丑', 丑: '子', 寅: '亥', 亥: '寅', 卯: '戌', 戌: '卯',
  辰: '酉', 酉: '辰', 巳: '申', 申: '巳', 午: '未', 未: '午',
};

// ---- Ánh xạ Trụ → Lục Thân / Vùng bị ảnh hưởng ----
//  年柱 = 祖辈 (tổ bối) / tuổi thơ / gốc gác
//  月柱 = 父母 (phụ mẫu) / sự nghiệp / thủ trưởng
//  日柱 = 配偶 (phối ngẫu) + bản thân / hôn nhân
//  时柱 = 子女 (tử nữ) / cấp dưới /晚年
const PILLAR_WHO = {
  year: { vi: 'Tổ bối / gia đình gốc', en: 'ancestors', short: 'Tổ' },
  month: { vi: 'Phụ mẫu / sự nghiệp / thủ trưởng', en: 'parents-career', short: 'Phụ mẫu' },
  day: { vi: 'Bản thân / Phối ngẫu (hôn nhân)', en: 'spouse-self', short: 'Phối ngẫu' },
  time: { vi: 'Tử nữ / cấp dưới', en: 'children', short: 'Tử nữ' },
};

// ---- Hành vi tương tác vs trụ ----
const INTERACTION_LABEL = {
  chong: { vi: 'Xung (冲)', tone: 'hung', dConf: 0.20 }, // đại biến động
  xing: { vi: 'Hình (刑)', tone: 'hung', dConf: 0.12 },  // quan phi / thị phi
  hai: { vi: 'Hại (害)', tone: 'hung', dConf: 0.08 },    // tiểu nhân ngầm
  he: { vi: 'Hợp (合)', tone: 'mixed', dConf: 0.10 },    // dính líu / lưu lại
};

// ============================================================================
//  BẢNG 口诀: Thập Thần năm × (thân cường / thân nhược) → sự việc
//  Mỗi entry: { area, events, baseConf, modStrong, modWeak, source }
//   - modStrong: biến thể khi 本命 vượng
//   - modWeak:   biến thể khi 本命 nhược
//  Viết theo 渊海子平 十神应期 + 三命通会 流年引动.
// ============================================================================
const GOD_EVENT_RULES = {
  // 正官 — sao cát tôn quý, chủ danh vọng / kỷ luật / quyền (nam: sự nghiệp, nữ: chồng)
  正官: {
    area: 'Sự nghiệp · Danh vọng',
    events: ['thăng chức', 'lên chức', 'danh vọng', 'được cấp trên đề bạt'],
    baseConf: 0.62,
    modStrong: { events: ['升职 (thăng tiến)', 'tiếng tăm', 'kết hôn (nữ mang quan tinh làm phu)'], note: 'Thân vượng + Chính Quan năm → quan tinh hữu lực → thăng tiến / danh vọng / thành hôn.', dConf: 0.18 },
    modWeak: { events: ['áp lực', 'quan phi', 'giáng chức', 'kỷ luật'], note: 'Thân nhược gặp Chính Quan khắc thân → 鬼管 (quỷ quản) → áp lực / quan phi / giảm chức.', dConf: -0.18 },
    source: '渊海子平「正官喜身旺」· 三命通会「官星太过反为鬼」',
    femaleExtra: 'nữ mệnh: quan tinh = chồng → năm gặp Chính Quan chủ động hôn nhân / tình duyên chính danh.',
  },
  // 七殺 — cương mãnh, nghịch dụng; có chế → quyền, không chế → tai
  七殺: {
    area: 'Áp lực · Quyền lực · Sức khoẻ',
    events: ['áp lực nặng', 'tiểu nhân', 'rủi ro', 'bệnh', 'quyền lực đột ngột'],
    baseConf: 0.55,
    // Có Ấn hóa (yong/yin hộ thân) hay Thực chế → quyền; không → tai họa
    modStrong: { events: ['quyền lực tăng', 'khởi nghiệp thành công', 'đột phá'], note: 'Thân vượng + Sát năm = "thân sát lưỡng đình" → có thể chống Sát → nắm quyền / khởi nghiệp.', dConf: 0.12 },
    modWeak: { events: ['bệnh', 'tiểu nhân', 'thương tích', 'thất bại ép buộc'], note: 'Thân nhược gặp Sát vô chế → 鬼攻 thân → bệnh / tiểu nhân / rủi ro / tai nạn.', dConf: -0.22 },
    source: '滴天髓「杀无制化为鬼」· 子平真詮「七杀有制化为权」',
  },
  // 正財 — lương thực, tiến tài đều; nam = vợ
  正財: {
    area: 'Tài lộc · Lương thực',
    events: ['tiến tài đều', 'lương thưởng', 'tích luỹ'],
    baseConf: 0.60,
    modStrong: { events: ['进财 (tiến tài)', 'mua nhà / bất động sản', 'tài lộc ổn định'], note: 'Thân vượng + Chính Tài năm → tài tinh tại vị → 进财 / mua nhà / tích luỹ.', dConf: 0.18 },
    modWeak: { events: ['破财 (phá tài)', 'nợ nần', 'lao lực vì tiền'], note: 'Thân nhược gặp Tài → 财多身弱 → hao tài / nợ nần / kiệt sức vì tiền.', dConf: -0.20 },
    source: '渊海子平「财为养命之源, 身旺堪任」',
    maleExtra: 'nam mệnh: tài tinh = vợ → năm gặp Chính Tài chủ động hôn nhân / vợ.',
  },
  // 偏財 — thiên tài, biến động lớn; nam = cha / vợ thứ
  偏財: {
    area: 'Tài lộc biến · Đầu tư · Cha',
    events: ['tài lớn bất ngờ', 'đầu tư / kinh doanh', 'hoặc hao lớn'],
    baseConf: 0.58,
    modStrong: { events: ['意外财 (tài bất ngờ)', 'đầu tư thắng', 'tài lớn'], note: 'Thân vượng + Thiên Tài năm → tài lớn ập đến / đầu tư thắng lớn.', dConf: 0.16 },
    modWeak: { events: ['破财 lớn', 'đầu tư thảm', 'nợ'], note: 'Thân nhược gặp Thiên Tài → hoạnh tài biến hoạnh phá → hao lớn / đầu tư thua.', dConf: -0.20 },
    source: '渊海子平「偏财身旺则发, 身弱则破」',
    maleExtra: 'nam mệnh: thiên tài = cha / vợ thứ → năm này CHA dễ biến động sức khoẻ/sự nghiệp.',
  },
  // 正印 — quý nhân, học vấn, bất động sản, mẹ
  正印: {
    area: 'Học vấn · Bất động sản · Mẹ',
    events: ['thi cử / bằng cấp', 'quý nhân phù trợ', 'mua nhà / đất', 'học hành'],
    baseConf: 0.64,
    modStrong: { events: ['考试 (thi cử đỗ)', 'mua nhà', 'quý nhân'], note: 'Thân vượng + Chính Ấn năm → Ấn sinh thân hữu dư → thi cử / nhà cửa / quý nhân.', dConf: 0.16 },
    modWeak: { events: ['quý nhân cứu giúp', 'được cấp trên / người lớn đỡ', 'ồn no'], note: 'Thân nhược gặp Chính Ấn → Ấn hóa dịch thân → được bảo vệ / quý nhân cứu.', dConf: 0.12 },
    source: '渊海子平「正印主权柄, 主文章」',
    extra: 'năm gặp Chính Ấn → sự liên quan đến MẸ (sức khoẻ / hung cát) thường nổi lên.',
  },
  // 偏印 (Kiêu Thần) — cô độc, huyền học,副业; kỵ "kiêu đoạt thực"
  偏印: {
    area: 'Tâm linh · Nội tâm · Phụ nghiệp',
    events: ['cô độc', 'huyền học / tâm linh', 'phụ nghiệp / nghề tay trái'],
    baseConf: 0.50,
    modStrong: { events: ['huyền học / linh tính', 'nghiên cứu chuyên sâu', 'phụ nghiệp'], note: 'Thân vượng + Thiên Ấn năm → thiên hướng huyền học / nghiên cứu / cô độc.', dConf: 0.06 },
    modWeak: { events: ['孤僻 (cô lập)', 'đoạt thực phá tài nguyên', 'sức khoẻ elders'], note: 'Thân nhược gặp Thiên Ấn → kiêu thần đoạt thực → cô lập / phá tài nguyên / hao tổn.', dConf: -0.14 },
    source: '子平真詮「枭神夺食, 其祸甚速」',
    extra: 'năm gặp Thiên Ấn → trường hợp liên quan đến TRƯỞNG BỐI (ông bà) dễ nổi lên.',
  },
  // 食神 — phúc lộc, sáng tạo, tử nữ (nữ), ẩm thực
  食神: {
    area: 'Sáng tạo · Phúc lộc · Tử nữ',
    events: ['tài hoa sinh tài', 'phúc lộc', 'ẩm thực / yến tiệc', 'sáng tạo'],
    baseConf: 0.62,
    modStrong: { events: ['创作 (sáng tạo bùng nổ)', 'phúc lộc', 'sinh tài'], note: 'Thân vượng + Thực Thần năm → thực sinh tài → sáng tạo / phúc / tài.', dConf: 0.16 },
    modWeak: { events: ['phúc lộc nhẹ', 'hao sức', 'ý tưởng không thành'], note: 'Thân nhược gặp Thực → tiết khí → hao sức / phúc lộc nhẹ.', dConf: -0.08 },
    source: '渊海子平「食神秀气, 最喜身旺」',
    femaleExtra: 'nữ mệnh: thực thần = con → năm gặp Thực Thần chủ động sự việc CON.',
  },
  // 傷官 — biến động, khẩu thiệp, sáng tạo bùng nổ; nữ khắc phu; kỵ "thương quan kiến quan"
  傷官: {
    area: 'Biến động · Khẩu thịphi · Sáng tạo',
    events: ['变动 (thay đổi / chuyển việc)', '口舌 (khẩu thị phi)', 'sáng tạo bùng nổ'],
    baseConf: 0.52,
    modStrong: { events: ['创业 (khởi nghiệp)', 'sáng tạo bùng nổ', 'thay đổi lớn'], note: 'Thân vượng + Thương Quan năm → tiết tú → sáng tạo / khởi nghiệp / biến động tích cực.', dConf: 0.04 },
    modWeak: { events: ['破财', '口舌', 'kiệt sức', 'nữ khắc phu'], note: 'Thân nhược gặp Thương Quan → tiết kiệt + hao → khẩu thiệp / phá tài / kiệt.', dConf: -0.18 },
    source: '渊海子平「伤官见官, 为祸百端」· 滴天髓「伤官最忌身弱」',
    femaleExtra: 'nữ mệnh: thương quan khắc phu → năm này HÔN NHÂN dễ biến (cần cẩn thận).',
    specialClash: '若同年 lại gặp Chính Quan (thương quan kiến quan) → ĐẠI HUNG: quan phi / tai hoạ.',
  },
  // 比肩 — đồng hành, cạnh tranh, hợp tác, đoạt tài
  比肩: {
    area: 'Quan hệ · Cạnh tranh · Hợp tác',
    events: ['bạn bè / anh em', 'cạnh tranh', 'độc lập', 'hợp tác'],
    baseConf: 0.54,
    modStrong: { events: ['竞争 (cạnh tranh thắng)', 'hợp tác', 'tự lập'], note: 'Thân vượng + Tỷ Kiên năm → tỷ trợ → cạnh tranh / hợp tác / tự lập (cát nếu Dụng là Tỷ).', dConf: 0.06 },
    modWeak: { events: ['破财 (phân tài)', 'cạnh tranh bất lợi', 'hao tiền'], note: 'Thân nhược vốn cần Tỷ trợ → Tỷ Kiên năm hơi tốt (bổ thân), nhưng kỵ gặp Tài thì đoạt.', dConf: 0.04 },
    source: '渊海子平「比肩争财, 身弱则喜」',
    extra: 'năm Tỷ/Kiếp → phân tài: tiền bạc / vợ (nam) dễ bị chia sẻ / tranh giành.',
  },
  // 劫財 — đoạt tài hung, biến động hôn nhân, bạn bè mượn tiền
  劫財: {
    area: 'Tài lộc hao · Tranh giành · Hôn nhân',
    events: ['破财 lớn', 'tranh giành', 'bạn bè mượn tiền', 'hôn nhân biến'],
    baseConf: 0.56,
    modStrong: { events: ['破财 (đoạt tài lớn)', 'tranh giành', 'khủng hoảng'], note: 'Thân vượng + Kiếp Tài năm → 劫财夺妻 / đoạt tài → phá tài lớn / hôn nhân biến / bạn bè vay không trả.', dConf: -0.18 },
    modWeak: { events: ['hơi trợ thân', 'nhưng vẫn hao'], note: 'Thân nhược gặp Kiếp → có tỷ trợ nhẹ nhưng bản chất đoạt tài vẫn hao.', dConf: -0.06 },
    source: '渊海子平「劫财破财伤妻」· 三命通会「阳刃劫财, 岁运并临, 财散人离」',
    maleExtra: 'nam mệnh: kiếp tài đoạt vợ → năm này HÔN NHÂN / VỢ dễ biến động.',
  },
};

// ---- Hỗ trợ: danh sách 10 thập thần để kiểm tra độ phủ luật ----
export const ALL_GODS = Object.keys(GOD_EVENT_RULES); // 10 sao

// ---- Hỗ trợ: trả nhóm Dụng (yong/xi/ji) từ R.pattern.pref để xét "có Ấn hóa / có chế" ----
function prefGroups(R) {
  const pref = R?.pattern?.pref || {};
  return {
    yong: new Set(pref.yong || []),
    xi: new Set(pref.xi || []),
    ji: new Set(pref.ji || []),
  };
}

// ---- Hỗ trợ: có Ấn hóa Sát hay không (Sát có chế/thực hóa/ấn hóa) ----
function hasShaZhiHua(R) {
  const pref = prefGroups(R);
  // Dụng/Hỷ là Ấn (yin) hoặc Thực (shi) → có khả năng hóa chế Sát
  return pref.yong.has('yin') || pref.xi.has('yin') || pref.yong.has('shi') || pref.xi.has('shi');
}

// ---- Tính tương tác chi năm vs từng trụ nguyên cục → trả map {pillar: [interactions]} ----
function pillarInteractions(yearZhi, pillars) {
  const out = {};
  for (const [key, p] of Object.entries(pillars)) {
    const pz = p.zhi;
    if (!pz) continue;
    const hits = [];
    if (CHONG[pz] === yearZhi) hits.push('chong');
    if (XING[pz] === yearZhi && pz !== yearZhi) hits.push('xing');
    if (HAI[pz] === yearZhi) hits.push('hai');
    if (LIUHE[pz] === yearZhi) hits.push('he');
    if (hits.length) out[key] = hits;
  }
  return out;
}

// ---- Lấy can chi năm (lập xuân chuẩn — giữa năm) ----
function yearGanZhi(solarYear) {
  const ys = Solar.fromYmdHms(solarYear, 6, 15, 12, 0, 0);
  const yl = ys.getLunar();
  return { gan: yl.getYearGan(), zhi: yl.getYearZhi() };
}

/**
 * Luận 流年引动六亲 cho 1 năm.
 * @param {object} R   - reading object (chart, strength, yong, pattern, dayun)
 * @param {number} year - năm dương lịch
 * @returns {{
 *   year, ganZhi, yearGod, yearGodVi, bodyStrong,
 *   shaZhiHua:boolean,
 *   pillarHits:object,
 *   events: Array<{ type, vi, who, pillar, tone, confidence, detail, source }>,
 *   summary:string
 * }}
 */
export function liunianEvents(R, year) {
  const c = R.chart;
  const dayGan = c.dayGan;
  const { gan: yGan, zhi: yZhi } = yearGanZhi(year);
  const yearGod = tenGod(dayGan, yGan);
  const yearGodVi = TEN_GOD_VI[yearGod] || yearGod;
  const bodyStrong = !!(R.strength && R.strength.strong);
  const pillars = c.pillars;

  const pillarHits = pillarInteractions(yZhi, pillars);
  const shaZhiHua = hasShaZhiHua(R);

  const rule = GOD_EVENT_RULES[yearGod];
  const events = [];

  if (rule) {
    // ---- Sự việc CHÍNH theo (thân cường/nhược) ----
    const branch = bodyStrong ? rule.modStrong : rule.modWeak;
    const evList = (branch && branch.events ? branch.events : rule.events) || rule.events;
    const note = (branch && branch.note) || '';
    let conf = rule.baseConf + (branch && branch.dConf ? branch.dConf : 0);

    // Điều chỉnh theo Dụng/Hỷ/Kỵ: năm sao là Dụng/Hỷ → tăng, là Kỵ → giảm
    const pref = prefGroups(R);
    const grp = godGroup(yearGod);
    if (pref.yong.has(grp)) conf += 0.08;
    if (pref.xi.has(grp)) conf += 0.04;
    if (pref.ji.has(grp)) conf -= 0.08;

    // Sát vô chế → giảm thêm (chỉ áp dụng cho 七殺)
    if (yearGod === '七殺' && !shaZhiHua) {
      conf -= 0.10;
      events.push({
        type: 'sat-no-control',
        vi: 'Thất Sát VÔ chế (杀无制)',
        who: 'Bản thân',
        pillar: 'day',
        tone: 'hung',
        confidence: clamp(conf - 0.05),
        detail: 'Sát năm không có Ấn hóa / Thực chế → sát khí trực tiếp phạm thân: bệnh / tiểu nhân / rủi ro / tai nạn. Cần thủ, tránh liều.',
        source: rule.source,
      });
    }

    // Sự việc chính
    for (const ev of evList) {
      events.push({
        type: 'god-main',
        vi: ev,
        who: primaryWho(yearGod, R),
        pillar: primaryPillar(yearGod),
        tone: conf >= 0.5 ? 'cat' : 'hung',
        confidence: clamp(conf),
        detail: note,
        source: rule.source,
      });
    }

    // Thương quan kiến quan → ĐẠI HUNG
    if (rule.specialClash && yearGod === '傷官') {
      // Nếu trong nguyên cục có Chính Quan thấu can hoặc đại vận mang quan → cảnh báo
      const hasGuanInChart = Object.values(pillars).some((p) => p.ganGod === '正官');
      if (hasGuanInChart) {
        events.push({
          type: 'shang-guan-jian-guan',
          vi: 'Thương Quan kiến Quan (伤官见官) — ĐẠI HUNG',
          who: 'Sự nghiệp / Quan phi',
          pillar: 'month',
          tone: 'hung',
          confidence: 0.82,
          detail: 'Năm Thương Quan gặp Chính Quan trong cục → 「为祸百端」: quan phi, thị phi nặng, sức khoẻ giảm, hôn nhân biến. Năm cực kỵ quyết định lớn.',
          source: rule.specialClash,
        });
      }
    }

    // Lục thân đặc biệt (nữ = chồng/con; nam = vợ/cha)
    const gender = (c.input && c.input.gender) || (R.input && R.input.gender) || 'nam';
    if (gender === 'nu' && rule.femaleExtra) {
      events.push(extraEvent('female-extra', rule.femaleExtra, yearGodVi, 'month', clamp(conf + 0.02)));
    }
    if (gender === 'nam' && rule.maleExtra) {
      events.push(extraEvent('male-extra', rule.maleExtra, yearGodVi, 'day', clamp(conf)));
    }
    if (rule.extra) {
      events.push(extraEvent('god-extra', rule.extra, yearGodVi, primaryPillar(yearGod), clamp(conf)));
    }
  }

  // ---- Sự việc phát sinh từ 刑冲合害 vs từng trụ (AI/VÙNG bị dẫn động) ----
  for (const [pillarKey, hits] of Object.entries(pillarHits)) {
    const who = PILLAR_WHO[pillarKey];
    for (const hit of hits) {
      const meta = INTERACTION_LABEL[hit];
      let detail = '';
      let tone = meta.tone;
      // Hợp với trụ cụ thể: có thể "lưu lại" (cát) hoặc "trói" (hung tuỳ sao)
      if (hit === 'he') {
        // Hợp năm trụ ngày (ngày = bản thân/phối ngẫu) → dễ kết hôn / dính tình cảm
        if (pillarKey === 'day') {
          detail = `Lưu niên HỢP Nhật Trụ → ${who.vi} bị "kéo dính": hôn nhân / tình cảm chủ động (cát nếu đang muốn kết hôn, kỵ nếu đã có gia đình).`;
          tone = 'mixed';
        } else if (pillarKey === 'month') {
          detail = `Lưu niên HỢP Nguyệt Trụ → ${who.vi} / sự nghiệp có sự "lưu giữ": công việc / cha mẹ có biến (thường dính líu hợp đồng / giữ chân).`;
          tone = 'mixed';
        } else {
          detail = `Lưu niên HỢP ${pillarNameVi(pillarKey)} Trụ → ${who.vi} bị dẫn động (dính líu, lưu lại).`;
        }
      } else if (hit === 'chong') {
        if (pillarKey === 'day') {
          detail = `⚡ Lưu niên XUNG Nhật Trụ → ${who.vi} ĐẠI biến: hôn nhân biến động / sức khoẻ bản thân / chuyển nhà. (日支冲太岁 — năm xung配偶宫)`;
          tone = 'hung';
        } else if (pillarKey === 'month') {
          detail = `⚡ Lưu niên XUNG Nguyệt Trụ → ${who.vi} / sự nghiệp biến động: đổi việc / chuyển nhà / cha mẹ có sự.`;
          tone = 'hung';
        } else if (pillarKey === 'year') {
          detail = `⚡ Lưu niên XUNG Niên Trụ → ${who.vi}: biến động gốc gác / tổ bối / chuyển vùng.`;
          tone = 'hung';
        } else {
          detail = `⚡ Lưu niên XUNG Thời Trụ → ${who.vi}: con cái / cấp dưới có biến.`;
          tone = 'hung';
        }
      } else if (hit === 'xing') {
        if (pillarKey === 'time') {
          detail = `⚖ Lưu niên HÌNH Thời Trụ → ${who.vi}: vấn đề con cái / cấp dưới / thị phi muộn.`;
        } else if (pillarKey === 'day') {
          detail = `⚖ Lưu niên HÌNH Nhật Trụ → ${who.vi}: quan phi / thị phi liên quan bản thân - phối ngẫu.`;
        } else {
          detail = `⚖ Lưu niên HÌNH ${pillarNameVi(pillarKey)} Trụ → ${who.vi}: quan phi / thị phi.`;
        }
        tone = 'hung';
      } else if (hit === 'hai') {
        detail = `🐍 Lưu niên HẠI ${pillarNameVi(pillarKey)} Trụ → ${who.vi}: tiểu nhân ngầm / hao tốn không rõ nguyên nhân.`;
        tone = 'hung';
      }

      events.push({
        type: `pillar-${hit}`,
        vi: meta.vi,
        who: who.short,
        whoFull: who.vi,
        pillar: pillarKey,
        tone,
        confidence: clamp(0.5 + meta.dConf),
        detail,
        source: '三命通会「流年引动六亲宫位」',
      });
    }
  }

  // ---- Sắp xếp: hung优先 + confidence giảm ----
  events.sort((a, b) => {
    const ta = a.tone === 'hung' ? 0 : a.tone === 'mixed' ? 1 : 2;
    const tb = b.tone === 'hung' ? 0 : b.tone === 'mixed' ? 1 : 2;
    if (ta !== tb) return ta - tb;
    return b.confidence - a.confidence;
  });

  // ---- Tóm tắt 1 câu ----
  const topCat = events.find((e) => e.tone === 'cat');
  const topHung = events.find((e) => e.tone === 'hung');
  const bits = [];
  bits.push(`Năm ${year} ${yGan}${yZhi}: sao năm ${yearGodVi} (${bodyStrong ? 'thân vượng' : 'thân nhược'}).`);
  if (topCat) bits.push(`Cát: ${topCat.vi} (${topCat.who}).`);
  if (topHung) bits.push(`Kỵ: ${topHung.vi} (${topHung.who}).`);
  const nPillarHits = Object.keys(pillarHits).length;
  if (nPillarHits) {
    const where = Object.entries(pillarHits).map(([k, v]) => `${pillarNameVi(k)}(${v.map(cap).join('')})`).join(', ');
    bits.push(`Trụ bị dẫn động: ${where}.`);
  } else {
    bits.push('Không xung/hình/hại/hợp trực tiếp với tứ trụ → sự việc êm ả hơn.');
  }
  const summary = bits.join(' ');

  return {
    year,
    ganZhi: yGan + yZhi,
    yearGod,
    yearGodVi,
    bodyStrong,
    shaZhiHua,
    pillarHits,
    events,
    summary,
  };
}

// ---- helpers ----
function clamp(x) { return Math.max(0.05, Math.min(0.95, x)); }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function pillarNameVi(k) { return ({ year: 'Niên', month: 'Nguyệt', day: 'Nhật', time: 'Thời' })[k] || k; }
function primaryWho(god, R) {
  // Sao năm chủ động vào ai (mặc định)
  switch (god) {
    case '正官': case '七殺': return 'Sự nghiệp / bản thân';
    case '正財': case '偏財': return 'Tài lộc / bản thân';
    case '正印': case '偏印': return 'Học vấn / bản thân';
    case '食神': case '傷官': return 'Sáng tạo / bản thân';
    case '比肩': case '劫財': return 'Anh em / bạn bè';
    default: return 'Bản thân';
  }
}
function primaryPillar(god) {
  switch (god) {
    case '正官': case '七殺': return 'month'; // quan tinh → sự nghiệp / phu (nữ) nguyệt
    case '正財': case '偏財': return 'day';   // tài tinh → thê (nam) nhật chi
    case '正印': case '偏印': return 'month'; // Ấn → mẫu (nguyệt)
    case '食神': case '傷官': return 'time';  // thực thương → tử nữ (thời)
    case '比肩': case '劫財': return 'month'; // tỷ kiếp → huynh đệ (nguyệt)
    default: return 'day';
  }
}
function extraEvent(type, text, yearGodVi, pillar, conf) {
  return {
    type,
    vi: text,
    who: 'Lục thân',
    pillar,
    tone: 'mixed',
    confidence: conf,
    detail: text,
    source: '渊海子平「十神应期 · 六亲引动」',
  };
}
