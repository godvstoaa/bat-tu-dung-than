// ============================================================================
//  PHONG CÁCH GOTHIC ANH — đăng ký vào bộ dựng (index.js): đặc tả spec-go.js + bộ dựng go-build.js + vật liệu go-kit.js
//  Nghiên cứu: docs/tienphu-nghiencuu/04-gothic.md
// ============================================================================
import { hallH, chapel, kitchen, solar, lodging, mews, roundTower, stand, arbour, keep } from './go-build.js';
import { goMats } from './go-kit.js';
import { GO_SPECS } from './spec-go.js';
import { towerSpec } from '../tower.js';
import { TP_STYLES } from '../styles.js';

/**
 * BẢN GHI ĐÈ LẦU (đề xuất áp vào styles.js › gothic.tower): 04 › lau10 §8 — thân đa giác Ø 28 m (a = 14 m), bệ 40 m cao 2,5 m;
 * n = 8 (gần 10 cạnh Eagle Tower nhất trong {4, 8, 16}); giật cấp ở tầng có hành lang 3 / 6 / 9 (thân thon dần, tỉ lệ cao / rộng ≈ 1,9).
 */
export const GO_TOWER = { n: 8, a: [14, 14, 14, 12.8, 12.8, 12.8, 11.8, 11.8, 11.8, 11], podium: 2.5 };
const towerTs = () => { const st = TP_STYLES.find((s) => s.id === 'gothic'); return towerSpec({ ...st, tower: { ...st.tower, ...GO_TOWER } }); };

const builders = { hallH, chapel, kitchen, solar, lodging, mews, roundTower, stand, arbour, tower: () => keep(towerTs(), { c: 'B', turretH: 13, turretA: 3 }) };

export const STYLE = { id: 'gothic', specs: GO_SPECS, builders, mats: goMats };
