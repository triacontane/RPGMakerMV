//=============================================================================
// PlayerShiftTurn.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/07/09 8方向移動系（かつキャラクターの向きは4方向）のプラグインとの競合を解消
// 1.0.0 2016/01/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc プレイヤーのその場方向転換
 * @author トリアコンタン
 *
 * @param ボタン名称
 * @desc その場方向転換に使用するボタンです。
 * (shift or control or tab)
 * @default shift
 *
 * @help 指定されたキーを押している間、プレイヤーを移動させずに
 * その場で方向転換します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    'use strict';
    var pluginName = 'PlayerShiftTurn';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramButtonName = getParamString(['ButtonName', 'ボタン名称']).toLowerCase();

    //=============================================================================
    // Game_Player
    //  指定したボタンが押されていた場合にプレイヤーを移動させずに向きだけ変更します。
    //=============================================================================
    var _Game_Player_executeMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function(direction) {
        if (Input.isPressed(paramButtonName)) {
            if (direction === Input.dir4) {
                this.setDirection(direction);
            }
        } else {
            _Game_Player_executeMove.apply(this, arguments);
        }
    };
})();

