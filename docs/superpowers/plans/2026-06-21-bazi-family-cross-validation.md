# Nghiệm Chứng Gia Tộc Bát Tự (家族八字交叉验证) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng hệ thống nghiệm chứng Bát Tự đa trụ gia tộc — cho nhập lá số của 1 người trung tâm + bố/mẹ/anh chị/chồng/con, chấm độ **nhất quán logic** giữa các lá số theo 6 trục cổ pháp, xuất sơ đồ phức tạp (chòm sao + ma trận + radar) + sổ cái xác/nghiệm, và (Phase 2) **hiệu chỉnh giờ sinh** bằng cách quét 12 giờ, lấy giờ cho điểm nhất quán gia tộc cao nhất.

**Architecture:** Một module engine mới `src/engine/family.js` thuần tính toán (deterministic, tái dụng `analyze()` từ `chart.js`, `nayinInfo` từ `nayin.js`, `tenGod`/`godGroup` từ `core.js`). Engine trả về **dữ liệu có cấu trúc** (điểm từng trục + reasons + ledger); lớp UI `src/main.js` dựng SVG/HTML **an toàn XSS** (escape mọi chuỗi người dùng nhập, gán `el.innerHTML = biếnĐãXây`, không内插 `${}` trực tiếp lên dòng gán). Module rectify riêng `src/engine/family-rectify.js`. Không động tới logic engine sẵn có — chỉ **thêm file mới** + 1 section HTML + wiring trong `main.js` + 1 block test trong `selftest.mjs`. → Xung đột với loop đang chạy = 0.

**Tech Stack:** Vite + ES modules (vanilla JS, không framework), `lunar-javascript` (tính Tứ Trụ/Đại Vận chính xác), Playwright (verify headless), `selftest.mjs` (deterministic asserts). Không thêm dependency.

**Cơ sở lý thuyết (đã kiểm chứng nguồn):**
- **十神六亲** (子平真诠): cha=偏财/正财, mẹ=正印/偏印, phối ngẫu (nam=Tài, nữ=Quan), con (nam=Quan Sát, nữ=Thực Thương), huynh đệ=比肩/劫财.
- **宫位**: 年=ổ祖, 月=cha mẹ/huynh đệ, 日 chi=phối ngẫu, 时=con cái.
- **星宫交叉验证**: sao lục thân + cung vị cùng tín hiệu → chính xác cao; "tài ấn giao chiến" = tín hiệu biến động cha mẹ.
- **家族八字互验法**: lá số A đọc vận thế người thân B → đối chiếu lá số thật của B → trùng = tin cậy. Xương sống của "nghiệm chứng".
- **校正时辰 qua gia tộc**: trụ Giờ = cung Tử Nữ → lá số thật của con dùng để hiệu chỉnh/kiểm chứng giờ sinh.

**Nguồn đối chiếu:** [搜狐—出生时辰不准怎么办](https://www.sohu.com/a/382365287_100054174) · [豆瓣—八字时辰科学论证校正法](https://m.douban.com/note/871739335/) · [知乎—命理六亲推断](https://zhuanlan.zhihu.com/p/2045194460108153762) · [Scribd—Hour Pillar](https://www.scribd.com/document/7522691/Hour-Pillar) · [DeepOracle—BaZi Children Analysis](https://www.deeporacle.ai/en/bazi/blog/bazi-children-analysis).

**Giả định (sửa lại được sau):**
1. Người trung tâm = lá số nhập ở form sinh chính (coi là "em gái"). Section "Gia tộc" thêm người thân kèm vai trò.
2. Mỗi người thân: vai trò + ngày + giờ + giới tính; checkbox **"giờ chưa rõ"** → bật rectification (Phase 2).
3. Cả 3 sơ đồ + sổ cái đều dựng (mặc định "cả hai" + "cả 3 sơ đồ").

---

## File Structure

**Tạo mới (không đụng file cũ):**
- `src/engine/family.js` — Engine nghiệm chứng gia tộc (~320 dòng). Catalog vai trò + `elementForRole` + 6 scorer từng trục + `analyzePair` + `analyzeFamily` (tổng hợp cluster + ledger + radar axes).
- `src/engine/family-rectify.js` — Hiệu chỉnh giờ sinh (~90 dòng). `rectifyHour(center, member, others)` quét 12 giờ, chấm coherence, rank, giải thích.
- `src/engine/family-diagram.js` — Generator dữ liệu sơ đồ (~140 dòng). `radialData(family)`, `matrixData(family)`, `radarData(family)` → trả dữ liệu để `main.js` dựng SVG.

**Sửa (tối thiểu, thêm chèn):**
- `index.html` — chèn 1 `<section id="family-section">` sau section Hợp Hôn.
- `src/main.js` — import 3 module mới + state `familyMembers[]` + handlers + render (an toàn XSS) + wiring.
- `selftest.mjs` — chèn block "NGHIỆM CHỨNG GIA TỘC".
- `src/style.css` — thêm class CSS.
- `README.md` — thêm 1 section.

---

## Phase 1 — Engine nghiệm chứng + 1 sơ đồ + UI (SHIPPABLE)

> Phase 1 chạy độc lập, ra phần mềm test được. Thực thi khi loop rảnh. Phase 2 tách riêng.

### Task 1: Catalog vai trò + ánh xạ element/star (`family.js` khung)

**Files:**
- Create: `src/engine/family.js`

- [ ] **Step 1: Viết phần data + `elementForRole`**

```js
// src/engine/family.js — NGHIỆM CHỨNG GIA TỘC BÁT TỰ (家族八字交叉验证)
// Engine thuần deterministic. Nhận R = analyze() của chủ thể + người thân,
// chấm độ nhất quán đa trục cổ pháp. Không phụ thuộc UI.
import { GAN, ZHI, WX_VI, SHENG, KE, SHENG_BY, KE_BY, TEN_GOD_VI } from './constants.js';
import { tenGod, godGroup } from './core.js';
import { nayinInfo } from './nayin.js';

export const ROLE = {
  father:  { vi: 'Cha',         palace: 'month' },
  mother:  { vi: 'Mẹ',         palace: 'month' },
  sibling: { vi: 'Anh/chị/em',  palace: 'month' },
  spouse:  { vi: 'Vợ/Chồng',    palace: 'day'   },
  child:   { vi: 'Con cái',     palace: 'time'  },
};
export const PALACE_VI = { year:'Trụ Năm', month:'Trụ Tháng', day:'Trụ Ngày', time:'Trụ Giờ' };

// Sao + hành đại diện 1 vai trò nhìn TỪ chủ thể (dayGan, isMale). Chuẩn 渊海子平.
function starMap(isMale) {
  return isMale
    ? { father:['偏財','正財'], mother:['正印','偏印'], sibling:['比肩','劫財'],
        spouse:['正財','偏財'], child:['七殺','正官'] }
    : { father:['偏財','正財'], mother:['正印','偏印'], sibling:['比肩','劫財'],
        spouse:['正官','七殺'], child:['食神','傷官'] };
}

/** @returns {{ wx:string, gods:string[] }} */
export function elementForRole(dayGan, isMale, role) {
  const dmWx = GAN[dayGan].wx;
  const map = {
    father:  { wx: KE[dmWx],       gods:['偏財','正財'] },
    mother:  { wx: SHENG_BY[dmWx], gods:['正印','偏印'] },
    sibling: { wx: dmWx,           gods:['比肩','劫財'] },
    spouse:  isMale ? { wx: KE[dmWx],    gods:['正財','偏財'] }
                    : { wx: KE_BY[dmWx], gods:['正官','七殺'] },
    child:   isMale ? { wx: KE_BY[dmWx], gods:['七殺','正官'] }
                    : { wx: SHENG[dmWx], gods:['食神','傷官'] },
  };
  return map[role];
}
```

- [ ] **Step 2: Verify**

```bash
cd "app bói toán" && node --input-type=module -e "
import { elementForRole } from './src/engine/family.js';
const f = elementForRole('甲', true, 'father');
const m = elementForRole('甲', true, 'mother');
console.log('cha', f.wx, f.gods, '| mẹ', m.wx, m.gods);
"
```
Expected: `cha 土 [ '偏財', '正財' ] | mẹ 水 [ '正印', '偏印' ]`

- [ ] **Step 3: Commit** — `feat(family): role catalog + elementForRole (十神六亲 mapping)`

---

### Task 2: Trục 1 — Vai trò phản nghiệm (role reciprocity, cân 0.35)

**Files:** Modify `src/engine/family.js`

- [ ] **Step 1: Thêm hàm**

```js
// ---- TRỤC 1: VAI TRÒ PHẢN NGHIỆM (role reciprocity) — cân 0.35 ----
// A nhìn B qua vai trò ρ → ρ ứng hành X. B thật có 日 chủ = X? X vượng? → chấm.
export function scoreReciprocity(S, R, role) {
  const isMale = S.chart.input.gender === 'nam';
  const need = elementForRole(S.chart.dayGan, isMale, role);
  const rDmWx = R.chart.dayMaster.wx;
  const rHas = (R.wx.score[need.wx] || 0) / (R.wx.total || 1);
  const reasons = [];
  let score;
  if (rDmWx === need.wx) {
    score = 100;
    reasons.push(`✓ ${ROLE[role].vi}: Nhật Chủ người này ${R.chart.dayMaster.gan} ${WX_VI[rDmWx]} = đúng hành "${need.gods.map(g=>TEN_GOD_VI[g]).join('/')}" mà chủ thể quy định cho ${ROLE[role].vi} (hành ${WX_VI[need.wx]}). Khớp hoàn hảo.`);
  } else if (rHas >= 0.20) {
    score = 70;
    reasons.push(`● ${ROLE[role].vi}: Nhật Chủ ${WX_VI[rDmWx]} (không trùng ${WX_VI[need.wx]}), nhưng hành ${WX_VI[need.wx]} chiếm ${(rHas*100).toFixed(0)}% trong lá → vai trò vẫn hiện diện mạnh.`);
  } else if (SHENG[rDmWx] === need.wx || SHENG_BY[rDmWx] === need.wx) {
    score = 45;
    reasons.push(`• ${ROLE[role].vi}: Nhật Chủ ${WX_VI[rDmWx]} sinh ra / được sinh bởi hành ${WX_VI[need.wx]} → liên hệ gián tiếp, vai trò mờ.`);
  } else if (KE[rDmWx] === need.wx) {
    score = 30;
    reasons.push(`⚠ ${ROLE[role].vi}: Nhật Chủ ${WX_VI[rDmWx]} khắc hành ${WX_VI[need.wx]} của vai trò → quan hệ có xung khắc chủ quan.`);
  } else {
    score = 15;
    reasons.push(`✗ ${ROLE[role].vi}: Nhật Chủ ${WX_VI[rDmWx]} không liên quan hành ${WX_VI[need.wx]} → vai trò không phản ánh trong lá người này. Có thể sai giờ/dữ liệu.`);
  }
  return { score, reasons };
}
```

- [ ] **Step 2: Verify** — `node --input-type=module -e "import{analyze}from'./src/engine/chart.js';import{scoreReciprocity}from'./src/engine/family.js';const S=analyze(1990,6,15,14,30,'nam'),R=analyze(1965,3,1,8,0,'nam');const s=scoreReciprocity(S,R,'father');console.log(s.score,s.reasons[0]);"` → in số + 1 reason.

- [ ] **Step 3: Commit** — `feat(family): role reciprocity scorer (trục 1)`

---

### Task 3: Trục 3 — Can-Chi tương tác giữa 2 lá (cân 0.15)

**Files:** Modify `src/engine/family.js`

- [ ] **Step 1: Thêm hàm**

```js
// ---- TRỤC 3: CAN-CHI TƯƠNG TÁC — cân 0.15 ----
const SANHE = [['申','子','辰'],['寅','午','戌'],['巳','酉','丑'],['亥','卯','未']];
const LIUHE = ['子丑','寅亥','卯戌','辰酉','巳申','午未'];
const CHONG = { 子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳' };
const GAN_HE5 = { '甲己':1,'乙庚':1,'丙辛':1,'丁壬':1,'戊癸':1 };
function zhiRel(a, b) {
  if (a === b) return { type:'tự', vi:'tự hợp/đồng chi' };
  if (LIUHE.some(p => (p[0]===a&&p[1]===b)||(p[0]===b&&p[1]===a))) return { type:'lục hợp', vi:'Lục Hợp' };
  if (CHONG[a] === b) return { type:'xung', vi:'Lục Xung' };
  for (const t of SANHE) if (t.includes(a) && t.includes(b)) return { type:'tam hợp', vi:'Tam Hợp' };
  return { type:'bình', vi:'bình' };
}
export function scoreStemBranch(S, R, role) {
  const a = S.chart, b = R.chart;
  let score = 50; const reasons = [];
  const yRel = zhiRel(a.pillars.year.zhi, b.pillars.year.zhi);
  if (yRel.type === 'tam hợp') { score += 12; reasons.push(`✓ Chi năm ${ZHI[a.pillars.year.zhi].vi}–${ZHI[b.pillars.year.zhi].vi} ${yRel.vi} → hai tuổi hòa.`); }
  else if (yRel.type === 'lục hợp') { score += 8; reasons.push(`✓ Chi năm ${yRel.vi}.`); }
  else if (yRel.type === 'xung') { score -= 10; reasons.push(`⚠ Chi năm ${ZHI[a.pillars.year.zhi].vi}–${ZHI[b.pillars.year.zhi].vi} Xung → tuổi xung khắc nhẹ.`); }
  const dRel = zhiRel(a.pillars.day.zhi, b.pillars.day.zhi);
  if (dRel.type === 'lục hợp' || dRel.type === 'tam hợp') { score += 12; reasons.push(`✓ Nhật Chi ${dRel.vi} → cung mệnh tương đắc.`); }
  else if (dRel.type === 'xung') { score -= 12; reasons.push(`⚠ Nhật Chi Xung → bản ngã dễ va chạm.`); }
  const dg = a.dayGan + b.dayGan;
  if (GAN_HE5[dg] || GAN_HE5[dg.split('').reverse().join('')]) { score += 10; reasons.push(`✓ Nhật Can ${a.dayGan}–${b.dayGan} ngũ hợp → tâm đầu ý hợp.`); }
  return { score: Math.max(5, Math.min(100, Math.round(score))), reasons };
}
```

- [ ] **Step 2: Verify** — `node --input-type=module -e "import{analyze}from'./src/engine/chart.js';import{scoreStemBranch}from'./src/engine/family.js';const S=analyze(1990,6,15,14,30,'nam'),R=analyze(1992,3,18,20,0,'nam');console.log(scoreStemBranch(S,R,'sibling').score);"` → số.

- [ ] **Step 3: Commit** — `feat(family): stem-branch cross scorer (trục 3)`

---

### Task 4: Trục 6 — Nạp Âm tương quan (cân 0.05)

**Files:** Modify `src/engine/family.js`

- [ ] **Step 1: Thêm hàm** (dùng `nayinInfo` cho chính xác + DRY)

```js
// ---- TRỤC 6: NẠP ÂM TƯƠNG QUAN — cân 0.05 ----
const NAYIN_NOTE = { same:'tỷ hòa–hài hoà', sheng:'B nuôi dưỡng A', ke:'B kiểm soát A', shengBy:'B được A nuôi', keBy:'B bị A kiểm soát' };
export function scoreNayin(S, R, role) {
  const dayWx = (pillar) => { const ni = nayinInfo(pillar.nayin); return ni?.wx || (pillar.nayin||'').slice(-1); };
  const aWx = dayWx(S.chart.pillars.day), bWx = dayWx(R.chart.pillars.day);
  let rel = '';
  if (aWx === bWx) rel = 'same';
  else if (SHENG[aWx] === bWx) rel = 'sheng';
  else if (KE[aWx] === bWx) rel = 'ke';
  else if (SHENG[bWx] === aWx) rel = 'shengBy';
  else if (KE[bWx] === aWx) rel = 'keBy';
  const map = { same:90, shengBy:80, sheng:65, ke:50, keBy:40, '':55 };
  const reasons = [`Nạp âm nhật trụ: ${S.chart.pillars.day.nayin}(${WX_VI[aWx]}) ↔ ${R.chart.pillars.day.nayin}(${WX_VI[bWx]}) → ${NAYIN_NOTE[rel]||'bình'}.`];
  return { score: map[rel], reasons };
}
```

- [ ] **Step 2: Verify** — `scoreNayin(S,R,'sibling')` in score + reason.

- [ ] **Step 3: Commit** — `feat(family): nayin cross scorer (trục 6)`

---

### Task 5: Trục 2 — Cung★ tiền nghiệm (palace-star forward, cân 0.20)

**Files:** Modify `src/engine/family.js`

- [ ] **Step 1: Thêm hàm**

```js
// ---- TRỤC 2: CUNG★ TIỀN NGHIỆM (palace-star forward) — cân 0.20 ----
const PALACE_PILLAR = { father:'month', mother:'month', sibling:'month', spouse:'day', child:'time' };
function pillarGodsAt(pillar) {
  const out = [pillar.ganGod];
  for (const h of pillar.hidden) out.push(h.god);
  return out.filter(g => g && g !== '日主');
}
export function scorePalaceForward(S, R, role) {
  const isMale = S.chart.input.gender === 'nam';
  const need = elementForRole(S.chart.dayGan, isMale, role);
  const palKey = PALACE_PILLAR[role];
  const pillar = S.chart.pillars[palKey];
  const godsAt = pillarGodsAt(pillar);
  const starPresent = need.gods.some(g => godsAt.includes(g));
  const zhi = pillar.zhi;
  const unstable = S.interactions.chong.some(c => c.a===zhi||c.b===zhi) || S.interactions.xing.some(c => c.a===zhi||c.b===zhi);
  const rGrade = (R.synthesis && typeof R.synthesis.score === 'number') ? R.synthesis.score : 55;
  let score = 50; const reasons = [];
  if (starPresent && !unstable) { score += 22; reasons.push(`✓ Cung ${ROLE[role].vi} (${PALACE_VI[palKey]}) có đúng sao ${need.gods.map(g=>TEN_GOD_VI[g]).join('/')} và cung yên → dự đoán vai trò tốt.`); }
  else if (starPresent && unstable) { score += 6; reasons.push(`● Cung ${ROLE[role].vi} có sao đúng nhưng bị xung/hình → vai trò biến động.`); }
  else { score -= 6; reasons.push(`• Cung ${ROLE[role].vi} không thấy rõ sao vai trò → vai trò mờ/ẩn.`); }
  const predictGood = starPresent && !unstable;
  const rGood = rGrade >= 55;
  if (predictGood === rGood) { score += 14; reasons.push(`✓ Nhất quán: dự đoán ${predictGood?'tốt':'khó'} ↔ thực tế lá ${ROLE[role].vi} ${rGood?'khá tốt':'trở ngại'} (grade ${rGrade}).`); }
  else { score -= 10; reasons.push(`⚠ Mâu thuẫn: dự đoán ${predictGood?'tốt':'khó'} nhưng lá ${ROLE[role].vi} thực tế ${rGood?'khá tốt':'trở ngại'} (grade ${rGrade}) — nên đối chiếu giờ/dữ liệu.`); }
  return { score: Math.max(5, Math.min(100, Math.round(score))), reasons };
}
```

- [ ] **Step 2: Verify** — `scorePalaceForward(S,R,'spouse')` in số + reasons.

- [ ] **Step 3: Commit** — `feat(family): palace-star forward confirmation (trục 2)`

---

### Task 6: Trục 4 + 5 — Cân bằng Ngũ Hành gia tộc + thời vận (cluster)

**Files:** Modify `src/engine/family.js`

- [ ] **Step 1: Thêm 2 hàm**

```js
// ---- TRỤC 4: CÂN BẰNG NGŨ HÀNH GIA TỘC (cluster) — cân 0.15 ----
export function scoreFamilyBalance(center, members) {
  const all = [center.R, ...members.map(m => m.R)];
  const need = center.R.yong.primary;
  let sum = 0;
  all.forEach(R => { sum += (R.wx.score[need]||0)/(R.wx.total||1); });
  const avg = sum / all.length;
  let score = Math.round(Math.min(100, avg * 320));
  const reasons = [`Cả gia tộc (${all.length} người) trung bình hành ${WX_VI[need]} (Dụng chủ thể) = ${(avg*100).toFixed(0)}%. ${avg>=0.2?'✓ Gia đình tự bổ Dụng':'• Dụng ít được gia đình hỗ trợ, chủ thể tự lập.'}`];
  const present = new Set();
  all.forEach(R => { Object.entries(R.wx.score).forEach(([w,v]) => { if (v>0) present.add(w); }); });
  if (present.size >= 4) { score = Math.min(100, score + 8); reasons.push(`✓ Ngũ Hành gia tộc đa dạng (${[...present].map(w=>WX_VI[w]).join('/')}) → bổ sung lẫn nhau.`); }
  return { score: Math.max(5, Math.min(100, score)), reasons };
}

// ---- TRỤC 5: THỜI VẬN TƯƠNG QUAN (cluster) — cân 0.10 ----
export function scoreTimingCorrelation(center, members) {
  const dayun = center.R.dayun || [];
  if (!members.length || !dayun.length) return { score:55, reasons:['(chưa đủ dữ liệu thời vận)'] };
  let hits = 0; const reasons = [];
  for (const m of members) {
    const bYear = m.R.chart.input.year;
    const dy = dayun.find(d => bYear >= d.startYear && bYear < d.startYear + 10);
    if (dy) {
      const cat = dy.rating === 'Cát' || dy.rating === 'Hơi thuận';
      if (cat) { hits++; reasons.push(`✓ ${ROLE[m.role]?.vi||m.label}: sinh ${bYear} trong đại vận ${dy.ganZhi} (${dy.rating}) → cát.`); }
      else if (dy.rating === 'Hung' || dy.rating === 'Hơi nghịch') { reasons.push(`⚠ ${ROLE[m.role]?.vi||m.label}: sinh ${bYear} trong đại vận ${dy.ganZhi} (${dy.rating}) → trở ngại.`); }
    }
  }
  return { score: Math.max(5, Math.min(100, 45 + Math.round(hits / members.length * 55))), reasons };
}
```

- [ ] **Step 2: Verify** — dựng center + 2 members, gọi cả 2 hàm → số + reasons.

- [ ] **Step 3: Commit** — `feat(family): cluster axes — family balance + timing (trục 4,5)`

---

### Task 7: Tổng hợp `analyzePair` + `analyzeFamily` + ledger + radar

**Files:** Modify `src/engine/family.js`

- [ ] **Step 1: Thêm hàm tổng hợp**

```js
export function analyzePair(S, R, role) {
  const reciprocity = scoreReciprocity(S, R, role);
  const palaceForward = scorePalaceForward(S, R, role);
  const stemBranch = scoreStemBranch(S, R, role);
  const nayin = scoreNayin(S, R, role);
  const pairW = { reciprocity:0.45, palaceForward:0.25, stemBranch:0.20, nayin:0.10 };
  const pairScore = Math.round(reciprocity.score*pairW.reciprocity + palaceForward.score*pairW.palaceForward + stemBranch.score*pairW.stemBranch + nayin.score*pairW.nayin);
  const ledger = [];
  [reciprocity, palaceForward, stemBranch, nayin].forEach(ax => {
    ax.reasons.forEach(r => {
      if (r.startsWith('✓')) ledger.push({ ok:true,  msg:r });
      else if (r.startsWith('⚠') || r.startsWith('✗')) ledger.push({ ok:false, msg:r });
    });
  });
  const rating = pairScore >= 72 ? 'Khớp cao' : pairScore >= 55 ? 'Khớp vừa' : pairScore >= 40 ? 'Lệch nhẹ' : 'Lệch lớn';
  return { role, roleVi: ROLE[role].vi, pairScore, rating, axes:{ reciprocity, palaceForward, stemBranch, nayin }, ledger };
}

function avgAx(pairs, key) {
  const v = pairs.map(p => p.pair.axes[key]?.score).filter(x => x != null);
  return v.length ? v.reduce((a,b)=>a+b,0)/v.length : 50;
}

// center: { R, label? }  members: [{ role, label, R, hourUnknown? }]
export function analyzeFamily(center, members) {
  const pairs = members.map(m => ({ role:m.role, label:m.label, hourUnknown:!!m.hourUnknown, pair: analyzePair(center.R, m.R, m.role) }));
  const familyBalance = scoreFamilyBalance(center, members);
  const timing = scoreTimingCorrelation(center, members);
  const avgPair = pairs.length ? pairs.reduce((a,p)=>a+p.pair.pairScore,0)/pairs.length : 50;
  const score = Math.round(avgPair*0.75 + familyBalance.score*0.15 + timing.score*0.10);
  const rating = score >= 72 ? 'Gia tộc nhất quán cao' : score >= 55 ? 'Gia tộc khá nhất quán' : score >= 40 ? 'Gia tộc lệch nhẹ' : 'Gia tộc mâu thuẫn nhiều';
  const ledger = [];
  pairs.forEach(p => p.pair.ledger.forEach(l => ledger.push({ ...l, who: p.label || ROLE[p.role].vi })));
  [familyBalance, timing].forEach(ax => ax.reasons.forEach(r => ledger.push({ ok: !/⚠|✗/.test(r), msg:r, who:'Cả gia tộc' })));
  const confirms = ledger.filter(l=>l.ok).length;
  const radar = [
    { axis:'Vai trò', value: avgAx(pairs,'reciprocity') },
    { axis:'Cung★',   value: avgAx(pairs,'palaceForward') },
    { axis:'Can-Chi', value: avgAx(pairs,'stemBranch') },
    { axis:'Ngũ hành',value: familyBalance.score },
    { axis:'Thời vận',value: timing.score },
    { axis:'Nạp âm',  value: avgAx(pairs,'nayin') },
  ].map(d => ({ ...d, value: +(d.value/10).toFixed(1) }));
  return { center, members, pairs, familyBalance, timing, score, rating, ledger, confirms, conflicts: ledger.length - confirms, radar };
}
```

- [ ] **Step 2: Verify end-to-end**

```bash
node --input-type=module -e "
import{analyze}from'./src/engine/chart.js';import{analyzeFamily}from'./src/engine/family.js';
const center={R:analyze(1995,8,12,9,30,'nu')};
const members=[{role:'father',label:'Bố',R:analyze(1968,5,2,7,0,'nam')},{role:'mother',label:'Mẹ',R:analyze(1971,11,9,5,30,'nu')},{role:'spouse',label:'Chồng',R:analyze(1992,3,18,20,0,'nam')},{role:'child',label:'Con',R:analyze(2020,7,7,11,0,'nu')}];
const fam=analyzeFamily(center,members);
console.log('CLUSTER',fam.score,fam.rating,'| xác',fam.confirms,'nghiệm',fam.conflicts);
fam.pairs.forEach(p=>console.log(' ',p.label,p.pair.pairScore,p.pair.rating));
console.log('radar',fam.radar.map(r=>r.axis+':'+r.value).join(' '));
"
```
Expected: cluster score + rating + mỗi người 1 dòng + radar 6 trục. Deterministic.

- [ ] **Step 3: Commit** — `feat(family): analyzePair + analyzeFamily aggregate + ledger + radar`

---

### Task 8: Generator dữ liệu sơ đồ (`family-diagram.js`)

**Files:** Create `src/engine/family-diagram.js`

- [ ] **Step 1: Viết module**

```js
// src/engine/family-diagram.js — dữ liệu sơ đồ nghiệm chứng (render do main.js).
import { analyzePair } from './family.js';

export function radialData(family, opts = {}) {
  const cx = opts.cx ?? 150, cy = opts.cy ?? 150, r = opts.r ?? 110;
  const nodes = [{ id:'center', label: family.center.label || 'Chủ thể',
    dm: family.center.R.chart.dayMaster.gan, x:cx, y:cy, isCenter:true }];
  const edges = [];
  family.pairs.forEach((p, i) => {
    const ang = -Math.PI/2 + (i / Math.max(1, family.pairs.length)) * 2 * Math.PI;
    const x = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang);
    nodes.push({ id:p.label, label:p.label, roleVi:p.pair.roleVi,
      dm: family.members[i].R.chart.dayMaster.gan, x:+x.toFixed(1), y:+y.toFixed(1) });
    const tone = p.pair.pairScore >= 72 ? 'good' : p.pair.pairScore >= 55 ? 'mid' : 'bad';
    edges.push({ from:'center', to:p.label, score:p.pair.pairScore, tone, label:String(p.pair.pairScore) });
  });
  return { nodes, edges };
}

const INVERSE = { father:'child', mother:'child', child:'father', spouse:'spouse', sibling:'sibling' };
export function matrixData(family) {
  const people = [{ id:'center', label: family.center.label||'Chủ thể', R: family.center.R, role:'self' },
    ...family.members.map((m,i) => ({ id:m.label, label:m.label, R:m.R, role: family.pairs[i].role }))];
  const cells = [];
  for (let i=0;i<people.length;i++) for (let j=0;j<people.length;j++) {
    if (i === j) { cells.push({ i, j, score:null }); continue; }
    let role = people[j].role;
    if (people[i].role !== 'self') role = (people[j].role === 'self') ? INVERSE[role] : 'sibling';
    let s = null;
    try { s = analyzePair(people[i].R, people[j].R, role).pairScore; } catch (e) { s = null; }
    cells.push({ i, j, score:s });
  }
  return { labels: people.map(p=>p.label), cells };
}

export function radarData(family) {
  return family.radar.map(d => ({ axis:d.axis, value:d.value }));
}
```

- [ ] **Step 2: Verify shape**

```bash
node --input-type=module -e "
import{analyze}from'./src/engine/chart.js';import{analyzeFamily}from'./src/engine/family.js';import{radialData,radarData,matrixData}from'./src/engine/family-diagram.js';
const fam=analyzeFamily({R:analyze(1995,8,12,9,30,'nu')},[{role:'spouse',label:'Chồng',R:analyze(1992,3,18,20,0,'nam')}]);
console.log('nodes',radialData(fam).nodes.length,'edges',radialData(fam).edges.length,'radar',radarData(fam).length,'matrix labels',matrixData(fam).labels.length);
"
```
Expected: `nodes 2 | edges 1 | radar 6` (matrix labels = 2).

- [ ] **Step 3: Commit** — `feat(family): diagram data generators (radial/matrix/radar)`

---

### Task 9: UI — Section gia tộc (`index.html`) + render an toàn XSS (`main.js`)

> **Bắt buộc an toàn:** mọi chuỗi từ người dùng (label) hoặc engine đều đi qua `esc()` trước khi ghép HTML; gán `el.innerHTML = biến` (không nội suy `${}` trực tiếp lên dòng gán) → tránh XSS. Khác với nhiều hàm cũ trong main.js, code mới tuân chuẩn này.

**Files:** Modify `index.html`, `src/main.js`

- [ ] **Step 1: Tìm điểm chèn trong index.html**

```bash
cd "app bói toán" && grep -n 'id="hh-out"\|id="zh-section"\|<section' index.html | head
```
Xác định section Hợp Hôn (`hh-`) → chèn sau.

- [ ] **Step 2: Chèn section HTML vào index.html**

```html
<!-- ============ NGHIỆM CHỨNG GIA TỘC ============ -->
<section class="card" id="family-section">
  <h3>👪 Nghiệm chứng gia tộc Bát Tự (家族八字交叉验证)</h3>
  <p class="hint">Người trung tâm = lá số form chính (vd: em gái). Thêm người thân để chấm độ nhất quán 6 trục cổ pháp + sơ đồ + sổ cái xác/nghiệm.</p>
  <div id="family-members"></div>
  <div class="fam-actions">
    <button type="button" id="fam-add" class="btn-sub">+ Thêm người thân</button>
    <button type="button" id="family-btn" class="btn-main">Nghiệm chứng</button>
  </div>
  <div id="family-score"></div>
  <div id="family-constellation"></div>
  <details><summary>Sổ cái xác / nghiệm (chi tiết từng trục)</summary><div id="family-ledger"></div></details>
  <details><summary>Ma trận cặp + Radar 6 trục</summary><div id="family-matrix"></div><div id="family-radar"></div></details>
  <div id="family-rectify"></div>
</section>
```

- [ ] **Step 3: Thêm state + helper esc + handlers + render vào main.js**

Ngay sau dòng `let currentResult = null;` (~dòng 44) thêm state; và thêm import đầu file:

```js
// đầu main.js, gần các import khác:
import { analyzeFamily } from './engine/family.js';
import { radialData, matrixData, radarData } from './engine/family-diagram.js';
```
Sau `let currentTopic = 'general';`:

```js
// ---- STATE + HELPERS GIA TỘC (an toàn XSS) ----
let familyMembers = []; // [{role,label,date,time,gender,hourUnknown}]
const ROLE_OPTS = [
  { v:'father', t:'Cha' }, { v:'mother', t:'Mẹ' }, { v:'sibling', t:'Anh/chị/em' },
  { v:'spouse', t:'Vợ/Chồng' }, { v:'child', t:'Con cái' },
];
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
  { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
));
```

- [ ] **Step 4: Thêm các hàm render + wiring vào main.js**

```js
function renderFamilyForm() {
  const rows = familyMembers.map((m, i) => {
    const opts = ROLE_OPTS.map(o => `<option value="${o.v}" ${m.role===o.v?'selected':''}>${o.t}</option>`).join('');
    return [
      '<div class="fam-row">',
      `<select data-i="${i}" data-k="role">${opts}</select>`,
      `<input data-i="${i}" data-k="label" placeholder="Tên/ghi chú" value="${esc(m.label||'')}">`,
      `<input type="date" data-i="${i}" data-k="date" value="${esc(m.date||'')}">`,
      `<input type="time" data-i="${i}" data-k="time" value="${esc(m.time||'')}">`,
      `<label class="fam-g"><input type="radio" name="fam-g-${i}" value="nam" data-i="${i}" data-k="gender" ${m.gender==='nam'?'checked':''}> Nam</label>`,
      `<label class="fam-g"><input type="radio" name="fam-g-${i}" value="nu"  data-i="${i}" data-k="gender" ${m.gender!=='nam'?'checked':''}> Nữ</label>`,
      `<label class="fam-unk"><input type="checkbox" data-i="${i}" data-k="hourUnknown" ${m.hourUnknown?'checked':''}> giờ chưa rõ</label>`,
      `<button type="button" class="fam-del" data-i="${i}">✕</button>`,
      '</div>',
    ].join('');
  });
  const html = rows.length ? rows.join('') : '<p class="hint">Chưa có người thân. Bấm "+ Thêm người thân".</p>';
  $('family-members').innerHTML = html;
}

function runFamily() {
  if (!currentResult) { $('family-score').textContent = 'Nhập ngày sinh người trung tâm rồi luận giải trước.'; return; }
  const members = familyMembers.filter(m => m.date).map(m => {
    const [y, mo, d] = m.date.split('-').map(Number);
    const [h, mi] = (m.time || '12:00').split(':').map(Number);
    return { role:m.role, label:(m.label || ROLE_OPTS.find(o=>o.v===m.role).t),
      R: analyze(y, mo, d, h, mi, m.gender), hourUnknown: m.hourUnknown };
  });
  if (!members.length) { $('family-score').textContent = 'Thêm ít nhất 1 người thân có ngày sinh.'; return; }
  const fam = analyzeFamily({ R: currentResult, label: 'Chủ thể' }, members);
  renderFamilyScore(fam);
  renderFamilyConstellation(fam);
  renderFamilyLedger(fam);
  renderFamilyMatrix(fam);
  renderFamilyRadar(fam);
  if (window.__rectifyFamily) window.__rectifyFamily(fam, members);
}

function renderFamilyScore(fam) {
  const cls = fam.score >= 72 ? 'rate-cat' : fam.score >= 55 ? 'rate-mid' : 'rate-hung';
  const html = `<div class="fam-score-head"><span class="ln-rate ${cls}">${fam.score}/100</span> <b>${esc(fam.rating)}</b>`
    + ` · xác <b style="color:#2e9e5b">${fam.confirms}</b> / nghiệm <b style="color:#e0533d">${fam.conflicts}</b></div>`;
  $('family-score').innerHTML = html;
}

function renderFamilyLedger(fam) {
  const html = fam.ledger.map(l => {
    const mark = l.ok ? '✓' : '⚠';
    const cls = l.ok ? 'ok' : 'bad';
    const msg = esc(l.msg.replace(/^[✓⚠✗●•]\s*/, ''));
    return `<div class="fam-ledger ${cls}">${mark} <b>[${esc(l.who)}]</b> ${msg}</div>`;
  }).join('');
  $('family-ledger').innerHTML = html;
}

function renderFamilyConstellation(fam) {
  const d = radialData(fam);
  const findNode = (id) => d.nodes.find(n => n.id === id);
  const edgeTags = d.edges.map(e => {
    const a = findNode(e.from), b = findNode(e.to);
    const color = e.tone === 'good' ? '#2e9e5b' : e.tone === 'mid' ? '#caa14a' : '#e0533d';
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${color}" stroke-width="${1 + e.score/30}"/>`
      + `<text x="${mx}" y="${my - 4}" text-anchor="middle" class="svg-edge">${esc(e.label)}</text>`;
  });
  const nodeTags = d.nodes.map(n => [
    `<circle cx="${n.x}" cy="${n.y}" r="${n.isCenter?22:16}" class="svg-node ${n.isCenter?'center':''}"/>`,
    `<text x="${n.x}" y="${n.y + 5}" text-anchor="middle" class="svg-dm">${esc(n.dm || '★')}</text>`,
    `<text x="${n.x}" y="${n.y + (n.isCenter?34:28)}" text-anchor="middle" class="svg-label">${esc(n.label)}</text>`,
    `<text x="${n.x}" y="${n.y + (n.isCenter?46:40)}" text-anchor="middle" class="svg-sub">${esc(n.roleVi || '')}</text>`,
  ].join(''));
  const svg = `<svg viewBox="0 0 300 300" class="fam-svg" role="img" aria-label="Sơ đồ chòm sao gia tộc">${edgeTags.join('')}${nodeTags.join('')}</svg>`
    + '<p class="hint">Nhánh xanh = khớp cao · vàng = vừa · đỏ = mâu thuẫn (nên đối chiếu giờ/dữ liệu).</p>';
  $('family-constellation').innerHTML = svg;
}

function renderFamilyMatrix(fam) {
  const d = matrixData(fam);
  const cls = (s) => s == null ? 'mid' : s >= 72 ? 'cat' : s >= 55 ? 'mid' : 'bad';
  const head = '<tr><th></th>' + d.labels.map(l => `<th>${esc(l)}</th>`).join('') + '</tr>';
  const body = d.labels.map((lab, i) => {
    const tds = d.labels.map((_, j) => {
      const c = d.cells.find(x => x.i === i && x.j === j);
      const val = c && c.score != null ? c.score : '—';
      return `<td class="${cls(c && c.score)}">${val}</td>`;
    }).join('');
    return `<tr><th>${esc(lab)}</th>${tds}</tr>`;
  }).join('');
  $('family-matrix').innerHTML = `<table class="fam-matrix"><thead>${head}</thead><tbody>${body}</tbody></table>`;
}

function renderFamilyRadar(fam) {
  const cx = 120, cy = 120, R = 90, N = fam.radar.length;
  const pt = (val, k) => { const ang = -Math.PI/2 + k * 2 * Math.PI / N, rr = R * val / 10;
    return [cx + rr * Math.cos(ang), cy + rr * Math.sin(ang)]; };
  const grid = [2, 4, 6, 8, 10].map(g => {
    const poly = Array.from({ length:N }, (_, k) => pt(g, k).map(x => +x.toFixed(1)).join(',')).join(' ');
    return `<polygon points="${poly}" fill="none" stroke="#444" stroke-width="0.5"/>`;
  }).join('');
  const axes = fam.radar.map((d, k) => {
    const [x, y] = pt(10, k); const [lx, ly] = pt(11.5, k);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#444" stroke-width="0.5"/>`
      + `<text x="${lx}" y="${ly}" text-anchor="middle" class="svg-sub">${esc(d.axis)}</text>`;
  }).join('');
  const dataPoly = fam.radar.map((d, k) => pt(d.value, k).map(x => +x.toFixed(1)).join(',')).join(' ');
  const dots = fam.radar.map((d, k) => { const [x, y] = pt(d.value, k); return `<circle cx="${x}" cy="${y}" r="2.5" fill="#e0533d"/>`; }).join('');
  $('family-radar').innerHTML = `<svg viewBox="0 0 240 240" class="fam-svg">${grid}${axes}`
    + `<polygon points="${dataPoly}" fill="rgba(202,161,74,.3)" stroke="#caa14a" stroke-width="2"/>${dots}</svg>`;
}

// wiring
$('fam-add').addEventListener('click', () => { familyMembers.push({ role:'father', label:'', date:'', time:'', gender:'nam', hourUnknown:false }); renderFamilyForm(); });
$('family-members').addEventListener('click', (e) => {
  if (e.target.classList.contains('fam-del')) { familyMembers.splice(+e.target.dataset.i, 1); renderFamilyForm(); }
});
$('family-members').addEventListener('change', (e) => {
  const t = e.target; if (t.dataset.i == null) return;
  const i = +t.dataset.i, k = t.dataset.k;
  familyMembers[i][k] = (k === 'hourUnknown') ? t.checked : t.value;
  if (k === 'role') renderFamilyForm();
});
$('family-btn').addEventListener('click', runFamily);
renderFamilyForm();
```

- [ ] **Step 5: Verify build**

```bash
cd "app bói toán" && npm run build 2>&1 | tail -5
```
Expected: build OK (import resolve, no syntax error). Nếu lỗi circular import → `family.js` chỉ import 1 chiều (constants/core/nayin), `family-diagram.js` import `family.js` 1 chiều, OK.

- [ ] **Step 6: Commit** — `feat(family): UI section + XSS-safe render (constellation/matrix/radar/ledger)`

---

### Task 10: Test deterministic + CSS + script test

**Files:** Modify `selftest.mjs`, `src/style.css`, `package.json`

- [ ] **Step 1: Thêm block test vào selftest.mjs** (cuối file, trước bất kỳ dòng tổng kết nào)

```js
// ################## 5. NGHIỆM CHỨNG GIA TỘC ##################
import { analyzeFamily, analyzePair, elementForRole, scoreReciprocity } from './src/engine/family.js';
import { rectifyHour } from './src/engine/family-rectify.js';
console.log('\n################## 5. NGHIỆM CHỨNG GIA TỘC ##################');
assert(elementForRole('甲', true, 'father').wx  === '土', '甲 nam: cha = Thổ (Tài)');
assert(elementForRole('甲', true, 'mother').wx  === '水', '甲 nam: mẹ = Thủy (Ấn)');
assert(elementForRole('甲', true, 'child').wx   === '金', '甲 nam: con = Kim (Quan)');
assert(elementForRole('甲', false, 'spouse').wx === '金', '甲 nữ: chồng = Kim (Quan)');
const S = analyze(1990, 6, 15, 14, 30, 'nam');
const fakeFather = { ...S, chart: { ...S.chart, dayMaster: { ...S.chart.dayMaster, gan:'戊', wx:'土' } }, wx: S.wx };
assert(scoreReciprocity(S, fakeFather, 'father').score === 100, 'reciprocity: cha 日主 Thổ = đúng hành → 100');
const mk = (y, mo, d, h, mi, g) => analyze(y, mo, d, h, mi, g);
const famArgs = () => ({ R: mk(1995,8,12,9,30,'nu') }, [
  { role:'father', label:'Bố',   R: mk(1968,5,2,7,0,'nam') },
  { role:'mother', label:'Mẹ',   R: mk(1971,11,9,5,30,'nu') },
  { role:'spouse', label:'Chồng',R: mk(1992,3,18,20,0,'nam') },
  { role:'child',  label:'Con',  R: mk(2020,7,7,11,0,'nu') },
]);
// NOTE: famArgs trên trả về center+members; viết rõ ràng hơn:
const center = { R: mk(1995,8,12,9,30,'nu') };
const mems = [
  { role:'father', label:'Bố',   R: mk(1968,5,2,7,0,'nam') },
  { role:'mother', label:'Mẹ',   R: mk(1971,11,9,5,30,'nu') },
  { role:'spouse', label:'Chồng',R: mk(1992,3,18,20,0,'nam') },
  { role:'child',  label:'Con',  R: mk(2020,7,7,11,0,'nu') },
];
const fam1 = analyzeFamily(center, mems);
const fam2 = analyzeFamily({ R: mk(1995,8,12,9,30,'nu') }, mems.map(m => ({ ...m, R: mk(m.R.chart.input.year, m.R.chart.input.month, m.R.chart.input.day, m.R.chart.input.hour, m.R.chart.input.minute, m.R.chart.input.gender) })));
assert(JSON.stringify(fam1) === JSON.stringify(fam2), 'analyzeFamily deterministic');
assert(typeof fam1.score === 'number' && fam1.score > 0 && fam1.score <= 100, 'cluster score hợp lệ');
assert(fam1.radar.length === 6, 'radar 6 trục');
assert(fam1.confirms + fam1.conflicts === fam1.ledger.length, 'ledger: xác+nghiệm = tổng');
const rh1 = rectifyHour(center, { role:'child', label:'Con', R: mk(2020,7,7,11,0,'nu') });
const rh2 = rectifyHour(center, { role:'child', label:'Con', R: mk(2020,7,7,11,0,'nu') });
assert(JSON.stringify(rh1) === JSON.stringify(rh2), 'rectifyHour deterministic');
assert(rh1.candidates.length === 5 && rh1.best.score >= 0 && rh1.best.score <= 100, 'rectify 5 ứng viên + score hợp lệ');
console.log('  → Cluster', fam1.score, fam1.rating, '| xác', fam1.confirms, 'nghiệm', fam1.conflicts, '| rectify best', rh1.best.zhiVi, rh1.best.score);
```

- [ ] **Step 2: Thêm CSS vào src/style.css**

```css
/* ---- NGHIỆM CHỨNG GIA TỘC ---- */
.fam-actions{margin:8px 0}
.fam-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:6px 0;padding:6px;border:1px solid var(--border,#444);border-radius:8px}
.fam-row input,.fam-row select{padding:4px;background:var(--bg2,#1b1b2b);color:var(--fg,#eee);border:1px solid #444;border-radius:6px}
.fam-row .fam-del{background:#e0533d;color:#fff;border:none;border-radius:6px;padding:4px 8px;cursor:pointer}
.fam-score-head{font-size:16px;margin:8px 0}
.fam-svg{width:100%;max-width:380px;display:block;margin:auto}
.fam-svg .svg-node{fill:rgba(202,161,74,.18);stroke:#caa14a;stroke-width:2}
.fam-svg .svg-node.center{fill:rgba(224,83,61,.25);stroke:#e0533d;stroke-width:3}
.fam-svg .svg-edge{fill:#fff;font-size:10px;font-weight:bold}
.fam-svg .svg-label{fill:var(--fg,#eee);font-size:10px}
.fam-svg .svg-sub{fill:var(--muted,#999);font-size:8px}
.fam-svg .svg-dm{fill:#caa14a;font-size:14px;font-weight:bold}
.fam-ledger{font-size:12px;padding:4px 6px;margin:3px 0;border-left:3px solid #888;background:var(--bg2,#1b1b2b)}
.fam-ledger.ok{border-color:#2e9e5b}.fam-ledger.bad{border-color:#e0533d}
.fam-matrix{border-collapse:collapse;font-size:11px;margin:8px 0}
.fam-matrix th,.fam-matrix td{border:1px solid #444;padding:4px 8px;text-align:center}
.fam-matrix td.cat{background:rgba(46,158,91,.25)}.fam-matrix td.bad{background:rgba(224,83,61,.25)}.fam-matrix td.mid{background:rgba(202,161,74,.12)}
.btn-sub{background:#2a2a40;color:#eee;border:1px solid #555;border-radius:8px;padding:6px 10px;cursor:pointer}
.btn-main{background:#caa14a;color:#1b1b2b;border:none;border-radius:8px;padding:8px 14px;font-weight:bold;cursor:pointer}
```

- [ ] **Step 3: Thêm script test trong package.json** (`"scripts"`):
```json
"test": "node selftest.mjs"
```

- [ ] **Step 4: Chạy test**

```bash
cd "app bói toán" && node selftest.mjs 2>&1 | grep -A3 "NGHIỆM CHỨNG GIA TỘC"
```
Expected: tất cả `✓`, 0 `❌ FAIL` trong block 5.

- [ ] **Step 5: Build + verify headless**

```bash
npm run build && node verify-visual.mjs 2>&1 | tail -8
```
Expected: build OK, verify-visual không có console error mới.

- [ ] **Step 6: Commit** — `test(family): deterministic asserts + CSS + test script`

---

## Phase 2 — Hiệu chỉnh giờ sinh + wiring

> Phase 1 đã có đủ 3 sơ đồ + ledger (Task 9). Phase 2 thêm engine + UI hiệu chỉnh giờ.

### Task 11: Engine hiệu chỉnh giờ (`family-rectify.js`)

**Files:** Create `src/engine/family-rectify.js`

- [ ] **Step 1: Viết module**

```js
// src/engine/family-rectify.js — HIỆU CHỈNH GIỜ SINH (校正时辰)
// Người "giờ chưa rõ": thử 12 时辰, mỗi giờ tính lại analyze() + chấm coherence
// cụm → rank. Trọng số thêm vai trò con (trụ Giờ = cung Tử Nữ, nhạy giờ).
import { analyze } from './chart.js';
import { analyzeFamily } from './family.js';
import { ZHI } from './constants.js';
const ZHI_BY_HOUR = { 0:'子', 2:'丑', 4:'寅', 6:'卯', 8:'辰', 10:'巳', 12:'午', 14:'未', 16:'申', 18:'酉', 20:'戌', 22:'亥' };

/**
 * @param center {R,label?}  (chủ thể, giờ đã rõ)
 * @param member {role,label,R}  R.chart.input dùng để lấy y/m/d + gender (chỉ đổi giờ)
 * @param otherMembers [{role,label,R}]
 * @returns {{ candidates:[{hour,zhi,zhiVi,familyScore,score,delta}], best, verdict }}
 */
export function rectifyHour(center, member, otherMembers = []) {
  const inp = member.R.chart.input;
  const candidates = [];
  for (const hour of [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]) {
    const R = analyze(inp.year, inp.month, inp.day, hour, 0, inp.gender);
    const members = [{ role: member.role, label: member.label, R }, ...otherMembers];
    const fam = analyzeFamily(center, members);
    let childBoost = 0;
    const childPair = fam.pairs.find(p => p.role === 'child');
    if (childPair) childBoost = (childPair.pair.axes.reciprocity.score - 50) * 0.2;
    const score = Math.round(fam.score + childBoost);
    candidates.push({ hour, zhi: ZHI_BY_HOUR[hour], zhiVi: ZHI[ZHI_BY_HOUR[hour]].vi, familyScore: fam.score, score, delta: 0 });
  }
  candidates.sort((a, b) => b.score - a.score);
  const top = candidates[0].score;
  candidates.forEach(c => { c.delta = c.score - top; });
  const best = candidates[0];
  const second = candidates[1];
  const clear = best.score - (second ? second.score : 0) >= 4;
  const verdict = clear
    ? `Giờ ${best.zhiVi} (${best.hour}h) cho điểm nhất quán cao nhất (${best.score}), hơn giờ nhì ${best.score - (second?second.score:0)} điểm → khả năng cao đây là giờ sinh thật.`
    : `Nhiều giờ cho điểm gần nhau (top ${best.score}, nhì ${second?second.score:'?'}). Giờ khó phân biệt rõ — cần thêm dữ kiện (số anh chị em, sự kiện đời).`;
  return { candidates: candidates.slice(0, 5), best, verdict };
}
```

- [ ] **Step 2: Verify**

```bash
node --input-type=module -e "
import{analyze}from'./src/engine/chart.js';import{rectifyHour}from'./src/engine/family-rectify.js';
const center={R:analyze(1995,8,12,9,30,'nu')};
const child=analyze(2020,7,7,11,0,'nu');
const r=rectifyHour(center,{role:'child',label:'Con',R:child});
console.log('best',r.best.zhiVi,r.best.hour+'h',r.best.score);
r.candidates.forEach(c=>console.log(' ',c.zhiVi,c.hour+'h',c.score,'Δ'+c.delta));
console.log(r.verdict);
"
```
Expected: 5 ứng viên + best + verdict. (Chỉ đổi trụ Giờ vì dùng input.year/month/day cố định.)

- [ ] **Step 3: Commit** — `feat(rectify): hour rectification engine (校正时辰)`

---

### Task 12: Wire rectification UI

**Files:** Modify `src/main.js`

- [ ] **Step 1: Thêm import + hàm rectify render**

```js
import { rectifyHour } from './engine/family-rectify.js';
window.__rectifyFamily = function (fam, members) {
  const unk = members.filter(m => m.hourUnknown);
  if (!unk.length) { $('family-rectify').innerHTML = ''; return; }
  const known = members.filter(m => !m.hourUnknown).map(m => ({ role:m.role, label:m.label, R:m.R }));
  const blocks = unk.map(m => {
    const r = rectifyHour({ R: currentResult, label:'Chủ thể' }, m, known);
    const rows = r.candidates.map(c => `<tr><td>${esc(c.zhiVi)} (${c.hour}h)</td><td><b>${c.score}</b></td><td>${c.delta === 0 ? '★ tốt nhất' : c.delta}</td></tr>`).join('');
    return `<div class="fam-rectify"><b>⏰ Hiệu chỉnh giờ — ${esc(m.label)}</b>`
      + `<p class="hint">${esc(r.verdict)}</p>`
      + `<table class="fam-matrix"><thead><tr><th>Giờ</th><th>Điểm</th><th>Δ</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }).join('');
  $('family-rectify').innerHTML = `<h4 class="syn-h4">Hiệu chỉnh giờ sinh (người đánh "giờ chưa rõ")</h4>${blocks}`;
};
```
(`runFamily()` ở Task 9 đã gọi `window.__rectifyFamily(fam, members)`.)

- [ ] **Step 2: Verify thủ công** — `npm run dev`, nhập chủ thể + 1 người thân đánh "giờ chưa rõ" → bấm Nghiệm chứng → thấy bảng 5 giờ + verdict, console không lỗi.

- [ ] **Step 3: Commit** — `feat(family): wire hour-rectification UI`

---

### Task 13: README + final verification

**Files:** Modify `README.md`

- [ ] **Step 1: Thêm section sau "## Lục Thân (六亲)"**

````markdown
## Nghiệm chứng gia tộc (家族八字交叉验证)

Nhập lá số người trung tâm (form chính) + thêm người thân (bố/mẹ/anh chị/chồng/con)
→ chấm **độ nhất quán** giữa các lá số theo **6 trục cổ pháp**:

| Trục | Cân | Cơ sở |
|------|-----|-------|
| Vai trò phản nghiệm (十神角色互验) | 0.35 | 日 chủ người thân = đúng hành vai trò (子平真诠) |
| Cung★ tiền nghiệm (星宫交叉验证) | 0.20 | cung+sao dự đoán ↔ thực tế lá người thân |
| Can-Chi tương tác | 0.15 | hợp/xung ngày-tháng giữa 2 lá |
| Cân bằng Ngũ Hành gia tộc | 0.15 | gia đình có bổ Dụng cho nhau |
| Thời vận tương quan | 0.10 | năm sinh người thân rơi đại vận CÁT |
| Nạp âm tương quan | 0.05 | nạp âm nhật trụ sinh/khích |

Xuất: **điểm cluster 0-100**, sơ đồ **chòm sao** + **ma trận** + **radar 6 trục**, và **sổ cái xác/nghiệm**.
Người đánh "giờ chưa rõ" → **hiệu chỉnh giờ sinh** (quét 12 giờ, lấy giờ cho điểm nhất quán cao nhất; trọng số vai trò con vì trụ Giờ = cung Tử Nữ).

> Cơ sở: 家族八字互验法, 校正时辰 qua gia tộc. Kết quả tham khảo văn hoá–huyền học.
````

- [ ] **Step 2: Final gate**

```bash
cd "app bói toán" && node selftest.mjs 2>&1 | tail -5 && npm run build 2>&1 | tail -3
```
Expected: 0 FAIL mới, build OK.

- [ ] **Step 3: Commit** — `docs(family): README section`

---

## Self-Review (chạy sau khi viết)

**1. Spec coverage:**
- Nhập cụm gia tộc → `runFamily()` Task 9 ✓
- 6 trục cổ pháp → Task 2-6 ✓
- Sơ đồ phức tạp → chòm sao + ma trận + radar Task 9 ✓
- Sổ cái xác/nghiệm → `renderFamilyLedger` Task 9 ✓
- Score + rating logic → `analyzeFamily` Task 7 ✓
- Hiệu chỉnh giờ → Task 11/12 ✓
- Tích hợp hợp lý → chỉ thêm file + 1 section + wiring, không sửa engine cũ ✓
- Không xung đột loop → tất cả là "thêm", Phase 1 shippable độc lập ✓
- An toàn XSS → `esc()` + gán biến Task 9/12 ✓

**2. Placeholder scan:** không có TBD/TODO. `INVERSE` map đầy đủ 5 vai trò. mọi hàm có code thật.

**3. Type consistency:**
- `analyzePair` → `{role,roleVi,pairScore,rating,axes:{reciprocity,palaceForward,stemBranch,nayin},ledger}`. `analyzeFamily`/`radialData`/`renderFamily*` đều dùng đúng key (`p.pair.pairScore`, `p.pair.roleVi`, `p.pair.axes.reciprocity.score`).
- `analyzeFamily` → `{center,members,pairs,familyBalance,timing,score,rating,ledger,confirms,conflicts,radar}`. `radarData`/`matrixData`/UI đọc đúng.
- `rectifyHour` → `{candidates:[{hour,zhi,zhiVi,familyScore,score,delta}],best,verdict}`. UI Task 12 đọc đúng.
- `elementForRole` → `{wx,gods}`. mọi caller `.wx` ✓.
- `analyze(input.year, input.month, input.day, hour, 0, input.gender)` đúng chữ ký `analyze(y,m,d,h,min,gender)`.

**Lỗi tiềm ẩn cần kiểm thủ công sau Phase 1:**
- Circular import: `family.js` import (constants, core, nayin) 1 chiều ✓; `family-diagram.js` import `family.js` ✓; `family-rectify.js` import (chart, family) ✓; `main.js` import cả 3 ✓.
- Build Vite: import path có `.js` + `"type":"module"` ✓.
- CSS `--bg2/--border/--fg/--muted`: dùng fallback `#1b1b2b/#444/#eee/#999` → chạy ngay cả khi var thiếu.

---

## Execution Handoff

Plan saved tại `docs/superpowers/plans/2026-06-21-bazi-family-cross-validation.md`. **Phase 1 (Task 1-10) ra phần mềm test được độc lập — không xung đột loop** (chỉ thêm file mới + 1 HTML section + wiring + CSS + test). Khuyến nghị: thực thi Phase 1 khi loop rảnh; Phase 2 (Task 11-13) sau.

Hai lựa chọn thực thi:
1. **Subagent-Driven (đề xuất)** — dispatch fresh subagent mỗi task, review giữa task, iter nhanh (sub-skill: superpowers:subagent-driven-development).
2. **Inline Execution** — thực thi trong session này theo batch + checkpoint (sub-skill: superpowers:executing-plans).

> Lưu ý: repo hiện **chưa init git**. Các bước commit sẽ lỗi tới khi `git init`. Nếu muốn giữ pattern commit → `git init` riêng; nếu không → bỏ qua commit, chỉ verify bằng `node selftest.mjs` + `npm run build`.
