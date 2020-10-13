//=============================================================================
// DestinationWindow.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.2 2020/10/12 フォント設定が効かない不具合を修正
// 2.0.1 2020/10/11 言語設定によってアイコン設定の型が違う問題を修正
// 2.0.0 2020/10/11 MZ向けに実装を修正
// 1.6.0 2019/06/24 特定マップで非表示にする機能を追加
// 1.5.0 2018/07/20 行動目標ウィンドウの内容を複数行表示できる機能を追加
// 1.4.0 2017/11/15 行動目標ウィンドウの文字列揃えを中央揃え、右揃えにできる機能を追加
// 1.3.0 2017/11/11 マップ画面のウィンドウを一定時間で消去できる機能を追加
// 1.2.1 2017/05/22 専用ウィンドウスキンを指定した状態でセーブ＆ロードした際にテキスト色が黒くなる問題を修正
// 1.2.0 2017/05/03 アイコン表示機能、横幅自動調整機能を追加、別の目標を指定したときに重なって表示される問題を修正
// 1.1.0 2017/05/02 メニュー画面にも表示できる機能を追加
// 1.0.0 2017/05/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc DestinationWindowPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param ShowingSwitchId
 * @desc 行動目標ウィンドウが表示されるスイッチIDです。
 * @default 1
 * @type switch
 *
 * @param CloseEventRunning
 * @desc イベントが実行されている間はウィンドウを閉じます。
 * @default true
 * @type boolean
 *
 * @param WindowX
 * @desc ウィンドウのX座標です。
 * @default 24
 * @type number
 *
 * @param WindowY
 * @desc ウィンドウのY座標です。
 * @default 24
 * @type number
 *
 * @param WindowWidth
 * @desc ウィンドウの横幅です。
 * @default 320
 * @type number
 *
 * @param WindowOpacity
 * @desc ウィンドウの不透明度です。
 * @default 255
 * @type number
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
 * @type number
 *
 * @param FontSize
 * @desc ウィンドウのフォントサイズです。
 * @default 22
 * @type number
 *
 * @param ShowingInMenu
 * @desc 行動目標ウィンドウをメニュー画面にも表示します。ただし座標やサイズは自働で整形されます。
 * @default false
 * @type boolean
 *
 * @param AutoAdjust
 * @desc 指定した文字列がウィンドウに収まらない場合に自働で調整します。ただし一部の制御文字が使用不可となります。
 * @default true
 * @type boolean
 *
 * @param ShowingFrames
 * @desc 行動目標ウィンドウの表示フレーム数です。0を指定すると常時表示されます。
 * @default 0
 * @type number
 *
 * @param TextAlign
 * @desc 文字列の揃えです。
 * @default 0
 * @type select
 * @option Left
 * @value 0
 * @option Center
 * @value 1
 * @option Right
 * @value 2
 *
 * @param NoDestinationMaps
 * @desc 非表示にしたいマップIDリスト
 * @default []
 * @type number[]
 *
 * @command SET_DESTINATION
 * @text 目標設定
 * @desc 行動目標を設定します。
 *
 * @arg destination
 * @text 行動目標
 * @desc 行動目標です。
 * @type multiline_string
 * @default
 *
 * @arg icon
 * @text アイコン
 * @desc 行動目標の先頭に表示するアイコン番号です。
 * @type string
 * @default
 *
 * @help マップ中に行動目標ウィンドウを表示します。
 * 制御文字を含めた好きな文字列を表示できるので様々な用途に使えます。
 * 表示する内容はプラグインコマンドで、表示可否はスイッチで制御します。
 *
 * 自動調整を有効にした場合、文字列がウィンドウに収まらない場合に自働で調整します。
 * ただし、以下の制御文字が無効になります。
 * \i[n]、\c[n]、\{、\}
 *
 * 複数行の目標を表示したい場合は、文章中に改行を挿入してください。
 *
 * 以下のいずれかの条件を満たすマップでは、行動目標ウィンドウは非表示になります。
 * - プラグインパラメータ NoDestinationWindowMapIds で指定したIDをを持つ
 * - マップのメモ欄に <noDestinationWindow> と記述されている
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 行動目標ウィンドウプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param 表示スイッチID
 * @desc 行動目標ウィンドウが表示されるスイッチIDです。
 * @default 1
 * @type switch
 *
 * @param イベント中は閉じる
 * @desc イベントが実行されている間はウィンドウを閉じます。
 * @default true
 * @type boolean
 *
 * @param ウィンドウX座標
 * @desc ウィンドウのX横幅です。
 * @default 24
 * @type number
 *
 * @param ウィンドウY座標
 * @desc ウィンドウのY横幅です。
 * @default 24
 * @type number
 *
 * @param ウィンドウ横幅
 * @desc ウィンドウの横幅です。
 * @default 320
 * @type number
 *
 * @param ウィンドウ不透明度
 * @desc ウィンドウの不透明度です。
 * @default 255
 * @type number
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
 * @type number
 *
 * @param フォントサイズ
 * @desc ウィンドウのフォントサイズです。
 * @default 22
 * @type number
 *
 * @param メニュー画面に表示
 * @desc 行動目標ウィンドウをメニュー画面にも表示します。ただし座標やサイズは自働で整形されます。
 * @default false
 * @type boolean
 *
 * @param 自働調整
 * @desc 指定した文字列がウィンドウに収まらない場合に自働で調整します。ただし一部の制御文字が使用不可となります。
 * @default true
 * @type boolean
 *
 * @param 表示フレーム数
 * @desc 行動目標ウィンドウの表示フレーム数です。0を指定すると常時表示されます。
 * @default 0
 * @type number
 *
 * @param 文字列揃え
 * @desc 文字列の揃えです。
 * @default 0
 * @type select
 * @option 左揃え
 * @value 0
 * @option 中央揃え
 * @value 1
 * @option 右揃え
 * @value 2
 *
 * @param NoDestinationWindowMapIds
 * @desc 非表示にしたいマップIDリスト
 * @default []
 * @type number[]
 *
 * @command SET_DESTINATION
 * @text 目標設定
 * @desc 行動目標を設定します。
 *
 * @arg destination
 * @text 行動目標
 * @desc 行動目標です。
 * @type multiline_string
 * @default
 *
 * @arg icon
 * @text アイコン
 * @desc 行動目標の先頭に表示するアイコン番号です。
 * @type string
 * @default
 *
 * @help マップ中に行動目標ウィンドウを表示します。
 * 制御文字を含めた好きな文字列を表示できるので様々な用途に使えます。
 * 表示する内容はプラグインコマンドで、表示可否はスイッチで制御します。
 *
 * 自動調整を有効にした場合、文字列がウィンドウに収まらない場合に自働で調整します。
 * ただし、以下の制御文字が無効になります。
 * \i[n]、\c[n]、\{、\}
 *
 * 複数行の目標を表示したい場合は、文章中に改行を挿入してください。
 *
 * 以下のいずれかの条件を満たすマップでは、行動目標ウィンドウは非表示になります。
 * - プラグインパラメータ NoDestinationWindowMapIds で指定したIDをを持つ
 * - マップのメモ欄に <noDestinationWindow> と記述されている
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'DestinationWindow';

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
        return value.toUpperCase() === 'ON' || value.toUpperCase() === 'TRUE';
    };

    var getParamNumberArray = function(paramNames) {
        var value = PluginManager.parameters(pluginName)[paramNames];
        return JSON.parse(value)
            .map(function(e){ return Number(JSON.parse(e)); }, this);
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param                       = {};
    param.showingSwitchId           = getParamNumber(['ShowingSwitchId', '表示スイッチID'], 0);
    param.windowX                   = getParamNumber(['WindowX', 'ウィンドウX座標']);
    param.windowY                   = getParamNumber(['WindowY', 'ウィンドウY座標']);
    param.windowWidth               = getParamNumber(['WindowWidth', 'ウィンドウ横幅'], 1);
    param.windowSkin                = getParamString(['WindowSkin', 'ウィンドウスキン名']);
    param.windowOpacity             = getParamNumber(['WindowOpacity', 'ウィンドウ不透明度']);
    param.fadeFrame                 = getParamNumber(['FadeFrame', 'フェード時間'], 1);
    param.fontSize                  = getParamNumber(['FontSize', 'フォントサイズ'], 12);
    param.closeEventRunning         = getParamBoolean(['CloseEventRunning', 'イベント中は閉じる']);
    param.showingInMenu             = getParamBoolean(['ShowingInMenu', 'メニュー画面に表示']);
    param.autoAdjust                = getParamBoolean(['AutoAdjust', '自働調整']);
    param.showingFrames             = getParamNumber(['ShowingFrames', '表示フレーム数'], 0);
    param.textAlign                 = getParamNumber(['TextAlign', '文字列揃え'], 0);
    param.noDestinationWindowMapIds = getParamNumberArray(['NoDestinationWindowMapIds']);

    var _extractMetadata = DataManager.extractMetadata;
    DataManager.extractMetadata = function(data) {
        _extractMetadata.call(this, data);
        if (this.isMapObject(data)) {
            if (data.meta.noDestinationWindow) {
                data.noDestinationWindow = true;
            } else {
                data.noDestinationWindow = false;
            }
        }
    };

    const script = document.currentScript;
    PluginManagerEx.registerCommand(script, 'SET_DESTINATION', function(args) {
        if (args.icon > 0) {
            this.execSetDestinationWithIcon(args.destination, String(args.icon));
        } else {
            this.execSetDestination(args.destination);
        }
    });

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    Game_Interpreter.prototype.execSetDestination = function(destination) {
        $gameSystem.setDestinationIcon(null);
        $gameSystem.setDestination(destination);
    };

    Game_Interpreter.prototype.execSetDestinationWithIcon = function(destination, icon) {
        $gameSystem.setDestinationIcon(icon);
        $gameSystem.setDestination(destination);
    };

    //=============================================================================
    // Game_System
    //  目標テキストを追加定義します。
    //=============================================================================
    Game_System.prototype.setDestination = function(value) {
        this._destinationTextList = value.split('\n');
        this.resetDestinationFrame();
    };

    Game_System.prototype.getDestination = function() {
        return this._destinationTextList || [];
    };

    Game_System.prototype.setDestinationIcon = function(value) {
        this._destinationIconIndex = value;
    };

    Game_System.prototype.getDestinationIcon = function() {
        return this._destinationIconIndex || '';
    };

    Game_System.prototype.resetDestinationFrame = function() {
        this._destinationFrame = 0;
    };

    Game_System.prototype.isOverDestinationFrame = function() {
        this._destinationFrame++;
        return param.showingFrames > 0 ? param.showingFrames <= this._destinationFrame : false;
    };

    //=============================================================================
    // Game_Map
    //  行動目標ウィンドウ非表示マップであるかを判定します。
    //=============================================================================
    Game_Map.prototype.isNoDestinationWindowMap = function () {
        return param.noDestinationWindowMapIds.some(function(mapId){
            return mapId === this.mapId();
        }, this) || $dataMap.noDestinationWindow;
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
        this._destinationWindow = new Window_Destination(this.destinationWindowRect());
        this.addChild(this._destinationWindow);
    };

    Scene_Map.prototype.destinationWindowRect = function() {
        return new Rectangle(param.windowX, param.windowY, param.windowWidth, this.calcWindowHeight(1, false));
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
        this._destinationWindow = new Window_DestinationMenu(this.destinationWindowRect());
        this.addWindow(this._destinationWindow);
    };

    const _Scene_Menu_commandWindowRect = Scene_Menu.prototype.commandWindowRect;
    Scene_Menu.prototype.commandWindowRect = function() {
        const rect = _Scene_Menu_commandWindowRect.call(this);
        if (param.showingInMenu && $gameSystem.getDestination().length > 0) {
            rect.height -= this.calcDestinationWindowHeight();
        }
        return rect;
    };

    Scene_Menu.prototype.calcDestinationWindowHeight = function () {
        return Window_Destination.prototype.fittingHeight($gameSystem.getDestination().length);
    };

    Scene_Menu.prototype.destinationWindowRect = function() {
        var x, y, width, height;
        x = this._commandWindow.x;
        if (this._commandWindow.maxCols() === 1) {
            width  = this._commandWindow.width;
            height = this.calcDestinationWindowHeight();
            y      = this._goldWindow.y - height;
        } else {
            y      = this._goldWindow.y;
            width  = param.windowWidth;
            height = this._goldWindow.height;
        }
        return new Rectangle(x, y, width, height);
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

    Window_Destination.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._text      = '';
        this._textList  = [];
        this._iconIndex = 0;
        this.update();
        this.opacity = this.isVisible() ? 255 : 0;
    };

    Window_Destination.prototype.loadWindowskin = function() {
        if (param.windowSkin) {
            this.windowskin = ImageManager.loadSystem(param.windowSkin);
        } else {
            Window_Base.prototype.loadWindowskin.call(this);
        }
    };

    Window_Destination.prototype.lineHeight = function() {
        return Math.max(this.standardFontSize() + 8, ImageManager.iconHeight);
    };

    Window_Destination.prototype.resetFontSettings = function () {
        Window_Base.prototype.resetFontSettings.call(this);
        this.contents.fontSize = this.standardFontSize();
    };

    Window_Destination.prototype.standardFontSize = function() {
        return param.fontSize || $gameSystem.mainFontSize();
    };

    Window_Destination.prototype.standardBackOpacity = function() {
        return param.windowOpacity || 192;
    };

    Window_Destination.prototype.standardPadding = function() {
        return 12;
    };

    Window_Destination.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (!this.windowskin.isReady()) return;
        this.updateText();
        this.updateOpacity();
    };

    Window_Destination.prototype.updateOpacity = function() {
        if (this.isVisible()) {
            this.setOpacity(this.opacity + this.getFadeValue());
        } else {
            this.setOpacity(this.opacity - this.getFadeValue());
        }
        this.visible = (this.opacity > 0);
    };

    Window_Destination.prototype.updateText = function() {
        var textList  = $gameSystem.getDestination();
        var iconIndex = getArgNumber(this.convertEscapeCharacters($gameSystem.getDestinationIcon()), 0);
        if (textList.length !== this._textList.length) {
            this.height = this.fittingHeight(textList.length);
            this.createContents();
            this._textList = [];
        }
        textList.forEach(function(text, index) {
            if (this._textList[index] === text && this._iconIndex === iconIndex) {
                return;
            }
            this._textList[index] = text;
            this._text      = text;
            this._iconIndex = iconIndex;
            this.drawDestination(index);
        }, this);
    };

    Window_Destination.prototype.drawDestination = function(lineNumber) {
        this.contents.clearRect(0, lineNumber * this.lineHeight(), this.contentsWidth(), this.lineHeight());
        var x = this.getContentsX();
        var y = lineNumber * this.lineHeight() + this.lineHeight() / 2 - this.contents.fontSize / 2 - 4;
        if (this._iconIndex > 0 && lineNumber === 0) {
            this.drawIcon(this._iconIndex, x, y);
            x += ImageManager.iconWidth;
        }
        if (param.autoAdjust) {
            this.resetTextColor();
            this.drawText(this._text, x, y, this.contentsWidth() - x);
        } else {
            this.drawTextEx(this._text, x, y);
        }
    };

    Window_Destination.prototype.getContentsX = function() {
        if (param.textAlign === 0) {
            return 0;
        }
        var width = param.autoAdjust ? this.textWidth(this._text) : this.drawTextEx(this._text, 0, -this.lineHeight());
        if (this._iconIndex > 0) {
            width += ImageManager.iconWidth;
        }
        var division = (param.textAlign === 1 ? 2 : 1);
        return this.contentsWidth() / division - width / division;
    };

    Window_Destination.prototype.setOpacity = function(value) {
        this.opacity         = value;
        this.contentsOpacity = value;
    };

    Window_Destination.prototype.getFadeValue = function() {
        return 255 / param.fadeFrame;
    };

    Window_Destination.prototype.isVisible = function() {
        return $gameSwitches.value(param.showingSwitchId) && !this.isEventRunning() && this.isExistText() && !this.isOverFrame() && !this.isNoDestinationWindowMap();
    };

    Window_Destination.prototype.isOverFrame = function() {
        return $gameSystem.isOverDestinationFrame();
    };

    Window_Destination.prototype.isExistText = function() {
        return this._textList.length > 0 || !!this._iconIndex;
    };

    Window_Destination.prototype.isEventRunning = function() {
        return $gameMap.isEventRunning() && param.closeEventRunning;
    };

    Window_Destination.prototype.isNoDestinationWindowMap = function() {
        return $gameMap.isNoDestinationWindowMap();
    };

    //=============================================================================
    // Window_DestinationMenu
    //  メニュー画面の行動目標ウィンドウです。
    //=============================================================================
    function Window_DestinationMenu() {
        this.initialize.apply(this, arguments);
    }

    Window_DestinationMenu.prototype             = Object.create(Window_Destination.prototype);
    Window_DestinationMenu.prototype.constructor = Window_DestinationMenu;

    Window_DestinationMenu.prototype.isOverFrame = function() {
        return false;
    };
})();
