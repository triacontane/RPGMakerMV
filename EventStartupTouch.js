//=============================================================================
// EventStartupTouch.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.3 2017/11/20 ヘルプのスクリプトの記述を追加
// 1.1.2 2017/02/07 端末依存の記述を削除
// 1.1.0 2016/12/29 スクリプトで通常モードと調査モードを切り替えられる機能を追加
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
 * @type switch
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
 * ・スクリプト詳細（イベントコマンド「スクリプト」から実行）
 * タッチ起動を一時的に無効化します。
 * $gamePlayer.setTouchStartupDisable();
 *
 * 無効化したタッチ起動を再度有効化します。
 * $gamePlayer.setTouchStartupEnable();
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
 * @type switch
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
 * ・スクリプト詳細（イベントコマンド「スクリプト」から実行）
 * タッチ起動を一時的に無効化します。
 * $gamePlayer.setTouchStartupDisable();
 *
 * 無効化したタッチ起動を再度有効化します。
 * $gamePlayer.setTouchStartupEnable();
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
    var pluginName = 'EventStartupTouch';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamArrayString = function(paramNames) {
        var values = getParamString(paramNames).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getParamArrayNumber = function(paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) {
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
    var paramStartupSwitchId = getParamNumber(['StartupSwitchId', '起動スイッチ番号']);
    var paramValidTriggers   = getParamArrayNumber(['ValidTriggers', '有効トリガー']);

    //=============================================================================
    // Game_Player
    //  タッチでイベントを起動する処理を追加します。
    //=============================================================================
    Game_Player.prototype.setTouchStartupDisable = function() {
        this._touchStartupDisable = true;
    };

    Game_Player.prototype.setTouchStartupEnable = function() {
        this._touchStartupDisable = undefined;
    };

    var _Game_Player_triggerTouchAction    = Game_Player.prototype.triggerTouchAction;
    Game_Player.prototype.triggerTouchAction = function() {
        var result = _Game_Player_triggerTouchAction.apply(this, arguments);
        if (!result && this.isTouchStartupValid()) {
            return this.triggerTouchActionStartupEvent();
        }
        return result;
    };

    Game_Player.prototype.isTouchStartupValid = function() {
        return !this._touchStartupDisable && TouchInput.isTriggered() && !$gameMap.isEventRunning();
    };

    Game_Player.prototype.triggerTouchActionStartupEvent = function() {
        var event = this.getTouchStartupEvent();
        if (event) {
            $gameSwitches.setValue(paramStartupSwitchId, true);
            event.startForTouch();
        }
        return $gameMap.isAnyEventStarting();
    };

    Game_Player.prototype.getTouchStartupEvent = function() {
        var x = $gameMap.canvasToMapX(TouchInput.x);
        var y = $gameMap.canvasToMapY(TouchInput.y);
        var startupEvent = null;
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

    var _Game_Event_lock = Game_Event.prototype.lock;
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
    var _Game_Interpreter_terminate    = Game_Interpreter.prototype.terminate;
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
    var _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function() {
        _Scene_Map_processMapTouch.apply(this, arguments);
        if ($gameTemp.isDestinationValid() && $gamePlayer.isTouchStartupValid() && $gamePlayer.getTouchStartupEvent()) {
            $gameTemp.clearDestination();
        }
    };
})();
