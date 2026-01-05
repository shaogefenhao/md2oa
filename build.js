const fs = require('fs');
const path = require('path');
const { convertMarkdownToWeChat } = require('./lib/converter');
const { loadConfig, getTemplatePath } = require('./lib/config');

// 获取脚本所在目录
const SCRIPT_DIR = __dirname;

/**
 * 主构建函数
 */
function build(mdFilePath, userTemplate = null) {
    console.log('🚀 开始构建微信公众号文章...');
    console.log(`📄 文件: ${mdFilePath}`);

    // 加载配置
    const userConfig = loadConfig(SCRIPT_DIR);
    const template = userTemplate || userConfig.template;
    console.log(`📋 使用模板: ${template}`);

    // 获取输出目录和文件名
    const buildDir = path.join(SCRIPT_DIR, userConfig.outputPath || 'build');
    const outputFileName = userConfig.outputFileName || 'wechat.html';

    // 清理并创建 build 目录
    if (fs.existsSync(buildDir)) {
        fs.rmSync(buildDir, { recursive: true });
    }
    fs.mkdirSync(buildDir, { recursive: true });

    try {
        // 获取模板路径（支持 vs-extension/templates 目录）
        const templatePath = getTemplatePath(template, SCRIPT_DIR, path.join(SCRIPT_DIR, 'vs-extension'));
        if (!templatePath) {
            throw new Error(`找不到模板: ${template}`);
        }
        
        const outputPath = path.join(buildDir, outputFileName);

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
    const template = args[1] || null;  // 可选：指定模板

    build(mdFilePath, template);
}

module.exports = { build };
