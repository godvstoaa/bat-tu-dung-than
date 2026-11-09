# 04-01 · Tổng quan — nguyên tắc, luồng dữ liệu, đường ống Mệnh Bàn

## 1. Tám nguyên tắc của hệ chỉ số

| # | Nguyên tắc | Hệ quả bắt buộc |
|---|---|---|
| N1 | **Nguồn duy nhất là engine** (T1). | Mỗi chỉ số Tiên Thiên phải chỉ ra được trường `R.*` hoặc hàm đọc `R`. Không công thức bói mới. Lớp chuyển đổi của game (tầng, hệ số) phải ghi rõ là «lớp game». |
| N2 | **Chỉ cộng, không trừ** (T2). | Không chỉ số nào làm người chơi yếu hơn mức nền. Cái «xấu» của lá số thành **thử thách có thưởng** (Kỵ hành ×1,3, kiếp số, năm hạn). |
| N3 | **Tất định.** | Cùng đầu vào + cùng phiên bản engine + cùng `refYear` → cùng Mệnh Bàn, từng chữ số. Không gọi `Date.now()` trong lớp tính. |
| N4 | **Tiên Thiên bất biến theo thời gian.** | Chỉ Thời Vận (`STAT-THOIVAN-*`) và sinh lực hiện tại đổi theo năm thật. Đã kiểm: `MAU-A` ở `refYear` 2000/2026/2040 cùng Tiềm Lực 41. |
| N5 | **Minh bạch.** | Mọi con số có «Vì sao?». Không «hộp đen». Người chơi xem trang chính và game thấy **cùng một con số**. |
| N6 | **Tách Tiên Thiên / Hậu Thiên.** | Tiên Thiên hiển thị nguyên; Hậu Thiên (Bổ Hành, Bổ Khuyết, Đạo Hạnh, tâm ma đã giảm) hiển thị **lớp riêng chồng lên**, không ghi đè số gốc. |
| N7 | **Không bán chỉ số** (canon §7). | Không SKU nào cộng Đạo Hạnh, cảnh giới, công đức, Ngũ Hành Lực, Ngũ Duy. Trang phục chỉ cộng Phúc Khí qua «Hợp mệnh» (đã có, +10%). |
| N8 | **Riêng tư.** | Ngày giờ sinh chỉ lưu trên máy (đúng `main.js` hiện tại: «Ngày sinh chỉ lưu trên máy này»). Lên mạng chỉ gửi **tập hiển thị công khai** (04-12 §6). |

## 2. Thuật ngữ và ký hiệu dùng trong tài liệu 04

| Ký hiệu | Nghĩa |
|---|---|
| `R` | Kết quả `chart.js › analyze()` đầy đủ |
| `TL` | Tiềm Lực = `R.synthesis.score` |
| `NT` | Hệ số Nghịch Thiên |
| `ĐH` | Đạo Hạnh (Hậu Thiên) |
| `CC` | Căn Cơ = `TL × 0,4` |
| `bậc` | Cảnh giới 1–6 (canon §5) |
| `tầng` | Mức của một hành trong Ngũ Hành Lực, 0–5 |
| «công tu» | Đơn vị Đạo Hạnh **thô** (trước khi nhân NT và trần ngày); tài liệu 09 cấp công tu cho từng hoạt động |
| «hoạt động Kỵ» | Hoạt động gắn thẻ hành = Kỵ hành của người chơi (vùng / giờ / mùa / loại việc) |
| «lớp game» | Biến đổi do game định nghĩa trên số engine (không phải cổ pháp) |

Hành viết theo thứ tự Ngũ Hành của engine: `木 火 土 金 水` (Mộc, Hỏa, Thổ, Kim, Thủy).

## 3. Bảng tổng 32 chỉ số

Cột «Lớp»: **TT** = Tiên Thiên (bất biến), **TV** = Thời Vận (đổi theo năm), **HT** = Hậu Thiên (tích lũy), **PS** = phái sinh từ các cột khác.

| # | Mã | Tên | Nguồn | Thang / kiểu | Làm tròn | Lớp | Phần |
|---|---|---|---|---|---|---|---|
| 1 | `STAT-TIEMLUC` | Tiềm Lực | `R.synthesis.score` | số nguyên 0–100 | engine đã `Math.round` + kẹp | TT | 02 |
| 2 | `STAT-BACHPHAN` | Bách phân vị | `R.synthesis.percentile` | số nguyên 1–99 | engine | TT | 02 |
| 3 | `STAT-VISAO` | «Vì sao?» | `R.synthesis.factors[]` | danh sách {Δ, chữ} | Δ nguyên | TT | 02 |
| 4 | `STAT-PHAMCAN` | Phẩm căn | ngưỡng trên `score` (khớp `gradeVi`) | 10 bậc | — | TT | 02 |
| 5 | `STAT-PHUCPHAN` | Phúc phận | `R.synthesis.fortune` | 6 bậc | — | TT | 02 |
| 6–10 | `STAT-NHL-*` | Ngũ Hành Lực (5) | `R.wx.pct[w]` × hệ số Dụng/Kỵ | số nguyên 0–130 | `Math.round` | TT | 03 |
| 11 | `STAT-NHL-TANG` | Tầng hành | từ Ngũ Hành Lực | 0–5 | ngưỡng | PS | 03 |
| 12 | `STAT-BOHANH` | Bổ Hành | điểm tu | 0–20 mỗi hành | nguyên | HT | 03 |
| 13 | `STAT-THANLUC` | Thân Lực | `R.strength.effRatio`, `.level` | 0–100 + 5 mức | `Math.round(×100)`, kẹp | TT | 03 |
| 14–18 | `STAT-THIENMENH` … `STAT-NHANHANH` | Dụng / Hỷ / Kỵ / Cừu / Nhàn | `R.yong.primary/xi/ji/chou/xian` | hành | — | TT | 03 |
| 19 | `STAT-THIENTHOI` | Hành của vùng/giờ/mùa | bảng game + lịch thật | hành | — | PS | 03 |
| 20–24 | `STAT-NGUDUY-*` | Ngũ Duy (5) | `fiveDimRadar(R.chart).dims[].score` | 0–100 | engine | TT | 04 |
| 25 | `STAT-MENHCACH` | Mệnh Cách | `R.pattern.type` + `R.patternQuality.quality` | 4 lớp + trạng thái con | — | TT | 05 |
| 26 | `STAT-MENHCAP` | Mệnh Cấp | `classifyChartLevel(R).level` | 6 bậc | — | TT | 05 |
| 27 | `STAT-NGUYENKHI` | Nguyên Khí | `analyzeVitality(R).baseVitality` | nền 0–100 → tối đa 100–150 | `Math.round` | TT | 05 |
| 28 | `STAT-DACTINH` | Đặc Tính | `R.shensha` + `analyzeNobleStars(R)` | danh sách `PERK-*` + bậc I/II | — | TT | 06 |
| 29 | `STAT-QUYKHI` | Quý Khí | `analyzeNobleStars(R).assessment` | 4 mức | — | TT | 06 |
| 30 | `STAT-TUCNGHIEP` + `STAT-TAMMA-*` | Túc Nghiệp + tâm ma | `computeLiuDao(R)` | cõi + 3 thanh 0–100 | engine | TT (+HT giảm) | 07 |
| 31 | `STAT-TINHKHI` + `STAT-NAPAM` | Tính Khí, danh xưng | `getPersonalityProfile`, `dayNayinPersonality` | 10 × 30 | — | TT | 07 |
| 32 | `STAT-THOIVAN-DV/LN` | Thời Vận | `R.dayun[current]`, `R.liunian[isNow]` | 7 + 6 mức | — | TV | 08 |
| — | `STAT-DAOHANH`, `STAT-NGHICHTHIEN`, `STAT-CANCO`, `STAT-CANHGIOI` | Hậu Thiên | công thức canon | — | xem 08 | HT/PS | 08 |
| — | `STAT-FLAG-*` | 17 cờ tổ hợp | `R.synthesis.combos[]` | cờ boolean (+ «đã chế») | — | TT | 07 |

## 4. Đường ống `buildMenhBan` (chưa có — cần làm)

Hàm thuần, đặt ở `src/game/menhban.js` (đề xuất). Không đụng DOM, không đọc đồng hồ. Đầu vào đã chuẩn hóa ở 04-11.

```js
// src/game/menhban.js — PHÁC THẢO THAM CHIẾU (không phải code đã có)
import { analyze } from '../engine/chart.js';
import { fiveDimRadar } from '../engine/five-dim-radar.js';
import { classifyChartLevel } from '../engine/chart-level.js';
import { analyzeVitality } from '../engine/vitality.js';
import { analyzeNobleStars } from '../engine/noble-stars.js';
import { computeLiuDao } from '../engine/liudao.js';
import { getPersonalityProfile } from '../engine/personality-profile.js';
import { dayNayinPersonality } from '../engine/nayin-personality.js';

export const MENHBAN_VERSION = 1;          // tăng khi lớp game đổi công thức
const WX = ['木', '火', '土', '金', '水'];

export function buildMenhBan(birth, refYear) {
  // birth = { y, m, d, h, mi, gender, hourUnknown } — h/mi đã là 12/0 nếu hourUnknown
  const R = analyze(birth.y, birth.m, birth.d, birth.h, birth.mi, birth.gender, refYear);
  R.asOfYear = refYear;                     // E3: vitality tất định
  const safe = (fn, fb) => { try { return fn(); } catch { return fb; } };

  const syn = R.synthesis || {};
  const tl = syn.score ?? null;             // null = engine lỗi → xem §6
  const y = R.yong;

  const nhl = {};
  for (const w of WX) {
    const k = w === y.primary ? 1.3 : w === y.ji ? 0.8 : 1.0;
    const v = Math.round((R.wx.pct[w] || 0) * k);
    nhl[w] = { pct: R.wx.pct[w], k, v, tang: tangOf(v) };   // tangOf: 04-03 §2
  }

  const radar = safe(() => fiveDimRadar(R.chart), null);
  const level = safe(() => classifyChartLevel(R), { level: 'unknown' });
  const vit   = safe(() => analyzeVitality(R), { baseVitality: 0, currentVitality: 0 });
  const noble = safe(() => analyzeNobleStars(R), { stars: [], assessment: { level: '贵气微薄', score: 0 } });
  const liudao = safe(() => computeLiuDao(R), { ok: false });
  const tinhKhi = safe(() => getPersonalityProfile(R), null);
  const napAm = safe(() => dayNayinPersonality(R), null);

  return {
    v: MENHBAN_VERSION,
    engine: ENGINE_FINGERPRINT,              // §7.2
    birthHash: hashBirth(birth),             // không lưu ngày sinh vào đây
    hourUnknown: !!birth.hourUnknown,
    tienThien: {
      tiemLuc: tl,
      bachPhan: syn.percentile,
      phamCan: phamCanOf(tl),                // 04-02 §4
      phucPhan: syn.fortune,                 // 04-02 §5
      viSao: (syn.factors || []).map(toFactor), // 04-02 §3
      nguHanhLuc: nhl,
      thanLuc: { v: clamp(Math.round(R.strength.effRatio * 100), 0, 100),
                 level: R.strength.level, strong: R.strength.strong },
      thienMenh: { dung: y.primary, dungPhu: y.secondary || null, hy: y.xi,
                   ky: y.ji, cuu: y.chou, nhan: y.xian },
      nguDuy: radar && Object.fromEntries(radar.dims.map(d => [d.key, d.score])),
      nguDuyTroi: radar?.dominant.key, nguDuyKhuyet: radar?.weakest.key,
      menhCach: menhCachOf(R),               // 04-05 §2
      menhCap: level.level,
      nguyenKhiNen: vit.baseVitality,
      dacTinh: perksOf(R, noble),            // 04-06 §2
      quyKhi: noble.assessment,
      tucNghiep: liudao.ok ? { coi: liudao.primary, tamDoc: liudao.poisons } : null,
      tinhKhi: tinhKhi?.gan, napAm: napAm?.nayin,
      flags: (syn.combos || []).map(c => ({ id: c.id, tone: c.tone, che: !!c.mitigation })),
    },
    thoiVan: thoiVanOf(R, refYear),          // 04-08 §6 — tính lại mỗi Lập Xuân
    sinhLucHienTai: vit.currentVitality,     // đổi theo năm
  };
}
```

### 4.1 Thứ tự và phụ thuộc

| Bước | Hàm | Cần | Nếu lỗi |
|---|---|---|---|
| 1 | `analyze` | đầu vào hợp lệ | **dừng**, hiện lỗi tiếng Việt của engine (vd «Ngày 29/2/2025 không tồn tại…») ở cổng |
| 2 | `R.asOfYear = refYear` | `R` | — |
| 3 | `fiveDimRadar(R.chart)` | `R.chart.pillars[*].ganGod/hidden` | Ngũ Duy = `null` → cây kỹ năng mở đều 5 trục, không trục trội |
| 4 | `classifyChartLevel(R)` | `R.wx`, `R.yong`, `R.pattern`, `R.synthesis` | trả `'unknown'` (engine tự chặn) → khung tên không danh hiệu |
| 5 | `analyzeVitality(R)` | `R.dayun`, `R.asOfYear` | nền = 0 → Nguyên Khí tối đa = 100 (sàn) |
| 6 | `analyzeNobleStars(R)` | `R.shensha` | Quý Khí «微薄», không `PERK-guoYin` |
| 7 | `computeLiuDao(R)` | `R.chart`, `R.strength`, `R.shensha`, `R.interactions` | engine trả `ok:false` → Túc Nghiệp ẩn, 3 thanh tâm ma = 0 |
| 8 | Tính Khí, nạp âm | `R.chart.dayGan`, `R.chart.pillars.day.nayin` | dùng tên can thuần |

Các bước 3–8 độc lập, có thể chạy song song trong Worker (04-12 §7).

### 4.2 Đo hiệu năng

Đo thật trên máy phát triển (Node 24): **5.000** lần `buildMenhBan` (bản tham chiếu) mất **7,8 giây**, tức ~1,6 ms/lá số gồm cả 8 bước. Mệnh Bàn chỉ dựng một lần lúc vào cổng và một lần mỗi Lập Xuân → không cần tối ưu thêm cho người chơi. Riêng NPC (giải án, sảnh nghề) đã có `chartCache` ở `stations.js`; dùng lại cơ chế đó.

## 5. Phân lớp dữ liệu và vòng đời

| Lớp | Tính lúc | Lưu ở | Đổi khi | Ai đọc |
|---|---|---|---|---|
| Tiên Thiên (`tienThien`) | vào cổng; Sửa bát tự; đổi phiên bản engine ở ranh mùa | `state.player.menhBan` (máy) | không bao giờ trong một mùa | mọi hệ thống |
| Thời Vận (`thoiVan`) | vào cổng; mỗi Lập Xuân; mỗi khi mở game sang năm can chi mới | `state.player.menhBan.thoiVan` | mỗi năm can chi | thưởng, Vận Mệnh Các, Thái Tuế Điện |
| Hậu Thiên | mỗi hoạt động | `state.player.hauThien` | liên tục | cảnh giới, Thiên Bảng |
| Phái sinh | khi cần | không lưu | — | UI |

`state.player` hiện có (`main.js`): `name, look, birth, yong{primary, accent, ji}, robe, accent, createdAt`. Tài liệu này thêm `menhBan` và `hauThien`; `yong` cũ giữ để tương thích ngược (Tàng Y Các, `progress.js › WX_GIATRI`).

## 6. Quy tắc lỗi và giá trị rỗng

| Tình huống | Hành vi |
|---|---|
| `synthesis` rỗng (engine nuốt lỗi, trả `{ paragraphs: [] }`) | Tiềm Lực = `null`. Mệnh Bàn hiện «Thầy đang đọc lại lá số» và **không** tạo nhân vật; ghi log `menhban.synth_fail` kèm `birthHash`. Không bao giờ gán điểm mặc định (gán 45 sẽ là «bói bừa», vi phạm T1). |
| `patternQuality === null` | Mệnh Cách = Thuận Thiên, `sub: '未知'`, cờ `nguon: 'fallback'`; mở màn trung tính (03 quyết). |
| `quality === '未知'` | Như trên. Quét 3.000 lá số: **0 ca** (mọi cách đều có luật trong `GE_RULES`). |
| `yong.secondary === ''` | Không có Dụng phụ (engine cố ý xóa khi trùng Kỵ). UI không hiện dòng «Dụng phụ». |
| `R.liunian.length === 0` | Thời Vận lưu niên = «Tiểu vận» (chưa khởi vận hoặc năm tham chiếu trước năm sinh) — 04-11 §8. |
| Một hành có `pct = 0` | Ngũ Hành Lực = 0, tầng 0 «Khuyết» → mở chuỗi Bổ Hành (04-03 §3). |
| Một trục Ngũ Duy `score = 0` | Trục «Khuyết» (engine trả 0 khi `raw = 0`). Quét 5.000 lá: **23,7%** lá số có ít nhất một trục 0. |

## 7. Tất định, phiên bản và bộ nhớ đệm

### 7.1 Khóa đệm

`key = hash(y, m, d, h, mi, gender, hourUnknown, ENGINE_FINGERPRINT, MENHBAN_VERSION)`; `thoiVan` thêm `refYearLichXuan`.

### 7.2 Dấu vân tay engine

`ENGINE_FINGERPRINT` = băm danh sách 8 lá số kiểm chuẩn (`MAU-A`, `MAU-C`, `MAU-G`, `MAU-J`, `MAU-K`, `MAU-L`, `MAU-M`, `MAU-N`) → chuỗi `score|quality|level` nối lại. Tính một lần lúc build. Engine đổi thuật toán → dấu đổi → biết cần đọc lại.

### 7.3 Khi engine nâng cấp làm đổi số

App gốc còn đang tinh chỉnh engine (hàng nghìn «loop»). Nếu đổi số giữa chừng, người chơi sẽ thấy Phẩm căn nhảy bậc — cảm giác bị «phán lại». Quy tắc:

1. Tiên Thiên của người chơi **đóng băng trong một mùa** (một năm can chi, canon §9.2).
2. Ở ranh mùa, nếu dấu vân tay đổi: tính lại, hiện cảnh Thầy Tử Bình «đọc lại lá số» (thoại do 06 viết), so sánh cũ / mới trong «Vì sao?».
3. Hậu Thiên **không đổi**. Đạo Hạnh đã kiếm giữ nguyên số đã ghi (không tính lại theo NT mới — khác Sửa bát tự, 04-11 §9, vì đây không phải lựa chọn của người chơi).
4. Trang chính của app luôn dùng engine mới nhất; trong một mùa, game có thể lệch trang chính. Mệnh Bàn ghi chú «Theo lá số đọc ngày …».

## 8. Ma trận tác động: chỉ số → hệ thống

| Chỉ số | Thưởng hoạt động | Cây kỹ năng | Cốt truyện | Thoại / NPC | Thiên Bảng | Ngoại hình |
|---|---|---|---|---|---|---|
| Tiềm Lực | Căn Cơ (bậc 1–3) | — | mở Nghịch Thiên Lộ (PC1–2) | Thầy nhắc điểm đúng cách (04-13) | cột Tiên Thiên (ẩn mặc định) | hào quang theo Phẩm căn |
| Phúc phận | ×Phúc Khí theo bậc | — | chuỗi ẩn «tiềm năng ẩn» | — | — | — |
| Ngũ Hành Lực | +% theo tầng từng loại việc | — | chuỗi Bổ Hành | — | — | hạt linh khí theo hành mạnh nhất |
| Thân Lực | tự lực / nhận trợ | — | — | sư phụ chủ động hơn với thân nhược | — | — |
| Thiên Mệnh | Hợp mệnh +10% Phúc Khí; Kỵ ×1,3 ĐH | — | «bổ Dụng» là mạch chính Hồi I | màu áo, Thầy giảng | — | phẩm phục (đã có) |
| Ngũ Duy | — | hệ số thiên phú, nút khởi đầu | chuỗi Bổ Khuyết | — | — | — |
| Mệnh Cách | — | — | mở màn `BR-TT/DC/NT/DK` | người dẫn đạo | — | — |
| Mệnh Cấp | — | — | — | lời chào đầu | — | khung tên |
| Nguyên Khí | lượt việc nặng/ngày | — | — | — | — | — |
| Đặc Tính | +% theo loại việc | 1 số nút mở sớm | móc `PERK-*/Q*` | thoại riêng | — | — |
| Túc Nghiệp, tâm ma | ĐH khi chuyển hóa | — | mở đầu tiền kiếp | Diệu Âm, Phán quan | — | — |
| Tính Khí, nạp âm | — | — | — | giọng lựa chọn, danh xưng | — | danh hiệu |
| Thời Vận | +0–10% | — | «năm hạn» Hồi III | Thái Tuế Điện | — | — |
| Đạo Hạnh | — | — | mốc cảnh giới | — | cột chính | — |

## 9. Trần cộng dồn toàn cục

Để chỉ số «đẹp» không phá cân bằng, mọi phần thưởng gộp theo **bốn rổ**, mỗi rổ có trần riêng; các rổ nhân với nhau.

| Rổ | Gồm | Trần | Ghi chú |
|---|---|---|---|
| R1 · Năng khiếu | Ngũ Hành Lực theo tầng + Đặc Tính + nút Ngũ Duy cho đúng loại việc | **+40%** | cộng trong rổ |
| R2 · Thiên thời | hợp hành vùng/giờ/mùa + Thời Vận dương | **+15%** | cộng trong rổ |
| R3 · Thử thách | Kỵ ×1,3 (nhân) · Cừu ×1,15 · năm hạn/vận hạn +5…+15% · kiếp số | ×1,3 × (1 + **≤30%**) | chỉ áp hoạt động gắn thẻ thử thách |
| R4 · Nghịch Thiên | NT | ×1,0–1,5 | chỉ áp Đạo Hạnh, không áp Phúc Khí |

`ĐH_nhận = congTu_sauTrầnNgày × (1 + R1) × (1 + R2) × R3 × NT` — chi tiết và ví dụ ở 04-08 §2.

Phúc Khí dùng R1, R2 và các hệ số Phúc phận / Hợp mệnh / Hỷ hành (04-02 §5, 04-03 §5); không có R3, R4.

## 10. Quan hệ giữa các chỉ số

```
           ┌───────────── Tiềm Lực ──────────────┐
           │ (tổng của: cách cục, Dụng/Hỷ/Kỵ lực, │
           │  tổ hợp, xung hình, 源流, 盖头截脚,  │
           │  拱夹, cát tinh, không vong)          │
           └──┬───────────┬──────────┬────────────┘
              │           │          │
        Phẩm căn     Phúc phận    Mệnh Cấp (chặn theo điểm <22/<31/<40)
              │                      │
           Căn Cơ ── Cảnh giới ←── Đạo Hạnh × NT(Tiềm Lực)
                                     ▲
 Thiên Mệnh ── Ngũ Hành Lực (×1,3 Dụng, ×0,8 Kỵ) ── tầng ── R1
     │                                   │
     └── Kỵ/Cừu ─► R3 thử thách ◄─ Thời Vận (đại vận, lưu niên dùng Dụng/Hỷ/Kỵ/Cừu)
 Thân Lực ── tự lực / nhận trợ ── Quý Khí (số lần quý nhân) ── Đặc Tính quý nhân
 Mệnh Cách ── bệnh/thuốc ─► Dụng (engine: 有救 → thuốc làm Dụng chính) ─► Thiên Mệnh
```

Hai liên kết quan trọng do engine tạo, game phải tôn trọng:

1. **Mệnh Cách quyết định Dụng thần khi `有救`**: `analyze()` thăng thuốc cứu lên Dụng chính (`★ Bệnh Dược LÀM CHỦ`). Nghĩa là «vị thuốc» người chơi đi tìm ở lộ Đắc Cứu **chính là** Thiên Mệnh Hành — hai hệ thống kể cùng một chuyện.
2. **Mệnh Cấp bị chặn bởi Tiềm Lực**: `classifyChartLevel` chặn tối đa 1/2/3 tiêu chí khi điểm < 22/31/40. Một lá số không thể «Phú Cách» với Tiềm Lực 35. UI không cần tự kiểm.

## 11. Phân bố tham chiếu (quét 5.000 lá số thật)

Mẫu: năm 1950–2009, tháng/ngày/giờ ngẫu nhiên (seed 777), 2 giới, `refYear` 2026. Dùng cho cân bằng; không hiển thị cho người chơi.

| Chỉ số | Phân bố |
|---|---|
| Tiềm Lực | nhỏ nhất 9 · trung vị 48 · lớn nhất 86 (quét 3.000: 9 / 48 / 84) |
| Phẩm căn | PC1 5,5% · PC2 11,7% · PC3 19,3% · PC4 21,8% · PC5 21,5% · PC6 13,5% · PC7 4,8% · PC8 1,7% · PC9 0,2% · PC10 < 0,1% (1 ca) |
| Phúc phận | đại phú quý 1,1% · phú quý 14,7% · tiểu phú quý 25,9% · khá no 27,7% · bình 22,0% · tiềm năng ẩn 8,6% |
| Mệnh Cách | Nghịch Thiên 50,9% · Đắc Cứu 32,2% · Dị Cách 15,0% (thành 3,7 / cứu 5,8 / bại 5,5) · Thuận Thiên 1,9% |
| Mệnh Cấp | Cực Phẩm 0,2% · Quý Cách 7,3% · Phú Cách 19,1% · Thanh Quý 41,5% · Thường Cách 25,6% · Hạ Cách 6,3% |
| Thân Lực | quá nhược 25,4% · nhược 23,0% · trung hòa 4,4% · vượng 23,6% · quá vượng 23,6% |
| Thân Lực (số) | phân vị 10/25/50/75/90: 29 / 38 / 50 / 61 / 72 |
| Nguyên Khí nền | phân vị 10/25/50/75/90: 14 / 17 / 22 / 28 / 33 · lớn nhất 73 |
| Túc Nghiệp | Nhân 38,0% · Địa Ngục 32,0% · Ngạ Quỷ 19,2% · Thiên 6,6% · A Tu La 4,1% · Súc Sinh 0,2% |
| Quý Khí | hiển hách 18,4% · trung thượng 29,8% · bình 37,2% · vi bạc 14,6% |
| Ngũ Duy trội | Tài 20,9 · Ấn 20,4 · Tỷ 19,9 · Quan 19,9 · Thực 18,9 (%) — gần đều |
| Dụng thần ở tầng | Khuyết 12,0% · Nhược 12,7% · Bình 23,0% · Vượng 21,3% · Thịnh 17,9% · Cực 13,0% |

Hệ quả thiết kế rút ra:

- **Thuận Thiên hiếm (1,9%)** → mở màn «Tổ Sư nhận ngay» là trải nghiệm hiếm, có giá trị kể chuyện; không phải mặc định.
- **Nghịch Thiên phổ biến (50,9%)** → lộ Nghịch Thiên phải đầy đủ như lộ chính.
- **Địa Ngục Đạo 32%** → khung kể Túc Nghiệp phải là «hồi quang», không phải «tội đồ» (04-07 §2, 04-13).
- **12% người chơi có Dụng thần ở tầng Khuyết** → «bổ Dụng» là mạch Hồi I cho mọi người, nhưng với 12% này nó là trục chính (như `MAU-A`: Thủy 2,2%).

## 12. Checklist nghiệm thu phần 04-01

- [ ] `buildMenhBan` thuần, không `Date.now()`, không DOM; có `MENHBAN_VERSION`.
- [ ] Đặt `R.asOfYear` trước `analyzeVitality`.
- [ ] Bước 3–8 bọc riêng `try`; lỗi một bước không làm hỏng các bước khác.
- [ ] `synthesis` rỗng → không tạo nhân vật, không gán điểm mặc định.
- [ ] Tiên Thiên đóng băng trong mùa; Thời Vận tính lại mỗi Lập Xuân.
- [ ] Tập công khai gửi mạng không chứa ngày giờ sinh.
- [ ] Phân bố §11 tái tạo được bằng seed 777 (kiểm thử thống kê, 04-12 §9).
