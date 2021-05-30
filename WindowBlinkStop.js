//=============================================================================
// WindowBlinkStop.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2021/05/30 メッセージウィンドウなどに表示されるページ送り画像のアニメーションが止まってしまう問題を修正
// 1.0.0 2017/12/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc WindowBlinkStopPlugin
 * @author triacontane
 *
 * @help WindowBlinkStop.js
 *
 * 選択中のウィンドウカーソルの点滅を停止します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ウィンドウ点滅停止プラグイン
 * @author トリアコンタン
 *
 * @help WindowBlinkStop.js
 *
 * 選択中のウィンドウカーソルの点滅を停止します。
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

    var _Window__updateCursor = Window.prototype._updateCursor;
    Window.prototype._updateCursor = function() {
        var prevCount = this._animationCount;
        this._animationCount = 0;
        _Window__updateCursor.apply(this, arguments);
        this._animationCount = prevCount;
    };
})();

