/**
 * @@title@@
 *
 * filename:  @@filename@@
 *
 * @package
 * @version   1.0.0
 * @copyright Copyright (C) @@copyright@@ Yoshio Kiya All rights reserved.
 * @date      @@date@@
 * @author    @@author@@
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
 * @@title@@
 */
class MyExtention extends nekoaisle_1.Extension {
    /**
     * 構築
     */
    constructor(context) {
        super(context, {
            name: '@@title@@',
            config: '',
            commands: [
                {
                    command: 'nekoaisle.',
                    callback: () => {
                        this.exec();
                    }
                }
            ]
        });
    }
    /**
     * 実行
     */
    exec() {
    }
}
//# sourceMappingURL=template.js.map