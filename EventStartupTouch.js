//=============================================================================
// EventStartupTouch.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2021/03/09 MZ向けにリファクタリング
// 1.1.3 2017/11/20 ヘルプのスクリプトの記述を追加
// 1.1.2 2017/02/07 端末依存の記述を削除
// 1.1.0 2016/12/29 スクリプトで通常モードと調査モードを切り替えられる機能を追加
// 1.0.0 2016/12/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc タッチでイベント起動プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventStartupTouch.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param InvalidSwitchId
 * @text 無効化スイッチ
 * @desc 指定したスイッチがONになっているとタッチ起動が無効になります。
 * @default 0
 * @type switch
 *
 * @param StartupSwitchId
 * @text 起動トリガースイッチ
 * @desc タッチでイベントを起動したときにONになるスイッチです。イベントが終わると自動でOFFに戻ります。
 * @default 0
 * @type switch
 *
 * @param ValidTriggers
 * @text 有効トリガー
 * @desc タッチ起動が有効になるトリガーです。
 * @default ["0","1","2"]
 * @type select[]
 * @option 決定ボタン[0]
 * @value 0
 * @option プレイヤーから接触[1]
 * @value 1
 * @option イベントから接触[2]
 * @value 2
 * @option 自動実行[3]
 * @value 3
 * @option 並列処理[4]
 * @value 4
 *
 * @help EventStartupTouch.js
 *
 * マウスクリックおよびタッチでイベントを起動します。
 * 起動されるのは現在の有効ページですが、任意のスイッチをONにできるので
 * 処理を分岐できます。イベントが終了すると当該スイッチは自動でOFFに戻ります。
 *
 * デフォルトのタッチ移動は強制的に無効化されます。
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Player
    //  タッチでイベントを起動する処理を追加します。
    //=============================================================================
    const _Game_Player_triggerTouchAction    = Game_Player.prototype.triggerTouchAction;
    Game_Player.prototype.triggerTouchAction = function() {
        const result = _Game_Player_triggerTouchAction.apply(this, arguments);
        if (!result && this.isTouchStartupValid()) {
            return this.triggerTouchActionStartupEvent();
        }
        return result;
    };

    Game_Player.prototype.isTouchStartupValid = function() {
        return !$gameSwitches.value(param.InvalidSwitchId) &&
            TouchInput.isTriggered() && !$gameMap.isEventRunning();
    };

    Game_Player.prototype.triggerTouchActionStartupEvent = function() {
        const event = this.getTouchStartupEvent();
        if (event) {
            $gameSwitches.setValue(param.StartupSwitchId, true);
            event.startForTouch();
        }
        return $gameMap.isAnyEventStarting();
    };

    Game_Player.prototype.getTouchStartupEvent = function() {
        const x = $gameMap.canvasToMapX(TouchInput.x);
        const y = $gameMap.canvasToMapY(TouchInput.y);
        let startupEvent = null;
        $gameMap.eventsXy(x, y).some(function(event) {
            if (event.isTriggerIn(param.ValidTriggers)) {
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
            $gameSwitches.setValue(param.StartupSwitchId, false);
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
        if ($gameTemp.isDestinationValid() && $gamePlayer.isTouchStartupValid() && $gamePlayer.getTouchStartupEvent()) {
            $gameTemp.clearDestination();
        }
    };
})();
