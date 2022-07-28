/*=============================================================================
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
=============================================================================*/

/*:
 * @plugindesc アイテム選択の処理で隠しアイテムの個数を表示
 * @target MZ
 * @author トリアコンタン
 *
 * @help
 *
 * イベントコマンド『アイテム選択の処理』で
 * 隠しアイテムの個数を表示するよう仕様変更します。
 */
(()=> {

    const _Window_EventItem_needsNumber = Window_EventItem.prototype.needsNumber;
    Window_EventItem.prototype.needsNumber = function() {
        const result = _Window_EventItem_needsNumber.apply(this, arguments);
        const itypeId = $gameMessage.itemChoiceItypeId();
        if (itypeId >= 3) {
            return true;
        } else {
            return result;
        }
    };
})();

