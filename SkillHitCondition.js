/*=============================================================================
 SkillHitCondition.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.1 2023/06/11 1.2.0の機能で手動で無効スキルを使用したときに失敗メッセージが表示されない問題を修正
 1.2.0 2022/11/07 敵キャラもしくは自動戦闘の場合に命中条件を満たさない行動を除外するよう修正
 1.1.0 2022/11/07 MZ版としてリファクタリング
 1.0.0 2022/11/06 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc スキル命中条件設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SkillHitCondition.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param conditionList
 * @text 命中条件設定リスト
 * @desc スキルやアイテムの命中条件設定リストです。
 * @default []
 * @type struct<Condition>[]
 *
 * @help SkillHitCondition.js
 *
 * スキルやアイテムに特殊な命中条件を設定できます。
 * 特定のステートに掛かっていないと必ず失敗するスキルなどが作れます。
 *
 * スキルやアイテムのメモ欄に以下を設定します。
 * idはプラグインパラメータで指定する識別子です。
 * <HitCondition:id>
 *　
 * 条件を満たさず実行しても失敗するだけでスキル自体は使用できます。
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

/*~struct~Condition:
 * @param id
 * @text 識別子
 * @desc スキルやアイテムのメモタグで指定する識別子です。一意の値を指定してください。
 * @default id
 *
 * @param subjectState
 * @text 使用者ステート
 * @desc 使用者が指定したステートに掛かっている場合に行動が成功します。
 * @default 0
 * @type state
 *
 * @param targetState
 * @text 対象者ステート
 * @desc 対象者が指定したステートに掛かっている場合に行動が成功します。
 * @default 0
 * @type state
 *
 * @param subjectTag
 * @text 使用者タグ
 * @desc 使用者が指定した名称のタグ<aaa>を持っている場合に行動が成功します。
 * @default
 *
 * @param targetTag
 * @text 対象者タグ
 * @desc 対象者が指定した名称のタグ<aaa>を持っている場合に行動が成功します。
 * @default
 *
 * @param switchId
 * @text スイッチ
 * @desc 指定したスイッチがONのときに行動が成功します。
 * @default 0
 * @type switch
 *
 * @param script
 * @text スクリプト
 * @desc 指定したスクリプトの実行結果がtrueのときに行動が成功します。
 * @default
 * @type combo
 * @option subject.hpRate() < 0.5; // 使用者のHPが50%以下
 * @option target.mp === 0; // 対象者のmpが0
 *
 * @param reverse
 * @text 反転
 * @desc すべての条件を反転し、条件を満たしたときに行動が『失敗』します。
 * @default false
 * @type boolean
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.conditionList) {
        param.conditionList = [];
    }

    const _Game_Action_itemHit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function(target) {
        const result = _Game_Action_itemHit.apply(this, arguments);
        return this.isValidHitCondition(target) ? result : 0;
    };

    Game_Action.prototype.isValidHitCondition = function(target) {
        const id = PluginManagerEx.findMetaValue(this.item(), 'HitCondition');
        if (!id) {
            return true;
        }
        const idNumber = parseInt(id) - 1;
        return param.conditionList
            .filter((item, index) => item.id === id || index === idNumber)
            .every(item => this.isValidHitConditionItem(target, item));
    };

    Game_Action.prototype.isValidHitConditionItem = function(target, currentItem) {
        const subject = this.subject();
        const conditions = [];
        conditions.push(item => !item.subjectState || subject.isStateAffected(item.subjectState));
        conditions.push(item => !item.targetState || target.isStateAffected(item.targetState));
        conditions.push(item => !item.subjectTag || subject.hasHitConditionTag(item.subjectTag));
        conditions.push(item => !item.targetTag || target.hasHitConditionTag(item.targetTag));
        conditions.push(item => !item.switchId || $gameSwitches.value(item.switchId));
        conditions.push(item => !item.script || eval(item.script));
        const result = conditions.every(condition => condition(currentItem));
        return currentItem.reverse ? !result : !!result;
    };

    Game_BattlerBase.prototype.hasHitConditionTag = function(tagName) {
        return this.traitObjects().some(obj => PluginManagerEx.findMetaValue(obj, tagName));
    };

    Game_Battler.prototype.isValidHitCondition = function(skillId) {
        const gameAction = new Game_Action(this, false);
        gameAction.setSkill(skillId);
        return gameAction.opponentsUnit().members().some(target => gameAction.isValidHitCondition(target));
    };

    const _Game_Enemy_isActionValid = Game_Enemy.prototype.isActionValid;
    Game_Enemy.prototype.isActionValid = function(action) {
        const result = _Game_Enemy_isActionValid.apply(this, arguments);
        return result && this.isValidHitCondition(action.skillId);
    };

    const _Game_Actor_makeActionList = Game_Actor.prototype.makeActionList;
    Game_Actor.prototype.makeActionList = function() {
        const list = _Game_Actor_makeActionList.apply(this, arguments);
        return list.filter(action => this.isValidHitCondition(action.item().id));
    };

    let hitConditionAction = null;

    const _Game_Action_makeTargets = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function() {
        if (!this.subject().isNeedTargetFilter()) {
            return _Game_Action_makeTargets.apply(this, arguments);
        }
        hitConditionAction = this;
        const targets = _Game_Action_makeTargets.apply(this, arguments);
        hitConditionAction = null;
        return targets;
    };

    Game_BattlerBase.prototype.isNeedTargetFilter = function() {
        return true;
    };

    Game_Actor.prototype.isNeedTargetFilter = function() {
        return this.isAutoBattle();
    };

    Game_Unit.prototype.filterHitCondition = function(members) {
        if (hitConditionAction) {
            const action = hitConditionAction;
            hitConditionAction = null;
            members = members.filter(battler => action.isValidHitCondition(battler));
            hitConditionAction = action;
        }
        return members;
    };

    const _Game_Party_members = Game_Party.prototype.members;
    Game_Party.prototype.members = function() {
        return this.filterHitCondition(_Game_Party_members.apply(this, arguments));
    };

    const _Game_Troop_members = Game_Troop.prototype.members;
    Game_Troop.prototype.members = function() {
        return this.filterHitCondition(_Game_Troop_members.apply(this, arguments));
    };
})();
