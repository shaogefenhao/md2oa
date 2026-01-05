const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
let convertMarkdownToWeChat;
let config;
try {
    // Prefer the converter bundled inside the extension package
    const conv = require(path.join(__dirname, 'lib', 'converter'));
    convertMarkdownToWeChat = conv.convertMarkdownToWeChat;
    config = require(path.join(__dirname, 'lib', 'config'));
} catch (e) {
    // Fallback to repository-level converter when running from workspace
    const conv = require('../lib/converter');
    convertMarkdownToWeChat = conv.convertMarkdownToWeChat;
    config = require('../lib/config');
}

let outputChannel;

function log(message) {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel('md2oa');
    }
    outputChannel.appendLine(message);
}

/**
 * 获取当前编辑器的 Markdown 文件
 */
function getCurrentMarkdownFile() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('请先打开一个 Markdown 文件');
        return null;
    }

    const document = editor.document;
    if (document.languageId !== 'markdown') {
        vscode.window.showErrorMessage('当前文件不是 Markdown 格式，请打开 .md 文件');
        return null;
    }

    return document;
}

/**
 * 执行转换
 */
async function performConversion(mdFilePath) {
    try {
        log('🚀 开始转换...');
        log(`📄 文件: ${mdFilePath}`);

        // 获取工作区根目录
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(mdFilePath));
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('无法确定工作区路径');
            return;
        }

        const workspacePath = workspaceFolder.uri.fsPath;
        
        // 加载配置
        const userConfig = config.loadConfig(workspacePath);
        log(`📋 配置: 使用模板 "${userConfig.template}"`);
        
        // 在工作区根目录下创建 build 目录
        const buildDir = path.join(workspacePath, userConfig.outputPath || 'build');
        if (!fs.existsSync(buildDir)) {
            fs.mkdirSync(buildDir, { recursive: true });
        }

        // 查找模板（优先级：自定义 -> 扩展内置 -> 项目根 -> 扩展 -> 默认）
        let templatePath = config.getTemplatePath(userConfig.template, workspacePath, __dirname);
        if (!templatePath) {
            vscode.window.showErrorMessage(`找不到模板: ${userConfig.template}`);
            log(`❌ 模板文件未找到: ${userConfig.template}`);
            return;
        }
        log(`📝 模板路径: ${templatePath}`);

        const outputPath = path.join(buildDir, userConfig.outputFileName || 'wechat.html');

        log('🔄 处理图片...');
        log('🎨 美化代码块...');
        log('🎨 内联 CSS 样式...');

        convertMarkdownToWeChat(mdFilePath, templatePath, outputPath);

        log(`✅ 转换完成: ${outputPath}`);

        // 显示完成提示，并询问是否打开文件
        vscode.window.showInformationMessage('✅ 转换完成！', '打开文件', '打开文件夹').then((selection) => {
            if (selection === '打开文件') {
                vscode.commands.executeCommand('vscode.open', vscode.Uri.file(outputPath));
            } else if (selection === '打开文件夹') {
                vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outputPath));
            }
        });

        outputChannel.show();
    } catch (error) {
        log(`❌ 转换失败: ${error.message}`);
        vscode.window.showErrorMessage(`转换失败: ${error.message}`);
        outputChannel.show();
    }
}

/**
 * 统一的转换命令处理器
 * 支持从编辑器和文件浏览器调用
 */
async function handleConvert(uri) {
    try {
        let mdFilePath;

        // 如果提供了 URI（来自右键菜单），直接使用
        if (uri && uri.fsPath) {
            // 验证是否是 Markdown 文件
            if (!uri.fsPath.endsWith('.md')) {
                vscode.window.showErrorMessage('请选择 Markdown 文件 (.md)');
                return;
            }
            mdFilePath = uri.fsPath;
        } else {
            // 否则从当前编辑器获取
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('请先打开一个 Markdown 文件');
                return;
            }

            const document = editor.document;
            if (document.languageId !== 'markdown') {
                vscode.window.showErrorMessage('当前文件不是 Markdown 格式，请打开 .md 文件');
                return;
            }

            // 保存文件
            if (document.isDirty) {
                await document.save();
            }

            mdFilePath = document.uri.fsPath;
        }

        await performConversion(mdFilePath);
    } catch (error) {
        console.error('转换错误:', error);
        vscode.window.showErrorMessage('转换失败: ' + error.message);
    }
}

/**
 * 扩展激活时调用
 */
function activate(context) {
    console.log('🚀 md2oa 插件正在激活...');

    // 创建输出通道
    outputChannel = vscode.window.createOutputChannel('md2oa');
    log('✅ 输出通道已创建');

    try {
        // 注册统一的转换命令
        console.log('📝 注册命令: md2oa.convert');
        const convertCommand = vscode.commands.registerCommand(
            'md2oa.convert',
            handleConvert
        );
        log('✅ 命令已注册: md2oa.convert');

        // 订阅命令
        context.subscriptions.push(convertCommand);
        
        log('✅ md2oa 插件已完全加载');
        console.log('✅ md2oa 插件已完全加载');
    } catch (error) {
        console.error('❌ 插件激活失败:', error);
        log('❌ 插件激活失败: ' + error.message);
    }
}

/**
 * 扩展停用时调用
 */
function deactivate() {
    if (outputChannel) {
        outputChannel.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};
