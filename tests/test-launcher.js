/**
 * @file 启动器测试脚本
 * @description 测试应用程序启动器的各项功能
 */

const { launchApp, launchBrowser, launchOfficeApp, launchSystemApp } = require('../automate-launcher');

console.log('开始测试应用程序启动器...\n');

// 测试系统应用程序
console.log('测试系统应用程序:');
console.log('1. 启动记事本...');
launchSystemApp('notepad');

console.log('2. 启动计算器...');
launchSystemApp('calc');

console.log('3. 启动画图...');
launchSystemApp('paint');

// 等待一段时间
setTimeout(() => {
  // 测试浏览器
  console.log('\n测试浏览器:');
  console.log('1. 使用Chrome打开网页...');
  launchBrowser('https://www.example.com', 'chrome');

  console.log('2. 使用Firefox打开网页...');
  launchBrowser('https://www.example.com', 'firefox');

  console.log('3. 使用Edge打开网页...');
  launchBrowser('https://www.example.com', 'edge');

  // 等待一段时间
  setTimeout(() => {
    // 测试Office应用程序
    console.log('\n测试Office应用程序:');
    console.log('1. 启动Word...');
    launchOfficeApp('word');

    console.log('2. 启动Excel...');
    launchOfficeApp('excel');

    console.log('3. 启动PowerPoint...');
    launchOfficeApp('powerpoint');

    // 等待一段时间
    setTimeout(() => {
      // 测试其他应用程序
      console.log('\n测试其他应用程序:');
      console.log('1. 启动VS Code...');
      launchApp('vscode');

      console.log('2. 启动微信...');
      launchApp('wechat');

      console.log('3. 启动QQ...');
      launchApp('qq');

      console.log('\n测试完成！');
    }, 2000);
  }, 2000);
}, 2000); 