# 快速入门指南

## 5 分钟上手

### 安装

```bash
# 克隆仓库
git clone https://github.com/shaogefenhao/md2oa.git
cd md2oa

# 安装依赖
npm install
```

### 方式 1: 命令行使用（最简单）

```bash
# 转换 example/sample.md
node build.js example/sample.md

# 输出文件: build/wechat.html
# 在浏览器中打开查看效果，或复制内容到微信公众号
```

### 方式 2: VS Code 插件使用

1. **安装插件**
   - 在 VS Code 中打开命令面板 `Cmd+Shift+P`
   - 输入 "Install from VSIX"
   - 选择 `vs-extension/md2oa-1.0.0.vsix`

2. **使用插件**
   - 打开任意 `.md` 文件
   - 按 `Cmd+Shift+M` 快速转换
   - 或右键菜单选择 "Convert to WeChat OA HTML"

### 方式 3: 在代码中使用

```javascript
const { convertMarkdownToWeChat } = require('./lib/converter');

convertMarkdownToWeChat(
  'your-article.md',     // Markdown 文件路径
  'template.html',        // HTML 模板路径
  'output.html'          // 输出文件路径
);
```

## 下一步

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
