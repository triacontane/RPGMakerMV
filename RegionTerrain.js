//=============================================================================
// RegionTerrain.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/01/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Region set terrain attribute
 * @author triacontane
 *
 * @param LadderRegionId
 * @desc Region ID of ladder attribute
 * @default 0
 *
 * @param BushRegionId
 * @desc Region ID of bush attribute
 * @default 0
 *
 * @param CounterRegionId
 * @desc Region ID of counter attribute
 * @default 0
 *
 * @param DamageFloorRegionId
 * @desc Region ID of damage floor attribute
 * @default 0
 *
 * @help Region set terrain attribute
 * Ladder, Bush, Counter, DamageFloor
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc リージョンにタイル属性を付与するプラグイン
 * @author トリアコンタン
 *
 * @param 梯子リージョンID
 * @desc 梯子属性を付与するリージョンID
 * @default 0
 *
 * @param 茂みリージョンID
 * @desc 茂み属性を付与するリージョンID
 * @default 0
 *
 * @param カウンターリージョンID
 * @desc カウンター属性を付与するリージョンID
 * @default 0
 *
 * @param ダメージ床リージョンID
 * @desc ダメージ床属性を付与するリージョンID
 * @default 0
 *
 * @help 指定したリージョンにタイル属性を付与します。
 * 梯子、茂み、カウンター、ダメージ床
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
    var pluginName = 'RegionTerrain';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var _Game_Map_isLadder = Game_Map.prototype.isLadder;
    Game_Map.prototype.isLadder = function(x, y) {
        return _Game_Map_isLadder.apply(this, arguments) || (this.isValid(x, y) && this.regionId(x, y) ===
            (getParamNumber(['梯子リージョンID', 'LadderRegionId']) || -1));
    };

    var _Game_Map_isBush = Game_Map.prototype.isBush;
    Game_Map.prototype.isBush = function(x, y) {
        return _Game_Map_isBush.apply(this, arguments) || (this.isValid(x, y) && this.regionId(x, y) ===
            (getParamNumber(['茂みリージョンID', 'BushRegionId']) || -1));
    };

    var _Game_Map_isCounter = Game_Map.prototype.isCounter;
    Game_Map.prototype.isCounter = function(x, y) {
        return _Game_Map_isCounter.apply(this, arguments) || (this.isValid(x, y) && this.regionId(x, y) ===
            (getParamNumber(['カウンターリージョンID', 'CounterRegionId']) || -1));
    };

    var _Game_Map_isDamageFloor = Game_Map.prototype.isDamageFloor;
    Game_Map.prototype.isDamageFloor = function(x, y) {
        return _Game_Map_isDamageFloor.apply(this, arguments) || (this.isValid(x, y) && this.regionId(x, y) ===
            (getParamNumber(['ダメージ床リージョンID', 'DamageFloorRegionId']) || -1));
    };
})();

