/*=============================================================================
 Zweihänder.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2022/06/30 二刀流の特徴を持つ武器を装備しているときにスロット2に両手持ちの武器を装備したときに装備状態が不正になる問題を修正
 1.0.0 2022/06/29 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 武器両手持ちプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/Zweihänder.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param damageRate
 * @text ダメージ倍率
 * @desc 両手持ち時に物理ダメージ(命中タイプが物理攻撃のスキルによるダメージ)の倍率です。(150で1.5倍)
 * @default 100
 * @type number
 *
 * @help Zweihänder.js
 *
 * 両手持ち専用武器を作れたり、アクターのスキルとして両手持ちを定義できます。
 * 両手持ちすると物理ダメージの倍率が増加しますが、代わりに
 * 他の武器(装備タイプ01)または盾(装備タイプ02)が強制的に外れます。
 * 二刀流の特徴とも併用できます。
 *
 * アクターが特徴『装備封印:盾(装備タイプ02)』を持ち
 * かつ何らかの武器を装備しているとき両手持ち状態とみなされます。
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    Game_BattlerBase.prototype.isTwoHanded = function() {
        return false;
    };

    Game_Actor.prototype.isTwoHanded = function() {
        return this.isEquipTypeSealed(2) && this.weapons().length > 0;
    };

    const _Game_Actor_releaseUnequippableItems = Game_Actor.prototype.releaseUnequippableItems;
    Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
        for (;;) {
            _Game_Actor_releaseUnequippableItems.apply(this, arguments);
            const equips = this.equips();
            let changed = false;
            for (let i = 0; i < equips.length; i++) {
                const item = equips[i];
                if (!this.canEquipTwoHanded(item, i)) {
                    if (!forcing) {
                        this.tradeItemWithParty(null, item);
                    }
                    this._equips[i].setObject(null);
                    changed = true;
                }
            }
            if (!changed) {
                break;
            }
        }
    };

    Game_Actor.prototype.canEquipTwoHanded = function(item, slotId) {
        if (!this.isTwoHanded() || this.weapons().length === 1 || !DataManager.isWeapon(item)) {
            return true;
        } else {
            return slotId === this._lastChangeSlot;
        }
    };

    const _Game_Actor_initEquips = Game_Actor.prototype.initEquips;
    Game_Actor.prototype.initEquips = function(equips) {
        this._lastChangeSlot = 0;
        _Game_Actor_initEquips.apply(this, arguments);
        this._lastChangeSlot = null;
    };

    const _Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
    Game_Actor.prototype.changeEquip = function(slotId, item) {
        this._lastChangeSlot = slotId;
        _Game_Actor_changeEquip.apply(this, arguments);
        this._lastChangeSlot = null;
    };

    const _Game_Actor_forceChangeEquip = Game_Actor.prototype.forceChangeEquip;
    Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
        this._lastChangeSlot = slotId;
        _Game_Actor_forceChangeEquip.apply(this, arguments);
        this._lastChangeSlot = null;
    };

    const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        const value = _Game_Action_makeDamageValue.apply(this, arguments);
        if (this.isPhysical() && this.subject().isTwoHanded()) {
            return Math.round(value * param.damageRate / 100);
        } else {
            return value;
        }
    };
})();
