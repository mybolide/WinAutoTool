/**
 * 键盘功能测试脚本
 */

const auto = require('./automate');

async function testKeyboard() {
  console.log('开始键盘测试...');
  
  try {
    // 获取当前键盘方法
    const currentMethod = auto.getKeyboardMethod();
    console.log(`当前键盘方法: ${currentMethod}`);
    
    // 等待3秒
    console.log('测试将在3秒后开始...');
    await auto.sleep(3000);
    
    // 基本按键测试
    console.log('\n基本按键测试:');
    console.log('按下ESC键...');
    auto.keyPress('ESCAPE');
    await auto.sleep(1000);
    
    console.log('按下空格键...');
    auto.keyPress('SPACE');
    await auto.sleep(1000);
    
    // 输入文本测试
    console.log('\n文本输入测试:');
    console.log('输入文本: "Hello World!"');
    auto.typeText('Hello World!');
    await auto.sleep(1000);
    
    // 输入中文测试
    console.log('\n中文输入测试:');
    console.log('先切换到中文输入法...');
    console.log('手动切换输入法，然后按回车继续...');
    await waitForEnter();
    
    console.log('复制中文文本到剪贴板并粘贴...');
    auto.copyToClipboard('你好，世界！');
    await auto.sleep(500);
    auto.keyCombo(['CTRL', 'V']);
    await auto.sleep(1000);
    
    // 组合键测试
    console.log('\n组合键测试:');
    
    console.log('测试Ctrl+A (全选)...');
    auto.keyCombo(['CTRL', 'A']);
    await auto.sleep(1000);
    
    console.log('测试Ctrl+C (复制)...');
    auto.keyCombo(['CTRL', 'C']);
    await auto.sleep(1000);
    
    const clipboardText = auto.getClipboardText();
    console.log(`剪贴板内容: "${clipboardText}"`);
    
    console.log('测试Delete键 (删除)...');
    auto.keyPress('DELETE');
    await auto.sleep(1000);
    
    // 特殊符号测试
    console.log('\n特殊符号测试:');
    console.log('输入特殊符号: @#$%^&*()_+{}|:"<>?~');
    auto.typeText('@#$%^&*()_+{}|:"<>?~');
    await auto.sleep(1000);
    
    // 功能键测试
    console.log('\n功能键测试:');
    console.log('按下F5键 (刷新)...');
    auto.keyPress('F5');
    await auto.sleep(2000); // 等待可能的页面刷新
    
    // 键盘方法切换测试
    console.log('\n键盘方法切换测试:');
    
    // 切换到另一种方法
    const newMethod = currentMethod === 'nircmd' ? 'native' : 'nircmd';
    console.log(`切换到${newMethod}方法...`);
    auto.setKeyboardMethod(newMethod);
    
    console.log(`使用${newMethod}方法输入文本: "Hello from ${newMethod}!"`);
    auto.typeText(`Hello from ${newMethod}!`);
    await auto.sleep(1000);
    
    // 恢复原始方法
    console.log(`恢复到${currentMethod}方法...`);
    auto.setKeyboardMethod(currentMethod);
    
    console.log('键盘测试完成!');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

// 等待用户按下回车键
function waitForEnter() {
  console.log('按回车键继续...');
  return new Promise(resolve => {
    process.stdin.once('data', data => {
      resolve();
    });
  });
}

// 根据命令行参数选择键盘方法
const args = process.argv.slice(2);
const method = args[0] || 'nircmd';

async function runTest() {
  // 设置键盘方法
  if (method === 'native' || method === 'nircmd') {
    console.log(`设置键盘方法为: ${method}`);
    auto.setKeyboardMethod(method);
  }
  
  // 运行测试
  await testKeyboard();
}

// 运行测试
runTest(); 