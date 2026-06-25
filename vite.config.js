import { defineConfig } from 'vite';

// ============================================================================
//  Vite config — proxy LLM API để TRÁNH CORS khi gọi từ trình duyệt.
//  Z.ai/OpenAI/DeepSeek/BigModel đều CHẶC CORS nếu fetch thẳng từ web.
//  Giải pháp: trong `npm run dev`, gọi qua /zai/... /openai/... → Vite proxy
//  chuyển tiếp (changeOrigin) tới nhà cung cấp → không còn CORS.
//  ⚠ Chỉ hoạt động khi chạy Vite dev server (npm run dev / preview).
//     Production (host tĩnh) cần backend/proxy riêng.
// ============================================================================
export default defineConfig({
  // [loop 55] GitHub Pages phục vụ ở /bat-tu-dung-than/ → base phải đúng để asset load
  base: process.env.GH_PAGES ? '/bat-tu-dung-than/' : '/',
  server: {
    host: '::',
    proxy: {
      '/zai':      { target: 'https://api.z.ai',         changeOrigin: true, secure: true, rewrite: (p) => p.replace(/^\/zai/, '') },
      '/bigmodel': { target: 'https://open.bigmodel.cn', changeOrigin: true, secure: true, rewrite: (p) => p.replace(/^\/bigmodel/, '') },
      '/deepseek': { target: 'https://api.deepseek.com', changeOrigin: true, secure: true, rewrite: (p) => p.replace(/^\/deepseek/, '') },
      '/openai':   { target: 'https://api.openai.com',   changeOrigin: true, secure: true, rewrite: (p) => p.replace(/^\/openai/, '') },
    },
  },
  build: {
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    // [loop 49] tách vendor (lunar-javascript + astronomy-engine) khỏi app code
    // → vendor cache lâu hơn (hiếm đổi), app cache ngắn (đổi mỗi loop)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/lunar-javascript')) return 'vendor-lunar';
          if (id.includes('node_modules/astronomy-engine')) return 'vendor-astronomy';
        },
      },
    },
  },
});
