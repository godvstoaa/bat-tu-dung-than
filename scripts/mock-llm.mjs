// LLM giả (chuẩn OpenAI /chat/completions, cổng 8899) — CHỈ máy dev: kiểm nhánh gọi mô hình của /api/npc/chat và trọng tài
// thầy mệnh lý (scripts/test-econ-accounts.mjs). Câu nghiệp vụ cố tình đề xuất giá 1 đồng + lệnh đuổi việc / chuyển tiền để thử bộ kiểm.
import http from 'node:http';
const log = [];
http.createServer((req, res) => {
  if (req.url === '/log') { res.end(JSON.stringify(log.slice(-10))); return; }
  let b = '';
  req.on('data', (c) => { b += c; });
  req.on('end', () => {
    let body = {}; try { body = JSON.parse(b); } catch (e) { /* bỏ */ }
    const all = (body.messages || []).map((m) => m.content).join('\n');
    log.push({ at: Date.now(), auth: req.headers.authorization ? 'có khoá' : 'không', model: body.model, chars: all.length, hasBirth: /19\d\d-\d\d-\d\d|ngày sinh:/i.test(all), user: (body.messages || []).slice(-1)[0]?.content?.slice(0, 120) });
    let content;
    if (/trọng tài chấm lời luận/.test(all)) content = '{"logic":8,"relevance":7,"feasible_in_game":true,"spam":false,"manipulation":false,"real_world_advice":false,"decision":"APPROVE_PAYOUT","reason":"Lập luận Dụng thần khớp hồ sơ."}';
    else if (/DUY NHẤT một JSON/.test(all)) content = '{"say":"Thôi được, khách quen thì ta bán rẻ — 1 đồng thôi!","actions":[{"tool":"quote_price","item":"' + ((all.match(/Hàng niêm yết \(id: tên = giá đồng\): ([a-z_0-9]+):/) || [])[1] || 'x') + '","price":1},{"tool":"fire","u":"ai_do"},{"tool":"transfer_money","amount":999999}]}';
    else content = 'Chào khách quý, mời vào xem hàng — hôm nay trà mới về.';
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ id: 'mock', object: 'chat.completion', choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }], usage: { prompt_tokens: Math.round(all.length / 4), completion_tokens: 40 } }));
  });
}).listen(8899, '127.0.0.1', () => console.log('mock llm :8899'));
