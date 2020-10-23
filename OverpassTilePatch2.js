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
 * @plugindesc OverpassTilePatchPlugin2
 * @target MZ
 * @base OverpassTile
 * @orderAfter OverpassTile
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/OverpassTilePatch.js
 * @author triacontane
 *
 * @help OverpassTilePatch.js
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 立体交差プラグイン修正パッチ2
 * @target MZ
 * @base OverpassTile
 * @orderAfter OverpassTile
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/OverpassTilePatch.js
 * @author トリアコンタン
 *
 * @help OverpassTilePatch.js
 *
 * ループを有効にしたマップで公式プラグイン「OverpassTile.js」が
 * 正常に機能しない問題を修正
 */

(() => {
    'use strict';

    Tilemap.prototype._isOverpassPosition = function(mx, my) {
        if (this.horizontalWrap) {
            mx = mx.mod(this._mapWidth);
        }
        if (this.verticalWrap) {
            my = my.mod(this._mapHeight);
        }
        return $gameMap && $gameMap.isOverPath(mx, my);
    };
})();
