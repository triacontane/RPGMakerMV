//=============================================================================
// MouseBindToKey.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2024/10/10 プラグインの機能を一時的に無効化するスイッチを追加
// 1.1.1 2023/11/26 押し続けに対応
// 1.1.0 2023/11/26 MZで動作するよう修正
// 1.0.0 2016/02/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc マウス入力のキーバインドプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MouseBindToKey.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param LeftButton
 * @text 左クリックボタン
 * @desc 左クリックに対応するボタンです。
 * @default
 * @type select
 * @option tab
 * @option ok
 * @option shift
 * @option control
 * @option escape
 * @option pageup
 * @option pagedown
 * @option left
 * @option up
 * @option right
 * @option down
 * @option debug
 * @option menu
 *
 * @param MiddleButton
 * @text 中央クリックボタン
 * @desc 中央（ホイール）クリックに対応するボタンです。
 * @default
 * @type select
 * @option tab
 * @option ok
 * @option shift
 * @option control
 * @option escape
 * @option pageup
 * @option pagedown
 * @option left
 * @option up
 * @option right
 * @option down
 * @option debug
 * @option menu
 *
 * @param RightButton
 * @text 右クリックボタン
 * @desc 右クリックに対応するボタンです。
 * @default
 * @type select
 * @option tab
 * @option ok
 * @option shift
 * @option control
 * @option escape
 * @option pageup
 * @option pagedown
 * @option left
 * @option up
 * @option right
 * @option down
 * @option debug
 * @option menu
 *
 * @param Suppress
 * @text 元の動作を抑制
 * @desc もともとマウスに割り当てられていた機能を抑制します。割り当てのない中央ボタンには影響しません。
 * @default false
 * @type boolean
 *
 * @param InvalidateSwitch
 * @text 無効スイッチ
 * @desc 指定したスイッチがONのとき、本プラグインの機能が無効になります。
 * @default 0
 * @type switch
 *
 * @help MouseBindToKey.js
 *
 * マウスクリックを特定のボタン入力に割り当てることができます。
 * マウス(PC)入力専用プラグインです。タッチ操作には対応していません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _TouchInput__onLeftButtonDown = TouchInput._onLeftButtonDown;
    TouchInput._onLeftButtonDown = function(event) {
        _TouchInput__onLeftButtonDown.apply(this, arguments);
        if (param.LeftButton) {
            Input.setCurrentState(param.LeftButton, true);
        }
    };

    const _TouchInput__onMiddleButtonDown = TouchInput._onMiddleButtonDown;
    TouchInput._onMiddleButtonDown = function(event) {
        _TouchInput__onMiddleButtonDown.apply(this, arguments);
        if (param.MiddleButton) {
            Input.setCurrentState(param.MiddleButton, true);
        }
    };

    const _TouchInput__onRightButtonDown = TouchInput._onRightButtonDown;
    TouchInput._onRightButtonDown = function(event) {
        _TouchInput__onRightButtonDown.apply(this, arguments);
        if (param.RightButton) {
            Input.setCurrentState(param.RightButton, true);
        }
    };

    const _TouchInput__onMouseUp = TouchInput._onMouseUp;
    TouchInput._onMouseUp = function(event) {
        _TouchInput__onMouseUp.apply(this, arguments);
        if (param.LeftButton && event.button === 0) {
            Input.setCurrentState(param.LeftButton, false);
        }
        if (param.MiddleButton && event.button === 1) {
            Input.setCurrentState(param.MiddleButton, false);
        }
        if (param.RightButton && event.button === 2) {
            Input.setCurrentState(param.RightButton, false);
        }
    };

    Input.setCurrentState = function(button, value) {
        if ($gameSwitches.value(param.InvalidateSwitch)) {
            return;
        }
        this._currentState[button] = value;
    };

    const _TouchInput___onTrigger = TouchInput._onTrigger;
    TouchInput._onTrigger = function(x, y) {
        if (param.LeftButton && param.Suppress) {
            return;
        }
        _TouchInput___onTrigger.apply(this, arguments);
    };

    const _TouchInput__onCancel = TouchInput._onCancel;
    TouchInput._onCancel = function() {
        if (param.RightButton && param.Suppress) {
            return;
        }
        _TouchInput__onCancel.apply(this, arguments);
    };
})();

