/*=============================================================================
 BugfixWindowLine.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/08/21 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ウィンドウ表示不整合修正プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BugfixWindowLine.js
 * @author トリアコンタン
 *
 * @help BugfixWindowLine.js
 *　
 * 特定のPC環境下でウィンドウに
 * 原因不明の線が表示されてしまう問題に暫定対処します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    Window.prototype._refreshBack = function() {
        const m = this._margin;
        const w = Math.max(0, this._width - m * 2);
        const h = Math.max(0, this._height - m * 2);
        const sprite = this._backSprite;
        const tilingSprite = sprite.children[0];
        sprite.bitmap = this._windowskin;
        sprite.setFrame(0, 0, 96, 96);
        sprite.move(m, m);
        sprite.scale.x = w / 96;
        sprite.scale.y = h / 96;
        tilingSprite.bitmap = this._windowskin;
        tilingSprite.setFrame(0, 96, 96, 96);
        tilingSprite.move(0, 0, w, h);
        tilingSprite.scale.x = 96 / w;
        tilingSprite.scale.y = 96 / h;
        sprite.setColorTone(this._colorTone);
    };
})();
