/*=============================================================================
 RegionBaseBugPatch.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/01/28 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc RegionBaseバグ修正パッチ
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/RegionBaseBugPatch.js
 * @base RegionBase
 * @orderAfter RegionBase
 * @author トリアコンタン
 *
 * @help RegionBaseBugPatch.js
 *　
 * RegionBaseにおいて全方向通行不可に設定した
 * リージョンや地形タグに対して、飛行船で着陸できてしまう
 * 不具合を修正します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Game_Map_isAirshipLandOk = Game_Map.prototype.isAirshipLandOk;
    Game_Map.prototype.isAirshipLandOk = function(x, y) {
        const passable = _Game_Map_isAirshipLandOk.apply(this, arguments);
        this.setPassableSubject($gamePlayer);
        return passable && this.isPassable(x, y, 0);
    };
})();
