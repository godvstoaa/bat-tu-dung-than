// ============================================================================
//  Gọi Web Worker sinh thủ tục (gen.worker.js). Không có Worker / Worker lỗi (trình duyệt cũ,
//  thiếu OffscreenCanvas…) → tự chạy tại chỗ trên luồng chính, kết quả y hệt.
// ============================================================================
import { DataUtils } from 'three';
import { groundLayersData, paveData, waterNormalData, setGenerator } from './ground-tex.js';
import { chunkData, treeList, depthData, flowData } from './terrain-mesh.js';

const LOCAL = {
  ground: ([S]) => groundLayersData(S),
  pave: ([o]) => paveData(o),
  water: ([S]) => waterNormalData(S),
  chunk: ([cx, cz, seg]) => chunkData(cx, cz, seg),
  trees: () => treeList(),
  depth: ([DEP]) => ({ data: depthData(DEP, DataUtils.toHalfFloat), DEP }),
  flow: ([N]) => ({ data: flowData(N), N }),
};

let worker = null, broken = typeof Worker === 'undefined';
let seq = 0;
const waiting = new Map();

function getWorker() {
  if (broken) return null;
  if (!worker) {
    try {
      worker = new Worker(new URL('./gen.worker.js', import.meta.url), { type: 'module' });
      worker.onmessage = (e) => {
        const { id, res, err } = e.data, w = waiting.get(id);
        if (!w) return;
        waiting.delete(id);
        if (err) { console.warn('[gen] worker lỗi, chạy tại chỗ:', w.op, err); w.resolve(LOCAL[w.op](w.args)); } else w.resolve(res);
      };
      worker.onerror = (e) => {
        console.warn('[gen] worker hỏng, chuyển về luồng chính:', e.message || e);
        broken = true; worker = null;
        for (const [, w] of waiting) w.resolve(LOCAL[w.op](w.args));
        waiting.clear();
      };
    } catch (e) { broken = true; worker = null; }
  }
  return worker;
}

/** gen('chunk', cx, cz, seg) → Promise<kết quả> */
export function gen(op, ...args) {
  const w = getWorker();
  if (!w) return new Promise((r) => setTimeout(() => r(LOCAL[op](args)), 0));
  return new Promise((resolve) => {
    const id = ++seq;
    waiting.set(id, { resolve, op, args });
    w.postMessage({ id, op, args });
  });
}
export const genBusy = () => waiting.size;

// vật liệu đá (ground-tex.js › stoneMaterial) sinh kết cấu qua Worker
setGenerator((op, o) => gen(op, o));
