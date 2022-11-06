//=============================================================================
// VehiclePassable.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.0 2022/11/06 小型船および大型船を通行可能にできる設定を追加
// 1.3.0 2022/05/17 MZで動作するよう修正
// 1.2.0 2016/07/31 乗降可能な地形タグ、リージョンを設定できる機能を追加
// 1.1.0 2016/07/09 飛行船の通行不可、通行可能に対応
// 1.0.0 2016/06/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 乗り物通行判定拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/VehiclePassable.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param BoatPassableRegions
 * @text 小型船通行リージョン
 * @desc 小型船で通行可能になるリージョンです。
 * @default []
 * @type number[]
 *
 * @param BoatPassableTerrainTags
 * @text 小型船通行地形タグ
 * @desc 小型船で通行可能になる地形タグです。
 * @default []
 * @type number[]
 *
 * @param BoatNonPassableRegions
 * @text 小型船不可リージョン
 * @desc 小型船で通行不可になるリージョンです。
 * @default []
 * @type number[]
 *
 * @param BoatNonPassableTerrainTags
 * @text 小型船不可地形タグ
 * @desc 小型船で通行不可になる地形タグです。
 * @default []
 * @type number[]
 *
 * @param BoatRidingTerrainTags
 * @text 小型船乗降地形タグ
 * @desc 小型船で乗降可能になる地形タグです。未入力にするとどこでも乗降可能になります。
 * @default []
 * @type number[]
 *
 * @param BoatRidingRegions
 * @text 小型船乗降リージョン
 * @desc 小型船で乗降可能になるリージョンです。未入力にするとどこでも乗降可能になります。
 * @default []
 * @type number[]
 *
 * @param ShipPassableRegions
 * @text 大型船通行リージョン
 * @desc 大型船で通行可能になるリージョンです。
 * @default []
 * @type number[]
 *
 * @param ShipPassableTerrainTags
 * @text 大型船通行地形タグ
 * @desc 大型船で通行可能になる地形タグです。
 * @default []
 * @type number[]
 *
 * @param ShipNonPassableRegions
 * @text 大型船不可リージョン
 * @desc 大型船で通行不可になるリージョンです。
 * @default []
 * @type number[]
 *
 * @param ShipNonPassableTerrainTags
 * @text 大型船不可地形タグ
 * @desc 大型船で通行不可になる地形タグです。
 * @default []
 * @type number[]
 *
 * @param ShipRidingTerrainTags
 * @text 大型船乗降地形タグ
 * @desc 大型船で乗降可能になる地形タグです。未入力にするとどこでも乗降可能になります。
 * @default []
 * @type number[]
 *
 * @param ShipRidingRegions
 * @text 大型船乗降リージョン
 * @desc 大型船で乗降可能になるリージョンです。未入力にするとどこでも乗降可能になります。
 * @default []
 * @type number[]
 *
 * @param AirShipNonPassableRegions
 * @text 飛行船不可リージョン
 * @desc 飛行船で通行不可になるリージョンです。
 * @default []
 * @type number[]
 *
 * @param AirShipNonPassableTerrainTags
 * @text 飛行船不可地形タグ
 * @desc 飛行船で通行不可になる地形タグです。
 * @default []
 * @type number[]
 *
 * @param AirShipRidingTerrainTags
 * @text 飛行船乗降地形タグ
 * @desc 飛行船で乗降可能になる地形タグです。未入力にするとどこでも乗降可能になります。
 * @default []
 * @type number[]
 *
 * @param AirShipRidingRegions
 * @text 飛行船乗降リージョン
 * @desc 飛行船で乗降可能になるリージョンです。未入力にするとどこでも乗降可能になります。
 * @default []
 * @type number[]
 *
 * @param ShipPassable
 * @text 船を通行可能にする
 * @desc 小型船および大型船のうえを通行可能にします。
 * @default false
 * @type boolean
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_CharacterBase
    //  飛行専用の通行可能判定を事前に定義します。
    //=============================================================================
    const _Game_CharacterBase_canPass      = Game_CharacterBase.prototype.canPass;
    Game_CharacterBase.prototype.canPass = function(x, y, d) {
        if (this instanceof Game_Player && this.isInAirship()) {
            const x2 = $gameMap.roundXWithDirection(this.x, d);
            const y2 = $gameMap.roundYWithDirection(this.y, d);
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
    const _Game_Map_isBoatPassable      = Game_Map.prototype.isBoatPassable;
    Game_Map.prototype.isBoatPassable = function(x, y) {
        const result            = _Game_Map_isBoatPassable.apply(this, arguments);
        const resultRegion      = this.isBoatPassableRegion(x, y);
        const resultTerrainTags = this.isBoatPassableTerrainTags(x, y);
        if (resultRegion !== null) {
            return resultRegion;
        } else if (resultTerrainTags !== null) {
            return resultTerrainTags;
        }
        return result;
    };

    Game_Map.prototype.isBoatPassableRegion = function(x, y) {
        const regionId = this.regionId(x, y);
        if (regionId === 0) return null;
        if (param.BoatPassableRegions.contains(regionId)) {
            return true;
        } else if (param.BoatNonPassableRegions.contains(regionId)) {
            return false;
        }
        return null;
    };

    Game_Map.prototype.isBoatPassableTerrainTags = function(x, y) {
        const terrainTag = this.terrainTag(x, y);
        if (terrainTag === 0) return null;
        if (param.BoatPassableTerrainTags.contains(terrainTag)) {
            return true;
        } else if (param.BoatNonPassableTerrainTags.contains(terrainTag)) {
            return false;
        }
        return null;
    };

    const _Game_Map_isShipPassable      = Game_Map.prototype.isShipPassable;
    Game_Map.prototype.isShipPassable = function(x, y) {
        const result            = _Game_Map_isShipPassable.apply(this, arguments);
        const resultRegion      = this.isShipPassableRegion(x, y);
        const resultTerrainTags = this.isShipPassableTerrainTags(x, y);
        if (resultRegion !== null) {
            return resultRegion;
        } else if (resultTerrainTags !== null) {
            return resultTerrainTags;
        }
        return result;
    };

    Game_Map.prototype.isShipPassableRegion = function(x, y) {
        const regionId = this.regionId(x, y);
        if (regionId === 0) return null;
        if (param.ShipPassableRegions.contains(regionId)) {
            return true;
        } else if (param.ShipNonPassableRegions.contains(regionId)) {
            return false;
        }
        return null;
    };

    Game_Map.prototype.isShipPassableTerrainTags = function(x, y) {
        const terrainTag = this.terrainTag(x, y);
        if (terrainTag === 0) return null;
        if (param.ShipPassableTerrainTags.contains(terrainTag)) {
            return true;
        } else if (param.ShipNonPassableTerrainTags.contains(terrainTag)) {
            return false;
        }
        return null;
    };

    Game_Map.prototype.isAirShipPassable = function(x, y) {
        const resultRegion      = this.isAirShipPassableRegion(x, y);
        const resultTerrainTags = this.isAirShipPassableTerrainTags(x, y);
        if (resultRegion !== null) {
            return resultRegion;
        } else if (resultTerrainTags !== null) {
            return resultTerrainTags;
        }
        return true;
    };

    Game_Map.prototype.isAirShipPassableRegion = function(x, y) {
        const regionId = this.regionId(x, y);
        if (regionId === 0) return null;
        if (param.AirShipNonPassableRegions.contains(regionId)) {
            return false;
        }
        return null;
    };

    Game_Map.prototype.isAirShipPassableTerrainTags = function(x, y) {
        const terrainTag = this.terrainTag(x, y);
        if (terrainTag === 0) return null;
        if (param.AirShipNonPassableTerrainTags.contains(terrainTag)) {
            return false;
        }
        return null;
    };

    const _Game_Map_isAirshipLandOk = Game_Map.prototype.isAirshipLandOk;
    Game_Map.prototype.isAirshipLandOk = function(x, y) {
        if (param.AirShipRidingRegions.length > 0 || param.AirShipRidingTerrainTags.length > 0) {
            return true;
        } else {
            return _Game_Map_isAirshipLandOk.apply(this, arguments);
        }
    };

    const _Game_CharacterBase_isCollidedWithVehicles = Game_CharacterBase.prototype.isCollidedWithVehicles;
    Game_CharacterBase.prototype.isCollidedWithVehicles = function(x, y) {
        const result = _Game_CharacterBase_isCollidedWithVehicles.apply(this, arguments);
        if (param.ShipPassable && this === $gamePlayer) {
            return false;
        }
        return result;
    };

    const _Game_Player_getOnVehicle = Game_Player.prototype.getOnVehicle;
    Game_Player.prototype.getOnVehicle = function() {
        if (param.ShipPassable) {
            if ($gameMap.ship().pos(this.x, this.y)) {
                this._vehicleType = "ship";
                this._samePositionInVehicle = true;
            } else if ($gameMap.boat().pos(this.x, this.y)) {
                this._vehicleType = "boat";
                this._samePositionInVehicle = true;
            }
        }
        return _Game_Player_getOnVehicle.apply(this, arguments);
    };

    const _Game_Player_forceMoveForward = Game_Player.prototype.forceMoveForward;
    Game_Player.prototype.forceMoveForward = function() {
        if (this._samePositionInVehicle) {
            this._samePositionInVehicle = false;
            return;
        }
        _Game_Player_forceMoveForward.apply(this, arguments);
    };

    //=============================================================================
    // Game_Vehicle
    //  乗降可能な地形タグおよびリージョンを制限します。
    //=============================================================================
    const _Game_Vehicle_isLandOk      = Game_Vehicle.prototype.isLandOk;
    Game_Vehicle.prototype.isLandOk = function(x, y, d) {
        let result = _Game_Vehicle_isLandOk.apply(this, arguments);
        if (result) {
            let x2, y2, terrainTags, regionIds;
            if (this.isBoat()) {
                x2          = $gameMap.roundXWithDirection(x, d);
                y2          = $gameMap.roundYWithDirection(y, d);
                terrainTags = param.BoatRidingTerrainTags;
                regionIds   = param.BoatRidingRegions;
            } else if (this.isShip()) {
                x2          = $gameMap.roundXWithDirection(x, d);
                y2          = $gameMap.roundYWithDirection(y, d);
                terrainTags = param.ShipRidingTerrainTags;
                regionIds   = param.ShipRidingRegions;
            } else if (this.isAirship()) {
                x2          = x;
                y2          = y;
                terrainTags = param.AirShipRidingTerrainTags;
                regionIds   = param.AirShipRidingRegions;
            } else {
                return true;
            }
            result = this.isLandOkTerrainTagAndRegion(x2, y2, terrainTags, regionIds);
        }
        return result;
    };

    Game_Vehicle.prototype.isLandOkTerrainTagAndRegion = function(x, y, terrainTags, regionIds) {
        let result = null;
        if (terrainTags.length > 0) {
            result = terrainTags.contains($gameMap.terrainTag(x, y));
        }
        if (regionIds.length > 0) {
            result = result || regionIds.contains($gameMap.regionId(x, y));
        }
        return result !== null ? result : true;
    };

    const _Game_Vehicle_refresh = Game_Vehicle.prototype.refresh;
    Game_Vehicle.prototype.refresh = function() {
        _Game_Vehicle_refresh.apply(this, arguments);
        if (!this.isAirship() && param.ShipPassable) {
            this.setPriorityType(this._driving ? 1 : 0);
        }
    };
})();

