//=============================================================================
// MessageWindowHidden.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.4 2016/07/22 YEP_MessageCore.jsのネーム表示ウィンドウと連携する機能を追加
// 1.0.3 2016/01/24 メッセージウィンドウが表示されていないときも非表示にできてしまう現象の修正
// 1.0.2 2016/01/02 競合対策
// 1.0.1 2015/12/31 コメント追加＋英語対応（仕様に変化なし）
// 1.0.0 2015/12/30 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Erase message window
 * @author triacontane
 *
 * @param TriggerButton
 * @desc Trigger button
 * (light_click or shift or control)
 * @default light_click
 *
 * @help Erase message window (and restore) when triggered
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc メッセージウィンドウ一時消去プラグイン
 * @author トリアコンタン
 *
 * @param ボタン名称
 * @desc ウィンドウを消去するボタンです。
 * (右クリック or shift or control)
 * @default 右クリック
 *
 * @help メッセージウィンドウを表示中に指定したボタンを押下することで
 * メッセージウィンドウを消去します。もう一度押すと戻ります。
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

    //=============================================================================
    // Window_Message
    //  指定されたボタン押下時にウィンドウとサブウィンドウを非表示にします。
    //=============================================================================
    var _Window_Message_updateWait = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function() {
        if (!this.isClosed() && this.isTriggeredHidden()) {
            if (this.visible) {
                this.hide();
                this.subWindows().forEach(function(subWindow) {
                    this.hideSubWindow(subWindow);
                }.bind(this));
                if (this.hasNameWindow()) this.hideSubWindow(this._nameWindow);
            } else {
                this.show();
                this.subWindows().forEach(function(subWindow) {
                    this.showSubWindow(subWindow);
                }.bind(this));
                if (this.hasNameWindow()) this.showSubWindow(this._nameWindow);
            }
        }
        return _Window_Message_updateWait.call(this);
    };

    Window_Message.prototype.hideSubWindow = function(subWindow) {
        subWindow.prevVisible = subWindow.visible;
        subWindow.hide();
    };

    Window_Message.prototype.showSubWindow = function(subWindow) {
        if (subWindow.prevVisible) subWindow.show();
        subWindow.prevVisible = undefined;
    };

    Window_Message.prototype.hasNameWindow = function() {
        return this._nameWindow && typeof Window_NameBox !== 'undefined';
    };

    Window_Message.prototype.isTriggeredHidden = function() {
        var buttonName = getParamString(['ボタン名称','TriggerButton']).toLowerCase();
        switch (buttonName) {
            case '':
            case '右クリック':
            case 'light_click':
                return TouchInput.isCancelled();
            case 'ok':
                return false;
            default:
                return Input.isTriggered(buttonName);
        }
    };

    var _Window_Message_updateInput = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        if (!this.visible) return true;
        return _Window_Message_updateInput.call(this);
    };

    //=============================================================================
    // Window_ChoiceList、Window_NumberInput、Window_EventItem
    //  非表示の間は更新を停止します。
    //=============================================================================
    var _Window_ChoiceList_update = Window_ChoiceList.prototype.update;
    Window_ChoiceList.prototype.update = function() {
        if (!this.visible) return;
        return _Window_ChoiceList_update.call(this);
    };

    var _Window_NumberInput_update = Window_NumberInput.prototype.update;
    Window_NumberInput.prototype.update = function() {
        if (!this.visible) return;
        return _Window_NumberInput_update.call(this);
    };

    var _Window_EventItem_update = Window_EventItem.prototype.update;
    Window_EventItem.prototype.update = function() {
        if (!this.visible) return;
        return _Window_EventItem_update.call(this);
    };
})();

