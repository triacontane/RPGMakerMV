//=============================================================================
// VanguardAndRearguard.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2016/06/18 アクター加入時に前衛ステートを強制設定する処理を追加
// 1.1.0 2016/06/06 戦闘不能時に隊列ステートが解除される不具合を修正
//                  前衛メンバーが生存している限り、後衛メンバーが狙われなくなる機能を追加
// 1.0.0 2016/06/05 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Vanguard and rearguard
 * @author triacontane
 *
 * @param VanguardStateId
 * @desc State ID of vanguard.
 * @default 2
 *
 * @param RearguardStateId
 * @desc State ID of rearguard.
 * @default 3
 *
 * @param ChangeInMenu
 * @desc Changeable formation in menu screen.
 * @default ON
 *
 * @param RearDefense
 * @desc Rearguard member never targeting, if vanguard member alive.
 * @default OFF
 *
 * @param SkillIdChange
 * @desc Skill ID of formation change.
 * @default 0
 *
 * @param RearguardOffsetX
 * @desc Offset X Position of rearguard.
 * @default 48
 *
 * @param RearguardOffsetY
 * @desc Offset Y Position of rearguard.
 * @default 0
 *
 * @param ChangeSpeed
 * @desc Move speed of formation change.
 * @default 8
 *
 * @help 戦闘に「前衛」「後衛」の概念を追加します。
 * 「前衛」時のステートと「後衛」時のステートを指定したうえで
 * 「特徴」欄などを使って「前衛」と「後衛」それぞれの特殊効果を設定してください。
 *
 * 「前衛」「後衛」に指定されたステートは、解除条件を満たしても解除されません。
 * 変更するには以下のいずれかの方法を選択します。
 *
 * ・メニュー画面の「並び替え」で同じキャラクターを選択する。
 * ・戦闘画面で「チェンジ」コマンドを実行する。
 * ・イベントから対象ステートを付与する。
 *
 * 戦闘中のチェンジを有効した場合、チェンジ用スキルの対象を「使用者」にして
 * さらにメモ欄に以下の通り設定してください。
 * (既存スキル「防御」をコピーすることをオススメします)
 * <VARChange>
 *
 * 上記メモ欄はチェンジ以外のスキルでも有効です。
 * スキル使用者をチェンジ対象にしたい場合はメモ欄に以下の通り設定してください。
 * <VARUserChange>
 *
 * 前衛のみ、後衛のみを対象にしたスキルを作成したい場合、
 * スキルのメモ欄に以下の通り設定してください。
 * <VAROnlyVanguard> // 前衛のみ対象スキル
 * <VAROnlyRearguard> // 後衛のみ対象スキル
 *
 * ただし、メニュー画面から使用する場合は無効です。
 *
 * 敵キャラの初期配置を後衛にしたい場合、メモ欄に以下の通り設定してください。
 * <VARRearguard>
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 前衛後衛プラグイン
 * @author トリアコンタン
 *
 * @param 前衛ステートID
 * @desc 前衛のステートIDです。
 * @default 2
 *
 * @param 後衛ステートID
 * @desc 後衛のステートIDです。
 * @default 3
 *
 * @param メニューチェンジ可能
 * @desc メニュー画面で前衛・後衛の切り替えが可能になります。
 * @default ON
 *
 * @param 後衛防御
 * @desc 前衛メンバーが生存している限り、後衛メンバーが狙われなくなります。
 * @default OFF
 *
 * @param チェンジスキルID
 * @desc 戦闘中の前衛・後衛切り替えコマンドで実行されるスキルIDです。0を指定すると戦闘中はチェンジ不可となります。
 * @default 0
 *
 * @param 後衛時X補正
 * @desc 後衛時のX座標を前衛時に対する相対値で指定します。サイドビューかつ敵キャラの場合は反転します。
 * @default 48
 *
 * @param 後衛時Y補正
 * @desc 後衛時のX座標を前衛時に対する相対値で指定します。
 * @default 0
 *
 * @param チェンジ速度
 * @desc 戦闘中にチェンジした場合のグラフィックの移動速度です。
 * @default 8
 *
 * @help 戦闘に「前衛」「後衛」の概念を追加します。
 * 「前衛」時のステートと「後衛」時のステートを指定したうえで
 * 「特徴」欄などを使って「前衛」と「後衛」それぞれの特殊効果を設定してください。
 *
 * 「前衛」「後衛」に指定されたステートは、解除条件を満たしても解除されません。
 * 変更するには以下のいずれかの方法を選択します。
 *
 * ・メニュー画面の「並び替え」で同じキャラクターを選択する。
 * ・戦闘画面で「チェンジ」コマンドを実行する。
 * ・イベントから対象ステートを付与する。
 *
 * 戦闘中のチェンジを有効した場合、チェンジ用スキルの対象を「使用者」にして
 * さらにメモ欄に以下の通り設定してください。
 * (既存スキル「防御」をコピーすることをオススメします)
 * <VARチェンジ>
 *
 * 上記メモ欄はチェンジ以外のスキルでも有効です。
 * スキル使用者をチェンジ対象にしたい場合はメモ欄に以下の通り設定してください。
 * <VAR使用者チェンジ>
 *
 * 前衛のみ、後衛のみを対象にしたスキルを作成したい場合、
 * スキルのメモ欄に以下の通り設定してください。
 * <VAR前衛のみ> // 前衛のみ対象スキル
 * <VAR後衛のみ> // 後衛のみ対象スキル
 *
 * ただし、メニュー画面から使用する場合は無効です。
 *
 * 敵キャラの初期配置を後衛にしたい場合、メモ欄に以下の通り設定してください。
 * <VAR後衛>
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
    var pluginName    = 'VanguardAndRearguard';
    var metaTagPrefix = 'VAR';

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

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramVanguardStateId  = getParamNumber(['VanguardStateId', '前衛ステートID'], 2);
    var paramRearguardStateId = getParamNumber(['RearguardStateId', '後衛ステートID'], 2);
    var paramChangeInMenu     = getParamBoolean(['ChangeInMenu', 'メニューチェンジ可能'], 1);
    var paramSkillIdChange    = getParamNumber(['SkillIdChange', 'チェンジスキルID'], 0);
    var paramRearguardOffsetX = getParamNumber(['RearguardOffsetX', '後衛時X補正'], 0);
    var paramRearguardOffsetY = getParamNumber(['RearguardOffsetY', '後衛時Y補正'], 0);
    var paramChangeSpeed      = getParamNumber(['ChangeSpeed', 'チェンジ速度'], 1);
    var paramRearDefense      = getParamBoolean(['RearDefense', '後衛防御']);

    //=============================================================================
    // Game_BattlerBase
    //  前衛・後衛の概念を追加定義します。
    //=============================================================================
    var _Game_BattlerBase_refresh      = Game_BattlerBase.prototype.refresh;
    Game_BattlerBase.prototype.refresh = function() {
        _Game_BattlerBase_refresh.apply(this, arguments);
        if (!this.isVanguard() && !this.isRearguard()) {
            this.setFormationState(true);
        }
    };

    var _Game_BattlerBase_die      = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        var prevVanguard = this.isVanguard();
        _Game_BattlerBase_die.apply(this, arguments);
        this.setFormationState(prevVanguard);
    };

    Game_BattlerBase.prototype.setFormationState = function(vanguardFlg) {
        var additionalStateId = (vanguardFlg ? paramVanguardStateId : paramRearguardStateId);
        var removeStateId     = (vanguardFlg ? paramRearguardStateId : paramVanguardStateId);
        if (!this.isStateAffected(additionalStateId)) {
            this.addNewState(additionalStateId);
        }
        if (this.isStateAffected(removeStateId)) {
            this.eraseState(removeStateId);
        }
    };

    Game_BattlerBase.prototype.changeFormationState = function() {
        this.setFormationState(!this.isVanguard());
    };

    Game_BattlerBase.prototype.isVanguard = function() {
        return this.isStateAffected(paramVanguardStateId);
    };

    Game_BattlerBase.prototype.isRearguard = function() {
        return this.isStateAffected(paramRearguardStateId);
    };

    Game_BattlerBase.prototype.isVanguardStateOf = function(stateId) {
        return stateId === paramVanguardStateId;
    };

    Game_BattlerBase.prototype.isRearguardStateOf = function(stateId) {
        return stateId === paramRearguardStateId;
    };

    Game_BattlerBase.prototype.changeSkillId = function() {
        return paramSkillIdChange;
    };

    Game_BattlerBase.prototype.getFormationOffsetX = function() {
        return this.isRearguard() ? paramRearguardOffsetX : 0;
    };

    Game_BattlerBase.prototype.getFormationOffsetY = function() {
        return this.isRearguard() ? paramRearguardOffsetY : 0;
    };

    //=============================================================================
    // Game_Battler
    //  前衛・後衛ステートの解除を無効にします。
    //=============================================================================
    var _Game_Battler_removeState      = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function(stateId) {
        if (!this.isVanguardStateOf(stateId) && !this.isVanguardStateOf(stateId)) {
            _Game_Battler_removeState.apply(this, arguments);
        }
    };

    var _Game_Battler_addState      = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        if (this.isVanguardStateOf(stateId)) {
            this.setFormationState(true);
        } else if (this.isRearguardStateOf(stateId)) {
            this.setFormationState(false);
        } else {
            _Game_Battler_addState.apply(this, arguments);
        }
    };

    var _Game_Battler_performActionStart      = Game_Battler.prototype.performActionStart;
    Game_Battler.prototype.performActionStart = function(action) {
        if (!action.isChange()) {
            _Game_Battler_performActionStart.apply(this, arguments);
        }
    };

    //=============================================================================
    // Game_Actor
    //  チェンジ用のモーションを定義します。
    //=============================================================================
    var _Game_Actor_setup = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.apply(this, arguments);
        if (!this.isVanguard() && !this.isRearguard()) {
            this.setFormationState(true);
        }
    };

    var _Game_Actor_performAction      = Game_Actor.prototype.performAction;
    Game_Actor.prototype.performAction = function(action) {
        _Game_Actor_performAction.apply(this, arguments);
        if (action.isChange()) {
            this.requestMotion('guard');
        }
    };

    //=============================================================================
    // Game_Enemy
    //  前衛・後衛ステートの初期値を設定します。
    //=============================================================================
    var _Game_Enemy_setup      = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.apply(this, arguments);
        if (getMetaValues(this.enemy(), ['Rearguard', '後衛'])) {
            this.setFormationState(false);
        }
    };

    Game_Enemy.prototype.getFormationOffsetX = function() {
        return Game_BattlerBase.prototype.getFormationOffsetX.call(this) * ($gameSystem.isSideView() ? -1 : 1);
    };

    //=============================================================================
    // Game_Unit
    //  前衛メンバーのみを生存メンバーとして扱う仕様に変更します。
    //=============================================================================
    if (paramRearDefense) {
        var _Game_Unit_aliveMembers      = Game_Unit.prototype.aliveMembers;
        Game_Unit.prototype.aliveMembers = function() {
            var members = this.vanguardMembers();
            return members.length > 0 ? members : _Game_Unit_aliveMembers.apply(this, arguments);
        };

        Game_Unit.prototype.vanguardMembers = function() {
            return _Game_Unit_aliveMembers.apply(this, arguments).filter(function(member) {
                return member.isVanguard();
            });
        };
    }

    //=============================================================================
    // Game_Action
    //  チェンジスキルを設定します。
    //=============================================================================
    Game_Action.prototype.setChange = function() {
        this.setSkill(this.subject().changeSkillId());
    };

    Game_Action.prototype.isChange = function() {
        return this.item() === $dataSkills[this.subject().changeSkillId()];
    };

    var _Game_Action_applyItemUserEffect      = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        _Game_Action_applyItemUserEffect.apply(this, arguments);
        if (getMetaValues(this.item(), ['Change', 'チェンジ'])) {
            target.changeFormationState();
            this.makeSuccess(target);
        }
        if (getMetaValues(this.item(), ['UserChange', '使用者チェンジ'])) {
            this.subject().changeFormationState();
            this.makeSuccess(target);
        }
    };

    var _Game_Action_repeatTargets      = Game_Action.prototype.repeatTargets;
    Game_Action.prototype.repeatTargets = function(targets) {
        if (getMetaValues(this.item(), ['OnlyVanguard', '前衛のみ'])) {
            arguments[0] = targets.filter(function(target) {
                return target.isVanguard();
            });
        }
        if (getMetaValues(this.item(), ['OnlyRearguard', '後衛のみ'])) {
            arguments[0] = targets.filter(function(target) {
                return target.isRearguard();
            });
        }
        return _Game_Action_repeatTargets.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Battle
    //  前衛・後衛のチェンジを追加定義します。
    //=============================================================================
    var _Scene_Battle_createActorCommandWindow      = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.apply(this, arguments);
        this._actorCommandWindow.setHandler('change', this.commandChange.bind(this));
    };

    Scene_Battle.prototype.commandChange = function() {
        BattleManager.inputtingAction().setChange();
        this.selectNextCommand();
    };

    //=============================================================================
    // Scene_Menu
    //  前衛・後衛のチェンジを追加定義します。
    //=============================================================================
    var _Scene_Menu_onFormationOk      = Scene_Menu.prototype.onFormationOk;
    Scene_Menu.prototype.onFormationOk = function() {
        if (paramChangeInMenu) {
            var pendingIndex = this._statusWindow.pendingIndex();
            var index        = this._statusWindow.index();
            var actor        = $gameParty.members()[index];
            if (pendingIndex >= 0 && index === pendingIndex) {
                actor.changeFormationState();
            }
        }
        _Scene_Menu_onFormationOk.apply(this, arguments);
    };

    //=============================================================================
    // Window_MenuStatus
    //  前衛・後衛で描画位置を変更します。
    //=============================================================================
    Window_MenuStatus.shiftWidth              = 24;
    Window_MenuStatus.prototype.drawActorFace = function(actor, x, y, width, height) {
        if (actor.isRearguard()) {
            arguments[1] += Window_MenuStatus.shiftWidth;
        }
        Window_Base.prototype.drawActorFace.apply(this, arguments);
    };

    Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
        if (actor.isRearguard()) {
            arguments[1] += Window_MenuStatus.shiftWidth;
            arguments[3] -= Window_MenuStatus.shiftWidth;
        }
        Window_Base.prototype.drawActorSimpleStatus.apply(this, arguments);
    };

    //=============================================================================
    // Window_ActorCommand
    //  チェンジコマンドを追加定義します。
    //=============================================================================
    var _Window_ActorCommand_makeCommandList      = Window_ActorCommand.prototype.makeCommandList;
    Window_ActorCommand.prototype.makeCommandList = function() {
        _Window_ActorCommand_makeCommandList.apply(this, arguments);
        if (this._actor && paramSkillIdChange) {
            this.addChangeCommand();
        }
    };

    Window_ActorCommand.prototype.addChangeCommand = function() {
        var skill = $dataSkills[paramSkillIdChange];
        this.addCommand(skill ? skill.name : 'Change', 'change', true);
    };

    //=============================================================================
    // Sprite_Battler
    //  前衛・後衛によって位置を変動させます。
    //=============================================================================
    var _Sprite_Battler_initMembers      = Sprite_Battler.prototype.initMembers;
    Sprite_Battler.prototype.initMembers = function() {
        _Sprite_Battler_initMembers.apply(this, arguments);
        this._formationX = 0;
        this._formationY = 0;
    };

    var _Sprite_Battler_setHome      = Sprite_Battler.prototype.setHome;
    Sprite_Battler.prototype.setHome = function(x, y) {
        _Sprite_Battler_setHome.apply(this, arguments);
        this._formationX = this._battler.getFormationOffsetX();
        this._formationY = this._battler.getFormationOffsetY();
    };

    var _Sprite_Battler_updatePosition      = Sprite_Battler.prototype.updatePosition;
    Sprite_Battler.prototype.updatePosition = function() {
        _Sprite_Battler_updatePosition.apply(this, arguments);
        this.updateFormation();
        this.x += this._formationX;
        this.y += this._formationY;
    };

    Sprite_Battler.prototype.updateFormation = function() {
        var targetFormationX = this._battler.getFormationOffsetX();
        var targetFormationY = this._battler.getFormationOffsetY();
        if (targetFormationX > this._formationX) {
            this._formationX = Math.min(this._formationX + paramChangeSpeed, targetFormationX);
        }
        if (targetFormationX < this._formationX) {
            this._formationX = Math.max(this._formationX - paramChangeSpeed, targetFormationX);
        }
        if (targetFormationY > this._formationY) {
            this._formationY = Math.min(this._formationY + paramChangeSpeed, targetFormationY);
        }
        if (targetFormationY < this._formationY) {
            this._formationY = Math.max(this._formationY - paramChangeSpeed, targetFormationY);
        }
    };
})();

