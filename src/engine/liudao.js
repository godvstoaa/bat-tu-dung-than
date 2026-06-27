// ============================================================================
//  LỤC ĐẠO 輪迴 — SIX REALMS OF SAṂSĀRA (ṢAḌ-GATI) — Phật giáo
//  [loop 546] FEATURE USER: «kết hợp cả lục đạo hồi trong phật giáo, crawl tài
//    liệu tiếng Phạn cho chính xác».
//
//  NGUỒN CHÍNH XÁC (đã research, KHÔNG phán bừa):
//   - Skt: ṣaḍ-gati (sáu nẻo). Mỗi đạo = một -gati.
//   - 三善道 (3 thiện): 天道 devagati, 人道 manuṣyagati, 阿修罗道 asuragati.
//   - 三恶道 (3 ác): 畜生道 tiryagyonigati, 饿鬼道 pretagati, 地狱道 narakagati.
//   - Nghiệp nhân: 十善→天, 五戒→人, 布施+嗔→阿修罗, 愚痴→畜生, 悭贪→饿鬼,
//     五逆十恶+嗔恚→地狱. (Nguồn: Wikipedia Six Paths, Rigpa Wiki ṣaḍgati,
//     zh.wikipedia 六道, 法鼓文化, bách khoa Phật giáo.)
//
//  ⚠ TÍNH ĐỒNG BỘ BaZi→Lục đạo là DÂN GIAN融通 (folk syncretism Đông Á),
//    KHÔNG phải giáo lý Phật chính thống. Phật giáo dạy: nẻo tái sinh do NGHIỆP
//    (thân-khẩu-ý), không do lá số. Module này chỉ suy ra KHUYNH HƯỚNG tam độc
//    (贪嗔痴) từ tính cách bẩm sinh (thập thần/ngũ hành), rồi「ánh xạ」sang
//    Lục đạo như một góc nhìn tu học. Đã ghi rõ disclaimer.
// ============================================================================

// 6 đạo — dữ liệu chính xác (Sanskrit + nghiệp nhân + diễn giải VN + pháp đối trị)
export const SIX_REALMS = {
  '天道': {
    order: 1, tier: 'thiện', skt: 'devagati', sktRoot: 'deva', pali: 'devagati',
    karmaCause: '上品十善 + 修禅定 (thập thiện bậc thượng + tu thiền định)',
    vi: 'Thiên Đạo (cõi Trời)', nature: 'phúc báu, hưởng lạc, nhưng vẫn trong luân hồi (天人五衰)',
    desc: 'Cõi thiên nhân — phước báu lớn, phi hành thần thông, hưởng niềm vui trời người. Nhưng trời phúc hết vẫn堕落 (thiên nhân ngũ suy).',
    poison: 'mạn (ngã mạn — kiêu căng)', buddha: 'Thiên Lôi Âm Phật (阿弥陀)', remedy: 'tu khiêm nhường, xả mạn' },
  '人道': {
    order: 2, tier: 'thiện', skt: 'manuṣyagati', sktRoot: 'manuṣya', pali: 'manussagati',
    karmaCause: '持五戒 + 中品十善 (giữ ngũ giới + thập thiện bậc trung)',
    vi: 'Nhân Đạo (cõi Người)', nature: 'vừa đủ khổ-vui để tu hành — cõi tốt nhất để giải thoát',
    desc: 'Cõi người — có khổ có vui, vừa đủ tỉnh giác để tu tập. Phật dạy「人身难得」(được thân người khó), đây là cõi tốt nhất để hành đạo.',
    poison: '(không độc riêng — trung tính, dễ tu)', buddha: 'Thích Ca Mâu Ni Phật', remedy: 'trì ngũ giới, tu thập thiện' },
  '阿修罗道': {
    order: 3, tier: 'thiện', skt: 'asuragati', sktRoot: 'asura', pali: 'asuragati',
    karmaCause: '布施 + 常怀嗔恚 (bố thí nhưng thường ôm sân hận/đố kỵ)',
    vi: 'A Tu La Đạo', nature: 'có phúc trời nhưng không đức trời, hay tranh đấu đố kỵ',
    desc: 'Cõi a-tu-la — có lực mạnh, có phúc (do bố thí) nhưng sân hận nặng, thường chiến đấu với trời. «Có phước trời, không đức trời».',
    poison: 'đố kỵ/sân (sự ghen tị)', buddha: 'Đại Từ Bi Bồ Tát', remedy: 'tu hỷ xả, buông đố kỵ' },
  '畜生道': {
    order: 4, tier: 'ác', skt: 'tiryagyonigati', sktRoot: 'tiryagyoni', pali: 'tiracchānayoni',
    karmaCause: '愚痴 + 下品十恶 (vô minh ngu si + thập ác bậc hạ)',
    vi: 'Súc Sanh Đạo', nature: 'vô minh, bản năng, bị làm thịt/ăn thịt lẫn nhau',
    desc: 'Cõi súc sanh — sống theo bản năng, ngu muội, sợ hãi, bị cường thực nhược (mạnh ăn yếu). Do ngu si không tin nhân quả.',
    poison: 'si (vô minh ngu si)', buddha: 'Đại Lực Vương Phật', remedy: 'khai trí, học pháp, tin nhân quả' },
  '饿鬼道': {
    order: 5, tier: 'ác', skt: 'pretagati', sktRoot: 'preta', pali: 'petagati',
    karmaCause: '悭贪吝啬 + 不肯布施 (keo kiệt bủn xỉn, không chịu bố thí)',
    vi: 'Ngạ Quỷ Đạo (quỷ đói)', nature: 'luôn đói khát, không được thỏa mãn',
    desc: 'Cõi ngạ quỷ — miệng nhỏ cổ hẹp, bụng to, luôn đói khát mà không ăn uống được. Do tham lam keo kiệt khi sống.',
    poison: 'tham (tham lam keo kiệt)', buddha: 'Diện Nhiên Phật / Quan Âm', remedy: 'tu bố thí, buông tham' },
  '地狱道': {
    order: 6, tier: 'ác', skt: 'narakagati', sktRoot: 'naraka', pali: 'nirayagati',
    karmaCause: '五逆十恶 + 重嗔恚 (ngũ nghịch thập ác + sân hận nặng)',
    vi: 'Địa Ngục Đạo', nature: 'cực khổ, nóng/lạnh, chịu quả báo ác nghiệp',
    desc: 'Cõi địa ngục — khổ cực (nóng lạnh, các hình phạt), chịu quả báo của ác nghiệp nặng (sát sanh, ngũ nghịch). Do sân hận tột độ.',
    poison: 'sân (sân hận, giận dữ)', buddha: 'Địa Tạng Vương Bồ Tát', remedy: 'tu từ bi, nhẫn nhục, buông sân' },
};

// Tam độc + thiện/định score từ lá số BaZi (đồng bộ dân gian)
// Trả về { tham, san, si, thien(善), dinh(禅定/印) } dạng 0-100.
function computePoisons(R) {
  const chart = R?.chart;
  const pillars = chart?.pillars || {};
  const gods = [];
  let fireWx = 0, earthWx = 0, totalWx = 0;
  const wxCount = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  for (const k of ['year', 'month', 'day', 'time']) {
    const p = pillars[k];
    if (!p) continue;
    if (p.ganGod) gods.push(p.ganGod);
    if (p.hidden) for (const h of p.hidden) if (h?.god) gods.push(h.god);
  }
  // ngũ hành count (ước lượng qua ganGod + can chi nếu có)
  const ganWx = R?.chart?.dayMaster?.wx;
  void ganWx;
  // đếm thập thần
  const godCount = {};
  for (const g of gods) godCount[g] = (godCount[g] || 0) + 1;

  // THAM (贪) — tài tinh mạnh (正财/偏财), đặc biệt tài nhiều thân nhược
  let tham = (godCount['正財'] || 0) * 2 + (godCount['偏財'] || 0) * 2;
  const strength = R?.strength;
  if (strength && strength.strong === false && ((godCount['正財'] || 0) + (godCount['偏財'] || 0)) >= 2) tham += 4; // tài đa thân nhược → tham nặng

  // SAN (嗔) — thất sát + thương quan + dương nhận + hoả vượng + hình
  let san = (godCount['七殺'] || 0) * 3 + (godCount['傷官'] || 0) * 2 + (godCount['偏官'] || 0) * 3;
  // hoả vượng (lấy từ interactions/strength nếu có)
  if (R?.interactions?.elements) {
    fireWx = R.interactions.elements['火'] || 0;
    earthWx = R.interactions.elements['土'] || 0;
    if (fireWx >= 3) san += 3;
  }
  // dương nhận / hình → sân
  const ss = R?.shensha;
  if (ss) {
    const ssList = Array.isArray(ss) ? ss : (ss.list || ss.stars || []);
    const ssStr = JSON.stringify(ssList);
    if (/羊刃|亡神|灾煞|劫煞|血刃/.test(ssStr)) san += 3;
  }
  if (R?.interactions?.xing && R.interactions.xing.length) san += R.interactions.xing.length * 2;

  // SI (痴) — thổ trọc + vô ấn + thực thương yếu → ngu muội
  let si = 0;
  if (earthWx >= 3) si += 3; // thổ trọc
  if ((godCount['正印'] || 0) + (godCount['偏印'] || 0) === 0) si += 3; // vô ấn → thiếu tuệ
  if ((godCount['食神'] || 0) + (godCount['傷官'] || 0) === 0) si += 2; // vô thực thương → thiếu minh đạt

  // THIỆN (善) — chính quan + chính ấn (giới + tuệ), cân bằng
  let thien = (godCount['正官'] || 0) * 3 + (godCount['正印'] || 0) * 2 + (godCount['正財'] || 0) * 1;
  if (strength && strength.strong !== undefined) {
    // trung hòa (không quá vượng/nhược) → thiện
    const sc = strength.score ?? strength.value ?? 0;
    if (sc >= 35 && sc <= 65) thien += 3;
  }

  // ĐỊNH (禅定 / ấn tinh hộ thân)
  let dinh = (godCount['正印'] || 0) * 3 + (godCount['偏印'] || 0) * 2;

  // BỐ (布施 / thực thần sinh tài — cho đi)
  let bo = (godCount['食神'] || 0) * 3 + (godCount['傷官'] || 0) * 1;

  // chuẩn hoá 0-100 (giả định max ~15 mỗi loại)
  const clamp = (n) => Math.max(0, Math.min(100, Math.round(n * 100 / 15)));
  return {
    tham: clamp(tham), san: clamp(san), si: clamp(si),
    thien: clamp(thien), dinh: clamp(dinh), bo: clamp(bo),
    godCount,
  };
}

// Tam độc → điểm cho từng đạo (đồng bộ dân gian, dựa nghiệp nhân Phật giáo)
export function computeLiuDao(R) {
  const out = { ok: false, disclaimer: 'Đồng bộ dân gian — chỉ suy ra KHUYNH HƯỚNG tu học từ tính cách lá số, KHÔ đoán nẻo tái sinh (Phật giáo: nẻo do nghiệp thân-khẩu-ý).' };
  try {
    const p = computePoisons(R);
    const scores = {
      '天道': Math.round(p.thien * 0.5 + p.dinh * 0.5),           // 上品十善 + 禅定
      '人道': Math.round(p.thien * 0.4 + p.bo * 0.2 + (100 - Math.abs(p.tham + p.san + p.si - 50)) * 0.4), // 五戒 + trung hòa
      '阿修罗道': Math.round(p.bo * 0.5 + p.san * 0.5),           // 布施 + 嗔
      '畜生道': Math.round(p.si * 0.8),                           // 愚痴
      '饿鬼道': Math.round(p.tham * 0.9),                         // 悭贪
      '地狱道': Math.round(p.san * 0.7 + p.si * 0.2 + p.tham * 0.1), // 五逆十恶+嗔
    };
    // clamp
    for (const k of Object.keys(scores)) scores[k] = Math.max(0, Math.min(100, scores[k]));

    // primary = điểm cao nhất
    let primary = '人道';
    let max = -1;
    for (const k of Object.keys(scores)) if (scores[k] > max) { max = scores[k]; primary = k; }
    const realm = SIX_REALMS[primary];

    // narrative — dựa trên POISON của chính đạo (đồng bộ nghiệp nhân Phật giáo)
    const POISON_VI = { tham: 'THAM (贪 lắm)', san: 'SÂN (嗔 giận)', si: 'SI (痴 muội)' };
    // poison điều hành mỗi đạo (theo nghiệp nhân đã research)
    const REALM_POISON = { '天道': null, '人道': null, '阿修罗道': 'san', '畜生道': 'si', '饿鬼道': 'tham', '地狱道': 'san' };
    let narrative = '';
    if (realm.tier === 'thiện') {
      narrative = `Lá số cho thấy khuynh hướng ${realm.vi} — ${realm.nature}. `;
      if (primary === '天道') narrative += `Thập thần thiên chính tinh (quan-ấn-tài) + ấn tinh (thiền định) → tương ứng cõi phúc báu (nghiệp nhân: thập thiện + thiền định). `;
      else if (primary === '人道') narrative += `Tính cách trung hoà, có giới có tuệ → cõi Người (nghiệp nhân: ngũ giới) — tốt nhất để tu hành. `;
      else narrative += `Có phúc (bố thí/cho đi) nhưng còn dư sân → cõi A-tu-la «có phúc trời, không đức trời». `;
    } else {
      const rp = REALM_POISON[primary];
      narrative = `Khuynh hướng ${realm.vi} — ${realm.nature}. `;
      if (rp) narrative += `Do độc ${POISON_VI[rp]} nổi bật trong lá số (điểm ${p[rp]}/100) → tương ứng nghiệp nhân「${realm.karmaCause}」. `;
      narrative += `Đây là KHUYNH HƯỚNG tính cách (KHÔNG tiên đoán nẻo tái sinh — Phật giáo dạy nẻo do nghiệp thân-khẩu-ý), CÓ THỂ chuyển hoá bằng: ${realm.remedy}. `;
    }
    narrative += `Hướng về ${realm.buddha} để đối trị.`;

    // top poison (cho hiển thị) — tam độc cao nhất
    const poisonTop = [['tham', 'THAM', p.tham], ['san', 'SÂN', p.san], ['si', 'SI', p.si]].sort((a, b) => b[2] - a[2])[0];

    Object.assign(out, {
      ok: true,
      poisons: { tham: p.tham, san: p.san, si: p.si, thien: p.thien, dinh: p.dinh, bo: p.bo },
      scores, primary,
      realm: { name: primary, ...realm },
      poisonTop: { key: poisonTop[0], vi: poisonTop[1] + ' (' + ({ tham: '贪', san: '嗔', si: '痴' }[poisonTop[0]]) + ')', score: poisonTop[2] },
      narrative,
    });
  } catch (e) {
    out.ok = false;
    out.error = e && e.message ? e.message : String(e);
  }
  return out;
}
