import * as vscode from 'vscode'
let statusBar: vscode.StatusBarItem | null = null;

export function initStatusBar() {
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0)
    statusBar.command = 'qilin.showReminderView'
    statusBar.text = '召唤郭麒麟!'
    statusBar.tooltip = '召唤郭麒麟!'
    statusBar.show()
}
export function getStatusBar(): vscode.StatusBarItem {
    if (!statusBar) {
        throw new Error("")
    }
    return statusBar;
}