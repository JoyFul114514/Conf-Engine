# Conf-Engine3
面向 TurboWarp 的蒙皮骨骼动画引擎

使用 Simple3D、FlexGLTF 开发的面向 TurboWarp 的 3D 蒙皮骨骼动画引擎。

## 使用指南

### 加载 & 绘制
1. **导出模型：** 在 Blender 里导入 `flexgltf_export.py` 脚本，修改脚本最后一行的目录为你想要的导出目录。
2. **场景准备：** 物体模式下按 `A` 全选场景，运行脚本，等待导出为 JSON 文件。
3. **引擎配置：** 在 TurboWarp 的 GLTFLoader 中新建变量，通过文件扩展将该变量设置为导出的 JSON 内容。
4. **加载积木：** 在广播 `Load` 下，使用 `Load from [ ]` 自制积木，将变量拖入。
5. **渲染执行：** 在 `Render` 的重复执行中添加 `Draw [ ]` 积木，填入 JSON 的文件名。
6. 点击绿旗运行。

### 骨骼 & 动画
- **程序动画：** 在 Animation 模块中，配合 Matrix 扩展使用 `设置模型[ ]骨骼[ ]局部矩阵[ ]` 积木。
- **骨骼动画：** 使用 `Play Animation [ ][ ]` 播放预设动画。

---

## 许可、致谢与开发环境 (License, Credits & Environment)

本项目采用分层授权模式，以平衡开发灵活性与核心组件的开源保护：

### 1. 授权说明 (Licensing)
* **引擎逻辑 (.sb3):** 采用 **[MIT License](LICENSE.md)** 开源。包含所有在 TurboWarp 编辑器中编写的积木逻辑。您可以自由重混、分发及商用。
* **核心扩展与插件:** 采用 **[Mozilla Public License 2.0 (MPL 2.0)](LICENSE.md)** 开源。
    * 涉及文件：`Matrix.js` (矩阵运算)、`FlexGLTF.js` (3D 蒙皮骨骼动画解析器)、`flexgltf_export.py` (Blender 导出脚本)。
    * **核心要求：** 如果您修改了这些特定的源代码文件，**必须**以 MPL 2.0 协议公开您的修改。

### 2. 开发平台与工具声明 (Platforms & Tools)
* **[TurboWarp](https://turbowarp.org/):** 本项目专为 TurboWarp 环境设计。**特此声明：TurboWarp 是一个独立的开源项目，不属于 Scratch 或 MIT。** 本项目利用了其高性能编译器及动态扩展加载能力。
* **[Blender](https://www.blender.org/):** 本项目使用 Blender 进行 3D 建模与动画预处理。配套的 `flexgltf_export.py` 插件作为独立脚本运行于 Blender 环境下。

### 3. 第三方扩展致谢 (Third-Party Credits)
本项目集成了以下优秀的开源扩展，对原作者表示诚挚感谢：
* **Simple3D Extension** - 作者：**Vadik1 (Xeltalliv)** [访问源码](https://extensions.turbowarp.org/Xeltalliv/simple3D.js)
* **JSON Extension** - 作者：**Skyhigh173** 与 **Mio** [访问源码](https://extensions.turbowarp.org/Skyhigh173/json.js)
* **Files Extension** - 作者：**TurboWarp 贡献者** [访问源码](https://extensions.turbowarp.org/files.js)


详情请参阅仓库根目录下的 [LICENSE](LICENSE.md) 文件。