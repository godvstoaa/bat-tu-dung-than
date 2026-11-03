// ============================================================================
//  Tạo tài sản 3D bằng Meshy.ai — docs/DAI-THE-GIOI-DESIGN.md §B3.
//  Khoá: MESHY_API_KEY trong .env.meshy (git bỏ qua). KHÔNG đưa khoá vào bundle game.
//
//  node scripts/meshy-gen.mjs balance
//  node scripts/meshy-gen.mjs preview <id…|all>    tạo mô hình thô (20 credit/cái)
//  node scripts/meshy-gen.mjs status                 xem trạng thái + tải thumbnail
//  node scripts/meshy-gen.mjs refine <id…|all>      phủ texture PBR (10 credit/cái) — chỉ cái đã duyệt
//  node scripts/meshy-gen.mjs download <id…|all>    tải GLB về assets-meshy/raw/
//  node scripts/meshy-gen.mjs reject <id> "lý do"    đánh dấu bỏ, cho phép preview lại
//  node scripts/meshy-gen.mjs rig <id…|all>         gắn xương nhân vật (5 credit) — cần refine xong
//  node scripts/meshy-gen.mjs animate <id…|all>     gộp các động tác trong manifest vào 1 GLB (3 credit/động tác)
//
//  Mọi task_id ghi ngay vào assets-meshy/state.json → chạy lại không tạo trùng (không mất credit).
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'assets-meshy');
const STATE = path.join(DIR, 'state.json');
const API = 'https://api.meshy.ai';

function key() {
  if (process.env.MESHY_API_KEY) return process.env.MESHY_API_KEY;
  const f = path.join(ROOT, '.env.meshy');
  const m = fs.existsSync(f) && /MESHY_API_KEY=(\S+)/.exec(fs.readFileSync(f, 'utf8'));
  if (!m) throw new Error('Thiếu MESHY_API_KEY (.env.meshy)');
  return m[1];
}
const manifest = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8'));
const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {};
const save = () => fs.writeFileSync(STATE, JSON.stringify(state, null, 2));

async function api(method, url, body) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(API + url, { method, headers: { Authorization: `Bearer ${key()}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    if (res.status === 429) { await new Promise((r) => setTimeout(r, 5000 * (attempt + 1))); continue; }
    const text = await res.text();
    if (!res.ok) throw new Error(`${method} ${url} → ${res.status} ${text.slice(0, 300)}`);
    return text ? JSON.parse(text) : {};
  }
  throw new Error('429 lặp lại');
}

const pick = (ids) => (ids.length === 0 || ids[0] === 'all' ? manifest.assets : manifest.assets.filter((a) => ids.includes(a.id)));
const fullPrompt = (a) => (a.style === false ? a.prompt : `${a.prompt}. ${manifest.style}`); // tượng thần: không ghép kinh phong cách chung (có dòng «no religious statues»)

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`tải ${url.slice(0, 60)} → ${res.status}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

async function preview(ids) {
  for (const a of pick(ids)) {
    const s = (state[a.id] ||= {});
    if (s.preview && !s.rejected) { console.log(`= ${a.id}: đã có preview ${s.preview}`); continue; }
    const prompt = fullPrompt(a);
    if (prompt.length > 800) throw new Error(`${a.id}: prompt ${prompt.length} > 800 ký tự`);
    const body = {
      mode: 'preview', prompt, ai_model: a.model || 'meshy-7.1', should_remesh: true, topology: 'triangle',
      target_polycount: a.poly, target_formats: ['glb'], origin_at: 'bottom',
      ...(a.kind === 'character' ? { pose_mode: 'a-pose' } : {}),
      ...(a.hd ? { geometry_resolution: '4k' } : {}), // công trình «trùm»: hình học 4K (+5 credit)
    };
    const r = await api('POST', '/openapi/v2/text-to-3d', body);
    if (s.preview) (s.history ||= []).push({ preview: s.preview, rejected: s.rejected });
    Object.assign(s, { preview: r.result, rejected: null, refine: null, at: Date.now() });
    save();
    console.log(`+ ${a.id}: preview ${r.result}`);
  }
}

async function status() {
  for (const a of manifest.assets) {
    const s = state[a.id];
    if (!s?.preview) { console.log(`· ${a.id}: chưa tạo`); continue; }
    for (const stage of ['preview', 'refine']) {
      if (!s[stage]) continue;
      const t = await api('GET', `/openapi/v2/text-to-3d/${s[stage]}`);
      s[`${stage}Status`] = t.status;
      s[`${stage}Credits`] = t.consumed_credits;
      if (t.status === 'SUCCEEDED') {
        s[`${stage}Glb`] = t.model_urls?.glb;
        const thumb = path.join(DIR, 'thumbs', `${a.id}.${stage}.png`);
        if (t.thumbnail_url && !fs.existsSync(thumb)) await download(t.thumbnail_url, thumb);
      }
      if (t.status === 'FAILED') s[`${stage}Error`] = t.task_error?.message || 'FAILED';
      console.log(`${t.status === 'SUCCEEDED' ? '✓' : t.status === 'FAILED' ? '✗' : '…'} ${a.id} ${stage}: ${t.status} ${t.progress ?? ''}%${s.rejected ? ' (BỎ: ' + s.rejected + ')' : ''}`);
    }
  }
  save();
}

async function refine(ids) {
  for (const a of pick(ids)) {
    const s = state[a.id];
    if (!s?.preview || s.previewStatus !== 'SUCCEEDED') { console.log(`- ${a.id}: preview chưa xong`); continue; }
    if (s.rejected) { console.log(`- ${a.id}: đã bỏ (${s.rejected})`); continue; }
    if (s.refine) { console.log(`= ${a.id}: đã refine ${s.refine}`); continue; }
    const r = await api('POST', '/openapi/v2/text-to-3d', {
      mode: 'refine', preview_task_id: s.preview, enable_pbr: true, texture_resolution: a.hd ? '4k' : '2k',
      texture_prompt: fullPrompt(a), target_formats: ['glb'], origin_at: 'bottom',
    });
    s.refine = r.result; save();
    console.log(`+ ${a.id}: refine ${r.result}`);
  }
}

async function downloadGlb(ids) {
  for (const a of pick(ids)) {
    const s = state[a.id];
    if (a.kind === 'character') { console.log(`- ${a.id}: nhân vật → dùng lệnh animate (GLB có xương + động tác)`); continue; }
    const url = s?.refineGlb || null;
    if (!url) { console.log(`- ${a.id}: chưa có GLB refine`); continue; }
    const file = path.join(DIR, 'raw', `${a.id}.glb`);
    await download(url, file);
    console.log(`↓ ${a.id}: ${(fs.statSync(file).size / 1048576).toFixed(1)} MB`);
  }
}

async function rig(ids) {
  for (const a of pick(ids).filter((x) => x.kind === 'character')) {
    const s = state[a.id];
    if (s?.refineStatus !== 'SUCCEEDED') { console.log(`- ${a.id}: refine chưa xong`); continue; }
    if (s.rig) { console.log(`= ${a.id}: đã rig ${s.rig}`); continue; }
    const r = await api('POST', '/openapi/v1/rigging', { input_task_id: s.refine, height_meters: a.height || 1.7 });
    s.rig = r.result; save(); console.log(`+ ${a.id}: rig ${r.result}`);
  }
}

async function animate(ids) {
  for (const a of pick(ids).filter((x) => x.kind === 'character')) {
    const s = state[a.id];
    if (!s?.rig) { console.log(`- ${a.id}: chưa rig`); continue; }
    const rt = await api('GET', `/openapi/v1/rigging/${s.rig}`);
    s.rigStatus = rt.status; save();
    if (rt.status !== 'SUCCEEDED') { console.log(`… ${a.id}: rig ${rt.status} ${rt.progress ?? ''}%`); continue; }
    if (s.anim) {
      const t = await api('GET', `/openapi/v1/animations/${s.anim}`);
      s.animStatus = t.status; s.animGlb = t.result?.animation_glb_url || null; save();
      console.log(`${t.status === 'SUCCEEDED' ? '✓' : '…'} ${a.id}: animation ${t.status} ${t.progress ?? ''}%`);
      if (t.status === 'SUCCEEDED') { const file = path.join(DIR, 'raw', `${a.id}.glb`); await download(s.animGlb, file); console.log(`↓ ${a.id}: ${(fs.statSync(file).size / 1048576).toFixed(1)} MB`); }
      continue;
    }
    const r = await api('POST', '/openapi/v1/animations', { rig_task_id: s.rig, action_ids: a.anims });
    s.anim = r.result; save(); console.log(`+ ${a.id}: animation ${r.result} (${a.anims.length} động tác)`);
  }
}

const [cmd, ...args] = process.argv.slice(2);
try {
  if (cmd === 'balance') console.log(await api('GET', '/openapi/v1/balance'));
  else if (cmd === 'preview') await preview(args);
  else if (cmd === 'status') await status();
  else if (cmd === 'refine') await refine(args);
  else if (cmd === 'download') await downloadGlb(args);
  else if (cmd === 'rig') await rig(args);
  else if (cmd === 'animate') await animate(args);
  else if (cmd === 'reject') { (state[args[0]] ||= {}).rejected = args[1] || 'không đạt'; save(); console.log('đã đánh dấu bỏ', args[0]); }
  else console.log('Lệnh: balance | preview | status | refine | download | reject');
} catch (e) { console.error('✗', e.message); process.exit(1); }
