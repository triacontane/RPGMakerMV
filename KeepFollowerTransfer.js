//=============================================================================
// KeepFollowerTransfer.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2024/11/06 MZ対応
// 1.0.0 2017/09/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [X]      : https://x.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc 場所移動時のフォロワー位置保存プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/KeepFollowerTransfer.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param validateSwitchId
 * @text 有効スイッチ番号
 * @desc プラグインの機能が有効になるスイッチ番号です。0を指定すると常に有効になります。
 * @default 0
 * @type switch
 *
 * @help KeepFollowerTransfer.js
 *
 * プレイヤーとフォロワーの位置関係および向きを維持したまま
 * 場所移動できるようになります。
 *
 * 維持した結果、画面外に出てしまった場合はプレイヤーと同位置になります。
 * イベントとの重なりおよび通行可否設定は考慮しません。
 *
 * このプラグインにはプラグインコマンドはありません。
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
    //  場所移動時にフォロワーの位置関係を記憶します。
    //=============================================================================
    const _Game_Player_performTransfer      = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        if (this.isTransferring() && this.isKeepFollowerPosition()) {
            this._followers.saveRelativePositionAll();
        }
        _Game_Player_performTransfer.apply(this, arguments);
    };

    Game_Player.prototype.isKeepFollowerPosition = function() {
        return param.validateSwitchId === 0 || $gameSwitches.value(param.validateSwitchId);
    };

    const _Game_Player_locate = Game_Player.prototype.locate;
    Game_Player.prototype.locate = function(x, y) {
        _Game_Player_locate.apply(this, arguments);
        this._followers.restoreRelativePositionAll();
    };

    //=============================================================================
    // Game_Followers
    //  場所移動時にフォロワーの位置関係を記憶します。
    //=============================================================================
    Game_Followers.prototype.saveRelativePositionAll = function() {
        this.data().forEach(follower => follower.saveRelativePosition());
    };

    Game_Followers.prototype.restoreRelativePositionAll = function() {
        this.data().forEach(follower => follower.restoreRelativePosition());
    };

    //=============================================================================
    // Game_Follower
    //  場所移動時にプレイヤーとの位置関係を記憶します。
    //=============================================================================
    Game_Follower.prototype.saveRelativePosition = function() {
        this._relativeX         = this.deltaXFrom($gamePlayer.x);
        this._relativeY         = this.deltaYFrom($gamePlayer.y);
        this._relativeDirection = this.direction();
    };

    Game_Follower.prototype.restoreRelativePosition = function() {
        if (!this.hasRelativePosition()) {
            return;
        }
        const newX = this.x + this._relativeX;
        const newY = this.y + this._relativeY;
        if (!$gameMap.isValid(newX, newY)) {
            return;
        }
        this.locate(newX, newY);
        this.setDirection(this._relativeDirection);
        this.clearRelativePosition();
    };

    Game_Follower.prototype.clearRelativePosition = function() {
        this._relativeX         = undefined;
        this._relativeY         = undefined;
        this._relativeDirection = undefined;
    };

    Game_Follower.prototype.hasRelativePosition = function() {
        return this._relativeX !== undefined && this._relativeY !== undefined;
    };
})();

