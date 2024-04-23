/*=============================================================================
 BugFixEquipItemCursor.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/04/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 装備アイテムウィンドウのカーソルバグ修正パッチ
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BugFixEquipItemCursor.js
 * @author トリアコンタン
 *
 * @help BugFixEquipItemCursor.js
 *
 * 装備画面で装備アイテムウィンドウをスクロールさせたあとでスロットウィンドウに
 * 戻り再度、同じスロットを選択すると、装備アイテムウィンドウのスクロール位置が
 * 元に戻らない問題を修正します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Scene_Equip_onSlotOk = Scene_Equip.prototype.onSlotOk;
    Scene_Equip.prototype.onSlotOk = function() {
        _Scene_Equip_onSlotOk.apply(this, arguments);
        this._itemWindow.setTopRow(0);
    };
})();
