//=============================================================================
// MessageWindowHidden.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2015/12/30 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc メッセージウィンドウ一時消去プラグイン
 * @author トリアコンタン
 *
 * @param ボタン名称
 * @desc ウィンドウを消去するボタンです。
 * (右クリック or shift or control)
 * @default 右クリック
 *
 * @help 指定したボタンを押下しているあいだメッセージウィンドウを消去します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    'use strict';
    var pluginName = 'MessageWindowHidden';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var _Window_Message_updateWait = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function() {
        if (this.isTriggeredHidden()) {
            if (this.visible) {
                this.hide();
                this.subWindows().forEach(function(subWindow) {
                    subWindow.hide();
                });
            } else {
                this.show();
                this.subWindows().forEach(function(subWindow) {
                    subWindow.show();
                });
            }
        }
        return _Window_Message_updateWait.call(this);
    };

    Window_Message.prototype.isTriggeredHidden = function() {
        var buttonName = getParamString('ボタン名称').toLowerCase();
        if (!buttonName || buttonName === '右クリック') return TouchInput.isCancelled();
        return Input.isTriggered(buttonName);
    };

    var _Window_Message_updateInput = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        if (!this.visible) return true;
        return _Window_Message_updateInput.call(this);
    };

    var _Window_ChoiceList_update = Window_ChoiceList.prototype.update;
    Window_ChoiceList.prototype.update = function() {
        if (!this.visible) return false;
        return _Window_ChoiceList_update.call(this);
    };

    var _Window_NumberInput_update = Window_NumberInput.prototype.update;
    Window_NumberInput.prototype.update = function() {
        if (!this.visible) return false;
        return _Window_NumberInput_update.call(this);
    };

    var _Window_EventItem_update = Window_EventItem.prototype.update;
    Window_EventItem.prototype.update = function() {
        if (!this.visible) return false;
        return _Window_EventItem_update.call(this);
    };
})();

