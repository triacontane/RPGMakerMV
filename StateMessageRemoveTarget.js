/*=============================================================================
 StateMessageRemoveTarget.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2019/09/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc StateMessageRemoveTargetPlugin
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author triacontane
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
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author トリアコンタン
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
        this._removeName = true;
        process();
        this._removeName = false;
    };

    Game_Battler.prototype.removeNameIfNeed = function(name) {
        return this._removeName ? '' : name;
    };

    var _Game_Actor_name = Game_Actor.prototype.name;
    Game_Actor.prototype.name = function() {
        return this.removeNameIfNeed( _Game_Actor_name.apply(this, arguments));
    };

    var _Game_Enemy_name = Game_Enemy.prototype.name;
    Game_Enemy.prototype.name = function() {
        return this.removeNameIfNeed(_Game_Enemy_name.apply(this, arguments));
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
