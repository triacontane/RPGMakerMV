//=============================================================================
// BattleLogToMessage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2016/10/18 メッセージスピードの調整機能と、行動終了後に追加ウェイトする機能を追加
// 1.1.0 2016/10/14 ダメージのポップアップを抑制する機能を追加
// 1.0.0 2016/10/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BattleLogToMessagePlugin
 * @author triacontane
 *
 * @param StatusPosUpper
 * @desc コマンドやステータスのウィンドウを画面上部に配置して、メッセージによって隠れないようにします。
 * @default ON
 *
 * @param SuppressPopup
 * @desc ダメージのポップアップを非表示にします。
 * @default OFF
 *
 * @param MessageSpeed
 * @desc メッセージスピードを指定した番号の変数から取得するよう変更します。変数値(0:ウェイトなし 1:通常 2以上:遅くなる)
 * @default 0
 *
 * @param WaitForEndAction
 * @desc 行動終了後、メッセージをクリアする前に指定したフレーム数だけウェイトを掛けます。
 * @default 0
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
 * @default ON
 *
 * @param ポップアップ抑制
 * @desc ダメージのポップアップを非表示にします。
 * @default OFF
 *
 * @param メッセージ速度変数
 * @desc メッセージスピードを指定した番号の変数から取得するよう変更します。変数の値がフレーム値になります。
 * @default 0
 *
 * @param 行動終了後ウェイト
 * @desc 行動終了後、メッセージをクリアする前に指定したフレーム数だけウェイトを掛けます。
 * @default 0
 *
 * @help バトルログを画面下部のメッセージウィンドウ内に表示するよう変更します。
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
    var pluginName = 'BattleLogToMessage';

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
        return (value || '').toUpperCase() === 'ON';
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramStatusPosUpper   = getParamBoolean(['StatusPosUpper', 'ステータス上部配置']);
    var paramSuppressPopup    = getParamBoolean(['SuppressPopup', 'ポップアップ抑制']);
    var paramMessageSpeed     = getParamNumber(['MessageSpeed', 'メッセージ速度変数'], 0);
    var paramWaitForEndAction = getParamNumber(['WaitForEndAction', '行動終了後ウェイト'], 0);

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

    var _Scene_Battle_updateWindowPositions      = Scene_Battle.prototype.updateWindowPositions;
    Scene_Battle.prototype.updateWindowPositions = function() {
        if (BattleManager.isInputting()) {
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
        return 4;
    };

    var _Window_BattleLog_update      = Window_BattleLog.prototype.update;
    Window_BattleLog.prototype.update = function() {
        Window_Base.prototype.update.apply(this, arguments);
        _Window_BattleLog_update.apply(this, arguments);
    };

    var _Window_BattleLog_messageSpeed = Window_BattleLog.prototype.messageSpeed;
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

    Window_BattleLog.prototype.drawBackground = function() {};

    //=============================================================================
    // Game_Battler
    //  ダメージポップアップを抑制します。
    //=============================================================================
    var _Game_Battler_startDamagePopup      = Game_Battler.prototype.startDamagePopup;
    Game_Battler.prototype.startDamagePopup = function() {
        if (!paramSuppressPopup) _Game_Battler_startDamagePopup.apply(this, arguments);
    };
})();

