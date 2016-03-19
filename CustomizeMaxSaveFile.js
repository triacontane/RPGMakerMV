//=============================================================================
// CustomizeMaxSaveFile.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/03/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Customize max save file number
 * @author triacontane
 *
 * @param SaveFileNumber
 * @desc max save file number(1...100)
 * @default 20
 *
 * @help Customize max save file number
 *
 * No plugin command
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 最大セーブファイル数変更プラグイン
 * @author トリアコンタン
 *
 * @param セーブファイル数
 * @desc 最大セーブファイル数です。(1...100)
 * @default 20
 *
 * @help 最大セーブファイル数をパラメータで指定した値に変更します。
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
    var pluginName = 'CustomizeMaxSaveFile';

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };
    var paramSaveFileNumber = getParamNumber(['SaveFileNumber', 'セーブファイル数'], 0, 100);

    var _DataManager_maxSavefiles = DataManager.maxSavefiles;
    DataManager.maxSavefiles = function() {
        return paramSaveFileNumber ? paramSaveFileNumber : _DataManager_maxSavefiles.apply(this, arguments);
    };
})();

