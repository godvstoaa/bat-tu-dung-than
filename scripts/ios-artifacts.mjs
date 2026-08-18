// ============================================================================
//  ios-artifacts.mjs — helper xoá/assert artifact cho bản iOS.
//  LƯU Ý Windows/Node: fs.rmSync đôi khi im lặng không xoá; dùng unlink/rmdir recursive.
// ============================================================================
import fs from 'fs';
import path from 'path';

export const IOS_PRUNE = [
  'review',
  'review-shots',
  'review-evidence.html',
  'downloads',
  'robots.txt',
  '_headers',
  'kinh',
  'sitemap-kinh.xml',
];

/** Xóa đệ quy — không dựa vào fs.rmSync trên Windows. */
export function rmrf(target) {
  if (!fs.existsSync(target)) return false;
  const st = fs.lstatSync(target);
  if (st.isDirectory()) {
    for (const name of fs.readdirSync(target)) rmrf(path.join(target, name));
    fs.rmdirSync(target);
  } else {
    fs.unlinkSync(target);
  }
  return true;
}

export function pruneIosArtifacts(outDir) {
  const removed = [];
  for (const name of IOS_PRUNE) {
    const p = path.join(outDir, name);
    if (fs.existsSync(p)) {
      rmrf(p);
      if (!fs.existsSync(p)) removed.push(name);
      else throw new Error(`[ios-artifacts] không xoá được: ${p}`);
    }
  }
  return removed;
}

export function assertNoPruned(outDir) {
  const leftover = IOS_PRUNE.filter((n) => fs.existsSync(path.join(outDir, n)));
  if (leftover.length) throw new Error(`[ios-artifacts] còn artifact cấm: ${leftover.join(', ')}`);
}

export function dirSizeMB(dir) {
  let sum = 0;
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else sum += fs.statSync(p).size;
    }
  };
  walk(dir);
  return +(sum / (1024 * 1024)).toFixed(2);
}
