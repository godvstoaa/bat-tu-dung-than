# 13.22 · Phụ lục G — Ví dụ dữ liệu đầy đủ và hợp đồng kết quả gian

> Ví dụ hoàn chỉnh (không rút gọn bằng «…» ở trường bắt buộc) để làm mẫu cho LVL, CNT, SRV và làm dữ liệu thử cho test. Số đo lấy từ code hiện có (`court.js`) khi có. Mã thuộc không gian tên của tài liệu khác được đánh dấu là **minh họa** (thay bằng mã thật khi tài liệu đó cấp).

## G.1 Chính Đường — SCHEMA-BUILDING

Căn cứ: `court.js › MAIN_HALL = { x: 0, z: −31, w: 44 }`, nền tầng 2 `TERRACES[L2].top = 4`, Bàn Thầy `DAIS = { x: 0, z: −11, y: 4 }` (trước mặt điện, phía +z). Tọa độ cục bộ: gốc tại `shell.at`, mặt chính hướng +z.

```json
{
  "id": "BLD-thanh-01",
  "name": "Chính Đường",
  "class": "A",
  "region": "thanh",
  "shell": { "model": "palace_grand", "fit": { "width": 44 }, "at": { "x": 0, "y": 4, "z": -31, "ry": 0 } },
  "interior": "INT-BLD-thanh-01",
  "collision": "col/BLD-thanh-01.json",
  "floors": [ { "n": 1, "y": 4.6 }, { "n": 2, "y": 10.2 } ],
  "cells": [
    { "id": "c1", "name": "Tổ Sư đường", "floor": 1, "poly": [[-19, -10], [19, -10], [19, 9], [-19, 9]], "yMin": 0, "yMax": 5.4,
      "ambient": 0.35, "camera": { "maxDist": 9, "pitch": [0.05, 0.6] } },
    { "id": "c1h", "name": "Hiên trước", "floor": 1, "poly": [[-19, 9], [19, 9], [19, 12.5], [-19, 12.5]], "yMin": 0, "yMax": 5.4,
      "ambient": 0.8, "camera": { "maxDist": 12, "pitch": [0.05, 0.9] } },
    { "id": "c2", "name": "Tàng kinh", "floor": 2, "poly": [[-15, -8], [15, -8], [15, 7], [-15, 7]], "yMin": 0, "yMax": 4.2,
      "ambient": 0.3, "camera": { "maxDist": 7, "pitch": [0.05, 0.5] } }
  ],
  "portals": [
    { "id": "p_front", "a": "outside", "b": "c1h", "quad": [[-19, 0, 12.5], [19, 0, 12.5], [19, 5.4, 12.5], [-19, 5.4, 12.5]], "door": null, "virtual": false },
    { "id": "p_main", "a": "c1h", "b": "c1", "quad": [[-2.6, 0, 9], [2.6, 0, 9], [2.6, 4.6, 9], [-2.6, 4.6, 9]], "door": "d_main", "virtual": false },
    { "id": "p_side_w", "a": "c1h", "b": "c1", "quad": [[-12.6, 0, 9], [-10.4, 0, 9], [-10.4, 3.4, 9], [-12.6, 3.4, 9]], "door": "d_side", "virtual": false },
    { "id": "p_stair", "a": "c1", "b": "c2", "quad": [[-14, 5.4, -6], [-11, 5.4, -6], [-11, 5.4, -2], [-14, 5.4, -2]], "door": null, "virtual": true },
    { "id": "p_win_e", "a": "outside", "b": "c1", "quad": [[19, 1.2, -2], [19, 1.2, 2], [19, 3.6, 2], [19, 3.6, -2]], "door": null, "virtual": false, "glass": true }
  ],
  "doors": [
    { "id": "d_main", "mesh": "__door_main", "hinge": [[-2.6, 9], [2.6, 9]], "openAngle": 1.9, "trigger": 3.0,
      "schedule": { "open": "卯", "close": "戌" }, "sideDoor": "d_side", "locked": null },
    { "id": "d_side", "mesh": "__door_side", "hinge": [[-12.6, 9]], "openAngle": 1.6, "trigger": 2.5, "schedule": null, "sideDoor": null, "locked": null }
  ],
  "stairs": [ { "id": "s1", "from": 1, "to": 2, "poly": [[-14, -9], [-11, -9], [-11, -2], [-14, -2]], "axis": "z-" } ],
  "stations": ["thay"],
  "npcs": [ { "npc": "thay_tubinh", "cell": "c1", "at": [0, -6], "schedule": "day" } ],
  "lights": [
    { "cell": "c1", "at": [-3.2, 1.4, -8.2], "color": "#ffb35c", "power": 1.2, "kind": "candle" },
    { "cell": "c1", "at": [3.2, 1.4, -8.2], "color": "#ffb35c", "power": 1.2, "kind": "candle" },
    { "cell": "c1", "at": [0, 4.6, -2], "color": "#ffd9a0", "power": 1.4, "kind": "lantern" },
    { "cell": "c1h", "at": [-6, 4.2, 11], "color": "#ff9a4a", "power": 1.0, "kind": "lantern" },
    { "cell": "c2", "at": [0, 2.8, 0], "color": "#ffd9a0", "power": 1.0, "kind": "lantern" },
    { "cell": "c2", "at": [-8, 1.2, -6], "color": "#ffb35c", "power": 0.8, "kind": "candle" }
  ],
  "loadRadius": 60,
  "unloadRadius": 90,
  "budget": { "drawCalls": 60, "tris": 150000, "lights": 4 },
  "dod": { "photos": "docs/art/thanh/BLD-thanh-01/", "status": "todo" }
}
```

Kiểm nhanh với luật validator:

| Luật | Kết quả |
|---|---|
| Ô lồi, ngược chiều kim đồng hồ | 3 ô hình chữ nhật, thứ tự đỉnh (−x,−z) → (+x,−z) → (+x,+z) → (−x,+z) cho diện tích có hướng dương trong mặt phẳng (x, z) coi z là trục tung — đúng quy ước «ngược chiều kim đồng hồ» mà `convexContains` (phụ lục D.6) giả định |
| Cổng trên ranh giới | `p_main` z = 9 = cạnh chung c1/c1h; `p_front` z = 12,5 = mép ngoài c1h |
| Đèn ≤ 4/ô | c1: 3, c1h: 1, c2: 2 |
| Hạng A ≥ 3 tương tác | trạm `thay` + NPC Thầy Tử Bình + (trong `INT-BLD-thanh-01`) bàn bài vị tổ, sổ môn phái, kệ kinh tầng 2 |
| Cửa chính có cửa ngách | `d_main.sideDoor = d_side`, `d_side.schedule = null` (luôn mở) |
| Bàn Thầy vào trong (TASK-104) | `npcs[0].at = [0, −6]` cục bộ → thế giới (0, −37) trên sàn y 4,6 |

## G.2 Chính Đường — SCHEMA-INTERIOR-LAYOUT (trích)

Lưới gian 3,2 m, gốc tại góc (−19,2; −9,6) cục bộ → 12 × 6 gian phủ ô c1.

```json
{
  "id": "INT-BLD-thanh-01",
  "building": "BLD-thanh-01",
  "kit": "dao-bac",
  "origin": [-19.2, -9.6],
  "items": [
    { "mod": "MOD-daobac-01", "g": [0, 0], "floor": 1, "rot": 0 },
    { "mod": "MOD-daobac-01", "g": [3, 0], "floor": 1, "rot": 0 },
    { "mod": "MOD-daobac-01", "g": [6, 0], "floor": 1, "rot": 0 },
    { "mod": "MOD-daobac-01", "g": [9, 0], "floor": 1, "rot": 0 },
    { "mod": "MOD-daobac-01", "g": [12, 0], "floor": 1, "rot": 0 },
    { "mod": "MOD-daobac-01", "g": [0, 3], "floor": 1, "rot": 0 },
    { "mod": "MOD-daobac-01", "g": [12, 3], "floor": 1, "rot": 0 },
    { "mod": "MOD-daobac-07", "g": [6, 0], "floor": 1, "rot": 2, "cell": "c1" },
    { "mod": "MOD-daobac-09", "g": [6, 1], "floor": 1, "rot": 2, "cell": "c1" },
    { "mod": "MOD-daobac-11", "g": [5, 2], "floor": 1, "rot": 2, "cell": "c1" },
    { "mod": "MOD-daobac-11", "g": [7, 2], "floor": 1, "rot": 2, "cell": "c1" },
    { "mod": "MOD-daobac-14", "g": [1, 1], "floor": 1, "rot": 1, "cell": "c1" },
    { "prop": "prop_so_mon_phai", "at": [8.4, -6.0], "floor": 1, "rot": 0, "station": "somonphai", "cell": "c1" },
    { "prop": "prop_ke_kinh", "at": [-6.0, -6.5], "floor": 2, "rot": 0, "station": "tangkinh", "cell": "c2" }
  ]
}
```

`MOD-daobac-01/07/09/11/14` là **mã minh họa** (cột, thần khám, hương án, bồ đoàn, kệ kinh) — tài liệu 08 cấp mã thật. Trạm `somonphai`, `tangkinh` là gian mới (cần thêm vào `STATIONS` khi làm TASK-102, TASK-103).

## G.3 Long Hổ Sơn — SCHEMA-REGION-MANIFEST

```json
{
  "id": "longho",
  "name": "Long Hổ Sơn · Tự Hán Thiên Sư Phủ",
  "center": [1500, -200],
  "radius": 260,
  "unlock": { "realm": { "gte": 2 }, "label": "t:unlock.realm2" },
  "buildings": ["BLD-longho-01", "BLD-longho-02", "BLD-longho-03", "BLD-longho-04", "BLD-longho-05", "BLD-longho-06", "BLD-longho-07", "BLD-longho-08"],
  "pois": ["POI-longho-01", "POI-longho-02"],
  "props": "props/longho.json",
  "roads": [ [[820, 0], [1010, -40], [1200, -110], [1380, -170]], [[1380, -170], [1460, -190]] ],
  "audio": "BGM-longho",
  "palette": "palette/longho.json",
  "skyline": "far/longho.glb",
  "budget": { "drawCalls": 220, "tris": 600000, "texMB": 120 }
}
```

`BLD-longho-*`, `POI-longho-*`, `BGM-longho` là **mã minh họa** của tài liệu 07, 12. Đường xuất phát từ tâm Lịch Đường (820, 0) để nối đồ thị đường sẵn có.

## G.4 Persona Vân Cốc — SCHEMA-PERSONA (trường kỹ thuật)

```json
{
  "id": "PERSONA-van_coc",
  "npc": "van_coc",
  "v": 1,
  "status": "review",
  "reviewer": "chờ cố vấn Phật giáo",
  "baseline": "master",
  "name": "Vân Cốc thiền sư",
  "school": "Liễu Phàm · cải mệnh",
  "selfRef": "thầy",
  "userRef": "con",
  "voice": "Lão tăng ít lời, kể chuyện Liễu Phàm khi cần ví dụ, hay hỏi ngược để người chơi tự nghĩ. Không giảng quá năm câu.",
  "scope": ["Mệnh Đồ (gaimenhPlan)", "Sổ Công Quá", "remedy-fate: Cải Tâm, Cải Hành", "chuyện Liễu Phàm Tứ Huấn"],
  "forbid": ["bán (lễ|nghi lễ|bùa)", "chắc chắn (đổi|cải) (được )?mệnh", "mệnh (đã|vốn) định", "cúng (giải|cắt) hạn"],
  "forbidReplace": "Việc ấy thầy không dám hứa. Con cứ làm việc thiện, rồi tự thấy.",
  "opening": ["t:PERSONA-van_coc.open1", "t:PERSONA-van_coc.open2"],
  "voiceReminder": "Xưng «thầy», gọi «con». Tối đa 6 câu. Kết bằng một câu hỏi ngược.",
  "briefMode": "lite",
  "briefSections": ["Dụng Thần", "Cách cục", "Cải mệnh", "Lưu niên"],
  "toolsAllow": ["analyze_remedy_fate"],
  "maxChars": 900,
  "temperature": 0.55,
  "sensitive": null,
  "relatedQuestTags": ["lieu-phan", "menh-do", "so-cong-qua"],
  "cacheableQuestions": ["Liễu Phàm là ai?", "Sổ Công Quá dùng thế nào?", "Mệnh Đồ là gì?"],
  "fallbackDialogue": "PERSONA-van_coc.fallback",
  "memory": { "maxNotes": 5 }
}
```

`briefSections` phải khớp tiêu đề thật sau TASK-040; nếu tiêu đề engine khác, validator báo lỗi.

## G.5 Bảng việc — mẫu ánh xạ `CONG_QUA`

Mã `DEED-0xx` dưới đây là **chỗ giữ** (tài liệu 05 cấp số thật). Điểm lấy theo engine; cột «override» chỉ ra chỗ bản sơ đồ tổng đề xuất khác engine (câu hỏi mở Q4).

| Chỗ giữ | `kind` | `congQua` (nguyên văn engine) | Điểm engine | Đề xuất bản sơ đồ tổng §5.3 | `override`? |
|---|---|---|---|---|---|
| DEED-0a | thien | «Cứu người nguy cấp» | 3 | 救人 +3 | không |
| DEED-0b | thien | «Phóng sinh (cứu mạng)» | 3 | 放生 +1 | **có** (nếu tài liệu 05 giữ +1) |
| DEED-0c | thien | «Bố thí tiền/của» | 2 | 布施 +1…+2 | có thể (hai mức → hai việc) |
| DEED-0d | thien | «Khuyên người làm thiện» | 1 | 勸善 +2 (vạch mặt Định Mệnh Hội) | **có** |
| DEED-0e | thien | «Hiếu thuận cha mẹ» | 2 | 敬老/孝 +1 | **có** |
| DEED-0f | thien | «Giúp người khó khăn» | 2 | — | không |
| DEED-0g | thien | «Làm thiện ẩn (âm chất)» | 2 | — | không |
| DEED-0h | ac | «Dối trá/lừa gạt» | 2 | lừa NPC, nói dối trong lựa chọn | không |
| DEED-0i | ac | «Nói lời tổn thương» | 1 | — | không |
| DEED-0j | ac | «Giận dữ mất kiểm soát» | 1 | — | không |

«修橋補路 sửa cầu đường» (+2 trong bản sơ đồ tổng) **không** có mục tương ứng trong `CONG_QUA.thien` của engine → luật L1 sẽ báo lỗi; tài liệu 05 chọn: (a) ánh xạ vào «Giúp người khó khăn» với `override`, hoặc (b) đề xuất ENG thêm mục vào `CONG_QUA` (thay đổi engine dùng chung với app chính — làm theo F.5).

## G.6 Hợp đồng kết quả gian (`stationDone.result`)

Gian hiện có gọi `api.after(gained, why)`; bản mới thêm `api.result(obj)` khi bảng đóng (phần 03 §14). Hợp đồng từng gian (trường để điều kiện `result` của nút `station` kiểm):

| Gian (id) | Hàm cộng hiện có | `result` đề xuất |
|---|---|---|
| `thay` | `grantChart` (lập lá số lần đầu mỗi hồ sơ) | `{ profileId, self: bool, newChart: bool }` |
| `compass` | `grantDaily('compass')` | `{ facingDeg, shan, profileId? }` |
| `xam` | `recordStick` | `{ num, tone, accepted }` (web; iOS không có) |
| `huong` | `lightIncense` | `{ lit: bool }` |
| `lich` | `grantDaily('lich')` | `{ dayGZ }` |
| `tra` | `addTeaMinutes` | `{ minutes, tea }` |
| `sen` | `addLantern` | `{ ok }` (không gửi nội dung điều ước) |
| `an0…an2` | `recordCase({ kind: 'npc' })` | `{ slot, score }` (cũng phát `caseGraded`) |
| `trach`, `duongtrach`, `dieuhau`, `thuvien`, `hophon`, `tuvi`, `tuongphap`, `cachcuc` | `recordCase({ kind: 'desk' })` | `{ hall, score }` |
| `que` | (không cộng) | `{ method }` — `meihua`/`liuyao`/`xiaoliuren`/`jinkoujue`/`qiuqian` (web) |
| `tangy` | `cosmetics.buy/equip` | `{ bought?: itemId, equipped?: itemId }` |
| `vanbia`, `van0…van8` | — | `{ gate?: i }` (web) |
| `thaitue` | `lightLamp` | `{ lit: bool, year }` (web) |

Luật: `result` không chứa ngày sinh, câu hỏi tự do, nội dung điều ước — chỉ trường số/khóa cần cho điều kiện nhiệm vụ.

## G.7 Một lô đồng bộ sổ (ví dụ trọn vẹn)

Yêu cầu:

```json
{
  "since": 57,
  "contentV": "q:2026.11.3",
  "entries": [
    { "id": "01JC9X3T7Z8M4Q2V6N0B1R5K7D", "deed": "DEED-001", "kind": "thien", "pts": 3, "n": 1, "at": 1762300800000,
      "src": { "t": "case", "aid": "case:2026-11-05:1" }, "trust": "receipt",
      "rcpt": { "k": "case", "acc": "acc_01JC9W0000000000000000000A", "ref": "2026-11-05:1", "score": 0.83, "pts": 3, "dh": 12,
                "iat": 1762300801, "sig": "Qk9HVVMtU0lHTkFUVVJFLUZPUi1FWEFNUExFLU9OTFk" },
      "dev": "a91f3c2e" },
    { "id": "01JC9X5A2B3C4D5E6F7G8H9J0K", "deed": "DEED-002", "kind": "thien", "pts": 1, "n": 1, "at": 1762304400000,
      "src": { "t": "quest", "q": "MQ-1-03", "node": "n3", "aid": "MQ-1-03@1:n3:done:0" }, "trust": "local", "dev": "a91f3c2e" }
  ]
}
```

(`DEED-001/002`, chữ ký là giá trị minh họa; chữ ký thật 43 ký tự base64url của HMAC-SHA256.)

Trả lời khi mục 2 vượt trần khai báo của ngày:

```json
{
  "rev": 63,
  "ack": ["01JC9X3T7Z8M4Q2V6N0B1R5K7D", "01JC9X5A2B3C4D5E6F7G8H9J0K"],
  "add": [],
  "adj": [ { "id": "01JC9X5A2B3C4D5E6F7G8H9J0K", "ptsServer": 0, "why": "localCap" } ],
  "net": { "all": 46, "trusted": 33 },
  "amNo": 0
}
```

## G.8 Kế hoạch tuần cho M0 (3 tuần, phương án (a) phần 15 §1.3)

| Tuần | CLI 1 | CLI 2 | CLI 3 | AI | ENG | GFX | TA | LVL | CNT | QA | OPS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 007, 008, 009, 010 | 018, 019, 020, 017 | 025 | 034, 040 | 001, 002, 004 | 045 | 053, 016 | — | 064 (bắt đầu) | 012 | 014, 047, 069 |
| 2 | 011, 023, 024 | 026, 027 | 028, 029 | 035, 036, 037 | 003, 005, 006, 033 | 046, 044 (bắt đầu) | 016 (xong) | 050, 051, 052 | 048, 066 | 013 | — |
| 3 | 021, 022, 068 | 030, 031, 032, 065 | 042, 043, 055, 056, 059 | 038, 039, 041, 070 | — | 044 | — | (chơi thử) | 049, 054, 067 | 057, 058, 061 | 060 (SRV) |

Ràng buộc thứ tự trong tuần: 034 trước 036–038; 026 trước 027/028; 054 cần 027 + 029; 055 cần 021 + 054. TD duyệt PR engine (001–006) trong tuần 1–2; ADR (062) và ghi chú phát hành (063) cuối tuần 3.
