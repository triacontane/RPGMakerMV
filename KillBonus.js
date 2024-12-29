//=============================================================================
// KillBonus.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.2.0 2024/12/30 スキルのメモ欄からも撃破ボーナスのタグを取得できるよう修正
// 2.1.1 2023/07/07 経験値とゴールドのレートを変更したとき、小数値になってしまう場合がある問題を修正
// 2.1.0 2023/01/09 撃破ボーナスの適用条件に「特定のスキルを使った場合」を追加
// 2.0.1 2022/09/04 ドロップ率に関する仕様をヘルプに記載
// 2.0.0 2022/09/04 MZ向けに再設計
// 1.4.0 2020/03/10 撃破ボーナス発生時にボーナス対象にアニメーションを再生できる機能を追加
// 1.3.0 2019/11/09 条件に指定ターン以内撃破、クリティカル撃破を追加。ボーナスに最初のドロップアイテムの確率変更追加
// 1.2.0 2019/06/11 撃破ボーナスとして任意の変数を増減させる機能を追加
// 1.1.0 2017/06/08 ボーナス取得条件としてノーダメージ、ノーデス、ノースキルおよびスイッチを追加
// 1.0.0 2016/08/07 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 撃破ボーナスプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/KillBonus.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param bonusList
 * @text ボーナス設定リスト
 * @desc 撃破ボーナスの設定リストです。
 * @default []
 * @type struct<Setting>[]
 *
 * @help KillBonus.js
 *
 * 敵を撃破した際に何らかの報酬を得ることができます。
 * 報酬は主に以下の通りです。
 * ・パラメータ回復
 * ・報酬レート、獲得率変動
 * ・変数加算、スクリプト実行
 * ・ステート付与
 * ・アニメーション表示
 *
 * 撃破するとHPやMPを回復するステートや装備品などが作成できます。
 * 具体的な報酬の内容はプラグインパラメータで指定してください。
 *
 * アクター、職業、武具、ステート、敵キャラ、スキルのメモ欄に
 * 以下の通り記述してください。
 * bonus01 : プラグインパラメータで指定した識別子
 * <撃破ボーナス:bonus01>
 * <KillBonus:bonus01>
 *
 * "撃破した側"がボーナスの特徴を持っていると撃破ボーナスを獲得できます。
 *
 * ※1 複数の撃破ボーナスが有効な場合、経験値やお金のレートやドロップ率は
 * 最も高い値が採用されます。
 *
 * ※2 ドロップ率に0を指定すると、DBで指定したデフォルトの
 * ドロップ率になります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~Setting:
 *
 * @param id
 * @text 識別子
 * @desc 識別子です。一意の値を指定してください。この値をメモ欄に指定します。
 * @default bonus01
 *
 * @param hp
 * @text HP回復
 * @desc HPが指定したぶんだけ回復します。
 * @default 0
 * @type number
 * @min -99999
 * @max 99999
 *
 * @param hpRate
 * @text HP回復レート
 * @desc HPが指定した割合(0-100)だけ回復します。
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @param mp
 * @text MP回復
 * @desc MPが指定したぶんだけ回復します。
 * @default 0
 * @type number
 * @min -99999
 * @max 99999
 *
 * @param mpRate
 * @text MP回復レート
 * @desc MPが指定した割合(0-100)だけ回復します。
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @param tp
 * @text TP回復
 * @desc TPが指定したぶんだけ回復します。
 * @default 0
 * @type number
 * @min -99999
 * @max 99999
 *
 * @param tpRate
 * @text TP回復レート
 * @desc TPが指定した割合(0-100)だけ回復します。
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @param gold
 * @text お金
 * @desc 指定した額のお金を直接獲得します。
 * @default 0
 * @type number
 *
 * @param goldRate
 * @text お金レート
 * @desc 指定した倍率で対象の獲得金額が変動します。
 * @default 100
 * @type number
 *
 * @param expRate
 * @text 経験値レート
 * @desc 指定した倍率で対象の獲得経験値が変動します。
 * @default 100
 * @type number
 *
 * @param drop1Rate
 * @text ドロップ1レート
 * @desc ドロップアイテム1の取得率を指定値に変更します。データベースで指定した値は無視されます。
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @param drop2Rate
 * @text ドロップ2レート
 * @desc ドロップアイテム2の取得率を指定値に変更します。データベースで指定した値は無視されます。
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @param drop3Rate
 * @text ドロップ3レート
 * @desc ドロップアイテム3の取得率を指定値に変更します。データベースで指定した値は無視されます。
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @param state
 * @text ステート
 * @desc 自身に指定したステートを付与します。
 * @default 0
 * @type state
 *
 * @param stateParty
 * @text パーティステート
 * @desc パーティ全員にステートを付与します。
 * @default 0
 * @type state
 *
 * @param stateTroop
 * @text 敵グループステート
 * @desc 敵グループ全員にステートを付与します。
 * @default 0
 * @type state
 *
 * @param variableId
 * @text 変数番号
 * @desc 変数を加算させたい対象の変数IDです。
 * @default 0
 * @type variable
 *
 * @param variableValue
 * @text 変数の設定値
 * @desc 変数の加算値です。
 * @default 0
 * @type number
 * @min -999999
 * @parent variableId
 *
 * @param script
 * @text スクリプト
 * @desc 指定したスクリプトを実行します。
 * @default
 * @type multiline_string
 *
 * @param animationId
 * @text アニメーション
 * @desc 撃破ボーナスの発動時にアニメーションを再生できます。
 * @default 0
 * @type animation
 *
 * @param condition
 * @text 適用条件
 * @desc 撃破ボーナスが適用される条件です。指定が無い場合は常に適用されます。
 * @type struct<Condition>
 * @default
 *
 */

/*~struct~Condition:
 *
 * @param noDamage
 * @text ノーダメージ
 * @desc ダメージを受けずに撃破したとき、条件を満たします。
 * @default false
 * @type boolean
 *
 * @param noSkill
 * @text スキル不使用
 * @desc スキルを使わずに撃破したとき、条件を満たします。
 * @default false
 * @type boolean
 *
 * @param noDeath
 * @text ノーデス
 * @desc 戦闘不能者を出さずに撃破したとき、条件を満たします。
 * @default false
 * @type boolean
 * 
 * @param critical
 * @text クリティカル
 * @desc クリティカルで撃破したとき、条件を満たします。
 * @default false
 * @type boolean
 * 
 * @param switchId
 * @text スイッチ
 * @desc 指定したスイッチがONのとき条件を満たします。
 * @default 0
 * @type switch
 *
 * @param skillId
 * @text スキルID
 * @desc 特定のスキルで撃破したとき条件を満たします。
 * @default 0
 * @type skill
 * 
 * @param turnCount
 * @text ターン数
 * @desc 指定したターン数以内に撃破したとき、条件を満たします。
 * @default 0
 * @type number
 * 
 * @param script
 * @text スクリプト
 * @desc 指定したスクリプトがtrueを返したとき条件を満たします。
 * @default 
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.bonusList) {
        param.bonusList = [];
    }

    //=============================================================================
    // BattleManager
    //  スキルやダメージの状況を保持します。
    //=============================================================================
    const _BattleManager_setup = BattleManager.setup;
    BattleManager.setup = function(troopId, canEscape, canLose) {
        _BattleManager_setup.apply(this, arguments);
        $gameParty.members().forEach(member => member.initKillBonusCondition());
    };

    //=============================================================================
    // Game_BattlerBase
    //  スキルやダメージの状況を保持します。
    //=============================================================================
    Game_BattlerBase.prototype.initKillBonusCondition = function() {
        this._noSkill  = true;
        this._noDamage = true;
        this._noDeath  = true;
        this._usedSkillId = 0;
    };

    Game_BattlerBase.prototype.breakNoSkill = function() {
        this._noSkill  = false;
    };

    Game_BattlerBase.prototype.breakNoDamage = function() {
        this._noDamage  = false;
    };

    Game_BattlerBase.prototype.breakNoDeath = function() {
        this._noDeath  = false;
    };

    Game_BattlerBase.prototype.setUsedSkillId = function(skillId) {
        this._usedSkillId = skillId
    };

    Game_BattlerBase.prototype.findKillBonusParamList = function(critical) {
        return this.traitObjects().concat(this.actorSkills())
            .map(obj => this.findKillBonusParam(obj))
            .filter(data => !!data && this.checkDataForKillBonus(data, critical));
    };

    Game_BattlerBase.prototype.actorSkills = function() {
        return [];
    };

    Game_Actor.prototype.actorSkills = function() {
        return this.skills();
    };

    Game_BattlerBase.prototype.findKillBonusParam = function(traitObj) {
        const id = PluginManagerEx.findMetaValue(traitObj, ['KillBonus', '撃破ボーナス']);
        return param.bonusList.filter(item => item.id === id)[0] || null;
    };

    Game_BattlerBase.prototype.checkDataForKillBonus = function(data, critical) {
        const condition = data.condition;
        if (!condition) {
            return true;
        }
        const conditions = [];
        conditions.push(() => condition.noDamage && !this._noDamage);
        conditions.push(() => condition.noSkill && !this._noSkill);
        conditions.push(() => condition.noDeath && !this._noDeath);
        conditions.push(() => condition.skillId && this._usedSkillId !== condition.skillId);
        conditions.push(() => condition.critical && !critical);
        conditions.push(() => condition.turnCount > 0 && condition.turnCount < $gameTroop.turnCount());
        conditions.push(() => condition.switchId > 0 && !$gameSwitches.value(condition.switchId));
        conditions.push(() => condition.script && !eval(condition.script));
        return !conditions.some(cond => cond.call(this));
    };

    const _Game_BattlerBase_die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        _Game_BattlerBase_die.apply(this, arguments);
        this.breakNoDeath();
    };

    //=============================================================================
    // Game_Battler
    //  ダメージ時にノーダメージフラグを解除します。
    //=============================================================================
    const _Game_Battler_performDamage = Game_Battler.prototype.performDamage;
    Game_Battler.prototype.performDamage = function() {
        _Game_Battler_performDamage.apply(this, arguments);
        this.breakNoDamage();
    };

    //=============================================================================
    // Game_Action
    //  撃破ボーナスを適用します。
    //=============================================================================
    const _Game_Action_testApply = Game_Action.prototype.testApply;
    Game_Action.prototype.testApply = function(target) {
        this._criticalForKillBonus = false;
        const result = _Game_Action_testApply.apply(this, arguments);
        if (result) {
            if (!this.isAttack() && !this.isGuard()) {
                this.subject().breakNoSkill();
            }
            if (DataManager.isSkill(this.item())) {
                this.subject().setUsedSkillId(this.item().id);
            }
        }
        return result;
    };

    const _Game_Action_applyCritical = Game_Action.prototype.applyCritical;
    Game_Action.prototype.applyCritical = function(damage) {
        this._criticalForKillBonus = true;
        return _Game_Action_applyCritical.apply(this, arguments);
    };

    const _Game_Action_executeHpDamage      = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        _Game_Action_executeHpDamage.apply(this, arguments);
        if (target.hp === 0) {
            this.executeKillBonus(target);
        }
    };

    Game_Action.prototype.executeKillBonus = function(target) {
        const subject = this.subject();
        if (!subject) {
            return;
        }
        this._gainHp = 0;
        this._gainMp = 0;
        this._gainTp = 0;
        target.clearRewardRate();
        subject.findKillBonusParamList(this._criticalForKillBonus).forEach(data => {
            this.executeKillBonusRecover(data, subject);
            this.executeKillBonusState(data, subject);
            this.executeKillBonusVariable(data);
            this.executeKillBonusScript(data, subject, target);
            this.executeKillBonusReward(data, target);
            this.executeKillBonusAnimation(data, subject);
        });
        if (this._gainHp !== 0) subject.gainHp(this._gainHp);
        if (this._gainMp !== 0) subject.gainMp(this._gainMp);
        if (this._gainTp !== 0) subject.gainTp(this._gainTp);
    };

    Game_Action.prototype.executeKillBonusAnimation = function(data, subject) {
        const id = data.animationId
        if (id > 0) {
            $gameTemp.requestAnimation([subject], id, false);
        }
    };

    Game_Action.prototype.executeKillBonusRecover = function(data, subject) {
        if (data.hp) {
            this._gainHp += data.hp;
        }
        if (data.hpRate) {
            this._gainHp += Math.floor(subject.mhp * data.hpRate / 100);
        }
        if (data.mp) {
            this._gainMp += data.mp;
        }
        if (data.mpRate) {
            this._gainMp += Math.floor(subject.mhp * data.mpRate / 100);
        }
        if (data.tp) {
            this._gainTp += data.tp;
        }
        if (data.tpRate) {
            this._gainTp += Math.floor(subject.maxTp() * data.tpRate / 100);
        }
    };

    Game_Action.prototype.executeKillBonusVariable = function(data) {
        const id = data.variableId;
        if (id) {
            $gameVariables.setValue(id, $gameVariables.value(id) + data.variableValue);
        }
    };

    Game_Action.prototype.executeKillBonusState = function(data, subject) {
        if (data.state) {
            subject.addState(data.state);
        }
        if (data.stateParty) {
            subject.friendsUnit().members().forEach(member => member.addState(data.stateParty));
        }
        if (data.stateTroop) {
            subject.opponentsUnit().members().forEach(member => member.addState(data.stateTroop));
        }
    };

    Game_Action.prototype.executeKillBonusScript = function(data, subject, target) {
        if (data.script) {
            try {
                eval(data.script);
            } catch (e) {
                console.error(e.stack);
            }
        }
    };

    Game_Action.prototype.executeKillBonusReward = function(data, target) {
        if (data.gold) {
            $gameParty.gainGold(data.gold);
        }
        target.setRewardRate(data.drop1Rate, data.drop2Rate, data.drop3Rate, data.goldRate, data.expRate);
    };

    /**
     * Game_Enemy
     * ドロップ率変更を実装します。
     */
    Game_Battler.prototype.setRewardRate = function(drop1Rate, drop2Rate, drop3Rate, goldRate, expRate) {
        const rate = this._customRewardRate;
        if (this._customRewardRate) {
            rate.dropRate[0] = Math.max(rate.dropRate[0], drop1Rate);
            rate.dropRate[1] = Math.max(rate.dropRate[1], drop2Rate);
            rate.dropRate[2] = Math.max(rate.dropRate[2], drop3Rate);
            rate.goldRate = Math.max(rate.goldRate, goldRate);
            rate.expRate = Math.max(rate.expRate, expRate);
        } else {
            this._customRewardRate = {
                dropRate: [drop1Rate, drop2Rate, drop3Rate],
                goldRate: goldRate,
                expRate: expRate
            };
        }
    };

    Game_Battler.prototype.clearRewardRate = function () {
        this._customRewardRate = null;
    }

    const _Game_Enemy_exp = Game_Enemy.prototype.exp;
    Game_Enemy.prototype.exp = function() {
        const exp = _Game_Enemy_exp.apply(this, arguments);
        if (this._customRewardRate?.expRate) {
            return Math.floor(exp * this._customRewardRate.expRate / 100);
        } else {
            return exp;
        }
    };

    const _Game_Enemy_gold = Game_Enemy.prototype.gold;
    Game_Enemy.prototype.gold = function() {
        const gold = _Game_Enemy_gold.apply(this, arguments);
        if (this._customRewardRate?.goldRate) {
            return Math.floor(gold * this._customRewardRate.goldRate / 100);
        } else {
            return gold;
        }
    };

    const _Game_Enemy_makeDropItems = Game_Enemy.prototype.makeDropItems;
    Game_Enemy.prototype.makeDropItems = function() {
        const prevItems = _Game_Enemy_makeDropItems.apply(this, arguments);
        const newRate = this._customRewardRate?.dropRate || [];
        if (newRate[0] || newRate[1] || newRate[2]) {
            const rate = this.dropItemRate();
            return this.enemy().dropItems.reduce((r, dropItem, index) => {
                const customResult = newRate[index] ? Math.random() < newRate[index] / 100 : Math.random() * dropItem.denominator < rate;
                if (dropItem.kind > 0 && customResult) {
                    return r.concat(this.itemObject(dropItem.kind, dropItem.dataId));
                } else {
                    return r;
                }
            }, []);
        } else {
            return prevItems;
        }
    };
})();

