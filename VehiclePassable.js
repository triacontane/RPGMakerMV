//=============================================================================
// VehiclePassable.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/06/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 乗り物通行判定拡張プラグイン
 * @author トリアコンタン
 *
 * @param 小型船通行リージョン
 * @desc 小型船で通行可能になるリージョンです。カンマ(,)区切りで指定してください。例「1,2,3」
 * @default 1,2,3
 *
 * @param 小型船通行地形タグ
 * @desc 小型船で通行可能になる地形タグです。カンマ(,)区切りで指定してください。例「1,2,3」
 * @default 1,2,3
 *
 * @param 小型船不可リージョン
 * @desc 小型船で通行不可になるリージョンです。カンマ(,)区切りで指定してください。例「1,2,3」
 * @default 4,5,6
 *
 * @param 小型船不可地形タグ
 * @desc 小型船で通行不可になる地形タグです。カンマ(,)区切りで指定してください。例「1,2,3」
 * @default 4,5,6
 *
 * @param 大型船通行リージョン
 * @desc 大型船で通行可能になるリージョンです。カンマ(,)区切りで指定してください。例「1,2,3」
 * @default 1,2,3
 *
 * @param 大型船通行地形タグ
 * @desc 大型船で通行可能になる地形タグです。カンマ(,)区切りで指定してください。例「1,2,3」
 * @default 1,2,3
 *
 * @param 大型船不可リージョン
 * @desc 大型船で通行不可になるリージョンです。カンマ(,)区切りで指定してください。例「1,2,3」
 * @default 4,5,6
 *
 * @param 大型船不可地形タグ
 * @desc 大型船で通行不可になる地形タグです。カンマ(,)区切りで指定してください。例「1,2,3」
 * @default 4,5,6
 *
 * @help 乗り物の通行判定を拡張します。
 * リージョンおよび地形タグを設定して柔軟な通行可能設定が可能です。
 *
 * 優先度はリージョン > 地形タグとなります。
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
    var pluginName    = 'VehiclePassable';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamArrayString = function(paramNames) {
        var values = getParamString(paramNames).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
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
    var paramBoatPassableRegions           = getParamArrayNumber(['BoatPassableRegions', '小型船通行リージョン'], 0);
    var paramBoatPassableTerrainTags       = getParamArrayNumber(['BoatPassableTerrainTags', '小型船通行地形タグ'], 0);
    var paramBoatNonPassableRegions        = getParamArrayNumber(['BoatNonPassableRegions', '小型船不可リージョン'], 0);
    var paramBoatNonPassableTerrainTags    = getParamArrayNumber(['BoatNonPassableTerrainTags', '小型船不可地形タグ'], 0);
    var paramShipPassableRegions           = getParamArrayNumber(['ShipPassableRegions', '大型船通行リージョン'], 0);
    var paramShipPassableTerrainTags       = getParamArrayNumber(['ShipPassableTerrainTags', '大型船通行地形タグ'], 0);
    var paramShipNonPassableRegions        = getParamArrayNumber(['ShipNonPassableRegions', '大型船不可リージョン'], 0);
    var paramShipNonPassableTerrainTags    = getParamArrayNumber(['ShipNonPassableTerrainTags', '大型船不可地形タグ'], 0);
    var paramAirShipNonPassableRegions     = getParamArrayNumber(['AirShipNonPassableRegions', '飛行船不可リージョン'], 0);
    var paramAirShipNonPassableTerrainTags = getParamArrayNumber(['AirShipNonPassableTerrainTags', '飛行船不可地形タグ'], 0);

    var _Game_Map_isBoatPassable      = Game_Map.prototype.isBoatPassable;
    Game_Map.prototype.isBoatPassable = function(x, y) {
        var result       = _Game_Map_isBoatPassable.apply(this, arguments);
        var resultRegion = this.isBoatPassableRegion(x, y);
        var resultTerrainTags = this.isBoatPassableTerrainTags(x, y);
        if (resultRegion !== null) {
            return resultRegion;
        } else if (resultTerrainTags !== null) {
            return resultTerrainTags;
        }
        return result;
    };

    Game_Map.prototype.isBoatPassableRegion = function(x, y) {
        var regionId = this.regionId(x, y);
        if (regionId === 0) return null;
        if (paramBoatPassableRegions.contains(regionId)) {
            return true;
        } else if (paramBoatNonPassableRegions.contains(regionId)) {
            return false;
        }
        return null;
    };

    Game_Map.prototype.isBoatPassableTerrainTags = function(x, y) {
        var terrainTags = this.terrainTag(x, y);
        if (terrainTags === 0) return null;
        if (paramBoatPassableTerrainTags.contains(terrainTags)) {
            return true;
        } else if (paramBoatNonPassableTerrainTags.contains(terrainTags)) {
            return false;
        }
        return null;
    };

    var _Game_Map_isShipPassable      = Game_Map.prototype.isShipPassable;
    Game_Map.prototype.isShipPassable = function(x, y) {
        var result = _Game_Map_isShipPassable.apply(this, arguments);
        var resultRegion = this.isShipPassableRegion(x, y);
        var resultTerrainTags = this.isShipPassableTerrainTags(x, y);
        if (resultRegion !== null) {
            return resultRegion;
        } else if (resultTerrainTags !== null) {
            return resultTerrainTags;
        }
        return result;
    };

    Game_Map.prototype.isShipPassableRegion = function(x, y) {
        var regionId = this.regionId(x, y);
        if (regionId === 0) return null;
        if (paramShipPassableRegions.contains(regionId)) {
            return true;
        } else if (paramShipNonPassableRegions.contains(regionId)) {
            return false;
        }
        return null;
    };

    Game_Map.prototype.isShipPassableTerrainTags = function(x, y) {
        var terrainTags = this.terrainTag(x, y);
        if (terrainTags === 0) return null;
        if (paramShipPassableTerrainTags.contains(terrainTags)) {
            return true;
        } else if (paramShipNonPassableTerrainTags.contains(terrainTags)) {
            return false;
        }
        return null;
    };

    Game_Map.prototype.isAirShipPassable = function(x, y) {
        var resultRegion = this.isAirShipPassableRegion(x, y);
        var resultTerrainTags = this.isAirShipPassableTerrainTags(x, y);
        if (resultRegion !== null) {
            return resultRegion;
        } else if (resultTerrainTags !== null) {
            return resultTerrainTags;
        }
        return true;
    };

    Game_Map.prototype.isAirShipPassableRegion = function(x, y) {
        var regionId = this.regionId(x, y);
        if (regionId === 0) return null;
        if (paramAirShipNonPassableRegions.contains(regionId)) {
            return false;
        }
        return null;
    };

    Game_Map.prototype.isAirShipPassableTerrainTags = function(x, y) {
        var terrainTags = this.terrainTag(x, y);
        if (terrainTags === 0) return null;
        if (paramAirShipNonPassableTerrainTags.contains(terrainTags)) {
            return false;
        }
        return null;
    };
})();

