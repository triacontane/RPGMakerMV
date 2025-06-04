//=============================================================================
// RestrictionTargetSkill.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.6.1 2025/06/04 戦闘行動の強制で対象限定スキルを対象「ランダム」で使用したとき、一部の敵キャラが対象にならない問題を修正
// 2.6.0 2024/08/03 対象が誰もいないスキルを発動しようとしたとき、発動自体をスキップする機能を追加
// 2.5.12 2024/07/11 効果範囲「使用者」のスキルには本プラグインは適用されないことを明記
// 2.5.11 2024/04/23 ヘルプの記述を修正し、PluginCommonBaseのbaseアノテーションを追加
// 2.5.10 2024/01/02 範囲を「味方単体(無条件)」にしたスキルに制約を設定したとき、正常に対象を特定できない場合がある問題を修正
// 2.5.9 2023/05/13 制約対象のスキルやアイテムをID単位ではなくメモタグでまとめて指定できる機能を追加
// 2.4.0 2023/04/20 すべてのスキルの対象にならなくなる無敵タグを設定できる機能を追加
// 2.3.2 2022/10/17 自動戦闘の特徴が有効なとき、選択可能対象がいないスキルを選択対象外にするよう修正
// 2.3.1 2022/10/15 範囲を「なし」にしたスキルを敵が使わなくなる問題を修正
// 2.3.0 2022/09/07 選択できないバトラーをウィンドウから非表示にできる機能を追加(敵キャラのみ)
// 2.2.0 2022/04/25 スクリプトの評価結果がtrueのときに使用不可にできる機能を追加
// 2.1.2 2021/10/12 循環参照による競合が起こりにくい実装に変更
// 2.1.1 2021/10/11 2.1.0の更新でスキルに対する対象限定が効かなくなっていた問題を修正
// 2.1.0 2021/10/10 アイテムに対して制約を適用できるよう修正
// 2.0.0 2021/10/08 MZで動作するよう全面的に修正
// 1.2.1 2020/08/29 1.2.0で追加した機能による軽量化対策
// 1.2.0 2020/04/24 選択できないバトラーを無効表示する機能を追加
// 1.1.10 2018/06/04 DeadOrAliveItem.jsとの競合を解消
// 1.1.9 2018/02/28 選択可能対象が存在しないスキルは、敵キャラの使用スキルから除外するよう修正
// 1.1.8 2018/02/27 スクリプトに関するヘルプの記述が間違っていたので修正
// 1.1.7 2017/07/26 ステート全体化プラグイン（StateTotalization.js）との競合を解消
// 1.1.6 2017/06/28 混乱ステート拡張プラグイン（ConfusionExtend.js）との競合を解消
// 1.1.5 2017/06/12 敵が制約付きスキルを使用した際にエラーが発生する場合がある問題を修正
// 1.1.4 2017/06/04 1.1.3で戦闘行動のキャラクターに対するスキルが実行できなくなっていた問題を修正
// 1.1.3 2017/06/04 単体を対象にした制限スキルを実行したときに、選択した対象と実行対象がズレてしまう場合がある問題を修正
// 1.1.2 2017/01/12 メモ欄の値が空で設定された場合にエラーが発生するかもしれない問題を修正
// 1.1.1 2016/11/13 戦闘中に強制終了する場合がある不具合を修正
// 1.1.0 2016/09/29 使用者に対して無効なスキルを設定できる機能を追加
//                  アクター用と敵キャラ用とでメモ欄を分岐
// 1.0.0 2016/09/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 対象限定スキルプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/RestrictionTargetSkill.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param list
 * @text 対象限定スキルリスト
 * @desc 対象限定スキルの制約情報一覧を設定します。
 * @default []
 * @type struct<RESTRICTION>[]
 *
 * @param skipNoTarget
 * @text 対象なしスキップ
 * @desc スキル発動時に有効な対象がひとりもいなかったとき、スキルの発動をスキップします。
 * @default false
 * @type boolean
 *
 * @param invincibleNote
 * @text 無敵タグ
 * @desc 指定したメモ欄<xxx>ですべてのスキルを無効化できます。アクター、敵キャラ、武器、防具、職業、ステートが対象です。
 * @default
 *
 * @help RestrictionTargetSkill.js
 *
 * スキルの選択可能対象、使用可能対象を様々な条件で限定できます。
 * アクターや敵キャラを直接指定できるほか、メモタグによる一括指定や
 * 武具、ステートによる制御も可能です。
 * スキルの効果範囲によって以下の挙動となります。
 *
 * 単体スキル：限定した対象以外を選択できなくなります。
 * 全体スキル：限定した対象以外がスキルの効果から外れます。
 * 使用者スキル：本プラグインの効果は適用されません。
 *
 * 全体スキルは有効な対象がいない場合も使用自体は可能です。
 * 敵がスキルを使う場合や、自動戦闘、混乱、複数対象の場合も適用されます。
 *
 * パラメータから制約情報を設定してください。
 *
 * パラメータにメモタグを記載するときは、括弧は不要です。
 * メモ欄に記載するタグが<xxx>の場合、パラメータにはxxxと入力してください。
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

/*~struct~RESTRICTION:
 *
 * @param skillId
 * @text 対象スキルID
 * @desc 制約の対象となるスキルIDです。
 * @default 0
 * @type skill
 *
 * @param itemId
 * @text 対象アイテムID
 * @desc 制約の対象となるアイテムIDです。
 * @default 0
 * @type item
 *
 * @param tagName
 * @text 対象タグ名称
 * @desc 制約の対象となるタグ名称です。複数まとめて制約対象にできます。スキルやアイテムのメモ欄に記載します。例：<xxx>
 * @default
 *
 * @param validActors
 * @text 有効アクター
 * @desc 指定したアクターに対してのみ使用可能となります。空を指定した場合、条件は適用されません。
 * @default
 * @type actor[]
 *
 * @param invalidActors
 * @text 無効アクター
 * @desc 指定したアクターに対して使用不可となります。空を指定した場合、条件は適用されません。
 * @default
 * @type actor[]
 *
 * @param validEnemies
 * @text 有効敵キャラ
 * @desc 指定した敵キャラに対してのみ使用可能となります。空を指定した場合、条件は適用されません。
 * @default
 * @type enemy[]
 *
 * @param invalidEnemies
 * @text 無効敵キャラ
 * @desc 指定した敵キャラに対して使用不可となります。空を指定した場合、条件は適用されません。
 * @default
 * @type enemy[]
 *
 * @param validNote
 * @text 有効メモタグ
 * @desc 指定したメモ欄<xxx>を持つバトラーに対してのみ使用可能となります。アクター、敵キャラ、武器、防具、職業、ステートが対象。
 * @default
 *
 * @param invalidNote
 * @text 無効メモタグ
 * @desc 指定したメモ欄<xxx>を持つバトラーに対して使用不可となります。アクター、敵キャラ、武器、防具、職業、ステートが対象。
 * @default
 *
 * @param invalidUser
 * @text 使用者には無効
 * @desc スキルの使用者に対して使用不可となります。
 * @default false
 * @type boolean
 *
 * @param script
 * @text スクリプト
 * @desc スクリプトの実行結果がtrueを返した場合、使用不可となります。
 * @default
 * @type multiline_string
 *
 * @param invalidTargetHidden
 * @text 無効バトラー非表示
 * @desc スキルが使用できないバトラーを選択不可ではなく非表示にします。敵キャラが対象の場合だけ有効です。
 * @default false
 * @type boolean
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.list || param.list.length === 0) {
        param.list = [];
    }

    //=============================================================================
    // Game_BattlerBase
    //  スキルやアイテムの対象として選択可能かどうかを返します。
    //=============================================================================
    Game_Battler.prototype.isExistValidTarget = function(item) {
        if (item.scope === 0) {
            return true;
        }
        const trialAction = new Game_Action(this, false);
        trialAction.setItemObject(item);
        return trialAction.isExistTarget();
    };

    Game_Battler.prototype.deactivateSelect = function() {
        this._deactivateSelect = true;
    };

    Game_Battler.prototype.activateSelect = function() {
        this._deactivateSelect = false;
    };

    Game_Battler.prototype.isActivateSelect = function() {
        return !this._deactivateSelect;
    };

    Game_BattlerBase.prototype.findRestrictionData = function(item) {
        const isSkill = DataManager.isSkill(item);
        return param.list.find(data => this.isRestrictionData(data, item, isSkill));
    };

    Game_BattlerBase.prototype.isRestrictionData = function(data, item, isSkill) {
        if ((isSkill ? data.skillId : data.itemId) === item.id) {
            return true;
        } else if (!!item.meta[data.tagName]) {
            return true;
        } else {
            return false;
        }
    };

    Game_BattlerBase.prototype.findSomeRestrictionNote = function(tagName) {
        return this.traitObjects().some(obj => {
            return PluginManagerEx.findMetaValue(obj, tagName);
        });
    };

    Game_BattlerBase.prototype.canSelectTarget = function(item, user) {
        if (param.invincibleNote) {
            const result = this.findSomeRestrictionNote(param.invincibleNote);
            if (result) {
                return false;
            }
        }
        const data = this.findRestrictionData(item);
        if (!data) {
            return true;
        }
        if (data.invalidUser && user === this) {
            return false;
        }
        if (data.validNote) {
            return this.findSomeRestrictionNote(data.validNote);
        }
        if (data.script && !!eval(data.script)) {
            return false;
        }
        if (data.invalidNote) {
            return !this.findSomeRestrictionNote(data.invalidNote);
        }
        const restrictInfo = this.getRestrictInfo(data);
        if (restrictInfo.validList.length > 0) {
            return restrictInfo.validList.includes(restrictInfo.id);
        }
        if (restrictInfo.invalidList.length > 0) {
            return !restrictInfo.invalidList.includes(restrictInfo.id);
        }
        return true;
    };

    Game_BattlerBase.prototype.getRestrictInfo = function(data) {
        return null;
    }

    Game_Actor.prototype.getRestrictInfo = function(data) {
        return {
            id: this.actorId(),
            validList: data.validActors || [],
            invalidList: data.invalidActors || [],
        }
    };

    Game_Enemy.prototype.getRestrictInfo = function(data) {
        return {
            id: this.enemyId(),
            validList: data.validEnemies || [],
            invalidList: data.invalidEnemies || [],
        }
    };

    const _Game_Enemy_isActionValid = Game_Enemy.prototype.isActionValid;
    Game_Enemy.prototype.isActionValid = function(action) {
        return _Game_Enemy_isActionValid.apply(this, arguments) && this.isExistValidTarget($dataSkills[action.skillId]);
    };

    const _Game_Actor_makeActionList = Game_Actor.prototype.makeActionList;
    Game_Actor.prototype.makeActionList = function() {
        const list = _Game_Actor_makeActionList.apply(this, arguments);
        return list.filter(action => this.isExistValidTarget($dataSkills[action.item().id]));
    };

    //=============================================================================
    // Game_Action
    //  スキルやアイテムの対象として選択不可能な対象に選択しないようにします。
    //=============================================================================
    Game_Action.prototype.isExistTarget = function() {
        BattleManager.setTargetAction(this);
        let targets = [];
        if (this.isForOpponent()) {
            targets = this.targetsForOpponents();
        } else if (this.isForFriend()) {
            targets = this.targetsForFriends();
        }
        BattleManager.setTargetAction(null);
        return targets.length > 0 && targets[0] !== null;
    };

    const _Game_Action_subject = Game_Action.prototype.subject;
    Game_Action.prototype.subject = function() {
        $gameTroop.setNeedOriginalMemberCounter(true);
        const subject = _Game_Action_subject.apply(this, arguments);
        $gameTroop.setNeedOriginalMemberCounter(false);
        return subject;
    };

    const _Game_Action_makeTargets      = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function() {
        BattleManager.setTargetAction(this);
        const targets = _Game_Action_makeTargets.apply(this, arguments);
        BattleManager.setTargetAction(null);
        return targets;
    };

    const _Game_Action_targetsForDeadAndAlive = Game_Action.prototype.targetsForDeadAndAlive;
    Game_Action.prototype.targetsForDeadAndAlive = function(unit) {
        unit.setNeedOriginalMemberCounter(true);
        const targets = _Game_Action_targetsForDeadAndAlive.apply(this, arguments);
        unit.setNeedOriginalMemberCounter(false);
        return targets;
    };

    //=============================================================================
    // Game_Unit
    //  スキルやアイテムの対象として選択不可能な対象に選択しないようにします。
    //=============================================================================
    const _Game_Unit_smoothTarget = Game_Unit.prototype.smoothTarget;
    Game_Unit.prototype.smoothTarget = function(index) {
        arguments[0] = this.shiftIndexForRestrictionTarget(index);
        return _Game_Unit_smoothTarget.apply(this, arguments);
    };

    const _Game_Unit_smoothDeadTarget = Game_Unit.prototype.smoothDeadTarget;
    Game_Unit.prototype.smoothDeadTarget = function(index) {
        arguments[0] = this.shiftIndexForRestrictionTarget(index);
        return _Game_Unit_smoothDeadTarget.apply(this, arguments);
    };

    Game_Unit.prototype.filterSelectableMembers = function(members) {
        const action  = BattleManager.getTargetAction();
        if (action) {
            this.setNeedOriginalMemberCounter(true);
            members = members.filter(function(member) {
                return member.canSelectTarget(action.item(), action.subject());
            });
            this.setNeedOriginalMemberCounter(false);
        }
        return members;
    };

    Game_Unit.prototype.shiftIndexForRestrictionTarget = function(index) {
        this.setNeedOriginalMemberCounter(true);
        const allMember = this.members();
        this.setNeedOriginalMemberCounter(false);
        return this.members().indexOf(allMember[index]);
    };

    // 循環参照を防止するためのカウンタ
    Game_Unit.prototype.setNeedOriginalMemberCounter = function(increaseFlag) {
        if (!this._needOriginalMember) {
            this._needOriginalMember = 0;
        }
        this._needOriginalMember += (increaseFlag ? 1 : -1);
    };

    // for DeadOrAliveItem.js
    const _Game_Unit_smoothTargetDeadOrAlive = Game_Unit.prototype.smoothTargetDeadOrAlive;
    Game_Unit.prototype.smoothTargetDeadOrAlive = function(index) {
        this.setNeedOriginalMemberCounter(true);
        const member = _Game_Unit_smoothTargetDeadOrAlive.apply(this, arguments);
        this.setNeedOriginalMemberCounter(false);
        return member;
    };

    //=============================================================================
    // Game_Party
    //  スキルやアイテムの対象として選択不可能な対象に選択しないようにします。
    //=============================================================================
    const _Game_Party_members      = Game_Party.prototype.members;
    Game_Party.prototype.members = function() {
        const members = _Game_Party_members.apply(this, arguments);
        return this._needOriginalMember ? members : this.filterSelectableMembers(members);
    };

    Game_Party.prototype.getSkillUser = function() {
        return SceneManager.isCurrentSceneItem() ? null : this.menuActor();
    };

    //=============================================================================
    // Game_Troop
    //  スキルやアイテムの対象として選択不可能な対象に選択しないようにします。
    //=============================================================================
    const _Game_Troop_members      = Game_Troop.prototype.members;
    Game_Troop.prototype.members = function() {
        const members = _Game_Troop_members.apply(this, arguments);
        return this._needOriginalMember ? members : this.filterSelectableMembers(members);
    };

    //=============================================================================
    // BattleManager
    //  対象決定中のアクションを設定します。
    //=============================================================================
    BattleManager.setTargetAction = function(action) {
        this._targetAction = action;
    };

    BattleManager.getTargetAction = function() {
        return this._targetAction;
    };

    const _BattleManager_startAction      = BattleManager.startAction;
    BattleManager.startAction = function() {
        const action = this._subject.currentAction();
        const targets = action.makeTargets();
        if (targets.length === 0 && param.skipNoTarget) {
            return;
        }
        _BattleManager_startAction.apply(this, arguments);
    };

    //=============================================================================
    // SceneManager
    //  アイテム画面かどうかを判定します。
    //=============================================================================
    SceneManager.isCurrentSceneItem = function() {
        return this._scene instanceof Scene_Item;
    };

    //=============================================================================
    // Scene_ItemBase
    //  アイテム効果の対象から無効なアクターを除外します。
    //=============================================================================
    const _Scene_ItemBase_itemTargetActors      = Scene_ItemBase.prototype.itemTargetActors;
    Scene_ItemBase.prototype.itemTargetActors = function() {
        const members = _Scene_ItemBase_itemTargetActors.apply(this, arguments);
        return members.filter(function(member) {
            return member.canSelectTarget(this.item(), $gameParty.getSkillUser());
        }, this);
    };

    //=============================================================================
    // Window_Selectable
    //  対象アクターに対してスキルを使用可能か判定します。
    //=============================================================================
    Window_Selectable.prototype.canSelectSkillTarget = function(item, index, user) {
        return this.getMember(index)?.canSelectTarget(item, user);
    };

    Window_Selectable.prototype.deactivateBatter = function(index) {
        this.changePaintOpacity(false);
        this.getMember(index).deactivateSelect();
    };

    //=============================================================================
    // Window_BattleActor
    //  無効な対象は選択不可能にします。
    //=============================================================================
    Window_BattleActor.prototype.drawItem = function(index) {
        if (!this.canSelectSkillTarget(index)) {
            this.deactivateBatter(index);
        }
        Window_BattleStatus.prototype.drawItem.apply(this, arguments);
        this.changePaintOpacity(true);
    };

    Window_BattleActor.prototype.isCurrentItemEnabled = function() {
        return this.canSelectSkillTarget(this.index());
    };

    Window_BattleActor.prototype.canSelectSkillTarget = function(index) {
        const action = BattleManager.inputtingAction();
        return !action || Window_Selectable.prototype.canSelectSkillTarget.call(this,
                action.item(), index, action.subject());
    };

    Window_BattleActor.prototype.getMember = function(index) {
        return $gameParty.members()[index];
    };

    const _Window_BattleActor_hide = Window_BattleActor.prototype.hide;
    Window_BattleActor.prototype.hide = function() {
        _Window_BattleActor_hide.apply(this, arguments);
        $gameParty.members().forEach(function(actor) {
            actor.activateSelect();
        });
    };

    //=============================================================================
    // Window_BattleEnemy
    //  無効な対象は選択不可能にします。
    //=============================================================================
    const _Window_BattleEnemy_drawItem      = Window_BattleEnemy.prototype.drawItem;
    Window_BattleEnemy.prototype.drawItem = function(index) {
        if (!this.canSelectSkillTarget(index) && !this.isRestrictionHidden()) {
            this.deactivateBatter(index);
        }
        _Window_BattleEnemy_drawItem.apply(this, arguments);
        this.changePaintOpacity(true);
    };

    Window_BattleEnemy.prototype.isCurrentItemEnabled = Window_BattleActor.prototype.isCurrentItemEnabled;
    Window_BattleEnemy.prototype.canSelectSkillTarget = Window_BattleActor.prototype.canSelectSkillTarget;

    Window_BattleEnemy.prototype.getMember = function(index) {
        return this._enemies[index];
    };

    const _Window_BattleEnemy_hide = Window_BattleEnemy.prototype.hide;
    Window_BattleEnemy.prototype.hide = function() {
        _Window_BattleEnemy_hide.apply(this, arguments);
        if (this._enemies) {
            this._enemies.forEach(function(enemy) {
                enemy.activateSelect();
            });
        }
    };

    const _Window_BattleEnemy_refresh = Window_BattleEnemy.prototype.refresh;
    Window_BattleEnemy.prototype.refresh = function() {
        _Window_BattleEnemy_refresh.apply(this, arguments);
        if (this.isRestrictionHidden()) {
            this._enemies = this._enemies.filter((enemy, index) => this.canSelectSkillTarget(index));
            Window_Selectable.prototype.refresh.call(this);
        }
    };

    Window_BattleEnemy.prototype.isRestrictionHidden = function() {
        const action = BattleManager.inputtingAction();
        if (!action) {
            return false;
        }
        return action.subject().findRestrictionData(action.item())?.invalidTargetHidden;
    };

    //=============================================================================
    // Window_MenuActor
    //  無効な対象は選択不可能にします。
    //=============================================================================
    Window_MenuActor.prototype.drawItemStatus = function(index) {
        if (!this.canSelectSkillTarget(index)) {
            this.changePaintOpacity(false);
        }
        Window_MenuStatus.prototype.drawItemStatus.apply(this, arguments);
        this.changePaintOpacity(true);
    };

    const _Window_MenuActor_processOk      = Window_MenuActor.prototype.processOk;
    Window_MenuActor.prototype.processOk = function() {
        if (this.isCurrentItemEnabled() || this.cursorAll()) {
            _Window_MenuActor_processOk.apply(this, arguments);
        } else {
            SoundManager.playBuzzer();
        }
    };

    const _Window_MenuActor_selectForItem      = Window_MenuActor.prototype.selectForItem;
    Window_MenuActor.prototype.selectForItem = function(item) {
        this._targetItem = item;
        _Window_MenuActor_selectForItem.apply(this, arguments);
        this.refresh();
    };

    Window_MenuActor.prototype.canSelectSkillTarget = function(index) {
        const item = this._targetItem;
        return !item || Window_Selectable.prototype.canSelectSkillTarget.call(this,
                item, index, $gameParty.getSkillUser());
    };

    Window_MenuActor.prototype.isCurrentItemEnabled = Window_BattleActor.prototype.isCurrentItemEnabled;
    Window_MenuActor.prototype.getMember            = Window_BattleActor.prototype.getMember;

    //=============================================================================
    // Sprite_Battler
    //  選択できないバトラーを無効表示します。
    //=============================================================================
    const _Sprite_Battler_updateSelectionEffect = Sprite_Battler.prototype.updateSelectionEffect;
    Sprite_Battler.prototype.updateSelectionEffect = function() {
        const target = this.mainSprite();
        if (!this._battler.isActivateSelect()) {
            target.setBlendColor([0, 0, 0, 128]);
            this._deactivateSelect = true;
            return;
        } else if (this._deactivateSelect) {
            target.setBlendColor([0, 0, 0, 0]);
            this._deactivateSelect = false;
        }
        _Sprite_Battler_updateSelectionEffect.apply(this, arguments);
    };
})();

