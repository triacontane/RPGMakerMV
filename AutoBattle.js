//=============================================================================
// AutoBattle.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/09/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc AutoBattlePlugin
 * @author triacontane
 *
 * @param PartyCommandName
 * @desc Auto battle command name for Window party command.
 * @default Auto
 *
 * @param PartyCommandIndex
 * @desc Auto battle command index for Window party command.
 * @default -1
 *
 * @param ActorCommandName
 * @desc Auto battle command name for Window actor command.
 * @default Auto
 *
 * @param ActorCommandIndex
 * @desc Auto battle command index for Window actor command.
 * @default -1
 *
 * @help Auto battle system added.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 自動戦闘プラグイン
 * @author トリアコンタン
 *
 * @param パーティコマンド名称
 * @desc パーティコマンドに追加される一括オートコマンドの名称です。未入力にすると追加されません。
 * @default オート
 *
 * @param パーティコマンド位置
 * @desc パーティコマンドでオートコマンドが追加される位置です。-1の場合、末尾に追加されます。
 * @default -1
 *
 * @param アクターコマンド名称
 * @desc アクターコマンドに追加される個別オートコマンドの名称です。未入力にすると追加されません。
 * @default オート
 *
 * @param アクターコマンド位置
 * @desc アクターコマンドでオートコマンドが追加される位置です。-1の場合、末尾に追加されます。
 * @default -1
 *
 * @help アクターの行動を自動選択するオートバトルを実装します。
 *
 * １．パーティコマンドからオートを選択すると、アクターコマンドの選択をスキップして全員
 * オートバトルになります。
 *
 * ２．アクターコマンドからオートを選択すると、対象アクターのみオートバトルになります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName = 'AutoBattle';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramPartyCommandName  = getParamString(['PartyCommandName', 'パーティコマンド名称']);
    var paramPartyCommandIndex = getParamNumber(['PartyCommandIndex', 'パーティコマンド位置']);
    var paramActorCommandName  = getParamString(['ActorCommandName', 'アクターコマンド名称']);
    var paramActorCommandIndex = getParamNumber(['ActorCommandIndex', 'アクターコマンド位置']);

    //=============================================================================
    // BattleManager
    //  オートバトルの実装を追加定義します。
    //=============================================================================
    BattleManager.processActorAuto = function() {
        this.actor().makeAutoBattleActions();
    };

    BattleManager.processPartyAuto = function() {
        $gameParty.members().forEach(function(member) {
            member.makeAutoBattleActions();
        });
        this.startTurn();
    };

    //=============================================================================
    // Scene_Battle
    //  オートバトルコマンドを選択した場合の処理を追加定義します。
    //=============================================================================
    var _Scene_Battle_createPartyCommandWindow      = Scene_Battle.prototype.createPartyCommandWindow;
    Scene_Battle.prototype.createPartyCommandWindow = function() {
        _Scene_Battle_createPartyCommandWindow.apply(this, arguments);
        if (paramPartyCommandName) {
            this._partyCommandWindow.setHandler('auto', this.commandPartyAutoBattle.bind(this));
        }
    };

    var _Scene_Battle_createActorCommandWindow      = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.apply(this, arguments);
        if (paramActorCommandName) {
            this._actorCommandWindow.setHandler('auto', this.commandActorAutoBattle.bind(this));
        }
    };

    Scene_Battle.prototype.commandPartyAutoBattle = function() {
        BattleManager.processPartyAuto();
        this.changeInputWindow();
    };

    Scene_Battle.prototype.commandActorAutoBattle = function() {
        BattleManager.processActorAuto();
        this.selectNextCommand();
    };

    //=============================================================================
    // Window_PartyCommand
    //  オートバトルコマンドを追加します。
    //=============================================================================
    var _Window_PartyCommand_makeCommandList      = Window_PartyCommand.prototype.makeCommandList;
    Window_PartyCommand.prototype.makeCommandList = function() {
        _Window_PartyCommand_makeCommandList.apply(this, arguments);
        if (paramPartyCommandName) this.addAutoCommand();
    };

    Window_PartyCommand.prototype.addAutoCommand = function() {
        this.addCommand(paramPartyCommandName, 'auto');
        if (this._list[paramPartyCommandIndex]) {
            var command = this._list.pop();
            this._list.splice(1, paramPartyCommandIndex, command);
        }
    };

    //=============================================================================
    // Window_ActorCommand
    //  オートバトルコマンドを追加します。
    //=============================================================================
    var _Window_ActorCommand_makeCommandList      = Window_ActorCommand.prototype.makeCommandList;
    Window_ActorCommand.prototype.makeCommandList = function() {
        _Window_ActorCommand_makeCommandList.apply(this, arguments);
        if (this._actor && paramActorCommandName) {
            this.addAutoCommand();
        }
    };

    Window_ActorCommand.prototype.addAutoCommand = function() {
        this.addCommand(paramActorCommandName, 'auto');
        if (this._list[paramActorCommandIndex]) {
            var command = this._list.pop();
            this._list.splice(1, paramActorCommandIndex, command);
        }
    };
})();

