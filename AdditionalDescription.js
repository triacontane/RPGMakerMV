//=============================================================================
// AdditionalDescription.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.1 2020/10/17 キーコードの仕様を撤廃
//                  英語ヘルプを作成
// 2.0.0 2020/10/17 初期表示時に追加テキストの方が表示される設定を追加
//                  プラグインの型指定機能に対応
// 1.1.4 2017/01/12 メモ欄の値が空で設定された場合にエラーが発生するかもしれない問題を修正
// 1.1.3 2016/09/20 説明文の文字に「>」「<」を表示できるようエスケープ処理を追加
// 1.1.2 2016/09/07 同じ説明文のアイテムが連続していたときに切り替えメッセージが表示されない問題を修正
// 1.1.1 2016/09/06 親のウィンドウがアクティブなときのみ操作できるよう修正
// 1.1.0 2016/09/01 マウス操作、タッチ操作でも切り替えられる機能を追加
//                  切り替え中にキャンセルしたときに描画内容が一部残ってしまう不具合を修正
// 1.0.0 2016/09/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc AdditionalDescription
 * @author triacontane
 *
 * @param ButtonName
 * @desc The name of the button to switch help.
 * @default shift
 * @type combo
 * @option shift
 * @option control
 * @option tab
 *
 * @param ChangePage
 * @desc Page change sign string that appears in the lower right corner of the window.
 * @default Push Shift
 *
 * @param ValidTouch
 * @desc You can also switch windows by touching or left-clicking the help window.
 * @default true
 * @type boolean
 *
 * @param InitialReverse
 * @desc The page is displayed in the initial view with the pages switched.
 * @default false
 * @type boolean
 *
 * @help You can add a second page to the help window
 * to display any information you want.
 * Replace it with the specified key.
 *
 * Please write the following in the notes section of the item/skill database.
 * <ADDescription:sampleText>  # The string "sampleText" is displayed.
 * <ADScript:sampleScript>     # The evaluation result of "sampleScript" is displayed.
 *
 * In both cases, a set of control characters are available.
 * In addition, the target data can be referenced in the script by a local variable called "item".
 * Database information such as consumption MP and price can be displayed dynamically.
 */

/*:ja
 * @plugindesc ヘルプ説明追加プラグイン
 * @author トリアコンタン
 *
 * @param ButtonName
 * @text ボタン名
 * @desc ヘルプを切り替えるボタン名です。
 * @default shift
 * @type combo
 * @option shift
 * @option control
 * @option tab
 *
 * @param ChangePage
 * @text ページ切り替え
 * @desc ウィンドウの右下に表示されるページ切り替えサイン文字列です。制御文字が使用できます。
 * @default Push Shift
 *
 * @param ValidTouch
 * @text タッチ操作有効
 * @desc ヘルプウィンドウをタッチ or 左クリックすることでもウィンドウを切り替えることができます。
 * @default true
 * @type boolean
 *
 * @param InitialReverse
 * @text 初期状態で反転
 * @desc 初期表示でページ切り替えされた状態で表示されます。
 * @default false
 * @type boolean
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

    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter(pluginName);

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
        if (item) {
            this.setAnother();
        }
        _Window_Help_setItem.apply(this, arguments);
        this._originalText       = this._text;
        this._anotherTextVisible = false;
        this._item               = null;
        this._itemExist          = false;
        if (param.InitialReverse) {
            this.toggleDesc();
        }
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
        if (this._anotherText === null) {
            this.setAnotherScript();
        }
    };

    Window_Help.prototype.setAnotherScript = function() {
        var item  = this._item;
        var value = getMetaValues(item, ['スクリプト', 'Script']);
        if (value) {
            try {
                this._anotherText = String(eval(this.convertEscapeCharacters(value)));
            } catch (e) {
                console.error(e.stack);
            }
        }
    };

    Window_Help.prototype.setAnotherDescription = function() {
        var item  = this._item;
        var value = getMetaValues(item, ['説明', 'Description']);
        if (value) {
            this._anotherText = this.convertEscapeCharacters(value);
        }
    };

    var _Window_Help_refresh      = Window_Help.prototype.refresh;
    Window_Help.prototype.refresh = function() {
        _Window_Help_refresh.apply(this, arguments);
        this.refreshChangePage();
    };

    Window_Help.prototype.refreshChangePage = function() {
        if (param.ChangePage && this._anotherText && this._itemExist) {
            var width = this.drawTextEx(param.ChangePage, 0, this.contents.height);
            var x = this.contentsWidth() - width;
            var y = this.contentsHeight() - this.lineHeight();
            this.drawTextEx(param.ChangePage, x, y);
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
            this.toggleDesc();
        }
    };

    Window_Help.prototype.toggleDesc = function() {
        this._anotherTextVisible = !this._anotherTextVisible;
        this._itemExist = true;
        this.setText(this._anotherTextVisible ? this._anotherText : this._originalText);
        this._itemExist = false;
    };

    Window_Help.prototype.isAnotherTriggered = function() {
        return Input.isTriggered(param.ButtonName) ||
            (this.isTouchedInsideFrame() && TouchInput.isTriggered() && param.ValidTouch);
    };

    Window_Help.prototype.isAnyParentActive = function() {
        return this._parentWindows.some(function(win) {
            return win.active;
        });
    };

    Window_Help.prototype.isTouchedInsideFrame = Window_Selectable.prototype.isTouchedInsideFrame;
})();

