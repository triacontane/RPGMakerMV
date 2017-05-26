//=============================================================================
// FlexibleBattleBgm.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.0.0 2016/01/07 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 敵グループごとの戦闘BGM設定プラグイン
 * @author トリアコンタン
 *
 * @help 敵グループごとに戦闘BGM設定できるようになるプラグインです。
 * この設定はシステムの戦闘BGMよりも優先され、設定されていない場合のみ
 * システムの戦闘BGMが演奏されます。
 * 指定はプラグインコマンドから行い、敵グループIDは一括で指定できます。
 * 一度実行した設定はセーブファイルに保存されるので、
 * ゲーム開始時に1回実行すればOKです。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * 敵グループBGM追加 [敵グループID開始位置] [敵グループID終了位置]
 * 　[BGM名称] [BGM音量] [BGMピッチ] [BGM位相]
 *
 * （例1）敵グループ「1」の戦闘BGMを「Battle1」にしたい場合
 * 敵グループBGM追加 1 1 Battle1 100 100 0
 *
 * （例2）敵グループ「1」～「20」の戦闘BGMを「Battle2」にしたい場合
 * 敵グループBGM追加 1 20 Battle2
 * ※ 音量、ピッチ、位相は省略するとそれぞれ「90」「100」「0」になります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    'use strict';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getCommandName = function (command) {
        return (command || '').toUpperCase();
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

    var convertEscapeCharacters = function(text) {
        if (typeof Game_Interpreter.prototype.pluginCommandBook_unescape === 'function') {
            return Game_Interpreter.prototype.pluginCommandBook_unescape(text);
        }
        if (text == null) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(window));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(window));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var n = parseInt(arguments[1]);
            var actor = n >= 1 ? $gameActors.actor(n) : null;
            return actor ? actor.name() : '';
        }.bind(window));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var n = parseInt(arguments[1]);
            var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
            return actor ? actor.name() : '';
        }.bind(window));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    //=============================================================================
    // Object
    //  プロパティの定義
    //=============================================================================
    var iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandFlexibleBattleBgm(command, args);
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

    Game_Interpreter.prototype.pluginCommandFlexibleBattleBgm = function (command, args) {
        switch (getCommandName(command)) {
            case '敵グループBGM追加' :
            case 'ADD_TROOP_BGM' :
                var start  = getArgNumber(args[0], 1, 5000);
                var end    = getArgNumber(args[1], 1, 5000);
                var name   = getArgString(args[2]);
                var volume = args[3] !== undefined ? getArgNumber(args[3]) : null;
                var pitch  = args[4] !== undefined ? getArgNumber(args[4]) : null;
                var pan    = args[5] !== undefined ? getArgNumber(args[5]) : null;
                $gameSystem.addTroopBattleBgm(start, end, name, volume, pitch, pan);
                break;
        }
    };

    //=============================================================================
    // Game_System
    //  敵グループごとの戦闘BGMの取得と設定処理を追加定義します。
    //=============================================================================
    var _Game_System_battleBgm = Game_System.prototype.battleBgm;
    Game_System.prototype.battleBgm = function() {
        var id = $gameTroop._troopId;
        if (this._troopsBattleBgm && id !== 0) {
            var bgm = null;
            iterate(this._troopsBattleBgm, function(key, value) {
                if (id >= parseInt(key.split(':')[0], 10) && id <= parseInt(key.split(':')[1], 10)) bgm = value;
            });
            if (bgm) return bgm;
        }
        return _Game_System_battleBgm.apply(this, arguments);
    };

    Game_System.prototype.addTroopBattleBgm = function(start, end, name, volume, pitch, pan) {
        if (volume === null) volume = 90;
        if (pitch === null) pitch = 100;
        if (pan === null) pan = 0;
        if (!this._troopsBattleBgm) this._troopsBattleBgm = {};
        this._troopsBattleBgm[start + ':' + end] = {name:name, pan:pan.clamp(-100, 100),
            volume:volume.clamp(0, 100), pitch:pitch.clamp(50, 150)};
    };
})();

