const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { convertMarkdownToWeChat } = require('../lib/converter');

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
        
        // 在工作区根目录下创建 build 目录
        const buildDir = path.join(workspacePath, 'build');
        if (!fs.existsSync(buildDir)) {
            fs.mkdirSync(buildDir, { recursive: true });
        }

        // 查找 template.html（在项目根目录或 vs-extension 目录）
        let templatePath = path.join(workspacePath, 'template.html');
        if (!fs.existsSync(templatePath)) {
            templatePath = path.join(workspacePath, 'vs-extension', 'template.html');
        }
        if (!fs.existsSync(templatePath)) {
            vscode.window.showErrorMessage('找不到 template.html 文件');
            return;
        }

        const outputPath = path.join(buildDir, 'wechat.html');

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
 * 从编辑器转换
 */
async function convertFromEditor() {
    const document = getCurrentMarkdownFile();
    if (!document) {
        return;
    }

    // 保存文件
    if (document.isDirty) {
        await document.save();
    }

    await performConversion(document.uri.fsPath);
}

/**
 * 从文件浏览器右键菜单转换
 */
async function convertFromExplorer(uri) {
    if (!uri) {
        vscode.window.showErrorMessage('无法获取文件路径');
        return;
    }

    if (!uri.fsPath.endsWith('.md')) {
        vscode.window.showErrorMessage('请选择 Markdown 文件 (.md)');
        return;
    }

    await performConversion(uri.fsPath);
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
        // 命令：从编辑器转换
        console.log('📝 注册命令: md2oa.convert');
        const convertCommand = vscode.commands.registerCommand(
            'md2oa.convert',
            convertFromEditor
        );
        log('✅ 命令已注册: md2oa.convert');

        // 命令：从文件浏览器转换
        console.log('📝 注册命令: md2oa.convertFile');
        const convertExplorerCommand = vscode.commands.registerCommand(
            'md2oa.convertFile',
            convertFromExplorer
        );
        log('✅ 命令已注册: md2oa.convertFile');

        // 订阅命令
        context.subscriptions.push(convertCommand);
        context.subscriptions.push(convertExplorerCommand);
        
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
