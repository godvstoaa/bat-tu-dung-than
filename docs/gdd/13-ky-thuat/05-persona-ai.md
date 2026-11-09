# 13.05 · Lớp persona AI

> Bản sơ đồ tổng §6.1–6.5 định kiến trúc hội thoại NPC: `askAI(question, R, cfg, { persona, gameContext, tools, style })`, persona chèn sau SYSTEM_PROMPT, `gameContext` < 600 ký tự, `toolsAllow` theo vai, AI không cấp thưởng, iOS và khi AI tắt dùng thoại kịch bản, 10 lượt/ngày (VIP 30), bộ đệm 24 giờ. Tài liệu 06 viết **giọng, phạm vi, câu cấm** của từng NPC (`PERSONA-<npc>`). Phần này đặc tả **cơ chế**: thay đổi `ai.js`, định dạng dữ liệu, bộ kiểm đầu ra, hạn mức, bộ đệm, chi phí, kiểm thử.

## 1. Hiện trạng cần sửa

| Điểm | Hiện tại (phần 01 §11) | Vấn đề cho game |
|---|---|---|
| Thứ tự thông điệp | `SYSTEM_PROMPT` → brief + hướng dẫn + chống thao túng → `STYLE_DIRECTIVES[style]` («REMEMBER THIS STYLE») → lịch sử → câu hỏi | Chỉ thị phong cách cuối cùng sẽ đè giọng persona |
| SYSTEM_PROMPT | vai «ông thầy phong thủy thực chiến», nói thẳng | Sai vai với Thiền sư Trúc Lâm (không đoán vận), Ni sư Diệu Âm, Khổng tiên sinh (phản đề) |
| Brief | ≈ 92,5 nghìn ký tự (RAG khi câu hẹp) | Đắt và chậm cho câu thoại NPC ngắn |
| Công cụ | toàn bộ `AI_TOOLS` (38 công cụ) | NPC có thể gọi công cụ ngoài vai (Thiền sư gọi `analyze_qimen`) |
| Hạn mức | 30 lần/phút/IP ở Worker | Không có hạn mức theo người chơi/ngày; sau NAT chung nhiều người cạn chung |
| Trạng thái game | AI không biết người chơi đang ở đâu, làm nhiệm vụ gì | AI có thể bịa nhiệm vụ, phần thưởng |
| iOS | `FEATURES.ai = false` | Cần thoại kịch bản thay thế cho mọi nút `aiTalk` |

Công cụ được nhắc trong bản sơ đồ tổng §6.2 nhưng **chưa có** trong `AI_TOOLS`: `analyze_amta` (Mao Sơn đạo nhân), công cụ tra Đạo Tạng (Khâu đạo trưởng) **(chưa có — cần làm)**, TASK-205.

## 2. Kiến trúc đích

```
UI persona (npc-chat-ui.js, thay master-ui cho NPC dẫn đạo)
  │  câu hỏi người chơi
  ▼
crisisGate(question)  ── khớp ──▶ rời vai: hiện thông tin hỗ trợ (crisis-resources.json) → không gọi AI
  │ không khớp
  ▼
quotaGate (máy chủ, theo tài khoản/thiết bị) ── hết lượt ──▶ thoại kịch bản + composeAnswer
  │ còn lượt
  ▼
cacheLookup(personaId, qNorm, chartHash, dayKey) ── trúng ──▶ trả từ bộ đệm
  │ trượt
  ▼
askAI(question, R, cfg, { persona, gameContext, toolsAllow, briefMode, history, signal })
  │  messages = [ BASELINE(persona) , PERSONA , BRIEF(briefMode) + GUIDE + ANTI_MANIP , GAME CONTEXT , VOICE REMINDER , history≤8 , user ]
  │  tools = AI_TOOLS ∩ toolsAllow ; execTool từ chối tên ngoài danh sách
  ▼
postFilter(answer)  = stripThink → checkNeo → gameClaimFilter → forbidFilter → salesFilter → lengthClamp
  ▼
hiển thị + 3 gợi ý (suggestFollowups) + điểm Neo (ẩn với người chơi thường, hiện ở chế độ học)
```

Mọi bước sau `askAI` chạy ở client; bước hạn mức chạy ở máy chủ (§7). Bộ đệm có hai tầng: bộ nhớ trong phiên (client) và KV (máy chủ) cho câu mở đầu dùng chung (§8).

## 3. Thay đổi `src/engine/ai.js`

### 3.1 Chữ ký

```js
export async function askAI(question, R, cfg, {
  onToken, onStatus, history, signal, style,
  persona = null,          // SCHEMA-PERSONA (đã nạp) — null: hành vi cũ của app chính, không đổi gì
  gameContext = '',        // chuỗi ≤ 600 ký tự (SCHEMA-GAMECTX)
  toolsAllow = null,       // string[] | null — null: mọi công cụ (hành vi cũ); [] : tắt công cụ
  briefMode = null,        // 'full' | 'rag' | 'lite' | 'none' | null (null = logic hiện tại)
} = {})
```

**Tương thích ngược:** khi `persona === null` và các tham số mới để mặc định, chuỗi `messages` phải **giống từng byte** với bản hiện tại. Test `test-ai-compat.mjs` so ảnh chụp `messages` của 10 câu hỏi mẫu trước/sau thay đổi (dùng fetch giả, không gọi mạng).

### 3.2 Lắp thông điệp khi có persona

```js
const base = persona.baseline === 'guide' ? GAME_GUIDE_PROMPT
           : (import.meta.env?.MODE === 'ios' ? RESEARCH_SYSTEM_PROMPT : SYSTEM_PROMPT);
const messages = [
  { role: 'system', content: base },
  { role: 'system', content: renderPersona(persona) },                       // §4
  ...(briefText ? [{ role: 'system', content: briefText + '\n\n' + _guide + '\n\n' + _ANTI_MANIP_GUIDE }]
                : [{ role: 'system', content: _ANTI_MANIP_GUIDE }]),         // chống thao túng LUÔN có
  ...(gameContext ? [{ role: 'system', content: '== BỐI CẢNH TRONG GAME (chỉ được nhắc những gì có ở đây) ==\n' + gameContext.slice(0, 600) }] : []),
  { role: 'system', content: persona.voiceReminder },                        // thay STYLE_DIRECTIVES
  ...((history || []).slice(-8)),
  { role: 'user', content: question },
];
```

- `GAME_GUIDE_PROMPT` (mới, trong `ai.js`): vai «người dẫn đạo trong một thế giới tu tâm», cấm đoán vận chắc chắn, cấm hứa phần thưởng, nhắc người chơi rằng mọi tiến độ do hành động trong game quyết định. Dùng cho NPC không luận lá số (Thiền sư Trúc Lâm, Ni sư Diệu Âm, Lạt-ma, người gác cổng).
- `_ANTI_MANIP_GUIDE` **luôn** có, kể cả `briefMode: 'none'`.
- Khi có persona, **không** gửi `STYLE_DIRECTIVES` (tránh đè giọng). `voiceReminder` là 1–2 câu ngắn nhắc xưng hô và độ dài.

### 3.3 Lọc công cụ

```js
const allowed = toolsAllow == null ? AI_TOOLS : AI_TOOLS.filter((t) => toolsAllow.includes(t.function?.name ?? t.name));
// buildBody(...) dùng `allowed`; nếu allowed.length === 0 thì toolsOn = false
// execTool(name, args, R): nếu toolsAllow != null && !toolsAllow.includes(name) → { error: 'tool_not_allowed' }
```

Phòng thủ hai lớp: mô hình không thấy công cụ ngoài danh sách; nếu vẫn gọi tên lạ (ảo giác) thì `execTool` trả lỗi, không chạy.

### 3.4 Chế độ brief

| `briefMode` | Nội dung | Kích thước mục tiêu | Dùng cho |
|---|---|---|---|
| `full` | `buildChartBrief(R)` đầy đủ | ≈ 92,5 nghìn ký tự | Thầy Tử Bình khi câu tổng hợp |
| `rag` | logic hiện tại (`_splitBrief` + `_selectRelevantSections`) | phụ thuộc câu | Thầy Tử Bình mặc định |
| `lite` | chỉ các mục brief khớp `persona.briefSections` + khối Mệnh Bàn rút gọn (§5.2) | ≤ 12.000 ký tự | Vân Cốc, Trương Thiên Sư, Tế tửu, Phán quan, Khổng tiên sinh |
| `none` | không gửi brief; chỉ `gameContext` và Mệnh Bàn rút gọn ≤ 800 ký tự | ≤ 1.500 ký tự | Thiền sư Trúc Lâm, Ni sư Diệu Âm, Lạt-ma, Lão Tùng |

`persona.briefSections` là danh sách **từ khóa tiêu đề mục** (khớp không phân biệt hoa thường với tiêu đề mà `_splitBrief` tách được). TASK-040 kiểm kê toàn bộ tiêu đề mục do `buildChartBrief` sinh và ghi vào `src/game/data/brief-sections.json` để validator kiểm `briefSections` không trỏ vào mục không tồn tại.

`checkNeo(answer, brief)` so câu trả lời với **chính brief đã gửi**. Với `none`, `checkNeo` chạy trên Mệnh Bàn rút gọn; điểm Neo thấp là bình thường (NPC nói ít dữ kiện lá số), nên UI chỉ cảnh báo khi phát hiện **xung đột** (`conflicts.length > 0`), không cảnh báo điểm thấp.

## 4. SCHEMA-PERSONA

Tệp `src/game/data/personas/<npc>.json`, nội dung giọng nói do tài liệu 06 viết:

```jsonc
{
  "id": "PERSONA-van_coc",                 // mã tài liệu 06
  "npc": "van_coc",                        // canon §4
  "v": 2,
  "status": "approved",                    // 'draft' | 'review' | 'approved' — chỉ 'approved' được dùng ở bản phát hành
  "reviewer": "cố vấn Phật giáo (tài liệu 14)",   // bắt buộc với persona tôn giáo
  "baseline": "master",                    // 'master' (SYSTEM_PROMPT) | 'guide' (GAME_GUIDE_PROMPT)
  "name": "Vân Cốc thiền sư",
  "school": "Liễu Phàm · cải mệnh",
  "selfRef": "thầy", "userRef": "con",
  "voice": "Lão tăng, kể chuyện, hay hỏi ngược. Câu ngắn. Không giảng dài quá 5 câu.",
  "scope": ["Mệnh Đồ (gaimenhPlan)", "Sổ Công Quá", "remedy-fate", "câu chuyện Liễu Phàm"],
  "forbid": [                               // regex (cờ i, u) — áp ở postFilter, thay câu vi phạm bằng câu thay thế
    "bán (lễ|nghi lễ)", "chắc chắn (đổi|cải) (được )?mệnh", "mệnh đã định"
  ],
  "forbidReplace": "Việc ấy thầy không dám hứa. Con cứ làm việc thiện, rồi tự thấy.",
  "opening": ["t:PERSONA-van_coc.open1"],  // câu mở đầu cố định (không qua AI)
  "voiceReminder": "Xưng «thầy», gọi «con». Tối đa 6 câu. Kết bằng một câu hỏi ngược.",
  "briefMode": "lite",
  "briefSections": ["Dụng Thần", "Cách cục", "Cải mệnh", "Lưu niên"],
  "toolsAllow": ["analyze_remedy_fate"],
  "maxChars": 900,                         // cắt mềm tại ranh giới câu
  "temperature": 0.55,                     // không vượt 0,7 (lỗi xáo chữ tiếng Việt, ghi chú trong ai.js)
  "sensitive": null,                       // 'amta' → chỉ dùng khi consent.amta
  "fallbackDialogue": "PERSONA-van_coc.fallback",   // SCHEMA-DIALOGUE dùng khi AI tắt / iOS / hết lượt
  "memory": { "maxNotes": 5 }              // ghi nhớ ngắn cục bộ (§6)
}
```

### 4.1 Bảng kỹ thuật các persona chính

Cột «Công cụ» đã đối chiếu với `AI_TOOLS` thật.

| npc | baseline | briefMode | Công cụ cho phép | Ghi chú kỹ thuật |
|---|---|---|---|---|
| `thay_tubinh` | master | rag (câu tổng hợp: full) | toàn bộ (như hiện nay) | giữ hành vi `master-ui.js` |
| `khong_tiensinh` | master | lite | `analyze_year` | luôn kết bằng câu hỏi ngược (kiểm ở postFilter: câu cuối có «?») |
| `van_coc` | master | lite | `analyze_remedy_fate` | `gameContext` luôn có mốc Sổ Công Quá |
| `truong_thiensu` | master | lite | `fengshui_direction` | `forbid` gồm «vẽ phù», «phù trị bệnh» |
| `huyen_hu` | guide | none | — | `forbid` gồm 辟穀, «nhịn ăn», «khí công chữa» |
| `khau_daotruong` | guide | none | (công cụ tra Đạo Tạng — **chưa có**) | tạm dùng `fallbackDialogue` + trích `daozang-data` đã sửa D2 |
| `maoshan_daonhan` | master | lite | (`analyze_amta` — **chưa có**) | `sensitive: 'amta'`; luôn hỏi ngủ/ăn/áp lực trước |
| `truclam_thiensu` | guide | none | — | từ chối đoán vận nhẹ nhàng (thoại mẫu tài liệu 06) |
| `dieu_am` | guide | none | — | `forbid` «nghiệp báo sẽ», «quả báo» dạng đe dọa |
| `lama_dakiet` | guide | none | — | `status: 'draft'` tới khi có tham vấn (canon §3, §14) — **không phát hành** |
| `te_tuu` | master | lite | `analyze_name` | |
| `phan_quan` | guide | none | — | `gameContext` gồm Sổ Công Quá của người chơi; `forbid` «xuống địa ngục» |
| `vu_y_amau` | guide | none | — | `forbid` tên vị thuốc/liều lượng; chuyển y tế |
| `gac_cong` | guide | none | — | hướng dẫn nhập môn |

## 5. Bối cảnh game — SCHEMA-GAMECTX

### 5.1 Hàm dựng

```js
// src/game/persona.js
export function buildGameContext({ state, mb, quests, ledger, region, persona, now }) → { text, allow }
// text: chuỗi ≤ 600 ký tự; allow: { quests: string[], items: string[], places: string[], titles: string[] }
```

Thứ tự ưu tiên khi cắt cho vừa 600 ký tự (cắt từ dưới lên):

| # | Dòng | Ví dụ (`MAU-A`) |
|---|---|---|
| 1 | Nơi và giờ | `Nơi: Am Vân Cốc. Giờ Hợi, ngày 丙午 tháng 10 âm.` |
| 2 | Tên và cảnh giới | `Người chơi: Mây Thong Thả · Nhập Môn (bậc 2) · Đạo Hạnh 140.` |
| 3 | Nhiệm vụ đang làm liên quan persona (≤ 2) | `Đang làm: «Ba việc thiện đầu tiên» (đã 1/3).` |
| 4 | Mệnh Đồ | `Mệnh Đồ: tầng Không gian ✓, Tên ✗, Thời ✗, Thái Tuế ✗, Làm công ✗, Tích âm đức (đang làm).` |
| 5 | Sổ Công Quá | `Sổ Công Quá: 42 công; mốc kế 300.` |
| 6 | Lớp và Phẩm căn | `Mệnh Cách: Đắc Cứu · Phẩm căn: Tứ Linh Căn (41).` |
| 7 | Ghi nhớ persona (≤ 2 ghi chú) | `Lần trước: con hỏi về nghề.` |

- Chỉ đưa nhiệm vụ có `giver` hoặc `tags` liên quan persona (bảng ánh xạ trong dữ liệu persona: `relatedQuestTags`).
- **Không bao giờ** đưa ngày sinh, giờ sinh, tên hồ sơ người thân vào `gameContext` (brief đã có lá số; tên người thân không cần cho NPC).
- `allow` là danh sách tên **được phép nhắc** cho bộ lọc §6.2: tên nhiệm vụ đang làm và đã xong, tên vật phẩm đang có, tên vùng đã mở, danh hiệu.

### 5.2 Mệnh Bàn rút gọn (cho `lite` và `none`)

```
MỆNH BÀN: Tiềm Lực 41/100 (hơn 31% người) · Tứ Linh Căn · Phúc phận: khá no
Ngũ hành %: Mộc 6,5 · Hỏa 18,3 · Thổ 17,9 · Kim 55,1 · Thủy 2,2 · Dụng Thủy · Hỷ Kim · Kỵ Thổ · Cừu Hỏa
Thân: Thân quá vượng (77) · Cách: 七殺格, có cứu (有救) · Mệnh cấp: 清贵 · Nguyên Khí 23
Ngũ Duy: Tài 26 · Quan 45 · Ấn 54 · Thực 15 · Tỷ 100 · Đại vận 甲申 · Lưu niên 2026 丙午
```

Sinh tự động từ SCHEMA-MENHBAN (≤ 800 ký tự). Đây là nguồn đối chiếu `checkNeo` khi `briefMode = 'none'`.

## 6. Bộ lọc đầu ra (`postFilter`)

Chạy tuần tự trên câu trả lời đầy đủ **sau khi stream xong**. Trong lúc stream, UI hiện chữ ở trạng thái «đang viết» (mờ); khi lọc xong mới hiện bản cuối. Lý do: không để người chơi kịp đọc câu sẽ bị gỡ.

### 6.1 Các bước

| # | Bước | Hành vi |
|---|---|---|
| 1 | `stripThink` | bỏ `<think>…</think>` (đã có trong `master-ui.js › clean`) |
| 2 | Tách câu | theo `.`, `!`, `?`, `…`, xuống dòng; giữ dấu câu |
| 3 | `checkNeo(answer, briefSent)` | ghi `neo` (điểm, xung đột); xung đột can chi/hành → gạch chân câu ở chế độ học, ghi phân tích |
| 4 | `gameClaimFilter` | §6.2 |
| 5 | `forbidFilter` | regex chung + `persona.forbid`; câu khớp → thay bằng `forbidReplace` (một lần, không lặp) |
| 6 | `salesFilter` | câu nhắc «Tàng Y Các», «VIP», «Chân Nhân», «Ngọc», «nạp», «mua», «gói» → bỏ câu (bản sơ đồ tổng §6.4 quy tắc 1) |
| 7 | `fateFilter` | «mệnh đã định», «không thể thay đổi», «chắc chắn sẽ (chết\|bệnh\|ly hôn…)» → thay bằng câu dẫn RB2 «con có thể…» |
| 8 | `lengthClamp` | cắt tại ranh giới câu gần `maxChars` nhất |
| 9 | `questionTail` (riêng `khong_tiensinh`) | câu cuối không có «?» → nối câu hỏi ngược mặc định của persona |

### 6.2 Lọc khẳng định về trạng thái game

Mục tiêu: AI không được nói người chơi «đã nhận», «sẽ được thưởng», hay nhắc nhiệm vụ không có.

```
gameClaimFilter(sentences, allow):
  for s in sentences:
    names = trích «…» và các cụm sau từ khóa (nhiệm vụ|việc|bảo vật|pháp khí|danh hiệu|vùng) + danh từ riêng viết hoa ≥ 2 chữ
    for n in names:
      if n khớp mờ (khoảng cách Levenshtein ≤ 2 sau bỏ dấu) một mục trong allow.* → hợp lệ
      else if n khớp một mục trong toàn bộ danh mục game (quests, items, places) nhưng không có trong allow → câu «tiết lộ trước» → bỏ câu
      else if n khớp từ điển thuật ngữ cổ pháp (canon + engine: tên sao, tên cách, tên kinh) → hợp lệ
      else → câu «bịa» → bỏ câu
    if s khớp /(nhận được|được thưởng|tặng (con|cháu|ngươi)|mở khóa|thăng cảnh giới)/ → bỏ câu (AI không cấp thưởng)
```

- Từ điển thuật ngữ sinh tự động từ engine (`constants.js`, `shensha`, `pattern`, `JING_ZHOU`, `daozang` tên kinh) để không gỡ nhầm thuật ngữ thật.
- Ghi số câu bị gỡ vào số liệu (phần 08, sự kiện `ai_filter`) để theo dõi chất lượng; mục tiêu < 5% câu bị gỡ.

### 6.3 Cổng khủng hoảng (`crisisGate`)

- Chạy **trước** khi gửi câu hỏi, trên văn bản người chơi nhập (và trên câu trả lời AI như lớp phụ).
- Mẫu từ khóa tiếng Việt (có dấu và không dấu) về tự hại, muốn chết, bạo hành, bệnh nặng cấp cứu; danh sách do cố vấn tài liệu 14 duyệt, lưu `src/game/data/crisis-patterns.json`.
- Khớp → NPC nói một câu rời vai cố định («Chuyện này quan trọng hơn mọi bài học trong quán…»), hiện thẻ thông tin hỗ trợ từ `src/game/data/crisis-resources.json` (**số điện thoại, tổ chức do chủ dự án và cố vấn xác nhận; không tự điền**), không gọi AI, không trừ lượt.
- Ghi sự kiện phân tích `crisis_shown` **không kèm nội dung** câu hỏi.

### 6.4 Ghi nhớ persona

- Sau mỗi phiên trò chuyện (≥ 2 lượt), client tạo ghi chú ngắn **bằng luật**, không gọi AI: chủ đề chính (từ khóa câu hỏi đầu: «nghề», «hôn nhân», «sức khỏe», «Mệnh Đồ»…), ngày. Lưu `state.persona.mem[npc].notes` (≤ 5, mỗi ghi chú ≤ 120 ký tự).
- Không gửi ghi nhớ lên máy chủ; chỉ đưa vào `gameContext` dòng 7.

## 7. Hạn mức

### 7.1 Luật

| Người chơi | Lượt AI/ngày | Ghi chú |
|---|---|---|
| Thường | 10 | bản sơ đồ tổng §6.5 |
| VIP | 30 | |
| Câu mở đầu (`opening`), thoại kịch bản, trả lời cục bộ | không giới hạn | không qua AI |
| Trúng bộ đệm máy chủ | không trừ lượt | |

«Ngày» theo giờ địa phương của người chơi (múi giờ khai báo, mặc định +07:00), đặt lại lúc 0 giờ.

### 7.2 Thực thi ở máy chủ

- Client gửi yêu cầu AI qua đường mới `/api/hq/ai/chat` (không gọi thẳng `/zai`), kèm `Authorization: Bearer <token tài khoản/thiết bị>` (phần 08) và trường `persona`.
- Worker: kiểm token → `PlayerVault.consumeAiTurn(day)` (DO, đếm nguyên tử) → nếu còn lượt thì chuyển tiếp tới backend hiện có (`freeRoute` hoặc khóa quản trị) **không đổi luồng stream**; hết lượt → 429 với `{ type: 'quota', resetAt }`.
- Thiết bị chưa có tài khoản: token thiết bị ẩn danh (phần 08 §2) → vẫn có `PlayerVault` theo thiết bị. Gỡ cài đặt/xóa dữ liệu thì được thiết bị mới (chấp nhận; giới hạn theo IP 30/phút vẫn còn).
- Lượt bị trừ **trước** khi gọi backend; backend lỗi (5xx, timeout) → hoàn lượt (`refundAiTurn`).

### 7.3 Chế độ lỗi của hạn mức

| Lỗi | Xử lý |
|---|---|
| DO `PlayerVault` không phản hồi trong 500 ms | cho qua (fail-open) nhưng ghi `quota_bypass`; giới hạn IP vẫn áp |
| Người chơi đổi đồng hồ máy | ngày tính theo giờ máy chủ + múi giờ đã khai báo; đổi múi giờ chỉ có hiệu lực từ ngày kế tiếp |
| `isAiEnabled = false` | trả `ai_disabled`; client chuyển thoại kịch bản, không báo lỗi (§6.5 bản sơ đồ tổng) |

## 8. Bộ đệm

| Tầng | Khóa | Thời hạn | Dùng cho |
|---|---|---|---|
| Phiên (client) | `personaId + qNorm + chartHash` | đến khi đóng game | hỏi lại cùng câu |
| Máy chủ (KV) | `sha256(personaId + v + qNorm + bucket)` | 24 giờ | câu mở đầu phổ biến, đánh dấu `cacheable` trong persona |

- `qNorm`: chữ thường, bỏ dấu câu, gộp khoảng trắng, bỏ dấu tiếng Việt **chỉ để so khóa**.
- `bucket`: với câu **phụ thuộc lá số**, khóa gồm `mbHash` → chỉ trúng khi cùng Mệnh Bàn (thực tế ít trúng; không lưu nội dung lá số trong KV, chỉ câu trả lời). Với câu **không phụ thuộc lá số** (danh sách `cacheableQuestions` của persona, vd «Liễu Phàm là ai?»), bucket = `'*'`.
- Không lưu câu hỏi tự do của người chơi vào KV; chỉ lưu khi câu khớp danh sách soạn sẵn.

## 9. Thoại thay thế (AI tắt, iOS, hết lượt)

- Mỗi persona có `fallbackDialogue` (SCHEMA-DIALOGUE) gồm các cảnh theo chủ đề trong `scope`, mỗi cảnh có câu dẫn + nút «Hỏi điều khác».
- Câu hỏi tự do khi không có AI: gọi `nlg.js › composeAnswer(question, R)` (đã có trong app) **chỉ** với persona `baseline: 'master'`; persona `guide` trả cảnh fallback phù hợp nhất theo từ khóa.
- Nút `aiTalk` của máy nhiệm vụ hoàn thành bình thường bằng thoại thay thế (phần 03 §12).

## 10. Chi phí và hiệu năng

### 10.1 Ước lượng token theo chế độ brief

Quy đổi thô dùng để lập ngân sách (cần đo thật bằng trường `usage` của API, TASK-041): tiếng Việt có dấu + chữ Hán ≈ 3 ký tự/token.

| Chế độ | Ký tự vào (hệ thống + brief + bối cảnh) | Token vào (ước) | Token ra (ước, 900 ký tự) | Tỉ lệ so `full` |
|---|---|---|---|---|
| `full` | ≈ 100.000 | ≈ 33.000 | ≈ 300 | 1,00 |
| `rag` | ≈ 40.000–60.000 | ≈ 13.000–20.000 | ≈ 300 | ≈ 0,4–0,6 |
| `lite` | ≈ 15.000 | ≈ 5.000 | ≈ 300 | ≈ 0,16 |
| `none` | ≈ 4.000 | ≈ 1.300 | ≈ 300 | ≈ 0,05 |

Ước tính dùng ở phần 15 (mô hình chi phí). Mục tiêu: ≥ 70% lượt AI trong game dùng `lite`/`none`.

### 10.2 Độ trễ

- `buildChartBrief` mất ≈ 190 ms trên Node (phần 01 §1); trên điện thoại có thể 0,5–1 s (suy luận). Brief đã được đệm theo lá số trong `ai.js` (`_briefCache`). Chế độ `lite` cần cache riêng theo `(chartKey, persona.briefSections)`.
- Mục tiêu thời gian tới token đầu (TTFT) do backend quyết định; UI hiện «Thầy đang xem…» ngay và câu mở đầu cố định trong lúc chờ.

## 11. Bảo mật và quyền riêng tư

1. Brief lá số rời máy người chơi tới nhà cung cấp mô hình — **đã là hành vi của app chính**; game hiển thị cùng thông báo đồng ý như app (một lần), và trên iOS không có AI.
2. `gameContext` không chứa ngày sinh, tên người thân, nội dung sổ đời thực.
3. Persona chạy ở client nên người dùng có thể sửa persona của chính mình; tác hại giới hạn trong cuộc trò chuyện của họ. Các luật an toàn quan trọng (khủng hoảng, bán hàng) chạy ở client **và** có bản rút gọn ở Worker (`/api/hq/ai/chat` từ chối yêu cầu thiếu `_ANTI_MANIP_GUIDE` trong thông điệp hệ thống — kiểm bằng băm chuỗi hằng).
4. Không ghi nội dung câu hỏi/trả lời của game vào `events:log` của `admin.js` (khác app chính). Chỉ ghi số liệu tổng hợp (phần 08).

## 12. Kiểm thử

| Bộ | Ca |
|---|---|
| `test-ai-compat.mjs` | `persona = null` → `messages` giống bản cũ từng byte (10 câu) |
| `test-persona-assembly.mjs` | thứ tự thông điệp; không có `STYLE_DIRECTIVES` khi có persona; `_ANTI_MANIP_GUIDE` luôn có; `briefMode` đúng kích thước; `gameContext` cắt ≤ 600 |
| `test-persona-tools.mjs` | `toolsAllow` lọc danh sách gửi; `execTool` từ chối tên ngoài danh sách; `[]` tắt công cụ |
| `test-postfilter.mjs` | bộ 120 câu mẫu (tài liệu 06 cung cấp) cho từng bộ lọc: câu bán hàng bị gỡ; «mệnh đã định» bị thay; tên nhiệm vụ bịa bị gỡ; tên thuật ngữ cổ pháp **không** bị gỡ; «con sẽ được thưởng» bị gỡ |
| `test-crisis.mjs` | mẫu có dấu/không dấu/viết tắt khớp; câu bình thường chứa «chết» trong ngữ cảnh cổ pháp («tử», «Thất Sát») không khớp nhầm (danh sách ca âm tính 200 câu) |
| `test-quota.mjs` (Worker) | 10 lượt rồi 429; VIP 30; lỗi backend hoàn lượt; qua 0 giờ đặt lại |
| Đánh giá chất lượng (thủ công + bán tự động) | 30 câu × 13 persona; chấm: đúng giọng, đúng phạm vi, không vi phạm `forbid`, `checkNeo` không xung đột; điểm Neo trung bình ≥ 90 với persona `master` (chỉ số thành công §13.5 bản sơ đồ tổng) |

## 13. Mẫu văn bản thông điệp hệ thống

Các mẫu dưới là **khung kỹ thuật**; lời thoại, giọng cụ thể của từng NPC do tài liệu 06 viết vào các trường của SCHEMA-PERSONA. Biến dạng `{…}` được `renderPersona` thay bằng giá trị trường.

### 13.1 `renderPersona(persona)`

```
== VAI CỦA BẠN TRONG GAME «HUYỀN GIỚI» ==
Bạn là {name}, {school}. Xưng «{selfRef}», gọi người chơi là «{userRef}».
Giọng: {voice}
Chỉ nói trong phạm vi: {scope nối bằng «; »}.
KHÔNG BAO GIỜ: {forbid diễn giải thành câu, mỗi ý một dòng}.
Luật chung của game (bắt buộc):
1. Bạn không trao phần thưởng, không mở khóa, không xác nhận nhiệm vụ đã xong. Việc đó do game tự làm.
2. Không nhắc cửa hàng, trang phục bán, VIP, Ngọc, nạp tiền.
3. Không nói mệnh đã định. Mọi nhận định về tương lai phải kèm việc người chơi có thể làm.
4. Chỉ nhắc nhiệm vụ, vật phẩm, địa danh có trong mục «BỐI CẢNH TRONG GAME».
5. Người chơi nói về tự hại, bệnh nặng, khủng hoảng thật: dừng vai, khuyên tìm người giúp thật, rồi mới trở lại vai.
Độ dài: tối đa {maxChars} ký tự.
```

Năm luật chung là bản viết cho mô hình của bốn quy tắc an toàn §6.4 bản sơ đồ tổng (luật 1 tách «không cấp thưởng» khỏi «không bịa trạng thái»). Bộ lọc §6 vẫn chạy sau, vì mô hình có thể không tuân thủ.

### 13.2 Khung `GAME_GUIDE_PROMPT`

```
Bạn là một người dẫn đạo trong một thế giới tu tâm. Người chơi đến hỏi về đạo, về cách sống, về việc tu.
Bạn không xem bói, không đoán ngày tốt xấu, không phán vận hạn, không chẩn bệnh.
Khi được hỏi về vận mệnh, nhẹ nhàng nói rằng việc đó thuộc thầy khác trong Sơn Môn, và hướng câu chuyện về
việc người chơi có thể làm hôm nay. Trả lời ngắn, có hình ảnh, ít thuật ngữ; nếu dùng chữ Hán thì kèm âm Hán Việt và nghĩa.
```

Không có lá số trong ngữ cảnh khi `briefMode = 'none'`; chỉ có Mệnh Bàn rút gọn để NPC biết người chơi «thiên về hành nào» nếu cần ví von.

### 13.3 `voiceReminder` (mẫu)

```
Nhắc lại: xưng «{selfRef}», gọi «{userRef}». Tối đa {n} câu. {đặc điểm kết câu của persona}.
```

### 13.4 Danh sách mẫu lọc chung (`postFilter`)

| Bộ | Mẫu (regex, cờ `iu`, áp sau khi bỏ dấu một bản sao để khớp cả không dấu) | Hành động |
|---|---|---|
| Bán hàng | `t[aà]ng\s*y\s*c[aá]c`, `\bvip\b`, `ch[aâ]n\s*nh[aâ]n\s*\(vip\)`, `\bng[oọ]c\b`, `n[aạ]p\s*(ti[eề]n|th[eẻ])`, `mua\s*(g[oó]i|[aá]o|đ[oồ])` | bỏ câu |
| Hứa thưởng | `(s[eẽ]|đ[uư][oợ]c)\s*(th[uư][oở]ng|nh[aậ]n|t[aặ]ng)`, `m[oở]\s*kh[oó]a`, `(l[eê]n|th[aă]ng)\s*c[aả]nh\s*gi[oớ]i` | bỏ câu |
| Định mệnh | `m[eệ]nh\s*(đ[aã]|v[oố]n)\s*đ[iị]nh`, `kh[oô]ng\s*th[eể]\s*(thay|đ[oổ]i|c[aả]i)`, `ch[aắ]c\s*ch[aắ]n\s*s[eẽ]\s*(ch[eế]t|b[eệ]nh|ly\s*h[oô]n|ph[aá]\s*s[aả]n)` | thay câu dẫn RB2 |
| Y tế | `u[oố]ng\s*\d+\s*(vi[eê]n|mg|g)\b`, `ch[aẩ]n\s*đo[aá]n\s*(b[aạ]n|con)\s*b[iị]` | thay câu chuyển y tế |
| Nghi lễ thật có hại (Tà Lộ) | danh sách tài liệu 14 cung cấp (không ghi trong tài liệu kỹ thuật) | bỏ câu |

Mẫu được giữ trong `src/game/data/filters.json` (có phiên bản), không viết cứng trong code, để cập nhật nhanh qua bản nội dung.

### 13.5 Nhóm mẫu khủng hoảng

`crisis-patterns.json` chia nhóm: `selfharm`, `suicide`, `abuse`, `medical-emergency`. Mỗi nhóm có `positive` (regex) và `negativeContext` (cụm cổ pháp chứa từ nhạy cảm nhưng không phải khủng hoảng, vd «tử vong» trong «Thất Sát chủ tử vong», «chết» trong «tử tuyệt (vòng trường sinh)»). Khớp `positive` và **không** nằm trong cửa sổ ±20 ký tự của một `negativeContext` → kích hoạt. Danh sách do cố vấn tài liệu 14 duyệt; `test-crisis` dùng bộ 200 câu âm tính để giữ tỉ lệ báo nhầm < 1%.
