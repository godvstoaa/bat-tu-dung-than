# 05-03 · Sổ Công Quá — công đức là năng lượng

> Phần này đặc tả **cơ chế sổ**: đơn vị công, cách việc trong game thành dòng sổ, công nào «hữu hiệu», trần chống cày, cách đổi công ra Đạo Hạnh, ba mốc Liễu Phàm 300 / 600 / 1.000, giao diện sổ, lời nhận xét của engine, sổ chung của môn phái và máy chủ, và **sổ đời thực** tùy chọn (không thưởng).
> Danh mục ≥ 200 việc cụ thể (`DEED-xxx`) nằm ở 05-04. Nghiệp và sám hối (khi sổ có «quá») ở 05-05.
> Engine: `` `remedy-fate › CONG_QUA` ``, `` `remedy-fate › meritLedger` ``, `` `remedy-fate › LIAOFAN_STORY` ``, `` `remedy › LIAOFAN` ``, `` `remedy-fate › TEN_THIEN` ``, `` `remedy-fate › ZHUNTI.how` `` («功过格»).

---

## 1. Dữ liệu gốc của app

### 1.1 Bảng công quá (`CONG_QUA`)

**Thiện** (`CONG_QUA.thien`, 10 mục):

| Mã nhóm game | `a` (nguyên văn app) | `p` | Hạnh `TEN_THIEN` gắn chính |
|---|---|---|---|
| T-PS | Phóng sinh (cứu mạng) | 3 | 爱惜物命 |
| T-CN | Cứu người nguy cấp | 3 | 救人危急 |
| T-GN | Giúp người khó khăn | 2 | 成人之美 / 与人为善 |
| T-BT | Bố thí tiền/của | 2 | 捨财作福 |
| T-HT | Hiếu thuận cha mẹ | 2 | 敬重尊长 |
| T-AC | Làm thiện ẩn (âm chất) | 2 | (mọi hạnh, khi làm ẩn) |
| T-CH | Ăn chay 1 ngày | 1 | 爱惜物命 |
| T-GL | Giữ lời,không dối | 1 | 爱敬存心 |
| T-KT | Khuyên người làm thiện | 1 | 劝人为善 |
| T-KI | Đọc/sao kinh +持咒 | 1 | 护持正法 |

**Ác** (`CONG_QUA.ac`, 9 mục):

| Mã nhóm game | `a` (nguyên văn app) | `p` | Thanh nghiệp liên quan (05-05) |
|---|---|---|---|
| A-SS | Sát sinh (giết mạng) | 3 | KARMA-SAT |
| A-TC | Trộm cắp/lấy không nên lấy | 3 | KARMA-DAO |
| A-DT | Dối trá/lừa gạt | 2 | KARMA-VONG |
| A-TD | Tà dâm | 2 | KARMA-DAM |
| A-BH | Không hiếu thuận | 2 | (Ấn — không có thanh riêng; ghi vào KARMA-SI «trái ân») |
| A-LT | Nói lời tổn thương | 1 | KARMA-AC |
| A-RU | Uống rượu say | 1 | (giới; không có trong 10 ác nghiệp — chỉ ghi quá) |
| A-GD | Giận dữ mất kiểm soát | 1 | KARMA-SAN |
| A-DK | Đố kỵ/tham | 1 | KARMA-THAM |

### 1.2 Hàm `meritLedger(logged)`

- Nhận mảng `{ type: 'thien'|'ac', action, count }`.
- Tìm mục trong bảng bằng **`x.a.toLowerCase().includes(action.toLowerCase())`** → điểm `p`, nhân `count`. **Không tìm thấy thì `p = 1`.**
- Trả `{ net, thienCount, acCount, verdict }` với `verdict`:
  - `net ≥ 10` → «★ Tích đức tốt — đang chuyển quỹ đạo (theo Liễu Phàm)»;
  - `net > 0` → «Tích tiểu thiện — tiếp tục»;
  - `net < 0` → «⚠ Quá nặng hơn công — CẢI QUÁ (3 cấp tâm lý事)»;
  - `net = 0` → «Cân bằng — hãy bắt đầu tích thiện».

**Ràng buộc kỹ thuật bắt buộc:** mọi dòng sổ game gửi vào `meritLedger` phải có `action` là **nguyên văn chuỗi `a`** của app (vd `'Cứu người nguy cấp'`). Không được gửi tên DEED hay mô tả game — vì so khớp bằng `includes`, một chuỗi lạ sẽ âm thầm thành `p = 1`. Kiểm thử: với mỗi mã nhóm ở 1.1, `meritLedger([{type, action: a, count: 1}]).net === ±p`.

---

## 2. Đơn vị và ba con số của sổ

| Con số | Định nghĩa | Dùng cho |
|---|---|---|
| **Công ghi sổ** | tổng `p × count` mọi dòng thiện đã ghi, không trừ gì | thống kê đời, biểu đồ |
| **Quá ghi sổ** | tổng `p × count` mọi dòng ác | thống kê, sám hối |
| **Công hữu hiệu ròng** | (công **hữu hiệu** — qua luật trần §3) − (quá **chưa sửa**) | mốc Liễu Phàm, điều kiện Quy nhất, Thiên Bảng phụ |

**Thang /10 của Liễu Phàm:** Liễu Phàm ghi 3.000 / 6.000 / 10.000 công trong nhiều năm. Game giữ đúng **tỷ lệ** 3 : 6 : 10 và chia 10 để vừa nhịp chơi (canon §6). Một «công» trong game = một điểm `p` của app.

**Quá đã sửa:** một dòng ác được đánh dấu «đã cải» khi người chơi làm đủ **việc sửa** của dòng đó (05-05 §5). Quá đã cải **không trừ** vào công hữu hiệu ròng nữa, nhưng vẫn nằm trong sổ (mực đen có gạch son) — đúng tinh thần «改過之法»: lỗi không xóa, lỗi được sửa.

---

## 3. Từ việc trong game tới dòng sổ

### 3.1 Đường ống ghi sổ

```
sự kiện game (máy nhiệm vụ)          ví dụ: npc_rescued{npc, region, method}
        │
        ▼
luật DEED (05-04)                    DEED-031 «Kéo người ngã xuống suối»: nhóm T-CN, count 1
        │  ├─ kiểm hồi chiêu (cooldown) theo DEED
        │  ├─ kiểm chống cày (luật CC-1…CC-9 dưới)
        │  └─ xác định âm / dương thiện (05-01 §3.6)
        ▼
dòng sổ { deed:'DEED-031', type:'thien', action:'Cứu người nguy cấp', count:1,
          huuHieu: true|false, am: true|false, region:'cungthong', at }
        │
        ├──▶ meritLedger(…) cho lời nhận xét (7 ngày / đời)
        ├──▶ Đạo Hạnh (nếu hữu hiệu): B = 2 × p × count (×0,5 nếu dương thiện)
        ├──▶ huy hiệu Thập Thiện (05-01 §3.8)
        └──▶ thanh nghiệp (chỉ khi type = 'ac') (05-05)
```

**Ai quyết định:** máy nhiệm vụ (deterministic). AI hội thoại **không bao giờ** ghi sổ, không hứa công (bản sơ đồ §6.1 quy tắc 4).

### 3.2 Đổi công ra Đạo Hạnh

| Loại dòng | Đạo Hạnh gốc `B` | Ghi chú |
|---|---|---|
| thiện hữu hiệu, âm thiện hoặc thường | `2 × p × count` | sau đó × k × (1 + a) theo 05-01 §3.1; **không** Nghịch Duyên (việc thiện không thuộc nhóm tu tâm) |
| thiện hữu hiệu, dương thiện (đã khoe) | `1 × p × count` | |
| thiện **không** hữu hiệu (quá trần) | 0 | vẫn ghi sổ, vẫn tính huy hiệu Thập Thiện |
| dòng «Làm thiện ẩn (âm chất)» cộng thêm | `2 × 2 = 4` | tối đa 2 lần / ngày (05-01 §3.6) |
| ác | 0 | **không trừ Đạo Hạnh** trực tiếp (Đạo Hạnh chỉ giảm do phạm giới, 05-01 §3.7). Nếu việc ác đồng thời phạm giới của đạo đang tu thì áp luật phạm giới riêng |

**Vì sao ác không trừ Đạo Hạnh:** để một hệ trừng phạt duy nhất (giới) tồn tại, dễ hiểu. Việc ác đã có ba hậu quả hiển nhiên: dòng quá trong sổ (kéo công ròng xuống, có thể chặn mốc Liễu Phàm và Quy nhất), thanh nghiệp tăng, NPC phản ứng.

### 3.3 Luật chống cày (CC)

| Mã | Luật | Giá trị |
|---|---|---|
| CC-1 | **Nhật hạn công hữu hiệu** | 15 công / ngày (giờ máy chủ). Quá hạn: dòng vẫn ghi, `huuHieu = false`. Lời sổ: «việc làm vì việc đáng làm» |
| CC-2 | **Trần theo nhóm / ngày** | T-PS 6 (2 lần) · T-CN 9 (3 lần) · T-GN 6 · T-BT 6 · T-HT 4 · T-AC 4 (2 lần, cộng thêm) · T-CH 1 · T-GL 3 · T-KT 3 · T-KI 3 |
| CC-3 | **Cùng đối tượng** | cùng một NPC chỉ cho công hữu hiệu **1 lần / 24 giờ** (giúp mãi một người không thành «máy công») |
| CC-4 | **Hồi chiêu theo DEED** | mỗi DEED có hồi chiêu riêng (cột «Hồi chiêu» ở 05-04), tính từ lần hữu hiệu gần nhất |
| CC-5 | **Nhu cầu thật** | việc «giúp» chỉ có công khi NPC đang ở **trạng thái cần** do thế giới sinh (đói, lạc, ốm, mắc kẹt…). Người chơi không tạo được trạng thái cần (không đẩy NPC xuống suối rồi kéo lên) — mọi hành vi gây ra trạng thái cần bị chặn từ hệ vật lý / hội thoại |
| CC-6 | **Vòng giữa người chơi** | bố thí / giúp giữa hai người chơi: công hữu hiệu chỉ cho người **cho** khi người nhận ở bậc thấp hơn **hoặc** đang có nhu cầu do hệ thống ghi nhận (mới vào game < 7 ngày, đang trong chuỗi Hồi Đầu, vừa mất đồ do sự kiện); hai người cho qua cho lại trong 7 ngày → cả hai không hữu hiệu (CC-9) |
| CC-7 | **Phóng sinh đúng cách** | thả sai loài / sai môi trường (bảng 05-04 §2) không có công, không có quá, có lời giảng — theo `amta-data › remedies › remedy-fangsheng.caveat` («phản đối phóng sinh loài ngoại lai / sai môi trường») |
| CC-8 | **Mua để thả** | chim / cá mua ở chợ để thả: công **chỉ** khi con vật có trong lồng do thế giới sinh (người buôn bắt từ trước). Thả xong, người buôn **không** bắt thêm vì người chơi mua (chống tạo cầu cho việc bắt) — kho người buôn giảm, hồi theo ngày; nếu kho = 0, DEED không khả dụng |
| CC-9 | **Phát hiện vòng** | máy chủ đánh dấu cặp người chơi trao đổi Phúc Khí qua lại ≥ 3 lần / 7 ngày với chênh lệch ròng < 10% → mọi dòng bố thí giữa họ trong 7 ngày đó thành không hữu hiệu (không phạt gì khác) |

### 3.4 Việc ác — chỉ khi chọn

| Luật | Nội dung |
|---|---|
| AC-1 | Mọi dòng ác sinh từ **một lựa chọn hội thoại hoặc hành động** có thẻ hậu quả hiện trước: «Lời này: Dối trá −2 · nghiệp Vọng ngữ». |
| AC-2 | Việc ác `p = 3` (sát sinh, trộm cắp) cần **xác nhận hai lần** (chọn → hộp «Con chắc chứ?» có nút «Không» được chọn sẵn). |
| AC-3 | Hành động **không cố ý** (đi giẫm cỏ, va vào NPC, rơi đồ) không bao giờ thành việc ác. |
| AC-4 | Việc ác trong **Tà Lộ** (05-12) ghi như thường **và** sinh Nợ Âm riêng. |
| AC-5 | Không có việc ác nào được thưởng Phúc Khí lớn hơn việc thiện tương đương (để không có «đường đen sinh lời»). Ngoại lệ duy nhất là Âm Bài, có Nợ Âm công khai. |
| AC-6 | Không có quá «từ lá số». Lá số dễ vướng gì (`getYeguoForChart`) chỉ dùng để **nhắc** (05-05 §3), không bao giờ tạo dòng quá. |

---

## 4. Ba mốc Liễu Phàm

### 4.1 Điều kiện

| Mốc | Công hữu hiệu ròng | Điều kiện thêm | Nhiệm vụ mở |
|---|---|---|---|
| Nguyện Thứ Nhất · Gieo Hạt | ≥ 300 | đã làm CQ-MD-72 «Lập chí» | CQ-MD-77 |
| Nguyện Thứ Hai · Đề Danh | ≥ 600 | ≥ 7 trong 10 hạnh `TEN_THIEN` có ít nhất huy hiệu đồng | CQ-MD-78 |
| Nguyện Thứ Ba · Khiêm Đức | ≥ 1.000 | ≥ 60 dòng âm thiện trong sổ; ≥ 30 lần khiêm (05-01 §3.6) | CQ-MD-79 |

Điều kiện thêm của mốc 2 và 3 bám đúng hai chữ của *Tứ Huấn*: tích thiện phải **đủ loại** (积善之方) và phải **khiêm** (谦德之效). Ai chỉ cày một loại việc sẽ đạt số nhưng chưa đạt mốc — Vân Cốc nói rõ thiếu gì.

### 4.2 Nhịp dự kiến

| Kiểu người chơi | Công hữu hiệu trung bình / ngày | Mốc 300 | Mốc 600 | Mốc 1.000 |
|---|---|---|---|---|
| Ghé thăm (15 phút / ngày, 4 ngày / tuần) | 3 | ~ ngày 175 | ~ ngày 350 | ~ ngày 580 |
| Đều đặn (30–45 phút / ngày) | 5 | ~ ngày 60 | ~ ngày 120 | ~ ngày 200 |
| Chuyên cần (1,5 giờ / ngày) | 9 | ~ ngày 34 | ~ ngày 67 | ~ ngày 112 |
| Trần tuyệt đối (15 / ngày mỗi ngày) | 15 | ngày 20 | ngày 40 | ngày 67 |

Mốc 1.000 rơi vào khoảng **một mùa (năm can chi)** với người đều đặn — đúng nhịp «mùa → nhiều mùa» của tầng Cải Mệnh. Người chơi ít giờ vẫn tới mốc 1 trong nửa năm.

### 4.3 Sau khi đạt

- Đại Nguyện **không mất** (05-01 §4.3) dù sau đó công ròng âm.
- Tiếp tục ghi sổ bình thường. Sau mốc 1.000: mỗi **+500** công hữu hiệu ròng thêm một «hạt sen» trên khung tên (thẩm mỹ, không giới hạn).
- Liễu Phàm sau mốc 10.000 vẫn ghi sổ đến cuối đời; câu Vân Cốc: «Sổ không có trang cuối.»

---

## 5. Lời nhận xét của sổ

### 5.1 Hai cửa sổ

| Cửa sổ | Đầu vào `meritLedger` | Dùng ở |
|---|---|---|
| **Bảy ngày** | các dòng 7 ngày gần nhất (cả hữu hiệu lẫn không; quá đã sửa **không** đưa vào) | lời đầu trang sổ, thư tuần của Vân Cốc |
| **Đời** | toàn bộ dòng (quá đã sửa không đưa vào) | trang tổng kết, Phán quan Phong Đô đọc |

Ngưỡng `verdict` của app tính trên điểm thô (net ≥ 10 là «tích đức tốt»). Với cửa sổ 7 ngày, người đều đặn đạt khoảng 35 công → phần lớn tuần sẽ «Tích đức tốt». Đó là chủ ý: sổ khuyến khích, không làm khó.

### 5.2 Cách hiện `verdict`

Hiện **nguyên văn** app ở dòng nhỏ dưới tiêu đề (trụ cột T5), kèm một câu Vân Cốc viết tay (nội dung game) theo mức:

| `verdict` (app) | Câu Vân Cốc (một trong 3, xoay vòng) |
|---|---|
| ★ Tích đức tốt — đang chuyển quỹ đạo | «Tuần này con đi đều. Quỹ đạo đổi từ những bước đều như thế.» · «Thầy đọc sổ con mà vui.» · «Nhớ: việc thiện không phải để đọc cho thầy nghe.» |
| Tích tiểu thiện — tiếp tục | «Ít mà thật còn hơn nhiều mà vội.» · «Một hạt mỗi ngày, cuối mùa thành bao.» · «Tuần sau thêm một việc cho người lạ.» |
| ⚠ Quá nặng hơn công — CẢI QUÁ | «Sổ đang nghiêng. Không sao: biết nghiêng là biết đường dựng.» · «Lật lại trang có mực đen, xem sửa được dòng nào.» · «Cải quá có ba bậc: sửa việc, sửa lý, sửa tâm. Con bắt đầu từ việc.» |
| Cân bằng — hãy bắt đầu tích thiện | «Trang còn trắng. Trắng thì viết được.» · «Hôm nay một việc thôi.» · «Đi xuống bếp am, ông bếp đang cần người gánh nước.» |

**Về câu «3 cấp tâm lý事» của app:** ý là *Tứ Huấn* dạy cải quá ở ba mức — từ việc (事), từ lý (理), từ tâm (心). Game không sửa chuỗi app; câu Vân Cốc thứ ba trong hàng «CẢI QUÁ» giải nghĩa.

### 5.3 Không bao giờ

- Không xếp hạng **công ghi sổ** công khai (chỉ xếp **Đạo Hạnh** và số mốc). Tránh thi đua làm thiện để khoe.
- Không hiện «quá» của người chơi khác.
- Không gửi thông báo đẩy kiểu «Hôm nay bạn chưa làm việc thiện!». Chỉ nhắc trong game khi người chơi mở sổ.

---

## 6. Sổ đời thực (tùy chọn, mặc định tắt)

### 6.1 Mục đích

Canon §5.3: người chơi tự ghi việc thiện ngoài đời như Liễu Phàm ghi sổ, **không thưởng chỉ số**, chỉ có biểu đồ cá nhân và câu nhắc của Vân Cốc. Mục tiêu: nối thói quen trong game ra đời thật **mà không** biến việc thiện thật thành cày điểm.

### 6.2 Đặc tả

| Hạng mục | Quy định |
|---|---|
| Bật | Cài đặt › Sổ Mệnh › «Ghi sổ đời thực». Mặc định **tắt**. Bật có màn giải thích một trang: «Sổ này chỉ của con. Không ai chấm. Không có thưởng.» |
| Lưu ở đâu | **chỉ trên máy** (localStorage nhánh riêng `huyenquan:v1:journal`), không đồng bộ máy chủ, không vào MMO, không vào AI |
| Một dòng gồm | ngày; loại (chọn từ 10 mục thiện của `CONG_QUA` **hoặc** «khác»); ghi chú tự do ≤ 280 ký tự (tùy chọn) |
| Không có | điểm, số công, Đạo Hạnh, Phúc Khí, huy hiệu, thứ hạng, chia sẻ |
| Có | biểu đồ đếm số dòng theo tuần (không theo điểm), lịch chấm; mỗi tháng một câu Vân Cốc dựa trên **số dòng** (không đánh giá nội dung) |
| Mục «quá» | **không có** ở sổ đời thực. Lý do: ghi lỗi thật dễ thành tự trách; game không có năng lực đồng hành an toàn với việc đó. Thay bằng ô «Hôm nay con muốn sửa điều gì?» — ghi tự do, không phân loại |
| Từ khóa khủng hoảng | nếu ghi chú chứa từ khóa tự hại / khủng hoảng (danh sách dùng chung với `anti-manipulation-data` / quy tắc §6.4 bản sơ đồ), hiện ngay thẻ hỗ trợ (đường dây nóng theo quốc gia, khuyên gặp chuyên gia). Không lưu cờ, không gửi đi đâu |
| Xóa | nút «Xóa toàn bộ sổ đời thực» (xác nhận một lần) — xóa hẳn khỏi máy |
| Xuất | xuất ra văn bản thuần (để người chơi tự giữ) |
| iOS | **có** (đây là nhật ký, không phải đoán vận) — tên gọi «Nhật ký thiện» |

### 6.3 Câu Vân Cốc hằng tháng (theo số dòng)

| Số dòng trong tháng | Câu |
|---|---|
| 0 | «Tháng này sổ đời con để trắng. Đời bận thì cứ bận. Thầy vẫn ở đây.» |
| 1–4 | «Mấy dòng con ghi, thầy không đọc, nhưng thầy biết con đã dừng lại để nhớ. Thế là quý.» |
| 5–14 | «Con ghi đều. Liễu Phàm ngày xưa cũng chỉ là một người ghi đều.» |
| ≥ 15 | «Nhiều rồi. Nhớ: ghi để thấy mình, đừng ghi để thấy mình giỏi.» |

---

## 7. Sổ chung: môn phái và máy chủ

### 7.1 Sổ công đức môn phái

- Môn phái (= đạo thống, tài liệu 10) có **sổ chung**: tổng công hữu hiệu của thành viên **trong tháng âm**.
- Dùng để: mở cấp đạo tràng (tài liệu 10 quy định), lễ cuối tuần, xếp «Môn Phái Tích Đức» tháng.
- Người chơi tu 3 đạo chia công cho đạo **đang ở thánh địa đó** lúc làm việc; nếu làm ở nơi trung lập (Huyền Thành) thì chia cho đạo chính.
- Chống cày: công của người chơi vào sổ môn phái **sau** luật CC (chỉ công hữu hiệu).

### 7.2 Sổ Thiên Mệnh (máy chủ, vĩ thanh)

- Canon Vĩ thanh: Thiên Mệnh Bàn được sửa bằng «tổng công đức của mọi người chơi trong mùa».
- Máy chủ cộng **công hữu hiệu ròng** của mọi người chơi trong năm can chi. Mốc chung (vd 1 triệu công) mở cảnh cuối mùa ở Côn Lôn cho **mọi người** đã đạt bậc 6.
- Người chơi Tà Lộ còn Nợ Âm: công của họ vẫn vào tổng (công là công), nhưng Nợ Âm cũng được hiển thị như «vết nứt» trên Thiên Mệnh Bàn — tổng Nợ Âm toàn máy chủ hiện ở chân bàn. Chủ ý: hồi đầu của một người làm bàn sáng hơn cho tất cả.

### 7.3 Việc thiện tập thể (sự kiện máy chủ)

| Sự kiện | Khi | DEED (05-04) | Công mỗi người tham gia |
|---|---|---|---|
| Sửa cầu đá giữa các vùng | sự kiện tuần (Chủ nhật, giờ cố định theo can chi ngày) | DEED-14x «Hưng kiến đại lợi» | 2 (Giúp người khó khăn), tối đa 1 lần / sự kiện |
| Phóng sinh tập thể Rằm | mùng 1 / Rằm | DEED-00x | 3, tối đa 1 lần |
| Phát cháo mùa đông | tháng Chạp | DEED-09x | 2 |
| Thắp đèn Vu Lan | 15/7 âm | DEED-12x | 1 (Đọc kinh) |

Công tập thể vẫn theo nhật hạn CC-1.

---

## 8. Giao diện Sổ Công Quá

### 8.1 Hình thức

- Cuốn sổ đóng chỉ, bìa vải chàm (khi đạt mốc 300: bìa lụa — thưởng của Nguyện Thứ Nhất).
- **Mỗi trang là một ngày.** Dòng thiện viết mực son, dòng quá mực đen, dòng quá đã sửa có nét gạch son và ghi «đã cải ngày …».
- Dòng không hữu hiệu (quá trần) viết mực son nhạt, cuối dòng chữ nhỏ «vô cầu» (làm không cầu báo).
- Lề phải mỗi trang: tổng công / quá của ngày, chấm hữu hiệu.

### 8.2 Các trang

| Trang | Nội dung |
|---|---|
| Hôm nay | các dòng hôm nay; thanh 15 công hữu hiệu; trần nhóm (CC-2) dạng 10 ô nhỏ |
| Tuần | `verdict` 7 ngày (nguyên văn app) + câu Vân Cốc; biểu đồ 7 cột thiện / quá |
| Đời | công ghi sổ, quá ghi sổ, công hữu hiệu ròng, ba chấm sen Đại Nguyện, thanh tới mốc kế |
| Thập Thiện | 10 hạnh, huy hiệu đồng / bạc / vàng |
| Mực đen | danh sách quá **chưa sửa**, mỗi dòng có nút «Xem cách sửa» → chuỗi sửa (05-05) |
| Sổ đời thực | chỉ hiện khi bật (§6) |

### 8.3 Lúc ghi sổ

- Khi một dòng thiện hữu hiệu được ghi: chữ son hiện nhẹ góc màn hình «+3 · Cứu người nguy cấp», kèm tiếng bút lông (tài liệu 12). Không có pháo, không có chuông thưởng to.
- Khi một dòng ác được ghi: chữ đen «−2 · Dối trá/lừa gạt» và một dòng nhỏ «có thể sửa — xem trong sổ». Không có âm thanh dọa.
- Dòng âm thiện: **không** hiện thông báo lúc làm (đúng nghĩa «ẩn»). Chỉ khi mở sổ mới thấy dòng «Làm thiện ẩn (âm chất)».

---

## 9. Kịch bản cảnh

```
[CẢNH CQ-MD-71.1 · Am Vân Cốc · sáng sớm, giờ Mão · sương núi]
(Vân Cốc ngồi bên bếp lửa, cuốn sổ chàm đặt giữa hai người.)
VÂN CỐC: Ba việc rồi. Con mở ra xem.
(Người chơi mở sổ. Ba dòng mực son. Dòng cuối của trang là chữ nhỏ của engine: «Tích tiểu thiện — tiếp tục».)
VÂN CỐC: Sổ này không phải để thầy chấm con. Sổ để con thấy mình. Liễu Phàm ghi sổ mười mấy năm, có năm trang đen nhiều hơn trang đỏ.
> Lựa chọn: ① «Vậy thầy ghi giùm con được không?» → [CQ-MD-71.2a]  ② «Con có phải ghi lỗi của mình không?» → [CQ-MD-71.2b]  ③ (lật trang trắng tiếp theo) → [CQ-MD-71.2c]

[CẢNH CQ-MD-71.2a]
VÂN CỐC: (cười) Thầy ghi thì là sổ của thầy. Việc con làm, sổ tự ghi. Còn câu con tự viết thêm thì để trống cũng được.
→ [CQ-MD-71.3]

[CẢNH CQ-MD-71.2b]
VÂN CỐC: Lỗi con chọn làm thì sổ ghi. Lỗi con không chọn, sổ không ghi. Mà ghi rồi vẫn sửa được. Mực đen gạch son là trang đẹp nhất trong sổ.
→ [CQ-MD-71.3]

[CẢNH CQ-MD-71.2c]
VÂN CỐC: Ừ. Trắng thì viết được.
→ [CQ-MD-71.3]

[CẢNH CQ-MD-71.3]
VÂN CỐC: Con muốn ghi một dòng cho riêng con không? Không ai đọc.
(Ô nhập tự do hiện ra, có nút «Để sau».)
(Kết thúc: CQ-MD-71 xong, B 15.)
```

```
[CẢNH THƯ-TUẦN · Hòm thư Sổ Mệnh · tối Chủ nhật]
(Thư giấy dó, nét bút Vân Cốc. Đầu thư là verdict 7 ngày nguyên văn.)
THƯ: «★ Tích đức tốt — đang chuyển quỹ đạo (theo Liễu Phàm)»
THƯ: Tuần này con cứu được một người ở bến Cùng Thông, bố thí hai lần ở Bút Tháp, và có một việc con làm mà không ai biết. Thầy thích việc thứ ba nhất.
THƯ: Tuần sau, nếu tiện, con lên gánh nước giúp ông bếp. Ông ấy không nhờ ai bao giờ.
(Nút: «Đánh dấu đã đọc». Không có phần thưởng khi đọc thư.)
```

```
[CẢNH CQ-MD-77.1 · Am Vân Cốc · Rằm, giờ Dậu · trăng lên]
(Sân am. Ở góc sân có một khoảng đất người chơi chưa từng để ý.)
VÂN CỐC: Ba trăm. Liễu Phàm ba nghìn việc thì có Nguyên Khang. Con ba trăm thì có cái này.
(Ông đưa một hạt giống nhỏ.)
VÂN CỐC: Gieo đi. Nó lớn theo mùa. Có năm nó không ra hoa — con đừng trách nó.
> Lựa chọn: ① (gieo hạt) → [CQ-MD-77.2]  ② «Hạt gì vậy thầy?» → [CQ-MD-77.1b]

[CẢNH CQ-MD-77.1b]
VÂN CỐC: Hạt người ta gieo cho người sau ngồi mát. Con gieo đi rồi biết.
→ [CQ-MD-77.2]

[CẢNH CQ-MD-77.2]
(Hoạt ảnh gieo hạt. Mầm nhú. Danh hiệu «Lập Mệnh». Bìa sổ đổi thành lụa.)
VÂN CỐC: Từ hôm nay con nhận được người theo học. Đừng dạy họ cái con giỏi. Dạy cái con đã sửa được.
(Mở: nhận đệ tử từ bậc 3.)
```

```
[CẢNH CQ-MD-78.1 · Văn Miếu, sân Thiên Quang Tỉnh · giờ Thìn · nắng]
(Dãy bia tiến sĩ lịch sử ở hai bên giếng. Ở cuối dãy, tách riêng, một tấm bia đá mới của máy chủ: «Bia Đạo Hạnh».)
TẾ TỬU: Liễu Phàm sáu nghìn việc thì đỗ tiến sĩ. Trò sáu trăm, không đỗ gì cả — nhưng đá này nhớ tên trò.
TẾ TỬU: Bia kia (chỉ dãy bia cũ) là bia của người xưa, đừng ai khắc thêm. Bia này của các trò.
(Tên người chơi được khắc. Danh hiệu «Cải Quá».)
TẾ TỬU: Khắc tên rồi thì sống cho xứng tên. Đó mới là thi.
```

```
[CẢNH CQ-MD-79.1 · Côn Lôn Thiên Trì · bình minh · mây dưới chân]
(Chỉ khi đã bậc 6. Nếu chưa bậc 6, cảnh thay bằng CQ-MD-79.0 ở Am Vân Cốc: Vân Cốc hẹn «lên trên kia rồi thầy nói nốt».)
VÂN CỐC: Một nghìn. Con có nhớ hôm đầu, con hỏi thầy ghi giùm sổ?
> Lựa chọn: ① «Con nhớ.» ② «Con quên rồi.»
VÂN CỐC: (với ①) Giờ thì sổ của con. (với ②) Quên là tốt. Việc thiện nhớ lâu quá thành cái túi nặng.
VÂN CỐC: Tám chữ của con vẫn vậy, không đổi một nét. Nhưng người mang tám chữ ấy đã khác.
(Khung tên «Mệnh Do Ta Tạo». Danh hiệu «Tích Thiện · Khiêm Đức». Đoạn kết theo chí đã chọn ở CQ-MD-72 — tài liệu 03 viết.)
```

---

## 10. Ca biên

| Ca | Xử lý |
|---|---|
| Đồng hồ máy khách bị chỉnh | nhật hạn công tính theo giờ máy chủ khi online; khi offline, dòng sổ ghi tạm «chờ xác thực», máy chủ chấm lại lúc đồng bộ (05-14 §4) |
| Người chơi offline cả ngày nhưng có sự kiện thế giới | không có công (không có việc) |
| Đổi lá số | sổ **không** đổi (sổ là việc làm, không phải lá số) |
| Quá đã sửa rồi lại phạm cùng việc với cùng NPC trong 7 ngày | dòng mới ghi bình thường; chuỗi sửa lần này đòi **thêm một bước** (05-05 §5.3) |
| Công hữu hiệu ròng âm khi đã đạt mốc | Đại Nguyện giữ; mốc kế tính từ công ròng hiện tại |
| `meritLedger` nhận mảng rỗng | `verdict` «Cân bằng — hãy bắt đầu tích thiện» — hiện bình thường |
| Môn phái giải tán | sổ cá nhân không ảnh hưởng; sổ môn phái lưu trữ |

---

## 11. Checklist nghiệm thu 05-03

- [ ] Mọi dòng sổ dùng `action` nguyên văn `CONG_QUA[*].a`; test 19 mục cho `net` đúng `±p`.
- [ ] Nhật hạn 15 công / ngày; trần nhóm CC-2; cùng NPC 1 lần / 24 giờ.
- [ ] Không có cách nào để người chơi tự tạo «nhu cầu» rồi cứu (CC-5): thử đẩy NPC, thử dụ NPC vào chỗ nguy — hệ chặn.
- [ ] Việc ác chỉ sinh từ lựa chọn có thẻ hậu quả; p = 3 cần xác nhận hai lần.
- [ ] Ba mốc 300 / 600 / 1.000 dùng **công hữu hiệu ròng**; điều kiện thêm của mốc 2, 3 hoạt động.
- [ ] `verdict` hiện nguyên văn; không xếp hạng công công khai.
- [ ] Sổ đời thực: tắt mặc định, chỉ lưu máy, không điểm, có thẻ hỗ trợ khi gặp từ khóa khủng hoảng, xóa được.
- [ ] Âm thiện không bật thông báo lúc làm.
