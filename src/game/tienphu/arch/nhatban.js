// ============================================================================
//  PHONG CÁCH NHẬT BẢN — đăng ký vào bộ dựng (index.js): đặc tả spec-jp.js + bộ dựng jp.js (thành quách), jp-res.js (dinh, vườn)
//  Nghiên cứu: docs/tienphu-nghiencuu/02-nhatban.md
// ============================================================================
import { jpMats } from './jp-kit.js';
import { jpYagura, jpYaguraL, jpKesho, jpKura, jpKoraimon, jpYaguramon, jpTenshu } from './jp.js';
import { jpShoin, jpUmaya, jpChashitsu, jpChaya, jpAzumaya, jpKoshikake } from './jp-res.js';
import { JP_SPECS, JP_TOWER } from './spec-jp.js';
import { towerSpec } from '../tower.js';
import { TP_STYLES } from '../styles.js';

/** lầu 10 tầng: đặc tả game + bản ghi đè cục bộ JP_TOWER (báo lại để áp vào styles.js) */
const tower = () => { const st = TP_STYLES.find((s) => s.id === 'nhatban'); return jpTenshu(towerSpec({ ...st, tower: { ...st.tower, ...JP_TOWER } })); };

const builders = {
  tower, shoin: jpShoin, yagura: jpYagura, yaguraL: jpYaguraL, kesho: jpKesho, kura: jpKura, umaya: jpUmaya,
  koraimon: jpKoraimon, yaguramon: jpYaguramon, chashitsu: jpChashitsu, chaya: jpChaya, azumaya: jpAzumaya, koshikake: jpKoshikake,
};

export const STYLE = { id: 'nhatban', specs: JP_SPECS, builders, mats: jpMats, tower: JP_TOWER };
