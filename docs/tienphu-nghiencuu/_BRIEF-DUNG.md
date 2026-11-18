# Đề bài DỰNG — bộ dựng kiến trúc cho một phong cách tiên phủ

## Bối cảnh
- Game 3D web (Three.js 0.170). Có 9 «tiên phủ», mỗi phủ một phong cách theo một quần thể có thật.
- Người dùng chê công trình và bản vẽ «quá thô sơ, không lột tả được công trình», yêu cầu nghiên cứu kỹ, **cấm làm ẩu**.
  Đây là lần chê thứ 3, nên chất lượng là yêu cầu số một.
- Nghiên cứu đã có cho từng công trình: `docs/tienphu-nghiencuu/0N-<phong-cách>.md`.
  Mỗi công trình có: nguyên mẫu, số đo, cấu trúc từ dưới lên, mặt bằng, **cấu kiện nhận diện (§5)**, màu, **khung đề xuất cho game (§8)**.
- Manifest chung: `docs/TIEN-PHU-KIENTRUC-MANIFEST.md`.
- Phong cách Trung Hoa đã làm xong theo cách này. Dùng làm **mẫu chuẩn về cấu trúc mã và chất lượng**:
  - Mã: `src/game/tienphu/arch/kit.js` (khung chung), `cn.js` (bộ dựng), `spec-cn.js` (đặc tả), `trunghoa.js` (đăng ký).
  - Ảnh kết quả: `docs/tienphu-banve/01-trunghoa/ct-main.png`, `ct-tower.png`, `ct-duofu.png`.
    Mở xem để biết mức chi tiết cần đạt: cột, xà có họa tiết, đấu củng, cửa bức bàn, mái lõm có gân ngói, bờ nóc, vẫn thú, nền có bậc, lan can.

## Việc của bạn
Viết bộ dựng 3D theo LOẠI HÌNH cho MỘT phong cách và đặc tả cho TỪNG công trình của phong cách đó. Phải đủ mọi id trong
`docs/tienphu-nghiencuu/list-N-<phong-cách>.txt`, cộng `tower` (lầu 10 tầng). Sau đó xuất tờ bản vẽ và tự kiểm bằng mắt.

### File được phép sửa / tạo (CHỈ những file này)
- `src/game/tienphu/arch/<phong-cách>.js`. Hiện là stub; xuất `STYLE = { id, specs, builders, mats }`.
- Tuỳ chọn tách ra `src/game/tienphu/arch/<tiền-tố>-*.js` (vd `spec-jp.js`, `jp.js`), miễn chỉ `<phong-cách>.js` import chúng.
- **KHÔNG sửa** `kit.js`, `cn.js`, `index.js`, `styles.js`, `tower.js`, `tower3d.js`, hay bất cứ file nào khác.
  Được `import` (chỉ đọc) từ `./kit.js` và `./cn.js`, ví dụ `platform`, `balustrade`, `column`, `beasts`, `benchRail`.
  Cần thêm hàm chung thì viết trong file của mình.
- Không chạy `git` (không add / commit / stash). Không khởi động / dừng máy chủ dev: máy chủ đang chạy ở http://localhost:5180.

### Quy ước
- **Khung cục bộ:** gốc = tâm mặt bằng trên mặt đất (y = 0), **+z = mặt tiền** (hướng cổng chính), x = bề ngang. Đơn vị mét.
- **Gom hình bằng `Acc` (kit.js):** `acc.add(khoáVậtLiệu, BufferGeometry)`. Khoá vật liệu là chuỗi, `mats()` trả `{ khoá: THREE.Material }`.
  - Mặt hở không kín (mặt ngói, tấm phẳng một lớp) đặt khoá bắt đầu bằng `tile`, vd `tileRed`. Bản vẽ mặt cắt cần thế để tô đen đúng.
  - Mọi khối khác phải kín (Box / Extrude / Cylinder đóng nắp).
- **Hàm dựng trả `{ acc, info }`:**
  - info gồm: `W`, `D` (lưới chính), `PW`, `PD` (chiếm đất gồm nền, bậc), `ph` (cao nền), `top` (cao nhất), `kind`.
  - Có thì thêm: `eave` (mép mái), `colH`, `colD`, `bays` (mảng bề rộng gian), `n`.
- **Đặc tả từng công trình:** `{ type, name, proto, src, …tham số }`.
  - `proto`: nguyên mẫu thật.
  - `src`: tham chiếu mục trong file nghiên cứu, kèm các số đã dùng. Chỗ nào chưa làm ghi «Chưa làm: …».
- **Kích thước:** theo «khung đề xuất cho game» (§8) trong nghiên cứu, giữ đúng **tỉ lệ giữa các phần** như nguyên mẫu.
- **Cửa vào:** công trình chính (nhà, điện, sảnh) phải có lối vào rộng ≥ 2,4 m ở tầng trệt, mặt +z, giữa nhà, sàn tại `ph`.
- **Lầu 10 tầng (`tower`):** dựng VỎ NGOÀI từ đặc tả lầu của game, giống `cnTower` trong cn.js.
  - Dùng `towerSpec(style)` (`../tower.js`) với `TP_STYLES` (`../styles.js`). FH = 5 m / tầng, 10 tầng + Vọng Đài.
  - Mỗi tầng `floors[k]`: `{ y, a (apothem), gal (có ban công), slabA }`. Ngoài ra có `deck { y, a }` và `podium { y, a, stairW, steps, rise, tread, run }`.
  - Đa giác `n` chỉ được ∈ {4, 8, 16}.
  - Nếu nghiên cứu đòi n / a / podium khác cấu hình hiện tại: dựng bằng bản ghi đè cục bộ `towerSpec({ ...st, tower: { ...st.tower, n, a: […10 số], podium } })`, rồi **báo lại bản ghi đè** trong câu trả lời cuối. Tôi sẽ áp vào styles.js.
  - Điều kiện test: mỗi tầng `2·a·(n === 4 ? 1 : 0,92) ≥ 20 m`; cầu thang dài 8,4 m phải lọt trong tầng.
  - Bên trong lầu (cầu thang, sàn) do game dựng. Bạn lo vỏ ngoài, mái từng tầng, ban công, đỉnh, và mặt ngoài nhìn ra phải đúng nguyên mẫu.
- **Ngân sách tam giác:** nhà lớn ≤ 100 nghìn, nhà nhỏ / đình ≤ 30 nghìn, lầu ≤ 300 nghìn. Báo số thật.

### Chất lượng (bắt buộc)
- Mỗi công trình phải có ĐỦ các **cấu kiện nhận diện (§5)** trong nghiên cứu. Nhìn phối cảnh và mặt đứng phải nhận ra nguyên mẫu.
- Không có hộp trơn đội mái. Tường có nhịp (trụ, gờ, cửa có khung, ô cửa có chiều sâu). Mái đúng hình học của phong cách: độ dốc, độ vươn, tầng mái, đỉnh. Đúng tỉ lệ.
- Đúng «Sai lầm phải tránh» trong phần chung của file nghiên cứu.
- Dùng màu hex trong nghiên cứu. Có thể dùng texture canvas thủ tục (xem `caihuaTex`, `geshanTex` trong cn.js) cho họa tiết.

### Vòng làm việc
1. Đọc kỹ phần chung và từng mục công trình trong file nghiên cứu của bạn. Đọc `kit.js` và `cn.js` để biết công cụ: `rectRoof` / `polyRoof` / `roofProfile` dùng được cho nhiều kiểu mái.
2. Viết bộ dựng + đặc tả.
3. Xem nhanh: `ID=<phong-cách>/<id>[,…] V=persp,front node scripts/banve-look.mjs`. Ảnh ra ở `output/banve-look/`.
   **Mở ảnh ra xem** (Read), so với mô tả và ảnh nguyên mẫu (link Commons trong nghiên cứu, mở bằng WebFetch nếu cần), sửa, xem lại.
   Không được coi là xong khi chưa tự xem ảnh.
4. Xem cả mặt bằng và mặt cắt (`V=plan,section`): phải đọc được tường, cột bị cắt (tô đen).
5. Xuất tờ bản vẽ: `STYLE=<phong-cách> node scripts/banve.mjs` → `docs/tienphu-banve/NN-<phong-cách>/ct-*.png`. Mở xem ít nhất công trình chính, lầu, và 3 công trình khác.
6. Có thể ghép xem nhanh: `node scripts/banve-montage.mjs output/banve-look "<phong-cách>-.*-persp" output/banve-look/m-<phong-cách>.png 4`.

## Câu trả lời cuối gửi lại (ngắn, tiếng Việt)
- Số công trình đã dựng / tổng; tam giác từng cái (hoặc lớn nhất).
- Bản ghi đè lầu, nếu có: n, a[10], podium.
- Kích thước chiếm đất mới (PW × PD) của từng công trình, để tôi cập nhật tổng mặt bằng.
- Chỗ lệch nghiên cứu / chưa làm (trung thực).
- Ảnh nào nên xem trước.
