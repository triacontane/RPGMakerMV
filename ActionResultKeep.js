/*=============================================================================
 ActionResultKeep.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2024/12/13 属性によるダメージ倍率を変数に自動設定できる機能を追加
 1.1.0 2024/09/29 直前で実行されたスキルの使用者と対象者のIDを変数に自動設定できる機能を追加
 1.0.0 2022/08/30 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 行動結果保持プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ActionResultKeep.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param flagResultList
 * @text フラグ結果リスト
 * @desc 行動結果のうちフラグ項目を指定したスイッチに格納します。
 * @default []
 * @type struct<FlagResult>[]
 *
 * @param variableResultList
 * @text 数値結果リスト
 * @desc 行動結果のうち数値、配列項目を指定した変数に格納します。
 * @default []
 * @type struct<VariableResult>[]
 *
 * @param lastTargetActorId
 * @text 対象アクターID変数
 * @desc 直前の行動の対象アクターIDを格納する変数番号です。
 * 対象が敵キャラだった場合は0が格納されます。
 * @default 0
 * @type variable
 *
 * @param lastTargetEnemyId
 * @text 対象エネミーID変数
 * @desc 直前の行動の対象エネミーIDを格納する変数番号です。
 * 対象がアクターだった場合は0が格納されます。
 * @default 0
 * @type variable
 *
 * @param lastSubjectActorId
 * @text 使用者アクターID変数
 * @desc 直前の行動の使用者アクターIDを格納する変数番号です。
 * 使用者が敵キャラだった場合は0が格納されます。
 * @default 0
 * @type variable
 *
 * @param lastSubjectEnemyId
 * @text 使用者エネミーID変数
 * @desc 直前の行動の使用者エネミーIDを格納する変数番号です。
 * 使用者がアクターだった場合は0が格納されます。
 * @default 0
 * @type variable
 *
 * @help ActionResultKeep.js
 *
 * 直前の行動の使用者や結果を専用の変数に保持します。
 * スキルから呼び出されたコモンイベントなどで参照できます。
 * それぞれ対応するスクリプトを実行してください。
 *
 * ・使用者
 * $gameTemp.lastSubject()
 * ・対象者
 * $gameTemp.lastTarget()
 * ・スキル
 * $gameTemp.lastSkill()
 * ・行動結果(成功判定や回避判定)
 * プラグインパラメータで設定した内容がスイッチや変数に格納されます。
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

/*~struct~FlagResult:
 *
 * @param switchId
 * @text スイッチID
 * @desc フラグ項目が格納されるスイッチ番号です。
 * @default 1
 * @type switch
 *
 * @param property
 * @text プロパティ
 * @desc 指定したプロパティの値がスイッチに格納されます。
 * @default missed
 * @type select
 * @option ミス
 * @value missed
 * @option 回避
 * @value evaded
 * @option 物理攻撃
 * @value physical
 * @option 吸収
 * @value drain
 * @option クリティカル
 * @value critical
 * @option 行動に成功
 * @value success
 * @option HP効果あり
 * @value hpAffected
 *
 */

/*~struct~VariableResult:
 *
 * @param variableId
 * @text 変数ID
 * @desc 数値項目が格納される変数番号です。
 * @default 1
 * @type variable
 *
 * @param property
 * @text プロパティ
 * @desc 指定したプロパティの値が変数に格納されます。
 * @default hpDamage
 * @type select
 * @option HP効果量
 * @value hpDamage
 * @option MP効果量
 * @value mpDamage
 * @option TP効果量
 * @value tpDamage
 * @option 付加ステート配列
 * @value addedStates
 * @option 解除ステート配列
 * @value removedStates
 * @option 付加バフ配列
 * @value addedBuffs
 * @option 付加デバフ配列
 * @value addedDebuffs
 * @option 解除バフ配列
 * @value removedBuffs
 * @option 属性による倍率
 * @value elementRate
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.flagResultList) {
        param.flagResultList = [];
    }
    if (!param.variableResultList) {
        param.variableResultList = [];
    }

    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.apply(this, arguments);
        this._lastAction = new Game_LastAction();
    };

    Game_Temp.prototype.lastAction = function() {
        return this._lastAction
    };

    Game_Temp.prototype.lastSubject = function() {
        return this._lastAction.findSubject();
    };

    Game_Temp.prototype.lastTarget = function() {
        return this._lastAction.findTarget();
    };

    Game_Temp.prototype.lastSkill = function() {
        return this._lastAction.findItem();
    };

    /**
     * Game_LastAction
     * 最後の行動結果を保持するためのクラスです。
     */
    class Game_LastAction {
        constructor() {
            this._subjectIsActor = null;
            this._targetIsActor = null;
            this._usingIsSkill = null;
        }

        updateSubject(subject) {
            this._subjectIsActor = subject.isActor();
            if (this._subjectIsActor) {
                $gameVariables.setValue(param.lastSubjectActorId, subject.actorId());
                $gameVariables.setValue(param.lastSubjectEnemyId, 0);
            } else {
                $gameVariables.setValue(param.lastSubjectEnemyId, subject.enemyId());
                $gameVariables.setValue(param.lastSubjectActorId, 0);
            }
        }

        updateTarget(target) {
            this._targetIsActor = target.isActor();
            if (this._targetIsActor) {
                $gameVariables.setValue(param.lastTargetActorId, target.actorId());
                $gameVariables.setValue(param.lastTargetEnemyId, 0);
            } else {
                $gameVariables.setValue(param.lastTargetEnemyId, target.enemyId());
                $gameVariables.setValue(param.lastTargetActorId, 0);
            }
        }

        updateUsed(item) {
            this._usingIsSkill = DataManager.isSkill(item);
        }

        updateResult(result) {
            param.flagResultList.forEach(item => {
                $gameSwitches.setValue(item.switchId, result[item.property]);
            });
            param.variableResultList.forEach(item => {
                $gameVariables.setValue(item.variableId, result[item.property]);
            });
        }

        findSubject() {
            if (this._subjectIsActor) {
                return $gameActors.actor($gameTemp.lastActionData(2));
            } else {
                return $gameTroop.members()[$gameTemp.lastActionData(3) - 1];
            }
        }

        findTarget() {
            if (this._targetIsActor) {
                return $gameActors.actor($gameTemp.lastActionData(4));
            } else {
                return $gameTroop.members()[$gameTemp.lastActionData(5) - 1];
            }
        }

        findItem() {
            if (this._usingIsSkill) {
                return $dataSkills[$gameTemp.lastActionData(0)];
            } else {
                return $dataItems[$gameTemp.lastActionData(1)];
            }
        }
    }

    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.apply(this, arguments);
        $gameTemp.lastAction().updateResult(target.result());
    };

    const _Game_Action_updateLastSubject = Game_Action.prototype.updateLastSubject;
    Game_Action.prototype.updateLastSubject = function() {
        _Game_Action_updateLastSubject.apply(this, arguments);
        $gameTemp.lastAction().updateSubject(this.subject());
    };

    const _Game_Action_updateLastUsed = Game_Action.prototype.updateLastUsed;
    Game_Action.prototype.updateLastUsed = function() {
        _Game_Action_updateLastUsed.apply(this, arguments);
        $gameTemp.lastAction().updateUsed(this.item());
    };

    const _Game_Action_updateLastTarget = Game_Action.prototype.updateLastTarget;
    Game_Action.prototype.updateLastTarget = function(target) {
        _Game_Action_updateLastTarget.apply(this, arguments);
        $gameTemp.lastAction().updateTarget(target);
    };

    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.apply(this, arguments);
        this.elementRate = 1;
    };

    const _Game_Action_calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        const rate =_Game_Action_calcElementRate.apply(this, arguments);
        if (target.result()) {
            target.result().elementRate = Math.floor(rate * 100);
        }
        return rate;
    };
})();
