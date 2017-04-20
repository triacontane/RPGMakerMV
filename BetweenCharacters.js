//=============================================================================
// BetweenCharacters.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/04/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BetweenCharactersPlugin
 * @author triacontane
 *
 * @param BetweenVariableId
 * @desc 字間を値(ピクセル単位)を取得する変数番号です。
 * @default 0
 *
 * @help 文章に字間を設定できます。
 * 指定した変数の値がそのまま字間（ピクセル数）になります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 字間設定プラグイン
 * @author トリアコンタン
 *
 * @param 字間変数番号
 * @desc 字間を値(ピクセル単位)を取得する変数番号です。
 * @default 0
 *
 * @help 文章に字間を設定できます。
 * 指定した変数の値がそのまま字間（ピクセル数）になります。
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
    var pluginName    = 'BetweenCharacters';

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
    param.betweenVariableId = getParamNumber(['BetweenVariableId', '字間変数番号']);

    var _Window_Base_processNormalCharacter = Window_Base.prototype.processNormalCharacter;
    Window_Base.prototype.processNormalCharacter = function(textState) {
        _Window_Base_processNormalCharacter.apply(this, arguments);
        textState.x += ($gameVariables.value(param.betweenVariableId) || 0);
    }
})();

