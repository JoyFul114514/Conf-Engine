/**
 * Matrix Extension for Scratch ( v2.20.3.16 )
 * * This Source Code Form is subject to the terms of the Mozilla Public 
 * License, v. 2.0. If a copy of the MPL was not distributed with this 
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * * Copyright (c) 2026 Joy_Ful. All rights reserved.
 * * 中文说明：本文件（Matrix 扩展）受 Mozilla Public License 2.0 (MPL 2.0) 保护。
 * 您可以自由使用，但若修改此文件，分发时必须公开修改后的源代码。
 */

(function (Scratch) {
    'use strict';

    class MatrixPro {
        getInfo() {
            return {
                id: 'matrix',
                name: 'Matrix',
                color1: '#7f94cf',
                blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: "生成" }, // 列优先
                    { opcode: 'identity', blockType: Scratch.BlockType.REPORTER, text: '单位矩阵' },
                    {
                        opcode: 'translate',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '平移矩阵 x:[X] y:[Y] z:[Z]',
                        arguments: { X: { type: 'number', defaultValue: 0 }, Y: { type: 'number', defaultValue: 0 }, Z: { type: 'number', defaultValue: 0 } }
                    },
                    {
                        opcode: 'rotate',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '旋转矩阵 [AXIS] 角度:[ANGLE]',
                        arguments: {
                            AXIS: { type: 'string', menu: 'axisMenu' },
                            ANGLE: { type: 'number', defaultValue: 0 }
                        }
                    },
                    {
                        opcode: 'scale',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '缩放矩阵 x:[X] y:[Y] z:[Z]',
                        arguments: { X: { type: 'number', defaultValue: 1 }, Y: { type: 'number', defaultValue: 1 }, Z: { type: 'number', defaultValue: 1 } }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "运算" },
                    {
                        opcode: 'multiply',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '矩阵乘法 A:[A] * B:[B]',
                        arguments: { A: { type: 'string', defaultValue: '[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]' }, B: { type: 'string', defaultValue: '[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]' } }
                    },
                    {
                        opcode: 'invert',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '逆矩阵 [M]',
                        arguments: { M: { type: 'string', defaultValue: '[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]' } }
                    }
                ],
                menus: {
                    axisMenu: { acceptReporters: true, items: ['X', 'Y', 'Z'] }
                }
            };
        }

        _parse(m) {
            try {
                const parsed = typeof m === 'string' ? JSON.parse(m) : m;
                return (Array.isArray(parsed) && parsed.length === 16) ? parsed : this._getIdentity();
            } catch (e) { return this._getIdentity(); }
        }

        _out(m) { return JSON.stringify(m.map(v => Math.abs(v) < 1e-7 ? 0 : Number(v.toFixed(6)))); }
        _getIdentity() { return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; }

        identity() { return this._out(this._getIdentity()); }

        translate(args) {
            return this._out([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, Number(args.X), Number(args.Y), Number(args.Z), 1]);
        }

        rotate(args) {
            const rad = args.ANGLE * Math.PI / 180;
            const s = Math.sin(rad), c = Math.cos(rad);
            let m = this._getIdentity();
            if (args.AXIS === 'X') m = [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
            else if (args.AXIS === 'Y') m = [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
            else m = [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            return this._out(m);
        }

        scale(args) {
            return this._out([Number(args.X), 0, 0, 0, 0, Number(args.Y), 0, 0, 0, 0, Number(args.Z), 0, 0, 0, 0, 1]);
        }

        multiply(args) {
            const a = this._parse(args.A);
            const b = this._parse(args.B);
            const out = new Array(16);
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    out[j * 4 + i] = a[0 * 4 + i] * b[j * 4 + 0] + a[1 * 4 + i] * b[j * 4 + 1] + a[2 * 4 + i] * b[j * 4 + 2] + a[3 * 4 + i] * b[j * 4 + 3];
                }
            }
            return this._out(out);
        }

        invert(args) {
            const m = this._parse(args.M);
            const inv = new Array(16);
            const out = new Array(16);
            inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
            inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
            inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
            inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
            inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
            inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
            inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
            inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
            inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
            inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
            inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
            inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
            inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
            inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
            inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
            inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
            let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
            if (det === 0) return this.identity();
            det = 1.0 / det;
            for (let i = 0; i < 16; i++) out[i] = inv[i] * det;
            return this._out(out);
        }
    }
    Scratch.extensions.register(new MatrixPro());
})(Scratch);