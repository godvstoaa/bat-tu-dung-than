# 20 · Xã hội: hiện diện, cử chỉ, hôn nhân

> **Trạng thái:** `[ĐÃ CÓ]`; `[MỘT PHẦN]` ở §20.4
> **Bộ phận chủ trì:** Thiết kế game · Backend
> **Nguồn sự thật trong mã:** `src/game/net.js`, `src/game/protocol.js`, `src/game/civil.js`, `src/game/incense3d.js`, `worker/quan-room.js`; số liệu ở [A4](phu-luc/A4-giao-thuc.md), [A3](phu-luc/A3-so-lieu.md) mục 20
> **Test:** `scripts/test-quan-protocol.mjs`, `scripts/test-quan-mmo.mjs` (cần máy chủ), `scripts/test-game-econ.mjs` (phần hộ tịch)
> **Thay thế:** `GAME-MMO-PROMPT-PLAN` (phần xã hội), `GAME-SINH-TON-KINH-TE-DAC-TA` §12; `docs/gdd/10-xa-hoi` là lớp L4
> **Kiểm với mã ngày:** 2026-11-16

## 20.0 Mục đích, phạm vi, tóm tắt

Người chơi thấy nhau, làm việc cạnh nhau, giúp nhau, kết hôn; nhưng **không gõ chữ tự do cho nhau** (LN-05). Không gồm: giao dịch qua chợ (§17), thầy mệnh lý (§12.6), kỹ thuật phòng mạng (§31).

| Phần | Một dòng | Mục |
|---|---|---|
| Hiện diện | thấy người khác với đúng áo, phụ kiện, độ cao, trạng thái bơi, bay, thuyền | §20.1 |
| Giao tiếp | cử chỉ và cụm từ soạn sẵn; báo cáo và chặn | §20.1 |
| Việc làm chung | án Hợp Hôn chung, lư hương chung, thăm và khen nhà, cúng cô hồn | §20.1 |
| Hôn nhân | khế ước có phí, ba hạng lễ, ly hôn chia theo tỉ lệ góp | §20.2 |

## 20.1 Hiện diện và giao tiếp

`[ĐÃ CÓ]` Hằng số ở [A4](phu-luc/A4-giao-thuc.md) §A4.2.

- **Phòng:** mỗi phòng một Durable Object, có sức chứa tối đa. Vị trí phát theo vùng quanh người chơi; người ở xa nhận gói thưa.
- **Thấy gì ở người khác:** tên (đã lọc), danh hiệu, màu áo và đai, trang bị Tàng Y Các, độ cao (tương đối và tuyệt đối), trạng thái nước, loại thuyền, trạng thái bay. **Không** thấy ngày sinh, lá số, chuyện khách, tiền.
- **Cử chỉ** (`protocol.EMOTES`, sáu loại) và **cụm từ soạn sẵn** (`protocol.PHRASES`, tám câu). Không có ô gõ chữ giữa người chơi.
- **Báo cáo và chặn:** gói `report`; danh sách chặn lưu trên máy.
- **Ngồi chung:** ghế Trà Thất do máy chủ cấp, hết ghế thì báo, không ngồi đè.
- **Án Hợp Hôn chung:** tối đa `COOP_MAX` người cùng giải.
- **Lư hương chung:** một lư lớn và tám lư nhỏ quanh Đại Đỉnh. Phòng giữ hương đang cháy; người vào sau vẫn thấy. Lư lớn đầy thì dồn sang lư nhỏ vắng nhất.
- **Thăm nhà, khen nhà:** vào nhà người khác thấy đúng đồ đạc; mỗi người khen một căn một lần (§15.2.2).
- **Cúng cô hồn:** giúp người đang ở cõi Ngạ quỷ sớm siêu thoát; người cúng được Âm Đức (§18.5.3).
- **Tách người đứng chồng:** chỉ ở phần hiển thị; vị trí mạng giữ nguyên.
- **Ngoại tuyến:** không kết nối được thì game vẫn chạy một mình (LN-08).

## 20.2 Hôn nhân & ly hôn (khế ước tài chính – xã hội)

> **Trạng thái:** `[ĐÃ CÓ]` lõi (P12); đồng sở hữu và thừa kế: xem §20.4.

Hôn nhân là một **khế ước** có chi phí và nghĩa vụ, không phải danh hiệu trang trí.

```
[Độc thân] ──cầu hôn (2 bên xác nhận)──> [Đính ước 72 giờ] ──đăng ký ở Nha Môn (phí)──> [Lễ cưới theo hạng]
     ↑                                                                                         ↓
     └─────── [Độc thân, chờ 30 ngày mới được tái hôn] <── chia tài sản + án phí <── [Đơn ly hôn]  ←  [Đã kết hôn]
```

### 20.2.1 Nguyên tắc

- **Một vợ một chồng.** Mỗi tài khoản chỉ có tối đa 1 hôn thú ở trạng thái `REGISTERED`. Máy chủ dùng ràng buộc duy nhất, không chỉ kiểm ở client.
- **Bước nào cũng tốn phí**, là hố hút tiền (§13.3.4): đăng ký, tổ chức, duy trì, ly hôn.
- **Chỉ tài khoản đã đăng nhập** (không phải khách). Mỗi bên có ít nhất 7 ngày tuổi tài khoản và 10 giờ chơi, để chống tài khoản phụ.
- **Cầu hôn bằng cụm từ soạn sẵn** và thẻ xác nhận. Không mở chat tự do giữa người chơi (vẫn theo §21.3.1, Guideline 1.2).
- **Nội dung:** hôn nhân là nghi lễ và khế ước tài sản. Không có nội dung tình dục; hoạt ảnh chỉ dừng ở lễ bái đường và cầm tay. **Không chặn theo tuổi** (đã chốt, Quyết định 11); giữ đúng giới hạn nội dung này để xếp hạng tuổi trên kho ứng dụng không đổi.
- **Tái hôn:** ly hôn xong phải chờ **30 ngày**. Tối đa **3 lần kết hôn trong 365 ngày**.

### 20.2.2 Ba hạng lễ cưới

Hạng chọn theo túi tiền; hệ thống gợi ý theo bậc giàu (§13.3.4), không ép.

| | **Hạng Hàn vi** (`DESTITUTE`) | **Hạng Trung lưu** (`MIDDLE`) | **Hạng Thượng lưu** (`LUXURY`) |
|---|---|---|---|
| **Phí đăng ký Nha Môn** | 60 đồng (≈ ¾ ngày sống) | 600 đồng | 5 lượng + **thuế hôn sản** 0,5% tổng tài sản hai bên |
| **Tổ chức** | 0. Hai người tự mua 2 suất ở quầy cơm và ăn cùng nhau; game ghi nhận bữa này là «lễ» | Thuê sảnh tửu lâu 2–4 lượng, tiệc đứng | Thuyền hoa hồ Cùng Thông hoặc Thiên Bàn Đảo: 30–80 lượng |
| **Quy mô** | Chỉ hai người | Mời 10–20 người chơi cùng shard (thiệp mời) | Không giới hạn khách; pháo hoa và thông cáo toàn thành; kiệu tám người khiêng |
| **Nhận được** | Hôn thư. Không có hiệu ứng xã hội, không có buff | **«Hỷ khí»** 7 ngày: Tỉnh hồi khi ngủ +10%, hao Tỉnh khi làm việc −5%. Mở **rương chung** trong nhà ở | Danh hiệu «Phu thê» hiện trên đầu; **danh vọng** kinh doanh +10 (dùng cho lượng khách nhà hàng §17.4.4); mở **đồng sở hữu tài sản** và **quyền thừa kế** |
| **Duy trì** | 0 | 0 | Phí hôn sản 20 đồng/ngày khi có tài sản đồng sở hữu |

- **Khách dự tiệc:** mỗi người tham dự nhận «hỷ thực» (No +40), không nhận tiền. Không có cơ chế mừng tiền, vì mừng tiền là kênh chuyển tiền khó kiểm.
- **Nâng hạng sau này:** tổ chức lại lễ ở hạng cao hơn thì trả phần chênh lệch; không hoàn tiền khi hạ hạng.

### 20.2.3 Quyền lợi khi đã kết hôn (mọi hạng)

- **Ở chung:** người kia được ngủ, bài trí và dùng đồ chức năng trong nhà của vợ / chồng. Vẫn giữ giới hạn mỗi người đứng tên tối đa 1 nhà (§D bản biệt phủ). Hai người có thể có 2 nhà.
- **Rương chung** (hạng Trung lưu trở lên): mỗi món ghi người bỏ vào, phục vụ việc chia tài sản (§20.2.4).
- **Gánh nặng chung:** người chơi có thể bật «chi tiêu chung». Khi đó tiền trọ và thuế thân của hai người cùng trừ từ một ví do hai bên chỉ định. Mặc định tắt.
- **Đồng sở hữu** (chỉ hạng Thượng lưu): nhà, xe, mặt bằng mua **trong thời gian hôn nhân** có thể đứng tên chung. Mỗi lần mua, máy chủ ghi **tỉ lệ góp** của từng người.
- **Thừa kế:** một bên xóa tài khoản (§31.2.4) hoặc không đăng nhập 90 ngày thì phần đồng sở hữu chuyển cho bên còn lại sau khi nộp phí thừa kế 5% giá trị. Hôn thú tự chuyển sang `DISSOLVED`.

### 20.2.4 Ly hôn

| | Thuận tình | Đơn phương |
|---|---|---|
| **Nộp đơn** | Ở Nha Môn; cả hai xác nhận | Một bên nộp |
| **Án phí** | 2% tổng giá trị tài sản chung (tối thiểu 200 đồng) | **Gấp đôi**: 4% (tối thiểu 400 đồng), người nộp đơn trả |
| **Thời gian chờ** | 72 giờ (cho phép rút đơn) | 7 ngày. Bên kia có thể phản hồi; im lặng thì xử vắng mặt |

**Chia tài sản:**

```
mỗi tài sản đồng sở hữu:
  (a) một bên mua lại phần của bên kia theo giá thẩm định  →  chuyển tiền theo tỉ lệ góp
  (b) không bên nào mua  →  Nha Môn thanh lý 70% giá thẩm định, chia theo tỉ lệ góp
      (30% còn lại là hố hút tiền)
rương chung: mỗi món trả về người đã bỏ vào
tài sản riêng (có trước hôn nhân, hoặc đứng tên một người): không chia
```

- Chia theo **tỉ lệ góp đã ghi sổ**, **không chia 50/50**. Nhờ vậy kết hôn rồi ly hôn không thành đường chuyển tiền (§17.5.4).
- Chưa xong ly hôn thì không kết hôn lần nữa được (ràng buộc máy chủ).

### 20.2.5 Gắn với hệ có sẵn

- **Nha Môn:** thêm quầy «Hộ tịch» (đăng ký, ly hôn, tra cứu hôn thư).
- **Huyền Thành Luật:** điều mới «Lừa hôn»: kết hôn rồi ly hôn liên tục để rút tài sản (bị trọng tài chống gian lận §17.5.4 gắn cờ) thì tịch thu phần đã chuyển và cấm kết hôn 180 ngày.
- **NPC:** bà mai NPC ở Hộ tịch (chat LLM §21.3), giải thích thủ tục; có thể xem hợp tuổi *vui* bằng **hành** của hai người (không dùng ngày sinh).

## 20.3 Phần đang chạy thêm hoặc khác đặc tả

`[ĐÃ CÓ]` (nhật ký 11/11; hằng số ở [A3](phu-luc/A3-so-lieu.md) › `civil.js`)

- Cầu hôn bằng một trong ba câu soạn sẵn với người đứng gần; lời cầu hôn có hạn trả lời.
- Người cầu hôn trả phí lễ.
- **Quỹ chung** ghi tỉ lệ góp của từng người; ly hôn chia đúng tỉ lệ đó.
- Tuổi tài khoản do **máy chủ** giữ: cả hai bên đủ bảy ngày mới kết hôn được; khách không kết hôn (QĐ-21).
- Chờ 30 ngày mới tái hôn; tối đa ba lần mỗi năm. Không có mừng tiền.
- Thao tác: nhóm `cv_` trong gói `ec` ([A4](phu-luc/A4-giao-thuc.md) §A4.1); giao diện ở thẻ Hộ tịch, mở từ quầy trong Nha Môn.

## 20.4 Chưa thấy trong mã `[MỘT PHẦN]`

- Đồng sở hữu nhà, xe, mặt bằng và quyền thừa kế của hạng Thượng lưu (§20.2.3) → `VC-029`.
- Điều luật «Lừa hôn» (§20.2.5): cần kiểm trong `law.ARTICLES`.
- Bà mai NPC ở Hộ tịch (§20.2.5).

## 20.5 Không làm `[TẦM NHÌN]`

Môn phái, sư đồ, kết nghĩa, bảng xếp hạng Thiên Bảng, lễ tiết theo lịch, sự kiện toàn máy chủ: có trong `docs/gdd/10-xa-hoi` nhưng không nằm trong lộ trình (QĐ-C3). Muốn lấy lại phần nào thì cần quyết định mới.

## 20.6 Liên kết với hệ khác

| Hệ | Trao đổi | Chương |
|---|---|---|
| Máy chủ | phòng, gói mạng, lọc tên, giới hạn tần suất | §31 |
| Tàng Y Các | chuỗi trang bị phát cho người khác | §11 |
| Nhà | ở chung, quỹ chung, di sản | §15, §18.5.4 |
| Luật | lừa hôn; báo cáo | §19 |
| An toàn | không chat tự do; lọc tên; chặn | §40 |

## 20.7 Kiểm thử và nghiệm thu

- `test-quan-protocol` (15): mọi gói bị lọc đúng; gói sai dạng bị bỏ.
- `test-quan-mmo` (máy chủ dev): hai người thấy nhau, ghế, lư hương, nhà, việc làm, kinh tế.
- `test-game-econ`: một vợ một chồng, chia theo tỉ lệ góp, chờ tái hôn.
- Thêm một gói mạng: phải có bộ lọc trong `protocol.js`, có ca trong `test-quan-protocol`, và tự xuất hiện ở [A4](phu-luc/A4-giao-thuc.md).

## 20.8 Việc còn mở

`VC-029`.
