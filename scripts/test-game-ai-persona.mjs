// Test G1 — nạp persona vào chuỗi AI của Thầy (docs/npc-ai/15-lo-trinh-tich-hop.md §15.6):
//   ① flag FEATURES.personaAi TẮT mặc định → KHÔNG có system message persona (hành vi
//     Thầy không đổi); ② flag BẬT + 'thay_tubinh' → persona message chèn ĐÚNG VỊ TRÍ
//   giữa ② brief+anti-manip và ③ style (docs/npc-ai/04 §4.4.2 — an toàn > persona >
//   style); ③ flag BẬT + 2 persona khác nhau → cache key khác nhau (§15.6b); ④ id lạ
//   → fallback im lặng như không có persona; ⑤ 'lama_dakiet' → KHÔNG nạp (getPersona
//   fail-closed runtime:false từ G0).
// Node thuần, KHÔNG endpoint AI thật: chặn globalThis.fetch, bắt body request —
//   messages là mảng THẬT askAI dựng; fetch ném lỗi mạng → askAI rơi localFallback
//   (K1/K2: game vẫn trả lời khi AI/ch mạng chết). Khuôn scripts/test-game-thay-mo-rong.mjs.
// Chạy: node scripts/test-game-ai-persona.mjs
import assert from 'node:assert/strict';
import { FEATURES } from '../src/game/features.js';
import { getPersona, personaSystemPrompt } from '../src/game/npc-personas.js';
import { analyze } from '../src/engine/chart.js';
import { askAI, _briefCacheKey } from '../src/engine/ai.js';

let passed = 0;
// Async-aware theo khuôn test-game-thay-mo-rong.mjs (askAI là async; dùng top-level await)
const test = async (name, fn) => {
  try { await fn(); passed++; console.log('✓', name); }
  catch (e) { console.error('✗', name, '\n ', e.stack.split('\n').slice(0, 4).join('\n ')); process.exitCode = 1; }
};

const R = analyze(1990, 5, 15, 8, 30, 'nam', 2026);
const CFG = { enabled: true, endpoint: '/zai/api/paas/v4', model: 'glm-5.3', apiKey: '', preset: 'zai-proxy' }; // proxy «/» → isAIReady true, không đòi key

// Bắt mảng messages askAI dựng thật: stub fetch thu body rồi ném lỗi mạng (không khớp
// pattern retry /Failed to fetch|NetworkError|Load failed/ → không đợi 800ms retry);
// askAI leo thang → localFallback → trả {source:'local'} — streamRound có finally clearTimeout nên node không treo.
async function captureMessages(opts = {}, question = 'Tổng quan lá số của tôi ra sao?') {
  const bodies = [];
  const _fetch = globalThis.fetch;
  globalThis.fetch = async (_url, init = {}) => {
    try { bodies.push(JSON.parse(init.body)); } catch (_) {}
    throw new Error('test-khong-mang');
  };
  try {
    const out = await askAI(question, R, CFG, opts);
    return { bodies, out };
  } finally {
    globalThis.fetch = _fetch;
  }
}
const sysCount = (msgs) => msgs.filter((m) => m.role === 'system').length;
const findPersona = (msgs, name) => msgs.findIndex((m) => m.role === 'system' && m.content.includes(`== NHÂN VẬT: ${name} ==`));

// ------------------------------------------------- ① Flag TẮT (mặc định) -----
await test('flag mặc định TẮT: FEATURES.personaAi === false (khuôn features.js), node = web (ai bật)', () => {
  assert.equal(FEATURES.personaAi, false, 'flag persona phải TẮT mặc định — gate eval chưa chạy');
  assert.equal(FEATURES.ai, true, 'node không phải ios → AI gốc vẫn bật như web');
});

await test('flag TẮT + vẫn truyền persona → KHÔNG có system message persona; mạng chết → localFallback êm (K1/K2)', async () => {
  const { bodies, out } = await captureMessages({ persona: 'thay_tubinh' });
  assert.ok(bodies.length >= 1, 'phải có ít nhất 1 request được dựng');
  assert.equal(out.source, 'local', 'fetch chết → localFallback, không crash');
  const msgs = bodies[0].messages;
  assert.equal(sysCount(msgs), 3, 'đúng 3 system message như chuỗi gốc (không thêm lớp persona)');
  assert.equal(findPersona(msgs, 'Thầy Tử Bình'), -1, 'không message nào mang nội dung persona');
  assert.ok(msgs[0].content.length > 100 && msgs[1].content.includes('CHỐNG ĐÁNH LỪA') && /REMEMBER THIS STYLE/.test(msgs[2].content), '3 system gốc: SYSTEM_PROMPT / brief+anti-manip / style');
});

await test('flag TẮT + R.npcPersona (kênh 15 §15.6a) → cũng bị flag chặn — Thầy vô danh nguyên trạng', async () => {
  const R2 = { ...R, npcPersona: 'thay_tubinh' };
  const _fetch = globalThis.fetch;
  const bodies = [];
  globalThis.fetch = async (_u, init = {}) => { try { bodies.push(JSON.parse(init.body)); } catch (_) {} throw new Error('test-khong-mang'); };
  try { await askAI('Tổng quan lá số?', R2, CFG, {}); } finally { globalThis.fetch = _fetch; }
  assert.equal(sysCount(bodies[0].messages), 3);
});

// ------------------------------------- ② Flag BẬT + đúng vị trí chèn (§4.4.2) -----
await test('flag BẬT + persona "thay_tubinh" → system message persona ĐÚNG VỊ TRÍ giữa ② anti-manip và ③ style', async () => {
  FEATURES.personaAi = true;
  try {
    const { bodies } = await captureMessages({ persona: 'thay_tubinh' });
    const msgs = bodies[0].messages;
    const i = findPersona(msgs, 'Thầy Tử Bình');
    assert.ok(i >= 0, 'phải có system message persona Thầy Tử Bình');
    assert.equal(i, 2, 'index 2: sau ① SYSTEM_PROMPT + ② brief/anti-manip, trước ③ style (history rỗng)');
    assert.ok(msgs[i - 1].content.includes('CHỐNG ĐÁNH LỪA'), 'trước persona là ② brief+guide+anti-manip (an toàn đứng TRÊN persona)');
    assert.ok(/REMEMBER THIS STYLE/.test(msgs[i + 1].content), 'sau persona là ③ style (style đứng DƯỚI persona)');
    assert.equal(msgs[i].content, personaSystemPrompt(getPersona('thay_tubinh'), R), 'nội dung đúng personaSystemPrompt(persona, R) — PERSONA-CHUNG trước biến thể');
    assert.equal(sysCount(msgs), 4, 'giờ có 4 system message');
    assert.equal(msgs[0].role, 'system', '① SYSTEM_PROMPT không đụng');
    assert.ok(msgs[msgs.length - 1].role === 'user', 'câu hỏi user vẫn cuối mảng');
  } finally { FEATURES.personaAi = false; }
});

await test('flag BẬT + R.npcPersona (kênh 15 §15.6a, không qua option) → persona vẫn chèn đúng vị trí', async () => {
  FEATURES.personaAi = true;
  try {
    const R2 = { ...R, npcPersona: 'thay_tubinh' };
    const _fetch = globalThis.fetch;
    const bodies = [];
    globalThis.fetch = async (_u, init = {}) => { try { bodies.push(JSON.parse(init.body)); } catch (_) {} throw new Error('test-khong-mang'); };
    try { await askAI('Tổng quan lá số?', R2, CFG, {}); } finally { globalThis.fetch = _fetch; }
    assert.equal(findPersona(bodies[0].messages, 'Thầy Tử Bình'), 2);
  } finally { FEATURES.personaAi = false; }
});

await test('flag BẬT + KHÔNG truyền persona → Thầy vô danh nguyên trạng (spread rỗng)', async () => {
  FEATURES.personaAi = true;
  try {
    const { bodies } = await captureMessages({});
    assert.equal(sysCount(bodies[0].messages), 3, 'không persona → đúng 3 system như trước G1');
  } finally { FEATURES.personaAi = false; }
});

// --------------------------------------- ③ Cache key phân nhánh theo persona -----
await test('flag BẬT + 2 persona khác nhau → cache key khác nhau; không persona → key giữ khuôn cũ', () => {
  const k0 = _briefCacheKey(R, undefined);
  const k1 = _briefCacheKey(R, 'thay_tubinh');
  const k2 = _briefCacheKey(R, 'van_coc');
  assert.notEqual(k1, k2, 'hai persona phải ra hai key khác nhau (không trộn brief giữa các persona)');
  assert.ok(k1.endsWith('|persona:thay_tubinh') && k2.endsWith('|persona:van_coc'), 'id persona nằm trong key');
  assert.ok(!k0.includes('|persona:'), 'không persona → KHÔNG suffix');
  assert.match(k0, /^1990-5-15-8-30-nam-\d{4}-\d+-\d+-$/, 'phần nền key giữ nguyên khuôn cũ (năm-tháng-ngày-giờ-phút sinh-giới tính-ngày hiện tại-family)');
  assert.ok(k1.startsWith(k0), 'key persona = khuôn cũ + suffix → cache cũ (không persona) không bị địch oan');
});

// ------------------------------------- ④ id lạ → fallback im lặng, không crash -----
await test('flag BẬT + id persona không tồn tại → im lặng như không có persona (không crash)', async () => {
  FEATURES.personaAi = true;
  try {
    const { bodies, out } = await captureMessages({ persona: 'id_khong_ton_tai_xyz' });
    assert.equal(out.source, 'local', 'vẫn trả lời cục bộ êm — không ném lỗi ra caller');
    assert.equal(sysCount(bodies[0].messages), 3);
    assert.equal(findPersona(bodies[0].messages, 'Thầy Tử Bình'), -1);
  } finally { FEATURES.personaAi = false; }
});

// ------------------------------ ⑤ lama_dakiet → KHÔNG nạp (fail-closed từ G0) -----
await test('flag BẬT + "lama_dakiet" → KHÔNG nạp (getPersona fail-closed runtime:false; cả đường truyền object)', async () => {
  assert.equal(getPersona('lama_dakiet'), null, 'G0 đã fail-closed: getPersona từ chối lama_dakiet khi chưa bật flag tôn giáo');
  FEATURES.personaAi = true;
  try {
    const viaId = await captureMessages({ persona: 'lama_dakiet' });
    assert.equal(sysCount(viaId.bodies[0].messages), 3, 'qua id → không có message persona');
    const { PERSONA_LAMA_DAKIET } = await import('../src/game/persona-data.js');
    assert.equal(PERSONA_LAMA_DAKIET.runtime, false, 'dữ liệu G0: lama_dakiet đánh dấu runtime:false');
    const viaObj = await captureMessages({ persona: PERSONA_LAMA_DAKIET }); // truyền thẳng object cũng phải bị chặn
    assert.equal(sysCount(viaObj.bodies[0].messages), 3, 'qua object runtime:false → ai.js vẫn từ chối (fail-closed 2 lớp)');
  } finally { FEATURES.personaAi = false; }
});

await test('hậu kiểm: flag đã trả về TẮT sau mọi test (mặc định an toàn)', () => {
  assert.equal(FEATURES.personaAi, false);
});

console.log(`\nG1 AI-Persona — ${passed} test đạt${process.exitCode ? ' (CÓ FAIL)' : ''}.`);
