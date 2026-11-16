// Test AI của game chỉ dùng glm-5.3-flash (quyết định chủ dự án 2026-11-16) — src/game/ai-model.js,
// worker/llm.js › llmBackends, cổng persona gắn theo mô hình (features.js › gamePersona).
// Node thuần. Chạy: node scripts/test-game-ai-model.mjs
import assert from 'node:assert/strict';
import { GAME_AI_MODEL, ZAI_DEFAULT_MODEL, pickZaiModel, gameModelOnly, gameAiConfig, PERSONA_GATE, personaGatePassed } from '../src/game/ai-model.js';
import { llmBackends } from '../worker/llm.js';
import { FEATURES } from '../src/game/features.js';
import { isAIReady } from '../src/engine/ai.js';

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.stack.split('\n').slice(0, 4).join('\n ')); process.exitCode = 1; } };

test('Mô hình game là glm-5.3-flash', () => assert.equal(GAME_AI_MODEL, 'glm-5.3-flash'));

test('Khung thầy bói: luôn proxy /zai + GAME_AI_MODEL, bỏ khoá và mô hình riêng của người dùng, giữ công tắc bật/tắt', () => {
  const c = gameAiConfig({ enabled: true, endpoint: 'https://api.openai.com/v1', model: 'gpt-4o-mini', apiKey: 'sk-x', preset: 'openai' });
  assert.equal(c.model, GAME_AI_MODEL);
  assert.equal(c.endpoint, '/zai/api/paas/v4');
  assert.equal(c.apiKey, '', 'không gửi khoá của người dùng sang proxy');
  assert.ok(isAIReady(c), 'proxy cùng-origin → sẵn sàng không cần khoá');
  assert.equal(gameAiConfig({ enabled: false }).enabled, false, 'người dùng tắt AI thì game cũng tắt');
  assert.equal(gameAiConfig().enabled, true);
});

test('Proxy /zai: tôn trọng mô hình trong danh sách, còn lại về mặc định của app; game chỉ chạy flash', () => {
  assert.equal(pickZaiModel('glm-5.3-flash'), 'glm-5.3-flash');
  assert.equal(pickZaiModel('glm-5.3'), 'glm-5.3');
  assert.equal(pickZaiModel('gpt-4o'), ZAI_DEFAULT_MODEL, 'mô hình lạ không được đi qua khoá máy chủ');
  assert.equal(pickZaiModel(undefined), ZAI_DEFAULT_MODEL);
  assert.equal(gameModelOnly('glm-5.3-flash'), true, 'game xin flash → không rơi sang pool mô hình khác');
  assert.equal(gameModelOnly('glm-5.3'), false, 'app giữ pool dự phòng như cũ');
});

test('NPC chat + giám khảo (worker/llm.js): mọi đường gọi đều là glm-5.3-flash, pool chỉ nhận mục cùng mô hình', () => {
  const b = llmBackends({ apiKey: 'a', model: 'glm-5.3', zaiKey: 'z', freePool: [
    { endpoint: 'https://x/v1', model: 'llama-3.3-70b', apiKey: 'p1' },
    { endpoint: 'https://y/v1/', model: 'z-ai/glm-5.3-flash', apiKey: 'p2' },
  ] }, true);
  assert.equal(b.length, 3, 'z.ai admin + Coding + đúng 1 mục pool chạy flash');
  for (const x of b) assert.match(x.model, /(^|\/)glm-5\.3-flash$/, `đường gọi ${x.endpoint} chạy ${x.model}`);
  assert.equal(b[2].endpoint, 'https://y/v1');
  assert.equal(llmBackends({ apiKey: 'a', freePool: [{ endpoint: 'https://y', model: 'glm-5.3-flash', apiKey: 'p' }] }, false).length, 1, 'tắt model free → không dùng pool');
  assert.deepEqual(llmBackends({}, true), []);
});

test('Cổng persona gắn theo mô hình: chỉ mô hình đã chứng nhận mới bật gamePersona', () => {
  assert.equal(personaGatePassed(PERSONA_GATE.model), true);
  assert.equal(personaGatePassed('mô-hình-khác'), false, 'mô hình chưa qua cổng không được tính đạt');
  assert.equal(FEATURES.gamePersona, personaGatePassed(GAME_AI_MODEL), 'cờ đi theo kết quả cổng của đúng mô hình game');
  if (PERSONA_GATE.model !== GAME_AI_MODEL) assert.equal(FEATURES.gamePersona, false, 'đổi mô hình mà chưa chạy lại cổng → không bật giọng persona');
});

console.log(`\nai-model — ${passed} test đạt${process.exitCode ? ' (CÓ FAIL)' : ''}.`);
