'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const OpenFile = require("./OpenFile");
const OpenRelated = require("./OpenRelated");
const OpenNew = require("./OpenNew");
const OpenTemp = require("./OpenTemp");
const InsertFile = require("./InsertFile");
const OpenHist = require("./OpenHist");
const OpenTag = require("./OpenTag");
const FindOpen = require("./FindOpen");
/**
 * エクステンション起動
 * @param context
 */
function activate(context) {
    new OpenFile(context);
    new OpenRelated(context);
    new OpenNew(context);
    new OpenTemp(context);
    new InsertFile(context);
    new OpenHist(context);
    new OpenTag(context);
    new FindOpen(context);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map