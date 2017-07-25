//=============================================================================
// HorizontalScrollingMove.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/07/25 上向きを許容するパラメータを追加
// 1.0.0 2017/03/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc HorizontalScrollingMovePlugin
 * @author triacontane
 *
 * @param ValidSwitchId
 * @desc 横スクロール移動が有効になるスイッチ番号です。0を指定すると常に有効になります。
 * @default 0
 * @type switch
 *
 * @param ValidUpPlayer
 * @desc プレイヤーが上下に移動するときは上向きを許容します。
 * @default false
 * @type boolean
 *
 * @param ValidUpEvent
 * @desc イベントが上下に移動するときは上向きを許容します。
 * @default false
 * @type boolean
 *
 * @help キャラクターが移動する際の向きを左右に限定します。
 * 主に横スクロールのゲームにおけるキャラ移動を想定しています。
 * ただし、梯子属性のタイルでは例外的に上を向きます。
 *
 * 指定したスイッチがONのときのみ有効です。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 横スクロール移動プラグイン
 * @author トリアコンタン
 *
 * @param 有効スイッチ番号
 * @desc 横スクロール移動が有効になるスイッチ番号です。0を指定すると常に有効になります。
 * @default 0
 * @type switch
 *
 * @param プレイヤー上向き許容
 * @desc プレイヤーが上下に移動するときは上向きを許容します。
 * @default false
 * @type boolean
 *
 * @param イベント上向き許容
 * @desc イベントが上下に移動するときは上向きを許容します。
 * @default false
 * @type boolean
 *
 * @help キャラクターが移動する際の向きを左右に限定します。
 * 主に横スクロールのゲームにおけるキャラ移動を想定しています。
 * ただし、梯子属性のタイルでは例外的に上を向きます。
 *
 * 指定したスイッチがONのときのみ有効です。
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
    var pluginName = 'HorizontalScrollingMove';

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
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'TRUE';
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param           = {};
    param.validSwitchId = getParamNumber(['ValidSwitchId', '有効スイッチ番号']);
    param.validUpPlayer = getParamBoolean(['ValidUpPlayer', 'プレイヤー上向き許容']);
    param.validUpEvent  = getParamBoolean(['ValidUpEvent', 'イベント上向き許容']);

    //=============================================================================
    // Game_CharacterBase
    //  横移動時に別の方向を向こうとした場合、矯正します。
    //=============================================================================
    var _Game_CharacterBase_setDirection      = Game_CharacterBase.prototype.setDirection;
    Game_CharacterBase.prototype.setDirection = function(d) {
        var prevDirection = this.direction();
        _Game_CharacterBase_setDirection.apply(this, arguments);
        if (this.isHorizontalMove()) {
            this.modifyDirectionForHorizontalMove(prevDirection);
        }
    };

    Game_CharacterBase.prototype.isHorizontalMove = function() {
        return !param.validSwitchId || $gameSwitches.value(param.validSwitchId);
    };

    Game_CharacterBase.prototype.modifyDirectionForHorizontalMove = function(prevDirection) {
        if (this.isNeedModifyDirection() && !this.isOnLadder() && !this.isDirectionFixed()) {
            this._direction = prevDirection;
        }
    };

    Game_CharacterBase.prototype.isNeedModifyDirection = function() {
        return this.direction() === 2 || (this.isNeedModifyUpper() && this.direction() === 8);
    };

    Game_CharacterBase.prototype.isNeedModifyUpper = function() {
        return false;
    };

    Game_Player.prototype.isNeedModifyUpper= function() {
        return !param.validUpPlayer;
    };

    Game_Follower.prototype.isNeedModifyUpper= function() {
        return !param.validUpPlayer;
    };

    Game_Event.prototype.isNeedModifyUpper = function() {
        return !param.validUpEvent;
    };
})();

