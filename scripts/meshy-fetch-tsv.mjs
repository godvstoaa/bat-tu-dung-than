// Tải GLB thư viện cộng đồng Meshy (CC0) theo danh sách TSV: nhóm \t id \t task \t url
// facade → assets-meshy/library/bq/<id>.glb · prop → assets-meshy/library/pr/<id>.glb
import fs from 'node:fs';
const file = process.argv[2];
const rows = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).map((l) => l.split('\t'));
let i = 0;
async function worker() {
  while (i < rows.length) {
    const [grp, id, , url] = rows[i++];
    const f = `assets-meshy/library/${grp === 'facade' ? 'bq' : 'pr'}/${id}.glb`;
    if (fs.existsSync(f) && fs.statSync(f).size > 1000) { console.log('= ' + id); continue; }
    const r = await fetch(url); if (!r.ok) { console.log('✗ ' + id + ' ' + r.status); continue; }
    const b = Buffer.from(await r.arrayBuffer()); fs.writeFileSync(f, b); console.log(`✓ ${id} ${(b.length / 1048576).toFixed(1)} MB`);
  }
}
await Promise.all([worker(), worker(), worker(), worker()]);
