//=============================================================================
// KeepFollowerTransfer.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/09/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc KeepFollowerTransferPlugin
 * @author triacontane
 *
 * @param ValidateSwitchId
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
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 場所移動時のフォロワー位置保存プラグイン
 * @author トリアコンタン
 *
 * @param 有効スイッチ番号
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

(function() {
    'use strict';
    var pluginName = 'KeepFollowerTransfer';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        alert('Fail to load plugin parameter of ' + pluginName);
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param              = {};
    param.validateSwitchId = getParamNumber(['ValidateSwitchId', '有効スイッチ番号'], 0);

    //=============================================================================
    // Game_Player
    //  場所移動時にフォロワーの位置関係を記憶します。
    //=============================================================================
    var _Game_Player_performTransfer      = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        if (this.isTransferring() && this.isKeepFollowerPosition()) {
            this._followers.saveRelativePositionAll();
        }
        _Game_Player_performTransfer.apply(this, arguments);
    };

    Game_Player.prototype.isKeepFollowerPosition = function() {
        return param.validateSwitchId === 0 || $gameSwitches.value(param.validateSwitchId)
    };

    var _Game_Player_locate = Game_Player.prototype.locate;
    Game_Player.prototype.locate = function(x, y) {
        _Game_Player_locate.apply(this, arguments);
        this._followers.restoreRelativePositionAll();
    };

    //=============================================================================
    // Game_Followers
    //  場所移動時にフォロワーの位置関係を記憶します。
    //=============================================================================
    Game_Followers.prototype.saveRelativePositionAll = function() {
        this.forEach(function(follower) {
            follower.saveRelativePosition();
        });
    };

    Game_Followers.prototype.restoreRelativePositionAll = function() {
        this.forEach(function(follower) {
            follower.restoreRelativePosition();
        });
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
        var newX = this.x + this._relativeX;
        var newY = this.y + this._relativeY;
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

