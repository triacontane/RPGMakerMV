//=============================================================================
// DevToolsManage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.2 2016/06/14 SceneManager.initializeでエラーが発生した際にエラー内容を確認できない問題を修正
// 1.4.1 2016/06/14 YEP_CoreEngine.jsと併用したときにウィンドウ高さ補正が効かなくなる問題を修正
// 1.4.0 2016/06/03 メニューバーからデバッグ用のコマンドを実行できる機能を追加
//                  ゲーム画面の更新を停止し、一時的にフリーズする機能を追加
//                  セーブデータのエンコード・デコード機能を追加
// 1.3.0 2016/05/04 スクリプトのその場実行機能を追加
//                  モバイル偽装機能を追加
//                  コードのリファクタリング
// 1.2.2 2016/03/19 ゲームのスピード高速化を8倍速まで対応
// 1.2.1 2016/02/27 タイトルカットしたときにイベントテスト、戦闘テストが正しく開始されない不具合を修正
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
 * @param FuncKeyScript
 * @desc スクリプト実行用のウィンドウをポップアップするキーです。(F1～F12)。
 * @default F6
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
 * @param RapidSpeed
 * @desc 高速化を実行した際のスピード倍率です。
 * @default 2
 *
 * @param FakeMobile
 * @desc モバイル実行を偽装します。(ON/OFF)
 * モバイル版で異なるUIを使用する場合の表示確認ができます。
 * @default OFF
 *
 * @param MenuBarVisible
 * @desc メニューバーを表示し各種デバッグコマンドを実行できます。(ON/OFF)
 * @default ON
 *
 * @param ClickMenu
 * @desc クリックメニューから各種デバッグコマンドを実行できます。(-1;無効 0:左 1:ホイール 2:右)
 * @default 2
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
 * @default
 *
 * @param 高速化切替キー
 * @desc ゲームの高速化を切り替えるキーです。(F1～F12)。
 * @default
 *
 * @param 強制戦闘勝利キー
 * @desc 戦闘を勝利扱いで強制終了するキーです。(F1～F12)。
 * @default
 *
 * @param スクリプト実行キー
 * @desc スクリプト実行用のウィンドウをポップアップするキーです。(F1～F12)。
 * @default
 *
 * @param フリーズキー
 * @desc 画面の更新を一時停止します。(F1～F12)。
 * @default
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
 * @param 高速スピード
 * @desc 高速化を実行した際のスピード倍率です。
 * 最大で8倍速まで指定できます。
 * @default 2
 *
 * @param モバイル偽装
 * @desc モバイル実行を偽装します。(ON/OFF)
 * モバイル版で異なるUIを使用する場合の表示確認ができます。
 * @default OFF
 *
 * @param メニューバー表示
 * @desc メニューバーを表示し各種デバッグコマンドを実行できます。(ON/OFF)
 * @default ON
 *
 * @param クリックメニュー
 * @desc クリックメニューから各種デバッグコマンドを実行できます。(-1;無効 0:左 1:ホイール 2:右)
 * @default 2
 * 
 * @help デベロッパツールの挙動を調整する制作支援プラグインです。
 * 快適な開発支援のために以下の機能を提供します。
 *
 * 1. ゲーム開始時にデベロッパツールが自動で立ち上がる機能（最小化での起動も可能）
 * 2. エラー発生時やalert時にデベロッパツールが自動でアクティブになる機能
 * 3. ゲーム画面を常に前面に表示する機能
 * 4. 後方互換機能（F12でリロード、pでコンソール出力）
 * 5. alertの挙動をデベロッパツールへのログ出力に変更する機能
 * 6. テストプレー中にマップやイベントを修正して再保存すると、ゲーム画面に
 *    フォーカスを戻した瞬間に最新のマップを自動でリロードする機能
 * 7. ゲーム開始時にFPS表示（FPS表示/MS表示に対応）を有効にする機能
 * 8. タイトル画面を飛ばして最新のセーブファイルをロードする機能
 * 9. マップ上でのゲームのスピードを高速化(8倍速まで)する機能
 *    (マップ上で高速、フェードアウト、メッセージ表示の高速スキップ)
 * 10.強制的に敵を全滅させる機能
 * 11.スクリプトをその場で実行して結果を得る機能
 *    (実行したスクリプトはクリップボードに格納されます)
 * 12.モバイル実行を偽装する機能
 *    (モバイル用のUIの表示確認ができます。
 *     オーディオが演奏されない制約があります)
 * 13.ゲーム画面の更新を一時的に停止する機能
 * 14.セーブデータのエンコード・デコード機能(※1)
 *
 * ※1 セーブデータのエンコード・デコード機能について
 * セーブファイルをJSON形式に変換してJSONエディタ等で編集可能にします。
 * 編集したファイルを再度、セーブファイルに戻すこともできます。
 * スクリプト実行機能またはイベントコマンドのテスト機能で
 * 以下のスクリプトを実行してください。
 *
 * DataManager.decodeSaveGame(id); // id:セーブファイルID
 * Base64でエンコーディングされたセーブファイルをJSON形式に戻します。
 *
 * DataManager.encodeSaveGame(id); // id:セーブファイルID
 * JSON形式のセーブデータを再度Base64でエンコーディングして保存します。
 *
 * このプラグインはローカル環境でのテストプレー時のみ有効となります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

var p = null;

(function() {
    'use strict';
    // テストプレー時以外は一切の機能を無効
    if (!Utils.isOptionValid('test') || !Utils.isNwjs()) {
        console.log('DevToolsManage is valid only test play!');
        return;
    }
    var pluginName = 'DevToolsManage';

    //=============================================================================
    // p
    //  RGSS互換のために定義します。
    //=============================================================================
    p = function(value) {
        console.log(value);
        SceneManager.getNwJs().showDevTools();
    };

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames, upperFlg) {
        var value = getParamOther(paramNames);
        return value === null ? '' : upperFlg ? value.toUpperCase() : value;
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

    var getParamArrayString = function(paramNames) {
        var values = getParamString(paramNames);
        return (values || '').split(',');
    };

    var getParamArrayNumber = function(paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    var paramAlwaysOnTop      = getParamBoolean(['AlwaysOnTop', '常に前面表示']);
    var paramStartupDevTool   = getParamString(['StartupDevTool', '開始時に起動'], true);
    var paramDevToolsPosition = getParamArrayNumber(['DevToolsPosition', 'デベロッパツール表示位置'], 0, 9999);
    var paramFuncKeyMinimize  = getParamString(['FuncKeyMinimize', '最小化切替キー']);
    var paramFuncKeyReload    = getParamString(['FuncKeyReload', 'リロードキー']);
    var paramFuncKeyMoveEdge  = getParamString(['FuncKeyMoveEdge', '画面の左寄せキー']);
    var paramFuncKeyRapidGame = getParamString(['FuncKeyRapidGame', '高速化切替キー']);
    var paramFuncKeyVictory   = getParamString(['FuncKeyVictory', '強制戦闘勝利キー']);
    var paramFuncKeyScript    = getParamString(['FuncKeyScript', 'スクリプト実行キー']);
    var paramFuncKeyFreeze    = getParamString(['FuncKeyFreeze', 'フリーズキー']);
    var paramShowFPS          = getParamString(['ShowFPS', 'FPS表示'], true);
    var paramCutTitle         = getParamBoolean(['CutTitle', 'タイトルカット']);
    var paramRapidStart       = getParamBoolean(['RapidStart', '高速開始']);
    var paramRapidSpeed       = getParamNumber(['RapidSpeed', '高速スピード'], 2, 16);
    var paramFakeMobile       = getParamBoolean(['FakeMobile', 'モバイル偽装']);
    var paramMenuBarVisible   = getParamBoolean(['MenuBarVisible', 'メニューバー表示']);
    var paramClickMenu        = getParamNumber(['ClickMenu', 'クリックメニュー'], -1);

    //=============================================================================
    // ローカル変数
    //=============================================================================
    var localWindowHeight = 0;

    //=============================================================================
    // Utils
    //  モバイルモードを偽装します。
    //=============================================================================
    var _Utils_isMobileDevice = Utils.isMobileDevice;
    Utils.isMobileDevice      = function() {
        return _Utils_isMobileDevice.apply(this, arguments) || paramFakeMobile;
    };

    var _Graphics__createAllElements = Graphics._createAllElements;
    Graphics._createAllElements      = function() {
        _Graphics__createAllElements.apply(this, arguments);
        console.log(document.body);
    };

    //=============================================================================
    // SceneManager
    //  状況に応じてデベロッパツールを自動制御します。
    //=============================================================================
    SceneManager.devCommands = [
        {code: 101, name: 'DEVツール最小化', key: paramFuncKeyMinimize},
        {code: 102, name: '画面左寄せ', key: paramFuncKeyMoveEdge},
        {code: 103, name: 'リロード', key: paramFuncKeyReload},
        {code: 104, name: '高速モード切替', key: paramFuncKeyRapidGame},
        {code: 105, name: '戦闘強制勝利', key: paramFuncKeyVictory},
        {code: 106, name: '任意スクリプト実行', key: paramFuncKeyScript},
        {code: 107, name: '画面フリーズ', key: paramFuncKeyFreeze}
    ];

    var _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize      = function() {
        _SceneManager_initialize.apply(this, arguments);
        this._nwJsGui = new Controller_NwJs();
        this._freeze  = false;
        Graphics.setFPSMeter(paramShowFPS);
    };

    SceneManager.getNwJs = function() {
        return this._nwJsGui;
    };

    SceneManager.toggleFreeze = function() {
        Input.clear();
        this._freeze = !this._freeze;
    };

    var _SceneManager_catchException = SceneManager.catchException;
    SceneManager.catchException      = function(e) {
        if (this._nwJsGui) this._nwJsGui.showDevTools(false);
        _SceneManager_catchException.apply(this, arguments);
    };

    var _SceneManager_onError = SceneManager.onError;
    SceneManager.onError      = function(e) {
        if (this._nwJsGui) this._nwJsGui.showDevTools(false);
        _SceneManager_onError.apply(this, arguments);
    };

    var _SceneManager_onKeyDown = SceneManager.onKeyDown;
    SceneManager.onKeyDown      = function(event) {
        _SceneManager_onKeyDown.apply(this, arguments);
        this.onKeyDownForDevToolManage(event);
    };

    SceneManager.onKeyDownForDevToolManage = function(event) {
        var commandCode = null;
        this.devCommands.some(function(commandInfo) {
            if (Input.functionReverseMapper[commandInfo.key] === event.keyCode) {
                commandCode = commandInfo.code;
                return true;
            }
            return false;
        });
        if (commandCode && this._nwJsGui) this.executeDevCommand(commandCode, event);
    };

    SceneManager.executeDevCommand = function(code, event) {
        var command = this['executeDevCommand' + code];
        if (command) command.call(SceneManager, event);
    };

    SceneManager.executeDevCommand101 = function(event) {
        if (event && event.ctrlKey) {
            this._nwJsGui.closeDevTools();
        } else {
            this._nwJsGui.toggleDevTools();
        }
    };

    SceneManager.executeDevCommand102 = function() {
        this._nwJsGui.moveEdge();
    };

    SceneManager.executeDevCommand103 = function() {
        location.reload();
    };

    SceneManager.executeDevCommand104 = function() {
        this.toggleRapid();
    };

    SceneManager.executeDevCommand105 = function() {
        BattleManager.forceVictory();
    };

    SceneManager.executeDevCommand106 = function() {
        this.showScriptDialog();
    };

    SceneManager.executeDevCommand107 = function() {
        this.toggleFreeze();
    };

    SceneManager.originalTitle = null;
    SceneManager._rapidGame    = false;

    SceneManager.isRapid = function() {
        return SceneManager._rapidGame;
    };

    SceneManager.toggleRapid = function() {
        this._rapidGame = !this._rapidGame;
        if (!this.originalTitle) this.originalTitle = document.title;
        var bgm = AudioManager.saveBgm();
        AudioManager.playBgm(bgm, bgm.pos);
        document.title = this.originalTitle + (this.isRapid() ? ' [!!!Rapid!!!] * ' + paramRapidSpeed : '');
    };

    SceneManager.isCurrentScene = function(sceneClass) {
        return this._scene && this._scene.constructor === sceneClass;
    };

    SceneManager.showScriptDialog = function() {
        var scriptString = window.prompt('実行したいスクリプトを入力してください。', this._nwJsGui.readClipboard());
        if (scriptString !== null && scriptString !== '') {
            this._nwJsGui.showDevTools();
            this._nwJsGui.writeClipboard(scriptString);
            try {
                var result = eval(scriptString);
                SoundManager.playOk();
                console.log('Execute Script : ' + scriptString);
                console.log('Execute Result : ' + result);
            } catch (e) {
                SoundManager.playBuzzer();
                console.log('Error Script : ' + scriptString);
                console.error(e.stack);
            }
        }
    };

    var _SceneManager_initNwjs = SceneManager.initNwjs;
    SceneManager.initNwjs      = function() {
        _SceneManager_initNwjs.apply(this, arguments);
        if (paramMenuBarVisible) {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            if (!win.menu) {
                win.y -= 20;
                win.height += 20;
            }
            win.menu          = new gui.Menu({type: 'menubar'});
            localWindowHeight = win.height;
        }
    };

    var _SceneManager_run = SceneManager.run;
    SceneManager.run      = function(sceneClass) {
        _SceneManager_run.apply(this, arguments);
        if (paramMenuBarVisible) {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            if (win.height !== localWindowHeight) {
                win.height = localWindowHeight;
            }
        }
    };

    var _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene      = function() {
        if (this._freeze) return;
        _SceneManager_updateScene.apply(this, arguments);
    };

    //=============================================================================
    // BattleManager
    //  強制勝利を追加定義します。
    //=============================================================================
    BattleManager.forceVictory = function() {
        if (SceneManager.isCurrentScene(Scene_Battle) && !this.isBattleAlreadyEnd()) {
            $gameTroop.members().forEach(function(enemy) {
                enemy.addNewState(enemy.deathStateId());
            });
            this.processVictory();
        }
    };

    BattleManager.isBattleAlreadyEnd = function() {
        return this._phase === 'battleEnd';
    };

    //=============================================================================
    // AudioManager
    //  高速化実行時にBGMのピッチを強制的に最大にします。
    //=============================================================================
    var _AudioManager_playBgm = AudioManager.playBgm;
    AudioManager.playBgm      = function(bgm, pos) {
        var originalPitch = bgm.pitch;
        if (SceneManager.isRapid()) arguments[0].pitch = 150;
        _AudioManager_playBgm.apply(this, arguments);
        this._currentBgm.pitch = originalPitch;
    };

    //=============================================================================
    // DataManager
    //  セーブデータのエンコード・デコードを実施します。
    //=============================================================================
    DataManager.decodeSaveGame = function(savefileId) {
        if (this.isThisGameFile(savefileId)) {
            var json = StorageManager.load(savefileId);
            StorageManager.saveToLocalFileJson(savefileId, json);
        } else {
            throw new Error('有効なセーブファイルが見付かりません。');
        }
    };

    DataManager.encodeSaveGame = function(savefileId) {
        var json = StorageManager.loadFromLocalFileJson(savefileId);
        if (json) {
            StorageManager.save(savefileId, json);
        } else {
            throw new Error('有効なセーブファイルが見付かりません。');
        }
    };

    //=============================================================================
    // StorageManager
    //  jsonセーブファイルの読み込みと書き込みを行います。
    //=============================================================================
    StorageManager.saveToLocalFileJson = function(savefileId, json) {
        var fs       = require('fs');
        var dirPath  = this.localFileDirectoryPath();
        var filePath = dirPath + 'file%1.json'.format(savefileId);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, json);
    };

    StorageManager.loadFromLocalFileJson = function(savefileId) {
        var json     = null;
        var fs       = require('fs');
        var filePath = this.localFileDirectoryPath() + 'file%1.json'.format(savefileId);
        if (fs.existsSync(filePath)) {
            json = fs.readFileSync(filePath, {encoding: 'utf8'});
        }
        return json;
    };

    //=============================================================================
    // Input
    //  alertを再定義してコンソール出力にします。
    //=============================================================================
    var _Input_wrapNwjsAlert = Input._wrapNwjsAlert;
    Input._wrapNwjsAlert     = function() {
        _Input_wrapNwjsAlert.apply(this, arguments);
        var _window_prompt = window.prompt;
        window.prompt      = function(value, defaultValue) {
            return SceneManager.getNwJs().prompt(value, defaultValue, _window_prompt);
        };
        window.alert       = function(value) {
            console.log(value);
            SceneManager.getNwJs().showDevTools();
        };
    };

    Input.functionReverseMapper = {
        F1 : 112,
        F2 : 113,
        F3 : 114,
        F4 : 115,
        F5 : 116,
        F6 : 117,
        F7 : 118,
        F8 : 119,
        F9 : 120,
        F10: 121,
        F11: 122,
        F12: 123
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

    var _Scene_Base_fadeSpeed      = Scene_Base.prototype.fadeSpeed;
    Scene_Base.prototype.fadeSpeed = function() {
        return SceneManager.isRapid() ? 1 : _Scene_Base_fadeSpeed.apply(this, arguments);
    };

    var _Scene_Base_startFadeIn      = Scene_Base.prototype.startFadeIn;
    Scene_Base.prototype.startFadeIn = function(duration, white) {
        if (SceneManager.isRapid()) arguments[0] = 1;
        _Scene_Base_startFadeIn.apply(this, arguments);
    };

    var _Scene_Base_startFadeOut      = Scene_Base.prototype.startFadeOut;
    Scene_Base.prototype.startFadeOut = function(duration, white) {
        if (SceneManager.isRapid()) arguments[0] = 1;
        _Scene_Base_startFadeOut.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Boot
    //  タイトル画面をとばしてマップ画面に遷移します。
    //=============================================================================
    var _Scene_Boot_start      = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments);
        if (paramRapidStart) SceneManager.toggleRapid();
        if (paramCutTitle && !Utils.isOptionValid('btest') && !Utils.isOptionValid('etest')) {
            return this.goToLatestContinue() || this.goToNewGame();
        }
    };

    Scene_Boot.prototype.goToNewGame = function() {
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    };

    Scene_Boot.prototype.goToLatestContinue = function() {
        if (DataManager.isAnySavefileExists()) {
            if (DataManager.loadGame(DataManager.latestSavefileId())) {
                this.reloadMapIfUpdated();
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
    Scene_Boot.prototype.reloadMapIfUpdated = Scene_Load.prototype.reloadMapIfUpdated;

    //=============================================================================
    // Scene_Map
    //  オンフォーカス時、ゲームが再保存されていればリロードする
    //=============================================================================
    var _Scene_Map_create      = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        _Scene_Map_create.apply(this, arguments);
        SceneManager.getNwJs().setOnFocus(false);
    };

    var _Scene_Map_update      = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        this.updateMapReload();
        if (this._dataSystemLoading) {
            if (DataManager.isDatabaseLoaded()) {
                this._dataSystemLoading = false;
                if (this._preVersionId !== $dataSystem.versionId) {
                    $gamePlayer.reserveTransfer(
                        $gameMap.mapId(), $gamePlayer.x, $gamePlayer.y, $gamePlayer.direction(), 2);
                    $gamePlayer._needsMapReload = true;
                }
            } else {
                return;
            }
        }
        _Scene_Map_update.apply(this, arguments);
    };

    Scene_Map.prototype.updateMapReload = function() {
        if (SceneManager.getNwJs().isOnFocus() && $gamePlayer.canMove()) {
            SceneManager.getNwJs().setOnFocus(false);
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

    var _Scene_Map_isFastForward      = Scene_Map.prototype.isFastForward;
    Scene_Map.prototype.isFastForward = function() {
        return _Scene_Map_isFastForward.apply(this, arguments) || SceneManager.isRapid();
    };

    var _Scene_Map_updateMainMultiply      = Scene_Map.prototype.updateMainMultiply;
    Scene_Map.prototype.updateMainMultiply = function() {
        _Scene_Map_updateMainMultiply.apply(this, arguments);
        if (this.isFastForward()) {
            for (var i = 2; i <= paramRapidSpeed; i++) {
                this.updateMain();
            }
        }
    };

    //=============================================================================
    // Window_Base
    //  ウィンドウの高速開閉を提供します。
    //=============================================================================
    var _Window_Base_updateOpen      = Window_Base.prototype.updateOpen;
    Window_Base.prototype.updateOpen = function() {
        if (SceneManager.isRapid() && this._opening) this.openness = 255;
        _Window_Base_updateOpen.apply(this, arguments);
    };

    var _Window_Base_updateClose      = Window_Base.prototype.updateClose;
    Window_Base.prototype.updateClose = function() {
        if (SceneManager.isRapid() && this._closing) this.openness = 0;
        _Window_Base_updateClose.apply(this, arguments);
    };

    //=============================================================================
    // Window_Message
    //  メッセージの高速化を提供します。
    //=============================================================================
    var _Window_Message_isTriggered      = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function() {
        return _Window_Message_isTriggered.apply(this, arguments) || SceneManager.isRapid();
    };

    var _Window_Message_startPause      = Window_Message.prototype.startPause;
    Window_Message.prototype.startPause = function() {
        _Window_Message_startPause.apply(this, arguments);
        if (SceneManager.isRapid()) this.startWait(1);
    };

    //=============================================================================
    // Controller_NwJs
    //  Nw.jsのAPI呼び出しを管理します。
    //=============================================================================
    function Controller_NwJs() {
        this.initialize.apply(this, arguments);
    }

    Controller_NwJs.prototype.constructor = Controller_NwJs;

    Controller_NwJs.prototype.initialize = function() {
        this._nwGui           = require('nw.gui');
        this._devTool         = null;
        this._devToolMinimize = false;
        this._onFocus         = false;
        this._menuBar         = this.getWindow().menu;
        this._menuClick       = null;
        this.initSetting();
    };

    Controller_NwJs.prototype.initSetting = function() {
        if (paramMenuBarVisible) this.addMenuItem(this._menuBar);
        this.initClickMenu();
        this.addEventListener();
        if (paramAlwaysOnTop) {
            this.setAlwaysOnTop(true);
        }
        switch (paramStartupDevTool) {
            case 'ON':
            case 'MINIMIZE':
                if (!DataManager.isEventTest()) this.showDevTools();
                break;
        }
        this.setMenuBar(this._menuBar);
    };

    Controller_NwJs.prototype.initClickMenu = function() {
        this._menuClick = new this._nwGui.Menu();
        this.addMenuItem(this._menuClick);
    };

    Controller_NwJs.prototype.setMenuBar = function(menu) {
        this.getWindow().menu = menu;
    };

    Controller_NwJs.prototype.addMenuItem = function(menu) {
        var gui = this._nwGui;
        this.sortDevCommands().forEach(function(commandInfo) {
            var menuItem   = new gui.MenuItem(
                {label: commandInfo.name + (commandInfo.key ? '(' + commandInfo.key + ')' : '')}
            );
            menuItem.click = function() {
                SceneManager.executeDevCommand(commandInfo.code);
            };
            menu.append(menuItem);
        });
    };

    Controller_NwJs.prototype.sortDevCommands = function() {
        return SceneManager.devCommands.sort(function(a, b) {
            if (a.key && b.key) {
                return Input.functionReverseMapper[a.key] - Input.functionReverseMapper[b.key];
            } else if (a.key || b.key) {
                return a.key ? -1 : 1;
            } else {
                return a.code - b.code;
            }
        });
    };

    Controller_NwJs.prototype.setOnFocus = function(value) {
        this._onFocus = value;
    };

    Controller_NwJs.prototype.isOnFocus = function() {
        return this._onFocus;
    };

    Controller_NwJs.prototype.addEventListener = function() {
        var currentWin = this.getWindow();
        currentWin.removeAllListeners();
        currentWin.on('focus', function() {
            this._onFocus = true;
        }.bind(this));
        document.addEventListener('mousedown', function(event) {
            if (event.button === paramClickMenu) {
                this._menuClick.popup(event.pageX, event.pageY);
            }
        }.bind(this));
    };

    Controller_NwJs.prototype.getWindow = function() {
        return this._nwGui.Window.get();
    };

    Controller_NwJs.prototype.getClipboard = function() {
        return this._nwGui.Clipboard.get();
    };

    Controller_NwJs.prototype.setAlwaysOnTop = function(value) {
        this.getWindow().setAlwaysOnTop(value);
    };

    Controller_NwJs.prototype.prompt = function(value, defaultValue, aliasPrompt) {
        var win = this.getWindow();
        if (paramAlwaysOnTop) {
            this._devTool.setAlwaysOnTop(false);
            win.setAlwaysOnTop(false);
        }
        var result = aliasPrompt.call(window, value, defaultValue);
        if (paramAlwaysOnTop) {
            this._devTool.setAlwaysOnTop(true);
            win.setAlwaysOnTop(true);
        }
        win.focus();
        Input.clear();
        return result;
    };

    Controller_NwJs.prototype.showDevTools = function() {
        if (!this.getWindow().isDevToolsOpen() || !this._devTool) {
            var devTool = this.getWindow().showDevTools();
            if (paramDevToolsPosition && paramDevToolsPosition.length >= 4) {
                devTool.moveTo(paramDevToolsPosition[0], paramDevToolsPosition[1]);
                devTool.resizeTo(paramDevToolsPosition[2], paramDevToolsPosition[3]);
            } else {
                devTool.moveTo(0, 0);
                devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
            }
            if (!this._devTool) {
                this.addEventListenerDevTools(devTool);
                this._devTool = devTool;
            }
        } else {
            this._devTool.restore();
        }
        this.focus();
    };

    Controller_NwJs.prototype.addEventListenerDevTools = function(devTool) {
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
            this._devTool.setAlwaysOnTop(paramAlwaysOnTop);
            this.setAlwaysOnTop(paramAlwaysOnTop);
            if (paramStartupDevTool === 'MINIMIZE') this._devTool.minimize();
        }.bind(this));
        devTool.on('closed', function() {
            this.getWindow().close();
        }.bind(this));
    };

    Controller_NwJs.prototype.toggleDevTools = function() {
        if (this._devTool) {
            this._devToolMinimize ? this._devTool.restore() : this._devTool.minimize();
            this.focus();
        } else {
            this.showDevTools(false);
        }
    };

    Controller_NwJs.prototype.closeDevTools = function() {
        if (this.getWindow().isDevToolsOpen()) this.getWindow().closeDevTools();
    };

    Controller_NwJs.prototype.moveEdge = function() {
        this.getWindow().moveTo(0, 0);
        if (this.getWindow().isDevToolsOpen()) this._devTool.minimize();
    };

    Controller_NwJs.prototype.focus = function() {
        this.getWindow().focus();
    };

    Controller_NwJs.prototype.readClipboard = function(mode) {
        if (!mode) mode = 'text';
        return this.getClipboard().get(mode);
    };

    Controller_NwJs.prototype.writeClipboard = function(copyValue, mode) {
        if (!mode) mode = 'text';
        if (mode === 'text') copyValue = copyValue.toString();
        this.getClipboard().set(copyValue, mode);
    };
})();
