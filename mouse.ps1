param(
  [string]$action,
  [int]$x = 0,
  [int]$y = 0,
  [string]$button = "left",
  [int]$count = 1,
  [string]$method = "native",
  [int]$endX = 0,
  [int]$endY = 0,
  [int]$duration = 500,
  [int]$amount = 0
)

Add-Type -AssemblyName System.Windows.Forms

# 鼠标事件常量
$MOUSEEVENTF_LEFTDOWN = 0x0002
$MOUSEEVENTF_LEFTUP = 0x0004
$MOUSEEVENTF_RIGHTDOWN = 0x0008
$MOUSEEVENTF_RIGHTUP = 0x0010
$MOUSEEVENTF_MIDDLEDOWN = 0x0020
$MOUSEEVENTF_MIDDLEUP = 0x0040
$MOUSEEVENTF_WHEEL = 0x0800
$WHEEL_DELTA = 120

# 加载用户32.dll
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public class MouseOperations {
    [DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
    public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint cButtons, uint dwExtraInfo);
    
    [DllImport("user32.dll")]
    public static extern bool SetCursorPos(int x, int y);
    
    [DllImport("user32.dll")]
    public static extern bool GetCursorPos(out POINT lpPoint);
    
    [StructLayout(LayoutKind.Sequential)]
    public struct POINT {
        public int X;
        public int Y;
    }
}
"@ -Language CSharp

# 获取屏幕尺寸
function Get-ScreenSize {
  $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
  Write-Host "屏幕尺寸: $($screen.Width) x $($screen.Height)"
  return $screen
}

# 获取鼠标位置
function Get-MousePosition {
  $position = New-Object MouseOperations+POINT
  [MouseOperations]::GetCursorPos([ref]$position)
  Write-Host "鼠标位置: X=$($position.X), Y=$($position.Y)"
  return $position
}

# 设置鼠标位置
function Set-MousePosition {
  param(
    [int]$x,
    [int]$y
  )
  
  try {
    [MouseOperations]::SetCursorPos($x, $y)
    Write-Host "鼠标位置设置成功: X=$x, Y=$y"
    return $true
  } catch {
    Write-Host "设置鼠标位置失败: $_"
    return $false
  }
}

# NirCmd工具相关函数
function Get-NirCmd {
  # NirCmd路径
  $nircmdDir = Join-Path $env:TEMP "nircmd"
  $nircmdPath = Join-Path $nircmdDir "nircmd.exe"
  $nircmd64Path = Join-Path $nircmdDir "nircmd64.exe"
  
  # 检查NirCmd是否已存在
  if (-not ((Test-Path $nircmdPath) -or (Test-Path $nircmd64Path))) {
    # 创建临时目录
    if (-not (Test-Path $nircmdDir)) {
      New-Item -Path $nircmdDir -ItemType Directory -Force | Out-Null
    }
    
    # 下载NirCmd
    Write-Host "下载NirCmd工具..."
    $url = "https://www.nirsoft.net/utils/nircmd.zip"
    $zipPath = Join-Path $env:TEMP "nircmd.zip"
    
    try {
      # 使用.NET下载文件
      $webClient = New-Object System.Net.WebClient
      $webClient.DownloadFile($url, $zipPath)
    } catch {
      Write-Host "使用WebClient下载失败: $_"
      return $null
    }
    
    # 检查下载是否成功
    if (-not (Test-Path $zipPath)) {
      Write-Host "下载NirCmd失败，文件不存在"
      return $null
    }
    
    try {
      # 解压缩文件
      Write-Host "解压NirCmd..."
      Add-Type -AssemblyName System.IO.Compression.FileSystem
      [System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $nircmdDir)
      
      # 清理
      Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
    } catch {
      Write-Host "解压NirCmd失败: $_"
      return $null
    }
  }
  
  # 返回适当的可执行文件路径
  if (Test-Path $nircmd64Path) {
    return $nircmd64Path
  } elseif (Test-Path $nircmdPath) {
    return $nircmdPath
  } else {
    Write-Host "未找到NirCmd工具"
    return $null
  }
}

# 使用NirCmd执行点击
function Invoke-NirCmd {
  param(
    [string]$button = "left",
    [int]$count = 1,
    [int]$x = 0,
    [int]$y = 0
  )
  
  try {
    $nircmdPath = Get-NirCmd
    if (-not $nircmdPath) {
      Write-Host "NirCmd不可用，使用原生点击方法"
      return $false
    }
    
    # 将按钮类型转换为NirCmd命令
    $buttonType = switch ($button) {
      "left" { "left" }
      "right" { "right" }
      "middle" { "middle" }
      default { "left" }
    }
    
    # 如果坐标未提供，使用当前鼠标位置
    if ($x -eq 0 -and $y -eq 0) {
      $position = Get-MousePosition
      $x = $position.X
      $y = $position.Y
    }
    
    # 执行点击
    Write-Host "NirCmd执行: sendmouse $buttonType click $x $y"
    & $nircmdPath sendmouse $buttonType click $x $y
    
    # 如果是双击
    if ($count -gt 1 -and $buttonType -eq "left") {
      Start-Sleep -Milliseconds 100
      & $nircmdPath sendmouse $buttonType dblclick $x $y
    }
    
    Write-Host "NirCmd点击执行成功"
    return $true
  } catch {
    Write-Host "NirCmd执行失败: $_"
    return $false
  }
}

# 执行鼠标点击
function Invoke-MouseClick {
  param(
    [string]$button = "left",
    [int]$count = 1,
    [string]$method = "native"
  )
  
  Write-Host "执行鼠标点击: $button, 次数=$count, 方法=$method"
  
  # 如果指定了使用NirCmd
  if ($method -eq "nircmd") {
    $position = Get-MousePosition
    $result = Invoke-NirCmd -button $button -count $count -x $position.X -y $position.Y
    if ($result -eq $true) {
      Write-Host "NirCmd方法点击成功"
      return $true
    }
    Write-Host "NirCmd方法失败，尝试原生方法..."
  }
  
  # 使用原生方法
  try {
    for ($i = 0; $i -lt $count; $i++) {
      # 根据按钮类型选择事件标志
      $downFlag = 0
      $upFlag = 0
      
      switch ($button) {
        "left" {
          $downFlag = $MOUSEEVENTF_LEFTDOWN
          $upFlag = $MOUSEEVENTF_LEFTUP
        }
        "right" {
          $downFlag = $MOUSEEVENTF_RIGHTDOWN
          $upFlag = $MOUSEEVENTF_RIGHTUP
        }
        "middle" {
          $downFlag = $MOUSEEVENTF_MIDDLEDOWN
          $upFlag = $MOUSEEVENTF_MIDDLEUP
        }
        default {
          $downFlag = $MOUSEEVENTF_LEFTDOWN
          $upFlag = $MOUSEEVENTF_LEFTUP
        }
      }
      
      # 执行点击
      [MouseOperations]::mouse_event($downFlag, 0, 0, 0, 0)
      Start-Sleep -Milliseconds 50
      [MouseOperations]::mouse_event($upFlag, 0, 0, 0, 0)
      Start-Sleep -Milliseconds 50
    }
    
    Write-Host "鼠标点击成功"
    return $true
  } catch {
    Write-Host "鼠标点击失败: $_"
    return $false
  }
}

# 执行鼠标拖拽
function Invoke-MouseDrag {
  param(
    [int]$startX,
    [int]$startY,
    [int]$endX,
    [int]$endY,
    [int]$duration = 500
  )
  
  try {
    # 先移动到起始位置
    Set-MousePosition -x $startX -y $startY
    Start-Sleep -Milliseconds 100
    
    # 按下鼠标左键
    [MouseOperations]::mouse_event($MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
    Start-Sleep -Milliseconds 100
    
    # 逐步移动
    for ($i = 1; $i -le 10; $i++) {
      $progress = $i / 10
      $currentX = $startX + [int](($endX - $startX) * $progress)
      $currentY = $startY + [int](($endY - $startY) * $progress)
      Set-MousePosition -x $currentX -y $currentY
      Start-Sleep -Milliseconds ($duration / 10)
    }
    
    # 确保到达最终位置
    Set-MousePosition -x $endX -y $endY
    Start-Sleep -Milliseconds 100
    
    # 释放鼠标左键
    [MouseOperations]::mouse_event($MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
    
    Write-Host "鼠标拖拽成功"
    return $true
  } catch {
    Write-Host "鼠标拖拽失败: $_"
    # 确保释放鼠标左键，防止卡住
    [MouseOperations]::mouse_event($MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
    return $false
  }
}

# 执行鼠标滚轮
function Invoke-MouseScroll {
  param(
    [int]$amount
  )
  
  try {
    # 计算滚动量
    $scrollAmount = $amount * $WHEEL_DELTA
    
    # 执行滚轮操作
    [MouseOperations]::mouse_event($MOUSEEVENTF_WHEEL, 0, 0, [uint32]$scrollAmount, 0)
    
    Write-Host "鼠标滚动成功: $amount"
    return $true
  } catch {
    Write-Host "鼠标滚动失败: $_"
    return $false
  }
}

# 主逻辑
Write-Host "鼠标脚本开始执行..."

# 根据操作类型执行相应的函数
switch ($action) {
  "getScreenSize" { Get-ScreenSize }
  "getPosition" { Get-MousePosition }
  "setPosition" { Set-MousePosition -x $x -y $y }
  "click" { Invoke-MouseClick -button $button -count $count -method $method }
  "drag" { Invoke-MouseDrag -startX $x -startY $y -endX $endX -endY $endY -duration $duration }
  "scroll" { Invoke-MouseScroll -amount $amount }
  default { Write-Host "未知操作: $action" }
}

Write-Host "鼠标脚本执行完成" 