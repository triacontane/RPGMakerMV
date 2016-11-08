//=============================================================================
// GridScrollMap.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2016/11/08 スクロール中のみ指定したスイッチをONにできる機能を追加
// 1.1.0 2016/06/29 タッチ移動でマップの境界線に移動した際に画面をスクロールする機能を追加
//                  半歩移動プラグインとの競合を解消
//                  コードのリファクタリング
// 1.0.0 2015/11/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc マップの画面単位スクロールプラグイン
 * @author トリアコンタン
 * 
 * @param スクロール速度
 * @desc 画面をスクロールする速度です。(6-8)
 * @default 7
 *
 * @param タッチ移動スクロール
 * @desc タッチ移動で境界線に移動した際に自動で一歩前進します。
 * @default ON
 *
 * @param トリガースイッチ番号
 * @desc スクロール開始と共に指定した番号のスイッチをONにすることができます。スクロールが終了すると自動でOFFに戻ります。
 * @default 0
 * 
 * @help マップ画面のスクロールをプレイヤーと同期せず
 * プレイヤーが画面外に出たら一画面分をスクロールする方式に
 * 変更します。（FCやGBのゼルダの伝説のような感じです）
 *
 * また、タッチ移動で画面端まで移動して、かつ移動後に画面外を向いている場合は
 * 自動で一歩前進して画面をスクロールさせることができます。
 *
 * 注意！
 * イベントコマンドの画面のスクロールで画面を動かしたら元の位置に戻してください。
 * 画面のループには対応していません。
 * 画面単位スクロールを解除したい場合は、プラグインコマンドを実行してください。
 * スクロール方式がその場で変わるので場所移動の直前に変更することを勧めます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *
 *  GRID_SCROLL_INVALID : マップの画面単位スクロールを無効にする。
 *  GRID_SCROLL_VALID : マップの画面単位スクロールを再度、有効にする。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function() {
    'use strict';
    var pluginName = 'GridScrollMap';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramScrollSpeed     = getParamNumber(['ScrollSpeed', 'スクロール速度'], 6, 8);
    var paramTouchMoveScroll = getParamBoolean(['TouchMoveScroll', 'タッチ移動スクロール']);
    var paramTriggerSwitch   = getParamNumber(['TriggerSwitch', 'トリガースイッチ番号'], 0);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[GRID_SCROLL_INVALID]などを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        switch (command.toUpperCase()) {
            case 'GRID_SCROLL_INVALID' :
                $gameMap.setGridScroll(false);
                break;
            case 'GRID_SCROLL_VALID' :
                $gameMap.setGridScroll(true);
                break;
        }
    };

    //=============================================================================
    // Game_Map
    //  画面単位スクロール機能を提供します。
    //=============================================================================
    var _Game_Map_initialize      = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function() {
        _Game_Map_initialize.apply(this, arguments);
        this._gridFlg = true;
    };

    Game_Map.prototype.isGridScroll = function() {
        return this._gridFlg;
    };

    Game_Map.prototype.setGridScroll = function(value) {
        this._gridFlg = !!value;
    };

    Game_Map.prototype.updateGridScroll = function(scrolledX, scrolledY) {
        if (this.isNeedGridScrollDown(scrolledY)) this.startGridScroll(2);
        if (this.isNeedGridScrollUp(scrolledY)) this.startGridScroll(8);
        if (this.isNeedGridScrollRight(scrolledX)) this.startGridScroll(6);
        if (this.isNeedGridScrollLeft(scrolledX)) this.startGridScroll(4);
        if (this.isSwitchForGridScroll() && !this.isScrolling()) {
            this.setSwitchForGridScroll(false);
        }
    };

    Game_Map.prototype.startGridScroll = function(direction) {
        var distance = (direction === 4 || direction === 6 ? this.screenTileX() : this.screenTileY());
        this.setSwitchForGridScroll(true);
        this.startScroll(direction, distance, paramScrollSpeed);
    };

    Game_Map.prototype.setSwitchForGridScroll = function(value) {
        if (paramTriggerSwitch) {
            $gameSwitches.setValue(paramTriggerSwitch, value);
        }
    };

    Game_Map.prototype.isSwitchForGridScroll = function() {
        return paramTriggerSwitch && $gameSwitches.value(paramTriggerSwitch);
    };

    Game_Map.prototype.isNeedGridScrollDown = function(scrolledY) {
        return scrolledY >= this.screenTileY();
    };

    Game_Map.prototype.isNeedGridScrollRight = function(scrolledX) {
        return scrolledX >= this.screenTileX();
    };

    Game_Map.prototype.isNeedGridScrollUp = function(scrolledY) {
        return scrolledY <= -1;
    };

    Game_Map.prototype.isNeedGridScrollLeft = function(scrolledX) {
        return scrolledX <= -1;
    };

    Game_Map.prototype.isGridMoveForTouch = function(scrolledX, scrolledY, direction) {
        return (this.isNeedTouchGridScrollDown(scrolledY) && direction === 2) ||
            (this.isNeedTouchGridScrollUp(scrolledY) && direction === 8) ||
            (this.isNeedTouchGridScrollRight(scrolledX) && direction === 6) ||
            (this.isNeedTouchGridScrollLeft(scrolledX) && direction === 4);
    };

    Game_Map.prototype.isNeedTouchGridScrollDown = function(scrolledY) {
        return scrolledY === this.screenTileY() - 1;
    };

    Game_Map.prototype.isNeedTouchGridScrollRight = function(scrolledX) {
        return scrolledX === this.screenTileX() - 1;
    };

    Game_Map.prototype.isNeedTouchGridScrollUp = function(scrolledY) {
        return scrolledY === 0;
    };

    Game_Map.prototype.isNeedTouchGridScrollLeft = function(scrolledX) {
        return scrolledX === 0;
    };

    //=============================================================================
    // Game_Player
    //  スクロール時のプレイヤーの移動を禁止します。
    //  場所移動時に画面位置を調整します。
    //=============================================================================
    var _Game_Player_updateScroll      = Game_Player.prototype.updateScroll;
    Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
        if (!$gameMap.isGridScroll()) {
            _Game_Player_updateScroll.apply(this, arguments);
            return;
        }
        if (this.isStopping() && !$gameMap.isScrolling()) {
            $gameMap.updateGridScroll(this.scrolledX(), this.scrolledY());
        }
    };

    var _Game_Player_canMove      = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        if ($gameMap.isGridScroll() && $gameMap.isScrolling()) {
            return false;
        }
        return _Game_Player_canMove.call(this);
    };

    var _Game_Player_locate      = Game_Player.prototype.locate;
    Game_Player.prototype.locate = function(x, y) {
        _Game_Player_locate.apply(this, arguments);
        if ($gameMap.isGridScroll())
            $gameMap.setDisplayPos(x - x.mod($gameMap.screenTileX()), y - y.mod($gameMap.screenTileY()));
    };

    var _Game_Player_moveByInput      = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function() {
        var prevDestinationValid = $gameTemp.isDestinationValid();
        _Game_Player_moveByInput.apply(this, arguments);
        if (paramTouchMoveScroll && prevDestinationValid && !this.isMoving()) {
            this.moveByTouchEnd();
        }
    };

    Game_Player.prototype.moveByTouchEnd = function() {
        if ($gameMap.isGridMoveForTouch(this.scrolledX(), this.scrolledY(), this.direction())) {
            this.executeMove(this.direction());
        }
    };
})();