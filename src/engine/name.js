// ============================================================================
//  HỌC TÊN 姓名学 — 五格剖象 (Kumazaki 熊崎式)
//  Tính 天/人/地/外/总 ngũ cách + 81 số lý + 三才 (thiên-nhân-địa) →吉凶.
//  QUAN TRỌNG: dùng 康熙字典 nét (khác nét thường). Bảng nét dưới đây curated
//  cho Hán Việt phổ biến; cho ký tự chưa có → người dùng nhập nét thủ công.
//  + đối chiếu 五 hành tên vs Dụng Thần lá số (tên có补 mệnh không).
// ============================================================================
import { WX_VI } from './constants.js';

// ---- BẢNG NÉT 康熙 (curated Hán Việt phổ biến; mở rộng dần) ----
export const STROKES = {
  // Họ Việt Nam phổ biến
  阮: 12, 陳: 16, 陈: 16, 黎: 15, 范: 11, 黃: 12, 黄: 12, 潘: 16, 武: 8, 鄧: 19, 邓: 19,
  吳: 7, 吴: 7, 楊: 13, 杨: 13, 丁: 2, 鄭: 19, 羅: 20, 罗: 20, 林: 8, 高: 10, 何: 7,
  梁: 11, 宋: 8, 唐: 10, 馮: 12, 冯: 12, 董: 15, 程: 12, 曹: 11, 傅: 12, 葉: 15, 蔡: 17, 盧: 16,
  謝: 17, 谢: 17, 鄺: 16, 龍: 16, 戴: 18, 魏: 18, 譚: 19, 余: 7, 田: 5, 杜: 7, 任: 6,
  // Tên đệm/chữ tên Hán Việt phổ biến
  文: 4, 明: 8, 德: 15, 志: 7, 玉: 5, 英: 11, 華: 14, 华: 14, 玲: 10, 琴: 13, 燕: 16,
  花: 10, 蘭: 23, 兰: 23, 芳: 10, 香: 9, 梅: 11, 雲: 12, 云: 12, 海: 11, 山: 3, 河: 9,
  天: 4, 地: 6, 日: 4, 月: 4, 星: 9, 春: 9, 秋: 9, 雪: 11, 鳳: 14, 凤: 14, 龍: 16,
  寶: 20, 金: 8, 銀: 14, 嫦: 14, 慧: 15, 智: 12, 仁: 4, 義: 13, 礼: 18, 信: 9,
  福: 14, 壽: 14, 强: 11, 堅: 11, 勇: 9, 忠: 8, 孝: 7, 和: 8, 平: 5,
  國: 11, 家: 10, 祥: 11, 瑞: 14, 嘉: 14, 慶: 15, 泰: 10, 安: 6, 康: 11, 寧: 14,
  建: 9, 立: 5, 成: 7, 光: 6, 榮: 14, 輝: 15, 發: 12, 財: 10, 富: 12, 貴: 12,
  // ---- Bổ sung: đồng bộ với vi2han.js (Hán Việt phổ biến) ----
  // 氵=水(4), 扌=手(4), 忄=心(4), 犭=犬(4) theo quy tắc康熙部首
  丹: 4, 俊: 9, 偉: 11, 兒: 8, 勝: 12, 南: 9, 君: 7, 善: 12, 如: 6, 妙: 7,
  妝: 7, 姮: 9, 娥: 10, 嬌: 15, 容: 10, 強: 11, 微: 13, 心: 4, 忍: 7, 情: 11,
  方: 4, 書: 10, 有: 6, 松: 8, 樂: 15, 欣: 8, 正: 5, 氏: 4, 水: 4, 淵: 12,
  清: 12, 澄: 15, 珠: 11, 瑤: 15, 璃: 15, 皇: 9, 眉: 9, 秀: 7, 簪: 18, 紅: 9,
  絨: 12, 胡: 9, 草: 12, 莊: 13, 薇: 19, 裴: 14, 豪: 14, 越: 12, 進: 14, 鈴: 13,
  長: 8, 開: 12, 陽: 17, 隨: 17, 雄: 12, 霞: 17, 顯: 23, 風: 9, 鶯: 21, 鸞: 30,
  // [cycle 44] bổ sung các chữ vi2han.js hay dùng nhưng thiếu → hết dead-end "nhập nét tay": 熙/五/格
  熙: 14, 五: 5, 格: 10,
  // [loop 1029] bổ sung ngũ hành + simplified thường thiếu (康熙 nét): 木/火/土 + 东(東8)/马(馬10)/龙(龍16)
  木: 4, 火: 4, 土: 3, 东: 8, 马: 10, 龙: 16,
  // [loop 1035] bổ sung Han tự tên phổ biến (康熙 verified): 瓊20/藍20/魁14/娟10/然12/純10
  瓊: 20, 藍: 20, 魁: 14, 娟: 10, 然: 12, 純: 10,
  // [loop 1036] +Han tự tên phổ biến (康熙 verified): 碧14/菊14/蓮17/端14/惠12/詩13/節15/圭6/雅12/桂10/貞9/祥11/元4/幸8/圓13/吉6
  碧: 14, 菊: 14, 蓮: 17, 端: 14, 惠: 12, 詩: 13, 節: 15, 圭: 6, 雅: 12, 桂: 10, 貞: 9, 祥: 11, 元: 4, 幸: 8, 圓: 13, 吉: 6,
  // [loop 1037] +họ phổ biến (康熙 verified): 李7/朱6/蘇22/鍾17
  李: 7, 朱: 6, 蘇: 22, 鍾: 17,
  // [loop 1047] +10 chữ tên (康熙): 柏9/登12/定8/同6/克7/科9/才4
  柏: 9, 登: 12, 定: 8, 同: 6, 克: 7, 科: 9, 才: 4,
  // [loop 1048] +7 Han tự tên (康熙): 名6/江7/力2/議20/辛7/王4
  名: 6, 江: 7, 力: 2, 議: 20, 辛: 7, 王: 4,
  // [loop 1049] +4 (康熙): 昭9/章11/基11/甲5
  昭: 9, 章: 11, 基: 11, 甲: 5,
  // [loop 1051] +2 (康熙): 通14/協8
  通: 14, 協: 8,
  // [loop 1067] +3 (康熙 verified): 庚8/戰16/達16
  庚: 8, 戰: 16, 達: 16,
  // [loop 1068] +3 final (康熙 verified): 艷24/藝21/審15
  艷: 24, 藝: 21, 審: 15,
};

// ---- 81 SỐ LÝ 吉凶 ----
// Đại cát / Cát / Bình / Hung / Đại hung
const JI = { 1:1,3:1,5:1,6:1,7:1,8:1,11:1,13:1,15:1,16:1,21:1,23:1,24:1,25:1,29:1,31:1,32:1,33:1,35:1,37:1,39:1,41:1,45:1,47:1,48:1,52:1,57:1,61:1,63:1,65:1,67:1,68:1,73:1,75:1,81:1 };
const DAJI = { 1:1,11:1,13:1,15:1,16:1,21:1,23:1,24:1,25:1,31:1,32:1,33:1,35:1,37:1,39:1,41:1,45:1,47:1 };
const BINH = { 17:1,18:1,38:1,51:1,55:1,58:1,71:1,72:1,77:1 };
function luckOf(n) {
  if (n > 81) n = (n % 80) || 80;
  // [loop 551 FIX] n<=0 (外格=0 do 复姓复名 zong===ren, hoặc NaN) → Bình, KHÔNG ép =1 → Đại cát.
  if (!(n > 0)) return { lv: 'Bình', cls: 'mid' };
  if (DAJI[n]) return { lv: 'Đại cát', cls: 'cat' };
  if (JI[n]) return { lv: 'Cát', cls: 'cat' };
  if (BINH[n]) return { lv: 'Bình', cls: 'mid' };
  if (n === 4 || n === 14 || n === 34 || n === 44) return { lv: 'Đại hung', cls: 'hung' };
  return { lv: 'Hung', cls: 'hung' };
}
// Ngũ hành theo chữ số cuối: 1,2=Mộc; 3,4=Hỏa; 5,6=Thổ; 7,8=Kim; 9,0=Thủy
function wxOf(n) { const d = n % 10; return { 1: '木', 2: '木', 3: '火', 4: '火', 5: '土', 6: '土', 7: '金', 8: '金', 9: '水', 0: '水' }[d]; }

// Sinh khắc
const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };
function rel(a, b) { if (a === b) return 'tỷ'; if (SHENG[a] === b) return 'sinh'; if (SHENG[b] === a) return 'sinh ra'; if (KE[a] === b) return 'khắc'; if (KE[b] === a) return 'khắc ra'; return 'bình'; }

/**
 * Phân tích tên theo 五格剖象.
 * @param {string[]} chars - mảng ký tự Hán (姓 + tên), vd ['阮','文','英']
 * @param {object} strokeOverride - { '阮': 12, ... } ghi đè nét
 * @param {object} yong - (tuỳ chọn) Dụng Thần lá số để đối chiếu bổ mệnh
 */
export function analyzeName(chars, strokeOverride, yong) {
  const ov = strokeOverride || {};
  const st = chars.map((c) => (ov[c] != null ? ov[c] : (STROKES[c] != null ? STROKES[c] : null)));
  const missing = chars.map((c, i) => (st[i] == null ? c : null)).filter(Boolean);
  // Nếu thiếu nét → trả yêu cầu nhập
  if (missing.length) {
    return { needStrokes: true, missing, hint: `Chưa có nét康熙 của: ${missing.join(' ')}. Hãy nhập nét (tra康熙字典).` };
  }
  const n = st.length;
  // [loop 551 FIX] guard đầu vào — cần ít nhất họ + 1 chữ tên.
  if (n < 2) return { error: 'Tên cần ít nhất họ + 1 chữ tên.', needStrokes: false };
  // Giả định: 1 chữ họ (chuẩn Việt Nam), còn lại là tên.
  const S = st[0];
  // 五 cách (họ đơn)
  const tian = S + 1;
  const ren = S + st[1];
  const di = (n === 2) ? (st[1] + 1) : st.slice(1).reduce((a, b) => a + b, 0);
  const zong = st.reduce((a, b) => a + b, 0);
  // [loop 551 FIX] 单姓单名 (n===2) → 外格 = 2 (hằng số 五格剖象), không phải zong-ren+1=1.
  //   Trước đây wai=1 → luckOf(1)=Đại cát (SAI, phải luckOf(2)=Hung).
  const wai = (n === 2) ? 2 : Math.max(1, zong - ren + 1);

  const grids = [
    { key: 'tian', vi: '天格 Thiên Cách (tiên tổ)', n: tian, role: 'cội nguồn họ, ảnh hưởng nhẹ' },
    { key: 'ren', vi: '人格 Nhân Cách (chủ vận)', n: ren, role: 'TRỌNG TÂM — tính cách, vận cả đời' },
    { key: 'di', vi: '地格 Địa Cách (tiền vận)', n: di, role: 'thời trẻ (<35t)' },
    { key: 'wai', vi: '外格 Ngoại Cách (phụ vận)', n: wai, role: 'quan hệ ngoài, xã giao' },
    { key: 'zong', vi: '总格 Tổng Cách (hậu vận)', n: zong, role: 'trung–vãn niên (35t+)' },
  ].map((g) => ({ ...g, wx: wxOf(g.n), luck: luckOf(g.n) }));

  // Tam tài = Thiên/Nhân/Địa ngũ hành
  const tWx = wxOf(tian), rWx = wxOf(ren), dWx = wxOf(di);
  const sancai = { tian: tWx, ren: rWx, di: dWx };
  // Xét chuỗi sinh khắc 天→人→地
  const r1 = rel(tWx, rWx), r2 = rel(rWx, dWx);
  let sancaiLuck;
  if ((r1 === 'sinh' || r1 === 'tỷ' || r1 === 'sinh ra') && (r2 === 'sinh' || r2 === 'tỷ' || r2 === 'sinh ra')) sancaiLuck = 'Cát';
  else if ((r1 === 'khắc' || r1 === 'khắc ra') && (r2 === 'khắc' || r2 === 'khắc ra')) sancaiLuck = 'Hung';
  else sancaiLuck = 'Bình';

  // Chấm điểm tổng
  let score = 50;
  for (const g of grids) {
    if (g.luck.lv === 'Đại cát') score += 9;
    else if (g.luck.lv === 'Cát') score += 5;
    else if (g.luck.lv === 'Hung') score -= 6;
    else if (g.luck.lv === 'Đại hung') score -= 10;
  }
  // Nhân Cách & Tổng Cách hệ số cao
  if (grids[1].luck.lv === 'Đại cát') score += 4;
  if (grids[4].luck.lv === 'Đại cát') score += 4;
  if (sancaiLuck === 'Cát') score += 8; else if (sancaiLuck === 'Hung') score -= 8;
  score = Math.max(5, Math.min(98, Math.round(score)));

  // Đối chiếu Dụng Thần: ngũ hành tên (Nhân + Tổng) có补 Dụng không
  let vsYong = null;
  if (yong) {
    const nameWx = [rWx, dWx];
    const dungHit = nameWx.includes(yong.primary) || nameWx.includes(yong.xi);
    const kyHit = nameWx.includes(yong.ji) || nameWx.includes(yong.chou);
    vsYong = {
      dungHit, kyHit,
      msg: dungHit && !kyHit ? `✓ Tên mang hành Dụng/Hỷ (${WX_VI[yong.primary]}${WX_VI[yong.xi] ? '/' + WX_VI[yong.xi] : ''}) → BỔ MỆNH, rất tốt.`
        : kyHit ? `✗ Tên mang hành Kỵ/Thù (${WX_VI[yong.ji]}) → bất lợi mệnh, nên đổi tên/chữ.`
          : `• Tên trung tính với Dụng Thần — nên ưu tiên chữ mang hành ${WX_VI[yong.primary]} (Dụng).`,
    };
  }

  return { chars, strokes: st, grids, sancai, sancaiLuck, score, vsYong, needStrokes: false };
}

export { wxOf, luckOf, SHENG, KE };
