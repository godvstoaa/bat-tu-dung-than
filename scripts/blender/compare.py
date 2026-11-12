# Render các GLB cạnh nhau (cùng ánh sáng, cùng góc) để so bằng mắt: blender -b -P compare.py -- out.png a.glb b.glb ...
import bpy, sys, math
from mathutils import Vector
argv = sys.argv[sys.argv.index('--') + 1:]
OUT, FILES = argv[0], argv[1:]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; x = 0; W = 0
for i, f in enumerate(FILES):
    before = set(sc.objects); bpy.ops.import_scene.gltf(filepath=f); new = [o for o in sc.objects if o not in before]
    roots = [o for o in new if o.parent is None]
    pts = [o.matrix_world @ Vector(c) for o in new if o.type == 'MESH' for c in o.bound_box]
    w = max(p.x for p in pts) - min(p.x for p in pts); W = max(W, w)
    for r in roots: r.location.x += i * w * 1.15
sc.render.engine = 'CYCLES'; sc.cycles.samples = 48; sc.cycles.device = 'CPU'
sc.render.resolution_x, sc.render.resolution_y = 1600, 800
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.75, 0.8, 0.9, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.6
sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sun.data.energy = 3.5; sun.rotation_euler = (math.radians(50), 0, math.radians(35)); sc.collection.objects.link(sun)
n = len(FILES); cx = (n - 1) * W * 1.15 / 2
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
cam.location = (cx + W * 0.5, -W * (1.6 + 0.9 * n), W * 1.1)
d = Vector((cx, 0, W * 0.3)) - cam.location; cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
cam.data.lens = 50
sc.render.filepath = OUT; bpy.ops.render.render(write_still=True)
