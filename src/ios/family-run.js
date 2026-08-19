// ============================================================================
//  family-run.js — adapter iOS: studio-analyze + family.js + quét 12 giờ
//  Cùng công thức family-rectify.js, không gọi analyze() đầy đủ.
// ============================================================================
import { analyzeFamily } from '../engine/family.js';
import { radialData, matrixData, radarData } from '../engine/family-diagram.js';
import { ZHI } from '../engine/constants.js';
import { toFamilyR, pillarLine } from './studio-analyze.js';

export const ZHI_BY_HOUR = { 0: '子', 2: '丑', 4: '寅', 6: '卯', 8: '辰', 10: '巳', 12: '午', 14: '未', 16: '申', 18: '酉', 20: '戌', 22: '亥' };
export const HOURS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

export function shiChenList() {
  return HOURS.map((hour) => ({
    hour,
    zhi: ZHI_BY_HOUR[hour],
    zhiVi: ZHI[ZHI_BY_HOUR[hour]].vi,
  }));
}

function memberInput(m, hourOverride) {
  const hourUnknown = !!m.hourUnknown || m.hour == null;
  const hour = hourOverride != null ? hourOverride : (hourUnknown ? 12 : Number(m.hour));
  return {
    year: Number(m.year),
    month: Number(m.month),
    day: Number(m.day),
    hour,
    minute: hourUnknown && hourOverride == null ? 0 : Number(m.minute ?? 0),
    gender: m.gender,
  };
}

export function buildPersonR(m, hourOverride) {
  return toFamilyR(memberInput(m, hourOverride));
}

/** 四柱 for list/plate. Hour-unknown 时柱 is 未记 — never a noon placeholder. */
export function memberStemBranchLine(m) {
  if (!m?.year || !m?.month || !m?.day) return '未记';
  try {
    const R = buildPersonR(m);
    const p = R.chart.pillars;
    const time = (m.hourUnknown || m.hour == null) ? '未记' : `${p.time.gan}${p.time.zhi}`;
    return `${p.year.gan}${p.year.zhi} ${p.month.gan}${p.month.zhi} ${p.day.gan}${p.day.zhi} ${time}`;
  } catch {
    return '未记';
  }
}

function toEngineMember(m, R) {
  return { role: m.role === 'center' ? 'sibling' : m.role, label: m.label, R, hourUnknown: !!m.hourUnknown };
}

export function splitAn(an) {
  const members = an.members || [];
  const centerRow = members.find((m) => m.role === 'center') || members[0];
  const others = members.filter((m) => m !== centerRow && m.role !== 'center');
  return { centerRow, others };
}

export function runCluster(an, hourOverrides = {}) {
  const { centerRow, others } = splitAn(an);
  if (!centerRow) return null;
  const centerR = buildPersonR(centerRow, hourOverrides[centerRow.id]);
  const engineMembers = others.map((m) => {
    const role = m.role === 'center' ? 'sibling' : m.role;
    return { role, label: m.label, R: buildPersonR(m, hourOverrides[m.id]), hourUnknown: !!m.hourUnknown };
  });
  const family = analyzeFamily({ R: centerR, label: centerRow.label || 'Chủ thể' }, engineMembers);
  return {
    family,
    centerRow,
    others,
    radial: radialData(family),
    matrix: matrixData(family),
    radar: radarData(family),
    evidence: [
      { id: centerRow.id, role: 'center', label: centerRow.label, hourUnknown: !!centerRow.hourUnknown, pillars: pillarLine(centerR.chart.pillars) },
      ...others.map((m, i) => ({
        id: m.id,
        role: m.role,
        label: m.label,
        hourUnknown: !!m.hourUnknown,
        pillars: pillarLine(engineMembers[i].R.chart.pillars),
      })),
    ],
  };
}

/**
 * Quét đủ 12 时辰 — cùng điểm family.score + childBoost như family-rectify.js.
 * Trả về cả 12 hàng (engine gốc chỉ slice top 5).
 */
export function rectifyHourStudio(center, member, otherMembers = []) {
  const candidates = [];
  for (const hour of HOURS) {
    const R = buildPersonR(member, hour);
    const members = [toEngineMember(member, R), ...otherMembers.map((o) => toEngineMember(o, buildPersonR(o)))];
    const fam = analyzeFamily(center, members);
    let childBoost = 0;
    const childPair = fam.pairs.find((p) => p.role === 'child');
    if (childPair) childBoost = (childPair.pair.axes.reciprocity.score - 50) * 0.2;
    const score = Math.round(fam.score + childBoost);
    candidates.push({
      hour,
      zhi: ZHI_BY_HOUR[hour],
      zhiVi: ZHI[ZHI_BY_HOUR[hour]].vi,
      familyScore: fam.score,
      score,
      delta: 0,
    });
  }
  candidates.sort((a, b) => b.score - a.score);
  const top = candidates[0].score;
  candidates.forEach((c) => { c.delta = c.score - top; });
  const best = candidates[0];
  const second = candidates[1];
  const gap = best.score - (second ? second.score : 0);
  const clear = gap >= 4;
  const verdict = clear
    ? `Giờ ${best.zhiVi} (${best.hour}h) cho điểm nhất quán cụm cao nhất (${best.score}), hơn giờ nhì ${gap} điểm.`
    : `Nhiều giờ cho điểm gần nhau (top ${best.score}, nhì ${second ? second.score : '?'}). Cần thêm người thân hoặc sự kiện để tách.`;
  return { candidates, best, verdict, clear };
}

export function runRectify(an) {
  const { centerRow, others } = splitAn(an);
  if (!centerRow) return { cluster: null, scans: [] };
  const unknown = [centerRow, ...others].filter((m) => m.hourUnknown);
  const knownOthers = others.filter((m) => !m.hourUnknown);
  const centerR = buildPersonR(centerRow);
  const center = { R: centerR, label: centerRow.label || 'Chủ thể' };
  const scans = [];
  for (const member of unknown) {
    if (member === centerRow) {
      // Chủ thể giờ chưa rõ: lấy người thân đầu làm tâm tạm để quét — vẫn cùng analyzeFamily.
      const pivot = others[0];
      if (!pivot) continue;
      const pivotCenter = { R: buildPersonR(pivot), label: pivot.label };
      const rest = others.filter((o) => o !== pivot).concat([]);
      const result = rectifyHourStudio(pivotCenter, member, rest);
      scans.push({ member, ...result });
    } else {
      const rest = knownOthers.filter((o) => o !== member);
      const result = rectifyHourStudio(center, member, rest);
      scans.push({ member, ...result });
    }
  }
  const overrides = {};
  for (const s of scans) overrides[s.member.id] = s.best.hour;
  const cluster = runCluster(an, overrides);
  return { cluster, scans, overrides };
}
