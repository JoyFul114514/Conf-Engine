# Conf-Engine3
面向 TurboWarp 的蒙皮骨骼动画引擎

#Simple3D #TurboWarp #extension #Skeleton #Skin

## 使用指南

### 加载 & 绘制
1. **导出模型：** 在 Blender 里导入 `flexgltf_export.py` 脚本，修改脚本最后一行的目录为你想要的导出目录。
2. **场景准备：** 物体模式下按 `A` 全选场景，运行脚本，等待导出为 JSON 文件。
3. **引擎配置：** 在 TurboWarp 的 GLTFLoader 中新建变量，通过文件扩展将该变量设置为导出的 JSON 内容。
4. **加载积木：** 在广播 `Load` 下，使用 `Load from ( )` 自制积木，将变量拖入。
5. **渲染执行：** 在 `Render` 的重复执行中添加 `Draw ( )` 积木，填入 JSON 的文件名。
6. 点击绿旗运行。

### 骨骼 & 动画
- **程序动画：** 在广播 `Animation` 下，配合 Matrix 扩展使用 `设置模型( )骨骼( )局部矩阵( )` 积木。
- **骨骼动画：** 使用 `Play Animation ( ) ( )` 播放预设动画。
- **更新矩阵:** 修改局部矩阵后，需使用 `更新模型 ( ) 的骨骼层级继承计算` 来重新遍历计算骨骼当前(current)绝对坐标系矩阵

---

## 技术细节&工作流

* **blender插件**：生成易被scratch读取和处理的高度定制化模型格式（文件后缀为.json），格式参考了glTF
    * 格式mesh对象：为了性能，该定制格式没有层级node结构，所有mesh都是平铺；每个网格包含name、mat、tex、v、uv、b_idx、b_wt。
    * 与传统glTF不同，为了scratch读取方便，脚本将所有的顶点信息直接嵌入对应的网格对象结构中而不引用外部二进制文件
    * name：网格名 mat：材质名 tex：贴图名 v：交错布局的顶点坐标，已自动三角化，方便后续直接提交给GPU uv：uv b_idx：骨骼索引 b_wt：骨骼权重
    * skeleton对象：具有层次继承结构，保存了场景骨骼初始绑定姿态下的绝对坐标系矩阵、骨骼局部坐标系矩阵
    * animation对象：出于性能考虑，格式十分精简，每个动画以name为key，包含duration、tracks
      * duration：该动画持续时间 tracks：动画槽
        * tracks是中是一系列的骨骼变换流，记录每一关键帧中姿态有改变的骨骼的索引、TRS以及时刻。姿态无变化的骨骼不会记录，以节省空间
* **FlexGLTF扩展**：核心扩展，解析、句柄、计算、输出
    * 读取json模型，保存场景网格信息
    * FlexGLTF会遍历骨骼树，将骨骼的 初始(original)绝对坐标系矩阵、骨骼局部坐标系矩阵保存在内存中，并额外使用一部分内存存放一套 当前(current)绝对坐标系矩阵
    * scratch层会从FlexGLTF中读取网格信息，比如VBO，提交给SImple3D（GPU）。同时，scratch层会为每个网格提交一份original矩阵流，由4根骨骼的变换矩阵扁平排列而成
      * 为什么是4根而不是全部？
      * 因为simple3d要求以网格为单位上传自己那一套original&current matrix，而不是以模型为单位。如果把全身的骨骼给每个网格都上传一次，那绝对卡爆而且浪费空间。其次simple3D每个网格受骨骼影响最大数为4。所以我便在FlexGLTF里对每个网格取权重最大的四根骨头，权重归一化确保合为一，然后通过这四根骨头         的全局索引在 初始绝对坐标系矩阵 中查询，把四个骨骼的矩阵扁平排列为64长度的数组，调用 `set mesh ( ) original matrix` 将original上传
      * 最后，程序生成内容为[0,1,2,3]循环顶点数量后的数组，当成bone_indices，调用 `set mesh ( ) bone indices` 上传给simple3D（所以这一招就是为了骗simple3D，也是在避免修改simple3D源码的情况下的妥协）
    * 用户可以在渲染循环(renderLoop)中每帧修改骨骼的局部坐标系矩阵，并在修改后调用 `更新模型 ( ) 的骨骼层级继承计算` 积木。此积木会重新遍历骨骼树，对所有骨骼进行层次继承变换，并将计算好的结果写入内存中的 当前(current)绝对坐标系矩阵
    * 最后，在调用Simple3D的 `Draw Mesh（）` 之前，scratch层的积木会将调用 `set mesh ( ) current matrix` 把当前绝对坐标系矩阵上传。

---

## 许可、致谢与开发环境 (License, Credits & Environment)

本项目采用分层授权模式，以平衡开发灵活性与核心组件的开源保护：

### 1. 授权说明 (Licensing)
* **引擎逻辑 (.sb3):** 采用 **[MIT License](LICENSE.md)** 开源。包含所有在 TurboWarp 编辑器中编写的积木逻辑。您可以自由重混、分发及商用。
* **核心扩展与插件:** 采用 **[Mozilla Public License 2.0 (MPL 2.0)](LICENSE.md)** 开源。
    * 涉及文件：`Matrix.js` (矩阵运算)、`FlexGLTF.js` (3D 蒙皮骨骼动画解析器)、`flexgltf_export.py` (Blender 导出脚本)。
    * **核心要求：** 如果您修改了这些特定的源代码文件，**必须**以 MPL 2.0 协议公开您的修改。

### 2. 技术参考与环境 (Environment & Reference)
* **[glTF™ 参考](https://www.khronos.org/gltf/):** 核心扩展 **FlexGLTF** 的数据交换格式参考了 glTF™ (GL Transmission Format) 开放标准。本项目是针对 TurboWarp 环境优化的自定义实现。
* **[TurboWarp](https://turbowarp.org/):** 本项目专为 TurboWarp 环境设计。**特此声明：TurboWarp 是一个独立的开源项目，不属于 Scratch 或 MIT。** 本项目利用了其高性能编译器及动态扩展加载能力。
* **[Blender](https://www.blender.org/):** 本项目使用 Blender 进行 3D 建模与动画预处理。配套的 `flexgltf_export.py` 插件作为独立脚本运行于 Blender 环境下。

### 3. 第三方扩展致谢 (Third-Party Credits)
本项目集成了以下优秀的开源扩展，对原作者表示诚挚感谢：
* **Simple3D Extension** - 作者：**Vadik1 (Xeltalliv)** [访问源码](https://extensions.turbowarp.org/Xeltalliv/simple3D.js)
* **JSON Extension** - 作者：**Skyhigh173** 与 **Mio** [访问源码](https://extensions.turbowarp.org/Skyhigh173/json.js)
* **Files Extension** - 作者：**TurboWarp 贡献者** [访问源码](https://extensions.turbowarp.org/files.js)


详情请参阅仓库根目录下的 [LICENSE](LICENSE.md) 文件。
