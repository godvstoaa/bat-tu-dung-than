// ============================================================================
//  ĐẠI LỤC NHÂM 大六壬 — thức cuối của "三式"
//  Scope: 天地盘 (月将加时) + 四课 (干支寄宫) + 三传 (贼克/比用, 简化) +
//  十二天将 (贵人昼夜起例) + 初传天将六亲 → phán cát hung.
//  Nguồn: 六壬大全, 月将按中气, 贵人歌诀 (verified). (九宗门 đầy đủ = bước sau.)
// ============================================================================
import { Solar } from 'lunar-javascript';

const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZHI_WX = { 子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水' };
const idx = (z) => ZHI.indexOf(z);
const SHENG = { 金: '水', 水: '木', 木: '火', 火: '土', 土: '金' };
const KE = { 金: '木', 木: '土', 土: '水', 水: '火', 火: '金' };
function keRel(a, b) { // a vs b: '克' (a克b) / '贼'(b克a=被克) / '生' / '同' / '无关'
  const wa = ZHI_WX[a], wb = ZHI_WX[b];
  if (wa === wb) return '同';
  if (KE[wa] === wb) return '克';   // a克b (上克下)
  if (KE[wb] === wa) return '贼';   // b克a (下贼上)
  if (SHENG[wa] === wb) return '生';
  if (SHENG[wb] === wa) return '被生';
  return '无关';
}

// 月将 theo 中气 (登明亥=雨水后 ... 神后子=大寒后)
const QI_YUEJIANG = { 雨水: '亥', 春分: '戌', 谷雨: '酉', 小满: '申', 夏至: '未', 大暑: '午', 处暑: '巳', 秋分: '辰', 霜降: '卯', 小雪: '寅', 冬至: '丑', 大寒: '子' };
const YUEJIANG_VI = { 子: '神后', 丑: '大吉', 寅: '功曹', 卯: '太冲', 辰: '天罡', 巳: '太乙', 午: '胜光', 未: '小吉', 申: '传送', 酉: '从魁', 戌: '河魁', 亥: '登明' };

// 十干寄宫
const GAN_JI = { 甲: '寅', 乙: '辰', 丙: '巳', 丁: '未', 戊: '巳', 己: '未', 庚: '申', 辛: '戌', 壬: '亥', 癸: '丑' };

// 贵人 昼夜歌诀: 日干 → [昼贵, 夜贵]
const GUIREN = { 甲: ['丑', '未'], 戊: ['丑', '未'], 乙: ['子', '申'], 己: ['子', '申'], 丙: ['亥', '酉'], 丁: ['亥', '酉'], 壬: ['卯', '巳'], 癸: ['卯', '巳'], 庚: ['午', '寅'], 辛: ['午', '寅'] };
const TIANJIANG = ['贵人', '螣蛇', '朱雀', '六合', '勾陈', '青龙', '天空', '白虎', '太常', '玄武', '太阴', '天后'];
const TJ_VI = { 贵人: 'Quý Nhân (cát)', 螣蛇: 'Đằng Xà (hung,虚惊)', 朱雀: 'Chu Tước (hung,口舌)', 六合: 'Lục Hợp (cát,婚姻)', 勾陈: 'Câu Trần (hung,争执)', 青龙: 'Thanh Long (đại cát, tài)', 天空: 'Thiên Không (空亡)', 白虎: 'Bạch Hổ (đại hung,丧病)', 太常: 'Thái Thường (cát,衣食)', 玄武: 'Huyền Vũ (hung,盗贼)', 太阴: 'Thái Âm (cát,暗助)', 天后: 'Thiên Hậu (cát,妇女)' };

// 六亲 (theo 初传 vs 日干 hành)
function liuqin(chuan, dayGan) {
  const dayWx = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' }[dayGan];
  const cw = ZHI_WX[chuan];
  if (cw === dayWx) return '兄弟';
  if (SHENG[cw] === dayWx) return '父母';
  if (SHENG[dayWx] === cw) return '子孙';
  if (KE[dayWx] === cw) return '妻财';
  if (KE[cw] === dayWx) return '官鬼';
  return '?';
}

function yuejiangFor(solar) {
  // 中气 gần nhất ≤ hôm nay → 月将
  const lunar = solar.getLunar();
  const table = lunar.getJieQiTable();
  let best = null, bestMs = -Infinity;
  for (const name of Object.keys(QI_YUEJIANG)) {
    const jqs = table[name];
    if (!jqs) continue;
    const ms = new Date(jqs.getYear(), jqs.getMonth() - 1, jqs.getDay()).getTime();
    const now = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay()).getTime();
    if (ms <= now && ms > bestMs) { bestMs = ms; best = name; }
  }
  return best ? QI_YUEJIANG[best] : '子';
}

/**
 * Xếp Đại Lục Nhâm.
 * @returns {{ yuejiang, hGanZhi, sky(12), ke4:[{up,down,rel}], sanchuan, tianjiang(12), dayGui, verdict }}
 */
export function liurenPan(year, month, day, hour) {
  const solar = Solar.fromYmdHms(year, month, day, hour || 12, 0, 0);
  const lunar = solar.getLunar();
  const dGan = lunar.getDayGan(), dZhi = lunar.getDayZhi();
  const hZhi = lunar.getTimeZhi();
  const yuejiang = yuejiangFor(solar);
  const yi = idx(yuejiang), hi = idx(hZhi);

  // 天盘 (12) sky[地盘pos] = 支[(yi + (pos - hi) + 12) % 12]
  const sky = (z) => { const p = idx(z); return ZHI[(yi + (p - hi) + 12) % 12]; };
  const skyArr = ZHI.map((z, p) => ZHI[(yi + (p - hi) + 12) % 12]);

  // 四课
  const ganJi = GAN_JI[dGan];
  const k1u = sky(ganJi);            // 一课上 = 天盘[干寄宫]
  const k2u = sky(k1u);              // 二课上 = 天盘[一课上]
  const k3u = sky(dZhi);             // 三课上 = 天盘[日支]
  const k4u = sky(k3u);              // 四课上 = 天盘[三课上]
  const ke4 = [
    { n: '一课', up: k1u, down: ganJi, rel: keRel(k1u, ganJi) },
    { n: '二课', up: k2u, down: k1u, rel: keRel(k2u, k1u) },
    { n: '三课', up: k3u, down: dZhi, rel: keRel(k3u, dZhi) },
    { n: '四课', up: k4u, down: k3u, rel: keRel(k4u, k3u) },
  ];

  // 三传 (贼克/比用 简化): ưu tiên 下贼上, rồi 上克下; nhiều则取 比和 日干阴阳
  const dayYin = { 甲: false, 丙: false, 戊: false, 庚: false, 壬: false, 乙: true, 丁: true, 己: true, 辛: true, 癸: true }[dGan];
  const zhiYin = (z) => ['丑', '卯', '巳', '未', '酉', '亥'].includes(z);
  const keWithKe = ke4.filter((k) => k.rel === '贼' || k.rel === '克');
  let chuan1;
  let zongMen = '';
  if (keWithKe.length === 0) {
    chuan1 = k1u; zongMen = '遥克/昴星(简化) — 无克, 用干上神';
  } else {
    // ưu tiên 贼 (下贼上)
    let pool = keWithKe.filter((k) => k.rel === '贼');
    if (!pool.length) pool = keWithKe.filter((k) => k.rel === '克');
    if (pool.length === 1) { chuan1 = pool[0].up; zongMen = keWithKe.length === 1 ? '贼克/始入' : '重克比用'; }
    else {
      // 比用: 取 比和 日干阴阳
      const bi = pool.filter((k) => zhiYin(k.up) === dayYin);
      chuan1 = (bi[0] || pool[0]).up; zongMen = '比用';
    }
  }
  const chuan2 = sky(chuan1);   // 中传
  const chuan3 = sky(chuan2);   // 末传
  const sanchuan = [
    { n: '初传', zhi: chuan1, rel: keRel(chuan1, ganJi) },
    { n: '中传', zhi: chuan2, rel: keRel(chuan2, ganJi) },
    { n: '末传', zhi: chuan3, rel: keRel(chuan3, ganJi) },
  ];

  // 十二天将: 贵人 昼夜 by 时 + 日干
  const isDay = ['卯', '辰', '巳', '午', '未', '申'].includes(hZhi);
  const guiRaw = GUIREN[dGan] || ['丑', '未'];
  const gui = isDay ? guiRaw[0] : guiRaw[1];
  const guiPos = idx(gui);
  const guiInYang = [0, 1, 2, 3, 4, 5].includes(guiPos); // 亥子丑寅卯辰 = 顺
  // 12 天将 排: 贵人在 gui, 顺/逆
  const tjAt = {}; // 支 → 天将
  for (let i = 0; i < 12; i++) {
    const off = guiInYang ? i : -i;
    const zpos = (guiPos + off + 12) % 12;
    tjAt[ZHI[zpos]] = TIANJIANG[i];
  }

  // phán: 初传 + 天将 + 六亲
  const lq1 = liuqin(chuan1, dGan);
  const tj1 = tjAt[chuan1];
  const tjTone = ['贵人', '六合', '青龙', '太常', '太阴', '天后'].includes(tj1) ? 'cát' : (['螣蛇', '朱雀', '勾陈', '白虎', '玄武'].includes(tj1) ? 'hung' : 'bình');
  const verdict = `初传 ${chuan1}(${ZHI_WX[chuan1]}, ${lq1}) + ${tj1}(${TJ_VI[tj1]}) [${zongMen}]. ${tjTone === 'cát' && ['妻财', '子孙', '兄弟'].includes(lq1) ? '→ CÁT: sự việc có lợi, nên tiến.' : tjTone === 'hung' && ['官鬼', '父母'].includes(lq1) ? '→ HUNG: nên thận trọng/hoãn.' : '→ BÌNH: tùy nỗ lực, cát hung lẫn.'}`;

  return { yuejiang, yuejiangVi: YUEJIANG_VI[yuejiang], dayGanZhi: dGan + dZhi, hourZhi: hZhi, isDay, skyArr, ke4, sanchuan, zongMen, tjAt, gui, dayGui: guiRaw, chuan1TianJiang: tj1, verdict, note: '三传用 贼克/比用 简化 (九宗门 đầy đủ = bước sau); 月将按中气.' };
}

export { ZHI, TIANJIANG, TJ_VI, YUEJIANG_VI };
