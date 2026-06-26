// ============================================================================
//  BRIEF EXTENDER — bổ sung dữ liệu từ các module chuyên sâu vào chart brief
//  Kéo toàn bộ phân tích (财库/暗合/nạp âm/spouse/wealth/career/health/study/
//  dayun-god/小限/命主身主/taiyuan/xingshen-zuo) vào brief → AI/NLG luân giải sâu hơn.
// ============================================================================
import { detectAnhe } from './anhe.js';
import { nayinRelations } from './nayin-relation.js';
import { analyzeCaiKu } from './caiku.js';
import { xingshenZuo } from './xingshen-zuo.js';
import { analyzeSpouseStar } from './spouse-star.js';
import { analyzeWealthStar } from './wealth-star.js';
import { analyzeCareerStar } from './career-star.js';
import { analyzeHealth } from './health-analysis.js';
import { analyzeStudy } from './study-analysis.js';
import { dayunGodMeaning } from './dayun-god.js';
import { checkDayunInteractions } from './dayun-check.js';
import { analyzeHanNuan } from './han-nuan.js';
import { analyzeWxFlow } from './wx-flow.js';
import { classifyChartLevel } from './chart-level.js';
import { baziMingGong } from './bazi-minggong.js';
import { analyzeChildrenStar } from './children-star.js';
import { dayunChangSheng, dayunYongChangSheng } from './dayun-changsheng.js';
import { taiYuan } from './taiyuan.js';
import { getPersonalityProfile } from './personality-profile.js';
import { lifeTimeline } from './destiny-timeline.js';
import { mingZhuShenZhu } from './mingzhu.js';
import { predictEvents } from './event-predict.js';
import { detectAnchong } from './anchong.js';
import { analyzeFiveVirtues } from './five-aspects.js';
import { computeLiuyue } from './liuyue.js';

/**
 * Sinh đoạn text bổ sung cho chart brief từ các module chuyên sâu.
 * @param {object} R - kết quả analyze()
 * @returns {string} text bổ sung
 */
export function extendBrief(R) {
  const parts = [];

  // [loop 40] Điều Hậu (调候) — phải đưa vào brief để AI biết 调候 đang LÀM CHỦ (loop 34 elevation)
  try {
    const th = R.yong?.tiaohou;
    if (th && (th.override || th.note)) {
      parts.push(th.override
        ? `🔥 ĐIỀU HẬU (调候) OVERRIDE: ${th.note || ''} — 调候 LÀM CHỦ, đè Phù Ức. Dụng Thần chính = hành ${th.primaryWx} (khí hậu thiên lệch, 窮通寶鑑).`
        : `ĐIỀU HẬU (调候): ${th.note || ''}`);
    }
  } catch (e) {}

  // [loop 70] 寒暖燥湿 — cân bằng khí hậu CỤ THỂ (cơ sở định LÝ cho Điều Hậu ở trên).
  //   Cho AI biết mệnh hàn/nhiệt/táo/thấp ra sao + Dụng có khớp nhu cầu khí hậu không.
  try {
    const hn = analyzeHanNuan(R);
    parts.push(`HÀN-NOÃN-TÁO-THẤP (寒暖燥湿): ${hn.tempVi} (điểm ${hn.tempScore}) + ${hn.humidVi} (điểm ${hn.humidScore})${hn.needs.length ? ' → cần ' + hn.needs.map((n) => n.vi).join(' / ') : ' → khí hậu cân'}.${hn.alignNote ? ' ' + hn.alignNote : ''}`);
  } catch (e) {}

  // [loop 88] NGŨ HÀNH LƯU THÔNG (五行流通) — dòng sinh có thông suốt (module wx-flow trước đây ẩn).
  try {
    const wf = analyzeWxFlow(R);
    parts.push(`NGŨ HÀNH LƯU THÔNG (五行流通): ${wf.circulation} Thông ${wf.flow.length}/5${wf.blocks.length ? ', đứt ' + wf.blocks.length : ''}.${wf.profile.length ? ' ' + wf.profile.join(' ') : ''}`);
  } catch (e) {}

  // [loop 89] MỆNH CÁCH TẦNG LỚP (命格層次) — phân loại cổ điển 6 tiêu chí (module chart-level trước đây ẩn).
  try {
    const lv = classifyChartLevel(R);
    if (lv && lv.level !== 'unknown') {
      parts.push(`MỆNH CÁCH TẦNG LỚP (命格層次): ${lv.levelVi} — ${lv.passCount}/6 tiêu chí (${(lv.criteria || []).filter((c) => c.pass).map((c) => c.name).join('/')}). ${lv.note}`);
    }
  } catch (e) {}

  // [loop 90] MỆNH CUNG (命宮) — cung mệnh phụ (三命通会), tính từ tháng+giờ (module bazi-minggong ẩn).
  try {
    const mg = baziMingGong(R);
    parts.push(`MỆNH CUNG (命宮): ${mg.ganZhi} (${mg.ganVi} ${mg.zhiVi}, thập thần ${mg.godVi}, hành ${mg.wxVi}, nạp âm ${mg.nayinWx}). ${mg.interactionWithDay} ${mg.isYong ? '★ Mệnh cung = DỤNG/HỶ → bổ mệnh.' : mg.isJi ? '⚠ Mệnh cung = KỴ.' : ''}`);
  } catch (e) {}

  // [loop 90] TỬ NỮ LUẬN (子女論) — sao con sâu: số/giới tính/timing (module children-star ẩn).
  try {
    const c = analyzeChildrenStar(R);
    parts.push(`TỬ NỮ (子女): sao ${c.childStar} (hành ${c.childWxVi}), ${c.strength} (${c.count.toFixed(1)}), cung Tử Nữ ${c.palaceZhiVi} ${c.palaceStable ? 'yên' : 'bị xung'}. ${c.estimated}. Con đầu: ${c.firstGender}.${c.isYong ? ' ★ Sao con=Dụng.' : c.isJi ? ' ⚠ Sao con=Kỵ.' : ''}`);
  } catch (e) {}

  // Thai nguyên (nếu có)
  try {
    const ty = taiYuan(R.chart.pillars.month.gan, R.chart.pillars.month.zhi);
    if (ty) {
      parts.push(`THAI NGUYÊN: ${ty.ganZhi} (${ty.ganVi} ${ty.zhiVi}, ${ty.wx}) — thể chất bẩm sinh.`);
    }
  } catch (e) {}

  // Tài khố
  try {
    const ck = analyzeCaiKu(R);
    parts.push(`TÀI KHỐ: ${ck.hasTaiku ? 'CÓ (' + ck.taikuPos.join(',') + ', yên=' + !ck.opens.length + ')' : 'KHÔNG'} → ${ck.hasTaiku ? 'giữ được tiền' : 'tiền chảy qua tay'}.`);
  } catch (e) {}

  // Ẩn hợp
  try {
    const ah = detectAnhe(R.chart);
    if (ah.pairs.length) {
      parts.push(`ẨN HỢP: ${ah.summary}`);
    }
  } catch (e) {}

  // Nạp âm quan hệ
  try {
    const nr = nayinRelations(R.chart);
    parts.push(`NẠP ÂM QUAN HỆ: ${nr.pairs.map((p) => `${p.toVi.split('(')[0]}: ${p.relVi}`).join('; ')}`);
  } catch (e) {}

  // Thập thần tọa chi
  try {
    const xz = xingshenZuo(R.chart);
    parts.push(`THẬP THẦN TỌA CHI: ${xz.items.map((i) => `${i.pillarVi}: ${i.surfaceVi} tọa ${i.sitOnVi}`).join('; ')}`);
  } catch (e) {}

  // Phối ngẫu tinh
  try {
    const sp = analyzeSpouseStar(R);
    parts.push(`PHỐI NGÃU: ${sp.spouseStar}(${sp.spouseWxVi}) ${sp.strength} | Dụng=${sp.isYong} Kỵ=${sp.isJi} | cung ${sp.palaceZhiVi} ${sp.palaceStable ? 'yên' : 'xung'}${sp.interactions.length ? ' | ' + sp.interactions.join(';') : ''}`);
  } catch (e) {}

  // Tài tinh
  try {
    const w = analyzeWealthStar(R);
    parts.push(`TÀI TINH: ${w.wealthStar}(${w.wealthWxVi}) ${w.strength} | thân nhậm=${w.bodyCanHold} | Dụng=${w.isYong} | food=${w.hasFoodGen} robber=${w.hasRobber} | timing=${(w.timing || []).join(',')}`);
  } catch (e) {}

  // Sự nghiệp
  try {
    const c = analyzeCareerStar(R);
    parts.push(`SỰ NGHIỆP: ${c.officerStar}(${c.officerWxVi}) ${c.strength} | Ấn=${c.sealCount} | thân=${c.bodyStrong} | Dụng=${c.isYong} | timing=${(c.timing || []).join(',')}`);
  } catch (e) {}

  // Sức khoẻ
  try {
    const h = analyzeHealth(R);
    parts.push(`SỨC KHOẺ: yếu=${h.weakest.vi}(${h.weakest.pct}%) → ${h.weakest.organs.split(',')[0]} | vượng=${h.strongest.vi}(${h.strongest.pct}%) | dưỡng=${h.remedyVi} | mùa rủi ro=${h.riskSeason}`);
  } catch (e) {}

  // Học vấn
  try {
    const s = analyzeStudy(R);
    parts.push(`HỌC VẤN: Ấn=${s.sealStrength}(${s.sealCount}) ThựcThương=${s.foodStrength}(${s.foodCount}) | VănXương=${s.hasWenChang} | thân=${s.bodyCanStudy} | timing=${(s.timing || []).join(',')}`);
  } catch (e) {}

  // Đại vận thập thần (3 vận gần nhất)
  try {
    const dg = dayunGodMeaning(R.chart, R.dayun);
    const near = dg.items.slice(0, 4).map((d) => `${d.ganZhi}[${d.startAge}t:${d.godVi}(${d.cat})]`);
    parts.push(`ĐẠI VẬN THẬP THẦN: ${near.join(' ')}`);
  } catch (e) {}

  // Đại vận tương tác
  try {
    const di = checkDayunInteractions(R.chart, R.dayun);
    if (di.length) {
      parts.push(`ĐẠI VẬN TƯƠNG TÁC: ${di.map((d) => `${d.ganZhi}[${d.startAge}t] ${d.notes.join(';')}`).join(' | ')}`);
    }
  } catch (e) {}

  // [loop 77] 大运十二长生运 — sinh khí Nhật Chủ qua 12 giai đoạn (chiều cổ pháp song song Dụng).
  try {
    const cs = dayunChangSheng(R.chart.dayGan, R.dayun);
    parts.push(`ĐẠI VẬN 12 TRƯỜNG SINH (Nhật Chủ): ${cs.items.map((i) => `${i.ganZhi}[${i.startAge}t:${i.stageVi}/${i.tone}]`).join(' ')}. ${cs.summary}`);
  } catch (e) {}

  // [loop 83] DỤNG THẦN 12 trường sinh — khi nào Dụng hành thật sự vượng (khác Nhật Chủ).
  try {
    const ys = dayunYongChangSheng(R.yong.primary, R.yong.xi, R.dayun);
    parts.push(`DỤNG THẦN 12 TRƯỜNG SINH (${ys.yongWx}): ${ys.items.map((i) => `${i.ganZhi}[${i.startAge}t:${i.stageVi}]`).join(' ')}. ${ys.summary}`);
  } catch (e) {}

  // [loop 113] CÁC FEATURE PHÂN TÍCH bổ sung cho AI (trước đây chỉ UI, AI không biết)
  // 格局成败救应 (病→药)
  try {
    const pq = R.patternQuality;
    if (pq && pq.quality) {
      const QVI = { 成格: 'Thành cách', 有救: 'Bại có cứu (败中有成)', 败格: 'Bại cách', 特殊: 'Đặc biệt' };
      const dis = (pq.diseases || []).map((d) => d.note).join('; ');
      const res = (pq.rescues || []).map((r) => r.note).join('; ');
      parts.push(`CÁCH CỤC THÀNH BẠI: ${QVI[pq.quality] || pq.quality}. ${dis ? 'Bệnh: ' + dis + '.' : ''} ${res ? 'Cứu ứng: ' + res + '.' : ''}`);
    }
  } catch (e) {}
  // 日干性情
  try {
    const pp = getPersonalityProfile(R);
    parts.push(`TÍNH CÁCH NHẬT CAN (${pp.ganVi}/${pp.wxVi}): ${(pp.profile.temperament || '') + '. Ưu: ' + (pp.profile.strengths || '').slice(0, 50) + '. Nhược: ' + (pp.profile.weaknesses || '').slice(0, 50)}`);
  } catch (e) {}
  // Dòng đời timeline (đỉnh/thách thức)
  try {
    const tl = lifeTimeline(R, new Date().getFullYear());
    parts.push(`DÒNG ĐỜI: ${tl.summary}`);
  } catch (e) {}
  // 命主身主 (紫微)
  try {
    const mg = baziMingGong(R);
    const mz = mingZhuShenZhu(mg.zhi, R.chart.pillars.year.zhi);
    parts.push(`MỆNH CHỦ/THÂN CHỦ: 命主=${mz.mingZhuVi}, 身主=${mz.shenZhuVi}.`);
  } catch (e) {}

  // [loop 114] ÁM XUNG (暗冲 — 盲派) + SỰ KIỆN NĂM (event-predict)
  try {
    const ac = detectAnchong(R.chart);
    if (ac.pairs && ac.pairs.length) {
      parts.push(`ÁM XUNG (暗冲): ${ac.summary}`);
    }
  } catch (e) {}
  try {
    const yr = new Date().getFullYear();
    const ev = predictEvents(R, yr, 3);
    parts.push(`SỰ KIỆN ${yr}-${yr + 2}: ${ev.years.map((y) => `${y.year}(${y.lnArea}${y.sameGod ? '/nhân đôi' : ''})`).join(', ')}.`);
  } catch (e) {}

  // [loop 115] NGŨ ĐỨC (五常) — đức chính + tu dưỡng (AI personality depth)
  try {
    const fv = analyzeFiveVirtues(R);
    parts.push(`NGŨ ĐỨC (五常): đức chính ${fv.virtue} (${fv.primaryVi}) — ${fv.strong ? fv.strong.slice(0, 40) : ''}${fv.kyVirtue ? ' | thiếu: ' + fv.kyVirtue : ''}. ${fv.cultivation ? fv.cultivation.slice(0, 50) : ''}`);
  } catch (e) {}

  // [loop 149] KHÔNG VONG (空亡) — AI biết trụ nào bị treo → giải thích «空则不实»
  try {
    const kw = R.kongwang;
    if (kw && kw.affected && kw.affected.length) {
      parts.push(`KHÔNG VONG (空亡):旬 ${kw.xun}, chi trống = ${kw.kong.join('/')}. ${kw.affected.map((a) => `${a.palace.split('(')[0]}(${a.zhi})`).join(', ')} bị «treo» → tàng can YẾU 50% («空则不实»). Đợi vận/年 mang chi đó (hoặc xung) = «xuất không» → sự việc phát.`);
    }
  } catch (e) {}

  // [loop 153] 大运 进气退气 — AI biết vận đang vào/ra/vượng
  try {
    const yr = new Date().getFullYear();
    const dy = (R.dayun || []).find((d) => d && d.startYear != null && d.startYear <= yr && yr < d.startYear + 10);
    if (dy) {
      const offset = yr - dy.startYear;
      const phase = offset <= 2 ? `进气 (năm ${offset + 1}/10 — vận đang VÀO, lực chưa tối đa)` : offset >= 7 ? `退气 (năm ${offset + 1}/10 — vận đang RA, lực suy)` : `旺气 (năm ${offset + 1}/10 — vận ĐANG PHÁ HUY mạnh nhất)`;
      parts.push(`大运 PHASE: ${dy.ganZhi} hiện ${phase}. «进气退气»: vận đầu chưa mạnh, vận cuối đã suy.`);
    }
  } catch (e) {}

  // [loop 124] LƯU THÁNG hiện tại — AI trả lời "tháng này sao"
  try {
    const now = new Date();
    // [loop 209 fix] truyền patternQuality — bật tầng 格局流月喜忌 (gejuDelta). Trước đây
    //   THIẾU patternQuality → brief's LƯU THÁNG thiếu 1 tầng, lệch thẻ «Lưu Nguyệt» + AI tool.
    const ly = computeLiuyue(R, now.getFullYear(), R.patternQuality);
    const curMonth = now.getMonth(); // 0-11
    const m = ly.months.find((mm) => mm.m === curMonth) || ly.months[0];
    if (m) {
      parts.push(`LƯU THÁNG ${now.getMonth() + 1} (${m.ganZhi}): ${m.rating} (${m.score}/100) — ${(m.note || '').slice(0, 80)}${m.taiSui?.length ? ' | ' + m.taiSui.join(', ') : ''}${m.fuyin?.length ? ' | ' + m.fuyin.join(', ') : ''}`);
    }
  } catch (e) {}

  return parts.length ? '\n--- PHÂN TÍCH CHUYÊN SÂU ---\n' + parts.join('\n') : '';
}

