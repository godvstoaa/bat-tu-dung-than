# -*- coding: utf-8 -*-
# ============================================================================
#  TIỆM CHỢ 1 GIAN ĐÚNG TỈ LỆ — id game `lib_shop_stall` (thay lib_stall_timber
#  to quá 6,83-7,52 m — worst #1). Dựng thủ tục Blender 5.2 headless (bpy),
#  không texture ngoài, đơn vị mét, gốc (0,0,0) đáy giữa gian.
#  Trục Blender: X = bề ngang mặt tiền (±2,095), Y = sâu (phố = −Y, −1,80..+1,79),
#  Z = lên (0..3,195). Mặt tiền quay −Y → export glTF (+Yup) thành +Z.
#
#  LUẬT TỈ LỆ (bảng đã duyệt): bbox 4,2×3,6×3,2 m; quầy chữ L 2,8×0,6×1,1 m
#  (cao 1,1 = hông NPC 1,60 m, đáy hở 0,1); 4 cột gỗ Ø0,20 cao 2,9; mái hiên
#  MỘT DỐC 24° bằng ván gỗ 0,15 + Array (28 ván), mép vươn 1,0 m ra phố
#  (đường cột trước Y=-0,80 → mép Y=-1,80), đỉnh mái 3,2 (batten nóc 3,195);
#  dầm trên cột trước (2,9 + dầm 0,10 = 3,00) đỡ đúng mặt phẳng mái tại cột
#  (z(-0,80)=3,004) — 3 số spec khớp hình học: 24° · mép 3,0 · đỉnh 3,2.
#  3 thùng 0,6³ + sọt tre ×2; biển ngang 0,9×0,3 (vật liệu `sign_face`, UV
#  0..1 mặt −Y cho chữ runtime); ván dựng sau lưng (22 ván + Array); bàn tính,
#  đòn cân treo, hành lá treo, cuộn bạt — chi tiết ≤ 60000 tam giác bản giữa.
#
#  Chạy: "C:\tools\blender\blender-5.2.4-windows-x64\blender.exe" -b \
#         --python scripts/blender/gen_lib_shop_stall.py -- --out <file.glb>
# ============================================================================
import bpy, sys, math, json

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[argv.index('--out') + 1] if '--out' in argv else 'lib_shop_stall.glb'
TRI_BUDGET = 60000

bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene
scn.unit_settings.system = 'METRIC'
scn.unit_settings.scale_length = 1.0

# ---------------- thông số kiến trúc (m) ----------------
S       = math.radians(24.0)        # dốc mái hiên 24°
TAN_S   = math.tan(S)
Y_RIDGE = -0.45                     # đỉnh mái (cạnh trên)
Z_PLANE = 3.16                      # mặt trên ván tại đỉnh
Y_EDGE  = -1.79                     # mép mái vươn ra phố
Y_POSTF = -0.80                     # cột trước (mép vươn qua cột đúng 1,0 m ≈ -0,80→-1,80)
Y_POSTB = +1.60                     # cột sau
X_POST  = 1.80                      # cột tại ±1,80 (mép ngoài 1,90; ván mái ra ±2,095)
COL_H   = 2.9                       # 4 cột Ø0,20 cao 2,9
Q_L, Q_D, Q_H, Q_GAP = 2.8, 0.6, 1.10, 0.10   # quầy: dài×sâu×cao, đáy hở 0,10
Q_X0, Q_X1 = -1.40, 1.40            # tay trước quầy (2,8 m)
Q_Y0, Q_Y1 = -0.40, 0.20            # (0,6 m — mặt tiền quầy hướng phố)

def z_plane(y):                     # mặt phẳng mái hiên 24°
    return Z_PLANE - (Y_RIDGE - y) * TAN_S

# ---------------- vật liệu Principled BSDF ----------------
def srgb_to_linear(c):
    c = min(max(c, 0.0), 1.0)
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def make_mat(name, hexcol, rough=0.85, metal=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    r = [srgb_to_linear(int(hexcol[i:i + 2], 16) / 255.0) for i in (0, 2, 4)]
    bsdf.inputs['Base Color'].default_value = (*r, 1.0)
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    return m

M = {
    'go_cu':    make_mat('stall_go_cu',    'C19A6B', rough=0.82),  # gỗ mật ong cũ — cột, dầm, ván quầy, kệ
    'go_sau':   make_mat('stall_go_sau',   '7D5839', rough=0.85),  # gỗ sẫm — đế quầy, khung tường, thanh giằng
    'go_toi':   make_mat('stall_go_toi',   '664228', rough=0.88),  # khung tối nhất — góc thùng, sườn biển, chống đỡ
    'van_mai':  make_mat('stall_van_mai',  'A9814F', rough=0.88),  # ván mái hiên (nắng cũ)
    'van_cu':   make_mat('stall_van_cu',   '8F6B42', rough=0.90),  # ván tường sau + ván vá cũ
    'da':       make_mat('stall_da',       '7D766C', rough=0.95),  # đá chân cột
    'tre':      make_mat('stall_tre',      '9C7A4A', rough=0.85),  # sọt tre
    'tre_sang': make_mat('stall_tre_sang', 'B39364', rough=0.80),  # vành/dây đan tre
    'jar':      make_mat('stall_jar',      '8A5A3A', rough=0.60),  # lọ gốm men đất
    'jar2':     make_mat('stall_jar2',     '6E4E33', rough=0.70),  # lọ gốm sẫm
    'rau':      make_mat('stall_rau',      '5C7A3A', rough=0.90),  # rau xanh
    'rau_sau':  make_mat('stall_rau_sau',  '4E7B36', rough=0.90),  # hành lá treo
    'qua':      make_mat('stall_qua',      'D97B29', rough=0.70),  # quất cam (điểm sáng ấm)
    'gung':     make_mat('stall_gung',     'C9A84C', rough=0.90),  # nghệ/ginger khô
    'bat':      make_mat('stall_bat',      'B8B0A0', rough=0.95),  # cuộn bạt vải
    'do':       make_mat('stall_do',       'C3272B', rough=0.60),  # vải đỏ điểm nhấn
    'day':      make_mat('stall_day',      '8F7B57', rough=0.90),  # dây gai
    'sat':      make_mat('stall_sat',      '4A4A4A', rough=0.45, metal=0.85),  # móc/ quả cân sắt
    'sign':     make_mat('sign_face',      '964B00', rough=0.50),  # BIỂN: mặt sơn son trống — UV 0..1 cho chữ code
}
# sơn son là men bóng: sheen 0,25 — đúng chất liệu VÀ giữ `sign_face` khỏi bị
# palette gộp khi đóng gói (như lua_rong của noi_that — KHR_materials_sheen
# không batch được, meshy-pack-library để nguyên tên vật liệu + UV 0..1)
_sm = M['sign']
_sb = next(n for n in _sm.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
for _inp, _v in (('Sheen Weight', 0.25), ('Sheen Roughness', 0.4)):
    if _inp in _sb.inputs:
        _sb.inputs[_inp].default_value = _v
# nướng texture sơn son 256×128 (men son + vệt cọ ngang nhẹ) pack vào GLB:
# vật liệu có texture → meshy-pack-library KHÔNG gộp vào palette, giữ tên
# `sign_face` + UV 0..1 cho chữ runtime đổ đè
import random
random.seed(4269)
TW, TH = 256, 128
_img = bpy.data.images.new('stall_sign_face_tex', TW, TH, alpha=False, float_buffer=False)
_base = [int('964B00'[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]
_px = []
for _y in range(TH):
    _streak = 1.0 + 0.05 * math.sin(_y * 0.55)            # vệt cọ ngang
    for _x in range(TW):
        _j = 1.0 + random.uniform(-0.035, 0.035)
        _k = _streak * _j
        _px.extend(min(max(c * _k, 0.0), 1.0) for c in _base)
        _px.append(1.0)
_img.pixels = _px
_img.pack()
_texnode = _sm.node_tree.nodes.new('ShaderNodeTexImage')
_texnode.image = _img
_sm.node_tree.links.new(_texnode.outputs['Color'], _sb.inputs['Base Color'])

# ---------------- helper dựng hình (áp transform ngay để Array offset = world) ----------------
parts = []

def _finish(o):
    o.select_set(True); bpy.context.view_layer.objects.active = o
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    return o

def reg(o, mat):
    o.data.materials.append(mat)
    parts.append(o)
    return o

def box(name, sx, sy, sz, x, y, z, mat, rx=0.0, ry=0.0, rz=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name
    o.scale = (sx, sy, sz)
    _finish(o)
    return reg(o, mat)

def cyl(name, r, h, x, y, z, mat, seg=12, rx=0.0, ry=0.0, rz=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r, depth=h,
                                        location=(x, y, z), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name
    _finish(o)
    return reg(o, mat)

def cone(name, r0, r1, h, x, y, z, mat, seg=8, rx=0.0, ry=0.0, rz=0.0):
    bpy.ops.mesh.primitive_cone_add(vertices=seg, radius1=r0, radius2=r1, depth=h,
                                    location=(x, y, z), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name
    _finish(o)
    return reg(o, mat)

def usphere(name, r, x, y, z, mat, seg=8, rings=5):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, radius=r,
                                         location=(x, y, z))
    o = bpy.context.active_object
    o.name = name
    _finish(o)
    return reg(o, mat)

def apply_array(o, count, offset):
    """Array modifier (bước offset hằng world) + apply — ván/ngói lặp."""
    mod = o.modifiers.new('arr_lap', 'ARRAY')
    mod.fit_type = 'FIXED_COUNT'
    mod.count = count
    mod.use_relative_offset = False
    mod.use_constant_offset = True
    mod.constant_offset_displace = offset
    o.select_set(True); bpy.context.view_layer.objects.active = o
    bpy.ops.object.modifier_apply(modifier='arr_lap')
    return o

def awning_box(name, sx, sl, th, x, y_on_plane, mat, dz_extra=0.0):
    """Hộp nằm trên mặt phẳng mái 24°: trục dài local Y chạy LÊN ĐỈNH (+Y,+Z)."""
    n = (0.0, -math.sin(S), math.cos(S))          # pháp tuyến ngoài (lên-phía phố)
    off = th / 2 + dz_extra
    return box(name, sx, sl, th, x, y_on_plane + n[1] * off, z_plane(y_on_plane) + n[2] * off,
               mat, rx=S)

# ============================================================================
#  KHUNG: 4 cột Ø0,20 × 2,9 + chân đá + dầm chu vi
# ============================================================================
POSTS = [(x, y) for y in (Y_POSTF, Y_POSTB) for x in (-X_POST, X_POST)]
for i, (px, py) in enumerate(POSTS):
    cyl(f'st_cot_{i}', 0.10, COL_H, px, py, COL_H / 2, M['go_cu'], seg=16)
    box(f'st_dachan_{i}', 0.28, 0.28, 0.16, px, py, 0.08, M['da'])
box('st_dam_truoc', 3.90, 0.16, 0.14, 0, Y_POSTF, 2.93, M['go_cu'])   # đỉnh 3,00 ≈ mặt mái tại cột 3,004
box('st_dam_sau',   3.90, 0.16, 0.14, 0, Y_POSTB, 2.93, M['go_cu'])
for sx in (-1, 1):
    box(f'st_xuon_{sx:+d}', 0.14, 2.56, 0.12, sx * X_POST, (Y_POSTF + Y_POSTB) / 2, 2.94, M['go_cu'])
box('st_dam_giua', 3.90, 0.12, 0.10, 0, 0.40, 2.92, M['go_cu'])       # móc treo đồ

# ============================================================================
#  MÁI HIÊN MỘT DỐC 24° — 28 ván 0,1486 (ván 0,138 + khe) + Array, batten, fascia
# ============================================================================
N_PLANK = 28
PITCH   = 4.16 / N_PLANK                    # 0,1486 ≈ ván 0,15
SLOPE_L = (Y_RIDGE - Y_EDGE) / math.cos(S)  # dài ván theo dốc ≈ 1,47
yc = (Y_RIDGE + Y_EDGE) / 2
n_up = (0.0, -math.sin(S), math.cos(S))     # pháp tuyến mái (lên-phía phố)
first = box('st_mai_van', 0.138, SLOPE_L - 0.03, 0.045,
            -(4.16 - PITCH) / 2, yc + n_up[1] * 0.0225, z_plane(yc) + n_up[2] * 0.0225,
            M['van_mai'], rx=S)
apply_array(first, N_PLANK, (PITCH, 0.0, 0.0))
# ván vá lệch màu (3 ván cũ hơn, nhô 2 mm)
for j, xr in enumerate((-1.30, 0.52, 1.42)):
    awning_box(f'st_mai_va_{j}', 0.132, SLOPE_L - 0.10, 0.045, xr, yc, M['van_cu'], dz_extra=0.002)
# batten dưới ván (2 thanh chạy ngang X) + batten nóc đỉnh 3,195
for j, yb in enumerate((-0.75, -1.45)):
    awning_box(f'st_batten_{j}', 4.16, 0.09, 0.07, 0, yb, M['go_cu'], dz_extra=-0.045)
box('st_noc_batten', 4.19, 0.10, 0.07, 0, Y_RIDGE, Z_PLANE, M['go_sau'])   # đỉnh 3,195
for sx in (-1, 1):                                                          # fascia dọc hai bên mép dốc
    FL = SLOPE_L - 0.10                                                     # miter: cụt dưới batten nóc 0,09 m dốc
    awning_box(f'st_fascia_ben_{sx:+d}', 0.06, FL, 0.06, sx * 2.06,
               -0.45 - (0.09 + FL / 2) * math.cos(S), M['go_sau'], dz_extra=0.015)
box('st_fascia_pho', 4.19, 0.05, 0.12, 0, -1.775, z_plane(Y_EDGE) - 0.005, M['go_sau'])  # mép phố −1,80
# 2 chống xiên cột→mái + 2 king stud nâng nóc + cuộn bạt sau nóc
for sx in (-1, 1):
    box(f'st_chong_{sx:+d}', 0.06, 0.50, 0.07, sx * X_POST, -1.175, z_plane(-1.175) - 0.06, M['go_toi'],
        rx=math.radians(-13))
    box(f'st_king_{sx:+d}', 0.07, 0.12, 0.11, sx * X_POST, Y_RIDGE, 3.07, M['go_toi'])
cyl('st_bat_cuon', 0.06, 3.90, 0, -0.52, 3.09, M['bat'], seg=12, ry=math.pi / 2)
for sx in (-1, 1):
    cyl(f'st_bat_day_{sx:+d}', 0.063, 0.03, sx * 1.20, -0.52, 3.09, M['do'], seg=10, ry=math.pi / 2)

# ============================================================================
#  VÁN DỰNG SAU LƯNG — 22 ván đứng + Array, khung + kệ hàng 2 tầng
# ============================================================================
Y_WALL = 1.74
for sx in (-1, 1):
    box(f'st_tuong_cot_{sx:+d}', 0.10, 0.10, 2.55, sx * 2.00, Y_WALL, 1.30, M['go_toi'])
box('st_tuong_giua', 0.10, 0.10, 2.55, 0, Y_WALL, 1.30, M['go_toi'])
wall = box('st_tuong_van', 0.165, 0.05, 2.42, -(4.00 - 0.1818) / 2, Y_WALL, 1.325, M['van_cu'])
apply_array(wall, 22, (0.1818, 0.0, 0.0))
for j, (xr, rot) in enumerate(((0.91, 1.5), (-1.27, -1.2))):    # 2 ván cũ lệch
    box(f'st_tuong_va_{j}', 0.165, 0.05, 2.42, xr, Y_WALL, 1.335, M['go_sau'], rz=math.radians(rot))
box('st_tuong_duoi', 4.06, 0.08, 0.16, 0, Y_WALL, 0.10, M['go_sau'])
box('st_tuong_tren', 4.06, 0.08, 0.14, 0, Y_WALL, 2.53, M['go_sau'])
# kệ hàng 2 tầng sau lưng + đạo cụ
for j, zs in enumerate((0.62, 1.28)):
    box(f'st_ke_{j}', 3.60, 0.32, 0.05, 0, 1.50, zs, M['go_cu'])
    for sx in (-1, 1):
        box(f'st_ke_de_{j}_{sx:+d}', 0.06, 0.30, 0.05, sx * 1.70, 1.62, zs - 0.10, M['go_sau'])
for j, xr in enumerate((-1.45, -0.95, -0.45, 1.05)):            # lọ gốm kệ dưới
    cyl(f'st_lo_{j}', 0.085, 0.22, xr, 1.48, 0.62 + 0.135, M['jar'] if j % 2 else M['jar2'], seg=10)
    cyl(f'st_lo_co_{j}', 0.045, 0.06, xr, 1.48, 0.62 + 0.28, M['jar'] if j % 2 else M['jar2'], seg=8)
cyl('st_binh_1', 0.05, 0.30, 0.35, 1.48, 0.62 + 0.175, M['jar'], seg=8)
cyl('st_binh_2', 0.05, 0.26, 0.55, 1.48, 0.62 + 0.155, M['jar2'], seg=8)
cone('st_bao', 0.13, 0.08, 0.20, 1.45, 1.50, 0.62 + 0.13, M['gung'], seg=10)   # bao hàng
box('st_vai_do', 0.55, 0.30, 0.14, -0.30, 1.52, 1.28 + 0.095, M['do'])        # thớt vải đỏ kệ trên
cyl('st_thung_kia_1', 0.075, 0.16, 0.60, 1.50, 1.28 + 0.10, M['jar'], seg=8)  # chum nhỏ
usphere('st_tron_1', 0.055, 0.80, 1.48, 1.305 + 0.055, M['qua'], seg=8, rings=5)
usphere('st_tron_2', 0.055, 0.95, 1.46, 1.305 + 0.055, M['qua'], seg=8, rings=5)
# bó tre dài tựa tường (ngoài mép kệ x±1,80) + chổi tựa cột trước phải
for j, dx in enumerate((-0.035, 0.0, 0.035)):
    cyl(f'st_tre_{j}', 0.024, 2.45, -1.92 + dx, 1.58, 1.26, M['tre'], seg=6, rx=math.radians(2.5))
cyl('st_choi_can', 0.018, 1.30, 1.90, -0.68, 0.68, M['tre'], seg=6, rz=math.radians(-8))
box('st_choi_dau', 0.16, 0.05, 0.16, 1.965, -0.715, 0.10, M['rau_sau'])

# ============================================================================
#  QUẦY CHỮ L — ván #C19A6B đế #7D5839, cao đúng 1,10, đáy hở 0,10
# ============================================================================
def counter_arm(tag, x0, x1, y0, y1):
    L, D = x1 - x0, y1 - y0
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    # mặt bàn: 4 ván 0,15 (Array dọc sâu) — đỉnh ĐÚNG 1,10
    top = box(f'st_{tag}_top', L, D / 4 - 0.008, 0.05, x0 + L / 2, y0 + D / 8, Q_H - 0.025, M['go_cu'])
    apply_array(top, 4, (0.0, D / 4, 0.0))
    # ván mặt ngoài (ngang, 3 tấm hở khe — thấy đế sau)
    zs = (0.22, 0.55, 0.88)
    for j, zv in enumerate(zs):
        if tag == 'quay_tay':     # tay trước: ván hướng phố (mặt −Y)
            box(f'st_{tag}_van_{j}', L, 0.05, 0.24, cx, y0 + 0.025, zv, M['go_cu'])
        else:                     # tay trả: ván hướng +X
            box(f'st_{tag}_van_{j}', 0.05, D, 0.24, x1 - 0.025, cy, zv, M['go_cu'])
    # đế gỗ sẫm: 4 chân + thanh giằng + sàn dưới
    legs = [(x0 + 0.09, y0 + 0.09), (x1 - 0.09, y0 + 0.09), (x0 + 0.09, y1 - 0.09), (x1 - 0.09, y1 - 0.09)] \
        if tag == 'quay_tay' else [(x0 + 0.08, y0 + 0.08), (x1 - 0.08, y1 - 0.08)]
    for j, (lx, ly) in enumerate(legs):
        box(f'st_{tag}_chan_{j}', 0.10, 0.10, Q_H - 0.10 - 0.10, lx, ly, Q_GAP + (Q_H - 0.20) / 2, M['go_sau'])
    box(f'st_{tag}_giang', L - 0.1 if tag == 'quay_tay' else 0.08,
        0.08 if tag == 'quay_tay' else D - 0.1, 0.08, cx if tag == 'quay_tay' else x0 + 0.08,
        cy if tag == 'quay_tay' else y0 + 0.06, 0.42, M['go_sau'])
    if tag == 'quay_tay':
        box(f'st_{tag}_san_duoi', L - 0.20, D - 0.10, 0.04, cx, cy, 0.35, M['go_sau'])
        box(f'st_{tag}_van_trai', 0.05, D, 0.24, x0 + 0.025, cy, 0.55, M['go_cu'])   # cap mép trái

counter_arm('quay_tay', Q_X0, Q_X1, Q_Y0, Q_Y1)                  # 2,8 × 0,6 × 1,10
counter_arm('quay_tra', 0.80, Q_X1, Q_Y1, 0.90)                  # tay trả chữ L (0,6 × 0,7)

# ============================================================================
#  ĐẠO CỤ: bàn tính, đòn cân treo, thùng 0,6³ ×3, sọt tre ×2, hành lá, biển
# ============================================================================
# bàn tính trên quầy (mép trái) — nằm SÁT mặt quầy 1,10
box('st_bantinh_khung', 0.42, 0.26, 0.035, -0.85, -0.10, Q_H + 0.0175, M['go_sau'])
box('st_bantinh_giua', 0.40, 0.035, 0.012, -0.85, -0.02, Q_H + 0.065, M['go_cu'])
for j in range(5):
    xr = -0.85 - 0.18 + j * 0.09
    cyl(f'st_bantinh_tr_{j}', 0.011, 0.055, xr, -0.07, Q_H + 0.068, M['go_toi'], seg=6)
    for k, dz in enumerate((-0.020, -0.008, 0.014)):
        usphere(f'st_bantinh_ng_{j}_{k}', 0.019, xr, -0.07, Q_H + 0.068 + dz, M['go_cu'], seg=7, rings=4)
# đòn cân treo dưới dầm giữa
cyl('st_can_day', 0.009, 0.30, 0.55, 0.10, 2.90 - 0.15, M['day'], seg=5)
box('st_can_can', 0.62, 0.045, 0.045, 0.55, 0.10, 2.59, M['go_toi'])
cyl('st_can_day2', 0.008, 0.28, 0.76, 0.10, 2.45, M['day'], seg=5)
cyl('st_can_vung', 0.10, 0.028, 0.76, 0.10, 2.31, M['go_cu'], seg=10)
cyl('st_can_day3', 0.008, 0.15, 0.36, 0.10, 2.515, M['day'], seg=5)
usphere('st_can_qua', 0.045, 0.36, 0.10, 2.44, M['sat'], seg=8, rings=5)
cone('st_can_moc', 0.015, 0.002, 0.05, 0.55, 0.10, 2.62, M['sat'], seg=6, rx=math.pi)
# hòm tiền + hũ trên quầy
box('st_hom_tien', 0.24, 0.18, 0.12, 0.92, -0.10, Q_H + 0.06, M['go_sau'])
cyl('st_hu_1', 0.065, 0.14, -0.30, -0.12, Q_H + 0.07, M['jar2'], seg=9)
cyl('st_hu_2', 0.065, 0.14, -0.13, -0.14, Q_H + 0.07, M['jar'], seg=9)
cone('st_rau_quay', 0.09, 0.05, 0.13, 0.35, -0.12, Q_H + 0.065, M['rau'], seg=8)
cone('st_gung_quay', 0.075, 0.04, 0.11, 0.48, -0.13, Q_H + 0.055, M['gung'], seg=7)

def crate(x, y, z0, ry=0.0):
    g = f'st_thung_{x:+.2f}_{y:+.2f}_{z0:.0f}'
    box(g + '_day', 0.60, 0.60, 0.05, x, y, z0 + 0.025, M['go_cu'], rz=ry)
    for sx in (-1, 1):
        for sy in (-1, 1):
            box(f'{g}_c{sx:+d}{sy:+d}', 0.07, 0.07, 0.60, x + sx * 0.265, y + sy * 0.265,
                z0 + 0.30, M['go_toi'], rz=ry)
    for j, zv in enumerate((0.20, 0.42)):
        c, s = math.cos(ry), math.sin(ry)
        box(f'{g}_vd_{j}', 0.54, 0.045, 0.14, x, y - 0.265 * c, z0 + zv, M['go_cu'], rz=ry)
        box(f'{g}_vs_{j}', 0.54, 0.045, 0.14, x, y + 0.265 * c, z0 + zv, M['go_cu'], rz=ry)
        box(f'{g}_vt_{j}', 0.045, 0.54, 0.14, x - 0.265 * c, y, z0 + zv, M['go_cu'], rz=ry)
        box(f'{g}_vp_{j}', 0.045, 0.54, 0.14, x + 0.265 * c, y, z0 + zv, M['go_cu'], rz=ry)

crate(-1.55, 0.95, 0.0, math.radians(3))       # chồng 2 sau trái (tách khỏi kệ y≥1,34)
crate(-1.55, 0.95, 0.62, math.radians(-2))
crate(1.72, 1.00, 0.0, math.radians(-4))       # 1 chiếc sau phải (tránh tay trả quầy x≤1,40)
for j, (xr, yr) in enumerate(((-1.66, 0.85), (-1.44, 0.85), (-1.55, 1.05))):
    usphere(f'st_quat_{j}', 0.055, xr, yr, 1.22 + 0.055, M['qua'], seg=8, rings=5)

def basket(x, y, z0, r=0.17):
    cone('st_sot_duoi_%s' % x, r - 0.03, r - 0.01, 0.13, x, y, z0 + 0.065, M['tre'], seg=12)
    cone('st_sot_tren_%s' % x, r - 0.01, r, 0.13, x, y, z0 + 0.195, M['tre'], seg=12)
    cyl('st_sot_vanh_%s' % x, r + 0.015, 0.03, x, y, z0 + 0.325, M['tre_sang'], seg=12)
    for j, dz in enumerate((0.10, 0.24)):
        cyl(f'st_sot_dan_{x}_{j}', r + 0.004, 0.02, x, y, z0 + dz, M['tre_sang'], seg=12)
    for j, (dx, dy) in enumerate(((-0.05, 0.02), (0.06, -0.03), (0.0, 0.06))):
        cone(f'st_sot_rau_{x}_{j}', 0.065, 0.03, 0.15, x + dx, y + dy, z0 + 0.34, M['rau'], seg=7)

basket(1.10, 0.55, Q_H, r=0.14)                # sọt trên tay trả quầy
basket(-1.55, 0.42, 0.0)                       # sọt dưới đất trước chồng thùng
# hành lá treo dưới mái (2 bó) — dây cắm vào ván, ngọn chạm dây
for j, (xh, yh) in enumerate(((-0.55, -1.02), (-0.98, -1.06))):
    cyl(f'st_hanh_day_{j}', 0.008, 0.16, xh, yh, z_plane(yh) - 0.03, M['day'], seg=5)
    for k in range(4):
        cone(f'st_hanh_{j}_{k}', 0.032, 0.006, 0.30, xh - 0.045 + k * 0.030, yh,
             z_plane(yh) - 0.26, M['rau_sau'], seg=5, rx=math.pi)
    cyl(f'st_hanh_buoc_{j}', 0.036, 0.03, xh, yh, z_plane(yh) - 0.12, M['day'], seg=6)
# BIỂN NGANG 0,9×0,3 — lưng #664228, mặt `sign_face` UV 0..1 hướng phố
SIGN_Y = -1.28
box('st_bien_lung', 0.94, 0.04, 0.34, 0.0, SIGN_Y + 0.015, 2.57, M['go_toi'])
sign_face = box('st_bien_mat', 0.90, 0.03, 0.30, 0.0, SIGN_Y - 0.015, 2.57, M['sign'])
for sx in (-1, 1):
    cyl(f'st_bien_day_{sx:+d}', 0.011, 0.16, sx * 0.33, SIGN_Y, 2.72 + 0.08, M['day'], seg=5)
# UV 0..1 cho mặt biển hướng phố (−Y) — chữ runtime vẽ đè
me = sign_face.data
uv = me.uv_layers.active
for poly in me.polygons:
    if poly.normal.y < -0.99:
        for li in poly.loop_indices:
            co = me.vertices[me.loops[li].vertex_index].co
            u = co.x + 0.5
            v = co.z + 0.5
            uv.data[li].uv = (u, v)

# ============================================================================
#  GỘP 1 MESH → SỬA PHÁP TUYẾN → WELD → GIẢM NẾU VƯỢT NGÂN SÁCH → EXPORT GLB
# ============================================================================
def join_parts(plist, name):
    for o in plist:
        bpy.ops.object.select_all(action='DESELECT')
        o.select_set(True)
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    bpy.ops.object.select_all(action='DESELECT')
    for o in plist:
        o.select_set(True)
    bpy.context.view_layer.objects.active = plist[0]
    bpy.ops.object.join()
    obj = bpy.context.active_object
    obj.name = name; obj.data.name = name
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode='OBJECT')
    mod = obj.modifiers.new('weld_clean', 'WELD')
    mod.merge_threshold = 0.0005
    obj.select_set(True); bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier='weld_clean')
    return obj

def tri_count(obj):
    return sum(len(p.vertices) - 2 for p in obj.data.polygons)

stall = join_parts(parts, 'lib_shop_stall')
total = tri_count(stall)
if total > TRI_BUDGET:
    ratio = max(0.05, 0.94 * TRI_BUDGET / total)
    bpy.ops.object.select_all(action='DESELECT')
    stall.select_set(True); bpy.context.view_layer.objects.active = stall
    dm = stall.modifiers.new('decimate_budget', 'DECIMATE')
    dm.ratio = ratio; dm.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier='decimate_budget')
    total = tri_count(stall)

bb = stall.bound_box
xs = [c[0] for c in bb]; ys = [c[1] for c in bb]; zs = [c[2] for c in bb]
bbox = (max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs))

try:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_yup=True)
except TypeError:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB')

print('STALL_REPORT ' + json.dumps({
    'out': OUT, 'tris': total, 'budget': TRI_BUDGET,
    'bbox_x': round(bbox[0], 3), 'bbox_y': round(bbox[1], 3), 'bbox_z': round(bbox[2], 3),
    'bbox_min': [round(min(xs), 3), round(min(ys), 3), round(min(zs), 3)],
    'bbox_max': [round(max(xs), 3), round(max(ys), 3), round(max(zs), 3)],
    'quay': {'dai': Q_L, 'sau': Q_D, 'cao': Q_H, 'day_ho': Q_GAP},
    'mats': [m.name for m in bpy.data.materials],
}, ensure_ascii=False))
