// ============================================================================
//  BRIEF EXTENDER — bổ sung dữ liệu từ các module chuyên sâu vào chart brief
//  Kéo toàn bộ phân tích (财库/暗合/nạp âm/spouse/wealth/career/health/study/
//  dayun-god/小限/命主身主/taiyuan/xingshen-zuo) vào brief → AI/NLG luân giải sâu hơn.
// ============================================================================
import { detectAnhe } from './anhe.js';
import { TEN_GOD_VI, WX_VI } from './constants.js';
import { nayinRelations } from './nayin-relation.js';
import { ganZhiNayin } from './nayin.js';
import { analyzeZiweiBrightness } from './ziwei-brightness.js';
import { computeZiwei } from './ziwei.js';
import { analyzeCaiKu } from './caiku.js';
import { xingshenZuo } from './xingshen-zuo.js';
import { analyzeSpouseStar } from './spouse-star.js';
import { analyzeWealthStar } from './wealth-star.js';
import { analyzeCareerStar } from './career-star.js';
import { analyzeHealth } from './health-analysis.js';
import { analyzeStudy } from './study-analysis.js';
import { dayunGodMeaning } from './dayun-god.js';
import { detectCombos } from './combos.js';
import { computeFuxing } from './fuxing.js';
import { computeAuxStars } from './ziwei-aux.js';
import { checkDayunInteractions } from './dayun-check.js';
import { analyzeHanNuan } from './han-nuan.js';
import { analyzeWxFlow } from './wx-flow.js';
import { analyze } from './chart.js'; // [loop 626] family deduction cần analyze() người thân
import { deduceFromFamily } from './family-deduction.js'; // [loop 626] 六亲断 — suy sâu từ gia đình
import { personalTaSui } from './taisui.js'; // [loop 671] 3 hành động — check taisui
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
import { cityRecommendation } from './city-fs.js';
import { personalNutrition } from './bazi-diet.js';
import { investmentStyle } from './invest-style.js';
import { analyzeBusiness } from './bazi-business.js';
import { analyzePillarQuality } from './pillar-quality.js';
import { detectGongjia } from './gongjia.js';
import { guiguziFortune } from './guiguzi.js';
import { guiguziFDG } from './guiguzi-fdg.js';
import { hexagramSynthesis } from './hexagram-synthesis.js';
import { synthesize } from './synthesis.js';
import { scanHours } from './hour-scan.js';
import { analyzeRomance } from './romance-deep.js';
import { findGoldenYear } from './golden-year.js';
import { computeLiuDao } from './liudao.js';
import { destinyConsensus } from './destiny-consensus.js';
import { dayNayinPersonality } from './nayin-personality.js';

/**
 * Sinh đoạn text bổ sung cho chart brief từ các module chuyên sâu.
 * @param {object} R - kết quả analyze()
 * @returns {string} text bổ sung
 */
export function extendBrief(R) {
  const parts = [];
  // [loop 598] HOUR UNCERTAINTY — nếu user nhập giờ default 12:00 → brief note
  try {
    const inp = R.chart?.input || {};
    if (inp.hour === 12 && inp.minute === 0) {
      const hs = scanHours(inp.year, inp.month, inp.day, inp.gender || 'nam', inp.year + 30);
      if (hs && hs.stableCount < 10) {
        parts.push(`⚠ GIỜ SINH KHÔNG CHẮC: lá số dùng giờ Ngọ (12:00) mặc định. Quét 12 giờ cho thấy Dụng ${hs.stableYong} chỉ ổn định ${hs.stableCount}/12 giờ — ${hs.outlierCount} giờ outlier đổi Dụng. Score dao động ${hs.scoreRange?.min}-${hs.scoreRange?.max}. KHI LUẬN: nên nói «nếu sinh giờ X thì...» thay vì khẳng định 1 kết quả.`);
      }
    }
  } catch (e) {}

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

  // [loop 452] 源流 (NGUỒN-LƯU) — nguồn khí +归宿 quy về khía cạnh nào (滴天髓源流篇).
  //   Khác wx-flow (đo流通 có thông không): 源流 chỉ rõ NGUỒN + điểm DỪNG = khía cạnh THỊNH.
  try {
    const yl = R.yuanliu;
    if (yl) {
      // [loop 453] liệt kê các 大运 源流 interaction nổi bật (mở dòng tắc / khắc归宿)
      const ylDy = (R.dayun || []).filter((d) => d._ylNote).slice(0, 2)
        .map((d) => `${d.ganZhi}: ${d._ylNote.replace(/MỞ dòng tắc.*→/, 'mở dòng').replace(/KHẮC归宿.*→.*TỔN/, 'khắc归宿')}`);
      parts.push(`源流 NGUỒN-LƯU: nguồn ${yl.source} chảy ${yl.flowLen}/5 hành, quy về ${yl.aspectKey} (${yl.aspectVi}) → ${yl.fullCycle ? '源远流长 (phú quý bền)' : yl.verdict}.${yl.gap ? ' Tắc tại ' + yl.gap + '.' : ''}${ylDy.length ? ' 大运 tương tác 源流: ' + ylDy.join(' | ') + '.' : ''}`);
    }
  } catch (e) {}
  // [loop 467] 盖头截脚 (can-chi khắc nhau TRONG trụ) — 滴天髓 khí thông/không thông.
  //   Trước đây AI không truy cập (pillar-quality chỉ tính ở render, không trong brief).
  try {
    const pq = analyzePillarQuality(R);
    if (pq && pq.gaijieCount > 0) parts.push(`盖头截脚: ${pq.gaijieCount}/4 trụ can-chi khắc nhau (${(pq.summary || '').split('。')[0].slice(0, 60)}) → ${pq.flowOk ? 'khí vẫn tương đối thông' : 'khí KHÔNG thông, đời hay vấp/trở ngại'}.`);
  } catch (e) {}
  // [loop 513] 拱夹 (gongjia) — arch hidden branch (子平真诠 拱格)
  try {
    const gj = detectGongjia(R);
    if (gj.arches && gj.arches.length) parts.push(`拱夹 GONGJIA: ${gj.summary}`);
  } catch (e) {}
  // [loop 523] 鬼谷子算命 — Guiguzi divination (bổ sung góc nhìn cổ đại)
  try {
    const gg = guiguziFortune(R);
    if (gg) {
      const pillars4 = (gg.pillarReadings || []).map((p) => `${p.palaceVi}:${p.gz} ${p.nayin}(${p.tone === 'cat' ? 'Cát' : p.tone === 'hung' ? 'Hung' : 'Bình'})`).join(', ');
      parts.push(`鬼谷子 GUIGUZI (4 trụ): ${pillars4}. Tổng ${gg.toneVi}. Năm ${gg.yearJiaZi} ${gg.nayin}/${gg.vi} — ${gg.fortune?.slice(0, 100) || ''} ${gg.ganMod || ''}. Nghề: ${(gg.career || '').slice(0, 50)}.`);
    }
    // [loop 536] 鬼谷子分定經 (两头钳) — 年干×时干 → 配卦 → 命格 (VN translated)
    const fdg = guiguziFDG(R);
    if (fdg) {
      let line = `鬼谷子分定經 兩頭鉗 (源《永樂大典》): ${fdg.combo} → quẻ ${fdg.guaVi} (cách「${fdg.geMing}」). ${fdg.stars ? 'Ba sao: ' + fdg.stars + '. ' : ''}${fdg.starDesc ? fdg.starDesc.slice(0, 200) + ' ' : ''}${fdg.guaMeaning || ''} ${fdg.shuYun ? '述雲: ' + fdg.shuYun : ''}`;
      if (fdg.geShiAnalysis && fdg.geShiAnalysis.length) {
        line += ` 格诗分層: ${fdg.geShiAnalysis.map(a => a.slice(0, 70)).join(' | ')}`;
      }
      parts.push(line);
    }
    // [loop 545] TỔNG HỢP 3 HỆ QUẺ DỊCH (河洛理数 + 鬼谷分定經) — kết nối Dịch số với bát tự + quỷ cốc
    try {
      const syn = hexagramSynthesis(R);
      if (syn.ok && syn.synthesis) {
        const he = syn.systems.heluo, gg = syn.systems.guiguzi;
        let line = `TỔNG HỢP KINH DỊCH (3 hệ quẻ): `;
        if (he) line += `河洛理数 (Bát tự→本命卦) = ${he.nameVi} [${he.tone}]: ${he.fortune?.slice(0, 90)}${he.nature ? ` (${he.nature})` : ''}. `;
        if (gg) line += `鬼谷分定經 (can năm×giờ→配卦) = ${gg.nameVi}「${gg.geMing}」[${gg.tone}]. `;
        line += `→ ${syn.synthesis.verdict}. ${syn.synthesis.advice || ''}`;
        parts.push(line);
      }
    } catch (e) {}
    // [loop 546] 六道轮回 (ṣaḍ-gati) — BaZi → tam độc → khuynh hướng 6 đạo (Phật giáo, Skt)
    try {
      const ld = computeLiuDao(R);
      if (ld.ok) {
        parts.push(`LỤC ĐẠO 輪迴 (ṣaḍ-gati, Phạn): tam độc [THAM ${ld.poisons.tham}/SÂN ${ld.poisons.san}/SI ${ld.poisons.si}] → khuynh hướng ${ld.realm.vi} (${ld.realm.skt}, ${ld.realm.tier === 'thiện' ? 'thiện đạo' : 'ác đạo'}). Nghiệp nhân: ${ld.realm.karmaCause}. ${ld.narrative.slice(0, 160)} (Đây là góc nhìn tu học dân gian融通, KHÔNG tiên đoán tái sinh).`);
      }
    } catch (e) {}
    // [loop 561] DESTINY CONSENSUS — tổng hợp đa hệ thống (BaZi + 称骨 + Dịch + 六道)
    try {
      const dc = destinyConsensus(R);
      if (dc.ok && dc.consensus) {
        const sys = dc.systems;
        parts.push(`DESTINY CONSENSUS (meta): BaZi=${sys.bazi?.detail || '?'} | 称骨=${sys.chenggu?.detail || '?'} | Dịch=${sys.hexagram?.detail?.slice(0, 30) || '?'} | 六道=${sys.liudao?.realm || '?'}. → ${dc.consensus.verdict} (agreement ${dc.consensus.agreement}, ${dc.consensus.n} hệ). ${dc.consensus.narrative.slice(0, 200)}`);
      }
    } catch (e) {}
    // [loop 591] SYNTHESIS tổng luận — điểm mệnh + percentile + silver lining + fortune
    try {
      const syn = synthesize(R);
      if (syn) {
        let line = `TỔNG LUẬN MỆNH: ${syn.score}/100 (${syn.gradeVi}`;
        if (syn.percentile) line += `, cao hơn ${syn.percentile}% lá số`;
        line += `). Xu hướng: ${syn.fortuneVi}.`;
        const silver = (syn.paragraphs || []).find((p) => p.includes('TIA SÁNG'));
        if (silver) line += ' ' + silver.slice(0, 200);
        parts.push(line);
      }
    } catch (e) {}
  } catch (e) {}
  try {
    const dnp = dayNayinPersonality(R);
    if (dnp && dnp.traits) parts.push(`日柱納音 BẢN CHẤT: ${dnp.dayJiaZi} nạp âm ${dnp.nayin} (${dnp.vi}) — ${dnp.nature}. ${dnp.traits.slice(0, 80)} Mạnh: ${dnp.strength}. Yếu: ${dnp.weakness}.`);
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

  // [loop 336] Tương tác Tứ Trụ (can/chi 合/冲/害/刑/三合/半合) — cấu trúc tương tác nguyên cục, từng thiếu trong brief
  try {
    const it = R.interactions;
    if (it && it.summary && !it.summary.includes('yên tĩnh')) parts.push(`TƯƠNG TÁC TỨ TRỤ: ${it.summary}`);
  } catch (e) {}

  // Ẩn hợp
  try {
    const ah = detectAnhe(R.chart);
    if (ah.pairs.length) {
      parts.push(`ẨN HỢP: ${ah.summary}`);
    }
  } catch (e) {}

  // [loop 316] Thập thần tổ hợp (cấu hình cát/hung kinh điển) — để AI trả lời «cấu hình mệnh»
  try {
    const cb = detectCombos(R.chart, R.strength);
    if (cb.length) {
      const cat = cb.filter((c) => c.tone === 'cat').map((c) => c.vi + (c.genuine === false ? '(hình thức)' : ''));
      const hung = cb.filter((c) => c.tone !== 'cat').map((c) => c.vi + (c.mitigation ? '[đã chế:' + c.mitigation + ']' : (c.genuine === false ? '(hình thức)' : '[chưa chế]')));
      if (cat.length) parts.push(`TỔ HỢP CÁT (十神组合): ${cat.join(', ')}.`);
      if (hung.length) parts.push(`TỔ HỢP HUNG: ${hung.join(', ')}.`);
    }
  } catch (e) {}

  // [loop 317] Lục phụ tinh (6 sao quý nhân phò tá 紫微) — bổ trợ luận quý nhân
  try {
    const CN = { '一':1,'二':2,'三':3,'四':4,'正':1,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,'十一':11,'十二':12,'冬':11,'腊':12 };
    const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    const lm = CN[String(R.chart.lunar.month).replace(/^闰/, '')] || 0;
    const ho = ZHI.indexOf(R.chart.pillars.time.zhi) + 1;
    const fx = computeFuxing(lm, ho, R.chart.pillars.year.gan);
    parts.push(`LỤC PHỤ TINH (六辅星): ${fx.stars.map((s) => `${s.vi}@${s.atZhi}`).join(', ')}.`);
  } catch (e) {}

  // [loop 321] Lục sát tinh (6 sao hung 紫微) — bổ trợ luận áp lực/hao tổn
  try {
    const aux = computeAuxStars(R.chart.pillars.year.gan, R.chart.pillars.year.zhi,
      ({ '一':1,'二':2,'三':3,'四':4,'正':1,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,'十一':11,'十二':12,'冬':11,'腊':12 })[String(R.chart.lunar.month).replace(/^闰/, '')] || 0,
      R.chart.pillars.time.zhi);
    const sha = ['擎羊', '陀罗', '火星', '铃星', '地空', '地劫'].map((s) => aux[s] ? `${aux[s].vi}@${aux[s].branch}` : null).filter(Boolean);
    if (sha.length) parts.push(`LỤC SÁT TINH (六煞星): ${sha.join(', ')}.`);
  } catch (e) {}

  // [loop 441] 紫微 độ sáng mệnh cung — AI cần biết sao chính sáng (庙/旺) hay tối (陷/地)
  try {
    const inp = R.chart.input;
    const zr = computeZiwei(inp.year, inp.month, inp.day, inp.hour, inp.minute, inp.gender);
    const bw = analyzeZiweiBrightness(zr);
    const ming = zr.palaces.find((p) => p.isMing);
    if (ming && bw.items?.length) {
      const mingStars = bw.items.filter((i) => i.zhi === ming.zhi);
      if (mingStars.length) parts.push(`紫微 Mệnh cung độ sáng: ${mingStars.map((s) => `${s.starVi || s.star}=${s.vi}(${s.score > 0 ? '+' : ''}${s.score})`).join(', ')}. ${bw.summary || ''}`);
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
    const _spDir = { 木: 'Đông', 火: 'Nam', 土: 'Tây Nam/Trung', 金: 'Tây', 水: 'Bắc' }[sp.spouseWx] || '?';
    parts.push(`PHỐI NGÃU: ${sp.spouseStar}(${sp.spouseWxVi}) ${sp.strength} | Dụng=${sp.isYong} Kỵ=${sp.isJi} | cung ${sp.palaceZhiVi} ${sp.palaceStable ? 'yên' : 'xung'}${sp.interactions.length ? ' | ' + sp.interactions.join(';') : ''} | hướng gặp: ${_spDir}${sp.isYong ? ' (Dụng → bạn đời mang lại may mắn)' : ''}`);
  } catch (e) {}

  // [loop 601] TÌNH DUYÊN SÂU — đào hoa + hồng diễm + duyên score + timing
  try {
    const rm = analyzeRomance(R);
    if (rm) {
      let line = `TÌNH DUYÊN SÂU: đào hoa ${rm.peachBlossom}(${rm.peachByDay || '?'} by day)`;
      if (rm.redAttraction) line += ` | hồng diễm ${rm.redAttraction}`;
      if (rm.spouseStrength) line += ` | phối ngẫu lực ${rm.spouseStrength}`;
      line += ` | duyên score ${rm.romanceScore ?? '?'}`;
      if (rm.palaceStable === false) line += ` | cung phối ngẫu BỊ XUNG — hôn nhân biến động`;
      if (rm.warnings && rm.warnings.length) line += ` | ⚠ ${rm.warnings.slice(0, 2).join('; ')}`;
      if (rm.timingYears && rm.timingYears.length) line += ` | năm duyên: ${rm.timingYears.slice(0, 3).map((t) => typeof t === 'object' ? t.year : t).join(', ')}`;
      parts.push(line);
    }
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

  // Đại vận thập thần (3 vận gần nhất) + nạp âm
  try {
    const dg = dayunGodMeaning(R.chart, R.dayun);
    // [loop 668] 起运 age — khi mệnh bắt đầu走大运 (cột mốc vận mệnh kích hoạt)
    const firstDy = (R.dayun || [])[0];
    if (firstDy) parts.push(`起运: ${firstDy.startAge} tuổi (năm ${firstDy.startYear}) — mệnh bắt đầu走大运 từ đây, trước đó theo tiểu vận/月柱.`);
    const near = dg.items.slice(0, 4).map((d) => `${d.ganZhi}[${d.startAge}t:${d.godVi}(${d.cat})${ganZhiNayin(d.ganZhi) ? '/' + ganZhiNayin(d.ganZhi) : ''}]`);
    parts.push(`ĐẠI VẬN THẬP THẦN: ${near.join(' ')}`);
    // [loop 436] 空亡 weakening note — cho AI biết大运 nào bị giảm lực
    const kwDayun = (R.dayun || []).filter((d) => d._kwNote);
    if (kwDayun.length) parts.push(`ĐẠI VẬN KHÔNG VONG: ${kwDayun.map((d) => d.ganZhi + '[' + d.startAge + 't] ' + d._kwNote).join(' | ')}`);
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
    // [loop 342] 格神 nguồn (kết nối 月令 → 格局) — để AI luận «cách cục lấy từ Nguyệt lệnh nào»
    const pat = R.pattern, gs = pat && pat.geShen;
    if (gs && gs.gan) parts.push(`CÁCH CỤC: ${pat.vi} (${pat.name}). 格神 ${gs.gan}(${TEN_GOD_VI[gs.god] || gs.god}, ${WX_VI[gs.wx] || gs.wx}) ← Nguyệt lệnh ${gs.source || '?'}.`);
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
    // [loop 505] surface tone (favor-aware từ loop 490) trong brief
    const _toneVi = (t) => t === 'cat' ? 'Cát' : t === 'hung' ? 'Hung' : '';
    parts.push(`SỰ KIỆN ${yr}-${yr + 2}: ${ev.years.map((y) => `${y.year}(${y.lnArea}${y.sameGod ? '/nhân đôi' : ''}${y.tone ? '/' + _toneVi(y.tone) : ''})`).join(', ')}.`);
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

  // [loop 271] lifestyle 1-liners — city/diet/investment/business (trước đây chỉ có trên card, AI không biết)
  try {
    const c = cityRecommendation(R);
    const cities = c.bestCityType?.cities?.slice(0, 3).join(', ') || '';
    parts.push(`THÀNH PHỐ HỢP: hướng ${c.bestDirectionVi || '?'}, ${c.bestCityType?.vi || '?'}${cities ? ' (' + cities + ')' : ''}${c.careerCityVi ? ', career=' + c.careerCityVi : ''}${c.wealthCityVi ? ', wealth=' + c.wealthCityVi : ''}.`);
  } catch (e) {}
  try {
    const d = personalNutrition(R);
    const f = d.dungFlavor || {};
    parts.push(`ẨM THỰC: vị ${f.vi || '?'} (${f.flavor || ''})${f.foods ? ', thực phẩm: ' + (f.foods + '').slice(0, 60) : ''}${d.tea ? '. Trà: ' + d.tea.slice(0, 40) : ''}.`);
  } catch (e) {}
  try {
    const inv = investmentStyle(R);
    const alloc = inv.allocation ? Object.entries(inv.allocation).map(([k, v]) => `${k.replace(/_/g, '')} ${v}%`).join(' ') : '';
    parts.push(`ĐẦU TƯ: ${inv.style || '?'} (risk ${inv.riskScore ?? '?'}/10)${alloc ? ', phân bổ: ' + alloc : ''}${inv.canDayTrade ? ', HỢP day-trade' : ''}${inv.dayTradeNote ? '. ' + inv.dayTradeNote : ''}.`);
  } catch (e) {}
  try {
    const biz = analyzeBusiness(R);
    parts.push(`KINH DOANH: ${biz.shouldStart ? '✓ nên khởi nghiệp' : '⚠ thận trọng'}${biz.bizTypes?.length ? ' (' + biz.bizTypes.slice(0, 3).join(', ') + ')' : ''}${biz.hasCaiKu === false ? ', KHÔNG có tài khố' : ''}.`);
  } catch (e) {}
  // [loop 602] NĂM VÀNG + 10 NĂM TỚI — AI CẦN biết timing để trả lời «năm nào tiến thủ lớn»
  try {
    const gy = findGoldenYear(R, new Date().getFullYear(), 12);
    const tg = gy.ranked.filter((r) => r.isTrulyGolden).map((r) => r.year);
    const top3 = gy.ranked.slice(0, 3).map((r) => `${r.year}(${r.totalScore})`);
    const bot3 = gy.ranked.slice(-3).map((r) => `${r.year}(${r.totalScore})`);
    parts.push(`NĂM VÀNG + 10 NĂM TỚI: ${tg.length ? '★ Năm vàng thực: ' + tg.join(', ') : 'không có năm vàng thực (đại vận+lưu niên chưa đủ Dụng)'} | TỐT: ${top3.join(', ')} | XẤU: ${bot3.join(', ')}.`);
  } catch (e) {}
  // [loop 613→626] FAMILY MEMBERS + LỤC THÂN ĐOẠN — AI BIẾT ai trong gia đình + suy sâu全息
  if (R._family && R._family.length) {
    const fam = R._family.map((f) => {
      const [y, m, d] = (f.date || '').split('-').map(Number);
      const [h] = (f.time || '12:00').split(':').map(Number);
      return `${f.label || f.relation}: ${d}/${m}/${y}${f.time && f.time !== '12:00' ? ' ' + f.time : ''} (${f.gender}${f.hourUnknown ? ', giờ chưa rõ' : ''})`;
    }).join(' | ');
    parts.push(`👨‍👩‍👧‍👦 GIA ĐÌNH (từ «Nghiệm Chứng Gia Tộc»): ${fam}. KHI USER HỎI về người trong danh sách này → DÙNG tool analyze_relative với ngày sinh TỪ DANH SÁCH (KHÔNG cần hỏi lại).`);
    // [loop 626] LỤC THÂN ĐOẠN — suy sâu全息: so sao十神+cung宫 vị của chủ thể với lá THẬT người thân.
    //   Cho AI sẵn insight sâu (tương ứng/hi sinh/bất ngờ) để trả lời «gia đình ảnh hưởng vận mình ra sao».
    try {
      const members = R._family.filter((f) => f.date).map((f) => {
        const [y, m, d] = (f.date || '').split('-').map(Number);
        const [h, mi] = (f.time || '12:00').split(':').map(Number);
        const roleMap = { father: 'father', mother: 'mother', mẹ: 'mother', bố: 'father', cha: 'father', sibling: 'sibling', em: 'sibling', anh: 'sibling', chị: 'sibling', spouse: 'spouse', child: 'child', con: 'child', cháu: 'child' };
        const role = roleMap[(f.role || '').toLowerCase()] || 'sibling';
        return { role, label: f.label || f.relation, hourUnknown: !!f.hourUnknown, R: analyze(y, m, d, h, mi, f.gender, new Date().getFullYear()) };
      }).filter((mm) => mm.R);
      if (members.length) {
        const dd = deduceFromFamily(R, members);
        if (dd.ok) {
          // [loop 660] gắn hourWarning cho người thân chưa rõ giờ (trụ giờ ~25% lá số → đọc có thể sai)
          const hourWarn = members.filter((mm) => mm.hourUnknown).map((mm) => mm.label);
          const relBrief = dd.relations.map((r) => {
            const m = members.find((mm) => mm.label === r.label || mm.role === r.role);
            return `${r.label}: sao ${r.star}(${r.starWx})@${r.palace} → ${r.verify}; ${r.insight.slice(0, 140)}${m && m.hourUnknown ? ' ⚠ GIỜ CHƯA RÕ → Dụng/điểm CÓ THỂ SAI ~25%' : ''}`;
          }).join(' ‖ ');
          parts.push(`🔮 LỤC THÂN ĐOẠN (六亲断/家庭全息): ${dd.summary} ${relBrief} ${dd.holographic.length ? 'HOLOGRAPHIC: ' + dd.holographic.join(' / ') : ''} ${hourWarn.length ? '⚠ GIỜ CHƯA RÕ: ' + hourWarn.join(', ') + ' → đọc cần thận trọng (~25% sai). GIẢI QUYẾT: hỏi người lớn tìm giờ sinh thật, HOẶC mở lá số riêng người đó + xem card «Quét 12 Giờ» để biết Dụng có đổi theo giờ không.' : ''}[${dd.disclaimer}]`);
        }
      }
    } catch (e) { /* deduction optional — không crash brief */ }
  }
  // [loop 671] 🎯 3 HÀNH ĐỘNG ƯU TIÊN — tổng hợp situation user thành 3 actions ngắn.
  //   AI có sẵn «lead» hành động — không phải tự tổng hợp từ 218 dòng.
  try {
    const _actions = [];
    const _curYear = new Date().getFullYear();
    const _age = _curYear - R.chart.input.year;
    const _dy = (R.dayun || []).find((d) => _age >= d.startAge && _age < d.startAge + 10);
    // (1) đỉnh vận / vận khó
    if (_dy?.rating === 'Đại cát') {
      const _god = _dy.zhiGod || _dy.ganGod || '';
      const _st = /Tài/.test(_god) ? 'đầu tư/kinh doanh' : /Quan|Sát/.test(_god) ? 'thăng tiến sự nghiệp' : /Ấn/.test(_god) ? 'học vấn/chứng chỉ' : 'tiến thủ lớn';
      _actions.push(`Tận dụng ĐỈNH VẬN (${_dy.ganZhi}) → ${_st} + nắm bắt năm vàng`);
    } else if (_dy && /Hung|nghịch/.test(_dy.rating)) {
      _actions.push(`Đại vận ${_dy.rating} → giữ ổn định, tránh rủi ro lớn, đợi vận đổi`);
    } else {
      _actions.push(`Đại vận ${_dy?.rating || '?'} → tiến vừa phải, bổ Dụng ${R.yong?.primary || '?'}`);
    }
    // (2) taisui cá nhân / gia đình
    const _tsZhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][((_curYear - 4) % 12 + 12) % 12];
    const _subjZhi = R.chart?.pillars?.year?.zhi;
    if (_subjZhi) { try { const ps = personalTaSui(_subjZhi, _tsZhi); if (ps.offends) _actions.push(`Bạn phạm ${ps.types.map((t) => t.vi).join('+')} thái tuế ${_curYear} → hóa giải (an thái tuế/đỗ xuân)`); } catch (_) {} }
    // (3) bổ Dụng (lifestyle)
    const _dung = R.yong?.primary;
    const _dungAct = { 木: 'màu xanh, hướng Đông, cây cối', 火: 'màu đỏ, hướng Nam, ánh sáng', 土: 'màu vàng, hướng Tây Nam, gốm đá', 金: 'màu trắng, hướng Tây, kim loại', 水: 'màu đen, hướng Bắc, nước' }[_dung] || '';
    if (_dungAct) _actions.push(`Bổ Dụng ${_dung}: ${_dungAct} + tránh hành khắc`);
    if (_actions.length) parts.push(`🎯 HÀNH ĐỘNG ƯU TIÊN (${_curYear}): ${_actions.map((a, i) => `${['①','②','③','④'][i] || '•'} ${a}`).join(' ')}.`);
  } catch (_) {}

  return parts.length ? '\n--- PHÂN TÍCH CHUYÊN SÂU ---\n' + parts.join('\n') : '';
}

