# -*- coding: utf-8 -*-
# ============================================================================
#  LIB_SIGNAGE_KIT — biển ngang gỗ 匾额 + đèn lồng treo cho dãy phố cũ bq_*
#  Dựng thủ tục Blender 5.2 headless (bpy), không texture ngoài, đơn vị mét.
#  Trục Blender: X = bề ngang, Y = chiều dày/trước sau (mặt tiền −Y → glTF +Z),
#  Z = lên. Gốc (0,0,0) = ĐÁY từng đạo cụ, tâm ngang.
#
#  2 NODE / 2 FILE trung gian (kit gộp 1 nhóm như lib_noi_that — interior.js:285):
#   · lib_sign_board  — biển chuẩn 1,2 × 0,4 × 0,06 m (code scale 0,75/1,25
#     ra cỡ 0,9/1,5, tâm treo 2,2 m). Khung gỗ #664228, mặt sơn son #964B00
#     mòn mép (viền gỗ lộ quanh mặt son), 2 móc sắt vàn trên mép.
#     MESH RIÊNG `sign_face`: quad 1 mặt, UV trống 0..1 đầy — code vẽ chữ
#     (canvas texture gán vào vật liệu riêng sgn_sign_face).
#   · lib_lantern_hang — đèn lồng Ø0,45 × 0,55 m (lụa đỏ #C3272B + khung tre
#     #664228, KHÔNG emissive — code gán glowAll + addLight như
#     src/game/landmarks.js:325-328), cần treo 0,35 m dây gai + vòng sắt,
#     đòn ngang tre Ø 0,05 × 1,2 m 2 đầu tròn, tua vàng #E7C969.
#
#  Vật liệu đặt tên sgn_* (7 slot). BẢN GIỮA ≤ 25000 tam giác.
#  Chạy: blender -b --python scripts/blender/gen_lib_signage_kit.py -- \
#           --dir <thư_mục_tạm>          (xuất cả 3 file)
#  Xuất: <dir>/lib_sign_board.glb · <dir>/lib_lantern_hang.glb ·
#        <dir>/lib_signage_kit.glb (2 node gộp, mỗi node tại gốc riêng)
# ============================================================================
import bpy, sys, math, json, os

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUTDIR = argv[argv.index('--dir') + 1] if '--dir' in argv else '.'
TRI_BUDGET = 25000

bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene
scn.unit_settings.system = 'METRIC'
scn.unit_settings.scale_length = 1.0

# ---------- vật liệu Principled BSDF (không texture ngoài, KHÔNG emissive) ----------
def srgb_to_linear(c):
    c = min(max(c, 0.0), 1.0)
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def solid_tex(name, hexcol, size=4):
    """Texture màu đặc nhúng trong file — chống palette()/dedup()/join() của
    gltf-transform optimize (scripts/meshy-pack-library.mjs) gộp/đổi tên vật liệu:
    palette() bỏ qua vật liệu CÓ texture, join không nhập primitive khác vật liệu."""
    img = bpy.data.images.new(name, width=size, height=size, alpha=False)
    r, g, b = [srgb_to_linear(int(hexcol[i:i + 2], 16) / 255.0) for i in (0, 2, 4)]
    img.pixels = [r, g, b, 1.0] * (size * size)
    img.pack()
    return img

def make_mat(name, hexcol, rough=0.8, metal=0.0, sheen=0.0, tex_size=4):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    r = [srgb_to_linear(int(hexcol[i:i + 2], 16) / 255.0) for i in (0, 2, 4)]
    b.inputs['Base Color'].default_value = (*r, 1.0)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if sheen > 0.0:  # lụa: sheen theo bảng PBR (lụa 0,3 + sheen)
        try:
            b.inputs['Sheen Weight'].default_value = sheen
            b.inputs['Sheen Tint'].default_value = (1.0, 0.85, 0.75, 1.0)
            b.inputs['Sheen Roughness'].default_value = 0.5
        except Exception:
            pass
    tex = m.node_tree.nodes.new('ShaderNodeTexImage')
    tex.image = solid_tex(name + '_tex', hexcol, tex_size)
    m.node_tree.links.new(tex.outputs['Color'], b.inputs['Base Color'])
    return m

M = {
    'wood':  make_mat('sgn_wood_frame',  '664228', rough=0.72),            # khung gỗ tối
    'lacq':  make_mat('sgn_lacquer',     '964B00', rough=0.38),            # sơn son bóng (mặt sau)
    'face':  make_mat('sgn_sign_face',   '964B00', rough=0.38, tex_size=64),  # mặt trước — slot chữ code (texture 64 khác loại với lacquer 4 → dedup không gộp)
    'iron':  make_mat('sgn_iron_dark',   '3a3430', rough=0.5, metal=0.65), # móc/vòng sắt làn
    'bamboo':make_mat('sgn_bamboo',      '664228', rough=0.7),             # khung tre tối
    'silk':  make_mat('sgn_silk_red',    'C3272B', rough=0.3, sheen=0.4),  # lụa đỏ truyền (không emissive)
    'gold':  make_mat('sgn_tassel_gold', 'E7C969', rough=0.5),             # tua vàng
    'rope':  make_mat('sgn_rope_hemp',   '8a7355', rough=0.9),             # dây gai cần treo
}

# Mọi vật liệu đều mang texture màu đặc (xem solid_tex) → tên sgn_* + ranh giới mesh
# sống nguyên qua meshy-pack-library; sgn_sign_face là slot code vẽ chữ (thay map).

# ---------- helper dựng hình ----------
def reg(obj, mat):
    obj.data.materials.append(mat)
    return obj

def box(name, sx, sy, sz, x, y, z, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z))
    o = bpy.context.active_object
    o.name = name; o.scale = (sx, sy, sz)
    return reg(o, mat)

def cyl(name, r, h, x, y, z, mat, seg=14, rx=0.0, ry=0.0, rz=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r, depth=h,
                                        location=(x, y, z), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name
    return reg(o, mat)

def sph(name, r, x, y, z, mat, seg=10, ring=8):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=ring, radius=r, location=(x, y, z))
    o = bpy.context.active_object
    o.name = name
    return reg(o, mat)

def torus(name, R, t, x, y, z, mat, seg=16, rx=0.0, ry=0.0, rz=0.0):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=t, major_segments=seg,
                                     minor_segments=8, location=(x, y, z), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name
    return reg(o, mat)

def strip(name, verts, quads, mat):
    """Mặt cong từ pydata (sườn tre ôm thân đèn)."""
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], quads)
    me.validate(); me.update()
    o = bpy.data.objects.new(name, me)
    scn.collection.objects.link(o)
    return reg(o, mat)

# ============================================================================
#  ĐẠO CỤ 1 — LIB_SIGN_BOARD (biển ngang 1,2 × 0,4 × 0,06)
# ============================================================================
SB = []   # phần thân (gộp 1 mesh)

# thân gỗ #664228 — dày 0,042 giữa, khung lộ quanh mặt son = mòn mép
SB.append(box('sg_board_slab', 1.2, 0.042, 0.4, 0, 0, 0.2, M['wood']))
INSET, LIP = 0.058, 0.010        # nẹp gỗ nổi viền mặt son
# nẹp 4 cạnh (mặt trước −Y, nhô tới y = −0,031)
SB.append(box('sg_lip_top',    1.2 - 2 * INSET, 0.010, LIP, 0, -0.026, 0.4 - INSET - LIP / 2, M['wood']))
SB.append(box('sg_lip_bot',    1.2 - 2 * INSET, 0.010, LIP, 0, -0.026, INSET + LIP / 2, M['wood']))
SB.append(box('sg_lip_left',   LIP, 0.010, 0.4 - 2 * INSET, -0.6 + INSET + LIP / 2, -0.026, 0.2, M['wood']))
SB.append(box('sg_lip_right',  LIP, 0.010, 0.4 - 2 * INSET,  0.6 - INSET - LIP / 2, -0.026, 0.2, M['wood']))
# mặt son mặt SAU (đơn giản, đóng khung)
SB.append(box('sg_son_back', 1.08, 0.006, 0.28, 0, 0.024, 0.2, M['lacq']))
# 2 móc sắt vàn trên mép (vòng nằm trong mặt phẳng biển, nhô lên 0,41 < +5%)
for i, hx in enumerate((-0.52, 0.52)):
    SB.append(torus(f'sg_hook_{i}', 0.024, 0.006, hx, 0, 0.38, M['iron'],
                    seg=14, rx=math.pi / 2))          # trục vòng = Y → vòng song song mặt biển

# mặt son TRƯỚC = mesh riêng `sign_face`: 1 quad, UV 0..1 đầy, pháp tuyến −Y
FW = 0.6 - INSET - LIP - 0.004        # nửa rộng ô son (chừa khe 4 mm trong nẹp)
FZ0, FZ1 = INSET + LIP + 0.006, 0.4 - INSET - LIP - 0.006
fy = -0.0315                           # hờ hơn nẹp 0,5 mm — không z-fight
sf_me = bpy.data.meshes.new('sign_face')
sf_v = [(-FW, fy, FZ0), (FW, fy, FZ0), (FW, fy, FZ1), (-FW, fy, FZ1)]
sf_f = [(0, 1, 2, 3)]                  # (v1−v0)×(v2−v1) = +X×+Z = −Y ✓ ngược chiều kim đồng hồ nhìn từ trước
sf_me.from_pydata(sf_v, [], sf_f)
sf_me.validate(); sf_me.update()
sf_uv = [(0.0, 0.0), (1.0, 0.0), (1.0, 1.0), (0.0, 1.0)]
sf_me.uv_layers.new(name='UVMap')
for li, uv in enumerate(sf_uv):
    sf_me.uv_layers['UVMap'].data[li].uv = uv
sign_face = bpy.data.objects.new('sign_face', sf_me)
scn.collection.objects.link(sign_face)
reg(sign_face, M['face'])

# ============================================================================
#  ĐẠO CỤ 2 — LIB_LANTERN_HANG (đèn Ø0,45×0,55 + cần treo 0,35 + đòn 1,2)
# ============================================================================
LH = []
# thân lụa đỏ: ellipsoid Ø0,45 × cao 0,48, tâm z = 0,375 (đáy lụa 0,135 / đỉnh 0,615)
o = sph('lh_silk', 1.0, 0, 0, 0.375, M['silk'], seg=28, ring=18)
o.scale = (0.225, 0.225, 0.24)
LH.append(o)
# nắp tre trên/dưới (đóng 2 đầu — đèn cao đúng 0,55: 0,10 → 0,65)
LH.append(cyl('lh_cap_bot', 0.155, 0.035, 0, 0, 0.1175, M['bamboo'], seg=18))
LH.append(cyl('lh_cap_top', 0.155, 0.035, 0, 0, 0.6325, M['bamboo'], seg=18))
LH.append(torus('lh_rim_bot', 0.166, 0.011, 0, 0, 0.128, M['bamboo'], seg=20))
LH.append(torus('lh_rim_top', 0.166, 0.011, 0, 0, 0.622, M['bamboo'], seg=20))
# 8 sườn tre ôm cong thân lụa (strip 14 đoạn, nhô 1,5% ra ngoài biên dạng)
NRIB, NSEG = 8, 14
Z0, Z1, RX, RZ = 0.135, 0.615, 0.225, 0.24
for i in range(NRIB):
    th = 2 * math.pi * i / NRIB
    dth = 0.030
    v, q = [], []
    for j in range(NSEG + 1):
        t = j / NSEG
        z = Z0 + (Z1 - Z0) * t
        rr = RX * math.sqrt(max(0.0, 1.0 - ((z - 0.375) / RZ) ** 2)) * 1.015
        v.append((rr * math.cos(th - dth), rr * math.sin(th - dth), z))
        v.append((rr * math.cos(th + dth), rr * math.sin(th + dth), z))
        if j:  # quad nối tầng j−1 (đỉnh 2(j−1), 2(j−1)+1) với tầng j (2j, 2j+1)
            q.append((2 * (j - 1), 2 * (j - 1) + 1, 2 * j + 1, 2 * j))
    LH.append(strip(f'lh_rib_{i}', v, q, M['bamboo']))
# tua vàng dưới đèn: đai + chùm tua nở dần xuống chạm z = 0 (đáy gốc)
LH.append(cyl('lh_tua_band', 0.02, 0.018, 0, 0, 0.091, M['gold'], seg=12))
bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=0.027, radius2=0.004, depth=0.083,
                                location=(0, 0, 0.0415), rotation=(math.pi, 0, 0))  # chóp xuống dưới
o = bpy.context.active_object; o.name = 'lh_tua_tuft'
LH.append(reg(o, M['gold']))
# cần treo 0,35 (z 0,65 → 1,00): dây gai Ø0,012 + nút bẹ + vòng sắt lồng đòn
LH.append(cyl('lh_rope', 0.012, 0.29, 0, 0, 0.795, M['rope'], seg=8))
LH.append(sph('lh_rope_knot', 0.021, 0, 0, 0.655, M['rope'], seg=10, ring=6))
LH.append(torus('lh_rope_ring', 0.033, 0.007, 0, 0, 0.998, M['iron'], seg=14, ry=math.pi / 2))
# đòn ngang tre Ø0,05 × 1,2 trục X, 2 đầu tròn khắc nổi (núm Ø0,068, tổng ngang 1,228 < +5%)
LH.append(cyl('lh_bar', 0.025, 1.2, 0, 0, 1.025, M['bamboo'], seg=14, ry=math.pi / 2))
LH.append(sph('lh_bar_nub_L', 0.034, -0.58, 0, 1.025, M['wood'], seg=12, ring=8))
LH.append(sph('lh_bar_nub_R', 0.034,  0.58, 0, 1.025, M['wood'], seg=12, ring=8))

# ============================================================================
#  GỘP MESH, SỬA PHÁP TUYẾN, WELD, GIẢM NẾU VƯỢT NGÂN SÁCH
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
    mod = obj.modifiers.new('weld_clean', 'WELD'); mod.merge_threshold = 0.0005
    bpy.ops.object.modifier_apply(modifier='weld_clean')
    return obj

def tri_count(obj):
    return sum(len(p.vertices) - 2 for p in obj.data.polygons)

board_body = join_parts(SB, 'lib_sign_board')      # node gốc = mesh (khuôn noi_that, KHÔNG empty parent)
lantern_full = join_parts(LH, 'lib_lantern_hang')
objs = [board_body, sign_face, lantern_full]
total = sum(tri_count(o) for o in objs)
if total > TRI_BUDGET:
    ratio = max(0.05, 0.94 * TRI_BUDGET / total)
    for obj in (board_body, lantern_full):   # sign_face 2 tam giác — không đụng
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True); bpy.context.view_layer.objects.active = obj
        dm = obj.modifiers.new('decimate_budget', 'DECIMATE')
        dm.ratio = ratio; dm.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier='decimate_budget')
    total = sum(tri_count(o) for o in objs)

# ---------- xuất 3 file (node gốc = mesh, giữ nguyên tên lib_sign_board / lib_lantern_hang) ----------
os.makedirs(OUTDIR, exist_ok=True)

def export(fname, roots):
    bpy.ops.object.select_all(action='DESELECT')
    for o in roots:
        o.select_set(True)
    try:
        bpy.ops.export_scene.gltf(filepath=os.path.join(OUTDIR, fname), export_format='GLB',
                                  export_yup=True, use_selection=True)
    except TypeError:
        bpy.ops.export_scene.gltf(filepath=os.path.join(OUTDIR, fname), export_format='GLB',
                                  use_selection=True)

export('lib_sign_board.glb', [board_body, sign_face])
export('lib_lantern_hang.glb', [lantern_full])
export('lib_signage_kit.glb', [board_body, sign_face, lantern_full])

def bbox(o):
    # bound_box đã bake transform sau join (parent = identity) → toạ độ cục bộ = thế giới
    vals = o.bound_box
    mn = [min(v[i] for v in vals) for i in range(3)]
    mx = [max(v[i] for v in vals) for i in range(3)]
    return [round(mx[i] - mn[i], 4) for i in range(3)], [round(m, 3) for m in mn]

dims = {o.name: bbox(o) for o in (board_body, sign_face, lantern_full)}
print('LIB_SIGNAGE_KIT ' + json.dumps({
    'dir': OUTDIR,
    'tris_board': tri_count(board_body), 'tris_sign_face': tri_count(sign_face),
    'tris_lantern': tri_count(lantern_full), 'tris_total': total, 'budget': TRI_BUDGET,
    'dims': dims,
    'mats': sorted(m.name for m in bpy.data.materials),
    'nodes': [o.name for o in (board_body, sign_face, lantern_full)],
}, ensure_ascii=False))
