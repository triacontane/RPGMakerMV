//=============================================================================
// MessageWindowPopup.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/01/28 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc フキダシウィンドウプラグイン
 * @author トリアコンタン
 *
 * @param フォントサイズ
 * @desc フキダシウィンドウのデフォルトフォントサイズ
 * 通常ウィンドウのフォントサイズ：28
 * @default 22
 *
 * @param 余白
 * @desc フキダシウィンドウの余白サイズ
 * 通常ウィンドウの余白：18
 * @default 8
 *
 * @param 自動設定
 * @desc イベント起動時にフキダシの対象が、起動したイベントに自動設定されます。（ON/OFF）
 * OFFの場合は通常のメッセージウィンドウに設定されます。
 * @default ON
 *
 * @help メッセージウィンドウを指定したキャラクターの頭上にフキダシで
 * 表示するよう変更します。
 * キャラクターのマップ上の位置によってはウィンドウが画面上に隠れてしまう
 * 場合もあるので注意してください。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * MWP_VALID
 * フキダシウィンドウ有効化 [キャラクターID] or
 * メッセージウィンドウを指定したキャラクターIDの頭上に表示するようにします。
 * プレイヤー : 0 指定したIDのイベント : 1 ～
 *
 * 例：MWP_VALID 0
 * 　　フキダシウィンドウ有効化 3
 *
 * MWP_INVALID
 * フキダシウィンドウ無効化
 * ウィンドウの表示方法を通常に戻します。
 *
 * 例：MWP_INVALID
 * 　　フキダシウィンドウ無効化
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    'use strict';
    var pluginName = 'MessageWindowPopup';

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
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

    var getArgNumber = function (arg, min, max) {
        if (arguments.length <= 2) min = -Infinity;
        if (arguments.length <= 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandMessageWindowPopup(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window  = require('nw.gui').Window.get();
                var devTool = window.showDevTools();
                devTool.moveTo(0, 0);
                devTool.resizeTo(Graphics.width, Graphics.height);
                window.focus();
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandMessageWindowPopup = function (command, args) {
        switch (getCommandName(command)) {
            case 'MWP_VALID' :
            case 'フキダシウィンドウ有効化':
                $gameSystem.setMessagePopup(getArgNumber(args[0]));
                break;
            case 'MWP_INVALID':
            case 'フキダシウィンドウ無効化':
                $gameSystem.clearMessagePopup();
                break;
        }
    };

    //=============================================================================
    // Game_System
    //  ポップアップフラグを保持します。
    //=============================================================================
    Game_System.prototype.initialize = function() {
        this._messagePopupCharacterId = 0;
        this._messagePopup            = false;
    };

    Game_System.prototype.setMessagePopup = function(id) {
        this._messagePopupCharacterId = id;
        this._messagePopup            = true;
    };

    Game_System.prototype.clearMessagePopup = function() {
        this._messagePopupCharacterId = 0;
        this._messagePopup            = false;
    };

    Game_System.prototype.getMessagePopupId = function() {
        return this._messagePopup ? this._messagePopupCharacterId : null;
    };

    var _Game_Map_setupStartingMapEvent = Game_Map.prototype.setupStartingMapEvent;
    Game_Map.prototype.setupStartingMapEvent = function() {
        var result = _Game_Map_setupStartingMapEvent.apply(this, arguments);
        if (result) {
            if (getParamBoolean('自動設定')) {
                $gameSystem.setMessagePopup(this._interpreter.eventId());
            } else {
                $gameSystem.clearMessagePopup();
            }
        }
        return result;
    };

    var _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.apply(this, arguments);
        this.setupPosition();
    };

    var _Window_Message_resetFontSettings = Window_Message.prototype.resetFontSettings;
    Window_Message.prototype.resetFontSettings = function() {
        _Window_Message_resetFontSettings.apply(this, arguments);
        if (this.getPopupTargetCharacter()) {
            this.contents.fontSize = getParamNumber('フォントサイズ', 1);
        }
    };

    Window_Message.prototype.getPopupTargetCharacter = function() {
        var id = $gameSystem.getMessagePopupId();
        if (id == null) return null;
        return id === 0 ? $gamePlayer : $gameMap.event(id);
    };

    Window_Message.prototype.setupPosition = function() {
        var character = this.getPopupTargetCharacter();
        if (character) {
            this.padding = getParamNumber('余白', 1);
            this.processVirtual();
            this.x = character.screenX() - this.width / 2;
            this.y = character.screenY() - this.height - 56;
        } else {
            this.padding = this.standardPadding();
            this.width = this.windowWidth();
            this.height = this.windowHeight();
            this.x = 0;
            this.updatePlacement();
        }
    };

    Window_Message.prototype.processVirtual = function() {
        var virtual = {};
        virtual.index = 0;
        virtual.text = this.convertEscapeCharacters($gameMessage.allText());
        virtual.maxWidth = 0;
        this.newPage(virtual);
        while (!this.isEndOfText(virtual)) {
            this.processVirtualCharacter(virtual);
        }
        virtual.y += virtual.height;
        this.width  = virtual.maxWidth + this.padding * 2;
        this.height = virtual.y + this.padding * 2;
        this._windowPauseSignSprite.y += 12;
    };

    Window_Message.prototype.processVirtualCharacter = function(textState) {
        switch (textState.text[textState.index]) {
            case '\n':
                this.processNewLine(textState);
                break;
            case '\f':
                this.processNewPage(textState);
                break;
            case '\x1b':
                this.processVirtualEscapeCharacter(this.obtainEscapeCode(textState), textState);
                break;
            default:
                this.processVirtualNormalCharacter(textState);
                break;
        }
    };

    Window_Message.prototype.processVirtualEscapeCharacter = function(code, textState) {
        switch (code) {
            case 'C':
                this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));
                break;
            case 'I':
                this.processVirtualDrawIcon(this.obtainEscapeParam(textState), textState);
                break;
            case '{':
                this.makeFontBigger();
                break;
            case '}':
                this.makeFontSmaller();
                break;
        }
    };

    Window_Message.prototype.processVirtualNormalCharacter = function(textState) {
        var c = textState.text[textState.index++];
        textState.x += this.textWidth(c);
        textState.maxWidth = Math.max(textState.maxWidth, textState.x);
    };

    Window_Message.prototype.processVirtualDrawIcon = function(iconIndex, textState) {
        textState.x += Window_Base._iconWidth + 4;
        textState.maxWidth = Math.max(textState.maxWidth, textState.x);
    };
})();

