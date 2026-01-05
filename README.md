# md2oa - Markdown 转微信公众号 HTML 转换器

将你的 Markdown 文章转换为美观格式化的 HTML，适合发布到微信公众号。

无需图床、本地运行、AI 友好。

**现已支持 VS Code 插件！** 🎉

## 功能特性

- ✨ 将 Markdown 转换为 HTML，本地运行无网络依赖
- 🖼️ 图片以 Base64 方式嵌入，无需图床
- 🎨  代码块语法高亮，macOS 风格装饰
- 📱  内联 CSS 样式，完美兼容微信
- 📝  简洁直观的 API
- 🔌 **VS Code 插件支持**（快捷键、右键菜单、命令面板）

## 安装

克隆项目到本地。

```bash
npm install
```

## 快速开始

### 方式 1: 命令行使用

```bash
# 转换 markdown 文件
node build.js example/sample.md

# 输出: build/wechat.html
```

### 方式 2: VS Code 插件使用

1. 打开任意 `.md` 文件
2. 使用以下任一方式：
   - **快捷键**: `Cmd+Shift+M`（macOS）/ `Ctrl+Shift+M`（Windows/Linux）
   - **编辑器标题栏**: 点击"Convert to WeChat OA HTML"按钮
   - **文件浏览器右键**: 选择"Convert to WeChat OA HTML"
   - **命令面板**: `Cmd+Shift+P` / `Ctrl+Shift+P` → 输入 "md2oa"

3. 转换完成后，可选择打开输出文件

### 方式 3: Node.js API 使用

```javascript
const { convertMarkdownToWeChat } = require('./lib/converter');

// 转换 markdown 文件
convertMarkdownToWeChat(
  'example/sample.md',
  'template.html',
  'build/wechat.html'
);
```

## 工作原理

1. **读取** Markdown 文件
2. **转换** 为 HTML（使用 marked）
3. **嵌入** 图片为 Base64（无需外部图片依赖）
4. **高亮** 代码块语法
5. **内联** CSS 样式，兼容微信
6. **生成** wechat.html，可直接复制粘贴

## 文件结构

```
md2oa/
├── build.js                    # 命令行入口
├── lib/
│   └── converter.js           # 核心转换逻辑
├── template.html              # HTML 模板
├── vs-extension/              # VS Code 插件
│   ├── extension.js           # 插件主文件
│   ├── package.json           # 插件清单
│   ├── template.html          # 插件模板副本
│   └── README.md              # 插件文档
├── example/
│   ├── sample.md             # 示例 markdown
│   └── sample-image.svg      # 示例图片
└── build/
    └── wechat.html           # 生成输出
```

## VS Code 插件开发

### 本地测试

```bash
# 在 vs-extension 目录中
code --extensionDevelopmentPath=. ..
```

### 打包扩展

```bash
# 安装 vsce
npm install -g @vscode/vsce

# 打包
cd vs-extension
vsce package
```

### 发布到 VS Code Marketplace

参考 [VS Code 官方文档](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

## 内置模板

项目包含 4 个内置模板，可根据需要选择：

- **wechat** - 微信公众号官方风格（推荐）
- **default** - GitHub 风格，简洁专业
- **dark** - 暗色主题，适合代码密集
- **minimal** - 极简风格，复古排版

## 配置与自定义

### 1. 配置文件支持

在项目根目录创建 `md2oa.config.json` 来自定义设置：

```json
{
  "template": "wechat",
  "outputPath": "build",
  "outputFileName": "wechat.html"
}
```

**配置选项说明：**

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `template` | string | `wechat` | 使用的模板名称 |
| `outputPath` | string | `build` | 输出目录 |
| `outputFileName` | string | `wechat.html` | 输出文件名 |

### 2. 使用指定模板

**命令行方式：**

```bash
# 使用 dark 模板转换
node build.js example/sample.md dark

# 使用 minimal 模板转换
node build.js example/sample.md minimal
```

**VS Code 插件：**

在 `md2oa.config.json` 中指定 `template` 字段，插件会自动使用该模板。

### 3. 自定义模板

#### 方式 A：在工作区中创建模板

在项目根目录下创建 `templates/` 文件夹，添加自定义模板：

```
project-root/
├── templates/
│   ├── custom.html        # 你的自定义模板
│   └── another-style.html # 另一个模板
├── md2oa.config.json      # 配置：使用 custom
└── example.md
```

在 `md2oa.config.json` 中使用：

```json
{
  "template": "custom"
}
```

#### 方式 B：修改默认模板

编辑项目中的 `template.html` 或 `vs-extension/template.html` 来修改样式。`{{body}}` 占位符标记内容插入位置：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        /* 在这里添加你的自定义样式 */
        body {
            font-family: 'Your Font', sans-serif;
            color: #333;
        }
    </style>
</head>
<body>
{{body}}
</body>
</html>
```

### 4. 模板优先级

扩展在查找模板时遵循以下优先级（从高到低）：

1. **工作区自定义模板** - `{workspace}/templates/{template-name}.html`
2. **扩展内置模板** - 插件内置的标准模板
3. **项目根模板** - `{workspace}/template.html`（向后兼容）
4. **扩展模板** - 扩展目录中的 `template.html`（向后兼容）

## 自定义模板

编辑模板文件来自定义样式。使用 `{{body}}` 占位符标记内容插入位置：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        /* 在这里添加你的自定义样式 */
    </style>
</head>
<body>
{{body}}
</body>
</html>
```

## 依赖库

- **marked** - Markdown 解析器
- **cheerio** - DOM 操作
- **highlight.js** - 代码语法高亮
- **juice** - CSS 内联处理
- **gray-matter** - 前置元数据解析器

## GitHub 仓库

本项目开源托管在 GitHub：

[shaogefenhao/md2oa](https://github.com/shaogefenhao/md2oa)

欢迎提交 Issue、Pull Request 或 Star ⭐

## 许可证

MIT
