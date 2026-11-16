# 32 · Kiểm thử, dựng bản, triển khai, vận hành

> **Trạng thái:** `[ĐÃ CÓ]`; lệnh test chung đang gãy (`VC-001`)
> **Bộ phận chủ trì:** QA · Vận hành
> **Nguồn sự thật trong mã:** `package.json`, `scripts/test-*.mjs`, `scripts/dev-mmo.mjs`, `vite.config.js`, `wrangler.jsonc`, `worker/admin.js`, `src/game/features.js`; danh sách ở [A2](phu-luc/A2-kiem-thu.md)
> **Test:** chính là đối tượng của chương
> **Thay thế:** phần kiểm thử và deploy rải trong `GAME-V2-THIET-KE`, `GAME-MMO-PROMPT-PLAN`; `DEPLOY.md` ở gốc repo vẫn dùng cho app
> **Kiểm với mã ngày:** 2026-11-16

## 32.0 Mục đích, phạm vi, tóm tắt

Chương này trả lời: làm sao biết một thay đổi không phá gì, và làm sao đưa nó lên bản thật an toàn.

| Việc | Lệnh | Cần gì |
|---|---|---|
| Chạy một bộ test thuần | `node scripts/test-game-<tên>.mjs` | chỉ Node |
| Chạy mọi bộ test thuần | xem §32.1 (lệnh chung đang gãy) | chỉ Node |
| Test cần máy chủ | `npm run dev:mmo` rồi `npm run test:mmo` | máy chủ dev |
| Chạy game ở máy | `npm run dev` (chỉ client) hoặc `npm run dev:mmo` (kèm máy chủ) | |
| Dựng bản | `npm run build` | |
| Kiểm tài liệu | `node scripts/docs-game-gen.mjs --check` và `node scripts/docs-game-lint.mjs` | chỉ Node |
| Triển khai | chạy tay quy trình CI (`gh workflow run cloudflare.yml`) hoặc `npm run deploy` | quyền của chủ dự án |

## 32.1 Kiểm thử

`[ĐÃ CÓ]` Danh sách 45 bộ: [A2](phu-luc/A2-kiem-thu.md).

- **Ba tầng:**
  1. **Test thuần** (42 bộ): nạp mô-đun thuần trong Node, không trình duyệt, không máy chủ. Đây là tầng chính; mọi luật và mọi bảng số phải có ca ở đây.
  2. **Test cần máy chủ dev** (3 bộ): hai kết nối thật vào phòng, tài khoản thử, kinh tế giữa hai tài khoản. Mã một lần hiện ngay trên màn hình ở máy dev, không gửi thật.
  3. **Kiểm trong trình duyệt và trên bản thật:** `scripts/shot-city.mjs` (bộ ảnh cố định), `scripts/perf-load.mjs` (đo tải), `scripts/live-map.mjs`, `scripts/live-travel.mjs`, `scripts/live-fortune.mjs` (đi lại, bản đồ, thầy bói trên bản thật).
- **Kết quả 2026-11-16:** 42/42 bộ thuần đạt khi chạy lẻ.
- **Lỗi đang có:** `npm run test:game` gọi một tệp không còn tồn tại nên dừng giữa chừng; 17 bộ không nằm trong lệnh nào (`VC-001`). Cho tới khi sửa, chạy lần lượt mọi tệp:

```bash
for f in scripts/test-*.mjs; do node "$f" || echo "TRƯỢT: $f"; done
```

  (Ba bộ cần máy chủ sẽ trượt nếu chưa bật `dev:mmo`.)

- **Luật viết test:** đáp án lấy từ **cùng mô-đun nguồn** với mã chạy thật. Một bài kiểm tự chép cứng dữ liệu sẽ in «đạt» giả (bài học ngày 14/11 khi kiểm dãy phố).
- **Bộ test cố định cho AI:** bộ câu đánh giá persona và bộ lời luận mẫu cho trọng tài phải chạy lại mỗi lần đổi lời nhắc (§21, `VC-005`).

## 32.2 Định nghĩa «xong» cho một thay đổi

1. Bộ test thuần của mô-đun bị đụng đạt; nếu đụng bố cục thành thì cả nhóm test thế giới (§10.11).
2. Nếu đổi giao thức: `test-quan-protocol` đạt, và chạy `test-quan-mmo` trên máy chủ dev.
3. Nếu đổi hình: có ảnh trước và sau; nếu nói về tốc độ thì có số đo trước và sau ở điểm cố định (§30.6).
4. `npm run build` sạch.
5. Sinh lại phụ lục, kiểm tài liệu đạt; chương L1 liên quan đã sửa nếu luật đổi.
6. Một mục trong [NHAT-KY](NHAT-KY.md); ô tương ứng ở [03-TRANG-THAI](03-TRANG-THAI.md) đã cập nhật.

## 32.3 Chạy ở máy và dựng bản

`[ĐÃ CÓ]` Lệnh: [A2](phu-luc/A2-kiem-thu.md) §A2.3.

- `npm run dev:mmo` bật cả máy chủ cục bộ; client uỷ quyền các đường tài khoản, lưu mây và WebSocket sang đó. Biến `AUTH_DEV` chỉ có ở máy dev: hiện mã một lần trên màn hình và cho phép tua đồng hồ kinh tế.
- Ba chế độ dựng bản: web (đủ tính năng), `ios` (tắt theo `features.js`), `edu`.
- LLM giả cho máy dev: `scripts/mock-llm.mjs`.

## 32.4 Triển khai

`[ĐÃ CÓ]`

- **Deploy chỉ chạy tay** (từ 16/11, MT-11, theo QĐ-06): tab Actions › «Run workflow», hoặc lệnh `gh workflow run cloudflare.yml`; `npm run deploy` deploy từ máy. Đẩy lên nhánh chính **không** còn deploy.
- **Sau khi deploy bản có QĐ-31:** chạy lại cổng đánh giá persona trên `glm-5.3-flash` (`VC-005`); đạt thì ghi mô hình vào `PERSONA_GATE` và deploy lại để bật `gamePersona`.
- **Cảnh báo:** nếu đã deploy tay một bản chưa commit, lần đẩy kế tiếp của bản cũ hơn sẽ **đè** bản đó. Luôn commit trước khi deploy tay, hoặc deploy bằng cách đẩy.
- **Migration** của Durable Object áp khi deploy; thêm lớp mới phải thêm thẻ migration mới, không sửa thẻ cũ. Danh sách hiện có: [A4](phu-luc/A4-giao-thuc.md) §A4.5.
- **Bí mật** của bản thật (đăng nhập Google, gửi mail) do chủ dự án cấu hình: [TAI-KHOAN-CAI-DAT](../TAI-KHOAN-CAI-DAT.md). **Không bao giờ** đặt `AUTH_DEV` trên bản thật.
- Deploy phần máy chủ cần chủ dự án cho phép (QĐ-06).
- Sau deploy: mở game, vào được Sơn Môn; chạy một script kiểm trên bản thật; xem nhật ký lỗi của Worker.

## 32.5 Bản iOS

`[MỘT PHẦN]`

- `features.js` tắt trên bản iOS: xin xăm, hoa đăng, gieo quẻ, Vận Mệnh Các, Thái Tuế Điện, mọi AI; đổi tên và lời sang «học» (LN-10). Bảng nạp Ngọc ẩn.
- Game có điểm gắn cho vỏ ứng dụng (`mount.js`). Việc đưa game vào bản iOS, đăng nhập Apple và phiên cho vỏ ứng dụng **chưa làm** (§2.5 mục 6, `VC-015`).
- App chính có quy trình iOS riêng (`npm run build:ios`, `verify:ios`).

## 32.6 Vận hành

`[ĐÃ CÓ]` ở mức công cụ; `[MỘT PHẦN]` ở mức quy trình.

- **Bảng quản trị** (`worker/admin.js`): đo lường của app, công tắc tắt AI, cấu hình AI, bảng kinh tế (tiền bơm và hút, giá tham chiếu, quán, hàng đợi duyệt lời luận).
- **Chỉ số cần theo dõi mỗi ngày** (§17.6): tỉ lệ hút trên bơm, giá tham chiếu biến động mạnh, số cờ nghi vấn, chi phí AI theo tính năng.
- **Chưa có:** trần chi phí AI theo tháng (`VC-021`); quy trình duyệt hàng đợi lời luận có người phụ trách (theo QĐ-10, quá 72 giờ tự hoàn tiền); lịch sao lưu.
- **Cây làm việc** hiện có tệp lạ chưa theo dõi (`VC-025`).

## 32.7 Liên kết, việc mở

- Trạng thái từng hệ: [03-TRANG-THAI](03-TRANG-THAI.md). Ngân sách hiệu năng: §30.6.
- Việc mở: `VC-001`, `VC-002`, `VC-008`, `VC-012`, `VC-025`.
