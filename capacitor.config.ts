import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'shop.god8.battu',
  appName: 'Bát Tự Dụng Thần',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // App là SPA — không cần androidScheme riêng, Capacitor serve từ capacitor://localhost trên iOS
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#0a0913',
    // [PRIVACY 4.0] iOS 14+ yêu cầu reason string cho mỗi API native.
    // App KHÔNG dùng camera/mic/location — không cần mô tả usage.
    // Nhưng nếu sau này thêm → phải khai báo ở Info.plist (Capacitor tự sinh từ đây).
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      backgroundColor: '#0a0913',
      showSpinner: false,
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
