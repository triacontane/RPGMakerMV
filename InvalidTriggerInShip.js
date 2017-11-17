//=============================================================================
// InvalidTriggerInShip.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/11/18 トリガーごとに起動の有効/無効を設定できる機能を追加
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
 * @param InvalidActionButton
 * @desc 乗船時、決定ボタンによるイベント実行を無効化します。
 * @default true
 * @type boolean
 *
 * @param InvalidPlayerTouch
 * @desc 乗船時、プレイヤーからの接触によるイベント実行を無効化します。
 * @default true
 * @type boolean
 *
 * @param InvalidEventTouch
 * @desc 乗船時、イベントからの接触によるイベント実行を無効化します。
 * @default true
 * @type boolean
 *
 * @help InvalidTriggerInShip.js
 *
 * 小型船および大型船に乗っているとき、トリガーによるイベント起動を無効化します。
 * トリガーの種類ごとに有効/無効を設定できます。
 *
 * 自動実行および並列処理は実行されます。
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
 * @param 決定ボタントリガー無効
 * @desc 乗船時、決定ボタンによるイベント実行を無効化します。
 * @default true
 * @type boolean
 *
 * @param プレイヤー接触トリガー無効
 * @desc 乗船時、プレイヤーからの接触によるイベント実行を無効化します。
 * @default true
 * @type boolean
 *
 * @param イベント接触トリガー無効
 * @desc 乗船時、イベントからの接触によるイベント実行を無効化します。
 * @default true
 * @type boolean
 *
 * @help InvalidTriggerInShip.js
 *
 * 小型船および大型船に乗っているとき、トリガーによるイベント起動を無効化します。
 * トリガーの種類ごとに有効/無効を設定できます。
 *
 * 自動実行および並列処理は実行されます。
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
    var pluginName = 'InvalidTriggerInShip';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name !== undefined) return name;
        }
        alert('Fail to load plugin parameter of ' + pluginName + ':' + paramNames);
        return null;
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
    var param              = {};
    param.activateSwitchId = getParamNumber(['ActivateSwitchId', '有効スイッチ番号'], 0);
    param.invalicTriggers  = [];
    if (getParamBoolean(['InvalidActionButton', '決定ボタントリガー無効'], 0)) {
        param.invalicTriggers.push(0);
    }
    if (getParamBoolean(['InvalidPlayerTouch', 'プレイヤー接触トリガー無効'], 0)) {
        param.invalicTriggers.push(1);
    }
    if (getParamBoolean(['InvalidEventTouch', 'イベント接触トリガー無効'], 0)) {
        param.invalicTriggers.push(2);
    }

    //=============================================================================
    // Game_Player
    //  船に乗っているのトリガー無効判定を実装します。
    //=============================================================================
    Game_Player.prototype.isInvalidTriggerInShip = function() {
        return this.isInShipOrBoat() && this.isInvalidTriggerSwitch();
    };

    Game_Player.prototype.isInvalidTriggerSwitch = function() {
        return param.activateSwitchId > 0 ? $gameSwitches.value(param.activateSwitchId) : true;
    };

    Game_Player.prototype.isInShipOrBoat = function() {
        return this.isInShip() || this.isInBoat();
    };

    //=============================================================================
    // Game_Event
    //  船に乗っている間はイベントを無効にします。
    //=============================================================================
    var _Game_Event_start = Game_Event.prototype.start;
    Game_Event.prototype.start = function() {
        if ($gamePlayer.isInvalidTriggerInShip() && this.isTriggerIn(param.invalicTriggers)) {
            return;
        }
        _Game_Event_start.apply(this, arguments);
    };
})();

