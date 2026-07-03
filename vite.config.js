import { defineConfig } from 'vite';
import fs from 'fs';

// ============================================================================
//  Vite config — proxy LLM API để TRÁNH CORS khi gọi từ trình duyệt.
//  Z.ai/OpenAI/DeepSeek/BigModel đều CHẶC CORS nếu fetch thẳng từ web.
//  Giải pháp: trong `npm run dev`, gọi qua /zai/... /openai/... → Vite proxy
//  chuyển tiếp (changeOrigin) tới nhà cung cấp → không còn CORS.
//  ⚠ Chỉ hoạt động khi chạy Vite dev server (npm run dev / preview).
//     Production (host tĩnh) cần backend/proxy riêng.
// ============================================================================

// [loop 236] SW auto-version plugin — thay CACHE trong dist/sw.js bằng timestamp build
// → mỗi deploy tự bump SW version → returning users LUÔN nhận content mới (tránh lỗi
// loop 234: SW kẹt v4 suốt 70+ loop). Trước đây phải bump thủ công → dễ quên.
function swAutoVersion() {
  return {
    name: 'sw-auto-version',
    closeBundle() {
      const swPath = 'dist/sw.js';
      if (!fs.existsSync(swPath)) return;
      let sw = fs.readFileSync(swPath, 'utf8');
      const ts = Date.now().toString(36);
      sw = sw.replace(/const CACHE = '[^']+'/, `const CACHE = 'bazi-${ts}'`);
      fs.writeFileSync(swPath, sw);
    },
  };
}

export default defineConfig({
  plugins: [swAutoVersion()],
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
          // vendor tách (cache lâu — hiếm đổi)
          if (id.includes('node_modules/lunar-javascript')) return 'vendor-lunar';
          if (id.includes('node_modules/astronomy-engine')) return 'vendor-astronomy';
          // [loop 568] engine code-split theo nhóm → mỗi deploy chỉ re-download chunk đổi,
          //   không cả 1.3MB. Cải thiện caching cho mobile (returning users).
          if (id.includes('/src/engine/ziwei')) return 'engine-ziwei';       // 10+ file Tử Vi
          if (id.match(/\/src\/engine\/(meihua|cezi|liuren|qimen|heluo|guiguzi|jinkoujue|hexagram)/)) return 'engine-divination';
          if (id.match(/\/src\/engine\/(bazi-diet|bazi-workout|aroma|crystal|cloth|space-fs|city-fs|health)/)) return 'engine-lifestyle';
          if (id.includes('/src/engine/tcm')) return 'engine-tcm';          // [loop 1350] 99KB TCM/health — cache riêng, returning users re-download ít hơn
        },
      },
    },
  },
});
