/*=============================================================================
 ShopCommandSkip.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2026/03/14 売却専用ショップの場合もコマンドスキップするよう修正
 1.0.0 2025/03/11 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ショップコマンドスキッププラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShopCommandSkip.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help ShopCommandSkip.js
 *
 * 購入のみのショップではコマンドウィンドウを表示せず
 * 直接、リストウィンドウをアクティブにします。
 * また、購入リストが空のショップは売却専用として、同じく
 * コマンドウィンドウを表示せず、直接、リストウィンドウをアクティブにします。
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

    const _Scene_Shop_create = Scene_Shop.prototype.create;
    Scene_Shop.prototype.create = function() {
        _Scene_Shop_create.apply(this, arguments);
        if (this._purchaseOnly) {
            this._commandWindow.hide();
            this.commandBuy();
        } else if (this.isSellOnly()) {
            this._commandWindow.select(1);
            this._commandWindow.hide();
            this.commandSell();
        }
    };

    const _Scene_Shop_onBuyCancel = Scene_Shop.prototype.onBuyCancel;
    Scene_Shop.prototype.onBuyCancel = function() {
        _Scene_Shop_onBuyCancel.apply(this, arguments);
        if (this._purchaseOnly) {
            this.popScene();
        }
    };

    const _Scene_Shop_onCategoryCancel = Scene_Shop.prototype.onCategoryCancel;
    Scene_Shop.prototype.onCategoryCancel = function() {
        _Scene_Shop_onCategoryCancel.apply(this, arguments);
        if (this.isSellOnly()) {
            this.popScene();
        }
    };

    Scene_Shop.prototype.isSellOnly = function() {
        return this._goods.length === 1 && this._goods[0][1] === 0;
    };
})();
