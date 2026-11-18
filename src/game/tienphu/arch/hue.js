// ============================================================================
//  PHONG CÁCH CUNG ĐÌNH HUẾ — đăng ký vào bộ dựng (index.js): đặc tả vn-spec.js + bộ dựng vn-build.js / vn-kit.js.
//  Nghiên cứu: docs/tienphu-nghiencuu/07-hue.md.
// ============================================================================
import { vnBuild, vnLang, vnTower, vnCompound, stele } from './vn-build.js';
import { vnMats } from './vn-kit.js';
import { HUE_SPECS } from './vn-spec.js';
import { Acc } from './kit.js';
import { towerSpec } from '../tower.js';
import { TP_STYLES } from '../styles.js';

/** bản ghi đè lầu 10 tầng theo 07 › lầu §3–§8 (vuông, đài 4,6 m, hiên 2,0 m); a ≥ 10 để thang 8,4 m và tầng ≥ 20 m */
export const HUE_TOWER = { n: 4, a: [15.6, 14.8, 13.2, 12.6, 12.0, 11.2, 10.8, 10.4, 10.0, 10.0], podium: 4.6, bd: 2.0, eaveCol: '#D8A02A' };
const hueTowerSpec = () => { const st = TP_STYLES.find((s) => s.id === 'hue'); return towerSpec({ ...st, tower: { ...st.tower, ...HUE_TOWER } }); };

const builders = {
  hall: vnBuild,
  lang: vnLang,
  stele: () => { const acc = new Acc(); stele(acc, 0, 0); return { acc, info: { W: 1.3, D: 0.8, PW: 1.3, PD: 0.8, ph: 0, top: 2.9, kind: 'stele' } }; },
  tower: () => vnTower(hueTowerSpec()),
};
builders.compound = (s) => vnCompound(s, (p) => builders[p.type](p));

export const STYLE = { id: 'hue', specs: HUE_SPECS, builders, mats: vnMats };
