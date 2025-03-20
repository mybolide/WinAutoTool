/**
 * 自动化功能测试脚本
 * 测试所有的键盘和鼠标操作
 */

const auto = require('./automate');

async function runTests() {
  console.log('开始自动化测试...');
  console.log('系统信息:', auto.getSystemInfo());
  
  try {
    // 测试延迟函数
    console.log('测试延迟函数...');
    console.log('等待3秒...');
    await auto.sleep(3000);
    console.log('延迟函数测试通过');
    
    // 获取屏幕尺寸
    console.log('\n测试获取屏幕尺寸...');
    const screenSize = auto.getScreenSize();
    console.log('屏幕尺寸:', screenSize);
    
    // 获取鼠标位置
    console.log('\n测试获取鼠标位置...');
    const mousePos = auto.getMousePosition();
    console.log('当前鼠标位置:', mousePos);
    
    // 设置鼠标位置 (移动到屏幕中央)
    console.log('\n测试设置鼠标位置...');
    const centerX = Math.floor(screenSize.width / 2);
    const centerY = Math.floor(screenSize.height / 2);
    console.log(`移动鼠标到屏幕中央(${centerX}, ${centerY})...`);
    auto.setMousePosition(centerX, centerY);
    await auto.sleep(1000);
    
    // 再次获取鼠标位置进行验证
    const newPos = auto.getMousePosition();
    console.log('新的鼠标位置:', newPos);
    console.log(`位置变化: x差异=${Math.abs(newPos.x - centerX)}, y差异=${Math.abs(newPos.y - centerY)}`);
    
    // 准备记事本测试
    console.log('\n打开记事本进行键盘测试...');
    auto.runCommand('notepad');
    await auto.sleep(1500); // 等待记事本打开
    
    // 测试文本输入
    console.log('\n测试文本输入...');
    auto.typeText('这是一个自动化测试。这段文本是通过自动化脚本输入的。');
    await auto.sleep(500);
    auto.keyPress('ENTER');
    await auto.sleep(200);
    auto.typeText('当前时间: ' + new Date().toLocaleString());
    await auto.sleep(1000);
    
    // 测试组合键 - Ctrl+A选择全部文本
    console.log('\n测试组合键 - Ctrl+A...');
    auto.keyCombo(['CTRL', 'A']);
    await auto.sleep(500);
    
    // 保存文件 - Ctrl+S
    console.log('\n测试保存功能...');
    auto.saveWithCtrlS();
    await auto.sleep(1500);
    
    // 取消保存对话框 - 按ESC
    console.log('取消保存对话框...');
    auto.keyPress('ESCAPE');
    await auto.sleep(500);
    
    // 关闭记事本 - Alt+F4
    console.log('\n测试Alt+F4关闭窗口...');
    auto.keyCombo(['ALT', 'F4']);
    await auto.sleep(500);
    
    // 不保存 - 按Tab然后按Enter
    console.log('在不保存提示中选择不保存...');
    auto.keyPress('TAB');
    await auto.sleep(200);
    auto.keyPress('ENTER');
    await auto.sleep(1000);
    
    // 鼠标测试准备
    console.log('\n进行鼠标测试...');
    console.log('请注意观察鼠标移动和点击');
    
    // 移动鼠标到不同位置
    console.log('\n测试鼠标移动...');
    // 左上角
    console.log('移动到左上角...');
    auto.setMousePosition(50, 50);
    await auto.sleep(1000);
    
    // 右上角
    console.log('移动到右上角...');
    auto.setMousePosition(screenSize.width - 50, 50);
    await auto.sleep(1000);
    
    // 右下角
    console.log('移动到右下角...');
    auto.setMousePosition(screenSize.width - 50, screenSize.height - 50);
    await auto.sleep(1000);
    
    // 左下角
    console.log('移动到左下角...');
    auto.setMousePosition(50, screenSize.height - 50);
    await auto.sleep(1000);
    
    // 回到中心
    console.log('移动回中心...');
    auto.setMousePosition(centerX, centerY);
    await auto.sleep(1000);
    
    // 测试鼠标点击
    console.log('\n测试鼠标点击...');
    console.log('左键点击...');
    auto.mouseClick('left');
    await auto.sleep(1000);
    
    console.log('右键点击...');
    auto.mouseRightClick();
    await auto.sleep(1000);
    
    // 按ESC关闭可能出现的右键菜单
    auto.keyPress('ESCAPE');
    await auto.sleep(500);
    
    console.log('双击测试...');
    auto.mouseDoubleClick();
    await auto.sleep(1000);
    
    // 测试鼠标拖拽
    console.log('\n测试鼠标拖拽...');
    // 从中心向右下拖动100像素
    const dragStartX = centerX;
    const dragStartY = centerY;
    const dragEndX = centerX + 100;
    const dragEndY = centerY + 100;
    
    console.log(`从(${dragStartX}, ${dragStartY})拖动到(${dragEndX}, ${dragEndY})...`);
    auto.mouseDrag(dragStartX, dragStartY, dragEndX, dragEndY);
    await auto.sleep(1000);
    
    // 测试鼠标滚轮
    console.log('\n测试鼠标滚轮...');
    console.log('向下滚动...');
    auto.mouseScroll(-10);
    await auto.sleep(1000);
    
    console.log('向上滚动...');
    auto.mouseScroll(10);
    await auto.sleep(1000);
    
    // 测试完成
    console.log('\n所有测试已完成!');
    console.log('自动化模块测试成功。');
    
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

// 运行测试
console.log('自动化测试将在3秒后开始，请准备好...');
setTimeout(runTests, 3000); 