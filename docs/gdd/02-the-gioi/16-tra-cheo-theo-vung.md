# 02 · Phần 16 — Tra chéo theo vùng (cho đội level, nhiệm vụ, NPC)

> Mỗi vùng một thẻ tra: thứ gì của tài liệu 02 «sống» ở vùng ấy. Dùng khi dựng vùng (tài liệu 07), viết nhiệm vụ phụ `SQ-<region>-xx` (tài liệu 03), đặt NPC (tài liệu 06), làm sự kiện (tài liệu 10).
> Cột **Gợi ý SQ** là **chủ đề** nhiệm vụ phụ rút từ lore (tài liệu 03 cấp mã và viết kịch bản). Mọi chủ đề tuân T3 (không giao tranh) và T6.

---

## 16.1 Huyền Thành `thanh`

| Loại | Mục |
|---|---|
| NPC canon | `thay_tubinh`, `khong_tiensinh`, `gac_cong`, `tho_may` |
| Phe | FAC-001, 020, 022, 023, 026, 032 |
| Lịch sử | HIS-011 → 018, 031, 046, 047, 050, 062, 067, 073 → 076, 083, 087, 091, 092, 094, 098, 099 |
| Codex | LORE-001–003, 017, 019, 020, 301–303, 306, 334–336, 340–348, 397, 398, 402, 403, 419, 420, 439, 464 |
| Văn bản | 13.1, 13.2, 13.3, 13.4, 13.5, 13.8, 13.14, 13.17, 13.18, 13.19 |
| Truyện | 1, 2, 10, 11, 18, 27, 29, 30 |
| Code đã có | `court.js`, `sect.js`, `ROOMS › chinhdien, vanmenh, thaitue`, `HALLS › hophon`, `thienBan` |
| Gợi ý SQ | minh oan sạp thầy bói thật (Kính Chiếu Gian); giúp bà Tư mở thêm lò bánh nứt; gỡ hình nhân yểm trong nhà họ Đỗ (cùng Mộc Tượng Đường); đọc lại 9 ngày biện luận cho Khổng tiên sinh; đưa lịch quan bút ký tới Hội Đồng |

## 16.2 Am Vân Cốc `vancoc`

| Loại | Mục |
|---|---|
| NPC canon | `van_coc` |
| Lịch sử | HIS-061, 094 |
| Codex | LORE-063, 075, 076, 185, 339, 340, 391, 471 |
| Văn bản | 13.15 |
| Truyện | 30 |
| Gợi ý SQ | nhận Sổ Công Quá; ngồi một đêm giờ Hợi; mang bồ đoàn cỏ từ góc chợ về am |

## 16.3 Tử Bình Phong `tubinh`

| Loại | Mục |
|---|---|
| Phe | FAC-001 (chi Tử Bình), FAC-013 |
| Lịch sử | HIS-038, 043 |
| Codex | LORE-003, 078, 079, 084, 127, 174, 178, 182, 283, 349, 350, 422 |
| Truyện | 6, 7, 28 |
| Code đã có | `HALLS › cachcuc`, `ROOMS › laoquan` |
| Gợi ý SQ | tìm đệ tử bỏ núi vì tưởng «cách xấu»; khảo Thập Can Đạo; chép vách bảy lá số (mời người chơi Dị Cách) |

## 16.4 Manh Phái Cốc `manh`

| Loại | Mục |
|---|---|
| Phe | FAC-027 |
| Lịch sử | HIS-058 |
| Codex | LORE-183, 351, 454, 499 |
| Truyện | 8, 9 |
| Code đã có | `HALLS › tuongphap` |
| Gợi ý SQ | dẫn thầy mù sang Huyền Thành giảng; sửa chuông gió lệch tiếng; tìm người dẫn đường bị Thầy Mượn Uy mua chuộc |

## 16.5 Trích Thiên Đỉnh `trichthien`

| Loại | Mục |
|---|---|
| Phe | FAC-001 (chi Tử Vi) |
| Lịch sử | HIS-008, 042, 065 |
| Codex | LORE-005–008, 163, 164, 176, 352, 353, 412, 415, 445 |
| Code đã có | `HALLS › tuvi`, `ROOMS › daumau` |
| Gợi ý SQ | làm sạch Mẫu Trì; thắp đèn thất tinh; bán lụa Mẫu Trì không qua Bà Gật Gù |

## 16.6 Cùng Thông Hồ `cungthong`

| Loại | Mục |
|---|---|
| Phe | FAC-001 (chi Điều Hậu), 021, 023 |
| Lịch sử | HIS-019, 064 |
| Codex | LORE-011, 173, 177, 354, 409, 416, 450 |
| Truyện | 3, 15, 16 |
| Code đã có | `HALLS › dieuhau` |
| Gợi ý SQ | chuyến đò đêm giông (từ chối chở người say); trả lưới cho làng chài bị phán «phạm thủy sát»; khôi phục kênh trăm người |

## 16.7 Thư Lâu Lâm `thulau`

| Loại | Mục |
|---|---|
| Phe | FAC-029, 017 (thư sinh) |
| Lịch sử | HIS-016, 022 → 024, 039, 054, 057, 070, 093 |
| Codex | LORE-009, 101–105, 117, 129, 133, 175, 180, 181, 355, 356, 411, 457, 463, 468, 479 |
| Văn bản | 13.1, 13.8, 13.19 |
| Truyện | 23 |
| Code đã có | `HALLS › thuvien`, `ROOMS › vanxuong` |
| Gợi ý SQ | tìm bản dập Bàn Minh; bắt «con mối» đổi bản chép (Thời Lão); xin dầu đèn cho thư sinh; thức đêm Canh Thân |

## 16.8 Phong Thủy Viên `phongthuy`

| Loại | Mục |
|---|---|
| Phe | FAC-030 |
| Lịch sử | HIS-059, 084 |
| Codex | LORE-087, 135, 171, 172, 287, 305, 357, 394, 443, 494 |
| Code đã có | `HALLS › duongtrach`; `fs-cure › SHA_LIST` |
| Gợi ý SQ | so kim la bàn của gia đình mua La Bàn Giả; ở thử nhà ba mùa; giải án «nhà không yên» trước khi gửi sang Mao Sơn / Long Hổ |

## 16.9 Lịch Đường `lichduong`

| Loại | Mục |
|---|---|
| Phe | FAC-028, 020 |
| Lịch sử | HIS-021, 022, 060, 078, 088, 097 |
| Codex | LORE-025, 286, 304, 358, 404, 432, 470, 474, 477, 492 |
| Văn bản | 13.10 |
| Truyện | 12 |
| Code đã có | `HALLS › trach` |
| Gợi ý SQ | thu hồi lịch giả; chọn ngày cưới cho đôi trẻ bị dọa; tìm con gà gáy giờ; vạch trần quầy Đổi Mệnh đầu tiên (Hồi I) |

## 16.10 Long Hổ `longho`

| Loại | Mục |
|---|---|
| NPC canon | `truong_thiensu` |
| Phe | FAC-002, 003 |
| Lịch sử | HIS-025, 027, 045, 095 |
| Codex | LORE-013, 030, 044, 122, 123, 130, 146, 307, 308, 359, 360, 404, 423, 436, 455, 459 |
| Gợi ý SQ | «nhà không yên» theo thứ tự phong thủy → phù; sửa bè sau giông; tìm người bán phù giả mạo danh Long Hổ (Gã Gán Số) |

## 16.11 Võ Đang `vodang`

| Loại | Mục |
|---|---|
| NPC canon | `huyen_hu`, `dan_dinh` |
| Phe | FAC-004, 005 |
| Lịch sử | HIS-028, 033, 041, 056 |
| Codex | LORE-010, 032, 037, 040, 043, 049, 112, 116, 118–121, 125, 126, 154–162, 169, 309, 310, 361–363, 410, 417, 446, 458 |
| Truyện | 4, 5 |
| Gợi ý SQ | đưa người khuân vác già xuống khám bệnh; đặt hộ viên đá của người hành hương đã mất; phụ vườn dược thảo Lò Đan |

## 16.12 Chung Nam `chungnam`

| Loại | Mục |
|---|---|
| NPC canon | `khau_daotruong` |
| Phe | FAC-006, 007, 013 |
| Lịch sử | HIS-030, 048, 049 |
| Codex | LORE-004, 016, 046–048, 106–108, 132, 140, 143–145, 151, 152, 165, 167, 168, 311, 312, 364, 365, 424, 435, 437 |
| Gợi ý SQ | quét tuyết tới động tu cao nhất (câu nói của ẩn sĩ); đưa thư vân thủy; phơi hồng trước mưa |

## 16.13 Mao Sơn `maoshan`

| Loại | Mục |
|---|---|
| NPC canon | `maoshan_daonhan` |
| Phe | FAC-008, 009 |
| Lịch sử | HIS-029, 032, 036, 096 |
| Codex | LORE-033–035, 039, 109–111, 113, 313, 314, 366, 367, 407, 409, 421, 485–487 |
| Truyện | 13, 14 |
| Gợi ý SQ | ông lão ma đè; đưa sản phụ qua đêm giông; đổi bùa giả lấy trà và lời khuyên |

## 16.14 Yên Tử `yentu`

| Loại | Mục |
|---|---|
| NPC canon | `truclam_thiensu` |
| Phe | FAC-014, 024 |
| Lịch sử | HIS-040, 051, 052 |
| Codex | LORE-061, 069–071, 191, 195, 197, 198, 315, 316, 368–371, 408, 425, 454 |
| Truyện | 19 |
| Gợi ý SQ | dẫn người già leo dốc; dựng lại tháp đá ong; nghe công án một tháp |

## 16.15 Bút Tháp `buttap`

| Loại | Mục |
|---|---|
| NPC canon | `dieu_am` |
| Phe | FAC-015 |
| Lịch sử | HIS-037, 063, 080, 081 |
| Codex | LORE-057–060, 062, 065–068, 188, 192–194, 196, 199, 317, 318, 372, 373, 408, 413, 418, 421, 428, 456, 461, 466, 493, 496 |
| Văn bản | 13.20 |
| Truyện | 20, 21 |
| Gợi ý SQ | chuộc ruộng nhà họ Lương (đối chất Cô Tiểu Nguyệt); phóng sinh đúng loài; dạy chữ ở Nhà Tạm Trú |

## 16.16 Tạng Địa `tangdia` (chờ tham vấn)

| Loại | Mục |
|---|---|
| NPC canon | `lama_dakiet` (chờ tham vấn) |
| Phe | FAC-016 |
| Lịch sử | HIS-055 |
| Codex | LORE-063, 067, 319–321, 374, 375, 429, 452, 460 |
| Gợi ý SQ (khung an toàn) | dẫn người hành hương lạc đường; tìm yak lạc trong bão tuyết |

## 16.17 Văn Miếu `vanmieu`

| Loại | Mục |
|---|---|
| NPC canon | `te_tuu` |
| Phe | FAC-017, 012 |
| Lịch sử | HIS-044, 053, 082 |
| Codex | LORE-038, 050, 064, 072–075, 185, 187, 322, 323, 376–378, 426, 434, 444, 448, 476, 484, 488, 489 |
| Văn bản | 13.9 |
| Truyện | 22, 23 |
| Gợi ý SQ | chép sách thuê giúp nho sinh nghèo; tổ chức biện hoặc về «năm tuổi»; tìm người xứng với bia không tên |

## 16.18 Phong Đô `phongdo`

| Loại | Mục |
|---|---|
| NPC canon | `phan_quan`, `diatang_su` |
| Phe | FAC-010, 019, 011 |
| Lịch sử | HIS-020, 034, 035, 068, 086 |
| Codex | LORE-012, 014, 051–057, 141, 145, 166, 193, 261–271, 324–326, 332, 379–384, 413, 438, 462, 478 |
| Văn bản | 13.6, 13.13 |
| Truyện | 24, 25 |
| Gợi ý SQ | lo tang lễ tử tế cho một gia đình làng Cửa Núi (chống «lễ siêu thoát giá cao»); đưa thư Phán quan lên Sơn Môn; kết thúc Tà Lộ (Hồi Đầu) |

## 16.19 Miêu Cương `mieucuong`

| Loại | Mục |
|---|---|
| NPC canon | `vu_y_amau`; `lo_ban_su` ở hang lò cổ **ngoài trại** |
| Phe | FAC-025, 021; FAC-018 (hang) |
| Lịch sử | HIS-010, 066, 077, 085 |
| Codex | LORE-024, 327–330, 385–388, 399, 427, 430, 431, 453, 465 |
| Văn bản | 13.16 |
| Truyện | 26, 27 |
| Gợi ý SQ | minh oan cho trại (mời người tung tin ra cầu phong vũ đối chất theo hiệp ước); mở lại chợ Muối – Thuốc; bán vải chàm không qua trung gian |

## 16.20 Côn Lôn `conlon`

| Loại | Mục |
|---|---|
| Lịch sử | HIS-003 → 006, 100 |
| Codex | LORE-015, 389, 390, 440, 441, 469 |
| Gợi ý | không có SQ; chỉ vĩ thanh `MQ-E-xx` |

---

## 16.21 Tra chéo theo NPC canon

| NPC | Phe | Vùng | HIS liên quan | LORE / văn bản liên quan |
|---|---|---|---|---|
| `thay_tubinh` | FAC-001 | Huyền Thành | 015, 062, 091, 099 | 303; 13.4 (điều Sáu), 13.12 (bút phê) |
| `khong_tiensinh` | độc lập | Huyền Thành → chợ | 076, 078 | 077; 13.8, 13.19; truyện 29 |
| `van_coc` | thân FAC-001 | Am Vân Cốc | 061, 094 | 076, 339, 340; 13.15; truyện 30 |
| `truong_thiensu` | FAC-002 | Long Hổ | 025, 095 | 030, 307, 308 |
| `huyen_hu` | FAC-004 | Võ Đang | 041, 056 | 049, 118, 154 |
| `khau_daotruong` | FAC-006 | Chung Nam | 048, 049 | 047, 144, 167 |
| `maoshan_daonhan` | FAC-008 | Mao Sơn | 096 | 313, 314; truyện 13 |
| `truclam_thiensu` | FAC-014 | Yên Tử | 051 | 069, 191, 198 |
| `dieu_am` | FAC-015 | Bút Tháp | 081 | 059, 199, 496; truyện 20, 21 |
| `lama_dakiet` | FAC-016 | Tạng Địa | 055 | chờ tham vấn |
| `te_tuu` | FAC-017 | Văn Miếu | 082 | 072, 074; 13.9 |
| `phan_quan` | FAC-019 | Phong Đô | 086 | 053, 325; 13.13 |
| `diatang_su` | FAC-019 | Phong Đô | — | 057, 384 |
| `vu_y_amau` | FAC-025 | Miêu Cương | 085 | 330; truyện 27 |
| `lo_ban_su` | FAC-018 | hang lò cổ | 075, 077, 087 | 088 (tổ nghề bị mạo danh), 184, 332, 334; 13.17, 13.18 |
| `gac_cong` | FAC-001 | Sơn Môn | 092 | 342 |
| `tho_may` | FAC-032 | Huyền Thành | 072 | — |
| `dan_dinh` | FAC-005 | Võ Đang | 028 | 031 (tiền nhân), 309; truyện 5 |
| `phuong_si` | FAC-013 | lang thang | — | 349 (vách bảy lá số) |

## 16.22 Tra chéo Định Mệnh Hội theo vùng (vị trí quầy và Hạn Chủ)

| Cụm vùng | Hạn Chủ | Mánh | Vị trí quầy gợi ý | Bằng chứng để vạch trần |
|---|---|---|---|---|
| Lịch Đường – Cùng Thông | Bà Kim Thoa | DP6 | góc chợ Đông; bến Làng Chài | Lịch Quan bút ký (13.10) |
| Huyền Thành | Ông Lưỡng Khẩu | DP8 | góc Đông chợ Trung Tâm | sổ ghi lời quầy hai ngày khác nhau |
| Bút Tháp – Văn Miếu | Cô Tiểu Nguyệt | DP3 | chợ phiên Đình Tổ; phố Học | biên nhận 72 lễ (13.20) + lá số con trai họ Lương |
| Tử Bình – Phong Thủy Viên | Lão Câu Mồi | DP1 | Xóm Thập Can; Xóm La Kinh | La Bàn Tổ (LORE-305) |
| Thư Lâu – Manh Phái | Thầy Mượn Uy | DP4 | Lều Thư Sinh; Xóm Dẫn | bản Bàn Minh đủ 16 chữ |
| Trích Thiên – Miêu Cương | Bà Gật Gù | DP5 | Trạm Đầu Nguồn; chợ đèo Muối | hiệp ước Muối – Thuốc (13.16) |
| Long Hổ – Mao Sơn – Chung Nam | Gã Gán Số | DP2 | Thượng Thanh Trấn; Trấn Trúc | lệnh cấm phù bán (HIS-095) + `yong.primary` thật của khách |
| Yên Tử – Phong Đô – Tạng Địa | Người Không Tên | DP7 | làng Giải Oan; làng Cửa Núi | Hương ước thứ hai, điều bốn (13.3) |
| (không có) | — | — | **Am Vân Cốc** | — |
