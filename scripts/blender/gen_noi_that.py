# -*- coding: utf-8 -*-
"""gen_noi_that.py — Bộ Đạo Cụ Nội Thất (id: noi_that), Blender 5.2 headless.

12 mesh / 9 collection: án thư + lư bạc sơn + bình phong 6 cánh (2 biến thể lụa
canvas 512) + armilla quan tinh (nghiêng 23.5°) + bồ đoàn x6 + hạc đồng x2 +
đèn lồng 3 cỡ + thái hồ thạch + khay quỳ/giá cuộn thư.
Chất liệu = Principled BSDF màu palette (không texture ngoài; 2 canvas sinh
in-memory bằng numpy, xuất nhúng PNG trong GLB).
Gốc mỗi object = đáy giữa (z=0), mét, mặt tiền quay -Y (→ +Z sau export glTF).
Chạy: blender -b --python gen_noi_that.py -- --out <path.glb>
"""
import math
import random
import sys

import bpy
import numpy as np
from mathutils import Vector

# ---------------------------------------------------------------- argv
OUT = None
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
it = iter(argv)
for a in it:
    if a == "--out":
        OUT = next(it)
if not OUT:
    raise SystemExit("thiếu --out <path.glb>")

RAD = math.radians
D2R = lambda d: d * math.pi / 180.0

# ---------------------------------------------------------------- scene
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 1.0

# ---------------------------------------------------------------- materials
MATS = {}

def mat(name, color, metallic=0.0, rough=0.6, emit=None, strength=0.0):
    if name in MATS:
        return MATS[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = None
    for n in m.node_tree.nodes:
        if n.type == 'BSDF_PRINCIPLED':
            bsdf = n
            break
    bsdf.inputs['Base Color'].default_value = (*color, 1.0)
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = rough
    if emit is not None:
        for key in ('Emission Color', 'Emission'):
            if key in bsdf.inputs:
                bsdf.inputs[key].default_value = (*emit, 1.0)
                break
        if 'Emission Strength' in bsdf.inputs:
            bsdf.inputs['Emission Strength'].default_value = strength
    m.use_backface_culling = False
    MATS[name] = m
    return m

def hexc(h):
    return tuple(int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4))

GO_DEN   = mat('go_den',   hexc('1f1a14'), rough=0.35)               # án thư sơn đen sẫm
GO_DO    = mat('go_do',    hexc('6e1f1f'), rough=0.5)                # khung bình phong đỏ
GO_NAU   = mat('go_nau',   hexc('7c5a3a'), rough=0.6)                # khay/giá cuộn thư
DONG     = mat('dong',     hexc('8a6a2f'), metallic=0.9, rough=0.35) # đồng
VANG     = mat('vang_khac', hexc('d4af37'), metallic=1.0, rough=0.25) # vàng khảm
MEN_DEN  = mat('men_den',  hexc('17161a'), rough=0.55)               # nghiên mực
TRE      = mat('tre',      hexc('9c8a4d'), rough=0.7)                # ống tre/đèn
GIAY     = mat('giay',     hexc('d9cba8'), rough=0.8)                # thẻ sách/cuộn thư
SON_DO   = mat('son_do',   hexc('a52a22'), rough=0.4)                # ấn triện
VAI_NAU  = mat('vai_nau',  hexc('8a5a33'), rough=0.95)               # bồ đoàn
DA_XAM   = mat('da_xam',   hexc('7d7f78'), rough=0.9)                # đá
DA_TOI   = mat('da_toi',   hexc('5f615c'), rough=0.9)
HAC_TRANG= mat('hac_trang', hexc('e8e4da'), rough=0.6)
HAC_DEN  = mat('hac_den',  hexc('2a2622'), rough=0.5)
EMIT_KHOI= mat('emit_khoi', hexc('ffb35c'), emit=hexc('ffb35c'), strength=3.5)  # lỗ lư
EMIT_DEN = mat('emit_den', hexc('ffd27a'), rough=0.6, emit=hexc('ffd27a'), strength=2.2)  # lụa đèn

# ---------------------------------------------------------------- helpers
def sel(objs, active=0):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[active]
    return objs[active]

def apply_tf(o):
    sel([o])
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

def smooth(o):
    sel([o])
    bpy.ops.object.shade_smooth()

def flat(o):
    sel([o])
    bpy.ops.object.shade_flat()

def _mk(op, name, loc, rot, **kw):
    op(location=loc, rotation=rot, **kw)
    o = bpy.context.active_object
    o.name = name
    return o

def box(name, size, loc, rot=(0, 0, 0), m=None):
    o = _mk(bpy.ops.mesh.primitive_cube_add, name, loc, rot, size=1.0)
    o.scale = size
    o.data.materials.append(m or GO_DEN)
    apply_tf(o)
    return o

def cyl(name, r, depth, loc, rot=(0, 0, 0), verts=16, m=None, fill='NGON'):
    o = _mk(bpy.ops.mesh.primitive_cylinder_add, name, loc, rot,
            vertices=verts, radius=r, depth=depth, end_fill_type=fill)
    o.data.materials.append(m or GO_DEN)
    apply_tf(o)
    return o

def sph(name, r, loc, scale=(1, 1, 1), seg=16, rings=12, m=None):
    o = _mk(bpy.ops.mesh.primitive_uv_sphere_add, name, loc, (0, 0, 0),
            segments=seg, ring_count=rings, radius=r)
    o.scale = scale
    o.data.materials.append(m or GO_DEN)
    apply_tf(o)
    smooth(o)
    return o

def cone(name, r1, r2, depth, loc, rot=(0, 0, 0), verts=24, m=None):
    o = _mk(bpy.ops.mesh.primitive_cone_add, name, loc, rot,
            vertices=verts, radius1=r1, radius2=r2, depth=depth,
            end_fill_type='NGON')
    o.data.materials.append(m or GO_DEN)
    apply_tf(o)
    smooth(o)
    return o

def torus(name, mR, mr, loc, rot=(0, 0, 0), mseg=48, rseg=6, m=None):
    o = _mk(bpy.ops.mesh.primitive_torus_add, name, loc, rot,
            major_radius=mR, minor_radius=mr,
            major_segments=mseg, minor_segments=rseg)
    o.data.materials.append(m or DONG)
    apply_tf(o)
    smooth(o)
    return o

def grid(name, size, loc, rot, xdiv, ydiv, m=None):
    o = _mk(bpy.ops.mesh.primitive_grid_add, name, loc, rot,
            x_subdivisions=xdiv, y_subdivisions=ydiv, size=size)
    o.data.materials.append(m or GO_DEN)
    apply_tf(o)
    return o

def circle(name, r, loc, quat, verts=8, m=None):
    o = _mk(bpy.ops.mesh.primitive_circle_add, name, loc,
            (0, 0, 0), vertices=verts, radius=r, fill_type='NGON')
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = quat
    o.data.materials.append(m or EMIT_KHOI)
    apply_tf(o)
    return o

def ico(name, r, loc, sub=3, m=None):
    o = _mk(bpy.ops.mesh.primitive_ico_sphere_add, name, loc, (0, 0, 0),
            subdivisions=sub, radius=r)
    o.data.materials.append(m or DA_XAM)
    apply_tf(o)
    return o

def subdivide(o, cuts):
    sel([o])
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.subdivide(number_cuts=cuts, smoothness=0.0)
    bpy.ops.object.mode_set(mode='OBJECT')
    return o

def bend_z(o, fn):
    """fn(v) -> (dx, dy) theo chiều cao z của vertex."""
    for v in o.data.vertices:
        dx, dy = fn(v.co)
        v.co.x += dx
        v.co.y += dy
    return o

def tris(o):
    return sum(len(p.vertices) - 2 for p in o.data.polygons)

def finish(parts, coll_name, pivot, z=0.0):
    o = sel(list(parts))
    bpy.ops.object.join()
    o.name = coll_name.lower()
    o.data.name = o.name  # mesh datablock đặt tên rõ theo đạo cụ
    col = bpy.data.collections.new(coll_name)
    scene.collection.children.link(col)
    col.objects.link(o)
    for c in list(o.users_collection):
        if c is not col:
            c.objects.unlink(o)
    scene.cursor.location = (pivot[0], pivot[1], z)
    sel([o])
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR', center='MEDIAN')
    return o

# ---------------------------------------------------------------- canvas 512
def _new_img(name, rgb):
    S = 512
    arr = np.concatenate([rgb, np.ones((S, S, 1), np.float32)], axis=2)
    arr = np.ascontiguousarray(arr, dtype=np.float32)
    img = bpy.data.images.new(name, S, S, alpha=True, float_buffer=False)
    img.pixels = arr.ravel()
    try:
        img.colorspace_settings.name = 'sRGB'
    except Exception:
        pass
    img.use_fake_user = True
    return img

def canvas_rong():
    """Rồng vàng trên lụa đỏ đậm."""
    S = 512
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
    u, v = xx / S, yy / S
    base = np.zeros((S, S, 3), np.float32)
    base[..., 0] = 0.30 + 0.04 * np.sin(2 * np.pi * (u * 3 + v * 3)) + 0.02 * np.sin(2 * np.pi * v * 6)
    base[..., 1] = 0.075 + 0.015 * np.sin(2 * np.pi * u * 4)
    base[..., 2] = 0.08
    gold = np.array([0.84, 0.64, 0.24], np.float32)
    # thân rồng: polyline sin
    ts = np.linspace(0, 1, 240)
    cx = 0.50 + 0.33 * np.sin(2 * np.pi * ts * 0.9 + 0.8)
    cy = 0.12 + 0.66 * ts
    d = np.full((S, S), 1e9, np.float32)
    for t, x0, y0 in zip(ts, cx, cy):
        d = np.minimum(d, np.hypot(u - x0, (v - y0) * 2.0))
    mask = d < (0.055 - 0.02 * np.abs(np.sin(np.pi * ts[-1])))  # thân ~0.05
    mask = d < 0.050
    # đầu
    mask |= np.hypot(u - 0.70, (v - 0.86) * 1.5) < 0.088
    # hàm/mõm
    mask |= ((u > 0.70) & (u < 0.84) & (np.abs(v - 0.82) < 0.022))
    # râu
    for a in (0.86, 0.83):
        t2 = np.linspace(0, 1, 40)
        dmin = np.full((S, S), 1e9, np.float32)
        for x0, y0 in zip(0.72 + 0.10 * t2, a - 0.10 * t2):
            dmin = np.minimum(dmin, np.hypot(u - x0, v - y0))
        mask |= dmin < 0.008
    # vuốt (2 cụm, 3 nét)
    for (gx, gy) in [(0.32, 0.30), (0.68, 0.55)]:
        for k in (-1, 0, 1):
            t3 = np.linspace(0, 1, 20)
            dmin = np.full((S, S), 1e9, np.float32)
            for x0, y0 in zip(gx + 0.02 * t3 * k, gy + 0.07 * t3):
                dmin = np.minimum(dmin, np.hypot(u - x0, v - y0))
            mask |= dmin < 0.009
    # vảy chấm
    scale_dots = (np.sin(u * 160) * np.sin(v * 160) > 0.86) & (d < 0.05)
    base = np.where(mask[..., None], gold[None, None, :], base)
    base = np.where(scale_dots[..., None], gold[None, None, :] * 0.72, base)
    # mắt đen
    base = np.where((np.hypot(u - 0.735, (v - 0.875) * 1.5) < 0.013)[..., None],
                    np.array([0.08, 0.06, 0.05], np.float32)[None, None, :], base)
    # ngọc
    dp = np.hypot(u - 0.24, (v - 0.88) * 1.2)
    base += np.clip(0.55 - dp * 5.0, 0, 1)[..., None] * np.array([0.5, 0.4, 0.12], np.float32)
    base = np.where((dp < 0.042)[..., None], np.array([1.0, 0.92, 0.62], np.float32)[None, None, :], base)
    # dải viền vàng
    edge = (u < 0.055) | (u > 0.945) | (v < 0.05) | (v > 0.95)
    base = np.where(edge[..., None], np.array([0.52, 0.40, 0.15], np.float32)[None, None, :], base)
    return _new_img('lua_rong_vang', np.clip(base, 0, 1))

def canvas_sonthuy():
    """Sơn thủy xanh nhạt: núi tầng, mây đai, mặt trời, triện đỏ."""
    S = 512
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
    u, v = xx / S, yy / S
    rng = np.random.RandomState(11)
    base = np.stack([np.full_like(u, 0.83), np.full_like(u, 0.88), np.full_like(u, 0.90)], -1)
    base += (rng.rand(S, S)[..., None] - 0.5) * 0.05
    layers = [(0.20, 0.10, 1.2, 0.3, (0.58, 0.70, 0.74)),
              (0.10, 0.12, 1.9, 2.1, (0.44, 0.59, 0.64)),
              (0.02, 0.09, 2.8, 4.0, (0.31, 0.45, 0.51))]
    for b, a, f, p, c in layers:
        m = b + a * (np.sin(2 * np.pi * f * u + p) + 0.5 * np.sin(2 * np.pi * 2.3 * f * u + p * 1.7))
        inside = v > m
        fade = np.clip(1.0 - (v - m) * 2.0, 0.35, 1.0)[..., None]
        col = np.array(c, np.float32)[None, None, :] * fade
        base = np.where(inside[..., None], col, base)
    for vm in (0.32, 0.54, 0.73):
        band = np.exp(-((v - vm) / 0.022) ** 2)[..., None]
        mist = np.array([0.94, 0.96, 0.96], np.float32)[None, None, :]
        base = base * (1 - 0.75 * band) + mist * 0.75 * band
    ds = np.hypot(u - 0.80, v - 0.82)
    base = np.where((ds < 0.05)[..., None], np.array([0.95, 0.86, 0.63], np.float32)[None, None, :], base)
    for (bx, by) in [(0.30, 0.23), (0.365, 0.235)]:   # thuyền + bóng
        base = np.where((np.hypot(u - bx, (v - by) * 0.6) < 0.012)[..., None],
                        np.array([0.18, 0.23, 0.27], np.float32)[None, None, :], base)
    for (mx, my) in [(0.22, 0.62), (0.28, 0.66), (0.34, 0.63)]:  # chim
        base = np.where((np.hypot(u - mx, v - my) < 0.006)[..., None],
                        np.array([0.25, 0.30, 0.34], np.float32)[None, None, :], base)
    seal = (u > 0.85) & (u < 0.95) & (v > 0.03) & (v < 0.13)
    base = np.where(seal[..., None], np.array([0.72, 0.20, 0.16], np.float32)[None, None, :], base)
    edge = (u < 0.03) | (u > 0.97) | (v < 0.03) | (v > 0.97)
    base = np.where(edge[..., None], np.array([0.62, 0.55, 0.40], np.float32)[None, None, :], base)
    return _new_img('lua_son_thuy', np.clip(base, 0, 1))

def silk_mat(name, img):
    m = mat(name, (0.8, 0.75, 0.7), rough=0.85)
    bsdf = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    tex = m.node_tree.nodes.new('ShaderNodeTexImage')
    tex.image = img
    m.node_tree.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    return m

LUA_RONG = silk_mat('lua_rong', canvas_rong())
LUA_SONTHUY = silk_mat('lua_son_thuy', canvas_sonthuy())

# ---------------------------------------------------------------- 1) ÁN THƯ
def build_an_thu(sx, sy):
    p = []
    W, D, H = 2.2, 0.7, 1.05
    top = box('at_top', (W, 0.08, D), (sx, sy, H - 0.04))
    p.append(top)
    for dx in (-1, 1):
        for dy in (-1, 1):
            p.append(box('at_leg', (0.09, 0.09, H - 0.08),
                         (sx + dx * (W / 2 - 0.10), sy + dy * (D / 2 - 0.09), (H - 0.08) / 2)))
    for dy in (-1, 1):  # xà trước/sau
        p.append(box('at_xa', (W - 0.34, 0.045, 0.26),
                     (sx, sy + dy * (D / 2 - 0.075), H - 0.08 - 0.13)))
    for dx in (-1, 1):  # xà hai bên
        p.append(box('at_xab', (0.045, D - 0.22, 0.24),
                     (sx + dx * (W / 2 - 0.10), sy, H - 0.08 - 0.13)))
    z = H  # mặt bàn
    # nghiên mực đen (có ao mực)
    p.append(box('at_nghien', (0.34, 0.22, 0.045), (sx - 0.55, sy - 0.08, z + 0.0225), m=MEN_DEN))
    p.append(box('at_ao', (0.15, 0.11, 0.03), (sx - 0.60, sy - 0.10, z + 0.045), m=MEN_DEN))
    # ống tre + bút cắm
    p.append(cyl('at_ongtre', 0.034, 0.13, (sx + 0.62, sy - 0.10, z + 0.065), verts=12, m=TRE))
    p.append(cyl('at_but', 0.008, 0.26, (sx + 0.62, sy - 0.10, z + 0.13 + 0.06), verts=8, m=GIAY))
    p.append(cone('at_butgoi', 0.008, 0.0, 0.03, (sx + 0.62, sy - 0.10, z + 0.29), verts=8, m=HAC_DEN))
    # thẻ sách (2 lá tựa nghiêng)
    for k, dx in enumerate((-0.18, -0.10)):
        p.append(box('at_the', (0.02, 0.15, 0.22),
                     (sx + dx, sy + 0.14, z + 0.10), rot=(D2R(-9.0), 0, 0), m=GIAY))
    # ấn triện vuông đỏ
    p.append(box('at_an', (0.07, 0.07, 0.07), (sx - 0.95, sy + 0.12, z + 0.035), m=SON_DO))
    p.append(box('at_ancanh', (0.03, 0.03, 0.02), (sx - 0.95, sy + 0.12, z + 0.08), m=SON_DO))
    # trấn chỉ đồng (thanh tròn nằm ngang)
    p.append(cyl('at_tranchi', 0.018, 0.20, (sx + 0.10, sy + 0.16, z + 0.018),
                 rot=(0, D2R(90), 0), verts=10, m=DONG))
    return finish(p, 'NT_AnThu', (sx, sy))

# ---------------------------------------------------------------- 2) LƯ BẠC SƠN
def build_lu(sx, sy):
    p = []
    cz = 0.78
    body = sph('lu_than', 0.40, (sx, sy, cz), scale=(1.0, 1.0, 0.92), seg=28, rings=16, m=DONG)
    p.append(body)
    # dải vàng khảm quanh eo
    p.append(cyl('lu_vang', 0.383, 0.06, (sx, sy, 0.60), verts=28, m=VANG))
    # cổ + nón núi
    p.append(cyl('lu_co', 0.30, 0.07, (sx, sy, 1.10), verts=28, m=DONG))
    lid = cone('lu_non', 0.28, 0.02, 0.30, (sx, sy, 1.13 + 0.15), verts=28, m=DONG)
    p.append(lid)
    p.append(cyl('lu_dinh', 0.02, 0.05, (sx, sy, 1.28 + 0.02), verts=10, m=VANG))
    # 3 hàng lỗ phát sáng trên nón
    zbase, h = 1.13, 0.30
    for t, n, r in ((0.28, 8, 0.020), (0.56, 10, 0.017), (0.84, 6, 0.013)):
        zc = zbase + h * t
        rc = 0.28 + (0.02 - 0.28) * t
        slope = math.atan2(0.28 - 0.02, h)
        for i in range(n):
            th = 2 * math.pi * i / n + (0.3 if t > 0.5 else 0.0)
            nrm = Vector((math.cos(th) * math.cos(slope), math.sin(th) * math.cos(slope), math.sin(slope)))
            q = Vector((0, 0, 1)).rotation_difference(nrm)
            loc = (sx + math.cos(th) * (rc + 0.004), sy + math.sin(th) * (rc + 0.004), zc)
            p.append(circle('lu_lo', r, loc, q, verts=8, m=EMIT_KHOI))
    # 3 chân co (S-bend ra ngoài)
    for i in range(3):
        th = 2 * math.pi * i / 3 + 0.5
        leg = cyl('lu_chan', 0.030, 0.62, (sx + math.cos(th) * 0.30, sy + math.sin(th) * 0.30, 0.31),
                  verts=10, m=DONG)
        subdivide(leg, 5)
        bend_z(leg, lambda co, th=th: _leg_splay(co, th))
        smooth(leg)
        p.append(leg)
        p.append(box('lu_chanchan', (0.11, 0.07, 0.025),
                     (sx + math.cos(th) * 0.435, sy + math.sin(th) * 0.435, 0.0125), m=DONG))
    return finish(p, 'NT_LuBacSon', (sx, sy))

def _leg_splay(co, th):
    """chân cong chữ S xòe ra: gốc trên r0.30 → chậu dưới r0.435."""
    t = max(0.0, min(1.0, (0.62 - co.z) / 0.62))
    r0 = math.hypot(co.x, co.y)
    if r0 < 1e-4:
        return (0.0, 0.0)
    r_new = 0.30 + 0.135 * t + 0.035 * math.sin(math.pi * t)
    a = math.atan2(co.y, co.x)
    return (math.cos(a) * (r_new - r0), math.sin(a) * (r_new - r0))

# ---------------------------------------------------------------- 3) BÌNH PHONG
BP_W, BP_H, BP_ANG = 0.52, 2.2, D2R(20.0)

def bp_panels(sx, sy):
    """[(center_x, center_y, yaw), ...] 6 cánh so-le."""
    out, hx, hy = [], sx - BP_W * math.cos(BP_ANG) * 3.0, sy
    for i in range(6):
        yaw = BP_ANG if i % 2 == 0 else -BP_ANG
        dx, dy = math.cos(yaw) * BP_W / 2, math.sin(yaw) * BP_W / 2
        out.append((hx + dx, hy + dy, yaw))
        hx += math.cos(yaw) * BP_W
        hy += math.sin(yaw) * BP_W
    cx = sum(c[0] for c in out) / 6.0
    cy = sum(c[1] for c in out) / 6.0
    return [(x - (cx - sx), y - (cy - sy), yaw) for (x, y, yaw) in out]

def build_bp_khung(sx, sy):
    p = []
    for (x, y, yaw) in bp_panels(sx, sy):
        rot = (D2R(90), 0, yaw)  # dựng đứng, mặt quay -Y
        for dx in (-1, 1):
            p.append(box('bp_trai', (0.055, BP_H, 0.06),
                         (x + dx * math.cos(yaw) * (BP_W / 2 - 0.0275),
                          y + dx * math.sin(yaw) * (BP_W / 2 - 0.0275), BP_H / 2),
                         rot=rot, m=GO_DO))
        for dy, hh in ((BP_H - 0.035, 0.07), (0.035, 0.07), (0.62, 0.05)):  # trện trên/dưới/giữa
            p.append(box('bp_truyen', (BP_W, hh, 0.06), (x, y, dy), rot=rot, m=GO_DO))
        # ván gỗ phần dưới
        p.append(box('bp_van', (BP_W - 0.11, 1.16, 0.028), (x, y, 0.62), rot=rot, m=GO_DO))
        # chân
        for dx in (-1, 1):
            p.append(box('bp_chan', (0.10, 0.09, 0.06),
                         (x + dx * math.cos(yaw) * (BP_W / 2 - 0.05),
                          y + dx * math.sin(yaw) * (BP_W / 2 - 0.05), 0.03), rot=rot, m=GO_DO))
    # bản lề tròn đồng giữa các cánh
    pts = bp_panels(sx, sy)
    for i in range(5):
        (x0, y0, yaw0) = pts[i]
        hx = x0 + math.cos(yaw0) * (BP_W / 2)
        hy = y0 + math.sin(yaw0) * (BP_W / 2)
        for zz in (0.35, 1.35, 1.85):
            p.append(cyl('bp_banle', 0.022, 0.075, (hx, hy, zz),
                         rot=(math.pi / 2 - yaw0, 0, 0), verts=10, m=VANG))
    return finish(p, 'NT_BinhPhongKhung', (sx, sy))

def build_bp_lua(sx, sy, m, coll, tag):
    p = []
    for (x, y, yaw) in bp_panels(sx, sy):
        g = grid('bp_lua', 1.0, (x, y, 1.36), (D2R(90), 0, yaw), 4, 8, m=m)
        g.scale = (BP_W - 0.115, 1.44, 1.0)
        apply_tf(g)
        # phồng nhẹ như vải lụa
        for v in g.data.vertices:
            tx = v.co.x / (BP_W - 0.115) + 0.5
            ty = v.co.y / 1.44 + 0.5
            v.co.z += 0.018 * math.sin(math.pi * tx) * math.sin(math.pi * ty)
        smooth(g)
        p.append(g)
    o = finish(p, coll, (sx, sy))
    # biến thể thứ 2 để lệch sang trái cho dễ chọn
    if tag == 'B':
        o.location.x -= 1.30
    return o

# ---------------------------------------------------------------- 4) QUAN TINH
def build_quan_tinh(sx, sy):
    p = []
    # bàn đá 8 cạnh
    p.append(cyl('qt_db', 0.62, 0.12, (sx, sy, 0.06), verts=8, m=DA_TOI))
    shaft = cyl('qt_than', 0.42, 0.58, (sx, sy, 0.12 + 0.29), verts=8, m=DA_XAM)
    p.append(shaft)
    p.append(cyl('qt_cap', 0.55, 0.10, (sx, sy, 0.75), verts=8, m=DA_TOI))
    # trụ đỡ
    cz = 1.78
    p.append(box('qt_post', (0.07, 0.07, cz - 0.80), (sx, sy, 0.80 + (cz - 0.80) / 2), m=DA_XAM))
    TILT = D2R(23.5)
    for mR, own in ((0.90, (D2R(90), 0, 0)),          # túc kinh (đứng, hướng -Y)
                    (0.68, (0.0, 0.0, 0.0)),          # xích đạo (nằm)
                    (0.46, (D2R(90), 0, D2R(42))),    # hoàng đạo
                    (0.24, (D2R(90), 0, D2R(78)))):   # vòng trong
        rot = (own[0] + TILT, own[1], own[2])
        p.append(torus('qt_vong', mR, 0.026, (sx, sy, cz), rot=rot, mseg=44, rseg=6, m=DONG))
    axis = cyl('qt_truc', 0.024, 2.02, (sx, sy, cz), rot=(TILT, 0, 0), verts=10, m=VANG)
    p.append(axis)
    for dz in (-0.86, 0.86):
        ax = math.sin(TILT) * (-dz)
        az = math.cos(TILT) * dz
        p.append(sph('qt_cuctruc', 0.045, (sx + ax, sy, cz + az), seg=10, rings=8, m=VANG))
    p.append(sph('qt_tam', 0.075, (sx, sy, cz), seg=14, rings=10, m=VANG))
    return finish(p, 'NT_QuanTinh', (sx, sy))

# ---------------------------------------------------------------- 5) BỒ ĐOÀN
def build_bo_doan(sx, sy):
    p = []
    p.append(cyl('bd_than', 0.30, 0.06, (sx, sy, 0.03), verts=20, m=VAI_NAU))
    p.append(sph('bd_mui', 0.30, (sx, sy, 0.06), scale=(1.0, 1.0, 0.30), seg=20, rings=10, m=VAI_NAU))
    p.append(torus('bd_gane', 0.295, 0.012, (sx, sy, 0.06), mseg=24, rseg=4, m=VAI_NAU))
    o = finish(p, 'NT_BoDoan', (sx, sy))
    offs = [(0, 0), (0.8, 0), (1.6, 0), (0, 0.85), (0.8, 0.85), (1.6, 0.85)]
    sel([o])
    bpy.ops.object.duplicate(linked=True)
    d1 = bpy.context.active_object
    d1.location.xy = (sx + 0.8, sy)
    sel([o])
    bpy.ops.object.duplicate(linked=True)
    d2 = bpy.context.active_object
    d2.location.xy = (sx + 1.6, sy)
    sel([o])
    bpy.ops.object.duplicate(linked=True)
    d3 = bpy.context.active_object
    d3.location.xy = (sx, sy + 0.85)
    sel([o])
    bpy.ops.object.duplicate(linked=True)
    d4 = bpy.context.active_object
    d4.location.xy = (sx + 0.8, sy + 0.85)
    sel([o])
    bpy.ops.object.duplicate(linked=True)
    d5 = bpy.context.active_object
    d5.location.xy = (sx + 1.6, sy + 0.85)
    for nm, d in (('bd_1', d1), ('bd_2', d2), ('bd_3', d3), ('bd_4', d4), ('bd_5', d5)):
        d.name = nm
    return o

# ---------------------------------------------------------------- 6) HẠC ĐỒNG
def _crane_parts(sx, sy, wave):
    p = []
    p.append(sph('hc_than', 0.17, (sx, sy + 0.02, 0.80), scale=(0.95, 1.35, 0.80), seg=16, rings=12, m=HAC_TRANG))
    for dx in (-1, 1):
        p.append(sph('hc_canh', 0.13, (sx + dx * 0.145, sy + 0.02, 0.82),
                     scale=(0.34, 1.15, 0.72), seg=10, rings=8, m=HAC_TRANG))
    for k in (-1, 0, 1):  # đuôi lông
        p.append(box('hc_duoi', (0.045, 0.17, 0.012),
                     (sx + k * 0.05, sy + 0.26, 0.86), rot=(D2R(28), 0, k * D2R(16)), m=HAC_TRANG))
    # cổ cong ra trước
    neck = cyl('hc_co', 0.032, 0.34, (sx, sy + 0.155, 0.80 + 0.17), verts=10, m=HAC_TRANG)
    subdivide(neck, 4)
    z0 = 0.97 - 0.17
    def _bend(co):
        t = (co.z - 0.80) / 0.34
        return (0.0, 0.055 * math.sin(math.pi * t))
    bend_z(neck, _bend)
    smooth(neck)
    p.append(neck)
    hy = sy + 0.155 + 0.055 * math.sin(math.pi * 0.99)
    p.append(sph('hc_dau', 0.055, (sx, hy, 1.12), seg=14, rings=10, m=HAC_TRANG))
    p.append(cone('hc_mo', 0.022, 0.001, 0.13, (sx, hy - 0.09, 1.11), rot=(D2R(90), 0, 0), verts=10, m=HAC_DEN))
    p.append(sph('hc_dinh', 0.026, (sx, hy + 0.01, 1.165), scale=(1, 1, 0.6), seg=10, rings=8, m=SON_DO))
    # chân
    def foot(x, y, z=0.0125):
        p.append(box('hc_chan', (0.10, 0.05, 0.025), (x, y, z), m=HAC_DEN))
    leg_l = cyl('hc_chantrai', 0.017, 0.63, (sx - 0.06, sy - 0.02, 0.315), verts=8, m=HAC_DEN)
    subdivide(leg_l, 3)
    bend_z(leg_l, lambda co: (0.0, 0.02 * math.sin(math.pi * (1 - co.z / 0.63))))
    p.append(leg_l)
    foot(sx - 0.06, sy - 0.02)
    if not wave:
        leg_r = cyl('hac_chanphai', 0.017, 0.63, (sx + 0.06, sy - 0.02, 0.315), verts=8, m=HAC_DEN)
        subdivide(leg_r, 3)
        bend_z(leg_r, lambda co: (0.0, 0.02 * math.sin(math.pi * (1 - co.z / 0.63))))
        p.append(leg_r)
        foot(sx + 0.06, sy - 0.02)
    else:  # chân vẫy: đùi giơ lên trước, cẳng gập ngược
        p.append(cyl('hac_daivay', 0.019, 0.30, (sx + 0.06, sy + 0.08, 0.50),
                     rot=(D2R(32), 0, 0), verts=8, m=HAC_DEN))
        p.append(cyl('hac_ca', 0.016, 0.26, (sx + 0.065, sy + 0.145, 0.335),
                     rot=(D2R(115), 0, 0), verts=8, m=HAC_DEN))
        p.append(box('hac_chanvay', (0.09, 0.045, 0.022), (sx + 0.075, sy + 0.05, 0.235),
                     rot=(D2R(25), 0, 0), m=HAC_DEN))
    return p

def build_hac(sx, sy):
    o1 = finish(_crane_parts(sx - 0.35, sy, wave=False), 'NT_HacDung', (sx - 0.35, sy))
    o2 = finish(_crane_parts(sx + 0.35, sy, wave=True), 'NT_HacVay', (sx + 0.35, sy))
    return o1, o2

# ---------------------------------------------------------------- 7) ĐÈN LỒNG
def build_den(sx, sy):
    p = []
    p.append(cyl('dn_day', 0.30, 0.06, (sx, sy, 0.29), verts=20, m=GO_DEN))
    silk = cyl('dn_lua', 0.35, 0.50, (sx, sy, 0.57), verts=20, m=EMIT_DEN, fill='NOTHING')
    subdivide(silk, 3)
    for v in silk.data.vertices:
        t = (v.co.z - 0.32) / 0.50
        r0 = math.hypot(v.co.x, v.co.y)
        if r0 < 1e-4:
            continue
        r_new = 0.35 + 0.055 * math.sin(math.pi * t)
        a = math.atan2(v.co.y, v.co.x)
        v.co.x = math.cos(a) * r_new
        v.co.y = math.sin(a) * r_new
    smooth(silk)
    p.append(silk)
    for i in range(5):  # nan tre dọc
        th = 2 * math.pi * i / 5 + 0.3
        p.append(box('dn_nan', (0.012, 0.52, 0.018),
                     (sx + math.cos(th) * 0.348, sy + math.sin(th) * 0.348, 0.57),
                     rot=(0, 0, th), m=TRE))
    p.append(cyl('dn_cap', 0.30, 0.06, (sx, sy, 0.85), verts=20, m=GO_DEN))
    p.append(cone('dn_mai', 0.31, 0.01, 0.11, (sx, sy, 0.935), verts=20, m=GO_DEN))
    p.append(cyl('dn_dinh', 0.014, 0.09, (sx, sy, 0.985), verts=8, m=VANG))
    # tua đỏ
    p.append(cyl('dn_daytua', 0.008, 0.10, (sx, sy, 0.21), verts=6, m=SON_DO))
    p.append(sph('dn_kenutua', 0.026, (sx, sy, 0.145), seg=10, rings=8, m=SON_DO))
    p.append(cone('dn_tua', 0.036, 0.001, 0.13, (sx, sy, 0.075), rot=(math.pi, 0, 0), verts=12, m=SON_DO))
    o = finish(p, 'NT_DenLong', (sx, sy))
    for s, dx, nm in ((0.571, -0.85, 'nt_den_long_nho'), (0.786, 0.0, 'nt_den_long_vua')):
        sel([o])
        bpy.ops.object.duplicate(linked=True)
        d = bpy.context.active_object
        d.name = nm
        d.location.x += dx
        d.scale = (s, s, s)
    o.name = 'nt_den_long_lon'
    return o

# ---------------------------------------------------------------- 8) THÁI HỒ THẠCH
def build_that_thach(sx, sy):
    p = []
    rnd = random.Random(7)
    rock = ico('tt_dada', 0.25, (sx, sy, 0.66), sub=3, m=DA_XAM)
    cache = {}
    dents = [(0.9, 0.1, 0.4), (-0.6, 0.7, 0.35), (0.2, -0.9, 0.38)]
    for v in rock.data.vertices:
        key = (round(v.co.x, 3), round(v.co.y, 3), round(v.co.z, 3))
        if key not in cache:
            cache[key] = 1.0 + (rnd.random() - 0.5) * 0.42
            d = Vector(v.co).normalized()
            for (dx_, dy_, dz_) in dents:
                dent_dir = Vector((dx_, dy_, dz_)).normalized()
                if d.dot(dent_dir) > 0.955:
                    cache[key] -= 0.22
        v.co *= cache[key]
        v.co.y *= 0.86
        v.co.z *= 1.18
        if v.co.z < -0.24:  # đáy bằng phẳng ngồi lên chõ
            v.co.z = -0.24
    for v in rock.data.vertices:
        v.co.z += 0.066
    smooth(rock)
    p.append(rock)
    # chõ chân 3 nhánh sóng
    p.append(cyl('tt_dai', 0.27, 0.04, (sx, sy, 0.02), verts=20, m=GO_DEN))
    for i in range(3):
        th = 2 * math.pi * i / 3 + 0.35
        leg = cyl('tt_nhanh', 0.018, 0.50, (sx + math.cos(th) * 0.17, sy + math.sin(th) * 0.17, 0.30),
                  verts=8, m=DONG)
        subdivide(leg, 5)
        def _wave(co, th=th):
            t = co.z / 0.52
            r0 = math.hypot(co.x - sx, co.y - sy)
            if r0 < 1e-4:
                return (0.0, 0.0)
            r_new = 0.10 + 0.075 * t + 0.05 * math.sin(math.pi * t)
            a = math.atan2(co.y - sy, co.x - sx)
            dr = r_new - r0
            return (math.cos(a) * dr, math.sin(a) * dr)
        bend_z(leg, _wave)
        smooth(leg)
        p.append(leg)
    p.append(torus('tt_vong', 0.155, 0.014, (sx, sy, 0.56), mseg=24, rseg=5, m=DONG))
    return finish(p, 'NT_ThatThach', (sx, sy))

# ---------------------------------------------------------------- 9) KHAY QUỲ + GIÁ CUỘN THƯ
def build_khay_gia(sx, sy):
    p = []
    # khay quỳ (mặt cắm khay + viền)
    p.append(box('kg_khayday', (0.52, 0.36, 0.02), (sx - 0.35, sy, 0.045), m=GO_NAU))
    for sgn in (-1, 1):
        p.append(box('kg_khayviencd', (0.52, 0.025, 0.05), (sx - 0.35, sy + sgn * 0.168, 0.055), m=GO_NAU))
        p.append(box('kg_khayvienct', (0.025, 0.36, 0.05), (sx - 0.35 + sgn * 0.248, sy, 0.055), m=GO_NAU))
    for dx in (-1, 1):
        for dy in (-1, 1):
            p.append(box('kg_khaychan', (0.05, 0.05, 0.035),
                         (sx - 0.35 + dx * 0.20, sy + dy * 0.13, 0.0175), m=GO_NAU))
    # giá cuộn thư (2 trụ chữ A + 3 lược ngang + cuộn)
    gx = sx + 0.42
    p.append(box('kg_daitrai', (0.55, 0.11, 0.05), (gx, sy, 0.025), m=GO_NAU))
    for dx in (-1, 1):
        for sgn, zz in ((-1, 0.33), (1, 0.63)):
            p.append(box('kg_tru', (0.045, 0.045, 0.40),
                         (gx + dx * 0.26, sy, 0.22),
                         rot=(0, sgn * D2R(14), 0), m=GO_NAU))
        p.append(box('kg_trudoc', (0.05, 0.05, 0.66), (gx + dx * 0.265, sy, 0.36), m=GO_NAU))
    for zz, dxr in ((0.30, 0.235), (0.58, 0.265)):
        p.append(cyl('kg_luoc', 0.018, dxr * 2.0, (gx, sy, zz), rot=(0, D2R(90), 0), verts=8, m=GO_NAU))
    # cuộn thư nằm trên lược
    rnd = random.Random(3)
    rows = [(0.30, ((-0.06, 0), (0.07, 0.01))), (0.58, ((-0.08, 0), (0.02, 0), (0.11, 0.005)))]
    for zz, items in rows:
        for (dx, dy) in items:
            cx = gx + dx
            cy = sy + dy
            p.append(cyl('kg_cuon', 0.032, 0.46, (cx, cy, zz + 0.032), rot=(0, D2R(90), 0), verts=10, m=GIAY))
            for sgn in (-1, 1):
                p.append(cyl('kg_daucuon', 0.036, 0.035, (cx + sgn * 0.235, cy, zz + 0.032),
                             rot=(0, D2R(90), 0), verts=10, m=GO_NAU))
    return finish(p, 'NT_KhayGiaThu', (sx, sy))

# ---------------------------------------------------------------- build all
build_an_thu(0.0, 0.0)
build_lu(3.2, 0.0)
build_bp_khung(6.8, 0.0)
build_bp_lua(6.8, 0.0, LUA_RONG, 'NT_BinhPhongLuaRong', 'A')
build_bp_lua(6.8, 0.0, LUA_SONTHUY, 'NT_BinhPhongLuaSonThuy', 'B')
build_quan_tinh(11.0, 0.0)
build_bo_doan(14.0, 0.0)
build_hac(16.5, 0.0)
build_den(19.0, 0.0)
build_that_thach(21.5, 0.0)
build_khay_gia(23.5, 0.0)

# ---------------------------------------------------------------- budget guard
objs = [o for o in bpy.data.objects if o.type == 'MESH']
def mesh_tris_table():
    """tam giác theo mesh datablock thực dùng (mesh dùng chung tính 1 lần)."""
    t = {}
    for o in objs:
        if o.data not in t:
            t[o.data] = sum(len(p.vertices) - 2 for p in o.data.polygons)
    return t
table = mesh_tris_table()
total = sum(table.values())
print('tri budget before guard (unique meshes):', total)
guard = 0
while total > 21000 and guard < 6:
    big = max(objs, key=lambda o: table.get(o.data, 0))
    sel([big])
    mod = big.modifiers.new('guard', 'DECIMATE')
    mod.ratio = 0.9
    mod.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier='guard')
    table = mesh_tris_table()
    total = sum(table.values())
    guard += 1
    print('decimate pass', guard, '->', total)

# ---------------------------------------------------------------- report
per = sorted(((o.data.name, o.name, t) for o, t in ((o, table[o.data]) for o in objs)),
             key=lambda x: -x[2])
seen = set()
for mname, oname, t in per:
    if mname in seen:
        continue
    seen.add(mname)
    print(f'  {mname:32s} {t:6d}')
print('unique meshes used:', len(table), '| objects:', len(objs), '| total tris (unique):', total)
assert len(table) <= 12, f'quá 12 mesh: {len(table)}'

bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_apply=True)
print('EXPORTED', OUT)
