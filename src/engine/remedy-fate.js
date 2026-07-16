// ============================================================================
//  remedy-fate.js — NGHỊCH THIÊN CẢI MỆNH (逆天改命) module
//  Kinh điển: Hàn Diêu Phú (寒窑赋), Liễu Phàm Tứ Huấn (了凡四训), Công Qua Cách
//  (功过格), Thái Thượng Cảm Ứng (太上感应篇), Văn Xương Âm Chú (阴骘文), Tâm Mệnh Thi.
//
//  Nguyên lý cốt lõi: lá số = TIÊN THIÊN (innate, "quỹ đạo hiện tại"); CẢI MỆNH =
//  HẬU THIÊN (acquired) qua tích đức — «mệnh do ta tạo, phúc do ta cầu» (Liễu Phàm).
//  Giáo lý PHÙ HỢP anti-fatalism stance của app: KHÔNG tuyệt vọng, CÓ THỂ cải thiện.
//  Tham khảo — không đảm bảo kết quả; mỗi người tự nghiệm.
// ============================================================================

// --- Điển cố Liễu Phàm (cốt lõi «nghịch thiên») ---
export const LIAOFAN_STORY = {
  title: 'Điển cố Liễu Phàm (袁了凡, Minh) — minh chứng «số phận KHÔNG cố định»',
  story: 'Khổng tiên sinh bói Liễu Phàm: đỗ tú tài hạng 14, làm quan một chức, KHÔNG con, chết năm 53 tuổi. Mọi lời ỨNG NGHIỆM đến tuổi 35 → ông tin «mệnh đã an», sống buông xuôi. Gặp Vân Cốc thiền sư → sư dạy «mệnh do tâm tạo, bói chỉ thấy quỹ đạo hiện tại, không phải kết cục». Liễu Phàm tích 3000 công → sinh con (Nguyên Khang); 6000 công → đỗ tiến sĩ; sống 74 tuổi (không 53).',
  lesson: 'Số phận KHÔNG cố định — tích đức (tâm thiện + hành thiện) = NGHỊCH THIÊN CẢI MỆNH.',
};

// --- 8 danh ngôn cải mệnh (chữ Hán + VN + nguồn) ---
export const REMEDY_QUOTES = [
  { han: '命由我作，福自己求', vi: 'Mệnh do ta tạo, phúc do ta cầu.', src: 'Liễu Phàm Tứ Huấn (袁了凡)' },
  { han: '積善之家，必有餘慶', vi: 'Nhà tích thiện, ắt còn dư phúc.', src: 'Kinh Dịch · Khôn Văn Ngôn' },
  { han: '作善降之百祥，作不善降之百殃', vi: 'Làm thiện → trời giáng trăm lành; làm ác → trăm họa.', src: 'Thượng Thư · Y Huấn' },
  { han: '天作孽，猶可違；自作孽，不可活', vi: 'Trời giáng họa còn tránh được; tự làm họa thì không sống nổi.', src: 'Thượng Thư · Thái Giáp' },
  { han: '滿招損，謙受益', vi: 'Kiêu đầy → tổn; khiêm nhường → nhận lợi.', src: 'Thượng Thư · Đại Vũ Mô (Khiêm Đức)' },
  { han: '但行好事，莫問前程', vi: 'Chỉ làm việc thiện, đừng hỏi tương lai.', src: 'Ngũ Đăng Hội Nguyên' },
  { han: '人為善，福雖未至，禍已遠離', vi: 'Làm thiện, phúc dù chưa đến, họa đã xa.', src: 'Tăng Quảng Hiền Văn' },
  { han: '禍福無門，惟人自召', vi: 'Họa phúc không cửa, người tự gọi.', src: 'Thái Thượng Cảm Ứng Thiên' },
];

// --- 10 thiện (积善之方 — Liễu Phàm) ---
export const TEN_THIEN = [
  { han: '與人為善', vi: 'Cùng người làm thiện', practice: 'Làm gương lành, khuyến khích người khác thiện' },
  { han: '愛敬存心', vi: 'Yêu kính giữ lòng', practice: 'Giữ tâm yêu thương + kính trọng mọi người' },
  { han: '成人之美', vi: 'Thành cái đẹp cho người', practice: 'Giúp người hoàn thành việc tốt (không đố kỵ)' },
  { han: '勸人為善', vi: 'Khuyên người làm thiện', practice: 'Dẫn dắt người khác hướng thiện' },
  { han: '救人危急', vi: 'Cứu người nguy cấp', practice: 'Giúp người lúc khó khăn nhất (tiền/sức/tâm)' },
  { han: '興建大利', vi: 'Kiến dựng lợi lớn', practice: 'Công việc lợi cộng đồng (xây cầu, đào giếng...)' },
  { han: '捨財作福', vi: 'Xả của làm phúc', practice: 'Bố thí của cải cho việc thiện (nghịch lý: xả tài → sinh phúc → giàu)' },
  { han: '護持正法', vi: 'Hộ trì chính pháp', practice: 'Bảo vệ/ủng hộ điều thiện chính' },
  { han: '敬重尊長', vi: 'Kính trọng bậc trên', practice: 'Kính cha mẹ, thầy, người lớn tuổi' },
  { han: '愛惜物命', vi: 'Yêu tiếc mạng vật', practice: 'Tránh sát sinh, trân trọng sự sống' },
];

// --- 10 phương pháp thực hành cụ thể ---
export const REMEDY_METHODS = [
  { name: 'Phóng sinh (放生)', how: 'Cứu mạng sinh vật (mua cá chim thả)', benefit: 'Nghiệp sát giảm → thọ + bình an' },
  { name: 'Ăn chay (吃素)', how: 'Giảm/bo sức sát sinh', benefit: 'Từ bi + tăng phúc đức' },
  { name: 'Niệm chú/kinh (念经)', how: 'Đọc Chuẩn Đề/Đại Bi/A Di Đà', benefit: 'Tâm tĩnh + thanh tịnh' },
  { name: 'Tọa thiền (静坐)', how: 'Thiền 15-30ph/ngày', benefit: 'Giảm nóng giận + sáng tâm' },
  { name: 'Hiếu đạo (孝顺)', how: 'Phụng dưỡng + vui lòng cha mẹ', benefit: 'Bồi Ấn (tài sản âm) → cải gốc mệnh' },
  { name: 'Bố thí (布施)', how: 'Cho của/công/vị không tính toán', benefit: 'Xả tài → cải tài vận' },
  { name: 'Giữ ngũ giới (五戒)', how: 'Không sát/trộm/tà/dối/rượu', benefit: 'Nghiệp lành → vận thuận' },
  { name: 'Sao chép kinh (抄经)', how: 'Chép tâm kinh/đại bi', benefit: 'Tâm tập trung + công đức' },
  { name: 'Thiện ẩn (阴骘)', how: 'Làm thiện KHÔNG cho ai biết', benefit: 'Âm chất → phúc lớn (Văn Xương)' },
  { name: 'Cúng dường (供养)', help: 'Dâng hoa/trà/đèn', benefit: 'Tôn kính + tích phúc' },
];

// --- Công Qua Cách (功过格) — sổ công–quá của Liễu Phàm ---
export const CONG_QUA = {
  thien: [ // công (+)
    { a: 'Phóng sinh (cứu mạng)', p: 3 }, { a: 'Cứu người nguy cấp', p: 3 },
    { a: 'Giúp người khó khăn', p: 2 }, { a: 'Bố thí tiền/của', p: 2 },
    { a: 'Hiếu thuận cha mẹ', p: 2 }, { a: 'Làm thiện ẩn (âm chất)', p: 2 },
    { a: 'Ăn chay 1 ngày', p: 1 }, { a: 'Giữ lời, không dối', p: 1 },
    { a: 'Khuyên người làm thiện', p: 1 }, { a: 'Đọc/sao kinh', p: 1 },
  ],
  ac: [ // quá (-)
    { a: 'Sát sinh (giết mạng)', p: 3 }, { a: 'Trộm cắp', p: 3 },
    { a: 'Dối trá/lừa gạt', p: 2 }, { a: 'Tà dâm', p: 2 }, { a: 'Không hiếu thuận', p: 2 },
    { a: 'Nói lời tổn thương', p: 1 }, { a: 'Uống rượu say', p: 1 },
    { a: 'Giận dữ mất kiểm soát', p: 1 }, { a: 'Đố kỵ/tham', p: 1 },
  ],
};

// --- Map vấn đề lá số → biện pháp cải mệnh ---
export const CHART_REMEDY = [
  { when: 'Nhật Chủ nhược (thân nhược)', remedy: 'Hiếu đạo (bồi Ấn = mẹ/sự nuôi dưỡng) + bồi bổ hành Dụng + tĩnh dưỡng.' },
  { when: 'Thất Sát / nghiệp sát nặng', remedy: 'Phóng sinh + ăn chay (giảm nghiệp sát) + nhẫn nhường.' },
  { when: 'Chính Tài mỏng', remedy: 'Bố thí (舍財作福) — nghịch lý: xả của → cải tài vận.' },
  { when: 'Ấn mỏng / Phụ mẫu khắc', remedy: 'Hiếu thuận cha mẹ (Ấn = mẹ) — bồi gốc mệnh.' },
  { when: 'Thương Quan vượng bừa bãi', remedy: 'Nhẫn lời + chỉ nói thiện + thiền (chế Thương Quan).' },
  { when: 'Hôn nhân / phối ngẫu cung khắc', remedy: 'Nhường nhịn + làm thiện ẩn (âm chất) + bao dung.' },
  { when: 'Cách cục vỡ (败格)', remedy: 'Khiêm đức (滿招損謙受益) + tích thiện dồn công.' },
  { when: 'Vượng suy thái quá (cực đoan)', remedy: 'Tĩnh tọa + bằng lòng + trung đạo (không thái quá).' },
];

// --- 3 cấp Cải Quá (改过) + Khiêm Đức ---
export const CAI_QUA = {
  levels: [
    { han: '改事', vi: 'Cải SỰ — sửa hành vi cụ thể (chậm nhất, bề mặt)', example: 'Bỏ 1 thói xấu cụ thể (uống rượu, nói dối)' },
    { han: '改理', vi: 'Cải LÝ — hiểu lý do sâu, đổi nhận thức', example: 'Hiểu VÌ SAO sai → tự nguyện đổi' },
    { han: '改心', vi: 'Cải TÂM — sửa từ tâm, gốc rễ (nhanh nhất, triệt để)', example: 'Tâm thiện → mọi hành vi tự thiện' },
  ],
  khiem_duc: 'Khiêm Đức (谦德) — khiêm nhường: «滿招損,謙受益» — kiêu đầy tổn, khiêm nhận lợi. Khiêm là đức thu hút phúc nhanh nhất (Liễu Phàm bài 4).',
};

// ============================================================================
//  COMPUTE
// ============================================================================

/**
 * Phân tích lá số → gợi ý các CHART_REMEDY relevant + đánh giá «độ cần cải mệnh».
 */
export function getRemedyForChart(R) {
  const out = { relevant: [], general: [], needLevel: 'trung' };
  try {
    const str = R.strength || {}, yong = R.yong || {}, pq = R.patternQuality || {};
    const gods = ['year','month','day','time'].map(p => R.chart?.pillars?.[p]?.ganGod).filter(Boolean);
    const isWeak = str.strong === false;
    const hasSha = gods.includes('七杀') || gods.includes('七殺');
    const hasShang = gods.includes('伤官') || gods.includes('傷官');
    const weakCai = (R.wx?.score?.[yong?.primary] || 0) < 15 && /Tài|cai/.test(JSON.stringify(yong||{}));
    const bai = pq.quality === '败格';
    for (const r of CHART_REMEDY) {
      if (isWeak && /Nhật Chủ nhược/.test(r.when)) out.relevant.push(r);
      if (hasSha && /Thất Sát/.test(r.when)) out.relevant.push(r);
      if (hasShang && /Thương Quan/.test(r.when)) out.relevant.push(r);
      if (bai && /Cách cục vỡ/.test(r.when)) out.relevant.push(r);
    }
    // luôn có 2-3 cái general
    out.general = [TEN_THIEN[6], TEN_THIEN[1], TEN_THIEN[9]]; // 舍财作福, 爱敬存心, 爱惜物命
    out.needLevel = out.relevant.length >= 2 ? 'cao' : out.relevant.length === 1 ? 'trung' : 'thấp';
  } catch (_) {}
  return out;
}

/**
 * Công Qua Cách — tính net công từ danh sách hành động đã ghi.
 * @param logged: [{type:'thien'|'ac', action:'phóng sinh', count:N}]
 */
export function meritLedger(logged) {
  const items = Array.isArray(logged) ? logged : [];
  let net = 0, thienN = 0, acN = 0;
  const detail = [];
  for (const e of items) {
    const table = e.type === 'ac' ? CONG_QUA.ac : CONG_QUA.thien;
    const match = table.find(x => x.a.toLowerCase().includes(String(e.action||'').toLowerCase()));
    const p = (match?.p || 1) * (Number(e.count) || 1);
    net += e.type === 'ac' ? -p : p;
    if (e.type === 'ac') acN += (Number(e.count) || 1); else thienN += (Number(e.count) || 1);
    detail.push({ ...e, point: (e.type === 'ac' ? -p : p) });
  }
  return { net, thienCount: thienN, acCount: acN, detail,
    verdict: net >= 10 ? '★ Tích đức tốt — đang «cải mệnh» theo quỹ đạo Liễu Phàm' : net > 0 ? 'Tích tiểu thiện — tiếp tục' : net < 0 ? '⚠ Quá nặng hơn công — cần cải quá (3 cấp)' : 'Cân bằng — hãy bắt đầu tích thiện' };
}

/**
 * Tóm tắt text cho AI brief / tool.
 */
export function remedySummary(R) {
  const rec = getRemedyForChart(R);
  const lines = ['NGHỊCH THIÊN CẢI MỆNH (theo Liễu Phàm Tứ Huấn):'];
  lines.push('Nguyên lý: lá số = TIÊN THIÊN (quỹ đạo hiện tại); MỆNH CÓ THỂ CẢI qua tích đức (后 天). «Mệnh do ta tạo, phúc do ta cầu».');
  if (rec.relevant.length) {
    lines.push('Biện pháp theo lá số:');
    for (const r of rec.relevant) lines.push('  • ' + r.when + ' → ' + r.remedy);
  }
  lines.push('Thiện chung: ' + rec.general.map(t => t.vi).join(', ') + '.');
  lines.push('Công Qua Cách: ghi công–quá hàng ngày (thiện +, ác -); net công dương = cải mệnh. Liễu Phàm tích 3000 công → sinh con, 6000 công → đỗ tiến sĩ.');
  return lines.join('\n');
}
