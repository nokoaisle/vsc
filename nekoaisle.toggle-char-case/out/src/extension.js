'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const nekoaisle_1 = require("./nekoaisle.lib/nekoaisle");
/**
 * エクステンション活性化
 * @param context
 */
function activate(context) {
    let ext = new MyExtention(context);
}
exports.activate = activate;
/**
 * 非活性化
 */
function deactivate() {
}
exports.deactivate = deactivate;
/**
 * エクステンション本体
 */
class MyExtention extends nekoaisle_1.Extension {
    /**
     * 構築
     */
    constructor(context) {
        super(context, {
            name: 'Toggle Char Case',
            commands: [
                {
                    command: 'nekoaisle.toggleCharCase',
                    callback: () => {
                        this.toggleCharCase();
                    }
                }, {
                    command: 'nekoaisle.toggleWordCase',
                    callback: () => {
                        this.toggleWordCase();
                    }
                }
            ]
        });
    }
    /**
     * カーソル位置または選択範囲の個々の文字のケースをトグル
     */
    toggleCharCase() {
        let editor = vscode.window.activeTextEditor;
        let doc = vscode.window.activeTextEditor.document;
        // 現在の選択範囲を取得
        let sel = editor.selection;
        let b = sel.start.isEqual(sel.end);
        if (sel.start.isEqual(sel.end)) {
            // 範囲選択されていないので１文字変換
            let cursor = sel.active;
            let c = nekoaisle_1.Util.getCharFromPos(editor, cursor);
            // 大文字小文字を変換
            c = nekoaisle_1.Util.toggleCharCase(c);
            // カーソル位置の文字範囲を作成
            let range = new vscode.Range(cursor, cursor.translate(0, 1));
            // 大文字・小文字変換した文字と置換
            editor.edit(edit => edit.replace(range, c));
            // カーソルを右に1文字移動
            vscode.commands.executeCommand('cursorRight');
        }
        else {
            // 範囲選択されているので一括変換
            let text = doc.getText(sel).split('');
            for (let i = 0; i < text.length; ++i) {
                text[i] = nekoaisle_1.Util.toggleCharCase(text[i]);
            }
            // 大文字・小文字変換した文字と置換
            editor.edit(edit => edit.replace(sel, text.join('')));
        }
    }
    /**
     * カーソル位置または選択範囲の文字のケースをトグル
     */
    toggleWordCase() {
        let editor = vscode.window.activeTextEditor;
        let doc = vscode.window.activeTextEditor.document;
        // 現在の選択範囲を取得
        let sel = editor.selection;
        let b = sel.start.isEqual(sel.end);
        let range;
        let text;
        if (sel.start.isEqual(sel.end)) {
            // 範囲選択されていないので単語変換
            range = nekoaisle_1.Util.getCursorWordRange(editor);
            // カーソル位置の単語を取得
            text = doc.getText(range);
        }
        else {
            // 範囲選択されているので一括変換
            range = new vscode.Range(sel.start, sel.end);
            // 全文字を先頭文字のケースの逆に設定
            text = doc.getText(sel);
        }
        if (/^[A-Z]+$/.test(text)) {
            // すべて大文字なので小文字に
            text = text.toLocaleLowerCase();
        }
        else if (/^[a-z]+$/.test(text)) {
            // すべて小文字なのでキャメルケースへ
            text = text.substr(0, 1).toLocaleUpperCase() + text.substr(1).toLocaleLowerCase();
        }
        else if (/^[A-Z][a-z]+$/.test(text)) {
            // キャメルケースなので大文字へ
            text = text.toLocaleUpperCase();
        }
        else {
            // 混ざっているので先頭文字の逆
            text = nekoaisle_1.Util.toggleCharCase(text);
        }
        // 大文字・小文字変換した文字と置換
        editor.edit(edit => edit.replace(range, text));
    }
}
//# sourceMappingURL=extension.js.map