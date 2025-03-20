/**
 * @file 应用程序启动器模块
 * @description 提供启动各种Windows应用程序的功能，包括浏览器、记事本等常用软件
 * @module automate-launcher
 * @author Windows自动化工具团队
 * @version 1.0.0
 */

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

/**
 * @constant {Object} APP_PATHS - 常用应用程序路径映射
 * @description 定义常用应用程序的默认安装路径
 * @private
 */
const APP_PATHS = {
  // 系统自带程序
  notepad: 'C:\\Windows\\System32\\notepad.exe',
  calc: 'C:\\Windows\\System32\\calc.exe',
  paint: 'C:\\Windows\\System32\\mspaint.exe',
  wordpad: 'C:\\Windows\\System32\\write.exe',
  cmd: 'C:\\Windows\\System32\\cmd.exe',
  powershell: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
  
  // 常用浏览器
  chrome: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Google\\Chrome Dev\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(os.homedir(), 'AppData\\Local\\Google\\Chrome\\Application\\chrome.exe')
  ],
  firefox: [
    'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
    'C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe',
    path.join(os.homedir(), 'AppData\\Local\\Mozilla Firefox\\firefox.exe')
  ],
  edge: [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    path.join(os.homedir(), 'AppData\\Local\\Microsoft\\Edge\\Application\\msedge.exe')
  ],
  
  // 常用办公软件
  word: [
    'C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE',
    'C:\\Program Files\\Microsoft Office\\Office16\\WINWORD.EXE',
    'C:\\Program Files (x86)\\Microsoft Office\\Office16\\WINWORD.EXE',
    'C:\\Program Files\\Microsoft Office\\Office15\\WINWORD.EXE',
    'C:\\Program Files (x86)\\Microsoft Office\\Office15\\WINWORD.EXE'
  ],
  excel: [
    'C:\\Program Files\\Microsoft Office\\root\\Office16\\EXCEL.EXE',
    'C:\\Program Files\\Microsoft Office\\Office16\\EXCEL.EXE',
    'C:\\Program Files (x86)\\Microsoft Office\\Office16\\EXCEL.EXE',
    'C:\\Program Files\\Microsoft Office\\Office15\\EXCEL.EXE',
    'C:\\Program Files (x86)\\Microsoft Office\\Office15\\EXCEL.EXE'
  ],
  powerpoint: [
    'C:\\Program Files\\Microsoft Office\\root\\Office16\\POWERPNT.EXE',
    'C:\\Program Files\\Microsoft Office\\Office16\\POWERPNT.EXE',
    'C:\\Program Files (x86)\\Microsoft Office\\Office16\\POWERPNT.EXE',
    'C:\\Program Files\\Microsoft Office\\Office15\\POWERPNT.EXE',
    'C:\\Program Files (x86)\\Microsoft Office\\Office15\\POWERPNT.EXE'
  ],
  
  // 其他常用软件
  vscode: [
    'C:\\Program Files\\Microsoft VS Code\\Code.exe',
    'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',
    path.join(os.homedir(), 'AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe')
  ],
  wechat: [
    'C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe',
    path.join(os.homedir(), 'AppData\\Local\\Tencent\\WeChat\\WeChat.exe')
  ],
  qq: [
    'C:\\Program Files (x86)\\Tencent\\QQ\\Bin\\QQ.exe',
    path.join(os.homedir(), 'AppData\\Local\\Tencent\\QQ\\Bin\\QQ.exe')
  ]
};

/**
 * @function findAppPath
 * @description 查找应用程序的实际安装路径
 * @param {string|Array<string>} paths - 可能的应用程序路径
 * @returns {string|null} 找到的应用程序路径，如果未找到则返回null
 * @private
 */
function findAppPath(paths) {
  if (typeof paths === 'string') {
    return fs.existsSync(paths) ? paths : null;
  }
  
  for (const path of paths) {
    if (fs.existsSync(path)) {
      return path;
    }
  }
  return null;
}

/**
 * @function launchApp
 * @description 启动指定的应用程序
 * @param {string} appName - 应用程序名称（如'chrome', 'notepad'等）
 * @param {string} [args] - 启动参数
 * @param {Object} [options] - 启动选项
 * @param {boolean} [options.wait=false] - 是否等待程序启动完成
 * @param {boolean} [options.hidden=false] - 是否以隐藏方式启动
 * @returns {boolean} 是否成功启动应用程序
 * @example
 * // 启动记事本
 * launchApp('notepad');
 * // 启动Chrome并打开指定网页
 * launchApp('chrome', 'https://www.example.com');
 * // 以隐藏方式启动计算器
 * launchApp('calc', null, { hidden: true });
 */
function launchApp(appName, args = '', options = {}) {
  const { wait = false, hidden = false } = options;
  
  try {
    // 获取应用程序路径
    const appPath = findAppPath(APP_PATHS[appName.toLowerCase()]);
    if (!appPath) {
      console.log(`未找到应用程序: ${appName}`);
      return false;
    }
    
    // 构建启动命令
    let command = `"${appPath}"`;
    if (args) {
      command += ` ${args}`;
    }
    
    // 添加启动选项
    if (hidden) {
      command = `start /min ${command}`;
    }
    
    console.log(`正在启动: ${appName}`);
    
    // 执行启动命令
    if (wait) {
      execSync(command, { stdio: 'ignore' });
    } else {
      execSync(command, { stdio: 'ignore', detached: true });
    }
    
    return true;
  } catch (error) {
    console.log(`启动失败: ${appName}`, error);
    return false;
  }
}

/**
 * @function launchBrowser
 * @description 启动默认浏览器并打开指定URL
 * @param {string} url - 要打开的URL
 * @param {string} [browser='chrome'] - 浏览器类型（'chrome', 'firefox', 'edge'）
 * @returns {boolean} 是否成功启动浏览器
 * @example
 * // 使用默认浏览器打开网页
 * launchBrowser('https://www.example.com');
 * // 使用Firefox打开网页
 * launchBrowser('https://www.example.com', 'firefox');
 */
function launchBrowser(url, browser = 'chrome') {
  return launchApp(browser, url);
}

/**
 * @function launchOfficeApp
 * @description 启动Office应用程序
 * @param {string} appName - Office应用名称（'word', 'excel', 'powerpoint'）
 * @param {string} [filePath] - 要打开的文件路径
 * @returns {boolean} 是否成功启动Office应用
 * @example
 * // 启动Word
 * launchOfficeApp('word');
 * // 启动Excel并打开文件
 * launchOfficeApp('excel', 'C:\\Documents\\example.xlsx');
 */
function launchOfficeApp(appName, filePath = '') {
  return launchApp(appName, filePath);
}

/**
 * @function launchSystemApp
 * @description 启动系统自带应用程序
 * @param {string} appName - 系统应用名称（'notepad', 'calc', 'paint'等）
 * @param {string} [filePath] - 要打开的文件路径
 * @returns {boolean} 是否成功启动系统应用
 * @example
 * // 启动记事本
 * launchSystemApp('notepad');
 * // 启动计算器
 * launchSystemApp('calc');
 */
function launchSystemApp(appName, filePath = '') {
  return launchApp(appName, filePath);
}

/**
 * @exports
 * @description 导出所有启动器相关的函数
 */
module.exports = {
  launchApp,
  launchBrowser,
  launchOfficeApp,
  launchSystemApp,
  APP_PATHS
}; 