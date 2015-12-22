//=============================================================================
// GridScrollMap.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2015/11/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc マップの画面単位スクロールプラグイン
 * @author トリアコンタン
 * @version 1.00 2015/11/03 初版
 * 
 * @help マップ画面のスクロールを一画面単位で行う方式に変更します
 * （FCやGBのゼルダの伝説のような感じです）
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
(function () {

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[GRID_SCROLL_INVALID]などを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        switch (command.toUpperCase()) {
            case 'GRID_SCROLL_INVALID' :
                $gameMap._gridFlg = false;
                break;
            case 'GRID_SCROLL_VALID' :
                $gameMap._gridFlg = true;
                break;
        }
    };

    //=============================================================================
    // Game_Map
    //  画面単位スクロール機能を提供します。
    //=============================================================================
    var _Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function() {
        _Game_Map_initialize.call(this);
        this._gridFlg = true;
    };

    var _Game_Player_updateScroll = Game_Player.prototype.updateScroll;
    Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
        if (!$gameMap._gridFlg) {
            _Game_Player_updateScroll.call(this, lastScrolledX, lastScrolledY);
            return;
        }
        if (this.isStopping() && !$gameMap.isScrolling()) {
            $gameMap.updateGridScroll(this.scrolledX(), this.scrolledY(), lastScrolledX, lastScrolledY);
        }
    };

    Game_Map.prototype.updateGridScroll = function(scrolledX, scrolledY, lastScrolledX, lastScrolledY) {
        var screenTileX = this.screenTileX();
        var screenTileY = this.screenTileY();
        if (scrolledY > screenTileY - 1)                this.startScroll(2, screenTileY, 7);
        if (scrolledY < 0 && scrolledY < lastScrolledY) this.startScroll(8, screenTileY, 7);
        if (scrolledX > screenTileX - 1)                this.startScroll(6, screenTileX, 7);
        if (scrolledX < 0)                              this.startScroll(4, screenTileX, 7);
    };

    //=============================================================================
    // Game_Player
    //  スクロール時のプレイヤーの移動を禁止します。
    //  場所移動時に画面位置を調整します。
    //=============================================================================
    var _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        if ($gameMap._gridFlg && $gameMap.isScrolling()) {
            return false;
        }
        return _Game_Player_canMove.call(this);
    };

    var _Game_Player_locate = Game_Player.prototype.locate;
    Game_Player.prototype.locate = function(x, y) {
        _Game_Player_locate.call(this, x, y);
        if ($gameMap._gridFlg)
            $gameMap.setDisplayPos(x - x.mod($gameMap.screenTileX()), y - y.mod($gameMap.screenTileY()));
    };
})();