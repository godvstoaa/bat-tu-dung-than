# 08-25 · Bản iOS và máy yếu: công năng thay thế, mức rút gọn — không bao giờ thành vỏ rỗng

> Luật số 1 áp dụng cho **mọi bản build và mọi mức chất lượng**. Phần này gom về một chỗ: (1) trạm nào bị `features.js` tắt trên iOS và công năng thay thế tương ứng — **cho toàn bộ công trình**, không chỉ hai điện đã nói ở 08-07; (2) công trình «co lại» thế nào ở mức `low` mà vẫn vào được, vẫn có tương tác.

---

## 1. Nguyên tắc iOS

`features.js` hiện tắt trên iOS (`IOS_OFF`): `xam`, `sen`, `que`, `vanbia`, `van0…8`, `thaitue`, cửa / lối ra Vận Mệnh Các và Thái Tuế Điện; `FEATURES.ai = false`. Lý do (ghi trong mã): đã từng bị từ chối 4.3(b) «fortune telling» — iOS tắt mọi cơ chế **bói cho bản thân** (xin xăm, điều ước, gieo quẻ, vận hạn đại vận / Thái Tuế), đổi từ ngữ sang «học».

Ranh giới dùng cho công trình mới (áp cùng tinh thần):

| Được trên iOS (học) | Tắt trên iOS (vận hạn bản thân) |
|---|---|
| Dựng tứ trụ, ngũ hành, cách cục, Tử Vi **của lá số mẫu hoặc của chính mình như bài học cấu trúc** (sảnh Tử Vi, Cách Cục đang bật trên iOS) | Đại vận / lưu niên / Thái Tuế của bản thân; giờ tốt **theo lá số** của bản thân; gieo quẻ, xin xăm, điều ước |
| Kiến thức chung: tiết khí, 12 trực, 28 tú, cửu tinh năm (không cá nhân), phương kỵ năm | «Chọn ngày cho việc **của bạn**» dựa trên năm sinh |
| Đọc cổ thư, Đạo Tạng | Thầy AI luận lá số |

**Luật**: khi một trạm bị tắt, khoang chứa nó **giữ nguyên hình**, đồ đạc liên quan đổi sang công năng thay thế (khai trong `ios` của công thức), và **số trạm không dưới mức hạng** (test T-21).

## 2. Bảng công năng thay thế iOS — toàn bộ

| INT | Trạm bị tắt | Thay bằng | Ghi chú |
|---|---|---|---|
| INT-SM-DIENTAY (Vận Mệnh Các) | `vanbia`, `van0…8`, `vm_menh`, `vm_luunien` | **Tàng Thư Các**: 9 kệ theo `library-data › LAYERS` thay 9 cổng (giữ đường «Vòng Đời» làm đường đọc); bàn 命 → Án Đọc | 08-07 §3.8, 08-16 §3 |
| INT-SM-DIENDONG (Thái Tuế Điện) | `thaitue`, `tt_vach`, `tt_nienbieu` | **Trai Đường**: bàn ăn chay theo tiết (`seasonal-advice`), vách 24 tiết khí | 08-07 §4.7 |
| INT-SM-XAM (Ống Xăm) | `xam` | giữ khối bàn thờ, thay ống xăm bằng **bàn thư pháp** (viết một chữ theo tiết khí — tương tác nhỏ); trạm `huong` cạnh đó vẫn là «Lò Trầm» như `TEXT` iOS hiện có | trạm sân vẫn có tương tác |
| INT-SM-HOSEN (hồ Đông) | `sen` (thả đèn ước) | **cho cá ăn** (tương tác nhỏ như hồ Tây) + trạm học «Sen và tiết khí» (đọc) | |
| INT-SM-CHINHDUONG | `cd_thaydem` (Thầy AI) | Thầy giảng **một bài** theo lá số mẫu (`MAU-A`…) | 08-24 §1 `ios.replace` |
| INT-HS-CHINHDIEN | `que` | **Phòng Học Dịch**: đọc nghĩa quẻ (`iching64-kb.js`), không gieo cho bản thân | 08-10 §1.3 |
| INT-HS-THAPTAY (Án Lục Lâu) | — (án là học) | giữ | |
| INT-LD-DIENDONG (Thời Thần Đường) | phần `best-hour › bestHourToday` theo lá số | chỉ `lucky-hours › luckyHours` (chung, không cá nhân) | 08-11 §4 |
| INT-LD-DAIDIEN (Trạch Nhật Đường) | chọn ngày theo **tuổi người chơi** (`userZhi`) | chọn ngày **cho NPC mẫu** trong án (đã là học) | |
| INT-SM-THAP-* (chuông gió theo hành) | — | giữ: chọn chất liệu chuông theo hành Dụng là **cá nhân hóa trang trí**, không phán vận | duyệt lại khi nộp App Store |
| INT-TT-QUANTINH (12 cung) | — (Tử Vi cấu trúc bật trên iOS) | giữ; **bỏ** lời đọc cung kiểu phán («năm nay cung Tài…») — chỉ đọc cấu trúc | |
| INT-SM-THIENBANG | — | giữ (xếp hạng tiềm lực là chỉ số game) | |
| INT-HT-SAP-06 (Định Mệnh Hội) | — | giữ (bài học chống lừa đảo) | |
| INT-HT-NHA-* (án tại nhà) | — (án là giải cho NPC) | giữ | |
| INT-HT-VANPHONG (đèn Văn Xương «cầu học») | — | đổi chữ «Thắp đèn cầu học» → «Thắp đèn khích lệ học» trên iOS | |

## 3. Mức chất lượng `low` — co lại mà không rỗng

`world3d.js › QUALITY.low`: `treesNear 160`, không bloom, bóng 1024; `POOL_N` 6. Công trình ở `low`:

| Hạng mục | `mid` | `low` | Không bao giờ bỏ |
|---|---|---|---|
| Vỏ | `shell.glb` (tex 1024) | `shell.glb` tex 512 (bản `.lod` khi > 40 m) | ô cửa đã khoét, khung cửa |
| Mảnh kết cấu | đủ | bỏ: đấu củng (thay khối nướng), vì kèo hở (thay trần phẳng KT-10), phướn, diềm lạc quải | cột, tường lót, sàn, thang |
| Đồ đạc | đủ | bỏ đồ «kể chuyện» phụ (chén trà dở, giày, lồng chim) | **mọi đồ có `hook` / `station`** |
| Đèn | ≤ 4 / khoang | ≤ 2 / khoang (ưu tiên đèn trạm chính), không nhấp nháy | ≥ 1 nguồn thật mỗi khoang |
| Bán kính nạp | A 80 · B 60 · C 40 | A 50 · B 40 · C 25; ≤ 1 nhà C cùng lúc | va chạm nướng (luôn nạp cùng vỏ) |
| Camera | TRONG / BỔ DỌC theo hạng | mặc định BỔ DỌC cho mọi khoang < 8 m (ít vẽ hơn) | — |
| Âm | vang + che âm | vang 1 Convolver dùng chung, không che âm theo cửa (chỉ trong / ngoài) | âm nền khoang |
| Thẻ cửa sổ đêm | có | có (1 draw call / công trình, rẻ) | lời hứa H3 |
| Bóng | mặt trời 1536² | 1024², không bóng đạo cụ nhỏ | — |

Danh sách «bỏ ở `low`» khai trong `kit/<bộ>.json` (cờ `low: false` trên mảnh) — `kit.js` lọc khi lắp. Test T-21 chạy thêm một lượt giả lập `low`: số trạm, số đèn ≥ 1, đường đi — như `mid`.

## 4. Bộ nhớ trên iPhone

`landmarks.js` nạp vùng khi ≤ 900 m «tiết kiệm bộ nhớ iPhone» (chú thích hiện có). Với nội thất:

| Ngưỡng | Hành động |
|---|---|
| Tổng texture nội thất > 64 MB (iOS) | dỡ nội thất LRU tới dưới 48 MB (trừ khoang người chơi + khoang thấy được) |
| `performance.memory` không có trên Safari | ước lượng bằng tổng kích thước ảnh đã nạp (`kit.js` đếm) |
| Cảnh báo bộ nhớ (WebGL context lost) | tải lại vùng hiện tại; nội thất dựng lại từ công thức (không mất trạng thái — trạng thái ở `s.int` và máy chủ) |

## 5. Kiểm

- T-21 (iOS) và T-21b (`low`) trong `test-game-buildings.mjs` — 08-12 §2.2.
- Thử tay bản iOS theo bước 11 của phiếu 08-12 §4, thêm: không trạm nào hiện chữ «vận hạn», «xin», «quẻ» cho bản thân trong bất kỳ công trình nào (tìm chuỗi trong `TEXT` / nhãn trạm khi `IOS`).
