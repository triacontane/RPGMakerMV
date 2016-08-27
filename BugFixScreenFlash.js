//=============================================================================
// BugFixScreenFlash.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/08/11 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Bug fix Screen Flash for Web GL
 * @author triacontane
 *
 * @help Bug fix Screen Flash for Web GL
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 画面のフラッシュバグ修正プラグイン
 * @author トリアコンタン
 *
 * @help WebGLモードにて同じマップで連続して異なる色を指定して「画面のフラッシュ」を
 * 実行した際に後に指定したフラッシュ色が反映されない問題を修正します。
 * この問題は本体バージョン1.3.0にて新たに発生するようになりました。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  バグ修正プラグインにつき規約なしの無条件でご利用頂けます。
 */

(function() {
    'use strict';
    if (Utils.RPGMAKER_VERSION === '1.3.0') {
        ScreenSprite.prototype._renderWebGL = function(renderer) {
            this._bitmap.checkDirty();
            PIXI.Sprite.prototype._renderWebGL.call(this, renderer);
        };
    }
})();

