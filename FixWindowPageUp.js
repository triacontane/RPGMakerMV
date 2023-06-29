/*=============================================================================
 FixWindowPageUp.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/06/29 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ウィンドウのページアップ挙動修正プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixWindowPageUp.js
 * @author トリアコンタン
 *
 * @help FixWindowPageUp.js
 *　
 * ウィンドウでページアップボタンを押したときに
 * カーソルが一番上まで移動するようになります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Window_Selectable_cursorPageup = Window_Selectable.prototype.cursorPageup;
    Window_Selectable.prototype.cursorPageup = function() {
        _Window_Selectable_cursorPageup.apply(this, arguments);
        if (this.topRow() === 0) {
            this.smoothScrollUp(this.maxPageRows());
            this.select(0);
        }
    };
})();
