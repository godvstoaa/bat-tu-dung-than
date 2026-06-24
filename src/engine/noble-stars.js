// ============================================================================
//  高级神煞贵人组 (NHÓM QUÝ NHÂN / CAO CẤP THẦN SÁT)
//  Tổng hợp & luận giải 6 sao quý nhân / cát hung cổ pháp:
//    1. 天德贵人 Thiên Đức          (theo Nguyệt Chi) — ĐÃ có trong shensha.js
//    2. 月德贵人 Nguyệt Đức          (theo nhóm tam hợp Nguyệt Chi) — ĐÃ có
//    3. 三奇贵人 Tam Kỳ              (theo 4 Thiên Can) — ĐÃ có
//    4. 魁罡    Khôi Cương / Quù Cương (theo Nhật trụ) — ĐÃ có
//    5. 太极贵人 Thái Cực            (theo Nhật Can × Chi) — MỚI (chưa có ở shensha.js)
//    6. 国印贵人 Quốc Ấn             (theo Nhật Can × Chi) — MỚI
//
//  Nguyên tắc KHÔNG trùng lặp:
//    4 sao (Thiên Đức / Nguyệt Đức / Tam Kỳ / Khôi Cương) đã được tính trong
//    `shensha.js` → module này CHỈ đọc lại R.shensha (kết quả có sẵn) rồi
//    bổ sung diễn giải chuyên sâu + lời khinh thực tế; không tính lại.
//    2 sao (Thái Cực / Quốc Ấn) chưa có ở đâu → tính mới tại đây.
//
//  Nguồn cổ pháp: 渊海子平 · 三命通会 · 神峰通考.
//  Tác dụng trang điểm + luận giải phụ trợ (chính vẫn là Ngũ hành + Thập thần).
// ============================================================================

// ---------------------------------------------------------------------------
// 5. 太极贵人 (THÁI CỰC QUÝ NHÂN) — theo Nhật Can, gặp Địa Chi tương ứng
//    甲乙 → 子午  ·  丙丁 → 卯酉  ·  戊己 → 辰戌丑未  ·  庚辛 → 寅亥  ·  壬癸 → 巳申
//    (三命通会: 太极贵人者, 主聪明好学, 喜神秘, 近宗教/哲学/玄学)
// ---------------------------------------------------------------------------
export const TAIJI = {
  甲: ['子', '午'], 乙: ['子', '午'],
  丙: ['卯', '酉'], 丁: ['卯', '酉'],
  戊: ['辰', '戌', '丑', '未'], 己: ['辰', '戌', '丑', '未'],
  庚: ['寅', '亥'], 辛: ['寅', '亥'],
  壬: ['巳', '申'], 癸: ['巳', '申'],
};

// ---------------------------------------------------------------------------
// 6. 国印贵人 (QUỐC ẤN QUÝ NHÂN) — theo Nhật Can, gặp Địa Chi tương ứng
//    甲→戌 乙→亥 丙→丑 丁→寅 戊→丑 己→寅 庚→辰 辛→巳 壬→未 癸→申
//    (主房产/权力变动 — 主人诚实可靠, 由房产/权力而得利)
// ---------------------------------------------------------------------------
export const GUO_YIN = {
  甲: '戌', 乙: '亥', 丙: '丑', 丁: '寅', 戊: '丑', 己: '寅',
  庚: '辰', 辛: '巳', 壬: '未', 癸: '申',
};

// ---------------------------------------------------------------------------
// Thông tin diễn giải cho 6 sao (zh / vi / meaning cổ pháp / advice thực tế)
// ---------------------------------------------------------------------------
const NOBLE_INFO = {
  tianDe: {
    zh: '天德贵人', vi: 'Thiên Đức Quý Nhân',
    meaning: 'Sao đại cát chủ từ bi nhân hậu, 逢凶化吉 (gặp dữ hoá lành), chủ một đời ít gặp nguy hiểm, tai nạn tự giảm.',
    advice: 'Phát huy lòng nhân từ, tích âm đức để giữ vững phúc cát. Khi gặp năm xung khắc, 天德 giúp hoá giải.',
  },
  yueDe: {
    zh: '月德贵人', vi: 'Nguyệt Đức Quý Nhân',
    meaning: 'Sao cát chủ phúc đức tự nhiên, ít bệnh tật, ít quan phi. Sức mạnh hơi kém Thiên Đức một bậc nhưng vẫn là đại cát.',
    advice: 'Điềm tĩnh đối nhân xử thế, tránh tranh tụng; phúc đức tích luỹ được bồi thêm.',
  },
  sanQi: {
    zh: '三奇贵人', vi: 'Tam Kỳ Quý Nhân',
    meaning: 'Tài năng kỳ xuất, bác học đa năng,胸怀 xuất chúng (trí tuệ vượt trội). CẦN thêm quý nhân khác (Thiên Ất / Thiên Đức…) phù trợ mới phát huy toàn vẹn — một mình Tam Kỳ dễ cô.',
    advice: 'Kiên nhẫn tìm người đề bạt (mentor / quý nhân); đừng tự cao tài mà lẻ bạn. Kết hợp sao quý nhân khác sẽ rất phát.',
  },
  kuiGang: {
    zh: '魁罡', vi: 'Khôi Cương (Quù Cương)',
    meaning: 'Chủ quyền uy nghiêm, tính cách cương cường, thông minh quyết đoán, dũng cảm gánh vác. Mặt khác dễ khắc cha mẹ / bạn đời; nữ mạng kỵ hình xung, bất lợi hôn nhân.',
    advice: 'Học cách mềm mỏng trong quan hệ vợ chồng / gia đình; giảm tính độc đoán. Nữ mạng cần cẩn trọng nhân duyên, không nên cưới sớm nếu có xung.',
  },
  taiji: {
    zh: '太极贵人', vi: 'Thái Cực Quý Nhân',
    meaning: 'Chủ thông minh hiếu học, thiên hướng triết học / tôn giáo / huyền học (mật tông, Đạo giáo, Kinh Dịch, tâm linh). Có duyên gần gũi với tôn giáo, tư duy siêu hình.',
    advice: 'Phát huy trực giác, hàm dưỡng tri thức nhân văn / triết học; có thể nghiên cứu thêm huyền học, thiền định, tôn giáo để khai mở tư duy.',
  },
  guoYin: {
    zh: '国印贵人', vi: 'Quốc Ấn Quý Nhân',
    meaning: 'Chủ người thành thật đáng tin cậy, được hưởng lợi từ nhà cửa / đất đai / quyền lực. Dễ có biến động về bất động sản hoặc chức quyền.',
    advice: 'Đầu tư nhà đất / bất động sản thường có lợi; giữ chữ tín để được giao quyền. Khi gặp lưu niên kích hoạt, dễ mua bán nhà hoặc đổi quyền.',
  },
};

// ---------------------------------------------------------------------------
// Helper: tên cột trụ tiếng Việt
// ---------------------------------------------------------------------------
const PILLAR_VI = { year: 'Niên', month: 'Nguyệt', day: 'Nhật', time: 'Thời' };

/**
 * Phát hiện Thái Cực & Quốc Ấn trong tứ trụ (theo Nhật Can).
 * @param {object} chart - R.chart
 * @returns {{ taiji?: object, guoYin?: object }}
 */
export function computeTaijiGuoYin(chart) {
  const dg = chart.dayGan;
  const out = {};
  const keys = ['year', 'month', 'day', 'time'];

  // Thái Cực — chi trong tứ trụ thuộc danh sách chi tương ứng Nhật Can
  const tj = TAIJI[dg] || [];
  if (tj.length) {
    const hits = keys
      .filter((k) => tj.includes(chart.pillars[k].zhi))
      .map((k) => ({ pillar: k, vi: PILLAR_VI[k], zhi: chart.pillars[k].zhi }));
    if (hits.length) out.taiji = { at: hits };
  }

  // Quốc Ấn — chi trong tứ trụ == chi tương ứng Nhật Can
  const gy = GUO_YIN[dg];
  if (gy) {
    const hits = keys
      .filter((k) => chart.pillars[k].zhi === gy)
      .map((k) => ({ pillar: k, vi: PILLAR_VI[k], zhi: gy }));
    if (hits.length) out.guoYin = { at: hits };
  }
  return out;
}

/**
 * Tổng hợp 6 sao quý nhân / cao cấp thần sát cho một lá số.
 * Đọc lại R.shensha (đã có Thiên Đức / Nguyệt Đức / Tam Kỳ / Khôi Cương),
 * bổ sung Thái Cực + Quốc Ấn (tính mới), rồi gắn meaning + advice + đánh giá 贵气.
 *
 * @param {object} R - kết quả analyse() (R.chart, R.shensha)
 * @returns {{
 *   stars: Array<{key,zh,vi,present:boolean,positions:Array,meaning,advice,tone}>,
 *   count: number,
 *   assessment: {level:string, score:number, text:string},
 *   summary: string
 * }}
 */
export function analyzeNobleStars(R) {
  const chart = R.chart;
  const ss = R.shensha || {};

  // 2 sao tính mới
  const extra = computeTaijiGuoYin(chart);

  // Bảng phát hiện: key → { present, positions }  (vị trí dạng chuỗi mô tả)
  const detect = {
    // 4 sao đọc lại từ R.shensha (KHÔNG tính lại)
    tianDe:  ss.tianDe  ? { present: true,  raw: ss.tianDe.at }  : { present: false, raw: [] },
    yueDe:   ss.yueDe   ? { present: true,  raw: ss.yueDe.at }   : { present: false, raw: [] },
    sanQi:   ss.sanQi   ? { present: true,  raw: ss.sanQi.at }   : { present: false, raw: [] },
    kuiGang: ss.kuiGang ? { present: true,  raw: ss.kuiGang.at } : { present: false, raw: [] },
    // 2 sao tính mới
    taiji:   extra.taiji   ? { present: true, raw: extra.taiji.at }   : { present: false, raw: [] },
    guoYin:  extra.guoYin  ? { present: true, raw: extra.guoYin.at }  : { present: false, raw: [] },
  };

  const ORDER = ['tianDe', 'yueDe', 'sanQi', 'taiji', 'guoYin', 'kuiGang'];
  const stars = ORDER.map((key) => {
    const info = NOBLE_INFO[key];
    const d = detect[key];
    // positions: chuỗi mô tả vị trí (can/chi gặp, hoặc trụ)
    let positions = [];
    if (d.present) {
      if (key === 'sanQi') {
        // Tam Kỳ: danh sách 3 can
        positions = Array.isArray(d.raw) ? d.raw.map((x) => String(x)) : [String(d.raw)];
      } else if (key === 'kuiGang') {
        // Khôi Cương: ngày can-chi (vd 庚辰)
        positions = Array.isArray(d.raw) ? d.raw.map((x) => String(x)) : [String(d.raw)];
      } else if (key === 'taiji' || key === 'guoYin') {
        // tính mới → d.raw là mảng { pillar, vi, zhi }
        positions = d.raw.map((p) => `${p.zhi} @ ${p.vi} trụ`);
      } else {
        // Thiên Đức / Nguyệt Đức: mảng can/chi gặp
        positions = Array.isArray(d.raw) ? d.raw.map((x) => String(x)) : [String(d.raw)];
      }
    }
    return {
      key,
      zh: info.zh,
      vi: info.vi,
      present: d.present,
      positions,
      meaning: info.meaning,
      advice: info.advice,
      tone: key === 'kuiGang' ? 'volatile' : 'cat',
    };
  });

  const presentStars = stars.filter((s) => s.present);
  const count = presentStars.length;

  // ---------------------------------------------------------------------------
  // Đánh giá tổng thể 贵气 (độ quý khí của lá số dựa trên nhóm này)
  // Trọng số: sao đại cát (Thiên Đức/Nguyệt Đức/Tam Kỳ/Thái Cực) nặng hơn;
  // Khôi Cương là roi kiếm hai lưỡi (cát-hung) nên không cộng quý khí mà đánh riêng.
  // ---------------------------------------------------------------------------
  const WEIGHT = { tianDe: 3, yueDe: 2.5, sanQi: 2.5, taiji: 2, guoYin: 1.5, kuiGang: 0 };
  let score = 0;
  const presentKeys = presentStars.map((s) => s.key);
  for (const k of presentKeys) score += WEIGHT[k];
  // Tam Kỳ phải đi kèm Thiên Đức/Nguyệt Đức/Thiên Ất mới phát → nếu Tam Kỳ đứng alone, trừ điểm
  if (presentKeys.includes('sanQi') && !presentKeys.some((k) => k === 'tianDe' || k === 'yueDe')) {
    score -= 1; // Tam Kỳ cô, dễ không phát huy
  }

  let level, text;
  if (score >= 6) {
    level = '贵气显赫'; // quý khí hiển hách
    text = 'Lá số mang nhiều sao quý nhân cát tường — thiên thời đề bạt, gặp dữ hoá lành, đường đời có phúc nhân phù trợ đáng kể. Tận dụng bằng cách khiêm nhường + tích đức.';
  } else if (score >= 3.5) {
    level = '贵气中上'; // quý khí trung thượng
    text = 'Có quý nhân phù trợ vừa phải, duyên gặp người giúp đỡ tốt. Phát huy tính nhân hậu, học hỏi thêm sẽ củng cố quý khí.';
  } else if (score >= 1.5) {
    level = '贵气平平'; // quý khí bình
    text = 'Quý khí khiêm tốn — quý nhân ít, cần tự lực là chính. Nên chủ động kết duyên lành, giúp người để tự tạo quý nhân.';
  } else {
    level = '贵气微薄'; // quý khí vi bạc
    text = 'Ít sao quý nhân trong nhóm cao cấp — không phải xấu, chỉ là đường đời tự lập nhiều hơn. Nếu có Khôi Cương thì quyền uy nhưng cần cẩn trọng nhân duyên / gia đình.';
  }
  const assessment = { level, score: +score.toFixed(2), text };

  // Tóm tắt 1 câu (dùng cho hint / NLG)
  const names = presentStars.map((s) => s.vi).join(', ');
  const summary = count === 0
    ? 'Không có sao quý nhân nhóm cao cấp (Thiên Đức/Nguyệt Đức/Tam Kỳ/Thái Cực/Quốc Ấn/Khôi Cương) nổi bật trong lá số.'
    : `Có ${count} sao quý nhân / cao cấp: ${names}. ${assessment.level} (${assessment.score} điểm). ${assessment.text}`;

  return { stars, count, assessment, summary };
}

export { NOBLE_INFO };
