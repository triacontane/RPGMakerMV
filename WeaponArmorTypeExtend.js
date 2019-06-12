/*=============================================================================
 WeaponArmorTypeExtend.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2019/06/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc WeaponArmorTypeExtendPlugin
 * @author triacontane
 *
 * @param equipConditionType
 * @text 装備条件タイプ
 * @desc 複数のタイプを持つ武具の装備条件を「And」「Or」から選択できます。
 * @default 0
 * @type select
 * @option AND
 * @value 0
 * @option OR
 * @value 1
 *
 * @param commandPrefix
 * @text メモ欄接頭辞
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help WeaponArmorTypeExtend.js
 *
 * 武器タイプ、防具タイプを追加設定できます。装備条件に影響します。
 * 武器もしくは防具のメモ欄に以下の通り指定してください。
 * <追加武器タイプ:1> # 武器タイプ[1]が追加されます。
 * <AddWeaponType:1>  # 同上
 * <追加防具タイプ:2> # 防具タイプ[2]が追加されます。
 * <AddArmorType:2>   # 同上
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 武具タイプ拡張プラグイン
 * @author トリアコンタン
 *
 * @param equipConditionType
 * @text 装備条件タイプ
 * @desc 複数のタイプを持つ武具の装備条件を「すべての」「いずれかの」から選択できます。
 * @default 0
 * @type select
 * @option すべての
 * @value 0
 * @option いずれかの
 * @value 1
 *
 * @param commandPrefix
 * @text メモ欄接頭辞
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help WeaponArmorTypeExtend.js
 *
 * 武器タイプ、防具タイプを追加設定できます。装備条件に影響します。
 * 武器もしくは防具のメモ欄に以下の通り指定してください。
 * <追加武器タイプ:1>   # 武器タイプ[1]が追加されます。
 * <AddWeaponType:1>    # 同上
 * <追加防具タイプ:2,3> # 防具タイプ[2]および[3]が追加されます。
 * <AddArmorType:2,3>   # 同上
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
     * Get database meta information.
     * @param object Database item
     * @param name Meta name
     * @returns {String} meta value
     */
    var getMetaValue = function(object, name) {
        var tagName = param.commandPrefix + name;
        return object.meta.hasOwnProperty(tagName) ? convertEscapeCharacters(object.meta[tagName]) : null;
    };

    /**
     * Get database meta information.(for multi language)
     * @param object Database item
     * @param names Meta name array (for multi language)
     * @returns {String} meta value
     */
    var getMetaValues = function(object, names) {
        var metaValue = undefined;
        names.some(function(name) {
            metaValue = getMetaValue(object, name);
            return metaValue !== null;
        });
        return metaValue;
    };

    /**
     * Convert escape characters.(require any window object)
     * @param text Target text
     * @returns {String} Converted text
     */
    var convertEscapeCharacters = function(text) {
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text.toString()) : text;
    };

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

    var param = createPluginParameter('WeaponArmorTypeExtend');

    var _Game_BattlerBase_canEquipWeapon = Game_BattlerBase.prototype.canEquipWeapon;
    Game_BattlerBase.prototype.canEquipWeapon = function(item) {
        var result = _Game_BattlerBase_canEquipWeapon.apply(this, arguments);
        var metaValues = getMetaValues(item,['AddWeaponType', '追加武器タイプ']);
        return this.isEquipAdditionalTypeOk(result, metaValues, Game_BattlerBase.TRAIT_EQUIP_WTYPE);
    };

    var _Game_BattlerBase_canEquipArmor = Game_BattlerBase.prototype.canEquipArmor;
    Game_BattlerBase.prototype.canEquipArmor = function(item) {
        var result = _Game_BattlerBase_canEquipArmor.apply(this, arguments);
        var metaValues = getMetaValues(item, ['AddArmorType', '追加防具タイプ']);
        return this.isEquipAdditionalTypeOk(result, metaValues, Game_BattlerBase.TRAIT_EQUIP_ATYPE);
    };

    Game_BattlerBase.prototype.isEquipAdditionalTypeOk = function(originalResult, metaValue, traitName) {
        if (!metaValue) {
            return originalResult;
        }
        var addTypes = metaValue.split(',');
        var battlerTypes = this.traitsSet(traitName);
        if (param.equipConditionType === 0) {
            return originalResult && addTypes.every(function(type) {
                return battlerTypes.contains(parseInt(type));
            });
        } else {
            return originalResult || addTypes.some(function(type) {
                return battlerTypes.contains(parseInt(type));
            });
        }
    };
})();
