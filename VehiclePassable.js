//=============================================================================
// VehiclePassable.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2016/07/31 乗降可能な地形タグ、リージョンを設定できる機能を追加
// 1.1.0 2016/07/09 飛行船の通行不可、通行可能に対応
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
 * @param 小型船乗降地形タグ
 * @desc 小型船で乗降可能になる地形タグです。未入力にするとどこでも乗降可能になります。
 * @default
 *
 * @param 小型船乗降リージョン
 * @desc 小型船で乗降可能になるリージョンです。未入力にするとどこでも乗降可能になります。
 * @default
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
 * @param 大型船乗降地形タグ
 * @desc 大型船で乗降可能になる地形タグです。未入力にするとどこでも乗降可能になります。
 * @default
 *
 * @param 大型船乗降リージョン
 * @desc 大型船で乗降可能になるリージョンです。未入力にするとどこでも乗降可能になります。
 * @default
 *
 * @param 飛行船不可リージョン
 * @desc 飛行船で通行不可になるリージョンです。カンマ(,)区切りで指定してください。例「1,2,3」
 * @default 4,5,6
 *
 * @param 飛行船不可地形タグ
 * @desc 飛行船で通行不可になる地形タグです。カンマ(,)区切りで指定してください。例「1,2,3」
 * @default 4,5,6
 *
 * @param 飛行船乗降地形タグ
 * @desc 飛行船で乗降可能になる地形タグです。未入力にするとどこでも乗降可能になります。
 * @default
 *
 * @param 飛行船乗降リージョン
 * @desc 飛行船で乗降可能になるリージョンです。未入力にするとどこでも乗降可能になります。
 * @default
 *
 * @help 乗り物の通行判定を拡張します。
 * リージョンおよび地形タグを設定して柔軟な通行可能設定が可能です。
 *
 * 優先度はリージョン > 地形タグとなります。
 *
 * また、乗降可能な地形タグおよびリージョンを設定することができます。
 * たとえば小型船や大型船で桟橋のみ乗降可能にしたり、特定の発着場のみ
 * 飛行船の離着陸が可能にできます。
 *
 * ※実際には降船時のみ判定しています。
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
    var pluginName = 'VehiclePassable';

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
    var paramBoatRidingTerrainTags         = getParamArrayNumber(['BoatRidingTerrainTags', '小型船乗降地形タグ'], 0);
    var paramBoatRidingRegions             = getParamArrayNumber(['BoatRidingRegions', '小型船乗降リージョン'], 0);
    var paramShipRidingTerrainTags         = getParamArrayNumber(['ShipRidingTerrainTags', '大型船乗降地形タグ'], 0);
    var paramShipRidingRegions             = getParamArrayNumber(['ShipRidingRegions', '大型船乗降リージョン'], 0);
    var paramAirShipRidingTerrainTags      = getParamArrayNumber(['AirShipRidingTerrainTags', '飛行船乗降地形タグ'], 0);
    var paramAirShipRidingRegions          = getParamArrayNumber(['AirShipRidingRegions', '飛行船乗降リージョン'], 0);

    //=============================================================================
    // Game_CharacterBase
    //  飛行専用の通行可能判定を事前に定義します。
    //=============================================================================
    var _Game_CharacterBase_canPass      = Game_CharacterBase.prototype.canPass;
    Game_CharacterBase.prototype.canPass = function(x, y, d) {
        if (this instanceof Game_Player && this.isInAirship()) {
            var x2 = $gameMap.roundXWithDirection(this.x, d);
            var y2 = $gameMap.roundYWithDirection(this.y, d);
            if (!$gameMap.isAirShipPassable(x2, y2) && !this.isDebugThrough()) {
                return false;
            }
        }
        return _Game_CharacterBase_canPass.apply(this, arguments);
    };

    //=============================================================================
    // Game_Map
    //  乗り物用の通行可能判定を独自に定義します。
    //=============================================================================
    var _Game_Map_isBoatPassable      = Game_Map.prototype.isBoatPassable;
    Game_Map.prototype.isBoatPassable = function(x, y) {
        var result            = _Game_Map_isBoatPassable.apply(this, arguments);
        var resultRegion      = this.isBoatPassableRegion(x, y);
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
        var terrainTag = this.terrainTag(x, y);
        if (terrainTag === 0) return null;
        if (paramBoatPassableTerrainTags.contains(terrainTag)) {
            return true;
        } else if (paramBoatNonPassableTerrainTags.contains(terrainTag)) {
            return false;
        }
        return null;
    };

    var _Game_Map_isShipPassable      = Game_Map.prototype.isShipPassable;
    Game_Map.prototype.isShipPassable = function(x, y) {
        var result            = _Game_Map_isShipPassable.apply(this, arguments);
        var resultRegion      = this.isShipPassableRegion(x, y);
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
        var terrainTag = this.terrainTag(x, y);
        if (terrainTag === 0) return null;
        if (paramShipPassableTerrainTags.contains(terrainTag)) {
            return true;
        } else if (paramShipNonPassableTerrainTags.contains(terrainTag)) {
            return false;
        }
        return null;
    };

    Game_Map.prototype.isAirShipPassable = function(x, y) {
        var resultRegion      = this.isAirShipPassableRegion(x, y);
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
        var terrainTag = this.terrainTag(x, y);
        if (terrainTag === 0) return null;
        if (paramAirShipNonPassableTerrainTags.contains(terrainTag)) {
            return false;
        }
        return null;
    };

    var _Game_Map_isAirshipLandOk = Game_Map.prototype.isAirshipLandOk;
    Game_Map.prototype.isAirshipLandOk = function(x, y) {
        if (paramAirShipRidingRegions.length > 0 || paramAirShipRidingTerrainTags.length > 0) {
            return true;
        } else {
            return _Game_Map_isAirshipLandOk.apply(this, arguments);
        }
    };

    //=============================================================================
    // Game_Vehicle
    //  乗降可能な地形タグおよびリージョンを制限します。
    //=============================================================================
    var _Game_Vehicle_isLandOk      = Game_Vehicle.prototype.isLandOk;
    Game_Vehicle.prototype.isLandOk = function(x, y, d) {
        var result = _Game_Vehicle_isLandOk.apply(this, arguments);
        if (result) {
            var x2, y2, terrainTags, regionIds;
            if (this.isBoat()) {
                x2          = $gameMap.roundXWithDirection(x, d);
                y2          = $gameMap.roundYWithDirection(y, d);
                terrainTags = paramBoatRidingTerrainTags;
                regionIds   = paramBoatRidingRegions;
            } else if (this.isShip()) {
                x2          = $gameMap.roundXWithDirection(x, d);
                y2          = $gameMap.roundYWithDirection(y, d);
                terrainTags = paramShipRidingTerrainTags;
                regionIds   = paramShipRidingRegions;
            } else if (this.isAirship()) {
                x2          = x;
                y2          = y;
                terrainTags = paramAirShipRidingTerrainTags;
                regionIds   = paramAirShipRidingRegions;
            } else {
                return true;
            }
            result = this.isLandOkTerrainTagAndRegion(x2, y2, terrainTags, regionIds);
        }
        return result;
    };

    Game_Vehicle.prototype.isLandOkTerrainTagAndRegion = function(x, y, terrainTags, regionIds) {
        var result = null;
        if (terrainTags.length > 0) {
            result = result || terrainTags.contains($gameMap.terrainTag(x, y));
        }
        if (regionIds.length > 0) {
            result = result || regionIds.contains($gameMap.regionId(x, y));
        }
        return result !== null ? result : true;
    };
})();

