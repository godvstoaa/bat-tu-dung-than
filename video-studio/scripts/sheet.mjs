import sharp from 'sharp';
import fs from 'node:fs';
const dir = process.env.DIR||'video-studio/public/shots';
const files = process.argv.slice(3);
const W = +(process.env.W||480), H = +(process.env.H||270), cols = +(process.env.COLS||4);
const rows = Math.ceil(files.length / cols);
const comps = await Promise.all(files.map(async (f, i) => ({
  input: await sharp(`${dir}/${f}`).resize(W, H, { fit: 'contain', background: '#000' }).composite([{ input: Buffer.from(`<svg width="${W}" height="30"><rect width="${W}" height="30" fill="black" opacity=".7"/><text x="8" y="21" fill="yellow" font-size="18">${f}</text></svg>`), gravity: 'north' }]).png().toBuffer(),
  left: (i % cols) * W, top: Math.floor(i / cols) * H })));
await sharp({ create: { width: W * cols, height: H * rows, channels: 3, background: '#222' } }).composite(comps).png().toFile(process.argv[2]);
