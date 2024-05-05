/*=============================================================================
 InvalidSlotHidden.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.2 2024/05/06 非表示スロットがステータス画面でも非表示になるよう修正
 1.1.1 2023/10/26 装備スロット選択時、選択中のヘルプが表示されなくなっていた問題を修正
 1.1.0 2022/08/31 MZ向けにリファクタリング
 1.0.1 2019/11/30 1.0.0の考慮漏れがあったので実装方法を全体的に変更
 1.0.0 2019/11/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 封印装備スロットの非表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/InvalidSlotHidden.js
 * @author トリアコンタン
 *
 * @help InvalidSlotHidden.js
 *
 * 特徴によって封印された装備スロットを非表示にします。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';

    /**
     * Game_Actor
     * 有効なスロットIDのリストを返します。
     */
    Game_Actor.prototype.validEquipIndexList = function() {
        return this.equipSlots()
            .map((slotItem, index) => this.isValidSlot(slotItem) ? index : null)
            .filter(item => item !== null);
    };

    Game_Actor.prototype.isValidSlot = function(slot) {
        return !this.isEquipTypeSealed(slot);
    };

    /**
     * Window_EquipSlot
     * 無効なスロットを非表示にします。
     */
    const _Window_EquipSlot_index = Window_EquipSlot.prototype.index;
    Window_EquipSlot.prototype.index = function() {
        const index = _Window_EquipSlot_index.apply(this, arguments);
        if (this._needRealIndex) {
            return this.convertEquipIndex(index);
        } else {
            return index;
        }
    };

    Window_EquipSlot.prototype.callProcessNeedRealIndex = function(process) {
        this._needRealIndex = true;
        const result = process();
        this._needRealIndex = false;
        return result;
    };

    const _Window_EquipSlot_reselect = Window_EquipSlot.prototype.reselect;
    Window_EquipSlot.prototype.reselect = function() {
        this._needRealIndex = false;
        _Window_EquipSlot_reselect.apply(this, arguments);
    };

    const _Window_EquipSlot_update = Window_EquipSlot.prototype.update;
    Window_EquipSlot.prototype.update = function() {
        _Window_EquipSlot_update.apply(this, arguments);
        if (this._itemWindow) {
            this._itemWindow.setSlotId(this.convertEquipIndex(this.index()));
        }
    };

    const _Window_EquipSlot_item = Window_EquipSlot.prototype.item;
    Window_EquipSlot.prototype.item = function() {
        return this.callProcessNeedRealIndex(_Window_EquipSlot_item.bind(this));
    };

    Window_EquipSlot.prototype.maxItems = function() {
        return this._actor ? this._actor.validEquipIndexList().length : 0;
    };

    Window_EquipSlot.prototype.drawItem = function(index) {
        if (this._actor) {
            const rect = this.itemLineRect(index);
            this.changeTextColor(this.systemColor());
            this.changePaintOpacity(this.isEnabled(index));
            this.drawText(this.slotName(index), rect.x, rect.y, 138, this.lineHeight());
            this.drawItemName(this._actor.equips()[this.convertEquipIndex(index)], rect.x + 138, rect.y);
            this.changePaintOpacity(true);
        }
    };

    Window_EquipSlot.prototype.convertEquipIndex = function(index) {
        return this._actor.validEquipIndexList()[index];
    };

    Window_EquipSlot.prototype.slotName = function(index) {
        if (!this._actor) {
            return '';
        }
        const realIndex = this.convertEquipIndex(index);
        const slots = this._actor.equipSlots();
        return $dataSystem.equipTypes[slots[realIndex]];
    };

    const _Window_EquipSlot_isEnabled = Window_EquipSlot.prototype.isEnabled;
    Window_EquipSlot.prototype.isEnabled = function(index) {
        if (!this._actor) {
            return false;
        }
        const realIndex = this.convertEquipIndex(index);
        return _Window_EquipSlot_isEnabled.call(this, realIndex);
    };

    /**
     * 装備変更時の対象スロットで非表示スロットを考慮します。
     */
    const _Scene_Equip_onItemOk = Scene_Equip.prototype.onItemOk;
    Scene_Equip.prototype.onItemOk = function() {
        this._slotWindow.callProcessNeedRealIndex(_Scene_Equip_onItemOk.bind(this));
    };

    Window_StatusEquip.prototype.maxItems = function() {
        return this._actor ? this._actor.validEquipIndexList().length : 0;
    };

    Window_StatusEquip.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        index = this._actor.validEquipIndexList()[index];
        const equips = this._actor.equips();
        const item = equips[index];
        const slotName = this.actorSlotName(this._actor, index);
        const sw = 138;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(slotName, rect.x, rect.y, sw, rect.height);
        this.drawItemName(item, rect.x + sw, rect.y, rect.width - sw);
    };
})();
