/*=============================================================================
 ShopListOpen.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/12/13 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ショップリストの初期表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShopListOpen.js
 * @author トリアコンタン
 *
 * @help ShopListOpen.js
 *
 * ショップ画面において購入リストを初期状態で表示します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Scene_Shop_createBuyWindow = Scene_Shop.prototype.createBuyWindow;
    Scene_Shop.prototype.createBuyWindow = function() {
        _Scene_Shop_createBuyWindow.apply(this, arguments);
        this.showBuyWindow();
    };

    const _Scene_Shop_onBuyCancel = Scene_Shop.prototype.onBuyCancel;
    Scene_Shop.prototype.onBuyCancel = function() {
        _Scene_Shop_onBuyCancel.apply(this, arguments);
        this.showBuyWindow();
    };

    const _Scene_Shop_commandSell = Scene_Shop.prototype.commandSell;
    Scene_Shop.prototype.commandSell = function() {
        _Scene_Shop_commandSell.apply(this, arguments);
        this._buyWindow.hide();
    };

    const _Scene_Shop_onSellCancel = Scene_Shop.prototype.onSellCancel;
    Scene_Shop.prototype.onSellCancel = function() {
        _Scene_Shop_onSellCancel.apply(this, arguments);
        this.showBuyWindow();
    };

    const _Scene_Shop_activateBuyWindow = Scene_Shop.prototype.activateBuyWindow;
    Scene_Shop.prototype.activateBuyWindow = function() {
        _Scene_Shop_activateBuyWindow.apply(this, arguments);
        this._buyWindow.select(0);
    };

    Scene_Shop.prototype.showBuyWindow = function() {
        this._buyWindow.setMoney(this.money());
        this._buyWindow.show();
        this._statusWindow.show();
        this._buyWindow.select(-1);
    };
})();
