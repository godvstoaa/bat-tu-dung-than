// ============================================================================
//  PHONG CÁCH THÁI (Đại Hoàng Cung Bangkok · Wat Phra Kaew) — đăng ký vào bộ dựng (index.js):
//  đặc tả th-spec.js + bộ dựng th-build.js (cấu kiện th-kit.js). Nghiên cứu: docs/tienphu-nghiencuu/08-thai.md
// ============================================================================
import { thHall, thHallRot, thPrasat, thMondop } from './th-build.js';
import { thChakri, thLong } from './th-build2.js';
import { thTower, TH_TOWER } from './th-tower.js';
import { thMats } from './th-kit.js';
import { towerSpec } from '../tower.js';
import { TP_STYLES } from '../styles.js';
import { TH_SPECS } from './th-spec.js';
import { cnCompound } from './cn.js';

const builders = { hall: thHall, hallRot: thHallRot, prasat: thPrasat, mondop: thMondop, chakri: thChakri, long: thLong };
/** lầu 10 tầng: đặc tả lầu game + bản ghi đè TH_TOWER (n 4, a 17×4 / 13×3 / 10×3, bệ 2,85 m — 08 › tower §8) */
builders.tower = () => { const st = TP_STYLES.find((s) => s.id === 'thai'); return thTower(towerSpec({ ...st, tower: { ...st.tower, ...TH_TOWER } })); };
builders.compound = (s) => cnCompound(s, (p) => builders[p.type](p));
export const STYLE = { id: 'thai', specs: TH_SPECS, builders, mats: thMats };
