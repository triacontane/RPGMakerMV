//=============================================================================
// EncounterSwitchConditions.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2018/02/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc EncounterSwitchConditionsPlugin
 * @author triacontane
 *
 * @param validSwitchId
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
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc スイッチ条件エンカウントプラグイン
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

(function() {
    'use strict';

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('EncounterSwitchConditions');

    var isValidPlugin = function() {
        return !param.validSwitchId || $gameSwitches.value(param.validSwitchId);
    };

    var _Game_Player_meetsEncounterConditions      = Game_Player.prototype.meetsEncounterConditions;
    Game_Player.prototype.meetsEncounterConditions = function(encounter) {
        var result = _Game_Player_meetsEncounterConditions.apply(this, arguments);
        if (isValidPlugin() && result === encounter.regionSet.contains(this.regionId())) {
            return encounter.regionSet.some(function(switchId) {
                return $gameSwitches.value(switchId);
            });
        }
        return result;
    };
})();

