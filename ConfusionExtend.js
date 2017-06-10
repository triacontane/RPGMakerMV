//=============================================================================
// ConfusionExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2017/06/10 制約「敵を攻撃」の場合に味方対象スキルを実行した場合、対象を味方にするよう修正
//                  使用可能スキルに除外設定を追加
// 1.2.0 2017/05/02 使用可能なスキルの中からランダムで使用する機能を追加
// 1.1.0 2016/11/12 裏切り機能と味方対象スキルの対象を反転させる機能を追加
// 1.0.0 2016/08/13 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Confusion Extend Plugin
 * @author triacontane
 *
 * @param TargetFriendSkill
 * @desc ONにすると行動制約が「味方を攻撃」のときに味方対象のスキルを使用すると、敵を対象にします。
 * @default OFF
 *
 * @help 混乱系（行動制約のプルダウンの選択値が「1」～「3」）ステートの
 * 指定内容を以下の通り拡張します。
 * ・通常攻撃ではなく指定したスキル（複数指定可能）を勝手に使用する。
 * ・スキルが全て使用できない場合に使用する予備スキルも指定可能。
 * ・バトラーが元々持っているスキルを勝手に使用する。
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
 * <CEスキル1:3>      # 通常攻撃の代わりにID[3..5]のスキルが使用されます。
 * <CEスキル2:4>      # 4番目以降も同様に指定可能です。
 * <CEスキル3:5>      #
 * <CE使用可能スキル> # 使用可能なスキルが全て候補になります。
 * <CE予備スキル:6>   # 指定されたスキルがMP不足等の理由ですべて
 *                      使用できない場合、ID[6]のスキルが使用されます。
 * <CEターゲット:0>   # 単体スキルの対象を[0]番目のキャラクターに指定します。
 *                      メモ欄の指定がない場合はランダムで決定されます。
 *
 * 使用可能スキルを指定する際、使わせたくないスキルを別途指定できます。
 * <CE使用可能スキル:1,2,3> # 使用可能スキルのうち[1][2][3]を候補から外します。
 *
 * ・追加機能
 * 裏切り機能を有効にすると対象のステートが有効になっているバトラーが
 * 敵や混乱スキルの攻撃対象から外れ、さらにそのバトラー以外が戦闘不能になると
 * 全滅扱いになります。
 *
 * 特徴を有するデータベースのメモ欄に、以下の通り記述してください。
 * <CE裏切り>    # 対象バトラーが一時的に味方から外れます。
 * <CEBetrayal>  # 同上
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 混乱ステート拡張プラグイン
 * @author トリアコンタン
 *
 * @param 味方対象スキルの対象
 * @desc ONにすると行動制約が「味方を攻撃」のときに味方対象のスキルを使用すると、敵を対象にします。
 * @default OFF
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
 * <CEスキル1:3>      # 通常攻撃の代わりにID[3..5]のスキルが使用されます。
 * <CEスキル2:4>      # 4番目以降も同様に指定可能です。
 * <CEスキル3:5>      #
 * <CE使用可能スキル> # 使用可能なスキルが全て候補になります。
 * <CE予備スキル:6>   # 指定されたスキルがMP不足等の理由ですべて
 *                      使用できない場合、ID[6]のスキルが使用されます。
 * <CEターゲット:0>   # 単体スキルの対象を[0]番目のキャラクターに指定します。
 *                      メモ欄の指定がない場合はランダムで決定されます。
 *
 * 使用可能スキルを指定する際、使わせたくないスキルを別途指定できます。
 * <CE使用可能スキル:1,2,3> # 使用可能スキルのうち[1][2][3]を候補から外します。
 *
 * ・追加機能
 * 裏切り機能を有効にすると対象のステートが有効になっているバトラーが
 * 敵や混乱スキルの攻撃対象から外れ、さらにそのバトラー以外が戦闘不能になると
 * 全滅扱いになります。
 *
 * 特徴を有するデータベースのメモ欄に、以下の通り記述してください。
 * <CE裏切り>    # 対象バトラーが一時的に味方から外れます。
 * <CEBetrayal>  # 同上
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
    var pluginName    = 'ConfusionExtend';
    var metaTagPrefix = 'CE';

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

    var getArgArrayNumber = function(args, min, max) {
        var values = getArgArrayString(args, false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) {
            values[i] = (parseFloat(values[i], 10) || 0).clamp(min, max);
        }
        return values;
    };

    var getArgArrayString = function(args) {
        var values = args.split(',');
        for (var i = 0; i < values.length; i++) {
            values[i] = values[i].trim();
        }
        return values;
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
    var paramTargetFriendSkill = getParamBoolean(['TargetFriendSkill', '味方対象スキルの対象']);

    //=============================================================================
    // Game_BattlerBase
    //  行動制約が有効なステートデータを取得します。
    //=============================================================================
    Game_BattlerBase.prototype.getRestrictStates = function() {
        var restriction = this.restriction();
        if (restriction === 0 || restriction >= 4) return [];
        return this.states().filter(function(state) {
            return state.restriction === restriction;
        });
    };

    Game_BattlerBase.prototype.getRestrictState = function() {
        return this.getRestrictStates().sort(this.compareOrderStatePriority.bind(this))[0];
    };

    Game_BattlerBase.prototype.compareOrderStatePriority = function(stateA, stateB) {
        return stateA.priority - stateB.priority;
    };

    Game_BattlerBase.prototype.isBetrayer = function() {
        return this.traitObjects().some(function(traitObject) {
            return getMetaValues(traitObject, ['裏切り', 'Betrayal']);
        });
    };

    Game_BattlerBase.prototype.getUsableSkillIdList = function() {
        return [this.attackSkillId(), this.guardSkillId()];
    };

    //=============================================================================
    // Game_Actor
    //  使用可能なスキル一覧を取得します。
    //=============================================================================
    Game_Actor.prototype.getUsableSkillIdList = function() {
        var skillIds = this.usableSkills().map(function(skill) {
            return skill.id;
        });
        return Game_BattlerBase.prototype.getUsableSkillIdList.call(this).concat(skillIds);
    };

    //=============================================================================
    // Game_Enemy
    //  使用可能なスキル一覧を取得します。
    //=============================================================================
    Game_Enemy.prototype.getUsableSkillIdList = function() {
        var actionList = this.enemy().actions.filter(function(a) {
            return this.isActionValid(a);
        }, this);
        return actionList.map(function(action) {
            return action.skillId;
        });
    };

    //=============================================================================
    // Game_Unit
    //  裏切り機能を追加します。
    //=============================================================================
    var _Game_Unit_aliveMembers = Game_Unit.prototype.aliveMembers;
    Game_Unit.prototype.aliveMembers = function() {
        var members = _Game_Unit_aliveMembers.apply(this, arguments);
        return members.filter(function(member) {
            return !member.isBetrayer();
        });
    };

    //=============================================================================
    // Game_Action
    //  混乱時のスキルを別途設定します。
    //=============================================================================
    var _Game_Action_setConfusion      = Game_Action.prototype.setConfusion;
    Game_Action.prototype.setConfusion = function() {
        _Game_Action_setConfusion.apply(this, arguments);
        var skillIds = this.getConfusionSkills();
        if (!skillIds) return;
        skillIds = skillIds.filter(function(skillId) {
            return this.subject().canUse($dataSkills[skillId]);
        }.bind(this));
        if (skillIds.length > 0) {
            this.setConfusionSkill(skillIds);
        } else {
            this.setConfusionSpareSkill();
        }
    };

    Game_Action.prototype.getConfusionSkills = function() {
        var state = this.getRestrictState();
        if (!state) return null;
        var skillIds = [], i = 1;
        while (i) {
            var metaValue = getMetaValues(state, ['スキル' + i, 'Skill' + i]);
            if (metaValue) {
                skillIds.push(getArgNumber(metaValue, 1));
                i++;
            } else {
                i = (i > 10 ? null : i + 1);
            }
        }
        return skillIds.concat(this.getConfusionUsableSkills(state));
    };

    Game_Action.prototype.getConfusionUsableSkills = function(state) {
        var usableSkillInclude = getMetaValues(state, ['使用可能スキル', 'UsableSkill']);
        var skillList = [];
        if (usableSkillInclude) {
            skillList = this.subject().getUsableSkillIdList();
            if (usableSkillInclude !== true) {
                skillList = this.filterConfusionUsableSkills(skillList, usableSkillInclude);
            }
        }
        return skillList;
    };

    Game_Action.prototype.filterConfusionUsableSkills = function(skillList, usableSkillInclude) {
        var filterList = getArgArrayNumber(usableSkillInclude);
        skillList = skillList.filter(function(skillId) {
            return !filterList.contains(skillId);
        });
        return skillList;
    };

    Game_Action.prototype.getRestrictState = function() {
        return this.subject().getRestrictState();
    };

    Game_Action.prototype.isExistConfusionSkill = function() {
        var skillIds = this.getConfusionSkills();
        return skillIds && skillIds.length > 0;
    };

    Game_Action.prototype.setConfusionSkill = function(skillIds) {
        var skillId = skillIds[Math.randomInt(skillIds.length)];
        this.setSkill(skillId);
    };

    Game_Action.prototype.setConfusionSpareSkill = function() {
        var state = this.getRestrictState();
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
        if (this.isExistConfusionSkill()) {
            target = this.confusionSkillTarget();
        }
        return target;
    };

    Game_Action.prototype.confusionSkillTarget = function() {
        var state = this.getRestrictState();
        var value = getMetaValues(state, ['ターゲット', 'Target']);
        if (value) {
            this._targetIndex = getArgNumber(value, 0);
        }
        if (this.isForUser()) {
            return this.subject();
        }
        return this.isConfusionSkillTargetForFriend() ? this.targetsForFriends() : this.targetsForOpponents();
    };

    Game_Action.prototype.isConfusionSkillTargetForFriend = function() {
        switch (this.subject().confusionLevel()) {
            case 1:
                return this.isForFriend();
            case 2:
                return Math.randomInt(2) === 0;
            case 3:
                return !this.isConfusionSkillTargetReverse();
        }
        return false;
    };

    Game_Action.prototype.isConfusionSkillTargetReverse = function() {
        return paramTargetFriendSkill && this.isForFriend();
    };
})();

