const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const cheerio = require('cheerio');
const hljs = require('highlight.js');
const juice = require('juice');

// 获取脚本所在目录
const SCRIPT_DIR = __dirname;
const BUILD_DIR = path.join(SCRIPT_DIR, 'build');

/**
 * 将本地图片转换为 Base64 Data URL
 */
function convertImagesToBase64($, baseDir) {
    console.log('🔄 处理图片...');
    let convertedCount = 0;

    $('img').each((i, elem) => {
        const img = $(elem);
        const imgSrc = img.attr('src');

        if (!imgSrc || imgSrc.startsWith('data:') || imgSrc.startsWith('http') || imgSrc.startsWith('//')) {
            return;
        }

        // 构建完整的图片路径
        let imagePath;
        if (imgSrc.startsWith('/')) {
            imagePath = path.join(PROJECT_ROOT, imgSrc);
        } else {
            imagePath = path.resolve(baseDir, imgSrc);
        }

        try {
            if (fs.existsSync(imagePath)) {
                const imageBuffer = fs.readFileSync(imagePath);
                const ext = path.extname(imagePath).toLowerCase();
                const mimeTypes = {
                    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
                    '.png': 'image/png', '.gif': 'image/gif',
                    '.webp': 'image/webp', '.svg': 'image/svg+xml'
                };
                const mimeType = mimeTypes[ext] || 'image/jpeg';
                const base64Data = imageBuffer.toString('base64');
                const dataUrl = `data:${mimeType};base64,${base64Data}`;

                img.attr('src', dataUrl);
                console.log(`✅ 转换图片: ${imgSrc} -> Base64`);
                convertedCount++;
            } else {
                console.warn(`⚠️  图片文件不存在: ${imagePath}`);
            }
        } catch (error) {
            console.error(`❌ 处理图片时出错 (${imgSrc}):`, error.message);
        }
    });

    if (convertedCount > 0) {
        console.log(`🎉 共转换了 ${convertedCount} 张图片`);
    }
}

/**
 * 给代码块添加简约灰色背景样式并进行高亮
 */
function enhanceCodeBlocks($) {
    console.log('🎨 美化代码块样式 (Highlight.js)...');

    // 读取 Highlight.js 样式
    const stylePath = require.resolve('highlight.js/styles/github.css');
    const styleContent = fs.readFileSync(stylePath, 'utf8');

    // 注入样式到 head
    if ($('head').length === 0) {
        $('html').prepend('<head></head>');
    }
    $('head').append(`<style>${styleContent}</style>`);

    // 自定义样式：macOS 窗口 (使用 span 元素实现装饰，不干扰 code 标签)
    const customStyle = `
        pre.mac-code {
            font-size: 90%;
            overflow-x: auto;
            border-radius: 8px;
            padding: 0 !important;
            line-height: 1.5;
            margin: 10px 8px;
            background-color: #f6f8fa;
            border: 1px solid #eaedf0;
        }

        .mac-dots {
            display: block;
            margin: 12px 16px 0;
        }

        pre.mac-code code.hljs {
            display: -webkit-box;
            padding: 0.5em 1em 1em;
            overflow-x: auto;
            text-indent: 0;
            color: inherit;
            background: none;
            white-space: nowrap;
            margin: 0;
        }
    `;
    $('head').append(`<style>${customStyle}</style>`);

    // 查找所有的 pre 标签
    $('pre').each((i, elem) => {
        const preElem = $(elem);
        const codeElem = preElem.find('code');

        // 如果 pre 里面没有 code，可能不是代码块，跳过
        if (codeElem.length === 0) return;

        // 避免重复处理
        if (preElem.hasClass('mac-code')) return;

        // 获取原始代码文本
        const rawCode = codeElem.text();

        // 获取语言
        let language = 'plaintext';
        const classes = (preElem.attr('class') || '') + ' ' + (codeElem.attr('class') || '');

        // 优先匹配 language- 或者直接匹配常见的语言名
        const langMatch = classes.match(/language-([\w-]+)/) || classes.match(/\b([\w-]+)\b/);
        if (langMatch) {
            const possibleLang = langMatch[1];
            if (hljs.getLanguage(possibleLang)) {
                language = possibleLang;
            }
        }

        // 高亮
        let highlightedCode;
        try {
            if (language && hljs.getLanguage(language)) {
                highlightedCode = hljs.highlight(rawCode, { language }).value;
            } else {
                const autoHighlight = hljs.highlightAuto(rawCode);
                highlightedCode = autoHighlight.value;
            }
        } catch (err) {
            console.warn(`高亮失败 (${language}):`, err.message);
            highlightedCode = hljs.highlight(rawCode, { language: 'plaintext' }).value;
        }

        // 手动处理换行和空格，以兼容微信公众号
        highlightedCode = highlightedCode.replace(/(<[^>]+>)|([^<]+)/g, (match, tag, text) => {
            if (tag) return tag;
            return text.replace(/\r\n|\r|\n/g, '<br>').replace(/ /g, '&nbsp;');
        });

        // 构建新结构
        const svgDots = `<svg width="52" height="12" viewBox="0 0 52 12" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="6" fill="#FF5F56"/><circle cx="26" cy="6" r="6" fill="#FFBD2E"/><circle cx="46" cy="6" r="6" fill="#27C93F"/></svg>`;
        const newBlock = `<pre class="mac-code"><span class="mac-dots">${svgDots}</span><code class="hljs ${language}">${highlightedCode}</code></pre>`;

        // 替换原元素
        preElem.replaceWith(newBlock);
    });

    console.log(`✨ 代码块美化完成`);
}

/**
 * 将 Markdown 转换为 HTML
 */
function convertMarkdownToHtml(markdownContent) {
    // 配置 marked
    marked.setOptions({
        gfm: true,
        breaks: false,
        pedantic: false,
        smartLists: true,
        smartypants: false,
    });

    return marked(markdownContent);
}

/**
 * 加载模板并插入内容
 */
function loadTemplateWithContent(bodyHtml) {
    const templatePath = path.join(SCRIPT_DIR, 'template.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    // 替换占位符
    template = template.replace('{{body}}', bodyHtml);

    return template;
}

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

    // 处理文件路径
    let fullMdPath;
    if (path.isAbsolute(mdFilePath)) {
        fullMdPath = mdFilePath;
    } else {
        fullMdPath = path.join(SCRIPT_DIR, mdFilePath);
    }

    if (!fs.existsSync(fullMdPath)) {
        console.error(`❌ Markdown 文件不存在: ${fullMdPath}`);
        process.exit(1);
    }

    console.log(`📖 读取 Markdown: ${fullMdPath}`);
    const markdownContent = fs.readFileSync(fullMdPath, 'utf8');
    const matter = require('gray-matter');
    const { content: mdContent } = matter(markdownContent);

    // 转换 Markdown 为 HTML
    console.log('🔄 转换 Markdown 为 HTML...');
    const bodyHtml = convertMarkdownToHtml(mdContent);

    // 加载模板并插入内容
    console.log('📝 加载模板...');
    const fullHtml = loadTemplateWithContent(bodyHtml);

    // 使用 cheerio 加载 HTML
    const $ = cheerio.load(fullHtml, { decodeEntities: false });

    // 基准目录用于图片路径解析
    const baseDir = path.dirname(fullMdPath);

    // 转换图片为 Base64
    convertImagesToBase64($, baseDir);

    // 美化代码块
    enhanceCodeBlocks($);

    // 获取处理后的 HTML
    let processedHtml = $.html();

    // 使用 juice 内联 CSS
    console.log('🎨 内联 CSS 样式...');
    
    // 由于 juice 会转义 &nbsp;，我们先用占位符替换
    const NBSP_PLACEHOLDER = '___NBSP_PLACEHOLDER___';
    const BR_PLACEHOLDER = '___BR_PLACEHOLDER___';
    
    processedHtml = processedHtml.replace(/&nbsp;/g, NBSP_PLACEHOLDER);
    processedHtml = processedHtml.replace(/<br>/g, BR_PLACEHOLDER);
    
    let finalHtml = juice(processedHtml);
    
    // juice 处理后，还原 &nbsp; 和 <br>
    finalHtml = finalHtml.replace(new RegExp(NBSP_PLACEHOLDER, 'g'), '&nbsp;');
    finalHtml = finalHtml.replace(new RegExp(BR_PLACEHOLDER, 'g'), '<br>');

    // 写入输出文件
    const outputPath = path.join(BUILD_DIR, 'wechat.html');
    fs.writeFileSync(outputPath, finalHtml, 'utf8');

    console.log(`✅ 构建完成: ${outputPath}`);
    return outputPath;
}

// 主入口
if (require.main === module) {
    const args = process.argv.slice(2);
    const mdFilePath = args[0] || 'example/sample.md';

    build(mdFilePath);
}

module.exports = { build, convertMarkdownToHtml, convertImagesToBase64, enhanceCodeBlocks };
