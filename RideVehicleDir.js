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
        if (Input.dir4 !== 0 && !$gameMap.airship().pos(this.x, this.y)) {
            if (this.getOnOffVehicle()) {
                return true;
            }
        }
        return _Game_Player_triggerButtonAction.apply(this, arguments);
    };
})();

