//=============================================================================
// KeepSkillCost.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2016/07/29 HPとMPの維持コストのポップアップがスキルごとに個別に出力されていた問題を修正
// 1.1.0 2016/07/29 YEP_SkillCore.jsと組み合わせてウィンドウにコストを表示できる機能を追加
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
 * YEP_SkillCore.jsと組み合わせると、スキルウィンドウに維持コストが
 * 出力されるようになります。当プラグインを下に配置してください。
 * ただし、出力される維持コストはHP,MP,TPのみです。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc スキル維持コストプラグイン
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
 * YEP_SkillCore.jsと組み合わせると、スキルウィンドウに維持コストが
 * 出力されるようになります。当プラグインを下に配置してください。
 * ただし、出力される維持コストはHP,MP,TPのみです。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

var Imported = Imported || {};

(function() {
    'use strict';
    var setting = {
        textColorCostHp:0,
        textColorCostMp:6,
        textColorCostTp:5
    };
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
        this._costHpSum = 0;
        this._costMpSum = 0;
        this.skills().forEach(function(skill) {
            this.consumeKeepCostHp(skill);
            this.consumeKeepCostMp(skill);
            this.consumeKeepCostTp(skill);
            this.consumeKeepCostVariable(skill);
            this.consumeKeepCostGold(skill);
        }.bind(this));
        if (this._costHpSum !== 0) this.gainHp(-(Math.min(this._costHpSum, this.maxSlipDamage())));
        if (this._costMpSum !== 0) this.gainMp(-this._costMpSum);
    };

    Game_Battler.prototype.consumeKeepCostHp = function(skill) {
        var cost = this.getKeepCostOf(skill, ['HP']);
        if (cost) this._costHpSum += cost;
    };

    Game_Battler.prototype.consumeKeepCostMp = function(skill) {
        var cost = this.getKeepCostOf(skill, ['MP']);
        if (cost) this._costMpSum += cost;
    };

    Game_Battler.prototype.consumeKeepCostTp = function(skill) {
        var cost = this.getKeepCostOf(skill, ['TP']);
        if (cost) this.gainSilentTp(-cost);
    };

    Game_Battler.prototype.consumeKeepCostVariable = function(skill) {
        var cost1 = this.getKeepCostOf(skill, ['変数番号', 'VariableNumber']);
        var cost2 = this.getKeepCostOf(skill, ['変数値', 'VariableValue']);
        if (cost1 && cost2) {
            var value = $gameVariables.value(cost1);
            $gameVariables.setValue(cost1, value - cost2);
        }
    };

    Game_Battler.prototype.getKeepCostOf = function(skill, params) {
        var cost = getMetaValues(skill, params);
        return cost ? getArgNumber(cost) : 0;
    };

    //=============================================================================
    // Game_Enemy
    //  ターン終了時にスキルごとに定められたコストを消費します。
    //=============================================================================
    Game_Actor.prototype.consumeKeepCostGold = function(skill) {
        var cost = this.getKeepCostOf(skill, ['お金', 'Gold']);
        if (cost) $gameParty.loseGold(cost);
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

    if (!Imported.YEP_SkillCore) return;

    //=============================================================================
    // Window_SkillList
    //  YEP_SkillCore.jsと組み合わせて維持コストを出力します。
    //=============================================================================
    var _Window_SkillList_drawSkillCost = Window_SkillList.prototype.drawSkillCost;
    Window_SkillList.prototype.drawSkillCost = function(skill, wx, wy, width) {
        this._keepCostExist = false;
        var dw = width;
        dw = this.drawKeepTpCost(skill, wx, wy, dw);
        dw = this.drawKeepMpCost(skill, wx, wy, dw);
        dw = this.drawKeepHpCost(skill, wx, wy, dw);
        if (this._keepCostExist) {
            dw = this.drawCostSlash(skill, wx, wy, dw);
        }
        arguments[3] = dw;
        return _Window_SkillList_drawSkillCost.apply(this, arguments);
    };

    Window_SkillList.prototype.drawCostSlash = function(skill, wx, wy, dw) {
        this.contents.fontSize = Yanfly.Param.SCCMpFontSize;
        var text = '/';
        this.drawText(text, wx, wy, dw, 'right');
        dw -= this.textWidth(text);
        this.resetFontSettings();
        return dw;
    };

    Window_SkillList.prototype.drawKeepTpCost = function(skill, wx, wy, dw) {
        var cost = this._actor.getKeepCostOf(skill, ['TP']);
        if (cost <= 0) return dw;
        this._keepCostExist = true;
        if (Yanfly.Icon.Tp > 0) {
            var iw = wx + dw - Window_Base._iconWidth;
            this.drawIcon(Yanfly.Icon.Tp, iw, wy + 2);
            dw -= Window_Base._iconWidth + 2;
        }
        this.changeTextColor(this.textColor(setting.textColorCostTp));
        var fmt = Yanfly.Param.SCCTpFormat;
        var text = fmt.format(Yanfly.Util.toGroup(cost),
            TextManager.tpA);
        this.contents.fontSize = Yanfly.Param.SCCTpFontSize;
        this.drawText(text, wx, wy, dw, 'right');
        var returnWidth = dw - this.textWidth(text) - Yanfly.Param.SCCCostPadding;
        this.resetFontSettings();
        return returnWidth;
    };

    Window_SkillList.prototype.drawKeepMpCost = function(skill, wx, wy, dw) {
        var cost = this._actor.getKeepCostOf(skill, ['MP']);
        if (cost <= 0) return dw;
        this._keepCostExist = true;
        if (Yanfly.Icon.Tp > 0) {
            var iw = wx + dw - Window_Base._iconWidth;
            this.drawIcon(Yanfly.Icon.Tp, iw, wy + 2);
            dw -= Window_Base._iconWidth + 2;
        }
        this.changeTextColor(this.textColor(setting.textColorCostMp));
        var fmt = Yanfly.Param.SCCMpFormat;
        var text = fmt.format(Yanfly.Util.toGroup(cost),
            TextManager.mpA);
        this.contents.fontSize = Yanfly.Param.SCCMpFontSize;
        this.drawText(text, wx, wy, dw, 'right');
        var returnWidth = dw - this.textWidth(text) - Yanfly.Param.SCCCostPadding;
        this.resetFontSettings();
        return returnWidth;
    };

    Window_SkillList.prototype.drawKeepHpCost = function(skill, wx, wy, dw) {
        var cost = this._actor.getKeepCostOf(skill, ['HP']);
        if (cost <= 0) return dw;
        this._keepCostExist = true;
        if (Yanfly.Icon.Hp > 0) {
            var iw = wx + dw - Window_Base._iconWidth;
            this.drawIcon(Yanfly.Icon.Hp, iw, wy + 2);
            dw -= Window_Base._iconWidth + 2;
        }
        this.changeTextColor(this.textColor(setting.textColorCostHp));
        var fmt = Yanfly.Param.SCCHpFormat;
        var text = fmt.format(Yanfly.Util.toGroup(cost),
            TextManager.hpA);
        this.contents.fontSize = Yanfly.Param.SCCHpFontSize;
        this.drawText(text, wx, wy, dw, 'right');
        var returnWidth = dw - this.textWidth(text) - Yanfly.Param.SCCCostPadding;
        this.resetFontSettings();
        return returnWidth;
    };
})();

