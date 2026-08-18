// ============================================================================
//  yingqi.js — luật 应期 trên sự kiện đã ghi (adapter mỏng)
//  Bảng khớp lấy từ event-verify.js. Không import file đó (kéo điểm mệnh + luận vận).
// ============================================================================
import { Solar } from 'lunar-javascript';
import { tenGod } from '../engine/core.js';
import { liunian12Shen } from '../engine/liunian-shen.js';
import { personalTaSui } from '../engine/taisui.js';
import { TEN_GOD_VI } from '../engine/constants.js';
import { buildPersonR } from './family-run.js';

const SHEN12_MATCH = {
  marriage: ['太阳', '太阴', '福德'],
  breakup: ['太岁', '白虎', '吊客', '官符'],
  wealth_gain: ['福德', '龙德', '太阳', '太阴'],
  wealth_loss: ['太岁', '岁破', '白虎', '病符'],
  illness: ['白虎', '病符', '死符', '太岁'],
  move: ['太岁', '岁破'],
  legal: ['官符', '白虎', '太岁'],
  study_success: ['太阳', '福德', '龙德'],
};

const TS_ADVERSE = ['marriage', 'wealth_loss', 'illness', 'legal', 'breakup'];

function godMatchFor(type, isMale) {
  const spouseGods = isMale ? ['正財', '偏財'] : ['正官', '七殺'];
  const childGods = isMale ? ['七殺', '正官'] : ['食神', '傷官'];
  const map = {
    marriage: spouseGods,
    breakup: ['劫財', '傷官', '七殺'],
    newJob: ['正官', '正印', '七殺'],
    jobLoss: ['七殺', '劫財', '傷官'],
    wealth_gain: ['正財', '偏財'],
    wealth_loss: ['劫財', '傷官'],
    illness: ['七殺', '偏印'],
    birth_child: childGods,
    study_success: ['正印', '食神'],
    legal: ['傷官', '七殺', '偏官'],
  };
  return map[type] || [];
}

export function yearGanZhi(year) {
  const lunar = Solar.fromYmdHms(year, 6, 15, 12, 0, 0).getLunar();
  return { gan: lunar.getYearGan(), zhi: lunar.getYearZhi() };
}

export function verifyYingqiRules(R, event) {
  const year = Number(event.year);
  const { gan: yGan, zhi: yZhi } = yearGanZhi(year);
  const dayGan = R.chart.dayGan;
  const birthZhi = R.chart.pillars.year.zhi;
  const isMale = R.chart.input?.gender === 'nam';
  const tg = tenGod(dayGan, yGan);
  const s12 = liunian12Shen(birthZhi, yZhi);
  const ts = personalTaSui(birthZhi, yZhi);
  const rules = [];
  const godName = TEN_GOD_VI[tg] || tg;

  const expectedGods = godMatchFor(event.type, isMale);
  if (expectedGods.length) {
    const hold = expectedGods.includes(tg);
    const need = expectedGods.map((g) => TEN_GOD_VI[g] || g).join('/');
    rules.push({
      id: 'shi-shen',
      name: '十神 năm sự kiện',
      hold,
      copy: hold
        ? `luật 十神 giữ trên sự kiện đã ghi: năm ${year} ${yGan}${yZhi} là ${godName}`
        : `luật 十神 không giữ trên sự kiện đã ghi: năm ${year} ${yGan}${yZhi} là ${godName}, loại này đòi ${need}`,
    });
  }

  const shenExpect = SHEN12_MATCH[event.type];
  if (shenExpect) {
    const hold = shenExpect.includes(s12.god.zh);
    rules.push({
      id: 'shen12',
      name: '12神',
      hold,
      copy: hold
        ? `luật 12神 giữ trên sự kiện đã ghi: ${s12.god.zh}`
        : `luật 12神 không giữ trên sự kiện đã ghi: ${s12.god.zh}`,
    });
  }

  const wantOffend = TS_ADVERSE.includes(event.type);
  const offends = !!ts?.offends;
  const holdTs = wantOffend ? offends : !offends;
  rules.push({
    id: 'taisui',
    name: '太岁',
    hold: holdTs,
    copy: holdTs
      ? `luật 太岁 giữ trên sự kiện đã ghi: ${offends ? 'phạm' : 'không phạm'}`
      : `luật 太岁 không giữ trên sự kiện đã ghi: ${offends ? 'phạm' : 'không phạm'}`,
  });

  const dayun = R.dayun || [];
  const du = dayun.find((d) => year >= d.startYear && year < d.startYear + 10);
  rules.push({
    id: 'dayun-window',
    name: 'khung đại vận mười năm',
    hold: !!du,
    copy: du
      ? `luật khung đại vận giữ trên sự kiện đã ghi: ${year} nằm trong ${du.ganZhi} (${du.startYear}–${du.startYear + 9})`
      : `luật khung đại vận không giữ trên sự kiện đã ghi: ${year} không nằm trong cột đã lập`,
  });

  return { yearGZ: `${yGan}${yZhi}`, rules };
}

export function verifyAnYingqi(an) {
  const rows = [];
  for (const ev of an.events || []) {
    const member = (an.members || []).find((m) => m.id === ev.memberId)
      || (an.members || []).find((m) => m.role === 'center')
      || an.members?.[0];
    if (!member) continue;
    const pack = verifyYingqiRules(buildPersonR(member), ev);
    rows.push({
      event: ev,
      yearGZ: pack.yearGZ,
      rules: pack.rules,
    });
  }
  return rows;
}
