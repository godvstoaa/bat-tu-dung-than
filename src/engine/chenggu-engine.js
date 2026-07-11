// chenggu-engine.js — 袁天罡称骨算命 (BÍ TRUYEN, bảng verified tu grandsutras/baike)
// Cong thuc: trong luong nam(60 nam cycle) + thang + ngay + gio (lunar) → tong (两/钱) → 称骨歌.
// Verify: 1971 nam 1 ngay 1 gio Ty = 17+6+5+16 = 44 tien = 四两四 ✓.
import { Solar } from 'lunar-javascript';

// nam trong luong (1941-2000 = 60 nam cycle, don vi: tien 钱). yearWeight = YEAR_W[(year-1941)%60]
const YEAR_W = [6,8,7,5,15,6,16,15,7,9, 12,10,7,15,6,5,14,14,9,7, 7,9,12,8,7,13,5,14,5,9, 17,5,7,12,8,8,6,19,6,8, 16,10,7,12,9,6,7,12,5,9, 8,7,8,15,9,16,8,8,19,12];
// thang (lunar 1-12), tien
const MONTH_W = [6,7,18,9,5,16,9,15,18,8,9,5];
// ngay (lunar 1-30), tien
const DAY_W = [5,10,8,15,16,15,8,16,8,16, 9,17,8,17,10,8,9,18,5,10, 10,9,8,9,15,18,7,8,16,6];
// gio (Tu-Hoi 0-11), tien
const HOUR_W = [16,6,7,10,9,16,10,8,8,9,6,6];

// 称骨歌 (2两2→7两1) — ngu van (verified)
export const CHENGGU_VERSE = {
  '2两1': { v: 'đoan menh phi nghiep vi đai khong', t: 'HUNG', verse: '短命非业谓大空，平生灾难事重重；凶祸频临陷逆境，终世困苦事不成。' },
  '2两2': { v: 'than han cot lanh kho linh đinh', t: 'HUNG', verse: '身寒骨冷苦伶仃，此命推来生乞人；碌碌巴巴无度日，终年打拱过平年。' },
  '2两3': { v: 'cot tu khinh, bat thanh', t: 'HUNG', verse: '此命推来骨自轻，求谋作事事难成；妻儿兄弟应难许，别处他乡作散人。' },
  '2两4': { v: 'phuc loc vo, luu đong huong', t: 'HUNG', verse: '此命推来福禄无，门庭困苦总难营；六亲骨肉皆无靠，流到他乡作老翁。' },
  '2两5': { v: 'to nghiep vi, lao đong', t: 'HUNG', verse: '此命推来祖业微，门庭营度似稀奇；六亲骨肉如冰炭，一生勤劳自把持。' },
  '2两6': { v: 'co trung cau, van nien vo uu', t: 'CAN THAN', verse: '平生衣禄苦中求，独自经营事不休；离祖出门宜早计，晚来衣禄自无忧。' },
  '2两7': { v: 'bat thuong luong, doc ma đan cuong', t: 'CAN THAN', verse: '一生作事少商量，难靠祖宗作主张；独马单枪空做去，早来晚岁部无长。' },
  '2两8': { v: 'tuc bong bat đinh', t: 'CAN THAN', verse: '一生作事似飘蓬，祖宗产业在梦中；若不过房并改姓，也当移徙两三通。' },
  '2两9': { v: 'trung nien bat đat', t: 'TRUNG', verse: '初年运限未曾享，纵有功名在后底；须过四旬绕可上，移居改姓始为良。' },
  '3两': { v: 'lao luc, lao đong tiet kiem', t: 'TRUNG', verse: '劳劳碌碌苦中求，东走西奔何日休；若使终身勤与俭，老来稍可免忧愁。' },
  '3两1': { v: 'trung nien gian vo uu', t: 'TRUNG', verse: '忙忙碌碌苦中求，何日云开见日头；难得祖基家可立，中年衣食渐无忧。' },
  '3两2': { v: 'trung nien tai luu', t: 'TRUNG-CAT', verse: '初年运蹇事难谋，渐有财源如水流；到得中年衣食旺，那时名利一齐来。' },
  '3两3': { v: 'hau nien đai vang', t: 'CAT', verse: '早年做事事难成，百计徒劳枉费心；半世自如流水去，后来运到得黄金。' },
  '3两4': { v: 'tang đao men cat', t: 'CAT (xuat gia)', verse: '此命福气果如何，僧道门中衣禄多；离祖出家方得妙，终朝拜佛念弥陀。' },
  '3两5': { v: 'thu cuu thinh vuong', t: 'CAT', verse: '平生福量不周全，祖业根基觉少传；营业生涯宜守旧，时来衣食胜从前。' },
  '3两6': { v: 'đoc lap thanh gia phuc', t: 'CAT', verse: '不须劳碌过平生，独自成家福不轻；早有福星常照命，任君行去百般成。' },
  '3两7': { v: 'to nghiep vi, đoc thanh', t: 'CAT', verse: '此命般般事不成，弟兄少力自孤成；虽然祖业须微有，来得明时去得明。' },
  '3两8': { v: 'cot nhuc thanh cao, co danh', t: 'CAT', verse: '一生骨肉最清高，早入黄门姓名标；待看看将三十六，蓝袍脱去换红袍。' },
  '3两9': { v: 'an nhap gia', t: 'CAT', verse: '此命终身运不穷，劳劳作事尽皆空；苦心竭力成家计，到得那时在梦中。' },
  '4两': { v: 'hau cuong huong an khang', t: 'CAT', verse: '生平衣禄是绵长，件件心中自主张；前面风霜多受过，后来必定享安康。' },
  '4两1': { v: 'nang can, trung nien dao', t: 'CAT', verse: '此命推来事不同，为人能干略凡庸；中年还有逍遥福，不比前年运未通。' },
  '4两2': { v: 'trung nien đat danh loi', t: 'CAT', verse: '得宽怀处且宽怀，何用双眉皱不开；若使中年命运济，那时名利一齐来。' },
  '4两3': { v: 'thong minh, kin quy nhan', t: 'CAT', verse: '为人心性最聪明，作事轩昂近贵人；衣禄一生天数定，不须劳碌是丰享。' },
  '4两4': { v: 'van nien khong uu', t: 'CAT', verse: '来事由天莫苦求，须知福禄胜前途；当年财帛难如意，晚景欣然便不忧。' },
  '4两5': { v: 'khon nan nu tu', t: 'CAN THAN', verse: '名利推来竟若何，前途辛苦后奔波；命中难养男与女，骨肉扶持也不多。' },
  '4两6': { v: 'trung nien bat đinh', t: 'TRUNG', verse: '东西南北尽皆空，出姓移名更觉隆；衣禄无亏天数定，中年晚景一般同。' },
  '4两7': { v: 'phu the quy, tai nguyen', t: 'CAT', verse: '此命推来旺末年，妻荣子贵自怡然；平生原有滔滔福，可有财源如水源。' },
  '4两8': { v: 'van nien thanh', t: 'CAT', verse: '幼年运道未曾享，若是蹉跎再不兴；兄弟六亲皆无靠，一身事业晚年成。' },
  '4两9': { v: 'tu thanh phu quy', t: 'CAT', verse: '此命推来福不轻，自成自立耀门庭；从来富贵人亲近，使婢差奴过一生。' },
  '5两': { v: 'van nien tai tinh chieu', t: 'CAT', verse: '为名为利终日劳，中年福禄也多遭；老来是有财星照，不比前番日下高。' },
  '5两1': { v: 'vinh hoa thong', t: 'DAI CAT', verse: '一世荣华事事通，不须劳碌自享丰；弟兄叔侄皆如意，家业成时福禄宏。' },
  '5两2': { v: 'bat lao tu năng', t: 'DAI CAT', verse: '一世享通事事能，不须劳思自然能；家族欣然心皆好，家业丰享自称心。' },
  '5两3': { v: 'hung gia đai phat', t: 'DAI CAT', verse: '此格推来气像真，兴家发达在其中；一生福禄安排家，欲是人间一富翁。' },
  '5两4': { v: 'phan va bat phu', t: 'DAI CAT', verse: '此命推来厚且清，诗画满腹看功成；丰衣足食自然稳，正是人间有福人。' },
  '5两5': { v: 'trung nien phu quy', t: 'DAI CAT', verse: '走马扬鞭争名利，少年做事费筹谋；一朝福禄源源至，富贵荣华耀六亲。' },
  '5两6': { v: 'dang nghia thong, tai nguyen', t: 'DAI CAT', verse: '此格推来礼义通，一生福禄用无穷；甜酸苦辣皆尝过，财源滚滚稳且丰。' },
  '5两7': { v: 'phu loc phong danh', t: 'DAI CAT', verse: '福禄丰盈万事全，一生荣耀显双亲；名扬威振人钦敬，处世逍遥似遇春。' },
  '5两8': { v: 'tu đai quy', t: 'DAI CAT', verse: '平生福禄自然来，名利双全福禄偕；雁塔题名为贵客，紫袍玉带走金阶。' },
  '5两9': { v: 'danh menh khuynh quoc', t: 'DAI CAT', verse: '细推此格妙且清，必定财高礼义通；甲第之中应有分，扬鞭走马显威荣。' },
  '6两': { v: 'kim bang đai đinh danh', t: 'DAI CAT', verse: '一朝金榜快题名，显祖荣宗立大功；衣食定然原裕足，田园财帛更丰盛。' },
  '6两1': { v: 'cong danh / tai ong', t: 'DAI CAT', verse: '不作朝中金榜客，定为世上一财翁；聪明天赋经书熟，名显高科自是荣。' },
  '6两2': { v: 'tu lang quang quy', t: 'DAI CAT', verse: '此命推来福不穷，读书必定显亲宗；紫衣金带为卿相，富贵荣华皆可同。' },
  '6两3': { v: 'cao khoa danh duong', t: 'DAI CAT', verse: '命主为官福禄长，得来富贵定非常；名题雁塔传金榜，定中高科天下扬。' },
  '6两4': { v: 'tu quy sat cung quy', t: 'DAI CAT', verse: '此格威权不可挡，紫袍金带坐高望；荣华富贵虽能及，积玉堆金满储仓。' },
  '6两5': { v: 'an quoc an bang', t: 'DAI CAT', verse: '细推此命福不轻，安国安邦极品人；文纷雕梁徽富贵，威声照耀四方闻。' },
  '6两6': { v: 'đai phu quy', t: 'DAI CAT', verse: '此格人间一福人，堆金积玉满堂春；从来富贵由天定，正勿垂绅谒圣君。' },
  '6两7': { v: 'nghiep cao, van su thong', t: 'DAI CAT', verse: '此命生来福自宏，田园家业最高隆；平生衣禄丰盈足，一世荣华万事通。' },
  '6两8': { v: 'bat kho cau', t: 'CAT', verse: '富贵由大莫苦求，万金家计不须谋；十年不比前番事，祖业根基水上舟。' },
  '6两9': { v: 'an huong vin hoa', t: 'DAI CAT', verse: '君是人间前禄星，一生富贵众人钦；纵然福禄由天定，安享荣华过一生。' },
  '7两': { v: 'thien đinh phu lox', t: 'DAI CAT', verse: '此命推来福不轻，不须愁虑苦劳心；一生天定衣与禄，富贵荣华主一生。' },
  '7两1': { v: 'cong hau khanh tuong', t: 'DAI CAT (cuc cao)', verse: '此命生来大不同，公侯卿相在其中；一生自有逍遥福，富贵荣华极品隆。' },
};

function hourToZhiIdx(hour) { return Math.floor(((hour + 1) % 24) / 2); } // 23→0(子),1→1(丑)...

// === assessChenggu(solarYear, solarMonth, solarDay, hour) ===
export function assessChenggu(year, month, day, hour) {
  // chuyen sang lunar
  const h = (hour === undefined || hour === null) ? 12 : hour;
  const solar = Solar.fromYmdHms(year, month, day, h, 0, 0);
  const lunar = solar.getLunar();
  const lYear = lunar.getYear();
  const lMonth = lunar.getMonth();
  const lDay = lunar.getDay();
  const zhiIdx = hourToZhiIdx(h);
  const wYear = YEAR_W[((lYear - 1941) % 60 + 60) % 60];
  const wMonth = MONTH_W[(lMonth - 1 + 12) % 12];
  const wDay = DAY_W[(lDay - 1 + 30) % 30];
  const wHour = HOUR_W[zhiIdx % 12];
  const total = wYear + wMonth + wDay + wHour; // tien
  const liang = Math.floor(total / 10), qian = total % 10;
  const key = `${liang}两${qian}`;
  const fv = CHENGGU_VERSE[key] || CHENGGU_VERSE[`${liang}两`] || { v: '(khong trong bang)', t: '?', verse: '(trong luong ' + key + ' khong co đieu van — tham khao gan nhat)' };
  return {
    lunar: { year: lYear, month: lMonth, day: lDay },
    weights: { year: wYear, month: wMonth, day: wDay, hour: wHour, total },
    boneWeight: key + '钱',
    tone: fv.t,
    verse: fv.verse,
    viGloss: fv.v,
    verdict: `称骨 (袁天罡): trong luong(nam+thang+ngay+gio) = ${wYear}+${wMonth}+${wDay}+${wHour} = ${total} tien = ${key}. ${fv.t} — ${fv.v}. [${fv.verse}]`,
    note: '称骨算命 = bí truyền (Đường·袁天罡). Tong trong luong cao = tong quat tot hon (nhung khong tuyet doi). Day la 1 goc nhin BO SUNG (khac tu binh/ho phap).',
  };
}
