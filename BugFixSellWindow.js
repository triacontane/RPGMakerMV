/*=============================================================================
 BugFixSellWindow.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/10/11 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 売却リストウィンドウのバグ修正プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BugFixSellWindow.js
 * @author トリアコンタン
 *
 * @help BugFixSellWindow.js
 *　
 * ショップ画面の売却リストウィンドウにおける複数のバグを修正します。
 * 本現象は売却リストウィンドウがスクロールする条件下で発生します。
 * ・アイテムカテゴリをひとつに限定したとき、売却リストの最後の項目が描画されない
 * ・売却リストをスクロールしてからキャンセルして再度、売却しようとすると
 *  スクロール位置が元に戻らない
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Scene_Shop_createSellWindow = Scene_Shop.prototype.createSellWindow;
    Scene_Shop.prototype.createSellWindow = function() {
        _Scene_Shop_createSellWindow.apply(this, arguments);
        if (!this._categoryWindow.needsSelection()) {
            this._sellWindow.createContents();
        }
    };

    const _Scene_Shop_onCategoryOk = Scene_Shop.prototype.onCategoryOk;
    Scene_Shop.prototype.onCategoryOk = function() {
        _Scene_Shop_onCategoryOk.apply(this, arguments);
        this._sellWindow.setTopRow(0);
    };
})();
