#!/bin/bash

# VS Code 插件快速安装脚本

echo "🚀 md2oa VS Code 插件安装助手"
echo "=============================="
echo ""

VSIX_FILE="/Users/ning/www/md2oa/build/md2oa.vsix"
VSCODE_EXTENSIONS_DIR="$HOME/.vscode/extensions"
PLUGIN_DIR="$VSCODE_EXTENSIONS_DIR/md2oa-1.0.0"

# 检查 VSIX 文件是否存在
if [ ! -f "$VSIX_FILE" ]; then
    echo "❌ 找不到 VSIX 文件: $VSIX_FILE"
    echo "请先运行: npm run package-extension"
    exit 1
fi

echo "📦 VSIX 文件: $VSIX_FILE"
echo "📊 文件大小: $(du -h "$VSIX_FILE" | cut -f1)"
echo ""

# 创建扩展目录
mkdir -p "$VSCODE_EXTENSIONS_DIR"

# 检查是否已安装
if [ -d "$PLUGIN_DIR" ]; then
    echo "⚠️  插件已安装在: $PLUGIN_DIR"
    read -p "是否要覆盖安装? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 已取消"
        exit 1
    fi
    echo "🗑️  删除旧版本..."
    rm -rf "$PLUGIN_DIR"
fi

# 解压 VSIX 文件
echo "📥 解压 VSIX 文件..."
mkdir -p "$PLUGIN_DIR"
unzip -q "$VSIX_FILE" -d "$PLUGIN_DIR"

if [ $? -eq 0 ]; then
    echo "✅ 插件安装成功！"
    echo ""
    echo "📍 安装位置: $PLUGIN_DIR"
    echo ""
    echo "📋 下一步:"
    echo "1. 重启 VS Code"
    echo "2. 打开一个 Markdown 文件 (.md)"
    echo "3. 尝试快捷键: Cmd+Shift+M 或右键菜单选项"
    echo ""
    echo "📖 更多信息: 查看 PLUGIN_TEST.md"
else
    echo "❌ 安装失败！"
    exit 1
fi
