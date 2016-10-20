//=============================================================================
// BackLogWithEffect.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/10/21 作成途中
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc 演出つきバックログプラグイン
 * @author トリアコンタン
 *
 * @param バックログ文字色
 * @desc バックログのテキストカラーです。
 * @default 2
 *
 * @help メッセージにバックログを実行します。
 * 音声再生機能およびピクチャの復元機能を同時に備えます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

function Game_BackLog() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';
    var pluginName    = 'BackLogWithEffect';
    var metaTagPrefix = 'BackLogWithEffect';

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramBackLogColor = getParamNumber(['BackLogColor', 'バックログ文字色'], 0);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_setup = Game_Interpreter.prototype.setup;
    Game_Interpreter.prototype.setup = function(list, eventId) {
        _Game_Interpreter_setup.apply(this, arguments);
        $gameSystem.clearBackLogs();
    };

    var _Game_Interpreter_updateWaitCount = Game_Interpreter.prototype.updateWaitCount;
    Game_Interpreter.prototype.updateWaitCount = function() {
        var result = _Game_Interpreter_updateWaitCount.apply(this, arguments);
        if (result) {
            $gameSystem.clearBackLogSound();
        }
        return result;
    };

    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var commandPrefix = new RegExp('^' + metaTagPrefix);
        if (!command.match(commandPrefix)) return;
        try {
            this.pluginCommandBackLogWithEffect(command.replace(commandPrefix, ''), args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.stack || e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandBackLogWithEffect = function(command, args) {
        switch (getCommandName(command)) {
            case 'XXXXX' :
                break;
        }
    };

    //=============================================================================
    // Game_System
    //  バックログ情報を追加定義します。
    //=============================================================================
    var _Game_System_initialize      = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._backLogs = [];
        this._sounds   = null;
    };

    Game_System.prototype.getBackLogs = function() {
        return this._backLogs || [];
    };

    Game_System.prototype.getBackLog = function(index) {
        return this.getBackLogs()[index];
    };

    Game_System.prototype.clearBackLogs = function() {
        this._backLogs = [];
    };

    Game_System.prototype.createBackLog = function(text) {
        var backLog = new Game_BackLog(text);
        backLog.setPictures($gameScreen.getPicturesCopy());
        backLog.setSounds(this._sounds);
        this.getBackLogs().unshift(backLog);
        this.clearBackLogSound();
    };

    Game_System.prototype.addBackLogSound = function(soundData) {
        if (!this._sounds) this.clearBackLogSound();
        this._sounds.push(soundData);
    };

    Game_System.prototype.clearBackLogSound = function() {
        this._sounds = [];
    };

    //=============================================================================
    // Game_Screen
    //  ピクチャ情報のコピーと復元を追加定義します。
    //=============================================================================
    Game_Screen.prototype.getPicturesCopy = function() {
        return this._pictures.map(function(picture) {
            return JsonEx.makeDeepCopy(picture);
        });
    };

    Game_Screen.prototype.setBackLogPictures = function(pictures) {
        if (!this._prevPictures) {
            this._prevPictures = this._pictures;
        }
        this._pictures = pictures;
    };

    Game_Screen.prototype.restorePictures = function() {
        if (this._prevPictures) {
            this._pictures = this._prevPictures;
        }
        this._prevPictures = null;
    };

    //=============================================================================
    // Game_Message
    //  バックログ表示中フラグを管理します。
    //=============================================================================
    var _Game_Message_initialize = Game_Message.prototype.initialize;
    Game_Message.prototype.initialize = function() {
        _Game_Message_initialize.apply(this, arguments);
        this._backLogViewing = false;
    };

    Game_Message.prototype.setBackLogViewing = function(value) {
        this._backLogViewing = !!value;
    };

    Game_Message.prototype.isBackLogViewing = function() {
        return this._backLogViewing;
    };

    //=============================================================================
    // AudioManager
    //  演奏した効果音を記録します。
    //=============================================================================
    var _AudioManager_playSe = AudioManager.playSe;
    AudioManager.playSe = function(se) {
        if ($gameMap.isEventRunning() && !$gameMessage.isBackLogViewing()) {
            $gameSystem.addBackLogSound(se);
        }
        _AudioManager_playSe.apply(this, arguments);
    };

    //=============================================================================
    // Window_Message
    //  バックログを実装します。
    //=============================================================================
    var _Window_Message_initMembers      = Window_Message.prototype.initMembers;
    Window_Message.prototype.initMembers = function() {
        _Window_Message_initMembers.apply(this, arguments);
        this._backLogDepth = 0;
    };

    var _Window_Message_onEndOfText      = Window_Message.prototype.onEndOfText;
    Window_Message.prototype.onEndOfText = function() {
        if (!$gameMessage.isBackLogViewing()) {
            $gameSystem.createBackLog(this._textState.text);
        }
        _Window_Message_onEndOfText.apply(this, arguments);
    };

    var _Window_Message_terminateMessage      = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        _Window_Message_terminateMessage.apply(this, arguments);
        if (!this.isBackLogActive()) {
            $gameMessage.setBackLogViewing(false);
            $gameScreen.restorePictures();
        }
    };

    Window_Message.prototype.isBackLogActive = function() {
        return this._backLogDepth > 0;
    };

    var _Window_Message_updateShowFast      = Window_Message.prototype.updateShowFast;
    Window_Message.prototype.updateShowFast = function() {
        _Window_Message_updateShowFast.apply(this, arguments);
        if ($gameMessage.isBackLogViewing()) {
            this._showFast = true;
        }
    };

    var _Window_Message_updateInput      = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        var result = this.pause;
        if (!this.isBackLogActive()) {
            result = _Window_Message_updateInput.apply(this, arguments);
        }
        if (!this.isAnySubWindowActive() && this.pause) {
            if (this.isTriggeredBackLogForward()) {
                this.startBackLog(this._backLogDepth + 1);
            }
            if (this.isTriggeredBackLogReturn()) {
                this.startBackLog(this._backLogDepth - 1);
            }
        }
        return result;
    };

    Window_Message.prototype.processNormalCharacter = function(textState) {
        if (paramBackLogColor && $gameMessage.isBackLogViewing()) {
            this.changeTextColor(this.textColor(paramBackLogColor));
        }
        Window_Base.prototype.processNormalCharacter.apply(this, arguments);
    };

    Window_Message.prototype.startBackLog = function(index) {
        var backLog = $gameSystem.getBackLog(index);
        if (backLog) {
            this.pause = false;
            $gameMessage.clear();
            $gameMessage.add(backLog.getText());
            this._backLogDepth = index;
            $gameMessage.setBackLogViewing(true);
            $gameScreen.setBackLogPictures(backLog.getPictures());
            backLog.getSounds().forEach(function(sound) {
                AudioManager.playSe(sound);
            });
        }
    };

    Window_Message.prototype.isTriggeredBackLogForward = function() {
        return TouchInput.wheelY < 0 || Input.isTriggered('up');
    };

    Window_Message.prototype.isTriggeredBackLogReturn = function() {
        return TouchInput.wheelY > 0 || Input.isTriggered('down') || this.isTriggered();
    };

    //=============================================================================
    // Game_BackLog
    //  バックログを扱うクラスです。このクラスはGame_Systemクラスで生成されます。
    //  セーブデータの保存対象のためグローバル領域に定義します。
    //=============================================================================
    Game_BackLog.prototype.initialize = function(text) {
        this._text     = text;
        this._pictures = [];
        this._sounds   = [];
    };

    Game_BackLog.prototype.setPictures = function(pictures) {
        this._pictures = pictures;
    };

    Game_BackLog.prototype.setSounds = function(sounds) {
        this._sounds = sounds;
    };

    Game_BackLog.prototype.getText = function() {
        return this._text;
    };

    Game_BackLog.prototype.getPictures = function() {
        return this._pictures;
    };

    Game_BackLog.prototype.getSounds = function() {
        return this._sounds;
    };
})();

