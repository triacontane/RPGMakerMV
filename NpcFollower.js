//=============================================================================
// NpcFollower.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.2 2017/01/17 プラグインコマンドが小文字でも動作するよう修正（byこまちゃん先輩）
// 1.0.1 2016/07/17 セーブデータをロードした際のエラーになる現象の修正
// 1.0.0 2016/07/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc NPC Follower plugin
 * @author triacontane
 *
 * @param MaxNpcNumber
 * @desc 同時に隊列に存在できるNPCの最大数です。
 * @default 1
 *
 * @help マップ上の隊列の好きな位置にパーティメンバー以外のNPCを追加します。
 * NPCはデータベース上はアクターで定義してプラグインコマンドから追加、削除します。
 * 戦闘員ではないので、メニュー画面や戦闘画面には影響を与えません。
 * また、隊列表示していない場合は何も表示されません。
 *
 * 同一IDのアクターを複数追加することもできます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * NF_NPC追加 4 1 # アクターID[4]をNPCとしてパーティの[1]番目の後ろに追加
 * NF_ADD_NPC 5 3 # アクターID[5]をNPCとしてパーティの[3]番目の後ろに追加
 * NF_NPC削除 1   # [1]番目に追加したNPCを全て削除
 * NF_REM_NPC 3   # [3]番目に追加したNPCを全て削除
 *
 * インデックスの指定は追加したNPCとは関係なく、
 * パーティの並び順(1...バトルメンバー数)を指定してください。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc NPCフォロワープラグイン
 * @author トリアコンタン
 *
 * @param 最大同時NPC数
 * @desc 同時に隊列に存在できるNPCの最大数です。
 * @default 1
 *
 * @help マップ上の隊列の好きな位置にパーティメンバー以外のNPCを追加します。
 * NPCはデータベース上はアクターで定義してプラグインコマンドから追加、削除します。
 * 戦闘員ではないので、メニュー画面や戦闘画面には影響を与えません。
 * また、隊列表示していない場合は何も表示されません。
 *
 * 同一IDのアクターを複数追加することもできます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * NF_NPC追加 4 1 # アクターID[4]をNPCとしてパーティの[1]番目の後ろに追加
 * NF_ADD_NPC 5 3 # アクターID[5]をNPCとしてパーティの[3]番目の後ろに追加
 * NF_NPC削除 1   # [1]番目に追加したNPCを全て削除
 * NF_REM_NPC 3   # [3]番目に追加したNPCを全て削除
 *
 * インデックスの指定は追加したNPCとは関係なく、
 * パーティの並び順(1...バトルメンバー数)を指定してください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'NpcFollower';
    var metaTagPrefix = 'NF';

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getArgNumberWithEval = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(eval(convertEscapeCharacters(arg)), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramMaxNpcNumber = getParamNumber(['MaxNpcNumber', '最大同時NPC数']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (!command.match(new RegExp('^' + metaTagPrefix, 'i'))) return;
        try {
            this.pluginCommandNpcFollower(command.replace(new RegExp(metaTagPrefix, 'i'), ''), args);
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

    Game_Interpreter.prototype.pluginCommandNpcFollower = function(command, args) {
        switch (getCommandName(command)) {
            case '_NPC追加' :
            case '_ADD_NPC' :
                var actorId = getArgNumberWithEval(args[0]);
                $gameParty.addNpc(actorId, getArgNumberWithEval(args[1], 1));
                break;
            case '_NPC削除' :
            case '_REM_NPC' :
                $gameParty.removeNpc(getArgNumberWithEval(args[0], 1));
                break;
        }
    };

    //=============================================================================
    // Game_Party
    //  NPCの追加と削除を追加定義します。
    //=============================================================================
    var _Game_Party_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function() {
        _Game_Party_initialize.apply(this, arguments);
        this.initNpc();
    };

    Game_Party.prototype.initNpc = function() {
        this._npcs = [];
        this._npcIndexes = [];
    };

    Game_Party.prototype.isNpcInvalid = function() {
        return !this._npcs;
    };

    Game_Party.prototype.initNpcIfNeed = function() {
        if (this.isNpcInvalid()) {
            this.initNpc();
            $gamePlayer.followers().initNpc();
        }
    };

    Game_Party.prototype.addNpc = function(actorId, index) {
        if (this._npcs.length < paramMaxNpcNumber) {
            this._npcs.push(actorId);
            this._npcIndexes.push(index);
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        } else {
            throw new Error('登録可能な最大数を超えています。');
        }
    };

    Game_Party.prototype.removeNpc = function(index) {
        for (var i = 0, n = this._npcs.length; i < n; i++) {
            if (this._npcIndexes[i] === index) {
                this._npcs.splice(i, 1);
                this._npcIndexes.splice(i, 1);
                i--;
            }
        }
        $gamePlayer.refresh();
        $gameMap.requestRefresh();
    };

    Game_Party.prototype.npcMembers = function() {
        return this._npcs.map(function(id) {
            return $gameActors.actor(id);
        });
    };

    Game_Party.prototype.visibleMembers = function() {
        return this._visibleMembers;
    };

    Game_Party.prototype.makeVisibleMembers = function() {
        var battleMembers = this.battleMembers();
        var npcMembers = this.npcMembers();
        var visibleMembers = [];
        for (var i = 0, n = this.maxBattleMembers() + 1; i < n; i++) {
            for (var j = 0, m = npcMembers.length; j < m; j++) {
                if (this._npcIndexes[j] === i) visibleMembers.push(npcMembers[j]);
            }
            if (battleMembers.length > i) visibleMembers.push(battleMembers[i]);
        }
        this._visibleMembers = visibleMembers;
    };

    //=============================================================================
    // Game_Followers
    //  NPCの最大数ぶんだけ余分にGame_Followerを作成します。
    //=============================================================================
    var _Game_Followers_initialize = Game_Followers.prototype.initialize;
    Game_Followers.prototype.initialize = function() {
        _Game_Followers_initialize.apply(this, arguments);
        this.initNpc();
    };

    Game_Followers.prototype.initNpc = function() {
        var memberLength = $gameParty.maxBattleMembers();
        for (var i = 0; i < paramMaxNpcNumber; i++) {
            this._data.push(new Game_Follower(memberLength + i));
        }
    };

    //=============================================================================
    // Game_Follower
    //  NPC判定を追加定義します。
    //=============================================================================
    var _Game_Follower_actor = Game_Follower.prototype.actor;
    Game_Follower.prototype.actor = function() {
        _Game_Follower_actor.apply(this, arguments);
        return $gameParty.visibleMembers()[this._memberIndex];
    };

    //=============================================================================
    // Game_Player
    //  リフレッシュまえに表示メンバーを更新します。
    //=============================================================================
    var _Game_Player_refresh = Game_Player.prototype.refresh;
    Game_Player.prototype.refresh = function() {
        $gameParty.makeVisibleMembers();
        _Game_Player_refresh.apply(this, arguments);
    };

    //=============================================================================
    // DataManager
    //  プラグイン未適用のデータをロードした場合に必要なデータを初期化します。
    //=============================================================================
    var _DataManager_loadGame = DataManager.loadGame;
    DataManager.loadGame = function(saveFileId) {
        var result = _DataManager_loadGame.apply(this, arguments);
        $gameParty.initNpcIfNeed();
        return result;
    };
})();

