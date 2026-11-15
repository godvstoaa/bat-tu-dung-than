# -*- coding: utf-8 -*-
# gen_dao_vua.py — «Đảo nền» dao_vua: ĐĨA ĐẢO DÙNG CHUNG cho 3 tỉ lệ (s×0,7 / s×1 / s×2 — instanceModel nhận s).
# Khớp số đo đã cài trong game (src/game/landmarks.js:186 «đo GLB: rộng 264, đáy −63,5, sân local y0»):
#   · bề rộng X = 264,0 m đúng (gờ mép Ø264), sân top đúng z = 0, đáy sâu đúng z = −63,52.
# Mặt trên 3 vòng:
#   (1) sân cẩm thạch trắng Ø95 lát ô 4 m (ô 3,96 + rãnh 4 cm) — ×2 → Ø190 ôm sky_palace;
#       lan can đá quanh sân: trụ lục giác mỗi ~3 m (chu vi 300 m / 100 trụ), chừa 2 miệng cầu
#       rộng 6 m ở ±Y Blender (= ±Z game — mặt tiền +Z);
#   (2) vành vườn cỏ Ø262: 8 luống dược 7×2,4 quanh r≈62 + lối đá vành rộng 3 m (r 85,5–88,5) tỏa
#       4 hướng + 1 hồ mây Ø18 (đĩa căng #dfe8f2 alpha 0,55, phát sáng #cfe0ff ×0,3, viền đá)
#       + 5 nền villa phẳng 14×10 ở r≈105;
#   (3) gờ mép đá nhô 1 m: Ø262 → Ø264.
# ĐÁY ĐÁ — port công thức rockUnder (src/game/heaven3d.js:29-47):
#   · miệng SIÊU-ELIP n=6 «vuông» nội tiếp dưới đĩa (chạm gờ Ø264 ở 4 hướng chéo, thụt ~27 m ở 4 trục)
#     → tròn dần xuống (shape = sq·(1−t) + 1,12·t), thuôn lerp(1→0,06);
#   · nhiễu góc theo k-bucket 84 = 28×3 như game: n = 0,82 + bump·0,32·(0,4+t) (t<0,05 → n=1),
#     chìm dọc theo cột bump[(k+7)%84]·depth·0,06;
#   · thuôn sâu max(hw,hd)×0,45 với hw = 132 (nửa bề rộng đĩa tính gờ) → depth = 59,4, mũi
#     −0,6−59,4−sink; sink chuẩn hoá để ĐÁY ĐÚNG −63,52 (khớp hằng số landmarks.js:187,195);
#   · rêu 12% đỉnh (t<0,12 → lerp MOSS 0,55·(1−t/0,12)); màu đá #8a8172→#5f584e vertex-color.
#   · lưới 112×56 = 12 544 tam giác ≈ «28 mảng × ~450 tam giác» (mỗi mảng gốc 28 = 4 dải × 56 hàng × 2).
#   · 1 seed cố định — đĩa DÙNG CHUNG cho 9 đảo («seed theo đảo» chỉ khác nhau lúc game xoay/nhân bản).
# Chất liệu: Principled BSDF thuần màu, KHÔNG texture ngoài; palette đổ qua COLOR_0 (tuyến tính),
#   chất liệu nền trắng để phép nhân vertex-color ra đúng màu. UV THEO MÉT (ô 4 m mặt lớn, 2 m chi tiết)
#   → mật độ chất liệu không đổi khi phóng ×2 / ×0,7.
# Gộp 3 mesh: dao_vua_san_vuon_ho / dao_vua_day_da / dao_vua_lan_can. Gốc (0,0,0) = MẶT SÂN, mét.
# Bản giữa ≤ 50 000 tam giác (bộ Decimate phòng hộ nếu vượt). Chạy:
#   blender -b --python gen_dao_vua.py -- --out <file.glb>
import bpy, math, random, sys, os, json, itertools

# ------------------------------------------------------------------ argv / hằng số
def _argv_after_dashdash():
    a = sys.argv
    return a[a.index('--') + 1:] if '--' in a else []

OUT = None
_aa = _argv_after_dashdash()
if '--out' in _aa:
    OUT = _aa[_aa.index('--out') + 1]
if not OUT:
    OUT = os.path.join(os.environ.get('TEMP', '/tmp'), 'dao_vua.glb')
os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)

SEED    = 20261113
R_SAN   = 47.5        # sân Ø95
R_PLIN  = 48.3        # mép đế vòng sân
R_POST  = 47.8        # vòng trụ lan can
R_GARD  = 131.0       # mép cỏ Ø262
R_LIP   = 132.0       # gờ mép nhô 1 m → Ø264 = bề rộng chuẩn game
Z_LIP_T, Z_GARD, Z_LOW = -0.12, -0.30, -0.55   # đỉnh gờ / mặt cỏ / đáy tường
Z_MOUTH = -0.6
HW      = R_LIP       # 132 — nửa bề rộng đĩa (tính gờ) cho công thức depth
DEPTH   = HW * 0.45   # 59,4 = max(hw,hd)×0,45
Z_TIP   = -63.52      # đáy đúng số đo game (landmarks.js:187)
RAD, HGT = 112, 56    # lưới đáy đá: 112×56×2 = 12 544 tam giác
N_K     = 28 * 3      # 84 bucket nhiễu góc — như R*3 của heaven3d.js
SQ_N    = 6.0         # siêu-elip «vuông» ở miệng
GAP_HALF = 3.0 / R_POST   # nửa miệng cầu 3 m → miệng rộng 6 m
MOUTH_A  = math.pi / 2.0  # miệng cầu +Y Blender = +Z game (mặt tiền)
# --mouths a1,a2 (độ, góc Blender quanh +Z; hướng game (gx, gz) ↔ atan2(−gz, gx)): mở thêm miệng lan can cho cầu chéo
# (đảo chủ: cầu B1 → Quan Tinh 27,5°, B2 → Thư Đảo 150,7° — 2026-11-15, bản lib_dao_vua_chu)
EXTRA_MOUTHS = [math.radians(float(v)) for v in _aa[_aa.index('--mouths') + 1].split(',')] if '--mouths' in _aa else []
MOUTHS = [MOUTH_A, MOUTH_A + math.pi] + EXTRA_MOUTHS
def in_mouth(a, w):
    return any(ang_dist(a, m) < w for m in MOUTHS)

# ------------------------------------------------------------------ màu (sRGB hex → linear)
def _lin(h):
    r, g, b = int(h[1:3], 16) / 255.0, int(h[3:5], 16) / 255.0, int(h[5:7], 16) / 255.0
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (f(r), f(g), f(b))

def mix(a, b, t):
    t = 0.0 if t < 0.0 else (1.0 if t > 1.0 else t)
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t)

ROCK = _lin('#8a8172'); ROCK2 = _lin('#5f584e'); MOSS = _lin('#6f9a58')
SAN  = _lin('#ece7da'); SAN2  = _lin('#d9d2c2'); CO   = _lin('#86b46c')
HO   = _lin('#dfe8f2'); HO_GLOW = _lin('#cfe0ff')
DA_SANG = _lin('#b9b1a0'); DAT = _lin('#7d6b52'); DUOC = _lin('#79a35c'); LOI = _lin('#cfc7b4')
GROOVE = mix(SAN2, ROCK2, 0.35); CO2 = _lin('#7ba75f'); WHITE = (1.0, 1.0, 1.0)

# ------------------------------------------------------------------ builder (Blender: Z lên, mặt tiền +Y → export glTF +Z)
class MeshB:
    def __init__(self):
        self.v = []; self.cols = []; self.uvs = []; self.faces = []
    def vert(self, x, y, z, col, uv):
        self.v.append((x, y, z)); self.cols.append(col); self.uvs.append(uv)
        return len(self.v) - 1
    def face(self, idxs, mat=0):
        if len(idxs) >= 3:
            self.faces.append((list(idxs), mat))

def quad(b, p0, p1, p2, p3, col, mat=0, uvdiv=4.0):
    i = [b.vert(x, y, z, col, (x / uvdiv, y / uvdiv)) for (x, y, z) in (p0, p1, p2, p3)]
    b.face(i, mat)

def ring_quad(b, ri, a0, ro, a1, z, col, mat=0, uvdiv=4.0):
    """mặt phẳng ngang (ri,a0)-(ro,a0)-(ro,a1)-(ri,a1), normal +Z"""
    quad(b, (math.cos(a0) * ri, math.sin(a0) * ri, z),
              (math.cos(a0) * ro, math.sin(a0) * ro, z),
              (math.cos(a1) * ro, math.sin(a1) * ro, z),
              (math.cos(a1) * ri, math.sin(a1) * ri, z), col, mat, uvdiv)

def wall_quad(b, r, a0, a1, z0, z1, col, uvdiv=4.0):
    """tường trụ hướng RA NGOÀI: (a0,z0)-(a1,z0)-(a1,z1)-(a0,z1)"""
    quad(b, (math.cos(a0) * r, math.sin(a0) * r, z0),
              (math.cos(a1) * r, math.sin(a1) * r, z0),
              (math.cos(a1) * r, math.sin(a1) * r, z1),
              (math.cos(a0) * r, math.sin(a0) * r, z1), col, uvdiv=uvdiv)

def disc(b, r, z, segs, col, down=False, uvdiv=4.0, cx=0.0, cy=0.0):
    c = b.vert(cx, cy, z, col, (cx / uvdiv, cy / uvdiv))
    ring = []
    for k in range(segs):
        a = k / segs * 2.0 * math.pi
        x, y = cx + math.cos(a) * r, cy + math.sin(a) * r
        ring.append(b.vert(x, y, z, col, (x / uvdiv, y / uvdiv)))
    for k in range(segs):
        if down:
            b.face((c, ring[(k + 1) % segs], ring[k]))   # normal −Z
        else:
            b.face((c, ring[k], ring[(k + 1) % segs]))   # normal +Z

def ring_band(b, ri, ro, z0, z1, segs, ok_seg, col, uvdiv=4.0, bottom=True, inner=True):
    """dải vành kín: trên (+Z) / dưới (−Z) / tường trong (−radial) / tường ngoài (+radial)"""
    for k in range(segs):
        if ok_seg and not ok_seg(k):
            continue
        a0, a1 = k / segs * 2.0 * math.pi, (k + 1) / segs * 2.0 * math.pi
        ring_quad(b, ri, a0, ro, a1, z1, col, uvdiv=uvdiv)                      # trên
        if bottom:
            quad(b, (math.cos(a0) * ri, math.sin(a0) * ri, z0),
                      (math.cos(a1) * ri, math.sin(a1) * ri, z0),
                      (math.cos(a1) * ro, math.sin(a1) * ro, z0),
                      (math.cos(a0) * ro, math.sin(a0) * ro, z0), col, uvdiv=uvdiv)  # dưới (−Z)
        if inner:                                                               # tường trong
            quad(b, (math.cos(a1) * ri, math.sin(a1) * ri, z0),
                      (math.cos(a0) * ri, math.sin(a0) * ri, z0),
                      (math.cos(a0) * ri, math.sin(a0) * ri, z1),
                      (math.cos(a1) * ri, math.sin(a1) * ri, z1), col, uvdiv=uvdiv)
        quad(b, (math.cos(a0) * ro, math.sin(a0) * ro, z0),                      # tường ngoài
                  (math.cos(a1) * ro, math.sin(a1) * ro, z0),
                  (math.cos(a1) * ro, math.sin(a1) * ro, z1),
                  (math.cos(a0) * ro, math.sin(a0) * ro, z1), col, uvdiv=uvdiv)

def box(b, cx, cy, z0, z1, hx, hy, ang, top, side, uvdiv=2.0):
    ca, sa = math.cos(ang), math.sin(ang)
    P = []
    for (lx, ly) in ((-hx, -hy), (hx, -hy), (hx, hy), (-hx, hy)):
        P.append((cx + lx * ca - ly * sa, cy + lx * sa + ly * ca))
    i0 = [b.vert(x, y, z0, side, (x / uvdiv, y / uvdiv)) for (x, y) in P]
    i1 = [b.vert(x, y, z1, top,  (x / uvdiv, y / uvdiv)) for (x, y) in P]
    b.face(i1)                                                    # trên (+Z, CCW)
    for k in range(4):
        kn = (k + 1) % 4
        b.face((i0[k], i0[kn], i1[kn], i1[k]))                    # 4 hông (+outward)

def ang_dist(a, b):
    d = abs((a - b) % (2.0 * math.pi))
    return d if d <= math.pi else 2.0 * math.pi - d

def sq_super(a, n=SQ_N):
    """siêu-elip: 1 ở trục → max 2^(1/3)=1,2599 ở 45° (n=6)"""
    c, s = abs(math.cos(a)), abs(math.sin(a))
    return 1.0 / ((c ** n + s ** n) ** (1.0 / n))

SQ_MAX = sq_super(math.pi / 4.0)     # 1,259921
R_MOUTH_MAX = R_LIP                 # miệng chạm gờ ở 4 hướng chéo

# ================================================================== MESH 1 — sân + vườn + hồ
b1 = MeshB()
rt = random.Random(SEED + 1); rp = random.Random(SEED + 3); rq = random.Random(SEED + 4)

disc(b1, 47.45, -0.03, 48, GROOVE)                                # nền rãnh dưới ô sân
for k in range(64):                                               # tường bậc sân r=47,45 z 0→−0,3
    wall_quad(b1, 47.45, k / 64 * 2.0 * math.pi, (k + 1) / 64 * 2.0 * math.pi, -0.3, 0.0, mix(SAN2, DA_SANG, 0.25))
ring_band(b1, 47.45, R_PLIN, -0.3, -0.05, 64, None, mix(DA_SANG, GROOVE, 0.3), bottom=False, inner=False)  # đế vòng sân

for i in range(-12, 12):                                          # ô sân cẩm thạch 4 m (ô 3,96 + rãnh 4 cm)
    for j in range(-12, 12):
        cx, cy = i * 4.0 + 2.0, j * 4.0 + 2.0
        h = 1.96
        cs = [(cx - h, cy - h), (cx + h, cy - h), (cx + h, cy + h), (cx - h, cy + h)]
        if max(math.hypot(x, y) for (x, y) in cs) > 47.2:
            continue
        quad(b1, (cs[0][0], cs[0][1], 0.0), (cs[1][0], cs[1][1], 0.0),
                  (cs[2][0], cs[2][1], 0.0), (cs[3][0], cs[3][1], 0.0), mix(SAN, SAN2, rt.random() * 0.34))

RINGS = [R_PLIN, 58.0, 71.0, 85.5, 100.0, 116.0, R_GARD]          # mặt cỏ vành vườn (phẳng, biến thiên màu)
SEGS = 64
prev = None
for ri, r in enumerate(RINGS):
    row = []
    for k in range(SEGS):
        a = k / SEGS * 2.0 * math.pi
        x, y = math.cos(a) * r, math.sin(a) * r
        t = 0.16 + 0.20 * (math.sin(a * 3.0 + ri * 1.7) + 1.0) / 2.0
        row.append(b1.vert(x, y, Z_GARD, mix(CO, CO2, t), (x / 4.0, y / 4.0)))
    if prev:
        for k in range(SEGS):
            b1.face((prev[k], row[k], row[(k + 1) % SEGS], prev[(k + 1) % SEGS]))
    prev = row

for k in range(64):                                               # tường ngoài vườn r=131 z −0,55→−0,3
    wall_quad(b1, R_GARD, k / 64 * 2.0 * math.pi, (k + 1) / 64 * 2.0 * math.pi, Z_LOW, Z_GARD, mix(ROCK2, ROCK, 0.3))

for k in range(64):                                               # lối đá vành rộng 3 m (r 85,5–88,5)
    a0, a1 = k / 64 * 2.0 * math.pi, (k + 1) / 64 * 2.0 * math.pi
    ring_quad(b1, 85.5, a0, 88.5, a1, -0.28, mix(LOI, SAN2, rp.random() * 0.3))
for (x0, x1, y0, y1) in ((-1.5, 1.5, R_PLIN, 85.5), (-1.5, 1.5, 88.5, 127.0),   # lối tỏa ±Y (qua miệng cầu) + ±X
                         (-1.5, 1.5, -85.5, -R_PLIN), (-1.5, 1.5, -127.0, -88.5),
                         (88.5, 127.0, -1.5, 1.5), (-127.0, -88.5, -1.5, 1.5)):
    quad(b1, (x0, y0, -0.28), (x1, y0, -0.28), (x1, y1, -0.28), (x0, y1, -0.28), mix(LOI, SAN2, rp.random() * 0.3))

for m in EXTRA_MOUTHS:                                            # lối đá tỏa qua miệng thêm (rộng 3 m)
    ca, sa = math.cos(m), math.sin(m)
    for (r0, r1) in ((R_PLIN, 85.5), (88.5, 127.0)):
        P = lambda r, w: (ca * r - sa * w, sa * r + ca * w, -0.28)
        quad(b1, P(r0, -1.5), P(r1, -1.5), P(r1, 1.5), P(r0, 1.5), mix(LOI, SAN2, rp.random() * 0.3))
# --- hồ mây Ø18: viền đá + đĩa căng mờ phát sáng (mat 1)
PX, PY = -51.0, -51.0
for k in range(24):
    a0, a1 = k / 24 * 2.0 * math.pi, (k + 1) / 24 * 2.0 * math.pi
    c = mix(DA_SANG, SAN2, rp.random() * 0.35)
    quad(b1, (PX + math.cos(a0) * 8.95, PY + math.sin(a0) * 8.95, -0.02),   # mép trên viền
              (PX + math.cos(a0) * 9.55, PY + math.sin(a0) * 9.55, -0.02),
              (PX + math.cos(a1) * 9.55, PY + math.sin(a1) * 9.55, -0.02),
              (PX + math.cos(a1) * 8.95, PY + math.sin(a1) * 8.95, -0.02), c, uvdiv=2.0)
    quad(b1, (PX + math.cos(a1) * 8.95, PY + math.sin(a1) * 8.95, -0.3),    # tường trong (hồ)
              (PX + math.cos(a0) * 8.95, PY + math.sin(a0) * 8.95, -0.3),
              (PX + math.cos(a0) * 8.95, PY + math.sin(a0) * 8.95, -0.02),
              (PX + math.cos(a1) * 8.95, PY + math.sin(a1) * 8.95, -0.02), c, uvdiv=2.0)
    quad(b1, (PX + math.cos(a0) * 9.55, PY + math.sin(a0) * 9.55, -0.3),    # tường ngoài viền
              (PX + math.cos(a1) * 9.55, PY + math.sin(a1) * 9.55, -0.3),
              (PX + math.cos(a1) * 9.55, PY + math.sin(a1) * 9.55, -0.02),
              (PX + math.cos(a0) * 9.55, PY + math.sin(a0) * 9.55, -0.02), c, uvdiv=2.0)
_pc = b1.vert(PX, PY, -0.14, WHITE, (PX / 2.0, PY / 2.0))
_ring = []
for k in range(24):
    a = k / 24 * 2.0 * math.pi
    x, y = PX + math.cos(a) * 8.9, PY + math.sin(a) * 8.9
    _ring.append(b1.vert(x, y, -0.14, WHITE, (x / 2.0, y / 2.0)))
for k in range(24):
    b1.face((_pc, _ring[k], _ring[(k + 1) % 24]), mat=1)

def _pad_angle(d):                                              # luống / nền villa trùng lối miệng thêm (±20°) → dời ra 20° khỏi miệng
    for m in EXTRA_MOUTHS:
        md = math.degrees(m)
        diff = (d - md + 180.0) % 360.0 - 180.0
        if abs(diff) < 20.0:
            return md + (20.0 if diff >= 0 else -20.0)
    return d
for d in (15, 60, 105, 150, 195, 240, 285, 330):                  # 8 luống dược 7×2,4 hướng xịt tâm
    th = math.radians(_pad_angle(d))
    box(b1, math.cos(th) * 62.0, math.sin(th) * 62.0, -0.3, 0.05, 3.5, 1.2, th,
        mix(DUOC, CO, rq.random() * 0.3), DAT, uvdiv=2.0)

for d in (20, 80, 160, 215, 300):                                 # 5 nền villa phẳng 14×10 (dài theo tiếp tuyến)
    th = math.radians(_pad_angle(d))
    box(b1, math.cos(th) * 105.0, math.sin(th) * 105.0, -0.3, -0.15, 7.0, 5.0, th + math.pi / 2.0,
        mix(LOI, SAN2, rq.random() * 0.25), DAT, uvdiv=2.0)

# ================================================================== MESH 2 — đáy đá (port rockUnder)
b2 = MeshB()
rb = random.Random(SEED)
bump  = [rb.random() for _ in range(N_K)]
bump2 = [rb.random() for _ in range(N_K)]
# chuẩn hoá sink để mũi sâu nhất ĐÚNG Z_TIP (đáy −63,52 khớp hằng số landmarks.js:187,195)
_sink_span = DEPTH * 0.06
_b2max = max(bump2) or 1.0
_sink_k = (Z_MOUTH - DEPTH - Z_TIP) / _sink_span / _b2max         # scale sao cho max sink chạm Z_TIP
bump2 = [x * _sink_k for x in bump2]

# --- gờ mép: trên −0,12 / trong −0,3→−0,12 / ngoài −0,55→−0,12 / đáy gờ (r 131→132) −0,55
for k in range(RAD):
    a0, a1 = k / RAD * 2.0 * math.pi, (k + 1) / RAD * 2.0 * math.pi
    ring_quad(b2, R_GARD, a0, R_LIP, a1, Z_LIP_T, mix(ROCK, MOSS, 0.22))                        # trên gờ
    wall_quad(b2, R_GARD, a0, a1, Z_GARD, Z_LIP_T, mix(ROCK, DA_SANG, 0.35))                    # mặt trong gờ
    wall_quad(b2, R_LIP, a0, a1, Z_LOW, Z_LIP_T, mix(ROCK, ROCK2, 0.25))                        # mặt ngoài gờ
under, under_out = [], []                                       # vành đỉnh đáy gờ: trong r131 / ngoài r132
for k in range(RAD):
    a = k / RAD * 2.0 * math.pi
    under.append(b2.vert(math.cos(a) * R_GARD, math.sin(a) * R_GARD, Z_LOW,
                         mix(ROCK2, ROCK, 0.2), (math.cos(a) * R_GARD / 4.0, math.sin(a) * R_GARD / 4.0)))
    under_out.append(b2.vert(math.cos(a) * R_LIP, math.sin(a) * R_LIP, Z_LOW,
                             mix(ROCK2, ROCK, 0.15), (math.cos(a) * R_LIP / 4.0, math.sin(a) * R_LIP / 4.0)))
for k in range(RAD):                                            # đáy gờ (−Z): (a1,in)→(a1,out)→(a0,out)→(a0,in)
    b2.face((under[(k + 1) % RAD], under_out[(k + 1) % RAD], under_out[k], under[k]))

# --- trụ đá karst 112×56 theo công thức heaven3d.js:29-47
grid = []
for j in range(HGT + 1):
    t = j / float(HGT)
    row = []
    for i in range(RAD):
        th = i / float(RAD) * 2.0 * math.pi
        k = int(((th + math.pi) / (2.0 * math.pi)) * N_K) % N_K
        n = 1.0 if t < 0.05 else 0.82 + bump[k] * 0.32 * (0.4 + t)          # nhiễu góc 0,82±0,32
        shape = sq_super(th) * (1.0 - t) + 1.12 * t                         # vuông ở miệng → tròn dần
        taper = 1.0 - 0.94 * t                                              # bán kính 1 → 0,06
        rmouth = R_MOUTH_MAX * sq_super(th) / SQ_MAX                        # miệng nội tiếp (max = R_LIP)
        r = rmouth * (shape / sq_super(th)) * taper * n                     # = miệng·[sq(1−t)+1,12t]/sq · taper·n
        z = Z_MOUTH - t * DEPTH - (bump2[(k + 7) % N_K] * DEPTH * 0.06 if t > 0.05 else 0.0)
        x, y = math.cos(th) * r, math.sin(th) * r
        c = mix(ROCK, ROCK2, min(1.0, t * 1.2 + bump[k] * 0.25))
        if t < 0.12:
            c = mix(c, MOSS, 0.55 * (1.0 - t / 0.12))                       # rêu 12% đỉnh
        row.append(b2.vert(x, y, z, c, (th * (HW / 4.0), (-z) / 4.0)))      # UV theo mét (ô 4 m)
    grid.append(row)
for j in range(HGT):
    for i in range(RAD):
        i2 = (i + 1) % RAD
        b2.face((grid[j][i], grid[j + 1][i], grid[j + 1][i2], grid[j][i2])) # normal +radial
b2.face(tuple(reversed(grid[HGT])))                                         # nắp mũi (−Z)
# --- váy đáy (apron): vòng đáy gờ r131 → vành miệng, quads −Z, bỏ đoạn miệng trùm ra ngoài r131
for i in range(RAD):
    i2 = (i + 1) % RAD
    r_m0 = math.hypot(b2.v[grid[0][i]][0], b2.v[grid[0][i]][1])
    r_m1 = math.hypot(b2.v[grid[0][i2]][0], b2.v[grid[0][i2]][1])
    if r_m0 >= R_GARD - 0.01 or r_m1 >= R_GARD - 0.01:
        continue                                   # miệng chạm/qua mép gờ — đáy gờ đã che
    b2.face((under[i2], grid[0][i2], grid[0][i], under[i]))   # (a1,ngoài)→(a1,trong)→(a0,trong)→(a0,ngoài): −Z

# ================================================================== MESH 3 — lan can quanh sân
b3 = MeshB()
rq2 = random.Random(SEED + 6)

def hex_prism(b, cx, cy, z0, z1, r, side, top):
    ring0, ring1 = [], []
    for k in range(6):
        a = k / 6.0 * 2.0 * math.pi
        x, y = cx + math.cos(a) * r, cy + math.sin(a) * r
        ring0.append(b.vert(x, y, z0, side, (x / 2.0, y / 2.0)))
        ring1.append(b.vert(x, y, z1, top,  (x / 2.0, y / 2.0)))
    for k in range(6):
        b.face((ring0[k], ring0[(k + 1) % 6], ring1[(k + 1) % 6], ring1[k]))
    b.face(tuple(ring1))

NPOST = 100
for i in range(NPOST):                                            # trụ mỗi ~3 m, bỏ 2 miệng cầu rộng 6 m
    a = i / NPOST * 2.0 * math.pi
    if in_mouth(a, GAP_HALF + 0.006):
        continue
    hex_prism(b3, math.cos(a) * R_POST, math.sin(a) * R_POST, -0.05, 1.15, 0.22,
              mix(SAN2, SAN, rq2.random() * 0.4), mix(SAN, SAN2, 0.25))
for a in [m + d for m in MOUTHS for d in (-GAP_HALF - 0.012, GAP_HALF + 0.012)]:  # 2 trụ đầu cầu to hơn mỗi miệng
    box(b3, math.cos(a) * R_POST, math.sin(a) * R_POST, -0.05, 1.3, 0.26, 0.26, a, SAN, SAN2, uvdiv=2.0)

def rail_ok(k):
    am = (k + 0.5) / 100.0 * 2.0 * math.pi
    return not in_mouth(am, 0.066)

ring_band(b3, R_POST - 0.22, R_POST + 0.22, 1.02, 1.2, 100, rail_ok, mix(SAN2, SAN, 0.3), uvdiv=2.0)     # tay vịn
ring_band(b3, R_POST - 0.12, R_POST + 0.12, 0.52, 0.6, 100, rail_ok, mix(SAN2, DA_SANG, 0.3), uvdiv=2.0) # đà giữa

# ================================================================== object + chất liệu + export
def principled(name, base, rough, alpha=1.0, emi=None, emi_k=0.0, vc=False):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    bs = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
    for nm, val in (('Base Color', (*base, 1.0)), ('Roughness', rough)):
        for kk in bs.inputs:
            if kk.name == nm:
                kk.default_value = val
                break
    if alpha < 1.0:
        for kk in bs.inputs:
            if kk.name == 'Alpha':
                kk.default_value = alpha
        try:
            m.surface_render_method = 'BLENDED'
        except Exception:
            pass
    if emi is not None:
        done = False
        for nm in ('Emission Color', 'Emission'):
            for kk in bs.inputs:
                if kk.name == nm:
                    kk.default_value = (*emi, 1.0)
                    done = True
                    break
            if done:
                break
        for kk in bs.inputs:
            if kk.name == 'Emission Strength':
                kk.default_value = emi_k
    if vc:
        try:
            ca = nt.nodes.new('ShaderNodeAttribute')
            ca.attribute_name = 'Color'
            nt.links.new(ca.outputs['Color'], bs.inputs['Base Color'])
        except Exception:
            pass
    return m

def build(name, mb, mats, smooth=False):
    me = bpy.data.meshes.new(name)
    me.from_pydata(mb.v, [], [f for (f, _) in mb.faces])
    me.validate()
    for m in mats:
        me.materials.append(m)
    for fi, (idxs, mi) in enumerate(mb.faces):
        me.polygons[fi].material_index = mi
    me.update()
    uvl = me.uv_layers.new(name='UVMap')
    if uvl:
        for fi, (idxs, mi) in enumerate(mb.faces):
            for kk, li in enumerate(me.polygons[fi].loop_indices):
                uvl.data[li].uv = mb.uvs[idxs[kk]]
    try:
        attr = me.color_attributes.new('Color', 'FLOAT_COLOR', 'POINT')
        for vi, c in enumerate(mb.cols):
            attr.data[vi].color = (c[0], c[1], c[2], 1.0)
        me.color_attributes.active_index = 0
    except Exception as e:
        print('COLOR_ATTR_FAIL', name, e)
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    me.update()
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    return ob

bpy.ops.wm.read_factory_settings(use_empty=True)

mat_san = principled('dao_vua_san', WHITE, 0.88, vc=True)
mat_ho  = principled('dao_vua_ho', HO, 0.25, alpha=0.55, emi=HO_GLOW, emi_k=0.3)
mat_da  = principled('dao_vua_da', WHITE, 0.96, vc=True)
mat_lan = principled('dao_vua_lan_can', WHITE, 0.85, vc=True)

ob1 = build('dao_vua_san_vuon_ho', b1, [mat_san, mat_ho])
ob2 = build('dao_vua_day_da', b2, [mat_da], smooth=True)
ob3 = build('dao_vua_lan_can', b3, [mat_lan])

def tri_of(ob):
    return sum(max(len(p.vertices) - 2, 1) for p in ob.data.polygons)

counts = {ob.name: tri_of(ob) for ob in (ob1, ob2, ob3)}
total = sum(counts.values())
if total > 48000:  # phòng hộ ngân sách — Decimate nếu dựng dày quá
    for ob in (ob1, ob2, ob3):
        d = ob.modifiers.new('decimate', 'DECIMATE')
        d.ratio = max(0.05, 46000.0 / total)
        bpy.context.view_layer.objects.active = ob
        ob.select_set(True)
        bpy.ops.object.modifier_apply(modifier='decimate')
    counts = {ob.name: tri_of(ob) for ob in (ob1, ob2, ob3)}
    total = sum(counts.values())

try:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_colors=True)
except TypeError:  # Blender mới bỏ опция colors (luôn export COLOR_0)
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB')

# đối chiếu số đo game: rộng X/Z, đáy sâu
allv = list(itertools.chain(b1.v, b2.v, b3.v))
bbox = {'width': round(max(v[0] for v in allv) - min(v[0] for v in allv), 3),
        'depth_z': round(max(v[1] for v in allv) - min(v[1] for v in allv), 3),
        'bottom': round(min(v[2] for v in allv), 3)}
print('DAO_VUA_RESULT ' + json.dumps({'file': OUT, 'tris': counts, 'total': total, 'bbox': bbox}))
