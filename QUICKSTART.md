# 快速开始指南

## 📦 你现在有什么

一个完整的 Markdown 转 WeChat HTML 转换工具，支持：
- ✅ 命令行使用
- ✅ Node.js API
- ✅ VS Code 插件（已打包）

## 🚀 快速安装和测试

### 步骤 1: 安装插件

**选项 A: 自动安装脚本（推荐）**
```bash
cd /Users/ning/www/md2oa
./install-plugin.sh
```

**选项 B: 手动安装**
1. 打开 VS Code
2. 命令面板 (`Cmd+Shift+P`) → 输入 "Install from VSIX"
3. 选择 `/Users/ning/www/md2oa/build/md2oa.vsix`

### 步骤 2: 测试插件

1. **重启 VS Code**（重要！）

2. **打开测试文件**
   ```bash
   cd /Users/ning/www/md2oa
   code example/sample.md
   ```

3. **尝试转换** - 使用以下任意方式：
   - 🎹 **快捷键**: `Cmd+Shift+M`
   - 🖱️ **右键菜单**: 右键点击 sample.md → "Convert to WeChat OA HTML"
   - 🎨 **编辑器按钮**: 点击标题栏右侧的转换按钮
   - 💬 **命令面板**: `Cmd+Shift+P` → 输入 "md2oa"

4. **查看结果**
   - 输出面板会显示转换日志
   - 点击"打开文件"查看 HTML
   - 或打开 `build/wechat.html`

### 步骤 3: 验证功能

✅ 测试清单：
- [ ] 快捷键 Cmd+Shift+M 能触发转换
- [ ] 右键菜单显示"Convert to WeChat OA HTML"
- [ ] 转换完成后提示打开文件
- [ ] 生成的 HTML 内容格式正确
- [ ] 图片已转换为 Base64
- [ ] 代码块已高亮处理

## 📝 命令行使用

如果你想用命令行而不是 VS Code：

```bash
# 转换单个文件
node build.js example/sample.md

# 或使用 CLI 脚本
node cli.js example/sample.md

# 输出文件
# build/wechat.html
```

## 🔧 项目结构

```
md2oa/
├── build.js                  # 命令行入口
├── lib/
│   └── converter.js         # 核心逻辑（命令行和插件共享）
├── vs-extension/            # VS Code 插件源代码
│   ├── extension.js         # 插件主程序
│   ├── package.json         # 插件配置
│   └── template.html        # 插件使用的模板
├── build/
│   ├── wechat.html         # 转换后的 HTML
│   └── md2oa.vsix          # 插件安装包（6.5 KB）
├── example/
│   ├── sample.md           # 测试文件
│   └── sample-image.svg    # 测试图片
├── template.html           # 默认模板
├── PLUGIN_TEST.md         # 插件测试指南
└── install-plugin.sh      # 快速安装脚本
```

## 📚 文档

- **PLUGIN_TEST.md** - 详细的插件测试指南和常见问题
- **DEVELOPMENT.md** - 开发者指南
- **README.md** - 项目概览
- **vs-extension/README.md** - 插件特定文档

## 🎯 接下来可以做什么

### 1. 发布到 VS Code Marketplace
```bash
# 需要创建 Visual Studio Code Marketplace 账户
# 参考: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

cd vs-extension
vsce publish
```

### 2. 发布到 NPM
```bash
npm publish
```

### 3. 自定义模板
编辑 `template.html` 来自定义样式，比如改变字体、颜色、间距等。

### 4. 添加新功能
参考 `DEVELOPMENT.md` 了解如何扩展项目。

## ❓ 遇到问题？

### 插件不工作
1. 检查 VS Code 扩展视图 (`Cmd+Shift+X`)，搜索 "md2oa"
2. 确保插件显示为"已启用"
3. 尝试重启 VS Code 或运行 "Developer: Reload Window"

### 生成的 HTML 显示不对
1. 查看输出通道获取错误信息
2. 检查 `build/wechat.html` 文件内容
3. 在命令行测试: `node build.js example/sample.md`

### 命令行工具不工作
```bash
# 确保依赖已安装
npm install

# 再试一次
node build.js example/sample.md
```

## 📊 项目统计

- **总代码行数**: ~800 行
- **插件大小**: 6.5 KB（已压缩）
- **核心依赖**: marked, cheerio, highlight.js, juice, gray-matter
- **支持平台**: macOS, Windows, Linux

## 🎉 你现在可以

1. ✅ 在命令行中转换 Markdown 为 WeChat HTML
2. ✅ 在 VS Code 中一键转换
3. ✅ 右键菜单快速操作
4. ✅ 快捷键快速转换
5. ✅ 自动嵌入图片为 Base64
6. ✅ 自动高亮代码块
7. ✅ 内联 CSS 样式
8. ✅ 完全本地运行，无需网络

---

**需要帮助？** 查看详细文档：`PLUGIN_TEST.md` 和 `DEVELOPMENT.md`

1. **编写自己的 Markdown**
   - 创建 `my-article.md`
   - 使用 `node build.js my-article.md` 转换

2. **自定义样式**
   - 编辑 `template.html`
   - 在 `<style>` 标签中修改 CSS

3. **发布到微信公众号**
   - 在浏览器中打开 `build/wechat.html`
   - Ctrl+A 全选，Ctrl+C 复制
   - 在微信公众号后台粘贴发布

## 常见问题

### Q: 图片怎么处理？
A: 本地图片会自动转换为 Base64 嵌入，无需图床。

### Q: 代码块怎么高亮？
A: 使用标准 Markdown 语法，自动检测语言并高亮。

### Q: 可以修改输出样式吗？
A: 可以，编辑 `template.html` 中的 `<style>` 部分。

### Q: 支持哪些 Markdown 语法？
A: 支持 GitHub Flavored Markdown (GFM)，包括表格、删除线、任务列表等。

## 获取帮助

- 查看 [README.md](./README.md) 了解详细功能
- 查看 [DEVELOPMENT.md](./DEVELOPMENT.md) 了解开发信息
- 查看 [vs-extension/README.md](./vs-extension/README.md) 了解插件详情

## 许可证

MIT
