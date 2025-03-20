/**
 * 键盘操作模块
 * 提供键盘按键、组合键和文本输入功能
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 脚本路径
const scriptPath = path.resolve(__dirname, 'keyboard.ps1');

// 定义虚拟键码
const VK_KEYS = {
  BACKSPACE: 0x08,
  TAB: 0x09,
  ENTER: 0x0D,
  SHIFT: 0x10,
  CTRL: 0x11,
  ALT: 0x12,
  PAUSE: 0x13,
  CAPS_LOCK: 0x14,
  ESCAPE: 0x1B,
  SPACE: 0x20,
  PAGE_UP: 0x21,
  PAGE_DOWN: 0x22,
  END: 0x23,
  HOME: 0x24,
  LEFT: 0x25,
  UP: 0x26,
  RIGHT: 0x27,
  DOWN: 0x28,
  PRINT_SCREEN: 0x2C,
  INSERT: 0x2D,
  DELETE: 0x2E,
  KEY_0: 0x30,
  KEY_1: 0x31,
  KEY_2: 0x32,
  KEY_3: 0x33,
  KEY_4: 0x34,
  KEY_5: 0x35,
  KEY_6: 0x36,
  KEY_7: 0x37,
  KEY_8: 0x38,
  KEY_9: 0x39,
  KEY_A: 0x41,
  KEY_B: 0x42,
  KEY_C: 0x43,
  KEY_D: 0x44,
  KEY_E: 0x45,
  KEY_F: 0x46,
  KEY_G: 0x47,
  KEY_H: 0x48,
  KEY_I: 0x49,
  KEY_J: 0x4A,
  KEY_K: 0x4B,
  KEY_L: 0x4C,
  KEY_M: 0x4D,
  KEY_N: 0x4E,
  KEY_O: 0x4F,
  KEY_P: 0x50,
  KEY_Q: 0x51,
  KEY_R: 0x52,
  KEY_S: 0x53,
  KEY_T: 0x54,
  KEY_U: 0x55,
  KEY_V: 0x56,
  KEY_W: 0x57,
  KEY_X: 0x58,
  KEY_Y: 0x59,
  KEY_Z: 0x5A,
  F1: 0x70,
  F2: 0x71,
  F3: 0x72,
  F4: 0x73,
  F5: 0x74,
  F6: 0x75,
  F7: 0x76,
  F8: 0x77,
  F9: 0x78,
  F10: 0x79,
  F11: 0x7A,
  F12: 0x7B
};

/**
 * 直接使用PowerShell脚本发送虚拟键码
 * @param {Array|number} keyCodes - 虚拟键码或键码数组
 * @returns {boolean} 是否成功
 */
function sendVirtualKeys(keyCodes) {
  if (!Array.isArray(keyCodes)) {
    keyCodes = [keyCodes];
  }
  
  const keyCodesStr = keyCodes.join(',');
  const command = `powershell -ExecutionPolicy Bypass -File "${scriptPath}" -keys ${keyCodesStr}`;
  
  console.log('发送虚拟键码:', keyCodes.map(k => getKeyName(k)).join(', '));
  try {
    const output = execSync(command, { encoding: 'utf-8' });
    console.log('PowerShell输出:', output.split('\n').filter(Boolean).pop());
    return true;
  } catch (error) {
    console.error('发送虚拟键码失败:', error.message);
    return false;
  }
}

/**
 * 发送组合键
 * @param {Array} keyCodes - 虚拟键码数组
 * @returns {boolean} 是否成功
 */
function sendKeyCombination(keyCodes) {
  return sendVirtualKeys(keyCodes);
}

/**
 * 基于名称发送组合键
 * @param {string} combo - 组合键名称，如'ctrl+a'
 * @returns {boolean} 是否成功
 */
function sendNamedCombination(combo) {
  const keys = [];
  
  switch (combo.toLowerCase()) {
    case 'ctrl+s':
      keys.push(VK_KEYS.CTRL, VK_KEYS.KEY_S);
      break;
    case 'ctrl+a':
      keys.push(VK_KEYS.CTRL, VK_KEYS.KEY_A);
      break;
    case 'ctrl+c':
      keys.push(VK_KEYS.CTRL, VK_KEYS.KEY_C);
      break;
    case 'ctrl+v':
      keys.push(VK_KEYS.CTRL, VK_KEYS.KEY_V);
      break;
    case 'ctrl+x':
      keys.push(VK_KEYS.CTRL, VK_KEYS.KEY_X);
      break;
    case 'ctrl+z':
      keys.push(VK_KEYS.CTRL, VK_KEYS.KEY_Z);
      break;
    case 'alt+f4':
      keys.push(VK_KEYS.ALT, VK_KEYS.F4);
      break;
    case 'ctrl+space':
      keys.push(VK_KEYS.CTRL, VK_KEYS.SPACE);
      break;
    default:
      console.error('未知的组合键:', combo);
      return false;
  }
  
  return sendVirtualKeys(keys);
}

/**
 * 发送单个按键
 * @param {number} keyCode - 虚拟键码
 * @returns {boolean} 是否成功
 */
function sendKey(keyCode) {
  return sendVirtualKeys([keyCode]);
}

/**
 * 输入文本
 * @param {string} text - 要输入的文本
 * @returns {boolean} 是否成功
 */
function typeText(text) {
  // 转义文本中的双引号
  const escapedText = text.replace(/"/g, '`"');
  const command = `powershell -ExecutionPolicy Bypass -File "${scriptPath}" -typeText "${escapedText}"`;
  
  console.log('输入文本');
  try {
    const output = execSync(command, { encoding: 'utf-8' });
    console.log('PowerShell输出:', output.split('\n').filter(Boolean).pop());
    return true;
  } catch (error) {
    console.error('输入文本失败:', error.message);
    return false;
  }
}

/**
 * 获取虚拟键码的名称，用于日志
 * @param {number} keyCode - 虚拟键码
 * @returns {string} 键码名称
 */
function getKeyName(keyCode) {
  for (const [key, value] of Object.entries(VK_KEYS)) {
    if (value === keyCode) return key;
  }
  return `UNKNOWN(${keyCode})`;
}

/**
 * 延迟函数
 * @param {number} ms - 毫秒数
 * @returns {Promise} Promise对象
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 导出模块
module.exports = {
  VK_KEYS,
  sendVirtualKeys,
  sendKeyCombination,
  sendNamedCombination,
  sendKey,
  typeText,
  sleep,
  getKeyName
}; 