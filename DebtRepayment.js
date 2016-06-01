//=============================================================================
// DebtRepayment.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/06/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 所持金マイナスプラグイン
 * @author トリアコンタン
 *
 * @help 所持金をマイナスにすることができます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * 所持金をマイナスに設定することを一時的に禁止します。
 *  DR借金禁止
 *  DR_DEBT_DISABLE
 *
 * 所持金をマイナスに設定することを再度許可します。
 *  DR借金許可
 *  DR_DEBT_ENABLE
 *
 * 所持金がマイナスの場合、ゼロに戻します。
 *  DR借金返済
 *  DR_REPAY_GOLD
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'DebtRepayment';
    var metaTagPrefix = 'DR';

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandDebtRepayment(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.stack || e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandDebtRepayment = function(command, args) {
        switch (getCommandName(command)) {
            case metaTagPrefix + '借金禁止' :
            case metaTagPrefix + '_DEBT_DISABLE' :
                $gameParty.setDebtDisable(true);
                break;
            case metaTagPrefix + '借金許可' :
            case metaTagPrefix + '_DEBT_ENABLE' :
                $gameParty.setDebtDisable(false);
                break;
            case metaTagPrefix + '借金返済' :
            case metaTagPrefix + '_REPAY_GOLD' :
                $gameParty.repayGold();
                break;
        }
    };

    //=============================================================================
    // Game_Party
    //  所持金を調整します。
    //=============================================================================
    var _Game_Party_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function() {
        _Game_Party_initialize.apply(this, arguments);
        this._debtDisable = false;
    };

    var _Game_Party_gainGold = Game_Party.prototype.gainGold;
    Game_Party.prototype.gainGold = function(amount) {
        if (!this.isDebtEnable()) {
            _Game_Party_gainGold.apply(this, arguments);
        } else {
            this._gold = (this._gold + amount).clamp(-this.maxGold(), this.maxGold());
        }
    };

    Game_Party.prototype.repayGold = function() {
        if (this._gold < 0) this._gold = 0;
    };

    Game_Party.prototype.isDebtEnable = function() {
        return !this._debtDisable;
    };

    Game_Party.prototype.setDebtDisable = function(value) {
        this._debtDisable = !!value;
    };
})();

