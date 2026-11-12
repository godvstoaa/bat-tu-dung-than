# ============================================================================
#  BLENDER: model Meshy nặng (~80k tam giác) → bản nhẹ nướng lại (docs/DOHOA-MANIFEST.md §3)
#    giảm lưới (decimate) → trải UV mới → nướng MÀU + PHÁP TUYẾN từ bản gốc sang bản nhẹ
#    (selected-to-active) → nướng AO lên chính bản nhẹ, nhân vào màu → xuất GLB.
#  Chạy:  blender -b -P scripts/blender/bake-lod.py -- <src.glb> <out.glb> <số tam giác> [texture px] [ao 0..1]
#  In một dòng JSON kết quả (BAKE {...}) để script Node đọc.
# ============================================================================
import bpy, sys, json, time, math
import numpy as np
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
SRC, OUT, TARGET = argv[0], argv[1], int(argv[2])
TEX = int(argv[3]) if len(argv) > 3 else 1024
AO_K = float(argv[4]) if len(argv) > 4 else 0.55
VOX = float(argv[5]) if len(argv) > 5 else 0.0035  # cỡ voxel / cỡ model
FORCE_VOX = len(argv) > 6 and argv[6] == 'voxel'  # bỏ qua nhánh collapse (lưới bị xé thành mảnh vụn — bq_apothecary, bq_yamen)
t0 = time.time()

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
sc = bpy.context.scene
meshes = [o for o in sc.objects if o.type == 'MESH']
# bỏ cha (giữ biến đổi) rồi áp biến đổi → mọi lưới ở toạ độ thế giới, gộp làm một
for o in sc.objects: o.select_set(o.type == 'MESH')
bpy.context.view_layer.objects.active = meshes[0]
bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
if len(meshes) > 1: bpy.ops.object.join()
hi = bpy.context.view_layer.objects.active; hi.name = 'hi'
for o in list(sc.objects):
    if o.type != 'MESH': bpy.data.objects.remove(o)
tri_hi = sum(len(p.vertices) - 2 for p in hi.data.polygons)
bb = [hi.matrix_world @ Vector(c) for c in hi.bound_box]
size = max((max(v[i] for v in bb) - min(v[i] for v in bb)) for i in range(3))

# --- bản nhẹ
lo = hi.copy(); lo.data = hi.data.copy(); lo.name = 'lo'; sc.collection.objects.link(lo)
for o in sc.objects: o.select_set(False)
lo.select_set(True); bpy.context.view_layer.objects.active = lo
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.remove_doubles(threshold=size * 0.0004)  # Meshy hay tách đỉnh theo UV → nối lại cho decimate gọn
bpy.ops.object.mode_set(mode='OBJECT')
tri_m = sum(len(p.vertices) - 2 for p in lo.data.polygons)
# UV / pháp tuyến tuỳ chỉnh cũ ghìm cạnh (collapse không gộp qua đường nối UV) → xoá trước, sẽ trải UV mới
for uv in list(lo.data.uv_layers): lo.data.uv_layers.remove(uv)
try: bpy.ops.mesh.customdata_custom_splitnormals_clear()
except Exception: pass
for a in [a.name for a in lo.data.color_attributes]: lo.data.color_attributes.remove(lo.data.color_attributes[a])
if tri_m > TARGET:
    # bước 1: gộp mặt phẳng (tường / sàn phẳng không cần nhiều tam giác), bước 2: collapse tới đích
    m = lo.modifiers.new('pl', 'DECIMATE'); m.decimate_type = 'DISSOLVE'; m.angle_limit = math.radians(2.5)
    bpy.ops.object.modifier_apply(modifier='pl')
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.quads_convert_to_tris(); bpy.ops.object.mode_set(mode='OBJECT')
    t1 = len(lo.data.polygons); print('STEP after dissolve+tri', tri_m, '->', t1)
    if t1 > TARGET:
        for it in range(3):
            n = len(lo.data.polygons)
            if n <= TARGET * 1.05: break
            m = lo.modifiers.new('dc', 'DECIMATE'); m.ratio = TARGET / n; m.use_collapse_triangulate = True
            bpy.ops.object.modifier_apply(modifier='dc'); print('STEP collapse', it, n, '->', len(lo.data.polygons))
if FORCE_VOX or len(lo.data.polygons) > TARGET * 1.3:
    # lưới AI nhiều cạnh lỗi đa tạp (mặt gập chồng) → collapse kẹt. Dựng lại lưới kín bằng voxel rồi giảm;
    # chi tiết bề mặt lấy lại nhờ nướng màu + pháp tuyến từ bản gốc.
    print('STEP voxel fallback', len(lo.data.polygons))
    lo.data = hi.data.copy()
    for uv in list(lo.data.uv_layers): lo.data.uv_layers.remove(uv)
    m = lo.modifiers.new('rm', 'REMESH'); m.mode = 'VOXEL'; m.voxel_size = size * VOX; m.use_smooth_shade = False
    bpy.ops.object.modifier_apply(modifier='rm'); print('STEP voxel', len(lo.data.polygons))
    for it in range(4):
        n = len(lo.data.polygons)
        if n <= TARGET * 1.05: break
        m = lo.modifiers.new('dc', 'DECIMATE'); m.ratio = TARGET / n; m.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier='dc'); print('STEP vcollapse', it, n, '->', len(lo.data.polygons))
tri_lo = sum(len(p.vertices) - 2 for p in lo.data.polygons)
lo.data.uv_layers.new(name='UVMap')
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.004, area_weight=0.0, scale_to_bounds=True)
bpy.ops.uv.pack_islands(margin=0.003, rotate=True)
bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.shade_smooth()  # pháp tuyến chi tiết nằm ở normal map nướng

# --- vật liệu nướng
def img(name, color, noncolor=False):
    im = bpy.data.images.new(name, TEX, TEX, alpha=False, float_buffer=False)
    im.generated_color = color
    if noncolor: im.colorspace_settings.name = 'Non-Color'
    return im
I_COL, I_NOR, I_AO = img('col', (0.5, 0.5, 0.5, 1)), img('nor', (0.5, 0.5, 1, 1), True), img('ao', (1, 1, 1, 1), True)
mat = bpy.data.materials.new('baked'); mat.use_nodes = True
nt = mat.node_tree; bsdf = nt.nodes['Principled BSDF']
tex_nodes = {}
for k, im in (('col', I_COL), ('nor', I_NOR), ('ao', I_AO)):
    n = nt.nodes.new('ShaderNodeTexImage'); n.image = im; tex_nodes[k] = n
lo.data.materials.clear(); lo.data.materials.append(mat)

sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 16; sc.cycles.use_denoising = False
bk = sc.render.bake; bk.margin = 6; bk.use_clear = True
ext = size * 0.012
def bake(kind, node, sel2act=True, **kw):
    for n in nt.nodes: n.select = False
    node.select = True; nt.nodes.active = node
    for o in sc.objects: o.select_set(False)
    if sel2act: hi.select_set(True)
    lo.select_set(True); bpy.context.view_layer.objects.active = lo
    bpy.ops.object.bake(type=kind, use_selected_to_active=sel2act, cage_extrusion=ext if sel2act else 0, max_ray_distance=ext * 4 if sel2act else 0, **kw)
bake('DIFFUSE', tex_nodes['col'], pass_filter={'COLOR'})
bake('NORMAL', tex_nodes['nor'], normal_space='TANGENT')
# AO trên chính bản nhẹ (hi ẩn khỏi render để không che), khoảng tia theo cỡ model
hi.hide_render = True
if sc.world is None: sc.world = bpy.data.worlds.new('w')
sc.world.light_settings.distance = size * 0.12
sc.cycles.samples = 64
bake('AO', tex_nodes['ao'], sel2act=False)
hi.hide_render = False

# --- nhân AO vào màu (AO_K: độ đậm), ghi ảnh → nối nút cho xuất GLB
c = np.array(I_COL.pixels[:]).reshape(-1, 4); a = np.array(I_AO.pixels[:]).reshape(-1, 4)[:, :1]
c[:, :3] *= (1 - AO_K) + AO_K * a
I_COL.pixels[:] = c.ravel()
for im, fmt in ((I_COL, 'JPEG'), (I_NOR, 'JPEG')):
    im.filepath_raw = f'//{im.name}.{fmt.lower()}'; im.file_format = fmt
nt.links.new(tex_nodes['col'].outputs['Color'], bsdf.inputs['Base Color'])
nm = nt.nodes.new('ShaderNodeNormalMap'); nt.links.new(tex_nodes['nor'].outputs['Color'], nm.inputs['Color']); nt.links.new(nm.outputs['Normal'], bsdf.inputs['Normal'])
nt.nodes.remove(tex_nodes['ao'])
bsdf.inputs['Roughness'].default_value = 0.82; bsdf.inputs['Metallic'].default_value = 0.0

bpy.data.objects.remove(hi)
for o in sc.objects: o.select_set(o == lo)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True, export_image_format='JPEG', export_jpeg_quality=88,
                          export_apply=True, export_yup=True, export_texcoords=True, export_normals=True, export_tangents=False)
print('BAKE ' + json.dumps({'src': SRC, 'out': OUT, 'tri_hi': tri_hi, 'tri_lo': tri_lo, 'size': round(size, 2), 'tex': TEX, 'sec': round(time.time() - t0, 1)}))
