import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

// ============================================================================
//  Vite config — proxy LLM API để TRÁNH CORS khi gọi từ trình duyệt.
//  Mode `ios` → outDir dist-ios + transform head research-first + prune artifact.
// ============================================================================

function swAutoVersion() {
  return {
    name: 'sw-auto-version',
    closeBundle() {
      // Chỉ bản web (dist/) — dist-ios không cần SW
      const swPath = 'dist/sw.js';
      if (!fs.existsSync(swPath)) return;
      let sw = fs.readFileSync(swPath, 'utf8');
      const ts = Date.now().toString(36);
      sw = sw.replace(/const CACHE = '[^']+'/, `const CACHE = 'bazi-${ts}'`);
      fs.writeFileSync(swPath, sw);
    },
  };
}

function iosModePlugins(mode) {
  if (mode !== 'ios') return [];
  return [
    {
      name: 'ios-html',
      transformIndexHtml(html) {
        let out = html;
        out = out.replace(/<title>[^<]*<\/title>/i, '<title>Lữ Đăng — Thư viện cổ học &amp; tra cứu</title>');
        out = out.replace(
          /<meta\s+name="description"[^>]*>/i,
          '<meta name="description" content="Thư viện 1523 kinh điển Đạo Tạng + tra cứu Tứ Trụ theo cổ pháp: tìm kiếm, đối chiếu nguồn, chú giải nhiều tầng. Tính toán trên thiết bị." />'
        );
        out = out.replace(/<meta\s+name="keywords"[^>]*>\s*/gi, '');
        out = out.replace(/<meta\s+property="og:[^"]+"[^>]*>\s*/gi, '');
        out = out.replace(/<meta\s+name="twitter:[^"]+"[^>]*>\s*/gi, '');
        out = out.replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '');
        out = out.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');
        out = out.replace(/<link[^>]+fonts\.googleapis\.com[^>]*>\s*/gi, '');
        out = out.replace(/<link[^>]+fonts\.gstatic\.com[^>]*>\s*/gi, '');
        out = out.replace(
          /<meta\s+name="apple-mobile-web-app-title"[^>]*>/i,
          '<meta name="apple-mobile-web-app-title" content="Lữ Đăng" />'
        );
        // Ẩn form luận mệnh NGAY first paint — không chờ JS gắn ios-shell-active
        // (bundle chính rất nặng; reviewer 30 giây sẽ thấy splash thư viện).
        const splash = `<div id="ios-root" class="ios-root"><div class="ios-panels"><div class="ios-lib ios-splash"><header class="ios-lib-head"><h1>Lữ Đăng</h1><p class="ios-muted">Thư viện cổ học · 1523 kinh điển · tra cứu</p></header><p class="ios-muted">Đang tải thư viện…</p></div></div></div>`;
        if (!out.includes('id="ios-root"')) {
          out = out.replace('<body>', `<body class="ios-shell-active">\n${splash}\n`);
        }
        const crit = `<style id="ios-critical">
html,body{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Songti SC","Noto Sans SC","Helvetica Neue",sans-serif!important;background:#0a0913;color:#eef1f8}
[data-ios-hide]{display:none!important}
#ios-root{display:flex!important;flex-direction:column;min-height:100dvh;position:fixed;inset:0;z-index:50;background:#0a0913}
body:not(.ios-legacy-visible)>header.hero,
body:not(.ios-legacy-visible)>.container,
body:not(.ios-legacy-visible)>#chat-fab,
body:not(.ios-legacy-visible)>#chat-panel,
body:not(.ios-legacy-visible)>.bg-glow,
body:not(.ios-legacy-visible)>.bg-clouds,
body:not(.ios-legacy-visible)>.bg-grain,
body:not(.ios-legacy-visible)>#mote-field,
body:not(.ios-legacy-visible)>footer,
body:not(.ios-legacy-visible)>#ai-fab,
body:not(.ios-legacy-visible)>#ai-popup{display:none!important}
.ios-splash{padding:calc(24px + env(safe-area-inset-top,0px)) 20px}
.ios-splash h1{margin:0;font-size:26px;color:#e8d28a}
</style>`;
        if (!out.includes('id="ios-critical"')) {
          out = out.replace('</head>', `${crit}\n</head>`);
        }
        return out;
      },
    },
  ];
}

export default defineConfig(({ mode }) => ({
  plugins: [swAutoVersion(), ...iosModePlugins(mode)],
  base: process.env.GH_PAGES ? '/bat-tu-dung-than/' : '/',
  define: {
    __IOS__: mode === 'ios',
  },
  server: {
    host: '::',
    proxy: {
      '/zai':      { target: 'https://api.z.ai',         changeOrigin: true, secure: true, rewrite: (p) => p.replace(/^\/zai/, '') },
      '/bigmodel': { target: 'https://open.bigmodel.cn', changeOrigin: true, secure: true, rewrite: (p) => p.replace(/^\/bigmodel/, '') },
      '/deepseek': { target: 'https://api.deepseek.com', changeOrigin: true, secure: true, rewrite: (p) => p.replace(/^\/deepseek/, '') },
      '/openai':   { target: 'https://api.openai.com',   changeOrigin: true, secure: true, rewrite: (p) => p.replace(/^\/openai/, '') },
      '/nvidia':   { target: 'https://integrate.api.nvidia.com', changeOrigin: true, secure: true, rewrite: (p) => p.replace(/^\/nvidia/, '') },
      '/groq':     { target: 'https://api.groq.com',     changeOrigin: true, secure: true, rewrite: (p) => p.replace(/^\/groq/, '') },
    },
  },
  build: {
    outDir: mode === 'ios' ? 'dist-ios' : 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/lunar-javascript')) return 'vendor-lunar';
          if (id.includes('node_modules/astronomy-engine')) return 'vendor-astronomy';
          if (id.includes('/src/engine/kb.js')) return 'engine-kb';
          if (id.includes('/src/engine/ai.js')) return 'engine-ai';
          if (id.includes('/src/engine/brief-extender.js')) return 'engine-ai';
          if (id.includes('/src/engine/nlg.js')) return 'engine-ai';
          if (id.match(/\/src\/engine\/(gufa-engine|huangji-engine|taiyi-engine|chenggu-engine|wuyun-liuqi|appearance-engine)/)) return 'engine-camky';
          if (id.includes('/src/engine/flying-sihua.js')) return 'engine-camky';
          if (id.includes('/src/engine/ziwei-liunian')) return 'engine-camky';
          if (id.includes('/src/engine/ziwei')) return 'engine-ziwei';
          if (id.match(/\/src\/engine\/(meihua|cezi|liuren|qimen|heluo|guiguzi|jinkoujue|hexagram|tarot-kb|numerology|runes-kb|iching64-kb|coffee-kb|physiognomy-extra|naming|remedy-fate)/)) return 'engine-divination';
          if (id.match(/\/src\/engine\/(bazi-diet|bazi-workout|aroma|crystal|cloth|space-fs|city-fs|health)/)) return 'engine-lifestyle';
          if (id.includes('/src/engine/tcm')) return 'engine-tcm';
          if (id.match(/\/src\/engine\/(nayin|nayin-personality|nayin-relation)/)) return 'engine-nayin';
          if (id.match(/\/src\/engine\/(western-astro|western-predict|western-synthesis|western-kb|western-interpretation|qizheng)/)) return 'engine-western';
          if (id.includes('/src/engine/daozang-data.js')) return 'engine-daozang';
          if (id.includes('/src/engine/daozang-deep.js')) return 'engine-daozang';
          if (id.match(/\/src\/engine\/(library-data|talisman-data|cultivation-data|phuongthuat-data|bitruyen-data|schools-data|amta-data|amta-analyze|amta-tuluyen-data)/)) return 'engine-library';
          if (id.includes('/src/ios/')) return 'shell';
        },
      },
    },
  },
}));
