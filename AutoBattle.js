//=============================================================================
// AutoBattle.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2023/01/31 コマンド記憶がONのとき、パーティコマンドの選択を記憶するよう仕様変更
// 1.2.1 2022/09/22 1.2.0の修正によりオートスイッチが有効なときにタイムプログレス戦闘を開始するとエラーになる問題を修正
// 1.2.0 2022/09/22 パーティコマンドのオートがタイムプログレス戦闘に対応していなかった問題を修正
// 1.1.1 2022/09/21 オートスイッチが有効なとき戦闘中のメッセージをすべて自動送りするよう修正
// 1.1.0 2022/09/21 MZ向けに修正
//                  戦闘中一切の操作が不要になる放置バトルを可能にするスイッチを追加
// 1.0.1 2018/12/30 コマンド位置の指定のパラメータ設定が一部正常に機能していなかった問題を修正
// 1.0.0 2016/09/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 自動戦闘プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AutoBattle.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param PartyCommandName
 * @text パーティコマンド名称
 * @desc パーティコマンドに追加される一括オートコマンドの名称です。未入力にすると追加されません。
 * @default オート
 *
 * @param PartyCommandIndex
 * @text パーティコマンド位置
 * @desc パーティコマンドでオートコマンドが追加される位置です。-1の場合、末尾に追加されます。
 * @default -1
 *
 * @param ActorCommandName
 * @text アクターコマンド名称
 * @desc アクターコマンドに追加される個別オートコマンドの名称です。未入力にすると追加されません。
 * @default オート
 *
 * @param ActorCommandIndex
 * @text アクターコマンド位置
 * @desc アクターコマンドでオートコマンドが追加される位置です。-1の場合、末尾に追加されます。
 * @default -1
 *
 * @param AutoSwitch
 * @text オートスイッチ
 * @desc 指定したスイッチがONのとき常に全員がオートバトルになります。
 * @default 0
 * @type switch
 *
 * @help アクターの行動を自動選択するオートバトルを実装します。
 *
 * １．パーティコマンドからオートを選択すると、アクターコマンドの選択を
 * スキップして全員オートバトルになります。
 *
 * ２．アクターコマンドからオートを選択すると、対象アクターのみ
 * オートバトルになります。
 *
 * ３．オートスイッチがONになっていると戦闘中一切のコマンド入力を
 * スキップして完全オートで戦闘が進みます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // BattleManager
    //  オートバトルの実装を追加定義します。
    //=============================================================================
    BattleManager.processActorAuto = function() {
        this.actor().makeAutoBattleActions();
    };

    BattleManager.processPartyAuto = function() {
        $gameParty.members().forEach(member => {
            if (this.isTpb()) {
                member.setAutoBattle();
            } else {
                member.makeAutoBattleActions();
            }
        });
        this.startTurn();
    };

    Game_BattlerBase.prototype.setAutoBattle = function() {
        this._autoBattle = true;
    };

    const _Game_BattlerBase_isAutoBattle = Game_BattlerBase.prototype.isAutoBattle;
    Game_BattlerBase.prototype.isAutoBattle = function() {
        return _Game_BattlerBase_isAutoBattle.apply(this, arguments) || this._autoBattle;
    };

    const _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function() {
        _Game_Battler_onBattleEnd.apply(this, arguments);
        this._autoBattle = false;
    };

    //=============================================================================
    // Scene_Battle
    //  オートバトルコマンドを選択した場合の処理を追加定義します。
    //=============================================================================
    const _Scene_Battle_createPartyCommandWindow      = Scene_Battle.prototype.createPartyCommandWindow;
    Scene_Battle.prototype.createPartyCommandWindow = function() {
        _Scene_Battle_createPartyCommandWindow.apply(this, arguments);
        if (param.PartyCommandName) {
            this._partyCommandWindow.setHandler('auto', this.commandPartyAutoBattle.bind(this));
        }
    };

    const _Scene_Battle_createActorCommandWindow      = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.apply(this, arguments);
        if (param.ActorCommandName) {
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

    const _Scene_Battle_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
    Scene_Battle.prototype.startPartyCommandSelection = function() {
        _Scene_Battle_startPartyCommandSelection.apply(this, arguments);
        if (BattleManager.isValidAutoSwitch()) {
            BattleManager.processPartyAuto();
            this.endCommandSelection();
        }
    };

    const _Window_Message_startPause = Window_Message.prototype.startPause;
    Window_Message.prototype.startPause = function() {
        _Window_Message_startPause.apply(this, arguments);
        if (BattleManager.isValidAutoSwitch()) {
            this.startWait(30);
        }
    };

    const _Window_Message_updateInput = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        const result = _Window_Message_updateInput.apply(this, arguments);
        if (this.pause && BattleManager.isValidAutoSwitch()) {
            Input.update();
            this.pause = false;
            if (!this._textState) {
                this.terminateMessage();
            }
            return true;
        }
        return result;
    };

    BattleManager.isValidAutoSwitch = function() {
        return $gameParty.inBattle() && $gameSwitches.value(param.AutoSwitch);
    };

    //=============================================================================
    // Window_PartyCommand
    //  オートバトルコマンドを追加します。
    //=============================================================================
    const _Window_PartyCommand_makeCommandList      = Window_PartyCommand.prototype.makeCommandList;
    Window_PartyCommand.prototype.makeCommandList = function() {
        _Window_PartyCommand_makeCommandList.apply(this, arguments);
        if (param.PartyCommandName) {
            this.addAutoCommand();
        }
    };

    Window_PartyCommand.prototype.addAutoCommand = function() {
        this.addCommand(param.PartyCommandName, 'auto');
        if (this._list[param.PartyCommandIndex]) {
            const command = this._list.pop();
            this._list.splice(param.PartyCommandIndex, 0, command);
        }
    };

    const _Window_PartyCommand_processOk = Window_PartyCommand.prototype.processOk;
    Window_PartyCommand.prototype.processOk = function() {
        if (this.isNeedRemember()) {
            $gameParty.setLastCommandSymbol(this.currentSymbol());
        } else {
            $gameParty.setLastCommandSymbol("");
        }
        _Window_PartyCommand_processOk.apply(this, arguments);
    };

    const _Window_PartyCommand_setup = Window_PartyCommand.prototype.setup;
    Window_PartyCommand.prototype.setup = function() {
        _Window_PartyCommand_setup.apply(this, arguments);
        this.selectLast();
    };

    Window_PartyCommand.prototype.selectLast = function() {
        if (this.isNeedRemember()) {
            const symbol = $gameParty.lastCommandSymbol();
            this.selectSymbol(symbol);
        }
    };

    Window_PartyCommand.prototype.isNeedRemember = function() {
        return ConfigManager.commandRemember;
    };

    //=============================================================================
    // Window_ActorCommand
    //  オートバトルコマンドを追加します。
    //=============================================================================
    const _Window_ActorCommand_makeCommandList      = Window_ActorCommand.prototype.makeCommandList;
    Window_ActorCommand.prototype.makeCommandList = function() {
        _Window_ActorCommand_makeCommandList.apply(this, arguments);
        if (this._actor && param.ActorCommandName) {
            this.addAutoCommand();
        }
    };

    Window_ActorCommand.prototype.addAutoCommand = function() {
        this.addCommand(param.ActorCommandName, 'auto');
        if (this._list[param.ActorCommandIndex]) {
            const command = this._list.pop();
            this._list.splice(param.ActorCommandIndex, 0, command);
        }
    };

    Game_Party.prototype.lastCommandSymbol = function() {
        return this._lastCommandSymbol;
    };

    Game_Party.prototype.setLastCommandSymbol = function(symbol) {
        this._lastCommandSymbol = symbol;
    };
})();

