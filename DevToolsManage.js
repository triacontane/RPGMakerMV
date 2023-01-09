//=============================================================================
// DevToolsManage.js
// ----------------------------------------------------------------------------
// (C)2020 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2023/01/08 タイトルカット時の動作をニューゲーム開始か最新データをロードかで選べるよう仕様変更
// 1.1.4 2022/04/30 EventRespawn.jsのリージョン機能で複製したイベントを消去してからマップリロード機能を使うとエラーになる問題に対処
// 1.1.3 2021/04/10 タイトルカット設定時にCTRLキーを押し続けているとカットしなくなる機能が不完全だったので無効化
// 1.1.2 2021/03/27 通常のロード時はイベントの消去状態を復元しないよう修正
// 1.1.1 2020/10/11 AnimationMv.jsと組み合わせたとき、戦闘テストの敵グループが正常に選択されない競合を修正
// 1.1.0 2020/09/26 プロジェクトフォルダを開くショートカットコマンドを追加
// 1.0.5 2020/09/13 戦闘強制勝利のコマンドが機能しない問題を修正
// 1.0.4 2020/08/21 マップの自動リロード機能を使おうとするとエラーになる問題を修正
// 1.0.3 2020/08/20 正式版のPluginCommonBaseで動作しなくなる問題を修正
// 1.0.2 2020/06/06 英語版のヘルプを整備
// 1.0.1 2020/04/20 ブレークポイント対策
// 1.0.0 2020/04/05 MV版から流用作成
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Development Support Plugin
 * @author triacontane
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DevToolsManage.js
 *
 * @param StartupDevTool
 * @text Boot on Launch
 * @desc Boots the developer tool simultaneously with game launch.
 * @default true
 * @type boolean
 *
 * @param ShortcutList
 * @text Shortcut List
 * @desc A list of usable shortcut functions.
 * @type struct<ShortcutFunction>[]
 *
 * @param ShowFPS
 * @text Show FPS
 * @desc By default, shows FPS in the upper left of the screen. (FPS/MS/OFF)
 * @default OFF
 * @type select
 * @option FPS
 * @option MS
 * @option OFF
 *
 * @param CutTitle
 * @text Title Skip
 * @desc Skips the title screen and loads the most recent save file.
 * Hold down CTRL on launch to disable skip.
 * @default false
 * @type boolean
 *
 * @param RapidStart
 * @text Start Rapid Mode
 * @desc Launches the game in a sped up state. (ON/OFF)
 * @default false
 * @type boolean
 *
 * @param RapidSpeed
 * @text Rapid Speed
 * @desc The playback speed when rapid mode is executed. Can be specified up to 16x.
 * @default 2
 * @type number
 * @max 16
 *
 * @param SlowSpeed
 * @text Slow Speed
 * @desc The playback speed (denominator) when slow mode is executed. Can be slowed to 1/16 speed.
 * @default 2
 * @type number
 * @max 16
 *
 * @param InvalidMessageSkip
 * @text Disable Message Skip
 * @desc Disables forced skipping of messages in rapid mode.
 * @default false
 * @type boolean
 *
 * @param MenuBarVisible
 * @text Display Menu Bar
 * @desc Display the menu bar and execute various debug commands.(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param ClickMenu
 * @text Click Menu
 * @desc Executes various debug commands from the click menu. (-1:Disable  0:Left  1:Wheel  2:Right)
 * @default 1
 * @type select
 * @option Disable
 * @value -1
 * @option Left
 * @value 0
 * @option Wheel
 * @value 1
 * @option Right
 * @value 2
 *
 * @param OutputStartupInfo
 * @text Info Output at Launch
 * @desc Outputs a log of various types of information on launch.
 * @default true
 * @type boolean
 *
 * @param StartupOnTop
 * @text Launch as Top Screen
 * @desc Locks the game screen as the forefront display on launch.
 * @default false
 * @type boolean
 *
 * @param UseReloadData
 * @text Use Reload Function
 * @desc Reloads map and data on focus. Please disable if it causes the program to have problems running due to competing processes.
 * @default true
 * @type boolean
 *
 * @help This is a creation support plugin that adjusts the behavior of the developer tool.
 * This plugin is only enabled for test plays in a local environment.
 * The following functions are provided to assist with smooth development.
 *
 * 1. The developer tool automatically opens on game launch.(Normally, F8 is used to launch.)
 *    Even when set to OFF, it will automatically open when an error occurs.
 *
 * 2. It will always display the game screen as the foremost window on screen. This is
 *    convenient when looking at other screens while working. You can switch modes from the menu bar in-game.
 *
 * 3. If you edit maps or events and resave, the map and database will be automatically
 *    reloaded the instant focus returns to the game screen.
 *
 * 4. Skip the title screen and load the most recent save file.
 *
 * 5. Increase or decrease game speed (16x maximum).
 *    Or, stop the game entirely.
 *    The game will return to normal speed only when making a selection in a window.
 *
 * 6. Force kill all enemies, allowing you to win. You will still receive battle rewards.
 *    You can also force a loss or abort a battle.
 *
 * 7. Execute optional scripts on every frame.
 *    Results are outputted to the console only when there is a variation in a script's return value.
 *
 * 8. Allow external battle tests via the editor.
 *    Please configure btest in the url options.
 *
 * This plugin is not a plugin command.
 *
 * User Agreement:
 *  You may alter or redistribute the plugin without permission. There are no restrictions on usage format
 *  (such as adult- or commercial-use only).
 *  This plugin is now all yours.
 */

/*~struct~ShortcutFunction:
 *
 * @param Command
 * @text Command
 * @desc Details of the command you wish to execute.
 * @default
 * @type select
 * @option Display at forefront
 * @value AlwaysOnTop
 * @option Freeze screen
 * @value Freeze
 * @option Resident script
 * @value ExecuteScript
 * @option Abort battle
 * @value ForceAbort
 * @option Lose battle
 * @value ForceDefeat
 * @option Win battle
 * @value ForceVictory
 * @option Rapid mode
 * @value ToggleRapid
 * @option Slow mode
 * @value ToggleSlow
 * @option Open project
 * @value OpenProject
 *
 * @param HotKey
 * @text Hotkey
 * @desc Hotkey for executing commands.
 * @default
 * @type select
 * @option
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param Alt
 * @text Hold ALT key simultaneously
 * @desc Enabled only when ALT key is held simultaneously
 * @type boolean
 * @default false
 *
 * @param Ctrl
 * @text Hold CTRL key simultaneously
 * @desc Enabled only when CTRL key is held simultaneously
 * @type boolean
 * @default false
 *
 */

/*:ja
 * @plugindesc 開発支援プラグイン
 * @author トリアコンタン
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DevToolsManage.js
 *
 * @param StartupDevTool
 * @text 開始時に起動
 * @desc ゲーム開始時に同時にデベロッパツールを起動します。
 * @default true
 * @type boolean
 *
 * @param ShortcutList
 * @text ショートカット一覧
 * @desc 利用するショートカット機能の一覧です。
 * @type struct<ShortcutFunction>[]
 *
 * @param ShowFPS
 * @text FPS表示
 * @desc 初期状態で画面左上にFPSを表示します。（FPS/MS/OFF）
 * @default OFF
 * @type select
 * @option FPS
 * @option MS
 * @option OFF
 *
 * @param CutTitle
 * @text タイトルカット
 * @desc タイトル画面をとばしてゲームを開始します。
 * @default 0
 * @type select
 * @option 無効
 * @value 0
 * @option ニューゲーム開始
 * @value 1
 * @option 最新データをロード
 * @value 2
 *
 * @param RapidStart
 * @text 高速開始
 * @desc 高速化された状態でゲームを開始します。（ON/OFF）
 * @default false
 * @type boolean
 *
 * @param RapidSpeed
 * @text 高速化倍率
 * @desc 高速化を実行した際の再生倍率です。16倍速まで指定できます。
 * @default 2
 * @type number
 * @max 16
 *
 * @param SlowSpeed
 * @text 低速化倍率
 * @desc 低速化を実行した際の再生倍率(分母)です。1/16倍速まで指定できます。
 * @default 2
 * @type number
 * @max 16
 *
 * @param InvalidMessageSkip
 * @text メッセージスキップ無効
 * @desc 高速化された状態でのメッセージ強制スキップを無効にします。
 * @default false
 * @type boolean
 *
 * @param MenuBarVisible
 * @text メニューバー表示
 * @desc メニューバーを表示し各種デバッグコマンドを実行できます。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param ClickMenu
 * @text クリックメニュー
 * @desc クリックメニューから各種デバッグコマンドを実行できます。(-1:無効 0:左 1:ホイール 2:右)
 * @default 1
 * @type select
 * @option 無効
 * @value -1
 * @option 左
 * @value 0
 * @option ホイール
 * @value 1
 * @option 右
 * @value 2
 *
 * @param OutputStartupInfo
 * @text 起動時情報出力
 * @desc 起動時に様々な情報をログ出力します。
 * @default true
 * @type boolean
 *
 * @param StartupOnTop
 * @text 最前面で起動
 * @desc 起動時にゲーム画面が最前面に固定されます。
 * @default false
 * @type boolean
 *
 * @param UseReloadData
 * @text リロード機能を使う
 * @desc オンフォーカスでマップとデータを再読込します。競合等で動作に問題がある場合は無効にしてください。
 * @default true
 * @type boolean
 *
 * @help デベロッパツールの挙動を調整する制作支援プラグインです。
 * このプラグインはローカル環境でのテストプレー時のみ有効となります。
 * 快適な開発支援のために以下の機能を提供します。
 *
 * 1. ゲーム開始時にデベロッパツールが自動で立ち上がります。(通常はF8で起動)
 *    OFFにしていた場合でもエラーが発生すると自動で立ち上がります。
 *
 * 2. ゲーム画面を常に最前面に表示してくれます。画面を見ながら作業をする場合に
 *    便利です。ゲーム中にメニューバーから切り替えできます。
 *
 * 3. マップやイベントを修正して再保存すると、ゲーム画面にフォーカスを戻した
 *    瞬間にマップとデータベースを自動でリロードしてくれます。
 *
 * 4. タイトル画面を飛ばして最新のセーブファイルをロードできます。
 *
 * 5. ゲームのスピードを高速化、もしくは低速化(16倍速まで)できます。
 *    また、完全に止めてしまうこともできます。
 *    ウィンドウ項目を選択中の間だけは通常スピードになります。
 *
 * 6. 強制的に敵を全滅させて勝利することができます。報酬も取得できます。
 *    強制敗北、強制中断も可能です。
 *
 * 7. 任意のスクリプトを毎フレーム実行させることができます。
 *    スクリプトの戻り値が変化したときのみ結果をコンソールに出力します。
 *
 * 8. エディタ経由で外部から戦闘テスト可能にします。
 *    urlオプションにbtestと設定してください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~ShortcutFunction:
 *
 * @param Command
 * @text コマンド内容
 * @desc 実行したいコマンドの内容です。
 * @default
 * @type select
 * @option 最前面に表示
 * @value AlwaysOnTop
 * @option 画面フリーズ
 * @value Freeze
 * @option 常駐スクリプト
 * @value ExecuteScript
 * @option 戦闘中断
 * @value ForceAbort
 * @option 戦闘敗北
 * @value ForceDefeat
 * @option 戦闘勝利
 * @value ForceVictory
 * @option 高速化
 * @value ToggleRapid
 * @option 低速化
 * @value ToggleSlow
 * @option プロジェクトを開く
 * @value OpenProject
 *
 * @param HotKey
 * @text ホットキー
 * @desc コマンドを実行するためのホットキーです。
 * @default
 * @type select
 * @option
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param Alt
 * @text ALTキー同時押し
 * @desc 有効にするとALTキーと同時押しした場合のみ実行します。
 * @type boolean
 * @default false
 *
 * @param Ctrl
 * @text CTRLキー同時押し
 * @desc 有効にするとCTRLキーと同時押しした場合のみ実行します。
 * @type boolean
 * @default false
 *
 */

/**
 * Controller_NwJs
 * NW.jsのウィンドウを操作します。
 * @constructor
 */
function Controller_NwJs() {
    this.initialize.apply(this, arguments);
}

(() => {
    'use strict';
    const script = document.currentScript;
    const param  = PluginManagerEx.createParameter(script);
    if (!param.ShortcutList) {
        param.ShortcutList = [];
    }

    //=============================================================================
    // Graphics
    //  FPSの表示を設定します。
    //=============================================================================
    Graphics.setFPSMeter = function(type) {
        switch (type) {
            case 'FPS':
                this._switchFPSCounter();
                break;
            case 'MS':
                this._switchFPSCounter();
                this._switchFPSCounter();
                break;
        }
    };

    const _Graphics__createAllElements = Graphics._createAllElements;
    Graphics._createAllElements        = function() {
        _Graphics__createAllElements.apply(this, arguments);
        if (param.OutputStartupInfo) {
            this.outputStartUpLog();
        }
        if (this._createDevToolInfo) {
            this._createDevToolInfo();
        }
    };

    Graphics.outputStartUpLog = function() {
        console.log('********************************');
        console.log('***   Core Version           ***');
        console.log('********************************');
        console.log('RPG Maker Name    : ' + Utils.RPGMAKER_NAME);
        console.log('RPG Maker Version : ' + Utils.RPGMAKER_VERSION);
        console.log('RPG Maker Engine  : ' + (Utils.RPGMAKER_ENGINE || 'Official Version'));
        console.log('********************************');
        console.log('***   User Agent             ***');
        console.log('********************************');
        console.log(navigator.userAgent);
    };

    // テストプレー時以外は以降の機能を無効
    if (!Utils.isOptionValid('test') && !DataManager.isBattleTest()) {
        console.log(PluginManagerEx.findPluginName(script) + ' is valid only test play!');
        return;
    }

    Graphics._createDevToolInfo = function() {
        const div            = document.createElement('div');
        div.id               = 'devTool';
        div.style.display    = 'none';
        div.style.position   = 'absolute';
        div.style.left       = '100px';
        div.style.top        = '5px';
        div.style.background = '#222';
        div.style.opacity    = '0.8';
        div.style['z-index'] = '8';
        div.style.color      = '#fff';
        this._devToolDiv     = div;
        document.body.appendChild(div);
    };

    Graphics.drawDevToolInfo = function(text) {
        if (text) {
            this._devToolDiv.style.display = 'block';
            this._devToolDiv.textContent   = text;
        } else {
            this._devToolDiv.style.display = 'none';
        }
    };

    const _Graphics__onTick = Graphics._onTick;
    Graphics._onTick = function(deltaTime) {
        // for break point
        if (deltaTime >= 6) {
            Input.clear();
            TouchInput.clear();
        }
        _Graphics__onTick.apply(this, arguments);
    };

    //=============================================================================
    // SceneManager
    //  状況に応じてデベロッパツールを自動制御します。
    //=============================================================================
    const _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize        = function() {
        _SceneManager_initialize.apply(this, arguments);
        this.initDevCommand();
        Graphics.setFPSMeter(param.ShowFPS);
        if (!Utils.isNwjs()) {
            return;
        }
        this._freeze   = false;
        this._nwWindow = new GameNwWindow();
        if (param.StartupOnTop || Utils.isOptionValid('onTop')) {
            this.setInitAlwaysOnTop();
        }
    };

    SceneManager.setInitAlwaysOnTop = function() {
        const shortCut = this.findShortCut('AlwaysOnTop');
        if (shortCut) {
            shortCut.execute();
        } else {
            this._nwWindow.toggleAlwaysOnTop();
        }
    };

    SceneManager.setInitRapid = function() {
        const shortCut = this.findShortCut('ToggleRapid');
        if (shortCut) {
            shortCut.execute();
        } else {
            this.toggleRapid();
        }
    };

    SceneManager.findShortCut = function(id) {
        return this._commandList.filter(command => command.isTypeEqual(id))[0];
    };

    SceneManager.initDevCommand = function() {
        const commandList = param.ShortcutList.map(item => {
            return new ShortCutCommand(item, item.Command);
        });
        if (SceneManager.takeCapture) {
            commandList.push(new ShortCutCommand(null, 'Capture'));
        }
        if (SceneManager.onKeyDownForScreenMovie) {
            commandList.push(new ShortCutCommand(null, 'Record'));
        }
        this._commandList = commandList;
    };

    SceneManager.iterateCommandList = function(callBack) {
        this._commandList.forEach(command => callBack(command));
    };

    SceneManager.getNwWindow = function() {
        return this._nwWindow;
    };

    SceneManager.toggleAlwaysOnTop = function() {
        this._nwWindow.toggleAlwaysOnTop();
        this.drawDevToolInfo();
        return this._nwWindow.isOnTop();
    };

    SceneManager.toggleFreeze = function() {
        Input.clear();
        this._freeze = !this._freeze;
        this.drawDevToolInfo();
        return this._freeze;
    };

    SceneManager.toggleRapid = function() {
        if (!this.isSlow()) {
            this._rapid = !this._rapid;
            this.drawDevToolInfo();
        }
        return this._rapid;
    };

    SceneManager.toggleSlow = function() {
        if (!this.isRapid()) {
            this._slow = !this._slow;
            this.drawDevToolInfo();
        }
        return this._slow;
    };

    SceneManager.openProject = function() {
        this._nwWindow.openProject();
    };

    SceneManager.drawDevToolInfo = function() {
        let text = '';
        if (this._nwWindow.isOnTop()) {
            text += 'Always on top [ON] ';
        }
        if (this._freeze) {
            text += 'Freeze [ON] ';
        }
        if (this.isRapid()) {
            text += 'Rapid [ON] ';
        } else if (this.isSlow()) {
            text += 'Slow [ON] ';
        }
        Graphics.drawDevToolInfo(text);
    };

    const _SceneManager_catchException = SceneManager.catchException;
    SceneManager.catchException        = function(e) {
        if (this._nwWindow) this._nwWindow.showDevTools(false);
        _SceneManager_catchException.apply(this, arguments);
    };

    const _SceneManager_onError = SceneManager.onError;
    SceneManager.onError        = function(e) {
        if (this._nwWindow) this._nwWindow.showDevTools(false);
        _SceneManager_onError.apply(this, arguments);
    };

    const _SceneManager_onKeyDown = SceneManager.onKeyDown;
    SceneManager.onKeyDown        = function(event) {
        _SceneManager_onKeyDown.apply(this, arguments);
        this.onKeyDownForDevToolManage(event);
    };

    SceneManager.onKeyDownForDevToolManage = function(event) {
        this.iterateCommandList(command => command.onKeyDown(event));
    };

    SceneManager.isRapid = function() {
        return !!this._rapid;
    };

    SceneManager.isSlow = function() {
        return !!this._slow;
    };

    const _SceneManager_initNwjs = SceneManager.initNwjs;
    SceneManager.initNwjs        = function() {
        _SceneManager_initNwjs.apply(this, arguments);
        if (Utils.isNwjs()) {
            this.addMenuBar();
        }
    };

    SceneManager.addMenuBar = function() {
        if (!param.MenuBarVisible) {
            this._needAdjustScreen = false;
            return;
        }
        const gameWindow = nw.Window.get();
        if (!gameWindow.menu || gameWindow.menu.type !== 'menubar') {
            this._needAdjustScreen = true;
        }
        gameWindow.menu = new nw.Menu({type: 'menubar'});
    };

    const _SceneManager_run = SceneManager.run;
    SceneManager.run        = function(sceneClass) {
        _SceneManager_run.apply(this, arguments);
        this.setWindowSizeForMenuBar();
    };

    SceneManager.setWindowSizeForMenuBar = function() {
        if (!this._needAdjustScreen) {
            return;
        }
        const gameWindow = nw.Window.get();
        setTimeout(() => { // Fix missing menu bar height
            const style_height = parseInt(Graphics._canvas.style.height, 10);
            const height_diff  = SceneManager._screenHeight - style_height;
            if (height_diff !== 0) {
                gameWindow.moveBy(0, -height_diff);
                gameWindow.resizeBy(0, height_diff);
            }
        }, 100);
    };

    SceneManager._slowCounter = 0.0;
    const _SceneManager_determineRepeatNumber = SceneManager.determineRepeatNumber;
    SceneManager.determineRepeatNumber = function(deltaTime) {
        const result = _SceneManager_determineRepeatNumber.apply(this, arguments);
        if (this._scene && this._scene.isAnyWindowActive()) {
            return result;
        }
        if (this.isSlow() && result >= 1 && this._slowCounter < 1.0) {
            this._slowCounter += (1 / param.SlowSpeed);
            return 0;
        } else {
            this._slowCounter = 0.0;
            if (this.isRapid()) {
                return result * param.RapidSpeed;
            } else {
                return result;
            }
        }
    };

    const _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene        = function() {
        this.updateScript();
        if (this.isUseReload()) {
            this.updateDataReload();
        }
        if (this._freeze || this.isReloading()) {
            return;
        }
        _SceneManager_updateScene.apply(this, arguments);
    };

    SceneManager.isUseReload = function() {
        return param.UseReloadData && !DataManager.isBattleTest() &&
            !DataManager.isEventTest() && Utils.isNwjs();
    };

    SceneManager.updateScript = function() {
        this.iterateCommandList(command => command.updateScriptIfNeed());
    };

    SceneManager.updateDataReload = function() {
        if (this.getNwWindow().isOnFocus() && !this._reloadGenerator) {
            this._reloadGenerator = this.reloadGenerator();
        }
        if (this._reloadGenerator && DataManager.isDatabaseLoaded()) {
            if (!this._reloadGenerator.next().value) {
                this._reloadGenerator = null;
                // Resolve conflict for DynamicDatabase.js
                if (typeof DynamicDatabaseManager !== 'undefined') {
                    DynamicDatabaseManager.makeDynamicDatabase();
                }
            }
        }
    };

    SceneManager.reloadGenerator = function* () {
        this._preVersionId = $dataSystem.versionId;
        DataManager.reloadSystemData();
        yield true;
        if (this._preVersionId !== $dataSystem.versionId) {
            this.reloadMapData();
            DataManager.loadDatabase();
            console.log('Database Reload');
            yield true;
        }
        return false;
    };

    SceneManager.reloadMapData = function() {
        if (this._scene instanceof Scene_Map && $gamePlayer.canMove()) {
            $gamePlayer.reserveTransfer(
                $gameMap.mapId(), $gamePlayer.x, $gamePlayer.y, $gamePlayer.direction(), 2);
            $gamePlayer.requestMapReload();
            console.log('Map Reload');
        }
    };

    SceneManager.isReloading = function() {
        return !!this._reloadGenerator;
    };

    SceneManager.isCurrentScene = function(sceneClass) {
        return this._scene && this._scene.constructor === sceneClass;
    };

    class ShortCutCommand {
        constructor(shortcut, id) {
            const commands = {
                AlwaysOnTop  : {name: '最前面に表示', type: 'checkbox'},
                ToggleRapid  : {name: '高速化', type: 'checkbox'},
                ToggleSlow   : {name: '低速化', type: 'checkbox'},
                ForceVictory : {name: '強制勝利', type: 'normal'},
                ExecuteScript: {name: '常駐スクリプト', type: 'normal'},
                Freeze       : {name: '画面フリーズ', type: 'checkbox'},
                ForceDefeat  : {name: '強制敗北', type: 'normal'},
                ForceAbort   : {name: '強制中断', type: 'normal'},
                OpenProject  : {name: 'プロジェクトを開く', type: 'normal'},
                Capture      : {name: 'キャプチャ', type: 'normal'},
                Record       : {name: '録画', type: 'normal'}
            };
            this._command  = commands[id];
            this._id       = id;
            this._shortcut = shortcut;
        }

        isTypeEqual(id) {
            return this._id === id;
        }

        onKeyDown(event) {
            if (!this._shortcut) {
                return;
            } else if (event.key !== this._shortcut.HotKey) {
                return;
            } else if (event.ctrlKey !== this._shortcut.Ctrl) {
                return;
            } else if (event.altKey !== this._shortcut.Alt) {
                return;
            }
            this.execute();
        }

        createHotKeyText() {
            if (!this._shortcut || !this._shortcut.HotKey) {
                return '';
            } else {
                const ctrl = this._shortcut.Ctrl ? 'Ctrl+' : '';
                const alt  = this._shortcut.Alt ? 'Alt+' : '';
                return `(${ctrl}${alt}${this._shortcut.HotKey})`;
            }
        }

        appendNwMenu(menuObject) {
            const menuItem = new nw.MenuItem({
                label: this._command.name + this.createHotKeyText(),
                type : this._command.type,
            });
            if (menuObject.type === 'contextmenu') {
                this._contextMenu = menuItem;
            }
            menuItem.click = this.execute.bind(this, true);
            menuObject.append(menuItem);
        }

        execute(fromClick = false) {
            const result = this[`execute${this._id}`]();
            if (fromClick) {
                SoundManager.playCursor();
            }
            this.setCheck(result);
        }

        setCheck(value) {
            if (this._command.type === 'checkbox' && this._contextMenu) {
                this._contextMenu.checked = value;
            }
        }

        executeAlwaysOnTop() {
            return SceneManager.toggleAlwaysOnTop();
        }

        executeToggleRapid() {
            return SceneManager.toggleRapid();
        }

        executeToggleSlow() {
            return SceneManager.toggleSlow();
        }

        executeFreeze() {
            return SceneManager.toggleFreeze();
        }

        executeForceVictory() {
            BattleManager.forceVictory();
        }

        executeForceDefeat() {
            BattleManager.forceDefect();
        }

        executeForceAbort() {
            BattleManager.forceAbort();
        }

        executeOpenProject() {
            SceneManager.openProject();
        }

        executeCapture() {
            SceneManager.takeCapture();
        }

        executeRecord() {
            return SceneManager._screenRecorder.toggle();
        }

        executeExecuteScript() {
            const promptValue  = '常駐実行したいスクリプトを入力してください。';
            const nwWindow     = SceneManager.getNwWindow();
            const scriptString = window.prompt(promptValue, nwWindow.readClipboard());
            if (scriptString !== null && scriptString !== '') {
                nwWindow.showDevTools();
                nwWindow.writeClipboard(scriptString);
                this.updateScript(scriptString);
                this._lastScriptString = scriptString;
            }
        }

        updateScript(scriptString) {
            let result = null;
            try {
                result = eval(scriptString);
                if (!this._lastScriptString) {
                    SoundManager.playOk();
                    console.log('Execute Script : ' + scriptString);
                }
            } catch (e) {
                if (!this._lastScriptString) {
                    SoundManager.playBuzzer();
                    console.log('Error Script : ' + scriptString);
                    console.error(e.stack);
                }
                result = e.toString();
            }
            if (!this._lastScriptString || result !== this._lastScriptResult) {
                console.log(result);
            }
            this._lastScriptResult = result;
        }

        updateScriptIfNeed() {
            if (this._lastScriptString) {
                this.updateScript(this._lastScriptString);
            }
        }
    }

    //=============================================================================
    // BattleManager
    //  強制勝利を追加定義します。
    //=============================================================================
    BattleManager.forceVictory = function() {
        if (this.canExecuteBattleEndProcess()) {
            $gameTroop.members().forEach(function(enemy) {
                enemy.addNewState(enemy.deathStateId());
            });
            this.processVictory();
        }
    };

    BattleManager.forceDefect = function() {
        if (this.canExecuteBattleEndProcess()) {
            $gameParty.members().forEach(function(actor) {
                actor.addNewState(actor.deathStateId());
            });
            this.processDefeat();
        }
    };

    BattleManager.forceAbort = function() {
        if (this.canExecuteBattleEndProcess()) {
            $gameParty.performEscape();
            SoundManager.playEscape();
            this.displayEscapeSuccessMessage();
            this._escaped = true;
            this.processAbort();
        }
    };

    BattleManager.canExecuteBattleEndProcess = function() {
        return SceneManager.isCurrentScene(Scene_Battle) && this._phase !== 'battleEnd';
    };

    //=============================================================================
    // DataManager
    //  外部エディタから戦闘テストの実行を可能にします。
    //=============================================================================
    const _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase        = function() {
        if (this.isNeedSuppressBtest()) {
            this._suppressBattleTest = true;
        }
        _DataManager_loadDatabase.apply(this, arguments);
        this._suppressBattleTest = false;
    };

    const _DataManager_isBattleTest = DataManager.isBattleTest;
    DataManager.isBattleTest        = function() {
        return this._suppressBattleTest ? false : _DataManager_isBattleTest.apply(this, arguments);
    };

    DataManager.isNeedSuppressBtest = function() {
        if (!this.isBattleTest()) {
            return false;
        }
        if (Utils.isNwjs()) {
            return this._databaseFiles.every(function(databaseFile) {
                return !StorageManager.isExistTestData(databaseFile.src);
            });
        } else {
            return true;
        }
    };

    DataManager.reloadSystemData = function() {
        const data = this._databaseFiles.filter(file => file.name === '$dataSystem')[0];
        this.loadDataFile(data.name, data.src);
    };

    StorageManager.isExistTestData = function(fileName) {
        const fs       = require('fs');
        const path     = require('path');
        const filePath = path.join(path.dirname(process.mainModule.filename), 'data/Test_' + fileName);
        return fs.existsSync(filePath);
    };

    Scene_Base.prototype.isAnyWindowActive = function() {
        if (this._windowLayer) {
            return this._windowLayer.children.some(win => {
                return win instanceof Window_Selectable && win.active;
            });
        } else {
            return false;
        }
    };

    //=============================================================================
    // Scene_Boot
    //  タイトル画面をとばしてマップ画面に遷移します。
    //=============================================================================
    const _Scene_Boot_start    = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments);
        if (param.RapidStart) {
            SceneManager.setInitRapid();
        }
        this.cutSceneTitle();
    };

    Scene_Boot.prototype.cutSceneTitle = function() {
        if (DataManager.isBattleTest() || DataManager.isEventTest()) {
            return;
        }
        switch (param.CutTitle) {
            case 1:
                this.goToNewGame();
                break;
            case 2:
                const result = this.goToLatestContinue();
                if (!result) {
                    this.goToNewGame();
                }
                break;
        }
    };

    Scene_Boot.prototype.goToNewGame = function() {
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    };

    Scene_Boot.prototype.goToLatestContinue = function() {
        if (DataManager.isAnySavefileExists()) {
            DataManager.loadGame(DataManager.latestSavefileId()).then(() => {
                SceneManager.goto(Scene_Map);
                $gameSystem.onAfterLoad();
            });
            return true;
        } else {
            return false;
        }
    };
    Scene_Boot.prototype.reloadMapIfUpdated = Scene_Load.prototype.reloadMapIfUpdated;

    const _Scene_Load_reloadMapIfUpdated = Scene_Load.prototype.reloadMapIfUpdated;
    Scene_Load.prototype.reloadMapIfUpdated = function() {
        _Scene_Load_reloadMapIfUpdated.apply(this, arguments);
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
            $gameMap.clearEventErase();
        }
    };

    //=============================================================================
    // Window_Message
    //  メッセージの高速化を提供します。
    //=============================================================================
    if (!param.InvalidMessageSkip) {
        const _Window_Message_isTriggered    = Window_Message.prototype.isTriggered;
        Window_Message.prototype.isTriggered = function() {
            return _Window_Message_isTriggered.apply(this, arguments) || SceneManager.isRapid();
        };

        const _Window_Message_startPause    = Window_Message.prototype.startPause;
        Window_Message.prototype.startPause = function() {
            _Window_Message_startPause.apply(this, arguments);
            if (SceneManager.isRapid()) {
                this.startWait(1);
            }
        };
    }

    const _Game_Map_eraseEvent    = Game_Map.prototype.eraseEvent;
    Game_Map.prototype.eraseEvent = function(eventId) {
        _Game_Map_eraseEvent.apply(this, arguments);
        this._eraseEvents.push(eventId);
    };

    const _Game_Map_setupEvents    = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function() {
        _Game_Map_setupEvents.apply(this, arguments);
        if (this._eraseEvents && $gamePlayer.isNeedMapReload()) {
            this.restoreEventErase();
        } else {
            this.clearEventErase();
        }
    };

    Game_Map.prototype.restoreEventErase = function() {
        this._eraseEvents.forEach(eventId => {
            if (this._events[eventId]) {
                this._events[eventId].erase();
            }
        });
    };

    Game_Map.prototype.clearEventErase = function() {
        this._eraseEvents = [];
    };

    Game_Player.prototype.isNeedMapReload = function() {
        return this._needsMapReload;
    };

    //=============================================================================
    // Controller_NwJs
    //  Nw.jsのAPI呼び出しを管理します。
    //=============================================================================
    class GameNwWindow {
        constructor() {
            this._onFocus   = false;
            this._menuBar   = new nw.Menu({type: 'menubar'});
            this._menuClick = null;
            this._onTop     = false;
            this.initSetting();
        }

        initSetting() {
            this.addEventListener();
            if (param.MenuBarVisible) {
                this.makeMenu(this._menuBar);
                this.setMenuBar(this._menuBar);
            }
            this.initClickMenu();
            if (this.isStartUpDevTool()) {
                this.showDevTools();
            }
        }

        isStartUpDevTool() {
            return param.StartupDevTool && !Utils.isOptionValid('devToolOff');
        }

        openProject() {
            const exec = require('child_process').exec;
            const path = require('path');
            const projectPath = path.dirname(process.mainModule.filename);
            if (process.platform === 'win32') {
                exec('rundll32.exe url.dll,FileProtocolHandler  "' + projectPath + '"');
            } else {
                exec('open "' + projectPath + '"');
            }
        }

        initClickMenu() {
            this._menuClick = new nw.Menu();
            this.makeMenu(this._menuClick);
        }

        makeMenu(menuObject) {
            SceneManager.iterateCommandList(command => command.appendNwMenu(menuObject));
        }

        setMenuBar(menu) {
            this.getWindow().menu = menu;
        }

        isOnFocus() {
            const focus   = this._onFocus;
            this._onFocus = false;
            return focus;
        }

        addEventListener() {
            document.addEventListener('mousedown', function(event) {
                if (event.button === param.ClickMenu) {
                    this._menuClick.popup(event.pageX, event.pageY);
                }
            }.bind(this));
            const currentWin = this.getWindow();
            currentWin.removeAllListeners();
            currentWin.on('focus', () => {
                this._onFocus = true;
            });
        }

        getWindow() {
            return nw.Window.get();
        }

        getClipboard() {
            return nw.Clipboard.get();
        }

        toggleAlwaysOnTop() {
            this._onTop = !this._onTop;
            this.getWindow().setAlwaysOnTop(this._onTop);
            return this._onTop;
        }

        isOnTop() {
            return this._onTop;
        }

        showDevTools() {
            this.getWindow().showDevTools();
            setTimeout(() => {
                this.getWindow().focus();
            }, 1000);
        }

        readClipboard() {
            return this.getClipboard().get('text');
        }

        writeClipboard(copyValue) {
            this.getClipboard().set(copyValue, 'text');
        }
    }
})();
