// ============================================================================
//  CỔNG VÀO BỘ DỰNG KIẾN TRÚC (docs/TIEN-PHU-KIENTRUC-MANIFEST.md §3): id '<phong-cách>/<id công trình>' → { group, info, spec }.
//  Mỗi phong cách là một module arch/<phong-cách>.js xuất STYLE = { id, specs: { id: đặc tả }, builders: { type: fn(spec) → { acc, info } }, mats() }.
// ============================================================================
import { STYLE as trunghoa } from './trunghoa.js';
import { STYLE as nhatban } from './nhatban.js';
import { STYLE as taytang } from './taytang.js';
import { STYLE as gothic } from './gothic.js';
import { STYLE as artdeco } from './artdeco.js';
import { STYLE as tancodien } from './tancodien.js';
import { STYLE as hue } from './hue.js';
import { STYLE as thai } from './thai.js';
import { STYLE as mughal } from './mughal.js';

export const STYLES = { trunghoa, nhatban, taytang, gothic, artdeco, tancodien, hue, thai, mughal };
export const ARCH_SPECS = {};
for (const st of Object.values(STYLES)) for (const [id, s] of Object.entries(st.specs || {})) ARCH_SPECS[`${st.id}/${id}`] = { ...s, style: st.id, id };

/** dựng một công trình: key '<phong-cách>/<id>' → { group (THREE.Group gộp theo vật liệu), info (số đo đã dựng), spec } */
export function buildArch(key) {
  const spec = ARCH_SPECS[key]; if (!spec) throw new Error('không có đặc tả ' + key);
  const st = STYLES[spec.style], fn = st.builders[spec.type];
  if (!fn) throw new Error(`phong cách ${spec.style} chưa có bộ dựng loại '${spec.type}'`);
  const { acc, info } = fn(spec);
  const group = acc.build(st.mats(), key);
  return { group, info: { ...info, tris: Math.round(acc.tris()) }, spec };
}
