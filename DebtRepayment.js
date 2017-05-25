//=============================================================================
// DebtRepayment.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2017/05/25 借金時のウィンドウ文字色を変更できる機能を追加
// 1.1.0 2017/05/25 一定金額までは借金してお店で商品を購入できる機能を追加
// 1.0.0 2016/06/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc DebtRepaymentPlugin
 * @author triacontane
 *
 * @param UnderLimitCanBuying
 * @desc お店で購入可能な下限の金額です。指定する場合はマイナス値を指定してください。制御文字\v[n]が指定可能です。
 * @default 0
 *
 * @param DebtTextColor
 * @desc 所持金ウィンドウで借金時の文字色を変更します。システムカラー番号（\c[n]）で指定します。
 * @default 0
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
/*:ja
 * @plugindesc 所持金マイナスプラグイン
 * @author トリアコンタン
 *
 * @param 購入可能下限金額
 * @desc お店で購入可能な下限の金額です。指定する場合はマイナス値を指定してください。制御文字\v[n]が指定可能です。
 * @default 0
 *
 * @param 借金文字色
 * @desc 所持金ウィンドウで借金時の文字色を変更します。システムカラー番号（\c[n]）で指定します。
 * @default 0
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

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg)) || 0).clamp(min, max);
    };

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param = {};
    param.underLimitCanBuying = getParamString(['UnderLimitCanBuying', '購入可能下限金額']);
    param.debtTextColor       = getParamNumber(['DebtTextColor', '借金文字色'], 0);

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

    Game_Party.prototype.getCanBuyingUnderLimit = function() {
        return this.isDebtEnable() ? Math.min(getArgNumber(param.underLimitCanBuying), this.maxGold()) : 0;
    };

    //=============================================================================
    // Scene_Shop
    //  購入可能下限金額を調整します。
    //=============================================================================
    var _Scene_Shop_money = Scene_Shop.prototype.money;
    Scene_Shop.prototype.money = function() {
        return _Scene_Shop_money.apply(this, arguments) - $gameParty.getCanBuyingUnderLimit();
    };

    //=============================================================================
    // Window_Gold
    //  借金時の文字色を変更します。
    //=============================================================================
    var _Window_Gold_resetTextColor = Window_Gold.prototype.resetTextColor;
    Window_Gold.prototype.resetTextColor = function() {
        if (param.debtTextColor > 0 && $gameParty.gold() < 0) {
            this.changeTextColor(this.textColor(param.debtTextColor));
        } else {
            _Window_Gold_resetTextColor.apply(this, arguments);
        }
    };
})();

