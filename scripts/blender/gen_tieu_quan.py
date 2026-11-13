# -*- coding: utf-8 -*-
# ============================================================================
#  TIỂU QUÁN 3 gian — nhà ở Minh–Thanh (không dougong, không ngói lưu li)
#  Dựng thủ tục Blender 5.2 headless (bpy), không texture ngoài, đơn vị mét.
#  Trục Blender: X = bề ngang mặt tiền (−6.4..6.4), Y = chiều sâu (trước = −3.75,
#    sau = +3.75), Z = lên. Mặt tiền quay −Y → export glTF (+Yup) thành +Z.
#  Gốc 2 lưới tại (0,0,0) — đáy đất, giữa nhà.
#  Luật bày: 3 gian 4,2 + 4,4 + 4,2 m; sâu 7,5 m (5架 — 5 đòn tay trên mái);
#    6 cột hiên đỏ Ø0,3×3,2 m; tường whitewash #b8b2a6, mặt trước mở hết
#    (3 bộ cửa lattice gỗ mờ); mái dốc 30° hai lớp ngói xám #6b6560 +
#    bờ nóc con triện, vươn mép 0,64 m.
#  Biến thể ỨN SĨ THẢO LƯ (game đổi vật liệu lúc đặt — xem NOTES cuối file):
#    mái→tranh #a98d54, khung gỗ lộ→#7d5f43, tường→tre đan, sàn gỗ hiên 1,2 m sẵn.
#  2 mesh: tieu_quan_body (thân) / tieu_quan_roof (mái) — BẢN GIỮA ≤ 18000 tam giác.
#  Chạy: blender -b --python scripts/blender/gen_tieu_quan.py -- --out <file.glb>
# ============================================================================
import bpy, sys, math, json

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[argv.index('--out') + 1] if '--out' in argv else 'tieu_quan.glb'
TRI_BUDGET = 18000

# ---------- dựng cảnh trống, đơn vị mét ----------
bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene
scn.unit_settings.system = 'METRIC'
scn.unit_settings.scale_length = 1.0

# ---------- thông số kiến trúc ----------
BAYS   = [4.2, 4.4, 4.2]          # 3 gian mặt tiền (m)
XW     = sum(BAYS)                # 12,8 m
DEPTH  = 7.5                      # sâu 5架
HW, HD = XW / 2, DEPTH / 2        # 6,4 / 3,75
WALL_T = 0.24                     # dày tường
EAVE_H = 3.2                      # đường đòn hiên / đỉnh cột (m)
PLATE_Z = 3.4                     # đỉnh tường
OV     = 0.64                     # vươn mép mái
SLOPE  = math.radians(30)         # dốc 30°
Y_EAVE = HD + OV                  # 4,39
Z_RIDGE = EAVE_H + 0.1 + Y_EAVE * math.tan(SLOPE)   # ≈ 5,834
RUN_L  = Y_EAVE / math.cos(SLOPE) # dài mái theo dốc ≈ 5,07
COL_R, COL_H = 0.15, 3.2          # cột hiên Ø0,3 × 3,2 m
GAP_X  = [-HW + BAYS[0] / 2, 0.0, HW - BAYS[2] / 2]  # tâm 3 gian: −4,3 · 0 · +4,3
COL_X  = [-6.15, -4.2, -2.2, 2.2, 4.2, 6.15]         # 6 cột hiên (4 mốc gian + 2 giữa gian bên)
DECK_D = 1.2                      # sàn gỗ nhô hiên 1,2 m (biến thể thảo lư nhìn vách đá)
COL_Y  = -HD - DECK_D + 0.35      # cột hiên trên mép trong sàn gỗ (≈ −4,6)

# ---------- vật liệu Principled BSDF (không texture ngoài) ----------
def srgb_to_linear(c):
    c = min(max(c, 0.0), 1.0)
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def make_mat(name, hexcol, rough=0.8, metal=0.0, alpha=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    r = [srgb_to_linear(int(hexcol[i:i + 2], 16) / 255.0) for i in (0, 2, 4)]
    bsdf.inputs['Base Color'].default_value = (*r, 1.0)
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    if alpha < 1.0:
        bsdf.inputs['Alpha'].default_value = alpha
        for attr, val in (('blend_method', 'BLEND'), ('surface_render_method', 'BLENDED')):
            try: setattr(m, attr, val)
            except Exception: pass
    return m

M = {
    'wall':  make_mat('tq_wall_whitewash', 'b8b2a6', rough=0.92),   # tường whitewash (biến thể: tre đan)
    'tile':  make_mat('tq_roof_tile',      '6b6560', rough=0.85),   # ngói xám (biến thể: tranh #a98d54)
    'tile2': make_mat('tq_roof_tile_dark', '5a5550', rough=0.9),    # lớp ngói dưới
    'red':   make_mat('tq_wood_red',       '9d3a2b', rough=0.62),   # cột hiên đỏ (biến thể: gỗ lộ #7d5f43)
    'timber':make_mat('tq_timber_dark',    '57422f', rough=0.72),   # khung gỗ lộ (biến thể: #7d5f43)
    'door':  make_mat('tq_door_wood',      '6b4726', rough=0.7),    # cánh cửa gỗ đặc
    'latt':  make_mat('tq_lattice_mo',     '7a5433', rough=0.7, alpha=0.55),  # lattice gỗ mờ
    'deck':  make_mat('tq_floor_wood',     '7c5c3a', rough=0.8),    # sàn gỗ hiên 1,2 m
    'stone': make_mat('tq_stone',          '7d766c', rough=0.95),   # nền trong, thẹp đá, bậc
    'jar':   make_mat('tq_jar',            '5f4433', rough=0.55),   # vạc rượu
    'flag':  make_mat('tq_banner_red',     'a83226', rough=0.8),    # cờ rượu
    'sign':  make_mat('tq_sign_lacquer',   '2f261e', rough=0.5),    # biển quán
}

# ---------- helper dựng hình ----------
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

def cyl(name, r, h, x, y, z, mat, seg=14, bucket=body_parts, rx=0.0, ry=0.0, rz=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r, depth=h,
                                        location=(x, y, z), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name
    reg(o, mat, bucket)
    return o

def prism_z(name, tri, x0, x1, mat, bucket=body_parts):
    """Lăng trụ tam giác theo mặt cắt (y,z) — tường giáp mái (núi 硬山)."""
    verts = [(x0, y, z) for y, z in tri] + [(x1, y, z) for y, z in tri]
    faces = [(0, 1, 2), (5, 4, 3), (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)]
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.validate(); me.update()
    o = bpy.data.objects.new(name, me)
    scn.collection.objects.link(o)
    reg(o, mat, bucket)
    return o

# ============================================================================
#  MESH 1 — THÂN (tieu_quan_body)
# ============================================================================
# nền trong + thẹp đá chu vi
box('nen_trong', XW - 0.3, DEPTH - 0.3, 0.36, 0, 0, 0.18, M['stone'])
box('thep_duoi_sau', XW + 0.2, 0.42, 0.42, 0, HD, 0.21, M['stone'])
box('thep_duoi_trai', 0.42, DEPTH + 0.3, 0.42, -HW, 0, 0.21, M['stone'])
box('thep_duoi_phai', 0.42, DEPTH + 0.3, 0.42, +HW, 0, 0.21, M['stone'])
# sàn gỗ nhô hiên 1,2 m (biến thể thảo lư dùng sẵn — nhìn ra vách đá)
box('san_hien', XW + 0.2, DECK_D + 0.1, 0.34, 0, -HD - DECK_D / 2, 0.17, M['deck'])
box('bac_1', 3.0, 0.42, 0.2, 0, -HD - DECK_D + 0.05, 0.1, M['stone'])
box('bac_2', 3.0, 0.42, 0.34, 0, -HD - DECK_D + 0.05, 0.17, M['stone'])

# tường sau + tường hai bên (whitewash), mặt trước mở hết
WH = PLATE_Z - 0.36
box('tuong_sau', XW, WALL_T, WH, 0, HD - WALL_T / 2, 0.36 + WH / 2, M['wall'])
box('tuong_trai', WALL_T, DEPTH, WH, -HW + WALL_T / 2, 0, 0.36 + WH / 2, M['wall'])
box('tuong_phai', WALL_T, DEPTH, WH, +HW - WALL_T / 2, 0, 0.36 + WH / 2, M['wall'])
# núi mái (tường tam giác giáp mái — mái cứng 硬山, không vươn hai đầu ngang)
GAP_APEX = Z_RIDGE - 0.09
prism_z('nui_trai',  [(-HD, PLATE_Z - 0.05), (HD, PLATE_Z - 0.05), (0, GAP_APEX)],
        -HW - 0.005, -HW + WALL_T, M['wall'])
prism_z('nui_phai',  [(-HD, PLATE_Z - 0.05), (HD, PLATE_Z - 0.05), (0, GAP_APEX)],
        +HW - WALL_T, +HW + 0.005, M['wall'])

# khung gỗ lộ góc + đòn dọc
for i, sx in enumerate((-HW + 0.14, +HW - 0.14)):
    box(f'cotgoc_truoc_{i}', 0.2, 0.2, PLATE_Z - 0.36, sx, -HD + 0.15, 0.36 + (PLATE_Z - 0.36) / 2, M['timber'])
    box(f'cotgoc_sau_{i}',   0.2, 0.2, PLATE_Z - 0.36, sx, +HD - 0.15, 0.36 + (PLATE_Z - 0.36) / 2, M['timber'])
box('dondoc_truoc', XW - 0.1, 0.26, 0.3, 0, -HD + 0.16, PLATE_Z - 0.13, M['timber'])
box('dondoc_sau',   XW - 0.1, 0.26, 0.3, 0, +HD - 0.16, PLATE_Z - 0.13, M['timber'])

# cửa sổ lattice sau (2 cửa — nhô ra mặt ngoài để thấy, không cần khoét tường)
for k, wx in enumerate((-3.2, 3.2)):
    fz = 2.15
    box(f'cuaso_{k}_khung', 1.24, 0.12, 1.04, wx, HD - 0.03, fz, M['timber'])
    for j in range(3):
        box(f'cuaso_{k}_songv{j}', 1.04, 0.05, 0.05, wx, HD + 0.02, fz - 0.32 + 0.32 * j, M['latt'])
        box(f'cuaso_{k}_songh{j}', 0.05, 0.05, 0.84, wx - 0.34 + 0.34 * j, HD + 0.02, fz, M['latt'])

# 3 bộ cửa lattice gỗ mờ (bản gỗ đặc dưới + song mờ trên) — một bộ mỗi gian
for bi, bx in enumerate(GAP_X):
    w = BAYS[bi] - 0.34
    dy = -HD + 0.12
    box(f'cua{bi}_cottrai',  0.14, 0.1, 2.86, bx - w / 2, dy, 0.36 + 1.43, M['timber'])
    box(f'cua{bi}_cotphai', 0.14, 0.1, 2.86, bx + w / 2, dy, 0.36 + 1.43, M['timber'])
    box(f'cua{bi}_chan',     w - 0.24, 0.06, 1.02, bx, dy, 0.36 + 0.51, M['door'])
    box(f'cua{bi}_thanhtren', w, 0.1, 0.16, bx, dy, 3.3 - 0.08, M['timber'])
    nbar = max(6, int(w / 0.36))
    for j in range(1, nbar):
        xj = bx - w / 2 + w * j / nbar
        box(f'cua{bi}_songv{j}', 0.055, 0.055, 1.62, xj, dy, 1.9, M['latt'])
    for j, zr in enumerate((1.32, 1.9, 2.48)):
        box(f'cua{bi}_songh{j}', w - 0.1, 0.055, 0.09, bx, dy, zr, M['latt'])

# 6 cột hiên đỏ Ø0,3 × 3,2 m trên sàn gỗ + đế đá + xà ngang + đòn nối
for i, cx in enumerate(COL_X):
    cyl(f'cot_hien_{i}', COL_R, 2.82, cx, COL_Y, 0.36 + 0.18 + 2.82 / 2, M['red'], seg=16)
    box(f'de_cot_{i}', 0.46, 0.46, 0.18, cx, COL_Y, 0.36 + 0.09, M['stone'])
box('xa_hien', XW + 0.3, 0.22, 0.26, 0, COL_Y, 3.36 - 0.13, M['timber'])
box('dono_hien', XW + 0.3, DECK_D, 0.2, 0, (COL_Y - HD) / 2, 3.24, M['red'])

# nội thất quán: quầy rượu + vạc + kệ, 2 bàn ghế
box('quay', 3.4, 0.72, 0.95, -2.5, HD - 0.62, 0.36 + 0.475, M['timber'])
box('quay_top', 3.6, 0.84, 0.07, -2.5, HD - 0.62, 0.36 + 0.985, M['door'])
for j in range(4):
    cyl(f'vac_{j}', 0.15, 0.42, -3.6 + 0.75 * j, HD - 0.62, 1.48, M['jar'], seg=10)
box('ke_ruou', 4.2, 0.28, 0.07, -2.5, HD - 0.22, 2.2, M['timber'])
for j in range(3):
    cyl(f'vacnho_{j}', 0.11, 0.3, -3.8 + 0.8 * j, HD - 0.22, 2.39, M['jar'], seg=10)
for ti, (tx, ty) in enumerate(((-2.4, -0.9), (2.7, -0.4))):
    box(f'ban{ti}_top', 1.22, 1.22, 0.08, tx, ty, 0.36 + 0.69, M['timber'])
    for li in range(4):
        lx, ly = tx + (-1 + 2 * (li % 2)) * 0.48, ty + (-1 + 2 * (li // 2)) * 0.48
        box(f'ban{ti}_chan{li}', 0.09, 0.09, 0.65, lx, ly, 0.36 + 0.325, M['timber'])
    for si in range(2):
        box(f'ghe{ti}_{si}', 0.42, 0.42, 0.5, tx - 0.85 + 1.7 * si, ty + 0.85, 0.36 + 0.25, M['door'])

# biển hiệu treo dưới mái hiên + cờ rượu góc phải
box('bien_quan', 1.05, 0.06, 0.72, 0, -HD - 0.72, 2.72, M['sign'])
box('bien_vien', 1.15, 0.05, 0.82, 0, -HD - 0.72, 2.72, M['flag'])
for j in (-0.44, 0.44):
    box(f'moc_bien_{j:+.2f}', 0.03, 0.03, 0.3, j, -HD - 0.72, 3.22, M['timber'])
cyl('co_cot', 0.045, 2.9, HW + 0.05, -HD - 0.95, 0.36 + 1.45, M['timber'], seg=8)
cyl('co_ho_tay', 0.04, 1.5, HW + 0.05, -HD - 0.95, 3.05, M['timber'], seg=8, rx=math.pi / 2)
box('co_ruou', 0.6, 0.045, 1.15, HW + 0.05, -HD - 1.4, 2.42, M['flag'])

# ============================================================================
#  MESH 2 — MÁI (tieu_quan_roof): 2 lớp ngói 30°, sống ngói, bờ nóc con triện
# ============================================================================
CY = Y_EAVE / 2.0                                   # 2,195 — tâm dải mái theo phương ngang
CZ = (EAVE_H + 0.1 + Z_RIDGE) / 2.0                 # tâm theo độ cao

def slope_obj(name, sx, sl, th, x, y, z, mat, sign, bucket=roof_parts, extra_th=0.0):
    """Khối nằm trên mặt phẳng mái; sign=−1 mái TRƯỚC, +1 mái SAU.
    Trục dài local Y phải chạy HƯỚNG LÊN ĐỈNH: trước (−Y→nóc) cần rx=+30°, sau cần rx=−30°."""
    n = (0.0, sign * math.sin(SLOPE), math.cos(SLOPE))   # pháp tuyến hướng ra ngoài
    box(name, sx, sl, th, x, y + n[1] * extra_th, z + n[2] * extra_th, mat,
        bucket=bucket, rx=-sign * SLOPE)

for sign, tag in ((-1, 'truoc'), (1, 'sau')):
    # lớp 1: ngói bản dưới
    slope_obj(f'mai_{tag}_lop1', XW, RUN_L - 0.25, 0.06, 0, sign * CY, CZ - 0.05,
              M['tile2'], sign, extra_th=0.02)
    # lớp 2: ngói chính + sống ngói (筒瓦 chạy dốc — biến thể thành sợi tranh dọc)
    slope_obj(f'mai_{tag}_lop2', XW, RUN_L, 0.10, 0, sign * CY, CZ, M['tile'], sign, extra_th=0.09)
    nrib = int(XW / 0.42)
    for j in range(1, nrib):
        xr = -HW + XW * j / nrib
        slope_obj(f'songngoi_{tag}_{j}', 0.13, RUN_L - 0.3, 0.075, xr, sign * CY, CZ,
                  M['tile'], sign, extra_th=0.17)
    # ván máng xối mép mái + đầu dòn nhô (rafter tails) dưới mái
    box(f'mangxoi_{tag}', XW, 0.2, 0.26, 0, sign * Y_EAVE, EAVE_H + 0.04,
        M['timber'], bucket=roof_parts, rx=-sign * SLOPE)
    nraf = int((XW - 0.8) / 0.55)
    for j in range(nraf + 1):
        xr = -HW + 0.4 + (XW - 0.8) * j / nraf
        box(f'donmai_{tag}_{j}', 0.09, 0.5, 0.1, xr, sign * (Y_EAVE - 0.12), EAVE_H - 0.05,
            M['timber'], bucket=roof_parts, rx=-sign * SLOPE)
    # ván bạt gió hai đầu núi (博风)
    slope_obj(f'batgio_{tag}_L', 0.15, RUN_L + 0.22, 0.3, -HW - 0.09, sign * CY, CZ,
              M['timber'], sign, extra_th=0.04)
    slope_obj(f'batgio_{tag}_R', 0.15, RUN_L + 0.22, 0.3, +HW + 0.09, sign * CY, CZ,
              M['timber'], sign, extra_th=0.04)
# 5 đòn tay (5架) lộ dưới mái
for j, (py, pz) in enumerate(((0.0, Z_RIDGE - 0.22), (-1.875, 4.66), (1.875, 4.66),
                              (-3.6, 3.58), (3.6, 3.58))):
    cyl(f'don_tay_{j}', 0.085, XW - 0.2, 0, py, pz, M['timber'], seg=8,
        bucket=roof_parts, ry=math.pi / 2)
# bờ nóc + con triện hai đầu (bản ngẩng lên)
box('bo_noc', XW + 0.3, 0.34, 0.26, 0, 0, Z_RIDGE + 0.11, M['tile'], bucket=roof_parts)
for sx in (-1, 1):
    box(f'trien_{sx:+d}_bien', 0.55, 0.42, 0.07, sx * (HW + 0.02), 0, Z_RIDGE + 0.26,
        M['tile2'], bucket=roof_parts, ry=sx * math.radians(12))
    box(f'trien_{sx:+d}_dau', 0.2, 0.3, 0.2, sx * (HW + 0.14), 0, Z_RIDGE + 0.34,
        M['tile2'], bucket=roof_parts)

# ============================================================================
#  GỘP → 2 MESH, SỬA PHÁP TUYẾN, WELD, GIẢM NẾU VƯỢT NGÂN SÁCH, EXPORT GLB
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

body = join_parts(body_parts, 'tieu_quan_body')
roof = join_parts(roof_parts, 'tieu_quan_roof')
tb, tr = tri_count(body), tri_count(roof)
total = tb + tr
# khống chế ngân sách tam giác bằng Decimate (chỉ kích hoạt khi vượt)
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

print('TIEU_QUAN ' + json.dumps({
    'out': OUT, 'tris_body': tb, 'tris_roof': tr, 'tris_total': total,
    'budget': TRI_BUDGET,
    'bbox_x': round(XW + 0.3, 2), 'bbox_y': round(DEPTH + OV + DECK_D + 0.45, 2),
    'bbox_z': round(Z_RIDGE + 0.44, 2),
    'mats': sorted(m.name for m in bpy.data.materials),
}, ensure_ascii=False))

# NOTES — biến thể ỨN SĨ THẢO LƯ (game đổi vật liệu lúc đặt, KHÔNG cần file riêng):
#   tq_roof_tile + tq_roof_tile_dark → tranh #a98d54 (sống ngói chạy dốc = sợi dọc)
#   tq_wood_red + tq_timber_dark     → khung gỗ lộ #7d5f43
#   tq_wall_whitewash                → tường tre đan
#   tq_floor_wood (sàn hiên 1,2 m)   → giữ, xoay nhà nhìn ra vách đá lúc đặt
