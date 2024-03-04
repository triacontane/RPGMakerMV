/*=============================================================================
 ItemSellableCategory.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/04 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 売却可能アイテムカテゴリプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ItemSellableCategory.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param item
 * @text アイテム
 * @desc 有効にした場合、アイテムが売却可能になります。
 * @default true
 * @type boolean
 *
 * @param weapon
 * @text 武器
 * @desc 有効にした場合、武器が売却可能になります。
 * @default true
 * @type boolean
 *
 * @param armor
 * @text 防具
 * @desc 有効にした場合、防具が売却可能になります。
 * @default true
 * @type boolean
 *
 * @param keyItem
 * @text 大事なもの
 * @desc 有効にした場合、大事なものが売却可能になります。
 * @default true
 * @type boolean
 *
 * @help ItemSellableCategory.js
 *
 * アイテム画面でのカテゴリウィンドウの表示内容と
 * ショップ画面でのカテゴリウィンドウの表示内容とを分けられます。
 *
 * アイテム画面での表示カテゴリとは無関係にカテゴリごとに
 * 売却可能かどうかの設定ができます。
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


    const _Window_ItemCategory_needsCommand = Window_ItemCategory.prototype.needsCommand;
    Window_ItemCategory.prototype.needsCommand = function(name) {
        if (SceneManager._scene instanceof Scene_Shop) {
            return !!param[name];
        } else {
            return _Window_ItemCategory_needsCommand.apply(this, arguments);
        }
    };
})();
