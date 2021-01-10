import * as vscode from 'vscode';
import Asset from './Asset';
import { network } from "./network"

export class ReminderView {
    private static panel: vscode.WebviewPanel | undefined;

    public static async show(context: vscode.ExtensionContext, ) {
        const asset: Asset = new Asset(context);
        const imagePath = asset.getImageUri();
        const titleType = asset.getTitleType();
        const panelTitle = asset.getPanelTitle()
        if (titleType === "yiyan") {
            this.showPanel(imagePath, panelTitle, "")
            const resp = await network.mkRequest(["GET", "https://international.v1.hitokoto.cn?c=i&c=k"])
            const info: any = JSON.parse(resp.content)
            this.showPanel(imagePath, panelTitle, `
                <div><h1>${info.hitokoto ?? ""} </h1></div>
                <div><h3>◉　${info.from_who ?? "佚名"}  《${info.from}》</h3></div>
            `)
        } else {
            const title = asset.getTitle();
            this.showPanel(imagePath, panelTitle, `<div><h1>${title}</h1></div>`)
        }
        
    }

    private static showPanel(imagePath: string | vscode.Uri, panelTitle: string, title: string) {
        if (this.panel) {
            this.panel.webview.html = this.generateHtml(imagePath, title);
            this.panel.reveal();
        } else {
            this.panel = vscode.window.createWebviewPanel("qilin", panelTitle, vscode.ViewColumn.Two, {
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
            <title>大林子</title>
        </head>
        <body>
            ${title}
            <div><img src="${imagePath}" style="max-height: 600px;"></div>
        </body>
        </html>`;

        return html;
    }
}