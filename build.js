const fs = require('fs');
const path = require('path');
const { convertMarkdownToWeChat } = require('./lib/converter');

// 获取脚本所在目录
const SCRIPT_DIR = __dirname;
const BUILD_DIR = path.join(SCRIPT_DIR, 'build');

/**
 * 主构建函数
 */
function build(mdFilePath) {
    console.log('🚀 开始构建微信公众号文章...');
    console.log(`📄 文件: ${mdFilePath}`);

    // 清理并创建 build 目录
    if (fs.existsSync(BUILD_DIR)) {
        fs.rmSync(BUILD_DIR, { recursive: true });
    }
    fs.mkdirSync(BUILD_DIR, { recursive: true });

    try {
        const templatePath = path.join(SCRIPT_DIR, 'template.html');
        const outputPath = path.join(BUILD_DIR, 'wechat.html');

        console.log('🔄 转换 Markdown 为 HTML...');
        console.log('📝 加载模板...');
        console.log('🔄 处理图片...');
        console.log('🎨 美化代码块样式 (Highlight.js)...');
        console.log('🎨 内联 CSS 样式...');

        convertMarkdownToWeChat(mdFilePath, templatePath, outputPath);

        console.log(`✅ 构建完成: ${outputPath}`);
        return outputPath;
    } catch (error) {
        console.error(`❌ 构建失败:`, error.message);
        process.exit(1);
    }
}

// 主入口
if (require.main === module) {
    const args = process.argv.slice(2);
    const mdFilePath = args[0] || 'example/sample.md';

    build(mdFilePath);
}

module.exports = { build };
