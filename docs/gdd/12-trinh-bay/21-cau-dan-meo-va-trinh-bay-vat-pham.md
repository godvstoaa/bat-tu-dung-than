# 12 · Trình bày — Phần 21: Câu dẫn, thẻ mẹo, ảnh nền và trình bày từng món Tàng Y Các

> Ba nhóm nội dung chữ / hình còn lại: (1) kho câu dẫn và thẻ mẹo hiện ở màn tải, màn chuyển, menu tạm nghỉ — có điều kiện hiện; (2) bản đặt hàng ảnh nền màn tải; (3) bảng trình bày cho cả **51 món** của `cosmetics.js` (biểu tượng, hiệu ứng, âm, cách xem thử).

---

## 1. Kho câu dẫn và mẹo

### 1.1 Luật hiện

1. Màn tải (UI-01) và màn chuyển dài (UI-14 khi tải chunk) hiện **một** câu; đổi mỗi 4 s (không đổi khi giảm chuyển động).
2. Ưu tiên: câu theo **vùng đích** (phần 16) > câu theo **tiến độ** (điều kiện ở cột «Hiện khi») > câu chung.
3. Một câu không lặp lại trong 10 lần tải gần nhất.
4. Bản iOS: bỏ câu nhóm «Bói / vận» (đánh dấu ✗iOS).
5. Không câu nào nhắc cửa hàng, VIP, Ngọc (P6).

### 1.2 Câu chung (tinh thần)

| Khóa | Câu |
|---|---|
| `tip.spirit.01` | Lá số là hạt giống, không phải cái cây. |
| `tip.spirit.02` | Mệnh do ta tạo, phúc tự mình cầu. |
| `tip.spirit.03` | Không có quái để chém. Thử thách là tâm, trí, đức, nghề. |
| `tip.spirit.04` | Mỗi việc thiện là một nét bạn tự viết lại. |
| `tip.spirit.05` | Không có điểm không quay lại được. |
| `tip.spirit.06` | Tốt thì giữ. Không ai được miễn tu. |
| `tip.spirit.07` | Chậm mà không đứt cũng là tới. |
| `tip.spirit.08` | Quán không giục ai. Mỏi thì ngồi chén trà. |
| `tip.spirit.09` | Biết mình thiếu gì là đã bắt đầu đủ. |
| `tip.spirit.10` | Đếm được tâm ma thì bớt được tâm ma. |

### 1.3 Mẹo thao tác

| Khóa | Câu | Hiện khi |
|---|---|---|
| `tip.ctrl.01` | Kéo để xoay, chụm hai ngón hoặc lăn chuột để lại gần. | 3 phiên đầu |
| `tip.ctrl.02` | Chạm xuống đất chỗ nào, nhân vật đi tới đó. | 3 phiên đầu |
| `tip.ctrl.03` | Kéo màn hình lên để ngước nhìn trời. | chưa từng `pitch < 0` |
| `tip.ctrl.04` | Phím Q / R xoay góc nhìn 45°. | máy tính, chưa dùng Q / R |
| `tip.ctrl.05` | Nút ☰ Các gian đưa bạn tới bất kỳ gian nào bằng một chạm. | chưa mở danh sách gian |
| `tip.ctrl.06` | Chạm thanh kéo ở đầu bảng để mở bảng cao hơn. | điện thoại, chưa dùng nấc full |
| `tip.ctrl.07` | Bấm F hoặc nút 🗡 để ngự kiếm; ▲▼ đổi độ cao. | đã mở bay, chưa bay lần nào |
| `tip.ctrl.08` | Giữ nút Giao lưu để mở nhanh vòng cử chỉ. | chưa dùng bánh xe |
| `tip.ctrl.09` | Trong Cài đặt › Trợ năng có bố cục một tay. | điện thoại |
| `tip.ctrl.10` | Phím M mở bản đồ, J mở Sổ Nhiệm Vụ, B mở Sổ Mệnh. | máy tính |

### 1.4 Mẹo hệ thống tu

| Khóa | Câu | Hiện khi |
|---|---|---|
| `tip.sys.01` | Mọi con số trong Sổ Mệnh đều có nút «Vì sao?». | chưa bấm «Vì sao?» |
| `tip.sys.02` | Hệ số Nghịch Thiên: lá số càng nhiều thử thách, mỗi điểm Đạo Hạnh càng nặng ký. | Tiềm Lực < 46 |
| `tip.sys.03` | Từ cảnh giới Luyện Khí Hóa Thần, Tiên Thiên không còn được tính. | cảnh giới ≥ 2 |
| `tip.sys.04` | Tầng Tích âm đức của Mệnh Đồ luôn mở, làm được ngay hôm nay. | đã mở Mệnh Đồ |
| `tip.sys.05` | Việc ác chỉ ghi khi chính bạn chọn. Sổ có nút «Sửa sai». | có dòng 過 |
| `tip.sys.06` | Sám hối luôn đi cùng một việc sửa sai thật trong game. | có nghiệp > 0 |
| `tip.sys.07` | Bộ trang phục trùng Dụng thần cho +10% Phúc Khí — không cộng Đạo Hạnh. | chưa mặc bộ Hợp mệnh |
| `tip.sys.08` | Tu song song tối đa ba đạo thống chính. | đã vào 1 môn phái |
| `tip.sys.09` | Tu từ ba đạo thống trở lên và Sổ Công Quá dương sẽ mở đường lên Côn Lôn. | cảnh giới ≥ 4 |
| `tip.sys.10` | Nguyên Khí là sức cho việc nặng; trà và giấc ngủ hồi lại nó. | Nguyên Khí < 30% |
| `tip.sys.11` | Thiên Bảng xếp theo Đạo Hạnh, không theo căn cốt. | đã mở Thiên Bảng |
| `tip.sys.12` | Thầy AI có huy hiệu Neo: tỉ lệ câu trả lời khớp lá số. Neo thấp thì đối chiếu Mệnh Bàn. ✗iOS | đã hỏi AI |
| `tip.sys.13` | Mỗi ngày ba việc; xong cả ba thì nối chuỗi ngày. | luôn |
| `tip.sys.14` | Sảnh nghề mỗi sảnh một khách mỗi ngày. | đã mở sảnh nghề |
| `tip.sys.15` | Khoa cử đỗ thì tên bạn được khắc lên bia Tiến sĩ cho cả máy chủ thấy. | đã tới Văn Miếu |

### 1.5 Câu cổ pháp (kiến thức)

| Khóa | Câu |
|---|---|
| `tip.lore.01` | Thân vượng thì nên tiết, thân nhược thì nên phù. |
| `tip.lore.02` | Dụng thần là hành lá số cần nhất, không phải hành nhiều nhất. |
| `tip.lore.03` | Mười hai canh giờ, mỗi canh hai tiếng; giờ Tý bắt đầu lúc 23 giờ. |
| `tip.lore.04` | Ngũ âm Cung, Thương, Giốc, Chủy, Vũ ứng Thổ, Kim, Mộc, Hỏa, Thủy — nhạc trong quán đổi điệu theo giờ. |
| `tip.lore.05` | Phạm Thái Tuế là tục lệ để nhắc mình cẩn trọng, không phải bản án. ✗iOS |
| `tip.lore.06` | Liễu Phàm từng tin mệnh đã định. Rồi ông ghi sổ việc thiện và đổi được đời mình. |
| `tip.lore.07` | Đại vận mười năm một cổng; lưu niên là thời tiết của từng năm. ✗iOS |
| `tip.lore.08` | Cách cục thành thì giữ, cách có bệnh thì tìm thuốc, cách bại thì dựng lại từ nền. |
| `tip.lore.09` | Phù trong game là chữ bịa để học cấu trúc — phù thật thì app cố ý không vẽ. |
| `tip.lore.10` | Đa phần cái gọi là tà là người mình mệt. Ngủ đủ đã. |
| `tip.lore.11` | Bát trạch chia người làm Đông tứ mệnh và Tây tứ mệnh. |
| `tip.lore.12` | Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thu, Khai, Bế — mười hai trực của ngày. |
| `tip.lore.13` | Nạp âm là «âm thanh» của một cặp can chi — mỗi trụ có một nạp âm. |
| `tip.lore.14` | Mái ngói vàng lưu ly là cấp hoàng gia; xanh lục lưu ly là cung quán triều đình sắc dựng. |
| `tip.lore.15` | Đèn hoa đăng thả trên sông nước là tục tưởng nhớ ở rằm tháng Bảy. |

### 1.6 Câu theo giờ (hiện khi tải trong khung giờ đó)

| Khung | Câu |
|---|---|
| Khuya (23–05) | «Giờ Tý — giờ quán yên tĩnh nhất. Đừng thức khuya quá nhé.» |
| Sớm (05–09) | «Giờ Mão, chuông sớm vừa điểm. Một ngày mới, ba việc mới.» |
| Ngày (09–17) | «Giờ Ngọ, trống ngọ vang ở Văn Miếu.» |
| Chiều (17–19) | «Giờ Dậu, chuông chiều. Khói bếp đã lên ở Huyền Thành.» |
| Tối (19–23) | «Giờ Tuất, đèn lồng đã thắp khắp phố.» |

---

## 2. Ảnh nền màn tải và cổng — bản đặt hàng

| Ảnh | Nội dung | Thời điểm trong ngày | Bố cục dọc / ngang | Ghi chú |
|---|---|---|---|---|
| cổng (UI-02 ngang) | cổng tam quan Sơn Môn nhìn từ ngoài vào, bậc đá, đèn lồng | hoàng hôn | ngang 1600 × 900 | mờ 4 px dưới thẻ |
| Sơn Môn | sân, lư hương có khói, bàn thầy xa | sáng sớm | dọc 1080 × 2340 + ngang | — |
| Huyền Thành | phố chợ, đèn lồng | tối | — | — |
| Tử Bình Phong | đỉnh đá trên biển mây, Lão Quân Điện | bình minh | — | — |
| Manh Phái Cốc | thung lũng sương, đèn dầu trong nhà gỗ | chiều mưa | — | — |
| Trích Thiên Đỉnh | trời sao, Đẩu Mẫu Điện | khuya | — | — |
| Cùng Thông Hồ | bến đò, sen | sớm | — | — |
| Thư Lâu Lâm | lầu sách trong rừng, nắng xiên | ngày | — | — |
| Phong Thủy Viên | vườn đá, ống tre | ngày | — | — |
| Lịch Đường | khuê biểu, lậu khắc | ngày | — | — |
| 11 thánh địa | khung kết của `cam.reveal` (phần 20 §5) | theo phần 16 tông LUT | — | Tạng Địa chờ tham vấn |
| Am Vân Cốc | am tranh trên vách, mưa | tối | — | — |
| 7 lễ tiết | trang trí lễ trên Huyền Thành / thánh địa của lễ | — | — | phần 16 §22 |

**Kỹ thuật:** webp ≤ 180 KB (dọc) / ≤ 220 KB (ngang); có bản mờ 32 px (≤ 2 KB) hiện ngay khi ảnh chưa tải. Chữ trên ảnh (tên vùng, câu dẫn) là **HTML**, không vẽ vào ảnh — để bản địa hóa.

---

## 3. Trình bày 51 món Tàng Y Các

Cột: biểu tượng Huyền Ấn (phần 07 §4), hiệu ứng (`fx.*`, phần 12), âm khi mặc / khi dùng (phần 10), cách xem trong phòng thử (UI-72: tư thế, giờ). Món miễn phí ghi «mặc định». Bậc hiếm theo `RARITY` (Phàm ○, Linh ◇, Huyền △, Tiên ☆, Thần ✺).

### 3.1 Phẩm phục (8)

| Món (`id`) | Bậc | Biểu tượng | Hiệu ứng | Âm khi mặc | Xem thử |
|---|---|---|---|---|---|
| Bản Mệnh Y (`y_menh`) | ○ mặc định | `hy-robe` tô màu Dụng thần | — | `SFX-SHOP-003` | đứng, ngày |
| Bạch Y Thư Sinh (`y_bach`) | ◇ | `hy-robe` trắng đai lam | — | như trên | đứng, ngày |
| Tử Y Chân Nhân (`y_tu`) | ☆ VIP | `hy-robe` tím | ánh tím mờ viền áo ban đêm | như trên | đứng, đêm |
| Thanh Mộc Tiên Y (`y_moc`) | △ bộ Mộc | `hy-robe` lục | — | như trên | đi |
| Ly Hỏa Chân Bào (`y_hoa`) | △ bộ Hỏa | `hy-robe` son | — | như trên | đi |
| Hậu Thổ Đạo Bào (`y_tho`) | △ bộ Thổ | `hy-robe` hoàng | — | như trên | đi |
| Canh Kim Kiếm Bào (`y_kim`) | △ bộ Kim | `hy-robe` bạch kim | — | như trên | đi |
| Huyền Thủy Long Bào (`y_thuy`) | △ bộ Thủy | `hy-robe` lam huyền | — | như trên | đi |


### 3.2 Mũ · trâm (7)

| Món | Bậc | Biểu tượng | Hiệu ứng | Âm | Xem thử |
|---|---|---|---|---|---|
| Trâm Gỗ Đào (`tram_go`) | ○ | `hy-hairpin` | — | `SFX-SHOP-003-h` (gài trâm gỗ) | cận đầu |
| Ngân Đạo Quan (`dao_quan`) | △ Kim | `hy-guan` | ánh bạc nhẹ | gài kim loại nhỏ | cận đầu |
| Liễu Diệp Quan (`quan_la`) | △ Mộc | `hy-leaf-crown` | lá khẽ lay | lá xào xạc | cận đầu |
| Tử Kim Quan · Lông Trĩ (`kim_quan`) | ☆ Hỏa | `hy-pheasant` | lông trĩ đung đưa theo bước | lông vũ phất | đi |
| Đấu Lạp Mạng Sa (`dau_lap`) | △ Thổ | `hy-bamboo-hat` | mạng sa bay trong gió | nón lá, vải mỏng | đi, gió |
| Bích Ngọc Trâm (`tram_ngoc`) | △ Thủy | `hy-jade-pin` | tua châu lắc | hạt ngọc chạm nhau | đi |
| Liên Hoa Quan (`quan_sen`) | ✺ VIP · cấp 10 | `hy-lotus-crown` | ánh vàng nhẹ | chuông nhỏ | cận đầu, đêm |

### 3.3 Sau lưng (8)

| Món | Bậc | Biểu tượng | Hiệu ứng | Âm | Xem thử |
|---|---|---|---|---|---|
| Kiếm Gỗ Đào (`kiem_go`) | ○ | `hy-sword` | — | `SFX-SHOP-003-b` (đeo kiếm) | xoay sau lưng |
| Thanh Trúc Kiếm (`kiem_moc`) | △ Mộc | `hy-bamboo-sword` | — | như trên | như trên |
| Tử Kim Hồ Lô (`ho_lo`) | △ Thổ | `hy-gourd` | — | hồ lô gỗ chạm | như trên |
| Song Kiếm Hàn Quang (`kiem_bao`) | ☆ Kim | `hy-twin-swords` | ánh lạnh dọc lưỡi | kiếm ngân | như trên |
| Ô Giấy Dầu Vẽ Sen (`o_giay`) | △ Thủy | `hy-umbrella` | khi mưa tự che (không gợn mưa trên vai — phần 12 §6.1) | giấy dầu bật | mưa |
| Phượng Hỏa Dực (`canh_phuong`) | ☆ Hỏa | `hy-phoenix-wings` | `fx.cos.back_phuong` | `SFX-COS-013` | đứng, đêm |
| Tiên Hạc Dực (`canh_hac`) | ☆ | `hy-crane-wings` | `fx.cos.back_hac` | `SFX-COS-014` | đứng |
| Bát Quái Pháp Luân (`phap_luan`) | ✺ VIP | `hy-bagua-wheel` | `fx.cos.back_phapluan` | `SFX-COS-015` | đứng, đêm |

### 3.4 Cầm tay (5)

| Món | Bậc | Biểu tượng | Hiệu ứng | Âm | Xem thử |
|---|---|---|---|---|---|
| Quạt Giấy Thư Pháp (`quat_giay`) | ○ | `hy-fan` | chữ «道» trên quạt | `SFX-BODY-014` | đứng (phe phẩy) |
| Phất Trần Bạch Vĩ (`phat_tran`) | ◇ | `hy-whisk` | — | `SFX-BODY-015` | đứng |
| Đăng Lung Dạ Hành (`den_long_tay`) | ◇ | `hy-lantern` | `fx.cos.hand_denlong` (sáng thật khi đêm) | `SFX-COS-016` | **đêm** |
| La Bàn Tam Hợp (`la_ban_tay`) | △ | `hy-luopan` | kim run nhẹ (tắt khi giảm chuyển động) | đĩa đồng xoay | cận tay |
| Vũ Phiến Gia Cát (`quat_long`) | ☆ | `hy-feather-fan` | — | lông vũ | đứng |

Cầm tay tự cất khi ngồi cầm chén trà (đã có: `hand: p.sitting ? null : cos.hand`).

### 3.5 Hào quang (7)

| Món | Bậc | Biểu tượng | Hiệu ứng | Âm | Xem thử |
|---|---|---|---|---|---|
| Gia Trì Bản Mệnh (`aura_menh`) | ○ mặc định | `hy-aura` màu hành | `fx.giatri.aura` theo hành (mở theo cấp) | `SFX-COS-001…005` theo hành | đêm |
| Đào Hoa Phi Vũ (`aura_dao`) | △ Mộc | `hy-aura-peach` | `fx.cos.aura_dao` | `SFX-COS-006` | đi |
| Tam Muội Chân Hỏa (`aura_lua`) | ☆ Hỏa | `hy-aura-fire` | `fx.cos.aura_lua` | `SFX-COS-007` | đêm |
| Bát Quái Trận (`aura_batquai`) | ☆ Thổ | `hy-aura-bagua` | `fx.cos.aura_batquai` | `SFX-COS-008` | nhìn từ trên (pitch 0,9) |
| Cửu Thiên Lôi Quang (`aura_set`) | ☆ Kim | `hy-aura-thunder` | `fx.cos.aura_set` (giới hạn nhấp nháy) | `SFX-COS-009` | đêm |
| Hàn Tuyết Phiêu (`aura_tuyet`) | △ Thủy | `hy-aura-snow` | `fx.cos.aura_tuyet` | `SFX-COS-010` | đêm |
| Bộ Bộ Sinh Liên (`aura_sen`) | ✺ cấp 8 | `hy-aura-lotus` | `fx.cos.aura_sen` (sen nở mỗi bước) | `SFX-COS-011` | đi |

### 3.6 Vệt bước (6)

| Món | Bậc | Biểu tượng | Hiệu ứng | Âm | Xem thử |
|---|---|---|---|---|---|
| Bộ Pháp Bản Mệnh (`trail_menh`) | ○ mặc định | `hy-trail` | `fx.giatri.trail` (cấp 6) | `SFX-COS-012` biến thể hành | chạy |
| Đằng Vân Bộ (`trail_may`) | ◇ | `hy-trail-cloud` | `fx.cos.trail_may` | mây phù khẽ | chạy |
| Liên Hoa Bộ (`trail_sen`) | △ | `hy-trail-lotus` | `fx.cos.trail_sen` | cánh rơi khẽ | chạy |
| Hỏa Vân Bộ (`trail_lua`) | △ | `hy-trail-fire` | `fx.cos.trail_lua` | lửa tí tách | chạy, đêm |
| Băng Phách Bộ (`trail_bang`) | △ | `hy-trail-ice` | `fx.cos.trail_bang` | băng lách cách | chạy |
| Tinh Hà Bộ (`trail_sao`) | ☆ | `hy-trail-stars` | `fx.cos.trail_sao` | chuông nhỏ lấp lánh | chạy, đêm |

Vệt bước tắt trong điện thờ (phần 12 §3.3).

### 3.7 Ngự vật (5)

| Món | Bậc | Biểu tượng | Hiệu ứng | Âm (lặp khi bay) | Xem thử |
|---|---|---|---|---|---|
| Ngự Kiếm (`kiem`) | ○ mặc định | `hy-mount-sword` | `fx.cos.mount_kiem` | `SFX-FLY-010` | bay (xem được khi chưa mở bay) |
| Cân Đẩu Vân (`may`) | △ | `hy-mount-cloud` | `fx.cos.mount_may` | `SFX-FLY-011` | bay |
| Hồ Lô Phi Hành (`ho_lo_bay`) | △ | `hy-mount-gourd` | `fx.cos.mount_holo` | `SFX-FLY-012` | bay |
| Liên Hoa Đài (`dai_sen`) | ☆ | `hy-mount-lotus` | `fx.cos.mount_sen` | `SFX-FLY-013` | bay |
| Tiên Hạc (`hac`) | ✺ VIP | `hy-mount-crane` | `fx.cos.mount_hac` | `SFX-FLY-014` | bay |

### 3.8 Khung tên (5)

| Món | Bậc | Biểu tượng | Hiển thị (CSS đã có) | Xem thử |
|---|---|---|---|---|
| Khung Mộc (`khung_tron`) | ○ mặc định | `hy-frame` | nhãn tên thường | — |
| Tường Vân (`khung_may`) | ◇ | `hy-frame-cloud` | `.hq-frame-khung_may` | nhãn tên trên đầu nhân vật trong phòng thử |
| Liên Đài (`khung_sen`) | △ | `hy-frame-lotus` | `.hq-frame-khung_sen` | như trên |
| Bích Ngọc (`khung_ngoc`) | △ | `hy-frame-jade` | `.hq-frame-khung_ngoc` | như trên |
| Kim Long (`khung_long`) | ✺ điểm danh 7 ngày | `hy-frame-dragon` | `.hq-frame-khung_long` (★ thay 🐉 bằng hình Huyền Ấn) | như trên |

**Tổng:** 8 + 7 + 8 + 5 + 7 + 6 + 5 + 5 = **51 món** (khớp canon §7).

### 3.9 Luật trình bày món

1. Thẻ món luôn ghi bậc bằng **chữ + ký hiệu** (không chỉ màu viền `--rc`).
2. Món có hiệu ứng nhấp nháy (Cửu Thiên Lôi Quang) ghi nhãn «có ánh chớp nhẹ» trên thẻ.
3. Món VIP / khóa ghi điều kiện mở bằng câu đầy đủ (đã có `🔒 VIP · cấp 10 · điểm danh 7 ngày`).
4. Mô tả món (trường `desc`) giữ giọng hiện có — ngắn, gợi hình — và **không** dùng từ «may mắn», «tài lộc», «hộ mệnh» theo nghĩa có tác dụng thật (P6). Trâm Gỗ Đào hiện có câu «trừ tà, giữ tâm» — đề xuất sửa thành «gỗ đào, theo tục xưa dùng để giữ tâm an» để không ngụ ý tác dụng trừ tà thật.
