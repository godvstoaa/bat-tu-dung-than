// ============================================================================
//  PHONG THỦY NHÀ RIÊNG (thuần JS) — chấm 0–100 kèm lời giải, theo:
//   1) ngũ hành đồ bài trí so với Dụng thần / Hỷ thần / Kỵ thần trong lá số người chơi;
//   2) luật bài trí kiểu Bát Trạch rút gọn — phương vị THẬT của từng món (cửa phòng = hướng mặt
//      tiền ngoài phố): bàn thờ tựa vách sau nhìn ra cửa, giường không đối cửa, án thư tựa tường,
//      nước ở Bắc / Đông / Đông Nam (không ở Nam), cây phương Đông, đèn phương Nam, bình phong chắn
//      cửa, Minh đường thông thoáng, không chật;
//   3) hành của cung (phường) chứa căn nhà.
//  Thưởng mỗi ngày về nhà: 3 + điểm/10 Phúc Khí (homeWarm).
// ============================================================================
import { ITEM, WX_NAME } from './items.js';
import { footOf } from './estate-core.js';

const SECT = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
/** Phương vị (8 hướng) của điểm cục bộ (lx, lz) trong phòng; fry = ry hướng mặt tiền nhà ngoài phố */
export function sectorOf(lx, lz, fry) {
  // trục cục bộ phòng: +z = phía cửa = hướng mặt tiền (sin fry, cos fry); +x = (cos fry, −sin fry)
  const wx = lx * Math.cos(fry) + lz * Math.sin(fry), wz = -lx * Math.sin(fry) + lz * Math.cos(fry);
  if (Math.hypot(wx, wz) < 0.8) return 'Trung Cung';
  const ang = Math.atan2(wx, -wz); // 0 = Bắc (−z thế giới), π/2 = Đông (+x)
  return SECT[((Math.round(ang / (Math.PI / 4)) % 8) + 8) % 8];
}

export function scoreHome({ room, items, yong = null, wardWx = null, fry = 0 }) {
  const notes = [];
  let s = 50;
  const add = (v, text) => { s += v; notes.push({ v, text }); };
  // 3) hành của phường
  if (yong?.primary && wardWx) {
    if (wardWx === yong.primary) add(8, `Nhà ở phường hành ${WX_NAME[wardWx]} — đúng Dụng thần`);
    else if (wardWx === yong.accent) add(5, `Phường hành ${WX_NAME[wardWx]} — hợp Hỷ thần`);
    else if (wardWx === yong.ji) add(-8, `Phường hành ${WX_NAME[wardWx]} — phạm Kỵ thần`);
  }
  // 1) ngũ hành đồ đạc
  if (yong?.primary) {
    let e = 0;
    for (const m of items) { const w = ITEM[m.i]?.wx; if (w === yong.primary) e += 3; else if (w === yong.accent) e += 2; else if (w === yong.ji) e -= 3; }
    e = Math.max(-25, Math.min(25, e));
    if (e) add(e, e > 0 ? `Đồ bài trí thiên về ${WX_NAME[yong.primary]}/${WX_NAME[yong.accent] || '—'} — bổ mệnh` : `Nhiều đồ hành ${WX_NAME[yong.ji]} — khắc mệnh`);
  }
  // 2) luật bài trí
  const hd = room.d / 2, hw = room.w / 2;
  const back = (m) => m.z - footOf(m).d / 2 < -hd + 1.0; // tựa vách sau
  const nearWall = (m) => { const f = footOf(m); return back(m) || m.x - f.w / 2 < -hw + 1.0 || m.x + f.w / 2 > hw - 1.0; };
  const facesDoor = (m) => m.r === 0;
  const inDoorLine = (m) => Math.abs(m.x) < 1.3;
  const by = (u) => items.filter((m) => ITEM[m.i].use === u);
  for (const m of by('altar')) {
    if (back(m) && facesDoor(m)) add(8, 'Bàn thờ tựa vách sau, nhìn ra cửa — tọa sơn hướng thủy');
    else if (facesDoor(m) && inDoorLine(m)) add(-6, 'Bàn thờ đối thẳng cửa mà không có vách tựa');
    else if (m.r === 2) add(-6, 'Bàn thờ quay lưng ra cửa');
  }
  for (const m of by('bed')) {
    if (inDoorLine(m) && facesDoor(m)) add(-5, 'Giường đối thẳng cửa — khí xung vào giấc ngủ');
    else if (nearWall(m)) add(3, 'Giường kê sát tường — có chỗ dựa');
  }
  for (const m of by('desk')) if (nearWall(m) && facesDoor(m)) add(5, 'Án thư lưng tựa tường, nhìn ra cửa');
  let water = 0, plant = 0, light = 0;
  for (const m of items) {
    const it = ITEM[m.i], sec = sectorOf(m.x, m.z, fry);
    if (it.wx === '水' && it.place !== 'wall') {
      if (['Bắc', 'Đông', 'Đông Nam'].includes(sec) && water < 2) { water++; add(5, `${it.name} ở phương ${sec} — thủy vượng tài`); }
      else if (sec === 'Nam') add(-5, `${it.name} ở phương Nam — thủy hỏa tương xung`);
    }
    if (it.use === 'plant' && ['Đông', 'Đông Nam'].includes(sec) && plant < 3) { plant++; add(3, `${it.name} ở phương ${sec} — mộc khí sinh sôi`); }
    if (it.use === 'light' && sec === 'Nam' && light < 2) { light++; add(3, `${it.name} ở phương Nam — hỏa khí sáng sủa`); }
    if ((m.i === 'ty_huu' || m.i === 'thiem_thu') && facesDoor(m)) add(3, `${it.name} quay ra cửa — đón tài`);
  }
  const screens = items.filter((m) => m.i.startsWith('binh_phong'));
  if (screens.some((m) => m.z > 0 && inDoorLine(m))) add(4, 'Bình phong chắn giữa cửa và nhà — hóa giải khí xung');
  // Minh đường: ô 2×2 giữa phòng trống
  const center = items.some((m) => ITEM[m.i].place !== 'wall' && Math.abs(m.x) < 1 + footOf(m).w / 2 && Math.abs(m.z) < 1 + footOf(m).d / 2);
  if (items.length) add(center ? -3 : 4, center ? 'Giữa nhà bị chắn — Minh đường bí' : 'Giữa nhà thông thoáng — Minh đường rộng');
  const area = room.w * room.d, used = items.filter((m) => ITEM[m.i].place !== 'wall').reduce((a, m) => { const f = footOf(m); return a + f.w * f.d; }, 0);
  if (used > area * 0.35) add(-5, 'Nhà quá chật đồ — khí không lưu thông');
  return { score: Math.max(0, Math.min(100, Math.round(s))), notes };
}
export const warmReward = (score) => 3 + Math.floor(score / 10);
