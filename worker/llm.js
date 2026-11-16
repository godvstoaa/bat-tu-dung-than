// ============================================================================
//  GỌI LLM PHÍA MÁY CHỦ (không stream) — dùng cho NPC chat (§8) và trọng tài thầy mệnh lý (§14.4).
//  Cùng cấu hình «AI Config» của admin (ADMIN_KV ai:config): khoá z.ai trả phí trước, pool miễn phí làm dự phòng.
//  Tôn trọng công tắc tắt AI / tắt model free của admin. Không bao giờ trả khoá về client.
// ============================================================================
import { isAiEnabled, isFreeAiEnabled } from './admin.js';
import { GAME_AI_MODEL } from '../src/game/ai-model.js';

// Đếm lượt gọi mô hình theo ngày và theo đường gọi (npc / judge) — để đo chi phí (VC-021).
// Ghi vào cùng bản ghi dayagg:<ngày> mà bảng quản trị đang đọc; lỗi ghi thì bỏ qua, không chặn lượt.
async function countLlm(env, tag, ok) {
  try {
    const day = new Date().toISOString().slice(0, 10), k = 'dayagg:' + day;
    let agg = {}; try { agg = JSON.parse((await env.ADMIN_KV.get(k)) || '{}'); } catch (e) { agg = {}; }
    agg[`llm_${tag}_calls`] = (agg[`llm_${tag}_calls`] || 0) + 1;
    if (!ok) agg[`llm_${tag}_err`] = (agg[`llm_${tag}_err`] || 0) + 1;
    await env.ADMIN_KV.put(k, JSON.stringify(agg), { expirationTtl: 60 * 60 * 24 * 90 });
  } catch (e) { /* đo lường không được làm hỏng lượt chơi */ }
}

export async function llmChat(env, messages, opts = {}) {
  const r = await llmChatRaw(env, messages, opts);
  if (env.ADMIN_KV && r.err !== 'ai_off' && r.err !== 'no_kv') await countLlm(env, opts.tag || 'npc', r.ok);
  return r;
}

async function llmChatRaw(env, messages, { maxTokens = 220, json = false, timeoutMs = 20000 } = {}) {
  if (!env.ADMIN_KV) return { ok: false, err: 'no_kv' };
  if (!(await isAiEnabled(env))) return { ok: false, err: 'ai_off' };
  let cfg = {};
  try { cfg = JSON.parse((await env.ADMIN_KV.get('ai:config')) || '{}'); } catch (e) { cfg = {}; }
  return tryBackends(llmBackends(cfg, await isFreeAiEnabled(env)), messages, { maxTokens, json, timeoutMs });
}

/** Các đường gọi theo thứ tự thử. Game chỉ dùng GAME_AI_MODEL (glm-5.3-flash, quyết định 16/11): khoá z.ai của
 *  admin trước, khoá gói Coding sau; pool miễn phí chỉ dùng mục nào chạy đúng mô hình đó (không rơi sang mô hình khác). */
export function llmBackends(cfg = {}, freeOn = false) {
  const backends = [];
  if (cfg.apiKey) backends.push({ endpoint: 'https://api.z.ai/api/paas/v4', model: GAME_AI_MODEL, apiKey: cfg.apiKey });
  if (cfg.zaiKey) backends.push({ endpoint: 'https://api.z.ai/api/coding/paas/v4', model: GAME_AI_MODEL, apiKey: cfg.zaiKey });
  if (freeOn) for (const p of Array.isArray(cfg.freePool) ? cfg.freePool : []) if (p?.apiKey && p.endpoint && String(p.model).replace(/^.*\//, '') === GAME_AI_MODEL) backends.push({ endpoint: String(p.endpoint).replace(/\/$/, ''), model: String(p.model), apiKey: String(p.apiKey) });
  return backends;
}

async function tryBackends(backends, messages, { maxTokens, json, timeoutMs }) {
  for (const b of backends) {
    const ac = new AbortController(), timer = setTimeout(() => ac.abort(), timeoutMs);
    try {
      const body = { model: b.model, messages, max_tokens: maxTokens, temperature: json ? 0.2 : 0.8, stream: false };
      if (/z\.ai/.test(b.endpoint)) body.thinking = { type: 'disabled' };
      const res = await fetch(`${b.endpoint}/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${b.apiKey}` }, body: JSON.stringify(body), signal: ac.signal });
      clearTimeout(timer);
      if (!res.ok) continue;
      const j = await res.json();
      const text = j?.choices?.[0]?.message?.content;
      if (typeof text === 'string' && text.trim()) return { ok: true, text: text.trim(), usage: j.usage || null };
    } catch (e) { clearTimeout(timer); }
  }
  return { ok: false, err: 'llm_failed' };
}
