// facts.js — Extract FACTS from chart for reasoning engine
// KEY: tàng can ALWAYS included. Gender ALWAYS included. No data missed.

const GAN_WX = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
const NORM_GOD = (g) => {
  const map = {'正官':'正官','七杀':'七杀','七殺':'七杀','正印':'正印','偏印':'偏印','食神':'食神','伤官':'伤官','傷官':'伤官','比肩':'比肩','劫财':'劫财','劫財':'劫财','偏财':'偏财','偏財':'偏财','正财':'正财','正財':'正财','日主':'日主'};
  return map[g] || g;
};

/**
 * Extract structured facts from chart + reading.
 * @param {Object} chart - chart object (R.chart or c)
 * @param {Object} R - full reading (for wx, yong, strength, dayun)
 * @param {string} gender - 'male' | 'female'
 * @returns {Object} fact map { factName: value }
 */
export function extractFacts(chart, R, gender) {
  const c = chart?.chart ? chart.chart : chart;
  const facts = {};
  const positions = ['year', 'month', 'day', 'time'];

  // === BASIC ===
  facts.gender = gender || 'male';
  facts.isFemale = gender === 'female' || gender === 'nữ' || gender === 'nu' || gender === '女';
  facts.dayMaster = c?.dayMaster?.gan || '';
  facts.dayMasterWx = GAN_WX[facts.dayMaster] || '';

  // === THẬP THẦN ĐẾM (kể TÀNG CAN) ===
  const godCount = {};  // { 正官: 3, 比肩: 2, ... }
  const godPositions = {};  // { 正官: ['year_tàng(丁)', 'month_tàng(丙)'], ... }

  for (const pos of positions) {
    const p = c?.pillars?.[pos];
    if (!p) continue;
    const posVi = { year: 'năm', month: 'tháng', day: 'ngày', time: 'giờ' }[pos] || pos;

    // Lộ can
    if (p.ganGod && p.ganGod !== '日主') {
      const g = NORM_GOD(p.ganGod);
      godCount[g] = (godCount[g] || 0) + 1;
      if (!godPositions[g]) godPositions[g] = [];
      godPositions[g].push(`${posVi}_lộ(${p.gan})`);
    }

    // TÀNG CAN (hidden stems — NEVER skip!)
    for (const h of (p.hidden || [])) {
      if (h.god && h.god !== '日主') {
        const g = NORM_GOD(h.god);
        godCount[g] = (godCount[g] || 0) + 1;
        if (!godPositions[g]) godPositions[g] = [];
        godPositions[g].push(`${posVi}_tàng(${h.gan})`);
      }
    }
  }

  // Store god counts as facts
  const ALL_GODS = ['正官','七杀','正印','偏印','食神','伤官','比肩','劫财','正财','偏财'];
  for (const g of ALL_GODS) {
    facts[`has_${g}`] = (godCount[g] || 0) > 0;
    facts[`${g}_count`] = godCount[g] || 0;
    facts[`${g}_positions`] = godPositions[g] || [];
  }

  // === NGŨ HÀNH VƯỢNG SUY ===
  const wxPct = R?.wx?.pct || {};
  const wxSorted = Object.entries(wxPct).sort(([,a],[,b]) => b - a);
  facts.dominantWx = wxSorted[0]?.[0] || '';
  facts.dominantWxPct = wxSorted[0]?.[1] || 0;
  facts.weakestWx = wxSorted[wxSorted.length - 1]?.[0] || '';
  facts.weakestWxPct = wxSorted[wxSorted.length - 1]?.[1] || 0;

  // Element presence (≥1 pillar)
  for (const wx of ['木','火','土','金','水']) {
    facts[`wx_${wx}_pct`] = wxPct[wx] || 0;
    facts[`wx_${wx}_strong`] = (wxPct[wx] || 0) >= 30;
    facts[`wx_${wx}_weak`] = (wxPct[wx] || 0) <= 12;
  }

  // === VƯỢNG/NHƯỢC + DỤNG THẦN ===
  facts.isStrong = R?.strength?.strong || false;
  facts.isWeak = !facts.isStrong;
  facts.yongshen = R?.yong?.primary || '';
  facts.isTiaohou = R?.yong?.tiaohou?.override || false;
  facts.isCongge = R?.patternQuality?.quality === '从格' || R?.pattern?.type === 'congge' || false;

  // === ĐẠI VẬN HIỆN TẠI ===
  const age = new Date().getFullYear() - (c?.input?.year || 1990);
  const dayun = R?.dayun || [];
  let curDayun = dayun[0] || {};
  for (const d of dayun) { if ((d.startAge || 0) <= age) curDayun = d; }
  facts.currentDayunGz = curDayun.ganZhi || '';
  facts.currentDayunGanWx = curDayun.ganWx || '';
  facts.currentDayunZhiWx = curDayun.zhiWx || '';
  facts.currentAge = age;

  // Dayun supports Dụng?
  const dungWx = facts.yongshen;
  const GEN = {木:'火',火:'土',土:'金',金:'水',水:'木'};
  const dayunWxList = [facts.currentDayunGanWx, facts.currentDayunZhiWx].filter(Boolean);
  facts.dayunIsDung = dayunWxList.some(w => w === dungWx || GEN[w] === dungWx);
  facts.dayunIsKy = dayunWxList.some(w => {
    const KE = {木:'土',土:'水',水:'火',火:'金',金:'木'};
    return KE[w] === dungWx;
  });

  // === CÁCH CỤC ===
  facts.patternName = R?.pattern?.name || '';
  facts.patternVi = R?.pattern?.vi || '';
  facts.patternQuality = R?.patternQuality?.quality || '';

  // === ORGANIZATIONAL COMBINATIONS (pre-detected) ===
  const has = (g) => facts[`has_${g}`] === true;
  const hasAn = has('正印') || has('偏印');
  const hasTai = has('正财') || has('偏财');
  const hasTy = has('比肩') || has('劫财');
  facts.combo_shangguan_pei_yin = has('伤官') && hasAn;
  facts.combo_sha_yin = has('七杀') && hasAn;
  facts.combo_shi_zhi_sha = has('食神') && has('七杀');
  facts.combo_cai_sheng_guan = hasTai && has('正官');
  facts.combo_guan_sha_hon_ta = has('正官') && has('七杀');
  facts.combo_ty_tranh_tai = hasTy && hasTai;
  facts.combo_kieu_doat_thuc = has('偏印') && has('食神');
  facts.combo_cai_pha_an = hasTai && hasAn && facts.isStrong;

  // === [gap #4 NẠP DỮ LIỆU VÀO NÃO] THẦN SÁT (shensha) ===
  // Trước đây não mù về quý nhân/hoa cái/đào hoa/đếνη... giờ nạp đủ.
  const shensha = R?.shensha || {};
  facts.shenshaCount = 0;
  for (const [name, info] of Object.entries(shensha)) {
    const at = info?.at || info?.positions || [];
    if (at.length) {
      facts[`has_${name}`] = true;
      facts[`${name}_at`] = at;
      facts.shenshaCount++;
    }
  }

  // === DỤNG THẦN ĐẦY ĐỦ (用喜忌仇闲) + ĐIỀU HẬU ===
  const yong = R?.yong || {};
  facts.yong_xi = yong.xi || '';
  facts.yong_ji = yong.ji || '';
  facts.yong_chou = yong.chou || '';
  facts.yong_xian = yong.xian || '';
  facts.yong_secondary = yong.secondary || '';
  facts.yong_avoid = yong.avoid || [];
  facts.yong_relations = yong.relations || {};
  facts.tiaohouWx = yong.tiaohou?.primaryWx || '';
  facts.tiaohouOverride = yong.tiaohou?.override || false;

  // === CHẤT LƯỢNG CÁCH CỤC (成/败 + cứu ứng + tướng thần) ===
  const pq = R?.patternQuality || {};
  facts.patternCheng = pq.quality === '成格';
  facts.patternBai = pq.quality === '败格';
  facts.patternRescued = !!(pq.rescues && pq.rescues.length);
  facts.patternRescueCount = pq.rescues?.length || 0;
  facts.patternKeyStarGod = pq.keyStar?.god || '';
  facts.patternKeyStarRooted = !!pq.keyStar?.rooted;
  facts.patternKeyStarTransparent = !!pq.keyStar?.transparent;

  // === THỜI ĐIỂM VÀNG (lưu niên Cát / Đại cát) ===
  const _now = new Date().getFullYear();
  const golden = (R?.remedy?.timing || []).filter((t) => t.rating === 'Cát' || t.rating === 'Đại cát');
  facts.goldenYearCount = golden.length;
  facts.hasGoldenYearSoon = golden.some((t) => (t.year || 0) >= _now);
  facts.nextGoldenYear = golden.find((t) => (t.year || 0) >= _now)?.year || null;
  facts.hasHungYearSoon = (R?.remedy?.timing || []).some((t) => /Hung|Kỵ|大凶/i.test(t.rating || '') && (t.year || 0) >= _now);

  // === KHÔNG VƯƠNG (空亡) ===
  const kw = R?.kongwang || {};
  facts.hasKongwang = !!((kw.kong && kw.kong.length) || (kw.affected && kw.affected.length));
  facts.kongwangAffectedCount = kw.affected?.length || 0;

  // === NGUỒN LƯU (源流 — dòng chảy ngũ hành) ===
  const yl = R?.yuanliu || {};
  facts.yuanliuSourceWx = yl.source || '';
  facts.yuanliuEndpointWx = yl.endpoint || '';
  facts.yuanliuAspect = yl.aspectKey || '';
  facts.yuanliuGap = yl.gap || null;          // gap = ngũ hành đứt đoạn (bệnh của mệnh)

  // === LỤC THÂN (六亲 — quan hệ gia đình qua palace + star) ===
  const liuqin = R?.liuqin || [];
  facts.liuqinMissingStar = [];               // các quan hệ THIẾU sao (khắc/hao)
  for (const lq of liuqin) {
    if (!lq.hasStar) facts.liuqinMissingStar.push(lq.relation || lq.relVi || '');
  }
  facts.liuqinMissingCount = facts.liuqinMissingStar.length;

  // === CHẤT LƯỢNG TỨ TRỤ (盖头/截脚 — can-chi khắc, tổn thương) ===
  const perPillar = R?.pillarQuality?.perPillar || {};
  facts.damagedPillarCount = Object.values(perPillar).filter((p) => p?.damaged).length;
  facts.hasGaitou = Object.values(perPillar).some((p) => /盖头|thượng khắc|can khắc chi/i.test(p?.vi || ''));
  facts.hasJiejiao = Object.values(perPillar).some((p) => /截脚|tiệt cước|chi khắc can/i.test(p?.vi || ''));

  return facts;
}
