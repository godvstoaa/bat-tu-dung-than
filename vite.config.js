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
    // [OPTIMIZE R49] Code-split aggressive — giảm main bundle từ 1.5MB → ~500KB
    // Priorities: (1) core load nhanh (<200KB gzip initial), (2) AI/engine lazy-load
    rollupOptions: {
      output: {
        manualChunks(id) {
          // === VENDOR (cache vĩnh viễn — file hash không đổi khi update code) ===
          if (id.includes('node_modules/lunar-javascript')) return 'vendor-lunar';
          if (id.includes('node_modules/astronomy-engine')) return 'vendor-astronomy';
          if (id.includes('node_modules/three')) return 'vendor-three';

          // === ENGINE-AI (lazy — chỉ load khi user mở chat AI) ===
          // kb.js (263KB data!) + ai.js (222KB) = ~485KB → TÁCH khỏi main bundle
          if (id.includes('/src/engine/kb.js')) return 'engine-kb';
          if (id.includes('/src/engine/ai.js')) return 'engine-ai';
          if (id.includes('/src/engine/brief-extender.js')) return 'engine-ai';
          if (id.includes('/src/engine/nlg.js')) return 'engine-ai';

          // === ENGINE-CAMKY (lazy — cấm kị engines, chỉ load khi gọi tool) ===
          if (id.match(/\/src\/engine\/(gufa-engine|huangji-engine|taiyi-engine|chenggu-engine|wuyun-liuqi|appearance-engine)/)) return 'engine-camky';
          if (id.includes('/src/engine/flying-sihua.js')) return 'engine-camky';
          if (id.includes('/src/engine/ziwei-liunian')) return 'engine-camky';

          // === ENGINE-DIVINATION (lazy — meihua/cezi/liuren/qimen) ===
          if (id.includes('/src/engine/ziwei')) return 'engine-ziwei';
          if (id.match(/\/src\/engine\/(meihua|cezi|liuren|qimen|heluo|guiguzi|jinkoujue|hexagram|tarot-kb|numerology|runes-kb|iching64-kb|coffee-kb|physiognomy-extra|naming|remedy-fate)/)) return 'engine-divination';

          // === ENGINE-LIFESTYLE (lazy — diet/workout/aroma/crystal) ===
          if (id.match(/\/src\/engine\/(bazi-diet|bazi-workout|aroma|crystal|cloth|space-fs|city-fs|health)/)) return 'engine-lifestyle';
          if (id.includes('/src/engine/tcm')) return 'engine-tcm';

          // === ENGINE-NAYIN (lazy — nạp âm reference) ===
          if (id.match(/\/src\/engine\/(nayin|nayin-personality|nayin-relation)/)) return 'engine-nayin';

          // === ENGINE-WESTERN (BaZi↔Western synthesis + predict + astro + qizheng) ===
          // [FIX] các file western-* mới không được route trước đây → rollup tree-shake/thôi body
          //   → renderSynthesisCard undefined runtime → «Không tính được sơ đồ tổng hợp».
          if (id.match(/\/src\/engine\/(western-astro|western-predict|western-synthesis|western-kb|western-interpretation|qizheng)/)) return 'engine-western';

          // === ENGINE-LIBRARY (lazy — Thư viện Huyền học: 符籙/神咒/經典/功法 + Âm Tà data) ===
          if (id.match(/\/src\/engine\/(library-data|talisman-data|cultivation-data|phuongthuat-data|bitruyen-data|schools-data|amta-data|amta-analyze)/)) return 'engine-library';

          // === main.js (core: chart.js + constants + interactions + main app UI) ===
          // Everything else stays in main — but now MUCH smaller without kb/ai/divination
        },
      },
    },
  },
});
