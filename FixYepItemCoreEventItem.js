//=============================================================================
// FixYepItemCoreEventItem.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/12/03 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc YEP_ItemCoreアイテム選択修正プラグイン
 * @author トリアコンタン
 *
 * @help YEP_ItemCore.jsを使用してアイテムの所持上限を設定した場合に
 * イベントのアイテム選択が一部正しく機能しなくなる問題を修正します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

var Imported = Imported || {};

(function() {
    'use strict';

    var _Window_EventItem_onOk = Window_EventItem.prototype.onOk;
    Window_EventItem.prototype.onOk = function() {
        var itemChoiceVariableId = $gameMessage.itemChoiceVariableId();
        _Window_EventItem_onOk.apply(this, arguments);
        if (Imported.YEP_ItemCore) {
            var item = this.item();
            var itemId = item ? item.baseItemId : 0;
            $gameVariables.setValue(itemChoiceVariableId, itemId);
        }
    };
})();

