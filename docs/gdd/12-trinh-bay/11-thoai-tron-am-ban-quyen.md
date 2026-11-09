# 12 · Trình bày — Phần 11: Lồng tiếng, trộn âm, độ to, bản quyền âm thanh

> Kế hoạch lồng tiếng (VO), cấu trúc trộn âm (bus, nén nhường, giới hạn số tiếng, không gian 3D, vang), chỉ tiêu độ to, cách triển khai trên WebAudio thay cho `audio.js` hiện tại, và quy tắc bản quyền cho nhạc, tiếng, giọng.

---

## 1. Lồng tiếng (VO)

### 1.1 Nguyên tắc

1. **Ngôn ngữ: tiếng Việt.** Mọi NPC nói tiếng Việt, kể cả ở thánh địa nguyên mẫu Trung Hoa / Tạng — thế giới Huyền Giới là hư cấu, người chơi chính là người Việt. **Không** dùng giọng «lơ lớ» giả người Hoa / người Tạng / người Miêu (tránh biếm họa dân tộc — tài liệu 14).
2. Chữ Hán trong thoại đọc **âm Hán Việt** («Thất Sát», «Thiên Ất Quý Nhân»).
3. Câu Phật hiệu, đạo hiệu công cộng đọc âm Hán Việt (vd «Nam mô A Di Đà Phật», «Vô Lượng Thiên Tôn» — câu chào của đạo sĩ). **Không** đọc chú, thần chú (canon §5.4, §5.5).
4. Nhân vật người chơi **không có thoại thành lời** (để người chơi tự là mình); chỉ có tiếng thân thể (`SFX-BODY-*`): thở, chào, lạy.
5. Thoại AI (UI-41) **không lồng tiếng mặc định.** Tùy chọn «Đọc to câu trả lời» dùng giọng máy của hệ điều hành (Web Speech API, giọng `vi-VN`), gắn nhãn «Giọng máy đọc» — để rõ đây không phải diễn viên và không phải NPC «thật sự» nói (phù hợp tinh thần minh bạch của Neo).
6. Không giọng nào được dùng để huấn luyện / nhân bản bằng AI khi chưa có hợp đồng riêng với diễn viên (§6.4).

### 1.2 Phân hạng lồng tiếng

| Hạng | Phạm vi | Ai |
|---|---|---|
| **A — đầy đủ** | mọi câu thoại kịch bản cốt truyện + câu bong bóng (`BARK-*`) | Thầy Tử Bình, Vân Cốc thiền sư, Khổng tiên sinh, Yểm sư Lỗ Ban, Lão Tùng (người gác cổng — dẫn nhập môn) |
| **B — cảnh then chốt** | câu mở và kết mỗi cảnh, câu ở nghi thức (UI-33), 20–40 bong bóng | Trương Thiên Sư, Huyền Hư chân nhân, Khâu đạo trưởng, Mao Sơn đạo nhân, Thiền sư Trúc Lâm, Ni sư Diệu Âm, Tế tửu Văn Miếu, Phán quan Thôi, Địa Tạng sứ giả, Vu y bà A Mậu, Đan Đỉnh chân nhân, Phương sĩ Vô Danh, Bà Tư (thợ may) |
| **C — bong bóng** | 10–20 câu ngắn | NPC phụ có tên (`NPC-*` tài liệu 06), khách giải án theo 6 giọng `SFX-VOX-011…016` |
| **D — không lời** | `SFX-VOX-*` | mọi NPC còn lại; mọi NPC hạng B / C ở câu không thu |
| **Hoãn** | — | Lạt-ma Đa Kiệt: **không lồng tiếng** cho tới khi có cố vấn Tạng truyền (canon §3, §4) |

### 1.3 Thẻ vai (casting)

| NPC | Tuổi giọng | Âm sắc | Nhịp | Hướng diễn | Tránh |
|---|---|---|---|---|---|
| Thầy Tử Bình | 65–75 | trầm, ấm, hơi khàn | chậm, ngắt câu theo dấu phẩy | thầy – con; nói số liệu lá số rõ ràng như đọc sổ | giọng «thầy bói» bí hiểm |
| Vân Cốc thiền sư | 70–80 | mỏng, trong, nhiều hơi | rất chậm, nhiều khoảng lặng | kể chuyện Liễu Phàm như kể chuyện nhà; hay hỏi ngược | giảng đạo lên giọng |
| Khổng tiên sinh | 55–65 | sắc, lạnh, chắc | đều, không ngập ngừng | đoán đúng mọi thứ, tự tin tuyệt đối — phản đề «định mệnh» | giọng phản diện lộ liễu (ông không ác, ông tin số mệnh) |
| Yểm sư Lỗ Ban | 45–55 | mềm, ngọt, gần micro | chậm, thì thầm thân mật | cám dỗ bằng sự thông cảm | gào, cười ác |
| Lão Tùng (gác cổng) | 60–70 | mộc, dân dã | vừa | hướng dẫn thao tác bằng lời đời thường | đọc như hướng dẫn sử dụng |
| Trương Thiên Sư | 50–60 | vang, uy, khoẻ | vừa | «bần đạo – thí chủ»; nghi lễ trang nghiêm | quát |
| Huyền Hư chân nhân | 70+ | nhẹ, vui | thong thả | «lão đạo – tiểu hữu» | — |
| Khâu đạo trưởng | 50–60 | khô, nghiêm | gọn | giới luật | — |
| Mao Sơn đạo nhân (Mao Tiểu Tùng) | 40–50 | thực tế, ấm | nhanh vừa | «tôi – anh / chị»; như bác sĩ nói chuyện | giọng trừ tà kịch tính |
| Thiền sư Trúc Lâm (Pháp Không) | 60–70 | trầm, ít hơi | rất ít lời | công án — một câu rồi im | — |
| Ni sư Diệu Âm | 55–65 | nữ trầm, dịu | chậm | «sư – con» | ủy mị |
| Tế tửu Văn Miếu (Chu Văn Trinh) | 60–70 | rõ, mạch lạc | vừa | «lão phu – trò» | — |
| Phán quan Thôi | 50–60 | trang nghiêm, vang phòng | chậm | đọc sổ nghiệp như đọc sổ sách, không dọa | giọng âm phủ ghê rợn |
| Địa Tạng sứ giả | trẻ 25–35 | trong, ấm | chậm | người dẫn ra | — |
| Vu y bà A Mậu | 65–75 | nữ, mộc, chút thổ âm **miền núi phía Bắc Việt Nam** (không giả giọng nước ngoài) | vừa | «bà – cháu», hiền | biếm họa |
| Đan Đỉnh chân nhân (Cát Huyền) | 60–70 | ấm, hào hứng khi nói về thuốc | vừa | «bệnh ở đâu thì thuốc ở đó» | — |
| Phương sĩ Vô Danh | 40–60 (mơ hồ) | khó đoán | lửng | dẫn lộ Dị Cách | — |
| Bà Tư (thợ may) | 55–65 | nữ, Nam Bộ nhẹ, vui | nhanh | khen áo hợp mệnh | mời mua hàng (NPC không bán hàng bằng lời — canon §6.4 quy tắc 1; Bà Tư chỉ khen và giới thiệu) |

**Giới tính diễn viên** theo nhân vật. **Giọng vùng miền:** mặc định giọng Bắc chuẩn; Bà Tư giọng Nam nhẹ, Vu y bà giọng miền núi phía Bắc — để nhiều sắc giọng Việt mà không biếm họa.

### 1.4 Ước lượng số câu

| NPC | Câu kịch bản (ước) | Bong bóng | Tổng câu thu | Phút (≈ 4 s / câu) |
|---|---|---|---|---|
| Thầy Tử Bình | 420 | 60 | 480 | 32 |
| Vân Cốc | 380 | 40 | 420 | 28 |
| Khổng tiên sinh | 160 | 30 | 190 | 13 |
| Lỗ Ban | 220 | 20 | 240 | 16 |
| Lão Tùng | 120 | 30 | 150 | 10 |
| 13 NPC hạng B | 13 × 60 | 13 × 30 | 1.170 | 78 |
| NPC hạng C (≈ 40) | — | 40 × 15 | 600 | 30 |
| Khách giải án (6 giọng) | — | 6 × 40 (câu hỏi mẫu, cảm ơn) | 240 | 12 |
| Câu chuyển hướng khủng hoảng (UI-42) — **không thu**, chỉ chữ | — | — | 0 | 0 |
| **Tổng** | | | **≈ 3.490 câu** | **≈ 220 phút** |

Thêm 20% câu thu thừa (đổi kịch bản muộn) → ngân sách thu ≈ 4.200 câu.

### 1.5 Thoại theo lá số — câu ghép

Thoại có chèn dữ liệu lá số («Lá số con… Thất Sát không có gì chế») **không thu trọn câu** với mọi biến thể. Cách làm:

| Loại đoạn | Cách |
|---|---|
| khung câu cố định | thu trọn |
| tên thập thần, ngũ hành, sao, cách cục (từ vựng đóng ≈ 300 từ) | thu **từng từ** trong 3 ngữ điệu (giữa câu, cuối câu hỏi, cuối câu kể) → ghép |
| số (điểm 0–100, tuổi, năm) | thu số đếm 0–100 + «năm», «tuổi» → ghép |
| câu engine dài (`synthesis.factors` nguyên văn) | **không đọc**; NPC đọc một câu tóm và hiện nguyên văn ở bảng (UI-22) |

Ghép phải qua kiểm tai: chỗ nối khớp cao độ ± 1 bán cung, khoảng lặng 40–80 ms. Câu nào ghép nghe máy móc → chuyển về chữ (không VO) cho câu đó.

### 1.6 Kỹ thuật thu

| Mục | Giá trị |
|---|---|
| Phòng | phòng thu khô (RT60 < 0,3 s), tạp âm nền < −60 dBFS |
| Micro | tụ màng lớn, cách 20–25 cm, chắn hơi |
| Định dạng gốc | 48 kHz, 24 bit, mono |
| Chuẩn hóa | −20 LUFS tích hợp mỗi câu (±1), đỉnh thực ≤ −3 dBTP |
| Xử lý | bỏ tiếng thở thừa giữa câu (giữ hơi mở câu cho Vân Cốc — là chất giọng), không nén mạnh |
| Giao | Opus 48 kbps mono (web / Android); AAC 64 kbps (iOS) |
| Đặt tên | `VO_<npc>_<cảnh>_<câu>_<lượt>.opus`, vd `VO_van_coc_MQ-1-03.2_004_t2.opus` |
| Siêu dữ liệu | mốc «gật đầu», «nhấn» (để hoạt ảnh NPC khớp nhịp thay cho khẩu hình) |

**Không làm khẩu hình** (lip-sync) — nhân vật kiểu cách điệu; dùng cử chỉ đầu / tay theo mốc.

### 1.7 Phụ đề

Phụ đề = hộp thoại UI-40 (luôn bật). Cảnh cắt: phụ đề UI-99. Phụ đề âm thanh (mô tả tiếng, tùy chọn): danh sách nhãn chuẩn ở phần 14 §3.

---

## 2. Cấu trúc trộn âm

### 2.1 Cây bus

```
Master (giới hạn đỉnh −1 dBTP, nén đêm khuya tùy chọn)
├── MUS  (nhạc nền BGM, stinger)
├── AMB  (môi trường)
│   ├── AMB.BED    (lớp nền vùng)
│   ├── AMB.POINT  (nguồn điểm 3D)
│   └── AMB.BELL   (chuông canh — tắt riêng được)
├── SFX  (hiệu ứng trong cảnh)
│   ├── SFX.FOOT   (bước chân, thân thể)
│   ├── SFX.WORLD  (cửa, nước, nghi thức, mini-game)
│   └── SFX.COS    (trang phục, hào quang, ngự vật — tắt riêng được)
├── UI   (giao diện)
└── VO   (thoại, VOX)
```

Thanh trượt người chơi (UI-77) điều khiển: Tổng, MUS, AMB, SFX, UI, VO; công tắc: chuông canh (AMB.BELL), âm trang phục (SFX.COS), âm gõ chữ (một mục trong UI).

### 2.2 Mức chuẩn (trước thanh trượt người chơi)

| Bus | Mức gốc (dB) | Ghi chú |
|---|---|---|
| MUS | −8 | nhạc là nền, không lấn môi trường |
| AMB.BED | −12 | — |
| AMB.POINT | −10 | — |
| AMB.BELL | −6 | chuông canh rõ |
| SFX.FOOT | −14 | — |
| SFX.WORLD | −6 | — |
| SFX.COS | −16 | — |
| UI | −10 | — |
| VO | 0 | điểm neo của bản trộn |

### 2.3 Nén nhường (ducking)

| Kích hoạt | Bus bị nhường | Mức | Tấn công / nhả |
|---|---|---|---|
| VO đang phát | MUS | −8 dB | 80 ms / 600 ms |
| VO | AMB | −4 dB | 80 / 600 |
| VO | SFX.COS | −10 dB | 80 / 600 |
| chuông lớn (`SFX-BELL-001`, `-030`, `-031`) | MUS | −4 dB | 30 / 1.500 (để đuôi chuông nổi) |
| khoảnh khắc nghi thức (UI-33, UI-04) | AMB, SFX.FOOT, SFX.COS | −12 dB | 300 / 1.000 |
| bảng full đang mở | AMB.POINT | −4 dB | 400 / 400 |
| hội thoại AI đang hiện chữ | MUS | −3 dB | 400 / 1.000 |
| màn chuyển (UI-14) | mọi bus trừ SFX.WORLD (tiếng cửa / ngựa) | −18 dB | 200 / 500 |

### 2.4 Giới hạn số tiếng (voice limit)

| Nền tảng | Tổng tiếng cùng lúc | MUS (stem) | AMB | SFX | UI | VO |
|---|---|---|---|---|---|---|
| điện thoại (`pointer: coarse`) | 24 | 3 | 6 | 10 | 3 | 2 |
| máy tính | 40 | 3 | 10 | 20 | 4 | 3 |

Vượt giới hạn: bỏ tiếng có **Ưu** thấp nhất (cột Ưu phần 10), cùng ưu thì bỏ tiếng xa nhất / nhỏ nhất. Tiếng cùng mã phát lại trong < 60 ms bị gộp (chống chồng bước chân của 20 người chơi MMO).

### 2.5 Âm thanh 3D

| Thông số | Điện thoại | Máy tính |
|---|---|---|
| Mô hình xoay | `equalpower` | `HRTF` (chất lượng Cao), `equalpower` (Thấp / Vừa) |
| Suy giảm | `inverse`, `refDistance 2`, `maxDistance 40`, `rolloffFactor 1` | như điện thoại |
| Chuông lớn, thác | `refDistance 6`, `maxDistance 200` | — |
| Bước chân người khác | chỉ < 12 m | < 16 m |
| Tai nghe | vị trí tai = **camera** (không phải nhân vật) nhưng khoảng cách tính từ nhân vật — tránh tiếng nhỏ đi khi kéo camera xa (dist tới 48 m) | — |

### 2.6 Vang theo không gian (reverb)

Dùng `ConvolverNode` với bộ IR (phản hồi xung) tự thu tại hiện trường hoặc tổng hợp:

| Vùng vang | IR | RT60 | Áp dụng |
|---|---|---|---|
| ngoài trời đồng bằng | ngắn, sớm | 0,4 s | Huyền Thành, Bút Tháp |
| thung lũng / vách núi | có tiếng dội trễ 180–400 ms | 1,8 s | Manh Phái Cốc, Võ Đang, Long Hổ vách đỏ |
| đỉnh núi | khô, gió | 0,3 s | Tử Bình, Trích Thiên |
| điện gỗ lớn | ấm | 1,6 s | Chính Điện, Thiên Sư phủ |
| điện gạch – đá | sáng | 2,2 s | chùa Việt, Văn Miếu |
| điện nhỏ / các | — | 0,9 s | Văn Xương Các, Vận Mệnh Các |
| hang | tối, dài | 3,0 s | Phong Đô, hang Miêu Cương |
| rừng | khuếch tán | 0,8 s | Thư Lâu, Yên Tử, Mao Sơn |
| biển mây | rất dài, mờ | 4,0 s (mix 15%) | Côn Lôn |

Điện thoại: **một** convolver dùng chung, đổi IR khi đổi vùng (đan chéo 500 ms bằng hai convolver tạm). Máy tính: hai convolver (vùng + phòng). Gửi (send) theo bus: VO 8%, SFX.WORLD 20%, SFX.FOOT 12%, AMB.POINT 25%, UI 0%, MUS 0% (nhạc đã có vang sẵn).

---

## 3. Chỉ tiêu độ to (loudness)

| Hạng mục | Chỉ tiêu | Đo |
|---|---|---|
| **Bản trộn chơi trung bình** (10 phút đi lại + 1 án + 1 thoại) | **−16 LUFS tích hợp ±1** (chuẩn phổ biến cho game di động / web) | đo tại đầu ra master, thanh trượt mặc định |
| Đỉnh thực | ≤ −1,0 dBTP | giới hạn đỉnh master (lookahead 5 ms) |
| Thoại | −18 ± 2 LUFS ngắn hạn | khi có VO |
| Nhạc một mình (M2) | −22 ± 2 LUFS | — |
| Môi trường một mình | −26 ± 3 LUFS | — |
| Tiếng UI | đỉnh ≤ −20 dBFS, không tiếng nào > −14 dBFS | — |
| Khoảnh khắc nghi thức (đỉnh cảm xúc) | ≤ −12 LUFS ngắn hạn | không vượt +4 LU so với nền |
| Dải động | ≤ 14 LU giữa đoạn im nhất và to nhất trong 10 phút | — |
| **Chế độ đêm khuya** (UI-77, mặc định tự động 23:00–05:00) | nén master 3:1 từ −24 dBFS; sấm −6 dB; chuông lớn −4 dB | người chơi buổi tối, cạnh người ngủ |

**Bản iOS native:** tôn trọng công tắc im lặng (âm game tắt khi máy ở chế độ im lặng — dùng phiên âm thanh `ambient`); trên web iOS WebAudio phát kể cả khi bật công tắc im lặng — nên **mặc định tắt âm** trên web (đã đúng: `audio.js` mặc định tắt, chỉ bật khi khách bấm 🔈).

---

## 4. Triển khai — thay `audio.js`

### 4.1 Hiện trạng giữ lại

- Âm tắt mặc định, bật bằng nút 🔈 (`state.settings.sound`); `AudioContext` tạo lười và `resume()` sau thao tác (đúng chính sách tự phát của trình duyệt).
- `pause()` tắt âm (`setSound(false)`), `resume()` bật lại nếu cài đặt bật.
- Tổng hợp thủ tục (`noiseBuffer`, `bell`, `knock`, `rattle`) giữ làm **dự phòng** khi tệp chưa tải xong hoặc ở chế độ siêu nhẹ (2D).

### 4.2 Giao diện mô-đun mới (đề xuất cho tài liệu 13)

```js
audio.init()                          // tạo context + cây bus (§2.1) khi thao tác đầu
audio.play('SFX-BELL-031', { pos, gain, rate })   // trả về tay cầm để dừng
audio.loop('SFX-WATER-005', { pos })              // nguồn lặp 3D
audio.music.set({ region: 'yentu', slot: 'SANG', level: 'M2' })   // phần 09 §4
audio.music.sting('BGM-STING-MENHDO')
audio.bus('MUS').setGain(db)          // thanh trượt UI-77
audio.duck('VO', true)                // §2.3 (tự động khi play VO)
audio.reverb('cave')                  // §2.6
audio.listener(cameraPos, cameraQuat, playerPos)  // §2.5
```

### 4.3 Nạp và bộ nhớ

| Loại | Cách nạp | Ngân sách bộ nhớ (điện thoại) |
|---|---|---|
| UI, BODY, FOOT của vùng hiện tại | `AudioBuffer` giải mã sẵn khi vào vùng | ≤ 18 MB |
| SFX thế giới vùng hiện tại + liền kề | giải mã lười khi lại gần < 80 m | ≤ 24 MB |
| AMB.BED | **phát luồng** qua `<audio>` + `MediaElementAudioSourceNode` | luồng |
| MUS (3 stem) | **một tệp 6 kênh** (3 stem × stereo) phát luồng qua một `<audio>` → `ChannelSplitterNode` → 3 `GainNode` → bus MUS. Một phần tử nên 3 stem luôn khớp nhịp | luồng |
| VO | giải mã lười theo cảnh, xả sau cảnh | ≤ 8 MB |
| **Tổng giải mã** | | **≤ 50 MB** |

Lý do không giải mã nhạc thành `AudioBuffer`: một stem stereo 4 phút ở 48 kHz dạng float32 chiếm ≈ 92 MB — 3 stem gần 280 MB, vượt sức điện thoại. Nền tảng không phát được tệp 6 kênh (một số bản Safari cũ): rơi về **bản trộn sẵn stereo** của khung giờ — mất thích ứng theo lớp (§4.1 phần 09) nhưng giữ thích ứng theo khung giờ và vùng.

### 4.4 Định dạng tệp theo nền tảng

| Nền tảng | SFX | Nhạc 6 kênh | VO |
|---|---|---|---|
| Chrome, Firefox, Edge, Android WebView | Opus (WebM / Ogg) | Opus 6 kênh (Ogg) | Opus mono |
| Safari 17+ / iOS 17+ WKWebView | Opus (WebM) hoặc AAC | AAC 5.1 dạng 6 kênh (M4A) hoặc bản stereo | AAC mono |
| Dự phòng | WAV 16 bit 22 kHz (chỉ tiếng UI cực ngắn) | — | — |

---

## 5. Kiểm thử âm thanh

| # | Kiểm | Cách | Đạt |
|---|---|---|---|
| 1 | Độ to | ghi đầu ra 10 phút chơi chuẩn, đo LUFS | −16 ± 1, đỉnh ≤ −1 dBTP |
| 2 | Không đứt nhạc | 50 lần chuyển vùng / khung giờ ngẫu nhiên | không nghe đứt, không chồng hai chủ đề quá 8 s |
| 3 | Giới hạn tiếng | 60 người chơi MMO trong sân (test tải có sẵn) | ≤ 24 tiếng trên điện thoại, không rè |
| 4 | Bộ nhớ | đi qua 5 vùng liên tiếp trên điện thoại 4 GB RAM | giải mã ≤ 50 MB, không tăng mãi |
| 5 | Tắt âm | 🔈 tắt | 0 tiếng (kể cả chuông canh, VO) |
| 6 | Tạm dừng | chuyển tab / về nền | tắt dần 0,3 s; trở lại tiếp đúng khung giờ hiện tại |
| 7 | Ngắt cuộc gọi (native) | gọi đến giữa nghi thức | âm dừng, trở lại tiếp tục |
| 8 | Phụ đề âm thanh | bật tùy chọn, chơi cảnh Phong Đô | mọi tiếng có nhãn hiện đúng (phần 14 §3) |
| 9 | Nội dung | nghe toàn bộ thư viện | không có lời kinh / chú thật, không walla rõ chữ thô tục |

---

## 6. Bản quyền âm thanh

### 6.1 Nhạc

| Loại | Quy định |
|---|---|
| Sáng tác mới (mọi `BGM-*`) | hợp đồng đặt hàng chuyển giao **toàn bộ quyền tài sản** (sao chép, phân phối, đồng bộ hình ảnh, biểu diễn qua mạng, mọi nền tảng, toàn cầu, không thời hạn), quyền nhân thân của tác giả được tôn trọng (ghi tên trong phần ghi công) |
| Người biểu diễn (nhạc công, ca sĩ ngân) | hợp đồng chuyển giao **quyền liên quan của người biểu diễn** (Luật Sở hữu trí tuệ Việt Nam) cho bản ghi; trả trọn gói |
| Nhạc truyền thống (nhã nhạc, dân ca, đạo nhạc) | bài cổ không còn bảo hộ quyền tác giả, nhưng **bản ghi** của người khác vẫn được bảo hộ → **thu mới**, không lấy bản ghi có sẵn |
| Dân ca / ca khúc hiện đại có tác giả | không dùng (vd ca khúc Vu Lan nổi tiếng) — phần 09 §7 |
| Nghệ nhân dân tộc (Miêu, nhã nhạc Huế) | ghi công rõ tên, nhóm; thỏa thuận chia sẻ lợi ích nếu dùng trong quảng bá |

### 6.2 Tiếng (SFX)

| Nguồn | Được dùng | Không dùng |
|---|---|---|
| Tự thu (foley, hiện trường) | có | — |
| Thu tại cơ sở tôn giáo | chỉ khi có **văn bản cho phép** của ban quản lý; không thu nghi lễ đang diễn ra nếu không được đồng ý; tiếng người nhận ra được → giấy đồng ý | thu lén |
| Thư viện thương mại | giấy phép cho phép nhúng vào sản phẩm phần mềm phân phối (royalty-free, game use) | giấy phép chỉ dùng cho phim / video |
| Freesound và nguồn mở | **chỉ CC0** | CC-BY-NC, CC-BY-SA (ràng buộc chia sẻ / phi thương mại); CC-BY tránh để khỏi sổ ghi công rời rạc |

### 6.3 Văn bản đọc thành tiếng

Bản dịch kinh tiếng Việt hiện đại (vd các bản dịch của các vị thầy đương thời) **có thể còn bảo hộ** → muốn trích đọc phải xin phép; ưu tiên tóm ý bằng lời của game (canon §5.4 đã yêu cầu «không in toàn văn chú»). Hán văn cổ (kinh gốc, Trích Thiên Tủy) không còn bảo hộ.

### 6.4 Giọng diễn viên

- Hợp đồng trọn gói theo câu / theo buổi, quyền dùng trong game và tư liệu quảng bá của game.
- **Điều khoản AI:** cấm dùng bản thu để huấn luyện mô hình giọng / nhân bản giọng nếu không có phụ lục riêng có trả tiền và diễn viên đồng ý bằng văn bản.
- Diễn viên được ghi tên trong phần ghi công và trong mục «Giới thiệu» (UI-75).

### 6.5 Sổ bản quyền âm thanh

Mỗi tệp âm thanh có một dòng trong **sổ bản quyền** (bảng tính): mã (`SFX-*` / `BGM-*` / `VO_*`), nguồn, người thu / tác giả, ngày, loại giấy phép, đường dẫn bằng chứng (hợp đồng / hóa đơn / văn bản cho phép), ghi công cần hiện. Kiểm tự động khi đóng gói: tệp nào không có dòng sổ → **không đóng gói**.
