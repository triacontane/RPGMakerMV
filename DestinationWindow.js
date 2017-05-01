//=============================================================================
// DestinationWindow.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/05/02 メニュー画面にも表示できる機能を追加
// 1.0.0 2017/05/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc DestinationWindowPlugin
 * @author triacontane
 *
 * @param ShowingSwitchId
 * @desc 行動目標ウィンドウが表示されるスイッチIDです。
 * @default 1
 *
 * @param CloseEventRunning
 * @desc イベントが実行されている間はウィンドウを閉じます。
 * @default ON
 *
 * @param WindowX
 * @desc ウィンドウのX横幅です。
 * @default 24
 *
 * @param WindowY
 * @desc ウィンドウのY横幅です。
 * @default 24
 *
 * @param WindowWidth
 * @desc ウィンドウの横幅です。
 * @default 320
 *
 * @param WindowOpacity
 * @desc ウィンドウの不透明度です。
 * @default 255
 *
 * @param WindowSkin
 * @desc ウィンドウスキンのファイル名(img/system)です。拡張子不要。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param FadeFrame
 * @desc ウィンドウのフェードイン、フェードアウト時間(フレーム数)です。
 * @default 8
 *
 * @param FontSize
 * @desc ウィンドウのフォントサイズです。
 * @default 22
 *
 * @param ShowingInMenu
 * @desc 行動目標ウィンドウをメニュー画面にも表示します。ただし座標やサイズは自働で整形されます。
 * @default OFF
 *
 * @help マップ中に行動目標ウィンドウを表示します。
 * 制御文字を含めた好きな文字列を表示できるので様々な用途に使えます。
 * 表示する内容はプラグインコマンドで、表示可否はスイッチで制御します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * DW_目標設定 aaa        # 行動目標ウィンドウの内容を「aaa」に設定します。
 * DW_SET_DESTINATION aaa # 同上
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 行動目標ウィンドウプラグイン
 * @author トリアコンタン
 *
 * @param 表示スイッチID
 * @desc 行動目標ウィンドウが表示されるスイッチIDです。
 * @default 1
 *
 * @param イベント中は閉じる
 * @desc イベントが実行されている間はウィンドウを閉じます。
 * @default ON
 *
 * @param ウィンドウX座標
 * @desc ウィンドウのX横幅です。
 * @default 24
 *
 * @param ウィンドウY座標
 * @desc ウィンドウのY横幅です。
 * @default 24
 *
 * @param ウィンドウ横幅
 * @desc ウィンドウの横幅です。
 * @default 320
 *
 * @param ウィンドウ不透明度
 * @desc ウィンドウの不透明度です。
 * @default 255
 *
 * @param ウィンドウスキン名
 * @desc ウィンドウスキンのファイル名(img/system)です。拡張子不要。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param フェード時間
 * @desc ウィンドウのフェードイン、フェードアウト時間(フレーム数)です。
 * @default 8
 *
 * @param フォントサイズ
 * @desc ウィンドウのフォントサイズです。
 * @default 22
 *
 * @param メニュー画面に表示
 * @desc 行動目標ウィンドウをメニュー画面にも表示します。ただし座標やサイズは自働で整形されます。
 * @default OFF
 *
 * @help マップ中に行動目標ウィンドウを表示します。
 * 制御文字を含めた好きな文字列を表示できるので様々な用途に使えます。
 * 表示する内容はプラグインコマンドで、表示可否はスイッチで制御します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * DW_目標設定 aaa        # 行動目標ウィンドウの内容を「aaa」に設定します。
 * DW_SET_DESTINATION aaa # 同上
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'DestinationWindow';
    var metaTagPrefix = 'DW_';

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

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON';
    };

    var concatAllArguments = function(args) {
        return args.reduce(function(prevValue, arg) {
            return prevValue + ' ' + arg;
        }, '');
    };

    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param               = {};
    param.showingSwitchId   = getParamNumber(['ShowingSwitchId', '表示スイッチID'], 0);
    param.windowX           = getParamNumber(['WindowX', 'ウィンドウX座標']);
    param.windowY           = getParamNumber(['WindowY', 'ウィンドウY座標']);
    param.windowWidth       = getParamNumber(['WindowWidth', 'ウィンドウ横幅'], 1);
    param.windowSkin        = getParamString(['WindowSkin', 'ウィンドウスキン名']);
    param.windowOpacity     = getParamNumber(['WindowOpacity', 'ウィンドウ不透明度']);
    param.fadeFrame         = getParamNumber(['FadeFrame', 'フェード時間'], 1);
    param.fontSize          = getParamNumber(['FontSize', 'フォントサイズ'], 12);
    param.closeEventRunning = getParamBoolean(['CloseEventRunning', 'イベント中は閉じる']);
    param.showingInMenu     = getParamBoolean(['ShowingInMenu', 'メニュー画面に表示']);

    var pluginCommandMap = new Map();
    setPluginCommand('目標設定', 'execSetDestination');
    setPluginCommand('SET_DESTINATION', 'execSetDestination');

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](args);
        }
    };

    Game_Interpreter.prototype.execSetDestination = function(args) {
        $gameSystem.setDestination(concatAllArguments(args));
    };

    //=============================================================================
    // Game_System
    //  目標テキストを追加定義します。
    //=============================================================================
    Game_System.prototype.setDestination = function(value) {
        this._destinationText = value;
    };

    Game_System.prototype.getDestination = function() {
        return this._destinationText || '';
    };

    //=============================================================================
    // Scene_Map
    //  行動目標ウィンドウを生成します。
    //=============================================================================
    var _Scene_Map_createMapNameWindow      = Scene_Map.prototype.createMapNameWindow;
    Scene_Map.prototype.createMapNameWindow = function() {
        this.createDestinationWindow();
        _Scene_Map_createMapNameWindow.apply(this, arguments);
    };

    Scene_Map.prototype.createDestinationWindow = function() {
        this._destinationWindow = new Window_Destination(param.windowX, param.windowY, param.windowWidth);
        this.addChild(this._destinationWindow);
    };

    //=============================================================================
    // Scene_Menu
    //  メニュー画面にも表示できるようにします。
    //=============================================================================
    var _Scene_Menu_create      = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.apply(this, arguments);
        if (param.showingInMenu) {
            this.createDestinationWindow();
        }
    };

    Scene_Menu.prototype.createDestinationWindow = function() {
        var y, width, height;
        if (this._commandWindow.maxCols() === 1) {
            y      = this._commandWindow.y + this._commandWindow.height;
            width  = this._commandWindow.width;
            height = null;
        } else {
            y      = this._goldWindow.y;
            width  = param.windowWidth;
            height = this._goldWindow.height;
        }
        this._destinationWindow = new Window_Destination(0, y, width, height);
        this.addWindow(this._destinationWindow);
    };

    //=============================================================================
    // Window_Destination
    //  行動目標ウィンドウです。
    //=============================================================================
    function Window_Destination() {
        this.initialize.apply(this, arguments);
    }

    Window_Destination.prototype             = Object.create(Window_Base.prototype);
    Window_Destination.prototype.constructor = Window_Destination;

    Window_Destination.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height || this.fittingHeight(1));
        this._text     = '';
        this._prevText = '';
        this.update();
        this.opacity = this.isExist() ? 255 : 0;
    };

    Window_Destination.prototype.loadWindowskin = function() {
        if (param.windowSkin) {
            this.windowskin = ImageManager.loadSystem(param.windowSkin);
        } else {
            Window_Base.prototype.loadWindowskin.call(this);
        }
    };

    Window_Destination.prototype.lineHeight = function() {
        return this.standardFontSize() + 8;
    };

    Window_Destination.prototype.standardFontSize = function() {
        return param.fontSize || Window_Base.prototype.standardFontSize.call(this);
    };

    Window_Destination.prototype.standardBackOpacity = function() {
        return param.windowOpacity || Window_Base.prototype.standardBackOpacity.call(this);
    };

    Window_Destination.prototype.standardPadding = function() {
        return 12;
    };

    Window_Destination.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this._text = this.convertEscapeCharacters($gameSystem.getDestination());
        this.updateOpacity();
        this.updateText();
    };

    Window_Destination.prototype.updateOpacity = function() {
        if (this.isExist()) {
            this.setOpacity(this.opacity + this.getFadeValue());
        } else {
            this.setOpacity(this.opacity - this.getFadeValue());
        }
        this.visible = (this.opacity > 0);
    };

    Window_Destination.prototype.updateText = function() {
        if (this._text === this._prevText) return;
        this._prevText = this._text;
        this.drawTextEx(this._text, 0, this.contentsHeight() / 2 - this.contents.fontSize / 2 - 4);
    };

    Window_Destination.prototype.setOpacity = function(value) {
        this.opacity         = value;
        this.contentsOpacity = value;
    };

    Window_Destination.prototype.getFadeValue = function() {
        return 255 / param.fadeFrame
    };

    Window_Destination.prototype.isExist = function() {
        return $gameSwitches.value(param.showingSwitchId) && !this.isEventRunning() && !!this._text;
    };

    Window_Destination.prototype.isEventRunning = function() {
        return $gameMap.isEventRunning() && param.closeEventRunning;
    };
})();

