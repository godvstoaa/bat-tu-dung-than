# ============================================================================
#  BLENDER 5.2 thủ tục: Biệt thự Đại Sảnh Tiếp Khách 9 gian (Thái Hòa Điện
#  thu nhỏ) — id game `dien_dai`, dùng ở quận đảo bay.
#    Đài đá trắng 2 tầng 40×22 (tầng 1 cao 2 m, tầng 2 cao 1,5 m thu theo %,
#    9 bậc chính diện rộng 10 m, lan can trụ mỗi 3 m)
#    Thân 36×18 m, 9 gian (minh gian 4,4 m rộng nhất hẹp dần hai bên),
#    12 cột hiên + 20 cột trong đỏ chu sa #9c2318 Ø0,42×4,5 m trên tảng đá,
#    tường hồi gạch sơn son #7a1c14, khung cửa đồng mở xuyên 3 gian giữa
#    (lỗ 10×4 m — nhìn thấy đạo cụ trong sảnh)
#    Chồng đấu giản lược: vành 24 cụm 2 tầng · Mái chồng diêm 2 tầng dốc 28°,
#    mép vươn 0,9 m cong Bezier, ridges 5 pleat, đỉnh hiểm + 2 rồng chầu
#    bằng lưới 12 cạnh · ngói lưu li VÀNG #d9a441 (metal 0,4 / rough 0,35).
#    4 mesh: dien_dai_dai / dien_dai_than_cot / dien_dai_mai / dien_dai_lan_can
#    Gốc (0,0,0) đáy, mét, mặt tiền -Y (→ +Z sau export glTF yup).
#  Chạy: blender -b --python gen_dien_dai.py -- --out <path.glb>
# ============================================================================
import bpy, sys, math, json, os
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
OUT = argv[argv.index('--out') + 1]

# scene sạch TRƯỚC khi tạo vật liệu (read_factory_settings xoá mọi data)
bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene
scn.unit_settings.system = 'METRIC'
scn.unit_settings.scale_length = 1.0

# ---------------------------------------------------------------- vật liệu
def make_mat(name, hexcol, rough, metal):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bs = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    rgba = tuple(int(hexcol[i:i + 2], 16) / 255.0 for i in (0, 2, 4)) + (1.0,)
    for key, val in (('Base Color', rgba), ('Roughness', rough), ('Metallic', metal)):
        inp = next((i for i in bs.inputs if i.name == key), None)
        if inp is not None:
            inp.default_value = val
    return m

M_STONE  = make_mat('dd_da_trang',    'ece7da', 0.75, 0.0)  # đá trắng
M_RED    = make_mat('dd_go_do_chusa', '9c2318', 0.50, 0.0)  # gỗ đỏ chu sa
M_BRICK  = make_mat('dd_gach_son',    '7a1c14', 0.70, 0.0)  # tường hồi sơn son
M_TILE   = make_mat('dd_ngoi_vang',   'd9a441', 0.35, 0.4)  # ngói lưu li vàng
M_BRONZE = make_mat('dd_vien_dong',   'c9963c', 0.35, 0.85) # viền đồng
M_DARK   = make_mat('dd_go_tham',     '5f150f', 0.60, 0.0)  # xà / ngưỡng gỗ thẫm

MATS = [M_STONE, M_RED, M_BRICK, M_TILE, M_BRONZE, M_DARK]
ST, RD, BK, TL, BZ, DK = range(6)

# ---------------------------------------------------------------- bucket
class Bucket:
    """gom verts + faces (kèm material index + cờ smooth) cho 1 mesh xuất ra."""
    def __init__(self):
        self.verts, self.faces, self.fmat, self.fsm = [], [], [], []
    def v(self, p):
        self.verts.append((p[0], p[1], p[2]))
        return len(self.verts) - 1
    def quad(self, a, b, c, d, mat, sm=False):
        self.faces.append((a, b, c, d)); self.fmat.append(mat); self.fsm.append(sm)
    def tri(self, a, b, c, mat, sm=False):
        self.faces.append((a, b, c)); self.fmat.append(mat); self.fsm.append(sm)

DAI, THAN, MAI, LANCAN = Bucket(), Bucket(), Bucket(), Bucket()

def box(B, cx, cy, cz, sx, sy, sz, mat):
    x0, x1 = cx - sx / 2, cx + sx / 2
    y0, y1 = cy - sy / 2, cy + sy / 2
    z0, z1 = cz - sz / 2, cz + sz / 2
    v0 = B.v((x0, y0, z0)); v1 = B.v((x1, y0, z0))
    v2 = B.v((x0, y1, z0)); v3 = B.v((x1, y1, z0))
    v4 = B.v((x0, y0, z1)); v5 = B.v((x1, y0, z1))
    v6 = B.v((x0, y1, z1)); v7 = B.v((x1, y1, z1))
    B.quad(v4, v5, v7, v6, mat)   # +Z
    B.quad(v0, v2, v3, v1, mat)   # -Z
    B.quad(v2, v6, v7, v3, mat)   # +Y
    B.quad(v0, v1, v5, v4, mat)   # -Y
    B.quad(v1, v3, v7, v5, mat)   # +X
    B.quad(v0, v4, v6, v2, mat)   # -X

def vcyl(B, cx, cy, z0, z1, r0, r1, segs, mat):
    """trụ đứng 16 cạnh, thóp nhẹ ở đỉnh (cột)."""
    rb = [B.v((cx + r0 * math.cos(2 * math.pi * k / segs),
               cy + r0 * math.sin(2 * math.pi * k / segs), z0))
          for k in range(segs)]
    rt = [B.v((cx + r1 * math.cos(2 * math.pi * k / segs),
               cy + r1 * math.sin(2 * math.pi * k / segs), z1))
          for k in range(segs)]
    for k in range(segs):
        n = (k + 1) % segs
        B.quad(rb[k], rb[n], rt[n], rt[k], mat, sm=True)
    for k in range(1, segs - 1):
        B.tri(rt[0], rt[k], rt[k + 1], mat, sm=True)
        B.tri(rb[0], rb[k + 1], rb[k], mat)

def frame(a):
    a = Vector(a).normalized()
    ref = Vector((0, 0, 1)) if abs(a.z) < 0.9 else Vector((1, 0, 0))
    s = ref.cross(a).normalized()
    u = a.cross(s).normalized()      # (s, u, a) phải tay
    return s, u

def beam(B, p0, p1, w, h, mat):
    """hộp theo đoạn thẳng p0→p1 (xà, lan can dốc, diềm góc mái)."""
    p0, p1 = Vector(p0), Vector(p1)
    a = p1 - p0; L = a.length; a = a.normalized()
    s, u = frame(a)
    hs, hu, ha = w / 2, h / 2, L / 2
    mid = (p0 + p1) / 2
    vs = []
    for es, eu, ea in ((-1, -1, -1), (1, -1, -1), (1, 1, -1), (-1, 1, -1),
                       (-1, -1, 1), (1, -1, 1), (1, 1, 1), (-1, 1, 1)):
        vs.append(B.v(mid + s * (es * hs) + u * (eu * hu) + a * (ea * ha)))
    v0, v1, v2, v3, v4, v5, v6, v7 = vs
    B.quad(v4, v5, v7, v6, mat); B.quad(v0, v2, v3, v1, mat)
    B.quad(v2, v6, v7, v3, mat); B.quad(v0, v1, v5, v4, mat)
    B.quad(v1, v3, v7, v5, mat); B.quad(v0, v4, v6, v2, mat)

def ocyl(B, p0, p1, r0, r1, segs, mat):
    """trụ N cạnh theo đoạn bất kỳ (thân rồng, ống đỉnh hiểm)."""
    p0, p1 = Vector(p0), Vector(p1)
    a = (p1 - p0).normalized()
    s, u = frame(a)
    def ring(p, r):
        return [B.v(p + s * (r * math.cos(2 * math.pi * k / segs)) +
                    u * (r * math.sin(2 * math.pi * k / segs))) for k in range(segs)]
    rb, rt = ring(p0, r0), ring(p1, r1)
    for k in range(segs):
        n = (k + 1) % segs
        B.quad(rb[k], rb[n], rt[n], rt[k], mat, sm=True)
    for k in range(1, segs - 1):
        B.tri(rt[0], rt[k], rt[k + 1], mat, sm=True)
        B.tri(rb[0], rb[k + 1], rb[k], mat)

# ---------------------------------------------------------------- đài đá 2 tầng
box(DAI, 0, 0, 0.15, 40.7, 22.7, 0.30, ST)   # nềnChannel chân đài
box(DAI, 0, 0, 1.00, 40.0, 22.0, 2.00, ST)   # tầng 1: 40×22 cao 2 m
box(DAI, 0, 0, 2.75, 37.6, 19.4, 1.50, ST)   # tầng 2: thu ~6%/cạnh, cao 1,5 m
# 9 bậc chính diện rộng 10 m: leo 3,5 m, đổ đúng mép tầng 2 (y = -9,7)
RISE, TREAD = 3.5 / 9.0, 0.42
for i in range(1, 10):
    yc = -13.48 + (i - 0.5) * TREAD
    box(DAI, 0, yc, i * RISE / 2, 10.0, TREAD, i * RISE, ST)

# ---------------------------------------------------------------- thân + cột
BAY = [3.7, 3.9, 4.0, 4.2, 4.4, 4.2, 4.0, 3.9, 3.7]   # 9 gian = 36 m
COLX = [-18.0]
for w in BAY:
    COLX.append(COLX[-1] + w)
FLOOR = 3.5
# tường (mặt ngoài tại y=±9, x=±18; dày 0,35; cao 7 m)
box(THAN, -11.5, -9.0, 7.0, 13.0, 0.35, 7.0, BK)   # tường tiền trái của lỗ cửa
box(THAN,  11.5, -9.0, 7.0, 13.0, 0.35, 7.0, BK)   # tường tiền phải của lỗ cửa
box(THAN,   0.0, -9.0, 9.0, 10.0, 0.35, 3.0, BK)   # bờ trên lỗ cửa 10×4
box(THAN,   0.0,  9.0, 7.0, 36.0, 0.35, 7.0, BK)   # tường hậu
box(THAN, -18.0,  0.0, 7.0, 0.35, 18.0, 7.0, BK)   # tường hồi trái
box(THAN,  18.0,  0.0, 7.0, 0.35, 18.0, 7.0, BK)   # tường hồi phải
# khung cửa đồng quanh lỗ mở xuyên 3 gian giữa (10×4 m)
box(THAN, -5.15, -9.00, 5.50, 0.30, 0.50, 4.00, BZ)
box(THAN,  5.15, -9.00, 5.50, 0.30, 0.50, 4.00, BZ)
box(THAN,  0.00, -9.00, 7.68, 10.9, 0.50, 0.36, BZ)
# xà đỉnh tường (chồng đấu ngồi lên đây)
box(THAN, 0.0,  -9.05, 10.65, 36.9, 0.55, 0.35, DK)
box(THAN, 0.0,   9.05, 10.65, 36.9, 0.55, 0.35, DK)
box(THAN, -18.05, 0.0, 10.65, 0.55, 18.1, 0.35, DK)
box(THAN,  18.05, 0.0, 10.65, 0.55, 18.1, 0.35, DK)
# 12 cột hiên (10 tiền + 2 hậu) + 20 cột trong (2 hàng × 10)
Y_HIEN = -9.45
for x in COLX:
    vcyl(THAN, x, Y_HIEN, FLOOR + 0.35, FLOOR + 4.85, 0.21, 0.185, 16, RD)
    box(THAN, x, Y_HIEN, FLOOR + 0.175, 0.62, 0.62, 0.35, ST)   # tảng đá
for x in (-14.3, 14.3):
    vcyl(THAN, x, -Y_HIEN, FLOOR + 0.35, FLOOR + 4.85, 0.21, 0.185, 16, RD)
    box(THAN, x, -Y_HIEN, FLOOR + 0.175, 0.62, 0.62, 0.35, ST)
for y in (5.4, -5.4):
    for x in COLX:
        vcyl(THAN, x, y, FLOOR + 0.30, FLOOR + 4.80, 0.20, 0.175, 16, RD)
        box(THAN, x, y, FLOOR + 0.15, 0.58, 0.58, 0.30, ST)
# xà hiên + dải gác trên hiên (tiền & hậu) + biển ngạch đồng
box(THAN, 0.0, -9.45, 8.60, 36.9, 0.50, 0.55, DK)
box(THAN, 0.0, -9.42, 9.70, 36.9, 0.42, 1.60, RD)
box(THAN, 0.0, -9.44, 10.46, 36.9, 0.46, 0.08, BZ)
box(THAN, 0.0,  9.45, 8.60, 36.9, 0.50, 0.55, DK)
box(THAN, 0.0,  9.42, 9.70, 36.9, 0.42, 1.60, RD)
box(THAN, 0.0,  9.44, 10.46, 36.9, 0.46, 0.08, BZ)
box(THAN, 0.0, -9.66, 9.55, 3.2, 0.12, 1.00, BZ)
box(THAN, 0.0, -9.72, 9.55, 2.6, 0.10, 0.70, DK)
# đạo cụ trong sảnh (nhìn xuyên lỗ cửa)
box(THAN, 0.0, -1.5, FLOOR + 0.015, 3.4, 9.0, 0.03, RD)    # thảm đỏ
box(THAN, 0.0,  6.6, FLOOR + 0.28, 4.4, 2.6, 0.56, DK)     # bệ ngai
box(THAN, 0.0,  6.6, FLOOR + 0.03, 4.0, 2.2, 0.06, BZ)
box(THAN, 0.0,  6.5, FLOOR + 0.95, 1.30, 1.10, 0.62, RD)   # ổ ngai
box(THAN, 0.0,  7.15, FLOOR + 2.05, 1.30, 0.22, 1.60, RD)  # tự lưng
box(THAN, -0.55, 6.5, FLOOR + 1.35, 0.20, 0.90, 0.45, RD)  # tay vịn
box(THAN,  0.55, 6.5, FLOOR + 1.35, 0.20, 0.90, 0.45, RD)
for sx in (-1.75, 0.0, 1.75):                               # bình phong 3 cánh
    box(THAN, sx, 8.15, FLOOR + 1.80, 1.72, 0.14, 3.60, RD)
    box(THAN, sx, 8.15, FLOOR + 3.62, 1.80, 0.20, 0.10, BZ)
# 2 đèn lồng đỏ treo trong mặt phẳng cửa (nhìn xuyên lỗ 10×4 thấy ngay)
for sx in (-2.8, 2.8):
    ocyl(THAN, (sx, -8.75, 7.50), (sx, -8.75, 6.60), 0.02, 0.02, 6, DK)
    ocyl(THAN, (sx, -8.75, 6.60), (sx, -8.75, 6.52), 0.10, 0.10, 8, BZ)
    ocyl(THAN, (sx, -8.75, 6.52), (sx, -8.75, 5.95), 0.32, 0.32, 12, RD)
    ocyl(THAN, (sx, -8.75, 5.95), (sx, -8.75, 5.87), 0.10, 0.10, 8, BZ)
# chồng đấu giản lược: vành 24 cụm × 2 tầng (9 tiền + 9 hậu + 3 mỗi hồi)
BAYC = [(COLX[i] + COLX[i + 1]) / 2 for i in range(9)]
DG = [(x, -9.0) for x in BAYC] + [(x, 9.0) for x in BAYC]
for x in (-18.0, 18.0):
    DG += [(x, -4.5), (x, 0.0), (x, 4.5)]
for (x, y) in DG:
    z = 10.82
    box(THAN, x, y, z + 0.05, 0.55, 0.55, 0.10, DK)
    box(THAN, x, y, z + 0.15, 0.90, 0.16, 0.14, RD)
    box(THAN, x, y, z + 0.15, 0.16, 0.90, 0.14, RD)
    box(THAN, x, y, z + 0.27, 0.68, 0.14, 0.12, RD)
    box(THAN, x, y, z + 0.27, 0.14, 0.68, 0.12, RD)
    box(THAN, x, y, z + 0.37, 0.30, 0.30, 0.12, BZ)

# ---------------------------------------------------------------- mái
def ring_pts(hx, hy, nx, ny):
    """vòng chữ nhật CCW nhìn từ trên, mẫu đều: M = 2(nx+ny)-2 điểm."""
    pts = []
    for i in range(nx):
        pts.append((-hx + 2 * hx * i / (nx - 1), -hy))
    for i in range(1, ny):
        pts.append((hx, -hy + 2 * hy * i / (ny - 1)))
    for i in range(1, nx):
        pts.append((hx - 2 * hx * i / (nx - 1), hy))
    for i in range(1, ny):
        pts.append((-hx, hy - 2 * hy * i / (ny - 1)))
    return pts

def loft(B, hx0, hy0, z0, hx1, hy1, z1, rings, nx, ny, thick, upturn, mat,
         close_inner=True):
    """dải mái: mặt trên cong (luỹ thừa 1,35 → thoai mép, dốc đỉnh), mặt dưới,
    diềm mép; mép cong Bezier vểnh lên ở góc (fade dần lên đỉnh)."""
    M = 2 * (nx + ny) - 3   # nx + (ny-1) + (nx-1) + (ny-1)
    ringv = []
    for i in range(rings):
        s = i / (rings - 1)
        hx = hx0 + (hx1 - hx0) * s
        hy = hy0 + (hy1 - hy0) * s
        z = z0 + (z1 - z0) * (s ** 1.35)
        pts = ring_pts(hx, hy, nx, ny)
        top, bot = [], []
        fade = (1 - s) ** 1.5
        for (x, y) in pts:
            u = abs(x) / hx if abs(abs(y) - hy) < 1e-6 else abs(y) / hy
            zz = z + upturn * (u ** 2.4) * fade
            top.append(B.v((x, y, zz)))
            bot.append(B.v((x, y, zz - thick)))
        ringv.append((top, bot))
    for i in range(rings - 1):
        t0, b0 = ringv[i]; t1, b1 = ringv[i + 1]
        for m in range(M):
            n = (m + 1) % M
            B.quad(t0[m], t0[n], t1[n], t1[m], mat, sm=True)
            B.quad(b0[n], b0[m], b1[m], b1[n], mat, sm=True)
    t0, b0 = ringv[0]; tL, bL = ringv[-1]
    for m in range(M):
        n = (m + 1) % M
        B.quad(t0[n], t0[m], b0[m], b0[n], mat)               # diềm mép
        if close_inner:
            B.quad(tL[m], tL[n], bL[n], bL[m], mat)           # nẹp trong
    return ringv

# mái hạ (skirt hiên): mép 37,8×19,8 (vươn 0,9 m beyond tường) @ z 11,38
SK_Z1 = 12.26
loft(MAI, 18.9, 9.9, 11.38, 16.6, 7.6, SK_Z1, 7, 26, 14, 0.22, 0.55, TL)
box(MAI, 0, 0, SK_Z1 - 0.07, 33.2, 15.2, 0.14, TL)   # nắp trong skirt
# tầng gác giữa 2 mái: dải đỏ + viền đồng (khe hở rõ 2 tầng mái)
CL_Z1 = 12.64
box(MAI, 0, 0, (SK_Z1 + CL_Z1) / 2, 32.0, 13.4, CL_Z1 - SK_Z1, RD)
box(MAI, 0, 0, SK_Z1 + 0.04, 32.4, 13.8, 0.08, BZ)
box(MAI, 0, 0, CL_Z1 - 0.04, 32.4, 13.8, 0.08, BZ)
# mái thượng (mái chính 28°): mép 33,6×14,4 @ z 12,64
TAN28 = math.tan(math.radians(28.0))
UP_HY, UP_HX, UP_Z = 7.2, 16.8, CL_Z1
RIDGE_Z = UP_Z + UP_HY * TAN28
END_HY = 0.45
loft(MAI, UP_HX, UP_HY, UP_Z,
     UP_HX - UP_HY + END_HY, END_HY, RIDGE_Z,
     9, 28, 14, 0.22, 0.45, TL, close_inner=True)
# bờ nóc (chồng xuống kín dải đỉnh mái) + 5 pleat + diềm 4 đường hip
BT = RIDGE_Z + 0.25                       # đỉnh bờ nóc
box(MAI, 0, 0, BT - 0.30, 21.2, 1.05, 0.60, TL)
for x in (-8, -4, 0, 4, 8):
    box(MAI, x, 0, BT + 0.12, 0.85, 0.42, 0.24, TL)
    box(MAI, x, 0, BT + 0.265, 0.40, 0.20, 0.05, BZ)
for sx in (-1, 1):
    for sy in (-1, 1):
        beam(MAI, (sx * (UP_HX - 0.10), sy * (UP_HY - 0.10), UP_Z + 0.02),
             (sx * (UP_HX - UP_HY + END_HY + 0.10), sy * END_HY, RIDGE_Z),
             0.26, 0.20, TL)
# đỉnh hiểm: chồng ống đồng lưới 12 cạnh
ocyl(MAI, (0, 0, BT + 0.06), (0, 0, BT + 0.18), 0.50, 0.50, 12, BZ)
ocyl(MAI, (0, 0, BT + 0.18), (0, 0, BT + 0.28), 0.36, 0.36, 12, BZ)
ocyl(MAI, (0, 0, BT + 0.28), (0, 0, BT + 0.38), 0.17, 0.13, 12, BZ)

def dragon(sign):
    """rồng chầu: thân lưới 12 cạnh uốn 3 khúc, sừng đồng, chầu vào đỉnh hiểm."""
    X = lambda d: sign * d
    B = BT
    ocyl(MAI, (X(3.6), 0.0, B - 0.10), (X(2.7), 0.0, B + 0.12), 0.09, 0.13, 12, TL)
    ocyl(MAI, (X(2.7), 0.0, B + 0.12), (X(1.9), 0.0, B + 0.04), 0.13, 0.16, 12, TL)
    ocyl(MAI, (X(1.9), 0.0, B + 0.04), (X(1.45), 0.0, B + 0.08), 0.16, 0.15, 12, TL)
    ocyl(MAI, (X(1.45), 0.0, B + 0.08), (X(1.05), 0.0, B + 0.00), 0.15, 0.11, 12, TL)
    ocyl(MAI, (X(3.6), 0.0, B - 0.10), (X(4.3), 0.0, B + 0.16), 0.05, 0.02, 12, TL)
    for h in (-1, 1):
        ocyl(MAI, (X(1.5), 0.12 * h, B + 0.16), (X(1.15), 0.22 * h, B + 0.30),
             0.045, 0.02, 12, BZ)
        ocyl(MAI, (X(1.7), 0.10 * h, B - 0.14), (X(1.6), 0.16 * h, B - 0.34),
             0.05, 0.045, 12, TL)

dragon(1); dragon(-1)

# ---------------------------------------------------------------- lan can
def rail_run(B, p0, p1, step=3.0):
    """lan can đá dọc đoạn: 2 thanh ngang + trụ mỗi ~3 m (trụ + nắp + đế)."""
    z = p0[2]
    a = Vector(p1) - Vector(p0); L = a.length
    n = max(1, int(round(L / step)))
    a = a.normalized()
    for h in (0.55, 1.02):
        beam(B, tuple(p0[:2]) + (z + h,), tuple(p1[:2]) + (z + h,), 0.14, 0.10, ST)
    for i in range(n + 1):
        p = Vector(p0) + a * (L * i / n)
        box(B, p.x, p.y, z + 0.55, 0.16, 0.16, 0.55, ST)
        box(B, p.x, p.y, z + 1.08, 0.26, 0.26, 0.10, ST)
        box(B, p.x, p.y, z + 0.28, 0.12, 0.12, 0.12, ST)

# vành lan can tầng 1 (z=2), chừaflight bậc rộng 10,8 m giữa mặt tiền
I1, GAP = 0.45, 5.4
w1, d1 = 40.0 / 2 - I1, 22.0 / 2 - I1
rail_run(LANCAN, (-w1, -d1, 2.0), (-GAP, -d1, 2.0))
rail_run(LANCAN, ( GAP, -d1, 2.0), ( w1, -d1, 2.0))
rail_run(LANCAN, (-w1,  d1, 2.0), ( w1,  d1, 2.0))
rail_run(LANCAN, (-w1, -d1, 2.0), (-w1,  d1, 2.0))
rail_run(LANCAN, ( w1, -d1, 2.0), ( w1,  d1, 2.0))
# lan can tầng 2 hai bên mép trước (z=3,5) + trụ trấn 2 bên miệng bậc
rail_run(LANCAN, (-18.6, -9.35, 3.5), (-GAP - 0.2, -9.35, 3.5))
rail_run(LANCAN, ( GAP + 0.2, -9.35, 3.5), ( 18.6, -9.35, 3.5))
for sx in (-1, 1):
    box(LANCAN, sx * (GAP + 0.1), -9.35, 4.15, 0.30, 0.30, 1.30, ST)
    box(LANCAN, sx * (GAP + 0.1), -9.35, 4.87, 0.42, 0.42, 0.14, ST)
# lan can dốc hai bên flight bậc + trụ trấn đầu cầu
for sx in (-1, 1):
    beam(LANCAN, (sx * GAP, -13.30, 1.85), (sx * (GAP - 0.35), -9.85, 4.45), 0.15, 0.12, ST)
    beam(LANCAN, (sx * GAP, -13.30, 1.35), (sx * (GAP - 0.35), -9.85, 3.95), 0.13, 0.10, ST)
    box(LANCAN, sx * GAP, -13.35, 0.80, 0.34, 0.34, 1.60, ST)
    box(LANCAN, sx * GAP, -13.35, 1.68, 0.46, 0.46, 0.14, ST)

# ---------------------------------------------------------------- dựng & xuất
report = {'objects': {}, 'total': 0}
objs = []
for name, bk in (('dien_dai_dai', DAI), ('dien_dai_than_cot', THAN),
                 ('dien_dai_mai', MAI), ('dien_dai_lan_can', LANCAN)):
    me = bpy.data.meshes.new(name)
    me.from_pydata(bk.verts, [], bk.faces)
    ok = me.validate()
    if not ok:
        for m in MATS:
            me.materials.append(m)
        for p, mi, sm in zip(me.polygons, bk.fmat, bk.fsm):
            p.material_index = mi
            p.use_smooth = sm
        obj = bpy.data.objects.new(name, me)
        scn.collection.objects.link(obj)
        t = sum(len(p.vertices) - 2 for p in me.polygons)
        report['objects'][name] = t
        report['total'] += t
        objs.append(obj)
    else:
        report.setdefault('validate_fail', []).append(name)

# khống chế ngân sách 65k: vượt thì decimate mesh nặng nhất
if report['total'] > 65000:
    big = max(objs, key=lambda o: sum(len(p.vertices) - 2 for p in o.data.polygons))
    bpy.context.view_layer.objects.active = big
    for o in objs:
        o.select_set(o == big)
    mod = big.modifiers.new('budget', 'DECIMATE')
    mod.ratio = 63000.0 / report['total']
    bpy.ops.object.modifier_apply(modifier='budget')
    report['objects'][big.name] = sum(len(p.vertices) - 2 for p in big.data.polygons)
    report['total'] = sum(report['objects'].values())
    report['decimated'] = big.name

# preview 2 góc (3/4 + chính diện thấp) để soi — render xong xoá camera
try:
    views = [('dien_dai_preview.png', (36, -46, 19), 40, (0, 0, 8), 'STUDIO'),
             ('dien_dai_front.png', (0, -52, 7), 46, (0, 0, 6.5), 'STUDIO'),
             ('dien_dai_door.png', (0, -23, 4.8), 48, (0, 6, 4.4), 'STUDIO')]
    scn.render.engine = 'BLENDER_WORKBENCH'
    scn.display.shading.color_type = 'MATERIAL'
    scn.render.resolution_x = 1100
    scn.render.resolution_y = 720
    prevs = []
    for fname, loc, lens, target, light in views:
        prev = os.path.join(os.path.dirname(os.path.abspath(OUT)), fname)
        cam_data = bpy.data.cameras.new('dd_cam')
        cam = bpy.data.objects.new('dd_cam', cam_data)
        cam.location = loc
        d = Vector(target) - cam.location
        cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
        cam.data.lens = lens
        scn.collection.objects.link(cam)
        scn.camera = cam
        scn.display.shading.light = light
        scn.render.filepath = prev
        bpy.ops.render.render(write_still=True)
        bpy.data.objects.remove(cam, do_unlink=True)
        bpy.data.cameras.remove(cam_data)
        prevs.append(prev)
    report['preview'] = prevs
except Exception as e:
    report['preview_error'] = str(e)

bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_yup=True,
                          export_apply=False, use_selection=False)
report['out'] = OUT
print('DD_REPORT ' + json.dumps(report))
