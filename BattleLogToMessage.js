//=============================================================================
// BattleLogToMessage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.7.0 2018/05/30 スキル名、アイテム名を簡易表示する機能を追加
// 1.6.1 2018/05/05 YEP_MessageCore.jsが有効な場合、メッセージウィンドウの行数はYEP_MessageCore.jsを優先するよう修正
// 1.6.0 2018/03/25 バトルログに表示する内容が空の時、ウィンドウを非表示にできる機能を追加
// 1.5.0 2018/03/25 バトルログの行数を変更できる機能を追加。表示するメッセージが空の場合はメッセージ表示をしないよう変更
// 1.4.1 2018/02/10 戦闘終了のメッセージ表示後にログウィンドウが一瞬だけ残ってしまう現象を修正
// 1.4.0 2018/02/10 メッセージウィンドウを画面上部に固定できる機能を追加
// 1.3.0 2016/10/25 バトルイベント実行中などでログウィンドウを閉じることのできる機能を追加
// 1.2.0 2016/10/18 メッセージスピードの調整機能と、行動終了後に追加ウェイトする機能を追加
// 1.1.0 2016/10/14 ダメージのポップアップを抑制する機能を追加
// 1.0.0 2016/10/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BattleLogToMessagePlugin
 * @author triacontane
 *
 * @param StatusPosUpper
 * @desc コマンドやステータスのウィンドウを画面上部に配置して、メッセージによって隠れないようにします。
 * @default true
 * @type boolean
 *
 * @param SuppressPopup
 * @desc ダメージのポップアップを非表示にします。
 * @default false
 * @type boolean
 *
 * @param MessagePosUpper
 * @desc メッセージウィンドウ全体を上部に表示します。その場合、ステータス上部配置は無効にしてください。
 * @default false
 * @type boolean
 *
 * @param MessageSpeed
 * @desc メッセージスピードを指定した番号の変数から取得するよう変更します。変数値(0:ウェイトなし 1:通常 2以上:遅くなる)
 * @default 0
 * @type number
 *
 * @param WaitForEndAction
 * @desc 行動終了後、メッセージをクリアする前に指定したフレーム数だけウェイトを掛けます。
 * @default 0
 * @type number
 *
 * @param MessageLines
 * @desc ウィンドウの行数です。行数を減らすとダメージ表示等のメッセージが表示されなくなる場合があります。
 * @default 4
 * @type number
 *
 * @param HiddenIfEmpty
 * @desc ウィンドウに表示する内容がないとき、ウィンドウが非表示になります。
 * @default false
 * @type boolean
 *
 * @param SkillViewSimplified
 * @desc スキルおよびアイテムの表示を名称のみの中央表示に切り替えます。
 * @default false
 * @type boolean
 *
 * @help バトルログを画面下部のメッセージウィンドウ内に表示するよう変更します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc バトルログのメッセージ表示プラグイン
 * @author トリアコンタン
 *
 * @param ステータス上部配置
 * @desc コマンドやステータスのウィンドウを画面上部に配置して、メッセージによって隠れないようにします。
 * @default true
 * @type boolean
 *
 * @param ポップアップ抑制
 * @desc ダメージのポップアップを非表示にします。
 * @default false
 * @type boolean
 *
 * @param メッセージ上部配置
 * @desc メッセージウィンドウ全体を上部に表示します。その場合、ステータス上部配置は無効にしてください。
 * @default false
 * @type boolean
 *
 * @param メッセージ速度変数
 * @desc メッセージスピードを指定した番号の変数から取得するよう変更します。変数の値がフレーム値になります。
 * @default 0
 * @type number
 *
 * @param 行動終了後ウェイト
 * @desc 行動終了後、メッセージをクリアする前に指定したフレーム数だけウェイトを掛けます。
 * @default 0
 * @type number
 *
 * @param メッセージ行数
 * @desc ウィンドウの行数です。行数を減らすとダメージ表示等のメッセージが表示されなくなる場合があります。
 * @default 4
 * @type number
 *
 * @param 空の場合に非表示
 * @desc ウィンドウに表示する内容がないとき、ウィンドウが非表示になります。
 * @default false
 * @type boolean
 *
 * @param スキル名簡易表示
 * @desc スキルおよびアイテムの表示を名称のみの中央表示に切り替えます。
 * @default false
 * @type boolean
 *
 * @help バトルログを画面下部のメッセージウィンドウ内に表示するよう変更します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 *  BLM_バトルログ閉じる
 *  BLM_BATTLE_LOG_CLOSE
 *
 *  バトルログのウィンドウを閉じます。バトルイベントから実行します。
 *
 *  BLM_バトルログ開く
 *  BLM_BATTLE_LOG_OPEN
 *
 *  バトルログのウィンドウを再度開きます。バトルイベントから実行します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'BattleLogToMessage';
    var metaTagPrefix = 'BLM';

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

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramStatusPosUpper      = getParamBoolean(['StatusPosUpper', 'ステータス上部配置']);
    var paramSuppressPopup       = getParamBoolean(['SuppressPopup', 'ポップアップ抑制']);
    var paramMessagePosUpper     = getParamBoolean(['MessagePosUpper', 'メッセージ上部配置']);
    var paramMessageSpeed        = getParamNumber(['MessageSpeed', 'メッセージ速度変数'], 0);
    var paramWaitForEndAction    = getParamNumber(['WaitForEndAction', '行動終了後ウェイト'], 0);
    var paramMessageLines        = getParamNumber(['MessageLines', 'メッセージ行数'], 0);
    var paramHiddenIfEmpty       = getParamBoolean(['HiddenIfEmpty', '空の場合に非表示']);
    var paramSkillViewSimplified = getParamBoolean(['SkillViewSimplified', 'スキル名簡易表示']);

    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var commandPrefix = new RegExp('^' + metaTagPrefix);
        if (!command.match(commandPrefix)) return;
        this.pluginCommandBattleLogToMessage(command.replace(commandPrefix, ''), args);
    };

    Game_Interpreter.prototype.pluginCommandBattleLogToMessage = function(command) {
        switch (getCommandName(command)) {
            case '_BATTLE_LOG_OPEN' :
            case '_バトルログ開く' :
                BattleManager.setBattleLogClose(false);
                break;
            case '_BATTLE_LOG_CLOSE' :
            case '_バトルログ閉じる' :
                BattleManager.setBattleLogClose(true);
                break;
        }
    };

    //=============================================================================
    // BattleManager
    //  ウィンドウの開閉状態を管理します。
    //=============================================================================
    var _BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers      = function() {
        _BattleManager_initMembers.apply(this, arguments);
        this._battleLogClose = false;
    };

    BattleManager.setBattleLogClose = function(value) {
        this._battleLogClose = value;
    };

    BattleManager.isBattleLogClose = function() {
        return this._battleLogClose;
    };

    var _BattleManager_displayRewards = BattleManager.displayRewards;
    BattleManager.displayRewards      = function() {
        this._logWindow.hide();
        _BattleManager_displayRewards.apply(this, arguments);
    };

    SceneManager.isBattleScene = function() {
        return this._scene instanceof Scene_Battle;
    };

    //=============================================================================
    // Scene_Battle
    //  ウィンドウのレイアウトを変更します。
    //=============================================================================
    var _Scene_Battle_createAllWindows      = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.apply(this, arguments);
        this._windowLayer.removeChild(this._logWindow);
        this._windowLayer.addChildAt(this._logWindow, this._windowLayer.getChildIndex(this._messageWindow) - 1);
        if (paramStatusPosUpper) {
            this.adjustWindowPositions();
        }
        if (paramMessagePosUpper) {
            this.adjustWindowMessagePositions();
        }
    };

    Scene_Battle.prototype.adjustWindowPositions = function() {
        this._partyCommandWindow.y = 0;
        this._actorCommandWindow.y = 0;
        this._statusWindow.y       = 0;
        this._helpWindow.y         = this._partyCommandWindow.height;
        this._actorWindow.y        = 0;
        this._enemyWindow.y        = 0;
        this._skillWindow.y        = this._helpWindow.y + this._helpWindow.height;
        this._itemWindow.y         = this._skillWindow.y;
    };

    Scene_Battle.prototype.adjustWindowMessagePositions = function() {
        this._messageWindow.y = 0;
        this._logWindow.y     = 0;
    };

    var _Scene_Battle_updateWindowPositions      = Scene_Battle.prototype.updateWindowPositions;
    Scene_Battle.prototype.updateWindowPositions = function() {
        if (BattleManager.isInputting() || BattleManager.isBattleLogClose()) {
            this._logWindow.close();
        } else {
            this._logWindow.open();
        }
        _Scene_Battle_updateWindowPositions.apply(this, arguments);
    };

    //=============================================================================
    // Window_BattleLog
    //  ウィンドウのレイアウトを変更します。
    //=============================================================================
    var _Window_BattleLog_initialize      = Window_BattleLog.prototype.initialize;
    Window_BattleLog.prototype.initialize = function() {
        _Window_BattleLog_initialize.apply(this, arguments);
        this.y        = Graphics.boxHeight - this.windowHeight();
        this.opacity  = 255;
        this.openness = 0;
    };

    Window_BattleLog.prototype.maxLines = function() {
        return paramMessageLines || 4;
    };

    var _Window_BattleLog_update      = Window_BattleLog.prototype.update;
    Window_BattleLog.prototype.update = function() {
        Window_Base.prototype.update.apply(this, arguments);
        _Window_BattleLog_update.apply(this, arguments);
    };

    var _Window_BattleLog_refresh      = Window_BattleLog.prototype.refresh;
    Window_BattleLog.prototype.refresh = function() {
        _Window_BattleLog_refresh.apply(this, arguments);
        if (!paramHiddenIfEmpty) {
            return;
        }
        if (this._lines.length <= 0) {
            this.hide();
        } else {
            this.show();
        }
    };

    var _Window_BattleLog_messageSpeed      = Window_BattleLog.prototype.messageSpeed;
    Window_BattleLog.prototype.messageSpeed = function() {
        return (paramMessageSpeed ? $gameVariables.value(paramMessageSpeed) :
            _Window_BattleLog_messageSpeed.apply(this, arguments));
    };

    Window_BattleLog.prototype.waitForCustom = function(waitCount) {
        this._waitCount = waitCount;
    };

    var _Window_BattleLog_endAction      = Window_BattleLog.prototype.endAction;
    Window_BattleLog.prototype.endAction = function(subject) {
        if (paramWaitForEndAction) {
            this.push('waitForCustom', paramWaitForEndAction);
        }
        _Window_BattleLog_endAction.apply(this, arguments);
    };

    var _Window_BattleLog_addText      = Window_BattleLog.prototype.addText;
    Window_BattleLog.prototype.addText = function(text) {
        if (!text) {
            return;
        }
        _Window_BattleLog_addText.apply(this, arguments);
    };

    Window_BattleLog.prototype.drawBackground = function() {};

    if (paramSkillViewSimplified) {
        Window_BattleLog.prototype.displayAction = function(subject, item) {
            this.push('addText', item.name);
            this._displayCenterText = item.name;
        };

        var _Window_BattleLog_drawLineText = Window_BattleLog.prototype.drawLineText;
        Window_BattleLog.prototype.drawLineText = function(index) {
            if (this._displayCenterText === this._lines[index]) {
                var rect = this.itemRectForText(index);
                var realWidth = this.drawTextEx(this._lines[index], rect.x, -rect.height, rect.width);
                rect.x += (rect.width / 2 - realWidth / 2);
                this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
                this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
            } else {
                _Window_BattleLog_drawLineText.apply(this, arguments);
            }
        };

        var _Window_BattleLog_endAction2 = Window_BattleLog.prototype.endAction;
        Window_BattleLog.prototype.endAction = function(subject) {
            this._displayCenterText = null;
            _Window_BattleLog_endAction2.apply(this, arguments);
        };
    }

    //=============================================================================
    // Window_Message
    //  戦闘中はメッセージウィンドウを上部に固定します。
    //=============================================================================
    var _Window_Message_updatePlacement      = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        _Window_Message_updatePlacement.apply(this, arguments);
        if ($gameParty.inBattle() && paramMessagePosUpper) {
            this.y = 0;
        }
    };

    var _Window_Message_numVisibleRows      = Window_Message.prototype.numVisibleRows;
    Window_Message.prototype.numVisibleRows = function() {
        if (SceneManager.isBattleScene() && paramMessageLines > 0 && !$gameSystem.messageRows) {
            return paramMessageLines;
        } else {
            return _Window_Message_numVisibleRows.apply(this, arguments);
        }
    };

    //=============================================================================
    // Game_Battler
    //  ダメージポップアップを抑制します。
    //=============================================================================
    var _Game_Battler_startDamagePopup      = Game_Battler.prototype.startDamagePopup;
    Game_Battler.prototype.startDamagePopup = function() {
        if (!paramSuppressPopup) _Game_Battler_startDamagePopup.apply(this, arguments);
    };

    var _Game_Message_add      = Game_Message.prototype.add;
    Game_Message.prototype.add = function(text) {
        if (!text && $gameParty.inBattle()) {
            return;
        }
        _Game_Message_add.apply(this, arguments);
    };
})();

