// ============================================================================
//  flags.js — cờ biến thể build. KHÔNG side-effect, KHÔNG import phụ thuộc nặng.
// ============================================================================

export const MODE = import.meta.env.MODE;

export const IOS_BUILD = import.meta.env.MODE === 'ios';

export const IS_NATIVE = (() => {
  try {
    if (typeof window === 'undefined') return false;
    const C = window.Capacitor;
    if (!C) return false;
    if (typeof C.isNativePlatform === 'function') return !!C.isNativePlatform();
    if (typeof C.isNativeAvailable === 'function') return !!C.isNativeAvailable();
    return !!C.isNative;
  } catch {
    return false;
  }
})();

export const PLATFORM = (() => {
  try {
    if (typeof window === 'undefined') return 'node';
    const C = window.Capacitor;
    if (C && typeof C.getPlatform === 'function') return C.getPlatform();
    return 'web';
  } catch {
    return 'web';
  }
})();

export const IS_IOS_APP = IOS_BUILD && IS_NATIVE && PLATFORM === 'ios';

/** Gốc corpus offline (tương đối, không slash đầu). */
export const CORPUS_BASE = 'corpus';
