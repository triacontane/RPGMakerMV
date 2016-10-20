//=============================================================================
// VariableControlItem.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/10/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Plugin That ...
 * @author triacontane
 *
 * @param param
 * @desc parameter description
 * @default default value
 *
 * @help Plugin That ...
 *
 * Plugin Command
 *  XXXXX [XXX]
 *  ex1：XXXXX 1
 *
 * This plugin is released under the MIT License.
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
 * <VCI変数値:5>    # 指定した変数に値[5]を代入します。
 * <VCIVarValue:5>  # 同上
 *
 * 変数値は、制御文字を適用した上でJavaScript計算式として評価されます。
 * たとえば、アイテムの使用で変数[1]に[5]を加算したい場合は以下の通り設定します。
 * <VCI変数番号:1>
 * <VCI変数値:\v[1] + 5> # 変数[1]の値に[5]を加算した結果を変数[1]に設定
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
        this.applyVariableControl();
    };

    Game_Action.prototype.applyVariableControl = function() {
        var varNumber = getMetaValues(this.item(), ['VarNumber', '変数番号']);
        var operand   = getMetaValues(this.item(), ['VarValue', '変数値']);
        if (varNumber && operand) {
            $gameVariables.setValue(getArgNumber(varNumber, 0), getArgEval(operand));
        }
    };
})();

