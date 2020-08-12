/*=============================================================================
 FixWeatherOrderInCanvas.js
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
 * @plugindesc FixWeatherOrderInCanvasPlugin
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author triacontane
 *
 * @help FixWeatherPriorityCanvas.js
 *
 * Sets the priority of weather sprites over tonal
 * sprites for Canvas mode execution.
 * This fixes an inconsistency where the weather is not affected
 * by the color change when in WebGL mode, but is affected when
 * in Canvas mode.
 *
 * In either mode, the weather is no longer affected
 * by color tone changes.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc Canvasモード時の天候優先度修正プラグイン
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author トリアコンタン
 *
 * @help FixWeatherPriorityCanvas.js
 *
 * Canvasモード実行に天候スプライトの優先度を色調スプライトより上にします。
 * WebGLモード時は天候は色調変化の影響を受けませんが、Canvasモード時は
 * 影響を受けてしまう不整合を修正します。
 *
 * いずれのモードの場合も天候は色調変化の影響を受けなくなります。
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

    var _Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
    Spriteset_Map.prototype.createUpperLayer = function() {
        if (!Graphics.isWebGL()) {
            this.addChild(this._weather);
        }
        _Spriteset_Map_createUpperLayer.apply(this, arguments);
    };
})();
