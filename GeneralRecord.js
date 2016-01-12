//=============================================================================
// GeneralRecord.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/01/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc なんでも記録プラグイン
 * @author トリアコンタン
 *
 * @param パラメータ
 * @desc パラメータ説明
 * @default デフォルト値
 *
 * @help ゲーム中の様々な事象をカウントして記録します。
 * 1. アイテムごとの購入数、売却数、使用数
 * 2. 敵ごとの撃破数
 * 3. アクターごとのスキル使用回数
 * 4. メニュー表示回数
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    'use strict';
    var pluginName = 'GeneralRecord';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function (paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamNumber = function (paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function (paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() == 'ON';
    };

    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamArrayString = function (paramNames) {
        var values = getParamString(paramNames);
        return (values || '').split(',');
    };

    var getParamArrayNumber = function (paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var getArgArrayString = function (args, upperFlg) {
        var values = getArgString(args, upperFlg);
        return (values || '').split(',');
    };

    var getArgArrayNumber = function (args, min, max) {
        var values = getArgArrayString(args, false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    var getArgString = function (args, upperFlg) {
        args = convertEscapeCharacters(args);
        return upperFlg ? args.toUpperCase() : args;
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length <= 2) min = -Infinity;
        if (arguments.length <= 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var parseIntStrict = function (value, errorMessage) {
        var result = parseInt(value, 10);
        if (isNaN(result)) throw Error('指定した値[' + value + ']が数値ではありません。' + errorMessage);
        return result;
    };

    //=============================================================================
    // Object
    //  プロパティの定義
    //=============================================================================
    if (!Object.prototype.hasOwnProperty('iterate')) {
        Object.defineProperty(Object.prototype, 'iterate', {
            value : function (handler) {
                Object.keys(this).forEach(function (key, index) {
                    handler.call(this, key, this[key], index);
                }, this);
            }
        });
    }

    if (!Object.prototype.hasOwnProperty('sum')) {
        Object.defineProperty(Object.prototype, 'sum', {
            value : function () {
                var sum = 0;
                Object.keys(this).forEach(function (key, index) {
                    sum += this[key];
                }, this);
                return sum;
            }
        });
    }

    if (!Object.prototype.hasOwnProperty('isEmpty')) {
        Object.defineProperty(Object.prototype, 'isEmpty', {
            value : function () {
                return Object.keys(this).length <= 0;
            }
        });
    }

    Number.prototype.times = function (handler) {
        var i = 0;
        while (i < this) handler.call(this, i++);
    };

    var _Scene_Shop_doBuy = Scene_Shop.prototype.doBuy;
    Scene_Shop.prototype.doBuy = function(number) {
        _Scene_Shop_doBuy.apply(this, arguments);
        $gameSystem.record().add('アイテム購入数', this._item.id, number);
        $gameSystem.record().add('アイテム購入金額', this._item.id, number * this.buyingPrice());
    };

    var _Scene_Shop_doSell = Scene_Shop.prototype.doSell;
    Scene_Shop.prototype.doSell = function(number) {
        _Scene_Shop_doSell.apply(this, arguments);
        $gameSystem.record().add('アイテム売却数', this._item.id, number);
        $gameSystem.record().add('アイテム売却金額', this._item.id, number * this.sellingPrice());
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandGeneralRecord(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window  = require('nw.gui').Window.get();
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

    Game_Interpreter.prototype.pluginCommandGeneralRecord = function (command, args) {
        var key, value;
        switch (getCommandName(command)) {
            case 'レコード項目取得':
            case 'GR_GET':
                key = getArgArrayNumber(args[2]);
                if (key.length === 1) key = key[0];
                value = $gameSystem.record().get(getArgString(args[1], key));
                $gameVariables.setValue(getArgNumber(args[0], 0, 5000), value);
                break;
            case 'レコード合計取得':
            case 'GR_GET_SUM':
                value = $gameSystem.record().getSum(getArgString(args[1]));
                $gameVariables.setValue(getArgNumber(args[0], 0, 5000), value);
                break;
        }
    };

    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._record = new Game_GeneralRecord();
    };

    Game_System.prototype.record = function() {
        return this._record;
    };
})();

//=============================================================================
// Game_GeneralRecord
//  GeneralRecord
//=============================================================================
function Game_GeneralRecord() {
    this.initialize.apply(this, arguments);
}

Game_GeneralRecord.prototype.initialize = function() {
    this._アイテム購入数 = {};
    this._アイテム売却数 = {};
    this._アイテム使用数 = {};
    this._アイテム購入金額 = {};
    this._アイテム売却金額 = {};
    this._敵キャラ撃破数 = {};
    this._スキル使用数 = {};
    this._与えたダメージ = {};
    this._受けたダメージ = {};
    this._メニュー表示回数 = 0;
};

Game_GeneralRecord.prototype.add = function(name, key, value) {
    var obj = this['_' + name];
    if (typeof obj === 'object') {
        obj[key] = obj[key] != null ? obj[key] + value : value;
    } else if (typeof obj === 'number') {
        obj += value;
    } else {
        throw new Error('存在しないオブジェクト[' + name + ']を指定しました。');
    }
};

Game_GeneralRecord.prototype.get = function(name, key) {
    var obj = this['_' + name];
    if (typeof obj === 'object') {
        return obj[key];
    } else if (typeof obj === 'number') {
        return obj;
    }
    throw new Error('存在しないオブジェクト[' + name + ']を指定しました。');
};

Game_GeneralRecord.prototype.getSum = function(name) {
    var obj = this['_' + name];
    if (typeof obj === 'object') {
        return obj.sum();
    } else if (typeof obj === 'number') {
        return obj;
    }
    throw new Error('存在しないオブジェクト[' + name + ']を指定しました。');
};
