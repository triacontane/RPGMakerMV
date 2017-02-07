//=============================================================================
// MapNameWindow.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.2 2017/02/07 端末依存の記述を削除
// 1.0.1 2017/01/02 マップ名が空の時に、空白のウィンドウが出ていた問題を修正
// 1.0.0 2017/01/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc MapNameWindowPlugin
 * @author triacontane
 *
 * @param PositionX
 * @desc X座標を指定する場合は入力してください。
 * @default
 *
 * @param PositionY
 * @desc Y座標を指定する場合は入力してください。
 * @default
 *
 * @param Width
 * @desc 横幅を指定する場合は入力してください。
 * @default
 *
 * @help マップ名表示をウィンドウ化します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc マップ名のウィンドウ化プラグイン
 * @author トリアコンタン
 *
 * @param X座標
 * @desc X座標を指定する場合は入力してください。
 * @default
 *
 * @param Y座標
 * @desc Y座標を指定する場合は入力してください。
 * @default
 *
 * @param 横幅
 * @desc 横幅を指定する場合は入力してください。
 * @default
 *
 * @help マップ名表示をウィンドウ化します。
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
    var pluginName = 'MapNameWindow';

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
        return (parseFloat(value, 10) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param     = {};
    param.positionX = getParamNumber(['PositionX', 'X座標']);
    param.positionY = getParamNumber(['PositionY', 'Y座標']);
    param.width     = getParamNumber(['Width', '横幅']);

    var _Window_MapName_initialize    = Window_MapName.prototype.initialize;
    Window_MapName.prototype.initialize = function() {
        _Window_MapName_initialize.apply(this, arguments);
        if (param.positionX) this.x = param.positionX;
        if (param.positionY) this.y = param.positionY;
    };

    var _Window_MapName_updateFadeIn    = Window_MapName.prototype.updateFadeIn;
    Window_MapName.prototype.updateFadeIn = function() {
        _Window_MapName_updateFadeIn.apply(this, arguments);
        this.opacity = this.contentsOpacity;
    };

    var _Window_MapName_updateFadeOut    = Window_MapName.prototype.updateFadeOut;
    Window_MapName.prototype.updateFadeOut = function() {
        _Window_MapName_updateFadeOut.apply(this, arguments);
        this.opacity = this.contentsOpacity;
    };

    Window_MapName.prototype.drawBackground = function(x, y, width, height) {};

    var _Window_MapName_windowWidth = Window_MapName.prototype.windowWidth;
    Window_MapName.prototype.windowWidth = function() {
        return param.width ? param.width : _Window_MapName_windowWidth.apply(this, arguments);
    };

    var _Window_MapName_refresh = Window_MapName.prototype.refresh;
    Window_MapName.prototype.refresh = function() {
        _Window_MapName_refresh.apply(this, arguments);
        this.visible = $gameMap.displayName();
    };
})();

