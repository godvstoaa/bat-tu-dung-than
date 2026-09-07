// restore-admin1b.cjs — phase 1 các bước miss do CRLF: normalize \r\n → \n trước khi so
const fs = require('fs');
let s = fs.readFileSync('worker/admin.js', 'utf8').replace(/\r\n/g, '\n');
let n = 0;
const rep = (marker, block, tag) => {
  if (s.includes(marker)) { if (!s.includes(block.slice(0, 80))) { s = s.replace(marker, block); n++; } else console.log('already:', tag); }
  else console.log('MISS:', tag);
};

rep(`    } else if (Array.isArray(v)) {
      out[k] = v.slice(0, 20).map((x) => (typeof x === 'string' ? _S(x, 300) : x));`,
    `    } else if (Array.isArray(v)) {
      if (k === 'neoConflicts') out[k] = v.slice(0, 10).map((x) => { try { return _S(JSON.stringify(x), 200); } catch (e) { return '{}'; } }); // [NEO] conflict objects stringify gọn
      else out[k] = v.slice(0, 20).map((x) => (typeof x === 'string' ? _S(x, 300) : x));`, 'A2');

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

fs.writeFileSync('worker/admin.js', s);
console.log('phase 1b applied:', n);
