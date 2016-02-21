//=============================================================================
// FarewellToArms.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/01/06 適用するとスキルやアイテムのヘルプウィンドウが表示されなくなる不具合を修正
// 1.0.0 2015/11/13 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 戦闘放棄プラグイン　～武器よさらば～
 * @author トリアコンタン
 * 
 * @param farewellCommand
 * @desc ウィンドウに表示されるコマンド名です。
 * @default 投降
 *
 * @param farewellYes
 * @desc 投降する場合の選択肢です。
 * @default 諦める
 *
 * @param farewellNo
 * @desc 戦いを続ける場合の選択肢です。
 * @default 諦めない
 *
 * @param farewellDescription
 * @desc 確認時に画面上部に表示される説明文です。
 * @default 抵抗を止めて投降しますか？（敗北あつかいです）
 *
 * @param farewellMessage
 * @desc 投稿時に表示されるメッセージです。
 * @default %1は戦いを止めて投降した。
 *
 * @help 戦闘を自主的に放棄して敗北扱いで終了する「投降」コマンドが使えるようになります。
 * 通常ならゲームオーバーになるだけですがイベント戦闘で敗北を許可していればイベントが続行します。
 * れっつ敗北イベント！
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *
 *  FTA_INVALID : 投降コマンドの選択を禁止する
 *  FTA_VALID   : 投降コマンドの選択を再度許可する
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    var parameters = PluginManager.parameters('FarewellToArms');

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[FTA_INVALID]などを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        switch (command.toUpperCase()) {
            case 'FTA_INVALID' :
                $gameSystem._ftaFlg = false;
                break;
            case 'FTA_VALID' :
                $gameSystem._ftaFlg = true;
                break;
        }
    };

    //=============================================================================
    // Game_System
    //  コマンドの禁止状態を保持します。
    //=============================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._ftaFlg = true;
    };

    //=============================================================================
    // BattleManager
    //  敗北メッセージを再定義します。
    //=============================================================================
    var _BattleManager_displayDefeatMessage = BattleManager.displayDefeatMessage;
    BattleManager.displayDefeatMessage = function() {
        if ($gameParty.isAllDead()) {
            _BattleManager_displayDefeatMessage.call(this);
        } else {
            $gameMessage.add(parameters['farewellMessage'].format($gameParty.name()));
        }
    };

    //=============================================================================
    // Scene_Battle
    //  パーティコマンドに選択肢を追加します。
    //=============================================================================
    var _Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
    Scene_Battle.prototype.createPartyCommandWindow = function() {
        _Scene_Battle_createPartyCommandWindow.call(this);
        this._partyCommandWindow.setHandler('farewell', this.commandFarewell.bind(this));
    };

    Scene_Battle.prototype.commandFarewell = function() {
        this._partyCommandWindow.deactivate();
        this._farewellWindow.activate();
        this._farewellWindow.show();
    };

    var _Scene_Battle_isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
    Scene_Battle.prototype.isAnyInputWindowActive = function() {
        var result = _Scene_Battle_isAnyInputWindowActive.call(this);
        return result || this._farewellWindow.active;
    };

    var _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.call(this);
        this.createFarewellWindow();
    };

    Scene_Battle.prototype.createFarewellWindow = function() {
        this._farewellWindow = new Window_FarewellCommand();
        this._farewellWindow.setHelpWindow(this._helpWindow);
        this._farewellWindow.deactivate();
        this._farewellWindow.hide();
        this._farewellWindow.setHandler('ok',     this.onFarewellOk.bind(this));
        this._farewellWindow.setHandler('cancel', this.onFarewellCancel.bind(this));
        this.addWindow(this._farewellWindow);
    };

    Scene_Battle.prototype.onFarewellOk = function() {
        this.onFarewellCancel();
        BattleManager.processDefeat();
    };

    Scene_Battle.prototype.onFarewellCancel = function() {
        this._partyCommandWindow.activate();
        this._farewellWindow.deactivate();
        this._farewellWindow.hide();
    };

    //=============================================================================
    // Window_PartyCommand
    //  パーティコマンドに選択肢を追加します。
    //=============================================================================
    var _Window_PartyCommand_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
    Window_PartyCommand.prototype.makeCommandList = function() {
        _Window_PartyCommand_makeCommandList.call(this);
        this.addCommand(parameters['farewellCommand'], 'farewell', $gameSystem._ftaFlg);
    };

    //=============================================================================
    // Window_FarewellCommand
    //  投降するかどうかの最終確認です。
    //=============================================================================
    function Window_FarewellCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_FarewellCommand.prototype = Object.create(Window_Command.prototype);
    Window_FarewellCommand.prototype.constructor = Window_FarewellCommand;

    Window_FarewellCommand.prototype.initialize = function() {
        var x = Graphics.boxWidth  / 2 - this.windowWidth()  / 2;
        var y = Graphics.boxHeight / 2 - this.windowHeight() / 2;
        Window_Command.prototype.initialize.call(this, x, y);
    };

    Window_FarewellCommand.prototype.windowWidth = function() {
        var bitmap = new Bitmap(1, 1);
        return Math.max(bitmap.measureTextWidth(parameters['farewellYes']),
                bitmap.measureTextWidth(parameters['farewellNo'])) + this.standardPadding() * 2 + 8;
    };

    Window_FarewellCommand.prototype.numVisibleRows = function() {
        return 2;
    };

    Window_FarewellCommand.prototype.makeCommandList = function() {
        this.addCommand(parameters['farewellYes'],  'ok');
        this.addCommand(parameters['farewellNo'],   'cancel');
    };

    Window_FarewellCommand.prototype.update = function() {
        Window_Command.prototype.update.call(this);
        if (this.active) {
            this.visible ? this._helpWindow.setText(parameters['farewellDescription']) : this._helpWindow.clear();
        }
    };

    Window_FarewellCommand.prototype.show = function() {
        this.showHelpWindow();
        Window_Command.prototype.show.call(this);
    };

    Window_FarewellCommand.prototype.hide = function() {
        this.hideHelpWindow();
        Window_Command.prototype.hide.call(this);
    };
})();