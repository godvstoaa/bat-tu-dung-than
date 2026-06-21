// ============================================================================
//  PHÂN TẦNG HỌC THUẬT (9 TẦNG) — luận mỗi lĩnh vực qua 9 lớp phân tích
//  Mỗi tầng = một góc nhìn cổ pháp; đi từ bản khí → kết luận cấp độ.
//  Mục đích: thay cho đoạn text 1 chiều, cho phân tích đa tầng hàn lâm.
// ============================================================================
import { WX_VI, GAN, ZHI, TEN_GOD_VI } from './constants.js';
import { TEN_GOD_DEEP, dominantGods, DITIANSUI } from './kb.js';
import { analyzeLiuqin } from './liuqin.js';
import { buildRemedy } from './remedy.js';

const wxVi = (w) => WX_VI[w];
const hanviet = (gz) => gz.split('').map((c) => (GAN[c]?.vi || ZHI[c]?.vi || c)).join(' ');

// Cấu hình từng lĩnh vực: sao chủ, cung, hành chủ
const TOPIC_CFG = {
  career: { title: 'Sự nghiệp & công danh', stars: ['正官', '七殺', '正印', '偏印'], palace: 'month', relWx: 'officer' },
  wealth: { title: 'Tài lộc & tiền bạc', stars: ['正財', '偏財', '食神', '傷官'], palace: 'day', relWx: 'wealth' },
  love: { title: 'Tình duyên & hôn nhân', stars: ['正財', '偏財', '正官', '七殺'], palace: 'day', relWx: 'spouse' },
  health: { title: 'Sức khỏe & dưỡng sinh', stars: [], palace: 'day', relWx: 'balance' },
  study: { title: 'Học vấn & trí tuệ', stars: ['正印', '偏印', '食神', '傷官'], palace: 'month', relWx: 'resource' },
  children: { title: 'Con cái', stars: [], palace: 'time', relWx: 'child' },
  general: { title: 'Tổng quan mệnh', stars: [], palace: 'month', relWx: 'all' },
};

function relWxOf(dmWx, kind) {
  const map = {
    officer: { 木: '金', 火: '水', 土: '木', 金: '火', 水: '土' },
    wealth: { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' },
    resource: { 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' },
  };
  return map[kind] ? map[kind][dmWx] : null;
}

function countStars(chart, stars) {
  const c = {};
  for (const key of ['year', 'month', 'time']) {
    const g = chart.pillars[key].ganGod; if (g && g !== '日主') c[g] = (c[g] || 0) + 1;
  }
  for (const key of ['year', 'month', 'day', 'time']) {
    const m = chart.pillars[key].hidden[0]; c[m.god] = (c[m.god] || 0) + 0.5;
  }
  return stars.reduce((s, g) => s + (c[g] || 0), 0);
}

/**
 * Phân tích 9 tầng cho một lĩnh vực.
 * @returns {{ topic, tiers: [{n,name,text}] }}
 */
export function tieredAnalysis(R, topicId) {
  const cfg = TOPIC_CFG[topicId] || TOPIC_CFG.general;
  const { chart, wx, yong, pattern, interactions, shensha, synthesis } = R;
  const dm = chart.dayMaster;
  const dmWx = dm.wx;
  const starsCount = countStars(chart, cfg.stars);
  const top = dominantGods(chart, 3);
  const total = wx.total || 1;
  const topicWx = relWxOf(dmWx, cfg.relWx);
  const topicWxScore = topicWx ? (wx.score[topicWx] / total) * 100 : 0;
  const topicIsYong = topicWx && (topicWx === yong.primary || topicWx === yong.xi);
  const topicIsJi = topicWx && (topicWx === yong.ji || topicWx === yong.chou);
  const dt = DITIANSUI[dm.gan];

  // Cung vị + xung
  const palKey = cfg.palace;
  const palZhi = chart.pillars[palKey].zhi;
  const palGod = TEN_GOD_VI[chart.pillars[palKey].ganGod] || chart.pillars[palKey].ganGod;
  const palUnstable = interactions.chong.some((c) => c.a === palZhi || c.b === palZhi)
    || interactions.xing.some((c) => c.a === palZhi || c.b === palZhi);

  const tiers = [];

  // T1 Ngũ hành bản khí
  let t1 = `Nhật Chủ ${dm.gan} ${dm.vi} thuộc ${wxVi(dmWx)}; trong cục ${wxVi(dmWx)} chiếm ${((wx.score[dmWx] / total) * 100).toFixed(0)}%.`;
  if (topicWx) t1 += ` Hành chủ sự «${cfg.title}» là ${wxVi(topicWx)} (${topicWxScore.toFixed(0)}% trong cục).`;
  tiers.push({ n: 1, name: 'Ngũ Hành bản khí', text: t1 });

  // T2 Thập thần
  const starDetail = cfg.stars.map((s) => `${TEN_GOD_VI[s]}(${(countStars(chart, [s])).toFixed(1).replace('.0','')})`).join(', ');
  tiers.push({
    n: 2, name: 'Thập Thần',
    text: `Sao chủ lĩnh vực: ${starDetail}. ${starsCount >= 2.5 ? 'Có khí rõ → thế mạnh.' : starsCount > 0 ? 'Có nhưng hơi mỏng.' : 'Khuyết/ẩn → phải tự bồi.'} ${top[0] ? `Thập thần nổi nhất cục là ${top[0].vi} — ${TEN_GOD_DEEP[top[0].god]?.nature}` : ''}`,
  });

  // T3 Cách cục
  tiers.push({
    n: 3, name: 'Cách Cục',
    text: `Cách ${pattern.vi} (${pattern.shunNi}). ${synthesis?.combos?.length ? 'Tổ hợp: ' + synthesis.combos.map((c) => c.vi).join(', ') + '.' : ''} ${PATTERN_HINT(pattern)}`,
  });

  // T4 用喜忌仇
  let t4 = `Dụng ${wxVi(yong.primary)}, Hỷ ${wxVi(yong.xi)}, Kỵ ${wxVi(yong.ji)}, Thù ${wxVi(yong.chou)}.`;
  if (topicWx) t4 += topicIsYong ? ` Hành chủ lĩnh vực (${wxVi(topicWx)}) = DỤNG/HỶ → CÁT, đây là điểm sáng.` : topicIsJi ? ` Hành chủ (${wxVi(topicWx)}) = KỴ/THÙ → bất lợi, cần hoá giải bằng Dụng.` : ` Hành chủ trung tính.`;
  tiers.push({ n: 4, name: 'Dụng – Hỷ – Kỵ – Thù', text: t4 });

  // T5 Hội hợp xung hình (tác động cung)
  tiers.push({
    n: 5, name: 'Hội – Hợp – Xung – Hình',
    text: `Cung «${cfg.title}» (${['year','month','day','time'].find(k=>k===palKey) ? ({year:'Trụ Năm',month:'Trụ Tháng',day:'Trụ Ngày',time:'Trụ Giờ'}[palKey]) : ''}, ${ZHI[palZhi].vi}, tàng ${palGod}) ${palUnstable ? 'BỊ XUNG/HÌNH → biến động, cần phòng' : 'yên ổn'}. Toàn cục: ${interactions.summary}.`,
  });

  // T6 Vận hạn (thời điểm)
  const catLn = (R.liunian || []).filter((l) => l.score >= 1).slice(0, 3);
  const badLn = (R.liunian || []).filter((l) => l.score <= -1).slice(0, 2);
  tiers.push({
    n: 6, name: 'Đại Vận / Lưu Niên (thời điểm)',
    text: `Đại vận hiện hành ${R.liunian?.[0]?.dayunGanZhi ? hanviet(R.liunian[0].dayunGanZhi) : '?'}. Lưu niên CÁT tới: ${catLn.length ? catLn.map((l) => `${l.year}(${hanviet(l.ganZhi)})`).join(', ') : '(không trong khung)'};${badLn.length ? ' cần tránh/' + badLn.map((l) => l.year).join(',') : ''}. Tiến thủ vào năm mang Dụng ${wxVi(yong.primary)}/Hỷ ${wxVi(yong.xi)}.`,
  });

  // T7 Thần sát
  const relevantStars = {
    career: ['jiangXing', 'tianYi'], wealth: ['tianYi', 'jinYu'], love: ['taoHua', 'hongYan'],
    health: ['tianDe', 'yueDe'], study: ['wenChang', 'xueTang', 'sanQi'], children: [], general: ['tianYi', 'jiangXing'],
  };
  const rs = (relevantStars[topicId] || []).filter((k) => shensha && shensha[k]);
  tiers.push({ n: 7, name: 'Thần Sát liên quan', text: rs.length ? `Có: ${rs.join(', ')} → tăng trợ.` : 'Không có thần sa nổi trực tiếp cho lĩnh vực này.' });

  // T8 Cổ điển (滴天髓 / 穷通宝鉴)
  tiers.push({ n: 8, name: 'Cổ điển (滴天髓 · 窮通寶鑑)', text: `「${dt.verse}」 — ${dt.vi}. ${dt.need}. Điều Hậu: ${yong.tiaohou.note || '(không)'}` });

  // T9 Kết luận cấp độ + hành động
  const grade = topicIsYong ? 'CÁT' : topicIsJi ? 'CẦN HÓA GIẢI' : 'TRUNG BÌNH';
  tiers.push({
    n: 9, name: 'Kết luận & cấp độ',
    text: `Cấp độ lĩnh vực: <b>${grade}</b>. ${starsCount >= 2.5 ? 'Thế mạnh — nên phát huy.' : 'Thế mỏng — cần bồi.'} ${palUnstable ? 'Cung bất ổn → kiên nhẫn.' : ''} Hành động: bồi Dụng ${wxVi(yong.primary)} (màu/phương/nghề), đón lưu niên cát, tích đức.`,
  });

  return { topic: cfg.title, tiers };
}

function PATTERN_HINT(pattern) {
  const m = {
    正官格: 'Chính Quan thuận dụng — cần Tài sinh quan, Ấn hộ quan; kỵ Thương Quan phá.',
    七殺格: 'Thất Sát nghịch dụng — cần Thực chế hoặc Ấn hoá; kỵ Tài đảng sát.',
    正財格: 'Chính Tài thuận dụng — cần Thực thương sinh, Quan hộ; kỵ Tỷ kiếp đoạt.',
    偏財格: 'Thiên Tài thuận dụng — cần Quan hộ vệ; kỵ Tỷ kiếp.',
    正印格: 'Chính Ấn thuận dụng — cần Quan sát sinh ấn; kỵ Tài phá ấn.',
    偏印格: 'Kiêu thần nghịch dụng — cần Tài chế kiêu; kỵ kiêu đoạt thực.',
    食神格: 'Thực Thần thuận dụng — cần Tài đi kèm, Quan hộ; kỵ kiêu đoạt thực.',
    傷官格: 'Thương Quan nghịch dụng — cần Ấn chế (phối ấn) hoặc Tài hoá; kỵ kiến quan.',
  };
  return m[pattern.name] || 'Theo nguyên tắc thuận/nghịch dụng của cách.';
}

// Trả lục thân + cải mệnh để UI/AI dùng chung
export { analyzeLiuqin, buildRemedy };
