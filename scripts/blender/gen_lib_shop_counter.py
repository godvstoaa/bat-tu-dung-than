# -*- coding: utf-8 -*-
# ============================================================================
#  QUẦY THỢ MAY TÀNG Y CÁC 2 GIAN (id lib_shop_counter) — thay gian chòi 6 m.
#  Dựng thủ tục Blender 5.2 headless (bpy thuần), không texture ngoài, mét.
#  Trục: X = mặt tiền (−3,3..3,3) · Y = sâu (trước = −2,1, sau = +2,1) · Z = lên.
#  Gốc (0,0,0) đáy giữa. Mặt tiền −Y → export glTF yup thành +Z trước.
#
#  LUẬT KÍCH THƯỚC (bảng chuẩn tỉ lệ đã duyệt — sai lệch ≤5%): 6,6 × 4,2 × 3,8 m.
#    module 2 gian × 3,3 m = 6,6 m (mặt cột ngoài flush mép ±3,30);
#    khoảng cột trước–sau 3,5 m (cột y ±1,75; mép mái/móng đúng ±2,10);
#    đỉnh bờ nóc đúng 3,80 m. Mái ngói ván xám hutong dốc 26°.
#  6 cột Ø0,22 vermillion #E34234 (đế đá + đầu cột edge-wear #946E4A).
#  Quầy chữ U gỗ bóng (roughness 0,5) cao 1,1 m trên sàn, CHỪA KHE TRỐNG
#    x ∈ [0,75 .. 1,65] (tâm 1,20) — chỗ NPC bán đứng (TANGY.x+1,2,
#    render3d.js:343 / court.js:70) — không geometry nào trong vùng đó.
#  Giá thuốc sau quầy cao 2,2 m: 70 ngăn kéo (1 mặt + Array 14 × Array 5)
#    + lọ sứ Ø0,12 (1 lọ + Array 24) trên nóc giá.
#  Móc treo vải lụa đỏ #C3272B viền vàng #E7C969 — roughness 0,3 + SHEEN
#    (input có sẵn Principled BSDF — script ĐẦU TIÊN trong repo dùng sheen).
#  Biển ngang 1,2×0,4 tâm treo 2,2 m; 2 đèn lồng emissive #FF4C00.
#  3 mesh: tangy_than / tangy_noi_that / tangy_mai. Ngân sách 65.000 tam giác.
#  Chạy: blender -b --python scripts/blender/gen_lib_shop_counter.py -- --out <file.glb>
# ============================================================================
import bpy, sys, math, json

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[argv.index('--out') + 1] if '--out' in argv else 'lib_shop_counter.glb'
TRI_BUDGET = 65000

bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene
scn.unit_settings.system = 'METRIC'
scn.unit_settings.scale_length = 1.0

# ---------------- thông số kiến trúc (m) ----------------
HW, HD   = 3.30, 2.10            # nửa rộng / nửa sâu luật (móng + mép mái)
COL_X    = [-3.19, 0.0, 3.19]    # 3 dòng cột — module gian 3,3 (mặt cột flush ±3,30)
COL_Y    = [-1.75, 1.75]         # khoảng cột trước–sau 3,5 m
PL       = 0.15                  # móng đá cao
WALL_TOP = 2.60                  # đỉnh tường
EAVE_Z   = 2.656                 # đường structural mép mái (đầu xà)
RIDGE_Z  = 3.68                  # sống nóc structural
CAP_TOP  = 3.80                  # đỉnh bờ nóc = LUẬT 3,8
SLOPE    = math.radians(26)      # dốc mái 26°
RUN      = 2.10 / math.cos(SLOPE)          # dài mái theo dốc ≈ 2,335
SIN, COS = math.sin(SLOPE), math.cos(SLOPE)
COL_R, COL_TOP = 0.11, 2.60      # cột Ø0,22
CTOP_Z   = 1.25                  # mặt quầy = 1,10 trên sàn (0,15)
GAP_X0, GAP_X1 = 0.75, 1.65      # khe quầy trống — tâm +1,20 (chỗ NPC)

# ---------------- vật liệu Principled BSDF ----------------
def srgb(c):
    c = min(max(c, 0.0), 1.0)
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def col(h):
    return tuple(srgb(int(h[i:i + 2], 16) / 255.0) for i in (0, 2, 4)) + (1.0,)

def make_mat(name, hexcol, rough=0.8, metal=0.0, sheen=0.0, sheen_col=None,
             coat=0.0, emiss=None, emiss_str=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bs = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    bs.inputs['Base Color'].default_value = col(hexcol)
    bs.inputs['Roughness'].default_value = rough
    bs.inputs['Metallic'].default_value = metal
    # sheen — input có sẵn của Principled BSDF (việc mới trong repo): lụa #C3272B
    # Blender 5.2 tên socket 'Sheen Weight' (bản ≤4.x là 'Sheen')
    if sheen > 0.0:
        for k in ('Sheen Weight', 'Sheen'):
            try: bs.inputs[k].default_value = sheen; break
            except Exception: continue
        bs.inputs['Sheen Tint'].default_value = col(sheen_col or 'E7C969')
        try: bs.inputs['Sheen Roughness'].default_value = 0.35
        except Exception: pass
    if coat > 0.0:
        for k in ('Coat Weight', 'Clearcoat'):
            try: bs.inputs[k].default_value = coat; break
            except Exception: continue
    if emiss:
        for k in ('Emission Color', 'Emission'):
            try: bs.inputs[k].default_value = col(emiss); break
            except Exception: continue
        try: bs.inputs['Emission Strength'].default_value = emiss_str
        except Exception: pass
    return m

M = {
    # mái ngói ván xám hutong — bảng màu: nền #4A5459 · nắng bạc #6B7A80 · ẩm #3B424C · sứt #A44139
    'ngoi':    make_mat('tangy_ngoi_xam',   '4A5459', rough=0.85),
    'ngoi_n':  make_mat('tangy_ngoi_nang',  '6B7A80', rough=0.80),
    'ngoi_a':  make_mat('tangy_ngoi_am',    '3B424C', rough=0.90),
    'ngoi_s':  make_mat('tangy_ngoi_sut',   'A44139', rough=0.88),
    # gỗ — quầy bóng 0,5 / sơn son #964B00 / khung tối nhất #664228
    'quay':    make_mat('tangy_go_bong',    '964B00', rough=0.50),
    'quay_d':  make_mat('tangy_go_den',     '7D5839', rough=0.45),
    'go':      make_mat('tangy_go_toi',     '664228', rough=0.72),
    'go_s':    make_mat('tangy_go_mat',     'C19A6B', rough=0.80),
    # cột vermillion #E34234 + đầu cột edge-wear #946E4A
    'cot':     make_mat('tangy_cot_do',     'E34234', rough=0.50),
    'cot_d':   make_mat('tangy_go_mai',     '946E4A', rough=0.75),
    # vôi nứt: nền #F5F2E9 · phai #EDEAE0 · ẩm chân tường #C8B8A0
    'voi':     make_mat('tangy_voi',        'F5F2E9', rough=0.95),
    'voi_p':   make_mat('tangy_voi_phai',   'EDEAE0', rough=0.95),
    'voi_a':   make_mat('tangy_voi_am',     'C8B8A0', rough=0.95),
    'reu':     make_mat('tangy_reu',        '4A5459', rough=0.95),
    'da':      make_mat('tangy_da',         '7D766C', rough=0.95),
    # lọ sứ men bóng + clearcoat; lụa đỏ roughness 0,3 + SHEEN; viền vàng; đèn emissive
    'su':      make_mat('tangy_su',         'ECE7DA', rough=0.25, coat=0.25),
    'lua':     make_mat('tangy_lua_do',     'C3272B', rough=0.30, sheen=0.85, sheen_col='E7C969'),
    'vang':    make_mat('tangy_vang',       'E7C969', rough=0.40, metal=0.55),
    'den':     make_mat('tangy_den_lon',    'C3272B', rough=0.50, emiss='FF4C00', emiss_str=1.5),
    'bien':    make_mat('tangy_bien',       '4A1F16', rough=0.35),
    'giay':    make_mat('tangy_giay',       'E8E2D2', rough=0.90),
    'sat':     make_mat('tangy_sat',        '8A8580', rough=0.45, metal=0.80),
}

# ---------------- helper dựng hình ----------------
than, noi, mai = [], [], []

def reg(o, mat, bucket):
    o.data.materials.append(mat)
    bucket.append(o)
    return o

def smooth(o, ang=40):
    try: bpy.ops.object.shade_auto_smooth(angle=math.radians(ang))
    except Exception:
        try: bpy.ops.object.shade_smooth()
        except Exception: pass
    return o

def box(name, sx, sy, sz, x, y, z, mat, bucket=than, rx=0.0, ry=0.0, rz=0.0, sm=False):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name; o.scale = (sx, sy, sz)
    reg(o, mat, bucket)
    return smooth(o) if sm else o

def cyl(name, r, h, x, y, z, mat, seg=14, bucket=than, rx=0.0, ry=0.0, rz=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r, depth=h,
                                        location=(x, y, z), rotation=(rx, ry, rz))
    o = bpy.context.active_object
    o.name = name
    return smooth(reg(o, mat, bucket))

def sphere(name, r, x, y, z, mat, seg=10, ring=6, bucket=noi):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=ring, radius=r,
                                         location=(x, y, z))
    o = bpy.context.active_object
    o.name = name
    return smooth(reg(o, mat, bucket))

def prism_z(name, tri, x0, x1, mat, bucket=than):
    """Lăng trụ tam giác mặt cắt (y,z) — núi mái 硬山."""
    verts = [(x0, y, z) for y, z in tri] + [(x1, y, z) for y, z in tri]
    faces = [(0, 1, 2), (5, 4, 3), (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)]
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces); me.validate(); me.update()
    o = bpy.data.objects.new(name, me)
    scn.collection.objects.link(o)
    return reg(o, mat, bucket)

def arr(o, count, offset):
    """Array modifier bước CONSTAN theo trục WORLD (mét).
    Áp rotation/scale vào mesh trước để offset không phụ thuộc trục local quay
    (relative offset nhân với kích thước bbox — bài học vòng 1: bước co còn 0,386 m
    và mặt mái sau array chạy ngược dốc)."""
    bpy.ops.object.select_all(action='DESELECT')
    o.select_set(True); bpy.context.view_layer.objects.active = o
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    mod = o.modifiers.new('arr', 'ARRAY')
    mod.use_constant_offset = True
    mod.use_relative_offset = False        # relative (1,0,0) bật mặc định → CỘNG thêm bước × bbox
    mod.constant_offset_displace = offset
    mod.count = count
    bpy.ops.object.modifier_apply(modifier='arr')
    return o

# ============================================================================
#  MESH 1 — tangy_than: móng, sàn, tường vôi nứt, 6 cột, khung, cửa bản xếp
# ============================================================================
box('mong_da', HW * 2, HD * 2, PL, 0, 0, PL / 2, M['da'])                     # 6,6×4,2 đúng luật
box('san_da_truoc', 6.30, 1.15, 0.04, 0, -1.475, PL + 0.02, M['da'])          # thẹp đá trước quầy
arr(box('van_san', 6.20, 0.24, 0.045, 0, -0.80, PL + 0.0225, M['go_s'], bucket=than),
    11, (0.0, 0.26, 0.0))                                                     # sàn ván sau (Array)

# tường sau + gáo hai bên (vôi phấn #F5F2E9) + núi tam giác
box('tuong_sau', 6.60, 0.12, WALL_TOP - PL, 0, 1.81, PL + (WALL_TOP - PL) / 2, M['voi'])
for s in (-1, 1):
    box(f'tuong_ben_{s:+d}', 0.12, 3.42, WALL_TOP - PL, s * 3.24, 0,
        PL + (WALL_TOP - PL) / 2, M['voi'])
    prism_z(f'nui_{s:+d}', [(-2.08, WALL_TOP - 0.02), (2.08, WALL_TOP - 0.02), (0.0, 3.66)],
            s * 3.18 - 0.06, s * 3.18 + 0.06, M['voi'])
# ẩm loang chân tường #C8B8A0 (0,5 m) + mảng phai #EDEAE0 + rêu móng
box('am_sau', 6.60, 0.018, 0.50, 0, 1.876, PL + 0.25, M['voi_a'])
for s in (-1, 1):
    box(f'am_ben_{s:+d}', 0.018, 3.42, 0.50, s * 3.312, 0, PL + 0.25, M['voi_a'])
    box(f'reu_mong_{s:+d}', 0.34, 0.34, 0.10, s * 3.12, -1.94, 0.10, M['reu'])
box('phai_1', 0.90, 0.014, 0.70, -1.30, 1.876, 1.35, M['voi_p'])
box('phai_2', 1.10, 0.014, 0.55, 1.60, 1.876, 1.05, M['voi_p'])
# cửa sổ song gỗ hai hông (nhô mặt ngoài tường bên)
for s in (-1, 1):
    box(f'cuaso_{s:+d}_khung', 0.05, 1.10, 1.30, s * 3.315, -0.30, 1.72, M['go'])
    for j in range(3):
        box(f'cuaso_{s:+d}_v{j}', 0.04, 1.00, 0.05, s * 3.315, -0.30, 1.72 - 0.30 + 0.30 * j, M['go'])
        box(f'cuaso_{s:+d}_h{j}', 0.04, 0.05, 1.10, s * 3.315, -0.60 + 0.30 * j, 1.72, M['go'])

# 6 cột Ø0,22 vermillion (1 cột + Array 3 / hàng) + đế đá + đầu cột edge-wear
for yi, y in enumerate(COL_Y):
    c = cyl(f'cot_hang{yi}', COL_R, COL_TOP - 0.31, COL_X[0], y, 0.31 + (COL_TOP - 0.31) / 2,
            M['cot'], seg=16)
    arr(c, 3, (3.19, 0.0, 0.0))
    for k, cx in enumerate(COL_X):
        w = 0.40 if k == 1 else 0.34                       # đế giữa to hơn đế góc
        box(f'de_cot_{yi}_{k}', w, w, 0.16, cx, y, PL + 0.08, M['da'])
        box(f'dau_cot_{yi}_{k}', 0.28, 0.28, 0.07, cx, y, COL_TOP - 0.035, M['cot_d'])
# xà hiên trước/sau + 3 xà ngang xuyên (giữa 2 hàng cột)
for s in (-1, 1):
    box(f'xa_hien_{s:+d}', 6.60, 0.20, 0.24, 0, s * 1.75, 2.56, M['go'])
for cx in COL_X:
    box(f'xa_ngang_{cx:+.2f}', 0.14, 3.50, 0.18, cx, 0, 2.50, M['go'])
# cửa bản xếp cả gian — 7 ván dựng dựa hông trái khi mở hàng (cao 2,40 theo Z)
for j in range(7):
    box(f'van_cua_{j}', 0.26, 0.045, 2.40, -2.95 - 0.012 * j, -1.45 + 0.36 * j, 1.37,
        M['go_s'], ry=-math.radians(10 + 0.5 * j))

# ============================================================================
#  MESH 2 — tangy_noi_that: quầy U (khe trống +1,2), giá thuốc + lọ sứ,
#            móc treo lụa (SHEEN), biển, đèn lồng, đạo cụ
# ============================================================================
# quầy chữ U: thân + mặt đá bóng — THAN trái x[−2,85..0,75], PHẢI x[1,65..2,85]
box('quay_trai', 3.60, 0.60, CTOP_Z - PL - 0.08, -1.05, -1.45, PL + (CTOP_Z - PL - 0.08) / 2, M['quay'], bucket=noi)
box('quay_phai', 1.20, 0.60, CTOP_Z - PL - 0.08, 2.25, -1.45, PL + (CTOP_Z - PL - 0.08) / 2, M['quay'], bucket=noi)
box('quay_trai_top', 3.76, 0.72, 0.08, -1.05, -1.45, CTOP_Z - 0.04, M['quay_d'], bucket=noi)
box('quay_phai_top', 1.36, 0.72, 0.08, 2.25, -1.45, CTOP_Z - 0.04, M['quay_d'], bucket=noi)
# hai cánh U (hông quay vào trong)
for s in (-1, 1):
    box(f'quay_hong_{s:+d}', 0.60, 0.60, CTOP_Z - PL - 0.08, s * 2.55, -0.85,
        PL + (CTOP_Z - PL - 0.08) / 2, M['quay'], bucket=noi)
    box(f'quay_hong_{s:+d}_top', 0.76, 0.72, 0.08, s * 2.55, -0.85, CTOP_Z - 0.04, M['quay_d'], bucket=noi)
# nẹp mép khe trống (cắt ngang thân quầy tại 0,75 / 1,65) + dải ngang mặt quầy
for gx in (GAP_X0, GAP_X1):
    box(f'nap_me_{gx:.2f}', 0.05, 0.62, CTOP_Z - PL - 0.08, gx, -1.45,
        PL + (CTOP_Z - PL - 0.08) / 2, M['quay_d'], bucket=noi)
for cx, ln in ((-1.05, 3.60), (2.25, 1.20)):
    for zz in (0.24, 1.10):
        box(f'day_quay_{cx:+.2f}_{zz:.2f}', ln, 0.025, 0.07, cx, -1.762, zz, M['quay_d'], bucket=noi)
# nan dọc mặt quầy (1 nan + Array) — 11 trái / 4 phải
arr(box('nan_qt', 0.04, 0.02, 0.84, -2.70, -1.762, 0.64, M['quay_d'], bucket=noi), 11, (0.33, 0.0, 0.0))
arr(box('nan_qp', 0.04, 0.02, 0.84, 1.76, -1.762, 0.64, M['quay_d'], bucket=noi), 4, (0.33, 0.0, 0.0))

# GIÁ THUỐC sau quầy — cao 2,2 m trên sàn (nóc 2,35), ngang 4,6 m
box('ke_goc_trai', 0.05, 0.34, 2.14, -2.28, 1.58, PL + 1.07, M['go'], bucket=noi)
box('ke_goc_phai', 0.05, 0.34, 2.14, 2.28, 1.58, PL + 1.07, M['go'], bucket=noi)
box('ke_noc', 4.60, 0.34, 0.06, 0, 1.58, PL + 2.17, M['quay_d'], bucket=noi)
box('ke_day', 4.60, 0.34, 0.06, 0, 1.58, PL + 0.09, M['go'], bucket=noi)
box('ke_lung', 4.50, 0.04, 2.10, 0, 1.74, PL + 1.14, M['go_s'], bucket=noi)
# 70 ngăn kéo: 1 mặt + Array 14 (ngang) × Array 5 (dọc) + nắm vàng
arr(arr(box('ngan_ke', 0.30, 0.02, 0.26, -2.10, 1.405, PL + 0.84, M['go_s'], bucket=noi),
        14, (0.315, 0.0, 0.0)), 5, (0.0, 0.0, 0.29))
arr(arr(box('nam_ngan', 0.05, 0.03, 0.05, -2.10, 1.392, PL + 0.92, M['vang'], bucket=noi),
        14, (0.315, 0.0, 0.0)), 5, (0.0, 0.0, 0.29))
# tầng hở dưới: 2 mảng ván + bó thuốc giấy + 2 lọ nhỏ
for zz in (0.55, 0.85):
    box(f'ke_tang_{zz:.2f}', 4.50, 0.30, 0.04, 0, 1.58, PL + zz, M['go_s'], bucket=noi)
for j, (bx, bz) in enumerate(((-1.9, 0.62), (-1.55, 0.62), (-1.2, 0.64), (1.7, 0.62), (2.0, 0.93))):
    box(f'bo_thuoc_{j}', 0.26, 0.16, 0.15, bx, 1.56, PL + bz, M['giay'], bucket=noi)
# LỌ SỨ Ø0,12 — 1 lọ + Array 24 trên nóc giá (mỏ cổ + nắp)
lo = cyl('lo_su', 0.06, 0.26, -2.14, 1.58, PL + 2.17 + 0.13, M['su'], seg=12, bucket=noi)
box('nap_lo_su', 0.09, 0.09, 0.05, -2.14, 1.58, PL + 2.17 + 0.28, M['su'], bucket=noi)
arr(lo, 24, (0.185, 0.0, 0.0))
for j, lx in enumerate((-1.55, -1.15, 1.95)):              # 3 lọ nhỏ tầng hở
    cyl(f'lo_nho_{j}', 0.045, 0.20, lx, 1.56, PL + 1.02, M['su'], seg=10, bucket=noi)

# MÓC TREO VẢI LỤA ĐỎ (roughness 0,3 + SHEEN) — thanh + 5 thớ vải viền vàng
cyl('than_treo_vai', 0.03, 2.60, -1.55, -1.05, 2.42, M['go'], seg=8, bucket=noi, ry=math.pi / 2)
for hx in (-2.72, -0.38):
    box(f'day_treo_{hx:+.2f}', 0.03, 0.03, 0.55, hx, -1.05, 2.70, M['go'], bucket=noi)
BOLT_L = (0.98, 0.94, 1.02, 0.92, 1.00)                    # dài vải khác nhau
BOLT_RZ = (2.5, -1.8, 3.2, -2.6, 1.5)                      # nghiêng nhẹ, deterministic
for j in range(5):
    bx = -2.62 + 0.55 * j
    L = BOLT_L[j]
    box(f'moc_{j}', 0.03, 0.03, 0.12, bx, -1.05, 2.34, M['go'], bucket=noi)
    box(f'vai_{j}', 0.34, 0.055, L, bx, -1.05, 2.28 - L / 2, M['lua'], bucket=noi, rz=math.radians(BOLT_RZ[j]))
    zb = 2.28 - L
    box(f'vai_{j}_vien', 0.36, 0.06, 0.09, bx, -1.05, zb + 0.045, M['vang'], bucket=noi, rz=math.radians(BOLT_RZ[j]))
    box(f'vai_{j}_tua', 0.35, 0.025, 0.08, bx, -1.05, zb - 0.05, M['vang'], bucket=noi, rz=math.radians(BOLT_RZ[j]))
# cuộn vải lụa nằm trên quầy phải + thớ vải dự phòng trên hông trái
cyl('cuon_vai', 0.075, 0.50, 2.05, -1.45, CTOP_Z + 0.075, M['lua'], seg=10, bucket=noi, ry=math.pi / 2)
box('tho_vai', 0.34, 0.06, 0.30, -2.55, -0.85, CTOP_Z + 0.15, M['lua'], bucket=noi, rz=math.radians(-4))

# BIỂN NGANG 匾额 1,2×0,4 — tâm treo 2,2 m, khung vàng, 2 dây
box('bien', 1.20, 0.05, 0.40, 0, -2.02, 2.20, M['bien'], bucket=noi)
box('bien_vien_t', 1.24, 0.06, 0.05, 0, -2.02, 2.40, M['vang'], bucket=noi)
box('bien_vien_d', 1.24, 0.06, 0.05, 0, -2.02, 2.00, M['vang'], bucket=noi)
for s in (-1, 1):
    box(f'bien_vien_{s:+d}', 0.05, 0.06, 0.44, s * 0.62, -2.02, 2.20, M['vang'], bucket=noi)
    box(f'day_bien_{s:+d}', 0.025, 0.025, 0.34, s * 0.45, -2.02, 2.56, M['go'], bucket=noi)
# 2 ĐÈN LỒNG đỏ phát sáng (#FF4C00) hai bên biển — tránh khe NPC (x ±0,55)
for s in (-1, 1):
    sphere(f'den_lon_{s:+d}', 0.16, s * 0.55, -1.95, 2.30, M['den'])
    box(f'den_lon_{s:+d}_chep', 0.10, 0.10, 0.05, s * 0.55, -1.95, 2.44, M['go'], bucket=noi)
    box(f'den_lon_{s:+d}_day', 0.05, 0.05, 0.16, s * 0.55, -1.95, 2.52, M['go'], bucket=noi)
    box(f'den_lon_{s:+d}_tua', 0.05, 0.05, 0.16, s * 0.55, -1.95, 2.10, M['vang'], bucket=noi)
# đạo cụ: thớ cắt + kéo + ghế ngồi (tránh khe NPC x≥0,70)
box('tho_cat', 0.50, 0.34, 0.02, -0.40, -1.45, CTOP_Z + 0.01, M['giay'], bucket=noi)
for a in (-20, 20):
    box(f'keo_{a:+d}', 0.26, 0.02, 0.03, 0.18, -1.40, CTOP_Z + 0.025, M['sat'], bucket=noi, rz=math.radians(a))
box('ghe_ngoi', 0.36, 0.36, 0.06, 0.10, -0.55, 0.51, M['go_s'], bucket=noi)
for li in range(4):
    box(f'ghe_chan_{li}', 0.05, 0.05, 0.33, 0.10 + (-1 + 2 * (li % 2)) * 0.13,
        -0.55 + (-1 + 2 * (li // 2)) * 0.13, 0.325, M['go'], bucket=noi)

# ============================================================================
#  MESH 3 — tangy_mai: ngói ván xám 26° (hàng Array + sống Array), máng xối,
#            đuôi dòn (Array), ván bạt gió, bờ nóc đỉnh 3,80
# ============================================================================
def nrm(sign):                       # pháp tuyến hướng ra ngoài mái
    return (0.0, sign * SIN, COS)

def run_pt(sign, r):                 # tâm trên mặt dốc: r = chạy dốc từ mép mái
    return (sign * (HD - r * COS), EAVE_Z + r * SIN)

def slope_box(name, sx, sl, th, x, r, sign, mat, extra=0.0, rz=0.0):
    y, z = run_pt(sign, r)
    n = nrm(sign)
    return box(name, sx, sl, th, x, y + n[1] * extra, z + n[2] * extra, mat,
               bucket=mai, rx=-sign * SLOPE, rz=rz)

for sign, tag in ((-1, 't'), (1, 's')):
    # ván đá mái (lớp kín) + hàng ngói ván xen kẽ nắng bạc / nền xám (Array)
    # bước array = world, hướng LÊN DỐC: (0, −sign·0,84·cos26°, 0,84·sin26°)
    step = (0.0, -sign * 0.84 * COS, 0.84 * SIN)
    slope_box(f'van_dai_{tag}', 6.60, RUN, 0.05, 0, RUN / 2, sign, M['ngoi_a'])
    slope_box(f'ngoi_drip_{tag}', 6.50, 0.30, 0.07, 0, 0.15, sign, M['ngoi'], extra=0.065)
    arr(slope_box(f'ngoi_n_{tag}', 6.50, 0.46, 0.05, 0, 0.42, sign, M['ngoi_n'], extra=0.06),
        3, step)
    arr(slope_box(f'ngoi_x_{tag}', 6.50, 0.46, 0.05, 0, 0.84, sign, M['ngoi'], extra=0.06),
        2, step)
    # sống ngói dốc (1 sống + Array 12) + 2 mảng ngói sứt lộ đất nung
    arr(slope_box(f'song_ngoi_{tag}', 0.10, 2.24, 0.06, -3.02, 1.22, sign, M['ngoi_a'], extra=0.105),
        12, (0.55, 0.0, 0.0))
    slope_box(f'ngoi_sut1_{tag}', 0.26, 0.30, 0.045, -1.90, 0.75, sign, M['ngoi_s'],
              extra=0.095, rz=0.15)
    slope_box(f'ngoi_sut2_{tag}', 0.30, 0.26, 0.045, 2.30, 1.60, sign, M['ngoi_s'],
              extra=0.095, rz=-0.2)
    # máng xối + đuôi dòn lộ dưới mái (1 dòn + Array 12)
    box(f'mang_xoi_{tag}', 6.66, 0.16, 0.22, 0, sign * 2.01, 2.58, M['go'],
        bucket=mai, rx=-sign * SLOPE)
    arr(box(f'don_mai_{tag}', 0.08, 0.36, 0.09, -3.00, sign * 1.90, 2.49, M['go'],
            bucket=mai, rx=-sign * SLOPE), 12, (0.55, 0.0, 0.0))
    # ván bạt gió hai đầu núi (博风)
    slope_box(f'bat_gio_{tag}_L', 0.12, 2.30, 0.24, -3.24, RUN / 2, sign, M['go'], extra=0.02)
    slope_box(f'bat_gio_{tag}_R', 0.12, 2.30, 0.24, 3.24, RUN / 2, sign, M['go'], extra=0.02)
# đòn tay dưới mái (nóc + 2 giữa) + bờ nóc đỉnh 3,80 + 2 đầu bờ
cyl('don_noc', 0.09, 6.50, 0, 0, 3.58, M['go'], seg=8, bucket=mai, ry=math.pi / 2)
for s in (-1, 1):
    cyl(f'don_giua_{s:+d}', 0.08, 6.50, 0, s * 1.05, 3.06, M['go'], seg=8, bucket=mai, ry=math.pi / 2)
box('bo_noc', 6.66, 0.36, 0.25, 0, 0, CAP_TOP - 0.125, M['ngoi_a'], bucket=mai)
for s in (-1, 1):
    box(f'dau_bonoc_{s:+d}', 0.14, 0.30, 0.16, s * 3.24, 0, 3.71, M['ngoi_a'],
        bucket=mai, rz=s * math.radians(14))

# ============================================================================
#  GỘP 3 MESH, PHÁP TUYẾN, WELD, GIẢM NẾU VƯỢT NGÂN SÁCH, EXPORT GLB
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
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True); bpy.context.view_layer.objects.active = obj
    mod = obj.modifiers.new('weld_clean', 'WELD'); mod.merge_threshold = 0.0004
    bpy.ops.object.modifier_apply(modifier='weld_clean')
    return obj

def tri_count(obj):
    return sum(len(p.vertices) - 2 for p in obj.data.polygons)

meshes = [join_parts(than, 'tangy_than'), join_parts(noi, 'tangy_noi_that'),
          join_parts(mai, 'tangy_mai')]
tot = sum(tri_count(o) for o in meshes)
if tot > TRI_BUDGET:                                     # khống chế ngân sách (chỉ khi vượt)
    ratio = max(0.05, 0.94 * TRI_BUDGET / tot)
    for obj in meshes:
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True); bpy.context.view_layer.objects.active = obj
        dm = obj.modifiers.new('decimate_budget', 'DECIMATE')
        dm.ratio = ratio; dm.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier='decimate_budget')
    tot = sum(tri_count(o) for o in meshes)

try:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_yup=True)
except TypeError:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB')

print('LIB_SHOP_COUNTER ' + json.dumps({
    'out': OUT, 'tris': tot, 'budget': TRI_BUDGET,
    'tris_per_mesh': {o.name: tri_count(o) for o in meshes},
    'mats': sorted(m.name for m in bpy.data.materials),
    'bbox_du_kien': {'x': 6.74, 'y': 4.30, 'z': 3.80},
    'khe_npc': [GAP_X0, GAP_X1],
}, ensure_ascii=False))
