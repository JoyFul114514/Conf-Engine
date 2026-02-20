/**
 * FlexGLTF Extension for Scratch ( v2.20.13.17 DEBUG )
 * * This Source Code Form is subject to the terms of the Mozilla Public 
 * License, v. 2.0. If a copy of the MPL was not distributed with this 
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * * Copyright (c) 2026 Joy_Ful. All rights reserved.
 * * 中文说明：本文件（FlexGLTF 扩展）受 Mozilla Public License 2.0 (MPL 2.0) 保护。
 * 允许在商业或闭源项目中使用，但对本文件的任何修改必须保持开源。
 */

(function (Scratch) {
    'use strict';

    function inverse(m) {
        const out = new Float32Array(16);
        const m00 = m[0], m01 = m[1], m02 = m[2], m03 = m[3], m10 = m[4], m11 = m[5], m12 = m[6], m13 = m[7], m20 = m[8], m21 = m[9], m22 = m[10], m23 = m[11], m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];
        const b00 = m00 * m11 - m01 * m10, b01 = m00 * m12 - m02 * m10, b02 = m00 * m13 - m03 * m10, b03 = m01 * m12 - m02 * m11, b04 = m01 * m13 - m03 * m11, b05 = m02 * m13 - m03 * m12, b06 = m20 * m31 - m21 * m30, b07 = m20 * m32 - m22 * m30, b08 = m20 * m33 - m23 * m30, b09 = m21 * m32 - m22 * m31, b10 = m21 * m33 - m23 * m31, b11 = m22 * m33 - m23 * m32;
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) return null;
        det = 1.0 / det;
        out[0] = (m11 * b11 - m12 * b10 + m13 * b09) * det; out[1] = (m02 * b10 - m01 * b11 - m03 * b09) * det; out[2] = (m31 * b05 - m32 * b04 + m33 * b03) * det; out[3] = (m22 * b04 - m21 * b05 - m23 * b03) * det;
        out[4] = (m12 * b08 - m10 * b11 - m13 * b07) * det; out[5] = (m00 * b11 - m02 * b08 + m03 * b07) * det; out[6] = (m32 * b02 - m30 * b11 - m33 * b01) * det; out[7] = (m20 * b11 - m22 * b02 + m23 * b01) * det;
        out[8] = (m10 * b10 - m11 * b08 + m13 * b06) * det; out[9] = (m01 * b08 - m00 * b10 - m03 * b06) * det; out[10] = (m30 * b10 - m31 * b02 + m33 * b00) * det; out[11] = (m21 * b02 - m20 * b10 - m23 * b00) * det;
        out[12] = (m11 * b07 - m10 * b09 - m12 * b06) * det; out[13] = (m00 * b09 - m01 * b07 + m02 * b06) * det; out[14] = (m31 * b01 - m30 * b05 - m32 * b00) * det; out[15] = (m20 * b05 - m21 * b01 + m22 * b00) * det;
        return out;
    }

    const m4 = {
        identity: () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
        multiply: (a, b) => {
            const out = new Float32Array(16);
            const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
            let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
            out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30; out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31; out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32; out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
            out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30; out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31; out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32; out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
            out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30; out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31; out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32; out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
            out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30; out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31; out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32; out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            return out;
        },
        // 球面线性插值Slerp 平滑旋转
        slerp: (a, b, t) => {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3];
            let bx = b[0], by = b[1], bz = b[2], bw = b[3];
            let cosom = ax * bx + ay * by + az * bz + aw * bw;
            if (cosom < 0) { cosom = -cosom; bx = -bx; by = -by; bz = -bz; bw = -bw; }
            let s0, s1;
            if (1.0 - cosom > 0.000001) {
                let omega = Math.acos(cosom), sinom = Math.sin(omega);
                s0 = Math.sin((1.0 - t) * omega) / sinom; s1 = Math.sin(t * omega) / sinom;
            } else { s0 = 1.0 - t; s1 = t; }
            return [s0 * ax + s1 * bx, s0 * ay + s1 * by, s0 * az + s1 * bz, s0 * aw + s1 * bw];
        },

        // 线性插值Lerp 平滑位移
        lerp: (a, b, t) => [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]), a[2] + t * (b[2] - a[2])],

        // TRS --> 4x4 列主序矩阵
        fromRotationTranslation: (q, t) => {
            const out = new Float32Array(16);
            const x = q[0], y = q[1], z = q[2], w = q[3];
            const x2 = x + x, y2 = y + y, z2 = z + z;
            const xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2;
            const wx = w * x2, wy = w * y2, wz = w * z2;
            out[0] = 1 - (yy + zz); out[1] = xy + wz; out[2] = xz - wy; out[3] = 0;
            out[4] = xy - wz; out[5] = 1 - (xx + zz); out[6] = yz + wx; out[7] = 0;
            out[8] = xz + wy; out[9] = yz - wx; out[10] = 1 - (xx + yy); out[11] = 0;
            out[12] = t[0]; out[13] = t[1]; out[14] = t[2]; out[15] = 1;
            return out;
        }
    };

    let models = {};
    let modelOrder = [];

    class FlexGLTF {
        _lp(v) {
            if (Array.isArray(v) || v instanceof Float32Array) return Array.from(v).map(x => Math.round(x * 1000000) / 1000000);
            return Math.round(v * 1000000) / 1000000;
        }

        getInfo() {
            return {
                id: 'flexGLTF',
                name: 'Flex GLTF',
                color1: '#7db4b2',
                blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: "场景&内存" },
                    { opcode: 'parseScene', blockType: Scratch.BlockType.COMMAND, text: '解析模型 JSON [STR]', arguments: { STR: { type: 'string', defaultValue: '{}' } } },
                    { opcode: 'flushModel', blockType: Scratch.BlockType.COMMAND, text: '释放模型 [MI] 顶点缓存', arguments: { MI: { type: 'number', defaultValue: 0 } } },
                    { opcode: 'clearAll', blockType: Scratch.BlockType.COMMAND, text: '释放所有' },
                    { blockType: Scratch.BlockType.LABEL, text: "索引映射" },
                    { opcode: 'getModelCount', blockType: Scratch.BlockType.REPORTER, text: '总模型数' },
                    { opcode: 'getModelID', blockType: Scratch.BlockType.REPORTER, text: '索引 [MI] 的模型 ID', arguments: { MI: { type: 'number', defaultValue: 0 } } },
                    { opcode: 'getModelIndex', blockType: Scratch.BlockType.REPORTER, text: 'ID [MID] 的模型索引', arguments: { MID: { type: 'string', defaultValue: 'model_1' } } },
                    { opcode: 'getMeshIndex', blockType: Scratch.BlockType.REPORTER, text: '模型 [MI] 中网格名为 [MN] 的索引', arguments: { MI: { type: 'number', defaultValue: 0 }, MN: { type: 'string', defaultValue: '' } } },
                    { blockType: Scratch.BlockType.LABEL, text: "网格数据" },
                    { opcode: 'getMeshCount', blockType: Scratch.BlockType.REPORTER, text: '模型 [MI] 的网格数量', arguments: { MI: { type: 'number', defaultValue: 0 } } },
                    { opcode: 'getMeshInfo', blockType: Scratch.BlockType.REPORTER, text: '获取模型 [MI] 网格 [MSI] 的 [INFO]', arguments: { MI: { type: 'number', defaultValue: 0 }, MSI: { type: 'number', defaultValue: 0 }, INFO: { type: 'string', menu: 'meshMenu' } } },
                    { blockType: Scratch.BlockType.LABEL, text: "骨骼控制" },
                    { opcode: 'setBonePose', blockType: Scratch.BlockType.COMMAND, text: '设置模型 [MI] 骨骼 [BI] 局部矩阵 [MAT]', arguments: { MI: { type: 'number', defaultValue: 0 }, BI: { type: 'number', defaultValue: 0 }, MAT: { type: 'string', defaultValue: '[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]' } } },
                    { opcode: 'updateHierarchy', blockType: Scratch.BlockType.COMMAND, text: '更新模型 [MI] 的骨骼层级继承计算', arguments: { MI: { type: 'number', defaultValue: 0 } } },
                    { opcode: 'getSkinningMatrices', blockType: Scratch.BlockType.REPORTER, text: '获取模型 [MI] 网格 [MSI] 的 [TYPE] 绑定骨骼矩阵流', arguments: { MI: { type: 'number', defaultValue: 0 }, MSI: { type: 'number', defaultValue: 0 }, TYPE: { type: 'string', menu: 'poseMenu', defaultValue: '当前' } } },
                    { blockType: Scratch.BlockType.LABEL, text: "骨骼数据" },
                    { opcode: 'getBoneCount', blockType: Scratch.BlockType.REPORTER, text: '模型 [MI] 的骨骼总数', arguments: { MI: { type: 'number', defaultValue: 0 } } },
                    { opcode: 'getBoneInfo', blockType: Scratch.BlockType.REPORTER, text: '获取模型 [MI] 骨骼 [BI] 的 [INFO]', arguments: { MI: { type: 'number', defaultValue: 0 }, BI: { type: 'number', defaultValue: 0 }, INFO: { type: 'string', menu: 'boneMenu' } } },
                    { blockType: Scratch.BlockType.LABEL, text: "动画数据" },
                    { opcode: 'activateAnimation', blockType: Scratch.BlockType.COMMAND, text: '模型 [MI] 激活动画 [NAME]', arguments: { MI: { type: 'number', defaultValue: 0 }, NAME: { type: 'string', defaultValue: 'Run' } } },
                    { opcode: 'setAnimationTime', blockType: Scratch.BlockType.COMMAND, text: '模型 [MI] 设置激活动画时刻 [TIME]', arguments: { MI: { type: 'number', defaultValue: 0 }, TIME: { type: 'number', defaultValue: 0 } } },
                    {opcode: 'hasAnimationTrack',blockType: Scratch.BlockType.BOOLEAN,text: '模型 [MI] 骨骼 [BI] 当前动画有轨道？',arguments: {MI: { type: 'number', defaultValue: 0 },BI: { type: 'number', defaultValue: 0 }}},
                    { opcode: 'getActiveAnimMatrix', blockType: Scratch.BlockType.REPORTER, text: '获取模型 [MI] 骨骼 [BI] 的激活动画增量矩阵', arguments: { MI: { type: 'number', defaultValue: 0 }, BI: { type: 'number', defaultValue: 0 } } },
                    { blockType: Scratch.BlockType.LABEL, text: "调试 v2.20.13.17 DEBUG" },
                    { opcode: 'combineListToMatrixString', blockType: Scratch.BlockType.REPORTER, text: '合并列表 [LIST] 为矩阵字符串', arguments: { LIST: { type: 'string', defaultValue: 'list' } } },
                    { opcode: 'getDebugData', blockType: Scratch.BlockType.REPORTER, text: '获取模型 [MI] 骨骼 [BI] 的 [DINFO]', arguments: { MI: { type: 'number', defaultValue: 0 }, BI: { type: 'number', defaultValue: 0 }, DINFO: { type: 'string', menu: 'debugMenu' } } }
                ],
                menus: {
                    meshMenu: { items: ['name', 'material_name', 'texture_name', 'position', 'uv', 'bone_indices', 'bone_weights'] },
                    boneMenu: { items: ['bone_id', 'parent_index', 'original_matrix'] },
                    poseMenu: { items: ['当前', '初始'] },
                    debugMenu: { items: ['增量矩阵', '当前全局矩阵', '默认全局矩阵', '父级索引'] }
                }
            };
        }

        parseScene(args) {
            try {
                const json = JSON.parse(args.STR);
                const mid = json.model_id;
                const skel = json.skeletons
                let nodes = [];
                for (let i = 0; i < skel.bone_count; i++) {
                    nodes.push({
                        bindLocal: new Float32Array(skel.all_bind_matrices.slice(i * 16, i * 16 + 16)),
                        incrementLocal: m4.identity(), world: m4.identity(), bindWorld: m4.identity(),
                        invBindWorld: m4.identity(), skinMatrix: m4.identity(), parent: skel.parent_indices[i]
                    });
                }
                nodes.forEach((n) => { // 初始骨骼矩阵（全局坐标系） 局部骨骼矩阵（局部坐标系） 当前骨骼矩阵（全局坐标系）
                    if (n.parent === -1) n.bindWorld.set(n.bindLocal);
                    else n.bindWorld.set(m4.multiply(nodes[n.parent].bindWorld, n.bindLocal));
                    const inv = inverse(n.bindWorld);
                    if (inv) n.invBindWorld.set(inv);
                    n.world.set(n.bindWorld);
                });
                // 去掉了对大型数组使用 JSON.stringify，直接存储原始数据
                let meshes = json.meshes.map(m => ({
                    name: m.name, mat: m.mat, tex: m.tex || "None", handles: m.handles,
                    geo: { position: m.v, uv: m.uv, bone_indices: m.b_idx, bone_weights: m.b_wt }
                }));
                models[mid] = {
                    meshes, nodes, skel,
                    animations: json.animations || {}, // Animation
                    activeAnim: "",
                    activeTime: 0
                };

                if (!modelOrder.includes(mid)) modelOrder.push(mid);
            } catch (e) { console.error(e); }
        }

        getMeshInfo(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            if (!m || !m.meshes[args.MSI]) return "";
            const mesh = m.meshes[args.MSI];
            if (args.INFO === 'name') return mesh.name;
            if (args.INFO === 'material_name') return mesh.mat;
            if (args.INFO === 'texture_name') return mesh.tex; // 返回贴图名

            // 只有在请求几何数据时才进行转换
            const data = mesh.geo[args.INFO];
            if (Array.isArray(data)) return JSON.stringify(this._lp(data));
            return data || "[]";
        }

        setBonePose(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            if (m && m.nodes[args.BI]) {
                try {
                    const matData = JSON.parse(args.MAT);
                    if (Array.isArray(matData) && matData.length === 16) m.nodes[args.BI].incrementLocal.set(matData);
                } catch (e) { }
            }
        }

        updateHierarchy(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            if (!m) return;
            m.nodes.forEach((n) => {
                const local = m4.multiply(n.bindLocal, n.incrementLocal);
                if (n.parent === -1) n.world.set(local);
                else n.world.set(m4.multiply(m.nodes[n.parent].world, local));
                n.skinMatrix.set(m4.multiply(n.world, n.invBindWorld));
            });
        }

        getSkinningMatrices(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            if (!m || !m.meshes[args.MSI]) return "[]";
            let out = [];

            m.meshes[args.MSI].handles.forEach(idx => {
                const node = m.nodes[idx];
                // original和current都是该模型绑定的四个骨骼的全局绝对坐标系下的矩阵，只不过current是所有父级作用过后的新矩阵
                const mat = (args.TYPE === '默认')
                    ? m4.multiply(node.bindWorld, node.invBindWorld)
                    : node.skinMatrix;
                out.push(...Array.from(mat));
            });
            return JSON.stringify(out.map(v => Math.round(v * 1000000) / 1000000));
        }

        getBoneInfo(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            if (!m || !m.nodes[args.BI]) return "";
            if (args.INFO === 'original_matrix') return JSON.stringify(this._lp(m.nodes[args.BI].bindWorld));
            if (args.INFO === 'bone_id') return m.skel.bone_names[args.BI];
            if (args.INFO === 'parent_index') return m.skel.parent_indices[args.BI];
            return "";
        }

        activateAnimation(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            if (m) m.activeAnim = String(args.NAME);
        }

        setAnimationTime(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            if (m) m.activeTime = Number(args.TIME);
        }

        hasAnimationTrack(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            // 模型是否存在
            if (!m || !m.activeAnim || !m.animations[m.activeAnim]) return false;
            const anim = m.animations[m.activeAnim];
            return anim.tracks.some(t => t.b_idx === args.BI);
        }

        getActiveAnimMatrix(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            if (!m || !m.activeAnim || !m.animations[m.activeAnim]) return "[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]";

            const anim = m.animations[m.activeAnim];
            const track = anim.tracks.find(t => t.b_idx === args.BI);
            if (!track) return "[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]";

            const time = m.activeTime % anim.duration; // 循环
            const times = track.times;

            // 寻找当前时刻最近两关键帧
            let i = 0;
            while (i < times.length - 2 && time >= times[i + 1]) i++;

            const t0 = times[i], t1 = times[i + 1];
            const alpha = (t1 - t0) === 0 ? 0 : (time - t0) / (t1 - t0);

            // 平移（3）
            const pos0 = [track.t[i * 3], track.t[i * 3 + 1], track.t[i * 3 + 2]];
            const pos1 = [track.t[(i + 1) * 3], track.t[(i + 1) * 3 + 1], track.t[(i + 1) * 3 + 2]];

            // 旋转 (4)
            const rot0 = [track.r[i * 4], track.r[i * 4 + 1], track.r[i * 4 + 2], track.r[i * 4 + 3]];
            const rot1 = [track.r[(i + 1) * 4], track.r[(i + 1) * 4 + 1], track.r[(i + 1) * 4 + 2], track.r[(i + 1) * 4 + 3]];

            // 插值
            const lerpPos = m4.lerp(pos0, pos1, alpha);
            const slerpRot = m4.slerp(rot0, rot1, alpha);

            // 合成矩阵
            const resMat = m4.fromRotationTranslation(slerpRot, lerpPos);
            return JSON.stringify(Array.from(resMat).map(v => Math.round(v * 1000000) / 1000000));
        }

        getMeshCount(args) { const m = models[modelOrder[Math.floor(args.MI)]]; return m ? m.meshes.length : 0; }
        getMeshIndex(args) { const m = models[modelOrder[Math.floor(args.MI)]]; return m ? m.meshes.findIndex(mesh => mesh.name === String(args.MN)) : -1; }
        getBoneCount(args) { const m = models[modelOrder[Math.floor(args.MI)]]; return m ? m.skel.bone_count : 0; }
        getModelCount() { return modelOrder.length; }
        getModelID(args) { return modelOrder[Math.floor(args.MI)] || ""; }
        getModelIndex(args) { return modelOrder.indexOf(String(args.MID)); }
        flushModel(args) { const m = models[modelOrder[Math.floor(args.MI)]]; if (m) m.meshes.forEach(mesh => { mesh.geo = null; }); }
        clearAll() { models = {}; modelOrder = []; }

        getDebugData(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            if (!m || !m.nodes[args.BI]) return "[]";
            const n = m.nodes[args.BI];
            const p = (mtx) => JSON.stringify(Array.from(mtx).map(v => Number(v.toFixed(3))));
            if (args.DINFO === '增量矩阵') return p(n.incrementLocal);
            if (args.DINFO === '当前全局矩阵') return p(n.world);
            if (args.DINFO === '默认全局矩阵') return p(n.bindWorld);
            if (args.DINFO === '父级索引') return n.parent.toString();
            return "[]";
        }

        combineListToMatrixString(args, util) {
            const list = util.target.lookupVariableByNameAndType(args.LIST, 'list');
            if (!list) return "[]";
            return JSON.stringify(list.value.map(v => { try { return JSON.parse(v); } catch (e) { return v; } }));
        }
    }
    Scratch.extensions.register(new FlexGLTF());
})(Scratch);