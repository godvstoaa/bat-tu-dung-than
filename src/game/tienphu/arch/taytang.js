// ============================================================================
//  PHONG CÁCH TÂY TẠNG (Potala) — đăng ký vào bộ dựng (index.js): đặc tả tb-spec.js + bộ dựng tb.js
//  (docs/tienphu-nghiencuu/03-taytang.md). Lầu 10 tầng = Hồng Cung, dựng từ towerSpec với bản ghi đè TOWER_OVR.
// ============================================================================
import { tbMats, tbBlock, tbPalace, tbSeminary, tbDorm, tbMani, tbShrine, tbTiers, tbCompound, tbLukhang, tbIslandPav, tbLakePav, tbChorten, tbStage, tbTower } from './tb.js';
import { TB_SPECS, TOWER_OVR } from './tb-spec.js';
import { towerSpec } from '../tower.js';
import { TP_STYLES } from '../styles.js';

/** bỏ khung hàm (F) khỏi info — info phải tuần tự hoá được (bản vẽ, plan.js) */
const clean = ({ acc, info }) => { const { F, ...rest } = info; return { acc, info: rest }; };
const st = TP_STYLES.find((s) => s.id === 'taytang');
export const TAYTANG_TOWER = () => towerSpec({ ...st, tower: { ...st.tower, ...TOWER_OVR } });

const builders = {
  block: (s) => clean(tbBlock(s)), palace: (s) => clean(tbPalace(s)), seminary: (s) => clean(tbSeminary(s)), dorm: (s) => clean(tbDorm(s)),
  mani: (s) => clean(tbMani(s)), shrine: (s) => clean(tbShrine(s)), tiers: (s) => clean(tbTiers(s)), lukhang: (s) => clean(tbLukhang(s)),
  islandpav: (s) => clean(tbIslandPav(s)), lakepav: (s) => clean(tbLakePav(s)), chorten: (s) => clean(tbChorten(s)), stage: (s) => clean(tbStage(s)),
  tower: (s) => clean(tbTower(TAYTANG_TOWER(), s)),
};
builders.compound = (s) => clean(tbCompound(s, (p) => builders[p.type](p)));

export const STYLE = { id: 'taytang', specs: TB_SPECS, builders, mats: tbMats };
