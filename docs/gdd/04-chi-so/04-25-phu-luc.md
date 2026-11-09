# 04-25 · Phụ lục — đề nghị engine, chỉ mục mã, thuật ngữ, câu hỏi mở

## 1. Đề nghị thay đổi engine (gửi app gốc)

Game **không sửa** `src/engine/` (một nguồn sự thật với trang chính). Các điểm dưới đây là đề nghị cho người bảo trì engine; game có phương án tạm cho mỗi điểm.

| Mã | Vị trí | Hiện trạng | Đề nghị | Phương án tạm của game |
|---|---|---|---|---|
| D1 | `synthesis.js › synthesize` | `factors` là chuỗi | thêm `factorsStructured: [{key, delta, text}]` | `factorDelta` + `factorKey` (04-02 §3.3, 04-23 §2.1) |
| D2 | `vitality.js › analyzeVitality` | đọc `R.asOfYear`/`R.now`, rơi về `new Date()` | `analyze()` gán `asOfYear = refYear` | `buildMenhBan` gán trước khi gọi |
| D3 | `chart.js › computeLiuNian` | `isNow` theo năm dương lịch | thêm cờ theo Lập Xuân, hoặc nhận `refDate` | `refYear = thaitue.js › suiYear(now).year` |
| D4 | `buildChart` (qua `lunar-javascript`) | tiết khí giờ Bắc Kinh, giờ sinh hiểu là cùng múi | so tiết bằng thời điểm tuyệt đối cho trụ năm/tháng khi biết múi giờ nơi sinh | cảnh báo ở cổng (04-11 §4) |
| D5 | `shensha.js › SHENSHA_INFO` | `kuiGang.vi = 'Quù Cương'`, `tianChu.vi = 'Thiên Xư'` | «Khôi Cương», «Thiên Trù» | game dùng tên riêng |
| D6 | `synthesis.js` | `fortuneVi` viết «Qúy» | «Quý» | sửa khi hiển thị |
| D7 | `liudao.js` | `disclaimer` viết «KHÔ đoán» | «KHÔNG đoán» | sửa khi hiển thị |
| D8 | `chart-level.js` | `levelVi` 下格 có «bần tiện» | đổi chữ trung tính (trang chính cũng hưởng) | không hiển thị `levelVi` |
| D9 | `chart.js › analyze` | không chặn ngày sinh tương lai | ném lỗi «Ngày sinh chưa tới» khi `y-m-d > refDate` | game chặn ở cổng |
| D10 | `noble-stars.js` vs `shensha.js` | `taiji` hai cách tra khác nhau | thống nhất (khuyên dùng bản `shensha`, tra cả can năm) | Đặc Tính dùng `shensha.taiJi`; Quý Khí dùng `noble-stars` |
| D11 | `pattern-quality.js` | `via` ghép động (`*-tougan`, `*-tang`) | xuất danh sách hằng `VIA_ALL` | game khớp theo hậu tố |
| D12 | `sensitivity.js` | `insight` gợi ý «giờ … cao hơn» | tách câu ấy thành trường riêng để nơi gọi tự chọn | game không hiển thị `insight` |

## 2. Chỉ mục mã `STAT-*`

| Mã | Định nghĩa ở | Dùng ở |
|---|---|---|
| `STAT-MENHBAN` | 04-12 §4 | 04-01, 04-23 |
| `STAT-TIEMLUC` | 04-02 §1 | 04-08, 04-09/10, 04-12 |
| `STAT-BACHPHAN` | 04-02 §2 | 04-13 §6 |
| `STAT-VISAO`, `-F01…F17` | 04-02 §3 | 04-17 §3, 04-23 §2.1 |
| `STAT-PHAMCAN`, `-01…10` | 04-02 §4 | 04-14 §1, 04-19 §7 |
| `STAT-PHUCPHAN`, `-1…6` | 04-02 §5 | 04-19 §6.3 |
| `STAT-NHL-MOC/HOA/THO/KIM/THUY` | 04-03 §1 | 04-17 §4, 04-18 §3 |
| `STAT-NHL-TANG` | 04-03 §2 | 04-17 §4 |
| `STAT-BOHANH` | 04-03 §3 | 04-14 §3, 04-23 §3 |
| `STAT-THANLUC` | 04-03 §4 | 04-17 §5, 04-19 §6.2 |
| `STAT-THIENMENH`, `STAT-HYHANH`, `STAT-KYHANH`, `STAT-CUUHANH`, `STAT-NHANHANH` | 04-03 §5 | 04-17 §6 |
| `STAT-THIENTHOI` | 04-03 §6 | 04-08 §1, 04-22 |
| `STAT-NGUDUY-TAI/QUAN/AN/THUC/TY` | 04-04 §1 | 04-17 §7 |
| `STAT-ND-<TRỤC>-01…12` | 04-04 §5–9 | 04-06 (Mở sớm), 04-14, 04-16 |
| `STAT-BOKHUYET` | 04-04 §4 | 04-14 §4, 04-21 §2 |
| `STAT-MENHCACH`, `-TT/DC/NT/DK` | 04-05 §2 | 04-14 §1, 04-20 |
| `STAT-VITHUOC-ti/yin/shi/cai/guan` | 04-05 §2.6 | 04-15 §1 |
| `STAT-MENHCAP` | 04-05 §3 | 04-19 §6.1 |
| `STAT-NGUYENKHI` | 04-05 §4 | 04-17 §9 |
| `STAT-DACTINH` | 04-01 §3 (ID tổng), 04-06 | 04-16 |
| `STAT-QUYKHI` | 04-06 §4 | 04-21 §3 |
| `STAT-TUCNGHIEP` | 04-07 §2 | 04-21 §1 |
| `STAT-TAMMA-THAM/SAN/SI` | 04-07 §3 | 04-15 §2 |
| `STAT-TINHKHI` | 04-07 §4 | 04-15 §4, 04-21 §4 |
| `STAT-NAPAM` | 04-07 §5 | 04-19 §2 |
| `STAT-FLAG-<combo>` (17, + `:che`, `:hinh`), `STAT-FLAG-thau-*`, `STAT-FLAG-khuyet-*` | 04-07 §6 | 03, 06 |
| `STAT-THOIVAN-DV`, `STAT-THOIVAN-LN` | 04-08 §6 | 04-17 §10, 04-20 §4 |
| `STAT-DAOHANH` | 04-08 §1 | 04-23 §3 |
| `STAT-NGHICHTHIEN` | 04-08 §2 | toàn bộ |
| `STAT-CANCO`, `STAT-CANHGIOI` | 04-08 §3 | 04-22, 04-23 §5 |
| `STAT-LOI-01…22` | 04-13 §2.2 | 04-14 … 04-21 |
| `STAT-CANH-*` (cảnh kịch bản) | 04-14, 04-15, 04-20, 04-21 | 03 (gọi mô-đun) |

## 3. Chỉ mục `PERK-*` và móc

| Đặc Tính | Định nghĩa | Móc | Mở sớm nút |
|---|---|---|---|
| `PERK-tianYi` | 04-06 §3.1 | `/Q1` Người lạ trên bậc đá | AN-09 |
| `PERK-tianDe` | 04-06 §3.1 | `/Q1` Ngọn đèn không tắt | TY-06 |
| `PERK-yueDe` | 04-06 §3.1 | `/Q1` Rằm của người khác | — |
| `PERK-tianDeHe` | 04-06 §3.1 | `/Q1` Lời xin lỗi gửi muộn | — |
| `PERK-yueDeHe` | 04-06 §3.1 | `/Q1` Chén trà ba người | — |
| `PERK-dexiu` | 04-06 §3.1 | `/Q1` Bia không chữ | — |
| `PERK-tianShe` | 04-06 §3.1 | `/Q1` Ngày trời mở | — |
| `PERK-guoYin` | 04-06 §3.1 | `/Q1` Con dấu thất lạc | QUAN-08 |
| `PERK-wenChang` | 04-06 §3.2 | `/Q1` Ngọn bút của Tế tửu | AN-04, THUC-06 |
| `PERK-xueTang` | 04-06 §3.2 | `/Q1` Lớp học dưới gốc đa | AN-05 |
| `PERK-ciGuan` | 04-06 §3.2 | `/Q1` Bài phú đề tường | AN-07 |
| `PERK-taiJi` | 04-06 §3.2 | `/Q1` Bàn cờ không quân | AN-08, THUC-04 |
| `PERK-shiLing` | 04-06 §3.2 | `/Q1` Câu đố của con quạ | — |
| `PERK-sanQi` | 04-06 §3.2 | `/Q1` Ba chiếc chìa | — |
| `PERK-luShen` | 04-06 §3.3 | `/Q1` Bát cơm đầu mùa | TAI-06 |
| `PERK-tianChu` | 04-06 §3.3 | `/Q1` Cỗ chay cho làng | TAI-08 |
| `PERK-jinYu` | 04-06 §3.3 | `/Q1` Chiếc xe bỏ quên | TAI-04 |
| `PERK-jiangXing` | 04-06 §3.4 | `/Q1` Đội tuần đêm | QUAN-04, TY-08 |
| `PERK-yiMa` | 04-06 §3.4 | `/Q1` Mười hai trạm · `/Q2` Lá thư không người nhận | — |
| `PERK-taoHua` | 04-06 §3.5 | `/Q1` Cây đào giữa chợ | TY-02 |
| `PERK-hongYan` | 04-06 §3.5 | `/Q1` Bức tranh dang dở | THUC-09 |
| `PERK-huaGai` | 04-06 §3.5 | `/Q1` Ba đỉnh Cô Phong | AN-11 |
| `PERK-tianYiMed` | 04-06 §3.5 | `/Q1` Vườn thuốc của bà A Mậu | THUC-05 |
| `PERK-yangRen` | 04-06 §3.6 | ải Sân tầng 6 (04-15 §5.3) | — |
| `PERK-kuiGang` | 04-06 §3.6 | chuỗi Cương Nhu (04-15 §5.1) | QUAN-06 |
| `PERK-jinShen` | 04-06 §3.6 | chuỗi Lò Luyện (04-15 §5.2) | — |
| `PERK-xueRen` | 04-06 §3.7 | ải kiếp Thân Chắn (04-16 §6.1) | — |
| `PERK-liuXia` | 04-06 §3.7 | ải kiếp Ráng Chiều (04-16 §6.2) | — |
| `PERK-zaiSha` | 04-06 §3.7 | ải kiếp Bạch Hổ (04-16 §6.3) | — |
| `PERK-siFei` | 04-06 §3.7 | ải kiếp Hồi Sinh (04-16 §6.4) | — |

## 4. Thuật ngữ riêng của tài liệu 04

| Thuật ngữ | Nghĩa | Lần đầu |
|---|---|---|
| Lớp game | biến đổi do game định nghĩa trên số engine (không phải cổ pháp) | 04-01 §2 |
| Công tu | đơn vị Đạo Hạnh thô trước hệ số | 04-01 §2 |
| Tầng hành | mức 0–5 của một hành trong Ngũ Hành Lực | 04-03 §2 |
| Tầng hiệu dụng | tầng tính từ Lực Tiên Thiên + Bổ Hành | 04-03 §2 |
| Khuyết | tầng 0 / trục Ngũ Duy 0 — «còn để ngỏ» | 04-03 §2.2 |
| Rổ R1 / R2 / R3 / R4 | năng khiếu / thiên thời / thử thách / Nghịch Thiên | 04-01 §9 |
| Hoạt động Kỵ | việc có hành việc hoặc hành vùng = Kỵ hành | 04-03 §5.2 |
| Hệ số thiên phú (TM) | nhân XP cây Ngũ Duy theo điểm trục | 04-04 §2 |
| Ngộ | điểm mở nút cây kỹ năng | 04-04 §2.1 |
| Vị thuốc | phần tử `rescues[].drug` thành vật phẩm cần hái | 04-05 §2.6 |
| Nút thắt | bệnh không thuốc trên Mệnh Đồ | 04-05 §2.5 |
| Song nhận | Đặc Tính `volatile`: thưởng + thử thách riêng | 04-06 §2.3 |
| Kiếp số | Đặc Tính `hung`: ải có thưởng, không trừ | 04-06 §2.3 |
| Tự Tạo Quý Nhân | cơ chế của Quý Khí vi bạc | 04-06 §4.2 |
| Hồi quang | khung kể Túc Nghiệp Địa Ngục Đạo | 04-07 §2.2 |
| Đồng tu duyên | +5% khi nạp âm hai người hợp nhau | 04-07 §5 |
| Năm Hạn | lưu niên Hung / Đại hung — mở chuỗi Hồi III sớm | 04-08 §6.2 |
| Vận Cứu Cách | đại vận `gejuRescue` | 04-08 §6.3 |
| Đọc lại lá số | tính lại Tiên Thiên ở ranh mùa khi engine đổi | 04-01 §7.3 |

## 5. Tổng hợp câu hỏi mở

| # | Câu hỏi | Gửi | Đề xuất của 04 |
|---|---|---|---|
| Q1 | Lộ Nghịch Thiên chiếm ~51% người chơi; mở màn «Sơn Môn từ chối» có hợp với số đông? | 03 | giữ, viết lộ NT đầy đủ nhất; cảnh từ chối ngắn và ấm (04-14 §1.4) |
| Q2 | Cột Tiên Thiên trên Thiên Bảng | 10 | ẩn mặc định, tự bật |
| Q3 | Hoa Cái «giao lưu −10%» trong bản sơ đồ tổng | chủ dự án | bỏ phần trừ (N2) |
| Q4 | Ngân sách công tu/ngày (40 chuẩn) và công tu từng hoạt động | 09 | dùng bảng thẻ hành 04-18 §3 |
| Q5 | Cảnh giới có được giảm khi Sửa bát tự sang lá số NT thấp hơn? | chủ dự án | có, kèm cảnh báo (04-11 §9.3) — canon «chỉ tăng» áp cho lối chơi thường |
| Q6 | Người không rõ giờ: Mệnh Cách đổi theo giờ ở 74% ngày sinh | 03 | mở màn trung tính tới khi xác nhận giờ hoặc hết Hồi I |
| Q7 | Tặng lại bộ ngũ hành miễn phí khi Sửa bát tự đổi Dụng | 11 | có, với người không rõ giờ lúc đầu |
| Q8 | Hành của vùng theo Bát Quái (04-03 §6.1) | 07 | dùng bảng; 07 được đổi riêng từng vùng |
| Q9 | Tách «giới tính lá số» và «dáng nhân vật» ở cổng | 12 | tách |
| Q10 | Múi giờ lịch sử miền Bắc (cơ sở dữ liệu IANA không tách riêng) | 13 | hỏi người chơi, không tự đoán |
