// [NEO-CHECKER v1] Đo tính chính xác NEO-DATA của câu trả lời AI vs brief.
//   Mô tả: dịch học khó verify "luận đúng/sai", nhưng NEO-DATA (tứ trụ, ngũ hành %,
//   thập thần, vượng suy, đại vận, sát phương...) tính bằng thuật toán → verify được.
//   Hàm này extract neo tokens từ response AI, so sánh vs brief → score + conflicts.
//
//   Score = matches / (matches + conflicts) × 100. Cao hơn = AI neo data đúng càng nhiều.
//   Conflicts = red flags nặng: bịa Tử Vi, nói vượng khi brief ghi nhược, lục đạo sai...
//
//   KHÔNG đo "luận đúng" (vd "năm 2028 giàu" — chỉ verify khi sự kiện xảy ra).
//   CHỈ đo: AI có đứng trên DATA ĐÚNG không.
// [RESTORE 2026-08-18] file bị mất khi process song song prune artifacts — viết lại nguyên bản.

// ---- pattern helpers ----
const _CAN = '[甲乙丙丁戊己庚辛壬癸]';
const _ZHI = '[子丑寅卯辰巳午未申酉戌亥]';
const _CAN_VI = 'Giap|At|Binh|Dinh|Mau|Ky|Canh|Tan|Nham|Quy';
const _ZHI_VI = 'Ty|Suu|Dan|Mao|Thin|Ty|Ngo|Mui|Than|Dau|Tuat|Hoi';
const _WX_VI = 'Mộc|Hỏa|Thổ|Kim|Thủy';

// Thập thần (Vi + Han)
const _SHISHEN = [
  'Chính Quan','Thất Sát','Chính Ấn','Thiên Ấn','Kiếp Tài','Thực Thần','Thương Quan','Chính Tài','Thiên Tài','Tỷ Kiên',
  '正官','七杀','七殺','正印','偏印','比肩','劫财','劫財','食神','伤官','傷官','正财','正財','偏财','偏財'
];

// Tử Vi chính tinh — nếu AI trích dẫn + "cung" → RED FLAG (brief BaZi không có)
const _ZIWEI_STARS = ['Cự Môn','Vũ Khúc','Thái Âm','Văn Khúc','Văn Xương','Thiên Lương','Thiên Cơ','Phá Quân','Tham Lang','Tử Vi','Liêm Trinh','Thái Dương','Thiên Đồng','Thiên Phủ','天机','天梁','七杀','破军','贪狼','巨门','廉贞','天府','太阳','太阴'];

// Cõi lục đạo (verify vs brief)
const _REALMS = ['Nhân Đạo','Ngạ Quỷ','Địa Ngục','Súc Sinh','Atula','A Tu La','Thiên Đạo','人间','饿鬼','地狱','畜生','阿修罗','天'];

function _briefVuongsuy(brief) {
  const m = String(brief || '').match(/VƯỢNG SUY:\s*Thân\s+[^()]*?(vượng|nhược|cân bằng|quá nhược|quá vượng|mạnh|yếu)/i);
  if (!m) return null;
  const v = m[1].toLowerCase();
  if (v.includes('nhược') || v.includes('yếu')) return 'nhược';
  if (v.includes('vượng') || v.includes('mạnh')) return 'vượng';
  return 'cân';
}

function _briefWxPct(brief) {
  const out = {};
  const re = /(Thủy|Hỏa|Thổ|Kim|Mộc)\s*[\(（]\s*([木火土金水])\s*[\)）]\s*:\s*(\d+(?:\.\d+)?)\s*%/g;
  let m;
  while ((m = re.exec(String(brief || ''))) !== null) out[m[1]] = parseFloat(m[3]);
  return out;
}

function _briefRealm(brief) {
  const s = String(brief || '');
  for (const r of ['Nhân Đạo','Thiên Đạo','Atula','A Tu La','Súc Sinh','Ngạ Quỷ','Địa Ngục']) {
    if (new RegExp(r).test(s)) return r;
  }
  return null;
}

/**
 * Main: check neo accuracy của response vs brief.
 * @returns {{score, matches, conflicts[], totalChecked, hasRedFlag}}
 */
export function checkNeo(response, brief) {
  const resp = String(response || '');
  const bf = String(brief || '');
  const matches = [];
  const conflicts = [];

  // 1. CAN-CHI pairs — presence check vs brief
  const canChiRe = new RegExp(_CAN + _ZHI, 'g');
  const respCanChi = new Set();
  let m;
  while ((m = canChiRe.exec(resp)) !== null) respCanChi.add(m[0]);
  for (const cc of respCanChi) {
    if (bf.includes(cc)) { matches.push({ type: 'canChi', token: cc }); }
  }

  // 2. NGŨ HÀNH % — verify vs brief (sai lệch >3% = conflict)
  const briefWx = _briefWxPct(bf);
  const wxPctRe = new RegExp('(' + _WX_VI + ')\\s*[\\(（]?\\s*(\\d+(?:\\.\\d+)?)\\s*%', 'g');
  while ((m = wxPctRe.exec(resp)) !== null) {
    const wx = m[1]; const pct = parseFloat(m[2]);
    if (briefWx[wx] != null) {
      if (Math.abs(pct - briefWx[wx]) <= 3) matches.push({ type: 'wxPct', token: wx + ' ' + pct + '%', brief: briefWx[wx] + '%' });
      else conflicts.push({ type: 'wxPct', said: wx + ' ' + pct + '%', brief: wx + ' ' + briefWx[wx] + '%', severity: 'high' });
    }
  }

  // 3. VƯỢNG SUY — red flag nếu response trái brief
  const briefVS = _briefVuongsuy(bf);
  if (briefVS) {
    // [FIX FP — bake-off 3 model cùng bị flag oan] loại cụm KHÔNG phải khẳng định:
    //   «giả vượng» (thuật ngữ cổ: mạnh bề ngoài), «vượng hay nhược?» (dạng câu hỏi/đối chiếu)
    const respSafe = resp
      .replace(/(giả\s*vượng|vượng\s*giả|nhược\s*giả|yếu\s*giả)/gi, '')
      .replace(/(vượng|nhược)\s*(hay|hoặc|\/|hay không)\s*(nhược|vượng)?/gi, '');
    const saysVuong = /thân\s+(vượng|mạnh|vạm vỡ|to lớn|cường)/i.test(respSafe);
    const saysNhuoc = /thân\s+(nhược|yếu|mảnh mai|nhỏ nhắn|suy)/i.test(respSafe);
    if (briefVS === 'nhược' && saysVuong) {
      conflicts.push({ type: 'vuongsuyContradict', said: 'thân vượng/mạnh', brief: 'thân ' + briefVS, severity: 'critical', note: 'AI nói thân vượng nhưng brief ghi nhược → sai foundation (lỗi #2/#4 type)' });
    } else if (briefVS === 'vượng' && saysNhuoc) {
      conflicts.push({ type: 'vuongsuyContradict', said: 'thân nhược/yếu', brief: 'thân ' + briefVS, severity: 'critical' });
    } else if ((briefVS === 'nhược' && saysNhuoc) || (briefVS === 'vượng' && saysVuong)) {
      matches.push({ type: 'vuongsuy', token: 'thân ' + briefVS });
    }
  }

  // 4. RED FLAG: Tử Vi palace hallucination
  const hasTuViData = /Tử Vi 14 CHÍNH TINH|--- Tử Vi 14/.test(bf);
  for (const star of _ZIWEI_STARS) {
    if (resp.includes(star)) {
      const idx = resp.indexOf(star);
      const ctx = resp.slice(Math.max(0, idx - 20), idx + 60);
      if (/cung|mệnh cung|Phu Thê|Tài Bạch|Quan Lộc|Nô Bộc|Điền Trạch|Phụ Mẫu|Huynh Đệ|Tử Nữ|Phúc Đức|命宫|夫妻|财帛/.test(ctx)) {
        if (!hasTuViData) {
          conflicts.push({ type: 'tuviHallucinate', said: star + ' + cung', brief: '(không có Tử Vi palace)', severity: 'critical', note: 'Bịa Tử Vi palace (lỗi #6/#11 type)' });
          break;
        }
      }
    }
  }

  // 5. RED FLAG: lục đạo contradict
  const briefRealm = _briefRealm(bf);
  if (briefRealm) {
    for (const r of _REALMS) {
      if (resp.includes(r) && r !== briefRealm && !r.includes(briefRealm) && !briefRealm.includes(r)) {
        const idx = resp.indexOf(r);
        const ctx = resp.slice(Math.max(0, idx - 30), idx + 50);
        if (/cõi|đạo|luân hồi|tái sinh|lục đạo/.test(ctx)) {
          conflicts.push({ type: 'realmContradict', said: r, brief: briefRealm, severity: 'critical', note: 'Lục đạo sai (lỗi #8 type)' });
          break;
        }
      }
    }
  }

  // 6. NĂM HIỆN TẠI — neo vs brief
  const briefYearMatch = bf.match(/NĂM NAY\s*=\s*(\d{4})/);
  if (briefYearMatch) {
    const briefYear = briefYearMatch[1];
    const respYearRefs = resp.match(/năm nay[^.]{0,30}?(\d{4})/gi);
    if (respYearRefs) {
      for (const ref of respYearRefs) {
        const yr = (ref.match(/\d{4}/) || [])[0];
        if (yr && yr !== briefYear) conflicts.push({ type: 'yearWrong', said: 'năm nay = ' + yr, brief: 'năm nay = ' + briefYear, severity: 'high' });
        else if (yr === briefYear) matches.push({ type: 'year', token: yr });
      }
    }
  }

  // 7. SÁT PHƯƠNG — response khuyên hướng trùng hướng KỴ năm nay = conflict
  const satPhuongMatch = bf.match(/SAT PHƯƠNG[^\n]*TỔNG HỢP[^\n]*?:\s*([^\n]+)/);
  if (satPhuongMatch) {
    const spData = satPhuongMatch[1];
    const badDirs = [];
    const dirRe = /(Bắc|Nam|Đông(?: Nam)?|Tây(?: Nam)?|Đông Bắc|Tây Bắc|Tây|Đông)\s*\(/g;
    let dm;
    while ((dm = dirRe.exec(spData)) !== null) badDirs.push(dm[1]);
    if (badDirs.length) {
      const adviceRe = /(hướng|đầu giường|cửa|bàn|bếp)\s+(?:nên|tốt nhất|hay)\s+([A-Za-zÀ-ỹĐđ ]+?)(?:[\.\,\n]|$)/gi;
      while ((dm = adviceRe.exec(resp)) !== null) {
        const advice = dm[2];
        for (const bd of badDirs) {
          if (advice.includes(bd)) {
            conflicts.push({ type: 'satPhuongViolate', said: 'khuyên hướng ' + bd, brief: 'hướng ' + bd + ' phạm sát phương năm nay', severity: 'high', note: 'Khuyên hướng phạm sát phương (lỗi #10 type)' });
          }
        }
      }
    }
  }

  const total = matches.length + conflicts.length;
  const score = total > 0 ? Math.round((matches.length / total) * 100) : null;
  const hasRedFlag = conflicts.some((c) => c.severity === 'critical');
  return { score, matches: matches.length, conflicts: conflicts.slice(0, 10), totalChecked: total, hasRedFlag };
}

/** Helper cho admin display: format 1 conflict thành 1 dòng. */
export function formatConflict(c) {
  if (!c) return '';
  const sev = c.severity === 'critical' ? '🔴' : c.severity === 'high' ? '🟠' : '🟡';
  return sev + ' [' + c.type + '] AI nói: «' + (c.said || '?') + '» — brief: «' + (c.brief || '?') + '»' + (c.note ? ' · ' + c.note : '');
}
