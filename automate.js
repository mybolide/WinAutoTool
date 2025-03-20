/**
 * @file Windows自动化工具主模块
 * @description 提供鼠标和键盘模拟功能，支持中英文输入、剪贴板操作等
 * @module automate
 * @author Windows自动化工具团队
 * @version 1.0.0
 */

// 导入模块
const mouseModule = require('./automate-mouse');
const keyboardNircmd = require('./automate-keyboard-nircmd');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// 鼠标操作方法
let mouseMethod = 'nircmd'; // 'native' 或 'nircmd'

// 键盘操作方法
let keyboardMethod = 'nircmd'; // 'native' 或 'nircmd'

/**
 * @function sleep
 * @description 延迟执行
 * @param {number} ms - 延迟的毫秒数
 * @returns {Promise} 返回Promise，延迟指定时间后resolve
 * @example
 * // 延迟1秒
 * await auto.sleep(1000);
 */
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// ==================== 鼠标操作函数 ====================

/**
 * @function getMousePosition
 * @description 获取鼠标当前位置
 * @returns {Object} 返回包含x和y坐标的对象
 * @example
 * // 获取鼠标当前位置
 * const position = auto.getMousePosition();
 * console.log(`鼠标位置: x=${position.x}, y=${position.y}`);
 */
function getMousePosition() {
  return mouseModule.getMousePosition();
}

/**
 * @function setMousePosition
 * @description 设置鼠标位置（移动鼠标）
 * @param {number} x - 横坐标
 * @param {number} y - 纵坐标
 * @returns {boolean} 是否成功
 * @example
 * // 将鼠标移动到坐标(100, 200)
 * auto.setMousePosition(100, 200);
 */
function setMousePosition(x, y) {
  return mouseModule.setMousePosition(x, y);
}

/**
 * @function mouseClick
 * @description 在当前位置执行鼠标点击
 * @param {string} [button='left'] - 按钮类型：'left'（左键）, 'right'（右键）, 'middle'（中键）
 * @param {number} [count=1] - 点击次数
 * @returns {boolean} 是否成功
 * @example
 * // 左键单击
 * auto.mouseClick();
 * // 右键单击
 * auto.mouseClick('right');
 * // 左键双击
 * auto.mouseClick('left', 2);
 */
function mouseClick(button = 'left', count = 1) {
  return mouseModule.mouseClick(button, count);
}

/**
 * @function mouseRightClick
 * @description 在当前位置执行鼠标右键点击
 * @returns {boolean} 是否成功
 * @example
 * // 右键点击
 * auto.mouseRightClick();
 */
function mouseRightClick() {
  return mouseModule.mouseClick('right');
}

/**
 * @function mouseDoubleClick
 * @description 在当前位置执行鼠标双击
 * @param {string} [button='left'] - 按钮类型：'left'（左键）, 'right'（右键）, 'middle'（中键）
 * @returns {boolean} 是否成功
 * @example
 * // 左键双击
 * auto.mouseDoubleClick();
 * // 右键双击
 * auto.mouseDoubleClick('right');
 */
function mouseDoubleClick(button = 'left') {
  return mouseModule.mouseClick(button, 2);
}

/**
 * @function mouseDrag
 * @description 鼠标拖拽操作
 * @param {number} startX - 起始X坐标
 * @param {number} startY - 起始Y坐标
 * @param {number} endX - 结束X坐标
 * @param {number} endY - 结束Y坐标
 * @param {string} [button='left'] - 按钮类型：'left'（左键）, 'right'（右键）
 * @returns {boolean} 是否成功
 * @example
 * // 从(100,100)拖拽到(300,300)
 * auto.mouseDrag(100, 100, 300, 300);
 */
function mouseDrag(startX, startY, endX, endY, button = 'left') {
  return mouseModule.mouseDrag(startX, startY, endX, endY, button);
}

/**
 * @function mouseScroll
 * @description 鼠标滚轮滚动
 * @param {number} amount - 滚动量，正数向上滚动，负数向下滚动
 * @returns {boolean} 是否成功
 * @example
 * // 向上滚动5个单位
 * auto.mouseScroll(5);
 * // 向下滚动3个单位
 * auto.mouseScroll(-3);
 */
function mouseScroll(amount) {
  return mouseModule.mouseScroll(amount);
}

/**
 * @function setClickMethod
 * @description 设置鼠标点击操作的实现方式
 * @param {string} method - 'native'（原生方式）或 'nircmd'（使用NirCmd工具）
 * @returns {boolean} 是否设置成功
 * @example
 * // 使用原生方式实现鼠标操作
 * auto.setClickMethod('native');
 * // 使用NirCmd工具实现鼠标操作（推荐）
 * auto.setClickMethod('nircmd');
 */
function setClickMethod(method) {
  if (method !== 'native' && method !== 'nircmd') {
    console.error('无效的鼠标操作方法：' + method);
    return false;
  }
  mouseMethod = method;
  return true;
}

// ==================== 键盘操作函数 ====================

/**
 * @function keyPress
 * @description 按下并释放一个键
 * @param {string} key - 键名，如'KEY_A', 'ENTER'等
 * @returns {boolean} 是否成功
 * @example
 * // 按下A键
 * auto.keyPress('KEY_A');
 * // 按下Enter键
 * auto.keyPress('ENTER');
 */
function keyPress(key) {
  return keyboardNircmd.keyPress(key);
}

/**
 * @function keyDown
 * @description 按下一个键不释放
 * @param {string} key - 键名，如'KEY_A', 'CTRL'等
 * @returns {boolean} 是否成功
 * @example
 * // 按下Ctrl键不释放
 * auto.keyDown('CTRL');
 */
function keyDown(key) {
  return keyboardNircmd.keyDown(key);
}

/**
 * @function keyUp
 * @description 释放一个已按下的键
 * @param {string} key - 键名，如'KEY_A', 'CTRL'等
 * @returns {boolean} 是否成功
 * @example
 * // 释放之前按下的Ctrl键
 * auto.keyUp('CTRL');
 */
function keyUp(key) {
  return keyboardNircmd.keyUp(key);
}

/**
 * @function keyCombo
 * @description 发送组合键
 * @param {Array<string>} keys - 键名数组，如['CTRL', 'C']
 * @returns {boolean} 是否成功
 * @example
 * // 发送Ctrl+C组合键（复制）
 * auto.keyCombo(['CTRL', 'C']);
 * // 发送Alt+Tab组合键（切换窗口）
 * auto.keyCombo(['ALT', 'TAB']);
 */
function keyCombo(keys) {
  return keyboardNircmd.keyCombo(keys);
}

/**
 * @function typeText
 * @description 输入文本
 * @param {string} text - 要输入的文本
 * @returns {boolean} 是否成功
 * @example
 * // 输入英文文本
 * auto.typeText('Hello World');
 */
function typeText(text) {
  return keyboardNircmd.typeText(text);
}

/**
 * @function typeChineseText
 * @description 输入中文文本（专用中文输入函数，推荐用于中文输入）
 * @param {string} text - 要输入的中文文本
 * @returns {boolean} 是否成功
 * @example
 * // 输入中文文本
 * auto.typeChineseText('你好，世界！');
 */
function typeChineseText(text) {
  return keyboardNircmd.typeChineseText(text);
}

/**
 * @function setKeyboardMethod
 * @description 设置键盘操作的实现方式
 * @param {string} method - 'native'（原生方式）或 'nircmd'（使用NirCmd工具）
 * @returns {boolean} 是否设置成功
 * @example
 * // 使用原生方式实现键盘操作
 * auto.setKeyboardMethod('native');
 * // 使用NirCmd工具实现键盘操作（推荐）
 * auto.setKeyboardMethod('nircmd');
 */
function setKeyboardMethod(method) {
  if (method !== 'native' && method !== 'nircmd') {
    console.error('无效的键盘操作方法：' + method);
    return false;
  }
  keyboardMethod = method;
  return true;
}

// ==================== 剪贴板操作函数 ====================

/**
 * @function copyToClipboard
 * @description 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {boolean} 是否成功
 * @example
 * // 复制文本到剪贴板
 * auto.copyToClipboard('这是要复制的文本');
 */
function copyToClipboard(text) {
  return keyboardNircmd.copyToClipboard(text);
}

/**
 * @function getClipboardText
 * @description 获取剪贴板中的文本
 * @returns {string} 剪贴板中的文本
 * @example
 * // 获取剪贴板内容
 * const text = auto.getClipboardText();
 * console.log('剪贴板内容：', text);
 */
function getClipboardText() {
  return keyboardNircmd.getClipboardText();
}

/**
 * @function copySelection
 * @description 复制当前选中的内容
 * @returns {string} 复制的文本
 * @example
 * // 复制当前选中的内容
 * const selectedText = auto.copySelection();
 * console.log('选中的内容：', selectedText);
 */
function copySelection() {
  return keyboardNircmd.copySelection();
}

// ==================== 功能键操作函数 ====================

/**
 * @function pressFunctionKey
 * @description 按下功能键 (F1-F12)，特别处理笔记本电脑Fn键问题
 * @param {string} key - 功能键名称，如'F1', 'F2'等
 * @returns {boolean} 是否成功
 * @example
 * // 按下F1键
 * auto.pressFunctionKey('F1');
 * // 按下F5键刷新
 * auto.pressFunctionKey('F5');
 */
function pressFunctionKey(key) {
  if (!/^F([1-9]|1[0-2])$/i.test(key)) {
    console.error('无效的功能键：' + key);
    return false;
  }
  return keyboardNircmd.pressFunctionKey(key);
}

// 导出所有函数和常量
module.exports = {
  // 鼠标操作
  getMousePosition,
  setMousePosition,
  mouseClick,
  mouseRightClick,
  mouseDoubleClick,
  mouseDrag,
  mouseScroll,
  setClickMethod,
  
  // 键盘操作
  keyPress,
  keyDown,
  keyUp,
  keyCombo,
  typeText,
  typeChineseText,
  setKeyboardMethod,
  pressFunctionKey,
  
  // 剪贴板操作
  copyToClipboard,
  getClipboardText,
  copySelection,
  
  // 实用工具
  sleep,
  
  // 键盘按键映射表
  KEY_NAMES: keyboardNircmd.KEY_NAMES,
  SPECIAL_CHARS: keyboardNircmd.SPECIAL_CHARS
}; 