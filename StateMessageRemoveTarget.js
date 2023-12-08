/*=============================================================================
 StateMessageRemoveTarget.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2023/12/08 マップ上でステート付与した場合に名前が消されていなかった問題を修正
 1.0.0 2019/09/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc StateMessageRemoveTargetPlugin
 * @author triacontane
 *
 * @help StateMessageRemoveBattler.js
 * ステートメッセージの先頭に自動付与される「対象者の名前」を消去します。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ステートメッセージから対象者の名前を消去するプラグイン
 * @author トリアコンタン
 *
 * @help StateMessageRemoveBattler.js
 * ステートメッセージの先頭に自動付与される「対象者の名前」を消去します。
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

    /**
     * Game_Battler
     * 名称を返却する際に空文字を返します。
     */
    Game_Battler.prototype.hiddenNameOnlyTargetProcess = function(process) {
        var prevName = this._name;
        this._name = ''
        process();
        this._name = prevName;
    };

    var _Game_Actor_showAddedStates = Game_Actor.prototype.showAddedStates;
    Game_Actor.prototype.showAddedStates = function() {
        this.hiddenNameOnlyTargetProcess(_Game_Actor_showAddedStates.bind(this));
    };

    var _Game_Actor_showRemovedStates = Game_Actor.prototype.showRemovedStates;
    Game_Actor.prototype.showRemovedStates = function() {
        this.hiddenNameOnlyTargetProcess(_Game_Actor_showRemovedStates.bind(this));
    };

    /**
     * Window_BattleLog ステートメッセージから対象者名を除去します。
     */
    var _Window_BattleLog_displayCurrentState = Window_BattleLog.prototype.displayCurrentState;
    Window_BattleLog.prototype.displayCurrentState = function(subject) {
        subject.hiddenNameOnlyTargetProcess(_Window_BattleLog_displayCurrentState.bind(this, subject));
    };

    var _Window_BattleLog_displayChangedStates = Window_BattleLog.prototype.displayChangedStates;
    Window_BattleLog.prototype.displayChangedStates = function(target) {
        target.hiddenNameOnlyTargetProcess(_Window_BattleLog_displayChangedStates.bind(this, target));
    };
})();
