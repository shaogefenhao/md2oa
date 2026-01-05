# 开发指南

本项目同时支持命令行工具和 VS Code 插件。

## 项目结构

```
md2oa/
├── build.js                 # 命令行入口脚本
├── cli.js                   # 可选的 CLI 脚本
├── lib/
│   └── converter.js         # 核心转换逻辑（命令行和插件共享）
├── template.html            # 默认 HTML 模板
├── vs-extension/            # VS Code 插件源代码
│   ├── extension.js         # 插件主文件
│   ├── package.json         # 插件 manifest
│   ├── template.html        # 插件使用的模板副本
│   ├── README.md            # 插件文档
│   └── .vscodeignore        # 打包时忽略的文件
├── example/                 # 示例文件
│   ├── sample.md           # 示例 Markdown
│   └── sample-image.svg    # 示例图片
└── build/                   # 生成的输出目录
    └── wechat.html         # 转换后的 HTML
```

## 共享代码

核心转换逻辑在 `lib/converter.js` 中，提供了以下函数：

- `convertImagesToBase64()` - 将图片转换为 Base64
- `enhanceCodeBlocks()` - 代码块高亮和美化
- `convertMarkdownToHtml()` - Markdown 到 HTML 转换
- `loadTemplateWithContent()` - 模板加载和内容插入
- `convertMarkdownToWeChat()` - 完整的转换流程

## 命令行工具

### 开发

```bash
# 安装依赖
npm install

# 测试转换
node build.js example/sample.md

# 或使用 CLI 脚本
node cli.js example/sample.md
```

### 发布 NPM 包

```bash
npm publish
```

## VS Code 插件

### 本地开发

1. **打开插件开发环境**
```bash
code --extensionDevelopmentPath=vs-extension .
```

2. **在 VS Code 中按 F5 开始调试**

3. **修改代码后按 Ctrl+Shift+F5 重新加载**

### 测试

1. 在 VS Code 的新窗口中打开一个 Markdown 文件
2. 尝试各种激活方式：
   - 快捷键 `Cmd+Shift+M`
   - 编辑器标题栏按钮
   - 文件浏览器右键菜单
   - 命令面板搜索 "md2oa"

3. 检查输出通道查看日志

### 打包

```bash
# 全局安装 vsce
npm install -g @vscode/vsce

# 打包插件
cd vs-extension
vsce package

# 输出: md2oa-1.0.0.vsix
```

### 本地安装打包的插件

```bash
code --install-extension md2oa-1.0.0.vsix
```

### 发布到 VS Code Marketplace

```bash
# 需要创建 publisher account
# 参考: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

vsce publish
```

## 开发工作流

### 修改转换逻辑

1. 在 `lib/converter.js` 中修改核心逻辑
2. 测试命令行: `node build.js example/sample.md`
3. 测试插件: 在调试 VS Code 中打开 Markdown 文件并转换

### 修改插件界面

1. 在 `vs-extension/extension.js` 中修改插件代码
2. 在 `vs-extension/package.json` 中修改 manifest（命令、菜单等）
3. 在 VS Code 调试窗口中按 F5 重新加载

### 添加新功能

1. 在 `lib/converter.js` 中实现核心功能
2. 在 `vs-extension/extension.js` 中添加插件接口
3. 更新 `vs-extension/package.json` 的 `contributes` 部分

## 依赖管理

### 根项目依赖
```json
{
  "dependencies": {
    "cheerio": "^1.0.0-rc.12",
    "gray-matter": "^4.0.3",
    "highlight.js": "^11.9.0",
    "juice": "^9.1.0",
    "marked": "^11.1.1"
  }
}
```

### 插件额外依赖
```json
{
  "devDependencies": {
    "@vscode/vsce": "^2.21.0",
    "vscode": "^1.1.37"
  },
  "engines": {
    "vscode": "^1.75.0"
  }
}
```

## 常见问题

### 插件在调试时无法找到 template.html

确保 `vs-extension/template.html` 存在，或者在 `extension.js` 中检查路径查找逻辑。

### 命令行工具中文输出乱码

确保终端字符编码为 UTF-8：
```bash
export LANG=en_US.UTF-8
```

### 图片转换失败

检查：
1. 图片路径是否正确
2. 图片文件是否存在
3. 图片格式是否支持（JPEG, PNG, GIF, WebP, SVG）

## 测试清单

- [ ] 命令行工具正常转换 Markdown
- [ ] 插件在编辑器中可以激活
- [ ] 快捷键 Cmd+Shift+M 工作
- [ ] 编辑器标题栏按钮可见
- [ ] 文件浏览器右键菜单可见
- [ ] 转换输出文件正确生成
- [ ] 图片正确转换为 Base64
- [ ] 代码块正确高亮
- [ ] CSS 样式正确内联
- [ ] HTML 实体（&nbsp; 等）正确保留

## 版本发布流程

1. 更新 `package.json` 的版本号
2. 更新 `vs-extension/package.json` 的版本号
3. 更新 `CHANGELOG.md`
4. 提交并标记 Git tag: `git tag v1.0.0`
5. 推送: `git push origin main --tags`
6. 发布 NPM: `npm publish`
7. 发布插件: `cd vs-extension && vsce publish`

## 许可证

MIT
