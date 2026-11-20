# -*- coding: utf-8 -*-
# ============================================================================
#  BỘ TEXTURE KIẾN TRÚC LẶP THEO MÉT (docs/CONG-TRINH-LAM-LAI-MANIFEST.md §2.2) — numpy, không tải ngoài.
#  Mỗi vật liệu: <id>_c.webp (màu, gần trắng / trung tính — màu thật đặt bằng material.color) + <id>_n.webp (pháp tuyến
#  không gian tiếp tuyến, OpenGL +Y). Ảnh 1024² liền mép (nhiễu FFT tuần hoàn, hoa văn số nguyên chu kỳ).
#  SPAN (m): một ảnh phủ bao nhiêu mét → mật độ texel = 1024 / SPAN px/m.
#    python scripts/gen-arch-tex.py   → public/textures/arch/*.webp + span.json
# ============================================================================
import json, os
import numpy as np
from PIL import Image

N = 1024
OUT = 'public/textures/arch'
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(20261119)
yy, xx = np.mgrid[0:N, 0:N].astype(np.float32) / N   # [0,1) — v (dọc) , u (ngang)


def fnoise(scale, seed=None):
    """nhiễu tuần hoàn (liền mép): ồn trắng lọc thông thấp trong miền tần số; scale = số «đốm» trên cạnh ảnh"""
    r = np.random.default_rng(seed) if seed is not None else rng
    w = r.standard_normal((N, N))
    f = np.fft.fft2(w)
    ky = np.fft.fftfreq(N)[:, None] * N
    kx = np.fft.fftfreq(N)[None, :] * N
    k = np.sqrt(kx * kx + ky * ky)
    filt = np.exp(-(k / scale) ** 2)
    out = np.real(np.fft.ifft2(f * filt))
    out -= out.min(); out /= max(out.max(), 1e-6)
    return out.astype(np.float32)


def fbm(scales, weights, seed=0):
    acc = np.zeros((N, N), np.float32)
    for i, (s, w) in enumerate(zip(scales, weights)):
        acc += fnoise(s, seed + i * 17) * w
    acc -= acc.min(); acc /= max(acc.max(), 1e-6)
    return acc


def cell_rand(ci, cj, seed):
    """giá trị ngẫu nhiên tất định theo ô (ci, cj nguyên)"""
    h = (ci * 73856093) ^ (cj * 19349663) ^ (seed * 83492791)
    h = (h ^ (h >> 13)) * 1274126177
    return ((h & 0xFFFF).astype(np.float32)) / 65535.0


def normal_from_height(h, strength):
    """h: [0,1] cao độ; strength: độ dốc (lớn = gờ sắc). Trả ảnh RGB 0–255"""
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 0.5 * strength
    dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 0.5 * strength
    nx, ny, nz = -dx, dy, np.ones_like(h)  # ảnh: hàng tăng xuống dưới → v giảm; OpenGL +Y lên
    l = np.sqrt(nx * nx + ny * ny + nz * nz)
    n = np.stack([nx / l, ny / l, nz / l], -1)
    return ((n * 0.5 + 0.5) * 255).clip(0, 255).astype(np.uint8)


def save(name, col, h, strength, rough=None, nsz=N):
    c = (np.clip(col, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(c, 'RGB').save(f'{OUT}/{name}_c.webp', quality=88, method=6)
    nrm = normal_from_height(h, strength)
    if rough is not None:  # độ nhám vào kênh alpha của ảnh pháp tuyến (đọc ở shader .a)
        a = (np.clip(rough, 0, 1) * 255).astype(np.uint8)[..., None]
        im = Image.fromarray(np.concatenate([nrm, a], -1), 'RGBA')
    else:
        im = Image.fromarray(nrm, 'RGB')
    if nsz != N: im = im.resize((nsz, nsz), Image.LANCZOS)
    im.save(f'{OUT}/{name}_n.webp', quality=82, method=6)


def gray(v):
    return np.repeat(v[..., None], 3, -1)


SPAN = {}

# ---------------------------------------------------------------- 1. NGÓI ÂM DƯƠNG (筒瓦 + 板瓦) — nhìn từ trên mái
# 2 m × 2 m: 8 hàng ngói ống (chu kỳ 0,25 m theo u), mỗi viên dài 0,25 m theo v (8 viên). Rãnh chạy dọc v (xuôi dốc).
SPAN['tile'] = 2.0
cols, rows = 8, 8
u = xx * cols; v = yy * rows
fu = u - np.floor(u)                       # 0..1 trong một chu kỳ ngang
iu = np.floor(u).astype(np.int64); iv = np.floor(v + (iu % 2) * 0.5).astype(np.int64)
fv = (v + (iu % 2) * 0.5) - np.floor(v + (iu % 2) * 0.5)
# ngói ống (cover) chiếm 36 % giữa chu kỳ: bán trụ lồi; ngói rãnh (pan) hai bên: lòng máng lõm
d = np.abs(fu - 0.5)
cover = d < 0.18
hc = np.sqrt(np.clip(1 - (d / 0.18) ** 2, 0, 1)) * 0.9 + 0.1
hp = 0.25 * (np.abs(fu - 0.5) - 0.18) / 0.32           # máng: thấp ở mép ngói ống, cao dần ra mép ngoài (lòng máng)
hp = 0.08 + 0.18 * (1 - np.cos(np.clip((d - 0.18) / 0.32, 0, 1) * np.pi)) * 0.5
step = (1 - fv) * 0.12                                   # mỗi viên chồng lên viên dưới: bậc nhỏ ở đầu viên
h = np.where(cover, hc + step * 0.6, hp + step)
lip = (fv < 0.06) & cover                               # mép đầu viên ngói ống: rãnh tối
h = np.where(lip, h - 0.25, h)
tv = cell_rand(iu, iv, 3)
dirt = fbm([6, 24, 90], [0.5, 0.3, 0.2], 11)
lum = np.where(cover, 0.78 + 0.12 * tv, 0.62 + 0.1 * tv)
lum = lum * (0.82 + 0.3 * dirt)
lum = np.where(cover, lum, lum * (1 - 0.35 * np.clip((0.3 - d) * 3, 0, 1) * 0))  # máng sẫm hơn (đã qua lum)
moss = np.clip((fnoise(10, 31) - 0.62) * 4, 0, 1) * (~cover)
col = gray(lum)
col = col * (1 - moss[..., None] * 0.5) + moss[..., None] * np.array([0.33, 0.38, 0.22]) * 0.6
ao = np.clip(0.55 + h * 0.6, 0, 1)
col *= ao[..., None]
rough = 0.6 + 0.3 * dirt + moss * 0.1
save('tile', col, h + dirt * 0.03, 26.0, rough)

# ---------------------------------------------------------------- 2. GẠCH XANH 青砖 (mặt dọc gạch 0,48 × 0,12 m, mạch 1 cm)
SPAN['brick'] = 1.92
rows, per = 16, 4
v = yy * rows; iv = np.floor(v).astype(np.int64); fv = v - iv
u = xx * per + (iv % 2) * 0.5; iu = np.floor(u).astype(np.int64); fu = u - iu
mort_v, mort_u = 0.012 / 0.12, 0.012 / 0.48
edge = np.minimum(np.minimum(fv, 1 - fv) / mort_v, np.minimum(fu, 1 - fu) / mort_u)
brick = np.clip(edge - 0.5, 0, 1)
bevel = np.clip(edge * 0.6, 0, 1) ** 0.5
tv = cell_rand(iu % per, iv, 5)
grain = fbm([40, 160, 400], [0.4, 0.4, 0.2], 21)
chip = np.clip((fnoise(70, 41) - 0.72) * 6, 0, 1)
h = bevel * 0.8 + grain * 0.12 - chip * 0.3
lum_b = 0.62 + 0.18 * tv + 0.12 * (grain - 0.5)
lum_m = 0.78 + 0.08 * grain
lum = np.where(brick > 0, lum_b, lum_m) * (1 - chip * 0.15)
stain = fbm([3, 12], [0.6, 0.4], 61)
lum *= 0.85 + 0.25 * stain
col = gray(lum) * np.array([0.96, 0.99, 1.02])
rough = np.where(brick > 0, 0.82, 0.95)
save('brick', col, h, 14.0, rough)

# ---------------------------------------------------------------- 3. VỮA (tường đỏ cung đình / vôi trắng) — 4 m, vệt mưa dọc + loang
SPAN['plaster'] = 4.0
blot = fbm([4, 14, 50, 200], [0.35, 0.3, 0.2, 0.15], 71)
streak = fnoise(60, 81)
streak = np.clip(np.real(np.fft.ifft2(np.fft.fft2(streak) * np.exp(-(np.fft.fftfreq(N)[:, None] * N / 2) ** 2))), None, None)
streak = (streak - streak.min()) / max(np.ptp(streak), 1e-6)
crack = np.clip((np.abs(fnoise(30, 91) - 0.5) < 0.008).astype(np.float32) * (fnoise(6, 92) > 0.6), 0, 1)
lum = 0.88 + 0.12 * (blot - 0.5) * 2 * 0.6 - 0.12 * streak ** 2 - crack * 0.25
col = gray(lum)
h = blot * 0.4 + fbm([120, 400], [0.5, 0.5], 101) * 0.3 - crack * 0.5
save('plaster', col, h, 5.0, 0.85 + 0.1 * blot, 512)

# ---------------------------------------------------------------- 4. GỖ SƠN SON (cột, cửa) — 1 m, vân dọc + mòn sơn
SPAN['lacquer'] = 1.0
gu = fnoise(300, 111); gv = fnoise(8, 112)
grain = np.sin((xx * 22 + gu * 2.5 + gv * 0.6) * np.pi * 2) * 0.5 + 0.5
wear = np.clip((fbm([10, 40], [0.6, 0.4], 121) - 0.7) * 5, 0, 1)
lum = 0.86 + 0.07 * grain - 0.12 * fbm([3, 9], [0.5, 0.5], 131)
col = gray(lum)
col = col * (1 - wear[..., None]) + wear[..., None] * np.array([0.55, 0.42, 0.3])  # lộ gỗ dưới sơn (màu nhân với tint đỏ vẫn ra nâu sẫm)
h = grain * 0.15 + wear * -0.2
save('lacquer', col, h, 6.0, 0.45 + 0.35 * wear + 0.1 * grain, 512)

# ---------------------------------------------------------------- 5. VÁN GỖ (nhà dân, cửa lá sách) — 2 m, ván rộng 0,16–0,24 m theo u
SPAN['plank'] = 2.0
n_pl = 10
widths = rng.uniform(0.8, 1.2, n_pl); edges = np.concatenate([[0], np.cumsum(widths / widths.sum())])
idx = np.searchsorted(edges, xx, side='right') - 1
lo = edges[idx]; hi = edges[idx + 1]; fu = (xx - lo) / (hi - lo)
tone = rng.uniform(0.75, 1.05, n_pl)[idx]
gu = fnoise(260, 141)
grain = np.sin((yy * 3 + fu * 0.4 + gu * 3 + idx * 0.37) * np.pi * 9) * 0.5 + 0.5
knot = np.clip((fnoise(25, 151) - 0.82) * 8, 0, 1)
seam = np.clip(np.minimum(fu, 1 - fu) * 40, 0, 1)
lum = (0.7 + 0.18 * grain) * tone * seam * (1 - knot * 0.4)
col = gray(lum) * np.array([1.0, 0.93, 0.84])
h = seam * 0.6 + grain * 0.15 - knot * 0.2
save('plank', col, h, 9.0, 0.78 + 0.12 * grain, 512)

# ---------------------------------------------------------------- 6. ĐÁ KHỐI (nền, bậc, chân tường) — 2,4 m, khối 0,6 × 0,3 / 0,4 m
SPAN['stone'] = 2.4
rows_h = np.array([0.3, 0.4, 0.3, 0.4, 0.3, 0.4, 0.3, 0.4]); rows_h = rows_h / rows_h.sum()
redges = np.concatenate([[0], np.cumsum(rows_h)])
ri = np.searchsorted(redges, yy, side='right') - 1
fv = (yy - redges[ri]) / (redges[ri + 1] - redges[ri])
u = xx * 4 + (ri % 2) * 0.5 + (ri % 3) * 0.17
iu = np.floor(u).astype(np.int64); fu = u - iu
edge = np.minimum(np.minimum(fv, 1 - fv) * 9, np.minimum(fu, 1 - fu) * 18)
face = np.clip(edge, 0, 1) ** 0.6
tv = cell_rand(iu % 4, ri, 7)
pit = fbm([60, 240, 500], [0.4, 0.4, 0.2], 161)
lum = (0.76 + 0.14 * tv + 0.1 * (pit - 0.5)) * (0.6 + 0.4 * face)
dirt = fbm([5, 20], [0.6, 0.4], 171)
lum *= 0.88 + 0.2 * dirt
col = gray(lum) * np.array([1.0, 0.99, 0.96])
h = face * 0.7 + pit * 0.2
save('stone', col, h, 10.0, 0.8 + 0.12 * pit, 512)

# ---------------------------------------------------------------- 7. CẨM THẠCH HÁN BẠCH NGỌC (lan can, nền cao cấp) — 2 m
SPAN['marble'] = 2.0
vein = np.abs(np.sin((xx * 3 + yy * 1.2 + fbm([4, 16], [0.7, 0.3], 181) * 2.2) * np.pi * 2))
vein = np.clip(1 - vein * 12, 0, 1) * 0.25
cloud = fbm([3, 12, 60], [0.5, 0.3, 0.2], 191)
lum = 0.93 - vein - 0.06 * (cloud - 0.5)
col = gray(lum) * np.array([1.0, 0.99, 0.96])
save('marble', col, cloud * 0.2 + fbm([200, 500], [0.5, 0.5], 201) * 0.15, 3.0, 0.45 + 0.1 * cloud, 512)

json.dump({'size': N, 'span': SPAN}, open(f'{OUT}/span.json', 'w'), indent=1)
tot = sum(os.path.getsize(f'{OUT}/{f}') for f in os.listdir(OUT))
print('OK', SPAN, f'{tot/1e6:.2f} MB')
