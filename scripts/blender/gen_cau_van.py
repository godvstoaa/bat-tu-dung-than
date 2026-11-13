# gen_cau_van.py — Cầu Vân: MỘT cấu kiện 40 m (Blender 5.2 headless, bpy thủ tục)
# 1 cấu kiện 40×5×1,2 m (võng giữa nhịp 0,5 m parabol) — game (landmarks.js) tự nhân bản
# 29 đoạn cho 4 cầu. KHÔNG lặp linked-duplicate trong scene nữa: bản 24-bản từng bị exporter
# gộp thành EXT_mesh_gpu_instancing → GLB chứa cả dãy 4 cầu rộng 286 m trong khi game coi
# «một GLB = một cấu kiện» → mỗi đoạn render 0,28 m vô hình (sửa 2026-11-14).
# Gộp 2 mesh: cau_van_san (sàn+xà+đèn+mây) / cau_van_lancan (lan can ngọc).
# Dùng: blender -b --python gen_cau_van.py -- --out <path.glb>
import bpy, bmesh, sys, os, math
from math import sin, cos, pi
from mathutils import Vector

bpy.ops.wm.read_factory_settings(use_empty=True)   # scene sạch: không Cube/Camera/Light mặc định

# ---------- tham số ----------
L, W, H = 40.0, 5.0, 1.2          # dài × rộng × cao danh nghĩa (m)
SAG = 0.5                          # võng giữa nhịp (m)
NP = 8                             # số ván sàn
BRIDGES = [5, 5, 7, 7]             # cấu kiện mỗi cầu (tổng 24)
BRIDGE_GAP = 14.0                  # khoảng cách Y giữa các cầu
MAX_TRIS = 7000                    # ngân sách bản giữa

def sag(x):
    """parabol: 0 ở hai đầu, -0,5 m giữa nhịp"""
    return -SAG * 4.0 * (x / L) * (1.0 - x / L)

def parse_out():
    argv = sys.argv
    if '--' in argv:
        a = argv[argv.index('--') + 1:]
        for i, s in enumerate(a):
            if s == '--out' and i + 1 < len(a):
                return a[i + 1]
    return os.path.join(os.environ.get('TEMP', '/tmp'), 'cau_van.glb')

# ---------- chất liệu Principled BSDF, không texture ----------
def set_in(bsdf, names, val):
    for n in names:
        if n in bsdf.inputs:
            bsdf.inputs[n].default_value = val
            return True
    return False

def mkmat(name, hexcol, rough, metal=0.0, emi=None, emi_k=0.0, alpha=1.0, blend=False):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    c = tuple(int(hexcol[i:i + 2], 16) / 255.0 for i in (0, 2, 4))
    set_in(bsdf, ['Base Color'], (*c, 1.0))
    set_in(bsdf, ['Roughness'], rough)
    set_in(bsdf, ['Metallic'], metal)
    if alpha < 1.0:
        set_in(bsdf, ['Alpha'], alpha)
    if emi is not None:
        set_in(bsdf, ['Emission Color', 'Emission'], (*emi, 1.0))
        set_in(bsdf, ['Emission Strength'], emi_k)
    if blend:
        try: m.blend_method = 'BLEND'
        except Exception: pass
        try: m.surface_render_method = 'BLENDED'
        except Exception: pass
        m.use_backface_culling = False
    return m

MAT_VAN  = mkmat('van_may',    'd8cdb4', 0.85)                                        # ván mây
MAT_GO   = mkmat('go_xa',      'a98c60', 0.80)                                        # xà ngang + dầm treo
MAT_NGOC = mkmat('ngoc_trang', 'ece7da', 0.35)                                        # lan can ngọc trắng
MAT_MAY  = mkmat('may_dau',    'f4f1e8', 1.00, alpha=0.9, blend=True)                 # mỏ đất mây
MAT_DEN  = mkmat('den_lua',    'f5c26b', 0.60, emi=(1.0, 210 / 255, 122 / 255), emi_k=0.8)  # đèn lồng #ffd27a×0,8

# ---------- dựng bmesh ----------
bm_san = bmesh.new()
bm_can = bmesh.new()

def face(bm, verts, mat):
    f = bm.faces.new(verts)
    f.material_index = mat
    return f

def fan_cap(bm, ring, center, mat):
    n = len(ring)
    for i in range(n):
        face(bm, (center, ring[i], ring[(i + 1) % n]), mat)

# --- SÀN: 8 ván mây chạy dọc, hơi so le, võng parabol ---
NX = 10
PW, PT, GAP = 0.52, 0.12, 0.105
Y0 = -(NP * PW + (NP - 1) * GAP) / 2.0
for p in range(NP):
    yc = Y0 + PW / 2 + p * (PW + GAP)
    dz = 0.045 * sin(p * 2.399 + 0.7)          # so le cao độ
    roll = 0.035 * sin(p * 1.7)                 # so le nghiêng ngang
    dx = 0.30 * sin(p * 3.1)                    # so lệch dọc
    rings = []
    for i in range(NX + 1):
        x = dx + L * i / NX
        zc = sag(x) + dz + PT / 2
        corners = []
        for sy, sz in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
            ry, rz = sy * PW / 2, sz * PT / 2
            y = yc + ry * cos(roll) - rz * sin(roll)
            z = zc + ry * sin(roll) + rz * cos(roll)
            corners.append(bm_san.verts.new((x, y, z)))
        rings.append(corners)
    for i in range(NX):
        a, b = rings[i], rings[i + 1]
        face(bm_san, (a[0], a[1], b[1], b[0]), 0)   # đáy
        face(bm_san, (a[3], b[3], b[2], a[2]), 0)   # mặt đi
        face(bm_san, (a[0], b[0], b[3], a[3]), 0)   # cạnh -
        face(bm_san, (a[1], a[2], b[2], b[1]), 0)   # cạnh +
    for r in (rings[0], rings[NX]):                 # nắp 2 đầu ván
        cx = r[0].co.x
        c = bm_san.verts.new((cx, yc, sag(cx) + dz + PT / 2))
        fan_cap(bm_san, list(r), c, 0)

# --- 2 xà ngang gỗ dưới sàn ---
for xb in (L / 3, 2 * L / 3):
    bw, bh, bd = 4.9, 0.22, 0.28
    zc = sag(xb) - 0.20
    v = [bm_san.verts.new((xb + sdx * bd / 2, sdy * bw / 2, zc + sdz * bh / 2))
         for sdx in (-1, 1) for sdy in (-1, 1) for sdz in (-1, 1)]
    for fi in [(0, 1, 3, 2), (4, 6, 7, 5), (0, 2, 6, 4), (1, 5, 7, 3), (0, 4, 5, 1), (2, 3, 7, 6)]:
        face(bm_san, tuple(v[i] for i in fi), 1)

# --- 3 vòm đỡ bán nguyệt, mỗi vòm 5 thanh cong ghép (dầm treo chùa Treo) ---
def arch_lath(bm, xa, k):
    dxo = (k - 2) * 0.11
    R = 2.35 + 0.02 * sin(k * 2.1)
    cz = sag(xa) - 0.18 - R
    NA, r = 12, 0.058              # 12 đoạn/cung, tiết diện tam giác cạnh ~0,10 m
    rings = []
    for j in range(NA + 1):
        th = pi * j / NA
        px, py, pz = xa + dxo, -R * cos(th), cz + R * sin(th)
        ty, tz = R * sin(th), R * cos(th)              # tiếp tuyến cung trong mặt YZ
        tl = math.hypot(ty, tz); ty, tz = ty / tl, tz / tl
        ny, nz = tz, -ty                               # pháp tuyến trong mặt cung
        ring = []
        for a in (0.0, 2 * pi / 3, 4 * pi / 3):
            off, out = r * cos(a), r * sin(a)          # off: trong mặt cung, out: theo X
            ring.append(bm.verts.new((px + out, py + ny * off, pz + nz * off)))
        rings.append(ring)
    for j in range(NA):
        a, b = rings[j], rings[j + 1]
        for i in range(3):
            face(bm, (a[i], a[(i + 1) % 3], b[(i + 1) % 3], b[i]), 1)
    for r_ in (rings[0], rings[NA]):
        c = bm.verts.new((r_[0].co.x, sum(p.co.y for p in r_) / 3, sum(p.co.z for p in r_) / 3))
        fan_cap(bm, list(r_), c, 1)

for xa in (L / 4, L / 2, 3 * L / 4):
    for k in range(5):
        arch_lath(bm_san, xa, k)

# --- 2 đèn lồng lụa nhỏ emissive #ffd27a×0,8, treo giữa cấu kiện ---
def lantern(bm, x, y):
    ztop, zt = sag(x) - 0.04, sag(x) - 0.55
    cr = 0.02                                        # dây treo 4 cạnh
    r0 = [bm.verts.new((x + cr * cos(a * pi / 2), y + cr * sin(a * pi / 2), ztop)) for a in range(4)]
    r1 = [bm.verts.new((x + cr * cos(a * pi / 2), y + cr * sin(a * pi / 2), zt)) for a in range(4)]
    for i in range(4):
        face(bm, (r0[i], r0[(i + 1) % 4], r1[(i + 1) % 4], r1[i]), 1)
    fan_cap(bm, r0, bm.verts.new((x, y, ztop)), 1)
    lr, hgt = [0.20, 0.26, 0.20], 0.42               # thân hexagon phồng giữa
    rings = []
    for ri, rad in enumerate(lr):
        zz = zt - hgt * ri / (len(lr) - 1)
        rings.append([bm.verts.new((x + rad * cos(i * pi / 3), y + rad * sin(i * pi / 3), zz)) for i in range(6)])
    for j in range(len(lr) - 1):
        a, b = rings[j], rings[j + 1]
        for i in range(6):
            face(bm, (a[i], a[(i + 1) % 6], b[(i + 1) % 6], b[i]), 2)
    fan_cap(bm, rings[0], bm.verts.new((x, y, zt)), 2)
    fan_cap(bm, rings[-1], bm.verts.new((x, y, zt - hgt)), 2)

for x, y in ((14.0, -1.5), (26.0, 1.5)):
    lantern(bm_san, x, y)

# --- 2 mỏ đất mây hai đầu ôm mép đảo (alpha 0,9) ---
for xe in (0.0, L):
    try:
        ico = bmesh.ops.create_icosphere(bm_san, subdivisions=1, radius=1.0)
    except TypeError:
        ico = bmesh.ops.create_icosphere(bm_san, u_subdivisions=1, radius=1.0)
    bmesh.ops.scale(bm_san, verts=ico['verts'], vec=(2.6, 2.4, 1.15))
    bmesh.ops.translate(bm_san, verts=ico['verts'],
                        vec=(xe + (-1.0 if xe < L / 2 else 1.0) * 0.9, 0.0, -0.30))
    for f in {f for v in ico['verts'] for f in v.link_faces}:
        f.material_index = 3
        f.smooth = True

# --- LAN CAN ngọc trắng: trụ chai 1,1 m mỗi 2,5 m + tay vịn ống liền dải ---
POST_RINGS = [(0.00, 0.095), (0.14, 0.115), (0.34, 0.130), (0.58, 0.105), (0.82, 0.066), (1.00, 0.078)]
def post(bm, x, y):
    rings = []
    for hf, rad in POST_RINGS:
        zz = sag(x) + 0.12 + hf * 1.1
        rings.append([bm.verts.new((x + rad * cos(i * pi / 3), y + rad * sin(i * pi / 3), zz)) for i in range(6)])
    for j in range(len(rings) - 1):
        a, b = rings[j], rings[j + 1]
        for i in range(6):
            face(bm, (a[i], a[(i + 1) % 6], b[(i + 1) % 6], b[i]), 0)
    fan_cap(bm, rings[0], bm.verts.new((x, y, rings[0][0].co.z)), 0)
    fan_cap(bm, rings[-1], bm.verts.new((x, y, rings[-1][0].co.z)), 0)

def handrail(bm, y):
    NR, rr = 14, 0.055
    rings = []
    for i in range(NR + 1):
        x = L * i / NR
        zz = sag(x) + 0.12 + 1.10
        rings.append([bm.verts.new((x, y + rr * sin(i2 * pi / 3), zz + rr * cos(i2 * pi / 3)))
                      for i2 in range(6)])
    for j in range(NR):
        a, b = rings[j], rings[j + 1]
        for i in range(6):
            face(bm, (a[i], a[(i + 1) % 6], b[(i + 1) % 6], b[i]), 0)
    fan_cap(bm, rings[0], bm.verts.new((0.0, y, rings[0][0].co.z)), 0)
    fan_cap(bm, rings[-1], bm.verts.new((L, y, rings[-1][0].co.z)), 0)

for side in (-1, 1):
    yy = side * 2.28
    xp = 0.0
    while xp <= L + 1e-6:
        post(bm_can, xp, yy)
        xp += 2.5
    handrail(bm_can, yy)

# ---------- mesh + object (gốc (0,0,0) = đáy cấu kiện đầu, mét) ----------
def finish(bm, name, mats, smooth_all=False):
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m in mats:
        me.materials.append(m)
    if smooth_all:
        for p in me.polygons:
            p.use_smooth = True
    me.validate()
    me.update()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob

ob_san = finish(bm_san, 'cau_van_san', [MAT_VAN, MAT_GO, MAT_DEN, MAT_MAY])
ob_can = finish(bm_can, 'cau_van_lancan', [MAT_NGOC], smooth_all=True)

tris = lambda me: sum(len(p.vertices) - 2 for p in me.polygons)
t_san, t_can = tris(ob_san.data), tris(ob_can.data)
print(f'[gen_cau_van] cau_van_san={t_san} tam giac, cau_van_lancan={t_can} tam giac, tong={t_san + t_can}')

# an toàn ngân sách: vượt ngưỡng thì Decimate khống chế về <= MAX_TRIS-200
if t_san + t_can > MAX_TRIS - 100:
    ratio = (MAX_TRIS - 200) / (t_san + t_can)
    for ob in (ob_san, ob_can):
        m = ob.modifiers.new('budget', 'DECIMATE')
        m.ratio = ratio
        bpy.context.view_layer.objects.active = ob
        bpy.ops.object.modifier_apply(modifier='budget')
    t_san, t_can = tris(ob_san.data), tris(ob_can.data)
    print(f'[gen_cau_van] sau Decimate: san={t_san}, lancan={t_can}, tong={t_san + t_can}')

# ---------- MỘT cấu kiện / GLB — không lặp trong scene (xem đầu file) ----------
print(f'[gen_cau_van] xuat 1 cau kien {L} m — game nhan ban {sum(BRIDGES)}+ doan cho 4 cau {BRIDGES}')

# ---------- export glTF 2.0 ----------
out = os.path.abspath(parse_out())
os.makedirs(os.path.dirname(out), exist_ok=True)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB')
print(f'[gen_cau_van] EXPORT {out} ({os.path.getsize(out)} bytes), tong tam giac ban giua = {t_san + t_can} <= {MAX_TRIS}')
