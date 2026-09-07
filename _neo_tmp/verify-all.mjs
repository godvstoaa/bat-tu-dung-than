// [VERIFY-ALL-FIXES] kiểm tra toàn bộ 19 nhóm fix trong lịch sử chat còn nguyên không
// (tránh bash escaping — chạy trực tiếp: node _neo_tmp/verify-all.mjs)
import fs from 'fs';
const read = (p) => { try { return fs.readFileSync(p, 'utf8'); } catch (e) { return null; } };
const main = read('src/main.js') || '';
const ai = read('src/engine/ai.js') || '';
const admin = read('worker/admin.js') || '';
const worker = read('worker/index.js') || '';
const pkg = read('package.json') || '';
const cap = read('capacitor.config.json') || '';
const sw = read('public/sw.js') || '';
const seo = read('scripts/build-seo-pages.mjs') || '';
const neo = read('src/engine/neo-checker.js');
const D = '$'; // tránh mọi vấn đề escaping

const checks = [
  ['1a. main.js log q 2000', () => main.includes('q.slice(0,2000)')],
  ['1b. main.js response 16000', () => main.includes('slice(0,16000)')],
  ['1c. admin _S 16000', () => admin.includes('_S(v, 16000)')],
  ['2a. ai.js _TOPICS table', () => ai.includes('const _TOPICS = [')],
  ['2b. suggestFollowups 4 tham số', () => ai.includes('export function suggestFollowups(question, R, answer, history)')],
  ['2c. main.js call truyền text+history', () => main.includes('suggestFollowups(q, currentResult, text, chatHistory)')],
  ['3a. fpanel CSS', () => admin.includes('.fpanel{')],
  ['3b. vSearch function', () => admin.includes('function vSearch()')],
  ['3c. _sqSearch function', () => admin.includes('function _sqSearch()')],
  ['3d. _evApply function', () => admin.includes('function _evApply()')],
  ['4a. _vSearched flag', () => admin.includes('_vSearched')],
  ['4b. events card trên cùng tab-visitors', () => admin.indexOf('Sự kiện gần đây') !== -1 && admin.indexOf('Sự kiện gần đây') < admin.indexOf('Tìm theo IP / tên')],
  ['5a. eventsLite slice 200', () => admin.includes('events.slice(0, 200)')],
  ['5b. response KHÔNG trim 800', () => !admin.includes('d.response.slice(0, 800)')],
  ['5c. parallel counters', () => admin.includes('Promise.all([') && admin.includes("env.ADMIN_KV.get('cnt:visit')")],
  ['5d. parallel ai+logRaw', () => admin.includes('isAiEnabled(env),')],
  ['5e. progressive load', () => admin.includes('load(false); setTimeout(function(){ load(true); }, 60)')],
  ['6a. get helper (500 fix)', () => admin.includes('const get = async (k) => parseInt')],
  ['8a. DATA SOURCES warning', () => ai.includes('DATA SOURCES')],
  ['8b. SAT PHƯƠNG đầu brief', () => ai.includes('== 🧭 SAT PHƯƠNG')],
  ['8c. NGOẠI HÌNH L2', () => ai.includes('NGOẠI HÌNH/TÍNH CÁCH THEO NGŨ HÀNH')],
  ['8d. OVERRIDE PRIORITY L6', () => ai.includes('OVERRIDE PRIORITY')],
  ['8e. TIMING HIERARCHY L7', () => ai.includes('TIMING HIERARCHY')],
  ['8f. TÀNG CAN PHỐI NGÃU L5', () => ai.includes('TÀNG CAN PHỐI NGÃU')],
  ['8g. rule 13 CHỐNG HALLUCINATION', () => ai.includes('13. CHỐNG HALLUCINATION')],
  ['8h. rule 14 RE-READ BRIEF', () => ai.includes('14. RE-READ BRIEF')],
  ['8i. ANTI-TRÉO comment', () => ai.includes('ANTI-TRÉO v1')],
  ['9a. neo-checker.js tồn tại', () => !!neo],
  ['9b. checkNeo export', () => !!neo && neo.includes('export function checkNeo')],
  ['9c. main.js import checkNeo', () => main.includes("import { checkNeo } from './engine/neo-checker.js'")],
  ['9d. main.js log neoScore', () => main.includes('neoScore: _neo && _neo.score')],
  ['9e. admin cap neoConflicts', () => admin.includes("k === 'neoConflicts'")],
  ['9f. /api/neo-stats endpoint', () => admin.includes("'api/neo-stats'")],
  ['9g. loadNeo + neo-kpis', () => admin.includes('function loadNeo') && admin.includes("getElementById('neo-kpis')")],
  ['10a. renderReasoningChains', () => main.includes('function renderReasoningChains')],
  ['10b. _rcCard helper', () => main.includes('function _rcCard')],
  ['10c. gọi trong run()', () => main.includes('renderReasoningChains(currentResult)')],
  ['11a. Neo badge user-facing', () => main.includes('mốc dữ liệu')],
  ['11b. Kiểm chứng tự động panel', () => main.includes('Kiểm chứng tự động')],
  ['12a. EDU const', () => main.includes("const EDU = import.meta.env.MODE === 'edu'")],
  ['12b. STYLE nghien-cuu', () => ai.includes("'nghien-cuu':")],
  ['12c. build:edu script', () => pkg.includes('build:edu')],
  ['13a. Haptics import', () => main.includes("from '@capacitor/haptics'")],
  ['13b. StatusBar init', () => main.includes('initNativeChrome')],
  ['13c. haptic notify neo', () => main.includes("hapticNotify('WARNING')")],
  ['15a. appId lvdang', () => cap.includes('shop.god8.lvdang')],
  ['15b. StatusBar plugin cfg', () => cap.includes('"overlaysWebView": false')],
  ['16a. PrivacyInfo.xcprivacy', () => !!read('resources/ios/PrivacyInfo.xcprivacy')],
  ['17a. SUBMIT-GUIDE.md', () => !!read('docs/SUBMIT-GUIDE.md')],
  ['17b. KHAI-BAO.md', () => !!read('docs/APPSTORE-KHAI-BAO.md')],
  ['17c. v3 submission', () => !!read('docs/APP-STORE-SUBMISSION-v3.md')],
  ['18a. bỏ bail 180s', () => !ai.includes('> 180000) return _bail')],
  ['18b. TTFT 75s', () => ai.includes('}, 75000)')],
  ['18c. idle 90s adaptive', () => ai.includes('? 90000 : 45000')],
  ['18d. network retry', () => ai.includes('_att = 0; _att < 2')],
  ['18e. worker 90s', () => worker.includes('}, 90000)')],
  ['19a. _rs isolation', () => main.includes('const _rs = (name, fn) =>')],
  ['19b. run().catch', () => main.includes('run().catch')],
  ['19c. phantom refs đã dọn', () => !main.includes('print-btn-lab') && !main.includes(D + "('settings-btn')")],
  ['19d. sw fallback /', () => sw.includes("caches.match('/')")],
  ['19e. sw nvidia+groq', () => sw.includes('/nvidia') && sw.includes('/groq')],
  ['19f. slug collision', () => seo.includes('usedSlugs')],
  ['19g. kinh ?q=', () => seo.includes('URLSearchParams')],
  ['19h. analyze_day validate', () => ai.includes('cho tool analyze_day')],
  ['19i. toolLabel đủ mới', () => ai.includes("analyze_coffee: 'Xem cặn cà phê'")],
];

let pass = 0, fail = 0;
const failed = [];
for (const [name, fn] of checks) {
  let ok = false;
  try { ok = fn(); } catch (e) { ok = false; }
  if (ok) pass++; else { fail++; failed.push(name); }
}
console.log('════ KẾT QUẢ: ' + pass + ' PASS / ' + fail + ' FAIL (tổng ' + checks.length + ') ════');
if (failed.length) { console.log('FAIL list:'); failed.forEach((f) => console.log('  ❌', f)); }
