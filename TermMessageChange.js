/*=============================================================================
 TermMessageChange.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/06/25 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 用語メッセージ変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TermMessageChange.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param messageList
 * @text 用語メッセージリスト
 * @desc 用語メッセージのリストです。
 * @default []
 * @type struct<MESSAGE>[]
 *
 * @help TermMessageChange.js
 *
 * データベースの用語メッセージを、別のメッセージに動的に置き換えられます。
 * スイッチや対象者、行動者を条件に指定できます。
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

/*~struct~MESSAGE:
 * @param type
 * @desc メッセージ種別です。
 * @default alwaysDash
 * @type select
 * @option 常時ダッシュ
 * @value alwaysDash
 * @option コマンド記憶
 * @value commandRemember
 * @option BGM音量
 * @value bgmVolume
 * @option BGS音量
 * @value bgsVolume
 * @option ME音量
 * @value meVolume
 * @option SE音量
 * @value seVolume
 * @option 持っている数
 * @value possession
 * @option 現在の経験値
 * @value expTotal
 * @option 次のレベルまで
 * @value expNext
 * @option セーブメッセージ
 * @value saveMessage
 * @option ロードメッセージ
 * @value loadMessage
 * @option ファイル
 * @value file
 * @option オートセーブ
 * @value autosave
 * @option パーティ名
 * @value partyName
 * @option 出現
 * @value emerge
 * @option 先制攻撃
 * @value preemptive
 * @option 不意打ち
 * @value surprise
 * @option 逃走開始
 * @value escapeStart
 * @option 逃走失敗
 * @value escapeFailure
 * @option 勝利
 * @value victory
 * @option 敗北
 * @value defeat
 * @option 経験値獲得
 * @value obtainExp
 * @option お金獲得
 * @value obtainGold
 * @option アイテム獲得
 * @value obtainItem
 * @option レベルアップ
 * @value levelUp
 * @option スキル習得
 * @value obtainSkill
 * @option アイテム使用
 * @value useItem
 * @option 敵に会心
 * @value criticalToEnemy
 * @option 味方に会心
 * @value criticalToActor
 * @option 味方ダメージ
 * @value actorDamage
 * @option 味方回復
 * @value actorRecovery
 * @option 味方ポイント増加
 * @value actorGain
 * @option 味方ポイント減少
 * @value actorLoss
 * @option 味方ポイント吸収
 * @value actorDrain
 * @option 味方ノーダメージ
 * @value actorNoDamage
 * @option 味方に命中せず
 * @value actorNoHit
 * @option 敵ダメージ
 * @value enemyDamage
 * @option 敵回復
 * @value enemyRecovery
 * @option 敵ポイント増加
 * @value enemyGain
 * @option 敵ポイント減少
 * @value enemyLoss
 * @option 敵ポイント吸収
 * @value enemyDrain
 * @option 敵ノーダメージ
 * @value enemyNoDamage
 * @option 敵に命中せず
 * @value enemyNoHit
 * @option 回避
 * @value evasion
 * @option 魔法回避
 * @value magicEvasion
 * @option 魔法反射
 * @value magicReflection
 * @option 反撃
 * @value counterAttack
 * @option 身代わり
 * @value substitute
 * @option 強化
 * @value buffAdd
 * @option 弱体
 * @value debuffAdd
 * @option 強化解除
 * @value buffRemove
 * @option 行動失敗
 * @value actionFailure
 *
 * @param message
 * @text メッセージ
 * @desc 条件を満たしたときにデフォルトから置き換わるメッセージです。メッセージによっては%1などの特殊文字が使えます。
 * @default
 * @type multiline_string
 *
 * @param switchId
 * @text 条件スイッチ
 * @desc 指定したスイッチがONのときにメッセージが切り替わります。
 * @default 0
 * @type switch
 *
 * @param targetActorId
 * @text 対象者アクター条件
 * @desc 対象者が指定したアクターのときメッセージが切り替わります。
 * @default 0
 * @type actor
 *
 * @param targetEnemyId
 * @text 対象者敵キャラ条件
 * @desc 対象者が指定した敵キャラのときメッセージが切り替わります。
 * @default 0
 * @type enemy
 *
 * @param subjectActorId
 * @text 行動者アクター条件
 * @desc 行動者が指定したアクターのときメッセージが切り替わります。
 * @default 0
 * @type actor
 *
 * @param subjectEnemyId
 * @text 行動者敵キャラ条件
 * @desc 行動者が指定した敵キャラのときメッセージが切り替わります。
 * @default 0
 * @type enemy
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.messageList) {
        param.messageList = [];
    }

    const _TextManager_message = TextManager.message
    TextManager.message = function(messageId) {
        const customData = this.findCustomMessage(messageId);
        if (customData) {
            return customData.message;
        } else {
            return _TextManager_message.apply(this, arguments);
        }
    };

    TextManager._targetActorId = 0;
    TextManager._subjectActorId = 0;
    TextManager._targetEnemyId = 0;
    TextManager._subjectEnemyId = 0;

    TextManager.findCustomMessage = function(messageId) {
        return param.messageList.find(message => messageId === message.type && this.isValidMessage(message));
    };

    TextManager.setMessageSubject = function (battler) {
        if (battler.isActor()) {
            this._subjectActorId = battler.actorId();
            this._subjectEnemyId = 0;
        } else if (battler.isEnemy()) {
            this._subjectActorId = 0;
            this._subjectEnemyId = battler.enemyId();
        } else {
            this._subjectActorId = 0;
            this._subjectEnemyId = 0;
        }
    }

    TextManager.setMessageTarget = function (battler) {
        if (battler.isActor()) {
            this._targetActorId = battler.actorId();
            this._targetEnemyId = 0;
        } else if (battler.isEnemy()) {
            this._targetActorId = 0;
            this._targetEnemyId = battler.enemyId();
        } else {
            this._targetActorId = 0;
            this._targetEnemyId = 0;
        }
    }

    TextManager.clearMessageBattler = function () {
        this._subjectActorId = 0;
        this._subjectEnemyId = 0;
        this._targetActorId = 0;
        this._targetEnemyId = 0;
    }

    TextManager.isValidMessage = function(message) {
        const conditions = [];
        conditions.push(() => !message.switchId || $gameSwitches.value(message.switchId));
        conditions.push(() => !message.targetActorId || this._targetActorId === message.targetActorId);
        conditions.push(() => !message.targetEnemyId || this._targetEnemyId === message.targetEnemyId);
        conditions.push(() => !message.subjectActorId || this._subjectActorId === message.subjectActorId);
        conditions.push(() => !message.subjectEnemyId || this._subjectEnemyId === message.subjectEnemyId);
        return conditions.every(condition => condition());
    };

    const _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        TextManager.setMessageSubject(this._subject);
        _BattleManager_startAction.apply(this, arguments);
    };

    const _BattleManager_invokeAction = BattleManager.invokeAction;
    BattleManager.invokeAction = function(subject, target) {
        TextManager.setMessageTarget(target);
        _BattleManager_invokeAction.apply(this, arguments);
    };

    const _BattleManager_endAction = BattleManager.endAction;
    BattleManager.endAction = function() {
        TextManager.clearMessageBattler();
        _BattleManager_endAction.apply(this, arguments);
    }

})();
