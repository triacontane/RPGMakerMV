//=============================================================================
// HorizontalScrollingMove.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * @desc 横スクロール移動が有効になるスイッチ番号です。
 * @default 1
 *
 * @help キャラクターの向きを左右に限定します。
 * 主に横スクロールのゲームにおけるキャラ移動を想定します。
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
 * @desc 横スクロール移動が有効になるスイッチ番号です。
 * @default 1
 *
 * @help キャラクターの向きを左右に限定します。
 * 主に横スクロールのゲームにおけるキャラ移動を想定します。
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
    var pluginName    = 'HorizontalScrollingMove';

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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param       = {};
    param.validSwitchId = getParamNumber(['ValidSwitchId', '有効スイッチ番号']);

    var _Game_CharacterBase_setDirection = Game_CharacterBase.prototype.setDirection;
    Game_CharacterBase.prototype.setDirection = function(d) {
        var prevDirection = this.direction();
        _Game_CharacterBase_setDirection.apply(this, arguments);
        if ($gameSwitches.value(param.validSwitchId)) {
            this.modifyDirectionForHorizontalMove(prevDirection);
        }
    };

    Game_CharacterBase.prototype.modifyDirectionForHorizontalMove = function(prevDirection) {
        if (!this.isOnLadder() && (this.direction() === 2 || this.direction() === 8) && !this.isDirectionFixed()) {
            this._direction = prevDirection;
        }
    };
})();

