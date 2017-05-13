//=============================================================================
// ParallelParty.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/05/13 パーティ間でリソースを共有する設定を追加、各パーティのマップ座標を記憶して自働で場所移動する機能を追加
// 1.0.0 2017/05/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ParallelPartyPlugin
 * @author triacontane
 *
 * @param ShareResource
 * @desc 異なるパーティでもリソース(アイテム、武器、防具、お金、歩数)を共有します。(ON/OFF)
 * @default OFF
 *
 * @param SavePosition
 * @desc パーティを切り替えたときに元の位置を保存し、元のパーティに戻したときに自働で場所移動します。
 * @default OFF
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
 * @param リソース共有
 * @desc 異なるパーティでもリソース(アイテム、武器、防具、お金、歩数)を共有します。(ON/OFF)
 * @default OFF
 *
 * @param パーティ位置を保持
 * @desc パーティを切り替えたときに元の位置を保存し、元のパーティに戻したときに自働で場所移動します。
 * @default OFF
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
    var pluginName    = 'ParallelParty';
    var metaTagPrefix = 'PP_';

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

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON';
    };

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
    // パラメータの取得と整形
    //=============================================================================
    var param           = {};
    param.shareResource = getParamBoolean(['ShareResource', 'リソース共有']);
    param.savePosition  = getParamBoolean(['SavePosition', 'パーティ位置を保持']);

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
        if ($gameParty.inBattle()) return;
        $gameSystem.changeParty(getArgNumber(args[0], 0));
        if (!$gamePlayer.isTransferring()) {
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        } else {
            this.setWaitMode('transfer');
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
    // Game_Party
    //  リソースの引き継ぎと位置の保存を追加定義します。
    //=============================================================================
    Game_Party.prototype.getAllResources = function() {
        return {
            items  : this._items,
            weapons: this._weapons,
            armors : this._armors,
            gold   : this._gold,
            steps  : this._steps
        };
    };

    Game_Party.prototype.inheritAllResources = function(prevParty) {
        var resources = prevParty.getAllResources();
        this._items   = resources.items;
        this._weapons = resources.weapons;
        this._armors  = resources.armors;
        this._gold    = resources.gold;
        this._steps   = resources.steps;
    };

    Game_Party.prototype.moveSavedPosition = function() {
        if (!this._savedMapId) return;
        $gamePlayer.reserveTransfer(this._savedMapId, this._savedX, this._savedY, this._savedDirection, 2);
    };

    Game_Party.prototype.savePosition = function() {
        this._savedMapId     = $gameMap.mapId();
        this._savedX         = $gamePlayer.x;
        this._savedY         = $gamePlayer.y;
        this._savedDirection = $gamePlayer.direction();
    };

    //=============================================================================
    // Game_Parties
    //  複数のパーティを管理します。
    //=============================================================================
    Game_Parties.prototype.initialize = function() {
        this._data    = [$gameParty];
        this._partyId = 0;
    };

    Game_Parties.prototype.createPartyIfNeed = function() {
        if (!this.isExistParty()) {
            this._data[this._partyId] = new Game_Party();
        }
    };

    Game_Parties.prototype.isExistParty = function() {
        return !!this.getCurrentParty();
    };

    Game_Parties.prototype.getCurrentParty = function() {
        return this._data[this._partyId];
    };

    Game_Parties.prototype.change = function(partyId) {
        if (this._partyId === partyId) return;
        this._partyId = partyId;
        this.createPartyIfNeed();
        var currentParty = this.getCurrentParty();
        if (param.shareResource) {
            currentParty.inheritAllResources($gameParty);
        }
        if (param.savePosition) {
            this.moveSavedPosition();
        }
        $gameParty = currentParty;
    };

    Game_Parties.prototype.moveSavedPosition = function() {
        $gameParty.savePosition();
        var currentParty = this.getCurrentParty();
        currentParty.moveSavedPosition();
    };
})();

