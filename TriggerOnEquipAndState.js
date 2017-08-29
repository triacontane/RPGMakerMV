//=============================================================================
// TriggerOnEquipAndState.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * @author トリアコンタン
 *
 * @param 戦闘メンバーのみ
 * @desc 変数やスイッチが変動する対象となるアクターが戦闘メンバーに限定されます。
 * @default false
 * @type boolean
 *
 * @help 装備またはステートの着脱時に、変数およびスイッチを操作できるようになります。
 * 着脱時に、スイッチの場合はON/OFFが切り替わり、変数の場合は値が増減します。
 * 操作対象および設定値には制御文字およびJavaScript計算式を利用できます。
 *
 * 対象となっているアクターがパーティから外れた場合、スイッチはOFFになります。
 * (ver1.3.0以降の仕様)
 *
 * [アイテム]および[ステート]のメモ欄に以下の通り記述してください。
 *
 * ・操作されるスイッチ番号や変数番号です。
 *  <TOESスイッチ対象:3>        // 3番のスイッチが操作対象
 *  <TOES変数対象:20 + actorId> // 20番 + アクターIDの変数が操作対象
 *
 * 通常の制御文字やJavaScript計算式に加えて「actorId」と記述すると、
 * 装備やステートが変更された対象のアクターIDに変換されます。
 *
 * ・スイッチに設定される値です。（省略時はONになります）
 *  <TOESスイッチ設定値:ON>  // 装備時にスイッチがONになり、解除するとOFFになります。
 *  <TOESスイッチ設定値:OFF> // 装備時にスイッチがOFFになり、解除するとONになります。
 *
 * ・変数に設定される値です。
 *  <TOES変数設定値:3> // 装備時に3加算され、解除すると3減算されます。
 *
 * 一度に二つ以上のスイッチや変数を操作したい場合は項目名の後ろに
 * 　数字を追加してください。(3以降も同様)
 *  <TOESスイッチ対象:3>   // 3番のスイッチが操作対象
 *  <TOESスイッチ対象2:5>  // 5番のスイッチも操作対象
 *
 *  注意！
 *  指定する際は、番号に歯抜けがないようにしてください。
 *  以下はダメです。
 *  <TOESスイッチ対象:3>   // 3番のスイッチが操作対象
 *  <TOESスイッチ対象3:5>  // 動作しない
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'TriggerOnEquipAndState';
    var metaTagPrefix = 'TOES';

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
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
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

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharactersAndEval(arg, false);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
    };

    var getArgBoolean = function(arg) {
        return (arg || '').toUpperCase() === 'ON';
    };

    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text == null || text === true) text = '';
        text = text.replace(/&gt;?/gi, '>');
        text = text.replace(/&lt;?/gi, '<');
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameActors.actor(parseInt(arguments[1], 10)) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameParty.members()[parseInt(arguments[1], 10) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return evalFlg ? eval(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramBattleMemberOnly = getParamBoolean(['BattleMemberOnly', '戦闘メンバーのみ']);

    //=============================================================================
    // Game_Party
    //  変数設定が必要かどうかを返します。
    //=============================================================================
    Game_Party.prototype.isNeedControlVariable = function(actor) {
        return !paramBattleMemberOnly || (this.battleMembers().contains(actor) || this.size() < this.maxBattleMembers());
    };

    Game_Party.prototype.getMembersNeedControl = function() {
        return paramBattleMemberOnly ? this.battleMembers() : this.members();
    };

    Game_Party.prototype.getReserveMembers = function() {
        var battleMembers = this.battleMembers();
        return this.members().filter(function(actor) {
            return !battleMembers.contains(actor);
        });
    };

    var _Game_Party_setupStartingMembers      = Game_Party.prototype.setupStartingMembers;
    Game_Party.prototype.setupStartingMembers = function() {
        _Game_Party_setupStartingMembers.apply(this, arguments);
        this.getMembersNeedControl().forEach(function(actor) {
            actor.onChangeMember(true);
        });
    };

    var _Game_Party_addActor      = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function(actorId) {
        _Game_Party_addActor.apply(this, arguments);
        var actor = $gameActors.actor(actorId);
        if (this.getMembersNeedControl().contains(actor)) {
            actor.onChangeMember(true);
        }
    };

    var _Game_Party_removeActor      = Game_Party.prototype.removeActor;
    Game_Party.prototype.removeActor = function(actorId) {
        var actor = $gameActors.actor(actorId);
        if (this.getMembersNeedControl().contains(actor)) {
            actor.onChangeMember(false);
        }
        var reserveMembers = this.getReserveMembers();
        _Game_Party_removeActor.apply(this, arguments);
        if (paramBattleMemberOnly) {
            var members = this.battleMembers();
            reserveMembers.forEach(function(actor) {
                if (members.contains(actor)) {
                    actor.onChangeMember(true);
                }
            });
        }
    };

    var _Game_Party_swapOrder      = Game_Party.prototype.swapOrder;
    Game_Party.prototype.swapOrder = function(index1, index2) {
        var prevMembers = this.getMembersNeedControl();
        var actors      = [$gameActors.actor(this._actors[index1]), $gameActors.actor(this._actors[index2])];
        _Game_Party_swapOrder.apply(this, arguments);
        var members = this.getMembersNeedControl();
        actors.forEach(function(actor) {
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
    var _Game_BattlerBase_addNewState      = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function(stateId) {
        if (this instanceof Game_Actor && !this._states.contains(stateId)) {
            this.onChangeEquipAndState($dataStates[stateId], true);
        }
        _Game_BattlerBase_addNewState.apply(this, arguments);
    };

    var _Game_BattlerBase_eraseState      = Game_BattlerBase.prototype.eraseState;
    Game_BattlerBase.prototype.eraseState = function(stateId) {
        if (this instanceof Game_Actor && this._states.contains(stateId)) {
            this.onChangeEquipAndState($dataStates[stateId], false);
        }
        _Game_BattlerBase_eraseState.apply(this, arguments);
    };

    var _Game_BattlerBase_clearStates      = Game_BattlerBase.prototype.clearStates;
    Game_BattlerBase.prototype.clearStates = function() {
        if (this instanceof Game_Actor && this._states) {
            this._states.forEach(function(stateId) {
                this.onChangeEquipAndState($dataStates[stateId], false);
            }.bind(this));
        }
        _Game_BattlerBase_clearStates.apply(this, arguments);
    };

    //=============================================================================
    // Game_Actor
    //  装備が変更された際のスイッチ、変数制御を追加定義します。
    //=============================================================================
    var _Game_Actor_changeEquip      = Game_Actor.prototype.changeEquip;
    Game_Actor.prototype.changeEquip = function(slotId, item) {
        var prevItem = new Game_Item(this._equips[slotId].object());
        _Game_Actor_changeEquip.apply(this, arguments);
        var newItem = this._equips[slotId];
        if (prevItem.itemId() !== 0 && prevItem.itemId() !== newItem.itemId()) {
            this.onChangeEquipAndState(prevItem.object(), false);
        }
        if (newItem.itemId() !== 0 && newItem.itemId() !== prevItem.itemId()) {
            this.onChangeEquipAndState(newItem.object(), true);
        }
    };

    var _Game_Actor_discardEquip = Game_Actor.prototype.discardEquip;
    Game_Actor.prototype.discardEquip = function(item) {
        var slotId = this.equips().indexOf(item);
        if (slotId >= 0) {
            this.onChangeEquipAndState(item, false);
        }
        _Game_Actor_discardEquip.apply(this, arguments);
    };

    Game_Actor.prototype.onChangeMember = function(addedSign) {
        this.equips().forEach(function(equip) {
            if (equip && equip.id !== 0) {
                this.onChangeEquipAndState(equip, addedSign, true);
            }
        }.bind(this));
        this._states.forEach(function(stateId) {
            this.onChangeEquipAndState($dataStates[stateId], addedSign, true);
        }.bind(this));
    };

    Game_Actor.prototype.onChangeEquipAndState = function(item, addedSign, force) {
        if (!$gameParty.isNeedControlVariable(this) && !force) return;
        var index = 1;
        while (index) {
            if (this.controlVariable(item, addedSign, index === 1 ? '' : String(index))) {
                index++;
            } else {
                index = 0;
            }
        }
    };

    Game_Actor.prototype.controlVariable = function(item, addedSign, indexString) {
        var switchTarget = getMetaValues(item, ['スイッチ対象' + indexString, 'SwitchTarget' + indexString]);
        var result       = false;
        if (switchTarget) {
            var switchId = this.getVariableIdForToes(switchTarget, $dataSystem.switches.length - 1);
            var switchValue = getMetaValues(item, ['スイッチ設定値' + indexString, 'SwitchValue' + indexString]);
            $gameSwitches.setValue(switchId, switchValue ? !(getArgBoolean(switchValue) ^ addedSign) : addedSign);
            result = true;
        }
        var variableTarget = getMetaValues(item, ['変数対象' + indexString, 'VariableTarget' + indexString]);
        if (variableTarget) {
            var variableId    = this.getVariableIdForToes(variableTarget, $dataSystem.variables.length - 1);
            var variableValue = getMetaValues(item, ['変数設定値' + indexString, 'VariableValue' + indexString]);
            var resultValue   = (variableValue ? getArgNumber(variableValue) : 1) * (addedSign ? 1 : -1);
            $gameVariables.setValue(variableId, $gameVariables.value(variableId) + resultValue);
            result = true;
        }
        return result;
    };

    Game_Actor.prototype.getVariableIdForToes = function(target, max) {
        var actorId = this._actorId; // used in eval
        var result  = 0;
        try {
            result = eval(getArgString(target)).clamp(1, max);
        } catch (e) {
            console.error(e.toString());
            console.log(e.stack);
        }
        return result;
    };

    //=============================================================================
    // Game_EquipSlot
    //  for HIME_EquipSlotsCore.js
    //=============================================================================
    Game_EquipSlot.prototype.itemId = function() {
        return this._item.itemId();
    };
})();

