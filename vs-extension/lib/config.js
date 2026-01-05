const fs = require('fs');
const path = require('path');

/**
 * 加载工作区配置文件
 * @param {string} workspacePath - 工作区根目录路径
 * @returns {object} 配置对象，包含 template 和其他选项
 */
function loadConfig(workspacePath) {
    const configPath = path.join(workspacePath, 'md2oa.config.json');
    
    // 默认配置
    const defaultConfig = {
        template: 'wechat',  // 默认使用 wechat 模板
        outputPath: 'build',
        outputFileName: 'wechat.html'
    };

    try {
        if (fs.existsSync(configPath)) {
            const configContent = fs.readFileSync(configPath, 'utf8');
            const userConfig = JSON.parse(configContent);
            return { ...defaultConfig, ...userConfig };
        }
    } catch (error) {
        console.warn(`Failed to load config from ${configPath}:`, error.message);
    }

    return defaultConfig;
}

/**
 * 获取模板文件路径
 * @param {string} templateName - 模板名称 (e.g., 'default', 'dark', 'minimal', 'wechat')
 * @param {string} workspacePath - 工作区根目录
 * @param {string} extensionPath - 扩展目录路径
 * @returns {string|null} 模板文件的完整路径，未找到返回 null
 */
function getTemplatePath(templateName, workspacePath, extensionPath) {
    // 优先级：
    // 1. 工作区自定义模板 (workspacePath/templates/{templateName}.html)
    // 2. 扩展内置模板 (extensionPath/templates/{templateName}.html)
    // 3. 项目根目录模板 (workspacePath/template.html - 向后兼容)
    // 4. 扩展目录模板 (extensionPath/template.html - 向后兼容)

    const customTemplatePath = path.join(workspacePath, 'templates', `${templateName}.html`);
    if (fs.existsSync(customTemplatePath)) {
        return customTemplatePath;
    }

    const builtinTemplatePath = path.join(extensionPath, 'templates', `${templateName}.html`);
    if (fs.existsSync(builtinTemplatePath)) {
        return builtinTemplatePath;
    }

    // 向后兼容：查找 template.html
    const legacyWorkspacePath = path.join(workspacePath, 'template.html');
    if (fs.existsSync(legacyWorkspacePath)) {
        return legacyWorkspacePath;
    }

    const legacyExtensionPath = path.join(extensionPath, 'template.html');
    if (fs.existsSync(legacyExtensionPath)) {
        return legacyExtensionPath;
    }

    return null;
}

/**
 * 列出所有可用的模板
 * @param {string} workspacePath - 工作区根目录
 * @param {string} extensionPath - 扩展目录路径
 * @returns {array} 可用模板名称列表
 */
function listTemplates(workspacePath, extensionPath) {
    const templates = new Set();

    // 扫描工作区自定义模板
    const customDir = path.join(workspacePath, 'templates');
    if (fs.existsSync(customDir)) {
        fs.readdirSync(customDir)
            .filter(f => f.endsWith('.html'))
            .forEach(f => templates.add(f.replace('.html', '')));
    }

    // 扫描扩展内置模板
    const builtinDir = path.join(extensionPath, 'templates');
    if (fs.existsSync(builtinDir)) {
        fs.readdirSync(builtinDir)
            .filter(f => f.endsWith('.html'))
            .forEach(f => templates.add(f.replace('.html', '')));
    }

    return Array.from(templates).sort();
}

module.exports = {
    loadConfig,
    getTemplatePath,
    listTemplates
};
