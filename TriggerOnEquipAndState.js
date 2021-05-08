//=============================================================================
// TriggerOnEquipAndState.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2021/05/08 MZ向けに再設計
// 1.5.1 2019/12/29 1.5.0の修正以後、パーティメンバーを外したときにエラーになっていた問題を修正
// 1.5.0 2019/11/25 装備スロットごとに変数を増減できる機能を追加
// 1.4.5 2018/05/05 1.4.4で動的データベース構築プラグインとの競合が発生していたので解消
// 1.4.4 2018/05/04 装備封印で外れた場合に変数の増減が行われない問題を修正
// 1.4.3 2018/01/27 DynamicVariables.jsとの連携機能を追加
// 1.4.2 2017/08/29 HIME_EquipSlotsCore.jsとの競合を解消
// 1.4.1 2017/01/12 メモ欄の値が空で設定された場合にエラーが発生するかもしれない問題を修正
// 1.4.0 2016/07/27 スイッチにも設定値タグを付けられるよう修正
// 1.3.2 2016/07/14 「武器(防具)の増減」によって装備が外れた場合に対応
// 1.3.1 2016/07/14 1.3.0で敵を倒した際にエラーになる現象の修正
// 1.3.0 2016/07/14 対象アクターがパーティから外れた場合にスイッチをOFFにする仕様を追加
// 1.2.1 2016/07/07 1.2.0が初期装備に対応していなかった問題を修正
// 1.2.0 2016/07/06 戦闘メンバーのみ有効になる設定を追加
// 1.1.0 2016/06/08 一つの装備で複数のスイッチ、変数を操作できるよう修正
// 1.0.1 2016/06/03 スクリプトに「>」「<」を使えるように修正
// 1.0.0 2016/04/03 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 装備変更時の変数操作プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TriggerOnEquipAndState.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param list
 * @text 操作対象リスト
 * @desc 操作対象になる武具やステートの一覧です。
 * @default []
 * @type struct<Record>[]
 * 
 * @param battleMemberOnly
 * @text 戦闘メンバーのみ
 * @desc 操作対象になるアクターを戦闘メンバーに限定します。
 * @default false
 * @type boolean
 *
 * @help 装備またはステートの着脱時に、変数およびスイッチを操作できるようになります。
 * 着脱時に、スイッチの場合はON/OFFが切り替わり、変数の場合は値が増減します。
 * 操作対象および設定値には制御文字を使用できます。
 * 対象となっているアクターがパーティから外れた場合、スイッチはOFFになります。
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
 * @param name
 * @text 識別子
 * @desc 一覧で区別するための識別子です。特に意味はありません。
 *
 * @param weaponId
 * @text 武器ID
 * @desc 指定した武器を装備すると変数およびスイッチが変動します。
 * @type weapon
 * @default 0
 *
 * @param armorId
 * @text 防具ID
 * @desc 指定した防具を装備すると変数およびスイッチが変動します。
 * @type armor
 * @default 0
 *
 * @param stateId
 * @text ステートID
 * @desc 指定したステートが有効になると変数およびスイッチが変動します。
 * @type state
 * @default 0
 *
 * @param equipType
 * @text 装備タイプ
 * @desc 指定した装備タイプを装備すると変数およびスイッチが変動します。武器や防具ID条件との組み合わせも可能です。
 * @type number
 * @default 0
 *
 * @param list
 * @text 変数リスト
 * @desc 指定した武具やステートが有効になったときに変動させるスイッチと変数のリスト
 * @type struct<Variable>[]
 * @default []
 *
 */

/*~struct~Variable:
 *
 * @param targetSwitch
 * @text 対象スイッチ
 * @desc 武具やステートが有効になったときにONになるスイッチです。外れると(他に有効なメンバーがいても)OFFになります。
 * @type switch
 * @default 0
 *
 * @param targetVariable
 * @text 対象変数
 * @desc 武具やステートが有効になったときに操作される変数です。
 * @type variable
 * @default 0
 *
 * @param addActorId
 * @text アクターIDを加算
 * @desc 指定したスイッチ番号、変数番号にアクターIDを加算した番号が実際の操作対象になります。アクターごとに番号を分ける場合に使います。
 * @type boolean
 * @default false
 *
 * @param operand
 * @text 変化量
 * @desc 対象変数で指定した変数の変化量です。
 * @type number
 * @default 0
 * @min -99999
 * @max 99999
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Party
    //  変数設定が必要かどうかを返します。
    //=============================================================================
    Game_Party.prototype.isNeedControlVariable = function(actor) {
        return !param.battleMemberOnly || this.battleMembers().contains(actor);
    };

    Game_Party.prototype.findControlMembers = function() {
        return param.battleMemberOnly ? this.battleMembers() : this.allMembers();
    };

    Game_Party.prototype.getReserveMembers = function() {
        const battleMembers = this.battleMembers();
        return this.allMembers().filter(actor => !battleMembers.contains(actor));
    };

    const _Game_Party_setupStartingMembers      = Game_Party.prototype.setupStartingMembers;
    Game_Party.prototype.setupStartingMembers = function() {
        _Game_Party_setupStartingMembers.apply(this, arguments);
        this.findControlMembers().forEach(actor => actor.onChangeMember(true));
    };

    const _Game_Party_addActor      = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function(actorId) {
        _Game_Party_addActor.apply(this, arguments);
        const actor = $gameActors.actor(actorId);
        if (this.findControlMembers().contains(actor)) {
            actor.onChangeMember(true);
        }
    };

    const _Game_Party_removeActor      = Game_Party.prototype.removeActor;
    Game_Party.prototype.removeActor = function(actorId) {
        const actor = $gameActors.actor(actorId);
        if (this.findControlMembers().contains(actor)) {
            actor.onChangeMember(false);
        }
        const reserveMembers = this.getReserveMembers();
        _Game_Party_removeActor.apply(this, arguments);
        if (param.battleMemberOnly) {
            const members = this.battleMembers();
            reserveMembers.forEach(actor => {
                if (members.contains(actor)) {
                    actor.onChangeMember(true);
                }
            });
        }
    };

    const _Game_Party_swapOrder      = Game_Party.prototype.swapOrder;
    Game_Party.prototype.swapOrder = function(index1, index2) {
        const prevMembers = this.findControlMembers();
        const actors      = [$gameActors.actor(this._actors[index1]), $gameActors.actor(this._actors[index2])];
        _Game_Party_swapOrder.apply(this, arguments);
        const members = this.findControlMembers();
        actors.forEach(actor => {
            if (prevMembers.contains(actor) && !members.contains(actor)) {
                actor.onChangeMember(false);
            }
            if (members.contains(actor) && !prevMembers.contains(actor)) {
                actor.onChangeMember(true);
            }
        });
    };

    //=============================================================================
    // Game_Actor
    //  ステートが変更された際のスイッチ、変数制御を追加定義します。
    //=============================================================================
    const _Game_BattlerBase_addNewState      = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function(stateId) {
        if (this instanceof Game_Actor && !this._states.contains(stateId)) {
            this.onChangeEquipAndState($dataStates[stateId], true);
        }
        _Game_BattlerBase_addNewState.apply(this, arguments);
    };

    const _Game_BattlerBase_eraseState      = Game_BattlerBase.prototype.eraseState;
    Game_BattlerBase.prototype.eraseState = function(stateId) {
        if (this instanceof Game_Actor && this._states.contains(stateId)) {
            this.onChangeEquipAndState($dataStates[stateId], false);
        }
        _Game_BattlerBase_eraseState.apply(this, arguments);
    };

    const _Game_BattlerBase_clearStates      = Game_BattlerBase.prototype.clearStates;
    Game_BattlerBase.prototype.clearStates = function() {
        if (this instanceof Game_Actor && this._states) {
            this._states.forEach(function(stateId) {
                this.onChangeEquipAndState($dataStates[stateId], false);
            }.bind(this));
        }
        _Game_BattlerBase_clearStates.apply(this, arguments);
    };

    // do nothing
    Game_BattlerBase.prototype.onChangeEquipAndState = function(item, addedSign, force, slotId) {}

    //=============================================================================
    // Game_Actor
    //  装備が変更された際のスイッチ、変数制御を追加定義します。
    //=============================================================================
    const _Game_Actor_changeEquip      = Game_Actor.prototype.changeEquip;
    Game_Actor.prototype.changeEquip = function(slotId, item) {
        const prevItem = new Game_Item(this._equips[slotId].object());
        _Game_Actor_changeEquip.apply(this, arguments);
        const newItem = this._equips[slotId];
        if (prevItem.itemId() !== 0 && prevItem.itemId() !== newItem.itemId()) {
            this.onChangeEquipAndState(prevItem.object(), false, false, slotId);
        }
        if (newItem.itemId() !== 0 && newItem.itemId() !== prevItem.itemId()) {
            this.onChangeEquipAndState(newItem.object(), true, false, slotId);
        }
    };

    const _Game_Actor_discardEquip = Game_Actor.prototype.discardEquip;
    Game_Actor.prototype.discardEquip = function(item) {
        const slotId = this.equips().indexOf(item);
        if (slotId >= 0) {
            this.onChangeEquipAndState(item, false, false, slotId);
        }
        _Game_Actor_discardEquip.apply(this, arguments);
    };

    Game_Actor.prototype.onChangeMember = function(addedSign) {
        this.equips().forEach((equip, index) => {
            if (equip && equip.id !== 0) {
                this.onChangeEquipAndState(equip, addedSign, true, index);
            }
        });
        this._states.forEach(stateId => {
            this.onChangeEquipAndState($dataStates[stateId], addedSign, true);
        });
    };

    const _Game_Actor_releaseUnequippableItems = Game_Actor.prototype.releaseUnequippableItems;
    Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
        if (forcing) {
            _Game_Actor_releaseUnequippableItems.apply(this, arguments);
            return;
        }
        const prevEquips = this.equips();
        _Game_Actor_releaseUnequippableItems.apply(this, arguments);
        prevEquips.forEach(function(prevEquip, index) {
            const equip = this._equips[index].object();
            if (prevEquip && !equip) {
                this.onChangeEquipAndState(prevEquip, false, false, index);
            }
        }, this);
    };

    Game_Actor.prototype.onChangeEquipAndState = function(item, addedSign, force, slotId) {
        if (!$gameParty.isNeedControlVariable(this) && !force) {
            return;
        }
        const variableController = new Game_EquipAndStateVariable(this);
        variableController.execute(item, addedSign, slotId);
    };

    /**
     * 装備変更時の変数操作を管理します。
     */
    class Game_EquipAndStateVariable {
        constructor(actor) {
            this._actor = actor;
        }

        execute(item, addedSign, slotId) {
            param.list.filter(record => this.isValidParam(record, item, slotId))
                .forEach(record => record.list.forEach(variable => this.controlVariable(variable, addedSign)));
        }

        isValidParam(record, item, slotId) {
            if (record.equipType && record.equipType !== slotId + 1) {
                return false;
            } else if (DataManager.isWeapon(item)) {
                return record.weaponId === item.id;
            } else if (DataManager.isArmor(item)) {
                return record.armorId === item.id;
            } else if (!record.equipType) {
                return record.stateId === item.id;
            } else {
                return true;
            }
        }

        controlVariable(variable, addedSign) {
            let variableId = variable.targetVariable;
            if (variableId) {
                if (variable.addActorId) {
                    variableId += this._actor.actorId();
                }
                const prev = $gameVariables.value(variableId);
                const operand = variable.operand;
                $gameVariables.setValue(variableId, prev + (addedSign ? operand : -operand));
            }
            let switchId = variable.targetSwitch;
            if (switchId) {
                if (variable.addActorId) {
                    switchId += this._actor.actorId();
                }
                $gameSwitches.setValue(switchId, addedSign);
            }
        }
    }
})();
