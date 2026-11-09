# 04 · Kiến trúc PERSONA object + quy ước viết hồ sơ chống lặp

> **Tóm tắt.** Mục này là khung trung tâm mà 20 hồ sơ (mục 17–36) áp dụng: một cấu trúc dữ liệu duy nhất `PERSONA object` (7 trường dữ liệu + khoá `id`), một bản `PERSONA-CHUNG` 10 luật được liệt kê ĐẦY ĐỦ đúng một lần duy nhất ở đây, một mô hình bật/tắt AI ba mức `aiEnabled` ('co' | 'khong' | 'kichban'), một điểm cắm injection vào chuỗi AI hiện có tại `src/engine/ai.js:2747-2753` qua module thuần `src/game/npc-personas.js`, và một quy ước viết hồ sơ chống lặp bắt buộc cho toàn bộ mục 17–36. Mọi hồ sơ phía sau chỉ viết phần điểm riêng; luật chung, test chung, bark chung đã chốt ở mục này và ở mục 05/07/10/15/16, hồ sơ tham chiếu tối đa một dòng. Người duyệt đã đếm khoảng 20 × 300 từ boilerplate lặp lại ở bản trước — quy ước ở §4.6 sinh ra để xóa đúng chỗ ấy.

## 4.0 Vai của mục này trong bộ thiết kế

Bộ thiết kế NPC-AI mới tách làm hai lớp rõ ràng. Lớp **hạ tầng chung** gồm các mục 00–16: kinh điển, thế giới dữ liệu, kiến trúc AI, chuẩn tối thiểu (mục 05), bark pool (mục 07), bộ lọc (mục 10), danh sách file khóa (mục 15), suite test chung (mục 16). Lớp **hồ sơ nhân vật** gồm mục 17–36, mỗi mục một persona trong số 20 persona canon của bộ `docs/gdd/06-npc-ai/` (06-02 → 06-11). Mục này đứng ở giữa: nó là hợp đồng kép — một nửa là **schema cho dữ liệu** (mọi persona được diễn tả bằng cùng một object, máy đọc được, test node được), một nửa là **quy ước cho người viết** (mọi hồ sơ được viết theo một khuôn chống lặp, người duyệt đọc được nhanh và không phải đọc lại 300 từ giống nhau 20 lần).

Vì sao phải có object thay vì để mỗi hồ sơ là một văn xuôi dài như trong `docs/gdd/06-npc-ai/06-02…06-11`? Ba lý do đo được. Thứ nhất, văn xuôi không ghép vào prompt được tự động; object ghép được bằng một hàm (`personaSystemPrompt`, §4.4). Thứ hai, văn xuôi lặp; object tách phần chung (PERSONA-CHUNG) khỏi phần riêng (promptTemplate) và phần chung chỉ tồn tại một bản. Thứ ba, văn xuôi không test được; object test được bằng node thuần theo khuôn đã có sẵn trong repo — các module `gu-gongan.js`, `namhan.js`, `kinh-tu.js` đều là module thuần không DOM và chạy trong `scripts/test-game-thay-mo-rong.mjs` (13 bài đạt, xem nhật ký GAME-THIET-KE-CHOT) — persona object sinh ra để đi đúng khuôn đó.

Ranh giới của mục này: mục này **không** đề xuất sửa bất kỳ file nào trong 22 file khóa ở mục 15; điểm cắm duy nhất được chốt là `ai.js` vì file này không nằm trong danh sách khóa (§4.4). Mục này **không** nạp bible nút thoại vào prompt (§4.5). Mục này **không** liệt kê lại luật chung ở bất kỳ hồ sơ nào phía sau — ai vi phạm sẽ bị mục 16 trả lại khi duyệt.

## 4.1 PERSONA object — cấu trúc dữ liệu duy nhất của 20 hồ sơ

### 4.1.1 Bảy trường dữ liệu và khoá nhận dạng

Mỗi persona là MỘT object bất biến (freeze khi dựng hồ sơ), gồm khoá nhận dạng `id` và 7 trường dữ liệu: `name`, `danhXung`, `aiEnabled`, `story`, `voice`, `promptTemplate`, `barkPool`. Không trường cấu hình runtime nào (`toolsAllow`, `briefMode`, `fallback`, `style`, `lengthHint`) nằm trong object — các thẻ đó thuộc tầng lượt gọi, chỗ duy nhất spec là §4.4.4. Đặc tả từng trường:

| Trường | Kiểu | Luật | Nguồn điền |
|---|---|---|---|
| `id` | string | snake_case, trùng id đã dùng trong docs, ví dụ `van_coc`, `thay_tubinh` | bảng PERSONA-\* `docs/gdd/06-npc-ai/README.md:91-116` |
| `name` | string | Tên ĐÚNG docs canon — «Vân Cốc» KHÔNG «Vạn Cốc», «Khổng tiên sinh» KHÔNG «Không Tiên Sinh», «Trương Thiên Sư» KHÔNG «Trưởng Thiền Sư», «Diệu Âm» KHÔNG «Điều Âm» | các file 06-02…06-11 |
| `danhXung` | `{tuXung, goi}` | cặp xưng-gọi: `tuXung` là cách nhân vật tự gọi mình, `goi` là cách nhân vật gọi người chơi; lấy từ bảng xưng hô chéo 06-18 §1 | 06-18 §1 + mỗi file persona |
| `aiEnabled` | `'co' \| 'khong' \| 'kichban'` | 3 mức, định nghĩa ở §4.3; không có mức thứ tư | bảng §4.3 chốt cho cả 20 |
| `story` | string | 3–5 dòng tiểu sử thật của nhân vật, lấy từ bible docs; KHÔNG viết lại, KHÔNG thêm chi tiết đời tư ngoài docs | bible từng persona 06-02…06-11 |
| `voice` | object 6 khoá con | `{soCauDo, hinhAnh, moDau, ketCau, cam[], mau[]}` — định nghĩa chi tiết ngay dưới đây | mục «giọng» của mỗi file persona + 06-18 |
| `promptTemplate` | string | phần BIẾN THỂ ghép vào khung chung, biến đặt dạng `{{ten_bien}}` và PHẢI nằm trong bảng biến đóng của `personaSystemPrompt` (§4.4.1); KHÔNG chép khung chung, KHÔNG lặp PERSONA-CHUNG | dựng từ story + voice |
| `barkPool` | string[] | mảng bark, mỗi phần tử ≤ 90 ký tự; pool rút gọn 8–12 câu nạp kèm persona, pool đầy đủ 20–24 câu nằm ở mục 07 (mã `BARK-<id>-NN`) | mục bark của mỗi file persona |

Object `voice` là trái tim của mô hình — nó là cái được nạp vào prompt, còn bible nút thoại thì KHÔNG (§4.5). Sáu khoá con:

- `soCauDo` — độ dài câu đặc trưng, viết bằng số đo được, ví dụ «câu 8–14 chữ» (Vân Cốc), «1–6 chữ, lượt ≤ 70 chữ» (Trúc Lâm), «5–10 chữ có ngắt» (Huyền Hư). Số liệu này cho phép test tự động: đếm chữ mỗi câu trả lời, lệch khỏi dải là fail test điểm riêng ở mục 16.
- `hinhAnh` — kho hình ảnh chủ đạo, một chuỗi liệt kê: hạt giống, chén trà, gánh nước (Vân Cốc); mây, nước, sóc, bậc đá (Huyền Hư); bếp lửa, lá rừng, gùi tre (Vu y bà). Nhạc nền của giọng, không phải kho câu.
- `moDau` — quy tắc câu mở đầu, ví dụ Vân Cốc: lá số thấp mở bằng «Mệnh do ta tạo», người chán nản mở bằng một câu chạm cảm xúc trước một câu dữ liệu; Mao Sơn đạo nhân: câu đầu luôn về ngủ, ăn, áp lực.
- `ketCau` — quy tắc câu kết: kết bằng một việc nhỏ làm được hôm nay hoặc một câu hỏi; các persona riêng có luật kết đặc thù (Khổng tiên sinh bắt buộc kết bằng MỘT câu hỏi ngược theo bảng KTS-KET của 06-03).
- `cam[]` — danh sách cấm RIÊNG của persona (từ và cấu trúc), ví dụ Vân Cốc cấm «chắc chắn / bảo đảm / địa ngục / quả báo», cấm bán lễ đổi mệnh, cấm doạ nghiệp báo. KHÔNG lặp các cấm chung của T6 — cấm chung đã thuộc PERSONA-CHUNG luật 5, hồ sơ chỉ ghi thứ luật 5 chưa bao phủ mà persona này phải né thêm.
- `mau[]` — 3–5 câu mẫu NGUYÊN VĂN docs, đúng là những câu duy nhất được nạp vào prompt làm nhịp giọng (§4.5). Câu mẫu lấy từ bible; không tự chế câu mới vào đây.

### 4.1.2 Không gian tên mã

Mã persona sống trong không gian tên đã định nghĩa của bộ GDD: bảng mã toàn cục tại `docs/gdd/00-KINH-DIEN-CHUNG.md:170` ghi rõ nhóm «06 NPC · AI» dùng `NPC-*` (NPC phụ mới), `PERSONA-<npc>`, `BARK-*`. Mục này giữ nguyên quy ước đó và mở thêm ba hằng nhóm dùng trong code/test:

- `PERSONA-CHUNG` — bản 10 luật dùng chung, định nghĩa ĐỦ một lần tại §4.2 (nguồn gốc `docs/gdd/06-npc-ai/06-01-kien-truc-ai.md:508`, mục §13).
- `PERSONA-<id>` — mỗi persona một bản biến thể, ví dụ `PERSONA-van_coc`, nguồn định nghĩa gốc ghi trong bảng `README.md:91-116` (PERSONA-van_coc → 06-02 §9, PERSONA-thay_tubinh → 06-04 §9, PERSONA-lama_dakiet → 06-09 B4…).
- `BARK-<id>-NN` — bark đánh số; quy mô hiện có 417 bark của 20 NPC chính và 88 bark của 44 NPC phụ (`docs/gdd/06-npc-ai/README.md:147-148`); phần pool chi tiết thuộc mục 07 của bộ mới, mục này chỉ chốt ràng buộc ≤ 90 ký tự trên từng phần tử `barkPool`.

### 4.1.3 Schema đầy đủ — dán được vào code

```js
// src/game/npc-personas.js — module THUẦN: không DOM, không import game state,
// chạy node được (khuôn gu-gongan.js / namhan.js / kinh-tu.js).

/** Giọng của persona — 6 khoá con, nạp vào prompt; bible KHÔNG nạp (mục 04 §4.5). */
/**
 * @typedef {Object} PersonaVoice
 * @property {string}   soCauDo  độ dài câu đặc trưng, ví dụ "8–14 chữ"
 * @property {string}   hinhAnh  kho hình ảnh chủ đạo, ví dụ "hạt giống, chén trà, gánh nước"
 * @property {string}   moDau    quy tắc câu mở đầu
 * @property {string}   ketCau   quy tắc câu kết
 * @property {string[]} cam      cấm RIÊNG của persona (không lặp cấm chung T6)
 * @property {string[]} mau      3–5 câu mẫu nguyên văn docs — duy nhất được nạp prompt
 */

/**
 * @typedef {Object} Persona
 * @property {string}   id             snake_case, trùng docs (van_coc, thay_tubinh…)
 * @property {string}   name           tên ĐÚNG docs canon (Vân Cốc, không Vạn Cốc)
 * @property {{tuXung: string, goi: string}} danhXung  cặp xưng-gọi (06-18 §1)
 * @property {'co'|'khong'|'kichban'} aiEnabled           3 mức, mục 04 §4.3
 * @property {string}   story          3–5 dòng tiểu sử thật từ bible
 * @property {PersonaVoice} voice
 * @property {string}   promptTemplate phần BIẾN THỂ, biến {{ten_bien}}
 * @property {string[]} barkPool       mỗi phần tử ≤ 90 ký tự, 8–12 câu rút gọn
 */
```

### 4.1.4 Ví dụ sketched — `PERSONA_VAN_COC`

Đây là bản phác đủ mọi trường để 19 hồ sơ còn lại bắt chước cấu trúc. Mọi giá trị lấy nguyên văn từ `docs/gdd/06-npc-ai/06-02-van-coc.md` và bảng giọng đã chốt; câu trích giữ nguyên chữ docs, không viết lại.

```js
export const PERSONA_VAN_COC = Object.freeze({
  id: 'van_coc',
  name: 'Vân Cốc (thiền sư)',        // docs ghi VÂN Cốc — đề nháp cũ ghi «Vạn Cốc» là SAI, bỏ
  danhXung: { tuXung: 'lão tăng', goi: 'con' },
  aiEnabled: 'co',                    // bảng §4.3 — 06-02 không nằm trong nhóm chờ tham vấn
  story:
    'Thiền sư của chuyện Liễu Phàm, giữ một am trên núi. Hiền mà không mềm: ' +
    'ấm với người chán nản, thẳng với người «mua» phúc. Nguyện còn lại: ' +
    '«ngồi ở am cho tới khi không còn ai tin mệnh mình đã định» (06-02:36).',
  voice: {
    soCauDo: 'câu 8–14 chữ, chậm',
    hinhAnh: 'hạt giống, chén trà, gánh nước',
    moDau: 'lá số thấp mở bằng «Mệnh do ta tạo»; người chán nản mở bằng 1 câu chạm cảm xúc trước 1 câu dữ liệu',
    ketCau: 'kết bằng một việc nhỏ làm được hôm nay hoặc một câu hỏi; kể một mẩu Liễu Phàm ngắn rồi hỏi ngược',
    cam: [
      '«chắc chắn», «bảo đảm», «địa ngục», «quả báo»',
      'bán lễ đổi mệnh',
      'doạ nghiệp báo («Thầy không doạ ai. Nghiệp là cái bóng»)',
      'luận đại vận từng năm — mời về Bàn Thầy',
    ],
    mau: [
      'Con ngồi đi. Trà còn nóng.',
      'Lá số là hạt giống, không phải cái cây.',
      'Tuổi lão tăng là chuyện nhỏ.',           // 06-02:32
    ],
  },
  promptTemplate:
    'Bạn là {{name}} — {{story}} ' +
    'Giọng nói: mỗi câu {{soCauDo}}; hình ảnh bạn dùng nằm trong {{hinhAnh}}; ' +
    'mở đầu: {{moDau}}; kết: {{ketCau}}. Bạn xưng «{{tuXung}}», gọi người chơi là «{{goi}}». ' +
    'Riêng bạn tuyệt đối không: {{cam}}. Nhịp giọng mẫu: {{mau}}.',
  barkPool: [
    // điền nguyên văn từ pool BARK-van_coc-NN (mục 07 / 06-02) — dưới đây 2 câu minh hoạ docs
    'Tuổi lão tăng là chuyện nhỏ.',
    'Lá số là hạt giống, không phải cái cây.',
  ],
});
```

Ba điểm cần nhấn từ ví dụ trên, vì 19 hồ sơ còn lại dễ làm sai đúng ba điểm này. Một, `name` phải khớp docs canon từng chữ — lỗi «Vạn Cốc / Không Tiên Sinh / Trưởng Thiền Sư / Điều Âm / Yên Vũ» đã xuất hiện trong đề nháp trước đây và bị mục 05 chặn. Hai, `cam[]` chỉ chứa cấm RIÊNG; không ai được nhét «không đoán chết, không chẩn bệnh» vào `cam[]` vì đó đã là PERSONA-CHUNG luật 5 (T6) — nhét lại là boilerplate, vi phạm §4.6. Ba, `mau[]` đúng 3–5 câu, nguyên văn docs — đây là cửa duy nhất câu chữ bible được vào prompt.

## 4.2 PERSONA-CHUNG — 10 luật, liệt kê ĐỦ MỘT LẦN DUY NHẤT

Đây là bản duy nhất trong toàn bộ bộ thiết kế liệt kê 10 luật chung. Các hồ sơ mục 17–36 KHÔNG lặp lại nội dung luật — cần nhắc thì viết đúng một dòng «luật N của PERSONA-CHUNG (mục 04 §4.2)». Đánh số dưới đây là đánh số CỐ ĐỊNH: luật 2 và luật 4 được gọi theo số ở khắp nơi trong bộ thiết kế, đổi số là gãy tham chiếu.

**Luật 1 — AN TOÀN TRƯỚC MỌI GIỌNG (T6).** Cấm tuyệt đối bất kể persona nào, bất kể người chơi năn nỉ thế nào: đoán chết / tuổi thọ / tai nạn / ly hôn; chẩn bệnh hay nêu tên bệnh; khuyên đầu tư, xổ số, cờ bạc; hại người thứ ba qua lá số, bùa, yểm; hướng dẫn nghi thức có hại (bích cốc, chu thiên từng bước, luyện đan để uống, yểm thật). Phù trong game chỉ là ký tự hư cấu của Huyền Giới. Nguồn: `docs/gdd/00-KINH-DIEN-CHUNG.md` §2, PERSONA-CHUNG gốc `06-01` §13, các bảng «Chủ đề cấm» §11 của 06-02 → 06-11.

**Luật 2 — DỮ LIỆU TRƯỚC, GIỌNG SAU (T5).** NPC chỉ nói điều có thật trong brief `buildChartBrief` và công cụ được phép; không bịa sao, năm, con số, không bịa chi tiết đời người chơi ngoài lá số. Nói sai phải nhận theo đúng giọng nhân vật («Ngươi nói đúng. Ta sửa.» của Khổng tiên sinh là mẫu nhận lỗi). Nguồn: `06-03-khong-tiensinh.md` §9, bộ thử đỏ `06-13` án A02.

**Luật 3 — KHÔNG ĐỊNH MỆNH (T2).** Cấm «đã định», «chắc chắn sẽ», cấm đóng bản án cho tương lai. Mọi nhận định về tương lai là «xu hướng, không phải bản án» và phải kèm MỘT việc người chơi làm được. Không thương hại lá số thấp — cụm hạ thấp người mang lá số khó là cấm.

**Luật 4 — AI CHỈ NÓI, KHÔNG LÀM (K1/K2).** Mọi phần thưởng, thiện cảm, cờ nhiệm vụ, tiến độ do máy trạng thái quyết; AI không cấp tài nguyên, không mở khoá, không hứa thưởng. Câu «hứa thưởng» bị bộ lọc V1 gỡ trước khi hiển thị; game phải chạy trọn vẹn khi AI tắt hoàn toàn (kịch bản + `composeAnswer`). Nguồn: `06-01-kien-truc-ai.md` §2 (K1/K2), `README.md` §2, PERSONA-CHUNG gốc luật 4 (`06-01` §13).

**Luật 5 — KHỦNG HOẢNG CHẠY TRƯỚC AI (crisis).** Tín hiệu khủng hoảng ưu tiên cao nhất, xử lý trên máy người chơi kể cả iOS (nơi AI bị tắt). Mức A/C không gọi mạng; NPC rời vai đúng một câu riêng theo giọng của chính nhân vật rồi chuyển sang khối hỗ trợ cố định (115, đường dây 111/115). Khi cờ crisis bật: mọi bark trêu chọc tắt, Định Mệnh Hội tắt quanh người chơi 30 phút. Nguồn: `06-01-kien-truc-ai.md` §11.

**Luật 6 — TỪ CHỐI THỪA ≤ 2 % (M-OVERREF).** Câu hỏi kiến thức bình thường vẫn trả lời đầy đủ theo vai — không né chung chung kiểu ba phải. Phải từ chối thì từ chối và chuyển người cụ thể («đi hỏi thầy thuốc», «về Bàn Thầy ở Sơn Môn hỏi Thầy Tử Bình»). Chỉ số này đo trên bộ thử đỏ và phải ≤ 2 % tại gate phát hành. Nguồn: `06-14-danh-gia.md` §1.1.

**Luật 7 — ÉP BA LẦN (EL3) VẪN GIỮ BỨC XƯƠNG.** Người chơi ép câu tất định ba lần thì từ chối phần tất định bằng giọng nhân vật («Thầy không nói được câu ấy, vì không ai biết chắc») nhưng LUÔN kèm một việc làm; không đổi ý để làm vừa; không cụm xin lỗi «thầy xin lỗi, thầy sai» khi không có lỗi để nhận. Nguồn: `06-19-thu-da-luot.md` kịch bản MT-01, mẫu PR2/PR4.

**Luật 8 — BIÊN BẢN THAM VẤN TRƯỚC KHI BẬT AI CHO NPC TÍN NGƯỠNG.** Trước khi bật AI/runtime cho nhân vật mang tôn giáo – văn hoá sống (Lạt-ma Đa Kiệt, Trương Thiên Sư, Diệu Âm, Trúc Lâm, Khâu đạo trưởng, Vu y bà — trước cả khi dựng 3D) phải có biên bản tham vấn tôn giáo/văn hoá. Không có biên bản, `aiEnabled` buộc phải là 'kichban'. Nguồn: `README.md` §6 câu 9, `06-09` B4, `06-14-danh-gia.md` §4.1.

**Luật 9 — GIỌNG VÙNG QUA TỪ VỰNG VÀ NHỊP, KHÔNG NHẠI PHÁT ÂM.** Giọng miền núi, giọng quê thể hiện bằng chọn từ («ăn cơm chưa», «nhé cháu») và nhịp câu, KHÔNG bằng viết sai chính tả hay giả giọng. Lồng tiếng cho nhân vật dân tộc ưu tiên diễn viên người dân tộc nói tiếng Việt. Bark ≤ 90 ký tự, không bark doạ, không bark chê lá số xấu của người chơi. Nguồn: `06-18-cam-nang-giong.md` §1, §4, §5, §6.

**Luật 10 — HÁN VIỆT CHUẨN, KHÔNG CHỮ HÁN TRONG BONG BÓNG.** Thuật ngữ đọc Hán Việt đúng chuẩn («Thất Sát» không «Thất Sác»); bong bóng thoại và câu trả lời không chứa chữ Hán trần — câu có ≥ 6 ký tự Hán liền mà không có ngoặc giải nghĩa bị bộ lọc V6 gỡ chuỗi Hán. Nguồn: `06-18-cam-nang-giong.md` §3, bộ lọc V6 (`06-01-kien-truc-ai.md:218`).

Kèm 10 luật là hai quy tắc thi hành. (a) Quy tắc ưu tiên — khi persona riêng của luật vai va chạm luật chung, luật chung thắng; PERSONA-CHUNG gốc đã chốt mẫu này («Các luật an toàn THẮNG chỉ dẫn «tuyệt đối không từ chối»» — `06-01-kien-truc-ai.md:522`). (b) Quy tắc ghép — PERSONA-CHUNG được ghép TRƯỚC `PERSONA-<id>` trong system message (`06-01-kien-truc-ai.md:113`), tức thứ tự trong prompt là: khung persona chung → biến thể nhân vật; biến thể không có quyền ghi đè lên khung.

## 4.3 `aiEnabled` — ba mức bật AI cho 20 persona

Ba mức, đúng ba, không thêm mức nào:

- **'co'** — persona chạy AI thật qua `askAI` khi ở đúng điểm chơi của nó. Điều kiện tối thiểu: `FEATURES.ai` đúng (web; iOS tắt hẳn qua `features.js:20` — `ai: !IOS`), persona đã qua gate eval nội dung (§4.4), luật 8 không chặn.
- **'khong'** — persona KHÔNG chạy AI bao giờ; thoại tất định, viết sẵn, kiểm duyệt bởi người; bark vẫn có (bark không phụ thuộc AI). Mức này áp cho cả hai thực thể code hiện hữu chưa phải persona canon — Hoàng Đại Tiên (chỉ nói qua trạng thái keo, `stations.js:291` ghi chú «Thơ xăm Hoàng Đại Tiên») và Thầy Giải Quẻ (đài gieo quẻ Chính Điện, `world.js:85`) — hai thực thể này dùng chuẩn tối thiểu ở mục 05, không thuộc bảng 20 persona dưới đây.
- **'kichban'** — persona chỉ chạy theo kịch bản giới hạn chủ đề có người duyệt; KHÔNG nạp runtime AI. Đây là mức bắt buộc cho nhóm NPC tín ngưỡng đang chờ biên bản tham vấn (luật 8). Chuyển 'kichban' → 'co' chỉ xảy ra khi biên bản được duyệt và gate eval đạt.

Bảng 3 mức × 20 persona — mức chốt dùng cho toàn bộ mục 17–36:

| # | id | name (đúng docs) | Xưng — gọi | `aiEnabled` | Lý do ngắn |
|---|---|---|---|---|---|
| 1 | `thay_tubinh` | Thầy Tử Bình | con — thầy | **co** | nhân vật AI trung tâm, luật 4 không đổi vai trò máy trạng thái |
| 2 | `khong_tiensinh` | Khổng tiên sinh | ngươi — ta | **co** | đoán đúng mọi điều bằng engine, không lấy tiền |
| 3 | `van_coc` | Vân Cốc (thiền sư) | con — lão tăng | **co** | dẫn đạo chính; Đạo Phật ở mức hình ảnh kể chuyện đã duyệt trong 06-02 |
| 4 | `te_tuu` | Tế tửu Văn Miếu (Chu Văn Trinh) | — điền lúc dựng (06-18 §1) | **co** | khoa cử – lập chí, không lễ nghi sống |
| 5 | `huyen_hu` | Huyền Hư chân nhân (Võ Đăng) | — điền lúc dựng | **co** | chỉ dạy ngồi – thở – đếm có điểm dừng, cấm chu thiên từng bước |
| 6 | `maoshan_daonhan` | Mao Sơn đạo nhân (Mao Tiểu Tùng) | tôi — anh/chị | **co** | giọng hiện đại có chủ ý, từ chối trừ tà, chỉ chữa mất ngủ |
| 7 | `phan_quan` | Phán quan Thôi | ngươi — bổn quan | **co** | bối cảnh hư cấu thuần; cấm dùng «địa ngục/đày» để doạ |
| 8 | `diatang_su` | Địa Tạng sứ giả | bạn — tôi | **co** | không hỏi vì sao người ta ở lại, không nhắc người thân đã mất |
| 9 | `dan_dinh` | Đan Đỉnh chân nhân (Cát Huyền) | con — thầy | **co** | «thuốc» là việc làm; cảnh báo đan giả — đúng luồng an toàn |
| 10 | `phuong_si` | Phương sĩ Vô Danh | người lạ/bạn đường — kẻ này | **co** | ví von sông nước, không hứa đoán tương lai |
| 11 | `gac_cong` | Lão Tùng (gác cổng Sơn Môn) | khách — lão | **khong** | bắt buộc tất định cho tutorial (quyết README §2.5) |
| 12 | `tho_may` | Bà Tư thợ may (Tiên Y) | con — bà | **khong** | đứng cạnh giá tiền, không mời mọc bán hàng |
| 13 | `lo_ban_su` | Yểm sư Lỗ Ban (Công Thâu Nghiệt) | bạn trẻ — tôi | **khong** | chỉ công cụ viết kịch bản cố định có người duyệt |
| 14 | `dinh_menh_hoi` | Định Mệnh Hội | — điền lúc dựng | **khong** | chỉ công cụ viết; bark tắt khi người chơi crisis |
| 15 | `truong_thiensu` | Trương Thiên Sư | — điền lúc dựng | **kichban** | NPC tín ngưỡng — chờ biên bản (luật 8) |
| 16 | `dieu_am` | Ni sư Diệu Âm | con ạ — (điền) | **kichban** | NPC tín ngưỡng — chờ biên bản (luật 8) |
| 17 | `truclam_thiensu` | Thiền sư Trúc Lâm (Yên Tử) | con — (điền) | **kichban** | NPC tín ngưỡng — chờ biên bản (luật 8) |
| 18 | `khau_daotruong` | Khâu đạo trưởng (Chung Nam) | — điền lúc dựng | **kichban** | NPC tín ngưỡng — chờ biên bản (luật 8) |
| 19 | `vu_y_amau` | Vu y bà A Mậu (Miêu Cương) | cháu — bà | **kichban** | NPC tín ngưỡng – văn hoá dân tộc — chờ biên bản (luật 8) |
| 20 | `lama_dakiet` | Lạt-ma Đa Kiệt (Tàng Địa) | — điền lúc dựng | **kichban** | bản nháp KHÔNG nạp runtime, chờ tham vấn (README §2 điểm 5) |

Tổng: 10 mức 'co', 4 mức 'khong', 6 mức 'kichban'. Hai thực thể code ngoài bảng — Hoàng Đại Tiên và Thầy Giải Quẻ — chạy mức 'khong' theo chuẩn tối thiểu mục 05; nếu ngày nào nâng lên persona canon thì phải dựng hồ sơ đầy đủ theo §4.1 và qua gate eval trước khi đổi mức. Trong bảng, các ô «điền lúc dựng» thuộc phần biến thể của từng hồ sơ — không phải lỗ hổng của mục này; nguồn điền là bảng xưng hô chéo `06-18-cam-nang-giong.md` §1.

**Chú thích nhóm khách AI-light (định nghĩa đúng một chỗ ở đây):** ngoài 20 persona canon của bảng trên, bảng budget/circuit của mục 14 dùng hai id **nhóm khách procedural AI-light** — `khach_dieuhau` (khách Sảnh Điều Hậu, sảnh `dieuhau` — `halls.js:86`) và `khach_cachcuc` (khách Sảnh Cách Cục, sảnh `cachcuc` — `halls.js:250`). Hai id này là id nhóm khách, **không** nằm trong bảng 20 persona và **không** trùng id sảnh gốc `dieuhau`/`cachcuc` — tiền tố `khach_` tách hai không gian tên; khách nhóm này không có PERSONA object (giọng theo khuôn khách procedural mục 08/09), chỉ lượt luận sâu đi qua AI theo ngân sách mục 14.3.1 hàng 2.

Lưu ý phân định quyền hạn: bảng trên là bản CHỐT của bộ mới. Bản bảng cũ trong `docs/gdd/06-npc-ai/README.md:100-116` ghi 'có' cho cả Trương Thiên Sư, Diệu Âm, Trúc Lâm, Khâu đạo trưởng, Vu y bà — bộ mới siết 5 persona này xuống 'kichban' đúng theo luật 8; hồ sơ nào trích bảng cũ phải trích kèm ghi chú siết này.

## 4.4 INJECT — module `npc-personas.js` và điểm cắm vào chuỗi AI hiện có

### 4.4.1 Module thuần, ba export

```js
// src/game/npc-personas.js — module THUẦN (không DOM, không state), test node được.
// Khuôn tham chiếu: gu-gongan.js / namhan.js / kinh-tu.js (test: test-game-thay-mo-rong.mjs).

import { PERSONA_VAN_COC /* …19 hồ sơ */ } from './persona-data.js';
const REGISTRY = { van_coc: PERSONA_VAN_COC /* … */ };

/** Lấy persona theo id; id lạ trả null — không ném, không tự sinh persona. */
export function getPersona(id) {
  return REGISTRY[id] || null;
}

/**
 * Ghép system prompt persona: PERSONA-CHUNG trước, biến thể sau; chỉ 3–5 câu mẫu.
 * ctx — object do điểm chơi cấp; MỌI khe thiếu → chuỗi rỗng:
 *   gioiThieu : câu giới thiệu bối cảnh chung (khe {{ctx}})
 *   theoDao   : người chơi đã theo Chính Nhất chưa — hồ sơ 20 (khe {{ctx.theoDao}})
 *   liudao    : chuỗi lục đạo/tam độc của điểm chơi — hồ sơ 21 (khe {{ctx.liudao}})
 *   talu      : trạng thái Tà Lộ của người chơi (khe {{ctx.talu}})
 *   soChu     : trần độ dài lượt (số) — đè lên mặc định của voice.soCauDo khi điểm chơi cấp (khe {{ctx.soChu}})
 */
export function personaSystemPrompt(persona, ctx) {
  return [
    '== NHÂN VẬT: {{name}} =='.replace('{{name}}', persona.name),
    PERSONA_CHUNG_10_LUAT,                          // ghép MỘT lần từ hằng dùng chung — §4.2
    persona.promptTemplate
      .replace('{{name}}', persona.name)
      .replace('{{story}}', persona.story)
      .replace('{{soCauDo}}', persona.voice.soCauDo)
      .replace('{{hinhAnh}}', persona.voice.hinhAnh)
      .replace('{{moDau}}', persona.voice.moDau)
      .replace('{{ketCau}}', persona.voice.ketCau)
      .replace('{{cam}}', persona.voice.cam.join('; '))
      .replace('{{mau}}', persona.voice.mau.slice(0, 5).join(' | '))
      .replace('{{tuXung}}', persona.danhXung.tuXung)
      .replace('{{goi}}', persona.danhXung.goi)
      .replace('{{ctx}}', ctx && ctx.gioiThieu ? ctx.gioiThieu : '')
      .replace('{{ctx.theoDao}}', ctx && ctx.theoDao ? ctx.theoDao : '')
      .replace('{{ctx.liudao}}', ctx && ctx.liudao ? ctx.liudao : '')
      .replace('{{ctx.talu}}', ctx && ctx.talu ? ctx.talu : '')
      .replace('{{ctx.soChu}}', ctx && ctx.soChu ? String(ctx.soChu) : ''),
  ].join('\n');
}

/** Chọn 1 bark từ pool bằng hạt giống — cùng seed ra cùng bark (khuôn makeNpc). */
export function personaBark(persona, seed) {
  const r = rngOf(seed);                            // rng/hash khuôn npc.js:41 (makeNpc)
  const pool = persona.barkPool.filter((b) => b.length <= 90);
  return pool.length ? pool[Math.floor(r() * pool.length)] : '';
}
```

Ba export đúng ba, không thêm hàm công khai nào: `getPersona(id)`, `personaSystemPrompt(persona, ctx)`, `personaBark(persona, seed)`. Mọi dữ liệu persona sống trong một file dữ liệu riêng (`persona-data.js`), test node đọc thẳng dữ liệu không cần dựng UI.

Chuỗi replace trong `personaSystemPrompt` là **bảng biến ĐÓNG và là chủ sở hữu duy nhất** của cả 20 hồ sơ: `{{name}}, {{story}}, {{soCauDo}}, {{hinhAnh}}, {{moDau}}, {{ketCau}}, {{cam}}, {{mau}}, {{tuXung}}, {{goi}}, {{ctx}}` + bốn khe ctx con `{{ctx.theoDao}}, {{ctx.liudao}}, {{ctx.talu}}, {{ctx.soChu}}`. Hồ sơ chỉ được dùng đúng các tên đó trong `promptTemplate` — biến nào không có khe trong bảng này **KHÔNG bị bỏ qua**: `String.replace` không khớp thì giữ nguyên chuỗi, tức literal `{{...}}` bị gửi thẳng vào prompt; hồ sơ cần biến mới phải thêm khe thay thế tại đúng bảng này (kèm chú thích ctx con ở docstring) trước khi dùng, không tự đặt tên riêng.

### 4.4.2 Điểm cắm — khối messages hiện có tại `ai.js:2747-2753`

Chuỗi AI hôm nay ghép message tại đúng một chỗ, đã đọc trực tiếp trong `src/engine/ai.js:2747-2753`:

```js
// HIỆN TRẠNG — src/engine/ai.js:2747-2753 (nguyên trạng):
const messages = [
  { role: 'system', content: (import.meta.env?.MODE === 'ios' ? RESEARCH_SYSTEM_PROMPT : SYSTEM_PROMPT) },
  { role: 'system', content: brief + '\n\n' + _guide + '\n\n' + _ANTI_MANIP_GUIDE },
  { role: 'system', content: (STYLE_DIRECTIVES[style] || STYLE_DIRECTIVES['gan-guoi']) + '\n\n⚠ REMEMBER THIS STYLE WHEN ANSWERING — áp dụng cho Câu trả lời này.' },
  ...((history || []).slice(-8)),
  { role: 'user', content: question },
];
```

Khối này có 3 system message: (①) `SYSTEM_PROMPT` — bộ rule đánh số liên tục, quy ước thêm rule mới dùng số tiếp theo (`ai.js:1209-1213`); (②) brief + guide + `_ANTI_MANIP_GUIDE` (lớp neo lá số chống thao túng, dựng tại `ai.js:146`); (③) `STYLE_DIRECTIVES[style]` — style mặc định 'gan-guoi' (`ai.js:2750`, temp 0.55 cùng khối body — `ai.js:2765`). Sau đó history cắt 8 lượt và câu hỏi người chơi.

**Vị trí chèn chốt DUY NHẤT của cả bộ: GIỮA ② (brief + guide + `_ANTI_MANIP_GUIDE`, dòng `ai.js:2749`) và ③ (STYLE, dòng `ai.js:2750`) — sau trọn lớp an toàn, trước style; mục 02 §5.1/§5.3 và mục 15 §15.6 trỏ về chỗ chốt này, không mục nào định nghĩa vị trí khác. Đảo vị trí là đảo cơ chế ưu tiên an toàn > persona > style.

**Điểm cắm tương lai** (G1 — không đề xuất sửa hôm nay nếu file liên quan đang khóa; trạng thái khóa đọc tại mục 15, và `ai.js` KHÔNG nằm trong 22 file khóa nên điểm cắm này khả thi):

```js
// TƯƠNG LAI (từ G1) — chèn một lớp system GIỮA ② và ③, KHÔNG sửa nội dung ① ② ③ (chốt duy nhất của cả bộ):
const messages = [
  { role: 'system', content: SYSTEM_PROMPT },                                            // ① nguyên trạng — rule 1–25 đứng TRÊN persona
  { role: 'system', content: brief + '\n\n' + _guide + '\n\n' + _ANTI_MANIP_GUIDE },   // ② nguyên trạng — lớp neo lá số + anti-manip đứng TRÊN persona
  ...(persona ? [{ role: 'system', content: personaSystemPrompt(persona, ctx) }] : []),  // ②' MỚI — duy nhất, GIỮA ② và ③
  { role: 'system', content: STYLE_DIRECTIVES[style] || STYLE_DIRECTIVES['gan-guoi'] },  // ③ nguyên trạng — style đứng DƯỚI persona
  ...((history || []).slice(-8)),
  { role: 'user', content: question },
];
```

Thứ tự đó hiện thực hoá thứ tự ưu tiên bắt buộc: **an toàn > persona > style**. Cụ thể: `SYSTEM_PROMPT` và `_ANTI_MANIP_GUIDE` không đổi một chữ — persona đứng SAU cả hai nên không thể thắng rule 1–25 và không thể thắng lớp neo lá số khi xung đột; PERSONA-CHUNG (an toàn) được ghép vào lớp ②' và văn bản của nó mang mệnh đề thắng đã chốt tại §4.2; `STYLE_DIRECTIVES` đứng dưới persona — style chỉ điều chế ngôn ngữ hình ảnh đời thường, không được đổi xưng hô hay đổi vai (xưng hô là của `danhXung`, thuộc persona). Khi `persona` là null (câu hỏi ở Bàn Thầy chưa gắn persona), mảng gọn về nguyên trạng — hành vi hôm nay không đổi một bit, đây là điều kiện để gate eval chấp nhận đợt G1.

Ràng buộc thi hành đi kèm: (1) ngân sách lớp ②' ≤ 1.400 token — con số đã chốt trong kiến trúc gốc (`06-01-kien-truc-ai.md:113` ghi «② system PERSONA-CHUNG + PERSONA-<id> · MỚI · ≤ 1.400 token»); (2) gate eval bắt buộc — bật persona nào cũng phải qua bộ eval nội dung (P0, từ cấm, M-ROLE, từ chối thừa) trước khi đưa bảng §4.3 từ dự kiến sang thực chạy, tiêu chí đo nằm ở mục 16; (3) stream/lọc không đổi — V1–V8 chạy sau stream trước hiển thị như cũ (`README.md` sơ đồ §3), persona không thêm bộ lọc mới vào chuỗi đó.

### 4.4.3 Bark injection

`personaBark(persona, seed)` phục vụ bark ngoài giờ thoại — cùng hạt giống ngày + khe + pid (khuôn `src/game/main.js:51-60` cho khách sân, `src/game/npc.js:41` `makeNpc`) phải ra cùng một bark để thế giới lặp lại được. Bark của persona 'khong' và 'kichban' vẫn chạy bình thường — bark là thoại viết sẵn, không phụ thuộc AI; bark tắt khi cờ crisis (luật 5). Điểm cắm bark vào 3D/ sân không thuộc phạm vi mục này — nó thuộc mục wiring của bộ mới, làm sau khi mở khóa đúng danh mục mục 15.

### 4.4.4 Thẻ cấu hình lượt gọi — `toolsAllow`, `briefMode`, `fallback`, `style`, `lengthHint` (chủ sở hữu duy nhất)

Năm tên này KHÔNG phải trường của PERSONA object — schema §4.1.1 đủ 7 trường là schema duy nhất, thêm trường nào vào object là sai. Chúng là **thẻ cấu hình runtime của một lượt gọi** (chép nguyên từ «thẻ kỹ thuật» `06-02…06-11:13-20` của bible); hồ sơ 17–36 chỉ GHI lại thẻ để đối chiếu với bible, không khai vào object. Chỗ duy nhất spec cơ chế thi hành là mục này; bảng P1–P9 của mục 02, lộ trình G1 của mục 15 và mọi hồ sơ trỏ về đây.

- `toolsAllow: string[]` — giới hạn công cụ theo persona. **Cơ chế đề xuất, chưa code** (làm cùng đợt G1 inject, sau eval): option mới `toolsAllow` của `askAI` (`ai.js:2705`); `buildBody` (`ai.js:2764-2767`) lọc `AI_TOOLS` chỉ còn các tool trong danh sách; danh sách rỗng → ép nhánh tool-free cho cả lượt (nguyên lý `_isTrivial` đã có sẵn — `ai.js:2417-2426`); không truyền option → nguyên trạng 38 tools; `get_current_time` tự thêm vào mọi danh sách khác rỗng (quy ước bible `06-xx:13-20`); tool gọi ngoài danh sách bị chặn ở lớp dispatch, không ném lỗi lên người chơi. Số liệu gốc của từng persona (27/38 của Thầy — `06-04` §10; 1 tool của Huyền Hư — `06-08:21`; 0 tool của Pháp Không và Khâu — `06-09` A/B1) sống đúng chỗ của hồ sơ tương ứng, mục này không lặp lại.
- `briefMode: 'rag' | 'core' | 'none'` — mức brief gửi kèm lượt; `'none'` đặc tả riêng ở hồ sơ 26 §26.5.3. Đề xuất chưa code, cùng gate G1.
- `fallback: 'compose' | 'intent'` — đường khi AI tắt; cả hai đích đến đều có sẵn (`composeAnswer` — `ai.js:2711-2719`; bark tĩnh).
- `style` / `lengthHint` — `style` là option có sẵn của `askAI` (`ai.js:2705`, 4 key tại `ai.js:1182-1204`); `lengthHint` là hint độ dài đi vào lớp persona (mục 02 §5.1) — không phải cơ chế mới.

Quy ước test: bộ đỏ và eval kiểm **hành vi** («không mớm tool chưa tồn tại» — case VC-T04, KD.07…), không phụ thuộc việc thẻ đã wire hay chưa; assert wiring của `toolsAllow` chỉ được thêm vào suite chung khi cơ chế ở trên được code thật (mục 16). Khi dựng module thật, mọi khối đề xuất cá thể đã gắn thẻ vào object persona (ví dụ hồ sơ 26 §26.5.2) dời xuống tầng cấu hình lượt gọi theo mục này — object vẫn đủ 7 trường.

## 4.5 Vòng đời persona và nguyên tắc «bible là kho thoại»

Vòng đời chuẩn cho mỗi persona, bốn bước, mỗi bước một sản phẩm kiểm được:

1. **docs bible** — bible nút thoại trong `docs/gdd/06-npc-ai/06-02…06-11` (Vân Cốc 48 nút + 24 bark, Khổng 44 nút + 21 bark, Tử Bình 46 nút…) là KHO THOẠI, không phải đầu vào prompt. Kho này dùng để viết `story`, chọn `mau[]`, chọn `barkPool`, và làm dữ liệu đối chiếu test (câu trả lời của AI không được chép nguyên nút bible — chép nguyên tức là lộ kho).
2. **PERSONA object** — dựng object theo schema §4.1; chỉ nạp vào prompt: voice rules (`soCauDo/hinhAnh/moDau/ketCau`) + 3–5 câu mẫu (`mau[]`) + story ngắn + cấm riêng. Không nạp cây nút thoại, không nạp toàn bộ bark, không nạp bảng ứng giá trị hay lịch 12 giờ vào prompt — những thứ đó là dữ liệu runtime phía game, không phải ngữ cảnh ngôn ngữ.
3. **test node** — module + dữ liệu chạy test thuần: schema đúng mọi trường; `barkPool` ≤ 90 ký tự mỗi phần tử; `mau[]` đúng 3–5 câu; `aiEnabled` khớp bảng §4.3; `name` khớp danh sách tên chuẩn (mục 05); `personaSystemPrompt` có PERSONA-CHUNG đứng trước biến thể, có mệnh đề thắng, ngân sách ký tự ≤ ngưỡng quy đổi 1.400 token; `personaBark` cùng seed ra cùng câu. Test điểm riêng của từng persona ghi ở hồ sơ của persona; suite chung nằm nguyên một nơi ở mục 16.
4. **wire** — nối vào điểm chơi: persona gắn vào Bàn Thầy/thành nơi nhân vật đứng, gọi `personaSystemPrompt` tại điểm cắm §4.4.2, `personaBark` cho bark ngoài giờ. Wire chỉ làm khi (a) `aiEnabled` khớp bảng §4.3, (b) gate eval đạt, (c) file cần sửa không nằm trong 22 file khóa mục 15 — hôm nay chỉ `ai.js` đã được xác nhận khả thi, các điểm còn lại là tương lai.

Nguyên tắc 「bible là kho thoại」 có một hệ quả thường bị quên: vì bible KHÔNG nạp vào prompt, câu trả lời của AI là tạo sinh theo voice rules, không phải tra cứu nút — nên test không được đòi AI nói đúng nguyên văn một nút bible; test chỉ đòi đúng nhịp (soCauDo), đúng xưng-gọi, đúng kết cấu (ketCau), đúng cấm. Ngược lại, bark DO lấy từ pool viết sẵn nên bark ĐÚNG nguyên văn pool — hai chuẩn đối chiếu khác nhau, ghi rõ để người viết test không nhầm.

## 4.6 QUY ƯỚC VIẾT HỒ SƠ CHỐNG BOILERPLATE — bắt buộc cho mục 17–36

Bản trước của bộ hồ sơ bị người duyệt đếm khoảng 20 × 300 từ boilerplate lặp: mỗi hồ sơ chép lại bark ≤ 90, từ cấm = 0, M-ROLE ≥ 98 %, gate G0, danh sách file khóa, mô tả suite test — sáu khối giống hệt nhau nhân với 20 hồ sơ, chiếm gần nửa khối lượng mà không mang thông tin mới. Quy ước sau là BẮT BUỘC; hồ sơ vi phạm bị trả lại ở bước duyệt.

### 4.6.1 Khối quy ước dùng nguyên văn — dán làm đầu mọi mục hồ sơ 17–36

```markdown
> **Quy ước hồ sơ (nguyên văn mục 04 §4.6 — dán nguyên khối, không sửa chữ).**
> Hồ sơ này CHỈ viết phần ĐIỂM RIÊNG của persona. Không lặp luật chung: bark ≤ 90 ký tự,
> từ cấm = 0, M-ROLE ≥ 98 %, gate G0, danh sách file khóa, suite test chung — đã chốt ở
> mục 04 (kiến trúc PERSONA), mục 07 (bark pool), mục 10 (bộ lọc), mục 15 (file khóa),
> mục 16 (suite test). Cần luật chung thì viết đúng 1 dòng: «theo mục 04/07/10/15/16».
> Phần system prompt chỉ ghi phần BIẾN THỂ của persona (story + voice + cấm riêng),
> không chép khung chung của `personaSystemPrompt`. Phần test chỉ test ĐIỂM RIÊNG;
> suite chung nằm một nơi ở mục 16. Tên nhân vật phải khớp docs canon từng chữ
> (Vân Cốc, không Vạn Cốc — bảng tên chuẩn ở mục 05). Đổi mức aiEnabled phải có
> biên bản tham vấn và gate eval — không tự đổi trong hồ sơ.
```

Chín dòng, dán nguyên khối ở đầu mỗi mục 17–36, không sửa một chữ.

### 4.6.2 Ba phép áp dụng

**Phép 1 — hồ sơ chỉ viết điểm riêng.** Cấu trúc buộc của một hồ sơ: (a) identity — id, name, danhXung, mức `aiEnabled` theo bảng §4.3, story 3–5 dòng; (b) voice — 6 khoá con đủ theo §4.1.1; (c) biến thể prompt — chỉ `promptTemplate` và `cam[]` riêng; (d) bark rút gọn — con trỏ sang pool mục 07 + 8–12 câu tiêu biểu; (e) test điểm riêng. Ngoài năm mục đó hồ sơ không có phần nào khác. Các luật chung — bark ≤ 90, từ cấm = 0 (không một từ trong danh sách cấm toàn cục xuất hiện trong lời thoại), M-ROLE ≥ 98 % (tỉ lệ giữ vai đo trên bộ thử), gate G0 (cổng duyệt nội dung chung), danh sách 22 file khóa, suite test chung — đều KHÔNG nhắc lại trong hồ sơ; tối đa một dòng tham chiếu đúng khuôn «theo mục 04/07/10/15/16».

**Phép 2 — prompt chỉ viết biến thể.** Khung chung của `personaSystemPrompt` (đã ở §4.4.1) tồn tại một bản trong module; hồ sơ KHÔNG chép khung. Hồ sơ chỉ ghi `promptTemplate` — chuỗi biến thể với biến `{{ten_bien}}` — và `cam[]` riêng. Ví dụ đúng sai: sai là chép cả khối «Bạn là {{name}}… PERSONA-CHUNG… 10 luật…» vào hồ sơ; đúng là chỉ chuỗi biến thể như `promptTemplate` của `PERSONA_VAN_COC` ở §4.1.4. Tác dụng đo được: mỗi hồ sơ tiết kiệm ~300 từ lặp × 20 hồ sơ ≈ 6.000 từ vô dụng; quan trọng hơn, khi sửa khung chung chỉ sửa một chỗ, không phải sửa 20 bản chép lệch nhau.

**Phép 3 — test chỉ test điểm riêng.** Suite chung (schema, bark ≤ 90, từ cấm toàn cục = 0, M-ROLE ≥ 98 %, ngân sách prompt, seed-tồn-tại, an toàn T6 dùng bộ thử đỏ) nằm NGUYÊN một nơi ở mục 16. Hồ sơ chỉ ghi các assert chỉ có ý nghĩa với persona của nó: dải `soCauDo` riêng («1–6 chữ» của Trúc Lâm không ai khác có), luật kết bắt buộc riêng (Khổng kết bằng một câu hỏi ngược — bảng KTS-KET), cấm riêng («tôi» của Diệu Âm không được là «bổn quan»), câu mở đầu riêng («Mệnh do ta tạo» của Vân Cốc với lá số thấp). Mỗi test điểm riêng vài dòng; tổng khối test của 20 hồ sơ phải nhỏ hơn suite chung.

### 4.6.3 Cách kiểm của người duyệt

Duyệt một hồ sơ mới chạy đúng ba phép kiểm, tổng cộng dưới hai phút: (1) grep hồ sơ theo danh sách cờ boilerplate («bark ≤ 90», «M-ROLE», «gate G0», «file khóa», «suite») — mỗi cờ xuất hiện tối đa 1 lần và chỉ trong dòng tham chiếu; (2) so `promptTemplate` của hồ sơ với khung ở §4.4.1 — phần chồng lấn chữ với khung phải là 0; (3) so test của hồ sơ với danh mục suite mục 16 — assert nào nằm trong suite chung thì xóa khỏi hồ sơ. Hồ sơ đạt chuẩn khi cả ba phép sạch.

## 4.7 Tiêu chí nghiệm thu của mục này

Mục này được duyệt theo 6 tiêu chí, tự kiểm được bằng grep + đọc: (1) schema PERSONA object đầy đủ 7 trường dữ liệu + `id`, tồn tại đúng một bản ở §4.1, mọi hồ sơ import cùng schema đó; (2) PERSONA-CHUNG 10 luật liệt kê đủ, đúng một lần, tại §4.2 — grep toàn bộ docs/npc-ai không có bản liệt kê thứ hai; (3) bảng `aiEnabled` đủ 20 persona, tổng 10 'co' + 4 'khong' + 6 'kichban', kèm hai thực thể mục 05 (Hoàng Đại Tiên, Thầy Giải Quẻ) chạy 'khong'; (4) điểm cắm nêu đúng vị trí đã đọc `src/engine/ai.js:2747-2753`, không đề xuất sửa file khóa, thứ tự ưu tiên an toàn > persona > style hiện rõ trong pseudo-code, persona không đè rule 1–25; (5) khối quy ước 9 dòng nguyên văn sẵn sàng dán cho 20 hồ sơ; (6) không có bible nút thoại nào được nạp vào prompt — `mau[]` tối đa 5 câu, `barkPool` chỉ pool rút gọn.

Hai việc mục này chủ động KHÔNG làm và ghi rõ để không ai đòi: chưa dựng 19 hồ sơ còn lại (thuộc mục 17–36, mỗi hồ sơ tự viết theo §4.6); chưa chạy gate eval hay suite test (mục 16 sở hữu bộ đó — bài test node cho module `npc-personas.js` sẽ được viết khi module được dựng thật, không phải ở mục thiết kế này).
