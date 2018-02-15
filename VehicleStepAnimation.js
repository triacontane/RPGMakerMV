//=============================================================================
// VehicleStepAnimation.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2018/02/15 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc VehicleStepAnimationPlugin
 * @author triacontane
 *
 * @param boatStepAnimation
 * @desc 小型船に搭乗していないときでも足踏みアニメさせます。
 * @default false
 * @type boolean
 *
 * @param shipStepAnimation
 * @desc 大型船に搭乗していないときでも足踏みアニメさせます。
 * @default false
 * @type boolean
 *
 * @param airStepAnimation
 * @desc 飛行船に搭乗していないときでも足踏みアニメさせます。
 * @default false
 * @type boolean
 *
 * @help VehicleStepAnimation.js
 *
 * 乗り物に搭乗していないときでも足踏みアニメさせます。
 * 乗り物の種別ごとに有無を設定できます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 乗り物の足踏みアニメプラグイン
 * @author トリアコンタン
 *
 * @param boatStepAnimation
 * @text 小型船で足踏みアニメ
 * @desc 小型船に搭乗していないときでも足踏みアニメさせます。
 * @default false
 * @type boolean
 *
 * @param shipStepAnimation
 * @text 大型船で足踏みアニメ
 * @desc 大型船に搭乗していないときでも足踏みアニメさせます。
 * @default false
 * @type boolean
 *
 * @param airStepAnimation
 * @text 飛行船で足踏みアニメ
 * @desc 飛行船に搭乗していないときでも足踏みアニメさせます。
 * @default false
 * @type boolean
 *
 * @help VehicleStepAnimation.js
 *
 * 乗り物に搭乗していないときでも足踏みアニメさせます。
 * 乗り物の種別ごとに有無を設定できます。
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
     * @param pluginName plugin name(VehicleStepAnimation)
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

    var param = createPluginParameter('VehicleStepAnimation');

    //=============================================================================
    // Game_Vehicle
    //  足踏みアニメを設定します。
    //=============================================================================
    var _Game_Vehicle_setStepAnime      = Game_Vehicle.prototype.setStepAnime;
    Game_Vehicle.prototype.setStepAnime = function(stepAnime) {
        if (this.isBoat() && param.boatStepAnimation) {
            arguments[0] = true;
        } else if (this.isShip() && param.shipStepAnimation) {
            arguments[0] = true;
        } else if (this.isAirship() && param.airStepAnimation) {
            arguments[0] = true;
        }
        _Game_Vehicle_setStepAnime.apply(this, arguments);
    };
})();

