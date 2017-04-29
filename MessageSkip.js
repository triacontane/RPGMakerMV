//=============================================================================
// MessageSkip.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2017/04/29 並列実行のイベントでも通常イベントが実行中でなければスキップを解除するよう修正
//                  キーコードの「右」と「上」が逆になっていた問題を修正
//                  オート待機フレームを制御文字を使って動的に変更できる機能を追加
// 1.1.0 2016/12/14 並列処理イベントが実行されている場合にスキップが効かなくなる問題を修正
// 1.0.1 2016/02/15 モバイル端末での動作が遅くなる不具合を修正
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
 * @desc メッセージオートに該当するキー
 * (キーのアルファベット/shift/control/tab)
 * @default A
 *
 * @param スキップアイコン
 * @desc メッセージスキップ中にウィンドウ右下に表示されるアイコン
 * @default 140
 *
 * @param オートアイコン
 * @desc メッセージオート中にウィンドウ右下に表示されるアイコン
 * @default 75
 *
 * @param オート待機フレーム
 * @desc オートモードが有効の場合にメッセージを表示しておくフレーム数。制御文字\v[n]が指定できます。
 * @default 240
 *
 * @param イベント終了で解除
 * @desc イベント終了と共にスキップ、オート状態を解除します。(ON/OFF)
 * @default ON
 *
 * @help メッセージウィンドウでメッセージのスキップやオートモードの切替ができます。
 * イベントが終了すると自働でスキップやオートモードは解除されます。
 * 並列実行イベントは、通常イベントが実行中でない場合のみ解除されます。
 * 明示的に解除したい場合は、以下のスクリプトを実行してください。
 *
 * $gameMessage.clearSkipInfo();
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

    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
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
        page_up : 33, page_down : 34, end : 35, home : 36, left : 37, right : 39, up : 38, down : 40, insert : 45, delete : 46
    };
    (9).times(function(i) {
        Input.keyCodeReverseMapper[i] = i + 48;
    });
    (12).times(function(i) {
        Input.keyCodeReverseMapper['f' + (i + 1)] = i + 112;
    });

    var skipKeyName = getParamString('スキップキー').toLowerCase();
    var skipKeyCode = Input.keyCodeReverseMapper[skipKeyName];
    var autoKeyName = getParamString('オートキー').toLowerCase();
    var autoKeyCode = Input.keyCodeReverseMapper[autoKeyName];
    if (skipKeyCode) {
        if (!Input.keyMapper[skipKeyCode]) {
            Input.keyMapper[skipKeyCode] = 'messageSkip';
        } else {
            skipKeyName = Input.keyMapper[skipKeyCode];
        }
    }
    if (autoKeyCode) {
        if (!Input.keyMapper[autoKeyCode]) {
            Input.keyMapper[autoKeyCode] = 'messageAuto';
        } else {
            autoKeyName = Input.keyMapper[autoKeyCode];
        }
    }

    //=============================================================================
    // Game_Message
    //  メッセージスキップ情報を保持します。
    //=============================================================================
    var _Game_Message_initialize = Game_Message.prototype.initialize;
    Game_Message.prototype.initialize = function() {
        _Game_Message_initialize.apply(this, arguments);
        this.clearSkipInfo();
        this._autoClearSkip = getParamBoolean('イベント終了で解除');
    };

    Game_Message.prototype.toggleSkip = function() {
        this.setSkipFlg(!this._skipFlg);
        if (this._skipFlg) this._autoFlg = false;
    };

    Game_Message.prototype.toggleAuto = function() {
        if (!this._skipFlg) this.setAutoFlg(!this._autoFlg);
    };

    Game_Message.prototype.skipFlg = function() {
        return this._skipFlg;
    };

    Game_Message.prototype.autoFlg = function() {
        return this._autoFlg;
    };

    Game_Message.prototype.setSkipFlg = function(value) {
        this._skipFlg = value;
    };

    Game_Message.prototype.setAutoFlg = function(value) {
        this._autoFlg = value;
    };

    Game_Message.prototype.clearSkipInfo = function() {
        this._skipFlg = false;
        this._autoFlg = false;
    };

    Game_Message.prototype.terminateEvent = function() {
        if (this._autoClearSkip) this.clearSkipInfo();
    };

    //=============================================================================
    // Game_Interpreter
    //  マップイベント終了時にメッセージスキップフラグを初期化します。
    //=============================================================================
    var _Game_Interpreter_terminate = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function() {
        _Game_Interpreter_terminate.apply(this, arguments);
        if (this.isNeedClearSkip()) {
            $gameMessage.terminateEvent();
        }
    };

    Game_Interpreter.prototype.isNeedClearSkip = function() {
        return ($gameMap.isMapInterpreterOf(this) || !$gameMap.isEventRunning()) && this._depth === 0;
    };

    //=============================================================================
    // Game_Map
    //  指定されたインタプリタがマップイベントかどうかを返します。
    //=============================================================================
    Game_Map.prototype.isMapInterpreterOf = function(interpreter) {
        return this._interpreter === interpreter;
    };

    //=============================================================================
    // Window_Message
    //  メッセージスキップ状態を描画します。
    //=============================================================================
    var _Window_Message_initialize = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function() {
        _Window_Message_initialize.apply(this, arguments);
        this._icon = new Sprite_Frame(16, 20, ImageManager.loadSystem('IconSet'), -1);
        this._icon.x = this.width  - this._icon.width;
        this._icon.y = this.height - this._icon.height;
        this.addChild(this._icon);
    };

    var _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.apply(this, arguments);
        this._messageAutoCount = parseInt(convertEscapeCharacters(getParamString('オート待機フレーム', 1)));
    };

    var _Window_Message_update = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        this.updateAutoIcon();
        return _Window_Message_update.apply(this, arguments);
    };

    Window_Message.prototype.updateAutoIcon = function() {
        if (this.messageSkip() && this.openness === 255) {
            this._icon.refresh(getParamNumber('スキップアイコン'));
            this._icon.flashSpeed = 16;
            this._icon.flash = true;
        } else if (this.messageAuto() && this.openness === 255) {
            this._icon.refresh(getParamNumber('オートアイコン'));
            this._icon.flashSpeed = 2;
            this._icon.flash = true;
        } else {
            this._icon.refresh(0);
            this._icon.flash = false;
        }
    };

    var _Window_Message_updateWait = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function() {
        this.updateSkipAuto();
        return _Window_Message_updateWait.apply(this, arguments);
    };

    Window_Message.prototype.updateSkipAuto = function() {
        if (this.isAnySubWindowActive()) {
            $gameMessage.clearSkipInfo();
        } else if (this.isTriggeredMessageSkip()) {
            $gameMessage.toggleSkip();
        } else if (this.isTriggeredMessageAuto()) {
            $gameMessage.toggleAuto();
        }
    };

    Window_Message.prototype.messageAuto = function() {
        return $gameMessage.autoFlg();
    };

    Window_Message.prototype.messageSkip = function() {
        return $gameMessage.skipFlg();
    };

    var _Window_Message_updateInput = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        if (this.messageAuto() && this._messageAutoCount > 0 && this.visible) this._messageAutoCount--;
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
        return _Window_Message_isTriggered.apply(this, arguments) || this.messageSkip() ||
            (this.messageAuto() && this._messageAutoCount <= 0);
    };

    var _Window_Message_startPause = Window_Message.prototype.startPause;
    Window_Message.prototype.startPause = function() {
        _Window_Message_startPause.apply(this, arguments);
        if (this.messageSkip()) this.startWait(2);
    };

    //=============================================================================
    // Sprite_Frame
    //  アイコン描画用スプライトです。
    //=============================================================================
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
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.flash = false;
        this.flashSpeed = 2;
        this._flashAlpha = 0;
        this.refresh(index ? index : 0);
    };

    Sprite_Frame.prototype.refresh = function(index) {
        if (!this.bitmap.isReady()) return;
        var w = Math.floor(this.bitmap.width / this._column);
        var h = Math.floor(this.bitmap.height / this._row);
        this.setFrame((index % this._column) * w, Math.floor(index / this._column) * h, w, h);
    };

    Sprite_Frame.prototype.update = function() {
        if (this.flash) {
            if (this._flashAlpha <= -64) this._flashAlpha = 192;
            this.setBlendColor([255, 255, 255, this._flashAlpha]);
            this._flashAlpha -= this.flashSpeed;
        }
    };
})();

