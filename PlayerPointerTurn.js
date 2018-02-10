//=============================================================================
// PlayerPointerTurn.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2018/02/10 PD_8DirDash.jsと連携した場合、8方向に対応する機能を追加しました。
// 1.0.0 2016/02/23 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ポインタ追跡プラグイン
 * @author トリアコンタン
 *
 * @help 移動可能な場合にプレイヤーが
 * マウスポインタの方を向きます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function() {

    var isExistPlugin = function(pluginName) {
        return PluginManager._parameters.hasOwnProperty([pluginName.toLowerCase()]);
    };

    //=============================================================================
    // Game_Player
    //  ポインタの方を向く
    //=============================================================================
    var _Game_Player_moveByInput      = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function() {
        if (!this.isMoving() && this.canMove() && TouchInput.isMoved()) {
            this.turnToPointer();
        }
        _Game_Player_moveByInput.apply(this, arguments);
    };

    Game_Player._8dirTable = [6, 9, 8, 7, 4, 1, 2, 3, 6];
    Game_Player.prototype.turnToPointer = function() {
        var tx = TouchInput.x, ty = TouchInput.y, sx = this.screenX(), sy = this.screenY();
        var dir;
        if (isExistPlugin('PD_8DirDash') && this._characterName.indexOf('Q') !== -1) {
            var degree = (Math.atan2(ty - sy, -(tx - sx)) / Math.PI + 1) / 2 * 8;
            dir        = Game_Player._8dirTable[Math.round(degree)];
        } else {
            dir = Math.abs(tx - sx) > Math.abs(ty - sy) ? (tx > sx ? 6 : 4) : (ty > sy ? 2 : 8);
        }
        this.setDirection(dir);
    };

    //=============================================================================
    // TouchInput
    //  ポインタの位置を常に記録
    //=============================================================================
    TouchInput._onMouseMove = function(event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    };
})();
