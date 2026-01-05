# md2oa VS Code 扩展

将 Markdown 文档转换为微信公众号兼容的 HTML 格式。

## 功能

- 🔄 快速转换 Markdown 为 HTML
- 🎨 代码块高亮和美化（macOS 风格）
- 📸 自动将本地图片转换为 Base64
- 📝 模板自定义
- 🚀 从编辑器或文件浏览器右键菜单快速操作

## 使用方式

### 方式 1: 编辑器快捷键
在 Markdown 文件中使用快捷键 `Cmd+Shift+M`（macOS）或 `Ctrl+Shift+M`（Windows/Linux）快速转换。

### 方式 2: 编辑器标题栏按钮
在编辑器标题栏右侧点击"Convert to WeChat OA HTML"按钮。

### 方式 3: 文件浏览器右键菜单
在文件浏览器中右键点击 .md 文件，选择"Convert to WeChat OA HTML"。

### 方式 4: 命令面板
按 `Cmd+Shift+P`（macOS）或 `Ctrl+Shift+P`（Windows/Linux），输入"md2oa"选择命令。

## 开发

### 安装依赖
```bash
npm install
```

### 本地测试
```bash
# 安装 VS Code 开发工具
npm install -g @vscode/vsce

# 在 VS Code 中开启调试
# 按 F5 或 在 VS Code 中选择 Run > Start Debugging
```

### 打包扩展
```bash
vsce package
```

这将生成 `md2oa-1.0.0.vsix` 文件。

### 安装打包的扩展
```bash
code --install-extension md2oa-1.0.0.vsix
```

## 文件结构

- `extension.js` - 扩展入口点
- `package.json` - 扩展清单
- `template.html` - HTML 模板（与根目录保持同步）
- `.vscodeignore` - 打包时忽略的文件

## 配置

### 自定义 HTML 模板

将自定义的 `template.html` 放在项目根目录或 `vs-extension` 目录中。模板中的 `{{body}}` 标签会被替换为转换后的 Markdown 内容。

## 许可证

MIT
