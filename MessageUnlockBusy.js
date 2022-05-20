//=============================================================================
// MessageUnlockBusy.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2022/05/20 MZで動作するよう修正
// 1.1.1 2016/08/23 プラグインコマンドが小文字でも機能するよう修正
// 1.1.0 2016/08/23 一度ロックを解除したあとで再度、ロック状態に戻すプラグインコマンドを追加
// 1.0.0 2016/07/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc メッセージの入力待ち解除プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageUnlockBusy.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param escapeCode
 * @text 制御文字
 * @desc 本プラグインの制御文字をデフォルトのULから変更する場合に指定します。
 * @default
 *
 * @command RE_WAIT
 * @text 再ウェイト
 * @desc \UL実行後に再度、入力待ち状態に戻します。
 *
 * @help MessageUnlockBusy.js
 *
 * メッセージ中に制御文字「\UL」を挿入すると、
 * メッセージウィンドウを表示したまま次のイベント命令に移行するようになります。
 * ポーズサインは表示されたままです。
 *
 * プラグインコマンドから再度、入力待ち状態に戻すこともできます。
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'RE_WAIT', function(args) {
        if ($gameMessage.isBusy()) {
            this.setWaitMode('message');
        }
    });

    //=============================================================================
    // Game_Message
    //  ウェイト解除処理を追加定義します。
    //=============================================================================
    const _Game_Message_clear = Game_Message.prototype.clear;
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

    const _Game_Interpreter_command101 = Game_Interpreter.prototype.command101;
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
    const _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        const ulCode = param.escapeCode || 'UL';
        switch (code) {
            case ulCode:
                $gameMessage.setWaitMode('');
                break;
            default:
                _Window_Message_processEscapeCharacter.apply(this, arguments);
        }
    };
})();

