/**
 * @file 鼠标操作模块
 * @description 提供鼠标移动、点击、拖拽和滚轮操作的功能
 * @module automate-mouse
 * @author Windows自动化工具团队
 * @version 1.0.0
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// 模块全局变量
const MOUSE_PS1 = path.join(__dirname, 'mouse.ps1');
let clickMethod = 'nircmd'; // 'native' 或 'nircmd'

/**
 * 睡眠函数
 * @param {number} ms 毫秒
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @function getMousePosition
 * @description 获取鼠标当前位置
 * @returns {Object} 包含x和y坐标的对象，如{x: 100, y: 200}
 * @example
 * // 获取鼠标当前位置
 * const position = mouse.getMousePosition();
 * console.log(`鼠标位置: x=${position.x}, y=${position.y}`);
 */
function getMousePosition() {
  try {
    // 使用PowerShell脚本获取鼠标位置
    if (!fs.existsSync(MOUSE_PS1)) {
      console.error(`鼠标脚本不存在: ${MOUSE_PS1}`);
      return { x: 0, y: 0 };
    }
    
    const output = execSync(`powershell -File "${MOUSE_PS1}" -action getPosition`, { encoding: 'utf8' });
    const position = parseMousePosition(output);
    return position;
  } catch (error) {
    console.error('获取鼠标位置失败:', error.message);
    return { x: 0, y: 0 };
  }
}

/**
 * @function getScreenSize
 * @description 获取屏幕分辨率
 * @returns {Object} 包含宽度和高度的对象，如{width: 1920, height: 1080}
 * @example
 * // 获取屏幕分辨率
 * const screenSize = mouse.getScreenSize();
 * console.log(`屏幕分辨率: ${screenSize.width}x${screenSize.height}`);
 */
function getScreenSize() {
  try {
    // 使用PowerShell脚本获取屏幕尺寸
    if (!fs.existsSync(MOUSE_PS1)) {
      console.error(`鼠标脚本不存在: ${MOUSE_PS1}`);
      return { width: 1920, height: 1080 }; // 默认值
    }
    
    const output = execSync(`powershell -File "${MOUSE_PS1}" -action getScreenSize`, { encoding: 'utf8' });
    const size = parseScreenSize(output);
    return size;
  } catch (error) {
    console.error('获取屏幕尺寸失败:', error.message);
    return { width: 1920, height: 1080 }; // 默认值
  }
}

/**
 * @function setMousePosition
 * @description 设置鼠标位置（移动鼠标）
 * @param {number} x - 横坐标
 * @param {number} y - 纵坐标
 * @returns {boolean} 是否成功
 * @example
 * // 将鼠标移动到坐标(100, 200)
 * mouse.setMousePosition(100, 200);
 */
function setMousePosition(x, y) {
  try {
    if (isNaN(x) || isNaN(y)) {
      console.error('无效的鼠标坐标');
      return false;
    }
    
    // 使用PowerShell脚本设置鼠标位置
    if (!fs.existsSync(MOUSE_PS1)) {
      console.error(`鼠标脚本不存在: ${MOUSE_PS1}`);
      return false;
    }
    
    execSync(`powershell -File "${MOUSE_PS1}" -action setPosition -x ${x} -y ${y}`, { encoding: 'utf8' });
    return true;
  } catch (error) {
    console.error('设置鼠标位置失败:', error.message);
    return false;
  }
}

/**
 * @function mouseClick
 * @description 在当前位置执行鼠标点击
 * @param {string} [button='left'] - 按钮类型：'left'（左键）, 'right'（右键）, 'middle'（中键）
 * @param {number} [count=1] - 点击次数
 * @returns {boolean} 是否成功
 * @example
 * // 左键单击
 * mouse.mouseClick();
 * // 右键单击
 * mouse.mouseClick('right');
 * // 左键双击
 * mouse.mouseClick('left', 2);
 */
function mouseClick(button = 'left', count = 1) {
  try {
    if (!['left', 'right', 'middle'].includes(button)) {
      console.error('无效的鼠标按钮:', button);
      return false;
    }
    
    if (clickMethod === 'nircmd') {
      return mouseClickNirCmd(button, count);
    }
    
    // 使用PowerShell脚本
    if (!fs.existsSync(MOUSE_PS1)) {
      console.error(`鼠标脚本不存在: ${MOUSE_PS1}`);
      return false;
    }
    
    execSync(`powershell -File "${MOUSE_PS1}" -action click -button ${button} -count ${count}`, { encoding: 'utf8' });
    return true;
  } catch (error) {
    console.error('鼠标点击失败:', error.message);
    return false;
  }
}

/**
 * @function mouseDoubleClick
 * @description 在当前位置执行鼠标双击
 * @param {string} [button='left'] - 按钮类型：'left'（左键）, 'right'（右键）, 'middle'（中键）
 * @returns {boolean} 是否成功
 * @example
 * // 左键双击
 * mouse.mouseDoubleClick();
 * // 右键双击
 * mouse.mouseDoubleClick('right');
 */
function mouseDoubleClick(button = 'left') {
  return mouseClick(button, 2);
}

/**
 * @function mouseRightClick
 * @description 在当前位置执行鼠标右键点击
 * @returns {boolean} 是否成功
 * @example
 * // 右键点击
 * mouse.mouseRightClick();
 */
function mouseRightClick() {
  return mouseClick('right');
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
 * mouse.mouseDrag(100, 100, 300, 300);
 */
function mouseDrag(startX, startY, endX, endY, button = 'left') {
  try {
    if (isNaN(startX) || isNaN(startY) || isNaN(endX) || isNaN(endY)) {
      console.error('无效的鼠标坐标');
      return false;
    }
    
    if (!['left', 'right'].includes(button)) {
      console.error('无效的鼠标按钮:', button);
      return false;
    }
    
    // 使用PowerShell脚本执行拖拽
    if (!fs.existsSync(MOUSE_PS1)) {
      console.error(`鼠标脚本不存在: ${MOUSE_PS1}`);
      return false;
    }
    
    execSync(`powershell -File "${MOUSE_PS1}" -action drag -startX ${startX} -startY ${startY} -endX ${endX} -endY ${endY} -button ${button}`, { encoding: 'utf8' });
    return true;
  } catch (error) {
    console.error('鼠标拖拽失败:', error.message);
    return false;
  }
}

/**
 * @function mouseScroll
 * @description 鼠标滚轮滚动
 * @param {number} amount - 滚动量，正数向上滚动，负数向下滚动
 * @returns {boolean} 是否成功
 * @example
 * // 向上滚动5个单位
 * mouse.mouseScroll(5);
 * // 向下滚动3个单位
 * mouse.mouseScroll(-3);
 */
function mouseScroll(amount) {
  try {
    if (isNaN(amount)) {
      console.error('无效的滚动量');
      return false;
    }
    
    // 使用PowerShell脚本执行滚动
    if (!fs.existsSync(MOUSE_PS1)) {
      console.error(`鼠标脚本不存在: ${MOUSE_PS1}`);
      return false;
    }
    
    execSync(`powershell -File "${MOUSE_PS1}" -action scroll -amount ${amount}`, { encoding: 'utf8' });
    return true;
  } catch (error) {
    console.error('鼠标滚动失败:', error.message);
    return false;
  }
}

/**
 * @function setClickMethod
 * @description 设置鼠标点击操作的实现方式
 * @param {string} method - 'native'（原生方式）或 'nircmd'（使用NirCmd工具）
 * @returns {boolean} 是否设置成功
 * @example
 * // 使用原生方式实现鼠标操作
 * mouse.setClickMethod('native');
 * // 使用NirCmd工具实现鼠标操作（推荐）
 * mouse.setClickMethod('nircmd');
 */
function setClickMethod(method) {
  if (method !== 'native' && method !== 'nircmd') {
    console.error('无效的点击方法:', method);
    return false;
  }
  
  clickMethod = method;
  console.log(`点击方法已设置为: ${method}`);
  return true;
}

/**
 * @private
 * @function mouseClickNirCmd
 * @description 使用NirCmd工具执行鼠标点击（内部函数）
 * @param {string} button - 按钮类型：'left', 'right', 'middle'
 * @param {number} count - 点击次数
 * @returns {boolean} 是否成功
 */
function mouseClickNirCmd(button, count) {
  try {
    // 检查NirCmd是否存在
    const nircmdDir = path.join(os.homedir(), '.nircmd');
    const nircmdExe = path.join(nircmdDir, 'nircmd.exe');
    
    if (!fs.existsSync(nircmdExe)) {
      console.error(`NirCmd不存在: ${nircmdExe}`);
      return mouseClick(button, count); // 回退到原生方式
    }
    
    // 鼠标按钮映射
    const buttonMap = {
      'left': 'left',
      'right': 'right',
      'middle': 'middle'
    };
    
    // 执行NirCmd命令
    for (let i = 0; i < count; i++) {
      execSync(`"${nircmdExe}" sendmouse ${buttonMap[button]} click`, { encoding: 'utf8' });
      
      // 如果是双击或多次点击，需要适当延迟
      if (count > 1 && i < count - 1) {
        execSync('powershell -Command "Start-Sleep -Milliseconds 100"', { encoding: 'utf8' });
      }
    }
    
    return true;
  } catch (error) {
    console.error('使用NirCmd点击失败:', error.message);
    return mouseClick(button, count); // 回退到原生方式
  }
}

/**
 * @private
 * @function parseMousePosition
 * @description 解析从PowerShell脚本获取的鼠标位置输出（内部函数）
 * @param {string} output - PowerShell脚本输出
 * @returns {Object} 包含x和y坐标的对象
 */
function parseMousePosition(output) {
  try {
    const match = output.match(/X:\s*(\d+)\s*Y:\s*(\d+)/i);
    if (match && match.length >= 3) {
      return {
        x: parseInt(match[1], 10),
        y: parseInt(match[2], 10)
      };
    }
    
    // 尝试解析JSON格式
    if (output.trim().startsWith('{') && output.trim().endsWith('}')) {
      try {
        const position = JSON.parse(output);
        if (typeof position.x === 'number' && typeof position.y === 'number') {
          return position;
        }
      } catch (e) {
        // JSON解析失败，继续尝试其他格式
      }
    }
    
    // 尝试解析逗号分隔格式
    const parts = output.trim().split(',');
    if (parts.length === 2) {
      const x = parseInt(parts[0], 10);
      const y = parseInt(parts[1], 10);
      if (!isNaN(x) && !isNaN(y)) {
        return { x, y };
      }
    }
    
    console.error('无法解析鼠标位置:', output);
    return { x: 0, y: 0 };
  } catch (error) {
    console.error('解析鼠标位置时出错:', error.message);
    return { x: 0, y: 0 };
  }
}

/**
 * @private
 * @function parseScreenSize
 * @description 解析从PowerShell脚本获取的屏幕尺寸输出（内部函数）
 * @param {string} output - PowerShell脚本输出
 * @returns {Object} 包含宽度和高度的对象
 */
function parseScreenSize(output) {
  try {
    const match = output.match(/Width:\s*(\d+)\s*Height:\s*(\d+)/i);
    if (match && match.length >= 3) {
      return {
        width: parseInt(match[1], 10),
        height: parseInt(match[2], 10)
      };
    }
    
    // 尝试解析JSON格式
    if (output.trim().startsWith('{') && output.trim().endsWith('}')) {
      try {
        const size = JSON.parse(output);
        if (typeof size.width === 'number' && typeof size.height === 'number') {
          return size;
        }
      } catch (e) {
        // JSON解析失败，继续尝试其他格式
      }
    }
    
    // 尝试解析逗号分隔格式
    const parts = output.trim().split(',');
    if (parts.length === 2) {
      const width = parseInt(parts[0], 10);
      const height = parseInt(parts[1], 10);
      if (!isNaN(width) && !isNaN(height)) {
        return { width, height };
      }
    }
    
    console.error('无法解析屏幕尺寸:', output);
    return { width: 1920, height: 1080 }; // 默认值
  } catch (error) {
    console.error('解析屏幕尺寸时出错:', error.message);
    return { width: 1920, height: 1080 }; // 默认值
  }
}

// 导出函数
module.exports = {
  getMousePosition,
  setMousePosition,
  getScreenSize,
  mouseClick,
  mouseDoubleClick,
  mouseRightClick,
  mouseDrag,
  mouseScroll,
  sleep,
  setClickMethod
}; 