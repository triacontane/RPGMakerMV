//=============================================================================
// ConfusionExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/08/13 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Confusion Extend Plugin
 * @author triacontane
 *
 * @help 混乱系（行動制約のプルダウンの選択値が「1」～「3」）ステートの
 * 指定内容を拡張し、通常攻撃ではなくスキル（複数指定可能）を指定したり
 * さらにそれらのスキルがすべて使用できない場合に使用する予備スキルも
 * 指定できます。
 *
 * 誰をターゲットにするかは、ステートの行動制約の種類と使用スキルの効果範囲
 * およびメモ欄で設定した値によって決まります。
 *
 * ・スキルの効果範囲が「使用者」の場合
 * 行動制約の種類とは無関係に、対象は必ず「使用者」になります。
 *
 * ・行動制約が「敵を攻撃」の場合
 * 対象は「敵単体」(メモ欄指定対象もしくはランダム)か「敵全体」になります。
 *
 * ・行動制約が「誰かを攻撃」の場合
 * 対象は「敵単体」(メモ欄指定対象もしくはランダム)か「敵全体」もしくは
 * 「味方単体」(メモ欄指定対象もしくはランダム)か「味方全体」になります。
 *
 * ・行動制約が「味方を攻撃」の場合
 * 対象は「味方単体」(メモ欄指定対象もしくはランダム)か「味方全体」になります。
 *
 * 1. ステートのデータベースで行動制作のプルダウンを指定してください。
 * ・敵を攻撃
 * ・誰かを攻撃
 * ・味方を攻撃
 *
 * 2. ステートのメモ欄を以下の通り指定してください。
 * <CEスキル1:3>    # 通常攻撃の代わりにID[3..5]のスキルが使用されます。
 * <CEスキル2:4>    # 4番目以降も同様に指定可能です。
 * <CEスキル3:5>    #
 * <CE予備スキル:6> # 指定されたスキルがMP不足等の理由ですべて
 *                    使用できない場合、ID[6]のスキルが使用されます。
 * <CEターゲット:0> # 単体スキルの対象を[0]番目のキャラクターに指定します。
 *                    メモ欄の指定がない場合はランダムで決定されます。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 混乱ステート拡張プラグイン
 * @author トリアコンタン
 *
 * @help 混乱系（行動制約のプルダウンの選択値が「1」～「3」）ステートの
 * 指定内容を拡張し、通常攻撃ではなくスキル（複数指定可能）を指定したり
 * さらにそれらのスキルがすべて使用できない場合に使用する予備スキルも
 * 指定できます。
 *
 * 誰をターゲットにするかは、ステートの行動制約の種類と使用スキルの効果範囲
 * およびメモ欄で設定した値によって決まります。
 *
 * ・スキルの効果範囲が「使用者」の場合
 * 行動制約の種類とは無関係に、対象は必ず「使用者」になります。
 *
 * ・行動制約が「敵を攻撃」の場合
 * 対象は「敵単体」(メモ欄指定対象もしくはランダム)か「敵全体」になります。
 *
 * ・行動制約が「誰かを攻撃」の場合
 * 対象は「敵単体」(メモ欄指定対象もしくはランダム)か「敵全体」もしくは
 * 「味方単体」(メモ欄指定対象もしくはランダム)か「味方全体」になります。
 *
 * ・行動制約が「味方を攻撃」の場合
 * 対象は「味方単体」(メモ欄指定対象もしくはランダム)か「味方全体」になります。
 *
 * 1. ステートのデータベースで行動制作のプルダウンを指定してください。
 * ・敵を攻撃
 * ・誰かを攻撃
 * ・味方を攻撃
 *
 * 2. ステートのメモ欄を以下の通り指定してください。
 * <CEスキル1:3>    # 通常攻撃の代わりにID[3..5]のスキルが使用されます。
 * <CEスキル2:4>    # 4番目以降も同様に指定可能です。
 * <CEスキル3:5>    #
 * <CE予備スキル:6> # 指定されたスキルがMP不足等の理由ですべて
 *                    使用できない場合、ID[6]のスキルが使用されます。
 * <CEターゲット:0> # 単体スキルの対象を[0]番目のキャラクターに指定します。
 *                    メモ欄の指定がない場合はランダムで決定されます。
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
    var metaTagPrefix = 'CE';

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
    // Game_BattlerBase
    //  行動制約が有効なステートデータを取得します。
    //=============================================================================
    Game_BattlerBase.prototype.getRestrictState = function() {
        var restriction = this.restriction();
        if (restriction === 0 || restriction >= 4) return null;
        return this.states().filter(function(state) {
            return state.restriction === restriction;
        })[0];
    };

    //=============================================================================
    // Game_Action
    //  混乱時のスキルを別途設定します。
    //=============================================================================
    var _Game_Action_setConfusion      = Game_Action.prototype.setConfusion;
    Game_Action.prototype.setConfusion = function() {
        _Game_Action_setConfusion.apply(this, arguments);
        var state = this.subject().getRestrictState();
        if (!state) return;
        var skillIds = [], i = 1;
        while (i) {
            var value = getMetaValues(state, ['スキル' + i, 'Skill' + i]);
            if (value) {
                skillIds.push(getArgNumber(value, 1));
                i++;
            } else {
                i = null;
            }
        }
        skillIds = skillIds.filter(function(skillId) {
            return this.subject().canUse($dataSkills[skillId]);
        }.bind(this));
        if (skillIds.length > 0) {
            this.setConfusionSkill(skillIds);
        } else {
            this.setConfusionSpareSkill();
        }
    };

    Game_Action.prototype.setConfusionSkill = function(skillIds) {
        var skillId = skillIds[Math.randomInt(skillIds.length)];
        this.setSkill(skillId);
    };

    Game_Action.prototype.setConfusionSpareSkill = function() {
        var state = this.subject().getRestrictState();
        var value = getMetaValues(state, ['予備スキル', 'SpareSkill']);
        if (value) {
            var skillId = getArgNumber(value, 1);
            if (this.subject().canUse($dataSkills[skillId])) {
                this.setSkill(skillId);
            }
        }
    };

    var _Game_Action_repeatTargets = Game_Action.prototype.repeatTargets;
    Game_Action.prototype.repeatTargets = function(targets) {
        if (Array.isArray(targets[0])) arguments[0] = targets[0];
        return _Game_Action_repeatTargets.apply(this, arguments);
    };

    var _Game_Action_confusionTarget = Game_Action.prototype.confusionTarget;
    Game_Action.prototype.confusionTarget = function() {
        var target = _Game_Action_confusionTarget.apply(this, arguments);
        if (this.item().id !== this.subject().attackSkillId()) {
            target = this.confusionTargetsCustom();
        }
        return target;
    };

    Game_Action.prototype.confusionTargetsCustom = function() {
        var state = this.subject().getRestrictState();
        var value = getMetaValues(state, ['ターゲット', 'Target']);
        if (value) {
            this._targetIndex = getArgNumber(value, 0);
        }
        if (this.isForUser()) {
            return this.subject();
        }
        switch (this.subject().confusionLevel()) {
            case 1:
                return this.targetsForOpponents();
            case 2:
                if (Math.randomInt(2) === 0) {
                    return this.targetsForOpponents();
                }
                return this.targetsForFriends();
            default:
                return this.targetsForFriends();
        }
    };
})();

