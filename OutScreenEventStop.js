//=============================================================================
// OutScreenEventStop.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/01/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 画面外イベントの更新停止プラグイン
 * @author トリアコンタン
 *
 * @help 画面外イベントの更新およびリフレッシュを停止します。
 * ページの出現条件を満たしてもページを切り替えないことで
 * 処理を若干軽量化します。
 *
 * デフォルトでは体感での違いはほとんどありませんが
 * 何らかのプラグインで重くなっている場合に
 * 効果を発揮するかもしれません。
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

    Game_Map.prototype.isOuterScreenPosition = function(x, y) {
        var ax = this.adjustX(x);
        var ay = this.adjustY(y);
        return ax < -1 || ay < -1 || ax > this.screenTileX() || ay > this.screenTileY();
    };

    //=============================================================================
    // Game_Event
    //  画面外のイベントの更新を停止します。
    //=============================================================================
    var _Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        if ($gameMap.isOuterScreenPosition(this.x, this.y)) {
            this._sleep = true;
            this.checkEventTriggerAuto();
            this.updateParallel();
            return;
        } else if (this._sleep) {
            this._sleep = false;
            this.refresh();
        }
        _Game_Event_update.apply(this, arguments);
    };

    var _Game_Event_refresh = Game_Event.prototype.refresh;
    Game_Event.prototype.refresh = function() {
        if (this._sleep) {
            return;
        }
        _Game_Event_refresh.apply(this, arguments);
    }
})();

