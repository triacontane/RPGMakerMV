/*=============================================================================
 EventTouchCheck.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/13 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc イベント接触判定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventTouchCheck.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command SET_SWITCH
 * @text スイッチ設定
 * @desc 実行中のイベントが『イベントから接触』で起動したかどうかをスイッチに設定します。
 *
 * @arg switchId
 * @text スイッチ番号
 * @desc 『イベントから接触』で起動した場合にONにするスイッチ番号です。
 * @default 1
 * @type switch
 *
 * @help EventTouchCheck.js
 *
 * 実行中のイベントが『イベントから接触』で起動したかどうかを判定します。
 * 設定したトリガーの値ではなく、実際にイベントから接触してきたかどうかを
 * 判定します。
 *
 * 条件分岐で以下のスクリプトを実行するか、プラグインコマンドで判定結果を
 * 任意のスイッチに格納してください。
 * this.character(0).isStartByTouch();
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

(() => {
    'use strict';
    const script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'SET_SWITCH', function (args) {
        $gameSwitches.setValue(args.switchId, this.character(0).isStartByTouch());
    });

    const _Game_Event_checkEventTriggerTouch = Game_Event.prototype.checkEventTriggerTouch;
    Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
        _Game_Event_checkEventTriggerTouch.apply(this, arguments);
        if (this.isStarting()) {
            this._startByTouch = true;
        }
    };

    Game_Event.prototype.clearStartByTouch = function() {
        this._startByTouch = false;
    };

    Game_Event.prototype.isStartByTouch = function() {
        return this._startByTouch;
    };

    const _Game_Interpreter_terminate = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function() {
        _Game_Interpreter_terminate.apply(this, arguments);
        if (this._eventId > 0 && this._depth === 0) {
            this.character(0).clearStartByTouch();
        }
    };
})();
