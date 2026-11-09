# 12 · Trình bày — Phần 18: Bàn giao kỹ thuật giao diện

> Tài liệu bàn giao cho lập trình viên: tệp token CSS đề xuất (gom phần 07), hằng số lớp và điểm gãy, bảng thông số từng thành phần, mẫu ARIA, từ điển sự kiện đo lường (gom từ mọi mục UI-xx), và các hàm trình bày mới cần thêm vào `api` của `main.js`. Phần này **không thêm quyết định thiết kế mới** — chỉ chuẩn hóa để dựng; chỗ nào lệch với phần 01–17 thì các phần đó thắng.

---

## 1. Tệp token đề xuất `src/game/tokens.css`

Gói trong `.hq-root` như mọi quy tắc khác (game nhúng vào vỏ iOS, không rò CSS ra ngoài). Giá trị «đã có» giữ nguyên; giá trị ★ là sửa / thêm theo phần 07.

```css
.hq-root {
  /* --- nền & chữ (đã có) */
  --hq-night: #14111c;  --hq-ink: #1d1822;   --hq-card: #221c27;  --hq-line: #3a3040;
  --hq-paper: #f3e7cf;  --hq-dim: #b8a98f;   --hq-son: #b3261e;   --hq-gold: #d6a84a;
  --hq-wood: #6b3f26;
  /* --- gom giá trị viết cứng (★) */
  --hq-btn: #2d2533;    --hq-chip: #2b2430;  --hq-dock: #17121b;  --hq-input: #17131b;
  --hq-well: #1b161f;   --hq-on-son: #fff8ea; --hq-son-edge: #d2463c; --hq-son-hover: #c7302a;
  --hq-note: #a09381;   /* ★ cũ #8e8170 — 4,37:1 trên thẻ, không đạt */
  --hq-err: #ff8f86;    --hq-warn: #f1b05c;  --hq-flag: #e0533d;  --hq-lock: #ffcf7a;
  --hq-badge: #ff4a3a;  --hq-karma: #7a5f8f; --hq-yin: #5b3f6e;
  /* --- ngũ hành: mảng màu (đã có) + chữ (★) */
  --wx-moc: #4fa463;  --wx-hoa: #e0533f;  --wx-tho: #c99a4a;  --wx-kim: #cfc8b8;  --wx-thuy: #4b7cc7;
  --wx-moc-text: #4fa463; --wx-hoa-text: #ee7461; --wx-tho-text: #c99a4a;
  --wx-kim-text: #cfc8b8; --wx-thuy-text: #7aa3e6;
  /* --- đạo thống (★) */
  --dt-zhengyi: #a8452f; --dt-wudang: #3f9a6c; --dt-quanzhen: #4a7fb5; --dt-maoshan: #7fb066;
  --dt-truclam: #4f7d5f; --dt-tinhdo: #e8a1b4; --dt-mat: #3fa7c9;      --dt-nho: #c6a044;
  --dt-phongdo: #5a95bd; --dt-mieu: #4fa08c;   --dt-conlon: #7fb7e6;   --dt-vancoc: #c9b98f;
  --dt-dmh: #6d5a86;
  /* --- bậc hiếm (đã có trong cosmetics.js › RARITY) */
  --r1: #b9b2a4; --r2: #6fd48a; --r3: #5aa8ff; --r4: #c58bff; --r5: #ffc44a;
  /* --- cỡ chữ (★) — nhân với --hq-fs (UI-76) */
  --hq-fs: 1;
  --fs-2xs: calc(11px * var(--hq-fs));  --fs-xs: calc(12px * var(--hq-fs));
  --fs-sm: calc(13px * var(--hq-fs));   --fs-md: calc(14px * var(--hq-fs));
  --fs-base: calc(15px * var(--hq-fs)); --fs-lg: calc(17px * var(--hq-fs));
  --fs-xl: calc(18px * var(--hq-fs));   --fs-2xl: calc(20px * var(--hq-fs));
  --fs-3xl: calc(24px * var(--hq-fs));  --fs-4xl: calc(30px * var(--hq-fs));
  --fs-han-lg: calc(34px * var(--hq-fs)); --fs-han-xl: calc(40px * var(--hq-fs));
  --fs-num-xl: calc(44px * var(--hq-fs));
  /* --- phông (★) */
  --ff-ui: "Be Vietnam Pro", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --ff-serif: "Noto Serif", "Times New Roman", serif;
  --ff-han: "Noto Serif TC", "Noto Serif SC", "Songti SC", "PMingLiU", serif;
  --ff-brush: "LXGW WenKai TC", "Noto Serif TC", serif;
  --ff-mono: ui-monospace, monospace;
  /* --- khoảng cách (★) */
  --sp-1: 4px; --sp-2: 6px; --sp-3: 8px; --sp-4: 10px; --sp-5: 12px;
  --sp-6: 14px; --sp-7: 18px; --sp-8: 22px; --sp-9: 26px;
  /* --- bo góc (★) */
  --r-xs: 4px; --r-sm: 8px; --r-md: 10px; --r-lg: 12px; --r-xl: 16px; --r-2xl: 18px; --r-pill: 99px;
  /* --- độ nổi (đã có, gom lại) */
  --e1: 0 3px 10px rgba(0,0,0,.5);   --e2: 0 6px 20px rgba(0,0,0,.45);
  --e3: 0 20px 60px rgba(0,0,0,.5);  --e4: 0 24px 70px rgba(0,0,0,.6);
  /* --- chuyển động (★) */
  --t-instant: 100ms; --t-fast: 180ms; --t-base: 250ms; --t-slow: 480ms; --t-scene: 550ms;
  --ease-out: cubic-bezier(.2,.7,.2,1); --ease-in: cubic-bezier(.5,0,.8,.3);
  --ease-ink: cubic-bezier(.3,0,.2,1);
  /* --- vùng chạm (★) */
  --tap-min: 44px;
}
/* chế độ mù màu (phần 14 §2.2) — lớp gắn trên .hq-root */
.hq-root.cb-rg   { --wx-moc:#009e73; --wx-hoa:#d55e00; --wx-tho:#f0e442; --wx-kim:#e8e4da; --wx-thuy:#0072b2; }
.hq-root.cb-tri  { --wx-moc:#6cc46a; --wx-hoa:#e0336f; --wx-tho:#c9a227; --wx-kim:#dcdcdc; --wx-thuy:#7a6cf0; }
.hq-root.cb-mono { --wx-moc:#707070; --wx-hoa:#8e8e8e; --wx-tho:#adadad; --wx-kim:#eeeeee; --wx-thuy:#cdcdcd; }
/* tương phản cao (UI-76) */
.hq-root.hc { --hq-card:#0e0b12; --hq-line:#f3e7cf; --hq-note:#d8ccb4; --hq-dim:#e3d6bb; }
```

**Đồng bộ với 3D:** `wx-palette.js` (phần 07 §2.5) đọc cùng giá trị qua `getComputedStyle(root).getPropertyValue('--wx-thuy')` khi chế độ màu đổi, rồi gọi `renderer.setPalette()` (★ hàm mới) để đổi vật liệu áo, gia trì, chấm màu người khác.

---

## 2. Hằng số lớp và điểm gãy

```js
// src/game/layers.js (★)
export const Z = {
  scene: 0, labels: 1, hudInScene: 2, controls: 3, loading: 4, altpad: 6,
  minigameHud: 10, sheet: 20, toast: 30, talk: 40, ritual: 50,
  travel: 60, cutscene: 70, confirm: 80,
};
export const BP = {
  sheet: '(max-width: 600px)',          // bảng → bottom sheet
  narrow: '(max-width: 480px)',
  tiny: '(max-width: 380px)',
  touch: '(pointer: coarse)',
  wide: '(min-width: 1280px)',           // ngăn phải, bản đồ nhỏ
  phoneLandscape: '(orientation: landscape) and (max-height: 500px)',
};
export const PORTRAIT_ASPECT = 0.8;      // render3d.js: FOV 64° dưới ngưỡng này
```

---

## 3. Thông số thành phần

### 3.1 Nút (`.hq-btn`)

| Thuộc tính | Thường | Chính (`.hq-primary`) | To (`.hq-big`) | Nguy hiểm (`.danger`) |
|---|---|---|---|---|
| Cao tối thiểu | 44 px ★ (hiện ≈ 40) | 44 | 52 | 44 |
| Đệm | 9 × 14 | 9 × 14 | 13 × 22 | 9 × 14 |
| Chữ | `--fs-base` 400 | 600 | `--fs-lg` 600 | 400 |
| Nền / viền | `--hq-btn` / `--hq-line` | `--hq-son` / `--hq-son-edge` | theo biến thể | `--hq-btn` / `--hq-line` |
| Chữ màu | `--hq-paper` | `--hq-on-son` | — | `--hq-err` |
| Hover | viền `--hq-gold` | nền `--hq-son-hover` | — | viền `--hq-err` |
| Focus | viền ngoài 2 px `--hq-gold`, cách 2 px | như thường | — | — |
| Tắt | mờ 45%, `aria-disabled` + `title` lý do | — | — | — |
| Đang xử lý | chữ đổi + `aria-busy="true"` | — | — | — |
| Âm | `SFX-UI-001` | `SFX-UI-003` | — | không âm cho tới khi xác nhận |

### 3.2 Nút HUD (`.hq-hbtn.icon`)

44 × 44 ★; nền `rgba(45,37,51,.9)`; icon Huyền Ấn 20 px; trạng thái bật `.on`: viền vàng + quầng `0 0 0 2px rgba(212,175,55,.35)` (đã có); `aria-pressed` cho nút bật / tắt (🔈, 🗡).

### 3.3 Nút dock (`.hq-dbtn`)

≥ 76 × 48 (đã có); icon 19 px trên, nhãn `--fs-xs` `--hq-dim` dưới; `:active` nền `--hq-chip`; chấm thông báo 9 px `--hq-badge` góc phải trên (`.dot`), có `aria-label` bổ sung «, có mục mới».

### 3.4 Chip (`.hq-chip`)

Cao 20 px, đệm 2 × 8, `--fs-xs`, bo `--r-pill`, nền `--hq-chip`, viền `--hq-line`. Chip chạm được → phần tử `button`, vùng chạm mở rộng tới 44 px bằng `::before` trong suốt.

### 3.5 Thẻ (tab)

| Kiểu | Lớp ★ | Dùng ở | Thường | Đang chọn |
|---|---|---|---|---|
| gạch chân | `.hq-tabs--line` | Sổ Mệnh, Cài đặt | chữ `--hq-dim`, gạch 2 px trong suốt | chữ `--hq-gold`, gạch `--hq-gold` |
| viên thuốc | `.hq-tabs--pill` | Giải Quẻ, Tàng Y Các | nền `--hq-chip`, viền `--hq-line` | nền `--hq-son`, chữ `--hq-on-son` |

Cả hai: `role="tablist"`, nút `role="tab"` `aria-selected` `aria-controls`; vùng nội dung `role="tabpanel"` `aria-labelledby`; phím ← → Home End.

### 3.6 Lựa chọn (`.hq-choice`)

Cao ≥ 44 ★; viên thuốc (thường) hoặc chữ nhật bo 12 (`.wide`); chọn: `aria-pressed="true"`, nền `#4a2a20`, viền + quầng trong `--hq-gold` (đã có). Trong thoại UI-40: thêm số ①–④ đầu dòng, phím 1–4.

### 3.7 Ô nhập (`.hq-input`)

Cao 44, đệm 9 × 10, nền `--hq-input`, viền `--hq-line`, bo `--r-sm`; focus viền `--hq-gold`; lỗi: viền `--hq-err` + `aria-invalid="true"` + `aria-describedby` trỏ dòng lỗi; tắt mờ 45%.

### 3.8 Thanh số (`.hq-bar`, `.hq-meter`, `.hq-wxbar`, `.hq-steps`)

| Thanh | Cao | Mã hóa | ARIA |
|---|---|---|---|
| `.hq-bar` (nhãn 46 · thanh · số 40) | 8 | gradient `--wc` tới `--v` | `role="meter"` `aria-valuenow` `aria-valuemin=0` `aria-valuemax=100` `aria-label` |
| `.hq-meter` | 6 | vàng | như trên |
| `.hq-wxbar` | 12 | 5 khúc màu hành, mỗi khúc ≥ 4% | ★ một `role="img"` với `aria-label` đủ năm phần trăm |
| `.hq-steps` | 6 | `.done` `#7a5f2c`, `.on` vàng | `aria-label="Bước i trên n"` |
| thanh tâm ma / nghiệp ★ | 8 | `--hq-karma` | `role="meter"` |

### 3.9 Vòng điểm (`.hq-score`)

86 × 86, viền 4 px theo mức (`.good` `--wx-moc`, `.mid` `--hq-gold`, `.low` `#8a7f74`), số 26 px + nhãn 11 px. ★ Thêm chữ đánh giá dưới vòng (không chỉ màu viền).

### 3.10 Bảng (`.hq-panel`)

| Nấc | Điện thoại | Máy tính |
|---|---|---|
| half | `max-height: 62dvh`, bo trên 16 | hộp giữa ≤ 620 × min(86dvh, 820) |
| full | 92dvh | — |
| peek | ≤ 46dvh, ≤ 440 px rộng, nền `rgba(34,28,39,.9)` + `blur(6px)` | như điện thoại |
| side ★ | — | 520 px phải, cao 100dvh − HUD |

Đầu bảng: tiêu đề `--fs-2xl` serif vàng; nút ✕ 44 px. Thanh kéo 44 × 5 px, vùng chạm cao 22 px (đã có `::before`). Lớp nền mờ `rgba(8,6,12,.55)`.

### 3.11 Toast

| Mức | Hình | Thời gian | ARIA |
|---|---|---|---|
| T1 | viên thuốc, viền `--hq-gold`, nền `rgba(34,28,39,.96)`, `--fs-md` | 2,7 s + 0,5 s mờ (đã có) | trong `aria-live="polite"` |
| T2 | T1 + icon tiền | như T1 | như T1 |
| T3 ★ | thẻ rộng 320 px, nền giấy (`--hq-paper` 8% trên `--hq-card`), chữ serif `--fs-lg` | 4 s | `role="status"` |

Tối đa 2 cùng lúc; dời lên đầu khi bảng mở (đã có).

### 3.12 Nhãn 3D

| Loại | Chữ | Nền | Viền | Đệm |
|---|---|---|---|---|
| `.hq-label` | 600 13 px (11,5 px ≤ 600 px) | `rgba(18,13,16,.72)` | `rgba(217,164,65,.45)` | 5 × 9 |
| `.near` | trắng `#fff8ea` | `--hq-son` | `#ffb08f` | — |
| `.hq-name` | 500 12 px | `rgba(18,13,16,.55)` | trong suốt | 3 × 8 |
| `.hq-name.gold` | `--hq-gold` | — | `--hq-gold` | — |
| ★ nhãn dọc trong điện | chữ Hán `--ff-han` 15 px, `writing-mode: vertical-rl` | như `.hq-label` | — | 8 × 5 |

### 3.13 Bong bóng

`.hq-bubble`: rộng ≤ 200 px (thầy ≤ 240), dời lên 22 px trên tên; `.master` nền `#fff3d6` viền son chữ `#2a1d10`; ★ `.npc` như `.master` nhưng viền `var(--dt-*)` theo đạo thống. Thời gian hiện: người chơi 3,8 s, thầy 6 s (60 s khi «đang luận»).

### 3.14 Huy hiệu NPC (UI-40, UI-41) ★

Vòng 36 px, nền `var(--dt-*)`, chữ Hán đầu tên `--ff-han` 18 px trắng; viền 2 px `--hq-gold` khi NPC đang nói.

### 3.15 Dòng theo dõi nhiệm vụ (UI-16) ★

Cao 28 px / dòng, ký hiệu loại 14 px, chữ `--fs-sm`, tiến độ căn phải `tabular-nums`; nền khung `rgba(18,13,16,.55)`, bo `--r-md`, đệm 6 × 10; tối đa 3 dòng.

### 3.16 Ấn son (`.hq-seal`) ★

Vuông 48 / 64 / 96 px, bo 6, nền `--hq-son`, chữ trắng `--ff-brush` 2 chữ xếp dọc; hoạt ảnh «đóng»: phóng 1,3 → 1 trong 180 ms + `SFX-UI-016` (giảm chuyển động: không phóng).

### 3.17 Hộp xác nhận (z 80) ★

Rộng ≤ 360 px; tiêu đề `--fs-xl`; thân ≤ 3 câu; hai nút: nút an toàn (Hủy) **bên trái và nhận focus mặc định**, nút hành động bên phải; hành động phá hủy dùng `.danger` có viền; xác nhận mức cao (xoá dữ liệu) yêu cầu gõ chữ. `role="alertdialog"`, `aria-describedby` trỏ thân.

---

## 4. Mẫu ARIA

| Mẫu | Dùng ở | Cấu trúc |
|---|---|---|
| Hộp thoại có tiêu đề | mọi bảng | `div[role=dialog][aria-modal=true][aria-labelledby=hq-panel-title]` (đã có) + bẫy focus ★ |
| Hộp cảnh báo | xác nhận z 80 | `role=alertdialog` |
| Thẻ | Sổ Mệnh, Y Các, Giải Quẻ | §3.5 |
| Nhật ký hội thoại | UI-41 | `div[role=log][aria-live=polite][aria-busy=true khi đang stream]` |
| Trạng thái | toast T3, câu dẫn màn tải | `role=status` |
| Thước đo | thanh số | `role=meter` |
| Hình có bản thay thế | Mệnh Bàn, radar Ngũ Duy | `figure` > `svg[aria-hidden]` + `figcaption` / bảng ẩn hình (`.sr-only`) |
| Nhóm lựa chọn | thoại, lựa chọn đáp án | `div[role=group][aria-labelledby]` > `button` |
| Lưới tuổi Thái Tuế | UI-54 | `table` có `caption`, ô có `scope` |
| Bản đồ | UI-45 | `div[role=application][aria-roledescription="bản đồ"]` + nút «Xem dạng danh sách» |

Lớp `.sr-only` ★ (ẩn hình, đọc được): `position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap`.

---

## 5. Từ điển sự kiện đo lường

Luật đặt tên và thuộc tính chung: phần 01 §7. Bảng gom **125 sự kiện** từ các mục UI-xx. Cột «Thuộc tính riêng» không kể thuộc tính chung (`v`, `plat`, `ori`, `q`, `lowq`, `rm`, `fs`, `net`, `realm`, `region`).

| Màn | Sự kiện | Thuộc tính riêng |
|---|---|---|
| UI-01 | `ui_boot_view`, `ui_boot_error`, `ui_boot_fallback2d` | `ms_load`; `code` |
| UI-02 | `ui_gate_view` | `from` |
| UI-03 | `ui_birth_view`, `ui_birth_submit`, `ui_birth_error` | `nohour`, `lunar_input`; `code` |
| UI-04 | `ui_rite_view`, `ui_rite_tap_pillar`, `ui_rite_done`, `ui_rite_redo` | `i`; `ms_open` |
| UI-05 | `ui_reveal_view`, `ui_reveal_tap_why`, `ui_reveal_done` | `tier` (chỉ khi opt-in); `ms_open` |
| UI-06 | `ui_welcome_view`, `ui_welcome_enter`, `ui_welcome_rebirth` | `streak_bucket`; `ms_open` |
| UI-07 | `ui_consent_done` | `public_root`, `analytics_opt` |
| UI-08 | `ui_hud_tap_{who,phuc,ngoc,online,realm,settings,fly,sound}` | — |
| UI-09 | `ui_dock_tap` | `btn` |
| UI-16 | `ui_tracker_tap`, `ui_tracker_untrack` | `kind` |
| UI-18 | `ui_pause_view`, `ui_pause_tap`, `ui_pause_breakreminder` | `from`; `item` |
| UI-20 | `ui_book_view`, `ui_book_tab` | `tab`, `from` |
| UI-21 | `ui_menhban_view`, `ui_menhban_tap`, `ui_menhban_spin` | `zone` |
| UI-22 | `ui_why_view`, `ui_why_raw_open`, `ui_why_to_menhdo` | `stat` |
| UI-23 | `ui_wx_view`, `ui_wx_tap_action` | `wx`; `kind` |
| UI-24 | `ui_dims_view`, `ui_dims_tap` | `key` |
| UI-25 | `ui_perks_view`, `ui_perks_filter` | `count`; `f` |
| UI-26 | `ui_karma_view`, `ui_karma_tap_dieuam` | — |
| UI-27 | `ui_menhdo_view`, `ui_menhdo_tap`, `ui_menhdo_layer_done` | `done_count`; `kind` |
| UI-28 | `ui_mdnode_view`, `ui_mdnode_track`, `ui_mdnode_guide`, `ui_mdnode_ask` | `kind` |
| UI-29 | `ui_congqua_view`, `ui_congqua_fix_tap`, `ui_congqua_milestone` | `net_bucket`; `m` |
| UI-30 | `ui_reallog_enabled` | `on` |
| UI-31 | `ui_yeguo_view`, `ui_yeguo_fix_start` | `karma` |
| UI-32 | `ui_realm_view`, `ui_realm_naming` | `realm`; `school` |
| UI-33 | `ui_ascend_view`, `ui_ascend_skip` | `kind`, `realm`; `t` |
| UI-34 | `ui_ranks_view` | `tab` |
| UI-35 | `ui_profiles_view`, `ui_profiles_open`, `ui_profiles_delete` | `n` |
| UI-36 | `ui_ach_view`, `ui_ach_set_title` | `got` |
| UI-37 | `ui_noam_view`, `ui_noam_return` | `debt_bucket`; `where` |
| UI-40 | `ui_talk_view`, `ui_talk_choice`, `ui_talk_skip`, `ui_talk_history_open` | `npc`, `scene`; `idx`, `karma`, `locked_seen` |
| UI-41 | `ui_ai_view`, `ui_ai_ask`, `ui_ai_done`, `ui_ai_conflicts_open`, `ui_ai_quota_hit` | `npc`; `from`; `ms_first_token`, `ms_total`, `neo_bucket`, `red`, `local` |
| UI-42 | `ui_care_view` | — (chỉ đếm) |
| UI-43 | `ui_quests_view`, `ui_quests_track`, `ui_quests_untrack` | `tab`, `active_n`; `kind` |
| UI-44 | `ui_quest_view`, `ui_quest_guide` | `kind` |
| UI-45 | `ui_map_view`, `ui_map_tap`, `ui_map_pin`, `ui_map_list_mode` | `zoom`; `kind` |
| UI-47 | `ui_station_view`, `ui_station_go` | `at`; `to`, `kind` |
| UI-51 | `ui_case_step`, `ui_case_done`, `ui_case_hint` | `i`, `n`, `score_bucket`; `coop` |
| UI-53 | `ui_vanmenh_view`, `ui_vanmenh_ask` | `what`, `i` |
| UI-57 | `ui_codex_pop`, `ui_codex_view` | `term_id`; `entry` |
| UI-60 | `ui_social_send` | `kind`, `id`, `via` |
| UI-64 | `ui_coop_invite`, `ui_coop_accept`, `ui_coop_decline`, `ui_coop_done` | `kind`; `n_players`, `score_bucket` |
| UI-66 | `ui_sectbuild_view`, `ui_sectbuild_contribute` | `kind` |
| UI-71 | `ui_tangy_view`, `ui_tangy_checkin`, `ui_tangy_buy`, `ui_tangy_try`, `ui_tangy_equip` | `tab`; `day`; `item`, `currency`; `slot` |
| UI-73 | `ui_vip_view`, `ui_topup_view`, `ui_topup_select`, `ui_topup_result` | `pack`; `ok`, `provider` |
| UI-75 / 76 | `ui_settings_change`, `ui_a11y_change` | `key`, `value` (enum / boolean) |
| UI-79 | `ui_amta_view`, `ui_amta_enable`, `ui_amta_disable` | `from` |
| UI-80 | `ui_mg_start`, `ui_mg_step`, `ui_mg_end`, `ui_mg_quit`, `ui_mg_rules_open` | `mg`; `i`, `n`; `result`, `ms`, `assist` |
| UI-98 | `ui_photo_open`, `ui_photo_shot` | `filter`, `free_cam` |
| UI-99 | `ui_cut_view`, `ui_cut_skip` | `id`; `t` |

**Nhóm giá trị (bucket):** `score_bucket ∈ {0-39, 40-59, 60-79, 80-100}`; `neo_bucket ∈ {<70, 70-89, ≥90}`; `net_bucket` (công ròng) `∈ {<0, 0-99, 100-299, 300-599, 600-999, ≥1000}`; `debt_bucket ∈ {0, 1-9, 10-49, ≥50}`; `streak_bucket ∈ {0, 1-2, 3-6, ≥7}`; `tier` (căn cốt, chỉ opt-in) `∈ {lt36, 36to57, ge58}`.

**Kiểm rò dữ liệu:** test tự động quét payload: không trường nào khớp mẫu ngày (`\d{4}-\d{2}-\d{2}`), không chữ Hán can chi liền nhau (dấu hiệu tứ trụ), không chuỗi dài > 64 ký tự (dấu hiệu nội dung hỏi AI).

---

## 6. Hàm trình bày mới cho `api` (đề xuất, tài liệu 13 chốt)

Mở rộng đối tượng `api` mà `main.js` truyền cho các gian (hiện có: `state, masterSay, panel, reduced, toast, after, onClose, peek, goTo, setSitting, setTeaColor, vip, level, yong, previewCos, cosChanged, refreshRooms, celebrate, todayNpc, wipe`).

| Hàm ★ | Chữ ký | Thay cho / ghi chú |
|---|---|---|
| `toast` | `toast(text, { level: 'T1'|'T2'|'T3', icon })` | mở rộng `toast(text)` hiện có; mặc định T1 |
| `confirm` | `await confirm({ title, body, ok, cancel, danger, typeToConfirm })` → `boolean` | thay `window.confirm()` |
| `panel.push` / `panel.pop` | `push({ title, body, back })` | ngăn xếp bảng ≤ 3 (nút «‹») |
| `panel.side` | `panel.open({ ..., mode: 'side' })` | ngăn phải máy tính |
| `track` | `track(event, props)` | gửi đo lường theo phần 01 §7, tự lọc trường cấm |
| `sfx` | `sfx(id, { pos })` | gọi `audio.play` (phần 11 §4.2) |
| `music` | `music({ level })` | đổi mức nhạc khi mở bảng / mini-game (phần 09 §4.2) |
| `haptic` | `haptic(pattern)` | mẫu nhịp (phần 07 §8.3); bọc `buzz()` |
| `camera` | `camera(preset, opts)` → Promise | `cam.*` (phần 08 §4) |
| `fx` | `fx(key, opts)` | `fx.*` (phần 12) |
| `talk` | `await talk(sceneId)` | mở UI-40 với gói thoại |
| `ask` | `ask({ npc, R, first, gameContext })` | mở UI-41 (bọc `masterChatBody`) |
| `ritual` | `await ritual(kind, data)` | mở UI-33 |
| `mg` | `mg.start(id)`, `mg.end(result)` | khung UI-80 + đo lường chung |
| `glossary` | `glossary(html)` → html có móc từ điển | phần 13 §4.2 |
| `t` | `t(key, vars)` | chuỗi bản địa hóa (phần 13 §2) |
