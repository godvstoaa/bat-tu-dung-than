# 04-33 · Nghiệm thu tổng hợp tài liệu 04

Gộp mọi checklist cuối phần thành một danh sách duy nhất có **cách kiểm** và **nơi kiểm**, để QA chạy một lượt. Cột «Cách»: **T** = kiểm thử tự động (`scripts/test-game-menhban.mjs`), **S** = thống kê (seed cố định), **U** = kiểm thử giao diện (Playwright qua `window.__hq`), **R** = duyệt nội dung bằng người, **C** = quét chữ tự động.

## 1. Nguồn và tất định

| # | Điều kiện | Cách | Tham chiếu |
|---|---|---|---|
| A01 | Mọi chỉ số Tiên Thiên lấy từ `analyze()` và hàm đọc `R`; không công thức bói mới | R | 04-01 N1 |
| A02 | `buildMenhBan` thuần, không `Date.now()`, không DOM | T | 04-01 §4 |
| A03 | `R.asOfYear` được đặt trước `analyzeVitality` | T | 04-01 E3 |
| A04 | Tiên Thiên giống hệt ở `refYear` 2000 / 2026 / 2040 | T | 04-12 §7.2 P9 |
| A05 | `refYear` lấy từ `thaitue.js › suiYear` | T | 04-08 §6.4 |
| A06 | `synthesis` rỗng → không tạo nhân vật, không gán điểm mặc định | T | 04-01 §6 |
| A07 | Tiên Thiên đóng băng trong mùa; đổi engine → đọc lại ở ranh mùa | T + U | 04-01 §7.3 |
| A08 | Dấu vân tay engine từ 8 mẫu | T | 04-01 §7.2 |

## 2. Từng chỉ số

| # | Điều kiện | Cách | Tham chiếu |
|---|---|---|---|
| B01 | 45 + ΣΔ(factors) = score trên 4.000 lá | T | 04-02 §3 |
| B02 | Phẩm căn theo ngưỡng số; ca ranh 27/28/35/36/…/80/86 | T | 04-19 §7 |
| B03 | Bảng Phúc theo bậc đúng 2 chữ số | T | 04-02 §5.3 |
| B04 | Lực = round(pct × k); đúng một hành ×1,3, một hành ×0,8 | T | 04-03 §1 |
| B05 | Tầng hiệu dụng = tangOf(Lực + Bổ); Bổ trần 20, 3/tuần | T | 04-03 §3 |
| B06 | Mức Thân Lực lấy từ engine; ca `MAU-B` 62 vượng / `MAU-C` 62 quá vượng | T + U | 04-03 §4.3 |
| B07 | Nhận trợ ×1,5 cho nhược và quá nhược | T | 04-03 §4.2 |
| B08 | Dụng/Hỷ/Kỵ/Cừu/Nhàn là hoán vị 5 hành | T | P3 |
| B09 | Ngũ Duy có trục 100; TM = 1 + score/500; Bổ Khuyết +0,25 chỉ trục yếu | T | 04-04 |
| B10 | Mệnh Cách DK ⇔ `pattern.type === 'special'` | T | 04-05 §2.1 |
| B11 | Mọi `via` (kể cả `*-tougan`, `*-tang`, `latent-*`) có tên game | T | 04-05 §2.7 |
| B12 | Số lần hái = `rescues.length`; số vị = số nhóm khác nhau | T | 04-05 §2.6 |
| B13 | Không hiển thị `levelVi`, `note` của `classifyChartLevel` | C | 04-05 §3.3 |
| B14 | NK tối đa ∈ [100, 150]; NK = 0 không giảm thưởng | T | 04-05 §4 |
| B15 | 30 Đặc Tính; bậc II chỉ sao tra theo chi ≥ 2 trụ; khóa lạ không làm hỏng | T | 04-06 §2 |
| B16 | Kiếp số không trừ chỉ số; sao Đức bớt một chặng | T + R | 04-06 §2.3 |
| B17 | Quý Khí khớp `assessment.level` 15 mẫu; Tự Tạo Quý Nhân tối đa 5 | T | 04-06 §4 |
| B18 | Tâm ma lưu Δ; tầng ải = 1 + floor(v/25); tạp niệm không đổi tần suất | T | 04-07 §3 |
| B19 | 30 nạp âm có danh xưng; `compat` viết tắt được chuẩn hóa | T | 04-07 §5 |
| B20 | 17 cờ tổ hợp + `:che`, `:hinh` | T | 04-07 §6 |
| B21 | Trần ngày trước NT; `eff(80)=70`, `eff(150)=93` | T | 04-08 §1.2 |
| B22 | Hai ví dụ tính tay 23,6 và 37,4 | T | 04-08 §1.3 |
| B23 | Cảnh giới theo `daoHanhCaoNhat`; bậc 4+ bỏ Căn Cơ; bậc 6 cần Quy nhất | T | 04-08 §3 |
| B24 | Bảng ngày lên bậc tái tạo được | T | 04-08 §4 |
| B25 | Thời Vận âm không trừ; R2 Thời Vận ≤ 10%; R3 thử thách ≤ 30% | T | 04-08 §6.2 |
| B26 | `liunian.score` âm không làm vỡ giao diện | U | 04-19 §8 |

## 3. Ca biên

| # | Điều kiện | Cách | Tham chiếu |
|---|---|---|---|
| C01 | Giờ không rõ: dựng 12:00, lưu khoảng, chấm «?», không câu «giờ … cao hơn» | T + U + C | 04-11 §2 |
| C02 | Giờ Tý: ghi chú [22:30, 23:30]; hiển thị `solarInput` | U | 04-11 §3 |
| C03 | Sinh sát tiết < 90 phút: cảnh báo | U | 04-11 §4 |
| C04 | Năm sinh trong khoảng UTC+8/+9 (miền Nam): hỏi trừ 1 giờ | U | 04-11 §5.3 |
| C05 | Âm lịch + nhuận; lỗi «không có tháng nhuận» | T | 04-11 §6 |
| C06 | Chặn ngày sinh tương lai; giữ min 1900 / max 2100 | U | 04-11 §7 |
| C07 | Sửa bát tự: giữ / đổi đúng bảng; quy đổi `dhKhongNT` | T | 04-11 §9 |
| C08 | Tách giới tính lá số và dáng nhân vật | U | 04-11 §10 |
| C09 | Đồng hồ máy lùi / tới không cho lợi | T | 04-11 §11 |

## 4. Giao diện, khả năng tiếp cận, riêng tư

| # | Điều kiện | Cách | Tham chiếu |
|---|---|---|---|
| D01 | Năm vòng + tâm; điện thoại chuyển accordion; vùng chạm ≥ 44 px | U | 04-12 §2 |
| D02 | Không dựa vào màu; chữ Hán trên cung; Kỵ là «cửa son» | U + R | 04-12 §3 |
| D03 | Bàn phím đi hết; Enter mở «Vì sao?»; Esc đóng; `T` đổi chế độ | U | 04-12 §3 |
| D04 | Bảng chữ đủ 15 mục, bật được cho mọi người | U | 04-27 §2 |
| D05 | `prefers-reduced-motion` tắt hiệu ứng | U | 04-12 §2.6 |
| D06 | Tập công khai không chứa ngày sinh / tứ trụ / Túc Nghiệp / tâm ma / Đặc Tính | T | 04-12 §6 |
| D07 | Ẩn được: bách phân vị, Mệnh Cấp, Túc Nghiệp, tâm ma; cột Tiên Thiên ẩn mặc định | U | 04-13 §6 |
| D08 | Chế độ «Chỉ đường, không số» không đổi thưởng | T + U | 04-13 §6 |
| D09 | Ca 13 / 18 Đặc Tính hiển thị đúng ở 375 px | U | 04-19 §3 |

## 5. Ngôn từ và an toàn

| # | Điều kiện | Cách | Tham chiếu |
|---|---|---|---|
| E01 | Quét DOM không thấy chữ 04-13 §4.1 ở mặt trước | C | 04-13 §4 |
| E02 | Rating Thời Vận hiển thị tên game | U | 04-13 §4.3 |
| E03 | Mọi tooltip mức thấp có Sự thật → Ý nghĩa → Lối đi | R | 04-13 §3 |
| E04 | Không thoại NPC nào chứa con số Tiềm Lực | C | 04-13 §2.2 |
| E05 | Khổng tiên sinh luôn có cơ chế phản bác trong cùng cảnh | R | 04-13 §5 |
| E06 | Không nội dung thương tích, bệnh, thai sản, hôn nhân đời thực, khác biệt giới | R + C | 04-06 §2.4 |
| E07 | Không dùng `health`, `finance`, `love`, `career` của hồ sơ tính cách | T | 04-07 §4 |
| E08 | Lời miễn trừ Lục Đạo hiện nguyên văn (đã sửa «KHÔ») | U | 04-07 §1 |
| E09 | Không SKU nào cộng chỉ số Tiên Thiên hay Hậu Thiên; Thái Tuế không bán gì | R | 04-13 RB5 |
| E10 | Kết phù chỉ dùng ký tự hư cấu | R | canon T6 |

## 6. Kịch bản

| # | Điều kiện | Cách | Tham chiếu |
|---|---|---|---|
| F01 | Mọi cảnh `STAT-CANH-*` có điều kiện kích hoạt và điểm quay về luồng chính | R | 04-14 … 04-30 |
| F02 | Không minigame nào có thất bại vĩnh viễn | R + U | 04-14 §8 |
| F03 | Cảnh từ chối Nghịch Thiên không có tín hiệu thất bại | R + U | 04-14 §1.4 |
| F04 | Ải tâm ma: «nắm giữ» lặp, không trừ; thoát giữ tiến độ | T + U | 04-26 |
| F05 | Ải Mạn chỉ Thiên Đạo hoặc PC9–PC10, không công tu | T | 04-15 §2.5 |
| F06 | Mỗi Đặc Tính có móc | R | 04-16 §7 |
| F07 | Biến `{…}` có giá trị cho mọi lá số (kể cả Ngũ Duy lỗi, Dụng phụ rỗng) | T | 04-14 §8 |
| F08 | 15 đầu ra «Thầy đọc Mệnh Bàn» khớp khuôn | T | 04-31 |

## 7. Cân bằng (theo dõi sau phát hành)

| # | Chỉ báo | Báo động | Tham chiếu |
|---|---|---|---|
| G01 | Phân bố Mệnh Cách NT / DC / DK / TT | lệch > 2 điểm % so với 50,9 / 32,2 / 15,0 / 1,9 | 04-12 §7.3 |
| G02 | Trung vị cảnh giới PC1–PC2 so với PC7+ | PC7+ hơn quá 1 bậc | 04-18 §5 |
| G03 | Tỉ lệ bật «Chỉ đường, không số» ở PC1–PC3 | > 30% | 04-18 §5 |
| G04 | Tỉ lệ Sửa bát tự lần 2+ | > 15% | 04-18 §5 |
| G05 | Người Nghịch Thiên rời trước hết Hồi I | cao hơn chung 20% | 04-18 §5 |
| G06 | Hệ số Đạo Hạnh trung bình PC1 / PC9+ | > 1,6 | 04-27 §1.5 |

## 8. Định nghĩa «xong» của tài liệu 04

Tài liệu 04 được coi là hiện thực xong khi: mọi dòng **T** xanh trong `npm run test:game`; mọi dòng **U** qua một lượt Playwright trên web và một lượt trên iOS (với các tính năng iOS tắt theo `features.js`); mọi dòng **R** có chữ ký người duyệt (nội dung + văn hóa/tôn giáo theo 14); mọi dòng **C** không có kết quả trúng; các chỉ báo **G** được nối vào bảng theo dõi của 13.
