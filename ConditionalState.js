//=============================================================================
// ConditionalState.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/04/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ConditionalStatePlugin
 * @author triacontane
 *
 * @help Grant state when certain conditions are satisfied.
 * Please enter the following in the memo field with features.
 *
 * <CS_上限HP:30,4>  # 現在のHPが30%を上回るとステート[4]を付与
 * <CS_UpperHp:30,4> # 同上
 * <CS_下限HP:40,5>  # 現在のHPが40%を下回るとステート[5]を付与
 * <CS_LowerHp:40,5> # 同上
 * <CS_上限MP:30,4>  # 現在のMPが30%を上回るとステート[4]を付与
 * <CS_UpperMp:30,4> # 同上
 * <CS_下限MP:40,5>  # 現在のMPが40%を下回るとステート[5]を付与
 * <CS_LowerMp:40,5> # 同上
 * <CS_上限TP:30,4>  # 現在のTPが30%を上回るとステート[4]を付与
 * <CS_UpperTp:30,4> # 同上
 * <CS_下限TP:40,5>  # 現在のTPが40%を下回るとステート[5]を付与
 * <CS_LowerTp:40,5> # 同上
 *
 * The similar plug-in "AutomaticState.js" is set in units of state
 * This is set by Butler unit.
 *
 * There is no plug-in command in this plug-in.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 条件付きステート付与プラグイン
 * @author トリアコンタン
 *
 * @help HPやMPの残量の条件を満たしたときにステートを付与します。
 * 特徴を有するメモ欄に以下の通り入力してください。
 *
 * <CS_上限HP:30,4>  # 現在のHPが30%を上回るとステート[4]を付与
 * <CS_UpperHp:30,4> # 同上
 * <CS_下限HP:40,5>  # 現在のHPが40%を下回るとステート[5]を付与
 * <CS_LowerHp:40,5> # 同上
 * <CS_上限MP:30,4>  # 現在のMPが30%を上回るとステート[4]を付与
 * <CS_UpperMp:30,4> # 同上
 * <CS_下限MP:40,5>  # 現在のMPが40%を下回るとステート[5]を付与
 * <CS_LowerMp:40,5> # 同上
 * <CS_上限TP:30,4>  # 現在のTPが30%を上回るとステート[4]を付与
 * <CS_UpperTp:30,4> # 同上
 * <CS_下限TP:40,5>  # 現在のTPが40%を下回るとステート[5]を付与
 * <CS_LowerTp:40,5> # 同上
 *
 * 類似プラグイン「AutomaticState.js」はステート単位で設定しますが
 * こちらはバトラー単位で設定します。
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
    var metaTagPrefix = 'CS_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var getMetaValues = function(object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (!isString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isString = function(args) {
        return String(args) === args;
    };

    var getArgArrayString = function(args) {
        var values = args.split(',');
        for (var i = 0; i < values.length; i++) {
            values[i] = values[i].trim();
        }
        return values;
    };

    var getArgArrayNumber = function(args, min, max) {
        var values = getArgArrayString(args, false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) {
            values[i] = (parseFloat(values[i]) || 0).clamp(min, max);
        }
        return values;
    };

    //=============================================================================
    // Game_BattlerBase
    //  オートステートをチェックします。
    //=============================================================================
    var _Game_BattlerBase_refresh = Game_BattlerBase.prototype.refresh;
    Game_BattlerBase.prototype.refresh = function() {
        _Game_BattlerBase_refresh.apply(this, arguments);
        this.refreshConditionalState();
    };

    Game_BattlerBase.prototype.getConditionalStates = function() {
        return this._conditionalStates = this._conditionalStates || [];
    };

    Game_BattlerBase.prototype.addConditionalState = function(stateId) {
        var states = this.getConditionalStates();
        if (states.contains(stateId)) return;
        states.push(stateId);
        this.addState(stateId);
    };

    Game_BattlerBase.prototype.removeConditionalState = function(stateId) {
        var states = this.getConditionalStates();
        if (!states.contains(stateId)) return;
        states.splice(states.indexOf(stateId), 1);
        this.removeState(stateId);
    };

    Game_BattlerBase.prototype.refreshConditionalState = function() {
        this.updateConditionalStateUpper(this.hpRate(), ['UpperHp', '上限HP']);
        this.updateConditionalStateUpper(this.mpRate(), ['UpperMp', '上限MP']);
        this.updateConditionalStateUpper(this.tpRate(), ['UpperTp', '上限TP']);
        this.updateConditionalStateLower(this.hpRate(), ['LowerHp', '下限HP']);
        this.updateConditionalStateLower(this.mpRate(), ['LowerMp', '下限MP']);
        this.updateConditionalStateLower(this.tpRate(), ['LowerTp', '下限TP']);
    };

    Game_BattlerBase.prototype.updateConditionalStateUpper = function(rate, names) {
        var stateCondition = this.getMetaInfoConditionalState(names);
        if (!stateCondition) return;
        if (stateCondition[0] > rate * 100) {
            this.addConditionalState(stateCondition[1]);
        } else {
            this.removeConditionalState(stateCondition[1])
        }
    };

    Game_BattlerBase.prototype.updateConditionalStateLower = function(rate, names) {
        var stateCondition = this.getMetaInfoConditionalState(names);
        if (!stateCondition) return;
        if (rate * 100 < stateCondition[0]) {
            this.addConditionalState(stateCondition[1]);
        } else {
            this.removeConditionalState(stateCondition[1])
        }
    };

    Game_BattlerBase.prototype.getMetaInfoConditionalState = function(names) {
        var stateCondition = null;
        this.traitObjects().some(function(traitObject) {
            stateCondition = getMetaValues(traitObject, names);
            return !!stateCondition;
        });
        return (isString(stateCondition) ? getArgArrayNumber(stateCondition) : null);
    };
})();

