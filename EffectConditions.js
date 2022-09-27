//=============================================================================
// EffectConditions.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2022/09/27 適用条件に「戦闘中かどうか」を追加
// 1.1.0 2022/09/25 MZ用に再作成
// 1.0.3 2017/02/07 端末依存の記述を削除
// 1.0.2 2017/01/12 メモ欄の値が空で設定された場合にエラーが発生するかもしれない問題を修正
// 1.0.1 2017/01/01 YEP_BattleEngineCore.js用の対策コードを追記
// 1.0.0 2017/01/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 効果の条件適用プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EffectConditions.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * 
 * @param conditionList
 * @text 条件リスト
 * @desc 効果の適用条件の設定リストです。
 * @default []
 * @type struct<Condition>[]
 *
 * @help EffectConditions.js
 * 
 * スキル、アイテムの使用効果に適用条件を設定します。
 * データベースのメモ欄に以下の通り記述すると、識別子[cond01]で設定した条件を
 * 満たしたときだけ[1]番目に設定した効果が適用されます。
 * <効果条件_1:cond01>
 * <EffectCond_1:cond01>
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

/*~struct~Condition:
 *
 * @param id
 * @text 識別子
 * @desc メモ欄に記述する識別子です。他の識別子と重複しない値を設定します。
 * @default cond01
 * 
 * @param switch
 * @text スイッチ
 * @desc 指定したスイッチがONのときに有効と判定される条件です。
 * @default 0
 * @type switch
 * 
 * @param probability
 * @text 確率
 * @desc 指定した確率で有効と判定される条件です。(100を指定すると100%成功)
 * @default 0
 * @type number
 * @max 100
 *
 * @param battleOnly
 * @text 戦闘中のみ
 * @desc ONにすると戦闘中のみ有効な効果と判断されます。(OFFにすると戦闘中、メニュー中どちらでも有効)
 * @default false
 * @type boolean
 * 
 * @param script
 * @text スクリプト
 * @desc 指定したスクリプトの実行結果がtrueのときに有効と判定される条件です。
 * @default 
 * @type combo
 * @option target.hpRate() === 1.0; // 相手のHPが最大の場合
 * @option damage > 100; // ダメージが100を超えた場合
 * @option subject.isActor(); // 使用者がアクターの場合
 * 
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Temp
    //  IDを指定してコモンイベントを予約キャンセル
    //=============================================================================
    Game_Temp.prototype.clearCommonEventReservationById = function(commonEventId) {
        this._commonEventQueue = this._commonEventQueue.filter(id => id !== commonEventId);
    };

    //=============================================================================
    // Game_Action
    //  効果の条件適用を実装します。
    //=============================================================================
    const _Game_Action_executeDamage =Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        this._damageValue = value;
        _Game_Action_executeDamage.apply(this, arguments);
    };

    const _Game_Action_testItemEffect = Game_Action.prototype.testItemEffect;
    Game_Action.prototype.testItemEffect = function(target, effect) {
        if (this.isValidEffect(target, effect)) {
            return _Game_Action_testItemEffect.apply(this, arguments);
        } else {
            return false;
        }
    };

    const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
    Game_Action.prototype.applyItemEffect = function(target, effect) {
        if (this.isValidEffect(target, effect)) {
            _Game_Action_applyItemEffect.apply(this, arguments);
        }
    };

    const _Game_Action_applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function() {
        _Game_Action_applyGlobal.apply(this, arguments);
        this.cancelEffectCommonEvent();
    };

    Game_Action.prototype.cancelEffectCommonEvent = function() {
        this.item().effects.forEach(effect => {
            if (effect.code === Game_Action.EFFECT_COMMON_EVENT && !this.isValidEffect(null, effect)) {
                $gameTemp.clearCommonEventReservationById(effect.dataId);
            }
        });
    };

    Game_Action.prototype.isValidEffect = function(target, effect) {
        const condParam = this.findEffectCondition(effect);
        if (!condParam) {
            return true;
        }
        const conditions = [];
        const damage = this._damageValue;
        conditions.push(() => !condParam.switch || $gameSwitches.value(condParam.switch));
        conditions.push(() => !condParam.probability || Math.randomInt(100) < condParam.probability);
        conditions.push(() => !condParam.script || eval(condParam.script));
        conditions.push(() => !condParam.battleOnly || $gameParty.inBattle());
        return !conditions.some(condition => !condition());
    };

    Game_Action.prototype.findEffectCondition = function(effect) {
        const index = this.getEffectIndex(effect);
        const id = PluginManagerEx.findMetaValue(this.item(), [`EffectCond_${index}`, `効果条件_${index}`]);
        return id ? param.conditionList?.find(item => item.id === id) : null;
    };

    Game_Action.prototype.getEffectIndex = function(effect) {
        return this.item().effects.indexOf(effect) + 1;
    };
})();

