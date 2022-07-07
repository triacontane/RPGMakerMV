/*=============================================================================
 PlayCursorMouseHover.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/07/07 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc マウスオーバーで効果音演奏プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PlayCursorMouseHover.js
 * @author トリアコンタン
 *
 * @help PlayCursorMouseHover.js
 *　
 * マウスを使ってウィンドウ上で項目選択したときに
 * カーソル効果音を演奏します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';
    const _Window_Selectable_onTouchSelect = Window_Selectable.prototype.onTouchSelect;
    Window_Selectable.prototype.onTouchSelect = function(trigger) {
        const lastIndex = this.index();
        _Window_Selectable_onTouchSelect.apply(this, arguments);
        if (this.isCursorMovable() && !trigger && this.index() !== lastIndex) {
            this.playCursorSound();
        }
    };
})();
