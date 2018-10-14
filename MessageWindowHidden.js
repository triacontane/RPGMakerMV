//=============================================================================
// MessageWindowHidden.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.1.0 2018/10/10 戦闘中にプラグインを無効化できる機能を追加。
// 2.0.0 2018/03/31 消去するトリガーを複数指定できる機能を追加。パラメータの指定方法を見直し。
// 1.4.0 2018/03/10 指定したスイッチがONの間はウィンドウ消去を無効化できる機能を追加
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
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Erase message window
 * @author triacontane
 *
 * @param triggerButton
 * @desc Trigger buttons
 * (light_click or shift or control)
 * @default ["light_click"]
 * @type combo[]
 * @option light_click
 * @option shift
 * @option control
 * @option tab
 * @option pageup
 * @option pagedown
 * @option debug
 *
 * @param linkPictureNumbers
 * @desc Picture number of window show/hide
 * @default
 * @type number[]
 *
 * @param disableSwitchId
 * @desc 指定した番号のスイッチがONのとき、プラグインの機能が無効になります。
 * @default 0
 * @type switch
 *
 * @param disableInBattle
 * @desc trueのとき、戦闘中にプラグインの機能を無効にします。
 * @default false
 * @type boolean
 *
 * @help Erase message window (and restore) when triggered
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc メッセージウィンドウ一時消去プラグイン
 * @author トリアコンタン
 *
 * @param triggerButton
 * @text ボタン名称
 * @desc ウィンドウを消去するボタンです。(複数登録可能) プラグイン等で入力可能なボタンを追加した場合は直接入力
 * @default ["右クリック"]
 * @type combo[]
 * @option 右クリック
 * @option shift
 * @option control
 * @option tab
 * @option pageup
 * @option pagedown
 * @option debug
 *
 * @param linkPictureNumbers
 * @text 連動ピクチャ番号
 * @desc ウィンドウ消去時に連動して不透明度を[0]にするピクチャの番号です。
 * @default
 * @type number[]
 *
 * @param disableSwitchId
 * @text 無効スイッチ番号
 * @desc 指定した番号のスイッチがONのとき、プラグインの機能が無効になります。
 * @default 0
 * @type switch
 *
 * @param disableInBattle
 * @text 戦闘中無効化
 * @desc trueのとき、戦闘中にプラグインの機能を無効にします。
 * @default false
 * @type boolean
 *
 * @help メッセージウィンドウを表示中に指定したボタンを押下することで
 * メッセージウィンドウを消去します。もう一度押すと戻ります。
 *
 * ウィンドウ消去時に連動して不透明度を[0]にするピクチャを指定することができます。
 * 背景に特定のピクチャを使用している場合などに指定してください。
 * 再表示すると不透明度は[255]になります。
 *
 * ver2.0.0よりパラメータの指定方法が一部変更になりました。
 * 以前のバージョンを使っていた方は再設定をお願いします。
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

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };
    var param = createPluginParameter('MessageWindowHidden');

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
        if (!param.linkPictureNumbers) {
            return;
        }
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

    // 古いYEP_MessageCore.jsでは、ネーム表示ウィンドウはsubWindowsに含まれる
    Window_Message.prototype.nameWindowIsSubWindow = function() {
        return this.subWindows().filter(function(subWindow) {
            return subWindow === this._nameWindow;
        }, this).length > 0;
    };

    Window_Message.prototype.disableWindowHidden = function () {
        return (param.disableSwitchId > 0 && $gameSwitches.value(param.disableSwitchId)) ||
            (param.disableInBattle && $gameParty.inBattle());
    };

    Window_Message.prototype.isTriggeredHidden = function() {
        if (this.disableWindowHidden()) {
            return false;
        }
        return param.triggerButton.some(function(button) {
            switch (button) {
                case '':
                case '右クリック':
                case 'light_click':
                    return TouchInput.isCancelled();
                case 'ok':
                    return false;
                default:
                    return Input.isTriggered(button);
            }
        });
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

