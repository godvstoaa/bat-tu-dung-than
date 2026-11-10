// ============================================================================
//  GỌI LLM PHÍA MÁY CHỦ (không stream) — dùng cho NPC chat (§8) và trọng tài thầy mệnh lý (§14.4).
//  Cùng cấu hình «AI Config» của admin (ADMIN_KV ai:config): khoá z.ai trả phí trước, pool miễn phí làm dự phòng.
//  Tôn trọng công tắc tắt AI / tắt model free của admin. Không bao giờ trả khoá về client.
// ============================================================================
import { isAiEnabled, isFreeAiEnabled } from './admin.js';

export async function llmChat(env, messages, { maxTokens = 220, json = false, timeoutMs = 20000 } = {}) {
  if (!env.ADMIN_KV) return { ok: false, err: 'no_kv' };
  if (!(await isAiEnabled(env))) return { ok: false, err: 'ai_off' };
  let cfg = {};
  try { cfg = JSON.parse((await env.ADMIN_KV.get('ai:config')) || '{}'); } catch (e) { cfg = {}; }
  const backends = [];
  if (cfg.apiKey) backends.push({ endpoint: 'https://api.z.ai/api/paas/v4', model: cfg.model || 'glm-5.3', apiKey: cfg.apiKey });
  if (cfg.zaiKey) backends.push({ endpoint: 'https://api.z.ai/api/coding/paas/v4', model: 'glm-5.3', apiKey: cfg.zaiKey });
  if (await isFreeAiEnabled(env)) for (const p of Array.isArray(cfg.freePool) ? cfg.freePool : []) if (p?.apiKey && p.endpoint && p.model) backends.push({ endpoint: String(p.endpoint).replace(/\/$/, ''), model: String(p.model), apiKey: String(p.apiKey) });
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
