//=============================================================================
// CharacterFreeze.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/03/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc CharacterFreezePlugin
 * @author triacontane
 *
 * @param FreezeSwitchId
 * @desc キャラクターを全停止されるトリガーになるスイッチIDです。
 * @default
 *
 * @help イベントの自律移動とアニメーションを全停止します。
 * 同時にプレイヤーも動けなくなります。
 * パラメータで指定したスイッチをONにすると停止、OFFにすると再開します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc キャラクター停止プラグイン
 * @author トリアコンタン
 *
 * @param 停止スイッチID
 * @desc キャラクターを全停止されるトリガーになるスイッチIDです。
 * @default
 *
 * @help イベントの自律移動とアニメーションを全停止します。
 * 同時にプレイヤーも動けなくなります。
 * パラメータで指定したスイッチをONにすると停止、OFFにすると再開します。
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
    var pluginName    = 'CharacterFreeze';

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
    param.freezeSwitchId = getParamNumber(['FreezeSwitchId', '停止スイッチID']);

    Game_CharacterBase.prototype.isFreeze = function() {
        return $gameSwitches.value(param.freezeSwitchId);
    };

    var _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        if (this.isFreeze()) return;
        _Game_CharacterBase_update.apply(this, arguments);
    };

    var _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        return !this.isFreeze() && _Game_Player_canMove.apply(this, arguments);
    };
})();

