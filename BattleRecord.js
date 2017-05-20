//=============================================================================
// BattleRecord.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.1 2017/05/20 プラグイン未適用のデータをロードしたときに一部のスクリプトが実行エラーになる問題を修正
// 1.2.0 2016/12/25 アイテムの売買履歴を保持して取得できる機能を追加
// 1.1.3 2016/12/05 装備変更時に装備品の入手数がカウントアップされていた不具合を修正
// 1.1.2 2016/09/04 1.1.1の修正に一部不足があったものを追加修正
// 1.1.1 2016/09/02 プラグイン未適用のデータをロード後に攻撃かアイテム入手すると強制終了する問題を修正
// 1.1.0 2016/08/27 取得可能な項目を大幅に増やしました。
//                  アクター全員の合計値を容易に取得できるようにしました。
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
 * @help Recording resource in battle.
 *
 * アクターごとに以下の要素を記録できます。
 *
 * ・スキルごとの使用回数(戦闘中のみカウント。他項目も同様)
 * ・全スキルの使用回数合計
 * ・アイテムごとの使用回数
 * ・全アイテムの使用回数合計
 * ・敵キャラごとの撃破回数
 * ・全敵キャラの撃破回数合計
 * ・与えたダメージの合計
 * ・与えたダメージの最大
 * ・受けたダメージの合計
 * ・受けたダメージの最大
 * ・回復したダメージの合計
 * ・消費したMP合計
 * ・消費したTP合計
 * ・戦闘不能回数
 *
 * 値はイベントコマンド「変数の操作」から「スクリプト」で
 * 対応するスクリプトを呼び出して取得してください。
 *
 * ・データベースのアクターIDから取得する場合
 * $gameActors.actor(1).getSkillUseCounter(2);   # アクター[1]のスキル[2]使用回数
 * $gameActors.actor(1).getAllSkillUseCounter(); # アクター[1]の全スキル使用回数
 * $gameActors.actor(1).getItemUseCounter(3);    # アクター[1]のアイテム[3]使用回数
 * $gameActors.actor(1).getAllItemUseCounter();  # アクター[1]の全アイテム使用回数
 * $gameActors.actor(1).getKillEnemyCounter(4);  # アクター[1]の敵キャラ[4]撃破数
 * $gameActors.actor(1).getAllKillEnemyCounter();# アクター[1]の全敵キャラ撃破数
 * $gameActors.actor(1).attackDamageMax;         # アクター[1]の最大与ダメージ
 * $gameActors.actor(1).attackDamageSum;         # アクター[1]の合計与ダメージ
 * $gameActors.actor(1).acceptDamageMax;         # アクター[1]の最大被ダメージ
 * $gameActors.actor(1).acceptDamageSum;         # アクター[1]の合計被ダメージ
 * $gameActors.actor(1).recoverDamageSum;        # アクター[1]の合計回復ダメージ
 * $gameActors.actor(1).payCostMpSum;            # アクター[1]の消費MP合計
 * $gameActors.actor(1).payCostTpSum;            # アクター[1]の消費TP合計
 * $gameActors.actor(1).deadCounter;             # アクター[1]の戦闘不能回数
 *
 * ・パーティの並び順(先頭は0)から取得する場合
 * $gameActors.actor(n)を$gameParty.members()[n]に置き換えて実行する。
 * (例)
 * $gameParty.members()[0].attackDamageMax;      # 先頭メンバーの最大与ダメージ
 *
 * ・スキルのダメージ計算式で使用する場合
 * $gameActors.actor(n)をa(実行者)もしくはb(対象者)に置き換えて実行する。
 * (例)
 * a.getSkillUseCounter(5);  # 実行者のスキル[5]使用回数
 * b.getKillEnemyCounter(6); # 対象者の敵キャラ[6]撃破数
 *
 * ・すべてのアクターの合計値を取得する場合
 * $gameActors.actor(n)を$gameActorsに置き換えて実行する。
 * (例)
 * $gameActors.getKillEnemyCounter(4); # 全アクターの敵キャラ[4]撃破数合計
 * $gameActors.getAllItemUseCounter(); # 全アクターの全アイテム使用回数
 *
 * ・パーティごとに管理される戦績を取得する場合
 * $gameParty.gainGoldSum;         # 入手ゴールド合計
 * $gameParty.loseGoldSum;         # 消費ゴールド合計
 * $gameParty.getGainItemSum(1);   # アイテム[1]の入手合計
 * $gameParty.getGainWeaponSum(1); # 武器[1]の入手合計(初期装備以外)
 * $gameParty.getGainArmorSum(1);  # 防具[1]の入手合計(初期装備以外)
 *
 * ・売買履歴情報を取得する場合
 * アイテムごとの売買履歴を取得できます。
 * 開始IDと終了IDを指定することで、その範囲内の売買履歴を取得可能です。
 * 開始IDと終了IDを指定しなかった場合、全ての売買履歴の合計を取得します。
 *
 * 1.購入
 * # ID[1]からID[3]までのアイテムの累計購入金額の合計
 * $gameParty.getItemBuyingRecord().getUseGoldSum(1, 3);
 *
 * # ID[2]からID[4]のアイテムの累計購入個数の合計
 * $gameParty.getItemBuyingRecord().getAmountSum(2, 4);
 *
 * # アイテムの累計購入回数(まとめ買いは1回でカウント)
 * $gameParty.getItemBuyingRecord().getTradeCount();
 *
 * # ID[1]のアイテムの累計購入金額
 * $gameParty.getWeaponBuyingRecord().getUseGoldSum(1);
 *
 * # ID[2]のアイテムの累計購入個数
 * $gameParty.getWeaponBuyingRecord().getAmountSum(2);
 *
 * # 武器の累計購入回数(まとめ買いは1回でカウント)
 * $gameParty.getWeaponBuyingRecord().getTradeCount();
 *
 * # 全防具の累計購入金額の合計
 * $gameParty.getArmorBuyingRecord().getUseGoldSum();
 *
 * # 全防具の累計購入個数
 * $gameParty.getArmorBuyingRecord().getAmountSum();
 *
 * # 防具の累計購入回数(まとめ買いは1回でカウント)
 * $gameParty.getArmorBuyingRecord().getTradeCount();
 *
 * 2.売却
 * # ID[1]からID[3]までのアイテムの累計売却金額の合計
 * $gameParty.getItemSellingRecord().getUseGoldSum(1, 3);
 *
 * # ID[2]からID[4]のアイテムの累計売却個数の合計
 * $gameParty.getItemSellingRecord().getAmountSum(2, 4);
 *
 * # アイテムの累計売却回数(まとめ買いは1回でカウント)
 * $gameParty.getItemSellingRecord().getTradeCount();
 *
 * # ID[1]のアイテムの累計売却金額
 * $gameParty.getWeaponSellingRecord().getUseGoldSum(1);
 *
 * # ID[2]のアイテムの累計売却個数
 * $gameParty.getWeaponSellingRecord().getAmountSum(2);
 *
 * # 武器の累計売却回数(まとめ買いは1回でカウント)
 * $gameParty.getWeaponSellingRecord().getTradeCount();
 *
 * # 全防具の累計売却金額の合計
 * $gameParty.getArmorSellingRecord().getUseGoldSum();
 *
 * # 全防具の累計売却個数
 * $gameParty.getArmorSellingRecord().getAmountSum();
 *
 * # 防具の累計売却回数(まとめ買いは1回でカウント)
 * $gameParty.getArmorSellingRecord().getTradeCount();
 *
 * 応用的な使い方として「動的データベース構築プラグイン」と組み合わせれば
 * 戦績をデータベースの値に組み込んでより多彩な装備品やスキルを
 * 作成することができます。
 * 「動的データベース構築プラグイン」は、本プラグインと同一の配布元で
 * 配布しています。
 *
 * No plugin command.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 戦績プラグイン
 * @author トリアコンタン
 *
 * @help 戦闘中の様々な情報を記録していつでも取得可能にします。
 * 戦績として記録に残せるほか、特殊なスキルのダメージ計算式に
 * 組み込んだりすることもできます。
 *
 * アクターごとに以下の要素を記録できます。
 *
 * ・スキルごとの使用回数(戦闘中のみカウント。他項目も同様)
 * ・全スキルの使用回数合計
 * ・アイテムごとの使用回数
 * ・全アイテムの使用回数合計
 * ・敵キャラごとの撃破回数
 * ・全敵キャラの撃破回数合計
 * ・与えたダメージの合計
 * ・与えたダメージの最大
 * ・受けたダメージの合計
 * ・受けたダメージの最大
 * ・回復したダメージの合計
 * ・消費したMP合計
 * ・消費したTP合計
 * ・戦闘不能回数
 *
 * 値はイベントコマンド「変数の操作」から「スクリプト」で
 * 対応するスクリプトを呼び出して取得してください。
 *
 * ・データベースのアクターIDから取得する場合
 * $gameActors.actor(1).getSkillUseCounter(2);   # アクター[1]のスキル[2]使用回数
 * $gameActors.actor(1).getAllSkillUseCounter(); # アクター[1]の全スキル使用回数
 * $gameActors.actor(1).getItemUseCounter(3);    # アクター[1]のアイテム[3]使用回数
 * $gameActors.actor(1).getAllItemUseCounter();  # アクター[1]の全アイテム使用回数
 * $gameActors.actor(1).getKillEnemyCounter(4);  # アクター[1]の敵キャラ[4]撃破数
 * $gameActors.actor(1).getAllKillEnemyCounter();# アクター[1]の全敵キャラ撃破数
 * $gameActors.actor(1).attackDamageMax;         # アクター[1]の最大与ダメージ
 * $gameActors.actor(1).attackDamageSum;         # アクター[1]の合計与ダメージ
 * $gameActors.actor(1).acceptDamageMax;         # アクター[1]の最大被ダメージ
 * $gameActors.actor(1).acceptDamageSum;         # アクター[1]の合計被ダメージ
 * $gameActors.actor(1).recoverDamageSum;        # アクター[1]の合計回復ダメージ
 * $gameActors.actor(1).payCostMpSum;            # アクター[1]の消費MP合計
 * $gameActors.actor(1).payCostTpSum;            # アクター[1]の消費TP合計
 * $gameActors.actor(1).deadCounter;             # アクター[1]の戦闘不能回数
 *
 * ・パーティの並び順(先頭は0)から取得する場合
 * $gameActors.actor(n)を$gameParty.members()[n]に置き換えて実行する。
 * (例)
 * $gameParty.members()[0].attackDamageMax # 先頭メンバーの最大与ダメージ
 *
 * ・スキルのダメージ計算式で使用する場合
 * $gameActors.actor(n)をa(実行者)もしくはb(対象者)に置き換えて実行する。
 * (例)
 * a.getSkillUseCounter(5)  # 実行者のスキル[5]使用回数
 * b.getKillEnemyCounter(6) # 対象者の敵キャラ[6]撃破数
 *
 * ・すべてのアクターの合計値を取得する場合
 * $gameActors.actor(n)を$gameActorsに置き換えて実行する。
 * (例)
 * $gameActors.getKillEnemyCounter(4); # 全アクターの敵キャラ[4]撃破数合計
 *
 * ・パーティごとに管理される戦績を取得する場合
 * $gameParty.gainGoldSum;         # 入手ゴールド合計
 * $gameParty.loseGoldSum;         # 消費ゴールド合計
 * $gameParty.getGainItemSum(1);   # アイテム[1]の入手合計
 * $gameParty.getGainWeaponSum(1); # 武器[1]の入手合計(初期装備以外)
 * $gameParty.getGainArmorSum(1);  # 防具[1]の入手合計(初期装備以外)
 *
 * ・売買履歴情報を取得する場合
 * アイテムごとの売買履歴を取得できます。
 * 開始IDと終了IDを指定することで、その範囲内の売買履歴を取得可能です。
 * 開始IDと終了IDを指定しなかった場合、全ての売買履歴の合計を取得します。
 *
 * 1.購入
 * # ID[1]からID[3]までのアイテムの累計購入金額の合計
 * $gameParty.getItemBuyingRecord().getUseGoldSum(1, 3);
 *
 * # ID[2]からID[4]のアイテムの累計購入個数の合計
 * $gameParty.getItemBuyingRecord().getAmountSum(2, 4);
 *
 * # アイテムの累計購入回数(まとめ買いは1回でカウント)
 * $gameParty.getItemBuyingRecord().getTradeCount();
 *
 * # ID[1]のアイテムの累計購入金額
 * $gameParty.getWeaponBuyingRecord().getUseGoldSum(1);
 *
 * # ID[2]のアイテムの累計購入個数
 * $gameParty.getWeaponBuyingRecord().getAmountSum(2);
 *
 * # 武器の累計購入回数(まとめ買いは1回でカウント)
 * $gameParty.getWeaponBuyingRecord().getTradeCount();
 *
 * # 全防具の累計購入金額の合計
 * $gameParty.getArmorBuyingRecord().getUseGoldSum();
 *
 * # 全防具の累計購入個数
 * $gameParty.getArmorBuyingRecord().getAmountSum();
 *
 * # 防具の累計購入回数(まとめ買いは1回でカウント)
 * $gameParty.getArmorBuyingRecord().getTradeCount();
 *
 * 2.売却
 * # ID[1]からID[3]までのアイテムの累計売却金額の合計
 * $gameParty.getItemSellingRecord().getUseGoldSum(1, 3);
 *
 * # ID[2]からID[4]のアイテムの累計売却個数の合計
 * $gameParty.getItemSellingRecord().getAmountSum(2, 4);
 *
 * # アイテムの累計売却回数(まとめ買いは1回でカウント)
 * $gameParty.getItemSellingRecord().getTradeCount();
 *
 * # ID[1]のアイテムの累計売却金額
 * $gameParty.getWeaponSellingRecord().getUseGoldSum(1);
 *
 * # ID[2]のアイテムの累計売却個数
 * $gameParty.getWeaponSellingRecord().getAmountSum(2);
 *
 * # 武器の累計売却回数(まとめ買いは1回でカウント)
 * $gameParty.getWeaponSellingRecord().getTradeCount();
 *
 * # 全防具の累計売却金額の合計
 * $gameParty.getArmorSellingRecord().getUseGoldSum();
 *
 * # 全防具の累計売却個数
 * $gameParty.getArmorSellingRecord().getAmountSum();
 *
 * # 防具の累計売却回数(まとめ買いは1回でカウント)
 * $gameParty.getArmorSellingRecord().getTradeCount();
 *
 * 応用的な使い方として「動的データベース構築プラグイン」と組み合わせれば
 * 戦績をデータベースの値に組み込んでより多彩な装備品やスキルを
 * 作成することができます。
 * 「動的データベース構築プラグイン」は、本プラグインと同一の配布元で
 * 配布しています。
 *
 * ・戦績をクリア（初期化）する場合
 *
 * アクター関連項目
 * $gameActors.actor(アクターID).clearBattleRecord();
 *
 * パーティ関連項目
 * $gameParty.clearRecord();
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

function Game_TradeRecord() {
    this.initialize.apply(this, arguments);
}

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
        this._useItemCounter   = [];
        this._killEnemyCounter = [];
        this.attackDamageMax   = 0;
        this.attackDamageSum   = 0;
        this.acceptDamageMax   = 0;
        this.acceptDamageSum   = 0;
        this.recoverDamageSum  = 0;
        this.deadCounter       = 0;
        this.payCostMpSum      = 0;
        this.payCostTpSum      = 0;
        this.getAllSkillUseCounter();
        this.getAllItemUseCounter();
        this.getAllKillEnemyCounter();
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

    Game_BattlerBase.prototype.recordPayCostMpSum = function(value) {
        if (value >= 0) {
            this.payCostMpSum = (this.payCostMpSum || 0) + value;
        }
    };

    Game_BattlerBase.prototype.recordPayCostTpSum = function(value) {
        if (value >= 0) {
            this.payCostTpSum = (this.payCostTpSum || 0) + value;
        }
    };

    Game_BattlerBase.prototype.recordDead = function() {
        this.deadCounter = (this.deadCounter || 0) + 1;
    };

    Game_BattlerBase.prototype.recordSkillUseCounter = function(skillId) {
        var prevCount                  = this.getSkillUseCounter(skillId);
        this._useSkillCounter[skillId] = prevCount + 1;
    };

    Game_BattlerBase.prototype.recordItemUseCounter = function(itemId) {
        var prevCount                = this.getItemUseCounter(itemId);
        this._useItemCounter[itemId] = prevCount + 1;
    };

    Game_BattlerBase.prototype.recordKillEnemyCounter = function(enemyId) {
        var prevCount                   = this.getKillEnemyCounter(enemyId);
        this._killEnemyCounter[enemyId] = prevCount + 1;
    };

    Game_BattlerBase.prototype.getSkillUseCounter = function(skillId) {
        if (!this._useSkillCounter) this._useSkillCounter = [];
        return this._useSkillCounter[skillId] || 0;
    };

    Game_BattlerBase.prototype.getItemUseCounter = function(itemId) {
        if (!this._useItemCounter) this._useItemCounter = [];
        return this._useItemCounter[itemId] || 0;
    };

    Game_BattlerBase.prototype.getKillEnemyCounter = function(enemyId) {
        if (!this._killEnemyCounter) this._killEnemyCounter = [];
        return this._killEnemyCounter[enemyId] || 0;
    };

    Game_BattlerBase.prototype.getAllSkillUseCounter = function() {
        return this.getSumRecord(this._useSkillCounter);
    };

    Game_BattlerBase.prototype.getAllItemUseCounter = function() {
        return this.getSumRecord(this._useItemCounter);
    };

    Game_BattlerBase.prototype.getAllKillEnemyCounter = function() {
        return this.getSumRecord(this._killEnemyCounter);
    };

    Game_BattlerBase.prototype.getSumRecord = function(counterArray) {
        if (!counterArray) return 0;
        return counterArray.reduce(function(sumValue, value) {
            return sumValue + value;
        }, 0);
    };

    var _Game_BattlerBase_paySkillCost      = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function(skill) {
        _Game_BattlerBase_paySkillCost.apply(this, arguments);
        this.recordPayCostMpSum(this.skillMpCost(skill));
        this.recordPayCostTpSum(this.skillTpCost(skill));
    };

    //=============================================================================
    // Game_Battler
    //  アイテムとスキルの使用回数を記録します。
    //=============================================================================
    var _Game_Battler_useItem      = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function(item) {
        _Game_Battler_useItem.apply(this, arguments);
        if (!$gameParty.inBattle()) return;
        if (DataManager.isSkill(item)) {
            this.recordSkillUseCounter(item.id);
        } else if (DataManager.isItem(item)) {
            this.recordItemUseCounter(item.id);
        }
    };

    //=============================================================================
    // Game_Actor
    //  装備変更時はカウンタを無効にします。
    //=============================================================================
    var _Game_Actor_tradeItemWithParty      = Game_Actor.prototype.tradeItemWithParty;
    Game_Actor.prototype.tradeItemWithParty = function(newItem, oldItem) {
        $gameParty.setTradingItemWithActor(true);
        var result = _Game_Actor_tradeItemWithParty.apply(this, arguments);
        $gameParty.setTradingItemWithActor(false);
        return result;
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

    var _Game_Action_executeHpDamage      = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        _Game_Action_executeHpDamage.apply(this, arguments);
        if (target.hp === 0) {
            this.subject().recordKillEnemyCounter(target.getBattlerId());
            target.recordDead();
        }
    };

    //=============================================================================
    // Game_Actors
    //  全アクターの累計戦績を取得します。
    //=============================================================================
    Game_Actors.prototype.getSumRecord = function(propertyName, args) {
        return this._data.reduce(function(sumValue, actor) {
            return sumValue + this.getActorProperty(actor, propertyName, args);
        }.bind(this), 0);
    };

    Game_Actors.prototype.getActorProperty = function(actor, propertyName, args) {
        if (!actor) {
            return 0;
        } else if (args) {
            return actor[propertyName].apply(actor, args);
        } else {
            return actor[propertyName];
        }
    };

    Game_Actors.prototype.getSkillUseCounter = function(skillId) {
        return this.getSumRecord('getSkillUseCounter', [skillId]);
    };

    Game_Actors.prototype.getItemUseCounter = function(itemId) {
        return this.getSumRecord('getItemUseCounter', [itemId]);
    };

    Game_Actors.prototype.getKillEnemyCounter = function(enemyId) {
        return this.getSumRecord('getKillEnemyCounter', [enemyId]);
    };

    Game_Actors.prototype.getAllSkillUseCounter = function() {
        return this.getSumRecord('getAllSkillUseCounter', []);
    };

    Game_Actors.prototype.getAllItemUseCounter = function() {
        return this.getSumRecord('getAllItemUseCounter', []);
    };

    Game_Actors.prototype.getAllKillEnemyCounter = function() {
        return this.getSumRecord('getAllKillEnemyCounter', []);
    };

    Object.defineProperty(Game_Actors.prototype, 'attackDamageMax', {
        get: function() {
            return this.getSumRecord('attackDamageMax');
        }
    });

    Object.defineProperty(Game_Actors.prototype, 'attackDamageSum', {
        get: function() {
            return this.getSumRecord('attackDamageSum');
        }
    });

    Object.defineProperty(Game_Actors.prototype, 'acceptDamageMax', {
        get: function() {
            return this.getSumRecord('acceptDamageMax');
        }
    });

    Object.defineProperty(Game_Actors.prototype, 'acceptDamageSum', {
        get: function() {
            return this.getSumRecord('acceptDamageSum');
        }
    });

    Object.defineProperty(Game_Actors.prototype, 'recoverDamageSum', {
        get: function() {
            return this.getSumRecord('recoverDamageSum');
        }
    });

    Object.defineProperty(Game_Actors.prototype, 'payCostMpSum', {
        get: function() {
            return this.getSumRecord('payCostMpSum');
        }
    });

    Object.defineProperty(Game_Actors.prototype, 'payCostTpSum', {
        get: function() {
            return this.getSumRecord('payCostTpSum');
        }
    });

    Object.defineProperty(Game_Actors.prototype, 'deadCounter', {
        get: function() {
            return this.getSumRecord('deadCounter');
        }
    });

    //=============================================================================
    // Game_Party
    //  アイテムとお金の増減情報を記録します。
    //=============================================================================
    var _Game_Party_initialize      = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function() {
        _Game_Party_initialize.apply(this, arguments);
        this.clearRecord();
        this._tradingItemWithActor = false;
    };

    Game_Party.prototype.setTradingItemWithActor = function(value) {
        this._tradingItemWithActor = value;
    };

    Game_Party.prototype.clearRecord = function() {
        this.gainGoldSum    = 0;
        this.loseGoldSum    = 0;
        this._gainItemSum   = [];
        this._gainWeaponSum = [];
        this._gainArmorSum  = [];
    };

    Game_Party.prototype.getItemTypeName = function(item) {
        var itemTypeName;
        if (DataManager.isItem(item)) {
            itemTypeName = 'item';
        } else if (DataManager.isWeapon(item)) {
            itemTypeName = 'weapon';
        } else if (DataManager.isArmor(item)) {
            itemTypeName = 'armor';
        }
        return itemTypeName;
    };

    Game_Party.prototype.getTradeRecord = function(itemTypeName, tradeTypeName) {
        return this.getTradeRecordInstance(itemTypeName + tradeTypeName + 'Record');
    };

    Game_Party.prototype.getTradeRecordInstance = function(fieldName) {
        this[fieldName] = this[fieldName] || new Game_TradeRecord();
        return this[fieldName];
    };

    Game_Party.prototype.recordGainGold = function(amount) {
        this.gainGoldSum = (this.gainGoldSum || 0) + amount;
    };

    Game_Party.prototype.recordLoseGold = function(amount) {
        this.loseGoldSum = (this.loseGoldSum || 0) + amount;
    };

    Game_Party.prototype.recordGainItemSum = function(itemId, amount) {
        var prevAmount            = this.getGainItemSum(itemId);
        this._gainItemSum[itemId] = prevAmount + amount;
    };

    Game_Party.prototype.getGainItemSum = function(itemId) {
        if (!this._gainItemSum) this._gainItemSum = [];
        return this._gainItemSum[itemId] || 0;
    };

    Game_Party.prototype.recordGainWeaponSum = function(weaponId, amount) {
        var prevAmount                = this.getGainWeaponSum(weaponId);
        this._gainWeaponSum[weaponId] = prevAmount + amount;
    };

    Game_Party.prototype.getGainWeaponSum = function(weaponId) {
        if (!this._gainWeaponSum) this._gainWeaponSum = [];
        return this._gainWeaponSum[weaponId] || 0;
    };

    Game_Party.prototype.recordGainArmorSum = function(armorId, amount) {
        var prevAmount              = this.getGainArmorSum(armorId);
        this._gainArmorSum[armorId] = prevAmount + amount;
    };

    Game_Party.prototype.getGainArmorSum = function(armorId) {
        if (!this._gainArmorSum) this._gainArmorSum = [];
        return this._gainArmorSum[armorId] || 0;
    };

    var _Game_Party_gainGold      = Game_Party.prototype.gainGold;
    Game_Party.prototype.gainGold = function(amount) {
        _Game_Party_gainGold.apply(this, arguments);
        if (amount >= 0) {
            this.recordGainGold(amount);
        } else {
            this.recordLoseGold(-amount);
        }
    };

    var _Game_Party_gainItem      = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        _Game_Party_gainItem.apply(this, arguments);
        if (amount < 0 || this._tradingItemWithActor) return;
        if (DataManager.isItem(item)) {
            this.recordGainItemSum(item.id, amount);
        } else if (DataManager.isWeapon(item)) {
            this.recordGainWeaponSum(item.id, amount);
        } else if (DataManager.isArmor(item)) {
            this.recordGainArmorSum(item.id, amount);
        }
    };

    Game_Party.prototype.addTradeRecord = function(item, amount, gold, tradeType) {
        var record = this.getTradeRecord(this.getItemTypeName(item), tradeType);
        record.trade(item.id, amount, gold);
    };

    Game_Party.prototype.getItemBuyingRecord = function() {
        return this.getTradeRecord('item', 'Buy');
    };

    Game_Party.prototype.getItemSellingRecord = function() {
        return this.getTradeRecord('item', 'Sell');
    };

    Game_Party.prototype.getWeaponBuyingRecord = function() {
        return this.getTradeRecord('weapon', 'Buy');
    };

    Game_Party.prototype.getWeaponSellingRecord = function() {
        return this.getTradeRecord('weapon', 'Sell');
    };

    Game_Party.prototype.getArmorBuyingRecord = function() {
        return this.getTradeRecord('armor', 'Buy');
    };

    Game_Party.prototype.getArmorSellingRecord = function() {
        return this.getTradeRecord('armor', 'Sell');
    };

    //=============================================================================
    // Game_TradeRecord
    //  ショップでの売買履歴を保持するクラスです。
    //=============================================================================
    Game_TradeRecord.prototype.constructor = Game_TradeRecord;

    Game_TradeRecord.prototype.initialize = function() {
        this._itemUseGold = [];
        this._itemAmount  = [];
        this._tradeCount  = 0;
    };

    Game_TradeRecord.prototype.trade = function(itemId, amount, useGold) {
        this._itemUseGold[itemId] = (this._itemUseGold[itemId] || 0) + useGold;
        this._itemAmount[itemId]  = (this._itemAmount[itemId] || 0) + amount;
        this._tradeCount++;
    };

    Game_TradeRecord.prototype.getUseGoldSum = function(startId, endId) {
        return this.getSumRecord(this._itemUseGold, startId, endId);
    };

    Game_TradeRecord.prototype.getAmountSum = function(startId, endId) {
        return this.getSumRecord(this._itemAmount, startId, endId);
    };

    Game_TradeRecord.prototype.getTradeCount = function() {
        return this._tradeCount;
    };

    Game_TradeRecord.prototype.getSumRecord = function(counterArray, startIndex, endIndex) {
        if (startIndex && !endIndex) {
            endIndex = startIndex;
        }
        if (!startIndex && !endIndex) {
            startIndex = 1;
            endIndex = counterArray.length - 1;
        }
        return counterArray.slice(startIndex, endIndex + 1).reduce(function(sumValue, value) {
            return sumValue + value;
        }, 0);
    };

    //=============================================================================
    // Scene_Shop
    //  ショップでの売買履歴を保持します。
    //=============================================================================
    var _Scene_Shop_doBuy = Scene_Shop.prototype.doBuy;
    Scene_Shop.prototype.doBuy = function(number) {
        _Scene_Shop_doBuy.apply(this, arguments);
        $gameParty.addTradeRecord(this._item, number, number * this.buyingPrice(), 'Buy');
    };

    var _Scene_Shop_doSell = Scene_Shop.prototype.doSell;
    Scene_Shop.prototype.doSell = function(number) {
        _Scene_Shop_doSell.apply(this, arguments);
        $gameParty.addTradeRecord(this._item, number, number * this.sellingPrice(), 'Sell');
    };
})();

