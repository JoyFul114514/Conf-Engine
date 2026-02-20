# ----------------------------------------------------------------
# FlexGLTF Blender Add-on ( v2.20.15.41 )
# 
# This Source Code Form is subject to the terms of the Mozilla Public 
# License, v. 2.0. If a copy of the MPL was not distributed with this 
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
# 
# Copyright (c) 2026 Joy_Ful.
# ----------------------------------------------------------------

import bpy
import json
import os
from mathutils import Matrix

def format_num(n):
    return float(f"{n:.6f}")

def export_flex_final_standard(target_path):
    model_id = os.path.splitext(os.path.basename(target_path))[0]
    scene_data = {
        "model_id": model_id, 
        "meshes": [],
        "skeletons": {"bone_names": [], "parent_indices": [], "all_bind_matrices": [], "bone_count": 0},
        "animations": {}
    }
    
    # Z-up --> Y-up
    axis_switch = Matrix(((1, 0, 0, 0),
                          (0, 0, 1, 0),
                          (0, -1, 0, 0),
                          (0, 0, 0, 1)))

    arm = next((o for o in bpy.context.selected_objects if o.type == 'ARMATURE'), 
               next((o for o in bpy.data.objects if o.type == 'ARMATURE'), None))
    
    if arm:
        bpy.context.view_layer.objects.active = arm
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        
        bones = arm.pose.bones
        scene_data["skeletons"]["bone_count"] = len(bones)
        
        world_mats_webgl = {}
        for pb in bones:
            gl_mat = axis_switch @ pb.bone.matrix_local
            world_mats_webgl[pb.name] = gl_mat

        for pb in bones:
            scene_data["skeletons"]["bone_names"].append(pb.name)
            p_idx = arm.pose.bones.find(pb.parent.name) if pb.parent else -1
            scene_data["skeletons"]["parent_indices"].append(p_idx)
            
            if pb.parent:
                parent_mat_gl = world_mats_webgl[pb.parent.name]
                local_mat = parent_mat_gl.inverted() @ world_mats_webgl[pb.name]
            else:
                local_mat = world_mats_webgl[pb.name]
            
            t, r, s = local_mat.decompose()
            clean_mat = Matrix.Translation(t) @ r.to_matrix().to_4x4()
            clean_mat_transposed = clean_mat.transposed()
            scene_data["skeletons"]["all_bind_matrices"].extend(
                [format_num(v) for row in clean_mat_transposed for v in row]
            )

        if arm.animation_data:
            original_action = arm.animation_data.action
            original_frame = bpy.context.scene.frame_current
            fps = bpy.context.scene.render.fps

            for action in bpy.data.actions:
                arm.animation_data.action = action
                start_f = int(action.frame_range[0])
                end_f = int(action.frame_range[1])
                duration = format_num((end_f - start_f) / fps)
                
                action_data = {"duration": duration, "tracks": []}

                for b_idx, b_name in enumerate(scene_data["skeletons"]["bone_names"]):
                    pb = arm.pose.bones.get(b_name)
                    if not pb: continue
                    
                    track_t, track_r, track_times = [], [], []
                    has_motion = False # 判断偏离默认姿态
                    
                    for f in range(start_f, end_f + 1):
                        bpy.context.scene.frame_set(f)
                        # 获取相对于 Rest Pose 的局部增量
                        loc, rot, sca = pb.matrix_basis.decompose()
                        
                        # 平移!= 0 ?
                        is_moved = loc.length > 0.0001
                        # 旋转!= (0,0,0,1) ?
                        is_rotated = abs(rot.x) > 0.0001 or abs(rot.y) > 0.0001 or abs(rot.z) > 0.0001 or abs(rot.w - 1.0) > 0.0001
                        
                        if is_moved or is_rotated:
                            has_motion = True
                        
                        # sampler
                        track_times.append(format_num((f - start_f) / fps))
                        track_t.extend([format_num(loc.x), format_num(loc.y), format_num(loc.z)])
                        track_r.extend([format_num(rot.x), format_num(rot.y), format_num(rot.z), format_num(rot.w)])
                    
                    if has_motion:
                        action_data["tracks"].append({
                            "b_idx": b_idx,
                            "interpolation": "LINEAR",
                            "t": track_t,
                            "r": track_r,
                            "times": track_times
                        })
                
                scene_data["animations"][action.name] = action_data

            arm.animation_data.action = original_action
            bpy.context.scene.frame_set(original_frame)

    for original_obj in [o for o in bpy.context.selected_objects if o.type == 'MESH']:
        temp_obj = original_obj.copy()
        temp_obj.data = original_obj.data.copy()
        bpy.context.collection.objects.link(temp_obj)
        bpy.context.view_layer.objects.active = temp_obj
        
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        bpy.ops.object.modifier_add(type='TRIANGULATE')
        
        depsgraph = bpy.context.evaluated_depsgraph_get()
        mesh_eval = temp_obj.evaluated_get(depsgraph).to_mesh()
        
        tex_name = "None"
        if temp_obj.active_material and temp_obj.active_material.use_nodes:
            tex_node = next((n for n in temp_obj.active_material.node_tree.nodes if n.type == 'TEX_IMAGE'), None)
            if tex_node and tex_node.image:
                tex_name = tex_node.image.name

        vgroup_to_global = {vg.index: scene_data["skeletons"]["bone_names"].index(vg.name) 
                           for vg in temp_obj.vertex_groups if vg.name in scene_data["skeletons"]["bone_names"]}
        
        used_bones = set()
        for v in mesh_eval.vertices:
            for g in v.groups:
                if g.group in vgroup_to_global: 
                    used_bones.add(vgroup_to_global[g.group])
        
        used_bones_list = sorted(list(used_bones))
        if not used_bones_list: 
            used_bones_list = [0]
        mesh_handles = used_bones_list
        g_to_l = {g_id: i for i, g_id in enumerate(mesh_handles)}

        v_list, uv_list, b_idx_list, b_wt_list = [], [], [], []
        uv_layer = mesh_eval.uv_layers.active.data if mesh_eval.uv_layers.active else None

        for poly in mesh_eval.polygons:
            for loop_idx in poly.loop_indices:
                v_idx = mesh_eval.loops[loop_idx].vertex_index
                vert = mesh_eval.vertices[v_idx]
                v_webgl = axis_switch @ vert.co
                v_list.extend([format_num(v_webgl.x), format_num(v_webgl.y), format_num(v_webgl.z)])
                uv = uv_layer[loop_idx].uv if uv_layer else (0,0)
                uv_list.extend([format_num(uv.x), format_num(1.0 - uv.y)])
                
                v_b_indices = [0] * 4
                v_b_weights = [0.0] * 4
                groups = sorted(vert.groups, key=lambda g: g.weight, reverse=True)[:4]
                for i, g in enumerate(groups):
                    if g.group in vgroup_to_global:
                        global_bone_id = vgroup_to_global[g.group]
                        if global_bone_id in g_to_l:
                            v_b_indices[i] = g_to_l[global_bone_id]
                            v_b_weights[i] = g.weight
                sum_w = sum(v_b_weights)
                if sum_w > 0:
                    v_b_weights = [w/sum_w for w in v_b_weights]
                else:
                    v_b_weights = [1.0, 0.0, 0.0, 0.0]

                b_idx_list.extend(v_b_indices)
                b_wt_list.extend([format_num(w) for w in v_b_weights])

        scene_data["meshes"].append({
            "name": temp_obj.name.split('.')[0], 
            "mat": temp_obj.active_material.name if temp_obj.active_material else "Default",
            "tex": tex_name,
            "v": v_list, 
            "uv": uv_list, 
            "b_idx": b_idx_list,
            "b_wt": b_wt_list, 
            "handles": mesh_handles
        })
        bpy.data.objects.remove(temp_obj, do_unlink=True)

    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(scene_data, f, separators=(',', ':'))

export_flex_final_standard(r"C:\Conf-Engine3\assets\sample.json")