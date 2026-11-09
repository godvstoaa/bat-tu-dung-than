# 03 · CỐT TRUYỆN — kịch bản đầy đủ · Huyền Giới · Mệnh Do Ta Tạo

> Tài liệu 03 nở từ §3 «Cốt truyện chính» của `docs/GAME-AAA-THIET-KE.md` (dùng thêm §2, §5.5, §6.2–6.3) và tuân thủ tuyệt đối `docs/gdd/00-KINH-DIEN-CHUNG.md`.
> Không gian tên do tài liệu này cấp: **`MQ-*`, `BR-*`, `TL-*`, `CUT-xxx`**. Mã của tài liệu khác chỉ được **đề xuất**, ghi «TBD-<số tập>» (theo quy ước của tập 07).
> Lore Thiên Mệnh Bàn (ba vòng Địa · Thời · Biến, lõi Thiên Tâm, Bàn Minh 16 chữ, nứt đêm Lập Xuân Giáp Thìn 2024) lấy theo tập 02 `02-the-gioi/01-vu-tru-quan.md` §1.4. Chỗ nào tập 03 bổ sung sự kiện mới cho Bàn đều ghi rõ là «sự kiện cốt truyện», không phải đồng hồ đếm ngược (khớp luật 1.4.5 của tập 02).

## 0. Mục lục

| Tệp | Nội dung | Mã |
|---|---|---|
| `README.md` | Tổng quan, cấu trúc hồi, bảng nhiệm vụ, bảng cảnh cắt, sổ cờ, quy tắc chung, mã mới | — |
| `03-01-mo-dau.md` | Mở đầu «Nhập Môn»: cổng, lật trụ, Sổ Mệnh, phẩm phục, Bàn nứt, **ba lời phán** (khuôn sinh + 3 ví dụ chạy engine), đêm Trà Thất, ngã rẽ | `MQ-P-01…08` |
| `03-02-hoi-1.md` | Hồi I «Bản Mệnh»: ba án khách, hành thiếu, Vận Mệnh Các, Thái Tuế Điện, Khổng tiên sinh ở chợ, Vân Cốc, Sổ Công Quá, Mệnh Đồ | `MQ-1-01…14` |
| `03-03-hoi-2a.md` | Hồi II «Vạn Đạo» phần A: Đình Truyền Đạo, các tầng Mệnh Đồ (Không gian, Tên, Thời, Thái Tuế, Làm công), án lừa DP6 · RB5-huyền không · DP7 · DP4 · DP3 | `MQ-2-01…11` |
| `03-04-hoi-2b.md` | Hồi II phần B: án lừa DP1 · DP2 · DP5 · DP8, Ba nén nhang, Âm đức, Khổng tiên sinh nổi giận, bản dập Bàn Minh, văn đấu Chính Đường, Bàn nứt lần hai | `MQ-2-12…22` |
| `03-05-hoi-3.md` | Hồi III «Năm Hạn»: mộng năm hung nhất, sáu tầng thử, tỉnh mộng, nền nhà ông Kha, **cám dỗ Lỗ Ban**, tự lực qua hạn | `MQ-3-01…13` |
| `03-06-hoi-4.md` | Hồi IV «Âm Dương» (chính lộ): Miêu Cương, Mao Sơn chẩn đoán đời thực, hang yểm sư, Phong Đô, **cầu Nại Hà (MMO)**, sổ nghiệp, đối diện Lỗ Ban | `MQ-4-01…13` |
| `03-07-vi-thanh.md` | Vĩ thanh «Côn Lôn Thiên Trì»: Quy nhất, Dao Trì, lần đoán cuối, **sự kiện máy chủ Hợp Luân**, Thiên Bảng, Lập Xuân | `MQ-E-01…07` |
| `03-08-nhanh-tt-dc.md` | Nhánh Thuận Thiên và Đắc Cứu | `BR-TT-01…07`, `BR-DC-01…07` |
| `03-09-nhanh-nt-dk.md` | Nhánh Nghịch Thiên và Dị Cách | `BR-NT-01…07`, `BR-DK-01…07` |
| `03-10-ta-lo.md` | Chuỗi Tà Lộ: Âm Bài, Nợ Âm, hệ quả lên NPC có tên, Phong Đô lối tà, sám hối có việc, **Hồi Đầu** | `TL-01…13` |
| `03-11-canh-cat.md` | Danh sách cảnh cắt: từng cú máy, camera, nhạc, thời lượng | `CUT-001…048` |
| `03-12-phu-luc.md` | Phụ lục sản xuất: lời phán mẫu cho 10 lá số, thẻ AI, sổ thưởng từng nhiệm vụ, biến thể theo nhánh, thoại dự phòng khi AI tắt, lịch Thái Tuế 12 mùa, lồng tiếng, khối lượng | — |
| `03-13-bien-the-va-kiem-thu.md` | Năm lá số mẫu đi trọn cốt truyện (số liệu engine), cảnh biến thể bổ sung (hành thiếu, nhà riêng, Thái Tuế, việc hợp tay, loại phạm, iOS), kiểm thử chấp nhận từng nhiệm vụ | — |

## 1. Tóm tắt câu chuyện

**Chủ đề một câu:** cùng một lá số, người đọc thiếu một nửa thì thành nô lệ của nó; người đọc đủ thì thành người viết tiếp nó.

Mười sáu chữ khắc trên vành Thiên Mệnh Bàn (Bàn Minh, tập 02 §1.4.3) là xương sống của truyện:

```
天定其框　人書其字　框不可移　字不可代
Thiên định kỳ khuông, nhân thư kỳ tự; khuông bất khả di, tự bất khả đại.
Trời định cái khung, người viết chữ; khung không dời được, chữ không ai viết thay được.
```

- **Định Mệnh Hội** chỉ đọc nửa câu («khung không dời được») rồi bán «lễ đổi mệnh».
- **Khổng tiên sinh** đọc đúng nửa câu ấy một cách thành thật: ông đoán đúng mọi điều, không lấy tiền, và tin mệnh đã định. Ông là gương, không phải kẻ ác.
- **Vân Cốc thiền sư** đọc đủ câu: tám chữ là cái khung; chữ viết trong khung là việc của người.
- **Yểm sư Lỗ Ban (Công Thâu Nghiệt)** là kẻ đã từng tin nửa câu đến tuyệt vọng. Bốn mươi năm trước ông là người thợ mộc giỏi nhất Huyền Thành, từng dựng giá đỡ Bàn Đài. Khổng tiên sinh đoán ông «không thành đại sư». Ông đi mua lễ đổi mệnh ở khắp nơi, bị lừa sạch, rồi kết luận: «cải mệnh là trò lừa; nếu mệnh ta không đổi được, mệnh của ai cũng phải đóng đinh lại». Ông lấy thuật 厭勝 yểm thắng trong *Lỗ Ban Kinh* (`bitruyen-data › SEC_LUBAN`, app ghi «cấm thực hành»), lập Định Mệnh Hội trong Vận 8, và bán «dời họa»: khách trả tiền, một vật yểm (ký hiệu hư cấu) được chôn dưới nhà **người khác**.

Người chơi bước vào Huyền Quán Sơn Môn đúng lúc Bàn đã nứt, Hội đã mọc quầy khắp các vùng. Ba lời phán của Khổng tiên sinh đúng tới từng chữ. Câu hỏi của cả game là câu ông hỏi ngược: **«Vậy ngươi định sống đúng như lời ta sao?»**

## 2. Cấu trúc hồi

| Hồi | Tên | Giờ chơi | Mục tiêu cảm xúc | Câu hỏi của hồi | Kết hồi (cảnh cắt) | Đạo Hạnh tuyến chính (gốc) |
|---|---|---|---|---|---|---|
| Mở đầu | Nhập Môn | 0,5–1 | «Game hiểu mình quá» | Mình là ai trong tám chữ? | Ngã rẽ theo Mệnh Cách (`CUT-006…009`) | 40 |
| I | Bản Mệnh | 6–10 | Hiểu mình qua việc làm | Lá số nói gì, và nó không nói gì? | Lễ nhập sổ (`CUT-014`) | 290 |
| II | Vạn Đạo | 15–20 | Thấy thế giới, thấy kẻ lừa | Ai được quyền đọc mệnh cho người khác? | Bàn nứt lần hai, vòng Biến đứng (`CUT-020`) | 1.070 (gồm 9 án lừa × 50) |
| III | Năm Hạn | 8–12 | Bị thử và giữ được | Khi trời nghịch, giữ cái gì? | Bè từ thượng nguồn (`CUT-026`) | 395–445 |
| IV | Âm Dương | 6–10 | Cứu người, đối diện cái giá | Ai trả giá cho đường tắt của mình? | Đường lên (`CUT-032`) | 640 |
| Vĩ thanh | Côn Lôn Thiên Trì | 3–5 + sự kiện mùa | «Mệnh do ta tạo» | Tám chữ không đổi; người đã khác chưa? | Bàn về hồ (`CUT-035`), Thiên Bảng (`CUT-036`) | 380 |
| Nhánh | BR-TT / DC / NT / DK | 3–5 mỗi nhánh | Câu chuyện riêng theo Mệnh Cách | — | `CUT-041…044` | 180–240 |
| Tà Lộ | TL | 6–9 (tùy chọn) | Cám dỗ, hệ quả, hồi đầu | — | Hồi Đầu (`CUT-040`) | 120 (Hồi Đầu) + phần ×2 của Âm Bài |

Tổng Đạo Hạnh gốc của tuyến chính ≈ **2.865** (chi tiết từng nhiệm vụ: `03-12-phu-luc.md` §C), chưa nhân hệ số Nghịch Thiên (canon §5: `clamp(1 + (60 − Tiềm Lực)/100, 1,0, 1,5)`). Phần còn lại tới cảnh giới 6 (4.500) đến từ chuỗi đạo thống `CQ-*`, việc hằng ngày `DQ-*`, nhiệm vụ phụ `SQ-*` (tập 05, 09).

### 2.1 Cổng cảnh giới của tuyến chính

| Mốc | Điều kiện | Lý do |
|---|---|---|
| Vào Hồi II (`MQ-2-01`) | Cảnh giới ≥ 2 (canon: Tiềm Lực × 0,4 + Đạo Hạnh ≥ 100) | §9.1: bậc 2 mở 3 thánh địa gần |
| `MQ-2-16` Ba nén nhang | đã nhập môn ≥ 3 đạo thống (`CQ-<đạo>-01` xong, TBD-05/09) | Quy tắc đa đạo §5.6 |
| Vào Hồi III (`MQ-3-01`) | `MQ-2-21` xong | — |
| Qua Quỷ Môn Quan (`MQ-4-06`) | Cảnh giới ≥ 4 **và** có Lệnh bài Bắc Đế (`MQ-4-05`) | §9.1 ghi Phong Đô mở ở bậc 5; tuyến chính cho vào sớm hơn **có người dẫn**, khu tu Bắc Đế (`CQ-beidi-*`) vẫn cần bậc 5 — xem Câu hỏi mở |
| Vĩ thanh (`MQ-E-01`) | Quy nhất (≥ 3 đạo thống, Sổ Công Quá dương) **và** cảnh giới ≥ 5 | §3 vĩ thanh + §9.1 |

### 2.2 Phân nhánh theo Mệnh Cách

Cờ `F_BRANCH` đặt ở `MQ-P-08`, theo thứ tự ưu tiên:

| Thứ tự | Điều kiện engine | Nhánh | Lý do thứ tự |
|---|---|---|---|
| 1 | `R.pattern.type === 'special'` (tòng, chuyên vượng, hóa khí) | **DK** Dị Cách | Từ đợt audit 2026-09, `patternQuality` chấm cả cách đặc biệt thành 成/有救/败; giá trị `特殊` chỉ còn cho loại chưa nhận diện. Dị Cách phải xét theo `pattern.type` để không mất nhánh (xem Câu hỏi mở 1) |
| 2 | `R.patternQuality.quality === '特殊'` | DK | phòng loại đặc biệt mới |
| 3 | `quality === '有救'` | **DC** Đắc Cứu | có `rescues[].drug` để làm chuỗi hái thuốc |
| 4 | `quality === '败格'` | **NT** Nghịch Thiên | — |
| 5 | `quality === '成格'` | **TT** Thuận Thiên | — |
| 6 | `quality === '未知'` (cách chưa có luật thành bại) | `synthesis.score ≥ 46` → TT; ngược lại → NT | ngưỡng 46 trùng ngưỡng trang chính đổi persona Nghịch Thiên (§5.2) |

Ngoài nhánh, cờ `F_NGHICH_PERSONA = (synthesis.score < 46)` bật giọng «Nghịch Thiên Cải Mệnh» cho Vân Cốc ở mọi nhánh.

## 3. Bảng nhiệm vụ đầy đủ

Cột «Móc engine» chỉ dẫn những gì có thật trong `src/engine/` hoặc `src/game/`; thứ chưa có ghi «(chưa có)».

### 3.1 Mở đầu «Nhập Môn»

| Mã | Tên | Vùng | NPC | Móc engine |
|---|---|---|---|---|
| MQ-P-01 | Cổng mây | `thanh` (Sơn Môn) | `gac_cong` | `chart › analyze`, `hour-scan › scanHours` (khi không rõ giờ) |
| MQ-P-02 | Lễ lật trụ | `thanh` (Chính Đường) | `thay_tubinh` | `R.chart.pillars`, `wx.pct`, `yong`, `synthesis.score/gradeVi/percentile` |
| MQ-P-03 | Nút «Vì sao?» | `thanh` (Bàn Thầy) | `thay_tubinh` | `synthesis.factors`, `chart-level › classifyChartLevel` |
| MQ-P-04 | Phẩm phục | `thanh` (Tàng Y Các) | `tho_may` | `yong.primary`, `cosmetics.js` |
| MQ-P-05 | Vết rạn trên trời | `thanh` (sân Thiên Bàn) | `thay_tubinh`, `gac_cong` | `models › thienBan` (rings), `anti-manipulation-data › RB2/RB5` |
| MQ-P-06 | Ba lời phán | `thanh` (bậc Sơn Môn) | `khong_tiensinh` | `liunian[isNow]`, `dayun`, `taisui › personalTaSui`, `pattern`, `strength` |
| MQ-P-07 | Chén trà đầu | `thanh` (Trà Thất) | Dì Hạnh (TBD-06) | `personality-profile`, `nayin-personality`, `liudao › computeLiuDao.poisons` |
| MQ-P-08 | Ngã rẽ | `thanh` | theo nhánh | `pattern.type`, `patternQuality.quality`, `synthesis.score` |

### 3.2 Hồi I «Bản Mệnh»

| Mã | Tên | Vùng | NPC | Móc engine |
|---|---|---|---|---|
| MQ-1-01 | Sáng đầu tiên | `thanh` | Thanh Phong (TBD-06) | `state › tasks`, `grantDaily` |
| MQ-1-02 | Bậc thang thứ nhất | `thanh` (Bàn Thầy) | `thay_tubinh`, anh Đạt | `cases › gradePillars`, `gradeWx` |
| MQ-1-03 | Bậc thang thứ hai | `thanh` | `thay_tubinh`, anh Lý Thuận | `cases › gradeStrength`, `gradeYong` |
| MQ-1-04 | Bậc thang thứ ba | `thanh` | `thay_tubinh`, ông Hai Cương | `cases › gradeTiming`, `gradeAdvice`, `decade-forecast › decadeForecast` |
| MQ-1-05 | Hành thiếu | 5 vùng cũ (theo hành) | `thay_tubinh` | `wx.pct`, `yong.primary/ji/chou` |
| MQ-1-06 | Mười năm này | `thanh` (Vận Mệnh Các) | `thay_tubinh` | `vanmenh › vanMenh`, `phase-narrative` |
| MQ-1-07 | Năm tuổi | `thanh` (Thái Tuế Điện) | Thanh Phong | `thaitue › thaiTue`, `state › lightLamp` |
| MQ-1-08 | Ông đồ ở chợ | `thanh` (chợ) | `khong_tiensinh`, chị Mận | `decadeForecast` (lá số chị Mận) |
| MQ-1-09 | Đường lên Hậu Sơn | `vancoc` | Thanh Phong | — |
| MQ-1-10 | Gương Liễu Phàm | `vancoc` | `van_coc` | `remedy-fate › LIAOFAN_STORY`, `REMEDY_QUOTES` |
| MQ-1-11 | Ba việc thiện đầu | `thanh` | `van_coc` | `CONG_QUA`, `meritLedger` |
| MQ-1-12 | Mệnh Đồ | `vancoc` | `van_coc` | `gaimenh › gaimenhPlan(R, {year})` |
| MQ-1-13 | Tờ cáo thị đỏ | `thanh` | chị Mận | (gieo Hồi II) |
| MQ-1-14 | Lễ nhập sổ | `thanh` (Chính Đường) | `thay_tubinh` | Cảnh giới (canon §5) |

### 3.3 Hồi II «Vạn Đạo»

| Mã | Tên | Vùng | NPC | Móc engine |
|---|---|---|---|---|
| MQ-2-01 | Đình Truyền Đạo | `thanh` | 7 sứ giả | `gaimenhPlan.layers`, `daozang-data` (Dụng → đạo thống, chưa có hàm công khai) |
| MQ-2-02 | Quầy đổi mệnh ở chợ | `thanh` | chị Mận, Thiết Khẩu Hà Tam | **DP6**, `personalTaSui`, RB2, RB5 |
| MQ-2-03 | Căn nhà của mình | `thanh` + `phongthuy` | thầy sảnh Dương Trạch | `zhai › computeZhai`, `xuankong › yearFlyingStar`, `fs-cure › findCure` |
| MQ-2-04 | Sao vàng trước cửa | `phongthuy` | Kim Bàn bà Lục | `yearFlyingStar`, GR4, RB5 |
| MQ-2-05 | Đạo hiệu | `vanmieu` | `te_tuu` | `naming › analyzeName`, `yong` |
| MQ-2-06 | Bút gãy | `vanmieu` | Lê Khiêm, Văn Khôi | **DP7**, RB3, `decadeForecast`, `SEC_LUBAN` |
| MQ-2-07 | Ngày của mình | `lichduong` | lịch quan sảnh Trạch Nhật | `zheri › findGoodDates`, `huangdao` |
| MQ-2-08 | Ấn Khâm Thiên giả | `lichduong` | Xích Ngọc | **DP4**, `zheri › evaluateDate`, GR6 |
| MQ-2-09 | An Thái Tuế | `thanh` (Thái Tuế Điện) | `thay_tubinh` | `thaitue`, `TAISUI_REMEDY` |
| MQ-2-10 | Lời kể thành lời đoán | `manh` | bà Lựu, Thần Toán Tử | **DP3**, GR3, `mangpai`, `amta-data › ETHICS` |
| MQ-2-11 | Việc hợp tay | `manh` | trưởng sảnh Tượng Pháp | `five-dim-radar`, `mangpai › analyzeMangpai` |
| MQ-2-12 | Câu hỏi đã cài sẵn | `tubinh` | anh Bảy Sơn, Lục Cách | **DP1**, `synthesis.combos`, GR2 |
| MQ-2-13 | Lò sưởi giữa mùa đông | `cungthong` | bác Thủy, Bạch Thủ | **DP2**, `yong.tiaohou`, `han-nuan › analyzeHanNuan` |
| MQ-2-14 | Bản gốc thất truyền | `thulau` | Tú Nhi, Mặc Khách | **DP5**, `bitruyen-data › LOST_LIXUZHONG`, PR4 |
| MQ-2-15 | Giờ sinh bị đổi | `trichthien` | ông Cả Lộc, Lão Chiêm | **DP8**, `ziwei › computeZiwei`, `hour-scan`, GR5 |
| MQ-2-16 | Ba nén nhang | thánh địa đã chọn | sứ giả | đếm `CQ-*-01` (TBD-05/09) |
| MQ-2-17 | Âm đức | `buttap` | `dieu_am` | `CONG_QUA`, `TEN_THIEN`, RB5 |
| MQ-2-18 | Lời phán bị đánh cắp | `thanh` | `khong_tiensinh` | — |
| MQ-2-19 | Mười sáu chữ | `thulau` + `thanh` | Ông Kha, thủ thư Thư Lâu | Bàn Minh (tập 02 §1.4.3) |
| MQ-2-20 | Văn đấu Chính Đường | `thanh` | Thiết Khẩu Hà Tam, dân chúng | toàn bộ DP đã giải, RB2, RB5 |
| MQ-2-21 | Vòng Biến đứng lại | `thanh` | `thay_tubinh`, `lo_ban_su` (bóng) | `thienBan` rings |
| MQ-2-22 | Đêm trước năm hạn | `vancoc` | `van_coc` | `decadeForecast(R, nowYear + 1, 10).worst`, `GAI_LEVELS` |

### 3.4 Hồi III «Năm Hạn»

| Mã | Tên | Vùng | NPC | Móc engine |
|---|---|---|---|---|
| MQ-3-01 | Chữ năm trên vòng Thời | `thanh` | `thay_tubinh` | `decadeForecast.worst` → `Y*` |
| MQ-3-02 | Gối đá | `vancoc` | `van_coc` | — |
| MQ-3-03 | Mộng: năm Y* | mộng (bản sao Huyền Thành) | — | `liunian-pro › analyzeLiunianDeep(R, Y*)`, `yong.ji` |
| MQ-3-04 | Mộng: căn nhà nghiêng | mộng | — | `yearFlyingStar(Y*)`, cờ nhà riêng |
| MQ-3-05 | Mộng: người gọi sai tên | mộng | — | cờ đạo hiệu (`MQ-2-05`) |
| MQ-3-06 | Mộng: ngày không chọn được | mộng | — | `evaluateDate` trong năm Y* |
| MQ-3-07 | Mộng: bạn cũ quay lưng | mộng | — | `personalTaSui(birthZhi, zhi(Y*))` |
| MQ-3-08 | Mộng: Kỵ thần lâm môn | mộng | — | `yong.ji`, `wx.pct` |
| MQ-3-09 | Tỉnh | `vancoc` | `van_coc` | `GAI_LEVELS`, `GAI_XIN` |
| MQ-3-10 | Nền nhà ông Kha | `thanh` (phố Thợ) | Ông Kha, `maoshan_daonhan` (thư) | lá số ông Kha, `fs-cure`, `amta-analyze` (tự bật) |
| MQ-3-11 | Người thợ không tên | `thanh` (phố Thợ) | `lo_ban_su` | `SEC_LUBAN`, cổng tự nguyện Tà Lộ |
| MQ-3-12 | Tự lực qua hạn | `vancoc` + `thanh` | `van_coc` | `decadeForecast.years`, `golden-year › findGoldenYear` |
| MQ-3-13 | Người đoán và người nghe | `thanh` | `khong_tiensinh` | — |

### 3.5 Hồi IV «Âm Dương»

| Mã | Tên | Vùng | NPC | Móc engine |
|---|---|---|---|---|
| MQ-4-01 | Bè từ thượng nguồn | `thanh` | `vu_y_amau` (thư) | — |
| MQ-4-02 | Cầu phong vũ | `mieucuong` | `vu_y_amau`, A Sính | `tcm › bodyConstitution` (lá số người chơi) |
| MQ-4-03 | Ba câu hỏi trước lá bùa | `mieucuong` | `maoshan_daonhan` | `amta-data › ETHICS`, RB1 |
| MQ-4-04 | Hang dưới trại | `mieucuong` | — | (ký hiệu hư cấu) |
| MQ-4-05 | Lệnh bài Bắc Đế | `longho` hoặc `maoshan` | `truong_thiensu` / `maoshan_daonhan` | `schools-data › beidi, dongyuan` (chỉ đọc) |
| MQ-4-06 | Quỷ Môn Quan | `phongdo` | `diatang_su` | — |
| MQ-4-07 | Hoa bỉ ngạn | `phongdo` | — | phát lại cờ lựa chọn |
| MQ-4-08 | Cầu Nại Hà | `phongdo` | người chơi khác / hồn NPC | MMO (`net.js`, `quan-room.js`) |
| MQ-4-09 | Vọng Hương Đài | `phongdo` | — | — |
| MQ-4-10 | Sổ của bổn quan | `phongdo` | `phan_quan` | `meritLedger`, `YEGUO`, `getYeguoForChart` |
| MQ-4-11 | Người học trò dưới đáy | `phongdo` | Lê Khiêm | `CHAN_HUI`, `CHANHUI_PRINCIPLE` |
| MQ-4-12 | Người đóng đinh | `phongdo` | `lo_ban_su` | — |
| MQ-4-13 | Đường lên | `phongdo` → `thanh` | `diatang_su` | `JING_ZHOU` (Địa Tạng) |

### 3.6 Vĩ thanh «Côn Lôn Thiên Trì»

| Mã | Tên | Vùng | NPC | Móc engine |
|---|---|---|---|---|
| MQ-E-01 | Quy nhất | `thanh` (Đình Truyền Đạo) | `van_coc`, các sứ giả | đếm đạo thống, `meritLedger.net > 0` |
| MQ-E-02 | Hạc về Côn Lôn | `conlon` | — | — |
| MQ-E-03 | Dao Trì soi bóng | `conlon` | — | `R.chart.pillars` (không đổi), Đạo Hạnh |
| MQ-E-04 | Lần đoán cuối | `conlon` | `khong_tiensinh` | khuôn lời phán `MQ-P-06` chạy lại với năm hiện tại |
| MQ-E-05 | Hợp Luân | `conlon` | toàn máy chủ | biến máy chủ `S_CONG_MUA` (chưa có) |
| MQ-E-06 | Thiên Bảng | `conlon` → `thanh` | `thay_tubinh` | Đạo Hạnh |
| MQ-E-07 | Lập Xuân | `thanh` | Lão Tùng | `taisui-general › taiSuiGeneral(năm + 1)` |

### 3.7 Nhánh Mệnh Cách

| Mã | Tên | Vùng | NPC | Móc engine |
|---|---|---|---|---|
| BR-TT-01 | Tổ Sư điểm danh | `thanh` | `thay_tubinh` | `patternQuality.quality = 成格` |
| BR-TT-02 | Người mua lá số | `thanh` | Viên ngoại Đỗ Kỳ | RB3, quyền riêng tư ngày sinh (§14) |
| BR-TT-03 | Cách và vận | `thanh` (Vận Mệnh Các) | `thay_tubinh` | `adjustDayunByGeju` (vận cách-nghịch trong `synthesis.paragraphs`) |
| BR-TT-04 | Tâm ma Mạn | `yentu` | `truclam_thiensu` | `REMEDY_QUOTES` «满招损» |
| BR-TT-05 | Học trò lá số thấp | `thanh` (Trà Thất) | bé Lúa, Dì Hạnh | lá số bé Lúa (điểm 25) |
| BR-TT-06 | Tốt thì giữ | `thanh` | `van_coc` | `gaimenhPlan.layers[5]` |
| BR-TT-07 | Thủ Cách | `thanh` | `thay_tubinh` | — |
| BR-DC-01 | Bệnh ở đâu thuốc ở đó | `thanh` (chợ thuốc, Trà Thất) | `dan_dinh` | `patternQuality.diseases[]`, `rescues[]` |
| BR-DC-02 | Vị Thực Thương | `longho` / `vodang` | `truong_thiensu` / `dan_dinh` | `drug` chứa `shi` |
| BR-DC-03 | Vị Ấn | `vanmieu` / `chungnam` | `te_tuu` / `khau_daotruong` | `drug` chứa `yin` |
| BR-DC-04 | Vị Tài | `thanh` (chợ) + `manh` | trưởng sảnh Tượng Pháp | `drug` chứa `cai` |
| BR-DC-05 | Vị Tỷ Kiếp | `thanh` (Trà Thất) + `yentu` | `truclam_thiensu` | `drug` chứa `ti` |
| BR-DC-06 | Vị Quan Sát | `chungnam` / `maoshan` | `khau_daotruong` | `drug` chứa `guan` |
| BR-DC-07 | Thang thuốc | `vodang` | `dan_dinh` | đủ mọi `drug` của lá số |
| BR-NT-01 | Chưa đủ duyên | `thanh` | `thay_tubinh` | `quality = 败格` |
| BR-NT-02 | Nhà trọ Mái Rêu | `thanh` | bà Năm Rêu | — |
| BR-NT-03 | Đêm gõ cửa | `thanh` | `van_coc` | `synthesis.factors`, `REMEDY_QUOTES[0]` |
| BR-NT-04 | Lập chí | `vanmieu` | `te_tuu` | `BAZI_HUAJIE` «Cách cục bại» |
| BR-NT-05 | Con đường đá | giữa `thanh` và `thulau` | dân phu | `TEN_THIEN` «兴建大利» |
| BR-NT-06 | Người cùng cảnh | `thanh` | anh Đạt | lá số anh Đạt |
| BR-NT-07 | Cổng mở | `thanh` | `thay_tubinh` | — |
| BR-DK-01 | Người lạ trên mái | `thanh` | `phuong_si` | `pattern.type = special`, `pattern.special.kind` |
| BR-DK-02 | Thuận thế | `vancoc` (đỉnh Hậu Sơn) | `phuong_si` | `DAO_JIA` «道法自然», `yong.reasons` |
| BR-DK-03 | Vận phá cách | `thanh` (Vận Mệnh Các) | `phuong_si` | `patternQuality.diseases` (bệnh tiềm ẩn) |
| BR-DK-04 | Kẻ không vừa khuôn | `thanh` | Thanh Phong | — |
| BR-DK-05 | Gió ngược | `trichthien` | `phuong_si` | `liunian`, `dayun` nghịch thế |
| BR-DK-06 | Lá cờ đổi hướng | `thanh` | `phuong_si` | — |
| BR-DK-07 | Dị Nhân | `thanh` | `thay_tubinh`, `phuong_si` | — |

### 3.8 Tà Lộ

| Mã | Tên | Vùng | NPC | Móc engine |
|---|---|---|---|---|
| TL-01 | Tấm bài đen | `thanh` (phố Thợ) | `lo_ban_su` | cổng tự nguyện (`amta-data › ETHICS.optInRequired`) |
| TL-02 | Bảy ngày nhanh | toàn bản đồ | — | Âm Bài: Hậu Thiên ×2; biến `NO_AM` |
| TL-03 | Ấm trà nguội | `thanh` (Trà Thất) | Dì Hạnh | `NO_AM ≥ 60` |
| TL-04 | Khách bỏ về | `thanh` (Bàn Thầy) | khách án | `NO_AM ≥ 120` |
| TL-05 | Cửa Bàn Thầy đóng | `thanh` | `thay_tubinh` | `NO_AM ≥ 180` |
| TL-06 | Lần chôn thứ hai | `thanh` (phố Thợ) | `lo_ban_su`, Ông Kha | lựa chọn dừng / tiếp |
| TL-07 | Bé Lúa không cười | `thanh` | bé Lúa | `NO_AM ≥ 260` |
| TL-08 | Con số trên trán | MMO toàn bản đồ | người chơi khác | hiển thị `NO_AM` công khai |
| TL-09 | Lời của A Mậu | `mieucuong` | `vu_y_amau` | `tcm` |
| TL-10 | Xuống Phong Đô (lối tà) | `phongdo` | `diatang_su` | — |
| TL-11 | Nghiệt kính | `phongdo` | `phan_quan` | `meritLedger`, `YEGUO` |
| TL-12 | Sám hối có việc | `buttap` + `phongdo` + nơi từng hại | `dieu_am`, `phan_quan` | `CHAN_HUI` (5 pháp), `CHANHUI_PRINCIPLE` |
| TL-13 | Hồi Đầu | `thanh` | `thay_tubinh`, `van_coc` | danh hiệu Hồi Đầu |

## 4. Danh sách cảnh cắt (chi tiết ở `03-11-canh-cat.md`)

| Mã | Tên | Nhiệm vụ | Thời lượng | Bỏ qua được? |
|---|---|---|---|---|
| CUT-001 | Trì Thủ Ca ở cổng thành | MQ-P-01 | 0:55 | lần 2 trở đi |
| CUT-002 | Lật trụ | MQ-P-02 | 0:40 + 0:08/trụ | không (dữ liệu riêng) |
| CUT-003 | Mệnh Bàn hiện | MQ-P-02 | 0:25 | có |
| CUT-004 | Vết rạn chữ Ngọ – chữ Tý | MQ-P-05 | 0:35 | có |
| CUT-005 | Ông già ngẩng lên | MQ-P-06 | 0:20 | có |
| CUT-006 | Ngã rẽ · Thuận Thiên | MQ-P-08 | 0:45 | có |
| CUT-007 | Ngã rẽ · Đắc Cứu | MQ-P-08 | 0:45 | có |
| CUT-008 | Ngã rẽ · Nghịch Thiên | MQ-P-08 | 1:05 | có |
| CUT-009 | Ngã rẽ · Dị Cách | MQ-P-08 | 0:45 | có |
| CUT-010 | Bậc đá Hậu Sơn | MQ-1-09 | 0:50 | có |
| CUT-011 | Tranh cuộn Liễu Phàm | MQ-1-10 | 1:40 | có |
| CUT-012 | Mệnh Đồ trải ra | MQ-1-12 | 0:35 | không (dữ liệu riêng) |
| CUT-013 | Tờ cáo thị đỏ | MQ-1-13 | 0:25 | có |
| CUT-014 | Lễ nhập sổ | MQ-1-14 | 0:50 | có |
| CUT-015 | Bảy cổng Đình Truyền Đạo | MQ-2-01 | 0:45 | có |
| CUT-016 | Quầy đỏ đóng cửa | MQ-2-02 | 0:30 | có |
| CUT-017 | Dấu đục trên Bút gãy | MQ-2-06 | 0:25 | có |
| CUT-018 | Ba nén nhang | MQ-2-16 | 0:40 | có |
| CUT-019 | Mười sáu chữ | MQ-2-19 | 0:35 | có |
| CUT-020 | Vòng Biến đứng lại | MQ-2-21 | 1:00 | có |
| CUT-021 | Gối đá | MQ-3-02 | 0:30 | có |
| CUT-022 | Thế giới năm Y* | MQ-3-03 | 0:40 | không (dữ liệu riêng) |
| CUT-023 | Kỵ thần lâm môn | MQ-3-08 | 0:45 (5 biến thể hành) | có |
| CUT-024 | Tỉnh mộng | MQ-3-09 | 0:30 | có |
| CUT-025 | Người thợ không tên | MQ-3-11 | 0:50 | có |
| CUT-026 | Bè từ thượng nguồn | MQ-3-13 | 0:45 | có |
| CUT-027 | Quỷ Môn Quan mở | MQ-4-06 | 0:40 | có |
| CUT-028 | Cầu Nại Hà | MQ-4-08 | 0:35 | có |
| CUT-029 | Vọng Hương Đài | MQ-4-09 | 0:45 (ghép từ cờ) | có |
| CUT-030 | Sổ mở | MQ-4-10 | 0:30 | có |
| CUT-031 | Người đóng đinh | MQ-4-12 | 1:10 | có |
| CUT-032 | Đường lên | MQ-4-13 | 0:50 | có |
| CUT-033 | Hạc về Côn Lôn | MQ-E-02 | 1:00 | có |
| CUT-034 | Dao Trì soi bóng | MQ-E-03 | 0:45 | không (dữ liệu riêng) |
| CUT-035 | Bàn về hồ | MQ-E-05 | 1:30 | có |
| CUT-036 | Thiên Bảng khắc tên | MQ-E-06 | 0:30 | có |
| CUT-037 | Lập Xuân | MQ-E-07 | 0:40 | có |
| CUT-038 | Tấm bài đen | TL-01 | 0:35 | có |
| CUT-039 | Con số trên trán | TL-08 | 0:20 | có |
| CUT-040 | Hồi Đầu | TL-13 | 1:00 | có |
| CUT-041 | Thủ Cách | BR-TT-07 | 0:35 | có |
| CUT-042 | Thang thuốc | BR-DC-07 | 0:40 | có |
| CUT-043 | Cổng mở | BR-NT-07 | 0:50 | có |
| CUT-044 | Dị Nhân | BR-DK-07 | 0:40 | có |
| CUT-045 | Văn đấu: Bàn Minh đọc đủ | MQ-2-20 | 0:40 | có |
| CUT-046 | Khổng tiên sinh gấp sổ | MQ-E-04 | 0:35 | có |
| CUT-047 | Hang dưới trại | MQ-4-04 | 0:35 | có |
| CUT-048 | Đêm gõ cửa | BR-NT-03 | 0:40 | có |

## 5. Sổ cờ cốt truyện (story flags)

Máy nhiệm vụ (deterministic) là nơi duy nhất ghi cờ; AI không đọc cũng không ghi cờ, chỉ nhận chuỗi `gameContext` (§6.1 bản sơ đồ).

| Cờ | Kiểu | Đặt ở | Dùng ở |
|---|---|---|---|
| `F_HOUR_UNSURE` | bool | MQ-P-01 | MQ-P-06 (Khổng nói «giờ ngươi còn chưa chắc»), MQ-2-15 (đồng cảm ông Cả Lộc) |
| `F_LOW_SCORE` | bool (`score < 46`) | MQ-P-02 | câu dẫn bắt buộc §4.7; persona Vân Cốc |
| `F_BRANCH` | TT / DC / NT / DK | MQ-P-08 | mọi nhánh, MQ-1-14, MQ-E-03 |
| `F_KHONG_REPLY` | `phan` / `im` / `nhan` | MQ-P-06 | MQ-1-08, MQ-3-13, MQ-E-04 (Khổng nhắc lại câu trả lời đầu) |
| `F_SO_CONG_QUA` | bool | MQ-1-10 | mọi phần thưởng công |
| `F_MENH_DO` | bool | MQ-1-12 | Hồi II |
| `F_NHA_RIENG` | bool + hướng đã chọn | MQ-2-03 | MQ-3-04 |
| `F_DAO_HIEU` | chuỗi | MQ-2-05 | thoại mọi NPC sau Hồi II; MQ-3-05; Thiên Bảng |
| `F_NGAY_NHAP_DAO` | ngày | MQ-2-07 | MQ-3-06 |
| `F_CASE_DP1…DP8`, `F_CASE_HK` | bool | các án Hồi II | MQ-2-19, MQ-2-20 (đếm bằng chứng) |
| `F_DAOTHONG` | danh sách | `CQ-*-01` | MQ-2-16, MQ-E-01 |
| `F_Y_STAR` | năm | MQ-3-01 | Hồi III, MQ-E-04 |
| `F_MONG_<tầng>` | `giu` / `vo` | MQ-3-04…08 | MQ-3-09 (Vân Cốc nhắc đúng tầng vỡ) |
| `F_TALO_OPTIN` | bool | cài đặt | TL-01 |
| `F_TALO` | `chua` / `dang` / `dung` / `hoi_dau` | TL-01, TL-06, TL-13 | Hồi IV biến thể |
| `NO_AM` | số nguyên ≥ 0, **công khai** | TL-02… | TL-03…13, MQ-4-08 |
| `F_KHIEM` | `cuu` / `chua` | MQ-2-06, MQ-4-11 | MQ-E-06 |
| `F_LOBAN` | `o_lai` / `quay_ve` | MQ-4-12 | MQ-E-05 |
| `F_QUY_NHAT` | bool | MQ-E-01 | MQ-E-* |
| `F_HOP_LUAN_PERSONAL` | bool (đóng góp ≥ 30 công mùa này) | MQ-E-05 | CUT-035 cá nhân |

## 6. Quy tắc chung cho mọi kịch bản

### 6.1 Định dạng

- Đầu nhiệm vụ là **bảng thẻ** (Mã · Tên · Vùng · Điều kiện · Người giao · Mục tiêu · Móc engine · Thưởng · Bỏ dở / thất bại · Cờ đặt).
- Cảnh thoại theo đúng mẫu canon:
  ```
  [CẢNH MQ-1-03.2 · Am Vân Cốc · đêm, giờ Hợi · mưa nhỏ]
  VÂN CỐC: (rót trà) Con ngồi đi.
  > Lựa chọn: ① «…» → [MQ-1-03.3a]  ② «…» → [MQ-1-03.3b]
  ```
- `{ten}` = tên người chơi; `{daohieu}` = đạo hiệu (sau MQ-2-05; trước đó NPC dùng `{ten}`); `{…}` khác là **trường engine**, ghi rõ nguồn ở bảng thẻ.
- Lựa chọn có nhãn giọng: `[Thẳng]`, `[Mềm]`, `[Hỏi]`, `[Im]`. Nhãn giọng mặc định theo `personality-profile` của người chơi được **đánh dấu sao** (gợi ý, không ép).

### 6.2 Giọng NPC (bám §6.2 bản sơ đồ)

| NPC | Xưng hô | Luôn | Không bao giờ |
|---|---|---|---|
| Thầy Tử Bình | thầy – con | chậm, ấm, dẫn chỉ số có tên | phán chết, phán bệnh |
| Khổng tiên sinh | ta – ngươi | chắc nịch, lạnh, **chỉ nói dữ kiện engine**, kết bằng câu hỏi ngược | khuyên cải mệnh; nhận tiền; nói «mệnh đã định» như sự thật **của game** (ông nói «ta tin», game phản bác bằng hành động) |
| Vân Cốc | lão tăng – con | kể chuyện, hỏi ngược | bán nghi lễ, hứa đổi mệnh chắc chắn |
| Lỗ Ban (yểm sư) | ta – cậu / cô | mềm, ví von nghề mộc, luôn «mặc cả», nói thật giá phải trả nhưng đổ cho người khác | đe dọa, mô tả cách làm yểm |
| Phán quan | bổn quan – ngươi | trang nghiêm, đọc đúng sổ | dọa địa ngục |
| Vu y bà A Mậu | bà – cháu, thổ âm | chuyện xưa, thảo dược theo ngũ hành | công thức thuốc thật, chẩn bệnh |
| Mao Sơn đạo nhân | tôi – anh / chị | hỏi ngủ, ăn, áp lực trước | nói «bị ma», chẩn bệnh |

### 6.3 An toàn (bắt buộc, kiểm ở bước duyệt kịch bản)

1. **RB2.** Không câu nào của game (hệ thống, NPC chính đạo, văn bản nhiệm vụ) khẳng định «mệnh đã định». Câu đó chỉ xuất hiện trong miệng Khổng tiên sinh (niềm tin cá nhân) và Định Mệnh Hội (văn bản gắn nhãn lừa đảo), và luôn được phản bác trong cùng nhiệm vụ.
2. **RB5.** Không NPC nào bán cải mệnh. Mọi «lễ có giá» trong game đều là của Định Mệnh Hội và bị vạch trần.
3. **RB1.** Không lời phán nào nói bệnh, chết, tai nạn cụ thể. Khuôn lời phán `MQ-P-06` loại các trường sức khỏe.
4. **RB3.** Mọi lá số NPC trong truyện là nhân vật hư cấu, tự đưa ngày sinh cho người chơi trong thoại (đồng thuận trong truyện). Không có nhiệm vụ «xem mệnh người vắng mặt để tác động họ»; trường hợp DP7 ở `MQ-2-06` là án **ngăn** việc đó.
5. **Tà Lộ:** không nguyên liệu, không câu chú, không cách làm của yểm thuật / cổ thuật thật; vật phẩm là **ký hiệu hư cấu**: chữ **Huyền Văn** của game (bảng chữ tạo hình riêng do tập 12 vẽ, không mượn phù thật). Người Miêu là **nạn nhân và người chữa**; kẻ ác là yểm sư người ngoài. Chỉ mở sau xác nhận tự nguyện.
6. **Khủng hoảng thật:** người chơi gõ nội dung tự hại / bệnh nặng trong thoại tự do thì NPC rời vai (§6.4 bản sơ đồ, quy tắc 3); kịch bản không bao giờ dùng tự hại làm tình tiết.
7. **Kiểm tên nhiệm vụ trong câu AI:** chỉ được nhắc mã / tên có trong bảng §3 (quy tắc 4 của §6.4).

### 6.4 Biến thể nền tảng

| Trường hợp | Áp dụng |
|---|---|
| **AI tắt / lỗi mạng** | Mọi cảnh trong tài liệu này là **thoại kịch bản đầy đủ**; AI chỉ dùng ở các «ô hỏi tự do» (ghi `⟨AI tự do: persona …⟩`). Ô hỏi tự do khi AI tắt dùng `composeAnswer` (trả lời cục bộ của app). |
| **iOS** (`features.js`: tắt xăm, sen, quẻ, Vận Mệnh Các, Thái Tuế Điện, Thầy AI) | Không đoán vận. Các nhiệm vụ đoán vận đổi sang biến thể tu tâm, ghi ở cột «iOS» trong bảng thẻ: `MQ-P-06` chỉ giữ lời phán 1 (tính khí từ `personality-profile`), `MQ-1-06/07` thay bằng «Bia tổ sư» và «Đèn cầu an chung», Hồi III dùng **năm khó tự khai** thay `Y*` (người chơi chọn một năm khó đã qua của chính mình để mộng lại, không dự báo). |
| **Không rõ giờ sinh** (`F_HOUR_UNSURE`) | Lời phán và án không dùng trụ giờ; Khổng tiên sinh nói thẳng «ba trụ, ta chỉ đọc ba trụ». |

### 6.5 Thang thưởng

| Hạng | Dùng cho | Đạo Hạnh (gốc) | Phúc Khí |
|---|---|---|---|
| S | cảnh dẫn, nhiệm vụ đi lại | 5–15 | 10–20 |
| M | nhiệm vụ chuẩn | 20–45 | 20–40 |
| L | án lừa, mốc tầng Mệnh Đồ | 45–70 | 40–60 |
| XL | kết hồi, kết nhánh | 80–150 | 60–120 |

- Đạo Hạnh nhận thực = gốc × hệ số Nghịch Thiên (× 2 nếu đang giữ Âm Bài, xem `03-10-ta-lo.md`).
- **Phúc Khí** dùng thang hiện có (`state.js › REWARD`: lá số 10, nhiệm vụ ngày 5). Không nhiệm vụ cốt truyện nào thưởng **Ngọc** (§11: tiền nạp không dính cốt truyện).

### 6.6 Tham chiếu công đức (DEED)

Mã `DEED-*` thuộc tập 05. Tập 03 dùng **mã tạm theo đúng thứ tự `remedy-fate › CONG_QUA`** để tập 05 đổi tên hàng loạt nếu khác:

| Mã tạm (TBD-05) | `CONG_QUA` | Điểm engine |
|---|---|---|
| DEED-T01 | thien[0] Phóng sinh (cứu mạng) | +3 |
| DEED-T02 | thien[1] Cứu người nguy cấp | +3 |
| DEED-T03 | thien[2] Giúp người khó khăn | +2 |
| DEED-T04 | thien[3] Bố thí tiền / của | +2 |
| DEED-T05 | thien[4] Hiếu thuận cha mẹ | +2 |
| DEED-T06 | thien[5] Làm thiện ẩn (âm chất) | +2 |
| DEED-T07 | thien[6] Ăn chay 1 ngày | +1 |
| DEED-T08 | thien[7] Giữ lời, không dối | +1 |
| DEED-T09 | thien[8] Khuyên người làm thiện | +1 |
| DEED-T10 | thien[9] Đọc / sao kinh, trì chú | +1 |
| DEED-A02 | ac[1] Trộm cắp / lấy không nên lấy | −3 |
| DEED-A03 | ac[2] Dối trá / lừa gạt | −2 |
| DEED-A06 | ac[5] Nói lời tổn thương | −1 |
| DEED-A08 | ac[7] Giận dữ mất kiểm soát | −1 |
| DEED-A09 | ac[8] Đố kỵ / tham | −1 |

- Điểm công đức ghi **đúng điểm engine** (vd phóng sinh +3 theo `CONG_QUA`, không phải +1 như bảng §5.3 bản sơ đồ; xem Câu hỏi mở 3).
- Việc ác chỉ ghi khi **người chơi chọn** (§5.3). Việc «chôn vật yểm dưới nhà người khác» (Tà Lộ) ghi DEED-A02 (lấy vận người) **và** sinh Nợ Âm; tập 05 có thể tách thành `KARMA-*` riêng.

## 7. Nhân vật phụ do tập 03 đề xuất (TBD-06 cấp mã `NPC-*`)

Ngày sinh ghi đủ để ai cũng chạy lại `analyze(…, 2026)`. Số liệu trong cột cuối là kết quả engine thật.

| Tên | Vai | Ở | Ngày giờ sinh | Engine (2026) |
|---|---|---|---|---|
| Thanh Phong | tiểu đồng Sơn Môn, bạn đồng hành Hồi I | Bàn Thầy | — | — |
| Dì Hạnh | chủ Trà Thất, bà của bé Lúa | Trà Thất | — | — |
| bé Lúa | cháu Dì Hạnh, 11 tuổi | Trà Thất | 2015-09-01 08:00 nữ | 乙未 甲申 庚辰 庚辰 · điểm 25 HẠ ĐẲNG · Thân vượng · Dụng Hỏa |
| chị Mận | bán cá chợ Huyền Thành | chợ | 1992-08-02 10:00 nữ | 壬申 丁未 庚戌 辛巳 · điểm 41 · tuổi Thân **không phạm** Thái Tuế 2026 · 2026 Cát 65 · 2027 Đại cát 77 (cờ Hôn) |
| Ông Kha | thợ mộc già, học trò cũ của Lỗ Ban | phố Thợ | 1958-11-03 05:00 nam | 戊戌 壬戌 甲申 丁卯 · điểm 57 · 2026 Cát 66 · 2027 Hung 10 |
| Lê Khiêm | thư sinh Văn Miếu | Văn Miếu | 2003-10-08 09:00 nam | 癸未 辛酉 甲寅 己巳 · điểm 58 · có Văn Xương · 2027 Hơi kỵ 25 · 2028 Cát 64 |
| Phạm Nhuận | bạn đồng song của Lê Khiêm | Văn Miếu | — | — |
| bà Lựu | quả phụ, Manh Phái Cốc | `manh` | 1968-04-12 18:00 nữ | 戊申 丙辰 壬子 己酉 · điểm 66 · 2026 Đại hung 6 |
| anh Bảy Sơn | thợ cả bị mất việc | `tubinh` | 1975-06-09 15:00 nam | 乙卯 壬午 丙戌 丙申 · **không có** Thương Quan thấu can, không có tổ hợp «Thương Quan Kiến Quan» |
| bác Thủy | ngư phủ Cùng Thông Hồ | `cungthong` | 1975-01-21 09:00 nam | 甲寅 丁丑 丁卯 乙巳 · Thân quá vượng · `han-nuan`: NOÃN/NHIỆT, cần Thủy · Dụng Kim |
| Tú Nhi | cô học trò mê sách cổ | `thulau` | — | — |
| ông Cả Lộc | chủ ruộng, Trích Thiên Đỉnh | `trichthien` | 1962-09-10 06:30 nam | Tử Vi: giờ 06:30 → Mệnh cung 午, Thiên Cơ; giờ 12:00 → Mệnh cung 卯, Cự Môn + Thiên Cơ, Mệnh Thân đồng cung |
| anh Đạt | phu khuân vác (án 1) | chợ | 1988-03-08 06:00 nam | 戊辰 乙卯 壬戌 癸卯 · Mộc 46,1% · Hỏa 1,2% · Tòng Nhi |
| anh Lý Thuận | thợ rèn trẻ (án 2) | phố Thợ | 1984-03-16 13:00 nam | 甲子 丁卯 己酉 辛未 · Thân quá nhược · Dụng Hỏa · Hỷ Mộc · Kỵ Thủy |
| ông Hai Cương | chủ lò rèn (án 3) | phố Thợ | 1966-03-06 07:00 nam | 丙午 庚寅 甲子 戊辰 · Thân nhược · Dụng Thủy · năm tốt nhất 2026–2031 là 2031 Đại cát 88 |
| A Sính | cháu gái A Mậu, học vu y | `mieucuong` | 2006-07-19 07:00 nữ | 丙戌 乙未 己酉 戊辰 · 2027 Đại hung 2 |
| bà Năm Rêu | chủ nhà trọ Mái Rêu | Huyền Thành | — | — |
| Viên ngoại Đỗ Kỳ | phú hộ muốn mua lá số | Huyền Thành | — | — |
| Định Mệnh Hội | Thiết Khẩu Hà Tam (chợ), Kim Bàn bà Lục (`phongthuy`), Văn Khôi Quách Tú (`vanmieu`), Xích Ngọc (`lichduong`), Thần Toán Tử (`manh`), Lục Cách (`tubinh`), Bạch Thủ (`cungthong`), Mặc Khách (`thulau`), Lão Chiêm (`trichthien`), người của Hồng Liên (`buttap`) | quầy đỏ | — | — |

## 8. Mã định danh mới của tập 03

| Loại | Dải | Số lượng |
|---|---|---|
| `MQ-P` | 01–08 | 8 |
| `MQ-1` | 01–14 | 14 |
| `MQ-2` | 01–22 | 22 |
| `MQ-3` | 01–13 | 13 |
| `MQ-4` | 01–13 | 13 |
| `MQ-E` | 01–07 | 7 |
| `BR-TT`, `BR-DC`, `BR-NT`, `BR-DK` | 01–07 mỗi nhánh | 28 |
| `TL` | 01–13 | 13 |
| `CUT` | 001–048 | 48 |

**Đề xuất cho tập khác** (không tự cấp): `NPC-*` cho 19 nhân vật ở §7 (TBD-06); `DEED-T01…T10`, `DEED-A02/03/06/08/09` (TBD-05); biến máy chủ `S_CONG_MUA` và cờ cốt truyện (TBD-13, `SCHEMA-*`); bảng chữ Huyền Văn, nhạc từng cảnh cắt (TBD-12, `BGM-*`); điểm «phố Thợ», «nhà trọ Mái Rêu», «Đình Truyền Đạo» (TBD-07, `POI-thanh-*`).

## 9. Câu hỏi mở (cần chủ dự án / tập khác quyết)

1. **Dị Cách.** Canon §5 ghi Dị Cách = `quality === '特殊'`, nhưng engine sau audit 2026-09 chấm cách đặc biệt thành 成/有救/败; `特殊` gần như không còn xuất hiện. Tập 03 dùng `pattern.type === 'special'` làm điều kiện ưu tiên. Cần canon xác nhận.
2. **`gaimenhPlan` lấy năm sai.** Khi không truyền `opts.year`, hàm dùng `R.liunian[0].year` (năm đầu thập kỷ đại vận, vd 2017 với MAU-A, thuộc **Vận 8**) để dựng vận bàn `xuankongPan`, nên tầng Không gian ra «đương lệnh Bát Bạch, Ngũ Hoàng Tây Nam» thay vì Vận 9 hiện hành («đương lệnh Cửu Tử, Ngũ Hoàng Chính Bắc»). Tập 03 luôn gọi `gaimenhPlan(R, { year: nowYear })`; nên sửa mặc định trong engine. Lưu ý thêm: vận bàn (`xuankongPan`, 20 năm) khác niên bàn (`yearFlyingStar`, 1 năm; 2026 Ngũ Hoàng ở **Chính Nam**); kịch bản ghi rõ đang dùng bàn nào.
3. **Điểm công đức.** Bảng §5.3 bản sơ đồ (phóng sinh +1, khuyên thiện +2) lệch `CONG_QUA` (phóng sinh +3, khuyên thiện +1). Tập 03 theo engine.
4. **Cổng Phong Đô.** §9.1 ghi bậc 5; tuyến chính cho vào ở bậc 4 có Lệnh bài. Cần tập 09 đồng ý.
5. **Tạng Địa** không có nhiệm vụ chính nào bắt buộc (chờ tham vấn, §14); sứ giả Tạng Địa ở Đình Truyền Đạo đứng sau cổng khép.
6. **MAU-A sinh tháng Tỵ**, không phải tháng Ngọ như canon §11 (engine: 庚午 **辛巳** 庚辰 庚辰). Tập 03 viết theo engine.
7. **Năm lá số mẫu đều Dụng Thủy / Kỵ Thổ** — đề nghị tập 04 chọn `MAU-C…` có Kỵ khác Thổ để mọi biến thể Kỵ thần ở MQ-3-08 có lá số mẫu chính thức (hiện kiểm bằng lá số NPC).
8. Câu hỏi mở bổ sung: `03-12-phu-luc.md` §J.

## 10. Bản đồ phụ thuộc toàn truyện

```
MQ-P-01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 ──┬── BR-TT-01 → 02 ─┐
                                              ├── BR-DC-01 ───────┤
                                              ├── BR-NT-01 → 02 → 03
                                              └── BR-DK-01 → 02 ──┤
MQ-1-01 ─┬→ 02 → 03 → 04 ─┐                                       │
         └→ 05 → 06 → 07 ─┴→ 08 → 09 → 10 → 11 → 12 → 13 → 14 ◀──┘ (cần BR-<nhánh>-02 / NT-03)
                                                              │
MQ-2-01 ◀────────────────────────────────────────────────────┘
  ├─ tầng Mệnh Đồ: 03 · 05 · 07 · 09 · 11 · 17 (tự do)
  ├─ án lừa: 02 · 04 · 06 · 08 · 10 · 12 · 13 · 14 · 15 (mở khi tới vùng)
  ├─ 16 Ba nén nhang (3 × CQ-*-01)
  └─ [≥ 5 án & 16 & ≥ 4 tầng] → 18 → 19 → 20 → 21 → 22
        nhánh song song: BR-TT-03…05 · BR-DC-02…06 · BR-NT-04…07 · BR-DK-03…05
MQ-3-01 → 02 → [mộng 03 → 04 → 05 → 06 → 07 → 08] → 09 → 10 → 11 ─┬─ từ chối → 12 ─┐
                                                                   └─ nhận → TL-01 → 02 ┴→ 13
        nhánh: BR-TT-06 · BR-DK-06 (sau MQ-3-09)
        Tà Lộ: TL-03…08 theo ngưỡng Nợ Âm; TL-06 ngày 7; đặt bài bất kỳ lúc nào → TL-11
MQ-4-01 → 02 (TL-09 nếu cầm bài) → 03 → 04 → 05 → 06 ─┬─ chính lộ → 07 → 08 (Thiện) ─┐
                                                      └─ Tà Lộ → TL-10 (Ác / Bình) ─┤
                                              09 → 10 (TL-11) → 11 → 12 (TL-12 hợp) → 13
        trước Vĩ thanh: BR-TT-07 · BR-DC-07 · BR-DK-07 · TL-13 (nếu Tà Lộ)
MQ-E-01 [Quy nhất + cảnh giới 5] → 02 → 03 → 04 → 05 (mùa) → 06 → 07 (mỗi Lập Xuân)
```

## 11. Chỉ mục nhiệm vụ theo vùng (cho tập 07 — thánh địa, tập 08 — công trình)

| Vùng | Nhiệm vụ diễn ra (toàn phần hoặc một chặng) | Công trình / điểm cần có nội thất dùng được |
|---|---|---|
| `thanh` | MQ-P-01…08; MQ-1-01…04, 06…08, 11, 13, 14; MQ-2-01, 02, 03, 09, 18, 19, 20, 21; MQ-3-01, 10, 11, 12, 13; MQ-4-01, 13; MQ-E-01, 06, 07; BR-TT-01…03, 05, 06, 07; BR-DC-01, 04; BR-NT-01…03, 05, 06, 07; BR-DK-01, 03, 04, 06, 07; TL-01…08, 13 | Chính Đường, Bàn Thầy, Tổ Sư Đường, Trà Thất (bếp sau có rãnh nước đào được), Tàng Y Các, Vận Mệnh Các (9 cổng, hộp gỗ thư), Thái Tuế Điện (bảng đồng 12 tuổi, bàn đèn), sân Thiên Bàn + giá đỡ Bàn Đài (4 tầng sàn, mộng gỡ được), bia tám chữ, Lầu chuông, chợ (cổng Tây — quầy đỏ; cổng Đông — sạp cá; chợ thuốc), phố Thợ (xưởng Ông Kha, lò rèn), phố Bàn Đài (3 gian nhà riêng, dinh Đỗ Kỳ), nhà trọ Mái Rêu, Đình Truyền Đạo (8 cổng, bàn đá, lư hương), Hậu Môn, bến sông, đồi gió, ngõ Mực (nhà Khổng tiên sinh) |
| `vancoc` | MQ-1-09, 10, 12; MQ-2-22; MQ-3-02, 09, 12; BR-DK-02 | am tranh (bếp than, kệ sách), hốc đá sau am (gối đá), mỏm đá trước am (phiến đá vẽ Mệnh Đồ), đường đá 3 chặng, đỉnh Hậu Sơn (khe suối) |
| `phongthuy` | MQ-1-05 (Thổ); MQ-2-03, 04 | sảnh Dương Trạch, sân la bàn đá xoay được, ngõ Đậu (nhà Tư Đậu) |
| `lichduong` | MQ-2-07, 08 | sân khuê biểu (bóng đo được), sảnh Trạch Nhật (bảng 12 Trực), chợ phiên |
| `manh` | MQ-1-05 (Kim); MQ-2-10, 11; BR-DC-04 | đường đá dẫn thầy mù, sảnh Tượng Pháp (quân gỗ khắc nổi), đường vào cốc |
| `tubinh` | MQ-2-12 | sảnh Cách Cục, quầy sát cửa |
| `cungthong` | MQ-1-05 (Thủy); MQ-2-13 | mạch đầu nguồn, bến cá, thuyền nan, sảnh Điều Hậu |
| `thulau` | MQ-1-05 (Mộc); MQ-2-14, 19 | hàng đào trước cổng, hành lang sách cũ, kho Thư Lâu (kệ theo Hoa Giáp, kệ Bí truyền) |
| `trichthien` | MQ-1-05 (Hỏa); MQ-2-15; BR-DK-05 | Đẩu Mẫu Điện (7 đèn), sảnh Tử Vi, đường đuốc |
| `vanmieu` | MQ-2-05, 06; BR-DC-03; BR-NT-04 | Khuê Văn Các, bàn đặt tên, sân bia Tiến sĩ (bia trống), Quốc Tử Giám (phòng học), Đại bái đường, Đại Thành điện, quầy sau tường |
| `buttap` | MQ-2-17; TL-11, 12 | hồ sen, cầu đá, cửa kênh hạ lưu, đập nước đầu làng, trai đường (mái hiên vá được), tiền đường (lạy theo nhịp), tòa Cửu phẩm liên hoa (quay được) |
| `yentu` | BR-TT-04; BR-DC-05 | suối Giải Oan, gốc tùng ven đường, chùa Hoa Yên (sân, bồ đoàn), Chùa Đồng |
| `chungnam` | BR-DC-03, 06 | Tam Thanh các (tàng kinh), Lão Luật đường |
| `longho` | BR-DC-02; MQ-4-05 | tĩnh thất kết phù (bàn phù), đại đường, tàng thư |
| `vodang` | BR-DC-07 | lò đan Thái Hòa cung |
| `maoshan` | MQ-4-05 | Cửu Tiêu Vạn Phúc Cung (phòng ngủ cho khách) |
| `mieucuong` | MQ-4-02, 03, 04; TL-09 | cầu phong vũ (băng ghế), nhà sàn A Mậu (bếp lửa, gác thuốc), nhà nhuộm đầu nguồn, suối trên trại, hang sau thác (cửa mộng ba tầng, xưởng) |
| `phongdo` | MQ-4-06…13; TL-10, 11 | Quỷ Môn Quan, đường Hoàng Tuyền (hai nhánh), quán canh, cầu Nại Hà (3 cầu + 9 trụ đèn), Vọng Hương Đài, Điện Sổ (Nghiệt kính), gian chờ điện 9, Điện Chuyển Luân (Sổ Lớn), Điện Địa Tạng, cầu thang lên |
| `conlon` | MQ-E-02…05 | Thiên Bàn Đảo (bệ trống), 3 cầu mây có bia, Dao Trì (mép hồ, bia), đình đá |
| mộng (phòng ngoài bản đồ) | MQ-3-03…08 | bản sao Huyền Thành năm `Y*` (ám màu), 5 cảnh biến cố Kỵ thần |

## 12. Chỉ mục nhân vật × nhiệm vụ

| Nhân vật | Xuất hiện |
|---|---|
| Thầy Tử Bình | MQ-P-02, 03, 05, 08; MQ-1-02…06, 14; MQ-2-09, 20, 21; MQ-3-01; MQ-4-13; MQ-E-05, 06; BR-TT-01, 02, 03, 06, 07; BR-NT-01, 07; BR-DK-01, 07; TL-05, 13 |
| Khổng tiên sinh | MQ-P-06; MQ-1-08; MQ-2-18, 20; MQ-3-13; MQ-E-04, 07 |
| Vân Cốc | MQ-1-10, 11, 12; MQ-2-22; MQ-3-02, 09, 12; MQ-E-01, 03, 04, 05; BR-NT-03; BR-TT-06; TL-13 |
| Lão Tùng | MQ-P-01, 05; MQ-2-02, 21; MQ-4-13; MQ-E-07 |
| Thanh Phong | MQ-P-07; MQ-1-01, 07, 09; mộng MQ-3-03…08; MQ-E-07; BR-DK-04, 07 |
| Dì Hạnh, bé Lúa | MQ-P-07; MQ-3-01, 12; MQ-E-07; BR-TT-05; TL-02, 03, 07, 12, 13 |
| Công Thâu Nghiệt | (bóng) MQ-2-21; MQ-3-11; MQ-4-12, 13; TL-01, 06 |
| Ông Kha | MQ-1-04; MQ-2-19; MQ-3-10; MQ-4-01, 13; BR-NT-06; TL-06, 12 |
| chị Mận | MQ-1-08, 13; MQ-2-02, 20; TL-08; BR-DC-04 |
| Lê Khiêm, Phạm Nhuận | MQ-2-05 (thoáng), 06; MQ-4-11, 12, 13; MQ-E-06 |
| A Mậu, A Sính, A Tỏa | MQ-3-13 (thư); MQ-4-01…04; TL-09 |
| Kỳ Thanh / Mao Tiểu Tùng | MQ-2-01; MQ-3-10 (thư); MQ-4-03, 05 |
| Phán quan Thôi | MQ-4-10, 12; TL-11, 12 |
| Địa Tạng sứ giả | MQ-4-06, 08, 12, 13; TL-10 |
| Cát Huyền | MQ-P-08 (DC); BR-DC-01, 07 |
| Phương sĩ Vô Danh | MQ-P-08 (DK); BR-DK-01…06 |
| Hứa Khang | BR-TT-01, 06; BR-NT-01, 07; BR-DC-05; TL-04, 13 |
| Định Mệnh Hội | MQ-1-13; MQ-2-02, 04, 06, 08, 10, 12, 13, 14, 15, 17, 20 |
