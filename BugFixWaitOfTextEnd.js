//=============================================================================
// BugFixWaitOfTextEnd.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/01/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BugFixWaitOfTextEndPlugin
 * @author triacontane
 *
 * @help メッセージウィンドウにおいてテキストの末尾にある
 * ウェイト(\! \. \|)が無視されてしまう現象を修正します。
 *
 * さらに上記の現象に起因して、テキストの末尾に「\!」があり、
 * 次の命令が「選択肢の表示」や「数値入力の処理」である場合に
 * 続く「メッセージの表示」がスキップされてしまう現象を修正します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc メッセージ末尾のウェイト無視修正プラグイン
 * @author トリアコンタン
 *
 * @help メッセージウィンドウにおいてテキストの末尾にある
 * ウェイト(\! \. \|)が無視されてしまう現象を修正します。
 *
 * さらに上記の現象に起因して、テキストの末尾に「\!」があり、
 * 次の命令が「選択肢の表示」や「数値入力の処理」である場合に
 * 続く「メッセージの表示」がスキップされてしまう現象を修正します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

    var _Window_Message_isEndOfText = Window_Message.prototype.isEndOfText;
    Window_Message.prototype.isEndOfText = function(textState) {
        return !this.isWaitExist() && _Window_Message_isEndOfText.apply(this, arguments);
    };

    Window_Message.prototype.isWaitExist = function() {
        return this.pause || this._waitCount > 0;
    }
})();



