//=============================================================================
// PluginLoader.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/04/26 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc プラグインまとめ読み込みプラグイン
 * @author トリアコンタン
 *
 * @param プラグイン1
 * @desc 読み込むプラグインのファイル名(.jsは不要)を指定します。
 * @default
 *
 * @param パラメータ1
 * @desc プラグイン名称とパラメータをカンマ区切り「,」で設定します。例「name1:value1,name2:value2」
 * @default name1:value1,name2:value2
 *
 * @param プラグイン2
 * @desc 読み込むプラグインのファイル名(.jsは不要)を指定します。
 * @default
 *
 * @param パラメータ2
 * @desc プラグイン名称とパラメータをカンマ区切り「,」で設定します。
 * @default
 *
 * @param プラグイン3
 * @desc 読み込むプラグインのファイル名(.jsは不要)を指定します。
 * @default
 *
 * @param パラメータ3
 * @desc プラグイン名称とパラメータをカンマ区切り「,」で設定します。
 * @default
 *
 * @param プラグイン4
 * @desc 読み込むプラグインのファイル名(.jsは不要)を指定します。
 * @default
 *
 * @param パラメータ4
 * @desc プラグイン名称とパラメータをカンマ区切り「,」で設定します。
 * @default
 *
 * @param プラグイン5
 * @desc 読み込むプラグインのファイル名(.jsは不要)を指定します。
 * @default
 *
 * @param パラメータ5
 * @desc プラグイン名称とパラメータをカンマ区切り「,」で設定します。
 * @default
 *
 * @param プラグイン6
 * @desc 読み込むプラグインのファイル名(.jsは不要)を指定します。
 * @default
 *
 * @param パラメータ6
 * @desc プラグイン名称とパラメータをカンマ区切り「,」で設定します。
 * @default
 *
 * @help 複数のプラグインをまとめて読み込みます。
 * 適用するプラグインが増えて管理画面が煩雑になっている場合に
 * このプラグイン経由で読み込むようにすれば画面がスッキリします。
 *
 * パラメータを持っているプラグインをまとめたい場合は、
 * 以下の形式で別途パラメータを指定する必要があります。
 * name1:value1,name2:value2
 *
 * たくさんのパラメータを持つプラグインはかえって面倒なのでパラメータの
 * 少ない（or 存在しない）プラグインのみをまとめることを推奨します。
 *
 * また、以下の手順に沿って当プラグイン自体をコピーして複数読み込むことで
 * プラグインを種類別に分類して階層管理できます。
 *
 * 1. 当ファイル「PluginLoader.js」をコピーして任意の名前に変更する。
 * 2. plugindesc（プラグインまとめ読み込みプラグイン）を変更する。
 * 　※プラグイン管理画面に表示される名称なので変更は任意です。
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
    var scripts = document.getElementsByTagName('script');
    var script = document.currentScript || scripts[scripts.length - 1];
    var pluginName = script.src.match(/.*\/(.+?)\.js/i)[1];

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

    var getParamArrayString = function(paramNames) {
        var values = getParamString(paramNames).split(',');
        for (var i = 0; i < values.length; i++) {
            values[i] = values[i].trim();
        }
        return values;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param       = {};
    param.plugins = [];
    param.parameters = [];
    for (var i = 1; true; i++) {
        var name = getParamString(['Plugin' + String(i), 'プラグイン' + String(i)]);
        if (name) {
            var parameterArray = getParamArrayString(['Parameter' + String(i), 'パラメータ' + String(i)]);
            var parameterMap = {};
            parameterArray.forEach(function(parameterData) {
                var parameterSet = parameterData.split(':');
                parameterMap[parameterSet[0]] = parameterSet[1];
            });
            param.parameters.push(parameterMap);
            param.plugins.push(name);
        } else {
            break;
        }
    }

    //=============================================================================
    // PluginManager
    //  サブプラグインの読み込み
    //=============================================================================
    PluginManager.setupSubPlugins = function() {
        var plugins = [];
        param.plugins.forEach(function(plugin, index) {
            var pluginInfo = {};
            pluginInfo.name = plugin;
            pluginInfo.status = true;
            pluginInfo.parameters = param.parameters[index];
            plugins.push(pluginInfo);
        }, this);
        this.setup(plugins);
    };

    PluginManager.setupSubPlugins();
})();

