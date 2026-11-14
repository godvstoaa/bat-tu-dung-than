# -*- coding: utf-8 -*-
# ============================================================================
#  LIB_PROP_STREET — 3 prop phố cổ (3 FILE RIÊNG, cùng ngân sách ≤ 40k tris)
#    1) lib_prop_cart.glb  — xe rùa (xe kéo hàng): khung gỗ + thành đan tre,
#       2 bánh nan 12 căi (1 căi + Array dọc vành), cán kéo, sàn ván Array.
#       LUẬT 1,9 × 0,95 × 1,15 m (bánh Ø0,6) — bbox exact.
#    2) lib_prop_crate.glb — thùng gỗ đai tre sơn son #964B00 mòn mép cạnh
#       #946E4A (cột góc + nẹp đỉnh = edge wear hình học, không texture).
#       LUẬT 0,85³ m — bbox exact. Biến thể chồng 0,6³ = scale code (game).
#    3) lib_prop_pole.glb  — cột phướng: đế đá 2 bậc + cột son #E34234 mòn
#       #946E4A + chóp đồng; cờ lụa #C3272B 1,6×0,9 hai mặt DoubleSide +
#       viền vàng #E7C969, dập phồng gợn sóng nhẹ. LUẬT cao 6,2 m.
#       Cờ là NODE RIÊNG `pole_flag` — origin NẰM TRÊN TRỤC CỘT (0,0,5,53):
#       game xoay nhẹ quanh trục cột (local Y sau glTF yup) cho cờ phất,
#       KHÔNG vải vật lý.
#  Trục Blender: X = ngang (chiều kéo/cờ), Y = ngang còn lại, Z = lên;
#    export glTF (+Yup): cao = Y. Gốc (0,0,0) = đáy chạm đất, mét.
#  Chạy: blender -b --python gen_lib_prop_street.py -- \
#           --out <cart>.glb --out <crate>.glb --out <pole>.glb
#  Vật liệu đặt tên lps_* theo bảng màu phố (roughness 70/30).
# ============================================================================
import bpy, sys, math, json, mathutils

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUTS = [argv[i + 1] for i, a in enumerate(argv) if a == '--out']
while len(OUTS) < 3:                                   # mặc định cạnh cwd
    OUTS.append(('lib_prop_cart', 'lib_prop_crate', 'lib_prop_pole')[len(OUTS)]
                + '.glb')
OUT_CART, OUT_CRATE, OUT_POLE = OUTS[:3]
TRI_BUDGET = 40000                                     # ≤ 40k tris bản giữa

# ---------- dựng cảnh trống, đơn vị mét ----------
def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scn = bpy.context.scene
    scn.unit_settings.system = 'METRIC'
    scn.unit_settings.scale_length = 1.0
    return scn

# ---------- vật liệu Principled BSDF (không texture ngoài) ----------
def srgb_to_linear(c):
    c = min(max(c, 0.0), 1.0)
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def make_mat(name, hexcol, rough=0.8, metal=0.0, double=False):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    m.use_backface_culling = not double                # False → glTF doubleSided
    bsdf = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    r = [srgb_to_linear(int(hexcol[i:i + 2], 16) / 255.0) for i in (0, 2, 4)]
    bsdf.inputs['Base Color'].default_value = (*r, 1.0)
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    return m

# ---------- helper dựng hình ----------
parts = []

def reg(obj, mat):
    obj.data.materials.append(mat)
    parts.append(obj)
    return obj

def box(name, sx, sy, sz, x, y, z, mat, rx=0.0, ry=0.0, rz=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name
    o.scale = (sx, sy, sz)
    return reg(o, mat)

def cyl(name, r, h, x, y, z, mat, seg=12, rx=0.0, ry=0.0, rz=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r, depth=h,
                                        location=(x, y, z), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name
    return reg(o, mat)

def torus(name, R, r, x, y, z, mat, maj=32, mnr=12, rx=0.0, ry=0.0, rz=0.0):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r,
                                     major_segments=maj, minor_segments=mnr,
                                     location=(x, y, z), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name
    return reg(o, mat)

def dup_array(obj, count, dx=0.0, dy=0.0, dz=0.0):
    """Nhân bản tuyến tính (ván/song tre lặp) — pitch theo MÉT, DATA API thuần.
    Data API thuần (bản .copy() mesh riêng). Lưu ý lịch sử: các lần chạy
    đầu sai +1 m/bản theo X chỉ vì default dx=1.0 cũ của chính hàm này,
    không phải lỗi Blender. Nan bánh vẫn giữ Array dọc vành (radial_array)."""
    scn = bpy.context.scene
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True); bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    for k in range(1, count):
        d = bpy.data.objects.new(f'{obj.name}.{k:03d}', obj.data.copy())
        scn.collection.objects.link(d)
        d.location = (obj.location.x + dx * k, obj.location.y + dy * k,
                      obj.location.z + dz * k)
        d.rotation_euler = obj.rotation_euler.copy()
        parts.append(d)
    return obj

def radial_array(obj, count, center, axis='Z'):
    """Array vòng quanh trục (nan bánh xe) — object offset bằng empty xoay."""
    scn = bpy.context.scene
    emp = bpy.data.objects.new('arr_empty', None)
    emp.location = center
    emp.rotation_euler = ({'X': (math.radians(360 / count), 0, 0),
                           'Y': (0, math.radians(360 / count), 0),
                           'Z': (0, 0, math.radians(360 / count))})[axis]
    scn.collection.objects.link(emp)
    mod = obj.modifiers.new('arr_rad', 'ARRAY')
    mod.count = count
    mod.use_relative_offset = False
    mod.use_object_offset = True
    mod.offset_object = emp                        # Blender 5.2: object → offset_object
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier='arr_rad')
    bpy.data.objects.remove(emp, do_unlink=True)
    return obj

def join_parts(bucket, name, smooth=False):
    for o in bucket:
        bpy.ops.object.select_all(action='DESELECT')
        o.select_set(True); bpy.context.view_layer.objects.active = o
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    bpy.ops.object.select_all(action='DESELECT')
    for o in bucket: o.select_set(True)
    bpy.context.view_layer.objects.active = bucket[0]
    bpy.ops.object.join()
    obj = bpy.context.active_object
    obj.name = name; obj.data.name = name
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode='OBJECT')
    mod = obj.modifiers.new('weld_clean', 'WELD'); mod.merge_threshold = 0.0005
    bpy.ops.object.modifier_apply(modifier='weld_clean')
    if smooth:
        bpy.ops.object.shade_smooth()
    return obj

def tri_count(obj):
    return sum(len(p.vertices) - 2 for p in obj.data.polygons)

def budget_guard(objs):
    total = sum(tri_count(o) for o in objs)
    if total > TRI_BUDGET:
        ratio = max(0.05, 0.94 * TRI_BUDGET / total)
        for obj in objs:
            bpy.ops.object.select_all(action='DESELECT')
            obj.select_set(True); bpy.context.view_layer.objects.active = obj
            dm = obj.modifiers.new('decimate_budget', 'DECIMATE')
            dm.ratio = ratio; dm.use_collapse_triangulate = True
            bpy.ops.object.modifier_apply(modifier='decimate_budget')
        total = sum(tri_count(o) for o in objs)
    return total

def export(path):
    try:
        bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', export_yup=True)
    except TypeError:
        bpy.ops.export_scene.gltf(filepath=path, export_format='GLB')

def obj_dims(obj):
    bb = obj.bound_box
    xs = [v[0] for v in bb]; ys = [v[1] for v in bb]; zs = [v[2] for v in bb]
    return (max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs))

# ============================================================================
#  FILE 1 — XE RÙA (xe kéo hàng)  1,9 × 0,95 × 1,15 m, bánh Ø0,6
# ============================================================================
def build_cart():
    reset_scene()
    parts.clear()
    M = {
        'frame':  make_mat('lps_cart_frame',   '7d5839', rough=0.8),   # khung gỗ sẫm
        'plank':  make_mat('lps_cart_plank',   'c19a6b', rough=0.85),  # sàn ván gỗ mật ong
        'weaveV': make_mat('lps_cart_weave_v', 'a98d54', rough=0.75),  # nan tre dọc (tranh)
        'weaveH': make_mat('lps_cart_weave_h', '8f744b', rough=0.78),  # nan tre ngang đan sẫm
        'worn':   make_mat('lps_cart_worn',    '946e4a', rough=0.85),  # mòn mép (cán, vành)
        'dark':   make_mat('lps_cart_dark',    '664228', rough=0.7),   # bánh/hub/ trục
    }
    WHEEL_R_OUT = 0.30                                  # Ø0,6
    RIM_R, RIM_T = 0.268, 0.032                         # vành: 2*(0.268+0.032)=0.60
    WY = 0.435                                          # tâm bánh (trục Y)
    WZ = WHEEL_R_OUT                                    # đáy bánh chạm z=0

    # --- 2 bánh nan: vành cong + 1 nan + Array 12 dọc vành + hub + trục ---
    # trục bánh = Y → mọi trụ xoay rx=90° (Z→Y). Nan: geometry dịch +z rồi
    # origin nằm TẠM TÂM BÁNH → empty xoay thuần cho Array vòng.
    for si, sy in enumerate((-WY, +WY)):
        torus(f'banh{si}_vanh', RIM_R, RIM_T, -0.35, sy, WZ, M['worn'],
              maj=30, mnr=10, rx=math.pi / 2)
        sp = cyl(f'banh{si}_nan', 0.016, 0.19, -0.35, sy, WZ, M['dark'], seg=6)
        sp.data.transform(mathutils.Matrix.Translation((0, 0, 0.14)))  # origin=tâm bánh
        radial_array(sp, 12, (-0.35, sy, WZ), axis='Y')  # 12 căi quanh trục
        cyl(f'banh{si}_hub', 0.05, 0.055, -0.35, sy, WZ, M['dark'], seg=10, rx=math.pi / 2)
    cyl('truc_banh', 0.026, 0.80, -0.35, 0, WZ, M['dark'], seg=8, rx=math.pi / 2)

    # --- sàn ván: 1 ván + Array 10 (khung dầm dưới) ---
    for ry_ in (-0.36, 0.36):
        box(f'duong_sanj_{ry_:+.2f}', 1.80, 0.07, 0.07, 0, ry_, 0.505, M['frame'])
    for cx_ in (-0.72, -0.24, 0.24, 0.72):
        box(f'xa_ngangj_{cx_:+.2f}', 0.07, 0.79, 0.06, cx_, 0, 0.505, M['frame'])
    pl = box('van_san_0', 0.17, 0.90, 0.035, -0.835, 0, 0.555, M['plank'])
    dup_array(pl, 10, dx=0.1856)                         # 10 ván, tâm ±0,835 (đối xứng)

    # --- thành đan tre hai bên: khung + nan dọc (Array) + nan ngang (Array) ---
    for si, sy in enumerate((-0.45, +0.45)):
        box(f'thanh{si}_day', 1.80, 0.04, 0.06, 0, sy, 0.585, M['frame'])
        box(f'thanh{si}_vien_tren', 1.86, 0.05, 0.05, 0, sy, 1.125, M['frame'])  # đỉnh 1,15
        nv = box(f'thanh{si}_nandoc_0', 0.035, 0.022, 0.52, -0.86, sy, 0.865, M['weaveV'])
        dup_array(nv, 10, dx=0.191)                      # nan dọc 10 cái
        nh = box(f'thanh{si}_nanngang_0', 1.78, 0.026, 0.024, 0, sy, 0.70, M['weaveH'])
        dup_array(nh, 3, dz=0.165)                       # nan ngang 3 hàng
    # đầu/kết xe:面板 đan thấp hơn (chắn hàng)
    for ai, ax in enumerate((-0.90, +0.90)):
        box(f'daudep{ai}_khung', 0.06, 0.92, 0.50, ax, 0, 0.825, M['frame'])
        nv2 = box(f'daudep{ai}_nandoc_0', 0.022, 0.035, 0.40, ax, -0.38, 0.83, M['weaveV'])
        dup_array(nv2, 9, dy=0.095)
        nh2 = box(f'daudep{ai}_nanngang_0', 0.026, 0.86, 0.022, ax, 0, 0.68, M['weaveH'])
        dup_array(nh2, 2, dz=0.19)
    # 4 cột góc chế thành
    for gx in (-0.92, 0.92):
        for gy in (-0.44, 0.44):
            box(f'cotgoc_{gx:+.2f}_{gy:+.2f}', 0.06, 0.05, 0.56, gx, gy, 0.875, M['frame'])

    # --- cán kéo 2 bên (mòn méo nơi nắm) + tay nắm ngang ---
    ang = math.atan2(0.16, 0.40)
    for hy in (-0.27, 0.27):
        box(f'can_keo_{hy:+.2f}', 0.46, 0.05, 0.05, 0.74, hy, 0.615, M['worn'],
            ry=-ang)
    box('tay_nam', 0.05, 0.62, 0.055, 0.925, 0, 0.545, M['worn'])

    cart = join_parts(parts, 'cart_body')
    tris = budget_guard([cart])
    export(OUT_CART)
    d = obj_dims(cart)
    return {'out': OUT_CART, 'mesh': cart.name, 'tris': tris,
            'dims_xyz_m': [round(v, 3) for v in d],
            'law': [1.9, 0.95, 1.15], 'wheel_d': 2 * (RIM_R + RIM_T),
            'mats': sorted(m.name for m in bpy.data.materials)}

# ============================================================================
#  FILE 2 — THÙNG HÀNG  0,85³ m, sơn son mòn mép
# ============================================================================
def build_crate():
    reset_scene()
    parts.clear()
    M = {
        'lac':   make_mat('lps_crate_lacquer', '964b00', rough=0.55),  # sơn son
        'wear':  make_mat('lps_crate_wear',    '946e4a', rough=0.85),  # mòn mép lộ gỗ
        'band':  make_mat('lps_crate_bamboo',  'c19a6b', rough=0.7),   # đai tre
    }
    S = 0.85; H = S / 2                                  # 0,425

    # 4 cột góc = mép mòn nhiều nhất (đỏ sơn bay lộ gỗ #946E4A)
    for gx in (-1, 1):
        for gy in (-1, 1):
            box(f'cotgo_{gx:+d}{gy:+d}', 0.07, 0.07, 0.85, gx * (H - 0.035),
                gy * (H - 0.035), 0.425, M['wear'])
    # khung đỉnh (nẹp trên mòn) + đáy (còn sơn)
    for z, mat, tag in ((0.82, M['wear'], 'tren'), (0.03, M['lac'], 'duoi')):
        for gy in (-1, 1):
            box(f'khung_{tag}_y{gy:+d}', 0.78, 0.06, 0.06, 0, gy * (H - 0.03), z, mat)
        for gx in (-1, 1):
            box(f'khung_{tag}_x{gx:+d}', 0.06, 0.64, 0.06, gx * (H - 0.03), 0, z, mat)
    # ván đứng 4 mặt: 1 ván + Array 5 mỗi mặt (khe 12 mm đọc là thùng ghép;
    # KHÔNG xoay object có Array — mặt X đổi trục bằng kích thước sx/sy)
    for fi, (sx_, sy_, ax_, ay_) in enumerate(((0.025, 0.13, 0.4, -0.284),
                                               (0.025, 0.13, -0.4, -0.284),
                                               (0.13, 0.025, -0.284, 0.4),
                                               (0.13, 0.025, -0.284, -0.4))):
        v0 = box(f'van_{fi}_0', sx_, sy_, 0.70, ax_, ay_, 0.425, M['lac'])
        # mặt X (sx_<sy_, ván dọc Y) → pitch dy; mặt Y (sx_>sy_) → pitch dx
        dup_array(v0, 5, dx=(0.142 if sx_ > sy_ else 0.0), dy=(0.142 if sx_ < sy_ else 0.0))
    # đai tre 2 vòng ôm 4 mặt (dải 50 mm, lép mép thùng)
    for bi, bz in enumerate((0.215, 0.635)):
        for gy in (-1, 1):
            box(f'daitre_{bi}_y{gy:+d}', 0.85, 0.014, 0.05, 0, gy * (H - 0.007), bz, M['band'])
        for gx in (-1, 1):
            box(f'daitre_{bi}_x{gx:+d}', 0.014, 0.76, 0.05, gx * (H - 0.007), 0, bz, M['band'])
    # nẹp chéo chữ V mặt trước (chằng hàng khi di chuyển) — mảnh Y, xoay quanh Y
    box('neo_chao_trai', 0.52, 0.03, 0.03, -0.205, -(H - 0.02), 0.545, M['band'],
        ry=math.radians(38))
    box('neo_chao_phai', 0.52, 0.03, 0.03, 0.205, -(H - 0.02), 0.545, M['band'],
        ry=math.radians(-38))

    for o in parts:                                      # DEBUG bbox per part (thế giới)
        bpy.context.view_layer.update()                 # làm mới matrix_world cache
        ws = [o.matrix_world @ mathutils.Vector(c) for c in o.bound_box]
        w = [max(v.x for v in ws) - min(v.x for v in ws),
             max(v.y for v in ws) - min(v.y for v in ws),
             max(v.z for v in ws) - min(v.z for v in ws)]
        if max(w) > 1.0:                                 # chỉ in part lệch chuẩn
            print('DBG_BIG', o.name, [round(v, 3) for v in w])
    crate = join_parts(parts, 'crate_body')
    tris = budget_guard([crate])
    export(OUT_CRATE)
    d = obj_dims(crate)
    return {'out': OUT_CRATE, 'mesh': crate.name, 'tris': tris,
            'dims_xyz_m': [round(v, 3) for v in d], 'law': [0.85, 0.85, 0.85],
            'mats': sorted(m.name for m in bpy.data.materials)}

# ============================================================================
#  FILE 3 — CỘT PHƯỚC  cao 6,2 m, cờ 1,6×0,9 (node riêng xoay quanh trục cột)
# ============================================================================
def build_pole():
    reset_scene()
    parts.clear()
    M = {
        'stone': make_mat('lps_pole_stone', '7d766c', rough=0.95),
        'verm':  make_mat('lps_pole_verm',  'e34234', rough=0.6),    # cột son vermillion
        'wear':  make_mat('lps_pole_wear',  '946e4a', rough=0.85),   # mòn góc va chạm
        'bronze': make_mat('lps_pole_bronze', 'c9963c', rough=0.4, metal=0.8),
        'silk':  make_mat('lps_pole_silk',  'c3272b', rough=0.3, double=True),
        'gold':  make_mat('lps_pole_silk_gold', 'e7c969', rough=0.35, double=True),
    }
    # đế đá 2 bậc
    box('de_dai', 0.56, 0.56, 0.14, 0, 0, 0.07, M['stone'])
    box('de_nho', 0.42, 0.42, 0.16, 0, 0, 0.22, M['stone'])
    # thân cột son Ø0,07 + vòng đai mòn chân + chóp đồng
    cyl('cot_than', 0.035, 5.84, 0, 0, 0.28 + 5.84 / 2, M['verm'], seg=12)   # → 6,12
    cyl('cot_vong_chan', 0.055, 0.07, 0, 0, 0.345, M['wear'], seg=12)
    cyl('cot_vong_giua', 0.045, 0.05, 0, 0, 3.10, M['wear'], seg=12)
    cyl('chop_co', 0.022, 0.045, 0, 0, 6.1425, M['bronze'], seg=10)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.045, location=(0, 0, 6.155),
                                         segments=12, ring_count=8)
    chop = bpy.context.active_object; chop.name = 'chop_ngoc'; reg(chop, M['bronze'])  # đỉnh 6,20
    # xà ngang treo cờ
    cyl('xa_treo', 0.016, 0.34, 0.09, 0, 5.98, M['wear'], seg=8, ry=math.pi / 2)

    # ---- CỜ LỤA 1,6 × 0,9 — mesh cong nhẹ, NODE RIÊNG pivot trên trục cột ----
    FX0, FXL = 0.06, 1.66                                # x 0,06..1,66 = 1,60
    FTOP, FH = 5.98, 0.90                                # z 5,08..5,98 = 0,90
    PIV = (0.0, 0.0, FTOP - FH / 2)                      # (0,0,5,53) — nằm trên trục
    NU, NV = 14, 9
    verts, faces = [], []
    for iu in range(NU + 1):
        u = iu / NU
        for iv in range(NV + 1):
            v = iv / NV
            x = FX0 + FXL * u
            z = FTOP - FH * v - 0.03 * u * u             # đuôi cờ rũ nhẹ (bbox cờ ≈0,93)
            y = 0.052 * math.sin(3.3 * u - 0.6) * (0.25 + 0.75 * u) * (0.35 + 0.65 * v)
            verts.append((x - PIV[0], y - PIV[1], z - PIV[2]))
    for iu in range(NU):
        for iv in range(NV):
            a, b = iu * (NV + 1) + iv, (iu + 1) * (NV + 1) + iv
            faces.append(((a, a + 1, b + 1, b),
                          1 if (iv == 0 or iu >= NU - 1 or iv == NV - 1) else 0))
    me = bpy.data.meshes.new('pole_flag')
    me.from_pydata(verts, [], [f for f, _ in faces])
    me.update()
    me.materials.append(M['silk']); me.materials.append(M['gold'])
    for p, (_, mi) in zip(me.polygons, faces):
        p.material_index = mi                            # viền vàng 3 cạnh tự do
    flag = bpy.data.objects.new('pole_flag', me)
    flag.location = PIV                                  # xoay quanh trục cột trong game
    bpy.context.scene.collection.objects.link(flag)
    bpy.ops.object.select_all(action='DESELECT')
    flag.select_set(True); bpy.context.view_layer.objects.active = flag
    bpy.ops.object.shade_smooth()

    mast = join_parts(parts, 'pole_mast')
    objs = [mast, flag]
    tris = budget_guard(objs)
    export(OUT_POLE)
    d = obj_dims(mast)
    # đo cờ trong mesh: extent x/z của pole_flag (world = local + PIV)
    bb = flag.bound_box
    fx = max(v[0] for v in bb) - min(v[0] for v in bb)
    fz = max(v[2] for v in bb) + PIV[2], min(v[2] for v in bb) + PIV[2]
    return {'out': OUT_POLE, 'meshes': [mast.name, flag.name], 'tris': tris,
            'mast_dims_xyz_m': [round(v, 3) for v in d], 'law_h': 6.2,
            'flag_span_x': round(fx, 3), 'flag_z_top': round(fz[0], 3),
            'flag_z_bot': round(fz[1], 3), 'flag_pivot': list(PIV),
            'mats': sorted(m.name for m in bpy.data.materials)}

# ============================================================================
if __name__ == '__main__':
    r1 = build_cart();   print('LIB_PROP_CART  ' + json.dumps(r1, ensure_ascii=False))
    r2 = build_crate();  print('LIB_PROP_CRATE ' + json.dumps(r2, ensure_ascii=False))
    r3 = build_pole();   print('LIB_PROP_POLE  ' + json.dumps(r3, ensure_ascii=False))
    print('LIB_PROP_STREET ' + json.dumps(
        {'tris_total': r1['tris'] + r2['tris'] + r3['tris'], 'budget': TRI_BUDGET},
        ensure_ascii=False))
