// ============================================================================
//  PHONG CÁCH MUGHAL – BA TƯ (quần thể Taj Mahal) — đăng ký vào bộ dựng (index.js): đặc tả mg-spec.js + bộ dựng mg-build.js
//  (cấu kiện mg-kit.js). Nghiên cứu: docs/tienphu-nghiencuu/09-mughal.md.
// ============================================================================
import { mgTomb, mgGate, mgMasjid, mgCourt, mgNaubat, mgOctTomb, mgBurj, mgChhatri, mgBaradari } from './mg-build.js';
import { mgMats } from './mg-kit.js';
import { MG_SPECS, MG_TOWER } from './mg-spec.js';
import { towerSpec } from '../tower.js';
import { TP_STYLES } from '../styles.js';

/** lầu 10 tầng: đặc tả game + bản ghi đè MG_TOWER (n, a[10], podium, gal, setback — báo để áp vào styles.js) */
const towerTs = () => { const st = TP_STYLES.find((s) => s.id === 'mughal'); return towerSpec({ ...st, tower: { ...st.tower, ...MG_TOWER } }); };

const builders = { tower: () => mgTomb(towerTs()), gate: mgGate, masjid: mgMasjid, court: mgCourt, naubat: mgNaubat, octTomb: mgOctTomb, burj: mgBurj, chhatri: mgChhatri, baradari: mgBaradari };

export const STYLE = { id: 'mughal', specs: MG_SPECS, builders, mats: mgMats };
