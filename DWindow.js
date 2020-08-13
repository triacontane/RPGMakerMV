//=============================================================================
// DWindow.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.1.1 2020/08/13 2.1.0の修正で戦闘テストをするとエラーになる問題を修正
// 2.1.0 2020/08/12 戦闘中でも動的ウィンドウが表示できる機能を追加
// 2.0.0 2020/07/25 プラグインの型指定機能に対応
//                  シーン遷移中はウィンドウの状態を更新しないよう修正
// 1.4.0 2020/02/22 パラメータ「ピクチャに含める」を遊行した場合に発生するPicturePriorityCustomize.jsとの競合を解消
// 1.3.3 2016/12/01 プラグインコマンド集との競合を解消
// 1.3.2 2016/11/27 createUpperLayerの再定義方法を修正し、競合を解消（by 奏 ねこま様）
// 1.3.1 2016/09/13 前回の修正で戦闘画面に入るとエラーが発生する問題を修正
// 1.3.0 2016/09/13 ウィンドウの不透明度を調整できる機能を追加
// 1.2.0 2016/07/16 ウィンドウをピクチャの間に差し込むことのできる機能を追加
// 1.1.1 2016/04/29 createUpperLayerによる競合対策
// 1.1.0 2016/01/16 ウィンドウを最前面に表示できる機能を追加
// 1.0.0 2015/11/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Plugin that Make Dynamic Window
 * @author triacontane
 *
 * @param GameVariablesXPos
 * @desc Game variable number that stores the window X position
 * @default 1
 * @type variable
 *
 * @param GameVariablesYPos
 * @desc Game variable number that stores the window Y position
 * @default 2
 * @type variable
 *
 * @param GameVariablesWidth
 * @desc Game variable number that stores the window width
 * @default 3
 * @type variable
 *
 * @param GameVariablesHeight
 * @desc Game variable number that stores the window height
 * @default 4
 * @type variable
 *
 * @param AlwaysOnTop
 * @desc Always on top
 * @default false
 * @type boolean
 *
 * @param IncludePicture
 * @desc Include picture dynamic window
 * @default 0
 * @type number
 *
 * @help Make dynamic empty window in any position.
 * This plugin is released under the MIT License.
 *
 * Plugin Command
 *  D_WINDOW_DRAW [window number(1-10)] [x] [y] [width] [height]
 *  ex1：D_WINDOW_DRAW 1
 *  ex2：D_WINDOW_DRAW 1 20 20 320 80
 */

/*:ja
 * @plugindesc 動的ウィンドウ生成プラグイン
 * @author トリアコンタン
 *
 * @param X座標の変数番号
 * @desc X座標を格納するゲーム変数の番号
 * @default 1
 * @type variable
 *
 * @param Y座標の変数番号
 * @desc Y座標を格納するゲーム変数の番号
 * @default 2
 * @type variable
 *
 * @param 横幅の変数番号
 * @desc 横幅を格納するゲーム変数の番号
 * @default 3
 * @type variable
 *
 * @param 高さの変数番号
 * @desc 高さを格納するゲーム変数の番号
 * @default 4
 * @type variable
 *
 * @param 最前面に表示
 * @desc ウィンドウを画面の最前面に表示します。
 * @default false
 * @type boolean
 *
 * @param ピクチャに含める
 * @desc ウィンドウをピクチャの間に挟みたい場合、閾値となるピクチャ番号を指定してください。
 * @default 0
 * @type number
 *
 * @help 空のウィンドウを画面上の指定位置に表示します。
 * 最大10個までのウィンドウを表示可能。
 * 表示座標はあらかじめ指定したゲーム変数に格納しておくか、
 * プラグインコマンド実行時に直接指定します。
 * プラグインを使うほどではない自作システムの制作支援にお使いください。
 * 文章の表示はできません。DTextPicture.jsなどを使ってください。
 *
 * パラメータ「ピクチャに含める」にピクチャ番号を指定すると、
 * ウィンドウがその番号のピクチャより上に表示され
 * その番号より上のピクチャより下に表示されます。
 *
 * プラグインコマンド詳細
 *   イベントコマンド「プラグインコマンド」から実行。
 *   （引数の間は半角スペースで区切る）
 *
 *  D_WINDOW_DRAW [ウィンドウ番号] [不透明度] : ウィンドウを表示
 *  例1(座標を変数指定)：D_WINDOW_DRAW 1 255
 *  例2(座標を直接指定)：D_WINDOW_DRAW 1 20 20 320 80 255
 *  ※ ウィンドウ番号には1-10までの値を指定してください。
 *  最後に指定する値は不透明度(0-255)です。
 *
 *  ※ 戦闘中とマップ中ではウィンドウは別々に管理されます。
 *
 *  D_WINDOW_ERASE [ウィンドウ番号] : ウィンドウを削除
 *  例：D_WINDOW_ERASE 1
 *  ※ ウィンドウ番号には1-10までの値を指定してください。
 *
 *  D_WINDOW_OPACITY [ウィンドウ番号] [不透明度] [時間(f)]
 *  既に表示しているウィンドウの不透明度を指定した時間で変化させます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function() {
    var pluginName = 'DWindow';

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length <= 2) min = -Infinity;
        if (arguments.length <= 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramGameVariablesXPos   = getParamNumber(['GameVariablesXPos', 'X座標の変数番号'], 0);
    var paramGameVariablesYPos   = getParamNumber(['GameVariablesYPos', 'Y座標の変数番号'], 0);
    var paramGameVariablesWidth  = getParamNumber(['GameVariablesWidth', '横幅の変数番号'], 0);
    var paramGameVariablesHeight = getParamNumber(['GameVariablesHeight', '高さの変数番号'], 0);
    var paramAlwaysOnTop         = getParamBoolean(['AlwaysOnTop', '最前面に表示']);
    var paramIncludePicture      = getParamNumber(['IncludePicture', 'ピクチャに含める'], 0);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[D_WINDOW_DRAW]などを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        this.pluginCommandDWindow(command, args);
    };

    Game_Interpreter.prototype.pluginCommandDWindow = function(command, args) {
        var windowInfo = {};
        var number     = 0;
        switch (command.toUpperCase()) {
            case 'D_WINDOW_DRAW' :
                switch (args.length) {
                    case 1:
                    case 2:
                        number             = getArgNumber(args[0], 1, 10);
                        windowInfo.x       = $gameVariables.value(paramGameVariablesXPos) || 0;
                        windowInfo.y       = $gameVariables.value(paramGameVariablesYPos) || 0;
                        windowInfo.width   = $gameVariables.value(paramGameVariablesWidth) || 0;
                        windowInfo.height  = $gameVariables.value(paramGameVariablesHeight) || 0;
                        windowInfo.opacity = args.length > 1 ? getArgNumber(args[1], 0, 255) : 255;
                        break;
                    case 5:
                    case 6:
                        number             = getArgNumber(args[0], 1, 10);
                        windowInfo.x       = getArgNumber(args[1], 0);
                        windowInfo.y       = getArgNumber(args[2], 0);
                        windowInfo.width   = getArgNumber(args[3], 0);
                        windowInfo.height  = getArgNumber(args[4], 0);
                        windowInfo.opacity = args.length > 5 ? getArgNumber(args[5], 0, 255) : 255;
                        break;
                    default:
                        throw new Error(command + 'に指定した引数[' + args + 'が不正です。');
                }
                $gameMap.setDrawDWindow(number, windowInfo);
                break;
            case 'D_WINDOW_ERASE' :
                number = getArgNumber(args[0], 1, 10);
                $gameMap.setEraseDWindow(number);
                break;
            case 'D_WINDOW_OPACITY' :
                number                   = getArgNumber(args[0], 1, 10);
                windowInfo.targetOpacity = getArgNumber(args[1], 0, 255);
                windowInfo.duration      = getArgNumber(args[2], 1);
                $gameMap.setOpacityDWindow(number, windowInfo);
                break;
        }
    };

    //=============================================================================
    // Game_Map
    //  動的ウィンドウ表示用の変数を追加定義します。
    //=============================================================================
    var _Game_Map_setup      = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.apply(this, arguments);
        if (!this.dWindowInfos) this.dWindowInfos = [];
    };

    Game_Map.prototype.setDrawDWindow = function(number, windowInfo) {
        this.dWindowInfos[this.findRealWindowNumber(number)] = windowInfo;
    };

    Game_Map.prototype.setEraseDWindow = function(number) {
        this.dWindowInfos[this.findRealWindowNumber(number)] = null;
    };

    Game_Map.prototype.findDWindow = function(number) {
        if (!this.dWindowInfos) this.dWindowInfos = [];
        return this.dWindowInfos[this.findRealWindowNumber(number)];
    };

    Game_Map.prototype.findRealWindowNumber = function(number) {
        return $gameParty.inBattle() ? number + 10 : number;
    };

    Game_Map.prototype.setOpacityDWindow = function(number, windowInfo) {
        var win = this.findDWindow(number);
        if (win) {
            win.targetOpacity = windowInfo.targetOpacity;
            win.duration      = windowInfo.duration;
        }
    };

    var _Game_Map_update      = Game_Map.prototype.update;
    Game_Map.prototype.update = function(sceneActive) {
        _Game_Map_update.apply(this, arguments);
        this.updateDynamicWindow();
    };

    Game_Map.prototype.updateDynamicWindow = function() {
        if (!this.dWindowInfos) {
            return;
        }
        for (var i = 0, n = this.dWindowInfos.length; i < n; i++) {
            var info = this.dWindowInfos[i];
            if (info && info.duration > 0) {
                var d        = info.duration;
                info.opacity = (info.opacity * (d - 1) + info.targetOpacity) / d;
                info.duration--;
            }
        }
    };

    //=============================================================================
    // Spriteset_Map
    //  動的ウィンドウの情報を保持し、作成する処理を追加定義します。
    //=============================================================================
    var _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
    Spriteset_Base.prototype.createUpperLayer = function() {
        if (!paramAlwaysOnTop && paramIncludePicture === 0) {
            this.createDynamicWindow();
            _Spriteset_Base_createUpperLayer.apply(this, arguments);
        } else {
            _Spriteset_Base_createUpperLayer.apply(this, arguments);
            this.createDynamicWindow();
        }
    };

    Spriteset_Base.prototype.createDynamicWindow = function() {
        this._DynamicWindows = [];
        for (var i = 0; i < 10; i++) {
            this._DynamicWindows[i] = new Window_Dynamic(i);
            if (paramIncludePicture > 0) {
                // for PicturePriorityCustomize.js
                if (this._pictureContainerLower) {
                    var dWindow = this._DynamicWindows[i];
                    this.addDynamicWindowForPicturePriority(this._pictureContainerLower, dWindow);
                    this.addDynamicWindowForPicturePriority(this._pictureContainerMiddle, dWindow);
                    this.addDynamicWindowForPicturePriority(this._pictureContainerUpper, dWindow);
                } else {
                    this._pictureContainer.addChildAt(this._DynamicWindows[i], paramIncludePicture + i);
                }
            } else {
                this.addChild(this._DynamicWindows[i]);
            }
        }
    };

    Spriteset_Base.prototype.addDynamicWindowForPicturePriority = function(pictureLayer, dWindow) {
        pictureLayer.children.some(function(picture, index) {
            var id = picture.getPictureId();
            if (id === paramIncludePicture) {
                pictureLayer.addChildAt(dWindow, index + 1);
                return true;
            }
            return false;
        }, this);
    };

    //=============================================================================
    // Window_Dynamic
    //  マップ画面に自由に配置できる動的ウィンドウです。
    //=============================================================================
    function Window_Dynamic() {
        this.initialize.apply(this, arguments);
    }

    Window_Dynamic.prototype             = Object.create(Window_Base.prototype);
    Window_Dynamic.prototype.constructor = Window_Dynamic;

    Window_Dynamic.prototype.initialize = function(number) {
        this._windowNumber = number;
        var info           = this.windowInfo();
        if (info != null) {
            Window_Base.prototype.initialize.call(this, info.x, info.y, info.width, info.height);
        } else {
            Window_Base.prototype.initialize.call(this, 0, 0, 0, 0);
        }
        this.update();
    };

    Window_Dynamic.prototype.windowInfo = function() {
        return $gameMap.findDWindow(this._windowNumber);
    };

    Window_Dynamic.prototype.windowOpacity = function() {
        var win = this.windowInfo();
        return win ? win.opacity : 0;
    };

    Window_Dynamic.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (SceneManager.isSceneChanging()) {
            return;
        }
        var info = this.windowInfo();
        if (info != null) {
            if (info.x !== this.x || info.y !== this.y || info.width !== this.width || info.height !== this.height)
                this.move(info.x, info.y, info.width, info.height);
            this.show();
            this.updateOpacity();
        } else {
            this.hide();
        }
    };

    Window_Dynamic.prototype.updateOpacity = function() {
        this.opacity = this.windowOpacity();
    };
})();
