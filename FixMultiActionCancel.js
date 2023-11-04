/*=============================================================================
 FixMultiActionCancel.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/11/04 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 行動回数の即時キャンセルプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixMultiActionCancel.js
 * @author トリアコンタン
 *
 * @help FixMultiActionCancel.js
 *　
 * ステート解除によって行動回数が減少した場合、
 * それを現在のターンで即時反映させます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Game_Battler_removeState = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function(stateId) {
        _Game_Battler_removeState.apply(this, arguments);
        this.cancelMultiAction();
    };

    Game_Battler.prototype.cancelMultiAction = function() {
        const actionCount = this.actionPlusSet().length + 1;
        while (this._actions && actionCount < this._actions.length) {
            this._actions.pop();
        }
    };
})();
