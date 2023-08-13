/*=============================================================================
 BuffExtend.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/08/13 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc バフ拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BuffExtend.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param maxBuffCount
 * @text 最大バフ回数
 * @desc バフを重ね掛けできる最大回数です。0を指定するとデフォルトの2回となります。
 * @default 0
 * @type number
 *
 * @param maxDebuffCount
 * @text 最大デバフ回数
 * @desc デバフを重ね掛けできる最大回数です。0を指定するとデフォルトの2回となります。
 * @default 0
 * @type number
 *
 * @param buffRate
 * @text バフ倍率
 * @desc バフ/デバフの効果量を増加させる倍率です。百分率(%)で指定します。0を指定するとデフォルトの25%となります。
 * @default 0
 * @type number
 *
 * @param multiBuffMessage
 * @text マルチバフメッセージ
 * @desc 2段階以上のバフが適用されたときに表示するメッセージです。
 * @default %1の%2がぐーんと上がった！
 * @type string
 *
 * @param multiDebuffMessage
 * @text マルチデバフメッセージ
 * @desc 2段階以上のデバフが適用されたときに表示するメッセージです。
 * @default %1の%2ががくっと下がった！
 * @type string
 *
 * @param noEffectBuffMessage
 * @text 効果なしバフメッセージ
 * @desc バフが適用されたが効果がなかったときに表示するメッセージです。
 * @default %1の%2はこれ以上上がらない！
 * @type string
 *
 * @param noEffectDebuffMessage
 * @text 効果なしデバフメッセージ
 * @desc デバフが適用されたが効果がなかったときに表示するメッセージです。
 * @default %1の%2はこれ以上下がらない！
 * @type string
 *
 * @command INCREASE_BUFF
 * @text バフ進行
 * @desc 指定したぶんだけバフを進行させます。
 *
 * @arg actorId
 * @text アクターID
 * @desc 進行させるバフのアクターIDです。
 * @default 0
 * @type actor
 *
 * @arg enemyIndex
 * @text 敵キャラインデックス
 * @desc 進行させるバフの敵キャラインデックスです。アクターIDを指定した場合、そちらが優先されます。
 * @default -1
 * @type number
 * @min -1
 *
 * @arg paramId
 * @text パラメータID
 * @desc 進行させるバフのパラメータIDです。
 * @default 0
 * @type select
 * @option 最大HP
 * @value 0
 * @option 最大MP
 * @value 1
 * @option 攻撃力
 * @value 2
 * @option 防御力
 * @value 3
 * @option 魔法力
 * @value 4
 * @option 魔法防御
 * @value 5
 * @option 敏捷性
 * @value 6
 * @option 運
 * @value 7
 *
 * @arg count
 * @text 進行値
 * @desc 進行させるバフの値です。負の値を設定するとデバフになります。
 * @default 1
 * @type number
 * @min -999
 * @max 999
 *
 * @arg turn
 * @text 持続ターン
 * @desc 進行させるバフの持続ターンです。
 * @default 1
 * @type number
 *
 * @help BuffExtend.js
 *
 * バフ、デバフの重ね掛け回数を増やしたり、効果量を増加させたりできます。
 * また、プラグインコマンドからバフ、デバフ効果を適用できます。
 * 3回以上、重ね掛けした場合もアイコンは変わりません。
 *
 * バフ、デバフの進行度を強化するメモタグです。2以上の値を指定します。
 * スキル、アイテムのメモ欄に以下の通り設定してください。
 * <BuffLevel:2> # バフ、デバフの進行度を2段階進めます。
 * <バフレベル:2> # 同上
 *
 * 2段階以上バフ、デバフが適用された場合の専用メッセージや
 * 効果がなかった場合の専用メッセージも設定できます。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'INCREASE_BUFF', args => {
        const actor = $gameActors.actor(args.actorId);
        const enemy = $gameTroop.members()[args.enemyIndex];
        const battler = actor || enemy;
        if (!battler) {
            PluginManagerEx.throwError(`INCREASE_BUFF:Invalid battler. 
            Actor ID:${args.actorId} Enemy index:${args.enemyIndex}`, script);
        }
        if (args.count > 0) {
            battler.addMultiBuff(args.paramId, args.turn, args.count);
        } else {
            battler.addMultiDebuff(args.paramId, args.turn, -args.count);
        }
    });

    const _Game_BattlerBase_paramBuffRate = Game_BattlerBase.prototype.paramBuffRate;
    Game_BattlerBase.prototype.paramBuffRate = function(paramId) {
        const rate = _Game_BattlerBase_paramBuffRate.apply(this, arguments);
        if (param.buffRate === 0) {
            return rate;
        }
        return this._buffs[paramId] * (param.buffRate / 100) + 1.0;
    };

    const _Game_BattlerBase_isMaxBuffAffected = Game_BattlerBase.prototype.isMaxBuffAffected;
    Game_BattlerBase.prototype.isMaxBuffAffected = function(paramId) {
        if (param.maxBuffCount === 0) {
            return _Game_BattlerBase_isMaxBuffAffected.apply(this, arguments);
        }
        return this._buffs[paramId] === param.maxBuffCount;
    };

    const _Game_BattlerBase_isMaxDebuffAffected = Game_BattlerBase.prototype.isMaxDebuffAffected;
    Game_BattlerBase.prototype.isMaxDebuffAffected = function(paramId) {
        if (param.maxDebuffCount === 0) {
            return _Game_BattlerBase_isMaxDebuffAffected.apply(this, arguments);
        }
        return this._buffs[paramId] === -param.maxDebuffCount;
    };

    const _Game_BattlerBase_buffIconIndex = Game_BattlerBase.prototype.buffIconIndex;
    Game_BattlerBase.prototype.buffIconIndex = function(buffLevel, paramId) {
        if (buffLevel > 2) {
            arguments[0] = 2;
        } else if (buffLevel < -2) {
            arguments[0] = -2;
        }
        return _Game_BattlerBase_buffIconIndex.apply(this, arguments);
    };

    Game_Battler.prototype.addMultiBuff = function(paramId, turns, count) {
        this.addBuff(paramId, turns);
        if (count > 1) {
            this.addMultiBuff(paramId, turns, count - 1);
        }
    };

    Game_Battler.prototype.addMultiDebuff = function(paramId, turns, count) {
        this.addDebuff(paramId, turns);
        if (count > 1) {
            this.addMultiDebuff(paramId, turns, count - 1);
        }
    };

    const _Game_Action_itemEffectAddBuff = Game_Action.prototype.itemEffectAddBuff;
    Game_Action.prototype.itemEffectAddBuff = function(target, effect) {
        if (target.isMaxBuffAffected(effect.dataId)) {
            target.result().pushNoEffectBuff(effect.dataId);
        }
        _Game_Action_itemEffectAddBuff.apply(this, arguments);
        const count = PluginManagerEx.findMetaValue(this.item(), ['バフレベル', 'BuffLevel']);
        if (count > 1) {
            target.addMultiBuff(effect.dataId, effect.value1, count - 1);
        }
    };

    const _Game_Action_itemEffectAddDebuff = Game_Action.prototype.itemEffectAddDebuff;
    Game_Action.prototype.itemEffectAddDebuff = function(target, effect) {
        if (target.isMaxDebuffAffected(effect.dataId)) {
            target.result().pushNoEffectDebuff(effect.dataId);
        }
        _Game_Action_itemEffectAddDebuff.apply(this, arguments);
        if (!target.result().success) {
            return;
        }
        const count = PluginManagerEx.findMetaValue(this.item(), ['バフレベル', 'BuffLevel']);
        if (count > 1) {
            target.addMultiDebuff(effect.dataId, effect.value1, count - 1);
        }
    };

    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.apply(this, arguments);
        this.addedMultiBuffs = [];
        this.addedMultiDebuffs = [];
        this.addedNoEffectBuffs = [];
        this.addedNoEffectDebuffs = [];
    };

    const _Game_ActionResult_pushAddedBuff = Game_ActionResult.prototype.pushAddedBuff;
    Game_ActionResult.prototype.pushAddedBuff = function(paramId) {
        if (this.isBuffAdded(paramId) && !this.addedMultiBuffs.includes(paramId)) {
            this.addedMultiBuffs.push(paramId);
            return;
        }
        _Game_ActionResult_pushAddedBuff.apply(this, arguments);
    };

    const _Game_ActionResult_pushAddedDebuff = Game_ActionResult.prototype.pushAddedDebuff;
    Game_ActionResult.prototype.pushAddedDebuff = function(paramId) {
        if (this.isDebuffAdded(paramId) && !this.addedMultiDebuffs.includes(paramId)) {
            this.addedMultiDebuffs.push(paramId);
            return;
        }
        _Game_ActionResult_pushAddedDebuff.apply(this, arguments);
    };

    Game_ActionResult.prototype.pushNoEffectBuff = function(paramId) {
        if (!this.addedNoEffectBuffs.includes(paramId)) {
            this.addedNoEffectBuffs.push(paramId);
        }
    };

    Game_ActionResult.prototype.pushNoEffectDebuff = function(paramId) {
        if (!this.addedNoEffectDebuffs.includes(paramId)) {
            this.addedNoEffectDebuffs.push(paramId);
        }
    };

    Game_ActionResult.prototype.filterDuplicateBuffs = function() {
        this.addedBuffs = this.addedBuffs.filter(paramId =>
            !this.addedMultiBuffs.includes(paramId) &&
            !this.addedNoEffectBuffs.includes(paramId));
        this.addedDebuffs = this.addedDebuffs.filter(paramId =>
            !this.addedMultiDebuffs.includes(paramId) &&
            !this.addedNoEffectDebuffs.includes(paramId));
        this.addedMultiBuffs = this.addedMultiBuffs.filter(paramId =>
            !this.addedNoEffectBuffs.includes(paramId));
        this.addedMultiDebuffs = this.addedMultiDebuffs.filter(paramId =>
            !this.addedNoEffectDebuffs.includes(paramId));
    };

    const _Window_BattleLog_displayChangedBuffs = Window_BattleLog.prototype.displayChangedBuffs;
    Window_BattleLog.prototype.displayChangedBuffs = function(target) {
        const result = target.result();
        result.filterDuplicateBuffs();
        _Window_BattleLog_displayChangedBuffs.apply(this, arguments);
        this.displayBuffs(target, result.addedMultiBuffs, param.multiBuffMessage || TextManager.buffAdd);
        this.displayBuffs(target, result.addedMultiDebuffs, param.multiDebuffMessage || TextManager.debuffAdd);
        if (param.noEffectBuffMessage) {
            this.displayBuffs(target, result.addedNoEffectBuffs, param.noEffectBuffMessage);
        }
        if (param.noEffectDebuffMessage) {
            this.displayBuffs(target, result.addedNoEffectDebuffs, param.noEffectDebuffMessage);
        }
    };
})();
