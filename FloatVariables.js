//=============================================================================
// FloatVariables.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.2 2020/10/10 共通版(英語版)のヘルプが正しく読み込めていなかった問題を修正
// 1.1.1 2020/10/08 MZ向けにリファクタリング
// 1.1.0 2017/09/15 型指定機能に対応
// 1.0.0 2016/07/30 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc FloatVariablesPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FloatVariables.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param FloatVariableStart
 * @desc The starting position of a variable to perform a decimal operation.
 * @default 0
 * @type variable
 *
 * @param FloatVariableEnd
 * @desc The end position of a variable to perform a decimal operation.
 * @default 0
 * @type variable
 *
 * @help FloatVariables.js
 *
 * Enables fractional operation on the specified range of variables.
 *
 * In the case of normal (integer operation)
 * 3 / 2 = 1
 *
 * In the case of fractional computation
 * 3 / 2 = 1.5
 *
 * If you use a variable with a decimal assigned to it as the operand of an event command, you can use
 * It may cause unexpected problems when used.
 * (e.g. adding 0.5 to HP)
 */
/*:ja
 * @plugindesc 変数の小数演算プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FloatVariables.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param FloatVariableStart
 * @text 小数変数開始位置
 * @desc 小数演算を行う変数の開始位置です。
 * @default 0
 * @type variable
 *
 * @param FloatVariableEnd
 * @text 小数変数終了位置
 * @desc 小数演算を行う変数の終了位置です。
 * @default 0
 * @type variable
 *
 * @help FloatVariables.js
 *
 * 指定した範囲内の変数を小数演算可能にします。
 *
 * ・通常(整数演算)の場合
 * 3 / 2 = 1
 *
 * ・小数演算の場合
 * 3 / 2 = 1.5
 *
 * 小数が代入されている変数をイベントコマンドのオペランドとして
 * 使用すると予期しない問題が発生する可能性があります。
 * (HPに0.5を加算するなど)
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value) {
        _Game_Variables_setValue.apply(this, arguments);
        if (variableId >= param.FloatVariableStart && variableId <= param.FloatVariableEnd) {
            this._data[variableId] = value;
        }
    };
})();

