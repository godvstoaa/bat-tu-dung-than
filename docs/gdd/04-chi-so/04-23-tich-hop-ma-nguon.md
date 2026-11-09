# 04-23 · Tích hợp mã nguồn — module, hàm, điểm nối với code đã có

> Phần này là đặc tả cho lập trình viên. Mọi mục ghi «**(chưa có — cần làm)**» là việc mới; mọi tên tệp / hàm khác là **đã có** trong repo (đã đọc). 13 sẽ cấp mã việc `TASK-*` và lược đồ `SCHEMA-*` tương ứng; tài liệu này không tạo mã ở các không gian đó.

## 1. Bản đồ module

| Tệp | Trạng thái | Vai trò |
|---|---|---|
| `src/engine/chart.js` | có | `analyze()` — nguồn duy nhất |
| `src/engine/five-dim-radar.js`, `chart-level.js`, `vitality.js`, `noble-stars.js`, `liudao.js`, `personality-profile.js`, `nayin-personality.js`, `sensitivity.js`, `truetime.js` | có | đọc `R` |
| `src/game/menhban.js` | **chưa có — cần làm** | `buildMenhBan`, các hàm lớp game (§2) |
| `src/game/hauthien.js` | **chưa có — cần làm** | Đạo Hạnh, cảnh giới, Bổ Hành, Ngộ, tâm ma (§3) |
| `src/game/menhban-ui.js` | **chưa có — cần làm** | vòng tròn SVG, ngăn «Vì sao?», bảng chữ (04-12) |
| `src/game/main.js` | có | cổng, nghi lễ, `state.player` — sửa theo §4 |
| `src/game/stations.js` | có | `chartOf()` + `chartCache` — dùng lại cho NPC |
| `src/game/progress.js` | có | cấp theo Phúc Khí, gia trì — nối cảnh giới (§5) |
| `src/game/cosmetics.js` | có | `setBonus(s, yongWx)` — Hợp mệnh |
| `src/game/thaitue.js` | có | `suiYear(date)` — năm theo Lập Xuân |
| `src/game/vanmenh.js` | có | Vận Mệnh Các — đọc thêm `thoiVan` |
| `src/game/net.js`, `worker/quan-room.js` | có | chỉ gửi tập công khai (04-12 §6) |
| `scripts/test-game-menhban.mjs` | **chưa có — cần làm** | kiểm thử 04-12 §7 |

## 2. `src/game/menhban.js` — chữ ký hàm

```js
export const MENHBAN_VERSION = 1;
export const WX = ['木', '火', '土', '金', '水'];

/** Tầng hành 0..5 (04-03 §2). */
export function tangOf(v) {}                       // v >= 45 ? 5 : v >= 30 ? 4 : v >= 20 ? 3 : v >= 12 ? 2 : v >= 5 ? 1 : 0

/** Phẩm căn từ Tiềm Lực (04-02 §4). */
export function phamCanOf(score) {}               // → { code: 'PC1'..'PC10', name }

/** Lực ngũ hành (04-03 §1). */
export function nguHanhLucOf(R) {}                // → { [w]: { pct, k, v, tang } }

/** Thân Lực (04-03 §4). Mức lấy nguyên R.strength.level. */
export function thanLucOf(R) {}                   // → { v, effRatio, level, strong, solo, assist }

/** Mệnh Cách (04-05 §2.1). */
export function menhCachOf(R) {}                  // → { cls, sub, kind, name, nguon }

/** Đặc Tính (04-06 §2). */
export function perksOf(R, noble) {}              // → [{ key, bac, tone, at }]

/** Thời Vận (04-08 §6). refYear phải là suiYear(now).year. */
export function thoiVanOf(R, refYear) {}          // → { daiVan, luuNien, tieuVan, r2, r3ThuThach }

/** «Vì sao?» (04-02 §3). */
export function factorDelta(text) {}              // bộ tách Δ (đã kiểm 4.000/4.000)
export function factorKey(text) {}                // → 'F01'..'F17' | 'UNK' (bảng §2.1)

/** Hàm chính (04-01 §4). */
export function buildMenhBan(birth, refYear) {}   // → STAT-MENHBAN (04-12 §4)

/** Khoảng Tiềm Lực khi không rõ giờ (04-11 §2.3). */
export function khoangTiemLuc(birth, refYear) {}  // dùng sensitivity › chartSensitivity
```

### 2.1 Bảng nhận diện nhóm «Vì sao?» (`factorKey`)

Thứ tự kiểm tra quan trọng (một số chuỗi chứa từ khóa của nhóm khác). Đã kiểm trên 4.000 lá: 0 dòng `UNK`.

| Thứ tự | Biểu thức (khớp đầu chuỗi trừ khi ghi khác) | Nhóm |
|---|---|---|
| 1 | `^格局成败 \((成格|有救|败格|特殊)` | F01 (biến thể theo nhóm bắt) |
| 2 | `^Cách đặc biệt` | F02 special |
| 3 | `^Thành chính cách` | F02 normal |
| 4 | `^Nguyệt lệnh là` | F02 luyue |
| 5 | `^Dụng Thần .* có lực` | F03 + |
| 6 | `^Dụng Thần .* yếu` | F03 − |
| 7 | `^Dụng Thần thấu` | F04 |
| 8 | `^Có Hỷ Thần` | F05 + |
| 9 | `^Hỷ Thần \(nguồn` | F05 − |
| 10 | `^Kỵ Thần` | F06 |
| 11 | `^Lực Dụng` | F07 |
| 12 | `^Tổ hợp hung` | F08 |
| 13 | `^Tổ hợp cát` | F09 |
| 14 | `^Xung/hình` | F10 |
| 15 | `^Nhật Chi` | F11 |
| 16 | `^Tam hợp/hội` | F12 |
| 17 | `^Nhiều cát tinh` | F13 |
| 18 | `^Không vong` | F14 |
| 19 | `源远流长` (bất kỳ vị trí) | F15 + 5 |
| 20 | `dòng khí thông` (bất kỳ) | F15 + 2 |
| 21 | `khí trệ` (bất kỳ) | F15 − 4 |
| 22 | `^盖头截脚` | F16 |
| 23 | `^拱夹` | F17 |

Khi engine có `factorsStructured` (04-25 §1, đề nghị D1), `factorKey` và `factorDelta` bị gỡ.

## 3. `src/game/hauthien.js` — chữ ký hàm

```js
/** Trần ngày (04-08 §1.2). */
export function congTuSauTran(thoTrongNgay) {}    // 60 / 120 / ×1 ×0,5 ×0,1

/** Một lần nhận Đạo Hạnh. Cập nhật dhKhongNT, daoHanh, daoHanhCaoNhat, congTuNgay. Trả về ĐH vừa nhận. */
export function nhanDaoHanh(hauThien, menhBan, { congTu, tags, ngay }) {}
//   tags = { A: hành việc, V: hành vùng, G: hành giờ, S: hành mùa, thuThach: bool, truc: 'cai'|… , tac_dong: ['K1',…] }
//   R1 = min(0,40, Σ tầng(Lực+Bổ) theo tac_dong + Σ % Đặc Tính khớp + Σ % nút Ngũ Duy khớp)
//   R2 = min(0,15, thiên thời + thoiVan.r2)
//   R3 = (tags.A|V == Kỵ ? 1,3 : == Cừu ? 1,15 : 1) × (1 + (tags.thuThach ? thoiVan.r3ThuThach : 0))
//   ĐH = congTu × (1+R1) × (1+R2) × R3 × NT  (làm tròn 1 chữ số)

/** Cảnh giới (04-08 §3.2). */
export function canhGioi({ tiemLuc, daoHanhCaoNhat, quyNhat }) {}

/** Bổ Hành (04-03 §3): trần 20, 3/tuần/hành. */
export function themBoHanh(hauThien, w, n, tuanISO) {}

/** Ngộ (04-04 §2.1): 60 XP = 1 Ngộ; XP = congTu × TM. */
export function themXPCay(hauThien, truc, congTu, tm) {}
export function moNut(hauThien, nodeId, canhGioiHienTai, perks) {}   // kiểm điều kiện tầng + Mở sớm

/** Tâm ma (04-07 §3): lưu Δ. */
export function giamTamMa(hauThien, doc, luong, hatGiong) {}         // hatGiong: bo/dinh/thien từ Túc Nghiệp
export function giaTriTamMa(menhBan, hauThien, doc) {}              // = clamp(gốc + Δ, 0, 100)

/** Sửa bát tự (04-11 §9.3). */
export function quyDoiSauSuaBatTu(hauThien, ntCu, ntMoi) {}
```

## 4. Sửa `main.js` (cổng và nghi lễ)

| Vị trí (hàm hiện có) | Thay đổi |
|---|---|
| `birthForm()` | thêm: nhập âm lịch + tháng nhuận (04-11 §6); chọn nơi sinh (tùy chọn, 04-11 §5); tách «giới tính lá số» và «dáng nhân vật» (04-11 §10) |
| `showBirth() › f.onsubmit` | kiểm ngày tương lai; cảnh báo giờ Tý / giao tiết / giờ lịch sử (04-11 §3–5); gọi `buildMenhBan` thay vì chỉ `chartOf` |
| `ceremony(R, name)` | chữ Kỵ: «cửa thử thách» thay «nên tránh» (04-03 §5.3); thêm khung «Mệnh Bàn mở ra» |
| `$('hq-wear').onclick` | lưu `state.player.menhBan`, khởi tạo `state.player.hauThien` nếu chưa có; giữ `state.player.yong` cũ (tương thích) |
| `showGate()` khi đã có `birth` | nếu chưa có `menhBan` → dựng (chuyển đổi người chơi cũ, 04-12 §4.6) |
| `hq-rebirth` | đi qua cảnh `STAT-CANH-SB-01` và hộp xác nhận 04-17 §13; áp `quyDoiSauSuaBatTu` |
| khởi động mỗi phiên | so `suiYear(new Date()).year` với `menhBan.refYear`; khác → `thoiVanOf` lại + cảnh Lập Xuân |

## 5. Nối `progress.js` với cảnh giới

Canon bản sơ đồ tổng §9.1: «Ánh xạ: cấp gia trì mở theo **cảnh giới** thay vì cấp.» `GIATRI` hiện mở theo cấp (`lv` 2/4/6/8/10) tính từ `xp` Phúc Khí. Đề xuất ánh xạ (giữ VIP mở sớm như hiện tại — đó là trang trí, không phải sức mạnh):

| Gia trì (`id`) | Mở hiện tại | Mở theo cảnh giới (đề xuất) | Lý do |
|---|---|---|---|
| `aura` Hào quang hộ thể | cấp 2 | bậc 2 Nhập Môn | nhập môn thì có hào quang |
| `motes` Linh khí quanh thân | cấp 4 | bậc 3 | |
| `trail` Vệt sáng bộ pháp | cấp 6 | bậc 3 | |
| `fly` Ngự kiếm phi hành | cấp 8 | **bậc 3** Luyện Tinh Hóa Khí | canon: «ngự kiếm (đã có ở cấp 8 → gộp vào bậc này)» |
| `halo` Pháp quang sau lưng | cấp 10 | bậc 5 | không VIP (giữ `vip: false`) |

Hàm mới `unlockedByRealm(s, id)` (**chưa có — cần làm**) trả `canhGioi ≥ bậc mở || (g.vip && vipActive(s))`; `main.js` dòng gọi `unlocked(state, 'fly')` đổi sang hàm mới; chữ thông báo «Ngự kiếm mở ở cấp 8» đổi thành «Ngự kiếm mở ở cảnh giới Luyện Tinh Hóa Khí». `levelOf` (cấp theo Phúc Khí) giữ nguyên cho hoạt động hằng ngày và quà lên cấp (`levelGifts`).

## 6. Nối `cosmetics.js`

- `setBonus(s, yongWx)`: truyền `menhBan.tienThien.thienMenh.dung` (thay `state.player.yong.primary` — cùng giá trị khi không đổi engine).
- Hỷ ×1,05 Phúc Khí (04-03 §5.2) **không** đi qua `setBonus` — tính ở nơi phát Phúc Khí cho hoạt động gắn hành Hỷ.
- Sửa bát tự đổi Dụng: gọi lại `setBonus` (đã có trong `equip`/`unequip` — gọi trực tiếp sau khi lưu Mệnh Bàn mới).

## 7. Nối `vanmenh.js` và `thaitue.js`

| Nối | Cách |
|---|---|
| Cổng vận sáng «Vận Cứu Cách» | `vanMenh().gates[i]` đã có `rescue`, `worsen` (từ `dy.rescueNotes`, `worsenNotes`) — thêm kiểm `R.dayun[i].gejuRescue` / `gejuWorsen` để gắn nhãn 04-17 §10 |
| Ải giữ cách / nút thắt | mở từ trang cổng vận (04-20 §1, §2) |
| Năm Hạn | lưu niên Hung/Đại hung → `thaiTue()` đã có danh sách phạm Thái Tuế; cảnh `STAT-CANH-TV-02` mở từ Thái Tuế Điện |
| iOS | `features.js` tắt Vận Mệnh Các và Thái Tuế Điện → cảnh vận dùng thông báo chữ thay cảnh |

## 8. Dùng lại cho NPC

NPC khách (giải án, sảnh nghề) đã có lá số thật qua `chartOf`. Chuỗi Bổ Khuyết chương 2 cần «NPC có trục Ngũ Duy trội = trục yếu của người chơi»: thêm hàm `npcTheoTrucTroi(truc)` (**chưa có — cần làm**) duyệt danh sách NPC khách, tính `fiveDimRadar(chartOf(npc).chart).dominant.key`, lưu đệm.

## 9. Kiểm thử tự động — khung

```js
// scripts/test-game-menhban.mjs  (chưa có — cần làm)
import { buildMenhBan, factorDelta, phamCanOf, tangOf } from '../src/game/menhban.js';
import { canhGioi, congTuSauTran } from '../src/game/hauthien.js';
const MAU = [
  ['A', { y: 1990, m: 5, d: 15, h: 8, mi: 30, gender: 'nam' }, { tl: 41, pc: 'PC3', cls: 'DC', cap: '清贵', nk: 112 }],
  ['C', { y: 1986, m: 9, d: 1, h: 13, mi: 15, gender: 'nữ' }, { tl: 23, pc: 'PC1', cls: 'NT', cap: '常格', nk: 108 }],
  ['L', { y: 1999, m: 3, d: 7, h: 16, mi: 15, gender: 'nữ' }, { tl: 86, pc: 'PC10', cls: 'TT', cap: '富格', nk: 112 }],
  // … đủ 15 mẫu theo 04-12 §7.1
];
for (const [code, birth, exp] of MAU) {
  const mb = buildMenhBan(birth, 2026);
  assert.equal(mb.tienThien.tiemLuc, exp.tl, code);
  assert.equal(mb.tienThien.phamCan, exp.pc, code);
  assert.equal(mb.tienThien.menhCach.cls, exp.cls, code);
  assert.equal(mb.tienThien.menhCap, exp.cap, code);
  assert.equal(mb.tienThien.nguyenKhiToiDa, exp.nk, code);
}
assert.equal(congTuSauTran(80), 70);
assert.equal(canhGioi({ tiemLuc: 86, daoHanhCaoNhat: 999, quyNhat: false }), 3);
```

## 10. Checklist nghiệm thu phần 04-23

- [ ] `menhban.js`, `hauthien.js` thuần (không DOM, không `Date.now()` trong hàm tính).
- [ ] `refYear` dùng `thaitue.js › suiYear`.
- [ ] Gia trì mở theo cảnh giới; ngự kiếm ở bậc 3.
- [ ] `state.player.yong` cũ vẫn được ghi (tương thích Tàng Y Các, `WX_GIATRI`).
- [ ] Kiểm thử §9 thêm vào chuỗi `npm run test:game` (package.json hiện nối 7 tệp `scripts/test-game-*.mjs`).
