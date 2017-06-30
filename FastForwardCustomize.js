//=============================================================================
// FastForwardCustomize.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/07/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc FastForwardCustomizePlugin
 * @author triacontane
 *
 * @param EventSpeedVariableId
 * @desc イベント高速化時の速度を取得する変数番号です。変数値が0なら高速化禁止、数値が大きくなると速度も速くなります。
 * @default 0
 * @type variable
 *
 * @help イベント高速化時の速度を調整できます。
 * 指定した変数の値によって高速化時の速度が変化します。
 * 変数値によって以下の通り変化します。
 * 0  : 高速化が禁止されます。
 * 1  : デフォルトの速度です。
 * 2- : 数値が高いほど高速になります。異常に高い値を設定すると処理落ちします。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc イベント高速化調整プラグイン
 * @author トリアコンタン
 *
 * @param イベント速度変数
 * @desc イベント高速化時の速度を取得する変数番号です。変数値が0なら高速化禁止、数値が大きくなると速度も速くなります。
 * @default 0
 * @type variable
 *
 * @help イベント高速化時の速度を調整できます。
 * 指定した変数の値によって高速化時の速度が変化します。
 * 変数値によって以下の通り変化します。
 * 0  : 高速化が禁止されます。
 * 1  : デフォルトの速度です。
 * 2- : 数値が高いほど高速になります。異常に高い値を設定すると処理落ちします。
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
    var pluginName    = 'FastForwardCustomize';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param       = {};
    param.eventSpeedVariableId = getParamNumber(['EventSpeedVariableId', 'イベント速度変数']);

    var _Scene_Map_updateMainMultiply = Scene_Map.prototype.updateMainMultiply;
    Scene_Map.prototype.updateMainMultiply = function() {
        _Scene_Map_updateMainMultiply.apply(this, arguments);
        if (this.isFastForward()) {
            this.updateMainForMoreFast();
        }
    };

    Scene_Map.prototype.updateMainForMoreFast = function() {
        var updateCount = this.getFastSpeed() - 1;
        for (var i = 0; i < updateCount; i++) {
            this.updateMain();
        }
    };

    var _Scene_Map_isFastForward = Scene_Map.prototype.isFastForward;
    Scene_Map.prototype.isFastForward = function() {
        return _Scene_Map_isFastForward.apply(this, arguments) && this.getFastSpeed() > 0;
    };

    Scene_Map.prototype.getFastSpeed = function() {
        return param.eventSpeedVariableId > 0 ? $gameVariables.value(param.eventSpeedVariableId) : 1;
    };
})();

