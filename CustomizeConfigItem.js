//=============================================================================
// CustomizeConfigItem.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.3 2017/06/08 1.2.2の修正により起動できなくなっていた問題を修正
// 1.2.2 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.2.1 2016/12/08 1.2.0の機能追加以降、デフォルト項目で決定ボタンを押すとエラーになっていた現象を修正
// 1.2.0 2016/12/02 各項目で決定ボタンを押したときに実行されるスクリプトを設定できる機能を追加
// 1.1.1 2016/08/14 スイッチ項目、音量項目の初期値が無効になっていた問題を修正
// 1.1.0 2016/04/29 項目をクリックしたときに項目値が循環するよう修正
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
 * @param スイッチ項目1
 * @desc 項目の情報です。以下の順で指定します。
 * 名称:初期値:スイッチ番号:隠しフラグ:スクリプト
 * @default スイッチ項目1:OFF:0:OFF:
 *
 * @param 数値項目1
 * @desc 項目の情報です。以下の順で指定します。
 * 名称:初期値:変数番号:隠しフラグ:最小値:最大値:変化値:スクリプト
 * @default 数値項目1:0:0:OFF:0:10:1:
 *
 * @param 音量項目1
 * @desc 項目の情報です。以下の順で指定します。
 * 名称:初期値:変数番号:隠しフラグ:スクリプト
 * @default 音量項目1:0:0:OFF:
 *
 * @param 文字項目1
 * @desc 項目の情報です。以下の順で指定します。
 * 名称:初期値:変数番号:隠しフラグ:文字配列:スクリプト
 * @default 文字項目1:0:0:OFF:EASY, NORMAL, HARD, VERY HARD:
 *
 * @param スイッチ項目2
 * @desc 項目の情報です。以下の順で指定します。
 * 名称,初期値:スイッチ番号:隠しフラグ:スクリプト
 * @default スイッチ項目2:OFF:0:OFF:
 *
 * @param 数値項目2
 * @desc 項目の情報です。以下の順で指定します。
 * 名称:初期値:変数番号:隠しフラグ:最小値:最大値:変化値:スクリプト
 * @default 数値項目2:0:0:OFF:0:10:1:
 *
 * @param 音量項目2
 * @desc 項目の情報です。以下の順で指定します。
 * 名称:初期値:変数番号:隠しフラグ:スクリプト
 * @default 音量項目2:0:0:OFF:
 *
 * @param 文字項目2
 * @desc 項目の情報です。以下の順で指定します。
 * 名称:初期値:変数番号:隠しフラグ:文字配列:スクリプト
 * @default 文字項目2:0:0:OFF:EASY, NORMAL, HARD, VERY HARD:
 * --------------------------------------------------------
 *
 * @help オプション画面に任意の項目を追加します。
 * 項目の種類は、以下の四種類があります。
 * 不要な項目は値を空に設定してください。
 *
 * ・スイッチ項目：
 * ON/OFFを選択する項目です。指定した番号のスイッチと値が同期されます。
 * オプションから値を設定すれば、それがスイッチに反映され、
 * スイッチを変更すれば、オプションの値に反映されます。
 * さらに、値はセーブデータ間で共有されます。
 * 隠しフラグを設定すると、オプション画面に表示されなくなります。
 * ゲームを進めないと出現しない項目などに利用できます。
 * 隠しフラグはプラグインコマンドから解除できます。
 * それぞれの値はコロン（:）区切りで指定してください。
 *
 * スクリプトは上級者向け項目です。対象にカーソルを合わせて決定ボタンを
 * 押下すると指定したJavaScriptを実行できます。
 * 主に専用の設定画面などの遷移に使用します。
 *
 * 指定項目「名称:初期値:値が設定されるスイッチ:隠しフラグ:スクリプト」
 * 例：スイッチ項目1:OFF:1:OFF:script
 *
 * ・数値項目：
 * 数値を選択する項目です。指定した番号の変数と値が同期されます。
 * スイッチ項目で指定した内容に加えて、
 * 最小値と最大値および一回の入力で変化する値を指定します。
 *
 * 指定項目「名称:初期値:値が設定される変数:隠しフラグ:最小値:最大値:変化値:スクリプト」
 * 例：数値項目1:0:1:OFF:0:10:1:
 *
 * ・音量項目：
 * 音量を選択する項目です。BGMボリュームなどと同じ仕様で
 * キャラクターごとのボイス音量等に使ってください。
 *
 * 指定項目「名称:初期値:値が設定される変数:隠しフラグ:スクリプト」
 * 例：音量項目1:0:2:OFF:SceneManager.push(Scene_SoundTest);
 *
 * ・文字項目：
 * 文字を選択する項目です。指定した文字の配列から項目を選択します。
 * 選択した文字のインデックス(開始位置は0)が変数に設定されます。
 * 初期値に設定する値もインデックスです。
 *
 * 設定項目「名称:初期値:値が設定される変数:隠しフラグ:文字の配列:スクリプト」
 * 例：文字項目1:0:3:OFF:EASY, NORMAL, HARD, VERY HARD:script
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 *  CC_UNLOCK or
 *  オプション任意項目の隠し解除 [項目名]
 *  　指定した項目の隠しフラグを解除します。
 *  使用例：CC_ITEM_VALID 数値項目1
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName = 'CustomizeConfigItem';

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

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getArgArrayString = function(args, upperFlg) {
        var values = getArgString(args, upperFlg).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getArgString = function(args, upperFlg) {
        return upperFlg ? args.toUpperCase() : args;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg, 10) || 0).clamp(min, max);
    };

    var getArgBoolean = function(arg) {
        return (arg || '').toUpperCase() === 'ON';
    };

    var iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };

    var localOptionWindowIndex = 0;

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
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

    Game_Interpreter.prototype.pluginCommandCustomizeConfigItem = function(command, args) {
        switch (getCommandName(command)) {
            case 'CC_UNLOCK' :
            case 'オプション任意項目の隠し解除' :
                ConfigManager.customParamUnlock(args[0]);
                break;
        }
    };

    //=============================================================================
    // ConfigManager
    //  追加項目の設定値や初期値を管理します。
    //=============================================================================
    ConfigManager.customParams = null;
    ConfigManager.hiddenInfo   = {};

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
        for (i = 1, result = true; result; i++) {
            result = this._getCustomParamItem('文字項目', 'String', i);
        }
        return this.customParams;
    };

    ConfigManager._getCustomParamItem = function(paramBaseName, symbolType, i) {
        var param = getParamString(paramBaseName + '%1'.format(i)).split(':');
        if (param.length > 1) {
            try {
                var data       = {};
                data.symbol    = symbolType + '%1'.format(i);
                data.name      = getArgString(param[0]);
                data.initValue = symbolType === 'Boolean' ? getArgBoolean(param[1]) : getArgNumber(param[1]);
                data.variable  = getArgNumber(param[2]);
                data.hidden    = getArgBoolean(param[3]);
                data.script    = getArgString(param[param.length - 1]);
                switch (symbolType) {
                    case 'Number':
                        data.min    = getArgNumber(param[4]);
                        data.max    = getArgNumber(param[5]);
                        data.offset = getArgNumber(param[6]);
                        break;
                    case 'String':
                        data.values = getArgArrayString(param[4]);
                        data.min    = 0;
                        data.max    = data.values.length - 1;
                        break;
                }
                this.customParams[data.symbol] = data;
            } catch (e) {
                console.log('パラメータの指定に不正があります。: ' + param + ' : ' + e.toString());
                return false;
            }
            return true;
        }
        return false;
    };

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData      = function() {
        var config        = _ConfigManager_makeData.apply(this, arguments);
        config.hiddenInfo = {};
        iterate(this.getCustomParams(), function(symbol) {
            config[symbol]            = this[symbol];
            config.hiddenInfo[symbol] = this.hiddenInfo[symbol];
        }.bind(this));
        return config;
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData      = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        iterate(this.getCustomParams(), function(symbol, item) {
            if (symbol.contains('Boolean')) {
                this[symbol] = this.readFlagCustom(config, symbol, item);
            } else if (symbol.contains('Volume')) {
                this[symbol] = this.readVolumeCustom(config, symbol, item);
            } else {
                this[symbol] = this.readOther(config, symbol, item);
            }
            this.hiddenInfo[symbol] = (config.hiddenInfo != null ? config.hiddenInfo[symbol] : item.hidden);
        }.bind(this));
    };

    ConfigManager.customParamUnlock = function(name) {
        iterate(this.getCustomParams(), function(symbol, item) {
            if (item.name === name) this.hiddenInfo[symbol] = false;
        }.bind(this));
        this.save();
    };

    ConfigManager.readOther = function(config, name, item) {
        var value = config[name];
        if (value !== undefined) {
            return Number(value).clamp(item.min, item.max);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.readFlagCustom = function(config, name, item) {
        if (config[name] !== undefined) {
            return this.readFlag(config, name);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.readVolumeCustom = function(config, name, item) {
        if (config[name] !== undefined) {
            return this.readVolume(config, name);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.exportCustomParams = function() {
        if (!$gameVariables || !$gameSwitches) return;
        iterate(this.getCustomParams(), function(symbol, item) {
            if (item.variable > 0) {
                if (symbol.contains('Boolean')) {
                    $gameSwitches.setValue(item.variable, !!this[symbol]);
                } else {
                    $gameVariables.setValue(item.variable, this[symbol]);
                }
            }
        }.bind(this));
    };

    ConfigManager.importCustomParams = function() {
        if (!$gameVariables || !$gameSwitches) return;
        iterate(this.getCustomParams(), function(symbol, item) {
            if (item.variable > 0) {
                if (symbol.contains('Boolean')) {
                    this[symbol] = $gameSwitches.value(item.variable);
                } else if (symbol.contains('Volume')) {
                    this[symbol] = $gameVariables.value(item.variable).clamp(0, 100);
                } else {
                    this[symbol] = $gameVariables.value(item.variable).clamp(item.min, item.max);
                }
            }
        }.bind(this));
    };

    var _ConfigManager_save = ConfigManager.save;
    ConfigManager.save      = function() {
        _ConfigManager_save.apply(this, arguments);
        this.exportCustomParams();
    };

    //=============================================================================
    // Game_Map
    //  リフレッシュ時にオプション値を同期します。
    //=============================================================================
    var _Game_Map_refresh      = Game_Map.prototype.refresh;
    Game_Map.prototype.refresh = function() {
        _Game_Map_refresh.apply(this, arguments);
        ConfigManager.importCustomParams();
    };

    //=============================================================================
    // DataManager
    //  セーブ時とロード時にオプション値を同期します。
    //=============================================================================
    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame      = function() {
        _DataManager_setupNewGame.apply(this, arguments);
        ConfigManager.exportCustomParams();
    };

    var _DataManager_loadGameWithoutRescue = DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue      = function(savefileId) {
        var result = _DataManager_loadGameWithoutRescue.apply(this, arguments);
        ConfigManager.exportCustomParams();
        return result;
    };

    //=============================================================================
    // Window_Options
    //  追加項目を描画します。
    //=============================================================================
    var _Window_Options_initialize      = Window_Options.prototype.initialize;
    Window_Options.prototype.initialize = function() {
        this._customParams = ConfigManager.getCustomParams();
        _Window_Options_initialize.apply(this, arguments);
        this.select(localOptionWindowIndex);
        localOptionWindowIndex = 0;
    };

    var _Window_Options_makeCommandList      = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.apply(this, arguments);
        this.addCustomOptions();
    };

    Window_Options.prototype.addCustomOptions = function() {
        iterate(this._customParams, function(key, item) {
            if (!ConfigManager.hiddenInfo[key]) this.addCommand(item.name, key);
        }.bind(this));
    };

    var _Window_Options_statusText      = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var result = _Window_Options_statusText.apply(this, arguments);
        var symbol = this.commandSymbol(index);
        var value  = this.getConfigValue(symbol);
        if (this.isNumberSymbol(symbol)) {
            result = this.numberStatusText(value);
        } else if (this.isStringSymbol(symbol)) {
            result = this.stringStatusText(value, symbol);
        }
        return result;
    };

    Window_Options.prototype.isNumberSymbol = function(symbol) {
        return symbol.contains('Number');
    };

    Window_Options.prototype.isStringSymbol = function(symbol) {
        return symbol.contains('String');
    };

    Window_Options.prototype.isCustomSymbol = function(symbol) {
        return !!this._customParams[symbol];
    };

    Window_Options.prototype.numberStatusText = function(value) {
        return value;
    };

    Window_Options.prototype.stringStatusText = function(value, symbol) {
        return this._customParams[symbol].values[value];
    };

    var _Window_Options_processOk      = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        if (!this._shiftValue(1, true)) _Window_Options_processOk.apply(this, arguments);
        this.execScript();
    };

    var _Window_Options_cursorRight      = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function(wrap) {
        if (!this._shiftValue(1, false)) _Window_Options_cursorRight.apply(this, arguments);
    };

    var _Window_Options_cursorLeft      = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function(wrap) {
        if (!this._shiftValue(-1, false)) _Window_Options_cursorLeft.apply(this, arguments);
    };

    Window_Options.prototype._shiftValue = function(sign, loopFlg) {
        var symbol = this.commandSymbol(this.index());
        var value  = this.getConfigValue(symbol);
        if (this.isNumberSymbol(symbol)) {
            value += this.numberOffset(symbol) * sign;
            this.changeValue(symbol, this._clampValue(value, symbol, loopFlg));
            return true;
        }
        if (this.isStringSymbol(symbol)) {
            value += sign;
            this.changeValue(symbol, this._clampValue(value, symbol, loopFlg));
            return true;
        }
        return false;
    };

    Window_Options.prototype.execScript = function() {
        var symbol = this.commandSymbol(this.index());
        if (!this.isCustomSymbol(symbol)) return;
        var script = this._customParams[symbol].script;
        if (script) eval(script);
        localOptionWindowIndex = this.index();
    };

    Window_Options.prototype._clampValue = function(value, symbol, loopFlg) {
        var maxValue = this._customParams[symbol].max;
        var minValue = this._customParams[symbol].min;
        if (loopFlg) {
            if (value > maxValue) value = minValue;
            if (value < minValue) value = maxValue;
        }
        return value.clamp(this._customParams[symbol].min, this._customParams[symbol].max);
    };

    Window_Options.prototype.numberOffset = function(symbol) {
        var value = this._customParams[symbol].offset;
        if (Input.isPressed('shift')) value *= 10;
        return value;
    };

    Window_Options.prototype.windowHeight = function() {
        return this.fittingHeight(Math.min(this.numVisibleRows(), 14));
    };
})();

