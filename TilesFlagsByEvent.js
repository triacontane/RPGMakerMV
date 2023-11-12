/*=============================================================================
 TilesFlagsByEvent.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/11/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc タイルフラグのイベント考慮プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TilesFlagsByEvent.js
 * @author トリアコンタン
 *
 * @help TilesFlagsByEvent.js
 *
 * タイルフラグ（梯子、茂み、カウンター、ダメージ床）を判定する際
 * タイル画像を指定したイベントも含めて判定します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Game_Map_checkLayeredTilesFlags = Game_Map.prototype.checkLayeredTilesFlags;
    Game_Map.prototype.checkLayeredTilesFlags = function(x, y, bit) {
        if (this._tileEvents) {
            const flags = this.tilesetFlags();
            return this.allTiles(x, y).some(tileId => (flags[tileId] & bit) !== 0);
        } else {
            return _Game_Map_checkLayeredTilesFlags.apply(this, arguments);
        }
    };
})();
