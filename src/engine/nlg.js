// ============================================================================
//  TẦNG LUẬN GIẢI LINH HOẠT (Natural Language Generation)
//  Nhận câu hỏi TỰ DO → định danh ý định → soạn câu trả lời cụ thể dựa trên
//  TOÀN BỘ lá số (cách cục, hội hợp, thần sa, dụng thần, đại vận, lưu niên)
//  + Cơ sở tri thức kb.js. Cùng lá số + cùng câu hỏi ⇒ cùng câu trả lời.
// ============================================================================
import { WX_VI, GAN, ZHI, SHENG, KE, KE_BY, TEN_GOD_VI } from './constants.js';
import { analyzeLiunianDeep } from './liunian-pro.js';
import { scanMarriageTiming } from './marriage-timing.js';
import { scanWealthCareerYingqi } from './yingqi-wealth.js';
import { jiaoYunAnalysis } from './jiaoyun.js';
import { decadeForecast } from './decade-forecast.js';
import { cezi } from './cezi.js';
import { castByTime, solarToMhNums } from './meihua.js';
import { predictEvents } from './event-predict.js';
import { guiguziFortune } from './guiguzi.js';
import { guiguziFDG } from './guiguzi-fdg.js';
import { hexagramSynthesis } from './hexagram-synthesis.js';
import { computeLiuDao } from './liudao.js';
import { dayNayinPersonality } from './nayin-personality.js';
import { analyzeTaohua } from './taohua.js';
import { marriageStars } from './marriage-stars.js';
import { starPower } from './star-power.js';
import { dominantGod } from './dominant-god.js';
import { healthAlertScan } from './health-alert.js';
import { buildRemedy } from './remedy.js';
import { WX_INFO, DM_PROFILE } from './interpret.js';
import {
  TEN_GOD_DEEP, INTERACTION_MEANING, PATTERN_GUIDE, LIFE_AREA_INDEX, dominantGods, DITIANSUI,
} from './kb.js';
// 5 module bổ sung (dùng cho supplements trong các pXxx)
import { chenggu } from './chenggu.js';
import { analyzeLiunian12 } from './liunian-12shen.js';
import { analyzeMangpaiView } from './mangpai-view.js';

const hanviet = (gz) => gz.split('').map((c) => (GAN[c]?.vi || ZHI[c]?.vi || c)).join(' ');
const wxVi = (w) => WX_VI[w];
const godViShort = (g) => TEN_GOD_VI[g] || g;
const favText = (yong) => [...new Set([yong.primary, yong.xi].filter(Boolean))].map((w) => `${wxVi(w)} (${w})`).join(' & ');
// [loop 46] giải thích TẠI SAO Dụng Thần được chọn (调候/病药/扶抑/从格) — user hiểu cơ sở luận giải
const yongExplain = (R) => {
  const y = R.yong;
  if (!y?.method?.length) return '';
  // [loop 120 fix] thêm Cách cục đặc biệt (从格/专旺) — trước đây missed → "Phù Ức" SAI cho 从格
  const hasSpecial = y.method.some((m) => m.includes('Cách cục đặc biệt'));
  const hasTiao = y.method.some((m) => /Điều Hậu.*LÀM CHỦ/.test(m));
  const hasBYao = y.method.some((m) => /Bệnh Dược.*LÀM CHỦ/.test(m));
  if (hasSpecial) {
    const pv = R.pattern?.vi || 'cách đặc biệt';
    return `Dụng Thần ${wxVi(y.primary)} được chọn vì CÁCH CỤC ĐẶC BIỆT — ${pv}: «thuận thế cục», theo thế mạnh của mệnh mà dùng (KHÔNG luận Phù Ức vượng suy hay 调候 — «从格不论调候»).`;
  }
  if (hasTiao) return `Dụng Thần ${wxVi(y.primary)} được chọn vì ĐIỀU HẬU (调候) — bạn sinh mùa cực đoan (hàn/nhiệt), 穮通宝鑑 bắt buộc dùng hành ${wxVi(y.primary)} để điều hòa khí hậu, đè Phù Ức.`;
  if (hasBYao) return `Dụng Thần ${wxVi(y.primary)} được chọn vì BỆNH DƯỢC (病药) — mệnh «bại trung hữu thành», hành ${wxVi(y.primary)} là THUỐC chữa bệnh cách cục («có bệnh mới là quý»).`;
  return `Dụng Thần ${wxVi(y.primary)} được chọn theo PHÙ ỨC (扶抑) — cân bằng vượng suy của Nhật Chủ.`;
};
const avoidText = (yong) => [...new Set(yong.avoid)].map((w) => `${wxVi(w)} (${w})`).join(' & ');

// ---------------------------------------------------------------------------
//  1. ĐỊNH DANH Ý ĐỊNH từ câu hỏi
// ---------------------------------------------------------------------------
const INTENT_KEYWORDS = {
  career: ['sự nghiệp', 'công việc', 'công danh', 'thăng tiến', 'nghề', 'làm ăn', 'kinh doanh', 'chức', 'sếp', 'đi làm', 'nghỉ việc', 'đổi việc', 'thăng chức', 'khởi nghiệp', 'mở công ty'],
  wealth: ['tài', 'tiền', 'của cải', 'giàu', 'lộc', 'đầu tư', 'tài chính', 'phát tài', 'làm giàu', 'kiếm tiền', 'kinh tế', 'nợ', 'lãi'],
  love: ['tình', 'duyên', 'hôn nhân', 'vợ', 'chồng', 'người yêu', 'kết hôn', 'cưới', 'gia đạo', 'ly hôn', 'đào hoa', 'phối ngẫu', 'tái hôn', 'lấy vợ', 'lấy chồng', 'gặp duyên', 'độc thân'],
  health: ['sức khỏe', 'bệnh', 'ốm', 'tạng', 'dưỡng sinh', 'thể chất', 'thọ', 'tai nạn', 'đau', 'ăn gì', 'thực phẩm', 'chế độ ăn'],
  study: ['học', 'thi', 'bằng cấp', 'trí tuệ', 'kiến thức', 'sáng tạo', 'trường', 'đại học', 'luận văn', 'nghiên cứu'],
  children: ['con', 'con cái', 'sinh con', 'có con', 'quý tử', 'hậu duệ', 'thai'],
  family: ['gia đình', 'cha mẹ', 'anh em', 'ruột thịt', 'thân thuộc', 'mẹ', 'bố', 'cha'],
  travel: ['đi xa', 'xuất khẩu', 'nước ngoài', 'di cư', 'du lịch', 'dịch chuyển', 'định cư', 'xa nhà', 'lao động'],
  power: ['quyền', 'lãnh đạo', 'uy quyền', 'chức quyền', 'ảnh hưởng', 'địa vị', 'quyết định'],
  timing: ['vận', 'đại vận', 'thời điểm', 'năm nào', 'tuổi', 'lúc nào', 'tương lai', 'khi nào', 'tháng', 'năm nay', 'năm sau'],
  personality: ['tính cách', 'bản mệnh', 'con người', 'tướng', 'khí chất', 'bản chất', 'người như thế nào', 'cấu hình', 'cách cục', 'sát ấn', 'thương quan', 'quan sát', 'tỷ kiếp', '格局', 'dụng thần', 'kỵ thần', 'hỷ thần', 'ngũ hành'],
  remedy: ['cải mệnh', 'cải vận', 'làm sao để', 'nên làm gì', 'làm gì', 'cách', 'hóa giải', 'tăng', 'giảm', 'tránh', 'phương pháp', 'khắc phục', 'thay đổi', 'cải thiện', 'khai vận', 'bổ mệnh', 'sống ở đâu', 'thành phố', 'phong thủy', 'mua nhà', 'mua đất', 'bất động sản', 'màu', 'màu sắc', 'hết xui', 'giải xui', 'đổi vận'],
  flow: ['dòng khí', 'lưu thông', 'khí mệnh', 'nguồn khí', 'dòng chảy', 'thông khí', '源流', 'khí lưu', 'nguồn lực mệnh', 'tắc khí'],
  divination: ['gieo quẻ', '起卦', '占', 'lắc quẻ', 'quẻ dịch', 'bói quẻ', 'meihua', 'thảo quẻ', 'quẻ hôm', '测字', 'châm tự', 'xem chữ', 'phép bói'],
};

export function detectIntent(question) {
  const t = (question || '').toLowerCase();
  const norm = t.normalize('NFD').replace(/[̀-ͯ]/g, ''); // bỏ dấu để match thoáng
  const years = (question.match(/(19|20)\d{2}/g) || []).map(Number);
  const isTiming = /\b(khi nao|luc nao|nam nao|thang nao|nam nay|nam sau|bao gio)\b/.test(norm) || years.length > 0;
  const isYesNo = /\b(co nen|co duoc khong|nen khong|duoc khong|co tot khong|co xau khong|co the|lieu co)\b/.test(norm);
  const isCompat = /\b(hop khong|hop nhau|xung khac|theo khong|phu hop)\b/.test(norm);
  // [loop 619] family question detection
  const isFamily = /\b(me toi|bo toi|me cua|bo cua|em toi|em cua|chau toi|con toi|anh toi|chi toi|nguoi than|gia dinh)\b/.test(norm)
    || /\b(me|bo|em|chau|con|anh|chi)\b.*\b(the nao|ra sao|tuong quan|hop khong|menh gi|dung gi)\b/.test(norm);
  // [loop 497] divination intent (起卦/测字 CJK ngắn → confidence <3 → bypass như isCompat)
  const isDivination = /gieo que|lac que|que dich|boi que|thao que|cham tu|luc nh|ky mon|don giap/.test(norm) || /起卦|测字|占卦|占卜|六壬|奇门|遁甲/.test(question);

  let area = 'general', bestHits = 0;
  for (const [id, kws] of Object.entries(INTENT_KEYWORDS)) {
    let hits = 0;
    for (const k of kws) {
      const kn = k.normalize('NFD').replace(/[̀-ͯ]/g, '');
      // chấm theo độ dài từ khóa: từ càng dài càng cụ thể (tránh "tinh" khớp "tinh cach")
      if (norm.includes(kn)) hits += kn.length;
    }
    if (hits > bestHits) { bestHits = hits; area = id; }
  }
  // confidence: bestHits tổng độ dài từ khoá khớp. <3 = không khớp rõ → câu tự do/khó hiểu
  const confidence = bestHits;
  return { area, years, isTiming, isYesNo, isCompat, isDivination, isFamily, confidence, raw: question };
}

// ---------------------------------------------------------------------------
//  2. TIỆN ÍCH tra présence sao / thần sa
// ---------------------------------------------------------------------------
function godScore(chart) {
  const c = {};
  for (const key of ['year', 'month', 'time']) {
    const g = chart.pillars[key].ganGod;
    if (g && g !== '日主') c[g] = (c[g] || 0) + 1;
  }
  for (const key of ['year', 'month', 'day', 'time']) {
    const main = chart.pillars[key].hidden[0];
    c[main.god] = (c[main.god] || 0) + 0.5;
  }
  delete c['日主'];
  return c;
}
const hasShen = (R, key) => !!(R.shensha && R.shensha[key]);

// ---------------------------------------------------------------------------
//  3. CÁC BỘ SOẠN THEO LĨNH VỰC (mỗi hàm → {title, paragraphs})
// ---------------------------------------------------------------------------
function pPersonality(R) {
  const dm = R.chart.dayMaster;
  const top = dominantGods(R.chart, 2);
  const dt = DITIANSUI[dm.gan];
  const paras = [
    `「${dt.verse}」 — 滴天髓 luận ${dm.gan} ${dm.vi}. ${dt.vi}`,
    `Bản chất sâu: ${dt.nature}`,
    `Thập Thần nổi bật: ${top.map((g) => `${g.vi} (${g.n})`).join(', ')} — ${top.map((g) => TEN_GOD_DEEP[g.god]?.nature).join(' ')}`,
    top[0] && TEN_GOD_DEEP[top[0].god] ? (R.strength.strong ? `Vượng: ${TEN_GOD_DEEP[top[0].god].vuong}` : `Nhược: ${TEN_GOD_DEEP[top[0].god].nhuoc}`) : '',
    `Cách cục ${R.pattern.vi}. Nhu cầu khai vận: ${dt.need}.`,
  ].filter(Boolean);
  // Session supplement: 称骨 (bone-weight divination)
  try { const cg = chenggu(R); paras.push(`🦴 称骨: ${cg.totalStr} = ${cg.summary.tier} — ${cg.summary.note}`); } catch (e) {}
  return { title: 'Bản mệnh & tính cách', paragraphs: paras };
}

function pCareer(R) {
  const yong = R.yong;
  const gods = godScore(R.chart);
  const guan = (gods['正官'] || 0) + (gods['七殺'] || 0);
  const officerWx = yong.relations.officerWx;
  const favCareer = [...new Set([yong.primary, yong.xi].filter(Boolean))];
  const pq = R.patternQuality;
  const lines = [];
  const yExpC = yongExplain(R);
  if (yExpC) lines.push(`💡 ${yExpC}`);
  // [loop 17] 格局-aware opening
  const gejuCtx = pq ? ` Cách ${R.pattern.vi} → ${pq.quality}.` : '';
  lines.push(`Sự nghiệp lấy Quan – Ấn làm sao chủ.${gejuCtx} Mệnh bạn Quan Sát ${guan >= 1.5 ? 'hiện rõ, có khí chất lãnh đạo/địa vị' : guan > 0 ? 'có nhưng hơi mỏng' : 'ẩn/khuyết — sự nghiệp tự thân gây dựng nhiều hơn nhờ lộc'}.`);
  // [loop 17/18 sửa bug] 格局 pattern-specific advice
  //   patternYong.xi/ji là array object {group,wx,vi} (KHÔNG phải string) → dùng .vi trực tiếp.
  if (pq?.patternYong) {
    const xiG = pq.patternYong.xi || [];
    const jiG = pq.patternYong.ji || [];
    const lbl = (g) => g?.vi || g?.group || g;
    if (xiG.length) lines.push(`📊 Theo cách ${R.pattern.vi}: vận mang ${xiG.map(lbl).join('/')} → thuận sự nghiệp; mang ${jiG.map(lbl).join('/')} → nghịch.`);
  }
  // [loop 17] RESCUES decade cho career
  const rescueDy = (R.dayun || []).filter((d) => d.gejuRescue);
  if (rescueDy.length) lines.push(`★ Vận CỨU CÁCH: ${rescueDy.map((d) => `${hanviet(d.ganZhi)} [${d.startAge}-${d.startAge + 9}t]`).join(', ')} — cửa sổ cơ hội sự nghiệp lớn nhất.`);
  lines.push(R.strength.strong
    ? `Thân vượng, đủ sức gánh Quan – Tài, hợp môi trường cạnh tranh, giữ vị trí quản lý hoặc tự làm chủ.`
    : `Thân nhược, nên chọn nơi ổn định, có quý nhân/Ấn dìu dắt, tích lũy rồi mới tiến; tránh ôm đồm quyền cao chức trọng.`);
  if (hasShen(R, 'jiangXing')) lines.push(`🌟 Có Tướng Tinh → tiềm năng lãnh đạo, chỉ huy.`);
  lines.push(`Ngành nghề hợp Dụng Thần (${favText(yong)}): ${favCareer.map((w) => WX_INFO[w].nghe).join('; ')}.`);
  lines.push(`Phương vị tốt cho văn phòng: ${WX_INFO[yong.primary].huong}; bàn làm việc hướng về phương này tăng trợ lực. Màu ${WX_INFO[yong.primary].mau}.`);
  // Session module supplements
  try { const dg = dominantGod(R); const t = dg.tendency; if (t) lines.push(`🎯 Sao chủ đạo: ${dg.dominant.godVi} → tuýp «${t.traits.slice(0, 40)}». Nghề hợp: ${t.career.split(',')[0]}.`); } catch (e) {}
  try { const sp = starPower(R); const quan = sp.items.find((x) => x.key === 'guan'); if (quan) lines.push(`💼 Sao Quan (${quan.wxVi}): ${quan.verdict} (căn ${quan.root}, lộ ${quan.reveal}) — ${quan.verdict === '有力' ? 'sự nghiệp THẬT, có nền tảng' : quan.verdict === '藏而不透' ? 'có nền nhưng ẩn — đợi thời' : 'hư/yếu — cần tự gây dựng'}.`); } catch (e) {}
  // Session supplement: 盲派象法 perspective on 财/官 host-guest + 禄
  try { const mp = analyzeMangpaiView(R); lines.push(`👁 盲派: 禄(${mp.luAnalysis.luZhi}/${mp.luAnalysis.luZhiVi})${mp.luAnalysis.present ? '@' + (mp.luAnalysis.positionVi || '?') : '无'} | 财 ${mp.hostGuest.groups['财'].sitsAt} | ${mp.deeds.dynamismVi.split(' — ')[0]}.`); } catch (e) {}
  return { title: 'Sự nghiệp & công danh', paragraphs: lines };
}

function pWealth(R) {
  const yong = R.yong;
  const gods = godScore(R.chart);
  const cai = (gods['正財'] || 0) + (gods['偏財'] || 0);
  const wealthWx = yong.relations.wealthWx;
  const isFav = yong.primary === wealthWx || yong.xi === wealthWx;
  const isAvoid = yong.avoid.includes(wealthWx);
  const pq = R.patternQuality;
  const lines = [];
  const yExpW = yongExplain(R);
  if (yExpW) lines.push(`💡 ${yExpW}`);
  // [loop 17] 格局-aware opening
  const gejuCtx = pq ? ` Cách ${R.pattern.vi} → ${pq.quality}.` : '';
  lines.push(`Tài lộc lấy Tài tinh (hành ${wxVi(wealthWx)}) làm chủ.${gejuCtx} Mệnh ${cai >= 1.5 ? 'Tài vượng, cơ hội tiền bạc nhiều' : cai > 0 ? 'Tài vừa phải' : 'Tài mỏng — phải chủ động tìm'}.`);
  // [loop 17/18 sửa bug] 格局 pattern-specific wealth advice
  //   patternYong.xi/ji là array object {group,wx,vi} (KHÔNG phải string) → dùng .vi trực tiếp.
  if (pq?.patternYong) {
    const xiG = pq.patternYong.xi || [];
    const jiG = pq.patternYong.ji || [];
    const lbl = (g) => g?.vi || g?.group || g;
    if (xiG.length) lines.push(`📊 Theo cách ${R.pattern.vi}: vận mang ${xiG.map(lbl).join('/')} → thuận tài lộc; mang ${jiG.map(lbl).join('/')} → nghịch tài.`);
  }
  // [loop 17] RESCUES decade cho tài
  const rescueDy = (R.dayun || []).filter((d) => d.gejuRescue);
  if (rescueDy.length) lines.push(`★ Vận CỨU CÁCH (tài lộc bật): ${rescueDy.map((d) => `${hanviet(d.ganZhi)} [${d.startAge}-${d.startAge + 9}t]`).join(', ')}.`);
  if (R.strength.strong) lines.push(`Thân vượng nhậm được tài — càng làm càng giữ, hợp kinh doanh/đầu tư chủ động.`);
  else lines.push(`Thân nhược gặp Tài vượng dễ "tài đa thân nhược", tiền qua tay khó giữ; nên hùn hạp, cộng sự, tránh đòn bẩy/nợ lớn.`);
  if (isFav) lines.push(`🎉 Tài chính là Dụng Thần → chủ động cầu tài rất hiệu, tài vận sáng.`);
  else if (isAvoid) lines.push(`⚠️ Tài nằm trong Kỵ Thần → đừng tham liều; giữ tiền qua kênh Dụng Thần (${favText(yong)}) mới bền.`);
  lines.push(`Kênh tích tài thiên về lĩnh vực hành ${favText(yong)}; màu ví/tài khoản hợp: ${WX_INFO[yong.primary].mau}.`);
  // Session module supplements
  try { const sp = starPower(R); const tai = sp.items.find((x) => x.key === 'cai'); if (tai) lines.push(`💰 Sao Tài (${tai.wxVi}): ${tai.verdict} (căn ${tai.root}, lộ ${tai.reveal}) — ${tai.verdict === '有力' ? 'sao THẬT, tài vượng' : tai.verdict === '藏而不透' ? 'có nền nhưng ẩn — đợi lưu niên thấu (can ' + ['甲乙','丙丁','戊己','庚辛','壬癸'][['木','火','土','金','水'].indexOf(tai.wx)] + ') mới phát' : 'hư/yếu — cần bù mạnh qua Dụng'}.`); } catch (e) {}
  try { const wc = scanWealthCareerYingqi(R, new Date().getFullYear(), 8); if (wc.caiYears.length) lines.push(`📅 Năm Tài kích hoạt: ${wc.caiYears.map((y) => y.year).join(', ')} — cơ hội tài chính.`); } catch (e) {}
  return { title: 'Tài lộc & tiền bạc', paragraphs: lines };
}

function pLove(R) {
  const { chart, yong } = R;
  const isMale = chart.input.gender === 'nam';
  const spouseWx = isMale ? KE[chart.dayMaster.wx] : KE_BY[chart.dayMaster.wx];
  const spouseStar = isMale ? 'Tài (vợ)' : 'Quan Sát (chồng)';
  const spouseCat = isMale ? 'cai' : 'guan'; // [loop 18] nhóm thập thần của sao phối ngẫu để map 格局喜忌
  const dayZhi = chart.pillars.day.zhi;
  const dayZhiGod = chart.pillars.day.hidden[0].god;
  const isFav = yong.primary === spouseWx || yong.xi === spouseWx;
  const isAvoid = yong.avoid.includes(spouseWx);
  const pq = R.patternQuality;
  const lines = [];
  // [loop 18] 格局-aware opening
  const gejuCtx = pq ? ` Cách ${R.pattern.vi} → ${pq.quality}.` : '';
  lines.push(`Với ${isMale ? 'nam' : 'nữ'} mệnh, sao hôn nhân là ${spouseStar} (hành ${wxVi(spouseWx)}). Cung phu thê (Nhật Chi) = ${dayZhi} (${ZHI[dayZhi].vi}), tàng ${TEN_GOD_VI[dayZhiGod] || dayZhiGod}.${gejuCtx}`);
  // [loop 18] 格局 pattern-specific love advice — xem sao phối ngẫu thuộc nhóm 喜 hay 忌 của cách
  //   patternYong.xi/ji là array object {group,wx,vi} → match theo g.group với spouseCat.
  if (pq?.patternYong) {
    const xiG = pq.patternYong.xi || [];
    const jiG = pq.patternYong.ji || [];
    const inJi = jiG.some((g) => g.group === spouseCat);
    const inXi = xiG.some((g) => g.group === spouseCat);
    if (inJi) lines.push(`📊 Theo cách ${R.pattern.vi}: sao phối ngẫu (${spouseCat === 'cai' ? 'Tài' : 'Quan Sát'}) ∈ KỴ của cách → hôn nhân dễ làm phá cách/mang rắc rối; nên kết hôn muộn, chọn người khắc chế được.${pq.quality?.includes('败') ? ' Lại thêm CÁCH BẠI → duyên càng cần thận trọng.' : ''}`);
    else if (inXi) lines.push(`📊 Theo cách ${R.pattern.vi}: sao phối ngẫu (${spouseCat === 'cai' ? 'Tài' : 'Quan Sát'}) ∈ THÍCH của cách → duyên lành, hôn nhân giúp làm nên cách.${pq.quality?.includes('成') ? ' Cách THÀNH gặp sao phối ngẫu tốt → 门当户对, nên cưới.' : ''}`);
  }
  if (isFav) lines.push(`💕 Sao phối ngẫu = Dụng Thần → hôn nhân là trợ lực lớn, bạn đời mang lại may mắn.`);
  else if (isAvoid) lines.push(` Sao phối ngẫu ∈ Kỵ Thần → duyên cần chọn lọc, dễ thử thách; nên kết hôn muộn, ưu tiên người mệnh bổ trợ Dụng Thần.`);
  else lines.push(`Sao phối ngẫu trung tính → hôn nhân thuận theo sự vun đắp của hai bên.`);
  // [loop 18] RESCUES decade cho tình duyên — khi vận CỨU CÁCH, duyên lành/hôn nhân dễ thành
  const rescueDy = (R.dayun || []).filter((d) => d.gejuRescue);
  if (rescueDy.length) lines.push(`★ Vận CỨU CÁCH (duyên lành bật): ${rescueDy.map((d) => `${hanviet(d.ganZhi)} [${d.startAge}-${d.startAge + 9}t]`).join(', ')} — cửa sổ cưới hỏi/hàn gắn tốt nhất.`);
  if (hasShen(R, 'taoHua')) lines.push(`🌸 Có Đào Hoa → duyên sắc tốt, dễ hấp dẫn người khác giới (lợi giao tế, cẩn thận đào hoa lệch).`);
  // xung/hình Nhật chi → biến động gia đạo
  const dayClash = R.interactions.chong.find((c) => (c.at && c.at.includes('Ngày')) || c.a === dayZhi || c.b === dayZhi);
  if (dayClash) lines.push(`⚡ Nhật Chi bị xung (${dayClash.a}↔${dayClash.b}) → gia đạo/hôn nhân dễ biến động, cần bao dung.`);
  lines.push(`Người hợp thường mang hành ${favText(yong)}; phương ${WX_INFO[yong.primary].huong} lợi cho hẹn hò/cưới.`);
  // Session module supplements
  try { const th = analyzeTaohua(R); if (th.positions.length) lines.push(`🌸 Phân loại đào hoa ${th.taohuaZhi} tại ${th.positions.map((p) => p.vi).join(', ')} → ${th.verdict === '烂桃花' ? 'LẠN ĐÀO HOA (duyên hão/dữ, cẩn thận mất tiền vì tình)' : th.verdict === '正桃花' ? 'CHÍNH ĐÀO HOA (duyên lành)' : 'đào hoa trung tính'}.`); } catch (e) {}
  try { const ms = marriageStars(R); if (ms.hits.length) lines.push(`⚠ Sao hôn nhân cổ: ${ms.hits.map((h) => h.starVi + '@' + h.pillarVi).join(', ')} — ${ms.summary.split('.')[0]}.`); } catch (e) {}
  return { title: 'Tình duyên & hôn nhân', paragraphs: lines };
}

function pHealth(R) {
  const entries = Object.entries(R.wx.pct).sort((a, b) => a[1] - b[1]);
  const weak = entries[0], strong = entries[entries.length - 1];
  const pq = R.patternQuality;
  // [loop 18] 格局 — "bệnh" của cách (diseases) phản ánh thiên lệch nguyên cục → cơ quan dễ suy trước
  const diseaseLines = [];
  if (pq?.diseases?.length) {
    diseaseLines.push(`⚠️ Theo cách ${R.pattern.vi} → ${pq.quality}: mệnh có ${pq.diseases.length} "bệnh" (${pq.diseases.map((d) => d.note.split(' — ')[0]).join('; ')}) → thể chất có chỗ thiên lệch, dễ suy trước tạng bị khắc. Nên khám định kỳ, dưỡng sinh quanh năm.`);
    const hasRescue = pq.rescues?.length > 0;
    if (hasRescue) diseaseLines.push(`✅ Cách có CỨU CÁCH (có "thuốc" tự bù) → thể chất có khả năng phục hồi; chỉ cần giữ gìn thì "bệnh" không đến mức.`);
    else diseaseLines.push(`⚠️ Cách thiếu cứu ứng → "bệnh" dễ mãn tính; ưu tiên bù Dụng Thần ${favText(R.yong)} qua ăn ở cả đời, không đợi vận mới chăm.`);
    // giai đoạn phục hồi mạnh = vận CỨU CÁCH (giống pWealth/pCareer)
    const rescueDy = (R.dayun || []).filter((d) => d.gejuRescue);
    if (rescueDy.length) diseaseLines.push(`★ Thập niên phục hồi sức khoẻ tốt: ${rescueDy.map((d) => `${hanviet(d.ganZhi)} [${d.startAge}-${d.startAge + 9}t]`).join(', ')}.`);
  }
  const lines = [
    `Sức khỏe theo cân bằng Ngũ Hành. Hành yếu nhất ${wxVi(weak[0])} (${weak[1]}%) → lưu ý ${WX_INFO[weak[0]].tang}.`,
    `Hành vượng nhất ${wxVi(strong[0])} (${strong[1]}%) → khi thái quá dễ ảnh hưởng tạng bị khắc (${wxVi(KE[strong[0]])}: ${WX_INFO[KE[strong[0]]].tang}).`,
    `Dưỡng sinh theo Dụng Thần ${favText(R.yong)}: tăng ${WX_INFO[R.yong.primary].mau.split(',')[0]} trong ăn ở, vận động phương ${WX_INFO[R.yong.primary].huong} sáng sớm.`,
    `Tránh để hành Kỵ ${avoidText(R.yong)} lấn át; giữ điều độ hàn – nhiệt.`,
    ...diseaseLines,
  ];
  // Session supplement: năm nay sức khoẻ sao?
  try { const ha = healthAlertScan(R, 1); if (ha.alerts.length) { const cur = ha.alerts[0]; lines.push(`🏥 Năm ${cur.year}: sức khoẻ ${cur.level}${cur.reasons.length ? ' — ' + cur.reasons.slice(0, 2).join('; ') : ''}.`); } else if (ha.safeYears.length) { lines.push(`🏥 Năm ${ha.safeYears[0].year}: sức khoẻ tương đối ổn — duy trì dưỡng sinh.`); } } catch (e) {}
  return { title: 'Sức khỏe & dưỡng sinh', paragraphs: lines };
}

function pStudy(R) {
  const gods = godScore(R.chart);
  const an = (gods['正印'] || 0) + (gods['偏印'] || 0);
  const shi = (gods['食神'] || 0) + (gods['傷官'] || 0);
  const lines = [
    `Học vấn xem Ấn (bằng cấp/tư duy tiếp thu) & Thực Thương (sáng tạo/diễn đạt).`,
    an >= 1.5 ? `Ấn vượng → ham học, trí nhớ tốt, hợp học thuật/bằng cấp/nghiên cứu.` : `Ấn mỏng → nên rèn kiên trì; học qua thực hành vào nhanh hơn lý thuyết.`,
    shi >= 1.5 ? `Thực Thương vượng → giàu sáng tạo, khéo diễn đạt, hợp nghệ thuật/khởi nghiệp.` : `Thực Thương ít → mạnh ở chỉn chu, kỷ luật hơn phá cách.`,
  ];
  if (hasShen(R, 'wenChang')) lines.push(`🌟 Có Văn Xương → lợi thi cử, tư duy sắc bén.`);
  if (hasShen(R, 'xueTang')) lines.push(`📚 Có Học Đường → tư chất học hỏi tốt.`);
  lines.push(`Góc học phương ${WX_INFO[R.yong.primary].huong}, vật phẩm màu ${WX_INFO[R.yong.primary].mau} hỗ trợ tập trung.`);
  return { title: 'Học vấn & trí tuệ', paragraphs: lines };
}

function pChildren(R) {
  const isMale = R.chart.input.gender === 'nam';
  const gods = godScore(R.chart);
  const childGod = isMale ? ['正官', '七殺'] : ['食神', '傷官'];
  const childWx = isMale ? KE_BY[R.chart.dayMaster.wx] : SHENG[R.chart.dayMaster.wx];
  const cnt = childGod.reduce((s, g) => s + (gods[g] || 0), 0);
  const isFav = R.yong.primary === childWx || R.yong.xi === childWx;
  const isAvoid = R.yong.avoid.includes(childWx);
  const lines = [
    `Sao con cái: ${isMale ? 'Quan Sát (nam lấy quan sát làm con)' : 'Thực Thương (nữ lấy thực thương làm con)'} — hành ${wxVi(childWx)}. Mệnh ${cnt >= 1.5 ? 'có sao con rõ → duyên con tốt' : cnt > 0 ? 'sao con nhẹ' : 'sao con ẩn → nên chú trọng dưỡng thai theo Dụng Thần'}.`,
    isFav ? `Sao con = Dụng Thần → con cái mang lại phúc, dễ养的.` : isAvoid ? `Sao con ∈ Kỵ → thai nghén nên chọn năm mang Dụng Thần, dưỡng thai theo hành ${favText(R.yong)}.` : `Sao con trung tính.`,
    `Năm sinh con tốt: năm can chi mang hành ${favText(R.yong)} (Dụng Thần) — xem lưu niên dưới đây.`,
  ];
  return { title: 'Con cái', paragraphs: lines };
}

function pTravel(R) {
  const lines = [
    `Di chuyển/xuất khẩu xem Dịch Mã + Tài + Sát. ${hasShen(R, 'yiMa') ? '🌟 Bạn có Dịch Mã → duyên đi xa, đổi chỗ, cơ hội nước ngoài rõ.' : 'Dịch Mã không nổi → sự nghiệp thiên về tĩnh, ít biến động địa lý.'}`,
    R.yong.relations.wealthWx ? `Hành Tấy / Tài liên quan: Tài ở hành ${wxVi(R.yong.relations.wealthWx)}.` : '',
    `Hợp đi hướng phương ${WX_INFO[R.yong.primary].huong} (Dụng Thần) sẽ thuận hơn.`,
  ].filter(Boolean);
  return { title: 'Di chuyển & xuất khẩu', paragraphs: lines };
}

function pPower(R) {
  const lines = [
    `Quyền lực/lãnh đạo xem Quan Sát + Tướng Tinh. ${hasShen(R, 'jiangXing') ? '🌟 Có Tướng Tinh → khí chất chỉ huy.' : ''}`,
    R.strength.strong ? `Thân vượng + có Quan → đủ uy để lãnh đạo.` : `Thân nhược → quyền lực tốt nhất gián tiếp (cố vấn, chuyên gia) hoặc cộng tác với người mạnh.`,
  ].filter(Boolean);
  return { title: 'Quyền lực & lãnh đạo', paragraphs: lines };
}

function pTiming(R, intent) {
  const lines = [];
  const dy = R.dayun || [];
  const pq = R.patternQuality;
  // [loop 16] NLG giờ 格局-aware — khai thác 12 elevations cho user KHÔNG có AI
  const gejuLine = pq ? ` Cách ${R.pattern.vi} → ${pq.quality}.` : '';
  lines.push(`Thước đo vận hạn là Dụng Thần ${favText(R.yong)} — vận nào mang hành Dụng Thần thì hanh thông, Kỵ Thần ${avoidText(R.yong)} thì nên thủ.${gejuLine}`);
  const yExp = yongExplain(R);
  if (yExp) lines.push(`💡 ${yExp}`);
  // Nếu câu hỏi có mốc năm cụ thể → dùng phân tích đa phái + 格局 (chính xác)
  if (intent.years.length) {
    for (const yr of intent.years) {
      try {
        const d = analyzeLiunianDeep(R, yr, pq?.patternYong);
        const warns = d.schools.filter((s) => s.d < -8).map((s) => s.note.slice(0, 60)).join('; ');
        // [loop 16] trích 格局 tag từ kết quả
        const gejuTag = d.gejuFavor === '喜' ? ' ★THUẬN CÁCH' : d.gejuFavor === '忌' ? ' ⚠GHÉT CÁCH' : '';
        lines.push(`📅 Năm ${yr} (${d.ganZhi}, can ${godViShort(d.ganGod)}): ${d.rating} (${d.score}/100)${gejuTag}. ${d.advice}${warns ? ' Lưu ý: ' + warns + '.' : ''}`);
      } catch (e) {
        lines.push(`📅 Năm ${yr}: chưa tính được chi tiết đa phái.`);
      }
    }
  }
  // [loop 16] Đại vận Nay hiển thị 格局 tags (★RESCUES / ⚠WORSENS)
  const goodDy = dy.filter((d) => d.score > 0).slice(0, 3);
  const badDy = dy.filter((d) => d.score < 0).slice(0, 2);
  if (goodDy.length) lines.push(`Đại vận CÁT: ${goodDy.map((d) => `${hanviet(d.ganZhi)} [${d.startAge}–${d.startAge + 9}t]${d.gejuRescue ? ' ★RESCUES' : d.gejuDelta > 0 ? ' ★CÁCH THUẬN' : ''}`).join('; ')} — tiến thủ.`);
  if (badDy.length) lines.push(`Đại vận cần THẬN TRỌNG: ${badDy.map((d) => `${hanviet(d.ganZhi)} [${d.startAge}–${d.startAge + 9}t]${d.gejuWorsen ? ' ⚠WORSENS' : d.gejuDelta < 0 ? ' ⚠CÁCH NGHỊCH' : ''}`).join('; ')} — giữ ổn định.`);
  // Session module supplements (khi không có AI, NLG vẫn có dữ liệu timing đầy đủ)
  try { const jy = jiaoYunAnalysis(R); if (jy.next) lines.push(`🔄 Giao thời đại vận kế: ${jy.next.ganZhi} [${jy.next.age}t, ${jy.next.rating}] — còn ${jy.daysUntil} ngày.`); } catch (e) {}
  try { const wc = scanWealthCareerYingqi(R, new Date().getFullYear(), 8); if (wc.caiYears.length) lines.push(`💰 Tài kích hoạt: ${wc.caiYears.map((y) => y.year).join(', ')}${wc.guanYears.length ? ' | 🎯 Quan: ' + wc.guanYears.map((y) => y.year).join(', ') : ''}.`); } catch (e) {}
  try { const mt = scanMarriageTiming(R, new Date().getFullYear(), 10); if (mt.topMarriage.length) lines.push(`💍 Năm hôn nhân: ${mt.topMarriage.map((y) => y.year).join(', ')}.${mt.topRomance.length ? ' Duyên: ' + mt.topRomance.slice(0, 3).map((y) => y.year).join(', ') + '.' : ''}`); } catch (e) {}
  try { const df = decadeForecast(R, new Date().getFullYear(), 10); lines.push(`📊 10 năm: TỐT ${df.best?.year ?? '?'}(${df.best?.rating ?? '?'}), XẤU ${df.worst?.year ?? '?'}.`); } catch (e) {}
  // Session supplement: 12 thần lưu niên năm nay (四利三元)
  try { const l12 = analyzeLiunian12(R, new Date().getFullYear()); const m = l12.mine; lines.push(`🎴 12神 ${l12.year}: ${m.vi}(${m.viSub}) — ${m.tone === 'cat' ? 'CÁT' : m.tone === 'hung' ? 'HUNG' : 'TRUNG'}: ${m.meaning.slice(0, 70)}.`); } catch (e) {}
  // [loop 506] SỰ KIỆN (event-predict + favor-aware tone) — offline user biết WHAT xảy ra
  try { const ev = predictEvents(R, new Date().getFullYear(), 3); if (ev.years?.length) lines.push(`📅 Sự kiện: ${ev.years.map((y) => `${y.year}(${y.lnArea}${y.tone === 'cat' ? ' Cát' : y.tone === 'hung' ? ' Hung' : ''})`).join(', ')}.`); } catch (e) {}
  return { title: 'Vận hạn & thời điểm', paragraphs: lines };
}

function pRemedy(R, intent) {
  const rm = R.remedy;
  if (!rm || !rm.twelveLaws) return { title: 'Nghịch thiên cải mệnh', paragraphs: ['Chưa tính được.'] };
  const d = rm.byElement.dung;
  return {
    title: 'Nghịch thiên cải mệnh',
    paragraphs: [
      `Nguyên lý: Dụng ${favText(R.yong)} là chìa khoá; mọi pháp hậu thiên đều "bổ Dụng/Hỷ, khắc Kỵ/Thù".`,
      `Cụ thể: hướng ${d.direction}; màu ${d.color}; nghề ${d.career.split('，')[0]}; số ${d.number}; thực phẩm ${d.food.split('，')[0]}; nhà ${d.house}.`,
      (rm.timing || []).length ? `Thời điểm vàng (lưu niên CÁT): ${rm.timing.map((t) => t.year).join(', ')} — nên tiến thủ.` : 'Chọn thời điểm hành Dụng/Hỷ để tiến thủ.',
      `Trên hết, 《了凡四训》 dạy: TÍCH ÂM ĐỨC (积阴德) là pháp DUY NHẤT thật sự nghịch thiên — cải quá, tích thiện, khiêm đức. Mệnh lý chỉ là "thuận vận".`,
      `12 pháp cải vận: ${rm.twelveLaws.join(' ')}`,
      // Session supplement: specific hung-combo remedies
      ...(() => { try { const br = buildRemedy(R); return (br.specific || []).length ? [`⚠ Pháp hoá giải cụ thể: ${(br.specific || []).map((s) => s.remedy.split('—')[0].trim()).join('; ')}.`] : []; } catch (e) { return []; } })(),
    ],
  };
}

function pFlow(R) {
  // [loop 464] 源流 dòng khí + 三法 vượng suy — fallback NLG khi user hỏi về khí/lưu thông
  //   (trước đây NLG không cover 源流 → offline user hỏi «dòng khí» rơi generic).
  const yl = R.yuanliu;
  const s = R.strength || {};
  if (!yl) return { title: 'Dòng khí ngũ hành 源流', paragraphs: ['Chưa tính được dòng khí.'] };
  const lines = [];
  lines.push(`源流 (滴天髓源流篇): nguồn khí mệnh là hành <b>${wxVi(yl.source)}</b> (vượng nhất), dòng theo tương sinh chảy <b>${yl.flowLen}/5 hành</b>.`);
  if (yl.fullCycle) {
    lines.push(`★ 源远流长 — ngũ hành LƯU THÔNG tuần hoàn (5/5) → khí mệnh thuận hoà, phú quý bền, tài năng phát huy trọn vẹn. Rất hiếm và quý.`);
  } else {
    lines.push(`Dòng khí quy về <b>${yl.aspectKey}</b> (${yl.aspectVi}) — khía cạnh được dòng khí nuôi dưỡng, dễ phát.${yl.gap ? ` Nhưng khí TẮC tại hành ${wxVi(yl.gap)} (quá nhẹ) → dòng không thông tiếp, cần đại vận/lưu niên mang ${wxVi(yl.gap)} «mở dòng» mới phát huy hết.` : ''}`);
  }
  // 三法 context
  const fa = [];
  if (s.deLenh) fa.push('đắc lệnh'); else fa.push('thất lệnh');
  if (s.deDia) fa.push('đắc địa (thông căn)');
  lines.push(`Nền vượng suy: ${s.level} (${(s.ratio * 100).toFixed(0)}% phù trợ${s.sanFaBonus > 0 ? ` → hiệu dụng ${(s.effRatio * 100).toFixed(0)}% do ${fa.join(', ')}` : ''}).`);
  // advice
  if (yl.gap) {
    lines.push(`Mở dòng khí: khi gặp đại vận/lưu niên/tháng mang hành <b>${wxVi(yl.gap)}</b>, dòng sẽ LƯU THÔNG → thời cơ phát triển ${yl.aspectKey.toLowerCase()}. Trước đó, bổ sung nhẹ hành ${wxVi(yl.gap)} (màu/hướng) cũng giúp thông khí — thứ cấp, sau Dụng Thần ${favText(R.yong)}.`);
  } else {
    lines.push(`Dòng khí đã thông — tận dụng điểm mạnh <b>${yl.aspectKey.toLowerCase()}</b>, đừng tự trói bằng chần chừ.`);
  }
  return { title: 'Dòng khí ngũ hành 源流', paragraphs: lines };
}

// [loop 497] divination offline — 测字 (nếu user gõ chữ Hán) hoặc 梅花易数 起卦 (time).
function pDivination(R, intent) {
  const q = (intent?.raw || '').toLowerCase();
  const cjk = q.match(/[一-鿿]/g);
  // [loop 510] routing by keyword includes (avoid Unicode normalization issues)
  const isCezi = q.includes('测字') || q.includes('châm tự') || q.includes('xem chữ');
  const isLiuren = q.includes('壬');
  const isQimen = q.includes('奇') || q.includes('遁');

  // [loop 510] 大六壬 offline
  if (isLiuren) {
    try {
      const now = new Date();
      const r = liurenPan(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes());
      return { title: '大六壬 四课三传', paragraphs: [
        `Ngày ${r.dayGanZhi}, giờ ${r.hourZhi}. 月将: ${r.yuejiangVi}. Tổng môn: <b>${r.zongMen}</b>.`,
        `四课: ${(r.ke4 || []).map((k) => `${k.n} ${k.up}/${k.down}(${k.rel})`).join(' · ')}.`,
        `三传: ${(r.sanchuan || []).map((s) => `${s.n} ${s.zhi}(${s.rel})`).join(' · ')}.`,
      ].filter(Boolean) };
    } catch (e) {}
  }
  // [loop 510] 奇门遁甲 offline
  if (isQimen) {
    try {
      const now = new Date();
      const r = qimenDongPan(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours());
      return { title: '奇门遁甲', paragraphs: [
        `${r.term} ${r.yuan} ${r.yinYang}局${r.ju}.`,
        ...(r.gige || []).map((g) => `格格: ${g}`),
        r.advice ? `<b>${r.advice}</b>` : '',
      ].filter(Boolean) };
    } catch (e) {}
  }
  // 测字 nếu user cung cấp chữ Hán + hỏi测字
  if (isCezi && cjk && cjk.length) {
    try {
      const ch = cjk[cjk.length - 1];
      const cz = cezi(ch);
      return { title: `测字 «${ch}»`, paragraphs: [
        `Chữ «${ch}» — bộ ${cz.radical} (${cz.strokes} nét 康熙), ngũ hành ${cz.wxVi}.`,
        cz.hexagram ? `Gieo quẻ 梅花易数 → <b>${cz.hexagram.nameVi || cz.hexagram.name}</b>${cz.hexagram.meaning ? ': ' + cz.hexagram.meaning.slice(0, 80) : ''}.` : '',
        cz.summary ? `Luận: ${cz.summary.slice(0, 120)}.` : '',
      ].filter(Boolean) };
    } catch (e) {}
  }
  // default: 梅花易数 起卦 theo thời điểm hiện tại
  try {
    const now = new Date();
    const nums = solarToMhNums(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes());
    const r = castByTime(nums);
    const rel = r.rel?.vi || '';
    return { title: '梅花易数 起卦', paragraphs: [
      `Thời điểm ${nums.label} → <b>本卦 ${r.ben?.name || '?'}</b>${r.dong ? ` (动爻 ${r.dongInUpper ? 'thượng' : 'hạ'} ${r.dong})` : ''} → <b>变卦 ${r.bian?.name || '?'}</b>. 互卦 ${r.hu?.name || '?'}.`,
      `Thể ${r.ti?.vi || ''}(${r.ti?.wx || ''}) ↔ Dụng ${r.yong?.vi || ''}(${r.yong?.wx || ''}): ${rel}.`,
      `Verdict: <b>${(r.verdict || '').slice(0, 150)}</b>`,
    ].filter(Boolean) };
  } catch (e) {
    return { title: 'Bói toán', paragraphs: ['Không gieo quẻ được lúc này.'] };
  }
}

function pFreeForm(R, intent) {
  // Composer "bất kỳ câu hỏi" — khi không khớp lĩnh vực cụ thể, dệt câu trả lời
  // theo TOÀN BỘ lá số + bất kỳ từ khoá nào phát hiện được trong câu hỏi.
  const { chart, yong, strength, synthesis } = R;
  const dm = chart.dayMaster;
  const now = (R.liunian || []).find((l) => l.isNow);
  const norm = (intent.raw || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const hit = (arr) => arr.some((k) => norm.includes(k.normalize('NFD').replace(/[̀-ͯ]/g, '')));
  const lines = [];
  lines.push(`Về câu hỏi của bạn, đứng trên lá số ${dm.gan} ${dm.vi} (hành ${wxVi(dm.wx)}, ${strength.level}, cách ${R.pattern.vi}):`);
  // quét nhẹ mọi mảng có mặt trong câu hỏi
  const bits = [];
  if (hit(['tien', 'tai', 'giau', 'loc', 'dau tu', 'kinh doanh', 'no', 'lãi'])) bits.push(`Tài: Dụng ${favText(yong)} — ${yong.relations.wealthWx === yong.primary || yong.relations.wealthWx === yong.xi ? 'Tài là Dụng → chủ động cầu tài hiệu' : 'Tài không phải Dụng → giữ tiền qua kênh Dụng mới bền'}.`);
  if (hit(['cong viec', 'nghe', 'thang tien', 'chuc', 'sep', 'doanh nghiep'])) bits.push(`Sự nghiệp: nên chọn ngành hành Dụng ${favText(yong)}, phương ${WX_INFO[yong.primary].huong}.`);
  if (hit(['tinh', 'duyen', 'vo', 'chong', 'cuoi', 'hoa'])) bits.push(`Tình duyên: ưu tiên người mang hành ${favText(yong)}; ${chart.input.gender === 'nam' ? 'sao vợ=Tài' : 'sao chồng=Quan'}.`);
  if (hit(['khoe', 'benh', 'dau', 'om'])) bits.push(`Sức khoẻ: hành yếu nhất cần lưu ý tạng phủ; dưỡng sinh theo Dụng ${favText(yong)}.`);
  if (hit(['nam', 'van', 'thoi', 'khi', 'tuong lai', 'bay gio', 'hom nay'])) bits.push(`Vận thời điểm: Dụng ${favText(yong)} là thước đo. ${now ? `Năm ${now.year} (${now.rating}, ${now.ganGod} năm).` : ''}`);
  if (bits.length) lines.push(...bits);
  else lines.push(`Trục cốt lõi của mọi vấn đề là Dụng ${favText(yong)} / Hỷ ${wxVi(yong.xi)} (nên tăng) và Kỵ ${wxVi(yong.ji)} / Thù ${wxVi(yong.chou)} (nên tránh).`);
  lines.push(`Tổng luận mệnh ${synthesis.gradeVi} (${synthesis.score}/100). Khai vận: màu ${WX_INFO[yong.primary].mau}; phương ${WX_INFO[yong.primary].huong}; nghề ${WX_INFO[yong.primary].nghe.split('，')[0]}.`);
  // [loop 524] Quỷ Cốc Tử bonus
  try { const gg = guiguziFortune(R); if (gg) lines.push(`🔮 Quỷ Cốc Tử: năm ${gg.yearJiaZi} (${gg.vi}) ${gg.toneVi} — ${gg.fortune.slice(0, 90)}.`); } catch (e) {}
  // [loop 536] 鬼谷子分定經 (两头钳)
  try { const fdg = guiguziFDG(R); if (fdg) lines.push(`📜 Phân Định Kinh: ${fdg.combo} quẻ ${fdg.guaVi}, cách「${fdg.geMing}」— ${fdg.guaMeaning?.slice(0, 80) || ''} ${fdg.starDesc?.slice(0, 60) || ''}`); } catch (e) {}
  // [loop 545] TỔNG HỢP KINH DỊCH — kết nối 河洛 (Bát tự) ↔ 鬼谷 (can năm×giờ)
  try { const syn = hexagramSynthesis(R); if (syn?.ok && syn.synthesis) lines.push(`☯ Kinh Dịch tổng hợp: 河洛 ${syn.systems.heluo?.nameVi || '?'}[${syn.systems.heluo?.tone || ''}] + 鬼谷 ${syn.systems.guiguzi?.nameVi || '?'}[${syn.systems.guiguzi?.tone || ''}] → ${syn.synthesis.verdict}.`); } catch (e) {}
  // [loop 546] 六道轮回 (ṣaḍ-gati, Phật giáo) — BaZi→tam độc→khuynh hướng 6 đạo
  try { const ld = computeLiuDao(R); if (ld?.ok) lines.push(`🪷 Lục Đạo (ṣaḍ-gati): tam độc THAM ${ld.poisons.tham}/SÂN ${ld.poisons.san}/SI ${ld.poisons.si} → khuynh hướng ${ld.realm.vi} (${ld.realm.skt}). ${ld.narrative.slice(0, 100)}`); } catch (e) {}
  // [loop 527] 日柱納音 personality bonus
  try { const dnp = dayNayinPersonality(R); if (dnp && dnp.traits) lines.push(`🏺 Nạp âm ${dnp.dayJiaZi} (${dnp.vi}): ${dnp.nature}. ${dnp.strength}, cần khắc phục ${dnp.weakness}.`); } catch (e) {}
  lines.push(`${now && now.score < 0 ? `⚠ Đang ở năm ${now.year} bất lợi → thủ giữ, tránh mạo hiểm; đợi lưu niên mang hành Dụng.` : `Nên tiến thủ theo Dụng Thần, đón lưu niên/đại vận cát.`} Để có phân tích tự do chuyên sâu hơn, bật AI trong ⚙ Cài đặt.`);
  return { title: 'Luận theo câu hỏi của bạn', paragraphs: lines };
}

const COMPOSERS = {
  personality: pPersonality, career: pCareer, wealth: pWealth, love: pLove,
  health: pHealth, study: pStudy, children: pChildren, travel: pTravel,
  power: pPower, family: pLove, timing: pTiming, remedy: pRemedy, flow: pFlow, divination: pDivination, general: pFreeForm,
};

// ---------------------------------------------------------------------------
//  4. ENTRANCE: soạn câu trả lời cho câu hỏi tự do
// ---------------------------------------------------------------------------
export function composeAnswer(question, R) {
  const intent = detectIntent(question);

  // [cycle 49] Câu hỏi HỢP TUỔI cần 2 lá số — composeAnswer chỉ có 1 lá số → trả lời trung thực
  //   thay vì giả vờ luận duyên 1 người (lỗi "ba phải" cũ: compat question → single-chart love answer).
  if (intent.isCompat) {
    return {
      title: 'Hợp tuổi — cần 2 lá số',
      lead: 'Câu hỏi hợp tuổi/hôn nhân/đối tác cần so sánh lá số của CẢ HAI người. Tôi mới chỉ có lá số của bạn.',
      paragraphs: [
        `Mở mục « 💕 Hợp tuổi (2 người) » trong Công cụ Phong Thủy — nhập ngày/giờ sinh của người kia → app chấm điểm hợp hôn (ngũ hành bổ trợ + Dụng thần tương hỗ + Lục hợp/Lục xung/Tam hình/Hoá khí).`,
        `Lá số của bạn: Nhật Chủ ${R.chart.dayMaster.gan} ${R.chart.dayMaster.vi} (${R.strength.level}); Dụng ${favText(R.yong)}. Khi có lá số người kia, trọng tâm so sánh: (1) Dụng thần 2 người có bổ sung cho nhau không, (2) cặp chi có Lục hợp (cát) hay Lục xung/Tam hình (hung), (3) Nhật Chủ tương sinh hay tương khắc.`,
      ],
      intent,
    };
  }

  // [loop 497] divination intent (起卦/测字) — ưu tiên TRƯỚC confidence fallback
  //   (CJK keywords 2 chars → confidence <3, nhưng là lệnh rõ ràng → bypass)
  if (intent.isDivination) {
    const block = pDivination(R, intent);
    return { title: block.title, lead: `Bạn hỏi về bói toán / gieo quẻ. Kết quả:`, paragraphs: block.paragraphs, intent };
  }

  // [loop 619] family question — NLG offline hướng dẫn user
  if (intent.isFamily) {
    return {
      title: 'Người thân — cần AI hoặc card Gia Tộc',
      lead: `Bạn hỏi về người thân. Để luân giải chính xác, tôi cần ngày sinh của người đó.`,
      paragraphs: [
        `📋 Cách 1: Mở card「👪 Nghiệm Chứng Gia Tộc」→ bấm «📝» cạnh tên người cần xem → app tự phân tích đầy đủ (164 card).`,
        `🤖 Cách 2: Bật AI (⚙ Cài đặt → Z.ai) → hỏi «mẹ tôi (27/6/1970) thế nào?» → AI sẽ dùng tool analyze_relative để luân giải NC/Dụng/đại vận/ngũ hành tương quan.`,
        `💡 Tôi (offline) chỉ có lá số của BẠN. Nếu cho ngày sinh người thân, tôi luận được: ngũ hành tương quan (bạn vs người đó), ai bổ Dụng cho ai, đại vận tương hỗ. Hãy hỏi vd: «mẹ tôi sinh 27/6/1970, ngũ hành hợp không?».`,
      ],
      intent,
    };
  }

  // Câu hỏi TỰ DO / khó hiểu (confidence thấp, không khớp lĩnh vực) → fallback khéo léo
  // Vẫn trả lời được: mở bằng chốt lá số + gợi ý hỏi lại cụ thể (luân giải "bất kỳ câu").
  if (!intent.isTiming && !intent.isDivination && intent.confidence < 3) {
    const dm = R.chart.dayMaster, y = R.yong, s = R.synthesis || {};
    return {
      title: 'Luận theo lá số (câu hỏi mở)',
      lead: `Câu hỏi của tôi chưa rõ thuộc lĩnh vực nào — tôi luân giải chung theo lá số, bạn có thể hỏi cụ thể hơn:`,
      paragraphs: [
        `Chốt lá số: Nhật Chủ ${dm.gan} ${dm.vi} (${R.strength.level}); cách cục ${R.pattern.vi}; Dụng ${favText(y)} / Hỷ ${wxVi(y.xi)} / Kỵ ${wxVi(y.ji)}. Tổng luận: ${s.gradeVi || ''} (${s.score || '?'}/100).`,
        `Tôi có thể luân giải các mảng: <b>sự nghiệp · tài lộc · tình duyên · sức khoẻ · học vấn · con cái · vận năm/tháng/ngày · cải vận · dòng khí (源流) · hợp tuổi · chọn ngày · bói toán (gieo quẻ/测字) · phong thuỷ nhà · tên</b>.`,
        `Thử hỏi vd: "Năm 2026 tôi có nên đổi việc?", "Khi nào phát tài?", "Dòng khí mệnh tôi sao?", "Gieo quẻ cho tôi", "Làm sao cải vận?", "Vợ chồng tôi hợp không?" — hoặc bật AI (⚙ GLM-5.2 Z.ai) để trả lời mở hoàn toàn.`,
      ],
      intent,
    };
  }

  let composer = COMPOSERS[intent.area] || pPersonality;
  // [loop 592 FIX] Câu hỏi thời điểm: nếu CŨNG có chủ đề cụ thể (wealth/career/marriage)
  //   → pTiming NHƯNG truyền area để pTiming thêm context chủ đề.
  //   Trước đây isTiming override hoàn toàn → «bao giờ giàu» = chỉ nói timing, KHÔNG nói wealth.
  if (intent.isTiming) {
    composer = (R2, i2) => {
      const tBlock = pTiming(R2, i2);
      // Nếu area cụ thể (không phải 'general') → thêm 1-2 câu context chủ đề
      if (i2.area && i2.area !== 'general' && COMPOSERS[i2.area]) {
        try {
          const tCtx = COMPOSERS[i2.area](R2, i2);
          if (tCtx && tCtx.paragraphs && tCtx.paragraphs.length) {
            tBlock.paragraphs.push(`🔗 Liên quan đến «${tCtx.title}»: ${tCtx.paragraphs[0].slice(0, 120)}`);
          }
        } catch (_) {}
      }
      return tBlock;
    };
  }
  const block = composer(R, intent);
  const lead = `Ý bạn hỏi về lĩnh vực « ${block.title} »${intent.years.length ? ` (có mốc năm ${intent.years.join(', ')})` : ''}. Luận theo lá số của bạn:`;
  return { title: block.title, lead, paragraphs: block.paragraphs, intent };
}

// Tóm tắt ngắn các tương tác hội hợp (dùng hiển thị & đưa cho AI)
export function interactionBrief(R) {
  return R.interactions.summary;
}
