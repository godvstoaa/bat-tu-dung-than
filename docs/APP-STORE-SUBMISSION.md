# Bát Tự Dụng Thần — App Store Submission Guide

> Cẩm nang submit iOS App Store (cho user — tôi đã setup code, bạn cần Mac/cloud để build cuối)

## 1. ĐÃ CHUẨN BỊ SẴN (tôi làm)

- ✅ Capacitor config (`capacitor.config.ts`) — appId: `shop.god8.battu`
- ✅ 12 iOS icons (`resources/ios-icons/`) — 1024 App Store + 11 device sizes
- ✅ Privacy policy live (`/privacy.html`)
- ✅ App framing: "Dịch học/xác suất/cổ pháp" (không "bói toán")
- ✅ Disclaimers + footer + Âm Tà opt-in

## 2. BẠN CẦN LÀM (sau khi Apple Developer approved)

### Bước A: Build web assets
```bash
npm run build          # tạo dist/
```

### Bước B: Add iOS platform (CẦN MAC hoặc cloud Mac)
```bash
npx cap add ios        # CHỈ chạy được trên macOS
npx cap copy           # copy dist/ → ios/App/App/public
npx cap open ios       # mở Xcode
```

> ⚠️ **Bạn đang dùng Windows** → `npx cap add ios` KHÔNG chạy được. 2 lựa chọn:

**Lựa chọn 1: Cloud Mac (đề nghị)**
- MacinCloud (~$20/tháng) hoặc GitHub Actions macOS runner (free 2000 phút/tháng)
- Xem workflow `.github/workflows/ios-build.yml` (tôi đã chuẩn bị)

**Lựa chọn 2: GitHub Actions (FREE, không cần Mac)**
- Push code → GitHub → workflow tự build iOS + archive
- Cần App Store Connect API key (.p8) từ Apple Developer portal

### Bước C: Trong Xcode (trên Mac)
1. Set **Team** = Apple Developer account của bạn
2. Set **Bundle Identifier** = `shop.god8.battu`
3. Drag 12 icons từ `resources/ios-icons/` → `AppIcon.appiconset` trong Xcode
4. Product → Archive → Distribute App → App Store Connect

### Bước D: App Store Connect (web)
1. Tạo New App → điền metadata (xem `METADATA.md`)
2. Upload build từ Xcode (hoặc GitHub Actions)
3. Submit for Review

## 3. METADATA (điền vào App Store Connect)

### Tên app
```
Bát Tự Dụng Thần — Phân Tích Mệnh Lý
```
(KHÔNG dùng "Bói Toán" — Apple flag 4.3)

### Danh mục
- **Primary**: Lifestyle
- **Secondary**: Education
(KHÔNG Entertainment — Apple reject fortune-telling trong Entertainment)

### Mô tả ngắn (170 ký tự)
```
Phân tích Bát Tự (Tứ Trụ), Dụng Thần, Tử Vi, Phong Thủy + AI luận giải. Thư viện 1523 kinh điển Huyền học — tham chiếu văn hoá-tôn giáo.
```

### Mô tả đầy đủ
```
BÁT TỰ DỤNG THẦN — Ứng dụng phân tích mệnh lý Bát Tự (Tứ Trụ) theo cổ pháp Tử Bình, tích hợp AI luận giải + thư viện 1523 kinh điển Huyền học Trung Hoa.

TÍNH NĂNG CHÍNH:
• Phân tích Bát Tự (Tứ Trụ) chính xác: Nhật Chủ, Dụng Thần (用神), Hỷ Kỵ, Thân vượng/nhược, Cách Cục (格局), Thập Thần, Tàng Can
• AI luận giải cá nhân hóa: hỏi đáp về sự nghiệp, hôn nhân, tài lộc, sức khỏe, thời điểm
• Tử Vi Đẩu Số (14 chính tinh + tứ hóa)
• Phong thủy: hướng nhà, sat phương, Thái Tuế, Tam Sát
• 12 hệ bói Dịch học: 梅花/六壬/奇门/太乙/Tarot/Runes
• Thư viện 1523 kinh điển: 道藏 + 符咒 + tu luyện + phương thuật (lớn nhất Việt Nam)
• 调候 (穷通宝鉴) 120/120 quy tắc
• Cải mệnh (Nghịch Thiên) + Liễu Phàm Tứ Huấn

FRAME HỌC THUẬT:
Nội dung dựa trên cổ pháp: 渊海子平 · 滴天髓 · 子平真诠 · 三命通会 · 穷通宝鉴 · 鬼谷子算命 · 河洛理数.
Mọi phân tích là THAM CHIẾU VĂN HOÁ-TÔN GIÁO / XÁC SUẤT THEO CỔ PHÁP — không phải chẩn đoán y tế, không đảm bảo kết quả.

MIỄN TRê TRÁCH NHIỆM:
App cung cấp thông tin tham chiếu về văn hóa truyền thống. Không thay thế tư vấn y tế, tâm lý, pháp lý hay tài chính chuyên nghiệp.
```

### Keywords (100 ký tự max)
```
bát tự,tử vi,tứ trụ,dụng thần,phong thủy,cổ pháp,huyền học,đạo giáo,tử bình,kinh điển
```

### Privacy Policy URL
```
https://battu.god8.shop/privacy.html
```

## 4. RỦI RO 4.3 + CHIẾN LƯỢC APPEAL

Apple thường reject app "astrology/fortune-telling" theo guideline 4.3 (Spam). Nếu bị:

1. **Appeal qua Resolution Center** — dẫn chứng:
   - Thư viện 1523 kinh (KHÔNG app nào có)
   - 12 hệ Dịch học tích hợp
   - Chart-aware AI (không phải horoscope chung chung)
   - Nguồn học thuật: Schipper-Verellen, Komjathy, Pregadio
2. **Yêu cầu phone call** với reviewer (nhiều dev report hiệu quả)
3. **Backup**: Google Play (linh hoạt hơn) + PWA installable

## 5. STOREKIT IAP (nếu bán VIP trong app)

Sau khi app approved, thêm StoreKit IAP:
- Tạo In-App Purchases trong App Store Connect
- Product IDs: `vip.week`, `vip.month`, `vip.year`
- Code: dùng `@capacitor-community/in-app-purchases` hoặc RevenueCat
- Apple ăn 30% (15% Small Business Program nếu doanh thu < $1M/năm)
