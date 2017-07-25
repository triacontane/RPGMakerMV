//=============================================================================
// RestrictionTargetSkill.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc RestrictionTargetSkillPlugin
 * @author triacontane
 *
 * @help RestrictionTargetSkill.js
 *
 * 特定のバトラー（敵および味方）に対して使用できない、もしくは
 * 特定のバトラーに対してのみ使用できるスキルを作成できます。
 * 敵がスキルを使う場合や、自動戦闘、混乱、複数対象の場合なども含めて
 * 常に対象スキルのターゲットから外れます。
 *
 * 制約：敵キャラの選択制限については「YEP_BattleEngineCore.js」の
 * 適用環境では使用できません。
 *
 * スキルのメモ欄に以下の通り指定してください。
 * <RTS_有効アクターID:2,3> # ID[2][3]のアクターにのみ使用できます。
 * <RTS_ValidActorID:2,3>   # 同上
 * <RTS_無効アクターID:5>   # ID[5]のアクターに使用できません。
 * <RTS_InvalidActorID:5>   # 同上
 * <RTS_有効敵キャラID:2,3> # ID[2][3]の敵キャラにのみ使用できます。
 * <RTS_ValidEnemyID:2,3>   # 同上
 * <RTS_無効敵キャラID:5>   # ID[5]の敵キャラに使用できません。
 * <RTS_InvalidEnemyID:5>   # 同上
 * <RTS_使用者無効>         # スキルの使用者には使用できません。
 * <RTS_UserInvalid>        # 同上
 * <RTS_スクリプト:s>       # スクリプト[s]を実行結果が[true]だと使用できません。
 * <RTS_Script:s>           # 同上
 *
 * スクリプト中では以下のローカル変数が使用できます。
 * battler : 対象バトラー
 * item    : 対象スキル(アイテム)オブジェクト
 * スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 *
 * さらに全てのスキルを受け付けなくなる特徴を作成する機能もあります。
 * 特徴を有するデータベースもメモ欄に以下の通り指定してください。
 * <RTS_無敵>       # この特徴が有効な限り全てのスキルの対象から外れます。
 * <RTS_Invincible> # 同上
 *
 * 主にスキルによる一時的な無敵状態の演出に利用できます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 対象限定スキルプラグイン
 * @author トリアコンタン
 *
 * @help RestrictionTargetSkill.js
 *
 * 特定のバトラー（敵および味方）に対して使用できない、もしくは
 * 特定のバトラーに対してのみ使用できるスキルを作成できます。
 * 敵がスキルを使う場合や、自動戦闘、混乱、複数対象の場合なども含めて
 * 常に対象スキルのターゲットから外れます。
 *
 * 制約：敵キャラの選択制限については「YEP_BattleEngineCore.js」の
 * 適用環境では使用できません。
 *
 * スキルのメモ欄に以下の通り指定してください。
 * <RTS_有効アクターID:2,3> # ID[2][3]のアクターにのみ使用できます。
 * <RTS_ValidActorID:2,3>   # 同上
 * <RTS_無効アクターID:5>   # ID[5]のアクターに使用できません。
 * <RTS_InvalidActorID:5>   # 同上
 * <RTS_有効敵キャラID:2,3> # ID[2][3]の敵キャラにのみ使用できます。
 * <RTS_ValidEnemyID:2,3>   # 同上
 * <RTS_無効敵キャラID:5>   # ID[5]の敵キャラに使用できません。
 * <RTS_InvalidEnemyID:5>   # 同上
 * <RTS_使用者無効>         # スキルの使用者には使用できません。
 * <RTS_UserInvalid>        # 同上
 * <RTS_スクリプト:s>       # スクリプト[s]を実行結果が[true]だと使用できません。
 * <RTS_Script:s>           # 同上
 *
 * スクリプト中では以下のローカル変数が使用できます。
 * battler : 対象バトラー
 * item    : 対象スキル(アイテム)オブジェクト
 * スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 *
 * さらに全てのスキルを受け付けなくなる特徴を作成する機能もあります。
 * 特徴を有するデータベースもメモ欄に以下の通り指定してください。
 * <RTS_無敵>       # この特徴が有効な限り全てのスキルの対象から外れます。
 * <RTS_Invincible> # 同上
 *
 * 主にスキルによる一時的な無敵状態の演出に利用できます。
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
    var metaTagPrefix = 'RTS_';

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgArrayString = function(args, upperFlg) {
        var values = getArgString(args, upperFlg).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getArgArrayNumber = function(args, min, max) {
        var values = getArgArrayString(args, false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
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
        if (text == null || text === true) text = '';
        text = text.replace(/&gt;?/gi, '>');
        text = text.replace(/&lt;?/gi, '<');
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // Game_BattlerBase
    //  スキルやアイテムの対象として選択可能かどうかを返します。
    //=============================================================================
    Game_Battler.prototype.isExistValidTarget = function(item) {
        var trialAction = new Game_Action(this, false);
        trialAction.setItemObject(item);
        return trialAction.isExistTarget();
    };

    Game_BattlerBase.prototype.canSelectTarget = function(item, user) {
        if (getMetaValues(item, ['使用者無効', 'UserInvalid']) && user === this) {
            return false;
        }
        var scriptValue = getMetaValues(item, ['スクリプト', 'Script']);
        if (scriptValue && eval(getArgString(scriptValue))) {
            return false;
        }
        this.friendsUnit().setNeedOriginalMember(true);
        var result = !this.traitObjects().some(function(data) {
            return !!getMetaValues(data, ['無敵', 'Invincible']);
        });
        this.friendsUnit().setNeedOriginalMember(false);
        return result;
    };

    Game_Actor.prototype.canSelectTarget = function(item, user) {
        var result = Game_BattlerBase.prototype.canSelectTarget.apply(this, arguments);
        if (result) {
            var actorId = this.actorId();
            var validId = getMetaValues(item, ['有効アクターID', 'ValidActorID']);
            if (validId && !getArgArrayNumber(validId).contains(actorId)) {
                return false;
            }
            var invalidId = getMetaValues(item, ['無効アクターID', 'InvalidActorID']);
            if (invalidId && getArgArrayNumber(invalidId).contains(actorId)) {
                return false;
            }
        }
        return result;
    };

    Game_Enemy.prototype.canSelectTarget = function(item, user) {
        var result = Game_BattlerBase.prototype.canSelectTarget.apply(this, arguments);
        if (result) {
            var enemyId = this.enemyId();
            var validId = getMetaValues(item, ['有効敵キャラID', 'ValidEnemyID']);
            if (validId && !getArgArrayNumber(validId).contains(enemyId)) {
                return false;
            }
            var invalidId = getMetaValues(item, ['無効敵キャラID', 'InvalidEnemyID']);
            if (invalidId && getArgArrayNumber(invalidId).contains(enemyId)) {
                return false;
            }
        }
        return result;
    };

    var _Game_Enemy_isActionValid = Game_Enemy.prototype.isActionValid;
    Game_Enemy.prototype.isActionValid = function(action) {
        return _Game_Enemy_isActionValid.apply(this, arguments) && this.isExistValidTarget($dataSkills[action.skillId]);
    };

    //=============================================================================
    // Game_Action
    //  スキルやアイテムの対象として選択不可能な対象に選択しないようにします。
    //=============================================================================
    Game_Action.prototype.isExistTarget = function() {
        BattleManager.setTargetAction(this);
        var targets = [];
        if (this.isForOpponent()) {
            targets = this.targetsForOpponents();
        } else if (this.isForFriend()) {
            targets = this.targetsForFriends();
        }
        BattleManager.setTargetAction(null);
        return targets.length > 0;
    };

    var _Game_Action_subject = Game_Action.prototype.subject;
    Game_Action.prototype.subject = function() {
        $gameTroop.setNeedOriginalMember(true);
        var subject = _Game_Action_subject.apply(this, arguments);
        $gameTroop.setNeedOriginalMember(false);
        return subject;
    };

    var _Game_Action_makeTargets      = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function() {
        BattleManager.setTargetAction(this);
        var targets = _Game_Action_makeTargets.apply(this, arguments);
        BattleManager.setTargetAction(null);
        return targets;
    };

    var _Game_Action_decideRandomTarget      = Game_Action.prototype.decideRandomTarget;
    Game_Action.prototype.decideRandomTarget = function() {
        BattleManager.setTargetAction(this);
        _Game_Action_decideRandomTarget.apply(this, arguments);
        BattleManager.setTargetAction(null);
    };

    //=============================================================================
    // Game_Unit
    //  スキルやアイテムの対象として選択不可能な対象に選択しないようにします。
    //=============================================================================
    var _Game_Unit_smoothTarget = Game_Unit.prototype.smoothTarget;
    Game_Unit.prototype.smoothTarget = function(index) {
        arguments[0] = this.shiftIndexForRestrictionTarget(index);
        return _Game_Unit_smoothTarget.apply(this, arguments);
    };

    var _Game_Unit_smoothDeadTarget = Game_Unit.prototype.smoothDeadTarget;
    Game_Unit.prototype.smoothDeadTarget = function(index) {
        arguments[0] = this.shiftIndexForRestrictionTarget(index);
        return _Game_Unit_smoothDeadTarget.apply(this, arguments);
    };

    Game_Unit.prototype.filterSelectableMembers = function(members) {
        var action  = BattleManager.getTargetAction();
        if (action) {
            this._needOriginalMember = true;
            members = members.filter(function(member) {
                return member.canSelectTarget(action.item(), action.subject());
            });
            this._needOriginalMember = false;
        }
        return members;
    };

    Game_Unit.prototype.shiftIndexForRestrictionTarget = function(index) {
        this._needOriginalMember = true;
        var allMember = this.members();
        this._needOriginalMember = false;
        return this.members().indexOf(allMember[index]);
    };

    Game_Unit.prototype.setNeedOriginalMember = function(value) {
        this._needOriginalMember = value;
    };

    //=============================================================================
    // Game_Party
    //  スキルやアイテムの対象として選択不可能な対象に選択しないようにします。
    //=============================================================================
    var _Game_Party_members      = Game_Party.prototype.members;
    Game_Party.prototype.members = function() {
        var members = _Game_Party_members.apply(this, arguments);
        return this._needOriginalMember ? members : this.filterSelectableMembers(members);
    };

    Game_Party.prototype.getSkillUser = function() {
        return SceneManager.isCurrentSceneItem() ? null : this.menuActor();
    };

    //=============================================================================
    // Game_Troop
    //  スキルやアイテムの対象として選択不可能な対象に選択しないようにします。
    //=============================================================================
    var _Game_Troop_members      = Game_Troop.prototype.members;
    Game_Troop.prototype.members = function() {
        var members = _Game_Troop_members.apply(this, arguments);
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
    var _Scene_ItemBase_itemTargetActors      = Scene_ItemBase.prototype.itemTargetActors;
    Scene_ItemBase.prototype.itemTargetActors = function() {
        var members = _Scene_ItemBase_itemTargetActors.apply(this, arguments);
        return members.filter(function(member) {
            return member.canSelectTarget(this.item(), $gameParty.getSkillUser());
        }, this);
    };

    //=============================================================================
    // Window_Selectable
    //  対象アクターに対してスキルを使用可能か判定します。
    //=============================================================================
    Window_Selectable.prototype.canSelectSkillTarget = function(item, index, user) {
        return this.getMember(index).canSelectTarget(item, user);
    };

    //=============================================================================
    // Window_BattleActor
    //  無効な対象は選択不可能にします。
    //=============================================================================
    Window_BattleActor.prototype.drawItem = function(index) {
        if (!this.canSelectSkillTarget(index)) {
            this.changePaintOpacity(false);
        }
        Window_BattleStatus.prototype.drawItem.apply(this, arguments);
        this.changePaintOpacity(true);
    };

    Window_BattleActor.prototype.isCurrentItemEnabled = function() {
        return this.canSelectSkillTarget(this.index());
    };

    Window_BattleActor.prototype.canSelectSkillTarget = function(index) {
        var action = BattleManager.inputtingAction();
        return !action || Window_Selectable.prototype.canSelectSkillTarget.call(this,
                action.item(), index, action.subject());
    };

    Window_BattleActor.prototype.getMember = function(index) {
        return $gameParty.members()[index];
    };

    //=============================================================================
    // Window_BattleEnemy
    //  無効な対象は選択不可能にします。
    //=============================================================================
    var _Window_BattleEnemy_drawItem      = Window_BattleEnemy.prototype.drawItem;
    Window_BattleEnemy.prototype.drawItem = function(index) {
        if (!this.canSelectSkillTarget(index)) {
            this.changePaintOpacity(false);
        }
        _Window_BattleEnemy_drawItem.apply(this, arguments);
        this.changePaintOpacity(true);
    };

    Window_BattleEnemy.prototype.isCurrentItemEnabled = Window_BattleActor.prototype.isCurrentItemEnabled;
    Window_BattleEnemy.prototype.canSelectSkillTarget = Window_BattleActor.prototype.canSelectSkillTarget;

    Window_BattleEnemy.prototype.getMember = function(index) {
        return this._enemies[index];
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

    var _Window_MenuActor_processOk      = Window_MenuActor.prototype.processOk;
    Window_MenuActor.prototype.processOk = function() {
        if (this.isCurrentItemEnabled() || this.cursorAll()) {
            _Window_MenuActor_processOk.apply(this, arguments);
        } else {
            SoundManager.playBuzzer();
        }
    };

    var _Window_MenuActor_selectForItem      = Window_MenuActor.prototype.selectForItem;
    Window_MenuActor.prototype.selectForItem = function(item) {
        this._targetItem = item;
        _Window_MenuActor_selectForItem.apply(this, arguments);
        this.refresh();
    };

    Window_MenuActor.prototype.canSelectSkillTarget = function(index) {
        var item = this._targetItem;
        return !item || Window_Selectable.prototype.canSelectSkillTarget.call(this,
                item, index, $gameParty.getSkillUser());
    };

    Window_MenuActor.prototype.isCurrentItemEnabled = Window_BattleActor.prototype.isCurrentItemEnabled;
    Window_MenuActor.prototype.getMember            = Window_BattleActor.prototype.getMember;
})();

