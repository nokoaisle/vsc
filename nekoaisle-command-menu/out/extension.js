'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const nekoaisle_1 = require("./nekoaisle.lib/nekoaisle");
function activate(context) {
    let ext = new CommandMenu(context);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
class CommandMenu extends nekoaisle_1.Extension {
    /**
     * 構築
     */
    constructor(context) {
        super(context, {
            name: 'コマンドメニュー',
            config: 'nekoaisle-commandMenu',
            commands: [{
                    command: 'nekoaisle.commandMenu',
                    callback: () => { this.entry(); }
                }]
        });
    }
    /**
     * エントリー
     */
    entry() {
        // 実行されたときの TextEditor
        if (!vscode.window.activeTextEditor) {
            return;
        }
        let editor = vscode.window.activeTextEditor;
        // デフォルトの読み込み
        let fn = this.joinExtensionRoot("data/defaults.json");
        let defaults = nekoaisle_1.Util.loadFileJson(fn);
        // コマンドの読み込み
        let menuInfo = this.getConfig('menu', defaults);
        // メニューを作成
        let menu = [];
        let langID = editor.document.languageId;
        for (let item of menuInfo) {
            if (item.hide) {
                // 非表示は無視
                continue;
            }
            if (item.languageID) {
                // 言語が限定されている
                if (typeof item.languageID === 'string') {
                    if (langID !== item.languageID) {
                        // 言語が違うのでメニューから除外
                        continue;
                    }
                }
                else {
                    let equ = false;
                    for (let l of item.languageID) {
                        if (l === langID) {
                            equ = true;
                            break;
                        }
                    }
                    if (!equ) {
                        // 一致する言語がなかったのでメニューから除外
                        continue;
                    }
                }
            }
            // メニューに設定
            menu.push({
                label: item.label,
                description: item.description,
                detail: item.detail,
            });
        }
        let options = {
            placeHolder: '選択してください。',
            matchOnDetail: false,
            matchOnDescription: false
        };
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = menu;
        quickPick.placeholder = '選択してください。';
        quickPick.matchOnDetail = false;
        quickPick.matchOnDescription = false;
        /**
         * コマンドを実行する
         * ２箇所で使うのでサブルーチン化
         * @param label 入力された文字列
         * @return true 実行した
         */
        let exec = (label) => {
            // 入力された文字の長さを取得
            let len = label.length;
            if (!len) {
                return false;
            }
            // 文字列が一致するものをピックアップ
            let sels = [];
            for (let item of menuInfo) {
                if (!item.command) {
                    // コマンドなしは無視
                    continue;
                }
                // 各メニューの先頭を比較
                if (item.label.substr(0, len) === label) {
                    // 一致した
                    sels.push(item);
                }
            }
            if (sels.length !== 1) {
                // 一致しないか複数一致した
                return false;
            }
            let sel = sels[0];
            if (!sel.command) {
                // コマンドがない
                return false;
            }
            // 存在したので実行
            vscode.commands.executeCommand(sel.command, sel.args);
            return true;
        };
        /**
         * 入力文字列が変更された処理
         */
        quickPick.onDidChangeValue((e) => {
            e = this.zenToHan(e);
            e = e.toUpperCase();
            if (exec(e)) {
                quickPick.hide();
            }
        });
        /**
         * エンターを押した処理
         */
        quickPick.onDidAccept(() => {
            let picks = quickPick.selectedItems;
            if (picks.length === 1) {
                let pick = picks[0];
                if (pick) {
                    // 選択
                    exec(pick.label);
                }
            }
            // エンター押した場合は必ず閉じる
            quickPick.hide();
        });
        // 非表示にしたら破棄
        quickPick.onDidHide(() => quickPick.dispose());
        // 開く
        quickPick.show();
    }
    zenToHan(zen) {
        // 変換辞書
        const zenHanDic = {
            "０": "0", "１": "1", "２": "2", "３": "3", "４": "4",
            "５": "5", "６": "6", "７": "7", "８": "8", "９": "9",
            "ａ": "a", "ｂ": "b", "ｃ": "c", "ｄ": "d", "ｅ": "e", "ｆ": "f",
            "ｇ": "g", "ｈ": "h", "ｉ": "i", "ｊ": "j", "ｋ": "k", "ｌ": "l",
            "ｍ": "m", "ｎ": "n", "ｏ": "o", "ｐ": "p", "ｑ": "q", "ｒ": "r",
            "ｓ": "s", "ｔ": "t", "ｕ": "u", "ｖ": "v", "ｗ": "w", "ｘ": "x",
            "ｙ": "y", "ｚ": "z",
            "ー": "-", "＾": "^", "￥": "\\", "＠": "@", "「": "[", "；": ";",
            "：": ":", "」": "]", "、": ",", "。": ".", "・": "/", "＿": "_",
            "！": "!", "”": "\"", "＃": "#", "＄": "$", "％": "%", "＆": "&",
            "’": "'", "（": "(", "）": ")", "＝": "=", "〜": "~", "｜": "|",
            "｀": "`", "｛": "{", "＋": "+", "＊": "*", "｝": "}", "＜": "<",
            "＞": ">", "？": "?",
            "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
        };
        let han = '';
        for (let i = 0; i < zen.length; ++i) {
            let c = zen.charAt(i);
            if (zenHanDic[c]) {
                han += zenHanDic[c];
            }
            else {
                // 辞書にないのでそのまま
                han += c;
            }
        }
        return han;
    }
}
//# sourceMappingURL=extension.js.map