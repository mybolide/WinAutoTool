# clipboard.ps1 - 剪贴板操作工具
# 使用方法:
# 复制文本到剪贴板: clipboard.ps1 set "文本内容"
# 获取剪贴板内容: clipboard.ps1 get

param (
    [Parameter(Position=0, Mandatory=$true)]
    [string]$action,
    
    [Parameter(Position=1, Mandatory=$false)]
    [string]$text
)

# 加载Windows Forms程序集
Add-Type -AssemblyName System.Windows.Forms

# 根据操作类型执行相应功能
switch ($action.ToLower()) {
    "set" {
        if ([string]::IsNullOrEmpty($text)) {
            Write-Error "没有提供要复制的文本"
            exit 1
        }
        
        try {
            [System.Windows.Forms.Clipboard]::SetText($text)
            Write-Output "成功: 文本已复制到剪贴板"
            exit 0
        } catch {
            Write-Error "复制文本到剪贴板时出错: $_"
            exit 1
        }
    }
    
    "get" {
        try {
            if ([System.Windows.Forms.Clipboard]::ContainsText()) {
                $clipboardText = [System.Windows.Forms.Clipboard]::GetText()
                # 输出内容到标准输出
                Write-Output $clipboardText
                exit 0
            } else {
                Write-Error "剪贴板中没有文本内容"
                exit 1
            }
        } catch {
            Write-Error "获取剪贴板内容时出错: $_"
            exit 1
        }
    }
    
    default {
        Write-Error "不支持的操作: $action。请使用 'set' 或 'get'。"
        exit 1
    }
} 