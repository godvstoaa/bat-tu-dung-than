# CÂY & QUÁN — MANIFEST (v5.2)

Quy chuẩn cho **cây trong thành** và **nội thất quán / tiệm**. Viết trước khi dựng, theo
`~/.claude/rule.md §2`. Lệch khỏi đây thì sửa manifest trước, ghi lý do.

Người chơi nhận xét (2026-11-12, kèm ảnh):
- «Cây như thế này cũng gọi là cây à?» — tán là khối 12 mặt phẳng, thân trụ 6 cạnh.
- «Quán nào cũng sơ sài… có biết thế nào là quán không» — bàn là hộp, đệm tròn ngồi sàn, tường trống, giữa phòng trống.

---

## 1. Nghiên cứu (nguồn đã xem)

| Nguồn | Học được |
|---|---|
| **Mộng Lương Lục**, quyển 16, mục 茶肆 (Ngô Tự Mục, cuối Tống) — [Wikisource](https://zh.wikisource.org/zh/%E5%A4%A2%E7%B2%B1%E9%8C%84/%E5%8D%B716) | «今杭城茶肆亦如之，插四時花，掛名人畫，裝點店面» (quán trà Hàng Châu cắm hoa bốn mùa, treo tranh danh hoạ để trang trí mặt tiệm). «列花架，安頓奇杉異檜等物於其上» (bày giá hoa, đặt tùng bách lạ lên trên). Đồ đựng là chén sứ, khay sơn mài. → Quán trà phải có **hoa, tranh, giá cây cảnh**. |
| **Đô Thành Kỷ Thắng** (Nại Đắc Ông) | Trà phường lớn treo thư hoạ danh nhân để khách ngồi lâu. → **Tường không được trống.** |
| **Đông Kinh Mộng Hoa Lục**, quyển 3 | Tiệm thuốc họ Tống có hai vách vẽ sơn thuỷ Lý Thành. Tửu lâu: cửa kết hoa (彩樓歡門), trong có hành lang và **các gian nhỏ ngăn riêng** (閣子), đèn nến sáng rực. → Tửu lâu có **gian ngăn bằng bình phong**, đèn dày. |
| **Thanh Minh thượng hà đồ** (Trương Trạch Đoan) — [ResearchGate](https://www.researchgate.net/publication/414931901_The_Space_and_Daily_Life_of_Song_Dynasty_Civilians_as_Seen_from_along_the_River_During_the_Qingming_Festival_and_Dongjing_Menghualu) | Quán trà / tửu điếm: **bàn vuông + ghế dài / ghế tựa**, tiểu nhị đi giữa các bàn. Liễu rủ ven sông Biện, cây lớn tán rộng che quán. |
| **Lịch sử nội thất Tống** — [Virginia Tech](https://vtechworks.lib.vt.edu/bitstreams/6f826be7-0f39-4131-aaa0-23e2fa19adeb/download) | Đời Tống phổ biến **bàn ghế chân cao**, người ngồi ghế, không ngồi chiếu. → Bỏ kiểu đệm tròn ngồi sàn trong quán (kiểu Nhật). |
| **Đồ trà Tống** — [Umi Tea Sets](https://www.umiteasets.com/blogs/umi-tea-sets-blog/tea-dinking-method-and-teawares-in-song-dynasties) | Lò phong lô đun nước, ấm, chén, khay sơn mài. → Quầy trà có **lò, ấm, khay**. |
| **Phố cây Trường An (槐街)** | Đại lộ trồng **hoè**, du; liễu ven kênh; vườn sân có đào, mận, tùng, tre, phong. |
| **Cây trong game stylized** — [three.js forum, fluffy tree](https://discourse.threejs.org/t/fluffy-tree-anime-style/86626), [Shengyu forest devlog](https://shengyugames.com/devlog/three-js-forest-scene), [nhance foliage](https://nhance-school.com/tools/glossary/foliage-looks-fake) | Tán phải là **nhiều chùm lá có thể tích**, không phải một khối đặc. Màu biến thiên từng cây. Gió đẩy đỉnh theo độ cao (shader, không tốn CPU). Biên độ nhỏ, lá nhẹ hơn thân. |
| **Kho model sẵn có** (`public/models`, Meshy, đã xem từng cái) | **Cây:** `tree_peach` (đào), `lib_blossom` (anh đào), `lib_willow` (liễu), `lib_bonsai` (tùng dáng Hoàng Sơn) — có cành thân thật. **Đồ gỗ kiểu Minh, khoảng 6k tam giác, có texture:** `pr_chair` (ghế bành), `pr_chair_red` (quan mạo), `pr_table_long` (bàn vuông bát tiên), `pr_table_round` (bàn tròn), `pr_table_ming` (án), `pr_teaset`, `pr_screen_*`, `pr_jar_porcelain`, `pr_vase_*`, `pr_cabinet*`, `scholar_desk`, `pr_fishbowl`. Trước đây quán **không dùng** chúng cho bàn ghế, mà dựng hộp. |

---

## 2. Quy chuẩn CÂY (V = kiểm bằng số / ảnh)

1. **Không còn tán khối đa giác.** Mọi cây phố, sân, vườn, quảng trường dùng **model cây thật** (cành thân rõ), trừ tre (thủ tục, xem mục 4).
   - Gần ≤ 45 m (máy yếu ≤ 28 m): bản `.vc` khoảng 4–5k tam giác.
   - 45–150 m: bản `.vc2` khoảng 0,7–1,2k tam giác.
   - Xa hơn 150 m: ẩn, như §3.11 của THANH-MANIFEST.
2. **8 loài, theo chỗ trồng** (đúng sử liệu §1):

   | Loài | Model | Cao (m) | Trồng ở |
   |---|---|---|---|
   | Hoè 槐 (lá xanh, tán tròn) | `tree_peach` nhuộm xanh | 7–10 | đại lộ, quanh quảng trường |
   | Du 榆 (xanh đậm, tán xoè) | `lib_blossom` nhuộm xanh đậm | 8–11 | đại lộ, đa phường (×1,8) |
   | Đào 桃 (hồng) | `tree_peach` | 4–5,5 | sân trong, vườn |
   | Anh đào / mận (trắng hồng) | `lib_blossom` | 4,5–6 | sân trong, vườn, sân góc |
   | Phong 楓 (đỏ cam) | `lib_blossom` nhuộm đỏ cam | 5–7 | vườn, sân góc |
   | Liễu 柳 | `lib_willow` | 6–8,5 | ven nước, vành, quảng trường chợ |
   | Tùng 松 (dáng Hoàng Sơn) | `lib_bonsai` | 6–9 | quảng trường phường (cạnh đình), vườn |
   | Tre 竹 | thủ tục: thân có đốt và chùm lá dạng thẻ lá | 6–10 | sau tường rào, góc vườn |

3. **Đa dạng.**
   - Cao lệch ±15% theo hạt giống; xoay ngẫu nhiên; độ sáng lệch ±8% từng cây.
   - Hàng đại lộ: một bên một loài (nhịp), nhưng không có hai cây liền kề cùng chiều cao và cùng góc xoay.
   - Mỗi sân trong có ≥ 2 loài (V).
4. **Tre:**
   - Thân 5 cạnh có vòng đốt (vạch sẫm mỗi 0,4 m); lá là thẻ phẳng có texture lá (alpha), 6–9 chùm mỗi thân.
   - Không dùng hình cầu hay khối đa diện làm lá.
5. **Gió:**
   - Shader đỉnh. Biên độ đỉnh ngọn khoảng 1,5–3% chiều cao, tăng từ 35% chiều cao trở lên, gốc đứng yên.
   - 2 tần số (0,2 Hz và khoảng 0,6 Hz), lệch pha theo vị trí.
   - Liễu biên độ ×1,6.
   - Không cập nhật gì trên CPU ngoài một uniform thời gian.
6. **Ngân sách:**
   - Tam giác cây trong tầm ≤ 900k ở mức thường, ≤ 350k ở mức thấp.
   - Lệnh vẽ cây ≤ 2 × số loài × số ô gần.
   - Chia gần / xa tối đa 3 lần mỗi giây, chỉ khi người chơi đi > 6 m.
   - Bóng: chỉ bản gần, và không đổ bóng ở mức thấp.

## 3. Quy chuẩn QUÁN / TIỆM

1. **Bàn ghế là model thật, không phải hộp.**
   - Trà lâu và tửu lâu: bàn vuông bát tiên (`pr_table_long`) hoặc bàn tròn (`pr_table_round`), có ghế tựa (`pr_chair` / `pr_chair_red`).
   - Mỗi bàn 2–4 ghế quay vào bàn. Trên bàn có bộ trà (`pr_teaset`) hoặc vò rượu và chén.
   - **Không có đệm ngồi sàn** (Tống ngồi ghế).
2. **Tường không trống (V: ≥ 4 món treo hoặc dựa tường mỗi vách dài ≥ 8 m).**
   - Tranh danh hoạ hoặc thư pháp (2–4).
   - Trà lâu và tửu lâu có **thuỷ bài** (bảng gỗ tên món, chữ đỏ đen) sau quầy, 4–8 tấm.
   - **Án dựa tường** (`pr_table_ming`) có bình hoa bốn mùa hoặc bình sứ.
   - Tủ, kệ hàng (`pr_cabinet*`) ở tiệm bán.
3. **Hoa và cây cảnh** (Mộng Lương Lục): mỗi quán ≥ 2 điểm xanh.
   - Giá hoa có chậu tùng cảnh (`lib_bonsai.vc`).
   - Bình hoa có cành hoa theo mùa (thủ tục: cành và hoa nhỏ).
   - Cây trong chậu ở góc cửa.
4. **Bố cục theo nghề, ≥ 3 mẫu mỗi loại (chọn theo khoá phòng):**
   - **Trà lâu:**
     - quầy trà sau, có lò phong lô, ấm, chum nước;
     - sân khấu thuyết thư một góc (bục, bình phong, ghế bành);
     - 3–6 bàn chia hai dãy, lối giữa ≥ 1,4 m.
   - **Tửu lâu:**
     - quầy chưởng quầy, có chum rượu xếp tầng;
     - 2–3 **gian ngăn** sát vách bằng bình phong (`pr_screen_*`), mỗi gian một bàn;
     - giữa phòng có 2–4 bàn tròn hoặc vuông;
     - đèn lồng ≥ 4.
   - **Tiệm bán:**
     - quầy có hàng, kệ hoặc tủ sau quầy, hàng bày dọc vách (giữ như cũ);
     - thêm bàn tiếp khách (án nhỏ, 2 ghế, bộ trà);
     - thêm giá hoa và tranh.
5. **Mật độ:**
   - Đồ chiếm 25–40% sàn.
   - Lối đi từ cửa tới quầy và mọi điểm tương tác ≥ 1,2 m. Va chạm đúng với từng bàn và ghế.
   - Không để khoảng trống giữa phòng lớn hơn 4 × 4 m (V: kiểm bằng lưới 1 m).
6. **Ánh sáng:** đèn lồng treo 3–6 ngọn (không vượt giới hạn 8 đèn mỗi phòng). Quầy có đèn riêng.
7. **Hiệu năng:**
   - Mỗi model dùng **InstancedMesh** (một lệnh vẽ mỗi lưới của model), không clone từng cái.
   - Mỗi phòng ≤ 60 lệnh vẽ đồ đạc, ≤ 400k tam giác.
   - Phòng chỉ dựng khi bước vào, như cũ.

## 4. Checklist kiểm (kết quả 2026-11-12, máy dev, `scripts/shot-city.mjs`)

- [x] Ảnh phố, trước (`shots/cay-truoc`) và sau (`shots/cay-sau4`): có thân cành và tán thật, nhiều loài và màu.
  - Thêm **thẻ lá** cho cây trong 45 m: tán có lá, không còn mặt tam giác lớn.
  - Thêm **pháp tuyến cầu** cho tán: sáng như một khối mềm.
  - Model dáng bonsai được «cây hoá»: thân thon ×0,4–0,65, tán nâng lên 34–42% chiều cao.
- [x] Quảng trường phường: du cổ thụ (×1,8), đôi tùng trước đình, hàng hoè quanh sân đình.
- [x] 2 trà lâu và 3 tửu lâu (`shots/quan-sau2`): ba kiểu bố cục mỗi loại.
  - Bàn ghế model, bộ trà hoặc vò rượu trên bàn.
  - Thuỷ bài treo trên quầy.
  - Giá hoa cắm hoa bốn mùa, tùng cảnh.
  - Gian ngăn bằng bình phong (tửu lâu).
  - Lò phong lô và chum nước (trà lâu); chum phình bụng nắp giấy đỏ xếp tầng (tửu lâu).
  - Bỏ đệm ngồi sàn.
  - Khoảng trống > 4 × 4 m được lấp tự động (`fillEmpty`).
- [x] Tiệm bán (dược phòng, lò gốm): bàn tiếp khách hai ghế có bộ trà; giá hoa và tùng cảnh hai góc vách sau; tranh vách cửa.
- [x] Số đo phố đông (đại lộ 3, 640; mức thường):

  | | v5.1 | v5.2 |
  |---|---|---|
  | Tam giác cảnh | 3,04 M | 2,93 M |
  | Lệnh vẽ | 1.166 | 1.146 |
  | fps | 26 | 27 |

  - Cây trong tầm: 2 bản cao + 22 gần + 129 xa = 280k tam giác (ngân sách ≤ 900k).
  - Mức thấp: 36 fps; cây trong tầm 28k tam giác (ngân sách ≤ 350k).
  - Trong quán: 60 fps, 164–445 lệnh vẽ.
- [x] 34 `test-game-*` xanh; build web OK.

Kèm đợt này (hiệu năng, không thuộc cây và quán):
- Dân thành quét theo ứng viên gần và dựng nhãn DOM lười: 1,13 → 0,011 ms / khung; 832 → 55 nút nhãn.
- Khi giả lập CPU chậm 4×: 2,2 → 18,8 fps (`scripts/bench-citizens.mjs`).

## 5. Goal phát triển (tự theo đuổi sau khi đạt mục 4)

**G-5.3 «Phố có mùa»:**
- Cây và hoa đổi theo mùa của lịch game:
  - xuân: đào và anh đào nở;
  - hạ: xanh đậm;
  - thu: phong đỏ, du vàng;
  - đông: cành trơ, tùng giữ xanh.
- Bình hoa trong quán đổi đúng «tứ thời hoa»: mai, lan, cúc, sen.
- **Tiêu chí:** 4 ảnh cùng một góc phố khác mùa rõ rệt; không thêm tam giác (chỉ đổi màu đỉnh bằng uniform).
- **Bước kế:** nối uniform mùa từ `calendar` vào shader cây.
