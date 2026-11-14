# -*- coding: utf-8 -*-
# ============================================================================
#  LIB_HOUSE_B — nhà 2 gian KHÁ (biến thể trộn dãy phố) — nhóm B bộ nhà AAA
#  docs/GAME-AAA-MODEL-THANH-PHO.md §2.2 (LUẬT dims + HOUSE_SPECS đã duyệt).
#    b2 (2 tầng): 7,4 × 8,0 × 8,0 m — trệt 3,3 + lầu 2,7 = thân 6,0 + mái 2,0
#      (đỉnh 8,0; đổi tỉ lệ mái:thân 2,0/6,0 so với nhóm A 1,8/6,2 → silhouette
#      khác A ở camera xa). Tầng 2 lùi 0,6 làm DIÊN BAN gỗ cả mặt tiền (sàn ván
#      + lan làm 16 trụ + hoa văn chéo), cột hiên 3 cột đỡ xà nâng diên ban.
#    b1 (1 tầng): 7,4 × 7,0 × 4,6 m — thân 2,95 + mái 1,65.
#  Atlas NHÓM A (bảng màu nhà phố — dùng chung hex với nhóm A, không texture
#  ngoài): ngói BẠC phai #6B7A80 xen mảng ẩm #3B424C chạy dọc dải (nước chảy),
#  pan sứt đất nung #A44139 (nhà cũ hơn A), tấm lót #4A5459, vôi #F5F2E9,
#  phai #EDEAE0, chân ẩm taupe #C8B8A0, gạch xám #8A8580, gỗ mật ong #C19A6B,
#  gỗ sẫm #7D5839, khung tối #664228, gỗ son #964B00.
#  Chi tiết lặp = ARRAY MODIFIER (pan ngói dải dốc / ván cửa bản xếp / song
#  cửa sổ / trụ lan làm / râu mái). Biển ngang nhỏ 0,9×0,3 (khung #664228 +
#  mặt sơn son — mesh tên lhb?_bien_ngang cho code dè chữ sau). Khay cây trước
#  lan làm ~1,5k tris (2 bụi lá xám rêu #4A5459).
#  Trục Blender: X = bề ngang mặt tiền, Y = sâu (MẶT TIỀN -Y → +Z glTF yup),
#  Z = lên. Gốc (0,0,0) đáy giữa nhà. 1 unit = 1 m.
#  Chạy: blender -b --python gen_lib_house_b.py -- --variant b2 --out <f.glb>
#        blender -b --python gen_lib_house_b.py -- --variant b1 --out <f.glb>
# ============================================================================
import bpy, sys, math, json, os

argv = sys.argv[sys.argv.index('--') + 1:]
VAR = argv[argv.index('--variant') + 1]          # b2 | b1
OUT = argv[argv.index('--out') + 1]
TRI_BUDGET = 100000 if VAR == 'b2' else 60000    # trần nguồn (bản giữa pack ≤160k nhóm)

bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene
scn.unit_settings.system = 'METRIC'
scn.unit_settings.scale_length = 1.0

# ---------------------------------------------------------------- vật liệu (atlas nhóm A)
def srgb_to_linear(c):
    c = min(max(c, 0.0), 1.0)
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def make_mat(name, hexcol, rough=0.8, metal=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    r = [srgb_to_linear(int(hexcol[i:i + 2], 16) / 255.0) for i in (0, 2, 4)]
    bsdf.inputs['Base Color'].default_value = (*r, 1.0)
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    return m

M = {
    'ngoi_bac':  make_mat(f'lh_{VAR}_ngoi_bac',   '6B7A80', rough=0.85),  # ngói bạc phai
    'ngoi_am':   make_mat(f'lh_{VAR}_ngoi_am',    '3B424C', rough=0.90),  # mảng ẩm / rãnh
    'ngoi_lot':  make_mat(f'lh_{VAR}_ngoi_lot',   '4A5459', rough=0.95),  # tấm lót dưới pan
    'ngoi_sat':  make_mat(f'lh_{VAR}_ngoi_sat',   'A44139', rough=0.80),  # pan sứt đất nung
    'voi':       make_mat(f'lh_{VAR}_voi',        'F5F2E9', rough=0.95),  # vôi tường
    'voi_phai':  make_mat(f'lh_{VAR}_voi_phai',   'EDEAE0', rough=0.95),  # mảng phai
    'chan_am':   make_mat(f'lh_{VAR}_chan_am',    'C8B8A0', rough=0.95),  # chân ẩm taupe 0,5 m
    'gach':      make_mat(f'lh_{VAR}_gach',       '8A8580', rough=0.90),  # gạch xám bậc/đế
    'go_mat':    make_mat(f'lh_{VAR}_go_mat',     'C19A6B', rough=0.85),  # gỗ mật ong cũ
    'go_sam':    make_mat(f'lh_{VAR}_go_sam',     '7D5839', rough=0.80),  # gỗ sẫm
    'go_toi':    make_mat(f'lh_{VAR}_go_toi',     '664228', rough=0.85),  # khung tối nhất
    'go_son':    make_mat(f'lh_{VAR}_go_son',     '964B00', rough=0.70),  # gỗ son (cửa, biển)
    'la':        make_mat(f'lh_{VAR}_la',         '4A5459', rough=0.92),  # lá xám rêu
    'dat':       make_mat(f'lh_{VAR}_dat',        'BA5625', rough=0.95),  # đất trong khay
    'toi':       make_mat(f'lh_{VAR}_noi_toi',    '2F2B28', rough=1.00),  # nội thất tối
    'vang':      make_mat(f'lh_{VAR}_vien_vang',  'E7C969', rough=0.45),  # viền vàng lụa (biển)
}

# ---------------------------------------------------------------- helper (transform sạch ngay)
body_parts, roof_parts = [], []

def _reg(o, mat, bucket):
    o.data.materials.append(mat)
    bucket.append(o)
    return o

def _solo(o):
    """chỉ o được chọn + active — tránh transform_apply dính object cũ còn select."""
    bpy.ops.object.select_all(action='DESELECT')
    o.select_set(True)
    bpy.context.view_layer.objects.active = o
    return o

def sbox(name, sx, sy, sz, x, y, z, mat, bucket=body_parts, rx=0.0, ry=0.0, rz=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name
    o.scale = (sx, sy, sz)
    _solo(o)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.location = (x, y, z)
    return _reg(o, mat, bucket)

def scyl(name, r, h, x, y, z, mat, seg=12, bucket=body_parts, rx=0.0, ry=0.0, rz=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r, depth=h,
                                        location=(0, 0, 0), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name
    _solo(o)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.location = (x, y, z)
    return _reg(o, mat, bucket)

def sico(name, r, x, y, z, mat, sub=2, bucket=body_parts, sc=(1, 1, 1)):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub, radius=r, location=(0, 0, 0))
    o = bpy.context.active_object
    o.name = name
    o.scale = sc
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.location = (x, y, z)
    return _reg(o, mat, bucket)

def prism_z(name, tri, x0, x1, mat, bucket=body_parts):
    """Lăng trụ tam giác theo mặt cắt (y,z) — tường hồi gable."""
    verts = [(x0, y, z) for y, z in tri] + [(x1, y, z) for y, z in tri]
    faces = [(0, 1, 2), (5, 4, 3), (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)]
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.validate(); me.update()
    o = bpy.data.objects.new(name, me)
    scn.collection.objects.link(o)
    return _reg(o, mat, bucket)

def join_objs(parts, name):
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

def apply_array(o, count, off):
    """Array Modifier dọc trục local (chi tiết lặp đều: ngói/ván/song/trụ/râu)."""
    mod = o.modifiers.new('arr_lhb', 'ARRAY')
    mod.use_constant_offset = True
    mod.constant_offset_displace = off
    mod.use_relative_offset = False
    mod.count = count
    bpy.ops.object.select_all(action='DESELECT')
    o.select_set(True); bpy.context.view_layer.objects.active = o
    bpy.ops.object.modifier_apply(modifier='arr_lhb')
    return o

def tri_count(o):
    return sum(len(p.vertices) - 2 for p in o.data.polygons)

# ---------------------------------------------------------------- thông số kiến trúc
if VAR == 'b2':
    W, D, H = 7.4, 8.0, 8.0                      # LUẬT bbox
    TY   = 3.62                                  # tường tiền -3,62 / hậu +3,62 (sâu 7,24)
    T1H, T2H = 3.3, 6.0                          # trệt 3,3 + lầu 2,7 = thân 6,0
    SB2  = 0.6                                   # tầng 2 lùi 0,6 → mặt Y -3,02 (diên ban)
    EAVE_Y, EAVE_Z = 4.0, 5.80                   # mép mái vươn 0,38 khỏi tường
    TAN  = 0.5                                   # dốc 26,57° (A ~24° → silhouette khác)
    RIDGE_Z = EAVE_Z + EAVE_Y * TAN              # 7,80 mặt nóc
    CAP_BOT, CAP_TOP = 7.70, 7.98                # bờ nóc + orn đầu
    DOOR_H = 2.9
else:
    W, D, H = 7.4, 7.0, 4.6                      # LUẬT bbox
    TY   = 3.12
    T2H  = 2.95                                  # thân 1 tầng
    SB2  = 0.0
    EAVE_Y, EAVE_Z = 3.5, 2.75
    TAN  = 0.477                                 # dốc ~25,5°
    RIDGE_Z = EAVE_Z + EAVE_Y * TAN              # 4,42 mặt nóc
    CAP_BOT, CAP_TOP = 4.30, 4.58
    DOOR_H = 2.2

TX    = 3.35                                    # tường hồi mặt ngoài ±3,35
SLOPE = math.atan(TAN)
SN, CS = math.sin(SLOPE), math.cos(SLOPE)
RUN   = EAVE_Y / CS                             # dài mái theo dốc
HWX   = 3.6753                                  # nửa rộng dải pan (mép X ±3,675)
FY    = -TY                                     # mặt tiền tường

# ================================================================ THÂN
# -- thep đá chân tường (3 phía sau/trái/phải) + dải chân ẩm 0,5 m mặt tiền
wt = 0.26
sbox('thep_sau',   2 * TX, 0.30, 0.50, 0, TY - 0.02, 0.25, M['gach'])
sbox('thep_trai',  0.30, 2 * TY, 0.50, -TX + 0.02, 0, 0.25, M['gach'])
sbox('thep_phai',  0.30, 2 * TY, 0.50,  TX - 0.02, 0, 0.25, M['gach'])
sbox('chan_am_tien', 2 * TX, 0.06, 0.50, 0, FY - 0.02, 0.25, M['chan_am'])

# -- tường chính
if VAR == 'b2':
    sbox('tuong_hau', 2 * (TX - wt / 2), wt, T2H, 0, TY - wt / 2, T2H / 2, M['voi'])
    sbox('tuong_hoi_t_l', wt, 2 * TY - wt, T2H, -TX + wt / 2, 0, T2H / 2, M['voi'])
    sbox('tuong_hoi_t_r', wt, 2 * TY - wt, T2H,  TX - wt / 2, 0, T2H / 2, M['voi'])
    # góc tầng 1 dưới diên ban (tường hồi chỉ chạy từ -3,02 lên ở tầng 2)
    for sx_ in (-1, 1):
        sbox(f'goc_t1_{sx_:+d}', wt, SB2, T1H, sx_ * (TX - wt / 2), FY + SB2 / 2, T1H / 2, M['voi'])
    # mảng phai vôi lớn mặt hông trái (vệt ẩm cũ)
    sbox('vung_phai_hong', 0.02, 2.6, 1.6, -TX - 0.005, 0.4, 2.2, M['voi_phai'])
    # trụ góc mặt tiền tầng 1 + bờ trên cửa
    for sx_ in (-1, 1):
        sbox(f'tru_goc_{sx_:+d}', 0.52, wt, T1H, sx_ * (TX - 0.26), FY + wt / 2, T1H / 2, M['voi'])
    sbox('bo_tren_cua', 2 * (TX - 0.52), wt, T1H - DOOR_H, 0, FY + wt / 2,
         DOOR_H + (T1H - DOOR_H) / 2, M['voi'])
    # tường tầng 2 (mặt tiền lùi SB2): ván gỗ đứng + 2 đai
    fy2 = FY + SB2                                               # -3,02
    sbox('nen_t2', 2 * (TX - 0.1), 0.10, 0.16, 0, fy2 + 0.05, T1H + 0.08, M['go_toi'])
    sbox('dai_t2_t', 2 * (TX - 0.1), 0.08, 0.20, 0, fy2 + 0.04, T2H - 0.10, M['go_sam'])
    nv = 22; vw = (2 * (TX - 0.3)) / nv
    van = sbox('van_t2_goc', vw - 0.03, 0.055, T2H - T1H - 0.42, -(TX - 0.3) + vw / 2,
               fy2 + 0.035, T1H + 0.16 + (T2H - T1H - 0.42) / 2, M['go_mat'])
    apply_array(van, nv, (vw, 0, 0))
else:
    sbox('tuong_hau', 2 * (TX - wt / 2), wt, T2H, 0, TY - wt / 2, T2H / 2, M['voi'])
    sbox('tuong_hoi_t_l', wt, 2 * TY - wt, T2H, -TX + wt / 2, 0, T2H / 2, M['voi'])
    sbox('tuong_hoi_t_r', wt, 2 * TY - wt, T2H,  TX - wt / 2, 0, T2H / 2, M['voi'])
    sbox('vung_phai_hong', 0.02, 2.2, 1.2, -TX - 0.005, 0.3, 1.5, M['voi_phai'])
    for sx_ in (-1, 1):
        sbox(f'tru_goc_{sx_:+d}', 0.52, wt, T2H, sx_ * (TX - 0.26), FY + wt / 2, T2H / 2, M['voi'])
    sbox('bo_tren_cua', 2 * (TX - 0.52), wt, T2H - DOOR_H, 0, FY + wt / 2,
         DOOR_H + (T2H - DOOR_H) / 2, M['voi'])

# -- tường hồi gable (硬山) tam giác dưới mái
gbot = EAVE_Z + 0.10
prism_z('gable_l', [(-TY, gbot), (TY, gbot), (0, RIDGE_Z - 0.05)], -TX + 0.01, -TX + wt, M['voi'])
prism_z('gable_r', [(-TY, gbot), (TY, gbot), (0, RIDGE_Z - 0.05)],  TX - wt,  TX - 0.01, M['voi'])

# -- thềm bậc trước 2 gian (bậc ≤ 0,3 m, mép trong bbox)
sbox('bac1', 5.8, 0.34, 0.14, 0, FY - 0.17, 0.07, M['gach'])
sbox('bac2', 5.8, 0.28, 0.28, 0, FY - 0.14, 0.14, M['gach'])

# ================================================================ CỬA + CỬA SỔ
def door_set(bx, w, h):
    """1 gian = 1 bộ cửa bản xếp 2 cánh (7 ván/cánh bằng Array Modifier)."""
    dy = FY + 0.10
    for sx_ in (-1, 1):
        sbox(f'cua{bx:+.1f}_doc_{sx_:+d}', 0.15, 0.11, h, bx + sx_ * (w / 2 - 0.075), dy, h / 2, M['go_toi'])
    sbox(f'cua{bx:+.1f}_thuong', w, 0.11, 0.16, bx, dy, h - 0.08, M['go_toi'])
    sbox(f'cua{bx:+.1f}_nguong', w + 0.06, 0.30, 0.09, bx, dy - 0.06, 0.045, M['gach'])
    w2 = (w - 0.30) / 2                                          # 1,35 mỗi cánh
    for sx_ in (-1, 1):
        cx = bx + sx_ * (w2 / 2 + 0.02)
        nv = 3; vw = (w2 - 0.08) / nv
        van = sbox(f'cua{bx:+.1f}_van_{sx_:+d}', vw - 0.025, 0.05, h - 0.30,
                   cx - (w2 - 0.08) / 2 + vw / 2, dy, 0.15 + (h - 0.30) / 2, M['go_son'])
        apply_array(van, nv, (vw, 0, 0))
        for zr_ in (0.55, h - 0.62):
            sbox(f'cua{bx:+.1f}_dam_{sx_:+d}_{zr_:.0f}', w2 - 0.06, 0.065, 0.13, cx, dy, zr_, M['go_sam'])
        sbox(f'cua{bx:+.1f}_nam_{sx_:+d}', 0.05, 0.04, 1.0,
             cx - sx_ * (w2 / 2 - 0.12), dy + 0.03, h / 2 + 0.05, M['go_toi'])

def window_latt(bx, by, zc, w, h, out=1.0, small=False):
    """Cửa sổ khung tối + song dọc (Array) + ngang + ô hoa keo trên."""
    d = 0.10
    for sx_ in (-1, 1):
        sbox(f'w{bx:+.1f}_doc_{sx_:+d}', 0.12, d, h, bx + sx_ * (w / 2 - 0.06), by, zc, M['go_toi'])
    for sz_ in (-1, 1):
        sbox(f'w{bx:+.1f}_ngang_{sz_:+d}', w, d, 0.12, bx, by, zc + sz_ * (h / 2 - 0.06), M['go_toi'])
    ns = 5 if not small else 3
    sw = (w - 0.16) / (ns + 1)
    song = sbox(f'w{bx:+.1f}_song', 0.055, d - 0.02, h - 0.26, bx - (w - 0.16) / 2 + sw,
                by, zc - 0.02, M['go_toi'])
    apply_array(song, ns + 1, (sw, 0, 0))
    nz = 2 if small else 3
    for j in range(1, nz + 1):
        sbox(f'w{bx:+.1f}_songn_{j}', w - 0.20, d - 0.03, 0.05,
             bx, by, zc - h / 2 + 0.16 + (h - 0.34) * j / (nz + 1), M['go_sam'])
    if not small:                                                # ô hoa keo trên cửa sổ
        zh = zc + h / 2 - 0.28
        sbox(f'w{bx:+.1f}_keo_d', w - 0.3, 0.04, 0.045, bx, by, zh - 0.09, M['go_toi'])
        sbox(f'w{bx:+.1f}_keo_u', w - 0.3, 0.04, 0.045, bx, by, zh + 0.09, M['go_toi'])
        for k in range(4):
            xk = bx - (w - 0.44) / 2 + (w - 0.44) * k / 3
            sbox(f'w{bx:+.1f}_cheo_a{k}', 0.30, 0.035, 0.035, xk, by, zh, M['go_sam'], rz=math.radians(38))
            sbox(f'w{bx:+.1f}_cheo_b{k}', 0.30, 0.035, 0.035, xk, by, zh, M['go_sam'], rz=math.radians(-38))

for bx in (-1.72, 1.72):
    door_set(bx, 3.0, DOOR_H)

if VAR == 'b2':
    for bx in (-1.72, 1.72):                                     # cửa sổ con 1,2×1,4 tầng 2
        window_latt(bx, FY + SB2 + 0.045, 4.55, 1.2, 1.4)
        sbox(f'w{bx:+.1f}_sill', 1.36, 0.09, 0.05, bx, FY + SB2 + 0.09, 3.83, M['go_sam'])
        sbox(f'w{bx:+.1f}_vien', 1.44, 0.03, 1.62, bx, FY + SB2 + 0.028, 4.55, M['go_toi'])
else:
    for bx in (-1.72, 1.72):                                     # ô thoáng nhỏ trên cửa 0,9×0,6
        window_latt(bx, FY + 0.045, 2.55, 0.9, 0.6, small=True)

# cửa sổ hông (mỗi bên 1, mặt phẳng YZ trên tường hồi) + cửa sau 2 cánh
def window_latt_side(bx, by, zc, w, h):
    """Cửa sổ trên tường hông: cửa nằm trong mặt phẳng YZ (pháp tuyến X)."""
    d = 0.10
    for sy_ in (-1, 1):
        sbox(f'ws{bx:+.1f}_doc_{sy_:+d}', d, 0.12, h, bx, by + sy_ * (w / 2 - 0.06), zc, M['go_toi'])
    for sz_ in (-1, 1):
        sbox(f'ws{bx:+.1f}_ngang_{sz_:+d}', d, w, 0.12, bx, by, zc + sz_ * (h / 2 - 0.06), M['go_toi'])
    ns = 4
    sw = (w - 0.16) / (ns + 1)
    song = sbox(f'ws{bx:+.1f}_song', d - 0.03, 0.045, h - 0.28, bx, by - (w - 0.16) / 2 + sw,
                zc - 0.02, M['go_sam'])
    apply_array(song, ns + 1, (0.0, sw, 0.0))
    for j in range(1, 3):
        sbox(f'ws{bx:+.1f}_songn_{j}', d - 0.03, w - 0.20, 0.05, bx, by,
             zc - h / 2 + 0.16 + (h - 0.34) * j / 3, M['go_sam'])

window_latt_side(-TX - 0.045, 0.55, 1.85, 0.9, 1.1)
window_latt_side( TX + 0.045, 0.55, 1.85, 0.9, 1.1)
dy = TY - 0.10
sbox('cua_sau_doc_l', 0.15, 0.11, 2.1, -0.68, dy, 1.05, M['go_toi'])
sbox('cua_sau_doc_r', 0.15, 0.11, 2.1,  0.68, dy, 1.05, M['go_toi'])
sbox('cua_sau_thuong', 1.5, 0.11, 0.16, 0, dy, 2.02, M['go_toi'])
for sx_ in (-1, 1):
    van = sbox(f'cua_sau_van_{sx_:+d}', 0.60, 0.05, 1.86, sx_ * 0.35, dy, 0.93, M['go_son'])
    apply_array(van, 2, (0.63, 0, 0))
    sbox(f'cua_sau_dam_{sx_:+d}', 0.62, 0.06, 0.12, sx_ * 0.35, dy, 1.5, M['go_sam'])

# ================================================================ BIỂN NGANG 0,9×0,3 (nhỏ)
bz = 3.16 if VAR == 'b2' else 2.42
by = FY - 0.05
sbox(f'lh{VAR}_bien_ngang_khung', 0.98, 0.06, 0.38, 0, by, bz, M['go_toi'])       # mesh tên rõ cho code dè chữ
sbox(f'lh{VAR}_bien_ngang_mat',   0.86, 0.035, 0.26, 0, by - 0.03, bz, M['go_son'])
sbox(f'lh{VAR}_bien_vien_tren',   0.90, 0.028, 0.035, 0, by - 0.052, bz + 0.13, M['vang'])
sbox(f'lh{VAR}_bien_vien_duoi',   0.90, 0.028, 0.035, 0, by - 0.052, bz - 0.13, M['vang'])
for sx_ in (-0.36, 0.36):
    scyl(f'moc_bien_{sx_:+.2f}', 0.014, 0.14, sx_, by + 0.09, bz + 0.16, M['go_toi'], seg=6)

# ================================================================ DIÊN BAN + CỘT HIÊN (b2) / KHAY CÂY
def planter(px, py, pz):
    """Khay cây gỗ trước lan làm — ~1,5k tris (khay + 2 bụi lá xám rêu)."""
    sbox(f'khay_{px:+.1f}_than', 1.70, 0.36, 0.26, px, py, pz + 0.13, M['go_toi'])
    sbox(f'khay_{px:+.1f}_vien', 1.78, 0.40, 0.05, px, py, pz + 0.27, M['go_mat'])
    sbox(f'khay_{px:+.1f}_dat',  1.58, 0.28, 0.04, px, py, pz + 0.255, M['dat'])
    for sx_ in (-0.42, 0.42):
        cx = px + sx_
        scyl(f'cay_{px:+.1f}_{sx_:+.2f}_than', 0.045, 0.50, cx, py, pz + 0.28 + 0.25, M['go_sam'],
             seg=6, rx=0.06 if sx_ < 0 else -0.06)
        sico(f'cay_{px:+.1f}_{sx_:+.2f}_t1', 0.30, cx, py, pz + 0.78, M['la'], sub=2, sc=(1.0, 0.85, 0.75))
        sico(f'cay_{px:+.1f}_{sx_:+.2f}_t2', 0.22, cx + 0.13, py + 0.04, pz + 0.64, M['la'], sub=2, sc=(0.9, 0.8, 0.7))
        sico(f'cay_{px:+.1f}_{sx_:+.2f}_t3', 0.14, cx - 0.11, py - 0.03, pz + 0.88, M['ngoi_am'], sub=1)

if VAR == 'b2':
    # sàn diên ban gỗ (7 ván) trên xà, span vùng lùi 0,6
    nv = 7; vw = (2 * TX - 0.1) / nv
    van = sbox('dienban_van_goc', vw - 0.04, SB2 - 0.02, 0.08, -(TX - 0.05) + vw / 2,
               FY + SB2 / 2, T1H + 0.04, M['go_mat'])
    apply_array(van, nv, (vw, 0, 0))
    sbox('dienban_dam_ngoai', 2 * TX - 0.1, 0.13, 0.17, 0, FY + 0.05, T1H - 0.045, M['go_toi'])
    # cột hiên 3 cột đỡ xà nâng diên ban
    for cx in (-3.28, 0.0, 3.28):
        scyl(f'cot_hien_{cx:+.1f}', 0.115, T1H - 0.02, cx, FY + 0.12, (T1H - 0.02) / 2 + 0.02, M['go_toi'], seg=12)
        sbox(f'de_cot_{cx:+.1f}', 0.40, 0.40, 0.16, cx, FY + 0.12, 0.08, M['gach'])
    sbox('xa_hien', 2 * TX - 0.02, 0.17, 0.17, 0, FY + 0.12, T1H - 0.02, M['go_sam'])
    # lan làm: trụ (Array) + tay vịn + thanh giữa + chéo hoa văn
    ry = FY + 0.07
    tru = sbox('lan_tru_goc', 0.06, 0.06, 0.86, -3.10, ry, T1H + 0.09 + 0.43, M['go_toi'])
    apply_array(tru, 16, (0.41333, 0, 0))
    sbox('lan_tay_vin', 2 * TX - 0.14, 0.10, 0.07, 0, ry, T1H + 0.99, M['go_mat'])
    sbox('lan_thanh_giua', 2 * TX - 0.14, 0.06, 0.06, 0, ry, T1H + 0.53, M['go_sam'])
    for k in range(15):
        xk = -3.10 + 0.41333 * (k + 0.5)
        sbox(f'lan_cheo_a{k}', 0.48, 0.035, 0.035, xk, ry, T1H + 0.76, M['go_sam'], rz=math.radians(44))
        sbox(f'lan_cheo_b{k}', 0.48, 0.035, 0.035, xk, ry, T1H + 0.76, M['go_sam'], rz=math.radians(-44))
    planter(0.0, FY + 0.30, T1H + 0.08)                         # khay cây trên diên ban, sau lan làm
else:
    for bx in (-1.72, 1.72):                                    # 2 khay cây trên thềm sát cửa (trong bbox sâu 7,0)
        planter(bx, FY - 0.10, 0.28)

# ================================================================ NỘI THẾT TỐI (nhìn xuyên cửa)
sbox('noi_vach', 6.4, 0.06, (T2H if VAR == 'b1' else T1H) - 0.25, 0, -2.2,
     (T2H if VAR == 'b1' else T1H) / 2, M['toi'])
sbox('noi_san', 6.4, 4.6, 0.05, 0, 0, 0.025, M['toi'])
sbox('noi_ban', 1.5, 0.7, 0.06, -1.5, -1.2, 0.82, M['go_sam'])
for lx in (-2.15, -0.85):
    sbox(f'noi_banchan_{lx:+.1f}', 0.08, 0.08, 0.78, lx, -1.2, 0.40, M['go_toi'])
sbox('noi_ke', 2.0, 0.30, 0.05, 1.6, -2.1, 1.6, M['go_sam'])
sbox('noi_ke2', 2.0, 0.30, 0.05, 1.6, -2.1, 2.05 if VAR == 'b1' else 2.5, M['go_sam'])
if VAR == 'b2':                                                 # vách tối sau cửa sổ tầng 2
    sbox('noi_vach_t2', 6.4, 0.06, 2.4, 0, -2.5, T1H + 1.3, M['toi'])

# ================================================================ MÁI (ngói ván BẠC phai + mảng ẩm)
NSTRIP, NROW = 30, 27 if VAR == 'b2' else 23
SP = 2 * HWX / NSTRIP                                            # 0,2453 ngang
STEP = 0.165                                                     # bước dọc dốc

def slope_pos(sign, s, lift):
    """Điểm trên mặt mái: sign -1 trước (mép -EAVE_Y), +1 sau; s = khoảng cách dọc dốc từ mép."""
    y = sign * (EAVE_Y - s * CS)
    z = EAVE_Z + s * SN + lift * CS
    return y, z

# tấm lót dưới pan
for sign in (-1, 1):
    yc, zc = slope_pos(sign, RUN / 2, -0.055)
    sbox(f'lot_mai_{"t" if sign < 0 else "s"}', 2 * HWX - 0.04, RUN, 0.05, 0, yc, zc,
         M['ngoi_lot'], bucket=roof_parts, rx=-sign * SLOPE)

# pan ngói: mỗi dải 1 màu (mảng ẩm chạy dọc dải), pan = hộp + váp nửa trụ, Array Modifier dọc dốc
S0 = STEP * 0.85                                                  # hàng đầu cách mép để không tràn bbox
for sign in (-1, 1):
    tag = 't' if sign < 0 else 's'
    rx = -sign * SLOPE
    for i in range(NSTRIP):
        xs = -HWX + SP * (i + 0.5)
        if i % 13 == 5:
            mat = M['ngoi_sat']                                  # pan sứt đất nung (nhà cũ)
        elif i % 6 in (2, 3):
            mat = M['ngoi_am']                                   # dải ẩm (nước chảy dọc)
        else:
            mat = M['ngoi_bac']
        pan = sbox(f'pan_{tag}_{i}', 0.225, 0.148, 0.042, xs, 0, 0, mat,
                   bucket=roof_parts, rx=rx)
        # váp (mép cong bắt nắng) tại mép -Y local của pan: đặt world rồi join
        a, b = -0.052, 0.033
        dyw = a * CS + sign * b * SN          # world = R_x(-sign*SLOPE) @ (0, a, b)
        dzw = -sign * a * SN + b * CS
        vap = scyl(f'vap_{tag}_{i}', 0.052, 0.225, xs, dyw, dzw, mat, seg=6,
                   bucket=roof_parts, ry=math.pi / 2)
        roof_parts.pop()                                         # join xong chỉ còn pan
        bpy.ops.object.select_all(action='DESELECT')
        pan.select_set(True); vap.select_set(True)
        bpy.context.view_layer.objects.active = pan
        bpy.ops.object.join()                                    # pan + vap thành 1 tile (giữ rx)
        # offset theo local Y: dốc trước đi +Y lên ridge, dốc sau phải đi −Y về ridge
        apply_array(pan, NROW, (0.0, -sign * STEP, 0.0))
        y0, z0 = slope_pos(sign, S0, 0.035)
        pan.location = (xs, y0, z0)

# sống ngói (筒瓦) trên ranh giới dải
for sign in (-1, 1):
    tag = 't' if sign < 0 else 's'
    for i in range(1, NSTRIP):
        xs = -HWX + SP * i
        yc, zc = slope_pos(sign, RUN / 2, 0.10)
        scyl(f'song_{tag}_{i}', 0.055, RUN - 0.06, xs, yc, zc, M['ngoi_am'], seg=6,
             bucket=roof_parts, rx=(SLOPE - math.pi / 2) if sign < 0 else (math.pi / 2 - SLOPE))

# bờ it mép eave + râu mái (Array Modifier)
for sign in (-1, 1):
    ye = sign * (EAVE_Y - 0.13)
    sbox(f'brit_{"t" if sign < 0 else "s"}', 2 * HWX - 0.02, 0.17, 0.11, 0, ye, EAVE_Z - 0.03,
         M['ngoi_am'], bucket=roof_parts, rx=-sign * SLOPE)
    rau = sbox(f'rau_{"t" if sign < 0 else "s"}', 0.09, 0.52, 0.085, -3.20,
               sign * (EAVE_Y - 0.30), EAVE_Z - 0.16, M['go_toi'],
               bucket=roof_parts, rx=-sign * SLOPE)
    apply_array(rau, 16, (0.42666, 0, 0))

# bờ nóc + orn đầu + chùm gạch chụm đầu hồi
sbox('bo_noc', 2 * HWX - 0.01, 0.30, CAP_TOP - CAP_BOT - 0.04, 0, 0, (CAP_BOT + CAP_TOP) / 2 - 0.02,
     M['ngoi_am'], bucket=roof_parts)
for sx_ in (-1, 1):
    sbox(f'orn_noc_{sx_:+d}', 0.28, 0.42, 0.20, sx_ * (HWX - 0.16), 0, CAP_TOP - 0.10,
         M['ngoi_am'], bucket=roof_parts)
    for j in range(5):                                          # gạch chụm bậc thang đầu hồi
        sbox(f'gach_chum_{sx_:+d}_{j}', 0.20, 0.20 - j * 0.025, 0.085,
             sx_ * (HWX - 0.30), 0, RIDGE_Z - 0.12 - j * 0.105, M['ngoi_sat'], bucket=roof_parts)
# ván bạt gió hai đầu hồi (博风) — ngắn hơn mái 0,3 để không tràn bbox
for sx_ in (-1, 1):
    yc, zc = slope_pos(1, RUN / 2, 0.105)
    sbox(f'batgio_{sx_:+d}', 0.05, RUN - 0.30, 0.22, sx_ * (HWX - 0.01), yc, zc,
         M['go_toi'], bucket=roof_parts, rx=-SLOPE)

# ================================================================ GỘP / NGÂN SÁCH / XUẤT
if os.environ.get('LHB_DEBUG'):
    groups = {}
    bpy.context.view_layer.update()
    for o in scn.collection.objects:
        if o.type != 'MESH':
            continue
        key = o.name.split('_')[0]
        mnv = [1e9, 1e9, 1e9]; mxv = [-1e9, -1e9, -1e9]
        for v in o.data.vertices:
            p = o.matrix_world @ v.co
            for i in range(3):
                mnv[i] = min(mnv[i], p[i]); mxv[i] = max(mxv[i], p[i])
        a = groups.setdefault(key, [1e9, 1e9, 1e9, -1e9, -1e9, -1e9])
        for i in range(3):
            a[i] = min(a[i], mnv[i]); a[i + 3] = max(a[i + 3], mxv[i])
    print('LHB_DEBUG_GROUPS ' + json.dumps({k: [round(c, 3) for c in v] for k, v in groups.items()}))

body = join_objs(body_parts, f'lh{VAR}_body')
roof = join_objs(roof_parts, f'lh{VAR}_roof')
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

# đo bbox thật từ đỉnh đã transform
import mathutils

mn = mathutils.Vector((1e9, 1e9, 1e9)); mx = mathutils.Vector((-1e9, -1e9, -1e9))
for o in (body, roof):
    for v in o.data.vertices:
        p = o.matrix_world @ v.co
        mn.x = min(mn.x, p.x); mx.x = max(mx.x, p.x)
        mn.y = min(mn.y, p.y); mx.y = max(mx.y, p.y)
        mn.z = min(mn.z, p.z); mx.z = max(mx.z, p.z)
dims = (mx.x - mn.x, mx.y - mn.y, mx.z - mn.z)
target = (W, D, H)
bbox_ok = all(abs(d - t) <= 0.05 for d, t in zip(dims, target))

# preview 2 góc (soi chất lượng)
prevs = []
try:
    if os.environ.get('LHB_NOPREV'):
        raise RuntimeError('skip')
    views = [(f'lh{VAR}_preview.png', (9.5, -12.5, 6.5), 38, (0, 0, 3.4)),
             (f'lh{VAR}_front.png',   (0.0, -14.0, 3.2), 42, (0, 0, 2.6))]
    scn.render.engine = 'BLENDER_WORKBENCH'
    scn.display.shading.color_type = 'MATERIAL'
    scn.display.shading.light = 'STUDIO'
    scn.render.resolution_x = 1000
    scn.render.resolution_y = 700
    for fname, loc, lens, target_pt in views:
        prev = os.path.join(os.path.dirname(os.path.abspath(OUT)), fname)
        cam_data = bpy.data.cameras.new(f'lh{VAR}_cam')
        cam = bpy.data.objects.new(f'lh{VAR}_cam', cam_data)
        cam.location = loc
        d = mathutils.Vector(target_pt) - cam.location
        cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
        cam.data.lens = lens
        scn.collection.objects.link(cam)
        scn.camera = cam
        scn.render.filepath = prev
        bpy.ops.render.render(write_still=True)
        bpy.data.objects.remove(cam, do_unlink=True)
        bpy.data.cameras.remove(cam_data)
        prevs.append(prev)
except Exception as e:
    prevs = [f'preview_error: {e}']

for o in (body, roof):
    o.select_set(True)
bpy.context.view_layer.objects.active = body
try:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_yup=True,
                              use_selection=True)
except TypeError:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True)

print('LHB_REPORT ' + json.dumps({
    'variant': VAR, 'out': OUT,
    'tris': {'body': tb, 'roof': tr, 'total': total, 'budget': TRI_BUDGET},
    'dims': {'x': round(dims[0], 3), 'y': round(dims[1], 3), 'z': round(dims[2], 3)},
    'target': {'x': target[0], 'y': target[1], 'z': target[2]},
    'min': [round(c, 3) for c in mn], 'max': [round(c, 3) for c in mx],
    'bbox_ok': bbox_ok, 'previews': prevs,
    'mats': sorted(m.name for m in bpy.data.materials),
}, ensure_ascii=False))
