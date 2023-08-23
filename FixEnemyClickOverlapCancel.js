/*=============================================================================
 FixEnemyClickOverlapCancel.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/08/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 敵キャラクリックのキャンセル上書き修正プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixEnemyClickOverlapCancel.js
 * @author トリアコンタン
 *
 * @help FixEnemyClickOverlapCancel.js
 *　
 * 戦闘画面で敵キャラの選択でキャンセルボタンをクリックしたとき
 * 敵キャラと重なっていると敵キャラのクリックが優先されてしまう問題を修正します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';
    let preventEnemyClick = false;

    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        if (this._cancelButton && this._cancelButton.isBeingTouched()) {
            preventEnemyClick = true;
        }
        _Scene_Battle_update.apply(this, arguments);
        preventEnemyClick = false;
    };

    const _Window_BattleEnemy_processTouch = Window_BattleEnemy.prototype.processTouch;
    Window_BattleEnemy.prototype.processTouch = function() {
        if (preventEnemyClick) {
            return;
        }
        _Window_BattleEnemy_processTouch.apply(this, arguments);
    };
})();
