# 08-19 · Sản xuất bộ mô-đun: bố cục atlas, hình học mảnh then chốt, prompt đạo cụ anh hùng

> Hướng dẫn cho tech artist khi dựng bộ mô-đun (08-05, 08-06). Ba việc: (1) **bố cục atlas** mỗi bộ — dải nào chứa họa tiết gì để mọi mảnh dùng chung một ảnh; (2) **cách dựng hình** cho các mảnh then chốt (cột, đấu củng, bức bàn, khung che vết cắt, bậc xoắn, mái lót) theo ngân sách; (3) **prompt Meshy** cho đạo cụ anh hùng, kèm quy tắc duyệt.

---

## 1. Bố cục atlas (trim sheet) chung

Mỗi bộ: **một ảnh màu 2048 × 2048** (bản `mid` 1024, `low` 512) + ảnh ORM + ảnh pháp tuyến cùng bố cục. Chia làm hai nửa:

```
 y 0    ┌─────────────────────────────── 2048 ───────────────────────────────┐
        │ D01 │ D02 │ D03 │ … │ D16   ← 16 dải ngang, mỗi dải cao 64 px (1024 px) │  nửa trên: DẢI
        │  (lặp theo chiều ngang — dùng cho xà, gờ, viền, cột, ván)            │  (tileable theo U)
 y 1024 ├──────────────────────────────┬───────────────────────────────────────┤
        │ Ô 512 × 512 × 4 (hoa văn ô    │ Ô 256 × 256 × 8 (chi tiết: mặt rồng,  │  nửa dưới: Ô
        │ vuông lặp hai chiều: sàn,     │ hoa sen, nút đồng, khóa, chạm thủng   │  (lặp hai chiều
        │ trần ô cờ, ngói, giấy dán)    │ có alpha)                             │   hoặc đặt riêng)
 y 2048 └──────────────────────────────┴───────────────────────────────────────┘
```

Quy tắc:

- Dải **lặp theo U**, cao cố định; mảnh dài (xà 3,2 m) ánh xạ U theo chiều dài thật: 1 m = 256 px (mật độ 256 px/m ở bản 2048; 128 px/m ở bản `mid`).
- Ô dưới lặp hai chiều hoặc đặt nguyên (chi tiết).
- **Màu khóa vùng nhân vào ảnh xám** (08-02 §3.4): vẽ atlas ở **độ sáng trung tính**, giữ sắc độ trong ảnh cho chi tiết (vàng thếp, xanh toàn tỉ) nhưng thân màu chính (đỏ son, gỗ) vẽ xám để nhân `color`.
- Chạm thủng / lưới cửa / giấy: kênh alpha trong ảnh màu (`alphaTest 0,5`).
- Chỗ vẽ chữ (hoành phi, câu đối, bia) **không** vẽ chữ vào atlas — để nền gỗ / đá trống; chữ là `CanvasTexture` riêng (08-17 §7.5).

### 1.1 MOD-BAC

| Vùng atlas | Nội dung |
|---|---|
| D01 | gỗ sơn son trơn (vân dọc mờ) — cột, tường lót, cửa |
| D02 | gỗ sơn son có nứt sơn / mòn mép — cột hiên, ngưỡng |
| D03 | gờ vàng thếp (viền 8 px trên + dưới) — gờ xà, gờ bệ |
| D04 | **toàn tỉ hoa văn** lam lục (đoạn giữa xà) |
| D05 | toàn tỉ đầu xà (hoa xoáy hai đầu) |
| D06 | đấu củng: mặt cắt gỗ sơn lục viền trắng |
| D07 | gạch xám mặt tường (chạy) |
| D08 | đá trắng hoa cương (lan can, bậc) |
| D09 | đá chân tảng (vân trống) |
| D10 | vải vàng phướn (sọc dệt) |
| D11 | vải đỏ khăn bàn thờ |
| D12 | đồng xỉn (lư, chuông nhỏ) |
| D13 | gỗ sẫm trơn (án thư, kệ) |
| D14 | gáy sách / gáy kinh nhiều màu |
| D15 | giấy dán cửa (mờ, alpha 0,7) |
| D16 | gỗ ván sàn lầu |
| Ô 512 #1 | gạch vuông «kim chuyên» 0,8 m (sàn) |
| Ô 512 #2 | trần ô cờ «thiên hoa» (9 ô / tấm) |
| Ô 512 #3 | lưới cửa «tam giao lục uyển» (alpha) |
| Ô 512 #4 | song chữ Vạn (alpha) |
| Ô 256 #1–#8 | mặt rồng tảo tỉnh · nút đinh đồng · hoa sen bệ · vân mây · khóa đồng · bát quái · lạc quải (alpha) · đầu thú bờ nóc |

### 1.2 MOD-GNA

| Vùng | Nội dung |
|---|---|
| D01 | vôi trắng (vệt nước chảy nhẹ phần chân) |
| D02 | đá xanh chân tường |
| D03 | gỗ trầm nâu sẫm |
| D04 | gỗ chạm mây (nguyệt lương) |
| D05 | ngói xám đen xếp (mặt dưới mái lộ) |
| D06 | tre vàng (mành, kệ tre) |
| D07 | giấy trắng cửa bức bàn (alpha 0,75) |
| D08 | đá xanh lát sàn (tấm 0,8 × 1,6) |
| D09 | gỗ thông mộc (sàn lầu trà) |
| D10 | đồng đỏ (chuông tam thanh, gương) |
| D11 | gốm lam trắng (đôn, ấm) |
| D12 | vải vàng phướn chữ đỏ (khung trống cho ký tự hư cấu) |
| D13 | gỗ đào (kiếm) |
| D14 | gạch lục giác |
| D15 | rêu (phủ chân tường ẩm, Mao Sơn) |
| D16 | sơn mài đen bóng (tủ lệnh bài) |
| Ô 512 #1–#4 | lậu song hoa (4 mẫu, alpha) |
| Ô 256 #1–#8 | ngưu thoái chạm · vòng gõ cửa · bát quái gương · trà cụ · than hồng · nghiên chu sa · hoa văn băng liệt · bồn cảnh |

### 1.3 MOD-VIE, MOD-TAN, MOD-NHO, MOD-MIE, MOD-AMT, MOD-DAN, MOD-KT

| Bộ | Dải chính (D01–D06) | Ô 512 | Ô 256 nổi bật |
|---|---|---|---|
| VIE | gỗ lim nâu đỏ · lim sơn son thếp vàng · gạch bát đỏ · vôi vàng tường hồi · ngói mũi hài (mặt dưới) · chiếu cói | gạch bát · chạm thủng cốn (rồng thời Trần, lá đề) · song tiện · giấy cửa võng | mặt La Hán (18 biến thể dùng chung 8 ô + biến đổi tông) · hoa sen · chữ Thọ tròn |
| TAN | vôi trắng · đỏ Hồng cung · gỗ đen khung · vải sọc rèm · gỗ vẽ hoa văn · kim vàng | hoa văn mạn-đà-la (hư cấu, **duyệt**) · thảm Tạng · tủ kinh ô | đèn bơ · bánh xe kinh · pháp luân · khăn khata |
| NHO | gạch Bát Tràng · son cung đình · gỗ tre kệ · giấy vàng bảng · đá bia xám · gỗ án | gạch · nan cửa sổ Khuê Văn · lưới bức bàn · chiếu học | rùa đá · thẻ tre · nghiên · văn phòng tứ bảo |
| MIE | gỗ sam mật · tre phên · ngói âm dương · vải chàm sáp · bạc · đá cuội | ván sàn treo · vải sáp hoa văn (hư cấu) · phên tre | trống đồng mặt (hoa văn hư cấu) · sừng trâu · khèn |
| AMT | đá đen ướt · gỗ đỏ sẫm · sắt gỉ · vải trắng phướn · rêu · lửa lam | đá lát Hoàng Tuyền · song sắt · mặt nước đen | hoa bỉ ngạn · chuông siêu độ · sổ Sinh Tử bìa |
| DAN | vữa vàng · gỗ nhà dân · gạch xám · tre · vải rèm (nhân màu Hỷ thần) · gốm nâu | gạch sàn · ván buồng · giấy câu đối đỏ | bếp lửa · đèn dầu · lồng chim · biển hiệu trống |
| KT | trơn trung tính (tường lót, sàn, khung) | — | thẻ cửa sổ đêm (gradient ấm) · bụi nắng (gradient trong) · khói (sprite 4 khung) |

---

## 2. Hình học mảnh then chốt

### 2.1 Cột tròn (MOD-BAC-07, VIE-03, NHO-05…)

| Thông số | Giá trị |
|---|---|
| Lăng trụ | 16 cạnh (`mid`), 12 cạnh (`low` — bản `.lod` của bộ), không nắp trên (bị đầu cột che) |
| Thu đầu | đường kính đỉnh = 0,9 × đáy (cột cổ thu đầu — «trác thu») |
| UV | quấn D01, 1 m = 256 px theo chiều cao, chu vi ánh xạ 0…1 U của dải lặp |
| Co giãn cao | chỉ co giãn Y; UV tính theo **mét** nên không kéo giãn họa tiết (shader dùng `uv.y × chiều cao` qua thuộc tính tỉ lệ phiên bản — `InstancedMesh` truyền `scaleY` qua `instanceMatrix`, UV đã chuẩn theo 1 m; chấp nhận kéo nhẹ ≤ 15 % khi co giãn ngoài dải 3,6–7,2 m) |
| Tam giác | 32 thân + 96 chân tảng / đầu cột (mảnh riêng) |

### 2.2 Cụm đấu củng (MOD-BAC-11)

- Dựng **một cụm** (một «đóa») 0,8 × 0,9 × 0,8 m: lô đấu → củng ngang 2 tầng → đấu nhỏ → ngang trên; 1.200 tam giác / gian gồm 3 đóa (bổ gian) + 2 nửa đóa ở hai đầu cột.
- Bản `.lod`: một khối hộp có texture đấu củng nướng lên mặt (12 tam giác) — chỉ cho mảnh lộ ngoài (hiên).
- Trong nhà ở tầm xa > 12 m: đổi sang khối nướng (LOD theo khoảng cách camera, do `kit.js` chọn khi lắp — hai `InstancedMesh`, ẩn / hiện theo khoảng cách khoang như `instanceModelLod`).

### 2.3 Cửa bức bàn (MOD-BAC-18 / 19, GNA-14 / 15, VIE-13 / 14, NHO-09 / 10)

```
  ┌──┬──┬──┬──┬──┬──┐   khung (BAC-18): 4 trụ + thanh ngang trên / dưới, 160 tam giác
  │▒▒│▒▒│▒▒│▒▒│▒▒│▒▒│   ← «cách tâm» (lưới, 0,55 chiều cao): tấm phẳng alpha (Ô 512 #3), 2 tam giác
  │▒▒│▒▒│▒▒│▒▒│▒▒│▒▒│
  ├──┼──┼──┼──┼──┼──┤   ← «yêu bản» (thanh giữa) — hình học 8 tam giác
  │  │  │  │  │  │  │   ← «quần bản» (ván dưới): tấm phẳng D13
  └──┴──┴──┴──┴──┴──┘
```

- Mỗi tấm (BAC-19) là **đạo cụ riêng** có trục xoay ở cạnh: 24 tam giác (khung 16 + lưới 2 + ván 2 + yêu bản 4).
- Hai tấm giữa là **cánh cửa** (`door:bucban`, 08-03 §6.1); bốn tấm còn lại là vách `lattice`.
- Giấy dán: lớp tấm thứ hai lùi 1 cm sau lưới, `opacity 0,35`, `side: DoubleSide`, không ghi depth — nhìn xuyên mờ (cửa nhìn `window` 35 %).

### 2.4 Khung che vết cắt (MOD-BAC-21, KT-06/07, GNA-17, VIE-16, NHO-12, TAN-06, AMT-11)

Mảnh quan trọng nhất của pipeline (08-02 §5.3 bước 6).

| Thông số | Quy tắc |
|---|---|
| Rộng ngoài | ô cửa + 2 × 0,15 m (che mép boolean bất kỳ lệch ≤ 0,15) |
| Sâu | **tham số** = độ dày tường đo được + 0,2 m (thò 0,1 mỗi mặt); mảnh dựng dạng «ống» 4 mặt trong + 2 vành ngoài, co giãn Z không kéo UV (UV vành theo mét) |
| Mặt trong (má cửa) | D01 / D02 (gỗ) hoặc D07 (gạch) — che mặt boolean thô |
| Ngưỡng | MOD-KT-09 gắn liền (cao 0,12, bước qua) |
| Va chạm | `C`: phần khung là tường (đặc), lòng ô là khoét `keep` |
| Thử | đặt trên vỏ đã cắt, quay camera 360° quanh cửa ở khoảng 1–6 m: không thấy khe sáng giữa khung và vỏ (vỏ tối sau khe → khe ≥ 2 px là lỗi) |

### 2.5 Bậc xoắn (MOD-KT-17)

- Hình rẻ quạt 22,5°, bán kính trong 0,6 / ngoài 2,6 m (bản phóng ×2 cho tháp lớn: 1,2 / 5,2), dày 0,12, mặt trên phẳng.
- 16 bậc / vòng, chênh 0,22 m (người chơi bước — ≤ 0,41).
- Va chạm: **mỗi bậc một `addPlatform` xoay** (`ry` = góc giữa bậc), kích thước nền = hình chữ nhật nội tiếp rẻ quạt (rộng 2,0 × sâu 0,5 ở bán kính giữa) — chấp nhận góc rẻ quạt hụt nhỏ ở mép ngoài (mép ngoài có lan can chặn).
- `seg` tăng dần từ chân thang; `switchY` ở bậc giữa đoạn.
- Lan can trong: không cần (trụ tâm chặn); lan can ngoài: tường tháp.

### 2.6 Mái lót trong (MOD-VIE-11, GNA-12, DAN-08, MIE-08)

Mặt dưới mái nhìn từ trong (rui, mè, ngói): **một tấm dốc** 3,2 × 3,2 với texture rui – mè – mặt dưới ngói (Ô 512) + 4–6 thanh rui hình học thật (hộp mảnh) để có chiều sâu khi ánh sáng xiên. 60–120 tam giác. Góc dốc tham số theo vỏ (đo bằng tia ở bước `bld-void`), làm tròn về 25° / 30° / 35°.

### 2.7 Tường lót (MOD-*-03 / 04)

- Một mặt trong + đỉnh 4 cm (để nắp đầu tường KT-12 khớp) + mặt cạnh khi đứng một mình; **không có mặt ngoài** (bị vỏ che) → 24–40 tam giác.
- Gờ chân tường liền mảnh (UV dải gờ D03 / KT).
- Cao co giãn theo khoang; UV theo mét.

---

## 3. Đạo cụ anh hùng — prompt Meshy và duyệt

Ghép với `manifest.style` hiện có (trừ tượng — `style: false` như `deity_*`). Quy trình: preview → `bld-void` không cần (đạo cụ) → **duyệt ảnh** → refine. Ngân sách 08-02 §10.

| Mã tài sản | Prompt (≤ 800 ký tự — rút gọn ở đây) | `poly` | Điều cấm thêm vào prompt | Duyệt |
|---|---|---|---|---|
| `prop_bell_bronze` | «bronze temple bell, 1.6 m tall, Daoist trigram band around the waist, cloud motif band near the lip, dragon-shaped hanging loop on top, aged patina, single object, no stand» | 6.000 | «buddha», «sanskrit» | hình dáng chuông Trung Hoa (miệng phẳng), không phải chuông Tây |
| `prop_drum_great` | «large barrel drum 1.4 m diameter on red lacquer wooden stand, cowhide drum heads with brass nails ring, painted cloud band on body» | 5.000 | — | |
| `prop_qing_stone` | «L-shaped chime stone hanging from carved wooden frame, dark polished stone, small wooden mallet» | 2.500 | — | |
| `prop_muyu` | «wooden fish block (muyu), red lacquer, carved scales, on round cushion, with wooden mallet» | 1.500 | — | |
| `deity_tosu` | **(không ghép style)** «seated elderly Daoist sage statue, fictional founder, holding a whisk, gilded robes with cloud patterns, serene face, on lotus-free plain seat» | 15.000 | «buddha», «lotus throne», tên thần có thật | **duyệt nội dung**: hư cấu, không giống tượng thờ có thật |
| `prop_scripture_chest` | «camphor wood scripture chest with brass corners and lock plate, carved lid» | 1.500 | — | |
| `prop_incense_great` | «three-legged bronze censer 1.4 m with lid topped by a lion, ring handles, incense ash inside» | 5.000 | — | |
| `prop_lantern_hall` | «hexagonal palace lantern with silk panels and red tassels, carved wooden frame» | 1.500 | — | đổi thay `lib_lantern.lod` trong điện |
| `prop_bookcase_tall` | «tall wooden bookcase 2.4 m with stacked thread-bound books and scrolls, ancient Chinese library» | 3.000 | — | |
| `prop_armillary` | «bronze armillary sphere on dragon-shaped stand, rings with degree marks, 2 m tall» | 8.000 | — | |
| `prop_loom_small` | «small wooden hand loom with blue cloth in progress» | 2.500 | — | |
| `prop_cooking_stove` | «brick kitchen stove with two woks and a short chimney, rustic, soot stains» | 2.000 | — | |

**Duyệt chung** (ảnh `thumbs/` + lát cắt không cần): đúng tỉ lệ khi `fit`; không có chữ thật / chữ sai trên bề mặt (Meshy hay vẽ chữ giả — chấp nhận nếu là hoa văn, không chấp nhận nếu giống chữ Hán sai nghĩa); texture không có logo; số tam giác sau `meshy-pack` trong ngân sách.

---

## 4. Danh mục bộ (`kit/<bộ>.json`) — xuất kèm GLB bộ

Test T-26 (08-12) và `kit.js` đọc danh mục này. Mẫu:

```json
{
  "kit": "BAC", "version": 3, "atlas": { "base": "kit-bac-base", "orm": "kit-bac-orm", "normal": "kit-bac-normal", "size": 2048 },
  "pieces": {
    "MOD-BAC-07": { "node": "MOD-BAC-07", "size": [0.5, 3.6, 0.5], "scalable": ["y"], "col": { "type": "T", "r": 0.45 },
                    "sockets": ["S-COT"], "hook": null, "fadeable": true, "tris": 128, "lod": "MOD-BAC-07.lod" },
    "MOD-BAC-21": { "node": "MOD-BAC-21", "size": [3.6, 4.2, 0.6], "scalable": ["z"], "col": { "type": "C" },
                    "sockets": ["S-CUA"], "opening": [3.2, 3.75], "tris": 260 },
    "MOD-BAC-33": { "node": "MOD-BAC-33", "size": [0.3, 0.9, 0.3], "col": null, "sockets": ["S-BAN"],
                    "hook": "light:nen", "light": { "kind": "nen", "offset": [0, 0.82, 0] }, "tris": 120 }
  }
}
```

`version` tăng mỗi lần đổi hình / kích thước mảnh → đổi `hash` `col.json` mọi công trình dùng bộ đó (T-25 báo nướng lại).
