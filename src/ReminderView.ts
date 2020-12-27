import * as vscode from 'vscode';
import Asset from './Asset';
import { network } from "./network"

export class ReminderView {
    private static panel: vscode.WebviewPanel | undefined;

    public static async show(context: vscode.ExtensionContext, ) {
        const asset: Asset = new Asset(context);
        const imagePath = asset.getImageUri();
        const titleType = asset.getTitleType();
        if (titleType === "yiyan") {
            this.showPanel(imagePath, "")
            const resp = await network.mkRequest(["GET", "https://international.v1.hitokoto.cn"])
            const info: any = JSON.parse(resp.content)
            this.showPanel(imagePath, info.hitokoto)
        } else {
            const title = asset.getTitle();
            this.showPanel(imagePath, title)
        }
        
    }

    private static showPanel(imagePath: string | vscode.Uri, title: string) {
        if (this.panel) {
            this.panel.webview.html = this.generateHtml(imagePath, title);
            this.panel.reveal();
        } else {
            this.panel = vscode.window.createWebviewPanel("qilin", "郭麒麟", vscode.ViewColumn.Two, {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
            this.panel.webview.html = this.generateHtml(imagePath, title);
            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });
        }
    }

    protected static generateHtml(imagePath: vscode.Uri|string, title: string): string {
        let html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>杨超越</title>
        </head>
        <body>
            <div><h1>${title}</h1></div>
            <div><img src="${imagePath}"></div>
        </body>
        </html>`;

        return html;
    }
}