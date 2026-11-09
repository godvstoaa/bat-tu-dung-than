# 02 · Phần 10 — Codex IV: Bảo vật và địa danh (LORE-301 → LORE-399)

> **Bảo vật (301–340)** đều là **[HƯ CẤU]** của game, trừ khi ghi «có thật» (vd thước Lỗ Ban là dụng cụ dân gian có thật). Không bảo vật nào là vũ khí; không bảo vật nào «đổi mệnh». Bảo vật có thể là vật phẩm cốt truyện, đồ trang trí đạo tràng, hoặc chỉ là mục codex.
> **Địa danh (341–399)** là mục codex người chơi nhận khi đến nơi; nội dung ngắn, giọng «sách hướng dẫn của Thư Lâu». Chi tiết đời sống vùng ở phần 03–05.
> Cột «Dạng» của bảo vật: **CT** = vật phẩm cốt truyện (không bán, không trao đổi) · **TT** = trang trí đạo tràng / nhà · **ĐC** = đạo cụ hoạt động · **KX** = chỉ xem (đặt trong thế giới).

---

## A. Bảo vật (LORE-301 → LORE-340)

### LORE-301 · 天命盤 Thiên Mệnh Bàn [HƯ CẤU]
**Loại:** Bảo vật · KX · Sơn Môn | **Mở khóa:** cảnh mở đầu `MQ-P-xx`
Ba vòng một lõi do các Trì Thủ gõ từ ánh trăng trên Thiên Trì (HIS-006): vòng Địa (24 sơn), vòng Thời (12 chi), vòng Biến (bát quái), lõi Thiên Tâm — «chỗ của người đọc». Nứt từ Ngọ sang Tý đêm Giao Vận (HIS-087). Trời không sai; chỉ gương soi trời bị rạn.
Model: `models.js › thienBan()`.

### LORE-302 · 盤銘 Bàn Minh — bản dập 16 chữ [HƯ CẤU]
**Loại:** Bảo vật · CT · Thư Lâu | **Mở khóa:** tìm lại bản dập gốc (cốt truyện chính)
«天定其框 人書其字 框不可移 字不可代» — Trời định khung, người viết chữ; khung không dời, chữ không ai viết thay. Đọc thiếu bốn chữ cuối thành giáo điều định mệnh (01 › 1.4.3). Bản gốc bị đánh cắp năm Ất Tỵ (HIS-093).

### LORE-303 · 師案 Bàn Thầy [HƯ CẤU]
**Loại:** Bảo vật · KX · Sơn Môn | **Mở khóa:** ngồi Bàn Thầy lần đầu (đã có trạm)
Cái bàn gỗ Sơ Tổ dựng sau ba năm im lặng (HIS-015). Mép bàn còn chữ khắc mờ: «Bàn trên trời để biết trời. Bàn dưới đất để biết người.» Mặt bàn đã thay nhiều lần; chân bàn là gỗ gốc.

### LORE-304 · 圭表 Khuê Biểu Lịch Đường
**Loại:** Bảo vật · KX · Lịch Đường | **Mở khóa:** dự lễ Đo Bóng
Cột đá cao tám thước và thước đá nằm (khuê) dài để đo bóng Mặt Trời trưa — dụng cụ thiên văn có thật trong lịch sử (khuê biểu). Bản Huyền Giới [HƯ CẤU]: đêm Bàn nứt, bóng trên khuê dừng ba hơi thở rồi chạy tiếp (HIS-088).

### LORE-305 · 祖羅盤 La Bàn Tổ Phong Thủy Viên [HƯ CẤU]
**Loại:** Bảo vật · KX · Phong Thủy Viên | **Mở khóa:** Lễ So Kim
La bàn đá đường kính chín mét, kim sắt tự nhiên treo dây. Mọi la bàn trong vùng được so với nó mỗi Thu Phân. Đêm Bàn nứt kim quay ba vòng rồi đứng đúng Bắc — địa sư coi là bằng chứng «trời không sai». Dùng để phát hiện La Bàn Giả (HIS-084).

### LORE-306 · 功過簿 Sổ Công Quá Huyền Thành [HƯ CẤU]
**Loại:** Bảo vật · KX · chợ Huyền Thành | **Mở khóa:** ghi việc thiện đầu tiên
Cuốn sổ lớn đặt ở chợ từ năm 1171 (HIS-046), ai cũng tự ghi việc thiện, việc lỗi; không ai kiểm, không ai phạt; đêm Trừ Tịch đọc to tổng số, không nêu tên. Hình mẫu lore của `CONG_QUA` và `meritLedger`; bản cá nhân của người chơi được trao ở Am Vân Cốc.

### LORE-307 · 都功印 Ấn Đô Công Long Hổ (bản phỏng) [HƯ CẤU]
**Loại:** Bảo vật · KX · Thiên Sư Phủ | **Mở khóa:** thiện cảm Tin với Chính Nhất
Ấn gỗ khắc bốn chữ «Long Hổ Thiên Sư», do phủ Huyền Giới khắc để đóng lên sổ thiện của đạo dân — **phỏng theo hình thức**, không sao chép ấn nghi lễ có thật (canon §7.1 nhắc ấn Dương Bình Trị Đô Công như linh vật). Không dùng để «trấn» gì.

### LORE-308 · 七星桃木劍 Kiếm gỗ đào thất tinh [HƯ CẤU]
**Loại:** Bảo vật · ĐC · Long Hổ, Mao Sơn | **Mở khóa:** khoa nghi đầu tiên
Kiếm gỗ đào khắc bảy sao Bắc Đẩu — đạo cụ nghi lễ, **không có lưỡi, không dùng để đánh**. Gỗ lấy từ cây đào đã đổ (Mao Sơn có lệ không chặt cây sống). Trong game là đạo cụ cầm khi làm khoa nghi.

### LORE-309 · 三病爐 Lò Tam Bệnh [HƯ CẤU]
**Loại:** Bảo vật · KX · Võ Đang (Lò Đan) | **Mở khóa:** nghe Cát Huyền kể (HIS-028)
Lò ngoại đan cổ niêm phong bằng dây đồng; bia bên cạnh ghi tên ba người ngã bệnh và lời: «Đường tắt thường là đường vòng.» Đan Đỉnh giữ lò để **tự nhận lỗi trước thiên hạ**.

### LORE-310 · 金殿長明燈 Đèn Bất Diệt Kim Điện [HƯ CẤU]
**Loại:** Bảo vật · KX · Võ Đang | **Mở khóa:** đi bộ lên Kim Điện
Ngọn đèn dầu trong Kim Điện, đạo sĩ thay phiên giữ không cho tắt. Dầu đèn do các làng góp, như đồng đúc điện (HIS-056). Người giữ đèn nói: «Đèn không tự sáng mãi; có người thay dầu.»

### LORE-311 · 窩風橋金錢 Đồng tiền cầu Oa Phong [HƯ CẤU]
**Loại:** Bảo vật · KX · Chung Nam | **Mở khóa:** ném xu qua lỗ đồng tiền (mini-game nhỏ)
Đồng tiền đồng lớn treo dưới cầu, khách ném xu qua lỗ «đả kim tiền nhãn» — tục có thật ở Bạch Vân Quán, Huyền Giới mô phỏng. Đạo sĩ nhắc: «may nằm ở tay ném». Xu rơi xuống được gom làm quỹ trai đường.

### LORE-312 · 雲水葫蘆 Hồ lô vân thủy [HƯ CẤU]
**Loại:** Bảo vật · ĐC · Toàn Chân | **Mở khóa:** nhận việc vân thủy đầu tiên
Quả bầu khô đựng nước của đạo sĩ du phương; mỗi lần ở vân thủy đường một nơi thì được buộc thêm một sợi chỉ màu của nơi ấy. Người chơi nhận một chiếc; chỉ màu là nhật ký hành trình.

### LORE-313 · 醒迷鐘 Chuông Tỉnh Mê Mao Sơn [HƯ CẤU]
**Loại:** Bảo vật · KX · Mao Sơn | **Mở khóa:** đánh chuông ở Án Đường
Chuông đồng tiếng trầm, dùng để **đánh thức người đang hoảng** — nghe chuông người ta thở chậm lại. «Trừ tà là chữa tâm» (Mao Sơn Huyền Giới).

### LORE-314 · 照心鏡 Gương Chiếu Tâm [HƯ CẤU]
**Loại:** Bảo vật · KX · Mao Sơn | **Mở khóa:** đứng trước cửa Án Đường
Gương bát quái treo cửa Án Đường. Ai đứng trước gương chỉ thấy **chính mình**. «Gương không chiếu tà. Gương chiếu người đang sợ.» Đối lập với «Gương Trấn Sát» mà Định Mệnh Hội bán.

### LORE-315 · 松木念珠 Tràng hạt gỗ tùng Yên Tử [HƯ CẤU]
**Loại:** Bảo vật · TT · Yên Tử | **Mở khóa:** hành hương bằng chân lên Chùa Đồng
Tràng hạt khắc từ gỗ tùng đổ, mỗi hạt một vân gỗ khác. Thiền sư trao cho người hành hương lần đầu đi bộ hết đường — **không bán**.

### LORE-316 · 銅寺鐘 Chuông Chùa Đồng [HƯ CẤU]
**Loại:** Bảo vật · KX · Yên Tử | **Mở khóa:** đứng ở Chùa Đồng lúc mây tan
Chuông nhỏ trên đỉnh, chỉ đánh khi mây tan. Người dưới núi nghe tiếng chuông thì biết đỉnh đang quang.

### LORE-317 · 九品蓮花 Tháp Cửu Phẩm Liên Hoa Bút Tháp
**Loại:** Bảo vật · KX · Bút Tháp | **Mở khóa:** quay tháp lần đầu
Tòa tháp gỗ chín tầng quay quanh trục — có thật ở chùa Bút Tháp (Nhân Gian); bản Huyền Giới dựng thế kỷ XVII (HIS-063). Mỗi tầng một phẩm sen; tầng mở theo công đức (canon §7.6). «Phẩm sen do công tu, không do may rủi»; tầng sen của mỗi người đổi theo việc họ làm.

### LORE-318 · 盂蘭花燈 Đèn hoa đăng Vu Lan
**Loại:** Bảo vật · ĐC · Bút Tháp, Cùng Thông Hồ | **Mở khóa:** thả đèn lễ Vu Lan
Đèn bẹ chuối và giấy màu, làm ở Thôn Giếng (Bút Tháp) và Làng Sen (Cùng Thông). Thả đèn để nhớ ơn cha mẹ, người đã khuất. Trong game: mỗi người chơi được làm một đèn miễn phí; đèn trang trí đặc biệt có thể mua bằng Phúc Khí (không bằng Ngọc — tài liệu 11 duyệt).

### LORE-319 · 轉經輪 Bánh xe kinh Tuyết Vực
**Loại:** Bảo vật · ĐC · Tạng Địa (chờ tham vấn) | **Mở khóa:** đi hết vòng hành lang bánh xe kinh
Hành lang bánh xe kinh quanh điện chính; người đi theo chiều kim đồng hồ, tay quay từng bánh. Mô tả chi tiết chờ tham vấn.

### LORE-320 · 沙壇城 Mạn-đà-la cát
**Loại:** Bảo vật · ĐC · Tạng Địa (chờ tham vấn) | **Mở khóa:** hoàn thành và **tự tay xóa** một mạn-đà-la
Hình đồ bằng cát màu, làm tỉ mỉ nhiều ngày rồi xóa — bài học vô thường; phần thưởng trao **khi xóa**, không trao khi hoàn thành (canon §7.7).

### LORE-321 · 瑪尼石 Mani thạch
**Loại:** Bảo vật · ĐC · Tạng Địa | **Mở khóa:** đặt đá ở Đèo Cờ Gió
Đá khắc chữ, xếp thành chồng ven đèo. Trong game, người chơi đặt **đá trơn** (không khắc chú) — giữ quy tắc không tái hiện văn tự thiêng chưa tham vấn.

### LORE-322 · 進士碑 Bia Tiến sĩ Huyền Giới
**Loại:** Bảo vật · KX · Văn Miếu | **Mở khóa:** đỗ đình thí (khoa cử)
Bia đá trên lưng rùa, khắc tên người đỗ — tên hiển thị người chơi (đã lọc), cho cả máy chủ thấy (canon §7.8). Có một bia **chưa khắc tên** dành cho «người đỗ mà không cần đỗ» (05 › 5.2).

### LORE-323 · 奎文筆 Bút Khuê Văn [HƯ CẤU]
**Loại:** Bảo vật · TT · Văn Miếu | **Mở khóa:** khai bút đầu xuân ở Khuê Văn Các
Bút lông làng Bút, cán khắc bốn vòng tròn như bốn cửa sổ Khuê Văn Các. Viết chữ đầu năm bằng bút này là tục khai bút của giám sinh.

### LORE-324 · 孽鏡臺 Nghiệt Kính Đài
**Loại:** Bảo vật · KX · Phong Đô | **Mở khóa:** điện thứ nhất Phong Đô
Theo truyền thuyết, gương soi lại mọi việc làm của người. Bản Huyền Giới [HƯ CẤU]: mặt gương đá đen, người chơi thấy **danh sách việc mình đã làm trong game** (Sổ Công Quá + việc Tà Lộ nếu có) — giọng trung tính, không chấm điểm. «Gương không phán, gương chỉ nhắc.»

### LORE-325 · 生死簿 Sổ Sinh Tử
**Loại:** Bảo vật · KX · Phong Đô (truyền thuyết) | **Mở khóa:** gặp Phán quan Thôi
Truyền thuyết về cuốn sổ ghi thọ yểu của người đời. Bản Huyền Giới [HƯ CẤU]: Phán quan Thôi giữ một cuốn sổ **trắng** — «sổ thật thì người tự viết; ta chỉ giữ cuốn này để người ta nhớ rằng không có cuốn nào viết sẵn». Đối thoại then chốt chống định mệnh luận ở Hồi IV.

### LORE-326 · 孟婆湯 Canh Mạnh Bà
**Loại:** Bảo vật · ĐC · Vọng Hương Đài | **Mở khóa:** gặp «Mạnh Bà» (LORE-054)
Truyền thuyết bát canh quên. Bản Huyền Giới: bát canh gừng ấm của một bà cụ làng Cửa Núi. Lựa chọn «quên» hay «nhớ mà nhẹ lòng» chỉ đổi thoại về sau, **không xóa** tiến độ hay ký ức game của người chơi.

### LORE-327 · 銅鼓 Trống đồng Miêu Trại
**Loại:** Bảo vật · KX · Miêu Cương | **Mở khóa:** dự Năm Mới Miêu
Trống đồng gọi họp, đánh trong lễ; hoa văn mặt trống cần thiết kế theo tư liệu dân tộc học (05 › 5.4). Trống thiêng của trại, **không** đem ra mua bán.

### LORE-328 · 銀冠 Mũ bạc Miêu
**Loại:** Bảo vật · KX · Miêu Cương | **Mở khóa:** thiện cảm Quen với Miêu Trại
Mũ bạc nhiều tầng, đồ hồi môn truyền đời; khách chỉ được ngắm. Trang phục bạc **mới** làm ở Trại Bạc có thể vào Tàng Y Các sau khi duyệt văn hóa (tài liệu 11).

### LORE-329 · 引魂鈴 Chuông dẫn hồn (truyền thuyết)
**Loại:** Bảo vật · KX · Miêu Cương — quán trà | **Mở khóa:** nghe chuyện «cản thi» ở quán trà
Truyền thuyết về người dẫn người chết xa quê về quê bằng tiếng chuông. Game **chỉ kể** (canon §7.10); chuông trưng ở cầu phong vũ như vật kỷ niệm của «những người đã đưa người khác về nhà».

### LORE-330 · 五行藥匣 Hộp thuốc ngũ hành của A Mậu [HƯ CẤU]
**Loại:** Bảo vật · ĐC · Miêu Cương | **Mở khóa:** phụ giúp vu y một buổi
Hộp gỗ năm ngăn năm màu (xanh, đỏ, vàng, trắng, đen) đựng thảo dược theo hành (`tcm › WUX_ZANG`). Dùng trong mini-game phối món ăn dưỡng sinh theo hành Dụng; luôn kèm câu «không thay thầy thuốc» (RB1).

### LORE-331 · 魯班尺 Thước Lỗ Ban
**Loại:** Bảo vật · ĐC · Mộc Tượng Đường | **Mở khóa:** học nghề ở Phố Thợ
Thước dân gian có thật của thợ mộc, chia cung tốt xấu cho kích thước cửa, bàn thờ. Mộc Tượng Đường dùng thước như **quy ước nghề**; thợ già nói: «Thước đo cái cửa, không đo phúc nhà.»

### LORE-332 · 陰牌 Âm Bài [HƯ CẤU]
**Loại:** Bảo vật · CT · hang lò cổ | **Mở khóa:** bước vào Tà Lộ (`TL-xx`)
Thẻ gỗ đen của Định Mệnh Hội: ×2 Hậu Thiên trong 7 ngày kèm **Nợ Âm công khai** (canon §6). Mặt sau khắc nửa câu Bàn Minh. Khi Hồi Đầu ở Phong Đô, thẻ được đặt lên bàn trống ở Thiên Tử điện.

### LORE-333 · 定盤經 Định Bàn Kinh — văn bản lừa đảo [HƯ CẤU]
**Loại:** Bảo vật · CT · mọi chợ | **Mở khóa:** nhặt tờ rơi
Ngụy kinh của Định Mệnh Hội (01 › 1.4.4-c). Luôn hiển thị nhãn **«văn bản lừa đảo»**; soi bằng Kính Chiếu Gian thấy các câu vi phạm RB2, RB5.

### LORE-334 · 改命禮品 Lễ phẩm đổi mệnh — hàng lừa đảo [HƯ CẤU]
**Loại:** Bảo vật · CT · quầy Đổi Mệnh | **Mở khóa:** xem quầy lần đầu
Đèn «Nối Mệnh», la bàn «Trấn Sát», hình nhân «Thế Mệnh»… (06 › FAC-018). Hình nhân «Thế Mệnh» thật ra là đồ yểm của Công Thâu Nghiệt; Mộc Tượng Đường dạy người chơi gỡ ra và **đem tới phường hủy công khai** (không cần nghi lễ — «rác của kẻ lừa đảo»).

### LORE-335 · 照奸鏡 Kính Chiếu Gian [HƯ CẤU]
**Loại:** Bảo vật · ĐC (kỹ năng) · Sơn Môn | **Mở khóa:** nộp sổ Bát Gian Thuật cho Sơn Môn (HIS-097)
Chiếc kính nhỏ bằng đồng trắng Sơn Môn trao cho đệ tử. Khi đeo, câu thoại có dấu hiệu dẫn dắt (DP1–DP8) **sáng mờ**; người chơi phải gọi đúng tên mánh và đối chứng bằng chỉ số lá số thật. Kính không «tự phán» — giữ tinh thần «người đứng ở lõi tự đọc».

### LORE-336 · 天榜 Thiên Bảng [HƯ CẤU]
**Loại:** Bảo vật · KX · trước Chính Đường Sơn Môn | **Mở khóa:** có lá số
Bảng xếp hạng **tiềm lực ban đầu và tiềm lực đã cải** (canon §7.12). Lore: Hội Đồng Tam Tài dựng bảng sau Bàn nứt để chứng minh **người tiềm lực thấp vẫn lên được** (hệ số Nghịch Thiên). Bảng chỉ ghi phần «đã cải» nổi bật hơn phần «ban đầu».

### LORE-337 · 鶴令 Hạc lệnh [HƯ CẤU]
**Loại:** Bảo vật · ĐC · Hạc Dịch | **Mở khóa:** đến trạm hạc mới lần đầu
Thẻ trúc khắc hình hạc, mỗi trạm một khắc; đủ khắc thì hạc bay tới trạm đó. Hạc Dịch không bán thẻ — chỉ khắc khi người chơi **đã đi bộ tới** (canon §7.0).

### LORE-338 · 雲舟 Đò mây [HƯ CẤU]
**Loại:** Bảo vật · ĐC · rìa đại lục | **Mở khóa:** đi qua Vân Hải lần đầu (nối các thánh địa nhô ra biển mây)
Thuyền đáy phẳng có buồm vải mỏng, trôi trên biển mây nhờ gió tầng thấp; Hội Đò vận hành. Không thể đi khi Vân Hải Triều dâng (đông).

### LORE-339 · 草燈 Đèn tranh Am Vân Cốc [HƯ CẤU]
**Loại:** Bảo vật · KX · Am Vân Cốc | **Mở khóa:** ngồi với Vân Cốc một đêm giờ Hợi
Ngọn đèn dầu bấc cỏ trong am. Đêm Bàn nứt, Vân Cốc lấy thân che cho đèn không tắt (05 › 5.6). «Đèn nhỏ thì dễ che.»

### LORE-340 · 金繕裂盞 Chén rạn hàn vàng và bánh nứt dán vàng [HƯ CẤU]
**Loại:** Bảo vật · TT · Huyền Thành, Am Vân Cốc | **Mở khóa:** ăn bánh nứt dán vàng ở chợ + uống trà bằng chén rạn ở am
Hai hình ảnh cùng một ý: chén trà của Vân Cốc bị rạn được hàn lại bằng sơn vàng; bà bán bánh ở chợ bẻ đôi bánh Bàn rồi gắn mật. Câu cửa miệng «nứt rồi thì dán, có sao đâu». Đây là **mô-típ thị giác** cho cảnh kết: Thiên Mệnh Bàn lành lại với một đường vàng (01 › 1.4.2).

---

## B. Địa danh (LORE-341 → LORE-399)

### Trung tâm

### LORE-341 · 玄城 Huyền Thành
**Loại:** Địa danh · `thanh` | **Mở khóa:** cổng Nam, đọc Bia Hương Ước
Thành giữa đại lục, mọc từ chợ dưới chân đồi treo Bàn. Hương ước đầu: «Dưới Bàn không ai làm vua.» (HIS-018) Khoảng mười hai nghìn dân; hai bến đò trên Huyền Hà.

### LORE-342 · 玄觀山門 Huyền Quán Sơn Môn
**Loại:** Địa danh · Huyền Thành | **Mở khóa:** cảnh nhập môn
Nơi các thầy Tử Bình đọc mệnh cho thiên hạ từ thời Sơ Tổ; Bàn Đài, Bàn Thầy, hòn đá Sơ Tổ (ngồi ba hơi thở không nghĩ gì sẽ «nghe Bàn quay»). Cổng từng đóng ba tháng sau Bàn nứt (HIS-091).

### LORE-343 · 三清正殿 Chính Điện Tam Thanh
**Loại:** Địa danh · Huyền Thành (`ROOMS › chinhdien`) | **Mở khóa:** vào điện
Điện thờ Tam Thanh (LORE-001–003); Thầy Giải Quẻ ngồi bên trái điện. Trần vẽ cảnh thanh trọc phân.

### LORE-344 · 運命閣 Vận Mệnh Các
**Loại:** Địa danh · Sơn Môn (`ROOMS › vanmenh`) | **Mở khóa:** bước vào (web)
Hành lang dài với bia tổng quan và chín cổng đại vận — mỗi cổng là một thập kỷ đời thật của người chơi. Lore: «Hành lang của những người đã đi qua đây và tự viết tiếp.»

### LORE-345 · 太歲殿 Thái Tuế Điện (xem LORE-278)
**Loại:** Địa danh · Sơn Môn | **Mở khóa:** như LORE-278
Mục codex địa danh trỏ về mục khái niệm LORE-278 (không lặp nội dung).

### LORE-346 · 合婚案 Bàn Hợp Hôn
**Loại:** Địa danh · Huyền Thành (−48, 8) | **Mở khóa:** dùng Bàn Hợp Hôn lần đầu
Bàn đá dưới gốc đa quảng trường, nơi các đôi so lá số. Câu khắc mép bàn [HƯ CẤU]: «Hợp hay không là cách hai người đi cùng, không phải hai tờ giấy.»

### LORE-347 · 天盤島 Thiên Bàn Đảo
**Loại:** Địa danh · trên không (0, 300, cao 520 m) | **Mở khóa:** ngự kiếm lên đảo
Bệ đá nổi nơi Bàn được đặt tạm khi hạ xuống (HIS-013); mặt đá còn vết tròn. Hạc bay vòng quanh vào đêm trăng.

### LORE-348 · 玄河 Sông Huyền Hà
**Loại:** Địa danh · sông | **Mở khóa:** đi đò lần đầu
Từ Mẫu Trì (Trích Thiên Đỉnh) vòng phía Tây Huyền Thành, đổ vào Cùng Thông Hồ. Chuyện ông lái đò không lấy tiền ngày rằm (03 › 3.1).

### Tám vùng lõi

### LORE-349 · 子平峰 Tử Bình Phong
**Loại:** Địa danh · `tubinh` | **Mở khóa:** lên hết Thập Can Đạo
Núi granit Tây Bắc mang tên phép Tử Bình (HIS-043). Vách Tây có **bảy lá số không ai định được** khắc trên đá — người Dị Cách được mời lên xem.

### LORE-350 · 老君殿 Lão Quân Điện
**Loại:** Địa danh · Tử Bình Phong (`ROOMS › laoquan`) | **Mở khóa:** vào điện
Điện thờ Thái Thượng Lão Quân dựng cạnh Sảnh Cách Cục — «lấy Đạo làm gốc của Số». Vía Lão Quân rằm tháng Hai.

### LORE-351 · 盲派谷 Manh Phái Cốc
**Loại:** Địa danh · `manh` | **Mở khóa:** đi qua Nhĩ Môn bằng lan can dây
Thung lũng thầy mù; suối Thính Âm mỗi thác một tiếng. Chuyện thầy mù và Khổng tiên sinh cùng đoán một lá số: «người được xem chỉ nhớ lời thầy mù — vì ông ấy hỏi tôi muốn sống thế nào».

### LORE-352 · 滴天頂 Trích Thiên Đỉnh
**Loại:** Địa danh · `trichthien` | **Mở khóa:** lên Đài Quan Tinh ban đêm
Núi vòm Tây Nam, đầu nguồn Huyền Hà, nơi xem sao tốt nhất; mang tên *Trích Thiên Tủy*.

### LORE-353 · 斗姆殿 Đẩu Mẫu Điện
**Loại:** Địa danh · Trích Thiên Đỉnh (`ROOMS › daumau`) | **Mở khóa:** vào điện
Điện thờ Đẩu Mẫu (LORE-006); bảy đèn thất tinh trên sân không tắt đêm Bàn nứt.

### LORE-354 · 窮通湖 Cùng Thông Hồ
**Loại:** Địa danh · `cungthong` | **Mở khóa:** tới đảo Hàn Noãn
Hồ trũng Đông Nam; tên lấy ý «cùng tắc biến, biến tắc thông»; kênh của trăm người (HIS-019). Đảo Hàn Noãn nửa suối ấm nửa suối lạnh.

### LORE-355 · 書樓林 Thư Lâu Lâm
**Loại:** Địa danh · `thulau` | **Mở khóa:** vào Thư Lâu
Rừng thông phương Bắc, gác sách đầu tiên của Huyền Giới; tầng không có cầu thang dành cho «sách chưa tới».

### LORE-356 · 文昌閣 Văn Xương Các
**Loại:** Địa danh · Thư Lâu Lâm (`ROOMS › vanxuong`) | **Mở khóa:** vào gác
Gác thờ Văn Xương Đế Quân; thư sinh cầu học, thủ thư nhắc «cầu học thì chép sách trả».

### LORE-357 · 風水園 Phong Thủy Viên
**Loại:** Địa danh · `phongthuy` | **Mở khóa:** đứng giữa vườn la bàn đá
Vườn thực nghiệm địa lý — la bàn đá, mương đo nước, cây đo gió; La Bàn Tổ ở giữa.

### LORE-358 · 曆堂 Lịch Đường
**Loại:** Địa danh · `lichduong` | **Mở khóa:** xem Khuê Biểu
Nha lịch phía Đông, đón nắng sớm nhất; quầy Đổi Mệnh đầu tiên mọc ở chợ Đông (HIS-078).

### Sáu thánh địa phía Đông và Nam

### LORE-359 · 龍虎山天師府 Long Hổ Sơn · Thiên Sư Phủ
**Loại:** Địa danh · `longho` | **Mở khóa:** qua phủ môn
Phủ đệ bên sông Lô Khê giữa vách đá đỏ; tường trắng mã đầu. Hai khối đá hình hổ và rồng ở cửa sông.

### LORE-360 · 瀘溪懸棺 Lô Khê và vách huyền quan
**Loại:** Địa danh · Long Hổ | **Mở khóa:** đi bè Lô Khê
Sông xanh uốn quanh khối đá đỏ; trên vách cao có hốc táng treo của cư dân cổ — **di tích được tôn trọng**, không leo, không lấy vật. «Người xưa muốn gần trời.»

### LORE-361 · 武當玄嶽 Võ Đang Huyền Nhạc
**Loại:** Địa danh · `vodang` | **Mở khóa:** qua Huyền Nhạc môn
Bảy mươi hai đỉnh đá vôi trên biển mây; thần đạo nối các cung; tường đỏ son, ngói lưu ly xanh.

### LORE-362 · 南巖宮 Nam Nham cung
**Loại:** Địa danh · Võ Đang | **Mở khóa:** đi hết hành lang treo vách
Cung treo trên vách đá, hành lang bám núi; tĩnh thất ẩn tu; *Định Quan Kinh* được đọc ở đây.

### LORE-363 · 金殿 Kim Điện
**Loại:** Địa danh · đỉnh Võ Đang | **Mở khóa:** đi bộ lên lần đầu
Điện đồng của trăm làng (HIS-056); bảng đồng liệt tên làng góp; tường đá của những người đã đi hết đường.

### LORE-364 · 重陽宮 Trùng Dương cung (Chung Nam)
**Loại:** Địa danh · `chungnam` | **Mở khóa:** ăn chay một bữa ở trai đường
Tùng lâm nhiều lớp sân trong thung lũng tuyết; Thất Chân điện với bảy bồ đoàn đá; vân thủy đường.

### LORE-365 · 窩風橋 Cầu Oa Phong
**Loại:** Địa danh · Chung Nam | **Mở khóa:** qua cầu
Cầu đá trước sơn môn, «tránh gió»; dưới cầu treo đồng tiền lớn (LORE-311).

### LORE-366 · 九霄萬福宮 Cửu Tiêu Vạn Phúc Cung
**Loại:** Địa danh · `maoshan` | **Mở khóa:** vào sân cung
Cung trên đỉnh đồi trúc, sân lệch tầng, hành lang có mái; Án Đường ở sân dưới.

### LORE-367 · 老子銅像 Tượng Lão Tử đồng
**Loại:** Địa danh · Mao Sơn | **Mở khóa:** nhìn thấy từ xa (trong bán kính 400 m)
Tượng đồng lộ thiên trên đỉnh phụ — có nguyên mẫu ở Mao Sơn Nhân Gian; điểm định hướng cho người đi rừng trúc.

### LORE-368 · 安子香道 Đường hành hương Yên Tử
**Loại:** Địa danh · `yentu` | **Mở khóa:** bước lên bậc đầu tiên sau suối
Đường đá rêu dưới tùng cổ thụ, qua các chùa lên Chùa Đồng; dốc «Ông ơi đợi con».

### LORE-369 · 解冤溪 Suối Giải Oan
**Loại:** Địa danh · Yên Tử | **Mở khóa:** rửa tay ở suối
Người hành hương rửa tay, tượng trưng buông oán. Chuyện người mang oán lên núi rồi quên mất mình định oán ai.

### LORE-370 · 慧光塔園 Vườn tháp Huệ Quang
**Loại:** Địa danh · Yên Tử | **Mở khóa:** ngồi trước một tháp nghe gió tùng
Tháp đá ong của các vị trụ trì, mỗi tháp một câu công án (HIS-052); ba tháp thấp tưởng niệm Trúc Lâm tam tổ.

### LORE-371 · 銅寺 Chùa Đồng
**Loại:** Địa danh · đỉnh Yên Tử | **Mở khóa:** tới đỉnh
Chùa đồng nhỏ trong mây — «không mất, chỉ bị che».

### LORE-372 · 筆塔寺 Chùa Bút Tháp
**Loại:** Địa danh · `buttap` | **Mở khóa:** qua tam quan
Chùa «nội công ngoại quốc» giữa đồng lúa; tháp Cửu phẩm, tượng Quán Âm nghìn mắt nghìn tay; Nhà Tạm Trú sau chùa.

### LORE-373 · 筆塔石橋 Cầu đá Bút Tháp
**Loại:** Địa danh · Bút Tháp | **Mở khóa:** qua cầu
Cầu đá lan can chạm nối thượng điện với tòa Cửu phẩm (nguyên mẫu có thật); đàn cò đậu ngọn đa gần cầu ngày rằm.

### Sáu thánh địa phía Tây, cực Nam, trên trời

### LORE-374 · 藏地雪域 Tạng Địa Tuyết Vực
**Loại:** Địa danh · `tangdia` (chờ tham vấn) | **Mở khóa:** qua Đèo Cờ Gió
Cao nguyên tuyết, hồ ngọc lam đổi màu trong ngày; tu viện bám sườn núi.

### LORE-375 · 轉經廊 Hành lang bánh xe kinh
**Loại:** Địa danh · Tạng Địa (chờ tham vấn) | **Mở khóa:** đi hết vòng
Hành lang bao quanh điện chính, đi theo chiều kim đồng hồ.

### LORE-376 · 文廟國子監 Văn Miếu Quốc Tử Giám
**Loại:** Địa danh · `vanmieu` | **Mở khóa:** qua Văn Miếu môn
Năm lớp sân theo trục, cực Nam đại lục; học không phân sang hèn (HIS-044).

### LORE-377 · 奎文閣 Khuê Văn Các
**Loại:** Địa danh · Văn Miếu | **Mở khóa:** đứng dưới gác
Gác bốn cửa sổ tròn tượng trưng sao Khuê tỏa sáng — nguyên mẫu có thật ở Văn Miếu Hà Nội. Đêm thi thắp đèn trong gác.

### LORE-378 · 天光井 Thiên Quang Tỉnh
**Loại:** Địa danh · Văn Miếu | **Mở khóa:** soi mặt xuống giếng
Giếng vuông giữa hai dãy bia — «trời tròn soi xuống đất vuông»; sĩ tử soi mình trước khi thi.

### LORE-379 · 酆都鬼城 Phong Đô Quỷ Thành
**Loại:** Địa danh · `phongdo` | **Mở khóa:** tới làng Cửa Núi
Hang núi bên sông đen, đường một chiều xuống dốc; nơi soi xét đạo đức, không phải nơi kinh dị.

### LORE-380 · 鬼門關 Quỷ Môn Quan
**Loại:** Địa danh · Phong Đô | **Mở khóa:** đứng trước cửa (có việc thiện hoặc trên Tà Lộ)
Cửa đá tự nhiên phát hiện thời Hồng Mông (HIS-020); Âm Dương Giới Bi (HIS-034); tượng Hắc Bạch Vô Thường mặt hiền cầm đèn.

### LORE-381 · 黃泉路 Đường Hoàng Tuyền
**Loại:** Địa danh · Phong Đô | **Mở khóa:** đi qua
Đường dốc hai bên hoa bỉ ngạn đỏ (có độc — không hái). Nến làng Cửa Núi soi đủ thấy chân mình.

### LORE-382 · 奈何橋 Cầu Nại Hà
**Loại:** Địa danh · Phong Đô | **Mở khóa:** qua cầu
Ba nhịp thiện, bình, ác — **dẫn về cùng một bờ**. «Cầu chỉ hỏi con đã làm gì, không chặn con đi tiếp.» Tượng Ngưu Đầu Mã Diện quay lưng vào cầu, canh cho người qua.

### LORE-383 · 望鄉臺 Vọng Hương Đài
**Loại:** Địa danh · Phong Đô | **Mở khóa:** lên đài
Đài nhìn về quê — trong game nhìn về Huyền Thành và Bàn nứt; «Mạnh Bà» bán canh gừng.

### LORE-384 · 地藏殿 Điện Địa Tạng (đáy Phong Đô)
**Loại:** Địa danh · Phong Đô | **Mở khóa:** tới đáy
Điện cuối cùng; lối ra duy nhất bắt đầu từ đây và đi lên. Địa Tạng sứ giả chờ ở cửa.

### LORE-385 · 苗疆古寨 Miêu Cương Cổ Trại
**Loại:** Địa danh · `mieucuong` | **Mở khóa:** uống chén nước chặn cửa
Năm trại người Miêu ven sông xanh giữa núi đá vôi; cột cổng làm từ mạn bè Sơ Dân — «bè của mẹ ông bà» (HIS-010).

### LORE-386 · 風雨橋 Cầu phong vũ
**Loại:** Địa danh · Miêu Cương | **Mở khóa:** ngồi nghe hát đối trên cầu
Cầu có mái nhiều tầng tháp, trung tâm của trại; vải sáp ong vẽ chuyện Mẹ Bướm treo dọc cầu.

### LORE-387 · 鼓樓 Trống lâu
**Loại:** Địa danh · Miêu Cương | **Mở khóa:** dự một buổi họp trại
Tháp trống nhiều tầng mái toản tiêm; nơi treo trống đồng gọi họp.

### LORE-388 · 古爐洞 Hang lò cổ
**Loại:** Địa danh · **ngoài** ranh giới Miêu Cương | **Mở khóa:** cốt truyện (Hồi III–IV) hoặc Tà Lộ
Hang lò bỏ hoang từ thời Sơ Dân, đá dễ sập; người Miêu tránh. Định Mệnh Hội lén họp từ năm 2004 (HIS-077). Cửa vào Tà Lộ (Âm Bài). Codex ghi rõ: «Hang không thuộc trại nào.»

### LORE-389 · 崑崙天池 Côn Lôn Thiên Trì
**Loại:** Địa danh · `conlon` | **Mở khóa:** Quy nhất — qua Cầu Mây
Đảo trời tổ sơn; hồ soi trời; chín bồ đoàn đá trống của các Trì Thủ.

### LORE-390 · 瑤池 Dao Trì
**Loại:** Địa danh · Côn Lôn | **Mở khóa:** vĩ thanh
Hồ ngọc trên đỉnh, nơi Thiên Mệnh Bàn được hoàn nguyên (canon §7.11); đào tiên quanh hồ.

### LORE-391 · 雲谷庵 Am Vân Cốc
**Loại:** Địa danh · `vancoc` | **Mở khóa:** lên Hậu Sơn
Am tranh trên vách đá sau Sơn Môn; nơi duy nhất không có quầy Đổi Mệnh; nơi nhận Sổ Công Quá.

### Địa danh khái niệm và địa danh nhỏ

### LORE-392 · 雲海 Vân Hải
**Loại:** Địa danh · biển mây | **Mở khóa:** đứng ở mép đất lần đầu
Biển mây quanh đại lục (`CLOUD_SEA`), «Hồng Mông còn sót». Vân Hải Triều dâng mùa đông che vai các thánh địa thấp; đò mây đi qua.

### LORE-393 · 燈路 Đăng Lộ
**Loại:** Địa danh · bầu trời | **Mở khóa:** ngắm trời đêm không trăng từ Thiên Bàn Đảo
Dải sáng mờ chạy Đông sang Tây; giáo pháp và khách lạc theo đó tới Huyền Giới (02 › 2.2.0). Người chơi đến theo Đăng Lộ.

### LORE-394 · 三大幹龍 Ba đại cán long
**Loại:** Địa danh · long mạch | **Mở khóa:** xem sa bàn đất nung ở Phong Thủy Viên
Tây cán, Trung cán, Đông cán từ Côn Lôn xuống (01 › 1.1.3).

### LORE-395 · 洞天福地 Động thiên, phúc địa của Huyền Giới
**Loại:** Địa danh · khái niệm | **Mở khóa:** tìm 3 phúc địa nhỏ
Theo khung *Động Thiên Phúc Địa Nhạc Độc Danh Sơn Ký* (LORE-170), Thư Lâu đặt tên các «phúc địa» nhỏ — hang, suối, gốc cây cổ — làm điểm khám phá (POI tài liệu 07 cấp mã).

### LORE-396 · 十洲三島 Thập Châu Tam Đảo (truyền thuyết)
**Loại:** Địa danh · truyền thuyết | **Mở khóa:** đọc *Thập Châu Ký* ở tầng Truyện
Truyền thuyết về mười châu tiên trong biển (Tổ Châu, Doanh Châu…). Người Huyền Giới kể rằng các đảo trời trong Vân Hải là «châu tiên» — chưa ai tới.
▸ Ghi chú: nội dung mở rộng sau phát hành có thể dùng khung này.

### LORE-397 · 雲遊客棧 Quán trọ Du Phương
**Loại:** Địa danh · Phường Khách, Huyền Thành | **Mở khóa:** nghỉ một đêm
Nhà trọ cho khách lạc ghép đội (canon §7.12); ông bà Tư Chống Gậy hay ngồi bàn góc kể chuyện Tứ Bất Tử.

### LORE-398 · 傳道亭 Đình Truyền Đạo
**Loại:** Địa danh · Sơn Môn | **Mở khóa:** sau HIS-099 (lời thề Hội Đồng)
Đình tám cổng, mỗi cổng một sứ giả đạo thống đứng mời (canon §7.12).

### LORE-399 · 八運暗市 Chợ Bát Vận (chợ ngầm)
**Loại:** Địa danh · hang lò cổ, tầng ngoài | **Mở khóa:** cốt truyện Hồi III
Chợ ngầm của Định Mệnh Hội trong hang: bàn bán lễ phẩm, sổ ghi nợ «hạn», đèn lồng vàng. Khi Hội tan (tùy kết cục), nơi này thành **kho trả lại** — người bị lừa đến nhận lại đồ.

---

## Bảng tra nhanh codex IV

| Nhóm | Mã | Số mục |
|---|---|---|
| Bảo vật | LORE-301 → 340 | 40 |
| Địa danh trung tâm | LORE-341 → 348 | 8 |
| Địa danh tám vùng | LORE-349 → 358 | 10 |
| Địa danh 6 thánh địa Đông – Nam | LORE-359 → 373 | 15 |
| Địa danh 6 thánh địa Tây – Nam – trời | LORE-374 → 391 | 18 |
| Địa danh khái niệm, nhỏ | LORE-392 → 399 | 8 |
| **Tổng** | | **99** |
