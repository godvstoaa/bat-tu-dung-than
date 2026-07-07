// ============================================================================
//  HERO WEBGL — khói/mực loang (fragment-shader FBM domain-warp).
//  Active-Theory-inspired nhưng GIỚI HẠN PERF cho mobile:
//   - render nửa-res (0.55x) + cap DPR 1.5  → pixel廉价
//   - pause khi tab ẩn / hero out-of-view / prefers-reduced-motion
//   - skip mobile yếu (coarse pointer + ≤4 core) / không WebGL / context-loss
//   - fallback: nền cũ (bg-glow + mote-field) giữ nguyên
// ============================================================================
export function initHeroWebGL() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // bảo vệ UX mobile yếu (như đã cảnh báo): skip để không giật
  const cores = navigator.hardwareConcurrency || 4;
  const coarse = matchMedia('(pointer: coarse)').matches;
  if (coarse && cores <= 4) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'hero-webgl';
  canvas.setAttribute('aria-hidden', 'true');
  hero.insertBefore(canvas, hero.firstChild);

  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: false, preserveDrawingBuffer: true })
    || canvas.getContext('experimental-webgl');
  if (!gl) { canvas.remove(); return; } // không WebGL → nền cũ

  const vs = 'attribute vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }';
  const fs = `
    precision mediump float;
    uniform vec2 uRes; uniform float uTime;
    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
      float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
      return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
    float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.02; a*=.5; } return v; }
    void main(){
      vec2 uv=(gl_FragCoord.xy-0.5*uRes)/max(uRes.y,1.);
      float t=uTime*0.022;
      vec2 q=vec2(fbm(uv*1.6+t), fbm(uv*1.6+vec2(5.2,1.3)-t));
      vec2 r=vec2(fbm(uv*1.6+1.8*q+vec2(1.7,9.2)+t*0.7), fbm(uv*1.6+1.8*q+vec2(8.3,2.8)-t*0.5));
      float f=fbm(uv*1.6+2.0*r);
      vec3 ink=vec3(0.018,0.013,0.028);
      vec3 gold=vec3(0.78,0.62,0.24);
      vec3 cream=vec3(0.95,0.88,0.68);
      vec3 col=mix(ink,gold,smoothstep(0.20,0.64,f));
      col=mix(col,cream,smoothstep(0.66,0.9,f)*0.45);
      col*=0.82+0.18*length(r);
      float vig=smoothstep(1.25,0.25,length(uv));
      col*=0.55+0.45*vig;
      gl_FragColor=vec4(col,1.0);
    }`;
  const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, 'uRes'), uTime = gl.getUniformLocation(prog, 'uTime');

  const RES_SCALE = 0.55;
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  function resize() {
    const w = hero.clientWidth || window.innerWidth;
    const h = hero.clientHeight || 320;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.max(2, Math.floor(w * DPR * RES_SCALE));
    canvas.height = Math.max(2, Math.floor(h * DPR * RES_SCALE));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let raf = null, t0 = performance.now(), visible = true, inView = true, last = 0;
  const FRAME_MS = 1000 / 30; // cap 30fps
  function frame(now) {
    if (!visible || !inView) { raf = null; return; }
    raf = requestAnimationFrame(frame);
    if (now - last < FRAME_MS) return;
    last = now;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  raf = requestAnimationFrame(frame);

  const start = () => { if (visible && inView && !raf) { last = 0; raf = requestAnimationFrame(frame); } };
  new IntersectionObserver((e) => { inView = e[0].isIntersecting; if (inView) start(); else if (raf) { cancelAnimationFrame(raf); raf = null; } }, { threshold: 0.01 }).observe(hero);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) start(); else if (raf) { cancelAnimationFrame(raf); raf = null; } });
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); if (raf) { cancelAnimationFrame(raf); raf = null; } }, { once: true });
}
