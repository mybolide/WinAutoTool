/**
 * 剪贴板功能测试脚本
 */

const auto = require('./automate');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

async function testClipboard() {
  console.log('开始测试剪贴板功能...');
  
  try {
    // 设置键盘方法为NirCmd
    console.log('设置键盘方法为NirCmd...');
    auto.setKeyboardMethod('nircmd');
    
    // 等待3秒
    console.log('测试将在3秒后开始...');
    console.log('请打开记事本或其他文本编辑器...');
    await auto.sleep(3000);
    
    // 测试复制英文到剪贴板
    const englishText = 'Hello World! This is a test.';
    console.log(`测试复制英文到剪贴板: "${englishText}"`);
    const englishCopyResult = auto.copyToClipboard(englishText);
    console.log(`英文复制结果: ${englishCopyResult ? '成功' : '失败'}`);
    
    // 测试从剪贴板获取英文
    const clipboardEnglish = auto.getClipboardText();
    console.log(`剪贴板中的英文内容: "${clipboardEnglish}"`);
    
    // 测试粘贴英文
    console.log('测试粘贴英文...');
    const pasteEnglishResult = auto.keyCombo(['CTRL', 'V']);
    console.log(`英文粘贴结果: ${pasteEnglishResult ? '成功' : '失败'}`);
    
    await auto.sleep(1000);
    
    // 测试复制中文到剪贴板
    const chineseText = '你好，世界！这是一个测试。';
    console.log(`测试复制中文到剪贴板: "${chineseText}"`);
    const chineseCopyResult = auto.copyToClipboard(chineseText);
    console.log(`中文复制结果: ${chineseCopyResult ? '成功' : '失败'}`);
    
    // 测试从剪贴板获取中文
    const clipboardChinese = auto.getClipboardText();
    console.log(`剪贴板中的中文内容: "${clipboardChinese}"`);
    
    // 测试粘贴中文
    console.log('测试粘贴中文...');
    const pasteChineseResult = auto.keyCombo(['CTRL', 'V']);
    console.log(`中文粘贴结果: ${pasteChineseResult ? '成功' : '失败'}`);
    
    await auto.sleep(1000);
    
    // 测试复制混合内容到剪贴板
    const mixedText = '中英文混合 Mixed Chinese and English 测试 123!@#$%^&*()';
    console.log(`测试复制混合内容到剪贴板: "${mixedText}"`);
    const mixedCopyResult = auto.copyToClipboard(mixedText);
    console.log(`混合内容复制结果: ${mixedCopyResult ? '成功' : '失败'}`);
    
    // 测试从剪贴板获取混合内容
    const clipboardMixed = auto.getClipboardText();
    console.log(`剪贴板中的混合内容: "${clipboardMixed}"`);
    
    // 测试粘贴混合内容
    console.log('测试粘贴混合内容...');
    const pasteMixedResult = auto.keyCombo(['CTRL', 'V']);
    console.log(`混合内容粘贴结果: ${pasteMixedResult ? '成功' : '失败'}`);
    
    console.log('测试完成!');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

// 运行测试
testClipboard(); 