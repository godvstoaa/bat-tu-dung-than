// Rung phản hồi: Capacitor Haptics trên iOS/Android native, navigator.vibrate trên web cảm ứng.
let H = null;
const native = (() => { try { return !!window.Capacitor?.isNativePlatform?.(); } catch (e) { return false; } })();

async function plugin() {
  if (!native) return null;
  if (H === null) {
    try { H = (await import('@capacitor/haptics')).Haptics; } catch (e) { H = false; }
  }
  return H || null;
}

const STYLE = { light: 'LIGHT', medium: 'MEDIUM', heavy: 'HEAVY' };

export async function buzz(kind = 'light') {
  const h = await plugin();
  if (h) { h.impact({ style: STYLE[kind] || 'LIGHT' }).catch(() => {}); return; }
  // trình duyệt chặn rung trước thao tác đầu tiên của người dùng → bỏ qua cho sạch console
  if (navigator.vibrate && navigator.userActivation?.hasBeenActive !== false && matchMedia('(pointer: coarse)').matches) navigator.vibrate(kind === 'heavy' ? 30 : kind === 'medium' ? 16 : 8);
}

// Khoá màn hình dọc khi vào game (native), mở lại khi thoát.
export async function lockPortrait(on) {
  if (!native) return;
  try {
    const { ScreenOrientation } = await import('@capacitor/screen-orientation');
    if (on) await ScreenOrientation.lock({ orientation: 'portrait' }); else await ScreenOrientation.unlock();
  } catch (e) { /* plugin chưa có trong bản native cũ — bỏ qua */ }
}
