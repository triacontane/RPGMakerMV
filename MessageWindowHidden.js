//=============================================================================
// MessageWindowHidden.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.2 2017/08/02 ponidog_BackLog_utf8.jsとの競合を解消
// 1.3.1 2017/07/03 古いYEP_MessageCore.jsのネーム表示ウィンドウが再表示できない不具合の修正(by DarkPlasmaさま)
// 1.3.0 2017/03/16 連動して非表示にできるピクチャを複数指定できる機能を追加
// 1.2.1 2017/02/07 端末依存の記述を削除
// 1.2.0 2016/01/02 メッセージウィンドウと連動して指定したピクチャの表示/非表示が自動で切り替わる機能を追加
// 1.1.0 2016/08/25 選択肢の表示中はウィンドウを非表示にできないよう仕様変更
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
 * @param LinkPictureNumber
 * @desc Picture number of window show/hide
 * @default
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
 * @param 連動ピクチャ番号
 * @desc ウィンドウ消去時に連動して不透明度を[0]にするピクチャの番号です。カンマ「,」区切りで複数指定できます。
 * @default
 *
 * @help メッセージウィンドウを表示中に指定したボタンを押下することで
 * メッセージウィンドウを消去します。もう一度押すと戻ります。
 *
 * ウィンドウ消去時に連動して不透明度を[0]にするピクチャを指定することができます。
 * 背景に特定のピクチャを使用している場合などに指定してください。
 * 再表示すると不透明度は[255]になります。
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

    var getParamArrayString = function(paramNames) {
        var values = getParamString(paramNames).split(',');
        for (var i = 0; i < values.length; i++) {
            values[i] = values[i].trim();
        }
        return values;
    };

    var getParamArrayNumber = function(paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) {
            if (!isNaN(parseInt(values[i], 10))) {
                values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
            } else {
                values.splice(i--, 1);
            }
        }
        return values;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param                = {};
    param.triggerButton      = getParamString(['TriggerButton', 'ボタン名称']).toLowerCase();
    param.linkPictureNumbers = getParamArrayNumber(['LinkPictureNumber', '連動ピクチャ番号']);

    //=============================================================================
    // Game_Picture
    //  メッセージウィンドウの表示可否と連動します。
    //=============================================================================
    Game_Picture.prototype.linkWithMessageWindow = function(opacity) {
        this._opacity       = opacity;
        this._targetOpacity = opacity;
    };

    //=============================================================================
    // Window_Message
    //  指定されたボタン押下時にウィンドウとサブウィンドウを非表示にします。
    //=============================================================================
    var _Window_Message_updateWait      = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function() {
        if (!this.isClosed() && this.isTriggeredHidden() && !$gameMessage.isChoice()) {
            if (!this.isHidden()) {
                this.hideAllWindow();
            } else {
                this.showAllWindow();
            }
        }
        var wait = _Window_Message_updateWait.apply(this, arguments);
        if (this.isHidden() && this.visible) {
            this.hideAllWindow();
        }
        return wait;
    };

    Window_Message.prototype.hideAllWindow = function() {
        this.hide();
        this.subWindows().forEach(function(subWindow) {
            this.hideSubWindow(subWindow);
        }.bind(this));
        if (this.hasNameWindow() && !this.nameWindowIsSubWindow()) this.hideSubWindow(this._nameWindow);
        this.linkPictures(0);
        this._hideByMessageWindowHidden = true;
    };

    Window_Message.prototype.showAllWindow = function() {
        this.show();
        this.subWindows().forEach(function(subWindow) {
            this.showSubWindow(subWindow);
        }.bind(this));
        if (this.hasNameWindow() && !this.nameWindowIsSubWindow()) this.showSubWindow(this._nameWindow);
        this.linkPictures(255);
        this._hideByMessageWindowHidden = false;
    };

    Window_Message.prototype.isHidden = function() {
        return this._hideByMessageWindowHidden;
    };

    Window_Message.prototype.linkPictures = function(opacity) {
        param.linkPictureNumbers.forEach(function(pictureId) {
            this.linkPicture(opacity, pictureId);
        }, this);
    };

    Window_Message.prototype.linkPicture = function(opacity, pictureId) {
        var picture = $gameScreen.picture(pictureId);
        if (picture) {
            picture.linkWithMessageWindow(opacity);
        }
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

    /**
     * 古いYEP_MessageCore.jsでは、ネーム表示ウィンドウはsubWindowsに含まれる
     */
    Window_Message.prototype.nameWindowIsSubWindow = function() {
        return this.subWindows().filter(function(subWindow) {
            return subWindow === this._nameWindow;
        }, this).length > 0;
    };

    Window_Message.prototype.isTriggeredHidden = function() {
        switch (param.triggerButton) {
            case '':
            case '右クリック':
            case 'light_click':
                return TouchInput.isCancelled();
            case 'ok':
                return false;
            default:
                return Input.isTriggered(param.triggerButton);
        }
    };

    var _Window_Message_updateInput      = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        if (this.isHidden()) return true;
        return _Window_Message_updateInput.apply(this, arguments);
    };

    //=============================================================================
    // Window_ChoiceList、Window_NumberInput、Window_EventItem
    //  非表示の間は更新を停止します。
    //=============================================================================
    var _Window_ChoiceList_update      = Window_ChoiceList.prototype.update;
    Window_ChoiceList.prototype.update = function() {
        if (!this.visible) return;
        _Window_ChoiceList_update.apply(this, arguments);
    };

    var _Window_NumberInput_update      = Window_NumberInput.prototype.update;
    Window_NumberInput.prototype.update = function() {
        if (!this.visible) return;
        _Window_NumberInput_update.apply(this, arguments);
    };

    var _Window_EventItem_update      = Window_EventItem.prototype.update;
    Window_EventItem.prototype.update = function() {
        if (!this.visible) return;
        _Window_EventItem_update.apply(this, arguments);
    };
})();

