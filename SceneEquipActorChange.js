/*=============================================================================
 SceneEquipActorChange.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/04/21 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 装備画面で常にアクター切替可能にするプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SceneEquipActorChange.js
 * @author トリアコンタン
 *
 * @help SceneEquipActorChange.js
 *
 * 装備画面で常にアクター切替可能にします。
 * デフォルト仕様ではスロット選択中もしくは装備品選択中は
 * アクターの切替はできませんが、これを可能にします。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Scene_Equip_createSlotWindow = Scene_Equip.prototype.createSlotWindow;
    Scene_Equip.prototype.createSlotWindow = function() {
        _Scene_Equip_createSlotWindow.apply(this, arguments);
        this._slotWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._slotWindow.setHandler("pageup", this.previousActor.bind(this));
    };

    const _Scene_Equip_createItemWindow = Scene_Equip.prototype.createItemWindow;
    Scene_Equip.prototype.createItemWindow = function() {
        _Scene_Equip_createItemWindow.apply(this, arguments);
        this._itemWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._itemWindow.setHandler("pageup", this.previousActor.bind(this));
    };

    const _Scene_Equip_arePageButtonsEnabled = Scene_Equip.prototype.arePageButtonsEnabled;
    Scene_Equip.prototype.arePageButtonsEnabled = function() {
        return _Scene_Equip_arePageButtonsEnabled.apply(this, arguments) || this._itemWindow?.active;
    };

    const _Scene_Equip_onActorChange = Scene_Equip.prototype.onActorChange;
    Scene_Equip.prototype.onActorChange = function() {
        const slotIndex = this._slotWindow.index();
        const itemIndex = this._itemWindow.index();
        _Scene_Equip_onActorChange.apply(this, arguments);
        if (slotIndex >= 0) {
            this._commandWindow.deactivate();
            this._slotWindow.activate();
            this._slotWindow.select(this._slotWindow.maxItems() >= slotIndex - 1 ? slotIndex : 0);
        }
        if (itemIndex >= 0 && this._slotWindow.isEnabled(slotIndex)) {
            this.onSlotOk();
        }
    };
})();
