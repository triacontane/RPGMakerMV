//=============================================================================
// DevToolsManage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2015/12/19 F12キーでリセットする機能を追加（F5と同様の動作）
// 1.0.0 2015/12/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Developer tools management plugin
 * @author triacontane
 *
 * @param StartupDevTool
 * @desc It will start the developer tools at the start of the game.(ON/OFF/MINIMIZE)
 * @default OFF
 *
 * @param AlwaysOnTop
 * @desc Game screen always on top.(ON/OFF)
 * @default OFF
 *
 * @param DevToolsPosition
 * @desc Developer tool's position(X, Y, Width, Height) Separated comma
 * @default 0,0,800,600
 *
 * @help Developer tools management plugin.
 * Run developer tools when error occured.
 * test play when valid.
 *
 * F8 : Toggle minimize/restore
 * Ctrl + F8 : Close developer tools（and game window）
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc デベロッパツール管理プラグイン
 * @author トリアコンタン
 *
 * @param 開始時に起動
 * @desc ゲーム開始時に同時にデベロッパツールを起動します。(ON/OFF/MINIMIZE)
 * @default OFF
 *
 * @param 常に前面表示
 * @desc ゲーム画面を常に前面に表示します。(ON/OFF)
 * @default OFF
 *
 * @param デベロッパツール表示位置
 * @desc デベロッパツールの表示座標です。X座標、Y座標、横幅、高さをカンマ区切りで指定します。
 * @default 0,0,800,600
 * 
 * @help デベロッパツールの挙動を調整する制作支援プラグインです。
 * ゲーム開始時にデベロッパツールが自動で立ち上がる機能や、
 * エラー発生時やアラート表示時に自動でアクティブになる機能を提供します。
 * このプラグインはテストプレー時のみ有効となります。
 *
 * 以下のキー入力で任意で制御することも可能です。
 *
 * F8 : 最小化/復帰の切り替え
 * Ctrl + F8 : 閉じる（連動してゲーム画面も閉じます）
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

//=============================================================================
// p
//  RGSS互換のために定義します。
//=============================================================================
p = function(value) {
    alert(value);
};

var $gameCurrentWindow = null;

(function () {
    var paramName = 'DevToolsManage';

    PluginManager.getParamBoolean = function(pluginName, paramEngName, paramJpgName) {
        var value = this.getParamOther(pluginName, paramEngName, paramJpgName);
        return (value || '').toUpperCase() == 'ON';
    };

    PluginManager.getParamString = function (pluginName, paramEngName, paramJpgName) {
        var value = this.getParamOther(pluginName, paramEngName, paramJpgName);
        return value == null ? '' : value;
    };

    PluginManager.getParamArrayNumber = function (pluginName, paramEngName, paramJpgName) {
        var values = this.getParamArrayString(pluginName, paramEngName, paramJpgName);
        for (var i = 0; i < values.length; i++) {
            values[i] = parseInt(values[i], 10) || 0;
        }
        return values;
    };

    PluginManager.getParamArrayString = function (pluginName, paramEngName, paramJpgName) {
        var value = this.getParamString(pluginName, paramEngName, paramJpgName);
        return (value || '').split(',');
    };

    PluginManager.getParamOther = function(pluginName, paramEngName, paramJpgName) {
        var value = this.parameters(pluginName)[paramEngName];
        if (value == null) value = this.parameters(pluginName)[paramJpgName];
        return value;
    };

    var alwaysOnTop = PluginManager.getParamBoolean(paramName, 'AlwaysOnTop', '常に前面表示');
    var startupDevTool = PluginManager.getParamString(paramName, 'StartupDevTool', '開始時に起動');
    var devToolsPosition = PluginManager.getParamArrayNumber(paramName, 'DevToolsPosition', 'デベロッパツール表示位置');

    //=============================================================================
    // SceneManager
    //  状況に応じてデベロッパツールを自動制御します。
    //=============================================================================
    var _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize = function() {
        _SceneManager_initialize.call(this);
        $gameCurrentWindow = SceneManager.getNwjsWindow();
    };

    var _SceneManager_catchException = SceneManager.catchException;
    SceneManager.catchException = function(e) {
        $gameCurrentWindow.showDevTools(false);
        _SceneManager_catchException.call(this, e);
    };

    var _SceneManager_onError = SceneManager.onError;
    SceneManager.onError = function(e) {
        $gameCurrentWindow.showDevTools(false);
        _SceneManager_onError.call(this, e);
    };

    var _SceneManager_onKeyDown = SceneManager.onKeyDown;
    SceneManager.onKeyDown = function(event) {
        switch (event.keyCode) {
            case 119: // F8
                event.ctrlKey ? $gameCurrentWindow.closeDevTools() : $gameCurrentWindow.toggleDevTools();
                break;
            case 123: // F12
                if (Utils.isNwjs()) {
                    location.reload();
                }
                break;
            default:
                _SceneManager_onKeyDown.call(this, event);
                break;
        }
    };

    SceneManager.isPlayTest = function() {
        return ($gameTemp ? $gameTemp.isPlaytest() : Utils.isOptionValid('test')) && Utils.isNwjs()
    };

    SceneManager.getNwjsWindow = function() {
        return SceneManager.isPlayTest() ? new Game_NwjsWindow() : new Game_CurrentWindow();
    };

    //=============================================================================
    // Input
    //  alertを再定義してコンソール出力にします。
    //=============================================================================
    var _Input_wrapNwjsAlert = Input._wrapNwjsAlert;
    Input._wrapNwjsAlert = function() {
        if (SceneManager.isPlayTest()) {
            window.alert = function() {
                console.log(arguments[0]);
                $gameCurrentWindow.showDevTools(false);
            };
        } else {
            _Input_wrapNwjsAlert.call(this);
        }
    };

    //=============================================================================
    // Scene_Map
    //  オンフォーカス時、ゲームが再保存されていればリロードする
    //=============================================================================
    var _Scene_Map_create = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        _Scene_Map_create.call(this);
        $gameCurrentWindow._onFocus = false;
    };

    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        this.updateMapReload();
        if (this._dataSystemLoading) {
            if (DataManager.isDatabaseLoaded()) {
                this._dataSystemLoading = false;
                if (this._preVersionId != $dataSystem.versionId) {
                    $gamePlayer.reserveTransfer(
                        $gameMap.mapId(), $gamePlayer.x, $gamePlayer.y, $gamePlayer.direction(), 2);
                    $gamePlayer._needsMapReload = true;
                }
            } else {
                return;
            }
        }
        _Scene_Map_update.call(this);
    };

    Scene_Map.prototype.updateMapReload = function() {
        if ($gameCurrentWindow._onFocus && $gamePlayer.canMove()) {
            $gameCurrentWindow._onFocus = false;
            for (var i = 0; i < DataManager._databaseFiles.length; i++) {
                var name = DataManager._databaseFiles[i].name;
                if (name === '$dataSystem') {
                    this._preVersionId = $dataSystem.versionId;
                    DataManager.loadDataFile(name, DataManager._databaseFiles[i].src);
                    this._dataSystemLoading = true;
                }
            }
        }
    };

    //=============================================================================
    // Game_CurrentWindow
    // カレントウィンドウを扱うクラスです。
    //=============================================================================
    function Game_CurrentWindow() {
        this.initialize.apply(this, arguments);
    }
    Game_CurrentWindow.prototype = Object.create(Game_CurrentWindow.prototype);
    Game_CurrentWindow.prototype.constructor = Game_CurrentWindow;
    Game_CurrentWindow.prototype.initialize = function() {
        this._devTool         = null;
        this._devToolMinimize = false;
        this._onFocus         = false;
    };
    Game_CurrentWindow.prototype.showDevTools = function() {};
    Game_CurrentWindow.prototype.closeDevTools = function() {};
    Game_CurrentWindow.prototype.alwaysOnTop = function() {};
    Game_CurrentWindow.prototype.focus = function() {};
    Game_CurrentWindow.prototype.getWindow = function() {};

    //=============================================================================
    // Game_Nwjs
    //  nw.jsで実行した場合のカレントウィンドウを扱うクラスです。
    // ゲーム開始時に作成されますが保存はされません。
    //=============================================================================
    function Game_NwjsWindow() {
        this.initialize.apply(this, arguments);
    }
    Game_NwjsWindow.prototype = Object.create(Game_CurrentWindow.prototype);
    Game_NwjsWindow.prototype.constructor = Game_NwjsWindow;

    Game_NwjsWindow.prototype.initialize = function() {
        this._devTool         = null;
        this._devToolMinimize = false;
        this._onFocus         = false;
        this.addEventListener();
        this.setAlwaysOnTop(true);
        switch (startupDevTool) {
            case 'ON':
            case 'MINIMIZE':
                this.showDevTools();
                break;
        }
    };

    Game_NwjsWindow.prototype.addEventListener = function() {
        var currentWin = this.getWindow();
        currentWin.on('focus', function() {
            this._onFocus = true;
        }.bind(this));
    };

    Game_NwjsWindow.prototype.getWindow = function() {
        return require('nw.gui').Window.get();
    };

    Game_NwjsWindow.prototype.setAlwaysOnTop = function(value) {
        this.getWindow().setAlwaysOnTop(value);
    };

    Game_NwjsWindow.prototype.showDevTools = function() {
        if (!this.getWindow().isDevToolsOpen() || !this._devTool) {
            var devTool = this.getWindow().showDevTools();
            devTool.moveTo(devToolsPosition[0], devToolsPosition[1]);
            devTool.resizeTo(devToolsPosition[2], devToolsPosition[3]);
            if (!this._devTool) {
                this.addEventListenerDevTools(devTool);
                this._devTool = devTool;
            }
        } else {
            this._devTool.restore();
        }
        this.focus();
    };

    Game_NwjsWindow.prototype.addEventListenerDevTools = function(devTool) {
        devTool.on('minimize', function() {
            this._devToolMinimize = true;
            this.focus();
        }.bind(this));
        devTool.on('restore', function() {
            this._devToolMinimize = false;
            this.focus();
        }.bind(this));
        devTool.on('loaded', function() {
            this._devTool.setAlwaysOnTop(alwaysOnTop);
            this.setAlwaysOnTop(alwaysOnTop);
            if (startupDevTool === 'MINIMIZE') this._devTool.minimize();
        }.bind(this));
        devTool.on('closed', function() {
            this.getWindow().close();
        }.bind(this));
    };

    Game_NwjsWindow.prototype.toggleDevTools = function() {
        if (this._devTool) {
            this._devToolMinimize ? this._devTool.restore() : this._devTool.minimize();
            this.focus();
        } else {
            this.showDevTools(false);
        }
    };

    Game_NwjsWindow.prototype.closeDevTools = function() {
        if (this.getWindow().isDevToolsOpen()) this.getWindow().closeDevTools();
    };

    Game_NwjsWindow.prototype.focus = function() {
        this.getWindow().focus();
    };
})();
