// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ReminderView } from './ReminderView'
import {Scheduler} from './Scheduler'
import { initStatusBar } from "./StatusBar"

initStatusBar();

export function activate(context: vscode.ExtensionContext) {
	const scheduler = new Scheduler(context);
    scheduler.start();
    context.subscriptions.push(vscode.commands.registerCommand('qilin.showReminderView', () => {
        ReminderView.show(context);
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {}
