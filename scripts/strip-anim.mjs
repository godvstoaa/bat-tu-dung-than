// Cắt animation khỏi GLB rigged (giữ mesh + skin ở bind pose) — chuẩn bị cho pack prop tĩnh
// Dùng cho model CC0 tải từ thư viện Meshy có rig: node scripts/strip-anim.mjs <in.glb> <out.glb>
import { NodeIO } from '@gltf-transform/core';

const [inp, outp] = process.argv.slice(2);
if (!inp || !outp) { console.error('Cần: node scripts/strip-anim.mjs <in.glb> <out.glb>'); process.exit(2); }
const io = new NodeIO();
const doc = await io.read(inp);
const root = doc.getRoot();
const anims = root.listAnimations();
for (const a of anims) a.dispose();
await io.write(outp, doc);
console.log('OK — đã cắt', anims.length, 'animation →', outp);
