/*=============================================================================
 EncounterWeightVariable.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/09 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc エンカウント重み変数プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EncounterWeightVariable.js
 * @author トリアコンタン
 *
 * @help EncounterWeightVariable.js
 *
 * マップ設定から設定するエンカウントの重み設定を固定値ではなく
 * 変数値からの取得に変更できます。
 * 重みで設定した値が変数番号になります。
 * 変数値が0を返却した場合、そのグループは出現しなくなります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Game_Map_encounterList = Game_Map.prototype.encounterList;
    Game_Map.prototype.encounterList = function() {
        const list = _Game_Map_encounterList.apply(this, arguments);
        list.forEach(encounter => encounter.weight = $gameVariables.value(encounter.weight));
        return list;
    };
})();
