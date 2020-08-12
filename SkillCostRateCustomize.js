/*=============================================================================
 SkillCostRateCustomize.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/04/04 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc SkillCostRateCustomizePlugin
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author triacontane
 *
 * @help SkillCostRateCustomize.js
 *
 * You can adjust the skill cost multiplier for each specific
 * skill or skill type.
 * Please set the following in the memo column of the
 * database (*) which has the feature as follows.
 *
 * <MpCostRateId1:0.5>   // Increases the MP consumption of ID[1]'s skill by 0.5.
 * <MpCostRateType1:2.0> // Doubles the MP consumption of Skill Type [2].
 * <TpCostRateId1:0.5>   // Increases the TP consumption of ID[1]'s skill by 0.5.
 * <TpCostRateType1:2.0> // Doubles the TP consumption of Skill Type [2].
 *
 * (*)Actors, professions, weapons, armor, enemy characters, and states
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc スキルコスト倍率調整プラグイン
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author トリアコンタン
 *
 * @help SkillCostRateCustomize.js
 *
 * 特定のスキルもしくはスキルタイプごとにスキルコスト倍率を調整できます。
 * 特徴を有するデータベース(※)のメモ欄に以下の通り設定してください。
 *
 * <MpCostRateId1:0.5>   // ID[1]のスキルのMP消費を0.5倍にします。
 * <MpCostRateType1:2.0> // スキルタイプ[2]のMP消費を2倍にします。
 * <TpCostRateId1:0.5>   // ID[1]のスキルのTP消費を0.5倍にします。
 * <TpCostRateType1:2.0> // スキルタイプ[2]のTP消費を2倍にします。
 *
 * ※アクター、職業、武器、防具、敵キャラ、ステート
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
        return object.meta.hasOwnProperty(name) ? convertEscapeCharacters(object.meta[name]) : null;
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
     * Game_BattlerBase
     * IDおよびタイプごとにコスト倍率を計算します。
     */
    var _Game_BattlerBase_skillMpCost = Game_BattlerBase.prototype.skillMpCost;
    Game_BattlerBase.prototype.skillMpCost = function(skill) {
        var result = _Game_BattlerBase_skillMpCost.apply(this, arguments);
        return this.applyCostRateCustomize(result, 'Mp', skill);
    };

    var _Game_BattlerBase_skillTpCost = Game_BattlerBase.prototype.skillTpCost;
    Game_BattlerBase.prototype.skillTpCost = function(skill) {
        var result =  _Game_BattlerBase_skillTpCost.apply(this, arguments);
        return this.applyCostRateCustomize(result, 'Tp', skill);
    };

    Game_BattlerBase.prototype.applyCostRateCustomize = function(originalRate, mpOrTp, skill) {
        var rateById = this.findCostRateCustomize(mpOrTp, 'Id', skill);
        var rateByType = this.findCostRateCustomize(mpOrTp, 'Type', skill);
        return Math.floor(originalRate * rateById * rateByType);
    };

    Game_BattlerBase.prototype.findCostRateCustomize = function(mpOrTp, idOrType, skill) {
        var id = idOrType === 'Id' ? skill.id : skill.stypeId;
        var tag = `${mpOrTp}CostRate${idOrType}${id}`;
        return this.traitObjects().reduce(function(prev, obj) {
            var rate = getMetaValue(obj, tag);
            return rate ? parseFloat(rate) * prev : prev;
        }, 1.0);
    };
})();
