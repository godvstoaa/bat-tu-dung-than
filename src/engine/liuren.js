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

// 十干寄宫 (bảng "干上神" cho 四课)
const GAN_JI = { 甲: '寅', 乙: '辰', 丙: '巳', 丁: '未', 戊: '巳', 己: '未', 庚: '申', 辛: '戌', 壬: '亥', 癸: '丑' };
const GAN_WX = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };

// 寄干 theo chi (cho 涉害 历数法, theo古式盘《金匮玉衡经》"孟寄阳干, 仲寄阴干, 戊寄巳, 己寄未").
//   子→癸(仲阴) 丑→(季无寄) 寅→甲(孟阳) 卯→乙(仲阴) 辰→(季无寄) 巳→丙+戊(孟阳+戊)
//   午→丁(仲阴) 未→己(季+己) 申→庚(孟阳) 酉→辛(仲阴) 戌→(季无寄) 亥→壬(孟阳)
//   Nguồn: 知乎《大六壬涉害法探源》— phân tích式盘 8干4维 + 戊己寄4维.
const ZHI_JIGAN = { 子: ['癸'], 丑: [], 寅: ['甲'], 卯: ['乙'], 辰: [], 巳: ['丙', '戊'], 午: ['丁'], 未: ['己'], 申: ['庚'], 酉: ['辛'], 戌: [], 亥: ['壬'] };

// 孟仲季 (theo四象四方): 孟=寅申巳亥 (4 góc, "深" — 涉害 sâu), 仲=子午卯酉, 季=辰戌丑未 ("季无取").
const SHEN = (z) => (['寅', '申', '巳', '亥'].includes(z) ? '孟' : ['子', '午', '卯', '酉'].includes(z) ? '仲' : '季');

/**
 * 涉害 历数法 — đếm số "重害" (lần bị 克) trên đường 上神 đi từ địa盘 vị trí hiện tại
 * thuận chiều tới本宫, KỂ cả cung xuất phát, KHÔNG kể本宫. Xét cả chi + 寄干 khắc 上神.
 * Quy ước: 上神 X bị "害" bởi chi/can Z khi hành(Z) khắc hành(X), i.e. KE[wZ] === wX.
 * Ví dụ chuẩn 《六壬大全》甲辰亥将卯时: 戌@寅→4重害 (寅·甲·卯·乙 đều木 khắc土), 子@辰→5重害 (辰·戊·巳·未·戌 đều土 khắc水) → 子涉害 sâu hơn → 取子为初传. ✓
 * Nguồn: 知乎《大六壬入门基础篇之九宗门(3.涉害法)》+ 《六壬大全》卷七.
 * @param upZhi    上神 (chi đang xét làm ứng viên 初传)
 * @param landPos  địa盘 chi mà 上神 đang ngự (= 下神 của lesson)
 * @returns số lần bị 克沿途 (số "重害")
 */
function sheHaiCount(upZhi, landPos) {
  const startP = idx(landPos);
  const homeP = idx(upZhi);
  const upWx = ZHI_WX[upZhi];
  let count = 0;
  let p = startP;                                  // KỂ cả cung xuất phát (theo知乎算例)
  while (p !== homeP) {                            // dừng khi tới本宫 (không đếm本宫)
    const z = ZHI[p];
    if (KE[ZHI_WX[z]] === upWx) count++;           // chi hành khắc 上神
    for (const g of ZHI_JIGAN[z]) {                 // 寄干 khắc 上神
      if (KE[GAN_WX[g]] === upWx) count++;
    }
    p = (p + 1) % 12;
  }
  return count;
}

// 贵人 昼夜歌诀: 日干 → [昼贵, 夜贵]. 「甲戊庚牛羊 · 乙己鼠猴乡 · 丙丁猪鸡位 · 壬癸兔蛇藏 · 六辛逢马虎」
// [cycle 45 sửa bug C1] 庚 cũ = ['午','寅'] (của 辛) là SAI — 庚 phải ['丑','未'] (cùng 甲/戊 theo "甲戊庚牛羊").
//   壬/癸 giữ ['卯','巳'] (giá trị đúng theo "壬癸兔蛇藏"; thứ tự 昼/夜 các phái tranh cãi, giữ nguyên).
const GUIREN = { 甲: ['丑', '未'], 戊: ['丑', '未'], 庚: ['丑', '未'], 乙: ['子', '申'], 己: ['子', '申'], 丙: ['亥', '酉'], 丁: ['亥', '酉'], 壬: ['卯', '巳'], 癸: ['卯', '巳'], 辛: ['午', '寅'] };
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

  // 三传 (九宗门: 贼克 → 比用 → 涉害 [历数→见机→察微→缀瑕] → 遥克/昴星 fallback):
  //   ưu tiên 下贼上, rồi 上克下; nhiều则取 比和 日干阴阳; vẫn tie则用 涉害 (历数 + 孟仲季 + 缀瑕).
  const dayYin = { 甲: false, 丙: false, 戊: false, 庚: false, 壬: false, 乙: true, 丁: true, 己: true, 辛: true, 癸: true }[dGan];
  const zhiYin = (z) => ['丑', '卯', '巳', '未', '酉', '亥'].includes(z);
  const keWithKe = ke4.filter((k) => k.rel === '贼' || k.rel === '克');
  let chuan1;
  let zongMen = '';
  let shehaiDetail = null; // debug info cho 涉害
  if (keWithKe.length === 0) {
    chuan1 = k1u; zongMen = '遥克/昴星(简化) — 无克, 用干上神';
  } else {
    // ưu tiên 贼 (下贼上); 无则 上克下
    let pool = keWithKe.filter((k) => k.rel === '贼');
    if (!pool.length) pool = keWithKe.filter((k) => k.rel === '克');
    if (pool.length === 1) {
      chuan1 = pool[0].up; zongMen = keWithKe.length === 1 ? '贼克/始入' : '重克比用';
    } else {
      // 比用: 取 比和 日干阴阳 (阴阳同)
      const bi = pool.filter((k) => zhiYin(k.up) === dayYin);
      // 涉害 kích hoạt khi 比用 VẪN tie: bi có 0 (俱不比) hoặc >=2 (俱比)
      const needShehai = bi.length === 0 || bi.length >= 2;
      if (!needShehai) {
        chuan1 = bi[0].up; zongMen = '比用';
      } else {
        // === 涉害 (九宗门 thứ 3) ===
        // Pool ứng viên: nếu 俱不比 (bi=[]) thì仍 dùng原 pool (古法「俱不比」亦以涉害取之);
        //   nếu 俱比 (bi>=2) thì dùng bi (đã 比).
        const cand = bi.length >= 2 ? bi : pool;
        const scored = cand.map((k) => ({ up: k.up, down: k.down, n: k.n, hai: sheHaiCount(k.up, k.down) }));
        const maxHai = Math.max(...scored.map((s) => s.hai));
        const top = scored.filter((s) => s.hai === maxHai);
        shehaiDetail = { scored, maxHai, geName: null };
        if (top.length === 1) {
          chuan1 = top[0].up;
          zongMen = `涉害(历数) — ${top[0].up} ${maxHai}重害最多`;
        } else {
          // 涉害 同 → 孟仲季 tie-break: 见机(孟) → 察微(仲) → 季 (季无取古法, hỷ此 bỏ)
          const order = { 孟: 0, 仲: 1, 季: 2 };
          const minShen = Math.min(...top.map((s) => order[SHEN(s.up)]));
          const topShen = top.filter((s) => order[SHEN(s.up)] === minShen);
          if (topShen.length === 1) {
            const geName = minShen === 0 ? '见机(孟深)' : minShen === 1 ? '察微(仲浅)' : '季';
            chuan1 = topShen[0].up;
            zongMen = `涉害(${geName}) — 涉害同(${maxHai})取${SHEN(topShen[0].up)}位`;
            shehaiDetail.geName = geName;
          } else {
            // 缀瑕: 涉害同 + 同孟仲季 → 刚日取干上神(一课), 柔日取支上神(三课).
            //   古法「先干后支/刚看干柔看支」— chỉ xảy ra ở 戊/己日.
            const isYangGan = !dayYin; // 甲丙戊庚壬 = 刚
            // 在 topShen 中找来自一课(干) hoặc 三课(支)
            const pickKe = isYangGan ? '一课' : '三课';
            const picked = topShen.find((s) => s.n === pickKe) || topShen[0];
            chuan1 = picked.up;
            zongMen = `涉害(缀瑕) — 涉害同(${maxHai})且同${SHEN(picked.up)}, ${isYangGan ? '刚' : '柔'}日取${pickKe}上神`;
            shehaiDetail.geName = '缀瑕';
          }
        }
      }
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
  // [cycle 59 sửa CRITICAL #2] 顺/逆 theo KHOẢN cổ pháp (《六壬大全》「亥至辰顺，巳至戌逆」):
  //   贵人 rơi 亥子丑寅卯辰 → THUẬN (顺排); 巳午未申酉戌 → NGHỊCH (逆排).
  //   Trước đây dùng parity 阳支=顺 (sai 6/12 chi) + khi nghịch không đảo thứ tự 天将 (đặt 螣蛇 nhầm chỗ 天后).
  const SHUN_RANGE = ['亥', '子', '丑', '寅', '卯', '辰'];
  const guiShun = SHUN_RANGE.includes(gui);
  // 12 天将 排: 贵人在 gui, 顺则正序 tới gui+11; nghịch则 ĐẢO thứ tự 天将 (贵人→天后→太阴→…) tới gui-11.
  const tjAt = {}; // 支 → 天将
  for (let i = 0; i < 12; i++) {
    const general = guiShun ? TIANJIANG[i] : TIANJIANG[(12 - i) % 12]; // nghịch: đảo mảng 天将
    const zpos = guiShun ? (guiPos + i) % 12 : (guiPos - i + 12) % 12; // nghịch: lùi chi
    tjAt[ZHI[zpos]] = general;
  }

  // phán: 初传 + 天将 + 六亲
  const lq1 = liuqin(chuan1, dGan);
  const tj1 = tjAt[chuan1];
  const tjTone = ['贵人', '六合', '青龙', '太常', '太阴', '天后'].includes(tj1) ? 'cát' : (['螣蛇', '朱雀', '勾陈', '白虎', '玄武'].includes(tj1) ? 'hung' : 'bình');
  const verdict = `初传 ${chuan1}(${ZHI_WX[chuan1]}, ${lq1}) + ${tj1}(${TJ_VI[tj1]}) [${zongMen}]. ${tjTone === 'cát' && ['妻财', '子孙', '兄弟'].includes(lq1) ? '→ CÁT: sự việc có lợi, nên tiến.' : tjTone === 'hung' && ['官鬼', '父母'].includes(lq1) ? '→ HUNG: nên thận trọng/hoãn.' : '→ BÌNH: tùy nỗ lực, cát hung lẫn.'}`;

  return { yuejiang, yuejiangVi: YUEJIANG_VI[yuejiang], dayGanZhi: dGan + dZhi, hourZhi: hZhi, isDay, skyArr, ke4, sanchuan, zongMen, shehaiDetail, tjAt, gui, dayGui: guiRaw, chuan1TianJiang: tj1, verdict, note: '三传用 九宗门 贼克/比用/涉害 (历数→见机→察微→缀瑕); 月将按中气. 遥克/昴星/别责/伏吟/返吟 = fallback/future work.' };
}

export { ZHI, TIANJIANG, TJ_VI, YUEJIANG_VI, sheHaiCount, SHEN as zhiShen, ZHI_JIGAN };
