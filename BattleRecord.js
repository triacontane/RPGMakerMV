//=============================================================================
// BattleRecord.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/08/25 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Battle Record Plugin
 * @author triacontane
 *
 * @help 戦闘中の様々な記録を保存できます。
 * 戦績として記録に残せるほか、特殊なスキルのダメージ計算式に
 * 組み込んだりすることもできます。
 *
 * アクターごとに以下の要素を記録できます。
 *
 * ・スキルごとの使用回数
 * ・敵キャラごとの撃破回数
 * ・与えたダメージの合計
 * ・与えたダメージの最大
 * ・受けたダメージの合計
 * ・受けたダメージの最大
 * ・回復したダメージの合計
 * ・戦闘不能回数
 *
 * 値はイベントコマンド「変数の操作」から「スクリプト」で
 * 対応するスクリプトを呼び出して取得してください。
 *
 * ・データベースのアクターIDから取得する場合
 * $gameActors.actor(1).getSkillUseCounter(2);  # アクター[1]のスキル[2]使用回数
 * $gameActors.actor(1).getKillEnemyCounter(4); # アクター[1]の敵キャラ[4]撃破数
 * $gameActors.actor(1).attackDamageMax;        # アクター[1]の最大与ダメージ
 * $gameActors.actor(1).attackDamageSum;        # アクター[1]の合計与ダメージ
 * $gameActors.actor(1).acceptDamageMax;        # アクター[1]の最大被ダメージ
 * $gameActors.actor(1).acceptDamageSum;        # アクター[1]の合計被ダメージ
 * $gameActors.actor(1).recoverDamageSum;       # アクター[1]の合計回復ダメージ
 * $gameActors.actor(1).deadCounter;            # アクター[1]の戦闘不能回数
 *
 * ・パーティの並び順(先頭は0)から取得する場合
 * $gameActors.actor(1)を$gameParty.members()[0]に置き換えて実行する。
 * (例)
 * $gameParty.members()[0].attackDamageMax # 先頭メンバーの最大与ダメージ
 *
 * ・計算式で使用する場合
 * $gameActors.actor(1)をa(実行者)もしくはb(対象者)に置き換えて実行する。
 * (例)
 * a.getSkillUseCounter(5)  # 実行者のスキル[5]使用回数
 * b.getKillEnemyCounter(6) # 対象者の敵キャラ[6]撃破数
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 戦績プラグイン
 * @author トリアコンタン
 *
 * @help 戦闘中の様々な記録を保存できます。
 * 戦績として記録に残せるほか、特殊なスキルのダメージ計算式に
 * 組み込んだりすることもできます。
 *
 * アクターごとに以下の要素を記録できます。
 *
 * ・スキルごとの使用回数(戦闘中のみカウント)
 * ・敵キャラごとの撃破回数
 * ・与えたダメージの合計
 * ・与えたダメージの最大
 * ・受けたダメージの合計
 * ・受けたダメージの最大
 * ・回復したダメージの合計
 * ・戦闘不能回数
 *
 * 値はイベントコマンド「変数の操作」から「スクリプト」で
 * 対応するスクリプトを呼び出して取得してください。
 *
 * ・データベースのアクターIDから取得する場合
 * $gameActors.actor(1).getSkillUseCounter(2);  # アクター[1]のスキル[2]使用回数
 * $gameActors.actor(1).getKillEnemyCounter(4); # アクター[1]の敵キャラ[4]撃破数
 * $gameActors.actor(1).attackDamageMax;        # アクター[1]の最大与ダメージ
 * $gameActors.actor(1).attackDamageSum;        # アクター[1]の合計与ダメージ
 * $gameActors.actor(1).acceptDamageMax;        # アクター[1]の最大被ダメージ
 * $gameActors.actor(1).acceptDamageSum;        # アクター[1]の合計被ダメージ
 * $gameActors.actor(1).recoverDamageSum;       # アクター[1]の合計回復ダメージ
 * $gameActors.actor(1).deadCounter;            # アクター[1]の戦闘不能回数
 *
 * ・パーティの並び順(先頭は0)から取得する場合
 * $gameActors.actor(1)を$gameParty.members()[0]に置き換えて実行する。
 * (例)
 * $gameParty.members()[0].attackDamageMax # 先頭メンバーの最大与ダメージ
 *
 * ・計算式で使用する場合
 * $gameActors.actor(1)をa(実行者)もしくはb(対象者)に置き換えて実行する。
 * (例)
 * a.getSkillUseCounter(5)  # 実行者のスキル[5]使用回数
 * b.getKillEnemyCounter(6) # 対象者の敵キャラ[6]撃破数
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
    // Game_BattlerBase
    //  戦績を記録します。
    //=============================================================================
    var _Game_BattlerBase_initMembers      = Game_BattlerBase.prototype.initMembers;
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.apply(this, arguments);
        this.clearBattleRecord();
    };

    Game_BattlerBase.prototype.clearBattleRecord = function() {
        this._useSkillCounter  = [];
        this._killEnemyCounter = [];
        this.attackDamageMax   = 0;
        this.attackDamageSum   = 0;
        this.acceptDamageMax   = 0;
        this.acceptDamageSum   = 0;
        this.recoverDamageSum  = 0;
        this.deadCounter       = 0;
    };

    Game_BattlerBase.prototype.getBattlerId = function() {
        return this.isActor() ? this.actorId() : this.isEnemy() ? this.enemyId() : 0;
    };

    Game_BattlerBase.prototype.recordAttackDamage = function(value) {
        if (value >= 0) {
            this.attackDamageMax = Math.max((this.attackDamageMax || 0), value);
            this.attackDamageSum = (this.attackDamageSum || 0) + value;
        } else {
            this.recordRecoverDamage(-value);
        }
    };

    Game_BattlerBase.prototype.recordAcceptDamage = function(value) {
        if (value >= 0) {
            this.acceptDamageMax = Math.max((this.acceptDamageMax || 0), value);
            this.acceptDamageSum = (this.acceptDamageSum || 0) + value;
        }
    };

    Game_BattlerBase.prototype.recordRecoverDamage = function(value) {
        this.recoverDamageSum = (this.recoverDamageSum || 0) + value;
    };

    Game_BattlerBase.prototype.recordDead = function() {
        this.deadCounter = (this.deadCounter || 0) + 1;
    };

    Game_BattlerBase.prototype.recordSkillUseCounter = function(skillId) {
        var counter                    = this.getSkillUseCounter(skillId);
        this._useSkillCounter[skillId] = counter + 1;
    };

    Game_BattlerBase.prototype.recordKillEnemyCounter = function(enemyId) {
        var counter                     = this.getKillEnemyCounter(enemyId);
        this._killEnemyCounter[enemyId] = counter + 1;
    };

    Game_BattlerBase.prototype.getSkillUseCounter = function(skillId) {
        if (!this._useSkillCounter) this._useSkillCounter = [];
        return this._useSkillCounter[skillId] || 0;
    };

    Game_BattlerBase.prototype.getKillEnemyCounter = function(enemyId) {
        if (!this._killEnemyCounter) this._killEnemyCounter = [];
        return this._killEnemyCounter[enemyId] || 0;
    };

    //=============================================================================
    // Game_Action
    //  戦績を記録します。
    //=============================================================================
    var _Game_Action_executeDamage      = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        _Game_Action_executeDamage.apply(this, arguments);
        this.subject().recordAttackDamage(value);
        target.recordAcceptDamage(value);
    };

    var _Game_Action_testApply      = Game_Action.prototype.testApply;
    Game_Action.prototype.testApply = function(target) {
        var result = _Game_Action_testApply.apply(this, arguments);
        if (result && !BattleManager.isAlreadySkillCount && $gameParty.inBattle()) {
            if (this.isSkill()) {
                this.subject().recordSkillUseCounter(this.item().id);
            }
            BattleManager.isAlreadySkillCount = true;
        }
        return result;
    };

    var _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        _Game_Action_executeHpDamage.apply(this, arguments);
        if (target.hp === 0) {
            this.subject().recordKillEnemyCounter(target.getBattlerId());
            target.recordDead();
        }
    };

    //=============================================================================
    // BattleManager
    //  スキル使用回数のカウント済みフラグを定義します。
    //=============================================================================
    var _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        _BattleManager_startAction.apply(this, arguments);
        this.isAlreadySkillCount = false;
    };
})();

