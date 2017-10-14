//=============================================================================
// WaitInterpreterCondition.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/10/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc WaitEventInterpreterPlugin
 * @author triacontane
 *
 * @help WaitInterpreterCondition.js
 *
 * イベント実行において条件を満たすまでウェイトします。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * WIC_WAIT_SWITCH 1         # スイッチ[1]がONになるまで待機
 * WIC_ウェイト_スイッチ     # 同上
 * WIC_WAIT_SCRIPT f         # 計算式[f]がtrueになるまで待機
 * WIC_ウェイト_スクリプト f # 同上
 *
 * 計算式では制御文字\v[n]などが使用できます。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 条件付きウェイトプラグイン
 * @author トリアコンタン
 *
 * @help WaitInterpreterCondition.js
 *
 * イベント実行において条件を満たすまでウェイトします。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * WIC_WAIT_SWITCH 1         # スイッチ[1]がONになるまで待機
 * WIC_ウェイト_スイッチ     # 同上
 * WIC_WAIT_SCRIPT f         # 計算式[f]がtrueになるまで待機
 * WIC_ウェイト_スクリプト f # 同上
 *
 * 計算式では制御文字\v[n]などが使用できます。
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
    var metaTagPrefix = 'WIC_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    var concatAllArguments = function(args) {
        return args.reduce(function(prevValue, arg) {
            return prevValue + ' ' + arg;
        }, '');
    };

    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var pluginCommandMap = new Map();
    setPluginCommand('WAIT_SWITCH', 'execWaitSwitch');
    setPluginCommand('ウェイト_スイッチ', 'execWaitSwitch');
    setPluginCommand('WAIT_SCRIPT', 'execWaitScript');
    setPluginCommand('ウェイト_スクリプト', 'execWaitScript');

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    Game_Interpreter._waitModeCondition = 'condition';

    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](args);
        }
    };

    Game_Interpreter.prototype.execWaitSwitch = function(args) {
        this._waitSwitchId = getArgNumber(convertEscapeCharacters(args[0]), 1);
        this.setWaitMode(Game_Interpreter._waitModeCondition);
    };

    Game_Interpreter.prototype.execWaitScript = function(args) {
        this._waitScript = concatAllArguments(args);
        this.setWaitMode(Game_Interpreter._waitModeCondition);
    };

    var _Game_Interpreter_updateWaitMode      = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode === Game_Interpreter._waitModeCondition) {
            if (this.isValidWaitSwitch()) {
                return true;
            }
            this._waitSwitchId = 0;
            if (this.isValidWaitScript()) {
                return true;
            }
            this._waitScript = '';
            this._waitMode   = '';
            return false;
        } else {
            return _Game_Interpreter_updateWaitMode.apply(this, arguments);
        }
    };

    Game_Interpreter.prototype.isValidWaitSwitch = function() {
        return this._waitSwitchId > 0 && !$gameSwitches.value(this._waitSwitchId);
    };

    Game_Interpreter.prototype.isValidWaitScript = function() {
        return this._waitScript && !eval(convertEscapeCharacters(this._waitScript));
    };
})();

