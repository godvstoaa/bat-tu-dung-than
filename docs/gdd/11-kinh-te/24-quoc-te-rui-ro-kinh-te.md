# 11 · Phần 24 — Giá quốc tế, bản địa hóa kinh tế, sổ rủi ro kinh tế

> Ra mắt ở Việt Nam trước (phần 11 §1: thị trường ngoài VN «chưa trong phạm vi»). Phần này chuẩn bị cho lúc mở rộng: nguyên tắc định giá theo khu vực, những gì đổi / không đổi khi bản địa hóa, và sổ rủi ro kinh tế để tài liệu 14 nhập vào sổ `RISK-xx` (tài liệu 14 cấp mã; ở đây chỉ mô tả).

---

## 1. Nguyên tắc giá theo khu vực

| # | Nguyên tắc |
|---|---|
| Q1 | **Số Ngọc mỗi gói giống nhau ở mọi khu vực**; chỉ giá tiền đổi theo bậc giá nền tảng / sức mua |
| Q2 | Giá món trong game (Ngọc, Phúc Khí) **giống nhau toàn cầu** — không có «món rẻ hơn ở nước X» |
| Q3 | Tài khoản gắn **một khu vực kinh tế** khi tạo (theo storefront nền tảng hoặc quốc gia thanh toán web); đổi khu vực tối đa 1 lần / 12 tháng, số dư giữ nguyên |
| Q4 | Không A/B giá giữa khu vực trong cùng thời điểm (phần 12 AB-X7 áp theo khu vực) |
| Q5 | Rào chắn (trần chi tiêu, tuổi) theo **luật khu vực nào chặt hơn** giữa luật nơi người chơi ở và mặc định của quán |
| Q6 | Không chặn VPN để «bắt giá cao»; khu vực theo phương thức thanh toán, không theo IP |

## 2. Bậc giá đề xuất khi mở rộng

Quy chiếu: gói `SKU-P-02` (330 Ngọc). Bậc giá thực tế lấy từ bảng bậc giá App Store / Google Play của khu vực; bảng dưới là **mục tiêu** để chọn bậc gần nhất.

| Khu vực | Tiền | `SKU-P-01` 60 | `SKU-P-02` 330 | `SKU-P-04` 1.600 | VIP tháng | Kim Thư | Ghi chú |
|---|---|---|---|---|---|---|---|
| Việt Nam | VND | 22.000 | 109.000 | 449.000 | 99.000 | 109.000 | gốc (phần 03, 07) |
| Hoa Kỳ | USD | 0,99 | 4,99 | 19,99 | 3,99 | 4,99 | bậc nền tảng |
| Khu vực đồng euro | EUR | 0,99 | 4,99 | 19,99 | 3,99 | 4,99 | giá đã gồm VAT theo nền tảng |
| Đài Loan | TWD | 30 | 150 | 590 | 120 | 150 | thị trường quan tâm văn hóa bát tự; cần cố vấn văn hóa địa phương |
| Singapore / Malaysia | SGD / MYR | bậc tương đương 0,99 USD | … | … | … | … | cộng đồng Hoa kiều |
| Cộng đồng người Việt ở nước ngoài | theo storefront | — | — | — | — | — | giữ tiếng Việt, giá theo storefront |

**Không mở**: Trung Quốc đại lục (yêu cầu giấy phép xuất bản trò chơi riêng, quy định gắt về nội dung tín ngưỡng, tên «Pháp Luân» — phần 04 §5.3 — và kiểm soát thời gian chơi riêng; nằm ngoài phạm vi tài liệu này).

## 3. Bản địa hóa kinh tế

| Thứ | Đổi theo khu vực? | Ghi chú |
|---|---|---|
| Tên tiền tệ «Phúc Khí», «Ngọc» | dịch nghĩa (ví dụ tiếng Anh: «Fortune Qi» → **không** dùng «Fortune» vì gợi bói; đề xuất «Blessing Qi» / «Jade») | kiểm lại với phần 14 §4 trên iOS |
| Tên món | dịch; giữ phiên âm Hán Việt cho tên riêng khi có giá trị văn hóa | món có chữ «mệnh» dịch theo nghĩa thẩm mỹ |
| Lịch lễ (phần 06 §1) | giữ lịch âm chung; thêm lễ địa phương chỉ khi có cố vấn | Vu Lan / Trung Nguyên vẫn «không bán» ở mọi khu vực |
| Con giáp | Mão: Việt Nam «Mèo», nơi khác «Thỏ» — món SEASON-09 giữ mèo kèm một dòng lore (phần 09) | — |
| Quà Ngọc lễ | như nhau | — |
| Trần chi tiêu mặc định | theo tỷ lệ sức mua: VN 10.000.000đ ≈ 400 USD → khu vực khác 400 USD tương đương bậc | và theo luật địa phương nếu chặt hơn |
| Tuổi | theo luật địa phương (ví dụ < 13 ở Hoa Kỳ: COPPA — không mở tài khoản trực tuyến cho < 13) | phần 11 §1 |
| Thuế hiển thị | web: giá gồm thuế theo luật nơi khách hàng; app: nền tảng | — |

## 4. Sổ rủi ro kinh tế (để tài liệu 14 nhập)

Thang: Khả năng (K) và Tác động (T) từ 1 thấp tới 5 cao; Mức = K × T.

| # | Rủi ro | K | T | Mức | Giảm thiểu | Phần | Chủ |
|---|---|---|---|---|---|---|---|
| 1 | Bán nhầm một món bị cộng đồng tôn giáo coi là xúc phạm | 3 | 5 | 15 | nhóm T phần 01; cố vấn duyệt (phần 05 §6); hậu kiểm 14 ngày; gỡ bán + hoàn tiền tự nguyện | 01, 05 | Thiết kế kinh tế + cố vấn |
| 2 | Game bị coi là trò chơi có thưởng / cờ bạc | 1 | 5 | 5 | không gacha, không may rủi trả phí, thưởng xăm không phụ thuộc thẻ | 01 nhóm R | Pháp chế |
| 3 | Bị hiểu là «bán cải mệnh», bài báo tiêu cực | 2 | 5 | 10 | bốn câu thề công khai; vùng im lặng; NPC không bán; Sổ Quán | 01, 15 | Chủ dự án |
| 4 | Apple từ chối lại theo 4.3(b) | 3 | 4 | 12 | bản iOS không bói; lint từ cấm; ghi chú duyệt | 14 | Nền tảng |
| 5 | Chi phí AI vượt doanh thu | 3 | 4 | 12 | cache, trần lượt, đo chi phí thật, tối ưu mô hình | 19 §7.4 | Kỹ thuật |
| 6 | Tỷ lệ trả phí thấp, kinh tế không tự nuôi | 3 | 4 | 12 | danh mục đẹp, giữ chân, mùa thử để đo trước; không bù bằng đòn bẩy phi đạo đức | 19 | Chủ dự án |
| 7 | Trẻ em chi tiêu, phụ huynh khiếu nại | 3 | 3 | 9 | nhóm tuổi, Bảng Phụ Huynh, trần | 11 §5 | Vận hành |
| 8 | Tranh chấp thẻ vượt ngưỡng của mạng thẻ → bị khóa cổng | 2 | 4 | 8 | luật G-P*, 3-D Secure, không phản đối tranh chấp thẻ trộm | 13 | Vận hành |
| 9 | Lỗi cấp trùng / mất Ngọc sau di trú | 3 | 3 | 9 | chạy bóng 30 ngày (E1), bất biến I1–I6, đối soát đêm | 10, 20 | Kỹ thuật |
| 10 | Lạm phát Phúc Khí khi thêm hoạt động AAA | 4 | 2 | 8 | ngân sách ngày, sink mới, chỉ số `PK_SINK_RATIO` | 02 §5 | Thiết kế kinh tế |
| 11 | Người chơi lá số thấp trả nhiều hơn (khai thác lo âu) | 2 | 5 | 10 | `ETH_LOW_CHART_CONVERSION`, cấm cá nhân hóa theo lá số | 12 §4.3 | Hội đồng |
| 12 | Cộng đồng H'Mông / Tạng phản đối việc dùng hình ảnh | 2 | 4 | 8 | khóa `consultPending`; chỉ làm khi có thỏa thuận | 05 §4.7, §4.10 | Chủ dự án |
| 13 | Không có pháp nhân nhận Stripe | 4 | 2 | 8 | cổng thẻ của trung gian VN | 11 P4 | Chủ dự án |
| 14 | Tên «Pháp Luân» / «Chân Nhân» gây sự cố trước khi đổi | 2 | 4 | 8 | E0 bắt buộc đổi trước khi bán | 04 §5, 20 §1 | Thiết kế kinh tế |
| 15 | Rò khóa thanh toán | 1 | 5 | 5 | secret, xoay khóa, sổ tay 16 §6.4 | 10 §11 | Kỹ thuật |
| 16 | Thay đổi luật VN (trò chơi, dữ liệu, thương mại điện tử) | 3 | 3 | 9 | pháp chế rà mỗi quý; cột «độ chắc» | 11 | Pháp chế |
| 17 | Người chơi thấy Đạo Lộ là «việc phải làm», kiệt sức | 2 | 3 | 6 | trần tuần, Lộ Dư, Lộ Thư chọn 4/6, không thưởng đăng nhập trơn | 07 | Thiết kế kinh tế |
| 18 | Quầy «đổi mệnh» của phản diện bị hiểu là cửa hàng thật | 2 | 3 | 6 | chỉ Phúc Khí, giao diện khác Y Các, hoàn 100% khi vạch mặt | 21 | Thiết kế kinh tế + 03 |

## 5. Checklist nghiệm thu phần 24

- [ ] Trước khi mở khu vực mới: bảng §2 điền bậc giá thật, pháp chế khu vực rà §3, cố vấn văn hóa (nếu cần).
- [ ] Tài liệu 14 đã nhập 18 rủi ro §4 vào sổ `RISK-xx`.
- [ ] Mức rủi ro ≥ 12 có người chủ và hạn rà mỗi mùa.
