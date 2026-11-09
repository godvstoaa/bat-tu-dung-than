# 01 · Tổng quan bản thiết kế và hiện trạng 39 thực thể NPC

> Bộ thiết kế NPC-AI Huyền Quán — mục 01/16 (phần nền). Ngày chốt: 2026-11-08.
> Bản này thay bản nháp trước: bản nháp trước đếm 37 thực thể và thiếu 2 trạm công cụ có thật trong code (La Bàn Đài, Bảng Lịch Ngày); bản chốt sửa lại thành **39 thực thể** và đặt **bảng thực thể duy nhất** của cả bộ ở §2.

## Tóm tắt

Mục 01 làm bốn việc. Một: nêu mục đích — biến 20 persona bible của `docs/gdd/06-npc-ai/06-02…06-12` thành bản thiết kế wire được vào code, bám chốt Q1 «giữ cái đã code, cắt cái chưa code» và Q3/Q4 của `docs/GAME-THIET-KE-CHOT.md`. Hai: chốt hiện trạng **39 thực thể = 20 persona canon GDD + 19 thực thể có thật trong code** (§2), với bảng 5 cột là bảng duy nhất của cả bộ — mục 05 chỉ nhóm tóm tắt và nâng cấp, không lặp bảng. Ba: nêu gap chính giữa bible và code (§3) và chốt phạm vi đợt theo 22 file khóa của `GAME-THIET-KE-CHOT.md:42` (§4). Bốn: xếp loại 39 thực thể theo cơ chế giọng nói (§5), đưa khung pseudo-code module thuần PERSONA (§6) và sơ đồ tổng thể + ba trạng thái vận hành online / mất mạng / kill-switch — chi tiết offline/SW ở mục 12 (§7). Ba mẫu bắt buộc của mục 01 nằm đủ trong file này: bảng 39 thực thể, khung pseudo-code, sơ đồ ba trạng thái.

## 1. Mục đích của bản thiết kế NPC-AI

Bible nhân vật đã xong: 20 persona canon nằm trong `docs/gdd/06-npc-ai/06-02…06-12` (06-02…06-11 là 20 persona đơn, 06-12 là nhóm gộp 44 NPC phụ), mỗi persona có giọng, giới hạn, mẫu thoại và bark riêng. Nhưng bible chỉ là tầm nhìn tham khảo theo đúng chốt Q3/Q4 của `GAME-THIET-KE-CHOT.md`: bộ gdd 14 tập là tài liệu định hướng, còn bản thiết kế hiện hành phải **bám cái đã code** — Thầy AI qua `askAI` + `checkNeo` + `suggestFollowups` ở `master-ui.js`, khách NPC sinh từ hạt giống mỗi sảnh, `npc-deep.js › npcDeep(R, year)` luận «Năm nay». Vì thế mục đích của cả bộ là **dịch bible sang bản thiết kế wire được vào code**: với từng persona phải trả lời được ba câu — treo vào thực thể in-code nào (bảng §2), đi qua cơ chế giọng nào (bảng §5), và nhượng bộ nguyên tắc chạy nào (§4).

Chốt Q1 «giữ cái đã code, cắt cái chưa code» (`GAME-THIET-KE-CHOT.md:57`) áp thẳng vào thoại NPC theo ba hướng. Thứ nhất, **giữ**: khung «Thầy luận» AI đã có (`master-ui.js:32`), khách procedural sinh mỗi ngày đã có (`npc.js:41`, `main.js:56-57`), «Đường Thầy» 3 tab đã có và có test (`gu-gongan.js` / `namhan.js` / `kinh-tu.js`, `scripts/test-game-thay-mo-rong.mjs` 13 đạt). Thứ hai, **cắt khỏi thoại**: cảnh giới 6 bậc, Tiên Thiên/Hậu Thiên, hệ số Nghịch Thiên, tim tâm ma — bốn thứ này chỉ tồn tại trong `GAME-AAA` §9.1, chưa một dòng code nào, nên không NPC nào được nhắc như thứ «đã có trong game»; thang «tu» chính thức là thông thạo nghề + danh hiệu theo nghề (GAME-NOI-DUNG §3), ngự kiếm chỉ gọi là phương tiện đi lại, không phải tu luyện (GAME-NOI-DUNG §6). Thứ ba, **không cam kết thừa**: không ghi «20 persona đã chạy runtime», không hứa gameContext, toolsAllow khi chưa có (toolsAllow chỉ tồn tại như thẻ cấu hình của bible và spec cơ chế chưa-code ở mục 04 §4.4.4 — không tuyên bố đã wire); không hứa điện/tượng mới (Q2/Q5 — chỉ 5 `deity_*` GLB đã dựng tại `world.js:62-74` là thật).

Ba luật chạy xuyên suốt được nhắc lại ngay từ mục này để mọi hồ sơ 17–36 sau không phải giải thích lại: **AI chỉ nói không làm** — mọi phần thưởng, thiện cảm, cờ, tiến độ do máy trạng thái quyết, câu «hứa thưởng» bị lọc V1; **dữ liệu trước, giọng sau (T5)** — NPC chỉ nói điều có thật trong brief `buildChartBrief` và công cụ được phép, nói sai phải nhận theo giọng nhân vật; **không phán định mệnh (T2)** — mọi nhận định về tương lai là «xu hướng, không phải bản án» và kèm một việc người chơi làm được. Cả ba luật này là PERSONA-CHUNG luật 2–4 (06-01 §13, README §2) và không thuộc diện được đảo bởi bất kỳ hồ sơ nào.

## 2. Hiện trạng: 39 thực thể = 20 persona canon + 19 thực thể in-code

### 2.1 Cách đếm và bản sửa so với bản nháp trước

Bản nháp trước của mục này đếm 37 thực thể và **thiếu 2 trạm công cụ có thật trong code**: **La Bàn Đài** (`world.js:22` — `compass: ['La Bàn Đài', 'Xem la bàn hướng nhà']`) và **Bảng Lịch Ngày** (`world.js:25` — `lich: ['Bảng Lịch Ngày', 'Xem lịch hôm nay']`). Hai trạm này là trạm tương tác thật, không phải đồ cảnh: `features.js:11` đưa cả hai id (`compass`, `lich`) vào mảng `ALL` của mọi trạm mở được, và `court.js:8` ghi rõ sơ đồ sân «cánh Tây (Trà Thất, Ống Xăm), cánh Đông (La Bàn Đài, Bảng Lịch)». Kết chỉnh: **37 + 2 = 39, khớp data nền** của phiên duyệt. Cả bốn dẫn chứng (`world.js:22`, `world.js:25`, `features.js:11`, `court.js:8`) đã được kiểm lại bằng lệnh `grep -n` trong phiên viết ngày 2026-11-08, khớp đúng số dòng.

Phân rã 39: **20 persona canon GDD** (06-02…06-11 — Vân Cốc, Khổng tiên sinh, Thầy Tử Bình, Trương Thiên Sư, Diệu Âm, Tế tửu Văn Miếu, Huyền Hư, Khâu đạo trưởng, Mao Sơn đạo nhân, Trúc Lâm, Lạt-ma Đa Kiệt, Phán quan Thôi, Địa Tạng sứ giả, Vu y bà A Mậu, Yểm sư Lỗ Ban, Định Mệnh Hội, Lão Tùng, Bà Tư thợ may, Đan Đỉnh, Phương sĩ) + **19 hàng in-code**. Cách tách 19 hàng in-code theo đúng cách liệt kê của đặc tả: hai trạm công cụ mỗi trạm một hàng; «3 khe chờ an0-an1-an2» tách thành 3 hàng vì đây là 3 spot đứng riêng tại `court.js:47-49` và 3 lượt vòng lặp tại `main.js:56-57`; «khách 4 sảnh nghề» gộp một hàng (bốn id riêng được nêu trọn trong ô ID); các thực thể còn lại mỗi thực thể một hàng. Cộng lại: 17 nhóm của đặc tả, tách khe thành 3 (+2) → **19 hàng in-code**; 20 + 19 = **39 hàng**.

### 2.2 Bảng 39 thực thể (BẢNG DUY NHẤT của cả bộ)

Quy tắc chống trùng của bản này: bảng dưới đây là **bảng duy nhất** điểm danh cả 39 thực thể. Mục 05 («NPC đã có trong code») chỉ nhóm tóm tắt và nâng cấp, trỏ về đây, không lặp bảng. Mọi hồ sơ khác chỉ dẫn tới một hàng của bảng này bằng ID.

**Nhóm A — 20 persona canon GDD (docs-only, chưa wire):**

| ID | Tên | Vai | Hiện trạng code (file:line) | Mục liên quan |
|---|---|---|---|---|
| `van_coc` | Vân Cốc (thiền sư) | dẫn đạo chính — am Vân Cốc, phản định mệnh luận mềm («Tuổi lão tăng là chuyện nhỏ») | docs-only, chưa wire — 06-02; grep id = 0 (§3) | hồ sơ 17–36; khung mục 04–05 |
| `khong_tiensinh` | Khổng tiên sinh | dẫn đạo chính — phản đề «định mệnh luận», câu hỏi ngược KTS-KET | docs-only, chưa wire — 06-03 | hồ sơ 17–36; bộ lọc V8 mục 06 |
| `thay_tubinh` | Thầy Tử Bình (đạo hiệu Bình Tâm) | dẫn đạo chính — giữ Bàn Thầy; CHÍNH LÀ «Thầy» vô danh đang có trong game | docs-only bản tên tuổi — 06-04; bản in-code xem hàng `thay` | hồ sơ 17–36; mục 04–05 |
| `truong_thiensu` | Trương Thiên Sư | dẫn đạo chính — đạo thống Chính Nhất; phù chỉ ký tự hư cấu Huyền Giới | docs-only, chưa wire — 06-05 | hồ sơ 17–36; an toàn mục 10–11 |
| `dieu_am` | Ni sư Diệu Âm | dẫn đạo chính — sám hối kèm việc sửa («Đếm được thì bớt được») | docs-only, chưa wire — 06-06 | hồ sơ 17–36; an toàn mục 10–11 |
| `te_tuu` | Tế tửu Văn Miếu (Chu Văn Trinh) | dẫn đạo chính — lập chí, đạo hiệu, khoa cử; nhân vật hư cấu | docs-only, chưa wire — 06-07 | hồ sơ 17–36 |
| `huyen_hu` | Huyền Hư chân nhân (Võ Đăng) | phụ sảnh Võ Đăng — ngồi, thở, đếm; có điểm dừng | docs-only, chưa wire — 06-08 mục A | hồ sơ 17–36; an toàn mục 10–11 |
| `khau_daotruong` | Khâu đạo trưởng (Chung Nam) | phụ sảnh Chung Nam — nghiêm, ngắn, chính xác | docs-only, chưa wire — 06-08 mục B | hồ sơ 17–36 |
| `maoshan_daonhan` | Mao Sơn đạo nhân (Mao Tiểu Tùng) | phụ sảnh Mao Sơn — trừ tà theo thứ tự chính tông | docs-only, chưa wire — 06-08 mục C | hồ sơ 17–36; an toàn mục 10–11 |
| `truclam_thiensu` | Thiền sư Trúc Lâm (Yên Tử) | phụ sảnh Yên Tử — thoại cực ngắn («Núi ở trong lòng») | docs-only, chưa wire — 06-09 mục A | hồ sơ 17–36 |
| `lama_dakiet` | Lạt-ma Đa Kiệt | phụ Tàng Địa — bản nháp CHỜ THAM VẤN, không nạp runtime | docs-only, khóa cố ý — 06-09 mục B | hồ sơ 17–36; an toàn mục 10–11 |
| `phan_quan` | Phán quan Thôi | phụ Phán Đồ — đọc sổ, không viết, không doạ | docs-only, chưa wire — 06-09 mục C | hồ sơ 17–36 |
| `diatang_su` | Địa Tạng sứ giả | phụ Tàng Địa — «Bạn muốn đi lên chưa?» | docs-only, chưa wire — 06-09 mục D | hồ sơ 17–36 |
| `vu_y_amau` | Vu y bà A Mậu (Miêu Cương) | bàng môn — vai còn tranh chấp canon (mời/chỉ cửa Tà Lộ) | docs-only, chưa wire — 06-10 mục A | hồ sơ 17–36; chất lượng mục 06–07 |
| `lo_ban_su` | Yểm sư Lỗ Ban | phản diện — CHỈ kịch bản, không bao giờ chạy AI | docs-only — 06-10 mục B | hồ sơ 17–36; an toàn mục 10–11 |
| `dinh_menh_hoi` | Định Mệnh Hội | tổ chức phản diện — 12 án lừa, không chạy AI | docs-only — 06-10 mục C | hồ sơ 17–36; an toàn mục 10–11 |
| `gac_cong` | Lão Tùng (gác cổng Sơn Môn) | cửa ngõ — tutorial tất định, không AI | docs-only, chưa wire — 06-11 mục A | hồ sơ 17–36; procedural mục 08–09 |
| `tho_may` | Bà Tư thợ may | cửa ngõ — kịch bản, đứng cạnh giá tiền Tàng Y Các | docs-only, chưa wire — 06-11 mục B | hồ sơ 17–36; hàng `tailor-tangy` |
| `dan_dinh` | Đan Đỉnh chân nhân (Cát Huyền) | cửa ngõ — CÓ chạy AI; «bệnh ở đâu thuốc ở đó» | docs-only, chưa wire — 06-11 mục C | hồ sơ 17–36; chất lượng mục 06–07 |
| `phuong_si` | Phương sĩ Vô Danh | cửa ngõ — CÓ chạy AI; ví von sông nước | docs-only, chưa wire — 06-11 mục D | hồ sơ 17–36; chất lượng mục 06–07 |

**Nhóm B — 19 hàng in-code (thực thể có thật, dẫn dòng thật):**

| ID | Tên | Vai | Hiện trạng code (file:line) | Mục liên quan |
|---|---|---|---|---|
| `thay` | Thầy vô danh (Bàn Thầy Tử Bình) | nhân vật chính — khung «Thầy luận» AI, tự chấm Neo mỗi câu trả lời | `stations.js:146` (openThay); `master-ui.js:32`; `render3d.js:205-210`; `court.js:76` | mục 04–05; hồ sơ `thay_tubinh` |
| `que` | Thầy Giải Quẻ | Chính Điện — bàn gieo 5 phép + «Đường Thầy» 3 tab | `world.js:85`; `stations.js:717-725`; `que-ui.js:130/180/192-193` | mục 02–03; P0-1 Đường Thầy |
| `loban_dai` | La Bàn Đài | trạm tương tác cánh Đông — «Xem la bàn hướng nhà» | `world.js:22`; `features.js:11`; `court.js:8` | mục 05 (đề xuất nâng cấp) |
| `bang_lich` | Bảng Lịch Ngày | trạm tương tác cánh Đông — «Xem lịch hôm nay» | `world.js:25`; `features.js:11`; `court.js:8` | mục 05 (đề xuất nâng cấp) |
| `an0` | Khe chờ khách hỏi việc 1 | khách procedural — hàng chờ giải án 6 bước, sinh theo hạt giống | `npc.js:41` (makeNpc); `main.js:56-57` (hạt giống `ngày:khe:pid`) | mục 08–09 |
| `an1` | Khe chờ khách hỏi việc 2 | khách procedural — spot đứng thứ hai trong 3 spot sân | `court.js:47-49` | mục 08–09 |
| `an2` | Khe chờ khách hỏi việc 3 | khách procedural — dấu ❓→✓; khe chẵn thương nhân / khe lẻ dân làng | `render3d.js:239-248` (và 787-816) | mục 08–09 |
| `hophon-guests` | Cặp Hợp Hôn | 1 cặp/ngày, cả quán cùng án — «Án chung hôm nay: cả quán cùng nhận cặp…» | `halls.js:144-176`; `case-ui.js:472` (thanks riêng) | mục 08–09 |
| `dieuhau-guest` · `tuvi-guest` · `tuongphap-guest` · `cachcuc-guest` | Khách 4 sảnh nghề (Điều Hậu · Tử Vi · Tượng Pháp · Cách Cục) | khách procedural 1 người/sảnh/ngày, 75% khách Điều Hậu bị kéo lệch khí hậu | `halls.js:51-90` / `182-205` / `210-233` / `241-265`; `world.js:45/48/49/50` | mục 08–09 (chi tiết từng sảnh) |
| `trach-guest` | Khách Trạch Nhật (Lịch Đường) | chọn ngày cho 6 việc gắn tuổi (cưới, khai trương, nhập trạch, động thổ, ký kết, xuất hành) | `zheri-case.js:39-44`; `case-ui.js:370` | mục 08–09 |
| `duongtrach-guest` | Khách Dương Trạch (Phong Thủy Viên) | xem nhà — hướng cửa, kê giường, 3 mẫu gắn số đo cửa | `dz-case.js:55-59`; `case-ui.js:457` | mục 08–09 |
| `xam-hoang-dai-tien` | Hoàng Đại Tiên (Ống Xăm) | thần mượn ống xăm nói — chấp nhận thẻ bằng keo, 3 lượt | `stations.js:295-394` | mục 05 |
| `huong` | Lư Hương (giọng tĩnh tâm) | trạm 1 câu tĩnh tâm mỗi lần đốt — pool 14 câu | `stations.js:399-434`; `names.js:10-25` | mục 05 |
| `tra` | Trà Thất (người rót vô hình) | trạm ngồi tĩnh thở, chấm phút, 6 loại trà mở theo Phúc Khí | `stations.js:501-558` | mục 05 |
| `sen` | Hồ Sen (đèn hoa đăng) | trạm thả điều ước, đèn trôi hiện lại hôm sau | `stations.js:563-584`; `render3d.js:728` | mục 05; đèn chung MMO mục 13 |
| `tailor-tangy` | Người bán Tàng Y Các | NPC cảnh CÂM — đứng quầy, cúi chào khi khách lại gần; mua bán qua wardrobe-ui | `render3d.js:234-236`; `wardrobe-ui.js:22` | mục 05; vị trí hồ sơ `tho_may` |
| `thaitue` | Vị Thái Tuế năm nay | danh tính dân gian của năm — điện xướng tên tướng quân theo hoa giáp, luật kiêng động thổ | `vanmenh-ui.js:96-127`; `thaitue.js:9-10` | mục 06–07 |
| `vanmenh-gates` | Vận Mệnh Các | bia + 9 cổng đại vận của chính người chơi, mời Thầy luận | `world.js:86-93`; `vanmenh-ui.js:44/69/90` | mục 06–07 |
| `deities-statues` | Tượng thần 4 điện (Tam Thanh, Văn Xương, Đẩu Mẫu, Lão Quân) | NPC cảnh CÂM — GLB trên bàn thờ ba cấp quay ra cửa | `world.js:62-74`; `interior.js:79` | mục 05; chốt Q2 |

### 2.3 Ghi chú đọc bảng

Ba điểm cần nói rõ để người duyệt không phải đoán. **Một**, các hàng nhóm A có ô «hiện trạng code» ghi `docs-only` — nghĩa là bible đủ ở `docs/gdd/06-npc-ai/06-02…06-11` nhưng chưa có model 3D, bàn thoại hay PERSONA nào cắm vào chuỗi chạy; bằng chứng grep xem §3. **Hai**, hai thực thể câm (`tailor-tangy`, `deities-statues`) không thiếu thoại một cách ngẫu nhiên: chúng là NPC cảnh theo thiết kế, và vị trí người bán Tàng Y Các chính là chỗ dự định đặt Bà Tư thợ may (06-11, «đứng cạnh giá tiền») — chỉ cần đặt tên + 2-3 câu mời hàng. **Ba**, đề xuất nâng cấp cho 2 trạm công cụ: La Bàn Đài và Bảng Lịch Ngày hiện câm hoàn toàn; bản thiết kế đề xuất cho mỗi trạm **bark 1 câu hướng dùng** khi người chơi nhấc la bàn / mở bảng — thuần tĩnh, không AI, chi tiết nhóm và nâng cấp ở mục 05. Ngoài 39 hàng trên, nhóm gộp **44 NPC phụ `NPC-*`** (06-12) không được đếm thành một hàng của bảng 39 vì đây là NHÓM 44 thực thể sinh procedural (muối `#n` cho `makeNpc`), hiện chưa wire dân làng cố định — `makeNpc` tại `npc.js:41` mới chỉ dựng khách theo ngày; toàn bộ chuyện nhóm này ở mục 09.

## 3. Gap chính giữa bible và code

**Gap 1 — không một persona canon nào đã wire.** Lệnh kiểm tra: `grep -rnE 'PERSONA|van_coc|khong_tiensinh' src/ worker/` (bản duyệt đã chạy; phiên viết chạy lại ngày 2026-11-08). Kết quả của phiên viết: `src/game` và `worker/` trả **0 dòng**; các dòng trúng đều nằm trong `src/engine` + `src/brain` và là chuỗi con không liên quan (`PERSONAL`, `PERSONALITY`, `PERSONALIZED` — ví dụ `brain.js:272`, `daily-briefing.js:298`, `bazi-diet.js:2`, các bảng `*_PERSONALITY` của `kb.js`) hoặc là persona GENERIC của engine: chuỗi header `▌PERSONA «thầy» (độc lập, quyết đoán, KHÔNG nịnh)` tại `ai.js:153` (đúng như bản duyệt trúng) và `PERSONA_RULES` của lớp chống thao túng tại `anti-manipulation-data.js:340`. Không một id canon nào (`van_coc`, `khong_tiensinh`, …) xuất hiện. Kết luận: 20 bible vẫn là tài liệu; chuỗi «PERSONA «thầy»» ở `ai.js:153` là persona ông thầy chung của chuỗi AI, không phải không gian tên `PERSONA-*` của bộ 06 — nhân diện nhầm hai thứ này là gap dễ mắc nhất.

**Gap 2 — Thầy trong code vẫn vô danh.** Nhân vật tại Bàn Thầy mở đầu bằng «Thầy đặt bút xuống, ngẩng lên: «Khách muốn xem cho ai?»» (`stations.js:150` — kiểm lại trong phiên, khớp dòng) và chưa có tên, chưa có lịch 12 giờ, thiện cảm, bark ngoài giờ; docs 06-04 định gọi «Thầy Tử Bình» với `PERSONA-thay_tubinh` nhưng cả hai chưa cắm vào `master-ui.js`. Đây là việc wire đầu tiên của lộ trình vì Bàn Thầy là nơi mọi NPC khác dẫn khách về («hỏi về vận hạn mời về Bàn Thầy ở Sơn Môn» — 06-18 §3).

**Gap 3 — khách procedural nghèo nội dung.** Khách mỗi ngày chỉ có 7 mẫu câu hỏi gốc rơi theo tuổi (`npc.js:23-31`; kiểm lại: mẫu «đổi việc» ở dòng 24, «chuyển nhà» ở dòng 30) và cảm ơn 3 mức chung cho mọi khách (`case-ui.js:236` — «Thầy luận rõ ràng quá, cảm ơn thầy!» / «Cảm ơn, tôi hiểu thêm được nhiều.» / «Cảm ơn, để tôi ngẫm thêm.»); cặp Hợp Hôn có đúng 1 intro + 1 ask + 1 thanks (`halls.js:162` và `case-ui.js:472`); Thư Viện là sảnh duy nhất không có khách (`halls.js:119`, `npc: null`). Khách không tự nói bằng AI — khung «Hỏi Thầy» sau án của khách gọi đúng Thầy AI chung qua các cửa vào `case-ui.js:239/373/460/509` (mẫu `if (!FEATURES.ai || !R) return null`). Ba mảnh để bám khi nâng: lá số thật của khách, danh xưng + nghề theo tuổi (`npc.js:33-38`), cảm ơn theo điểm — lập luận đầy đủ ở mục 08-09.

**Gap 4 — sảnh Cách Cục.** Bộ lọc khách chỉ nhận normal, không bao giờ ra khách bại cách, đối lập GDD 06-12 «32/44 phụ là bại cách» — lập luận ở mục 09, mục này không lặp.

## 4. Phạm vi đợt này: danh sách khóa, module thuần, hai nguyên tắc chạy

**Danh sách file khóa đợt này** chốt tại `docs/GAME-THIET-KE-CHOT.md:42` (§0.3, đợt vá bug) — chép đủ 22 file, không viết tắt: `net.js`, `protocol.js`, `worker/quan-room.js`, `render3d.js`, `landmarks.js`, `obstacles.js`, `accessories.js`, `effects.js`, `world.js`, `characters.js`, `main.js`, `state.js`, `stations.js`, `interior.js`, `game.css`, `cosmetics.js`, `cases.js`, `case-ui.js`, `master-ui.js`, `vanmenh.js`, `vanmenh-ui.js`, `thaitue.js`. Đếm đúng 22. Hệ quả trực tiếp với NPC-AI: thêm sảnh/trạm mới bắt buộc đụng `world.js`/`stations.js` (cả hai khóa — `GAME-THIET-KE-CHOT.md:39`) nên bản này **không thêm trạm**; đợt này **không ghi `deskLog`** (Q7 — `state.js` khóa), nội dung mới chấm đúng/sai ngay trong panel.

**`ai.js` KHÔNG nằm trong danh sách 22 file khóa** — nhưng mọi việc đụng chuỗi AI (đưa PERSONA vào `askAI`, bộ lọc V8 câu hỏi ngược Khổng, style theo NPC) không thuộc phạm vi đợt nội dung này mà nằm ở lộ trình tích hợp, xem mục 15. Nhắc lại cho khỏi hiểu sai: «không khóa» ≠ «đợt này đụng».

**Nội dung mới đặt trong module thuần có test node**, khuôn theo `gu-gongan.js` / `namhan.js` / `kinh-tu.js`: module không DOM, trả object để UI render, luật thiết kế viết ngay ở header comment. Test chuẩn kèm theo là `scripts/test-game-thay-mo-rong.mjs` — **13 test đạt**. Đã chạy lại trong phiên viết ngày 2026-11-08 bằng lệnh `node scripts/test-game-thay-mo-rong.mjs`: kết quả «Đường Thầy — 13 test đạt», mã thoát 0, bao gồm cả mốc «que-ui.js import được trong node (module graph không vỡ sau khi thêm 3 tab)».

**Hai nguyên tắc chạy.** (K1+K2) **AI chỉ nói không làm**: mọi phần thưởng, thiện cảm, cờ, tiến độ do máy trạng thái quyết; câu «hứa thưởng» bị lọc V1; **game chạy trọn khi AI tắt** — toàn bộ án, bark, kịch bản tĩnh vẫn chạy không cần mạng (06-01 §2, PERSONA-CHUNG luật 4, README §2). Ba trạng thái vận hành cụ thể hóa luật này ở §7.

## 5. Bảng phân loại theo cơ chế giọng nói

Bảng này xếp loại **cơ chế tạo giọng** (trạng thái đích của thiết kế), bổ sung cho cách nhóm của mục 05 — không lặp bảng 39 của §2. Bốn nhóm:

| Nhóm | Cơ chế | Thực thể | Ghi chú wire |
|---|---|---|---|
| 1 · Có chạy AI | PERSONA vào chuỗi `askAI` (đi qua `master-ui.js`), neo lá số bằng `checkNeo` | `thay_tubinh` (qua hàng `thay`), `dan_dinh`, `phuong_si` | Hiện chỉ Thầy có khung AI thật (`master-ui.js:32`); Đan Đỉnh và Phương sĩ là chỉ định bible (PERSONA «có» — 06-11 C9/D8), wire theo lộ trình mục 15 |
| 2 · Bark / kịch bản tĩnh | Chuỗi câu cố định, tất định theo ngày, ≤ 90 ký tự, không AI | `gac_cong`, `tho_may`, `lo_ban_su`, `dinh_menh_hoi`; in-code: Hoàng Đại Tiên (`xam-hoang-dai-tien`), Thầy Giải Quẻ (`que`), La Bàn Đài, Bảng Lịch Ngày | Hai trạm công cụ hiện câm → nâng cấp bark 1 câu hướng dùng (§2.3); khung module ở §6 |
| 3 · Kịch bản chờ tham vấn | Không nạp runtime cho tới khi có biên bản tham vấn tôn giáo/văn hoá | `lama_dakiet` (bản nháp đánh dấu «không chạy khi chơi» — README §2 điểm 5, 06-09 B4) | Cổng tham vấn áp cho mọi NPC tín ngưỡng được bật AI/runtime (06-14 §4.1) |
| 4 · Trạm tĩnh không nhân vật | Câu máy / vô thoại, không ai «nói» | `huong`, `tra`, `sen`, người bán Tàng Y Các, tượng thần 4 điện, Vận Mệnh Các (cổng không người), Thái Tuế (persona trạm) | Khách procedural (an0-an2, Hợp Hôn, 4 sảnh, Trạch Nhật, Dương Trạch) nói bằng mẫu kịch bản tĩnh sinh theo hạt giống — không AI trong đợt này, nâng cấp giọng ở mục 08-09 |

Nhóm 1 là nhóm duy nhất đụng chuỗi AI, và vì thế cũng là nhóm duy nhất chịu đủ bộ lọc V1–V8 sau stream (mục 06) + Neo self-check (`master-ui.js:81-87`). Nhóm 2 và 3 chỉ chịu luật an toàn nội dung (mục 10-11) và luật chữ (mục 07) — không cần stream, không cần key, test node được như §6.

## 6. Khung pseudo-code module thuần PERSONA

Khung đề xuất cho module `src/game/npc-personas.js` (hàm) + `src/game/persona-data.js` (dữ liệu) — đường dẫn, kiến trúc dữ liệu và ba export chuẩn (`getPersona` / `personaSystemPrompt` / `personaBark`) chốt DUY NHẤT ở mục 04 §4.4.1; khung dưới chỉ phác Ý NIỆM phụ trợ (bark tất định theo ngày, khóa tham vấn) dựng theo đúng kiến trúc đó — thuần logic, không DOM, không đụng file khóa, test node được theo đúng khuôn `gu-gongan.js` (header luật + import thuần + trả object; `hashSeed` là API có thật, `gu-gongan.js:27` import cùng cách từ `npc.js`). Tên hàm và object là của thiết kế; biến đặt `{{ten_bien}}`; không có giá trị key, không gọi mạng.

```js
// ============================================================================
//  PERSONA NPC-AI — MODULE THUẦN — kiến trúc chuẩn mục 04 §4.4.1:
//  npc-personas.js (hàm) + persona-data.js (dữ liệu); REGISTRY + 3 export chuẩn.
//  (khuôn gu-gongan.js/namhan.js/kinh-tu.js —
//  GAME-THIET-KE-CHOT.md §0.3/Q6: không đụng 22 file khóa, test node được)
//  Luật: AI chỉ nói không làm (06-01 §2); dữ liệu trước giọng sau (T5);
//  không phán định mệnh (T2); bark ≤ 90 ký tự, không bark doạ (06-18 §6).
//  Test: node scripts/test-persona-*.mjs — khuôn test-game-thay-mo-rong.mjs.
// ============================================================================
import { hashSeed } from './npc.js';        // API có thật — gu-gongan.js:27

const REGISTRY = {                           // dữ liệu thật nạp từ persona-data.js — schema 7 trường mục 04 §4.1
  thay_tubinh: {                             // hồ sơ 06-04 → gắn hàng `thay` bảng 39
    ten: 'Thầy Tử Bình', dao_hieu: 'Bình Tâm',
    chay_ai: true,                           // bảng phân loại §5, nhóm 1
    bark_ngoai_gio: ['{{bark_ngoai_gio_1}}', '{{bark_ngoai_gio_2}}'],
    tu_choi_el3: 'Thầy không nói được câu ấy, vì không ai biết chắc.', // 06-19 MT-01
  },
  gac_cong: {                                // 06-11 mục A → bark tĩnh tất định
    ten: 'Lão Tùng', chay_ai: false, kieu: 'tat_dinh',
    bark: ['{{bark_gac_cong_1}}', '{{bark_gac_cong_2}}'],
  },
  lama_dakiet: { ten: 'Lạt-ma Đa Kiệt', chay_ai: false, cho_tham_van: true }, // 06-09 B
};

export function barkChoNgay(id, keyNgay) {   // tất định: cùng ngày → cùng bark
  const p = REGISTRY[id];
  if (!p || p.cho_tham_van) return null;     // khóa tham vấn → không bao giờ nạp
  const pool = p.bark_ngoai_gio || p.bark || [];
  if (!pool.length) return null;
  return pool[hashSeed(p.ten + ':' + keyNgay) % pool.length];
}

export function personaChoAi(id) {           // chỉ nhóm 1 mới có mảnh vào chuỗi AI
  const p = REGISTRY[id];
  return p && p.chay_ai
    ? { giong: '{{doan_persona_3_5_cau}}', cam: ['{{tu_cam_1}}', '{{tu_cam_2}}'] }
    : null;                                  // nhóm 2-4: null — chỉ dùng barkChoNgay
}
```

Ba điểm dán-được: (1) `personaChoAi` trả object thuần để nơi gọi (`master-ui.js` khi mở mục 15) nhét vào message system của `askAI` — module không tự gọi mạng; (2) mọi pool bark lấy qua `hashSeed` nên cùng ngày ra cùng câu, đúng tính tất định yêu cầu cho nhóm cửa ngõ (06-11 A10); (3) `cho_tham_van: true` là công tắc cứng của nhóm 3 — test phải khẳng định `barkChoNgay('lama_dakiet', …)` luôn `null` trước khi có biên bản tham vấn.

## 7. Sơ đồ tổng thể và ba trạng thái vận hành

Sơ đồ vị trí 39 thực thể trong sân Huyền Quán Sơn Môn (vị trí vẽ theo `court.js:8` — cánh Tây/cánh Đông — và `world.js:19-31` nhãn trạm):

```text
┌────────────────────── HỒI QUAN HUYỀN QUÁN (Sơn Môn) ──────────────────────┐
│ Cổng: Lão Tùng (gac_cong — tutorial tất định, chưa wire — hồ sơ 06-11A)  │
│                                                                          │
│ SÂN:  Bàn Thầy (thay · AI)      ❓❓❓ an0 · an1 · an2 (khe chờ)         │
│        cặp Hợp Hôn (án chung)    người bán Tàng Y Các (câm)              │
│  Cánh Tây: Trà Thất · Ống Xăm (Hoàng Đại Tiên) · Lư Hương                │
│  Cánh Đông: La Bàn Đài · Bảng Lịch Ngày   · Hồ Sen (thả đèn)             │
│                                                                          │
│ SẢNH NGHỆ: Điều Hậu · Tử Vi · Tượng Pháp · Cách Cục (1 khách/ngày)       │
│            Lịch Đường (Trạch Nhật) · Phong Thuỷ Viên (Dương Trạch)       │
│                                                                          │
│ ĐIỆN:  Chính Điện Tam Thanh — Thầy Giải Quẻ (Đường Thầy 3 tab)           │
│                       + tượng thần (câm)                                 │
│        Văn Xương · Đẩu Mẫu · Lão Quân (tượng câm)                        │
│        Vận Mệnh Các (bia + 9 cổng) · Thái Tuế Điện (bàn lễ năm)          │
└──────────────────────────────────────────────────────────────────────────┘
```

Ba trạng thái vận hành — cụ thể hóa luật «game chạy trọn khi AI tắt» (K1/K2), chi tiết service worker và hàng đợi offline ở mục 12:

```text
① ONLINE (web, FEATURES.ai = true — features.js:20, kiểm lại trong phiên)
   hỏi Thầy → master-ui.js:65 askAI → engine ai.js stream token (dồn rAF
   master-ui.js:69-72) → bộ lọc V1–V8 (mục 06) → checkNeo «🎯 Neo X%»
   (master-ui.js:81-87) → suggestFollowups ≤ 3-4 chip → hiện câu trả lời.

② MẤT MẠNG / AI LỖI
   composeAnswer() từ nlg.js chay bằng brief đã cache (ai.js:2711-2719,
   2842-2847) + mọi kịch bản tĩnh nhóm 2-4 vẫn chạy → người chơi giải trọn
   án không cần mạng (K1). Chi tiết SW/cache ở mục 12.

③ KILL-SWITCH
   server: KV 'ai:enabled' tắt → 503 → fallback NGAY không retry
   (ai.js:2912-2916); iOS: FEATURES.ai = !IOS → mọi cửa vào trả null
   (stations.js:119, case-ui.js:239/373/460/509, que-ui.js:191,
   vanmenh-ui.js:46) → game thuần kịch bản, không mất chức năng án (K2).
```

Trạng thái ② và ③ là trạng thái **bình thường của NPC nhóm 2-4**: bark, mẫu câu khách procedural, bảng điện xướng Thái Tuế không phụ thuộc mạng từ đầu — đây chính là lý do bảng §5 tách nhóm 1 khỏi phần còn lại.

## 8. Ghi chú đối chiếu tên đề bài và tên docs

Đề bài bản này dùng một số tên sai so với docs; bản chốt lấy **tên docs làm chuẩn**, đối chiếu đủ sáu cặp để khỏi lặp nhầm ở các mục sau: **Vạn Cốc → Vân Cốc** (06-02 — thiền sư Am Vân Cốc), **Không Tiên Sinh → Khổng tiên sinh** (06-03), **Trưởng Thiền Sư → Trương Thiên Sư** (06-05), **Điều Âm → Diệu Âm** (06-06 — ni sư), **Vô Đăng → Võ Đăng** (06-08 — file là `vodang`, sảnh Võ Đăng), **Yên Vũ → Yên Tử** (06-09 — file là `yentu`, sảnh Yên Tử). Hai tên **«Ani Báo» và «Chợ Thạnh» không tồn tại** — lệnh đối chiếu trong data nền của phiên duyệt trả 0 kết quả trên toàn `src/game` + docs; nhãn thật của các trạm sân nằm ở `world.js:19-31` (Bàn Thầy Tử Bình, Trà Thất, La Bàn Đài, Ống Xăm, Lư Hương, Bảng Lịch Ngày, Hồ Sen, Tàng Y Các, Khách hỏi việc). Quy ước của cả bộ: mọi hồ sơ 17-36 và mọi bark đặt tên theo bảng §2, không dùng các tên sai nêu trên.

## 9. Mục lục dẫn chiếu toàn bộ bản thiết kế

Phần nền 01–16: **01** — mục này (tổng quan + bảng 39 thực thể duy nhất); **02–03** — kiến trúc chuỗi AI 3 tầng và hợp đồng dữ liệu/endpoint/rate-limit/cache (đồng bộ số liệu với data nền); **04–05** — khung (04 kien-truc-persona-object, 05 NPC đã có trong code — chỉ nhóm tóm tắt và nâng cấp, trỏ bảng §2, không lặp bảng); **06–07** — chất lượng (bộ lọc hậu xử lý V1–V8 và chất lượng chữ); **08–09** — procedural (khách sinh hạt giống từng sảnh; 09 là hồ sơ nhóm 44 NPC phụ `NPC-*`); **10–11** — an toàn (khủng hoảng, bộ lọc cấm, biên bản tham vấn); **12** — offline/service worker (trạng thái ② §7); **13** — NPC-AI MMO (đèn hồ sen chung, khách MMO); **14** — chi phí/quota/vận hành + chỉ số (gate P0 100%, từ chối thừa ≤ 2%, M-ROLE ≥ 98%); **15** — lộ trình tích hợp (nơi mọi việc đụng `ai.js` — không khóa nhưng không thuộc đợt này — và việc nhét PERSONA nhóm 1 vào `askAI`); **16** — chiến lược test (bộ thử đỏ 200 câu, thử đa lượt MT-01…20).

Hồ sơ 17–36: 20 hồ sơ persona canon, mỗi hồ sơ một persona, đánh số theo đúng thứ tự canon từ 06-02 đến 06-11 (Vân Cốc mở đầu, Phương sĩ Vô Danh kết thúc) — khớp 20 hàng nhóm A của bảng §2. Mọi dẫn chiếu giữa các mục của bản này dùng số mục như trên; mọi dẫn code dùng `file:line` đã kiểm ở §2, §3, §4, §7.
