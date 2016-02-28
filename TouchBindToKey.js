//=============================================================================
// TouchBindToKey.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc マウス入力のキーバインドプラグイン
 * @author トリアコンタン
 *
 * @param 左クリックボタン
 * @desc 左クリックに対応するボタンです。
 * @default
 *
 * @param 中央クリックボタン
 * @desc 中央（ホイール）クリックに対応するボタンです。
 * @default
 *
 * @param 右クリックボタン
 * @desc 右クリックに対応するボタンです。
 * @default
 *
 * @param 元の動作を抑制
 * @desc もともとマウスに割り当てられていた機能を抑制します。
 * @default OFF
 *
 * @help マウスクリックを特定のボタンに紐付けます。
 * 紐付けた場合、クリックのもともとの動作は無効になります。
 *
 * ・パラメータに指定可能な文字列一覧
 * tab
 * ok
 * shift
 * control
 * escape
 * pageup
 * pagedown
 * left
 * up
 * right
 * down
 * debug
 * menu
 *
 * 注意！
 * 現状、マウス(PC)専用プラグインです。タッチ操作には対応していません。
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
    var pluginName = 'TouchBindToKey';

    var getParamString = function(paramNames, lowerFlg) {
        var value = getParamOther(paramNames);
        return value == null ? '' : lowerFlg ? value.toLowerCase() : value;
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

    var paramBindLeft   = getParamString(['BindLeft', '左クリックボタン']);
    var paramBindMiddle = getParamString(['BindMiddle', '中央クリックボタン']);
    var paramBindRight  = getParamString(['BindRight', '右クリックボタン']);
    var paramSuppress   = getParamBoolean(['Suppress', '元の動作を抑制']);

    //=============================================================================
    // TouchInput
    //  動作をキー入力情報に送信します。
    //=============================================================================
    var _TouchInput_update = TouchInput.update;
    TouchInput.update = function() {
        _TouchInput_update.apply(this, arguments);
        if (paramSuppress) {
            if (paramBindLeft) {
                this._mousePressed = false;
                this._released = false;
                this._triggered = false;
                this._pressedTime = 0;
            }
            if (paramBindRight) {
                this._cancelled = false;
            }
        }
    };

    var _TouchInput__onLeftButtonDown = TouchInput._onLeftButtonDown;
    TouchInput._onLeftButtonDown = function(event) {
        _TouchInput__onLeftButtonDown.apply(this, arguments);
        if (paramBindLeft) Input.setCurrentStateForMouseBind(paramBindLeft, true);
    };

    var _TouchInput__onMiddleButtonDown = TouchInput._onMiddleButtonDown;
    TouchInput._onMiddleButtonDown = function(event) {
        _TouchInput__onMiddleButtonDown.apply(this, arguments);
        if (paramBindMiddle) Input.setCurrentStateForMouseBind(paramBindMiddle, true);
    };

    var _TouchInput__onRightButtonDown = TouchInput._onRightButtonDown;
    TouchInput._onRightButtonDown = function(event) {
        _TouchInput__onRightButtonDown.apply(this, arguments);
        if (paramBindRight) Input.setCurrentStateForMouseBind(paramBindRight, true);
    };

    var _TouchInput__onMouseUp = TouchInput._onMouseUp;
    TouchInput._onMouseUp = function(event) {
        _TouchInput__onMouseUp.apply(this, arguments);
        if (event.button === 0) {
            if (paramBindLeft)   Input.setCurrentStateForMouseBind(paramBindLeft, false);
        } else if (event.button === 1) {
            if (paramBindMiddle) Input.setCurrentStateForMouseBind(paramBindMiddle, false);
        } else if (event.button === 2) {
            if (paramBindRight)  Input.setCurrentStateForMouseBind(paramBindRight, false);
        }
    };

    //=============================================================================
    // Input
    //  TouchInputから送信された情報を受け取ります。
    //=============================================================================
    Input.setCurrentStateForMouseBind = function(button, value) {
        this._currentState[button] = !!value;
    };
})();

