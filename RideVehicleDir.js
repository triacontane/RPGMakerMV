//=============================================================================
// RideVehicleDir.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/03/05 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 方向キーの乗り物昇降プラグイン
 * @author トリアコンタン
 *
 * @help 方向キーの入力で乗り物の昇降を行います。
 * 対象は「小型船」と「大型船」です。
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

    var _Game_Player_triggerButtonAction = Game_Player.prototype.triggerButtonAction;
    Game_Player.prototype.triggerButtonAction = function() {
        if (Input.dir4 === this.direction()) {
            if (this.getOnOffShip()) {
                return true;
            }
        }
        return _Game_Player_triggerButtonAction.apply(this, arguments);
    };

    Game_Player.prototype.getOnOffShip = function() {
        if (this.isInAirship()) return false;
        if (this.isInVehicle()) {
            return this.getOffVehicle();
        } else {
            return this.getOnShip();
        }
    };

    Game_Player.prototype.getOnShip = function() {
        var direction = this.direction();
        var x1 = $gameMap.roundXWithDirection(this.x, direction);
        var y1 = $gameMap.roundYWithDirection(this.y, direction);
        if ($gameMap.ship().pos(x1, y1)) {
            this._vehicleType = 'ship';
        } else if ($gameMap.boat().pos(x1, y1)) {
            this._vehicleType = 'boat';
        }
        if (this.isInVehicle()) {
            this._vehicleGettingOn = true;
            if (!this.isInAirship()) {
                this.forceMoveForward();
            }
            this.gatherFollowers();
        }
        return this._vehicleGettingOn;
    };
})();

