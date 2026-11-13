// stub tối giản để chạy GLTFLoader trong Node (chỉ đo geometry, texture rỗng)
class Img {
  constructor() { this.width = 1; this.height = 1; }
  set src(v) { queueMicrotask(() => this.onload && this.onload()); }
  addEventListener(t, f) { if (t === 'load') this.onload = f; if (t === 'error') this.onerror = f; }
}
globalThis.Image = Img;
globalThis.document = {
  createElement: (t) => t === 'canvas' ? { toDataURL: (m) => m === 'image/webp' ? 'data:image/webp' : 'data:image/png' } : new Img(),
  baseURI: 'file:///',
};
globalThis.self = globalThis;
