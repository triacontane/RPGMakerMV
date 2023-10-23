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
(function() {
    var _Window_NumberInput_start = Window_NumberInput.prototype.start;
    Window_NumberInput.prototype.start = function() {
        _Window_NumberInput_start.call(this);
        this.setBackgroundType(2);
    };
})();