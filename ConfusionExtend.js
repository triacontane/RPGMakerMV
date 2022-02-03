//=============================================================================
// ConfusionExtend.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.1.1 2022/02/04 2.1.0の機能で使用者を対象にしたスキルを指定した場合は、使用者に対してスキルが発動するよう変更
// 2.1.0 2022/02/03 混乱スキルの対象者から使用者本人を除外できる設定を追加
// 2.0.0 2021/03/28 MZで動作するよう全面的に再構築
// 1.5.0 2020/05/23 混乱スキルの指定で、最後に使用したスキルを選択できる機能を追加
// 1.4.1 2020/04/22 混乱スキルのターゲットが「敵n体ランダム」のとき全体攻撃になってしまう問題を修正
// 1.4.0 2017/10/07 混乱スキルのターゲット選択方法にラストターゲット(直前に選択した対象)を追加しました。
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
 * @plugindesc ConfusionExtend
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ConfusionExtend.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param List
 * @desc This is a configuration list of confusion states for which you want to extend the specification.
 * @default []
 * @type struct<Record>[]
 *
 * @help ConfusionExtend.js
 *
 * The confusion system (action constraint pull-down selection value of "1" to "3")
 * state will be expanded to allow you to specify the skill used and target in detail.
 * The settings are done from the plugin parameters.
 *
 * Who to target is determined by the state's action constraint type,
 * the skill's effect range, and the target setting specified in the parameter.
 *
 */
/*:ja
 * @plugindesc 混乱ステート拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ConfusionExtend.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param List
 * @text 混乱ステートリスト
 * @desc 仕様を拡張したい混乱ステートの設定リストです。同一ステートの行は複数定義できません。
 * @default []
 * @type struct<Record>[]
 *
 * @help ConfusionExtend.js
 *
 * 混乱系（行動制約のプルダウンの選択値が「1」～「3」）ステートを拡張し、
 * 使用スキルやターゲットを細かく指定できるようになります。
 * 設定はプラグインパラメータから行います。
 *
 * 誰をターゲットにするかは、ステートの行動制約の種類とスキルの効果範囲
 * およびパラメータで指定したターゲット設定によって決まります。
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

/*~struct~Record:
 *
 * @param StateId
 * @text ステートID
 * @desc 対象のステートです。行動制約が設定されたステートを指定してください。
 * @default 0
 * @type state
 *
 * @param SkillList
 * @text スキルリスト
 * @desc 混乱時に使用するスキルのリストです。
 * @default []
 * @type skill[]
 *
 * @param UsableSkill
 * @text 使用可能スキル
 * @desc 有効にすると持っているスキルを使用候補に追加します。
 * @default false
 * @type boolean
 *
 * @param LastSkill
 * @text 直前スキル
 * @desc 有効にすると直前に誰かが使用したスキルを使用候補に追加します。
 * @default false
 * @type boolean
 *
 * @param SkillFilterList
 * @text 対象外スキルリスト
 * @desc 指定したスキルを使用候補から除外します。
 * @default []
 * @type skill[]
 *
 * @param SpareSkill
 * @text 予備スキル
 * @desc 使用可能なスキルがなかった場合に代わりに使用されるスキルです。
 * @default 0
 * @type skill
 *
 * @param TargetActorId
 * @text 対象アクター
 * @desc 指定されたIDのアクターをターゲットにします。もともとの対象がアクター側でない場合、無効です。
 * @default 0
 * @type actor
 *
 * @param TargetEnemyId
 * @text 対象敵キャラ
 * @desc 指定されたIDの敵キャラをターゲットにします。もともとの対象が敵キャラ側でない場合、無効です。
 * @default 0
 * @type enemy
 *
 * @param TargetIndex
 * @text 対象インデックス
 * @desc 指定されたインデックスのアクターもしくは敵キャラをターゲットにします。(先頭:1)
 * @default 0
 * @type number
 *
 * @param LastTarget
 * @text 直前ターゲット
 * @desc 有効にすると直前にターゲットされたアクターもしくは敵キャラをターゲットにします。
 * @default false
 * @type boolean
 *
 * @param RemoveUser
 * @text 使用者を除外
 * @desc 有効にするとスキルの対象から本人が除外されます。ただし対象が『使用者』のスキルを指定すると通常通り使用します。
 * @default false
 * @type boolean
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_BattlerBase
    //  行動制約が有効なステートデータを取得します。
    //=============================================================================
    Game_BattlerBase.prototype.getRestrictStates = function() {
        const restriction = this.restriction();
        if (restriction === 0 || restriction >= 4) {
            return [];
        }
        return this.states().filter(state => state.restriction === restriction);
    };

    Game_BattlerBase.prototype.getRestrictState = function() {
        return this.getRestrictStates().sort(this.compareOrderStatePriority.bind(this))[0];
    };

    Game_BattlerBase.prototype.compareOrderStatePriority = function(stateA, stateB) {
        return stateA.priority - stateB.priority;
    };

    Game_BattlerBase.prototype.getUsableSkillIdList = function() {
        return [this.attackSkillId(), this.guardSkillId()];
    };

    //=============================================================================
    // Game_Actor
    //  使用可能なスキル一覧を取得します。
    //=============================================================================
    Game_Actor.prototype.getUsableSkillIdList = function() {
        const skillIds = this.usableSkills().map(skill => skill.id);
        return Game_BattlerBase.prototype.getUsableSkillIdList.call(this).concat(skillIds);
    };

    //=============================================================================
    // Game_Enemy
    //  使用可能なスキル一覧を取得します。
    //=============================================================================
    Game_Enemy.prototype.getUsableSkillIdList = function() {
        return this.enemy().actions
            .filter(a => this.isActionValid(a))
            .map(a => a.skillId);
    };

    //=============================================================================
    // Game_Action
    //  混乱時のスキルを別途設定します。
    //=============================================================================
    const _Game_Action_setConfusion      = Game_Action.prototype.setConfusion;
    Game_Action.prototype.setConfusion = function() {
        _Game_Action_setConfusion.apply(this, arguments);
        this.setupConfusionExtendSkill();
    };

    Game_Action.prototype.findConfusionExtend = function() {
        const state = this.subject().getRestrictState();
        if (!state) {
            return null;
        }
        return param.List.filter(item => item.StateId === state.id)[0];
    };

    Game_Action.prototype.setupConfusionExtendSkill = function() {
        const extend = this.findConfusionExtend();
        if (!extend) {
            return;
        }
        let skillIds = extend.SkillList.clone() || [];
        if (extend.UsableSkill) {
            skillIds = skillIds.concat(this.subject().getUsableSkillIdList());
        }
        if (extend.LastSkill) {
            const lastSkill = $gameTemp.lastActionData(0);
            if (lastSkill) {
                skillIds.push(lastSkill);
            }
        }
        if (extend.SkillFilterList) {
            skillIds = skillIds.filter(id => !extend.SkillFilterList.includes(id));
        }
        skillIds = skillIds.filter(skillId => this.subject().canUse($dataSkills[skillId]));
        if (skillIds.length > 0) {
            const skillId = skillIds[Math.randomInt(skillIds.length)];
            this.setSkill(skillId);
        } else if (extend.SpareSkill) {
            this.setSkill(extend.SpareSkill);
        }
    };

    const _Game_Action_repeatTargets      = Game_Action.prototype.repeatTargets;
    Game_Action.prototype.repeatTargets = function(targets) {
        if (Array.isArray(targets[0])) {
            arguments[0] = targets[0];
        }
        return _Game_Action_repeatTargets.apply(this, arguments);
    };

    const _Game_Action_confusionTarget      = Game_Action.prototype.confusionTarget;
    Game_Action.prototype.confusionTarget = function() {
        const target = _Game_Action_confusionTarget.apply(this, arguments);
        const extend = this.findConfusionExtend();
        if (extend) {
            return this.setupConfusionExtendTarget(target, extend);
        }
        return target;
    };

    Game_Action.prototype.setupConfusionExtendTarget = function(preTarget, extend) {
        const targetUnit = this.isForFriend() ? preTarget.opponentsUnit() : preTarget.friendsUnit();
        const subject = this.subject();
        if (extend.RemoveUser) {
            subject.friendsUnit().setConfusionSubject(this.subject());
        }
        this.setConfusionTarget(targetUnit, extend);
        const targets = this.targetsForConfusion(targetUnit, subject);
        subject.friendsUnit().setConfusionSubject(null);
        return targets;
    };

    Game_Action.prototype.targetsForConfusion = function(unit, subject) {
        if (this.isForRandom()) {
            return this.randomTargets(unit);
        } else if (this.isForEveryone()) {
            return this.targetsForEveryone();
        } else if (this.isForOpponent()) {
            return this.targetsForAlive(unit);
        } else if (this.isForUser()) {
            return [subject];
        } else if (this.isForDeadFriend()) {
            return this.targetsForDead(unit);
        } else if (this.isForAliveFriend()) {
            return this.targetsForAlive(unit);
        } else {
            return this.targetsForDeadAndAlive(unit);
        }
    };

    Game_Action.prototype.setConfusionTarget = function(targetUnit, extend) {
        let targets = [];
        if (extend.TargetActorId && targetUnit === $gameParty) {
            targets = targetUnit.members().filter(member => member.actorId() === extend.TargetActorId);
        } else if (extend.TargetEnemyId && targetUnit === $gameTroop) {
            targets = targetUnit.members().filter(member => member.enemyId() === extend.TargetEnemyId);
        }
        if (targets.length > 0) {
            const target = targets[Math.randomInt(targets.length)];
            this._targetIndex = targetUnit.members().indexOf(target);
        } else if (extend.TargetIndex) {
            this._targetIndex = extend.TargetIndex - 1;
        } else if (extend.LastTarget) {
            if (targetUnit === $gameParty) {
                const actorId = $gameTemp.lastActionData(4);
                this._targetIndex = targetUnit.members().map(actor => actor.actorId()).indexOf(actorId);
            } else {
                this._targetIndex = $gameTemp.lastActionData(5) - 1;
            }
        }
    };

    Game_Unit.prototype.setConfusionSubject = function(battler) {
        this._confusionSubject = battler;
    };

    Game_Unit.prototype.filterConfusionSubject = function(member) {
        if (!this._confusionSubject) {
            return member;
        }
        return member.filter(battler => battler !== this._confusionSubject);
    };

    const _Game_Party_members = Game_Party.prototype.members;
    Game_Party.prototype.members = function() {
        const members = _Game_Party_members.apply(this, arguments);
        return this.filterConfusionSubject(members);
    };

    const _Game_Troop_members = Game_Troop.prototype.members;
    Game_Troop.prototype.members = function() {
        const members = _Game_Troop_members.apply(this, arguments);
        return this.filterConfusionSubject(members);
    };
})();
