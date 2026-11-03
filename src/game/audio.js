// Âm thanh tổng hợp bằng WebAudio (không file). Mặc định tắt — chỉ bật khi khách bấm 🔈.

let ac = null;
let enabled = false;
let wind = null;

function ctx() {
  if (!ac) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ac = new AC();
  }
  if (ac.state === 'suspended') ac.resume();
  return ac;
}

function noiseBuffer(a, seconds, brown = false) {
  const buf = a.createBuffer(1, a.sampleRate * seconds, a.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
  }
  return buf;
}

export function setSound(on) {
  enabled = !!on;
  if (enabled) startWind(); else stopWind();
}

function startWind() {
  const a = ctx();
  if (!a || wind) return;
  const src = a.createBufferSource();
  src.buffer = noiseBuffer(a, 4, true);
  src.loop = true;
  const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500;
  const g = a.createGain(); g.gain.value = 0.05;
  src.connect(f).connect(g).connect(a.destination);
  src.start();
  wind = { src, g };
}

function stopWind() {
  if (!wind) return;
  try { wind.src.stop(); } catch (e) { /* đã dừng */ }
  wind = null;
}

// Chuông: sine cơ bản + hai bội âm tắt dần.
export function bell(base = 392, vol = 0.18) {
  if (!enabled) return;
  const a = ctx(); if (!a) return;
  const now = a.currentTime;
  for (const [mul, v, dur] of [[1, 1, 3.2], [2.76, 0.4, 2], [5.4, 0.15, 1.2]]) {
    const o = a.createOscillator(); o.type = 'sine'; o.frequency.value = base * mul;
    const g = a.createGain();
    g.gain.setValueAtTime(vol * v, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g).connect(a.destination); o.start(now); o.stop(now + dur);
  }
}

// Mõ gỗ / tiếng thẻ xăm: tiếng gõ ngắn qua bandpass.
export function knock(freq = 900, vol = 0.25) {
  if (!enabled) return;
  const a = ctx(); if (!a) return;
  const now = a.currentTime;
  const src = a.createBufferSource(); src.buffer = noiseBuffer(a, 0.08);
  const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 8;
  const g = a.createGain(); g.gain.setValueAtTime(vol, now); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
  src.connect(f).connect(g).connect(a.destination); src.start(now);
}

export function rattle() {
  for (let i = 0; i < 3; i++) setTimeout(() => knock(1400 + Math.random() * 900, 0.12), i * 45 + Math.random() * 30);
}
