// ============================================================================
//  ECONOMY — Durable Object duy nhất («economy») giữ sổ kinh tế Phần II cho mọi shard: kho đồ & độ tươi (P8),
//  sản xuất + chợ ký gửi + Thương hội (P9), bếp & bếp trưởng (P10), mặt bằng / nhà hàng (P11), hộ tịch (P12),
//  thầy mệnh lý + trọng tài (P13). Toàn bộ luật ở src/game/econ-core.js (cùng mã chạy trong test và client ngoại tuyến).
//  TownShard gọi call(op, u, args, ctx) qua RPC; worker/npc-chat.js dùng memGet / memPut (trí nhớ NPC §8.3).
//  Trọng tài lớp 1 (LLM) dùng chung đường gọi mô hình với NPC chat (worker/llm.js).
//  migration economy-v1 (wrangler.jsonc). Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §19.
// ============================================================================
import { DurableObject } from 'cloudflare:workers';
import { EconEngine } from '../src/game/econ-core.js';
import { llmChat } from './llm.js';

export class Economy extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.e = new EconEngine(ctx.storage, { judge: async (messages) => { const r = await llmChat(env, messages, { maxTokens: 300, json: true }); return r.ok ? r.text : ''; } });
  }
  call(op, u, args, ctx = {}) { return this.e.call(op, u, args || {}, { uid: ctx.uid || null, name: ctx.name || '', admin: !!ctx.admin }); }
  // --- trí nhớ NPC (§8.3): { aff (−100..100), ev: [≤ 5 câu ≤ 120 ký tự], last } ---
  async memGet(u, npc) { return (await this.ctx.storage.get(`mem:${u}:${npc}`)) || { aff: 0, ev: [], last: 0 }; }
  async memPut(u, npc, mem) {
    const m = { aff: Math.max(-100, Math.min(100, Math.round(Number(mem?.aff) || 0))), ev: (Array.isArray(mem?.ev) ? mem.ev : []).map((x) => String(x).slice(0, 120)).slice(-5), last: Date.now() };
    await this.ctx.storage.put(`mem:${u}:${npc}`, m); return m;
  }
  /** sự kiện game ghi thẳng vào trí nhớ NPC (không qua LLM — đáng tin) */
  async memEvent(u, npc, text, affDelta = 0) { const m = await this.memGet(u, npc); m.ev = [...m.ev, String(text).slice(0, 120)].slice(-5); m.aff += affDelta; return this.memPut(u, npc, m); }
}
