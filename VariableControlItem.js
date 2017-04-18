//=============================================================================
// VariableControlItem.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2017/04/19 範囲が「なし」の場合も操作できるよう修正
// 1.1.0 2016/10/21 加算と代入を別々のメモ欄で設定できるよう変更
// 1.0.0 2016/10/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc VariableControlItemPlugin
 * @author triacontane
 *
 * @help アイテムもしくはスキルを使用し、かつ
 * 行動が成功した場合に、変数を操作できます。
 *
 * アイテムもしくはスキルのメモ欄に以下の通り指定してください。
 *
 * <VCI変数番号:3>  # 変数番号[3]に値を設定します。
 * <VCIVarNumber:3> # 同上
 * <VCI代入値:5>    # 指定した変数に値[5]を代入します。
 * <VCISetValue:5>  # 同上
 * <VCI加算値:5>    # 指定した変数に値[5]を加算します。
 * <VCIAddValue:5>  # 同上
 * ※加算値に負の値を指定すると減算になります。
 *
 * 設定値は、制御文字を適用した上でJavaScript計算式として評価されます。
 * たとえば、アイテムの使用で変数[1]に[5]を乗算したい場合は以下の通り設定します。
 * <VCI変数番号:1>
 * <VCI代入値:\v[1] * 5> # 変数[1]の値に[5]を乗算した結果を変数[1]に設定
 *
 * このプラグインにはプラグインコマンドはありません。
 */
/*:ja
 * @plugindesc 変数操作アイテムプラグイン
 * @author トリアコンタン
 *
 * @help アイテムもしくはスキルを使用し、かつ
 * 行動が成功した場合に、変数を操作できます。
 *
 * アイテムもしくはスキルのメモ欄に以下の通り指定してください。
 *
 * <VCI変数番号:3>  # 変数番号[3]に値を設定します。
 * <VCIVarNumber:3> # 同上
 * <VCI代入値:5>    # 指定した変数に値[5]を代入します。
 * <VCISetValue:5>  # 同上
 * <VCI加算値:5>    # 指定した変数に値[5]を加算します。
 * <VCIAddValue:5>  # 同上
 * ※加算値に負の値を指定すると減算になります。
 *
 * 設定値は、制御文字を適用した上でJavaScript計算式として評価されます。
 * たとえば、アイテムの使用で変数[1]に[5]を乗算したい場合は以下の通り設定します。
 * <VCI変数番号:1>
 * <VCI代入値:\v[1] * 5> # 変数[1]の値に[5]を乗算した結果を変数[1]に設定
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
    var metaTagPrefix = 'VCI';

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var getArgEval = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (eval(convertEscapeCharacters(arg)) || 0).clamp(min, max);
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
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // Game_Action
    //  行動が成功した場合、変数の操作を実行します。
    //=============================================================================
    var _Game_Action_applyItemUserEffect      = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        _Game_Action_applyItemUserEffect.apply(this, arguments);
        if (!this.isForNone()) {
            this.applyVariableControl();
        }
    };

    var _Game_Action_applyGlobal      = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function(target) {
        _Game_Action_applyGlobal.apply(this, arguments);
        if (this.isForNone()) {
            this.applyVariableControl();
        }
    };

    Game_Action.prototype.isForNone = function() {
        return this.checkItemScope([0]);
    };

    Game_Action.prototype.applyVariableControl = function() {
        var varNumberStr = getMetaValues(this.item(), ['VarNumber', '変数番号']);
        if (varNumberStr) {
            var varNumber = getArgNumber(varNumberStr, 0);
            var setValue   = getMetaValues(this.item(), ['SetValue', '代入値']);
            if (setValue) {
                $gameVariables.setValue(varNumber, getArgEval(setValue));
                return;
            }
            var addValue   = getMetaValues(this.item(), ['AddValue', '加算値']);
            if (addValue) {
                var originalValue = $gameVariables.value(varNumber);
                $gameVariables.setValue(varNumber, originalValue + getArgEval(addValue));
            }
        }
    };
})();

