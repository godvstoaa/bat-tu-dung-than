# 09 · 44 NPC phụ `NPC-*` với lá số thật và 9 mẫu sinh `NPC-GEN-*`

**Tóm tắt.** Mục này chốt hiện trạng 44 NPC phụ `NPC-*` của docs 06-12: mỗi nhân vật có **lá số thật** sinh qua `makeNpc` (`src/game/npc.js:41`) với muối «#n» và năm gốc `NPC_EPOCH = 2026`; 88 bark (2 câu/NPC); phân bố **32/44 bại cách · 9 Đắc Cứu · 3 Thuận Thiên**. Mục này là **nơi duy nhất** của bản thiết kế nêu con số 32/44 và trích `halls.js:241-265` — mục 01 và mục 08 chỉ trỏ về đây. Gap kỹ thuật được nêu thẳng: `makeNpc` hôm nay chỉ dựng khách vãng lai theo ngày, `NPC_EPOCH` và 9 mẫu sinh `NPC-GEN-*` (06-12 §24) chưa có trong code; mọi nhiệm vụ `SQ-*` ghi **TBD-03**. Đợt này **không AI runtime** cho NPC phụ, wiring dân làng cố định quanh Sơn Môn ghi trạng thái **«chờ mở khóa»** theo mục 15 (22 file khóa).

---

## 09.1 Phạm vi và nguồn dẫn

- **Docs nguồn:** `docs/gdd/06-npc-ai/06-12-npc-phu.md` (44 nhân vật theo vùng + mẫu dân làng sinh thủ tục), `docs/gdd/06-npc-ai/README.md` §4.2–4.3 (không gian tên mã), `06-02-van-coc.md`, `06-07-te-tuu.md`, `06-18-cam-nang-giong.md` (luật giọng và khuôn bark).
- **Code nguồn:** `src/game/npc.js` (makeNpc), `src/game/halls.js` (npcR + 6 sảnh nghề), `src/game/main.js` (hạt giống khách), `src/game/world.js`, `src/game/render3d.js`, `src/game/features.js` (gate AI).
- **Nguyên tắc trích dẫn:** mọi dẫn chứng code trong mục này đã được đọc trực tiếp trong phiên biên soạn (ngày 2026-11-08); mọi số liệu lá số NPC lấy từ bảng tổng hợp của 06-12, vốn là «kết quả chạy engine thật ngày 2026-11-05» (`06-12-npc-phu.md:8`). Không bịa API, không bịa hàm, không sáng chế số liệu.

## 09.2 Hiện trạng theo docs 06-12

### 09.2.1 Lá số thật, muối «#n» và NPC_EPOCH = 2026

Mỗi NPC phụ có lá số thật sinh bằng `src/game/npc.js › makeNpc(key, year)` rồi chạy `chart.js › analyze()` — cùng cách `cases.js` dựng án khách (`06-12-npc-phu.md:8`). Cơ chế này đã có thật trong code: `makeNpc` tại `src/game/npc.js:41` trả về đối tượng khách gồm `{ key, gender, year, month, day, hour, minute, age, fullName, call, job, topic, question, robe }` (`src/game/npc.js:55-59`), và halls đóng gói lá số bằng một dòng: `const npcR = (npc, year) => analyze(npc.year, npc.month, npc.day, npc.hour, npc.minute, npc.gender, year)` (`src/game/halls.js:29`).

Docs đặt ba ràng buộc kỹ thuật tại §1.2 của 06-12:

1. **Năm gốc cố định.** `makeNpc` tính năm sinh bằng `year − (18 + r·55)`; nếu gọi với năm hiện tại thì «năm sinh của NPC sẽ trôi mỗi năm» (`06-12-npc-phu.md:12`). Vì vậy game phải gọi với hằng số `NPC_EPOCH = 2026` — và docs tự ghi rõ trạng thái: **«(chưa có — cần làm)»** (`06-12-npc-phu.md:13`). Kiểm tra bằng lệnh `grep -rn "NPC_EPOCH" src scripts worker` trong phiên biên soạn trả **0 kết quả** — hằng số này chưa tồn tại ở bất kỳ đâu trong code. Tuổi hiển thị vẫn tính theo năm thật (`06-12-npc-phu.md:13`).
2. **Muối «#n».** Khoá `makeNpc` có hậu tố `#n`; hậu tố là «muối» để `makeNpc` trả đúng giới tính và khoảng tuổi mong muốn (đã dò trước). Khoá đầy đủ được **lưu cố định trong bảng dữ liệu, không tính lại** (`06-12-npc-phu.md:14`). Ví dụ thật trong bảng: `NPC-thanh-01#19` (`06-12-npc-phu.md:30`), `NPC-phongthuy-02#2` (`06-12-npc-phu.md:48`), `NPC-conlon-01#6` (`06-12-npc-phu.md:71`).
3. **Chỉ lấy ngày giờ sinh và giới tính.** Tên, nghề, câu hỏi do `makeNpc` sinh **bị thay** bằng tên, vai thiết kế ở docs; chỉ giữ ngày giờ sinh và giới tính (`06-12-npc-phu.md:15`). Đây là điểm phân biệt cốt lõi với khách vãng lai: khách vãng lai dùng nguyên cả gói `makeNpc` (tên + nghề + câu hỏi sinh ngẫu nhiên), còn NPC phụ dùng `makeNpc` **như một máy đổ xúc xắc có kiểm soát** cho phần mệnh, còn phần người thì biên kịch viết tay.

### 09.2.2 Bark: 2 câu mỗi NPC, 88 câu tổng

Bảng `BARK-*` của README phân hai lớp: 20 NPC chính có 417 câu bark (20–24 câu mỗi NPC; Định Mệnh Hội 22), còn **44 NPC phụ có 2 câu/NPC = 88 câu**, dạng `BARK-NPC-<region>-NN-k` (`docs/gdd/06-npc-ai/README.md:143-148`; quy ước mã bark của 06-12 tại `06-12-npc-phu.md:23`). Bark của NPC phụ là **chuỗi tĩnh** kèm điều kiện hiển thị viết ngay trong docs, ví dụ `BARK-NPC-thanh-01-2 (G:Hợi) «Khóa cổng đây! Ai về muộn gõ ba tiếng.»` (`06-12-npc-phu.md:99`), `BARK-NPC-thanh-07-2 (W:gió) «Chặn giấy lại, gió bay mất chữ.»` (`06-12-npc-phu.md:171`). Ký hiệu `(G:...)` là khung giờ, `(W:...)` là điều kiện môi trường — đây chính là nền tảng cho thiết kế «bark theo giờ (tĩnh)» ở §09.6.

### 09.2.3 Phân bố Mệnh Cách: 32/44 bại cách

Bảng tổng hợp lá số của 06-12 cho thấy phân bố: «**32/44 bại cách (Nghịch Thiên), 9 Đắc Cứu, 3 Thuận Thiên**. Mẫu nhỏ, chọn theo giới và tuổi, không phải thống kê dân số» (`06-12-npc-phu.md:77`). Kiểm đối bằng đếm trực tiếp các hàng của bảng (`06-12-npc-phu.md:30-71`):

- **9 Đắc Cứu:** `NPC-thanh-01` (`06-12-npc-phu.md:30`), `NPC-thanh-06` (`06-12-npc-phu.md:35`), `NPC-manh-02` (`06-12-npc-phu.md:42`), `NPC-phongthuy-02` (`06-12-npc-phu.md:48`), `NPC-lichduong-02` (`06-12-npc-phu.md:50`), `NPC-vodang-01` (`06-12-npc-phu.md:53`), `NPC-chungnam-02` (`06-12-npc-phu.md:56`), `NPC-yentu-02` (`06-12-npc-phu.md:60`), `NPC-mieucuong-01` (`06-12-npc-phu.md:68`).
- **3 Thuận Thiên:** `NPC-phongthuy-01` Thợ cả Đoàn Mộc (`06-12-npc-phu.md:47`), `NPC-yentu-01` Chú tiểu Tâm Nhiên (`06-12-npc-phu.md:59`), `NPC-conlon-01` Người giữ Thiên Trì «Thủy Kính» (`06-12-npc-phu.md:71`).
- **Không một NPC nào ra Dị Cách** (`特殊`) — «Phương sĩ Vô Danh vì vậy là gương duy nhất cho người chơi Dị Cách» (`06-12-npc-phu.md:78`).

Docs tự diễn giải ý nghĩa narrative của con số 32/44: «Game tận dụng: thế giới đầy người «lá số xấu» sống tử tế, đúng trụ cột T2» (`06-12-npc-phu.md:77`). Hai gương ngược/đúng được docs chỉ định làm đòn bẩy: Thợ cả Đoàn Mộc (75 điểm, Thuận Thiên) là người thợ lương thiện, «gương ngược của Công Thâu Nghiệt (bại cách, thành yểm sư)» (`06-12-npc-phu.md:83`); Ngược lại, Cu Tí 19 tuổi bại cách từng bị một thầy quầy bảo «số làm thuê suốt đời», tin luôn, thôi học — nhiệm vụ của cậu là **học lại** (`06-12-npc-phu.md:106`); Tiểu đạo Minh Khê bại cách nhưng được Sơn Môn nhận, là «bằng chứng sống cho TB.33» (`06-12-npc-phu.md:178`).

### 09.2.4 Bảng nhóm ID theo README:120-140

Danh sách ID **chép đúng** `docs/gdd/06-npc-ai/README.md:120-140`, gom thành 4 nhóm để đỡ dài mà không mất một ID nào:

| Nhóm | ID (đúng README.md:120-140) | Số lượng | Vùng gắn (06-12 §3–§23) |
|---|---|---|---|
| N1 · Huyền Thành | `NPC-thanh-01` … `NPC-thanh-09` | 9 | Huyền Thành (`thanh`, 06-12:87) |
| N2 · 14 cặp vùng `01+02` | `NPC-tubinh-01`, `-02` · `NPC-manh-01`, `-02` · `NPC-cungthong-01`, `-02` · `NPC-phongthuy-01`, `-02` · `NPC-lichduong-01`, `-02` · `NPC-longho-01`, `-02` · `NPC-vodang-01`, `-02` · `NPC-chungnam-01`, `-02` · `NPC-maoshan-01`, `-02` · `NPC-yentu-01`, `-02` · `NPC-buttap-01`, `-02` · `NPC-vanmieu-01`, `-02` · `NPC-phongdo-01`, `-02` · `NPC-mieucuong-01`, `-02` | 28 | Tử Bình Phong, Manh Phái Cốc, Cùng Thông Hồ, Phong Thủy Viên, Lịch Đường, Long Hổ Sơn, Võ Đăng, Chung Nam, Mao Sơn, Yên Tử, Bút Tháp, Văn Miếu, Phong Đô, Miêu Cương (06-12:199-641) |
| N3 · 5 NPC đơn | `NPC-trichthien-01` · `NPC-thulau-01` · `NPC-tangdia-01` · `NPC-vancoc-01` · `NPC-conlon-01` | 5 | Trích Thiên Đỉnh, Thư Lâu Lâm, Tạng Địa, Am Vân Cốc, Côn Lôn Thiên Trì (06-12:255-673) |
| N4 · Lang thang | `NPC-langthang-01`, `-02` | 2 | Không cố định — «riêng `langthang` (lang thang) cho NPC không cố định» (06-12:7) |
| **Tổng** | | **44** | = 9 + 28 + 5 + 2 |

Ghi chú đếm chéo: nhóm N2 gồm đúng 14 cặp (2 × 14 = 28); cộng N1 (9), N3 (5), N4 (2) được 44 — khớp bảng §4.2 của README (`README.md:118-140`). Trong số 44 có **4 NPC gắn vai Định Mệnh Hội** — «Thầy» Quách Toàn (`NPC-thanh-05`, 06-12:137), «Phong thủy sư» Triệu Sát (`NPC-phongthuy-02`, 06-12:329), Hắc Phù Lão (`NPC-maoshan-02`, 06-12:469), «Cò» Lưu Nhanh (`NPC-langthang-02`, 06-12:687) — chi tiết này dẫn về quy tắc của §24 tại `06-12-npc-phu.md:729`: kẻ lừa **luôn** là NPC viết tay có kiểm duyệt, NPC sinh thủ tục không bao giờ được gắn vai Định Mệnh Hội.

## 09.3 CHỦ SỞ HỮU DUY NHẤT — sảnh Cách Cục chỉ lọc khách «normal», đối lập 32/44 bại cách

> **Quy ước sở hữu:** mục 09.3 này là **nơi duy nhất** trong toàn bộ bản thiết kế NPC-AI nêu lập luận «sảnh Cách Cục chỉ lọc khách normal (halls.js:241-265) đối lập GDD 06-12: 32/44 bại cách» và trích `halls.js:241-265`. Mục 01 (tổng quan) và mục 08 (giọng nói) khi chạm tới chủ đề này **chỉ trỏ về đây** («xem 09 §09.3»), không nhắc lại số liệu.

### 09.3.1 Code nói gì — đọc trực tiếp `halls.js:241-265`

Hàm dựng khách sảnh Cách Cục nằm tại `src/game/halls.js:241-265` (`buildCachCuc`). Nội dung đã đọc trong phiên:

```js
// src/game/halls.js:241-247 (trích nguyên văn)
export function buildCachCuc(key, today = new Date()) {
  const year = today.getFullYear();
  let npc, R;
  for (let i = 0; i < 20; i++) {
    npc = makeNpc(`cc:${key}:${i}`, year); R = npcR(npc, year);
    if (R.pattern?.type === 'normal' && GE_GODS.includes(R.pattern.geShen?.god) && R.pattern.pref) break;
  }
```

Bộ lọc nằm ở điều kiện break (`src/game/halls.js:246`): khách sảnh Cách Cục buộc phải có `R.pattern?.type === 'normal'` **và** cách thần thuộc 8 cách thần `GE_GODS` (Chính Quan, Thất Sát, Chính Tài, Thiên Tài, Chính Ấn, Thiên Ấn, Thực Thần, Thương Quan — `src/game/halls.js:238`) **và** có bảng hỷ dụng `pref`. Hàm thử tối đa 20 hạt giống `cc:${key}:${i}` (`src/game/halls.js:245`) — nếu cả 20 hạt đều không ra cách thường thì khách là hạt cuối, tức có thể lọt nhánh khác; nhưng thiết kế rõ ràng là **dò để gặp cách thường**, đúng ghi chú của bảng điểm danh: «Thử tối đa 20 hạt giống để ra khách có cách thường + cách thần trong GE_GODS».

Hệ quả trực tiếp: **khách procedural vào sảnh Cách Cục không bao giờ là bại cách có chủ đích**. Câu hỏi mở màn của khách thậm chí khẳng định trước mình có cách: `ask: "Lá số tôi là ${P.vi}. Thầy xem cách này thành hay bại, có cứu ứng không, nên đi đường nào?"` (`src/game/halls.js:263`) — nhưng với khách bị lọc `normal`, phần «thành hay bại» của án gần như đã bị trả lời từ lúc chọn hạt giống. Các bước án (`Cách thần` → `Thuận/nghịch dụng` → `Tương thần (dụng)` → `Kỵ thần phá cách`, `src/game/halls.js:252-261`) không có bước **cứu ứng**, nên cả sảnh không dạy được nửa sau của bài học cách cục: bệnh ở đâu, thuốc ở đó.

### 09.3.2 Đối lập với 32/44 bại cách của GDD

Đặt cạnh nhau:

| Chiều | Dữ liệu | Nguồn |
|---|---|---|
| Thế giới trong docs | 32/44 NPC phụ là bại cách; 9 Đắc Cứu; 3 Thuận Thiên | `06-12-npc-phu.md:77` |
| Thế giới trong code (sảnh Cách Cục) | Khách dò tới khi `pattern.type === 'normal'` — bại cách bị loại khỏi sảnh định cách | `src/game/halls.js:246` |
| Người giữ sảnh | Lão Kỷ, thủ thư sảnh Cách Cục, 60 tuổi, Ngũ Linh Căn, **bại cách** | `06-12-npc-phu.md:206` |

Mâu thuẫn ở hàng cuối là mâu thuẫn đẹp nhất: người **giữ** sảnh Cách Cục là bại cách («Tôi giữ sách, không giữ người» — `06-12-npc-phu.md:206`), trong khi **khách** vào sảnh bị lọc loại bại cách. Sảnh định cách của game chưa kể được chuyện của đúng nhóm nhân vật đông nhất trong thiết kế thế giới (32/44), và cũng chưa gặp nổi chính chủ của nó là Lão Kỷ với tư cách khách giải án.

### 09.3.3 Đề xuất: mở lọc cho bại cách CÓ HẬU (Đắc Cứu)

Đề xuất sửa **một điều kiện**, không đổi kiến trúc builder:

- Giữ nguyên vòng dò 20 hạt và nhánh ưu tiên `normal` (phần lớn ngày vẫn ra khách cách thường — sảnh này dạy lấy nguyệt lệnh định cách, cần mẫu chuẩn).
- Thêm nhánh dự phòng rõ ràng: nếu cần xen bài học «cách có bệnh có thuốc», dò hạt theo điều kiện `patternQuality` là **Đắc Cứu** (有救) — bại cách có cứu ứng, đúng nhánh thứ hai của bộ 4: Thuận Thiên (成格) · Đắc Cứu (有救) · Nghịch Thiên (败格) · Dị Cách (特殊), nguồn `patternQuality.quality` (thuật ngữ thống nhất của bản thiết kế, mục 00).
- **Không** mở cho Nghịch Thiên thuần (bại không cứu): các bước án hiện tại (`halls.js:252-261`) chưa có bước cứu ứng, đưa khách bại không cứu vào là dựng án không có lời giải — vi phạm nguyên tắc «mọi nhận định kèm một việc người chơi làm được».
- Khi thêm khách Đắc Cứu, thêm một bước án «Cứu ứng» (tìm vị thuốc của cách theo nhóm `shi/cai/yin/guan/bi` — thuật ngữ «bệnh ở đâu thuốc ở đó», 06-11 C2/C6) trước bước `Kỵ thần phá cách`.
- Số phận lọc này gắn với cùng một vấn đề Wiring ở §09.6: sửa `halls.js` là sửa code đợt này **chưa làm**, chỉ chốt thiết kế; thực hiện khi mục 15 mở khóa.

Đề xuất này **chỉ được nêu tại đây**; mục 01/08 khi nói về sảnh Cách Cục trỏ về 09 §09.3.

## 09.4 Gap kỹ thuật: `makeNpc` hôm nay chỉ dựng khách theo ngày

### 09.4.1 Khách vãng lai — hạt giống ngày · khe · người chơi

Toàn bộ NPC trong code hiện tại là khách vãng lai đổi theo ngày: `todayNpc` trong `src/game/main.js:51-60` đặt hạt giống `${d}:${i}:${pid}` cho 3 khe chờ sân (ngày · khe · người chơi) — `npcs = [0, 1, 2].map((i) => makeNpc(`${d}:${i}:${pid}`))` tại `src/game/main.js:56`. Mỗi sảnh nghề tự đặt hạt riêng: Điều Hậu dùng `dh:${key}:${i}` (`src/game/halls.js:58`), Cách Cục dùng `cc:${key}:${i}` (`src/game/halls.js:245`); các sảnh còn lại gọi `npcR(npc, year)` sau khi dựng npc riêng (`src/game/halls.js:155` cho cặp hợp hôn, `src/game/halls.js:185`, `src/game/halls.js:213` cho Tử Vi/Tượng Pháp). Vị trí gắn vào thế giới: `world.js:28-30` ba khe «Khách hỏi việc»; `world.js:50` sảnh Cách Cục; nút mở tại `stations.js:710` (`cachcuc: openHall('cachcuc', 'Hôm nay đã định cách cho khách.')`); hình 3D khách chờ dựng tại `render3d.js:237-248` (nhóm `an0/an1/an2` với dấu ❓ vàng xoay).

Nghĩa là: **không có dân làng cố định nào trong code**. Mỗi lần đổi ngày, mọi khách là người mới; hạt giống chứa ngày nên không tồn tại một «Bà Hai Nhạn» hay «Cu Tí» đứng nguyên vị trí qua các ngày.

### 09.4.2 Ba mảng thiếu so với thiết kế 06-12

1. **`NPC_EPOCH = 2026` chưa có** — `grep -rn "NPC_EPOCH" src scripts worker` = 0 kết quả (đã chạy trong phiên; docs cũng tự ghi «chưa có — cần làm» tại `06-12-npc-phu.md:13`).
2. **Bảng 44 khoá «#n» chưa có trong code** — bảng tổng hợp lá số (`06-12-npc-phu.md:26-73`) và 88 bark chỉ nằm trong docs.
3. **9 mẫu sinh `NPC-GEN-*` chưa có trong `npc.js`** — `src/game/npc.js` (đọc trọn 60 dòng trong phiên) chỉ có `hashSeed`, `rng`, `pick`, `shuffle`, bộ tên/nghề/câu hỏi và `makeNpc`; không có hàm hay bảng nào tên `NPC-GEN-*`, không có logic «thoại ghép ba phần» của 06-12 §24. Bảng khung ở §09.5 dưới đây là bản chép đúng docs, đánh dấu **chưa cài**.

### 09.4.3 Nhiệm vụ `SQ-*`: TBD-03, không sáng chế

Nhiệm vụ của 44 NPC phụ là mã `SQ-<region>-xx` do tài liệu 03 cấp; docs 06-12 tự ghi «ở đây ghi «TBD-03» kèm tên làm việc» (`06-12-npc-phu.md:21`) và bảng phụ thuộc của README ghi đúng vị trí đó: «nhiệm vụ của 44 NPC phụ (TBD-03)» (`docs/gdd/06-npc-ai/README.md:172`). Do đó **toàn bộ** các chỗ cần nhiệm vụ trong mục này (và các mục trỏ về đây) ghi `TBD-03` làm placeholder — việc thiện/ác tương ứng ghi theo `DEED-*` của 05 cũng đang TBD-05 (`06-12-npc-phu.md:22`). Không tự chế mã `SQ-...` cụ thể trong bản thiết kế này.

## 09.5 Bảng 9 mẫu sinh `NPC-GEN-*` (khung — chép đúng 06-12 §24)

> **Ghi chú bắt buộc:** bảng dưới là **khung**. Chi tiết đầy đủ từ **06-12 §24** (`06-12-npc-phu.md:701-731`) — **chép đúng, không sáng chế**. Mục đích của §24: «lấp đầy đường phố bằng người có lá số thật mà không cần viết tay» (`06-12-npc-phu.md:703`). Trạng thái: **chưa có trong `npc.js`** (§09.4.2).

**Cách sinh chung** (`06-12-npc-phu.md:705-712`): khoá `NPC-GEN-<region>-<slot>-<YYYYMMDD>` — đổi người mỗi ngày, cùng người trong ngày; gọi `makeNpc(key, NPC_EPOCH)` — tên, giới, tuổi giữ nguyên từ `makeNpc`, nghề lấy từ bảng; **thoại ghép từ ba phần**: (1) câu chào theo giờ, (2) câu theo nghề, (3) câu theo **chính lá số của NPC**, với ba mẫu câu lá số đã định sẵn: điểm < 36 → «Người ta bảo số tôi vất vả. Mà tôi vẫn sống tốt đấy thôi.»; Dụng = hành của ngày hôm nay → «Hôm nay người tôi khoẻ lạ.»; năm nay phạm Thái Tuế → «Năm nay tôi phạm Thái Tuế. Đi chậm thôi.» (`06-12-npc-phu.md:709-712`).

| # | Mẫu sinh | Input | Output |
|---|---|---|---|
| 1 | `NPC-GEN-thanh` | Khoá `NPC-GEN-thanh-<slot>-<YYYYMMDD>` → `makeNpc(key, NPC_EPOCH)`; nghề chọn theo tuổi như `QUESTIONS.age` của `npc.js` | Vùng Huyền Thành; nghề: bán rau, thợ rèn, phu kiệu, học trò, bà bán xôi; câu nghề: «Rau sáng nay tươi lắm.» · «Sắt nguội thì không rèn được.» · «Xôi gấc, xôi đỗ đây.» (06-12:716) |
| 2 | `NPC-GEN-tubinh` | Cùng khuôn, vùng `tubinh` | Tử Bình Phong; nghề: học trò, chép sách, quét sảnh; câu nghề: «Tàng can khó quá.» · «Chép sai một chữ là chép lại cả trang.» (06-12:717) |
| 3 | `NPC-GEN-manh` | Cùng khuôn, vùng `manh` | Manh Phái Cốc; nghề: người kể chuyện mù, dắt đường, bán nhạc cụ; câu nghề: «Nghe tiếng mưa đi, mưa nói nhiều lắm.» (06-12:718) |
| 4 | `NPC-GEN-cungthong` | Cùng khuôn, vùng `cungthong` | Cùng Thông Hồ; nghề: ngư dân, bán cá, lái đò; câu nghề: «Cá đây! Mới kéo lưới.» (06-12:719) |
| 5 | `NPC-GEN-phongthuy` | Cùng khuôn, vùng `phongthuy` | Phong Thủy Viên; nghề: thợ xây, thợ mộc, người làm vườn; câu nghề: «Cửa nhà ai kêu thì gọi tôi.» (06-12:720) |
| 6 | `NPC-GEN-lichduong` | Cùng khuôn, vùng `lichduong` | Lịch Đường; nghề: bà mối, người xem lịch, học trò lịch; câu nghề: «Hôm nay tiết gì nhỉ?» (06-12:721) |
| 7 | `NPC-GEN-hanhhuong` | Cùng khuôn, phủ 4 vùng hành hương | Long Hổ, Võ Đăng, Yên Tử, Bút Tháp; nghề: khách hành hương; câu nghề: «Lên lễ cho mẹ.» · «Còn bao nhiêu bậc?» (06-12:722) |
| 8 | `NPC-GEN-mieucuong` | Cùng khuôn, vùng `mieucuong`; **chỉ NPC ≥ 18 có lá số; trẻ con là hoạt cảnh không lá số** | Miêu Cương; nghề: người làm rẫy, thợ dệt, trẻ con; câu nghề: «Lúa trên rẫy chín rồi.» (06-12:723) |
| 9 | `NPC-GEN-phongdo` | Cùng khuôn, vùng `phongdo`; chỉ hoạt cảnh (ngồi, đứng), **không thoại cá nhân hoá** — tránh mô tả cái chết cá nhân | Phong Đô; «người lạc»; câu nghề: (không có) (06-12:724) |

**Ba ràng buộc cứng của dân làng sinh thủ tục** (`06-12-npc-phu.md:726-731`) — không ngoại lệ:

1. Không NPC sinh thủ tục nào nói câu tiêu cực về **lá số của người chơi** (`06-12-npc-phu.md:728`).
2. Không NPC sinh thủ tục nào được gắn vai Định Mệnh Hội; kẻ lừa luôn là NPC viết tay, có kiểm duyệt (`06-12-npc-phu.md:729`).
3. Câu «số tôi vất vả» chỉ dùng cho NPC có điểm thật < 36. Không bịa (T1) (`06-12-npc-phu.md:730`).

Danh sách 9 mẫu này khớp chính xác dòng liệt kê của README: `NPC-GEN-thanh`, `-tubinh`, `-manh`, `-cungthong`, `-phongthuy`, `-lichduong`, `-hanhhuong`, `-mieucuong`, `-phongdo` (06-12 §24) (`docs/gdd/06-npc-ai/README.md:141`). Lưu ý khác biệt tên: mẫu thứ 7 là `-hanhhuong` (không phải `-longho`) — nó **phủ** bốn vùng hành hương; mẫu `-phongdo` cố ý không có thoại riêng.

## 09.6 Wiring đợt này — «chờ mở khóa»

### 09.6.1 Định hướng: dân làng cố định spawn quanh Sơn Môn, bark theo giờ (tĩnh)

Hướng wiring được chốt như sau, đúng đề bài của mục này:

- **Dân làng cố định spawn quanh Sơn Môn.** 44 NPC có lá số thật là dân cố định (khác khách vãng lai đổi theo ngày ở §09.4.1); đợt đầu chỉ bật nhóm quanh Sơn Môn để giới hạn phạm vi kiểm thử: gợi ý đợt một là `NPC-thanh-08` Minh Khê — đệ tử trực Bàn Thầy, bại cách được Sơn Môn nhận (`06-12-npc-phu.md:178`), `NPC-thanh-09` Chấp sự Hà Cẩn quản sổ khách Sơn Môn (`06-12-npc-phu.md:185`), `NPC-tubinh-01` Lão Kỷ thủ thư sảnh Cách Cục với lịch Thìn–Dậu ở sảnh (`06-12-npc-phu.md:208`).
- **Bark theo giờ — tĩnh.** Bark là chuỗi văn bản cố định trong bảng dữ liệu, chọn hiển thị theo điều kiện đã ghi sẵn trong docs: `(G:Hợi)` khung giờ Hợi (`06-12-npc-phu.md:99`), `(W:gió)` thời tiết (`06-12-npc-phu.md:171`), `(sau nhiệm vụ)` cờ tiến độ (`06-12-npc-phu.md:135`, `06-12-npc-phu.md:223`). Không có lời nào do model sinh runtime. Lịch trong ngày của NPC đã có sẵn trong docs dưới dạng cột «Lịch» (ví dụ Lão Kỷ «Thìn–Dậu ở sảnh Cách Cục · Tuất đọc sách dưới đèn», `06-12-npc-phu.md:208`; Đàn Tam «Thìn–Ngọ ngồi gốc đa đầu cốc · Mùi nghỉ · Thân–Dậu kể chuyện · Tuất kéo đàn», `06-12-npc-phu.md:236`) — bark theo giờ tra thẳng từ lịch này.
- **KHÔNG AI runtime trong đợt này.** Ba lý do, đều có nguồn:
  1. **Quota:** luồng AI của app giới hạn 30 call/phút/IP tại worker (`worker/index.js:159-163`, khóa KV `airl:*` theo dữ liệu nền của bản thiết kế); 44 dân làng bark liên tục không thể và không nên gọi LLM.
  2. **Chưa có nhiệm vụ:** `SQ-*` đang TBD-03 (`README.md:172`) — chưa có kịch bản nhiệm vụ nào để AI phục vụ.
  3. **Định hướng đã chốt trong docs:** NPC phụ «**chỉ chạy kịch bản**» (`06-12-npc-phu.md:19`). Con đường AI duy nhất mà docs cấp cho NPC phụ là người chơi nhờ Thầy Tử Bình luận lá số của họ qua khung `openMaster` với `subject.kind = 'khach'`, «khi nhiệm vụ cho phép» (`06-12-npc-phu.md:19`) — con đường này **không bật** trong đợt này. Nhất quán với hai luật nền: game chạy trọn khi AI tắt (06-01 §2, K1/K2) và gate `FEATURES.ai = !IOS` (`src/game/features.js:20`).
- **Bark phải chạy được cả khi AI tắt:** mọi bark, kể cả bark «theo lá số NPC» của NPC-GEN (§09.5), là chuỗi ghép tĩnh từ dữ liệu engine tính sẵn — không stream, không mạng, không phụ thuộc `FEATURES.ai`.

### 09.6.2 Điểm spawn nằm ở 3 file thuộc nhóm khóa — đánh dấu «chờ mở khóa»

Điểm sinh và neo nhân vật trong thế giới nằm ở ba nơi:

| Việc wiring | Nơi trong code | Trạng thái |
|---|---|---|
| Khai báo vị trí/nhãn trạm | `src/game/world.js` (mẫu đã có: `world.js:50` sảnh Cách Cục, `world.js:28-30` ba khe khách) | **CHỜ MỞ KHÓA** |
| Dựng hình 3D + neo vị trí | `src/game/render3d.js` (mẫu đã có: khối khách chờ `an0/an1/an2` tại `render3d.js:237-248`; người bán Tàng Y Các `render3d.js:234-236`) | **CHỜ MỞ KHÓA** |
| Vòng cập nhật theo ngày/hạt | `src/game/main.js` (`todayNpc`, `main.js:51-60`) | **CHỜ MỞ KHÓA** |

Cả ba file trên thuộc **nhóm 22 file khóa theo mục 15 của bản thiết kế**, nên mọi việc wiring của đợt này ghi trạng thái **«chờ mở khóa»**: không sửa code, không thêm trạm, không đụng vị trí. Thiết kế chỉ chốt (a) cấu trúc dữ liệu (bảng 44 khoá + 88 bark + bảng NPC-GEN), (b) pseudo-code dựng NPC cố định (§09.8), (c) thứ tự bật khi mở khóa.

**Thứ tự bật khi mở khóa** (mỗi bước có nghiệm kiểm riêng, chạy bằng test node trước khi chạm 3D):

| Bước | Việc | Nghiệm |
|---|---|---|
| 1 | Thêm `NPC_EPOCH = 2026` vào `src/game/npc.js` | `grep NPC_EPOCH src/game/npc.js` có 1 kết quả; `makeNpc(k, NPC_EPOCH)` cho cùng `k` hai lần ra cùng năm sinh |
| 2 | Thêm bảng 44 khoá «#n» + 88 bark thành module thuần có test node (khuôn `gu-gongan.js`/`namhan.js`/`kinh-tu.js`) | test node so khớp từng khoá với cột «Khoá makeNpc» của `06-12-npc-phu.md:26-73`; đếm bark = 88 |
| 3 | Thêm 9 mẫu sinh `NPC-GEN-*` theo §09.5 | test node kiểm ràng buộc §24: NPC-GEN không ĐMH, không chê lá số người chơi, câu «số tôi vất vả» chỉ khi điểm < 36 |
| 4 | Spawn nhóm quanh Sơn Môn trong `world.js` + `render3d.js` | chụp khung nhìn khu Sơn Môn đối chiếu vị trí |
| 5 | Chọn bark theo giờ từ cột «Lịch» của 06-12 | replay 24 giờ giả lập, mỗi khung giờ đúng bark `(G:...)` |
| 6 | Mở `subject.kind = 'khach'` cho openMaster (đợt sau, khi có `SQ-*`) | bộ thử đỏ nhóm hỏi-ve-lá-số-khách |

## 09.7 Luật giọng cho 32 bại cách

### 09.7.1 Lựa chọn narrative, không phải thiên tai

Con số 32/44 là **lựa chọn thiết kế có chủ đích** («Mẫu nhỏ, chọn theo giới và tuổi» — `06-12-npc-phu.md:77`), phục vụ trụ «thế giới đầy người «lá số xấu» sống tử tế». Luật giọng theo đó là: khắc nghiệt về **số liệu** (điểm thấp, thân nhược, bại cách được nói thẳng), nhân văn về **thái độ** — không thương hại, không an ủi suông, không «khổ số». Chuẩn mực docs đã viết sẵn:

- Khuôn mở bark bại cách số **17**: «**Mệnh do ta tạo**» — câu gốc của Vân Cốc khi gặp lá số thấp: «LÁ SỐ THẤP (điểm dưới 46 hoặc bại cách): mở bằng «Mệnh do ta tạo». … Không thương hại, không an ủi suông» (`docs/gdd/06-npc-ai/06-02-van-coc.md:217`).
- Khuôn mở bark bại cách số **22**: «**Đất xấu thì móng sâu**» — câu gốc của Tế tửu (ông cũng bại cách): «Lá số trò là cái nền đất. Chí là cái nhà. Đất xấu thì móng sâu. Không ai bảo đất xấu thì đừng xây» (`docs/gdd/06-npc-ai/06-07-te-tuu.md:96`).
- Gương người chơi-fan tương ứng: Phùng Vy — bại cách, Phàm Căn 26 điểm, bị Định Mệnh Hội bảo «học vô ích, mua cách giả» — nói đúng luật giọng: «Cách bại là bệnh của cách, không phải lệnh cấm học» (`06-12-npc-phu.md:218-221`).

### 09.7.2 Các cấm trong bark bại cách

Áp dụng 06-18 (§1 độ dài, §4 giọng vùng, §5 đối tượng, §6 bark):

- **≤ 90 ký tự** mỗi bark (06-18 §1).
- **Không bark doạ**, **không bark chê** — đặc biệt không chê lá số xấu của người chơi (06-18 §6); áp thêm ràng buộc §24: NPC thủ tục không nói tiêu cực về lá số người chơi (`06-12-npc-phu.md:728`).
- **Không «khổ số»**: không than mệnh kiểu «kiếp này số nghèo», không tự nhận nạn nhân định mệnh — vì đúng giáo thuyết mà game chống: Định Mệnh Hội rao «mệnh đã định»; bark NPC phụ phải là phản đề, không phải phiên bản buồn của lời rao đó. Từ cấm chung của các persona áp dụng (không «đã định», không «chắc chắn», không doạ nghiệp báo).
- Câu «số tôi vất vả» chỉ được dùng khi **điểm thật < 36**, không bịa (T1) (`06-12-npc-phu.md:730`).
- Bark của NPC Định Mệnh Hội trong bộ 44 (§09.2.4) tắt khi người chơi khủng hoảng — luật chung của phe phản diện (06-18 §5, mục 08 trỏ về 09 §09.7 khi cần dẫn chứng bark cụ thể).

## 09.8 Pseudo-code `makeNpcFixed('#thanh-01')`

Pseudo-code dưới đây **dán được vào code thật** (biến chưa chốt đặt `{{ten_bien}}`), đúng ba ràng buộc của 06-12 §1.2. Trạng thái: thiết kế — **chưa cài, chờ mở khóa** (§09.6.2).

```js
// docs/npc-ai/09-npc-phu-44.md — pseudo-code: NPC phụ CỐ ĐỊNH (khác khách vãng lai theo ngày)
// Nguồn: src/game/npc.js:41 (makeNpc), src/game/halls.js:29 (npcR), docs 06-12 §1.1-1.2.
// Trạng thái: CHỜ MỞ KHÓA — mục 15 (22 file khóa): world/render3d/main không sửa đợt này.

const NPC_EPOCH = 2026; // 06-12:13 «chưa có — cần làm». Ghi chú: chưa tồn tại trong src
                        // (grep -rn "NPC_EPOCH" src scripts worker = 0 kết quả, phiên 2026-11-08).

// Bảng khoá cố định — chép ĐÚNG cột «Khoá makeNpc» của 06-12 §2 (06-12:26-73), không tính lại muối.
const NPC_FIXED = {
  // 'thanh-01': { salt: '#19', gender: 'nữ', ten: {{ten_theo_bang_06_12}}, role: {{vai_thiet_ke_06_12}} },
  // ... đủ 44 khoá: thanh-01..09, 14 cặp 01+02, trichthien-01, thulau-01, tangdia-01,
  //                vancoc-01, conlon-01, langthang-01+02  (README.md:120-140)
};

export function makeNpcFixed(id, today = new Date()) {
  const m = NPC_FIXED[id];
  if (!m) return null;                                   // ID lạ → từ chối, không dò muối lúc chạy
  // Năm gốc cố định NPC_EPOCH → năm sinh KHÔNG trôi mỗi năm (06-12:12-13).
  const npc = makeNpc(`${id}${m.salt}`, NPC_EPOCH);      // makeNpc — src/game/npc.js:41
  return {
    id,
    key: npc.key,                                        // «thanh-01#19» — muối #n (06-12:14)
    gender: npc.gender,                                  // chỉ lấy giới tính (06-12:15)
    year: npc.year, month: npc.month, day: npc.day, hour: npc.hour, minute: npc.minute,
    age: today.getFullYear() - npc.year,                 // tuổi hiển thị theo năm thật (06-12:13)
    name: m.ten, role: m.role,                           // TÊN/VAI THAY theo bảng 06-12 (06-12:15)
    bark: {{BARK_NPC_region_NN_k_2_cau}},                // 2 câu/NPC = 88 — README.md:148, chuỗi TĨNH
    chart: analyze(npc.year, npc.month, npc.day, npc.hour, npc.minute, npc.gender, NPC_EPOCH),
    // chart.js › analyze() — cùng cách npcR đóng gói ở halls.js:29 và 06-12:8 mô tả
  };
}
```

Điểm khác biệt bắt buộc với khách vãng lai, để người cài không nhầm: (1) khoá chứa **muối `#n` lưu cố định**, không có ngày/người chơi trong khoá; (2) gọi với `NPC_EPOCH`, không phải `new Date().getFullYear()` như mặc định của `makeNpc` (`src/game/npc.js:41`); (3) `fullName`, `job`, `question` của `makeNpc` **vứt**, thay bằng tên/vai bảng 06-12 (`06-12-npc-phu.md:15`).

## 09.9 Ba bark mẫu bại cách — đúng luật ≤ 90 ký tự

Ba mẫu dưới đây là **khuôn soạn** bark bại cách cho NPC phụ (mở đúng khuôn 17/22 của §09.7.1); bark thật của 44 NPC vẫn dùng 88 câu đã chép trong 06-12.

```text
1) «Mệnh do ta tạo. Giếng khô thì đào sâu, đào tới khi gặp nước.»
2) «Đất xấu thì móng sâu. Móng móc hôm nay là nhà mai có nhà.»
3) «Người ta bảo số tôi vất vả. Mà lưới rách tôi vá, lưới liền tôi thả.»
```

Kiểm luật từng câu (kết quả đo bằng script đếm ký tự trong phiên biên soạn — xem Phụ lục):

| # | Khuôn mở | Độ dài | Luật đã kiểm |
|---|---|---|---|
| 1 | 17 «Mệnh do ta tạo» (nguồn câu: `06-02-van-coc.md:217`) | 60 | có việc làm cụ thể (đào giếng); không doạ, không chê ai, không «khổ số» |
| 2 | 22 «Đất xấu thì móng sâu» (nguồn câu: `06-07-te-tuu.md:96`) | 57 | hình ảnh thợ cả Đoàn Mộc — làm thay than; không an ủi suông |
| 3 | câu lá số §24 của NPC-GEN, dùng đúng điều kiện điểm thật < 36 (`06-12-npc-phu.md:730`) | 67 | nói về lá số CỦA NPC (không phải người chơi — an toàn với ràng buộc `06-12-npc-phu.md:728`); kết là hành động (vá lưới, thả lưới) |

## 09.10 Bản đồ dẫn chiếu — mục khác trỏ về đây

| Nội dung | Nơi DUY NHẤT được nêu | Mục khác trỏ kiểu |
|---|---|---|
| Số 32/44 bại cách · 9 Đắc Cứu · 3 Thuận Thiên + bảng đếm theo hàng | **09 §09.2.3** | «phân bố 44 NPC phụ: xem 09 §09.2.3» |
| Lập luận sảnh Cách Cục lọc `normal` (halls.js:241-265) + đề xuất mở Đắc Cứu | **09 §09.3** | «gap sảnh Cách Cục: xem 09 §09.3» |
| Bảng 44 ID nhóm (README:120-140) | **09 §09.2.4** | «danh sách ID: xem 09 §09.2.4» |
| Bảng 9 mẫu sinh `NPC-GEN-*` | **09 §09.5** (khung; chi tiết gốc 06-12 §24) | «mẫu sinh: xem 09 §09.5» |
| Quyết KHÔNG AI runtime cho NPC phụ + lý do quota/nhiệm vụ | **09 §09.6.1** | «AI runtime NPC phụ: xem 09 §09.6.1» |
| Khuôn bark bại cách 17/22 + cấm «khổ số» | **09 §09.7** | «luật giọng bại cách: xem 09 §09.7» |

Áp dụng: mục 01 (tổng quan NPC-AI) khi đếm nhân vật chỉ viết «44 NPC phụ (32/44 bại cách) — chi tiết tại 09 §09.2»; mục 08 (giọng nói) khi nói bark bại cách chỉ viết «khuôn 17/22 — chi tiết tại 09 §09.7».

## 09.11 Checklist lời dặn biên kịch

| Dặn | Băng đóng ở đâu trong mục này |
|---|---|
| (a) không AI runtime cho NPC phụ | §09.6.1 — ba lý do có nguồn; con đường AI duy nhất (`subject.kind = 'khach'`) không bật đợt này |
| (b) bark bại cách không thương hại/doạ | §09.7.2 + §09.9 (ba mẫu đo ký tự, kiểm luật từng câu) |
| (c) ID chép đúng README:120-140 | §09.2.4 — bảng nhóm có dòng đếm chéo 9 + 28 + 5 + 2 = 44 |
| (d) SQ-* ghi TBD | §09.4.3 — toàn bộ vị trí nhiệm vụ ghi TBD-03; DEED-* TBD-05; không chế mã |
| (e) nơi duy nhất nêu 32/44 + halls.js:241-265 | §09.3 đầu mục có khung «Quy ước sở hữu»; §09.10 bản đồ trỏ về |

---

## Phụ lục A · Lệnh đã chạy trong phiên biên soạn (2026-11-08)

1. `grep -rn "NPC_EPOCH" src scripts worker` → **0 kết quả** (xác nhận gap §09.4.2).
2. `grep -n "makeNpc(" src/game/main.js` → dòng 56 (`npcs = [0, 1, 2].map((i) => makeNpc(\`${d}:${i}:${pid}\`))`).
3. `grep -n "npcR" src/game/halls.js src/game/cases.js src/game/npc-deep.js` → `halls.js:29` (đóng gói `analyze`), `halls.js:58/155/185/213/245` (các sảnh dựng R).
4. `grep -n "^## \|^### " docs/gdd/06-npc-ai/06-12-npc-phu.md` → 24 mục §1-§24, tên vùng đủ 21 nhóm.
5. `grep -n "Mệnh do ta tạo\|Đất xấu\|khuôn" docs/gdd/06-npc-ai/06-12-npc-phu.md 06-18-cam-nang-giong.md 06-07-te-tuu.md 06-02-van-coc.md` → câu khuôn gốc tại `06-02-van-coc.md:217` và `06-07-te-tuu.md:96`.
6. Đọc trực tiếp: `src/game/npc.js` (trọn 60 dòng), `halls.js:228-268`, `README.md:100-186`, `06-12-npc-phu.md` (§1, §2 trích, §4, §5, §24 trọn), `features.js:16-24`, `render3d.js:234-250`, `main.js:48-62`.
7. `node -e` đo ký tự 3 bark mẫu §09.9 (tính theo code point): bark 1 = **60**, bark 2 = **57**, bark 3 = **67** — đều ≤ 90 (06-18 §1).

Điều **chưa xác minh được** trong phiên (ghi thẳng, không bù số liệu đoán): (a) danh sách đầy đủ 22 file khóa của mục 15 — chỉ có danh mục rút gọn trong dữ liệu nền (`state.js`, `stations.js`, `ai.js`, `master-ui.js`); (b) bark của 32 NPC bại cách chưa được đọc từng câu một trong phiên — chỉ đọc trích các bark đã dẫn ở §09.2.2; phần đối chiếu trọn bộ 88 câu là việc của mục 08 khi mở khóa.
