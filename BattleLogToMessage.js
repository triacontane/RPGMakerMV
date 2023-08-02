//=============================================================================
// BattleLogToMessage.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2023/08/02 MZ向けに全面的に修正
// 1.10.2 2021/03/09 戦闘から逃走、敗北した際はログウィンドウが消えるよう修正
// 1.10.1 2020/06/04 1.9.1の修正により、ステータスウィンドウを下部に配置するとメッセージの上に表示されてしまう問題を修正
// 1.10.0 2020/05/30 バトルログウィンドウのフォントサイズを変更できる機能を追加
// 1.9.2 2020/04/30 1.9.1の修正が不完全だったので再度修正
// 1.9.1 2020/04/29 GraphicalDesignMode.jsと併用したときバトルログウィンドウの位置変更が反映されない問題を修正
// 1.9.0 2019/06/09 表示メッセージが行数の上限を上回った場合に表示がカットされないよう変更
// 1.8.0 2019/04/14 もともとメッセージウィンドウで表示していたものはそのまま表示する設定を追加
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
 * @plugindesc バトルログのメッセージ表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleLogToMessage.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param StatusPosUpper
 * @text ステータス上部配置
 * @desc コマンドやステータスのウィンドウを画面上部に配置して、メッセージによって隠れないようにします。
 * @default false
 * @type boolean
 *
 * @param MessagePosUpper
 * @text メッセージ上部配置
 * @desc メッセージウィンドウを上部に表示します。その場合、ステータス上部配置は無効にしてください。
 * @default false
 * @type boolean
 *
 * @param MessageSpeed
 * @text メッセージ速度変数
 * @desc メッセージスピードを指定した番号の変数から取得するよう変更します。変数の値がフレーム値になります。
 * @default 0
 * @type number
 *
 * @param WaitForEndAction
 * @text 行動終了後ウェイト
 * @desc 行動終了後、メッセージをクリアする前に指定したフレーム数だけウェイトを掛けます。
 * @default 0
 * @type number
 *
 * @param FontSize
 * @text フォントサイズ
 * @desc ログウィンドウのフォントサイズです。
 * @default 0
 * @type number
 *
 * @param MessageLines
 * @text メッセージ行数
 * @desc ウィンドウの行数です。行数を減らすとダメージ表示等のメッセージが表示されなくなる場合があります。
 * @default 2
 * @type number
 *
 * @param HiddenIfEmpty
 * @text 空の場合に非表示
 * @desc ウィンドウに表示する内容がないとき、ウィンドウが非表示になります。
 * @default false
 * @type boolean
 *
 * @command LOG_CLOSE
 * @text ログウィンドウ閉じる
 * @desc ログウィンドウを閉じます。
 *
 * @command LOG_OPEN
 * @text ログウィンドウ開く
 * @desc 閉じていたログウィンドウを再度開きます。
 *
 * @help BattleLogToMessage.js
 * 
 * バトルログを画面下部のメッセージウィンドウ内に表示するよう変更します。
 * 表示方法や仕様をプラグインパラメータから変更できます。
 * 
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
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

    PluginManagerEx.registerCommand(script, 'LOG_CLOSE', args => {
        BattleManager.setBattleLogClose(true);
    });

    PluginManagerEx.registerCommand(script, 'LOG_OPEN', args => {
        BattleManager.setBattleLogClose(false);
    });

    //=============================================================================
    // BattleManager
    //  ウィンドウの開閉状態を管理します。
    //=============================================================================
    const _BattleManager_initMembers = BattleManager.initMembers;
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

    const _BattleManager_displayRewards = BattleManager.displayRewards;
    BattleManager.displayRewards      = function() {
        this._logWindow.hide();
        _BattleManager_displayRewards.apply(this, arguments);
    };

    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        _BattleManager_endBattle.apply(this, arguments);
        this._logWindow.hide();
    };

    SceneManager.isBattleScene = function() {
        return this._scene instanceof Scene_Battle;
    };

    BattleManager.isStarting = function() {
        return this._phase === 'start';
    };

    //=============================================================================
    // Scene_Battle
    //  ウィンドウのレイアウトを変更します。
    //=============================================================================
    const _Scene_Battle_createAllWindows      = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.apply(this, arguments);
        if (param.StatusPosUpper) {
            this.adjustWindowPositions();
        }
        this.addWindow(this._logWindow);
    };

    const _Scene_Battle_helpAreaTop = Scene_Battle.prototype.helpAreaTop;
    Scene_Battle.prototype.helpAreaTop = function() {
        const top = _Scene_Battle_helpAreaTop.apply(this, arguments);
        if (param.StatusPosUpper) {
            return Graphics.boxHeight - this.helpAreaHeight();
        }
        return top;
    };

    const _Scene_Battle_buttonAreaTop = Scene_Battle.prototype.buttonAreaTop;
    Scene_Battle.prototype.buttonAreaTop = function() {
        const top = _Scene_Battle_buttonAreaTop.apply(this, arguments);
        if (param.StatusPosUpper) {
            return this.windowAreaHeight();
        }
        return top;
    };

    Scene_Battle.prototype.adjustWindowPositions = function() {
        this._partyCommandWindow.y = 0;
        this._actorCommandWindow.y = 0;
        this._statusWindow.y       = 0;
        this._actorWindow.y        = 0;
        this._enemyWindow.y        = 0;
        this._skillWindow.y        = 0;
        this._itemWindow.y         = 0;
    };

    const _Scene_Battle_updateLogWindowVisibility      = Scene_Battle.prototype.updateLogWindowVisibility;
    Scene_Battle.prototype.updateLogWindowVisibility = function() {
        if (!param.HiddenIfEmpty) {
            _Scene_Battle_updateLogWindowVisibility.apply(this, arguments);
        }
        if ($gameMessage.isBusy()) {
            this._logWindow.hide();
        }
        if (BattleManager.isInputting() || BattleManager.isBattleLogClose() || BattleManager.isStarting()) {
            this._logWindow.close();
        } else {
            this._logWindow.open();
        }
        if (param.MessagePosUpper) {
            this._messageWindow.y = 0;
            this._logWindow.y = this._messageWindow.y;
        } else {
            this._logWindow.y = this._messageWindow.y + (this._messageWindow.height - this._logWindow.height);
        }
    };

    const _Scene_Battle_logWindowRect = Scene_Battle.prototype.logWindowRect;
    Scene_Battle.prototype.logWindowRect = function() {
        _Scene_Battle_logWindowRect.apply(this, arguments);
        const rect = this.messageWindowRect();
        rect.height = this.calcWindowHeight(Window_BattleLog.messageLines(), false) + 8;
        return rect;
    };

    //=============================================================================
    // Window_BattleLog
    //  ウィンドウのレイアウトを変更します。
    //=============================================================================
    Window_BattleLog.messageLines = function () {
        return param.MessageLines || 4;
    }

    const _Window_BattleLog_initialize      = Window_BattleLog.prototype.initialize;
    Window_BattleLog.prototype.initialize = function() {
        _Window_BattleLog_initialize.apply(this, arguments);
        this.opacity  = 255;
        this.openness = 0;
    };

    Window_BattleLog.prototype.maxLines = function() {
        return Window_BattleLog.messageLines();
    };

    const _Window_BattleLog_update      = Window_BattleLog.prototype.update;
    Window_BattleLog.prototype.update = function() {
        Window_Base.prototype.update.apply(this, arguments);
        _Window_BattleLog_update.apply(this, arguments);
    };

    const _Window_BattleLog_refresh      = Window_BattleLog.prototype.refresh;
    Window_BattleLog.prototype.refresh = function() {
        _Window_BattleLog_refresh.apply(this, arguments);
        if (!param.HiddenIfEmpty) {
            return;
        }
        if (this._lines.length <= 0) {
            this.hide();
        } else {
            this.show();
        }
    };

    const _Window_BattleLog_messageSpeed      = Window_BattleLog.prototype.messageSpeed;
    Window_BattleLog.prototype.messageSpeed = function() {
        return (param.MessageSpeed ? $gameVariables.value(param.MessageSpeed) :
            _Window_BattleLog_messageSpeed.apply(this, arguments));
    };

    Window_BattleLog.prototype.waitForCustom = function(waitCount) {
        this._waitCount = waitCount;
    };

    const _Window_BattleLog_endAction      = Window_BattleLog.prototype.endAction;
    Window_BattleLog.prototype.endAction = function(subject) {
        if (param.WaitForEndAction) {
            this.push('waitForCustom', param.WaitForEndAction);
        }
        _Window_BattleLog_endAction.apply(this, arguments);
    };

    const _Window_BattleLog_resetFontSettings = Window_BattleLog.prototype.resetFontSettings;
    Window_BattleLog.prototype.resetFontSettings = function() {
        _Window_BattleLog_resetFontSettings.apply(this, arguments);
        if (param.FontSize > 0) {
            this.contents.fontSize = param.FontSize;
        }
    };

    const _Window_BattleLog_addText      = Window_BattleLog.prototype.addText;
    Window_BattleLog.prototype.addText = function(text) {
        if (!text) {
            return;
        }
        if (this._lines.length >= this.maxLines()) {
            this._waitCount = 0;
            this.push('clear');
            this.push('addText', text);
            return;
        }
        _Window_BattleLog_addText.apply(this, arguments);
    };

    Window_BattleLog.prototype.drawBackground = function() {};

    const _Game_Message_add      = Game_Message.prototype.add;
    Game_Message.prototype.add = function(text) {
        if (!text && $gameParty.inBattle()) {
            return;
        }
        _Game_Message_add.apply(this, arguments);
    };
})();

