# 14.21 · Kịch bản ứng phó sự cố (ngoài AI) — tôn giáo, khủng hoảng người chơi, dữ liệu, MMO, cửa hàng, pháp lý, hạ tầng

> Sự cố AI: tập 14.10 §7. Tập này phủ các loại sự cố còn lại, cùng thang mức SEV1–SEV4.
> Mã kịch bản: `RISK-PB-xx`. Mỗi kịch bản: **dấu hiệu → mức → bước (theo thời gian) → ai → công tắc / công cụ → truyền thông → hậu kiểm**.

---

## 0. Khung chung

### 0.1 Mức sự cố

| Mức | Định nghĩa | Ai được gọi ngay | Mục tiêu ngăn chặn |
|---|---|---|---|
| SEV1 | Nguy cơ tổn hại nghiêm trọng tới người (tính mạng, trẻ em), lộ dữ liệu nhạy cảm, nội dung xúc phạm tôn giáo lan rộng, yêu cầu pháp lý khẩn | GĐSX + chủ lĩnh vực + PC | ≤ 1 giờ |
| SEV2 | Vi phạm rõ ràng, phạm vi hạn chế; bị cửa hàng gỡ / từ chối; phản ánh chính thức của tổ chức | Chủ lĩnh vực + GĐSX | ≤ 24 giờ |
| SEV3 | Lỗi chất lượng, phản hồi tiêu cực rải rác | Chủ lĩnh vực | ≤ 1 tuần |
| SEV4 | Góp ý | Chủ lĩnh vực | Lần cập nhật kế |

### 0.2 Kho công tắc (tổng hợp)

| Công tắc | Tác dụng | Hiện trạng |
|---|---|---|
| `env.QUAN` (Worker) | Tắt toàn bộ MMO (trả «MMO chưa bật» — đã có nhánh 503) | Có |
| `ai:enabled`, `ai:free` | Tắt AI | Có |
| `block:<ip>` | Chặn IP | Có |
| `game:ai.personaKill` | Tắt AI một persona | Cần làm |
| `game:amtaEnabled`, `game:taLoEnabled` | Tắt âm tà, Tà Lộ | Cần làm |
| `game:regionClosed: [id]` | Đóng một vùng (cổng dịch chuyển, lối đi bộ) | Cần làm |
| `game:catalogHidden: [itemId]` | Ẩn vật phẩm khỏi cửa hàng, thay hình món đã sở hữu | Cần làm |
| `game:storeFrozen` | Đóng băng cửa hàng | Cần làm |
| `game:nameReset: [u]` | Đổi tên người chơi về «Khách» | Cần làm (qua admin) |
| Cờ ẩn tab game trong app | Ẩn Học Quán (RISK-173) | Cần làm |
| `safety/helplines.json` (máy chủ) | Sửa đường dây không cần build | Cần làm |

| Mã | Quy tắc |
|---|---|
| RISK-PB-00 | Mọi công tắc «cần làm» phải có trước mốc mà rủi ro tương ứng bị chặn (tập 14.13), và được diễn tập ít nhất một lần. |
| RISK-PB-01 | Công tắc đọc qua một endpoint cấu hình, bộ nhớ đệm ≤ 60 giây; mất kết nối thì dùng giá trị an toàn. |
| RISK-PB-02 | Mỗi lần bật / tắt công tắc ghi `audit:log` (ai, lúc nào, lý do). |

### 0.3 Mẫu phiếu sự cố

```
SỰ CỐ · INC-<năm>-<số> · Loại: tôn giáo / khủng hoảng / dữ liệu / MMO / cửa hàng / pháp lý / hạ tầng
Mức: SEV…   Phát hiện: <thời điểm, kênh, người>
Mô tả: …
Ngăn chặn: <công tắc, thời điểm>
Người phụ trách: …    Người liên lạc ngoài: …
Diễn biến (giờ – việc – người): …
Kết thúc: …   Hậu kiểm: <ngày>   Rủi ro cập nhật: RISK-…
```

---

## 1. RISK-PB-10 · Nội dung tôn giáo bị phản đối công khai

**Dấu hiệu:** bài viết trên trang tin Phật giáo / Đạo giáo, nhóm cộng đồng tín đồ, chức sắc lên tiếng; email phản ánh chính thức; báo cáo trong game tăng về một nội dung.

| Thời gian | Việc | Ai |
|---|---|---|
| 0 – 2 giờ | Xác định nội dung cụ thể (vật phẩm, cảnh, NPC, câu thoại); chụp bằng chứng | TND |
| 0 – 2 giờ | Nếu nội dung rõ ràng sai (vi phạm quy tắc tập 14.05–14.07): **ẩn ngay** (`catalogHidden`, `regionClosed`, hoặc bản vá dữ liệu) | GĐSX |
| 2 – 24 giờ | Liên hệ cố vấn ban liên quan; xin ý kiến | TND |
| ≤ 24 giờ | Phản hồi công khai theo mẫu tập 14.04 §6.3 (nếu đã lan); phản hồi riêng người phản ánh | TT |
| 1 – 7 ngày | Sửa cùng cố vấn; phiếu duyệt mới | TND + HĐCV |
| 7 – 14 ngày | Mở lại; thông báo đã sửa; cảm ơn | TT |
| ≤ 30 ngày | Hậu kiểm; cập nhật sổ rủi ro, quy tắc | GĐSX |

**Không làm:** tranh luận giáo lý công khai; nói «đây chỉ là trò chơi»; đổ lỗi cho AI tạo tài sản; xóa bình luận phản đối trên kênh chính thức (trừ bình luận vi phạm nội quy).

**Biến thể:**
- *Phản ánh từ tổ chức tôn giáo chính thức* → SEV2 tối thiểu; GĐSX trả lời trực tiếp bằng thư.
- *Phản ánh từ cộng đồng tộc người* (Miêu Cương) → SEV2; cân nhắc đóng vùng (RISK-012).
- *Phản ánh về Tạng truyền* → SEV2; đóng vùng; hội đồng Tạng truyền họp.

---

## 2. RISK-PB-20 · Người chơi trong khủng hoảng liên hệ đội ngũ

**Dấu hiệu:** email hỗ trợ, tin nhắn kênh cộng đồng, bình luận công khai có tín hiệu tự hại.

| Thời gian | Việc | Ai |
|---|---|---|
| Ngay khi đọc | Trả lời theo mẫu tập 14.09 §7.2 kèm đường dây đã xác minh | Người trực |
| Ngay | Nếu bình luận công khai: trả lời ngắn công khai + mời nhắn riêng; không xóa (trừ khi chứa mô tả phương thức — ẩn phần đó) | TCĐ |
| Ngay | Nếu có nguy cơ tính mạng cụ thể, sắp xảy ra: báo GĐSX + PC; PC xem nghĩa vụ, khả năng báo cơ quan *(cần luật sư xác minh)* | Người trực |
| Trong ngày | Ghi phiếu sự cố (không chép nguyên văn nội dung nhạy cảm, chỉ tóm tắt) | Người trực |
| Tuần | TAT rà xem có điểm chạm trong game góp phần (vd lời AI, màn năm hạn) không | TAT |

**Không làm:** tư vấn tâm lý; hứa liên lạc lại theo lịch; nhắc lại chi tiết người đó kể trong thư trả lời; chia sẻ thư trong nhóm nội bộ ngoài người cần biết.

---

## 3. RISK-PB-30 · Sự cố dữ liệu

Theo tập 14.12 §8 (quy trình 72 giờ). Bổ sung theo loại:

| Loại | Ngăn chặn đầu tiên | Lưu ý |
|---|---|---|
| Lộ token admin | Xoay `ADMIN_TOKEN`; kiểm `audit:log` thao tác lạ; kiểm `ai:config` có bị đổi | Admin đọc được `vprof` (ngày sinh của app chính) → coi như lộ dữ liệu sinh |
| Lộ khóa API LLM | Thu hồi khóa ở nhà cung cấp; cấp mới vào Secret | Kiểm chi phí bất thường |
| Rò ngày sinh từ game qua mạng (lỗi mã) | Rút bản / tắt tính năng; xác định từ khi nào | Vi phạm cam kết «chỉ trên máy» → thông báo người dùng bắt buộc |
| Gói phụ thuộc độc hại | Rút bản; quay về khóa phiên bản cũ | `localStorage` có thể đã bị đọc → thông báo |
| Nhà cung cấp AI báo sự cố | Tắt nhà cung cấp khỏi pool; hỏi phạm vi | Theo hợp đồng xử lý dữ liệu |
| Máy chủ giả qua `?server=` | Bản vá xóa `huyenquan:server` (RISK-129) | `pid` có thể lộ → xoay muối băm `u` |

---

## 4. RISK-PB-40 · Quấy rối, dụ dỗ trong MMO

| Thời gian | Việc | Ai |
|---|---|---|
| ≤ 4 giờ | Xử lý báo cáo `groom` theo MODCASE-23, 25 | TCĐ + TAT |
| ≤ 24 giờ | Nếu có nhiều nạn nhân / nhóm có tổ chức: tạm tắt cụm từ, emote nhắm vào người (`emo.to`) hoặc tắt MMO phòng liên quan | TMC |
| ≤ 72 giờ | Rà tính năng tạo điều kiện (mời giải án, mời trà, sư đồ); đề xuất sửa | GĐSX |
| Khi cần | PC xem nghĩa vụ lưu, cung cấp bằng chứng | PC |

**Ngưỡng tắt MMO toàn cục:** ≥ 3 ca dụ dỗ xác nhận trong 7 ngày mà chưa có biện pháp kỹ thuật → tắt `env.QUAN` cho tới khi có biện pháp.

---

## 5. RISK-PB-50 · Tấn công làm ngập phòng, spam tên

| Dấu hiệu | Việc |
|---|---|
| Nhiều phòng đầy giờ thấp điểm; nhiều kết nối cùng IP / không `Origin` | Chặn IP (`block:<ip>`); bật giới hạn kết nối chặt hơn; nếu chưa có giới hạn (RISK-121) → tạm tắt MMO |
| Hàng loạt tên xấu lách lọc | Cập nhật `name-filter.json` (không cần build); đổi tên hàng loạt về «Khách» |
| Báo cáo bị spam | Áp hạn mức (RISK-123); xóa báo cáo rác |

---

## 6. RISK-PB-60 · Bị cửa hàng từ chối hoặc gỡ

| Tình huống | Bước |
|---|---|
| Từ chối 4.3(b) | TPH đọc kỹ thông báo; trả lời Resolution Center theo `docs/APPLE-APPEAL-4.3b-READY.txt` + review notes tập 14.11 §8.5; nếu lần 2 → GĐSX quyết gỡ tab game khỏi bản iOS |
| Từ chối 1.2 | Bổ sung theo checklist tập 14.11 §8.4; quay video luồng báo cáo, chặn |
| Từ chối 2.3.1 | Chứng minh cờ build-time; nộp bản không có cơ chế cấu hình từ xa với tính năng bị tắt |
| Từ chối 5.1.x | Sửa chính sách, nhãn, thẻ đồng ý; nộp lại |
| Gỡ app đang phát hành | SEV1; GĐSX + TPH + PC; ẩn tab game bằng bản cập nhật khẩn nếu nguyên nhân là game (RISK-173); liên hệ Apple / Google |
| Google: báo cáo nội dung AI | Kiểm nút báo cáo AI; gửi mô tả rào chắn tập 14.10 |

---

## 7. RISK-PB-70 · Yêu cầu từ cơ quan nhà nước

| Loại | Bước | Ai |
|---|---|---|
| Yêu cầu gỡ nội dung | PC xác minh tính hợp lệ; gỡ trong thời hạn *(cần luật sư xác minh)*; ghi nhật ký | PC + TMC |
| Yêu cầu cung cấp thông tin người dùng | PC xác minh; chỉ cung cấp phạm vi luật định; máy chủ không có ngày sinh (giải thích) | PC |
| Kiểm tra giấy phép trò chơi | PC trả lời theo hồ sơ; nếu chưa có giấy phép G1 → phương án A (tắt MMO cho người ở Việt Nam) | PC + GĐSX |
| Thông báo vi phạm nội dung kịch bản | Tạm đóng nội dung bị nêu; làm việc với cơ quan; sửa | PC + TND |

**Không làm:** tự ý cung cấp dữ liệu qua điện thoại; xóa dữ liệu liên quan khi đang có yêu cầu.

---

## 8. RISK-PB-80 · Sự cố báo chí

| Thời gian | Việc |
|---|---|
| 0 – 4 giờ | Xác minh nội dung bài viết; lập danh sách điểm đúng / sai |
| ≤ 24 giờ | Phản hồi theo mẫu tập 14.04 §6.1 (mê tín) hoặc §6.2 (AI); nếu có điểm đúng → nêu việc đã sửa |
| ≤ 72 giờ | Gửi tài liệu cho phóng viên (thiết kế chống lừa đảo, cam kết không bán cải mệnh, cố vấn) nếu được hỏi |

**Không làm:** công kích phóng viên; nói «tác giả không hiểu game»; nhờ người chơi đi «bảo vệ» game trên mạng.

---

## 9. RISK-PB-90 · Hạ tầng: AI chết, MMO chết, mất dữ liệu cấu hình

| Tình huống | Bước | Ghi chú |
|---|---|---|
| Mọi backend AI lỗi (`free:log` toàn lỗi) | Game tự chuyển thoại kịch bản + `composeAnswer`; không báo lỗi gây hoang mang | RISK-067 |
| MMO lỗi | Game offline-first (`net.js`): người chơi tiếp tục chơi đơn; thanh trạng thái «Chơi đơn — sẽ tự kết nối lại» (đã có) | — |
| KV cấu hình an toàn mất (helplines, name-filter) | Dùng bản dự phòng trong build | RISK-DICT-12 |
| Đường dây hỗ trợ báo «không gọi được» nhiều lần | Gỡ khỏi bản máy chủ ngay; TAT xác minh lại | RISK-039 |

---

## 10. RISK-PB-95 · Vật phẩm thiêng lọt vào cửa hàng

| Thời gian | Việc |
|---|---|
| ≤ 1 giờ | `catalogHidden` món; hình món đã sở hữu đổi sang món thay thế |
| ≤ 24 giờ | Hoàn Ngọc người đã mua; thông báo mẫu tập 14.04 §6.5 |
| ≤ 7 ngày | Tìm vì sao test E1/E2 không bắt (thiếu `tags`? thiếu từ khóa?) và sửa |

---

## 11. Diễn tập

| Kịch bản | Tần suất | Thước đo |
|---|---|---|
| PB-10 tôn giáo (giả lập phản ánh vật phẩm) | Mỗi năm | Thời gian ẩn ≤ 2 giờ |
| PB-20 khủng hoảng qua email | Mỗi năm, với người trực mới | Thư trả lời đúng mẫu trong ngày |
| PB-30 lộ token admin | Mỗi năm | Xoay token ≤ 1 giờ |
| PB-40 dụ dỗ | Mỗi năm | Tạm ngắt ≤ 4 giờ |
| PB-95 vật thiêng | Mỗi mốc có cửa hàng | Ẩn ≤ 1 giờ |
| AI SEV1 (tập 14.10) | Mỗi mốc có persona mới | Tắt ≤ 1 giờ |

Biên bản diễn tập lưu `docs/review/drills/`.
