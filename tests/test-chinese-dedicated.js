/**
 * 专用中文输入函数测试
 */

const keyboard = require('../automate-keyboard-nircmd');
const { sleep } = require('../automate');

async function testChineseDedicated() {
  console.log('开始测试专用中文输入函数...');
  
  // 等待3秒以便操作者准备（例如打开记事本）
  console.log('请打开记事本或其他文本编辑器，然后等待3秒...');
  await sleep(3000);
  
  // 测试数据
  const chineseText = '你好，这是一段中文测试文本。包含特殊字符：！@#￥%……&*（）';
  
  console.log(`准备输入中文: ${chineseText}`);
  
  // 使用专用中文输入函数
  console.log('步骤1: 使用typeChineseText函数输入');
  try {
    const result = keyboard.typeChineseText(chineseText);
    console.log(`输入结果: ${result ? '成功' : '失败'}`);
  } catch (error) {
    console.error('输入失败:', error);
  }
  
  // 等待2秒
  await sleep(2000);
  
  // 使用组合键选择全部内容
  console.log('步骤2: 全选内容 (Ctrl+A)');
  keyboard.keyCombo(['CTRL', 'A']);
  
  // 等待1秒
  await sleep(1000);
  
  // 复制内容
  console.log('步骤3: 复制内容 (Ctrl+C)');
  keyboard.keyCombo(['CTRL', 'C']);
  
  // 等待1秒
  await sleep(1000);
  
  // 检查剪贴板内容
  console.log('步骤4: 检查剪贴板内容');
  const clipboardText = keyboard.getClipboardText();
  console.log(`剪贴板内容: ${clipboardText}`);
  
  // 比较原始文本和剪贴板内容
  console.log('步骤5: 比较原始文本和剪贴板内容');
  const isMatch = chineseText === clipboardText;
  console.log(`比较结果: ${isMatch ? '匹配成功 ✓' : '匹配失败 ✗'}`);
  
  if (!isMatch) {
    console.log('--- 详细比较 ---');
    console.log(`原始长度: ${chineseText.length}, 剪贴板长度: ${clipboardText.length}`);
    
    // 对比每个字符
    for (let i = 0; i < Math.max(chineseText.length, clipboardText.length); i++) {
      if (chineseText[i] !== clipboardText[i]) {
        console.log(`位置 ${i}: 原始='${chineseText[i]}', 剪贴板='${clipboardText[i]}'`);
      }
    }
  }
  
  console.log('测试完成');
}

// 运行测试
testChineseDedicated().catch(err => {
  console.error('测试过程中发生错误:', err);
}); 