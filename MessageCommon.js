//=============================================================================
// MessageCommon.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/05/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc MessageCommonPlugin
 * @author triacontane
 *
 * @help メッセージの表示中にコモンイベントを呼び出します。
 * コモンイベントは並列扱いで実行されます。
 *
 * 以下の制御文字を含めて「文章の表示」を実行してください。
 * \CE[1] # コモンイベント[1]を実行します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc メッセージコモンプラグイン
 * @author トリアコンタン
 *
 * @help メッセージの表示中にコモンイベントを呼び出します。
 * コモンイベントは並列扱いで実行されます。
 *
 * 以下の制御文字を含めて「文章の表示」を実行してください。
 * \CE[1] # コモンイベント[1]を実行します。
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

    //=============================================================================
    // Game_System
    //  メッセージコモンイベントを更新します。
    //=============================================================================
    Game_System.prototype.addMessageCommonEvents = function(id) {
        if (!this._messageCommonEvents) {
            this._messageCommonEvents = [];
        }
        var interpreter = new Game_Interpreter();
        interpreter.setup($dataCommonEvents[id].list);
        this._messageCommonEvents.push(interpreter);
    };

    Game_System.prototype.updateMessageCommonEvents = function() {
        if (!this._messageCommonEvents || this._messageCommonEvents.length === 0) return;
        this._messageCommonEvents.forEach(function(interpreter) {
            interpreter.update();
        });
        this._messageCommonEvents = this._messageCommonEvents.filter(function(interpreter) {
            return interpreter.isRunning();
        });
    };

    //=============================================================================
    // Window_Message
    //  メッセージコモンイベントを呼び出します。
    //=============================================================================
    var _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        if (code === 'CE') {
            this.callMessageCommon(this.obtainEscapeParam(textState));
            return;
        }
        _Window_Message_processEscapeCharacter.apply(this, arguments);
    };

    Window_Message.prototype.callMessageCommon = function(commonEventId) {
        $gameSystem.addMessageCommonEvents(commonEventId);
    };

    var _Window_Message_update = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        $gameSystem.updateMessageCommonEvents();
        _Window_Message_update.apply(this, arguments);
    };
})();

