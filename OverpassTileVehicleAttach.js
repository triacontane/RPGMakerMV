/*=============================================================================
 OverpassTileVehicleAttach.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/03/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @target MZ
 * @plugindesc Overpass Plugin Vehicle Consideration Attachment
 * @author triacontane
 * @base OverpassTile
 * @orderAfter OverpassTile
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/OverpassTileVehicleAttach.js
 *
 * @help OverpassTileVehicleAttach.js
 * A vehicle consideration attachment for the official "OverpassTile.js" plugin.
 *
 * Small and large boats are only placed on the lower level, and planes are only placed on the top level.
 * Players will be unable to board vehicles from a different height.
 *
 * User Agreement:
 *  You may alter or redistribute the plugin without permission. There are no restrictions on usage format
 *  (such as adult-only use or commercial use).
 *  This plugin is now all yours.
 */

/*:ja
 * @target MZ
 * @plugindesc 立体交差プラグインの乗り物考慮アタッチメント
 * @author トリアコンタン
 * @base OverpassTile
 * @orderAfter OverpassTile
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/OverpassTileVehicleAttach.js
 *
 * @help OverpassTileVehicleAttach.js
 * 公式プラグイン「OverpassTile.js」の乗り物考慮アタッチメントです。
 *
 * 小型船、大型船は下層のみ、飛行船は上層のみに配置され
 * 高さが異なる状態からの乗船ができなくなります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    /**
     * Game_Vehicle
     */
    Game_Vehicle.prototype.updateOverPath = function() {
        Game_Character.prototype.updateOverPath.call(this);
        this._higher = this.isAirship();
    };

    const _Game_Vehicle_pos = Game_Vehicle.prototype.pos;
    Game_Vehicle.prototype.pos = function(x, y) {
        const result = _Game_Vehicle_pos.apply(this, arguments);
        if (!this.isSameHigher($gamePlayer)) {
            return false;
        }
        return result;
    };

    const _Game_Vehicle_isLandOk = Game_Vehicle.prototype.isLandOk;
    Game_Vehicle.prototype.isLandOk = function(x, y, d) {
        const advancedX = $gameMap.roundXWithDirection(x, d);
        const advancedY = $gameMap.roundYWithDirection(y, d);
        if (!this.isAirship() && this.isOnOverPath() &&
            $gameMap.isGatewayOverPath(advancedX, advancedY)) {
            return false;
        }
        return _Game_Vehicle_isLandOk.apply(this, arguments);
    };

    const _Game_Vehicle_getOff = Game_Vehicle.prototype.getOff;
    Game_Vehicle.prototype.getOff = function() {
        _Game_Vehicle_getOff.apply(this, arguments);
        if (this.isAirship()) {
            $gamePlayer.updateOverPathOnLocate();
            $gamePlayer.followers().updateOverPathOnLocate();
        }
    };

    Game_Vehicle.prototype.isHigherPriority = function() {
        return this.isAirship() ? this.isOnOverPath() : Game_Character.prototype.isHigherPriority.call(this);
    };
})();
