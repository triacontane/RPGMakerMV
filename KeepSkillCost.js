//=============================================================================
// KeepSkillCost.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/07/20 戦闘画面以外では動作しないパラメータを追加しました。
// 1.0.0 2016/07/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc KeepSkillCostPlugin
 * @author triacontane
 *
 * @param BattleOnly
 * @desc ターン終了時の消費が戦闘画面でのみ有効になります。
 * @default ON
 *
 * @help スキルの使用有無に拘わらず所持しているだけでターン終了後に
 * 規定のコストを消費するスキルが作成できるようになります。
 * 値には制御文字\v[n]を利用できます。また負の値を設定した場合は回復します。
 *
 * スキルのメモ欄に以下の通り指定してください。
 * <KSC_HP:10>      # ターン終了後にHP10を消費する。(戦闘不能無効)
 * <KSC_MP:10>      # ターン終了後にMP10を消費する。
 * <KSC_TP:10>      # ターン終了後にTP10を消費する。
 * <KSC_Gold:10>    # ターン終了後にお金を10を消費する。(アクターのみ有効)
 * <KSC_VariableNumber:5> # ターン終了後に変数[5]の値を[10]減算する。
 * <KSC_VariableValue:10> # 上とセットで使用する。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc スキルコスト維持プラグイン
 * @author トリアコンタン
 *
 * @param 戦闘画面のみ有効
 * @desc ターン終了時の消費が戦闘画面でのみ有効になります。
 * @default ON
 *
 * @help スキルの使用有無に拘わらず所持しているだけでターン終了後に
 * 規定のコストを消費するスキルが作成できるようになります。
 * 値には制御文字\v[n]を利用できます。また負の値を設定した場合は回復します。
 *
 * スキルのメモ欄に以下の通り指定してください。
 * <KSC_HP:10>      # ターン終了後にHP10を消費する。(スリップダメージ扱い)
 * <KSC_MP:10>      # ターン終了後にMP10を消費する。
 * <KSC_TP:10>      # ターン終了後にTP10を消費する。
 * <KSC_お金:10>    # ターン終了後にお金を10を消費する。(アクターのみ有効)
 * <KSC_変数番号:5> # ターン終了後に変数[5]の値を[10]減算する。
 * <KSC_変数値:10>  # 上とセットで使用する。
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
    var pluginName    = 'KeepSkillCost';
    var metaTagPrefix = 'KSC_';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
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

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramBattleOnly = getParamBoolean(['BattleOnly', '戦闘画面のみ有効']);

    //=============================================================================
    // Game_Battler
    //  ターン終了時にスキルごとに定められたコストを消費します。
    //=============================================================================
    var _Game_Battler_onTurnEnd = Game_Battler.prototype.onTurnEnd;
    Game_Battler.prototype.onTurnEnd = function() {
        _Game_Battler_onTurnEnd.apply(this, arguments);
        if (this.isAlive() && (!paramBattleOnly || $gameParty.inBattle())) this.consumeKeepCost();
    };

    Game_Battler.prototype.consumeKeepCost = function() {
        this.skills().forEach(function(skill) {
            this.consumeKeepCostHp(skill);
            this.consumeKeepCostMp(skill);
            this.consumeKeepCostTp(skill);
            this.consumeKeepCostVariable(skill);
            this.consumeKeepCostGold(skill);
        }.bind(this));
    };

    Game_Battler.prototype.consumeKeepCostHp = function(skill) {
        var cost = getMetaValues(skill, ['HP']);
        if (cost) this.gainHp(-(Math.min(getArgNumber(cost), this.maxSlipDamage())));
    };

    Game_Battler.prototype.consumeKeepCostMp = function(skill) {
        var cost = getMetaValues(skill, ['MP']);
        if (cost) this.gainMp(-getArgNumber(cost));
    };

    Game_Battler.prototype.consumeKeepCostTp = function(skill) {
        var cost = getMetaValues(skill, ['TP']);
        if (cost) this.gainSilentTp(-getArgNumber(cost));
    };

    Game_Battler.prototype.consumeKeepCostVariable = function(skill) {
        var cost1 = getMetaValues(skill, ['変数番号', 'VariableNumber']);
        var cost2 = getMetaValues(skill, ['変数値', 'VariableValue']);
        if (cost1 && cost2) {
            var number = getArgNumber(cost1);
            var value = $gameVariables.value(number);
            $gameVariables.setValue(number, value - getArgNumber(cost2));
        }
    };

    //=============================================================================
    // Game_Enemy
    //  ターン終了時にスキルごとに定められたコストを消費します。
    //=============================================================================
    Game_Actor.prototype.consumeKeepCostGold = function(skill) {
        var cost = getMetaValues(skill, ['お金', 'Gold']);
        if (cost) $gameParty.loseGold(getArgNumber(cost));
    };

    //=============================================================================
    // Game_Enemy
    //  所持しているスキルの一覧を取得可能にします。
    //=============================================================================
    Game_Enemy.prototype.consumeKeepCostGold = function(skill) {};

    Game_Enemy.prototype.skills = function() {
        var actionList = this.enemy().actions.filter(function(a) {
            return this.isActionValid(a);
        }, this);
        return actionList.map(function(action) {
            return $dataSkills[action.skillId];
        });
    };
})();

