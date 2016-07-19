//=============================================================================
// MessageUnlockBusy.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/07/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc メッセージのロック解除プラグイン
 * @author トリアコンタン
 *
 * @help メッセージ中に以下の制御文字を挿入すると、
 * メッセージを表示したまま次のイベント命令に移行します。
 * 
 * \UL
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
    var setting = {
        unlockCode:'UL'
    };

    //=============================================================================
    // Game_Message
    //  ウェイト解除処理を追加定義します。
    //=============================================================================
    var _Game_Message_clear = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.apply(this, arguments);
        this._interpreter = null;
    };

    Game_Message.prototype.setInterpreter = function(interpreter) {
        this._interpreter = interpreter;
    };

    Game_Message.prototype.setWaitMode = function(value) {
        if (this._interpreter) {
            this._interpreter.setWaitMode(value);
        }
    };

    //=============================================================================
    // Game_Interpreter
    //  メッセージオブジェクトにインタプリタを受け渡します。
    //=============================================================================
    var _Game_Interpreter_command101 = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setInterpreter(this);
        }
        _Game_Interpreter_command101.apply(this, arguments);
    };

    //=============================================================================
    // Window_Message
    //  制御文字を実装します。
    //=============================================================================
    var _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        switch (code) {
            case setting.unlockCode:
                $gameMessage.setWaitMode('');
                break;
            default:
                _Window_Message_processEscapeCharacter.apply(this, arguments);
        }
    };
})();

