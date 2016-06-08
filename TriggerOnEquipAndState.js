//=============================================================================
// TriggerOnEquipAndState.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2016/06/08 一つの装備で複数のスイッチ、変数を操作できるよう修正
// 1.0.1 2016/06/03 スクリプトに「>」「<」を使えるように修正
// 1.0.0 2016/04/03 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 装備変更時の変数操作プラグイン
 * @author トリアコンタン
 *
 * @help 装備またはステートの着脱時に、変数およびスイッチを操作できるようになります。
 * 着脱時に、スイッチの場合はON/OFFが切り替わり、変数の場合は値が増減します。
 * 操作対象および設定値には制御文字およびJavaScript計算式を利用できます。
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
 *  <TOESスイッチ対象:3>   // 3番のスイッチが操作対象
 *  <TOESスイッチ対象3:5>  // 動作しない
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var metaTagPrefix = 'TOES';

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

    var getArgString = function (arg, upperFlg) {
        arg = convertEscapeCharactersAndEval(arg, false);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) text = '';
        var metaTagDisConvert = {
            "&lt;": "<",
            "&gt;": ">"
        };
        text = text.replace(/\&gt\;|\&lt\;/gi, function(value) {
            return metaTagDisConvert[value];
        }.bind(this));
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
    // Game_Actor
    //  装備及びステートが変更された際のスイッチ、変数制御を追加定義します。
    //=============================================================================
    var _Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
    Game_Actor.prototype.changeEquip = function(slotId, item) {
        var prevItem = new Game_Item(this._equips[slotId].object());
        _Game_Actor_changeEquip.apply(this, arguments);
        var newItem = this._equips[slotId];
        if (prevItem._itemId !== 0 && prevItem._itemId !== newItem._itemId) {
            this.onChangeEquipAndState(prevItem.object(), false);
        }
        if (newItem._itemId !== 0 && newItem._itemId !== prevItem._itemId) {
            this.onChangeEquipAndState(newItem.object(), true);
        }
    };

    var _Game_Actor_initEquips = Game_Actor.prototype.initEquips;
    Game_Actor.prototype.initEquips = function(equips) {
        _Game_Actor_initEquips.apply(this, arguments);
        this._equips.forEach(function (equip) {
            if (equip._itemId !== 0) {
                this.onChangeEquipAndState(equip.object(), true);
            }
        }.bind(this));
    };

    var _Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function(stateId) {
        if (this instanceof Game_Actor && !this._states.contains(stateId)) {
            this.onChangeEquipAndState($dataStates[stateId], true);
        }
        _Game_BattlerBase_addNewState.apply(this, arguments);
    };

    var _Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
    Game_BattlerBase.prototype.eraseState = function(stateId) {
        if (this instanceof Game_Actor && this._states.contains(stateId)) {
            this.onChangeEquipAndState($dataStates[stateId], false);
        }
        _Game_BattlerBase_eraseState.apply(this, arguments);
    };

    Game_Actor.prototype.onChangeEquipAndState = function(item, addedSign) {
        var index = 1;
        while(index) {
            if (this.controlVariable(item, addedSign, index === 1 ? '' : String(index))) {
                index++;
            } else {
                index = 0;
            }
        }
    };

    Game_Actor.prototype.controlVariable = function(item, addedSign, indexString) {
        var switchTarget = getMetaValues(item, ['スイッチ対象' + indexString, 'SwitchTarget' + indexString]);
        var result = false;
        if (switchTarget) {
            var switchId = this.getVariableIdForToes(switchTarget, $dataSystem.switches.length - 1);
            $gameSwitches.setValue(switchId, addedSign);
            result = true;
        }
        var variableTarget = getMetaValues(item, ['変数対象' + indexString, 'VariableTarget' + indexString]);
        if (variableTarget) {
            var variableId = this.getVariableIdForToes(variableTarget, $dataSystem.variables.length - 1);
            var variableValue = getMetaValues(item, ['変数設定値' + indexString, 'VariableValue' + indexString]);
            var resultValue = (variableValue ? getArgNumber(variableValue) : 1) * (addedSign ? 1 : -1);
            $gameVariables.setValue(variableId, $gameVariables.value(variableId) + resultValue);
            result = true;
        }
        return result;
    };

    Game_Actor.prototype.getVariableIdForToes = function(target, max) {
        var actorId = this._actorId; // used in eval
        return eval(getArgString(target)).clamp(1, max);
    };
})();

