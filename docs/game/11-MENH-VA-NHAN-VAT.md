# 11 · Mệnh và nhân vật

> **Trạng thái:** `[ĐÃ CÓ]`
> **Bộ phận chủ trì:** Thiết kế game · Client/UI
> **Nguồn sự thật trong mã:** `src/game/state.js`, `src/game/progress.js`, `src/game/cosmetics.js`, `src/game/wardrobe-ui.js`, `src/game/characters.js`, `src/game/accessories.js`, `src/game/effects.js`, `src/game/tutorial.js`, `src/game/spawn.js`, `src/game/features.js`, `src/game/main.js` (cổng nhập môn); số liệu ở [A3](phu-luc/A3-so-lieu.md) mục 11
> **Test:** `scripts/test-game-state.mjs`, `scripts/test-game-progress.mjs`, `scripts/test-game-cosmetics.mjs`, `scripts/test-game-spawn.mjs`
> **Thay thế:** `GAME-V2-THIET-KE` §2, §3.1, §3.2; `GAME-HUYEN-QUAN-SPEC` (phần nhân vật)
> **Kiểm với mã ngày:** 2026-11-16

## 11.0 Mục đích, phạm vi, tóm tắt

Chương này định nghĩa nhân vật: từ ngày giờ sinh thành lá số, từ lá số thành màu áo và hệ số chơi, và nhân vật lớn lên thế nào. Đây là nơi thi hành TC-1. Không gồm: lời luận về lá số (§12), cảnh giới và pháp môn (§18.4), hệ số nghề (§14).

```
[Cổng] tên · giới tính · ngày giờ sinh (dương lịch, có ô «không rõ giờ»)
   ↓ engine của app lập tứ trụ, tính ngũ hành, vượng nhược
[Lễ nhập môn] bốn trụ lật ra → «Dụng thần … · Hỷ thần … · Kỵ thần …»
   ↓ áo màu Dụng thần, đai màu Hỷ thần
[Tân thủ] 8 bước có nút dẫn đường → hỏi thầy câu đầu tiên
   ↓
[Lớn lên] Phúc Khí tích lũy → cấp → gia trì; trang phục; danh hiệu; cảnh giới (§18.4)
```

## 11.1 Nhập môn và lá số

`[ĐÃ CÓ]`

- Người chơi nhập tên, giới tính, ngày giờ sinh. Không rõ giờ thì đánh dấu; engine vẫn lập lá số ba trụ rưỡi.
- Engine của app (`engine/chart`) trả tứ trụ, tỉ lệ ngũ hành, thân vượng hay nhược, **Dụng thần, Hỷ thần, Kỵ thần**. Game lưu: `state.player.birth` (chỉ trên máy), `state.player.yong`, màu áo và đai.
- Lá số của người chơi cũng thành hồ sơ «Bản thân» trong Sổ Mệnh, dùng chung cho Bàn Thầy, thầy bói, gieo quẻ.
- **Riêng tư (LN-01):** ngày giờ sinh không rời máy. Lưu mây lọc mọi trường ngày sinh; sang máy mới phải nhập lại. Mạng chỉ phát màu áo. Máy chủ việc làm chỉ nhận **hành** của Dụng, Hỷ, Kỵ thần và khoá 30 ngày (QĐ-30).
- **Kiếp sau:** nhân vật nhận lá số hư cấu do Âm phủ cấp; ngày sinh thật không đổi (§18.5.4). Nguồn lá số đang dùng cho từng việc do `fortune-npc.chartSource` quyết định.

## 11.2 Phẩm phục theo mệnh

`[ĐÃ CÓ]` Bảng màu: `stations.ROBE`, `characters.WX_HSV`.

| Hành | Màu áo |
|---|---|
| Mộc | xanh lục `#3f8a4f` |
| Hỏa | đỏ son `#b3261e` |
| Thổ | vàng đất `#b0843a` |
| Kim | trắng ngà `#d9d4c7` |
| Thủy | lam thẫm `#2c4f8a` |

- Vải theo Dụng thần, đai và viền theo Hỷ thần. Nhuộm theo vùng màu đo từ texture từng model; **da không bao giờ bị nhuộm**.
- Chiều cao thật: nam 1,76 m, nữ 1,66 m. Không đổi khung xương (QĐ-27).
- NPC theo cung được nhuộm theo luật 60–30–10: áo chủ đạo, ngà, đai nâu.

## 11.3 Cấp, gia trì, VIP

`[ĐÃ CÓ]` Bảng: [A3](phu-luc/A3-so-lieu.md) › `progress.js`.

- **Cấp** = phần nguyên của căn bậc hai (Phúc Khí tích lũy ÷ 20), cộng 1. Phúc Khí tích lũy (`state.xp`) không giảm khi tiêu Phúc Khí.
- **Gia trì** mở ở cấp 2, 4, 6, 8, 10, mang màu và kiểu chuyển động của hành Dụng thần: hào quang hộ thể, linh khí quanh thân, vệt sáng bộ pháp, **ngự kiếm**, pháp quang sau lưng.
- **VIP** (`state.vip.until`) mở sớm bốn gia trì đầu và mở leo bám (§16.1); không mở pháp quang cấp 10; không bỏ qua được đột phá cảnh giới (MT-8). Chưa có cổng thanh toán (§2.5).
- Từ cấp 5 trở lên, dải cấp mang tên cảnh giới và cần đột phá (§18.4.1).

## 11.4 Danh hiệu và thành tựu

`[ĐÃ CÓ]` Bảng: [A3](phu-luc/A3-so-lieu.md) › `state.js › TITLES`, `ACHIEVEMENTS`.

- Danh hiệu và các hiệu ứng theo ngưỡng (lồng đèn, đào nở, hạc) tính theo **Phúc Khí tích lũy**, không theo số dư. Không còn phần thưởng nào tính theo thứ có thể tiêu (QĐ-12).
- Thành tựu: 12 mục. Thông thạo từng sảnh nghề ghi ở `state.deskLog`.

## 11.5 Tàng Y Các

`[ĐÃ CÓ]` Danh mục: [A3](phu-luc/A3-so-lieu.md) › `cosmetics.js`.

- **Tám ô trang bị:** phẩm phục, mũ và trâm, sau lưng, cầm tay, hào quang, vệt bước, ngự vật, khung tên.
- **64 món**, chia bậc hiếm. Giá bằng tiền (đồng, lượng bạc) hoặc Ngọc cho món quý. Không còn nguồn Ngọc miễn phí (QĐ-13); bảng nạp ẩn trên iOS.
- **Bộ:** năm bộ ngũ hành và bộ «Vân Du Tiên Môn». Mặc đủ bộ có hiệu ứng bộ. Bộ trùng Dụng thần được **Hợp mệnh**: cộng 10 % Phúc Khí khi giải án và làm sảnh nghề.
- **Món giới hạn:** theo VIP, theo cấp, theo chuỗi ngày.
- **Thử đồ:** mặc tạm 20 giây để xem ngoài cảnh.
- **Phụ kiện** là vật cứng dựng bằng mã, bám một điểm xương (đầu, lưng, tay phải); không có áo vải mềm.
- **Ngự vật** chỉ đổi hình và tư thế bay; quyền bay vẫn theo cấp 8 hoặc VIP. Bậc hiếm cộng tốc độ theo §16.4.
- **Người khác thấy:** trang bị gửi lên mạng dưới dạng chuỗi gọn; máy chủ lọc qua danh mục rồi phát lại.
- Người bán: Bà Tư. Luật lời thoại của Bà Tư: không nhắc giá, không giục mua (§21).

## 11.6 Tân thủ và nơi xuất hiện

`[ĐÃ CÓ]` Bảng: [A3](phu-luc/A3-so-lieu.md) › `tutorial.js`, `spawn.js`.

- Tám bước, mỗi bước có nút dẫn đường tới đúng chỗ; bỏ qua được. Bước nào có thưởng thì ghi ở bảng `STEPS`.
- Lần đầu xuất hiện cạnh Thầy Tử Bình. Lần sau chọn: chỗ lần trước, nhà riêng, miếu ứng với Dụng thần, Sơn Môn (§10.8).

## 11.7 Trạng thái người chơi và lưu trữ

`[ĐÃ CÓ]`

- Một đối tượng `state` lưu ở khoá `huyenquan:v1` trên máy. Các nhánh chính: `player`, `profiles`, `phuc` và `xp`, `daily`, `deskLog`, `wardrobe`, `life`, `home`, `vip`, cùng nhánh của từng hệ (bệnh, xe, huyền học, luân hồi…).
- Mọi phần thưởng đi qua hàm ghi trong `state.js` có trần ngày (LN-15): thưởng lá số khoá theo khoá sinh, trần thưởng giải án mỗi ngày, trần trà, trần thưởng nhà.
- Lưu mây: gom mỗi 20 giây, có số phiên bản chống hai máy ghi đè, lọc ngày sinh (§31.2).
- Các khoá khác trên máy: [A7](phu-luc/A7-dieu-khien-luu-tru.md) §A7.3.

## 11.8 Liên kết với hệ khác

| Hệ | Trao đổi | Chương |
|---|---|---|
| Mọi hệ dùng mệnh | `yong` | §0.5.1 |
| Bói toán | lá số «Bản thân»; Phúc Khí từ giải án | §12 |
| Tu luyện | cấp → cảnh giới | §18.4 |
| Di chuyển | cấp 8 mở bay; VIP mở leo | §16 |
| Mạng | màu áo, trang bị, danh hiệu | §31 |
| Đời sống | áo hợp mệnh giảm rủi ro bệnh | §13.2.3 |

## 11.9 Kiểm thử, nghiệm thu, việc mở

- `test-game-state` (19): cổng, hồ sơ, trần thưởng, chống cày. `test-game-progress` (5). `test-game-cosmetics` (8): danh mục, Hợp mệnh. `test-game-spawn` (9).
- Thêm một món trang phục: thêm vào `cosmetics.js`; máy chủ tự nhận qua danh mục chung; chạy `test-game-cosmetics` và `test-quan-protocol`.
- Việc mở: `VC-017` (cổng thanh toán), `VC-006`.
