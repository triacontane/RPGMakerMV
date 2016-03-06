//=============================================================================
// GameStartEval.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2015/12/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 開始時スクリプト実行プラグイン
 * @author トリアコンタン
 *
 * @param スクリプト1
 * @desc ゲーム開始時に実行するスクリプト
 * @default
 *
 * @param スクリプト2
 * @desc ゲーム開始時に実行するスクリプト
 *
 * @param スクリプト3
 * @desc ゲーム開始時に実行するスクリプト
 *
 * @param スクリプト4
 * @desc ゲーム開始時に実行するスクリプト
 *
 * @help ゲーム開始時に任意のスクリプトを実行します。
 * Scene_Boot.startのタイミングです。
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
    var pluginName = 'GameStartEval';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
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

    //=============================================================================
    // Scene_Boot
    //  ゲーム開始時にスクリプトを実行します。
    //=============================================================================
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        var script = 'test';
        var i = 0;
        while (script && i < 100) {
            script = getParamString('スクリプト' + String(++i));
            try {
                if (script) eval(script);
            } catch (e) {
                if (Utils.isNwjs()) {
                    var window = require('nw.gui').Window.get();
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(Graphics.width, Graphics.height);
                    window.focus();
                }
                console.log('スクリプトの実行中にエラーが発生しました。');
                console.log('- スクリプト 　: ' + script);
                console.log('- エラー原因   : ' + e.toString());
                throw e;
            }
        }
    };
})();

