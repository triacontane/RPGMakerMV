/*=============================================================================
 WindowOneTapDecision.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/09/26 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ワンタップで項目決定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/WindowOneTapDecision.js
 * @author トリアコンタン
 *
 * @help WindowOneTapDecision.js
 *
 * モバイルデバイス操作時に、ウィンドウの項目をワンタップで
 * 決定できるよう修正します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Window_Selectable_processTouch = Window_Selectable.prototype.processTouch;
    Window_Selectable.prototype.processTouch = function() {
        const hitIndex = this.hitIndex();
        if (Utils.isMobileDevice() && this.isOpenAndActive() &&
            hitIndex !== this.index() && hitIndex >= 0 && TouchInput.isTriggered()) {
            this.select(hitIndex);
        }
        _Window_Selectable_processTouch.apply(this, arguments);
    };
})();
