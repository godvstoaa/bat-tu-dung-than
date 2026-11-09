# 14.04 · Sổ rủi ro phần I (cộng đồng), J (sản xuất), K (kỹ thuật), L (danh tiếng) · Tổng hợp sổ · Mẫu truyền thông khủng hoảng

> Mã: `RISK-143` … `RISK-175`. Tổng hợp toàn sổ ở §5.

---

## 1. Phần I — Cộng đồng (RISK-143 … RISK-152)

### RISK-143 · Đối đầu tôn giáo giữa các môn phái
**Cộng đồng · K 3 · T 4 · 12 Cam · Chủ: TCĐ + GĐSX · Mốc: M6**
- **Mô tả:** §10: «Môn phái = đạo thống», có sổ công đức chung, đạo tràng chung. Nếu có bảng xếp hạng môn phái, người chơi sẽ biến nó thành «Phật hơn Đạo», «Nho thắng». Ở thế giới thật, tranh luận hơn kém giữa các tôn giáo là chủ đề nhạy cảm.
- **Giảm thiểu:** không có bảng xếp hạng **giữa các đạo thống**; sự kiện máy chủ là **hợp tác liên môn** (tổng công đức chung — đúng Vĩ thanh §3); bảng xếp hạng phái chỉ dùng cho 4 phái Tử Bình (`protocol.js › PHAI`: Tử Bình, Manh Phái, Trích Thiên, Cùng Thông) — đây là trường phái học thuật, không phải tôn giáo; cụm từ chat soạn sẵn không có câu so sánh.
- **Phát hiện:** theo dõi kênh cộng đồng ngoài; báo cáo «lý do khác» tăng.
- **Dự phòng:** tạm ẩn chỉ số môn phái công khai.

### RISK-144 · Kỳ thị người lá số thấp
**Cộng đồng · K 3 · T 4 · 12 Cam · Chủ: TCĐ + TAT · Mốc: M3**
- **Mô tả:** khi Phẩm căn, Mệnh Cấp hiện công khai (RISK-032, RISK-110), sẽ có «Phàm Căn đừng vào đội». Đây là kỳ thị theo ngày sinh — đúng thứ trụ cột T2 chống lại.
- **Giảm thiểu:** Phẩm căn không công khai mặc định; ghép đội không hiển thị Phẩm căn; hệ số Nghịch Thiên làm người lá số thấp có giá trị trong đội (§4.7 «Thân nhược cần trợ» nhận buff từ bạn đồng hành — cần cân bằng để đội có người nhược được thưởng).
- **Phát hiện:** báo cáo; phân tích ghép đội (tỉ lệ người lá số thấp bị rời đội sớm).
- **Dự phòng:** ẩn Phẩm căn khỏi mọi bề mặt MMO.

### RISK-145 · Người lớn tiếp cận trẻ em qua sư đồ, mời trà, giải án chung
**Cộng đồng · K 2 · T 5 · 10 Cam · Chủ: TAT + TCĐ · Mốc: M3 (giải án chung), M6 (sư đồ)**
- **Mô tả:** §10 «Sư đồ: cảnh giới ≥ 4 nhận đệ tử»; `protocol.js` có mời hợp tác (`inv`, `coop`). Chat hiện là cụm từ soạn sẵn (an toàn), nhưng quan hệ sư đồ tạo kênh tin cậy để dẫn sang ứng dụng nhắn tin ngoài.
- **Giảm thiểu:** sư đồ chỉ giữa hai người cùng nhóm tuổi (≥ 18 với ≥ 18; trẻ chỉ ghép với NPC sư phụ); không có trao đổi thông tin liên lạc (cụm từ không có số, tên miền); bộ lọc tên chặn số điện thoại, «zalo», «fb», «tele».
- **Phát hiện:** báo cáo lý do mới «Rủ ra ngoài / dụ dỗ» (thêm vào `REPORT_REASONS`), ưu tiên xử lý cao nhất.
- **Dự phòng:** khóa tài khoản, lưu bằng chứng theo yêu cầu pháp luật.

### RISK-146 · Mạo danh tu sĩ, người nổi tiếng, nhân vật thiêng bằng tên
**Cộng đồng · K 4 · T 3 · 12 Cam · Chủ: TCĐ · Mốc: M0**
- **Mô tả:** tên ≤ 24 ký tự: «Thích Nhất Hạnh», «Đức Phật», «Ngọc Hoàng», «Thiên Sư Trương», «Hòa thượng X», tên lãnh đạo nhà nước — vừa xúc phạm vừa có thể lừa người khác («thầy thật đang online»).
- **Giảm thiểu:** danh sách tên dự trữ (tập 14.12 §6.2): danh xưng tôn giáo (Phật, Bồ Tát, Thích + tên, Hòa thượng, Thượng tọa, Đại đức, Ni sư, Lạt-ma, Thiên Sư, Chân nhân…), tên thần thánh, tên NPC chính trong game, tên lãnh tụ, quan chức cấp cao; tên hiển thị không được bắt đầu bằng «Thích» + tên Phật hiệu.
- **Phát hiện:** báo cáo lý do «Tên không phù hợp» (đã có).
- **Dự phòng:** máy chủ đổi tên về «Khách».

### RISK-147 · Thầy cúng, thầy bói thật dùng game để tìm khách
**Cộng đồng · K 3 · T 4 · 12 Cam · Chủ: TCĐ + PC · Mốc: M1**
- **Mô tả:** chính đối tượng Định Mệnh Hội ngoài đời: đặt tên «Thầy Hưng giải hạn 09xx», danh hiệu, khắc bảng vàng có số điện thoại. Người chơi đang lo năm hạn là con mồi.
- **Giảm thiểu:** bộ lọc tên chặn chuỗi số ≥ 6 chữ số, chữ số viết bằng chữ («không chín»), tên miền, «zalo», «inbox»; lý do báo cáo «Quảng cáo dịch vụ tâm linh»; codex Định Mệnh Hội dạy người chơi nhận diện.
- **Phát hiện:** báo cáo; quét tên định kỳ.
- **Dự phòng:** khóa, đổi tên.

### RISK-148 · Chat soạn sẵn quá hạn chế, cộng đồng dời sang kênh ngoài không kiểm soát
**Cộng đồng · K 4 · T 3 · 12 Cam · Chủ: TCĐ · Mốc: M3**
- **Mô tả:** 8 cụm từ (`PHRASES`) đủ cho giai đoạn đầu (Guideline 1.2). Khi game lớn, người chơi lập nhóm Facebook, Zalo, Discord mang tên game — ở đó không có lọc, không có cổng tuổi, và nội dung xấu gắn với thương hiệu.
- **Giảm thiểu:** mở rộng thư viện cụm từ theo ngữ cảnh (giải án, thiền, lễ hội — ≥ 80 cụm) trước khi người chơi đòi chat tự do; kênh cộng đồng chính thức có điều hành viên và nội quy giống trong game.
- **Phát hiện:** theo dõi nhóm ngoài mang tên game.
- **Dự phòng:** tuyên bố kênh chính thức; báo cáo nền tảng với nhóm mạo danh.

### RISK-149 · Cộng đồng ngoài lan truyền «cách yểm thật» gắn tên game
**Cộng đồng · K 2 · T 5 · 10 Cam · Chủ: TCĐ + TT · Mốc: M4**
- **Mô tả:** sau khi Tà Lộ ra mắt, có người đăng «làm như Yểm sư trong game thì yểm thật được» kèm hướng dẫn thật lấy từ chỗ khác.
- **Giảm thiểu:** nội dung trong game không có gì để «làm theo» (tập 14.08); tuyên bố rõ trong codex và trang chính thức: «Mọi phép trong Tà Lộ là ký hiệu hư cấu»; báo cáo bài đăng tới nền tảng.
- **Phát hiện:** theo dõi từ khóa tên game + «yểm», «bùa».
- **Dự phòng:** đăng đính chính.

### RISK-150 · Người chơi Tà Lộ bị gán nhãn, bắt nạt
**Cộng đồng · K 3 · T 3 · 9 Cam · Chủ: TCĐ + TND · Mốc: M4**
- **Mô tả:** Hồi IV: người chơi chính lộ «kéo» người Tà Lộ lên ở cầu Nại Hà (MMO). Nếu trạng thái Tà Lộ hiện công khai (Nợ Âm hiện công khai — canon), người khác có thể bắt nạt «kẻ tà».
- **Giảm thiểu:** «Nợ Âm công khai» hiểu là **công khai với chính người chơi** (trong Sổ Mệnh), không hiện với người khác; cảnh cầu Nại Hà là mời và nhận lời, không ép; không có emote chế giễu.
- **Phát hiện:** báo cáo.
- **Dự phòng:** ẩn trạng thái Tà Lộ trên MMO.

### RISK-151 · Điều hành viên thiếu hiểu biết văn hóa, tôn giáo, có thiên kiến
**Cộng đồng · K 3 · T 3 · 9 Cam · Chủ: TCĐ · Mốc: M3**
- **Mô tả:** điều hành viên phải xét «tên này có xúc phạm Phật giáo không», «câu này là đùa hay đe dọa». Thiếu hiểu biết dẫn tới xử sai, thiên vị một tôn giáo.
- **Giảm thiểu:** tài liệu huấn luyện điều hành (tập 14.12 §6.6) có phần thuật ngữ tôn giáo, ví dụ xử lý; ca khó chuyển HĐCV.
- **Phát hiện:** kiểm tra chéo 10% quyết định.
- **Dự phòng:** đảo quyết định, xin lỗi.

### RISK-152 · Xử phạt không minh bạch, không có kháng nghị
**Cộng đồng · K 3 · T 2 · 6 Xanh · Chủ: TCĐ · Mốc: M3**
- **Mô tả:** đổi tên, ẩn, khóa mà không cho người chơi biết lý do, không có cách kháng nghị → mất niềm tin, khiếu nại lên cửa hàng.
- **Giảm thiểu:** thang xử phạt công khai (tập 14.12 §6.5), thông báo lý do, kháng nghị một lần trong 14 ngày.
- **Phát hiện:** —
- **Dự phòng:** —

---

## 2. Phần J — Sản xuất (RISK-153 … RISK-160)

### RISK-153 · Không tìm được cố vấn tín ngưỡng kịp mốc
**Sản xuất · K 4 · T 4 · 16 Đỏ · Chủ: GĐSX + TND · Mốc: M1 (tìm), M2–M5 (cần)**
- **Mô tả:** §14 yêu cầu cố vấn từ mỗi truyền thống «trước M2–M5». Tìm được tu sĩ, học giả chịu làm cố vấn cho một game (dễ bị dư luận đánh giá) cần thời gian, quan hệ, thù lao. M2 chỉ cách M0 6 tuần.
- **Giảm thiểu:** lộ trình tuyển cố vấn (tập 14.07 §7.2) bắt đầu ngay M0; ưu tiên học giả (khoa Tôn giáo học, Viện Nghiên cứu Tôn giáo, Viện Nghiên cứu Hán Nôm) vì ít ngại hơn tu sĩ; mỗi thánh địa chỉ vào sản xuất art khi có cố vấn.
- **Phát hiện:** bảng tiến độ tuyển cố vấn trong họp tuần.
- **Dự phòng:** đổi thứ tự thánh địa (làm vùng đã có cố vấn trước); vùng chưa có cố vấn dùng mức chi tiết thấp, nhãn «đang hoàn thiện».

### RISK-154 · Cố vấn bất đồng nhau, hoặc rút lui sau khi đã sản xuất
**Sản xuất · K 3 · T 4 · 12 Cam · Chủ: GĐSX · Mốc: M2–M5**
- **Mô tả:** hai cố vấn Phật giáo khác pháp môn có thể đưa yêu cầu trái nhau; cố vấn rút lui khi bị người cùng truyền thống phê phán, kèm yêu cầu gỡ tên.
- **Giảm thiểu:** thỏa thuận cố vấn (tập 14.07 §7.3) có điều khoản ghi công tùy chọn, quy trình giải quyết bất đồng (ưu tiên phương án tối giản — không làm thì không sai), biên bản từng lần duyệt để nội dung đã duyệt không phụ thuộc người.
- **Phát hiện:** —
- **Dự phòng:** giữ nội dung đã duyệt, gỡ tên trong credits theo yêu cầu, tìm cố vấn thay để duyệt lại.

### RISK-155 · Tài sản AI sinh (Meshy) mang hình tượng thật hoặc sai phong cách
**Sản xuất · K 4 · T 3 · 12 Cam · Chủ: AD · Mốc: M2**
- **Mô tả:** mô hình Meshy cho «Taoist temple statue» có thể ra tượng giống một vị thần cụ thể với ấn quyết sai, hoặc trộn Phật và Đạo; texture có chữ Hán vô nghĩa hoặc chữ thật không phù hợp.
- **Giảm thiểu:** danh sách «không sinh bằng AI» (tập 14.07 §5.4): tượng thờ chính, pháp khí, thangka, phù; các mục đó làm thủ công theo tham chiếu đã duyệt. Mọi texture có chữ phải qua người đọc Hán.
- **Phát hiện:** checklist art.
- **Dự phòng:** thay tài sản.

### RISK-156 · Quá phạm vi 12 thánh địa làm cắt khâu duyệt văn hóa
**Sản xuất · K 4 · T 4 · 16 Đỏ · Chủ: GĐSX · Mốc: M2–M5**
- **Mô tả:** lộ trình §13.4: 10 vùng mới trong ~26 tuần, mỗi vùng 25–40 công trình, 7 bộ mô-đun nội thất, cùng lúc còn 7 credit Meshy. Áp lực tiến độ thường làm khâu duyệt cuối (văn hóa, an toàn) bị bỏ qua.
- **Giảm thiểu:** duyệt văn hóa là **cổng chặn** trong checklist mốc (tập 14.13), không phải bước cuối; giảm phạm vi theo thứ tự (bớt thánh địa) chứ không bớt duyệt.
- **Phát hiện:** chỉ số: số công trình đã vào bản build mà thiếu biên bản duyệt.
- **Dự phòng:** lùi mốc.

### RISK-157 · Các tập GDD mâu thuẫn nhau
**Sản xuất · K 4 · T 2 · 8 Cam · Chủ: GĐSX · Mốc: M0**
- **Mô tả:** 14 tập viết song song; một tập cho NPC nói điều tập này cấm (vd tập 06 cho Khổng tiên sinh nói về sức khỏe).
- **Giảm thiểu:** canon `00-KINH-DIEN-CHUNG.md` là chuẩn; tập 14 đưa danh sách quy tắc có mã (`RISK-G-*`, `RISK-AT-*`, `RISK-MH-*`, `RISK-AI-*`) để các tập khác dẫn; rà chéo cuối M0.
- **Phát hiện:** tìm chuỗi theo danh sách từ cấm trên toàn `docs/gdd/`.
- **Dự phòng:** quyết định của GĐSX, cập nhật canon.

### RISK-158 · Ghi âm, lồng tiếng không có thỏa thuận
**Sản xuất · K 3 · T 3 · 9 Cam · Chủ: GĐSX · Mốc: M2**
- **Mô tả:** thu tiếng tụng ở chùa thật, tiếng chuông, giọng người đọc kinh; dùng giọng tổng hợp bắt chước giọng một tu sĩ nổi tiếng.
- **Giảm thiểu:** thỏa thuận bằng văn bản; không dùng giọng tổng hợp mô phỏng người thật; giọng NPC tôn giáo do diễn viên đồng ý vai, có hướng dẫn phong thái của cố vấn.
- **Phát hiện:** danh mục âm thanh có cột giấy phép.
- **Dự phòng:** gỡ âm thanh.

### RISK-159 · Một người tự viết, tự duyệt nội dung nhạy cảm
**Sản xuất · K 5 · T 3 · 15 Đỏ · Chủ: GĐSX · Mốc: M0**
- **Mô tả:** dự án hiện chủ yếu do một người cùng AI làm. Quy tắc bốn mắt (tập 14.01 §1.3) không tự thỏa.
- **Giảm thiểu:** duyệt ngoài theo giờ cho các hạng mục bắt buộc (tôn giáo, âm tà, khủng hoảng, pháp lý); AI không được dùng làm người duyệt thay người (chỉ làm bước tiền kiểm).
- **Phát hiện:** biên bản duyệt phải có chữ ký người ngoài.
- **Dự phòng:** hoãn phát hành nội dung chưa duyệt.

### RISK-160 · Bản địa hóa làm sai thuật ngữ tôn giáo
**Sản xuất · K 3 · T 3 · 9 Cam · Chủ: TND · Mốc: khi có bản tiếng Anh**
- **Mô tả:** «Thái Tuế» thành «Grand Duke Jupiter» trong chỗ này, «Tai Sui» chỗ khác; «Giải Thoát» thành «Liberation» làm hiểu như chính trị; «yểm» thành «curse» làm phẳng nghĩa.
- **Giảm thiểu:** bảng thuật ngữ đa ngữ do cố vấn duyệt; giữ phiên âm + chú giải cho thuật ngữ thiêng.
- **Phát hiện:** duyệt bản dịch theo bảng.
- **Dự phòng:** vá chuỗi.

---

## 3. Phần K — Kỹ thuật (RISK-161 … RISK-167)

### RISK-161 · Lỗi engine làm game nói sai cổ pháp
**Kỹ thuật · K 4 · T 3 · 12 Cam · Chủ: TMC + TND · Mốc: M0**
- **Mô tả:** Phụ lục B: `remedy-fate.js › getRemedyForChart` so `'劫财'` giản thể với `'劫財'` phồn thể — nhánh Kiếp Tài không bao giờ khớp; `daozang-data.js › suggestDaozangChartAware` đọc `R?.yong?.god` thay vì `R.yong.primary`. Game dựng Mệnh Đồ, gợi ý đạo thống từ các hàm này → khuyên sai, trái T5.
- **Giảm thiểu:** sửa trước M0; thêm test đơn vị chạy với lá số mẫu có Kiếp Tài lộ.
- **Phát hiện:** `npm test` mở rộng.
- **Dự phòng:** tắt gợi ý tương ứng.

### RISK-162 · Cờ iOS bị lọt, bản iOS có gian bói
**Kỹ thuật · K 3 · T 5 · 15 Đỏ · Chủ: TMC + TPH · Mốc: mỗi build**
- **Mô tả:** `features.js › IOS` phụ thuộc `import.meta.env.MODE`. Một thay đổi cấu hình Vite, một mô-đun mới import trực tiếp `que-ui.js` không qua `stations.js` có thể đưa gian bói vào iOS.
- **Giảm thiểu:** `verify-ios-review-path.mjs` đã kiểm `STATIONS` không có `xam`, `sen` và từ cấm; mở rộng: kiểm danh sách tệp chunk trong `dist-ios`, kiểm không có chuỗi «Vận Mệnh Các», «Thái Tuế Điện», «Khổng tiên sinh», «Mệnh Đồ».
- **Phát hiện:** CI chạy `verify:ios` + `verify:ios-path` trước mọi lần tải lên App Store Connect.
- **Dự phòng:** rút bản.

### RISK-163 · Chế độ không AI thiếu lớp an toàn khủng hoảng
**Kỹ thuật · K 3 · T 4 · 12 Cam · Chủ: TAT + TMC · Mốc: M0**
- **Mô tả:** khi AI tắt, `askAI` trả `composeAnswer` cục bộ (`source !== 'ai'`). Nếu bộ phát hiện khủng hoảng chỉ gắn vào luồng AI, người chơi gõ «muốn chết» khi offline nhận câu trả lời cổ pháp bình thường.
- **Giảm thiểu:** bộ phát hiện chạy **trước** khi chọn nguồn trả lời (tập 14.09 §3.1), áp cho mọi nguồn.
- **Phát hiện:** test chế độ không mạng.
- **Dự phòng:** —

### RISK-164 · checkNeo cho kết quả sai lệch với giọng persona
**Kỹ thuật · K 3 · T 2 · 6 Xanh · Chủ: TAI · Mốc: M0**
- **Mô tả:** regex `checkNeo` viết cho văn phong «thầy Tử Bình»; Vân Cốc kể chuyện, Phán quan nói cổ văn → bắt ít mốc, điểm dựa trên quá ít mẫu (`totalChecked` thấp nhưng `score` 100%).
- **Giảm thiểu:** hiển thị điểm Neo chỉ khi `totalChecked ≥ 3`; bộ đánh giá theo persona.
- **Phát hiện:** phân bố `totalChecked` theo persona.
- **Dự phòng:** ẩn huy hiệu Neo cho persona đó.

### RISK-165 · Người chơi kẹt trong không gian nặng nề (Phong Đô, Âm ty)
**Kỹ thuật · K 3 · T 3 · 9 Cam · Chủ: GĐSX + QA · Mốc: M4**
- **Mô tả:** Phong Đô thiết kế «đường một chiều xuống dốc… lối ra duy nhất là đi lên» (§7.9). Kẹt va chạm, rớt mạng, hoặc chỉ là người chơi hoảng sợ — cần thoát ngay.
- **Giảm thiểu:** nút «Về Sơn Môn» luôn có trong mọi vùng (kể cả Phong Đô), không mất tiến độ đạo đức; lối ra là ý nghĩa truyện, không phải ràng buộc kỹ thuật.
- **Phát hiện:** test A* từ mọi điểm Phong Đô ra cổng; test nút thoát.
- **Dự phòng:** dịch chuyển cứu hộ.

### RISK-166 · Lịch âm, lễ tiết sai múi giờ
**Kỹ thuật · K 3 · T 2 · 6 Xanh · Chủ: TMC · Mốc: M3**
- **Mô tả:** sự kiện máy chủ theo lịch âm (Vu Lan, Phật đản) tính bằng giờ máy chủ UTC → lễ lệch một ngày với người Việt; người chơi hải ngoại khác múi giờ.
- **Giảm thiểu:** lễ tiết tính theo **giờ Việt Nam (UTC+7)** cho máy chủ; hiển thị giờ địa phương kèm chú thích.
- **Phát hiện:** test bảng lễ 10 năm.
- **Dự phòng:** kéo dài sự kiện thêm một ngày.

### RISK-167 · Rớt mạng giữa chuỗi cứu người MMO làm mất tiến độ đạo đức
**Kỹ thuật · K 3 · T 2 · 6 Xanh · Chủ: TMC · Mốc: M4**
- **Mô tả:** chuỗi trả nghiệp, cứu người ở cầu Nại Hà có bước nhiều người; rớt mạng giữa chừng → mất bước, người chơi cảm thấy bị phạt.
- **Giảm thiểu:** mọi bước ghi tiến độ ngay khi hoàn thành; bước nhiều người có phương án đơn (NPC thay) sau 60 giây chờ.
- **Phát hiện:** test mất kết nối.
- **Dự phòng:** khôi phục từ nhật ký.

---

## 4. Phần L — Danh tiếng (RISK-168 … RISK-175)

### RISK-168 · Báo chí gắn nhãn «game cổ xúy mê tín»
**Danh tiếng · K 4 · T 4 · 16 Đỏ · Chủ: TT + GĐSX · Mốc: trước mọi công bố**
- **Mô tả:** báo chí Việt Nam thường phê phán dịch vụ bói toán online, «giải hạn». Một game cho nhập ngày sinh, có Thái Tuế, phù, âm tà dễ bị quy về nhóm đó, kéo theo cơ quan quản lý chú ý (RISK-074).
- **Giảm thiểu:** thông điệp gốc «Mệnh do ta tạo: game dạy tự sửa mình, chống lừa đảo tâm linh»; tài liệu báo chí có trích Liễu Phàm tứ huấn, thiết kế chống Định Mệnh Hội, cam kết không bán cải mệnh; không dùng từ «bói», «giải hạn» trong truyền thông.
- **Phát hiện:** theo dõi báo chí, mạng xã hội.
- **Dự phòng:** mẫu §6.1.

### RISK-169 · Ảnh chụp câu trả lời AI tồi tệ lan truyền
**Danh tiếng · K 3 · T 5 · 15 Đỏ · Chủ: TAI + TT · Mốc: M0**
- **Mô tả:** một ảnh «NPC trong game bảo tôi sẽ chết năm 40» hay «NPC chỉ cách yểm» đủ để làm khủng hoảng.
- **Giảm thiểu:** toàn bộ tập 14.10; mỗi câu trả lời AI có mã phiên ngắn (không chứa dữ liệu cá nhân) in mờ để xác minh ảnh thật/giả; nhãn «AI» luôn hiện trong ảnh chụp.
- **Phát hiện:** theo dõi mạng xã hội; nút báo cáo câu trả lời.
- **Dự phòng:** mẫu §6.2; tắt persona liên quan.

### RISK-170 · Phản ứng của tổ chức tôn giáo, cộng đồng tín đồ
**Danh tiếng · K 3 · T 4 · 12 Cam · Chủ: GĐSX + TT + HĐCV · Mốc: M2**
- **Mô tả:** một chức sắc, một trang tin Phật giáo, một nhóm đạo hữu lên tiếng phản đối một cảnh, một vật phẩm.
- **Giảm thiểu:** cố vấn là cầu nối; kênh tiếp nhận góp ý tôn giáo riêng (email), cam kết phản hồi 72 giờ.
- **Phát hiện:** theo dõi trang tin tôn giáo.
- **Dự phòng:** mẫu §6.3.

### RISK-171 · Phản ứng chính trị liên quan Tây Tạng, Trung Quốc
**Danh tiếng · K 2 · T 5 · 10 Cam · Chủ: GĐSX + PC · Mốc: M5**
- **Mô tả:** Potala, hình ảnh lãnh tụ tinh thần Tây Tạng, cờ, bản đồ; ngược lại, trình bày Tây Tạng theo cách một phía cũng gây phản ứng từ cộng đồng người Tạng. Game cũng dùng nhiều thánh địa ở Trung Quốc (Long Hổ, Võ Đang, Bạch Vân Quán) — nhạy cảm nếu sau này phát hành ở thị trường đó.
- **Giảm thiểu:** Tạng Địa không có nhân vật lịch sử, chính trị đương đại, cờ, bản đồ; không có cốt truyện về chuyển thế, kế vị (tập 14.06 §6.3); không phát hành tại Trung Quốc đại lục trong lộ trình hiện tại.
- **Phát hiện:** rà nội dung Tạng Địa.
- **Dự phòng:** đóng vùng.

### RISK-172 · Người có ảnh hưởng dùng game để bán dịch vụ cúng giải
**Danh tiếng · K 3 · T 3 · 9 Cam · Chủ: TT + PC · Mốc: M6**
- **Mô tả:** «thầy» nổi tiếng livestream chơi game rồi «giải hạn thật cho fan». Thương hiệu game bị gắn với dịch vụ đó.
- **Giảm thiểu:** điều khoản thương hiệu cấm dùng tên, hình ảnh game để quảng bá dịch vụ tâm linh trả phí; không hợp tác quảng bá với người bán dịch vụ đó.
- **Phát hiện:** theo dõi.
- **Dự phòng:** yêu cầu gỡ, tuyên bố.

### RISK-173 · Sự cố game kéo theo app Bát Tự / Lữ Đăng
**Danh tiếng · K 3 · T 4 · 12 Cam · Chủ: GĐSX + TPH · Mốc: M0**
- **Mô tả:** game nằm trong app (tab «Học Quán» trên iOS, `verify-ios-review-path.mjs`); chung miền `battu.god8.shop`, chung Worker. Khủng hoảng của game (tôn giáo, AI) có thể làm Apple gỡ cả app nghiên cứu; sự cố máy chủ MMO làm chết cả app.
- **Giảm thiểu:** cân nhắc tách game thành sản phẩm riêng trước M4 (Tà Lộ); trong lúc chung: công tắc tắt game độc lập (`env.QUAN`, cờ ẩn tab) không ảnh hưởng app.
- **Phát hiện:** —
- **Dự phòng:** ẩn tab game bằng bản cập nhật nhanh.

### RISK-174 · Tranh cãi về «độ chính xác» của lá số
**Danh tiếng · K 3 · T 3 · 9 Cam · Chủ: TT + TND · Mốc: M0**
- **Mô tả:** người chơi nói «game bảo tôi Thân vượng mà thầy khác bảo nhược» hoặc «game nói đúng quá, đáng sợ». Cả hai chiều đều có thể leo thang (bị chê sai, hoặc bị chê thao túng).
- **Giảm thiểu:** minh bạch: nút «Vì sao?» (`synthesis.factors`), dòng «Để tham khảo và chiêm nghiệm» như app; trang chính và game cùng số liệu (T1); câu chuẩn của Thầy Tử Bình về khác biệt trường phái (GR6, PR5).
- **Phát hiện:** —
- **Dự phòng:** bài giải thích trên trang chính thức.

### RISK-175 · Sự cố dữ liệu liên quan ngày sinh
**Danh tiếng · K 2 · T 5 · 10 Cam · Chủ: PC + TBM · Mốc: M1**
- **Mô tả:** lộ khóa admin (RISK-124) → lộ `vprof` của app chính (tên + ngày giờ sinh + IP). Dù là dữ liệu của app, báo chí sẽ viết «game xem bói lộ ngày sinh người dùng».
- **Giảm thiểu:** RISK-111, RISK-124; thu hẹp `vprof` (bỏ tên, giờ sinh, rút TTL) — đề xuất cho chủ app.
- **Phát hiện:** —
- **Dự phòng:** quy trình tập 14.12 §8.

---

## 5. Tổng hợp sổ rủi ro

### 5.1 Phân bố theo nhóm và mức

| Nhóm | Số mục | Đỏ | Cam | Xanh |
|---|---|---|---|---|
| A Nội dung · tôn giáo | 30 | 7 | 22 | 1 |
| B An toàn · sức khỏe tinh thần | 20 | 7 | 12 | 1 |
| C AI | 22 | 3 | 18 | 1 |
| D Pháp lý | 18 | 5 | 11 | 2 |
| E Nền tảng | 14 | 2 | 10 | 2 |
| F Quyền riêng tư | 14 | 1 | 8 | 5 |
| G Bảo mật | 14 | 2 | 10 | 2 |
| H Kinh tế | 10 | 3 | 6 | 1 |
| I Cộng đồng | 10 | 0 | 9 | 1 |
| J Sản xuất | 8 | 3 | 5 | 0 |
| K Kỹ thuật | 7 | 1 | 3 | 3 |
| L Danh tiếng | 8 | 2 | 6 | 0 |
| **Tổng** | **175** | **36** | **120** | **19** |

*(Đếm theo điểm ghi ở từng mục; khi sửa điểm một mục, cập nhật bảng này.)*

### 5.2 Hai mươi rủi ro ưu tiên (điểm cao, chặn mốc gần)

| Thứ tự | Mã | Tên ngắn | Điểm | Mốc chặn |
|---|---|---|---|---|
| 1 | RISK-073 | MMO G1 chưa giấy phép | 25 | trước MMO công khai |
| 2 | RISK-001 | Biểu tượng thiêng làm đồ thời trang, khóa VIP | 20 | M0 |
| 3 | RISK-012 | Người Miêu/H'Mông gắn cổ độc | 20 | M4 |
| 4 | RISK-037 | Không phát hiện ý định tự hại | 20 | M0 |
| 5 | RISK-053 | Jailbreak lấy cách yểm thật | 20 | M0 |
| 6 | RISK-074 | Kịch bản G1 bị từ chối | 20 | M2 |
| 7 | RISK-091 | Apple 4.3(b) | 20 | mỗi lần nộp |
| 8 | RISK-002 | Tên «Pháp Luân» | 16 | M0 |
| 9 | RISK-003 | Vô lễ trong không gian thờ | 16 | M1 |
| 10 | RISK-010 | Phản diện bôi nhọ Tổ nghề mộc | 16 | M3 |
| 11 | RISK-029 | NPC tôn giáo nói sai giáo lý | 16 | M0 |
| 12 | RISK-031 | Lá số thấp bị phán xét | 16 | M0 |
| 13 | RISK-034 | Năm hạn đời thực | 16 | M4 |
| 14 | RISK-040 | Trẻ em tiếp cận nội dung nặng | 16 | M1 |
| 15 | RISK-076 | Giờ chơi, xác thực | 16 | M3 |
| 16 | RISK-077 | Dữ liệu nhạy cảm không đồng ý | 16 | M1 |
| 17 | RISK-153 | Thiếu cố vấn | 16 | M1 |
| 18 | RISK-156 | Quá phạm vi cắt khâu duyệt | 16 | M2 |
| 19 | RISK-168 | Nhãn «cổ xúy mê tín» | 16 | trước công bố |
| 20 | RISK-122 | Trường `title` không lọc | 15 | M0 |

### 5.3 Việc phải làm ngay ở M0 (rút từ sổ, không cần thiết kế mới)

| Việc | Mã liên quan | Tệp mã |
|---|---|---|
| Sửa danh mục: bỏ `aura_sen`, `dai_sen`; đổi `quan_sen`, `phap_luan`; sửa mô tả `tram_go`, `dao_quan`; bỏ khóa VIP món thiêng | RISK-001, 002, 081 | `src/game/cosmetics.js` |
| Thêm bất biến E1–E6 vào test | RISK-133–135 | `scripts/test-game-cosmetics.mjs` |
| Máy chủ chỉ nhận `title` từ danh mục | RISK-122 | `src/game/protocol.js` |
| Bỏ `?server=` khỏi bản phát hành | RISK-129 | `src/game/net.js` |
| Token admin ra khỏi URL | RISK-124 | `worker/admin.js` |
| Bỏ dòng «Ngự kiếm ngay, không chờ cấp 8» khỏi quyền lợi VIP | RISK-134 | `src/game/wardrobe-ui.js`, `progress.js` |
| Sửa hai lỗi engine Phụ lục B | RISK-161 | `src/engine/remedy-fate.js`, `daozang-data.js` |
| Bộ phát hiện khủng hoảng trước khi gọi `askAI` | RISK-037, 163 | `src/game/master-ui.js` |
| Báo cáo có TTL, có người đọc | RISK-093, 109, 123 | `worker/quan-room.js`, `worker/admin.js` |

---

## 6. Mẫu truyền thông khủng hoảng

Nguyên tắc chung: trả lời trong **24 giờ**; nói rõ việc đã làm; không đổ lỗi cho người chơi, cho AI hay cho nhà cung cấp; không tranh luận giáo lý công khai; không nhắc tên người phản ánh nếu họ không muốn.

### 6.1 Bị gọi là «game cổ xúy mê tín»

> Huyền Giới được làm từ một ý: **mệnh do ta tạo**. Người chơi nhập ngày sinh để có một nhân vật xuất phát, rồi học cách tự sửa mình qua việc thiện, học tập, tu tâm — theo tinh thần sách *Liễu Phàm tứ huấn*. Phản diện chính của game là những kẻ dọa người và bán «lễ đổi mệnh». Game không bán bất cứ thứ gì hứa đổi vận, giải hạn, và mọi lời luận đều kèm lời nhắc «để tham khảo và chiêm nghiệm». Chúng tôi sẵn lòng gửi tài liệu thiết kế và mời quý vị chơi thử.

### 6.2 Câu trả lời AI gây hại bị lan truyền

> Chúng tôi đã xem hình ảnh câu trả lời của nhân vật [tên NPC]. Câu đó **sai và trái với quy tắc của game**: nhân vật không được phán [điều cụ thể]. Chúng tôi đã tắt chế độ trò chuyện AI của nhân vật này từ [giờ, ngày], đang rà lại toàn bộ quy tắc, và sẽ chỉ bật lại sau khi kiểm thử xong. Nếu câu trả lời đó làm bạn lo lắng: đây là lời do máy sinh ra, không phải lời tiên đoán. [Nếu liên quan sức khỏe tinh thần: kèm thẻ hỗ trợ tập 14.09 §5.]

### 6.3 Tổ chức, cộng đồng tôn giáo phản ánh

> Chúng tôi cảm ơn [quý thầy / quý vị] đã góp ý về [nội dung]. Chúng tôi đã [ẩn / gỡ] nội dung này từ [ngày] trong khi xin ý kiến cố vấn của truyền thống [tên]. Game được làm với mong muốn trình bày nghiêm túc các truyền thống tín ngưỡng; khi chúng tôi làm chưa đúng, chúng tôi muốn sửa. Mong được trao đổi trực tiếp qua [email kênh tôn giáo].

### 6.4 Sự cố dữ liệu

> Ngày [ngày], chúng tôi phát hiện [mô tả ngắn, trung thực]. Dữ liệu có thể bị ảnh hưởng gồm: [liệt kê]. Dữ liệu **không** bị ảnh hưởng: [liệt kê, vd «ngày sinh lưu trên máy của bạn không rời máy»]. Chúng tôi đã [biện pháp] và đã thông báo cho cơ quan có thẩm quyền theo quy định. Bạn nên [hành động cụ thể nếu có]. Liên hệ: [email].

### 6.5 Vật phẩm thiêng bị chỉ trích

> Món [tên] chưa phù hợp với ý nghĩa thiêng liêng của [biểu tượng]. Chúng tôi đã gỡ món này khỏi cửa hàng, hoàn lại Ngọc cho người đã mua và thay bằng [món mới]. Chúng tôi đang rà lại toàn bộ danh mục cùng cố vấn.
