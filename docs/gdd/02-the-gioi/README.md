# 02 · THẾ GIỚI QUAN — Kinh thánh thế giới của Huyền Giới

> Tài liệu số 02 trong bộ GDD «Huyền Giới · Mệnh Do Ta Tạo». Mở rộng `docs/GAME-AAA-THIET-KE.md` §2 (thế giới quan) và §7 (mười hai thánh địa). Mọi mã, tên, tọa độ tuân `docs/gdd/00-KINH-DIEN-CHUNG.md`.
> Không gian tên của tài liệu này: **`LORE-xxx`** (codex), **`FAC-xxx`** (phe), **`HIS-xxx`** (sự kiện lịch sử).

## Phạm vi

Tài liệu trả lời: **thế giới vận hành theo luật gì, đã xảy ra chuyện gì, có những vùng nào, ai sống ở đó, họ tin gì, buôn gì, gọi nhau là gì**, và **AI phải nói gì cho đúng**. Không thuộc phạm vi: kịch bản cốt truyện chính (03), công thức chỉ số (04), cải mệnh (05), persona NPC (06), công trình chi tiết (07–08), mini-game (09), giá bán (11).

## Mục lục

| Phần | Tệp | Nội dung |
|---|---|---|
| 01 | `01-vu-tru-quan.md` | Quy tắc Gương Kính (Huyền Giới ↔ Nhân Gian); Tam Tài; Ngũ Hành là vật lý; Cửu Cung vùng; can chi là thời gian – thời tiết (Huyền Lịch, Tam Nguyên Cửu Vận, 24 tiết khí, khí ngày, 12 canh, ma trận thời tiết, hệ số 20 vùng, sắc trời); Thiên Mệnh Bàn — huyền thoại, Bàn Minh 16 chữ, 6 văn bản trong thế giới |
| 02 | `02-bien-nien-su.md` | 100 sự kiện HIS-001 → HIS-100 qua 3 kỷ; bảng lập thánh địa; dòng thời gian Định Mệnh Hội |
| 03 | `03-dia-ly-tam-vung.md` | 8 vùng lõi: khí hậu, địa hình, sinh vật, dược thảo, dân cư, phong tục, lễ, giọng nói, món, nghề, truyền thuyết, đường nối |
| 04 | `04-dia-ly-thanh-dia-1.md` | Long Hổ, Võ Đang, Chung Nam, Mao Sơn, Yên Tử, Bút Tháp |
| 05 | `05-dia-ly-thanh-dia-2.md` | Tạng Địa (chờ tham vấn), Văn Miếu, Phong Đô, Miêu Cương, Côn Lôn, Am Vân Cốc |
| 06 | `06-phe-phai.md` | 32 phe FAC-001 → FAC-032; thang thiện cảm; Định Mệnh Hội (cấp bậc, Tứ Trụ Lão, 8 Hạn Chủ, Bát Gian Thuật ↔ DP1–DP8, Ngũ Cấm Phạm ↔ RB1–RB5); ma trận quan hệ |
| 07 | `07-codex-than-thanh.md` | Codex I: 90 mục thần thánh, Phật Bồ Tát, chân nhân, thánh hiền (LORE-001 → 090) |
| 08 | `08-codex-kinh-dien.md` | Codex II: 99 kinh điển thật (LORE-101 → 199) |
| 09 | `09-codex-thai-tue-luc-dao.md` | Codex III: 60 Thái Tuế, Lục Đạo, 5 loại linh, khái niệm Thái Tuế, khái niệm trời đất (LORE-201 → 290) |
| 10 | `10-codex-bao-vat-dia-danh.md` | Codex IV: 40 bảo vật hư cấu + 59 địa danh (LORE-301 → 399) |
| 11 | `11-codex-le-tiet-sinh-linh-tin-nguong.md` | Codex V: 40 lễ tiết, 30 sinh linh, 29 tín ngưỡng dân gian (LORE-401 → 499) |
| 12 | `12-dat-ten-lich-kinh-te.md` | Quy ước đặt tên (theo vùng, đạo thống, phái kệ hư cấu); lịch lễ cả năm, tuần can, chợ phiên; kinh tế trong thế giới (tiền tệ lore, hàng hóa vùng, đường buôn, luật chợ, kinh tế đen, thứ không mua được); đơn vị đo |
| 13 | `13-van-ban-trong-the-gioi.md` | 22 văn bản dùng nguyên văn: Bàn Ký, hai hương ước, Thập Giới Thầy Bói, biên bản 9 ngày biện luận, Biện Hoặc Thư, Định Bàn Kinh + chú, sổ Bát Gian Thuật + bút phê, thư, câu đối 20 nơi, 10 bài đồng dao |
| 14 | `14-hoi-dap-lore-neo-ai.md` | 55 hỏi – đáp chuẩn để neo AI (`checkNeo`), 12 câu bẫy kiểm thử, từ nên dùng / tránh |
| 15 | `15-truyen-ke-quan-tra.md` | 12 người kể chuyện vùng, 30 truyện quán trà (cổ kể lại + Huyền Giới) |
| 16 | `16-tra-cheo-theo-vung.md` | Thẻ tra 20 vùng, tra theo NPC canon, bản đồ quầy Định Mệnh Hội |
| 17 | `17-giong-noi-cac-vung.md` | Giọng nói 20 vùng: nét giọng, xưng hô, từ vùng, 6 câu mẫu theo tình huống; giọng theo phe; câu tóm vùng |
| 18 | `18-san-vat-duoc-thao-mon-an-nghe.md` | 40 dược thảo, 40 món ăn, 30 nghề thủ công, lịch hái theo 24 tiết khí |
| 19 | `19-noi-dung-thanh-tich.md` | Thập Điện Phong Đô (10 bài học), 12 công án vườn tháp Yên Tử, 7 bồ đoàn Thất Chân, 9 tầng Cửu phẩm liên hoa, năm cung thần đạo Võ Đang |

## Tóm tắt một trang

- **Huyền Giới** là đại lục nổi giữa biển mây, «cõi gương» của thế giới thật (Nhân Gian). Giáo pháp chân chính ở Nhân Gian chiếu sang qua **Đăng Lộ**; tổ sư lịch sử không xuất hiện thành nhân vật; mọi người, vật, sự kiện hư cấu gắn nhãn **[HƯ CẤU]**.
- **Luật vật lý:** Tam Tài là ba tầng thật; Ngũ Hành là năm trạng thái của khí, mỗi vùng mang một cung – hành (Cửu Cung); **can chi thật là đồng hồ và thời tiết**; năm đổi ở Lập Xuân; **Huyền Lịch** đếm Hoa Giáp từ năm Giáp Tý 4 CN (2026 = Giáp 34 · Bính Ngọ); hiện ở **Vận 9** (2024–2043, Ly – Hỏa, «vận soi sáng»). Thế giới **chỉ thưởng, không phạt** theo lá số.
- **Thiên Mệnh Bàn**: ba vòng (đất – giờ – biến) và một lõi để trống — «chỗ của người đọc». Bàn Minh 16 chữ: *trời định khung, người viết chữ; khung không dời, chữ không ai viết thay*. Bàn nứt đêm Lập Xuân 2024; **trời không sai, chỉ gương rạn**.
- **Lịch sử** ba kỷ: Hồng Mông – Khai Bàn; Đăng Lộ – Vạn Đạo (các đạo thống tới, thánh địa lập); Bàn Nứt – Định Mệnh (thầy bói chợ, Định Mệnh Hội, khách lạc). Không có vua, không có chiến tranh; khủng hoảng là **niềm tin và lừa đảo**.
- **Phản diện** là **Định Mệnh Hội** — đọc lá số chuẩn, phán chắc, dọa, bán lễ; tám mánh đối xứng tám mẫu phát hiện của app; thủ lĩnh ngầm là kẻ **mạo danh** tổ nghề Lỗ Ban. Mọi thành viên đều có đường hồi đầu.
- **Tôn trọng:** Tạng Địa chờ tham vấn; người Miêu là nạn nhân tin đồn, không bao giờ là phản diện; Phong Đô là nơi soi xét đạo đức, không kinh dị; thần Phật chỉ hiện qua tượng, kinh, lễ.

## Mã định danh mới

| Không gian | Khoảng dùng | Số lượng | Ghi chú |
|---|---|---|---|
| `HIS-xxx` | HIS-001 → HIS-100 | 100 | HIS-101+ dành cho sự kiện theo năm thật sau phát hành (≤ 5/mùa) |
| `FAC-xxx` | FAC-001 → FAC-032 | 32 | — |
| `LORE-xxx` | 001–090 · 101–199 · 201–290 · 301–399 · 401–499 | 477 | Khoảng trống 091–100, 200, 291–300, 400 để dành bổ sung sau tham vấn |

Mã của tài liệu khác chỉ được **tham chiếu**, không tạo mới ở đây (`MQ-*`, `SQ-*`, `CQ-*`, `EV-*`, `NPC-*`, `POI-*`…). Các tên NPC phụ mới gắn [HƯ CẤU] trong phần 06, 13, 15 chờ tài liệu 06 cấp mã `NPC-*`.

## Nguồn app đã dùng

`schools-data` (12 trường phái), `daozang-data` (tên, bộ, niên đại, tóm tắt kinh), `bitruyen-data` (tàn quyển, khẩu quyết, Lỗ Ban Kinh «cấm thực hành»), `library-data` (ETHICS hiển thị), `remedy-fate` (LIAOFAN_STORY, YEGUO, CHAN_HUI, JING_ZHOU, TEN_THIEN, CONG_QUA, ZHUNTI), `liudao` (SIX_REALMS), `taisui-general` (TAISUI_60, CURATED, NAYIN_TRAIT), `amta-data` (spiritTypes, ETHICS), `anti-manipulation-data` (GR1–6, DP1–8, RB1–5), `tcm` (WUX_ZANG), `src/game/terrain.js` (REGIONS, RIVER, SKY_ISLAND), `world.js` (HALLS, ROOMS), `models.js` (thienBan, crane), `thaitue.js`.

## Việc cần làm cho tài liệu khác (chưa có trong code)

Chu kỳ ngày đêm theo giờ thật; hệ thời tiết theo can ngày × mùa × vùng; skybox chuôi Đẩu theo tháng; hiệu ứng vòng Thời rung; Địa Khí vùng; chợ phiên theo chi ngày; ngày Thiên Xá; Kính Chiếu Gian (đánh dấu câu thoại DP1–DP8).

## Câu hỏi mở

1. Đồng hồ thế giới MMO: UTC+7 cố định hay theo khu vực máy chủ?
2. Thiên Bàn Đảo (z = 300, phía Nam) là «bệ tạm» của Bàn — có cần dời để khớp với Côn Lôn ở phía Bắc không?
3. Tạng Địa, Miêu Cương, Phật giáo Việt (Khóa Hư Lục, Cư Trần Lạc Đạo Phú): ai tham vấn, khi nào?
4. Âm Hán Việt «訾» (Thái Tuế Giáp Tuất) và ngày giỗ Phật hoàng cần đối chiếu.
5. Câu đối 20 nơi cần người am hiểu Hán văn duyệt niêm luật.
6. Tên «A Mậu» theo khuôn tên H'Mông cần duyệt.
