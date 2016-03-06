//=============================================================================
// StartUpFullScreen.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/03/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Start up full screen
 * @author triacontane
 *
 * @param Shutdown
 * @desc Command name for shutdown.
 * @default Shutdown
 *
 * @param StartUpFullScreen
 * @desc Command name for full screen option.
 * @default Full Screen
 *
 * @help Add option start up full screen.
 * This plugin is using only local execute.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc フルスクリーンで起動プラグイン
 * @author トリアコンタン
 *
 * @param シャットダウン
 * @desc タイトル画面に追加するシャットダウンの項目名です。
 * ローカル環境での実行時のみ表示されます。
 * @default シャットダウン
 *
 * @param フルスクリーンで起動
 * @desc オプション画面に追加する全画面で起動の項目名です。
 * ローカル環境での実行時のみ表示されます。
 * @default フルスクリーンで起動
 *
 * @help オプション画面に「フルスクリーンで起動」を追加します。
 * 有効な場合、ゲームをフルスクリーンで起動します。
 * またタイトル画面にシャットダウンを追加します。
 *
 * このプラグインはローカル環境で実行した場合のみ有効です。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

function Scene_Terminate() {
    this.initialize.apply(this, arguments);
}

(function () {
    'use strict';
    // Nw.js環境下以外では一切の機能を無効
    if (!Utils.isNwjs()) {
        return;
    }

    var pluginName = 'StartUpFullScreen';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var paramShutdown          = getParamString(['Shutdown', 'シャットダウン']);
    var paramStartUpFullScreen = getParamString(['StartUpFullScreen', 'フルスクリーンで起動']);

    //=============================================================================
    // Graphics
    //  privateメソッド「_requestFullScreen」を呼び出します。
    //=============================================================================
    Graphics.requestFullScreen = function() {
        if (this._isFullScreen()) {
            this._requestFullScreen();
        }
    };

    //=============================================================================
    // Scene_Boot
    //  フルスクリーンで起動する処理を追加します。
    //=============================================================================
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments);
        if (ConfigManager.startUpFullScreen) Graphics.requestFullScreen();
    };

    //=============================================================================
    // Scene_Title
    //  シャットダウンの処理を追加定義します。
    //=============================================================================
    var _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.apply(this, arguments);
        if (paramShutdown) this._commandWindow.setHandler('shutdown',  this.commandShutdown.bind(this));
    };

    Scene_Title.prototype.commandShutdown = function() {
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Terminate);
    };

    //=============================================================================
    // Window_TitleCommand
    //  シャットダウンの選択肢を追加定義します。
    //=============================================================================
    var _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.apply(this, arguments);
        if (paramShutdown) this.addCommand(paramShutdown, 'shutdown');
    };

    var _Window_TitleCommand_updatePlacement = Window_TitleCommand.prototype.updatePlacement;
    Window_TitleCommand.prototype.updatePlacement = function() {
        _Window_TitleCommand_updatePlacement.apply(this, arguments);
        if (paramShutdown) this.y += this.height / 8;
    };

    //=============================================================================
    // ConfigManager
    //  オプションに「フルスクリーンで起動」項目を追加します。
    //=============================================================================
    ConfigManager.startUpFullScreen = false;

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        this.startUpFullScreen = this.readFlag(config, 'startUpFullScreen');
    };

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = _ConfigManager_makeData.apply(this, arguments);
        config.startUpFullScreen = this.startUpFullScreen;
        return config;
    };

    //=============================================================================
    // Window_Options
    //  オプションに「フルスクリーンで起動」項目を追加します。
    //=============================================================================
    var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.apply(this, arguments);
        this.addCommand(paramStartUpFullScreen, 'startUpFullScreen');
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

