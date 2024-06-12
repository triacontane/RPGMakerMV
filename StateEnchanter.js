/*=============================================================================
 StateEnchanter.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2024/06/12 ダメージのパラメータ型を数値に変更し、一定以上のダメージによって解除される機能を追加
 1.0.0 2024/06/06 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 付与者付きステートプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateEnchanter.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param states
 * @text ステート一覧
 * @desc 付与者付きステートのリストです。重複するステートIDは指定できません。
 * @default []
 * @type struct<State>[]
 *
 * @help StateEnchanter.js
 *
 * 付与者が存在するステートを定義できます。
 * 通常の解除条件に加えて、付与者が戦闘不能になった場合や一定以上のダメージを
 * 受けた場合にも解除されるようなステートを作成できます。
 *
 * イベントなどでステートを付与した場合は（付与者を特定できないので）無効です。
 * また、解除は戦闘画面でのみ行われます。
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

/*~struct~State:
 *
 * @param stateId
 * @text ステートID
 * @desc ステートIDです。
 * @default 1
 * @type state
 *
 * @param condition
 * @text 解除条件
 * @desc ステートの解除条件です。解除条件を最初から満たした状態でステートを付与しようとすると即座に解除されます。
 *
 * @param dead
 * @text 戦闘不能
 * @desc 付与者が戦闘不能になった場合に解除されます。
 * @default false
 * @type boolean
 * @parent condition
 *
 * @param hpRate
 * @text HP割合
 * @desc 付与者のHPが指定した割合(100分率)より小さくなった場合に解除されます。0を指定した場合は無効です。
 * @default 0
 * @type number
 * @parent condition
 *
 * @param mpRate
 * @text MP割合
 * @desc 付与者のMPが指定した割合(100分率)より小さくなった場合に解除されます。0を指定した場合は無効です。
 * @default 0
 * @type number
 * @parent condition
 *
 * @param damage
 * @text ダメージ
 * @desc 付与者が指定値以上のダメージを受けた場合に解除されます。イベントや特徴による増減は含みません。
 * @default 0
 * @type number
 * @parent condition
 *
 * @param validStates
 * @text 有効ステート
 * @desc 付与者が、指定したいずれかのステートになった場合に解除されます。
 * @default []
 * @type state[]
 * @parent condition
 *
 * @param invalidStates
 * @text 無効ステート
 * @desc 付与者が、指定したいずれかのステートに"なっていない"場合に解除されます。
 * @default []
 * @type state[]
 * @parent condition
 *
 * @param script
 * @text スクリプト
 * @desc 指定したスクリプトがtrueを返すと解除されます。eは付与者を参照できます。
 * @default
 * @type multiline_string
 * @parent condition
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.states) {
        return;
    }

    const _Game_Action_itemEffectAddState = Game_Action.prototype.itemEffectAddState;
    Game_Action.prototype.itemEffectAddState = function(target, effect) {
        BattleManager.setStateEnchanter(this.subject());
        _Game_Action_itemEffectAddState.apply(this, arguments);
        BattleManager.setStateEnchanter(null);
    };

    const _Game_Battler_onDamage = Game_Battler.prototype.onDamage;
    Game_Battler.prototype.onDamage = function(value) {
        _Game_Battler_onDamage.apply(this, arguments);
        BattleManager.setEnchanterDamaged(this, value);
    };

    const _Game_Battler_addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        _Game_Battler_addState.apply(this, arguments);
        BattleManager.appendEnchanterState(stateId, this);
    };

    const _BattleManager_update = BattleManager.update;
    BattleManager.update = function(timeActive) {
        _BattleManager_update.apply(this, arguments);
        this.updateEnchanterStates();
    };

    BattleManager.updateEnchanterStates = function() {
        this._enchanterStates = this._enchanterStates.filter(state => state.update());
    };

    BattleManager._enchanterStates = [];
    BattleManager.setStateEnchanter = function(battler) {
        this._enchanter = battler;
    };

    BattleManager.appendEnchanterState = function(stateId, target) {
        if (!this._enchanter) {
            return;
        }
        const state = param.states.find(state => state.stateId === stateId);
        if (state) {
            this._enchanterStates.push(new Game_StateEnchanter(stateId, this._enchanter, target, state));
        }
    };

    BattleManager.setEnchanterDamaged = function(battler, value) {
        this._enchanterStates.forEach(state => state.setDamaged(battler, value));
    };

    class Game_StateEnchanter {
        constructor(stateId, enchanter, target, condition) {
            this._stateId = stateId;
            this._enchanter = enchanter;
            this._target = target;
            this._condition = condition;
            this._damageValue = 0;
        }

        isExpired() {
            if (!$gameParty.members().concat($gameTroop.members()).includes(this._enchanter)) {
                return true;
            } else {
                return !this._target.isStateAffected(this._stateId);
            }
        }

        setDamaged(battler, value) {
            if (battler === this._enchanter) {
                this._damageValue += value;
            }
        }

        update() {
            if (this._target.isStateAffected(this._stateId) && this.isRemovable()) {
                this._target.removeState(this._stateId);
                BattleManager._logWindow.displayRemovedStates(this._target);
            }
            return !this.isExpired();
        }

        isRemovable() {
            if (this.isExpired()) {
                return true;
            }
            const c = this._condition;
            const e = this._enchanter;
            const conditions = [
                () => c.dead && e.isDead(),
                () => c.damage > 0 && this._damageValue >= c.damage,
                () => c.validStates && c.validStates.some(stateId => e.isStateAffected(stateId)),
                () => c.invalidStates && c.invalidStates.some(stateId => !e.isStateAffected(stateId)),
                () => c.hpRate > 0 && e.hpRate() < c.hpRate / 100,
                () => c.mpRate > 0 && e.mpRate() < c.mpRate / 100,
                () => c.script && eval(c.script)
            ];
            return conditions.some(func => func());
        }
    }
})();
