# -*- coding: utf-8 -*-
"""preview_glb.py — render GLB bằng Workbench (màu material) để kiểm trực quan.
Dùng: blender -b --python preview_glb.py -- --glb <in.glb> --png <out.png> --az <deg>"""
import bpy
import math
import sys
import mathutils

argv = sys.argv
GLB = argv[argv.index('--glb') + 1]
PNG = argv[argv.index('--png') + 1]
AZ = float(argv[argv.index('--az') + 1]) if '--az' in argv else 35.0
EL = float(argv[argv.index('--el') + 1]) if '--el' in argv else 12.0

for ob in list(bpy.data.objects):
    bpy.data.objects.remove(ob, do_unlink=True)

bpy.ops.import_scene.gltf(filepath=GLB)

# bbox toàn cảnh
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
d = size * 1.6
pos = mathutils.Vector((ctr[0] + d * math.sin(math.radians(AZ)) * math.cos(math.radians(EL)),
                        ctr[1] - d * math.cos(math.radians(AZ)) * math.cos(math.radians(EL)),
                        ctr[2] + d * math.sin(math.radians(EL))))
cam.location = pos
direction = mathutils.Vector(ctr) - pos
cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
bpy.context.scene.camera = cam

scn = bpy.context.scene
scn.render.engine = 'BLENDER_WORKBENCH'
scn.display.shading.light = 'STUDIO'
scn.display.shading.color_type = 'MATERIAL'
scn.render.resolution_x = 1100
scn.render.resolution_y = 700
scn.render.filepath = PNG
scn.render.film_transparent = False
bpy.ops.render.render(write_still=True)
print('PREVIEW %s -> %s  bbox %s..%s' % (GLB, PNG, tuple(round(v, 2) for v in mn), tuple(round(v, 2) for v in mx)))
