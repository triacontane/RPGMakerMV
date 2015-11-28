//=============================================================================
// DWindow.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2015/11/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
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
 *
 * @param GameVariablesYPos
 * @desc Game variable number that stores the window Y position
 * @default 2
 *
 * @param GameVariablesWidth
 * @desc Game variable number that stores the window width
 * @default 3
 *
 * @param GameVariablesHeight
 * @desc Game variable number that stores the window height
 * @default 4
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
 *
 * @param Y座標の変数番号
 * @desc Y座標を格納するゲーム変数の番号
 * @default 2
 *
 * @param 横幅の変数番号
 * @desc 横幅を格納するゲーム変数の番号
 * @default 3
 *
 * @param 高さの変数番号
 * @desc 高さを格納するゲーム変数の番号
 * @default 4
 *
 * @help 空のウィンドウを画面上の指定位置に表示します。
 * 最大10個までのウィンドウを表示可能。
 * 表示座標はあらかじめ指定したゲーム変数に格納しておくか、
 * プラグインコマンド実行時に直接指定します。
 * プラグインを使うほどではない自作システムの制作支援にお使いください。
 * 文章の表示はできません。DTextPicture.jsなどを使ってください。
 *
 * プラグインコマンド詳細
 *   イベントコマンド「プラグインコマンド」から実行。
 *   （引数の間は半角スペースで区切る）
 *
 *  D_WINDOW_DRAW [ウィンドウ番号] : ウィンドウを表示
 *  例1(座標を変数指定)：D_WINDOW_DRAW 1
 *  例2(座標を直接指定)：D_WINDOW_DRAW 1 20 20 320 80
 *  ※ ウィンドウ番号には1-10までの値を指定してください。
 *
 *  D_WINDOW_ERASE [ウィンドウ番号] : ウィンドウを削除
 *  例：D_WINDOW_ERASE 1
 *  ※ ウィンドウ番号には1-10までの値を指定してください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  ただし、ヘッダのライセンス表示は残してください。
 */
(function () {
    var paramName = 'DWindow';

    PluginManager.getParamNumber = function(pluginName, paramEngName, paramJpgName, min, max) {
        var value = this.getParamOther(pluginName, paramEngName, paramJpgName);
        if (arguments.length <= 3) min = -Infinity;
        if (arguments.length <= 4) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    PluginManager.getParamOther = function(pluginName, paramEngName, paramJpgName) {
        var value = this.parameters(pluginName)[paramEngName];
        if (value == null) value = this.parameters(pluginName)[paramJpgName];
        return value;
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[D_WINDOW_DRAW]などを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        switch (command.toUpperCase()) {
            case 'D_WINDOW_DRAW' :
                var windowInfo = new Rectangle(0, 0, 0, 0);
                var number = 0;
                switch (args.length) {
                    case 1:
                        number = parseInt(args[0], 10).clamp(1,10) || 1;
                        var vx = PluginManager.getParamNumber(paramName, 'GameVariablesXPos', 'X座標の変数番号', 0);
                        windowInfo.x      = $gameVariables.value(vx) || 0;
                        var vy = PluginManager.getParamNumber(paramName, 'GameVariablesYPos', 'Y座標の変数番号', 0);
                        windowInfo.y      = $gameVariables.value(vy) || 0;
                        var vw = PluginManager.getParamNumber(paramName, 'GameVariablesWidth', '横幅の変数番号', 0);
                        windowInfo.width  = $gameVariables.value(vw) || 0;
                        var vh = PluginManager.getParamNumber(paramName, 'GameVariablesHeight', '高さの変数番号', 0);
                        windowInfo.height = $gameVariables.value(vh) || 0;
                        break;
                    case 5:
                        number = parseInt(args[0], 10).clamp(1,10) || 1;
                        windowInfo.x      = parseInt(args[1], 10) || 0;
                        windowInfo.y      = parseInt(args[2], 10) || 0;
                        windowInfo.width  = parseInt(args[3], 10) || 0;
                        windowInfo.height = parseInt(args[4], 10) || 0;
                        break;
                    default:
                        alert(command + 'に指定した引数[' + args + 'が不正です。');
                        return;
                        break;
                }
                $gameMap.setDrawDWindow(number, windowInfo);
                break;
            case 'D_WINDOW_ERASE' :
                $gameMap.setEraseDWindow(parseInt(args[0], 10).clamp(1,10) || 1);
                break;
        }
    };

    //=============================================================================
    // Game_Map
    //  動的ウィンドウ表示用の変数を追加定義します。
    //=============================================================================
    var _Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function() {
        _Game_Map_initialize.call(this);
        this._dWindowInfos = [];
    };

    Game_Map.prototype.setDrawDWindow = function(number, windowInfo) {
        this._dWindowInfos[number] = windowInfo;
    };

    Game_Map.prototype.setEraseDWindow = function(number) {
        this._dWindowInfos[number] = null;
    };


    //=============================================================================
    // Spriteset_Map
    //  動的ウィンドウの情報を保持し、作成する処理を追加定義します。
    //=============================================================================
    Spriteset_Map.prototype.createUpperLayer = function() {
        this.createDynamicWindow();
        Spriteset_Base.prototype.createUpperLayer.call(this);
    };

    Spriteset_Map.prototype.createDynamicWindow = function() {
        this._DynamicWindows = [];
        for (var i = 0; i < 10; i++) {
            this._DynamicWindows[i] = new Window_Dynamic(i);
            this.addChild(this._DynamicWindows[i]);
        }
    };

    var _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.call(this);
        this.updateDynamicWindow();
    };

    Spriteset_Map.prototype.updateDynamicWindow = function() {
        for (var i = 0; i < 10; i++) {
            this._DynamicWindows[i].update();
        }
    };

    //=============================================================================
    // Window_Dynamic
    //  マップ画面に自由に配置できる動的ウィンドウです。
    //=============================================================================
    function Window_Dynamic() {
        this.initialize.apply(this, arguments);
    }

    Window_Dynamic.prototype = Object.create(Window_Base.prototype);
    Window_Dynamic.prototype.constructor = Window_Dynamic;

    Window_Dynamic.prototype.initialize = function(number) {
        this._windowNumber = number;
        var info = this.windowInfo();
        if (info != null) {
            Window_Base.prototype.initialize.call(this, info.x, info.y, info.width, info.height);
        } else {
            Window_Base.prototype.initialize.call(this, 0, 0, 0, 0);
        }
        this.update();
    };

    Window_Dynamic.prototype.windowInfo = function() {
        return $gameMap._dWindowInfos[this._windowNumber];
    };

    Window_Dynamic.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        var info = this.windowInfo();
        if (info != null) {
            if (info.x != this.x || info.y != this.y || info.width != this.width || info.height != this.height)
                this.move(info.x, info.y, info.width, info.height);
            this.show();
        } else {
            this.hide();
        }
    };
})();