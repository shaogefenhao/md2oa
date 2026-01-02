# md2oa - Markdown 转微信公众号 HTML 转换器

将你的 Markdown 文章转换为美观格式化的 HTML，适合发布到微信公众号。

无需图床、本地运行、AI 友好。

## 功能特性

- ✨ 将 Markdown 转换为 HTML，本地运行无网络依赖
- 🖼️ 图片以 Base64 方式嵌入，无需图床
- 🎨  代码块语法高亮，macOS 风格装饰
- 📱  内联 CSS 样式，完美兼容微信
- 📝  简洁直观的 API

## 安装

克隆项目到本地。

```bash
npm install
```

## 快速开始

### 命令行使用

```bash
# 转换 markdown 文件
node build.js example/sample.md

# 输出: build/wechat.html
```

### Node.js API 使用

```javascript
const { build } = require('./build');

// 转换 markdown 文件
build('example/sample.md');
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
├── build.js              # 主脚本
├── template.html         # HTML 模板
├── example/
│   ├── sample.md        # 示例 markdown
│   └── sample-image.svg # 示例图片
└── build/
    └── wechat.html      # 生成输出
```

## 自定义模板

编辑 `template.html` 来自定义样式。`{{body}}` 占位符标记内容插入位置：

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

## TODO

- 更多的模版
- VS Code 插件，更方便

## 许可证

MIT
