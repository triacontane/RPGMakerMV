/*=============================================================================
 MapCenterShift.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2024/10/22 マップの端に場所移動したとき、スクロール位置がおかしい場合がある問題を修正
 1.0.0 2024/04/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc マップ中央座標シフトプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MapCenterShift.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param shiftX
 * @text シフトX座標
 * @desc マップの中央座標を指定したタイルだけ横にシフトします。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param shiftY
 * @text シフトY座標
 * @desc マップの中央座標を指定したタイルだけ縦にシフトします。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param considerEdge
 * @text マップ端へのスクロール考慮
 * @desc マップの端に到達した際にシフトしたタイルだけ余分にスクロールします。
 * @default true
 * @type boolean
 *
 * @param
 *
 * @help MapCenterShift.js
 *
 * マップ画面においてプレイヤーの表示位置の基準となる
 * センター座標をずらすことができます。
 *
 * マップ外に立ち絵やHUDなどを表示する場合に便利です。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    const shiftX = (param.shiftX || 0);
    const shiftY = (param.shiftY || 0);

    const _Game_Player_centerX = Game_Player.prototype.centerX;
    Game_Player.prototype.centerX = function() {
        return _Game_Player_centerX.apply(this, arguments) + shiftX;
    };

    const _Game_Player_centerY = Game_Player.prototype.centerY;
    Game_Player.prototype.centerY = function() {
        return _Game_Player_centerY.apply(this, arguments) + shiftY;
    };

    if (!param.considerEdge) {
        return;
    }

    const _Game_Map_setDisplayPos = Game_Map.prototype.setDisplayPos;
    Game_Map.prototype.setDisplayPos = function(x, y) {
        _Game_Map_setDisplayPos.apply(this, arguments);
        if (!this.isLoopHorizontal()) {
            const sx = shiftX;
            const endX = this.width() - this.screenTileX();
            if (sx > 0) {
                this._displayX = endX < 0 ? endX / 2 : x.clamp(-sx * 2, endX);
            } else if (sx < 0) {
                this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX - sx * 2);
            }
            this._parallaxX = this._displayX;
        }
        if (!this.isLoopVertical()) {
            const sy = shiftY;
            const endY = this.height() - this.screenTileY() - sy;
            if (sy > 0) {
                this._displayY = endY < 0 ? endY / 2 : y.clamp(-sy * 2, endY);
            } else if (sy < 0) {
                this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY - sy * 2);
            }
            this._parallaxY = this._displayY;
        }
    };

    const _Game_Map_scrollLeft = Game_Map.prototype.scrollLeft;
    Game_Map.prototype.scrollLeft = function(distance) {
        if (!this.isLoopHorizontal() && this.width() >= this.screenTileX() && shiftX > 0) {
            const lastX = this._displayX;
            this._displayX = Math.max(this._displayX - distance, -shiftX * 2);
            this._parallaxX += this._displayX - lastX;
        } else {
            _Game_Map_scrollLeft.apply(this, arguments);
        }
    };

    const _Game_Map_scrollRight = Game_Map.prototype.scrollRight;
    Game_Map.prototype.scrollRight = function(distance) {
        if (!this.isLoopHorizontal() && this.width() >= this.screenTileX() && shiftX < 0) {
            const lastX = this._displayX;
            this._displayX = Math.min(this._displayX + distance, this.width() - this.screenTileX() - shiftX * 2);
            this._parallaxX += this._displayX - lastX;
        } else {
            _Game_Map_scrollRight.apply(this, arguments);
        }
    };

    const _Game_Map_scrollUp = Game_Map.prototype.scrollUp;
    Game_Map.prototype.scrollUp = function(distance) {
        if (!this.isLoopVertical() && this.height() >= this.screenTileY() && shiftY > 0) {
            const lastY = this._displayY;
            this._displayY = Math.max(this._displayY - distance, -shiftY * 2);
            this._parallaxY += this._displayY - lastY;
        } else {
            _Game_Map_scrollUp.apply(this, arguments);
        }
    };

    const _Game_Map_scrollDown = Game_Map.prototype.scrollDown;
    Game_Map.prototype.scrollDown = function(distance) {
        if (!this.isLoopVertical() && this.height() >= this.screenTileY() && shiftY < 0) {
            const lastY = this._displayY;
            this._displayY = Math.min(this._displayY + distance, this.height() - this.screenTileY() - shiftY * 2);
            this._parallaxY += this._displayY - lastY;
        } else {
            _Game_Map_scrollDown.apply(this, arguments);
        }
    };
})();
