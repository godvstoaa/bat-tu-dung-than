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
