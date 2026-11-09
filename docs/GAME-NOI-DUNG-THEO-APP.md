# HUYỀN QUÁN — Nội dung game lấy từ app gốc

> Nguyên tắc (yêu cầu chủ dự án, 2026-11-03): **game làm từ những gì app battu đang tính được**, không bắt chước game khác.
> Mỗi hoạt động trong game = một engine thật trong `src/engine/` + đáp án do engine chấm. Không thêm cơ chế «tu tiên» (ngự kiếm, cảnh giới, đột phá, pháp bảo).

## 1. Hiện trạng (rà 2026-11-03)

- App có ~250 module engine (`src/engine/`), trang web có ~180 mục luận giải (Tứ trụ, Lưu niên/nguyệt/nhật, Trạch nhật, Huyền Không, Bát trạch, Hợp hôn, Đặt tên, Tử Vi, Mai Hoa, Kỳ Môn, Giải mộng, Thư viện huyền học, Án cổ…).
- Game đang dùng **8 module**: `chart`, `daily`, `daily-guide`, `zhai`, `qiuqian`, `kb`, `classical-cases`, `constants`.
- Thế giới 3D đã có 8 vùng nhưng **vùng chưa có nội dung riêng**: chỉ có cảnh.
- *Rà lại 2026-11-05 (đợt P0 — theo `docs/GAME-THIET-KE-CHOT.md`):* game đã dùng thêm `classical-runner` + `anti-manipulation-data` (tab Án cổ — `gu-gongan.js`), `liunian-pro` + `dayun-god` + `remedy-fate` (tab Năm hạn — `namhan.js`; bước «Năm nay» — `npc-deep.js`), `daozang-data` (tab Chọn kinh — `kinh-tu.js`).

## 2. Bản đồ: vùng → sảnh nghề → engine

Mỗi vùng là một **sảnh nghề**: có bàn thầy (học), khách NPC mỗi ngày (luyện, có chấm điểm), và việc chung nhiều người (MMO).

| Vùng | Sảnh nghề | Engine app | Hoạt động trong game | iOS |
|---|---|---|---|---|
| Huyền Thành (quán) | Tứ Trụ nhập môn | `chart`, `kb`, `zhai`, `daily-guide` | **đã có**: lập trụ, 6 bước giải án, lịch ngày, la bàn | ✓ |
| Lịch Đường | **Trạch Nhật** | `zheri`, `wedding-date`, `huangdao`, `xiongri` | khách cần ngày cưới / khai trương / dọn nhà / động thổ / ký kết / xuất hành → lọc ngày xung tuổi → nhận trực Hoàng/Hắc đạo → chọn ngày | ✓ (học lịch pháp) |
| Phong Thủy Viên | **Dương Trạch** | `fengshui-compass`, `zhai`, `xuankong`, `space-fs` | khách đưa hướng nhà + năm sinh → toạ/hướng 24 sơn → Đông/Tây tứ trạch → phi tinh năm → chọn phòng ngủ/bàn làm việc | ✓ |
| Cùng Thông Hồ | **Điều Hậu** | `han-nuan`, `QIONGTONG_TIAOHOU` | lá số mùa lạnh/nóng → hàn/noãn/táo/thấp → chọn dụng thần điều hậu theo «Cùng Thông Bảo Giám» | ✓ |
| Tử Bình Phong | **Cách Cục** | `pattern`, `pattern-quality`, `CLASSICAL_CASES` | án cổ nâng cao: định cách, thành/bại/cứu ứng | ✓ |
| Thư Lâu Lâm | **Thư Viện** | `library-data` (LAYERS, LIBRARY), `DITIANSUI_MAXIMS` | đọc tầng thư → câu hỏi đối chiếu nguyên văn ↔ nghĩa → mở tầng tiếp | ✓ |
| Trích Thiên Đỉnh | **Tử Vi** | `ziwei`, `ziwei-stars`, `ziwei-sanfang` | an mệnh cung, đặt 14 chính tinh, đọc tam phương tứ chính | ✓ |
| Manh Phái Cốc | **Tượng Pháp** | `mangpai`, `mangpai-view` | đọc tượng (tân, chủ, làm công) theo Manh phái | ✓ |
| Thành — quán trà | **Hợp Hôn / Đối Chiếu** (MMO) | `hehun`, `partner-match`, `nayin-relation` | 2 người chơi ngồi cùng bàn → so lá số (của NPC hoặc hư cấu) → cùng giải | ✓ |
| Sơn Môn — điện phụ Tây | **Vận Mệnh Các** | `life-trajectory`, `dayun-changsheng`, `phase-narrative` | hành lang 9 cổng = 9 đại vận của **chính người chơi**: biển cổng khắc can chi + tuổi, cổng đang đi sáng nhất, đèn vàng = đỉnh vận, đèn lam = cần dè chừng; bia ở lối vào (nền mệnh, mốc đời, giai đoạn đang đi); mỗi cổng: thập thần can/chi, chủ đề thập kỷ, trường sinh, cách cục cứu/hại | ✗ |
| Sơn Môn — điện phụ Đông | **Thái Tuế Điện** | `taisui-general` (60 vị đại tướng quân), `taisui` | vách 60 bài vị, vị trị niên dát vàng + bài vị lớn trên bàn thờ; tuổi người chơi phạm gì (trị/xung/hình/phá/hại), phương Thái Tuế, bảng 12 con giáp, tập tục dân gian; **đèn an Thái Tuế**: thắp lần đầu +10, mỗi ngày thêm dầu +3, sáng thêm một ngọn | ✗ |
| (web) | Giải mộng, xin xăm, Mai Hoa | `jiemeng`, `qiuqian`, `meihua` | giữ bản web; **tắt trên iOS** (4.3b) | ✗ |

## 3. Vòng chơi một ngày

1. Vào quán: lịch hôm nay (đã có), 3 khách Tứ Trụ (đã có).
2. Mỗi sảnh nghề: **1 khách/ngày**, sinh từ hạt giống (ngày + người chơi) → ai cũng có khách riêng nhưng cùng loại để bàn luận.
3. Điểm Phúc Khí theo độ chính xác; **thông thạo** từng nghề (Tứ Trụ, Trạch Nhật, Dương Trạch…) = tổng điểm 30 án gần nhất → danh hiệu theo nghề (thay cho «cảnh giới tu luyện»). Từ 2026-11-05: thưởng án mỗi ngày kẹp trần **60 điểm** gộp mọi loại án (`CASE_GAIN_CAP`, `state.js › recordCase` — chống farm điểm client tự tính).
4. MMO: bảng thông thạo theo nghề, bàn đối chiếu 2 người, giải án chung (co-op P3).

## 4. Đi lại

- Thế giới lớn giữ nguyên làm khung cảnh; **không** thêm ngự kiếm. Đi giữa vùng bằng **đường đá + trạm xe ngựa / đò** (dịch chuyển nhanh có hoạt cảnh), mở khi đã ghé vùng một lần.
- Sảnh nghề còn mở được từ quán qua «Các gian» khi đã ghé (điện thoại không phải đi bộ 800 m mỗi lần).

## 5. Thứ tự làm

1. ~~Trạch Nhật~~ — xong 2026-11-03.
2. ~~Dương Trạch~~ — xong 2026-11-03.
3. ~~Điều Hậu~~ — xong.
4. ~~Thư Viện~~ — xong.
5. ~~Hợp Hôn (án chung cả quán)~~ — xong.
6. ~~Tử Vi, Tượng Pháp, Cách Cục~~ — xong.
7. ~~Đường đá + trạm đi nhanh~~ — xong.
8. ~~«Đường Thầy» — 3 tab Thầy Giải Quẻ (Án cổ · Năm hạn của bạn · Chọn kinh) + bước «Năm nay» cho 4 sảnh có khách~~ — xong 2026-11-05 (P0-1/P0-2 của `docs/GAME-THIET-KE-CHOT.md`).

## 6. Đã bỏ khỏi kế hoạch (bắt chước game khác)

- W3 «cảnh giới tu học» trong `DAI-THE-GIOI-DESIGN.md`. Riêng **ngự kiếm**: `docs/GAME-THIET-KE-CHOT.md` Q1 chốt 2026-11-05 — đã code đủ (mở cấp 8/VIP `progress.js`, độ cao 3–420 m `main.js:429`, MMO gửi `a` 0–420 `protocol.js:120`, model `flying_sword` đang dùng `effects.js:137`) → giữ làm **phương tiện đi lại**, không phải tu luyện.
- Kiến trúc lớn giữ lại vì là **nơi đặt sảnh nghề**, không phải tông môn tu luyện.

## 7. Nhật ký

### 2026-11-03
- Rà app; lập bản đồ nội dung.
- **Thầy luận bằng AI của app** (`src/game/master-ui.js`): dùng nguyên `askAI` (stream, tool tra cứu, «não» suy luận), gợi ý câu hỏi tiếp (`suggestFollowups`), tự chấm Neo (`checkNeo`). Có ở 3 chỗ: Bàn Thầy (hỏi về lá số mình), sau mỗi án khách Tứ Trụ (thầy luận đúng câu khách hỏi), sau án Trạch Nhật. Bong bóng «Thầy đang luận…» trên đầu thầy trong 3D. Chỉ web (`FEATURES.ai`); iOS tắt như app chính. Máy local không có khoá → tự lùi về luận cục bộ; trên máy chủ thật worker gắn khoá.
- **Sảnh Trạch Nhật** (Lịch Đường, `world.js › trach`): `src/game/zheri-case.js` + `case-ui.js › zheriCaseBody`. Khách sinh theo ngày, việc hợp tuổi (cưới/khai trương/nhập trạch/động thổ/ký kết/xuất hành), 5 ngày ứng viên trong 21 ngày tới (luôn có ngày tốt nhất + 1 ngày xung nếu có). 3 bước: lọc ngày xung tuổi → nhận trực Hoàng đạo (bảng 12 trực đếm từ chi tháng) → chọn ngày. Điểm thông thạo theo nghề (`state.deskLog`). Test `scripts/test-game-zheri.mjs` (8): đáp án khớp `evaluateDate`.
- **Sảnh Dương Trạch** (Phong Thủy Viên, `world.js › duongtrach`, cạnh la bàn lớn): `src/game/dz-case.js` + `case-ui.js › dzCaseBody`. Khách mua nhà, cửa chính đo độ (tránh sát ranh sơn ±2°). 4 bước: mệnh quái Bát Trạch (`computeZhai`) → cửa chính: sơn (`shanFromDegree`) + sao Bát Trạch → cung kê giường, chấm như `bestDirection('giuong')` (Bát Trạch + sát phương năm + phi tinh năm + Dụng thần, sao lý tưởng Thiên Y/Phục Vị) → cung Ngũ Hoàng năm nay (`yearFlyingStar`). Chọn cung trên la bàn 9 cung (Bắc ở trên). Có bảng tra: công thức mệnh quái, 24 sơn, phi tinh năm. Sau án: «Hỏi Thầy về căn nhà này» (AI). Test `scripts/test-game-dz.mjs` (7).
- Sân trống quanh sảnh nghề (`terrain.js › CLEARINGS`) — không mọc cây chen bàn.
- **6 sảnh khai báo** (`src/game/halls.js` — án dạng dữ liệu, chấm chung `gradeStep`: đúng = 1, kề thang = 0,4, chọn nhiều = Jaccard; UI chung `case-ui.js › hallCaseBody`; vị trí `world.js › HALLS`):
  - **Điều Hậu** (Cùng Thông Hồ, 480/420 — sau sơn môn): trục hàn–noãn, táo–thấp (`analyzeHanNuan`), hành cần bù, câu Cùng Thông Bảo Giám đúng nhật chủ + tháng (phương án nhiễu: cùng nhật chủ, khác mùa).
  - **Thư Lâu** (0/−630): 5 câu/ngày — 2 Trích Thiên Tủy, 1 Ngũ Ngôn Độc Bộ, 1 Tích Thiện Thiên, 1 Cổ quyết; đọc nguyên văn chọn nghĩa. Không dùng các tầng phù chú/nghi lễ của thư viện app (tôn giáo, rủi ro duyệt iOS).
  - **Bàn Hợp Hôn** (thành, −40/40): **án chung** — khoá theo ngày, cả quán cùng một cặp (nam–nữ tuổi gần) → bàn trong Giao lưu. Cung phu thê (nhật chi), nhật can, ngũ hành bổ nhau, kết luận (`computeHehun`).
  - **Tử Vi** (Trích Thiên Đỉnh): an Mệnh cung, Ngũ hành cục, chính tinh thủ Mệnh (`computeZiwei`).
  - **Tượng Pháp** (Manh Phái Cốc; quần thể điện thu ×0,75 để bàn có chỗ phẳng): Tài tinh, Quan tinh, Phú/Quý, tầng thứ (`analyzeMangpai`).
  - **Cách Cục** (Tử Bình Phong): cách thần nguyệt lệnh, thuận/nghịch dụng, tương thần, kỵ thần (`R.pattern`, chỉ lấy lá số chính cách).
  - Test `scripts/test-game-halls.mjs` (7).
- **Đường đá** (`landmarks.js › roadPath/roadMesh`): từ cửa nam vòng quanh tường thành rồi toả tới 7 sảnh ngoài thành; dốc quá thì dừng ở chân núi.
- **Trạm đi nhanh**: «Các gian & sảnh nghề» chia 2 nhóm; chọn sảnh ngoài thành → màn chuyển «🐎 Xe ngựa / ⛵ Đò tới …» rồi mở án. Đánh dấu ✓ sảnh đã giải hôm nay. Nhãn sảnh ẩn khi xa > 220 m.
- Thầy AI có ở mọi sảnh có khách (nút «Hỏi Thầy về án này»).
- **Thầy Giải Quẻ** (trong Chính Điện Tam Thanh, trạm `que`): 5 phép của trang chính: Mai Hoa (`castByTime` / `castByNumbers`), Lục Hào (`castLiuYao`, gieo 3 xu × 6), Tiểu Lục Nhâm (`xiaoliurenDetail`), Kim Khẩu Quyết (`jinkoujue`), xin xăm (`qiuqian` + `zhiJiao`). Tắt trên iOS (4.3b). Xem `GAME-V2-THIET-KE.md` §3 S6.

### 2026-11-04 (đào sâu app — vận hạn cá nhân)
- **Vận Mệnh Các** (`vanmenh.js`, `vanmenh-ui.js`, `interior.js › buildVanMenh`): cửa ở (−38,6; −40) trước điện phụ Tây. Hành lang 20 × 72 m, bia đá ở lối vào, 9 cổng đại vận (z = 25 − 6i), bàn thờ chữ 命 cuối hành lang. Biển cổng vẽ canvas theo lá số người chơi (`renderer.setRoomData`).
- **Thái Tuế Điện** (`thaitue.js`, `state.js › lightLamp`): cửa ở (38,6; −40) trước điện phụ Đông. Năm tính theo Lập Xuân. Vách 60 bài vị là một tấm atlas canvas.
- iOS (4.3b): tắt cả hai điện (trạm + cửa), không đóng gói `vanmenh-ui`.
- Test: `scripts/test-game-vanmenh.mjs` (6).

### 2026-11-05 (đợt vá bug + nội dung P0)
- **«Đường Thầy»** (P0-1 theo `docs/GAME-THIET-KE-CHOT.md`): 3 tab mới trong Thầy Giải Quẻ — «Án cổ» (`gu-gongan.js`: chọn án từ `CLASSICAL_CASES`, 3 bước đoán + đối chiếu hai phán cổ/engine qua `classical-runner › analyzeSummary`, bài «bắt phán ghép» vạch mặt từ `ANTI_MANIPULATION_DATA`), «Năm hạn của bạn» (`namhan.js`: `computeDayunPhase` + `dayunGodMeaning` + `analyzeLiunianDeep`, map 6 mức rating → từ mềm «thuận/bình thường/nên thủ»), «Chọn kinh» (`kinh-tu.js`: `suggestDaozangChartAware` qua shim `{ yong: { god } }`). `que-ui.js` chỉ render; chấm điểm trong module, không ghi `deskLog`. Test `test-game-thay-mo-rong.mjs` (13 đạt).
- **Bước «Năm nay»** (P0-2): `npc-deep.js › npcDeep(R, year)` — `analyzeLiunianDeep` → 3 lựa chọn «Thuận / Bình thường / Nên thủ» (kề thang 0,4), append cuối `steps` của 4 sảnh Điều Hậu · Tử Vi · Tượng Pháp · Cách Cục (`halls.js`); Thư Viện + Hợp Hôn không thêm. Test `test-game-npc-deep.mjs` (7 đạt), baseline `test-game-halls.mjs` giữ nguyên (8 đạt).
- **Đợt vá bug** (chi tiết đầy đủ + cột mốc file: `GAME-V2-THIET-KE.md` nhật ký 2026-11-05): ghế phantom Trà Thất (`net.js › setSitting` không trả ghế ảo; `worker/quan-room.js` quét socket không chào), tường thành + viền nền bậc (`obstacles.js › cityWallBlocks` / `markTerraceEdges`), biên Thái Tuế (origin 2000→1850 — `mv` cũ vượt biên server bị bỏ), farm Phúc Khí (khóa sinh + keo chối tốn lượt + trần án 60/ngày — `state.js`), dispose GPU (`render3d.js` / `characters.js`), tên món VIP khớp `cosmetics.js` (Tử Y Chân Nhân · Mũ Sen Vàng · Bát Quái Hộ Thân Phù · Tiên Hạc).
- **Tài nguyên & lộ trình:** kho 3D đã rà chốt — 94 file GLB / 48 id, không thiếu file, credit còn 7 → chỉ tải CC0, không tạo mới tốn credit (`docs/GAME-MESHY-ASSET-PLAN.md`); lộ trình thực thi đợt này = P0 code-only (`docs/GAME-THIET-KE-CHOT.md` §2, §5).
