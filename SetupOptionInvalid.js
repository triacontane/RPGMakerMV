//=============================================================================
// SetupOptionInvalid.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Invalid query parameter
 * @author triacontane
 *
 * @param Exception
 * @desc Exception parameter
 * noaudio,webgl,canvas,test,showfps,etest,btest
 * @default
 *
 * @help Query parameter invalid on browser
 * Query parameter list
 * noaudio,webgl,canvas,test,showfps,etest,btest
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 起動オプション無効化プラグイン
 * @author トリアコンタン
 *
 * @param 例外
 * @desc 無効化しないパラメータ（カンマ区切り）を指定。
 * noaudio,webgl,canvas,test,showfps,etest,btest
 * @default
 *
 * @help ブラウザ実行の際に起動オプション（URLクエリパラメータ）を無効化します。
 * ローカル実行の場合は特に何もしません。
 *
 * デフォルトの起動オプション一覧
 * noaudio,webgl,canvas,test,showfps,etest,btest
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'SetupOptionInvalid';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamArrayString = function (paramNames) {
        var values = getParamString(paramNames).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var paramException = getParamArrayString(['例外', 'Exception']);

    var _Utils_isOptionValid = Utils.isOptionValid;
    Utils.isOptionValid = function(name) {
        if (!Utils.isNwjs()) {
            var isException = paramException.some(function(param) {
                return param === name;
            });
            if (!isException) return false;
        }
        return _Utils_isOptionValid.apply(this, arguments);
    };
})();

