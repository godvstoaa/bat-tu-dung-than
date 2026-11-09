# 04-20 · Kịch bản theo Mệnh Cách và Thời Vận

Quy ước như 04-14 §0. Các cảnh dưới đây là **mô-đun** mà nhánh `BR-TT/DC/NT/DK` (03) gọi tới theo dữ liệu Mệnh Bàn của từng người: cùng một nhánh, mỗi người chơi gặp đúng cảnh khớp lá số của mình.

## 1. Thuận Thiên — ải giữ cách

### 1.1 Cơ chế (nhắc lại 04-05 §2.3)

Mỗi đại vận có `gejuDelta < 0` hoặc `gejuWorsen = true` trong 8 đại vận đầu của chính người chơi là một **ải giữ cách**, mở khi người chơi xem cổng vận đó ở Vận Mệnh Các. Thứ tự gặp: theo tuổi tăng dần. Mỗi ải có 3 phần: **nhận ra** (Thầy chỉ thập thần của vận khắc thập thần chủ cách), **giữ** (một giới 7 ngày do người chơi chọn, như Thiết Bì Lan 04-15 §1.2), **qua** (cảnh ngắn).

Nếu lá số Thuận Thiên không có đại vận cách-nghịch nào trong 8 đại vận đầu: không có ải; Thầy nói câu «Con may. May thì phải chia» và mở một nhiệm vụ dẫn một người Nghịch Thiên đi một chặng (MMO hoặc NPC).

### 1.2 Cảnh nhận ra

```
[CẢNH STAT-CANH-TT-01 · Vận Mệnh Các, trước cổng vận {gz} · giờ Dậu · đèn lồng]
THẦY TỬ BÌNH: Cổng này. {gz}. Con {tu} tuổi tới đây.
THẦY TỬ BÌNH: Cách của con là {cach}, sao chủ cách là {sao_chu}. Cổng này mang {sao_van} — sách nói sao này {quan_he} sao của con.
> Lựa chọn: ① «Vậy cổng này xấu?» → [TT-01a]  ② «Con phải làm gì?» → [TT-01b]

[TT-01a]
THẦY TỬ BÌNH: Cổng không xấu. Cổng là chỗ gió lùa. Nhà xây chắc thì gió lùa cũng chỉ mát. → [TT-01b]

[TT-01b]
THẦY TỬ BÌNH: Giữ một điều trong bảy ngày. Con tự chọn điều gì. Người thành cách thường quên rằng mình cũng phải giữ.
(Chọn giới — như 04-15 §1.2. Bảy ngày thật.)
```

`{quan_he}` lấy theo cặp thập thần (`PATTERN_PREF.ji` của cách): «khắc» (vd Thương Quan với Chính Quan), «đoạt» (Kiêu với Thực), «tranh» (Tỷ Kiếp với Tài), «phá» (Tài với Ấn), «trợ quá» (Tài với Sát ở cách Thất Sát).

### 1.3 Cảnh qua

```
[CẢNH STAT-CANH-TT-02 · Vận Mệnh Các · ngày thứ tám · trời trong]
(Cổng vận {gz} mở; trên khung cổng hiện một vết nứt nhỏ đã được trám.)
THẦY TỬ BÌNH: Con thấy vết trám không? Đời thật không ai tránh hết gió. Chỉ có người biết trám.
(Danh hiệu «Thủ Cách» lần đầu; các lần sau +40 công tu × NT.)
```

## 2. Nghịch Thiên — nút thắt Mệnh Đồ theo từng bệnh

### 2.1 Cơ chế

Mỗi bệnh **không có thuốc** trong `diseases[]` là một nút thắt trên Mệnh Đồ (`gaimenhPlan`, 05). Tài liệu 04 cung cấp **cảnh tháo nút** theo `via` của bệnh; 05 quyết số công đức cần. Trong đại vận `gejuRescue = true` (Vận Cứu Cách), nút thắt tương ứng tháo được bằng một cảnh duy nhất thay vì cả chuỗi (04-05 §2.5).

Cấu trúc một nút: Vân Cốc **gọi tên** nút bằng hình ảnh → người chơi làm **việc đối ứng** (một loại việc của 09, có thẻ trục Ngũ Duy đúng nhóm «thuốc» lẽ ra cần) → cảnh tháo.

### 2.2 Bảng nút theo `via`

| `via` | Tên bệnh (04-05 §2.7) | Hình ảnh Vân Cốc dùng | Việc đối ứng (trục) | Câu tháo nút |
|---|---|---|---|---|
| `noroot` | Phù Căn | «cây bèo, rễ không chạm đất» | ở yên một vùng 7 ngày, làm việc hằng ngày ở đó (Đồng đạo / theo vùng) | «Rễ mọc chỗ người ở lâu.» |
| `kong` | Treo Cung | «cái chuông treo không người đánh» | đợi lưu niên «xuất không» hoặc làm 3 việc cho người khác đúng vào ngày can chi trống (`kongwang`) | «Chuông treo thì ai đi qua cũng đánh được — miễn có người đi qua.» |
| `he` | Hợp Khứ | «người bị kéo đi theo bạn» | tách khỏi một thói quen tu (đổi chỗ, đổi giờ) 3 lần | «Hợp không xấu. Hợp mà quên mình mới xấu.» |
| `ke` | Khắc Phá | «hai con dê húc nhau trên cầu» | hòa giải một tranh chấp NPC (Trị đạo) | «Một con lùi, cả hai qua cầu.» |
| `mix` | Hỗn Tạp | «hai người chèo thuyền ngược hướng» | chọn một trong hai việc trái nhau và làm trọn (Trị đạo) | «Chọn một hướng chèo. Hướng kia để mai.» |
| `chong` | Lay Gốc | «cây bị gió lay gốc» | dựng một thứ ở một nơi cố định (nhà riêng, đạo tràng — Nghệ đạo) | «Gốc lay thì đắp đất, không phải chặt cây.» |
| `dang` | Đảng Thế | «một bên cán cân bị chất thêm» | bố thí phần dư (Thương đạo) | «Bớt bên nặng thì cân về giữa.» |
| `duo` | Đoạt Thực | «bát cơm bị giật» | làm ra một món rồi tặng đi (Nghệ đạo) | «Cái bị giật đi là cái mình nắm. Cái mình cho thì không ai giật.» |
| `noyong` | Vô Dụng Xứ | «thanh kiếm không vỏ, không chỗ treo» | nhận một chức việc ở Sơn Môn (Trị đạo) | «Có chỗ dùng thì kiếm thôi lăn lóc.» |
| `xoroot` | Tranh Đoạt | «nhiều người tranh một giếng nước» | chia của trong đội đều (Đồng đạo) | «Giếng không cạn vì nhiều người múc. Cạn vì không ai giữ.» |

Nghịch Thiên do bệnh đặc biệt (`support-root`, `*-tougan`, `guan`, `clash-hua`) chỉ gặp ở Dị Cách bại chọn «về đường thường» — dùng bảng Dị Cách §3.

### 2.3 Cảnh mẫu — nút `ke` (Khắc Phá)

```
[CẢNH STAT-CANH-NT-KE · Am Vân Cốc · giờ Thân · mưa phùn]
VÂN CỐC: (vẽ hai con dê trên đất bằng que) Trong lá số con có hai con dê thế này. Sao này húc sao kia.
VÂN CỐC: Sách gọi là khắc phá. Thầy gọi là hai con dê trên cầu.
> Lựa chọn: ① «Con nên đuổi con nào đi?» → [NT-KE-a]  ② «Làm sao cho chúng qua cầu?» → [NT-KE-b]

[NT-KE-a]
VÂN CỐC: Cả hai đều là con. Đuổi con nào thì cũng mất một nửa. → [NT-KE-b]

[NT-KE-b]
VÂN CỐC: Dưới làng có hai nhà tranh nhau cái bờ ruộng. Con xuống đó. Không phải phân xử ai đúng — làm cho một nhà lùi được mà không mất mặt.
(Việc: một vụ tranh chấp cấp 1–3 tùy cây Trị đạo. Mọi kết hòa giải đều đạt; kết «phán thắng thua» không đạt nhưng làm lại được.)
[sau khi xong]
VÂN CỐC: Một con lùi, cả hai qua cầu. Con vừa tháo một nút.
(Nút thắt trên Mệnh Đồ chuyển sang «đã tháo».)
```

### 2.4 Cảnh mẫu — nút `chong` (Lay Gốc) trong Vận Cứu Cách

```
[CẢNH STAT-CANH-NT-CHONG-VCC · Vận Mệnh Các, cổng vận {gz} đang sáng vàng · bình minh]
VÂN CỐC: (đứng sẵn ở cổng — lần duy nhất ông rời am) Mười năm này trời đắp đất cho con. Nút lay gốc của con tháo bằng một việc.
VÂN CỐC: Trồng một cây ở chỗ con định ở lâu nhất. Chỉ một cây.
(Việc: trồng một cây ở nhà riêng hoặc đạo tràng. Thay cho chuỗi «dựng ở nơi cố định» thường lệ.)
VÂN CỐC: Thường thì phải dựng cả căn nhà. Năm nay một cây là đủ. Gặp thời thì việc nhỏ thành việc lớn.
```

## 3. Dị Cách — sáu lộ con với Phương sĩ Vô Danh

### 3.1 Cảnh gặp Phương sĩ (chung)

```
[CẢNH STAT-CANH-DK-00 · quán trà dưới chân Sơn Môn · lúc trời đổi gió (sự kiện thời tiết) · lá bay]
(Một người áo bạc màu ngồi quay lưng ra đường, uống trà, không gọi ai.)
PHƯƠNG SĨ: Lão Tử Bình gửi tới hả. Lão ấy đọc thân, ta đọc thế. Ngồi.
PHƯƠNG SĨ: Nhìn ra đường. Gió thổi hướng nào?
> Lựa chọn: ① «Về phía núi.» → [DK-00a]  ② «Không biết.» → [DK-00a]  ③ (nhìn lá bay rồi chỉ) → [DK-00a]
[DK-00a]
PHƯƠNG SĨ: Lá không cãi gió. Lá cũng không bị gió làm hại. Lá của con bay hướng nào — cái đó lá số con đã chỉ.
→ [rẽ theo loại cách: DK-TONG-TAI / DK-TONG-SAT / DK-TONG-NHI / DK-VUONG / DK-CHUYEN / DK-HOA]
```

### 3.2 Bảng sáu lộ

| Mã cảnh | Cách | Lộ con | Hình ảnh của Phương sĩ | Thử thách chủ đề | Việc «giữ thế» điển hình |
|---|---|---|---|---|---|
| `DK-TONG-TAI` | 從財格 | Tòng Lộ · Tài | «con thuyền thả theo dòng sông chở hàng» | học **cho đi** của cải mà không giữ | buôn tuyến và bố thí liên tục; tránh tích trữ |
| `DK-TONG-SAT` | 從殺格 | Tòng Lộ · Quyền | «người lính theo cờ» | theo một kỷ luật lớn hơn mình mà không mất mình | nhận chức việc, giữ giới dài |
| `DK-TONG-NHI` | 從兒格 | Tòng Lộ · Nghệ | «dòng suối chảy thành thác» | để tác phẩm nói thay | làm ra và trao đi sản phẩm (đan, tranh, câu đối) |
| `DK-VUONG` | 從旺格 | Vượng Lộ | «ngọn núi không cần ai đỡ» | dồn thế vào một hướng, không phân tán | tu một đạo thống liên tục 30 ngày |
| `DK-CHUYEN` | 曲直 / 炎上 / 稼穡 / 從革 / 潤下 | Chuyên Lộ · {hanh} | «một rừng / một lò / một cánh đồng / một mỏ / một biển» | một hành tuyệt đối, tiết ra ngoài | việc của hành Dụng (Thực Thương) — tiết tú |
| `DK-HOA` | 化土 / 化金 / 化水 / 化木 / 化火 | Hóa Lộ · {hanh} | «con tằm hóa bướm» | bỏ cái cũ, thành cái mới | đổi đạo hiệu (`naming`), đổi nơi ở |

### 3.3 Cảnh mẫu — Tòng Lộ · Nghệ (`從兒格`)

```
[CẢNH STAT-CANH-DK-TONG-NHI · quán trà · tiếp]
PHƯƠNG SĨ: Lá của con là dòng suối. Suối không giữ nước — suối chảy thành thác.
PHƯƠNG SĨ: Người thường tu thì giữ mình cho vững. Con mà giữ mình thì suối thành ao, ao thì tù.
> Lựa chọn: ① «Vậy con không cần giữ gì?» → [a]  ② «Con phải làm gì?» → [b]
[a]
PHƯƠNG SĨ: Giữ cho dòng chảy. Đừng giữ nước. → [b]
[b]
PHƯƠNG SĨ: Làm ra. Rồi cho đi. Một bức tranh, một lò đan, một câu đối — làm xong thì đưa người khác, đừng treo ở nhà mình.
{nếu sub = 败格}
PHƯƠNG SĨ: Nhưng suối của con đang bị chặn — có một tảng đá ({sao_chan}) đặt ngay đầu nguồn. Con có hai đường: dời đá mà chảy tiếp, hoặc thôi làm suối, làm giếng như người thường. Đường nào cũng tới.
> ① «Con dời đá.» → (giữ Dị Cách, Mệnh Đồ có nút «Nghịch Thế · lộ»)  ② «Con làm giếng.» → (chuyển Nghịch Thiên — 04-05 §2.8, giữ tiến độ)
{hết}
```

`{sao_chan}` lấy từ bệnh `*-tougan` của engine (vd `MAU-M`: «癸 偏印 — Thiên Ấn thấu can»), diễn giải «một ngôi sao trợ thân lộ ra ở can».

### 3.4 Cảnh mẫu — Chuyên Lộ · Thủy (`潤下格`, `MAU-J`)

```
[CẢNH STAT-CANH-DK-CHUYEN-THUY · bờ Cùng Thông Hồ · giờ Hợi · sương]
PHƯƠNG SĨ: Lá số con toàn nước. Một biển. Người ta bảo «nước nhiều thì ngập». Ta bảo: biển không ngập. Biển chỉ cần chỗ chảy ra.
PHƯƠNG SĨ: Chỗ chảy ra của con là cây. Nước nuôi cây. Con tu bằng cách nuôi thứ khác lớn lên.
(Việc giữ thế: hoạt động hành Mộc — Dụng của `MAU-J` — mỗi tuần.)
PHƯƠNG SĨ: Có một điều. Năm nào gặp đất đắp đê chặn biển — năm ấy con sẽ thấy ngột. Đừng phá đê. Tìm khe mà chảy.
```

(«Đất đắp đê» = vận Quan Sát (Thổ) với nhật chủ Thủy — bệnh tiềm ẩn `latent-guan`.)

## 4. Thời Vận — cảnh theo sự kiện vận

### 4.1 Bước qua cổng vận mới (đổi đại vận)

Kích hoạt: năm tham chiếu (theo Lập Xuân) bằng `startYear` của một đại vận.

```
[CẢNH STAT-CANH-TV-01 · Vận Mệnh Các · ngày đầu năm can chi · gió xuân]
(Cổng vận cũ tối dần, cổng mới sáng lên.)
THẦY TỬ BÌNH: Mười năm {gz_cu} qua rồi. Mười năm {gz_moi} bắt đầu.
THẦY TỬ BÌNH: Cổng cũ con đi được gì, cổng mới con mang theo cái đó. Cái không mang được thì để lại cổng cũ.
{rating_moi ∈ Đỉnh vận, Thuận}
THẦY TỬ BÌNH: Cổng này thuận gió. Thuận gió thì đi xa — nhưng nhớ ai chèo cùng mình.
{rating_moi ∈ Bình, Hơi thuận}
THẦY TỬ BÌNH: Cổng bình. Mười năm bình là mười năm làm được việc nhất.
{rating_moi ∈ Gợn, Vận thử thách, Vận đại thử thách}
THẦY TỬ BÌNH: Cổng dốc. Đường dốc thì đi chậm, nhưng mỗi bước được hai bước.
{gejuRescue}
THẦY TỬ BÌNH: Và — cổng này mang thuốc cho cách của con. Mười năm này nút thắt dễ tháo.
{hết}
```

### 4.2 Năm Hạn — Thái Tuế Điện

Kích hoạt: lưu niên rating Hung / Đại hung (mặt trước «Năm thử thách» / «Năm Hạn»).

```
[CẢNH STAT-CANH-TV-02 · Thái Tuế Điện · sau Lập Xuân · khói hương]
TỪ GIỮ ĐIỆN: Năm nay vị Thái Tuế trực niên là {thai_tue}. Năm của con gặp ngài — người xưa gọi là năm hạn.
> Lựa chọn: ① «Năm hạn thì sao ạ?» → [a]  ② «Con có phải cúng gì không?» → [b]
[a]
TỪ GIỮ ĐIỆN: Năm hạn là năm đường gồ ghề. Người đi đường gồ ghề thì chân khỏe ra. → [c]
[b]
TỪ GIỮ ĐIỆN: Không phải mua gì. Thắp một ngọn đèn, ghi tên con, mỗi tháng tới thay dầu. Đèn là để con nhớ đi cẩn thận — không phải để ngài thôi giận. → [c]
[c]
(Đèn Thái Tuế của người chơi: thắp miễn phí; `thaitue.js` đã có. Chuỗi «Năm Hạn» mở; việc thử thách +{r3}%.)
TỪ GIỮ ĐIỆN: Năm nay con chọn việc khó thì tu nhanh nhất đời. Ta nói thật đấy.
```

Ràng buộc an toàn: không cảnh nào bán vật phẩm «giải hạn» (RB5); đèn miễn phí.

### 4.3 Biến Vận (`clashType = '天克地冲'`)

```
[CẢNH STAT-CANH-TV-03 · Vận Mệnh Các, cổng {gz} · sấm xa]
THẦY TỬ BÌNH: Cổng này trời khắc đất xung với ngày sinh của con. Mười năm có một lần đổi lớn.
{clashMitigated}
THẦY TỬ BÌNH: Mà cổng mang đúng hành con cần. Đổi lớn theo hướng có lợi — như dọn nhà sang chỗ rộng hơn.
{không}
THẦY TỬ BÌNH: Đổi lớn thì mệt. Nhưng người không bao giờ đổi thì cũng không bao giờ lớn.
{hết}
> Lựa chọn (sự kiện trong game, chọn một): ① dời nhà riêng sang vùng khác  ② đổi sư phụ chính  ③ đổi đạo hiệu
(Mọi lựa chọn có lợi ích riêng; không lựa chọn nào làm mất tiến độ.)
```

### 4.4 Phục Ngâm (`clashType = '伏吟'`)

```
[CẢNH STAT-CANH-TV-04 · giấc mộng sau tĩnh tọa · không gian mờ]
(Người chơi gặp một bản sao của chính mình, mặc áo ngày đầu nhập môn.)
BẢN SAO: Ta là con lúc mới tới. Con nhớ ta không?
> ① «Nhớ.» → [a]  ② «Không còn nhớ.» → [b]
[a] BẢN SAO: Vậy nói cho ta biết: đường có dài như ta sợ không? → (người chơi chọn một câu trả lời; bản sao mỉm cười, tan)
[b] BẢN SAO: Không sao. Ta nhớ con là được. → (tan)
(Vận phục ngâm: mười năm «gặp lại chính mình». Cảnh một lần duy nhất mỗi vận.)
```

### 4.5 Lập Xuân — năm mới

```
[CẢNH STAT-CANH-TV-05 · Sơn Môn, sân trước · giờ Lập Xuân (theo lịch thật) · nắng đầu xuân]
LÃO TÙNG: Lập Xuân rồi. Năm {gz} bắt đầu. Năm can chi đổi hôm nay, không phải hôm Tết — thầy con chắc đã giảng.
LÃO TÙNG: Thời vận của con năm nay thầy đã đọc lại. Vào xem đi. Lão thì năm nào cũng như năm nào — quét sân.
```

### 4.6 Tiểu Vận (người chơi chưa khởi vận)

```
[CẢNH STAT-CANH-TV-06 · Vận Mệnh Các · bất kỳ]
THẦY TỬ BÌNH: Cổng đầu tiên của con còn đóng. Con chưa tới tuổi khởi vận — trẻ quá, trời chưa giao vận.
THẦY TỬ BÌNH: Không có vận cũng là một cái may: không thuận, không nghịch. Cứ học.
```

## 5. Checklist nghiệm thu phần 04-20

- [ ] Ải giữ cách lấy đúng đại vận `gejuDelta < 0` / `gejuWorsen` của chính người chơi; không có thì có nhiệm vụ thay thế.
- [ ] Mỗi `via` không có thuốc có một nút thắt với việc đối ứng đúng trục.
- [ ] Vận Cứu Cách rút nút thắt thành một cảnh.
- [ ] Sáu lộ Dị Cách có cảnh mở; Dị Cách bại có lựa chọn chuyển lộ.
- [ ] Cảnh Thái Tuế không bán gì; đèn miễn phí.
- [ ] Mọi sự kiện vận dùng năm theo Lập Xuân.
