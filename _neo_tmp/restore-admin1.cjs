// restore-admin.cjs — phục hồi toàn bộ fix admin.js bị mất (revert về bản gốc)
// Idempotent: mỗi bước check marker trước khi áp.
const fs = require('fs');
let s = fs.readFileSync('worker/admin.js', 'utf8');
let n = 0;
const rep = (marker, block, tag) => {
  if (s.includes(marker) && !s.includes(block.slice(0, 60))) { s = s.replace(marker, block); n++; }
  else if (!s.includes(marker)) console.log('MISS marker:', tag);
};

// A. _S 16000 + neoConflicts cap
rep("if (k === 'response' || k === 'q' || k === 'text' || k === 'question') out[k] = _S(v, 4000);",
    "if (k === 'response' || k === 'q' || k === 'text' || k === 'question') out[k] = _S(v, 16000); // [FIX] 4000→16000: log ĐỦ câu trả lời AI dài, không cắt giữa chừng", 'A1');
rep(`    } else if (Array.isArray(v)) {
      out[k] = v.slice(0, 20).map((x) => (typeof x === 'string' ? _S(x, 300) : x));`,
    `    } else if (Array.isArray(v)) {
      if (k === 'neoConflicts') out[k] = v.slice(0, 10).map((x) => { try { return _S(JSON.stringify(x), 200); } catch (e) { return '{}'; } }); // [NEO] conflict objects stringify gọn
      else out[k] = v.slice(0, 20).map((x) => (typeof x === 'string' ? _S(x, 300) : x));`, 'A2');

// B. adminStats perf — parallel reads + get helper + eventsLite slice 200
rep(`  const ai = await isAiEnabled(env);
  const logRaw = env.ADMIN_KV ? await env.ADMIN_KV.get('events:log') : null;`,
    `  // [PERF FIX] đọc song song isAiEnabled + events:log
  const [ai, logRaw] = await Promise.all([
    isAiEnabled(env),
    env.ADMIN_KV ? env.ADMIN_KV.get('events:log') : Promise.resolve(null),
  ]);`, 'B1');
rep(`  const get = async (k) => parseInt((await env.ADMIN_KV.get(k)) || '0', 10);
  const totals = { visit: await get('cnt:visit'), chart: await get('cnt:chart'), ai_question: await get('cnt:ai_question'), ai_chat: await get('cnt:ai_chat'), error: await get('cnt:error'), all: await get('cnt:all') };`,
    `  // [PERF FIX] đọc 6 counters song song + get helper cho free/feedback (500 fix)
  const _cnt = env.ADMIN_KV ? await Promise.all([
    env.ADMIN_KV.get('cnt:visit'), env.ADMIN_KV.get('cnt:chart'), env.ADMIN_KV.get('cnt:ai_question'),
    env.ADMIN_KV.get('cnt:ai_chat'), env.ADMIN_KV.get('cnt:error'), env.ADMIN_KV.get('cnt:all'),
  ]) : [null,null,null,null,null,null];
  const totals = { visit: parseInt(_cnt[0]||'0',10), chart: parseInt(_cnt[1]||'0',10), ai_question: parseInt(_cnt[2]||'0',10), ai_chat: parseInt(_cnt[3]||'0',10), error: parseInt(_cnt[4]||'0',10), all: parseInt(_cnt[5]||'0',10) };
  const get = async (k) => parseInt((env.ADMIN_KV ? await env.ADMIN_KV.get(k) : null) || '0', 10);`, 'B2');
rep('  const eventsLite = events.map(function (e) { var c = { ts: e.ts, type: e.type, ip: e.ip, country: e.country, city: e.city, data: e.data }; return c; });',
    `  // [PERF FIX] chỉ gửi 200 sự kiện gần nhất — giữ NGUYÊN response đầy đủ trong mỗi ai_chat.
  const eventsLite = events.slice(0, 200).map(function (e) {
    return { ts: e.ts, type: e.type, ip: e.ip, country: e.country, city: e.city, data: e.data || {} };
  });`, 'B3');

// C. /api/neo-stats route (trước api/ai POST)
if (!s.includes("'api/neo-stats'")) {
  const marker = "    if (path === apDash + 'api/ai' && method === 'POST') return adminToggleAi(env, request);";
  const block = `    // [NEO-CHECKER] admin xem neo accuracy stats — aggregate từ events:log (+ baseline KV)
    if (path === apDash + 'api/neo-stats' && method === 'GET') {
      try {
        const logRaw = env.ADMIN_KV ? await env.ADMIN_KV.get('events:log') : null;
        let baseline = null;
        try { const bRaw = env.ADMIN_KV ? await env.ADMIN_KV.get('neo:baseline') : null; if (bRaw) baseline = JSON.parse(bRaw); } catch (e) {}
        let events = []; try { events = logRaw ? JSON.parse(logRaw) : []; } catch (e) {}
        const chats = events.filter((e) => e.type === 'ai_chat' && e.data && e.data.source === 'ai' && e.data.neoScore != null);
        const scored = chats.map((e) => ({ ts: e.ts, ip: e.ip, score: e.data.neoScore, redFlag: e.data.neoHasRedFlag, q: (e.data.q || '').slice(0, 100), conflicts: e.data.neoConflicts || [], checked: e.data.neoChecked || 0 }));
        const scores = scored.map((x) => x.score).filter((x) => x != null);
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
        const dist = { ge90: scores.filter((x) => x >= 90).length, '70_89': scores.filter((x) => x >= 70 && x < 90).length, lt70: scores.filter((x) => x < 70).length };
        const redFlags = scored.filter((x) => x.redFlag);
        const now = Date.now(); const trend = [];
        for (let i = 6; i >= 0; i--) { const dStart = now - i * 86400000; const dEnd = dStart - 86400000; const dayScores = scored.filter((x) => x.ts <= dStart && x.ts > dEnd).map((x) => x.score); trend.push({ day: new Date(dStart).toISOString().slice(0, 10), avg: dayScores.length ? Math.round(dayScores.reduce((a, b) => a + b, 0) / dayScores.length) : null, count: dayScores.length }); }
        const confTypes = {};
        for (const x of scored) for (const c of x.conflicts) { try { const co = typeof c === 'string' ? JSON.parse(c) : c; if (co && co.type) confTypes[co.type] = (confTypes[co.type] || 0) + 1; } catch (e) {} }
        return json({ totalScored: scored.length, avgScore: avg, distribution: dist, redFlagCount: redFlags.length, trend, conflictTypes: confTypes, recentConflicts: scored.filter((x) => x.conflicts.length).slice(0, 20), baseline: baseline });
      } catch (e) { return json({ error: e.message }, 500); }
    }
` + marker;
  if (s.includes(marker)) { s = s.replace(marker, block); n++; } else console.log('MISS marker: C');
}

fs.writeFileSync('worker/admin.js', s);
console.log('admin phase 1 applied:', n);
