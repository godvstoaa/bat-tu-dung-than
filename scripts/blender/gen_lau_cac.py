# ============================================================================
#  BLENDER: gen_lau_cac.py — Lầu Các 3 tầng «Hoàng Hạc Lâu thu nhỏ» (id lau_cac)
#    Tháp 3 tầng vuông thu dần (T1 17×17 / T2 14,5×14,5 / T3 12×12, tính cả
#    hành lang bao 2 m), mỗi tầng: khung cửa liền bức 12 ô/cạnh (lưới gỗ #2a1712)
#    + MÁI riêng 4 mặt dốc ~30° cong vút riềm răng cưa + đỉnh chóp + Hồ lô.
#    Tổng 17×17×27 m (đài kiền 2,7 + 3×(sảnh 4,5 + mái 2,6) + chóp/hồ lô).
#    3 BIẾN THỂ bằng ĐỔI VẬT LIỆU lúc đặt, KHÔNG ra file riêng:
#      (a) quan tinh (mặc định): giấu mesh `mai_t3` → nóc T3 mở lộ bệ Ø5 đặt
#          armilla từ bộ noi_that; ngói xanh #2e6b6e (chất liệu `ngoi`)
#      (b) thư các: scale 0,8 → 13,6×13,6×21,6 + ngói sẫm #3a4448
#      (c) penthouse: ngói xanh ngọc (đề nghị #2ea88a)
#    Mesh: khoi_tang / mai / lan_can (+ mai_t3 tách riêng để giấu được nóc T3).
#  Chạy: blender -b --python scripts/blender/gen_lau_cac.py -- --out <path.glb>
#  In dòng 'GEN {json}' để script Node đọc. Chất liệu Principled BSDF, không texture.
# ============================================================================
import bpy, sys, json, math
import bmesh
from mathutils import Matrix

argv = sys.argv[sys.argv.index('--') + 1:]
OUT = argv[argv.index('--out') + 1] if '--out' in argv else 'lau_cac.glb'
TRIS_MAX = 45000  # ngân sách bản giữa

bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene
scn.unit_settings.system = 'METRIC'
scn.unit_settings.scale_length = 1.0

# ---------------- chất liệu (Principled BSDF, màu theo palette, không texture) ----
def rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)) + (1.0,)

def make_mat(name, color, rough=0.8, metal=0.0, emit=None, emit_k=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bs = m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value = rgb(color)
    bs.inputs['Roughness'].default_value = rough
    bs.inputs['Metallic'].default_value = metal
    if emit:
        for key in ('Emission Color', 'Emission'):
            if key in bs.inputs:
                bs.inputs[key].default_value = rgb(emit)
                break
        if 'Emission Strength' in bs.inputs:
            bs.inputs['Emission Strength'].default_value = emit_k
    return m

MATS = [
    make_mat('ngoi',          '#2e6b6e', rough=0.55),                              # ngói — ĐỔI MÀU theo biến thể
    make_mat('cot_do',        '#8e2323', rough=0.60),                              # cột đỏ
    make_mat('go_luoi',       '#2a1712', rough=0.85),                              # lưới gỗ mờ (khung cửa)
    make_mat('go_vien',       '#5a3c26', rough=0.80),                              # khung viền cửa gỗ
    make_mat('ngoc_trang',    '#e9e6dc', rough=0.30),                              # lan can ngọc trắng
    make_mat('da_kien',       '#8a8378', rough=0.90),                              # đài kiền đá / bệ
    make_mat('tuong',         '#6e3a2a', rough=0.85),                              # tường sau cửa
    make_mat('go_san',        '#7a5230', rough=0.85),                              # sàn ván hành lang
    make_mat('emissive_vang', '#d9b04a', rough=0.50, emit='#d9b04a', emit_k=1.8),   # dải xà vẽ giản lược
    make_mat('ho_lo',         '#c9a227', rough=0.35, metal=0.65),                   # hồ lô / chóp mạ vàng
]
MI = {m.name: i for i, m in enumerate(MATS)}

GROUPS = ['khoi_tang', 'mai', 'lan_can', 'mai_t3']  # mai_t3 giấu được → lộ sân nóc bệ Ø5
BM = {g: bmesh.new() for g in GROUPS}

# ---------------- helper hình học (ghi thẳng vào bmesh, toạ độ thế giới) ----------
def _tag(faces_from_verts, mi, smooth=False):
    for f in faces_from_verts:
        f.material_index = mi
        f.smooth = smooth

def _faces_of(verts):
    fs = set()
    for v in verts:
        fs.update(v.link_faces)
    return fs

def box_s(bm, mi, cx, cy, cz, sx, sy, sz, ang=0.0):
    """Hộp kích thước (sx,sy,sz) tâm (cx,cy,cz), quay ang quanh Z.
    create_cube(size=1) có đỉnh ±0,5 → scale bằng CHIỀU DÀI đầy đủ để được ±sx/2."""
    vs = bmesh.ops.create_cube(bm, size=1.0)['verts']
    M = (Matrix.Translation((cx, cy, cz)) @ Matrix.Rotation(ang, 4, 'Z')
         @ Matrix.Diagonal((sx, sy, sz, 1.0)))
    bmesh.ops.transform(bm, matrix=M, verts=vs)
    _tag(_faces_of(vs), mi)

def cyl_z(bm, mi, x, y, z0, z1, r, seg=8, smooth=True, caps=True):
    vs = bmesh.ops.create_cone(bm, cap_ends=caps, cap_tris=False, segments=seg,
                               radius1=r, radius2=r, depth=z1 - z0)['verts']
    bmesh.ops.transform(bm, matrix=Matrix.Translation((x, y, (z0 + z1) / 2)), verts=vs)
    _tag(_faces_of(vs), mi, smooth)

def sphere(bm, mi, c, rx, ry, rz, seg=16, ring=10):
    vs = bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=ring, radius=1.0)['verts']
    M = Matrix.Translation(c) @ Matrix.Diagonal((rx, ry, rz, 1.0))
    bmesh.ops.transform(bm, matrix=M, verts=vs)
    _tag(_faces_of(vs), mi, True)

def ring2d(hw, cr, n_side, n_corner):
    """Vành vuông bo góc cạnh hw, bo góc cr — CCW nhìn từ trên."""
    pts = []
    corners = [((hw - cr, hw - cr), 0.0), ((-(hw - cr), hw - cr), math.pi / 2),
               ((-(hw - cr), -(hw - cr)), math.pi), ((hw - cr, -(hw - cr)), 3 * math.pi / 2)]
    for (cx, cy), a0 in corners:
        for i in range(n_corner):
            a = a0 + (math.pi / 2) * i / n_corner
            pts.append((cx + cr * math.cos(a), cy + cr * math.sin(a)))
        # điểm trong đoạn thẳng tới góc kế tiếp
        for i in range(1, n_side):
            t = i / n_side
            if a0 == 0.0:      pts.append((cx - 2 * (hw - cr) * t, cy))          # cạnh +Y đi sang trái
            elif a0 == math.pi / 2: pts.append((cx, cy - 2 * (hw - cr) * t))     # cạnh −X đi xuống
            elif a0 == math.pi:    pts.append((cx + 2 * (hw - cr) * t, cy))      # cạnh −Y đi sang phải
            else:                  pts.append((cx, cy + 2 * (hw - cr) * t))      # cạnh +X đi lên
    return pts

def loft(bm, mi, rings, smooth=True):
    """Nối các vành (list[(x,y,z)] cùng số điểm, CCW) thành mặt 4 cạnh."""
    n = len(rings[0])
    vv = [[bm.verts.new(p) for p in rg] for rg in rings]
    fs = []
    for r in range(len(rings) - 1):
        for i in range(n):
            j = (i + 1) % n
            fs.append(bm.faces.new((vv[r][i], vv[r][j], vv[r + 1][j], vv[r + 1][i])))
    _tag(fs, mi, smooth)
    return vv[-1]

def skirt_roof(bm, mi, we, wi, z0, z1, cr_e=1.3, cr_i=0.45,
               n_side=7, n_corner=5, serr=True, lip=True):
    """Mái 4 mặt cong vút: eave (we, z0) → đỉnh trong (wi, z1); riềm răng cưa + miệng nóc."""
    TS = [0.00, 0.10, 0.22, 0.36, 0.52, 0.68, 0.82, 0.92, 1.00]
    HS = [0.035, 0.00, 0.05, 0.16, 0.32, 0.52, 0.72, 0.88, 1.00]  # cong lõm + vẩy hiên
    rings = []
    for t, hh in zip(TS, HS):
        w = we + (wi - we) * t
        z = z0 + (z1 - z0) * hh
        cr = cr_e + (cr_i - cr_e) * t
        rings.append([(x, y, z) for (x, y) in ring2d(w, cr, n_side, n_corner)])
    if lip:  # miệng nóc nhô lên che mối nối sàn tầng trên
        rings.append([(x, y, z1 + 0.12) for (x, y) in ring2d(wi - 0.15, cr_i * 0.6, n_side, n_corner)])
    top = loft(bm, mi, rings)
    if serr:  # riềm răng cưa buông dưới hiên
        v0 = [bm.verts.new(p) for p in rings[0]]
        fs = []
        for i in range(len(v0)):
            j = (i + 1) % len(v0)
            p = rings[0][i]
            lo = bm.verts.new((p[0], p[1], p[2] - (0.30 if i % 2 == 0 else 0.10)))
            fs.append(bm.faces.new((v0[i], v0[j], lo)))
        _tag(fs, mi)
    return top

def cap_pyramid(bm, mi, wb, zb, zapex, cr0=1.0, serr=True):
    """Chóp mái T3 (giấu được): đáy vuông wb tại zb → đỉnh zapex, riềm răng cưa chân chóp."""
    prof = [(1.000, 0.000), (0.855, 0.220), (0.680, 0.415), (0.485, 0.585),
            (0.290, 0.735), (0.130, 0.865), (0.0, 1.0)]
    rings = []
    for k, (wr, zr) in enumerate(prof[:-1]):
        w = wb * wr
        cr = cr0 * (1.0 - wr) + 0.15
        rings.append([(x, y, zb + (zapex - zb) * zr) for (x, y) in ring2d(w, cr, 6, 4)])
    last = loft(bm, mi, rings)
    apex = bm.verts.new((0.0, 0.0, zapex))
    _tag([bm.faces.new((last[i], last[(i + 1) % len(last)], apex)) for i in range(len(last))], mi)
    if serr:  # riềm răng cưa buông dưới chân chóp
        v0 = [bm.verts.new(p) for p in rings[0]]
        fs = []
        for i in range(len(v0)):
            j = (i + 1) % len(v0)
            p = rings[0][i]
            lo = bm.verts.new((p[0], p[1], p[2] - (0.24 if i % 2 == 0 else 0.08)))
            fs.append(bm.faces.new((v0[i], v0[j], lo)))
        _tag(fs, mi)

def ring_slab(bm, mi, half_in, half_out, z0, z1):
    """Sàn ván hành lang vành khuyên (4 hộp), rộng half_out−half_in."""
    h = z1 - z0
    yc = (half_in + half_out) / 2
    d = half_out - half_in
    box_s(bm, mi, 0, yc, z0 + h / 2, 2 * half_out, d, h)
    box_s(bm, mi, 0, -yc, z0 + h / 2, 2 * half_out, d, h)
    box_s(bm, mi, yc, 0, z0 + h / 2, d, 2 * half_in, h)
    box_s(bm, mi, -yc, 0, z0 + h / 2, d, 2 * half_in, h)

def band4(bm, mi, half, z, w, h, ang=0.0):
    """Dải chạy quanh 4 cạnh (dải emissive xà / viền)."""
    box_s(bm, mi, 0, half, z, 2 * half, w, h, ang)
    box_s(bm, mi, 0, -half, z, 2 * half, w, h, ang)
    box_s(bm, mi, half, 0, z, w, 2 * half, h, ang)
    box_s(bm, mi, -half, 0, z, w, 2 * half, h, ang)

def lattice_doors(bm, W, z_base, door_h=3.65):
    """Khung cửa liền bức 12 ô/cạnh ở 4 mặt: tấm lưới #2a1712 + nan + khung viền."""
    dw = 2 * W - 1.3
    for s in range(4):
        ang = s * math.pi / 2  # mặt pháp tuyến (0,1) xoay s*90° — mặt tiền s=0 hướng +Y (→ +Z glTF)
        nx, ny = -math.sin(ang), math.cos(ang)
        tx, ty = math.cos(ang), math.sin(ang)
        def P(u, off, z):
            return (nx * (W + off) + tx * u, ny * (W + off) + ty * u, z)
        # tấm lưới mờ
        c = P(0, 0.09, z_base + door_h / 2)
        box_s(bm, MI['go_luoi'], c[0], c[1], c[2], dw, 0.14, door_h, ang)
        # nan dọc 13 (12 ô) + nan ngang 3
        for k in range(13):
            u = -dw / 2 + k * dw / 12
            c = P(u, 0.10, z_base + door_h / 2)
            box_s(bm, MI['go_luoi'], c[0], c[1], c[2], 0.09, 0.20, door_h, ang)
        for zz in (0.12, door_h * 0.5, door_h - 0.12):
            c = P(0, 0.10, z_base + zz)
            box_s(bm, MI['go_luoi'], c[0], c[1], c[2], dw, 0.18, 0.11, ang)
        # khung viền gỗ
        for zz in (0.0, door_h):
            c = P(0, 0.11, z_base + zz)
            box_s(bm, MI['go_vien'], c[0], c[1], c[2], dw + 0.34, 0.22, 0.17, ang)
        for sx in (-1, 1):
            c = P(sx * (dw + 0.17) / 2, 0.11, z_base + door_h / 2)
            box_s(bm, MI['go_vien'], c[0], c[1], c[2], 0.17, 0.22, door_h, ang)

def railing(bm, half, z0, h=1.1, spacing=2.4, r_post=0.07):
    """Lan can ngọc trắng: trụ cách ~2,5 m + 3 thanh ngang, chạy vòng 4 cạnh."""
    mi_p, mi_r = MI['ngoc_trang'], MI['ngoc_trang']
    for zz in (0.12, h * 0.55, h):
        band4(bm, mi_r, half, z0 + zz, 0.10, 0.08)
    n_side = max(2, int(round(2 * half / spacing)))
    for s in range(4):
        ang = s * math.pi / 2
        nx, ny = -math.sin(ang), math.cos(ang)
        tx, ty = math.cos(ang), math.sin(ang)
        for k in range(n_side + 1):
            if s > 0 and k == n_side:
                continue  # bỏ trùng góc
            u = -half + k * (2 * half / n_side)
            rr = r_post * (1.4 if k in (0, n_side) else 1.0)
            cyl_z(bm, mi_p, nx * half + tx * u, ny * half + ty * u, z0, z0 + h, rr, seg=6)

# ---------------- THÂN THÁP: 3 tầng thu dần --------------------------------------
FLOORS = [  # W: nửa rộng tường; Wc: mép hành lang; sảnh 4,5 + mái 2,6 mỗi tầng
    dict(W=6.50, Wc=8.50, z_slab=2.70, z_w0=2.90, z_w1=8.80, we=8.50, wi=5.60, z_sk0=7.20, z_sk1=9.90,  cr=1.30),
    dict(W=5.25, Wc=7.25, z_slab=9.90, z_w0=10.10, z_w1=15.80, we=7.25, wi=4.35, z_sk0=14.40, z_sk1=16.90, cr=1.30),
    dict(W=4.00, Wc=6.00, z_slab=16.90, z_w0=17.10, z_w1=23.00, we=6.00, wi=4.05, z_sk0=21.40, z_sk1=23.10, cr=1.10),
]
gK, gM, gL, gT = BM['khoi_tang'], BM['mai'], BM['lan_can'], BM['mai_t3']

# đài kiền đá 17×17×2,7 (chân đế — Hoàng Hạc Lâu ngồi trên nền cao)
box_s(gK, MI['da_kien'], 0, 0, 1.10, 17.0, 17.0, 2.20)
box_s(gK, MI['da_kien'], 0, 0, 2.45, 16.2, 16.2, 0.50)
band4(gK, MI['emissive_vang'], 8.45, 2.62, 0.10, 0.07)

for f in FLOORS:
    # sàn ván hành lang nhô 2 m + dải xà emissive dưới mép sàn
    ring_slab(gK, MI['go_san'], f['W'], f['Wc'], f['z_slab'], f['z_slab'] + 0.20)
    band4(gK, MI['emissive_vang'], f['Wc'] - 0.08, f['z_slab'] - 0.08, 0.13, 0.11)
    # tường (cao hơn sảnh 4,5 để chui lên mái — phần trên là bình nước)
    box_s(gK, MI['tuong'], 0, 0, (f['z_w0'] + f['z_w1']) / 2, 2 * f['W'], 2 * f['W'], f['z_w1'] - f['z_w0'])
    # khung cửa 12 ô/cạnh + dải xà vẽ emissive trên nóc cửa
    lattice_doors(gK, f['W'], f['z_w0'] + 0.25)
    band4(gK, MI['emissive_vang'], f['W'] + 0.05, f['z_w0'] + 4.25, 0.24, 0.09)
    # cột đỏ 4 góc
    for sx in (-1, 1):
        for sy in (-1, 1):
            cyl_z(gK, MI['cot_do'], sx * (f['W'] - 0.28), sy * (f['W'] - 0.28),
                  f['z_w0'], f['z_w1'], 0.32, seg=8)
    # mái 4 mặt cong riềm răng cưa (T1, T2, T3 đều có hiên riêng)
    skirt_roof(gM, MI['ngoi'], f['we'], f['wi'], f['z_sk0'], f['z_sk1'], cr_e=f['cr'])
    # lan can ngọc trắng trên hành lang
    railing(gL, f['Wc'] - 0.15, f['z_slab'] + 0.20)

# ---------------- NÓC T3: sân quan tinh (luôn có) + chóp giấu được ----------------
# sàn nóc 8,1×8,1 + bệ tròn Ø5 đặt armilla (biến thể quan tinh — bộ noi_that);
# KHÔNG lan can sân nóc: chóp phủ kín sàn, lan can sẽ xuyên qua mặt chóp
box_s(gK, MI['da_kien'], 0, 0, 23.20, 8.10, 8.10, 0.20)
cyl_z(gK, MI['da_kien'], 0, 0, 23.30, 23.85, 2.50, seg=24)
cyl_z(gK, MI['ho_lo'], 0, 0, 23.85, 23.92, 2.56, seg=24, smooth=False)
# chóp T3 + đỉnh ~3 m + Hồ lô — mesh riêng `mai_t3`: GIẤU → nóc mở đặt armilla
cap_pyramid(gT, MI['ngoi'], 4.02, 23.26, 24.38, cr0=0.9, serr=True)
cyl_z(gT, MI['ho_lo'], 0, 0, 24.38, 25.60, 0.13, seg=8)          # cột chóp
cyl_z(gT, MI['ho_lo'], 0, 0, 24.38, 24.55, 1.25, seg=12)         # đế chóp
sphere(gT, MI['ho_lo'], (0, 0, 25.90), 0.42, 0.42, 0.46, seg=16, ring=10)  # hồ lô bầu dưới
cyl_z(gT, MI['ho_lo'], 0, 0, 26.30, 26.60, 0.12, seg=8)                     # cổ hồ lô
sphere(gT, MI['ho_lo'], (0, 0, 26.66), 0.30, 0.30, 0.30, seg=12, ring=8)    # hồ lô bầu trên
sphere(gT, MI['ho_lo'], (0, 0, 26.90), 0.10, 0.10, 0.10, seg=8, ring=6)     # ngọc đỉnh — đúng 27,0 m

# ---------------- gộp / weld / ngân sách ------------------------------------------
res = {}
objects = []
for g in GROUPS:
    bm = BM[g]
    bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=0.0004)  # weld gọn trước export
    me = bpy.data.meshes.new(g)
    bm.to_mesh(me)
    bm.free()
    me.validate()
    ob = bpy.data.objects.new(g, me)
    scn.collection.objects.link(ob)
    for m in MATS:
        me.materials.append(m)  # face.material_index đã gán đúng slot
    res[g] = sum(len(p.vertices) - 2 for p in me.polygons)
    objects.append(ob)

total = sum(res.values())
if total > TRIS_MAX:  # khống chế ngân sách: decimate mesh nặng nhất trước
    for ob in sorted(objects, key=lambda o: -res[o.name]):
        need = 1 - (TRIS_MAX * 0.98 - (total - res[ob.name])) / max(res[ob.name], 1)
        if need <= 0:
            continue
        md = ob.modifiers.new('budget', 'DECIMATE')
        md.decimate_type = 'COLLAPSE'
        md.ratio = max(0.1, 1 - need)
        bpy.context.view_layer.objects.active = ob
        bpy.ops.object.modifier_apply(modifier='budget')
        res[ob.name] = sum(len(p.vertices) - 2 for p in ob.data.polygons)
        total = sum(res.values())
        if total <= TRIS_MAX:
            break

print('GEN ' + json.dumps({'out': OUT, 'tris': res, 'total': total,
                           'dims_m': [17.0, 17.0, 27.0],
                           'budget': TRIS_MAX}, ensure_ascii=False))
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB')
