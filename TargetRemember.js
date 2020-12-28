/*=============================================================================
 TargetRemember.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.2 2020/12/28 1.0.1の考慮漏れを追加で修正
 1.0.1 2020/12/28 記憶したターゲットが存在しなくなった場合に選択状態がおかしくなる問題を修正
 1.0.0 2020/12/28 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc TargetRememberPlugin
 * @author triacontane
 *
 * @help TargetRemember.js
 *
 * When "Command Remember" is turned on from the options,
 * not only the command but also the target will be memorized
 * at the same time.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ターゲット記憶プラグイン
 * @author トリアコンタン
 *
 * @help TargetRemember.js
 *
 * オプションから『コマンド記憶』をONにしたとき、
 * コマンドだけでなくターゲットも同時に記憶します。
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

    var _Scene_Battle_selectEnemySelection = Scene_Battle.prototype.selectEnemySelection;
    Scene_Battle.prototype.selectEnemySelection = function() {
        _Scene_Battle_selectEnemySelection.apply(this, arguments);
        this._enemyWindow.selectLast();
    };

    var _Scene_Battle_selectActorSelection = Scene_Battle.prototype.selectActorSelection;
    Scene_Battle.prototype.selectActorSelection = function() {
        _Scene_Battle_selectActorSelection.apply(this, arguments);
        this._actorWindow.selectLast();
    };

    var _Scene_Battle_onActorOk = Scene_Battle.prototype.onActorOk;
    Scene_Battle.prototype.onActorOk = function() {
        BattleManager.actor().setLastBattleTarget(this._actorWindow.actor());
        _Scene_Battle_onActorOk.apply(this, arguments);
    };

    var _Scene_Battle_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
    Scene_Battle.prototype.onEnemyOk = function() {
        BattleManager.actor().setLastBattleTarget(this._enemyWindow.enemy());
        _Scene_Battle_onEnemyOk.apply(this, arguments);
    };

    Window_BattleActor.prototype.selectLast = function() {
        var actor = BattleManager.actor();
        if (!ConfigManager.commandRemember || !actor) {
            return;
        }
        var index = $gameParty.members().indexOf(actor.lastBattleTarget())
        if (index >= 0) {
            this.select(index);
        }
    };

    Window_BattleEnemy.prototype.selectLast = function() {
        var actor = BattleManager.actor();
        if (!ConfigManager.commandRemember || !actor) {
            return;
        }
        var index = this._enemies.indexOf(actor.lastBattleTarget());
        if (index >= 0) {
            this.select(index);
        }
    };

    Game_Actor.prototype.lastBattleTarget = function() {
        return this._lastBattleTarget;
    };

    Game_Actor.prototype.setLastBattleTarget = function(target) {
        this._lastBattleTarget = target;
    };

    var _BattleManager_endBattle = BattleManager.endBattle
    BattleManager.endBattle = function(result) {
        _BattleManager_endBattle.apply(this, arguments);
        $gameParty.members().forEach(function(actor) {
            actor.setLastBattleTarget(null);
        });
    };
})();
