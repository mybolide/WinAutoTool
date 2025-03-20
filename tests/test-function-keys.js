/**
 * 功能键测试脚本 - 测试F1-F12键在笔记本电脑上的表现
 */

const keyboard = require('../automate-keyboard-nircmd');
const { sleep } = require('../automate');

async function testFunctionKeys() {
  console.log('开始测试功能键 (F1-F12)...');
  console.log('请确保当前有一个文本编辑器窗口处于活动状态');
  
  // 等待5秒，让用户切换到文本编辑器
  console.log('等待5秒钟，请切换到记事本或其他文本编辑器...');
  await sleep(5000);
  
  console.log('开始测试单个功能键...');
  
  // 测试单个功能键
  for (let i = 1; i <= 12; i++) {
    const functionKey = `F${i}`;
    console.log(`测试功能键: ${functionKey}`);
    
    // 按下功能键
    const result = keyboard.keyPress(functionKey);
    console.log(`${functionKey} 按键结果: ${result ? '成功' : '失败'}`);
    
    // 等待1秒观察结果
    await sleep(1000);
  }
  
  console.log('\n开始测试常见功能键组合...');
  
  // 测试组合键
  const combos = [
    ['CTRL', 'F1'],  // 常见的帮助组合键
    ['ALT', 'F4'],   // 关闭窗口
    ['CTRL', 'F5'],  // 刷新（在浏览器中）
    ['SHIFT', 'F3'], // 常见的查找组合键
    ['CTRL', 'SHIFT', 'F5'] // 三键组合
  ];
  
  for (const combo of combos) {
    console.log(`测试组合键: ${combo.join('+')}`);
    
    // 按下组合键
    const result = keyboard.keyCombo(combo);
    console.log(`${combo.join('+')} 组合键结果: ${result ? '成功' : '失败'}`);
    
    // 等待1.5秒观察结果
    await sleep(1500);
    
    // 如果是Alt+F4，可能会关闭窗口，所以等待更长时间
    if (combo.includes('ALT') && combo.includes('F4')) {
      console.log('注意: Alt+F4可能会关闭当前窗口');
      await sleep(2000);
    }
  }
  
  console.log('\n功能键测试完成!');
}

// 运行测试
testFunctionKeys().catch(err => {
  console.error('测试过程中发生错误:', err);
}); 