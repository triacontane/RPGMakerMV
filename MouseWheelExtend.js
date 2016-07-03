//=============================================================================
// MouseWheelExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * @param SensitivityY
 * @desc マウスホイールの縦回転の感度です。通常はこのままでOKです。
 * @default 20
 *
 * @param SensitivityX
 * @desc マウスホイールの横回転の感度です。通常はこのままでOKです。
 * @default 20
 *
 * @help あまり使用されていないマウスホイールの機能を拡張します。
 * 以下の3つの機能があり、個別に使用可否を設定できます。
 *
 * ・メッセージ送り
 * マウスホイールを手前に回転させてメッセージ送りをします。戻すことはできません。
 *
 * ・カーソル移動
 * マウスホイールを動かしてウィンドウのカーソルを移動します。
 *
 * ・クリックで決定
 * マウスホイールのクリックに決定ボタンと同等の機能を持たせます。
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
 * @param 感度Y
 * @desc マウスホイールの縦回転の感度です。通常はこのままでOKです。
 * @default 20
 *
 * @param 感度X
 * @desc マウスホイールの横回転の感度です。通常はこのままでOKです。
 * @default 20
 *
 * @help あまり使用されていないマウスホイールの機能を拡張します。
 * 以下の3つの機能があり、個別に使用可否を設定できます。
 *
 * ・メッセージ送り
 * マウスホイールを手前に回転させてメッセージ送りをします。戻すことはできません。
 *
 * ・カーソル移動
 * マウスホイールを動かしてウィンドウのカーソルを移動します。
 *
 * ・クリックで決定
 * マウスホイールのクリックに決定ボタンと同等の機能を持たせます。
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
    var paramCursorMove    = getParamBoolean(['CursorMove', 'カーソル移動']);
    var paramMessageScroll = getParamBoolean(['MessageScroll', 'メッセージ送り']);
    var paramWheelOk       = getParamBoolean(['WheelOk', 'クリックで決定']);
    var paramSensitivityY  = getParamNumber(['SensitivityY', '感度Y'], 1);
    var paramSensitivityX  = getParamNumber(['SensitivityX', '感度X'], 1);

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

    if (paramWheelOk) {
        //=============================================================================
        // TouchInput
        //  ホイールクリックを決定ボタンにリンクします。
        //=============================================================================
        var _TouchInput__onMiddleButtonDown = TouchInput._onMiddleButtonDown;
        TouchInput._onMiddleButtonDown      = function(event) {
            _TouchInput__onMiddleButtonDown.apply(this, arguments);
            Input.setCurrentStateForWheelExtend(true);
        };

        var _TouchInput__onMouseUp = TouchInput._onMouseUp;
        TouchInput._onMouseUp      = function(event) {
            _TouchInput__onMouseUp.apply(this, arguments);
            if (event.button === 1) {
                Input.setCurrentStateForWheelExtend(false);
            }
        };

        Input.setCurrentStateForWheelExtend = function(value) {
            this._currentState[this.keyMapper[13]] = !!value;
        };
    }
})();

