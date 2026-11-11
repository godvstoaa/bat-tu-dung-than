# HUYỀN QUÁN v2 — Thiết kế hệ thống game (đầu → cuối)

> Viết lại 2026-11-04 theo phản hồi chủ dự án:
> - vào game phải nhập bát tự sinh thần đầy đủ → dụng thần → màu sắc nhân vật;
> - cảnh tối, đèn phải sáng;
> - dãy nhà xấu;
> - công trình to đẹp, vào được bên trong, có tượng thần Đạo giáo;
> - NPC giải quẻ lấy từ trang chính;
> - camera không nhìn lên trời được;
> - lên kế hoạch lại toàn bộ hệ thống.
>
> Thay thế phần vòng chơi trong `GAME-MMO-PROMPT-PLAN.md` và `GAME-NOI-DUNG-THEO-APP.md` (các sảnh nghề giữ nguyên, đặt vào vòng chơi mới).

## 1. Tầm nhìn

Một **thế giới Đạo quán – phố thị cổ** để người chơi *sống cùng lá số của mình*:
- **Mệnh của nhân vật** do chính bát tự người chơi quyết định.
- **Mọi hoạt động** chạy bằng engine luận giải thật của app: giải án, chọn ngày, xem nhà, giải quẻ, thầy AI.
- **Không gian** có điện thờ vào được, tượng thần, đèn đuốc, ngày đêm theo giờ thật.
- **Nhiều người chơi** cùng một phố: thấy nhau, gặp nhau ở điện, cùng giải án chung.

## 2. Vòng chơi từ đầu đến cuối

```
[Cổng]  nhập tên + giới tính + ngày/giờ sinh (dương lịch, có ô «không rõ giờ»)
   ↓ engine analyze() → tứ trụ, ngũ hành %, vượng/nhược, DỤNG THẦN · HỶ · KỴ
[Lễ nhập môn]  thầy lật 4 trụ (hoạt cảnh) → đọc «Mệnh chủ … · Dụng … · Hỷ …»
   ↓ nhân vật được mặc áo màu Dụng thần, viền/đai màu Hỷ thần, hào quang theo hành
[Huyền Thành]  sân quán (lịch ngày, việc hôm nay) → phố chợ → Chính Điện (Tam Thanh)
   ↓
[Vòng ngày]  3 khách Tứ Trụ · 8 sảnh nghề · 1 lần giải quẻ · thắp hương ở điện · hỏi thầy AI
   ↓ điểm Phúc Khí + thông thạo từng nghề
[Tiến trình]  danh hiệu theo tổng thông thạo (Môn Sinh → Học Đồ → Thầy Xem → Đại Sư)
              mở dần: điện vùng (khi ghé), phẩm phục (theo danh hiệu), đèn lồng riêng
[Xã hội]  thấy người khác (áo theo dụng thần của họ), chào/cúi, án Hợp Hôn chung, bàn trong điện
```

### Trạng thái người chơi (mới)
`state.player = { name, look, birth: { y, m, d, h, mi, gender, hourUnknown }, yong: { primary, xi, ji }, robe (= primary), accent (= xi) }`
- Người chơi cũ chưa có `birth` → lần vào tới, cổng hiện form bát tự; trong lúc chưa điền vẫn giữ màu cũ.
- Bát tự cũng vào Sổ Mệnh làm hồ sơ «Bản thân» (dùng chung cho Bàn Thầy, Thầy AI, giải quẻ).
- **Riêng tư:** ngày sinh chỉ lưu trên máy. MMO chỉ gửi màu áo (`robe`, `accent`), không gửi ngày sinh.

## 3. Hệ thống

| # | Hệ thống | Nội dung | Engine app |
|---|---|---|---|
| S1 | Nhập môn | form bát tự; lễ lật trụ; thẻ mệnh (Dụng/Hỷ/Kỵ, vượng nhược, ngũ hành %) | `chart.analyze` |
| S2 | Phẩm phục | áo nhân vật đổi màu theo Dụng (vải), đai/viền theo Hỷ; hào quang ngũ hành khi đứng yên | `yong` |
| S3 | Ánh sáng | đèn lồng tự phát sáng (vật liệu emissive + bloom), 12 đèn điểm động theo đèn gần nhất; đêm có trăng và hắt sáng từ đèn; trong điện có nến | — |
| S4 | Điện vào được | đến cửa điện → «Vào điện» → không gian trong điện (cột, xà, sàn gạch, bàn thờ, tượng, nến, lư hương) → «Ra» về đúng cửa | — |
| S5 | Tượng thần | Chính Điện Huyền Thành: **Tam Thanh**; mỗi vùng một điện thờ vị thần hợp nghề (bảng §4) | — |
| S6 | Thầy giải quẻ (NPC) | trong Chính Điện: Mai Hoa (giờ/số), Lục Hào (gieo 3 xu × 6), Tiểu Lục Nhâm, Kim Khẩu Quyết, xin xăm (xin keo âm dương) | `meihua`, `liuyao`, `xiaoliuren`, `jinkoujue`, `qiuqian`, `hexagramMeaning` |
| S7 | Sảnh nghề | 8 sảnh (đã có) | xem `GAME-NOI-DUNG-THEO-APP.md` |
| S8 | Thầy AI | hỏi về lá số bản thân / khách (đã có) | `askAI` |
| S9 | Camera | kéo lên để nhìn trời (camera hạ thấp, ngước lên), kéo xuống nhìn từ trên; chụm 2 ngón phóng to | — |
| S10 | Phố thị | thay dãy nhà cũ (mẫu `house_town` thô) bằng nhà vườn CC0 có LOD; phố chợ, đèn | — |
| S11 | MMO | đồng bộ màu áo theo Dụng thần; gặp nhau trong điện (cùng phòng điện = cùng kênh) | `TownShard` |
| S12 | Cấp · gia trì · bay | cấp theo Phúc Khí tích lũy; gia trì theo hành Dụng thần mở dần theo cấp; ngự kiếm phi hành; VIP mở sớm (§3.1) | `progress.js`, `effects.js` |

iOS (4.3b): S6 (giải quẻ, xin xăm) và Thầy AI **tắt** như app chính; S1–S5, S7 (dạng học) giữ.

### 3.1 Cấp, gia trì nguyên tố, VIP (S12)

- **Cấp:** `level = floor(√(xp / 20)) + 1`, với `xp` là Phúc Khí tích lũy cả đời (tiêu Phúc Khí không làm tụt cấp). Mốc: cấp 2 = 20 · cấp 4 = 180 · cấp 6 = 500 · cấp 8 = 980 · cấp 10 = 1620.
- **Gia trì** mang màu và kiểu chuyển động của hành Dụng thần: Thanh Mộc (lá non), Ly Hỏa (đốm lửa bốc lên), Hậu Thổ (bụi vàng xoáy), Canh Kim (ánh kim), Huyền Thủy (giọt nước rơi).

| Cấp | Gia trì | VIP mở sớm |
|---|---|---|
| 2 | Hào quang hộ thể (vòng sáng dưới chân) | có |
| 4 | Linh khí quanh thân | có |
| 6 | Vệt sáng bộ pháp (khi chạy/bay) | có |
| 8 | Ngự kiếm phi hành (độ cao 3–420 m, nhanh ×4, bỏ qua vật cản) | có |
| 10 | Pháp quang sau lưng | **không** (chỉ theo cấp) |

- **Bay:** nút 🗡️ (hiện khi đã mở), cần ▲▼ đổi độ cao; phím F / Space / C. MMO gửi độ cao `a` (0–420) để người khác thấy bay.
- **VIP:** `state.vip = { until }`; `vipActive()` kiểm hạn. **Chưa có cổng thanh toán** (Apple IAP cho iOS; VNPay/Stripe cho web) — cần chủ app đăng ký merchant trước khi bật bán.

### 3.2 Tàng Y Các — trang phục, phụ kiện, hiệu ứng (S13)

Mã: `cosmetics.js` (danh mục + logic, dùng chung client / máy chủ / test), `accessories.js` (phụ kiện 3D thủ công + ngự vật), `effects.js` (skin hào quang / vệt bước / ngự vật), `wardrobe-ui.js` (bảng). Test: `test-game-cosmetics.mjs`, `test-quan-mmo.mjs`.

- **8 ô trang bị, 51 món:**
  - phẩm phục (tô màu HSV riêng, shader cũ);
  - mũ/trâm, sau lưng, cầm tay (dựng thủ công, bám xương Head / Spine02 / RightHand theo vị trí thế giới);
  - hào quang, vệt bước, ngự vật (skin của gia trì);
  - khung tên (CSS).
- **5 bậc hiếm:** Phàm / Linh / Huyền / Tiên / Thần.
- **Hai loại tiền:**
  - Phúc Khí (cày được, tiêu không giảm cấp);
  - Ngọc (điểm danh 7 ngày 10→80, VIP +30/ngày, +20 mỗi cấp).
- **Nạp Ngọc:** bảng gói để sẵn nhưng **chưa có thanh toán thật** (iOS ẩn hẳn mục này).
- **Món giới hạn:** độc quyền VIP (Tử Y Chân Nhân, Mũ Sen Vàng — VIP + cấp 10, Bát Quái Hộ Thân Phù, Tiên Hạc ngự vật), theo cấp (Bộ Bộ Sinh Liên cấp 8), theo chuỗi điểm danh 7 ngày (khung tên Kim Long). Tên món khớp danh mục `cosmetics.js` (đồng bộ 2026-11-05 — bản cũ ghi «Liên Hoa Quan, Pháp Luân» lệch với code).
- **5 bộ ngũ hành** (phẩm phục + mũ + sau lưng + hào quang):
  - mặc đủ bộ có hiệu ứng bộ;
  - bộ trùng Dụng thần của người chơi được **Hợp mệnh**: +10% Phúc Khí khi giải án / sảnh nghề.
- **Hiện ngoài cảnh:**
  - skin hào quang / vệt bước đã mua hiện kể cả chưa đủ cấp gia trì;
  - bay vẫn theo cấp 8 / VIP, ngự vật chỉ đổi hình;
  - cầm đồ khi đứng yên thì tay phải đưa lên trước ngực (`characters.js › hold`); ngồi trà thì cất đồ cầm tay.
- **Thử đồ:** «Thử 20s» mặc tạm món chưa mua để xem ngoài cảnh.
- **Trong sân:** quầy **Tàng Y Các** (cánh Tây, −22/37) gồm đình gỗ, 3 ma-nơ-canh mặc áo bộ ngũ hành, người bán cúi chào; mở cùng bảng với nút «Y Các».
- **MMO:**
  - hello mang `cos` (chuỗi gọn `ô:món`), tin `cos` khi đổi đồ;
  - máy chủ lọc qua danh mục (`cleanCos`) rồi phát lại;
  - người khác ở gần thấy áo, phụ kiện, hào quang, ngự vật, khung tên.

## 4. Điện thờ và vị thần

| Điện | Vị trí | Thần chủ | Gắn với |
|---|---|---|---|
| Chính Điện Huyền Thành (`palace_grand` phía Bắc) | 0, −92 | Tam Thanh: Nguyên Thủy Thiên Tôn · Linh Bảo Thiên Tôn · Đạo Đức Thiên Tôn | Thầy giải quẻ, thắp hương, xin xăm |
| Văn Xương Các (Thư Lâu) | 0, −700 | Văn Xương Đế Quân | Thư Lâu |
| Đẩu Mẫu Điện (Trích Thiên) | −600, 600 | Đẩu Mẫu Nguyên Quân | Tử Vi |
| Lão Quân Điện (Tử Bình) | −620, −560 | Thái Thượng Lão Quân | Cách Cục |
| Thái Tuế Điện (Lịch Đường) | 820, 0 | Thái Tuế Tinh Quân | Trạch Nhật |
| Huyền Nữ Điện (Phong Thủy Viên) | −820, 0 | Cửu Thiên Huyền Nữ | Dương Trạch |
| Quỷ Cốc Đường (Manh Phái Cốc) | 640, −520 | Quỷ Cốc Tử | Tượng Pháp |
| Thủy Phủ (Cùng Thông Hồ) | 620, 620 | Thủy Quan Đại Đế | Điều Hậu |

**Nguồn tượng:**
1. Thư viện cộng đồng Meshy (CC0), ưu tiên model nhiều chi tiết, remesh 80k/300k.
2. Thiếu thì tạo bằng Meshy text-to-3D, theo phong cách: tượng gỗ sơn son thếp vàng, ngồi trên đài sen đá, không chữ.

**Tài nguyên kho hiện tại:** đã rà chốt — 94 file GLB / 48 id, không thiếu file, credit chỉ còn 7 → **chỉ tải về (GET/CC0), không tạo mới tốn credit**; nguyên tắc và lệnh kiểm xem `docs/GAME-MESHY-ASSET-PLAN.md`. Điện còn thiếu tượng (Huyền Nữ, Quỷ Cốc, Thủy Phủ) và kế hoạch dựng lại khi có tài nguyên: `docs/GAME-THIET-KE-CHOT.md` §4.

## 5. Kỹ thuật

- **Nội thất:** `src/game/interior.js` dựng từ khai báo `ROOMS` (world.js: cửa, gốc, kích thước, tượng, NPC). Các điện đặt ngoài bản đồ trên biển mây (x 1500–1800); sàn là nền đi được (`addPlatform`), mép là nước nên không ra ngoài được. Trạm `door_<id>` / `exit_<id>` dịch chuyển vào/ra đúng cửa. Camera bị kẹp trong khung điện; đèn điểm chỉ lấy đèn cùng điện.
- **Ánh sáng đèn:** đăng ký mọi vị trí đèn → mỗi 0,3 s chọn 12 đèn gần nhất gán cho 12 `PointLight` (cường độ theo đêm/ngày).
- **Nhân bản có LOD:** `instanceModelLod()` cho nhà, đèn, cây: 2 InstancedMesh (gần / xa), chia lại theo khoảng cách mỗi 0,5 s.
- **Tô màu áo:** shader thay sắc độ (hue) cho vùng vải bão hòa, giữ da và tóc.
- **Camera:** pitch ∈ [−0,75; 1,15]. Pitch < 0,15 thì hạ camera sát đất (≥ mặt đất + 0,6) và nâng điểm nhìn lên theo |pitch|.

## 6. Kế hoạch (thứ tự làm)

| Pha | Việc | Kiểm |
|---|---|---|
| V2-1 | Camera nhìn trời · đèn sáng (emissive + đèn điểm động, đêm) · thay dãy nhà | ảnh chụp ngày/đêm, FPS |
| V2-2 | Nhập môn bát tự → dụng thần → phẩm phục (tô màu áo) · người chơi cũ bổ sung · MMO gửi màu | test state, ảnh |
| V2-3 | Thầy giải quẻ trong điện (5 phép) | test engine, chơi thử |
| V2-4 | Nội thất điện + tượng thần (Chính Điện trước, rồi 7 điện vùng) | vào/ra, va chạm, ảnh |
| V2-5 | Tiến trình: danh hiệu theo thông thạo, mở phẩm phục · tổng kiểm iOS | test, verify:ios |

> **Lộ trình thực thi hiện tại** nằm ở `docs/GAME-THIET-KE-CHOT.md` (thiết kế chốt 2026-11-05, P0 code-only không đụng file khóa): P0-1 «Đường Thầy» (3 tab Thầy Giải Quẻ) + P0-2 bước «Năm nay» 4 sảnh — đã làm xong 2026-11-05 (nhật ký §7).

## 7. Nhật ký

- 2026-11-04: viết thiết kế v2.
- 2026-11-04: **V2-1** camera nhìn trời (pitch tới 1,15, hạ sát đất), trời đêm gradient + sao, đèn lồng emissive + nhóm đèn điểm động (16/10/6 theo chất lượng); dãy nhà phố thay bằng `lib_courtyard` có LOD.
- 2026-11-04: **V2-2** cổng nhập bát tự → lễ lật trụ → Dụng/Hỷ/Kỵ → phẩm phục (shader thay màu áo/đai); hồ sơ «Bản thân»; MMO gửi `robe`/`acc`.
- 2026-11-04: **V2-3** Thầy Giải Quẻ (`que-ui.js`) trong Chính Điện: Mai Hoa (giờ/số), Lục Hào (gieo xu), Tiểu Lục Nhâm, Kim Khẩu Quyết, xin xăm + keo; nút «Nhờ Thầy luận thêm» (Thầy AI). Đã chơi thử cả 5 phép.
- 2026-11-04: **V2-4** 4 điện vào được: Chính Điện Tam Thanh, Văn Xương Các, Đẩu Mẫu Điện, Lão Quân Điện. 5 tượng tạo bằng Meshy (meshy-6-lite, 100k tam giác). Đã thử vào/ra cả 4 điện. **Còn thiếu** 4 điện vùng (Thái Tuế, Huyền Nữ, Quỷ Cốc, Thủy Quan): hết credit Meshy (còn 7, cần ~20).
- 2026-11-04: **V2-5** cấp / gia trì nguyên tố / ngự kiếm / VIP (§3.1). VIP chưa có thanh toán thật.
- 2026-11-04: **Huyền Quán Sơn Môn** thay sân quán cũ (32 × 22 m). Bố cục trong `court.js` (một nguồn cho vị trí gian, nền bậc, vật cản), phần dựng trong `sect.js`.
  - Khuôn viên: 120 × 132 m, tường son mái ngói, Sơn Môn và Hậu Môn (`gate_sect`).
  - Sân trước: thần đạo đèn đá, Đại Đỉnh, hồ sen đôi; cánh Tây có Trà Thất, Ống Xăm, Bàn Hợp Hôn; cánh Đông có La Bàn Đài, Bảng Lịch.
  - Hai tầng nền đá (cao 2 m và 4 m) có lan can, bậc ngự đạo, cờ ngũ hành.
  - Trên cùng là Bàn Thầy có mái trước Chính Đường (`palace_grand`). Hai bên có điện phụ, lầu chuông / lầu trống; bốn góc có bảo tháp.
  - Hậu Sơn (`cliff_palace`) lùi về z −116; cửa Chính Điện Tam Thanh ở (0, −84).
- 2026-11-04: **Va chạm theo hình khối** (`collide.js`): cắt lát model ở tầm thân người (0,4–2 m trên chân), raster vào lưới 0,5 m (`obstacles.js`).
  - Áp cho mọi công trình Meshy, cây, nhà nhân bản; cổng thì khoét lối giữa vòm.
  - Tìm đường: A* lưới 0,8 m + rút gọn theo tầm nhìn thẳng (`world.js`). Khi vướng, nhân vật trượt dọc vật cản, không được thì tính lại đường.
  - Test: `test-game-state.mjs` › Sơn Môn.
- 2026-11-04: hiệu năng sơn môn: gộp khối thủ công theo vật liệu, công trình phụ dùng bản thường (không HD). Trong khung xem trước: 1.116 → 186 lượt vẽ, 3 → 45 khung/giây.
- 2026-11-04: ngồi bồ đoàn dựng tư thế xếp bằng bằng xương (`characters.js › seat`): uống trà (cầm chén, nhấp mỗi 7,5 s, hơi nóng), thầy viết chữ sau án thấp, người khác tĩnh tọa.
- 2026-11-04: thêm **Vận Mệnh Các** và **Thái Tuế Điện** (xem `GAME-NOI-DUNG-THEO-APP.md`, nhật ký 2026-11-04).
- 2026-11-04: **Tàng Y Các** (§3.2): 51 món / 8 ô, 5 bộ ngũ hành + Hợp mệnh, Ngọc + điểm danh + VIP + quà cấp, phụ kiện 3D, skin hiệu ứng, ngự vật (mây, hồ lô, đài sen, hạc), khung tên, quầy trong sân, đồng bộ MMO. Sửa kèm: `net.js` không chép `acc` của người khác (đai luôn mặc định); bong bóng thoại của Thầy trỏ về vị trí bàn cũ.
- 2026-11-05: **đợt vá bug + nội dung P0** (thi công theo `GAME-THIET-KE-CHOT.md`, tài sản theo `GAME-MESHY-ASSET-PLAN.md`):
  - **Ghế phantom Trà Thất:** cũ — máy chủ không trả lời xin ghế thì client tự nhồi người vào bồ đoàn giữa (SEATS[1]) dù có thể hết chỗ → hai người đè một ghế. Giờ `net.js › setSitting`: đường thất bại trả −1 (không số ảo) → `main.js` toast «Hết chỗ ngồi», không dời người; chỉ ngoại tuyến (offline-first) mới cấp ghế cục bộ; gọi chồng dùng lại cùng promise (`seatPending`), máy chủ trả `seat` thì clear. `worker/quan-room.js`: ROOM_CAP đếm cả socket chưa hello (`occupied()`), `sweepIdle()` đóng socket nối mà không chào sau 30 s. `stations.js › openTra` bỏ toast kép.
  - **Tường thành hở:** cũ chỉ 1 khối chặn giữa mỗi đoạn cung → mối nối hở ~8 m xuyên được thành. `obstacles.js › cityWallBlocks`: 3 khối/đoạn (bước ~5,2 m < đường kính khối ~6,8 m → kín vòng), `landmarks.js › wallRing` dùng nó, cổng Nam vẫn mở. Kèm `markTerraceEdges` (obstacles + landmarks › terrace): viền vách mép nền bậc — không trèo lên nóc từ hông, cửa bậc chính diện vẫn mở.
  - **Biên Thái Tuế:** origin điện 2000 → 1850 (`world.js › ROOMS`) — x=2000 là ô 1260, vượt biên server (maxX 1210 ô = 1920 m) nên `mv` đứng trong điện bị giao thức bỏ gói; dời cửa tránh chồng hình với Lão Quân Điện (1800) và Vận Mệnh Các (1900).
  - **Farm Phúc Khí:** `state.js` — thưởng lá số khóa theo **khóa sinh** (`chartBirthKey`: xoá hồ sơ rồi tạo lại cùng người không +10 lần hai); keo bị thần từ chối cũng tốn lượt (`daily.stickTries` + `sticksLeft`); phút trà kẹp trần ngày không cộng tràn (`addTeaMinutes`); chữ hết lượt ở xin xăm nói đúng chuyện keo chối (`stations.js › openXam`).
  - **Chấm án clamp:** trần thưởng án/ngày `CASE_GAIN_CAP = 60` gộp mọi loại án, vượt chỉ nhận phần còn (`state.js › recordCase` — chống farm điểm client tự tính); chấm án cổ: tòng/chuyên vượng là bản chất cách cục, ưu tiên hơn vượng/nhược (`cases.js › buildClassical`); gợi ý án Tứ Trụ không phá bookkeeping thẻ đã dùng (`case-ui.js`).
  - **Dispose GPU:** `render3d.js` hủy geometry/material bản cũ khi đổi trang bị (hero, outfit, ngự vật, hào quang) và khi người rời phòng trước khi nạp xong; `characters.js › createCharacter` theo dõi material clone riêng từng instance (texture chung cache không hủy); `master-ui.js`: promise lib AI hỏng không bị cache (thử lại được), stream token gộp theo rAF.
  - **Tên món VIP:** danh mục dùng tên thật «Tử Y Chân Nhân · Mũ Sen Vàng (VIP + cấp 10) · Bát Quái Hộ Thân Phù · Tiên Hạc» — đã sửa §3.2 khớp `cosmetics.js` (bản cũ ghi «Liên Hoa Quan, Pháp Luân»).
  - **Vận Mệnh Các / Thái Tuế Điện wire-up:** trạm bia + 9 cổng đại vận + bàn lễ Thái Tuế (`world.js` VAN_GATE_Z/VAN_STELE, `stations.js › openVan` nạp lười), nội thất thủ tục (`interior.js › buildVanMenh / buildThaiTue`; vách 60 bài vị atlas clamp theo cao độ phòng), đèn an Thái Tuế `state.js › lightLamp` (+10 lần đầu, +3/ngày, 1 lần/ngày). iOS tắt cả hai điện: `features.js` — `hasStation` giờ lọc cả trạm `door_/exit_` theo IOS_OFF (bản cũ cửa hai điện vẫn hiện trên iOS).
  - Khác: `protocol.js › cleanTitle` (danh hiệu qua bộ lọc tên), `net.js › tp` (nhảy đổi phòng/xe ngựa không bị sanityMv kẹp về chỗ cũ), `main.js` mất focus thả phím + cent joystick, `stations.js › chartOf` cache key kèm năm phân tích (qua giao thừa không trả chart năm cũ), `models.js` hạ án thư thấp hơn.
  - Test chạy đạt trong đợt này: `test-game-state.mjs` (19), `test-quan-protocol.mjs` (14), `test-game-collide.mjs` (131), `test-game-cosmetics.mjs` (8), `test-game-vanmenh.mjs` (9), `test-game-thay-mo-rong.mjs` (13 — Đường Thầy), `test-game-npc-deep.mjs` (7), `test-game-halls.mjs` (8 — baseline giữ nguyên).
- 2026-11-09: **NPC-AI G0–G2** (thi công theo `docs/GAME-NPC-AI-THIET-KE-DAY-DU.md` — 217.852 từ, 36 mục; sách đã vá 8 finding medium/low + đồng bộ 3 lỗi cao):
  - **G0 module thuần:** `persona-data.js` (PERSONA-CHUNG 10 luật + 20 persona đủ 7 trường, `lama_dakiet` fail-closed `runtime:false`), `npc-personas.js` (getPersona / personaSystemPrompt — bảng biến đóng 15 khe / personaBark), `bark-pool.js` (pickBark một nguồn: 20 persona dẫn chiếu persona-data + pool trạm xam/que/huong/tra/sen/la_ban/lich + nhóm khách `khach_dieuhau`/`khach_cachcuc`), `story-gen.js` (`makeStory(seed, R, slot, pid…)` — same-seed deterministic, tách pid, chuyện gắn cách cục), `map-rating.js` (6 mức liunian → nhãn mềm «Thuận/Bình thường/Nên thủ», rating gốc chỉ nằm trong `<details>`).
  - **G1 inject:** `ai.js` — system message persona chèn đúng khung mục 04 §4.4.2 (giữa khối brief+anti-manip và STYLE), persona vào cache key `_briefCacheKey` (không persona → key byte-giống cũ), dynamic import sau guard nên **flag tắt dist không chứa 1 byte persona nào** (build kiểm chứng 2 chiều). Flag `FEATURES.personaAi = false` mặc định — chờ gate eval M-ROLE/P0 trước khi bật.
  - **G2 wire:** khách hỏi việc có **«Chuyện khách»** riêng sinh từ seed hôm nay + lá số (main.js › todayNpc → makeStory; stations.js › storyCaseBody), nhớ khách qua ngày bằng localStorage `khach:<pid>:<ngày>` (tự dọn key quá 30 ngày); bark trạm (Bàn Thầy/La Bàn/Ống Xăm/Lư Hương/Bảng Lịch/Trà/Sen/Thầy Giải Quẻ/sảnh nghề) qua pickBark theo dayKey; Bà Tư Tàng Y Các bark bong bóng khi lại gần; tutorial 3 câu Lão Tùng lần đầu qua Sơn Môn (flag localStorage); bark bia Vận Mệnh + cổng đại vận + tuyên vị Thái Tuế (vị thứ 43/60 + phương kiêng dân gian); nhãn mức qua mapRating.
  - **Audit đối kháng sau G2** (10 mũi): 7 sạch (không lộ chuyện qua payload MMO, seed nhất quán 3 màn, flag fail-closed, cache key cũ nguyên vẹn, Lập Xuân đúng giờ thật, không chữ «Đại hung/Hạn» lộ ngoài details, esc đầy đủ) + 6 finding đã vá: một nguồn bark (xoá bản copy kép + helper chết world.js, `dieu_am` lệch chính tả 1 chữ giữa 2 bản — thắng bản đúng), một công thức hash (personaBark = pickBark), khách sân im lặng khi topic không khớp pool (hết mâu thuẫn bong bóng vs án), prune localStorage, «Ba lần keo» đúng số liệu, dayKey/tutorial bark hết cấp phát mỗi frame.
  - Gate: **19/19 suite node đạt** (thêm mới: persona-schema 14, bark-pool 8, story-gen 8, map-rating 6, ai-persona 10), `test-quan-mmo` 12/12 trên server thật, `vite build` sạch, smoke trình duyệt bản production: vào quán → thế giới → bark Ống Xăm («Keo chối là thần nói thật…») + «Chuyện khách» Cô Hà hiện thật. Chưa làm: G3 (3D canon — chờ tài nguyên Meshy tải về), G4 (runtime tôn giáo — chờ biên bản tham vấn), gate eval 200 câu trước khi bật `personaAi`.
- 2026-11-09: **G3-lite — model canon đầu tiên + 3 điểm G3 vào world** (tự tải từ thư viện Meshy bằng URL ký sẵn của viewer, KHÔNG đốt credit — balance còn 7/7):
  - `lib_ong_lao` («Taoist Monk in Traditional Attire», CC0, task 019941bf — 696.251 mặt, có rig; `scripts/strip-anim.mjs` cắt 1 animation thành prop tĩnh rồi `meshy-pack-library.mjs` pack 3 mức: hd 2,55 MB / base 0,99 MB / lod 0,18 MB). Provenance ghi `library/links.json` + `LICENSES.md`.
  - **Lão Tùng** đứng cổng Sơn Môn (6, 72 — cách tâm bark tutorial 7,7 m) + biển tên 3D; **Am Vân Cốc** = `lib_mtn_house` tại (−56, −163) sườn Tây Hậu Sơn (không đè nền cliff_palace); **bàn thoại Khổng** = `scholar_desk` + chiếu cói procedural (plane rơm #c9a86a) cạnh am. `world.js` thêm registry `PLACES` (một nguồn toạ độ, landmarks đọc lại); biển tên 3D qua helper `nameBoard()`.
  - Mồi tìm model: trang post community chỉ rót GLB ký sẵn qua performance entry khi model CÓ RIG (viewer load `Animation_*_withSkin.glb`); model static stream `model.json` không lộ GLB —model static cần download tay (nút Download nằm trong viewer WebGL không chạy được trong trình duyệt nhúng).
  - Còn thiếu cho G3-full: model riêng Vân Cốc (nhà sư áo cam) + Khổng (đế truyền văn) — các trang post static đã chọn sẵn trong sách hồ sơ 17/18 (The Hermit, The Smiling Sage — CC0) chờ download tay hoặc tìm bản rigged tương đương.
- 2026-11-09: **Audit cảnh «giả» — làm lại mặt đất, cỏ, đường, nước, đá, cây, sân lát** (không còn cỏ thảm nhựa / ô bàn cờ / cây khối nón):
  - `ground-tex.js`: kết cấu thủ tục liền mạch (noise tuần hoàn) có độ cao + normal map — cỏ nền (ngọn cỏ nằm, cỏ ba lá), đất (sỏi, cành khô, vệt ẩm), đá (thớ lớp, khe nứt mảnh, địa y), đá cuội, phiến lát xếp so le (mạch ~1 cm, ố, sứt góc). `stoneMaterial()` thay `stoneTex()` cho sân Sơn Môn, ngự đạo, nền bậc, tường thành, sàn điện.
  - Địa hình (`world3d.js`): trộn 4 lớp theo độ cao (height blend) thay màu đỉnh phẳng; lấy mẫu 2 tỉ lệ + xoay chống lặp ô; đá vách dốc chiếu triplanar 2 tỉ lệ; bờ ẩm tính theo từng điểm ảnh (hết răng cưa tam giác); đá chỉ lộ ở dốc > ~36°.
  - Đường (`roads.js`): bỏ dải mesh nổi mép cứng → trường khoảng cách 1024² vẽ thẳng vào shader địa hình (bám dốc tuyệt đối, lề đất, cỏ không mọc trên đường); thêm đại lộ Nam + trục Đông–Tây trong thành.
  - Cỏ thật (`grass.js`): 7k/16k/28k khóm (low/mid/high), ngọn cong vuốt nhọn, gió 2 tần số + cơn giật, rạp quanh chân, hoa dại lác đác; vị trí toroidal + trường độ cao/mật độ nướng cuốn chiếu (không mọc trên đường/sân/nước/dưới công trình), mờ dần sát camera.
  - Cây (`trees.js`, `forest.js`): thông Hoàng Sơn tán tầng mây + cây lá rộng chẻ nhánh, thẻ lá alpha pháp tuyến cầu, vỏ cây vẽ thủ tục, gió lay tán; 3 tầng gần/vừa/impostor (chụp chính cây); tông màu riêng từng cây.
  - Nước: màu theo độ sâu (bản đồ độ cao nướng cuốn chiếu), bọt mảnh ven bờ, gợn 2 lớp trôi khác hướng, phản chiếu trời dịu.
  - Bóng đổ: tự hạ chất lượng theo bậc (bậc 1: độ phân giải 1×, bloom tắt, cỏ ½, bóng 1024 · bậc 2 mới tắt bóng), bỏ qua 10 s đầu khi nạp; chunk địa hình phẳng không đổ bóng (trước đây cả sân Sơn Môn bị phủ bóng xám của nền đất bên dưới → trông như trời âm u). `localStorage huyenquan:quality` đặt tay thì không tự hạ.
  - Đèn đá sân: tạc kiểu thạch đăng bát giác/lục giác bằng đá thay hộp trắng + mái đen; lan can đá có vân.
  - Nhãn gian: chỉ hiện trong ~70 m và không «xuyên tường» Sơn Môn.
  - `scripts/meshy-lod.mjs`: đọc được GLB đã nén meshopt.
- 2026-11-09: **Hết giật lag khi nạp và khi chơi + vá đi xuyên công trình / nhân vật chồng nhau** (đo bằng `src/game/perf.js` — `__perf.top()` trong console):
  - Trước: ~4,6 s luồng chính bị chặn trong 25 s đầu (biên dịch shader + đẩy texture 2,3 s; sinh kết cấu/vị trí cây 0,9 s; dựng chunk 13–27 ms mỗi lần qua ranh; cắt lát va chạm 66 ms/công trình).
  - **Web Worker** (`gen.worker.js`, `gen.js`, `terrain-mesh.js`): kết cấu mặt đất + phiến lát (OffscreenCanvas), lưới chunk địa hình, vị trí cây, bản đồ độ sâu nước — luồng chính chỉ gói mảng số. Không có Worker → tự chạy tại chỗ. Vật liệu đá dùng kết cấu tạm 4×4 cùng kiểu (đổi sang bản thật không biên dịch lại shader).
  - **Màn nạp thật** (`render3d.ready`): chờ địa hình, rừng, sơn môn + mọi vùng trong 900 m, cắt lát va chạm, đặt trời/PMREM TRƯỚC khi `compileAsync` (thiếu environment lúc biên dịch = khung đầu biên dịch lại mọi vật liệu), đẩy texture lên GPU, vẽ nháp một lượt với khung bóng phủ cả thế giới (biên dịch sẵn shader bóng của cây instanced / chunk núi), rồi chạy ngầm 10 khung sau màn để những thứ dựng lười (nhân vật, gia trì, phụ kiện) biên dịch khi màn còn che.
  - **Hâm nóng khi đang chơi** (`assets.setWarmup`): mô hình/nhân vật/vùng mới nạp được biên dịch song song (KHR_parallel_shader_compile) + đẩy texture dần từng khung TRƯỚC khi đưa vào cảnh; meshopt giải nén trong Worker.
  - **Nguyên nhân khựng 250–400 ms mỗi lần đi qua vùng có đèn**: nhóm đèn điểm bật/tắt `visible` làm đổi số đèn → mọi shader biên dịch lại. Giờ số đèn cố định, đèn rỗi cường độ 0.
  - Tự hạ chất lượng không còn đổi đường vẽ composer ↔ vẽ thẳng (biên dịch lại toàn bộ) — bậc 1 chỉ tắt bloom; bậc 2 không tắt shadowMap (đứng hình 1–2 s) mà vẽ lại bản đồ bóng thưa. Đo FPS bắt đầu 8 s sau khung đầu.
  - Cắt lát va chạm cuốn chiếu ≤ 4 ms/lượt (`collide.js`), đo khung nhân vật một lần mỗi mô hình (trước: đo theo da mỗi lần sinh khách).
  - **Đi xuyên công trình**: lỗi `instanceModelLod` (`lastKey = ''` trùng khoá lần đầu → bỏ qua lần ghi đầu, mọi bản sao count 0) làm **cả 30 nhà tứ hợp trong thành không có va chạm**; vá xong. Thêm va chạm cho 3 trà đình Cùng Thông Hồ, đỉnh đồng Mạnh Phái, giá la bàn Phong Thủy Viên.
  - **Nhân vật chồng nhau**: NPC đứng yên (Vân Cốc, Khổng, thợ may, khách hỏi việc) có vòng chặn động (`obstacles.setActors`); người chơi khác được tách nhẹ khi đứng sát nhau / sát mình / sát NPC (chỉ phần hiển thị, vị trí mạng giữ nguyên).
- 2026-11-09: **Vẫn đi xuyên điện lớn (cliff_palace Hậu Sơn, ảnh người chơi đứng trong bệ điện) → đặc hoá hình khối công trình** (`collide.js › solidifyCells`):
  - Nguyên nhân: lát cắt tầm thân người (0,4–2 m) chỉ cho VIỀN tường; mô hình Meshy remesh có khe 1–4 m trên viền (bậc bên hông bệ, mép chảy) mà lòng điện thì rỗng → chui qua một khe là vào trong, đi lại tự do (đo: viền chính điện Hậu Sơn hở 3 chỗ, ruột 50×10 m trống).
  - Sửa: công trình ≥ 10 m cả hai chiều (điện, cổng, nhà tứ hợp — mỗi bản sao instanced một đơn vị, gộp mọi mesh con) sau khi cắt lát được đóng khe (giãn rồi co: ≤ 1 m; công trình dài ≥ 30 m ≤ 2 m) rồi lấp mọi vùng kín không thông ra ngoài. Đường hầm thông hai đầu (cổng thành) không bị lấp; lối giữa cổng vẫn do `keep` khoét. Cây, đình nhỏ, bàn án, đèn không đặc hoá.
  - Chỗ đứng của mọi trạm / cửa điện chừa trống bán kính 3,5 m (`obstacles.reserveClear`, đăng ký ở `world.js`) — cửa Điện Thái Tuế nằm trong hốc hiên điện phụ, không bị bịt.
  - Kiểm: mọi trạm tới được như trước; cổng thành, cổng Sơn Môn thông; chính điện Hậu Sơn chặn ở mép bệ. Test `test-game-collide.mjs` thêm 3 ca đặc hoá (134 đạt).
- 2026-11-09: **Huyền Thành → BÁT QUÁI THÀNH** (bố cục Hậu Thiên Bát Quái, thành trì tu tiên):
  - `batquai.js` (thuần, một nguồn): tường **bát giác** trung đoạn 158 m (thay vòng tròn 64 đoạn), **8 cổng = Bát Môn Kỳ Môn** theo cung cố định — Cảnh (Ly, Nam, thành môn cũ 64 m), Tử (Khôn, TN), Kinh (Đoài, Tây), Khai (Càn, TB), Hưu (Khảm, Bắc — cổng nhỏ sau nền Hậu Sơn), Sinh (Cấn, ĐB), Thương (Chấn, Đông), Đỗ (Tốn, ĐN). Trung Cung = Sơn Môn. 8 tháp góc. **Đường vành bát giác** (trung đoạn 100 m, vòng trước nền Hậu Sơn ở z −71) + đại lộ 4 khu chéo. Khung cục bộ mỗi khu (u theo trục, v ngang) — tường và đường vành đều bát giác đều nên mỗi khu nhận đúng một cạnh, bố cục đối xứng.
  - **8 khu**: Ly Hỏa Phường (phố chợ cũ + Đan Dược Các, Hỏa Vân Tửu Lâu, Cửu Chuyển Đan Lô) · Khôn Nguyên Điền (kho lương, nông gia, 2 thửa linh điền rào tre) · Đoài Trạch Lâu (trà lâu, ao sen + Cầm Âm Thủy Tạ, ca đài, liễu) · Càn Kiếm Các (kiếm các, Vấn Kiếm Đình, luyện võ trường: sân cát, giá binh khí, cọc gỗ) · Khảm Thủy Hậu Sơn (quần thể điện cũ + giếng linh tuyền) · Cấn Sơn Trận Các (Trấn Sơn Bảo Tháp, Bát Môn Trận Đường, la bàn, non bộ) · Chấn Lôi Đài (Lôi Âm Điện, Lôi Cổ Lầu, **lôi đài bát giác** mặt Thái Cực + 8 quẻ, 8 cờ theo hành) · Tốn Phong Lâm (Tàng Phong Lâu, Bách Thảo Đình, dược viên, đào). Mỗi khu: **đĩa quẻ khảm đá** trên đại lộ (hào 1 hướng vào tâm), **bia quẻ** (quẻ, Bát Môn, tên khu, chủ đề), đèn lồng, nhà vườn, biển tên trước mỗi công trình.
  - `batquai3d.js` dựng 3D; model ưu tiên `bq_*` (thư viện cộng đồng Meshy — `BQ_AVAILABLE`), chưa có thì dùng model CC0 đã có (`lib_*`, `hall_main`, `tea_pavilion`…). Dãy phố, nhà vành, tháp đỏ/đình hai tầng, đào cũ của vành tròn đã bỏ (chuyển vào các khu).
  - **33 NPC dân thành** (`citizens.js`, dữ liệu `batquai.js › CITIZENS`): luyện đan sư, chủ tửu lâu, nông gia, trà nương, cầm sư, ca kỹ, kiếm tôn + đệ tử, trận pháp sư, lôi tôn + đấu sĩ, dược sư, thủ thư, vệ binh 8 cổng (mỗi người nói Bát Môn của cổng mình)… Áo nhuộm theo hành của quẻ khu; 6 người đi lại trên đại lộ (dừng khi khách chắn đường), người đứng thì quay nhìn + chào khi khách tới gần, nói câu theo vai trong 7 m (theo ngày + lượt, không qua mạng). Chỉ dựng khi người chơi trong 70 m (≈ 5–8 nhân vật hoạt động một lúc); có vòng chặn — không đi xuyên NPC.
  - Va chạm: khối chặn tường bát giác (`octWallBlocks`, bước ≤ 4,5 m) + tháp góc; cổng do model chặn, chừa hành lang |v| < 5. `collide.addFootprint` cập nhật ma trận cả chuỗi cha (vật trong nhóm con chưa cập nhật ma trận bị cắt lát nhầm về gốc toạ độ — đã gây lấp kín bậc lên Bàn Thầy).
  - Test `scripts/test-game-batquai.mjs` (66): hướng/hào/Bát Môn, tường kín + 8 hành lang cổng, mọi công trình không đè nhau / không lấn đại lộ, đường vành, Sơn Môn, nền Hậu Sơn, ô cổng, chân tường; chỗ đứng + lộ trình NPC không vướng. `test-game-collide.mjs` chuyển sang tường bát giác. Kiểm trong game: đi ra được cả 8 cổng (cắt tường đúng hành lang), mọi trạm tới được như trước.
  - **Model mẫu cộng đồng Meshy cho Bát Quái Thành (CC0, tải — không tạo mới)**: 17 model `bq_*` (điện Lôi Âm, Đan Dược Các, tửu lâu, đỉnh đồng luyện đan, nhà nông, trà lâu, thủy tạ, ca đài, kiếm các, Vấn Kiếm Đình, giá binh khí, Trấn Sơn Bảo Tháp, Bát Môn Trận Đường, Lôi Cổ Lầu, Tàng Phong Lâu, Bách Thảo Đình, sư tử đá hai bên 7 cổng). Tìm bằng API cộng đồng (`community/posts/search`, cần đăng nhập web), kiểm giấy phép CC0 ở task công khai, tải GLB qua `v2/tasks/<id>/asset-url?type=Showcase&format=glb`. Gốc 8–190 MB/model (0,1–4,9 triệu mặt) → `meshy-pack-library.mjs --set bq` nén 3 mức (hd ~300k / thường ~80k / lod ~12k) — tổng bản thường 24 MB. Provenance: `assets-meshy/library/LICENSES.md` + `bq_links.json` (thư mục library không lên git). Khung chiếm đất trong `DISTRICTS.foot` lấy max của model Meshy và model dự phòng → test bố cục đúng với cả hai. NPC vẫn dùng rig Meshy sẵn có (model cộng đồng tĩnh không có động tác).
- 2026-11-10: **Bát Quái Thành ×7 diện tích — Nội Thành + Ngoại Thành, phố dày như thật** (kế hoạch: tường ngoài trung đoạn 420 m — phóng ×5 chiều dài sẽ nuốt các tông môn ở bán kính 620–830 m):
  - **Hai lớp thành**: Nội Thành = thành Bát Quái 158 m giữ nguyên; **Ngoại Thành** tường bát giác 420 m (cao 17 m, mã diện giữa đoạn, 8 tháp góc), 8 cổng lớn rộng 56 m — mỗi cổng ngoài hướng đúng một vùng (Tây → Phong Thủy, Đông → Lịch Đường, Bắc → Thư Lâu, TB → Tử Bình, ĐB → Mạnh Phái, TN → Trích Thiên, ĐN → Cùng Thông); đường tới sảnh nghề đi thẳng từ cổng ngoài (bỏ vòng cung R 205 cũ).
  - `cityblocks.js` (thuần, tất định): 8 đại lộ hướng tâm 14 m, 9 vành phố bát giác (vành giữa 290 rộng 10 m), ngõ dọc |v| = 46/86/126, phố ranh giữa hai cung → **368 lô phố, 1.784 nhà** liền dãy quanh chu vi lô quay ra phố, khe 0,3–0,8 m; lô sát đại lộ / vành giữa là cửa hàng (lầu hàng đèn lồng, tửu lâu, trà lâu); sân trong có nhà tứ hợp / vườn cây. Pha trộn mẫu nhà theo chủ đề cung. Mỗi cung 1 **công trình mốc** (Chu Tước Lâu, Hậu Thổ Từ, Đại Hý Đài, Thiên Kiếm Lâu, Huyền Thủy Tháp, Trấn Nhạc Tháp, Phong Lôi Điện, Thanh Phong Các) + 1 **lô chủ đề** (Chu Tước Đại Thị, linh điền, Đoài Trạch Hồ, giáo trường, Khảm Thủy Đàm, thạch lâm, Chấn Lôi Đấu Trường, dược viên). 72 dân phố (người đi đường, phu khuân vác, người bán, lính cổng ngoài) — `citizens.js` nhận thêm, dựng trong 55 m, tối đa 24 nhân vật hoạt động.
  - **Hiệu năng** (`cityblocks3d.js`): nhà nhân bản theo tầng — < 22 m model gốc (80k), < 55 m `.lod1` (10k, đổ bóng), ô < 140 m `.lod2` (3k, texture 256, không đổ bóng), xa hơn khối thủ tục (tường + mái 4 dốc, màu theo model) gộp 1 mesh/ô 96 m; chia lại khi người chơi đi > 6 m. `.lod1`/`.lod2` giản lược từ **file gốc** chế độ «auto» giữ đường nối UV (`scripts/meshy-lod2.mjs`) — giản lược từ bản `.lod` sẵn có (Permissive) làm texture kéo sọc, nhà trông như giấy bạc nhàu. Trong tầm nhìn: ~0,75 M tam giác gần + ~0,73 M vừa + 36k khối xa. Đèn lồng 160 chiếc dọc đại lộ = cầu thủ tục (model thư viện 12k tam giác/chiếc từng ngốn 1,9 M tam giác). Cây sân trong dùng bản `.lod`.
  - **Va chạm**: nhà = hộp xoay `obstacles.addSolidOBB` (không cắt lát 1.800 model); tường ngoài `addSolidSegment`, tháp / cột / cây `addSolidCircle` (ô lưới, không vào danh sách vòng duyệt tuyến tính). Đảo Thiên Bàn bay (y 460) giờ nằm trên Ngoại Thành → `solid: false` (lát cắt đáy đảo từng chặn mặt đất bên dưới).
  - **Địa hình**: thành phẳng theo đúng bát giác tới ngoài tường 15 m, chuyển dốc ~100 m (`terrain.cityOctDist`); `REGIONS.thanh.r` 450; sông Huyền Hà đổi tuyến vòng ngoài phía TN–Nam (≥ 125 m ngoài tường); không trồng rừng trong thành; đất nện + dải chân cả hai lớp tường.
  - 4 mẫu nhà phố CC0 mới từ cộng đồng Meshy (nhà ngói, nhà hai tầng, nhà đá, lầu hàng đèn lồng) — `LICENSES.md`.
  - Test `scripts/test-game-city.mjs` (14, vào `test:game`): quy mô ≥ 7×, ≥ 1.700 nhà, cung nào cũng có mốc + chủ đề; không nhà đè nhà (SAT) / đè đường / lấn cổng, tường, Nội Thành, Am Vân Cốc, lô đặc biệt; loang lưới 1 m tới cả 8 cổng ngoài, mặt tiền mọi nhà thông ra phố; địa hình phẳng, sông ngoài tường; dân phố không vướng. Kiểm trong game: ra được 8 cổng ngoài và 8 cổng nội, tường ngoài chặn, 80 nhà ngẫu nhiên tới được mặt tiền, mọi trạm tới được như trước, dân phố không kẹt. **Chưa đo được FPS thật**: khung trình duyệt bị ẩn sau cửa sổ khác nên trang chạy chế độ nền (khung hình bị bóp).
- 2026-11-10: **Phố dày hơn + vào được mọi nhà**:
  - **Dày**: dãy nhà liền khe 0,15–0,45 m, hết chỗ thì chen nhà hẹp (lầu hàng / nhà đá thu mặt tiền) → Ngoại Thành **2.107 nhà**; **tường rào vôi trắng mũ ngói** nối mọi khoảng hở trên mặt phố (1.811 khúc, ~4,5 km) — mặt phố liền một dải; nhà cao thấp (kéo cao ×1–1,4 theo tầng); **nền lô lát đá**, không cỏ trong phố. **Nội Thành chen thêm 154 nhà** (`innerfill.js`: lưới chiếm chỗ 0,5 m của toàn bộ bố cục 8 khu + NPC + đường + vùng cấm, quét đặt nhà quay ra đại lộ / về tâm, giữ trống trước mỗi cửa) — test bố cục kiểm không đè gì.
  - **Vào nhà** (`homes.js`, `homes3d.js`): **2.283 cửa** — mọi nhà phố, 8 công trình mốc phường, 10 công trình có tên Nội Thành. 7 mẫu phòng nội thất dùng chung theo loại, đặt ngoài bản đồ phía Đông Nam (x 1520–1820, z −150; trong biên máy chủ): nhà dân (bàn thờ gia tiên, bàn tròn đôn, giường, tủ, bonsai), tiệm hàng (quầy, kệ chum lọ), tửu lâu (quầy rượu, vò rượu, 4 bàn), trà lâu (bình phong, bàn trà thấp, bồ đoàn), dược phòng (tủ thuốc trăm ngăn, giá phơi thảo dược, đan lô), thư lâu (kệ sách, án thư), điện thờ (bàn thờ ba cấp, tượng Đạo Đức Thiên Tôn, cột son, lư hương); vách khung gỗ ô vữa, hoành phi chữ vàng, câu đối, đèn lồng có ánh sáng riêng phòng; 12 người trong phòng (chủ nhà, chủ tiệm, tiểu nhị, chưởng quầy, trà sư, lang trung, thư sinh, thủ từ…). Cửa nhà là **trạm ảo** (không vào STATIONS): `nearestStation` / `stationAt` (bấm vào thân nhà → đi tới cửa) / `stationById('home:i')`; lối ra `exit_home_<loại>` đưa về **đúng cửa nhà vừa vào** (`HOME_RETURN`).
  - Vá: `main.js` gọi `net.tp` (không tồn tại — `net.teleport`) khi vào/ra điện → lỗi console và máy chủ không nhận lệnh nhảy; NPC trong phòng ngoài bản đồ đứng ở độ cao biển mây (−70) → citizens lấy `platformTop` trước.
  - Test: `test-game-city.mjs` (16 — thêm tường rào không đè nhà / đường, cửa trống + thông ra phố, ≥ 2.000 nhà), `test-game-homes.mjs` mới (8 — đủ loại phòng, cửa không kẹt, doorNear/houseAt, phòng không chồng nhau + trong biên máy chủ, vào đúng phòng → ra đúng cửa, bấm thân nhà → đi tới cửa, người trong phòng đứng trên sàn), `test-game-batquai.mjs` (69 — nhà chen Nội Thành không đè gì, cửa trống). Trong game: vào/ra 7 loại phòng đều về đúng cửa (lệch 0,00 m), không lỗi console; cửa nhà phố mẫu không bị chặn; 18 cửa công trình có tên tới được.
- 2026-11-10: **Phố có bản sắc · cửa hàng có chức năng · nhà riêng mua được, bài trí được** (kế hoạch đã duyệt: Phúc Khí cho đồ thường, Ngọc cho đồ quý / nhà lớn; nhà đồng bộ máy chủ, người khác vào thăm; nhà dân đóng cửa, gõ cửa có người đáp):
  - **Bản sắc phố** (`citylook.js` thuần + `cityident3d.js`) — lớp HÌNH đặt lên bố cục, **không đổi** chỉ số nhà / cửa hàng / nhà rao bán / va chạm: 26 mẫu nhà thay vì 9 — Khảm nhà ven kênh + nhà sàn, Khôn kho lương + nhà quê, Cấn nhà quê, Càn / Chấn / Ly nhà tháp ở góc phố, 47 cửa hàng đổi mặt tiền đúng loại tiệm (lò rèn, lò gốm, đèn lồng, mộc, hiệu sách, nguyệt môn, hương, trà trang, dược phòng, khách điếm, nha môn — 16 model CC0 cộng đồng Meshy mới, `.lod1`/`.lod2` riêng); **không hai căn cùng mẫu liền nhau** (thay mẫu cùng tỉ lệ); nhịp cao thấp (góc phố cao hơn, nhà sâu trong lô thấp); mẫu nông hơn khung nhà đẩy ra sát mặt phố. **Tông màu theo hành cung** (`InstancedMesh.instanceColor`, 25% + lệch sáng ±8%, cả khối xa). **16 phường có tên** (Nội / Ngoại phường × 8 cung) — cổng chào `lib_paifang` trên 8 đại lộ (u 174 / 300) + biển tên; nền lát riêng từng cung; đồ bày phố ở góc ngã tư theo hành (Ly đèn lồng, Chấn / Càn cột cờ phướn, Tốn giàn thảo dược, Khôn bao lúa, Đoài đèn đá, Cấn bia đá, Khảm chum nước); **kênh nước Khảm** dọc ngõ v = +86 (bờ đá, cầu đá ở vành phố). Biển hiệu tên tiệm trước 47 cửa hàng; biển «BÁN» đỏ + đèn lồng trước 30 nhà rao bán → đổi thành «Nhà <chủ>» khi có người mua (vàng nếu là nhà mình).
  - **Cửa** (`homes.js`): 2.279 cửa chia 4 loại — 47 cửa hàng, 30 nhà rao bán / nhà riêng, 12 điện (8 công trình mốc + Càn Nguyên Kiếm Các, Trấn Sơn Bảo Tháp, Bát Môn Trận Đường, Lôi Âm Điện), **2.190 nhà dân gõ cửa** (chủ nhà đáp qua khe cửa: câu theo hành phường + giờ + hạt giống ngày, có khi chỉ đường tới tiệm / nhà rao bán gần đó). Bỏ 7 phòng dùng chung `HOME_ROOMS` + `homes3d.js`.
  - **Phòng lưới** (`rooms.js`): mỗi tiệm / nhà / điện một phòng riêng (89 phòng, lưới 22 cột × 30 m, x 1255–1885, z −230…; trong biên máy chủ) — toạ độ tất định theo khoá nên người cùng shard vào cùng căn thấy nhau. Sàn đi được qua `obstacles.setDynFloor` (tra theo ô lưới, không thêm 89 nền vào danh sách duyệt). Trạm ảo `door:` / `knock:` / `exit:<key>` (về đúng cửa vừa vào) / `spot:<key>|<id>` (điểm tương tác trong phòng).
  - **Dựng lười** (`interior-build.js`): dựng khi bước vào (trong nửa giây chuyển cảnh), giữ tối đa 6 phòng, giải phóng phòng cũ nhất (geometry, va chạm `setRoomSolids`, đèn `removeRoomLights`, NPC `citizens.add/remove`). **Cửa hàng**: quầy + chủ tiệm có tên + **hàng thật của tiệm** dựng đúng món (model `pr_*` / thư viện hoặc thủ tục: đèn lồng có ánh sáng, tranh sơn thủy / mai, hoành phi, câu đối chọn sẵn, chữ Phúc, trúc, lan, chuông gió, cầu thạch anh, kiếm) bày dọc hai vách + đảo giữa, hàng tiêu dùng trên quầy; góc dịch vụ (tửu lâu bàn rượu + tiểu nhị, trà lâu đài thuyết thư + bồ đoàn, dịch trạm bản đồ thành, nha môn bảng nhà rao bán + sư tử đá, phong thủy đường giá la bàn, tiệm may giá áo). **Điện**: bàn thờ ba cấp, tượng thần, lư hương, thủ từ. **Nhà riêng**: vỏ phòng theo hạng + hành phường, đồ theo bố cục; giấy tờ cạnh cửa.
  - **Vật phẩm** (`items.js`): 50 món, 14 loại tiệm; mua / bán lại 50% / tối đa 12 chiếc mỗi món; hàng quý giá Ngọc (bình phong xuân hoa, cung đăng, sư tử đá, tượng Lão Quân, Kỳ Nam hương) xoay theo ngày; giảm giá ngày −20%; Tốc Hành Tán (đi nhanh ×1,6 cộng dồn 10 phút), Thanh Tâm Đan (+25% Phúc Khí giải án trong ngày — `state.recordCase`). Giao diện `shop-ui.js`: chủ tiệm (cả danh mục + túi đồ bán lại), thẻ hàng từng món bày, dịch vụ (gọi rượu nghe chuyện 5 PK: án hôm nay / hàng quý trong thành / nhà rao bán hợp mệnh; thuyết thư đọc một mục kho sách cổ `library-data.js`; uống trà tính phút trà chung; thuê ngựa 8 PK tới 8 cổng ngoài / Sơn Môn; sổ địa ốc; thầy xem nhà; tiệm may = Tàng Y Các), thắp hương ở điện.
  - **Nhà riêng** (`estate.js` + lõi nhẹ `estate-core.js` cho máy chủ): 30 căn rao bán — Tiểu Xá 10×8 (600 PK), Nhà Phố 13×10 (1.500 PK), Tứ Hợp Viện 18×14 (4.000 PK hoặc 300 Ngọc), Biệt Viện 22×18 cạnh hồ Đoài (800 Ngọc); sao hợp mệnh theo hành phường so với Dụng / Hỷ / Kỵ thần. **Bài trí** (`home-edit.js`): bản vẽ nhìn từ trên xuống trong bảng — kéo thả bắt lưới 0,25 m, xoay ¼ vòng, cất túi, đồ treo tường bám vách gần nhất, đổi câu đối; kiểm `canPlace` (không đè / ra ngoài / chặn lối cửa) + `unreachable` (dò đường lưới 0,5 m — đồ chức năng phải tới được), tối đa 60 món; phòng 3D dựng lại sau mỗi thay đổi. **Đồ có chức năng**: bàn thờ (thắp hương 5 / 8 / 12 PK theo loại hương), bàn trà (pha trà 4 PK + phút trà), giường (nghỉ lại → vào game thức dậy trong nhà), kệ sách (đọc cổ văn 3 PK), bể cá (2 PK, cần thức ăn), cây (tưới 2 PK, lớn dần theo ngày), la bàn (xem phong thủy). **Phong thủy nhà** (`homefs.js`): 0–100 kèm lời giải — hành đồ đạc so với lá số, Bát Trạch rút gọn theo phương vị thật (cửa phòng = hướng mặt tiền ngoài phố): bàn thờ tựa vách sau nhìn ra cửa, giường không đối cửa, án thư tựa tường, nước Bắc / Đông / Đông Nam không ở Nam, cây phương Đông, đèn phương Nam, tỳ hưu / thiềm thừ quay ra cửa, bình phong chắn cửa, Minh đường thoáng, không chật; về nhà lần đầu mỗi ngày 3 + điểm/10 PK. Mọi thưởng nhà qua `state.grantHome` (mỗi khoá 1 lần/ngày, tổng ≤ 40 PK/ngày).
  - **Máy chủ** (`worker/estate.js`, DO `Estate` một bản toàn cục — **migration mới `estate-v1`, cần duyệt trước khi deploy**): `list / get / claim / release / save / like`, mỗi người một căn (`u` = băm pid phía máy chủ), căn đã bán người khác không mua được, chỉ chủ lưu được bố cục, khen nhà mỗi người một lần. TownShard chuyển `est_*` (`protocol.js` kiểm: h trong khoảng, bố cục giải mã + `validLayout` + câu đối trong danh sách; gói `est_save` ≤ 3.600 ký tự) và phát `est_up` cho shard. `net.estate` (lời hứa theo số hỏi `q`, sổ căn đã bán, cache bố cục); nối lại máy chủ thì tự đẩy bố cục nhà mình, máy chủ ghi căn đã thuộc người khác thì hoàn tiền + cất đồ về túi. **Rủi ro đã chấp nhận**: tiền nằm trên máy người chơi (máy chủ chỉ giữ thứ tự mua + giới hạn 1 căn); chưa thu hồi nhà bỏ hoang.
  - Test: `test-game-items.mjs` (8 — danh mục, mua / bán / giới hạn, đan dược, hàng hiếm + giảm giá theo ngày, cửa hàng đủ cung / đủ loại / không trùng tên / không trùng nhà rao bán, bản sắc phố), `test-game-estate.mjs` (8 — rao bán tất định khớp lõi máy chủ, mã hoá bố cục, canPlace / unreachable, phong thủy đúng chiều, trần thưởng, giao thức `est_*`), `test-game-homes.mjs` viết lại (10 — 4 loại cửa, mọi phòng có cửa, phòng không chồng + trong biên, sàn phòng, vào đúng phòng → ra đúng cửa, spot, gõ cửa), `test-quan-mmo.mjs` +4 luồng nhà (taken / limit / notowner / bố cục sai bị bỏ / khen / bán lại). Trong game (với `dev:mmo`): vào Mộc Nghệ Phường mua đồ, Nha Môn mua Tiểu Xá Ly số 1 (máy chủ giữ chỗ), về nhà nhận thưởng phong thủy, bài trí 6 món, thắp hương / pha trà / cho cá ăn / tưới cây, bố cục lên máy chủ; client thứ hai (pid khác) mua + bài trí Nhà Phố Ly số 2 → cửa hiện «Thăm nhà …», vào thấy đúng đồ, khen nhà. **FPS chưa đo được tin cậy**: khung xem trước chạy 10–19 khung/giây ở mọi nơi, kể cả Sơn Môn không có thành.

### 2026-11-10 — Thành v3: tải nhanh, biệt phủ đi bộ thật
- **Hiệu năng** (đo trên Intel UHD, khung xem trước, đứng Sơn Môn):
  - Trước: vào game 38 s, tải 246 MB GLB, 11,7 triệu tam giác / 1.195 lệnh vẽ, 17 fps.
  - Sau: vào game ~8,5 s (đã có cache), tải ~65–75 MB, 3,7 triệu tam giác / 660 lệnh vẽ, 40 fps (trong biệt phủ 53 fps).
  - Cách làm:
    - Bỏ bản `.hd`, chỉ dùng khi đặt localStorage `huyenquan:models=ultra`.
    - Công trình nạp lười theo khoảng cách (`assets.placeLod`): đầu tiên `.far` 6k, rồi `.mid` 20k, sát mới `.glb` 80k; vật nhỏ ở xa thì ẩn.
    - Nhân bản rải rộng chỉ vẽ bản trong tầm (`tickInstances`).
    - Nhà phố sát người dùng `.mid`.
    - Đèn điểm gắn trong model chuyển vào nhóm đèn chung; nhóm đèn còn 6/4/3.
    - Card tích hợp tự chọn mức `mid`: không bloom, bóng PCF, tỉ lệ điểm ảnh ≤ 1,25.
    - Cỏ ở mức high giảm còn 18k bụi.
    - Điện thờ ở dải phòng phía Đông chỉ vẽ khi đứng trong đó.
  - Bậc model mới sinh bằng `scripts/meshy-lod2.mjs --mid / --far`.
- **Thế giới ×1,6** (`terrain.js`): `heightAt(x, z)` = địa hình cũ tại (x/1,6, z/1,6).
  - WORLD = 3328 m, chunk 256 m (13×13).
  - Vùng tông môn, sông, sảnh nghề và điện thờ dời ra theo tỉ lệ; ROOMS, phòng lưới và `WORLD_TILES` lấy theo `HALF` / `ROOM_X0`.
- **Thành hai vòng tường** (`cityblocks.js`):
  - Tường 420 cũ thành tường Trung Thành.
  - **Vành phủ** 430–672 có tường Ngoại Thành mới (= `terrain.CITY_OCT`).
  - Mỗi cung có một quảng trường VIP hai bên đại lộ (công trình mốc + lô chủ đề dời ra đây) và 2 biệt phủ.
- **16 biệt phủ đi bộ thật** (`mansions.js`, `archkit.js`, `mansion3d.js`), quy mô theo Cung Vương Phủ: 100 × 150 m.
  - Bố cục:
    - Phủ Môn (sư tử đá, biển tên) → Tiền Viện (ảnh bích) → Nghi Môn;
    - Chính Sảnh 5 gian 28×14 + Đông / Tây Sương, hành lang có mái;
    - Thùy Hoa Môn → Hậu Đường + sương phòng → Hậu Lâu hai tầng 72 m;
    - Hậu Viên: hồ, cầu vòm, non bộ có hang, thủy tạ / hý lâu / đình bát giác.
  - 4 biến thể hậu viên theo cung.
  - Va chạm và nền đăng ký ngay. Hình chi tiết dựng lười trong 260 m, giữ tối đa 3 phủ.
  - Vào gian thì vỏ gian mờ và camera kẹp trong gian.
  - Hạng `bietphu` (25.000 PK hoặc 2.000 Ngọc) chiếm chỉ số h 0–15; bỏ hạng `bietvien`.
  - Bố cục bài trí theo vùng (`estate-core.MANSION_ZONES`: 7 gian + 3 sân vườn), tối đa 240 món, máy chủ kiểm từng vùng.
  - Trình bài trí có bước chọn vùng. Điểm cổng phủ và đồ có chức năng là trạm ngoài trời (`rooms.setOpenSpots`).
  - Vào phủ của mình là tính «về nhà» trong ngày. Có thể chọn thức dậy trong Chính Sảnh.
- Test mới: `scripts/test-game-mansion.mjs` (9).
  - Kiểm: vành phủ, tỉ lệ người, đi bộ từ cổng tới mọi gian / cầu / hang, tường bao kín.
  - `test-game-estate` thêm bố cục theo vùng.
- Người trong phủ (mansions.mansionNpcs): 2 gác cổng, quản gia / người trông phủ, người làm vườn quanh hồ; phủ có chủ thêm thị nữ, gia đinh; Hý Viên có đào hát trên hý lâu — lời theo trạng thái phủ (rao bán / của bạn / nhà người khác, gọi đúng tên chủ).
- Chưa làm: tách điểm nạp thành theo cung.

### 2026-11-10 — Quy hoạch vành phủ, biệt thự, thủy đạo Bát Môn
- **Vành phủ mỗi cung** (`cityblocks.mansionPlots` / `villaLots`, `estate-layout.js`):
  - Giữa là quảng trường VIP.
  - Bên trái 2 biệt phủ, rộng 4.550–10.000 m².
  - Bên phải một khu 30 biệt thự, lô 19 × 22 m (418 m²), quanh 3 phố nội khu, có dải công viên.
- **16 biệt phủ, 16 phong cách:** Cung Đình Trung Hoa, Moorish, Phủ Đệ Huế, Tuscan, Nhật, Hiện Đại Kính, Palladio, Lâu Đài Pháp, Giang Nam, Tối Giản, Hanok, Tudor, Thái, Nhiệt Đới Hiện Đại, Mughal, Bali.
- **8 khu biệt thự, 8 phong cách:** Địa Trung Hải, Nhà Vườn Huế, Nhật, Pháp, Tối Giản, Hanok, Nhiệt Đới, Giang Nam.
- **Bố cục phong thủy** áp chung cho mọi khuôn viên:
  - tọa sơn: gò hoặc rặng cây sau lưng nhà chính;
  - hướng thủy: mặt nước minh đường trước nhà;
  - tả Thanh Long: nhà khách; hữu Bạch Hổ: đình thấp;
  - hướng cửa ghi theo la bàn và Bát Trạch (Đông / Tây tứ trạch).
- **Bộ kiến trúc theo phong cách** (`archkit-style.js`):
  - Á Đông: mái cong, mái Huế, irimoya, mái Thái, mái tranh;
  - Tây: mái hip, gable, mansard, vòm, hàng cột và trán tường, tháp tròn, vòm cung, khung gỗ Tudor;
  - Mughal: vòm củ hành, chhatri;
  - Hiện đại: hộp kính, khối đua, lam gỗ;
  - mỗi kiểu có tường rào, cổng, bể / kênh / vườn hoa / vườn đá, và cây (cọ, bách, ô liu, đại, anh đào, phong).
- **Nhà rao bán:**
  - Hạng `bietthu` (6.000 PK hoặc 480 Ngọc). Giá biệt phủ tính theo diện tích.
  - Chỉ số: h 0–15 là phủ, 16–255 là biệt thự, sau đó là nhà phố.
  - Vùng bài trí của từng căn lấy từ `estate-core.zonesOfH(h)`; máy chủ kiểm từng vùng.
- **Khu dân thường:** khe giữa các nhà liền dãy giảm còn 6–20 cm; Trung Thành có 2.419 nhà.
- **Thủy đạo Bát Môn** (`canals.js`, `river3d.js`):
  - Nước nạp ở Hưu Môn (Khảm), chảy dọc đại lộ Khảm vào Hộ Thành Hà, hào bát giác ôm tường Nội Thành.
  - Từ hào, nước vòng qua Sinh Môn, Thương Môn rồi ra thủy khẩu ở Đỗ Môn (Tốn), theo đại lộ Tốn ra ngoài.
  - Lòng kênh khắc xuống −2,4 m, mặt nước ở −0,8 m, bờ kè đá.
  - Có cầu vòm ở mọi chỗ đường băng qua, 4 Thủy Các trên đảo đá ở góc hào, 2 Vọng Thủy Lâu, và 10 thuyền hoa thắp đèn xuôi dòng.
- **Va chạm:** vách nhà và tường rào dày ≥ 0,6 m, luôn phủ ô lưới 0,5 m. Nền chia theo ô 64 m.
- **Test:** `test-game-mansion` (8), `test-game-city` thêm thủy đạo, `test-game-estate` thêm vùng biệt phủ / biệt thự.

### 2026-11-10 — Nối sông ra ngoài thành, nước thật hơn, công trình hoành tráng
- **Sông ngoài thành** (`canals.EXT_IN` / `EXT_OUT`): tuyến dò theo địa hình, đường ít dốc nhất.
  - Suối từ khe núi Bắc đổ xuống thành thác ghềnh, men chân tường Bắc, vào Hưu Môn qua thủy môn.
  - Ở cửa ra, nước qua thủy môn Đỗ Môn, men chân tường Tây Nam, hạ dần −0,8 → −6 m rồi đổ vào sông Huyền Hà.
  - Lòng sông khắc bằng `extCarve`, có đá ven suối; lòng sông đặc nên không lội qua được.
  - Vòm đá và song sắt trên hai mặt tường Ngoại Thành ở chỗ kênh đi qua.
- **Nước:** MeshPhysical có bản đồ pháp tuyến sóng tổng hợp, hai lớp trôi ngược chiều, phản chiếu bầu trời và clearcoat Fresnel. Thay cho vệt vẽ canvas.
- **Hoành tráng:**
  - Nhà chính phủ Á Đông cao 11 m, hai tầng hiên, trên nền đá trắng 2,4 m có lan can bạch ngọc, đấu củng, đèn lồng hiên.
  - Phủ Tây / hiện đại cao 3–4 tầng, mỗi tầng 4,2 m, có ban công. Biệt thự 2–3 tầng.
  - Tường Trung Thành cao 24 m, Ngoại Thành 34 m; cổng thành to thêm 25–45%; nhà phố cao thêm 30%.
- **Công trình biểu tượng riêng từng phủ** (tháp cao khoảng 30–36 m bên Thanh Long):
  - Phương Đông: lầu 9 tầng, tháp 7 tầng, thiên thủ các Nhật, gác chuông, chedi vàng Thái, tháp mái tranh Bali.
  - Phương Tây: minaret, tháp chuông, đền tròn Palladio, tháp tròn lâu đài.
  - Hiện đại: tháp kính, khối đua so le, tháp lam gỗ.
- **Cây:** thêm bạch quả, mai trắng, tử đằng, cây đa, sơn trà, mộc tê, mộc lan, bạch dương, phượng tím.
  - Mỗi phủ một bộ 5–6 loại riêng, trồng kín hai hàng dọc tường.
- **Chờ làm:** di chuyển tự do (bơi, chạy nhanh, bay lượn, leo bám công trình và cây — leo trèo mở cho VIP) và phá hủy công trình ngoài thành.

### 2026-11-10 — Di chuyển tự do (motion.js)
- **Chạy nhanh:** giữ Shift, nhanh ×1,9, tốn thể lực. Thanh thể lực hiện khi chưa đầy.
- **Nhảy, khinh công, lượn:** Space để nhảy; bấm thêm lần nữa trên không để nhảy hai lần. Giữ Space khi đang rơi để lượn: rơi tối đa 2,2 m/s, lướt nhanh ×2,1. Màn cảm ứng có nút ⤒ cạnh nút ngự kiếm.
- **Bơi:** trong kênh, sông ngoài thành, hồ và sông thế giới. Nổi ngập tới ngực, bơi chậm ×0,6, bơi vào bờ thì tự trèo lên. Nước kênh không còn là khối đặc; tìm đường A* vẫn tránh nước.
- **Leo bám (chỉ VIP — Chân Nhân):**
  - Đi vào tường, nhà, tháp, cây hay vách núi dốc là tự đu bám leo lên, 3,2 m/s (Shift để leo nhanh hơn).
  - Tới đỉnh thì bước lên mái, mặt thành. Bấm Space để bật khỏi vách, nhả hướng đi thì tuột xuống.
  - Không phải VIP: có lời nhắc mở khóa.
- **Đỉnh công trình** (`obstacles.addTall` / `tallTopAt`): có cho nhà phố, tường thành, mọi công trình GLB (lấy từ `collide.addFootprint`, từng bản sao), nhà và tường rào biệt phủ / biệt thự, tháp, cây.
  - Mặt hồ trong phủ đứng được ở 0,3 m («đạp nước»).
- **Đang ở trên cao:** đi trên mái; ra mép thì rơi theo trọng lực, lượn được.
- **Hiển thị:** cao độ thật gửi lên mạng (`a`) và hiện ra cho người khác; hoạt ảnh chạy / leo / bơi / bay.
- Phòng nội thất vẫn đi như cũ. Ngự kiếm (F) giữ nguyên.
- Test: `scripts/test-game-motion.mjs` (5).

### 2026-11-10 — Phá hủy công trình ngoài thành + Huyền Thành Luật (law.js)
- **Phá hủy** (`raze.js`, phím X, nút ⚒ trên màn cảm ứng):
  - Mọi công trình GLB ngoài tường Ngoại Thành ≥ 20 m đều phá được (lấy từ `collide.addFootprint`).
  - Trong thành có Bát Quái hộ thành đại trận nên không phá được. Công trình có cửa trạm (sảnh nghề, điện) cũng không phá được.
  - Máu theo khối: 30–600. Mỗi đòn trừ 12 máu (thêm 6 khi đang chạy nhanh, thêm 4 nếu là VIP). Bỏ dở quá 30 giây thì công trình lành lại.
  - Khi sập: ẩn hình, gỡ ô va chạm và đỉnh leo trèo (`collide.razeFootprint`), có mảnh vỡ và bụi. Tự dựng lại sau 20 phút (không dựng đè lên người).
- **Máy chủ** (TownShard):
  - Gói `raze {id, x, y}` có `id = s<x>:<z>` (mét làm tròn), phải khớp tọa độ ô, nằm ngoài thành, người phá đứng ≤ 12 ô, tối đa 1 lần mỗi 4 giây.
  - Sổ công trình bị phá lưu trong storage (tối đa 400), phát `razed` cho cả shard. `welcome.razed` gửi danh sách đang bị phá.
- **Huyền Thành Luật** (`law.js`, thuần):
  - Điểm tội = cỡ công trình × Bát Môn (Hưu, Sinh, Khai ×1,6; Cảnh, Đỗ ×1,2; Tử, Kinh, Thương ×0,8) × ngày xung tuổi (×1,5) × ngũ hành của cung so với Dụng thần (sinh trợ ×1,3, Kỵ thần ×0,7) × tái phạm (1 + 0,5 mỗi tiền án).
  - Hình phạt: dưới 20 điểm phạt 25 Phúc Khí/điểm; 20–60 điểm giam Thiên Lao (điểm/4 phút); trên 60 điểm đày Khoáng Sơn (đào điểm/3 quặng); tiền án thứ 7 là khổ sai vĩnh viễn.
  - Không đủ tiền nộp phạt thì bị giam. Vượt ngục thì án tăng gấp đôi. Được chuộc tội 30 Phúc Khí cho mỗi phút giam còn lại. Đại Xá 300 Ngọc (xóa nửa tiền án).
  - 11 điều luật, sách luật mở bằng phím L. Có bảng phán quyết ghi từng hệ số.
- **Thiên Lao và Khoáng Sơn** (`prison.js`, `prison3d.js`): nằm trên dải nội thất phía Đông, hàng z dương. Nền là hàng rào. Thiên Lao có 4 gian lao song gỗ, chòi canh, cai ngục, bia luật. Khoáng Sơn có vách núi, đường ray, lán giám mỏ và 14 mạch linh khoáng phát sáng.
  - Khi đang thụ án: khóa ngự kiếm, không phá tiếp được. Rời chỗ là bị áp giải về. Có huy hiệu đếm hạn ở đỉnh màn hình. Mãn hạn thì về Sơn Môn.
- Test: `scripts/test-game-law.mjs` (12). Đã thử trong game: phạt tiền, giam, vượt ngục gấp đôi, cai ngục chuộc, đào quặng mãn hạn.

### 2026-11-10 — Tài khoản P0: đăng nhập không mật khẩu, tự dựng trên Worker
Đặc tả: `docs/GAME-SINH-TON-KINH-TE-DAC-TA.md` §1.
- **Máy chủ:**
  - Durable Object `Accounts` (`worker/accounts.js`, migration `accounts-v1`).
  - Route `/api/auth/*` và `/api/save` (`worker/auth.js`).
  - Lõi thuần `src/game/auth-core.js`.
- **Đăng nhập:**
  - **Google** dùng OAuth 2.0 Authorization Code + PKCE. Worker đổi mã lấy `id_token`, kiểm `aud`, `iss`, `exp`.
  - **Email:** mã 6 số, hiệu lực 10 phút, sai 5 lần thì huỷ mã. Chỉ lưu băm có muối. Mỗi email gửi tối đa 3 lần / 15 phút và 10 lần / ngày; mỗi IP 20 lần / giờ.
  - **Số điện thoại:** đã có chuẩn hoá E.164 (+84) và luồng mã, nhưng **tắt** cho tới khi chọn nhà cung cấp SMS.
  - Không có mật khẩu.
- **Phiên:** cookie `hq_sid` (HttpOnly, SameSite=Lax, Secure trên https), 30 ngày gia hạn trượt, tối đa 10 thiết bị. Máy chủ chỉ lưu băm. POST từ Origin lạ bị chặn (CSRF).
- **WebSocket:** `/api/auth/ws-token` cấp vé dùng một lần (60 giây), gửi kèm `hello.tok`. TownShard đổi vé lấy tài khoản, mã công khai `u = stableId("acct:" + uid)`. Khách vẫn dùng `pid` như cũ.
  - Lần đầu liên kết, căn nhà mua bằng mã khách được chuyển sang tài khoản (`Estate.rekey`).
- **Lưu đám mây:**
  - `cloudBody` **lọc mọi ngày giờ sinh**: khoá `birth`, và year / month / day / hour / minute của hồ sơ. Máy chủ lọc lại và từ chối nếu còn sót.
  - Có `rev` chống hai máy ghi đè nhau. Chia mảnh 100 KB, tối đa 900 KB.
  - Client gom lưu mỗi 20 giây và đẩy nốt khi đóng trang.
  - Máy chưa gắn tài khoản mà trên mây đã có tiến độ: hiện bảng chọn bản. Máy mới: ghép bản mây, rồi nhập lại ngày sinh ở cổng (có lời nhắc, tên điền sẵn).
- **Quyền người dùng:** xuất dữ liệu (JSON); xoá tài khoản thì khoá 7 ngày rồi xoá vĩnh viễn bằng alarm, đăng nhập lại trong 7 ngày là huỷ xoá.
- **Giao diện:** nút «Đăng nhập · lưu tài khoản» ở cổng, nút 👤 / ☁ trên HUD, bảng tài khoản (Google, Email, Số điện thoại; gắn thêm, lưu ngay, đăng xuất, xuất, xoá).
- **Máy dev:** `npm run dev:mmo` đặt `AUTH_DEV=1`, mã OTP hiện ngay trên màn hình, không gửi thật. Vite proxy `/api/auth` và `/api/save` sang 8788.
- Test: `scripts/test-game-auth.mjs` (8, thuần), `scripts/test-quan-auth.mjs` (10, cần dev:mmo).
- **Chưa có:** bản ứng dụng (Capacitor) — phiên cookie khác origin, làm cùng Sign in with Apple; Turnstile trước khi gửi SMS; giới hạn đổi Dụng thần 30 ngày (§1.3).
- **Cấu hình production** (người dùng tự làm, xem `docs/TAI-KHOAN-CAI-DAT.md`): secrets `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `MAIL_FROM`.

### 2026-11-10 — Sinh tồn + tiền Văn (P1)
Đặc tả: `docs/GAME-SINH-TON-KINH-TE-DAC-TA.md` §2–§3, §6.
- **Chỉ số** (`life.js`, thuần, `state.life`):
  - No −10/giờ chơi (chạy, bơi ×1,5; gánh ×1,3). Tỉnh −7/giờ (thức trắng 23h–5h thì ×2).
  - Khí huyết −4/giờ cho mỗi chỉ số No hoặc Tỉnh dưới 20; +2/giờ khi cả hai trên 50.
  - Khí huyết về 0 thì ngất: về Sơn Môn, mất 20% Văn tiền thuốc.
  - Đói hoặc mệt thì đi chậm ×0,85. Tỉnh < 10 thì không chạy nhanh được. Trần thể lực = 40 + 0,6 × Tỉnh (`motion.js` nhận `staminaCap`).
- **Văn:** 300 văn khởi đầu, không đổi được từ Phúc Khí hay Ngọc, công lẻ cộng dồn.
  - Thuế thân theo bậc giàu: dưới 1 lượng 0; 1–10 lượng 5; 10–100 lượng 30; 100–1.000 lượng 200; trên đó 0,4%. Thu mỗi ngày một lần, không đủ tiền thì ghi nợ.
- **Ăn:**
  - Quầy cơm Sơn Môn: cơm 15, bánh bao 6, mì 10, nước vối 2.
  - Hỏa Vân Tửu Lâu (tiểu nhị trước cửa) và các tiệm tửu lâu, trà lâu, trà trang trong thành (nút «Gọi món» trong tiệm). Trà tối đa 2 chén / 6 giờ.
- **Ngủ:**
  - Liêu xá Sơn Môn: giường chung 30 văn, phòng đơn 80 văn, giữ chỗ 12 giờ thật, 8 canh giờ ngủ cho mỗi lần thuê.
  - Màn ngủ tua 0,5 giây / canh giờ. Tỉnh hồi 9 hoặc 12 mỗi giờ theo cấp; nhà riêng 14, biệt phủ 16.
- **Vắng mặt:** chỉ số giảm 25% tốc độ, sàn No 30. Thoát game ở chỗ trọ đã trả tiền hoặc nhà riêng («Nghỉ tại đây») thì tính là ngủ. Thoát ngoài đường là ngủ bờ bụi: Tỉnh hồi một nửa, 5% bị móc túi 10% Văn.
- **Việc vặt gánh nước** (`jobs.js`, hành Thủy):
  - Múc ở Giếng Đông, gánh khoảng 30 m về quầy cơm. Khi gánh đi chậm ×0,8 và có đòn gánh trên vai.
  - Chấm hiệu suất theo thời gian; chạy thì sánh nước. Ngự kiếm thì đổ hết.
  - Hệ số mệnh: Dụng ×2 tiền; Hỷ ít mệt ×0,7, tay nghề ×1,6; Kỵ ×0,5 tiền, mệt ×2, trần hiệu suất 0,6, rủi ro 8% (ngã, hỏng, bị phạt).
- **Cân bằng (test):** một giờ gánh nước mệnh bình thường được 70–95 văn, đúng bằng một ngày sống tối thiểu (80 văn). Tỉnh tụt 35–55.
- **Nơi chốn** (`lifeplaces.js`, `lifeplaces3d.js`): đặt vào dải trống phía Đông ngoài cổng Nam Sơn Môn, chọn theo lưới va chạm Nội Thành.
- **HUD:** 💰 Văn + 3 thanh (nhấp nháy khi dưới 20), bấm vào mở bảng sinh tồn kèm hướng dẫn sống.
- **Đăng xuất:** máy về chế độ khách thì bỏ nhà riêng trên máy (nhà thuộc tài khoản). Sửa lỗi hoàn tiền nhân đôi khi đăng xuất sau liên kết.
- **P1 chạy trên máy người chơi.** Module thuần, P2 chuyển sổ lên máy chủ khi có giao dịch giữa người chơi.
- Test: `scripts/test-game-life.mjs` (12).

### 2026-11-10 — Đặc tả Phần II: xã hội, sản xuất, thầy mệnh lý, ẩm thực, nhà hàng (chỉ tài liệu)

- Gộp hai tài liệu bổ sung của người dùng vào `docs/GAME-SINH-TON-KINH-TE-DAC-TA.md`, thành **Phần II §12–§20**:
  - hôn nhân và ly hôn;
  - sản xuất và chuỗi cung ứng;
  - thầy mệnh lý người chơi kèm trọng tài AI 3 lớp;
  - ẩm thực có độ tươi và đặc sản vùng;
  - Bát Tự đầu bếp (Thực căn) và công thức bí truyền;
  - mặt bằng và nhà hàng có phá sản;
  - chống khai thác.
- **Lược đồ** bản gốc viết cho PostgreSQL, đã chuyển sang SQLite trong DO: `Player`, `Market`, `Venue`, `Civil`, `Divination`, `Risk`. Có sổ cái tiền dùng chung và chuyển tiền hai pha có khóa idempotency.
- **Lộ trình** thêm P8–P13; 5 quyết định mới (7–11) chờ người dùng chốt. Chưa có mã.

### 2026-11-10 — Chốt quyết định 7–11 của đặc tả sinh tồn / kinh tế (chỉ tài liệu)

- **7. Lá số cho thầy mệnh lý:** luôn gửi tứ trụ 8 chữ kèm hồ sơ rút gọn. Đây là ngoại lệ duy nhất của quy tắc «ngày sinh không rời máy» (§1.3). Vẫn không gửi ngày giờ dạng lịch; không lưu vào save; xóa sau 30 ngày hoặc khi xóa tài khoản; có thẻ đồng thuận (`consent_at`); người đặt lượt phải là tài khoản đăng nhập. Chính sách quyền riêng tư và nhãn kho ứng dụng phải cập nhật trước khi bật P13.
- **8. Thương hội NPC mồi khởi động:** có. Hạn mức 2 lượng / người / ngày, giảm tuyến tính từ ≤ 10 về 0 ở ≥ 30 người hoạt động; chỉ thu thành phẩm; ghi sổ là nguồn bơm riêng.
- **9. Đồng hồ sản xuất:** giờ thật, không tăng tốc.
- **10. Trọng tài AI:** chung ngân sách với NPC chat; trọng tài được ưu tiên khi ngân sách còn dưới 20%; hết ngân sách thì chạy chế độ chỉ lớp 0. Không có người duyệt chuyên trách, quá 72 giờ tự hoàn tiền.
- **11. Hôn nhân:** không chặn tuổi; giữ nội dung ở mức nghi lễ và khế ước.

### 2026-11-10 — P2: 5 nghề theo mệnh + chỗ làm có hạn, máy chủ chấm lương (chưa deploy)

- **Máy chủ:** DO `Guild` mới (`worker/guild.js`, migration `guild-v1`), một bản toàn cục. Logic nằm ở `src/game/guild-core.js` (thuần) nên test chạy thẳng bằng Node. TownShard chuyển gói `job_*` sang và tự cấp vị trí người chơi.
- **5 nghề đợt 1:** Đầu bếp tửu lâu (canh lửa), Phu dịch trạm (áp kiện sang trạm kế bên), Bốc thuốc (nhớ toa), Thợ mỏ (Mỏ Dân Sự Khoáng Sơn mới, xuống bằng xe goòng ở Lò Rèn), Thợ gốm (bàn xoay). Bảng «Chiêu công» bằng gỗ dán giấy đỏ trong mỗi tiệm tuyển người.
- **Luật:** bậc Học việc → Thợ → Thợ cả → Quản sự theo tay nghề; nghề Kỵ dừng ở Thợ. Chỗ làm 3·3·1·1 (tửu lâu)… như §5.1. Ca 8 việc / 30 phút, 3 ca / ngày, bỏ ca nửa tiền; giữ chỗ 3 ngày, bỏ không 24 giờ thì mất chỗ. Cân bằng: 2 ca Học việc mệnh bình thường ≈ 80–85 văn.
- **Chống gian:** seed do máy chủ cấp, thời gian tối thiểu, kiểm vị trí, nhịp đều kiểu bot, điểm tuyệt đối liên tục.
- **Ví Văn vẫn ở máy** tới P8; khi tan ca, máy chủ trả bao nhiêu thì client cộng bấy nhiêu.
- **Kiểm:** `test-game-jobs.mjs` 17 test, `test-quan-mmo.mjs` thêm 3 bước Guild (19 đạt), `npm run test:game`, `vite build`. Trong trình duyệt (dev + wrangler): đã chạy trọn bảng Chiêu công, xin việc, vào ca, bàn xoay, bỏ ca nửa tiền, mỏ dân sự, phu áp kiện qua hai trạm. Sửa một lỗi: mở lại bảng làm đặt lại thời gian tối thiểu của việc.
- **Chưa làm:** hệ số giờ hoàng đạo / ngày can chi trên máy chủ; chỉ cho tài khoản giữ chỗ sau khi deploy `accounts-v1`; hình 3D bảng Chiêu công và mỏ dân sự chưa được nhìn trên màn hình thật (phiên kiểm không có khung hiển thị).
- **Deploy 2026-11-10** (theo yêu cầu người dùng, `npx wrangler deploy` từ máy, bản chưa commit): phiên bản `6ed4048a-f471-472d-8bfb-f763d3bef65f` lên battu.god8.shop, áp 3 migration `estate-v1`, `accounts-v1`, `guild-v1`. Kiểm thật: trang game 200, gói `job_me` / `job_board` / `job_ores` trả đúng, `job_start` ngoài tiệm bị từ chối `noseat`. Lưu ý: CI tự deploy khi push main — push bản cũ hơn sẽ đè bản này.

### 2026-11-10 — Tối ưu tải vào game (deploy 52726774)

Đo bằng `scripts/perf-load.mjs` (Playwright, Chromium, bản thật, không cache): bấm vào cổng → vào game **19,5 s → 8,9 s**; tải mạng **~81 MB → ~33 MB** (GLB 71 → 30,6 MB, 191 → 96 file; JS 10 → 2,2 MB).

- **JS:** chunk `engine-ai` bị ép riêng kéo theo mọi engine nó dùng, game cần các engine đó nên tải luôn `engine-ai`, mà nó nạp tĩnh Đạo Tạng 4,4 MB. Bỏ chunk ép `engine-ai`; hàm nạp trước của vite để chunk riêng `vendor-vite` (trước nằm trong `engine-ai` nên mọi `import()` động đều kéo Đạo Tạng). Thử gom «engine-core» thì vỡ thứ tự khởi tạo giữa chunk (TDZ) → đã bỏ.
- **Phố (`cityblocks3d.js`):** trước nạp sẵn 3 bậc × 26 mẫu nhà (~32 MB). Giờ chỉ nạp sẵn `.lod2`; `.lod1` / `.mid` nạp khi có nhà của mẫu đó vào tầm, chưa có thì dùng tạm bậc thấp hơn. Màn nạp chỉ chờ nhà quanh sân Sơn Môn (tối đa 6 s).
- **Tải đôi:** `firstAvailable` (batquai3d / landmarks) tải nguyên `.lod` để «thử» rồi lại tải `.far` → tra danh sách file lúc build (`virtual:model-files`, `assets.modelAvailable`). Không còn yêu cầu thăm dò file không tồn tại (trên web file thiếu trả index.html 200).
- **`instanceModel`:** dùng `.far` / `.lod` lúc dựng; ≤ 4 bản thì tới gần mới nạp `.mid` và thay vào.
- **Điện thờ (`interior.js`):** dựng lười khi lần đầu tới dải phòng (tượng thần ~6 MB).
- **Cache:** `/models/*` từ `max-age=0` → 1 ngày + `stale-while-revalidate` 7 ngày (`public/_headers`).
- **Còn lại:** ~11 MB model Sơn Môn và nhân vật (một bậc, không có bản xa); `bq_drum_tower` nặng ~2 MB mỗi bậc (giản lược không giảm được). Trang chính (index.html) vẫn nạp tĩnh Đạo Tạng qua thư viện — chưa đụng.


### 2026-11-10 — Đặc tả Phần III: đạp nước, phi hành độc bản, giao diện di động, Âm Đức (chỉ tài liệu)

- Gộp tài liệu bổ sung (mục gốc 23–27) vào `docs/GAME-SINH-TON-KINH-TE-DAC-TA.md` thành **Phần III §21–§25**, lộ trình **P14–P17**.
- **Điều chỉnh chính:**
  - Hệ điểm danh mới gọi là **Âm Đức**, vì «Phúc Khí» đã là tiền tiêu được và là điểm kinh nghiệm.
  - «Hoạt ảnh độc bản» làm bằng lớp tư thế xương riêng, hàm chuyển động riêng và hiệu ứng riêng cho từng vật cưỡi, vì chỉ được tải model Meshy, không tạo mới.
  - Vật cưỡi bay cùng tốc độ.
  - Đuối nước dẫn tới ngất như hệ có sẵn, không chết.
  - Lược đồ PostgreSQL chuyển thành danh mục trong mã + bảng `blessing` trong DO.
- **Chờ chốt:** quyết định 12–16. Chưa có mã.

### 2026-11-10 — Chốt quyết định 12–16 + đặc tả Phần IV: tiền kim loại, Huyền học, tu luyện, luân hồi (chỉ tài liệu)

- **12 (người dùng định hướng):**
  - Tiền mua bán là hệ kim loại vàng · bạc · đồng · hào · xu, lưu bằng xu.
  - Phúc Khí và Âm Đức là điểm Huyền học (không phải tiền); thêm Nghiệp Lực.
  - Có tu luyện tới đắc đạo; chết vì đói / bệnh thì Âm phủ cân nghiệp rồi lục đạo luân hồi.
  - Thiết kế đầy đủ ở `docs/GAME-SINH-TON-KINH-TE-DAC-TA.md` Phần IV §26–§31, lộ trình P18–P21.
- **13:** bỏ mọi Ngọc miễn phí.
- **14:** vật cưỡi bậc cao +5% / bậc, tối đa +20% (trần chung +35%).
- **15:** bán cả Hài Hộ Thân lẫn Định Thủy Châu.
- **16:** đuối nước chỉ ngất.
- **Chuyển đổi người chơi cũ:**
  - Phúc Khí giữ làm điểm Huyền học; cấp đặt tên cảnh giới.
  - Đồ / nhà đã mua giữ nguyên; ví Văn × 100 thành xu.
  - Lộc đổi chế độ một lần: 10% Phúc Khí quy ra đồng, tối đa 2 lượng bạc.
- Chưa có mã.

### 2026-11-10 — Làm lại thủy hệ: sông Huyền Hà 150 m, hào / kênh cho thuyền lớn, vật lý nước, thuyền thuê tự lái (chưa commit, chưa deploy)

Kế hoạch: `~/.claude/plans/zesty-wishing-truffle.md`. Người dùng phàn nàn có nhà chặn giữa dòng (4 Thủy Các trên đảo giữa hào 9 m), sông sai cỡ, nước không thật.

- **Sông Huyền Hà** (`waterways.js`): spline Catmull-Rom từ rìa Tây → chân Trích Thiên → vòng Nam Ngoại Thành (mép nước cách tường > 90 m) → hồ Cùng Thông. Mặt nước 148–182 m, lạch giữa sâu 8–10 m, bãi nông hai bên, bờ dốc 22 m; khúc quanh rộng thêm, lạch dồn về bờ lõm. Dòng chảy 1,3 m/s giữa lạch, 0,3 m/s sát bờ. Hồ dời vào (930, 900) r 250, bờ khép kín (trước tràn ra tới biển mây phía Đông / Nam).
- **Hào / kênh** (`canals.js`): hào 25,5 m (u 162,5–188; chỉ nới ra ngoài được — bỏ vành phố 0), kênh 22 m giữa đại lộ Khảm / Tốn, sâu 3,5 m, đường đi hai bờ v ±15. Kênh Tốn xuyên **thủy môn** Ngoại Thành rồi theo kênh dẫn 22 m xuống sông. Thủy môn (vòm nước 22 × 7 m) ở Trung Thành Khảm / Tốn và Ngoại Thành Tốn. Lạch thuyền trong hào là nửa ngoài (`MOAT_LANE` 180,7).
- **Cầu** (`bridges.js`): 25 cầu lưng gù tĩnh không 5,5 m (vòm bán elip rộng 15 m), mặt cầu là nền đi được theo dốc (bậc ≤ 0,49 m). Khảm / Tốn: kênh đổ vào hào ngay trước cổng nên làm **cầu gác** trên cột (gầm thông thuyền dọc lẫn ngang). **Nam Môn Đại Kiều**: cầu đá 210 m nhiều nhịp thẳng Nam cửa Cảnh Môn, nhịp giữa 40 m, tĩnh không ~30 m, đình giữa cầu, hai lầu cầu, đường Nam Môn mới. Cầu cũ `lib_stone_bridge` (không có nền — bơi xuyên qua) bỏ. Nền cầu có mặt dưới (`addPlatform(…, bot)`) → bơi dưới gầm không bị nhấc lên mặt cầu.
- **Không còn công trình giữa dòng**: Thủy Các thành thủy tạ trên 4 góc bờ ngoài hào; bỏ Vọng Thủy Lâu. Test dò toàn bộ nhà / công trình mốc / phủ: 0 đè nước.
- **Vật lý nước** (`water.js`, `motion.js`): lội 0,5–1,3 m (chậm 0,6, không chạy); bơi > 1,3 m: lò xo nổi quanh «mặt sóng − 1 m», vận tốc có quán tính so với nước + dòng chảy (bơi thường ngược dòng giữa sông ~0 m/s, gắng sức 2,4 m/s mới tiến), tốn thể lực, kiệt sức thì nổi trôi theo dòng. Lên bờ: bậc ≤ 1,4 m bước lên, kè 1,4–2,4 m đu trèo (−12 thể lực); bậc bến đá ở kênh / hào. Sóng = 4 sóng sin theo gió (cùng công thức với shader). Sửa: người bơi trên sông bị vẽ cao vài mét (render theo `p.y3`); gói `mv` thêm `w` (lội / bơi / thuyền) và `b` (loại thuyền) để người khác thấy bơi / thuyền.
- **Mặt nước**: bản đồ dòng chảy (flowmap hai pha) — sông nhìn thấy đang chảy, bọt trôi giữa dòng xiết; ô sóng 400 × 400 m bám người chơi dời đỉnh thật. Nước kênh / hào chung hàm sóng (`water3d.js`). Gợn nước, tóe nước + tiếng nước (`audio.splash/paddle`).
- **Thuyền** (`boats.js`, `boats3d.js`, `boat-ui.js`): đò 6 m (10 văn), thuyền hoa 14 m (40 văn), thuyền buồm 22 m cột 12 m (80 văn) mỗi 30 phút; 8 bến (2 hào, 2 kênh, 3 sông, 1 hồ) có chủ đò. Vật rắn 2D: chèo / buồm theo góc gió (ngược gió < 40° không chạy), bánh lái ăn theo tốc độ, cản ngang lớn (không trượt ngang), dòng chảy cuốn, mắc cạn theo mớn nước, tĩnh không cầu / thủy môn chặn thuyền cao, trụ cầu. W/S A/D Shift, E trả ở bến / buộc ven bờ / lên lại. Đội thuyền NPC: thuyền hoa vòng hào, xuôi kênh; thuyền buồm buôn hai chiều trên sông (lọt nhịp giữa cầu); đò dạo hồ.
- **Dữ liệu đã deploy**: kiểm lại — chỉ số nhà rao bán (283 căn, đúng thứ tự hạng) và chỉ số tiệm (47 tiệm) **không đổi** → không cần map Estate / Guild.
- **Kiểm**: `test-game-water.mjs` mới (9), `test-game-motion.mjs` (9, thêm bơi sông / lội / kiệt sức / gầm cầu), test thành / nhà / việc làm / giao thức / va chạm đạt, selftest đạt, `vite build`. Chụp ảnh Playwright: cầu lớn, hào, kênh Khảm, cầu gác, thủy môn Tốn, hồ, thuê thuyền hoa ở bến hào rồi trả. Đo tải: vào game ~10,3 s ở máy dev (trước ~8,6 s) — thêm do khắc sông trong `heightAt` và bản đồ dòng chảy.

### 2026-11-10 — P18: tiền kim loại vàng · bạc · đồng · hào · xu (chưa commit, chưa deploy)

Đặc tả: `GAME-SINH-TON-KINH-TE-DAC-TA.md` §26, §31.2. Quyết định 12–13: tiền mua bán là kim loại; Phúc Khí / Âm Đức là điểm Huyền học, không phải tiền; bỏ mọi Ngọc miễn phí.

- **`coins.js`** (mới, thuần): lưu mọi số tiền bằng **xu** nguyên; 1 hào = 10 xu, 1 đồng (= văn cũ) = 100 xu, 1 lượng bạc = 1.000 đồng, 1 lượng vàng = 10 lượng bạc. `fmt` («1 lượng bạc 440 đồng», 2 bậc), `short` cho HUD («820Đ 4h»), `parse`, `normPrice` (giá Phúc Khí cũ → xu theo nhóm `PHUC_RATE`), `roundNice`.
- **Ví** (`life.js`): `life.xu` thay `van` + `vanFrac`. API cũ giữ đơn vị đồng (`earn`, `pay`, `L.van` là getter / setter không lưu) để `work.js`, `boat-ui.js`, thuế thân không phải sửa; thêm `earnXu`, `payXu`, `walletXu`, `spendXu`, `gainXu`. Chuyển ví cũ một lần, kèm **lộc đổi chế độ** = 10% Phúc Khí × 4 đồng (tối đa 2 lượng bạc), báo bằng toast khi vào game. Móc túi / tiền thuốc khi ngất tính bằng xu.
- **Giá**: đồ dùng × 4 đồng, đồ bài trí × 6, y phục × 6 (`items.js`, `cosmetics.js` — Ngọc giữ). Nhà: Tiểu Xá 2 lượng bạc, Nhà Phố 5, Tứ Hợp 12 (hoặc 300 Ngọc), Biệt Thự 50 (hoặc 480 Ngọc), Biệt Phủ 3 lượng bạc / 100 m² (`estate-core.js`, `estate.js`). Phạt luật 10 điểm = 1 lượng bạc, chuộc tù 120 đồng / phút (`law.js`; Đại Xá vẫn Ngọc). Dịch vụ tiệm (tin đồn 20 đồng, ngựa trạm 30 đồng — `shop-ui.js`). Nhà đã mua bằng Phúc Khí bán lại vẫn trả Phúc Khí.
- **Bỏ Ngọc miễn phí**: điểm danh 7 ngày chỉ còn giữ chuỗi (mở món theo chuỗi), Ngọc VIP hằng ngày = 0, quà Ngọc lên cấp = 0 (`cosmetics.js`, `wardrobe-ui.js`).
- **Giao diện**: HUD 💰 theo `coins.short`, bảng sinh tồn / quán ăn / liêu xá / việc làm ghi «đồng» và «lượng bạc» (`life-ui.js`, `work.js`, `main.js`). Danh hiệu và hiệu ứng theo ngưỡng (hào quang, lồng đèn, đào nở, hạc) chuyển sang **Phúc Khí tích lũy cả đời** (`state.xp`) — tiêu Phúc Khí không làm mất; P20 sẽ đổi sang cảnh giới.
- **Cân bằng**: mô phỏng trong `test-game-life` (lương `jobs.taskPay` lên bậc theo tay nghề, trừ 80 đồng sống + 1 nén hương + thuế thân). Bản nháp × 12 / × 15 / Tiểu Xá 5 lượng quá đắt (77–108 ngày); bản chốt: Tiểu Xá ≈ 15 ngày (Dụng thần) – 38 ngày (bình thường làm khá) – 58 ngày (làm ẩu); Kỵ thần không để dành nổi.
- **Chưa làm**: Tiền Trang đổi bạc ↔ đồng (gắn với P8 khi ví lên máy chủ); Guild vẫn trả lương bằng milli-đồng → `earn` quy ra xu.
- **Kiểm**: test cosmetics / items / estate / law / life cập nhật theo tiền mới, `npm run test:game` (19 bộ), `test:mmo` (14 + 19), selftest, `vite build` đạt. Trình duyệt: bản lưu cũ 500,4 văn + 800 Phúc Khí → 820 đồng 4 hào (gồm lộc 320 đồng), Phúc Khí giữ 800, toast báo đổi chế độ; HUD «820Đ 4h»; Tàng Y Các: Bạch Y Thư Sinh «1 lượng bạc 440 đồng», thiếu tiền bị chặn.

### 2026-11-11 — Đồ hoạ: nhân vật, tỷ lệ nhà + phố liền vách, hồ sen sống, lư hương chung MMO, hiệu ứng nạp (deploy e992c404, chưa commit)

Người dùng chê nhân vật xấu (mặt, da, dáng), nhà nhỏ sai cỡ, hồ sen đơ, nhà dân không san sát, lúc chưa nạp xong công trình rất xấu; lư hương chỉ một bàn nhỏ, nhiều người thắp không thấy nhiều hương.

- **Nhân vật** (`characters.js`): vật liệu dùng chung theo (mô hình, màu) — nhuộm áo / đai theo vùng màu đo từ texture từng mô hình (`KEYS`; `hero_f` trước nhuộm ngược — màu chính rơi vào đai; `master` không ăn màu); **da không bao giờ bị nhuộm** (trước: môi, má, da trong bóng bị đổi sang màu áo → mặt loang tím xanh); bỏ bản đồ kim loại Meshy (da, vải xám như bạc); da tán xạ ấm nhẹ + mịn hơn; viền sáng theo góc nhìn. Ảnh 2048 (`<id>.hd.glb`, đóng gói lại từ bản gốc Meshy đã tải — không tạo mới) thay vào sau khi đã vào game. Chiều cao thật: nam 1,76 m, nữ 1,66 m (trước mọi người chơi 1,9 m). Camera mặc định 11 m (trước 15), sát được tới 2,4 m, tới gần thì nhìn ngang mặt. Giới hạn: texture Meshy trải UV vụn, mặt không vẽ lại được (miệng `hero_f` hé là của bản gốc).
- **Nhà phố** (`cityblocks3d.js`): bỏ «×1,3 phố tu tiên» + kéo cao ngẫu nhiên (nhà từng cao 11–16 m) → tỷ lệ gốc (2 tầng ≈ 7,5 m, 1 tầng 4–6 m), trần cao từng mẫu; mẫu lấp đủ bề ngang lô (chồng mép mái 1,5%), mẫu đổi ở lớp hình không còn bị thu hẹp → hết khe hở; va chạm hai bên sát vách. Bố cục lô, chỉ số nhà / tiệm / nhà rao bán giữ nguyên (không ảnh hưởng Estate / Guild đã deploy). Bậc gần / sát bỏ kim loại cùng họ sắc với bậc vừa (hết đổi màu ở 40 m); bậc gần thiếu `.lod1` dùng `.mid` thay vì tụt về `.far`.
- **Hồ sen** (`lotus.js` mới, dùng cho hồ Sơn Môn, hồ biệt phủ, ao các phường): mặt nước vật liệu chung (`water3d.waterMaterial` kind `pond`, AMP 0,014, thêm `color` / `tile`), lưới đủ đỉnh cho sóng; lá sen khum mọc thành cụm dập dềnh, hoa / búp trên cuống đung đưa, cá chép bơi Lissajous quẫy đuôi, gợn vòng khi cá đớp mồi; chỉ cập nhật hồ trong 70 m.
- **Lư hương chung** (`incense3d.js` mới, `protocol.pickBurner`, `quan-room` gói `inc`, `net.incense`): lư lớn + 8 lư nhỏ quanh Đại Đỉnh (`court.BURNERS`, có va chạm). Máy chủ phòng giữ hương đang cháy (storage, sống qua hibernation), mỗi người 3 nén / tuần nhang, lư lớn ≤ 15 người, đầy thì lư nhỏ vắng nhất (≤ 6), 9 lư đủ 60 người; người vào sau thấy nhang đang cháy. Nhang vẽ InstancedMesh, khói / ánh lửa dày theo số nén. Chơi một mình vẫn thấy nén của mình.
- **Nạp công trình**: màn nạp chờ công trình trong 90 m lên bản `.mid` (≤ 5 s) thay vì mở màn bằng bản xa 6k rồi nhảy bậc trước mắt; 20 giây đầu nạp bậc chi tiết dồn (0,4 s / lượt); LOD trễ 8% (hết nhấp nháy khi đứng sát ngưỡng); màn nạp mờ dần; sương 190–1700 m (ngưỡng đổi bậc nằm trong mù); sửa bản xa biệt phủ không bao giờ ẩn (khối hộp đè nhà thật — nay ẩn theo từng khuôn viên bằng `aEst` + texture ẩn).
- **Kiểm**: test game, va chạm, giao thức (+ lư hương), MMO 20 (+ lư hương: phát cả phòng, lư lớn trước, không thắp chồng, người vào sau thấy), selftest, build. Trình duyệt: 30 khách giả thắp → lư lớn 15 + 8 lư nhỏ 1–2 người, nhang dày; da NPC tự nhiên; hồ sen có cụm lá, hoa, gợn cá; phố Ly cung liền vách đúng cỡ người. Đo tải trên web: 10,8 s (lần đầu đo 18,5 s do ảnh HD nạp trong màn nạp — đã dời ra sau).

### 2026-11-11 — Rà tối ưu một lượt (deploy 459dd106, chưa commit)

- **Tải**: «62 MB» của đo tải gồm ~20 MB ảnh blob mà GLTFLoader trích từ chính GLB (không phải tải thêm) — thực tải ~40 MB. `bq_drum_tower.far` 2,07 MB (72k tam giác — `meshy-lod2` không giản lược được vì đỉnh rời theo UV) → giản lược «sloppy» meshoptimizer 6k tam giác, **0,23 MB** (`scripts/meshy-sloppy.mjs` mới). GLB lần đầu 39,6 → 37,8 MB.
- **Nhân vật**: bỏ `frustumCulled = false` (nhân vật sau lưng camera vẫn vẽ cả lượt màu + lượt bóng) → khối cầu đo một lần / mô hình theo da, nới ×1,7 cho động tác; kiểm trình duyệt: nhân vật sát mép màn hình không bị cắt sớm. Hoạt ảnh thưa dần theo khoảng cách camera (> 18 m nửa nhịp, > 35 m ¼ nhịp, dồn dt). Người chơi khác > 90 m (trễ tới 80 m) dùng hình rút gọn tĩnh thay nhân vật có xương. Ảnh 2048 không nạp ở chất lượng `low` (điện thoại / máy yếu đỡ ~6 MB + VRAM).
- (Ba việc để lại ở đây đã làm ngay sau — xem mục kế.)
- **Kiểm**: test game, giao thức, selftest, build; đo tải web 10,9 s (dao động mạng; trước 10,8 s).

### 2026-11-11 — Làm nốt: Tiền Trang, phòng nhà riêng khớp khung ngoài, geomorph địa hình (deploy 63c936cf, chưa commit)

- **Tiền Trang** (`life.deposit / withdraw / bankFee / wealthDong`, dịch vụ `tientrang` ở 8 Dịch Trạm + Nha Môn Địa Ốc — `shop-ui.js`): gửi / rút mất 0,5% (tối thiểu 1 đồng), không lãi (hố hút tiền nhỏ). Tiền gửi `life.bank` không bị móc túi khi ngủ bờ bụi, không mất tiền thuốc khi ngất; thuế thân + bậc giàu tính cả tiền gửi. Nhập số tiền theo chữ («2 lượng bạc 300 đồng», `coins.parse`) hoặc nút nhanh. Đổi bạc ↔ đồng không cần (ví một số xu, hiển thị tự quy đơn vị).
- **Phòng nhà riêng = khung nhà ngoài** (`estate.listings().room`, bảng `estate-core.LISTING_ROOMS` cho máy chủ kiểm bố cục): trước mọi Tiểu Xá 10×8, Nhà Phố 13×10, Tứ Hợp 18×14 trong khi nhà ngoài chỉ ~8×8 / 8×8 / 11×7. Nay phòng = khung ngoài trừ tường (7–11,5 × 5–8,5 m). Hai căn lấp đầu dãy 5,7 × 3,5 m bị thay bằng nhà ở đủ rộng cùng cung — số căn (283), hạng và thứ tự h giữ nguyên. Bố cục cũ không còn vừa: món thừa tự cất về túi một lần (`fitLayout`, cờ `own.fit2`); nhà người khác chỉ hiện món vừa phòng.
- **Geomorph địa hình** (`world3d.startMorph / tickMorph`): khi ô địa hình đổi độ chi tiết, đỉnh lưới mới bắt đầu ở độ cao nội suy từ lưới cũ (đúng tam giác) rồi trượt về độ cao thật trong 0,6 s — đồi núi không còn «nhảy».
- **Kiểm**: test game (estate +1: bảng phòng khớp, phòng ≤ khung ngoài, cất món thừa; life +1: Tiền Trang), MMO 20, giao thức, va chạm, địa hình, selftest, build. Trình duyệt: quầy Tiền Trang ở dịch trạm gửi 100 đồng → sổ 99 đồng; phòng Tiểu Xá 7,5 × 7,5 m (nhà ngoài 7,8 m); địa hình núi không lỗi.

### 2026-11-11 — P3–P5, P14–P17: bệnh & nợ, nhà & xe, nhiệm vụ mệnh, đạp nước, phi hành, giao diện di động, Âm Đức (deploy a6017646, chưa commit)

- **P3 Bệnh & Y Quán, nợ** (`illness.js`): 6 bệnh, rủi ro theo hành Dụng thần / áo hợp mệnh / bữa ăn / vận khí; Dược Phòng chỉ chữa bệnh nhẹ, Y Quán bắt mạch theo ngũ hành (đơn hợp Dụng thần khỏi nhanh gấp đôi, thuốc −20%); không đủ tiền vẫn chữa → nợ viện phí 2% / ngày, trần 3× gốc; nợ trên 1 lượng quá 7 ngày → Nha Môn xử khổ sai trừ nợ (`law.debtSentence`, mỗi quặng 15 đồng). Ngất phí 300 đồng.
- **P4 Nhà & xe** (`vehicles.js`): 5 bậc phương tiện (lừa · ngựa · xe ngựa · linh hạc · phi kiếm) có phí nuôi / ngày, 3 ngày không trả bị siết; bảo trì nhà theo hạng; tủ đồ ăn 3 ngày; buff thức dậy theo điểm phong thủy phòng ngủ. Cưỡi bằng phím H / nút 🐎.
- **P5 Nhiệm vụ mệnh** (`fatequest.js`): 15 nhiệm vụ theo hành Dụng thần, đúng giờ, đúng chỗ (cột sáng chỉ người đúng mệnh thấy trong 60 m), thưởng ×3–6; NPC cùng hành nói bóng gió; làm xong mở đặc quyền vĩnh viễn theo hành.
- **P14 Đạp nước** (`movement.js`, `motion.js`): 4 nhánh điều kiện (cấp, Dụng Thủy, vật phẩm, đặc quyền mệnh), thể lực 2 / giây, sàn mặt sóng, dòng đẩy 30%, đuối nước khi hết thể lực; hiệu ứng bước chân sen / sương; người khác thấy (mv `w` = 5).
- **P15 Phi hành độc bản** (`flight.js`, `flight-poses.js`): máy trạng thái 5 bước (cất · bay · tăng tốc · lượn · đáp), tư thế riêng 6 vật cưỡi, trần tốc +35% (mv `fs`).
- **P16 Giao diện di động**: joystick động, menu nan quạt ☰, bản đồ nhỏ + bản đồ lớn, vuốt để bay, con quay (tuỳ chọn), khoá 30 fps.
- **P17 Âm Đức** (`amduc.js`): quẻ đầu ngày, ngày điều độ, 4 cấp vận khí theo chuỗi, đứt chuỗi tạm ngừng (2 ngày tốt mới nối lại), cấp 4 thoát chết một lần; không đổi ra tiền.

### 2026-11-11 — P19–P21: Huyền học, tu luyện, luân hồi (deploy f1c7ecb0, chưa commit)

- **P19** (`huyenhoc.js`): Phúc Khí · Âm Đức · Nghiệp Lực; bố thí (1 PK / 20 đồng, trần 20 / ngày), phóng sinh, sám hối, giải hạn theo tuần; vận số ngày với sự kiện tốt / dữ (Nghiệp tăng họa); quý nhân +20% tiền công. Án tù +5…+20 Nghiệp, khổ sai −1 / quặng.
- **P20** (`realm.js`): 7 cảnh giới, đủ cấp chưa đột phá thì dừng ở đỉnh; đột phá cần Âm Đức / Nghiệp + tĩnh tọa (+ luận lá số, thiên kiếp); Nghiệp nặng → tâm ma mất 10% Phúc Khí; 11 pháp môn × 3 tầng (hợp mệnh rẻ 50%), không môn nào sinh ra tiền. Người chơi cũ giữ cảnh giới ứng với cấp đang có.
- **P21** (`luanhoi.js`): chỉ chết vì đói hoặc bệnh nặng không chữa quá 12 giờ (có cảnh báo, màn xám); Âm phủ cân nghiệp → 6 cõi; canh Mạnh Bà (uống quên 70% tay nghề / từ chối tụt một cõi); 3 cõi dưới là đoạn chơi ngắn ≤ 25 phút, thoát sớm bằng việc tốt, cúng cô hồn giữa người chơi (gói `cung`); kiếp sau dùng lá số HƯ CẤU (ngày sinh thật không đổi, không rời máy), ví −50%, tiền gửi −20% tang phí, Sổ Luân Hồi.
- **Kiểm (trình duyệt)**: chết đói → «Âm phủ — cân nghiệp», điểm 0 → Súc sinh đạo; uống canh → kiếp linh thú 20 phút; rút ngắn → «Đầu thai Nhân đạo», lá số mới 25/3/1997 (hư cấu), Dụng thần đổi, `state.player.birth` giữ nguyên.

### 2026-11-11 — P6–P13: NPC chat LLM, 16 nghề, kho đồ & độ tươi, sản xuất & chợ, ẩm thực, nhà hàng, hôn nhân, thầy mệnh lý (chưa commit)

- **Máy chủ**: Durable Object mới `Economy` (migration `economy-v1`, `worker/economy.js`) — luật ở `src/game/econ-core.js`, chạy chung cho DO, test và client ngoại tuyến (sổ trên máy, `econ-client.js`). Gói `ec {op, a}` qua TownShard (tên thao tác kiểm bằng `EC_OP`; thao tác admin không gửi được từ client). Ví chợ (máy chủ) tách khỏi ví máy: gửi lên có trần / ngày (khách 300, tài khoản 5.000 đồng) và khoá chống gửi trùng — cầu nối tới khi ví lên hẳn máy chủ. Khách (chưa đăng nhập) không giao dịch với người khác.
- **P6 NPC chat** (`/api/npc/chat`, `worker/npc-chat.js`, `npc-chat-core.js`, `npc-chat-ui.js`, `worker/llm.js`): cần đăng nhập; 30 câu thường + 10 câu nghiệp vụ / ngày; câu xã giao cache theo (NPC, ý định, bậc thiện cảm); lời người chơi đặt trong khối rào; LLM chỉ đề xuất — bộ kiểm kẹp báo giá vào 80–110% (giảm theo thiện cảm), mời làm công chỉ khi tiệm tuyển, cho chịu theo uy tín, gợi ý chỉ nhiệm vụ của chính người đó, bác đuổi việc / chỉnh lương / tool lạ; lọc đầu ra (lộ máy, khuyên đời thực, người lớn). Trí nhớ NPC (thiện cảm + 5 sự kiện) ở Economy DO. Không gửi ngày sinh / email / tên thật. AI tắt / hết lượt / khách → câu mẫu theo vai. Nút «💬 Trò chuyện» ở mọi bảng chủ tiệm.
- **P7**: 11 nghề mới cho 11 loại tiệm còn lại (đèn lồng, hương, pha trà, cân trà, may, làm vườn, mộc, chép sách, rèn, môi giới, phụ việc phong thủy) — tổng 16 nghề, mỗi hành ≥ 2; mini-game dùng lại 4 trò với bộ thẻ / lời dẫn riêng; Lò Rèn vừa tuyển thợ rèn vừa có xe goòng. Các nghề đặc tả cần địa điểm chưa có (sân khấu, đan phòng, bến thả lưới thuê, rừng tiều phu…) để sau. Tiệm người chơi = mặt bằng P11 + chợ P9. Bảng admin `…/api/econ`: dòng tiền bơm / hút theo ngày, giá tham chiếu 10 mặt hàng, quán mở / niêm phong, tổng tiền ví chợ, hàng đợi duyệt lời luận.
- **P8 Kho & độ tươi** (`inventory.js`, `econ-data.js`): ~40 nguyên liệu / vật nuôi / đồ nghề + 36 món; độ tươi tính lười (chốt đoạn khi đổi chỗ để), đồ ôi, hầm băng tiêu băng 1 khối / chồng / 12 giờ, đồ nghề có độ bền, sổ tiền có khoá idempotency.
- **P9 Sản xuất & chợ** (`production.js`, `market.js`): thửa ruộng / chuồng thuê theo tuần (tối đa 4), cây & vật nuôi lớn theo giờ thật, tưới 12 giờ, mùa vụ, phân bón, Dụng Thổ; lò mổ theo bảng xẻ, xay xát, ủ phân, ngư phủ với trữ lượng hoang dã có hồi; chợ ký gửi (phí 3% + phí kho, giá tham chiếu = trung vị 7 ngày, ngoài biên độ 30–300% → két 24 giờ, cặp > 20 lượng / 7 ngày → két); Thương hội mồi khởi động (bán +40%, thu thành phẩm −40%, hạn mức giảm theo số người hoạt động, không thu đồ chín / rác).
- **P10 Ẩm thực** (`cuisine.js`): 3 hạng món, 5 vùng khẩu vị, Thực căn tính trên máy từ lá số (khoá 30 ngày), chất lượng theo công thức đặc tả, món cao lương hỏng mất trắng, «No khí» +15–25% hiệu suất 4 giờ, độc tích; 4 bếp trưởng × 3 thử thách, đồ đệ tối đa 20, 12 công thức bí truyền khoá theo tài khoản + ấn ký +30%, chép bộ nguyên liệu → trần 0,6.
- **P11 Nhà hàng** (`venue.js`): 3 hạng mặt bằng có hạn (24 / 12 / 4), ví tiệm tách ví chủ, định phí giờ Tý, khách NPC chia «chiếc bánh» vùng theo danh tiếng × chất lượng × giá (giá > 150% giá trị → 0 khách), mưa giảm khách quầy, âm 3 ngày → niêm phong, phần âm thành nợ chủ; người chơi mua món tại quán người khác (trong biên độ).
- **P12 Hôn nhân** (`civil.js`): một vợ một chồng, cầu hôn bằng câu soạn sẵn với người đứng gần, 3 hạng lễ (người cầu hôn trả), quỹ chung ghi tỉ lệ góp, ly hôn thuận tình 2% / 72 giờ, đơn phương 4% / 7 ngày, chia theo tỉ lệ góp, chờ 30 ngày tái hôn, tối đa 3 lần / năm; không có mừng tiền.
- **P13 Thầy mệnh lý** (`divination.js`): sát hạch 3 lá số mẫu, ký quỹ 2 lượng, giá theo bậc uy tín; khách đồng ý chia sẻ hồ sơ rút gọn + tứ trụ (không ngày sinh dạng lịch, xoá sau 30 ngày); két 24 giờ; trọng tài lớp 0 (độ dài, lặp, MinHash chép văn, sai Dụng thần, câu thao túng, lời khuyên đời thực) → lớp 1 LLM JSON (máy chủ) → lớp 2 hàng đợi admin (72 giờ không duyệt → hoàn khách); ma trận 4 ô; thuế 20 / 17 / 15%; 1 lượt / cặp / tuần, 10 lượt / thầy / ngày, khoá cặp giao dịch dày.
- **Giao diện**: nút 🎒 «Kho đồ» (phím I) — 7 thẻ Kho · Ruộng · Bếp · Chợ · Tiệm · Hộ tịch · Thầy mệnh; việc cần đúng chỗ mở từ quầy dịch vụ mới trong tiệm (Dịch Trạm: chợ; Nha Môn Địa Ốc: ruộng, mặt bằng, hộ tịch; Tửu Lâu: bếp thuê, bếp trưởng; Phong Thủy Đường: thầy mệnh lý).
- **Sửa khi kiểm**: trường `q` của kết quả đè mã gói `q` trong `ec_res` / `job_res` (đổi thứ tự trải + đổi tên chất lượng món thành `qual`); quét két / chốt sổ tiệm ghi vào hồ sơ người gọi rồi bị bản cũ đè (chuyển quét lên trước khi nạp hồ sơ); gửi trùng bị chặn trần trước khi nhận ra là trùng; giá gạo 2,6 làm khâu xay xát lỗ → 3,8; lời thô tục viết tắt («đm…») lọt bộ lọc chat; panel kẹt «Đang mở sổ…» khi máy chủ chưa bật Economy (giờ nhớ trạng thái và có nút thử lại).
- **Kiểm**: `test-game-econ.mjs` 31 (chuỗi lúa → cơm có lãi cả 3 khâu; mô phỏng nhà hàng 30 ngày; injection NPC; ma trận trọng tài; một vợ một chồng; chia theo tỉ lệ góp), `test-game-jobs` 17, MMO thật 21 (+ kinh tế qua Economy DO), giao thức 15, build. Trình duyệt: ngoại tuyến gửi tiền → Thương hội → canh lửa → nấu → ăn → thuê ruộng gieo lúa → thuê quầy; máy chủ cục bộ: trần gửi 300 đồng, chống gửi trùng, nấu / ăn, khách bị chặn ký gửi; route chat chặn lời thô tục, khách nhận câu mẫu. **Chưa kiểm được**: nhánh gọi LLM thật của NPC chat / trọng tài (máy cục bộ không có cấu hình AI của admin) và các luồng hai tài khoản đăng nhập trong trình duyệt (đã có test MemStore).

### 2026-11-11 — P7 đủ 30 nghề đặc tả + kiểm nhánh LLM và luồng hai tài khoản

- **15 nghề ngoài tiệm** (`jobzones.js`, `jobs.js` `zone: true`): kép hát (Ca Đài cung Đoài), giữ lò luyện đan (Cửu Chuyển Đan Lô / Đan Dược Các), pháo hoa (phố chợ Cảnh Môn — chỉ đêm rằm 18–23 giờ, tuổi trăng 13,3–16,3 ngày), lái đò (4 bến hào / kênh), ngư phủ (3 bến sông + bến hồ), buôn muối (Diêm Thị đại lộ Đoài), ủ rượu (mọi Tửu Lâu), tiều phu (rừng Nam Hoang, Đông Lĩnh), kim hoàn (Kim Hoàn Phố cung Càn), thu ngân Tiền Trang (Dịch Trạm, Nha Môn Địa Ốc), bảo tiêu (8 cổng Ngoại Thành), nha dịch (Nha Môn), thợ xây (công trường 8 cổng Trung Thành), nông phu (Khôn Nguyên Thương, linh điền), thợ đá (Trấn Sơn Bảo Tháp). Tổng 31 nghề (30 nghề §4.2 — 6 mỗi hành — + cân trà). Không giữ chỗ; Guild kiểm vị trí theo khu ở cả lúc vào ca lẫn từng việc (`inZone`), pháo hoa ngoài giờ trả `closed`. Biển «Chiêu công» (cột + bảng đỏ + đèn) ở mọi khu ngoài trời (render3d), điểm «Nhận việc» (`setOpenSpots`), quầy nhận việc trong Tửu Lâu / Dịch Trạm / Nha Môn; bảng ca theo khu (`work.zonePanel`). Lương cân bằng như mọi nghề (base ≤ 7).
- **Đặt điểm đúng chỗ đứng**: rà tự động bằng va chạm thật trong game (đi tới cả 35 điểm): lò đan, Đan Dược Các, kho lương Khôn ban đầu nằm giữa công trình → dời ra trước; cổng Khảm / Tốn có kênh giữa đại lộ → đứng lề v 16; bến hồ Cùng Thông tâm là thủy tạ → bậc đá Tây Nam. Kết quả 35/35 điểm không trong công trình, không dưới nước.
- **NPC chat qua LLM (máy cục bộ, LLM giả `scripts/mock-llm.mjs`)**: đăng nhập tài khoản thử trên localhost; câu xã giao gọi mô hình, lời người chơi trong khối rào, không có ngày sinh trong lời gọi; câu nghiệp vụ — mô hình đề xuất «bán 1 đồng» + «đuổi việc» + «chuyển 999.999 đồng» → máy chủ chỉ giữ báo giá, kẹp về giá sổ; hạn mức trừ đúng. **Sửa**: lời NPC vẫn hứa «1 đồng» trong khi thẻ ghi 100 → `npc-chat-core.reconcile` nói lại giá sổ.
- **Luồng hai tài khoản** (`scripts/test-econ-accounts.mjs`, 21 bước, máy chủ cục bộ thật): trần ví chợ 5.000 đồng / ngày, chợ ký gửi giữa hai tài khoản (phí 3% + phí kho, không vào két khi trong biên độ), cầu hôn bằng mã người chơi từ gói join → hôn thư Hàn vi → chặn cầu hôn lần hai, sát hạch → ký quỹ → đặt quẻ (két, 1 lượt / cặp / tuần), thầy chỉ thấy hồ sơ rút gọn (năm sinh, email bị lọc), trọng tài LLM được gọi và đọc đúng schema JSON.
- **Cổng tuổi tài khoản do máy chủ giữ** (thay cho «cấp 10» client khai): Economy DO lấy ngày tạo tài khoản ở Accounts DO (`accountCreated`, ghi `p.born` một lần) — thầy mệnh lý cần ≥ 14 ngày (§14.1), kết hôn cần CẢ HAI bên ≥ 7 ngày (§12.1); khách không có mốc tài khoản nên không kết hôn / hành nghề.
- **Két 24 giờ kiểm trên DO thật**: tham số `_dt` tua đồng hồ của Economy DO, CHỈ có hiệu lực khi `AUTH_DEV = 1` (máy dev, `dev:mmo`) — bản thật không có biến này. `test-econ-accounts.mjs` 27 bước: tài khoản mới bị chặn cầu hôn / hành nghề (dù khai cấp 99), sau khi tua 15 ngày làm tiếp; đánh giá xong chưa đủ 24 giờ thì lượt xem còn trong két và thầy chưa nhận tiền, tua 25 giờ → thầy nhận 100 đồng − 20% thuế, khách thấy «Giải ngân cho thầy».
