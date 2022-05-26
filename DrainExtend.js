//=============================================================================
// DrainExtend.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2022/05/26 MZ向けに全面的に仕様変更
// 1.2.0 2020/04/29 計算式中でローカル変数[a][b]を使えるよう修正
// 1.1.0 2020/04/29 吸収HPの有効率を設定できる機能を追加
//                  各種メモ欄にJavaScript計算式を使用できる機能を追加
// 1.0.2 2017/02/07 端末依存の記述を削除
// 1.0.0 2017/01/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 吸収拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DrainExtend.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param drainList
 * @text 吸収設定のリスト
 * @desc 吸収設定の一覧です。
 * @default []
 * @type struct<Drain>[]
 *
 * @param recoverSe
 * @text 回復効果音
 * @desc 吸収成功時に回復効果音を演奏します。
 * @default false
 * @type boolean
 *
 * @help DrainExtend.js
 *
 * ダメージタイプの「HP吸収」および「MP吸収」の仕様を拡張します。
 * 1. 吸収率を指定して与えたダメージのN%回復などが可能
 * 2. HPダメージに対してMPやTPを回復することが可能
 * 3. MPダメージに対してHPやTPを回復することが可能
 * 4. 通常ダメージ時のメッセージと効果音に変更可能
 * 5. HP吸収の上限が相手の残HPになる吸収の仕様を撤廃可能
 *
 * スキルもしくはアイテムのダメージタイプを「HP吸収」もしくは「MP吸収」
 * にしてからメモ欄に以下の通り記述してください。
 * id : パラメータで指定した吸収仕様の識別子
 * <吸収拡張:id>
 * <DrainEx:id>
 *
 * パラメータの値は制御文字に加えてJavaScript計算式が使用できます。
 * さらに計算式中では以下の変数が使えます。
 * a : 攻撃者
 * b : 対象者
 *
 * 吸収攻撃を受ける側に有効度を設定できます。与えるダメージには影響しません。
 * 特徴を有するデータベースのメモ欄に以下の通り指定してください。
 * <吸収有効率:50>  # 吸収率が[50%]になります。
 * <DrainRate:50> # 同上
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

/*~struct~Drain:
 *
 * @param id
 * @text 識別子
 * @desc メモ欄で指定する吸収設定の識別子です。他と重複しない値を指定してください。
 * @default drain01
 *
 * @param hpRate
 * @text HP吸収率
 * @desc 与えたダメージに対するHPの吸収率を設定します。
 * @default 0
 * @type number
 * @min -10000
 *
 * @param mpRate
 * @text MP吸収率
 * @desc 与えたダメージに対するMPの吸収率を設定します。
 * @default 0
 * @type number
 * @min -10000
 *
 * @param tpRate
 * @text TP吸収率
 * @desc 与えたダメージに対するTPの吸収率を設定します。
 * @default 0
 * @type number
 * @min -10000
 *
 * @param useAttackMessage
 * @text 攻撃メッセージ使用
 * @desc メッセージが(吸収用ではなく)通常攻撃のものに変更されます。
 * @default false
 * @type boolean
 *
 * @param limitOver
 * @text 上限突破
 * @desc 吸収値が相手の残HPを超えるようになります。
 * @default false
 * @type boolean
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.drainList) {
        param.drainList = [];
    }

    //=============================================================================
    // Game_BattlerBase
    //  吸収の有効率を設定します。
    //=============================================================================
    Game_BattlerBase.prototype.getDrainEffectiveRate = function(subject) {
        let rate = null;
        const a = subject;
        const b = this;
        this.traitObjects().forEach(function(traitObj) {
            const meta = PluginManagerEx.findMetaValue(traitObj, ['DrainRate', '吸収有効率']);
            if (meta) {
                rate = Math.max(rate || 0, eval(meta) / 100);
            }
        });
        return rate !== null ?  rate : 1.0;
    };

    //=============================================================================
    // Game_Action
    //  吸収の仕様を拡張します。
    //=============================================================================
    const _Game_Action_isDrain = Game_Action.prototype.isDrain;
    Game_Action.prototype.isDrain = function() {
        if (this._temporaryDisableDrain) {
            this._temporaryDisableDrain = false;
            return false;
        }
        return _Game_Action_isDrain.apply(this, arguments);
    };

    Game_Action.prototype.findDrainParam = function() {
        const drainId = PluginManagerEx.findMetaValue(this.item(), ['DrainEx', '吸収拡張']);
        return param.drainList.find(item => item.id === drainId) || {};
    };

    Game_Action.prototype.isDrainExtend = function() {
        return !!this.findDrainParam().id;
    };

    Game_Action.prototype.getDrainRate = function(propName) {
        const rate = this.findDrainParam()[propName];
        if (rate === parseInt(rate)) {
            return rate / 100;
        } else {
            const a = this.subject();
            const b = this._drainTarget;
            return eval(rate) / 100;
        }
    };

    Game_Action.prototype.getDrainValue = function(propName, value, effectiveRate) {
        return Math.floor(value * this.getDrainRate(propName) * effectiveRate);
    };

    Game_Action.prototype.isDrainMessageAttack = function() {
        return this.findDrainParam().useAttackMessage;
    };

    Game_Action.prototype.isDrainLimitOver = function() {
        return this.findDrainParam().limitOver;
    };

    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        if (this.isDrainMessageAttack()) {
            this._temporaryDisableDrain = true;
        }
        this._drainTarget = target;
        return _Game_Action_apply.apply(this, arguments);
    };

    const _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        if (this.isDrainLimitOver()) {
            this._temporaryDisableDrain = true;
        }
        _Game_Action_executeHpDamage.apply(this, arguments);
    };

    const _Game_Action_gainDrainedHp = Game_Action.prototype.gainDrainedHp;
    Game_Action.prototype.gainDrainedHp = function(value) {
        if (this.isDrainExtend()) {
            this.gainDrainedParam(value);
        } else {
            _Game_Action_gainDrainedHp.apply(this, arguments);
        }
    };

    const _Game_Action_gainDrainedMp = Game_Action.prototype.gainDrainedMp;
    Game_Action.prototype.gainDrainedMp = function(value) {
        if (this.isDrainExtend()) {
            this.gainDrainedParam(value);
        } else {
            _Game_Action_gainDrainedMp.apply(this, arguments);
        }
    };

    Game_Action.prototype.gainDrainedParam = function(value) {
        const effectiveRate = this._drainTarget.getDrainEffectiveRate(this.subject());
        const hpValue = this.getDrainValue('hpRate', value, effectiveRate);
        if (hpValue !== 0) {
            _Game_Action_gainDrainedHp.call(this, hpValue);
        }
        const mpValue = this.getDrainValue('mpRate', value, effectiveRate);
        if (mpValue !== 0) {
            _Game_Action_gainDrainedMp.call(this, mpValue);
        }
        const tpValue = this.getDrainValue('tpRate', value, effectiveRate);
        if (tpValue !== 0) {
            this.gainDrainedTp(tpValue);
        }
    };

    Game_Action.prototype.gainDrainedTp = function(value) {
        if (this.isDrain()) {
            let gainTarget = this.subject();
            if (this._reflectionTarget !== undefined) {
                gainTarget = this._reflectionTarget;
            }
            gainTarget.gainTp(value);
        }
    };

    //=============================================================================
    // Window_BattleLog
    //  吸収時に回復効果音を演奏します。
    //=============================================================================
    const _Window_BattleLog_displayDamage = Window_BattleLog.prototype.displayDamage;
    Window_BattleLog.prototype.displayDamage = function(target) {
        _Window_BattleLog_displayDamage.apply(this, arguments);
        if (this.isNeedDrainRecoverSe(target.result())) {
            this.push('performRecovery', target);
        }
    };

    Window_BattleLog.prototype.isNeedDrainRecoverSe = function(result) {
        return param.recoverSe && !result.missed && !result.evaded && result.drain;
    };
})();
