#!/usr/bin/env node

/**
 * 命令行入口
 * 使用方式: node cli.js <markdown-file>
 * 或: node cli.js example/sample.md
 */

const path = require('path');
const { build } = require('./build');

const args = process.argv.slice(2);
const mdFilePath = args[0] || 'example/sample.md';

console.log('🚀 md2oa - Markdown to WeChat OA Converter');
console.log('=========================================\n');

build(mdFilePath);
