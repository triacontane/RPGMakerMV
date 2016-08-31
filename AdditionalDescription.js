//=============================================================================
// AdditionalDescription.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/09/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Additional Description Plugin
 * @author triacontane
 *
 * @param ButtonName
 * @desc ヘルプを切り替えるボタン名です。(shift/control/tab)
 * @default shift
 *
 * @param KeyCode
 * @desc ボタン名に指定された以外のボタンを使いたい場合はここにキーコードを直接記述してください。
 * @default 0
 *
 * @param ChangePage
 * @desc ウィンドウの右下に表示されるページ切り替えサイン文字列です。制御文字が使用できます。
 * @default Push Shift
 *
 * @help ヘルプウィンドウに2ページ目を追加して好きな情報を表示できます。
 * 指定されたキーで入れ替えます。
 *
 * アイテム・スキルのデータベースのメモ欄に以下の通り記述してください。
 * <AD説明:sampleText>         # 文字列「sampleText」が表示されます。
 * <ADスクリプト:sampleScript> #「sampleScript」の評価結果が表示されます。
 *
 * いずれも制御文字が一通り使用できます。
 * また、スクリプト中では「item」というローカル変数で対象データを参照できます。
 * 消費MPや価格などをデータベース情報を動的に表示できます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ヘルプ説明追加プラグイン
 * @author トリアコンタン
 *
 * @param ボタン名
 * @desc ヘルプを切り替えるボタン名です。(shift/control/tab)
 * @default shift
 *
 * @param キーコード
 * @desc ボタン名に指定された以外のボタンを使いたい場合はここにキーコードを直接記述してください。
 * @default 0
 *
 * @param ページ切り替え
 * @desc ウィンドウの右下に表示されるページ切り替えサイン文字列です。制御文字が使用できます。
 * @default Push Shift
 *
 * @help ヘルプウィンドウに2ページ目を追加して好きな情報を表示できます。
 * 指定されたキーで入れ替えます。
 *
 * アイテム・スキルのデータベースのメモ欄に以下の通り記述してください。
 * <AD説明:sampleText>         # 文字列「sampleText」が表示されます。
 * <ADスクリプト:sampleScript> #「sampleScript」の評価結果が表示されます。
 *
 * いずれも制御文字が一通り使用できます。
 * また、スクリプト中では「item」というローカル変数で対象データを参照できます。
 * 消費MPや価格などをデータベース情報を動的に表示できます。
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
    var pluginName    = 'AdditionalDescription';
    var metaTagPrefix = 'AD';

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

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramButtonName = getParamString(['ButtonName', 'ボタン名']);
    var paramKeyCode    = getParamNumber(['KeyCode', 'キーコード']);
    if (paramKeyCode) Input.keyMapper[paramKeyCode] = pluginName;
    var paramChangePage = getParamString(['ChangePage', 'ページ切り替え']);

    //=============================================================================
    // Window_Help
    //  追加ヘルプ情報の保持と表示
    //=============================================================================
    var _Window_Help_setItem = Window_Help.prototype.setItem;
    Window_Help.prototype.setItem = function(item) {
        this._anotherText = null;
        if (item) this.setAnother(item);
        _Window_Help_setItem.apply(this, arguments);
        this._originalText = this._text;
        this._anotherTextVisible = false;
    };

    Window_Help.prototype.setAnother = function(item) {
        this.setAnotherDescription(item);
        if (this._anotherText === null) this.setAnotherScript(item);
    };

    Window_Help.prototype.setAnotherScript = function(item) {
        var value = getMetaValues(item, ['スクリプト','Script']);
        if (value) {
            try {
                this._anotherText = String(eval(getArgString(value)));
            } catch (e) {
                console.error(e.stack);
            }
        }
    };

    Window_Help.prototype.setAnotherDescription = function(item) {
        var value = getMetaValues(item, ['説明','Description']);
        if (value) {
            this._anotherText = getArgString(value);
        }
    };

    var _Window_Help_refresh = Window_Help.prototype.refresh;
    Window_Help.prototype.refresh = function() {
        _Window_Help_refresh.apply(this, arguments);
        if (paramChangePage && this._anotherText) {
            var width = this.drawTextEx(paramChangePage, 0, this.contents.height);
            this.drawTextEx(paramChangePage, this.contentsWidth() - width, this.contentsHeight() - this.lineHeight());
        }
    };

    var _Window_Help_update = Window_Help.prototype.update;
    Window_Help.prototype.update = function() {
        if (this.hasOwnProperty('update')) {
            _Window_Help_update.apply(this, arguments);
        } else {
            Window_Base.prototype.update.call(this);
        }
        this.updateAnotherDesc();
    };

    Window_Help.prototype.updateAnotherDesc = function() {
        if (this._anotherText && Input.isTriggered(this.getToggleDescButtonName())) {
            SoundManager.playCursor();
            this._anotherTextVisible = !this._anotherTextVisible;
            this.setText(this._anotherTextVisible ? this._anotherText : this._originalText);
        }
    };

    Window_Help.prototype.getToggleDescButtonName = function() {
        return paramKeyCode ? pluginName : paramButtonName;
    };
})();

