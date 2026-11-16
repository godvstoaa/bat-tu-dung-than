# BỘ THIẾT KẾ HỢP NHẤT «HUYỀN QUÁN ONLINE» — MANIFEST (2026-11-16)

Người dùng nói: «đọc lại toàn bộ những gì đã thiết kế đối với game này mà làm lại thiết kế cho chỉn chu, vì bây giờ rất nhiều chi tiết, rất nhiều mảng, đang quá rời rạc, không có gì liên kết với nhau, không có hướng dẫn đầy đủ để mọi người biết gì cả. Làm lại thiết kế cực kỳ tối ưu và đàng hoàng để các bộ phận khác chỉ việc làm. Một bản thiết kế phải thực sự đầy đủ, không làm qua loa.»

- **Viết trước khi viết bộ tài liệu.** Mọi tệp trong `docs/game/` phải theo văn bản này.
- **Chỉ số (V)** do `scripts/docs-game-lint.mjs` kiểm và chặn khi trượt.
- **Đổi quy tắc** thì sửa văn bản này trước, ghi lý do ở §6.

## 0. Hiện trạng (đo 2026-11-16)

### 0.1 Mã

| Hạng mục | Số đo | Cách đo |
|---|---|---|
| Mô-đun game `src/game/` | 156 tệp (155 `.js`, 1 `.css`); phần `.js` 32.740 dòng lúc đo đầu phiên, 32.752 dòng cuối phiên vì mã đang được sửa song song | `ls`, `wc -l` |
| Máy chủ `worker/` | 10 tệp, 2.965 dòng; 5 Durable Object (`TownShard`, `Estate`, `Accounts`, `Guild`, `Economy`) | `ls`, `wc -l`, `wrangler.jsonc` |
| Bộ test `scripts/test-*.mjs` | 45 tệp. 42 bộ thuần chạy lẻ đều đạt; 3 bộ cần máy chủ dev | chạy từng tệp bằng `node` |
| Lệnh test chung | **`npm run test:game` gãy ở bộ thứ 9**: gọi `scripts/test-game-city.mjs` không còn tồn tại | `npm run test:game` |
| Tài sản 3D `public/models/` | 648 tệp GLB, 509 MB, 10 loại hậu tố bậc | `ls`, `du` |
| Thay đổi 6 ngày gần nhất | 55 commit, thêm 36 mô-đun, P3–P21 có mã, thành qua v4 → v6 | `git log --since` |

### 0.2 Tài liệu thiết kế game

| Nhóm | Tệp | Dung lượng | Vai trò thật hôm nay |
|---|---|---|---|
| Thế hệ đầu (03/11) | `GAME-HUYEN-QUAN-SPEC`, `GAME-MMO-PROMPT-PLAN`, `DAI-THE-GIOI-DESIGN` | 74 KB | lịch sử; còn vài luật nền chưa chép sang đâu |
| V2 + nhật ký (04–14/11) | `GAME-V2-THIET-KE` | 130 KB, 677 dòng | thiết kế V2 đã cũ + **nhật ký thi công duy nhất** của cả game |
| Nội dung và chốt (05/11) | `GAME-NOI-DUNG-THEO-APP`, `GAME-THIET-KE-CHOT`, `GAME-MESHY-ASSET-PLAN`, `MESHY-LIBRARY-CC0` | 51 KB | một phần còn đúng, một phần đã bị vượt |
| Tầm nhìn AAA (05/11) | `GAME-AAA-THIET-KE`, `docs/gdd/` (343 tệp) | 10,1 MB | đã bị cắt khỏi kế hoạch thực thi |
| NPC-AI (09/11) | `GAME-NPC-AI-THIET-KE-DAY-DU`, `docs/npc-ai/` (36 tệp) | 2,8 MB | đang hiệu lực, thi công tới G2 |
| Đặc tả đời sống – kinh tế (10–11/11) | `GAME-SINH-TON-KINH-TE-DAC-TA` | 166 KB, 1.935 dòng | đặc tả của P0–P21; bốn phần chồng lên nhau |
| Manifest chuyên đề (11–15/11) | `THANH`, `TUONG-THANH`, `CAY-QUAN`, `NHA-DIADIEM`, `DOHOA`, `GAME-TROI-THIET-KE`, `GAME-AAA-MODEL-THANH-PHO`, `TAI-KHOAN-CAI-DAT` | 130 KB | đang hiệu lực, đúng khuôn manifest |

### 0.3 Chín vấn đề đo được

1. **Không có cổng vào.** 20 tệp game nằm lẫn với khoảng 40 tệp của app trong `docs/`; không tệp nào liệt kê các tệp kia hay thứ tự đọc.
2. **Sáu hệ mã lộ trình song song:** `V2-1…5`, `P0-1/P0-2` (thiết kế chốt), `G0–G4` (NPC-AI), `P0–P21` (đời sống – kinh tế), `M0–M6` (GDD), `v4–v6` cùng `G-5.x / G-6.x / G-8.x` (goal trong manifest đồ hoạ).
3. **Quyết định nằm bốn nơi:** Q1–Q7, Quyết định 1–16, mục «decisions» của hai tài liệu Blender, «câu hỏi mở» của GDD.
4. **Một tên nhiều nghĩa:** «Phúc Khí» (tiền → điểm kinh nghiệm → điểm Huyền học); «văn» và «đồng»; «cấp» và «cảnh giới»; «Huyền Thành», «Bát Quái Thành», «Thành Bát Quái»; «Thiên Bàn Đảo», «quận Thiên Bàn», «Cửu Trọng Thiên»; tên thế giới «Huyền Giới» trong GDD và đầu tệp mã.
5. **Trạng thái ghi sai:** đầu đặc tả kinh tế ghi «P3–P21 chưa code» trong khi bảng lộ trình cùng tệp đánh dấu xong cả 22 giai đoạn; thiết kế chốt ghi «cắt cảnh giới» trong khi `realm.js` đã chạy.
6. **Thiết kế, nhật ký, quyết định trộn một tệp** (`GAME-V2-THIET-KE`: có dòng dài gần 3.000 ký tự).
7. **Số chép tay lệch mã:** «47 tiệm» (mã: mọi lô mặt tiền lớn là tiệm), «2.400 nhà» (đo 14/11: 17.528), thế giới 3.328 m (mã: `WORLD = 8192`).
8. **Mã trỏ về tài liệu cũ:** 40 chú thích trong `src/game` và `worker` trỏ tới 9 tệp thế hệ cũ.
9. **Không có hướng dẫn theo bộ phận**, không có bản đồ mô-đun → chương, không có danh sách việc thống nhất.

## 1. Nghiên cứu (nguồn đã xem)

### 1.1 Trong repo

| Nguồn | Mức đọc | Học được |
|---|---|---|
| `GAME-V2-THIET-KE` | đọc trọn (2 lượt: 10/11 và 16/11) | toàn bộ hiện trạng đã thi công, số đo, lỗi đã sửa, việc để lại |
| `GAME-THIET-KE-CHOT` | đọc trọn | Q1–Q7; cách ghi quyết định kèm bằng chứng |
| `GAME-SINH-TON-KINH-TE-DAC-TA` | đọc trọn ngày 10/11; đối chiếu trạng thái ngày 16/11 | luật của 22 giai đoạn; Quyết định 1–16; bảng phân công theo đội |
| `THANH-MANIFEST`, `NHA-DIADIEM-MANIFEST` | đọc trọn | khuôn manifest của dự án: nguồn → quy tắc có số → bất biến → checklist → goal |
| `DOHOA-MANIFEST` | đọc §0–§4 | ngân sách hiệu năng thật, cách đo ba điểm cố định |
| `CAY-QUAN-MANIFEST`, `TUONG-THANH-MANIFEST`, `GAME-TROI-THIET-KE`, `GAME-AAA-MODEL-THANH-PHO` | đọc mục lục và phần nhật ký tương ứng | phạm vi từng manifest chuyên đề |
| `docs/gdd/01`, `12` | khảo sát phụ 10/11 | sáu trụ cột T1–T6, luật văn phong, token giao diện, trợ năng |
| `docs/gdd/02`, `03`, `07` | khảo sát phụ 10/11 | vũ trụ quan, Bàn Minh, Định Mệnh Hội, lore Am Vân Cốc |
| `docs/npc-ai/17–36` | khảo sát phụ 10/11 | 20 persona, 10 luật chung, lệch giữa sách và mã |
| 156 mô-đun `src/game` | script: đầu tệp, export, hình dạng hằng số | bản đồ mô-đun; bảng số liệu thật |
| 45 bộ test | chạy thật | hiện trạng kiểm thử |
| `.claude/skills/domain-modeling`, `triage/AGENT-BRIEF.md` | đọc trọn | khuôn thuật ngữ (kèm cột «tránh»), khuôn quyết định, khuôn phiếu việc bền |

**Mức đọc thật của từng nguồn** (ghi thẳng, không giả vờ):
- `docs/npc-ai/01–16`: lúc soạn bộ chưa rà; **đã đối chiếu trọn với mã ngày 16/11** (đợt `VC-022`, bốn lượt rà độc lập).
- `docs/gdd/04, 05, 06, 08, 09, 10, 11, 13, 14` và `00-KINH-DIEN-CHUNG`: lúc soạn bộ chưa rà; ngày 16/11 mới **rà tổng quan** (trang tổng quan của tập, danh mục tệp, vài mục chọn lọc ở tập 11 và 14). Chưa đọc từng tệp.
- `GAME-AAA-THIET-KE` và ba tài liệu thế hệ đầu: chỉ tra theo mục khi cần.

### 1.2 Tham chiếu ngoài

| Nguồn | Học được | Dùng vào đâu |
|---|---|---|
| Diátaxis — <https://diataxis.fr/> (xem qua kết quả tìm kiếm và bài của Canonical <https://ubuntu.com/blog/diataxis-a-new-foundation-for-canonical-documentation>) | Bốn loại tài liệu theo hai trục (hành động / hiểu biết, đang học / đang làm): hướng dẫn nhập môn, hướng dẫn làm việc, tra cứu, giải thích. Không trộn loại trong một trang. | Tách bốn loại tệp ở §2.2: cổng vào, sổ tay bộ phận, phụ lục tra cứu, chương thiết kế |
| arc42 — <https://docs.arc42.org/home/>, <https://examples.arc42.org/sections/> | 12 mục cố định: mục tiêu, ràng buộc, ngữ cảnh, chiến lược, khối dựng, vận hành, triển khai, khái niệm xuyên suốt, quyết định, chất lượng, rủi ro và nợ, thuật ngữ | Khung của các chương kỹ thuật 30–32, sổ quyết định, từ điển, mục nợ kỹ thuật |
| Michael Nygard, «Documenting Architecture Decisions» — <https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions> | Mỗi quyết định: bối cảnh, quyết định, trạng thái, hệ quả. Quyết định bị đảo thì giữ nguyên và đánh dấu «đã thay». Đánh số không dùng lại. | Chương 02 |
| C4 model — <https://c4model.com/> | Bốn mức sơ đồ; độc lập ký hiệu và công cụ | Chương 31 vẽ hai mức đầu bằng khối chữ |
| Tim Ryan, «The Anatomy of a Design Document, Part 2» — <https://www.gamedeveloper.com/design/the-anatomy-of-a-design-document-part-2-documentation-guidelines-for-the-functional-and-technical-specifications> | Tách đặc tả chức năng (góc nhìn người chơi) khỏi đặc tả kỹ thuật (góc nhìn hệ thống). Mỗi mục mở bằng đoạn tóm tắt. Lỗi thường gặp: thiếu chi tiết, mâu thuẫn không giải, tầm nhìn trôi, không ghi thay đổi. | Khuôn chương §2.4; chương 02 giải mâu thuẫn; tệp nhật ký |
| RFC 2119 | Không tải được trong phiên (DNS chặn). Dùng nghĩa thông dụng: PHẢI / KHÔNG ĐƯỢC / NÊN / CÓ THỂ. | §2.9 |

## 2. Quy tắc thiết kế bộ tài liệu (số đo)

### 2.1 Bốn lớp, một thứ tự thắng

| Lớp | Ở đâu | Là gì | Khi lệch nhau |
|---|---|---|---|
| **L0** | mã nguồn + `docs/game/phu-luc/` (sinh từ mã) | số liệu đang chạy | thắng mọi lớp về **con số** |
| **L1** | `docs/game/` | bộ thiết kế hợp nhất: ý đồ, luật, liên kết, hướng dẫn | thắng L2–L4 về **ý đồ và luật** |
| **L2** | các manifest chuyên đề ở `docs/` gốc, `docs/npc-ai/` | chi tiết sâu của một mảng hẹp | trong đúng phạm vi hẹp của nó, bản mới hơn thắng; L1 phải sửa theo trong cùng đợt |
| **L3** | tài liệu thế hệ cũ, có biển «đã thay thế» | lịch sử, lý do | không dùng để làm việc |
| **L4** | `GAME-AAA-THIET-KE`, `docs/gdd/` | tầm nhìn tham khảo | chỉ lấy khi một chương L1 dẫn tới |

### 2.2 Cấu trúc `docs/game/` (bốn loại tệp, không trộn)

| Dải số | Loại | Tệp |
|---|---|---|
| — | cổng vào | `README.md` |
| 00–04 | nền chung | `00-TONG-QUAN`, `01-TU-DIEN`, `02-QUYET-DINH`, `03-TRANG-THAI`, `04-LO-TRINH` |
| 10–23 | chương hệ thống (góc nhìn người chơi và luật) | `10-THE-GIOI`, `11-MENH-VA-NHAN-VAT`, `12-BOI-TOAN-VA-NOI-DUNG`, `13-DOI-SONG`, `14-VIEC-LAM`, `15-NHA-O-VA-PHUONG-TIEN`, `16-DI-CHUYEN`, `17-SAN-XUAT-AM-THUC-KINH-DOANH`, `18-HUYEN-HOC-TU-LUYEN-LUAN-HOI`, `19-LUAT-VA-HINH-PHAT`, `20-XA-HOI`, `21-NPC-VA-AI`, `22-GIAO-DIEN-DIEU-KHIEN`, `23-MY-THUAT-TAI-SAN` |
| 30–32 | chương kỹ thuật (góc nhìn hệ thống) | `30-KY-THUAT-CLIENT`, `31-MAY-CHU-MANG-DU-LIEU`, `32-KIEM-THU-TRIEN-KHAI` |
| 40 | luật xuyên suốt | `40-AN-TOAN-PHAP-LY` |
| 50–57 | sổ tay bộ phận (hướng dẫn làm việc) | Thiết kế game · Client/3D · Backend · AI/NPC · Mỹ thuật · Nội dung · QA · Vận hành |
| 90 | phả hệ | `90-PHA-HE-TAI-LIEU` |
| — | nhật ký | `NHAT-KY.md` (mục mới từ 16/11; mục cũ ở `GAME-V2-THIET-KE` §7) |
| `phu-luc/A1–A7` | tra cứu, sinh từ mã | bản đồ mã · kiểm thử · số liệu · giao thức · địa điểm · tài sản 3D · điều khiển và lưu trữ |

### 2.3 Một nguồn sự thật

- Mỗi hệ thống có **đúng một** chương L1 làm nguồn chuẩn. Chương khác chỉ dẫn về bằng `§`.
- **Bảng số liệu** (danh mục nghề, món, vật phẩm, hạng nhà, cảnh giới…) chỉ có một nguồn là mã. Tài liệu không chép tay bảng số; chỉ dẫn về `phu-luc/A3`. `scripts/docs-game-gen.mjs` sinh phụ lục trong dưới 60 giây.
- Chương được nêu con số khi con số đó là **luật thiết kế** (mốc cân bằng, trần, tỉ lệ). Khi đó ghi kèm tên hằng số trong mã.

### 2.4 Khuôn chương (bắt buộc)

Sáu trường đầu tệp, đúng thứ tự: **Trạng thái · Bộ phận chủ trì · Nguồn sự thật trong mã · Test · Thay thế · Kiểm với mã ngày**.

Các mục của một chương hệ thống (10–40), theo thứ tự:
1. `N.0 Mục đích, phạm vi, tóm tắt`: chương trả lời câu hỏi gì, cái gì **không** thuộc chương, và một bảng tóm tắt dẫn tới từng mục;
2. các mục thiết kế `N.1`, `N.2`… đánh số **liền mạch**, mỗi mục mở bằng một đoạn tóm tắt và một dòng trạng thái;
3. mục «đang chạy thêm hoặc khác đặc tả» khi mã lệch lời đặc tả: ghi tên hằng số trong mã, không sửa lời đặc tả gốc;
4. ba nội dung đóng chương, bắt buộc đủ: **Liên kết với hệ khác** (bảng: hệ → dữ liệu trao đổi → chương), **Kiểm thử và nghiệm thu**, **Việc còn mở** (dẫn mã việc ở chương 04). Khi mỗi nội dung chỉ vài dòng thì được gộp vào một hoặc hai tiêu đề, miễn tên tiêu đề nêu đủ.

Cấp tiêu đề khớp độ sâu số mục: `## N.k`, `### N.k.j`, `#### N.k.j.i`. Script kiểm: V13.

### 2.5 Nhãn trạng thái (chỉ năm nhãn)

| Nhãn | Nghĩa đo được |
|---|---|
| `[ĐÃ CÓ]` | có mã, có test thuần đạt hoặc đã kiểm trong trình duyệt theo nhật ký |
| `[MỘT PHẦN]` | có mã cho lõi; phần còn thiếu được liệt kê ngay bên dưới |
| `[ĐẶC TẢ]` | đã chốt thiết kế, chưa có mã |
| `[ĐỀ XUẤT]` | người soạn đề xuất để hoà giải mâu thuẫn; **chờ chủ dự án duyệt** |
| `[TẦM NHÌN]` | chỉ để tham khảo, không nằm trong lộ trình |

### 2.6 Đánh số và tham chiếu chéo

- Tiêu đề mang số toàn cục: chương 13 có `## 13.2`, `### 13.2.1`. Tham chiếu viết `§13.2.1`; số đầu là số chương.
- Tham chiếu tới tệp không phải chương: liên kết tương đối.
- Số mục cũ của đặc tả kinh tế (§0–§31) được ánh xạ một lần ở chương 90; trong L1 không còn số cũ.

### 2.7 Mã định danh

| Loại | Dạng | Ghi chú |
|---|---|---|
| Luật nền | `LN-01…` | bất biến của cả game, ở `00-TONG-QUAN` |
| Quyết định | `QĐ-01…QĐ-16` giữ số cũ; `QĐ-C1…C7` cho bảy quyết định của thiết kế chốt; `QĐ-17…` cho quyết định sau | không dùng lại số |
| Giai đoạn đã có | `V2-n`, `P0…P21`, `G0…G4`, `G-5.x…` | **giữ nguyên** vì mã, test và nhật ký đang dùng |
| Việc mới | `VC-001…` | khuôn §2.11 |

### 2.8 Thuật ngữ

- Chỉ dùng tên chuẩn ở `01-TU-DIEN`. Mỗi mục: tên chuẩn, định nghĩa một đến hai câu, cột «tránh».
- Ngoài `01`, `02`, `90` và `NHAT-KY`, **không** dùng: «văn» làm đơn vị tiền, «Huyền Giới» làm tên game, «Phúc Khí» theo nghĩa tiền.

### 2.9 Ngôn ngữ và định dạng

- Tiếng Việt đủ dấu. Định danh mã để trong dấu `` ` ``. Dấu ngoặc trích «…».
- Số: dấu phẩy thập phân, dấu chấm hàng nghìn. Toạ độ `(x, z)` mét. Tiền ghi theo đơn vị lớn nhất có nghĩa.
- PHẢI / KHÔNG ĐƯỢC là luật; NÊN là khuyến nghị; CÓ THỂ là tuỳ chọn.
- Không ghi số dòng của mã (số dòng trôi sau mỗi commit); ghi `tệp › tên export`.

### 2.10 Sổ tay bộ phận (tám mục, tối đa 200 dòng mỗi sổ)

Sứ mệnh · Đọc gì theo thứ tự · Phạm vi sở hữu (mô-đun, tài sản) · Giao diện với bộ phận khác · Quy trình một việc · Định nghĩa «xong» · Lệnh hay dùng · Hàng việc hiện tại.

### 2.11 Phiếu việc (theo `AGENT-BRIEF`)

Mỗi việc ở chương 04 có: mã, tên, bộ phận, chương liên quan, **hiện trạng**, **mong muốn**, **tiêu chí nghiệm thu kiểm được**, **ngoài phạm vi**, phụ thuộc. Mô tả hành vi và giao diện, không mô tả cách sửa từng dòng.

## 3. Ngân sách đọc và bảo trì

| Chỉ số | Ngưỡng |
|---|---|
| `README.md` | tối đa 160 dòng |
| Người mới: README + `00` + sổ tay bộ phận của mình | tối đa 900 dòng, đọc trong 45 phút |
| Một sổ tay bộ phận | tối đa 200 dòng |
| Một dòng văn viết tay | tối đa 600 ký tự (bảng sinh tự động được miễn) |
| Sinh lại phụ lục | dưới 60 giây, không cần máy chủ |
| Kiểm toàn bộ (`docs-game-lint`) | dưới 30 giây |

**Đo cuối đợt (2026-11-16):** `README.md` 123 dòng; đường đọc của người mới 340 dòng (README 123 + chương 00 158 + sổ tay dài nhất 59); không dòng viết tay nào quá 600 ký tự; sinh lại phụ lục 0,9 giây; kiểm toàn bộ 1,0 giây.

## 4. Checklist kiểm

### 4.1 Kiểm bằng script — `node scripts/docs-game-lint.mjs`

**Kết quả cuối đợt (2026-11-16): đạt 14/14.** Lần chạy đầu trượt 4 mục (V3, V4, V8, V10), đã sửa; V8 trượt vì mã game đổi giữa hai lần sinh phụ lục, tức là cơ chế bắt lệch chạy đúng.

- [x] **V1** Mọi chương 00–40 và 90 có đủ sáu trường đầu tệp.
- [x] **V2** Mọi liên kết tương đối trong `docs/game/` trỏ tới tệp tồn tại.
- [x] **V3** Mọi tham chiếu `§N.M` trỏ tới một tiêu đề tồn tại trong chương N.
- [x] **V4** Mọi đường dẫn `src/game/…`, `worker/…`, `scripts/…` nằm trong dấu `` ` `` đều tồn tại.
- [x] **V5** 100 % mô-đun `src/game/*` và `worker/*` có trong `A1` và được gán chương.
- [x] **V6** 100 % `scripts/test-*.mjs` có trong `A2`.
- [x] **V7** 100 % tài liệu game cũ ở §0.2 có dòng trong chương 90.
- [x] **V8** Phụ lục khớp mã (`docs-game-gen.mjs --check`).
- [x] **V9** Chỉ dùng năm nhãn trạng thái ở §2.5.
- [x] **V10** Không còn từ bị cấm ở §2.8 ngoài các tệp được phép.
- [x] **V11** Ngân sách §3 (số dòng README, sổ tay; đường đọc của người mới; độ dài dòng).
- [x] **V12** Mỗi phiếu việc `VC-nnn` đủ các trường §2.11.
- [x] **V13** Khung chương §2.4 và §2.6: số mục mang số chương, đúng cấp tiêu đề, liền mạch; chương 10–40 mở bằng `N.0` và đóng đủ ba nội dung. *(thêm cuối đợt, xem §6)*
- [x] **V14** «Con số nhanh» ở README khớp phụ lục sinh từ mã. *(thêm cuối đợt, xem §6)*

### 4.2 Kiểm bằng mắt

- [x] **M1** Năm câu hỏi thử, chỉ dùng README để tìm chương: «Dụng thần ảnh hưởng lương thế nào?» → 14; «Thêm một loại tiệm thì đụng những đâu?» → 10, 15, 51; «Gói mạng nào mang độ cao tuyệt đối?» → 31, A4; «Câu NPC nào bị cấm?» → 40, 21; «Bản iOS tắt những gì?» → 40, 32.
  - *Kết quả 16/11: 5/5.* Câu 2 lúc đầu **không** tìm ra chương 10 và 15, vì dòng mô tả hai chương này trong README không nhắc «cửa hàng», «tiệm»; đã sửa hai dòng đó. Chỗ trả lời: §14.1.1 · §10.3, §10.11, §15.2.5, sổ tay 51 · §31.1.1, §16.6 và A4 · §40.2, §21.3 · §32.5, §40.6.
- [x] **M2** Mười con số lấy ngẫu nhiên trong các chương, đối chiếu với `A3` hoặc mã: không lệch.
  - *Kết quả 16/11: kiểm 30 con số, 28 khớp, 2 lệch (cùng một dòng README), đã sửa.* Khớp: `WORLD` 8.192; `CITY_OCT` 2.125; 18.152 nhà; 8.560 cửa hàng; 15 loại; 289 quầy thầy bói; 21 miếu và điện; 292 căn rao bán; `SKY_Y` 460; `SELL_BACK` 0,5; `PANTRY_MS` ba ngày; 31 nghề; 7 cảnh giới; 11 pháp môn; 6 cõi; 8 sảnh nghề; 13 thầy; 8 vị thần; 6 bệnh; 5 bậc phương tiện; 50 vật phẩm; 16 loại tiệm trong `SHOP_TYPES`; 17 dịch vụ tiệm; 20 persona; 5 phép gieo quẻ; 45 bộ test; 648 tệp model; 156 mô-đun. Lệch: README ghi «32.740 dòng; máy chủ 11 tệp», trong khi `A1` đếm 33.580 dòng (gồm cả tệp CSS, và mã đổi trong ngày) và 10 tệp máy chủ → bỏ số dòng khỏi README, sửa số tệp, thêm V14 để lần sau script bắt.
  - *Rà thêm ba số cũ đã biết là lệch (§0.3 mục 7):* còn sót «47 tiệm» trong lời đặc tả chép sang §14.1.2, đã sửa. Hai chỗ nói «15 loại» và «16 loại» tiệm không mâu thuẫn (16 = 15 loại trên phố + Tiệm May Tàng Y), đã ghi rõ ở §15.2.5 và từ điển.
  - *Giới hạn:* đây là kiểm mẫu. 1.590 dòng luật chép từ đặc tả cũ chưa được đối chiếu **từng con số** với mã; việc đó là `VC-033`.
- [x] **M3** Mỗi mâu thuẫn ở §0.3 mục 4 và 5 có một dòng giải trong chương 01 hoặc 02.
  - *Kết quả 16/11: 8/8.* «Phúc Khí», «văn» và «đồng», «cấp» và «cảnh giới», ba tên thành, ba tên vùng trời, tên game: mỗi tên một dòng ở `01-TU-DIEN`. «P3–P21 chưa code»: MT-6 ở `02-QUYET-DINH`, kèm ghi chú ngay trên biển của tệp cũ. «Cắt cảnh giới»: QĐ-C1, ghi «thay bằng QĐ-12».

### 4.3 Kiểm thử mã (để chắc phụ lục sinh từ mã đang chạy được)

- 42/42 bộ test thuần đạt khi chạy lẻ (chạy lại cuối đợt, sau khi mã đổi trong ngày). Ba bộ cần máy chủ dev (`test-quan-mmo`, `test-quan-auth`, `test-econ-accounts`) **chưa chạy** trong đợt này.

## 5. Goal phát triển (tự đặt)

- **G-D1 (đợt này) — ĐẠT 2026-11-16.** Bộ L1 đủ tệp theo §2.2; §4.1 đạt 14/14; §4.2 đạt 3/3.
- **G-D2.** Rà chín tập GDD và `docs/npc-ai/01–16` còn nợ; mỗi tập có một dòng «đã rà, lấy gì, bỏ gì» ở chương 90; bổ sung chương 21 và 40. Đo: chương 90 không còn dòng «chưa rà». Phiếu: `VC-022`.
  - **Tiến độ 16/11:** `docs/npc-ai/01–16` đã đối chiếu trọn với mã (kết quả ở §21.7.2 của bộ L1); chín tập GDD mới rà ở mức tổng quan. Chương 90 không còn dòng «chưa rà», nhưng ghi rõ mức đọc của từng tập. **Còn mở:** đọc trọn một tập khi có bộ phận cần khai thác nó.
- **G-D3.** Sửa `npm run test:game` cho khớp tên tệp thật và thêm lệnh `docs:check`. Cần chủ dự án duyệt vì đổi `package.json`. Phiếu: `VC-001`, `VC-002`.
- **G-D4.** Đổi 40 chú thích mã đang trỏ tài liệu cũ sang chương mới. Cần duyệt vì đụng mã. Phiếu: `VC-003`.
- **G-D5.** Tách nhật ký trong `GAME-V2-THIET-KE` §7 sang `NHAT-KY` theo tháng; từ đó V2 chỉ còn là lịch sử. Phiếu: `VC-023`.
- **G-D6.** Đối chiếu từng con số luật trong 11 chương có lời chép từ đặc tả cũ với hằng số trong mã. Đo: mỗi con số hoặc mang tên hằng, hoặc nằm ở mục «khác đặc tả». Phiếu: `VC-033`.
- **Bước kế:** ba phiếu an toàn phát hiện khi rà (`VC-038`, `VC-034`, `VC-035`) cần chủ dự án cho phép sửa mã; sau đó G-D3 và G-D6. Chương 02 hiện có 13 câu hỏi chờ chủ dự án.

## 6. Thay đổi manifest

- 2026-11-16: bản đầu.
- 2026-11-16 (cuối đợt), năm chỗ lệch so với bản đầu và lý do:
  1. **§2.4 — gộp hai mục mở đầu thành một mục `N.0`.** Bản đầu đòi `N.1 Mục đích và phạm vi` và `N.2 Tóm tắt một trang`. Khi ghép 31 khối luật từ đặc tả cũ, các khối cần bắt đầu ngay từ `N.1` để bảng ánh xạ số cũ → số mới ở chương 90 gọn; hai mục mở đầu riêng đẩy số lệch và để lại lỗ số (`N.0` rồi `N.2`) ở chín chương. Đã gộp thành `N.0`, rồi dời số ở chương 12, 14–18, 20–22 cho liền mạch; mọi tham chiếu `§` và bảng ở chương 90 dời theo, kiểm bằng V3 và V13.
  2. **§2.4 — cho gộp ba nội dung đóng chương** vào một hoặc hai tiêu đề khi mỗi nội dung chỉ vài dòng (11 chương dùng cách này).
  3. **§4.1 — thêm V13 và V14; V11 đo thêm hai chỉ số.** Bản đầu yêu cầu khung chương, đường đọc 900 dòng và trần 600 ký tự nhưng script chưa đo; M2 lại bắt được số chép tay lệch ở README. Luật không có script canh thì sẽ trôi, nên bổ sung.
  4. **§4.2 M1 — sửa README chứ không sửa đáp án.** Câu 2 trượt ở lần thử đầu; lỗi nằm ở mô tả của README.
  5. **§0.1 — số tệp máy chủ 11 → 10** (đếm sai ở bản đầu; số dòng 2.965 đúng).
  6. **V3 kiểm thêm một dạng tham chiếu:** `§` đứng ngay sau liên kết tới một chương của chính bộ này. Bản đầu bỏ qua dạng đó, và một tham chiếu kiểu này đã lọt khi dời số (bắt được nhờ báo cáo của script dời số, không phải nhờ lint).
- 2026-11-16, đợt rà `VC-022` (theo yêu cầu «rà tiếp luôn»):
  1. Đối chiếu `docs/npc-ai/01–16` với mã bằng bốn lượt rà độc lập, mỗi lượt bốn mục, buộc nêu bằng chứng `tệp › tên hàm`; các phát hiện nặng được kiểm lại bằng tay (chạy thử hàm, mở đúng dòng mã) trước khi ghi vào bộ L1.
  2. Rà tổng quan chín tập GDD; thêm khái niệm «rà tổng quan» vào chương 90 để không ghi quá mức đọc thật.
  3. Kiểm lại 21 lỗi mã mà bản tầm nhìn ghi ngày 05/11: 8 còn, 3 đã sửa, 5 mới sửa hoặc mới kiểm được một phần, 5 chưa kiểm (bảng ở §3.6 của bộ L1, vài lỗi gộp chung một dòng).
  4. Kết quả ghi vào bộ L1: sáu phiếu mới `VC-034`–`VC-039`, hai mâu thuẫn mới MT-11 và MT-12, bốn câu hỏi mới cho chủ dự án. Lint vẫn đạt 14/14. Không đổi mã game.
