// ============================================================================
//  PHONG CÁCH TRUNG HOA — đăng ký vào bộ dựng (index.js): đặc tả spec-cn.js + bộ dựng cn.js
// ============================================================================
import { cnHall, cnLou, cnPavilion, cnCompound, cnTower, cnMats } from './cn.js';
import { CN_SPECS } from './spec-cn.js';
import { towerSpec } from '../tower.js';
import { TP_STYLES } from '../styles.js';

const builders = { hall: cnHall, lou: cnLou, pavilion: cnPavilion, tower: () => cnTower(towerSpec(TP_STYLES.find((s) => s.id === 'trunghoa')), { tile: 'Green', dk: 0.1 }) };
builders.compound = (s) => cnCompound(s, (p) => builders[p.type](p));

export const STYLE = { id: 'trunghoa', specs: CN_SPECS, builders, mats: cnMats };
