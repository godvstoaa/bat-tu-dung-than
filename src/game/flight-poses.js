// ============================================================================
//  TƯ THẾ BAY ĐỘC BẢN (P15 — dữ liệu thuần). 6 vật cưỡi × 5 trạng thái (flight.js FS 1–5). Mỗi tư thế:
//   base: clip nền («idle» | «sit»), seat: kiểu ngồi xếp bằng của characters.seat («calm» | «tea») hoặc không,
//   bones: [[xương cha, xương con, [x, y, z]]] — hướng xương trong khung nhân vật (+z trước, +y lên, x dương = phía
//   bên của xương đó; characters.pose đổi dấu theo bên của rig), lean: nghiêng thân (rad, dương = cúi tới trước).
//  Không vật cưỡi nào dùng lại tư thế của vật khác (test kiểm).
// ============================================================================
const A = (b, c, v) => [b, c, v];
export const POSES = {
  // Ngự Kiếm: đứng nghiêng, tay chắp sau lưng (trôi) / bắt kiếm quyết (tăng tốc)
  kiem: {
    1: { base: 'idle', lean: 0.05, bones: [A('RightArm', 'RightForeArm', [0.3, -0.7, -0.4]), A('LeftArm', 'LeftForeArm', [0.3, -0.7, -0.4])] },
    2: { base: 'idle', lean: 0, bones: [A('RightArm', 'RightForeArm', [0.25, -0.75, -0.55]), A('RightForeArm', 'RightHand', [-0.6, -0.1, -0.5]), A('LeftArm', 'LeftForeArm', [0.25, -0.75, -0.55]), A('LeftForeArm', 'LeftHand', [-0.6, -0.1, -0.5])] },
    3: { base: 'idle', lean: 0.12, bones: [A('RightArm', 'RightForeArm', [0.3, -0.8, -0.45]), A('LeftArm', 'LeftForeArm', [0.35, -0.6, 0.3])] },
    4: { base: 'idle', lean: 0.3, bones: [A('RightArm', 'RightForeArm', [0.2, -0.2, 0.95]), A('RightForeArm', 'RightHand', [0, 0.5, 0.85]), A('LeftArm', 'LeftForeArm', [0.3, -0.75, -0.5])] },
    5: { base: 'idle', lean: -0.05, bones: [A('RightArm', 'RightForeArm', [0.45, -0.6, 0.1]), A('LeftArm', 'LeftForeArm', [0.45, -0.6, 0.1])] },
  },
  // Liên Hoa Đài: ngồi xếp bằng thiền định, tay kết ấn
  dai_sen: {
    1: { base: 'idle', seat: 'calm', lean: 0, bones: [] },
    2: { base: 'idle', seat: 'calm', lean: 0, bones: [A('RightForeArm', 'RightHand', [-0.5, 0.1, 0.85]), A('LeftForeArm', 'LeftHand', [-0.5, 0.1, 0.85])] },
    3: { base: 'idle', seat: 'calm', lean: 0.05, bones: [A('RightForeArm', 'RightHand', [-0.45, 0.3, 0.84])] },
    4: { base: 'idle', seat: 'calm', lean: 0.12, bones: [A('RightArm', 'RightForeArm', [0.2, -0.5, 0.84]), A('LeftArm', 'LeftForeArm', [0.2, -0.5, 0.84])] },
    5: { base: 'idle', seat: 'calm', lean: -0.04, bones: [A('LeftForeArm', 'LeftHand', [-0.35, -0.3, 0.88])] },
  },
  // Hồ Lô Phi Hành: ngồi vắt chân trên miệng hồ lô, tay cầm chén rượu nghiêng
  ho_lo_bay: {
    1: { base: 'sit', seat: 'tea', lean: -0.1, bones: [A('LeftArm', 'LeftForeArm', [0.6, -0.5, 0.2])] },
    2: { base: 'sit', seat: 'tea', lean: -0.15, bones: [A('LeftArm', 'LeftForeArm', [0.7, -0.6, -0.1])] },
    3: { base: 'sit', seat: 'tea', lean: -0.05, bones: [A('LeftArm', 'LeftForeArm', [0.5, -0.4, 0.5])] },
    4: { base: 'sit', seat: 'tea', lean: 0.2, bones: [A('LeftArm', 'LeftForeArm', [0.3, 0.1, 0.9])] },
    5: { base: 'sit', seat: 'tea', lean: -0.2, bones: [A('LeftArm', 'LeftForeArm', [0.8, -0.3, 0.2])] },
  },
  // Cân Đẩu Vân: đứng chống nạnh một tay, tay kia che mắt nhìn xa
  may: {
    1: { base: 'idle', lean: 0.02, bones: [A('LeftArm', 'LeftForeArm', [0.8, -0.5, 0.1]), A('LeftForeArm', 'LeftHand', [-0.5, 0.1, 0.5])] },
    2: { base: 'idle', lean: 0, bones: [A('LeftArm', 'LeftForeArm', [0.85, -0.45, 0]), A('LeftForeArm', 'LeftHand', [-0.6, 0.3, 0.3]), A('RightArm', 'RightForeArm', [0.4, 0.6, 0.65]), A('RightForeArm', 'RightHand', [-0.4, 0.8, 0.3])] },
    3: { base: 'idle', lean: 0.1, bones: [A('LeftArm', 'LeftForeArm', [0.85, -0.45, 0]), A('RightArm', 'RightForeArm', [0.3, 0.7, 0.6]), A('RightForeArm', 'RightHand', [-0.5, 0.7, 0.4])] },
    4: { base: 'idle', lean: 0.28, bones: [A('LeftArm', 'LeftForeArm', [0.6, -0.6, -0.45]), A('RightArm', 'RightForeArm', [0.5, 0.4, 0.75])] },
    5: { base: 'idle', lean: -0.06, bones: [A('LeftArm', 'LeftForeArm', [0.7, -0.7, 0.1]), A('RightArm', 'RightForeArm', [0.7, -0.7, 0.1])] },
  },
  // Tiên Hạc: ngồi thẳng cầm dây lụa (hành trình), cúi ôm cổ hạc (tăng tốc)
  hac: {
    1: { base: 'sit', lean: 0.1, bones: [A('RightArm', 'RightForeArm', [0.25, -0.45, 0.85]), A('LeftArm', 'LeftForeArm', [0.25, -0.45, 0.85])] },
    2: { base: 'sit', lean: 0, bones: [A('RightArm', 'RightForeArm', [0.3, -0.7, 0.6]), A('RightForeArm', 'RightHand', [-0.2, 0.1, 0.97]), A('LeftArm', 'LeftForeArm', [0.3, -0.7, 0.6]), A('LeftForeArm', 'LeftHand', [-0.2, 0.1, 0.97])] },
    3: { base: 'sit', lean: 0.05, bones: [A('RightArm', 'RightForeArm', [0.25, -0.55, 0.8]), A('LeftArm', 'LeftForeArm', [0.25, -0.55, 0.8]), A('RightForeArm', 'RightHand', [-0.25, 0.2, 0.95])] },
    4: { base: 'sit', lean: 0.55, bones: [A('RightArm', 'RightForeArm', [0.1, -0.3, 0.95]), A('RightForeArm', 'RightHand', [-0.6, 0, 0.8]), A('LeftArm', 'LeftForeArm', [0.1, -0.3, 0.95]), A('LeftForeArm', 'LeftHand', [-0.6, 0, 0.8])] },
    5: { base: 'sit', lean: -0.1, bones: [A('RightArm', 'RightForeArm', [0.35, -0.6, 0.7]), A('LeftArm', 'LeftForeArm', [0.35, -0.6, 0.7])] },
  },
  // Ngũ Hành Dực: lơ lửng tự do, tay thả lỏng nghiêng theo hướng bay
  duc: {
    1: { base: 'idle', lean: 0.08, bones: [A('RightArm', 'RightForeArm', [0.75, -0.55, -0.3]), A('LeftArm', 'LeftForeArm', [0.75, -0.55, -0.3])] },
    2: { base: 'idle', lean: 0, bones: [A('RightArm', 'RightForeArm', [0.6, -0.75, 0.2]), A('LeftArm', 'LeftForeArm', [0.6, -0.75, 0.2])] },
    3: { base: 'idle', lean: 0.35, bones: [A('RightArm', 'RightForeArm', [0.55, -0.6, -0.55]), A('LeftArm', 'LeftForeArm', [0.55, -0.6, -0.55])] },
    4: { base: 'idle', lean: 0.7, bones: [A('RightArm', 'RightForeArm', [0.2, -0.3, -0.93]), A('LeftArm', 'LeftForeArm', [0.2, -0.3, -0.93])] },
    5: { base: 'idle', lean: -0.1, bones: [A('RightArm', 'RightForeArm', [0.9, -0.4, 0.1]), A('LeftArm', 'LeftForeArm', [0.9, -0.4, 0.1])] },
  },
};
export const poseOf = (mount, s) => POSES[POSES[mount] ? mount : 'kiem'][s] || null;
