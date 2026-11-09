# 05-14 · Quy nhất, cân bằng, chống khai thác, bản iOS

> Phần cuối của tài liệu 05: điều kiện **Quy nhất** và hậu cảnh giới 6 (Côn Lôn), **bảng cân bằng** Đạo Hạnh theo nguồn / theo đạo / theo kiểu người chơi, **ma trận chống khai thác**, phần **máy chủ chứng thực**, chỉ số theo dõi, và **bản iOS** (chỉ tu tâm, học, việc thiện; không đoán vận).
> Mã nhiệm vụ: `CQ-QN-xx`.

---

## 1. Quy nhất

### 1.1 Định nghĩa

Canon: «Quy nhất = tu ≥ 3 đạo thống + Sổ Công Quá dương → mở Côn Lôn». Bậc 6 (Luyện Hư Hợp Đạo / Giải Thoát / Thánh Hiền, 4.500 Đạo Hạnh) **cần** Quy nhất (canon §9.1). Game đặc tả thành 7 điều kiện, tất cả kiểm bằng máy:

| # | Điều kiện | Kiểm | Lý do |
|---|---|---|---|
| QN-1 | **≥ 3 đạo thống chính** đạt hạng **III (đắc pháp)** | `caimenh.paths[*].rank ≥ 3`, chỉ tính CN, TV, TC, TT, BD, TH, TD, MT, NH (không tính BM, LP) | «tu ≥ 3 đạo» — hạng III là mức «đắc pháp» (05-06 §3.1) |
| QN-2 | **Sổ Công Quá dương** — công hữu hiệu ròng đời > 0 **và** không có dòng quá chưa cải nào cũ hơn 30 ngày | `congHuuHieu > 0`; `ledger` | «Sổ dương» + tinh thần cải quá |
| QN-3 | **Nợ Âm = 0** | `amBai.noAm === 0` | ai đi Tà Lộ phải về trước |
| QN-4 | **Không thanh nghiệp nào ≥ 50** | `karma[*] < 50` | — |
| QN-5 | **Mệnh Đồ trọn 6 nút ít nhất một lần** | `menhDo.nodes[*].doneOnce` | «không ai được miễn tu» (canon §5.1) |
| QN-6 | **Đại Nguyện Thứ Nhất** (300 công) | `vows` chứa 1 | đã là điều kiện bậc 5; nhắc lại cho rõ |
| QN-7 | Xong chuỗi **«Ba Đường Một Lòng»** `CQ-QN-01…07` | nhiệm vụ | cảnh quy nhất có chuyện, không chỉ là hộp kiểm |

**Không yêu cầu:** đạo Mật (lớp Tạng truyền chưa tham vấn), Thập Thiện Viên Mãn, Đại Nguyện 2–3, viên mãn đạo nào. Các mục này là **tùy chọn** và có khung tên riêng.

**Lựa chọn thiết kế có chủ đích:** người chơi không theo đạo nào (chỉ Pháp Môn Liễu Phàm) đi được tới bậc 5, **không** tới bậc 6. Côn Lôn là «quy nhất» — gặp nhiều đường rồi thấy chúng về một. Vân Cốc nói rõ điều này từ sớm (05-11 §C), không giấu.

### 1.2 Chuỗi «Ba Đường Một Lòng» (`CQ-QN`)

| Mã | Tên | Mục tiêu | Nơi · NPC | Dạy | Thưởng |
|---|---|---|---|---|---|
| CQ-QN-01 | Ba người thầy | khi QN-1 đạt: Vân Cốc gửi thư «con đi ba đường rồi, về am uống trà» | `vancoc` · `van_coc` | — | B 20 |
| CQ-QN-02 | Một câu từ mỗi đường | về ba thánh địa, xin NPC dẫn của mỗi đạo **một câu dạy** cho người sắp «quy nhất» (lời viết riêng theo cặp đạo, tài liệu 06) | 3 thánh địa | — | B 30 |
| CQ-QN-03 | Ma trận | mở «So các đạo» (`compareMatrix` của 3 đạo đã tu); trả lời Vân Cốc: ba đạo **khác** nhau ở chiều nào, **giống** nhau ở việc gì | `vancoc` | `COMPARE_DIMS` | B 30 |
| CQ-QN-04 | Tam giáo một nhà | đọc thẻ «tam giáo hợp nhất» (`quanzhen.canon`) và «Nho – đạo hợp nhất» (`jingming.distinctive`); viết (chọn ghép) một câu «điều ba đường cùng dạy» | `chungnam` hoặc `vanmieu` | `SCHOOLS` | B 30 |
| CQ-QN-05 | Cây cầu | sự kiện tổ đội: dựng lại cầu treo nối Huyền Thành với chân núi Côn Lôn (DEED-191 cỡ lớn) — mỗi người góp theo đạo của mình (phù an cầu — CN; tĩnh tọa giữ nhịp — TH; khoa nghi khánh thành — TC…) | chân Côn Lôn | — | B 50; DEED ×2 |
| CQ-QN-06 | Người đi sau | dẫn ≥ 1 người chơi (hoặc 3 NPC đệ tử nếu không có) qua một nút Mệnh Đồ của họ | mọi | sư đồ | B 40 |
| CQ-QN-07 | Lên Thiên Trì | khi đủ QN-1…QN-6 **và** Đạo Hạnh ≥ 4.500: cùng Vân Cốc lên đảo trời; lễ đột phá bậc 6 ở bờ Thiên Trì | `conlon` | — | B 0 (lễ); **bậc 6** |
| CQ-QN-08 | Thiên Mệnh Bàn | đứng trước Thiên Mệnh Bàn (canon Vĩ thanh); góp công hữu hiệu tuần này vào **Sổ Thiên Mệnh** của máy chủ (05-03 §7.2) | `conlon` | — | — (đây là việc chung) |
| CQ-QN-09 | Lời kết | cảnh kết của Vân Cốc (canon: «Mệnh con vẫn vậy: tám chữ ấy không đổi một nét. Nhưng người mang tám chữ ấy đã khác.») — biến thể theo chí (CQ-MD-72) | `conlon` | — | khung «Thiên Bảng» |
| CQ-QN-10 | Mùa mới | sau Lập Xuân kế tiếp: Mệnh Đồ năm mới; Thiên Bảng mùa mới; Côn Lôn mở hoạt động hậu cảnh giới (§1.3) | — | — | — |

### 1.3 Sau bậc 6

Đạo Hạnh **không có trần** và **không reset**. Người chơi bậc 6 làm gì:

| Hoạt động | Mô tả | Thưởng |
|---|---|---|
| **Thiên Trì tọa** | thiền / tĩnh tọa / niệm ở bờ Thiên Trì theo đạo bất kỳ | như hoạt động lõi; Thiên Trì cho cảnh và nhạc riêng |
| **Truyền đạo** | sư đồ (05-06 §8; canon §10) — ưu tiên dẫn người lá số thấp: đệ tử có Tiềm Lực < 36 xong một nút Mệnh Đồ → sư phụ +1 công thêm (vẫn trong nhật hạn) | công |
| **Thiên Mệnh Bàn** | sự kiện mùa: tổng công máy chủ chạm mốc → cảnh chung | cảnh, khung tên mùa |
| **Đại Nguyện 2–3** | nếu chưa đạt | 05-03 §4 |
| **Viên mãn các đạo** | mỗi đạo hạng V | 05-07…05-11 |
| **Hồi Đầu · người đã về** | (nếu có danh hiệu) đứng cầu Nại Hà | 05-12 §8 |
| **Thiên Bảng** | xếp theo Đạo Hạnh, chốt mỗi tháng âm | thẩm mỹ |

---

## 2. Cân bằng Đạo Hạnh

### 2.1 Nguồn và tỷ trọng mục tiêu

| Nhóm nguồn | Thành phần | Tỷ trọng mục tiêu tới bậc 6 (người chơi đều đặn) | Nhân k | Nghịch Duyên | Chịu nhật hạn ĐH |
|---|---|---|---|---|---|
| **Công** (Sổ Công Quá) | DEED thiện hữu hiệu (`B = 2 × p × count`) | 25% | có | không | **không** (có nhật hạn công riêng 15) |
| **Tu** | hoạt động lõi của đạo (thiền, tĩnh tọa, kết phù…), Ngũ Bộ Chuyển Niệm, Tâm Đề, giữ giới, sám | 35% | có | **có** (nhóm tu tâm) | có |
| **Học** | thi, đọc thẻ, giải án, nhiệm vụ học của Mệnh Đồ và chuỗi đạo | 25% | có | không | có |
| **Truyện** | nhiệm vụ chuỗi (CQ-*), mốc viên mãn | 15% | có | không | có |

### 2.2 Hoạt động lõi theo đạo — trần ngày

Luật chung **(mới ở phần này)**: mỗi hoạt động lõi có **số phiên có thưởng / ngày**; quá số đó phiên vẫn chơi được, `B = 0`.

| Đạo | Hoạt động (B / phiên × phiên có thưởng / ngày) | Phút ước tính | B lõi tối đa / ngày | B / giờ hiệu dụng |
|---|---|---|---|---|
| CN | kết phù 10 × 3 · bái Đẩu 12 × 1 · trực đàn 8 × 2 | 12 + 6 + 20 = 38 | 58 | ≈ 92 |
| TV | tĩnh tọa 12 × 3 · Thái Cực 10 × 2 · lò đan 8 × 2 | 30 + 16 + 10 = 56 | 72 | ≈ 77 |
| TC | công khóa 10 × 2 · Đạo Tạng 10 × 3 (quyển mới) · khoa nghi 14 × 1 | 16 + 9 + 10 = 35 | 64 | ≈ 110 |
| TT | tồn tư 12 × 3 · việc lạ 10–12 × 3 · thu kinh 14 × 1 | 24 + 30 + 8 = 62 | 80 | ≈ 77 |
| BD | thắp đèn 8 × 2 · chuyển kinh 10 × 2 · giải oan 16 × 1 | 16 + 12 + 20 = 48 | 52 | ≈ 65 |
| TH | thiền 12 × 3 · công án 10 × 1 · hành hương 10 × 2 | 30 + 5 + 20 = 55 | 66 | ≈ 72 |
| TD | niệm Phật 10 × 3 · sám (trung bình) ≈ 15 | 9 + 10 = 19 | 45 (+ DEED gán) | ≈ 140 (phiên ngắn) |
| MT | trì 21 / 108 biến 10–20 × 1 · cát hoa sen 14 × 1 · hồi hướng đèn 6 × 2 | 2 + 8 + 2 = 12 | 46 | ≈ 230 (phiên ngắn) |
| NH | học 12 × 2 · tự tỉnh 8 × 1 · thi (theo kỳ, trung bình ngày ≈ 10) | 20 + 3 + 5 = 28 | 42 (+ DEED gán) | ≈ 90 |
| BM | hái thuốc 8 × 2 · chuyện xưa 6 × 1 · nấu canh 10 × 1 | 12 + 4 + 8 = 24 | 32 | ≈ 80 |

**Đọc bảng:** các đạo có phiên ngắn (TD, MT) có «B / giờ» cao nhưng **trần ngày thấp** — nên theo ngày, các đạo xấp xỉ nhau (42–80 B lõi / ngày). Không đạo nào «cày nhanh hơn» quá 2 lần đạo khác theo ngày. Tịnh Độ và Nho bù trần lõi thấp bằng việc gán ĐH từ DEED (05-06 §3.2).

**Ba đạo cùng lúc:** trần lõi cộng lại 130–220 B / ngày > hạn mềm 120 → người tu 3 đạo chơi nhiều sẽ chạm nhật hạn (05-01 §3.3). Đó là chủ ý.

### 2.3 Nội dung một lần (tổng B)

| Khối | Tổng B (ước) | Ghi chú |
|---|---|---|
| Mệnh Đồ — 6 nút lần đầu + thưởng nút (50 × 6) | ≈ 1.500 | chênh theo lá số (số tổ hợp hung, kiểu phạm Thái Tuế, `level` làm công, `rescues`) |
| Mệnh Đồ — làm mới mỗi năm | ≈ 300 / năm | |
| Chuỗi một đạo (01–V) | 535–665 | ba đạo tới hạng III (01–10): ≈ 3 × 310 |
| Chuỗi sám hối `CQ-SH` | 60 / thanh | chỉ khi có nghiệp |
| Pháp Môn Liễu Phàm | 320 | |
| Chuỗi `CQ-TR` | 650 | Hồi III–IV |
| Chuỗi `CQ-QN` | 200 | |
| Tâm Đề tuần | 40–60 / tuần | lặp |

### 2.4 Mô phỏng bốn kiểu người chơi

Giả định: Tiềm Lực 41 (k = 1,19), `a` trung bình 0,04, Nghịch Duyên 30% thời gian (năm hung), đều đặn hằng ngày trừ «ghé thăm». «B / ngày» = công + lõi + nội dung một lần (khi còn).

| Kiểu | Phút / ngày | Công hữu hiệu / ngày | B / ngày (giai đoạn còn nội dung) | B / ngày (hết nội dung) | ĐH / ngày (×1,24) |
|---|---|---|---|---|---|
| Ghé thăm (4 ngày / tuần) | 15 | 3 | 28 × 4/7 = 16 | 18 × 4/7 = 10 | 20 → 12 |
| Đều đặn | 45 | 5 | 10 + 24 + 25 = 59 | 10 + 24 = 34 | 73 → 42 |
| Chuyên cần | 90 | 9 | 18 + 60 + 50 = 128 | 18 + 60 = 78 | 159 → 97 |
| Cày (chạm trần) | 240+ | 15 | 30 + 140 (hạn mềm + 25% phần dư) = 170 | 170 | 211 |

**Ngày tới mỗi cảnh giới** (Đạo Hạnh; bậc 1–3 cộng Tiềm Lực × 0,4 = 16,4; điều kiện đột phá giả định đạt cùng lúc, trừ ghi chú):

| Kiểu | Bậc 2 (100) | Bậc 3 (400) | Bậc 4 (1.000) | Bậc 5 (2.200) | Bậc 6 (4.500 + Quy nhất) |
|---|---|---|---|---|---|
| Ghé thăm | ngày 5 | ngày 20 | ngày 50 | ngày 175 (Đạo Hạnh đủ từ ngày 110; chặn bởi Đại Nguyện 1 ~ ngày 175) | ~ ngày 300 |
| Đều đặn | ngày 2 | ngày 6 | ngày 14 | ngày 60 (Đại Nguyện 1 ~ ngày 60) | ~ ngày 85 (Quy nhất: 3 đạo hạng III ~ ngày 70) |
| Chuyên cần | ngày 1 | ngày 3 | ngày 7 | ngày 34 (Đại Nguyện 1 ~ ngày 34) | ~ ngày 45 |
| Cày | ngày 1 | ngày 2 | ngày 5 | ngày 20 (Đại Nguyện 1 ngày 20) | ~ ngày 25–30 (cửa thời gian: thi Nho theo tuần, vân du 10 ngày, Hồng Danh 7 ngày…) |

**Kết luận cân bằng:**

- Bậc 6 với người đều đặn ≈ **3 tháng ≈ 65 giờ chơi**, khớp nhịp cốt truyện 40–60 giờ cộng phần tu.
- **Đại Nguyện 1 (300 công)** là chốt nhịp tự nhiên của bậc 5 — đúng ý: «cải mệnh sâu» phải đi qua tích thiện.
- Người cày nhanh hơn người đều đặn **≈ 3 lần**, không hơn: nhật hạn, nhật hạn công, cửa thời gian giữ khoảng cách này.

### 2.5 Hệ số Nghịch Thiên — so sánh hai lá số

Cùng kiểu «đều đặn», cùng một lịch chơi. Người A Tiềm Lực 20 (Phàm Căn, k = 1,40); người B Tiềm Lực 88 (Thiên Linh Căn, k = 1,00).

| Mốc | Người A (ĐH, điểm cảnh giới) | Người B (ĐH, điểm cảnh giới) | Ai trước |
|---|---|---|---|
| Ngày 1 | ĐH 83 · điểm 83 + 8 = 91 | ĐH 59 · điểm 59 + 35,2 = 94,2 | B (đầu nhờ căn) |
| Ngày 2 | 166 · 174 | 118 · 153 | **A** |
| Bậc 3 (400) | ngày 5 | ngày 7 | A |
| Bậc 4 (1.000 ĐH thật) | ngày 13 | ngày 17 | A |
| Thiên Bảng sau 30 ngày | ≈ 2.490 | ≈ 1.770 | A |

Bậc 5–6 bị chặn bởi Đại Nguyện 1 và Quy nhất — hai điều kiện **không phụ thuộc căn** → hai người gặp nhau ở cổng bậc 5. Đúng trụ cột T2: căn thấp có lợi thế tu, căn cao không bị phạt, cổng sâu chỉ mở bằng việc làm.

### 2.6 Phúc Khí (tầng Cải Vận) — kiểm không lấn sang

| Nguồn Phúc Khí / ngày (đều đặn) | Lượng | Ghi chú |
|---|---|---|
| hiện có (`state.js`): án khách ≤ 3 × 15, sảnh nghề 15 / sảnh, lịch 2, hương 5, đèn 3, nhiệm vụ ngày 5, trà ≤ 15 | ≈ 60–90 | code hiện tại |
| Vận Phù (tối đa +15%) | +9–14 | trần vận 05-01 §2.5 |
| Bố thí (chi) | −20–40 | DEED T-BT |

Phúc Khí **chỉ** đổi ra: đồ Tàng Y Các (giá Phúc Khí), vật hóa sát nhà riêng, lễ vật tượng trưng, bố thí. Không có đường đổi ra Đạo Hạnh, công, cảnh giới (luật L-1, 05-01 §1.2) — đã kiểm toàn bộ danh mục 05-04: DEED bố thí cho **công** (từ việc cho), không cho Phúc Khí thành Đạo Hạnh theo tỷ lệ; ngưỡng tỷ lệ (≥ 2% hoặc ≥ 20) và trần T-BT (6 công / ngày) chặn «mua công bằng tiền».

---

## 3. Ma trận chống khai thác

| # | Khai thác | Mức rủi ro | Chặn bằng | Phần |
|---|---|---|---|---|
| X-1 | Sửa localStorage để tăng Đạo Hạnh, công, cảnh giới | cao | máy chủ giữ bản chứng thực; mọi mốc (đột phá, Đại Nguyện, Thiên Bảng) chỉ nhận từ máy chủ | §4 |
| X-2 | Chỉnh đồng hồ máy để reset nhật hạn | cao | nhật hạn tính theo giờ máy chủ khi online; offline ghi «chờ xác thực» | 05-03 §10 |
| X-3 | Đổi ngày giờ sinh để lấy k cao | trung | DS-1…DS-5; k chỉ áp từ khi đổi; dấu «đã chỉnh lá số» | 05-02 §5.4 |
| X-4 | Tự tạo «nhu cầu» rồi cứu (đẩy NPC ngã…) | trung | CC-5: nhu cầu do thế giới sinh; hành vi gây nhu cầu bị chặn ở hệ vật lý / thoại | 05-03 |
| X-5 | Hai tài khoản bố thí qua lại | trung | CC-6, CC-9; phát hiện cặp vòng | 05-03 |
| X-6 | Sư đồ tự nuôi (tài khoản phụ làm đệ tử) | trung | SĐ-5: chặn tài khoản liên kết (thiết bị / thanh toán); thưởng sư phụ chịu nhật hạn công | 05-06 §8 |
| X-7 | Cày việc ác → sửa → lấy công | thấp | SS-3: việc sửa không cho công; DEED bồi đắp không hữu hiệu tới khi sự vụ xong | 05-05 §5.2 |
| X-8 | Phạm giới → sám → hoàn ĐH để «xoay vòng» | thấp | hoàn tối đa bằng số đã trừ, không dư; sám có hồi chiêu | 05-01 §3.7 |
| X-9 | Tà Lộ để «vay» Đạo Hạnh rồi trả | thấp | chứng minh tổng lợi âm; chặn bậc 5–6 khi còn nợ | 05-12 §4.4 |
| X-10 | Cày danh hiệu Hồi Đầu | thấp | một lần đời; Hũ Hồi Đầu trần 200 | 05-12 §8 |
| X-11 | Kéo nhau ở cầu Nại Hà giữa bạn bè để lấy DEED | thấp | DEED-037 / DEED-161 một lần / người được kéo; người được kéo phải có Nợ Âm thật | 05-04 |
| X-12 | Macro / bot cho mini-game nhịp | trung | đo độ lệch thời gian chạm (bot quá đều); phiên có thưởng / ngày; câu hỏi nhanh giữa buổi giảng | §4.3 |
| X-13 | Treo máy (AFK) ở trực đàn, nghe giảng | thấp | khách bỏ đi khi không đáp 60 giây; câu hỏi giữa buổi | 05-07, 05-04 |
| X-14 | Chia sẻ đáp án kiểm tri / thi | thấp | ngân hàng đề xáo; thi Hương vòng 2 dùng lá số NPC ngẫu nhiên | 05-11 |
| X-15 | Dùng AI hội thoại để «xin» phần thưởng | thấp | AI không có quyền cấp thưởng; kiểm tên nhiệm vụ / vật phẩm trong câu trả lời (bản sơ đồ §6.4) | — |
| X-16 | Nhảy đạo để lấy thưởng nhập môn | thấp | ST-5: thưởng nhập môn một lần đời; đổi suất ≤ 1 / 14 ngày | 05-06 §2.1 |
| X-17 | Spam sự kiện tập thể (vào – ra) | thấp | ≤ 1 lần / sự kiện; tính khi góp ≥ 10 phút | 05-04 §13 |
| X-18 | Sổ môn phái bị thổi phồng | thấp | chỉ công hữu hiệu vào sổ chung | 05-03 §7.1 |
| X-19 | Bố thí số nhỏ để «mua công» khi giàu | trung | ngưỡng tỷ lệ 2% Phúc Khí hiện có | 05-04 §6 |
| X-20 | Lưu nhiều hồ sơ để chọn lá số «có lợi» làm Bản Mệnh | trung | Bản Mệnh khóa sau lễ lật trụ; hồ sơ khách không sinh nhiệm vụ | 05-02 §2.3 MO-4 |
| X-21 | Thiên Bảng: mua tài khoản cao bậc | — | ngoài phạm vi game (điều khoản sử dụng, tài liệu 14) | — |
| X-22 | Dùng Âm Ấn liên tục để quá tải máy chủ | thấp | trần 30 lần / ngày | 05-12 §3.2 |
| X-23 | Khai thác lệch múi giờ để làm hai «ngày» trong 24 giờ | thấp | ngày tính theo giờ máy chủ (múi giờ khu vực máy chủ) cho mọi nhật hạn | §4 |
| X-24 | Phóng sinh hàng loạt ở chậu cá kim lý | thấp | chậu tối đa 9 con toàn máy chủ | 05-04 DEED-018 |
| X-25 | Báo «lừa đảo» bừa để lấy DEED-162 | thấp | chỉ khi quản trị xác nhận đúng | 05-04 |

---

## 4. Máy chủ chứng thực

### 4.1 Trường máy chủ giữ (không có ngày sinh)

| Trường | Ghi khi | Ghi chú |
|---|---|---|
| `daohanh`, `daohanhLife` | mỗi lần nhận / trừ ĐH (gói sự kiện) | máy chủ tính lại từ sự kiện, không nhận con số từ máy khách |
| `realm` | lễ đột phá | kiểm ngưỡng + điều kiện |
| `congHuuHieu`, `ledger` tóm tắt (theo ngày, theo nhóm) | mỗi DEED | chi tiết dòng sổ ở máy khách; máy chủ giữ đếm + băm |
| `vows` | lễ Đại Nguyện | |
| `amBai` (`until`, `uses`, `noAm`, `cases`) | mỗi lần dùng / trả | Nợ Âm là con số máy chủ |
| `paths[*]` (rank, dhDao) | thăng hạng | |
| `kHistory` (Tiềm Lực theo thời gian, **chỉ con số**) | lễ lật trụ, mỗi lần sửa | DS-4 |
| `karma` tổng thanh | mỗi sự vụ | sự vụ chi tiết ở máy khách |

**Không lên máy chủ:** ngày giờ sinh, lá số, chẩn đoán Mệnh Đồ (trừ khi đệ tử chia sẻ cho sư phụ), sổ đời thực, câu phát lộ tự gõ, nội dung công án.

### 4.2 Gói sự kiện

Máy khách gửi **sự kiện** (vd `{ type: 'deed', id: 'DEED-031', npc, region, at }`), không gửi điểm. Máy chủ áp luật (hồi chiêu, CC, nhật hạn, k từ `kHistory`) rồi trả kết quả. Khi offline: sự kiện xếp hàng, máy khách hiện điểm **tạm** (chữ mờ), máy chủ chấm lại khi đồng bộ — có thể khác (ví dụ quá nhật hạn tính theo giờ máy chủ).

### 4.3 Kiểm mini-game

- Mini-game gửi **dãy thời điểm chạm** rút gọn (độ lệch so với nhịp). Máy chủ kiểm: phân bố lệch phải có nhiễu kiểu người (bot thường lệch gần 0 đều đặn). Nghi bot → phiên không thưởng, không thông báo buộc tội; lặp lại nhiều → chuyển quản trị xem (tài liệu 13).
- Không kiểm mini-game «tâm» theo điểm (thiền, công án) — chúng không có điểm tối đa để khai thác; thưởng theo phiên có thưởng / ngày.

---

## 5. Chỉ số theo dõi (telemetry)

Theo canon §13.5 và mục tiêu của hệ cải mệnh:

| Chỉ số | Mục tiêu | Ghi chú |
|---|---|---|
| Giữ chân 7 ngày của người chơi Tiềm Lực < 36 so với ≥ 50 | **không thấp hơn** | bằng chứng T2 |
| % người chơi mở Mệnh Đồ và xong ≥ 1 nút trong tuần đầu | ≥ 60% | canon |
| % người chơi có ≥ 1 dòng âm thiện trong 14 ngày | ≥ 40% | khiêm đức có «ăn» không |
| % Ngũ Bộ Chuyển Niệm đi đủ 5 bước khi kích hoạt | ≥ 35% | cơ chế không gây khó chịu |
| % người bật Tà Lộ / % người đã vào Tà Lộ hoàn tất Hồi Đầu trong 60 ngày | theo dõi; mục tiêu Hồi Đầu ≥ 50% | Tà Lộ không thành «bẫy bỏ game» |
| Phân bố người chơi theo đạo thống | không đạo nào < 4% người tu | cân bằng nội dung |
| Tỷ lệ án «việc lạ» đóng có bước chuyển người khi có dấu hiệu | 100% (thiết kế bắt buộc) | kiểm lỗi |
| Số lần thẻ hỗ trợ đời thực hiện / tuần | chỉ đếm tổng, không gắn người | an toàn |
| Thời gian trung vị tới bậc 6 (người chơi hoạt động ≥ 4 ngày / tuần) | 80–120 ngày | §2.4 |
| Khiếu nại liên quan tín ngưỡng | → 0; mỗi khiếu nại được cố vấn xem | tài liệu 14 |

---

## 6. Bản iOS — chỉ tu tâm, học, việc thiện

Canon §14 (Apple 4.3(b)): bản iOS tắt bói (xăm, quẻ), Vận Mệnh Các, Thái Tuế Điện, Thầy AI (`features.js`: `FEATURES.divination = false`, `FEATURES.ai = false`, `IOS_OFF` gồm `xam`, `sen`, `que`, Vận Mệnh Các, Thái Tuế Điện). Cải mệnh trên iOS «chỉ giữ phần tu tâm, học, việc thiện, không đoán vận».

### 6.1 Ma trận tính năng hệ 05

| Tính năng | Web | iOS | Thay thế trên iOS |
|---|---|---|---|
| Tiềm Lực, Phẩm căn, k | có | **ẩn** (là luận lá số) | k = 1,0 cho mọi người; không có cột Tiên Thiên |
| Vận Khí Bàn, Vận Phù (05-01 §2) | có | **ẩn** | — |
| Bộ phục ngũ hành | có (+ Hợp Mệnh) | có (thẩm mỹ, **không** Hợp Mệnh) | — |
| Đạo Hạnh, nhật hạn, Tâm Đề | có | có | Tâm Đề theo **lựa chọn** của người chơi (10 đức), không theo nhật can |
| Nghịch Duyên (theo lưu niên) | có | **ẩn** | — |
| Ngũ Bộ Chuyển Niệm | có | có | bước Giác **không** có cảnh báo theo lá số |
| Cảnh giới, Đại Nguyện, Thiên Bảng | có | có | Thiên Bảng iOS riêng (không trộn web) — tài liệu 13 quyết |
| Mệnh Đồ | 6 nút | **3 nút**: «Danh» (học chữ, đặt đạo hiệu — không «bổ mệnh»), «Làm Công» (học nghề, hợp tác — không «phú quý»), «Tích Âm Đức» | không hiện `diagnosis`, `verdict` |
| Sổ Công Quá, DEED, Thập Thiện | có | có | — |
| Sổ đời thực | có | có («Nhật ký thiện») | — |
| Thanh nghiệp, sám hối, việc sửa | có | có | — |
| Cảnh báo nghiệp theo lá số | có | **ẩn** | — |
| Lục Đạo (khuynh hướng) | có | **ẩn** | Diệu Âm tìm tới người chơi theo **hành vi** (≥ 3 sự vụ nghiệp) |
| Kinh theo việc (Tàng Kinh) | có | có | — |
| Đạo thống (9 + bàng môn + Liễu Phàm) | có | có | các nút có bói thay bằng học (bảng 6.2) |
| Tà Lộ | có (opt-in) | **không có** | — |
| Trừ tà chính tông — nhánh đời thực | có | có | — |
| Trừ tà — nhánh âm tà (opt-in) | có | **không có** | — |
| Thái Tuế (nút Mệnh Đồ, đèn) | có | **không có** | — |
| Công án AI | có | thoại kịch bản | — |

### 6.2 Nút đạo thống đổi trên iOS

| Nhiệm vụ / hoạt động | Web | iOS |
|---|---|---|
| Bái Đẩu bản mệnh (CN) | đèn bản mệnh theo năm sinh | «Thắp đèn Thất Tinh» — học tên 7 sao |
| CQ-CN-06 «Sao bản mệnh» | tra bản mệnh | «Bảy ngôi sao» — học chòm Bắc Đẩu |
| CQ-CN-07 «Giải ách cho bà lão» | tra `personalTaSui` | giải thích «năm hạn là tín ngưỡng», dẫn bà tới người thân |
| Phù trấn trạch theo hành Dụng chủ nhà (CN) | có hành Dụng | theo **sát** của nhà (`fs-cure`), không theo lá số |
| Tĩnh tọa giờ theo Dụng (TV) | `WX_PRACTICES.time` | bỏ gợi ý giờ |
| CQ-TV-11 «Hái vị thuốc» (Đắc Cứu) | `rescues` | «Hái thuốc cho vu y» (không lá số) |
| Đạo Tạng kệ «Hợp Dụng» (TC) | `_YONG2CULT` | kệ «Quyển được đọc nhiều» |
| Thẻ «tượng âm tà» (TT) | opt-in | không có |
| Giải oan (BD) | có | có (bản đời thực) |
| Đọc sổ Phán quan (BD) | có | có (sổ là việc làm, không phải bói) |
| Thi Hương vòng 2 «luận lá số» (NH) | giải án lá số | «Luận văn» — đọc hiểu cổ thư thay giải án |
| Ngũ thường theo Dụng (NH) | theo hành Dụng | người chơi tự chọn đức |

### 6.3 Văn bản iOS

Dùng `TEXT` của `features.js` cho iOS: «Học Quán», «Sổ Tu Học», «Điểm Tu Học» — hệ 05 đổi tên tương ứng: «Sổ Công Quá» giữ (tên cổ thư), «Mệnh Đồ» → **«Lộ Tu Học»**, «Cải Mệnh» → **«Tu Thân»**, «Nghịch Thiên» không xuất hiện.

---

## 7. Checklist nghiệm thu tổng của tài liệu 05

**Trụ cột**
- [ ] T1: mọi con số lá số (Tiềm Lực, Dụng, chẩn đoán, tổ hợp, Thái Tuế, lục đạo, tượng âm tà) đọc từ engine; không công thức bói riêng.
- [ ] T2: không câu nào phán «mệnh đã định»; k ≥ 1; căn thấp tới bậc 4 nhanh hơn (test §2.5).
- [ ] T3: không có lựa chọn bạo lực ở chính lộ; Tà Lộ không có bạo lực đồ họa.
- [ ] T5: văn chẩn đoán, `verdict` engine hiện nguyên văn; mọi «nhắc của game» được gắn nhãn khác chẩn đoán.
- [ ] T6: không nghi thức thật, không chú toàn văn ngoài phạm vi app, không chẩn bệnh, âm tà opt-in, Tà Lộ opt-in, chuyển hướng sức khỏe tâm thần có ở mọi án liên quan.

**Kinh tế**
- [ ] Không đường nào từ Ngọc / tiền thật tới Đạo Hạnh, công, cảnh giới, Nợ Âm.
- [ ] Phúc Khí chỉ nhân bởi Vận Phù; trần vận theo lưu niên.

**Hệ thống**
- [ ] Mệnh Đồ đúng cho 5 lá số mẫu (05-02 §1.4); tính lại đúng khi sửa ngày sinh / Lập Xuân.
- [ ] Sổ Công Quá: 19 mục `CONG_QUA` ghi đúng điểm; 3 mốc Liễu Phàm dùng công hữu hiệu ròng.
- [ ] ≥ 200 DEED cài đặt (05-04).
- [ ] 10 thanh `KARMA-*`; sám không thay được việc sửa.
- [ ] 9 đạo thống + bàng môn có thang hạng, giới, ≥ 15 nhiệm vụ (Mật: 11 làm ngay + 5 chờ tham vấn).
- [ ] Tà Lộ: tổng lợi âm (test tự động); đường về luôn mở.
- [ ] Quy nhất 7 điều kiện; bậc 6 không đạt được nếu thiếu một.
- [ ] iOS theo ma trận §6.

**Engine phải sửa trước khi bật các phần liên quan** (chi tiết ở README):
- [ ] `getRemedyForChart`: `劫财` → `劫財`; xét tàng can.
- [ ] `getYeguoForChart`: nhánh Thâu đạo quá rộng; nhánh Tà dâm không khớp; nhánh Kiếp Tài.
- [ ] `suggestDaozangChartAware`: `yong.god` → `yong.primary`; `_PATTERN2CULT` khóa giản thể vs `pattern.name` phồn thể.
- [ ] `gaimenhPlan`: D3 dùng `score < 0` (hiếm khi đúng) — đề xuất dùng `rating`.
