//=============================================================================
// ForegroundToParallax.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/06/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ForegroundToParallaxPlugin
 * @author triacontane
 *
 * @help 準公式プラグイン「Foreground.js」で表示する近景を遠景に切り替えます。
 * もともとの遠景の後ろ側に表示されるようになります。
 * 二種類の遠景を同時に表示させたい場合などにご使用ください。
 *
 * プラグイン管理画面でForeground.jsよりも下に配置してください。
 *
 * Foreground.jsはサンプルゲームなどに収録されています。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc Foregroundの遠景化プラグイン
 * @author トリアコンタン
 *
 * @help 準公式プラグイン「Foreground.js」で表示する近景を遠景に切り替えます。
 * もともとの遠景の後ろ側に表示されるようになります。
 * 二種類の遠景を同時に表示させたい場合などにご使用ください。
 *
 * プラグイン管理画面でForeground.jsよりも下に配置してください。
 *
 * Foreground.jsはサンプルゲームなどに収録されています。
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

    var _Spriteset_Map_createForeground = Spriteset_Map.prototype.createForeground;
    Spriteset_Map.prototype.createForeground = function() {
        _Spriteset_Map_createForeground.apply(this, arguments);
        this._baseSprite.removeChild(this._foreground);
        var newIndex = this._baseSprite.getChildIndex(this._parallax);
        this._baseSprite.addChildAt(this._foreground, newIndex);
    };
})();

