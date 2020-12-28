/*=============================================================================
 TargetRemember.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.2 2020/12/28 1.1.1の考慮漏れを追加で修正
 1.1.1 2020/12/28 記憶したターゲットが存在しなくなった場合に選択状態がおかしくなる問題を修正
 1.1.0 2020/12/28 MZで動作するよう修正
 1.0.0 2020/12/28 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc TargetRememberPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TargetRemember.js
 * @base PluginCommonBase
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
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TargetRemember.js
 * @base PluginCommonBase
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

    const _Scene_Battle_startEnemySelection = Scene_Battle.prototype.startEnemySelection;
    Scene_Battle.prototype.startEnemySelection = function() {
        _Scene_Battle_startEnemySelection.apply(this, arguments);
        this._enemyWindow.selectLast();
    };

    const _Scene_Battle_startActorSelection = Scene_Battle.prototype.startActorSelection;
    Scene_Battle.prototype.startActorSelection = function() {
        _Scene_Battle_startActorSelection.apply(this, arguments);
        this._actorWindow.selectLast();
    };

    const _Scene_Battle_onActorOk = Scene_Battle.prototype.onActorOk;
    Scene_Battle.prototype.onActorOk = function() {
        BattleManager.actor().setLastBattleTarget(this._actorWindow.actor(this._actorWindow.index()));
        _Scene_Battle_onActorOk.apply(this, arguments);
    };

    const _Scene_Battle_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
    Scene_Battle.prototype.onEnemyOk = function() {
        BattleManager.actor().setLastBattleTarget(this._enemyWindow.enemy(this._enemyWindow.index()));
        _Scene_Battle_onEnemyOk.apply(this, arguments);
    };

    Window_BattleActor.prototype.selectLast = function() {
        const actor = BattleManager.actor();
        if (!ConfigManager.commandRemember || !actor) {
            return;
        }
        const index = $gameParty.members().indexOf(actor.lastBattleTarget())
        if (index >= 0) {
            this.select(index);
        }
    };

    Window_BattleEnemy.prototype.selectLast = function() {
        const actor = BattleManager.actor();
        if (!ConfigManager.commandRemember || !actor) {
            return;
        }
        const index = this._enemies.indexOf(actor.lastBattleTarget());
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

    const _BattleManager_endBattle = BattleManager.endBattle
    BattleManager.endBattle = function(result) {
        _BattleManager_endBattle.apply(this, arguments);
        $gameParty.members().forEach(function(actor) {
            actor.setLastBattleTarget(null);
        });
    };
})();
