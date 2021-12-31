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
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/VariableLimitation.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
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
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!Array.isArray(param.list)) {
        PluginManagerEx.throwError('Parameter invalid', script);
        return;
    }
    
    const variableMap = new Map();
    param.list.forEach(function(item) {
        variableMap.set(item.variableId, item);
    });

    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.apply(this, arguments);
        $gameVariables.applyLimitations();
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.apply(this, arguments);
        $gameVariables.applyLimitations();
    };

    Game_Variables.prototype.applyLimitations = function() {
        param.list.forEach(function(item) {
            this.setValue(item.variableId, this.value(item.variableId));
        }, this);
    };

    const _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value) {
        if (variableMap.has(variableId) && !isNaN(value)) {
            const item = variableMap.get(variableId);
            arguments[1] = value.clamp(item.min, item.max);
        }
        _Game_Variables_setValue.apply(this, arguments);
    };
})();
