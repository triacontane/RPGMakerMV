/*=============================================================================
 EventStartAfterMoving.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/17 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 移動してからイベント開始プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventStartAfterMoving.js
 * @author トリアコンタン
 *
 * @help EventStartAfterMoving.js
 *
 * イベント開始時に対象が移動中だった場合、移動が完了するまで待ってから
 * イベントを開始します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Game_Interpreter_setup = Game_Interpreter.prototype.setup;
    Game_Interpreter.prototype.setup = function(list, eventId) {
        _Game_Interpreter_setup.apply(this, arguments);
        if (this._depth === 0) {
            this._waitForMoving = true;
        }
    };

    const _Game_Interpreter_updateWait = Game_Interpreter.prototype.updateWait;
    Game_Interpreter.prototype.updateWait = function() {
        const result = _Game_Interpreter_updateWait.apply(this, arguments);
        if (this._waitForMoving) {
            if (this.character(0)?.isMoving()) {
                return true;
            } else {
                this._waitForMoving = false;
            }
        }
        return result;
    };
})();
