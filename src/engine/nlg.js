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
import { SHENSHA_INFO } from './shensha.js';
import { analyzeNayin, NAYIN_MEANING } from './nayin.js';
import { baziMingGong } from './bazi-minggong.js';
import { analyzeCaiKu } from './caiku.js';
import { pillarRelation } from './pillar-quality.js';
import { natalFuyin } from './fuyin.js';
import { dailyBriefing } from './daily-briefing.js';
import { cezi } from './cezi.js';
import { castByTime, solarToMhNums } from './meihua.js';
import { predictEvents } from './event-predict.js';
import { guiguziFortune } from './guiguzi.js';
import { analyze } from './chart.js';
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
  wealth: ['tài', 'tiền', 'của cải', 'giàu', 'lộc', 'đầu tư', 'tài chính', 'phát tài', 'làm giàu', 'kiếm tiền', 'kinh tế', 'nợ', 'lãi suất'],
  // [loop 798 FIX] «tình»→«tình yêu» — 'tình'(love)≡'tính'(nature) cùng→'tinh' (NFD collision),
  //   «khó TÍNH» match «tình» → love ❌. «tình yêu» specific tránh collision.
  love: ['tình yêu', 'tình duyên', 'tình cảm', 'duyên', 'hôn nhân', 'vợ', 'chồng', 'người yêu', 'kết hôn', 'cưới', 'gia đạo', 'ly hôn', 'đào hoa', 'phối ngẫu', 'tái hôn', 'lấy vợ', 'lấy chồng', 'gặp duyên', 'độc thân'],
  health: ['sức khỏe', 'bệnh', 'ốm', 'tạng', 'dưỡng sinh', 'thể chất', 'số thọ', 'tai nạn', 'đau', 'ăn uống', 'thực phẩm', 'chế độ ăn'],
  study: ['học', 'thi', 'bằng cấp', 'trí tuệ', 'kiến thức', 'sáng tạo', 'trường', 'đại học', 'luận văn', 'nghiên cứu'],
  children: ['con', 'con cái', 'sinh con', 'có con', 'quý tử', 'hậu duệ', 'thai'],
  family: ['gia đình', 'cha mẹ', 'anh em', 'ruột thịt', 'thân thuộc', 'mẹ', 'bố', 'cha'],
  travel: ['đi xa', 'xuất khẩu', 'nước ngoài', 'di cư', 'du lịch', 'dịch chuyển', 'định cư', 'xa nhà', 'lao động'],
  power: ['quyền', 'lãnh đạo', 'uy quyền', 'chức quyền', 'ảnh hưởng', 'địa vị', 'quyết định'],
  timing: ['vận', 'đại vận', 'thời điểm', 'năm nào', 'tuổi', 'lúc nào', 'tương lai', 'khi nào', 'bao giờ', 'bao lâu', 'tháng', 'năm nay', 'năm sau'],
  personality: ['tính cách', 'bản mệnh', 'con người', 'tướng', 'khí chất', 'bản chất', 'người như thế nào', 'cấu hình', 'cách cục', 'sát ấn', 'thương quan', 'quan sát', 'tỷ kiếp', '格局', 'dụng thần', 'kỵ thần', 'hỷ thần', 'ngũ hành', 'thiếu', 'bổ mệnh'],
  remedy: ['cải mệnh', 'cải vận', 'làm sao để', 'nên làm gì', 'làm gì', 'cách', 'hóa giải', 'tăng', 'giảm', 'tránh', 'phương pháp', 'khắc phục', 'thay đổi', 'cải thiện', 'khai vận', 'bổ mệnh', 'sống ở đâu', 'thành phố', 'phong thủy', 'mua nhà', 'mua đất', 'bất động sản', 'màu', 'màu sắc', 'hết xui', 'giải xui', 'đổi vận'],
  flow: ['dòng khí', 'lưu thông', 'khí mệnh', 'nguồn khí', 'dòng chảy', 'thông khí', '源流', 'khí lưu', 'nguồn lực mệnh', 'tắc khí'],
  divination: ['gieo quẻ', '起卦', '占', 'lắc quẻ', 'quẻ dịch', 'bói quẻ', 'meihua', 'thảo quẻ', 'quẻ hôm', '测字', 'châm tự', 'xem chữ', 'phép bói'],
};

export function detectIntent(question) {
  question = String(question || ''); // [loop 679] guard null/undefined → tránh question.match crash
  const t = question.toLowerCase();
  const norm = t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D'); // [loop 674] bỏ dấu + đ→d (đ là codepoint đơn, NFD không tách → regex lệch)
  const years = (question.match(/(19|20)\d{2}/g) || []).map(Number);
  // [loop 802] isDaily — «hôm nay/hôm qua/ngày mai» → daily briefing (giờ tốt/xấu, hướng kỵ,
  //   thái tuế, Dụng action) cụ thể hơn pTiming (năm/tháng). Trước đây «hôm nay» ở isTiming.
  const isDaily = /\b(hom nay|hom qua|ngay mai|ngay hom nay)\b/.test(norm);
  // [loop 717 FIX] thêm «tháng này» (thang nay), «hôm nay» (hom nay), «hôm qua», «tuần này»
  // [loop 734 FIX] thêm «bao giờ» (bao gio), «bao lâu» (bao lau) — câu hỏi timing phổ biến nhất,
  //   trước đây thiếu → «bao giờ tôi phát tài?» misroute sang wealth thay vì pTiming.
  // [loop 735 FIX] thêm «đại vận» (dai van), «lưu niên» (luu nien) — «đại vận nào tốt nhất?» trước đây
  //   area='timing' đúng nhưng isTiming=false → mất context-aware pTiming path.
  // [loop 802] «hôm nay/hôm qua» chuyển sang isDaily (daily briefing cụ thể hơn).
  const isTiming = /\b(khi nao|luc nao|nam nao|thang nao|bao gio|bao lau|dai van|luu nien|nam nay|nam sau|thang nay|tuan nay|tuan sau|thang sau)\b/.test(norm) || years.length > 0;
  const isYesNo = /\b(co nen|co duoc khong|nen khong|duoc khong|co tot khong|co xau khong|co the|lieu co)\b/.test(norm);
  // [loop 674 FIX] isCompat exclude số/tên/màu/đá — «số hợp không», «tên hợp không»
  //   là number/name analysis, KHÔNG phải chart compat (trước đây misroute → compat).
  const isCompat = /\b(hop khong|hop nhau|xung khac|theo khong|phu hop)\b/.test(norm)
    && !/\b(so dien thoai|so hop|bien so|ten|mau gi|mau hop|deo da|da quy)\b/.test(norm);
  // [loop 619] family question detection
  // [loop 797 FIX] exclude «anh/chị/em/con ấy» (non-possessive pronoun: him/her) — trước đây
  //   «tôi với ANH ẤY hợp không?» match «anh»+«hợp không» → isFamily ❌ (phải compat).
  const isFamily = (/\b(me toi|bo toi|me cua|bo cua|em toi|em cua|chau toi|con toi|anh toi|chi toi|nguoi than|gia dinh)\b/.test(norm)
    || /\b(me|bo|em|chau|con|anh|chi)\b.*\b(the nao|ra sao|tuong quan|hop khong|menh gi|dung gi)\b/.test(norm))
    && !/\b(anh ay|chi ay|em ay|con ay|chong ay|vo ay)\b/.test(norm);
  // [loop 497] divination intent (起卦/测字 CJK ngắn → confidence <3 → bypass như isCompat)
  // [loop 768 FIX] thêm «que hom/xem que/que ngay» — «quẻ hôm nay cho tôi» trước đây → timing (hom nay)
  //   vì bare «que» không match. Giờ catch «quẻ hôm/xem quẻ».
  const isDivination = /gieo que|lac que|que dich|boi que|thao que|que hom|que ngay|xem que|cham tu|luc nh|ky mon|don giap/.test(norm) || /起卦|测字|占卦|占卜|六壬|奇门|遁甲/.test(question);
  // [loop 655] fengshui + remedy intent (trước đây → «chưa rõ lĩnh vực» khi API fail)
  // [loop 805 FIX] gate isFengshui !career — «sự nghiệp HƯỚNG NÀO» trước đây → fengshui
  //   (hướng+nào) nhưng là career (hướng sự nghiệp ≠ hướng nhà).
  const isFengshui = (/\b(phong thuy|dinh vi|la ban)\b/.test(norm)
    || (/\b(huong|nha|tang|giuong|bep|cua chinh)\b/.test(norm) && /\b(tot|xau|hop|nao|cat|hung|nen|the nao|xung|hinh|hai)\b/.test(norm)))
    && !/\b(nghe|su nghiep|cong viec|nghe nghiep|cong danh|thang tien)\b/.test(norm);
  // [loop 768 FIX] bỏ «duoc» — «bao giờ mua ĐƯỢC nhà?» trước đây trigger fengshui (nha+duoc)
  //   nhưng là câu TIMING (hỏi KHI NÀO mua được). «tốt/hợp/xấu» vẫn cover fengshui quality.
  const isRemedy = /\b(bot xui|giam xui|bo xui|xui xe|xui|doi van|hoa giai|giai han|giai xui|khai van|may man|phuc duc|lam cai gi|nen lam gi|cuu|cai menh|cai van|bo tui|giam tui|deo da|da quy|mau gi|mau hop|mau sac)\b/.test(norm);
  // [loop 735] isRemedyStrong — ĐỘNG TỪ cải vận RÕ RÀNG (giải hạn/hoá giải/cải mệnh/cải vận/bớt xui/giải xui/khai vận/cứu).
  //   Khi user hỏi «sao giải hạn năm nay?» → isTiming (năm nay) true → isRemedy && !isTiming bị skip → MẤT remedy.
  //   Nhưng «giải hạn/hoá giải/cải vận» là intent remedy CHỦ ĐẠO (hỏi CÁCH hoá giải), KHÔNG phải timing.
  //   Phân biệt với «năm sau nên làm gì?» (loop 716) — «nên làm gì» mơ hồ → có thể timing.
  //   → isRemedyStrong thắng CẢ khi isTiming (remedy là chủ ý thực sự).
  const isRemedyStrong = /\b(giai han|hoa giai|giai xui|cai menh|cai van|doi van|khai van|bot xui|giam xui|cuu menh|cuu|bo tui|giam tui)\b/.test(norm);
  // [loop 757] isInteraction — hỏi về tương tác tứ trụ (刑冲害合/xung khắc/mâu thuẫn).
  //   Trước đây NLG offline KHÔNG surface interaction data (elevation 746-752 chỉ giúp AI brief).
  // [loop 812] «có gì đặc biệt/gì đây» chuyển sang isOverview (broad → multi-layer snapshot,
  //   không chỉ interactions). pInteraction giữ xung/hình/hại/tương tác specific.
  const isInteraction = /\b(xung hinh hai|xung hinh|xung khac|mau thuan|tuong tac|tu tru|tuong han|xung\.?hinh|xung khat|phuc ngam|phan ngam|phucam)\b/.test(norm)
    || (/\b(xung|hinh|hai)\b/.test(norm) && /\b(gi|nao|co khong|the nao|ra sao)\b/.test(norm))
    || /伏吟|反吟/.test(question);
  // [loop 758] isShensha — hỏi về thần煞/sao (quý nhân/đào hoa/dịch mã/văn xương...).
  //   Trước đây «tôi có quý nhân sao?» misroute (health/love) → KHÔNG surface R.shensha.
  //   «sao» phải kết hợp context sao (tránh «sao tôi lại...» = why).
  // [loop 766 FIX] bỏ bare «than» (match «Dụng thần sao?» = hỏi yongshen, KHÔNG phải sao)
  //   → false positive. Giữ «than sat» + tên sao cụ thể.
  const isShensha = /\b(quy nhan|chinh tinh|than sat|van xuong|duong nhan|hoa cai|tuong tinh|thien duc|thien y|kim du|hong diem|qui cuong|tam ky|loc than|dich ma|hoc duong)\b/.test(norm)
    || (/\bsao\b/.test(norm) && /\b(co|gi dac biet|chinh tinh|than sat|nao tot|nao xau)\b/.test(norm));
  // [loop 805] isShenshaStrong — chủ thể sao RÕ RÀNG (quý nhân/sao/dịch mã/văn xương) → thắng domain
  //   (đào hoa→love không được nuốt «quý nhân...đào hoa dịch mã»).
  const isShenshaStrong = /\b(quy nhan|sao gi|sao gi dac biet|chinh tinh|than sat|dich ma|van xuong|tuong tinh|loc than)\b/.test(norm);
  // [loop 759] isNayin — hỏi về nạp âm / bản mệnh hành (nayin của trụ ngày).
  const isNayin = /\b(nap am|nayin|ban menh ngu hanh|menh ngu hanh|hanh cua toi)\b/.test(norm);
  // [loop 764] isMinggong — hỏi về mệnh cung / thân cung (ziwei-BaZi «trụ thứ 6»).
  const isMinggong = /\b(menh cung|cung menh|than cung|cung than|tru thu 6)\b/.test(norm);
  // [loop 779] isCaiKu — hỏi về tài khố / giữ tiền / kho tiền (wealth storage).
  //   CJK (财库) test trên raw question KHÔNG \b (CJK không phải word-char → \b fail).
  const isCaiKu = /\b(tai kho|kho tien|giu tien|giu duoc tien|taikho|cai ku)\b/.test(norm) || /财库/.test(question);
  // [loop 781] isQiFlow — hỏi về khí thông trụ / 盖头截脚 (can-chi khắc trong cùng trụ).
  const isQiFlow = /\b(khi thong|khi luu|cai dau|tiet cuoc|gai dau|khi chay|thong tru)\b/.test(norm) || /盖头|截脚/.test(question);
  // [loop 808] isOverview — «phân tích toàn diện / luận sâu / tổng quan» → multi-layer snapshot.
  const isOverview = /\b(phan tich toan dien|toan dien|luan sau|tong quan|danh gia menh|xem toan dien|tom tat menh|ban menh toi sao|menh toi nhu the nao|co gi dac biet|gi day)\b/.test(norm);
  // [loop 760] isTiaohou — hỏi về điều hậu (khí hậu mùa sinh → hành cần bổ).
  const isTiaohou = /\b(dieu hau|hau cua|khi hau|mua sinh|co phap|khong thong bao|ngoai hop|van han|khan|tao|ret|am|nhiet)\b/.test(norm)
    && /\b(dieu hau|khi hau|hau|co phap)\b/.test(norm);
  // [loop 761] isPattern — hỏi về cách cục (格局).
  const isPattern = /\b(cach cuc|cach minh|cach cua|thuoc cach|cach nao|chinh cach|dac biet cach|tong cach)\b/.test(norm);

  let area = 'general', bestHits = 0;
  for (const [id, kws] of Object.entries(INTENT_KEYWORDS)) {
    let hits = 0;
    for (const k of kws) {
      const kn = k.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D'); // [loop 678] match norm (đ→d)
      // chấm theo độ dài từ khóa: từ càng dài càng cụ thể (tránh "tinh" khớp "tinh cach")
      // [loop 798 FIX] short keyword (≤3 char) dùng WORD-BOUNDARY — tránh collision «vợ»(vo)⊂«với»(voi),
      //   «anh»(anh)⊂«đang»... từ ngắn match substring từ phổ biến → false area.
      const _esc = kn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const _matched = kn.length <= 3 ? new RegExp('\\b' + _esc + '\\b').test(norm) : norm.includes(kn);
      if (_matched) hits += kn.length;
    }
    if (hits > bestHits) { bestHits = hits; area = id; }
  }
  // confidence: bestHits tổng độ dài từ khoá khớp. <3 = không khớp rõ → câu tự do/khó hiểu
  const confidence = bestHits;
  return { area, years, isTiming, isDaily, isYesNo, isCompat, isDivination, isFamily, isFengshui, isRemedy, isRemedyStrong, isInteraction, isShensha, isShenshaStrong, isNayin, isTiaohou, isPattern, isMinggong, isCaiKu, isQiFlow, isOverview, confidence, raw: question };
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
  // [loop 763] 大运 PHASE — 进气/旺气/退气 (cổ法: vận đầu «vào lực», giữa «phát huy đỉnh», cuối «suy»).
  const _refY = (R.chart.input && R.chart.input.refYear) || new Date().getFullYear();
  const _activeDy = dy.find((d) => d.startYear != null && d.startYear <= _refY && _refY < d.startYear + 10);
  if (_activeDy) {
    const _off = _refY - _activeDy.startYear; // 0-9
    const _phase = _off <= 2 ? `进气 (năm ${_off + 1}/10 — vận ĐANG VÀO, lực chưa tối đa)` : _off >= 7 ? `退气 (năm ${_off + 1}/10 — vận ĐANG RA, lực suy dần)` : `旺气 (năm ${_off + 1}/10 — vận ĐANG PHÁT HUY mạnh nhất)`;
    lines.push(`🌀 Đại vận hiện ${_activeDy.ganZhi} ${_activeDy.rating ? '(' + _activeDy.rating + ')' : ''}: ${_phase}. «进气退气» — cùng 1 đại vận, đầu/cuối lực khác nhau.`);
  }
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

function pOverview(R) {
  // [loop 808] Executive summary — multi-layer snapshot (1 line each) cho «phân tích toàn diện».
  const dm = R.chart.dayMaster;
  const dayGz = (R.chart.pillars && R.chart.pillars.day) ? R.chart.pillars.day.gan + R.chart.pillars.day.zhi : dm.gan;
  const p = R.pattern || {};
  const pq = R.patternQuality || {};
  const y = R.yong || {};
  const s = R.strength || {};
  const syn = R.synthesis || {};
  const it = R.interactions || {};
  const paras = [];
  // 1. Core
  paras.push(`🌟 **Bản mệnh**: ${dayGz} — ${dm.vi} (${dm.wx}), ${s.level || '?'} (${(s.ratio * 100).toFixed(0)}%). Cách cục: ${p.vi || p.name || '?'}${pq.quality ? ' (' + pq.quality + ')' : ''}. Tổng luận: ${syn.gradeVi || '?'} (${syn.score || '?'}/100).`);
  // 2. Dụng
  paras.push(`⚖ **Dụng thần**: ${favText(y)} / Hỷ ${wxVi(y.xi)} / Kỵ ${wxVi(y.ji)}. ${yongExplain(R) || ''}`);
  // 3. Tương tác nổi bật
  const _ints = [];
  if ((it.xing || []).length) _ints.push(`${(it.xing || []).length} hình`);
  if ((it.chong || []).length) _ints.push(`${(it.chong || []).length} xung`);
  if ((it.hai || []).length) _ints.push(`${(it.hai || []).length} hại`);
  paras.push(`⚔ **Tương tác**: ${_ints.length ? _ints.join(', ') : 'yên (ít xung/hình/hại)'}.`);
  // 4. Thần煞
  const _ss = Object.keys(R.shensha || {});
  paras.push(`⭐ **Sao thần煞**: ${_ss.length ? _ss.length + ' sao (' + _ss.slice(0, 4).map((k) => SHENSHA_INFO[k]?.vi || k).join(', ') + (_ss.length > 4 ? '...' : '') + ')' : 'không sao chính nổi bật'}.`);
  // 5. Nạp âm
  try {
    const _ny = analyzeNayin(R.chart).find((n) => n.key === 'day');
    if (_ny) paras.push(`🎵 **Nạp âm bản mệnh**: ${_ny.vi} (hành ${_ny.wxVi}).`);
  } catch (e) {}
  // 6. Hướng dẫn
  paras.push(`💡 Muốn xem CHI TIẾT từng lớp: hỏi «cách cục», «xung hình hại», «sao thần煞», «nạp âm», «tài khố», «đại vận», «hôm nay» — hoặc bật AI (⚙ GLM-5.2) cho luân giải mở.`);
  return { title: 'Phân tích toàn diện (tổng quan mệnh)', lead: `Snapshot đa lớp cho ${dayGz}:`, paragraphs: paras };
}
function pDaily(R) {
  // [loop 802] Surface dailyBriefing offline — «hôm nay» giờ tốt/xấu, hướng kỵ, thái tuế, Dụng action.
  const dm = R.chart.dayMaster;
  // ngày: hôm nay (refYear không dùng cho daily — lấy ngày thật)
  let y, mo, d;
  try { const _n = new Date(); y = _n.getFullYear(); mo = _n.getMonth() + 1; d = _n.getDate(); } catch (e) { y = 2026; mo = 6; d = 29; }
  let db;
  try { db = dailyBriefing(R, y, mo, d, R.patternQuality); } catch (e) { db = null; }
  if (!db) return { title: 'Vận hôm nay', lead: `Vận ngày hôm nay của ${dm.gan} ${dm.vi}:`, paragraphs: ['(không tính được — thử bật AI)'] };
  const r = db.rating || {};
  const paras = [];
  paras.push(`📅 ${db.date} (${db.lunarStr}, ${db.dayGanZhi}): ${r.level || '?'}${r.tone === 'cat' ? ' ★HOÀNG ĐẠO' : r.tone === 'hung' ? ' ⚠HẮC ĐẠO' : ''} — ${r.summary || ''}`);
  if (Array.isArray(db.bestHours) && db.bestHours.length) paras.push(`🕐 Giờ TỐT hôm nay: ${db.bestHours.slice(0, 3).map((h) => `${h.vi || h.zhi}(${h.score})`).join(', ')}.`);
  if (Array.isArray(db.avoidHours) && db.avoidHours.length) paras.push(`⏰ Giờ KỴ: ${db.avoidHours.slice(0, 2).map((h) => `${h.vi || h.zhi}`).join(', ')}.`);
  if (db.directionTaboo) {
    const _dt = db.directionTaboo;
    const _avoid = Array.isArray(_dt.avoid) ? _dt.avoid.join('/') : (_dt.avoid || '');
    const _safe = Array.isArray(_dt.safe) ? _dt.safe.join('/') : (_dt.safe || '');
    paras.push(`🧭 Hướng: KỴ ${_avoid}${_safe ? ' · AN TOÀN ' + _safe : ''}.`);
  }
  if (db.taisui) paras.push(`⚠ Thái Tuế: ${db.taisui.relation || db.taisui.current || '(xem chi tiết)'}.`);
  if (db.yongAction) {
    const _ya = db.yongAction;
    paras.push(`🎯 Dụng action: ${_ya.boost || ''}${_ya.reduce ? ' · giảm ' + _ya.reduce : ''}.${_ya.reason ? ' ' + _ya.reason : ''}`);
  }
  if (db.tips) paras.push(`💡 ${db.tips}`);
  paras.push(`💡 Mở tab «Hôm nay» hoặc AI để chi tiết giờ/phút, 选日 cho việc cụ thể (cưới/khai trương/động thổ).`);
  return { title: 'Vận hôm nay (lưu nhật)', lead: `Vận HÔM NAY của ${dm.gan} ${dm.vi}:`, paragraphs: paras };
}
function pQiFlow(R) {
  // [loop 781] Surface khí thông trụ / 盖头截脚 offline — pillarRelation per pillar.
  const dm = R.chart.dayMaster;
  const pillars = R.chart.pillars || {};
  const LABEL = { year: 'Trụ Năm', month: 'Trụ Tháng', day: 'Trụ Ngày', time: 'Trụ Giờ' };
  const lines = [];
  let blocked = 0, total = 0;
  for (const k of ['year', 'month', 'day', 'time']) {
    const p = pillars[k];
    if (!p) continue;
    total++;
    const r = pillarRelation(p);
    const isBlock = r.flow < 0;
    if (isBlock) blocked++;
    lines.push(`${LABEL[k]} ${p.gan}${p.zhi}: ${r.vi}${isBlock ? ' ⚠KHÍ BỊ CẢN' : ' ✓thông'}`);
  }
  const pct = total ? Math.round(((total - blocked) / total) * 100) : 100;
  return {
    title: 'Khí thông trụ 盖头截脚',
    lead: `Mỗi trụ can-chi có quan hệ ngũ hành — «盖头» (can khắc chi) / «截脚» (chi khắc can) = khí BỊ CẢN, sinh/比 hoà = thông:`,
    paragraphs: lines.concat([
      `📊 Khí thông: ${pct}% trụ (${total - blocked}/${total} thông). ${blocked >= 2 ? '⚠ Nhiều trụ bị 盖头/截脚 → khí KHÔNG THÔNG, đời nhiều trở ngại 反复周折 (滴天髓阐微).' : '✓ Khí tương đối thông — can-chi tương sinh, ít cản.'}`,
      `💡 盖头 (can khắc chi): việc «bắt đầu đã hỏng»; 截脚 (chi khắc can): «nửa chừng vấp». NẾU Dụng thần nằm trụ bị 盖头/截脚 → Dụng bị tổn; NẾU Kỵ thần bị → ngược lại tốt (khắc được Kỵ). Mở AI để luân giải.`,
    ]),
  };
}
function pCaiKu(R) {
  // [loop 779] Surface tài khố offline — analyzeCaiKu (Tài/Quan/Ấn khố + giữ tiền).
  const dm = R.chart.dayMaster;
  const dayGz = (R.chart.pillars && R.chart.pillars.day) ? R.chart.pillars.day.gan + R.chart.pillars.day.zhi : dm.gan;
  let ck;
  try { ck = analyzeCaiKu(R); } catch (e) { ck = null; }
  if (!ck) return { title: 'Tài khố 财库', lead: `Tài khố ${dayGz}:`, paragraphs: ['(không tính được — thử bật AI)'] };
  const paras = [];
  const kuVi = { taikuWx: 'Tài khố (kho tiền)', guankuWx: 'Quan khố (kho quyền/sự nghiệp)', yinkuWx: 'Ấn khố (kho học/phúc)' };
  paras.push(`💰 Tài khố: hành ${ck.taikuWxVi} (@ ${ck.taikuZhiVi})${ck.hasTaiku ? ` — CÓ (${ck.taikuPos?.length || 0} chi: ${(ck.taikuPos || []).join(', ')})` : ' — KHÔNG có tàng trong nguyên cục'}.`);
  if (ck.hasGuanku) paras.push(`🏛 Quan khố (${ck.guankuWx}): CÓ @ ${ck.guankuZhi} — sự nghiệp có nền tích luỹ.`);
  if (ck.hasYinku) paras.push(`📚 Ấn khố (${ck.yinkuWx}): CÓ @ ${ck.yinkuZhi} — phúc/học vấn tích luỹ.`);
  if ((ck.opens || []).length) paras.push(`🔓 Kho MỞ (bị 冲): ${ck.opens.join(', ')} — kho bị «mở» → tiền dễ ra, khó giữ trọn.`);
  if (Array.isArray(ck.profile)) paras.push(...ck.profile.slice(0, 3));
  if (ck.advice) paras.push(`💡 ${ck.advice}`);
  paras.push(`💡 Tài khố = chi «kho» (墓) của hành Tài — có kho → giữ được tiền; không kho → tiền qua rồi hết; bị 冲 = «mở kho» hao. Mở AI để luân giải sâu.`);
  return { title: 'Tài khố 财库 (giữ tiền)', lead: `Khả năng GIỮ TIỀN của ${dayGz}:`, paragraphs: paras };
}
function pMinggong(R) {
  // [loop 764] Surface mệnh cung offline — baziMingGong (trụ thứ 6) + tương tác nhật trụ.
  const dm = R.chart.dayMaster;
  let mg;
  try { mg = baziMingGong(R); } catch (e) { mg = null; }
  if (!mg) {
    return { title: 'Mệnh cung 命宫', lead: `Mệnh cung của ${dm.gan} ${dm.vi}:`, paragraphs: ['(không tính được mệnh cung — thử bật AI)'] };
  }
  return {
    title: 'Mệnh cung 命宫 (trụ thứ 6)',
    lead: `Mệnh cung = «trụ thứ 6» (sau tứ trụ + thai nguyên) — bản mệnh tiềm ẩn:`,
    paragraphs: [
      `🔮 Mệnh cung: ${mg.ganZhi || (mg.gan + mg.zhi)} (${mg.ganVi || ''} ${mg.zhiVi || ''}) — thập thần ${mg.godVi || mg.god || '?'}, hành ${mg.wxVi || ''}${mg.isYong ? ' ★= Dụng' : ''}${mg.isJi ? ' ⚠= Kỵ' : ''}.`,
      mg.interactionWithDay || 'Mệnh cung trung tính với nhật trụ.',
      `💡 Mệnh cung (命宫) = «trụ thứ 6» bổ sung tứ trụ — nền tảng tiềm ẩn; khi lưu niên/đại vận tới chi mệnh cung = «kích hoạt». ${mg.meaning ? mg.meaning + '.' : ''} Mở AI để luân giải sâu.`,
    ],
  };
}
function pPattern(R) {
  // [loop 761] Surface cách cục (格局) offline — pattern + quality + diseases/rescues.
  const dm = R.chart.dayMaster;
  const p = R.pattern || {};
  const pq = R.patternQuality || {};
  const QUALITY_VI = { 成格: 'THÀNH CÁCH (cách nguyên vẹn, mạnh)', 有救: 'HỮU CỨU (cách bại nhưng có cứu ứng bù)', 败格: 'BẠI CÁCH (cách vỡ, chưa cứu được)', 特殊: 'ĐẶC BIỆT (tòng/chuyên cách, vượt quy chuẩn)' };
  const ge = p.geShen || {};
  const paras = [];
  paras.push(`📋 Cách cục: ${p.vi || p.name || '(chưa định)'} (${p.name || ''})${p.type === 'special' ? ' — CÁCH ĐẶC BIỆT' : ''}.`);
  if (ge.gan) paras.push(`🎯 格 thần: ${ge.gan} (${ge.god}, hành ${ge.wx || '?'}) — nguồn ${ge.source || '?'}.`);
  if (p.shunNi) paras.push(`↔ Hướng dụng: ${p.shunNi}${p.pref && p.pref.note ? ' — ' + p.pref.note : ''}.`);
  if (pq.quality) {
    paras.push(`🏆 Chất lượng cách: ${QUALITY_VI[pq.quality] || pq.quality}.`);
    if (pq.transparent) paras.push(`   格 thần ${ge.gan || ''} THẤU CAN (lộ rõ, có lực).`);
    if (pq.rooted) paras.push(`   Có ROOT (căn ${pq.keyStar?.rootChi?.join('/') || ''}) → cách có nền.`);
    if (pq.broken) paras.push(`   ⚠ Cách BỊ VỠ${pq.rescued ? ' nhưng ĐÃ CỨU' : ' CHƯA cứu được'}.`);
  }
  if (Array.isArray(pq.diseases) && pq.diseases.length) {
    paras.push(`🦠 Nguyên nhân vỡ cách: ${pq.diseases.map((d) => d.note).join('; ')}.`);
  }
  if (Array.isArray(pq.rescues) && pq.rescues.length) {
    paras.push(`💊 Cứu ứng: ${pq.rescues.map((r) => r.note).join('; ')}.`);
  }
  paras.push(`💡 Cách cục = khung luận mệnh (chọn Dụng theo cách). THÀNH cách → dùng thần cách; BẠI cách → cần cứu ứng/bổ. Mở AI để luân giải sâu.`);
  return { title: 'Cách cục 格局', lead: `Cách cục của ${dm.gan} ${dm.vi}:`, paragraphs: paras };
}
function pTiaohou(R) {
  // [loop 760] Surface điều hậu offline — khí hậu mùa sinh + hành cần (穷通宝鉴).
  const dm = R.chart.dayMaster;
  const monthZhi = R.chart.monthZhi;
  const th = R.yong && R.yong.tiaohou ? R.yong.tiaohou : null;
  if (!th) {
    return { title: 'Điều hậu 调候', lead: `Điều hậu cho ${dm.gan} ${dm.vi}:`, paragraphs: ['(không có dữ liệu điều hậu — thử bật AI)'] };
  }
  const wxVi = { 木: 'Mộc', 火: 'Hỏa', 土: 'Thổ', 金: 'Kim', 水: 'Thủy' };
  const elemsVi = (th.elems || []).map((w) => wxVi[w] || w).join(', ');
  return {
    title: 'Điều hậu 调候 (khí hậu mùa sinh)',
    lead: `Nhật Chủ ${dm.gan} (${dm.vi}) sinh tháng ${monthZhi} — cổ pháp Điều Hậu (穷通宝鉴):`,
    paragraphs: [
      `💧 Hành cần Điều Hậu (cổ pháp 穷通宝鉴): ${(th.raw || []).join(' + ')} → hành ${elemsVi}${th.primaryWx ? ' (chủ: ' + (wxVi[th.primaryWx] || th.primaryWx) + ')' : ''}.`,
      th.note || '(khí hậu mùa sinh — bổ hành cho mùa).',
      `⚖ Quan hệ với Dụng Thần: ${th.override ? 'Điều Hậu ĐÃ override Phù Ức làm Dụng chính (mệnh lệch nặng, khí hậu là yếu tố quyết định).' : 'Phù Ức (cân bằng vượng suy) làm Dụng chính; Điều Hậu phối hợp khi thiên lệch — 2 pháp bổ trợ nhau.'}`,
      `💡 Điều hậu = bổ hành cho «khí hậu» mùa sinh (vd tháng đông lạnh → cần Hỏa sưởi; tháng hạ nóng → cần Thủy mát), KHÁC với Dụng Thần cân bằng. Mở AI để luân giải sâu.`,
    ],
  };
}
function pNayin(R) {
  // [loop 759] Surface nạp âm offline — 4 trụ nayin + bản mệnh (trụ ngày) meaning.
  const dayGz = (R.chart.pillars && R.chart.pillars.day) ? R.chart.pillars.day.gan + R.chart.pillars.day.zhi : R.chart.dayMaster.gan;
  let list;
  try { list = analyzeNayin(R.chart) || []; } catch (e) { list = []; }
  if (!list.length) {
    return { title: 'Nạp âm (纳音)', lead: `Nạp âm bản mệnh ${dayGz}:`, paragraphs: ['(không tính được nạp âm — thử bật AI để luân giải)'] };
  }
  const lines = list.map((n) => {
    const isDay = n.key === 'day';
    return `${isDay ? '★ ' : '  '}${n.label}: ${n.name} (${n.vi}) — hành ${n.wxVi}${n.meaning && n.meaning !== '(chưa encode)' ? ' · ' + n.meaning : ''}`;
  });
  const dayNayin = list.find((n) => n.key === 'day');
  return {
    title: 'Nạp âm 纳音 (bản mệnh hành)',
    lead: `Nạp âm 4 trụ — trụ NGÀY (${dayGz} = ${dayNayin ? dayNayin.vi : '?'}) là «bản mệnh hành» (cốt lõi khí chất bẩm sinh):`,
    paragraphs: lines.concat([`💡 Nạp âm (六十甲子纳音) là hành «cảm quang» của cặp can-chi — khác với hành thiên can địa chi. Nó bổ khuyết cho hành Dụng Thần; màu/số/đá hợp = hành nạp âm + Dụng. Mở AI để luân giải sâu.`]),
  };
}
function pShensha(R) {
  // [loop 758] Surface thần煞 offline — R.shensha + SHENSHA_INFO desc, nhóm theo tone.
  const ss = R.shensha || {};
  const dm = R.chart.dayMaster;
  const dayGz = (R.chart.pillars && R.chart.pillars.day) ? R.chart.pillars.day.gan + R.chart.pillars.day.zhi : dm.gan;
  const keys = Object.keys(ss).filter((k) => ss[k] && ss[k].at && ss[k].at.length && SHENSHA_INFO[k]);
  if (!keys.length) {
    return {
      title: 'Thần 煞 (sao mệnh)',
      lead: `Lá số ${dayGz}: khảo các sao thần煞 classique —`,
      paragraphs: ['Mệnh không mang sao thần煞 nổi bật trong nguyên cục (theo bộ sao chính). Sao chỉ thật sự «phát tác» khi lưu niên/đại vận mang chi đó tới — mở AI (⚙ GLM-5.2) để quét sao theo vận.'],
    };
  }
  const TONE = { cat: '★ CÁT (thuận)', neutral: '○ TRUNG (tùy)', volatile: '⚠ CƯỜNG (cần chế)' };
  const order = { cat: 0, neutral: 1, volatile: 2 };
  const sorted = keys.sort((a, b) => (order[SHENSHA_INFO[a].tone] - order[SHENSHA_INFO[b].tone]));
  const lines = sorted.map((k) => {
    const info = SHENSHA_INFO[k];
    const at = (ss[k].at || []).join(', ');
    return `${TONE[info.tone] || ''} ${info.vi} (${info.zh}) @ ${at} — ${info.desc}`;
  });
  const catCount = keys.filter((k) => SHENSHA_INFO[k].tone === 'cat').length;
  return {
    title: 'Thần 煞 (sao mệnh)',
    lead: `Mệnh ${dayGz} mang ${keys.length} sao thần煞 (${catCount} cát):`,
    paragraphs: lines.concat([`💡 Sao thần煞 phụ trợ — cát sao tăng lực khi trùng Dụng/Hỷ; cường sao (羊刃/魁罡) cần «chế» (quan sát/đapsulation) mới tốt. Mở AI để luân giải sao theo lưu niên/đại vận.`]),
  };
}
function pInteractions(R) {
  // [loop 757] Surface tương tác tứ trụ (刑冲害合) offline — dùng typed meanings (elevation 746-752).
  const it = R.interactions || {};
  const paras = [];
  const dm = R.chart.dayMaster;
  const dayGz = (R.chart.pillars && R.chart.pillars.day) ? R.chart.pillars.day.gan + R.chart.pillars.day.zhi : dm.gan;
  const lead = `Tương tác Tứ Trụ (刑沖會合) của ${dm.gan} ${dm.vi}:`;
  const has = (a) => Array.isArray(a) && a.length;
  // 三刑
  if (has(it.xing)) {
    paras.push(`⚔ 三刑: ${it.xing.map((x) => `${x.a}${x.a === x.b ? '' : '–' + x.b} (${x.vi})${x.heavy ? ' ⚖NẶNG(pháp hình)' : ''}${x.meaning ? ' — ' + x.meaning : ''}`).join('; ') || '(không phạm)'}`);
  }
  // 六害
  if (has(it.hai)) {
    paras.push(`➶ 六害: ${it.hai.map((h) => `${h.a}–${h.b} (${h.vi || 'hại'})${h.meaning ? ' — ' + h.meaning : ''}`).join('; ')}`);
  }
  // 六冲
  if (has(it.chong)) {
    paras.push(`⚡ 六冲: ${it.chong.map((c) => `${c.a}↔${c.b} (${c.vi || 'xung'})[${c.domain || '?'}]${c.meaning ? ' — ' + c.meaning : ''}`).join('; ')}`);
  }
  // 六合 (合化/合绊)
  if (has(it.zhiHe)) {
    paras.push(`🤝 六合: ${it.zhiHe.map((h) => `${h.a}+${h.b}→${h.hua} (${h.heType || 'hợp'})${h.huaNote ? ' — ' + h.huaNote : ''}`).join('; ')}`);
  }
  // bán hợp
  if (has(it.banHe)) {
    paras.push(`🔗 Bán hợp: ${it.banHe.map((b) => `${b.present.join('')}(thiếu ${b.missing}) = ${b.banType}[${b.strength}]`).join('; ')}`);
  }
  // 三合/三会 (cục đủ)
  if (has(it.sanHe) || has(it.sanHui)) {
    const all = [...(it.sanHui || []).map((s) => `會 ${s.branches.join('')}→${s.wx}`), ...(it.sanHe || []).map((s) => `合 ${s.branches.join('')}→${s.wx}`)];
    paras.push(`★ Tam hợp/hội đủ cục: ${all.join('; ')} (lực mạnh, đổi ngũ hành cục)`);
  }
  // Can hợp
  if (has(it.ganHe)) {
    paras.push(`☉ Can hợp: ${it.ganHe.map((g) => `${g.a}+${g.b}→${g.hua}`).join('; ')}`);
  }
  // [loop 787] 反吟伏吟 (natalFuyin) — trùng trụ (phục ngâm) / thiên khắc địa xung (phản ngâm).
  try {
    const fy = natalFuyin(R).items || [];
    if (fy.length) paras.push(`🌀 反吟伏吟: ${fy.map((f) => `${f.typeVi} ${f.pair}${f.meaning ? ' — ' + f.meaning.slice(0, 60) : ''}`).join('; ')}`);
  } catch (e) {}
  if (!paras.length) {
    return {
      title: 'Tương tác Tứ Trụ',
      lead,
      paragraphs: [`Lá số ${dayGz} KHÔNG phạm xung/hình/hại nặng giữa các trụ — nền tương đối ổn, lục thân/quan hệ ít xung đột nội tại.`],
    };
  }
  return {
    title: 'Tương tác Tứ Trụ (刑沖會合)',
    lead,
    paragraphs: paras.concat(['💡 Xung/hình/hại không hẳn xấu — 若 trùng Dụng/Hỷ hành thì «hung giảm»; tam hợp/hội đủ cục + hành = Dụng thì CÁT mạnh. Chi tiết mở AI (⚙ GLM-5.2) để luân giải từng tương tác.']),
  };
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
  // [loop 767 FIX] GATE 6 intent mới (interaction/pattern/shensha/nayin/tiaohou/minggong):
  //   chỉ fire khi KHÔNG có domain signal mạnh hơn. Trước đây chúng check TRƯỚC isFamily/
  //   isFengshui/area → HIJACK câu hỏi domain («tài lộc...nạp âm» → nạp âm ❌, «hướng nhà...
  //   xung» → tương tác ❌, «dòng khí cách cục» → cách cục ❌, «đại vận...quý nhân» → shensha ❌).
  //   Domain signal: area ∈ {wealth,career,love,health,timing,flow} HOẶC isFamily/isFengshui/
  //   isRemedyStrong/isCompat/isDivination.
  const _STRONG_DOMAIN = new Set(['wealth', 'career', 'love', 'health', 'timing', 'flow']);
  const _hasDomain = _STRONG_DOMAIN.has(intent.area) || intent.isFamily || intent.isFengshui || intent.isRemedyStrong || intent.isCompat || intent.isDivination;
  // [loop 779] tài khố question — surface giữ-tiền/kho (offline) — UNGATED cho wealth domain
  //   nhưng [loop 793 FIX] gate !isFamily: «mẹ tôi giữ tiền» phải về pFamily (chart MẸ),
  //   không phải pCaiKu(R=chủ thể Quân).
  if (intent.isCaiKu && !intent.isFamily) return pCaiKu(R);
  // [loop 802] daily question — «hôm nay» → dailyBriefing (giờ tốt/xấu, hướng kỵ, thái tuế) —
  //   TRƯỚC isTiming (daily cụ thể hơn năm/tháng).
  if (intent.isDaily && !intent.isFamily && !intent.isDivination) return pDaily(R);
  // [loop 808] overview question — «phân tích toàn diện» → multi-layer snapshot.
  if (intent.isOverview) return pOverview(R);
  // [loop 757] interaction question — surface 刑冲害合 typed meanings (offline, không cần AI)
  // [loop 795 FIX] gate thêm !isTiming: «năm 2030 xung hình?» → pTiming (lưu niên 太岁/xung năm),
  //   không pInteractions (natal). Xung/hình LÀ timing-relevant (lưu niên); cách cục/tài khố
  //   (natal) KHÔNG gate isTiming (năm không đổi natal).
  if (intent.isInteraction && !_hasDomain && !intent.isTiming) return pInteractions(R);
  // [loop 761] pattern question — surface cách cục (offline, KHÔNG cần AI) — check TRƯỚC isShensha
  //   vì «cách cục ... Dụng thần sao?» có chữ «sao»+«thần» (loop 766 fix false-positive).
  if (intent.isPattern && !_hasDomain) return pPattern(R);
  // [loop 758] shensha question — surface thần煞 (offline, không cần AI)
  // [loop 805] isShenshaStrong thắng CHỈ love (đào hoa collision) — không thắng timing/family
  //   (đại vận quý nhân = timing primary, quý nhân incidental).
  if (intent.isShensha && (!_hasDomain || (intent.isShenshaStrong && intent.area === 'love'))) return pShensha(R);
  // [loop 759] nayin question — surface nạp âm (offline, không cần AI)
  if (intent.isNayin && !_hasDomain) return pNayin(R);
  // [loop 760] tiaohou question — surface điều hậu (offline, không cần AI)
  if (intent.isTiaohou && !_hasDomain) return pTiaohou(R);
  // [loop 764] minggong question — surface mệnh cung (offline, không cần AI)
  if (intent.isMinggong && !_hasDomain) return pMinggong(R);
  // [loop 781] qi-flow question — surface 盖头截脚/khí thông (offline, không cần AI)
  if (intent.isQiFlow && !_hasDomain) return pQiFlow(R);

  // [loop 620→621] family question — check BEFORE compat/divination
  //   vì «mẹ tôi hợp không» match CẢ isFamily và isCompat → ưu tiên family
  if (intent.isFamily) {
    // [loop 620] Extract date from question → compute ngũ hành tương quan OFFLINE
    const dateMatch = question.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
    if (dateMatch) {
      const [, dd, mm, yy] = dateMatch.map(Number);
      try {
        // [loop 622 FIX] detect gender from question text (trước đây hardcode 'nữ' → bố sai NC!)
        const qNorm = question.toLowerCase();
        const isMale = /\b(bo|cha|ong|anh|chau trai|con trai|chong|bac|cu)\b/.test(qNorm);
        const isFemale = /\b(me|vo|chi|chau gai|con gai|co|mo|dom)\b/.test(qNorm);
        const relGender = isMale ? 'nam' : isFemale ? 'nữ' : 'nam'; // default nam (BaZi standard)
        const relR = analyze(yy, mm, dd, 12, 0, relGender, new Date().getFullYear());
        const uWx = R.chart.dayMaster.wx, rWx = relR.chart.dayMaster.wx;
        const SHENG_L = { 木:'火', 火:'土', 土:'金', 金:'水', 水:'木' };
        const KE_L = { 木:'土', 土:'水', 水:'火', 火:'金', 金:'木' };
        let rel2;
        if (SHENG_L[uWx] === rWx) rel2 = `bạn (${WX_VI[uWx]}) sinh họ (${WX_VI[rWx]}) → bạn nuôi họ`;
        else if (SHENG_L[rWx] === uWx) rel2 = `họ (${WX_VI[rWx]}) sinh bạn (${WX_VI[uWx]}) → họ nuôi bạn`;
        else if (KE_L[uWx] === rWx) rel2 = `bạn (${WX_VI[uWx]}) khắc họ (${WX_VI[rWx]}) → bạn chế`;
        else if (KE_L[rWx] === uWx) rel2 = `họ (${WX_VI[rWx]}) khắc bạn (${WX_VI[uWx]}) → họ áp`;
        else rel2 = `cùng hành (${WX_VI[uWx]}) — tính cách giống`;
        const relDung = relR.yong.primary;
        const helpsUser = rWx === R.yong.primary;
        const userHelps = uWx === relDung;
        return {
          title: `Người thân (${dd}/${mm}/${yy}) — ngũ hành tương quan`,
          lead: `Người này: Nhật Chủ ${relR.chart.dayGan} (${WX_VI[rWx]}), Dụng ${WX_VI[relDung]}. Bạn: ${R.chart.dayGan} (${WX_VI[uWx]}), Dụng ${WX_VI[R.yong.primary]}.`,
          paragraphs: [
            `Ngũ hành: ${rel2}.`,
            helpsUser ? `✓ NC người này (${WX_VI[rWx]}) = Dụng của bạn (${WX_VI[R.yong.primary]}) → NGƯỜI NÀY TỐT CHO BẠN.` : userHelps ? `✓ NC bạn (${WX_VI[uWx]}) = Dụng của người này (${WX_VI[relDung]}) → BẠN TỐT CHO HỌ.` : `Ngũ hành không trực tiếp bổ Dụng — quan hệ cần nỗ lực vun đắp.`,
            `💡 Để xem phân tích đầy đủ (164 card + đại vận + AI), bấm «📝» cạnh tên người này trong card「👪 Nghiệm Chứng Gia Tộc」, hoặc bật AI để luận giải sâu hơn.`,
          ],
          intent,
        };
      } catch (_) {}
    }
    // [loop 656] SEEDED FAMILY — nếu question hỏi về người thân đã có trong R._family
    //   (seeded loop 626) → analyze ngay thay vì hỏi lại ngày sinh (offline khi AI fail).
    if (Array.isArray(R._family) && R._family.length) {
      const qNorm = (question || '').toLowerCase();
      const relKw = [
        { kw: ['mẹ', 'me', 'mom', 'má'], role: 'mother' },
        { kw: ['bố', 'cha', 'ba', 'dad', 'ông'], role: 'father' },
        { kw: ['em', 'anh', 'chị', 'chi', 'sister', 'brother'], role: 'sibling' },
        { kw: ['cháu', 'chau', 'con', 'child'], role: 'child' },
      ];
      const matched = relKw.find((r) => r.kw.some((k) => qNorm.includes(k)));
      const member = matched && R._family.find((f) => (f.role || '').toLowerCase() === matched.role || (matched.kw.some((k) => (f.label || f.relation || '').toLowerCase().includes(k))));
      if (member && member.date) {
        try {
          const [yy, mm, dd] = (member.date || '').split('-').map(Number);
          const [h] = (member.time || '12:00').split(':').map(Number);
          const relR = analyze(yy, mm, dd, h || 12, 0, member.gender || 'nam', new Date().getFullYear());
          const uWx = R.chart.dayMaster.wx, rWx = relR.chart.dayMaster.wx;
          const SHL = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
          const KEL = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };
          let rel2;
          if (SHL[uWx] === rWx) rel2 = `bạn (${WX_VI[uWx]}) sinh họ (${WX_VI[rWx]}) → bạn nuôi họ`;
          else if (SHL[rWx] === uWx) rel2 = `họ (${WX_VI[rWx]}) sinh bạn (${WX_VI[uWx]}) → họ nuôi bạn (Ấn)`;
          else if (KEL[uWx] === rWx) rel2 = `bạn (${WX_VI[uWx]}) khắc họ (${WX_VI[rWx]})`;
          else if (KEL[rWx] === uWx) rel2 = `họ (${WX_VI[rWx]}) khắc bạn (${WX_VI[uWx]})`;
          else rel2 = `cùng hành (${WX_VI[uWx]})`;
          const relDung = relR.yong.primary;
          const helpsUser = rWx === R.yong.primary;
          return {
            title: `${member.label || member.role} — ngũ hành tương quan`,
            lead: `${member.label || member.role}: NC ${relR.chart.dayGan} (${WX_VI[rWx]}), Dụng ${WX_VI[relDung]}, điểm ${relR.synthesis?.score}/100. Bạn: ${R.chart.dayGan} (${WX_VI[uWx]}), Dụng ${WX_VI[R.yong.primary]}.`,
            paragraphs: [
              `Ngũ hành: ${rel2}.`,
              helpsUser ? `✓ NC ${member.label || member.role} (${WX_VI[rWx]}) = Dụng của bạn (${WX_VI[R.yong.primary]}) → NGƯỜI NÀY TỐT CHO BẠN.` : `Ngũ hành ${WX_VI[rWx]} không trực tiếp bổ Dụng ${WX_VI[R.yong.primary]} — quan hệ cần nỗ lực vun đắp.`,
              `💡 Bật AI (⚙) hoặc bấm «📝» trong card Gia Tộc để luận giải đầy đủ (đại vận + lục thân đoán + taisui).`,
            ],
            intent,
          };
        } catch (_) {}
      }
    }
    return {
      title: 'Người thân — cần AI hoặc card Gia Tộc',
      lead: `Bạn hỏi về người thân. Để luân giải chính xác, tôi cần ngày sinh của người đó.`,
      paragraphs: [
        `📋 Cách 1: Mở card「👪 Nghiệm Chứng Gia Tộc」→ bấm «📝» cạnh tên người cần xem → app tự phân tích đầy đủ.`,
        `🤖 Cách 2: Bật AI (⚙ Cài đặt) → hỏi «mẹ tôi (27/6/1970) thế nào?» → AI dùng analyze_relative để luận giải đầy đủ.`,
        `💡 Hoặc hỏi tôi (offline) kèm ngày sinh: «mẹ tôi sinh 27/6/1970, hợp không?» → tôi luận ngũ hành tương quan ngay.`,
      ],
      intent,
    };
  }

  // [cycle 49] isCompat — cần 2 lá số (KHÔNG phải family)
  if (intent.isCompat && !intent.isFamily) {
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

  // [loop 497] divination intent
  if (intent.isDivination) {
    const block = pDivination(R, intent);
    return { title: block.title, lead: `Bạn hỏi về bói toán / gieo quẻ. Kết quả:`, paragraphs: block.paragraphs, intent };
  }

  // [loop 655] FENGSHUI direction (offline) — trước đây «chưa rõ lĩnh vực»
  if (intent.isFengshui) {
    const WX_DIR = { 木: 'Đông/Mộc (xanh)', 火: 'Nam/Hỏa (đỏ)', 土: 'Tây Nam/Trung/Thổ (vàng)', 金: 'Tây/Kim (trắng)', 水: 'Bắc/Thủy (đen)' };
    const WX_ITEM = { 木: 'cây cối, gỗ', 火: 'ánh sáng, nến, điện', 土: 'gốm đá, pha lê', 金: 'vật kim loại, đồng', 水: 'bể nước, phong linh, màu đen' };
    const dung = R.yong?.primary, hy = R.yong?.xi;
    return {
      title: 'Phong thủy & định vị',
      lead: `Bạn hỏi về hướng/phong thủy. Theo Dụng Thần ${WX_VI[dung] || dung} của bạn:`,
      paragraphs: [
        `Mệnh bạn Dụng ${WX_VI[dung] || dung}${hy ? ', Hỷ ' + (WX_VI[hy] || hy) : ''}. Hướng CÁT: ${WX_DIR[dung] || '?'}${hy ? ' + ' + (WX_DIR[hy] || '?') : ''}. Hướng KỴ: hành khắc Dụng.`,
        `Bố trí: đồ nội thất dùng chất liệu ${WX_ITEM[dung] || '?'} (bổ Dụng). Cửa chính/giường ưu tiên hướng ${WX_DIR[dung] || '?'}.`,
        `⚠ Năm 2026 cần tránh động thổ hướng Nam (Ngũ Hoàng) + hướng Tam Sát (Bắc 亥子丑). Chi tiết mở tab «Định Vị Phong Thủy» hoặc hỏi AI khi online.`,
      ],
      intent,
    };
  }
  // [loop 655→716 FIX] REMEDY (offline) — nhưng KHÔNG override isTiming
  //   Trước đây «năm sau nên làm gì» match cả isRemedy (nen lam gi) + isTiming (nam sau)
  //   → isRemedy check trước → route SAI sang remedy thay vì timing.
  // [loop 735 FIX] NGOẠI LỆ: isRemedyStrong (giải hạn/hoá giải/cải vận/bớt xui) = intent remedy
  //   THỰC SỰ → thắng CẢ khi isTiming. «sao giải hạn năm nay?» trước đây mất remedy do năm nay.
  if (intent.isRemedy && (!intent.isTiming || intent.isRemedyStrong)) {
    const WX_COLOR = { 木: 'xanh lá', 火: 'đỏ/tím', 土: 'vàng/nâu', 金: 'trắng/bạc', 水: 'đen/xanh đậm' };
    const WX_LIFE = { 木: 'giữ lòng từ bi, trồng cây, đi rừng', 火: 'tăng ánh sáng, lễ bái, vận động', 土: 'chân đất, gốm đá, thiền định', 金: 'sáng sớm, kỷ luật, rèn luyện', 水: 'gần sông biển, đọc sách, tĩnh lặng' };
    const dung = R.yong?.primary;
    return {
      title: 'Nghịch thiên cải mệnh (offline)',
      lead: `Bạn hỏi cách bớt xui/đổi vận. Cổ pháp «后天补救» — bổ Dụng Thần ${WX_VI[dung] || dung}:`,
      paragraphs: [
        `① Màu sắc: dùng ${WX_COLOR[dung] || '?'} (Dụng), tránh màu hành khắc. ② Hướng: ở/làm việc hướng Dụng (${ {木:'Đông',火:'Nam',土:'Tây Nam',金:'Tây',水:'Bắc'}[dung] || '?'}).`,
        `③ Lối sống: ${WX_LIFE[dung] || '?'}. ④ Tên/hiệu: chữ hành ${WX_VI[dung] || dung}. ⑤ Hành thiện tích đức («积善之家必有余庆») — cốt lõi.`,
        `⚠ «Địa năng bổ thiên, bất năng thay thiên» — cải mệnh BỔ Dụng, nâng nền 5-10 điểm, không biến bát tự. Vận mệnh chịu tác động đa nhân (nỗ lực, hoàn cảnh). Chi tiết hỏi AI khi online.`,
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
