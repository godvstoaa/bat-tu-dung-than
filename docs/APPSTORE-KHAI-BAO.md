# Chiến lược Khai báo App Store Connect — «max-odds» · [RESTORE 2026-08-18]

> Mục tiêu: **0 lỗi vì khai báo sai**. Nhiều app rớt vì FORM, không phải vì app.
> Nguyên tắc vàng: **khai báo THẬT, đúng hành vi app**.

## 1. APP INFORMATION

| Field | Giá trị điền | Ghi chú / bẫy |
|---|---|---|
| Name | `Lữ Đăng — Bát Tự Cổ Pháp` | 23/30 ký tự ✓ |
| Subtitle | `Bát Tự · Trích dẫn cổ bản` | 25/30 ✓ |
| Primary Language | Vietnamese | Review Notes tiếng Anh đền bù |
| Bundle ID | `shop.god8.lvdang` (MỚI) | Record cũ `battu` đã dính flag 4.3(b) |
| SKU | `lvdang-ios-001` | |
| Primary Category | **Education** | Tránh Lifestyle = thùng saturated |
| Secondary Category | Lifestyle | |
| Price | Free | Không IAP/subscription |
| Copyright | `© 2026 [Tên Developer]` | Trùng tên pháp nhân tài khoản |
| IDFA | **KHÔNG tick** | Không ads |
| Release | **Manually release** | Kịp pull nếu cần |

## 2. AGE RATING — mục tiêu 4+

| Nhóm câu | Trả lời |
|---|---|
| Violence / Alcohol / Drug / Gambling / Sexual | **None** hết |
| Medical/Treatment info | Mức thấp nhất — Đông y = tham khảo văn hóa, có disclaimer «không thay thế tư vấn chuyên môn»; mô tả KHÔNG dùng «chữa/trị/lành bệnh» |
| Unrestricted Web Access | **NO** — mọi link nội bộ cùng origin |

## 3. APP PRIVACY — khai THẬT (khớp `resources/ios/PrivacyInfo.xcprivacy`)

⚠ **KHÔNG chọn «Data Not Collected»** — app log events + chat qua server riêng + Z.ai proxy.

| Data type | Mục đích | Linked? | Tracking? |
|---|---|---|---|
| **Product Interaction** | App Functionality · Analytics | No | No |
| **Other User Content** (chat + ngày sinh) | App Functionality | No | No |

- «Data Used to Track You» = **rỗng**. Privacy Policy: `https://battu.god8.shop/privacy.html`

## 4. ENCRYPTION
Info.plist: `ITSAppUsesNonExemptEncryption = NO` (HTTPS chuẩn, exempt).

## 5. APP REVIEW INFORMATION
- Contact: email + phone thật. Demo Account: **bỏ trống**.
- Notes: khối tiếng Anh trong `APP-STORE-SUBMISSION-v3.md` mục 4 + dòng:
  `App UI is in Vietnamese — reasoning-chain cards and Neo badge are visual/numeric, language-independent.`

## 6. VERSION INFO
- Description/Keywords: nguyên văn v3. Không chữ «Android/beta/test», không lặp «free» >2 lần.
- Screenshots 5 flow v3 — **2 ảnh đầu = Chuỗi Lập Luận + Neo badge**, không placeholder.

## 7. QUY TRÌNH «CHẮC» NHẤT
1. `npm run build && npx cap sync ios` → archive → **TestFlight external** (5-10 tester VN, 2-3 ngày, test kinh offline Airplane Mode)
2. Sửa sạch crash → điền form theo bảng trên → submit **thứ 2-4 sáng VN**
3. Rớt → KHÔNG resubmit ngay → dùng kịch bản reply mục 5 trong v3 (xin phone call)

## 8. CHECKLIST TRƯỚC SUBMIT
- [ ] Bundle mới `shop.god8.lvdang` + record mới + version 1.0
- [ ] Name ≤30, Subtitle ≤30
- [ ] Category Education primary
- [ ] Age rating 4+
- [ ] Privacy: 2 data types, KHÔNG tick «Not Collected», tracking rỗng
- [ ] `ITSAppUsesNonExemptEncryption=NO`
- [ ] Review Notes v3 + dòng ngôn ngữ Việt
- [ ] 5 screenshots đúng thứ tự (2 đầu = độc quyền)
- [ ] Demo URL mở được từ Safari sạch
- [ ] privacy.html live + khớp
- [ ] Đã qua TestFlight ≥2 ngày không crash
