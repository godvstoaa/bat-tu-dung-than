# Lữ Đăng — iOS Submission v3 (Bói toán + Độc quyền) · [RESTORE 2026-08-18]

> **Chiến lược v3**: GIỮ NGUYÊN bói toán — nhưng App Store phải thấy 3 tính năng KHÔNG app bói nào có.
> 1. **Chuỗi Lập Luận** — mọi kết luận hiện: trích dẫn cổ bản → tiền đề → suy luận → phản biện
> 2. **Neo Score** — app TỰ CHẤM ĐIỂM mỗi câu trả lời AI vs lá số đã tính, badge ngay dưới câu trả lời
> 3. **Thư viện 1.523 kinh** tra cứu được (DZ# verified) — 1519 trang HTML bundle offline trong binary
>
> ⚠ Process song song (Cursor S0-S2) cũng tạo pipeline `build:ios` + docs v4 — nếu bạn theo hướng đó thì dùng docs của nó. File này là chiến lược v3 (bản full bói toán) đã được verify 61/65 checks.

## 1. METADATA

### Name
```
Lữ Đăng — Bát Tự Cổ Pháp
```

### Subtitle (≤30 ký tự)
```
Bát Tự · Trích dẫn cổ bản
```

### Category
- Primary: **Education** · Secondary: Lifestyle

### Mô tả ngắn (≤170 ký tự)
```
Bói Bát Tự khác biệt: mọi kết luận đều hiện trích dẫn cổ bản + app tự chấm điểm Neo Score cho từng câu trả lời AI. Thư viện 1523 kinh tra cứu.
```

### Mô tả đầy đủ

```
LỮ ĐĂNG — ỨNG DỤNG BÁT TỰ CÓ «KIỂM CHỨNG NGƯỢC» — điều chưa app bói nào trên App Store làm được.

① CHUỖI LẬP LUẬN CÔ PHÁP (độc quyền)
Mỗi kết luận đều hiện rõ: TRÍCH DẪN cổ bản (穷通宝鉴 / 子平真诠 / 三命通会…) → TIỀN ĐỀ từ lá số → SUY LUẬN → PHẢN BIỆN đã xét. Không có nhận định nào không kèm xuất xứ.

② NEO SCORE — APP TỰ CHẤM ĐIỂM CÂU TRẢ LỜI CỦA CHÍNH MÌNH (độc quyền)
Sau mỗi câu trả lời AI, hệ thống tự động so từng dữ liệu được nêu (ngũ hành %, vượng suy, can-chi, năm, hướng…) với lá số đã tính bằng thuật toán — rồi hiện badge «Neo X% · khớp lá số» ngay dưới câu trả lời. Bấm vào xem từng mốc khớp/mâu thuẫn.

③ THƯ VIỆN 1523 KINH ĐIỂN · 125 BỘ
Bộ sưu tập lớn nhất trong bất kỳ app nào: mỗi văn bản 4 tầng (tóm lược · phân tích chương · chuỗi lý luận · bản dịch Việt). Số hiệu DZ# đã đối chiếu Schipper–Verellen Concordance, ctext.org. Toàn bộ bundle trong app — chạy offline (Airplane Mode).

④ LUẬN GIẢI BÁT TỰ ĐẦY ĐỦ
Tứ Trụ · Dụng Thần (调候/病药/从格 override) · Cách Cục thành bại · Thập Thần kể tàng can · 120/120 quy tắc 穷通宝鉴 · Tử Vi · Phong thủy sát phương · AI thầy nói thẳng không nịnh.

⑤ MIỄN PHÍ HOÀN TOÀN — không quảng cáo, không mua trong app, không tài khoản, không SDK theo dõi.

Tính chất: văn hóa – tham khảo cổ truyền. Không thay thế tư vấn chuyên môn (y tế, tài chính, pháp lý).
```

### Keywords (100 ký tự)
```
bat tu,tu vi,co phap,trich dan,kinh dien,daozang,dung than,lap luan,tu binh,kiem chung
```

## 2. SCREENSHOTS (iPhone 6.9") — dẫn bằng độc quyền

1. **Chuỗi Lập Luận** (HERO): panel «🏛 Chuỗi Lập Luận Cổ Pháp» — 📖 TRÍCH DẪN → ⚖️ TIỀN ĐỀ → 🔗 SUY LUẬN → ⚠️ PHẢN BIỆN — caption «Mỗi kết luận đều có xuất xứ»
2. **Neo Score badge**: chat AI + «🎯 Neo 100% · khớp lá số» — caption «App bói duy nhất tự chấm điểm câu trả lời của mình»
3. **Neo chi tiết**: panel kiểm chứng mở — caption «Bấm xem từng mốc dữ liệu»
4. **Thư viện 1523 kinh** — caption «1523 cổ kinh · 125 bộ · offline»
5. **Lá số Bát Tự** — caption «Luận Bát Tự theo cổ pháp đầy đủ»

## 3. BUILD iOS (bản ĐẦY ĐỦ — không giấu gì)
```bash
npm run build && npx cap sync ios
```
- Bundle ID MỚI: `shop.god8.lvdang` · App name: «Lữ Đăng»
- Capacitor config đã có haptics/statusbar/splash native integration

## 4. REVIEW NOTES (paste vào App Store Connect)

```
This BaZi (Four Pillars) app is built around three features not found in other App Store apps:

1) REASONING CHAIN UI — every analytical conclusion renders its classical source citation (e.g., 穷通宝鉴, 子平真诠), its premises from the computed chart, the reasoning steps, and the counter-arguments considered. The reviewer can verify any claim's provenance on screen.

2) NEO SCORE (self-audit) — after each AI answer, the app automatically cross-checks every data point the answer mentions (element percentages, strength verdicts, pillars, years, directions) against the algorithmically computed chart, then displays a badge "Neo X% · matches chart" under the answer. Tapping it lists each matched/conflicting data point. No other divination app publishes a real-time accuracy audit of its own answers.

3) TEXT LIBRARY — 1,523 classical texts (125 collections, 3.14M characters) with 4-layer scholarly analysis; catalog numbers verified against the Schipper–Verellen Concordance. The full library is BUNDLED IN THE APP BINARY (1,519 HTML pages, fully offline in Airplane Mode) — the app is self-contained, not a repackaged website.

The app also integrates native iOS features: haptic feedback (chart computation, AI answer verification results), dark Status Bar styling, and a native splash screen.

Reviewer walkthrough (3 min): open the sample chart (?dob=1990-06-15&time=10:00) → scroll to «Chuỗi Lập Luận Cổ Pháp» (reasoning cards with citations) → ask the AI any question → tap the Neo badge under its answer → open the library (1,523 texts, searchable, works in Airplane Mode).

Free app: no ads, no IAP, no accounts, no third-party tracking SDKs.
Full evidence: https://battu.god8.shop/review/evidence.html
```

## 5. NẾU LẠI BỊ 4.3(b)
Reply trong App Store Connect:
> «Could you please specify which existing App Store apps duplicate (1) the visible reasoning-chain UI (classical citation → premises → reasoning → counter-argument for every conclusion), (2) the real-time self-audit "Neo Score" that cross-checks every AI answer against the algorithmically computed chart, or (3) the bundled 1,523-text searchable classical library? We would also like to request a phone call with the App Review Board.»
