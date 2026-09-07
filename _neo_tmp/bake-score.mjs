// bake-off scoring: neo-check 3 model trên cùng brief + thống kê trích dẫn cổ bản
import fs from 'fs';
import { checkNeo } from '../src/engine/neo-checker.js';

const brief = fs.readFileSync('_neo_tmp/bo-brief.txt', 'utf8');
const models = [
  ['glm-5.3', 'ans-53.txt', 132.1],
  ['glm-5.3-flash', 'ans-flash.txt', 180.8],
  ['glm-5.2', 'ans-52.txt', 87.3],
];
console.log('Câu hỏi: tổng luận mệnh cách + vượng suy 3 pháp + dụng thần (điều hậu/fù ức) + cách cục + tổ hợp, có trích dẫn cổ bản\n');
for (const [m, f, t] of models) {
  const ans = fs.readFileSync('_neo_tmp/' + f, 'utf8');
  const neo = checkNeo(ans, brief);
  // đếm trích dẫn cổ bản xuất hiện trong câu trả lời
  const cites = ['穷通宝鉴','子平真诠','三命通会','渊海子平','命理约言','调候','月令'].filter(k => ans.includes(k));
  const hasVuongSuy = /đắc lệnh|đắc địa|đắc thế|3 pháp|3 pháp/.test(ans);
  const hasToHop = /tổ hợp|Thương Quan|Sát Ấn|Thực Thần|Kiếp Tài/.test(ans);
  console.log('══ ' + m + ' ══');
  console.log('  Neo score:', neo.score + '%', '| mốc kiểm:', neo.totalChecked, '| conflicts:', neo.conflicts.length, neo.hasRedFlag ? '🔴 RED FLAG' : '✓');
  if (neo.conflicts.length) neo.conflicts.forEach(c => console.log('    • [' + c.type + '] «' + c.said + '» vs «' + c.brief + '»'));
  console.log('  Độ sâu: ' + ans.length + ' chars | trích dẫn cổ bản:', cites.length ? cites.join(', ') : 'KHÔNG CÓ ❌');
  console.log('  Có vượng suy 3 pháp:', hasVuongSuy ? '✓' : '❌', '| có tổ hợp thập thần:', hasToHop ? '✓' : '❌');
  console.log('  Thời gian (1 run):', t + 's');
}
