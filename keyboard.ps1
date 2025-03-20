param(
  [int[]]$keys,
  [string]$typeText
)

Add-Type -AssemblyName System.Windows.Forms

# 使用keybd_event发送键盘按键
function Send-Keys {
  param([int[]]$keyCodes)
  
  Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public class KeyboardInput {
    [DllImport("user32.dll")]
    public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);
    
    public const int KEYEVENTF_KEYDOWN = 0x0000;
    public const int KEYEVENTF_KEYUP = 0x0002;
    
    public static void SendKeyStrokes(int[] keys) {
        if (keys == null || keys.Length == 0) {
            Console.WriteLine("No key codes provided");
            return;
        }
        
        try {
            // 按下所有键
            foreach (int key in keys) {
                keybd_event((byte)key, 0, KEYEVENTF_KEYDOWN, UIntPtr.Zero);
                System.Threading.Thread.Sleep(50);
            }
            
            // 延迟
            System.Threading.Thread.Sleep(50);
            
            // 按照相反顺序释放所有键
            for (int i = keys.Length - 1; i >= 0; i--) {
                keybd_event((byte)keys[i], 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                System.Threading.Thread.Sleep(50);
            }
            
            Console.WriteLine("Keys sent: " + String.Join(",", keys));
        }
        catch (Exception ex) {
            Console.WriteLine("Error sending keys: " + ex.Message);
        }
    }
}
"@ -Language CSharp

  # 发送按键
  try {
    [KeyboardInput]::SendKeyStrokes($keyCodes)
    Write-Host "键码发送成功: $keyCodes"
    return $true
  }
  catch {
    Write-Host "键码发送失败: $_"
    return $false
  }
}

# 使用传统方法发送文本
function Send-TextTraditional {
  param([string]$text)
  
  try {
    Write-Host "使用传统方法发送文本..."
    $wshell = New-Object -ComObject wscript.shell
    $wshell.SendKeys($text)
    Write-Host "文本发送成功"
    return $true
  }
  catch {
    Write-Host "传统方法发送文本失败: $_"
    return $false
  }
}

# 使用剪贴板输入文本
function Send-Text {
  param([string]$text)
  
  try {
    # 保存原始剪贴板内容
    $originalClipboard = Get-Clipboard -ErrorAction SilentlyContinue
    
    # 设置新的剪贴板内容
    Set-Clipboard -Value $text -ErrorAction Stop
    Start-Sleep -Milliseconds 100
    
    # 发送Ctrl+V
    Send-Keys -keyCodes @(0x11, 0x56) # CTRL+V
    Start-Sleep -Milliseconds 200
    
    # 恢复原始剪贴板
    if ($originalClipboard) {
      Set-Clipboard -Value $originalClipboard -ErrorAction SilentlyContinue
    }
    
    Write-Host "文本通过剪贴板输入成功"
    return $true
  }
  catch {
    Write-Host "通过剪贴板输入文本失败: $_"
    
    # 尝试传统方法
    Write-Host "尝试使用传统方法..."
    return Send-TextTraditional -text $text
  }
}

# 主逻辑
Write-Host "键盘脚本开始执行..."

if ($keys -and $keys.Count -gt 0) {
  Write-Host "检测到键码参数: $keys"
  Send-Keys -keyCodes $keys
}
elseif ($typeText) {
  Write-Host "检测到文本参数: $typeText"
  Send-Text -text $typeText
}
else {
  Write-Host "未指定参数。请使用 -keys 或 -typeText 参数。"
}

Write-Host "键盘脚本执行完成" 