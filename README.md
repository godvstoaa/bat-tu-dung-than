# Bát Tự · Dụng Thần — Ứng dụng luận mệnh Tử Bình (đã nâng cấp toàn diện + AI)

Ứng dụng lập lá số Bát Tự (Tứ Trụ), xác định **Cách Cục (格局)** và **Dụng Thần (用神)** theo
chính thống Tử Bình, kết hợp **AI luân giải** để trả lời **bất kỳ câu hỏi nào** về lá số.

## Kiến trúc

```
src/
├── main.js                 # UI: render Tứ Trụ / Cách Cục / Ngũ Hành / Hội-Hợp / Thần Sát / Đại Vận / Lưu Niên / Chat AI
├── style.css               # Giao diện (dark, phong cách huyền học)
└── engine/
    ├── constants.js        # Dữ liệu kinh điển: Can-Chi, Tàng can, Ngũ hành, Thập thần, Bảng Điều Hậu (窮通寶鑑)
    ├── core.js             # Hàm thuần: Thập Thần, Trường Sinh (dùng chung, không phụ thuộc vòng)
    ├── interactions.js     # Hình–Xung–Hội–Hợp (刑沖會合): can ngũ hợp, chi lục/tam hợp, tam hội, lục xung, tam hình, lục hại
    ├── shensha.js          # 15 Thần Sát (神煞): Thiên Ất, Thiên Đức, Nguyệt Đức, Tam Kỳ, Văn Xương, Học Đường, Lộc, Nhận, Đào Hoa, Dịch Mã, Tướng Tinh, Hoa Cái, Kim Dư, Hồng Diễm, Quù Cương
    ├── pattern.js          # Định Cách Cục theo 子平真詮 (8 chính cách + Kiến Lộc/Nguyệt Kiếp/Nhận + ngoại cách: Tòng/Chuyên Vượng)
    ├── combos.js           # Tổ hợp Thập thần (官印相生/杀印相生/食神制杀/伤官见官/枭神夺食...)
    ├── liuqin.js           # Lục Thân — phân tích 6 hạng quan hệ qua Cung vị (4 trụ) + Thập thần tinh
    ├── tiers.js            # Khung 9 tầng phân tích học thuật (mỗi lĩnh vực → 9 lớp)
    ├── remedy.js           # 逆天改命 — động cơ cải vận (12 pháp + 了凡四训) cá biệt theo Dụng/Hỷ/Kỵ
    ├── synthesis.js        # Tổng luận Mệnh — chấm đẳng cấp + phú quý theo 5 chiều (cách/tình/lực/thanh trọc/phối hợp)
    ├── chart.js            # Động cơ chính: Tứ Trụ → Ngũ Hành → Vượng Suy → Dụng Thần → 用喜忌仇 → Đại Vận → Lưu Niên → Tổng luận
    ├── kb.js               # Cơ sở tri thức: ý nghĩa sâu Thập Thần, Hội-Hợp, Cách Cục, ánh xạ lĩnh vực
    ├── interpret.js        # Luận giải theo 7 lĩnh vực (tab)
    ├── nlg.js              # Tầng luận giải linh hoạt: định danh ý định → soạn câu trả lời cho câu hỏi TỰ DO
    ├── family.js           # NGHIỆM CHỨNG GIA TỘC: 6 trục nhất quán đa lá số + analyzeFamily (chấm cluster + ledger + radar)
    ├── family-diagram.js   # Dữ liệu sơ đồ: chòm sao (radial) + ma trận cặp + radar 6 trục
    ├── family-rectify.js   # HIỆU CHỈNH GIỜ SINH (校正时辰): quét 12 giờ, rank theo coherence gia tộc
    └── ai.js               # Tích hợp LLM (OpenAI-compatible, mặc định GLM-5.2 Z.ai) + fallback cục bộ + chart brief
```

## Bộ 用喜忌仇 (Dụng – Hỷ – Kỵ – Thù) — đầy đủ

Không chỉ có Dụng Thần & Kỵ Thần, app tính **đủ 4 tầng** theo cổ pháp (cơ sở để tổng hợp kết luận):

| Tầng | Định nghĩa | Vai trò |
|------|-----------|---------|
| **用神 Dụng** | "thuốc" cân bằng mệnh cục | chìa khoá khai vận |
| **喜神 Hỷ** | sinh trợ Dụng Thần | sức mạnh thứ hai, gặp vận Hỷ thì Dụng thêm vững |
| **忌神 Kỵ** | khắc Dụng Thần | gây hại trực tiếp |
| **仇神 Thù** | sinh nuôi Kỵ Thần | hại gián tiếp, năm/vận mang Thù phải đề phòng Kỵ mạnh lên |

## Nghịch Thiên Cải Mệnh (逆天改命) — động cơ cải vận

Thẻ **"Nghịch Thiên Cải Mệnh"** sinh kế hoạch cải vận **cá biệt** theo Dụng/Hỷ/Kỵ:

- **改运十二法** (12 pháp): phương vị, sắc thái, nghề nghiệp, phong thuỷ cư trú, số lý, ẩm thực dưỡng sinh, dụng cụ/trang sức, chọn thời (lưu niên cát), hợp bạn đời, tu dưỡng theo can, **tích âm đức**, khiêm đức.
- **了凡四训**: khung cải mệnh đích thực — "mệnh do ta lập, phúc do ta cầu". Tích âm đức (积阴德) là pháp **DUY NHẤT** thật sự nghịch thiên.
- **Hóa giải tổ hợp hung**: đề xuất cụ thể cho 伤官见官/枭夺食/官杀混杂/财多身弱/杀攻身.
- **Thời điểm vàng**: các lưu niên CÁT mang Dụng/Hỷ sắp tới (để择吉 tiến thủ).

## Phân tầng 9 lớp học thuật

Mỗi lĩnh vực (sự nghiệp, tài lộc, tình duyên, sức khỏe, học vấn) được luận qua **9 tầng**:
1. Ngũ Hành bản khí → 2. Thập Thần → 3. Cách Cục → 4. 用喜忌仇 → 5. Hội–Hợp–Xung–Hình
→ 6. Đại Vận/Lưu Niên → 7. Thần Sát → 8. Cổ điển (滴天髓/窮通寶鑑) → 9. Kết luận cấp độ.

## Lục Thân (六亲)

Phân tích 5 hạng quan hệ gia đình (cha, mẹ, anh chị em, vợ/chồng, con cái) qua **2 chiều cổ pháp**:
- **Cung vị** (tĩnh): 年=ổ祖, 月=cha mẹ/huynh đệ, 日 chi=phối ngẫu, 时=con cái.
- **Tinh** (động): Thập thần đại diện (vd nam: cha=Thiên Tài, vợ=Chính Tài, con=Quan Sát).

## Nghiệm chứng gia tộc (家族八字交叉验证)

Nhập lá số người trung tâm (form sinh chính, vd: em gái) + thêm người thân
(bố/mẹ/anh chị/chồng/con) → hệ thống chấm **độ nhất quán** giữa các lá số theo
**6 trục cổ pháp** (家族八字互验法 + 校正时辰):

| Trục | Cân | Cơ sở |
|------|-----|-------|
| **Vai trò phản nghiệm** (十神角色互验) | 0.35 | 日 chủ người thân = đúng hành vai trò (子平真诠) |
| **Cung★ tiền nghiệm** (星宫交叉验证) | 0.20 | cung + sao dự đoán ↔ thực tế lá người thân |
| **Can-Chi tương tác** | 0.15 | hợp/xung ngày-tháng giữa 2 lá |
| **Cân bằng Ngũ Hành gia tộc** | 0.15 | gia đình có bổ Dụng Thần cho nhau |
| **Thời vận tương quan** | 0.10 | năm sinh người thân rơi đại vận CÁT |
| **Nạp âm tương quan** | 0.05 | nạp âm nhật trụ sinh/khắc |

Xuất: **điểm cluster 0-100** + rating, sơ đồ **chòm sao** (trung tâm ở giữa,
người thân tỏa ra, nhánh xanh/vàng/đỏ) + **ma trận cặp N×N** + **radar 6 trục**
+ **sổ cái xác/nghiệm** chi tiết từng cặp.

Nếu 1 người đánh **"giờ chưa rõ"** → **hiệu chỉnh giờ sinh (校正时辰)**: quét 12
时辰, mỗi giờ tính lại coherence cụm (trọng số vai trò con vì trụ Giờ = cung Tử Nữ),
lấy giờ cho điểm nhất quán cao nhất làm ứng viên giờ sinh thật.

> An toàn: mọi chuỗi do người dùng nhập đều được escape trước khi render (chống XSS).
> Cơ sở: 家族八字互验法, 校正时辰 qua gia tộc. Kết quả tham khảo văn hoá–huyền học.

## Phương pháp luận Dụng Thần (用神) đã tích hợp

Hệ thống dùng **đầy đủ 4 phép** lấy Dụng Thần (thay vì chỉ Phù Ức như bản cũ):

| Phép | Khi nào dùng |
|------|--------------|
| **Phù Ức (扶抑)** | Cơ sở — thân vượng thì tiết/khắc/hao, thân nhược thì sinh/trợ |
| **Thông Quan (通关)** | Hai hành tương khắc đều mạnh, khíết → dùng hành cầu nối cho ngũ hành lưu thông |
| **Bệnh Dược (病药)** | Tìm "bệnh" (hành thái quá) và "dược" trị — "có bệnh phương hữu quý" |
| **Điều Hậu (调候)** | Điều hòa hàn–noãn–táo–thấp theo 窮通寶鑑 (bảng 120 tổ hợp Nhật Can × Nguyệt Chi) |

Cộng hưởng với **Cách Cục (格局)** theo 子平真詮: chính cách dùng nguyên tắc
**thuận dụng** (Tài–Quan–Ấn–Thực) / **nghịch dụng** (Sát–Thương–Kiêu–Nhận);
ngoại cách (Tòng / Chuyên Vượng) thì **thuận theo thế cục**.

## Nguồn dữ liệu (đã đối chiếu các nguồn Hồng Kông / Trung Quốc)

Dữ liệu huyền học là **kiến thức tất định, ổn định hàng thế kỷ**, được mã hóa trực tiếp
từ các văn bản kinh điển và đối chiếu qua các nguồn chuyên môn:

- **子平真詮** (Tử Bình Chân Toàn) — nguyên lý "dụng thần chuyên cầu nguyệt lệnh", định cách cục.
- **窮通寶鑑** (Khung Thông Bảo Giám) — bảng Điều Hậu dụng thần (调候用神).
- **滴天髓** (Tích Thiên Tủy) — thông quan, bệnh dược, chuyên vượng.
- **渊海子平** (Uyên Hải Tử Bình), **三命通會** (Tam Mệnh Thông Hội) — Thập thần, thần sát, hình xung hội hợp.
- Đối chiếu hiện đại: cafengshuinet.com, suanzhun.net, zhihu.com (các chuyên luận Tử Bình).

Thư viện `lunar-javascript` đảm bảo tính lịch / Tứ Trụ / Đại Vận chính xác theo thiên văn.

## Tính tất định

Cùng (ngày giờ sinh + giới tính) ⇒ **cùng một lá số, cùng Dụng Thần, cùng câu trả lời**.
Không có ngẫu nhiên. `selftest.mjs` kiểm chứng tính tất định + đúng mẫu kinh điển.

## Tích hợp AI (luân giải bất kỳ câu hỏi)

**Mặc định: GLM-5.2 qua Z.ai** (model coding mạnh nhất của Zhipu, context 1M).

1. Lấy API key tại <https://z.ai/model-api> (mục API Keys).
2. Mở app → bấm **⚙** (góc phải thẻ "Trợ lý Bát Tự AI").
3. Chọn nhà cung cấp trong menu **Nhà cung cấp** (endpoint + model tự điền):
   - **Z.ai — GLM Coding Plan**: `https://api.z.ai/api/coding/paas/v4` · `glm-5.2`
     *(theo docs Z.ai, endpoint Coding Plan dành cho công cụ được hỗ trợ; app web nếu bị chặn hãy đổi sang "Z.ai API chung")*
   - **Z.ai — API chung (pay-as-you-go)**: `https://api.z.ai/api/paas/v4` · `glm-5.2` ← **khuyên dùng cho app**
   - **BigModel (智谱)**: `https://open.bigmodel.cn/api/paas/v4` · `glm-4.6`
   - **DeepSeek** / **OpenAI** / **Ollama (cục bộ, không cần key)**
4. Dán API key → bật "Bật AI" → Lưu.

Khi AI bật: câu hỏi + **chart brief** (toàn bộ dữ liệu đã tính đúng) + **system prompt**
(chuyên gia Tử Bình theo cổ pháp) được gửi → AI luân giải **streaming**. Khi chưa cấu hình
hoặc lỗi → tự fallback về bộ luân giải cục bộ (nlg.js).

> **Thiết kế an toàn**: AI không tự tính lại Tứ Trụ / Dụng Thần — nó chỉ **diễn giải & kết nối**
> dựa trên dữ liệu đã tính chính xác bởi engine tất định.
> Giao tiếp theo chuẩn OpenAI-compatible (`POST /chat/completions`, Bearer auth).

## Chạy

```bash
npm install
npm run dev        # dev server (Vite)
npm run build      # build production → dist/
npm run preview    # xem bản build
node selftest.mjs  # kiểm chứng engine (tất định + kinh điển + NLG/AI brief)
```

## Lưu ý

Kết quả mang tính **tham khảo văn hoá – huyền học**, không thay thế quyết định cá nhân.
