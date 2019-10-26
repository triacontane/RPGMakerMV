//=============================================================================
// SessionManager.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/11/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc SessionManagerPlugin
 * @author triacontane
 *
 * @help SessionManager.js
 *
 * プレー中のセッションを管理します。
 * セッションとは1回のプレーに対して割り当てられる一意の値で
 * ニューゲームもしくはデータロード時に設定、更新されます。
 *
 * この値を保持、比較することで、ある特定のタイミングから
 * セーブ＆ロードされたかどうかを判定できます。
 *
 * スクリプト詳細(イベントコマンドの「スクリプト」「条件分岐」で使用)
 * ・現在のセッションを保持します。
 * $gameSystem.saveSession();
 *
 * ・保持していたセッションと現在のセッションを比較して同一の場合に
 * 　trueを返します。
 * $gameSystem.isSameSession();
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc セッション管理プラグイン
 * @author トリアコンタン
 *
 * @help SessionManager.js
 *
 * プレー中のセッションを管理します。
 * セッションとは1回のプレーに対して割り当てられる一意の値で
 * ニューゲームもしくはデータロード時に設定、更新されます。
 *
 * この値を保持、比較することで、ある特定のタイミングから
 * セーブ＆ロードされたかどうかを判定できます。
 *
 * スクリプト詳細(イベントコマンドの「スクリプト」「条件分岐」で使用)
 * ・現在のセッションを保持します。
 * $gameSystem.saveSession();
 *
 * ・保持していたセッションと現在のセッションを比較して同一の場合に
 * 　trueを返します。
 * $gameSystem.isSameSession();
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

    //=============================================================================
    // DataManager
    //  ニューゲーム時およびロード時にセッションを作成します。
    //=============================================================================
    var _DataManager_loadGame = DataManager.loadGame;
    DataManager.loadGame = function(savefileId) {
        var result = _DataManager_loadGame.apply(this, arguments);
        $gameTemp.createSession();
        return result;
    };

    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.apply(this, arguments);
        $gameTemp.createSession();
    };

    //=============================================================================
    // Game_Temp
    //  現在のセッションを管理します。
    //=============================================================================
    Game_Temp.prototype.createSession = function() {
        this._sessionId = 'session' + Date.now().toString();
    };

    Game_Temp.prototype.getSession = function() {
        return this._sessionId;
    };

    //=============================================================================
    // Game_System
    //  セッションを保持して、現在のセッションと比較します。
    //=============================================================================
    Game_System.prototype.saveSession = function() {
        this._sessionId = $gameTemp.getSession();
    };

    Game_System.prototype.isSameSession = function() {
        return this._sessionId === $gameTemp.getSession();
    };
})();

