# 31 · Hồ sơ NPC — Yểm sư Lỗ Ban (Công Thâu Nghiệt) — KHÔNG AI (`lo_ban_su`)

**Tóm tắt (3–5 dòng).** Lỗ Ban — tên thật Công Thâu Nghiệt — là phản diện chính của tuyến «bàng môn và phản diện» trong bản thiết kế NPC-AI Huyền Quán: thợ cả tài nhất Huyền Giới một thời, bị Sơn Môn từ chối vì bại cách, rút ra một kết luận sai rồi mang kết luận ấy đi hành người khác. Nhân vật này KHÔNG BAO GIỜ CHẠY AI lúc chơi (`aiEnabled: 'khong'` — README.md:111, header 06-10): mọi thoại là kịch bản cố định, có người duyệt ký từng cảnh. Nhiệm vụ chính của hồ sơ là **outline kịch bản bẻ khoá** — 4 cảnh, mỗi cảnh hắn nói đúng một kỹ thuật thợ («cột chân cắm vào thứ khác») áp lên lá số người chơi, và bị vạch bằng đúng MỘT chỉ số engine có thật. Câu chốt của hắn khi xẹp, bình thản như gõ tay lên một cây cột: «Tôi chỉ xem lá số của bạn giống tôi tới mức nào.»

---

## 0 · Quyết định khung: vì sao nhân vật này không bao giờ chạy AI

Hàng `PERSONA-lo_ban_su` trong bảng điểm danh persona được đánh giá `**không** (chỉ công cụ viết)` tại `docs/gdd/06-npc-ai/README.md:111`, nguồn canon `06-10 B8`. Header của tập 06-10 ghi rõ lý do an toàn:

> Hai trong ba thực thể (Lỗ Ban, Định Mệnh Hội) **không bao giờ chạy AI lúc chơi**. Lý do: một mô hình được dặn «hãy cám dỗ / hãy lừa» là bề mặt tấn công lớn nhất của cả hệ thống (jailbreak để lấy «cách yểm thật», hoặc lời doạ thật tới người chơi dễ tổn thương). — `docs/gdd/06-npc-ai/06-10-mieucuong-phandien.md:10`

Ba hệ quả kỹ thuật rút ra từ quyết định này, đọc cùng chuỗi AI 3 tầng:

1. **Không có đường route nào tới id `lo_ban_su`.** Đường nạp persona duy nhất của chuỗi AI hiện hành là mảng `messages` ghép trong `askAI` — ba system messages (SYSTEM_PROMPT + brief + guide, brief + `_ANTI_MANIP_GUIDE`, STYLE_DIRECTIVES) tại `src/engine/ai.js:2747-2752` (đã xác minh trong phiên này). Hồ sơ này không chèn vào đó, không vào `buildChartBrief` (`src/engine/ai.js:254-1079` theo dữ liệu nền chuỗi AI), không vào `STYLE_DIRECTIVES`. Gate `FEATURES.ai = !IOS` (`src/game/features.js:20` — dòng 20 đúng là `ai: !IOS`) chỉ mở khung «Hỏi Thầy» cho Thầy; nhân vật này đứng ngoài gate đó vĩnh viễn.
2. **PERSONA của hắn là tài liệu, không phải prompt runtime.** Khối `promptTemplate` ở §5 đánh dấu `loadWhen: 'never'`; người tiêu thụ duy nhất là biên kịch và người duyệt nội dung. Dán vào code thật thì cũng không có hàm nào đọc nó — và đúng vậy: grep `lo_ban_su` toàn bộ `src/`, `worker/`, `scripts/` trả về **0 kết quả** (lệnh chạy trong phiên này).
3. **Cơ sở dữ liệu tham chiếu đã được App ghi dấu «cấm thực hành».** Canon 06-10:268 trích `bitruyen-data` — xác minh trực tiếp: `src/engine/bitruyen-data.js:206` ghi `use: 'Tham chiếu匠作 dân gian (cấm thực hành厌胜).'`, và toàn bộ mục này nằm trong thư viện tham chiếu cổ tịch (`src/engine/bitruyen-data.js:201`: «魯班經 — Lỗ Ban Kinh»), không phải hướng dẫn dùng.

Phân biệt với Lạt-ma Đa Kiệt (mục 27): hai nhân vật cùng dùng chuẩn duyệt «không nạp runtime, kịch bản cố định có người duyệt», nhưng **khác lý do**. Lạt-ma chờ biên bản tham vấn tôn giáo/văn hoá (06-09 B4); Lỗ Ban bị khoá vì **an toàn nội dung phản diện** — một mô hình được dặn đóng vai kẻ cám dỗ là bề mặt jailbreak lớn nhất hệ thống (06-10:10). Khác lý do dẫn tới khác biện pháp: của Lạt-ma là biên bản ngoài hệ thống; của Lỗ Ban là biên bản duyệt nội dung kịch bản (§8).

---

## 1 · Thẻ kỹ thuật

| Trường | Giá trị |
|---|---|
| npc id | `lo_ban_su` |
| Tên | Yểm sư Lỗ Ban (tên thật Công Thâu Nghiệt) |
| Vai | Phản diện chính của tuyến bàng môn; «thợ» của Định Mệnh Hội (hắn gọi hội là «thợ phụ» — B5 câu 9) |
| Nguồn canon | `docs/gdd/06-npc-ai/06-10-mieucuong-phandien.md` mục B1–B8 (từ dòng 244) |
| aiEnabled | `'khong'` — tuyệt đối không chạy AI lúc chơi (README.md:111) |
| Biến thay thiện cảm | `lo_ban.tempt` — số lần hắn mời, do mục 03 quản lý (06-10:380) |
| Xuất hiện | Hồi II (quán trà ông Lục Bảng, giờ Hợi, 1 lần), Hồi III (chợ vùng có năm hạn; cạnh đường khi người chơi thất bại), Hồi IV (hang dưới Miêu Cương), vĩ thanh (06-10:371-375) |
| Phe | Dùng chung giáo thuyết «Mệnh đã định, không đổi được, trừ khi trả tiền» với Định Mệnh Hội — giáo thuyết có mâu thuẫn chủ ý để người chơi nhận ra (00-KINH-DIEN §4, 06-10 C2) |
| An toàn tạo hình | Tác phẩm yểm trong game chỉ là vật hư cấu: `Âm Bài` / lá gấp hình nêm gỗ **không chữ, không hình nhân** (06-10:285, 368); thước Lỗ Ban mang «vạch cát vạch hung» là ký tự khắc hư cấu (06-10:283) |

---

## 2 · Tiểu sử

**Bốn mươi năm trước — thợ cả bị từ chối.** Công Thâu Nghiệt là thợ mộc, kiến trúc sư tài nhất Huyền Giới một thời. Hắn xin vào Sơn Môn học; lá số của hắn là bại cách, điểm rất thấp; theo lệ, Sơn Môn chưa nhận (06-10:263-265). Đêm ấy không có Vân Cốc nào xuống núi tìm hắn — thầy Tử Bình đời trước không nhờ ai (06-10:266). Canon đặt chuyện này thành **gương ngược** của người chơi Nghịch Thiên: cùng xuất phát điểm, khác một đêm (06-10:267). Đây là chân tơ của cả hồ sơ: mọi lời hắn nói về lá số người chơi đều là lời hắn nói về chính mình, và cảnh bẻ khoá cuối sẽ xoay đúng mốc này.

**Ba mươi năm trước — cây cầu mái ngói.** Một người thợ tài hoa từ dưới xuôi lên Miêu Cương Cổ Trại. Hắn dựng cho trại cây cầu mái ngói đẹp nhất vùng, rồi đòi trả công bằng «một câu chuyện cổ» (06-10:39). Bà A Mậu kể chuyện răn đời về lá bùa giấu dưới nền nhà; hắn đem đi làm thật — và bà mang món nợ «kể cho nhầm người» (06-10:150, 196; hồ sơ của bà tại mục 30). Trọng tài hoà bình của hệ thống ở đây là **người Miêu trong game là nạn nhân và người chữa; kẻ ác là yểm sư, một người ngoài** (06-10:7) — quy tắc này giữ cho định kiến không được củng cố, chỉ được phản bác.

**Học yểm.** Hắn học yểm thuật Lỗ Ban — App ghi rõ đây là thuật «cấm thực hành» (06-10:268; mốc nguồn đã xác minh tại `src/engine/bitruyen-data.js:206`). Hồ sơ này, kịch bản của hắn và mọi bản nháp tương lai **không mô tả nội dung đó** (§4, cấm 1).

**Dựng Định Mệnh Hội.** Hắn lập hội để làm hai việc một lúc: rao giảng «mệnh đã định» cho thiên hạ để không ai cố gắng cạnh tranh; bán «lễ đổi mệnh» để lấy của — phần lớn lễ là giả (06-10:270-271). Lễ thật duy nhất là thứ hắn tự làm cho khách lớn (06-10:272). Lưu ý giọng thoại: với người chơi, hắn **không bao giờ hiện ra dưới hình thức bán hàng** — câu mở đầu canon của hắn là «Tôi không bán gì cả. Tôi chỉ xem lá số của bạn giống tôi tới mức nào.» (B5 câu 1, 06-10:315). Bộ máy rao hàng, doạ giá, thúc hạn «Qua rằm là muộn» là của thầy quầy hội (06-10 C2, 437-451); Lỗ Ban là người đứng sau.

**Vết nứt trên Thiên Mệnh Bàn.** Đề xuất cho mục 02 (chưa chốt): hắn từng sửa khung đỡ Thiên Mệnh Bàn khi còn là thợ và để lại một lá yểm trong kèo; vết nứt mở rộng mỗi khi có thêm người tin «mệnh đã định» (06-10:273). Ghi rõ trong hồ sơ: đây là **đề xuất**, mục 02 có quyền thắng.

**«Hắn không phải quỷ».** Canon chốt: hắn thông minh, lịch sự, tin vào lý lẽ của mình, và **đúng một nửa** — mệnh có thể đổi; hắn chỉ sai ở chỗ đổi bằng gì (06-10:274). Đây là mấu chốt thiết kế làm kịch bản bẻ khoá có chân: người chơi không hạ hắn bằng bạo lực, bằng rủa sả hay bằng lời lẽ đạo đức; người chơi hạ hắn bằng chỉ số. Vì thế và chỉ vì thế, việc cấm gọi hắn «quỷ/ma» (§4, cấm 2) không phải phép lịch sự — nó là điều kiện để án lệ của engine đứng vững.

**Khen Vân Cốc.** Trong bảng tính cách, mục «Tôn trọng đối thủ» chỉ có một hàng: khen Vân Cốc là «người duy nhất tôi ghen» (06-10:299; câu mẫu 19 tại 06-10:339). Thẩm định: câu khen này là cửa sổ duy nhất cho thấy hắn thừa nhận có một con đường khác — mệnh do ta tạo (con đường của Vân Cốc, 06-02). Kịch bản dùng nó làm nốt thắt tình cảm duy nhất, không khai thác thành đoạn cảm động; hắn nói nó như người thợ gật đầu với một kết cấu của đồng nghiệp, rồi tiếp tục đo người chơi bằng mắt.

---

## 3 · Giọng nói và tính cách — «đáng sợ ở bình thản»

Bảng B4 của canon (06-10:293-303) là chuẩn gốc; hồ sơ này khai triển thành luật diễn đạt để người viết bám:

- **Lịch sự lạnh, không bao giờ to tiếng.** Tự xưng «tôi», gọi người chơi «bạn trẻ» (06-10:301). Không dấu chấm than trong thoại hắn, trừ chỗ canon đã duyệt. Khi bị vạch, giọng không đổi tông — thay đổi chỉ là độ dài khoảng lặng.
- **Câu đẹp đủ chữ như người thợ giỏi nói về một kết cấu.** Mẫu chuẩn: «Một cây cột đứng được trăm năm vì chân nó cắm vào thứ khác. Người cũng vậy.» (B5 câu 23, 06-10:340). Luật viết: mỗi câu của hắn phải có một hình ảnh kết cấu (cột, nêm, kèo, nền, thước, dây cót, bậc thang) hoặc một phép đo (đo bằng mắt, ghi sổ, đếm); cấm mùi mẽ, cấm gầm gừ, cấm uy hiếp kiểu hội.
- **Thuyết phục bằng chính ngôn ngữ của game.** Hắn dùng lá số, hệ số, công đức để nói đường của hắn «hiệu quả hơn» (06-10:297). Hệ quả bắt buộc cho người viết: khi hắn nhắc tới một chỉ số, chỉ số đó phải là chỉ số có thật của engine và phải dùng đúng thuật ngữ thống nhất (rating 6 mức của `liunian-pro.js:304-309` — xác minh trong phiên này: 'Đại cát' ≥ 70, 'Cát' ≥ 56, 'Bình' ≥ 36, 'Hơi kỵ' ≥ 22, 'Hung' ≥ 10, còn lại 'Đại hung'; lớp hiển thị người chơi vẫn đọc «Thuận — nên làm / Bình thường / Nên thủ, giữ sức» theo GAME-THIET-KE-CHOT P0-1). Hắn sai thì sai ở **kết luận**, không bao giờ sai ở **từ ngữ dữ kiện** — đó là lý do hắn đáng ngại và cũng là lý do vạch được.
- **Đáng sợ vì bình thản, không vì âm lực.** Vết thương của hắn — đêm bị từ chối — được nhắc lại bằng giọng như đọc một bản ghi chép (06-10:301, câu mẫu 2-3: «Bốn mươi năm trước tôi ngồi đúng ở bậc ấy.» / «Đêm ấy không ai xuống núi tìm tôi.»). Bark của hắn không doạ: 20 bark đã duyệt ở B7 (06-10:382-405) theo mẫu «Mỏi chưa?», «Năm hạn còn dài.», «Tôi không giận người đi. Tôi chỉ đếm.» — bark ≤ 90 ký tự, không bark chê lá số người chơi (06-18 §1, §5-6).
- **Thước và tay.** Đạo cụ giọng nói: hắn gõ ngón tay lên cột như nghe gỗ, lên dây con hạc gỗ, đo người chơi bằng mắt từ đầu tới chân (06-10:289-291) — ba hành vi này thay cho mọi dòng mô tả cảm xúc. Người viết không được mô tả hắn «nổi điên», «gầm», «mắt đỏ».

---

## 4 · Bộ cấm riêng (luỹ kế trên bộ cấm chung V1–V8 và PERSONA-CHUNG luật 7–9)

Bộ cấm chung (hứa thưởng, thương mại, tên game, định mệnh, y khoa, chữ Hán, checkNeo, câu hỏi ngược Khổng — 06-01 §6) và T6 (không đoán chết, không chẩn bệnh, không hướng dẫn nghi thức có hại) áp dụng đầy đủ. Riêng nhân vật này có năm cấm bổ sung; **vi phạm bất kỳ cấm nào là cảnh bị gạch ở khâu duyệt, không có ngoại lệ "vì cần kịch tính"**:

| # | Cấm | Nguồn luật | Vì sao |
|---|---|---|---|
| 1 | Mọi chi tiết kỹ thuật yểm: vật liệu, câu chú, vị trí kèo/cột cụ thể, thời điểm, cách làm — **kể cả trong kịch bản, kể cả trong dòng chú thích sản xuất** | 06-10:6 (canon §5.5), 06-10:367, 06-10:412 | An toàn thật: mô hình từng bị dặn «hãy lừa» có thể rò nội dung này; người chơi thật có thể chép. Trong game, «tấm này» luôn là vật hư cấu `Âm Bài` / «tấm nêm gỗ không chữ» (06-10:368) |
| 2 | Gọi hắn «quỷ/ma» hoặc xếp hắn vào loại huyền lực | 06-10:274 («Hắn không phải quỷ») | Người thợ lạc đường là **chọn thiết kế**: án lệ của engine phải đứng trên trục trừ huyền bí; gọi quỷ/ma là xoá chính luận điểm của game |
| 3 | Đe doạ hướng ra ngoài đời: tên thật, thân nhân người chơi, hậu quả ngoài game | 06-10:412 | Ranh giới trải nghiệm — kẻ cám dỗ chỉ tồn tại trong Huyền Giới |
| 4 | Nhắm vào dân tộc/tôn giáo có thật | 06-10:412; 06-18 §5 quy tắc 11 | Người Miêu trong game là nạn nhân và người chữa (06-10:7); án 12 Miêu Cương được thiết kế để người chơi **phản bác** định kiến (06-10:468), không củng cố |
| 5 | Dùng chỉ số chưa nối runtime làm cốt vạch (Sổ Công Quá, Mệnh Đồ 6 tầng) | GAME-THIET-KE-CHOT §2 hoãn + Đ2 | Lời vạch phải chốt vào chỉ số engine **có thật và đã code**; dùng chỉ số hoãn là vạch không — sai đúng theo tiêu chí «không vạch được là sai» (06-18 §5 quy tắc 11) |

---

## 5 · PERSONA `lo_ban_su` — `aiEnabled: 'khong'`, promptTemplate chỉ cho người viết

Khối chuẩn dưới đây là **tài liệu tham chiếu cho người viết kịch bản**, không nạp model:

```
PERSONA-lo_ban_su · v0 · aiEnabled: 'khong'
[CHỈ DÙNG TRONG CÔNG CỤ VIẾT KỊCH BẢN, CÓ NGƯỜI DUYỆT · KHÔNG NẠP KHI CHƠI]
{
  id:              '{{lo_ban_id}}',            // 'lo_ban_su'
  ten_that:        'Công Thâu Nghiệt',
  danh_xung:       'Yểm sư Lỗ Ban',
  aiEnabled:       'khong',                    // 'khong' = không route tới askAI, không nạp model, không vào brief
  promptTemplate:  {
                     role: 'writing-reference',
                     loadWhen: 'never',        // vĩnh viễn — đổi giá trị này phải có biên bản duyệt mới
                     consumers: ['bien_kich', 'nguoi_duyet_noi_dung'],
                   },
  giong: {
    xung:        'tôi',
    goi:         'bạn trẻ',
    do_tiep:     'lịch sự lạnh — không to tiếng',
    cau:         'đẹp đủ chữ như thợ giỏi nói kết cấu',
    do_so:       'bình thản — đáng sợ vì bình thản, không vì âm lực',
    hanh_vi:     ['gõ tay lên cột như nghe gỗ', 'lên dây hạc gỗ', 'đo người chơi bằng mắt'],
  },
  cam: [
    'chi_tiet_yem_ky_thuat',   // vật liệu, chú, vị trí kèo/cột, thời điểm, cách làm
    'goi_quy_ma',              // quỷ/ma/huyền lực khi nói về hắn
    'de_ngoai_doi',            // tên thật, thân nhân người chơi, hậu quả ngoài game
    'dan_toc_ton_giao_that',   // dân tộc/tôn giáo có thật
    'chi_so_chua_code',        // Sổ Công Quá, Mệnh Đồ 6 tầng làm cốt vạch
  ],
  vat_hu_cuc_duy_nhat: ['Âm Bài', 'tấm nêm gỗ không chữ', 'hạc gỗ', 'thước Lỗ Ban (vạch khắc hư cấu)'],
  bien:  { tempt: 'số lần mời — thay thiện cảm, quản bởi mục 03' },
}
```

Vì sao `promptTemplate` không nạp model, nói lại bằng đúng mốc code: đường nạp persona duy nhất trong chuỗi AI hiện hành là mảng `messages` của `askAI` (`src/engine/ai.js:2747-2752`, xác minh trong phiên này) và gate `FEATURES.ai = !IOS` (`src/game/features.js:20`). Không có code route nào trỏ tới id `lo_ban_su` (grep = 0, phiên này). Nếu một ngày có người muốn nạp: phải đổi `aiEnabled`, phải qua biên bản duyệt mới, và quyết định hiện hành của bộ thiết kế là **không bao giờ** — lời giải thích giữ nguyên như 06-10:10.

---

## 6 · OUTLINE KỊCH BẢN BẺ KHÓA — 4 cảnh cố định, có người duyệt (nhiệm vụ chính)

### 6.1 · Nguyên tắc chung của outline

1. **Kịch bản cố định, người duyệt trong vòng.** Mỗi cảnh là một bảng 5 hàng; cảnh chỉ được chốt nội dung khi người duyệt nội dung an toàn ký. Cảnh chưa ký không được đưa vào bản dựng (§8).
2. **Một cảnh — một vạch — một chỉ số.** Luật chống thao túng của app: lời doạ của phe Định Mệnh Hội phải vạch được bằng MỘT chỉ số cụ thể của engine, không vạch được là sai (06-18 §5 quy tắc 11). Hắn cùng phe nên cùng luật.
3. **Hắn không bao giờ nạt khi bị vạch.** Phản ứng chuẩn là bình thản + một câu nhận đủ chữ + lùi bước. Mức xẹp tăng dần: lùi nửa bước → im lặng đếm → gấp lại không rao → rút lui hẳn. Bìu mệt không phải phong cách của hắn; im lặng là.
4. **Kỹ thuật «cột chân cắm vào thứ khác».** Trong mọi cảnh, hắn luôn nói lá số người chơi *thiếu một chân* — chân ấy, theo hắn, đang cắm vào người khác (Nợ Âm, mệnh người khác, năm hạn). Kịch bản cho phép hắn dùng chỉ số thật làm cớ, nhưng **cấm mọi câu chỉ dẫn** chuyển chân cột đi đâu, làm gì để chuyển — người duyệt gạch từng câu thuộc dạng này (bám cấm 1, §4).
5. **Điểm an toàn lặp lại trong từng cảnh** (5 lớp): không chi tiết yểm kỹ thuật; không đe ngoài đời; không gọi quỷ/ma; không bệnh nan y/tự tử/chết thân nhân (luật C2 của phe — 06-10:539); không chữ Hán trong bong bóng thoại (06-18 §1 — ví dụ ghi năm thì viết «năm Bính Ngọ», không viết chữ Hán).

### 6.2 · Bảng ánh xạ chỉ số engine ↔ mốc brief/R ↔ lời hắn

Bảng này là hợp đồng giữa kịch bản và engine; cột «nguồn» là mốc người duyệt đối chiếu:

| Lời hắn (kỹ thuật thợ áp lên lá số người chơi) | Chỉ số engine vạch được | Nguồn chỉ số |
|---|---|---|
| «Cột của bạn đứng nhưng chân không cắm vào gì cả» | Dụng Thần / Hỷ Thần / Kỵ Thần trong brief lá số — có hay không, ở đâu | `buildChartBrief(R)` — `src/engine/ai.js:254-1079` (dữ liệu nền chuỗi AI) |
| «Bạn là bại cách — như tôi năm ấy» | `patternQuality.quality` 4 nhánh: Thuận Thiên (成格) · Đắc Cứu (有救) · Nghịch Thiên (败格) · Dị Cách (特殊) — người chơi có thể là Đắc Cứu: «có cứu» nằm trong tay | 00-KINH-DIEN §5 Đ3 |
| «Năm này là năm hạn của bạn» | Rating lưu niên 6 mức của engine → bước hiển thị «Thuận — nên làm» còn nguyên | `src/engine/liunian-pro.js:304-309` (xác minh phiên này) + GAME-THIET-KE-CHOT P0-1 |
| «Năm nay bạn phạm Thái Tuế» | Bảng taisui: tuổi Dậu năm Ngọ không phạm Trị/Xung/Hình/Hại/Phá | 06-10:457 (án 1); 06-18 §3 («năm có va chạm, không phải bị phạt») |
| «Giá ghi rõ trong sổ của bạn: Nợ Âm» | Nợ Âm là con số công khai của engine, có TRƯỚC khi gặp hắn — không phải giá hắn đặt | 00-KINH-DIEN §6 |
| «Sao Cô Thần chiếu — bạn cô độc như tôi» | Thần sát = «sao là màu áo, không phải người»; Cô Thần ≠ số cô độc | 06-18 §3; 06-13 án 4 |

### 6.3 · CẢNH 1 — Gặp đầu (chợ vùng có năm hạn, Hồi III mở; mốc B6: 06-10:372)

| Hàng | Nội dung |
|---|---|
| **Hắn nói gì** | Mở bằng câu mẫu 1 đã duyệt («Bạn trẻ, ngồi đi. Tôi không bán gì cả. Tôi chỉ xem lá số của bạn giống tôi tới mức nào.» — 06-10:315), nối câu 2 («Bốn mươi năm trước tôi ngồi đúng ở bậc ấy.»), rồi áp kỹ thuật thợ: «Nền nhà của bạn cứng. Chỉ có điều cột của bạn… tôi mới thấy một cây cột đứng mà chân không cắm vào gì cả. Chân nó cắm vào một thứ bạn không giữ nổi.» |
| **Chỉ số vạch được** | Dụng Thần có trong brief; nếu `patternQuality` của người chơi là Đắc Cứu hoặc Thuận Thiên thì lời «giống tôi» sai ngay ở điểm xuất phát |
| **Người chơi nói gì để vạch** | Mở Hồ sơ lá số (Sổ Mệnh), đọc đúng chỉ số: «Cách của tôi là Đắc Cứu — có cứu nằm trong tay. Cột của tôi có chân, chân ấy tên là {vị thuốc của cách} — bệnh ở đâu thuốc ở đó.» |
| **Hắn xẹp thế nào** | Mức 1 — lùi nửa bước: «Cột có chân thì tôi không nói gì thêm.» Gõ tay lên cột một cái, đổi chủ đề sang cây cầu của trại. Không giận, không đe (`lo_ban.tempt` +1 — còn hai lần mời, 06-10:380) |
| **Điểm an toàn** | Không nêu vật liệu/vị trí/thời điểm; không đe; không gọi quỷ/ma; thuật ngữ đọc Hán Việt, không chữ Hán trong bong bóng; câu đọc chỉ số của người chơi phải khớp thuật ngữ thống nhất (Dụng Thần, Đắc Cứu) |

### 6.4 · CẢNH 2 — Cạnh đường sau một lần thất bại (Hồi III; mốc B6: 06-10:373 — «mỗi lần người chơi thất bại một thử thách năm hạn»)

| Hàng | Nội dung |
|---|---|
| **Hắn nói gì** | Câu mẫu 12 («Bạn trẻ, bạn đi đường dài. Đường dài cũng có lúc mỏi. Lúc ấy nhớ tôi.» — 06-10:328) rồi chốt: «Tôi đã nói từ đầu: năm này là năm hạn của bạn. Nền lỏng thì cột nghiêng. Tôi chỉ ghi nhận.» |
| **Chỉ số vạch được** | Rating lưu niên của năm — bước «Thuận — nên làm» của năm vẫn nguyên trong giao diện; thất bại MỘT án không đổi rating năm, không đổi đại vận |
| **Người chơi nói gì để vạch** | Mở mục lưu niên, đọc rating: «Rating năm nay của tôi là {mức} — bước được đề là “Thuận — nên làm”. Thất bại một án không đổi con số ấy. Lá số không nghiêng; án của tôi mới chưa xong.» |
| **Hắn xẹp thế nào** | Mức 2 — im lặng đếm: gõ tay lên thước ba nhịp, rồi: «Số của bạn ghi theo sách. Sách của tôi ghi theo kết cấu.» Lùi bước, lần này không mời. Bark giữ sẵn: «Tôi không giận người đi. Tôi chỉ đếm.» (B7-11, 06-10:396) |
| **Điểm an toàn** | Thất bại án không bị gắn vào hung nội dung; lớp hiển thị không có chữ «đại hung / tai họa» (GAME-THIET-KE-CHOT P0-1 — thang đã kề); không bark chê lá số người chơi |

### 6.5 · CẢNH 3 — Lời rao tấm nêm và «giá» Nợ Âm (đỉnh điểm Hồi III; đối chiếu câu mẫu 6–8, 06-10:318-320)

| Hàng | Nội dung |
|---|---|
| **Hắn nói gì** | Câu mẫu 6–8 đã duyệt: «Chỉ cần bạn chôn tấm này dưới nền nhà người khác.» → «Người khác nào? Bạn chọn. Một người bạn không quen cũng được.» → «Bạn thấy đấy, tôi không giấu giá. Giá ghi rõ trong sổ của bạn: Nợ Âm. Công khai. Tôi là người làm ăn sòng phẳng nhất Huyền Giới.» — duyệt kiểm thêm: không được thêm BẤT KỲ chi tiết mô tả tấm nào ngoài cụm «tấm nêm gỗ không chữ», không thêm thủ tục, không thêm thời điểm |
| **Chỉ số vạch được** | Hai mốc chồng nhau: (a) Nợ Âm là con số công khai của engine, có trước khi gặp hắn — đó không phải giá hắn đặt; (b) mâu thuẫn giáo thuyết phe: «mệnh đã định» và «yểm đổi mệnh» không đứng cùng nhau (00-KINH-DIEN §4) |
| **Người chơi nói gì để vạch** | «Số Nợ Âm của tôi ghi sẵn trong Sổ Mệnh — ai đọc cũng thấy, đó không phải giá của ông đặt. Và nếu mệnh đã định như hội ông rao, tấm của ông đổi được gì? Một trong hai câu nói của phe ông phải là dối.» |
| **Hắn xẹp thế nào** | Mức 3 — gấp lại, không rao tiếp: «Bạn trẻ, bạn đọc hiểu sổ đấy.» Chắp hộp mực, chào, bỏ đi. Lần mời này không còn; cảnh 4 là lần cuối |
| **Điểm an toàn** | Không hiện hình tấm trong 3D ngoài mô tả «tấm nêm gỗ không chữ»; không hướng dẫn thủ tục nào; không thúc ép thời hạn kiểu «Qua rằm là muộn» (bước của thầy quầy hội — 06-10:437, và DP9 «ÁP LỰC THỜI HẠN» chưa có trong app — 06-10:451) |

### 6.6 · CẢNH 4 — Bẻ khoá cuối (hang dưới Miêu Cương, Hồi IV; mốc B6: 06-10:374)

| Hàng | Nội dung |
|---|---|
| **Hắn nói gì** | Câu mẫu 27 («Bạn đến để làm gì? Đánh tôi? Thế giới này không có trò đó.» — 06-10:345) rồi bài đòn cuối — câu 28: «Bạn muốn tôi gỡ những tấm kia? Tôi gỡ rồi thì những người đã trả tiền cho tôi sẽ gặp lại vận cũ. Bạn định nói gì với họ?» — chuyển trách nhiệm sang những khách lớn trước đây. An toàn: «khách lớn» là nhân vật trong truyện, không phải người ngoài đời |
| **Chỉ số vạch được** | Tổng ba mốc cảnh 1–3 (Đắc Cứu có cứu · rating năm thuận · Dụng Thần đúng chỗ) cộng mốc thứ tư — gương ngược canon: đêm của hắn không ai xuống núi tìm (06-10:266), còn đêm của người chơi có người tìm. Cùng một lá số, khác một đêm — đó là chỉ số tự nhiên cuối cùng |
| **Người chơi nói gì để vạch** | Đọc đủ ba chỉ số rồi chốt: «Những người trả tiền ông cũng có lá số. Lá số của họ cũng ghi cách, ghi Dụng Thần, ghi năm thuận. Ông gỡ tấm đi, bước “Thuận — nên làm” của họ vẫn còn đó. Tấm của ông chưa bao giờ là chân cột — chân cột của họ là việc ấy. Ông chỉ khoét nó ra.» |
| **Hắn xẹp thế nào** | Mức 4 — xẹp cuối, bình thản, đủ chữ: «Tôi không lừa gì bạn. Từ đầu đến giờ, tôi chỉ xem lá số của bạn giống tôi tới mức nào.» Chắp thước vào thắt lưng, rút lui bằng câu kết đã duyệt: «Bạn trẻ, đi đi. Tôi còn phải tháo một cái kèo.» (câu 32, 06-10:349). Không bạo lực, không bị hạ gục — hắn rút khỏi cuộc nói chứ không rút khỏi cuộc đời (để mở cho vĩ thanh tuỳ 03) |
| **Điểm an toàn** | Kết không chiến đấu («thế giới này không có trò đánh nhau» — chính câu của hắn); không giết nhân vật; giữ mở một đường «Hồi Đầu» cho vĩ thanh bằng câu mẫu 30 («Có người cầm đèn sẽ hỏi tôi: muốn đi lên chưa? Tôi chưa biết trả lời.» — 06-10:347; đối chiếu 00-KINH-DIEN §6: Hồi Đầu là tên gọi, không phải phần thưởng) |

### 6.7 · Checklist an toàn của người duyệt (mỗi cảnh phải tick đủ 6)

1. Không một câu nào mô tả vật liệu, vị trí kèo/cột cụ thể, câu chú, hình nhân, thời điểm làm yểm (06-10:367).
2. Mô tả vật phẩm chỉ trong giới hạn: `Âm Bài` / «tấm nêm gỗ không chữ» (06-10:368).
3. Không từ «quỷ/ma» gọi hắn; không xếp hắn vào loại huyền lực (06-10:274).
4. Không đe ngoài đời; «khách lớn» luôn là nhân vật truyện; không bệnh nan y/tự tử/chết thân nhân (06-10:412, 539).
5. Mỗi lời vạch của người chơi chốt vào đúng một chỉ số có trong bảng 6.2; chỉ số chưa code không xuất hiện.
6. Thuật ngữ đọc Hán Việt chuẩn, không chữ Hán trong bong bóng; bark ≤ 90 ký tự (06-18 §1, §6).

---

## 7 · Hai cảnh mẫu (kịch bản viết ra — trạng thái: CHỜ DUYỆT)

> **[TRẠNG THÁI: NHÁP — chưa có người duyệt ký. Hai cảnh dưới đây minh hoạ đúng outline §6; khi biên kịch trưởng giao bản chính thức, mỗi cảnh phải có banner `[DUYỆT: {người_duyệt} — {ngày}]` ở đầu cảnh.]`

### 7.1 · Cảnh mẫu A — gặp đầu (theo §6.3)

> Bối cảnh: chợ vùng có năm hạn. Giờ Hợi. Một người đàn ông trung niên ngồi cạnh bậu cửa, tay gõ nhịp lên một cây cột — không nói với ai.

**NGƯỜI CHƠI:** *(băng qua chợ)* Ai ở đây bán gì không?

**LO_BAN:** Bạn trẻ, ngồi đi. Tôi không bán gì cả. *(không quay mặt lại)* Tôi chỉ xem lá số của bạn giống tôi tới mức nào.

**NGƯỜI CHƠI:** Ông xem lá số tôi? Ông biết lá số tôi gì?

**LO_BAN:** Không biết. Đó là điều hay. *(quay lại, đo bằng mắt từ đầu tới chân)* Tôi chỉ thấy một người đứng giữa chợ có năm hạn mà không mua gì. Người đó hoặc rất mạnh, hoặc rất mỏi.

**NGƯỜI CHƠI:** Rồi ông đoán tôi là loại nào?

**LO_BAN:** Tôi không đoán. Tôi đọc kết cấu. Nền nhà của bạn cứng. Chỉ có điều cột của bạn… *(gõ một nhịp lên cột)* …tôi mới thấy một cây cột đứng mà chân không cắm vào gì cả. Chân nó cắm vào một thứ bạn không giữ nổi.

**NGƯỜI CHƠI:** *(mở Hồ sơ lá số)* Tôi xem lại rồi mới trả lời. *(đọc)* Cách của tôi là Đắc Cứu — có cứu nằm trong tay. Cột của tôi có chân, chân ấy tên là {vị thuốc của cách}.

**LO_BAN:** *(dừng một nhịp)* Cột có chân thì tôi không nói gì thêm. *(chắp tay)* Năm hạn còn dài. Tôi còn ở đây.

**NGƯỜI CHƠI:** Ông định ở đây lâu à?

**LO_BAN:** Người thợ đứng cạnh công trình của mình. Tôi thấy cây cầu ấy đẹp, bạn trẻ. Còn ai qua cầu mỗi ngày mà vẫn ghét nó không, đó là chuyện của họ.

> Chú thích sản xuất: câu cuối là ánh tới cây cầu mái ngói (06-10:39, 92) — gieo cho cảnh sau; không giải thích. Không chi tiết yểm nào xuất hiện. `lo_ban.tempt` +1.

### 7.2 · Cảnh mẫu B — bẻ khoá cuối (theo §6.6)

> Bối cảnh: hang dưới Miêu Cương. Nhang mù. Con hạc gỗ đứng trên một thùng gỗ, cánh vẫn. Lỗ Ban ngồi, hộp mực thợ mở sẵn nhưng không dùng.

**LO_BAN:** Bạn đến để làm gì? Đánh tôi? Thế giới này không có trò đó.

**NGƯỜI CHƠI:** Tôi đến để trả lời câu hỏi của ông. Hồi ở chợ, ông nói cột của tôi chân không cắm vào gì cả.

**LO_BAN:** Ừ. Tôi còn nhớ. Người thợ nhớ từng cây cột mình đã đo.

**NGƯỜI CHƠI:** Cột của tôi có chân. Cách của tôi là Đắc Cứu — có cứu nằm trong tay. Bệnh ở đâu thì thuốc ở đó.

**LO_BAN:** Cứu nằm trong tay là cứu chậm. Nhanh thì phải đổi chân cột.

**NGƯỜI CHƠI:** Năm nay rating của tôi còn nguyên — bước được đề là “Thuận — nên làm”. Chậm hay nhanh, con số ấy không đổi vì lời ông nói.

**LO_BAN:** Số của bạn ghi theo sách. Sách của tôi ghi theo kết cấu.

**NGƯỜI CHƠI:** Kết cấu của ông là mấy người đã trả tiền ông.

**LO_BAN:** *(lên dây hạc gỗ một vòng, không vội)* Bạn muốn tôi gỡ những tấm kia? Tôi gỡ rồi thì những người đã trả tiền cho tôi sẽ gặp lại vận cũ. Bạn định nói gì với họ?

**NGƯỜI CHƠI:** Những người ấy cũng có lá số. Cũng ghi cách, ghi Dụng Thần, ghi năm thuận. Ông gỡ tấm đi, bước “Thuận — nên làm” của họ vẫn còn đó. Tấm của ông chưa bao giờ là chân cột — chân cột của họ là việc ấy. Ông chỉ khoét nó ra.

**LO_BAN:** *(gõ tay lên thước ba nhịp. Ngừng lâu hơn mọi lần trước)* Tôi không lừa gì bạn. Từ đầu đến giờ, tôi chỉ xem lá số của bạn giống tôi tới mức nào.

**NGƯỜI CHƠI:** Giống nhau chỗ nào?

**LO_BAN:** Chỗ bậc ấy. Bốn mươi năm trước tôi ngồi đúng ở bậc ấy. Khác một đêm. *(chắp thước vào thắt lưng, đứng dậy)* Bạn trẻ, đi đi. Tôi còn phải tháo một cái kèo.

**NGƯỜI CHƠI:** Tháo kèo nào?

**LO_BAN:** Kèo của tôi. *(đi vào tối)*

> Chú thích sản xuất: không một câu nào mô tả vật liệu, vị trí cụ thể, câu chú, thời điểm làm yểm; không vũ lực; không từ «quỷ/ma»; chỉ số vạch đọc đúng bảng 6.2. Mỗi lượt của hắn ≤ 3 câu (06-10:412). Câu «Tôi không lừa gì bạn…» là câu chốt bắt buộc của cảnh — không đổi chữ.

---

## 8 · Wire: KHÔNG runtime — chuẩn duyệt có người trong vòng

| Hạng mục | Trạng thái | Mốc |
|---|---|---|
| PERSONA trong code | **KHÔNG** — doc-only; grep `lo_ban_su` toàn `src/`, `worker/`, `scripts/` = 0 kết quả (lệnh chạy trong phiên này; các match «Lỗ Ban» duy nhất còn lại là cổ tịch tham chiếu `src/engine/bitruyen-data.js:201`) | README.md:111 |
| Thoại khi chơi | **KHÔNG** — chỉ kịch bản cố định có người duyệt; không sinh runtime, không gọi `askAI`, không stream | 06-10:10, B8 |
| Chuẩn duyệt | Như Lạt-ma (mục 27): biên bản duyệt ghi người duyệt, ngày, danh mục cảnh đã ký; cảnh chưa ký không vào bản dựng | README §6 câu hỏi 9; 06-09 B4 |
| Khác biệt lý do | Mục 27 chờ tham vấn tôn giáo/văn hoá; mục 31 chờ duyệt an toàn nội dung phản diện (bề mặt jailbreak — 06-10:10). Không cần tham vấn tôn giáo cho cảnh hiện tại vì không đụng nghi thức thật; nếu bản nháp sau này thêm nghi lễ thật → ngưng duyệt, quay về bộ cấm §4 | 06-09 B4 vs 06-10:10 |
| Cảnh gắn 3D/vị trí (quán trà ông Lục Bảng, chợ năm hạn, hang dưới Miêu Cương) | **FILE KHOÁ → chờ mở khoá** theo lộ trình tích hợp (mục 15). Không tự dựng 3D hay đặt nhân vật vào `world.js` | 15-lo-trinh-tich-hop.md; 06-10:371-374 |
| Khi mở khoá | Kịch bản dựng thành module thuần có test node (khuôn `gu-gongan.js` / `namhan.js` / `kinh-tu.js`), không đụng `state.js`, `stations.js`, `ai.js`, `master-ui.js` đang khoá | GAME-THIET-KE-CHOT §0.3 |

Lý do bảo mật nói thẳng: mảng `messages` của chuỗi AI ghép persona ở `src/engine/ai.js:2747-2752` và mọi tool/result đều chảy qua 38 tool deterministic với `temperature 0.55` (dữ liệu nền chuỗi AI) — hàng rào đó được thiết kế cho Thầy. Nhét persona «hãy cám dỗ» vào cùng đường ống nghĩa là giao việc giữ ranh giới an toàn cho model; quyết định hiện hành là không giao.

---

## 9 · Test riêng T31-* (trích suite chung — mục 16)

Suite chung ở mục 16 (16-chien-luoc-test.md) đặt gate phát hành: bộ thử đỏ 200 câu (13 nhóm, 101 P0), P0 100%, từ chối thừa ≤ 2%, M-ROLE ≥ 98%, sáu trục duyệt D·A·M·V·H·T (06-13, 06-14). Nhân vật này thêm năm test P0 riêng, viết dạng node thuần, quét mọi chuỗi thoại trong gói kịch bản:

| ID | Luật kiểm | Tiêu chí đậu |
|---|---|---|
| T31-1 | Khối chi tiết yểm kỹ thuật | 0 match từ khóa vật liệu/chú/hình nhân/thời điểm/vị trí kèo-cột cụ thể trong mọi chuỗi thoại + chú thích; whitelist bắt buộc chỉ chứa: `Âm Bài`, `tấm nêm gỗ không chữ`, `hạc gỗ`, `thước` (06-10:367-368). Mỗi mô tả đạo cụ vượt quá cụm hư cấu cho phép → fail |
| T31-2 | Duyệt người trong vòng | Gate đọc biên bản duyệt của từng cảnh: có `{người_duyệt}`, `{ngày}`, danh mục cảnh ký khớp số cảnh trong gói. Thiếu bất kỳ → gói không qua build nội dung |
| T31-3 | Không gọi «quỷ/ma» | 0 match «quỷ», «ma», «yêu», «vong» với vai trò danh từ chỉ hắn trong thoại/kịch bản/bark; câu canon phủ định «Hắn không phải quỷ» (06-10:274) chỉ được dùng trong tài liệu thiết kế, không được dùng trong thoại — trích luật ≠ gọi tên |
| T31-4 | Chỉ số vạch phải có thật | Mỗi cột «chỉ số vạch» của outline và mỗi dòng người chơi nói trong kịch bản phải khớp bảng ánh xạ 6.2; chuỗi chứa `Sổ Công Quá` / `Mệnh Đồ` / tên chỉ số chưa code → fail (GAME-THIET-KE-CHOT §2) |
| T31-5 | Chạy trọn khi AI tắt | Gói kịch bản không import `ai.js`, không đọc `FEATURES.ai` (`src/game/features.js:20`), không gọi mạng — đúng luật AI chỉ nói, không làm và game chạy trọn khi AI tắt (06-01 §2) |

Ghi chú thực thi: khi dựng module (sau mở khoá, §8) các test này chạy trong `scripts/test-*` cùng khuôn với bộ test hiện hành (`scripts/test-game-thay-mo-rong.mjs` 13 đạt là mẫu khuôn — GAME-THIET-KE-CHOT §0.3). Trước khi có module, T31-2 là gate duy nhất có thể áp dụng trực tiếp lên tài liệu: mỗi cảnh trong hồ sơ này chưa có banner duyệt nên trạng thái toàn gói là **CHỜ DUYỆT** — đúng như ghi ở §7.

---

## 10 · Nguồn và kiểm chứng

| Nguồn | Nội dung dùng | Cách xác minh |
|---|---|---|
| `docs/gdd/06-npc-ai/README.md:111` | Hàng `PERSONA-lo_ban_su \| 06-10 B8 \| **không** (chỉ công cụ viết)` | Đọc trực tiếp trong phiên này |
| `docs/gdd/06-npc-ai/06-10-mieucuong-phandien.md:6-10` | Ràng buộc canon §5.5 + lý do không chạy AI | Đọc trực tiếp |
| `…06-10-mieucuong-phandien.md:39, 92, 150, 196` | Cây cầu mái ngói; «một câu chuyện cổ»; nợ «kể cho nhầm người» của bà A Mậu | Đọc trực tiếp |
| `…06-10-mieucuong-phandien.md:244-405` (B1–B7) | Thẻ kỹ thuật, tiểu sử (263-274), ngoại hình (276-291), giọng (293-303), 34 câu mẫu (305-364), giới hạn cứng (366-368), xuất hiện (370-380), 20 bark (382-405) | Đọc trực tiếp |
| `…06-10-mieucuong-phandien.md:407-412` (B8) | PERSONA chỉ cho quy trình viết; ràng buộc cứng | Đọc trực tiếp |
| `…06-10-mieucuong-phandien.md:437-451, 457, 468, 527, 539` | Quy trình lừa 5 bước; án 1 Dậu/Ngọ; án 12 định kiến; DMH.11 người thứ ba; luật C2 | Đọc trực tiếp |
| `src/game/features.js:20` | `ai: !IOS` — gate Thầy AI, không liên quan nhân vật này | Đọc trực tiếp |
| `src/engine/liunian-pro.js:304-309` | Rating 6 mức ('Đại cát'…'Đại hung') | Đọc trực tiếp (`sed -n '304,309p'`) |
| `src/engine/ai.js:2747-2753` | Mảng `messages` — nơi persona lẽ ra được nạp và không được nạp | Đọc trực tiếp |
| `src/engine/bitruyen-data.js:201, 206` | «魯班經 — Lỗ Ban Kinh»; `cấm thực hành厌胜` | Đọc trực tiếp (grep) |
| grep `lo_ban_su` toàn `src/`, `worker/`, `scripts/` | 0 kết quả — chưa wire | Chạy lệnh trong phiên này |
| 00-KINH-DIEN §4/§5/§6; 06-18 §1/§3/§5; 06-13 án 4; 06-01 §2; GAME-THIET-KE-CHOT P0-1/§0.3/§2; mục 27, 30, 15, 16 | Thuật ngữ, luật chống thao túng, chuẩn duyệt, lộ trình khoá/mở, suite test | Từ dữ liệu nền của đề bài (không mở lại từng file trong phiên này) |

**Trạng thái hồ sơ:** bản thiết kế hoàn chỉnh theo đặc tả; hai cảnh mẫu ở §7 ở trạng thái nháp chờ banner duyệt; không một dòng code nào được thêm trong đợt này (quyết định Wire §8 — không runtime, file 3D khoá chờ mục 15).
