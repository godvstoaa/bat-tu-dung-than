import { chromium } from 'playwright';
for (const args of [['--use-angle=d3d11','--enable-gpu','--ignore-gpu-blocklist'], ['--use-angle=d3d11','--use-gl=angle','--enable-features=Vulkan','--ignore-gpu-blocklist']]) {
  const b = await chromium.launch({ args });
  const p = await b.newPage();
  const r = await p.evaluate(() => { const g = document.createElement('canvas').getContext('webgl2'); if (!g) return 'none'; const e = g.getExtension('WEBGL_debug_renderer_info'); return g.getParameter(e ? e.UNMASKED_RENDERER_WEBGL : g.RENDERER); });
  console.log(args.join(' '), '=>', r); await b.close();
}
