/*=============================================================================
 TitleWaitingDemo.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2019/06/06 何らかのキー入力によって待機秒数をリセットする機能を追加 byツミオさん
 1.0.0 2019/06/05 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc TitleWaitingDemoPlugin
 * @author triacontane
 *
 * @param mapId
 * @desc 移動先のマップIDです。
 * @default 1
 * @type number
 *
 * @param mapX
 * @desc 移動先のX座標です。
 * @default 1
 * @type number
 *
 * @param mapY
 * @desc 移動先のY座標です。
 * @default 1
 * @type number
 *
 * @param waitSecond
 * @desc タイトル画面で待機する秒数です。
 * @default 20
 * @type number
 *
 * @param shouldIgnoreKey
 * @desc キーの入力を無視するかどうか。有効の場合、キー入力があっても待機秒数はリセットされません。
 * @default true
 * @type boolean
 *
 * @help TitleWaitingDemo.js
 *
 * タイトル画面を表示したまま一定時間待機することで
 * 指定したマップからニューゲーム扱いでゲーム開始します。
 *
 * デモ画面や隠し要素に利用できます。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc タイトル待機デモ表示プラグイン
 * @author トリアコンタン
 *
 * @param mapId
 * @text マップID
 * @desc 移動先のマップIDです。
 * @default 1
 * @type number
 *
 * @param mapX
 * @text X座標
 * @desc 移動先のX座標です。
 * @default 1
 * @type number
 *
 * @param mapY
 * @text Y座標
 * @desc 移動先のY座標です。
 * @default 1
 * @type number
 *
 * @param waitSecond
 * @text 待機秒数
 * @desc タイトル画面で待機する秒数です。
 * @default 20
 * @type number
 *
 * @param shouldIgnoreKey
 * @text キー入力を無視する
 * @desc キーの入力を無視するかどうか。有効の場合、キー入力があっても待機秒数はリセットされません。
 * @default true
 * @type boolean
 *
 * @help TitleWaitingDemo.js
 *
 * タイトル画面を表示したまま一定時間待機することで
 * 指定したマップからニューゲーム扱いでゲーム開始します。
 *
 * デモ画面や隠し要素に利用できます。
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

    var param = createPluginParameter('TitleWaitingDemo');

    var _Scene_Title_start      = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title_start.apply(this, arguments);
        this._waitingDemoFrame = 0;
    };

    var _Scene_Title_update      = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title_update.apply(this, arguments);
        this._waitingDemoFrame++;
        this.updateInputKey();
        if (this.shouldStartWaitingDemo()) {
            this.startWaitingDemo();
            this._startWaitingDemo = true;
        }
    };

    Scene_Title.prototype.updateInputKey = function() {
        if (param.shouldIgnoreKey) {
            return;
        }
        if (this.isAnyKeyInputted()) {
            this.resetWaitingDemoFrame();
        }
    };

    Scene_Title.prototype.startWaitingDemo = function() {
        this.commandNewGame();
        $gamePlayer.reserveTransfer(param.mapId, param.mapX, param.mapY);
        this._commandWindow.open();
    };

    Scene_Title.prototype.shouldStartWaitingDemo = function() {
        var isTimeLimit = this._waitingDemoFrame > param.waitSecond * 60;
        return isTimeLimit && !this._startWaitingDemo;
    };

    Scene_Title.prototype.resetWaitingDemoFrame = function() {
        this._waitingDemoFrame = 0;
    };

    //キーかマウスのボタンがクリックされたかどうか
    Scene_Title.prototype.isAnyKeyInputted = function() {
        return Input._latestButton || TouchInput.isTriggered();
    };
})();
