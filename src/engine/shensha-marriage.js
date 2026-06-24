// ============================================================================
//  THẦN SÁT HÔN NHÂN: 孤辰寡宿 + 天罗地网 + 亡神劫煞
//  Ảnh hưởng trực tiếp luận tình duyên/hôn nhân (người hay hỏi nhất).
//  孤辰 = nam dễ cô độc; 寡宿 = nữ dễ góa; 天罗地网 = cảm giác bị kẹt.
//  Nguồn: 神峰通考, 三命通会 安星 (verified 四方 nhóm table).
// ============================================================================

// 孤辰寡宿 — theo 四方 nhóm (年支):
const GUCHEN_GROUP = {
  // [寅卯辰] 东方 → 孤辰=巳, 寡宿=丑
  寅: { gu: '巳', gua: '丑' }, 卯: { gu: '巳', gua: '丑' }, 辰: { gu: '巳', gua: '丑' },
  // [巳午未] 南方 → 孤辰=申, 寡宿=辰
  巳: { gu: '申', gua: '辰' }, 午: { gu: '申', gua: '辰' }, 未: { gu: '申', gua: '辰' },
  // [申酉戌] 西方 → 孤辰=亥, 寡宿=未
  申: { gu: '亥', gua: '未' }, 酉: { gu: '亥', gua: '未' }, 戌: { gu: '亥', gua: '未' },
  // [亥子丑] 北方 → 孤辰=寅, 寡宿=戌
  亥: { gu: '寅', gua: '戌' }, 子: { gu: '寅', gua: '戌' }, 丑: { gu: '寅', gua: '戌' },
};

// 亡神劫煞 — theo 三合 nhóm (年支):
const WANGJIE_GROUP = {
  申: { wang: '亥', jie: '巳' }, 子: { wang: '亥', jie: '巳' }, 辰: { wang: '亥', jie: '巳' },
  寅: { wang: '巳', jie: '亥' }, 午: { wang: '巳', jie: '亥' }, 戌: { wang: '巳', jie: '亥' },
  巳: { wang: '申', jie: '寅' }, 酉: { wang: '申', jie: '寅' }, 丑: { wang: '申', jie: '寅' },
  亥: { wang: '寅', jie: '申' }, 卯: { wang: '寅', jie: '申' }, 未: { wang: '寅', jie: '申' },
};

const INFO = {
  孤辰: { vi: 'Cô Thần', desc: 'nam mệnh → khuynh hướng cô độc, khó tìm hiểu bạn đời, kết hôn muộn; cần chủ động mở lòng.', tone: 'volatile' },
  寡宿: { vi: 'Quả Tú', desc: 'nữ mệnh → khuynh hướng cô quả, duyên muộn, cần chọn người bao dung; không tuyệt đối — tích đức hoá giải.', tone: 'volatile' },
  天罗: { vi: 'Thiên La', desc: 'cảm giác bị vướng/kẹt — sự nghiệp/tình cảm dường như bị chặn; cần kiên nhẫn vượt qua.', tone: 'volatile' },
  地网: { vi: 'Địa Võng', desc: 'cảm giác bị vướng ở dưới — khó tiến lên, cần đột phá (xung) để thoát.', tone: 'volatile' },
  亡神: { vi: 'Vong Thần', desc: 'hay lo nghĩ, mất tinh thần, dễ bị lừa; cẩn thận khẩu thiệt/thất vật.', tone: 'volatile' },
  劫煞: { vi: 'Kiếp Sát', desc: 'dễ bị cướp đoạt/hao tổn bất ngờ; cẩn thận tài sản, tránh cho vay mượn lớn.', tone: 'volatile' },
};

/**
 * Tính thần sát hôn nhân cho lá số.
 * @param chart - buildChart output
 * @returns [{ star, vi, desc, tone, at: [positions] }]
 */
export function computeMarriageShensha(chart) {
  const yearZhi = chart.pillars.year.zhi;
  const out = [];

  // 孤辰寡宿
  const gc = GUCHEN_GROUP[yearZhi];
  if (gc) {
    const guHit = [];
    const guaHit = [];
    for (const key of ['year', 'month', 'day', 'time']) {
      const z = chart.pillars[key].zhi;
      if (z === gc.gu) guHit.push(key);
      if (z === gc.gua) guaHit.push(key);
    }
    if (guHit.length) out.push({ star: '孤辰', vi: INFO['孤辰'].vi, desc: INFO['孤辰'].desc, tone: 'volatile', at: guHit, positions: guHit.map((k) => chart.pillars[k].zhi).join(',') });
    if (guaHit.length) out.push({ star: '寡宿', vi: INFO['寡宿'].vi, desc: INFO['寡宿'].desc, tone: 'volatile', at: guaHit, positions: guaHit.map((k) => chart.pillars[k].zhi).join(',') });
  }

  // 天罗地网: 戌亥=天罗, 辰巳=地网
  const tianLuoHit = [];
  const diWangHit = [];
  for (const key of ['year', 'month', 'day', 'time']) {
    const z = chart.pillars[key].zhi;
    if (z === '戌' || z === '亥') tianLuoHit.push(key);
    if (z === '辰' || z === '巳') diWangHit.push(key);
  }
  if (tianLuoHit.length) out.push({ star: '天罗', vi: INFO['天罗'].vi, desc: INFO['天罗'].desc, tone: 'volatile', at: tianLuoHit, positions: tianLuoHit.map((k) => chart.pillars[k].zhi).join(',') });
  if (diWangHit.length) out.push({ star: '地网', vi: INFO['地网'].vi, desc: INFO['地网'].desc, tone: 'volatile', at: diWangHit, positions: diWangHit.map((k) => chart.pillars[k].zhi).join(',') });

  // 亡神劫煞
  const wj = WANGJIE_GROUP[yearZhi];
  if (wj) {
    const wangHit = [];
    const jieHit = [];
    for (const key of ['year', 'month', 'day', 'time']) {
      const z = chart.pillars[key].zhi;
      if (z === wj.wang) wangHit.push(key);
      if (z === wj.jie) jieHit.push(key);
    }
    if (wangHit.length) out.push({ star: '亡神', vi: INFO['亡神'].vi, desc: INFO['亡神'].desc, tone: 'volatile', at: wangHit, positions: wangHit.map((k) => chart.pillars[k].zhi).join(',') });
    if (jieHit.length) out.push({ star: '劫煞', vi: INFO['劫煞'].vi, desc: INFO['劫煞'].desc, tone: 'volatile', at: jieHit, positions: jieHit.map((k) => chart.pillars[k].zhi).join(',') });
  }

  return out;
}

export { GUCHEN_GROUP, WANGJIE_GROUP, INFO };

// ---- 4 THẦN SA BỔ SUNG (hay hỏi) ----
// 丧门吊客: year+2 = 丧门, year+6 = 吊客 (前二/前六)
const ZHI12 = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const FWD2 = {}; const FWD6 = {};
ZHI12.forEach((z,i) => { FWD2[z] = ZHI12[(i+2)%12]; FWD6[z] = ZHI12[(i+6)%12]; });

// 血刃: by month branch (月支)
const XUEREN = { 子:'酉', 丑:'戌', 寅:'亥', 卯:'子', 辰:'丑', 巳:'寅', 午:'卯', 未:'辰', 申:'巳', 酉:'午', 戌:'未', 亥:'申' };

// 元辰 (大耗): by year branch + yin/yang
// 阳男阴女顺数, 阴男阳女逆数, 从年支起数到"太岁对宫"... simplified: 元辰 = year-1 (for yang), year+1 (for yin)
const YUANCHEN = { 甲:'未', 乙:'午', 丙:'巳', 丁:'辰', 戊:'巳', 己:'辰', 庚:'卯', 辛:'寅', 壬:'丑', 癸:'子' };
const DAHAO = { 甲:'丑', 乙:'寅', 丙:'卯', 丁:'辰', 戊:'卯', 己:'辰', 庚:'巳', 辛:'午', 壬:'未', 癸:'申' };

export function computeExtraShensha(chart) {
  const yz = chart.pillars.year.zhi;
  const mz = chart.pillars.month.zhi;
  const yg = chart.dayGan;
  const out = [];
  const allZhi = ['year','month','day','time'].map(k => chart.pillars[k].zhi);

  // 丧门
  const sm = FWD2[yz];
  if (allZhi.includes(sm)) out.push({ star:'丧门', vi:'Tang Môn', desc:'chủ tang sự, bệnh nặng, thương tâm — gặp lưu niên mang chi này cần chú ý sức khoảogia đình', at: allZhi.filter(z=>z===sm).join(','), tone:'volatile' });
  // 吊客
  const dk = FWD6[yz];
  if (allZhi.includes(dk)) out.push({ star:'吊客', vi:'Điếu Khách', desc:'chủ có tang, wearing mourning — năm gặp chi này cẩn thận người lớn tuổi', at: allZhi.filter(z=>z===dk).join(','), tone:'volatile' });
  // 血刃
  const xr = XUEREN[mz];
  if (allZhi.includes(xr)) out.push({ star:'血刃', vi:'Huyết Nhận', desc:'chủ出血, phẫu thuật, tai nạn đao kiếm — cẩn thận刀具, tránh ẩu đả', at: allZhi.filter(z=>z===xr).join(','), tone:'volatile' });
  // 元辰
  const yc = YUANCHEN[yg];
  if (allZhi.includes(yc)) out.push({ star:'元辰', vi:'Nguyên Thần', desc:'chủ hao tốn, tiết kiệm khó, vận nhạt — nên tránh đầu tư lớn', at: allZhi.filter(z=>z===yc).join(','), tone:'volatile' });
  // 大耗
  const dh = DAHAO[yg];
  if (allZhi.includes(dh)) out.push({ star:'大耗', vi:'Đại Hao', desc:'chủ破财 lớn, mất mát tài sản — tuyệt đối tránh cho vay/đầu cơ năm gặp', at: allZhi.filter(z=>z===dh).join(','), tone:'volatile' });

  return out;
}
