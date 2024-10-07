/*=============================================================================
 SameItemDisabled.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.3.4 2024/10/07 複数回行動のコストを考慮する設定のとき、MP消費率を計算に入れていなかった問題を修正
 1.3.3 2024/06/09 行動選択してから実際に行動する前に行動不能になったとき、使用予定だったコストが解放されない問題を修正
 1.3.2 2024/01/11 1.3.0の機能説明をヘルプに追加
 1.3.1 2023/04/20 1.2.0で追加した併用対応にいくつか不具合があったので修正
 1.3.0 2023/04/18 複数回行動できるアクターの場合、前に選択したスキルのコストを考慮して使用可能か判定する機能を追加
 1.2.0 2023/04/17 CSVN_armsAsSpecialEffectItem.jsと併用できるよう専用のコードを追加
 1.1.0 2023/04/17 テスト用コードが誤って混入していたので修正
 1.0.0 2023/04/16 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 同一アイテム使用禁止プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SameItemDisabled.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @orderAfter CSVN_armsAsSpecialEffectItem
 * @author トリアコンタン
 *
 * @param multiActionCost
 * @text 複数回行動のコストを考慮
 * @desc 複数回行動できるアクターの場合、前に選択したスキルのコストを考慮して使用可能か判定します。
 * @default false
 * @type boolean
 *
 * @param excludeNonConsumed
 * @text 非消耗アイテム除外
 * @desc 消耗しないアイテムは同時使用可能とします。
 * @default false
 * @type boolean
 *
 * @help SameItemDisabled.js
 *
 * 複数人で同一のアイテムを使用できなくなります。
 * 消耗の設定に拘わらず使用できません。
 * 個数に余裕がある場合は使用できます。
 *
 * また、複数回行動できるアクターの場合、前に選択したスキルの
 * コストを考慮して使用可能か判定する機能もあります。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Party_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function() {
        _Game_Party_initialize.apply(this, arguments);
        this.initActionStack();
    };

    Game_Party.prototype.initActionStack = function() {
        this._actionStack = [];
    };

    Game_Party.prototype.pushAction = function(action) {
        if (!action) {
            return;
        }
        this._actionStack.push(action);
    };

    Game_Party.prototype.popAction = function() {
        const action = this._actionStack.pop();
        if (action?.subItem) {
            action.subItem = null;
        }
        return action;
    };

    Game_Party.prototype.execAction = function(action) {
        this._actionStack = this._actionStack.filter(a => a !== action);
    };

    Game_Party.prototype.clearActionByBattler = function(battler) {
        this._actionStack = this._actionStack.filter(action => action.subject() !== battler);
    };

    Game_Party.prototype.findReserveItemCount = function(item) {
        return this._actionStack.filter(action => action.item() === item || action.subItem === item).length;
    };

    Game_Party.prototype.findReserveSkillMpCost = function(battler) {
        return this.findActionStack(battler)
            .reduce((prev, action) => prev + battler.skillMpCost(action.item()), 0);
    };

    Game_Party.prototype.findReserveSkillTpCost = function(battler) {
        return this.findActionStack(battler)
            .reduce((prev, action) => prev + battler.skillTpCost(action.item()), 0);
    };

    Game_Party.prototype.findActionStack = function(battler) {
        return this._actionStack.filter(action => action.isSkill() && action.subject() === battler);
    };

    const _Game_BattlerBase_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
        const result = _Game_BattlerBase_canPaySkillCost.apply(this, arguments);
        if (BattleManager.isInputting() && param.multiActionCost) {
            const party = $gameParty;
            return result && this._mp - party.findReserveSkillMpCost(this) >= this.skillMpCost(skill) &&
                this._tp - party.findReserveSkillTpCost(this) >= this.skillTpCost(skill);
        } else {
            return result;
        }
    };

    const _Game_Battler_clearActions = Game_Battler.prototype.clearActions;
    Game_Battler.prototype.clearActions = function() {
        _Game_Battler_clearActions.apply(this, arguments);
        $gameParty.clearActionByBattler(this);
    };

    const _Game_Party_numItems = Game_Party.prototype.numItems;
    Game_Party.prototype.numItems = function(item) {
        const result = _Game_Party_numItems.apply(this, arguments);
        if (BattleManager.isInputting()) {
            if (param.excludeNonConsumed && !item.consumable) {
                return result;
            } else {
                return result - this.findReserveItemCount(item);
            }
        } else {
            return result;
        }
    };

    // for CSVN_armsAsSpecialEffectItem.js start
    const _Scene_Battle_onItemOk = Scene_Battle.prototype.onItemOk;
    Scene_Battle.prototype.onItemOk = function() {
        const item = this._itemWindow.item();
        if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
            const action = BattleManager.inputtingAction();
            action.subItem = item;
        }
        _Scene_Battle_onItemOk.apply(this, arguments);
    };

    const _Game_Party_canUse = Game_Party.prototype.canUse;
    Game_Party.prototype.canUse = function(item) {
        const result = _Game_Party_canUse.apply(this, arguments);
        if (BattleManager.isInputting()) {
            return result && this.canUseEquipItem(item);
        } else {
            return result;
        }
    };

    Game_Party.prototype.canUseEquipItem = function(item) {
        if (param.excludeNonConsumed) {
            return true;
        }
        if (!DataManager.isArmor(item) && !DataManager.isWeapon(item)) {
            return true;
        }
        return this.numItems(item) > 0;
    };
    // for CSVN_armsAsSpecialEffectItem.js end

    const _BattleManager_setup = BattleManager.setup;
    BattleManager.setup = function(troopId, canEscape, canLose) {
        _BattleManager_setup.apply(this, arguments);
        $gameParty.initActionStack();
    };

    const _BattleManager_selectNextCommand = BattleManager.selectNextCommand;
    BattleManager.selectNextCommand = function() {
        $gameParty.pushAction(this.inputtingAction());
        _BattleManager_selectNextCommand.apply(this, arguments);
    };

    const _BattleManager_selectPreviousCommand = BattleManager.selectPreviousCommand;
    BattleManager.selectPreviousCommand = function() {
        _BattleManager_selectPreviousCommand.apply(this, arguments);
        $gameParty.popAction();
    };

    const _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        _BattleManager_startAction.apply(this, arguments);
        $gameParty.execAction(this._action);
    };

    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        _BattleManager_endBattle.apply(this, arguments);
        $gameParty.initActionStack();
    };
})();
