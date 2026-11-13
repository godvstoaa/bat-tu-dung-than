# -*- coding: utf-8 -*-
# Đài Tế Tròn 3 tầng (kiểu Thiên Đàn / Circular Mound Altar) — dựng thủ tục Blender 5.2 headless.
# Quy ước: mét, gốc (0,0,0) tại đáy tâm đài. Mặt tiền (bậc chính diện BẮC) hướng -Y Blender
# => sau export glTF (Y-up) mặt tiền quay +Z đúng yêu cầu.
# 3 mesh sau khi gộp: thien_dan_dai (đài) / thien_dan_dien (điện tròn) / thien_dan_mai (mái lưu li).
# Kích thước: Ø38 (T1) / Ø30 (T2) / Ø22 (T3), mỗi tầng cao 2,2 m; điện tròn Ø12 12 cột đỏ không dầm;
# mái lưu li #1f5a55 3 tầng chồng thu 20%/tầng + chóp cầu ngọc; tổng cao ~12,2 m.
# Ngân sách ≤ 26000 tam giác (chừa dư dưới ngưỡng 28000 của bản giữa); Weld khử đỉnh trùng,
# Decimate chỉ khi vượt ngưỡng. Chất liệu Principled BSDF thuần màu, không texture ngoài.
import bpy
import sys
import math

PI = math.pi
TAU = 2.0 * PI

# ----------------------------- args -----------------------------
def get_arg(flag, default=None):
    a = sys.argv
    for i, x in enumerate(a):
        if x == flag and i + 1 < len(a):
            return a[i + 1]
    return default

OUT = get_arg('--out', 'thien_dan.glb')
TRIS_CAP = 26000  # dư dả dưới ngưỡng 28000 của bản giữa

# ----------------------------- scene sạch -----------------------------
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
col = scene.collection


def ang_dist(a, b):
    d = abs((a - b) % TAU)
    return min(d, TAU - d)


# ----------------------------- chất liệu (Principled BSDF, không texture) -----------------------------
def srgb(hexstr):
    h = hexstr.lstrip('#')
    return tuple(int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)) + (1.0,)


def make_mat(name, color, rough=0.8, metal=0.0, emit=None, emit_strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = srgb(color)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if emit:
        ec = 'Emission Color' if 'Emission Color' in b.inputs else 'Emission'
        b.inputs[ec].default_value = srgb(emit)
        if 'Emission Strength' in b.inputs:
            b.inputs['Emission Strength'].default_value = emit_strength
    return m


MAT_STONE = make_mat('thien_dan_da_trang', '#ece7da', rough=0.8)                       # đá cẩm thạch trắng
MAT_TILE = make_mat('thien_dan_ngoi_luu_li', '#1f5a55', rough=0.28, metal=0.05)        # ngói lưu li xanh thẫm
MAT_COPPER = make_mat('thien_dan_dong', '#c9963c', rough=0.35, metal=0.85)             # đồng (chóp, cổ)
MAT_COPPER_GLOW = make_mat('thien_dan_vong_dong', '#c9963c', rough=0.45, metal=0.7,
                           emit='#c9963c', emit_strength=0.55)                          # vòng đồng kẽm emissive nhẹ
MAT_RED = make_mat('thien_dan_cot_do', '#8e2318', rough=0.55)                          # cột đỏ sơn mài
MAT_JADE = make_mat('thien_dan_cau_ngoc', '#46a06e', rough=0.22, metal=0.0)            # cầu ngọc

# ----------------------------- khối dựng -----------------------------
parts = {'dai': [], 'dien': [], 'mai': []}


def reg(ob, mat, group, smooth=False):
    ob.data.materials.append(mat)
    for p in ob.data.polygons:
        p.use_smooth = smooth
    parts[group].append(ob)
    return ob


def cyl(name, r, z0, h, segs, mat, group, smooth=False):
    bpy.ops.mesh.primitive_cylinder_add(vertices=segs, radius=r, depth=h,
                                        location=(0.0, 0.0, z0 + h / 2.0))
    ob = bpy.context.active_object
    ob.name = name
    return reg(ob, mat, group, smooth)


def box(name, size, loc, rot_z, mat, group):
    # trục địa phương: X = hướng bán kính, Y = tiếp tuyến (chiều rộng), Z = cao
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc, rotation=(0.0, 0.0, rot_z))
    ob = bpy.context.active_object
    ob.name = name
    ob.scale = size
    return reg(ob, mat, group)


def sphere(name, r, loc, segs, rings, mat, group):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segs, ring_count=rings, radius=r, location=loc)
    ob = bpy.context.active_object
    ob.name = name
    return reg(ob, mat, group, smooth=True)


def sweep(name, section, segs, mat, group, smooth=False, gates=(), gate_hw=0.0):
    """Quét tiết diện (list (r,z)) quanh trục Z.
    - section kín (vòng lặp): ống/vỏ 3D, tiết diện phải theo chiều KIM ĐỒNG HỒ trong mặt phẳng (r,z)
      để pháp tuyến hướng ra ngoài.
    - section hở (2 điểm): vành đai phẳng mặt hướng lên +Z.
    - gates/gate_hw: bỏ đoạn góc rơi vào cổng bậc."""
    verts, faces = [], []
    nsec = len(section)
    closed = nsec > 2
    span = nsec if closed else nsec - 1
    for i in range(segs):
        a0 = i / segs * TAU
        a1 = (i + 1) / segs * TAU
        am = (a0 + a1) / 2.0
        if gates and any(ang_dist(am, g) < gate_hw for g in gates):
            continue
        base = len(verts)
        for a in (a0, a1):
            c, s = math.cos(a), math.sin(a)
            for (r, z) in section:
                verts.append((r * c, r * s, z))
        for j in range(span):
            j1 = (j + 1) % nsec
            faces.append((base + j, base + j1, base + nsec + j1, base + nsec + j))
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    ob = bpy.data.objects.new(name, me)
    col.objects.link(ob)
    return reg(ob, mat, group, smooth)


def ring_strip(name, r_in, r_out, z, segs, mat, group):
    """Vành đai phẳng trên mặt sàn (pháp tuyến +Z)."""
    return sweep(name, [(r_in, z), (r_out, z)], segs, mat, group)


def skirt(name, r_in, r_out, z0, z1, segs, mat, group, gates, gate_hw):
    """Vành bậc vây tròn quanh thân tầng (ống thấp), hở chỗ cổng bậc."""
    sec = [(r_in, z0), (r_in, z1), (r_out, z1), (r_out, z0)]  # CW trong (r,z) -> pháp tuyến ra ngoài
    return sweep(name, sec, segs, mat, group, gates=gates, gate_hw=gate_hw)


# ----------------------------- thông số đài -----------------------------
R_TIERS = [19.0, 15.0, 11.0]      # Ø38 / Ø30 / Ø22
H_TIER = 2.2
Z_TIERS = [0.0, 2.2, 4.4]
DIRS = [-PI / 2.0, PI / 2.0, 0.0, PI]   # BẮC (mặt tiền, -Y) / NAM / ĐÔNG / TÂY
N_STEPS = 9
RISE = H_TIER / N_STEPS            # 2,2/9 ≈ 0,244 m — 9+9+9 bậc ba tầng
RUN = 0.34
STEP_W = 3.0
POST_N = [54, 45, 36]              # 6×9 / 5×9 / 4×9 — bội số 9, trụ cách ~2,2 m
POST_H = 1.12

# --- 3 tầng đài tròn + vành bậc vây tròn (2 vành đá thấp quanh chân mỗi tầng) ---
for k in range(3):
    rk = R_TIERS[k]
    zk = Z_TIERS[k]
    skirt(f'td_vanhbac_t{k + 1}a', rk, rk + 0.85, zk, zk + 0.55, 48, MAT_STONE, 'dai',
          DIRS, math.asin(min(1.0, (STEP_W / 2.0 + 0.30) / (rk + 0.85))) + 0.02)
    skirt(f'td_vanhbac_t{k + 1}b', rk, rk + 0.42, zk, zk + 1.20, 48, MAT_STONE, 'dai',
          DIRS, math.asin(min(1.0, (STEP_W / 2.0 + 0.30) / (rk + 0.42))) + 0.02)
    cyl(f'td_tang{k + 1}', rk, zk, H_TIER, 80, MAT_STONE, 'dai')

# --- bậc 9+9+9 ở 4 hướng, thẻ đá đầu bậc (khắc bội số 9) ở chính diện BẮC ---
for k in range(3):
    r_wall = R_TIERS[k]
    z_base = Z_TIERS[k]
    for th in DIRS:
        ct, st = math.cos(th), math.sin(th)
        for i in range(N_STEPS):
            h_i = (i + 1) * RISE
            cr = r_wall + (9 - i) * RUN - RUN / 2.0
            box(f'td_bac_t{k + 1}_{i + 1}', (RUN, STEP_W, h_i),
                (cr * ct, cr * st, z_base + h_i / 2.0), th, MAT_STONE, 'dai')
        if th == DIRS[0]:  # chính diện BẮC: 2 thẻ đá đứng đầu bậc
            rr = r_wall + 9 * RUN + 0.42
            for sgn in (-1.0, 1.0):
                off = sgn * (STEP_W / 2.0 + 0.45)
                loc = (rr * ct - st * off, rr * st + ct * off, z_base + 0.42)
                box(f'td_the_t{k + 1}_{int(sgn)}', (0.16, 0.72, 0.84), loc, th, MAT_STONE, 'dai')

# --- lan can trắng: trụ bội số 9 cách ~2,2 m + 2 vành tay vịn + đế, hở 4 cổng bậc ---
for k in range(3):
    rk = R_TIERS[k] - 0.30
    zt = Z_TIERS[k] + H_TIER
    hw = math.asin(min(1.0, 1.75 / rk)) + 0.035
    cnt = POST_N[k]
    for i in range(cnt):
        a = i / cnt * TAU - PI / 2.0
        if any(ang_dist(a, g) < hw for g in DIRS):
            continue
        box(f'td_tru_t{k + 1}_{i}', (0.20, 0.20, POST_H),
            (rk * math.cos(a), rk * math.sin(a), zt + POST_H / 2.0), a, MAT_STONE, 'dai')
    skirt(f'td_tay_tren_t{k + 1}', rk - 0.10, rk + 0.10, zt + 1.10, zt + 1.26, 48,
          MAT_STONE, 'dai', DIRS, hw)
    skirt(f'td_tay_giua_t{k + 1}', rk - 0.055, rk + 0.055, zt + 0.52, zt + 0.62, 48,
          MAT_STONE, 'dai', DIRS, hw)
    skirt(f'td_de_lancan_t{k + 1}', rk - 0.15, rk + 0.15, zt, zt + 0.08, 48,
          MAT_STONE, 'dai', DIRS, hw)

# --- sàn tầng trên khắc 9 vòng đồng kẽm emissive nhẹ (9 vòng từ mép điện ra mép lan can) ---
for j in range(9):
    rj = 6.75 + j * (10.35 - 6.75) / 8.0
    ring_strip(f'td_vong_dong_{j + 1}', rj - 0.09, rj + 0.09, Z_TIERS[2] + H_TIER + 0.03,
               80, MAT_COPPER_GLOW, 'dai')

# ----------------------------- điện tròn Ø12 không dầm -----------------------------
Z_PLINTH = Z_TIERS[2] + H_TIER                    # 6.6
cyl('td_dien_chan', 6.55, Z_PLINTH, 0.16, 44, MAT_STONE, 'dien')     # chân nền 2 bậc
cyl('td_dien_ban', 6.30, Z_PLINTH, 0.35, 56, MAT_STONE, 'dien')      # nền bàn đá Ø12,6
Z_COL = Z_PLINTH + 0.35
for i in range(12):                               # 12 cột đỏ, không dầm ngang
    a = i / 12.0 * TAU + PI / 12.0
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.26, depth=1.75,
                                        location=(5.6 * math.cos(a), 5.6 * math.sin(a), Z_COL + 0.875))
    ob = bpy.context.active_object
    ob.name = f'td_cot_{i + 1}'
    reg(ob, MAT_RED, 'dien', smooth=True)
cyl('td_dien_vong_dinh', 6.0, Z_COL + 1.75, 0.32, 56, MAT_RED, 'dien')   # vòng đỉnh cột (không dầm)
cyl('td_dien_co_dong', 6.08, Z_COL + 2.07, 0.10, 32, MAT_COPPER, 'dien')  # cổ đồng đón mái
for i in range(12):                               # 12 đấu chồng đỡ mai phía cột
    a = i / 12.0 * TAU + PI / 12.0
    box(f'td_dau_{i + 1}', (0.50, 0.26, 0.30),
        (6.05 * math.cos(a), 6.05 * math.sin(a), Z_COL + 1.75 + 0.15), a, MAT_RED, 'dien')

# ----------------------------- mái lưu li 3 tầng chồng thu 20%/tầng + chóp cầu ngọc -----------------------------
# Vỏ mái cong lõm có chiều dày (tiết diện kín 8 điểm: mặt trong + mặt ngoài), thu 6,9 -> 5,52 -> 4,42.
ROOF_TIERS = [
    [(6.90, 8.98), (6.25, 9.55), (5.25, 9.98), (4.35, 10.18)],
    [(5.52, 10.12), (4.95, 10.55), (4.10, 10.88), (3.30, 11.02)],
    [(4.42, 10.96), (3.85, 11.26), (3.05, 11.44), (2.15, 11.52)],
]
for i, outer in enumerate(ROOF_TIERS):
    inner = [(r - 0.12, z - 0.10) for (r, z) in outer]
    section = inner + outer[::-1]                 # CW trong (r,z) -> pháp tuyến ra ngoài
    sweep(f'td_mai_{i + 1}', section, 64, MAT_TILE, 'mai', smooth=True)
cyl('td_mai_non', 2.22, 11.30, 0.22, 32, MAT_TILE, 'mai')     # nón chụp đỉnh vỏ mái
cyl('td_chop_co', 0.17, 11.52, 0.22, 12, MAT_COPPER, 'mai')    # cổ chóp đồng
cyl('td_chop_dn', 0.27, 11.66, 0.14, 12, MAT_COPPER, 'mai')    # đế chóp
sphere('td_chop_cau_ngoc', 0.30, (0.0, 0.0, 11.86), 16, 12, MAT_JADE, 'mai')  # cầu ngọc

# ----------------------------- gộp 3 mesh + weld + chuẩn hoá -----------------------------
def join_group(key, name):
    objs = parts[key]
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    ob = bpy.context.active_object
    ob.name = name
    ob.data.name = name
    ob.select_set(True)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    ob.select_set(False)
    return ob


def mesh_tris(me):
    return sum(max(3, len(p.vertices)) - 2 for p in me.polygons)


def weld_and_fix(ob, dist=0.0009):
    bpy.context.view_layer.objects.active = ob
    ob.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.remove_doubles(threshold=dist)
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode='OBJECT')
    ob.select_set(False)


finals = [join_group('dai', 'thien_dan_dai'),
          join_group('dien', 'thien_dan_dien'),
          join_group('mai', 'thien_dan_mai')]
for ob in finals:
    weld_and_fix(ob)

total = 0
for ob in finals:
    t = mesh_tris(ob.data)
    total += t
    print(f'[thien_dan] mesh {ob.name}: {t} tam giac')

# ----------------------------- khống chế ngân sách: Decimate nếu vượt -----------------------------
if total > TRIS_CAP:
    ratio = (TRIS_CAP * 0.97) / total
    print(f'[thien_dan] VUOT ngan sach {total} > {TRIS_CAP} -> decimate {ratio:.4f}')
    for ob in finals:
        bpy.context.view_layer.objects.active = ob
        ob.select_set(True)
        mod = ob.modifiers.new('budget', 'DECIMATE')
        mod.ratio = ratio
        bpy.ops.object.modifier_apply(modifier=mod.name)
        ob.select_set(False)
    total = sum(mesh_tris(ob.data) for ob in finals)
    for ob in finals:
        print(f'[thien_dan] mesh sau decimate {ob.name}: {mesh_tris(ob.data)} tam giac')

bb = finals[0].bound_box
zs = [v[2] for v in bb]
xs = [v[0] for v in bb]
print(f'[thien_dan] TONG: {total} tam giac (ngan sach {TRIS_CAP})')
print(f'[thien_dan] kich thuoc dai: rong X {max(xs) - min(xs):.2f} m, cao {max(zs):.2f} m')

# ----------------------------- export GLB -----------------------------
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB')
print(f'[thien_dan] export xong: {OUT}')
