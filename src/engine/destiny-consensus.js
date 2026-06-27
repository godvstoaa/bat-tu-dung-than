// ============================================================================
//  DESTINY CONSENSUS — TỔNG HỢP ĐỒNG THUẬN ĐA HỆ THỐNG (meta-synthesis)
//  [loop 561] FEATURE NEW: «nâng mức độ logic + chức năng mới». App có nhiều hệ
//    thống luận mệnh ĐỘC LẬP (BaZi synthesis, 称骨, 河洛+鬼谷卦, 六道). Module này
//    LẤY verdict của từng hệ, chuẩn hoá cát/hung/trung, tính mức ĐỒNG THUẬN hay
//    PHÂN KỲ, trả narrative thống nhất — giúp user thấy «bức tranh tổng» thay vì
//    các lời luận rời rạc.
//
//  Triết lý: khi nhiều hệ thống ĐỘC LẬP (khác cơ sở: ngũ hành vs trọng lượng xương
//  vs quẻ Dịch vs nghiệp lực) cùng chỉ 1 hướng → tín hiệu MẠNH. Khi phân kỳ →
//    bản mệnh PHỨC TẠP, cần nhìn từng khía cạnh riêng.
// ============================================================================
import { synthesize } from './synthesis.js';
import { computeLiuDao } from './liudao.js';
import { hexagramSynthesis } from './hexagram-synthesis.js';
import { chenggu as chengguCast } from './chenggu.js';

// Chuẩn hoá tone từng hệ → {cat|hung|trung} + điểm số hoá (cat=+1, trung=0, hung=-1)
const TONE_VAL = { cat: 1, hung: -1, trung: 0 };

function baziTone(syn) {
  // grade: 上/中上=cát, 中=trung, 中下/下=hung
  const g = syn.grade || '';
  if (g === '上' || g === '中上') return 'cat';
  if (g === '中') return 'trung';
  return 'hung';
}
function chengguTone(totalLiang) {
  // 称骨: 7.1最高, 2.1lowest. >=5.0 phúc lộc, 4.x trung bình, <4 vất vả.
  if (totalLiang >= 5.0) return 'cat';
  if (totalLiang >= 4.0) return 'trung';
  return 'hung';
}
function hexTone(synVerdict) {
  // hexagram-synthesis verdict string
  const v = synVerdict || '';
  if (/CỰC KỲ NHẤT TRÍ|NHẤT QUÁN CÁT|NHẤT QUÁN HUNG/.test(v)) {
    return /HUNG/.test(v) ? 'hung' : 'cat';
  }
  if (/NHẤT/.test(v) && /HUNG/.test(v)) return 'hung';
  if (/CÁT/.test(v)) return 'cat';
  if (/LỆCH|TRUNG|PHÂN/.test(v)) return 'trung';
  return 'trung';
}

export function destinyConsensus(R) {
  const out = { ok: false, systems: {}, consensus: null };
  try {
    const systems = [];

    // 1. BaZi synthesis (ngũ hành / thập thần / 格局) — cốt lõi
    let synScore = null, synTone = null, synGrade = '?';
    try {
      const syn = synthesize(R);
      synScore = syn.score;
      synGrade = syn.grade || '?';
      synTone = baziTone(syn);
      systems.push({ key: 'bazi', name: 'BaZi ngũ hành (格局/用神)', tone: synTone, detail: `${synGrade} (${synScore}/100) — ${syn.gradeVi || syn.fortuneVi || ''}` });
    } catch (e) {}

    // 2. 称骨 (trọng lượng xương — 袁天罡)
    let cgTone = null, cgWeight = null;
    try {
      const cg = chengguCast(R);
      if (cg) {
        cgWeight = cg.totalLiang;
        cgTone = chengguTone(cgWeight);
        systems.push({ key: 'chenggu', name: '称骨算命 (xương trọng)', tone: cgTone, detail: `${cgWeight} 两 — ${cg.totalStr}` });
      }
    } catch (e) {}

    // 3. 河洛 + 鬼谷卦 (Dịch số — hexagram synthesis)
    let hexT = null;
    try {
      const hs = hexagramSynthesis(R);
      if (hs.ok && hs.synthesis) {
        hexT = hexTone(hs.synthesis.verdict);
        systems.push({ key: 'hexagram', name: 'Kinh Dịch (河洛+鬼谷卦)', tone: hexT, detail: hs.synthesis.verdict });
      }
    } catch (e) {}

    // 4. 六道 (nghiệp lực / đạo — chiều THUẬT TU HỌC, KHÔNG cát/hung phú quý)
    let liudao = null;
    try {
      const ld = computeLiuDao(R);
      if (ld.ok) {
        liudao = { realm: ld.realm.vi, tier: ld.realm.tier, poisonTop: ld.poisonTop };
        systems.push({ key: 'liudao', name: 'Lục Đạo (nghiệp lực)', tone: ld.realm.tier === 'thiện' ? 'cat' : 'hung', detail: `${ld.realm.vi} — ${ld.poisonTop.vi}`, moral: true });
      }
    } catch (e) {}

    out.systems = { bazi: systems.find((s) => s.key === 'bazi') || null, chenggu: systems.find((s) => s.key === 'chenggu') || null, hexagram: systems.find((s) => s.key === 'hexagram') || null, liudao };

    // CONSENSUS — chỉ trên các hệ FORTUNE (bazi + chenggu + hexagram), 六道 tách riêng (chiều tu học)
    const fortuneSys = systems.filter((s) => s.key !== 'liudao');
    const vals = fortuneSys.map((s) => TONE_VAL[s.tone] ?? 0).filter((v) => v !== null);
    const sum = vals.reduce((a, b) => a + b, 0);
    const n = vals.length;

    let verdict, agreement, narrative;
    if (n === 0) {
      verdict = 'KHÔNG ĐỦ DỮ LIỆU';
      agreement = 0;
      narrative = 'Chưa tính đủ các hệ thống luận mệnh để tổng hợp.';
    } else {
      const catN = fortuneSys.filter((s) => s.tone === 'cat').length;
      const hungN = fortuneSys.filter((s) => s.tone === 'hung').length;
      const avg = sum / n;
      if (catN === n && n >= 2) { verdict = 'CỰC KỲ ĐỒNG THUẬN CÁT'; agreement = 1.0; }
      else if (hungN === n && n >= 2) { verdict = 'CỰC KỲ ĐỒNG THUẬN HUNG'; agreement = 1.0; }
      else if (avg >= 0.5) { verdict = 'ĐỒNG THUẬN THIÊN CÁT'; agreement = catN / n; }
      else if (avg <= -0.5) { verdict = 'ĐỒNG THUẬN THIÊN HUNG'; agreement = hungN / n; }
      else { verdict = 'PHÂN KỲ (mệnh phức tạp)'; agreement = Math.max(catN, hungN) / n; }

      narrative = `Hệ Fortune (${n}): ${fortuneSys.map((s) => `${s.name.split(' ')[0]}=${s.tone}`).join(', ')}.`;
      if (verdict.includes('ĐỒNG THUẬN')) {
        const dir = verdict.includes('CÁT') ? 'tốt đẹp, phú quý vững' : 'nhiều thử thách, cần kiên nhẫn';
        narrative += ` ${Math.round(agreement * 100)}% hệ thống cùng chỉ hướng ${verdict.includes('CÁT') ? 'CÁT' : 'HUNG'} → bản mệnh ${dir}. Đây là tín hiệu MẠNH vì ${n} phương pháp ĐỘC LẬP (khác cơ sở: ngũ hành / trọng lượng xương / quẻ Dịch) đều quy về cùng kết luận.`;
      } else {
        narrative += ` Các hệ thống KHÁC NHAU → bản mệnh PHỨC TẠP: mệnh根基 (ngũ hành) có thể tốt nhưng quẻ/trọng lượng chỉ trung, hoặc ngược lại. Không nên đọc 1 hệ thống duy nhất — cần xét từng khía cạnh (sự nghiệp vs phúc đức vs vận).`;
      }
      if (liudao) {
        narrative += ` 【Lục Đạo】riêng biệt (chiều tu học, không phú quý): khuynh hướng ${liudao.realm} (${liudao.tier === 'thiện' ? 'thiện đạo' : 'ác đạo — cần tu chuyển'}), độc nổi ${liudao.poisonTop.vi}.`;
      }
    }

    out.consensus = { verdict, agreement: Math.round((agreement || 0) * 100) / 100, sum, n, narrative, fortune: fortuneSys };
    out.ok = true;
  } catch (e) {
    out.ok = false;
    out.error = e && e.message ? e.message : String(e);
  }
  return out;
}
