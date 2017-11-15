//=============================================================================
// InvalidTriggerInShip.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/11/15 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc InvalidTriggerOnShipPlugin
 * @author triacontane
 *
 * @param ActivateSwitchId
 * @desc プラグインの機能が有効になるスイッチ番号です。0を指定すると常に有効になります。
 * @default 0
 * @type switch
 *
 * @help InvalidTriggerInShip.js
 *
 * 小型船および大型船に乗っているときに、プレイヤーからの
 * トリガーによるイベント起動を無効化します。
 *
 * イベントからの接触、自動実行および並列処理は実行されます。
 * 飛行船に乗っているときと同じ仕様になります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 乗船時トリガー無効プラグイン
 * @author トリアコンタン
 *
 * @param 有効スイッチ番号
 * @desc プラグインの機能が有効になるスイッチ番号です。0を指定すると常に有効になります。
 * @default 0
 * @type switch
 *
 * @help InvalidTriggerInShip.js
 *
 * 小型船および大型船に乗っているときに、プレイヤーからの
 * トリガーによるイベント起動を無効化します。
 *
 * イベントからの接触、自動実行および並列処理は実行されます。
 * 飛行船に乗っているときと同じ仕様になります。
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
    var pluginName    = 'InvalidTriggerInShip';

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
    param.activateSwitchId = getParamNumber(['ActivateSwitchId', '有効スイッチ番号'], 0);

    //=============================================================================
    // Game_Player
    //  船に乗っている間はイベントを無効にします。
    //=============================================================================
    var _Game_Player_canStartLocalEvents = Game_Player.prototype.canStartLocalEvents;
    Game_Player.prototype.canStartLocalEvents = function() {
        return !this.isInvalidTriggerInShip() && _Game_Player_canStartLocalEvents.apply(this, arguments);
    };

    Game_Player.prototype.isInvalidTriggerInShip = function() {
        return this.isInShipOrBoat() && (param.activateSwitchId > 0 ? $gameSwitches.value(param.activateSwitchId) : true);
    };

    Game_Player.prototype.isInShipOrBoat = function() {
        return this.isInShip() || this.isInBoat();
    };
})();

