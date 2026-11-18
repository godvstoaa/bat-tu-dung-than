// ============================================================================
//  PHONG CÁCH ART DECO (U Thiên — Villa Cavrois) — đăng ký vào bộ dựng (index.js): đặc tả ad-spec.js + bộ dựng ad-build.js
//  + vật liệu ad-kit.js. Nghiên cứu: docs/tienphu-nghiencuu/05-artdeco.md
// ============================================================================
import { adVilla, adTower, adBelvedere, adGlassDome, adTennis, adReading, adMirrorPav, adCubistTrees, adTriGarden } from './ad-build.js';
import { AD_SPECS, TOWER_OVERRIDE } from './ad-spec.js';
import { adMats } from './ad-kit.js';
import { towerSpec } from '../tower.js';
import { TP_STYLES } from '../styles.js';

const st = TP_STYLES.find((s) => s.id === 'artdeco');
/** lầu dựng theo bản ghi đè cục bộ (bậc lùi 34 → 27 → 20 m) — xem TOWER_OVERRIDE */
export const towerSpecAD = () => towerSpec({ ...st, tower: { ...st.tower, ...TOWER_OVERRIDE } });

const builders = {
  villa: adVilla, tower: () => adTower(towerSpecAD()), belvedere: adBelvedere, glassdome: adGlassDome, tennis: adTennis,
  reading: adReading, mirrorPav: adMirrorPav, cubist: adCubistTrees, trigarden: adTriGarden,
};

export const STYLE = { id: 'artdeco', specs: AD_SPECS, builders, mats: adMats };
