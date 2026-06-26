// [loop 304] Fuzz các module render-phase (gọi trong render*, KHÔNG trong analyze()).
// broad-fuzz chỉ ép analyze() — chart qua analyze vẫn có thể crash trong analyzeWealthStar/
// detectCombos/computeFuxing… Card-phase module = bề mặt lỗi riêng, nên cần fuzz độc lập.
// Locks ổn định của 9 module được surface ở loops 290–303 (wealth/career/spouse/study-star,
// combos, fuxing, dayun-god, huaqi, taiyuan) qua 240 lá số đa dạng × cả nam/nữ/giờ biên.
import { analyze } from './src/engine/chart.js';
import { analyzeWealthStar } from './src/engine/wealth-star.js';
import { analyzeCareerStar } from './src/engine/career-star.js';
import { analyzeSpouseStar } from './src/engine/spouse-star.js';
import { analyzeStudy } from './src/engine/study-analysis.js';
import { detectCombos } from './src/engine/combos.js';
import { computeFuxing } from './src/engine/fuxing.js';
import { dayunGodMeaning } from './src/engine/dayun-god.js';
import { analyzeHuaQi } from './src/engine/huaqi.js';
import { taiYuan } from './src/engine/taiyuan.js';
import { analyzeCaiKu } from './src/engine/caiku.js';
import { detectAnhe } from './src/engine/anhe.js';
import { xingshenZuo } from './src/engine/xingshen-zuo.js';
import { wealthMonthlyAlert } from './src/engine/wealth-alert.js';
import { healthMonthlyAlert } from './src/engine/health-monthly.js';

const CN = { '一':1,'二':2,'三':3,'四':4,'正':1,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,'十一':11,'十二':12,'冬':11,'腊':12 };
const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

let crashes = 0, nanIssues = 0, charts = 0;
const log = [];
const checks = {
  wealth:    (R) => analyzeWealthStar(R),
  career:    (R) => analyzeCareerStar(R),
  spouse:    (R) => analyzeSpouseStar(R),
  study:     (R) => analyzeStudy(R),
  combos:    (R) => detectCombos(R.chart, R.strength),
  fuxing:    (R) => computeFuxing(CN[String(R.chart.lunar.month).replace(/^闰/,'')]||0, ZHI.indexOf(R.chart.pillars.time.zhi)+1, R.chart.pillars.year.gan),
  dayunGod:  (R) => dayunGodMeaning(R.chart, R.dayun),
  huaQi:     (R) => analyzeHuaQi(R),
  taiYuan:   (R) => taiYuan(R.chart.pillars.month.gan, R.chart.pillars.month.zhi),
  caiKu:     (R) => analyzeCaiKu(R),
  anHe:      (R) => detectAnhe(R.chart),
  xingShen:  (R) => xingshenZuo(R.chart),
  wealthMon: (R) => wealthMonthlyAlert(R, 2026),
  healthMon: (R) => healthMonthlyAlert(R, 2026),
};

for (let y = 1960; y <= 2010; y += 7) {
  for (const m of [2, 6, 11]) {
    for (const h of [0, 6, 12, 18, 23]) {
      for (const g of ['nam', 'nu']) {
        let R;
        try { R = analyze(y, m, 15, h, 30, g, 2026); } catch (e) { continue; }
        charts++;
        for (const [name, fn] of Object.entries(checks)) {
          try {
            const json = JSON.stringify(fn(R));
            if (json.includes('NaN') || json.includes('undefined')) {
              nanIssues++;
              if (log.length < 10) log.push(`NaN/undef @${name} ${y}-${m}-${h}-${g}: ${json.slice(0,100)}`);
            }
          } catch (e) {
            crashes++;
            if (log.length < 10) log.push(`CRASH @${name} ${y}-${m}-${h}-${g}: ${e.message}`);
          }
        }
      }
    }
  }
}

console.log('='.repeat(70));
console.log(`Card-phase module fuzz: ${charts} lá số × ${Object.keys(checks).length} module = ${charts * Object.keys(checks).length} calls`);
if (log.length) { console.log('First issues:'); log.forEach((l) => console.log('  ' + l)); }
console.log(`crashes: ${crashes} | NaN/undefined: ${nanIssues}`);
console.log('='.repeat(70));
if (crashes === 0 && nanIssues === 0) {
  console.log(`🎉 All ${Object.keys(checks).length} card-phase modules stable across ${charts} charts`);
  process.exit(0);
} else {
  console.log(`⚠ ${crashes + nanIssues} issue(s) found — card-phase module regression`);
  process.exit(1);
}
