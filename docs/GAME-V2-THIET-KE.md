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

## 7. Nhật ký

- 2026-11-04: viết thiết kế v2.
- 2026-11-04: **V2-1** camera nhìn trời (pitch tới 1,15, hạ sát đất), trời đêm gradient + sao, đèn lồng emissive + nhóm đèn điểm động (16/10/6 theo chất lượng); dãy nhà phố thay bằng `lib_courtyard` có LOD.
- 2026-11-04: **V2-2** cổng nhập bát tự → lễ lật trụ → Dụng/Hỷ/Kỵ → phẩm phục (shader thay màu áo/đai); hồ sơ «Bản thân»; MMO gửi `robe`/`acc`.
- 2026-11-04: **V2-3** Thầy Giải Quẻ (`que-ui.js`) trong Chính Điện: Mai Hoa (giờ/số), Lục Hào (gieo xu), Tiểu Lục Nhâm, Kim Khẩu Quyết, xin xăm + keo; nút «Nhờ Thầy luận thêm» (Thầy AI). Đã chơi thử cả 5 phép.
- 2026-11-04: **V2-4** 4 điện vào được: Chính Điện Tam Thanh, Văn Xương Các, Đẩu Mẫu Điện, Lão Quân Điện. 5 tượng tạo bằng Meshy (meshy-6-lite, 100k tam giác). Đã thử vào/ra cả 4 điện. **Còn thiếu** 4 điện vùng (Thái Tuế, Huyền Nữ, Quỷ Cốc, Thủy Quan): hết credit Meshy (còn 7, cần ~20).
- 2026-11-04: **V2-5** cấp / gia trì nguyên tố / ngự kiếm / VIP (§3.1). VIP chưa có thanh toán thật.
