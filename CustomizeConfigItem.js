//=============================================================================
// CustomizeConfigItem.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/01/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc オプション任意項目作成プラグイン
 * @author トリアコンタン
 *
 * 項目を増やしたい場合は、以下をコピーしてください。
 * -------------------------------------------------------
 * @param 数値項目1_名称
 * @desc 追加する数値項目の名称です。
 * @default 数値項目1
 *
 * @param 数値項目1_初期値
 * @desc 項目の初期値です。(0-100)
 * @default 0
 *
 * @param 数値項目1_番号
 * @desc 項目の値が格納される変数番号です。(1-5000)
 * @default 1
 *
 * @param 数値項目1_最小値
 * @desc 項目の値の最小値です。
 * @default 0
 *
 * @param 数値項目1_最大値
 * @desc 項目の値の最大値です。
 * @default 10
 *
 * @param 数値項目1_変化値
 * @desc 項目の値を操作したときに変化する値です。
 * @default 1
 *
 * @param 数値項目1_隠しフラグ
 * @desc 項目の値が表示されなくなります。(ON/OFF)
 * @default OFF
 * --------------------------------------------------------
 *
 * -------------------------------------------------------
 * @param 音量項目1_名称
 * @desc 追加する音量項目の名称です。
 * @default 音量項目1
 *
 * @param 音量項目1_初期値
 * @desc 項目の初期値です。(0-100)
 * @default 0
 *
 * @param 音量項目1_番号
 * @desc 項目の値が格納される変数番号です。(1-5000)
 * @default 1
 *
 * @param 音量項目1_隠しフラグ
 * @desc 項目の値が表示されなくなります。(ON/OFF)
 * @default OFF
 * --------------------------------------------------------
 *
 * --------------------------------------------------------
 * @param スイッチ項目1_名称
 * @desc 追加するスイッチ項目の名称です。
 * @default スイッチ項目1
 *
 * @param スイッチ項目1_初期値
 * @desc 項目の初期値です。(ON/OFF)
 * @default OFF
 *
 * @param スイッチ項目1_番号
 * @desc 項目の値が格納されるスイッチ番号です。(1-5000)
 * @default
 *
 * @param スイッチ項目1_隠しフラグ
 * @desc 項目の値が表示されなくなります。(ON/OFF)
 * @default OFF
 * --------------------------------------------------------
 *
 * @help オプション画面に任意の項目を追加します。
 * 追加した項目は、ゲーム開始時に指定された変数もしくはスイッチに自動で格納されます。
 * この値は、セーブファイル間で共有されます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 *  CC_ITEM_SET_VALUE or
 *  オプション任意項目の値設定 [項目名] [値]
 *  　指定した項目に値を設定します。
 *  使用例：CC_ITEM_VALID 数値項目1 100
 *
 *  CC_ITEM_VALID or
 *  オプション任意項目の有効化 [項目名]
 *  　指定した項目の隠しフラグを解除し、画面で編集できるようにします。
 *  　隠しフラグが設定されていない項目には効果はありません。
 *  使用例：CC_ITEM_VALID 数値項目1
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'CustomizeConfigItem';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() == 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    if (!Object.prototype.hasOwnProperty('iterate')) {
        Object.defineProperty(Object.prototype, 'iterate', {
            value : function (handler) {
                Object.keys(this).forEach(function (key, index) {
                    handler.call(this, key, this[key], index);
                }, this);
            }
        });
    }

    ConfigManager.customParams = null;
    ConfigManager.hiddenInfo = {};

    ConfigManager.getCustomParams = function() {
        if (this.customParams != null) return this.customParams;
        this.customParams = {};
        var i, result;
        for (i = 1, result = true; result; i++) {
            result = this._getCustomParamItem('スイッチ項目', 'Boolean', i);
        }
        for (i = 1, result = true; result; i++) {
            result = this._getCustomParamItem('数値項目', 'Number', i);
        }
        for (i = 1, result = true; result; i++) {
            result = this._getCustomParamItem('音量項目', 'Volume', i);
        }
        return this.customParams;
    };

    ConfigManager._getCustomParamItem = function(paramBaseName, symbolType, i) {
        var name = getParamString(paramBaseName + '%1_名称'.format(i));
        if (name) {
            var data       = {};
            data.symbol    = symbolType + '%1'.format(i);
            data.name      = name;
            data.initValue = getParamNumber(paramBaseName + '%1_初期値'.format(i));
            data.hidden    = getParamBoolean(paramBaseName + '%1_隠しフラグ'.format(i));
            data.variable  = getParamNumber(paramBaseName + '%1_番号'.format(i));
            if (symbolType === 'Number') {
                data.min    = getParamNumber(paramBaseName + '%1_最小値'.format(i));
                data.max    = getParamNumber(paramBaseName + '%1_最大値'.format(i));
                data.offset = getParamNumber(paramBaseName + '%1_変化値'.format(i));
            }
            this.customParams[data.symbol] = data;
        }
        return !!name;
    };

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = _ConfigManager_makeData.apply(this, arguments);
        config.hiddenInfo = {};
        this.getCustomParams().iterate(function(symbol) {
            config[symbol] = this[symbol];
            config.hiddenInfo[symbol] = this.hiddenInfo[symbol];
        }.bind(this));
        return config;
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        this.getCustomParams().iterate(function(symbol, item) {
            if (symbol.contains('Boolean')) {
                this[symbol] = config[symbol] ? this.readFlag(config, symbol) : item.initValue;
            } else if (symbol.contains('Volume')) {
                this[symbol] = config[symbol] ? this.readVolume(config, symbol) : item.initValue;
            } else {
                this[symbol] = config[symbol] ? this.readNumber(config, symbol, item) : item.initValue;
            }
            this.hiddenInfo[symbol] = item.hidden;
        }.bind(this));
    };

    ConfigManager.readNumber = function(config, name, item) {
        var value = config[name];
        if (value !== undefined) {
            return Number(value).clamp(item.min, item.max);
        } else {
            return item.initValue;
        }
    };

    var _Window_Options_initialize = Window_Options.prototype.initialize;
    Window_Options.prototype.initialize = function() {
        this._customParams = ConfigManager.getCustomParams();
        _Window_Options_initialize.apply(this, arguments);
    };

    var _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.apply(this, arguments);
        this.addCustomOptions();
    };

    Window_Options.prototype.addCustomOptions = function() {
        this._customParams.iterate(function(key, item) {
            if (!ConfigManager.hiddenInfo[key]) this.addCommand(item.name, key);
        }.bind(this));
    };

    var _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var result = _Window_Options_statusText.apply(this, arguments);
        var symbol = this.commandSymbol(index);
        var value  = this.getConfigValue(symbol);
        if (this.isNumberSymbol(symbol)) {
            result = this.numberStatusText(value);
        }
        return result;
    };

    Window_Options.prototype.isNumberSymbol = function(symbol) {
        return symbol.contains('Number');
    };

    Window_Options.prototype.numberStatusText = function(value) {
        return value;
    };

    var _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        if (!this.numberShift(1)) _Window_Options_processOk.apply(this, arguments);
    };

    var _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function(wrap) {
        if (!this.numberShift(1)) _Window_Options_cursorRight.apply(this, arguments);
    };

    var _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function(wrap) {
        if (!this.numberShift(-1)) _Window_Options_cursorLeft.apply(this, arguments);
    };

    Window_Options.prototype.numberShift = function(sign) {
        var symbol = this.commandSymbol(this.index());
        var value = this.getConfigValue(symbol);
        if (this.isNumberSymbol(symbol)) {
            value += this.numberOffset(symbol) * sign;
            value = value.clamp(this._customParams[symbol].min, this._customParams[symbol].max);
            this.changeValue(symbol, value);
            return true;
        }
        return false;
    };

    Window_Options.prototype.numberOffset = function(symbol) {
        var value = this._customParams[symbol].offset;
        if (Input.isPressed('shift')) value *= 10;
        return value;
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandCustomizeConfigItem(command, args);
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

    Game_Interpreter.prototype.pluginCommandCustomizeConfigItem = function (command, args) {
        switch (getCommandName(command)) {
            case 'XXXXX' :
                break;
        }
    };

    //=============================================================================
    // Game_CustomizeConfigItem
    //  CustomizeConfigItem
    //=============================================================================
    function Game_CustomizeConfigItem() {
        this.initialize.apply(this, arguments);
    }

    Game_CustomizeConfigItem.prototype.initialize = function () {

    };
})();

