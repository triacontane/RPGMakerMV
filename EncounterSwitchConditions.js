//=============================================================================
// EncounterSwitchConditions.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2025/04/14 MZで動作するよう修正
// 1.0.0 2018/02/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc スイッチ条件エンカウントプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EncounterSwitchConditions.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param validSwitchId
 * @text 有効スイッチID
 * @desc このプラグインの機能が有効になるスイッチIDです。0を指定すると常に有効になります。
 * @default 0
 * @type switch
 *
 * @help EncounterSwitchConditions.js
 *
 * マップ設定のエンカウント作成におけるリージョンIDによる出現条件をスイッチに
 * 読み替えます。通常のリージョンIDによる絞り込みは無効となります。
 *
 * 指定例
 * マップ設定でリージョンID[6]を指定
 *
 * 本来のリージョンID[6]の条件は無視され、スイッチ番号[6]がONの場合のみ
 * 指定した敵グループとエンカウントする。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Player_meetsEncounterConditions      = Game_Player.prototype.meetsEncounterConditions;
    Game_Player.prototype.meetsEncounterConditions = function(encounter) {
        const result = _Game_Player_meetsEncounterConditions.apply(this, arguments);
        const set = encounter.regionSet;
        if (this.isValidSwitchEncounter() && set.length > 0) {
            return set.some(switchId => $gameSwitches.value(switchId));
        }
        return result;
    };

    Game_Player.prototype.isValidSwitchEncounter = function() {
        return !param.validSwitchId || $gameSwitches.value(param.validSwitchId);
    };
})();

