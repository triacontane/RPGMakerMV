//=============================================================================
// MessageSkip.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/01/15 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc メッセージスキッププラグイン
 * @author トリアコンタン
 *
 * @param スキップキー
 * @desc メッセージスキップに該当するキー
 * (キーのアルファベット/shift/control/tab)
 * @default S
 *
 * @param オートキー
 * @desc メッセージスキップに該当するキー
 * (キーのアルファベット/shift/control/tab)
 * @default A
 *
 * @help メッセージウィンドウでメッセージのスキップやオートモードの切替ができます。
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
    var pluginName = 'MessageSkip';

    var getParamString = function (paramNames, upperFlg) {
        var value = getParamOther(paramNames);
        return value == null ? '' : upperFlg ? value.toUpperCase() : value;
    };

    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    Number.prototype.times = function (handler) {
        var i = 0;
        while (i < this) handler.call(this, i++);
    };

    Input.keyCodeReverseMapper = {
        a : 65, b : 66, c : 67, d : 68, e : 69, f : 70, g : 71,
        h : 72, i : 73, j : 74, k : 75, l : 76, m : 77, n : 78,
        o : 79, p : 80, q : 81, r : 82, s : 83, t : 84, u : 85,
        v : 86, w : 87, x : 88, y : 89, z : 90,
        backspace : 8, tab : 9, enter : 13, shift : 16, ctrl : 17, alt : 18, pause : 19, esc : 27, space : 32,
        page_up : 33, page_down : 34, end : 35, home : 36, left : 37, right : 38, up : 39, down : 40, insert : 45, delete : 46
    };
    Number(9).times(function(i) {
        Input.keyCodeReverseMapper[i] = i + 48;
    });
    Number(12).times(function(i) {
        Input.keyCodeReverseMapper['f' + (i + 1)] = i + 112;
    });

    var skipKeyName = getParamString('スキップキー').toLowerCase();
    var skipKeyCode = Input.keyCodeReverseMapper[skipKeyName];
    var autoKeyName = getParamString('オートキー').toLowerCase();
    var autoKeyCode = Input.keyCodeReverseMapper[autoKeyName];
    if (skipKeyCode) {
        Input.keyMapper[skipKeyCode] == null ? Input.keyMapper[skipKeyCode] = 'messageSkip' :
            skipKeyName = Input.keyMapper[skipKeyCode];
    }
    if (autoKeyCode) {
        Input.keyMapper[autoKeyCode] == null ? Input.keyMapper[autoKeyCode] = 'messageAuto' :
            autoKeyName = Input.keyMapper[autoKeyCode];
    }

    var _Window_Message_initialize = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function() {
        _Window_Message_initialize.apply(this, arguments);
        this._icon = new Sprite_Frame(16, 20, ImageManager.loadSystem('IconSet'), -1);
        this._icon.x = this.width - 48;
        this._icon.y = this.height - 48;
        this.addChild(this._icon);
    };

    var _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.apply(this, arguments);
        this._messageAutoCount = 60 * 2;
    };

    var _Window_Message_updateWait = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function() {
        this.updateMessageSkip();
        this.updateMessageAuto();
        return _Window_Message_updateWait.apply(this, arguments);
    };

    Window_Message.prototype.updateMessageSkip = function() {
        if (this.isAnySubWindowActive()) {
            this._messageSkip = false;
            this._icon.refresh(-1);
        } else if (this.isTriggeredMessageSkip()) {
            this._messageSkip = !this._messageSkip;
            this._icon.refresh(this._messageSkip ? 76 : -1);
        }
    };

    Window_Message.prototype.updateMessageAuto = function() {
        if (this.isTriggeredMessageAuto()) {
            this._messageAuto = (!this._messageSkip && !this._messageAuto);
            this._icon.refresh(this._messageAuto ? 77 : -1);
        }
    };

    var _Window_Message_updateInput = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        if (this._messageAuto && this._messageAutoCount > 0) this._messageAutoCount--;
        return _Window_Message_updateInput.apply(this, arguments);
    };

    Window_Message.prototype.isTriggeredMessageSkip = function() {
        return Input.isTriggered('messageSkip') || Input.isTriggered(skipKeyName);
    };

    Window_Message.prototype.isTriggeredMessageAuto = function() {
        return Input.isTriggered('messageAuto') || Input.isTriggered(autoKeyName);
    };

    var _Window_Message_isTriggered = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function() {
        return _Window_Message_isTriggered.apply(this, arguments) || this._messageSkip ||
            (this._messageAuto && this._messageAutoCount <= 0);
    };

    var _Window_Message_startPause = Window_Message.prototype.startPause;
    Window_Message.prototype.startPause = function() {
        _Window_Message_startPause.apply(this, arguments);
        if (this._messageSkip) this.startWait(2);
    };

    function Sprite_Frame() {
        this.initialize.apply(this, arguments);
    }

    Sprite_Frame.prototype = Object.create(Sprite.prototype);
    Sprite_Frame.prototype.constructor = Sprite_Frame;

    Sprite_Frame.prototype.initialize = function(column, row, bitmap, index) {
        Sprite.prototype.initialize.call(this);
        this._column = column;
        this._row = row;
        this.bitmap = bitmap;
        this.refresh(index ? index : 0);
    };

    Sprite_Frame.prototype.refresh = function(index) {
        if (!this.bitmap.isReady()) return;
        var w = Math.floor(this.bitmap.width / this._column);
        var h = Math.floor(this.bitmap.height / this._row);
        this.setFrame((index % this._column) * w, Math.floor(index / this._column) * h, w, h);
    };
})();

