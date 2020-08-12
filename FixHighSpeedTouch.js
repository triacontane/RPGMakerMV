/*=============================================================================
 FixHighSpeedTouch.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/05/01 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc FixHighSpeedTouchPlugin
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author triacontane
 *
 * @help FixHighSpeedTouch.js
 *
 * When the movement speed is set to a value higher than
 * the original value by a script, etc.
 * Fixed a problem where only one square can be
 * advanced by touch movement.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 高速移動時のタッチ移動修正プラグイン
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author トリアコンタン
 *
 * @help FixHighSpeedTouch.js
 *
 * スクリプト等で移動速度を本来設定可能な数値以上にしたとき
 * タッチ移動で1マスしか進めなくなる問題を解消します。
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

    var _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        this._moveStart = false;
        _Game_Player_update.apply(this, arguments);
    };

    var _Game_Player_isMoving = Game_Player.prototype.isMoving;
    Game_Player.prototype.isMoving = function(sceneActive) {
        return _Game_Player_isMoving.apply(this, arguments) || this._moveStart;
    };

    var _Game_Player_executeMove      = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function(d) {
        _Game_Player_executeMove.apply(this, arguments);
        if (this.isMoving()) {
            this._moveStart = true;
        }
    };
})();
