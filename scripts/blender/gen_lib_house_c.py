# -*- coding: utf-8 -*-
# ============================================================================
#  NHÀ 2 GIAN NGHÈO VÁCH GỖ (lib_house_c) — DOCUMENT §2.3 GAME-AAA-MODEL-THANH-PHO
#  Biến thể: c2 = 2 TẦNG THẤP 7,2×6,0×6,4 m · c1 = 1 TẦNG 7,2×6,0×4,0 m.
#  Dựng thủ tục Blender 5.2 headless (bpy thuần), không texture ngoài — atlas
#  riêng không cần vì 12 vật liệu phẳng (màu ít), mét, gốc (0,0,0) đáy giữa nhà.
#  Trục Blender: X = bề ngang mặt tiền (−3,6..3,6), Y = sâu (TRƯỚC = −Y, sau = +Y),
#  Z = lên. Mặt tiền quay −Y → export glTF (+Yup) thành +Z.
#  LAW DIMS (không được lệch >5%): X 7,2 · Y 6,0 (mép mái ±3,0 · thềm tới −3,0)
#  · Z: c1 4,0 (eave 2,2 + dốc 30° đúng 1,732) · c2 6,4 (eave 4,6 + 1,732).
#  HOUSE_SPECS c2 {wd:1,2, f:[7,8,5], hd:0,89} · c1 {wd:1,2, f:[7,8,5], hd:0,56}
#  ⇒ wd = 7,2/6,0 · hd = đỉnh/rộng —dims này là nguồn của 2 số đó.
#  Đặc trưng nghèo: vách gỗ trát vôi nứt #F5F2E9 + mảng phai #EDEAE0 + ẩm
#  #C8B8A0 chân 0,5 + mảng vôi bong lộ ván; chân đá vụn; mái ngói VÁN GHÉP
#  (ván 0,15 × 48 hàng/sườn, Array thủ công, dốc 30°); cửa đơn 1,4×2,1 hai cánh;
#  gác lửng nhô 0,4 + cửa sập (c2); thềm đá 3 bậc tổng cao 0,45; KHÔNG biển
#  ngang — đèn dầu giấy nhỏ cạnh cửa. Ngân sách: c2 ≤65k · c1 ≤45k (nhóm 110k).
#  Chạy: blender -b --python scripts/blender/gen_lib_house_c.py -- --v c2 --out <f.glb>
# ============================================================================
import bpy, sys, math, json

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[argv.index('--out') + 1] if '--out' in argv else 'lib_house_c.glb'
V = argv[argv.index('--v') + 1] if '--v' in argv else 'c2'
assert V in ('c1', 'c2'), '--v phải là c1 hoặc c2'
TRI_BUDGET = 65000 if V == 'c2' else 45000

# ---------- cảnh trống, đơn vị mét ----------
bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene
scn.unit_settings.system = 'METRIC'
scn.unit_settings.scale_length = 1.0

# ---------- LUẬT KÍCH THƯỚC (m) ----------
SLOPE  = math.radians(30)          # dốc mái 30°
XW, HW = 7.2, 3.6                  # rộng 2 gian (2 × 3,6) — trục X
HBD    = 2.4                       # nửa sâu thân (thân 4,8)
EAVE_Y = 3.0                       # mép mái trước/sau → tổng sâu đúng 6,0
PLINTH = 0.45                      # nền + thềm 3 bậc × 0,15 = 0,45
TAN, COS = math.tan(SLOPE), math.cos(SLOPE)
if V == 'c1':                      # 1 tầng: thân tới 2,5, đỉnh đúng 4,0
    EAVE_Z, PLATE, MEZZ = 2.2, 2.5, None
    TOP = 4.0
else:                              # 2 tầng thấp: trệt 2,4 + lửng 1,75
    EAVE_Z, PLATE, MEZZ = 4.6, 4.6, 2.85
    TOP = 6.4
RIDGE = EAVE_Z + EAVE_Y * TAN      # 3,932 (c1) / 6,332 (c2)
RUN   = EAVE_Y / COS               # dài mái theo dốc 3,464
WALL_T = 0.10                      # vách gỗ mỏng (nhà nghèo)

# ---------- vật liệu Principled BSDF (12 màu ít, roughness cao kiểu phường cũ) ----------
def srgb_to_linear(c):
    c = min(max(c, 0.0), 1.0)
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def make_mat(name, hexcol, rough=0.9, metal=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    r = [srgb_to_linear(int(hexcol[i:i + 2], 16) / 255.0) for i in (0, 2, 4)]
    bsdf.inputs['Base Color'].default_value = (*r, 1.0)
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    return m

P = 'hc_' + V + '_'
M = {
    'lime':  make_mat(P + 'voi_nut',   'F5F2E9', rough=0.95),  # vôi trát nứt
    'fade':  make_mat(P + 'voi_phai',  'EDEAE0', rough=0.95),  # mảng phai
    'damp':  make_mat(P + 'am_chan',   'C8B8A0', rough=0.95),  # ẩm loang chân 0,5
    'crack': make_mat(P + 'nut_ro',    'B8AE98', rough=0.95),  # đáy vết nứt (không đen)
    'stone': make_mat(P + 'da_vun',    '8A8580', rough=0.95),  # chân đá vụn + thềm
    'wood':  make_mat(P + 'go_cu',     'C19A6B', rough=0.85),  # gỗ mật ong cũ
    'wood2': make_mat(P + 'go_xam',    'A98B62', rough=0.88),  # ván bạc màu
    'dark':  make_mat(P + 'go_am',     '7D5839', rough=0.80),  # cửa / ván ẩm
    'frame': make_mat(P + 'khung',     '664228', rough=0.80),  # khung tối nhất
    'paper': make_mat(P + 'giay',      'F2E8D5', rough=0.50),  # đèn dầu + ô giấy
    'jar':   make_mat(P + 'dat_nung',  'A44139', rough=0.70),  # vại đất nung
    'floor': make_mat(P + 'san',       'B08A5C', rough=0.85),  # sàn ván
}

# ---------- helper dựng hình (theo khuôn gen_tieu_quan) ----------
body_parts, roof_parts = [], []

def reg(obj, mat, bucket):
    obj.data.materials.append(mat)
    bucket.append(obj)

def box(name, sx, sy, sz, x, y, z, mat, bucket=body_parts, rx=0.0, ry=0.0, rz=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name
    o.scale = (sx, sy, sz)
    reg(o, mat, bucket)
    return o

def cyl(name, r, h, x, y, z, mat, seg=8, bucket=body_parts, rx=0.0, ry=0.0, rz=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r, depth=h,
                                        location=(x, y, z), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name
    reg(o, mat, bucket)
    return o

def prism_z(name, tri, x0, x1, mat, bucket=body_parts):
    """Lăng trụ tam giác mặt cắt (y,z) kéo dài theo X — tường núi (硬山)."""
    verts = [(x0, y, z) for y, z in tri] + [(x1, y, z) for y, z in tri]
    faces = [(0, 1, 2), (5, 4, 3), (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)]
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.validate(); me.update()
    o = bpy.data.objects.new(name, me)
    scn.collection.objects.link(o)
    reg(o, mat, bucket)
    return o

def jit(i, k=0):
    """jitter tất định (không random) — đá vụn / ván buckled giống nhau mỗi lần chạy."""
    v = math.sin(i * 127.1 + k * 311.7) * 43758.5453
    return v - math.floor(v)

# ============================================================================
#  CHÂN ĐÁ VỤN + NỀN + SÀN (plinth 0,45; đá nhô ≤ mép 7,2×4,8)
# ============================================================================
box('chan_dai', 7.16, 4.76, 0.42, 0, 0, 0.21, M['stone'])
nrow = 0
for face in ('f', 'b', 'l', 'r'):           # vòng đá vụn quanh nhà
    if face in ('f', 'b'):
        n = 19; sgn = -1 if face == 'f' else 1
        for i in range(n):
            w = 0.30 + 0.16 * jit(i, nrow)
            box(f'da_{face}_{i}', w, 0.10 + 0.06 * jit(i, 7), 0.14 + 0.10 * jit(i, 3),
                -3.42 + 6.84 * (i + 0.5) / n, sgn * (2.36 + 0.02 * jit(i, 5)),
                0.11 + 0.10 * jit(i, 9), M['stone'] if jit(i, 11) < 0.7 else M['dark'])
            nrow += 1
    else:
        n = 13; sgn = -1 if face == 'l' else 1
        for i in range(n):
            w = 0.26 + 0.14 * jit(i, nrow)
            box(f'da_{face}_{i}', 0.10 + 0.02 * jit(i, 2), w, 0.13 + 0.12 * jit(i, 4),
                sgn * (3.50 + 0.02 * jit(i, 6)), -2.20 + 4.40 * (i + 0.5) / n,
                0.10 + 0.14 * jit(i, 8), M['stone'])
            nrow += 1
box('san_trong', 6.9, 4.5, 0.06, 0, 0, PLINTH + 0.03, M['floor'])

# ============================================================================
#  KHUNG GỖ: 6 cột (±3,36 · 0 × trước/sau) + xà ngang + đòn dọc
# ============================================================================
COL_X = (-3.36, 0.0, 3.36)
COL_Y = (-HBD + 0.12, HBD - 0.12)
for i, cx in enumerate(COL_X):
    for j, cy in enumerate(COL_Y):
        h = PLATE - PLINTH
        cyl(f'cot_{i}_{j}', 0.095, h, cx, cy, PLINTH + h / 2, M['wood'] if i != 1 else M['wood2'], seg=8)
# xà ngang mặt trước/sau tại đỉnh cột + (c2) thêm xà gác
for j, cy in enumerate(COL_Y):
    box(f'xa_{j}', 6.9, 0.14, 0.16, 0, cy, PLATE - 0.08, M['frame'])
if MEZZ:
    for j, cy in enumerate(COL_Y):
        box(f'xa_gac_{j}', 6.9, 0.14, 0.16, 0, cy, MEZZ - 0.08, M['frame'])

# ============================================================================
#  VÁCH GỖ TRÁT VÔI (thân): tường trước chừa cửa 1,4×2,1 + cửa sổ, sau + 2 hông
#  cao tường: c1 tới PLATE 2,5 — c2 trệt tới MEZZ 2,85 (lầu = ván gỗ riêng)
# ============================================================================
WALL_TOP = MEZZ if MEZZ else PLATE
DR_X, DR_W = -1.8, 1.4                      # cửa đơn 1,4×2,1 hai cánh, gian trái
DR_Z0, DR_Z1 = PLINTH, PLINTH + 2.1
WN_X, WN_W, WN_H = 1.8, 1.0, 0.9            # cửa sổ gian phải
WN_Z0, WN_Z1 = PLINTH + 0.75, PLINTH + 1.65

def wall_h(name, x0, x1, z0, z1, y, mat, t=WALL_T, bucket=body_parts):
    box(name, x1 - x0, t, z1 - z0, (x0 + x1) / 2, y, (z0 + z1) / 2, mat, bucket=bucket)

YF, YB = -HBD, HBD                          # mặt trước (−Y) / sau (+Y)
# tường TRƯỚC: khoét cửa + cửa sổ
wall_h('ttruoc_trai', -HW, DR_X - DR_W / 2, PLINTH, WALL_TOP, YF, M['lime'])
wall_h('ttruoi_cua', DR_X - DR_W / 2, DR_X + DR_W / 2, DR_Z1, WALL_TOP, YF, M['lime'])
wall_h('ttruoc_giua', DR_X + DR_W / 2, WN_X - WN_W / 2, PLINTH, WALL_TOP, YF, M['lime'])
wall_h('ttruoc_duoi_so', WN_X - WN_W / 2, WN_X + WN_W / 2, PLINTH, WN_Z0, YF, M['lime'])
wall_h('ttruoc_tren_so', WN_X - WN_W / 2, WN_X + WN_W / 2, WN_Z1, WALL_TOP, YF, M['lime'])
wall_h('ttruoc_phai', WN_X + WN_W / 2, HW, PLINTH, WALL_TOP, YF, M['lime'])
# tường SAU + 2 hông (đặc, cửa sổ nhỏ hậu ghép nổi không khoét)
wall_h('tsau', -HW, HW, PLINTH, WALL_TOP, YB, M['lime'])
wall_h('thong_trai', -HW, -HW + WALL_T, PLINTH, WALL_TOP, 0, M['lime'])
wall_h('thong_phai', HW - WALL_T, HW, PLINTH, WALL_TOP, 0, M['lime'])

# ---------- phong hoá vôi nứt: ẩm chân 0,5 + mảng phai + vết nứt + vôi bong lộ ván ----------
box('am_f', 7.0, 0.016, 0.5, 0, YF - 0.058, PLINTH + 0.25, M['damp'])
box('am_l', 0.016, 4.6, 0.5, -HW + 0.058, 0, PLINTH + 0.25, M['damp'])
box('am_r', 0.016, 4.6, 0.5, HW - 0.058, 0, PLINTH + 0.25, M['damp'])
box('am_b', 7.0, 0.016, 0.5, 0, YB + 0.058, PLINTH + 0.25, M['damp'])
# mảng phai #EDEAE0 (3 mảng trước + 1 sau + 1 hông)
box('phai_f1', 1.5, 0.012, 0.75, -2.6, YF - 0.056, 1.55, M['fade'])
box('phai_f2', 0.9, 0.012, 0.55, 2.9, YF - 0.056, 1.15, M['fade'])
box('phai_b1', 2.4, 0.012, 0.9, 1.6, YB + 0.056, 1.5, M['fade'])
box('phai_l1', 0.012, 1.8, 0.8, -HW + 0.056, -1.0, 1.6, M['fade'])
# vết nứt mảnh (đáy đậm #B8AE98 — không dùng đường đen)
for i, (cx, cz, cl) in enumerate(((-2.95, 1.9, 0.85), (0.4, 2.3, 0.5), (3.2, 1.5, 0.7),
                                  (-1.05, 1.15, 0.6), (2.2, 2.42, 0.35))):
    box(f'nut_{i}', 0.022, 0.01, cl, cx, YF - 0.054, cz, M['crack'])
# vôi bong lộ ván gỗ (AAA: kể chuyện nghèo)
box('bong_voi_1', 0.62, 0.02, 0.4, -3.0, YF - 0.05, 1.35, M['wood2'])
box('bong_voi_2', 0.45, 0.02, 0.3, 2.55, YF - 0.05, 0.85, M['wood'])
box('bong_voi_3', 0.02, 0.5, 0.42, -HW + 0.05, 1.4, 1.7, M['wood2'])

# tường núi (tam giác giáp mái, 硬山 — không vươn hai đầu)
APEX = RIDGE - 0.07
prism_z('nui_trai', [(-HBD, PLATE - 0.02), (HBD, PLATE - 0.02), (0, APEX)], -HW, -HW + 0.1, M['lime'])
prism_z('nui_phai', [(-HBD, PLATE - 0.02), (HBD, PLATE - 0.02), (0, APEX)], HW - 0.1, HW, M['lime'])

# ============================================================================
#  CỬA ĐƠN 1,4×2,1 HAI CÁNH + TAY NẮM + KHUNG
# ============================================================================
DX = DR_X
box('cua_khung_trai', 0.14, 0.14, 2.24, DX - 0.77, YF + 0.02, PLINTH + 1.12, M['frame'])
box('cua_khung_phai', 0.14, 0.14, 2.24, DX + 0.77, YF + 0.02, PLINTH + 1.12, M['frame'])
box('cua_khung_tren', 1.68, 0.14, 0.14, DX, YF + 0.02, DR_Z1 + 0.07, M['frame'])
for s in (-1, 1):                            # 2 cánh × (3 ván dọc + 2 đỉnh ngang)
    lx = DX + s * 0.175
    for b in range(3):
        box(f'cua_{s:+d}_van{b}', 0.09, 0.05, 1.94, lx - 0.17 + 0.17 * b, YF + 0.02,
            PLINTH + 1.03, M['dark'] if b == 1 else M['wood2'])
    for lz in (PLINTH + 0.45, PLINTH + 1.6):
        box(f'cua_{s:+d}_dinh{int(lz)}', 0.52, 0.06, 0.12, lx, YF + 0.05, lz, M['frame'])
    cyl(f'cua_{s:+d}_nut', 0.035, 0.012, DX + s * 0.3, YF - 0.04, PLINTH + 1.02,
        M['frame'], seg=8, rx=math.pi / 2)

# cửa sổ gian phải: song gỗ + ô giấy + bệ
box('so_khung_tren', 1.16, 0.1, 0.1, WN_X, YF + 0.02, WN_Z1 + 0.05, M['frame'])
box('so_khung_duoi', 1.16, 0.12, 0.12, WN_X, YF + 0.02, WN_Z0 - 0.06, M['frame'])
for s in (-1, 1):
    box(f'so_cot_{s:+d}', 0.1, 0.1, WN_H + 0.2, WN_X + s * (WN_W / 2 + 0.05), YF + 0.02,
        (WN_Z0 + WN_Z1) / 2, M['frame'])
box('so_giay', 0.96, 0.02, 0.8, WN_X, YF + 0.03, (WN_Z0 + WN_Z1) / 2, M['paper'])
for b in range(4):
    box(f'so_song{b}', 0.05, 0.05, WN_H, WN_X - 0.36 + 0.24 * b, YF - 0.01,
        (WN_Z0 + WN_Z1) / 2, M['frame'])
# cửa sổ nhỏ hậu (trệt) — song gỗ
box('so_h', 0.8, 0.02, 0.6, 0.9, YB + 0.06, PLATE - 0.55, M['paper'])
for b in range(3):
    box(f'so_h_song{b}', 0.05, 0.06, 0.6, 0.66 + 0.24 * b, YB + 0.09, PLATE - 0.55, M['frame'])

# ============================================================================
#  THỀM ĐÁ 3 BẬC (tread 0,2 × rise 0,15 — tổng đúng 0,45, hết đúng y=−3,0)
# ============================================================================
for i in range(3):
    box(f'them_{i}', 1.7, 0.2, 0.15 * (i + 1), DX, -2.5 - 0.2 * i, 0.15 * (i + 1) / 2,
        M['stone'])

# ============================================================================
#  ĐÈN DẦU GIẤY NHỎ cạnh cửa (KHÔNG biển ngang; không emissive — code gán glow)
# ============================================================================
box('den_tay', 0.05, 0.34, 0.05, DX + 0.95, YF - 0.2, PLINTH + 1.95, M['frame'])
cyl('den_lo_dai', 0.02, 0.12, DX + 0.95, YF - 0.28, PLINTH + 1.98, M['frame'], seg=6, rx=math.pi / 2)
cyl('den_lo_tron', 0.055, 0.02, DX + 0.95, YF - 0.34, PLINTH + 1.9, M['frame'], seg=8)
cyl('den_giay', 0.075, 0.17, DX + 0.95, YF - 0.34, PLINTH + 1.8, M['paper'], seg=8)
cyl('den_day', 0.05, 0.03, DX + 0.95, YF - 0.34, PLINTH + 1.7, M['frame'], seg=8)

# ============================================================================
#  ĐẠO CỤ NGHÈO: vại nước góc + củi xếp (+ c2 xếp dưới gác)
# ============================================================================
cyl('vai', 0.21, 0.52, 3.05, -2.55, PLINTH + 0.26, M['jar'], seg=10)
for i in range(4):
    cyl(f'cui_{i}', 0.055, 0.5 + 0.2 * jit(i, 1), 2.6 + 0.14 * i, -2.45 - 0.04 * i,
        0.055, M['wood'] if i % 2 else M['wood2'], seg=6, ry=math.pi / 2)
# giường ván trong (thấy qua cửa) + chăn vôi
box('giuong', 1.9, 0.85, 0.32, 2.2, 1.6, PLINTH + 0.16, M['wood2'])
box('chan', 1.75, 0.7, 0.09, 2.2, 1.6, PLINTH + 0.37, M['lime'])

# ============================================================================
#  C2 — TẦNG LẬU THẤP: ván gỗ đứng + gác lửng nhô 0,4 + CỬA SẬP + thang
# ============================================================================
if MEZZ:
    UP0, UP1 = MEZZ, PLATE - 0.06             # ván lầu 2,85 → 4,54
    # mặt tiền lầu: 44 ván 0,15 — chừa cửa sổ (x −2,3..−1,3)
    UWX0, UWX1, UWZ0, UWZ1 = -2.3, -1.3, MEZZ + 0.5, MEZZ + 1.35
    npl = int(6.9 / 0.15)
    for i in range(npl):
        cx = -3.45 + 0.15 * (i + 0.5)
        if UWX0 - 0.14 < cx < UWX1 + 0.14:
            continue
        mat = M['wood'] if i % 5 else (M['wood2'] if i % 3 else M['dark'])
        rz = 0.02 * (jit(i, 21) - 0.5)         # ván xoay nhẹ — vách nghèo không phẳng
        box(f'lau_van_{i}', 0.145, 0.05, UP1 - UP0, cx, YF - 0.03, (UP0 + UP1) / 2,
            mat, rz=rz)
    # khung + ô giấy cửa sổ lầu
    box('lau_so_tren', 1.12, 0.1, 0.1, (UWX0 + UWX1) / 2, YF, UWZ1 + 0.05, M['frame'])
    box('lau_so_duoi', 1.12, 0.12, 0.12, (UWX0 + UWX1) / 2, YF, UWZ0 - 0.06, M['frame'])
    for s in (-1, 1):
        box(f'lau_so_cot_{s:+d}', 0.1, 0.1, UWZ1 - UWZ0, (UWX0 + UWX1) / 2 + s * 0.56,
            YF, (UWZ0 + UWZ1) / 2, M['frame'])
    box('lau_so_giay', 0.98, 0.02, UWZ1 - UWZ0 - 0.1, (UWX0 + UWX1) / 2, YF + 0.02,
        (UWZ0 + UWZ1) / 2, M['paper'])
    # hông lầu: ván đứng theo trục Y
    nsd = int(4.5 / 0.15)
    for sgn in (-1, 1):
        for i in range(nsd):
            cy = -2.25 + 0.15 * (i + 0.5)
            box(f'lau_hong_{sgn:+d}_{i}', 0.05, 0.145, UP1 - UP0, sgn * (HW - 0.045),
                cy, (UP0 + UP1) / 2, M['wood'] if (i + (sgn > 0)) % 4 else M['wood2'])
    # tường sau lầu: vôi + cửa sổ giấy
    wall_h('tsau_lau', -HW, HW, MEZZ, PLATE, YB, M['lime'])
    box('so_lau_b', 0.9, 0.02, 0.7, -1.4, YB + 0.06, MEZZ + 0.95, M['paper'])
    for b in range(3):
        box(f'so_lau_b_song{b}', 0.05, 0.06, 0.7, -1.62 + 0.22 * b, YB + 0.09,
            MEZZ + 0.95, M['frame'])
    # GÁC LỬNG NHÔ 0,4: ván sàn từ y −2,4 → −2,8 + thành chắn + CỬA SẬP hé
    # (mọi thứ giữ trong |y| ≤ 3,0 — mép sàn −2,81, lan can −2,87, thang chân −3,0)
    nfp = int(6.9 / 0.15)
    for i in range(nfp):
        cx = -3.45 + 0.15 * (i + 0.5)
        if -1.5 < cx < -0.65:                  # chừa lỗ cửa sập 0,85
            continue
        box(f'gac_van_{i}', 0.145, 0.42, 0.06, cx, YF - 0.2, MEZZ - 0.03,
            M['floor'] if i % 3 else M['wood2'])
    # dầm biên gác + xà con
    box('gac_dam', 6.9, 0.1, 0.12, 0, YF - 0.36, MEZZ - 0.11, M['frame'])
    # thành chắn gác: 7 trụ + thanh ngang trên mép sàn
    for i in range(7):
        box(f'gac_tran_{i}', 0.06, 0.06, 0.62, -3.3 + 1.1 * i, YF - 0.44, MEZZ + 0.28,
            M['wood2'])
    box('gac_thanh', 7.0, 0.07, 0.06, 0, YF - 0.44, MEZZ + 0.6, M['frame'])
    # CỬA SẬP: nắp hé ~55° + que chống
    box('gac_sap_nap', 0.8, 0.6, 0.04, -1.07, YF - 0.28, MEZZ + 0.22, M['dark'],
        rx=-0.96)
    cyl('gac_sap_que', 0.02, 0.62, -1.35, YF - 0.42, MEZZ + 0.26, M['frame'], seg=6,
        rx=0.5)
    # thang gỗ lên gác: chân đất y=−3,0 → miệng sập y=−2,78, nghiêng 4,7°
    for s in (-1, 1):
        box(f'thang_long_{s:+d}', 0.06, 0.06, 2.66, -1.07 + s * 0.22, -2.89,
            1.425, M['wood'], rx=-0.083)
    for i in range(5):
        t = 0.15 + 0.17 * i
        box(f'thang_bac_{i}', 0.42, 0.055, 0.055, -1.07, -3.0 + 0.22 * t,
            0.1 + 2.65 * t, M['wood2'])

# ============================================================================
#  MÁI NGÓI VÁN GHÉP — ván 0,15 × 48 hàng/sườn, dốc 30°, bạt gió, bờ nóc ván
# ============================================================================
CY, CZ = EAVE_Y / 2.0, (EAVE_Z + RIDGE) / 2.0
def slope_box(name, sx, sl, th, x, y, z, mat, sign, bucket=roof_parts, dz=0.0, rx2=0.0):
    n = (0.0, -sign * math.sin(SLOPE), math.cos(SLOPE))   # pháp tuyến ra ngoài mái
    box(name, sx, sl, th, x, y + n[1] * dz, z + n[2] * dz, mat, bucket=bucket,
        rx=-sign * (SLOPE + rx2))

for sign, tag in ((-1, 'tr'), (1, 'sau')):
    # ván lót dưới (soffit thô) + đòn tay mỗi 0,4
    slope_box(f'mai_{tag}_lot', XW, RUN - 0.1, 0.05, 0, sign * CY, CZ - 0.045, M['frame'], sign, dz=0.02)
    nraf = int((XW - 0.4) / 0.4)
    for j in range(nraf + 1):
        slope_box(f'don_{tag}_{j}', 0.08, RUN - 0.15, 0.09, -3.4 + 0.4 * j,
                  sign * CY, CZ, M['frame'], sign, dz=0.06)
    # 48 ván ngói 0,15 — bạc màu so le, mảng ẩm, 2 ván buckled mỗi sườn
    npl = int(XW / 0.15)
    for i in range(npl):
        xr = -HW + 0.15 * (i + 0.5)
        r = jit(i, 31 + (sign < 0))
        mat = M['dark'] if r < 0.14 else (M['wood2'] if r < 0.45 else M['wood'])
        dz, rx2 = 0.055, 0.0
        if i in (9, 31, 40):                   # ván bong lên (nhà nghèo ít tu bổ)
            dz, rx2 = 0.085, 0.05
        slope_box(f'ngoi_{tag}_{i}', 0.145, RUN, 0.045, xr, sign * CY, CZ,
                  mat, sign, dz=dz, rx2=rx2)
    # ván bạt gió hai đầu núi (博风) — dày 0,14, ngắn bớt mép nóc để không vượt đỉnh
    for sgn in (-1, 1):
        slope_box(f'batgio_{tag}_{sgn:+d}', 0.06, RUN - 0.2, 0.14,
                  sgn * (HW - 0.03), sign * CY, CZ, M['frame'], sign, dz=0.055)
# đòn nóc + bờ nóc ván ghép (đỉnh đúng TOP)
cyl('don_noc', 0.075, XW - 0.1, 0, 0, RIDGE - 0.1, M['frame'], seg=8,
    bucket=roof_parts, ry=math.pi / 2)
ncap = int((XW - 0.2) / 0.33)
for i in range(ncap):
    xr = -HW + 0.1 + 0.33 * (i + 0.5)
    box(f'noc_van_{i}', 0.3, 0.34, 0.09, xr, jit(i, 41) * 0.015,
        TOP - 0.045, M['frame'] if i % 2 else M['dark'], bucket=roof_parts,
        rz=0.012 * (jit(i, 43) - 0.5))

# ============================================================================
#  GỘP 2 MESH (thân/mái), PHÁP TUYẾN, WELD, GIẢM NẾU VƯỢT NGÂN SÁCH, EXPORT
# ============================================================================
def join_parts(parts, name):
    for o in parts:
        bpy.ops.object.select_all(action='DESELECT')
        o.select_set(True); bpy.context.view_layer.objects.active = o
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts: o.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    obj = bpy.context.active_object
    obj.name = name; obj.data.name = name
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode='OBJECT')
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True); bpy.context.view_layer.objects.active = obj
    mod = obj.modifiers.new('weld_clean', 'WELD'); mod.merge_threshold = 0.0005
    bpy.ops.object.modifier_apply(modifier='weld_clean')
    return obj

def tri_count(obj):
    return sum(len(p.vertices) - 2 for p in obj.data.polygons)

body = join_parts(body_parts, f'hc_{V}_body')
roof = join_parts(roof_parts, f'hc_{V}_roof')
tb, tr = tri_count(body), tri_count(roof)
total = tb + tr
if total > TRI_BUDGET:
    ratio = max(0.05, 0.94 * TRI_BUDGET / total)
    for obj in (body, roof):
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True); bpy.context.view_layer.objects.active = obj
        dm = obj.modifiers.new('decimate_budget', 'DECIMATE')
        dm.ratio = ratio; dm.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier='decimate_budget')
    tb, tr = tri_count(body), tri_count(roof)
    total = tb + tr

try:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_yup=True)
except TypeError:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB')

print('HC_REPORT ' + json.dumps({
    'out': OUT, 'variant': V, 'tris_body': tb, 'tris_roof': tr, 'tris_total': total,
    'budget': TRI_BUDGET,
    'dims_x_y_z_law': [7.2, 6.0, 6.4 if V == 'c2' else 4.0],
    'bbox_x': 7.2, 'bbox_y': 6.0, 'bbox_z_top': round(TOP, 2),
    'mats': sorted(m.name for m in bpy.data.materials),
}, ensure_ascii=False))
