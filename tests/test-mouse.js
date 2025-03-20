/**
 * 鼠标功能测试脚本
 */

const auto = require('./automate');

async function runMouseTest() {
  console.log('开始鼠标测试...');
  
  try {
    // 获取屏幕尺寸
    const screen = auto.getScreenSize();
    console.log('屏幕尺寸:', screen);
    
    // 等待3秒
    console.log('测试将在3秒后开始...');
    await auto.sleep(3000);
    
    // 获取当前鼠标位置
    const initialPos = auto.getMousePosition();
    console.log('初始鼠标位置:', initialPos);
    
    // 移动到屏幕中央
    const centerX = Math.floor(screen.width / 2);
    const centerY = Math.floor(screen.height / 2);
    console.log(`移动鼠标到屏幕中央(${centerX}, ${centerY})...`);
    
    auto.setMousePosition(centerX, centerY);
    await auto.sleep(1000);
    
    // 获取新的鼠标位置
    const centerPos = auto.getMousePosition();
    console.log('中央位置:', centerPos);
    
    // 移动到四个角落
    // 1. 左上角
    console.log('移动到左上角...');
    auto.setMousePosition(50, 50);
    await auto.sleep(1000);
    
    // 2. 右上角
    console.log('移动到右上角...');
    auto.setMousePosition(screen.width - 50, 50);
    await auto.sleep(1000);
    
    // 3. 右下角
    console.log('移动到右下角...');
    auto.setMousePosition(screen.width - 50, screen.height - 50);
    await auto.sleep(1000);
    
    // 4. 左下角
    console.log('移动到左下角...');
    auto.setMousePosition(50, screen.height - 50);
    await auto.sleep(1000);
    
    // 回到中央
    console.log('回到中央...');
    auto.setMousePosition(centerX, centerY);
    await auto.sleep(1000);
    
    // 点击测试
    console.log('左键点击测试...');
    auto.mouseClick('left');
    await auto.sleep(1000);
    
    console.log('右键点击测试...');
    auto.mouseRightClick();
    await auto.sleep(1000);
    
    // 按ESC关闭可能出现的右键菜单
    auto.keyPress('ESCAPE');
    await auto.sleep(500);
    
    console.log('双击测试...');
    auto.mouseDoubleClick();
    await auto.sleep(1000);
    
    // 拖拽测试
    console.log('拖拽测试: 从屏幕中央向右下角拖动100像素...');
    auto.mouseDrag(centerX, centerY, centerX + 100, centerY + 100);
    await auto.sleep(1000);
    
    // 滚轮测试
    console.log('滚轮测试: 向下滚动...');
    auto.mouseScroll(-5);
    await auto.sleep(1000);
    
    console.log('滚轮测试: 向上滚动...');
    auto.mouseScroll(5);
    await auto.sleep(1000);
    
    // 回到初始位置
    console.log('回到初始位置...');
    auto.setMousePosition(initialPos.x, initialPos.y);
    
    // 测试完成
    console.log('鼠标测试完成!');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

/**
 * 测试NirCmd方式的鼠标右键点击
 */
async function testNirCmdRightClick() {
  console.log('开始测试NirCmd方式的鼠标右键点击...');
  
  try {
    // 获取当前点击方法
    const currentMethod = auto.getClickMethod();
    console.log(`当前点击方法: ${currentMethod}`);
    
    // 确保使用NirCmd方法
    console.log('设置点击方法为NirCmd...');
    auto.setClickMethod('nircmd');
    
    // 获取屏幕尺寸和当前鼠标位置
    const screen = auto.getScreenSize();
    console.log('屏幕尺寸:', screen);
    
    const initialPos = auto.getMousePosition();
    console.log('初始鼠标位置:', initialPos);
    
    // 等待3秒
    console.log('测试将在3秒后开始，请不要移动鼠标...');
    await auto.sleep(3000);
    
    // 移动到屏幕中央
    const centerX = Math.floor(screen.width / 2);
    const centerY = Math.floor(screen.height / 2);
    console.log(`移动鼠标到屏幕中央(${centerX}, ${centerY})...`);
    
    auto.setMousePosition(centerX, centerY);
    await auto.sleep(1000);
    
    // 右键点击
    console.log('执行右键点击...');
    const result = auto.mouseRightClick();
    console.log(`右键点击结果: ${result ? '成功' : '失败'}`);
    
    // 等待2秒查看右键菜单
    await auto.sleep(2000);
    
    // 手动关闭右键菜单
    console.log('请手动关闭右键菜单(或者按ESC)...');
    await auto.sleep(2000);
    
    // 回到初始位置
    console.log('移动回初始位置...');
    auto.setMousePosition(initialPos.x, initialPos.y);
    
    console.log('测试完成!');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

/**
 * 测试不同鼠标点击方法
 */
async function testClickMethods() {
  console.log('开始测试不同鼠标点击方法...');
  
  try {
    // 保存原始点击方法
    const originalMethod = auto.getClickMethod();
    console.log(`原始点击方法: ${originalMethod}`);
    
    // 测试native方法
    console.log('\n测试原生(native)点击方法:');
    auto.setClickMethod('native');
    console.log(`点击方法已设置为: ${auto.getClickMethod()}`);
    
    const initialPos1 = auto.getMousePosition();
    console.log('初始鼠标位置:', initialPos1);
    
    // 等待2秒
    console.log('请等待2秒...');
    await auto.sleep(2000);
    
    console.log('执行原生左键点击...');
    const leftResult = auto.mouseClick('left');
    console.log(`左键点击结果: ${leftResult ? '成功' : '失败'}`);
    await auto.sleep(1000);
    
    console.log('执行原生右键点击...');
    const rightResult = auto.mouseRightClick();
    console.log(`右键点击结果: ${rightResult ? '成功' : '失败'}`);
    await auto.sleep(2000);
    auto.keyPress('ESCAPE'); // 关闭可能的右键菜单
    
    // 测试NirCmd方法
    console.log('\n测试NirCmd点击方法:');
    auto.setClickMethod('nircmd');
    console.log(`点击方法已设置为: ${auto.getClickMethod()}`);
    
    console.log('执行NirCmd左键点击...');
    const nircmdLeftResult = auto.mouseClick('left');
    console.log(`左键点击结果: ${nircmdLeftResult ? '成功' : '失败'}`);
    await auto.sleep(1000);
    
    console.log('执行NirCmd右键点击...');
    const nircmdRightResult = auto.mouseRightClick();
    console.log(`右键点击结果: ${nircmdRightResult ? '成功' : '失败'}`);
    await auto.sleep(2000);
    auto.keyPress('ESCAPE'); // 关闭可能的右键菜单
    
    // 恢复原始点击方法
    auto.setClickMethod(originalMethod);
    console.log(`已恢复原始点击方法: ${auto.getClickMethod()}`);
    
    console.log('点击方法测试完成!');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

// 根据命令行参数选择要运行的测试
const args = process.argv.slice(2);
const testName = args[0] || 'all';

// 运行选择的测试
async function runTests() {
  try {
    switch (testName.toLowerCase()) {
      case 'general':
        await runMouseTest();
        break;
      case 'nircmd':
        await testNirCmdRightClick();
        break;
      case 'methods':
        await testClickMethods();
        break;
      case 'all':
      default:
        console.log('运行所有测试...\n');
        await runMouseTest();
        console.log('\n---------------------------------\n');
        await testNirCmdRightClick();
        console.log('\n---------------------------------\n');
        await testClickMethods();
        break;
    }
  } catch (error) {
    console.error('测试运行错误:', error);
  }
}

// 运行测试
runTests(); 