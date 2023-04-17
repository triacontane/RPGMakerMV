/*=============================================================================
 SameItemDisabled.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
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
        return this._actionStack.pop();
    };

    Game_Party.prototype.execAction = function(action) {
        this._actionStack = this._actionStack.filter(a => a !== action);
    };

    Game_Party.prototype.findReserveItemCount = function(item) {
        return this._actionStack.filter(a => a.item() === item || a.subItem === item).length;
    };

    Game_Party.prototype.findReserveSkillMpCost = function(battler) {
        return this._actionStack.filter(a => a.isSkill() && a.subject() === battler)
            .reduce((a, b) => a + b.item().mpCost, 0);
    };

    Game_Party.prototype.findReserveSkillTpCost = function(battler) {
        return this._actionStack.filter(a => a.isSkill() && a.subject() === battler)
            .reduce((a, b) => a + b.item().tpCost, 0);
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
        _Scene_Battle_onItemOk.apply(this, arguments);
        const item = this._itemWindow.item();
        if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
            const action = BattleManager.inputtingAction();
            action.subItem = item;
        }
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
        const count = this.numItems(item) - this.findReserveItemCount(item);
        return count > 0;
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
