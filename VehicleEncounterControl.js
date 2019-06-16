/*=============================================================================
 VehicleEncounterControl.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2019/06/16 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc VehicleEncounterControlPlugin
 * @author triacontane
 *
 * @param boatEncounterDisable
 * @desc 指定した番号のスイッチがONのとき小型船でのエンカウントを無効にします。
 * @default 0
 * @type switch
 *
 * @param shipEncounterDisable
 * @desc 指定した番号のスイッチがONのとき大型船でのエンカウントを無効にします。
 * @default 0
 * @type switch
 *
 * @param airShipEncounterDisable
 * @desc 指定した番号のスイッチがONのとき飛行船でのエンカウントを無効にします。
 * @default 0
 * @type switch
 *
 * @help VehicleEncounterControl.js
 * 乗り物に乗っているときのエンカウントをスイッチにより無効化します。
 * スイッチを指定していない場合はデフォルトの動作をします。
 * ・デフォルト動作
 * 小型船：通常エンカウント
 * 大型船：通常エンカウント(エンカウント率1/2)
 * 飛行船：エンカウントなし
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 乗り物のエンカウント制御プラグイン
 * @author トリアコンタン
 *
 * @param boatEncounterDisable
 * @text 小型船のエンカウント無効
 * @desc 指定した番号のスイッチがONのとき小型船でのエンカウントを無効にします。
 * @default 0
 * @type switch
 *
 * @param shipEncounterDisable
 * @text 大型船のエンカウント無効
 * @desc 指定した番号のスイッチがONのとき大型船でのエンカウントを無効にします。
 * @default 0
 * @type switch
 *
 * @param airShipEncounterDisable
 * @text 飛行船のエンカウント無効
 * @desc 指定した番号のスイッチがONのとき飛行船でのエンカウントを無効にします。
 * @default 0
 * @type switch
 *
 * @help VehicleEncounterControl.js
 * 乗り物に乗っているときのエンカウントをスイッチにより無効化します。
 * スイッチを指定していない場合はデフォルトの動作をします。
 * ・デフォルト動作
 * 小型船：通常エンカウント
 * 大型船：通常エンカウント(エンカウント率1/2)
 * 飛行船：エンカウントなし
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

    var param = createPluginParameter('VehicleEncounterControl');

    /**
     * Game_Player
     * 乗り物に乗っているときのエンカウントを制御します。
     */
    var _Game_Player_canEncounter = Game_Player.prototype.canEncounter;
    Game_Player.prototype.canEncounter = function() {
        if (this.canEncounterInAirShip()) {
            this._canEncounterInAirShip = true;
        }
        var result = _Game_Player_canEncounter.apply(this, arguments);
        this._canEncounterInAirShip = false;
        return result && !this.disableEncounterInBoat() && !this.disableEncounterInShip();
    };

    var _Game_Player_isInAirship = Game_Player.prototype.isInAirship;
    Game_Player.prototype.isInAirship = function() {
        return _Game_Player_isInAirship.apply(this, arguments) && !this._canEncounterInAirShip;
    };

    Game_Player.prototype.disableEncounterInBoat = function() {
        return this.isInBoat() && $gameSwitches.value(param.boatEncounterDisable);
    };

    Game_Player.prototype.disableEncounterInShip = function() {
        return this.isInShip() && $gameSwitches.value(param.shipEncounterDisable);
    };

    Game_Player.prototype.canEncounterInAirShip = function() {
        return this.isInAirship() &&
            param.airShipEncounterDisable && !$gameSwitches.value(param.airShipEncounterDisable);
    };
})();
