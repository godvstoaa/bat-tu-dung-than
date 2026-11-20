# Biệt phủ — hợp đồng cho bộ dựng theo họ phong cách

Mục tiêu: thay nhà, tháp, đình và cổng của 16 biệt phủ và 240 biệt thự (hiện là hộp, nón và texture canvas kéo giãn, xem ảnh `output/bietphu/before/*.png`) bằng kiến trúc thật. Dựng bằng bộ kiến trúc của tiên phủ (`src/game/tienphu/arch/*`, **chỉ import, không sửa**), theo **đúng khuôn lô** mà `src/game/estate-layout.js` đã quy hoạch.

## 1. File và đăng ký

- Mỗi họ là một file `src/game/archcity/est-<họ>.js` xuất `FAMILY = { hall, tower, pav, gate }`.
- Đăng ký ở `src/game/archcity/estatekit.js` (đã có sẵn, đừng sửa). Hàm nào để `null` hoặc trả `null` thì game giữ bản cũ.
- Mẫu đã làm và đã đạt kiểm: `src/game/archcity/est-cn.js` (cung đình, Giang Nam, Hanok). Đọc nó trước.
- Được tạo thêm file phụ `src/game/archcity/est-<họ>-*.js`.
- Không sửa:
  - `tienphu/*`, `estatekit.js`, `est-cn.js`
  - file của họ khác
  - `mansion3d.js`, `mansions.js`, `estate-layout.js`
  - các script dùng chung

## 2. Chữ ký hàm

Khung cục bộ: gốc ở tâm đáy, y = 0 là mặt đất, mặt tiền / cửa hướng **+z**, x là bề ngang.

```js
hall(styleId, S, b, opt)
// b = { id: 'main'|'guest'|'wing', w, d, h, floors, plinth, back }, opt = { villa }
tower(styleId, S, t)   // t = { w, d, h }  (lô ~10 × 10, cao ~36 m; tháp bên Thanh Long, khối đặc va chạm 0,84 w)
pav(styleId, S, pv)    // pv = { w: 7, d: 7, h: 3.4, octa }  (đình mở bên mặt nước, nền 0,5 m)
gate(styleId, S, g)    // g = { w (khe cổng: phủ 8, biệt thự 3,2), villa, d: 0 }
```

Mỗi hàm trả một trong ba dạng:

- `{ acc, mats, post?, midDrop?, info? }`:
  - `acc` là một `Acc` (từ `tienphu/arch/kit.js`), hoặc `{ base: Acc, shell: Acc }`.
  - `mats` là bảng khoá → `THREE.Material`.
  - `post(group)` (tuỳ chọn) chạy trên base và shell sau khi tách, ví dụ `retex` + `consolidate` của `archcity/mats.js`.
- `{ group }` dựng sẵn, không tách base / shell.
- `null`.

Tách base và shell theo tên khoá (`BASE_KEY` trong `estatekit.js`):

- base: nền, bậc, sân, sàn. Không mờ khi người chơi vào nhà.
- shell: phần còn lại. Mờ đi khi vào nhà.

Bậc chi tiết vừa (xa hơn 75 m) tự bỏ các khoá khớp `MID_DROP`: `/^(dougong|rib|baluster|dentil|carve|statue|potAFeu|trophy|lattice|tracery|railBar)/`. Họ nào có khoá chi tiết tên khác thì khai `midDrop: /…/`. **Đặt tên khoá chi tiết sao cho bậc vừa bỏ được.**

## 3. Khuôn lô

Va chạm `mansions.mansionSolids` giữ nguyên, nên hình phải khớp nó.

- **Vách nhà nằm trên chu vi w × d** (lệch không quá 1,6 m).
  - Khe cửa 2,4 m ở giữa mặt +z.
  - Thêm khe ở mặt −z nếu `b.back`.
  - Tia ngang ở x = 0, y = plinth + 1,2 từ ngoài vào phải **thông** qua khỏi mặt vách 1,2 m. Cửa mở, hoặc khung cửa không có cánh chắn.
- **Sàn trong nhà ở cao độ b.plinth và trống**:
  - Lưới 1,5 m cách vách 1,2 m: ít nhất 85 % điểm nhìn xuống từ plinth + 2,1 phải chạm sàn ở plinth ± 0,35.
  - Không đặt khối đặc, cột giữa dày hay cầu thang chiếm sàn. Đồ đạc của người chơi đặt lên sàn này.
- **Nền ngoài** (w + 2,4) × (d + 2,4), mặt trên ở cao độ b.plinth.
  - Bậc giữa trước rộng min(6, 0,3 w), thêm bậc sau nếu `back`.
  - Hiên, cột hiên, mái, đầu đao, ban công được vươn ra ngoài chu vi.
- **Chiều cao**: `b.h` là cao hiên trên nền (phủ Á Đông 11, phủ Tây / hiện đại 4,2 m mỗi tầng × `floors`, biệt thự 7,2–12,6).
  - Nóc mái thường bằng 1,4–1,8 lần (plinth + h).
  - Người cao 1,75 m: cửa đi 2,3–3,2 m, tầng 3,4–4,5 m. Không phóng to hay thu nhỏ mẫu tiên phủ khổng lồ cho vừa lô. Dựng lại theo tham số.
- **Cổng**: gốc ở tâm khe cổng trên đường tường rào, mặt ngoài sát z = 0, nhà cổng lùi vào phía −z.
  - Lối qua `|x| < g.w/2 − 0,4` thông suốt từ z = +6 tới z = −12 ở y = 1,2.
  - Cổng phủ rộng khoảng g.w + 6…12. Cổng biệt thự là hai trụ có mái hoặc vòm nhỏ.
- **Biệt thự** (`opt.villa`): lô 19 × 22, nhà chính 12 × 9. Nhà nhỏ, gọn, cùng ngôn ngữ phong cách với phủ.
- **Biến thể biệt thự** (`opt.variant` 0, 1, 2, chỉ gửi cho nhà biệt thự và cổng biệt thự): 30 căn một khu không được giống hệt nhau (luật ART_BIBLE 4).
  - Mỗi biến thể phải khác nhau thấy rõ: số gian / ô cửa, kiểu hoặc hướng mái, ban công, hiên, màu ngói hoặc màu vách trong bảng màu phong cách.
  - Vẫn giữ đúng mọi luật khuôn ở trên.

## 4. Chất lượng

Theo `ART_BIBLE.md` và skill aaa-web-game.

- Không có mặt phẳng một màu lớn. Texture nét, **≥ 200 px/m** trên vách và mái.
  - Ưu tiên texture lặp theo mét của `archcity/mats.js`: `tiled()` và `archMats()` với tile, brick, plaster, stone, marble, plank, lacquer; `boxUV` / `retex`.
  - Hoặc texture theo UV thế giới của chính bộ kit: `fr finishUV`, `ad finalizeUV`, `mg finishUV`, `go finishUV`.
- Có cửa sổ thật (khung, bệ, kính lõm hoặc cửa chớp), gờ tầng, phào mái, chân tường. Không vẽ cửa sổ lên texture phẳng.
- Mái đúng kiểu phong cách, có độ dày, diềm, nóc. Không dùng nón hay hình chóp 4 cạnh trơn.
- **Ngân sách tam giác**, bậc gần / bậc vừa:

  | Phần | Bậc gần | Bậc vừa |
  |---|---|---|
  | Nhà chính phủ | ≤ 100k | ≤ 55k |
  | Nhà phụ | ≤ 40k | ≤ 22k |
  | Nhà biệt thự | ≤ 25k | ≤ 14k |
  | Tháp | ≤ 90k | — |
  | Đình | ≤ 16k | — |
  | Cổng phủ | ≤ 18k | — |
  | Cổng biệt thự | ≤ 9k | — |

  Mỗi khoá vật liệu là một lệnh vẽ, nên **giữ dưới 15 khoá mỗi công trình**; `consolidate` gộp theo ảnh texture.

## 5. Kiểm (bắt buộc trước khi báo xong)

- `STYLE=<id,…> node --max-old-space-size=3000 scripts/bietphu-check.mjs`: mọi dòng phải **ĐẠT** (tam giác, vách đúng khuôn, cửa thông, sàn trống).
- `STYLE=<id,…> KIND=hall,tower,pav,gate V=persp,eye,door node scripts/bietphu-look.mjs` ghi ảnh vào `output/bietphu-look/`:
  - Trang `tools/bietphu.html` có người 1,75 m để so tỉ lệ, khung đỏ là chu vi va chạm, vạch xanh là khe cửa.
  - **Mở và xem ảnh**, sửa tới khi đẹp và đúng phong cách.
  - Máy đang bận nên chỉ chụp phần đang sửa (STYLE / KIND / V hẹp).
  - Dev server http://localhost:5181 đang chạy sẵn. Đừng bật hay tắt nó.
- Mỗi họ ghi `docs/bietphu/<họ>.md`:
  - nguyên mẫu thật đã tham chiếu (kèm nguồn: tài liệu `docs/tienphu-nghiencuu/*` của kit và nguồn ngoài);
  - quy tắc có số đo (gian, tầng, cửa, mái, vật liệu);
  - dòng kết quả kiểm, ảnh đã xem;
  - mục **Chưa đạt**.
- Không commit. Không dùng dịch vụ tốn credit (Meshy…).
