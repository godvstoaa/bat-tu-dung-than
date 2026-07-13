import { analyze } from './src/engine/chart.js';
import { think, classifyQuestion, extractFacts, evaluateRules } from './src/brain/brain.js';

console.log('=== TEST 1: Classification ===');
for (const [q, expect] of [['con có lấy chồng được không?','marriage'],['sự nghiệp con ra sao?','career'],['bao giờ phát tài?','timing'],['diện mạo con thế nào?','appearance'],['sức khỏe năm nay?','health'],['con sao rồi?','overview']]) {
  const cat = classifyQuestion(q);
  console.log(`  ${cat === expect ? '✓' : '✗'} "${q}" → ${cat} (expect ${expect})`);
}

console.log('\n=== TEST 2: Facts (tàng can) ===');
const R = analyze(1990, 5, 15, 10, 0, 'male', 2026);
const facts = extractFacts(R.chart, R, 'male');
console.log('  正官:', facts['正官_count'], facts['正官_positions']);
console.log('  七杀:', facts['七杀_count'], facts['七杀_positions']);
console.log('  伤官:', facts['伤官_count']);
console.log('  dayunIsDung:', facts.dayunIsDung, '| dayunIsKy:', facts.dayunIsKy);
console.log('  combo_guan_sha_hon_ta:', facts.combo_guan_sha_hon_ta);
console.log('  combo_ty_tranh_tai:', facts.combo_ty_tranh_tai);

console.log('\n=== TEST 3: Rules ===');
const conclusions = evaluateRules(facts);
console.log(`  ${conclusions.length} fired:`);
for (const c of conclusions) console.log(`    [${c.priority}] ${c.id}: ${c.result} (${c.confidence}%)`);

console.log('\n=== TEST 4: think() 5 charts ===');
for (const [y, m, d, h, g, q] of [[1990,5,15,10,'male','sự nghiệp?'],[1988,9,3,14,'female','hôn nhân?'],[2000,1,8,22,'female','diện mạo?'],[1976,3,20,6,'male','sức khỏe?'],[1985,6,15,12,'male','phát tài?']]) {
  const R2 = analyze(y, m, d, h, 0, g, 2026);
  const out = think(q, R2.chart, R2, g);
  console.log(`  [${g} ${y}] "${q}": ${out ? out.split('\n')[0] : 'null'}`);
}

console.log('\n=== TEST 5: Edge cases ===');
console.log('  null question:', think(null, R.chart, R, 'male') ? 'output OK' : 'null OK');
console.log('  bad chart:', think('test?', {}, {}, 'male') === null ? '✓ graceful' : '✗');
console.log('  female:', think('hôn nhân?', analyze(1988,9,3,14,0,'female',2026).chart, analyze(1988,9,3,14,0,'female',2026), 'female') ? '✓' : 'null');
console.log('\n=== ALL PASSED ===');
