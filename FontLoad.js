//=============================================================================
// FontLoad.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/03/11 本体v1.3.5(コミュニティ版)で機能しなくなる問題を修正
// 1.0.0 2016/06/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Font Load
 * @author triacontane
 *
 * @param FontName1
 * @desc Font name
 * @default
 *
 * @param FontUrl1
 * @desc Font file path. ex：fonts/XXX.ttf
 * @default
 *
 * @param FontName2
 * @desc Font name
 * @default
 *
 * @param FontUrl2
 * @desc Font file path. ex：fonts/XXX.ttf
 * @default
 *
 * @param FontName3
 * @desc Font name
 * @default
 *
 * @param FontUrl3
 * @desc Font file path. ex：fonts/XXX.ttf
 * @default
 *
 * @param WaitLoadComplete
 * @desc Wait until load complete
 * @default OFF
 *
 * @help Loading font file at the start of the game.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc フォントロードプラグイン
 * @author トリアコンタン
 *
 * @param フォント名1
 * @desc 任意のフォント名
 * @default
 *
 * @param フォントURL1
 * @desc フォントファイルパスです。例：fonts/XXX.ttf
 * @default
 *
 * @param フォント名2
 * @desc 任意のフォント名
 * @default
 *
 * @param フォントURL2
 * @desc フォントファイルパスです。例：fonts/XXX.ttf
 * @default
 *
 * @param フォント名3
 * @desc 任意のフォント名
 * @default
 *
 * @param フォントURL3
 * @desc フォントファイルパスです。例：fonts/XXX.ttf
 * @default
 *
 * @param ロード完了まで待機
 * @desc フォントのロードが完了してからゲームを開始します。
 * @default OFF
 *
 * @help 指定したURLのフォントを指定した名前でロードします。
 * ロードするだけなので、基本的には他のプラグインやスクリプトと
 * 組み合わせて使用します。
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
    var pluginName    = 'FontLoad';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramFonts = [], idString;
    for (var i = 1; i <= 3; i++) {
        idString = String(i);
        paramFonts[i] = {};
        paramFonts[i].url = getParamString(['FontUrl' + idString, 'フォントURL' + idString]);
        paramFonts[i].name = getParamString(['FontName' + idString, 'フォント名' + idString]);
    }
    var paramWaitLoadComplete = getParamBoolean(['WaitLoadComplete', 'ロード完了まで待機']);

    //=============================================================================
    // Scene_Boot
    //  必要なフォントをロードします。
    //=============================================================================
    var _Scene_Boot_isGameFontLoaded = Scene_Boot.prototype.isGameFontLoaded;
    Scene_Boot.prototype.isGameFontLoaded = function() {
        if (!_Scene_Boot_isGameFontLoaded.apply(this)) {
            return false;
        }
        if (!this._customFontLoading) {
            this.loadCustomFonts();
        }
        return this.isCustomFontLoaded();
    };

    Scene_Boot.prototype.loadCustomFonts = function() {
        paramFonts.forEach(function(fontInfo) {
            if (fontInfo.name && fontInfo.url) {
                Graphics.loadFont(fontInfo.name, fontInfo.url);
            }
        }.bind(this));
        this._customFontLoading = true;
    };

    Scene_Boot.prototype.isCustomFontLoaded = function() {
        return !paramWaitLoadComplete || paramFonts.every(function(fontInfo) {
            return !fontInfo.name || !fontInfo.url || Graphics.isFontLoaded(fontInfo.name);
        }.bind(this));
    };
})();

