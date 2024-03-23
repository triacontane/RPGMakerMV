/*=============================================================================
 BushOverwrite.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2024/03/23 ダメージ床にも仕様を適用
 1.0.0 2024/03/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 茂み判定上書きプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BushOverwrite.js
 * @author トリアコンタン
 *
 * @help BushOverwrite.js
 *
 * 茂み判定があるタイルより上のレイヤーに、
 * 茂みでなくかつ通行判定が★でないタイルがある場合、
 * そのマスの茂み判定を無効とします。
 *
 * ダメージ床タイルについても同様の仕様が適用されます。
 *
 * この仕様により、例えば茂みタイルの上に橋が架かっている場合などで
 * 茂みが適用されなくなります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Game_Map_isBush = Game_Map.prototype.isBush;
    Game_Map.prototype.isBush = function(x, y) {
        const result = _Game_Map_isBush.apply(this, arguments);
        if (result) {
            return this.checkLayeredTilesFlagsWithOverwrite(x, y, 0x40);
        } else {
            return result;
        }
    };

    const _Game_Map_isDamageFloor = Game_Map.prototype.isDamageFloor;
    Game_Map.prototype.isDamageFloor = function(x, y) {
        const result = _Game_Map_isDamageFloor.apply(this, arguments);
        if (result) {
            return this.checkLayeredTilesFlagsWithOverwrite(x, y, 0x100);
        } else {
            return result;
        }
    };

    Game_Map.prototype.checkLayeredTilesFlagsWithOverwrite = function(x, y, bit) {
        const flags = this.tilesetFlags();
        const tiles = this.layeredTiles(x, y);
        for (const tile of tiles) {
            const flag = flags[tile];
            if ((flag & 0x10) === 0 && (flag & bit) === 0) {
                return false;
            } else if ((flag & bit) !== 0) {
                return true;
            }
        }
        return false;
    };
})();
