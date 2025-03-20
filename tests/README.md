# 测试脚本

本目录包含各种测试脚本，用于验证自动化工具的功能。

## 核心测试脚本

- `test-automation.js` - 全面的自动化功能测试（综合测试所有功能）
- `test-mouse.js` - 鼠标操作功能测试（移动、点击、拖拽等）
- `test-keyboard.js` - 键盘操作功能测试（按键、组合键等）
- `test-clipboard.js` - 剪贴板操作测试（复制、粘贴、获取内容）
- `test-function-keys.js` - 功能键(F1-F12)测试，特别适用于笔记本电脑
- `test-chinese-dedicated.js` - 专用中文输入函数测试（需要打开记事本）

## 运行测试

在项目根目录下运行以下命令执行测试：

```bash
npm run test:all             # 运行全面的自动化测试
npm run test:mouse           # 测试鼠标功能
npm run test:keyboard        # 测试键盘功能
npm run test:clipboard       # 测试剪贴板功能
npm run test:function-keys   # 测试功能键(F1-F12)支持
npm run test:chinese-dedicated # 测试专用中文输入函数
```

或者直接使用Node.js运行：

```bash
node tests/test-automation.js       # 全面测试
node tests/test-mouse.js            # 鼠标功能测试
node tests/test-keyboard.js         # 键盘功能测试
node tests/test-clipboard.js        # 剪贴板功能测试
node tests/test-function-keys.js    # 功能键测试
node tests/test-chinese-dedicated.js # 中文输入测试
```

## 注意事项

1. 运行测试前请确保已安装所有依赖
2. 鼠标测试会移动鼠标并执行点击操作，请确保不会干扰当前工作
3. 键盘测试会模拟按键输入，请在适当的环境中运行
4. 部分测试需要用户交互，请按照提示操作 