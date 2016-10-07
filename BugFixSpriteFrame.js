//=============================================================================
// BugFixSpriteFrame.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/10/08 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BugFixSpriteFramePlugin
 * @author triacontane
 *
 * @help 本体バージョン1.3.1で文章のスクロールが表示されない
 * 問題を根本的に修正します。
 * 具体的には、スプライトのフレームに負の値が設定された場合に
 * 画像が表示されない問題に対処します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 文章のスクロール修正プラグイン
 * @author トリアコンタン
 *
 * @help 本体バージョン1.3.1で文章のスクロールが表示されない
 * 問題を根本的に修正します。
 * 具体的には、スプライトのフレームに負の値が設定された場合に
 * 画像が表示されない問題に対処します。
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

    var _Sprite_updateTransform = Sprite.prototype.updateTransform;
    Sprite.prototype.updateTransform = function() {
        _Sprite_updateTransform.apply(this, arguments);
        if (this._prevOffsetX) {
            this.worldTransform.tx -= this._prevOffsetX;
        }
        if (this._prevOffsetY) {
            this.worldTransform.ty -= this._prevOffsetY;
        }
        this._prevOffsetX = this._offset.x;
        this._prevOffsetY = this._offset.y;
    };
})();

