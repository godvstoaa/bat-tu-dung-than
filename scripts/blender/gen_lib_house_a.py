# -*- coding: utf-8 -*-
# ============================================================================
#  NHÀ PHỐ AAA «lib_house_a» — a2 (2 tầng 3 gian) · a1 (1 tầng 3 gian) ·
#  a2_open (cửa bản xếp xoay mở 35°, tuỳ chọn). MỖI MESH MỘT FILE: buildInstanced
#  (src/game/assets.js:271) nhân bản MỌI mesh của file — gộp file sẽ vẽ chồng
#  + fit bbox union → mỗi biến thể xuất đúng 1 mesh `house_aX`.
#  Kích thước LUẬT (khớp HOUSE_SPECS src/game/cityblocks.js:33):
#    a2 11,0×8,0×8,0 → wd 11/8=1,375 · hd 8/11≈0,73 ; a1 11,0×7,0×4,6 →
#    wd 11/7≈1,571 · hd 4,6/11≈0,42 ; f:[10,12].
#  1 unit = 1 m · gốc (0,0,0) đáy-tâm · mặt tiền -Y Blender → +Z glTF (yup).
#  Atlas 2048 dùng chung 2 biến thể (màu + pháp tuyến sinh thủ tục numpy,
#  không ảnh ngoài): gạch xám #8A8580 · vôi #F5F2E9 · chân ẩm taupe #C8B8A0
#  cao 0,5 NỨT BẰNG NORMAL MAP · gỗ son #964B00 · ngói ván #4A5459 (nắng bạc
#  #6B7A80, rãnh #3B424C) · gạch hồi chụm #A44139 · bờ it #3B424C · khung
#  #664228 · biển ngang 1,5×0,5×0,06 mặt sơn son với UV RIÊNG (region sign,
#  giữ giữa sạch cho code dè chữ) · đèn lồng Ø0,45×0,55 lụa #C3272B KHÔNG
#  emissive (game gán glowAll như landmarks.js:325) · tua vàng #E7C969.
#  Lặp «array thủ công có jitter» (tốt hơn Array Modifier: mỗi bản lệch nhẹ
#  nhìn tay người): ngói pan 0,32×0,22 ~8+ tris dàn ROWS×33×2 · ống ngói bịt
#  mối pan · gạch hồi chụm 2 hàng · ván cửa 0,42×2,7×0,05 ×7/gian · cột hiên
#  Ø0,28 nhịp 3,6 ×4 (a2 cao 3,4 · a1 hạ vì mái 4,6 — LUẬT kích thước thắng).
#  Roughness: ngói 0,9 · gỗ 0,8-0,9 · vôi 0,95 · sơn son 0,45 · lụa 0,55.
#  Chạy: blender -b --python scripts/blender/gen_lib_house_a.py -- \
#           --variant a2|a1|a2_open --out <file.glb>
# ============================================================================
import bpy, sys, math, json, random
import numpy as np
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
def aget(k, d=None): return argv[argv.index(k) + 1] if k in argv else d
OUT = aget('--out', 'lib_house_a2.glb')
VARIANT = aget('--variant', 'a2')
TRI_BUDGET = 210000
SEED = 20261114
random.seed(SEED); rng = np.random.default_rng(SEED)

bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene
scn.unit_settings.system = 'METRIC'; scn.unit_settings.scale_length = 1.0

# ---------------------------------------------------------------- biến thể
SLOPE = math.radians(24.5)
TAN, COS, SIN = math.tan(SLOPE), math.cos(SLOPE), math.sin(SLOPE)
P = {
 'a2': dict(name='house_a2', floors=2, walltop=6.20, yf=-2.50, yb=3.50,
            eave=3.95, cap_top=8.00, col_top=3.28, door_h=2.70,
            tile_pts=8, tile_segs=4, roll_segs=16, gal=True,
            sign=(0.0, -2.44, 5.55), lant_z=3.26),
 'a1': dict(name='house_a1', floors=1, walltop=2.88, yf=-2.30, yb=3.20,
            eave=3.48, cap_top=4.60, col_top=2.85, door_h=2.70,
            tile_pts=6, tile_segs=3, roll_segs=12, gal=False,
            sign=(0.0, -2.16, 2.52), lant_z=2.85),
}
p = P['a2' if VARIANT.startswith('a2') else 'a1']
DOOR_OPEN = math.radians(35.0) if VARIANT == 'a2_open' else 0.0
RIDGE_Z = p['cap_top'] - 0.20                 # mặt phẳng ngói tại nóc
SLOPE_LEN = p['eave'] / COS
ROWS = int(SLOPE_LEN / 0.22)
COLS = 33
XT, XB, XW, HW = 5.44, 5.50, 10.8, 5.4        # mép ngói / bồ phong / tường
PITCH = (2 * XT - 0.02) / COLS                # ≈0,3235 → ngói 0,32
BAY_C = (-3.6, 0.0, 3.6)
COL_Y = -3.38
WALL_T = 0.24
YH = p['eave'] + 0.04                         # nửa bbox Y (mặt ngoài bờ it)

# ---------------------------------------------------------------- ATLAS 2048
AT, CELL = 2048, 512
REG = {}
def reg(name, u0, v0, nw, nh): REG[name] = (u0, v0, nw, nh)
reg('brick', 0.00, 0.75, 11.0, 2.9); reg('lime', 0.25, 0.75, 11.0, 2.8)
reg('damp',  0.50, 0.75, 11.0, 0.5); reg('plank',0.75, 0.75, 0.42, 2.7)
reg('tile',  0.00, 0.50, 0.32, 0.27); reg('roll', 0.25, 0.50, 0.22, 4.4)
reg('gable', 0.50, 0.50, 0.24, 0.115); reg('eave',0.75, 0.50, 11.0, 0.34)
reg('frame', 0.00, 0.25, 0.30, 3.4); reg('lat',  0.25, 0.25, 0.10, 1.0)
reg('silk',  0.50, 0.25, 1.41, 0.55); reg('sign',0.75, 0.25, 1.38, 0.38)
reg('stone', 0.00, 0.00, 3.6, 0.6);  reg('deck', 0.25, 0.00, 3.6, 1.5)
reg('gold',  0.50, 0.00, 0.12, 0.14)

COL_AT = np.zeros((AT, AT, 3), np.float32)
HGT_AT = np.zeros((AT, AT), np.float32)
def hx(h): return np.array([int(h[i:i+2], 16) / 255 for i in (0, 2, 4)], np.float32)
def lowfreq(n):
    g = rng.random((n, n)).astype(np.float32)
    big = np.repeat(np.repeat(g, CELL // n, 0), CELL // n, 1)[:CELL, :CELL]
    return np.ascontiguousarray(big[:, :, None])                # (512,512,1) broadcast màu
def paint(name, fn):
    u0, v0 = REG[name][0], REG[name][1]
    x0, y0 = int(u0 * AT), int(v0 * AT)
    C, H = COL_AT[y0:y0+CELL, x0:x0+CELL], HGT_AT[y0:y0+CELL, x0:x0+CELL]
    fn(C, H)
    np.clip(C, 0, 1, out=C)

def fn_brick(C, H):
    base, mor = hx('8A8580'), hx('9E9992')
    R, K = 26, 40; bh, bw = CELL / R, CELL / K
    C[:] = mor
    for r in range(R):
        off = (r % 2) * bw / 2
        for k in range(K + 1):
            xa, xb = int(k * bw - off), int((k + 1) * bw - off)
            j = 1.0 + (random.random() - 0.5) * 0.16
            C[int(r*bh)+1:int((r+1)*bh)-1, max(xa,0)+1:xb-1] = base * j
            H[int(r*bh)+1:int((r+1)*bh)-1, max(xa,0)+1:xb-1] = 0.9 if (r+k) % 3 else 1.4
    H[:] -= 2.4
paint('brick', fn_brick)
def fn_lime(C, H):
    C[:] = hx('F5F2E9'); m = lowfreq(16)
    C[:] = C * (1 - 0.42 * m) + hx('EDEAE0') * (0.42 * m)
    for _ in range(26):
        x, y, r = rng.integers(0, CELL), rng.integers(0, CELL), rng.integers(6, 26)
        yy, xx = np.ogrid[:CELL, :CELL]
        msk = (xx - x)**2 + (yy - y)**2 < r * r
        C[msk] = C[msk] * 0.94 + hx('DFDACC') * 0.06
paint('lime', fn_lime)
def fn_damp(C, H):
    C[:] = hx('C8B8A0')
    v = (np.arange(CELL, dtype=np.float32) / CELL)[:, None]
    C[:] = C * (0.84 + 0.16 * v); m = lowfreq(16)
    C[:] = C * (1 - 0.22 * m) + hx('BCAC94') * (0.22 * m)
    for _ in range(14):                        # nứt: random-walk từ chân lên
        x, y = float(rng.integers(20, CELL-20)), 0.0
        while y < CELL - 6:
            for dx in (-1, 0, 1):
                C[int(y), int(x)+dx] = hx('A99F8A'); H[int(y), int(x)+dx] = -3.2
            if rng.random() < 0.5:
                C[int(y), int(x)+2] = hx('B8AE98'); H[int(y), int(x)+2] = -1.8
            y += rng.random() * 3.2 + 1.0; x = min(max(x + rng.normal(0, 1.6), 3), CELL-4)
    for _ in range(40):
        x, y, r = rng.integers(0, CELL), rng.integers(0, CELL), rng.integers(2, 7)
        C[y:y+r, x:x+r] = C[y:y+r, x:x+r] * 0.93
paint('damp', fn_damp)
def grain_v(C, H, base, amp):
    C[:] = base * (1.0 + (rng.random((CELL, 1)).astype(np.float32) - 0.5) * 2 * amp)
    for _ in range(7):
        x = int(rng.integers(0, CELL)); C[:, x:x+2] *= 0.88; H[:, x:x+2] -= 0.5
paint('plank', lambda C, H: grain_v(C, H, hx('964B00'), 0.07))
def fn_tile(C, H):
    C[:] = hx('4A5459'); n = rng.random((CELL, CELL, 1)).astype(np.float32)
    C[:] = C * (0.92 + 0.16 * n); sun = lowfreq(8)
    C[:] = C * (1 - 0.5 * sun) + hx('6B7A80') * (0.5 * sun)
    for _ in range(220):
        x, y, r = rng.integers(0, CELL), rng.integers(0, CELL), rng.integers(1, 4)
        C[y:y+r, x:x+r] = hx('3B424C')
    H[:] = (n[:, :, 0] - 0.5) * 1.1
paint('tile', fn_tile)
def fn_roll(C, H):
    C[:] = (hx('434C52')[None, None, :] *
            (0.9 + 0.2 * rng.random((1, CELL, 1)).astype(np.float32)))
    C[:] = C * (0.92 + 0.16 * rng.random((CELL, 1, 1)).astype(np.float32))
paint('roll', fn_roll)
paint('gable', lambda C, H: (C.__setitem__(Ellipsis, hx('A44139')[None, None, :] * (0.92 + 0.16 * rng.random((CELL, CELL, 1)).astype(np.float32))),
                             H.__setitem__(Ellipsis, (rng.random((CELL, CELL)).astype(np.float32) - 0.5) * 0.6)))
paint('eave', lambda C, H: grain_v(C, H, hx('3B424C'), 0.10))
paint('frame', lambda C, H: grain_v(C, H, hx('664228'), 0.09))
paint('lat', lambda C, H: grain_v(C, H, hx('C19A6B'), 0.08))
def fn_silk(C, H):
    C[:] = hx('C3272B')
    for k in range(14):
        x = int(k * CELL / 14); C[:, x:x+3] = hx('8F1D20'); H[:, x:x+3] -= 1.2
    C[0:14, :] = hx('8F1D20'); C[-14:, :] = hx('8F1D20')
    C[:] = C * (0.94 + 0.12 * rng.random((CELL, CELL, 1)).astype(np.float32))
paint('silk', fn_silk)
def fn_sign(C, H):
    C[:] = hx('8C2117')
    yy, xx = np.mgrid[0:CELL, 0:CELL].astype(np.float32)
    edge = np.maximum(np.abs(xx/CELL - .5), np.abs(yy/CELL - .5)) * 2
    C[:] = C * (1.0 - 0.16 * np.clip(edge - 0.6, 0, 1)[..., None])
    for _ in range(9):
        x, y = float(rng.integers(0, CELL)), float(rng.integers(0, CELL))
        for _ in range(24):
            C[int(y) % CELL, int(x) % CELL] = hx('6E180F')
            x += rng.normal(0, 2); y += rng.normal(0, 2)
paint('sign', fn_sign)
def fn_stone(C, H):
    C[:] = hx('8E8A80') * (0.9 + 0.2 * lowfreq(16))
    for _ in range(400):
        x, y, r = rng.integers(0, CELL), rng.integers(0, CELL), rng.integers(1, 3)
        C[y:y+r, x:x+r] *= 0.88
paint('stone', fn_stone)
def fn_deck(C, H):
    C[:] = hx('9C7B4F') * (0.94 + 0.12 * rng.random((CELL, 1)).astype(np.float32))
    for k in range(8):
        y = int(k * CELL / 8); C[y:y+2, :] = hx('6B4E2E'); H[y:y+2, :] = -1.6
paint('deck', fn_deck)
paint('gold', lambda C, H: C.__setitem__(Ellipsis, hx('E7C969')[None, None, :] * (0.95 + 0.1 * rng.random((CELL, CELL, 1)).astype(np.float32))))

def mk_image(nm, arr3, noncolor=False):
    im = bpy.data.images.new(nm, AT, AT, alpha=False, float_buffer=False)
    rgba = np.dstack([arr3, np.ones((AT, AT), np.float32)]).ravel()
    im.pixels.foreach_set(np.ascontiguousarray(rgba, np.float32))
    if noncolor: im.colorspace_settings.name = 'Non-Color'
    return im
gy, gx = np.gradient(HGT_AT)
ln = np.sqrt(gx*gx + gy*gy + 1.0)
NOR_AT = np.dstack([0.5 + 0.5*(-gx/ln), 0.5 + 0.5*(-gy/ln), 0.5 + 0.5/ln]).astype(np.float32)
IMG_C = mk_image('ha_atlas_col', COL_AT)
IMG_N = mk_image('ha_atlas_nor', NOR_AT, noncolor=True)

ROUGH = dict(brick=0.92, lime=0.95, damp=0.95, plank=0.80, tile=0.90, roll=0.90,
             gable=0.85, eave=0.85, frame=0.85, lat=0.80, silk=0.55, sign=0.45,
             stone=0.95, deck=0.85, gold=0.35)
MATS, MLIST = {}, []
for key in REG:
    m = bpy.data.materials.new('ha_' + key); m.use_nodes = True
    nt = m.node_tree; bs = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
    tc = nt.nodes.new('ShaderNodeTexImage'); tc.image = IMG_C
    tn = nt.nodes.new('ShaderNodeTexImage'); tn.image = IMG_N
    tn.image.colorspace_settings.name = 'Non-Color'
    nm = nt.nodes.new('ShaderNodeNormalMap')
    nt.links.new(tc.outputs['Color'], bs.inputs['Base Color'])
    nt.links.new(tn.outputs['Color'], nm.inputs['Color'])
    nt.links.new(nm.outputs['Normal'], bs.inputs['Normal'])
    bs.inputs['Roughness'].default_value = ROUGH[key]
    if key == 'gold': bs.inputs['Metallic'].default_value = 0.85
    MATS[key] = len(MLIST); MLIST.append(m)

def uvw(key, a, b):
    u0, v0, nw, nh = REG[key]
    return (u0 + min(max(a/nw, 0.0), 1.0) * 0.25, v0 + min(max(b/nh, 0.0), 1.0) * 0.25)
def uvf(key, fu, fv):
    u0, v0 = REG[key][0], REG[key][1]
    return (u0 + fu * 0.25, v0 + fv * 0.25)

# ---------------------------------------------------------------- BUCKET
class BKt:
    def __init__(self):
        self.verts, self.faces, self.fmat, self.fsm, self.fuv = [], [], [], [], []
    def v(self, pt):
        self.verts.append((pt[0], pt[1], pt[2])); return len(self.verts) - 1
    def quad(self, a, b, c, d, mat, uvs, sm=False):
        self.faces.append((a, b, c, d)); self.fmat.append(mat); self.fsm.append(sm); self.fuv.append(tuple(uvs))
    def tri(self, a, b, c, mat, uvs, sm=False):
        self.faces.append((a, b, c)); self.fmat.append(mat); self.fsm.append(sm); self.fuv.append(tuple(uvs))
B = BKt()

FACES = [(4, 5, 7, 6, 'z+'), (0, 2, 3, 1, 'z-'), (2, 3, 7, 6, 'y+'),
         (0, 1, 5, 4, 'y-'), (1, 3, 7, 5, 'x+'), (0, 4, 6, 2, 'x-')]
def box(mat, cx, cy, cz, sx, sy, sz, uv='local', w0=(0, 0, 0), rz=None, sm=False):
    """Hộp 6 mặt. uv='local': mỗi mặt map trọn ô atlas (chi tiết nhỏ).
    uv='world': theo mét thế giới, w0=(ox, oy, bz) — u=(x+ox|y+oy)/nom, v=(z−bz)."""
    ex, ey, ez = sx/2, sy/2, sz/2
    L = [(-ex,-ey,-ez),(ex,-ey,-ez),(ex,ey,-ez),(-ex,ey,-ez),
         (-ex,-ey, ez),(ex,-ey, ez),(ex,ey, ez),(-ex,ey, ez)]
    if rz:  # xoay quanh trục Z tại pivot THẾ GIỚI (bản lề cửa) — áp SAU khi dựng
        a, px, py = rz; ca, sa = math.cos(a), math.sin(a)
        C = [((x-px)*ca - (y-py)*sa + px, (x-px)*sa + (y-py)*ca + py, z + cz - cz)
             for x, y, z in [(w[0]+cx, w[1]+cy, w[2]+cz) for w in L]]
    else:
        C = [(x+cx, y+cy, z+cz) for x, y, z in L]
    ids = [B.v(c) for c in C]
    mi = MATS[mat]
    for i0, i1, i2, i3, ax in FACES:
        ul = []
        for i in (i0, i1, i2, i3):
            x, y, z = L[i]
            if uv == 'local':
                fu = {'z+': x/sx, 'z-': -x/sx, 'y+': -x/sx, 'y-': x/sx,
                      'x+': y/sy, 'x-': -y/sy}[ax] + 0.5
                fv = {'z+': y/sy, 'z-': y/sy, 'y+': z/sz, 'y-': z/sz,
                      'x+': z/sz, 'x-': z/sz}[ax] + 0.5
                ul.append(uvf(mat, fu, fv))
            else:
                w = C[i]
                if ax in ('x+', 'x-'): ul.append(uvw(mat, w[1]+w0[1], w[2]-w0[2]))
                elif ax in ('y+', 'y-'): ul.append(uvw(mat, w[0]+w0[0], w[2]-w0[2]))
                else: ul.append(uvw(mat, w[0]+w0[0], w[1]+w0[1]))
        B.quad(ids[i0], ids[i1], ids[i2], ids[i3], mi, ul, sm)

def vcyl(cx, cy, z0, z1, r0, r1, segs, key, sm=True, caps=True):
    mat = MATS[key]
    rb = [B.v((cx + r0*math.cos(2*math.pi*k/segs), cy + r0*math.sin(2*math.pi*k/segs), z0))
          for k in range(segs)]
    rt = [B.v((cx + r1*math.cos(2*math.pi*k/segs), cy + r1*math.sin(2*math.pi*k/segs), z1))
          for k in range(segs)]
    for k in range(segs):
        n = (k+1) % segs; u0, u1 = k/segs, (k+1)/segs
        B.quad(rb[k], rb[n], rt[n], rt[k], mat,
               (uvf(key, u0, 0), uvf(key, u1, 0), uvf(key, u1, 1), uvf(key, u0, 1)), sm)
    if caps:
        for k in range(1, segs-1):
            B.tri(rt[0], rt[k], rt[k+1], mat, (uvf(key, .5, .5),)*3, sm)
            B.tri(rb[0], rb[k+1], rb[k], mat, (uvf(key, .5, .5),)*3)

def slope_basis(front):
    if front: return ((1, 0, 0), (0, COS, SIN), (0, -SIN, COS)), False
    return ((1, 0, 0), (0, -COS, SIN), (0, SIN, COS)), True   # trái tay → lật winding

def stamp(lv, lf, luv, basis, origin, mat, flip, sm=False):
    vi = []
    for x, y, z in lv:
        vi.append(B.v((origin[0] + basis[0][0]*x + basis[1][0]*y + basis[2][0]*z,
                       origin[1] + basis[0][1]*x + basis[1][1]*y + basis[2][1]*z,
                       origin[2] + basis[0][2]*x + basis[1][2]*y + basis[2][2]*z)))
    for f, uv in zip(lf, luv):
        f2 = tuple(reversed(f)) if flip else f
        uv2 = tuple(reversed(uv)) if flip else uv
        if len(f) == 4: B.quad(vi[f2[0]], vi[f2[1]], vi[f2[2]], vi[f2[3]], mat, uv2, sm)
        else: B.tri(vi[f2[0]], vi[f2[1]], vi[f2[2]], mat, uv2, sm)

def slope_box(mat, basis, origin, flip, sx, sy, sz, uvkey=None, dz=0.0, yc=0.0):
    """Hộp local (x ngang, y LÊN dốc, z pháp tuyến) đóng trên mặt mái.
    yc: dời tâm theo trục y local (dọc dốc); dz: dời theo pháp tuyến."""
    k = uvkey or mat
    ex, ey, ez = sx/2, sy/2, sz/2
    L = [(-ex,-ey,-ez),(ex,-ey,-ez),(ex,ey,-ez),(-ex,ey,-ez),
         (-ex,-ey, ez),(ex,-ey, ez),(ex,ey, ez),(-ex,ey, ez)]
    uv8 = [uvf(k, 0.1, 0.1), uvf(k, 0.9, 0.1), uvf(k, 0.9, 0.9), uvf(k, 0.1, 0.9),
           uvf(k, 0.15, 0.15), uvf(k, 0.85, 0.15), uvf(k, 0.85, 0.85), uvf(k, 0.15, 0.85)]
    lf = [(i0, i1, i2, i3) for i0, i1, i2, i3, _ in FACES]
    o = (origin[0] + basis[1][0]*yc, origin[1] + basis[1][1]*yc,
         origin[2] + basis[1][2]*yc + dz)
    stamp(L, lf, [tuple(uv8[i] for i in f) for f in lf], basis, o, MATS[mat], flip)

# ================================================================ THÂN NHÀ
def walls():
    wt, yf, yb = p['walltop'], p['yf'], p['yb']
    bz = 0.5                                    # đỉnh chân ẩm
    bt = 3.4 if p['floors'] == 2 else wt        # đỉnh dải gạch
    W2 = (5.5, YH, bz)                          # offset uv world (gạch)
    for sx in (-1, 1):                          # tường bên
        box('brick', sx*(HW-WALL_T/2), (yf+yb)/2, (bz+bt)/2, WALL_T, yb-yf, bt-bz, 'world', W2)
        box('damp', sx*(HW-0.006), (yf+yb)/2, bz/2+0.004, WALL_T+0.012, yb-yf-0.02, bz, 'world', (5.5, YH, 0.0))
        if p['floors'] == 2:
            box('lime', sx*(HW-WALL_T/2), (yf+yb)/2, (3.4+wt)/2, WALL_T, yb-yf, wt-3.4, 'world', (5.5, YH, 3.4))
    box('brick', 0, yb-WALL_T/2, (bz+bt)/2, 2*HW-WALL_T, WALL_T, bt-bz, 'world', W2)
    box('damp', 0, yb+0.006, bz/2+0.004, 2*HW-0.02, WALL_T+0.012, bz, 'world', (5.5, YH, 0.0))
    if p['floors'] == 2:
        box('lime', 0, yb-WALL_T/2, (3.4+wt)/2, 2*HW-WALL_T, WALL_T, wt-3.4, 'world', (5.5, YH, 3.4))
    zb = min(0.15+p['door_h']+0.12, bt-0.06)    # mặt tiền: dải gạch trên cửa
    box('brick', 0, yf+WALL_T/2, (zb+bt)/2, 2*HW-WALL_T, WALL_T, bt-zb, 'world', W2)
    for bx in BAY_C:
        for sx in (-1, 1):
            box('brick', bx+sx*1.63, yf+WALL_T/2, (0.15+bt)/2, 0.34, WALL_T, bt-0.15, 'world', W2)
    if p['floors'] == 2:
        box('lime', 0, yf+WALL_T/2, (3.4+wt)/2, 2*HW-WALL_T, WALL_T, wt-3.4, 'world', (5.5, YH, 3.4))
    yt = (RIDGE_Z - wt) / TAN                   # núi hồi (tường tam giác theo mái)
    apex = RIDGE_Z + 0.02
    for sx in (-1, 1):
        x0, x1 = (-HW, -HW+WALL_T) if sx < 0 else (HW-WALL_T, HW)
        tri = [(-yt, wt-0.02), (yt, wt-0.02), (0.0, apex)]
        ids = [B.v((x0, y, z)) for y, z in tri] + [B.v((x1, y, z)) for y, z in tri]
        uvT = [uvw('lime', y+YH, z-(3.4 if p['floors'] == 2 else wt-0.02)) for y, z in tri]
        B.tri(ids[0], ids[1], ids[2], MATS['lime'], (uvT[0], uvT[1], uvT[2]))
        B.tri(ids[5], ids[4], ids[3], MATS['lime'], (uvT[2], uvT[1], uvT[0]))
        B.quad(ids[0], ids[3], ids[4], ids[1], MATS['lime'], (uvf('lime', .5, .02),)*4)
        B.quad(ids[1], ids[4], ids[5], ids[2], MATS['lime'], (uvf('lime', .08, .5),)*4)
        B.quad(ids[2], ids[5], ids[3], ids[0], MATS['lime'], (uvf('lime', .92, .5),)*4)

def porch():
    yf = p['yf']
    # sàn trong nhà (chặn nhìn xuyên xuống dưới tường từ góc thấp)
    box('stone', 0, (yf+0.05+p['yb'])/2, 0.05, 2*HW-0.4, p['yb']-yf-0.05, 0.10, 'world', (5.5, YH, 0.0))
    deck_f = -p['eave'] + 0.04                 # mép trước sàn (sát bờ it)
    box('stone', 0, (deck_f+yf)/2+0.05, 0.075, 10.8, yf-deck_f+0.1, 0.15, 'world', (5.5, YH, 0.0))
    box('stone', 0, deck_f-0.03, 0.0375, 3.6, 0.12, 0.075, 'local')   # bậc cửa giữa
    for x in (-5.4, -1.8, 1.8, 5.4):           # cột hiên Ø0,28 (nhịp 3,6 × 4)
        bx_ = x - math.copysign(0.09, x) if abs(x) > 5.0 else x   # đế 2 cột mép thụt vào giữ bbox
        box('stone', bx_, COL_Y, 0.225, 0.34, 0.34, 0.15)
        vcyl(x, COL_Y, 0.30, p['col_top']-0.08, 0.14, 0.13, 16, 'frame')
        box('frame', x, COL_Y, p['col_top']-0.04, 0.30, 0.30, 0.08)
    if p['floors'] == 2:                       # gác gỗ (lan can diên sâu 1,0)
        ge = yf - 1.0
        k = 0
        x = -5.25
        while x < 5.26:
            box('frame', x, (yf+ge)/2, 3.31, 0.10, 1.02, 0.14); x += 0.45; k += 1
        x = -5.32
        while x < 5.33:
            box('deck', x, (yf+ge)/2, 3.37, 0.14, 1.04, 0.06); x += 0.148
        box('frame', 0, ge-0.02, 3.34, 10.76, 0.18, 0.20)              # xà mép gác
        x = -5.30
        while x < 5.31:                        # lan can: trụ + tay vịn + nan dọc
            box('lat', x, ge-0.06, 3.40+0.46, 0.06, 0.06, 0.92); x += 0.36
        box('lat', 0, ge-0.06, 4.32, 10.66, 0.07, 0.10)
        box('lat', 0, ge-0.06, 3.86, 10.66, 0.06, 0.08)
        box('lat', 0, ge-0.06, 3.52, 10.66, 0.06, 0.08)
        x = -5.28
        while x < 5.29:
            box('lat', x, ge-0.06, 3.90, 0.028, 0.028, 0.70); x += 0.118
        for x in (-5.32, -1.82, 1.82, 5.32):   # cột gác tầng 2
            box('frame', x, yf+0.08, (3.4+p['walltop'])/2, 0.15, 0.15, p['walltop']-3.4)
    else:                                       # a1: xà hiên đỡ mái
        box('frame', 0, COL_Y-0.06, p['col_top']-0.12, 10.86, 0.22, 0.24)

def doors():
    yf, dh = p['yf'], p['door_h']
    leaf_w = 2.99
    for bx in BAY_C:
        hxg = bx - leaf_w/2                     # bản lề trái
        for sx in (-1, 1):
            box('frame', bx+sx*(leaf_w/2+0.075), yf+0.05, 0.15+dh/2+0.10, 0.14, 0.12, dh+0.20)
        box('frame', bx, yf+0.06, 0.15+dh+0.12, leaf_w+0.5, 0.14, 0.24)
        box('stone', bx, yf+0.10, 0.135, leaf_w+0.3, 0.30, 0.05)
        rz = (-DOOR_OPEN, hxg, yf+0.03) if DOOR_OPEN else None
        for k in range(7):                      # 1 ván 0,42 ×7 (bản xếp)
            box('plank', hxg+(k+0.5)*(leaf_w/7), yf+0.055, 0.15+dh/2,
                0.42, 0.05, dh, 'local', rz=rz)
        for zz in (0.75, dh-0.45):              # đòn ngang giữ ván
            box('frame', bx, yf+0.075, 0.15+zz, leaf_w-0.12, 0.024, 0.15, 'local', rz=rz)
        box('frame', bx, yf+0.075, 0.15+dh/2, leaf_w-0.2, 0.022, 0.12,
            'local', rz=(math.copysign(0.09, 1), bx, yf+0.075) if not DOOR_OPEN else None)
        if DOOR_OPEN:                           # ván chéo theo cánh mở
            box('frame', hxg+leaf_w*0.5, yf+0.075, 0.15+dh/2, leaf_w*0.86, 0.022, 0.12,
                'local', rz=(-DOOR_OPEN+0.10, hxg, yf+0.03))

def windows():
    yf = p['yf']
    if p['floors'] == 2:
        for bx in BAY_C:                        # cửa sổ con 1,2×1,4 tầng 2
            cy, z0, z1 = yf-0.03, 3.90, 5.30
            box('frame', bx, cy, z1+0.05, 1.36, 0.10, 0.10)
            box('frame', bx, cy, z0-0.05, 1.44, 0.16, 0.10)
            for sx in (-1, 1): box('frame', bx+sx*0.655, cy, (z0+z1)/2, 0.10, 0.10, z1-z0+0.1)
            box('frame', bx, cy-0.01, (z0+z1)/2, 1.26, 0.04, z1-z0)   # nền tối
            for mx in (-0.21, 0.21): box('frame', bx+mx, cy+0.02, (z0+z1)/2, 0.05, 0.05, z1-z0)
            box('frame', bx, cy+0.02, (z0+z1)/2, 1.12, 0.05, 0.05)
        for bx in (-2.7, 2.7):                  # cửa sổ sau
            cy, z0, z1 = p['yb']+0.03, 4.20, 5.30
            box('frame', bx, cy, z1+0.04, 1.02, 0.10, 0.08)
            for sx in (-1, 1): box('frame', bx+sx*0.49, cy, (z0+z1)/2, 0.08, 0.10, z1-z0+0.08)
            box('frame', bx, cy+0.01, (z0+z1)/2, 0.98, 0.04, z1-z0)
            box('frame', bx, cy+0.03, (z0+z1)/2, 0.8, 0.04, 0.04)
    else:
        for bx in (-2.7, 2.7):                  # a1: 2 cửa sổ cao sát xà
            cy, z0, z1 = p['yb']+0.03, 1.55, 2.55
            box('frame', bx, cy, z1+0.04, 1.02, 0.10, 0.08)
            for sx in (-1, 1): box('frame', bx+sx*0.49, cy, (z0+z1)/2, 0.08, 0.10, z1-z0+0.08)
            box('frame', bx, cy+0.01, (z0+z1)/2, 0.98, 0.04, z1-z0)
            box('frame', bx, cy+0.03, (z0+z1)/2, 0.8, 0.04, 0.04)
        for bx in (-4.6, 4.6):                  # 2 ô nhỏ mặt tiền
            cy, z0, z1 = yf-0.03, 1.60, 2.60
            box('frame', bx, cy, z1+0.04, 0.86, 0.10, 0.08)
            for sx in (-1, 1): box('frame', bx+sx*0.41, cy, (z0+z1)/2, 0.08, 0.10, z1-z0+0.08)
            box('frame', bx, cy+0.01, (z0+z1)/2, 0.8, 0.04, z1-z0)

def sign_lanterns():
    sx, sy, sz = p['sign']
    box('frame', sx, sy, sz, 1.50, 0.06, 0.50)                    # khung biển ngang
    box('sign', sx, sy-0.035, sz, 1.38, 0.025, 0.38)              # mặt sơn son (UV riêng)
    for hx in (-0.55, 0.55):
        vcyl(sx+hx, sy-0.02, sz+0.19, sz+0.34, 0.015, 0.015, 6, 'frame', caps=False)
    for lx in (-5.08, 5.08):                                      # đèn lồng 2 đầu cột
        lz = p['lant_z']
        vcyl(lx, COL_Y, lz-0.28, lz, 0.012, 0.012, 6, 'frame', caps=False)
        vcyl(lx, COL_Y, lz-0.33, lz-0.28, 0.135, 0.10, 10, 'frame')
        vcyl(lx, COL_Y, lz-0.75, lz-0.33, 0.225, 0.215, 14, 'silk')
        vcyl(lx, COL_Y, lz-0.79, lz-0.75, 0.09, 0.115, 10, 'frame')
        vcyl(lx, COL_Y, lz-0.88, lz-0.79, 0.028, 0.02, 6, 'gold')
        for tx in (-0.05, 0.0, 0.05):                             # tua vàng
            box('gold', lx+tx, COL_Y, lz-0.94, 0.012, 0.012, 0.10)

# ================================================================ MÁI
def build_tile():
    N, M = p['tile_pts'], p['tile_segs']
    w, l, rise = 0.315, 0.27, 0.05
    lv = []
    for i in range(N):
        t = i/(N-1)
        x = (t-0.5)*w*(1-0.06*t)
        z = rise*(1-math.cos(2*math.pi*t))/2
        for j in range(M+1): lv.append((x, j/M*l, z+(j/M)*0.008))
    base = len(lv)
    for i in range(N): lv.append((lv[i][0], 0.0, lv[i][2]-0.028))       # skirt đáy
    def gi(i, j): return i*(M+1)+j
    def si(i): return base+i
    lf, luv = [], []
    u0, v0 = random.random()*0.45, random.random()*0.45
    for i in range(N-1):
        for j in range(M):
            lf.append((gi(i,j), gi(i+1,j), gi(i+1,j+1), gi(i,j+1)))
            luv.append((uvf('tile', u0+i/(N-1)*0.5, v0+j/M*0.5),
                        uvf('tile', u0+(i+1)/(N-1)*0.5, v0+j/M*0.5),
                        uvf('tile', u0+(i+1)/(N-1)*0.5, v0+(j+1)/M*0.5),
                        uvf('tile', u0+i/(N-1)*0.5, v0+(j+1)/M*0.5)))
    for i in range(N-1):
        lf.append((gi(i,0), si(i), si(i+1), gi(i+1,0)))                # nắp mép hiên
        luv.append((uvf('tile', .15, .04), uvf('tile', .15, .01),
                    uvf('tile', .85, .01), uvf('tile', .85, .04)))
        lf.append((gi(i,M), gi(i+1,M), si(i+1)+0, si(i)+0))            # nắp nóc (giấu)
        luv.append((uvf('tile', .15, .96), uvf('tile', .85, .96),
                    uvf('tile', .85, .99), uvf('tile', .15, .99)))
    return lv, lf, luv

TILE = build_tile()

def build_roll():
    seg, M = 8, p['roll_segs']
    r, L = 0.105, SLOPE_LEN-0.10
    lv = [(r*math.cos(2*math.pi*k/seg)*1.25, j/M*L, r*math.sin(2*math.pi*k/seg))
          for j in range(M+1) for k in range(seg)]
    def ix(k, j): return j*seg+(k % seg)
    lf, luv = [], []
    for j in range(M):
        for k in range(seg):
            lf.append((ix(k+1,j), ix(k,j), ix(k,j+1), ix(k+1,j+1)))
            luv.append((uvf('roll', (k+1)/seg, j/M), uvf('roll', k/seg, j/M),
                        uvf('roll', k/seg, (j+1)/M), uvf('roll', (k+1)/seg, (j+1)/M)))
    cap = [len(lv)]  # nắp dưới (nhìn từ phố)
    lf.append((ix(0, M), ix(2, M), ix(1, M)))
    luv.append((uvf('roll', .5, .98),)*3)
    return lv, lf, luv

ROLL = build_roll()

def roof():
    for front in (True, False):
        basis, flip = slope_basis(front)
        sgn = 1 if front else -1
        for k in range(17):                       # ván lợp dưới (nóc → hiên)
            x = -XT+0.03+(k+0.5)*(2*XT-0.06)/17
            ev = p['eave']
            slope_box('deck', basis, (x, -sgn*ev, RIDGE_Z-0.005-ev*TAN), flip,
                      0.62, SLOPE_LEN+0.02, 0.045, dz=-0.05, yc=(SLOPE_LEN+0.02)/2)
        for j in range(ROWS):                     # ngói pan dàn 2 chiều + jitter
            s = 0.16 + j*0.22
            for k in range(COLS):
                x = -XT+0.02+(k+0.5)*PITCH
                o = (x + rng.normal(0, 0.003), -sgn*s*COS + rng.normal(0, 0.003),
                     RIDGE_Z+0.02-s*SIN + 0.002*random.random())
                stamp(TILE[0], TILE[1], TILE[2], basis, o, MATS['tile'], flip, sm=True)
        for k in range(COLS+1):                   # ống ngói bịt mối pan (chạy từ hiên lên nóc)
            x = -XT+0.02+k*PITCH
            o = (x, -sgn*p['eave'], RIDGE_Z+0.10-SLOPE_LEN*SIN)
            stamp(ROLL[0], ROLL[1], ROLL[2], basis, o, MATS['roll'], flip, sm=True)
        ey = p['eave']-0.03                       # bờ it dọc hiên (ey: toạ độ Y thế giới)
        slope_box('eave', basis, (0.0, -sgn*ey, RIDGE_Z+0.015-ey*TAN), flip,
                  11.0, 0.18, 0.30, dz=-0.13)
    yt = (RIDGE_Z - p['walltop']) / TAN           # bồ phong + gạch chụm đầu hồi
    rake = math.hypot(yt, RIDGE_Z+0.02-p['walltop']) + 0.05
    for front in (True, False):
        basis, flip = slope_basis(front)
        sgn = 1 if front else -1
        for sx in (-1, 1):
            slope_box('eave', basis, (sx*5.475, 0.0, RIDGE_Z+0.02), flip,
                      0.05, rake+0.10, 0.36, dz=-0.16, yc=-(rake+0.10)/2)
            s = 0.18
            while s < rake-0.10:
                for row in (0, 1):                # gạch chụm 2 hàng so le
                    o = (sx*5.43 + rng.normal(0, 0.003),
                         -sgn*(s+row*0.13)*COS, RIDGE_Z+0.02-(s+row*0.13)*SIN + 0.028+row*0.038)
                    slope_box('gable', basis, o, flip, 0.115, 0.24, 0.05)
                s += 0.26
    arc_r = 0.135                                 # yên nóc bán nguyệt + 2 đầu chụm
    base_z = p['cap_top'] - arc_r
    ring = [(math.cos(math.pi*k/6)*arc_r, base_z+math.sin(math.pi*k/6)*arc_r) for k in range(7)]
    x0, x1 = -5.45, 5.45
    v0 = [B.v((x0, y, z)) for y, z in ring]
    v1 = [B.v((x1, y, z)) for y, z in ring]
    for k in range(6):
        B.quad(v0[k], v1[k], v1[k+1], v0[k+1], MATS['roll'],
               (uvf('roll', k/6, 0), uvf('roll', k/6, 1), uvf('roll', (k+1)/6, 1), uvf('roll', (k+1)/6, 0)), True)
    B.quad(v0[0], v1[0], v1[6], v0[6], MATS['roll'], (uvf('roll', 0, .5),)*4)
    for sx in (-1, 1):
        box('gable', sx*5.42, 0, p['cap_top']-0.11, 0.12, 0.34, 0.22)

# ================================================================ DỰNG & XUẤT
walls(); porch(); doors(); windows(); sign_lanterns(); roof()

name = p['name']
me = bpy.data.meshes.new(name)
me.from_pydata(B.verts, [], B.faces)
vok = bool(me.validate())      # validate() tự sửa lỗi拓扑; báo cáo kết quả
me.update()
uvl = me.uv_layers.new(name='UVMap')
for m in MLIST: me.materials.append(m)
li = 0
for i, poly in enumerate(me.polygons):
    poly.material_index = B.fmat[i]
    poly.use_smooth = B.fsm[i]
    uvs = B.fuv[i]
    for j in range(len(poly.vertices)):
        uvl.data[li].uv = uvs[j]; li += 1

obj = bpy.data.objects.new(name, me)
scn.collection.objects.link(obj)

def tri_count(o): return sum(len(pp.vertices)-2 for pp in o.data.polygons)
total = tri_count(obj)

# gộp đỉnh trùng (khớp mép hộp) — như gen_tieu_quan.py:275
bpy.ops.object.select_all(action='DESELECT')
obj.select_set(True); bpy.context.view_layer.objects.active = obj
mod = obj.modifiers.new('weld_clean', 'WELD'); mod.merge_threshold = 0.0004
bpy.ops.object.modifier_apply(modifier='weld_clean')
total = tri_count(obj)

# khống chế ngân sách (gen_tieu_quan.py:286-294)
decimated = False
if total > TRI_BUDGET:
    ratio = max(0.05, 0.94*TRI_BUDGET/total)
    dm = obj.modifiers.new('decimate_budget', 'DECIMATE')
    dm.ratio = ratio; dm.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier='decimate_budget')
    total = tri_count(obj); decimated = True

# bbox thế giới
bb = [obj.matrix_world @ Vector(c) for c in obj.bound_box]
mn = [min(v[i] for v in bb) for i in range(3)]
mx = [max(v[i] for v in bb) for i in range(3)]

# preview 2 góc soi lỗi winding (bật backface culling)
prevs = []
try:
    scn.render.engine = 'BLENDER_WORKBENCH'
    scn.display.shading.color_type = 'MATERIAL'
    try: scn.display.shading.show_backface_culling = True
    except Exception: pass
    scn.render.resolution_x = 1100; scn.render.resolution_y = 720
    import os
    from mathutils import Vector
    for tag, loc, lens, tgt in (('prev34', (14, -17, 7.5), 38, (0, 0, 3)),
                                ('prevfront', (0, -20, 3.2), 44, (0, -1, 3))):
        cam_d = bpy.data.cameras.new('cam'); cam = bpy.data.objects.new('cam', cam_d)
        cam.location = loc
        d = Vector(tgt) - Vector(loc)
        cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
        cam.data.lens = lens
        scn.collection.objects.link(cam); scn.camera = cam
        scn.render.filepath = os.path.join(os.path.dirname(os.path.abspath(OUT)),
                                           f'{name}_{tag}.png')
        bpy.ops.render.render(write_still=True)
        prevs.append(scn.render.filepath)
        bpy.data.objects.remove(cam, do_unlink=True); bpy.data.cameras.remove(cam_d)
except Exception as e:
    prevs = [f'preview_error: {e}']

try:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_yup=True)
except TypeError:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB')

by_mat = {}
mat_bb = {}
vs = obj.data.vertices
for pp in obj.data.polygons:
    k = MLIST[pp.material_index].name
    n = len(pp.vertices)-2
    by_mat[k] = by_mat.get(k, 0) + n
    bb = mat_bb.setdefault(k, [[1e9]*3, [-1e9]*3])
    for vi in pp.vertices:
        w = vs[vi].co
        for a in range(3):
            bb[0][a] = min(bb[0][a], w[a]); bb[1][a] = max(bb[1][a], w[a])
mat_bb = {k: [[round(x, 2) for x in mn], [round(x, 2) for x in mx]]
          for k, (mn, mx) in mat_bb.items()}
print('HA_REPORT ' + json.dumps({
    'variant': VARIANT, 'out': OUT, 'tris_total': total, 'budget': TRI_BUDGET,
    'decimated': decimated, 'rows': ROWS, 'cols': COLS, 'slope_len': round(SLOPE_LEN, 3),
    'bbox': {'x': [round(mn[0], 3), round(mx[0], 3)], 'y': [round(mn[1], 3), round(mx[1], 3)],
             'z': [round(mn[2], 3), round(mx[2], 3)]},
    'dims': {'dx': round(mx[0]-mn[0], 3), 'dy': round(mx[1]-mn[1], 3), 'dz': round(mx[2]-mn[2], 3)},
    'target': {'a2': [11.0, 8.0, 8.0], 'a1': [11.0, 7.0, 4.6]}['a2' if VARIANT.startswith('a2') else 'a1'],
    'tris_by_mat': by_mat, 'mat_bb': mat_bb,
    'mats': [m.name for m in MLIST], 'preview': prevs,
}, ensure_ascii=False))
