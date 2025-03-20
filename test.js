const automate = require('./automate');
const automateLauncher = require('./automate-launcher');

async function main() {
  console.log('开始测试，测试过程中请不要操作鼠标和键盘');

  // 等待3秒
  await automate.sleep(3000);

  // 关闭窗口避免干扰
  automate.keyCombo(['CTRL', 'F4']);
  // 等待3秒
  await automate.sleep(3000);

  // 打开chrome浏览器
  automateLauncher.launchBrowser('https://www.google.com', 'chrome');


  // 等待3秒
  await automate.sleep(3000);



}

main();
