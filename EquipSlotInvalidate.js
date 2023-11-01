/*=============================================================================
 EquipSlotInvalidate.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2023/11/01 MZで動作するよう修正
 1.1.0 2019/06/09 ステートなどのメモ欄の記述でスロット無効化できる機能を追加
 1.0.1 2019/06/08 二刀流設定時、対象スロットが無効化されていると戦闘アニメーションも表示されないよう修正
 1.0.0 2019/05/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 装備スロットの無効化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EquipSlotInvalidate.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command CHANGE_SLOT_VALIDATION
 * @text スロット有効状態変更
 * @desc 指定したスロットを無効化します。無効化されたスロットに装備された武具は効力を発揮しなくなります。
 *
 * @arg actorId
 * @text アクターID
 * @desc 無効化対象のアクターIDです。
 * @default 1
 * @type actor
 *
 * @arg slotIndex
 * @text スロット番号
 * @desc 無効化対象のスロット番号です。装備タイプの並び順に対応します。
 * @default 1
 * @type number
 * @min 1
 * 
 * @arg validation
 * @text 有効状態
 * @desc 有効化する場合はON、無効化する場合はOFFを指定してください。
 * @default true
 * @type boolean
 *
 * @help InvalidateEquipSlot.js
 *
 * アクターの装備スロットを無効化できます。
 * 無効化されたスロットに装備された武具は効力を発揮しなくなります。
 * 装備自体が外れることはありませんが、能力値変化及び特徴が全て無効になります。
 *
 * 無効化された場合もメニュー画面から装備変更は可能ですが、
 * パラメータは表示上も実際も変更されなくなります。
 * 無効化はメモ欄もしくはプラグインコマンドから指定します。
 *
 * ステートなど特徴を持つメモ欄に以下の通り入力してください。
 * <装備無効:1>     # スロット[1]を無効化
 * <EquipInvalid:1> # 同上
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'CHANGE_SLOT_VALIDATION', args => {
        $gameParty.setEquipSlotValidation(args.actorId, args.slotIndex, !args.validation);
    });

    /**
     * Game_Party
     */
    Game_Party.prototype.setEquipSlotValidation = function(id, slot, value) {
        if (!this._invalidSlot) {
            this._invalidSlot = new GameInvalidEquipSlot();
        }
        this._invalidSlot.setValue(id, slot, value);
    };

    Game_Party.prototype.isInvalidEquipSlot = function(id, slot) {
        return this._invalidSlot && this._invalidSlot.getValue(id, slot);
    };

    /**
     * GameInvalidEquipSlot
     * 装備スロットの禁止状態を保持します。
     */
    class GameInvalidEquipSlot {
        constructor() {
            this._actorInvalidSlotList = {};
        }
        
        setValue(actorId, slotIndex, value) {
            this._actorInvalidSlotList[[actorId, slotIndex]] = value;
        }

        getValue(actorId, slotIndex) {
            return this._actorInvalidSlotList[[actorId, slotIndex]] ||
                this._actorInvalidSlotList[[0, slotIndex]];
        }
    }
    window.GameInvalidEquipSlot = GameInvalidEquipSlot;

    /**
     * 装備スロットの無効化を反映させます。
     */
    const _Game_Actor_equips = Game_Actor.prototype.equips;
    Game_Actor.prototype.equips = function() {
        const result = _Game_Actor_equips.apply(this, arguments);
        if (this._calcInvalidSlot) {
            this._calcInvalidSlot = false;
            return result.map((item, index) => this.isInvalidEquipSlot(index + 1) ? null : item);
        } else {
            return result;
        }
    };

    Game_Actor.prototype.isInvalidEquipSlot = function(index) {
        if ($gameParty.isInvalidEquipSlot(this._actorId, index)) {
            return true;
        }
        // 再帰呼び出しのエラーを避けるため、上書き前のtraitObjectsを呼ぶ
        return _Game_Actor_traitObjects.apply(this).some(function(traitObj) {
            const metaValue = traitObj.meta['装備無効'] || traitObj.meta['EquipInvalid'];
            return metaValue && parseInt(metaValue) === index;
        });
    };

    const _Game_Actor_attackAnimationId1 = Game_Actor.prototype.attackAnimationId1;
    Game_Actor.prototype.attackAnimationId1 = function() {
        this._calcInvalidSlot = true;
        return _Game_Actor_attackAnimationId1.apply(this, arguments);
    };

    const _Game_Actor_attackAnimationId2 = Game_Actor.prototype.attackAnimationId2;
    Game_Actor.prototype.attackAnimationId2 = function() {
        this._calcInvalidSlot = true;
        return _Game_Actor_attackAnimationId2.apply(this, arguments);
    };

    const _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function(paramId) {
        this._calcInvalidSlot = true;
        return _Game_Actor_paramPlus.apply(this, arguments);
    };

    const _Game_Actor_traitObjects = Game_Actor.prototype.traitObjects;
    Game_Actor.prototype.traitObjects = function() {
        this._calcInvalidSlot = true;
        return _Game_Actor_traitObjects.apply(this, arguments);
    };
})();
