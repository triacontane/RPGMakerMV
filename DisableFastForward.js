//=============================================================================
// DisableFastForward.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc イベント高速化禁止プラグイン
 * @author トリアコンタン
 *
 * @help 決定ボタンやマウスをクリックし続けた場合のイベントの
 * 高速スキップを無効化できます。
 * プラグインコマンドから禁止/許可の設定ができます。
 * 設定値はセーブデータに保存されます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 *  イベント高速化禁止 or DISABLE_FAST_FORWARD
 *   イベントの高速スキップを禁止します。
 *
 *  イベント高速化許可 or ENABLE_FAST_FORWARD
 *   イベントの高速スキップを許可します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandDisableFastForward(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(Graphics.width, Graphics.height);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandDisableFastForward = function (command, args) {
        switch (getCommandName(command)) {
            case 'イベント高速化禁止' :
            case 'DISABLE_FAST_FORWARD' :
                $gameSystem.disableFastForward = true;
                break;
            case 'イベント高速化許可' :
            case 'ENABLE_FAST_FORWARD' :
                $gameSystem.disableFastForward = false;
                break;
        }
    };

    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this.disableFastForward = false;
    };

    var _Scene_Map_isFastForward = Scene_Map.prototype.isFastForward;
    Scene_Map.prototype.isFastForward = function() {
        return !$gameSystem.disableFastForward && _Scene_Map_isFastForward.apply(this, arguments);
    };
})();
