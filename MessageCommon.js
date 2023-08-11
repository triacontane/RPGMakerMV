//=============================================================================
// MessageCommon.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2023/08/11 引数付きコモン呼び出しプラグインと連携して、引数付きコモンを制御文字から呼べる機能を追加
// 1.1.0 2022/05/20 MZで動作するよう修正
// 1.0.0 2017/05/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc メッセージコモンプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageCommon.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help MessageCommon.js
 *
 * メッセージの表示中にコモンイベントを呼び出します。
 * コモンイベントは並列扱いで実行されます。
 *
 * 以下の制御文字を含めて「文章の表示」を実行してください。
 * \CE[1] # コモンイベント[1]を実行します。
 *
 * 引数付きコモン呼び出しプラグインが導入されている場合は、
 * 以下の制御文字で引数を渡すこともできます。渡せる引数の型は数値と文字列のみです。
 * \CEP[1,3,5] # コモンイベント[1]を実行し、引数に3と5を渡します。
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

    //=============================================================================
    // Game_System
    //  メッセージコモンイベントを更新します。
    //=============================================================================
    Game_System.prototype.addMessageCommonEvents = function(id) {
        if (!this._messageCommonEvents) {
            this._messageCommonEvents = [];
        }
        const interpreter = new Game_Interpreter();
        interpreter.setup($dataCommonEvents[id].list);
        this._messageCommonEvents.push(interpreter);
    };

    Game_System.prototype.updateMessageCommonEvents = function() {
        if (!this._messageCommonEvents || this._messageCommonEvents.length === 0) return;
        this._messageCommonEvents.forEach(function(interpreter) {
            interpreter.update();
        });
        this._messageCommonEvents = this._messageCommonEvents.filter(interpreter =>interpreter.isRunning());
    };

    //=============================================================================
    // Window_Message
    //  メッセージコモンイベントを呼び出します。
    //=============================================================================
    const _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        if (code === 'CE') {
            this.callMessageCommon(this.obtainEscapeParam(textState));
            return;
        }
        if (code === 'CEP') {
            const commonParams = this.obtainEscapeParamString(textState).split(',')
                .map(item => isNaN(item) ? item : parseInt(item));
            const idValue = commonParams.shift();
            const common = DataManager.setupCommonParameter(idValue, commonParams);
            this.callMessageCommon(common.id);
            return;
        }
        _Window_Message_processEscapeCharacter.apply(this, arguments);
    };

    Window_Message.prototype.callMessageCommon = function(commonEventId) {
        $gameSystem.addMessageCommonEvents(commonEventId);
    };

    const _Window_Message_update = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        $gameSystem.updateMessageCommonEvents();
        _Window_Message_update.apply(this, arguments);
    };

    Window_Message.prototype.obtainEscapeParamString = function(textState) {
        const arr = /^\[.+?]/.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return arr[0].substring(1, arr[0].length - 1);
        } else {
            return '';
        }
    };
})();

