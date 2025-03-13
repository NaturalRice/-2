const fs = require('fs');
const path = require('path');

// 定义要读取的根目录
const rootDir = __dirname; // 当前脚本所在的目录

// 定义输出文件路径
const outputFilePath = path.join(rootDir, 'file_structure.txt');

// 递归读取目录结构
function readDirectory(dir, indent = '') {
  let result = '';
  const files = fs.readdirSync(dir);

  files.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const isLast = index === files.length - 1;

    // 添加当前文件或文件夹到结果中
    result += `${indent}${isLast ? '└── ' : '├── '}${file}\n`;

    // 如果是文件夹，递归读取
    if (stats.isDirectory()) {
      result += readDirectory(filePath, `${indent}${isLast ? '    ' : '│   '}`);
    }
  });

  return result;
}

// 生成文件结构
const fileStructure = readDirectory(rootDir);

// 将文件结构写入文本文件
fs.writeFileSync(outputFilePath, fileStructure, 'utf-8');

console.log('文件结构已生成并保存到 file_structure.txt');