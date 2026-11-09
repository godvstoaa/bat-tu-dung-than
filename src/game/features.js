// ============================================================================
//  Cờ tính năng theo bản build — docs/GAME-MMO-PROMPT-PLAN.md §B1.
//  Web: đủ 7 gian. iOS (Lữ Đăng, đã từng bị 4.3(b) "fortune telling"): tắt mọi
//  cơ chế bói cho bản thân (xin xăm, điều ước hoa đăng), đổi từ ngữ sang "học".
//  Thuần dữ liệu, không DOM → test được bằng node (import.meta.env không có → web).
// ============================================================================

export const IOS = (import.meta.env && import.meta.env.MODE) === 'ios';

const VAN = ['vanbia', ...Array.from({ length: 9 }, (_, i) => `van${i}`), 'thaitue'];
const ALL = ['thay', 'compass', 'xam', 'huong', 'lich', 'tra', 'sen', 'an0', 'an1', 'an2', 'trach', 'duongtrach', 'dieuhau', 'thuvien', 'hophon', 'tuvi', 'tuongphap', 'cachcuc', 'que', 'tangy', ...VAN];
// gieo quẻ / xin xăm / vận hạn bản thân (đại vận, Thái Tuế): tắt trên iOS (4.3b) — cả cửa vào hai điện đó
const IOS_OFF = ['xam', 'sen', 'que', ...VAN, 'door_vanmenh', 'exit_vanmenh', 'door_thaitue', 'exit_thaitue'];

export const FEATURES = {
  stations: IOS ? ALL.filter((id) => !IOS_OFF.includes(id)) : ALL,
  divination: !IOS,
  wishes: !IOS,
  // Thầy luận bằng AI của app (askAI) — iOS tắt như app chính
  ai: !IOS,
  // [G1 — NPC-AI] persona giọng Thầy qua system message trong engine/ai.js
  //   (docs/npc-ai/15-lo-trinh-tich-hop.md §15.6a — flag «NPC_PERSONA_ENABLED»).
  //   TẮT MẶC ĐỊNH: chỉ bật sau gate eval M-ROLE ≥ 98% + P0 100% (bộ đỏ 200 câu);
  //   flag tắt → hành vi Thầy hôm nay KHÔNG ĐỔI. iOS đã tắt hẳn AI qua `ai` ở
  //   trên nên nhánh persona không bao giờ chạy trên iOS.
  personaAi: false,
};

export const TEXT = IOS
  ? {
    brand: 'Học Quán', han: '學 館', book: 'Sổ Tu Học', point: 'Điểm Tu Học',
    huong: 'Lò Trầm', huongVerb: 'Đốt một nén trầm', huongTask: 'Đốt một nén trầm',
    gateLead: 'Sân học cổ pháp: ngồi bàn thầy dựng tứ trụ, xoay la bàn, xem lịch tiết khí, rồi ngồi uống chén trà.',
  }
  : {
    brand: 'Huyền Quán', han: '玄 館', book: 'Sổ Mệnh', point: 'Phúc Khí',
    huong: 'Lư Hương', huongVerb: 'Thắp một tuần nhang', huongTask: 'Thắp một tuần nhang',
    gateLead: 'Ghé quán xem tứ trụ, hướng nhà, xin một quẻ, rồi ngồi uống chén trà. Không ai giục.',
  };

// cửa điện / lối ra luôn có (điện thờ là không gian, không phải gian bói)
export const hasStation = (id) => !(IOS && IOS_OFF.includes(id)) && (id.startsWith('door_') || id.startsWith('exit_') || FEATURES.stations.includes(id));
