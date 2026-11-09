# 05-04 · Danh mục việc thiện / ác trong game (`DEED-xxx`)

> Mỗi việc trong danh mục là **một luật ghi sổ** của máy nhiệm vụ: khi sự kiện game khớp «Kích hoạt», sổ ghi một dòng `{ type, action: <nguyên văn CONG_QUA.a>, count }` (05-03 §3.1).
> Cột **Công** = `p × count` theo `` `remedy-fate › CONG_QUA` `` (không game nào được tự đặt điểm khác bảng app; muốn việc lớn hơn thì tăng `count`).
> Cột **Hồi chiêu** tính từ lần **hữu hiệu** gần nhất của chính DEED đó; ngoài ra mọi DEED chịu luật chung CC-1…CC-9 (05-03 §3.3).
> Cột **Chống cày riêng** là luật **thêm** cho DEED đó.
> Việc ác (mục 13) chỉ sinh từ lựa chọn có thẻ hậu quả (05-03 §3.4) và kèm thanh nghiệp (05-05).
> Vùng dùng region id canon. NPC phụ (người buôn, ngư phủ…) chỉ ghi vai; tài liệu 06 cấp mã `NPC-*`.

Tổng: **198 việc thiện** (DEED-001 … DEED-198) + **39 việc ác có điểm** (trong khoảng DEED-201 … DEED-245, kèm 2 dòng ghi chú «không phải ác») = **237 luật ghi sổ**.

---

## 1. Quy ước

| Cột | Ý nghĩa |
|---|---|
| Mã | `DEED-` + 3 chữ số; khoảng 001–199 thiện, 201–299 ác |
| Việc | tên hiện trong sổ (dòng phụ dưới chữ app) |
| Nhóm | mã nhóm 05-03 §1.1 (T-xx / A-xx) |
| Công | `±p × count` |
| Kích hoạt | điều kiện máy nhiệm vụ kiểm |
| Vùng | region id; «mọi» = bất kỳ vùng nào có điều kiện |
| Hồi chiêu | thời gian trước khi DEED này hữu hiệu lại |
| Chống cày riêng | luật thêm; «—» nếu chỉ dùng luật chung |
| Hạnh | hạnh `TEN_THIEN` để tính huy hiệu (05-01 §3.8), viết tắt: ThT (与人为善), YK (爱敬存心), TM (成人之美), KT (劝人为善), CN (救人危急), HK (兴建大利), XT (捨财作福), HP (护持正法), KR (敬重尊长), YV (爱惜物命) |
| Âm | ✓ nếu DEED có **nhánh âm thiện** (làm mà NPC không biết là ai) |

---

## 2. Luật riêng của phóng sinh (đọc trước mục 3)

Theo `amta-data › remedies › remedy-fangsheng`: chọn loài bản địa, thả về môi trường phù hợp, tuân thủ sinh thái; hiện đại phản đối phóng sinh loài ngoại lai / sai môi trường. Game dạy đúng điều đó bằng cơ chế:

| Loài trong game | Nơi thả **đúng** | Nơi thả **sai** (0 công, có lời giảng) |
|---|---|---|
| cá chép, cá diếc | hồ sen Bút Tháp, ao Huyền Thành, Cùng Thông Hồ (vùng nước ngọt nông) | suối đá lạnh Võ Đang, Thiên Trì Côn Lôn |
| cá hồi núi (hư cấu «cá tuyết khê») | suối lạnh Tạng Địa, suối Võ Đang | hồ sen, ao ấm |
| rùa đầm | đầm lầy Cùng Thông Hồ | sông chảy xiết, ao cá chép (rùa ăn trứng) |
| chim sẻ, chim chào mào | rừng thưa Thư Lâu Lâm, vườn chùa | núi tuyết |
| hạc, cò | đồng nước Cùng Thông Hồ, bãi lau Bút Tháp | rừng rậm Miêu Cương |
| thỏ rừng, sóc | rừng Chung Nam, Thư Lâu Lâm | chợ, khu dân cư |
| ếch, nhái | ruộng nước Yên Tử chân núi, ao | suối nước nóng |
| rắn (đã bắt nhầm vào nhà dân) | rừng xa khu dân cư Miêu Cương, Mao Sơn | gần nhà dân |
| cá cảnh vàng «kim lý» (loài nhập, hư cấu) | **không có nơi đúng** — chỉ được **gửi nuôi** ở chậu đá Bút Tháp (DEED-018) | mọi hồ tự nhiên (lời giảng: loài nhập lấn át loài bản địa) |

Lời giảng khi thả sai (Ni sư Diệu Âm): «Thương nó thì thả nó về đúng nhà của nó. Thả sai chỗ là đưa nó đi chết, lại hại cả những con đang sống ở đó.» Lần thả sai đầu tiên tặng thẻ Tàng Kinh «Phóng sinh đúng cách».

---

## 3. Phóng sinh — T-PS «Phóng sinh (cứu mạng)», +3 (DEED-001 … 020)

| Mã | Việc | Công | Kích hoạt | Vùng | Hồi chiêu | Chống cày riêng | Hạnh | Âm |
|---|---|---|---|---|---|---|---|---|
| DEED-001 | Thả cá chép ở hồ sen | +3 | mua cá trong chậu của bà bán cá chùa, thả đúng hồ (bảng §2) | `buttap` | 24 giờ | kho cá theo ngày (CC-8) | YV | ✓ |
| DEED-002 | Thả chim mua lại từ lồng | +3 | mua chim ở sạp chim chợ, mở lồng ở rừng thưa / vườn chùa | `thanh` | 24 giờ | sạp chỉ có chim do thế giới sinh (CC-8) | YV | ✓ |
| DEED-003 | Gỡ rùa mắc lưới bỏ hoang | +3 | tìm lưới cũ mắc rùa ở bờ đầm (sinh ngẫu nhiên 2 lần / ngày toàn máy chủ mỗi vùng), gỡ (mini-game gỡ nút) và thả xuống đầm | `cungthong` | 48 giờ | người đầu tiên gỡ nhận công; người đến sau nhận câu cảm ơn của ngư phủ | YV | ✓ |
| DEED-004 | Cứu cá mắc cạn sau lũ | +3 | sau sự kiện thời tiết «mưa lũ», cá mắc ở vũng; dùng gáo múc thả về hồ | `cungthong` | theo sự kiện | ≤ 1 lần / sự kiện | YV | |
| DEED-005 | Tháo bẫy thú của tay buôn | +3 | phát hiện bẫy kẹp trong rừng (do tay buôn thú đặt), tháo, báo trưởng trại | `mieucuong` | 24 giờ | phải **báo** trưởng trại để hoàn tất (dạy: cứu thú không phải chiếm đồ người) | YV | |
| DEED-006 | Thả thỏ con bị bắt về chợ | +3 | mua thỏ ở sạp, thả ở rừng Chung Nam | `chungnam` | 48 giờ | CC-8 | YV | ✓ |
| DEED-007 | Đưa hạc bị thương tới vu y | +3 | gặp hạc gãy cánh ở bãi lau, mang tới Vu y bà A Mậu; sau 3 ngày thật quay lại thả | `buttap` → `mieucuong` | 7 ngày | công ghi khi **thả**, không khi mang tới | YV | |
| DEED-008 | Thả rắn bắt nhầm vào nhà | +3 | dân làng nhốt rắn trong giỏ định đập; người chơi xin mang đi thả ở rừng xa | `mieucuong` | 72 giờ | hội thoại phải chọn «mang đi thả», không chọn «để dân đập» | YV | |
| DEED-009 | Phóng sinh tập thể Rằm | +3 | tham gia lễ phóng sinh mùng 1 / Rằm (sự kiện máy chủ) | `buttap` | theo sự kiện | ≤ 1 lần / sự kiện | YV, ThT | |
| DEED-010 | Cứu ếch trong giếng cạn | +3 | giếng cạn mùa hạn có ếch mắc kẹt; thả gáo xuống, đưa ra ruộng | `yentu` | 72 giờ | — | YV | ✓ |
| DEED-011 | Gỡ chim mắc dây diều | +3 | sau lễ hội thả diều, chim mắc dây trên cây; trèo / ngự kiếm gỡ | `thanh` | theo sự kiện | — | YV | ✓ |
| DEED-012 | Thả cá tuyết khê về suối lạnh | +3 | mua cá ở chợ trại Tạng Địa, thả suối lạnh | `tangdia` | 48 giờ | CC-8 | YV | ✓ |
| DEED-013 | Đuổi chim khỏi lưới bẫy trên ruộng | +3 | mở lưới bẫy chim của tay buôn; báo chủ ruộng dùng bù nhìn thay lưới | `yentu` | 48 giờ | hội thoại thuyết phục chủ ruộng thành công | YV, KT | |
| DEED-014 | Cứu sóc rơi khỏi tổ sau gió | +3 | sau sự kiện gió lớn, đặt sóc con vào hộp, treo lên cây gần tổ | `thulau` | theo sự kiện | — | YV | ✓ |
| DEED-015 | Thả cò bị nhốt ở quán nhậu | +3 | quán nhậu ven đường nhốt cò làm món; hội thoại mua lại (Phúc Khí) và thả ở đồng nước | `cungthong` | 72 giờ | CC-8; quán không «nhập thêm» vì người chơi mua | YV | |
| DEED-016 | Đưa cá bị thương ở hồ phóng sinh tới chăm | +3 | cá trong hồ Bút Tháp bị lưỡi câu trộm; gỡ lưỡi, thả lại | `buttap` | 48 giờ | chỉ khi có sự kiện «câu trộm» (sinh ngẫu nhiên) | YV | ✓ |
| DEED-017 | Thả đom đóm bắt trong lọ | +3 | trẻ con bắt đom đóm vào lọ; khuyên trẻ thả (hội thoại) và cùng thả | `thanh` | 48 giờ | công ghi một lần cho cả nhóm trẻ | YV, KT | |
| DEED-018 | Gửi nuôi cá kim lý ở chậu đá chùa | +3 | mua cá kim lý (loài nhập) ở chợ, mang tới chậu đá Bút Tháp nhờ chùa nuôi | `buttap` | 7 ngày | chậu tối đa 9 con toàn máy chủ; đầy thì DEED tắt tới khi có cá «già đi» | YV | |
| DEED-019 | Cứu hươu mắc kẹt trong tuyết | +3 | mùa đông, hươu mắc kẹt khe tuyết; đào tuyết giải thoát | `tangdia`, `conlon` | theo mùa, 72 giờ | — | YV | |
| DEED-020 | Phóng sinh mà không ai thấy | +3 (+2 âm chất) | làm bất kỳ DEED-001…019 có ✓ theo điều kiện âm thiện (05-01 §3.6) | mọi | — | không phải DEED riêng: là **nhánh âm** ghi thêm dòng T-AC | YV | ✓ |

---

## 4. Cứu người nguy cấp — T-CN «Cứu người nguy cấp», +3 (DEED-021 … 045)

| Mã | Việc | Công | Kích hoạt | Vùng | Hồi chiêu | Chống cày riêng | Hạnh | Âm |
|---|---|---|---|---|---|---|---|---|
| DEED-021 | Giải án cho khách đang khủng hoảng | +3 | giải án khách (đã có `cases.js`) có cờ «khủng hoảng» (NPC sắp quyết định liều theo lời thầy bói) với điểm ≥ 60% | `thanh` | 24 giờ | chỉ án có cờ; án thường không có công (là nghề) | CN | |
| DEED-022 | Kéo người ngã xuống suối | +3 | NPC trượt chân ở bến (sự kiện ngẫu nhiên); chạy tới, nhấn giữ để kéo | `cungthong`, `vodang` | 24 giờ | CC-5: người chơi không đẩy NPC được | CN | |
| DEED-023 | Đưa người lạc đường trên núi tuyết về trại | +3 | gặp lữ khách lạc (sự kiện bão tuyết), dẫn về trại trong 5 phút | `tangdia` | 48 giờ | — | CN | |
| DEED-024 | Dập đám cháy bếp nhà dân | +3 | sự kiện cháy nhỏ; múc nước từ giếng, dập; gọi hàng xóm | `thanh`, `mieucuong` | theo sự kiện | — | CN | |
| DEED-025 | Đưa người say nắng vào bóng mát | +3 | NPC lao động ngất giữa trưa hè ở ruộng; đưa vào bóng, gọi vu y | `yentu`, `mieucuong` | 48 giờ | hội thoại **không** đưa chỉ dẫn y tế; chỉ «đưa vào mát, gọi người biết chữa» | CN | |
| DEED-026 | Cứu người trúng yểm (chuỗi trừ tà chính tông) | +3 × 2 | hoàn tất chuỗi `CQ-TR` (05-13 §6) cho một nạn nhân | mọi | mỗi nạn nhân 1 lần | công ghi khi người được cứu **hồi phục** (bước cuối) | CN, HP | |
| DEED-027 | Giữ người định nhảy cầu vì lời phán | +3 × 2 | chuỗi Định Mệnh Hội: NPC tin mình «hết số»; người chơi đối thoại, đưa lá số thật ra giải (engine), đưa về nhà | `thanh` | mỗi vùng 1 lần đời | cảnh viết theo quy tắc an toàn: không mô tả cách, có thẻ hỗ trợ đời thực cuối cảnh | CN, KT | |
| DEED-028 | Đưa trẻ lạc về với mẹ | +3 | trẻ lạc ở chợ phiên; dắt tới chỗ mẹ (đi theo chỉ dẫn manh mối) | `thanh`, `vanmieu` | 24 giờ | — | CN | ✓ |
| DEED-029 | Cứu thuyền chòng chành giữa hồ | +3 | gió lớn, đò nghiêng; chèo thuyền tới, kéo dây | `cungthong` | theo sự kiện | — | CN | |
| DEED-030 | Đỡ người già ngã trên bậc đá | +3 | sự kiện ngã trên 1.000 bậc đá Yên Tử / Võ Đang; đỡ dậy, cõng tới chòi nghỉ | `yentu`, `vodang` | 24 giờ | cùng NPC 1 lần / 7 ngày | CN, KR | ✓ |
| DEED-031 | Giải cứu người bị Định Mệnh Hội giam đòi tiền «giải hạn» | +3 × 2 | án Định Mệnh Hội của vùng (tài liệu 03), bước giải cứu | mọi vùng có án | mỗi án 1 lần | — | CN, KT | |
| DEED-032 | Báo tin lũ cho làng dưới chân núi | +3 | sự kiện mưa lớn; người chơi đầu tiên tới làng và rung chuông | `vodang`, `chungnam` | theo sự kiện | 5 người đầu tiên nhận công | CN | |
| DEED-033 | Đưa sản phụ trở dạ tới bà đỡ | +3 | NPC sản phụ ở trại xa; đưa bằng xe / ngự kiếm tới nhà bà đỡ | `mieucuong`, `maoshan` | 7 ngày | không mô tả y khoa; cảnh tập trung vào đi đường | CN | |
| DEED-034 | Kéo người mắc kẹt trong hang sập | +3 × 2 | sự kiện sập hang Miêu Cương (Hồi III); dọn đá theo thứ tự (mini-game xếp) | `mieucuong` | theo sự kiện | tổ đội ≥ 2 | CN | |
| DEED-035 | Giữ khách hành hương trượt dốc mưa | +3 | mưa trên đường lên Chùa Đồng; nắm tay giữ | `yentu` | 24 giờ | — | CN | ✓ |
| DEED-036 | Ngăn đám đông đánh người bị vu là «yểm» | +3 × 2 | chuỗi Hồi III: dân làng định đánh một người bị đồn yểm; người chơi đứng ra, dẫn tới Mao Sơn đạo nhân xét | `mieucuong`, `maoshan` | 1 lần đời mỗi làng | dạy: không ai được kết tội «yểm» bằng tin đồn | CN, KT | |
| DEED-037 | Cứu người trong thuyền đắm ở Nại Hà (Hồi IV) | +3 × 2 | cảnh MMO cầu Nại Hà: kéo người chơi Tà Lộ lên bờ (canon Hồi IV) | `phongdo` | 1 lần / người được kéo | người được kéo phải **chấp nhận** | CN, KT | |
| DEED-038 | Che người bị sét vây trên đỉnh núi | +3 | giông trên Kim Đỉnh Võ Đang; dẫn người xuống điện trú | `vodang` | theo sự kiện | — | CN | |
| DEED-039 | Mở đường cho đoàn bị tuyết chặn | +3 | xúc tuyết đèo Tạng Địa trong 3 phút | `tangdia` | theo sự kiện | — | CN, HK | |
| DEED-040 | Đưa người hoảng loạn tới chỗ an toàn | +3 | NPC hoảng sợ sau «tiếng động lạ» ở Phong Đô (chuỗi Hồi IV); dẫn ra, ngồi cùng, gọi người thân | `phongdo` | 48 giờ | lời thoại theo hướng: trấn an, không khẳng định ma (ETHICS) | CN | |
| DEED-041 | Kéo xe ngựa sa lầy | +3 | xe chở thuốc sa lầy giữa đường Miêu Cương; đẩy cùng | `mieucuong` | 24 giờ | — | CN, ThT | |
| DEED-042 | Giải vây người bị thú hoang dồn | +3 | rung chuông / đốt đuốc đuổi thú (không làm hại thú) | `chungnam`, `mieucuong` | 48 giờ | **cấm** lựa chọn đánh thú — chỉ đuổi | CN, YV | |
| DEED-043 | Cứu người ngộ độc nấm (gọi vu y) | +3 | NPC ăn nấm lạ; người chơi chạy gọi Vu y bà A Mậu, dẫn tới | `mieucuong` | 72 giờ | không có lựa chọn «tự chữa» | CN | |
| DEED-044 | Giữ người bị lừa ký giấy bán nhà | +3 | quầy Định Mệnh Hội ép NPC ký bán nhà «để đổi mệnh»; người chơi chặn lại, đọc lá số thật | mọi | mỗi vùng 1 lần | — | CN, KT | |
| DEED-045 | Đưa người lạc ở Thiên Trì xuống | +3 | người chơi mới lạc ở đảo trời Côn Lôn (cần bậc 6) | `conlon` | 48 giờ | chỉ người chơi bậc 6 thấy | CN | |

---

## 5. Giúp người khó khăn — T-GN «Giúp người khó khăn», +2 (DEED-046 … 080)

| Mã | Việc | Công | Kích hoạt | Vùng | Hồi chiêu | Chống cày riêng | Hạnh | Âm |
|---|---|---|---|---|---|---|---|---|
| DEED-046 | Gánh nước cho ông bếp am | +2 | 3 lượt gánh từ suối lên bếp Am Vân Cốc | `vancoc` | 24 giờ | — | ThT | ✓ |
| DEED-047 | Viết thư hộ người không biết chữ | +2 | NPC ở chợ nhờ viết thư; mini-game viết theo lời kể | `thanh` | 24 giờ | cùng NPC 7 ngày | TM | ✓ |
| DEED-048 | Đọc lá số miễn phí cho người nghèo | +2 | khách nghèo ở bậc Sơn Môn không có tiền trả thầy; giải án không lấy Phúc Khí thưởng | `thanh` | 24 giờ | phải từ chối phần thưởng | TM, XT | |
| DEED-049 | Giúp bà cụ mang hàng ra chợ | +2 | bê 3 thúng từ nhà ra sạp | `thanh` | 24 giờ | — | KR, ThT | ✓ |
| DEED-050 | Sửa mái nhà dột cho góa phụ | +2 | sau mưa; mini-game lợp ngói | `thanh`, `mieucuong` | 72 giờ | — | TM | ✓ |
| DEED-051 | Dạy chữ cho trẻ ở trại | +2 | 10 phút ngồi lớp học tạm ở trại Miêu Cương, mini-game dạy (chọn chữ đúng) | `mieucuong` | 24 giờ | — | TM, HP | |
| DEED-052 | Chỉ đường cho người chơi mới | +2 | người chơi bậc 1 hỏi đường (hệ thống «hỏi đường»), dẫn tới nơi | mọi | 24 giờ | CC-6; tối đa 3 người / ngày | ThT | |
| DEED-053 | Hái thuốc giúp vu y | +2 | hái đủ 5 vị theo đơn hành (tcm) cho vườn thuốc | `mieucuong` | 24 giờ | — | TM | |
| DEED-054 | Giữ quầy hộ người buôn đi việc gấp | +2 | trông quầy 5 phút, bán đúng giá | `thanh` | 24 giờ | không được bán giá khác giá niêm yết | YK | |
| DEED-055 | Tìm lại đồ thất lạc trả chủ | +2 | nhặt túi tiền rơi; trả đúng chủ (manh mối) | mọi | 24 giờ | túi tiền sinh ngẫu nhiên; giữ lại → DEED-221 | YK | ✓ |
| DEED-056 | Hòa giải hai nhà tranh ranh giới | +2 | chuỗi hội thoại 3 bước, chọn giải pháp công bằng | `thanh` | 7 ngày | — | TM | |
| DEED-057 | Đưa cơm cho người canh đèn Thái Tuế Điện đêm | +2 | mang cơm từ Trà Thất tới điện lúc giờ Hợi | `thanh` | 24 giờ | — | KR | ✓ |
| DEED-058 | Chép lại quyển kinh rách cho chùa | +2 | mini-game chép (chép đúng nét) — đồng thời T-KI nếu là kinh | `buttap` | 48 giờ | — | HP | |
| DEED-059 | Dìu người mù qua cầu đá | +2 | NPC mù (thầy bói Manh phái lớn tuổi) ở cầu Manh Phái Cốc | `manh` | 24 giờ | — | KR | ✓ |
| DEED-060 | Giúp nông dân gặt lúa trước mưa | +2 | sự kiện mùa gặt; gặt 20 bó | `yentu`, `thanh` | theo mùa | — | ThT | |
| DEED-061 | Kèm sĩ tử nghèo ôn thi Hương | +2 | trả lời 10 câu ôn cùng sĩ tử NPC ở Văn Miếu | `vanmieu` | 48 giờ | — | TM | |
| DEED-062 | Sửa lại biển hiệu cho tiệm bị gió thổi | +2 | dựng biển, cột lại | mọi | 72 giờ | — | ThT | ✓ |
| DEED-063 | Mang chăn lên cho người ở chòi núi | +2 | mùa đông, mang chăn từ chùa lên chòi | `yentu`, `tangdia` | theo mùa, 48 giờ | — | XT | ✓ |
| DEED-064 | Giúp trưởng trại đếm lại gia súc | +2 | tìm 3 con dê lạc trong rừng đưa về | `mieucuong` | 24 giờ | — | ThT | |
| DEED-065 | Nghe một người kể chuyện buồn | +2 | NPC có cờ «cô đơn» ở Trà Thất; ngồi nghe trọn hội thoại (≥ 3 lượt) không ngắt | `thanh` | 24 giờ | cùng NPC 7 ngày | YK | |
| DEED-066 | Giúp người chơi khác qua bài thi khó | +2 | tổ đội hỗ trợ người chơi bậc thấp hơn qua một nhiệm vụ thử thách | mọi | 24 giờ | CC-6 | TM | |
| DEED-067 | Lau dọn bia đá Văn Miếu | +2 | lau 5 bia (không đè lên chữ) | `vanmieu` | 24 giờ | — | HP | ✓ |
| DEED-068 | Phơi kinh giúp tàng kinh các mùa nồm | +2 | mang 10 bó kinh ra sân phơi, mang vào trước mưa | `chungnam`, `buttap` | theo mùa | — | HP | ✓ |
| DEED-069 | Đưa thư cho người đưa thư bị ốm | +2 | giao 5 lá thư khắp Huyền Thành | `thanh` | 24 giờ | — | ThT | |
| DEED-070 | Kê lại bậc đá lung lay trên đường núi | +2 | sửa 3 bậc (mini-game) | `vodang`, `yentu` | 72 giờ | — | HK | ✓ |
| DEED-071 | Giúp nhà có tang làm cỗ | +2 | sự kiện tang trong làng; phụ bếp, bê mâm | `thanh`, `mieucuong` | theo sự kiện | cảnh trang nghiêm, không đùa | ThT, YK | |
| DEED-072 | Chở hàng cứu trợ sau lũ | +2 × 2 | sự kiện sau lũ; chở 3 chuyến | `cungthong` | theo sự kiện | — | CN, XT | |
| DEED-073 | Hướng dẫn người mới dùng la bàn | +2 | dạy người chơi bậc 1 làm nhiệm vụ la bàn (đã có `compass`) | `thanh` | 24 giờ | CC-6 | TM | |
| DEED-074 | Dựng lại chòi cho người hái thuốc | +2 | sau bão; dựng chòi (mini-game) | `mieucuong` | theo sự kiện | — | TM | |
| DEED-075 | Đổi phiên trực đèn cho đạo đồng mệt | +2 | thay đạo đồng giữ đèn ở Đẩu Mẫu Điện 10 phút | `longho`, `thanh` | 24 giờ | — | ThT | ✓ |
| DEED-076 | Giúp đôi trẻ chọn ngày cưới đúng cách | +2 | ở sảnh Trạch Nhật, giải cho NPC đôi trẻ không đủ tiền thuê thầy | `lichduong` | 48 giờ | từ chối thù lao | TM | |
| DEED-077 | Tìm thuốc cho mẹ một sĩ tử | +2 | lấy thuốc ở vu y theo đơn có sẵn (không tự kê) | `mieucuong` → `vanmieu` | 7 ngày | — | KR | |
| DEED-078 | Cho người đi đường trú mưa trong nhà riêng | +2 | sự kiện mưa: NPC gõ cửa nhà riêng; mở cửa, mời trà | `thanh` | 72 giờ | chỉ khi người chơi ở trong nhà riêng | ThT | |
| DEED-079 | Giúp thợ sửa chuông đúc lại khuôn | +2 | đạp bễ lò 3 phút | `longho` | 48 giờ | — | HK | |
| DEED-080 | Kể lại lá số đúng cho người bị thầy giả hù | +2 | sau khi vạch mặt Định Mệnh Hội (T-KT), ở lại giải thích lá số thật cho nạn nhân | mọi | 24 giờ | ghi kèm DEED-14x | TM, KT | |

---

## 6. Bố thí — T-BT «Bố thí tiền/của», +2 (DEED-081 … 100)

**Luật riêng nhóm bố thí:** `REMEDY_METHODS[4]` «cho cố định, trước nhỏ» và `YEGUO[1].cure` «先还欠再施» (trả nợ trước rồi mới thí). Game áp:

- Người chơi đang **nợ** (vay Phúc Khí của người khác chưa trả, hệ thống vay của tài liệu 11) thì bố thí **không hữu hiệu** cho tới khi trả xong. Lời Diệu Âm: «Trả nợ trước, cho sau. Cho bằng tiền nợ là cho bằng tiền của người khác.»
- Bố thí tính theo **tỷ lệ**, không theo số tuyệt đối: một lần bố thí hữu hiệu khi lượng cho ≥ 2% Phúc Khí hiện có **hoặc** ≥ 20 Phúc Khí (lấy số nhỏ hơn). Người nghèo cho ít vẫn đủ; người giàu không «mua công» bằng lượng nhỏ.
- **Không** có bố thí bằng Ngọc (tiền thật). Ô «bố thí» chỉ nhận Phúc Khí và vật phẩm.

| Mã | Việc | Công | Kích hoạt | Vùng | Hồi chiêu | Chống cày riêng | Hạnh | Âm |
|---|---|---|---|---|---|---|---|---|
| DEED-081 | Bỏ Phúc Khí vào hòm công đức chùa | +2 | thả ≥ ngưỡng vào hòm Bút Tháp | `buttap` | 24 giờ | — | XT | ✓ |
| DEED-082 | Cho người ăn xin ở bậc Sơn Môn | +2 | NPC ăn xin (sinh theo ngày) | `thanh` | 24 giờ | cùng NPC 24 giờ | XT | ✓ |
| DEED-083 | Góp quỹ sửa đạo tràng môn phái | +2 | góp vào quỹ đạo tràng (tài liệu 10) | thánh địa của môn phái | 24 giờ | — | XT, HK | |
| DEED-084 | Mua sách tặng trường làng | +2 | mua ở Thư Lâu, mang tới lớp học trại | `thulau` → `mieucuong` | 72 giờ | — | XT, TM | ✓ |
| DEED-085 | Phát cháo mùa đông | +2 | sự kiện tháng Chạp; múc 20 bát | `thanh` | theo sự kiện | — | XT | |
| DEED-086 | Hũ phúc 7 ngày | +2 | đặt lệnh bố thí tự động mỗi ngày 7 ngày liền (lượng cố định do người chơi chọn) — đúng «cho cố định» | mọi | ghi 1 dòng / ngày | ngày nào không đủ Phúc Khí thì dừng, không nợ | XT | ✓ |
| DEED-087 | Tặng áo ấm cho trẻ trại | +2 | mua áo ở Tàng Y Các bằng Phúc Khí (món «áo bông trẻ em», không mặc được cho mình), tặng | `mieucuong` | 72 giờ | — | XT | ✓ |
| DEED-088 | Trả tiền thuốc cho người bệnh nghèo | +2 | tại vu y, có NPC không đủ tiền thuốc | `mieucuong` | 48 giờ | — | XT | ✓ |
| DEED-089 | Bố thí pháp: tặng sách kinh | +2 | mua kinh ở tàng kinh các, tặng người hành hương | `buttap`, `yentu` | 48 giờ | — | XT, HP | |
| DEED-090 | Bố thí vô úy: đi cùng người sợ hãi qua Phong Đô | +2 | dẫn NPC sợ hãi qua phố Phong Đô (bố thí sự không sợ) | `phongdo` | 48 giờ | — | XT, CN | |
| DEED-091 | Cúng dường trai phạn cho tăng | +2 | mang cơm lên trai đường Yên Tử | `yentu` | 24 giờ | — | XT, KR | |
| DEED-092 | Góp dầu đèn Thái Tuế cho người già | +2 | thêm dầu đèn của một cụ già không đủ tiền | `thanh` | 24 giờ | — | XT, KR | ✓ |
| DEED-093 | Mua lại lồng chim của tay buôn để hắn đổi nghề | +2 × 2 | chuỗi 3 bước: mua lại cả sạp, thuyết phục tay buôn chuyển sang bán hạt giống | `thanh` | 1 lần đời | sau chuỗi, sạp chim đóng 30 ngày (CC-8: không tạo cầu) | XT, KT | |
| DEED-094 | Tặng quần áo cũ còn tốt cho trại | +2 | đặt món thời trang Phúc Khí (không phải món Ngọc) vào hòm từ thiện | `mieucuong` | 7 ngày | món đó biến mất khỏi kho (thật sự cho đi) | XT | ✓ |
| DEED-095 | Giúp vốn cho người mở quầy nhỏ | +2 | cho NPC góa phụ vay **không lãi**, NPC trả dần 7 ngày | `thanh` | 7 ngày | — | XT, TM | |
| DEED-096 | Góp gạo cho kho chẩn tế làng | +2 | mang gạo mua ở chợ tới kho | `cungthong` | 72 giờ | — | XT | ✓ |
| DEED-097 | Đãi trà khách hành hương | +2 | mời 5 khách lạ ở Trà Thất | `thanh` | 24 giờ | — | XT, YK | |
| DEED-098 | Bố thí ẩn danh qua sư | +2 | gửi Phúc Khí nhờ Ni sư Diệu Âm trao, không nói tên | `buttap` | 24 giờ | luôn là âm thiện | XT | ✓ |
| DEED-099 | Trả nợ hộ người bị Định Mệnh Hội ép | +2 × 2 | sau án Định Mệnh Hội, nạn nhân còn món nợ «phí giải hạn»; trả giúp và lấy lại giấy nợ | mọi | mỗi án 1 lần | — | XT, CN | |
| DEED-100 | Tặng đệ tử bộ áo nhập môn | +2 | sư phụ (bậc ≥ 3 với Đại Nguyện 1, hoặc bậc 4) tặng đệ tử món Phúc Khí | mọi | mỗi đệ tử 1 lần | — | XT, TM | |

---

## 7. Hiếu thuận — T-HT «Hiếu thuận cha mẹ», +2 (DEED-101 … 115)

**Đối tượng hiếu trong game.** Người chơi không có cha mẹ do game dựng sẵn. Ba đối tượng hiếu:

1. **Bàn thờ gia tiên** trong nhà riêng (thờ tổ tiên của chính người chơi một cách tượng trưng — không hỏi tên, không hỏi ngày giỗ thật).
2. **Thầy** — «nhất tự vi sư, bán tự vi sư»: thầy chính và thầy của đạo đang tu được kính như cha mẹ (hạnh 敬重尊长).
3. **Ông bà chủ nhà trọ Huyền Thành** — nơi người chơi Nghịch Thiên nghỉ tạm ở Hồi I. Đề xuất: ông bà nhận mọi người chơi làm «con nuôi trọ» (cần tài liệu 03/06 xác nhận — câu hỏi mở).

Ngoài ra: **chuỗi gia đình NPC ở Huyền Thành** (canon §5.3) — người chơi giúp **NPC con** làm tròn hiếu với **NPC cha mẹ**; công ghi nhóm T-KT hoặc T-GN (không phải hiếu của chính người chơi).

| Mã | Việc | Công | Kích hoạt | Vùng | Hồi chiêu | Chống cày riêng | Hạnh | Âm |
|---|---|---|---|---|---|---|---|---|
| DEED-101 | Dâng hương bàn thờ gia tiên mùng 1 / Rằm | +2 | thắp hương ở nhà riêng đúng ngày âm | `thanh` | theo ngày âm | 2 lần / tháng | KR | ✓ |
| DEED-102 | Lau dọn bàn thờ gia tiên | +2 | mini-game lau (chậm, nhẹ) | `thanh` | 7 ngày | — | KR | ✓ |
| DEED-103 | Pha trà dâng thầy | +2 | mang trà Trà Thất tới Bàn Thầy, mời Thầy Tử Bình | `thanh` | 24 giờ | — | KR | |
| DEED-104 | Sắc thuốc cho thầy bị cảm | +2 | sự kiện mùa đông: Vân Cốc cảm; lấy thuốc theo đơn vu y, sắc (mini-game canh lửa) | `vancoc` | theo mùa | không có lựa chọn kê đơn | KR | |
| DEED-105 | Quét sân am cho thầy | +2 | quét lá sân Am Vân Cốc | `vancoc` | 24 giờ | — | KR | ✓ |
| DEED-106 | Gánh củi cho ông bà chủ trọ | +2 | 3 gánh củi | `thanh` | 24 giờ | — | KR | ✓ |
| DEED-107 | Ăn cơm tối với ông bà chủ trọ | +2 | ngồi trọn bữa cơm (hội thoại 3 lượt), không rời giữa chừng | `thanh` | 24 giờ | — | KR, YK | |
| DEED-108 | Mừng thọ ông bà chủ trọ | +2 × 2 | sự kiện mừng thọ hằng năm; chuẩn bị quà (tự làm, không mua bằng Ngọc) | `thanh` | 1 lần / năm | — | KR | |
| DEED-109 | Viết thư cho thầy cũ khi đi xa | +2 | đang ở thánh địa xa ≥ 7 ngày; gửi thư về Bàn Thầy | mọi | 7 ngày | — | KR | |
| DEED-110 | Đón thầy đi lễ, đi chậm theo thầy | +2 | đi cạnh Vân Cốc lên Côn Lôn / Yên Tử, không vượt trước quá 5 m | `yentu`, `conlon` | theo sự kiện | — | KR | |
| DEED-111 | Dâng hương giỗ tổ đạo thống | +2 | ngày giỗ tổ của đạo (lịch ở 05-06…05-11) | thánh địa đạo | 1 lần / năm | — | KR, HP | |
| DEED-112 | Xin lỗi thầy sau khi cãi | +2 | sau một lựa chọn cãi thầy (thẻ `nghich_thuong`), quay lại xin lỗi trong 24 giờ | mọi | — | đồng thời là việc sửa của dòng quá tương ứng | KR | |
| DEED-113 | Chăm vườn cho thầy khi thầy đi vắng | +2 | tưới cây sân am 3 ngày liền khi Vân Cốc đi hành hương (sự kiện) | `vancoc` | theo sự kiện | — | KR | ✓ |
| DEED-114 | Mang quà quê về cho ông bà chủ trọ | +2 | mang đặc sản của một thánh địa xa về | `thanh` | 7 ngày | — | KR | |
| DEED-115 | Thắp đèn hiếu Vu Lan | +2 | 15/7 âm, thả đèn ở hồ sen Huyền Thành, ghi chữ «hiếu» (không ghi tên thật) | `thanh` | 1 lần / năm | — | KR | |

---

## 8. Âm chất — T-AC «Làm thiện ẩn (âm chất)», +2 (DEED-116 … 125)

Âm chất có hai dạng: (1) **nhánh âm** của mọi DEED có cột Âm ✓ (ghi thêm dòng T-AC khi đủ điều kiện ẩn, 05-01 §3.6); (2) **việc chỉ làm được khi ẩn** dưới đây — sinh ở nơi vắng, ban đêm, hoặc phải giấu mặt.

| Mã | Việc | Công | Kích hoạt | Vùng | Hồi chiêu | Chống cày riêng | Hạnh | Âm |
|---|---|---|---|---|---|---|---|---|
| DEED-116 | Để gạo trước cửa nhà nghèo lúc đêm | +2 | giờ Tý–Sửu, không người chơi khác trong 30 m | `thanh` | 24 giờ | — | XT | ✓ |
| DEED-117 | Sửa cổng làng ban đêm | +2 | cổng hỏng; sửa trước khi trời sáng | `mieucuong` | 72 giờ | — | HK | ✓ |
| DEED-118 | Trả lại tiền thối dư mà người bán không biết | +2 | người bán thối nhầm; quay lại để tiền vào hộp không nói gì | `thanh` | 24 giờ | sinh ngẫu nhiên | YK | ✓ |
| DEED-119 | Đắp lại đoạn đường lở trước khi ai biết | +2 | sau mưa, đường lở nhỏ; đắp lúc vắng | `vodang`, `chungnam` | 72 giờ | — | HK | ✓ |
| DEED-120 | Nói tốt về một người vắng mặt | +2 | NPC đang nói xấu người vắng; người chơi chọn lời bênh nhẹ | mọi | 24 giờ | không có người được bênh ở đó | YK | ✓ |
| DEED-121 | Gửi thư động viên giấu tên cho sĩ tử trượt | +2 | sau bảng vàng thi Hương; viết thư không ký | `vanmieu` | theo kỳ thi | — | TM | ✓ |
| DEED-122 | Thắp đèn cho mộ không người thăm | +2 | nghĩa trang ven Phong Đô; mộ không ai thắp | `phongdo` | 7 ngày | — | YK | ✓ |
| DEED-123 | Nhặt mảnh sành trên đường hành hương | +2 | nhặt 10 mảnh sắc trên lối đi chân đất | `yentu` | 24 giờ | — | ThT | ✓ |
| DEED-124 | Nhường suất khách quý ở sảnh nghề cho người cần hơn | +2 | sảnh nghề còn 1 khách, có người chơi bậc thấp chờ; rời hàng | mọi | 24 giờ | CC-6 | ThT | ✓ |
| DEED-125 | Chép kinh rồi để lại ở chòi nghỉ | +2 | chép một quyển, đặt ở chòi cho người sau đọc | `yentu`, `vodang` | 72 giờ | — | HP | ✓ |

---

## 9. Ăn chay — T-CH «Ăn chay 1 ngày», +1 (DEED-126 … 131)

**Định nghĩa «một ngày chay» trong game:** trong một ngày (giờ máy chủ), mọi món người chơi gọi ở quán / trai đường đều là món chay, **và** người chơi gọi ít nhất một món. Hệ thống tự kiểm, ghi một dòng cuối ngày. Không cần bấm gì.

| Mã | Việc | Công | Kích hoạt | Vùng | Hồi chiêu | Chống cày riêng | Hạnh | Âm |
|---|---|---|---|---|---|---|---|---|
| DEED-126 | Một ngày chay | +1 | như trên | mọi | 24 giờ | 1 / ngày | YV | ✓ |
| DEED-127 | Chay mùng 1 / Rằm | +1 | một ngày chay rơi vào mùng 1 hoặc Rằm âm | mọi | theo ngày âm | thay thế DEED-126 ngày đó (không cộng hai) | YV | ✓ |
| DEED-128 | Thập trai (10 ngày chay trong tháng âm) | +1 × 2 | đủ 10 ngày chay trong một tháng âm | mọi | 1 / tháng âm | cộng thêm khi đạt | YV | |
| DEED-129 | Nấu cơm chay mời đồng môn | +1 | nấu (mini-game bếp) và mời ≥ 2 người chơi ăn | mọi | 72 giờ | — | YV, ThT | |
| DEED-130 | Giữ chay trọn tuần lễ Phật đản | +1 × 2 | 7 ngày chay liền trong tuần Phật đản | mọi | 1 / năm | — | YV | |
| DEED-131 | Đổi món mặn đã gọi sang món chay cho người bên cạnh | +1 | ở trai đường, khách bên cạnh xin đổi; nhường | `yentu`, `buttap` | 24 giờ | — | YV, ThT | |

---

## 10. Giữ lời — T-GL «Giữ lời,không dối», +1 (DEED-132 … 145)

| Mã | Việc | Công | Kích hoạt | Vùng | Hồi chiêu | Chống cày riêng | Hạnh | Âm |
|---|---|---|---|---|---|---|---|---|
| DEED-132 | Giữ hẹn với NPC đúng giờ | +1 | đã hứa «giờ Thìn mai tôi quay lại», tới trong khung ±1 giờ game | mọi | 24 giờ | — | YK | |
| DEED-133 | Nói thật khi nói dối có lợi | +1 | hội thoại có lựa chọn dối được lợi; chọn nói thật | mọi | — | mỗi hội thoại 1 lần | YK | |
| DEED-134 | Trả đồ mượn đúng hạn | +1 | mượn sách Thư Lâu, trả trước hạn | `thulau` | mỗi lần mượn | — | YK | |
| DEED-135 | Thừa nhận lỗi trong giải án | +1 | giải án sai một bước; khi thầy hỏi «con chắc chưa?» chọn «con sai» | `thanh` | 24 giờ | — | YK | |
| DEED-136 | Không phóng đại tài mình với khách | +1 | khách hỏi «thầy xem có chắc trăm phần trăm không?»; chọn «không ai chắc trăm phần trăm» | mọi sảnh | 24 giờ | — | YK | |
| DEED-137 | Trả nợ đúng hạn | +1 | khoản vay (tài liệu 11) trả đúng hạn | mọi | mỗi khoản | — | YK | |
| DEED-138 | Giữ nguyện tự đặt trọn kỳ | +1 | nguyện tự nguyện (05-01 §3.7) giữ trọn | mọi | mỗi nguyện | — | YK | |
| DEED-139 | Báo đúng giá khi bán ở chợ | +1 | bán 10 món đúng giá niêm yết, không ép | `thanh` | 24 giờ | — | YK | |
| DEED-140 | Không nhận vơ công cứu người của người khác | +1 | NPC cảm ơn nhầm người; chọn «không phải tôi, là người kia» | mọi | 24 giờ | — | YK, KT | |
| DEED-141 | Trung thực khi thi (không mở sách trong phòng thi) | +1 | thi Hương / Hội / Đình: không dùng vật phẩm «sách lận» bán ở chợ đen (vật phẩm mồi) | `vanmieu` | mỗi kỳ thi | — | YK | |
| DEED-142 | Giữ bí mật người khác gửi | +1 | NPC kể chuyện riêng; khi người khác dò hỏi, chọn không nói | mọi | 24 giờ | — | YK | |
| DEED-143 | Báo lại cho khách khi phát hiện mình giải sai hôm trước | +1 | hệ thống cho biết án hôm qua sai; quay lại báo khách | `thanh` | 48 giờ | — | YK | |
| DEED-144 | Hoàn thành lời hứa giúp đỡ dù không còn thưởng | +1 | nhiệm vụ phụ hết thưởng (đã làm) nhưng NPC còn chờ; vẫn làm nốt | mọi | 72 giờ | — | YK | |
| DEED-145 | Giữ lời hứa với người chơi khác | +1 | hệ «lời hẹn» giữa hai người chơi (đặt hẹn tổ đội); người hứa có mặt | mọi | 24 giờ | CC-6, CC-9 | YK | |

---

## 11. Khuyên thiện — T-KT «Khuyên người làm thiện», +1 (DEED-146 … 170)

Nhóm này gánh **tuyến Định Mệnh Hội** (bản sơ đồ, Hồi II: mỗi vùng một án lừa đảo) và **kéo người chơi Tà Lộ hồi đầu**. Mỗi án dùng dữ liệu thật để vạch mặt (`chart`, `taisui`, `anti-manipulation-data › detectionPatterns`).

| Mã | Việc | Công | Kích hoạt | Vùng | Hồi chiêu | Chống cày riêng | Hạnh | Âm |
|---|---|---|---|---|---|---|---|---|
| DEED-146 | Vạch mặt quầy «cúng giải Thái Tuế 10 lượng vàng» | +1 × 3 | án vùng: chứng minh tuổi NPC **không** phạm (`personalTaSui`) | `thanh` | 1 lần đời | — | KT | |
| DEED-147 | Vạch mặt «bán bùa đổi cách cục» | +1 × 3 | chứng minh cách cục không đổi bằng bùa (`patternQuality`); dẫn NPC về sảnh Cách Cục | `tubinh` | 1 lần đời | — | KT, HP | |
| DEED-148 | Vạch mặt «thầy mù đoán bừa» giả Manh phái | +1 × 3 | đối chiếu lời phán với `analyzeMangpai` thật | `manh` | 1 lần đời | — | KT | |
| DEED-149 | Vạch mặt «sao Tử Vi xấu phải mua đá» | +1 × 3 | dùng `ziwei` để chỉ sao thật; nói rõ đá không đổi sao | `trichthien` | 1 lần đời | — | KT | |
| DEED-150 | Vạch mặt «nhà phạm sát, phải đập» | +1 × 3 | dùng `fs-cure` chỉ sát thật và cách hóa nhẹ; không đập nhà | `phongthuy` | 1 lần đời | — | KT | |
| DEED-151 | Vạch mặt «ngày đại hung, phải cúng mới cưới được» | +1 × 3 | `zheri › evaluateDate` cho thấy ngày tốt | `lichduong` | 1 lần đời | — | KT | |
| DEED-152 | Vạch mặt «lá số lạnh phải uống thuốc nóng» | +1 × 3 | `han-nuan` điều hậu ≠ thuốc; dẫn tới vu y nói rõ không kê thuốc theo lá số | `cungthong` | 1 lần đời | — | KT | |
| DEED-153 | Vạch mặt «sách cấm đổi mệnh» bán ở Thư Lâu | +1 × 3 | đối chiếu `daozang-data` / `library-data`: sách giả không có trong Đạo Tạng | `thulau` | 1 lần đời | — | KT, HP | |
| DEED-154 | Vạch mặt «hợp hôn khắc, phải chia tay» | +1 × 3 | `hehun › computeHehun` cho thấy mức thật, kèm cách hòa hợp | `thanh` | 1 lần đời | — | KT | |
| DEED-155 | Khuyên NPC đừng tin «mệnh đã định» | +1 | NPC dân thường lặp câu của Khổng tiên sinh; người chơi kể chuyện Liễu Phàm (`LIAOFAN_STORY`) | mọi | 24 giờ | cùng NPC 7 ngày | KT | |
| DEED-156 | Rủ người chơi mới làm việc thiện đầu tiên | +1 | người chơi bậc 1 làm DEED đầu tiên khi đang tổ đội với mình | mọi | 24 giờ | CC-6 | KT, ThT | |
| DEED-157 | Hòa giải hai NPC cãi nhau | +1 | hội thoại chọn lời hòa hợp (`YEGUO[4].cure`: «主动说和合语/调解») | mọi | 24 giờ | — | KT | |
| DEED-158 | Khuyên tay buôn thú bỏ nghề | +1 × 2 | chuỗi 3 bước với tay buôn ở Miêu Cương | `mieucuong` | 1 lần đời | — | KT, YV | |
| DEED-159 | Khuyên con NPC về thăm cha mẹ | +1 | chuỗi gia đình Huyền Thành (canon §5.3) | `thanh` | mỗi gia đình 1 lần | — | KT, KR | |
| DEED-160 | Khuyên người say thôi uống | +1 | tửu quán; NPC say gây gổ; nói lời mềm, đưa về | `thanh` | 24 giờ | — | KT | |
| DEED-161 | Kéo một người chơi Tà Lộ đi Phong Đô | +1 × 3 | người chơi có Nợ Âm > 0 đồng ý theo mình tới Phong Đô và bắt đầu đọc sổ | `phongdo` | mỗi người 1 lần | người được kéo phải chấp nhận; CC-9 | KT, CN | |
| DEED-162 | Báo nội dung lừa đảo trong kênh chung | +1 | dùng nút «báo lừa đảo» trên tin nhắn bán «bùa đổi mệnh» trong game; quản trị xác nhận | mọi | 24 giờ | chỉ khi xác nhận đúng | KT, HP | |
| DEED-163 | Thuyết phục học trò bỏ ý gian lận thi | +1 | sĩ tử NPC định mua sách lận; khuyên | `vanmieu` | mỗi kỳ thi | — | KT | |
| DEED-164 | Dạy trẻ không ném đá chó mèo | +1 | trẻ trêu thú; khuyên, dạy | `thanh`, `mieucuong` | 24 giờ | — | KT, YV | |
| DEED-165 | Khuyên người buôn trả lại hàng cân thiếu | +1 | phát hiện cân điêu; nói riêng với người buôn | `thanh` | 72 giờ | — | KT | |
| DEED-166 | Kể chuyện Liễu Phàm cho người tuyệt vọng | +1 | NPC có cờ «tuyệt vọng nhẹ» (không khủng hoảng) ở Trà Thất | `thanh` | 24 giờ | — | KT | |
| DEED-167 | Giảng phóng sinh đúng cách cho người thả sai | +1 | gặp NPC thả cá kim lý xuống hồ tự nhiên; giảng (§2) | `cungthong`, `buttap` | 48 giờ | — | KT, YV | |
| DEED-168 | Ngăn người định nhận Âm Bài | +1 × 2 | NPC đứng trước quầy Lỗ Ban (Hồi III); thuyết phục thành công | mọi | mỗi NPC 1 lần | — | KT | |
| DEED-169 | Giới thiệu người bị lừa tới đúng thầy | +1 | đưa nạn nhân Định Mệnh Hội tới Bàn Thầy / Mao Sơn đạo nhân | mọi | 24 giờ | — | KT | |
| DEED-170 | Viết bài khuyến thiện treo ở đình | +1 | mini-game thư pháp, nội dung chọn từ `REMEDY_QUOTES` | `vanmieu`, `thanh` | 7 ngày | — | KT, HP | |

---

## 12. Đọc / sao kinh, trì chú — T-KI «Đọc/sao kinh +持咒», +1 (DEED-171 … 190)

**Luật chung nhóm kinh:** mỗi DEED kinh là một **phiên** (đọc thẻ Tàng Kinh, tụng theo nhịp, hoặc chép). Không có nút «tụng nhanh». Thời lượng tối thiểu ghi ở cột Kích hoạt. Nội dung chú **không in toàn văn** ngoài những gì app đã có (bản sơ đồ §5.4); phần tụng dùng **nhịp và âm tiết hư cấu** («a-ma-ra…»), chỉ thẻ đọc mới có câu thật ngắn.

| Mã | Việc | Công | Kích hoạt | Vùng | Hồi chiêu | Chống cày riêng | Hạnh | Âm |
|---|---|---|---|---|---|---|---|---|
| DEED-171 | Tụng Thanh Tĩnh Kinh buổi sớm | +1 | phiên ≥ 3 phút, giờ Mão–Thìn | `chungnam`, `vodang` | 24 giờ | — | HP | ✓ |
| DEED-172 | Đọc thẻ Kinh Dược Sư | +1 | đọc trọn thẻ `JING_ZHOU[0]` ở Tàng Kinh Các | `buttap` | 24 giờ | — | HP | |
| DEED-173 | Đọc thẻ Kinh Địa Tạng | +1 | `JING_ZHOU[1]` | `buttap`, `phongdo` | 24 giờ | — | HP | |
| DEED-174 | Đọc thẻ Kinh Kim Cang | +1 | `JING_ZHOU[2]` | `yentu` | 24 giờ | — | HP | |
| DEED-175 | Đọc thẻ Phổ Môn | +1 | `JING_ZHOU[3]` | `buttap` | 24 giờ | — | HP | |
| DEED-176 | Đọc thẻ Lăng Nghiêm | +1 | `JING_ZHOU[4]` | `buttap` | 24 giờ | — | HP | |
| DEED-177 | Trì Chuẩn Đề 21 biến | +1 | phiên lần chuỗi 21 hạt (nhịp) | `tangdia`, `buttap` | 24 giờ | — | HP | ✓ |
| DEED-178 | Trì Chuẩn Đề 108 biến | +1 × 2 | phiên 108 hạt (≈ 9 phút) | `tangdia`, `buttap` | 24 giờ | thay DEED-177 ngày đó | HP | ✓ |
| DEED-179 | Chép một trang kinh | +1 | mini-game chép nét | mọi tàng kinh | 24 giờ | — | HP | ✓ |
| DEED-180 | Tụng công khóa sớm tối Toàn Chân | +1 | hai phiên sớm + tối cùng ngày | `chungnam` | 24 giờ | — | HP | |
| DEED-181 | Tụng Bắc Đẩu Kinh dịp bái Đẩu | +1 | phiên trong lễ bái Đẩu (`amta-data › remedy-songjing`) | `longho`, `thanh` | 7 ngày | — | HP | |
| DEED-182 | Tụng Tam Quan Kinh ngày Tam Nguyên | +1 | Thượng / Trung / Hạ Nguyên | `thanh`, `cungthong` | theo lễ | — | HP | |
| DEED-183 | Niệm Phật một tràng (108) ở Bút Tháp | +1 | phiên niệm theo nhịp mõ | `buttap` | 24 giờ | — | HP | ✓ |
| DEED-184 | Ngồi nghe giảng kinh trọn buổi | +1 | buổi giảng (sự kiện lịch) ≥ 10 phút | thánh địa | 24 giờ | không AFK: có 3 câu hỏi nhanh giữa buổi | HP | |
| DEED-185 | Đọc một quyển Đạo Tạng ở thư khố | +1 | đọc trọn thẻ một quyển `DAOZANG` (do `suggestDaozangChartAware` gợi ý) | `chungnam` | 24 giờ | mỗi quyển 1 lần đời | HP | |
| DEED-186 | Tụng Tâm Kinh khi thắp đèn | +1 | phiên ngắn ở hồ sen | `buttap`, `thanh` | 24 giờ | — | HP | ✓ |
| DEED-187 | Chép Thái Thượng Cảm Ứng Thiên treo ở nhà | +1 | chép câu `REMEDY_QUOTES[1]` thành bức treo | `thanh` | 7 ngày | — | HP | |
| DEED-188 | Tụng Độ Nhân Kinh trong khoa nghi Linh Bảo | +1 | tham gia khoa nghi (05-08) | `chungnam` | 7 ngày | — | HP | |
| DEED-189 | Trì chú Kim Quang trước khi vào Phong Đô | +1 | phiên nhịp ở cổng Phong Đô; thẻ đọc chỉ có tên và ý nghĩa của `ZHOU_JIN_GUANG` | `phongdo` | 24 giờ | — | HP | |
| DEED-190 | Đọc thẻ Thập Thiện Nghiệp Đạo | +1 | đọc thẻ «十善業道經» (thẻ Tàng Kinh của game, dẫn `YEGUO[9].cure`) | `buttap` | 24 giờ | — | HP | |

---

## 13. Hưng kiến đại lợi, việc tập thể (DEED-191 … 198)

Nhóm này không có mục riêng trong `CONG_QUA` (app chỉ có hạnh `TEN_THIEN › 兴建大利`). Ghi sổ vào mục **«Giúp người khó khăn»** với `count` tăng theo quy mô.

| Mã | Việc | Công | Kích hoạt | Vùng | Hồi chiêu | Chống cày riêng | Hạnh | Âm |
|---|---|---|---|---|---|---|---|---|
| DEED-191 | Sửa cầu đá liên vùng | +2 | sự kiện tuần (Chủ nhật); góp 10 phút công | các đường liên vùng | theo sự kiện | ≤ 1 / sự kiện | HK | |
| DEED-192 | Lát lại đường hành hương Yên Tử | +2 × 2 | sự kiện tháng; hoàn tất đoạn được giao | `yentu` | theo sự kiện | — | HK | |
| DEED-193 | Đào giếng cho trại khô hạn | +2 × 2 | sự kiện mùa hạn; tổ đội ≥ 4 | `mieucuong` | theo sự kiện | — | HK | |
| DEED-194 | Dựng đèn đường Phong Đô | +2 | góp dầu và dựng một cột đèn (Hồi IV, lộ cứu người) | `phongdo` | 7 ngày | — | HK, CN | |
| DEED-195 | Trồng rừng chắn gió Chung Nam | +2 | trồng 10 cây | `chungnam` | 7 ngày | — | HK, YV | ✓ |
| DEED-196 | Xây trường làng (môn phái) | +2 × 3 | dự án môn phái hoàn thành | `mieucuong` | 1 lần / dự án | chia cho người góp ≥ 30 phút | HK | |
| DEED-197 | Nạo vét kênh Cùng Thông Hồ | +2 | sự kiện mùa thu | `cungthong` | theo sự kiện | — | HK | |
| DEED-198 | Dựng chòi nghỉ trên đường tuyết | +2 | Tạng Địa, đoạn đèo | `tangdia` | 7 ngày | — | HK | |

---

## 14. Việc ác (DEED-201 … 245)

**Cột thêm:** «Nghiệp» = thanh nghiệp tăng và lượng (05-05 §2.3 định nghĩa: `p × 8` cho thanh chính, một nửa cho thanh phụ). «Sửa» = việc sửa bắt buộc để gạch dòng quá (05-05 §5).
Mọi việc ác đều xuất hiện như **lựa chọn**, có thẻ hậu quả trước khi chọn. Không có DEED ác nào tự động.

### 14.1 Sát sinh — A-SS «Sát sinh (giết mạng)», −3

| Mã | Lựa chọn | Công | Ngữ cảnh | Nghiệp | Sửa |
|---|---|---|---|---|---|
| DEED-201 | Giết gà cúng theo lời thầy bói giả | −3 | quầy Định Mệnh Hội bảo «phải cắt tiết gà mới qua hạn» | KARMA-SAT +24, KARMA-SI +12 | 3 DEED phóng sinh + vạch mặt quầy đó |
| DEED-202 | Đập chết con rắn trong giỏ | −3 | DEED-008 nhánh ngược: chọn «để tôi đập» | KARMA-SAT +24, KARMA-SAN +12 | 3 DEED phóng sinh |
| DEED-203 | Câu trộm cá trong hồ phóng sinh để bán | −3 | tay buôn thuê; câu ở hồ Bút Tháp | KARMA-SAT +24, KARMA-DAO +12 | trả tiền công cho chùa + 3 DEED phóng sinh |
| DEED-204 | Đặt bẫy thú cho tay buôn | −3 | nhận việc ở Miêu Cương | KARMA-SAT +24, KARMA-THAM +12 | tháo mọi bẫy đã đặt + DEED-005 ×2 |
| DEED-205 | Dùng «cổ trùng» giả của Lỗ Ban (Tà Lộ) | −3 | Tà Lộ: vật hư cấu; nghi thức ẩn, không mô tả | KARMA-SAT +24 + Nợ Âm | chuỗi CQ-HD tương ứng (05-12) |
| DEED-206 | Bỏ mặc con thú bị thương khi đã thấy | (không phải ác) | **không tính** — không cứu không phải là giết (AC-3) | — | — |
| DEED-207 | Mua cá sống để «làm món» khi đang giữ giới chay | −3 | trai đường không có; chỉ quán ven đường; người chơi đang giữ giới chay của một đạo | KARMA-SAT +24 + phạm giới | sám hối của đạo + 1 DEED phóng sinh |
| DEED-208 | Ra lệnh đánh chó canh trại để lẻn vào | −3 | chuỗi Tà Lộ Hồi III, lựa chọn bạo lực | KARMA-SAT +24, KARMA-SAN +12 | CQ-HD |

*(DEED-206 giữ trong bảng để ghi rõ: game không trừng phạt sự bất lực hay bỏ lỡ.)*

### 14.2 Trộm cắp — A-TC «Trộm cắp/lấy không nên lấy», −3

| Mã | Lựa chọn | Công | Ngữ cảnh | Nghiệp | Sửa |
|---|---|---|---|---|---|
| DEED-211 | Lấy tiền trong hòm công đức | −3 | hòm không người canh | KARMA-DAO +24 | trả gấp đôi vào hòm + xin lỗi sư trụ trì |
| DEED-212 | Giữ túi tiền nhặt được | −3 | DEED-055 nhánh ngược | KARMA-DAO +24 | tìm chủ trả lại + bồi thường |
| DEED-213 | Lấy thuốc của vu y khi bà vắng | −3 | vườn thuốc | KARMA-DAO +24 | trả lại + hái thuốc giúp 3 lần |
| DEED-214 | Chép bài thi của người khác | −3 | khoa cử; «lấy không nên lấy» (lấy chữ) | KARMA-DAO +24, KARMA-VONG +12 | tự khai với giám khảo (bị đánh trượt kỳ đó) |
| DEED-215 | Ăn chặn tiền cứu trợ khi chở hàng | −3 | DEED-072 nhánh ngược | KARMA-DAO +24, KARMA-THAM +12 | trả đủ + chở thêm 3 chuyến |
| DEED-216 | Trốn tiền đò | −3 | đò Cùng Thông Hồ | KARMA-DAO +24 | trả gấp đôi |
| DEED-217 | Lấy đồ cúng trên mộ | −3 | nghĩa trang Phong Đô | KARMA-DAO +24, KARMA-SI +12 | đặt lại + DEED-122 ×2 |
| DEED-218 | Nhận vơ công cứu người để lấy thưởng | −3 | DEED-140 nhánh ngược («lấy không nên lấy» — lấy công) | KARMA-DAO +24, KARMA-VONG +12 | nói thật với NPC + chuyển phần thưởng cho người thật |
| DEED-219 | Bán sách lận cho sĩ tử | −3 | chợ đen Văn Miếu | KARMA-DAO +24, KARMA-THAM +12 | khai với Tế tửu + kèm 3 sĩ tử ôn |
| DEED-221 | Giữ tiền thối dư của người bán | −3 | DEED-118 nhánh ngược | KARMA-DAO +24 | trả lại |

### 14.3 Dối trá — A-DT «Dối trá/lừa gạt», −2

| Mã | Lựa chọn | Công | Ngữ cảnh | Nghiệp | Sửa |
|---|---|---|---|---|---|
| DEED-222 | Nói với khách «chắc chắn trăm phần trăm» | −2 | sảnh nghề | KARMA-VONG +16 | quay lại nói rõ với khách |
| DEED-223 | Phán bừa cho khách để lấy thêm thưởng | −2 | sảnh nghề có lựa chọn «nói điều khách muốn nghe» | KARMA-VONG +16, KARMA-THAM +8 | giải lại đúng cho khách |
| DEED-224 | Bán bùa giả ở chợ | −2 × 2 | Định Mệnh Hội mời làm «đại lý» | KARMA-VONG +16, KARMA-THAM +8 | thu hồi bùa, hoàn tiền mọi người mua |
| DEED-225 | Khai gian để vào điện cấm | −2 | lính gác hỏi; nói dối | KARMA-VONG +16 | tự thú với người gác |
| DEED-226 | Hứa giúp rồi không đến | (không phải ác) | không giữ hẹn **không** bị phạt (chỉ mất cơ hội DEED-132) — chỉ tính ác khi người chơi **chủ động** chọn câu hứa mà hệ thống đã đánh dấu là «hứa suông» | — | — |
| DEED-227 | Hứa suông để NPC đưa đồ | −2 | lựa chọn có thẻ «hứa suông» | KARMA-VONG +16 | quay lại làm đúng lời hứa |
| DEED-228 | Đổ lỗi cho người khác khi giải sai | −2 | thầy hỏi vì sao sai | KARMA-VONG +16, KARMA-LUONG +8 | nhận lỗi với thầy |
| DEED-229 | Giả làm đạo sĩ thụ lục để làm lễ thuê | −2 × 2 | Tà Lộ / chợ | KARMA-VONG +16 | thú nhận với Trương Thiên Sư |

### 14.4 Tà dâm — A-TD «Tà dâm», −2

Nội dung **không mô tả tình dục**. Trong game, mục này chỉ gồm việc **phá hôn nhân / tình cảm của người khác** hoặc **dùng bùa mê** (vật hư cấu của Định Mệnh Hội). Không có lựa chọn nào liên quan quan hệ giữa người chơi với nhau.

| Mã | Lựa chọn | Công | Ngữ cảnh | Nghiệp | Sửa |
|---|---|---|---|---|---|
| DEED-231 | Dùng «bùa mê tình» lên NPC | −2 | Định Mệnh Hội bán; Tà Lộ | KARMA-DAM +16 + Nợ Âm nếu Tà Lộ | gỡ bùa (chuỗi Mao Sơn) + xin lỗi |
| DEED-232 | Làm người đưa thư giấu chuyện ngoại tình | −2 | NPC có gia đình nhờ | KARMA-DAM +16, KARMA-VONG +8 | từ chối tiếp tục + khuyên NPC |
| DEED-233 | Phá đám cưới bằng tin đồn | −2 | NPC ghen thuê | KARMA-DAM +16, KARMA-LUONG +8 | đính chính trước làng |
| DEED-234 | Ép đôi trẻ chia tay theo lời «hợp hôn khắc» | −2 | DEED-154 nhánh ngược | KARMA-DAM +16 | giải lại `computeHehun` cho đôi trẻ |

### 14.5 Không hiếu thuận — A-BH «Không hiếu thuận», −2

| Mã | Lựa chọn | Công | Ngữ cảnh | Nghiệp | Sửa |
|---|---|---|---|---|---|
| DEED-235 | Bỏ về giữa bữa cơm với ông bà chủ trọ | −2 | DEED-107 nhánh ngược (chọn «tôi bận») | KARMA-SI +16 (trái ân) | DEED-107 ×2 |
| DEED-236 | Lớn tiếng với thầy | −2 | hội thoại thẻ `nghich_thuong` mức nặng | KARMA-AC +16 | DEED-112 |
| DEED-237 | Đập phá bàn thờ gia tiên trong cơn giận | −2 | chỉ có ở nhánh Tà Lộ Hồi IV | KARMA-SAN +16, KARMA-SI +8 | dựng lại + DEED-102 ×3 |

### 14.6 Lời tổn thương — A-LT «Nói lời tổn thương», −1

| Mã | Lựa chọn | Công | Ngữ cảnh | Nghiệp | Sửa |
|---|---|---|---|---|---|
| DEED-238 | Chế giễu sĩ tử thi trượt | −1 | bảng vàng | KARMA-AC +8 | xin lỗi + DEED-121 |
| DEED-239 | Nói «lá số mày xấu thế thì làm gì được» với NPC | −1 | khách ở sảnh nghề | KARMA-AC +8, KARMA-Y +4 | quay lại giải theo tinh thần T2 |
| DEED-240 | Xúc phạm người ăn xin | −1 | bậc Sơn Môn | KARMA-AC +8 | xin lỗi + DEED-082 |
| DEED-241 | Mỉa mai người chơi khác bằng câu soạn sẵn | −1 | hệ thoại nhanh MMO có câu mỉa (để người chơi **chọn** không dùng) | KARMA-AC +8 | gửi câu xin lỗi soạn sẵn tới người đó |

### 14.7 Uống rượu say — A-RU «Uống rượu say», −1

| Mã | Lựa chọn | Công | Ngữ cảnh | Nghiệp | Sửa |
|---|---|---|---|---|---|
| DEED-242 | Uống chén thứ ba ở tửu quán | −1 | chén 1–2 không tính; chén 3 có thẻ «say» | (không có thanh) — phạm giới nếu đạo cấm rượu | ngày hôm sau không uống + giúp dọn quán |
| DEED-243 | Chuốc rượu khách để moi bí mật | −1 | điều tra án | KARMA-VONG +8 | xin lỗi khách |

### 14.8 Giận dữ mất kiểm soát — A-GD, −1

| Mã | Lựa chọn | Công | Ngữ cảnh | Nghiệp | Sửa |
|---|---|---|---|---|---|
| DEED-244 | Đập bàn ở sảnh khi bị khách mắng | −1 | lựa chọn có thẻ `san` (Ngũ Bộ Chuyển Niệm có thể chen) | KARMA-SAN +8 | quay lại, xin lỗi, giải tiếp |

### 14.9 Đố kỵ / tham — A-DK, −1

| Mã | Lựa chọn | Công | Ngữ cảnh | Nghiệp | Sửa |
|---|---|---|---|---|---|
| DEED-245 | Tranh suất khách quý của người chơi bậc thấp | −1 | DEED-124 nhánh ngược | KARMA-THAM +8 | nhường 3 lần sau |

*(Số mã trống trong khoảng 201–245 — 206, 209, 210, 220, 226, 230 — để dành cho bổ sung; 206 và 226 dùng làm dòng ghi chú «không phải ác».)*

---

## 15. Thống kê kiểm danh mục

| Nhóm | Số DEED | Hồi chiêu ngắn nhất | Ghi chú |
|---|---|---|---|
| T-PS Phóng sinh | 20 | 24 giờ | 1 nhánh âm tổng (DEED-020) |
| T-CN Cứu người | 25 | 24 giờ | 7 việc `count ×2` (một lần đời / sự kiện) |
| T-GN Giúp người | 35 | 24 giờ | |
| T-BT Bố thí | 20 | 24 giờ | ngưỡng tỷ lệ |
| T-HT Hiếu | 15 | 24 giờ | 3 đối tượng hiếu |
| T-AC Âm chất | 10 | 24 giờ | + nhánh âm của 50 DEED nhóm khác có ✓ |
| T-CH Chay | 6 | 24 giờ | tự kiểm cuối ngày |
| T-GL Giữ lời | 14 | — | |
| T-KT Khuyên thiện | 25 | 24 giờ | 9 án Định Mệnh Hội (8 sảnh + chợ) |
| T-KI Kinh chú | 20 | 24 giờ | không tụng nhanh |
| Tập thể | 8 | theo sự kiện | ghi vào T-GN |
| **Thiện cộng** | **198** | | |
| Ác (thật sự có điểm) | 39 | — | 2 dòng ghi chú «không phải ác» (206, 226); 4 mã trống dự trữ |

**Kiểm cân bằng nhanh:** một ngày «đều đặn» (30–45 phút) thường gặp: 1 DEED kinh (+1), 1 DEED giúp người (+2), 1 bố thí (+2) hoặc hũ phúc, 1 ngày chay (+1) → 5–6 công, khớp nhịp 05-03 §4.2.

---

## 16. Checklist nghiệm thu 05-04

- [ ] ≥ 200 DEED (hiện 198 thiện + 39 ác có điểm = 237 luật ghi sổ).
- [ ] Mọi DEED có nhóm `CONG_QUA` và `action` nguyên văn app; không DEED nào có điểm khác `p × count`.
- [ ] Mọi DEED «cứu / giúp» có nhu cầu do thế giới sinh (CC-5); không có cách tạo nhu cầu.
- [ ] Bảng phóng sinh đúng / sai nơi được cài; thả sai = 0 công + lời giảng.
- [ ] Bố thí không hữu hiệu khi đang nợ; không có bố thí bằng Ngọc.
- [ ] Mọi DEED ác là lựa chọn có thẻ hậu quả; DEED-206, DEED-226 chứng minh game không phạt việc bỏ lỡ.
- [ ] Nội dung «tà dâm» không có mô tả tình dục.
- [ ] Không DEED kinh nào in toàn văn chú ngoài phạm vi app cho phép.
