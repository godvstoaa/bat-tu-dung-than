// ============================================================================
//  THÁI TUẾ ĐIỆN — vị Thái Tuế trị năm nay + tuổi người chơi có phạm không (tham khảo dân gian).
//  Engine app: taisui-general (60 vị đại tướng quân theo hoa giáp), taisui (5 loại phạm, phương vị,
//  tam hợp, 7 pháp hoá). Năm tính theo Lập Xuân (lunar-javascript). Thuần logic.
//  Lễ «thắp đèn an Thái Tuế»: state.js › lightLamp (mỗi năm một ngọn, mỗi ngày thêm dầu).
// ============================================================================
import { Solar } from 'lunar-javascript';
import { TAISUI_60, taiSuiGeneral } from '../engine/taisui-general.js';
import { personalTaSui, taSuiTable, taSuiDirection, TAISUI_REMEDY } from '../engine/taisui.js';
// [G2 NPC-AI] bark tuyên vị (mục 05 §05.11) — đọc tên can chi Việt + chọn câu thuần theo seed
import { GAN, ZHI } from '../engine/constants.js';
import { hashSeed } from './npc.js';

export { TAISUI_60 };

/** Năm can chi (theo Lập Xuân) của một ngày → { year (năm tiết khí), gz, zhi } */
export function suiYear(date = new Date()) {
  // giữ GIỜ/PHÚT thật của mốc — năm đổi đúng giây Lập Xuân, không phải chênh giữa trưa
  const ec = Solar.fromYmdHms(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), 0).getLunar().getEightChar();
  const gz = ec.getYearGan() + ec.getYearZhi();
  // trước Lập Xuân vẫn là năm can chi cũ → năm «tiết khí» lùi 1
  const idx = TAISUI_60.findIndex((t) => t[0] === gz);
  const g = taiSuiGeneral(date.getFullYear());
  const year = g.ganZhi === gz ? date.getFullYear() : date.getFullYear() - 1;
  return { year, gz, zhi: gz[1], index: idx };
}

/**
 * @param birthYearZhi chi năm sinh (theo Lập Xuân — R.chart.pillars.year.zhi)
 * @param birthYear    năm sinh dương lịch (bản mệnh Thái Tuế)
 */
export function thaiTue(birthYearZhi, birthYear, date = new Date()) {
  const s = suiYear(date);
  const cur = taiSuiGeneral(s.year);
  // Bản mệnh Thái Tuế theo CHI năm của lá số (trụ Năm lập theo Lập Xuân), không theo đầu năm
  // dương lịch: sinh trước Lập Xuân thì chi bản mệnh thuộc năm trước đó — cùng bảng không ra
  // hai bản mệnh trái nhau với `me`.
  let natalYear = null;
  if (birthYear) {
    natalYear = birthYear;
    if (birthYearZhi && taiSuiGeneral(birthYear).ganZhi?.[1] !== birthYearZhi
      && taiSuiGeneral(birthYear - 1).ganZhi?.[1] === birthYearZhi) natalYear = birthYear - 1;
  }
  const natal = natalYear ? taiSuiGeneral(natalYear) : null;
  const me = birthYearZhi ? personalTaSui(birthYearZhi, s.zhi) : null;
  return {
    year: s.year, ganZhi: cur.ganZhi, index: cur.index, name: cur.name, nameShort: cur.nameShort, nayin: cur.nayin, note: cur.note,
    direction: taSuiDirection(s.zhi),
    table: taSuiTable(s.zhi),
    natal,
    me,
    remedies: TAISUI_REMEDY,
  };
}

// ============================================================================
//  [G2 NPC-AI] BARK THÁI TUẾ — tuyên vị tướng quân trị năm (mục 05 §05.11).
//  Thuần logic: chọn câu THEO SEED NĂM HOA GIÁP (hashSeed của npc.js — không
//  Math.random trần), cùng năm ra cùng câu, sang năm tự đổi. Mỗi câu ≤ 90 ký
//  tự, không doạ, khung «năm có va chạm, không phải bị phạt» (§05.13 luật 5).
//  Luật 10 / bộ lọc V6 (mục 06 §3.6): KHÔNG chữ Hán trần trong bong bóng —
//  danh hiệu Hán của vị tướng đã hiển thị ở dòng tiêu đề panel (T.name);
//  bark tuyên bằng can chi Việt + vị thứ /60, đủ xác định duy nhất vị trị
//  niên trong TAISUI_60. KHÔNG đoán phạm/không phạm Thái Tuế — việc đó của
//  bảng UI và nút hỏi Thầy AI (vanmenh-ui.js), bark không thay mặt (§05.13
//  luật 4). Không đưa bark vào payload mạng (mục 13 Quyết 1) — hiển thị tại
//  chỗ trên máy người chơi.
// ============================================================================
export function thaiTueBark(T) {
  if (!T || !T.ganZhi || !T.index || !T.direction) return null; // thiếu dữ liệu → im lặng, không bịa giọng
  const gzVi = `${GAN[T.ganZhi[0]]?.vi || ''} ${ZHI[T.ganZhi[1]]?.vi || ''}`.trim();
  if (!gzVi || gzVi.length < 3) return null;
  const pool = [
    // câu 1 — tuyên vị (khuôn câu mẫu §05.11, tên Hán thay bằng vị thứ /60 theo luật V6)
    `Năm ${gzVi} — Thái Tuế năm nay là vị tướng thứ ${T.index}/60, cai phương ${T.direction}.`,
    // câu 2 — phương kiêng đúng khung «kiêng dân gian, không phải lệnh cấm» (§05.11)
    `Làm nhà làm nền năm nay, tránh phương ${T.direction} — kiêng dân gian, không phải lệnh cấm.`,
  ];
  return pool[hashSeed(`thaitue|${T.ganZhi}`) % pool.length];
}
