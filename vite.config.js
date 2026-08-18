import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const STUB = path.join(ROOT, 'src/ios/stubs/chart-extras.js');

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

function iosModePlugins(mode) {
  if (mode !== 'ios') return [];
  return [
    {
      name: 'ios-html',
      transformIndexHtml(html) {
        return html;
      },
    },
    {
      name: 'ios-emit-index',
      generateBundle(_opts, bundle) {
        for (const key of Object.keys(bundle)) {
          const item = bundle[key];
          if (item.type === 'asset' && key.endsWith('ios-app.html')) {
            item.fileName = 'index.html';
            bundle['index.html'] = item;
            delete bundle[key];
          }
        }
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
  resolve: mode === 'ios'
    ? {
      alias: [
        { find: /[/\\]engine[/\\]synthesis\.js$/, replacement: STUB },
        { find: /[/\\]engine[/\\]liuqin\.js$/, replacement: STUB },
        { find: /[/\\]engine[/\\]remedy\.js$/, replacement: STUB },
        { find: /[/\\]engine[/\\]gaimenh\.js$/, replacement: STUB },
        { find: /[/\\]engine[/\\]remedy-fate\.js$/, replacement: STUB },
        { find: /[/\\]engine[/\\]tarot-kb\.js$/, replacement: STUB },
        { find: /[/\\]engine[/\\]runes-kb\.js$/, replacement: STUB },
        { find: /[/\\]engine[/\\]qiuqian\.js$/, replacement: STUB },
        { find: /[/\\]engine[/\\]pattern-quality\.js$/, replacement: STUB },
      ],
    }
    : {},
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
      input: mode === 'ios' ? path.join(ROOT, 'ios-app.html') : undefined,
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
