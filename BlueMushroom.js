//=============================================================================
// BlueMushroom.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/08/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Plugin That ...
 * @author triacontane
 *
 * @param param
 * @desc parameter description
 * @default default value
 *
 * @help Plugin That ...
 *
 * Plugin Command
 *  XXXXX [XXX]
 *  ex1：XXXXX 1
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ビジュアルノベルプラグイン
 * @author トリアコンタン
 *
 * @param コマンド単位ウェイト
 * @desc イベントコマンド「文章の表示」ひとつごとに続く文章の表示を待機します。(ON/OFF)
 * @default ON
 *
 * @param 表示速度変数
 * @desc メッセージ表示速度を格納する変数の番号
 * @default 1
 *
 * @param 瞬間表示
 * @desc 文章の表示中に決定ボタンや左クリックで文章を瞬間表示します。(ON/OFF)
 * @default OFF
 *
 * @param 自動改行
 * @desc 文章がウィンドウ枠に収まらない場合に自動で改行します。(ON/OFF)
 * @default ON
 *
 * @help RPGツクールMVでサウンドノベルを手軽に作成するためのベースプラグインです。
 * 適用すると、メッセージウィンドウの表示が画面全体になり
 * 表示したメッセージが消去されず画面に蓄積されるようになります。
 *
 * ・このプラグインは、すでに公開している以下のプラグインの機能を含みます。
 * MessageUnlockBusy.js
 * MessageSpeedCustomize.js
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

(function() {
    'use strict';
    var pluginName    = 'BlueMushroom';
    var metaTagPrefix = 'BM_';
    var setting       = {
        unlockCode      : 'UL',
        windowCloseCode : 'WC',
        messageSpeedCode: 'MS',
    };

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramVariableSpeed = getParamNumber(['VariableSpeed', '表示速度変数'], 1, 5000);
    var paramRapidShow     = getParamBoolean(['RapidShow', '瞬間表示']);
    var paramWaitByCommand = getParamBoolean(['WaitByCommand', 'コマンド単位ウェイト']);
    var paramAutoWordWrap  = getParamBoolean(['AutoWordWrap', '自動改行']);

    //=============================================================================
    // Utils
    //  文字列の挿入処理
    //=============================================================================
    Utils.spliceString = function(originalString, index, howMany, addString) {
        if (howMany < 0) howMany = 0;
        return (originalString.slice(0, index) + addString + originalString.slice(index + howMany));
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (!command.match(new RegExp('^' + metaTagPrefix))) return;
        try {
            this.pluginCommandBlueMushroom(command.replace(metaTagPrefix, ''), args);
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

    Game_Interpreter.prototype.pluginCommandBlueMushroom = function(command, args) {
        switch (getCommandName(command)) {
            case '再ウェイト' :
            case 'RE_WAIT' :
                if ($gameMessage.isBusy()) this.setWaitMode('message');
                break;
            case 'ノベル無効化' :
            case 'NOVEL_DISABLE' :
                $gameSystem.setNovelWindowDisable(true);
                break;
            case 'ノベル有効化' :
            case 'NOVEL_ENABLE' :
                $gameSystem.setNovelWindowDisable(true);
                break;
        }
    };

    var _Game_Interpreter_command101      = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setInterpreter(this);
        }
        _Game_Interpreter_command101.apply(this, arguments);
    };

    //=============================================================================
    // Game_System
    //  全画面ウィンドウの有効フラグを管理します。
    //=============================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._novelWindowDisable = false;
    };

    Game_System.prototype.isNovelWindowDisable = function() {
        return this._novelWindowDisable;
    };

    Game_System.prototype.setNovelWindowDisable = function(value) {
        this._novelWindowDisable = !!value;
    };

    //=============================================================================
    // Game_Message
    //  ウェイト解除処理を追加定義します。
    //=============================================================================
    var _Game_Message_clear      = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.apply(this, arguments);
        this._interpreter = null;
    };

    Game_Message.prototype.setInterpreter = function(interpreter) {
        this._interpreter = interpreter;
    };

    Game_Message.prototype.setWaitMode = function(value) {
        if (this._interpreter) {
            this._interpreter.setWaitMode(value);
        }
    };

    Game_Message.prototype.setNoWait = function() {
        if (this._texts.length > 0) {
            this._texts[this._texts.length - 1] += '\\^';
        }
    };

    //=============================================================================
    // Window_Message
    //  ウィンドウの表示方法を変更します。
    //=============================================================================
    Window_Message.fontFaceMincho = '"ヒラギノ明朝 ProN W3","Hiragino Mincho ProN","ＭＳ Ｐ明朝","MS PMincho"';

    var _Window_Message_standardFontSize = Window_Message.prototype.standardFontSize;
    Window_Message.prototype.standardFontSize = function() {
        return _Window_Message_standardFontSize.apply(this, arguments) + 6;
    };

    var _Window_Message_standardFontFace = Window_Message.prototype.standardFontFace;
    Window_Message.prototype.standardFontFace = function() {
        return (this.isNovelWindow() ? Window_Message.fontFaceMincho : '') +
            _Window_Message_standardFontFace.apply(this, arguments);
    };

    var _Window_Message_updateWait      = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function() {
        if (paramRapidShow && this._textState && this.isTriggered()) {
            this._showAll = true;
        }
        return _Window_Message_updateWait.apply(this, arguments);
    };

    var _Window_Message_updateMessage      = Window_Message.prototype.updateMessage;
    Window_Message.prototype.updateMessage = function() {
        var speed = this.getMessageSpeed();
        if (this._textState && !this._lineShowFast) {
            if (speed <= 0 || this._showAll) {
                this._showFast = true;
            } else {
                this._waitCount = speed - 1;
            }
        }
        return _Window_Message_updateMessage.apply(this, arguments);
    };

    var _Window_Message_updatePlacement      = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        _Window_Message_updatePlacement.apply(this, arguments);
        this._isNovelWindow = !$gameSystem.isNovelWindowDisable();
        if (this.isNovelWindow()) {
            this.move(0, 0, Graphics.boxWidth, Graphics.boxHeight);
            this.createContents();
        }
    };

    Window_Message.prototype.isNovelWindow = function() {
        return this._isNovelWindow;
    };

    Window_Message.prototype.getMessageSpeed = function() {
        return this._tempMessageSpeed !== null ? this._tempMessageSpeed : $gameVariables.value(paramVariableSpeed);
    };

    Window_Message.prototype.setTempMessageSpeed = function(speed) {
        if (speed >= 0) {
            this._tempMessageSpeed = speed;
            if (speed > 0) this._showFast = false;
        } else {
            this._tempMessageSpeed = null;
        }
    };

    var _Window_Message_startMessage      = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        if (!paramWaitByCommand && this.isNovelWindow()) {
            $gameMessage.setNoWait();
        }
        if (!this._prevTextState || !this.isNovelWindow()) {
            _Window_Message_startMessage.apply(this, arguments);
        } else {
            this._textState      = this._prevTextState;
            this._textState.text = this.convertEscapeCharacters($gameMessage.allText());
            this._textState.top  = this._textState.y;
            this.processNewLine(this._textState);
            this._textState.index = 0;
            this.resetFontSettings();
            this.clearFlags();
            this.loadMessageFace();
            this.open();
        }
    };

    var _Window_Message_clearFlags      = Window_Message.prototype.clearFlags;
    Window_Message.prototype.clearFlags = function() {
        _Window_Message_clearFlags.apply(this, arguments);
        this._windowClosing    = false;
        this._showAll          = false;
        this._tempMessageSpeed = null;
    };

    var _Window_Message_newPage      = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function(textState) {
        textState.top = 0;
        textState.y   = 0;
        _Window_Message_newPage.apply(this, arguments);
    };

    var _Window_Message_onEndOfText      = Window_Message.prototype.onEndOfText;
    Window_Message.prototype.onEndOfText = function() {
        this._prevTextState = (this._windowClosing ? null : this._textState);
        $gameMessage.setFaceImage('', 0);
        _Window_Message_onEndOfText.apply(this, arguments);
    };

    var _Window_Message_startPause      = Window_Message.prototype.startPause;
    Window_Message.prototype.startPause = function() {
        _Window_Message_startPause.apply(this, arguments);
        if (this.isNovelWindow()) {
            var position = this._signPositionNewLine ? this._signPositionNewLine : this.getPauseSignSpritePosition();
            this.setPauseSignSpritePosition(position);
        }
    };

    Window_Message.prototype.setPauseSignSpritePosition = function(position) {
        var signSprite = this._windowPauseSignSprite;
        signSprite.x = position.x;
        signSprite.y = position.y;
        signSprite.setBlendColor(this._windowClosing || this._signPositionNewLine ? [255, 0, 0, 128] : [0, 0, 0, 0]);
    };

    Window_Message.prototype.getPauseSignSpritePosition = function() {
        var signSprite = this._windowPauseSignSprite;
        var x          = this._textState.x + this.padding + (signSprite.width * signSprite.anchor.x);
        var y          = this._textState.y + this._textState.height + this.padding;
        return {x: x, y: y};
    };

    var _Window_Message_terminateMessage      = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        _Window_Message_terminateMessage.apply(this, arguments);
        if (!this._windowClosing && this.isNovelWindow()) {
            this.open();
        }
    };

    var _Window_Message_processEscapeCharacter      = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        if (code === '>') this._waitCount = 0;
        switch (code) {
            case setting.unlockCode:
                $gameMessage.setWaitMode('');
                break;
            case setting.windowCloseCode:
                this._windowClosing = true;
                break;
            case setting.messageSpeedCode:
                this.setTempMessageSpeed(this.obtainEscapeParam(textState));
                break;
            default:
                _Window_Message_processEscapeCharacter.apply(this, arguments);
        }
    };

    var _Window_Message_processNormalCharacter      = Window_Message.prototype.processNormalCharacter;
    Window_Message.prototype.processNormalCharacter = function(textState) {
        if (_Window_Message_processNormalCharacter) {
            _Window_Message_processNormalCharacter.apply(this, arguments);
        } else {
            Window_Base.prototype.processNormalCharacter.call(this, textState);
        }
        if (paramAutoWordWrap && this.isNovelWindow()) this.processAutoWordWrap(textState);
    };

    var _Window_Message_processNewLine      = Window_Message.prototype.processNewLine;
    Window_Message.prototype.processNewLine = function(textState) {
        textState.left            = this.newLineX();
        this._signPositionNewLine = this.getPauseSignSpritePosition();
        _Window_Message_processNewLine.apply(this, arguments);
        this._signPositionNewLine = null;
    };

    var _Window_Message_newLineX      = Window_Message.prototype.newLineX;
    Window_Message.prototype.newLineX = function() {
        var x = _Window_Message_newLineX.apply(this, arguments);
        return (this._textState.y - this._textState.top >= Window_Base._faceHeight) ? 0 : x;
    };

    Window_Message.prototype.processAutoWordWrap = function(textState) {
        var c         = textState.text[textState.index + 1];
        var textNextX = textState.x + this.textWidth(c);
        if (textNextX > this.contents.width) {
            textState.index--;
            this.processNewLine(textState);
        }
    };

    var _Window_Message_drawMessageFace      = Window_Message.prototype.drawMessageFace;
    Window_Message.prototype.drawMessageFace = function() {
        if (!this._prevTextState) {
            _Window_Message_drawMessageFace.apply(this, arguments);
        } else {
            this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), 0, this._textState.y);
        }
    };
})();

