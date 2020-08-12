/*=============================================================================
 FixZoomRange.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/05/11 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc FixZoomRangePlugin
 * @target MZ @author triacontane
 *
 * @help FixZoomRange.js
 *
 * Limit the zoom coordinates of the map zoom ($gameScreen.setZoom)
 * to within the screen.
 * Solves the problem that the black area outside the map drawing area
 * is sometimes visible when zooming outside the screen.
 *
 * This can be seen, for example, when the player is off-screen
 * and the end count effect occurs.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ズーム範囲修正プラグイン
 * @target MZ @author トリアコンタン
 *
 * @help FixZoomRange.js
 *
 * マップズーム（$gameScreen.setZoom）のズーム座標の取り得る範囲を
 * 画面内に限定します。
 * 画面外を基準にズームすることでマップ描画範囲外の黒い部分が見えてしまう
 * ことがある問題を解消します。
 *
 * この現象は、プレイヤーが画面外にいるときにエンカウントのエフェクトが
 * 発生したときなどで確認できます。
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

    var _Game_Screen_setZoom = Game_Screen.prototype.setZoom;
    Game_Screen.prototype.setZoom = function(x, y, scale) {
        x = x.clamp(0, Graphics.width);
        y = y.clamp(0, Graphics.height);
        _Game_Screen_setZoom.call(this, x, y, scale);
    };
})();
