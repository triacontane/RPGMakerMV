/*=============================================================================
 VariableLimitation.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/12/31 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 変数の限界値設定プラグイン
 * @author トリアコンタン
 *
 * @param list
 * @text 設定リスト
 * @desc 限界値を設定したい変数の一覧です。同一の変数を複数指定することはできません。
 * @default []
 * @type struct<Limitation>[]
 *
 * @help VariableLimitation.js
 *
 * 変数に限界値（最小値と最大値）を設定できます。
 * 指定すると変数値が、最小値より小さい値あるいは最大値より大きい値に
 * 設定されなくなります。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~Limitation:
 * @param variableId
 * @text 変数番号
 * @desc 最小値、最大値を設定したい変数の番号です。
 * @type variable
 * @default 1
 *
 * @param min
 * @text 最小値
 * @desc 最小値です。
 * @type number
 * @default 0
 * @min -9999999999
 *
 * @param max
 * @text 最大値
 * @desc 最大値です。
 * @type number
 * @default 0
 * @min -9999999999
 *
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
    var param = createPluginParameter('VariableLimitation');
    if (!Array.isArray(param.list)) {
        console.warn('Parameter invalid by VariableLimitation');
        return;
    }
    var variableMap = new Map();
    param.list.forEach(function(item) {
        variableMap.set(item.variableId, item);
    });

    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.apply(this, arguments);
        $gameVariables.applyLimitations();
    };

    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.apply(this, arguments);
        $gameVariables.applyLimitations();
    };

    Game_Variables.prototype.applyLimitations = function() {
        param.list.forEach(function(item) {
            this.setValue(item.variableId, this.value(item.variableId));
        }, this);
    };

    var _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value) {
        if (variableMap.has(variableId) && !isNaN(value)) {
            var item = variableMap.get(variableId);
            arguments[1] = value.clamp(item.min, item.max);
        }
        _Game_Variables_setValue.apply(this, arguments);
    };
})();
