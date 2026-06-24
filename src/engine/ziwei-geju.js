// ============================================================================
//  紫微 格局 — CÁC CỤC HÌNH TỬ VI (杀破狼/机月同梁/府相朝垣/日月并明/紫府同宫...)
//  "Tôi thuộc TUÝP MỆNH nào (Tử Vi)?" — các cục hình cổ điển định loại mệnh.
//  * Cục hình = tổ hợp chính tinh ở Mệnh + TAM PHƯƠNG TỨ CHÍNH (= Mệnh/Tài/Quan/Duyên)
//    tạo thành "dáng mệnh" đặc thù — quyết định tuýp người + khuynh hướng sự nghiệp.
//  * 5 cục nổi bật (đã research):
//    - 杀破狼 (七杀·破军·贪狼 hội): KHỞI TẠO/ĐỘNG — dũng, tham vọng, đại khởi đại lạc, động trung đắc tài.
//    - 机月同梁 (天机·太阴·天同·天梁): ỔN ĐỊNH/VĂN CHỨC — mưu êm, "lão đại triết học", mưu sĩ/mộc.
//    - 府相朝垣 (天府·天相 triều): PHỤ TÁ — trung thành, chuyên gia/quản lý, phú túc ổn.
//    - 日月并明 (太阳·太阴 miếu vượng hội): QUÝ — khai朗, công danh, tài vận hanh.
//    - 紫府同宫 (紫微·天府 đồng cung Dần/Thân): ĐẠI QUÝ — tôn quý, lãnh đạo (cần cát tinh củng).
//  * Phát hiện cơ học; ý nghĩa research từ 紫微斗数全书/百度百科/知乎.
//  Nguồn: 紫微斗数全书 格局篇, 日月并明格 百度百科, 知乎 紫微格局概览.
// ============================================================================
import { sanfangSizheng } from './ziwei-sanfang.js';

// các cục hình: {key, tên, needs (hàm kiểm trên tập sao+hệ cung), vi, meaning, career, tone}
const GEJU = [
  {
    key: '杀破狼', name: '杀破狼格', test: (s) => s.has('七杀') && s.has('破军') && s.has('贪狼'),
    vi: 'Sát-Phá-Lang', tone: 'volatile',
    meaning: 'KHỞI TẠO/ĐỘNG — ý chí kiên cường, dũng, táo bạo, thích thách thức & thay đổi, không chịu ngồi yên. Cương trực, giao thiệp rộng, biểu hiện lực mạnh, không phục thua.',
    career: 'quân/cảnh, khởi nghiệp, kinh doanh biến động, sáng tạo mở đường — "động trung đắc tài"; sợ tĩnh. Đại khởi đại lạc, tiềm năng nhất cử thành danh.',
  },
  {
    key: '机月同梁', name: '机月同梁格', test: (s) => s.has('天机') && s.has('太阴') && s.has('天同') && s.has('天梁'),
    vi: 'Cơ Nguyệt Đồng Lương', tone: 'cat',
    meaning: 'ỔN ĐỊNH/VĂN CHỨC — "Cơ Nguyệt Đồng Lương tác lại nhân": khuynh hướng quy chế, mưu luận êm, quân bình, biết hưởng thụ, hành sự ổn. Mưu sĩ kiểu "lão nhị triết học".',
    career: 'văn phòng/quan chức/mưu sĩ/kip toán/hoạch định — phù hợp phụ tá, mộc hậu, ổn định phú túc, vãn niên an lạc.',
  },
  {
    key: '府相朝垣', name: '府相朝垣格', test: (s) => s.has('天府') && s.has('天相'),
    vi: 'Phủ Tướng Triều Viên', tone: 'cat',
    meaning: 'PHỤ TÁ mạnh nhất — trung thành đáng tin, "tả hữu thủ" đỉnh,踏 thực vụ thực. "Lão nhị triết học" — không tranh nhất, trong hiệp tác phát huy tốt nhất.',
    career: 'chuyên gia/quản lý/phụ tá trong tổ chức lớn — "không làm chủ mà vẫn phú", sự nghiệp ổn, tài vận hanh, phú túc cả đời.',
  },
  {
    key: '紫府同宫', name: '紫府同宫格', test: (s, same) => same('紫微', '天府'),
    vi: 'Tử Phủ Đồng Cung', tone: 'cat',
    meaning: 'ĐẠI QUÝ — Tử Vi (chủ tinh) + Thiên Phủ (tài khố) đồng cung Dần/Thân → tôn quý, lãnh đạo. (Cần cát tinh Tả/Hữu/Khôi/Việt/Lộc củng + không sát kỵ không kiếp mới thành cách mạnh; 否则破格.)',
    career: 'lãnh đạo cấp cao, chính thương lãnh tụ, quý khí cực lớn.',
  },
];

// 日月并明 cần độ sáng (miếu vượng) — check riêng
function isRiYueBingMing(starBright) {
  // 太阳 + 太阴 đều 庙/旺 trong mệnh tam phương
  return starBright('太阳') >= 2 && starBright('太阴') >= 2;
}

const TONG_PALACE = [
  { key: '紫府同宫', stars: ['紫微', '天府'], vi: 'Tử Phủ Đồng Cung', note: 'Đế + tài khố đồng cung → đại quý (mục Tử Phủ Đồng Cung cách).' },
  { key: '武贪同行', stars: ['武曲', '贪狼'], vi: 'Vũ Tham Đồng Hành', note: 'Vũ Khúc + Tham Lang đồng cung (Sửu/Mùi) → "Vũ Tham" — võ chức/将/tài nghệ, 30 sau phát.' },
  { key: '日月同临', stars: ['太阳', '太阴'], vi: 'Nhật Nguyệt Đồng Lâm', note: 'Thái Dương + Thái Âm đồng cung (Sửu/Mùi) → quyền uy, "quan cư hầu bá".' },
];

/**
 * @param {object} zr — computeZiwei()
 * @param {object} [brightness] — analyzeZiweiBrightness() (cho 日月并明)
 * @param {object} [aux] — computeAuxStars() (cho 火贪/铃贪/君臣庆会/石中隐玉)
 * @returns {{ matched:[{key,name,vi,tone,meaning,career}], tongPalace:[], summary }}
 */
export function analyzeZiweiGeju(zr, brightness, aux) {
  const ming = zr.palaces.find((p) => p.isMing);
  if (!ming) return { matched: [], summary: '(không tìm Mệnh cung)' };
  const { all } = sanfangSizheng(ming.zhi);
  const palByZhi = {}; for (const p of zr.palaces) palByZhi[p.zhi] = p;
  // tập sao trong Mệnh tam phương tứ chính
  const starSet = new Set();
  const allStarsIn = []; // {star, palace}
  for (const z of all) for (const s of (palByZhi[z]?.stars || [])) { starSet.add(s); allStarsIn.push({ s, z }); }
  // same-palace check
  const same = (a, b) => all.some((z) => { const ss = palByZhi[z]?.stars || []; return ss.includes(a) && ss.includes(b); });

  const matched = [];
  for (const g of GEJU) {
    if (g.test(starSet, same)) matched.push({ key: g.key, name: g.name, vi: g.vi, tone: g.tone, meaning: g.meaning, career: g.career });
  }
  // 日月并明 (cần brightness)
  if (brightness) {
    const bright = (star) => {
      for (const z of all) for (const it of (brightness.items || [])) if (it.star === star && it.zhi === z) return it.score;
      return 0;
    };
    if (bright('太阳') >= 2 && bright('太阴') >= 2) matched.push({ key: '日月并明', name: '日月并明格', vi: 'Nhật Nguyệt Tịnh Minh', tone: 'cat', meaning: 'Thái Dương + Thái Âm đều MIẾU/VƯỢNG hội chiếu → khai朗 minh mẫn, công danh hiển, tài vận hanh thông, có địa vị xã hội.', career: 'công chức/quản lý/danh vọng — quý khí.' });
  }

  // đồng-cung song tinh nổi bật (từ TONG_PALACE)
  const tongPalace = TONG_PALACE.filter((t) => same(t.stars[0], t.stars[1])).map((t) => ({ key: t.key, vi: t.vi, note: t.note }));

  // cục hình cần 辅/煞 tinh (nếu aux truyền vào): 火贪/铃贪/君臣庆会/石中隐玉
  const auxMatched = [];
  if (aux) {
    const mainAt = zr.mainStars || {};
    const inMingSan = (branch) => all.includes(branch);
    // 火贪/铃贪 (Hỏa/Linh + Tham Lang đồng cung trong tam phương tứ chính mệnh)
    const tanLangZhi = mainAt['贪狼'];
    if (tanLangZhi && inMingSan(tanLangZhi)) {
      if (aux['火星'] && aux['火星'].branch === tanLangZhi) auxMatched.push({ key: '火贪格', name: '火贪格', vi: 'Hỏa Tham', tone: 'cat', meaning: 'Hỏa Tinh + Tham Lang đồng cung — «hoạnh phát» ĐỘT NGỘT PHÁT TÀI, bùng nổ (cục đặc biệt: PHÙNG SÁT KHÔNG PHÁ CÁCH). Sắp xếp bùng nổ đột biến.', career: 'kinh doanh bùng nổ, đầu cơ, cơ hội đột biến.' });
      else if (aux['铃星'] && aux['铃星'].branch === tanLangZhi) auxMatched.push({ key: '铃贪格', name: '铃贪格', vi: 'Linh Tham', tone: 'cat', meaning: 'Linh Tinh + Tham Lang đồng cung — hoạnh phát (nhẹ hơn Hỏa Tham), tài lộc đột biến nhưng chậm hơn.', career: 'kinh doanh, đầu tư tích lũy đột biến.' });
    }
    // 君臣庆会 (Tử Vi tọa mệnh + Tả Phụ/Hữu Bật hội tam phương)
    if (starSet.has('紫微')) {
      const hasFu = (aux['左辅'] && inMingSan(aux['左辅'].branch)) || (aux['右弼'] && inMingSan(aux['右弼'].branch));
      if (hasFu) auxMatched.push({ key: '君臣庆会', name: '君臣庆会格', vi: 'Quân Thần Khánh Hội', tone: 'cat', meaning: 'Tử Vi (quân) + Tả Phụ/Hữu Bật (thần) hội → lãnh tụ được hiền thần phù tá, quyền uy + thanh vọng, «tài học kinh bang».', career: 'lãnh đạo cấp cao, chính trị, quản trị đại tổ chức.' });
    }
    // 石中隐玉 (Cự Môn độc tọa mệnh Tý/Ngọ)
    if ((ming.stars || []).includes('巨门') && (ming.stars || []).filter((s) => s !== '巨门').length === 0 && ['子', '午'].includes(ming.zhi)) {
      auxMatched.push({ key: '石中隐玉', name: '石中隐玉格', vi: 'Thạch Trung Ẩn Ngọc', tone: 'cat', meaning: 'Cự Môn độc tọa mệnh Tý/Ngọ — ngọc ẩn trong đá, tài hoa nhưng须经 ma luyện mới thành đại khí (vãn phát), Tý chủ phú/Ngọ chủ quý.', career: 'chuyên gia/nghiên cứu/vãn phát — cần kiên nhẫn tôi luyện.' });
    }
  }

  const allMatched = [...matched, ...auxMatched];
  let summary;
  if (!allMatched.length) summary = `Mệnh TỬ VI không lập cục hình nổi bật (杀破狼/机月同梁/府相朝垣/紫府同宫/日月并明/火贪/君臣庆会/石中隐玉) — mệnh dạng tổng quát, đọc theo chính tinh + tam phương tứ chính.`;
  else summary = `Mệnh thuộc: ${allMatched.map((m) => m.name + '(' + m.vi + ')').join(', ')}. ${allMatched[0].meaning} Nghề hợp: ${allMatched[0].career}.`;
  if (tongPalace.length) summary += ` Đồng cung nổi bật: ${tongPalace.map((t) => t.vi).join(', ')}.`;

  return { matched: allMatched, tongPalace, summary };
}

export { GEJU, TONG_PALACE };
