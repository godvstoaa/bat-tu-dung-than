# 06 · NPC dẫn đạo và Thầy AI — Huyền Giới · Mệnh Do Ta Tạo

> **Phạm vi.** Tài liệu này nở từ bản sơ đồ `docs/GAME-AAA-THIET-KE.md` §6. Nó định nghĩa:
> - tầng AI cho NPC: thay đổi `askAI`, ngân sách token, bộ lọc, giới hạn, quyền riêng tư;
> - 20 NPC chính của canon §4: bible, persona, lịch, thiện cảm, cây thoại kịch bản, bark;
> - 44 NPC phụ có lá số thật;
> - bộ thử đỏ 200 câu;
> - kế hoạch đánh giá.
>
> **Canon:** tuân thủ `docs/gdd/00-KINH-DIEN-CHUNG.md`. Mọi số liệu lá số trong tài liệu là **kết quả chạy engine thật** ngày 2026-11-05.

## 1. Mục lục

| Phần | Tệp | Nội dung |
|---|---|---|
| 06-01 | `06-01-kien-truc-ai.md` | Hiện trạng code (đo thật); `askAI` mới (`persona`, `gameContext`, `toolsAllow`); thứ tự message; schema `gameContext` ≤ 600 ký tự; bộ lọc V1–V8 + Neo; trạng thái stream; dự phòng L0–L4; iOS; hạn mức 10 / 30; cache; chi phí; thiện cảm; khủng hoảng + chế độ thiếu niên; log và quyền riêng tư; **PERSONA-CHUNG**; bark; lịch 12 giờ; test AIT-01…14 |
| 06-02 | `06-02-van-coc.md` | Vân Cốc thiền sư — bible, PERSONA, 48 nút thoại, 24 bark |
| 06-03 | `06-03-khong-tiensinh.md` | Khổng tiên sinh (phản đề «định mệnh luận») — 3 chốt an toàn, bảng câu hỏi ngược KTS-KET, 44 nút, 21 bark |
| 06-04 | `06-04-thay-tubinh.md` | Thầy Tử Bình — 27 công cụ được phép / 11 không cấp, 46 nút, 21 bark |
| 06-05 | `06-05-truong-thiensu.md` | Trương Thiên Sư — phù 5 phần (chữ hư cấu), bái Đẩu, sao bản mệnh, 44 nút, 21 bark |
| 06-06 | `06-06-dieu-am.md` | Ni sư Diệu Âm — sám hối kèm hành động, phóng sinh đúng, 44 nút, 21 bark |
| 06-07 | `06-07-te-tuu.md` | Tế tửu Văn Miếu (Chu Văn Trinh) — lập chí, đạo hiệu, khoa cử, 42 nút, 21 bark |
| 06-08 | `06-08-vodang-chungnam-maoshan.md` | Huyền Hư chân nhân · Khâu đạo trưởng · Mao Sơn đạo nhân |
| 06-09 | `06-09-yentu-tangdia-phongdo.md` | Thiền sư Trúc Lâm · Lạt-ma Đa Kiệt (khoá, chờ tham vấn) · Phán quan Thôi · Địa Tạng sứ giả |
| 06-10 | `06-10-mieucuong-phandien.md` | Vu y bà A Mậu · Yểm sư Lỗ Ban (chỉ kịch bản) · Định Mệnh Hội (12 án lừa, ánh xạ luật chống thao túng) |
| 06-11 | `06-11-son-mon-du-phuong.md` | Lão Tùng · Bà Tư thợ may (chỉ kịch bản) · Đan Đỉnh chân nhân (bảng thuốc → thánh địa) · Phương sĩ Vô Danh |
| 06-12 | `06-12-npc-phu.md` | 44 NPC phụ `NPC-*` với khoá `makeNpc` và lá số thật; mẫu dân làng sinh thủ tục `NPC-GEN-*` |
| 06-13 | `06-13-red-team.md` | Bộ thử đỏ 200 câu, 13 nhóm (101 P0) |
| 06-14 | `06-14-danh-gia.md` | Chỉ số (Neo ≥ 90, từ chối thừa ≤ 2%, …), bộ dữ liệu, đo tự động, thang người duyệt 6 trục, định dạng JSONL, cổng phát hành, giám sát |
| 06-15 | `06-15-the-gioi-du-lieu.md` | Phản ứng 20 NPC với 8 trạng thái thế giới; 15 cảnh hội thoại chéo; sổ persona dạng dữ liệu; ma trận lịch 20 × 12; ánh xạ mọi chỗ chèn `{…}`; 21 việc kỹ thuật |
| 06-16 | `06-16-ban-dien-mau.md` | Bản điền mẫu với 3 lá số thật (MAU-A, L-THAP, L-CAO); **10 phát hiện P1–P10** khi chạy engine |
| 06-17 | `06-17-luot-mau-chuan.md` | 90 lượt mẫu chuẩn / hỏng (6 / NPC AI) đã chấm 6 trục |
| 06-18 | `06-18-cam-nang-giong.md` | Xưng hô chéo, từ vựng từng NPC, bảng dịch thuật ngữ đời thường, ghi chú lồng tiếng, quy tắc viết thoại |
| 06-19 | `06-19-thu-da-luot.md` | 20 kịch bản thử đa lượt: leo thang tất định, đổi dữ kiện, bẻ khoá từng bước, khủng hoảng nổi dần, trôi vai, trạng thái game, Tà Lộ (18 P0) |

## 2. Tóm tắt quyết định

1. **AI chỉ nói, không làm.**
   - Mọi phần thưởng, thiện cảm, tiến độ do máy trạng thái quyết.
   - Câu «hứa thưởng» bị lọc trước khi hiện (V1).
   - Game chạy trọn vẹn khi AI tắt (canon §6.1 điểm 4–5).
2. **Cùng não với trang chính.**
   - NPC dùng nguyên `SYSTEM_PROMPT`, `buildChartBrief`, `_ANTI_MANIP_GUIDE`.
   - Persona chỉ **thêm** một system message và **bớt** mục âm tà khi chưa bật.
   - `askAI` không persona giữ nguyên hành vi cũ (AIT-01).
3. **Persona thắng luật «tuyệt đối không từ chối»** của `SYSTEM_PROMPT` ở năm vùng: tất định, khủng hoảng, y tế / tài chính, hại người thứ ba, nghi lễ có hại (PERSONA-CHUNG luật 10). Câu hỏi kiến thức vẫn phải trả lời đầy đủ (DNO1–5).
4. **Khủng hoảng chạy trước AI, trên máy người chơi**, kể cả iOS. Mức A không gọi mạng.
5. **Năm thực thể chỉ chạy kịch bản:**
   - Lạt-ma: chờ tham vấn;
   - Lỗ Ban, Định Mệnh Hội: bề mặt bẻ khoá lớn;
   - Lão Tùng: tutorial và quyền riêng tư phải tất định;
   - Bà Tư: đứng cạnh giá tiền.
6. **Công cụ theo vai** (`toolsAllow`). Thầy Tử Bình 27 / 38 công cụ; các NPC khác 0–4. Ngoài truyền thống Huyền Giới (tarot, rune, chiêm tinh Tây) không cấp trong game.
7. **Quyền riêng tư nói đúng như code:** brief gửi AI **có** ngày, giờ sinh dạng chữ. Câu chuẩn cho người chơi ở 06-01 §12.1. Game không ghi câu chữ hội thoại lên máy chủ trừ khi người chơi tự gửi.
8. **NPC phụ có lá số thật** qua `makeNpc` với hằng `NPC_EPOCH = 2026`, để năm sinh không trôi.

## 3. Sơ đồ kiến trúc

```
                         ┌──────────────── MÁY NGƯỜI CHƠI ─────────────────────────────────────────┐
 người chơi gõ / chọn ──▶│ crisisCheck (§11) ──A/C──▶ KHỐI HỖ TRỢ (cố định, không mạng)            │
                         │      │ B: cờ ④                                                            │
                         │      ▼                                                                    │
                         │ runtime? ──scripted / iOS / thiếu niên──▶ CÂY THOẠI + chèn {…} (06-15 §5) │
                         │      │ ai                                                                 │
                         │ quota? ──hết──▶ FREE.QUOTA   cache? ──trúng──▶ (V1–V8) ─▶ hiển thị        │
                         │      ▼                                                                    │
                         │ askAI(q, R, cfg, { persona, gameContext, toolsAllow, style, history })    │
                         │   ① SYSTEM_PROMPT                                                         │
                         │   ② PERSONA-CHUNG + PERSONA-<id>          ≤ 1.400 token                   │
                         │   ③ brief(briefMode, bỏ ÂM TÀ nếu chưa bật) + guide + _ANTI_MANIP_GUIDE    │
                         │   ④ BỐI CẢNH GAME                          ≤ 600 ký tự, đã làm sạch       │
                         │   ⑤ STYLE + «PERSONA thắng»                                               │
                         │   ⑥ history (−6)   ⑦ user                                                 │
                         │   tools = AI_TOOLS ∩ toolsAllow ; execTool chặn ngoài phạm vi             │
                         └──────┬──────────────────────────────────────────────────────────▲─────────┘
                                │ POST /zai/…/chat/completions                             │ SSE
                         ┌──────▼──────────── WORKER ────────────────────────┐              │
                         │ 30/phút/IP · quota ngày (mới) · isAiEnabled → 503  │──────────────┘
                         │ freeRoute: z.ai → pool (bỏ tools)                  │
                         └──────┬─────────────────────────────────────────────┘
                                ▼
                         nhà cung cấp mô hình
 SSE token ─▶ bộ đệm theo câu ─▶ V1 hứa thưởng · V2 thương mại · V3 tên game · V4 định mệnh
           ─▶ V5 y khoa · V6 chữ Hán ─▶ hiển thị ─▶ xong: V7 checkNeo · V8 câu hỏi ngược (Khổng)
           ─▶ gợi ý (followupPool + suggestFollowups) ─▶ sự kiện ai_npc (không câu chữ)
 lỗi / 503 / hết vòng ─▶ L1/L2: composeAnswer (khung persona) hoặc nút FREE.* theo ý định
```

## 4. Mã định danh mới (không gian tên của tài liệu 06)

### 4.1 `PERSONA-*` (22)

| Mã | Nơi định nghĩa | Chạy khi chơi |
|---|---|---|
| PERSONA-CHUNG | 06-01 §13 | có (ghép trước mọi persona) |
| PERSONA-thay_tubinh | 06-04 §9 | có |
| PERSONA-khong_tiensinh | 06-03 §9 | có |
| PERSONA-van_coc | 06-02 §9 | có |
| PERSONA-truong_thiensu | 06-05 §9 | có |
| PERSONA-huyen_hu | 06-08 A8 | có |
| PERSONA-khau_daotruong | 06-08 B8 | có |
| PERSONA-maoshan_daonhan | 06-08 C8 | có |
| PERSONA-truclam_thiensu | 06-09 A9 | có |
| PERSONA-dieu_am | 06-06 §9 | có |
| PERSONA-lama_dakiet | 06-09 B4 | **không** (nháp, chờ tham vấn) |
| PERSONA-te_tuu | 06-07 §9 | có |
| PERSONA-phan_quan | 06-09 C8 | có |
| PERSONA-diatang_su | 06-09 D8 | có |
| PERSONA-vu_y_amau | 06-10 A8 | có |
| PERSONA-lo_ban_su | 06-10 B8 | **không** (chỉ công cụ viết) |
| PERSONA-dinh_menh_hoi | 06-10 C6 | **không** (chỉ công cụ viết) |
| PERSONA-gac_cong | 06-11 A10 | **không** |
| PERSONA-tho_may | 06-11 B10 | **không** |
| PERSONA-dan_dinh | 06-11 C9 | có |
| PERSONA-phuong_si | 06-11 D8 | có |

### 4.2 `NPC-*` (44 NPC phụ + 9 mẫu sinh thủ tục)

- `NPC-thanh-01` … `NPC-thanh-09`
- `NPC-tubinh-01`, `-02`
- `NPC-manh-01`, `-02`
- `NPC-trichthien-01`
- `NPC-cungthong-01`, `-02`
- `NPC-thulau-01`
- `NPC-phongthuy-01`, `-02`
- `NPC-lichduong-01`, `-02`
- `NPC-longho-01`, `-02`
- `NPC-vodang-01`, `-02`
- `NPC-chungnam-01`, `-02`
- `NPC-maoshan-01`, `-02`
- `NPC-yentu-01`, `-02`
- `NPC-buttap-01`, `-02`
- `NPC-tangdia-01`
- `NPC-vanmieu-01`, `-02`
- `NPC-phongdo-01`, `-02`
- `NPC-mieucuong-01`, `-02`
- `NPC-vancoc-01`
- `NPC-conlon-01`
- `NPC-langthang-01`, `-02`
- Mẫu sinh thủ tục: `NPC-GEN-thanh`, `-tubinh`, `-manh`, `-cungthong`, `-phongthuy`, `-lichduong`, `-hanhhuong`, `-mieucuong`, `-phongdo` (06-12 §24)

### 4.3 `BARK-*`

| Dạng | Phạm vi | Số câu |
|---|---|---|
| `BARK-<npc id>-NN` | 20 NPC chính (06-02 … 06-11) | **417** (20–24 câu mỗi NPC; Định Mệnh Hội 22) |
| `BARK-NPC-<region>-NN-k` | 44 NPC phụ (06-12) | 2 / NPC = **88** |

### 4.4 Nhãn cục bộ (không phải mã toàn cục)

Các nhãn sau chỉ có nghĩa trong tài liệu này, tham chiếu từ ngoài dùng dạng `<npc id>:<nhãn>`, ví dụ `van_coc:VC.20`:

- **Nút thoại:** `VC.*`, `KTS.*`, `TB.*`, `TTS.*`, `DA.*`, `TT.*`, `HH.*`, `KD.*`, `MS.*`, `TL.*`, `LM.*`, `PQ.*`, `DT.*`, `VY.*`, `DMH.*`, `LT.*`, `BT.*`, `DD.*`, `PS.*`, `FREE.*`.
- **Kiểm thử:** `AIT-01…14`, `<NPC>-T0n`, nhãn bộ thử đỏ `A01…M20`, kịch bản đa lượt `MT-01…20`.
- **Khác:**
  - bảng `KTS-KET`;
  - trạng thái thế giới `W-*`;
  - cảnh chéo `XN-01…15`;
  - phát hiện `P1…P10`;
  - chỉ số `M-*`;
  - cổng `G-0…4`;
  - bộ lọc `V1…V8`;
  - luật game `G1…G4` (theo bản sơ đồ §6.4).

## 5. Phụ thuộc vào tài liệu khác

| Tài liệu | Cần cung cấp cho 06 | 06 cung cấp cho họ |
|---|---|---|
| 00 Canon | đính chính trụ tháng MAU-A (P1) | — |
| 02 Thế giới | bối cảnh Lỗ Ban × Thiên Mệnh Bàn (đề xuất 06-10 B2) | tiểu sử 20 NPC |
| 03 Cốt truyện | mã `MQ-*`, `SQ-*`, `TL-*`; cảnh lớn | 12 án Định Mệnh Hội, nhiệm vụ của 44 NPC phụ (TBD-03), nút `⟶ SM` cần cờ |
| 04 Chỉ số | lá số `特殊` mẫu (L-DK); trả lời P4, P8, P10 | — |
| 05 Cải mệnh | `DEED-*`, `KARMA-*`, ngưỡng thụ lục, tên «vị thuốc» | bảng thuốc → thánh địa (06-11 C2) |
| 07 Thánh địa | `BLD-*` / `POI-*` cho lịch NPC; danh sách tên công trình cho danh sách trắng V3 | lịch 20 × 12 (06-15 §4) |
| 09 Tu luyện | `MG-*` (kết phù, ngồi tĩnh, Thái Cực, công án, khoa cử, khoa nghi, hát ru) | điểm vào từ cây thoại |
| 10 Xã hội | `EV-*` (trai tiếu, Tết, đêm đếm sao, sửa cầu) | phản ứng NPC W-TET |
| 12 Trình bày | `SFX-*`, `BGM-*`, giao diện khung thoại | ghi chú lồng tiếng 06-18 §4 |
| 13 Kỹ thuật | `TASK-*` | 21 việc (06-15 §6) |
| 14 Rủi ro | `RISK-*`: tham vấn tôn giáo, văn hoá; xác minh đường dây hỗ trợ; ngưỡng tuổi | yêu cầu tham vấn từng NPC |

## 6. Câu hỏi mở

1. **VIP và hạn mức 30 lượt / ngày.** VIP đã bị gỡ khỏi worker («[REMOVED] VIP redeem/vip-gen + PLANS»), nhưng canon và `cosmetics.js` vẫn có `unlock.vip`. Hạn mức VIP dựa vào đâu?
2. **Đường dây hỗ trợ tâm lý.** Danh sách theo quốc gia trong khối khủng hoảng cần được đội vận hành xác minh. Chỉ số 111 (trẻ em) và 115 (cấp cứu) đã chắc.
3. **Nhà cung cấp trong `freePool`.** Groq, NVIDIA… phải được nêu tên trong chính sách quyền riêng tư, vì brief có ngày giờ sinh.
4. **Trụ tháng MAU-A.** Canon ghi «tháng Ngọ», engine ra 辛巳 (P1). Canon cần sửa.
5. **Tòng cách có cứu** (P4) có vào nhánh Dị Cách không?
6. **iOS.** Có cho `composeAnswer` (luận cục bộ) với lá số của chính người chơi không? 06-01 §9.4 đề xuất **không**, vì cùng lý do với `FEATURES.divination`.
7. **Ngưỡng tuổi chế độ thiếu niên** (< 13 / < 18) và cách xác nhận.
8. **Cách đọc canon §5.5:** Vu y bà «mời» Tà Lộ — 06-10 đọc là «chỉ cửa, cảnh báo». 03 có đồng ý?
9. **Tham vấn** cho Lạt-ma Đa Kiệt, Trương Thiên Sư, Diệu Âm, Trúc Lâm, Khâu đạo trưởng, Vu y bà, Trưởng trại trước khi bật AI / dựng 3D.
10. **Giá token thật** của `glm-5.3` để chốt ngân sách (06-01 §9.5 đang dùng giá giả định).

## 7. Checklist nghiệm thu tài liệu

- [x] 20 NPC canon có bible: tiểu sử, ngoại hình, tính cách, xưng hô, ≥ 30 câu mẫu, lịch 12 giờ, thiện cảm, PERSONA, `toolsAllow`, chủ đề cấm, câu rời vai, cây thoại, ≥ 20 bark.
- [x] Sáu người dẫn chính có cây thoại ≥ 40 nút (đếm máy, kể cả nút con và `FREE.*`: VC 68 · KTS 54 · TB 47 · TTS 51 · DA 43 · TT 46).
- [x] ≥ 40 NPC phụ (44) với lá số `makeNpc` thật.
- [x] Bộ thử đỏ ≥ 150 câu (200 câu đơn + 20 kịch bản đa lượt).
- [x] Kế hoạch đánh giá: chỉ số, thang người duyệt, định dạng hồi quy.
- [x] Spec AI: chữ ký `askAI`, thứ tự message, token, schema `gameContext`, bộ lọc, stream, dự phòng, iOS, hạn mức, cache, chi phí, quyền riêng tư.
- [ ] Biên bản tham vấn tôn giáo / văn hoá (chờ 14).
- [ ] Mã `MQ-*` / `SQ-*` / `DEED-*` thay cho TBD (chờ 03, 05).
