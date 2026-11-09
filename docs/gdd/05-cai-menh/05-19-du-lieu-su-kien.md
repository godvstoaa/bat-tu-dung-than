# 05-19 · Dữ liệu và sự kiện — đặc tả cho kỹ thuật

> Hình dạng dữ liệu, sự kiện máy khách → máy chủ, máy trạng thái nhiệm vụ, đường ống nội dung, di trú từ `state.js` hiện có. Tài liệu 13 cấp mã `SCHEMA-*`, `TASK-xxx` và chốt công nghệ; phần này là **yêu cầu** của hệ 05. Mọi thứ ở đây **(chưa có — cần làm)** trừ khi ghi «đã có».

---

## 1. Nguyên tắc

| # | Nguyên tắc |
|---|---|
| D-1 | Luật nằm trong **dữ liệu** (bảng DEED, nhiệm vụ, giới, nghi lễ), không rải trong mã. Mã chỉ là bộ máy chạy luật. Như `cosmetics.js` hiện nay: «thuần dữ liệu + logic, không DOM» — client, máy chủ MMO và test dùng chung. |
| D-2 | Engine app (`src/engine/*`) **chỉ đọc**, không sửa để phục vụ game; mọi «vá» cho game nằm ở lớp chuyển đổi trong `src/game/` (vd lọc fallback `getRemedyForChart`, tắt cảnh báo Thâu đạo). Sửa lỗi engine là việc riêng của app (README · danh sách sửa). |
| D-3 | Máy chủ nhận **sự kiện**, không nhận điểm (05-14 §4.2). |
| D-4 | Ngày sinh không rời máy khách. Máy chủ chỉ có con số Tiềm Lực (cho k) và lịch sử của nó. |
| D-5 | Mọi chuỗi gửi vào `meritLedger` là nguyên văn `CONG_QUA[*].a` (05-03 §1.2). |

---

## 2. Tệp dữ liệu nội dung

Đề xuất thư mục `docs/game-data/caimenh/` (nguồn soạn) → build ra `src/game/data/caimenh/*.js` (module ES thuần, như `cosmetics.js`).

| Tệp | Nội dung | Nguồn trong tài liệu 05 |
|---|---|---|
| `deeds` | 237 luật DEED | 05-04 |
| `karma` | 10 thanh, thẻ nghiệp hội thoại, lượng | 05-05 §2 |
| `rites` | nghi lễ (Hồng Danh, Phát Lộ, Tịnh Kim Cang, Soi Sổ, Đại Bi, Pháp Hoa, Sám Tinh Thần) | 05-05 §4 |
| `shChains` | chuỗi `CQ-SH` 10 thanh | 05-05 §6 |
| `paths` | 10 đạo + Liễu Phàm: hạng, giới, hoạt động lõi, ái lực hành | 05-06…05-11 |
| `quests` | mọi `CQ-*` (MD, CN, TV, TC, TT, BD, TH, TD, MT, NH, BM, LP, SH, HD, TR, QN) | 05-02, 05-07…05-14 |
| `vanPhu` | 10 Vận Phù | 05-01 §2.2 |
| `tamDe` | 10 Tâm Đề theo nhật can (+ bản tự chọn iOS) | 05-01 §3.5 |
| `keyCards` | thẻ chìa khóa Ngũ Bộ | 05-17 §2.3 |
| `strangeCases` | danh mục 30 nguyên nhân + mẫu văn kể | 05-13 §3, §5 |
| `taLo` | ngưỡng hệ quả, loại nạn nhân, chuỗi `CQ-HD` mẫu | 05-12 |
| `quizBank` | ngân hàng đề | 05-16 |
| `lines` | thoại hệ thống | 05-17 |

### 2.1 Bản ghi DEED (ví dụ)

```js
{
  id: 'DEED-031',
  name: 'Giải cứu người bị Định Mệnh Hội giam đòi tiền «giải hạn»',
  type: 'thien',
  action: 'Cứu người nguy cấp',          // nguyên văn CONG_QUA.thien[1].a
  count: 2,
  trigger: { event: 'case_step_done', caseKind: 'dmh_rescue' },
  regions: ['*'],
  cooldown: { scope: 'case', once: true },
  antiFarm: ['CC-1', 'CC-2', 'CC-5'],
  hanh: ['CN', 'KT'],                     // mã hạnh TEN_THIEN (05-04 §1)
  am: false,                              // có nhánh âm thiện?
  ios: true
}
```

### 2.2 Bản ghi DEED ác (ví dụ)

```js
{
  id: 'DEED-212', name: 'Giữ túi tiền nhặt được', type: 'ac',
  action: 'Trộm cắp/lấy không nên lấy', count: 1,
  trigger: { event: 'dialog_choice', tag: 'giu_cua_roi' },
  karma: [{ bar: 'KARMA-DAO', mul: 8 }],  // +8 × p × count
  repair: { kind: 'hoan_tra', questTemplate: 'tra_do_roi', bonusPct: 20 },
  confirmTwice: true,                     // p = 3
  taLoNoAm: 0
}
```

### 2.3 Bản ghi nhiệm vụ (ví dụ)

```js
{
  id: 'CQ-TT-05', path: 'TT', title: 'Tiếng gõ đêm',
  requires: { rank: 1, quests: ['CQ-TT-04'] },
  steps: [
    { kind: 'case', template: 'strange_knock', mustBranches: ['A', 'C'] }
  ],
  reward: { B: 30, group: 'hoc', rankExamUnlock: 2 },
  teaches: ['quy-trinh-5-buoc', 'fs-cure'],
  optInAmTa: false,
  ios: { variant: 'same' }
}
```

### 2.4 Bản ghi giới

```js
{
  id: 'TC-G-thuong-truc-1', path: 'TC', kind: 'thuongTruc', rank: 1,
  text: 'Chay và không rượu',
  matches: [{ event: 'order_food', meat: true }, { event: 'order_drink', alcohol: true }],
  penalty: 'standard',                    // 05-01 §3.7
  restore: ['rite:any-path-TC', 'rite:tinh-kim-cang']
}
```

---

## 3. Trạng thái người chơi

### 3.1 Nhánh `caimenh` trong `state.js`

Bảng trường ở 05-01 §7. Bổ sung kiểu chi tiết:

```js
caimenh: {
  v: 1,
  daohanh: 0, daohanhLife: 0, realm: 1,
  dailyDH: { date: 'YYYY-MM-DD', base: 0, tinhKhi: 0, sources: { cong: 0, tu: 0, hoc: 0, truyen: 0, niem: 0 } },
  ledger: [ { deed, type, action, count, at, region, npc, am, huuHieu, repairedAt } ],   // tối đa 2.000 dòng gần nhất; cũ hơn gộp theo tháng
  ledgerMonthly: { 'YYYY-MM': { thien: n, ac: n, huuHieu: n } },
  congHuuHieu: 0,
  vows: [],                                 // [1,2,3]
  karma: { bars: { 'KARMA-SAT': 0, ... }, incidents: [ { id, bar, amount, left, at, npc, region, deed, steps: { suaSai, sam, gioiFrom } } ] },
  paths: { CN: { rank: 0, dhDao: 0, joinedAt, status: 'active'|'frozen'|'done', vowsKept: { id: daysFrom } } },
  mainPath: null,
  giuoiAn: [ { id, path, giuoi, at, amount, restored } ],
  tamDe: { week: 'YYYY-Www', key: 'on', days: [false x7] },
  chuyenNiem: { date, n, total, hoa: 0 },
  khiem: { n, manHidden: 0 },
  amBai: { has: false, until: null, usesToday: 0, noAm: 0, noAmPeak: 0, tiers: [], cases: [], hoiDauJar: 0, everHoiDau: false },
  menhDo: { chartHash, year, nodes: { space: { lamps, state, quests: [] }, ... }, archive: [] },
  vanPhu: { active: [ { id, until, pct } ] },
  journal: null                              // nhật ký đời thực: KHÔNG ở đây — lưu khóa riêng (05-03 §6)
}
```

### 3.2 Di trú từ trạng thái hiện có

| Trường hiện có (`state.js`) | Xử lý |
|---|---|
| `phucKhi`, `xp` | giữ nguyên (tầng Cải Vận; cấp gia trì `progress.js` vẫn theo `xp`) |
| `thaitue` | giữ; Đèn Niên đọc từ đây (`lampState`) |
| `wardrobe.bonus` | giữ; tính vào `vanMultiplier` (05-01 §2.5) |
| `caseLog`, `deskLog`, `mastery` | giữ; dùng làm nguồn sự kiện «học» cho Đạo Hạnh **từ thời điểm bật hệ 05** (không truy thu quá khứ) |
| `achievements` | giữ |
| (mới) `caimenh` | `hydrate()` thêm khung mặc định khi thiếu — đúng cách `hydrate` đang làm với trường thiếu |

**Không truy thu:** người chơi cũ không nhận Đạo Hạnh cho án đã giải trước khi có hệ 05; nhận một **quà chào mừng** cố định B 50 (để không thiệt người đến sớm mà không tạo chênh lệch lớn).

### 3.3 Khóa lưu riêng

| Khóa localStorage | Nội dung | Đồng bộ máy chủ |
|---|---|---|
| `huyenquan:v1` | trạng thái chung (đã có) + `caimenh` | phần chứng thực (05-14 §4.1) |
| `huyenquan:v1:journal` | sổ đời thực | **không bao giờ** |
| `huyenquan:v1:chart` | Bản Mệnh (ngày giờ sinh) — hiện nằm trong `profiles` | **không bao giờ** |

---

## 4. Sự kiện máy khách → máy chủ

| Sự kiện | Trường | Máy chủ làm |
|---|---|---|
| `deed` | `id, npc?, region, at, am, witnesses` | kiểm hồi chiêu, CC, nhật hạn công; trả `{ huuHieu, B, congHuuHieu }` |
| `activity_done` | `kind, path?, sessionMs, rhythmDigest?, at` | kiểm phiên có thưởng / ngày, chống bot (05-14 §4.3); tính ΔĐH (k từ `kHistory`, a, n, h) |
| `quest_step` | `quest, step, payload` | máy trạng thái nhiệm vụ (§5) |
| `dialog_choice` | `tags[], deedId?, at` | thẻ nghiệp → sự vụ; DEED ác nếu có |
| `giuoi_break` | `giuoi, at` | trừ Đạo Hạnh theo luật |
| `rite_done` | `rite, incidentId?, hoiHuong` | giảm nghiệp / hoàn án giới / trả Nợ Âm |
| `repair_done` | `incidentId` | cập nhật sự vụ, gạch dòng quá |
| `breakthrough` | `realm` | kiểm ngưỡng + điều kiện; trả bậc |
| `amBai_use` | `activityRef, at` | tính phần thêm, Nợ Âm, bậc hệ quả |
| `amBai_break` | `at, shrine` | — |
| `chart_set` | `tiemLuc, reason: 'first'|'fix72h'|'rite'` | ghi `kHistory`; áp DS-1…DS-5 |
| `path_join` / `path_leave` | `path` | suất, hồi chiêu 14 ngày |

**Không có sự kiện** nào mang ngày giờ sinh, chẩn đoán, nội dung tự gõ (phát lộ, công án, nhật ký).

**Thứ tự và trùng lặp:** mỗi sự kiện có `uuid` do máy khách sinh; máy chủ bỏ sự kiện trùng `uuid`; sự kiện offline gửi theo thứ tự `at`.

---

## 5. Máy trạng thái nhiệm vụ

```
LOCKED ──(requires đủ)──▶ AVAILABLE ──(nhận / tự nhận)──▶ ACTIVE
ACTIVE ──(mọi step done)──▶ DONE
ACTIVE ──(người chơi bỏ)──▶ AVAILABLE   (tiến độ step giữ)
ACTIVE ──(tính lại Mệnh Đồ, nhiệm vụ không còn)──▶ CLOSED_PARTIAL (thưởng 50% bước đã làm, 05-02 §5.3)
DONE   ──(nhiệm vụ năm, Lập Xuân)──▶ AVAILABLE (bản năm mới, mã giữ, `year` mới)
```

| Loại bước (`steps[].kind`) | Hoàn tất khi |
|---|---|
| `goto` | tới vùng / công trình |
| `talk` | xong một nhánh hội thoại có cờ |
| `read` | đọc xong thẻ Tàng Kinh (cuộn tới cuối hoặc ≥ 20 giây) |
| `activity` | đủ n phiên hoạt động lõi đạt mức |
| `deed` | đủ n DEED thuộc nhóm / hạnh |
| `case` | đóng một án (giải án, việc lạ, giải oan) với nhánh bắt buộc |
| `rite` | xong một nghi lễ |
| `exam` | qua kỳ thi / kiểm tri |
| `days` | đủ n ngày có điều kiện (giữ giới, trì chú, thường hành) — không cần liền trừ khi ghi «liền» |
| `event` | dự sự kiện máy chủ |
| `mentor` | đệ tử đạt mốc |
| `house` | điểm an trạch đạt ngưỡng |

---

## 6. Tính `gaimenhPlan` trong game

| Vấn đề | Quy định |
|---|---|
| Chi phí | `gaimenhPlan` gọi `analyzeMangpai` và `xuankongPan`; `R` đã có từ `analyze()` khi lật trụ. Tính **một lần** khi: lật trụ, sửa dữ liệu, Lập Xuân, phiên bản engine đổi |
| Bộ nhớ đệm | khóa = `hash(ngày giờ sinh, giới, năm can chi, phiên bản engine)`; lưu kết quả rút gọn (diagnosis, `layers[].acts`, `verdict`, `mangpai` cần dùng, `xuankong.wangFang/xiongFang`) trong `caimenh.menhDo` |
| Năm Huyền Không | truyền `opts.year` = năm can chi máy chủ (05-02 §1.1) |
| Lỗi | bắt lỗi; hiện Mệnh Đồ tối thiểu (05-02 §9) |
| Phiên bản engine | hằng số `ENGINE_VERSION` (tài liệu 13); đổi → tính lại ở lần đăng nhập kế |

---

## 7. Lớp chuyển đổi (game đọc engine)

Một module duy nhất `src/game/caimenh-read.js` **(chưa có — cần làm)** gom mọi chỗ game đọc engine cho hệ 05 — để khi engine sửa lỗi chỉ đổi một nơi:

| Hàm | Đọc | Vá |
|---|---|---|
| `readPlan(R, year)` | `gaimenhPlan` | đánh dấu «nhắc của Mệnh Đồ» tách khỏi diagnosis |
| `readRemedyLayers(R)` | `getRemedyForChart` | phát hiện fallback (needLevel thấp + mâu thuẫn `strength.strong` / `patternQuality`) |
| `readKarmaHints(R)` | `getYeguoForChart`, `computeLiuDao` | tắt Thâu đạo; Sân bổ sung từ `poisons.san ≥ 50` |
| `readAffinity(R)` | `R.yong.primary/xi` | **không** gọi `suggestDaozangChartAware` cho hành (lỗi `yong.god`) |
| `readTaisui(R, yearZhi)` | `personalTaSui` | loại pháp ③ khỏi `TAISUI_REMEDY` |
| `readK(R)` | `synthesis.score` | kẹp [1; 1,5] |
| `readYearRating(R)` | `liunian[isNow].rating` | không có `isNow` → «Bình» |
| `readAmTa(R)` | `analyzeAmTa` | chỉ gọi khi opt-in |

Có test riêng với 13 lá số 05-15.

---

## 8. Hiệu năng và mạng

| Mục | Ngân sách |
|---|---|
| Tính lại Mệnh Đồ | ≤ 50 ms trên máy tầm trung (ước: `analyze` đã có sẵn; phần thêm nhẹ) |
| Ghi sổ một DEED (máy khách) | ≤ 2 ms |
| Sự kiện gửi máy chủ | gộp tối đa 10 sự kiện / 5 giây |
| Dữ liệu `deeds` + `quests` build | ≤ 150 KB nén |
| `quizBank` | tải lười khi vào thi |
| Lịch sử sổ | tối đa 2.000 dòng chi tiết, cũ hơn gộp tháng (§3.1) |

---

## 9. Bản địa hóa

- Tiếng Việt là ngôn ngữ gốc. Chuỗi app (`CONG_QUA.a`, `diagnosis[].d`, `verdict`…) là tiếng Việt trộn Hán của app — **hiển thị nguyên văn**, không dịch máy, kể cả ở bản ngôn ngữ khác (kèm bản dịch phụ do người dịch duyệt).
- Khóa `action` gửi vào `meritLedger` **không bao giờ** bị dịch.
- Chữ Hán trong thẻ Tàng Kinh: phồn thể theo nguồn app; nơi app ghi giản thể giữ nguyên (không tự đổi).

---

## 10. Kiểm thử tự động (yêu cầu)

| Nhóm | Ca | Nguồn dữ liệu |
|---|---|---|
| Engine đọc | 13 lá số → diagnosis, đèn, nhiệm vụ biến thể, người dẫn, cảnh báo | 05-15 §2–3 |
| Công thức | k, ΔĐH, Vận, nhật hạn, phạm giới, nghiệp, Nợ Âm, cảnh giới | 05-15 §4 |
| Sổ | 19 mục `CONG_QUA` → `meritLedger` | 05-03 §1.2 |
| Chống khai thác | X-1 … X-25 | 05-14 §3 |
| Nội dung | quét cụm cấm trên `lines`, `strangeCases`, `quests` | 05-17 §7, 05-13 §5.2 |
| iOS | build iOS không chứa `taLo`, nhánh âm tà, S-03, S-09 | 05-14 §6 |
| Hồi quy code hiện có | `scripts/test-game-state.mjs`, `scripts/test-game-cosmetics.mjs` vẫn xanh | đã có |
