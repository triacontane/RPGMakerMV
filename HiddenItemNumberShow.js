/*=============================================================================
 HiddenItemNumberShow.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/07/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 隠しアイテムの個数表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/HiddenItemNumberShow.js
 * @author トリアコンタン
 *
 * @help HiddenItemNumberShow.js
 *　
 * イベントコマンド『アイテム選択の処理』で
 * 隠しアイテムの個数を表示するよう仕様変更します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

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
