//=============================================================================
// EventStartupTouch.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/12/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc EventStartupTouchPlugin
 * @author triacontane
 *
 * @param StartupSwitchId
 * @desc タッチでイベントを起動したときにONになるスイッチ番号
 * @default 0
 *
 * @param ValidTriggers
 * @desc タッチ起動が有効になるトリガーです。（0:決定ボタン……4:並列処理）
 * @default 0,1,2
 *
 * @help マウスクリックおよびタッチでイベントを起動します。
 * 起動されるのは現在の有効ページですが、任意のスイッチをONにできるので
 * そこで処理を分岐できます。イベントが終了すると当該スイッチは自動でOFFに戻ります。
 *
 * デフォルトのタッチ移動は強制的に無効化されます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc タッチでイベント起動プラグイン
 * @author トリアコンタン
 *
 * @param 起動スイッチ番号
 * @desc タッチでイベントを起動したときにONになるスイッチ番号
 * @default 0
 *
 * @param 有効トリガー
 * @desc タッチ起動が有効になるトリガーです。（0:決定ボタン……4:並列処理）
 * @default 0,1,2
 *
 * @help マウスクリックおよびタッチでイベントを起動します。
 * 起動されるのは現在の有効ページですが、任意のスイッチをONにできるので
 * そこで処理を分岐できます。イベントが終了すると当該スイッチは自動でOFFに戻ります。
 *
 * デフォルトのタッチ移動は強制的に無効化されます。
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
    const pluginName = 'EventStartupTouch';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    const getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (let i = 0; i < paramNames.length; i++) {
            const name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    const getParamString = function(paramNames) {
        const value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    const getParamNumber = function(paramNames, min, max) {
        const value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    const getParamArrayString = function(paramNames) {
        const values = getParamString(paramNames).split(',');
        for (let i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    const getParamArrayNumber = function(paramNames, min, max) {
        const values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (let i = 0; i < values.length; i++) {
            if (!isNaN(parseInt(values[i], 10))) {
                values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
            } else {
                values.splice(i--, 1);
            }
        }
        return values;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    const paramStartupSwitchId = getParamNumber(['StartupSwitchId', '起動スイッチ番号']);
    const paramValidTriggers   = getParamArrayNumber(['ValidTriggers', '有効トリガー']);

    //=============================================================================
    // Game_Player
    //  タッチでイベントを起動する処理を追加します。
    //=============================================================================
    const _Game_Player_triggerTouchAction    = Game_Player.prototype.triggerTouchAction;
    Game_Player.prototype.triggerTouchAction = function() {
        const result = _Game_Player_triggerTouchAction.apply(this, arguments);
        if (!result && !$gameMap.isEventRunning() && TouchInput.isTriggered()) {
            return this.triggerTouchActionStartupEvent();
        }
        return result;
    };

    Game_Player.prototype.triggerTouchActionStartupEvent = function() {
        const event = this.getTouchStartupEvent();
        if (event) {
            $gameSwitches.setValue(paramStartupSwitchId, true);
            event.startForTouch();
        }
        return $gameMap.isAnyEventStarting();
    };

    Game_Player.prototype.getTouchStartupEvent = function() {
        const x = $gameMap.canvasToMapX(TouchInput.x);
        const y = $gameMap.canvasToMapY(TouchInput.y);
        let startupEvent = null;
        $gameMap.eventsXy(x, y).some(function(event) {
            if (event.isTriggerIn(paramValidTriggers)) {
                startupEvent = event;
            }
            return startupEvent;
        });
        return startupEvent;
    };

    //=============================================================================
    // Game_Event
    //  イベントロックを無効にします。
    //=============================================================================
    Game_Event.prototype.startForTouch = function() {
        this._noLock = true;
        this.start();
        this._noLock = false;
    };

    const _Game_Event_lock = Game_Event.prototype.lock;
    Game_Event.prototype.lock = function() {
        _Game_Event_lock.apply(this, arguments);
        if (this._noLock) {
            this.setDirection(this._prelockDirection);
        }
    };

    //=============================================================================
    // Game_Interpreter
    //  マップイベント終了時にタッチスイッチをOFFにします。
    //=============================================================================
    const _Game_Interpreter_terminate    = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function() {
        _Game_Interpreter_terminate.apply(this, arguments);
        if ($gameMap.isMapInterpreterOf(this) && this._depth === 0) {
            $gameSwitches.setValue(paramStartupSwitchId, false);
        }
    };

    //=============================================================================
    // Game_Map
    //  指定されたインタプリタがマップイベントかどうかを返します。
    //=============================================================================
    Game_Map.prototype.isMapInterpreterOf = function(interpreter) {
        return this._interpreter === interpreter;
    };

    //=============================================================================
    // Scene_Map
    //  デフォルトのタッチ移動を無効化します。
    //=============================================================================
    const _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function() {
        _Scene_Map_processMapTouch.apply(this, arguments);
        if ($gameTemp.isDestinationValid() && $gamePlayer.getTouchStartupEvent()) {
            $gameTemp.clearDestination();
        }
    };
})();
