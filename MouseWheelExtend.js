//=============================================================================
// MouseWheelExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2017/05/18 ホイールクリックしたときにスイッチを切り替えられる機能を追加
// 1.1.0 2016/07/04 マウスホイールの状態をスイッチや変数に格納する機能など4種類の機能を追加
// 1.0.0 2016/07/03 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Mouse Wheel Extend
 * @author triacontane
 *
 * @param MessageScroll
 * @desc マウスホイールを手前に回転させてメッセージ送りをします。戻すことはできません。
 * @default ON
 *
 * @param CursorMove
 * @desc マウスホイールを動かしてウィンドウのカーソルを移動します。
 * @default ON
 *
 * @param WheelOk
 * @desc マウスホイールのクリックに決定ボタンと同等の機能を持たせます。
 * @default ON
 *
 * @param WheelCancel
 * @desc マウスホイールのクリックにキャンセルボタンと同等の機能を持たせます。
 * @default OFF
 *
 * @param WheelSwitch
 * @desc マウスホイールのクリックで任意のスイッチをONにします。マップ画面でのみ有効です。
 * @default 0
 *
 * @param WheelToggle
 * @desc マウスホイールのクリックで任意のスイッチをON/OFFを切り替えます。マップ画面でのみ有効です。
 * @default 0
 *
 * @param ScrollDirection
 * @desc マウスホイールのスクロールに十字キーと同等の機能を持たせます。
 * @default OFF
 *
 * @param ScrollVariable
 * @desc マウスホイールのスクロールで任意の変数に値を設定します。
 * 下:2 左:4 右:6 上:8　マップ画面でのみ有効です。
 * @default 0
 *
 * @param SensitivityY
 * @desc マウスホイールの縦回転の感度です。通常はこのままでOKです。
 * @default 20
 *
 * @param SensitivityX
 * @desc マウスホイールの横回転の感度です。通常はこのままでOKです。
 * @default 20
 *
 * @help あまり使用されていないマウスホイールの機能を拡張します。
 * 個別に使用可否を設定できます。
 * マウスホイールのない環境（スマートフォン、一部のPC）では意味がないので
 * 注意してください。マウスによっては左右スクロールがない or 正しく取得できない
 * 場合があります。
 *
 * ・メッセージ送り
 * マウスホイールを手前に回転させてメッセージ送りをします。戻すことはできません。
 *
 * ・カーソル移動
 * マウスホイールを動かしてウィンドウのカーソルを移動します。
 *
 * ・クリックで決定、キャンセル
 * マウスホイールのクリックに決定、キャンセルボタンと同等の機能を持たせます。
 * 両方指定すると決定ボタンが優先されます。
 *
 * ・クリックでスイッチ、トグル
 * マウスホイールのクリックで任意のスイッチをONにします。マップ画面でのみ有効です。
 * コモンイベントのトリガー等に使用できます。
 * トグルの場合はクリックするたびにスイッチのON/OFFが切り替わります。
 *
 * ・スクロールで十字キー
 * マウスホイールのスクロールに十字キーと同等の機能を持たせます。
 *
 * ・スクロールで変数
 * マウスホイールのスクロールで任意の変数に値を設定します。
 * 下:2 左:4 右:6 上:8　マップ画面でのみ有効です。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc マウスホイール拡張プラグイン
 * @author トリアコンタン
 *
 * @param メッセージ送り
 * @desc マウスホイールを手前に回転させてメッセージ送りをします。戻すことはできません。
 * @default ON
 *
 * @param カーソル移動
 * @desc マウスホイールを動かしてウィンドウのカーソルを移動します。
 * @default ON
 *
 * @param クリックで決定
 * @desc マウスホイールのクリックに決定ボタンと同等の機能を持たせます。
 * @default ON
 *
 * @param クリックでキャンセル
 * @desc マウスホイールのクリックにキャンセルボタンと同等の機能を持たせます。
 * @default OFF
 *
 * @param クリックでスイッチ
 * @desc マウスホイールのクリックで任意のスイッチをONにします。マップ画面でのみ有効です。
 * @default 0
 *
 * @param クリックでトグル
 * @desc マウスホイールのクリックで任意のスイッチをON/OFFを切り替えます。マップ画面でのみ有効です。
 * @default 0
 *
 * @param スクロールで十字キー
 * @desc マウスホイールのスクロールに十字キーと同等の機能を持たせます。
 * @default OFF
 *
 * @param スクロールで変数
 * @desc マウスホイールのスクロールで任意の変数に値を設定します。
 * 下:2 左:4 右:6 上:8　マップ画面でのみ有効です。
 * @default 0
 *
 * @param 感度Y
 * @desc マウスホイールの縦回転の感度です。通常はこのままでOKです。
 * @default 20
 *
 * @param 感度X
 * @desc マウスホイールの横回転の感度です。通常はこのままでOKです。
 * @default 20
 *
 * @help あまり使用されていないマウスホイールの機能を拡張します。
 * 個別に使用可否を設定できます。
 * マウスホイールのない環境（スマートフォン、一部のPC）では意味がないので
 * 注意してください。マウスによっては左右スクロールがない or 正しく取得できない
 * 場合があります。
 *
 * ・メッセージ送り
 * マウスホイールを手前に回転させてメッセージ送りをします。戻すことはできません。
 *
 * ・カーソル移動
 * マウスホイールを動かしてウィンドウのカーソルを移動します。
 *
 * ・クリックで決定、キャンセル
 * マウスホイールのクリックに決定、キャンセルボタンと同等の機能を持たせます。
 * 両方指定すると決定ボタンが優先されます。
 *
 * ・クリックでスイッチ、トグル
 * マウスホイールのクリックで任意のスイッチをONにします。マップ画面でのみ有効です。
 * コモンイベントのトリガー等に使用できます。
 * トグルの場合はクリックするたびにスイッチのON/OFFが切り替わります。
 *
 * ・スクロールで十字キー
 * マウスホイールのスクロールに十字キーと同等の機能を持たせます。
 *
 * ・スクロールで変数
 * マウスホイールのスクロールで任意の変数に値を設定します。
 * 下:2 左:4 右:6 上:8　マップ画面でのみ有効です。
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
    var pluginName = 'MouseWheelExtend';

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
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
    var paramCursorMove      = getParamBoolean(['CursorMove', 'カーソル移動']);
    var paramMessageScroll   = getParamBoolean(['MessageScroll', 'メッセージ送り']);
    var paramWheelOk         = getParamBoolean(['WheelOk', 'クリックで決定']);
    var paramWheelCancel     = getParamBoolean(['WheelCancel', 'クリックでキャンセル']);
    var paramWheelSwitch     = getParamNumber(['WheelSwitch', 'クリックでスイッチ'], 0);
    var paramWheelToggle     = getParamNumber(['WheelToggle', 'クリックでトグル'], 0);
    var paramScrollDirection = getParamBoolean(['ScrollDirection', 'スクロールで十字キー']);
    var paramScrollVariable  = getParamNumber(['ScrollVariable', 'スクロールで変数'], 0);
    var paramSensitivityY    = getParamNumber(['SensitivityY', '感度Y'], 1);
    var paramSensitivityX    = getParamNumber(['SensitivityX', '感度X'], 1);

    var _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function(sceneActive) {
        _Game_Map_update.apply(this, arguments);
        this.updateWheelTrigger();
    };

    Game_Map.prototype.updateWheelTrigger = function() {
        if (TouchInput.isMiddleTriggered()) {
            if (paramWheelSwitch) {
                $gameSwitches.setValue(paramWheelSwitch, true);
            }
            if (paramWheelToggle) {
                var prevValue = $gameSwitches.value(paramWheelToggle);
                $gameSwitches.setValue(paramWheelToggle, !prevValue);
            }
        }
        if (paramScrollVariable) {
            var prevValue = $gameVariables.value(paramScrollVariable);
            var value = 0;
            if (TouchInput.wheelX >= paramSensitivityX) {
                value = 4;
            }
            if (TouchInput.wheelX <= -paramSensitivityX) {
                value = 6;
            }
            if (TouchInput.wheelY >= paramSensitivityY) {
                value = 2;
            }
            if (TouchInput.wheelY <= -paramSensitivityY) {
                value = 8;
            }
            if (prevValue !== value) {
                $gameVariables.setValue(paramScrollVariable, value);
            }
        }
    };
    
    if (paramMessageScroll) {
        //=============================================================================
        // Window_Message
        //  ホイールでメッセージ送りをします。
        //=============================================================================
        var _Window_Message_isTriggered      = Window_Message.prototype.isTriggered;
        Window_Message.prototype.isTriggered = function() {
            return _Window_Message_isTriggered.apply(this, arguments) || TouchInput.wheelY >= paramSensitivityY;
        };
    }

    if (paramCursorMove) {
        //=============================================================================
        // Window_Selectable
        //  ホイールでカーソル移動をします。
        //=============================================================================
        var _Window_Selectable_processCursorMove      = Window_Selectable.prototype.processCursorMove;
        Window_Selectable.prototype.processCursorMove = function() {
            var lastIndex = this.index();
            _Window_Selectable_processCursorMove.apply(this, arguments);
            if (this.index() !== lastIndex) return;
            if (this.isCursorMovable()) {
                if (TouchInput.wheelY >= paramSensitivityY) {
                    this.cursorDown(false);
                }
                if (TouchInput.wheelY <= -paramSensitivityY) {
                    this.cursorUp(false);
                }
                if (TouchInput.wheelX >= paramSensitivityX) {
                    this.cursorLeft(false);
                }
                if (TouchInput.wheelX <= -paramSensitivityX) {
                    this.cursorRight(false);
                }
                if (this.index() !== lastIndex) {
                    SoundManager.playCursor();
                }
            }
        };
    }


    //=============================================================================
    // TouchInput
    //  ホイールクリックを決定ボタンにリンクします。
    //=============================================================================
    var _TouchInput_update2 = TouchInput.update;
    TouchInput.update = function() {
        _TouchInput_update2.apply(this, arguments);
        this._middleTriggered = this._events.middleTriggered;
        this._events.middleTriggered = false;
    };

    var _TouchInput__onMiddleButtonDown = TouchInput._onMiddleButtonDown;
    TouchInput._onMiddleButtonDown      = function(event) {
        _TouchInput__onMiddleButtonDown.apply(this, arguments);
        if (paramWheelOk) {
            Input.setCurrentStateForWheelExtendOk(true);
        } else if (paramWheelCancel) {
            Input.setCurrentStateForWheelExtendCancel(true);
        }
        this._events.middleTriggered = true;
    };

    var _TouchInput__onMouseUp = TouchInput._onMouseUp;
    TouchInput._onMouseUp      = function(event) {
        _TouchInput__onMouseUp.apply(this, arguments);
        if (event.button === 1) {
            if (paramWheelOk) {
                Input.setCurrentStateForWheelExtendOk(false);
            } else if (paramWheelCancel) {
                Input.setCurrentStateForWheelExtendCancel(false);
            }
        }
    };

    TouchInput.isMiddleTriggered = function() {
        return this._middleTriggered;
    };

    if (paramScrollDirection) {
        TouchInput._wheelValidFrame = 12;
        
        var _TouchInput__onWheel = TouchInput._onWheel;
        TouchInput._onWheel      = function(event) {
            _TouchInput__onWheel.apply(this, arguments);
            if (event.deltaY <= -paramSensitivityY) {
                this._wheelUp = TouchInput._wheelValidFrame;
                Input.setCurrentStateForWheelExtendUp(true);
            }
            if (event.deltaY >= paramSensitivityY) {
                this._wheelDown = TouchInput._wheelValidFrame;
                Input.setCurrentStateForWheelExtendDown(true);
            }
            if (event.deltaX <= -paramSensitivityX) {
                this._wheelRight = TouchInput._wheelValidFrame;
                Input.setCurrentStateForWheelExtendRight(true);
            }
            if (event.deltaX >= paramSensitivityX) {
                this._wheelLeft = TouchInput._wheelValidFrame;
                Input.setCurrentStateForWheelExtendLeft(true);
            }
        };

        var _TouchInput_update = TouchInput.update;
        TouchInput.update = function() {
            _TouchInput_update.apply(this, arguments);
            this.updateWheelDirection();
        };

        TouchInput.updateWheelDirection = function() {
            if (this._wheelUp > 0) {
                this._wheelUp--;
                if (this._wheelUp <= 0) {
                    Input.setCurrentStateForWheelExtendUp(false);
                }
            }
            if (this._wheelDown > 0) {
                this._wheelDown--;
                if (this._wheelDown <= 0) {
                    Input.setCurrentStateForWheelExtendDown(false);
                }
            }
            if (this._wheelRight > 0) {
                this._wheelRight--;
                if (this._wheelRight <= 0) {
                    Input.setCurrentStateForWheelExtendRight(false);
                }
            }
            if (this._wheelLeft > 0) {
                this._wheelLeft--;
                if (this._wheelLeft <= 0) {
                    Input.setCurrentStateForWheelExtendLeft(false);
                }
            }
        };
    }

    //=============================================================================
    // Input
    //  マウスホイールの情報をキー入力に変換します。
    //=============================================================================
    Input.setCurrentStateForWheelExtendOk = function(value) {
        this.setCurrentStateForWheelExtend(13, value);
    };

    Input.setCurrentStateForWheelExtendCancel = function(value) {
        this.setCurrentStateForWheelExtend(27, value);
    };

    Input.setCurrentStateForWheelExtendDown = function(value) {
        this.setCurrentStateForWheelExtend(40, value);
    };

    Input.setCurrentStateForWheelExtendLeft = function(value) {
        this.setCurrentStateForWheelExtend(37, value);
    };

    Input.setCurrentStateForWheelExtendRight = function(value) {
        this.setCurrentStateForWheelExtend(39, value);
    };

    Input.setCurrentStateForWheelExtendUp = function(value) {
        this.setCurrentStateForWheelExtend(38, value);
    };

    Input.setCurrentStateForWheelExtend = function(code, value) {
        this._currentState[this.keyMapper[code]] = !!value;
    };
})();

