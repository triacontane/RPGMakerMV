//=============================================================================
// PlayerPointerTurn.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.0 2021/08/26 プラグインの機能を一時無効化するスイッチを追加
// 1.3.0 2021/06/20 MZで動作するよう修正
// 1.2.0 2021/06/20 移動中も常にポインタの方を向く機能を追加
// 1.1.0 2018/02/10 PD_8DirDash.jsと連携した場合、8方向に対応する機能を追加しました。
// 1.0.0 2016/02/23 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ポインタ追跡プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PlayerPointerTurn.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param validMoving
 * @text 移動中も有効
 * @desc 移動中も常にポインタの方を向きます。
 * @default false
 * @type boolean
 *
 * @param invalidSwitch
 * @text 無効スイッチ
 * @desc 指定したスイッチがONのときプラグインの機能が無効になります。
 * @default 0
 * @type switch
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
(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Player
    //  ポインタの方を向く
    //=============================================================================
    const _Game_Player_moveByInput      = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function() {
        if (!this.isMoving() && this.canMove() && TouchInput.isHovered()) {
            this.turnToPointer();
        }
        _Game_Player_moveByInput.apply(this, arguments);
    };

    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.apply(this, arguments);
        if (param.validMoving) {
            this.turnToPointer();
        }
    };

    Game_Player.prototype.turnToPointer = function() {
        if ($gameSwitches.value(param.invalidSwitch)) {
            return;
        }
        const tx = TouchInput.x, ty = TouchInput.y, sx = this.screenX(), sy = this.screenY();
        const dir = Math.abs(tx - sx) > Math.abs(ty - sy) ? (tx > sx ? 6 : 4) : (ty > sy ? 2 : 8);
        this.setDirection(dir);
    };
})();
