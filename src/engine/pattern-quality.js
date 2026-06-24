// ============================================================================
//  CÁCH CỤC THÀNH BẠI CỨU ỨNG (格局成败救应) — 子平真詮 chương 9
//
//  Nguyên lý cổ pháp (trích 子平真詮 · 论用神成败救应, 沈孝瞻 Thanh):
//    "用神专寻月令，以四柱配之，必有成败。"
//    "成中有败，必是带忌；败中有成，全凭救应。"
//    "八字妙用，全在成败救应，其中权轻权重，甚是活泼。"
//
//  Trong 子平真詮, Dụng Thần = 格 thần (cái sao định cách, lấy ở Nguyệt Lệnh).
//  - THÀNH (成格): sao chủ cách THẤU can + CÓ GỐC (thông căn) + KHÔNG bị khắc
//    phá + CÓ TÌNH (có phần tử sinh trợ/che chở phù hợp với cách đó).
//  - BẠI (败格/破格): sao chủ cách bị KHẮC / HỢP mất / RƠI KHÔNG VONG / VÔ GỐC
//    (hư phù), HOẶC gặp phải "kỵ thần đặc trưng" của cách đó (vd Chính Quan gặp
//    Thương Quan khắc phá; Thực Thần gặp Kiêu Thần đoạt thực).
//  - CỨU ỨNG (救应): một cách BẠI vẫn được CỨU nếu xuất hiện phần tử bù trừ
//    (vd Thương Quan khắc Quan → có Ấn chế Thương Quan → Quan được cứu).
//
//  Một lá số đi qua 4 trạng thái:
//    成格  = cách thành nguyên vẹn (không có bệnh, hoặc chỉ có kỵ nhẹ đã được hóa).
//    有救  = có bệnh VÀ có thuốc cứu ứng (败中有成) → vẫn dùng được, nhưng phức tạp.
//    败格  = có bệnh MÀ KHÔNG có thuốc cứu → cách vỡ, mệnh hạ tầng.
//  (Trường hợp cách đặc biệt / luyue không có geShen cụ thể → trả về null-ish,
//   ta vẫn báo nhưng không ép chấm thành/bại theo 8 chính cách.)
//
//  Nguồn tham khảo:
//   - 沈孝瞻《子平真詮》原文第九篇 (suanzhun.net/book/278.html).
//   - 徐乐吾《子平真詮评注》— các lá số ví dụ (雍正, 史量才, 陈立夫, 海瑞, 张勋, 陆九渊).
// ============================================================================

import { GAN, ZHI, HIDDEN, SHENG, KE, KE_BY, SHENG_BY } from './constants.js';
import { tenGod, godGroup } from './core.js';
import { analyzeKongwang } from './kongwang.js';

// --- Bộ 5 nhóm Thập thần của Nhật Chủ ---
const GROUP_WX = (dmWx) => ({
  ti: dmWx,
  yin: SHENG_BY[dmWx],
  shi: SHENG[dmWx],
  cai: KE[dmWx],
  guan: KE_BY[dmWx],
});
const GROUP_VI = { ti: 'Tỷ Kiếp', yin: 'Ấn', shi: 'Thực Thương', cai: 'Tài', guan: 'Quan Sát' };
const wxVi = (w) => ({ 木: 'Mộc', 火: 'Hỏa', 土: 'Thổ', 金: 'Kim', 水: 'Thủy' }[w] || w);

// Bảng thành/bại/cứu ĐẶC TRƯNG cho 8 chính cách + luyue.
//   Cấu trúc mỗi mục:
//     cheng:  [ {need:[nhóm cần có], mode:'any'|'all', note} ]  — điều kiện THÀNH
//     bai:    [ {killer:[nhóm gây bại], via:'ke'|'he'|'kong'|'xoroot', note} ]
//     jiu:    [ {when:{killer}, drug:[nhóm cứu], note} ]          — cứu ứng cho từng bệnh
//   'ke'    = nhóm killer khắc/chế phần tử chủ cách.
//   'he'    = nhóm chủ cách bị HỢP mất (can/chi hợp hóa ra hành khác).
//   'kong'  = tàng can chủ cách rơi không vong.
//   'xoroot'= nhóm "đoạt" đặc trưng (Kiêu đoạt Thực, Tỷ đoạt Tài…).
const GE_RULES = {
  // 正官格 — 喜财印, 忌伤官/七杀混杂/刑冲破害
  正官格: {
    cheng: [
      { need: ['cai', 'yin'], mode: 'any', note: 'Quan gặp Tài (sinh quan) hoặc Ấn (hộ quan) → hữu tình, cách thành.' },
    ],
    bai: [
      // Chỉ 傷官 khắc Chính Quan (食神 lành, không tính) → 子平真诠 "官逢伤克"
      { killer: ['shi'], god: '傷官', via: 'ke', note: 'Thương Quan khắc phá Chính Quan → 败 (官逢伤克).' },
      // Chỉ 七殺 hỗn (chính quan vốn làDM cách, không tự hỗn chính nó)
      { killer: ['guan'], god: '七殺', via: 'mix', note: 'Thất Sát hỗn tạp với Chính Quan → 败 (官杀混杂).' },
      { killer: [], via: 'chong', note: 'Nguyệt chi (cung quan) bị hình/xung phá hại → quan bị tổn.' },
    ],
    jiu: [
      { when: { killer: ['shi'], god: '傷官' }, drug: ['yin'], note: 'Quan bị Thương khắc, nhưng có Ấn chế Thương Quan → Quan được cứu (透印解伤).' },
      { when: { killer: ['guan'], god: '七殺' }, drug: ['ti'], note: 'Quan bị Sát hỗn, nhưng có Tỷ/Kiếp (hoặc Thương) hợp Sát → 清格 (合杀留官).' },
      { when: { via: 'chong' }, drug: [], note: 'Quan cung bị xung nhưng có Hội/Hợp giải xung → giải.' },
    ],
  },
  // 七殺格 — 喜食制杀/印化杀, 忌财党杀
  七殺格: {
    cheng: [
      { need: ['shi'], mode: 'any', note: 'Sát gặp Thực Thần chế ngự → cách thành (食神制杀).' },
      { need: ['yin'], mode: 'any', note: 'Sát gặp Ấn hóa sát sinh thân → cách thành (杀印相生).' },
    ],
    bai: [
      { killer: ['cai'], via: 'dang', note: 'Tài đảng Sát (Tài sinh Sát) mà KHÔNG có Thực/Ấn chế → Sát vô chế, 败 (七煞逢财无制).' },
      { killer: ['yin'], god: '偏印', via: 'duo', note: 'Thực thần chế Sát nhưng lại bị Kiêu (偏印) đoạt thực → mất chế.' },
    ],
    jiu: [
      { when: { killer: ['cai'] }, drug: ['shi'], note: 'Tài đảng Sát nhưng có Thực Thần chế Sát sinh Tài → cứu (食制杀以生财).' },
      { when: { killer: ['cai'] }, drug: ['ti'], note: 'Tài đảng Sát nhưng có Tỷ/Kiếp hợp Sát (hoặc khắc Tài) → lưu tài/hợp sát存.' },
      { when: { killer: ['yin'], god: '偏印' }, drug: ['cai'], note: 'Kiêu đoạt thực (mất chế Sát) nhưng có Tài phá Kiêu → khôi phục thực.' },
    ],
  },
  // 正財格 / 偏財格 — 喜食伤生财/官星护财, 忌比劫夺财
  正財格: caiRules(),
  偏財格: caiRules(),
  // 正印格 — 喜官杀生印, 忌财破印
  正印格: {
    cheng: [
      { need: ['guan'], mode: 'any', note: 'Ấn gặp Quan/Sát sinh Ấn → cách thành (官印相生).' },
    ],
    bai: [
      { killer: ['cai'], via: 'ke', note: 'Tài khắc phá Ấn (印轻逢财) → 败.' },
      { killer: ['guan'], via: 'dang', note: 'Thân vượng + Ấn nặng mà lại gặp Sát → quá phù, 败.' },
    ],
    jiu: [
      { when: { killer: ['cai'] }, drug: ['ti'], note: 'Ấn bị Tài phá nhưng có Tỷ/Kiếp chế Tài (hoặc hợp Tài) → Ấn được cứu (劫财以解之/合财存印).' },
    ],
  },
  // 偏印格 (Kiêu Thần) — nghịch dụng, cần Tài chế Kiêu; kỵ Kiêu đoạt Thực (khi có Thực)
  偏印格: {
    cheng: [
      { need: ['cai'], mode: 'any', note: 'Kiêu gặp Tài chế ngự → cách thành (偏印用财).' },
      { need: ['guan'], mode: 'any', note: 'Kiêu gặp Sát hóa Kiêu sinh thân → thành (杀印相生).' },
    ],
    bai: [
      { killer: ['shi'], god: '食神', via: 'duo', note: 'Kiêu đoạt Thực (枭神夺食) khi trong cục có Thực Thần → 败 nặng.' },
      { killer: ['cai'], via: 'ke', note: 'Tài phá Kiêu khi không cần phá → nghịch.' },
    ],
    jiu: [
      { when: { killer: ['shi'] }, drug: ['cai'], note: 'Kiêu đoạt thực nhưng có Tài chế Kiêu → bảo vệ Thực Thần.' },
    ],
  },
  // 食神格 — 喜身旺/财, 忌枭神夺食 (chỉ 偏印 mới đoạt, 正印 không)
  食神格: {
    cheng: [
      { need: ['cai'], mode: 'any', note: 'Thực sinh Tài → cách thành (食神生财).' },
      { need: ['guan'], mode: 'any', note: 'Thực đi với Quan tinh hộ vệ → thành.' },
    ],
    bai: [
      { killer: ['yin'], god: '偏印', via: 'duo', note: 'Kiêu Thần (Thiên Ấn/偏印) đoạt Thực (枭神夺食) → 败 nặng.' },
      { killer: ['guan'], via: 'dang', note: 'Thực sinh Tài nhưng lại lộ Sát → Tài quay dưỡng Sát (生财露杀) → 败.' },
    ],
    jiu: [
      { when: { killer: ['yin'], god: '偏印' }, drug: ['cai'], note: 'Kiêu đoạt thực nhưng có Tài chế Kiêu → khôi phục Thực Thần.' },
      { when: { killer: ['yin'], god: '偏印' }, drug: ['guan'], note: 'Bỏ Thực dùng Sát (có Ấn hóa) → đổi cách thành.' },
    ],
  },
  // 傷官格 — 喜财/印 (伤官生财 / 伤官佩印), 忌官 (伤官见官) — trừ kim thủy thương
  傷官格: {
    cheng: [
      { need: ['cai'], mode: 'any', note: 'Thương sinh Tài → cách thành (伤官生财).' },
      { need: ['yin'], mode: 'any', note: 'Thương phối Ấn (Ấn chế Thương) → cách thành (伤官佩印).' },
    ],
    bai: [
      // 傷官見官: chỉ Chính Quan mới phạm (子平真詮 "伤官见官") — trừ kim/thủy thương quan (điều hàn).
      { killer: ['guan'], god: '正官', via: 'ke',
        except: (chart, pat) => {
          const dmWx = GAN[chart.dayGan].wx;
          return dmWx === '金' || dmWx === '水'; // kim/thủy thương quan kiến quan vị điều hàn → không phạm
        },
        note: 'Thương Quan kiến Chính Quan → 败 (伤官见官, sinh tai họa) — trừ kim/thủy thương quan (điều hàn).' },
      { killer: ['guan'], god: '七殺', via: 'dang', note: 'Thương sinh Tài nhưng lại mang Sát (生财带杀) → 败.' },
    ],
    jiu: [
      { when: { killer: ['guan'], god: '正官' }, drug: ['yin'], note: 'Thương kiến quan nhưng có Ấn chế Thương → giải.' },
    ],
  },
  // 建祿格 / 月劫格 / 羊刃格 — nguyệt lệnh là Tỷ/Kiếp; Dụng lấy ở Tài/Quan/Thực.
  建祿格: luYueRules(),
  月劫格: luYueRules(),
  羊刃格: luYueRules(),
};

function caiRules() {
  return {
    cheng: [
      { need: ['shi'], mode: 'any', note: 'Tài gặp Thực Thương sinh Tài → cách thành (食伤生财).' },
      { need: ['guan'], mode: 'any', note: 'Tài gặp Quan tinh hộ vệ → cách thành (财逢官护).' },
    ],
    bai: [
      { killer: ['ti'], via: 'xoroot', note: 'Tỷ/Kiếp đoạt Tài (财轻比重) → 败.' },
      { killer: ['guan'], via: 'dang', note: 'Tài lại sinh Sát (财透七杀) → Tài thành nuôi Sát, 败.' },
    ],
    jiu: [
      { when: { killer: ['ti'] }, drug: ['shi'], note: 'Tỷ Kiếp đoạt Tài nhưng có Thực Thần hóa Kiếp sinh Tài → cứu (透食以化之).' },
      { when: { killer: ['ti'] }, drug: ['guan'], note: 'Tỷ Kiếp đoạt Tài nhưng có Quan tinh chế Kiếp → cứu (生官以制之).' },
      { when: { killer: ['guan'] }, drug: ['shi'], note: 'Tài đảng Sát nhưng có Thực chế Sát sinh Tài → cứu (食神制杀以生财).' },
      { when: { killer: ['guan'] }, drug: ['ti'], note: 'Tài đảng Sát nhưng có Tỷ/Kiếp hợp Sát → cứu (合杀存财).' },
    ],
  };
}
function luYueRules() {
  return {
    cheng: [
      { need: ['guan', 'cai'], mode: 'any', note: 'Nguyệt lệnh Tỷ/Kiếp, lấy Quan chế + Tài thoát (thấu Quan + Tài/Ấn phù) → cách thành.' },
      { need: ['cai', 'shi'], mode: 'any', note: 'Thấu Tài + Thực Thương sinh Tài → thành.' },
      { need: ['guan', 'shi'], mode: 'any', note: 'Thấu Sát + có chế phục (Thực/Ấn) → thành.' },
    ],
    bai: [
      { killer: [], via: 'noyong', note: 'Nguyệt lương nguyệt kiếp mà KHÔNG có Tài/Quan, lại thấu Sát + Ấn → quá phù, 败.' },
      { killer: ['shi'], via: 'ke', note: 'Dụng Quan nhưng Thương Quan khắc Quan → 败.' },
    ],
    jiu: [
      { when: { killer: ['shi'] }, drug: ['ti', 'yin'], note: 'Dụng Quan bị Thương khắc, nhưng có Tỷ/Kiếp HỢP Thương (hoặc Ấn chế Thương) → Quan được cứu.' },
      { when: { killer: ['guan'] }, drug: ['ti'], note: 'Dụng Tài mang Sát nhưng Tỷ/Kiếp hợp Sát → cứu.' },
    ],
  };
}

// --------------------------------------------------------------------------
//  Phát hiện nhóm Thập thần nào CÓ MẶT (thấu can) + thông căn ở tàng chi.
//  Trả về:
//    groups: { ti:{reveal:[can...], root:[chi...]}, yin:{...}, shi, cai, guan }
// --------------------------------------------------------------------------
function scanGroups(chart) {
  const dg = chart.dayGan;
  const dmWx = GAN[dg].wx;
  const G = GROUP_WX(dmWx);
  const out = { ti: { reveal: [], root: [], gods: new Set() }, yin: { reveal: [], root: [], gods: new Set() },
    shi: { reveal: [], root: [], gods: new Set() }, cai: { reveal: [], root: [], gods: new Set() },
    guan: { reveal: [], root: [], gods: new Set() } };
  // Thấu can (can năm/tháng/giờ; can ngày = Nhật Chủ bỏ qua)
  for (const k of ['year', 'month', 'time']) {
    const g = chart.pillars[k].gan;
    const god = tenGod(dg, g);
    const grp = godGroup(god);
    if (out[grp]) { out[grp].reveal.push(g); out[grp].gods.add(god); }
  }
  // Thông căn (tàng can của 4 chi, trừ chính nhật chi là DM mặc định)
  for (const k of ['year', 'month', 'day', 'time']) {
    const zhi = chart.pillars[k].zhi;
    for (const h of HIDDEN[zhi]) {
      if (k === 'day' && h === dg) continue; // DM tàng ở nhật chi không tính
      const god = tenGod(dg, h);
      const grp = godGroup(god);
      if (out[grp]) { out[grp].root.push(zhi); out[grp].gods.add(god); }
    }
  }
  return out;
}

const hasGroup = (groups, grp) => groups[grp].reveal.length > 0 || groups[grp].root.length > 0;
// Nhóm hiện diện VÀ có chứa một thập thần cụ thể (vd shi nhóm + 伤官 cụ thể).
const hasGodInGroup = (groups, grp, god) => groups[grp] && groups[grp].gods.has(god);

// --------------------------------------------------------------------------
//  Kiểm 格 thần (sao chủ cách) có thấu + thông căn + không vong không.
// --------------------------------------------------------------------------
function geStarStatus(chart, pattern) {
  const ge = pattern.geShen;
  if (!ge || !ge.gan) return { exists: false };
  const dg = chart.dayGan;
  const geGan = ge.gan;
  // Thấu can (có mặt ở can nào trong năm/tháng/giờ)
  const reveal = ['year', 'month', 'time'].filter((k) => chart.pillars[k].gan === geGan);
  const transparent = reveal.length > 0;
  // Thông căn — tàng can geGan xuất hiện ở một chi nào đó
  const rootChi = [];
  for (const k of ['year', 'month', 'day', 'time']) {
    const zhi = chart.pillars[k].zhi;
    if (HIDDEN[zhi].includes(geGan)) rootChi.push(zhi);
  }
  const rooted = rootChi.length > 0;
  // Không vong: chi có chứa geGan tàng có rơi không vong không
  const kw = analyzeKongwang(chart);
  const geInKong = rootChi.some((z) => kw.kong.includes(z));
  return { exists: true, geGan, transparent, reveal, rooted, rootChi, geInKong, kw };
}

// --------------------------------------------------------------------------
//  Kiểm geGan có bị HỢP MẤT không (can hợp hóa ra hành khác → sao biến chất).
// --------------------------------------------------------------------------
// Thiên can ngũ hợp → hóa khí (tra 2 chiều)
const HE_MAP = {
  甲己: '土', 己甲: '土', 乙庚: '金', 庚乙: '金', 丙辛: '水', 辛丙: '水',
  丁壬: '木', 壬丁: '木', 戊癸: '火', 癸戊: '火',
};

function geStarCombined(chart, pattern) {
  const ge = pattern.geShen;
  if (!ge || !ge.gan) return null;
  const geGan = ge.gan;
  for (const k of ['year', 'month', 'time']) {
    const other = chart.pillars[k].gan;
    if (other === geGan) continue;
    const hua = HE_MAP[geGan + other];
    if (hua) {
      return { geGan, partner: other, hua, note: `格 thần ${geGan} bị ${other} ngũ hợp hóa hành ${hua} → cách bị khuyết (dụng thần bị hợp đi).` };
    }
  }
  return null;
}

// --------------------------------------------------------------------------
//  Xét một quy tắc bại (bai entry) cho cách: trả về {hit, detail} hoặc null.
// --------------------------------------------------------------------------
function evalBai(rule, groups, chart, pattern, ge) {
  const via = rule.via;
  // 1.Ke/clash/mix/dang/duo/xoroot → dựa vào nhóm killer hiện diện
  if (['ke', 'mix', 'dang', 'duo', 'xoroot'].includes(via)) {
    // Ngoại lệ cổ pháp (rule.except): vd kim/thủy thương quan 见官 không phạm.
    if (rule.except && rule.except(chart, pattern)) return null;
    // Hỗ trợ lọc theo thập thần cụ thể (rule.god) — vd 正官格 chỉ "伤官" khắc, không tính 食神.
    let present;
    if (rule.god) {
      present = rule.killer.filter((g) => hasGodInGroup(groups, g, rule.god));
    } else {
      present = rule.killer.filter((g) => hasGroup(groups, g));
    }
    if (present.length === 0) return null;
    return { hit: true, via, killers: present, god: rule.god || null, note: rule.note };
  }
  // 2. chong → nguyệt chi hoặc chi cung cách bị xung/hình/hại
  if (via === 'chong') {
    const monthZhi = chart.monthZhi;
    const ix = chart.interactions || {};
    const hit = (ix.chong || []).some((c) => c.a === monthZhi || c.b === monthZhi)
             || (ix.xing || []).some((c) => c.a === monthZhi || c.b === monthZhi)
             || (ix.hai || []).some((c) => c.a === monthZhi || c.b === monthZhi);
    return hit ? { hit: true, via, killers: [], note: rule.note } : null;
  }
  // 3. noyong → nguyệt lương/kiếp mà KHÔNG có Tài + KHÔNG có Quan (chỉ Sát+Ấn)
  if (via === 'noyong') {
    const noCai = !hasGroup(groups, 'cai');
    const noGuan = !hasGroup(groups, 'guan');
    return (noCai && noGuan) ? { hit: true, via, killers: [], note: rule.note } : null;
  }
  return null;
}

// --------------------------------------------------------------------------
//  Xét cứu ứng cho một bệnh bại: trả về rescuer info hoặc null.
//  Bệnh khớp cứu ứng khi:
//    - cùng nhóm killer (when.killer ⊆ disease.killers), HOẶC
//    - cùng via (when.via === disease.via)
// --------------------------------------------------------------------------
function evalJiu(jiu, disease, groups, chart, pattern) {
  const when = jiu.when || {};
  const killerMatch = when.killer && when.killer.length
    && when.killer.every((g) => (disease.killers || []).includes(g));
  const viaMatch = when.via && disease.via === when.via;
  if (!killerMatch && !viaMatch) return null;
  // Lọc thập thần cụ thể nếu quy tắc yêu cầu (vd chỉ khớp khi bệnh chính xác là 傷官)
  if (when.god && disease.god !== when.god) return null;
  const drugPresent = (jiu.drug || []).filter((g) => hasGroup(groups, g));
  if (drugPresent.length === 0) return null;
  return { drug: drugPresent, note: jiu.note };
}

// ===========================================================================
//  HÀM CHÍNH — patternQuality(R)
//  Trả về:
//    { quality:'成格'|'有救'|'败格'|'特殊', keyStar, transparent, rooted, broken,
//      rescued, diseases:[], rescues:[], patternYong:{xi:[],ji:[]}, summary }
// ===========================================================================
export function patternQuality(R) {
  const { chart, pattern, strength, interactions } = R;
  const dg = chart.dayGan;

  // Cách đặc biệt → không chấm thành/bại theo 8 chính cách
  if (pattern.type === 'special') {
    return specialVerdict(pattern, chart);
  }

  // luyue (Kiến Lộc/Nguyệt Kiếp/Dương Nhận) → vẫn có luật riêng trong GE_RULES
  const rules = GE_RULES[pattern.name];
  if (!rules) {
    return { quality: '未知', summary: `Không có luật thành/bại cho cách ${pattern.name}.` };
  }

  const groups = scanGroups(chart);
  const ge = geStarStatus(chart, pattern);
  const combinedAway = geStarCombined(chart, pattern);

  // ----- Lớp 1: THÀNH (cơ bản) -----
  //  (a) geGan thấu can + thông căn + không bị hợp mất + không rơi không vong
  let broken = false;
  const diseases = [];
  if (ge.exists) {
    if (!ge.transparent) {
      // ẩn hết trong tàng → vẫn có thể là cách ẩn, nhưng lực kém; không coi là bại
    }
    if (!ge.rooted) {
      broken = true;
      diseases.push({ via: 'noroot', killers: [], note: `格 thần (${ge.geGan}) hư phù — không thông căn tàng chi, lực cách yếu.` });
    }
    if (ge.geInKong) {
      broken = true;
      diseases.push({ via: 'kong', killers: [], note: `Tàng cung của 格 thần rơi Không Vong (${ge.kw.kong.join(',')}) — cách bị treo, đợi vận thực.` });
    }
    if (combinedAway) {
      broken = true;
      diseases.push({ via: 'he', killers: [], note: combinedAway.note });
    }
  }

  // ----- Lớp 2: quy tắc bại đặc trưng của từng cách -----
  for (const rule of rules.bai) {
    const d = evalBai(rule, groups, chart, pattern, ge);
    if (d && d.hit) {
      broken = true;
      diseases.push(d);
    }
  }

  // ----- Lớp 3: cứu ứng -----
  const rescues = [];
  for (const disease of diseases) {
    for (const jiu of rules.jiu || []) {
      const r = evalJiu(jiu, disease, groups, chart, pattern);
      if (r) { rescues.push({ diseaseVia: disease.via, diseaseNote: disease.note, ...r }); break; }
    }
  }

  // ----- Chấm tổng thể -----
  //  - không bệnh → 成格
  //  - có bệnh, mọi bệnh đều được cứu → 有救 (败中有成)
  //  - có bệnh chưa được cứu (hoặc chỉ cứu một phần) → 败格
  let quality;
  const allRescued = diseases.length > 0 && diseases.every((d) =>
    rescues.some((r) => r.diseaseVia === d.via && r.diseaseNote === d.note));
  if (diseases.length === 0) {
    quality = '成格';
  } else if (allRescued) {
    quality = '有救';
  } else {
    quality = '败格';
  }

  // ----- 用神 喜忌 đặc trưng của cách (theo PATTERN_PREF, dịch sang HÀNH) -----
  const dmWx = GAN[dg].wx;
  const G = GROUP_WX(dmWx);
  const pref = pattern.pref || {};
  const patternYong = {
    xi: (pref.xi || []).map((g) => ({ group: g, wx: G[g], vi: GROUP_VI[g] })),
    ji: (pref.ji || []).map((g) => ({ group: g, wx: G[g], vi: GROUP_VI[g] })),
    yong: (pref.yong || []).map((g) => ({ group: g, wx: G[g], vi: GROUP_VI[g] })),
    note: pref.note || '',
  };

  // ----- Tóm tắt lời văn -----
  const keyStar = ge.exists ? {
    gan: ge.geGan,
    god: pattern.geShen.god,
    wx: pattern.geShen.wx,
    transparent: ge.transparent,
    reveal: ge.reveal,
    rooted: ge.rooted,
    rootChi: ge.rootChi,
    inKong: ge.geInKong,
  } : null;

  const summary = buildSummary(quality, pattern, keyStar, diseases, rescues, patternYong);

  return {
    quality,
    keyStar,
    transparent: ge.exists ? ge.transparent : null,
    rooted: ge.exists ? ge.rooted : null,
    broken,
    rescued: rescues.length > 0,
    diseases,
    rescues,
    patternYong,
    summary,
  };
}

function buildSummary(quality, pattern, keyStar, diseases, rescues, py) {
  const qVi = { 成格: 'Thành cách (cách cục nguyên vẹn)', 有救: 'Có cứu ứng (bại trung hữu thành)', 败格: 'Bại cách (cách vỡ, cần vận bổ)', 特殊: 'Cách đặc biệt (thuận thế, luận riêng)' }[quality] || quality;
  const parts = [];
  parts.push(`【格局成败】 ${pattern.vi} → ${qVi}.`);
  if (keyStar) {
    parts.push(`格 thần ${keyStar.gan} (${keyStar.god}): ${keyStar.transparent ? 'thấu cán (' + keyStar.reveal.join(',') + ')' : 'ẩn tàng'}, ${keyStar.rooted ? 'thông căn (' + keyStar.rootChi.join(',') + ')' : 'hư phù'}${keyStar.inKong ? ', rơi Không Vong' : ''}.`);
  }
  if (diseases.length) {
    parts.push('Bệnh: ' + diseases.map((d) => d.note).join('; '));
  }
  if (rescues.length) {
    parts.push('Cứu: ' + rescues.map((r) => r.note).join('; '));
  }
  if (py.note) {
    const xi = py.xi.map((x) => x.vi).join('/');
    const ji = py.ji.map((x) => x.vi).join('/');
    parts.push(`Cách ${pattern.vi} ưa ${xi || '(—)'}, kỵ ${ji || '(—)'}.`);
  }
  return parts.join(' ');
}

function specialVerdict(pattern, chart) {
  return {
    quality: '特殊',
    keyStar: null,
    transparent: null,
    rooted: null,
    broken: false,
    rescued: false,
    diseases: [],
    rescues: [],
    patternYong: { xi: [], ji: [], yong: [], note: pattern.note || '' },
    summary: `【格局成败】 ${pattern.vi} — Cách đặc biệt (thuận thế), không luận thành/bại theo 8 chính cách; xét vỡ khi bị vận khắc phá thế cục.`,
  };
}

// ===========================================================================
//  ĐẠI VẬN 喜忌 THEO CÁCH CỤC (格局大运喜忌) — 子平真詮 chương 10–11
//
//  Nguyên lý cổ pháp (trích 子平真詮 · 论行运):
//    "行运之阴阳有别，取用之喜忌相同。"
//    "何以为之喜？用神之相神是也；何以为之忌？伤用破格是也。"
//  → Vận tốt/xấu KHÔNG chỉ do hành có lợi cho thân, mà còn do THẬP THẦN
//    của vận đó CÓ SINH TRỢ dùng thần (喜) hay KHẮC PHÁ dùng thần (忌).
//
//  Mỗi cách có thập thần vận ưa/kỵ đặc trưng (theo 子平真詮 ch.10-11):
//    正官格: 喜 財(財生官)/印(印護官); 忌 傷官(傷克官)/七殺(殺混官)
//    七殺格: 喜 食神(食制殺)/印(印化殺); 忌 財(財黨殺)
//    食神格: 喜 財(食生財)/官(食帶官); 忌 偏印(梟奪食)
//    傷官格: 喜 財(傷生財)/印(傷佩印); 忌 正官(傷官見官)
//    正/偏財格: 喜 食傷(食傷生財)/官(官護財); 忌 比劫(比劫奪財)
//    正/偏印格: 喜 官殺(殺印相生); 忌 財(財壞印)
//    建祿/月劫/羊刃: 喜 財官; 忌 比劫
//
//  Việc này LẤY patternYong (đã tính sẵn trong patternQuality) — patternYong.xi
//  và patternYong.ji chứa các NHÓM THẬP THẦN (ti/yin/shi/cai/guan) đặc trưng.
//  Thang điểm: +2 cho vận can thuộc nhóm "喜", −2 cho nhóm "忌" (bằng đúng biên độ
//  fav/avoid ngũ hành trong computeDaYun → cộng tầng 格局 LÊN TRÊN tầng ngũ hành,
//  KHÔNG thay thế tầng ngũ hành).
// ===========================================================================

/**
 * Điều chỉnh điểm mỗi Đại vận theo 喜忌 đặc trưng của 格局 (子平真詮 ch.10-11).
 *
 * @param {Array}  dayun          — mảng kết quả computeDaYun (mỗi ptử có gan/ganGod/score/rating…)
 * @param {object} patternQuality — kết quả patternQuality(R) (chứa patternYong.{xi,ji})
 * @param {string} dayGan         — Thiên can Nhật Chủ
 * @returns {Array} mảng dayun MỚI (clone), mỗi ptử thêm gejuDelta + gejuNote + score đã cộng.
 */
export function adjustDayunByGeju(dayun, patternQuality, dayGan) {
  if (!Array.isArray(dayun) || !patternQuality || !dayGan) return dayun || [];
  const py = patternQuality.patternYong;
  if (!py) return dayun.map((d) => ({ ...d, gejuDelta: 0, gejuNote: '' }));

  // Tập nhóm ưa/kỵ của cách (ti/yin/shi/cai/guan).
  const xiGroups = new Set((py.xi || []).map((x) => x.group));
  const jiGroups = new Set((py.ji || []).map((x) => x.group));
  if (xiGroups.size === 0 && jiGroups.size === 0) {
    return dayun.map((d) => ({ ...d, gejuDelta: 0, gejuNote: '' }));
  }

  const geName = patternQuality.keyStar ? patternQuality.keyStar.god : '';
  const out = [];
  for (const d of dayun) {
    const nd = { ...d };
    // Dùng thập thần của vận CAN (chính khí của vận). ganGod đã được computeDaYun tính sẵn.
    const god = d.ganGod;
    const grp = godGroup(god);
    let delta = 0;
    let note = '';
    if (grp && xiGroups.has(grp)) {
      delta = 2;
      note = `Vận ${god} (${GROUP_VI[grp]}) là ${geName ? GROUP_VI[grp] + ' sinh trợ格' : 'hỷ của cách'} → 格局喜 (+2)`;
    } else if (grp && jiGroups.has(grp)) {
      delta = -2;
      note = `Vận ${god} (${GROUP_VI[grp]}) khắc phá/cản trở格 → 格局忌 (−2)`;
    }
    nd.gejuDelta = delta;
    nd.gejuNote = note;
    nd.score = (d.score || 0) + delta;
    // Đánh lại rating sau cộng tầng 格局 (giữ nguyên ngưỡng computeDaYun).
    nd.rating = rateByScore(nd.score);
    out.push(nd);
  }
  return out;
}

// Đánh rating theo đúng ngưỡng computeDaYun (giữ nhất quán tầng ngũ hành).
function rateByScore(score) {
  if (score >= 2) return 'Cát';
  if (score >= 1) return 'Hơi thuận';
  if (score <= -2) return 'Hung';
  if (score <= -1) return 'Hơi nghịch';
  return 'Bình hòa';
}

// ===========================================================================
//  LƯU NIÊN 喜忌 THEO CÁCH CỤC (格局流年喜忌) — bước thứ 3 trong chuỗi
//  格局→timing (sau loop 1: 格局成败, loop 2: 格局大运喜忌).
//
//  Nguyên lý cổ pháp (子平真詮 ch.10-11 tiếp): cùng một luật 喜忌 đặc trưng của
//  cách áp dụng cho Đại vận CŨNG áp dụng cho Lưu niên — một năm có thập thần
//  "sinh trợ Dụng/相" = 格局喜 (năm giúp cách cục phát huy), thập thần "khắc phá
//  Dụng" = 格局忌 (năm làm cách cục tổn thương).
//
//  Thang điểm: +3 cho năm can thuộc nhóm "喜", −3 cho nhóm "忌" — CAO HƠN 大运 (±2)
//  vì Lưu niên tác động TẬP TRUNG trong 1 năm (ngắn nhưng đậm), 大运 trải 10 năm
//  (dài nhưng loãng). Cộng tầng 格局 LÊN TRÊN 5 trường phái của scoreLiunianYear,
//  KHÔNG thay thế tầng nào (giống giải pháp layering của adjustDayunByGeju).
//
//  Lưu ý: scoreLiunianYear đã chạy xong (trả 5 trường phái: ngũ hành / thập thần
//  năm / thái tuế / thần sát / thiên khắc địa xung). Hàm này CHỈ cộng thêm 1 tầng
//  格局 + ghi gejuNote + đánh lại rating theo ngưỡng lưu niên.
// ===========================================================================

// Ngưỡng rating lưu niên — KHÔNG trùng ngưỡng đại vận (scoreLiunianYear chấm /100).
function rateLiunianByScore(score) {
  if (score >= 78) return 'Đại cát';
  if (score >= 62) return 'Cát';
  if (score >= 46) return 'Bình';
  if (score >= 32) return 'Hơi kỵ';
  if (score >= 20) return 'Hung';
  return 'Đại hung';
}

/**
 * Điều chỉnh điểm mỗi Lưu niên theo 喜忌 đặc trưng của 格局 (子平真詮 ch.10-11).
 *
 * @param {Array}  liunianList    — mảng kết quả computeLiuNian (mỗi ptử có year/gan/ganGod/score/rating…)
 * @param {object} patternQuality — kết quả patternQuality(R) (chứa patternYong.{xi,ji})
 * @param {string} dayGan         — Thiên can Nhật Chủ (dự phòng nếu ganGod thiếu)
 * @returns {Array} mảng liunian MỚI (clone), mỗi ptử thêm gejuDelta + gejuNote + score đã cộng + rating đã đánh lại.
 */
export function adjustLiunianByGeju(liunianList, patternQuality, dayGan) {
  if (!Array.isArray(liunianList) || !patternQuality || !dayGan) return liunianList || [];
  const py = patternQuality.patternYong;
  if (!py) return liunianList.map((l) => ({ ...l, gejuDelta: 0, gejuNote: '' }));

  // Tập nhóm ưa/kỵ của cách (ti/yin/shi/cai/guan).
  const xiGroups = new Set((py.xi || []).map((x) => x.group));
  const jiGroups = new Set((py.ji || []).map((x) => x.group));
  if (xiGroups.size === 0 && jiGroups.size === 0) {
    return liunianList.map((l) => ({ ...l, gejuDelta: 0, gejuNote: '' }));
  }

  const geName = patternQuality.keyStar ? patternQuality.keyStar.god : '';
  const out = [];
  for (const l of liunianList) {
    const nd = { ...l };
    // Thập thần của vận CAN năm (ganGod đã được computeLiuNian tính sẵn; fallback tenGod).
    const god = l.ganGod || tenGod(dayGan, l.gan);
    const grp = godGroup(god);
    let delta = 0;
    let note = '';
    if (grp && xiGroups.has(grp)) {
      delta = 3;
      note = `Năm ${l.year} ${l.gan}${l.zhi || ''} can ${god} (${GROUP_VI[grp]}) sinh trợ格 → 格局喜 (+3)`;
    } else if (grp && jiGroups.has(grp)) {
      delta = -3;
      note = `Năm ${l.year} ${l.gan}${l.zhi || ''} can ${god} (${GROUP_VI[grp]}) khắc phá/cản trở格 → 格局忌 (−3)`;
    }
    nd.gejuDelta = delta;
    nd.gejuNote = note;
    nd.score = (l.score || 0) + delta;
    // Đánh lại rating sau cộng tầng 格局 (giữ nguyên ngưỡng scoreLiunianYear).
    nd.rating = rateLiunianByScore(nd.score);
    out.push(nd);
  }
  return out;
}

// Tra bảng luật (dùng cho selftest)
export { GE_RULES, GROUP_VI, GROUP_WX };
