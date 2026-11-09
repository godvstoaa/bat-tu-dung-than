# 05-16 · Ngân hàng đề kiểm tri các đạo thống

> Đề «kiểm tri» (05-06 §3.3) lấy từ đây. Mỗi đạo 30 câu; kỳ thi rút ngẫu nhiên 10 câu, xáo thứ tự phương án. Thiền không có kiểm tri (05-09 §B.6); Bàng môn không có thi.
> Cột **Nguồn** chỉ đúng trường dữ liệu app — khi engine đổi dữ liệu, câu tương ứng phải sửa theo (test so chuỗi nguồn).
> Mỗi câu có **1 đáp án đúng + 2 nhiễu**. Nhiễu không được là câu xúc phạm truyền thống khác (TT-8).

---

## 1. Chính Nhất (CN)

| # | Câu | Đúng | Nhiễu | Nguồn |
|---|---|---|---|---|
| 1 | Tổ sư Chính Nhất là ai? | Trương Đạo Lăng | Vương Trùng Dương · Đào Hoằng Cảnh | `zhengyi.founder` |
| 2 | Chính Nhất hình thành thời nào? | Đông Hán | Kim · Bắc Tống | `zhengyi.era` |
| 3 | Đạo tràng tổ đình Chính Nhất ở đâu? | Long Hổ Sơn | Chung Nam Sơn · Mao Sơn | `zhengyi.seat` |
| 4 | Chính Nhất có buộc xuất gia không? | không — đạo sĩ hỏa cư có gia đình | có, nghiêm như Toàn Chân · chỉ khi thụ lục cao | `zhengyi.monastic` |
| 5 | Điều gì quyết định loại phù đạo sĩ Chính Nhất được viết? | cấp bậc thụ lục | tuổi đạo sĩ · số năm ở phủ | `zhengyi.ordination` |
| 6 | Bốn tên bậc lục app nêu là gì? | đô công, minh uy, tam động, ngũ nhạc | sơ chân, trung cực, thiên tiên, đại động · quải đơn, quan cân, sơ chân, ngũ nhạc | `zhengyi.ordination` |
| 7 | Phù năm đoạn gồm? | đầu, thân, bụng, đảm, chân | đầu, cổ, thân, tay, chân · thiên, địa, nhân, quỷ, thần | `FU_MAOSHAN_XIE.structure` |
| 8 | Đoạn «đầu» phù biểu thị gì? | nguồn thần chỉ (Tam Thanh / sắc lệnh) | công năng trấn · phong lệnh kết thúc | `structure.head` |
| 9 | Chữ công năng như 鎮 / 收 / 殺 nằm ở đoạn nào? | thân | bụng · chân | `structure.body` |
| 10 | Đoạn nào là «trung khu sức mạnh» của phù? | đảm | đầu · bụng | `structure.core` |
| 11 | Bát quái, tinh tượng, bộ cương đặt ở đoạn nào? | bụng | đảm · chân | `structure.belly` |
| 12 | Theo app, tự vẽ phù không có truyền thừa thì sao? | bị coi là vô hiệu / phản tác dụng theo truyền thống | vẫn hiệu quả nếu thành tâm · hiệu quả gấp đôi | `remedies.remedy-fu.caveat` |
| 13 | Vật liệu truyền thống viết phù? | chu sa, giấy vàng, bút lông | mực đen, giấy trắng · máu gà, vải đỏ | `remedy-fu.items` |
| 14 | Bái Đẩu là lễ thờ gì? | Bắc Đẩu / Nam Đẩu | Tam Quan · Thái Tuế | `ritualsZhengYi.zhengyi-baidou` |
| 15 | Người tuổi Tý có bản mệnh tinh quân nào? | Tham Lang | Phá Quân · Văn Khúc | truyền thống Bắc Đẩu bản mệnh |
| 16 | Người tuổi Ngọ? | Phá Quân | Tham Lang · Cự Môn | như trên |
| 17 | Tuổi Mão và Dậu cùng bản mệnh nào? | Văn Khúc | Vũ Khúc · Lộc Tồn | như trên |
| 18 | Kinh đọc trong bái Đẩu theo app? | Bắc Đẩu Bản Mệnh Diên Sinh Chân Kinh | Độ Nhân Kinh · Kim Cang Kinh | `remedy-songjing.items` |
| 19 | Tổ Thần Tiêu là ai? | Vương Văn Khanh | Trương Bá Đoan · Hứa Tốn | `shenxiao.founder` |
| 20 | Thần Tiêu nổi tiếng với pháp gì? | ngũ lôi chính pháp | khoa nghi trai tiếu · chuyển kinh | `shenxiao.coreMethod` |
| 21 | Thần Tiêu được triều nào ủng hộ? | Bắc Tống (Huy Tông) | nhà Minh · nhà Đường | `shenxiao.region` |
| 22 | Nhà bị đường chiếu thẳng vào cửa là sát gì? | lộ xung (路冲) | thiên trảm · phản cung | `SHA_LIST.luchong` |
| 23 | Một cách hóa lộ xung app nêu? | bình phong hoặc cây xanh trước cửa | đập tường · chuyển nhà ngay | `luchong.cures` |
| 24 | Phù trong game có làm sát biến mất không? | không — phù để an lòng, phải làm cả việc thật | có · có nếu thụ lục cao | 05-07 §A.4.1 |
| 25 | Pháp khí nào **không** có trong danh mục app? | lưỡi hái đồng | đế chung · lệnh kỳ | `FA_FAQI` |
| 26 | Pháp ấn dùng khi nào theo truyền thống? | trong khoa nghi | để dọa người · bất cứ lúc nào | `FA_FAYIN` |
| 27 | Tam Nguyên gồm những ngày nào? | Rằm tháng Giêng, Rằm tháng Bảy, Rằm tháng Mười | mùng 1 tháng Giêng, Bảy, Mười · Rằm tháng Ba, Sáu, Chín | lịch lễ (05-06 §9) |
| 28 | Ai nên chủ trì nghi lễ phù ngoài đời theo app? | đạo sĩ đã thụ lục | bất kỳ ai học trên mạng · người lớn tuổi nhất nhà | `remedy-fu.caveat` |
| 29 | Giới thường trực đầu của người vào Chính Nhất trong game? | không kết phù cho việc hại người | không ăn thịt · không ra khỏi Long Hổ | 05-07 §A.3 |
| 30 | Khu vực Chính Nhất mạnh theo app (một ý)? | Giang Nam, Đài Loan, tín ngưỡng dân gian Việt Nam | Tây Bắc Trung Hoa · Tây Tạng | `zhengyi.region` |

## 2. Thanh Vi · Đan Đỉnh (TV)

| # | Câu | Đúng | Nhiễu | Nguồn |
|---|---|---|---|---|
| 1 | Khẩu quyết Thanh Vi về lôi pháp? | nội đan làm thể, phù chú làm dụng | phù chú làm thể, nội đan làm dụng · chỉ cần phù | `qingwei.coreMethod` |
| 2 | Đạo tràng Thanh Vi? | Vũ Đương Sơn | Long Hổ Sơn · Phong Đô | `qingwei.seat` |
| 3 | Đan Đỉnh còn được gọi là phái gì theo app? | «tu tiên phái» | «phù lục phái» · «trừ quỷ phái» | `danding.distinctive` |
| 4 | «以乾坤為鼎爐，以坎離為藥物» là cương lĩnh của sách nào? | Chu Dịch Tham Đồng Khế | Ngộ Chân Thiên · Bão Phác Tử | `DAN_CANTONG_QI` |
| 5 | Tác giả Tham Đồng Khế? | Ngụy Bá Dương | Cát Hồng · Trương Quân Phòng | `DAN_CANTONG_QI.meaning` |
| 6 | Tham Đồng Khế có bao nhiêu chương? | 35 | 81 · 122 | như trên |
| 7 | Bão Phác Tử nội thiên có bao nhiêu thiên? | 20 | 50 · 7 | `DAN_BAOPUZI` |
| 8 | Tác giả Bão Phác Tử? | Cát Hồng (Đông Tấn) | Lão Tử · Trương Bá Đoan | như trên |
| 9 | Ngộ Chân Thiên truyền khẩu quyết bằng gì? | thơ từ | sơ đồ · bia đá | `DAN_WUZHENPIAN` |
| 10 | Trương Bá Đoan là tổ phái nội đan nào? | Nam Tông | Bắc Tông · Toàn Chân | như trên |
| 11 | Hai sách được gọi «đan kinh song bích»? | Tham Đồng Khế và Ngộ Chân Thiên | Đạo Đức Kinh và Nam Hoa Kinh · Bão Phác Tử và Vân Tất Thất Thiêm | `DAN_WUZHENPIAN.meaning` |
| 12 | Vân Tất Thất Thiêm có bao nhiêu quyển? | 122 | 33 · 20 | `DAN_YUNJI_QIQIAN` |
| 13 | Vân Tất Thất Thiêm được gọi là gì? | «Đạo giáo tiểu bách khoa» | «vua đan kinh» · «kinh trừ tà» | như trên |
| 14 | «導氣令和, 引體令柔» nói về? | Đạo Dẫn | Tịch Cốc · Thổ Nạp | `GONG_DAOYIN` |
| 15 | Ngũ Cầm Hí gắn với ai? | Hoa Đà | Trương Tam Phong · Lữ Động Tân | như trên |
| 16 | Mã Vương Đôi Đạo Dẫn Đồ có bao nhiêu tư thế? | 44 | 12 · 108 | như trên |
| 17 | «吐故納新» là gì? | thổ cũ nạp mới — thổ nạp | dẫn khí cho hòa · tồn tưởng ngũ tạng | `GONG_TUNA` |
| 18 | Ghi chép «hành khí» sớm nhất khắc trên gì? | ngọc (Hành Khí Ngọc Minh, Chiến Quốc) | đồng · gỗ đào | như trên |
| 19 | Hoàng Đình Kinh nói về thần nào trong tồn tưởng? | thần ngũ tạng | thần Bắc Đẩu · thần tài | `GONG_CUNXIANG` |
| 20 | App khuyên gì về tịch cốc? | không tự nhịn — nguy y tế | nên thử 3 ngày · tốt cho người khỏe | `GONG_BIGU.use` |
| 21 | Bốn bậc nội đan theo app (bậc đầu)? | luyện tinh hóa khí | luyện hư hợp đạo · trúc cơ | `DAO_JIA[1]` |
| 22 | Bậc cuối của nội đan? | luyện hư hợp đạo | luyện thần hoàn hư · kết đan | như trên |
| 23 | App nói cách tu nội đan đúng là gì? | tu dần, cần chân truyền, đừng tự luyện bừa | tự học theo sách là đủ · luyện càng nhanh càng tốt | `DAO_JIA[1].method` |
| 24 | Thủ nhất / phục khí / thổ nạp: app gợi ý thời lượng tọa? | 15–30 phút | 3 giờ · cả đêm | `DAO_JIA[2].method` |
| 25 | Ngoại đan xưa nguy hiểm vì sao? | dùng khoáng chất độc (chu sa, thủy ngân) | đắt tiền · khó tìm lò | 05-07 §B.4.3 |
| 26 | Khi đan đạo chuyển hướng, «lò» trong nội đan là gì? | thân người | lò đồng · núi | `danding.coreMethod` (nội đan) |
| 27 | Đan Đỉnh tôn ai làm tổ (một trong)? | Đông Hoa Đế Quân / Lữ Động Tân | Trần Tĩnh Cô · Vương Văn Khanh | `danding.deity` |
| 28 | Thanh Vi thờ thần hệ nào? | lôi bộ (cửu thần, ngũ lôi) | Tam Mao chân quân · tam nãi | `qingwei.deity` |
| 29 | Trong game, mini-game thở có phải bài tập thở không? | không — chỉ là nhịp trò chơi | có · có nếu chơi mức 3 | 05-07 TV-G1 |
| 30 | Giới thường trực 2 của Thanh Vi? | không nhịn ăn để tu | không xuống núi · không gặp người lạ | 05-07 §B.3 |

## 3. Toàn Chân · Linh Bảo (TC)

| # | Câu | Đúng | Nhiễu | Nguồn |
|---|---|---|---|---|
| 1 | Tổ Toàn Chân? | Vương Trùng Dương | Trương Đạo Lăng · Cát Huyền | `quanzhen.founder` |
| 2 | Năm sinh – mất Vương Trùng Dương? | 1113–1170 | 34–156 · 1083–1153 | như trên |
| 3 | Đại tông Toàn Chân ở đâu? | Bạch Vân Quán (Bắc Kinh) | Thiên Sư Phủ · Cửu Tiêu Vạn Phúc Cung | `quanzhen.seat` |
| 4 | «Nam ___, Bắc Toàn Chân»? | Chính Nhất | Linh Bảo · Thượng Thanh | `quanzhen.region` |
| 5 | Toàn Chân chủ trương hợp nhất mấy giáo? | ba (Đạo, Nho, Phật) | hai · năm | `quanzhen.canon` |
| 6 | Văn bản lập giáo của Trùng Dương? | Trùng Dương lập giáo thập ngũ luận | Độ Nhân Kinh · Mao Sơn Chí | như trên |
| 7 | Toàn Chân xuất gia hay cư sĩ? | xuất gia nghiêm | cư sĩ · tùy ý | `quanzhen.monastic` |
| 8 | Ba đàn giới Toàn Chân? | Sơ Chân, Trung Cực, Thiên Tiên | Đô Công, Minh Uy, Đại Động · Sổ, Tùy, Chỉ | `quanzhen.ordination` |
| 9 | «Mặt trận thần chú» của Toàn Chân là gì? | công khóa sớm tối | trai tiếu · thư phù | `quanzhen.distinctive` |
| 10 | Thần chú đứng đầu công khóa? | Tịnh Tâm | Kim Quang · Huyền Uẩn | `ZHOU_JING_XIN.school` |
| 11 | Thần chú thứ hai? | Tịnh Khẩu | Tịnh Thân · An Thổ Địa | `ZHOU_JING_KOU` |
| 12 | Chú khai kinh là? | Huyền Uẩn | Chúc Hương · Tịnh Thiên Địa | `ZHOU_XUANYUN` |
| 13 | Kim Quang chú là chú thứ mấy trong tám? | thứ bảy | thứ nhất · thứ tư | `ZHOU_JIN_GUANG.school` |
| 14 | Thanh Tĩnh Kinh dài khoảng bao nhiêu chữ? | khoảng 400 | khoảng 5.000 · khoảng 20.000 | `DAN_QINGJING_JING.meaning` |
| 15 | Theo Thanh Tĩnh Kinh, tâm tịnh thì …? | thần cư → khí tụ → tinh sinh | khí tán · thần đi | như trên |
| 16 | «心者，一身之主» trong kinh nào? | Nội Quan Kinh | Độ Nhân Kinh · Lăng Nghiêm | `DAN_NEIGUAN_JING` |
| 17 | Linh Bảo được gọi là phái gì? | khoa nghi phái | phù lục phái · trừ quỷ phái | `lingbao.distinctive` |
| 18 | Kinh cốt lõi Linh Bảo? | Độ Nhân Kinh | Tham Đồng Khế · Bắc Đẩu Kinh | `lingbao.canon` |
| 19 | Ai tập đại thành khoa nghi Linh Bảo? | Lục Tu Tĩnh | Hứa Tốn · Trương Quân Phòng | `lingbao.founder` |
| 20 | «Trai tiếu» là gì? | pháp sự cứu tế, độ vong, tạ thần | nhịn ăn · luyện đan | `lingbao.coreMethod` |
| 21 | «Tam động» của Đạo Tạng gồm? | Động Chân, Động Huyền, Động Thần | Thái Huyền, Thái Bình, Thái Thanh · Chính Nhất, Tục, Ngoại | `DAOZANG.bu` |
| 22 | «Tứ phụ» gồm? | Thái Huyền, Thái Bình, Thái Thanh, Chính Nhất | Động Chân, Động Huyền, Động Thần, Tục · Ngoại, Bút ký, Tiểu thuyết, Phương thuật | như trên |
| 23 | Đạo Đức Kinh thuộc bộ nào trong dữ liệu app? | Thái Huyền | Động Thần · Chính Nhất | `DAOZANG[Đạo Đức Kinh].bu` |
| 24 | Khi một quyển ghi sai số Đạo Tạng, app làm gì? | sửa theo bảng hiệu đính | xóa quyển · giữ nguyên | `_DZ_FIX` |
| 25 | Trường nào cho biết độ chắc chắn văn bản? | `textual_certainty` | `bu` · `era` | `DAOZANG` |
| 26 | Một quyển cần tối thiểu bao nhiêu nguồn độc lập để vào dữ liệu? | 2 | 1 · 5 | `DAOZANG` (filter `sources.length ≥ 2`) |
| 27 | «Quải đơn» nghĩa là gì? | ở trọ đạo quán | đội khăn · thụ đại giới | 05-08 §A.2 |
| 28 | Vân du trong game đòi đi bộ qua mấy thánh địa? | 5 | 3 · 9 | 05-08 §A.4.4 |
| 29 | Giới thường trực 1 của Toàn Chân? | chay và không rượu | không nói · không ra khỏi quán | 05-08 §A.3 |
| 30 | Ngũ Tổ Toàn Chân có tên nào? | Lữ Động Tân (Thuần Dương) | Trương Đạo Lăng · Đào Hoằng Cảnh | `quanzhen.deity` |

## 4. Thượng Thanh · Lư Sơn (TT)

| # | Câu | Đúng | Nhiễu | Nguồn |
|---|---|---|---|---|
| 1 | Mao Sơn thuộc phái nào? | Thượng Thanh | Chính Nhất · Toàn Chân | `maoshan.vi` |
| 2 | Ai tập đại thành Mao Sơn? | Đào Hoằng Cảnh | Vương Trùng Dương · Cát Hồng | `maoshan.founder` |
| 3 | Mao Sơn Chí có bao nhiêu quyển? | 33 | 122 · 20 | `maoshan.sources` (DZ0304) |
| 4 | Mao Sơn ở đâu? | Cú Dung, Giang Tô | Giang Tây · Hồ Bắc | `maoshan.seat` |
| 5 | Phù Mao Sơn có mấy đoạn? | năm | ba · bảy | `maoshan.distinctive` |
| 6 | «存思» là gì? | tập trung tưởng thần trong thân | đọc kinh to · nhịn ăn | `GONG_CUNXIANG` |
| 7 | Tổ Lư Sơn (một trong)? | Hứa Tốn / Trần Tĩnh Cô | Trương Đạo Lăng · Vương Văn Khanh | `lushan.founder` |
| 8 | Trần Tĩnh Cô còn gọi là? | Lâm Thủy phu nhân | Đẩu Mẫu · Bích Hà | `lushan.sources` |
| 9 | Lư Sơn nổi tiếng với pháp gì? | thu kinh, cứu sản hộ thai | trai tiếu · lôi pháp | `lushan.coreMethod` |
| 10 | «Hồng đầu pháp sư» thuộc hệ nào? | Lư Sơn tam nãi | Toàn Chân · Linh Bảo | `lushan.coreMethod` |
| 11 | Lư Sơn lan tới đâu (một ý)? | Phúc Kiến, Đài Loan, Việt Nam | Tây Tạng · Mông Cổ | `lushan.region` |
| 12 | Bước đầu tiên khi có người kể «việc lạ»? | nghe trọn | làm lễ ngay · viết phù | 05-13 §2 |
| 13 | Câu nào bị cấm theo `ETHICS`? | «Bạn bị ma / bị vong theo» | «Theo cổ pháp, có thể…» · «Mình tìm xem nguyên nhân» | `ETHICS.forbiddenAbsoluteClaims` |
| 14 | Khi người kể mất ngủ kéo dài, nghe tiếng thì thầm, làm gì? | chuyển tới thầy thuốc / chuyên gia | trừ tà ngay · bảo họ tụng kinh là đủ | `ETHICS.referralNote` |
| 15 | Bước nào có trong tịnh trạch theo app? | mở cửa sổ, thông khí | khóa kín cửa · đốt giấy trong phòng kín | `remedy-jingzhai.steps` |
| 16 | Tịnh trạch có thay vệ sinh / y tế không? | không | có · có nếu làm đúng ngày | `remedy-jingzhai.caveat` |
| 17 | Chỉ báo «Hoa Cái + Thái Âm» theo app nghĩa là? | tượng hướng nội, hợp tôn giáo — không phải «bị ma» | chắc chắn bị âm khí · sẽ gặp tai nạn | `indicators.huagai-taiyin.meaning` |
| 18 | «嬰靈» trong app được ghi chú thế nào? | phát triển dân gian hiện đại Đài Loan, không phải kinh điển | kinh điển Phật giáo · Đạo Tạng cổ | `spiritTypes.yingling.modernityFlag` |
| 19 | «野鬼» là? | vong không người thờ cúng | tổ tiên nhà mình · tinh quái | `spiritTypes.yegui` |
| 20 | Theo 崆峒問答, «tinh» là gì? | vật có tính linh | người chết oan · thần chính | `spiritTypes.yaoxie-jingguai` |
| 21 | Tính năng âm tà của app bật thế nào? | người dùng tự bật (opt-in) | tự bật cho mọi người · theo tuổi | `ETHICS.optInRequired` |
| 22 | Điểm «tượng âm tà» của lá số là gì? | tổng symbolic, không phải chẩn đoán | độ bị ma · xác suất gặp ma | `analyzeAmTa` (note) |
| 23 | Nghi lễ trừ tà ngoài đời nên do ai chủ trì? | đạo sĩ / pháp sư thụ chức | người xem nhiều video · người lạ trên mạng | `ETHICS.referralNote` |
| 24 | Vật đeo hộ thân: app khuyên? | tránh mua vì sợ bị dọa | mua càng nhiều càng tốt · đeo cả đời | `remedy-peishi.caveat` |
| 25 | «步罡踏斗» là gì? | bộ cương theo sao (Vũ bộ) | phù năm đoạn · nhịn ăn | `FA_GANGBU` |
| 26 | Mao Tiểu Tùng nói đa phần «có ma» là gì? | người mệt, mất ngủ, buồn | quỷ thật · yêu tinh | 05-08 §B.9 |
| 27 | Giới thường trực 2 của Thượng Thanh? | không nhận lễ vật khi giúp việc lạ | không ra khỏi Mao Sơn · không ăn chay | 05-08 §B.4 |
| 28 | Thu kinh trong game làm gì trước? | hỏi cha mẹ đã cho trẻ đi khám chưa (nếu sốt / đau) | gọi hồn ngay · rắc gạo khắp nhà | 05-08 §B.5.3 |
| 29 | Kim Quang chú gắn với ý gì? | ánh sáng hộ thân | sát quỷ · khai kinh | `ZHOU_JIN_GUANG` |
| 30 | Tháng 7 âm có làm án «việc lạ» khác nguyên nhân không? | không — số án tăng, nguyên nhân thật như mọi tháng | có, toàn là ma · có, toàn lừa đảo | 05-13 §5.1 |

## 5. Bắc Đế · Động Uyên (BD)

| # | Câu | Đúng | Nhiễu | Nguồn |
|---|---|---|---|---|
| 1 | Bắc Đế phái được gọi là gì? | trừ quỷ phái | phù lục phái · khoa nghi phái | `beidi.distinctive` |
| 2 | Nguyên soái chính của Bắc Đế? | Thiên Bồng | Thiên Cương · Linh Quan | `beidi.coreMethod` |
| 3 | Bắc Đế còn là danh xưng của? | Tử Vi (Bắc cực) | Thái Thượng Lão Quân · Ngọc Hoàng | `beidi.deity` |
| 4 | Kinh của Bắc Đế phái (DZ1412)? | Bắc Đế Phục Ma Thần Chú Diệu Kinh | Độ Nhân Kinh · Thanh Tĩnh Kinh | `beidi.canon` |
| 5 | Phong Đô trong app tượng trưng cho? | «âm ty» | thiên đình · long cung | `beidi.seat` |
| 6 | Bắc Đế thịnh thời nào? | Đường – Tống | Đông Hán · Minh | `beidi.era` |
| 7 | Động Uyên nổi tiếng với gì? | chuyển kinh cứu tế | ngũ lôi · tồn tư | `dongyuan.coreMethod` |
| 8 | Thái Thượng Động Uyên Thần Chú Kinh có bao nhiêu quyển? | 20 | 33 · 122 | `dongyuan.canon` |
| 9 | App ghi cờ gì cho Động Uyên? | không phải một chú duy nhất mà nhiều phẩm — chưa chắc văn bản | chú mạnh nhất · bị cấm | `dongyuan.distinctive` |
| 10 | Kinh theo việc cho «nghiệp chướng nặng / tổ tiên»? | Địa Tạng | Dược Sư · Phổ Môn | `JING_ZHOU[1]` |
| 11 | Địa Tạng chiêm sát sám dùng gì? | bánh xe gỗ để biết nghiệp rồi sám tương ứng | đốt sớ · gieo quẻ đồng xu | `CHAN_HUI[3]` |
| 12 | Trong game, bánh xe Lễ Soi Sổ dừng theo gì? | thanh nghiệp cao nhất từ lựa chọn thật | ngẫu nhiên · lá số | 05-05 §4.4 |
| 13 | Phán quan đọc sổ gì? | Sổ Công Quá của chính người đến | sổ sinh tử · lá số | canon §6.2 |
| 14 | `meritLedger` khi `net ≥ 10` nói gì? | «★ Tích đức tốt — đang chuyển quỹ đạo» | «Cân bằng» · «Quá nặng hơn công» | `meritLedger.verdict` |
| 15 | Khi `net < 0`? | «⚠ Quá nặng hơn công — CẢI QUÁ» | «Tích tiểu thiện» · «Cân bằng» | như trên |
| 16 | Lễ Trung Nguyên rơi vào ngày nào? | Rằm tháng Bảy | Rằm tháng Giêng · Rằm tháng Mười | lịch lễ |
| 17 | Trung Nguyên là ngày của quan nào? | Địa quan xá tội | Thiên quan tứ phúc · Thủy quan giải ách | canon §10 |
| 18 | Vía Địa Tạng? | 30/7 âm | 15/2 · 8/4 | 05-06 §9 |
| 19 | Giải oan trong game kết thúc bằng gì? | sự thật được nói ra, người có lỗi được mời sửa | trừng phạt kẻ có tội · lễ trừ tà | 05-09 §A.4.3 |
| 20 | Giới thường trực 1 của Bắc Đế? | không dọa người bằng địa ngục, quả báo | không xuống Phong Đô · không thắp đèn | 05-09 §A.3 |
| 21 | Có được xem sổ người khác khi họ không cho? | không | có, nếu hạng V · có, nếu là sư phụ | 05-09 BD-G5 |
| 22 | Oán linh theo app là gì? | người chết oan, oán khí chưa tan | tổ tiên được thờ · thai nhi | `spiritTypes.hengwang-yuanling` |
| 23 | Ai dẫn người ra khỏi Phong Đô? | Địa Tạng sứ giả | Phán quan · Lỗ Ban | canon §4 |
| 24 | «Thập Vương» trong game được trình bày thế nào? | thẻ văn hóa về công lý sau khi chết, không hình phạt | màn chơi địa ngục · vật phẩm | 05-09 BD-G1 |
| 25 | Câu «天作孽犹可违，自作孽不可活» xuất xứ? | Thượng Thư · Thái Giáp | Đạo Đức Kinh · Liễu Phàm Tứ Huấn | `REMEDY_QUOTES[4]` |
| 26 | Phán quan nói thêm vế gì? | tự làm thì tự sửa được | tự làm thì phải chịu mãi · trời làm thì sửa được | 05-12 §6.2 |
| 27 | Đèn phố Phong Đô có bao nhiêu cột? | 108 | 36 · 72 | 05-09 §A.4.1 |
| 28 | Người đang có Nợ Âm có nhập môn Bắc Đế được không? | không — vào Phong Đô theo chuỗi Hồi Đầu | được · được nếu cảnh giới 5 | 05-06 §2.2 |
| 29 | «叩齒36通» là gì theo app? | gõ răng 36 lần (một thực hành truyền thống) | 36 lạy · 36 câu chú | `beidi.coreMethod` |
| 30 | Bắc cực tứ thánh gồm ai (một)? | Thiên Bồng / Thiên Du / Dực Thánh | Tam Mao · tam nãi | `beidi.deity` |

## 6. Tịnh Độ · sám hối (TD)

| # | Câu | Đúng | Nhiễu | Nguồn |
|---|---|---|---|---|
| 1 | Sám hối gồm ba phần nào? | phát lộ, hối cải, hồi hướng | lạy, tụng, đốt · ăn chay, phóng sinh, bố thí | `CHANHUI_PRINCIPLE` |
| 2 | Tổng sám chung, công khóa hằng ngày? | 88 Phật Đại Sám Hối Văn | 35 Phật · Đại Bi Sám | `CHAN_HUI[0]` |
| 3 | Biệt sám từng nghiệp cụ thể? | 35 Phật | 88 Phật · Pháp Hoa | `CHAN_HUI[2]` |
| 4 | Pháp app gọi «xóa nghiệp mau nhất» (Mật)? | Kim Cang Tát Đỏa Bách Tự Minh | Lăng Nghiêm · Địa Tạng | `CHAN_HUI[1]` |
| 5 | Đại Bi Sám thuộc hệ nào? | Quán Âm | Địa Tạng · Dược Sư | `CHAN_HUI[4]` |
| 6 | Kinh cho «bệnh, tai nạn, đoản mệnh»? | Dược Sư | Kim Cang · Phổ Môn | `JING_ZHOU[0]` |
| 7 | Dược Sư Phật có bao nhiêu đại nguyện? | 12 | 48 · 10 | `JING_ZHOU[0].cure` |
| 8 | Kinh cho «chấp trước, cầu trí tuệ»? | Kim Cang | Địa Tạng · Lăng Nghiêm | `JING_ZHOU[2]` |
| 9 | Kinh cho «tai nạn cấp khó»? | Phổ Môn phẩm | Tâm Kinh · Dược Sư | `JING_ZHOU[3]` |
| 10 | Kinh cho «ma chướng»? | Lăng Nghiêm chú | Phổ Môn · Kim Cang | `JING_ZHOU[4]` |
| 11 | Mười hạnh Liễu Phàm có hạnh nào? | Cứu người nguy cấp | Thắng người khác · Giữ của | `TEN_THIEN` |
| 12 | «爱惜物命» nghĩa là? | yêu tiếc mạng vật | kính trọng bậc trên · xả của làm phúc | `TEN_THIEN[9]` |
| 13 | «成人之美»? | giúp người hoàn thành việc tốt | khuyên người làm thiện · cùng người làm thiện | `TEN_THIEN[2]` |
| 14 | Phóng sinh trong app được bao nhiêu công? | 3 | 1 · 2 | `CONG_QUA.thien[0]` |
| 15 | Ăn chay một ngày được bao nhiêu công? | 1 | 2 · 3 | `CONG_QUA.thien` |
| 16 | Theo app, phóng sinh loài ngoại lai thì sao? | hiện đại phản đối — hại sinh thái | được khuyến khích · không sao | `remedy-fangsheng.caveat` |
| 17 | Giải nghiệp trộm cắp: làm gì trước khi bố thí? | trả nợ trước | bố thí trước · không cần trả | `YEGUO[1].cure` «先还欠再施» |
| 18 | Giải nghiệp sân: tu quán gì? | từ tâm quán (thân → trung → oán) | bất tịnh quán · vô thường quán | `YEGUO[8].cure` |
| 19 | Khi giận khởi, giới «không sân» dạy làm gì trước? | dừng ba hơi thở | nói ngay · bỏ đi | `YEGUO[8].cure` «怒起先停三息» |
| 20 | Giải nghiệp ác khẩu: tu gì? | nhẫn nhục — bị mắng không mắng lại | im lặng mãi · tránh mọi người | `YEGUO[5].cure` |
| 21 | Giải nghiệp ỷ ngữ: thay chuyện phiếm bằng gì? | tụng kinh trì chú | ngủ · làm việc | `YEGUO[6].cure` |
| 22 | Lục Đạo trong app là gì? | góc nhìn khuynh hướng tu học, đồng bộ dân gian | tiên đoán nẻo tái sinh · giáo lý chính thống | `computeLiuDao.disclaimer` |
| 23 | Nghiệp nhân cõi Ngạ Quỷ theo app? | keo kiệt, không chịu bố thí | sân hận · ngu si | `SIX_REALMS['饿鬼道'].karmaCause` |
| 24 | Pháp đối trị khuynh hướng tham? | tu bố thí, buông tham | tu thiền định · tu nhẫn nhục | `SIX_REALMS['饿鬼道'].remedy` |
| 25 | Cõi tốt nhất để tu theo app? | cõi Người | cõi Trời · cõi A-tu-la | `SIX_REALMS['人道'].nature` |
| 26 | Cửu phẩm trong game là gì? | biểu tượng tiến độ tu, không phải lời hứa vãng sinh | phần thưởng đời sau · thứ hạng trên Thiên Bảng | 05-10 §A.2 |
| 27 | Bố thí trong game có thể dùng Ngọc không? | không | có · có nếu là VIP | 05-04 §6 |
| 28 | Sám có thay được việc sửa sai không? | không | có · có nếu lạy đủ 88 | 05-05 NG-2 |
| 29 | Mục Kiền Liên gắn với lễ nào? | Vu Lan | Phật đản · Thượng Nguyên | 05-10 CQ-TD-15 |
| 30 | Chùa Bút Tháp nổi tiếng với tượng nào? | Quan Âm nghìn mắt nghìn tay | Di Lặc · Phật nằm | canon §3 (nguyên mẫu) |

## 7. Mật · Chuẩn Đề (MT — lớp Chuẩn Đề)

| # | Câu | Đúng | Nhiễu | Nguồn |
|---|---|---|---|---|
| 1 | Ai truyền Chuẩn Đề pháp môn cho Liễu Phàm? | Vân Cốc thiền sư | Khổng tiên sinh · Trương Thiên Sư | `ZHUNTI.principle` |
| 2 | Chuẩn Đề còn gọi là? | Phật mẫu bảy câu-chi | Phật Dược Sư · Bồ Tát Địa Tạng | `ZHUNTI.principle` |
| 3 | Ý «转世欲为道用»? | không bỏ đời thường mà chuyển hóa nó | bỏ đời để tu · chỉ tu trong chùa | như trên |
| 4 | Pháp môn gồm mấy việc? | 4 | 3 · 7 | `ZHUNTI.how` |
| 5 | Việc thứ hai là gì? | công quá cách (sổ công quá) | phóng sinh · ăn chay | như trên |
| 6 | Việc cuối? | hồi hướng | thụ giới · lên núi | như trên |
| 7 | Số biến mỗi ngày app nêu? | 21 / 108 / 1.000 | 7 / 49 / 100 · 3 / 9 / 81 | `ZHUNTI.mantra` |
| 8 | Pháp hợp với ai? | người đời, không cần xuất gia | chỉ tăng ni · chỉ người già | `ZHUNTI.fit` |
| 9 | Liễu Phàm tích bao nhiêu công thì có con? | 3.000 | 6.000 · 10.000 | `LIAOFAN_STORY.story` |
| 10 | 6.000 công thì? | đỗ tiến sĩ | có con · sống thọ | như trên |
| 11 | Liễu Phàm sống tới bao nhiêu tuổi? | 74 | 53 · 35 | như trên |
| 12 | Khổng tiên sinh đoán Liễu Phàm mất năm bao nhiêu tuổi? | 53 | 74 · 60 | như trên |
| 13 | Tên con Liễu Phàm? | Nguyên Khang | Văn Trinh · Hồng Ân | như trên |
| 14 | `REMEDY_METHODS` gọi Chuẩn Đề pháp môn là gì? | «Liễu Phàm thật method» | «pháp trừ tà» · «pháp tài lộc nhanh» | `REMEDY_METHODS[0].benefit` |
| 15 | Kinh theo việc cho «nghèo / phúc mỏng»? | Chuẩn Đề + tài tôn pháp | Địa Tạng · Kim Cang | `JING_ZHOU[5]` |
| 16 | «舍财得财» nghĩa là? | cho đi của thì được của — nghịch lý bố thí | giữ của thì giàu · buôn bán mới giàu | `JING_ZHOU[5].method` |
| 17 | Trì chú trong game có tăng Phúc Khí không? | không | có · có nếu 1.000 biến | 05-10 MT-G3 |
| 18 | Theo `spiritual-fs`, niệm Chuẩn Đề hợp người Dụng hành gì? | Thủy | Hỏa · Kim | `WX_PRACTICES.水.chanting` |
| 19 | Vì sao cát hoa sen phải gạt đi? | để thấy vô thường | để lấy cát mới · để chấm điểm | 05-10 §B.4.2 |
| 20 | Tạng truyền trong game ở trạng thái nào? | chờ tham vấn | đã hoàn tất · bị bỏ | canon §3 |
| 21 | Liễu Phàm có bỏ quan đi tu không? | không | có · có sau 3.000 công | 05-10 CQ-MT-01 |
| 22 | Đổi số biến cố định thì sao? | chuỗi ngày thường hành về 0, không trừ gì khác | mất hạng · mất Đạo Hạnh | 05-10 §B.4.1 |
| 23 | Giới thường trực 1 của Mật? | không trì chú để cầu hại người | không ăn thịt · không nói chuyện | 05-10 §B.3 |
| 24 | Chú Chuẩn Đề hiện ở đâu trong game? | chỉ trên thẻ đọc | trong mini-game · trên bảng tên | 05-10 MT-G2 |
| 25 | Kim Cang Tát Đỏa sám dùng khi nào theo app? | sau khi vi phạm giới | khi muốn giàu · khi đi xa | `CHAN_HUI[1].use` |
| 26 | Số biến Bách Tự Minh app nêu? | 21–108 | 1.000–10.000 · 3–7 | `CHAN_HUI[1].method` |
| 27 | Hồi hướng là gì? | chuyển phần lành của việc mình làm tới người khác | đòi lại phúc · đổi điểm | `ZHUNTI.how` |
| 28 | Pháp Môn Liễu Phàm có chiếm suất đạo thống không? | không | có · có khi lên bậc 3 | 05-06 ST-2 |
| 29 | Theo app, mệnh là gì? | quỹ đạo hiện tại, không phải kết cục | kết cục đã định · con số may rủi | `LIAOFAN_STORY.lesson` |
| 30 | Chuỗi gốc của app? | tâm → niệm → hành → nghiệp → mệnh | mệnh → nghiệp → tâm · số → vận → mệnh | `LIAOFAN_STORY.rootChain` |

## 8. Nho · Tịnh Minh (NH)

| # | Câu | Đúng | Nhiễu | Nguồn |
|---|---|---|---|---|
| 1 | Bốn thiên Liễu Phàm Tứ Huấn theo thứ tự? | lập mệnh → cải quá → tích thiện → khiêm đức | tích thiện → lập mệnh → khiêm đức → cải quá · cải quá → khiêm đức → lập mệnh → tích thiện | `LIAOFAN.principle` |
| 2 | Pháp app gọi là «duy nhất thật sự nghịch thiên»? | tích âm đức | phong thủy · đổi tên | `LIAOFAN.coreMethod` |
| 3 | «命由我作，福自己求» nghĩa? | mệnh do ta tạo, phúc do ta cầu | mệnh do trời, phúc do đất · số đã định | `REMEDY_QUOTES[0]` |
| 4 | «祸福无门，惟人自召» xuất xứ? | Thái Thượng Cảm Ứng Thiên | Luận Ngữ · Kim Cang | `REMEDY_QUOTES[1]` |
| 5 | «满招损，谦受益» xuất xứ? | Thượng Thư | Đạo Đức Kinh · Tâm Kinh | `REMEDY_QUOTES[3]` |
| 6 | «人之有志，如樹之有根» trong thiên nào? | Khiêm đức | Lập mệnh · Cải quá | `LIAOFAN.quote` |
| 7 | Tổ Tịnh Minh? | Hứa Tốn | Vương Trùng Dương · Trương Bá Đoan | `jingming.founder` |
| 8 | Tịnh Minh lấy gì làm gốc? | trung hiếu | phù lục · nội đan | `jingming.coreMethod` |
| 9 | Kinh Tịnh Minh? | Tịnh Minh Trung Hiếu Toàn Thư | Độ Nhân Kinh · Mao Sơn Chí | `jingming.canon` |
| 10 | Tịnh Minh là cư sĩ hay xuất gia? | cư sĩ nặng, tu tại gia | xuất gia nghiêm · chỉ đạo sĩ | `jingming.monastic` |
| 11 | Đạo tràng Tịnh Minh? | Tây Sơn Vạn Thọ (Nam Xương) | Long Hổ Sơn · Bạch Vân Quán | `jingming.seat` |
| 12 | Đức của hành Mộc theo `spiritual-fs`? | nhân | lễ · nghĩa | `WX_PRACTICES.木.virtue` |
| 13 | Đức của hành Thổ? | tín | trí · nhân | `WX_PRACTICES.土.virtue` |
| 14 | Đức của hành Kim? | nghĩa | tín · lễ | `WX_PRACTICES.金.virtue` |
| 15 | Đức của hành Thủy? | trí | nghĩa · nhân | `WX_PRACTICES.水.virtue` |
| 16 | Đức của hành Hỏa? | lễ | trí · tín | `WX_PRACTICES.火.virtue` |
| 17 | Hiếu thuận cha mẹ trong `CONG_QUA` được bao nhiêu công? | 2 | 1 · 3 | `CONG_QUA.thien` |
| 18 | Không hiếu thuận bị ghi bao nhiêu quá? | −2 | −1 · −3 | `CONG_QUA.ac` |
| 19 | `REMEDY_METHODS` nói hiếu đạo bổ gì? | bổ Ấn (Ấn = mẹ) | bổ Tài · bổ Quan | `REMEDY_METHODS[3]` |
| 20 | Ngũ cách của tên gồm? | thiên, nhân, địa, ngoại, tổng | kim, mộc, thủy, hỏa, thổ · đầu, thân, bụng, đảm, chân | `naming › fiveGrid` |
| 21 | Bảng số lý tên trong app có bao nhiêu số? | 81 | 64 · 108 | `naming › STROKES_81` |
| 22 | Game có khuyên đổi tên khai sinh không? | không — chỉ đặt đạo hiệu / bút danh trong game | có · có nếu tên mang Kỵ | 05-02 §4.2 |
| 23 | Thương Quan kiến Quan: app dùng gì hóa? | Ấn | Tỷ Kiếp · Thực Thần | `SPECIFIC_REMEDY['傷官見官']` |
| 24 | Kiêu Đoạt Thực: dùng gì chế? | Thiên Tài | Ấn · Quan | `SPECIFIC_REMEDY['梟神奪食']` |
| 25 | Quần Kiếp Tranh Tài: dùng gì chế Kiếp? | Quan Sát | Thực Thương · Ấn | `SPECIFIC_REMEDY['群劫爭財']` |
| 26 | Khiêm đức theo `twelveLaws` là pháp thứ mấy? | ⑫ | ① · ⑩ | `buildRemedy.twelveLaws` |
| 27 | «Tú tài hạng 14» là lời đoán cho ai? | Liễu Phàm | Chu Văn An · Nguyễn Trãi | `LIAOFAN_STORY.story` |
| 28 | Thi Hương vòng 2 trong game là gì? | giải một án lá số khách | viết thơ · đọc thuộc lòng | 05-11 §A.2.1 |
| 29 | Bảng vàng niêm yết bằng gì? | bút danh | tên tài khoản · ngày sinh | 05-11 §A.2.1 |
| 30 | Ba câu tự tỉnh dựa theo ai? | Tăng Tử («吾日三省吾身») | Mạnh Tử · Tuân Tử | 05-11 §A.4.2 |
