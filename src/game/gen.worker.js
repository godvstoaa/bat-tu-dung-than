// ============================================================================
//  HUYỀN GIỚI — Web Worker sinh thủ tục: kết cấu mặt đất, phiến đá lát, lưới địa hình,
//  vị trí cây, bản đồ độ sâu nước. Chạy song song → luồng chính (vẽ khung hình) không bị chặn.
//  Giao thức: { id, op, args } → { id, res } | { id, err }. Mảng số trả về bằng chuyển giao (transfer).
// ============================================================================
import { DataUtils } from 'three';
import { groundLayersData, paveData, waterNormalData } from './ground-tex.js';
import { chunkData, treeList, depthData, flowData } from './terrain-mesh.js';

const OPS = {
  ground: ([S]) => groundLayersData(S),
  pave: ([o]) => paveData(o),
  water: ([S]) => waterNormalData(S),
  chunk: ([cx, cz, seg]) => chunkData(cx, cz, seg),
  trees: () => treeList(),
  depth: ([DEP]) => ({ data: depthData(DEP, DataUtils.toHalfFloat), DEP }),
  flow: ([N]) => ({ data: flowData(N), N }),
};

function buffers(res, out = []) {
  if (!res || typeof res !== 'object') return out;
  if (ArrayBuffer.isView(res)) { out.push(res.buffer); return out; }
  for (const v of Object.values(res)) if (ArrayBuffer.isView(v)) out.push(v.buffer);
  return out;
}

self.onmessage = (e) => {
  const { id, op, args } = e.data;
  try {
    const res = OPS[op](args || []);
    self.postMessage({ id, res }, buffers(res));
  } catch (err) {
    self.postMessage({ id, err: String(err?.message || err) });
  }
};
