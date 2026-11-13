# -*- coding: utf-8 -*-
"""preview_glb_lit.py — render GLB bằng Cycles CPU (có texture/palette) để so màu.
Dùng: blender -b --python preview_glb_lit.py -- --glb <in.glb> --png <out.png> --az <deg> --el <deg>"""
import bpy
import math
import sys
import mathutils

argv = sys.argv
GLB = argv[argv.index('--glb') + 1]
PNG = argv[argv.index('--png') + 1]
AZ = float(argv[argv.index('--az') + 1]) if '--az' in argv else 30.0
EL = float(argv[argv.index('--el') + 1]) if '--el' in argv else 25.0

for ob in list(bpy.data.objects):
    bpy.data.objects.remove(ob, do_unlink=True)

bpy.ops.import_scene.gltf(filepath=GLB)

mn = [1e9] * 3
mx = [-1e9] * 3
for ob in bpy.context.scene.objects:
    if ob.type != 'MESH':
        continue
    for c in ob.bound_box:
        w = ob.matrix_world @ mathutils.Vector(c)
        for i in range(3):
            mn[i] = min(mn[i], w[i]); mx[i] = max(mx[i], w[i])
ctr = tuple((mn[i] + mx[i]) / 2.0 for i in range(3))
size = max(mx[i] - mn[i] for i in range(3))

cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam'))
bpy.context.scene.collection.objects.link(cam)
d = size * 1.55
pos = mathutils.Vector((ctr[0] + d * math.sin(math.radians(AZ)) * math.cos(math.radians(EL)),
                        ctr[1] - d * math.cos(math.radians(AZ)) * math.cos(math.radians(EL)),
                        ctr[2] + d * math.sin(math.radians(EL))))
cam.location = pos
direction = mathutils.Vector(ctr) - pos
cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
bpy.context.scene.camera = cam

# nắng + trời âm
sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN'))
sun.data.energy = 3.0
sun.data.angle = 0.02
sun.rotation_euler = (math.radians(50.0), 0.0, math.radians(30.0))
bpy.context.scene.collection.objects.link(sun)
bpy.context.scene.world = bpy.data.worlds.new('w')
bpy.context.scene.world.use_nodes = True
bg = bpy.context.scene.world.node_tree.nodes['Background']
bg.inputs['Color'].default_value = (0.55, 0.62, 0.75, 1.0)
bg.inputs['Strength'].default_value = 0.7

scn = bpy.context.scene
scn.render.engine = 'CYCLES'
scn.cycles.device = 'CPU'
scn.cycles.samples = 48
scn.render.resolution_x = 880
scn.render.resolution_y = 560
scn.render.film_transparent = False
scn.render.filepath = PNG
bpy.ops.render.render(write_still=True)
print('LITPREVIEW %s -> %s' % (GLB, PNG))
