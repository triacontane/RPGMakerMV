//=============================================================================
// PartyAbilityRate.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/05/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Party ability rate
 * @author triacontane
 *
 * @help enable customize party ability rate
 *
 * note
 * <PAREncounterHalf:4>   -> Encounter rate 1/4
 * <PARRaisePreemptive:8> -> Raise preemptive 8 times
 * <PARGoldDouble:3>      -> Gold triple
 * <PARDropItemDouble:3>  -> Drop item triple
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc パーティ能力レート設定プラグイン
 * @author トリアコンタン
 *
 * @help パーティ能力にレートを設定できます。
 * パーティ特徴を定義したデータベースのメモ欄に以下の通り設定してください。
 *
 * <PARエンカウント半減:4>  // エンカウント率が通常の1/4になります。
 * <PAR先制攻撃率アップ:8>  // 先制攻撃の確率が8倍になります。
 * <PAR獲得金額2倍:0.5>     // 獲得金額が0.5倍になります。
 * 　(タグ名は設定する値にかかわらず「PAR獲得金額2倍」と記述してください)
 * <PARアイテム入手率2倍:4> // アイテム入手確率が4倍になります。(同上)
 *
 * 複数のレートが重複した場合はもっとも数字の大きいものが優先されます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var metaTagPrefix = 'PAR';

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseFloat(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) {
            text = evalFlg ? '0' : '';
        }
        var window = SceneManager._scene._windowLayer.children[0];
        if (window) {
            var result = window.convertEscapeCharacters(text);
            return evalFlg ? eval(result) : result;
        } else {
            return text;
        }
    };

    Game_BattlerBase.prototype.partyAbilityRate = function(abilityNames, defaultValue) {
        var result = defaultValue;
        this.traitObjects().forEach(function (traitObject) {
            var metaValue = getMetaValues(traitObject, abilityNames);
            if (metaValue) result = getArgNumber(metaValue, result);
        }.bind(this));
        return result;
    };

    Game_Party.prototype.partyAbilityRate = function(abilityNames, defaultValue) {
        var result = defaultValue;
        this.battleMembers().forEach(function(actor) {
            result = actor.partyAbilityRate(abilityNames, result);
        });
        return result;
    };

    Game_Party.prototype.getEncounterHalfRate = function() {
        return this.partyAbilityRate(['エンカウント半減', 'EncounterHalf'], 0) || 2;
    };

    Game_Party.prototype.getRaisePreemptiveRate = function() {
        return this.partyAbilityRate(['先制攻撃率アップ', 'RaisePreemptive'], 0) || 4;
    };

    Game_Party.prototype.getGoldDoubleRate = function() {
        return this.partyAbilityRate(['獲得金額2倍', 'GoldDouble'], 0) || 2;
    };

    Game_Party.prototype.getDropItemDoubleRate = function() {
        return this.partyAbilityRate(['アイテム入手率2倍', 'DropItemDouble'], 0) || 2;
    };

    var _Game_Party_ratePreemptive = Game_Party.prototype.ratePreemptive;
    Game_Party.prototype.ratePreemptive = function(troopAgi) {
        var rate = _Game_Party_ratePreemptive.apply(this, arguments);
        if (this.hasRaisePreemptive()) {
            rate /= 4;
            rate *= this.getRaisePreemptiveRate();
        }
        return rate;
    };

    var _Game_Player_encounterProgressValue = Game_Player.prototype.encounterProgressValue;
    Game_Player.prototype.encounterProgressValue = function() {
        var value = _Game_Player_encounterProgressValue.apply(this, arguments);
        if ($gameParty.hasEncounterHalf()) {
            value /= 0.5;
            value /= $gameParty.getEncounterHalfRate();
        }
        return value;
    };

    var _Game_Troop_goldRate = Game_Troop.prototype.goldRate;
    Game_Troop.prototype.goldRate = function() {
        var rate =_Game_Troop_goldRate.apply(this, arguments);
        if ($gameParty.hasGoldDouble()) {
            rate /= 2;
            rate *= $gameParty.getGoldDoubleRate();
        }
        return rate;
    };

    var _Game_Enemy_dropItemRate = Game_Enemy.prototype.dropItemRate;
    Game_Enemy.prototype.dropItemRate = function() {
        var rate = _Game_Enemy_dropItemRate.apply(this, arguments);
        if ($gameParty.hasDropItemDouble()) {
            rate /= 2;
            rate *= $gameParty.getDropItemDoubleRate();
        }
        return rate;
    };
})();

