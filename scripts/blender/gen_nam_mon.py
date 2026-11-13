# -*- coding: utf-8 -*-
"""gen_nam_mon.py — Cổng Nam Môn (cổng vào quận trên đảo chủ), id nam_mon.

Dựng thủ tục Blender 5.2 headless, xuất GLB (glTF 2.0) theo argv --out.
Trục Blender: X = bề ngang (26 m), Y = chiều sâu (8 m, mặt tiền +Y → glTF +Z), Z = cao.
Gốc đối tượng (0,0,0) nằm tại đáy giữa cổng. Đơn vị mét, không texture ngoài.

Kết cấu: cổng 5 gian (6 cột đỏ Ø0,5×6 m trên đài cẩm thạch 1,8 m), lối xuyên giữa 6 m
(khớp corridor() hw=3 landmarks.js:47), 2 lầu canh 2 tầng 4×4 mái xanh hai bên,
thân giữa 2 tầng (tầng dưới xuyên lòng, tầng trên gác chuông khung mở),
mái ngói lưu li VÀNG 2 tầng chồng dốc ~30° cong + bờ nóc 2 cánh phượng uốn,
bảng giữa ĐỂ TRỐNG cho plaque runtime (7×1,3 — heaven3d.js:198), 2 cột đèn lồng đồng 3 m.

Gộp 3 mesh: nam_mon_dai_cot / nam_mon_than_lau / nam_mon_mai — ngân sách ≤ 16000 tam giác.
"""
import bpy
import bmesh
import math
import mathutils
import os
import sys

# ---------------------------------------------------------------- argv
OUT = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else \
    os.path.join(os.environ.get('TEMP', '/tmp'), 'nam_mon.glb')

# ---------------------------------------------------------------- dọn scene
for ob in list(bpy.data.objects):
    bpy.data.objects.remove(ob, do_unlink=True)

# ---------------------------------------------------------------- chất liệu Principled BSDF
def make_mat(name, rgb, rough=0.5, metal=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bs = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    bs.inputs['Base Color'].default_value = (rgb[0], rgb[1], rgb[2], 1.0)
    bs.inputs['Roughness'].default_value = rough
    bs.inputs['Metallic'].default_value = metal
    return m

M_TILE   = make_mat('ngoi_vang_luu_li', (0xd9 / 255, 0xa4 / 255, 0x41 / 255), 0.28, 0.12)
M_WOOD   = make_mat('go_do',            (0x8a / 255, 0x28 / 255, 0x1a / 255), 0.55, 0.0)
M_STONE  = make_mat('da_trang_cam_thach', (0xde / 255, 0xd8 / 255, 0xca / 255), 0.50, 0.0)
M_BRONZE = make_mat('dong',             (0xc9 / 255, 0x96 / 255, 0x3c / 255), 0.32, 0.85)
M_GREEN  = make_mat('ngoi_xanh',        (0x33 / 255, 0x66 / 255, 0x53 / 255), 0.35, 0.08)

# ---------------------------------------------------------------- helpers
GRP_DAI, GRP_THAN, GRP_MAI = [], [], []

def mesh_obj(name, verts, faces, mat, smooth=False):
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = smooth
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    me.materials.append(mat)
    return ob

def box(name, size, loc, mat, rot=None, grp=None, smooth=False):
    # primitive_cube_add(size=1) tạo cube cạnh 1 (−0.5..+0.5) → scale = size cho đúng cạnh
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc)
    ob = bpy.context.active_object
    ob.name = name
    ob.scale = (size[0], size[1], size[2])
    if rot:
        ob.rotation_euler = rot
    me = ob.data
    me.materials.append(mat)
    for p in me.polygons:
        p.use_smooth = smooth
    if grp is not None:
        grp.append(ob)
    return ob

def cyl(name, r, h, loc, mat, seg=16, grp=None, smooth=True):
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r, depth=h, location=loc)
    ob = bpy.context.active_object
    ob.name = name
    me = ob.data
    me.materials.append(mat)
    for p in me.polygons:
        p.use_smooth = smooth
    if grp is not None:
        grp.append(ob)
    return ob

def curved_roof(name, L, D, RL, zb, H, U, thick, mat, nx, ny, cx=0.0, cy=0.0, grp=None):
    """Mái cong (đôc ~30° gần đỉnh, phiến dẹt dần, mũi đuôi vểnh lên — cong).
    L/D: nửa dài (X) / sâu (Y) tính đến mép diềm; RL: nửa dài sống nóc (chóp yết vũ);
    zb: cao độ mép mái; H: chiều cao vươn lên sống nóc; U: độ vểnh đuôi mái (mạnh ở góc)."""
    dmax = math.hypot(L - RL, D)

    def surf(x, y):
        ax, ay = abs(x), abs(y)
        d = math.hypot(max(0.0, ax - RL), ay)
        t = min(1.0, d / dmax)
        c = 0.35 + 0.65 * (ax / L) ** 2          # góc xa tâm → vểnh mạnh hơn
        return zb + H * (1.0 - t ** 0.65) + U * (t ** 6) * c

    xs = [-L + 2 * L * i / (nx - 1) for i in range(nx)]
    ys = [-D + 2 * D * j / (ny - 1) for j in range(ny)]
    V = []
    for y in ys:
        for x in xs:
            V.append((cx + x, cy + y, surf(x, y)))
    for y in ys:                                   # mặt đáy (dưới diềm nhìn từ đất)
        for x in xs:
            z = surf(x, y) - thick * (1.0 - 0.45 * min(1.0, abs(y) / D))
            V.append((cx + x, cy + y, z))
    top = lambda i, j: j * nx + i
    bot = lambda i, j: nx * ny + j * nx + i
    F = []
    for j in range(ny - 1):
        for i in range(nx - 1):
            F.append((top(i, j), top(i + 1, j), top(i + 1, j + 1), top(i, j + 1)))
            F.append((bot(i, j), bot(i, j + 1), bot(i + 1, j + 1), bot(i + 1, j)))
    for i in range(nx - 1):                        # khép viền quanh diềm
        F.append((top(i, 0), bot(i, 0), bot(i + 1, 0), top(i + 1, 0)))
        F.append((top(i, ny - 1), top(i + 1, ny - 1), bot(i + 1, ny - 1), bot(i, ny - 1)))
    for j in range(ny - 1):
        F.append((top(0, j), top(0, j + 1), bot(0, j + 1), bot(0, j)))
        F.append((top(nx - 1, j), bot(nx - 1, j), bot(nx - 1, j + 1), top(nx - 1, j + 1)))
    ob = mesh_obj(name, V, F, mat, smooth=True)
    if grp is not None:
        grp.append(ob)
    return ob

# ================================================================ 1. ĐÀI + CỘT
# đài cẩm thạch 1,8 m: bậc rộng 26×8 + 2 khối đỡ cột, chừa lối giữa 6,04 m
box('dai_bac_1', (26.0, 8.0, 0.7), (0, 0, 0.35), M_STONE, grp=GRP_DAI)
box('dai_trai',  (9.96, 6.8, 1.1), (-8.0, 0, 1.25), M_STONE, grp=GRP_DAI)
box('dai_phai',  (9.96, 6.8, 1.1), ( 8.0, 0, 1.25), M_STONE, grp=GRP_DAI)
box('nguong_dong', (6.1, 7.4, 0.18), (0, 0, 0.79), M_STONE, grp=GRP_DAI)

# 6 cột đỏ Ø0,5×6 m — 5 gian: gian giữa 6,6 (lối xuyên ~6,0 sạch)
COL_X = (-12.3, -7.5, -3.3, 3.3, 7.5, 12.3)
for k, x in enumerate(COL_X):
    cyl('cot_do_%d' % k, 0.25, 6.0, (x, 2.9, 4.8), M_WOOD, seg=16, grp=GRP_DAI)
    cyl('chan_cot_%d' % k, 0.36, 0.4, (x, 2.9, 2.0), M_STONE, seg=12, grp=GRP_DAI)

# ================================================================ 2. THÂN + LẦU + ĐÈN + CHUÔNG
# dầm ngạch + xà ngang dọc 5 gian (mặt trước/sau)
for s in (-1.0, 1.0):
    box('dam_ngach_%s' % ('f' if s > 0 else 'b'), (25.4, 0.5, 0.9), (0, s * 2.9, 6.35), M_WOOD, grp=GRP_THAN)
    box('xa_ngang_%s'  % ('f' if s > 0 else 'b'), (25.4, 0.9, 0.95), (0, s * 2.9, 7.325), M_WOOD, grp=GRP_THAN)
# tường gỗ gian biên (trừ gian giữa xuyên lòng)
for sx in (-1.0, 1.0):
    for sy in (-1.0, 1.0):
        box('tuong_%d%d' % (sx > 0, sy > 0), (8.5, 0.3, 4.3), (sx * -7.8, sy * 2.75, 3.95), M_WOOD, grp=GRP_THAN)
# khổ cửa giữa: xà dưới + BẢNG GIỮA ĐỂ TRỐNG (plaque runtime 7×1,3 sẽ phủ lên)
box('xa_cua_giua', (7.2, 1.0, 0.6), (0, 0, 5.65), M_WOOD, grp=GRP_THAN)
box('bang_giua_trong', (8.2, 0.55, 1.05), (0, 0, 6.475), M_WOOD, grp=GRP_THAN)

# --- 2 lầu canh 2 tầng 4×4×7 mái xanh, hai bên (x = ±10,2)
for side in (-1.0, 1.0):
    cx = side * 10.2
    box('lau_dai_%d' % (side > 0), (4.4, 4.4, 0.4), (cx, 0, 2.0), M_STONE, grp=GRP_THAN)
    box('lau_tang1_%d' % (side > 0), (3.9, 3.9, 3.0), (cx, 0, 3.7), M_WOOD, grp=GRP_THAN)
    box('lau_dai_giua_%d' % (side > 0), (4.15, 4.15, 0.35), (cx, 0, 5.375), M_STONE, grp=GRP_THAN)
    box('lau_tang2_%d' % (side > 0), (3.3, 3.3, 2.4), (cx, 0, 6.75), M_WOOD, grp=GRP_THAN)
    # lan can tầng 2
    for s in (-1.0, 1.0):
        box('lancan_y%d_%d' % (s > 0, side > 0), (3.6, 0.12, 0.5), (cx, s * 1.95, 5.8), M_WOOD, grp=GRP_THAN)
        box('lancan_x%d_%d' % (s > 0, side > 0), (0.12, 3.6, 0.5), (cx + s * 1.95, 0, 5.8), M_WOOD, grp=GRP_THAN)
    # cửa sổ khung đồng 2 tầng (4 mặt)
    for s in (-1.0, 1.0):
        box('cs1y%d_%d' % (s > 0, side > 0), (0.9, 0.08, 1.1), (cx, s * 1.99, 3.7), M_BRONZE, grp=GRP_THAN)
        box('cs1x%d_%d' % (s > 0, side > 0), (0.08, 0.9, 1.1), (cx + s * 1.99, 0, 3.7), M_BRONZE, grp=GRP_THAN)
        box('cs2y%d_%d' % (s > 0, side > 0), (0.7, 0.08, 0.9), (cx, s * 1.69, 6.6), M_BRONZE, grp=GRP_THAN)
        box('cs2x%d_%d' % (s > 0, side > 0), (0.08, 0.7, 0.9), (cx + s * 1.69, 0, 6.6), M_BRONZE, grp=GRP_THAN)

# --- gác chuông khung mở trên nóc mái giữa
box('gac_san', (8.0, 3.0, 1.3), (0, 0, 8.85), M_WOOD, grp=GRP_THAN)   # đế xuyên mái che sống nóc
for sx in (-1.0, 1.0):
    for sy in (-1.0, 1.0):
        cyl('cot_gac_%d%d' % (sx > 0, sy > 0), 0.15, 1.5, (sx * 3.1, sy * 1.35, 10.25), M_WOOD, seg=8, grp=GRP_THAN)
for s in (-1.0, 1.0):
    box('vien_gac_y%d' % (s > 0), (6.7, 0.26, 0.3), (0, s * 1.35, 10.95), M_WOOD, grp=GRP_THAN)
    box('vien_gac_x%d' % (s > 0), (0.26, 2.96, 0.3), (s * 3.1, 0, 10.95), M_WOOD, grp=GRP_THAN)
    box('lan_gac_y%d' % (s > 0), (6.7, 0.14, 0.2), (0, s * 1.35, 10.3), M_WOOD, grp=GRP_THAN)
    box('lan_gac_x%d' % (s > 0), (0.14, 2.96, 0.2), (s * 3.1, 0, 10.3), M_WOOD, grp=GRP_THAN)
# chuông đồng
cyl('chuong_day', 0.07, 0.3, (0, 0, 10.5), M_BRONZE, seg=8, grp=GRP_THAN)
cyl('chuong_than', 0.42, 0.6, (0, 0, 10.1), M_BRONZE, seg=12, grp=GRP_THAN)
cyl('chuong_vay', 0.55, 0.25, (0, 0, 9.67), M_BRONZE, seg=12, grp=GRP_THAN)

# --- 2 cột đèn lồng đồng 3 m trước cổng
for side in (-1.0, 1.0):
    px = side * 4.6
    cyl('den_day_%d' % (side > 0), 0.22, 0.18, (px, 5.1, 0.09), M_BRONZE, seg=10, grp=GRP_THAN)
    cyl('den_cot_%d' % (side > 0), 0.1, 3.0, (px, 5.1, 1.5), M_BRONZE, seg=10, grp=GRP_THAN)
    cyl('den_long_%d' % (side > 0), 0.38, 0.85, (px, 5.1, 3.475), M_TILE, seg=8, grp=GRP_THAN)
    cyl('den_non_%d' % (side > 0), 0.2, 0.14, (px, 5.1, 3.97), M_BRONZE, seg=8, grp=GRP_THAN)
    cyl('den_dinh_%d' % (side > 0), 0.06, 0.3, (px, 5.1, 4.15), M_BRONZE, seg=6, grp=GRP_THAN)

# ================================================================ 3. MÁI
# tầng 1 (mái giữa, ngói lưu li vàng): dốc ~30° cong, đuôi vểnh
# L=7.9 chừa hở với mép mái xanh lầu canh (lầu tại x≥8.05) — hai mái không cắt nhau
curved_roof('mai_tang1_vang', L=7.9, D=4.9, RL=6.1, zb=7.25, H=1.9, U=0.95,
            thick=0.22, mat=M_TILE, nx=31, ny=17, grp=GRP_MAI)
# tầng 2 (mái gác chuông) — ăn sâu vào đỉnh 4 cột gác (cột końn 11.0, mặt mái ~10.91 tại cột)
curved_roof('mai_tang2_vang', L=5.2, D=2.75, RL=4.1, zb=10.5, H=1.0, U=0.55,
            thick=0.18, mat=M_TILE, nx=23, ny=13, grp=GRP_MAI)
# mái xanh 2 lầu canh — mép trong x=8.05, không chạm mép mái vàng x=7.9
for side in (-1.0, 1.0):
    curved_roof('mai_lau_xanh_%d' % (side > 0), L=2.15, D=2.3, RL=1.35, zb=7.85, H=1.1, U=0.45,
                thick=0.16, mat=M_GREEN, nx=19, ny=13, cx=side * 10.2, grp=GRP_MAI)
# bờ nóc + 2 cánh phượng uốn
box('bor_noc', (6.8, 0.4, 0.38), (0, 0, 11.52), M_TILE, grp=GRP_MAI)
for side in (-1.0, 1.0):
    x0, z0 = side * 3.35, 11.5
    phi = 0.0
    for i, (seg_len, dphi) in enumerate(((0.35, math.radians(18.0)),
                                         (0.33, math.radians(18.0)),
                                         (0.30, math.radians(18.0)))):
        phi_mid = phi + dphi / 2.0
        cx = x0 + side * seg_len / 2.0 * math.cos(phi_mid)
        cz = z0 + seg_len / 2.0 * math.sin(phi_mid)
        w, h = 0.3 - 0.05 * i, 0.26 - 0.04 * i
        box('phuong_%d_%d' % (side > 0, i), (seg_len, w, h), (cx, 0, cz), M_BRONZE,
            rot=(0.0, -side * phi_mid, 0.0), grp=GRP_MAI)
        x0 += side * seg_len * math.cos(phi + dphi)
        z0 += seg_len * math.sin(phi + dphi)
        phi += dphi

# ================================================================ gộp 3 mesh
def join_group(objs, name):
    for o in bpy.context.scene.objects:
        o.select_set(False)
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    ob = bpy.context.active_object
    ob.name = name
    ob.data.name = name
    bpy.context.scene.cursor.location = (0.0, 0.0, 0.0)
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR', center='MEDIAN')
    return ob

FINAL = [
    join_group(GRP_DAI, 'nam_mon_dai_cot'),
    join_group(GRP_THAN, 'nam_mon_than_lau'),
    join_group(GRP_MAI, 'nam_mon_mai'),
]

total = 0
for ob in FINAL:
    n = sum(max(0, len(p.vertices) - 2) for p in ob.data.polygons)
    total += n
    print('TRIS %s = %d' % (ob.name, n))
print('TRIS TOTAL = %d' % total)

mn, mx = [1e9] * 3, [-1e9] * 3
for ob in FINAL:
    for c in ob.bound_box:
        v = ob.matrix_world @ mathutils.Vector(c)
        for i in range(3):
            mn[i] = min(mn[i], v[i]); mx[i] = max(mx[i], v[i])
print('BBOX min (%.2f, %.2f, %.2f) max (%.2f, %.2f, %.2f) size (%.2f x %.2f x %.2f)'
      % (*mn, *mx, mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]))

# ================================================================ export GLB
for o in bpy.context.scene.objects:
    o.select_set(False)
for ob in FINAL:
    ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True)
print('EXPORTED %s (%d bytes)' % (OUT, os.path.getsize(OUT)))
