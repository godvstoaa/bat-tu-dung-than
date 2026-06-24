// ============================================================================
//  金口诀 (KIM KHẨU QUYẾT) — Golden Key Formula
//  Biến thể rút gọn của 大六壬 (Đại Lục Nhâm), phổ biến cho bói nhanh.
//  "孙膑金口诀" —truyền thuyết do Tôn Yểm (Mộc Quỳ) lập.
//
//  Bốn vị trí (四爻):
//    1. 地分 (Earth Position)  — từ GIỜ hỏi → 1 trong 12 địa chi (toạ)
//    2. 月将 (Month General)  — từ TIẾT KHÍ → chi khởi (cùng hệ Lục Nhâm 月将)
//    3. 贵神 (Noble Spirit)   — từ NHẬT CAN → phương vị Quý Nhân tọa
//    4. 人元 (Human Element)  — thiên can dẫn xuất (ngũ hổ độn theo 月将+ngày)
//
//  Luận: 五行 sinh/khắc giữa 4 vị trí (trên sinh dưới = cát; trên khắc dưới = tốn
//  sức; dưới khắc trên = hung). Lục亲 (六亲) trên đỉnh (人元) so với 日干 cho
//  ý nghĩa (印=hỗ trợ, 食伤=sáng tạo, 财=lợi, 官=áp, 比=đồng hành).
//
//  Nguồn: 《大六壬金口诀》/ 百度百科 "金口诀" / 月将按中气 (khớp liuren.js).
//  Đây là BẢN RÚT GỌN — phiên bản đầy đủ có thêm 将神/贵神 12 vòng, dụng神,
//  tam传; ở đây chỉ tính 4 vị trí + ngũ hành tương tác → phán cát/hung yes/no.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { ZHI, GAN, SHENG, KE } from './constants.js';

// 12 địa chi theo thứ tự (子=0 … 亥=11)
const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const idx = (z) => ZHI_ORDER.indexOf(z);
const ZHI_WX = Object.fromEntries(ZHI_ORDER.map((z) => [z, ZHI[z].wx]));

// ---- 月将 theo 中气 (khớp 大六壬 liuren.js) ----
// 雨水→亥(登明), 春分→戌(河魁), …, 大寒→子(神后)
const QI_YUEJIANG = {
  雨水: '亥', 春分: '戌', 谷雨: '酉', 小满: '申',
  夏至: '未', 大暑: '午', 处暑: '巳', 秋分: '辰',
  霜降: '卯', 小雪: '寅', 冬至: '丑', 大寒: '子',
};
const YUEJIANG_VI = {
  子: '神后', 丑: '大吉', 寅: '功曹', 卯: '太冲',
  辰: '天罡', 巳: '太乙', 午: '胜光', 未: '小吉',
  申: '传送', 酉: '从魁', 戌: '河魁', 亥: '登明',
};

// ---- 贵神 (十二天将) — 昼夜起例 theo 日干 ----
// 日干 → [昼贵 (day), 夜贵 (night)]
const GUIREN = {
  甲: ['丑', '未'], 戊: ['丑', '未'], 乙: ['子', '申'], 己: ['子', '申'],
  丙: ['亥', '酉'], 丁: ['亥', '酉'], 壬: ['卯', '巳'], 癸: ['卯', '巳'],
  庚: ['午', '寅'], 辛: ['午', '寅'],
};
// 12 天将 theo thứ tự từ 贵人顺/逆 (khớp liuren.js TIANJIANG)
const TIANJIANG = ['贵人', '螣蛇', '朱雀', '六合', '勾陈', '青龙', '天空', '白虎', '太常', '玄武', '太阴', '天后'];
const TJ_VI = {
  贵人: 'Quý Nhân (cát, phù trợ)', 螣蛇: 'Đằng Xà (hung, hư kinh)',
  朱雀: 'Chu Tước (hung, khẩu thiệp)', 六合: 'Lục Hợp (cát, hôn nhân)',
  勾陈: 'Câu Trần (hung, tranh chấp)', 青龙: 'Thanh Long (đại cát, tài lộc)',
  天空: 'Thiên Không (không vong)', 白虎: 'Bạch Hổ (đại hung, thương bệnh)',
  太常: 'Thái Thường (cát, y thực)', 玄武: 'Huyền Vũ (hung, trộm cắp)',
  太阴: 'Thái Âm (cát, ám trợ)', 天后: 'Thiên Hậu (cát, nữ giới)',
};
// Thiên_can hành (từ GAN)
const GAN_WX = Object.fromEntries(Object.entries(GAN).map(([g, v]) => [g, v.wx]));

// ---- 五虎遁 (ngũ hổ độn): từ năm can → chi 起月干 ----
// 甲己之年丙作首 → 寅月起 丙; 乙庚之年戊为头 → 寅月起 戊; ...
const WUHU = { 甲: '丙', 己: '丙', 乙: '戊', 庚: '戊', 丙: '庚', 辛: '庚', 丁: '壬', 壬: '壬', 戊: '甲', 癸: '甲' };

// ---- 六亲 (theo một chi/can vs 日干) ----
//同=比(đồng hành); sinh ta=父母/Ấn; ta sinh=子孙/Thực Thương;
// ta khắc=妻财/Tài; khắc ta=官鬼/Quan
function liuqinOf(otherWx, dayWx) {
  if (otherWx === dayWx) return { zh: '兄弟', vi: 'Huynh Đệ (Tỷ Kiếp)', group: 'bi' };
  if (SHENG[otherWx] === dayWx) return { zh: '父母', vi: 'Phụ Mẫu (Ấn)', group: 'yin' };
  if (SHENG[dayWx] === otherWx) return { zh: '子孙', vi: 'Tử Tôn (Thực Thương)', group: 'shi' };
  if (KE[dayWx] === otherWx) return { zh: '妻财', vi: 'Thê Tài (Tài)', group: 'cai' };
  if (KE[otherWx] === dayWx) return { zh: '官鬼', vi: 'Quan Quỷ (Quan Sát)', group: 'guan' };
  return { zh: '?', vi: '?', group: '?' };
}

// ---- Quan hệ ngũ hành: a vs b ----
// '同'=tỷ hoà, '生'=a sinh b, '泄'=a bị b tiết (b là con a),
// '克'=a khắc b, '耗'=a bị b hao (b khắc a ngược? thực ra b sinh... ) — đơn giản:
function wxRel(a, b) {
  if (a === b) return '比和';
  if (SHENG[a] === b) return '相生'; // a sinh b (ta nuôi việc)
  if (SHENG[b] === a) return '被生'; // b sinh a (việc nuôi ta)
  if (KE[a] === b) return '相克';     // a khắc b
  if (KE[b] === a) return '被克';     // b khắc a
  return '无关';
}

// ---- 月将 từ tiết khí gần nhất ≤ ngày ----
function yuejiangFromSolar(solar) {
  const lunar = solar.getLunar();
  const table = lunar.getJieQiTable();
  const now = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay()).getTime();
  let best = null, bestMs = -Infinity;
  for (const name of Object.keys(QI_YUEJIANG)) {
    const jqs = table[name];
    if (!jqs) continue;
    const ms = new Date(jqs.getYear(), jqs.getMonth() - 1, jqs.getDay()).getTime();
    if (ms <= now && ms > bestMs) { bestMs = ms; best = name; }
  }
  return best ? QI_YUEJIANG[best] : '子';
}

// ---- 人元 (thiên can) — ngũ hổ độn từ 月将 chi ----
// 五虎遁: từ năm/月 chi 起丙... Ở đây đơn giản: 月将 chi → tháng tương ứng → can
// Cách cổ điển trong Kim Khẩu Quyết: 月将加时 → nhân can theo 月将 chi (dùng 五虎遁)
// Quy ước: 月将 chi 起的五虎遁 can = 五虎遁[yearGan]... nhưng đơn giản hoá:
//   - Lấy 月将 chi → tìm chỉ số; can = 五虎遁 dựa trên (dayGan) — 法"将干":
//     can = GAN_ORDER[(gIdx + offset) % 10], offset từ 月将 vs 寅.
// Thực hành (简): nhân can theo 月将 chi bằng 五虎遁 của NHẬT CAN.
const GAN_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 起月干 cổ điển: 寅月起, can tăng dần theo chi dương
// 月将 chi → Can: dùng 五虎遁 theo day-gan giả định (nếu không có → 甲己 hệ)
function renYuanGan(yuejiangZhi, dayGan) {
  // 五虎遁: dựa trên (dayGan or 默认 甲) — thực tế Kim Khẩu Quyết dùng
  // 月将 chi trực tiếp thành "人元" can bằng 五虎遁[tên can nhóm].
  // Chọn nhóm ngũ hổ遁 theo dayGan:
  const wuhuStart = WUHU[dayGan] || '甲'; // can khởi đầu tại 寅
  const startIdx = GAN_ORDER.indexOf(wuhuStart); // tại 寅
  // can tăng theo chi dương từ 寅 (idx2). 月将 chi có thể là chi âm/dương.
  // can tương ứng chi = startIdx + (zhiIdx - 寅idx + 12) % 12, nhưng chỉ chi dương mới có can chính thức
  // → dùng zhiIdx trực tiếp (mỗi chi +1 can, mod 10)
  const zhiI = idx(yuejiangZhi);
  const yinI = idx('寅');
  const ganI = (startIdx + ((zhiI - yinI) % 12 + 12) % 12) % 10;
  return GAN_ORDER[ganI];
}

// ---- 贵神 placement trên 地分 ----
// 贵神 ở vị trí (chi) = 贵人 chi ban đầu (theo 日干 + 昼夜), rồi 配 vào 地分
// Kim Khẩu Quyết cổ: 贵神 = 天将 tại 地分. Tính: 贵人 đặt tại chi của nó,
// rồi 12 thiên将 vòng theo dương chi thuận / âm chi nghịch (như liuren).
function guishenAt(difeng, dayGan, hourZhi) {
  const guiPair = GUIREN[dayGan] || ['丑', '未'];
  const isDay = ['卯', '辰', '巳', '午', '未', '申'].includes(hourZhi);
  const gui = isDay ? guiPair[0] : guiPair[1];
  const guiPos = idx(gui);
  // 贵人在 dương chi (idx chẵn: 子0,寅2,辰4,午6,申8,戌10) → thuận
  const guiInYang = (guiPos % 2 === 0);
  // 天将 vòng: từ 贵人, mỗi bước +1 thiên将. Ta cần thiên将 đang ngự tại `difeng`
  const difengI = idx(difeng);
  // khoảng cách (theo chiều thiên将 đi) từ 贵人 chi đến difeng
  // thuận: steps = (difengI - guiPos + 12) % 12
  // nghịch: steps = (guiPos - difengI + 12) % 12
  const steps = guiInYang
    ? ((difengI - guiPos + 12) % 12)
    : ((guiPos - difengI + 12) % 12);
  return TIANJIANG[steps];
}

/**
 * Xếp Kim Khẩu Quyết (金口诀).
 *
 * @param {number} month  - tháng âm lịch 1..12
 * @param {number} day    - ngày âm lịch 1..30
 * @param {number} hour   - chi giờ 1..12 (子=1 … 亥=12)
 * @param {object} [opts] - tuỳ chọn
 *   - opts.dayGan: thiên can ngày (甲..癸). Bỏ trống → tự suy từ ngày hôm nay.
 *   - opts.solar:  {year, month, day} dương lịch dùng để lấy tiết khí + can chi
 *                  (nếu không có → dùng Date.now()).
 *   - opts.question: câu hỏi (chỉ ghi chú, không đổi kết quả).
 * @returns {{
 *   positions: { difeng, yuejiang, guishen, renyuan },
 *   elements: { difeng, yuejiang, guishen, renyuan },
 *   relations: { renyuan_vs_difeng, renyuan_vs_yuejiang, yuejiang_vs_difeng, guishen_vs_difeng },
 *   liuqin: { top, meaning },
 *   tianjiang: { name, vi, tone },
 *   verdict: 'CÁT'|'HUNG'|'TRUNG',
 *   summary: string,
 *   detail: string,
 *   input: { month, day, hour, dayGan, solar, yuejiangMethod },
 *   note: string
 * }}
 */
export function jinkoujue(month, day, hour, opts = {}) {
  // --- validate ---
  month = Math.round(Number(month));
  day = Math.round(Number(day));
  hour = Math.round(Number(hour));
  if (!(month >= 1 && month <= 12)) throw new Error('Tháng phải 1..12');
  if (!(day >= 1 && day <= 30)) throw new Error('Ngày phải 1..30');
  if (!(hour >= 1 && hour <= 12)) throw new Error('Giờ chi phải 1..12');

  // --- xác định solar / tiết khí / can chi ---
  let solar, lunar, dGan, hZhi;
  if (opts.solar && opts.solar.year) {
    // nếu có giờ dương lịch → ưu tiên lấy từ đó (chính xác hơn cho 月将)
    const h = opts.solar.hour || 12;
    solar = Solar.fromYmdHms(opts.solar.year, opts.solar.month, opts.solar.day, h, 0, 0);
    lunar = solar.getLunar();
    dGan = opts.dayGan || lunar.getDayGan();
  } else if (opts.dayGan) {
    // có can nhưng không có solar → dùng lunar-javascript mặc định hôm nay để lấy tiết khí
    solar = Solar.fromDate(new Date());
    lunar = solar.getLunar();
  } else {
    // mặc định: hôm nay
    solar = Solar.fromDate(new Date());
    lunar = solar.getLunar();
    dGan = lunar.getDayGan();
  }
  // giờ chi từ input (1..12 → chi)
  hZhi = ZHI_ORDER[hour - 1];

  // --- 月将 (theo tiết khí) ---
  const yuejiangZhi = yuejiangFromSolar(solar);

  // --- 地分: = giờ chi (toạ) ---
  const difeng = hZhi;

  // --- 人元 can ---
  const renGan = renYuanGan(yuejiangZhi, dGan);

  // --- 贵神 (thiên将 ngự tại địa phân) ---
  const tjName = guishenAt(difeng, dGan, hZhi);

  // --- ngũ hành 4 vị trí ---
  // NOTE: 贵神 không có ngũ hành riêng canonical; ngũ hành của vị trí này = chi toạ (địa phân).
  const el = {
    difeng: ZHI_WX[difeng],
    yuejiang: ZHI_WX[yuejiangZhi],
    guishen: ZHI_WX[difeng], // thần ngự tại địa phân → ngũ hành = chi địa phân
    renyuan: GAN_WX[renGan],
  };

  // --- lục亲 trên đỉnh (人元) so với 日干 ---
  const lq = liuqinOf(el.renyuan, GAN_WX[dGan]);

  // --- thiên将 tone ---
  const TJ_CAT = ['贵人', '六合', '青龙', '太常', '太阴', '天后'];
  const TJ_DOG = ['螣蛇', '朱雀', '勾陈', '白虎', '玄武'];
  const tjTone = TJ_CAT.includes(tjName) ? 'cát'
    : TJ_DOG.includes(tjName) ? 'hung' : 'bình';

  // --- quan hệ ngũ hành (trên vs dưới;经典的 Kim Khẩu Quyết xét 人元 [trên] vs 地分 [dưới]) ---
  const rels = {
    renyuan_vs_difeng: wxRel(el.renyuan, el.difeng),   // chính: trên vs toạ
    renyuan_vs_yuejiang: wxRel(el.renyuan, el.yuejiang),
    yuejiang_vs_difeng: wxRel(el.yuejiang, el.difeng),
    guishen_vs_difeng: wxRel(el.guishen, el.difeng),
  };

  // --- phán: chấm điểm ---
  // VD cổ điển Kim Khẩu Quyết: 用神 (人元) sinh 地分 = cát; khắc = tốn; bị khắc = hung.
  let score = 0;
  const reasons = [];
  const r1 = rels.renyuan_vs_difeng;
  if (r1 === '被生') { score += 2; reasons.push('人元 sinh 地分 (dưới được trên nuôi) → thuận lợi, có hậu thuẫn'); }
  else if (r1 === '相生') { score += 1; reasons.push('人元 sinh 地分 (trên nuôi dưới) → được việc nhưng hơi hao sức'); }
  else if (r1 === '比和') { score += 1; reasons.push('人元 tỷ hoà 地分 → hoà hợp, ổn định'); }
  else if (r1 === '相克') { score -= 1; reasons.push('人元 khắc 地分 → phải tốn công chế phục, việc khó nhằn nhưng có thể thành'); }
  else if (r1 === '被克') { score -= 2; reasons.push('人元 bị 地分 khắc → trở ngại, nên thận trọng/hoãn'); }

  // thiên将 tone cộng/trừ
  if (tjTone === 'cát') { score += 1; reasons.push(`贵神 ${tjName} (${TJ_VI[tjName]}) → cát thần phù trợ`); }
  else if (tjTone === 'hung') { score -= 1; reasons.push(`贵神 ${tjName} (${TJ_VI[tjName]}) → hung thần, cản trở`); }
  else { reasons.push(`贵神 ${tjName} (${TJ_VI[tjName]}) → bình thần, trung tính`); }

  // lục亲 trên đỉnh
  const lqHint = {
    yin: 'Ấn (印) — được hỗ trợ/che chở, thuận học vấn, giấy tờ, quý nhân',
    bi: 'Tỷ Kiếp (比) — đồng hành/cạnh tranh, tự lực, hợp tác',
    shi: 'Thực Thương (食伤) — sáng tạo, biểu đạt, sinh tài nhưng tiết khí',
    cai: 'Tài (财) — lợi lộc, tài sản, nhưng hao sức đoạt',
    guan: 'Quan Quỷ (官鬼) — áp lực/quyền lực, kỵ nếu hỏi việc nhẹ; cát nếu hỏi công danh',
  }[lq.group] || '';
  if (lqHint) reasons.push(`Lục亲 trên đỉnh: ${lq.zh} — ${lqHint}`);

  // verdict
  let verdict, verdictCls;
  if (score >= 2) { verdict = 'CÁT'; verdictCls = 'cat'; }
  else if (score <= -2) { verdict = 'HUNG'; verdictCls = 'hung'; }
  else { verdict = 'TRUNG'; verdictCls = 'mid'; }

  // yes/no/maybe
  const yesNo = verdict === 'CÁT' ? 'CÓ — nên tiến hành'
    : verdict === 'HUNG' ? 'KHÔNG — nên hoãn/tránh'
    : 'CHƯA RÕ — tùy nỗ lực, có thể làm cẩn thận';

  const positions = {
    difeng: { zhi: difeng, vi: ZHI[difeng].vi, wx: el.difeng, con: ZHI[difeng].con, role: '地分 (Earth — toạ, nền)' },
    yuejiang: { zhi: yuejiangZhi, vi: YUEJIANG_VI[yuejiangZhi] + ' (' + ZHI[yuejiangZhi].vi + ')', wx: el.yuejiang, role: '月将 (Month General — khí)' },
    guishen: { name: tjName, vi: TJ_VI[tjName], wx: el.guishen, atZhi: difeng, tone: tjTone, role: '贵神 (Noble Spirit — trên đỉnh)' },
    renyuan: { gan: renGan, vi: GAN[renGan].vi, wx: el.renyuan, liuqin: lq.zh, liuqinVi: lq.vi, role: '人元 (Human Element — can dẫn)' },
  };

  const summary = `地分 ${difeng}(${el.difeng}) · 月将 ${yuejiangZhi}(${el.yuejiang}/${YUEJIANG_VI[yuejiangZhi]}) · 贵神 ${tjName}(${tjTone}) · 人元 ${renGan}(${el.renyuan}/${lq.zh}) → ${verdict}: ${yesNo}`;

  const detail = reasons.map((r) => '• ' + r).join('\n');

  return {
    positions,
    elements: el,
    relations: rels,
    liuqin: { top: lq.zh, vi: lq.vi, group: lq.group, hint: lqHint },
    tianjiang: { name: tjName, vi: TJ_VI[tjName], tone: tjTone },
    verdict,
    verdictCls,
    yesNo,
    score,
    summary,
    detail,
    reasons,
    input: {
      month, day, hour,
      hourZhi: hZhi,
      dayGan: dGan,
      solar: opts.solar ? `${opts.solar.year}-${opts.solar.month}-${opts.solar.day}` : '(hôm nay)',
      yuejiangMethod: '中气最近 ≤ 当日',
      question: opts.question || null,
    },
    note: 'Kim Khẩu Quyết bản RÚT GỌN: chỉ tính 4 vị trí (地分/月将/贵神/人元) + ngũ hành tương tác. Phiên bản đầy đủ thêm 将神/十二贵神 vòng/dụng神/tam传 — chưa triển khai.',
  };
}

// ---- UI helper: render card HTML (dùng class định nghĩa sẵn) ----
export function renderJinkoujueCard(r) {
  const luckCls = r.verdictCls === 'cat' ? 'rate-cat'
    : r.verdictCls === 'hung' ? 'rate-hung' : 'rate-mid';
  const pos = r.positions;
  const row = (label, p, extra = '') => `
    <div class="lr-row">
      <span class="lr-sec">${label}</span>
      <b class="zh big">${p.zhi || p.gan || p.name}</b>
      <span class="hint-inline">${p.vi || ''} · ${p.wx} ${extra}</span>
    </div>`;
  return `
    <div class="lr-head">
      Nhập: tháng ${r.input.month} · ngày ${r.input.day} · giờ ${r.input.hourZhi}(${r.input.hour}) ·
      nhật can <b class="zh">${r.input.dayGan}</b> (${GAN[r.input.dayGan].vi}) ·
      ${r.input.question ? 'hỏi: "' + r.input.question + '" · ' : ''}
      ${r.input.solar}
    </div>
    ${row('地分 (toạ)', pos.difeng)}
    ${row('月将 (khí)', pos.yuejiang, `/ ${pos.yuejiang.vi}`)}
    <div class="lr-row">
      <span class="lr-sec">贵神 (trên đỉnh)</span>
      <b class="zh big">${pos.guishen.name}</b>
      <span class="hint-inline">${pos.guishen.vi} · @${pos.guishen.atZhi}(${pos.guishen.wx})
        <span class="ln-rate ${pos.guishen.tone === 'cát' ? 'rate-cat' : pos.guishen.tone === 'hung' ? 'rate-hung' : 'rate-mid'}">${pos.guishen.tone}</span>
      </span>
    </div>
    ${row('人元 (can dẫn)', pos.renyuan, `/ lục亲 ${pos.renyuan.liuqin} (${pos.renyuan.liuqinVi})`)}
    <div class="lr-row"><span class="lr-sec">Quan hệ (人元 ↔ 地分)</span><b>${r.relations.renyuan_vs_difeng}</b>
      <span class="hint-inline">· 人元↔月将 ${r.relations.renyuan_vs_yuejiang} · 月将↔地分 ${r.relations.yuejiang_vs_difeng}</span>
    </div>
    <div class="zr-advice">→ Phán: <span class="ln-rate ${luckCls}">${r.verdict}</span> (${r.yesNo}) · điểm ${r.score >= 0 ? '+' : ''}${r.score}</div>
    <p class="zr-advice" style="white-space:pre-line">${r.detail}</p>
    <p class="hint">${r.note}</p>`;
}

export { ZHI_ORDER, TIANJIANG, TJ_VI, YUEJIANG_VI, GUIREN, QI_YUEJIANG };
