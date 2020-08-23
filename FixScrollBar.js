/*=============================================================================
 FixScrollBar.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/08/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc Erase the horizontal scrolling bar.
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixScrollBar.js
 * @author triacontane
 *
 * @help FixScrollBar.js
 *
 * Erase the horizontal scrolling bar that is displayed
 * when the screen size is shrunk below 640.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 画面サイズを640より縮めた場合に表示される横スクロールバーを消します
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixScrollBar.js
 * @author トリアコンタン
 *
 * @help FixScrollBar.js
 *　
 * 画面サイズを640より縮めた場合に表示される横スクロールバーを消します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Graphics__createErrorPrinter = Graphics._createErrorPrinter;
    Graphics._createErrorPrinter = function() {
        _Graphics__createErrorPrinter.apply(this, arguments);
        this._updateErrorPrinter();
    };

    const _Graphics__updateErrorPrinter = Graphics._updateErrorPrinter;
    Graphics._updateErrorPrinter = function() {
        _Graphics__updateErrorPrinter.apply(this, arguments);
        this._errorPrinter.style.width = this._width * this._realScale + 'px';
    };
})();
