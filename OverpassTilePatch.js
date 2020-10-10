/*=============================================================================
 OverpassTilePatch.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/10/11 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc OverpassTilePatchPlugin
 * @target MZ
 * @base OverpassTile
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/OverpassTilePatch.js
 * @author triacontane
 *
 * @help OverpassTilePatch.js
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 立体交差プラグイン修正パッチ
 * @target MZ
 * @base OverpassTile
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/OverpassTilePatch.js
 * @author トリアコンタン
 *
 * @help OverpassTilePatch.js
 *
 * 公式プラグイン「OverpassTile.js」を適用すると、同じ位置にイベントが
 * 重なるように仕様が変更されてしまう問題を修正します。
 */

(() => {
    'use strict';
    Game_CharacterBase.prototype.isCollidedWithSameHigherEvents = function(x, y) {
        const events = $gameMap.eventsXyNt(x, y);
        return events.some(event => this.isSameHigher(event));
    };
})();
