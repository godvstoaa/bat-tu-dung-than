# 05 · Bản đồ nâng cấp 19 thực thể NPC đã có trong code + chuẩn tối thiểu nhóm «có tên không hồ sơ»

> **Tóm tắt (đọc 30 giây):** mục này không vẽ lại bảng thực thể — bảng 39 hàng đã nằm ở mục 01, tại đây chỉ
> nhóm 19 thực thể **đã tồn tại thật trong code Huyền Quán** thành các gói nâng cấp: cái nào chỉ cần thêm bark,
> cái nào cần đặt tên, cái nào đang câm và vì sao câm là đúng. Sửa mạnh nhất của bản này ở §05.6 (Thầy Giải Quẻ
> **ĐÃ CÓ thoại riêng nguyên câu** trong code — không viết «dựng từ số 0») và §05.9 (chuẩn tối thiểu 4 điều
> mới cho nhóm «có tên không hồ sơ»). Mọi điểm cắm nằm trong 6 file đã khoá (render3d.js, stations.js, world.js,
> vanmenh-ui.js, thaitue.js, master-ui.js) đều mang nhãn **«chờ mở khóa (22 file — mục 15)»** — bark các trạm
> vì vậy là việc G2, còn module bark thuần có test Node là việc G1 cắm được ngay.

---

## 05.0 Mở đầu — không lặp bảng thực thể, chỉ nhóm và nâng cấp

Bảng điểm danh đầy đủ (39 hàng, gồm cả 20 NPC canon của bộ gdd chưa wire) nằm ở **mục 01**; bản 05 KHÔNG lặp
lại bảng đó. Nhiệm vụ của mục này có ba lớp, đúng thứ tự đọc:

1. **Nhóm** 19 thực thể đã có trong code thành các nhóm nâng cấp theo mức sẵn có: nhóm «có hồ sơ kèm sẵn
   trong code» (Thầy vô danh), nhóm «có giọng riêng lẻ cần mở rộng» (Thầy Giải Quẻ, Lư Hương), nhóm «có danh
   tính nhưng thiếu lời chào mang tính nhân vật» (Ống Xăm Hoàng Đại Tiên), nhóm «trạm lễ câm — bark tĩnh»
   (Trà Thất, Hồ Sen, La Bàn Đài, Bảng Lịch Ngày, Thái Tuế, Vận Mệnh Các, tượng thần 4 điện, người bán Tàng
   Y Các), nhóm «khách procedural — đã có bộ riêng» (trỏ mục 08).
2. **Nâng cấp** từng thực thể với điểm cắm file:line thật — mọi trích dẫn trong mục này đã được đối chiếu
   trực tiếp với code trong lần viết này (lệnh `sed`/`Read` trên từng dòng được nêu).
3. **Chuẩn tối thiểu** cho nhóm mới đặt tên «CÓ TÊN KHÔNG HỒ SƠ» — 4 điều bắt buộc, viết nguyên văn một
   lần ở §05.9 và áp cho cả nhóm; mục 05 giữ khối chuẩn này, các hồ sơ khác (mục 02–34) KHÔNG lặp lại nó.

### 05.0.1 Cách đếm 19 — bảng đối chiếu đếm theo cá thể trạm/khe

Con số «19» đếm theo **cá thể trạm hoặc khe có mặt nhân vật trong code hiện hành**: ba khe khách sân đếm
riêng từng khe (an0, an1, an2), bốn khách sảnh nghề 1-người đếm riêng từng sảnh. Tượng thần 4 điện là vật
thờ, không phải NPC cá thể, nên không tính vào 19 — được xử lý riêng ở §05.15.

| # | Thực thể | Điểm cắm hiện có | Nhóm nâng cấp ở mục này |
|---|---|---|---|
| 1 | Thầy vô danh (Bàn Thầy Tử Bình) | stations.js:146; master-ui.js:32; render3d.js:205-210 | §05.5 |
| 2 | Thầy Giải Quẻ (Chính Điện) | que-ui.js:176-289; world.js:85; stations.js:718-725 | §05.6 |
| 3 | Ống Xăm — Hoàng Đại Tiên | stations.js:295-394 | §05.7 |
| 4 | Lư Hương | names.js:10-25; stations.js:399-434 | §05.10 |
| 5 | Trà Thất | stations.js:501-558 | §05.11 |
| 6 | Hồ Sen | stations.js:563-584; render3d.js:728-732 | §05.11 |
| 7 | Người bán Tàng Y Các | render3d.js:234-236; wardrobe-ui.js:23-84 | §05.12 |
| 8 | Vị Thái Tuế năm nay | world.js:73/94-97; vanmenh-ui.js:96-130 | §05.13 |
| 9 | Vận Mệnh Các (bia + 9 cổng) | world.js:76-93; vanmenh-ui.js:55-93 | §05.14 |
| 10 | La Bàn Đài | world.js:22; court.js:43 | §05.16 |
| 11 | Bảng Lịch Ngày | world.js:25; court.js:46 | §05.16 |
| 12 | Khách hỏi việc — khe an0 | court.js:47; stations.js:655-665 | §05.17 |
| 13 | Khách hỏi việc — khe an1 | court.js:48 | §05.17 |
| 14 | Khách hỏi việc — khe an2 | court.js:49 | §05.17 |
| 15 | Cặp Hợp Hôn (án chung) | halls.js:144-176; stations.js:707 | §05.17 |
| 16 | Khách Sảnh Điều Hậu | halls.js:51-90; stations.js:705 | §05.17 |
| 17 | Khách Sảnh Tử Vi | halls.js:182-205; stations.js:708 | §05.17 |
| 18 | Khách Sảnh Tượng Pháp | halls.js:210-233; stations.js:709 | §05.17 |
| 19 | Khách Sảnh Cách Cục | halls.js:241-265; stations.js:710 | §05.17 |

Tất cả con số hàng trong bảng trên đều đọc trực tiếp từ code khi viết mục này; không có hàng nào lấy từ trí nhớ.

---

## 05.1 Quy tắc mới của mục 05: nhãn «chờ mở khóa (22 file — mục 15)» và ranh giới G1/G2

Danh sách 22 file khóa đầy đủ nằm ở **mục 15**; sáu file nêu đích danh trong đặc tả đợt này đều thuộc danh
sách đó: `render3d.js`, `stations.js`, `world.js`, `vanmenh-ui.js`, `thaitue.js`, `master-ui.js`. Quy tắc
áp dụng xuyên suốt mục 05:

- **Mọi điểm cắm nằm ở file khóa** (kể cả điểm cắm bark, điểm cắm tên, điểm cắm nhãn) phải mang nhãn
  **«chờ mở khóa (22 file — mục 15)»** ngay cạnh trích dẫn. Cột «file khóa?» trong bảng §05.2 dùng dấu ✅
  kèm nhãn này.
- Hệ quả thực hành: **bark các trạm** (bark phải phát ra từ UI mở trạm trong stations.js, nhãn must từ
  world.js, hành vi nhân vật từ render3d.js) là **việc G2** — chỉ làm sau khi mở khóa. Không ai được viết
  bark «đã cắm» vào bản code hiện hành.
- Việc **G1** làm được ngay hôm nay: dựng module bark thuần (khuôn `gu-gongan.js` / `namhan.js` /
  `kinh-tu.js`, test Node theo `scripts/test-game-thay-mo-rong.mjs`), viết pool BARK-*, viết bảng giọng,
  viết danh xưng chuẩn — tất cả chỉ là dữ liệu + hàm chọn, không đụng file khóa.
- Các file **không** được nêu trong danh sách khóa mà mục này đụng tới: `que-ui.js`, `names.js`,
  `features.js`, `wardrobe-ui.js`, `court.js`, `halls.js`. Với những file này bản 05 không tự tuyên «mở» —
  cột bảng ghi «chưa thấy trong 6 file nêu tên; xác nhận trọn danh sách 22 file ở mục 15 trước khi cắm».
  Đây là ranh giới trung thực, không phải giấy phép trắng tay.

---

## 05.2 Bảng nhóm nâng cấp 19 thực thể (mẫu bắt buộc)

Cột theo đúng khuôn yêu cầu: nhóm | điểm cắm file:line | file khóa? | nâng cấp | AI? | chuẩn tối thiểu áp?

| Nhóm thực thể | Điểm cắm (file:line, đọc thật) | File khóa? | Nâng cấp | AI? | Chuẩn tối thiểu áp? |
|---|---|---|---|---|---|
| Thầy vô danh | stations.js:146, :103, :114, :119, :127-130, :150; master-ui.js:32, :57, :80-86, :95; render3d.js:205-210, :683-685; court.js:76 | ✅ chờ mở khóa (22 file — mục 15) cho cả ba file; court.js chưa thấy trong 6 file nêu tên | Đặt tên Thầy Tử Bình theo hồ sơ 19; lịch 12 giờ; thiện cảm; bark ngoài giờ | Có (đã có: askAI qua master-ui.js:65) | Không (đã có hồ sơ — theo mục 04) |
| Thầy Giải Quẻ | que-ui.js:130, :177, :180, :181, :185, :191-193, :270; stations.js:718-725; world.js:85 | que-ui.js chưa thấy trong 6 file nêu tên; stations.js/world.js ✅ chờ mở khóa (22 file — mục 15) | 1-2 bark dẫn vào mỗi phép trong 5 phép + danh xưng ổn định — mở rộng từ cái đã có, KHÔNG dựng từ số 0 | Không (bark tĩnh); nút «🎙 Nhờ Thầy luận thêm» que-ui.js:192 giữ nguyên vai AI của Thầy AI | ĐẦY ĐỦ (4 điều §05.9) |
| Ống Xăm — Hoàng Đại Tiên | stations.js:291, :301-303, :343, :356, :368, :373, :295-394 | ✅ chờ mở khóa (22 file — mục 15) | Bark chào + mở thẻ pool BARK-xam; giữ nguyên mọi luật keo 3 lần | Không (bark tĩnh) | ĐẦY ĐỦ |
| Lư Hương | names.js:10-25; stations.js:399-434, :408; features.js:26 | stations.js ✅ chờ mở khóa (22 file — mục 15); names.js/features.js chưa thấy trong 6 file nêu tên | Gắn Vân Cốc chủ giọng (mục 17); pool bark theo ngày kề CALM_LINES | Không (bark tĩnh) | Một phần: (a)+(c)+(d); bảng giọng đã có sẵn 14 câu thật |
| Trà Thất | stations.js:501-558, :506, :507, :531, :548; state.js:24-29 | ✅ chờ mở khóa (22 file — mục 15) cho stations.js; state.js thuộc nhóm khóa cũ | Bark người rót vô hình giới thiệu 4 loại trà S.TEAS | Không (bark tĩnh) | Một phần: (a)+(c)+(d) |
| Hồ Sen | stations.js:563-584, :568, :571-572, :581; render3d.js:728-732 | ✅ chờ mở khóa (22 file — mục 15) | Bark đèn + luật riêng tư giữ nguyên; KHÔNG hứa đèn chung MMO trong bark | Không (bark tĩnh) | Một phần: (a)+(c)+(d) |
| Người bán Tàng Y Các | render3d.js:234-236, :682; wardrobe-ui.js:22, :84; court.js:59 | render3d.js ✅ chờ mở khóa (22 file — mục 15); wardrobe-ui.js chưa thấy trong 6 file nêu tên | Đặt tên Bà Tư (mục 34) + 2-3 câu mời hàng không bán hàng + bark theo món vừa mua | Không (bark tĩnh) | Một phần: (a)+(c)+(d) — hồ sơ đầy đủ ở mục 34 |
| Vị Thái Tuế năm nay | world.js:73, :94-97; stations.js:734; vanmenh-ui.js:103, :105, :116, :127; thaitue.js:8, :11 | ✅ chờ mở khóa (22 file — mục 15) cho world.js/stations.js/vanmenh-ui.js; thaitue.js chưa thấy trong 6 file nêu tên | Bark tuyên tên tướng quân theo hoa giáp (TAISUI_60) — tĩnh | Không (bark tĩnh); nút hỏi Thầy vanmenh-ui.js:127 giữ nguyên | ĐẦY ĐỦ (nếu chưa thăng hồ sơ riêng) |
| Vận Mệnh Các | world.js:76-77, :86-93; stations.js:728-737; vanmenh-ui.js:44, :61, :69, :90 | ✅ chờ mở khóa (22 file — mục 15) | Bark bia 1 câu + 1 câu kể tuổi theo cổng đang đi; KHÔNG AI luận tại cổng | Không (bark tĩnh tại cổng); Thầy AI chỉ mở qua nút vanmenh-ui.js:47-49 | Một phần: (a)+(c)+(d) |
| La Bàn Đài | world.js:22; features.js:11; court.js:8, :43 | world.js ✅ chờ mở khóa (22 file — mục 15); court.js/features.js chưa thấy trong 6 file nêu tên | Bark hướng 1-2 câu, tĩnh | Không (bark tĩnh — không AI) | ĐẦY ĐỦ |
| Bảng Lịch Ngày | world.js:25; features.js:11; court.js:8, :46 | world.js ✅ chờ mở khóa (22 file — mục 15) | Bark mốc hôm nay 1-2 câu, tĩnh | Không (bark tĩnh — không AI) | ĐẦY ĐỦ |
| Khách procedural (an0-an2, 4 sảnh, hợp hôn) | stations.js:655-665, :673, :685-686, :704-710, :693; halls.js:144-176; court.js:47-49; render3d.js:239-248 | stations.js/render3d.js ✅ chờ mở khóa (22 file — mục 15) | Tóm lược trỏ mục 08 — bộ khách, hạt giống, cảm ơn theo điểm đã có | Có (mỗi khách mang lá số thật, hỏi Thầy AI như hiện nay) | Không (đã có thiết kế riêng ở mục 08) |
| Tượng thần 4 điện | world.js:62-74; interior.js:79 | world.js ✅ chờ mở khóa (22 file — mục 15); interior.js chưa thấy trong 6 file nêu tên | Bark ngợi 1 câu khi thắp nhang — tĩnh, riêng từng điện | Không (bark tĩnh — không AI, lý do tín ngưỡng) | Một phần: (a)+(c)+(d) |

Bảng này là bản đồ duy nhất của mục 05; không mục con nào lặp lại nó toàn phần.

---

## 05.3 Khuôn kỹ thuật barkPool — pseudo-code dán được (việc G1)

Module thuần, không DOM, không import file khóa — dán thẳng thành `src/game/bark-pool.js`, test Node theo
khuôn `scripts/test-game-thay-mo-rong.mjs`:

```js
// src/game/bark-pool.js — pool bark tĩnh cho NPC «có tên không hồ sơ» (mục 05).
// Thuần JS, không DOM. Bark ≤ 90 ký tự (luật 06-18 §6). Mỗi pool 4–6 câu.
// KHÔNG đọc state, KHÔNG gọi mạng: cùng ngày + cùng trạm → cùng bark, mai tự đổi.
const POOLS = {
  xam: [ /* BARK-xam — Ống Xăm (Hoàng Đại Tiên) */
    '{{bark_xam_1}}', '{{bark_xam_2}}', '{{bark_xam_3}}',
    '{{bark_xam_4}}', '{{bark_xam_5}}',
  ],
  que_maihoa: ['{{bark_que_maihoa_1}}', '{{bark_que_maihoa_2}}'],
  que_liuhao: ['{{bark_que_liuhao_1}}', '{{bark_que_liuhao_2}}'],
  que_xlr:    ['{{bark_que_xlr_1}}', '{{bark_que_xlr_2}}'],
  que_jk:     ['{{bark_que_jk_1}}', '{{bark_que_jk_2}}'],
  que_xam:    ['{{bark_que_xam_1}}', '{{bark_que_xam_2}}'],
  huong:  ['{{bark_huong_1}}', '{{bark_huong_2}}', '{{bark_huong_3}}', '{{bark_huong_4}}'],
  tra:    ['{{bark_tra_1}}', '{{bark_tra_2}}', '{{bark_tra_3}}', '{{bark_tra_4}}'],
  sen:    ['{{bark_sen_1}}', '{{bark_sen_2}}', '{{bark_sen_3}}'],
  la_ban: ['{{bark_la_ban_1}}', '{{bark_la_ban_2}}'],
  lich:   ['{{bark_lich_1}}', '{{bark_lich_2}}'],
  thaitue:   ['{{bark_thaitue_1}}', '{{bark_thaitue_2}}'],
  vanbia:    ['{{bark_vanbia_1}}', '{{bark_vanbia_2}}'],
  tangy:     ['{{bark_tangy_1}}', '{{bark_tangy_2}}', '{{bark_tangy_3}}'],
  nhang_tamthanh: ['{{bark_nhang_tamthanh_1}}'],
  nhang_vanxuong: ['{{bark_nhang_vanxuong_1}}'],
  nhang_daumau:   ['{{bark_nhang_daumau_1}}'],
  nhang_laoquan:  ['{{bark_nhang_laoquan_1}}'],
};

// Múi chọn: dayKey giống hạt giống khách hiện hành (`${todayStr}:${pid}` — stations.js:673),
// chỉ dùng làm MÚI CHỌN chỉ số, không ghi vào state, không rời máy người chơi.
export function barkPool(poolKey, dayKey = '') {
  const pool = POOLS[poolKey];
  if (!pool || pool.length === 0) return null; // không có pool → trạm câm như hiện nay, KHÔNG bịa giọng
  let seed = 7;
  for (const ch of String(poolKey + '|' + dayKey)) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  return pool[seed % pool.length];
}
```

Luật dùng: mọi pool `BARK-*` khai báo trong `POOLS` phải có đủ 4–6 câu cho nhóm «đầy đủ chuẩn» và ít nhất
1 câu cho nhóm «một phần»; câu nào rỗng thì module trả `null` — trạm câm như hôm nay, không sinh thoại
ảo. Cắm vào UI là việc G2 với các trạm trong stations.js (file khóa).

---

## 05.4 §1 — Thầy vô danh (→ Thầy Tử Bình, hồ sơ 19)

Nhân vật chính của game **đã có thật, đang vô danh**: `openThay` tại stations.js:146 («chờ mở khóa (22
file — mục 15)») mở bàn thầy trên tầng 2; khung thẻ lá số in sẵn dòng «Thầy đang mài mực, lập lá số…»
(stations.js:103) và dòng cảnh báo giờ thiếu «Không rõ giờ sinh → thầy tạm lấy giờ Ngọ; trụ Giờ chỉ để
tham khảo.» (stations.js:114). Câu chào duy nhất của thầy là câu dẫn của UI: «Thầy đặt bút xuống, ngẩng
lên: «Khách muốn xem cho ai?»» (stations.js:150). Nút «🎙 Hỏi Thầy về lá số này» render ở stations.js:119
với điều kiện `FEATURES.ai` (features.js:20 — `ai: !IOS`, iOS tắt hẳn), click thì nạp lười case-ui và gọi
`openMaster` kèm 4 câu starters (stations.js:127-130).

Khung thoại thật nằm ở master-ui.js:32 («chờ mở khóa (22 file — mục 15)») — `masterChatBody`: trạng thái
chờ in «Thầy đang xem lá số…» (master-ui.js:57), token stream gộp theo rAF (master-ui.js:69-72), tự chấm
Neo mỗi câu trả lời (master-ui.js:80-86), lỗi mạng in «Thầy đang bận, lát hỏi lại nhé.» (master-ui.js:95).
Hình 3D của thầy: bệ có mái đặt theo `DAIS` court.js:57-61, nhân vật `createCharacter('master')` ngồi ở
render3d.js:205-210 («chờ mở khóa (22 file — mục 15)»), hành vi viết–ngẩng nhìn–cúi chào một lần tại
render3d.js:683-689 («chờ mở khóa (22 file — mục 15)»); footprint của bàn thầy khai ở court.js:76 (file
này chưa thấy trong 6 file nêu tên của mục 15).

**Bốn gap chốt (đúng như đặc tả):** (1) chưa có tên — docs 06-04 định gọi «Thầy Tử Bình», code hôm nay
chỉ gọi «Thầy»; (2) chưa có lịch 12 giờ của thầy (đang dạy ai, bận việc gì, hôm nay vui hay mệt) để bark
ngoài giờ có căn; (3) chưa có thiện cảm (thân quen/quen/mới) làm giọng mở bài đổi theo; (4) chưa có bark
ngoài giờ — khách đi ngang mà thầy im lặng tuyệt đối, duy nhất hành động cúi chào một lần trong
render3d.js:683.

**Nâng cấp G2 (chờ mở khóa):** đặt tên «Thầy Tử Bình» tại nhãn stations `world.js:20` («Bàn Thầy Tử
Bình» — tên trạm ĐÃ có chữ Tử Bình, còn nhân vật chưa nhận tên) và trong `masterChatBody` đổi nhãn
`<span>Thầy</span>` thành `<span>Thầy Tử Bình</span>`; bark ngoài giờ pool `BARK-thay` 4 câu giọng hồ sơ
19 («Con ngồi đi…» / «Đó là xu hướng, không phải bản án.»); lịch 12 giờ + thiện cảm là bảng dữ liệu
module thuần G1, chỉ cắm sau mở khóa. Không đụng `ai.js` trong đợt này — chuỗi AI (temp 0.55, rule-10
chính tả, Neo-check) giữ nguyên như đang chạy.

---

## 05.5 §2 — Thầy Giải Quẻ: SỬA HIỆN TRẠNG — thầy ĐÃ CÓ thoại riêng nguyên câu

Bản thiết kế trước ghi sai «Thầy Giải Quẻ KHÔNG có thoại riêng — mọi chữ là kết quả engine». **Sửa lại
ngay tại đây:** thầy CÓ thoại riêng nguyên một câu, bọc bằng dấu ngoặc kép trong code, mở mỗi lượt gieo
quẻ:

> «Thầy vuốt râu: «Tâm thành thì quẻ linh. Hỏi việc gì, cứ nói.»» — que-ui.js:180 (trích nguyên bản, giữ
> đúng ký tự ngoặc kép của code; dòng 181 ngay dưới nó là dòng render các tab, không phải thoại).

Ngoài câu mở, thầy còn hiện diện bằng giọng người dẫn trong ba chỗ đã có thật: nút
«🎙 Nhờ Thầy luận thêm theo lá số» (que-ui.js:191-193 — điều kiện `FEATURES.ai && R` tại :191, chữ nút
tại :192, click nạp lười case-ui › openMaster tại :193); dòng thoại «Thầy đọc lại «phán» cho án trên:»
khi kết bài tập vạch mặt án cổ (que-ui.js:130); và dòng tổng kết năm hạn «Năm hạn của bạn: … 5 năm tới có
{n} năm thuận.» (que-ui.js:270). Câu chốt vệ sinh ở cuối panel «Quẻ để tham khảo, chiêm nghiệm — quyết
định là ở bạn.» (que-ui.js:185) cũng là giọng của thầy. Danh xưng trạm «Thầy Giải Quẻ» + động từ «Xin thầy
gieo quẻ» đã có sẵn trong world.js:85 («chờ mở khóa (22 file — mục 15)» — đây là nhãn trạm, không phải
thoại).

**NÂNG CẤP = MỞ RỘNG TỪ ĐÃ CÓ, KHÔNG phải dựng từ số 0:** chỉ thêm 1–2 bark dẫn vào mỗi phép trong 5
phép hiện có (TABS que-ui.js:177 — Mai Hoa · Lục Hào · Lục Nhâm · Kim Khẩu · Xin xăm; điểm mở trạm
`openQue` stations.js:718-725 «chờ mở khóa (22 file — mục 15)») + một danh xưng ổn định trong bark (xưng
«thầy», gọi «khách» — trùng cụm xưng hô chuẩn 06-18 §1). Pool mẫu G1 (mỗi câu ≤90 ký tự, viết theo giọng
câu 180, chưa cắm):

- `BARK-que_maihoa`: «Thời điểm khách hỏi chính là con số — tâm thành thì quẻ linh.» · «Mai Hoa lấy giờ
  và số hôm nay, không cần khách nhớ can chi.»
- `BARK-que_liuhao`: «Lắc quẻ cho đúng tay, hào động nói việc sắp tới.» · «Một việc một quẻ — hỏi lác đác
  thì hào cũng lúng túng.»
- `BARK-que_xlr`: «Việc người, thời gian, phương hướng — Lục Nhâm trả đủ ba.» · «Năm tháng nó hiện ra
  ngay trong bàn, khách đừng đoán hộ.»
- `BARK-que_jk`: «Câu hỏi ngắn, quyết định nhanh — Kim Khẩu lấy lời thật làm mồi.» · «Khách nói thẳng
  việc, quẻ mới thẳng việc.»
- `BARK-que_xam`: «Xăm của Hoàng Đại Tiên, quẻ của thầy đọc.» · «Lên quỳ trước điện, lắc ống tới khi thẻ
  rơi» — câu sau dẫn đúng sang form xin xăm của tab (que-ui.js:283 «Quỳ trước điện, lắc ống xăm cho tới
  khi một thẻ rơi ra.»).

Điều kiện AI giữ nguyên: bark tĩnh KHÔNG thay nút «🎙 Nhờ Thầy luận thêm theo lá số» — nút đó là vai của
Thầy AI, chỉ hiện khi đã lập lá số (que-ui.js:191).

---

## 05.6 §3 — Ống Xăm Hoàng Đại Tiên (stations.js:295-394, «chờ mở khóa (22 file — mục 15)»)

Hoàng Đại Tiên là giọng duy nhất ngoài Thầy có **thẻ danh tính ghi sẵn trong code**: dòng chú giải cuối
mỗi thẻ xăm «Thơ xăm Hoàng Đại Tiên.» (stations.js:291). Thần nói hoàn toàn qua trạng thái keo âm dương:
thẻ rơi «Một thẻ rơi ra: số {N}. Xin keo để hỏi thần có chấp nhận thẻ này không.» (stations.js:343);
chấp thuận «— thần chấp nhận thẻ.» (stations.js:356); từ chối giữa chừng «— thần chưa chấp nhận thẻ này.
Lắc lại nhé (lần {fails}/3).» (stations.js:373); từ chối cả ba lần «Ba lần keo chưa thuận — hôm nay chưa
đủ duyên, mai hãy quay lại.» (stations.js:368); hết lượt trong ngày «Ba lần keo chưa thuận thì mai quay
lại — hôm nay hết lượt xin thẻ rồi.» / «Hôm nay khách đã nhận đủ {N} thẻ. Mai hãy quay lại — quẻ hỏi
nhiều thì lòng càng rối.» (stations.js:301-303). Ghi chú đối chiếu: dữ liệu nền đề bài trích «:356» cho
câu từ chối — đọc lại code thật thì :356 là câu **chấp nhận**, các câu từ chối nằm ở :368/:373; mục này
trích theo code thật.

**Gap:** thần chưa có một lời chào hay lời mở thẻ mang tính nhân vật — người chơi vào trạm gặp thẳng nút
«🎋 Bấm giữ để lắc» (stations.js:313) không một câu chào; thơ xăm là chữ của engine ghi lại, không phải
lời thần thốt.

**Nâng cấp:** pool `BARK-xam` 4–6 câu (chuẩn §05.9 đủ 4 điều), giọng cao cao tại tại nhưng không doạ,
mỗi câu ≤90 ký tự, các câu phải khớp luật keo đã có (không hứa cho keo, không phá trần 3 lần):

1. «Ống xăm rung lên trước mặt khách — Hoàng Đại Tiên đang nghe.»
2. «Giữ một điều muốn hỏi thôi. Quẻ hỏi nhiều thì lòng càng rối.» (kế thừa nguyên cụm stations.js:303)
3. «Lắc đã tay; keo thuận thì thẻ mới về tay khách.»
4. «Keo chối là thần nói thật: hôm nay chưa đủ duyên.» (kế thừa stations.js:368)
5. «Mai quay lại — ống xăm vẫn đứng đây chờ khách.» (kế thừa stations.js:301-302)

Cắm bark vào đầu `openXam` là việc **G2**; pool + bảng giọng là **G1**.

---

## 05.7 §4 — CHUẨN TỐI THIỂU nhóm «CÓ TÊN KHÔNG HỒ SƠ» (quy định mới)

Nhóm gồm: **Hoàng Đại Tiên, Thầy Giải Quẻ, La Bàn Đài, Bảng Lịch Ngày, Thái Tuế** (nếu chưa thăng hồ sơ
riêng). Đây KHÔNG phải «chỉ là trạm phụ» — người chơi gặp chúng mỗi ngày, nên mỗi thực thể thuộc nhóm
**bắt buộc đủ 4 thứ** sau. Khối chuẩn viết nguyên văn MỘT LẦN ở đây, áp cho cả nhóm; các hồ sơ khác
không lặp lại:

> **CHUẨN TỐI THIỂU NHÓM «CÓ TÊN KHÔNG HỒ SƠ» — 4 điều bắt buộc:**
>
> **(a) Danh xưng chuẩn 1 câu** — một câu duy nhất định danh thực thể, dùng thống nhất trong mọi bark, mọi
> nhãn UI, mọi trích dẫn qua lời NPC khác; đổi danh xưng là lỗi nhất quán.
>
> **(b) Bảng giọng ≥5 quy tắc DỰA TRÊN câu thoại thật có trong code** — mỗi quy tắc phải trích được ít nhất
> một file:line mà câu thoại thật nằm đó; quy tắc nào không trích được nguồn trong code thì ghi rõ
> «mới — nguồn từ hồ sơ mục {n}», không được giả làm «đã có».
>
> **(c) Bark pool 4–6 câu, mỗi câu ≤90 ký tự, đặt trong không gian tên `BARK-*`** — pool sống trong module
> thuần `bark-pool.js` (§05.3), cùng ngày cùng trạm ra cùng câu; không bark doạ, không bark chê lá số người
> chơi, không bark hứa thưởng (bộ lọc V1/V4).
>
> **(d) Luật AI: KHÔNG AI (bark tĩnh) trừ khi nêu rõ lý do** — nhóm này không được tự gọi AI; nếu một thực
> thể nào cần AI thì phải ghi lý do + điểm cắm nút AI sẵn có; nếu sau này thăng hồ sơ riêng thì dựng theo
> nguyên khung hồ sơ của mục 04 (PERSONA + bộ lọc + Neo-check), không nâng cấp nửa vời.

### Bảng giọng ≥5 quy tắc cho từng thực thể nhóm (dựa câu thoại thật trong code)

**Hoàng Đại Tiên (Ống Xăm):**
1. Thần chỉ phát ngôn qua kết quả keo/thẻ — «thần chấp nhận thẻ.» (stations.js:356), «thần chưa chấp nhận
   thẻ này. Lắc lại nhé (lần {fails}/3).» (stations.js:373).
2. Giới hạn là luật thần, không phải UI: ba lần keo (stations.js:368, :373), hết lượt trong ngày
   (stations.js:301-303).
3. Danh tính qua thẻ thơ: «Thơ xăm Hoàng Đại Tiên.» (stations.js:291) — thần không tự xưng trong lời chào,
   chỉ hiện qua thơ thẻ.
4. Không nhận thêm duyên khi keo chối — câu chốt «mai hãy quay lại» (stations.js:368) là câu cuối, không
   bark xin đổi ý.
5. Nhắc khách giữ một điều hỏi: «quẻ hỏi nhiều thì lòng càng rối.» (stations.js:303).

**Thầy Giải Quẻ:**
1. Mở lượt bằng câu đạo quẻ: «Tâm thành thì quẻ linh. Hỏi việc gì, cứ nói.» (que-ui.js:180).
2. Mọi kết quả đều đóng bằng câu khử tất định: «Quẻ để tham khảo, chiêm nghiệm — quyết định là ở bạn.»
   (que-ui.js:185).
3. Thầy đọc phán án cổ, không tự bịa phán: «Thầy đọc lại «phán» cho án trên:» (que-ui.js:130) — chữ phán
   lấy từ `g.fake.verdict` của engine gu-gongan.js.
4. AI chỉ mở khi có lá số: điều kiện `FEATURES.ai && R` (que-ui.js:191) — chưa lập số thì thầy không hứa
   «luận thêm».
5. Tổng kết bằng số thật: «Năm hạn của bạn: … 5 năm tới có {n} năm thuận.» (que-ui.js:270) — số `nThuan`
   đếm từ namhan.js, không đếm vộ.

**La Bàn Đài:**
1. Chỉ đọc hướng, không phán vận: nhãn trạm «Xem la bàn hướng nhà» (world.js:22).
2. Trạm nằm cánh Đông cùng Bảng Lịch: «cánh Đông (La Bàn Đài, Bảng Lịch)» (court.js:8) — bark hai trạm
   không trùng nhau về nội dung.
3. Hướng là thứ đổi được: bark khuyên việc cụ thể (kê giường, đặt bàn), không nói «hướng xấu cả đời».
4. Kim la bàn có hành vi thật — run nhẹ (render3d.js:692, «chờ mở khóa (22 file — mục 15)»): bark mô tả
   phải khớp hành vi này.
5. Tĩnh: hai câu tối đa mỗi lượt, không AI.

**Bảng Lịch Ngày:**
1. Chỉ nói hôm nay: nhãn «Xem lịch hôm nay» (world.js:25).
2. Không chọn thay khách: lịch đọc mốc, quyết định ở người chơi (cùng tinh thần que-ui.js:185).
3. Việc lớn chọn ngày, việc nhỏ khỏi chọn — bark dẫn đúng trọng tâm trạm Trạch Nhật cạnh đó (sảnh
   Trạch Nhật là nơi chuyên chọn ngày, world.js:43).
4. Tĩnh, không AI; không trích thuật ngữ can chi phức tạp ngoài dấu hiệu hôm nay.
5. Cùng cánh Đông với La Bàn Đài (court.js:8) — không bark chồng lên nhau.

**Thái Tuế (nếu chưa thăng hồ sơ):**
1. Tuyên đúng tên tướng quân theo hoa giáp từ TAISUI_60 (thaitue.js:8 nạp từ engine taisui-general.js,
   :11 re-export — ghi chú: dữ liệu nền ghi «thaitue.js:9-10», đọc thật hai dòng đó là dòng import
   taisui.js; dòng TAISUI_60 thật là :8 và :11).
2. Phương vị là dân gian kiêng, không phải lệnh cấm: «Phương Thái Tuế năm nay: … — dân gian kiêng động
   thổ phương này.» (vanmenh-ui.js:105).
3. Đèn là việc làm được: «Đèn an Thái Tuế của bạn đã cháy {n} ngày năm {…}.» / «Bạn chưa thắp đèn an Thái
   Tuế năm nay.» (vanmenh-ui.js:116).
4. Phạm/không phạm để cho UI và Thầy AI: câu hỏi mẫu «Năm {…} ({can chi}) tuổi tôi phạm/không phạm Thái
   Tuế, thầy xem theo lá số tôi nên giữ gìn điều gì?» (vanmenh-ui.js:127) — bark không đoán hộ.
5. Khung «năm có va chạm, không phải bị phạt» (thuật ngữ chuẩn mục 01) — bark tuyên tên + hướng là cùng,
   không tuyên hình phạt.

Áp dụng: **đầy đủ 4 điều** cho cả năm thực thể trên (cột «chuẩn tối thiểu áp?» = ĐẦY ĐỦ trong bảng
§05.2). Hai thực thể La Bàn Đài/Bảng Lịch Ngày hiện đang hoàn toàn câm — chuẩn này là lần đầu chúng có
giọng.

---

## 05.8 §5 — Lư Hương (tên web «Lư Hương», tên iOS «Lò Trầm» — ghi đủ hai tên)

Trạm thắp nhang nói một câu tĩnh tâm mỗi lần đốt. Pool hiện hữu: **CALM_LINES 14 câu** ở names.js:10-25
(đếm thật: 14 chuỗi, từ dòng 11 tới 24), chọn ngẫu nhiên mỗi lần mở tại stations.js:408 («chờ mở khóa
(22 file — mục 15)» cho điểm cắm UI; openHuong bắt đầu stations.js:399, thân hàm tới khoảng :434).
Trạm đổi tên theo bản build: web «Lư Hương — Thắp một tuần nhang» (world.js:24), iOS «Lò Trầm — Đốt một
nén trầm» (features.js:26 trong khối TEXT, kèm features.js:31 cho bản web). Lời thoại thật mẫu đã có:
«Hít vào thật chậm. Không có việc gì phải vội trong lúc nhang cháy.», «Một nén nhang — ba phút không
nhìn điện thoại.», «Biết đủ là giàu.», «Mệnh do trời định một phần, phần còn lại do mình đi.»
(names.js:10-25).

**Gap:** pool chung, không theo ngày, và quan trọng hơn — chưa có «giọng của ai»: ai xì hơi câu đó qua
quán? Lư Hương hôm nay là loa không chủ.

**Nâng cấp:** gắn **Vân Cốc chủ giọng** (mục 17) — mỗi câu mới thêm vào pool viết theo bible Vân Cốc
(câu 8–14 chữ, hình ảnh hạt giống/trà/nước, không doạ); pool tĩnh CALM_LINES giữ nguyên làm nền; bark
theo ngày qua `barkPool('huong', dayKey)` (§05.3). Pool mẫu giọng Vân Cốc 4 câu G1:

1. «Con ngồi đi. Nhang cháy hết bảy ngày, con đã đi qua một tuần.»
2. «Hạt nhang tàn hết cũng chưa bằng một hơi thở đủ.»
3. «Việc lớn làm chậm, việc nhỏ làm xong — vậy là một ngày đẹp.»
4. «Con không cần tin mệnh. Con chỉ cần thở đủ ba phút.»

Điều (d) của chuẩn áp một phần: không AI — lý do: câu tĩnh tâm là lời nói đều đặn của trạm, AI chỉ phá
nhịp; nếu sau này cần câu tùy người thì đó là việc của hồ sơ Vân Cốc (mục 17), không phải của Lư Hương.

---

## 05.9 §6 — Trà Thất và Hồ Sen

**Trà Thất** (stations.js:501-558, «chờ mở khóa (22 file — mục 15)»): đã có giọng «người rót vô hình»
— «Khách ngồi xuống bồ đoàn. Ấm nước vừa sôi.» (stations.js:506); chọn trà mở theo Phúc Khí kèm khoá
🔒 (stations.js:507); dẫn thở «Hít vào» / «Giữ hơi» / «Thở ra» (stations.js:548); kết «Chén trà đã
nguội.» / «Khách đứng dậy.» + «Chưa đủ một phút nên chưa tính.» (stations.js:531).
**Sửa một con số của bản trước:** bản trước ghi «6 loại trà S.TEAS» — đọc thật `TEAS` có **4 loại**:
Trà Sen, Trà Lài, Trà Ô Long, Trà Shan Tuyết (state.js:24-29; Trà Sen mở từ 0, ba loại sau khoá theo
Phúc Khí 30/100/250). 4 loại trà này **chưa một câu giới thiệu** — ai rót, rót ra sao, vị gì: trắng
trơn.

**Hồ Sen** (stations.js:563-584, «chờ mở khóa (22 file — mục 15)»): «Ngọn đèn chạm mặt nước, chầm chậm
trôi ra giữa hồ.» (stations.js:581); hôm sau «Đèn hoa đăng của khách hôm nay đang trôi trên hồ.» +
«Mỗi ngày một ngọn đèn. Mai lại thả nhé.» (stations.js:568); điều ước giữ riêng tư «Điều ước chỉ lưu
trên máy của bạn, không gửi đi đâu.» (stations.js:572). Cảnh 3D chỉ thả **đèn của chính khách** — tối
đa 6 đèn lấy từ `S.todayLanterns` (render3d.js:728-732, «chờ mở khóa (22 file — mục 15)»), hồ vì vậy
trông vắng.

**Nâng cấp:** bark người rót vô hình pool `BARK-tra` giới thiệu 4 loại trà đúng thực đơn thật
(state.js:24-29): «Trà sen tĩnh, trà lài dịu, ô long ấm, shan tuyết mát — chọn theo ngày của mình.»;
bark `BARK-sen` giữ luật riêng tư: «Điều ước chỉ thuộc về khách — hồ không đọc, chỉ đưa đi xa.».
**Cấm ghi trong bark:** không hứa «đèn của người khác/MMO» vì chưa có đèn chung (đèn chung là việc MMO
mục 15, chưa code); không nhắc Ngọc/Phúc Khí/khoá 🔒 bằng lời NPC — khoá là chữ UI, người rót không đếm
tiền (PERSONA-CHUNG luật 4). Chưa thấy 6 file nêu tên gồm wardrobe-ui.js/court.js — với Trà Thất điểm
cắm chỉ nằm stations.js nên toàn bộ là G2.

---

## 05.10 §7 — Tàng Y Các: người bán câm (chỗ của Bà Tư, mục 34)

Nhân vật **câm hoàn toàn nhưng có hành vi thật**: tạo `createCharacter('npc_merchant')` đứng quầy tại
render3d.js:234-236 («chờ mở khóa (22 file — mục 15)») với chú thích ngay trong code «người bán ở quầy
Tàng Y Các — cúi chào khi khách lại gần», hành vi cúi chào một lần rồi reset chạy ở render3d.js:682
(`tailor.play('bow')` khi khách đứng cạnh trạm `tangy`). Bảng mua-bán là UI wardrobe-ui.js (mở từ
stations.js:736 «chờ mở khóa (22 file — mục 15)»): giá hiển thị 💎 Ngọc / ✦ Phúc Khí qua `priceTxt`
(wardrobe-ui.js:22 — file chưa thấy trong 6 file nêu tên), và câu hiệu ứng bộ đã render sẵn: «Mặc đủ 4
món một bộ → hiệu ứng bộ. Bộ trùng Dụng thần của bạn (…) được **Hợp mệnh**: +10% Phúc Khí khi giải án
và ở sảnh nghề.» (wardrobe-ui.js:84). Quầy đặt tại `TANGY` court.js:58-59, nhãn trạm «Tàng Y Các»
world.js:27.

**Nâng cấp:** đây là chỗ ngồi hoàn hảo của **Bà Tư thợ may** (mục 34 — «đứng cạnh giá tiền») — chỉ cần
đặt tên + 2–3 câu mời hàng **không bán hàng** (không giục mua, không nhắc giá bằng lời, không nói áo đổi
mệnh), cộng bark theo món vừa mua dùng biến `{{ten_mon}}`. Pool mẫu G1 (đối chiếu wardrobe-ui.js:84 để
bark không mâu thuẫn chữ Hợp mệnh đã hiển thị):

1. «Áo hợp Dụng thần thì mặc dễ chịu, như ăn món hợp miệng.»
2. «Con thử trước 20 giây rồi hẵng thỉnh — bà không giục ai.» (kế thừa nút «Thử 20s» wardrobe-ui.js:68)
3. «Bộ Hợp mệnh là bộ trùng Dụng thần của con, bảng bên ghi rồi.» (đối chiếu wardrobe-ui.js:84)
4. «Đã thỉnh «{{ten_mon}}» — mặc lên nhìn cả người đổi màu theo bộ.» (bark sau mua, khớp toast thật
   wardrobe-ui.js:76)

AI: không — lý do: người bán chỉ việc nghề; khi Bà Tư thăng hồ sơ đầy đủ ở mục 34 thì theo khung mục 04.

---

## 05.11 §8 — Thái Tuế: bark tuyên tên tướng quân theo hoa giáp

Trạm «Bàn Lễ Thái Tuế» trong Thái Tuế Điện (world.js:73 khai phòng; world.js:94-97 khai trạm — «chờ mở
khóa (22 file — mục 15)»; điểm nạp body `VAN_OPEN.thaitue` stations.js:734 — «chờ mở khóa (22 file —
mục 15)»). Bảng giọng thật đã có: dòng tiêu đề in tên tướng «Năm {…} · vị thứ {n}/60 · {T.name}»
(vanmenh-ui.js:103), phương kiêng «dân gian kiêng động thổ phương này» (vanmenh-ui.js:105), đèn
(vanmenh-ui.js:116), nút hỏi Thầy AI (vanmenh-ui.js:127). Dữ liệu 60 tướng quân nằm ở `TAISUI_60`
(thaitue.js:8/:11 — như ghi chú §05.7).

**Nâng cấp:** bark tuyên tên tướng quân khi khách vào bàn lễ — tĩnh, đọc từ `taiOf` (đã render
vanmenh-ui.js:103/:105), KHÔNG đoán phạm/không phạm (việc đó là của bảng UI và Thầy AI qua nút :127).
Mẫu `BARK-thaitue` (biến dán được):

```js
// bark tuyên — dữ liệu lấy từ taiOf(state, now): T.name, T.direction, T.ganZhi
const tenTuong = '{{ten_tuong_quan}}';     // vd: theo TAISUI_60 của năm đang trị
const ganZhi   = '{{nam_can_chi}}';        // vd: Bính Ngọ
const huong    = '{{huong_thai_tue}}';     // vd: Tây Bắc
const bark = `Năm ${ganZhi} — Thái Tuế của năm là ${tenTuong}, cai phương ${huong}.`;
```

Câu thứ hai của pool gắn đúng luật dân gian: «Làm nhà làm nền năm nay, tránh phương {huong} — đó là kiêng
dân gian, không phải lệnh cấm.» Câu nào phải ≤90 ký tự: khi {huong} dài thì tách hai câu, không gộp.

---

## 05.12 §9 — Vận Mệnh Các: bark bia + 1 câu kể tuổi, KHÔNG AI tại cổng

Hành lang đại vận: bia tại `VAN_STELE` (world.js:76-77), 9 cổng dọc lối giữa theo `VAN_GATE_Z` (world.js:76),
toàn bộ trạm render từ world.js:86-93 («chờ mở khóa (22 file — mục 15)»), bảng nạp `openVan`/`VAN_OPEN`
stations.js:728-737 («chờ mở khóa (22 file — mục 15)»). Giọng thật: khi chưa nhập bát tự — «Thầy chưa có
bát tự của bạn. Ra cổng quán chọn «Sửa bát tự» để khắc tên tuổi, rồi quay lại.» (vanmenh-ui.js:44); nút
hỏi Thầy AI ở bia «Thầy xem quỹ tích đời tôi: đang ở đại vận {ganZhi}, nên chú ý gì cho mười năm này?»
(vanmenh-ui.js:69) và ở cổng «Thầy luận kỹ đại vận {ganZhi} ({ages}) của tôi: nên làm gì, tránh gì?»
(vanmenh-ui.js:90); bia khắc «Bia khắc quỹ tích đời của {tên} — mỗi cổng phía trước là một đại vận mười
năm.» (vanmenh-ui.js:61).

**Nâng cấp:** bark bia 1 câu + 1 câu kể tuổi theo cổng đang đi — dữ liệu đã có (`V.current`, `g.ages`,
vanmenh-ui.js:58/:82): «Cổng này là thập kỷ {{do_tuoi}} của khách — mười năm trước mắt, ai cũng có cổng
như vậy.» **Không AI luận tại cổng:** bark cổng chỉ đọc dữ liệu + chỉ tay về nút «🎙 Hỏi Thầy thêm»
(vanmenh-ui.js:47-49) — luận mười năm là việc của Thầy ở Bàn Thầy, cổng không thay mặt. Tương tự không
bark «Đỉnh vận/Cần dè chừng» như lời kể — các nhãn đó là chữ dữ liệu UI, bark giữ tầng «xu hướng, không
phải bản án».

---

## 05.13 §10 — Tượng thần 4 điện: bark ngợi khi thắp nhang — tĩnh

Bốn điện có tượng: Chính Điện Tam Thanh (3 tượng deity_lingbao/deity_yuanshi/deity_daode — world.js:63-64),
Văn Xương Các (deity_wenchang — world.js:65), Đẩu Mẫu Điện (deity_doumu — world.js:66), Lão Quân Điện
(deity_daode — world.js:67); tượng GLB Meshy ngồi bàn thờ ba cấp quay ra cửa (interior.js:79 — file chưa
thấy trong 6 file nêu tên; comment nguyên văn «tượng thần (GLB Meshy) ngồi trên bàn thờ, quay ra cửa»).
Tượng hôm nay **câm đúng** — nhưng khi người chơi thắp nhang (trạm Lư Hương, world.js:24) thì cả gian
cũng lặng.

**Nâng cấp:** bark ngợi 1 câu theo điện khi nhang cháy — tĩnh tuyệt đối, **không AI**; lý do nêu rõ (điều
d) : tượng thờ là vật thiêng, nhân cách hoá bằng AI chạy chưa qua tham vấn tôn giáo là rủi ro bị cấm theo
luật nền (trước khi bật AI cho NPC tín ngưỡng phải có biên bản tham vấn — README §6). Pool 4 câu mẫu:

1. Tam Thanh: «Nhang khách thắp, Tam Thanh lặng lẽ chứng — lòng thành là lễ đủ.»
2. Văn Xương: «Trước Văn Xương, nguyện nhỏ mà chắc: học hết bài hôm nay.»
3. Đẩu Mẫu: «Đẩu Mẫu chứng sao Bắc Đẩu — đêm nay ngủ sớm một giờ là lễ thật.»
4. Lão Quân: «Lão Quân chứng lửa lò — việc đang làm, làm cho ra ngọn.»

Mỗi câu ≤90 ký tự; bark chỉ phát khi `incenseState` đang cháy (điều kiện đã có trong render3d.js:700-702,
«chờ mở khóa (22 file — mục 15)»), không lặp lại khi nhang tắt.

---

## 05.14 §11 — La Bàn Đài + Bảng Lịch Ngày: xác nhận trạm tương tác, bark tĩnh

Hai trạm đã là **trạm tương tác thật, không phải prop**: khai tên trong `ALL` của features.js:11 (danh
sách gồm 'compass' và 'lich'), mở được từ sân theo STATION_OPEN (stations.js:739), có vị trí cánh Đông
theo sơ đồ sân «cánh Đông (La Bàn Đài, Bảng Lịch)» (court.js:8), có nhãn riêng world.js:22 «Xem la bàn
hướng nhà» và world.js:25 «Xem lịch hôm nay»; khối đặt quầy court.js:43 (compass) và court.js:46 (lich).
Kim la bàn có hành vi run nhẹ (render3d.js:692) và bảng lịch vẽ canvas thật (`TX.calendarCanvas`,
render3d.js:218-219 — «chờ mở khóa (22 file — mục 15)» cho hai dòng render này).

**Nâng cấp:** bark hướng dùng 1–2 câu, tĩnh, không AI — nhóm này áp chuẩn §05.9 đủ 4 điều (đây là hai
thực thể câm hoàn toàn hiện nay, chuẩn tối thiểu là lần đầu cho chúng tiếng). Pool `BARK-la_ban`:
«Quay kim cho đúng nhà mình — hướng hợp hiện lên ngay trước mắt.» · «Hướng là thứ đổi được: kê giường,
đặt bàn — chọn hướng trước, việc sau.» Pool `BARK-lich`: «Hôm nay khắc sẵn trên bảng — việc lớn chọn
ngày, việc nhỏ khỏi chọn.» · «Lịch chỉ nói thời tiết thời gian; quyết định vẫn ở khách.» Cấm: bark
không trích can chi rối; không nói «hướng xấu» tuyệt đối (thuật ngữ chuẩn: hướng là điều chỉnh, không
phải bản án).

---

## 05.15 §12 — Khách procedural + cặp hợp hôn: tóm lược trỏ mục 08

Chi tiết đầy đủ của bộ khách mỗi ngày (11 khách: 3 khe sân an0-an2, 4 khách sảnh nghề 1-người, cặp hợp
hôn, khách Trạch Nhật, khách Dương Trạch) nằm ở **mục 08** — mục này chỉ tóm lược để bản đồ 19 thực thể
không thiếu hàng:

- Khách sinh từ hạt giống `{{day_key}} = ${todayStr}:${pid}` (stations.js:673 — «chờ mở khóa (22 file —
  mục 15)») qua `makeNpc` (npc.js:41), có danh xưng theo tuổi và lá số thật; 3 khe sân đặt tại court.js:47-49,
  hình 3D dấu ❓ vàng xoay tại render3d.js:239-248 («chờ mở khóa (22 file — mục 15)»), mở án qua
  `openCaseSlot` stations.js:655-665.
- Hợp hôn là án chung theo ngày (shared key bỏ pid — stations.js:693, openHall 'hophon' stations.js:707;
  halls.js:144-176), cảm ơn riêng «Hai đứa về sẽ nói chuyện với nhau kỹ hơn.» (case-ui.js:472).
- Cảm ơn chung 3 mức của khách sân tại case-ui.js:236.
- Nâng cấp thuộc mục 08 quản lý: hoàn cảnh riêng cho khách, bộ nhớ liên ngày, biến thể theo `hh.rating`
  của hợp hôn; mục 05 KHÔNG trích thêm chi tiết để tránh hai bản lệch nhau.

---

## 05.16 Kiểm soát cuối mục 05 — những điều bản này không hứa

1. **Không hứa bark đã cắm.** Mọi bark trong mục 05 là thiết kế pool (G1) + điểm cắm (G2 chờ mở khóa,
   mục 15); không dòng nào tuyên «đang chạy».
2. **Không sửa engine.** Chuỗi AI (ai.js temp 0.55, rule-10 chính tả tiếng Việt, Neo-check,
   suggestFollowups) và mọi luật keo/thẻ của trạm giữ nguyên; bark tĩnh không ghi `deskLog`, không thêm
   trạm mới.
3. **Không nhân cách hoá vượt chuẩn.** Nhóm «có tên không hồ sơ» có tiếng bằng bark tĩnh đúng 4 điều;
   thăng hồ sơ là việc riêng theo mục 04.
4. **Số liệu đã đối chiếu lại với code và sửa ba chỗ lệch của bản trước:** (i) Thầy Giải Quẻ CÓ thoại
   riêng que-ui.js:180; (ii) S.TEAS là 4 loại trà (state.js:24-29) chứ không phải 6; (iii) trích keo từ
   chối nằm ở stations.js:368/:373 (dòng :356 là câu chấp nhận) và TAISUI_60 nằm ở thaitue.js:8/:11
   (không phải :9-10).
5. Mỗi câu trích dẫn que-ui.js:180/130 giữ nguyên bản đúng ký tự, kể cả dấu ngoặc kép « » bao câu thoại
   trong code.

Bản ghi này là bản chốt của mục 05; mọi chỉnh sửa sau này về bark trạm phải đối chiếu lại bảng §05.2 và
chuẩn §05.7 trước khi sửa.
