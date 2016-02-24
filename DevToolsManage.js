//=============================================================================
// DevToolsManage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2016/02/24 ゲームのスピードを高速(2倍速)化する機能を追加
//                  戦闘を勝利扱いで即終了する機能を追加
// 1.1.0 2016/01/11 ゲーム開始時にFPS表示（FPS表示/MS表示に対応）を有効にする機能を追加
//                  タイトル画面を飛ばして最新のセーブファイルをロードする機能を追加
// 1.0.2 2016/01/02 繰り返しリセットすると警告が出る問題の解消
//                  ゲームウィンドウを端に寄せる機能(笑)を追加
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
 * @param FuncKeyMinimize
 * @desc デベロッパツールの最小化/復帰の切り替えを行うキーです(F1～F12)。
 * このキーをCtrlと一緒に押すとデベロッパツールとゲーム画面を閉じます。
 * @default F8
 *
 * @param FuncKeyReload
 * @desc 画面のリロードを行うキーです(F1～F12)。デフォルトF5キーと同様の役割を持ちます。
 * @default F12
 *
 * @param FuncKeyMoveEdge
 * @desc ゲーム画面の左寄せを行うキーです(F1～F12)。
 * @default F11
 *
 * @param FuncKeyRapidGame
 * @desc ゲームを高速化するキーです。(F1～F12)。
 * @default F10
 *
 * @param ShowFPS
 * @desc 初期状態で画面左上にFPSを表示します（FPS/MS/OFF）。
 * @default OFF
 *
 * @param CutTitle
 * @desc タイトル画面をとばして最新のセーブファイルをロードします。
 * セーブファイルがなければニューゲームになります。（ON/OFF）
 * @default OFF
 *
 * @param RapidStart
 * @desc 高速化された状態でゲームを開始します。（ON/OFF）
 * @default OFF
 *
 * @help Developer tools management plugin.
 * Run developer tools when error occur.
 * test play when valid.
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
 * @param 最小化切替キー
 * @desc デベロッパツールの最小化/復帰の切り替えを行うキーです(F1～F12)。
 * このキーをCtrlと一緒に押すとデベロッパツールとゲーム画面を閉じます。
 * @default F8
 *
 * @param リロードキー
 * @desc 画面のリロードを行うキーです(F1～F12)。デフォルトF5キーと同様の役割を持ちます。
 * 以前のツクールとの後方互換性を持たせるための機能です。
 * @default F12
 *
 * @param 画面の左寄せキー
 * @desc ゲーム画面の左寄せを行うキーです(F1～F12)。
 * @default F11
 *
 * @param 高速化切替キー
 * @desc ゲームを高速化するキーです。(F1～F12)。
 * @default F10
 *
 * @param 強制戦闘勝利キー
 * @desc 戦闘を勝利で強制終了するキーです。(F1～F12)。
 * @default F7
 *
 * @param FPS表示
 * @desc 初期状態で画面左上にFPSを表示します。（FPS/MS/OFF）
 * @default OFF
 *
 * @param タイトルカット
 * @desc タイトル画面をとばして最新のセーブファイルをロードします。
 * セーブファイルがなければニューゲームになります。（ON/OFF）
 * @default OFF
 *
 * @param 高速開始
 * @desc 高速化された状態でゲームを開始します。（ON/OFF）
 * @default OFF
 * 
 * @help デベロッパツールの挙動を調整する制作支援プラグインです。
 * 快適な開発支援のために以下の機能を提供します。
 *
 * １．　ゲーム開始時にデベロッパツールが自動で立ち上がる機能（最小化での起動も可能）
 * ２．　エラー発生時やalert時にデベロッパツールが自動でアクティブになる機能
 * ３．　ゲーム画面を常に前面に表示する機能
 * ４．　後方互換機能（F12でリロード、pでコンソールに出力）
 * ５．　alertの挙動をデベロッパツールへのログ出力に変更する機能
 * ６．　テストプレー中にマップやイベントを修正して再保存すると、ゲーム画面にフォーカスを
 * 　　　戻した瞬間に最新のマップを自動でリロードする機能
 * ７．　ゲーム開始時にFPS表示（FPS表示/MS表示に対応）を有効にする機能
 * ８．　タイトル画面を飛ばして最新のセーブファイルをロードする機能
 * ９．　ゲームのスピードを高速化する機能
 * 　　　(マップ上で倍速、フェードアウト、ウィンドウ開閉およびメッセージ表示の高速スキップ)
 * １０．強制的に敵を全滅させる機能
 *
 * このプラグインはテストプレー時のみ有効となります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

var p = null;
var $gameCurrentWindow = null;

(function () {
    'use strict';
    // テストプレー時以外は一切の機能を無効
    if (!Utils.isOptionValid('test') || !Utils.isNwjs()) {
        console.log('DevToolsManage is valid only test play!');
        return;
    }

    //=============================================================================
    // p
    //  RGSS互換のために定義します。
    //=============================================================================
    p = function(value) {
        alert(value);
    };

    var pluginName = 'DevToolsManage';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames, upperFlg) {
        var value = getParamOther(paramNames);
        return value == null ? '' : upperFlg ? value.toUpperCase() : value;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() == 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamArrayString = function (paramNames) {
        var values = getParamString(paramNames);
        return (values || '').split(',');
    };

    var getParamArrayNumber = function (paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    var alwaysOnTop      = getParamBoolean(['AlwaysOnTop', '常に前面表示']);
    var startupDevTool   = getParamString(['StartupDevTool', '開始時に起動'], true);
    var devToolsPosition = getParamArrayNumber(['DevToolsPosition', 'デベロッパツール表示位置'], 0, 9999);
    var funcKeyMinimize  = getParamString(['FuncKeyMinimize', '最小化切替キー']);
    var funcKeyReload    = getParamString(['FuncKeyReload', 'リロードキー']);
    var funcKeyMoveEdge  = getParamString(['FuncKeyMoveEdge', '画面の左寄せキー']);
    var funcKeyRapidGame = getParamString(['FuncKeyRapidGame', '高速化切替キー']);
    var funcKeyVictory   = getParamString(['FuncKeyVictory', '強制戦闘勝利キー']);
    var showFPS          = getParamString(['ShowFPS', 'FPS表示'], true);
    var cutTitle         = getParamBoolean(['CutTitle', 'タイトルカット']);
    var rapidStart       = getParamBoolean(['RapidStart', '高速開始']);

    //=============================================================================
    // SceneManager
    //  状況に応じてデベロッパツールを自動制御します。
    //=============================================================================
    var _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize = function() {
        _SceneManager_initialize.call(this);
        $gameCurrentWindow = SceneManager.getNwjsWindow();
        Graphics.setFPSMeter(showFPS);
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
            case Input.functionReverseMapper[funcKeyMinimize] :
                event.ctrlKey ? $gameCurrentWindow.closeDevTools() : $gameCurrentWindow.toggleDevTools();
                break;
            case Input.functionReverseMapper[funcKeyMoveEdge] :
                $gameCurrentWindow.moveEdge();
                break;
            case Input.functionReverseMapper[funcKeyReload] :
                if (Utils.isNwjs()) {
                    location.reload();
                }
                break;
            case Input.functionReverseMapper[funcKeyRapidGame] :
                this.toggleRapid();
                break;
            case Input.functionReverseMapper[funcKeyVictory] :
                if (this.isCurrentScene(Scene_Battle) && !BattleManager.isBattleAlreadyEnd()) {
                    $gameTroop.members().forEach(function(enemy) {
                        enemy.addNewState(enemy.deathStateId());
                    });
                    BattleManager.processVictory();
                }
                break;
            default:
                _SceneManager_onKeyDown.call(this, event);
                break;
        }
    };
    SceneManager.originalTitle = null;
    SceneManager.rapidGame = false;

    SceneManager.isRapid = function() {
        return SceneManager.rapidGame;
    };

    SceneManager.toggleRapid = function() {
        this.rapidGame = !this.rapidGame;
        if (!this.originalTitle) this.originalTitle = document.title;
        var bgm = AudioManager.saveBgm();
        AudioManager.playBgm(bgm, bgm.pos);
        document.title = this.originalTitle + (this.isRapid() ? ' [!!!Rapid!!!]' : '');
    };

    SceneManager.isPlayTest = function() {
        return ($gameTemp ? $gameTemp.isPlaytest() : Utils.isOptionValid('test')) && Utils.isNwjs();
    };

    SceneManager.getNwjsWindow = function() {
        return SceneManager.isPlayTest() ? new Game_NwjsWindow() : new Game_CurrentWindow();
    };

    SceneManager.isCurrentScene = function(sceneClass) {
        return this._scene && this._scene.constructor === sceneClass;
    };

    //=============================================================================
    // BattleManager
    //  すでに戦闘が終了しているかを返します。
    //=============================================================================
    BattleManager.isBattleAlreadyEnd = function() {
        return this._phase === 'battleEnd';
    };

    //=============================================================================
    // AudioManager
    //  高速化実行時にBGMのピッチを強制的に最大にします。
    //=============================================================================
    var _AudioManager_playBgm = AudioManager.playBgm;
    AudioManager.playBgm = function(bgm, pos) {
        var originalPitch = bgm.pitch;
        if(SceneManager.isRapid()) arguments[0].pitch = 150;
        _AudioManager_playBgm.apply(this, arguments);
        this._currentBgm.pitch = originalPitch;
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

    Input.functionReverseMapper = {
        F1  : 112,
        F2  : 113,
        F3  : 114,
        F4  : 115,
        F5  : 116,
        F6  : 117,
        F7  : 118,
        F8  : 119,
        F9  : 120,
        F10 : 121,
        F11 : 122,
        F12 : 123
    };

    //=============================================================================
    // Graphics
    //  FPSの表示を設定します。
    //=============================================================================
    Graphics.setFPSMeter = function(type) {
        switch (type) {
            case 'FPS':
                this.hideFps();
                this._switchFPSMeter();
                break;
            case 'MS':
                this.hideFps();
                this._switchFPSMeter();
                this._switchFPSMeter();
                break;
        }
    };

    //=============================================================================
    // Scene_Base
    //  マップの高速化を提供します。
    //=============================================================================
    var _Scene_Base_fadeSpeed = Scene_Base.prototype.fadeSpeed;
    Scene_Base.prototype.fadeSpeed = function () {
        return SceneManager.isRapid() ? 1 : _Scene_Base_fadeSpeed.apply(this, arguments);
    };

    var _Scene_Base_startFadeIn = Scene_Base.prototype.startFadeIn;
    Scene_Base.prototype.startFadeIn = function(duration, white) {
        if (SceneManager.isRapid()) arguments[0] = 1;
        _Scene_Base_startFadeIn.apply(this, arguments);
    };

    var _Scene_Base_startFadeOut = Scene_Base.prototype.startFadeOut;
    Scene_Base.prototype.startFadeOut = function(duration, white) {
        if (SceneManager.isRapid()) arguments[0] = 1;
        _Scene_Base_startFadeOut.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Boot
    //  タイトル画面をとばしてマップ画面に遷移します。
    //=============================================================================
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments);
        if (rapidStart) SceneManager.toggleRapid();
        if (cutTitle) this.goToLatestContinue() || this.goToNewGame();
    };

    Scene_Boot.prototype.goToNewGame = function() {
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    };

    Scene_Boot.prototype.goToLatestContinue = function() {
        if (DataManager.isAnySavefileExists()) {
            if (DataManager.loadGame(DataManager.latestSavefileId())) {
                Scene_Load.prototype.reloadMapIfUpdated.call(Scene_Load);
                SceneManager.goto(Scene_Map);
                $gameSystem.onAfterLoad();
                return true;
            } else {
                return false;
            }
        } else {
            return false;
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

    var _Scene_Map_isFastForward = Scene_Map.prototype.isFastForward;
    Scene_Map.prototype.isFastForward = function() {
        return _Scene_Map_isFastForward.apply(this, arguments) || SceneManager.rapidGame;
    };

    //=============================================================================
    // Window_Base
    //  ウィンドウの高速開閉を提供します。
    //=============================================================================
    var _Window_Base_updateOpen = Window_Base.prototype.updateOpen;
    Window_Base.prototype.updateOpen = function () {
        if (SceneManager.isRapid() && this._opening) this.openness = 255;
        _Window_Base_updateOpen.call(this);
    };

    var _Window_Base_updateClose = Window_Base.prototype.updateClose;
    Window_Base.prototype.updateClose = function () {
        if (SceneManager.isRapid() && this._closing) this.openness = 0;
        _Window_Base_updateClose.call(this);
    };

    //=============================================================================
    // Window_Message
    //  メッセージの高速化を提供します。
    //=============================================================================
    var _Window_Message_isTriggered = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function() {
        return _Window_Message_isTriggered.apply(this, arguments) || SceneManager.isRapid();
    };

    var _Window_Message_startPause = Window_Message.prototype.startPause;
    Window_Message.prototype.startPause = function() {
        _Window_Message_startPause.apply(this, arguments);
        if (SceneManager.isRapid()) this.startWait(1);
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
    Game_CurrentWindow.prototype.moveEdge = function() {};

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
        if (alwaysOnTop === 'ON') {
            this.setAlwaysOnTop(true);
        }        
        switch (startupDevTool) {
            case 'ON':
            case 'MINIMIZE':
                if (!DataManager.isEventTest()) this.showDevTools();
                break;
        }
    };

    Game_NwjsWindow.prototype.addEventListener = function() {
        var currentWin = this.getWindow();
        currentWin.removeAllListeners();
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
        devTool.removeAllListeners();
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

    Game_NwjsWindow.prototype.moveEdge = function() {
        this.getWindow().moveTo(0, 0);
        if (this.getWindow().isDevToolsOpen()) this._devTool.minimize();
    };

    Game_NwjsWindow.prototype.focus = function() {
        this.getWindow().focus();
    };
})();
