//=============================================================================
// PartyAbilityRate.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2022/02/16 MZで動作するよう修正
// 1.0.1 2019/06/21 獲得EXPとゴールドに端数が生じた場合切り捨てるよう修正
// 1.0.0 2016/05/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc パーティ能力レート設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PartyAbilityRate.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help PartyAbilityRate.js
 * 
 * レートを指定した『パーティ能力』を定義できます。
 * 特徴『パーティ能力』とは無関係に動作します。
 * データベースのメモ欄(※)に以下の通り設定してください。
 * ※アクター、職業、武器、防具、ステート
 *
 * // エンカウント率が4倍になります
 * <エンカウント率:4>
 * <EncounterRate:4>
 *
 * // 先制攻撃の確率が8倍になります。
 * <先制攻撃率:8>
 * <PreemptiveRate:8>
 *
 * // 獲得金額が0.5倍になります。
 * <獲得金額率:0.5>
 * <GoldRate:0.5>
 *
 * // アイテム入手確率が4倍になります。
 * <アイテム入手率:4>
 * <DropItemRate:4>
 *
 * 複数のレートが重複した場合はもっとも数字の大きいものが優先されます。
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

    Game_BattlerBase.prototype.partyAbilityRate = function(abilityNames) {
        return this.traitObjects().reduce((prev, traitObject) => {
            const rate = PluginManagerEx.findMetaValue(traitObject, abilityNames);
            return rate !== undefined ? Math.max(rate, prev || 0) : prev;
        }, undefined);
    };

    Game_Party.prototype.partyAbilityRate = function(abilityNames) {
        return this.battleMembers().reduce((prev, actor) => {
            const rate = actor.partyAbilityRate(abilityNames);
            return rate !== undefined ? Math.max(rate, prev || 0) : prev;
        }, undefined);
    };

    Game_Party.prototype.getEncounterRate = function() {
        return this.partyAbilityRate(['エンカウント率', 'EncounterRate']);
    };

    Game_Party.prototype.getRaisePreemptiveRate = function() {
        return this.partyAbilityRate(['先制攻撃率', 'PreemptiveRate']);
    };

    Game_Party.prototype.getGoldRate = function() {
        return this.partyAbilityRate(['獲得金額率', 'GoldRate']);
    };

    Game_Party.prototype.getDropItemRate = function() {
        return this.partyAbilityRate(['アイテム入手率', 'DropItemRate']);
    };

    const _Game_Party_ratePreemptive = Game_Party.prototype.ratePreemptive;
    Game_Party.prototype.ratePreemptive = function(troopAgi) {
        const rate = _Game_Party_ratePreemptive.apply(this, arguments);
        const customRate = this.getRaisePreemptiveRate();
        return customRate !== undefined ? rate * customRate : rate;
    };

    const _Game_Player_encounterProgressValue = Game_Player.prototype.encounterProgressValue;
    Game_Player.prototype.encounterProgressValue = function() {
        const rate = _Game_Player_encounterProgressValue.apply(this, arguments);
        const customRate = $gameParty.getEncounterRate();
        return customRate !== undefined ? rate * customRate : rate;
    };

    const _Game_Troop_goldRate = Game_Troop.prototype.goldRate;
    Game_Troop.prototype.goldRate = function() {
        const rate = _Game_Troop_goldRate.apply(this, arguments);
        const customRate = $gameParty.getGoldRate();
        return customRate !== undefined ? rate * customRate : rate;
    };

    const _Game_Enemy_dropItemRate = Game_Enemy.prototype.dropItemRate;
    Game_Enemy.prototype.dropItemRate = function() {
        const rate = _Game_Enemy_dropItemRate.apply(this, arguments);
        const customRate = $gameParty.getDropItemRate();
        return customRate !== undefined ? rate * customRate : rate;
    };

    const _Game_Troop_expTotal = Game_Troop.prototype.expTotal;
    Game_Troop.prototype.expTotal = function() {
        return Math.floor(_Game_Troop_expTotal.apply(this, arguments));
    };

    const _Game_Troop_goldTotal = Game_Troop.prototype.goldTotal;
    Game_Troop.prototype.goldTotal = function() {
        return Math.floor(_Game_Troop_goldTotal.apply(this, arguments));
    };
})();

