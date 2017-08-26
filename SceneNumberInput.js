//=============================================================================
// SceneNumberInput.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/08/27 指定する桁数が少ないと数値入力画面が正しく表示されない問題を修正
// 1.0.0 2017/04/05 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc SceneNumberInputPlugin
 * @author triacontane
 *
 * @param DefaultDigit
 * @desc 入力する数値のデフォルト桁数です。
 * @default 4
 * @type number
 *
 * @param BackPicture
 * @desc 背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param FontSize
 * @desc 数値入力ウィンドウのフォントサイズです。
 * @default 48
 * @type number
 *
 * @param HelpMessage
 * @desc デフォルトのヘルプ説明メッセージです。プラグインコマンドで指定した場合はそちらが優先されます。
 * @default 値を入力してください。
 *
 * @help 0から9までの数値を入力する専用画面を表示できます。
 * 入力した値は指定した変数に格納されます。
 * プラグインコマンドから画面を呼び出してください。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * SNI_数値入力画面の呼び出し 5 6 # [6]桁の数値入力画面を表示して変数[5]に格納
 * SNI_CALL_NUMBER_INPUT 5 6      # 同上
 * SNI_ヘルプ説明設定 aaa         # ヘルプ説明に[aaa]を設定します
 * SNI_SET_NUMBER_INPUT_HELP aaa  # 同上
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 数値入力画面プラグイン
 * @author トリアコンタン
 *
 * @param デフォルト桁数
 * @desc 入力する数値のデフォルト桁数です。
 * @default 4
 * @type number
 *
 * @param 背景ピクチャ
 * @desc 背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param フォントサイズ
 * @desc 数値入力ウィンドウのフォントサイズです。
 * @default 48
 * @type number
 *
 * @param ヘルプメッセージ
 * @desc デフォルトのヘルプ説明メッセージです。プラグインコマンドで指定した場合はそちらが優先されます。
 * @default 値を入力してください。
 *
 * @help 0から9までの数値を入力する専用画面を表示できます。
 * 入力した値は指定した変数に格納されます。
 * プラグインコマンドから画面を呼び出してください。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * SNI_数値入力画面の呼び出し 5 6 # [6]桁の数値入力画面を表示して変数[5]に格納
 * SNI_CALL_NUMBER_INPUT 5 6      # 同上
 * SNI_ヘルプ説明設定 aaa         # ヘルプ説明に[aaa]を設定します
 * SNI_SET_NUMBER_INPUT_HELP aaa  # 同上
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'SceneNumberInput';
    var metaTagPrefix = 'SNI_';

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
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var convertAllArguments = function(args) {
        for (var i = 0; i < args.length; i++) {
            args[i] = convertEscapeCharacters(args[i]);
        }
        return args;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param          = {};
    param.backPicture  = getParamString(['BackPicture', '背景ピクチャ']);
    param.defaultDigit = getParamNumber(['DefaultDigit', 'デフォルト桁数'], 1);
    param.fontSize     = getParamNumber(['FontSize', 'フォントサイズ'], 12);
    param.helpMessage  = getParamString(['HelpMessage', 'ヘルプメッセージ']);

    var pluginCommandMap = new Map();
    setPluginCommand('数値入力画面の呼び出し', 'callNumberInput');
    setPluginCommand('CALL_NUMBER_INPUT', 'callNumberInput');
    setPluginCommand('ヘルプ説明設定', 'setNumberInputDescription');
    setPluginCommand('SET_NUMBER_INPUT_HELP', 'setNumberInputDescription');

    //=============================================================================
    // Input
    //  バックスペースで文字を戻します。
    //=============================================================================
    Input.keyMapper[8] = 'backSpace';

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](convertAllArguments(args));
        }
    };

    Game_Interpreter.prototype.callNumberInput = function(args) {
        var variableId = getArgNumber(args[0], 1);
        var length     = getArgNumber(args[1], 1, 32);
        $gameSystem.makeNumberInput(variableId, length);
    };

    Game_Interpreter.prototype.setNumberInputDescription = function(args) {
        var numberInput = $gameSystem.getNumberInput();
        var description = args.reduce(function(prevValue, value) {
            return prevValue + ' ' + value;
        }, '');
        numberInput.setDescription(description);
    };

    Game_System.prototype.makeNumberInput = function(variableId, length) {
        var numberInput = this.getNumberInput();
        numberInput.setBasicInfo(variableId, length);
        SceneManager.push(Scene_NumberInput);
    };

    Game_System.prototype.getNumberInput = function() {
        if (!this._numberInput) {
            this._numberInput = new Game_NumberInput();
        }
        return this._numberInput;
    };

    //=============================================================================
    // Game_NumberInput
    //  数値入力情報を扱うクラスです。
    //=============================================================================
    class Game_NumberInput {
        setBasicInfo(variableId, length) {
            this._variableId  = variableId;
            this._inputLength = length || param.defaultDigit;
        }

        clear() {
            this._variableId  = 0;
            this._inputLength = 0;
            this._description = '';
        }

        isCalled() {
            return this._variableId > 0;
        }

        setVariable(value) {
            $gameVariables.setValue(this._variableId, isNaN(Number(value)) ? value : Number(value));
            this.clear();
        }

        setDescription(value) {
            this._description = value.trim();
        }

        getDescription() {
            return this._description || param.helpMessage;
        }

        getDefaultValue() {
            return String($gameVariables.value(this._variableId) || '');
        }

        getLength() {
            return this._inputLength;
        }
    }

    //=============================================================================
    // Scene_Map
    //  数値入力画面を呼び出します。
    //=============================================================================
    var _Scene_Map_updateScene      = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function() {
        _Scene_Map_updateScene.apply(this, arguments);
        if (!SceneManager.isSceneChanging()) {
            this.updateCallNumberInput();
        }
    };

    Scene_Map.prototype.updateCallNumberInput = function() {
        if ($gameSystem.getNumberInput().isCalled()) {
            SceneManager.push(Scene_NumberInput);
        }
    };

    //=============================================================================
    // Window_NumberInput
    //  パスワード入力ウィンドウ
    //=============================================================================
    function Window_NumberInput() {
        this.initialize.apply(this, arguments);
    }

    Window_NumberInput.numberTable = [
        '7', '8', '9',
        '4', '5', '6',
        '1', '2', '3',
        '0', 'C', 'OK'
    ];

    Window_NumberInput.prototype             = Object.create(Window_NameInput.prototype);
    Window_NumberInput.prototype.constructor = Window_NumberInput;

    Window_NumberInput.prototype.initialize = function(editWindow) {
        this._editWindow = editWindow;
        Window_NameInput.prototype.initialize.call(this, editWindow);
        this.width = this.windowWidth();
        this.x = SceneManager._boxWidth / 2 - this.width / 2;
        this.createContents();
        this.refresh();
    };

    Window_NumberInput.prototype.windowWidth = function() {
        return this.lineHeight() * 3 + this.standardPadding() * 2;
    };

    Window_NumberInput.prototype.windowHeight = function() {
        return this.fittingHeight(4);
    };

    Window_NumberInput.prototype.standardFontSize = function() {
        return this._editWindow.standardFontSize();
    };

    Window_NumberInput.prototype.lineHeight = function() {
        return this._editWindow.lineHeight();
    };

    Window_NumberInput.prototype.table = function() {
        return Window_NumberInput.numberTable;
    };

    Window_NumberInput.prototype.maxCols = function() {
        return 3;
    };

    Window_NumberInput.prototype.maxItems = function() {
        return Window_NumberInput.numberTable.length;
    };

    Window_NumberInput.prototype.getLastIndex = function() {
        return this.maxItems() - 1;
    };

    Window_NumberInput.prototype.character = function() {
        return this._index < this.getLastIndex() - 1 ? this.table()[this._index] : '';
    };

    Window_NumberInput.prototype.isOk = function() {
        return this._index === this.getLastIndex();
    };

    Window_NumberInput.prototype.isDel = function() {
        return this._index === this.getLastIndex() - 1;
    };

    Window_NumberInput.prototype.isAnyTriggered = function() {
        return Input.isTriggered('ok') || Input.isTriggered('escape') || Input.dir4 !== 0 ||
            TouchInput.isTriggered() || TouchInput.isCancelled();
    };

    Window_NumberInput.prototype.itemRect = function(index) {
        return {
            x     : this.contentsWidth() / 2 - this.maxCols() * this.lineHeight() / 2 + index % this.maxCols() * this.lineHeight(),
            y     : Math.floor(index / this.maxCols()) * this.lineHeight(),
            width : this.lineHeight(),
            height: this.lineHeight()
        };
    };

    Window_NumberInput.prototype.refresh = function() {
        var table       = this.table();
        var textPadding = 3;
        this.contents.clear();
        this.resetTextColor();
        for (var i = 0; i < this.maxItems(); i++) {
            var rect = this.itemRect(i);
            rect.x += textPadding;
            rect.width -= textPadding * 2;
            this.resetTextColor();
            this.changePaintOpacity(this.isCommandEnabled(i));
            this.drawText(table[i], rect.x, rect.y, rect.width, 'center');
        }
    };

    Window_NumberInput.prototype.isCommandEnabled = function(index) {
        if (index === this.getLastIndex()) {
            return this._editWindow.isInputFull();
        } else if (index === this.getLastIndex() - 1) {
            return true;
        } else {
            return !this._editWindow.isInputFull();
        }
    };

    Window_NumberInput.prototype.cursorDown = function(wrap) {
        if (this._index < this.maxItems() - this.maxCols() || wrap) {
            this._index = (this._index + this.maxCols()) % this.maxItems();
        }
    };

    Window_NumberInput.prototype.cursorUp = function(wrap) {
        if (this._index >= this.maxCols() || wrap) {
            this._index = (this._index + this.maxItems() - this.maxCols()) % this.maxItems();
        }
    };

    Window_NumberInput.prototype.cursorRight = function(wrap) {
        if (this._index % this.maxCols() < this.maxCols() - 1) {
            this._index++;
        } else if (wrap) {
            this._index -= this.maxCols() - 1;
        }
    };

    Window_NumberInput.prototype.cursorLeft = function(wrap) {
        if (this._index % this.maxCols() > 0) {
            this._index--;
        } else if (wrap) {
            this._index += this.maxCols() - 1;
        }
    };

    Window_NumberInput.prototype.onNameAdd = function() {
        var prevFull = this._editWindow.isInputFull();
        Window_NameInput.prototype.onNameAdd.call(this);
        if (!prevFull && this._editWindow.isInputFull()) {
            this.processJump(true);
        }
    };

    Window_NumberInput.prototype.onNameOk = function() {
        if (!this.isAnyTriggered()) return;
        Window_NameInput.prototype.onNameOk.call(this, arguments);
    };

    Window_NumberInput.prototype.cursorPagedown = function() {
    };

    Window_NumberInput.prototype.cursorPageup = function() {
    };

    Window_NumberInput.prototype.processHandling = function() {
        Window_NameInput.prototype.processHandling.call(this);
        if (this.isOpen() && this.active) {
            if (Input.isRepeated('backSpace')) {
                this.processBack();
            }
        }
    };

    Window_NumberInput.prototype.processOk = function() {
        if (!this.isCommandEnabled(this.index())) {
            if (this.isAnyTriggered()) this.playBuzzerSound();
            return;
        }
        if (this.isDel()) {
            this.processBack();
        } else {
            Window_NameInput.prototype.processOk.call(this);
        }
        this.refresh();
    };

    Window_NumberInput.prototype.processBack = function() {
        if (this._editWindow.isInputEmpty()) {
            if (this.isAnyTriggered()) Window_Selectable.prototype.processCancel.call(this);
        } else {
            Window_NameInput.prototype.processBack.call(this);
        }
        this.refresh();
    };

    Window_NumberInput.prototype.processJump = function(silentFlg) {
        if (this._index !== this.getLastIndex()) {
            this._index = this.getLastIndex();
            if (!silentFlg) SoundManager.playCursor();
        }
    };

    //=============================================================================
    // Window_NumberEdit
    //  パスワード作成ウィンドウ
    //=============================================================================
    function Window_NumberEdit() {
        this.initialize.apply(this, arguments);
    }

    Window_NumberEdit.prototype             = Object.create(Window_NameEdit.prototype);
    Window_NumberEdit.prototype.constructor = Window_NumberEdit;

    Window_NumberEdit.prototype.standardFontSize = function() {
        return param.fontSize;
    };

    Window_NumberEdit.prototype.lineHeight = function() {
        return this.standardFontSize() + 8;
    };

    Window_NumberEdit.prototype.initialize = function() {
        this._numberInput = $gameSystem.getNumberInput();
        this._name        = this._numberInput.getDefaultValue();
        this._index       = this._name.length;
        this._maxLength   = this._numberInput.getLength();
        this._defaultName = '';
        var width         = this.windowWidth();
        var height        = this.windowHeight();
        var x             = (Graphics.boxWidth - width) / 2;
        var y             = (Graphics.boxHeight - (height + this.fittingHeight(4) + 8)) / 2;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.deactivate();
        this.refresh();
    };

    Window_NumberEdit.prototype.windowWidth = function() {
        return (this.standardFontSize() / 2) * (this._maxLength + 1) + this.standardPadding() * 2;
    };

    Window_NumberEdit.prototype.windowHeight = function() {
        return this.fittingHeight(1);
    };

    Window_NumberEdit.prototype.itemRect = function(index) {
        return {
            x     : this.left() + index * this.charWidth(),
            y     : 0,
            width : this.charWidth(),
            height: this.lineHeight()
        };
    };

    Window_NumberEdit.prototype.faceWidth = function() {
        return 0;
    };

    Window_NumberEdit.prototype.charWidth = function() {
        return this.textWidth('1');
    };

    Window_NumberEdit.prototype.drawActorFace = function(actor, x, y, width, height) {
    };

    Window_NumberEdit.prototype.isInputFull = function() {
        return this._name.length === this._maxLength;
    };

    Window_NumberEdit.prototype.isInputEmpty = function() {
        return this._name.length === 0;
    };

    //=============================================================================
    // Scene_NumberInput
    //  数値入力画面
    //=============================================================================
    function Scene_NumberInput() {
        this.initialize.apply(this, arguments);
    }

    Scene_NumberInput.prototype             = Object.create(Scene_Name.prototype);
    Scene_NumberInput.prototype.constructor = Scene_NumberInput;

    Scene_NumberInput.prototype.create = function() {
        this._numberInput = $gameSystem.getNumberInput();
        Scene_Name.prototype.create.call(this);
        this.createHelpIfNeed();
    };

    Scene_NumberInput.prototype.createHelpIfNeed = function() {
        var description = this._numberInput.getDescription();
        if (description) {
            this.createHelpWindow();
            this._helpWindow.setText(this._numberInput.getDescription());
        }
    };

    Scene_NumberInput.prototype.createEditWindow = function() {
        this._editWindow = new Window_NumberEdit();
        this.addWindow(this._editWindow);
    };

    Scene_NumberInput.prototype.createInputWindow = function() {
        this._inputWindow = new Window_NumberInput(this._editWindow);
        this._inputWindow.setHandler('ok', this.onInputOk.bind(this));
        this._inputWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._inputWindow);
    };

    Scene_NumberInput.prototype.createBackground = function() {
        if (param.backPicture) {
            var sprite    = new Sprite();
            sprite.bitmap = ImageManager.loadPicture(param.backPicture, 0);
            sprite.bitmap.addLoadListener(function() {
                sprite.scale.x = Graphics.boxWidth / sprite.width;
                sprite.scale.y = Graphics.boxHeight / sprite.height;
            }.bind(this));
            this._backgroundSprite = sprite;
            this.addChild(this._backgroundSprite);
        } else {
            Scene_Name.prototype.createBackground.call(this);
        }
    };

    Scene_NumberInput.prototype.onInputOk = function() {
        this._numberInput.setVariable(this._editWindow.name());
        SceneManager.pop();
    };

    Scene_NumberInput.prototype.popScene = function() {
        this._numberInput.clear();
        Scene_Base.prototype.popScene.call(this);
    };
})();

