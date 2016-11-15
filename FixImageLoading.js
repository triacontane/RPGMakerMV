//=============================================================================
// FixImageLoading.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2016/11/16 liply_GC.jsとの競合を解消 by 奏 ねこま様
// 1.0.0 2016/05/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc 画像ロード時のチラつき防止プラグイン
 * @author トリアコンタン
 *
 * @help キャッシュしていない画像を表示したときに
 * 一瞬発生するチラつきを防止します。
 * 画像のロードが完了するまで以前に表示していた画像を残します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';

    Object.defineProperty(Sprite.prototype, 'bitmap', {
        get: function() {
            return this._bitmap;
        },
        set: function(value) {
            if (this._bitmap === value) return;
            if (value) {
                value.__liply_attachedToScene = true;               // added by nekoma
                if (!this._bitmap) {
                    this._bitmap = value;
                    this._bitmap.__liply_attachedToScene = false;   // added by nekoma
                    this.setFrame(0, 0, 0, 0);
                }
                value.addLoadListener(function () {
                    if (!this._bitmap) return;
                    this._bitmap = value;
                    this._bitmap.__liply_attachedToScene = false;   // added by nekoma
                    this._onBitmapLoad();
                }.bind(this));
            } else {
                this._bitmap = value;
                this.texture.frame = Rectangle.emptyRectangle;      // modified by nekoma
            }
        },
        configurable: true
    });
})();

