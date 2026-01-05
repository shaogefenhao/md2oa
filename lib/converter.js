const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const cheerio = require('cheerio');
const hljs = require('highlight.js');
const juice = require('juice');
const matter = require('gray-matter');

/**
 * 将本地图片转换为 Base64 Data URL
 */
function convertImagesToBase64($, baseDir) {
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
            imagePath = path.join(baseDir, imgSrc);
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
                convertedCount++;
            }
        } catch (error) {
            // 忽略错误，继续处理
        }
    });

    return convertedCount;
}

/**
 * 给代码块添加简约灰色背景样式并进行高亮
 */
function enhanceCodeBlocks($) {
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
function loadTemplateWithContent(bodyHtml, templatePath) {
    let template = fs.readFileSync(templatePath, 'utf8');

    // 替换占位符
    template = template.replace('{{body}}', bodyHtml);

    return template;
}

/**
 * 完整的转换流程
 */
function convertMarkdownToWeChat(mdFilePath, templatePath, outputPath) {
    // 处理文件路径
    let fullMdPath;
    if (path.isAbsolute(mdFilePath)) {
        fullMdPath = mdFilePath;
    } else {
        fullMdPath = path.join(process.cwd(), mdFilePath);
    }

    if (!fs.existsSync(fullMdPath)) {
        throw new Error(`Markdown 文件不存在: ${fullMdPath}`);
    }

    const markdownContent = fs.readFileSync(fullMdPath, 'utf8');
    const { content: mdContent } = matter(markdownContent);

    // 转换 Markdown 为 HTML
    const bodyHtml = convertMarkdownToHtml(mdContent);

    // 加载模板并插入内容
    const fullHtml = loadTemplateWithContent(bodyHtml, templatePath);

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
    const NBSP_PLACEHOLDER = '___NBSP_PLACEHOLDER___';
    const BR_PLACEHOLDER = '___BR_PLACEHOLDER___';
    
    processedHtml = processedHtml.replace(/&nbsp;/g, NBSP_PLACEHOLDER);
    processedHtml = processedHtml.replace(/<br>/g, BR_PLACEHOLDER);
    
    let finalHtml = juice(processedHtml);
    
    // juice 处理后，还原 &nbsp; 和 <br>
    finalHtml = finalHtml.replace(new RegExp(NBSP_PLACEHOLDER, 'g'), '&nbsp;');
    finalHtml = finalHtml.replace(new RegExp(BR_PLACEHOLDER, 'g'), '<br>');

    // 确保输出目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 写入输出文件
    fs.writeFileSync(outputPath, finalHtml, 'utf8');

    return outputPath;
}

module.exports = {
    convertImagesToBase64,
    enhanceCodeBlocks,
    convertMarkdownToHtml,
    loadTemplateWithContent,
    convertMarkdownToWeChat
};
