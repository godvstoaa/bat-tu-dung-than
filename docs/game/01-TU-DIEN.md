# 01 · Từ điển thuật ngữ

> **Trạng thái:** `[ĐÃ CÓ]`
> **Bộ phận chủ trì:** Nội dung (đồng giữ: Thiết kế game)
> **Nguồn sự thật trong mã:** chuỗi hiển thị trong `src/game/features.js › TEXT`, tên trong các bảng ở [A3](phu-luc/A3-so-lieu.md), [A5](phu-luc/A5-dia-diem.md)
> **Test:** không có; kiểm bằng V10 của manifest
> **Thay thế:** `docs/gdd/01-tam-nhin/09`–`11`, `22` (phần còn đúng); các bảng «tên gọi» rải trong `GAME-SINH-TON-KINH-TE-DAC-TA`
> **Kiểm với mã ngày:** 2026-11-16

## 1.1 Mục đích và phạm vi

Mỗi khái niệm của game có **một** tên. Cột «Tránh» liệt kê tên cũ hoặc tên dễ nhầm; chúng chỉ được xuất hiện ở chương này, chương 02, chương 90 và nhật ký. Không gồm thuật ngữ Bát Tự chuyên sâu (thuộc engine của app).

## 1.2 Cách viết

- Tên riêng viết hoa từng chữ: Phúc Khí, Âm Đức, Sổ Mệnh. Trích dẫn dùng «…».
- Chữ Hán luôn kèm Hán Việt ở lần đầu: «格局 Cách cục». Trong bong bóng thoại không để chữ Hán trần.
- Tiền ghi theo đơn vị lớn nhất có nghĩa, tối đa hai bậc: «1 lượng bạc 440 đồng».
- Hành viết bằng chữ Việt trong lời (Mộc, Hỏa, Thổ, Kim, Thủy); mã dùng chữ Hán (木 火 土 金 水).

## 1.3 Game và thế giới

| Tên chuẩn | Định nghĩa | Tránh |
|---|---|---|
| **Huyền Quán Online** | Tên game. Bản iOS mang tên «Học Quán» | Huyền Giới (tên của bản tầm nhìn L4) |
| **Huyền Thành** | Thành phố của game, hình bát giác, bố cục theo Hậu Thiên Bát Quái | Bát Quái Thành, Thành Bát Quái (chỉ là tên bố cục) |
| **Sơn Môn** (Huyền Quán Sơn Môn) | Khu quán ở tâm thành, 120 × 132 m, nơi người mới xuất hiện | sân quán, Trung Cung (chỉ dùng khi nói bố cục) |
| **Nội Thành · Trung Thành · Ngoại Thành** | Ba vành của Huyền Thành, ranh ở trung đoạn 380, 1.050 và 2.125 m | vành phủ (tên bố cục cũ của v3) |
| **Cung** | Một trong tám hướng bát quái của thành: Ly, Khôn, Đoài, Càn, Khảm, Cấn, Chấn, Tốn | quận, khu vực |
| **Bát Môn** | Tên tám cổng theo cung: Cảnh, Tử, Kinh, Khai, Hưu, Sinh, Thương, Đỗ | — |
| **Phường** | Nhóm khoảng 3 × 3 ô phố cùng cung, có tên, có quảng trường | khu phố |
| **Ô · Lô** | Ô: khối phố khoảng 120 × 80 m. Lô: một thửa nhà trong ô | block |
| **Sảnh nghề** | Tám nơi học và giải án theo từng phép: Trạch Nhật, Dương Trạch, Điều Hậu, Thư Lâu, Hợp Hôn, Tử Vi, Tượng Pháp, Cách Cục | sảnh trọng điểm, tông môn |
| **Gian** | Một điểm chức năng trong Sơn Môn: Bàn Thầy, Trà Thất, La Bàn Đài, Ống Xăm, Lư Hương, Bảng Lịch, Hồ Sen, Tàng Y Các | trạm (là tên kỹ thuật, xem §1.9) |
| **Điện** | Không gian thờ vào được: Chính Điện Tam Thanh, Văn Xương Các, Đẩu Mẫu Điện, Lão Quân Điện, Vận Mệnh Các, Thái Tuế Điện | đền |
| **Miếu** | Miếu phường, mỗi miếu một vị thần và một nghi thức riêng | — |
| **Cửu Trọng Thiên** | Chín đảo trời mang chín tiên phủ mua được, lên bằng Thiên Thê | thiên đình |
| **Quận Thiên Bàn** | Chín đảo bay ở độ cao 460 m phía trên Sơn Môn, lên bằng Vân Thang | Thiên Bàn Đảo (chỉ là đảo chủ) |
| **Huyền Hà · Cùng Thông Hồ** | Sông chính và hồ của thế giới | — |
| **Dải phòng** | Vùng ngoài bản đồ phía Đông chứa nội thất điện, phòng tiệm, nhà riêng, Thiên Lao, Khoáng Sơn | interior |

## 1.4 Mệnh và nhân vật

| Tên chuẩn | Định nghĩa | Tránh |
|---|---|---|
| **Lá số** | Bốn trụ can chi do engine lập từ ngày giờ sinh | chart (chỉ dùng trong mã) |
| **Dụng thần · Hỷ thần · Kỵ thần** | Hành cần nhất, hành trợ Dụng thần, hành gây hại. Mã: `yong.primary`, `yong.xi` (có nơi `accent`), `yong.ji` | dụng thần chính, phụ |
| **Hợp mệnh** | Trạng thái một thứ (bộ áo, nghề, nhà) trùng hành Dụng thần | hợp tuổi |
| **Phẩm phục** | Áo nhân vật; màu vải theo Dụng thần, đai theo Hỷ thần | skin |
| **Tàng Y Các** | Nơi mua và đổi phẩm phục, phụ kiện, hiệu ứng | shop thời trang |
| **Gia trì** | Hiệu ứng ngũ hành quanh nhân vật, mở theo cấp | buff hình ảnh |
| **Ngự vật** | Vật cưỡi để bay: kiếm, mây, hồ lô, đài sen, hạc, cánh ngũ hành | mount |
| **Cấp** | Số tính từ Phúc Khí tích lũy cả đời | level |
| **Cảnh giới** | Bảy bậc tu luyện theo dải cấp, phải đột phá mới sang bậc | cảnh giới 6 bậc (bản tầm nhìn), danh hiệu |
| **Danh hiệu** | Tên gọi theo mốc Phúc Khí tích lũy, hiện trên bảng tên | — |
| **Lá số hư cấu** | Lá số Âm phủ cấp cho kiếp mới; không phải ngày sinh thật | — |

## 1.5 Tài nguyên

| Tên chuẩn | Định nghĩa | Tránh |
|---|---|---|
| **Xu · Hào · Đồng · Lượng bạc · Lượng vàng** | Tiền kim loại. 1 hào = 10 xu; 1 đồng = 100 xu; 1 lượng bạc = 1.000 đồng; 1 lượng vàng = 10 lượng bạc. Lưu bằng xu | **văn**, Văn, tiền Văn |
| **Ví** | Tiền mang theo người, lưu trên máy | — |
| **Tiền gửi** | Tiền ở Tiền Trang; không bị móc túi, vẫn tính thuế | ngân hàng |
| **Ví chợ** | Tiền người chơi đã gửi lên máy chủ để giao dịch với người khác, có trần gửi mỗi ngày | ví máy chủ |
| **Phúc Khí** | Điểm Huyền học hiển lộ: kiếm từ giải án và lễ bái, tiêu để học pháp môn và giải hạn. **Không phải tiền** | Phúc Khí theo nghĩa tiền mua sắm; Đạo Hạnh |
| **Phúc Khí tích lũy** | Tổng Phúc Khí từng kiếm, không giảm khi tiêu; quyết định cấp. Mã: `state.xp` | kinh nghiệm |
| **Âm Đức** | Phúc đức tích ngầm; chỉ hiện theo năm mức | công đức, Sổ Công Quá (bản tầm nhìn) |
| **Nghiệp Lực** | Nợ nhân quả; chỉ hiện theo năm mức | nghiệp, Nợ Âm |
| **Vận khí** | Bốn cấp trợ lực nhỏ theo chuỗi ngày điều độ | điểm danh |
| **Vận số ngày** | Con số mỗi ngày quyết định sự kiện lành, dữ | may mắn |
| **Ngọc** | Tiền trả phí; chỉ có từ nạp | kim cương |
| **No · Tỉnh · Khí huyết** | Ba chỉ số sinh tồn 0–100: bụng, tinh thần, sức khoẻ | đói, năng lượng, máu, HP |
| **Thể lực** | Thanh dùng khi chạy, bơi, leo, lượn; trần phụ thuộc Tỉnh | stamina |

## 1.6 Đời sống và kinh tế

| Tên chuẩn | Định nghĩa | Tránh |
|---|---|---|
| **Nghề** | Một trong 31 việc làm, mỗi nghề thuộc một hành | job |
| **Chỗ làm** | Một suất làm việc có hạn ở một tiệm, máy chủ giữ | slot |
| **Ca** | Một đợt làm tối đa 8 việc trong 30 phút | shift |
| **Bậc tay nghề** | Học việc → Thợ → Thợ cả → Quản sự | rank |
| **Uy tín** | Điểm lý lịch nghề 0–100 | danh tiếng (dành cho quán) |
| **Nhiệm vụ mệnh** | Việc chỉ hiện với người đúng Dụng thần, đúng giờ, đúng chỗ | quest |
| **Tiệm** | Cửa hàng NPC. Trên phố có 15 loại; bảng `items.SHOP_TYPES` có thêm loại thứ 16 là Tiệm May Tàng Y | shop, quán (dành cho hàng ăn) |
| **Mặt bằng** | Chỗ kinh doanh người chơi thuê hoặc mua: quầy lề đường, quán cơm, tửu lâu thượng hạng | venue |
| **Thương hội** | NPC mồi khởi động kinh tế: bán nguyên liệu giá cao, thu thành phẩm giá thấp, có hạn mức | NPC thu mua |
| **Chợ ký gửi** | Nơi người chơi đặt hàng bán cho nhau qua máy chủ | sàn giao dịch |
| **Két giữ** | Tiền máy chủ tạm giữ 24 giờ trước khi giải ngân | escrow |
| **Độ tươi** | Phần trăm còn tươi của thực phẩm, giảm theo giờ thật | hạn dùng |
| **Thực căn** | Năng khiếu bếp 0–1 tính từ lá số | — |
| **Ấn ký** | Dấu người nấu trên món từ công thức bí truyền | — |
| **Tiểu Xá · Nhà Phố · Tứ Hợp Viện · Biệt Thự · Biệt Phủ · Tiên Phủ** | Sáu hạng nhà mua được | Biệt Viện (đã bỏ) |
| **Chỉ số nhà `h`** | Số thứ tự cố định của một căn trong sổ nhà (0–291) | id nhà |
| **Liêu xá** | Nhà trọ ở Sơn Môn: giường chung, phòng đơn | khách sạn |
| **Tiền Trang** | Quầy gửi và rút tiền | ngân hàng |
| **Nha Môn** | Nơi mua bán nhà, hộ tịch, xử nợ | toà án, toà thị chính |
| **Y Quán · Dược Phòng** | Nơi chữa mọi bệnh · tiệm thuốc chữa bệnh nhẹ | bệnh viện |

## 1.7 Huyền học và luân hồi

| Tên chuẩn | Định nghĩa | Tránh |
|---|---|---|
| **Pháp môn** | Kỹ năng học bằng Phúc Khí, ba tầng | skill |
| **Đột phá** | Bước sang cảnh giới kế, cần đủ Âm Đức, Nghiệp nhẹ và thử thách | lên cấp |
| **Tâm ma** | Đột phá thất bại do Nghiệp nặng | — |
| **Giải hạn** | Lễ tiêu Phúc Khí để chặn sự kiện dữ | cúng giải hạn trả tiền |
| **Ngất** | Khí huyết về 0 vì kiệt sức, đuối nước, tai nạn: tỉnh lại, mất tiền thuốc | chết |
| **Chết** | Chỉ vì đói hoặc bệnh nặng không chữa; dẫn tới luân hồi | game over |
| **Âm phủ · Cân nghiệp** | Nơi và phép tính quyết định cõi đầu thai | địa ngục |
| **Lục đạo** | Sáu cõi: Thiên, A-tu-la, Nhân, Súc sinh, Ngạ quỷ, Địa ngục | — |
| **Sổ Luân Hồi** | Danh sách các kiếp đã qua | — |

## 1.8 NPC và AI

| Tên chuẩn | Định nghĩa | Tránh |
|---|---|---|
| **Thầy bói** | Một trong 13 thầy trả lời bằng AI theo lá số người chơi | thầy AI |
| **Thầy Tử Bình** | Thầy ngồi Bàn Thầy ở Sơn Môn | Thầy (đứng một mình thì mơ hồ) |
| **Thầy mệnh lý** | **Người chơi** hành nghề xem quẻ cho người chơi khác | thầy bói người chơi |
| **Trọng tài** | Bộ chấm ba lớp cho lời luận của thầy mệnh lý | — |
| **Persona** | Hồ sơ giọng nói và giới hạn của một NPC có tên | nhân cách |
| **Bark** | Câu ngắn NPC nói khi người chơi lại gần, không qua mạng | — |
| **Chuyện khách** | Câu chuyện sinh theo hạt giống ngày và lá số của khách NPC | — |
| **Dân thành** | NPC không tên riêng trong thành, nói câu theo vai | — |
| **Câu mẫu** | Lời NPC dùng khi AI tắt hoặc hết lượt | fallback |

## 1.9 Kỹ thuật

| Tên chuẩn | Định nghĩa | Tránh |
|---|---|---|
| **Trạm** | Điểm tương tác trong mã (`world.STATIONS`); trạm ảo là trạm sinh theo khoá: `door:`, `knock:`, `exit:`, `spot:` | — |
| **Mô-đun thuần** | Tệp chỉ có dữ liệu và luật, không three.js, không DOM; chạy được trong Node và trong Worker | — |
| **Bậc model** | Hậu tố tệp GLB chỉ độ chi tiết: gốc, `.bk`, `.mid`, `.lod`, `.lod1`, `.lod2`, `.far`, `.vc`, `.vc2`, `.hd` | LOD (dùng được trong mã) |
| **Mức đồ hoạ** | `low`, `mid`, `high` | quality tier |
| **Phòng** (mạng) | Một Durable Object `TownShard`, tối đa `ROOM_CAP` người | shard, server |
| **Khách** | Người chơi chưa đăng nhập, định danh bằng `pid` trên máy | guest |
| **Vé** | Mã dùng một lần đổi phiên đăng nhập lấy danh tính trên WebSocket | token |

## 1.10 Tên dễ nhầm: tra nhanh

| Thấy trong tài liệu hoặc mã cũ | Nghĩa hôm nay |
|---|---|
| «văn», «Văn», `van`, `START_VAN` | đồng (1 văn = 1 đồng = 100 xu); mã còn giữ tên cũ ở vài hằng số |
| «Phúc Khí» dùng để mua đồ | đã bỏ từ QĐ-12; nay mua bằng tiền |
| «cấp 8 mở ngự kiếm» | vẫn đúng; cấp 5–9 nay gọi là cảnh giới Luyện Khí |
| «47 tiệm», «2.400 nhà», «thế giới 3.328 m» | số của thành v3; xem số thật ở [A5](phu-luc/A5-dia-diem.md) |
| «Player / Market / Venue / Civil / Divination / Risk DO» | thiết kế đích; đang chạy gộp trong một `Economy` (QĐ-19) |
| «Thầy AI», «askAI» | AI của app chính; trong game gọi qua thầy bói |
| «P0…P21», «G0…G4», «V2-n», «v4…v6», «G-5.x» | mã giai đoạn cũ, vẫn dùng để tra nhật ký và test; bảng ánh xạ ở [04-LO-TRINH](04-LO-TRINH.md) |
