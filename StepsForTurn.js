/*=============================================================================
 StepsForTurn.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2023/07/27 ターン経過歩数を変数で指定できる機能を追加
 1.0.0 2021/05/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ターン経過歩数変更プラグイン
 * @author トリアコンタン
 *
 * @param turn
 * @text ターン経過歩数
 * @desc 1ターン経過歩数です。
 * @default 20
 * @type number
 * @min 1
 *
 * @param turnVariable
 * @text ターン経過歩数変数
 * @desc 1ターン経過歩数を格納する変数番号です。指定した場合、直接指定より優先されます。
 * @default 0
 * @type variable
 *
 * @help StepsForTurn.js
 *
 * 1ターン経過と認識される歩数(通常20歩)を変更できます。
 * 主にステートによるスリップダメージの頻度が変わります。
 * パラメータから調整してください。
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

    var param = createPluginParameter('StepsForTurn');

    var _Game_Actor_stepsForTurn = Game_Actor.prototype.stepsForTurn;
    Game_Actor.prototype.stepsForTurn = function() {
        const originalTurn = _Game_Actor_stepsForTurn.apply(this, arguments);
        return this.findStepsForTurnCustom() || originalTurn;
    };

    Game_Actor.prototype.findStepsForTurnCustom = function() {
        if (param.turnVariable > 0) {
            return $gameVariables.value(param.turnVariable);
        } else {
            return param.turn;
        }
    };
})();
