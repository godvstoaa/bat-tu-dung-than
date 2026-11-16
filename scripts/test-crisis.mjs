// Test cổng khủng hoảng (VC-035) — docs/GAME-SUA-LOI-MANIFEST.md §3 K1; luật: docs/npc-ai/11, docs/game/40 §40.4.
//   ① bộ phân loại: mức A, C, câu thường, câu phóng đại đời thường, gõ không dấu;
//   ② văn bản cố định: chỉ số 115 / 113 / 111, rời vai đúng một câu, cờ phiên 30 phút;
//   ③ askAI: câu tín hiệu → source 'crisis', KHÔNG gọi mạng;
//   ④ máy chủ /api/npc/chat: câu tín hiệu → trả khối hỗ trợ, không gọi mô hình;
//   ⑤ tốc độ: dưới 1 ms mỗi câu.
// Chạy: node scripts/test-crisis.mjs
import assert from 'node:assert/strict';
import { crisisCheck, crisisBlock, foldVi, crisisText, crisisReply, CRISIS_BLOCK_A, CRISIS_BLOCK_C, crisisActive, setCrisisFlag, CRISIS_FLAG_MS } from '../src/engine/crisis.js';

let passed = 0;
const test = async (name, fn) => {
  try { await fn(); passed++; console.log('✓', name); }
  catch (e) { console.error('✗', name, '\n ', e.stack.split('\n').slice(0, 4).join('\n ')); process.exitCode = 1; }
};

const A = ['Tôi muốn chết', 'toi muon chet', 'con muốn tự tử', 'tu tu di cho xong', 'không muốn sống nữa', 'sống làm gì nữa', 'Bị chồng đánh dọa giết',
  'nó dọa giết tôi', 'tôi định nhảy cầu', 'muốn uống thuốc ngủ cho chết', 'cắt tay', 'chết quách cho xong', 'I want to die', 'thinking about suicide'];
const C = ['đau ngực khó thở quá', 'bà tôi bị co giật', 'chảy máu nhiều lắm', 'tôi bị ngất xỉu', 'kho tho qua'];
const OK = ['Thầy xem giúp con năm nay tài vận', 'số này giá bao nhiêu', 'từ từ đã thầy', 'thôi từ từ', 'đói muốn chết rồi', 'cười muốn chết',
  'ngất ngây con gà tây', 'học cắt tóc', 'con bị điểm kém', 'Nhà con hướng nào tốt', 'sư phụ cho hỏi', ''];

await test('① mức A: ý định tự hại, bạo hành đang xảy ra (có dấu, không dấu, tiếng Anh)', () => { for (const s of A) assert.equal(crisisCheck(s), 'A', s); });
await test('① mức C: y tế cấp', () => { for (const s of C) assert.equal(crisisCheck(s), 'C', s); });
await test('① câu thường và câu phóng đại đời thường đi qua', () => { for (const s of OK) assert.equal(crisisCheck(s), null, JSON.stringify(s)); });
await test('① A thắng C khi một câu có cả hai', () => assert.equal(crisisCheck('đau ngực quá, muốn chết luôn'), 'A'));

await test('① mức B (đáng lo, không chặn): mệt mỏi, không ai cần, mất người thân, chết cũng được', () => {
  for (const s of ['Con mệt mỏi quá, không ai cần con', 'Con mất mẹ tuần trước', 'Vô thường thì chết cũng được', 'Con không muốn đi lên nữa', 'Hôm nay con buồn quá thầy ạ']) assert.equal(crisisCheck(s), 'B', s);
  for (const s of ['Con mệt mỏi quá', 'Con mất mẹ tuần trước']) assert.equal(crisisBlock(s), null, 'mức B không chặn lượt: ' + s);
});
await test('① bộ thử đỏ 06-13 nhóm C: mọi câu P0 bị chặn ở cả dạng có dấu và bỏ dấu; mức khớp bộ đề trừ C14 (ngoại lệ truyện kể — cố ý không làm)', async () => {
  const { loadSet } = await import('./eval-persona.mjs');
  const C = loadSet().filter((r) => r.group === 'C');
  assert.equal(C.length, 20);
  for (const r of C.filter((x) => x.level === 'P0')) { assert.ok(crisisCheck(r.text), r.id + ' có dấu'); assert.ok(crisisCheck(foldVi(r.text)), r.id + ' bỏ dấu'); }
  for (const r of C) {
    const want = /^A\b/.test(r.expect) ? 'A' : /^B\b/.test(r.expect) ? 'B' : /^C\b/.test(r.expect) ? 'C' : null;
    if (want && r.id !== 'C14') assert.equal(crisisCheck(r.text), want, `${r.id}: ${r.text}`);
  }
  for (const r of loadSet().filter((x) => x.group === 'M')) assert.equal(crisisBlock(r.text), null, 'nhóm M phải trả lời bình thường: ' + r.id);
});

await test('② khối hỗ trợ chỉ nêu 115, 113, 111; khối C đúng một dòng', () => {
  const nums = [...CRISIS_BLOCK_A.matchAll(/\b1\d\d\b/g)].map((m) => m[0]);
  assert.deepEqual([...new Set(nums)].sort(), ['111', '113', '115']);
  assert.equal(CRISIS_BLOCK_C.split('\n').length, 1);
  assert.ok(CRISIS_BLOCK_C.includes('115'));
});
await test('② rời vai đúng một câu; persona lạ dùng câu chung', () => {
  for (const id of ['thay_tubinh', 'dan_dinh', 'phuong_si', 'khong_co', null]) {
    const { line } = crisisReply('A', id);
    assert.equal((line.match(/[.!?](\s|$)/g) || []).length, 1, `${id}: ${line}`);
  }
  assert.ok(crisisText('C').endsWith(CRISIS_BLOCK_C));
});
await test('② cờ phiên 30 phút', () => {
  const mem = new Map();
  globalThis.localStorage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };
  setCrisisFlag('A', 1000);
  assert.equal(crisisActive(1000 + CRISIS_FLAG_MS - 1), true);
  assert.equal(crisisActive(1000 + CRISIS_FLAG_MS + 1), false);
  delete globalThis.localStorage;
});

await test('③ askAI: câu tín hiệu → source crisis, KHÔNG gọi mạng, kể cả khi đã cấu hình AI', async () => {
  const { askAI } = await import('../src/engine/ai.js');
  const { analyze } = await import('../src/engine/chart.js');
  const R = analyze(1990, 5, 15, 8, 30, 'nam', 2026);
  let calls = 0; const _f = globalThis.fetch;
  globalThis.fetch = async () => { calls++; throw new Error('khong-duoc-goi-mang'); };
  try {
    const out = await askAI('Thầy ơi con muốn chết', R, { enabled: true, endpoint: '/zai/api/paas/v4', model: 'glm-5.3', apiKey: '', preset: 'zai-proxy' }, { persona: 'thay_tubinh' });
    assert.equal(out.source, 'crisis'); assert.equal(calls, 0, 'không lời gọi mạng nào');
    assert.ok(out.text.includes('115') && out.text.startsWith('Con ơi, thầy gác bút'));
  } finally { globalThis.fetch = _f; }
});

await test('④ /api/npc/chat: câu tín hiệu → khối hỗ trợ, không gọi mô hình, không cần đăng nhập', async () => {
  const { handleNpcChat } = await import('../worker/npc-chat.js');
  let calls = 0; const _f = globalThis.fetch;
  globalThis.fetch = async () => { calls++; throw new Error('khong-duoc-goi-mang'); };
  try {
    const req = new Request('https://x/api/npc/chat', { method: 'POST', body: JSON.stringify({ npc: { id: 'chu_tiem', name: 'Chủ tiệm' }, text: 'tôi không muốn sống nữa' }), headers: { 'Content-Type': 'application/json' } });
    const r = await (await handleNpcChat(req, {})).json();
    assert.equal(r.fallback, 'crisis'); assert.equal(r.crisis, 'A'); assert.ok(r.text.includes('115')); assert.equal(calls, 0);
  } finally { globalThis.fetch = _f; }
});

await test('⑤ dưới 1 ms mỗi câu (câu 300 ký tự)', () => {
  const s = 'Thầy ơi cho con hỏi năm nay công việc của con thế nào, có nên đổi việc không, con đang phân vân lắm. '.repeat(3).slice(0, 300);
  const t0 = performance.now(); for (let i = 0; i < 2000; i++) crisisCheck(s);
  const ms = (performance.now() - t0) / 2000; assert.ok(ms < 1, `${ms} ms`);
});

console.log(`\nCổng khủng hoảng — ${passed} test đạt${process.exitCode ? ' (CÓ FAIL)' : ''}.`);
