/*=============================================================================
 TpCostZeroInMap.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/03/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 戦闘中以外でのスキルのTPコストを0にするプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TpCostZeroInMap.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help TpCostZeroInMap.js
 *
 * 戦闘中以外でスキルを使用するとき、TPのコストが0になるよう
 * 仕様変更します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Game_BattlerBase_skillTpCost = Game_BattlerBase.prototype.skillTpCost;
    Game_BattlerBase.prototype.skillTpCost = function(skill) {
        if ($gameParty.inBattle()) {
            return _Game_BattlerBase_skillTpCost.apply(this, arguments);
        } else {
            return 0;
        }
    };
})();
