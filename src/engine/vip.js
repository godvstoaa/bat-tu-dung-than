// ============================================================================
//  VIP Module — quản lý trạng thái VIP cho cả web (activation code) + iOS (StoreKit IAP)
//  - Web: user nhập mã activation → verify qua worker KV
//  - iOS (Capacitor): native StoreKit IAP qua @capacitor-community/in-app-purchases
//  - VIP status lưu localStorage + sync worker (anti-abuse)
// ============================================================================
const VIP_KEY = 'battu-vip';
const FREE_AI_KEY = 'battu-ai-quota';

// Gói VIP (giá VN — chuyển khoản; iOS dùng IAP price tier tương đương)
export const VIP_PLANS = [
  { id: 'vip-week', label: 'VIP 7 ngày', price: '30.000đ', ios: false, days: 7 },
  { id: 'vip-month', label: 'VIP 30 ngày', price: '99.000đ', ios: false, days: 30 },
  { id: 'vip-year', label: 'VIP 365 ngày', price: '499.000đ', ios: false, days: 365 },
  // iOS IAP (Apple tier): week=$0.99, month=$2.99, year=$14.99
  { id: 'shop.god8.battu.vip.week', label: 'VIP 7 ngày (iOS)', price: '$0.99', ios: true, days: 7 },
  { id: 'shop.god8.battu.vip.month', label: 'VIP 30 ngày (iOS)', price: '$2.99', ios: true, days: 30 },
  { id: 'shop.god8.battu.vip.year', label: 'VIP 365 ngày (iOS)', price: '$14.99', ios: true, days: 365 },
];

// Phát hiện môi trường Capacitor (native iOS/Android) vs browser
function isNative() {
  return typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativeAvailable();
}

// Đọc VIP status
export function getVipStatus() {
  try {
    const raw = localStorage.getItem(VIP_KEY);
    if (!raw) return { vip: false, until: 0, plan: null };
    const v = JSON.parse(raw);
    const now = Date.now();
    if (v.until && v.until > now) return { vip: true, until: v.until, plan: v.plan };
    // expired
    localStorage.removeItem(VIP_KEY);
    return { vip: false, until: 0, plan: null };
  } catch (e) { return { vip: false, until: 0, plan: null }; }
}

export function isVip() { return getVipStatus().vip; }

// Free tier: 3 AI câu hỏi/ngày (IP-based trong worker, đây là client-side mirror)
export const FREE_AI_DAILY = 3;
export function getAiQuota() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem(FREE_AI_KEY);
    if (!raw) return { used: 0, date: today };
    const q = JSON.parse(raw);
    if (q.date !== today) return { used: 0, date: today }; // reset daily
    return q;
  } catch (e) { return { used: 0, date: new Date().toISOString().slice(0, 10) }; }
}
export function canUseAi() {
  if (isVip()) return true;
  return getAiQuota().used < FREE_AI_DAILY;
}
export function incrementAiQuota() {
  if (isVip()) return;
  const q = getAiQuota();
  localStorage.setItem(FREE_AI_KEY, JSON.stringify({ used: q.used + 1, date: q.date }));
}

// WEB: redeem activation code → verify worker KV
export async function redeemCode(code) {
  if (!code || code.length < 6) return { ok: false, error: 'Mã không hợp lệ (tối thiểu 6 ký tự)' };
  try {
    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim().toUpperCase() }),
    });
    const data = await res.json();
    if (data.ok && data.days) {
      const now = Date.now();
      const current = getVipStatus();
      const base = current.vip ? current.until : now;
      const until = base + data.days * 86400000;
      localStorage.setItem(VIP_KEY, JSON.stringify({ vip: true, until, plan: data.plan || 'code', source: 'web' }));
      return { ok: true, until, days: data.days };
    }
    return { ok: false, error: data.error || 'Mã không hợp lệ hoặc đã sử dụng' };
  } catch (e) {
    return { ok: false, error: 'Lỗi kết nối. Thử lại.' };
  }
}

// iOS: purchase via StoreKit (Capacitor In-App Purchases)
export async function purchaseIap(productId) {
  if (!isNative()) return { ok: false, error: 'IAP chỉ khả dụng trong app iOS/Android' };
  try {
    // Dynamic import — chỉ load khi native (không bloat web bundle)
    const { InAppPurchases } = await import('@capacitor-community/in-app-purchases');
    // 1. fetch products
    const { products } = await InAppPurchases.getProducts({ productIds: [productId] });
    if (!products || !products.length) return { ok: false, error: 'Sản phẩm không khả dụng' };
    // 2. purchase
    const result = await InAppPurchases.purchase({ productId });
    if (result.purchase && result.purchase.state === 'purchased') {
      // 3. verify receipt + activate
      const plan = VIP_PLANS.find((p) => p.id === productId);
      if (plan) {
        const now = Date.now();
        const current = getVipStatus();
        const base = current.vip ? current.until : now;
        const until = base + plan.days * 86400000;
        localStorage.setItem(VIP_KEY, JSON.stringify({ vip: true, until, plan: productId, source: 'ios' }));
        return { ok: true, until, days: plan.days };
      }
    }
    return { ok: false, error: 'Thanh toán chưa hoàn tất' };
  } catch (e) {
    return { ok: false, error: e.message || 'Lỗi IAP' };
  }
}

// Universal buy — tự chọn web vs iOS
export async function buyVip(productId) {
  const plan = VIP_PLANS.find((p) => p.id === productId);
  if (!plan) return { ok: false, error: 'Gói không tồn tại' };
  if (plan.ios && isNative()) return purchaseIap(productId);
  // Web flow → show VietQR + code input (UI handles this)
  return { ok: false, needsRedirect: true, plan, message: 'Chuyển khoản + nhập mã' };
}
