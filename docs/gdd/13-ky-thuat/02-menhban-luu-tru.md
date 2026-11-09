# 13.02 · Mệnh Bàn, cảnh giới, lưu trữ v2 và sửa lỗi engine

> Phạm vi: module `src/game/menhban.js` (gom chỉ số), công thức cảnh giới và Đạo Hạnh (tầng kỹ thuật cho tài liệu 04 và 09), định dạng lưu `huyenquan:v2`, và ba lỗi engine phải sửa trước M0. Bảng tên chỉ số theo canon §5; tài liệu 04 là chuẩn chi tiết về ý nghĩa lối chơi, tài liệu này là chuẩn về **dữ liệu và thuật toán**.

## 1. Nguyên tắc

1. **Một lần tính, nhiều nơi đọc.** `analyze()` chạy khi vào game (và khi người chơi sửa bát tự). Mệnh Bàn là đối tượng phẳng, bất biến, dẫn xuất từ `R`. Không module nào khác của game đọc thẳng `R` để lấy chỉ số nhân vật (trừ các gian luận lá số vốn hiển thị `R`).
2. **Không lưu `R`, không lưu Mệnh Bàn đầy đủ.** Chỉ lưu dấu vân tay (`key`, `engineV`, `hash`). Lý do: (a) ngày sinh là dữ liệu nhạy cảm, Mệnh Bàn đủ chi tiết để suy ngược một phần; (b) khi engine sửa lỗi, chỉ số phải cập nhật theo engine mới.
3. **Minh bạch.** Mọi chỉ số có `src` (đường dẫn trường engine) và lời giải thích lấy từ engine (`synthesis.factors`, `patternQuality.diseases/rescues`, `criteria`). Không có lời giải thích viết tay cho con số.
4. **Thuần logic.** `menhban.js` không đụng DOM, không đụng THREE, chạy được trong Node và trong Worker (để máy chủ tính lại khi cần chấm điểm đáng tin, phần 04).
5. **Ổn định theo thời gian thực.** Thời Vận phụ thuộc năm và ngày hiện tại; các phần còn lại phụ thuộc ngày sinh. Hai phần cập nhật theo nhịp khác nhau.

## 2. API

```js
// src/game/menhban.js
export const MENHBAN_V = 1;                       // tăng khi đổi cấu trúc SCHEMA-MENHBAN
export const ENGINE_V = '2026.11.1';              // tăng khi sửa engine làm đổi số (D1–D3)
export const GRADE_CUTS = [28, 36, 43, 50, 58, 66, 73, 80, 86];
export const PHAM_CAN = ['Phàm Căn', 'Ngũ Linh Căn', 'Tứ Linh Căn', 'Tứ Linh Căn thuận', 'Tam Linh Căn',
  'Tam Linh Căn thượng', 'Song Linh Căn', 'Song Linh Căn thượng', 'Dị Linh Căn', 'Thiên Linh Căn'];
export const LOP = { '成格': 'TT', '有救': 'DC', '败格': 'NT', '特殊': 'DK' };

export function phamCanOf(score: number): { idx: number, name: string }
export function nghichThien(score: number): number                 // clamp(1 + (60 − score)/100, 1, 1,5)
export function buildMenhBan(R: AnalyzeResult, opts?: BuildOpts): MenhBan        // SCHEMA-MENHBAN
export function refreshThoiVan(mb: MenhBan, R: AnalyzeResult, now: Date): MenhBan // chỉ cập nhật khối thoiVan
export function explain(mb: MenhBan, stat: StatKey): Explain                       // SCHEMA-EXPLAIN
export function publicCard(mb: MenhBan, consent: Consent): PublicCard             // SCHEMA-PUBLIC-CARD
export function menhKey(birth: Birth): Promise<string>                             // SHA-256 rút gọn — CHỈ dùng cục bộ (ngày giờ sinh ít biến thể, băm dò ngược được; không gửi máy chủ khi chưa có consent.cloudBirth, phần 08 §4.3)
export function mbHash(mb: MenhBan): string                                        // FNV-1a 32 bit trên các trường Tiên Thiên

type BuildOpts = {
  now?: Date,                  // mặc định new Date()
  engines?: EngineBundle,      // tiêm phụ thuộc cho test; mặc định import tĩnh
  strict?: boolean,            // true: engine phụ lỗi thì ném lỗi (test); false: điền null + ghi warnings
}
```

`EngineBundle` = `{ fiveDimRadar, classifyChartLevel, analyzeVitality, computeLiuDao, analyzeNobleStars, getPersonalityProfile, dayNayinPersonality }`. Tiêm phụ thuộc để test giả lập một engine phụ ném lỗi mà không sửa engine thật.

## 3. SCHEMA-MENHBAN

Kiểu dữ liệu: `int` số nguyên, `num` số thực, `str` chuỗi, `wx` một trong `'木'|'火'|'土'|'金'|'水'`, `?` có thể `null`.

```jsonc
{
  "v": 1,                                  // int — MENHBAN_V
  "engineV": "2026.11.1",                  // str — ENGINE_V lúc tính
  "key": "c3f1a09b7e22",                   // str — menhKey(birth), 12 hex
  "hash": "9a41c2d0",                      // str — mbHash (Tiên Thiên), để phát hiện engine đổi số
  "at": 1762300800000,                     // int — ms epoch lúc tính
  "refYear": 2026,                         // int — năm tham chiếu truyền vào analyze()

  "tiemLuc":   { "value": 41, "percentile": 31, "src": "synthesis.score" },
  "phamCan":   { "idx": 2, "name": "Tứ Linh Căn", "gradeVi": "TRUNG ĐẲNG · Cân bằng, cần nỗ lực", "grade": "中", "src": "synthesis.gradeVi" },
  "phucPhan":  { "key": "khá no", "vi": "Khá no ấm — có thành tựu nếu biết nắm đúng vận", "src": "synthesis.fortune" },

  "nguHanh": {                             // Ngũ Hành Lực
    "pct":  { "木": 6.5, "火": 18.3, "土": 17.9, "金": 55.1, "水": 2.2 },   // num — R.wx.pct (tổng 100, 1 chữ số thập phân; số thật của MAU-A)
    "eff":  { "木": 6.5, "火": 18.3, "土": 14.3, "金": 55.1, "水": 2.9 }, // num — pct × hệ số (Dụng 水 ×1,3 · Kỵ 土 ×0,8 · khác ×1)
    "names": { "木": "Sinh Cơ", "火": "Nhiệt Tâm", "土": "Định Lực", "金": "Tuệ Kiếm", "水": "Linh Tuệ" },
    "src": "wx.pct"
  },
  "thanLuc":   { "value": 77, "level": "Thân quá vượng", "strong": true, "src": "strength.effRatio" },
  "thienMenh": { "dung": "水", "hy": "金", "ky": "土", "cuu": "火", "src": "yong.primary/xi/ji/chou" },

  "nguDuy": {                              // Ngũ Duy (fiveDimRadar)
    "dims": { "cai": 26, "guan": 45, "yin": 54, "shi": 15, "ti": 100 },
    "dominant": "ti", "weakest": "shi",
    "src": "five-dim-radar.fiveDimRadar(R.chart)"
  },
  "menhCach": {
    "quality": "有救",                      // str — patternQuality.quality nguyên văn
    "lop": "DC",                           // 'TT'|'DC'|'NT'|'DK'|null — null khi quality = '未知'
    "pattern": "七殺格", "patternVi": "Thất Sát cách (Thiên Quan / Thiên Tướng)",
    "diseases": ["…"], "rescues": ["…"],   // str[] — rút gọn ≤ 160 ký tự mỗi dòng, giữ nguyên văn engine
    "src": "patternQuality.quality"
  },
  "menhCap":   { "level": "清贵", "levelVi": "Thanh Quý (văn nhân/Trung — học vấn, thanh cao)", "src": "chart-level.classifyChartLevel" },
  "nguyenKhi": { "value": 23, "src": "vitality.analyzeVitality.baseVitality" },
  "dacTinh": [                             // Đặc Tính: thần sát + quý nhân có mặt
    { "key": "tianDe", "zh": "天德貴人", "from": "shensha" },
    { "key": "huaGai", "zh": "華蓋", "from": "shensha" }
  ],
  "tucNghiep": { "realm": "人道", "poisons": { "tham": 29, "san": 37, "si": 27 }, "src": "liudao.computeLiuDao" },
  "tinhKhi":   { "dayGan": "庚", "nayin": "白蜡金", "nayinVi": "Kim Sáp Trắng", "src": "personality-profile + nayin-personality" },
  "thoiVan": {                             // cập nhật theo năm/ngày
    "dayun": { "idx": 2, "ganZhi": "甲申", "startYear": 2017, "score": 0, "rating": "…" },
    "liunian": { "year": 2026, "ganZhi": "丙午", "score": 6, "rating": "…" },
    "mod": 0.0,                            // num — hệ số thưởng ±0,10 (tài liệu 04 định bảng), tính ở §6
    "src": "dayun[current] + liunian[isNow]"
  },
  "warnings": []                           // str[] — engine phụ nào lỗi thì ghi «vitality:TypeError …»
}
```

Ràng buộc kiểm bằng `validateMenhBan()` (dùng trong test và chế độ phát triển):

| Trường | Ràng buộc |
|---|---|
| `tiemLuc.value` | int 0–100 |
| `phamCan.idx` | khớp `phamCanOf(tiemLuc.value)` |
| `nguHanh.pct` | 5 khóa, tổng 99,5–100,5 |
| `nguHanh.eff[w]` | = `pct[w] × (w = dung ? 1,3 : w = ky ? 0,8 : 1)`, sai số ≤ 0,05 |
| `thanLuc.value` | int 0–100 |
| `thienMenh.dung` | khác `thienMenh.ky` |
| `nguDuy.dims` | 5 khóa `cai, guan, yin, shi, ti`, int 0–100; `dominant`, `weakest` thuộc 5 khóa |
| `menhCach.lop` | `LOP[quality]` hoặc `null` |
| `dacTinh[].key` | duy nhất |
| `tucNghiep.poisons` | 3 khóa int 0–100 |

## 4. Thuật toán `buildMenhBan`

```
buildMenhBan(R, { now, engines, strict }):
  W = []                                                    // warnings
  safe(name, fn) = try fn() catch e → if strict throw; W.push(name + ':' + e.name); return null
  syn = R.synthesis
  pc  = phamCanOf(syn.score)
  dung, ky = R.yong.primary, R.yong.ji
  eff[w] = round1(R.wx.pct[w] × (w === dung ? 1.3 : w === ky ? 0.8 : 1))
  fdr = safe('fiveDimRadar', () => engines.fiveDimRadar(R.chart))
  cl  = safe('chartLevel',   () => engines.classifyChartLevel(R))
  vit = safe('vitality',     () => engines.analyzeVitality(R))
  ld  = safe('liudao',       () => engines.computeLiuDao(R))
  ns  = safe('noble',        () => engines.analyzeNobleStars(R))
  pp  = safe('personality',  () => engines.getPersonalityProfile(R))
  np  = safe('nayin',        () => engines.dayNayinPersonality(R))
  dacTinh = keys(R.shensha) ∪ ns.stars.filter(present).map(key)   // khử trùng theo key
  thoiVan = thoiVanOf(R, now)
  mb = { … như SCHEMA-MENHBAN … , warnings: W }
  mb.hash = mbHash(mb)
  return freeze(mb)                                         // Object.freeze sâu ở chế độ dev
```

- **Độ phức tạp:** O(1) theo kích thước lá số; tổng thời gian đo trên Node với `MAU-A` ≈ 2,2 ms cho 7 engine phụ (bảng §1 phần 01). Trên iPhone 12 dự kiến ≤ 10 ms (suy luận ×4 so với máy bàn); đo thật ở TASK-044.
- **`thoiVanOf(R, now)`**: `idx = R.dayun.findIndex(d => y ≥ d.startYear && y ≤ d.startYear + 9)` với `y = now.getFullYear()`; `liunian = R.liunian.find(l => l.isNow) || R.liunian.find(l => l.year === y)`; nếu `R.liunian` không có năm hiện tại (người chơi để game mở qua giao thừa) thì gọi lại `chartOf` với `refYear` mới (phần §8.3).
- **`mbHash`**: FNV-1a 32 bit trên chuỗi chuẩn hóa các trường Tiên Thiên (không gồm `thoiVan`, `at`). Dùng để phát hiện **engine đổi số** giữa hai phiên: `state.menh.hash` khác `mb.hash` và `state.menh.engineV` khác `ENGINE_V` → hiện thông báo «Thầy vừa chỉnh lại sách tính, chỉ số của bạn có thay đổi» kèm danh sách khác biệt (`diffMenhBan`).

### 4.1 Ca biên

| Ca | Hành vi |
|---|---|
| `patternQuality.quality = '未知'` | `lop = null`; tuyến cốt truyện dùng nhánh mặc định do tài liệu 03 quy định (đề xuất: như Thuận Thiên nhưng không có thử thách «giữ cách»). Ghi `warnings: ['menhCach:unknown']` |
| Không rõ giờ sinh (`hourUnknown`) | Vẫn tính (cổng lấy 12:00). Mệnh Bàn mang cờ `uncertain: ['hour']`; UI ghi «chỉ số giờ có thể sai»; Thiên Bảng cột Tiên Thiên ẩn |
| Một engine phụ ném lỗi | Trường tương ứng `null`, UI hiện «—» kèm «chưa luận được», game không chặn tiến trình |
| `R.yong.ji` rỗng | Dùng `R.yong.avoid[0]` (giống `main.js`); nếu vẫn rỗng thì không áp hệ số 0,8 |
| `dung === ky` (không xảy ra với engine hiện tại, vẫn phòng) | Áp 1,3 (ưu tiên Dụng), ghi cảnh báo |
| Trẻ chưa vào đại vận đầu | `thoiVan.dayun = null`, `childhood: true` (khớp `vanmenh.js`) |
| Năm sinh ngoài 1900–2100 | Cổng đã chặn; `buildMenhBan` không kiểm lại |

## 5. «Vì sao?» — SCHEMA-EXPLAIN

```jsonc
{
  "stat": "tiemLuc",                       // StatKey
  "title": "Tiềm Lực 41 · Tứ Linh Căn",
  "lines": [                               // nguyên văn engine, cắt ≤ 240 ký tự/dòng, giữ thứ tự
    { "sign": 0, "text": "格局成败 (有救 — Có cứu ứng (bại trung hữu thành)): …" }
  ],
  "src": "synthesis.factors",
  "note": "Lá số là hạt giống, không phải cái cây…"   // câu dẫn bắt buộc khi tiemLuc < 46 (canon §4.7, RB2)
}
```

| `StatKey` | Nguồn dòng giải thích |
|---|---|
| `tiemLuc`, `phamCan`, `phucPhan` | `synthesis.factors[]`; dấu lấy từ ký tự đầu dòng `+`/`−` nếu có, không thì 0 |
| `nguHanh` | `R.wx.score` từng hành + câu hệ số Dụng/Kỵ |
| `thanLuc` | `strength.deLenh`, `deDia`, `root`, `siling` (các cờ có sẵn) |
| `thienMenh` | `yong.reasons[]`, `yong.method` |
| `nguDuy` | `fiveDimRadar.dims[].gods` (thập thần đóng góp) |
| `menhCach` | `patternQuality.diseases`, `rescues`, `summary` |
| `menhCap` | `classifyChartLevel.criteria[]` (`name`, `pass`, `detail`) |
| `nguyenKhi` | `analyzeVitality.constitution`, `advice` |
| `tucNghiep` | `computeLiuDao` (mô tả cõi, ba độc) — luôn kèm câu «tham khảo, hư cấu trong game» |
| `thoiVan` | `dayun[i].rescueNotes/worsenNotes`, `liunian.gejuNote` |

## 5b. Thẻ công khai — SCHEMA-PUBLIC-CARD

Những gì về nhân vật được rời máy người chơi qua MMO, Thiên Bảng, môn phái. Bản sơ đồ tổng §14: MMO chỉ gửi màu áo, trang bị, Đạo Hạnh tổng; **không** gửi ngày sinh hay điểm Tiên Thiên nếu người chơi không bật «công khai căn cốt».

```jsonc
{
  "name": "Mây Thong Thả",                 // cleanName (protocol.js)
  "robe": "水", "acc": "金",                // màu áo = Dụng, đai = Hỷ (đã gửi trong hello từ V2-2)
  "cos": "r:y_moc,h:tram_ngoc",            // encodeCos (cosmetics.js)
  "title": "Môn Sinh",                     // danh xưng / danh hiệu
  "realm": 2,                              // bậc cảnh giới (client người xem tự đổi tên theo bộ tên đạo của mình)
  "dh": 140,                               // Đạo Hạnh tổng (đáng tin, phần 04)
  "school": "zhengyi",                     // đạo thống chính (nếu có)
  "canCot": null                           // chỉ khi consent.publicCanCot: { "tiemLuc": 41, "phamCan": "Tứ Linh Căn" }
}
```

- `publicCard(mb, consent)` là **hàm duy nhất** được phép dựng dữ liệu nhân vật gửi ra ngoài; test `test-menhban › publicCard` khẳng định không có trường nào khác (so khóa chính xác) và `canCot = null` khi chưa đồng ý.
- Mệnh Cách (`lop`), Ngũ hành %, thần sát, Túc Nghiệp **không bao giờ** nằm trong thẻ công khai (suy ngược được một phần lá số, và dễ thành nhãn phân biệt giữa người chơi — trụ cột T2).
- `robe`/`acc` là Dụng/Hỷ thần nên đã lộ một phần lá số: chấp nhận vì là thiết kế có sẵn từ V2-2 (phẩm phục hợp mệnh). Lưu ý: gói `hello` hiện **luôn** gửi `robe`/`acc` theo Dụng/Hỷ kể cả khi người chơi mặc phẩm phục Tàng Y Các có màu riêng (`look` của món chỉ đổi màu hiển thị). Thêm tùy chọn «kín mệnh»: khi bật, client gửi màu của món đang mặc (hoặc `土` mặc định) thay cho Dụng/Hỷ — làm cùng client mạng v2 (TASK-200).

## 6. Cảnh giới, Đạo Hạnh, hệ số

### 6.1 Công thức (canon §5)

```
nghichThien(T) = clamp(1 + (60 − T)/100, 1.0, 1.5)
REALM_CUTS = [0, 100, 400, 1000, 2200, 4500]                 // bậc 1…6
realmScore(k, T, D) = k ≤ 3 ? T × 0.4 + D : D
realmOf(T, D) = max { k ∈ 1..6 : realmScore(k, T, D) ≥ REALM_CUTS[k−1] }
```

- Hàm `realmOf` đơn điệu theo `D` với `T` cố định → không có trường hợp tăng Đạo Hạnh mà tụt bậc.
- **Không tụt bậc khi Đạo Hạnh giảm** (phạm giới): lưu `dao.realmMax`; bậc hiển thị = `max(realmOf(T, D), realmMax)`; nếu `realmOf < realmMax` thì UI hiện «đạo hạnh hụt — cần bù N» và các mở khóa của bậc vẫn giữ. Quyết định thiết kế này cần tài liệu 05/09 xác nhận (câu hỏi mở Q3).

Bảng kiểm (dùng trong test):

| Tiềm Lực T | Đạo Hạnh D | Bậc | Ghi chú |
|---|---|---|---|
| 41 | 0 | 1 | 16,4 < 100 |
| 41 | 84 | 2 | 16,4 + 84 = 100,4 |
| 88 | 65 | 2 | 35,2 + 65 = 100,2 |
| 20 | 393 | 3 | 8 + 393 = 401 |
| 88 | 999 | 3 | bậc 4 chỉ xét D: 999 < 1.000 |
| 20 | 1.000 | 4 | |
| 99 | 4.500 | 6 | |

### 6.2 Tăng Đạo Hạnh

```js
export function daoHanhGain({ base, tiemLuc, schoolMatchesYong = false, kyChallenge = false, thoiVanMod = 0 }) {
  // base: điểm gốc do máy nhiệm vụ cấp (int ≥ 0), không bao giờ do AI hay client tự đặt
  const k = nghichThien(tiemLuc) * (schoolMatchesYong ? 1.1 : 1) * (kyChallenge ? 1.3 : 1) * (1 + clamp(thoiVanMod, -0.1, 0.1));
  return Math.round(base * k);              // làm tròn nửa lên; base = 0 → 0
}
```

| Thành phần | Giá trị | Nguồn |
|---|---|---|
| Hệ số Nghịch Thiên | 1,0–1,5 | canon §5 |
| Đạo thống hợp Dụng thần | ×1,1 | bản sơ đồ tổng §5.6, `daozang › _YONG2CULT` (sau khi sửa D2) |
| Thử thách hành Kỵ | ×1,3 | bản sơ đồ tổng §4.1 |
| Thời Vận | ±10% | bản sơ đồ tổng §4.1; bảng giá trị do tài liệu 04 định |

Giá trị lớn nhất có thể: `1,5 × 1,1 × 1,3 × 1,1 ≈ 2,36` lần điểm gốc. Trần ngày (chống cày) đặt ở dữ liệu `REALM_CFG.dailyCap` (đề xuất 120 Đạo Hạnh/ngày, tài liệu 09 chốt).

**Ranh giới tiền tệ (trụ cột T6, bản sơ đồ tổng §11):** Đạo Hạnh, cảnh giới, công đức **không** nhận hệ số Hợp mệnh của Tàng Y Các, VIP hay bất kỳ món mua nào. Test `test-menhban › không có đường tiền → Đạo Hạnh` duyệt mọi `EFFECT` (phần 03) có `grantDaoHanh` và khẳng định nguồn chỉ là nút nhiệm vụ/việc thiện.

### 6.3 Đa đạo thống

- `dao.schools`: tối đa 3 đạo thống chính (`maxSchools = 3`); id đạo thống theo tài liệu 05 (`CQ-<đạo>`). Gia nhập thứ 4 → máy nhiệm vụ từ chối, NPC giải thích.
- **Quy nhất** (canon §6): `size(schools với tiến độ ≥ ngưỡng) ≥ 3 && ledger.net > 0` → cờ `flags.quyNhat = true`. Ngưỡng tiến độ do tài liệu 05 định (dữ liệu, không hằng số trong code).

## 7. Đặc Tính — SCHEMA-PERK-TABLE

Tệp `src/game/data/perks.json` (bản sơ đồ tổng §4.6 gọi là `docs/game-data/shensha-perks.json`; tài liệu này chuyển vào `src/game/data/` để bundle trực tiếp, bản trong `docs/` chỉ là bản xuất đọc). Nội dung từng mục do tài liệu 04 viết (`PERK-<sao>`); định dạng:

```jsonc
{
  "v": 1,
  "perks": [
    {
      "id": "PERK-tianYi",                 // str — mã tài liệu 04
      "engineKey": "tianYi",               // str — khóa trong R.shensha hoặc analyzeNobleStars.stars[].key
      "name": "Quý Nhân Phù",
      "effects": [                          // EFFECT-MOD (§7.1)
        { "kind": "dailyGift", "npcPool": "any", "chance": 1.0 },
        { "kind": "hintFree", "when": "questStuck" }
      ],
      "ios": true,                          // bool — có hiệu lực trên iOS không (đặc tính dạng đoán vận → false)
      "desc": "Mỗi ngày một NPC ngẫu nhiên tặng quà / chỉ đường"
    }
  ]
}
```

### 7.1 Kiểu hiệu ứng đặc tính (đóng — thêm kiểu mới phải sửa code và test)

| `kind` | Tham số | Áp ở đâu |
|---|---|---|
| `statMod` | `stat` (`examScore`, `readSpeed`, `walkSpeed`, `npcAffinity`, `socialGain`), `mul` (0,5–1,5) | gian/hoạt động đọc khi tính điểm |
| `schoolMod` | `mul` cho mọi đạo thống | `daoHanhGain` (nhân thêm, vẫn chịu trần ngày) |
| `dailyGift` | `npcPool`, `chance` | máy nhiệm vụ, sự kiện `dayStart` |
| `hintFree` | `when` | UI gợi ý nhiệm vụ |
| `dialogueBranch` | `tag` (vd `kuiGang`) | điều kiện thoại `{ perk: 'PERK-kuiGang' }` |
| `extraTrial` | `questTag` | máy nhiệm vụ thêm ải (đặc tính «Kiếp số») |
| `karmaSoften` | `mul` (≤ 1) | điểm Quá phát sinh khi lỡ chọn sai |

Không có kiểu nào trừ chỉ số Tiên Thiên hay chặn tiến trình (trụ cột T2).

## 8. Lưu trữ v2

### 8.1 Mục tiêu

- Thêm các khối dữ liệu mới (Mệnh Bàn dấu vân tay, Đạo Hạnh, Sổ Công Quá, nhiệm vụ, thế giới, persona, đồng ý, hạn mức AI, tài khoản).
- Không bao giờ làm mất tiến trình v1.
- Sửa nhược điểm «khóa lạ bị bỏ» bằng hydrate theo lược đồ.

### 8.2 SCHEMA-SAVE (v2)

Khóa `localStorage`: `huyenquan:v2`. Khóa cũ `huyenquan:v1` được **giữ nguyên, không ghi nữa** (bản dự phòng để quay lui).

```jsonc
{
  "v": 2,
  "rev": 418,                              // int — tăng mỗi lần lưu (đồng bộ đám mây, phần 08)
  "savedAt": 1762300800000,

  // --- giữ nguyên từ v1 (cùng tên, cùng kiểu) ---
  "player": { "name": "Mây Thong Thả", "look": "hero_m", "birth": { "y": 1990, "m": 5, "d": 15, "h": 8, "mi": 30, "gender": "nam", "hourUnknown": false },
              "yong": { "primary": "水", "accent": "金", "ji": "土" }, "robe": "水", "accent": "金", "createdAt": 1762000000000 },
  "profiles": [], "phucKhi": 0, "daily": {}, "incense": {}, "tea": {}, "sticks": [], "lanterns": [],
  "stationsVisited": [], "incenseDays": [], "streak": {}, "achievements": {}, "flags": {}, "settings": { "sound": false },
  "mastery": {}, "classical": {}, "caseLog": [], "deskLog": {}, "xp": 0, "vip": null, "thaitue": null, "wardrobe": null,

  // --- mới ---
  "menh":   { "key": "c3f1a09b7e22", "engineV": "2026.11.1", "hash": "9a41c2d0", "seenDiff": null },
  "dao":    { "daoHanh": 0, "realmMax": 1, "school": "dao",            // 'dao' | 'phat' | 'nho' — bộ tên cảnh giới hiển thị
              "schools": {},                                            // { [schoolId]: { joinedAt, progress } } — tối đa 3
              "today": { "date": "2026-11-05", "gained": 0 } },         // trần ngày
  "ledger": { "entries": [], "net": 0, "thien": 0, "ac": 0,             // SCHEMA-LEDGER-ENTRY (phần 04)
              "milestones": {}, "amNo": 0, "syncedRev": 0 },
  "quests": { "active": {}, "done": {}, "failed": {}, "vars": {}, "rev": 0 },   // SCHEMA-QUEST-STATE (phần 03)
  "world":  { "visited": ["thanh"], "unlocked": ["thanh"], "last": { "x": 11.875, "y": 33.875, "cell": null } },
  "persona": { "mem": {} },                // { [npcId]: { lastAt, notes: str[≤5] } } — tóm tắt cục bộ, không gửi máy chủ
  "consent": { "analytics": null, "publicCanCot": false, "amta": false, "cloudBirth": false, "at": null },
  "ai":     { "date": null, "used": 0 },   // bản sao cục bộ của hạn mức (máy chủ là nguồn đúng)
  "account": null                          // { id, linkedAt, deviceId } — phần 08
}
```

### 8.3 Hydrate theo lược đồ

```js
const SHAPE = {                             // khóa → hàm chuẩn hóa (giá trị hỏng → mặc định)
  dao: (x) => ({ daoHanh: num(x?.daoHanh, 0, 0), realmMax: int(x?.realmMax, 1, 1, 6), school: oneOf(x?.school, ['dao','phat','nho'], 'dao'),
                 schools: objOf(x?.schools, schoolEntry, 3), today: dayCounter(x?.today) }),
  ledger: (x) => normalizeLedger(x),        // phần 04
  quests: (x) => normalizeQuests(x),        // phần 03
  // … mỗi khóa mới một hàm
};
export function hydrate2(raw, now) {
  if (!raw || raw.v !== 2) throw new Error('bad state');
  const s = createState2(now);              // khung đầy đủ v2
  for (const k of Object.keys(s)) if (raw[k] !== undefined) s[k] = SHAPE[k] ? SHAPE[k](raw[k]) : raw[k];
  // khóa lạ: giữ trong s._extra để không mất dữ liệu của bản game mới hơn (đồng bộ đa thiết bị)
  s._extra = pick(raw, (k) => !(k in s));
  return checkInvariants(s);                // ném lỗi nếu bất biến sai (vd profiles không phải mảng)
}
```

Khác biệt quan trọng so với v1: **khóa lạ được giữ** trong `_extra` và ghi trả lại khi lưu. Một thiết bị chạy bản game cũ không xóa dữ liệu do bản mới thêm.

### 8.4 Di trú v1 → v2

```
loadState(storage):
  t2 = storage.getItem('huyenquan:v2')
  if t2: try return rollDay(hydrate2(JSON.parse(t2)))
         catch → storage.setItem('huyenquan:v2:corrupt:' + Date.now(), t2)  (giữ tối đa 3 bản, xóa bản cũ nhất)
                 → rơi xuống nhánh v1
  t1 = storage.getItem('huyenquan:v1')
  if t1: s1 = hydrate(JSON.parse(t1))        // hàm v1 hiện có, giữ nguyên
         s2 = migrate1to2(s1)                // thêm khối mới với mặc định; không đổi trường cũ
         save2(s2)                           // ghi huyenquan:v2; KHÔNG xóa huyenquan:v1
         return s2
  return createState2()
```

`migrate1to2` thêm:

| Khối | Giá trị khởi tạo từ v1 |
|---|---|
| `menh` | `key` tính từ `player.birth` (nếu có), `engineV`/`hash` để `null` → lần vào game đầu tiên ghi |
| `dao.daoHanh` | 0 (không quy đổi Phúc Khí sang Đạo Hạnh: hai thang khác bản chất) |
| `ledger` | rỗng; **ghi bù** một mục `source: 'migrate'` cho mỗi án NPC trong `caseLog` có `total ≥ 0,6`? → **Không**. Việc thiện chỉ tính từ khi có Sổ (tránh lạm phát), ghi chú trong lời Vân Cốc |
| `world.visited` | `['thanh']` + vùng của các sảnh nghề có trong `deskLog` |
| `consent` | tất cả `false`/`null` → hỏi ở lần vào game đầu tiên sau cập nhật |

### 8.5 Ghi và ngân sách dung lượng

- **Ghi có điều tiết:** `after()` hiện gọi `save()` ngay sau mọi hành động. Bản v2 gom ghi bằng `saveSoon()` (trễ 800 ms, gộp nhiều lần) + ghi ngay ở `pagehide`, `visibilitychange → hidden`, `pause()` của iOS.
- **Ngân sách:** `localStorage` của origin dùng chung với app chính (bói toán) và giới hạn khoảng 5 MB (tùy trình duyệt). Trạng thái game ≤ 256 KB:

| Khối | Trần | Cách giữ |
|---|---|---|
| `ledger.entries` | 2.000 mục (≈ 120 KB) | cũ hơn gộp thành mục tổng theo tháng `{ kind: 'rollup', month, thien, ac, net }` |
| `quests.done` | không giới hạn số khóa nhưng mỗi mục chỉ là `ts` (≈ 30 byte) | 500 nhiệm vụ ≈ 15 KB |
| `caseLog` | 40 (đã có) | |
| `sticks`, `lanterns` | 30 / 50 (đã có) | |
| `persona.mem` | 5 ghi chú × 120 ký tự × số NPC | ≈ 25 KB tối đa |

- `saveState` trả `false` khi đầy quota (đã có). Bản v2 thêm: khi lỗi quota → gộp `ledger` sớm, xóa `:corrupt` cũ, thử lại một lần, rồi báo toast «Bộ nhớ trình duyệt đầy».

### 8.6 Bất biến (kiểm ở `checkInvariants` và test)

1. `xp ≥ 0`, `phucKhi` là số hữu hạn, `dao.daoHanh ≥ 0` (Đạo Hạnh có thể giảm khi phạm giới nhưng không âm).
2. `dao.realmMax` ∈ 1..6 và `≥ realmOf(T, 0)`.
3. `size(dao.schools) ≤ 3`.
4. `ledger.net = Σ entries.points + Σ rollup.net` (lệch → tính lại từ entries, ghi cảnh báo).
5. Mỗi khóa trong `quests.active` có trong danh mục nhiệm vụ đã nạp; khóa lạ chuyển vào `quests.orphan` (không xóa) để nội dung bản sau khôi phục được.
6. `consent.cloudBirth = false` → bản đồng bộ đám mây **không** chứa `player.birth` và `profiles[].year/month/day/hour/minute` (phần 08).

## 9. Bộ đệm lá số

`stations.js › chartOf` hiện là `Map` không giới hạn. Thay bằng:

```js
const LRU_MAX = 24;                         // 5 hồ sơ + khách NPC trong ngày + lá số án đang mở
export function chartOf(p, { now = new Date() } = {}) {
  const refYear = now.getFullYear();
  const k = `${p.year}-${p.month}-${p.day}-${p.hour}-${p.minute}-${p.gender}@${refYear}`;
  …LRU get/set…
}
```

- Năm tham chiếu đưa vào khóa → qua năm mới tự tính lại (`liunian.isNow` đúng).
- `refreshDay()` của `main.js` gọi `menh.refreshThoiVan()` mỗi phút (đã có nhịp 60 s), chi phí ≈ vài micro giây khi không đổi năm.

## 10. Sửa lỗi engine trước M0

### 10.1 D1 — `remedy-fate.js` so sai chữ Kiếp Tài

**Hiện trạng** (`getRemedyForChart`, `getYeguoForChart`):

```js
const gods = ['year','month','day','time'].map(p => R.chart?.pillars?.[p]?.ganGod).filter(Boolean);
const hasJie = gods.includes('劫财');            // engine trả '劫財' → luôn false
```

**Sửa:**

1. Thêm `normGod(s)` dùng chung (đặt ở `src/engine/core.js`, xuất cho mọi module):

```js
const SIMP2TRAD = { 劫财: '劫財', 伤官: '傷官', 七杀: '七殺', 正财: '正財', 偏财: '偏財' };
export const normGod = (g) => SIMP2TRAD[g] || g;
```

2. Gom thập thần **cả can lẫn tàng can** (bản sơ đồ tổng Phụ lục B ý 2):

```js
function godsOf(R) {
  const out = new Set();
  for (const p of ['year', 'month', 'day', 'time']) {
    const pl = R.chart?.pillars?.[p]; if (!pl) continue;
    if (pl.ganGod && pl.ganGod !== '日主') out.add(normGod(pl.ganGod));
    for (const h of pl.hidden || []) if (h.god) out.add(normGod(h.god));
  }
  return out;
}
```

3. Mọi phép so trong hai hàm dùng **dạng phồn thể chuẩn** (`'劫財'`, `'七殺'`, `'傷官'`) trên `godsOf(R)`.

**Tác động hành vi:** lá số có Kiếp Tài (can hoặc tàng can) giờ nhận nhánh «Tài đa» trong `getRemedyForChart` và nghiệp «嗔» trong `getYeguoForChart`; lá số chỉ có Thất Sát/Thương Quan **trong tàng can** giờ cũng được nhận. `needLevel` có thể tăng từ «trung» lên «cao». Đây là thay đổi nội dung trang chính (mục Cải Mệnh) → ghi vào nhật ký thay đổi của app, và `ENGINE_V` của game tăng.

**Test (thêm vào `selftest.mjs` và `scripts/test-engine-fixes.mjs`):**

| Ca | Kỳ vọng |
|---|---|
| Lá số có `劫財` ở can tháng | `getRemedyForChart(R).relevant` chứa mục `when` khớp `/Tài đa/` |
| Lá số chỉ có `劫財` trong tàng can | như trên |
| Lá số không có Tỷ Kiếp | không chứa mục «Tài đa» |
| `getYeguoForChart` với `七殺` chỉ ở tàng can | có mục `YEGUO[0]` |
| Hồi quy: `remedySummary(R)` của 20 lá số ngẫu nhiên có hạt giống không ném lỗi | |

### 10.2 D2 — `daozang-data.js` đọc `R.yong.god`

**Sửa:** `const yong = R?.yong?.primary;` (khóa của `_YONG2CULT` là ký tự hành `'木'…'水'`, khớp `yong.primary`).

**Test:** `suggestDaozangChartAware(R_MAU_A, '')` trả `yongAdvice` chứa «Dụng Thần 水» và `kinh` có ít nhất một mục `fromChart: true`. Trước khi sửa hàm trả `yongAdvice = ''` (test đỏ trên code hiện tại → chứng minh lỗi có thật).

**Rà thêm cùng tệp:** `_PATTERN2CULT` dùng khóa `'劫财格'` (giản thể) trong khi `R.pattern.name` của engine dùng dạng phồn thể (vd `'七殺格'`) → kiểm toàn bộ khóa `_PATTERN2CULT` với tập tên cách thật mà `pattern.js` có thể trả (TASK-004 tạo danh sách).

### 10.3 D3 — cùng lớp lỗi trong `ai.js` và các tệp khác

- `ai.js` dòng 377 (khối «TỔ HỢP KINH ĐIỂN»): `has('伤官')`, `has('七杀')`, `has('正财')`, `has('偏财')`, `has('劫财')` trên tập lấy từ `ganGod` và `hidden[].god` (phồn thể) → các tổ hợp 伤官配印, 杀印相生, 食制杀, 财生官, 官煞混杂, 比劫争财 có thể không bao giờ vào brief.
- Cách làm: TASK-004 viết `scripts/lint-tengod.mjs`:
  1. lấy tập thập thần chuẩn từ `core.js › tenGod` (10 giá trị phồn thể);
  2. quét `src/engine/*.js` tìm chuỗi literal giản thể của 5 thập thần khác dạng (`劫财`, `伤官`, `七杀`, `正财`, `偏财`) xuất hiện **trong ngữ cảnh so sánh** (`includes(`, `===`, `has(`, khóa object dùng để tra);
  3. in danh sách tệp:dòng; CI fail nếu có mục mới không nằm trong danh sách ngoại lệ (`scripts/lint-tengod.allow.json`, cho các chuỗi chỉ để hiển thị hoặc là tên sao Tử Vi).
- TASK-005 sửa từng chỗ bằng `normGod` (không thay chuỗi hiển thị cho người đọc).
- Kiểm hồi quy: `npm run accuracy` và `npm test` phải giữ hoặc tăng số ca đạt; so `buildChartBrief` trước/sau với 50 lá số: chỉ được khác ở khối tổ hợp.

### 10.4 Phát hành sửa engine

1. Một PR riêng «engine: chuẩn hóa thập thần phồn thể» gồm D1–D3, không trộn với code game.
2. `ENGINE_V` của game tăng; `menhban` phát hiện `hash` đổi → hiện thông báo khác biệt một lần.
3. Ghi vào nhật ký thay đổi app (`docs/CUO-PHAP-QUET-SAU-2026-10.md` hoặc tệp nhật ký hiện hành của engine) vì người dùng trang chính cũng thấy khác.

## 11. Lá số mẫu dùng chung — SCHEMA-MAU-CHART

Để mọi tài liệu và test dùng cùng con số, TASK-033 sinh `src/game/data/mau-charts.json` bằng script `scripts/gen-mau-charts.mjs` (chạy engine thật, không chép tay):

```jsonc
{
  "generatedAt": "2026-11-05T09:00:00Z",
  "engineV": "2026.11.1",
  "charts": [
    {
      "id": "MAU-A",
      "input": { "year": 1990, "month": 5, "day": 15, "hour": 8, "minute": 30, "gender": "nam", "refYear": 2026 },
      "expect": {                          // chỉ các trường test khóa cứng
        "tiemLuc": 41, "phamCanIdx": 2, "lop": "DC", "pattern": "七殺格",
        "dung": "水", "hy": "金", "ky": "土", "cuu": "火",
        "nguDuy": { "cai": 26, "guan": 45, "yin": 54, "shi": 15, "ti": 100 },
        "menhCap": "清贵", "nguyenKhi": 23, "liudao": "人道"
      }
    }
  ]
}
```

- Canon §11 yêu cầu ≥ 6 lá số phủ: điểm < 28, 28–35, 50–57, ≥ 73, cách 有救, cách 特殊. Script **tìm** lá số thỏa từng nhóm bằng quét có hạt giống (ngày 1950–2010, giờ chẵn) rồi ghi `MAU-C…MAU-H` kèm ngày giờ; tài liệu 04 chọn tên/ý nghĩa, không đổi ngày giờ.
- Khi engine đổi số, script chạy lại và test `test-menhban` báo khác biệt; người duyệt quyết định cập nhật `expect` (không tự động).

## 12. Kiểm thử phần này

| Bộ test | Ca chính |
|---|---|
| `scripts/test-menhban.mjs` | `MAU-A…H` khớp `expect`; `validateMenhBan` qua với 500 lá số ngẫu nhiên có hạt giống; `phamCanOf` đúng 10 ngưỡng (biên 27/28, 35/36 … 85/86); `nghichThien(20) = 1,4`, `nghichThien(60) = 1`, `nghichThien(88) = 1`, `nghichThien(0) = 1,5`; engine phụ ném lỗi → trường `null` và `warnings` có tên; `'未知'` → `lop = null` |
| `scripts/test-realm.mjs` | bảng §6.1; đơn điệu theo D; `realmMax` giữ bậc khi D giảm; `daoHanhGain` cực đại ≈ 2,36 × base; trần ngày |
| `scripts/test-save-v2.mjs` | di trú v1 → v2 giữ mọi trường cũ (so sâu); v1 không bị ghi; khóa lạ giữ trong `_extra` và ghi lại; v2 hỏng → rơi về v1; quota đầy → gộp ledger và thử lại; bất biến §8.6 |
| `scripts/test-engine-fixes.mjs` | §10.1, §10.2, §10.3 |
| `scripts/lint-tengod.mjs` | chạy trong CI |
