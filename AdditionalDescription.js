//=============================================================================
// AdditionalDescription.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.4 2017/01/12 メモ欄の値が空で設定された場合にエラーが発生するかもしれない問題を修正
// 1.1.3 2016/09/20 説明文の文字に「>」「<」を表示できるようエスケープ処理を追加
// 1.1.2 2016/09/07 同じ説明文のアイテムが連続していたときに切り替えメッセージが表示されない問題を修正
// 1.1.1 2016/09/06 親のウィンドウがアクティブなときのみ操作できるよう修正
// 1.1.0 2016/09/01 マウス操作、タッチ操作でも切り替えられる機能を追加
//                  切り替え中にキャンセルしたときに描画内容が一部残ってしまう不具合を修正
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
 * @param ValidTouch
 * @desc ヘルプウィンドウをタッチ or 左クリックすることでもウィンドウを切り替えることができます。
 * @default ON
 *
 * @help ヘルプウィンドウに2ページ目を追加して好きな情報を表示できます。
 * 指定されたキーで入れ替えます。
 *
 * アイテム・スキルのデータベースのメモ欄に以下の通り記述してください。
 * <AD説明:sampleText>         # 文字列「sampleText」が表示されます。
 * <ADDescription:sampleText>  # 同上
 * <ADスクリプト:sampleScript> #「sampleScript」の評価結果が表示されます。
 * <ADScript:sampleScript>     # 同上
 *
 * いずれも制御文字が一通り使用できます。
 * また、スクリプト中では「item」というローカル変数で対象データを参照できます。
 * 消費MPや価格などのデータベース情報を動的に表示できます。
 *
 * 文章、スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
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
 * @param タッチ操作有効
 * @desc ヘルプウィンドウをタッチ or 左クリックすることでもウィンドウを切り替えることができます。
 * @default ON
 *
 * @help ヘルプウィンドウに2ページ目を追加して好きな情報を表示できます。
 * 指定されたキーで入れ替えます。
 *
 * アイテム・スキルのデータベースのメモ欄に以下の通り記述してください。
 * <AD説明:sampleText>         # 文字列「sampleText」が表示されます。
 * <ADDescription:sampleText>  # 同上
 * <ADスクリプト:sampleScript> #「sampleScript」の評価結果が表示されます。
 * <ADScript:sampleScript>     # 同上
 *
 * いずれも制御文字が一通り使用できます。
 * また、スクリプト中では「item」というローカル変数で対象データを参照できます。
 * 消費MPや価格などのデータベース情報を動的に表示できます。
 *
 * 文章、スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
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

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
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
        if (text == null || text === true) text = '';
        text = text.replace(/&gt;?/gi, '>');
        text = text.replace(/&lt;?/gi, '<');
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
    var paramValidTouch = getParamBoolean(['ValidTouch', 'タッチ操作有効']);

    //=============================================================================
    // Window_Selectable
    //  自分自身への参照をヘルプウィンドウに渡します。
    //=============================================================================
    var _Window_Selectable_setHelpWindow = Window_Selectable.prototype.setHelpWindow;
    Window_Selectable.prototype.setHelpWindow = function(helpWindow) {
        _Window_Selectable_setHelpWindow.apply(this, arguments);
        this._helpWindow.setParentWindow(this);
    };

    //=============================================================================
    // Window_Help
    //  追加ヘルプ情報の保持と表示
    //=============================================================================
    var _Window_Help_initialize = Window_Help.prototype.initialize;
    Window_Help.prototype.initialize = function(numLines) {
        _Window_Help_initialize.apply(this, arguments);
        this._parentWindows = [];
    };

    var _Window_Help_setItem      = Window_Help.prototype.setItem;
    Window_Help.prototype.setItem = function(item) {
        this._anotherText = null;
        this._item        = item;
        this._itemExist   = true;
        if (item) this.setAnother();
        _Window_Help_setItem.apply(this, arguments);
        this._originalText       = this._text;
        this._anotherTextVisible = false;
        this._item               = null;
        this._itemExist          = false;
    };

    var _Window_Help_setText = Window_Help.prototype.setText;
    Window_Help.prototype.setText = function(text) {
        if (this._text === text) {
            this.refresh();
        }
        _Window_Help_setText.apply(this, arguments);
    };

    Window_Help.prototype.setParentWindow = function(parentWindow) {
        if (!this._parentWindows.contains(parentWindow)) {
            this._parentWindows.push(parentWindow);
        }
    };

    Window_Help.prototype.setAnother = function() {
        this.setAnotherDescription();
        if (this._anotherText === null) this.setAnotherScript();
    };

    Window_Help.prototype.setAnotherScript = function() {
        var item  = this._item;
        var value = getMetaValues(item, ['スクリプト', 'Script']);
        if (value) {
            try {
                this._anotherText = String(eval(getArgString(value)));
            } catch (e) {
                console.error(e.stack);
            }
        }
    };

    Window_Help.prototype.setAnotherDescription = function() {
        var item  = this._item;
        var value = getMetaValues(item, ['説明', 'Description']);
        if (value) {
            this._anotherText = getArgString(value);
        }
    };

    var _Window_Help_refresh      = Window_Help.prototype.refresh;
    Window_Help.prototype.refresh = function() {
        _Window_Help_refresh.apply(this, arguments);
        this.refreshChangePage();
    };

    Window_Help.prototype.refreshChangePage = function() {
        if (paramChangePage && this._anotherText && this._itemExist) {
            var width = this.drawTextEx(paramChangePage, 0, this.contents.height);
            this.drawTextEx(paramChangePage, this.contentsWidth() - width, this.contentsHeight() - this.lineHeight());
        } else {
            this._anotherText  = null;
            this._originalText = null;
        }
    };

    var _Window_Help_update      = Window_Help.prototype.update;
    Window_Help.prototype.update = function() {
        if (this.hasOwnProperty('update')) {
            _Window_Help_update.apply(this, arguments);
        } else {
            Window_Base.prototype.update.call(this);
        }
        if (this.isOpen() && this.visible) {
            this.updateAnotherDesc();
        }
    };

    Window_Help.prototype.updateAnotherDesc = function() {
        if (this._anotherText && this.isAnotherTriggered() && this.isAnyParentActive()) {
            SoundManager.playCursor();
            this._anotherTextVisible = !this._anotherTextVisible;
            this._itemExist = true;
            this.setText(this._anotherTextVisible ? this._anotherText : this._originalText);
            this._itemExist = false;
        }
    };

    Window_Help.prototype.isAnotherTriggered = function() {
        return Input.isTriggered(this.getToggleDescButtonName()) ||
            (this.isTouchedInsideFrame() && TouchInput.isTriggered() && paramValidTouch);
    };

    Window_Help.prototype.isAnyParentActive = function() {
        return this._parentWindows.some(function(win) {
            return win.active;
        });
    };

    Window_Help.prototype.getToggleDescButtonName = function() {
        return paramKeyCode ? pluginName : paramButtonName;
    };

    Window_Help.prototype.isTouchedInsideFrame = Window_Selectable.prototype.isTouchedInsideFrame;
})();

