# 插件安装和测试指南

## 📦 生成的插件包信息

- **文件名**: `md2oa.vsix`
- **文件位置**: `/Users/ning/www/md2oa/build/md2oa.vsix`
- **文件大小**: 6.5 KB
- **版本**: 1.0.0
- **发布者**: shaogefenhao

## 🚀 安装方式

### 方式 1: 通过 VS Code UI（推荐）

1. 打开 VS Code
2. 打开命令面板 (`Cmd+Shift+P`)
3. 输入 "Extensions: Install from VSIX"
4. 选择 `/Users/ning/www/md2oa/build/md2oa.vsix` 文件

### 方式 2: 通过命令行

首先设置 VS Code 命令行工具：

```bash
# 在 macOS 中，运行 VS Code 中的命令：
# 打开命令面板 (Cmd+Shift+P) → 输入 "shell command" → 选择 "Shell Command: Install 'code' command in PATH"
```

然后安装插件：

```bash
code --install-extension /Users/ning/www/md2oa/build/md2oa.vsix
```

### 方式 3: 直接将文件放入插件目录

macOS:
```bash
mkdir -p ~/.vscode/extensions
unzip /Users/ning/www/md2oa/build/md2oa.vsix -d ~/.vscode/extensions/md2oa-1.0.0
```

Windows:
```bash
mkdir "%USERPROFILE%\.vscode\extensions"
unzip "C:\path\to\md2oa.vsix" -d "%USERPROFILE%\.vscode\extensions\md2oa-1.0.0"
```

Linux:
```bash
mkdir -p ~/.vscode/extensions
unzip /path/to/md2oa.vsix -d ~/.vscode/extensions/md2oa-1.0.0
```

## 🧪 测试步骤

安装完成后，按以下步骤测试插件功能：

### 1. 快捷键测试
- 打开项目中的 `example/sample.md` 文件
- 按 `Cmd+Shift+M`（macOS）或 `Ctrl+Shift+M`（Windows/Linux）
- 应该看到转换进行中的输出，最后显示 "✅ 转换完成！"

### 2. 编辑器按钮测试
- 打开 `example/sample.md`
- 在编辑器标题栏右侧寻找一个按钮（可能显示为图标）
- 点击该按钮，应该触发转换

### 3. 文件浏览器右键菜单测试
- 在文件浏览器中右键点击任何 `.md` 文件
- 应该看到"Convert to WeChat OA HTML"选项
- 点击执行转换

### 4. 命令面板测试
- 按 `Cmd+Shift+P`（macOS）或 `Ctrl+Shift+P`（Windows/Linux）
- 输入 "md2oa" 或 "Convert to WeChat"
- 应该看到相关命令列表
- 选择一个命令执行

### 5. 输出检查
- 检查输出通道（应该自动打开）
- 查看是否有日志信息
- 检查 `build/wechat.html` 文件是否生成

### 6. 生成文件验证
- 打开生成的 `build/wechat.html` 文件
- 验证内容格式正确
- 验证图片已转换为 Base64
- 验证代码块已高亮处理
- 验证 CSS 样式已内联

## 📋 功能清单

测试时请验证以下功能：

- [ ] 快捷键触发转换（Cmd+Shift+M）
- [ ] 编辑器标题栏按钮可见且可点击
- [ ] 文件浏览器右键菜单显示转换选项
- [ ] 命令面板能搜索到 md2oa 命令
- [ ] 转换过程中输出日志信息
- [ ] 生成 HTML 文件到 build 目录
- [ ] 图片正确转换为 Base64
- [ ] 代码块正确高亮
- [ ] HTML 实体（&nbsp;）正确保留
- [ ] CSS 样式正确内联
- [ ] 完成后提示打开文件或文件夹

## 🔍 调试

### 查看插件日志

打开 VS Code 的输出面板：
1. 菜单 → 查看 → 输出
2. 在右侧下拉菜单选择 "md2oa"

### 检查插件是否启用

1. 打开扩展视图（`Cmd+Shift+X`）
2. 搜索 "md2oa"
3. 验证插件显示为"已安装"和"已启用"

### 卸载插件

```bash
code --uninstall-extension shaogefenhao.md2oa
```

或在 VS Code 的扩展视图中找到 md2oa 插件，点击"卸载"

## 📝 注意事项

1. **首次使用**: 插件在打开 Markdown 文件时自动激活
2. **工作区路径**: 确保 Markdown 文件在一个有效的工作区内
3. **模板文件**: 插件会自动查找项目根目录或 vs-extension 目录中的 template.html
4. **输出目录**: 生成的 HTML 文件总是保存到工作区的 `build/` 目录

## ❓ 常见问题

### Q: 插件安装后看不到菜单项？
A: 可能需要重新加载 VS Code。尝试：
- 重启 VS Code
- 或在命令面板中输入 "Developer: Reload Window"

### Q: 快捷键不工作？
A: 检查是否有其他扩展绑定了相同的快捷键。在设置中搜索 "keybindings" 可以自定义快捷键。

### Q: 转换失败显示"找不到 template.html"？
A: 确保 template.html 在以下位置之一：
- 工作区根目录
- `vs-extension/` 目录
- 或在项目中创建一个新的 template.html

### Q: 生成的 HTML 显示不正确？
A: 可能是因为：
1. template.html 中的 CSS 样式有问题
2. 或 CSS 内联过程中发生了错误
3. 尝试检查浏览器开发者工具查看具体的渲染问题

## 📚 相关文件

- 插件源代码: `/Users/ning/www/md2oa/vs-extension/extension.js`
- 插件清单: `/Users/ning/www/md2oa/vs-extension/package.json`
- 核心转换逻辑: `/Users/ning/www/md2oa/lib/converter.js`
- 示例文件: `/Users/ning/www/md2oa/example/sample.md`

## 🤝 反馈和改进

如发现任何问题，请：
1. 查看输出日志获取详细错误信息
2. 检查 build/wechat.html 的生成内容
3. 在命令行中测试: `node build.js example/sample.md`
