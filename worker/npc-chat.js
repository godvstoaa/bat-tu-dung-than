// ============================================================================
//  /api/npc/chat — NPC hội thoại bằng LLM (P6). Đặc tả §8.
//  Cần đăng nhập; hạn mức 30 câu thường + 10 câu nghiệp vụ / ngày / tài khoản; câu xã giao cache theo (NPC, ý định, bậc thiện cảm).
//  LLM chỉ đề xuất hành động — src/game/npc-chat-core.js › validateActions kẹp theo luật kinh tế; trí nhớ NPC ở Economy DO.
//  Không gửi ngày sinh / email / tên thật lên mô hình (client chỉ gửi tên nhân vật + hành Dụng / Hỷ / Kỵ). AI tắt → câu dự phòng.
// ============================================================================
import * as NC from '../src/game/npc-chat-core.js';
import { getPersona, personaSystemPrompt } from '../src/game/npc-personas.js';
import { llmChat } from './llm.js';
import { sessionOf } from './auth.js';
import { stableId, accountPid } from '../src/game/auth-core.js';

const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const vnDay = () => new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
const NPC_ID = /^[a-z0-9_:-]{2,40}$/;

export async function handleNpcChat(request, env) {
  if (request.method !== 'POST') return json({ ok: false, err: 'method' }, 405);
  const s = await sessionOf(request, env);
  let b = {};
  try { b = await request.json(); } catch (e) { return json({ ok: false, err: 'bad' }, 400); }
  const npc = b.npc && typeof b.npc === 'object' ? b.npc : {};
  if (!NPC_ID.test(String(npc.id || ''))) return json({ ok: false, err: 'bad' }, 400);
  const inp = NC.cleanInput(b.text);
  const name = String(npc.name || 'Chủ tiệm').slice(0, 30);
  const { intent, biz } = inp.ok ? NC.route(inp.text) : { intent: 'chat', biz: false };
  const fb = (why) => json({ ok: true, text: NC.fallback({ name }, intent, Date.now() / 1000), actions: [], fallback: why });
  if (!inp.ok) return json({ ok: true, text: inp.err === 'rude' ? `${name} nhíu mày: «Ăn nói cho phải phép.»` : '…', actions: [], fallback: inp.err });
  if (!s) return fb('login');                                // khách: câu mẫu G2 (không gọi mô hình)
  const uid = s.uid, day = vnDay();
  // hạn mức theo ngày
  const qk = `npcq:${uid}:${day}`, q = env.ADMIN_KV ? JSON.parse((await env.ADMIN_KV.get(qk)) || '{"chat":0,"biz":0}') : { chat: 0, biz: 0 };
  const kind = biz ? 'biz' : 'chat';
  if (q[kind] >= NC.QUOTA[kind]) return fb('quota');
  // trí nhớ (Economy DO)
  const econ = env.ECONOMY ? env.ECONOMY.get(env.ECONOMY.idFromName('economy')) : null;
  const u = await stableId(accountPid(uid)); // = a.u của TownShard → cùng hồ sơ với Guild / Economy
  const mem = econ ? await econ.memGet(u, npc.id) : { aff: 0, ev: [] };
  // cache câu xã giao
  const ck = NC.cacheKey(npc.id, intent, mem.aff);
  if (NC.cacheable(intent) && env.ADMIN_KV) {
    const hit = await env.ADMIN_KV.get(ck);
    if (hit) { if (econ) await econ.memPut(u, npc.id, { ...mem, aff: NC.affAfter(mem.aff, intent) }); return json({ ok: true, text: hit, actions: [], cached: true }); }
  }
  const ctx = b.ctx && typeof b.ctx === 'object' ? b.ctx : {};
  const persona = npc.persona && getPersona(String(npc.persona)) ? personaSystemPrompt(getPersona(String(npc.persona)), { soChu: 60 }) : '';
  const shop = npc.shop && Array.isArray(npc.shop.items) ? { items: npc.shop.items.slice(0, 16).map((i) => ({ id: String(i.id).slice(0, 24), name: String(i.name).slice(0, 30), price: Math.max(0, Number(i.price) || 0) })) } : null;
  const hiring = npc.hiring && typeof npc.hiring.job === 'string' ? { job: npc.hiring.job.slice(0, 30) } : null;
  const quest = ctx.quest && typeof ctx.quest.id === 'string' ? { id: ctx.quest.id.slice(0, 24), hint: String(ctx.quest.hint || '').slice(0, 160) } : null;
  const safeCtx = {
    name: String(ctx.name || '').slice(0, 24), place: String(ctx.place || '').slice(0, 40), hour: Number.isInteger(ctx.hour) ? ctx.hour : null,
    ganzhi: String(ctx.ganzhi || '').slice(0, 12), weather: String(ctx.weather || '').slice(0, 16), job: String(ctx.job || '').slice(0, 24),
    level: Math.max(1, Math.min(99, ctx.level | 0)), wealth: Math.max(0, Math.min(4, ctx.wealth | 0)), quest,
    yong: ctx.yong && typeof ctx.yong === 'object' ? { primary: String(ctx.yong.primary || '').slice(0, 1), accent: String(ctx.yong.accent || '').slice(0, 1), ji: String(ctx.yong.ji || '').slice(0, 1) } : null,
  };
  const r = await llmChat(env, NC.buildMessages({ id: npc.id, name, role: String(npc.role || '').slice(0, 60), persona, shop, hiring }, mem, safeCtx, inp.text, { biz }), { maxTokens: biz ? 260 : 160, json: biz });
  if (!r.ok) return fb(r.err);
  const rep = NC.parseReply(r.text, biz), out = NC.filterOutput(rep.say);
  const actions = out.blocked ? [] : NC.validateActions(rep.actions, { items: shop?.items || [], hiring, rep: Math.max(0, Math.min(100, ctx.rep ?? 50)), aff: mem.aff, questId: quest?.id || null });
  q[kind] += 1; if (env.ADMIN_KV) await env.ADMIN_KV.put(qk, JSON.stringify(q), { expirationTtl: 2 * 86400 });
  if (NC.cacheable(intent) && !out.blocked && env.ADMIN_KV) await env.ADMIN_KV.put(ck, out.text, { expirationTtl: 86400 });
  if (econ) {
    const ev = actions.length ? [...mem.ev, `${day}: ${actions.map((a) => a.tool === 'quote_price' ? `báo giá ${a.name} ${a.price} đồng` : a.tool === 'offer_job' ? 'mời làm công' : a.tool === 'extend_credit' ? `cho chịu ${a.amount} đồng` : 'gợi ý việc mệnh').join(', ')}`] : mem.ev;
    await econ.memPut(u, npc.id, { aff: NC.affAfter(mem.aff, intent), ev });
  }
  return json({ ok: true, text: NC.reconcile(out.text, actions), actions: actions.map(({ asked, ...a }) => a), left: { chat: NC.QUOTA.chat - q.chat, biz: NC.QUOTA.biz - q.biz } });
}
