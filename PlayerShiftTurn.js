//=============================================================================
// PlayerShiftTurn.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2020/09/21 英語版のヘルプを追加
// 1.1.0 2020/09/21 指定したスイッチがONのときのみプラグインの機能を有効にする設定を追加
// 1.0.1 2016/07/09 8方向移動系（かつキャラクターの向きは4方向）のプラグインとの競合を解消
// 1.0.0 2016/01/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc PlayerShiftTurn
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PlayerShiftTurn.js
 * @author triacontane
 *
 * @param buttonName
 * @desc This button is used to change direction on the spot.
 * @default shift
 * @type combo
 * @option shift
 * @option control
 * @option tab
 *
 * @param validSwitchId
 * @desc The function of the plug-in is enabled only when the specified switch is ON.
 * @default 0
 * @type switch
 *
 * @help Change direction on the fly without moving the player
 * while holding down a given key.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc プレイヤーのその場方向転換
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PlayerShiftTurn.js
 * @author トリアコンタン
 *
 * @param buttonName
 * @text ボタン名称
 * @desc その場方向転換に使用するボタンです。
 * @default shift
 * @type combo
 * @option shift
 * @option control
 * @option tab
 *
 * @param validSwitchId
 * @text 有効スイッチ番号
 * @desc 指定したスイッチがONのときのみプラグインの機能が有効になります。0を指定すると常に有効になります。
 * @default 0
 * @type switch
 *
 * @help 指定されたキーを押している間、プレイヤーを移動させずに
 * その場で方向転換します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    'use strict';
    var pluginName = 'PlayerShiftTurn';

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

    var param = createPluginParameter(pluginName);

    //=============================================================================
    // Game_Player
    //  指定したボタンが押されていた場合にプレイヤーを移動させずに向きだけ変更します。
    //=============================================================================
    var _Game_Player_executeMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function(direction) {
        if (Input.isPressed(param.buttonName) && this.isValidShiftTurn()) {
            if (direction === Input.dir4) {
                this.setDirection(direction);
            }
        } else {
            _Game_Player_executeMove.apply(this, arguments);
        }
    };

    Game_Player.prototype.isValidShiftTurn = function() {
        return !param.validSwitchId || $gameSwitches.value(param.validSwitchId);
    };
})();

