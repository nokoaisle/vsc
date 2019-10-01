'use strict';
import * as vscode from 'vscode';
import { Util, Extension } from './nekoaisle.lib/nekoaisle';

/**
 * エクステンション活性化
 * @param context 
 */
export function activate(context: vscode.ExtensionContext) {
    let ext = new MyExtension(context);
}

/**
 * 非活性化
 */
export function deactivate() {
}

interface ListItem {
    method?: string;
    path?: string;
    options?: object;
    link?: string;
}

/**
 * エクステンション本体
 */
class MyExtension extends Extension {
	/**
	 * 構築
	 */
    constructor(context: vscode.ExtensionContext) {
        super(context, {
            name: 'カーソル位置の単語でマニュアルなどを開く',
            config: 'openHelp',		// 通常はコマンドのサフィックス
            commands: [
                {
                    command: 'nekoaisle.openHelp',	// コマンド
                    callback: () => {
                        this.exec()
                    }
                }
            ]
        });
    }

	/**
	 * エントリー
	 */
    public exec() {
        //
        let editor = vscode.window.activeTextEditor;
        
        // カーソル位置の単語を取得
        let word = Util.getCursorWord(editor);
        
        // デフォルトのリストファイル名
        let listFN = this.joinExtensionRoot("openHelp.json");
        
        // settings.json よりテンプレートディレクトリを取得
        listFN = this.getConfig("list-file", listFN);

        // 設定ファイルの読み込み
		let source: string = Util.loadFile(listFN);

        // 読み込んだファイル中の {{word}} をカーソル位置の単語に置換
        source = source.replace(/{{word}}/g, word);

        // json に変換
        let list: ListItem[] = Util.decodeJson(source);
        
        // 設定ファイルの読み込み
        // 継承を解決
        for (let key in list) {
            if (list['inherit']) {
                // このアイテムは継承が指定されている
                let link = list['inherit'];
                // このオブジェクトで定義されていない要素は継承元から取得
                for (let key in link) {
                    if (typeof list[key] == "undefined") {
                        // このオブジェクトでは指定されていない
                        list[key] = link[key];
                    }
                }
            }
        }

        let addr: string;
        let query: object;
        let lang: string;
        if (list[editor.document.languageId]) {
            lang = editor.document.languageId;
        } else {
            lang = "default";
        }
        let item: ListItem = list[lang];
        switch (item.method) {
            case 'chrome': {
                Util.browsURL(item.path, item.options);
                break;
            }
            default: {
                break;
            }
        }
    }
}