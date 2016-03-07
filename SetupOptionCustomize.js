//=============================================================================
// SetupOptionCustomize.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 起動オプション調整プラグイン
 * @author トリアコンタン
 *
 * @param 描画モード
 * @desc 描画モード（WebGL or Canvas）を指定できます。
 * （0:自動　1:WebGLモード 2:Canvasモード）
 * @default 0
 *
 * @param テストプレー
 * @desc 有効にするとテストモードになります。（ON/OFF）
 * 指定されるオプション：test
 * @default OFF
 *
 * @param FPS表示
 * @desc 有効にするとFPSを画面左上に表示します。（ON/OFF）
 * 指定されるオプション：showfps
 * @default OFF
 *
 * @param オーディオ無効
 * @desc 有効にするとオーディオ演奏を無効にします。（ON/OFF）
 * 指定されるオプション：noaudio
 * @default OFF
 *
 * @param 任意オプション
 * @desc 任意の内容をオプションに追加します。
 * 例（aaa=1&bbb=2）
 * @default
 *
 * @param ユーザオプション無効
 * @desc ユーザ指定オプションを無効にします。（ON/OFF）
 * ツクールからのテストプレー実行も無効化されるので注意。
 * @default OFF
 *
 * @help MVの起動オプション（URLクエリパラメータ）を
 * 制作者側で制御できます。
 * ローカル実行時でも起動オプションを自在に変更できます。
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
    var pluginName = 'SetupOptionCustomize';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() == 'ON';
    };

    var isParamExist = function(paramNames) {
        return getParamOther(paramNames) != null;
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var addOption = function(value) {
        if (!value) return;
        newUrl += (newUrl === '' ? '?' : '&') + value;
    };

    var newUrl = '';
    var alreadyParseSign = 'XzegKSNEZup5ZcQWTf8u2';
    if (Utils.isOptionValid(alreadyParseSign)) return;

    addOption(alreadyParseSign);
    if (!getParamBoolean('ユーザオプション無効')) {
        addOption(location.search.slice(1));
    }
    switch (getParamNumber('描画モード', 0, 2)) {
        case 1:
            addOption('webgl');
            break;
        case 2:
            addOption('canvas');
            break;
    }
    if (getParamBoolean('テストプレー')) {
        addOption('test');
    }
    if (getParamBoolean('FPS表示')) {
        addOption('showfps');
    }
    if (getParamBoolean('オーディオ無効')) {
        addOption('noaudio');
    }
    if (isParamExist('任意オプション')) {
        addOption(getParamString('任意オプション'));
    }
    location.replace(newUrl);
})();

