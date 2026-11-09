# 05 · NGHỊCH THIÊN CẢI MỆNH — đặc tả hệ thống

> Tài liệu 05 của bộ GDD «Huyền Giới · Mệnh Do Ta Tạo». Nở từ bản sơ đồ `docs/GAME-AAA-THIET-KE.md` §5 (và §6.2), theo kinh điển chung `docs/gdd/00-KINH-DIEN-CHUNG.md`. Là **chuẩn chi tiết** của hệ cải mệnh (canon §6): ba tầng, Mệnh Đồ, Sổ Công Quá, nghiệp và sám hối, chín đạo thống + bàng môn, Tà Lộ, trừ tà chính tông, Quy nhất.
> Phiên bản 1.0 · 2026-11-05. Mọi số liệu lá số đã chạy engine thật của app (`src/engine/*`) cùng ngày.

---

## 1. Tóm tắt một trang

**Một câu:** người chơi đổi «quỹ đạo» của lá số bằng việc làm — đúng như app nói: «Mệnh = QUỸ ĐẠO, không phải KẾT CỤC» (`LIAOFAN_STORY.lesson`).

**Ba tầng, ba tài nguyên** (`remedy-fate › GAI_LEVELS`):
- **Cải Vận** → **Vận Phù**: thuận theo Dụng thần (hướng, màu, nghề, nhà, số, ăn, vật, ngày, bạn) — chỉ nhân **Phúc Khí**, trần +10–15% theo lưu niên, hết hạn tự nhiên. Không bao giờ đổi ra Đạo Hạnh.
- **Cải Tâm · Cải Hành** → **Đạo Hạnh**: việc thiện (Sổ Công Quá), tu, học; nhân **hệ số Nghịch Thiên** (căn thấp tới ×1,5), ái lực Dụng thần của đạo (+5–10%), **Nghịch Duyên** (+10% tu tâm ở năm hung). Nhật hạn mềm 120 / cứng 200. Cơ chế lõi **Ngũ Bộ Chuyển Niệm** (`GAI_XIN` 觉 → 停 → 转 → 净 → 化) chen vào hội thoại đúng lúc niệm xấu khởi.
- **Cải Mệnh** → **Cảnh giới** (6 bậc canon, không bao giờ hạ), **Đại Nguyện** Liễu Phàm 300 / 600 / 1.000 công, **Thiên Bảng** xếp theo Đạo Hạnh.

**Mệnh Đồ** = `gaimenhPlan(R)` nguyên văn: 6 chẩn đoán có thể có, 6 tầng cố định; game thêm **đèn ưu tiên**, ~70 mẫu nhiệm vụ `CQ-MD`, tính lại khi sửa giờ sinh / Lập Xuân.

**Sổ Công Quá** = `CONG_QUA` (10 thiện, 9 ác) + `meritLedger`: **198 việc thiện + 39 việc ác** cụ thể trong thế giới (`DEED-001…245`), nhật hạn 15 công, 9 luật chống cày; âm thiện / dương thiện; sổ đời thực tùy chọn, không thưởng.

**Nghiệp:** 10 thanh `KARMA-*` (một cho mỗi `YEGUO`), chỉ tăng khi người chơi **chọn**; giảm bằng **việc sửa bắt buộc** + nghi lễ (`CHAN_HUI` 5 pháp + lễ sám Đạo gia) + giữ giới; 7 kinh theo việc là thẻ đọc ở Tàng Kinh Các, không «bấm để buff».

**Đạo thống:** 9 đạo + bàng môn + Pháp Môn Liễu Phàm; 3 suất; 5 hạng; giới thường trực / đạo tràng; ≥ 15 nhiệm vụ mỗi đạo; Tu Bổ là lớp Hậu Thiên chồng lên chỉ số (không sửa lá số).

**Tà Lộ:** Âm Bài nhân đôi Đạo Hạnh **và phá nhật hạn** — cám dỗ thật; **Nợ Âm** công khai, chứng minh toán học tổng lợi luôn âm; 10 bậc hệ quả trên NPC có tên; đường về luôn mở → Phong Đô → danh hiệu **Hồi Đầu**. Đối trọng: **trừ tà chính tông** với quy trình 5 bước bắt buộc chẩn đoán đời thực và chuyển hướng sức khỏe tâm thần.

**Quy nhất:** 3 đạo hạng III + Sổ dương + Nợ Âm 0 + nghiệp < 50 + Mệnh Đồ 6 nút + Đại Nguyện 1 + chuỗi «Ba Đường Một Lòng» → bậc 6, Côn Lôn. Người chơi đều đặn ≈ 3 tháng.

**iOS:** chỉ tu tâm, học, việc thiện — không Vận Phù, không Thái Tuế, không Tà Lộ, k = 1, Mệnh Đồ 3 nút («Lộ Tu Học»).

---

## 2. Sơ đồ hệ thống

```
                         analyze(ngày giờ sinh)  ── src/engine/chart.js
                                   │  R
     ┌─────────────────────────────┼──────────────────────────────────────────────┐
     │                             │                                              │
 buildRemedy(R)              gaimenhPlan(R)                 getYeguoForChart · computeLiuDao · analyzeAmTa(opt-in)
 twelveLaws ①–⑨                 │ diagnosis · layers · verdict          │  (chỉ để NHẮC, không phạt)
     │                           │                                       │
     ▼                           ▼                                       ▼
 ┌────────────┐           ┌─────────────┐                        ┌──────────────┐
 │ VẬN PHÙ     │           │  MỆNH ĐỒ     │──── CQ-MD ────┐        │ cảnh báo Giác │
 │ ×Phúc Khí   │           │  6 nút, đèn  │               │        │ (Ngũ Bộ)      │
 └─────┬──────┘           └──────┬──────┘               │        └──────┬───────┘
       │ Phúc Khí → bố thí       │                      │               │
       ▼                         ▼                      ▼               ▼
 ┌──────────────────────────────────────────────────────────────────────────────────┐
 │  VIỆC NGƯỜI CHƠI LÀM: DEED thiện / ác (lựa chọn) · tu · học · nghi lễ · giới      │
 └───────┬───────────────────────┬──────────────────────────┬──────────────────────┘
         ▼                       ▼                          ▼
  SỔ CÔNG QUÁ             ĐẠO HẠNH (× k × a × n × h)     THANH NGHIỆP KARMA-*
  meritLedger · mốc        nhật hạn · Tĩnh Khí              sự vụ → việc sửa + sám + giới
  300/600/1.000                   │                          │
         │                        ▼                          │
         └──────────────▶  CẢNH GIỚI 1–6 ◀────────────────────┘ (Chướng ≥ 80 chặn đột phá)
                                  │
         ĐẠO THỐNG (3 suất) ──────┤──────── TÀ LỘ: Âm Bài → Nợ Âm → hệ quả NPC
         hạng I–V · Tu Bổ        │                  └─▶ Phong Đô → Hồi Đầu (chặn bậc 5–6 khi còn nợ)
                                  ▼
                     QUY NHẤT → bậc 6 → CÔN LÔN · Thiên Mệnh Bàn (công cả máy chủ)
```

---

## 3. Mục lục

| Phần | Nội dung |
|---|---|
| [05-01 Ba tầng](05-01-ba-tang.md) | Cải Vận (10 Vận Phù, trần theo lưu niên), Cải Tâm · Hành (công thức Đạo Hạnh, k, nhật hạn, Ngũ Bộ Chuyển Niệm, Tâm Đề theo nhật can, khiêm / âm thiện, giới, Thập Thiện, Tam Tầng Dược), Cải Mệnh (cảnh giới, đột phá, Đại Nguyện, Thiên Bảng), UI, dữ liệu |
| [05-02 Mệnh Đồ](05-02-menh-do.md) | đầu ra `gaimenhPlan`; 6 chẩn đoán + tần suất trên 400 lá số; 6 tầng × biến thể → ~70 nhiệm vụ `CQ-MD`; đèn ưu tiên; Đắc Cứu; tính lại; MMO |
| [05-03 Sổ Công Quá](05-03-so-cong-qua.md) | đơn vị công, đường ống ghi sổ, 9 luật chống cày, việc ác chỉ khi chọn, ba mốc Liễu Phàm, `verdict`, sổ đời thực, sổ môn phái / máy chủ, kịch bản |
| [05-04 Danh mục DEED](05-04-deed-catalog.md) | 198 thiện + 39 ác, mỗi việc: nhóm `CONG_QUA`, công, kích hoạt, vùng, hồi chiêu, chống cày, hạnh, âm |
| [05-05 Nghiệp và sám hối](05-05-nghiep-sam-hoi.md) | 10 thanh `KARMA-*`, tâm ma, cảnh báo theo lá số (và lỗi engine), 5 + 1 nghi lễ sám, việc sửa, chuỗi `CQ-SH`, 7 kinh theo việc, Chuẩn Đề pháp môn, Lục Đạo, 14 luật trình bày tôn trọng |
| [05-06 Đạo thống — luật chung](05-06-dao-thong-chung.md) | 3 suất, 5 hạng, ĐH-đạo, ái lực Dụng thần, giới, Tu Bổ, hoạt động lõi, sư đồ, lịch lễ |
| [05-07 Chính Nhất · Thanh Vi / Đan Đỉnh](05-07-chinh-nhat-thanh-vi.md) | thang lục; công phu; giới; hoạt động; `CQ-CN`, `CQ-TV`; đề; kịch bản |
| [05-08 Toàn Chân / Linh Bảo · Thượng Thanh / Lư Sơn](05-08-toan-chan-thuong-thanh.md) | giới đàn, vân du, khoa nghi; nhánh đời thực / âm tà; `CQ-TC`, `CQ-TT` |
| [05-09 Bắc Đế / Động Uyên · Thiền Trúc Lâm](05-09-bac-de-thien.md) | Phong Đô — đạo của việc khép lại; Lục Diệu Pháp Môn; `CQ-BD`, `CQ-TH` |
| [05-10 Tịnh Độ · Mật / Chuẩn Đề](05-10-tinh-do-mat.md) | Cửu phẩm biểu tượng; lớp Chuẩn Đề làm ngay, lớp Tạng truyền chờ tham vấn; `CQ-TD`, `CQ-MT` |
| [05-11 Nho / Tịnh Minh · Bàng môn · Liễu Phàm](05-11-nho-bang-mon.md) | khoa cử, tự tỉnh, ngũ thường theo Dụng; Vu Y văn hóa; Pháp Môn Liễu Phàm; `CQ-NH`, `CQ-BM`, `CQ-LP` |
| [05-12 Tà Lộ](05-12-ta-lo.md) | cổng opt-in, Âm Bài, toán Nợ Âm + chứng minh, 10 bậc hệ quả, án có tên, đường về, đọc sổ Phong Đô, `CQ-HD`, Hồi Đầu, MMO, giới hạn nội dung |
| [05-13 Trừ tà chính tông](05-13-tru-ta-chinh-tong.md) | máy trạng thái 5 bước, 30 nguyên nhân đời thực, chuyển hướng sức khỏe tâm thần, bộ sinh án, `CQ-TR` |
| [05-14 Quy nhất · cân bằng · chống khai thác · iOS](05-14-quy-nhat-can-bang.md) | 7 điều kiện Quy nhất, `CQ-QN`, bảng nguồn Đạo Hạnh theo đạo, mô phỏng 4 kiểu người chơi, so căn cao / thấp, 25 khai thác, máy chủ chứng thực, telemetry, ma trận iOS |
| [05-15 Dữ liệu kiểm thử](05-15-du-lieu-kiem-thu.md) | 13 lá số chạy engine thật + đầu ra game mong đợi; vector kiểm mọi công thức |
| [05-16 Ngân hàng đề](05-16-ngan-hang-de.md) | 240 câu kiểm tri 8 đạo, mỗi câu có nguồn dữ liệu app |
| [05-17 Thoại hệ thống](05-17-thoai-he-thong.md) | thoại kịch bản theo sự kiện hệ 05 (chạy khi AI tắt / iOS) |
| [05-18 Giao diện](05-18-giao-dien.md) | 17 màn hình `S-xx`, trạng thái, trợ năng |
| [05-19 Dữ liệu và sự kiện](05-19-du-lieu-su-kien.md) | tệp dữ liệu, bản ghi mẫu, nhánh `caimenh`, di trú `state.js`, sự kiện máy chủ, máy trạng thái nhiệm vụ, lớp đọc engine |
| [05-20 Hành trình người chơi](05-20-hanh-trinh-nguoi-choi.md) | 4 lá số đi qua hệ: MAU-A, căn thấp, lá số tốt ít giờ, Tà Lộ → Hồi Đầu |
| [05-21 Kịch bản Mệnh Đồ · Quy nhất](05-21-kich-ban-menh-do.md) | cảnh then chốt `CQ-MD`, `CQ-QN`; Khổng tiên sinh ở các mốc |
| [05-22 Kịch bản sám hối · Hồi Đầu · trừ tà](05-22-kich-ban-sam-hoi-hoi-dau.md) | 10 cảnh mở `CQ-SH`, 6 mẫu cứu nhà, cảnh `CQ-TR`, cầu Nại Hà |
| [05-23 Nội dung theo vùng](05-23-noi-dung-theo-vung.md) | 20 vùng: NPC, chuỗi, DEED, nghi lễ, công trình cần có |
| [05-24 Kịch bản giữa chuỗi đạo](05-24-kich-ban-dao-thong.md) | 2 cảnh mỗi đạo (thăng hạng, thử giới) |
| [05-25 Danh hiệu · quyết định](05-25-danh-hieu-quyet-dinh.md) | danh hiệu, vật thưởng không bán; 38 quyết định thiết kế có lý do |
| [05-26 Yêu cầu mini-game](05-26-yeu-cau-mini-game.md) | 22 mini-game `Y-xx` gửi tài liệu 09 |
| [05-27 Trợ giúp · triển khai](05-27-huong-dan-trong-game.md) | văn bản trợ giúp trong game; kế hoạch M0–M5 |
| [05-28 Chín án Định Mệnh Hội](05-28-an-dinh-menh-hoi.md) | kịch bản vạch mặt DEED-146…154 |
| [05-29 AI và ngữ cảnh](05-29-ai-ngu-canh.md) | `gameContext` hệ 05, công cụ theo NPC, kiểm tên, cụm cấm, mẫu hỏi – đáp |
| [05-30 Nhịp năm](05-30-nhip-nam.md) | bảng đặt lại ngày / tuần / tháng / năm, trình tự Lập Xuân, lễ tiết chạm cơ chế nào, mùa, tuần mẫu |

**Đọc nhanh theo vai:** thiết kế hệ thống — 01, 02, 03, 05, 06, 12, 14; nội dung / truyện — 04, 07…11, 17, 21, 22, 24, 28; kỹ thuật — 15, 19, 26, 29; UI — 18, 27; QA — 14 §3, 15, 16.

---

## 4. Mã định danh mới (không gian tên của tài liệu 05)

| Không gian | Phạm vi | Số lượng | Ở |
|---|---|---|---|
| `DEED-001 … 198` | việc thiện | 198 | 05-04 |
| `DEED-201 … 245` | việc ác (39 có điểm; 206, 226 là dòng ghi chú «không phải ác»; 209, 210, 220, 230 dự trữ) | 39 | 05-04 §14 |
| `KARMA-SAT · DAO · DAM · VONG · LUONG · AC · Y · THAM · SAN · SI` | thanh nghiệp | 10 | 05-05 |
| `CQ-MD-00 … 94` (có 33a/b/c, 62P/Q) | Mệnh Đồ | ~70 | 05-02 |
| `CQ-CN-01 … 15, -V` | Chính Nhất | 16 | 05-07 |
| `CQ-TV-01 … 15, -V` | Thanh Vi · Đan Đỉnh | 16 | 05-07 |
| `CQ-TC-01 … 15, -V` | Toàn Chân · Linh Bảo | 16 | 05-08 |
| `CQ-TT-01 … 15, -V` | Thượng Thanh · Lư Sơn | 16 | 05-08 |
| `CQ-BD-01 … 15, -V` | Bắc Đế · Động Uyên | 16 | 05-09 |
| `CQ-TH-01 … 15, -V` | Thiền | 16 | 05-09 |
| `CQ-TD-01 … 15, -V` | Tịnh Độ | 16 | 05-10 |
| `CQ-MT-01 … 15, -V` | Mật · Chuẩn Đề (12–15, V chờ tham vấn) | 16 | 05-10 |
| `CQ-NH-01 … 15, -V` | Nho · Tịnh Minh | 16 | 05-11 |
| `CQ-BM-01 … 15` | Bàng môn (đạo phụ) | 15 | 05-11 |
| `CQ-LP-01 … 07` | Pháp Môn Liễu Phàm | 7 | 05-11 |
| `CQ-SH-<thanh>-01 … 03` | chuỗi giải nghiệp | 30 | 05-05 §6 |
| `CQ-HD-01, -02, -03…n, -B1…B9, -S, -Z` | Hồi Đầu | khuôn | 05-12 §7 |
| `CQ-TR-01 … 15` | trừ tà chính tông · cứu người trúng yểm | 15 | 05-13 |
| `CQ-QN-01 … 10` | Quy nhất | 10 | 05-14 |

**Mã nội bộ** (chỉ dùng trong tài liệu 05, tài liệu khác ánh xạ sang mã chuẩn của mình): Vận Phù (tên); `S-01…17` màn hình → tài liệu 12 `UI-xx`; `Y-01…22` mini-game → tài liệu 09 `MG-xx`; luật `L-`, `CC-`, `AC-`, `NG-`, `SS-`, `ST-`, `SĐ-`, `TB-`, `QT-`, `QN-`, `DS-`, `MO-`, `X-`, `TT-`, `TL-G`, `QĐ-`, `ĐMH-`; lá số thử `V-01…11`.

**Mã của tài liệu khác được nhắc nhưng không tạo ở đây:** `MQ-*`, `TL-*`, `BR-*` (03); `NPC-*`, `PERSONA-*`, `BARK-*` (06); `BLD-*` (07); `MOD-*` (08); `MG-xx` (09); `EV-*` (10); `SKU-*` (11); `UI-xx`, `SFX-*` (12); `SCHEMA-*`, `TASK-xxx` (13); `RISK-xx` (14); `LORE-*` (02).

---

## 5. Lỗi engine phát hiện khi viết tài liệu này (cần sửa ở app; game đã có lớp vá tạm — 05-19 §7)

| # | Hàm | Lỗi | Bằng chứng | Đề xuất |
|---|---|---|---|---|
| E-1 | `remedy-fate › getRemedyForChart` | so `'劫财'` (giản) với dữ liệu `'劫財'` (phồn) → nhánh Kiếp Tài không bao giờ khớp; chỉ xét can lộ (bản sơ đồ B.1) | MAU-A can lộ có 劫財 | so cả hai dạng chữ; xét tàng can |
| E-2 | `getRemedyForChart` fallback | khi không khớp, trả «Nhật Chủ nhược + Cách bại» kể cả lá số thân vượng / có cứu | MAU-A, V-06 | trả rỗng + lời khuyên chung |
| E-3 | `getYeguoForChart` nhánh Thâu đạo | điều kiện `/财|Tài/.test(JSON.stringify(yong))` gần như luôn đúng | 86,5% / 400 lá số; 11 / 13 lá số thử | chỉ khi tổ hợp `caiDuo` / `qunJie` hoặc chẩn đoán D5 |
| E-4 | `getYeguoForChart` nhánh Tà dâm | regex trên 300 ký tự JSON `interactions` không bao giờ khớp | 0% / 400 | đọc trực tiếp xung / hại chi ngày |
| E-5 | `getYeguoForChart` nhánh Sân | cùng lỗi giản / phồn 劫财 | như E-1 | như E-1 |
| E-6 | `daozang-data › suggestDaozangChartAware` | đọc `yong.god` (không tồn tại) thay `yong.primary` (bản sơ đồ B.2 — xác nhận) | đọc mã | đổi trường |
| E-7 | `daozang-data › _PATTERN2CULT` | khóa giản thể (`七杀格`) trong khi `pattern.name` phồn thể (`七殺格`) | MAU-A | chuẩn hóa chữ trước khi tra |
| E-8 | `gaimenh › gaimenhPlan` D3 | dùng `lnNow.score < 0`; điểm lưu niên thường 2–98, chỉ âm sau điều chỉnh cách → D3 hiếm (3,3%); MAU-A năm «Đại hung» điểm 6 không sinh D3 | 400 lá số; MAU-A | dùng `rating ∈ {Hung, Đại hung}` |
| E-9 | `taisui › TAISUI_REMEDY` ③ | khuyên chủ động trích máu «ứng huyết quang» | đọc dữ liệu | bỏ hoặc ghi rõ không khuyến khích (game đã loại) |
| E-10 | `patternQuality` | 化金格 / 從財格 trả 成格 / 败格, không có 特殊 trong 4.000 lá số thử | 05-15 §2.1 | kiểm lại điều kiện 特殊 hoặc xác nhận đúng ý |

---

## 6. Câu hỏi mở (cần chủ dự án / cố vấn)

1. **Tên vùng «Miêu Cương»** gắn với một dân tộc có thật — giữ (với nguyên tắc BM-V1…V5) hay đổi tên hư cấu?
2. **Ông bà chủ nhà trọ Huyền Thành** làm «cha mẹ nuôi» chung cho đối tượng hiếu — tài liệu 03 / 06 xác nhận.
3. **Tên các bậc lục Chính Nhất**, ngày vía Chuẩn Đề, ngày giỗ Tổ Trúc Lâm dùng trong game — cố vấn chốt.
4. **Mật tông Tạng truyền** (Mật hạng IV–V, Tạng Địa) — chờ tham vấn; Quy nhất đã thiết kế không phụ thuộc.
5. **Dị Cách (`特殊`)** gần như không xuất hiện trong engine — cần lá số dựng tay để test nhánh Phương Sĩ, hoặc sửa engine.
6. **iOS:** có ẩn cả Tiềm Lực / Phẩm căn (tài liệu này ẩn để an toàn 4.3b) hay giữ như trang «học lá số»? Tài liệu 04 + 14 quyết.
7. **Hiệu chỉnh cân bằng** (05-14 §2.4) cần telemetry beta; mọi hằng số (120 / 200, 15 công, 2 ĐH / công, ngưỡng hạng) để trong dữ liệu.

---

## 7. Nghiệm thu tổng

Danh sách đầy đủ ở 05-14 §7. Bốn điều không được thiếu khi ra mắt bất kỳ phần nào của hệ 05:
1. Không đường nào từ tiền thật tới Đạo Hạnh, công, cảnh giới, Nợ Âm.
2. Không câu nào (kịch bản hay AI) phán «mệnh đã định», khẳng định ma, hứa hiệu quả nghi lễ đời thực.
3. Mọi trừ phạt chỉ đến từ lựa chọn có báo trước, và luôn có đường lấy lại.
4. Mọi án chạm sức khỏe / tâm lý có bước chuyển người và thẻ hỗ trợ đời thực.
