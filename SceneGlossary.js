//=============================================================================
// SceneGlossary.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/04/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Plugin That ...
 * @author triacontane
 *
 * @param param
 * @desc parameter description
 * @default default value
 *
 * @help Plugin That ...
 *
 * Plugin Command
 *  XXXXX [XXX]
 *  ex1：XXXXX 1
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 用語集プラグイン
 * @author トリアコンタン
 *
 * @param コマンド名称
 * @desc メニュー画面に表示されるコマンド名です。空欄にすると追加されなくなります。
 * @default 用語集
 * 
 * @param 背景ピクチャ
 * @desc 背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 * 
 * @param アイテムタイプ
 * @desc アイテムデータベースのアイテムタイプ（A or B）
 * @default A
 * 
 * @param 自動登録
 * @desc 文章の表示の命令中に同一単語が出現した場合に自動登録します。(ON/OFF)
 * @default ON
 *
 * @param 用語集リスト横幅
 * @desc 用語集リストのウィンドウ横幅です。
 * @default 240
 *
 * @param フォントサイズ
 * @desc 用語集のフォントサイズです。
 * @default
 *
 * @help 用語集画面を追加します。
 * ゲーム中に登場する用語をカテゴリ別に登録して
 * 専用の画面で閲覧できるようになります。
 *
 * 用語の説明には、制御文字のほか任意の
 * ピクチャを文中に埋め込むこともできます。
 *
 * 用語集データはアイテムデータベースの
 * 「隠しアイテムA」もしくは「隠しアイテムB」に登録しておいて
 * 入手によって閲覧可能になるほか、文章の表示の命令中で
 * 同一単語が出現した場合に自動的に登録する機能もあります。
 *
 * データ登録方法
 *
 * 1.アイテムデータベースに新規データを登録して
 * 「アイテムタイプ」を「隠しアイテムA」もしくは「隠しアイテムB」に設定
 *
 * 2.「名前」に用語の名称を設定
 * 
 * 3.
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

function Scene_Glossary() {
    this.initialize.apply(this, arguments);
}

(function () {
    'use strict';
    var pluginName = 'SceneGlossary';
    var metaTagPrefix = 'SG';

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

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
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
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

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return convertEscapeCharactersAndEval(arg, true).clamp(min, max);
    };

    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        if (window) {
            var result = window.convertEscapeCharacters(text);
            return evalFlg ? eval(result) : result;
        } else {
            return text;
        }
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramCommandName       = getParamString(['CommandName', 'コマンド名称']);
    var paramBackPicture       = getParamString(['BackPicture', '背景ピクチャ']);
    var paramItemType          = getParamString(['ItemType', 'アイテムタイプ']).toUpperCase();
    var paramAutoAddition      = getParamBoolean(['AutoAddition', '自動登録']);
    var paramGlossaryListWidth = getParamNumber(['GlossaryListWidth', '用語集リスト横幅'], 1);
    var paramFontSize          = getParamNumber(['FontSize', 'フォントサイズ'], 0);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandSceneGlossary(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(Graphics.width, Graphics.height);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandSceneGlossary = function (command, args) {
        switch (getCommandName(command)) {
            case 'GLOSSARY_CALL' :
            case '用語集画面の呼び出し' :
                SceneManager.push(Scene_Glossary);
                break;
        }
    };

    //=============================================================================
    // Game_Party
    //  用語集アイテムの管理を追加定義します。
    //=============================================================================
    Game_Party.prototype.isGlossaryItem = function(item) {
        return item.itypeId === paramItemType === 'B' ? 3 : 2 && getMetaValues(item, ['説明', 'Description']);
    };

    Game_Party.prototype.getAllGlossaryList = function() {
        return $dataItems.filter(function(item) {
            return item && this.isGlossaryItem(item);
        }.bind(this));
    };

    //=============================================================================
    // Scene_Menu
    //  サウンドテスト画面の呼び出しを追加します。
    //=============================================================================
    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.apply(this, arguments);
        if (paramCommandName) this._commandWindow.setHandler('glossary', this.commandGlossary.bind(this));
    };

    Scene_Menu.prototype.commandGlossary = function() {
        SceneManager.push(Scene_Glossary);
    };

    //=============================================================================
    // Window_MenuCommand
    //  サウンドテスト画面の呼び出しの選択肢を追加定義します。
    //=============================================================================
    var _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.apply(this, arguments);
        if (paramCommandName) this.addCommand(paramCommandName, 'glossary', this.isGlossaryEnabled());
    };

    Window_MenuCommand.prototype.isGlossaryEnabled = function() {
        return true;
    };

    //=============================================================================
    // Scene_Glossary
    //  用語集画面を扱うクラスです。
    //=============================================================================
    Scene_Glossary.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Glossary.prototype.constructor = Scene_Glossary;

    Scene_Glossary.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.updateHelp();
        this.createGlossaryWindow();
        this.createGlossaryListWindow();
    };

    Scene_Glossary.prototype.createGlossaryWindow = function() {
        this._glossaryWindow = new Window_Glossary(paramGlossaryListWidth, this._helpWindow.height);
        this.addWindow(this._glossaryWindow);
    };

    Scene_Glossary.prototype.createGlossaryListWindow = function() {
        this._glossaryListWindow = new Window_GlossaryList(this._glossaryWindow);
        this._glossaryListWindow.setHandler('cancel', this.escapeScene.bind(this));
        this._glossaryListWindow.activate();
        this.addWindow(this._glossaryListWindow);
    };

    Scene_Glossary.prototype.createBackground = function() {
        if (paramBackPicture) {
            var sprite = new Sprite();
            sprite.bitmap = ImageManager.loadPicture(paramBackPicture ,0);
            sprite.bitmap.addLoadListener(function () {
                sprite.scale.x = Graphics.boxWidth / sprite.width;
                sprite.scale.y = Graphics.boxHeight / sprite.height;
            }.bind(this));
            this._backgroundSprite = sprite;
            this.addChild(this._backgroundSprite);
        } else {
            Scene_MenuBase.prototype.createBackground.call(this);
        }
    };

    Scene_Glossary.prototype.updateHelp = function() {
        this._helpWindow.setText('ゲーム中に登場する用語を解説しています。');
    };

    Scene_Glossary.prototype.escapeScene = function() {
        this.popScene();
    };

    //=============================================================================
    // Window_GlossaryList
    //  用語集リストウィンドウです。
    //=============================================================================
    function Window_GlossaryList() {
        this.initialize.apply(this, arguments);
    }
    Window_GlossaryList.prototype = Object.create(Window_ItemList.prototype);
    Window_GlossaryList.prototype.constructor = Window_GlossaryList;

    Window_GlossaryList.prototype.initialize = function(gWindow) {
        this._glossaryWindow = gWindow;
        Window_ItemList.prototype.initialize.call(this, 0, gWindow.y, paramGlossaryListWidth, gWindow.height);
        this.refresh();
        this.select(0);
    };

    Window_GlossaryList.prototype.maxCols = function() {
        return 1;
    };

    Window_GlossaryList.prototype.needsNumber = function() {
        return false;
    };

    Window_GlossaryList.prototype.drawItemName = function(item, x, y, width) {
        width = width || 312;
        if (item) {
            var iconBoxWidth = item.iconIndex > 0 ? Window_Base._iconWidth + 4 : 0;
            this.resetTextColor();
            this.drawIcon(item.iconIndex, x + 2, y + 2);
            this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
        }
    };

    Window_GlossaryList.prototype.includes = function(item) {
        return DataManager.isItem(item) && $gameParty.isGlossaryItem(item);
    };

    Window_GlossaryList.prototype.select = function(index) {
        Window_Selectable.prototype.select.apply(this, arguments);
        this._glossaryWindow.refresh(this.item());
    };

    //=============================================================================
    // Window_Glossary
    //  用語集ウィンドウです。
    //=============================================================================
    function Window_Glossary() {
        this.initialize.apply(this, arguments);
    }
    Window_Glossary.prototype = Object.create(Window_Base.prototype);
    Window_Glossary.prototype.constructor = Window_Glossary;

    Window_Glossary.prototype.initialize = function(x, y) {
        var height = Graphics.boxHeight - y;
        var width  = Graphics.boxWidth  - x;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };

    Window_Glossary.prototype.standardFontSize = function() {
        return paramFontSize ? paramFontSize : Window_Base.prototype.standardFontFace();
    };

    Window_Glossary.prototype.lineHeight = function() {
        return paramFontSize ? paramFontSize + 8 : Window_Base.prototype.lineHeight();
    };

    Window_Glossary.prototype.refresh = function(item) {
        this.contents.clear();
        if (!item) return;
        var text = getMetaValues(item, ['説明', 'Description']);
        this.drawTextEx(text, 0, 0);
        var textState = {index: 0, x: 0, y: 0, left:0, text:text};
        var y = this.calcTextHeight(textState, true);
        var picture = getMetaValues(item, ['ピクチャ', 'Picture']);
        if (picture) {
            var bitmap = ImageManager.loadPicture(picture, 0);
            bitmap.addLoadListener(function () {
                var metaValue = getMetaValues(item, ['ピクチャ拡大率', 'PictureScale']);
                var scale = metaValue ? getArgNumber(metaValue) : 1;
                var dw = bitmap.width  * scale;
                var dy = bitmap.height * scale;
                this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, y, dw, dy);
            }.bind(this));
        }
    };
})();

