//=============================================================================
// ParallelParty.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/05/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ParallelPartyPlugin
 * @author triacontane
 *
 * @help 複数のパーティを同時に管理できます。
 * 各パーティは「パーティID」で管理され、初期状態のパーティIDは「0」です。
 * それぞれ所持金やアイテムが別々に管理され、プラグインコマンドで
 * 別のパーティに交代できます。
 *
 * 新しいパーティに移った直後はメンバーが0人の状態なので
 * イベント「メンバーの入れ替え」でアクターを追加してください。
 *
 * アクターの情報は共有しているので、他のパーティに加入しているアクターを
 * 別のパーティに入れた場合、状態を引き継ぎます。
 *
 * 戦闘中のパーティの入れ替えはできません。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * PP_パーティ変更 1 # パーティを[1]に変更します。
 * PP_CHANGE_PARTY 1 # 同上
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 並列パーティプラグイン
 * @author トリアコンタン
 *
 * @help 複数のパーティを同時に管理できます。
 * 各パーティは「パーティID」で管理され、初期状態のパーティIDは「0」です。
 * それぞれ所持金やアイテムが別々に管理され、プラグインコマンドで
 * 別のパーティに交代できます。
 *
 * 新しいパーティに移った直後はメンバーが0人の状態なので
 * イベント「メンバーの入れ替え」でアクターを追加してください。
 *
 * アクターの情報は共有しているので、他のパーティに加入しているアクターを
 * 別のパーティに入れた場合、状態を引き継ぎます。
 * 
 * 戦闘中のパーティの入れ替えはできません。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * PP_パーティ変更 1 # パーティを[1]に変更します。
 * PP_CHANGE_PARTY 1 # 同上
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

function Game_Parties() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';
    var metaTagPrefix = 'PP_';

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

    var convertAllArguments = function(args) {
        for (var i = 0; i < args.length; i++) {
            args[i] = convertEscapeCharacters(args[i]);
        }
        return args;
    };

    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var pluginCommandMap = new Map();
    setPluginCommand('パーティ変更', 'execChangeParty');
    setPluginCommand('CHANGE_PARTY', 'execChangeParty');

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](convertAllArguments(args));
        }
    };

    Game_Interpreter.prototype.execChangeParty = function(args) {
        if (!$gameParty.inBattle()) {
            $gameSystem.changeParty(getArgNumber(args[0], 0));
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        }
    };

    //=============================================================================
    // Game_System
    //  Game_Partiesを生成します。
    //=============================================================================
    Game_System.prototype.changeParty = function(partyId) {
        if (!this._parties) {
            this._parties = new Game_Parties();
        }
        this._parties.change(partyId);
    };

    //=============================================================================
    // Game_Parties
    //  複数のパーティを管理します。
    //=============================================================================
    Game_Parties.prototype.initialize = function() {
        this._data    = [$gameParty];
    };

    Game_Parties.prototype.createPartyIfNeed = function(partyId) {
        if (!this.isExistParty(partyId)) {
            this._data[partyId] = new Game_Party();
        }
    };

    Game_Parties.prototype.isExistParty = function(partyId) {
        return !!this._data[partyId];
    };

    Game_Parties.prototype.change = function(partyId) {
        this.createPartyIfNeed(partyId);
        $gameParty = this._data[partyId];
    };
})();

