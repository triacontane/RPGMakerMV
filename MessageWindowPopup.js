//=============================================================================
// MessageWindowPopup.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2016/01/30 選択肢と数値入力ウィンドウをポップアップと連携するよう修正
//                  その他微調整と軽微な表示不良修正
// 1.1.0 2016/01/29 高確率で競合するバグを修正
//                  ポップアップウィンドウがキャラクターの移動に追従するよう修正
//                  顔グラフィックが見切れないよう修正
//                  実行中のイベントをポップアップ対象にできる機能を追加（0を指定）
//                  英語対応
// 1.0.0 2016/01/28 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Popup window plugin
 * @author triacontane
 *
 * @param FontSize
 * @desc Font size of popup window
 * @default 22
 *
 * @param Padding
 * @desc Padding of popup window
 * @default 10
 *
 * @param AutoPopup
 * @desc Popup set when event starting（ON/OFF）
 * @default ON
 *
 * @param FaceScale
 * @desc Scale of face graphic of popup window(1-100%)
 * @default 75
 *
 * @param WindowLinkage
 * @desc Select window and Number input window is linkage with popup window(ON/OFF)
 * @default ON
 *
 * @help Change the message window from fixed to popup
 *
 * Plugin Command
 *
 * MWP_VALID [Character ID]
 *  Popup window valid
 *  Player:-1 Current event:0 Event:1...
 * ex:MWP_VALID 0
 *
 * MWP_INVALID
 *  Popup window invalid
 * ex:MWP_INVALID
 *
 * This plugin is released under the MIT License.
 */
/*:ja
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
 * @default 10
 *
 * @param 自動設定
 * @desc イベント起動時にフキダシの対象が、起動したイベントに自動設定されます。（ON/OFF）
 * OFFの場合は通常のメッセージウィンドウに設定されます。
 * @default ON
 *
 * @param フェイス倍率
 * @desc フキダシウィンドウの顔グラフィック表示倍率(1-100%)
 * @default 75
 *
 * @param ウィンドウ連携
 * @desc 選択肢ウィンドウと数値入力ウィンドウを
 * ポップアップウィンドウに連動させます。(ON/OFF)
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
 * 　メッセージウィンドウを指定したキャラクターIDの頭上に表示するようにします。
 * 　プレイヤー : -1 このイベント : 0 指定したIDのイベント : 1 ～
 *
 * 例：MWP_VALID 0
 * 　　フキダシウィンドウ有効化 3
 *
 * MWP_INVALID
 * 　フキダシウィンドウ無効化
 * 　ウィンドウの表示方法を通常に戻します。
 *
 * 例：MWP_INVALID
 * 　　フキダシウィンドウ無効化
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
                var eventId = getArgNumber(args[0]);
                if (eventId === 0) eventId = this.eventId();
                $gameSystem.setMessagePopup(eventId);
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
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._messagePopupCharacterId = 0;
    };

    Game_System.prototype.setMessagePopup = function(id) {
        this._messagePopupCharacterId = id;
    };

    Game_System.prototype.clearMessagePopup = function() {
        this._messagePopupCharacterId = 0;
    };

    Game_System.prototype.getMessagePopupId = function() {
        return this._messagePopupCharacterId !== 0 ? this._messagePopupCharacterId : null;
    };

    //=============================================================================
    // Game_Map
    //  イベント起動時に自動設定を適用します。
    //=============================================================================
    var _Game_Map_setupStartingMapEvent = Game_Map.prototype.setupStartingMapEvent;
    Game_Map.prototype.setupStartingMapEvent = function() {
        var result = _Game_Map_setupStartingMapEvent.apply(this, arguments);
        if (result) {
            if (getParamBoolean(['AutoPopup', '自動設定'])) {
                $gameSystem.setMessagePopup(this._interpreter.eventId());
            } else {
                $gameSystem.clearMessagePopup();
            }
        }
        return result;
    };

    //=============================================================================
    // Game_Troop
    //  戦闘開始時にポップアップフラグを解除します。
    //=============================================================================
    var _Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.apply(this, arguments);
        $gameSystem.clearMessagePopup();
    };

    //=============================================================================
    // Window_Message
    //  ポップアップする場合、表示内容により座標とサイズを自動設定します。
    //=============================================================================
    var paramFaceScale = getParamNumber(['FaceScale', 'フェイス倍率'], 1, 100);
    var paramFontSize  = getParamNumber(['FontSize', 'フォントサイズ'], 1);
    var paramPadding   = getParamNumber(['Padding', '余白'], 1);
    var paramLinkage   = getParamBoolean(['WindowLinkage', 'ウィンドウ連携']);

    Window_Message._faceHeight = Math.floor(Window_Base._faceHeight * paramFaceScale / 100);
    Window_Message._faceWidth  = Math.floor(Window_Base._faceWidth  * paramFaceScale / 100);

    var _Window_Message_standardFontSize = Window_Message.prototype.standardFontSize;
    Window_Message.prototype.standardFontSize = function() {
        return this.isPopup() ? paramFontSize : _Window_Message_standardFontSize.apply(this, arguments);
    };

    var _Window_Message_standardPadding = Window_Message.prototype.standardPadding;
    Window_Message.prototype.standardPadding = function() {
        return this.isPopup() ? paramPadding : _Window_Message_standardPadding.apply(this, arguments);
    };

    var _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        this._targetCharacterId = $gameSystem.getMessagePopupId();
        _Window_Message_startMessage.apply(this, arguments);
        this.setupSize();
    };

    var _Window_Message_resetFontSettings = Window_Message.prototype.resetFontSettings;
    Window_Message.prototype.resetFontSettings = function() {
        _Window_Message_resetFontSettings.apply(this, arguments);
        if (this.isPopup()) this.contents.fontSize = paramFontSize;
    };

    Window_Message.prototype.getPopupTargetCharacter = function() {
        var id = this._targetCharacterId;
        return id == null ? null : id === -1 ? $gamePlayer : $gameMap.event(id);
    };

    Window_Message.prototype.isPopup = function() {
       return !!this._targetCharacterId;
    };

    var _Window_Message_update = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        _Window_Message_update.apply(this, arguments);
        if (this.openness > 0 && this.isPopup())  this.updatePlacementPopup();
    };

    var _Window_Message_updatePauseSign = Window_Message.prototype._updatePauseSign;
    Window_Message.prototype._updatePauseSign = function() {
        _Window_Message_updatePauseSign.apply(this, arguments);
        if (this.isPopup()) this._windowPauseSignSprite.alpha = 1;
    };

    var _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        _Window_Message_updatePlacement.apply(this, arguments);
        this.x = 0;
        if (this.isPopup()) this.updatePlacementPopup();
    };

    Window_Message.prototype.updatePlacementPopup = function() {
        var character = this.getPopupTargetCharacter();
        this.x = character.screenX() - this.width / 2;
        this.y = character.screenY() - this.height - 56;
        var deltaX = 0;
        if (this.x < 0) {
            deltaX = this.x;
            this.x = 0;
        }
        if (this.x + this.width > Graphics.boxWidth) {
            deltaX = this.x + this.width - Graphics.boxWidth;
            this.x = Graphics.boxWidth - this.width;
        }
        this._windowPauseSignSprite.x = this._width / 2 + deltaX;
        this.subWindows().forEach(function(subWindow) {
            if (typeof subWindow.updatePlacementPopup === 'function') {
                subWindow.updatePlacementPopup();
            }
        });
    };

    Window_Message.prototype.setupSize = function() {
        this.padding = this.standardPadding();
        if (this.getPopupTargetCharacter()) {
            this.processVirtual();
            this._windowPauseSignSprite.y += 12;
        } else {
            this.width = this.windowWidth();
            this.height = this.windowHeight();
        }
        this.updatePlacement();
        this.updateBackground();
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
        this.height = Math.max(this.getFaceHeight(), virtual.y) + this.padding * 2;
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

    var _Window_Message_newLineX = Window_Message.prototype.newLineX;
    Window_Message.prototype.newLineX = function() {
        if (this.isPopup()) {
            return $gameMessage.faceName() === '' ? 0 : Window_Message._faceWidth + 8;
        } else {
            return _Window_Message_newLineX.apply(this, arguments);
        }
    };

    Window_Message.prototype.getFaceHeight = function() {
        return $gameMessage.faceName() === '' ? 0 : Window_Message._faceHeight;
    };

    var _Window_Message_drawFace = Window_Message.prototype.drawFace;
    Window_Message.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
        if (this.isPopup()) {
            width = width || Window_Base._faceWidth;
            height = height || Window_Base._faceHeight;
            var bitmap = ImageManager.loadFace(faceName);
            var pw = Window_Base._faceWidth;
            var ph = Window_Base._faceHeight;
            var sw = Math.min(width, pw);
            var sh = Math.min(height, ph);
            var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
            var dy = Math.floor(y + Math.max(height - ph, 0) / 2) +
                (this.height - this.padding * 2) / 2 - Window_Message._faceHeight / 2;
            var sx = faceIndex % 4 * pw + (pw - sw) / 2;
            var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
            this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, Window_Message._faceWidth, Window_Message._faceHeight);
        } else {
            _Window_Message_drawFace.apply(this, arguments);
        }
    };

    //=============================================================================
    // Window_ChoiceList
    //  ポップアップする場合、メッセージウィンドウに連動して表示位置と余白を調整します。
    //=============================================================================
    var _Window_ChoiceList_standardFontSize = Window_ChoiceList.prototype.standardFontSize;
    Window_ChoiceList.prototype.standardFontSize = function() {
        return this.isPopupLinkage() ? paramFontSize : _Window_ChoiceList_standardFontSize.apply(this, arguments);
    };

    var _Window_ChoiceList_standardPadding = Window_ChoiceList.prototype.standardPadding;
    Window_ChoiceList.prototype.standardPadding = function() {
        return this.isPopupLinkage() ? paramPadding : _Window_ChoiceList_standardPadding.apply(this, arguments);
    };

    var _Window_ChoiceList_lineHeight = Window_ChoiceList.prototype.lineHeight;
    Window_ChoiceList.prototype.lineHeight = function() {
        return this.isPopupLinkage() ? paramFontSize + 8 : _Window_ChoiceList_lineHeight.apply(this, arguments);
    };

    var _Window_ChoiceList_refresh = Window_ChoiceList.prototype.refresh;
    Window_ChoiceList.prototype.refresh = function() {
        this.padding = this.standardPadding();
        this.width   = this.windowWidth();
        this.height  = this.windowHeight();
        _Window_ChoiceList_refresh.apply(this, arguments);
    };

    Window_ChoiceList.prototype.updatePlacementPopup = function() {
        if (paramLinkage && this._messageWindow.openness > 0) {
            this.x = this._messageWindow.x;
            this.y = this._messageWindow.y + this._messageWindow.height;
        } else {
            this.y = Graphics.boxHeight - this.height - this._messageWindow.windowHeight() / 2;
        }
    };

    var _Window_ChoiceList_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
    Window_ChoiceList.prototype.updatePlacement = function() {
        _Window_ChoiceList_updatePlacement.apply(this, arguments);
        if (this.isPopup()) this.updatePlacementPopup();
    };

    Window_ChoiceList.prototype.isPopup = function() {
        return this._messageWindow.isPopup();
    };

    Window_ChoiceList.prototype.isPopupLinkage = function() {
        return this.isPopup() && paramLinkage;
    };

    //=============================================================================
    // Window_NumberInput
    //  ポップアップする場合、メッセージウィンドウに連動して表示位置と余白を調整します。
    //=============================================================================
    var _Window_NumberInput_standardFontSize = Window_NumberInput.prototype.standardFontSize;
    Window_NumberInput.prototype.standardFontSize = function() {
        return this.isPopupLinkage() ? paramFontSize : _Window_NumberInput_standardFontSize.apply(this, arguments);
    };

    var _Window_NumberInput_standardPadding = Window_NumberInput.prototype.standardPadding;
    Window_NumberInput.prototype.standardPadding = function() {
        return this.isPopupLinkage() ? paramPadding : _Window_NumberInput_standardPadding.apply(this, arguments);
    };

    var _Window_NumberInput_lineHeight = Window_NumberInput.prototype.lineHeight;
    Window_NumberInput.prototype.lineHeight = function() {
        return this.isPopupLinkage() ? paramFontSize + 8 : _Window_NumberInput_lineHeight.apply(this, arguments);
    };

    var _Window_NumberInput_refresh = Window_NumberInput.prototype.refresh;
    Window_NumberInput.prototype.refresh = function() {
        this.padding = this.standardPadding();
        this.width   = this.windowWidth();
        this.height  = this.windowHeight();
        _Window_NumberInput_refresh.apply(this, arguments);
    };

    var _Window_NumberInput_updatePlacement = Window_NumberInput.prototype.updatePlacement;
    Window_NumberInput.prototype.updatePlacement = function() {
        _Window_NumberInput_updatePlacement.apply(this, arguments);
        if (this.isPopup()) this.updatePlacementPopup();
    };

    Window_NumberInput.prototype.updatePlacementPopup = function() {
        if (paramLinkage && this._messageWindow.openness > 0) {
            this.x = this._messageWindow.x;
            this.y = this._messageWindow.y + this._messageWindow.height;
        } else {
            this.y = Graphics.boxHeight - this.height - this._messageWindow.windowHeight() / 2;
        }
    };

    Window_NumberInput.prototype.isPopup = function() {
        return this._messageWindow.isPopup();
    };

    Window_NumberInput.prototype.isPopupLinkage = function() {
        return this.isPopup() && paramLinkage;
    };
})();

