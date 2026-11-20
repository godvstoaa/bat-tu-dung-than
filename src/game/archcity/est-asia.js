// ============================================================================
//  HỌ PHONG CÁCH BIỆT PHỦ «ASIA» (docs/bietphu/asia.md) — hợp đồng: docs/bietphu/00-HOP-DONG.md, estatekit.js.
//   hue      Phủ Đệ Huế (phủ)      → est-asia-hue.js  (bộ dựng tiên phủ vn-build / vn-kit)
//   nhavuon  Nhà Vườn Huế (biệt thự) → est-asia-hue.js
//   thai     Cung Điện Thái Lan (phủ) → est-asia-thai.js (bộ dựng tiên phủ th-kit / th-build)
// ============================================================================
import { hueHall, hueTower, huePav, hueGate } from './est-asia-hue.js';
import { thaiHall, thaiTower, thaiPav, thaiGate } from './est-asia-thai.js';

const pick = (hue, thai) => (styleId, ...a) => (styleId === 'thai' ? thai : hue)(styleId, ...a);
export const FAMILY = {
  hall: pick(hueHall, thaiHall),
  tower: pick(hueTower, thaiTower),
  pav: pick(huePav, thaiPav),
  gate: pick(hueGate, thaiGate),
};
