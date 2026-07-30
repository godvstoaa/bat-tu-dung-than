# iOS Purchase Strategy — RevenueCat + IAP

## Quyết định: RevenueCat (KHÔNG raw StoreKit)

**Vì sao RevenueCat?**
- Xử lý phần KHÓ nhất: receipt validation, subscription status, restore purchase
- Cross-platform: iOS + Android cùng 1 dashboard
- FREE cho app < $10K MTR (monthly tracked revenue) — bạn chưa tới mức đó
- Tiêu chuẩn cho indie developers
- Capacitor plugin có sẵn: `@revenuecat/purchases-capacitor`

## Sản phẩm IAP (App Store Connect)

| Product ID | Loại | Giá Apple | ≈ VND | Mô tả |
|---|---|---|---|---|
| `vip_week` | Auto-renewable | $0.99 | ~23.000đ | VIP 7 ngày — thử nghiệm thấp |
| `vip_month` | Auto-renewable | $2.99 | ~69.000đ | VIP 30 ngày — gói chính |
| `vip_year` | Auto-renewable | $14.99 | ~349.000đ | VIP 365 ngày — tiết kiệm 58% |

**Small Business Program**: doanh thu < $1M/năm → Apple ăn **15%** (không phải 30%). Đăng ký FREE trong App Store Connect.

## Flow kỹ thuật

```
User bấm "Nâng VIP" trong app iOS
     ↓
Capacitor → RevenueCat SDK → StoreKit
     ↓
Apple xử lý thanh toán (Apple Pay / thẻ)
     ↓
RevenueCat verify receipt + update subscription status
     ↓
App nhận callback → unlock VIP (lưu localStorage)
     ↓
VIP active → AI không giới hạn + báo cáo PDF + tools premium
```

## Code cần làm

### 1. Cài đặt
```bash
npm install @revenuecat/purchases-capacitor
```

### 2. Khởi tạo (main.js)
```js
import { Purchases } from '@revenuecat/purchases-capacitor';

// Chỉ init khi chạy native (iOS/Android), KHÔNG trên web
if (window.Capacitor?.isNativeAvailable()) {
  await Purchases.setLogLevel('WARN');
  await Purchases.configure({
    apiKey: 'appl_XXXXX', // RevenueCat public Apple API key
  });
}
```

### 3. Mua VIP (thay thế purchaseIap trong vip.js)
```js
export async function purchaseIap(productId) {
  if (!window.Capacitor?.isNativeAvailable()) {
    return { ok: false, error: 'Chỉ khả dụng trong app iOS/Android' };
  }
  const { Purchases } = await import('@revenuecat/purchases-capacitor');
  try {
    // 1. Lấy offerings
    const { offerings } = await Purchases.getOfferings();
    const package = offerings.current?.availablePackages
      ?.find(p => p.product.identifier === productId);
    if (!package) return { ok: false, error: 'Gói không khả dụng' };

    // 2. Purchase
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: package });

    // 3. Check entitlement
    if (customerInfo.entitlements.active['vip']) {
      const entitlement = customerInfo.entitlements.active['vip'];
      activateVip(entitlement.expirationTimeMs);
      return { ok: true };
    }
    return { ok: false, error: 'Chưa kích hoạt' };
  } catch (e) {
    if (e.userCancelled) return { ok: false, cancelled: true };
    return { ok: false, error: e.message };
  }
}

// 4. Restore purchase (Apple BẮT BUỘC phải có nút Restore)
export async function restorePurchases() {
  const { Purchases } = await import('@revenuecat/purchases-capacitor');
  const { customerInfo } = await Purchases.restorePurchases();
  if (customerInfo.entitlements.active['vip']) {
    activateVip(customerInfo.entitlements.active['vip'].expirationTimeMs);
    return { ok: true };
  }
  return { ok: false };
}

function activateVip(expirationMs) {
  localStorage.setItem('battu-vip', JSON.stringify({
    vip: true, until: expirationMs, source: 'ios_iap'
  }));
}
```

### 4. Kiểm tra VIP khi mở app
```js
export async function checkIapVipStatus() {
  if (!window.Capacitor?.isNativeAvailable()) return;
  const { Purchases } = await import('@revenuecat/purchases-capacitor');
  const { customerInfo } = await Purchases.getCustomerInfo();
  if (customerInfo.entitlements.active['vip']) {
    activateVip(customerInfo.entitlements.active['vip'].expirationTimeMs);
  }
}
```

## Apple requirements (BẮT BUỘC cho approve)

1. **Nút "Khôi phục giao dịch" (Restore Purchases)** — Apple 3.1.1 bắt buộc
2. **Privacy policy URL** — đã có ✅
3. **Subscription disclosure** — hiện rõ: giá + thời gian + tự động gia hạn
4. **Free tier đủ dùng** — 3 câu AI/ngày + full chart analysis ✅ (đã có)
5. **Subscription Group** — tạo "VIP" group trong App Store Connect

## Web vs iOS — cùng tồn tại

```
Web (battu.god8.shop):
  → Bank transfer (VietQR) → activation code → 0% fee ✅ đã có

iOS (App Store):
  → Apple IAP (RevenueCat) → auto-renew → 15% fee (Small Business)

VIP status sync: cả 2 lưu localStorage cùng key 'battu-vip'
```

## Bạn cần làm (sau khi Apple Developer approved)

1. **Tạo RevenueCat account** (free): revenuecat.com
2. **Tạo app + lấy Apple API key** (revenuecat dashboard)
3. **App Store Connect → In-App Purchases**:
   - Tạo Subscription Group "VIP"
   - 3 products: vip_week ($0.99), vip_month ($2.99), vip_year ($14.99)
   - Mỗi product: reference name + subscription period + description
4. **RevenueCat → Products**: map product IDs
5. **RevenueCat → Entitlements**: tạo "vip" entitlement → gán products
6. **RevenueCat → Offerings**: tạo "default" offering → packages
7. Cho tôi **RevenueCat public Apple API key** → tôi config vào code

## Timeline

| Việc | Ai | Thời gian |
|---|---|---|
| Tạo RevenueCat account | Bạn | 10 phút |
| Tạo IAP products trong App Store Connect | Bạn | 30 phút |
| Config RevenueCat (products/entitlements/offerings) | Bạn | 30 phút |
| Code @revenuecat/purchases-capacitor vào vip.js | Tôi | 30 phút |
| Test StoreKit sandbox | Bạn (iPhone) | 30 phút |
| Submit App Store | Bạn | 1 ngày |

**Tổng: ~2-3 giờ setup** (sau khi Apple Developer approved).
