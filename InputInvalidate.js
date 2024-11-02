/*=============================================================================
 InputInvalidate.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/11/02 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ボタン入力無効化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/InputInvalidate.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param inputList
 * @text 入力無効化設定
 * @desc 入力を無効化する設定のリストです。同名のボタンの設定は複数定義できません。
 * @default []
 * @type struct<Input>[]
 *
 * @help InputInvalidate.js
 *
 * 指定したスイッチがONのとき、指定したボタンの入力を無効化します。
 * タッチ入力には影響を与えません。
 *　
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~Input:
 * @param buttonName
 * @text ボタン名称
 * @desc 入力を無効化するボタンの名称です。独自に定義している場合はボタン名を直接入力します。
 * @default ok
 * @type combo
 * @option ok
 * @option cancel
 * @option shift
 * @option menu
 * @option pageup
 * @option pagedown
 * @option escape
 * @option debug
 * @option control
 * @option tab
 * @option left
 * @option up
 * @option right
 * @option down
 *
 * @param switchId
 * @text スイッチID
 * @desc ONのとき、指定したボタンの入力を無効化します。
 * @default 1
 * @type switch
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.inputList) {
        return;
    }
    const buttonMap = new Map();
    param.inputList.forEach(input => {
        buttonMap.set(input.buttonName, input.switchId);
    });

    const _Input_isPressed = Input.isPressed;
    Input.isPressed = function(keyName) {
        return _Input_isPressed.apply(this, arguments) && !this.isInvalid(keyName);
    };

    const _Input_isTriggered = Input.isTriggered;
    Input.isTriggered = function(keyName) {
        return _Input_isTriggered.apply(this, arguments) && !this.isInvalid(keyName);
    };

    const _Input_isRepeated = Input.isRepeated;
    Input.isRepeated = function(keyName) {
        return _Input_isRepeated.apply(this, arguments) && !this.isInvalid(keyName);
    };

    const _Input_isLongPressed = Input.isLongPressed;
    Input.isLongPressed = function(keyName) {
        return _Input_isLongPressed.apply(this, arguments) && !this.isInvalid(keyName);
    };

    Input.isInvalid = function(keyName) {
        return buttonMap.has(keyName) && $gameSwitches ? $gameSwitches.value(buttonMap.get(keyName)) : false;
    }
})();
