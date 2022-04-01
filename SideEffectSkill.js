//=============================================================================
// SideEffectSkill.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.6.5 2022/04/02 ステートおよびバフが解除されたとき、解除メッセージが二重に出力される場合がある問題を修正
// 1.6.4 2022/01/13 BattleEffectPopup.jsと併用したとき、使用者に対する効果ポップアップが二重に出力される場合がある問題を修正
// 1.6.3 2021/12/27 1.6.2の修正が一部不十分だった問題を修正
// 1.6.2 2021/11/29 使用者に対する行動結果が出力されない場合がある問題を修正
// 1.6.1 2021/10/20 メニュー画面でスキルを使用するとエラーになる問題を修正
// 1.6.0 2021/10/16 MZで動作するよう全面的に修正
// 1.5.0 2021/06/13 行動が耐性だったのときのみ適用する副作用を指定できる機能を追加
// 1.4.2 2020/05/22 反撃された場合などスキルを使用しなかったケースで「弱点時のみ」などの判定が無条件で有効になってしまう問題を修正
// 1.4.1 2019/07/15 BattleEffectPopup.jsと併用したとき、フロントビューだと戦闘開始時などにInvalidポップが余分に表示される競合を解消
// 1.4.0 2019/02/16 行動が無効(ダメージ0)だった場合のみ副作用を適用できる機能を追加
//                  行動が反射された場合のみ副作用を適用できる機能を追加
// 1.3.0 2018/11/29 行動が会心だった場合のみ副作用を適用できる機能を追加
// 1.2.3 2017/10/10 0ターン目に戦闘行動の強制を実行するとエラーになる問題の修正
// 1.2.2 2017/10/07 ターン終了時の副作用を持つスキルでトドメをさした場合、次の戦闘のターン終了時に副作用が発生する問題を修正
// 1.2.1 2017/06/10 自動戦闘が有効なアクターがいる場合に一部機能が正常に動作しない問題を修正
// 1.2.0 2017/06/01 弱点時のみ副作用が適用できる機能を追加
// 1.1.1 2017/01/24 副作用設定時にターン終了時にダメージのポップアップ等が出なくなる問題を修正
// 1.1.0 2016/12/13 フロントビュー時にエフェクト効果のメッセージが重複して表示される問題を修正
// 1.0.2 2016/10/10 行動パターンが何も設定されていない敵キャラが行動しようとするとエラーになる問題を修正
// 1.0.1 2016/10/10 タイミングが「スキル使用時」「ターン開始時」以外のものについて、対象者にも効果が適用されていた問題を修正
// 1.0.0 2016/09/25 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc スキルの副作用プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SideEffectSkill.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help SideEffectSkill.js
 *
 * スキル使用時に、使用者に対して適用されるスキル効果を設定できます。
 * 副作用が適用されるタイミングは以下の中から選択できます。
 *
 * ・スキル入力時(敵キャラのみ有効)
 * 味方の行動入力前に副作用が適用されます。敵キャラ専用です。
 *
 * ・スキル使用前
 * スキルを使用する直前に副作用が適用されます。スキルを使用する時点では
 * すでに適用済みの状態になっています。
 *
 * ・スキル使用時
 * スキルを使用して、相手に効果が適用されるのと同じタイミングで
 * 副作用が適用されます。
 *
 * ・スキル使用後
 * スキルを使用して、相手に効果が適用された後で、副作用が適用されます。
 * 微妙なタイミングの違い以外は、ほぼ「スキル使用時」と同じです。
 *
 * ・ターン開始時(ターン制戦闘のみ有効)
 * 味方の行動入力が終わってターンが開始された瞬間に
 * 副作用が適用されます。
 *
 * ・ターン終了時(ターン制戦闘のみ有効)
 * 全員の行動が完了してターンが終了した瞬間に
 * 副作用が適用されます。
 *
 * さらにスキルが「成功時のみ」「失敗時のみ」「弱点時のみ」の場合だけ
 * 副作用を適用することもできます。
 *
 * スキルのメモ欄に以下の通り指定してください。
 * 使用効果のうち指定された番号の効果の適用対象がもとの効果範囲の対象者ではなく
 * スキル使用者に変更されます。（対象者には適用されなくなります）
 *
 * <スキル入力時:4,3>  # スキル入力時、効果[4][3]を使用者に適用（敵専用）
 * <OnSkillInput:4,3>  # 同上
 * <スキル使用前:3>    # スキル使用前、効果[3]を使用者に適用
 * <OnSkillBefore:3>   # 同上
 * <スキル使用時:3>    # スキル使用時、効果[3]を使用者に適用
 * <OnSkillUsing:3>    # 同上
 * <スキル使用後:1,5>  # スキル使用後、効果[1][5]を使用者に適用（[,]区切り）
 * <OnSkillAfter:1,5>  # 同上
 * <ターン開始時:2,4>  # ターン開始時、効果[2][4]を使用者に適用
 * <OnTurnStart:2,4>   # 同上
 * <ターン終了時:8>    # ターン終了時、効果[8]を使用者に適用
 * <OnTurnEnd:8>       # 同上
 * <成功時のみ>        # 行動が成功した場合のみ副作用を適用
 * <HitOnly>           # 同上
 * <失敗時のみ>        # 行動が失敗した場合のみ副作用を適用
 * <MissOnly>          # 同上
 * <弱点時のみ>        # 行動が弱点を突いた場合のみ副作用を適用
 * <EffectiveOnly>     # 同上
 * <耐性時のみ>        # 行動が耐性だった場合のみ副作用を適用
 * <ResistOnly>        # 同上
 * <会心時のみ>        # 行動が会心だった場合のみ副作用を適用
 * <CriticalOnly>      # 同上
 * <反射時のみ>        # 行動が魔法反射された場合のみ副作用を適用
 * <ReflectionOnly>    # 同上
 * <無効時のみ>        # 行動のダメージが0だった場合のみ副作用適用
 * <InvalidOnly>       # 同上
 *
 * 複数指定する場合、[,]で区切ってください。効果の番号が[1]が先頭です。
 * また入力時副作用は敵キャラ専用です。
 *
 * 「成功時のみ」「失敗時のみ」といった条件は、以下のタイミングでは
 * スキルを実行前なので使用できません。
 * 　スキル入力時
 * 　スキル使用前
 * 　ターン開始時
 *
 * 効果「コモンイベント」はタイミングが
 * 「ターン開始時」「スキル使用時」「スキル使用後」「ターン終了時」
 * の場合のみ適切なタイミングで実行されます。
 *
 * ・スクリプト（上級者向け）
 * 副作用でコモンイベントを実行した際、以下のスクリプトで
 * 副作用の対象バトラーを取得できます。
 * $gameTemp.getCommonEventSubjectBattler();
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // DataManager
    //  データベースのロード時にスキルとアイテムの使用効果から副作用対象を抜き取ります。
    //  以下のプロパティを新規で追加します。
    //   sideEffectOnInput  : スキル入力時副作用
    //   sideEffectOnBefore : スキル使用前副作用
    //   sideEffectOnAfter  : スキル使用後副作用
    //   sideEffectOnStart  : ターン開始時副作用
    //   sideEffectOnEnd    : ターン終了時副作用
    //=============================================================================
    const _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase      = function() {
        this._itemEffectsCategorize = false;
        _DataManager_loadDatabase.apply(this, arguments);
    };

    const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded      = function() {
        const result = _DataManager_isDatabaseLoaded.apply(this, arguments);
        if (result && !this._itemEffectsCategorize) {
            this._itemEffectsCategorize = true;
            $dataItems.forEach(item => this.categorizeItemEffects(item));
            $dataSkills.forEach(item => this.categorizeItemEffects(item));
        }
        return result;
    };

    DataManager.categorizeItemEffects = function(data) {
        if (!data) return;
        const sideEffectOnEnd = [], sideEffectOnUsing = [], sideEffectOnBefore = [],
            sideEffectOnStart = [], sideEffectOnInput = [], sideEffectOnAfter = [];
        const numbersOnInput  = this.getSideEffectNumbers(data, ['OnSkillInput', 'スキル入力時']);
        const numbersOnBefore = this.getSideEffectNumbers(data, ['OnSkillBefore', 'スキル使用前']);
        const numbersOnUsing  = this.getSideEffectNumbers(data, ['OnSkillUsing', 'スキル使用時']);
        const numbersOnAfter  = this.getSideEffectNumbers(data, ['OnSkillAfter', 'スキル使用後']);
        const numbersOnStart  = this.getSideEffectNumbers(data, ['OnTurnStart', 'ターン開始時']);
        const numbersOnEnd    = this.getSideEffectNumbers(data, ['OnTurnEnd', 'ターン終了時']);
        const effects         = data.effects;
        for (let i = 0; i < effects.length; i++) {
            const effectIndex = i + 1;
            if (numbersOnInput.contains(effectIndex)) {
                sideEffectOnInput.push(effects[i]);
                effects[i].sideEffect = true;
            }
            if (numbersOnBefore.contains(effectIndex)) {
                sideEffectOnBefore.push(effects[i]);
                effects[i].sideEffect = true;
            }
            if (numbersOnUsing.contains(effectIndex)) {
                sideEffectOnUsing.push(effects[i]);
                effects[i].sideEffect = true;
            }
            if (numbersOnAfter.contains(effectIndex)) {
                sideEffectOnAfter.push(effects[i]);
                effects[i].sideEffect = true;
            }
            if (numbersOnStart.contains(effectIndex)) {
                sideEffectOnStart.push(effects[i]);
                effects[i].sideEffect = true;
            }
            if (numbersOnEnd.contains(effectIndex)) {
                sideEffectOnEnd.push(effects[i]);
                effects[i].sideEffect = true;
            }
        }
        data.effects = effects.filter(effect => !effect.sideEffect);
        data.sideEffectOnInput  = sideEffectOnInput;
        data.sideEffectOnBefore = sideEffectOnBefore;
        data.sideEffectOnUsing  = sideEffectOnUsing;
        data.sideEffectOnAfter  = sideEffectOnAfter;
        data.sideEffectOnStart  = sideEffectOnStart;
        data.sideEffectOnEnd    = sideEffectOnEnd;
    };

    DataManager.getSideEffectNumbers = function(data, names) {
        const metaValue = PluginManagerEx.findMetaValue(data, names);
        if (metaValue) {
            if (metaValue === String(metaValue)) {
                return metaValue.split(',').map(item => parseInt(item));
            } else {
                return [metaValue];
            }
        }
        return [];
    };

    //=============================================================================
    // BattleManager
    //  ターン開始時に開始時副作用を適用します。
    //=============================================================================
    const _BattleManager_startTurn = BattleManager.startTurn;
    BattleManager.startTurn      = function() {
        if (BattleManager.isTpb()) {
            _BattleManager_startTurn.apply(this, arguments);
        } else {
            this.makeActionOrders();
            this._sideEffectBattlers = this._actionBattlers.clone();
            _BattleManager_startTurn.apply(this, arguments);
            this.applyItemSideEffectStart();
        }
    };

    const _BattleManager_endTurn = BattleManager.endTurn;
    BattleManager.endTurn      = function() {
        _BattleManager_endTurn.apply(this, arguments);
        if (!BattleManager.isTpb()) {
            if (this._sideEffectBattlers) {
                this.applyItemSideEffectEnd();
            }
        }
    };

    const _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction      = function() {
        _BattleManager_startAction.apply(this, arguments);
        this._action.applyItemSideEffect('sideEffectOnBefore');
    };

    const _BattleManager_endAction = BattleManager.endAction;
    BattleManager.endAction      = function() {
        _BattleManager_endAction.apply(this, arguments);
        if (this._action) {
            this._action.applyItemSideEffect('sideEffectOnAfter');
        }
    };

    BattleManager.applyItemSideEffectStart = function() {
        this._sideEffectBattlers.forEach(function(battler) {
            const number = battler.numActions();
            for (let i = 0; i < number; i++) {
                battler.action(i).applyItemSideEffect('sideEffectOnStart');
            }
        }, this);
    };

    BattleManager.applyItemSideEffectEnd = function() {
        this._sideEffectBattlers.forEach(function(battler) {
            const actions = battler.getEndActions();
            actions.forEach(function(action) {
                action.applyItemSideEffect('sideEffectOnEnd');
            }, this);
            battler.resetEndActions();
        }, this);
    };

    BattleManager.displaySideEffectResult = function(subject) {
        this._logWindow.displaySideEffectResult(subject);
        switch (this._phase) {
            case 'input':
            case 'turn':
                this._logWindow.waitForLong();
        }
    };

    //=============================================================================
    // Game_Battler
    //  終了した行動を別変数に保持します。
    //=============================================================================
    const _Game_Battler_removeCurrentAction      = Game_Battler.prototype.removeCurrentAction;
    Game_Battler.prototype.removeCurrentAction = function() {
        const action = this.currentAction();
        if (action) {
            this._endActions = this.getEndActions();
            this._endActions.push(action);
        }
        _Game_Battler_removeCurrentAction.apply(this, arguments);
    };

    Game_Battler.prototype.getEndActions = function() {
        return this._endActions || [];
    };

    Game_Battler.prototype.resetEndActions = function() {
        this._endActions = null;
    };

    const _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function() {
        _Game_Battler_onBattleEnd.apply(this, arguments);
        this.resetEndActions();
    };

    //=============================================================================
    // Game_Enemy
    //  行動入力時に副作用を適用します。
    //=============================================================================
    const _Game_Enemy_makeActions      = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function() {
        _Game_Enemy_makeActions.apply(this, arguments);
        const number = this.numActions();
        for (let i = 0; i < number; i++) {
            this.action(i).applyItemSideEffect('sideEffectOnInput');
        }
        BattleManager.checkBattleEnd();
    };

    //=============================================================================
    // Game_Action
    //  副作用を適用します。
    //=============================================================================
    const _Game_Action_apply      = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        if (this._reflectionTarget) {
            this._reflectionForSideEffect = true;
        }
        _Game_Action_apply.apply(this, arguments);
        this.applyItemSideEffect('sideEffectOnUsing', target);
    };

    const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        this._criticalForSideEffect = critical;
        return _Game_Action_makeDamageValue.apply(this, arguments);
    };

    const _Game_Action_applyItemUserEffect      = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        _Game_Action_applyItemUserEffect.apply(this, arguments);
        this._successForSideEffect = true;
    };

    const _Game_Action_calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        const rate = _Game_Action_calcElementRate.apply(this, arguments);
        if (!BattleManager.isInputting()) {
            if (rate >= 1.1) {
                this._effectiveForSideEffect = true;
            }
            if (rate <= 0.9) {
                this._resistForSideEffect = true;
            }
        }
        return rate;
    };

    const _Game_Action_executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        if (value === 0) {
            this._invalidForSideEffect = true;
        }
        _Game_Action_executeDamage.apply(this, arguments);
    };

    Game_Action.prototype.applyItemSideEffect = function(property, target = null) {
        if (!this.isValidSideEffect(property)) {
            return;
        }
        if (!this._applySideEffect) {
            this._applySideEffect = {};
        }
        if (this._applySideEffect[property]) {
            return;
        }
        this._applySideEffect[property] = true;
        if (this.subject() === target) {
            return;
        }
        this.item()[property].forEach(function(effect) {
            this.applyItemEffect(this.subject(), effect);
        }, this);
        this.applyItemSideEffectGlobal(property);
        if (this.isNeedDisplaySideEffect(property)) {
            BattleManager.displaySideEffectResult(this.subject());
            this.subject().result().clear();
        }
    };

    Game_Action.prototype.isValidSideEffect = function(property) {
        if (!this.item() || this.item()[property].length === 0) {
            return false;
        } else {
            return this.isValidSideEffectForSuccess() &&
                this.isValidSideEffectForFailure() &&
                this.isValidSideEffectForEffective() &&
                this.isValidSideEffectForResist() &&
                this.isValidSideEffectForCritical() &&
                this.isValidSideEffectForInvalid() &&
                this.isValidSideEffectForReflection();
        }
    };

    Game_Action.prototype.isValidSideEffectForSuccess = function() {
        return this._successForSideEffect || !PluginManagerEx.findMetaValue(this.item(), ['HitOnly', '成功時のみ']);
    };

    Game_Action.prototype.isValidSideEffectForFailure = function() {
        return !this._successForSideEffect || !PluginManagerEx.findMetaValue(this.item(), ['MissOnly', '失敗時のみ']);
    };

    Game_Action.prototype.isValidSideEffectForEffective = function() {
        return this._effectiveForSideEffect || !PluginManagerEx.findMetaValue(this.item(), ['EffectiveOnly', '弱点時のみ']);
    };

    Game_Action.prototype.isValidSideEffectForResist = function() {
        return this._resistForSideEffect || !PluginManagerEx.findMetaValue(this.item(), ['ResistOnly', '耐性時のみ']);
    };

    Game_Action.prototype.isValidSideEffectForCritical = function() {
        return this._criticalForSideEffect || !PluginManagerEx.findMetaValue(this.item(), ['CriticalOnly', '会心時のみ']);
    };

    Game_Action.prototype.isValidSideEffectForInvalid = function() {
        return this._invalidForSideEffect || !PluginManagerEx.findMetaValue(this.item(), ['InvalidOnly', '無効時のみ']);
    };

    Game_Action.prototype.isValidSideEffectForReflection = function() {
        return this._reflectionForSideEffect || !PluginManagerEx.findMetaValue(this.item(), ['ReflectionOnly', '反射時のみ']);
    };

    Game_Action.prototype.applyItemSideEffectGlobal = function(property) {
        this.item()[property].forEach(function(effect) {
            if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
                $gameTemp.reserveCommonEvent(effect.dataId);
                $gameTemp.setCommonEventSubject(this.subject());
            }
        }, this);
    };

    Game_Action.prototype.isNeedDisplaySideEffect = function(property) {
        if (!$gameParty.inBattle()) {
            return false;
        }
        return !BattleManager.isTpb() || property !== 'sideEffectOnInput';
    };

    //=============================================================================
    // Game_Temp
    //  コモンイベントの予約をスタックします。
    //=============================================================================
    const _Game_Temp_initialize      = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.apply(this, arguments);
        this._commonEventReserveStack   = [];
        this._commonEventSubjects       = [];
        this._commonEventSubjectBattler = null;
        this.getCommonEventSubjectBattler();
    };

    const _Game_Temp_reserveCommonEvent      = Game_Temp.prototype.reserveCommonEvent;
    Game_Temp.prototype.reserveCommonEvent = function(commonEventId) {
        if (this.isCommonEventReserved()) {
            this._commonEventReserveStack.push(commonEventId);
        } else {
            _Game_Temp_reserveCommonEvent.apply(this, arguments);
        }
    };

    Game_Temp.prototype.setCommonEventSubject = function(battler) {
        this._commonEventSubjects.push(battler);
    };

    const _Game_Temp_clearCommonEvent      = Game_Temp.prototype.clearCommonEvent;
    Game_Temp.prototype.clearCommonEvent = function() {
        _Game_Temp_clearCommonEvent.apply(this, arguments);
        if (this._commonEventReserveStack.length > 0) {
            this.reserveCommonEvent(this._commonEventReserveStack.shift());
        }
        if (this._commonEventSubjects.length > 0) {
            this._commonEventSubjectBattler = this._commonEventSubjects.shift();
        } else {
            this._commonEventSubjectBattler = null;
        }
    };

    Game_Temp.prototype.getCommonEventSubjectBattler = function() {
        return this._commonEventSubjectBattler;
    };

    //=============================================================================
    // Window_BattleLog
    //  副作用効果を出力します。
    //=============================================================================
    Window_BattleLog.prototype.displaySideEffectResult = function(subject) {
        this.displayChangedStates(subject);
        this.displayChangedBuffs(subject);
        subject.startDamagePopup();
        if (!$gameSystem.isSideView() && subject.result().used) {
            this.displayDamage(subject);
        }
    };

    Window_BattleLog.prototype.waitForLong = function() {
        if (this.countTextStack() > 0) {
            this.push('waitForSideEffectMessage');
            this.push('clear');
        }
    };

    Window_BattleLog.prototype.waitForSideEffectMessage = function() {
        this._waitCount = 30;
    };

    Window_BattleLog.prototype.countTextStack = function() {
        return this._methods.reduce(function(prevValue, method) {
            return prevValue + (method.name === 'addText' ? 1 : 0);
        }, 0);
    };
})();

