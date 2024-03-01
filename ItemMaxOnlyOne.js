/*=============================================================================
 ItemMaxOnlyOne.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/01 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc アイテム複数所持制限プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ItemMaxOnlyOne.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param condition
 * @text 条件
 * @desc 所持数の上限を1にするアイテムの条件です。設定しない場合はすべてのアイテムの所持数が1になります。
 * @default noCondition
 * @type select
 * @option 無条件
 * @value noCondition
 * @option メモタグを含む
 * @value hasMeta
 * @option メモタグを含まない
 * @value noMeta
 *
 * @param tagName
 * @text メモタグ名
 * @desc 条件がメモタグを含む/含まない場合のメモタグ名です。アイテムのデータベースでは<aaa>と記述します。
 * @default aaa
 *
 * @param itemNumberHidden
 * @text 所持数非表示
 * @desc 所持上限を1に設定したアイテムはメニュー画面で個数が非表示になります。
 * @default true
 * @type boolean
 *
 * @help ItemMaxOnlyOne.js
 *
 * アイテムの最大所持数を1つに制限します。
 * 制限した場合、メニュー画面での所持数を削除できます。
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

    const _Game_Party_maxItems = Game_Party.prototype.maxItems;
    Game_Party.prototype.maxItems = function(item) {
        if (this.isOnlyOneItem(item)) {
            return 1;
        } else {
            return _Game_Party_maxItems.apply(this, arguments);
        }
    };

    Game_Party.prototype.isOnlyOneItem = function(item) {
        const existMeta = !!item.meta[param.tagName];
        return !(param.condition === 'hasMeta' && !existMeta || param.condition === 'noMeta' && existMeta);
    };


    const _Window_ItemList_drawItemNumber = Window_ItemList.prototype.drawItemNumber;
    Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
        this._targetItem = item;
        _Window_ItemList_drawItemNumber.apply(this, arguments);
        this._targetItem = null;
    };


    const _Window_ItemList_needsNumber = Window_ItemList.prototype.needsNumber;
    Window_ItemList.prototype.needsNumber = function() {
        const result = _Window_ItemList_needsNumber.apply(this, arguments);
        if (!result || !this._targetItem || param.itemNumberHidden) {
            return result;
        } else {
            return !$gameParty.isOnlyOneItem(this._targetItem);
        }
    };
})();
