// Name: OmniGLB
// ID: omniGLB
// Description: Better GLB loader
// By: Joy_Ful <https://github.com/JoyFul114514>
// License: MPL-2.0 AND BSD-3-Clause
// Version: 1.0.0

(function (Scratch) {
    'use strict';

    function multiply(a, b) {
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
    }

    function inverse(m) {
        const out = new Float32Array(16);
        const m00 = m[0], m01 = m[1], m02 = m[2], m03 = m[3], m10 = m[4], m11 = m[5], m12 = m[6], m13 = m[7], m20 = m[8], m21 = m[9], m22 = m[10], m23 = m[11], m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];
        const b00 = m00 * m11 - m01 * m10, b01 = m00 * m12 - m02 * m10, b02 = m00 * m13 - m03 * m10, b03 = m01 * m12 - m02 * m11, b04 = m01 * m13 - m03 * m11, b05 = m02 * m13 - m03 * m12, b06 = m20 * m31 - m21 * m30, b07 = m20 * m32 - m22 * m30, b08 = m20 * m33 - m23 * m30, b09 = m21 * m32 - m22 * m31, b10 = m21 * m33 - m23 * m31, b11 = m22 * m33 - m23 * m32;
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) return null; det = 1.0 / det;
        out[0] = (m11 * b11 - m12 * b10 + m13 * b09) * det; out[1] = (m02 * b10 - m01 * b11 - m03 * b09) * det; out[2] = (m31 * b05 - m32 * b04 + m33 * b03) * det; out[3] = (m22 * b04 - m21 * b05 - m23 * b03) * det;
        out[4] = (m12 * b08 - m10 * b11 - m13 * b07) * det; out[5] = (m00 * b11 - m02 * b08 + m03 * b07) * det; out[6] = (m32 * b02 - m30 * b11 - m33 * b01) * det; out[7] = (m20 * b11 - m22 * b02 + m23 * b01) * det;
        out[8] = (m10 * b10 - m11 * b08 + m13 * b06) * det; out[9] = (m01 * b08 - m00 * b10 - m03 * b06) * det; out[10] = (m30 * b10 - m31 * b02 + m33 * b00) * det; out[11] = (m21 * b02 - m20 * b10 - m23 * b00) * det;
        out[12] = (m11 * b07 - m10 * b09 - m12 * b06) * det; out[13] = (m00 * b09 - m01 * b07 + m02 * b06) * det; out[14] = (m31 * b01 - m30 * b05 - m32 * b00) * det; out[15] = (m20 * b05 - m21 * b01 + m22 * b00) * det;
        return out;
    }

    const m4 = {
        identity: () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
        multiply: multiply,
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
        lerp: (a, b, t) => [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]), a[2] + t * (b[2] - a[2])],
        fromRotationTranslation: (q, t, s = [1, 1, 1]) => {
            const out = new Float32Array(16);
            const x = q[0], y = q[1], z = q[2], w = q[3];
            const x2 = x + x, y2 = y + y, z2 = z + z;
            const xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2;
            const wx = w * x2, wy = w * y2, wz = w * z2;
            out[0] = (1 - (yy + zz)) * s[0]; out[1] = (xy + wz) * s[0]; out[2] = (xz - wy) * s[0]; out[3] = 0;
            out[4] = (xy - wz) * s[1]; out[5] = (1 - (xx + zz)) * s[1]; out[6] = (yz + wx) * s[1]; out[7] = 0;
            out[8] = (xz + wy) * s[2]; out[9] = (yz - wx) * s[2]; out[10] = (1 - (xx + yy)) * s[2]; out[11] = 0;
            out[12] = t[0]; out[13] = t[1]; out[14] = t[2]; out[15] = 1;
            return out;
        },
        decompose: (m) => {
            const sx = Math.hypot(m[0], m[1], m[2]);
            const sy = Math.hypot(m[4], m[5], m[6]);
            const sz = Math.hypot(m[8], m[9], m[10]);
            const t = [m[12], m[13], m[14]];
            let r = [0, 0, 0, 1];
            if (sx > 1e-5 && sy > 1e-5 && sz > 1e-5) {
                const r00 = m[0] / sx, r01 = m[1] / sx, r02 = m[2] / sx, r10 = m[4] / sy, r11 = m[5] / sy, r12 = m[6] / sy, r20 = m[8] / sz, r21 = m[9] / sz, r22 = m[10] / sz;
                const trace = r00 + r11 + r22;
                if (trace > 0) { const S = Math.sqrt(trace + 1.0) * 2; r[3] = 0.25 * S; r[0] = (r12 - r21) / S; r[1] = (r20 - r02) / S; r[2] = (r01 - r10) / S; }
                else if (r00 > r11 && r00 > r22) { const S = Math.sqrt(1.0 + r00 - r11 - r22) * 2; r[3] = (r12 - r21) / S; r[0] = 0.25 * S; r[1] = (r01 + r10) / S; r[2] = (r20 + r02) / S; }
                else if (r11 > r22) { const S = Math.sqrt(1.0 + r11 - r00 - r22) * 2; r[3] = (r20 - r02) / S; r[0] = (r01 + r10) / S; r[1] = 0.25 * S; r[2] = (r12 + r21) / S; }
                else { const S = Math.sqrt(1.0 + r22 - r00 - r11) * 2; r[3] = (r01 - r10) / S; r[0] = (r20 + r02) / S; r[1] = (r12 + r21) / S; r[2] = 0.25 * S; }
            }
            return { t, r, s: [sx, sy, sz] };
        }
    };

    let models = {};
    let modelOrder = [];

    class OmniGLB {
        _lp(v) {
            if (v instanceof Float32Array || v instanceof Uint16Array || v instanceof Uint8Array || Array.isArray(v)) {
                return Array.from(v).map(x => Math.round(x * 1000000) / 1000000);
            }
            return Math.round(v * 1000000) / 1000000;
        }

        getInfo() {
            return {
                id: 'omniGLB',
                name: 'OmniGLB',
                color1: '#7db4b2',
                blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: "场景&内存" },
                    { opcode: 'parseScene', blockType: Scratch.BlockType.COMMAND, text: '加载 GLB [STR] 命名为 [MID]', arguments: { STR: { type: 'string', defaultValue: '' }, MID: { type: 'string', defaultValue: 'model_1' } } },
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
                    { opcode: 'hasAnimationTrack', blockType: Scratch.BlockType.BOOLEAN, text: '模型 [MI] 骨骼 [BI] 当前动画有轨道？', arguments: { MI: { type: 'number', defaultValue: 0 }, BI: { type: 'number', defaultValue: 0 } } },
                    { opcode: 'getActiveAnimMatrix', blockType: Scratch.BlockType.REPORTER, text: '获取模型 [MI] 骨骼 [BI] 的激活动画增量矩阵', arguments: { MI: { type: 'number', defaultValue: 0 }, BI: { type: 'number', defaultValue: 0 } } },
                    { blockType: Scratch.BlockType.LABEL, text: "矩阵" },
                    { opcode: 'identity', blockType: Scratch.BlockType.REPORTER, text: '单位矩阵' },
                    { opcode: 'translate', blockType: Scratch.BlockType.REPORTER, text: '平移矩阵 x:[X] y:[Y] z:[Z]', arguments: { X: { type: 'number', defaultValue: 0 }, Y: { type: 'number', defaultValue: 0 }, Z: { type: 'number', defaultValue: 0 } } },
                    { opcode: 'rotate', blockType: Scratch.BlockType.REPORTER, text: '旋转矩阵 [AXIS] 角度:[ANGLE]', arguments: { AXIS: { type: 'string', menu: 'axisMenu' }, ANGLE: { type: 'number', defaultValue: 0 } } },
                    { opcode: 'scale', blockType: Scratch.BlockType.REPORTER, text: '缩放矩阵 x:[X] y:[Y] z:[Z]', arguments: { X: { type: 'number', defaultValue: 1 }, Y: { type: 'number', defaultValue: 1 }, Z: { type: 'number', defaultValue: 1 } } },
                    { opcode: 'multiply', blockType: Scratch.BlockType.REPORTER, text: '矩阵乘法 A:[A] * B:[B]', arguments: { A: { type: 'string', defaultValue: '[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]' }, B: { type: 'string', defaultValue: '[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]' } } },
                    { opcode: 'invert', blockType: Scratch.BlockType.REPORTER, text: '逆矩阵 [M]', arguments: { M: { type: 'string', defaultValue: '[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]' } } },
                    { blockType: Scratch.BlockType.LABEL, text: "调试工具" },
                    { opcode: 'combineListToMatrixString', blockType: Scratch.BlockType.REPORTER, text: '合并列表 [LIST] 为矩阵字符串', arguments: { LIST: { type: 'string', defaultValue: 'list' } } },
                    { opcode: 'getDebugData', blockType: Scratch.BlockType.REPORTER, text: '获取模型 [MI] 骨骼 [BI] 的 [DINFO]', arguments: { MI: { type: 'number', defaultValue: 0 }, BI: { type: 'number', defaultValue: 0 }, DINFO: { type: 'string', menu: 'debugMenu' } } }
                ],
                menus: {
                    meshMenu: { items: ['name', 'material_name', 'texture_name', 'position', 'uv', 'bone_indices', 'bone_weights'] },
                    boneMenu: { items: ['bone_id', 'parent_index', 'original_matrix'] },
                    poseMenu: { items: ['当前', '初始'] },
                    axisMenu: { acceptReporters: true, items: ['X', 'Y', 'Z'] },
                    debugMenu: { items: ['增量矩阵', '当前全局矩阵', '默认全局矩阵', '父级索引'] }
                }
            };
        }

        _getBuf(json, bin, accessorIdx) {
            if (accessorIdx === undefined || accessorIdx === null) return null;
            const acc = json.accessors[accessorIdx];
            const bvIdx = acc.bufferView !== undefined ? acc.bufferView : null;
            let offset = acc.byteOffset || 0;
            let stride = 0;
            if (bvIdx !== null) { const bv = json.bufferViews[bvIdx]; offset += (bv.byteOffset || 0); stride = bv.byteStride || 0; }
            const comps = { 'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16 }[acc.type] || 1;
            const count = acc.count * comps;
            const TypedArray = { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array }[acc.componentType];
            if (!TypedArray) return null;
            if (stride === 0 || stride === comps * TypedArray.BYTES_PER_ELEMENT) { return new TypedArray(bin, offset, count); }
            else {
                const result = new TypedArray(count);
                const dataView = new DataView(bin);
                for (let i = 0; i < acc.count; i++) {
                    const elOffset = offset + i * stride;
                    for (let j = 0; j < comps; j++) {
                        const byteOffset = elOffset + j * TypedArray.BYTES_PER_ELEMENT;
                        if (acc.componentType === 5126) result[i * comps + j] = dataView.getFloat32(byteOffset, true);
                        else if (acc.componentType === 5123) result[i * comps + j] = dataView.getUint16(byteOffset, true);
                        else if (acc.componentType === 5121) result[i * comps + j] = dataView.getUint8(byteOffset);
                    }
                }
                return result;
            }
        }

        parseScene(args) {
            try {
                const mid = String(args.MID);
                const b64 = args.STR.split(',').pop();
                const binStr = atob(b64);
                const bytes = new Uint8Array(binStr.length);
                for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
                const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
                if (dv.getUint32(0, true) !== 0x46546C67) return;
                let offset = 12, json = null, bin = null;
                while (offset < bytes.length) {
                    const chunkLen = dv.getUint32(offset, true);
                    const chunkType = dv.getUint32(offset + 4, true);
                    if (chunkType === 0x4E4F534A) json = JSON.parse(new TextDecoder().decode(bytes.subarray(offset + 8, offset + 8 + chunkLen)));
                    else if (chunkType === 0x004E4942) bin = bytes.buffer.slice(bytes.byteOffset + offset + 8, bytes.byteOffset + offset + 8 + chunkLen);
                    offset += 8 + chunkLen;
                }

                const nodes = (json.nodes || []).map((n, i) => {
                    let defT = n.translation || [0, 0, 0], defR = n.rotation || [0, 0, 0, 1], defS = n.scale || [1, 1, 1];
                    let bindLocal = n.matrix ? new Float32Array(n.matrix) : m4.fromRotationTranslation(defR, defT, defS);
                    const d = m4.decompose(bindLocal);
                    return { name: n.name || `bone_${i}`, parent: -1, bindLocal, defT: d.t, defR: d.r, defS: d.s, incrementLocal: m4.identity(), bindWorld: m4.identity(), invBindWorld: m4.identity(), skinMatrix: m4.identity(), world: m4.identity() };
                });

                (json.nodes || []).forEach((n, i) => { if (n.children) n.children.forEach(c => { if (nodes[c]) nodes[c].parent = i; }); });

                const skinJoints = json.skins && json.skins.length > 0 ? json.skins[0].joints : [];
                const nodeToBoneMap = {};
                skinJoints.forEach((nIdx, bIdx) => nodeToBoneMap[nIdx] = bIdx);

                let calcOrder = [];
                let visited = new Uint8Array(nodes.length);
                const visitNode = (idx) => { if (visited[idx]) return; visited[idx] = 1; if (nodes[idx].parent !== -1) visitNode(nodes[idx].parent); calcOrder.push(idx); };
                for (let i = 0; i < nodes.length; i++) visitNode(i);

                calcOrder.forEach(idx => {
                    const n = nodes[idx];
                    if (n.parent === -1) n.bindWorld.set(n.bindLocal);
                    else n.bindWorld.set(m4.multiply(nodes[n.parent].bindWorld, n.bindLocal));
                    n.world.set(n.bindWorld);
                    const inv = inverse(n.bindWorld);
                    if (inv) n.invBindWorld.set(inv);
                });

                const meshes = [];
                (json.meshes || []).forEach((m, mIdx) => {
                    (m.primitives || []).forEach((prim, pIdx) => {
                        const idxs = this._getBuf(json, bin, prim.indices), rP = this._getBuf(json, bin, prim.attributes.POSITION), rU = this._getBuf(json, bin, prim.attributes.TEXCOORD_0), rI = this._getBuf(json, bin, prim.attributes.JOINTS_0), rW = this._getBuf(json, bin, prim.attributes.WEIGHTS_0);
                        let p = [], u = [], bw = [], bi = [], handles = [], globalToLocalMap = new Map();
                        const processVertex = (idx) => {
                            if (rP) p.push(rP[idx * 3], rP[idx * 3 + 1], rP[idx * 3 + 2]);
                            if (rU) u.push(rU[idx * 2], rU[idx * 2 + 1]);
                            if (rI && rW && skinJoints.length > 0) {
                                for (let j = 0; j < 4; j++) {
                                    let rawJointLocalIdx = rI[idx * 4 + j], weight = rW[idx * 4 + j];
                                    if (weight > 0) {
                                        let globalNodeIdx = skinJoints[rawJointLocalIdx];
                                        if (!globalToLocalMap.has(globalNodeIdx)) { globalToLocalMap.set(globalNodeIdx, handles.length); handles.push(globalNodeIdx); }
                                        bi.push(globalToLocalMap.get(globalNodeIdx));
                                    } else { bi.push(0); }
                                    bw.push(weight);
                                }
                            } else { bi.push(0, 0, 0, 0); bw.push(1, 0, 0, 0); if (handles.length === 0) handles.push(0); }
                        };
                        if (idxs) for (let i = 0; i < idxs.length; i++) processVertex(idxs[i]);
                        else if (rP) for (let i = 0; i < rP.length / 3; i++) processVertex(i);

                        let texName = "None";
                        if (prim.material !== undefined && json.materials) {
                            const matDef = json.materials[prim.material];
                            let texIdx = undefined;
                            if (matDef.pbrMetallicRoughness && matDef.pbrMetallicRoughness.baseColorTexture) texIdx = matDef.pbrMetallicRoughness.baseColorTexture.index;
                            else { const deep = (obj) => { if (!obj || typeof obj !== 'object') return; if (obj.index !== undefined && typeof obj.index === 'number') { texIdx = obj.index; return; } for (let k in obj) { deep(obj[k]); if (texIdx !== undefined) return; } }; deep(matDef); }
                            if (texIdx !== undefined && json.textures && json.textures[texIdx]) {
                                const tex = json.textures[texIdx];
                                if (tex.source !== undefined && json.images && json.images[tex.source]) {
                                    const img = json.images[tex.source];
                                    texName = img.name || tex.name || (img.uri && !img.uri.startsWith('data:') ? img.uri.split('/').pop().split('.')[0] : `Texture_${texIdx}`);
                                }
                            }
                        }
                        meshes.push({ name: m.name || `Mesh_${mIdx}_${pIdx}`, mat: (json.materials && json.materials[prim.material] ? json.materials[prim.material].name : "None") || `Mat_${prim.material}`, tex: texName, handles, geo: { position: p, uv: u, bone_indices: bi, bone_weights: bw } });
                    });
                });

                const animations = {};
                if (json.animations) {
                    json.animations.forEach((anim, aIdx) => {
                        const nodeTracksMap = {};
                        anim.channels.forEach(ch => {
                            if (!nodeTracksMap[ch.target.node]) nodeTracksMap[ch.target.node] = { t: null, r: null, s: null };
                            const sampler = anim.samplers[ch.sampler];
                            const times = this._getBuf(json, bin, sampler.input), values = this._getBuf(json, bin, sampler.output);
                            if (times && values) {
                                if (ch.target.path === 'translation') nodeTracksMap[ch.target.node].t = { times, values };
                                else if (ch.target.path === 'rotation') nodeTracksMap[ch.target.node].r = { times, values };
                                else if (ch.target.path === 'scale') nodeTracksMap[ch.target.node].s = { times, values };
                            }
                        });
                        // 寻找该轨道实际的第一个关键帧作为基准姿态（Base Matrix）
                        // 后续所有动画矩阵都乘以 Base 的逆矩阵，算出纯净的增量并保存在内存中
                        const bakedDeltaTracks = {};

                        for (let nId in nodeTracksMap) {
                            const raw = nodeTracksMap[nId];
                            const n = nodes[nId];

                            // 提取轨道中所有的关键帧时间点，并排序
                            const allTimes = Array.from(new Set([
                                ...(raw.t ? raw.t.times : []),
                                ...(raw.r ? raw.r.times : []),
                                ...(raw.s ? raw.s.times : [])
                            ])).sort((a, b) => a - b);

                            if (allTimes.length === 0) continue;

                            const sample = (track, time, def, comps) => {
                                if (!track) return def;
                                let i = 0;
                                while (i < track.times.length - 2 && time >= track.times[i + 1]) i++;
                                let alpha = (track.times[i + 1] > track.times[i]) ? (time - track.times[i]) / (track.times[i + 1] - track.times[i]) : 0;
                                if (comps === 4) return m4.slerp(track.values.subarray(i * 4, i * 4 + 4), track.values.subarray((i + 1) * 4, (i + 1) * 4 + 4), alpha);
                                return m4.lerp(track.values.subarray(i * 3, i * 3 + 3), track.values.subarray((i + 1) * 3, (i + 1) * 3 + 3), alpha);
                            };

                            // 获取该动画第 1 帧作为基准（Base）
                            const firstTime = allTimes[0];
                            const baseT = sample(raw.t, firstTime, n.defT, 3);
                            const baseR = sample(raw.r, firstTime, n.defR, 4);
                            const baseS = sample(raw.s, firstTime, n.defS, 3);

                            // 生成基准矩阵并求逆
                            const baseMat = m4.fromRotationTranslation(baseR, baseT, baseS);
                            const invBaseMat = inverse(baseMat) || m4.identity();

                            const deltaT = new Float32Array(allTimes.length * 3);
                            const deltaR = new Float32Array(allTimes.length * 4);

                            // 烘焙所有帧的增量
                            allTimes.forEach((time, idx) => {
                                const currentT = sample(raw.t, time, n.defT, 3);
                                const currentR = sample(raw.r, time, n.defR, 4);
                                const currentS = sample(raw.s, time, n.defS, 3);

                                const currentMat = m4.fromRotationTranslation(currentR, currentT, currentS);

                                // 增量 = 逆(动画第1帧矩阵) * 当前帧矩阵
                                const deltaMat = m4.multiply(invBaseMat, currentMat);

                                // 拆解出增量的 TRS
                                const d = m4.decompose(deltaMat);

                                // 防止浮点误差误差
                                const cleanT = d.t.map(v => Math.abs(v) < 1e-6 ? 0 : v);
                                const cleanR = d.r.map((v, i) => Math.abs(v - (i === 3 ? 1 : 0)) < 1e-6 ? (i === 3 ? 1 : 0) : v);

                                deltaT.set(cleanT, idx * 3);
                                deltaR.set(cleanR, idx * 4);
                            });

                            bakedDeltaTracks[nId] = {
                                times: new Float32Array(allTimes),
                                t: deltaT,
                                r: deltaR
                            };
                        }
                        console.groupEnd();
                        let duration = 0; for (let k in bakedDeltaTracks) duration = Math.max(duration, bakedDeltaTracks[k].times[bakedDeltaTracks[k].times.length - 1]);
                        animations[anim.name || `Anim_${aIdx}`] = { bakedDeltaTracks, duration };
                    });
                }
                models[mid] = { meshes, nodes, calcOrder, animations, activeAnim: "", activeTime: 0, skinJoints, nodeToBoneMap };
                if (!modelOrder.includes(mid)) modelOrder.push(mid);
            } catch (e) { console.error("GLB 加载失败:", e); }
        }

        getActiveAnimMatrix(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            const bIdx = Math.floor(args.BI);
            if (!m || !m.activeAnim || !m.animations[m.activeAnim]) return "[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]";

            const anim = m.animations[m.activeAnim];
            const nIdx = m.skinJoints[bIdx];
            const track = anim.bakedDeltaTracks[nIdx];

            // 没有动画轨道，返回单位阵
            if (!track) return "[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]";

            const time = m.activeTime % (anim.duration || 1);
            let i = 0;
            while (i < track.times.length - 2 && time >= track.times[i + 1]) i++;
            let alpha = (track.times[i + 1] > track.times[i]) ? (time - track.times[i]) / (track.times[i + 1] - track.times[i]) : 0;

            // 对烘焙好的纯净增量进行插值
            const t = m4.lerp(track.t.subarray(i * 3, i * 3 + 3), track.t.subarray((i + 1) * 3, (i + 1) * 3 + 3), alpha);
            const r = m4.slerp(track.r.subarray(i * 4, i * 4 + 4), track.r.subarray((i + 1) * 4, (i + 1) * 4 + 4), alpha);

            // 强制 Scale=[1,1,1]
            return JSON.stringify(this._lp(m4.fromRotationTranslation(r, t, [1, 1, 1])));
        }

        getMeshInfo(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            if (!m || !m.meshes[args.MSI]) return "";
            const mesh = m.meshes[args.MSI];
            if (args.INFO === 'name') return mesh.name;
            if (args.INFO === 'material_name') return mesh.mat;
            if (args.INFO === 'texture_name') return mesh.tex;
            const data = mesh.geo ? mesh.geo[args.INFO] : null;
            if (Array.isArray(data) || data instanceof Float32Array) return JSON.stringify(this._lp(data));
            return data || "[]";
        }

        setBonePose(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            const bIdx = Math.floor(args.BI);
            if (m && m.skinJoints && m.skinJoints[bIdx] !== undefined) {
                try {
                    const matData = JSON.parse(args.MAT);
                    if (Array.isArray(matData) && matData.length === 16) m.nodes[m.skinJoints[bIdx]].incrementLocal.set(matData);
                } catch (e) { }
            }
        }

        updateHierarchy(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            if (!m) return;
            m.calcOrder.forEach(idx => {
                const n = m.nodes[idx];
                const local = m4.multiply(n.bindLocal, n.incrementLocal);
                if (n.parent === -1) n.world.set(local);
                else n.world.set(m4.multiply(m.nodes[n.parent].world, local));
                n.skinMatrix.set(m4.multiply(n.world, n.invBindWorld));
                n.incrementLocal.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            });
        }

        getSkinningMatrices(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            if (!m || !m.meshes[args.MSI]) return "[]";
            let out = [];
            m.meshes[args.MSI].handles.forEach(idx => {
                const node = m.nodes[idx];
                const mat = (args.TYPE === '初始' || args.TYPE === '默认') ? m4.multiply(node.bindWorld, node.invBindWorld) : node.skinMatrix;
                out.push(...Array.from(mat));
            });
            return JSON.stringify(this._lp(out));
        }

        getBoneCount(args) { const m = models[modelOrder[Math.floor(args.MI)]]; return m && m.skinJoints ? m.skinJoints.length : 0; }
        getBoneInfo(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            const bIdx = Math.floor(args.BI);
            if (!m || !m.skinJoints || bIdx < 0 || bIdx >= m.skinJoints.length) return "";
            const n = m.nodes[m.skinJoints[bIdx]];
            if (args.INFO === 'original_matrix') return JSON.stringify(this._lp(n.bindWorld));
            if (args.INFO === 'bone_id') return n.name;
            if (args.INFO === 'parent_index') { const p = m.nodeToBoneMap[n.parent]; return p !== undefined ? p : -1; }
            return "";
        }

        activateAnimation(args) { const m = models[modelOrder[Math.floor(args.MI)]]; if (m) m.activeAnim = String(args.NAME); }
        setAnimationTime(args) { const m = models[modelOrder[Math.floor(args.MI)]]; if (m) m.activeTime = Number(args.TIME); }
        hasAnimationTrack(args) {
            const m = models[modelOrder[Math.floor(args.MI)]];
            const bIdx = Math.floor(args.BI);
            if (!m || !m.activeAnim || !m.animations[m.activeAnim]) return false;
            return !!m.animations[m.activeAnim].bakedDeltaTracks[m.skinJoints[bIdx]];
        }

        getMeshCount(args) { const m = models[modelOrder[Math.floor(args.MI)]]; return m ? m.meshes.length : 0; }
        getMeshIndex(args) { const m = models[modelOrder[Math.floor(args.MI)]]; return m ? m.meshes.findIndex(mesh => mesh.name === String(args.MN)) : -1; }
        getModelCount() { return modelOrder.length; }
        getModelID(args) { return modelOrder[Math.floor(args.MI)] || ""; }
        getModelIndex(args) { return modelOrder.indexOf(String(args.MID)); }
        flushModel(args) { const m = models[modelOrder[Math.floor(args.MI)]]; if (m) m.meshes.forEach(mesh => { mesh.geo = null; }); }
        clearAll() { models = {}; modelOrder = []; }
        _parse(m) { try { return (typeof m === 'string' ? JSON.parse(m) : m) || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; } catch (e) { return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; } }
        _out(m) { return JSON.stringify(m.map(v => Math.abs(v) < 1e-7 ? 0 : Number(v.toFixed(6)))); }
        identity() { return "[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]"; }
        translate(args) { return this._out([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, Number(args.X) || 0, Number(args.Y) || 0, Number(args.Z) || 0, 1]); }
        rotate(args) {
            const rad = (Number(args.ANGLE) || 0) * Math.PI / 180, s = Math.sin(rad), c = Math.cos(rad);
            if (args.AXIS === 'X') return this._out([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
            if (args.AXIS === 'Y') return this._out([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
            return this._out([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        }
        scale(args) { return this._out([Number(args.X) || 1, 0, 0, 0, 0, Number(args.Y) || 1, 0, 0, 0, 0, Number(args.Z) || 1, 0, 0, 0, 0, 1]); }
        multiply(args) { return this._out(Array.from(m4.multiply(new Float32Array(this._parse(args.A)), new Float32Array(this._parse(args.B))))); }
        invert(args) { const inv = inverse(this._parse(args.M)); return inv ? this._out(Array.from(inv)) : this.identity(); }
        getDebugData(args) {
            const m = models[modelOrder[Math.floor(args.MI)]], bIdx = Math.floor(args.BI);
            if (!m || !m.skinJoints || bIdx < 0 || bIdx >= m.skinJoints.length) return "[]";
            const n = m.nodes[m.skinJoints[bIdx]], p = (mtx) => JSON.stringify(Array.from(mtx).map(v => Number(v.toFixed(3))));
            if (args.DINFO === '增量矩阵') return p(n.incrementLocal);
            if (args.DINFO === '当前全局矩阵') return p(n.world);
            if (args.DINFO === '默认全局矩阵') return p(n.bindWorld);
            if (args.DINFO === '父级索引') return n.parent.toString();
            return "[]";
        }
        combineListToMatrixString(args, util) { const list = util.target.lookupVariableByNameAndType(args.LIST, 'list'); if (!list) return "[]"; return JSON.stringify(list.value.map(v => { try { return JSON.parse(v); } catch (e) { return v; } })); }
    }
    Scratch.extensions.register(new OmniGLB());
})(Scratch);