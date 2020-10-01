/*=============================================================================
 ChoiceCancelShowAlways.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/10/01 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ChoiceCancelShowAlwaysPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ChoiceCancelShowAlways.js
 * @author triacontane
 *
 * @help ChoiceCancelShowAlways.js 
 *
 * The cancel button is always displayed except when the event command
 * "Show Choices" has been set to "Prohibit" for the cancel choices.
 * (By default, this button is only shown when you select "Branch".
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 選択肢の表示におけるキャンセルボタンの常時表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ChoiceCancelShowAlways.js
 * @author トリアコンタン
 *
 * @help ChoiceCancelShowAlways.js
 *　
 * イベントコマンド『選択肢の表示』でキャンセル選択肢を『禁止』にした場合を除き
 * 常にキャンセルボタンを表示させます。
 * （デフォルトでは『分岐』にした場合のみ表示させます）
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Window_ChoiceList_needsCancelButton = Window_ChoiceList.prototype.needsCancelButton;
    Window_ChoiceList.prototype.needsCancelButton = function() {
        _Window_ChoiceList_needsCancelButton.apply(this, arguments);
        return $gameMessage.choiceCancelType() !== -1;
    };
})();
