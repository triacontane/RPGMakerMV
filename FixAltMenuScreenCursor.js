/*=============================================================================
 FixAltMenuScreenCursor.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/02/22 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc FixAltMenuScreenCursorPlugin
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author triacontane
 *
 * @help FixAltMenuScreenCursor.js
 *
 * When using AltMenuScreen.js, the direction and position of the cursor displayed
 * when there are five or more party members is corrected to a natural one.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc AltMenuScreenのカーソル修正プラグイン
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author トリアコンタン
 *
 * @help FixAltMenuScreenCursor.js
 *
 * AltMenuScreen.js利用時、パーティーメンバーが5人以上いる場合に
 * 表示されるカーソルの向きと位置を自然なものに補正します。
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

    Window_MenuStatus.prototype._refreshArrows = function() {
        Window.prototype._refreshArrows.call(this);
        var w = this._width;
        var h = this._height;
        var p = 24;
        var q = p / 2;

        this._downArrowSprite.rotation = 270 * Math.PI / 180;
        this._downArrowSprite.move(w - q, h / 2);
        this._upArrowSprite.rotation = 270 * Math.PI / 180;
        this._upArrowSprite.move(q, h / 2);
    };
})();
