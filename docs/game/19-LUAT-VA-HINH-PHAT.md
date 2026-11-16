# 19 · Luật và hình phạt

> **Trạng thái:** `[ĐÃ CÓ]`
> **Bộ phận chủ trì:** Thiết kế game
> **Nguồn sự thật trong mã:** `src/game/law.js`, `src/game/law-ui.js`, `src/game/raze.js`, `src/game/prison.js`, `src/game/prison3d.js`, `worker/quan-room.js` (sổ công trình bị phá); số liệu ở [A3](phu-luc/A3-so-lieu.md) mục 19
> **Test:** `scripts/test-game-law.mjs`, `scripts/test-game-illness.mjs` (khổ sai trừ nợ)
> **Thay thế:** mục «Phá hủy công trình ngoài thành + Huyền Thành Luật» trong nhật ký `GAME-V2-THIET-KE`; các điều luật rải trong `GAME-SINH-TON-KINH-TE-DAC-TA`
> **Kiểm với mã ngày:** 2026-11-16

## 19.0 Mục đích, phạm vi, tóm tắt

Game không có chiến đấu, nhưng có hậu quả: phá của chung, quỵt nợ, gian lận đều bị xử theo **Huyền Thành Luật**. Luật dùng chính lá số và Bát Môn để tính mức phạt, nên cùng một việc, mỗi người chịu án khác nhau. Không gồm: Nghiệp Lực sinh ra từ án (§18.1), nợ sinh ra thế nào (§13.4).

```
[Phá một công trình ngoài thành] → điểm tội = cỡ × Bát Môn × ngày xung tuổi × hành cung so Dụng thần × tái phạm
     dưới ngưỡng thấp → phạt tiền        ngưỡng giữa → giam Thiên Lao        trên ngưỡng cao → đày Khoáng Sơn
     không đủ tiền → giam                 vượt ngục → án gấp đôi              tiền án thứ bảy → khổ sai dài hạn
```

## 19.1 Phá công trình

`[ĐÃ CÓ]`

- **Phá được gì:** mọi công trình ngoài tường Ngoại Thành có cỡ từ một ngưỡng trở lên. **Trong thành không phá được gì** (LN-16, «Bát Quái hộ thành đại trận»). Công trình có cửa trạm cũng không phá được.
- **Cách phá:** phím X hoặc nút trên màn hình. Mỗi công trình có máu theo khối; mỗi đòn trừ một lượng, nhiều hơn khi đang chạy nhanh hoặc có VIP. Bỏ dở nửa phút thì công trình lành lại.
- **Khi sập:** ẩn hình, gỡ va chạm và đỉnh leo trèo, có mảnh vỡ và bụi. Tự dựng lại sau `law.RESPAWN_MS`, không dựng đè lên người.
- **Máy chủ:** gói `raze` phải khớp toạ độ ô, nằm ngoài thành, người phá đứng đủ gần, không quá một lần mỗi vài giây. Phòng lưu sổ công trình đang bị phá và phát cho mọi người; người vào sau nhận danh sách.

## 19.2 Điểm tội

`[ĐÃ CÓ]` Hằng số: [A3](phu-luc/A3-so-lieu.md) › `law.js`.

Điểm tội là tích của năm thừa số:

| Thừa số | Lấy từ | Ý nghĩa |
|---|---|---|
| Cỡ công trình | khối bị phá | phá to tội nặng |
| Bát Môn của cung | `GATE_FACTOR` | cửa lành (Hưu, Sinh, Khai) nặng nhất; Cảnh, Đỗ vừa; Tử, Kinh, Thương nhẹ |
| Ngày xung tuổi | can chi ngày so với tuổi người phá | nặng hơn một nửa |
| Hành của cung so với Dụng thần | lá số | phá nơi sinh trợ mình thì nặng hơn; nơi thuộc Kỵ thần thì nhẹ hơn |
| Tái phạm | số tiền án | mỗi tiền án cộng thêm một nửa |

Bảng phán quyết trong game ghi rõ từng thừa số (MT-2: hệ số ngày xung tuổi là luật chơi minh bạch, không phải lời doạ).

## 19.3 Hình phạt

`[ĐÃ CÓ]`

| Mức điểm | Hình phạt | Ghi chú |
|---|---|---|
| thấp | **phạt tiền** theo điểm (`FINE_XU`) | không đủ tiền thì chuyển sang giam |
| giữa | **giam Thiên Lao**, số phút theo điểm | chuộc ra bằng tiền theo phút còn lại (`BAIL_PER_MIN`) |
| cao | **đày Khoáng Sơn**, phải đào đủ số quặng theo điểm | |
| tiền án thứ `PERMA_AT` | khổ sai dài hạn | |

- **Đang thụ án:** khoá ngự kiếm, không phá tiếp được; rời chỗ là bị áp giải về; có huy hiệu đếm hạn; mãn hạn thì về Sơn Môn.
- **Vượt ngục:** án gấp đôi.
- **Đại Xá:** xoá một nửa tiền án, trả bằng Ngọc (`PARDON_NGOC`).
- **Nghiệp Lực:** mỗi án cộng Nghiệp theo mức; mỗi quặng khổ sai trừ Nghiệp (§18.1).
- **Bồi thường:** theo đặc tả, công trình bị phá dựng lại bằng tiền của người phá (§13.3.4); cần kiểm đã áp chưa.

## 19.4 Các điều luật

`[ĐÃ CÓ]` Toàn văn: [A3](phu-luc/A3-so-lieu.md) › `law.js › ARTICLES` (11 điều). Sách luật mở bằng phím L.

Ngoài phá công trình, luật còn xử:
- **Nợ quá hạn** (nợ viện phí, thuế, tiền trọ trên một lượng bạc quá bảy ngày): khổ sai trừ nợ ở Khoáng Sơn, mỗi quặng trừ một khoản cố định (`law.debtSentence`, §13.4).
- **Bỏ ca, gian lận việc làm:** trừ uy tín, ghi lý lịch nghề (§14.2.2).
- **Buôn bán trái phép**, **lừa hôn**: có trong đặc tả (§17.4.1, §20.2.5); cần kiểm đã thành điều luật trong `ARTICLES` chưa.

## 19.5 Thiên Lao và Khoáng Sơn

`[ĐÃ CÓ]` Vị trí: [A5](phu-luc/A5-dia-diem.md) › `prison.js`.

Hai nơi nằm ở dải phòng phía Đông. Thiên Lao có các gian lao, chòi canh, cai ngục, bia luật. Khoáng Sơn có vách núi, đường ray, lán giám mỏ và các mạch quặng. Mỏ Dân Sự (nơi làm thuê, §14) tách riêng khỏi khu khổ sai. Khi người chơi ở trên trời thì hai nơi này ẩn.

## 19.6 Liên kết với hệ khác

| Hệ | Trao đổi | Chương |
|---|---|---|
| Mệnh | Dụng thần, tuổi | §11 |
| Thế giới | trong hay ngoài thành, cung, Bát Môn | §10.3.1 |
| Đời sống | phạt và chuộc trả bằng tiền; nợ dẫn tới khổ sai | §13 |
| Huyền học | án sinh Nghiệp Lực; khổ sai trả nghiệp; Địa ngục đạo dùng lại cơ chế đào quặng | §18.1, §18.5.3 |
| Di chuyển | khoá bay khi thụ án | §16 |
| Mạng | gói `raze`, `razed`; danh sách trong lời chào | §31 |

## 19.7 Kiểm thử, nghiệm thu, việc mở

- `test-game-law` (12): định tội theo từng thừa số, ngưỡng hình phạt, vượt ngục, chuộc, Đại Xá.
- Thêm một điều luật: thêm vào `ARTICLES`, thêm ca kiểm, rà lời hiển thị theo LN-07.
- Việc mở: `VC-032` (rà lời phán quyết); kiểm hai điều «buôn bán trái phép», «lừa hôn» và khoản bồi thường (ghi vào `VC-027`, `VC-029`).
