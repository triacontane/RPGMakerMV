/*=============================================================================
 WeaponArmorTypeExtend.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2023/04/16 パフォーマンス対策で、メモ欄の解析を廃止
 1.1.1 2023/04/16 誤って出力したログを削除
 1.1.0 2023/04/16 MZで動作するよう修正
 1.0.0 2019/06/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 武具タイプ拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/WeaponArmorTypeExtend.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
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
 * @help WeaponArmorTypeExtend.js
 *
 * 武器タイプ、防具タイプを追加設定できます。装備条件に影響します。
 * 武器もしくは防具のメモ欄に以下の通り指定してください。
 * <追加武器タイプ:1>   # 武器タイプ[1]が追加されます。
 * <AddWeaponType:1>    # 同上
 * <追加防具タイプ:2,3> # 防具タイプ[2]および[3]が追加されます。
 * <AddArmorType:2,3>   # 同上
 *　
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
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

    const _Game_BattlerBase_canEquipWeapon = Game_BattlerBase.prototype.canEquipWeapon;
    Game_BattlerBase.prototype.canEquipWeapon = function(item) {
        const result = _Game_BattlerBase_canEquipWeapon.apply(this, arguments);
        const metaValues = item.meta['AddWeaponType'] || item.meta['追加武器タイプ'];
        return this.isEquipAdditionalTypeOk(result, metaValues, Game_BattlerBase.TRAIT_EQUIP_WTYPE);
    };

    const _Game_BattlerBase_canEquipArmor = Game_BattlerBase.prototype.canEquipArmor;
    Game_BattlerBase.prototype.canEquipArmor = function(item) {
        const result = _Game_BattlerBase_canEquipArmor.apply(this, arguments);
        const metaValues = item.meta['AddArmorType'] || item.meta['追加防具タイプ'];
        return this.isEquipAdditionalTypeOk(result, metaValues, Game_BattlerBase.TRAIT_EQUIP_ATYPE);
    };

    Game_BattlerBase.prototype.isEquipAdditionalTypeOk = function(originalResult, metaValue, traitName) {
        if (!metaValue) {
            return originalResult;
        }
        const addTypes = isFinite(metaValue) ? [metaValue] : metaValue.split(',');
        const battlerTypes = this.traitsSet(traitName);
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
