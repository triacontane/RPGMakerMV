//=============================================================================
// GridScrollMap.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.0 2021/09/17 ツクールMZで動作するよう修正
// 1.3.0 2018/02/25 パラメータの型指定機能に対応。スクロール速度の下限を緩和
// 1.2.0 2016/11/08 スクロール中のみ指定したスイッチをONにできる機能を追加
// 1.1.0 2016/06/29 タッチ移動でマップの境界線に移動した際に画面をスクロールする機能を追加
//                  半歩移動プラグインとの競合を解消
//                  コードのリファクタリング
// 1.0.0 2015/11/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc マップの画面単位スクロールプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/GridScrollMap.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 * 
 * @param scrollSpeed
 * @text スクロール速度
 * @desc 画面をスクロールする速度です。設定値は1～8ですが低い値を設定すると異常に遅くなります。
 * @default 7
 * @type number
 * @min 1
 * @max 8
 *
 * @param touchMoveScroll
 * @text タッチ移動スクロール
 * @desc タッチ移動で境界線に移動した際に自動で一歩前進します。
 * @default true
 * @type boolean
 *
 * @param scrollSwitch
 * @text スクロールスイッチ
 * @desc スクロール開始と共に指定した番号のスイッチをONにすることができます。スクロールが終了すると自動でOFFに戻ります。
 * @default 0
 * @type switch
 * 
 * @param invalidSwitch
 * @text 無効スイッチ
 * @desc 指定したスイッチがONのときプラグインの機能が無効になります。
 * @default 0
 * @type switch
 * 
 * @help マップ画面のスクロールをプレイヤーと同期せず
 * プレイヤーが画面外に出たら一画面分をスクロールする方式に
 * 変更します。（FCやGBのゼルダの伝説のような感じです）
 *
 * また、タッチ移動で画面端まで移動して、かつ移動後に画面外を向いている場合は
 * 自動で一歩前進して画面をスクロールさせることができます。
 *
 * 注意！
 * コマンド『画面のスクロール』で画面を動かしたら元の位置に戻してください。
 * 画面のループには対応していません。
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
    // Game_Map
    //  画面単位スクロール機能を提供します。
    //=============================================================================
    Game_Map.prototype.isGridScroll = function() {
        return !$gameSwitches.value(param.invalidSwitch);
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
        const distance = (direction === 4 || direction === 6 ? this.screenTileX() : this.screenTileY());
        this.setSwitchForGridScroll(true);
        this.startScroll(direction, distance, param.scrollSpeed);
    };

    Game_Map.prototype.setSwitchForGridScroll = function(value) {
        if (param.scrollSwitch) {
            $gameSwitches.setValue(param.scrollSwitch, value);
        }
    };

    Game_Map.prototype.isSwitchForGridScroll = function() {
        return param.scrollSwitch && $gameSwitches.value(param.scrollSwitch);
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
    const _Game_Player_updateScroll      = Game_Player.prototype.updateScroll;
    Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
        if (!$gameMap.isGridScroll()) {
            _Game_Player_updateScroll.apply(this, arguments);
            return;
        }
        if (this.isStopping() && !$gameMap.isScrolling()) {
            $gameMap.updateGridScroll(this.scrolledX(), this.scrolledY());
        }
    };

    const _Game_Player_canMove      = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        if ($gameMap.isGridScroll() && $gameMap.isScrolling()) {
            return false;
        }
        return _Game_Player_canMove.call(this);
    };

    const _Game_Player_locate      = Game_Player.prototype.locate;
    Game_Player.prototype.locate = function(x, y) {
        _Game_Player_locate.apply(this, arguments);
        if ($gameMap.isGridScroll())
            $gameMap.setDisplayPos(x - x.mod($gameMap.screenTileX()), y - y.mod($gameMap.screenTileY()));
    };

    const _Game_Player_moveByInput      = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function() {
        const prevDestinationValid = $gameTemp.isDestinationValid();
        _Game_Player_moveByInput.apply(this, arguments);
        if (param.touchMoveScroll && prevDestinationValid && !this.isMoving()) {
            this.moveByTouchEnd();
        }
    };

    Game_Player.prototype.moveByTouchEnd = function() {
        if ($gameMap.isGridMoveForTouch(this.scrolledX(), this.scrolledY(), this.direction())) {
            this.executeMove(this.direction());
        }
    };
})();
