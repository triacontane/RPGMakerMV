//=============================================================================
// StartUpFullScreen.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.6.1 2023/08/05 ElectronForMz.jsとの順序を定義するアノテーションを追加
// 1.6.0 2023/07/23 オプション変更時にフルスクリーン状態を即時反映させる機能を追加
// 1.5.0 2023/06/01 ElectronForMz.jsに対応
// 1.4.0 2023/05/01 デフォルトでフルスクリーン起動できるパラメータを追加
// 1.3.0 2022/09/09 ゲーム終了画面にもシャットダウン項目を追加できる機能を追加
// 1.2.0 2021/12/30 イベントテスト実行時は全画面化を無効にするよう仕様変更
// 1.1.0 2021/11/04 MZで動作するよう修正
// 1.0.3 2019/01/14 1.0.3でコアスクリプトv1.6.1以前で逆に動作しなくなっていた問題を修正
// 1.0.2 2019/01/14 コアスクリプトv1.6.1以降で正常に動作していなかった問題を修正
// 1.0.1 2018/06/30 タイトルコマンドウィンドウのY座標整数になっていなかった問題を修正
// 1.0.0 2016/03/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Full Screen Startup
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StartUpFullScreen.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @orderAfter ElectronForMz
 * @author triacontane
 *
 * @param Shutdown
 * @text Shutdown
 * @desc The name of the shutdown item to be added to the title screen.
 * It is displayed only when running in the local environment.
 * @default Shutdown
 *
 * @param DefaultFullScreen
 * @text Starts up in full screen by default
 * @desc If enabled, it will start full screen by default.
 * @default false
 * @type boolean
 *
 * @param Immediate
 * @text immediate reflection
 * @desc If enabled, the full screen state will be changed on the fly when the startup options are changed in the options.
 * @default false
 * @type boolean
 *
 * @param StartUpFullScreen
 * @text full screen startup
 * @desc The name of the item to be activated in all screens to be added to the options screen.
 * It is displayed only when running in the local environment.
 * @default Full Screen Startup
 *
 * @param UseGameEnd
 * @text Added to Game End command
 * @desc Add a shutdown item to the "Game End" command.
 * @default true
 * @type boolean
 *
 * @help StartUpFullScreen.js
 *
 * Add "Full Screen Startup" to the options screen.
 * If enabled, the game will launch in full screen.
 * Also add "Shutdown" to the title screen.
 *
 * This plugin is only valid when run in a local environment.
 * When the event test is executed, tempo is prioritized and full-screening is disabled.
 *
 * You need the base plugin "PluginCommonBase.js" to use this plugin.
 * The "PluginCommonBase.js" is stored in the following folder under the installation folder of RPG Maker MZ.
 * dlc/BasicResources/plugins/official
 *
 * User Agreement:
 *  You may alter or redistribute the plugin without permission. There are no restrictions on usage format
 *  (such as adult- or commercial-use only).
 *  This plugin is now all yours.
 */

/*:ja
 * @plugindesc フルスクリーンで起動プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StartUpFullScreen.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @orderAfter ElectronForMz
 * @author トリアコンタン
 *
 * @param Shutdown
 * @text シャットダウン
 * @desc タイトル画面に追加するシャットダウンの項目名です。
 * ローカル環境での実行時のみ表示されます。
 * @default シャットダウン
 *
 * @param DefaultFullScreen
 * @text デフォルトでフルスクリーン
 * @desc 有効にするとデフォルトでフルスクリーン起動します。
 * @default false
 * @type boolean
 *
 * @param Immediate
 * @text 即時反映
 * @desc 有効にするとオプションで起動オプションを変更したときに、その場でフルスクリーン状態が変更されます。
 * @default false
 * @type boolean
 *
 * @param StartUpFullScreen
 * @text フルスクリーンで起動
 * @desc オプション画面に追加する全画面で起動の項目名です。
 * ローカル環境での実行時のみ表示されます。
 * @default フルスクリーンで起動
 *
 * @param UseGameEnd
 * @text ゲーム終了画面に追加
 * @desc ゲーム終了画面にシャットダウンの項目を追加します。
 * @default true
 * @type boolean
 *
 * @help StartUpFullScreen.js
 *
 * オプション画面に「フルスクリーンで起動」を追加します。
 * 有効な場合、ゲームをフルスクリーンで起動します。
 * またタイトル画面にシャットダウンを追加します。
 *
 * このプラグインはローカル環境で実行した場合のみ有効です。
 * イベントテスト実行時はテンポを優先し全画面化は無効となります。
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

function Scene_Terminate() {
    this.initialize.apply(this, arguments);
}

(()=> {
    'use strict';

    if (!Utils.isElectron) {
        Utils.isElectron = function() {
            return false;
        }
    }

    // Nw.jsおよびElectron環境下以外では一切の機能を無効
    if (!Utils.isNwjs() && !Utils.isElectron()) {
        return;
    }

    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Graphics
    //  privateメソッド「_requestFullScreen」を呼び出します。
    //=============================================================================
    const _Graphics__requestFullScreen = Graphics._requestFullScreen;
    Graphics._requestFullScreen = function() {
        if (Utils.isElectron()) {
            window.electronAPI.fullScreen(true);
            this._fullScreenForElectron = true;
        } else {
            _Graphics__requestFullScreen.apply(this, arguments);
        }
    };

    const _Graphics__cancelFullScreen = Graphics._cancelFullScreen;
    Graphics._cancelFullScreen = function() {
        if (Utils.isElectron()) {
            window.electronAPI.fullScreen(false);
            this._fullScreenForElectron = false;
        } else {
            _Graphics__cancelFullScreen.apply(this, arguments);
        }
    };

    const _Graphics__isFullScreen = Graphics._isFullScreen;
    Graphics._isFullScreen = function() {
        if (Utils.isElectron()) {
            return this._fullScreenForElectron;
        } else {
            return _Graphics__isFullScreen.apply(this, arguments);
        }
    };

    const _Graphics__defaultStretchMode = Graphics._defaultStretchMode;
    Graphics._defaultStretchMode = function() {
        if (Utils.isElectron()) {
            return true;
        } else {
            return _Graphics__defaultStretchMode.apply(this, arguments);
        }
    };

    //=============================================================================
    // Scene_Boot
    //  フルスクリーンで起動する処理を追加します。
    //=============================================================================
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments)
        if (ConfigManager.startUpFullScreen && !DataManager.isEventTest()) {
            Graphics._requestFullScreen();
        }
    };


    //=============================================================================
    // Scene_Title
    //  シャットダウンの処理を追加定義します。
    //=============================================================================
    const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.apply(this, arguments);
        if (param.Shutdown) {
            this._commandWindow.setHandler('shutdown',  this.commandShutdown.bind(this));
        }
    };

    Scene_Title.prototype.commandShutdown = function() {
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Terminate);
    };

    //=============================================================================
    // Scene_GameEnd
    //  シャットダウンの処理を追加定義します。
    //=============================================================================
    const _Scene_GameEnd_createCommandWindow = Scene_GameEnd.prototype.createCommandWindow;
    Scene_GameEnd.prototype.createCommandWindow = function() {
        _Scene_GameEnd_createCommandWindow.apply(this, arguments);
        if (param.UseGameEnd) {
            this._commandWindow.setHandler('shutdown',  this.commandShutdown.bind(this));
        }
    };

    Scene_GameEnd.prototype.commandShutdown = function() {
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Terminate);
    };

    const _Scene_GameEnd_commandWindowRect = Scene_GameEnd.prototype.commandWindowRect;
    Scene_GameEnd.prototype.commandWindowRect = function() {
        const rect = _Scene_GameEnd_commandWindowRect.apply(this, arguments);
        if (param.UseGameEnd) {
            // Risk of conflicts due to poor implementation of core scripts.
            rect.height = this.calcWindowHeight(3, true);
        }
        return rect;
    };

    //=============================================================================
    // Window_GameEnd
    //  シャットダウンの選択肢を追加定義します。
    //=============================================================================
    const _Window_GameEnd_makeCommandList = Window_GameEnd.prototype.makeCommandList;
    Window_GameEnd.prototype.makeCommandList = function() {
        _Window_GameEnd_makeCommandList.apply(this, arguments);
        if (param.UseGameEnd) {
            this.addCommand(param.Shutdown, 'shutdown');
            this._list.splice(1, 0, this._list.pop());
        }
    };

    const _Window_GameEnd_updatePlacement = Window_GameEnd.prototype.updatePlacement;
    Window_GameEnd.prototype.updatePlacement = function() {
        _Window_GameEnd_updatePlacement.apply(this, arguments);
        if (param.UseGameEnd) {
            this.y += Math.floor(this.height / 8);
        }
    };

    //=============================================================================
    // Window_TitleCommand
    //  シャットダウンの選択肢を追加定義します。
    //=============================================================================
    const _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.apply(this, arguments);
        if (param.Shutdown) {
            this.addCommand(param.Shutdown, 'shutdown');
            this.height = this.fittingHeight(this._list.length);
            this.createContents();
        }
    };

    const _Scene_Options_maxCommands = Scene_Options.prototype.maxCommands;
    Scene_Options.prototype.maxCommands = function() {
        return _Scene_Options_maxCommands.apply(this, arguments) + 1;
    };

    //=============================================================================
    // ConfigManager
    //  オプションに「フルスクリーンで起動」項目を追加します。
    //=============================================================================
    ConfigManager._startUpFullScreen = param.DefaultFullScreen;

    Object.defineProperty(ConfigManager, 'startUpFullScreen', {
        get: function() {
            return this._startUpFullScreen;
        },
        set: function(value) {
            if (this._startUpFullScreen === value) {
                return;
            }
            this._startUpFullScreen = value;
            if (!param.Immediate) {
                return;
            }
            if (value) {
                Graphics._requestFullScreen();
            } else {
                Graphics._cancelFullScreen();
            }
        }
    });

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        this._startUpFullScreen = this.readFlag(config, 'startUpFullScreen');
    };

    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.apply(this, arguments);
        config.startUpFullScreen = this.startUpFullScreen;
        return config;
    };

    //=============================================================================
    // Window_Options
    //  オプションに「フルスクリーンで起動」項目を追加します。
    //=============================================================================
    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.apply(this, arguments);
        this.addCommand(param.StartUpFullScreen, 'startUpFullScreen');
    };

    //=============================================================================
    // Scene_Terminate
    //  ゲームを終了します。
    //=============================================================================
    Scene_Terminate.prototype = Object.create(Scene_Base.prototype);
    Scene_Terminate.prototype.constructor = Scene_Terminate;

    Scene_Terminate.prototype.start = function() {
        SceneManager.terminate();
    };
})();
