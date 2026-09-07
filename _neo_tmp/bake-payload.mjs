// bake-off payload: dựng body JSON đúng cấu trúc askAI (system prompt + brief + guide + style + question)
import fs from 'fs';
import { analyze } from '../src/engine/chart.js';
import { SYSTEM_PROMPT, buildChartBrief, STYLE_DIRECTIVES } from '../src/engine/ai.js';

// brief guide + anti-manip: lấy nội bộ qua buildChartBrief là đủ (guide/anti-manip nằm trong module —
// không export riêng; dùng xấp xỉ: brief + style. Để công bằng cho cả 2 model, cùng payload là OK.)
const R = analyze(1990, 6, 15, 10, 0, 'nam');
const brief = buildChartBrief(R);
const question = 'Tổng luận mệnh cách của tôi theo cổ pháp Tử Bình: nêu rõ thân vượng/nhược (3 pháp đắc lệnh/địa/thế), Dụng Thần được chọn theo phương pháp nào (điều hậu hay phù ức — vì sao), cách cục thành hay bại, và 2 tổ hợp thập thần nổi bật nhất. Luận có trích dẫn cổ bản.';

const messages = [
  { role: 'system', content: SYSTEM_PROMPT },
  { role: 'system', content: brief },
  { role: 'system', content: STYLE_DIRECTIVES['chuyen-gia'] + '\n\n⚠ REMEMBER THIS STYLE WHEN ANSWERING.' },
  { role: 'user', content: question },
];

for (const model of ['glm-5.3-flash', 'glm-5.3', 'glm-5.2']) {
  fs.writeFileSync(`_neo_tmp/bo-${model}.json`, JSON.stringify({
    model, messages, stream: false, max_tokens: 4000, thinking: { type: 'enabled' },
  }));
}
fs.writeFileSync('_neo_tmp/bo-brief.txt', brief);
console.log('payloads written. brief length:', brief.length, 'chars');
